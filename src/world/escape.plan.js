// The escape's pure planning (src/world/escape.js runs it on the scene): where the pursuer starts, how fast he
// walks, how long she has. Tested in tests/trials.escape.test.mjs.
import { DIRS } from './path.js';

export const T = 16, PLAYER_STEP = 165; // ms per tile when she walks (scene/World.js SPEED)
export const HESITATE = 8000, GAP = 6, AUTO_DIST = 14, MIN_PURSUER_STEP = 500;

// Breadth-first distances from (x, y) over walkable tiles: Map 'x,y' -> steps (up to max).
export function distances(x, y, ok, max = 60) {
  const d = new Map([[`${x},${y}`, 0]]), q = [[x, y]];
  for (let i = 0; i < q.length; i++) {
    const [cx, cy] = q[i], n = d.get(`${cx},${cy}`);
    if (n >= max) continue;
    for (const [dx, dy] of Object.values(DIRS)) {
      const nx = cx + dx, ny = cy + dy, k = `${nx},${ny}`;
      if (d.has(k) || !ok(nx, ny)) continue;
      d.set(k, n + 1); q.push([nx, ny]);
    }
  }
  return d;
}
const keyXY = (k) => k.split(',').map(Number);

// plan({ px, py, ok, target?: [x, y] }) -> { target: [x, y], start: [x, y], gap, dist, stepMs, seconds } or null.
// The target: given, or the reachable tile nearest to AUTO_DIST steps (ties: the farthest straight line).
// The pursuer starts GAP steps behind her, on the side away from the target. Its step: HESITATE / gap, so
// that if she stands still it reaches her in about HESITATE ms; she walks a tile in PLAYER_STEP ms, many
// times faster, so walking straight always makes it. The time: three times the walk, plus ten seconds.
export function plan({ px, py, ok, target = null, seconds = null }) {
  const fromHer = distances(px, py, ok, 80);
  let tgt = target;
  if (!tgt) {
    let best = null;
    for (const [k, n] of fromHer) {
      const [x, y] = keyXY(k), score = Math.abs(n - AUTO_DIST) * 10 - Math.hypot(x - px, y - py);
      if (n >= AUTO_DIST - 4 && (!best || score < best.score)) best = { x, y, score };
    }
    if (!best) for (const [k, n] of fromHer) { const [x, y] = keyXY(k); if (!best || n > best.n) best = { x, y, n }; }
    if (!best) return null;
    tgt = [best.x, best.y];
  }
  const dist = fromHer.get(`${tgt[0]},${tgt[1]}`);
  if (dist == null) return null;
  const toTarget = distances(tgt[0], tgt[1], ok, 120);
  let start = null;
  for (const [k, n] of fromHer) {
    if (n < GAP - 1 || n > GAP + 1) continue;
    const [x, y] = keyXY(k), away = toTarget.get(k) ?? 0;
    if (!start || away > start.away || (away === start.away && n === GAP)) start = { x, y, n, away };
  }
  if (!start) { // a cramped place: the farthest tile she can reach that is not the target
    for (const [k, n] of fromHer) { const [x, y] = keyXY(k); if ((x !== tgt[0] || y !== tgt[1]) && n > 1 && (!start || n > start.n)) start = { x, y, n, away: 0 }; }
  }
  if (!start) return null;
  const gap = start.n;
  const stepMs = Math.max(MIN_PURSUER_STEP, Math.round(HESITATE / Math.max(1, gap)));
  const secs = seconds || Math.ceil((dist * PLAYER_STEP * 3) / 1000) + 10;
  return { target: tgt, start: [start.x, start.y], gap, dist, stepMs, seconds: secs };
}
// walking straight: she needs dist * PLAYER_STEP; the pursuer needs (gap + dist) * stepMs to reach the target
export const straightMakesIt = (p) => p.dist * PLAYER_STEP < p.seconds * 1000 && p.dist * PLAYER_STEP < (p.gap + p.dist) * p.stepMs;

