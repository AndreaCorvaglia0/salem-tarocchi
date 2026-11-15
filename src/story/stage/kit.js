// Small pure helpers for the shadow theatre (no DOM at import time): seeded random, easing, smooth
// noise, and toPath(), which turns a list of points into SVG path data (Catmull-Rom curves; a point
// written [x, y, 1] is a sharp corner). Silhouettes, symbols and cameos are all made with it.
export const rnd = (seed) => { let a = seed >>> 0 || 1; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const easeOut = (t) => 1 - (1 - clamp(t)) ** 3;
// a smooth wobble in -1..1 made of incommensurate sines: cheap and never repeating visibly
export const wob = (t, s = 0) => (Math.sin(t * 1.13 + s) * 0.5 + Math.sin(t * 2.71 + s * 1.7) * 0.3 + Math.sin(t * 5.31 + s * 2.3) * 0.2);

const f = (n) => (Math.round(n * 100) / 100).toString();

// points -> path data. closed: Z at the end. tension 1 = classic Catmull-Rom.
export function toPath(pts, closed = true, tension = 1) {
  const n = pts.length;
  if (n < 2) return '';
  const P = (i) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  const k = tension / 6;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

// transform a point list: scale, mirror, move
export const tf = (pts, { x = 0, y = 0, s = 1, sx = s, sy = s, flip = false, rot = 0 } = {}) => pts.map(([px, py, c]) => {
  let X = (flip ? -px : px) * sx, Y = py * sy;
  if (rot) { const cs = Math.cos(rot), sn = Math.sin(rot); [X, Y] = [X * cs - Y * sn, X * sn + Y * cs]; }
  return c ? [X + x, Y + y, 1] : [X + x, Y + y];
});

// simple shapes as path data
export const ellipse = (cx, cy, rx, ry = rx) => `M${f(cx - rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(cy)}Z`;
export const rect = (x, y, w, h) => `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
export const poly = (pts) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;

// a tapered stroke along a polyline (a branch, a broom stick, a tendril) as a closed outline
export function taper(line, w0, w1 = w0 * 0.15) {
  const n = line.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = line[Math.max(0, i - 1)], b = line[Math.min(n - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const len = Math.hypot(nx, ny) || 1; nx /= len; ny /= len;
    const w = lerp(w0, w1, i / Math.max(1, n - 1)) / 2;
    L.push([line[i][0] + nx * w, line[i][1] + ny * w]); R.push([line[i][0] - nx * w, line[i][1] - ny * w]);
  }
  const tip = line[n - 1];
  return toPath([...L, [tip[0], tip[1]], ...R.reverse()].map((p, i, arr) => (i === 0 || i === arr.length - 1 ? [p[0], p[1], 1] : p)), true, 0.8);
}

// a spiral tendril (the curls of Reiniger's foliage): from (x, y), heading a, curling by `curl`
export function tendril(x, y, a, len, curl, steps = 18) {
  const pts = [[x, y]];
  let ang = a, step = len / steps;
  for (let i = 0; i < steps; i++) { ang += curl * (0.4 + i / steps); x += Math.cos(ang) * step; y += Math.sin(ang) * step; step *= 0.93; pts.push([x, y]); }
  return pts;
}

// a quick validator for path data made here (used by tests): commands and numbers only, finite
export function validPath(d) {
  if (typeof d !== 'string' || !/^M/.test(d)) return false;
  const toks = d.match(/[MLCQAZHVmlcqazhv]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  if (toks.join('').length !== d.replace(/[\s,]/g, '').length) return false;
  return toks.every((t) => /[A-Za-z]/.test(t) || Number.isFinite(Number(t)));
}
