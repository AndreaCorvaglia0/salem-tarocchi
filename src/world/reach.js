// Where she can walk with the powers she has: a search over every map at once, through doors whose
// condition holds, past gates that are open, past obstacles only with their magic, and never through
// thick fog without the Air (stun). Used by the tests (every Major spot reachable at the level the
// story needs) and by the Minors simulation (routes across maps). Pure: runs in node.
import { MAPS, anchorOf } from './maps.js';
import { test as cond } from '../core/cond.js';
import { fresh } from '../core/state.js';

export const NEED = { brambles: 'fire', roots: 'move', stone: 'move' };
// thick fog without the Air: sight closes in over the first steps, and after LOST steps she is back at the edge
export const FOG = { closeIn: 3, lost: 8 };
const K = (m, x, y) => `${m},${x},${y}`;
// an anchor ref ('forest.mill') or a place { map, x, y }
const A = (r) => (typeof r === 'string' ? anchorOf(r) : r);

// a plain state for a chapter and a set of powers (flags: e.g. 'shop.open')
export const stateWith = ({ chapter = 1, powers = {}, flags = {}, step = 'x', opened = {} } = {}) => {
  const s = fresh();
  return { ...s, chapter, step, powers: { ...s.powers, ...powers }, flags: { ...flags }, world: { ...s.world, opened: { ...opened } } };
};

// can a tile be walked on in state s (gates, obstacles, fog)? '+' tiles are handled by the caller
export function passable(m, x, y, s) {
  if (m.isSolid(x, y) || m.at(x, y) === '+') return false;
  if (m.gates.some((g) => g.x === x && g.y === y && !cond(g.when, s))) return false;
  if (m.obstacles.some((o) => o.x === x && o.y === y && !s.world.opened[o.id] && !s.powers[o.need])) return false;
  if (m.fogAt(x, y) && !s.powers.stun) return false;
  return true;
}

// Breadth-first search from an anchor. -> Map key -> previous key (null at the start).
export function explore(from, s) {
  const maps = MAPS(), a = A(from);
  const prev = new Map([[K(a.map, a.x, a.y), null]]), q = [[a.map, a.x, a.y]];
  for (let i = 0; i < q.length; i++) {
    const [mid, x, y] = q[i], m = maps[mid], here = K(mid, x, y);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      let to = null;
      const d = m.doors.find((dd) => dd.x === nx && dd.y === ny);
      if (d) { if (d.to && cond(d.when, s)) { const t = anchorOf(d.to); to = [t.map, t.x, t.y]; } }
      else if (passable(m, nx, ny, s)) to = [mid, nx, ny];
      if (!to) continue;
      const k = K(...to);
      if (prev.has(k)) continue;
      prev.set(k, here); q.push(to);
    }
  }
  return prev;
}

// is an anchor (or a tile next to a solid thing: a chest) within reach?
export const reached = (prev, ref) => { const a = A(ref); return !!a && prev.has(K(a.map, a.x, a.y)); };
export const besideReached = (prev, map, x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => prev.has(K(map, x + dx, y + dy)));

// the tiles of the walk from one anchor to another: [[map, x, y], ...] (empty when unreachable)
export function route(from, to, s) {
  const prev = explore(from, s), b = A(to);
  let k = K(b.map, b.x, b.y);
  if (!prev.has(k)) return [];
  const out = [];
  for (; k; k = prev.get(k)) { const [m, x, y] = k.split(','); out.unshift([m, Number(x), Number(y)]); }
  return out;
}
