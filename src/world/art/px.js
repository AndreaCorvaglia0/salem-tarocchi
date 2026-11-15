// Small pixel-art helpers (adapted from Mnemopolis art/px.js): canvases, colours, noise, shapes,
// and registering canvases as crisp Phaser textures.
export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return [c, ctx];
}
export const hexToRgb = (hex) => { const n = parseInt(hex.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const rgbToHex = ([r, g, b]) => '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => { const A = hexToRgb(a), B = hexToRgb(b); return rgbToHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]); };
export const shade = (c, t) => (t < 0 ? mix(c, '#000000', -t) : mix(c, '#ffffff', t));

// Deterministic integer hash -> [0, 1)
export function hash(x, y, seed = 0) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return ((h >>> 0) % 100000) / 100000;
}
export function noise(x, y, seed = 0) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const s = (t) => t * t * (3 - 2 * t);
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed), c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  const u = s(xf), v = s(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, y, seed = 0, oct = 3) {
  let v = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { v += amp * noise(x * f, y * f, seed + i * 17); norm += amp; amp *= 0.5; f *= 2; }
  return v / norm;
}
export function rect(ctx, x, y, w, h, col) {
  ctx.fillStyle = col;
  const x0 = Math.round(x), y0 = Math.round(y);
  ctx.fillRect(x0, y0, Math.round(x + w) - x0, Math.round(y + h) - y0);
}
export function px(ctx, x, y, col) { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); }
export function ellipse(ctx, cx, cy, rx, ry, col) {
  ctx.fillStyle = col;
  for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); ctx.fillRect(cx - w, cy + y, w * 2 + 1, 1); }
}
export function line(ctx, x0, y0, x1, y1, col) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
  for (let i = 0; i <= n; i++) px(ctx, x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, col);
}
export function radial(size, stops) {
  const [c, ctx] = makeCanvas(size, size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([t, col]) => g.addColorStop(t, col));
  ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
  return c;
}
// Draw rows of characters; '.' is empty.
export function drawRows(ctx, rows, pal, ox = 0, oy = 0, flip = false) {
  rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const ch = row[x]; if (ch === '.' || ch === ' ') continue; px(ctx, ox + (flip ? row.length - 1 - x : x), oy + y, pal[ch] || '#ff00ff'); } });
}
export function addTex(scene, key, canvas, smooth = false) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.addCanvas(key, canvas);
  tex.setFilter(smooth ? 0 : 1);
  return tex;
}
export function addSheet(scene, key, canvas, fw, fh) {
  const tex = addTex(scene, key, canvas);
  const cols = Math.floor(canvas.width / fw), rows = Math.floor(canvas.height / fh);
  let i = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) tex.add(i++, 0, c * fw, r * fh, fw, fh);
  return tex;
}
