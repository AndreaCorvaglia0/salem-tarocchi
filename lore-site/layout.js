// A small force layout, used at build time (scripts/lore/site.mjs, the whole vault) and in the browser
// (the local graph of one note). Deterministic: same input, same positions. It runs a fixed number of
// iterations with a cooling step and then stops, so nothing moves once it is drawn.
//   layout(n, edges, { iterations, fixed, init, dist }) -> Float64Array [x0, y0, x1, y1, ...]
// n: number of nodes; edges: [[i, j], ...]; fixed: Set of indices that do not move; init: starting
// positions (Float64Array or null: a sunflower spiral); dist: the rest length of an edge; gravity: the pull
// to the centre (a node with no edges settles where it balances the push of all the others).

export function layout(n, edges, { iterations = 300, fixed = null, init = null, dist = 40, gravity = 0.02 } = {}) {
  const p = init ? Float64Array.from(init) : new Float64Array(2 * n);
  if (!init) for (let i = 0; i < n; i++) { const r = dist * 0.9 * Math.sqrt(i + 0.5), a = i * 2.39996323; p[2 * i] = r * Math.cos(a); p[2 * i + 1] = r * Math.sin(a); }
  if (n < 2) return p;
  const deg = new Float64Array(n);
  for (const [a, b] of edges) { deg[a]++; deg[b]++; }
  const d = new Float64Array(2 * n), k2 = dist * dist;
  let temp = dist * 2;
  const cool = Math.pow(0.02, 1 / Math.max(1, iterations)); // ends at 2% of the start
  for (let it = 0; it < iterations; it++) {
    d.fill(0);
    // repulsion between every pair (n is at most a few hundred)
    for (let i = 0; i < n; i++) {
      const xi = p[2 * i], yi = p[2 * i + 1];
      for (let j = i + 1; j < n; j++) {
        let dx = xi - p[2 * j], dy = yi - p[2 * j + 1], q = dx * dx + dy * dy;
        if (q < 0.01) { dx = ((i * 7 + j * 13) % 11) - 5 || 1; dy = ((i * 3 + j * 5) % 7) - 3 || 1; q = dx * dx + dy * dy; }
        const f = k2 / q;
        d[2 * i] += dx * f; d[2 * i + 1] += dy * f; d[2 * j] -= dx * f; d[2 * j + 1] -= dy * f;
      }
    }
    // springs along the edges, softer on hubs so they do not swallow their neighbours
    for (const [a, b] of edges) {
      const dx = p[2 * a] - p[2 * b], dy = p[2 * a + 1] - p[2 * b + 1], q = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const f = q / dist / Math.sqrt(Math.min(deg[a], deg[b]));
      d[2 * a] -= dx * f; d[2 * a + 1] -= dy * f; d[2 * b] += dx * f; d[2 * b + 1] += dy * f;
    }
    // a weak pull to the centre keeps islands and orphans in view
    for (let i = 0; i < n; i++) { d[2 * i] -= p[2 * i] * gravity; d[2 * i + 1] -= p[2 * i + 1] * gravity; }
    for (let i = 0; i < n; i++) {
      if (fixed && fixed.has(i)) continue;
      const dx = d[2 * i], dy = d[2 * i + 1], q = Math.sqrt(dx * dx + dy * dy) || 1, s = Math.min(q, temp) / q;
      p[2 * i] += dx * s; p[2 * i + 1] += dy * s;
    }
    temp *= cool;
  }
  return p;
}
