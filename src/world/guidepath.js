// Where the guide leads: the walkable path from (x, y) on a map to an anchor, or, if the anchor is
// on another map, to the door that starts the shortest way there (maps linked by their doors).
// Pure: the scene (scene/guide.js) and the tests use it.
import { MAPS, anchorOf } from './maps.js';
import { findPath, pathTiles } from './path.js';

// the first door of the shortest chain of doors from map `from` to map `to`
function firstDoor(from, to) {
  const maps = MAPS(), prev = new Map([[from, null]]), q = [from];
  while (q.length) {
    const id = q.shift();
    if (id === to) break;
    for (const d of maps[id].doors) {
      const next = d.to && anchorOf(d.to)?.map;
      if (!next || prev.has(next)) continue;
      prev.set(next, { id, d });
      q.push(next);
    }
  }
  if (!prev.has(to)) return null;
  let step = prev.get(to);
  while (step && step.id !== from) step = prev.get(step.id);
  return step?.d || null;
}

// -> { dest: [x, y], tiles: [[x, y], ...] } or null. free(x, y): extra check (people, gates).
export function guideRoute(map, x, y, ref, free = () => true) {
  const a = anchorOf(ref);
  if (!a) return null;
  let goal;
  if (a.map === map.id) goal = [a.x, a.y];
  else {
    const d = firstDoor(map.id, a.map);
    if (!d) return null;
    const da = map.anchors[d.anchor];
    goal = [da.x, da.y];
  }
  const ok = (tx, ty) => !map.isSolid(tx, ty) && map.at(tx, ty) !== '+' && free(tx, ty);
  const path = findPath(x, y, new Set([`${goal[0]},${goal[1]}`]), ok);
  if (!path) return { dest: goal, tiles: [] };
  return { dest: goal, tiles: pathTiles(x, y, path) };
}
