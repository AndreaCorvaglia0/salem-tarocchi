// The pixel world: registers the world services (docs/CONTRACT.md) and owns the Phaser game.
//   world.start()        creates the game in #game at state.pos or the chapter's start
//   world.travel(anchor) moves the player to an anchor on any map
//   world.where()        { map, x, y, near }
//   world.anchors()      { 'village.square': { map, x, y, label }, ... }
//   world.refresh()      re-reads CAST and the state (the world also listens to step, flag, chapter)
//   world.guide(anchor)  a trail of lights to an anchor (null: off); bus 'hint' { id: 'move' | 'action' } once each
//   world.ahead(n)       screen point of the n-th tile of the trail (the move hint's tap marker)
//   world.sensed()       what the sixth sense feels: [{ kind: 'card' | 'chest', id, anchor, map, x, y, dist }]
//   world.canFly()       { ok, why }: why 'inside' | 'under' | 'fog' | 'cell' | 'busy' | 'seen' (world.where() also says fog)
//   world.fly(anchor)    the broom: true if she flew (only to a seen outdoor anchor, from where she may take off)
//   world.travel(anchor, { by: 'broom' }) the same check through travel
import Phaser from 'phaser';
import { provide } from '../core/services.js';
import { state } from '../core/state.js';
import { getMap, allAnchors, anchorOf, nearAnchor, CHAPTER_START } from './maps.js';
import { WorldScene } from './scene/World.js';
import { mountControls } from './controls.js';
import { senseRadius } from '../core/progress.js';
import { sensedFrom } from './hidden.js';
import { flyFrom, canLandOn } from './fly.js';

let game = null, guideRef = null, missionRef = null;
const scene = () => game?.scene.getScene('World') || null;
const live = () => { const s = scene(); return s && s.sys.isActive() ? s : null; };

function startPoint() {
  const p = state.pos;
  if (p && getMap(p.map)) return { map: p.map, x: p.x, y: p.y };
  const a = anchorOf(CHAPTER_START[state.chapter] || CHAPTER_START[1]);
  return { map: a.map, x: a.x, y: a.y };
}

export function start() {
  if (game) return Promise.resolve();
  const parent = document.getElementById('game') || document.body;
  return new Promise((resolve) => {
    const controls = mountControls({ onAct: () => live()?.inputs.queueAct(), onStun: () => live()?.stun() });
    game = new Phaser.Game({
      type: Phaser.AUTO, parent, backgroundColor: '#07060c', pixelArt: true, roundPixels: true, antialias: false,
      scale: { mode: Phaser.Scale.RESIZE, width: parent.clientWidth || innerWidth, height: parent.clientHeight || innerHeight },
      input: { activePointers: 2 }, banner: false, disableContextMenu: true,
      fps: { target: 60, min: 5, limit: navigator.webdriver ? 30 : 0 }, // headless screenshots need idle time
    });
    game.registry.set('controls', controls);
    game.registry.set('guide', guideRef);
    game.registry.set('mission', missionRef);
    game.events.once('world:ready', () => resolve());
    game.scene.add('World', WorldScene, true, { ...startPoint(), arrived: true });
  });
}

export function travel(ref, opts = {}) {
  if (opts?.by === 'broom') return fly(ref);
  const s = live();
  if (s) return s.travel(ref, true).then(() => undefined);
  const a = anchorOf(ref);
  if (a) state.pos = { map: a.map, x: a.x, y: a.y };
  return Promise.resolve();
}

export function where() {
  const s = live();
  const p = s ? { map: s.map.id, x: s.player.tx, y: s.player.ty } : state.pos || startPoint();
  return { ...p, near: nearAnchor(p.map, p.x, p.y), fog: !!getMap(p.map)?.fogAt(p.x, p.y) };
}

// the sixth sense: hidden Major spots and unopened chests within senseRadius (every map at the top)
export function sensed() {
  if (!state.powers.sense) return [];
  return sensedFrom(state, where(), senseRadius());
}
export function canFly() {
  if (!state.powers.broom) return { ok: false, why: 'broom' };
  const s = live(), w = where();
  const busy = !!s && (s.busy > 0 || s.leaving);
  const seen = !!s && s.patrols.some((q) => (q.noticed || 0) > 0);
  return flyFrom({ ...w, busy, seen });
}
export async function fly(ref) {
  if (!canFly().ok || !canLandOn(ref, state.stats.seen || {})) return false;
  await travel(ref);
  return true;
}

export const anchors = () => Object.fromEntries(Object.entries(allAnchors()).map(([k, a]) => [k, { map: a.map, x: a.x, y: a.y, label: a.label }]));

provide('world.start', start);
provide('world.travel', travel);
provide('world.where', () => Promise.resolve(where()));
provide('world.anchors', () => Promise.resolve(anchors()));
provide('world.sensed', () => Promise.resolve(sensed()));
provide('world.canFly', () => Promise.resolve(canFly()));
provide('world.fly', (ref) => fly(ref));
// The sieve: where the nearest hidden card of this map lies, from where she stands (null: none here).
export function hint() {
  const s = live();
  if (!s) return null;
  const p = s.player;
  let best = null;
  for (const c of s.things.activeCards()) { const d = Math.hypot(c.x - p.tx, c.y - p.ty); if (!best || d < best.dist) best = { dx: c.x - p.tx, dy: c.y - p.ty, dist: d, id: c.card.id }; }
  return best;
}
provide('world.hint', () => Promise.resolve(hint()));
// The guide: a trail of small lights to an anchor (null: off). It stays on across maps.
export function guide(ref) {
  guideRef = ref || null;
  game?.registry.set('guide', guideRef);
  live()?.guide.set(ref || null);
  return Promise.resolve();
}
provide('world.guide', guide);
// The mission's target (tracked side mission or main step), even when no trail shows: the world uses its
// way to tell whether a new place is off the beaten track (Tartufo finds treats there).
export function mission(ref) {
  missionRef = ref || null;
  game?.registry.set('mission', missionRef);
  live()?.setMission(missionRef);
  return Promise.resolve();
}
provide('world.mission', mission);
// Where on screen (CSS px) the tile n steps ahead on the guide's trail is, or on the road ahead when
// no trail is on; null when the world is not running. For the move hint's tap marker (ui/hint.js).
export function ahead(n = 4) {
  const s = live();
  if (!s) return null;
  const path = s.guide?.path || [];
  const t = path.length ? path[Math.min(n, path.length) - 1] : null;
  if (!t) return null;
  const cam = s.cameras.main, v = cam.worldView, z = cam.zoom, r = s.game.canvas.getBoundingClientRect();
  return { x: r.left + (t[0] * 16 + 8 - v.x) * z, y: r.top + (t[1] * 16 + 8 - v.y) * z };
}
provide('world.ahead', (n) => Promise.resolve(ahead(n)));
provide('world.refresh', () => { live()?.refresh(); return Promise.resolve(); });

// For harness pages and screenshots only.
export const debug = { scene: live, game: () => game, travel, where, anchors, hint, guide, ahead, sensed, canFly, fly };
