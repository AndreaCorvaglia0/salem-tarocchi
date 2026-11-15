// Small painting helpers for the illustrated register (adapted from Mnemopolis paint.js): canvases,
// gradients, soft lights, a cheap grain. Everything is drawn in code.
export const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; return [c, g]; };
export const rnd = (seed) => { let a = seed >>> 0 || 1; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
export const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); for (const [t, c] of stops) gr.addColorStop(t, c); return gr; };
export const rad = (g, x, y, r0, r1, stops, x1 = x, y1 = y) => { const gr = g.createRadialGradient(x, y, r0, x1, y1, r1); for (const [t, c] of stops) gr.addColorStop(t, c); return gr; };
// a soft additive light
export function glow(g, x, y, r, rgb, a = 1, comp = 'lighter') {
  if (a <= 0.003 || r <= 0) return;
  g.save(); g.globalCompositeOperation = comp;
  g.fillStyle = rad(g, x, y, 0, r, [[0, `rgba(${rgb},${Math.min(1, a)})`], [0.45, `rgba(${rgb},${Math.min(1, a) * 0.3})`], [1, `rgba(${rgb},0)`]]);
  g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
}
// a path through points with smooth curves (Catmull-Rom as Beziers)
export function smooth(g, pts, close = false) {
  const n = pts.length, P = (i) => pts[close ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    g.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  if (close) g.closePath();
}
// a grain tile with alpha speckle: drawn source-over, cheap on phones
let tile = null;
export function grain(g, W, H, a = 0.06, t = 0) {
  if (!tile) {
    const [c, tg] = canvas(192, 192), img = tg.createImageData(192, 192), r = rnd(9);
    for (let i = 0; i < img.data.length; i += 4) { const v = r() < 0.5 ? 255 : 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = r() * 255; }
    tg.putImageData(img, 0, 0); tile = c;
  }
  const ox = Math.floor((t * 977) % 192), oy = Math.floor((t * 613) % 192);
  g.save(); g.globalAlpha = a; g.translate(-ox, -oy); g.fillStyle = g.createPattern(tile, 'repeat'); g.fillRect(0, 0, W + 192, H + 192); g.restore();
}
