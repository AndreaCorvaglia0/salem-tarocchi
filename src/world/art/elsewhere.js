// The look of the worlds of Altrove (docs/DESIGN.md "Altrove"), all drawn in code:
//   clouds: a sky from pink to deep blue, cloud banks painted per set of tiles (each bridge is its own layer,
//           so the scene can melt it, firm it, or thin a tile of it), a floating door, a ladder that goes
//           nowhere, a tea table.
//   page:   cream paper, faint ruled lines, red margin rules, written lines (the only ground she walks on),
//           big letters, ink blots, an illuminated capital, the turned-down corner of the page.
// And two small things set in Salem: the green bottle, the open book.
import { makeCanvas, hexToRgb, hash, noise, fbm, rect, px, ellipse, line } from './px.js';

const T = 16;
const C = hexToRgb;
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const ramp = (cols, t) => { const n = cols.length - 1, i = Math.max(0, Math.min(n - 1e-6, t * n)), k = Math.floor(i); return lerp(cols[k], cols[k + 1], i - k); };
const put = (out, i, c, a = 255) => { out[i] = c[0]; out[i + 1] = c[1]; out[i + 2] = c[2]; out[i + 3] = a; };

// ---- the clouds ------------------------------------------------------------------------------------
export const SKY_COLS = ['#f7cfdc', '#e9c6e6', '#bcc4f1', '#7f93db', '#3a4ba3', '#1d2667'].map(C);
const CLOUD = { hi: C('#ffffff'), body: C('#fbf0f6'), mid: C('#f1dcea'), low: C('#dcc4e2'), rim: C('#a796cc') };

