// Where the broom may take off and land, as far as the world knows (docs/DESIGN.md "La scopa"):
// only outdoors (not in rooms, not underground), never in thick fog, never from the cell. The glue
// adds what the world cannot see (a script running, a patrol that has seen her). Pure: node.
import { getMap, anchorOf } from './maps.js';

export const CELL = ['depths.jail', 'depths.cells'];
// -> { ok, why }: why is a code: 'inside' | 'under' | 'fog' | 'cell' | 'busy' | 'seen' | 'nomap'
export function flyFrom({ map, x, y, near = null, busy = false, seen = false }) {
  const m = getMap(map);
  if (!m) return { ok: false, why: 'nomap' };
  if (CELL.includes(near)) return { ok: false, why: 'cell' };
  if (m.inside) return { ok: false, why: 'inside' };
  if (!m.open) return { ok: false, why: 'under' };
  if (m.fogAt(x, y)) return { ok: false, why: 'fog' };
  if (seen) return { ok: false, why: 'seen' };
  if (busy) return { ok: false, why: 'busy' };
  return { ok: true, why: '' };
}
// a landing place: an anchor she has seen, outdoors, not in thick fog
export function canLandOn(ref, seen = {}) {
  const a = anchorOf(ref), m = a && getMap(a.map);
  return !!m && m.open && !m.fogAt(a.x, a.y) && !!seen[ref];
}
