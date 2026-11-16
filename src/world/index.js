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
//   world.escape({ from?, to, seconds? }) a pursuer behind her, a place ahead to reach: 'safe' | 'caught'
//   world.travel({ map, x, y })  an exact place (the way back from Altrove)
//   world.elsewhere(cmd, arg)    the live visit to a world of Altrove (glue/elsewhere.js): see below
import Phaser from 'phaser';
import { provide } from '../core/services.js';
import { state } from '../core/state.js';
import { getMap, allAnchors, anchorOf, nearAnchor, CHAPTER_START } from './maps.js';
import { WorldScene } from './scene/World.js';
import { mountControls } from './controls.js';
import { senseRadius } from '../core/progress.js';
import { sensedFrom } from './hidden.js';
import { flyFrom, canLandOn } from './fly.js';
import { runEscape } from './escape.js';
import { live as away, begin as awayBegin, finish as awayFinish, waitAt, addInk, inkOf } from './elsewhere.session.js';
import { chooseBridge, planWrite } from './elsewhere.rules.js';
import { TRINKETS } from './scene/elsewhere.js';

let game = null, guideRef = null, missionRef = null;
const scene = () => game?.scene.getScene('World') || null;
const live = () => { const s = scene(); return s && s.sys.isActive() ? s : null; };

function startPoint() {
  const p = state.pos;
  // never start inside a world of Altrove: a visit does not survive a reload (glue/elsewhere.js puts her back)
  if (p && getMap(p.map) && !getMap(p.map).elsewhere) return { map: p.map, x: p.x, y: p.y };
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
  const a = ref && typeof ref === 'object' ? ref : anchorOf(ref);
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
  if (getMap(w.map)?.elsewhere) return { ok: false, why: 'inside' }; // no broom in Altrove
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
// Someone who stops her in the street (glue/street.js): spec { who, label, run } puts them on a road tile
// near her (true) unless she is indoors, busy, or a patrol is near (false); null sends them away.
// world.stranger() with no argument: is someone there now?
export function stranger(spec) {
  const s = live();
  if (!s) return false;
  if (spec === undefined) return s.stranger.here;
  if (s.away && spec) return false; // nobody from Salem walks in Altrove
  if (spec === null) { s.stranger.hide(); return false; }
  return s.stranger.show(spec);
}
provide('world.stranger', (spec) => Promise.resolve(stranger(spec)));
// The escape of a trial (src/world/escape.js): a pursuer behind her, a glowing place ahead. -> 'safe' | 'caught'
export async function escape({ from = null, to = 'auto', seconds = null } = {}) {
  if (from) await travel(from);
  const s = live();
  return s ? runEscape(s, { to, seconds }) : 'safe';
}
provide('world.escape', (o) => escape(o || {}));
provide('world.refresh', () => { live()?.refresh(); return Promise.resolve(); });

// ---- Altrove: the live visit (src/world/elsewhere.session.js; rules in elsewhere.rules.js) ----------
//   ('begin', { world, maxFalls, texts })   a new visit (texts: fork anchor -> sentence with ___)
//   ('end')                                 the visit is over
//   ('wait', anchor)  -> Promise            resolves when she reaches it (r 1); rejects { abort: 'falls' }
//   ('open', { map, fork, option, ok })     clouds: a fork's bridge opens, the others melt (resolves when shown)
//   ('write', { map, fork, word, to, from? }) page: the word in the fork's blank and a line on to `to`
//                                           (an anchor or a fork whose sentence it joins); `from` an anchor
//                                           instead of the fork (after a blot). -> the tiles, or null
//   ('falls') -> n   ('state') -> the live visit   ('trinkets', list) the things in Salem that start a visit
const sameMap = (mapId) => { const s = live(); return s && s.map.id === mapId ? s : null; };
export async function elsewhere(cmd, arg = {}) {
  if (cmd === 'begin') { awayBegin(arg.world, arg); return true; }
  if (cmd === 'end') { awayFinish(); return true; }
  if (cmd === 'falls') return away.falls;
  if (cmd === 'state') return away;
  if (cmd === 'trinkets') { TRINKETS.splice(0, TRINKETS.length, ...(arg || [])); live()?.trinkets?.refresh?.(); return true; }
  if (cmd === 'wait') { const a = anchorOf(arg); if (!a) return true; const p = waitAt(a, 1); const s = live(); if (s && s.map.id === a.map) s.rule?.arrived?.(s.player.tx, s.player.ty); return p; }
  if (cmd === 'open') {
    const map = getMap(arg.map);
    const next = chooseBridge(map, away.cloud, arg.fork, arg.option, arg.ok, { seed: arg.seed || 1 });
    away.cloud = { chosen: next.chosen, thin: next.thin, holes: next.holes };
    await sameMap(arg.map)?.rule?.do('open', { ...arg, added: next.added });
    return next.added;
  }
  if (cmd === 'write') {
    const map = getMap(arg.map);
    const tiles = planWrite(map, arg, new Set(inkOf(map.id)));
    if (!tiles) { console.warn('[world] elsewhere: no line from', arg.fork || arg.from, 'to', arg.to); return null; }
    if (arg.fork && arg.word) away.words[arg.fork] = arg.word;
    addInk(map.id, tiles);
    await sameMap(arg.map)?.rule?.do('write', { ...arg, tiles });
    return tiles;
  }
  return null;
}
provide('world.elsewhere', (cmd, arg) => elsewhere(cmd, arg));

// For harness pages and screenshots only.
export const debug = { scene: live, stranger, game: () => game, travel, where, anchors, hint, guide, ahead, sensed, canFly, fly };
