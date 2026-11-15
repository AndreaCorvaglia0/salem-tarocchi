// The pixel world: registers the world services (docs/CONTRACT.md) and owns the Phaser game.
//   world.start()        creates the game in #game at state.pos or the chapter's start
//   world.travel(anchor) moves the player to an anchor on any map
//   world.where()        { map, x, y, near }
//   world.anchors()      { 'village.square': { map, x, y, label }, ... }
//   world.refresh()      re-reads CAST and the state (the world also listens to step, flag, chapter)
import Phaser from 'phaser';
import { provide } from '../core/services.js';
import { state } from '../core/state.js';
import { getMap, allAnchors, anchorOf, nearAnchor, CHAPTER_START } from './maps.js';
import { WorldScene } from './scene/World.js';
import { mountControls } from './controls.js';

let game = null;
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
    game.events.once('world:ready', () => resolve());
    game.scene.add('World', WorldScene, true, { ...startPoint(), arrived: true });
  });
}

export function travel(ref) {
  const s = live();
  if (s) return s.travel(ref).then(() => undefined);
  const a = anchorOf(ref);
  if (a) state.pos = { map: a.map, x: a.x, y: a.y };
  return Promise.resolve();
}

export function where() {
  const s = live();
  const p = s ? { map: s.map.id, x: s.player.tx, y: s.player.ty } : state.pos || startPoint();
  return { ...p, near: nearAnchor(p.map, p.x, p.y) };
}

export const anchors = () => Object.fromEntries(Object.entries(allAnchors()).map(([k, a]) => [k, { map: a.map, x: a.x, y: a.y, label: a.label }]));

provide('world.start', start);
provide('world.travel', travel);
provide('world.where', () => Promise.resolve(where()));
provide('world.anchors', () => Promise.resolve(anchors()));
provide('world.refresh', () => { live()?.refresh(); return Promise.resolve(); });

// For harness pages and screenshots only.
export const debug = { scene: live, game: () => game, travel, where, anchors };
