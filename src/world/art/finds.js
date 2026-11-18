// What lies on the ground for the albums (src/data/world/finds.js): a small stone, a lost figure of the
// peddler's sibyl, or two or three figures tied with string. Drawn in code like the rest of the world
// (art/herbs.js): a soft dark rim keeps them readable under the night tint, and they stay small and quiet,
// nothing like the golden glint of a tarot card.
//   makeFinds(scene)        registers 'find-stone-<id>', 'find-card', 'find-bundle2', 'find-bundle3'
//   paintStone(look, w, h)  a stone as a canvas (also the album's picture of the stones with no old plate)
import { makeCanvas, hash, mix, addTex } from './px.js';

const RIM = 'rgba(18,15,28,0.55)';

const inPoly = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
// the shape of a stone in a box [-1, 1] x [-1, 1] (y down)
const SHAPES = {
  round: (u, v) => u * u / 0.92 + v * v / 0.7 <= 1 && v > -0.85,
  holed: (u, v) => u * u / 0.95 + v * v / 0.72 <= 1 && (u + 0.05) ** 2 / 0.09 + (v + 0.05) ** 2 / 0.08 > 1,
  flat: (u, v) => Math.abs(u) + Math.abs(v) * 1.25 + 0.18 * Math.sin(u * 5 + v * 3) <= 1.05 && v > -0.6,
  point: (u, v) => Math.abs(u) <= 0.5 && v >= -1 + Math.abs(u) * 0.9 && v <= 0.95,
  prism: (u, v) => Math.abs(u) <= 0.42 && v >= -0.95 + Math.abs(u) * 0.5 && v <= 0.95,
  // a broken chunk of glass: five sharp corners
  shard: (u, v) => inPoly(u, v, [[-0.9, 0.75], [-0.62, -0.45], [0.05, -0.95], [0.88, -0.25], [0.72, 0.78]]),
};

// A stone painted on a w x h canvas: lit from the top left, a dark rim, a glint; bands, spots or a sheen
// when its look asks for them. Deterministic (hash), so the same stone always looks the same.
export function paintStone(look, w, h, seed = 7) {
  const [c, ctx] = makeCanvas(w, h);
  const [dk, md, lt, gl] = look.pal, inside = SHAPES[look.shape] || SHAPES.round;
  const at = (x, y) => inside(((x + 0.5) / w) * 2 - 1, ((y + 0.5) / h) * 2 - 1);
  const put = (x, y, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); };
  const big = w >= 24;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!at(x, y)) continue;
    const u = ((x + 0.5) / w) * 2 - 1, v = ((y + 0.5) / h) * 2 - 1;
    const edge = !at(x - 1, y) || !at(x + 1, y) || !at(x, y - 1) || !at(x, y + 1);
    let l = -0.55 * u - 0.75 * v + (hash(x, y, seed) - 0.5) * (big ? 0.35 : 0.25);
    if (look.shape === 'point' || look.shape === 'prism') l = (u < -0.05 ? 0.55 : u < 0.2 ? 0.1 : -0.45) - 0.35 * v + (hash(x, y, seed) - 0.5) * 0.2; // faces
    if (look.shape === 'shard') { const r = Math.hypot(u + 0.55, v + 0.1); l = -0.6 * u - 0.5 * v - 0.4 + (Math.round(r * (big ? 7 : 3)) % 2 ? 0.55 : 0) + (hash(x, y, seed) - 0.5) * 0.1; } // conchoidal ripples
    let col = l > 0.45 ? lt : l < -0.3 ? dk : md;
    if (look.stripes) { const k = Math.sin((u * 0.4 + v) * (big ? 11 : 6) + Math.sin(u * 3) * 0.8); if (k > 0.55) col = mix(col, look.stripes, 0.6); else if (k < -0.6) col = mix(col, dk, 0.4); }
    if (look.bands) { const r = Math.hypot(u * 1.1, v * 1.4); if (Math.round(r * (big ? 9 : 4)) % 2 === 0 && r < 0.9) col = mix(col, look.bands, 0.55); }
    if (look.spots && hash(x, y, seed + 3) > (big ? 0.93 : 0.86)) col = look.spots;
    if (look.shape === 'prism' && x % 2 === 0) col = mix(col, '#000000', 0.25); // the long grooves
    if (look.sheen) { const d = Math.hypot(u + 0.15, v + 0.25); if (d < 0.45) col = mix(col, look.sheen, 0.6 * (1 - d / 0.45)); }
    if (edge) col = mix(dk, '#000000', 0.25);
    put(x, y, col);
  }
  // the glint: a pixel (or a small cross on the big picture) on the lit shoulder
  const gx = Math.round(w * 0.32), gy = Math.round(h * 0.3);
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    if (Math.abs(dx) + Math.abs(dy) > (big ? 1 : 0)) continue;
    const x = gx + dx * Math.max(1, Math.round(w / 22)), y = gy + dy * Math.max(1, Math.round(h / 22));
    if (at(x, y) && !(!at(x - 1, y) || !at(x + 1, y))) put(x, y, gl);
  }
  return c;
}

