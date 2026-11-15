// The shapes the smoke can take: simple strokes in a -1..1 box (y down). Pure data.
//   SYMBOLS[name] = [polyline, ...]   sampleSymbol(name, n) -> n points spread evenly along the strokes
const arc = (cx, cy, r, a0, a1, n = 28, ry = r) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * ry]; });
const TAU = Math.PI * 2;
const star = (n, r1, r2, rot = -Math.PI / 2) => { const pts = []; for (let i = 0; i <= n * 2; i++) { const a = rot + (i * Math.PI) / n, r = i % 2 ? r2 : r1; pts.push([Math.cos(a) * r, Math.sin(a) * r]); } return pts; };

export const SYMBOLS = {
  moon: [arc(0, 0, 0.85, Math.PI * 0.32, Math.PI * 1.68), arc(0.38, 0, 0.62, Math.PI * 0.62, Math.PI * 1.38)],
  star: [star(8, 0.9, 0.34, -Math.PI / 2)],
  eye: [arc(0, 0.62, 1.05, Math.PI * 1.2, Math.PI * 1.8, 24), arc(0, -0.62, 1.05, Math.PI * 0.2, Math.PI * 0.8, 24), arc(0, 0, 0.3, 0, TAU, 20)],
  key: [arc(-0.55, 0, 0.32, 0, TAU, 22), [[-0.23, 0], [0.9, 0]], [[0.62, 0], [0.62, 0.3]], [[0.82, 0], [0.82, 0.24]]],
  wheel: [arc(0, 0, 0.85, 0, TAU, 40), arc(0, 0, 0.18, 0, TAU, 12), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * TAU; return [[Math.cos(a) * 0.18, Math.sin(a) * 0.18], [Math.cos(a) * 0.85, Math.sin(a) * 0.85]]; })],
  tower: [[[-0.4, 0.95], [-0.32, -0.6], [-0.42, -0.6], [-0.42, -0.85], [-0.22, -0.85], [-0.22, -0.72], [-0.06, -0.72], [-0.06, -0.85], [0.1, -0.85], [0.1, -0.72], [0.26, -0.72], [0.26, -0.85], [0.42, -0.85], [0.42, -0.6], [0.32, -0.6], [0.4, 0.95]],
    [[0.55, -0.95], [0.18, -0.4], [0.42, -0.36], [0.02, 0.2]]],
  sun: [arc(0, 0, 0.42, 0, TAU, 28), ...Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * TAU; return [[Math.cos(a) * 0.58, Math.sin(a) * 0.58], [Math.cos(a) * (i % 2 ? 0.8 : 0.95), Math.sin(a) * (i % 2 ? 0.8 : 0.95)]]; })],
  cup: [[[-0.55, -0.7], [-0.5, -0.25], [-0.3, 0.05], [0, 0.12], [0.3, 0.05], [0.5, -0.25], [0.55, -0.7]], [[-0.55, -0.7], [0.55, -0.7]], [[0, 0.12], [0, 0.65]], [[-0.4, 0.8], [-0.15, 0.65], [0.15, 0.65], [0.4, 0.8]]],
  sword: [[[0, -0.95], [0.1, -0.75], [0.1, 0.4], [-0.1, 0.4], [-0.1, -0.75], [0, -0.95]], [[-0.42, 0.42], [0.42, 0.42]], [[0, 0.42], [0, 0.82]], arc(0, 0.9, 0.08, 0, TAU, 10)],
  wand: [[[-0.6, 0.9], [0.55, -0.85]], [[0.3, -0.48], [0.62, -0.42], [0.72, -0.6]], [[-0.1, 0.12], [-0.42, 0.06], [-0.55, 0.22]], [[0.18, -0.3], [0.1, -0.58], [0.25, -0.75]]],
  coin: [arc(0, 0, 0.85, 0, TAU, 40), star(5, 0.62, 0.24, -Math.PI / 2)],
};
export const SYMBOL_NAMES = Object.keys(SYMBOLS);

export function sampleSymbol(name, n = 200) {
  const strokes = SYMBOLS[name] || SYMBOLS.star, segs = [];
  let total = 0;
  for (const s of strokes) for (let i = 0; i < s.length - 1; i++) { const len = Math.hypot(s[i + 1][0] - s[i][0], s[i + 1][1] - s[i][1]); segs.push([s[i], s[i + 1], total, len]); total += len; }
  const out = [];
  for (let k = 0; k < n; k++) {
    const d = ((k + 0.5) / n) * total;
    const seg = segs.find(([, , at, len]) => d >= at && d <= at + len) || segs[segs.length - 1];
    const u = seg[3] ? (d - seg[2]) / seg[3] : 0;
    out.push([seg[0][0] + (seg[1][0] - seg[0][0]) * u, seg[0][1] + (seg[1][1] - seg[0][1]) * u]);
  }
  return out;
}
