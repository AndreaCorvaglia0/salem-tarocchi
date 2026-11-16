// The own rules of the worlds of Altrove (docs/DESIGN.md "Altrove"). Pure: no Phaser, no DOM; the scene
// (scene/elsewhere.js), the glue (glue/elsewhere.js) and the tests use them.
//
// CLOUDS — thin cloud. Map chars (data/world/clouds.js): 'l' cloud, 'u' thin cloud, digits = bridges.
//   A bridge belongs to a fork and an option. Before she asks the cards at a fork its bridges are closed;
//   after, the chosen one is open and the others are gone. A right choice gives a solid bridge; a wrong one
//   gives a bridge with thin patches, always with a solid way across for a careful eye. Stepping on a thin
//   tile she falls: one fall counted, the tile becomes a hole, she lands back on the last landing tile.
// PAGE — written lines. Map chars (data/world/book*.js): '-' a written line, '.' paper, 'm' margin.
//   She walks only on written lines. At a fork (a sentence ending at the fork's anchor, with a blank two
//   tiles wide right after it) the chosen word is written in the blank and the line goes on: to the next
//   sentence if right, into a blot if wrong (then, after the blot, on to the next sentence).
import { findPath } from './path.js';

export const key = (x, y) => `${x},${y}`;
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const h32 = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + s * 982451653) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// ---- clouds -----------------------------------------------------------------------------------------
export const bridgeOf = (ch) => (ch >= '1' && ch <= '9' ? { fork: Math.floor((ch.charCodeAt(0) - 49) / 3), option: (ch.charCodeAt(0) - 49) % 3 } : null);
// Map 'fork:option' -> [[x, y], ...]
export function bridges(map) {
  const out = new Map();
  for (let y = 0; y < map.H; y++) for (let x = 0; x < map.W; x++) {
    const b = bridgeOf(map.at(x, y));
    if (!b) continue;
    const k = `${b.fork}:${b.option}`;
    if (!out.has(k)) out.set(k, []);
    out.get(k).push([x, y]);
  }
  return out;
}
export const forkOptions = (map, fork) => [...bridges(map).keys()].map((k) => k.split(':').map(Number)).filter(([f]) => f === fork).map(([, o]) => o).sort();
// the anchors a fork goes from and to: forkN -> forkN+1, the last one -> exit
export function forkEnds(map, fork) {
  const from = map.anchors[`${map.id}.fork${fork + 1}`];
  const to = map.anchors[`${map.id}.fork${fork + 2}`] || map.anchors[`${map.id}.exit`];
  return { from, to };
}
export const newCloudState = () => ({ chosen: {}, thin: new Set(), holes: new Set() });

// can she stand on (x, y) now
export function cloudOpen(map, s, x, y) {
  if (s.holes.has(key(x, y))) return false;
  const ch = map.at(x, y), b = bridgeOf(ch);
  if (b) return s.chosen[b.fork] === b.option;
  return ch === 'l' || ch === 'u';
}
export const cloudThin = (map, s, x, y) => !s.holes.has(key(x, y)) && (map.at(x, y) === 'u' || s.thin.has(key(x, y)));
export const isLanding = (map, x, y) => map.at(x, y) === 'l';

// Is there a way from a to b on solid tiles (no thin, no hole), with the given state?
export function solidWay(map, s, a, b) {
  return !!findPath(a.x, a.y, new Set([key(b.x, b.y)]), (x, y) => cloudOpen(map, s, x, y) && !cloudThin(map, s, x, y), { limit: 5000 });
}

// The thin tiles of the bridge chosen at a fork: none when right. When wrong: about `share` of its tiles,
// at least one, picked in a fixed scattered order, each kept only if a solid way across still remains.
export function thinTiles(map, fork, option, ok, { share = 0.3, seed = 1, state = newCloudState() } = {}) {
  if (ok) return [];
  const tiles = bridges(map).get(`${fork}:${option}`) || [];
  const { from, to } = forkEnds(map, fork);
  const s = { chosen: { ...state.chosen, [fork]: option }, thin: new Set(state.thin), holes: new Set(state.holes) };
  const order = tiles.slice().sort((p, q) => h32(p[0], p[1], seed + fork) - h32(q[0], q[1], seed + fork));
  const want = Math.max(1, Math.round(tiles.length * share)), out = [];
  for (const [x, y] of order) {
    if (out.length >= want) break;
    s.thin.add(key(x, y));
    if (from && to && solidWay(map, s, from, to)) out.push([x, y]); else s.thin.delete(key(x, y));
  }
  return out;
}
// what a choice at a fork does to the state (pure: returns a new state)
export function chooseBridge(map, s, fork, option, ok, opts = {}) {
  const thin = thinTiles(map, fork, option, ok, { ...opts, state: s });
  return { chosen: { ...s.chosen, [fork]: option }, thin: new Set([...s.thin, ...thin.map(([x, y]) => key(x, y))]), holes: new Set(s.holes), added: thin };
}

