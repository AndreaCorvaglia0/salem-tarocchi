// The live visit to a world of Altrove, on the world's side (no Phaser): what the scene's rule reads when it
// is (re)built — a page turn restarts the scene — and the places the glue waits for her to reach.
// glue/elsewhere.js drives it through the services in world/index.js (`world.elsewhere`).
import { newCloudState, key } from './elsewhere.rules.js';

export const live = {
  on: false, world: null, maxFalls: 3, falls: 0,
  cloud: newCloudState(), // clouds: chosen bridges, thin tiles, holes
  ink: {}, // page: map id -> Set of written tiles (beyond the map's own lines)
  words: {}, // page: fork anchor -> the word written in its blank
  texts: {}, // page: fork anchor -> the sentence painted on the floor (with ___ for the blank)
  last: null, // clouds: the last landing tile she stood on { map, x, y }
  wait: null, // { ref, r, resolve, reject }
  target: null, // the anchor that glows (where to go next)
};

export function begin(world, { maxFalls = 3, texts = {} } = {}) {
  Object.assign(live, { on: true, world, maxFalls, falls: 0, cloud: newCloudState(), ink: {}, words: {}, texts: { ...texts }, last: null, wait: null, target: null });
}
export function finish() {
  if (live.wait) live.wait.reject?.({ abort: 'left' });
  Object.assign(live, { on: false, world: null, wait: null, target: null });
}
export const inkOf = (mapId) => live.ink[mapId] || (live.ink[mapId] = new Set());
export const addInk = (mapId, tiles) => { const s = inkOf(mapId); for (const [x, y] of tiles) s.add(key(x, y)); };

// Resolve when she stands within r tiles (Chebyshev) of anchor `ref` ({ map, x, y } from maps.js).
export function waitAt(a, r = 1) {
  if (live.wait) live.wait.reject?.({ abort: 'replaced' });
  return new Promise((resolve, reject) => { live.wait = { a, r, resolve, reject }; live.target = a; });
}
export function stepped(mapId, x, y) {
  const w = live.wait;
  if (!w || w.a.map !== mapId || Math.max(Math.abs(w.a.x - x), Math.abs(w.a.y - y)) > w.r) return false;
  live.wait = null; live.target = null;
  w.resolve(true);
  return true;
}
// a fall: counted; at the limit the visit ends (whoever waits is told)
export function fell() {
  live.falls += 1;
  if (live.falls >= live.maxFalls && live.wait) { const w = live.wait; live.wait = null; live.target = null; w.reject({ abort: 'falls' }); }
  return live.falls;
}