export function paintSky(map) {
  const W = map.W * T, H = map.H * T;
  const [c, ctx] = makeCanvas(W, H);
  const img = ctx.createImageData(W, H), out = img.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const n = fbm(x * 0.02, y * 0.05, 41, 3);
    let col = ramp(SKY_COLS, Math.min(1, Math.max(0, y / H + (n - 0.5) * 0.18)));
    // far wisps of cloud, very pale, drifting in long streaks
    const w = fbm(x * 0.012, y * 0.06, 7, 4);
    if (w > 0.62) col = lerp(col, CLOUD.body, Math.min(0.45, (w - 0.62) * 2.2));
    if (hash(x, y, 5) > 0.9993) col = lerp(col, CLOUD.hi, 0.8); // a glint of sun on a far drop
    put(out, (y * W + x) * 4, col);
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

// The cloud over the tiles where inSet(tx, ty) holds, inside the tile box [x0, y0, x1, y1] (padded by PAD px).
export const PAD = 6;
export function paintClouds(map, inSet, [x0, y0, x1, y1], seed = 1) {
  const W = (x1 - x0 + 1) * T + PAD * 2, H = (y1 - y0 + 1) * T + PAD * 2;
  const [c, ctx] = makeCanvas(W, H);
  const img = ctx.createImageData(W, H), out = img.data;
  const ox = x0 * T - PAD, oy = y0 * T - PAD;
  const at = (wx, wy) => inSet(Math.floor(wx / T), Math.floor(wy / T));
  const solid = (wx, wy) => {
    const dx = (noise(wx * 0.13, wy * 0.13, 11 + seed) - 0.5) * 9, dy = (noise(wx * 0.13 + 40, wy * 0.13 + 40, 23 + seed) - 0.5) * 9;
    return at(wx + dx, wy + dy) || (at(wx, wy) && at(wx + dx * 0.3, wy + dy * 0.3));
  };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const wx = ox + x, wy = oy + y;
    if (!solid(wx, wy)) continue;
    const up = !solid(wx, wy - 3), up1 = !solid(wx, wy - 1), down = !solid(wx, wy + 4), down1 = !solid(wx, wy + 1);
    const n = fbm(wx * 0.09, wy * 0.09, 3 + seed, 3);
    let col = ramp([CLOUD.low, CLOUD.mid, CLOUD.body, CLOUD.hi], Math.min(1, Math.max(0, 0.55 + (n - 0.5) * 1.1)));
    // round puffs: a soft light on the upper half of each little bump
    const p = noise(wx * 0.18, wy * 0.18, 61 + seed);
    if (p > 0.62) col = lerp(col, CLOUD.hi, 0.55);
    if (up) col = lerp(col, CLOUD.hi, up1 ? 0.95 : 0.6);
    if (down) col = lerp(col, CLOUD.low, down1 ? 0.9 : 0.55);
    if (down1) col = CLOUD.rim;
    put(out, (y * W + x) * 4, col);
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

// the brushes the scene uses on a cloud layer: a soft round hole, a tile's worth of thinning
export function holeBrush() {
  const [c, ctx] = makeCanvas(22, 22);
  for (let y = 0; y < 22; y++) for (let x = 0; x < 22; x++) {
    const d = Math.hypot(x - 10.5, y - 10.5) + (hash(x, y, 4) - 0.5) * 3;
    if (d < 10) { ctx.fillStyle = '#fff'; ctx.fillRect(x, y, 1, 1); }
  }
  return c;
}
export function thinBrush() {
  const [c, ctx] = makeCanvas(16, 16);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const d = Math.hypot(x - 7.5, y - 7.5);
    // a ragged patch: thinner in the middle, with a few holes of plain sky
    const a = Math.max(0, Math.min(1, (9.5 - d) / 4)) * (0.55 + noise(x * 0.5, y * 0.5, 9) * 0.45);
    if (a <= 0) continue;
    ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`; ctx.fillRect(x, y, 1, 1);
  }
  return c;
}
// the faint shimmer over a thin tile (blended additively, its alpha breathes)
export function shimmer() {
  const [c, ctx] = makeCanvas(16, 16);
  const dots = [[3, 4], [11, 3], [7, 8], [13, 11], [4, 12], [9, 13], [6, 2]];
  for (const [x, y] of dots) { px(ctx, x, y, '#ffffff'); px(ctx, x + 1, y, '#e8f4ff'); px(ctx, x, y + 1, '#e8f4ff'); }
  return c;
}

export const CLOUD_ART = {
  // a door on its own in the sky: frame, a pale blue door ajar, light in the crack, a puff at its foot
  skydoor(b) {
    const W = b.w * T, H = b.h * T + 10;
    const [c, ctx] = makeCanvas(W, H);
    rect(ctx, 1, 2, W - 2, H - 6, '#5b4a6a'); rect(ctx, 2, 3, W - 4, H - 8, '#f4eadf');
    rect(ctx, 3, 4, W - 6, H - 10, '#8fb2e6'); rect(ctx, 3, 4, 2, H - 10, '#b8d2f4');
    rect(ctx, W - 4, 4, 1, H - 10, '#fff6c8'); // light through the crack
    for (const y of [9, 20]) rect(ctx, 5, y, W - 9, 6, '#7aa0da');
    px(ctx, W - 6, Math.round(H / 2), '#e8c35a'); px(ctx, W - 6, Math.round(H / 2) + 1, '#a8822a');
    ellipse(ctx, W / 2, H - 4, 8, 3, '#ffffff'); ellipse(ctx, W / 2 - 4, H - 3, 4, 2, '#f1dcea');
    return { canvas: c, ox: 0 };
  },
  // a ladder leaning on nothing, fading into the sky at the top
  ladder(b) {
    const W = b.w * T + 4, H = b.h * T + 34;
    const [c, ctx] = makeCanvas(W, H);
    for (let y = 0; y < H - 2; y++) {
      const a = Math.min(1, y / 30);
      ctx.globalAlpha = a;
      rect(ctx, 3, y, 2, 1, '#8a5a3a'); rect(ctx, W - 5, y, 2, 1, '#8a5a3a');
      px(ctx, 3, y, '#b07a4e');
      if ((H - y) % 7 === 0) rect(ctx, 3, y, W - 6, 2, '#a06e48');
    }
    ctx.globalAlpha = 1;
    ellipse(ctx, W / 2, H - 3, 9, 3, '#ffffff');
    return { canvas: c, ox: 2 };
  },
  // a round tea table with a white cloth, a pink teapot, two cups and a cake
  teatable(b) {
    const W = b.w * T, H = b.h * T + 12;
    const [c, ctx] = makeCanvas(W, H);
    rect(ctx, W / 2 - 1, H - 10, 2, 8, '#6b4a3a');
    ellipse(ctx, W / 2, H - 13, 14, 5, '#d9cbe0'); ellipse(ctx, W / 2, H - 14, 14, 5, '#ffffff');
    for (let x = 3; x < W - 3; x += 3) px(ctx, x, H - 9, '#e7d8ee');
    ellipse(ctx, 11, H - 18, 4, 3, '#e98aab'); rect(ctx, 14, H - 20, 3, 1, '#e98aab'); px(ctx, 11, H - 22, '#b4567a'); // teapot
    rect(ctx, 19, H - 17, 3, 2, '#ffffff'); px(ctx, 22, H - 17, '#ffffff'); px(ctx, 20, H - 18, '#c9915a'); // a cup
    rect(ctx, 24, H - 15, 3, 2, '#ffffff'); px(ctx, 25, H - 16, '#c9915a');
    rect(ctx, 5, H - 15, 4, 2, '#f6e1a6'); rect(ctx, 5, H - 16, 4, 1, '#f39ab4'); px(ctx, 7, H - 17, '#d8364e'); // cake
    return { canvas: c, ox: 0 };
  },
};

// ---- the page --------------------------------------------------------------------------------------
const PAPER = ['#d9c79f', '#e6d6b0', '#efe3c3', '#f6edd4'].map(C);
const INKC = C('#2a2236'), INK2 = C('#4a3d58'), RULE = C('#b8c2d8'), MARGIN = C('#c2554a');

// One tile of a written line, as pixels (ink or not), for a neighbour mask: 1 up, 2 down, 4 left, 8 right.
// Horizontal: a band of small cursive (loops over a baseline); vertical: a stroke through the middle.
export function inkMask(mask, seed = 0) {
  const g = new Uint8Array(T * T);
  const set = (x, y, v = 1) => { if (x >= 0 && y >= 0 && x < T && y < T) g[y * T + x] = Math.max(g[y * T + x], v); };
  const horiz = mask & 12 || !(mask & 3);
  if (horiz) {
    const x0 = mask & 4 || !(mask & 8) ? 0 : 7, x1 = mask & 8 || !(mask & 4) ? 15 : 8;
    for (let x = x0; x <= x1; x++) {
      const base = 11 + Math.round((noise(x * 0.3, seed, 3) - 0.5) * 2);
      set(x, base, 2); set(x, base + 1, 1);
      const ph = hash(Math.floor(x / 3), seed, 7);
      const tall = ph > 0.8 ? 7 : ph > 0.35 ? 4 : 2;
      if (x % 3 !== 2) for (let k = 1; k <= tall * Math.abs(Math.sin((x + seed) * 1.05)); k++) set(x, base - k, 2);
    }
  }
  if (mask & 3) {
    const y0 = mask & 1 ? 0 : 8, y1 = mask & 2 ? 15 : 12;
    for (let y = y0; y <= y1; y++) { const dx = Math.round(Math.sin((y + seed) * 0.5)); set(7 + dx, y, 2); set(8 + dx, y, 2); set(9 + dx, y, 1); }
  }
  return g;
}
const inkInto = (out, W, ox, oy, mask, seed, alpha = 255) => {
  const g = inkMask(mask, seed);
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
    const v = g[y * T + x];
    if (!v) continue;
    const i = ((oy + y) * W + ox + x) * 4;
    put(out, i, v === 2 ? INKC : INK2, alpha);
  }
};
// the texture of one dynamic tile of a written line (the scene draws these as the line grows)
export function inkTile(mask, seed = 0) {
  const [c, ctx] = makeCanvas(T, T);
  const img = ctx.createImageData(T, T);
  inkInto(img.data, T, 0, 0, mask, seed);
  ctx.putImageData(img, 0, 0);
  return c;
}
export const inkMaskAt = (isInk, x, y) => (isInk(x, y - 1) ? 1 : 0) | (isInk(x, y + 1) ? 2 : 0) | (isInk(x - 1, y) ? 4 : 0) | (isInk(x + 1, y) ? 8 : 0);

export function paintPage(map) {
  const W = map.W * T, H = map.H * T;
  const [c, ctx] = makeCanvas(W, H);
  const img = ctx.createImageData(W, H), out = img.data;
  const isM = (tx, ty) => map.at(tx, ty) === 'm';
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const tx = Math.floor(x / T), ty = Math.floor(y / T);
    const n = fbm(x * 0.03, y * 0.03, 17, 4);
    let col = ramp(PAPER, Math.min(1, Math.max(0, 0.72 + (n - 0.5) * 0.5)));
    if (hash(x, y, 2) > 0.985) col = lerp(col, PAPER[0], 0.5); // fibres
    const stain = fbm(x * 0.012, y * 0.012, 29, 3);
    if (stain > 0.66) col = lerp(col, C('#cdb27e'), Math.min(0.35, (stain - 0.66) * 2));
    if (isM(tx, ty)) {
      col = lerp(col, PAPER[1], 0.5);
      const edge = Math.min(x, y, W - 1 - x, H - 1 - y);
      if (edge < 3) col = lerp(col, C('#8a7552'), (3 - edge) / 4); // the edge of the page, a little worn
    } else if (y % T === T - 2) col = lerp(col, RULE, 0.55); // the ruled lines
    put(out, (y * W + x) * 4, col);
  }
  // red margin rules beside the left margin
  for (let y = T; y < H - T; y++) for (const x of [T + 1, T + 3]) put(out, (y * W + x) * 4, lerp(MARGIN, PAPER[2], x === T + 3 ? 0.45 : 0.1));
  // the written lines of the map
  const isInk = (tx, ty) => map.at(tx, ty) === '-';
  for (let ty = 0; ty < map.H; ty++) for (let tx = 0; tx < map.W; tx++) if (isInk(tx, ty)) inkInto(out, W, tx * T, ty * T, inkMaskAt(isInk, tx, ty), tx * 7 + ty * 13);
  ctx.putImageData(img, 0, 0);
  // a page number at the foot
  ctx.fillStyle = '#6b5a48'; ctx.font = 'italic 9px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText(map.id === 'book2' ? '— 2 —' : '— 1 —', W / 2, H - 4);
  return c;
}

// the turned-down corner of the page (the door to the next page)
export function pageCorner() {
  const [c, ctx] = makeCanvas(T, T);
  // the fold: a triangle of the back of the page, with its shadow
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
    if (x >= y) { px(ctx, x, y, y === x ? '#8a7552' : (x + y) % 5 === 0 ? '#d9c79f' : '#e9dcbd'); }
    else if (x >= y - 3) px(ctx, x, y, '#00000033');
  }
  return c;
}

export const PAGE_ART = {
  // a big printed letter standing on the page
  glyph(b) {
    const W = b.w * T, H = b.h * T;
    const [c, ctx] = makeCanvas(W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.font = `bold ${Math.round(H * 1.05)}px Georgia, "Times New Roman", serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#00000022'; ctx.fillText(b.opts.ch || 'A', W / 2 + 2, H - 1);
    ctx.fillStyle = '#2a2236'; ctx.fillText(b.opts.ch || 'A', W / 2, H - 3);
    for (let i = 0; i < 5; i++) ellipse(ctx, Math.round(hash(i, b.x, 3) * W), Math.round(hash(b.y, i, 5) * H), 1, 1, '#2a2236');
    return { canvas: c, ox: 0 };
  },
  // a pool of ink: glossy, with drops around
  blot(b) {
    const W = b.w * T + 8, H = b.h * T + 4;
    const [c, ctx] = makeCanvas(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const d = Math.hypot((x - W / 2) / (W / 2 - 3), (y - H / 2) / (H / 2 - 2)) + (noise(x * 0.25, y * 0.25, b.x + b.y) - 0.5) * 0.5;
      if (d < 1) px(ctx, x, y, d < 0.35 && x < W / 2 && y < H / 2 ? '#4a4060' : '#1d1828');
    }
    ellipse(ctx, W / 2 - 4, H / 2 - 4, 3, 1, '#7d7396');
    for (let i = 0; i < 6; i++) px(ctx, Math.round(hash(i, b.x, 8) * W), Math.round(hash(b.y, i, 9) * H), '#1d1828');
    return { canvas: c, ox: 4 };
  },
  // the illuminated capital: a gold frame, a blue field with vines, a red letter, a little door at its foot
  capital(b) {
    const W = b.w * T, H = b.h * T + 6;
    const [c, ctx] = makeCanvas(W, H);
    rect(ctx, 0, 0, W, H, '#8a6a22'); rect(ctx, 1, 1, W - 2, H - 2, '#e2b64a'); rect(ctx, 3, 3, W - 6, H - 6, '#8a6a22');
    rect(ctx, 4, 4, W - 8, H - 8, '#26407e');
    for (let i = 0; i < 70; i++) { // vines
      const t = i / 70, x = 6 + ((Math.sin(t * 19) + 1) / 2) * (W - 12), y = 6 + t * (H - 14);
      px(ctx, x, y, '#5f9a5a'); if (i % 6 === 0) { px(ctx, x + 1, y, '#d9566a'); px(ctx, x, y - 1, '#f0c25a'); }
    }
    ctx.imageSmoothingEnabled = true;
    ctx.font = `bold ${Math.round(H * 0.82)}px Georgia, "Times New Roman", serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#5a1420'; ctx.fillText(b.opts.ch || 'C', W / 2 + 1, H * 0.72 + 1);
    ctx.fillStyle = '#c8322e'; ctx.fillText(b.opts.ch || 'C', W / 2, H * 0.72);
    ctx.imageSmoothingEnabled = false;
    // the little door, arched, at the foot
    const dx = Math.round(W / 2) - 5;
    rect(ctx, dx, H - 15, 10, 12, '#e2b64a'); rect(ctx, dx + 1, H - 14, 8, 11, '#3a2318'); rect(ctx, dx + 2, H - 15, 6, 1, '#e2b64a');
    px(ctx, dx + 7, H - 9, '#f0c25a');
    return { canvas: c, ox: 0 };
  },
};

// ---- the two things in Salem ---------------------------------------------------------------------
export function bottleArt() {
  const [c, ctx] = makeCanvas(8, 13);
  rect(ctx, 3, 0, 2, 2, '#9a6a3a'); rect(ctx, 3, 2, 2, 2, '#2f7a4a');
  rect(ctx, 1, 4, 6, 8, '#1f5a36'); rect(ctx, 2, 5, 4, 6, '#3fbf6a'); rect(ctx, 2, 5, 1, 4, '#b8f5c8');
  rect(ctx, 1, 12, 6, 1, '#0f2a1a');
  return c;
}
export function openBookArt() {
  const [c, ctx] = makeCanvas(16, 10);
  rect(ctx, 0, 2, 16, 8, '#5a2a2a');
  rect(ctx, 1, 1, 7, 8, '#f3e8cc'); rect(ctx, 8, 1, 7, 8, '#efe1bf'); rect(ctx, 7, 1, 2, 8, '#d9c79f');
  for (const y of [3, 5, 7]) { line(ctx, 2, y, 6, y, '#6b5a48'); line(ctx, 9, y, 13, y, '#6b5a48'); }
  return c;
}

// all block painters of the worlds of Altrove (art/blocks.js merges them)
export const ELSEWHERE = { ...CLOUD_ART, ...PAGE_ART };