// ---- the page ---------------------------------------------------------------------------------------
export const isInkCh = (ch) => ch === '-';
// she can stand on (x, y): a written line of the map, or one written since (ink: Set of keys for this map)
export const inkOpen = (map, ink, x, y) => isInkCh(map.at(x, y)) || !!ink?.has(key(x, y));
// the blank after a fork's sentence: the two tiles right of its anchor
export const blankOf = (a) => [[a.x + 1, a.y], [a.x + 2, a.y]];
// the sentence of a fork: the written tiles of its row joined to the anchor (from its left end to it)
export function lineOf(map, a) {
  const out = [];
  for (let x = a.x; isInkCh(map.at(x, a.y)); x--) out.unshift([x, a.y]);
  return out;
}
// every tile next to a door: a written line never passes there unless it goes to that door's anchor
const doorSides = (map) => { const s = new Set(); for (const d of map.doors) for (const [dx, dy] of N4) s.add(key(d.x + dx, d.y + dy)); return s; };

// A line written from `from` ([x, y]) to the first of `goals` ([[x, y]]): the cheapest way over paper,
// preferring long straight strokes and the horizontal (it reads like writing), never through other written
// lines (except a goal), the reserved tiles (other forks' blanks), letters, blots, margins, or beside a door.
// -> [[x, y], ...] (without `from`, ending on the goal), or null.
export function inkRoute(map, from, goals, { ink = new Set(), reserved = new Set() } = {}) {
  const G = new Set(goals.map(([x, y]) => key(x, y)));
  const near = doorSides(map);
  const free = (x, y) => {
    const k = key(x, y);
    if (G.has(k)) return true;
    if (map.at(x, y) !== '.' || map.isSolid(x, y) || ink.has(k) || reserved.has(k)) return false;
    return !near.has(k);
  };
  const W = map.W, start = [from[0], from[1], -1];
  const dist = new Map([[`${from[0]},${from[1]},-1`, 0]]), prev = new Map();
  const open = [[0, ...start]];
  while (open.length) {
    let bi = 0; for (let i = 1; i < open.length; i++) if (open[i][0] < open[bi][0]) bi = i;
    const [d, x, y, dir] = open.splice(bi, 1)[0];
    const sk = `${x},${y},${dir}`;
    if (d > (dist.get(sk) ?? Infinity)) continue;
    if (G.has(key(x, y)) && !(x === from[0] && y === from[1])) {
      const path = [];
      for (let c = sk; prev.has(c); c = prev.get(c)) { const [px, py] = c.split(',').map(Number); path.unshift([px, py]); }
      return path;
    }
    N4.forEach(([dx, dy], nd) => {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= map.H || !free(nx, ny)) return;
      // touching another written line from the side is allowed but costs (lines stay apart)
      const crowd = N4.some(([ex, ey]) => { const k = key(nx + ex, ny + ey); return (ink.has(k) || isInkCh(map.at(nx + ex, ny + ey))) && !G.has(k) && !(nx + ex === x && ny + ey === y); }) ? 2 : 0;
      const c = d + (dy ? 1.3 : 1) + (dir >= 0 && dir !== nd ? 0.9 : 0) + crowd;
      const k2 = `${nx},${ny},${nd}`;
      if (c < (dist.get(k2) ?? Infinity)) { dist.set(k2, c); prev.set(k2, sk); open.push([c, nx, ny, nd]); }
    });
  }
  return null;
}
// The line a chosen word writes at a fork: the blank first, then on to the goals. -> tiles or null
export function writeLine(map, forkAnchor, goals, opts = {}) {
  const blank = blankOf(forkAnchor);
  if (!blank.every(([x, y]) => map.at(x, y) === '.')) return null;
  const ink = new Set(opts.ink || []);
  const r = inkRoute(map, blank[1], goals, { ...opts, ink });
  return r ? [...blank, ...r] : null;
}

// What world.elsewhere('write') draws on a page map, pure: { fork?, from?, to } are anchor refs of this map
// (fork: the word's fork, the line starts in its blank; from: a blot, the line goes on from there; to: the
// next fork, whose sentence it joins, or a single place). ink: the tiles written so far. -> tiles or null
export function planWrite(map, { fork = null, from = null, to }, ink = new Set()) {
  const A = map.anchors, t = A[to];
  if (!t) return null;
  const line = lineOf(map, t), goals = line.length ? line : [[t.x, t.y]];
  const reserved = new Set();
  for (const [ref, a] of Object.entries(A)) if (/\.fork\d$/.test(ref) && ref !== fork) for (const [x, y] of blankOf(a)) reserved.add(key(x, y));
  if (from) { const f = A[from]; return f ? inkRoute(map, [f.x, f.y], goals, { ink, reserved }) : null; }
  const f = A[fork];
  return f ? writeLine(map, f, goals, { ink, reserved }) : null;
}