// a canvas with a 1 px soft dark rim around what is drawn on src (like art/herbs.js)
function rimmed(src) {
  const [c, ctx] = makeCanvas(src.width + 2, src.height + 2);
  const d = src.getContext('2d').getImageData(0, 0, src.width, src.height).data;
  ctx.fillStyle = RIM;
  for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) {
    if (d[(y * src.width + x) * 4 + 3] < 10) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ctx.fillRect(x + 1 + dx, y + 1 + dy, 1, 1);
  }
  ctx.drawImage(src, 1, 1);
  return c;
}

// one figure lying on the ground: cream paper, a red border and a coloured blot for the picture
function card(ctx, x, y, tilt = 0, hue = '#6a8a5a') {
  const P = '#efe2c4', B = '#b85a48', S = '#8a7a64';
  const w = 6, h = 8;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const xx = x + i + Math.round(tilt * (j - h / 2) / h), yy = y + j;
    const border = i === 0 || j === 0 || i === w - 1 || j === h - 1;
    ctx.fillStyle = border ? B : j >= 2 && j <= 4 && i >= 2 && i <= 3 ? hue : j === 6 ? S : P;
    ctx.fillRect(xx, yy, 1, 1);
  }
}
function bundle(n) {
  const [c, ctx] = makeCanvas(14, 11);
  const hues = ['#6a8a5a', '#4a6a9a', '#b07a3a'];
  for (let i = 0; i < n; i++) card(ctx, 2 + i * 2, 2 - (i % 2), i - 1, hues[i % 3]);
  // the string: a pale cross over the middle
  ctx.fillStyle = '#d8c8a0';
  for (let x = 1; x < 13; x++) ctx.fillRect(x, 6, 1, 1);
  ctx.fillRect(6, 9, 1, 1); ctx.fillRect(7, 10, 1, 1);
  return c;
}

export function makeFinds(scene, stones = []) {
  const T = scene.textures;
  for (const s of stones) {
    const key = `find-stone-${s.id}`;
    if (!T.exists(key)) addTex(scene, key, rimmed(paintStone(s.look, 9, 7, s.id.length)));
  }
  // the twinkle: a small pale cross, much smaller and paler than the tarot cards' golden star (fx-glint)
  if (!T.exists('find-twinkle')) {
    const [c, ctx] = makeCanvas(5, 5);
    ctx.fillStyle = 'rgba(255,251,234,0.55)'; for (const [x, y] of [[2, 0], [0, 2], [4, 2], [2, 4]]) ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = '#fffbea'; for (const [x, y] of [[2, 1], [1, 2], [2, 2], [3, 2], [2, 3]]) ctx.fillRect(x, y, 1, 1);
    addTex(scene, 'find-twinkle', c);
  }
  if (!T.exists('find-card')) { const [c, ctx] = makeCanvas(9, 10); card(ctx, 1, 1, 1); addTex(scene, 'find-card', rimmed(c)); }
  if (!T.exists('find-bundle2')) addTex(scene, 'find-bundle2', rimmed(bundle(2)));
  if (!T.exists('find-bundle3')) addTex(scene, 'find-bundle3', rimmed(bundle(3)));
}
