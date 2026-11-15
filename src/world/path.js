// Shortest walks on the tile grid (breadth first, four directions). Pure: the tap-to-walk, the
// patrols and the tests use it. ok(x, y) says whether a tile can be stepped on.
export const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// Returns the list of directions from (sx, sy) to the first goal reached, or null.
// goals: a Set of "x,y" keys. limit: the most tiles explored.
export function findPath(sx, sy, goals, ok, { limit = 20000 } = {}) {
  const start = `${sx},${sy}`;
  if (goals.has(start)) return [];
  const prev = new Map([[start, null]]);
  const q = [[sx, sy]];
  for (let i = 0; i < q.length && i < limit; i++) {
    const [x, y] = q[i];
    for (const [d, [dx, dy]] of Object.entries(DIRS)) {
      const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
      if (prev.has(k)) continue;
      const goal = goals.has(k);
      if (!goal && !ok(nx, ny)) continue;
      prev.set(k, [`${x},${y}`, d]);
      if (goal) {
        const path = [];
        for (let c = k; prev.get(c); c = prev.get(c)[0]) path.unshift(prev.get(c)[1]);
        return path;
      }
      q.push([nx, ny]);
    }
  }
  return null;
}

// The tiles a path visits, from the tile after the start.
export function pathTiles(sx, sy, path) {
  const out = [];
  let x = sx, y = sy;
  for (const d of path) { x += DIRS[d][0]; y += DIRS[d][1]; out.push([x, y]); }
  return out;
}
