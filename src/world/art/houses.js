// Buildings of Salem, drawn in code: dark clapboard houses with steep roofs (snow in winter), lit
// or dark windows, a curtained window, a kitchen sill with a glass, the cottage at the edge of the
// woods, the black shop. Each painter returns { canvas, over, windows, smoke }:
//   over: px the picture rises above the block's footprint; windows: [{ x, y, lit }] in px from the
//   picture's top left (the scene adds a glow); smoke: [x, y] of a chimney top, or null.
import { SEASONS, M, INK } from './palette.js';
import { makeCanvas, hash, noise, rect, px, line, shade } from './px.js';

export function windowAt(ctx, x, y, w, h, state, extra = {}) {
  rect(ctx, x - 1, y - 1, w + 2, h + 2, INK);
  if (state === 'lit' || state === 'curtain' || state === 'dim') {
    const L = M.lit;
    rect(ctx, x, y, w, h, state === 'dim' ? M.litDim : L[0]);
    rect(ctx, x + 1, y + 1, w - 2, h - 2, state === 'dim' ? L[0] : L[1]);
    if (state !== 'dim') rect(ctx, x + 1, y + 1, Math.max(1, (w >> 1) - 1), Math.max(1, (h >> 1) - 1), L[2]);
  } else {
    rect(ctx, x, y, w, h, M.dark[0]);
    px(ctx, x + w - 2, y + 1, '#3a4766'); px(ctx, x + w - 3, y + 2, '#2a3450');
  }
  rect(ctx, x + (w >> 1), y, 1, h, INK); // mullions
  rect(ctx, x, y + (h >> 1), w, 1, INK);
  if (state === 'curtain') { // a dark violet drape, almost closed: something behind it
    const C = M.cloth.violet;
    rect(ctx, x, y, w, h, C[1]); rect(ctx, x + 2, y, 1, h, C[2]); rect(ctx, x + w - 3, y, 1, h, C[0]);
    rect(ctx, x + (w >> 1) - 1, y + 1, 2, h - 2, M.lit[1]); // a slit of light
    rect(ctx, x - 1, y - 2, w + 2, 1, M.wood[1]);
  }
  rect(ctx, x - 2, y + h + 1, w + 4, 2, M.wood[2]); rect(ctx, x - 2, y + h + 1, w + 4, 1, M.wood[3]); // sill
  if (extra.snow) rect(ctx, x - 2, y + h + 1, w + 4, 1, extra.snow);
  if (extra.glass) { // a wine glass on the sill, catching the moon
    const gx = x + w - 3, gy = y + h - 4;
    px(ctx, gx, gy, '#cfe3f5'); px(ctx, gx + 2, gy, '#cfe3f5'); px(ctx, gx + 1, gy + 1, '#8f2a3a'); px(ctx, gx, gy + 1, '#cfe3f5'); px(ctx, gx + 2, gy + 1, '#cfe3f5');
    px(ctx, gx + 1, gy + 2, '#cfe3f5'); px(ctx, gx + 1, gy + 3, '#cfe3f5'); rect(ctx, gx, gy + 4, 3, 1, '#cfe3f5'); px(ctx, gx, gy, '#ffffff');
  }
}

function door(ctx, x, y, w, h, color = M.wood, knob = '#c9a55a') {
  rect(ctx, x - 1, y - 1, w + 2, h + 1, INK);
  rect(ctx, x, y, w, h, color[1]);
  for (let i = 1; i < w; i += 3) rect(ctx, x + i, y, 1, h, color[0]);
  rect(ctx, x, y, w, 1, color[2]);
  px(ctx, x + w - 3, y + (h >> 1), knob);
  rect(ctx, x - 2, y + h, w + 4, 1, M.stone[2]); // step
}

// A gabled roof seen from the front: shingle rows, a ridge, snow and icicles in winter.
function roof(ctx, x0, y0, w, h, pal, S, { moss = false } = {}) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const row = Math.floor(y / 3), off = row % 2 ? 2 : 0;
    const seam = (x + off) % 5 === 0 || y % 3 === 0;
    let col = pal[1];
    if (seam) col = pal[0];
    else if (hash(Math.floor((x + off) / 5), row, 4) > 0.7) col = pal[2];
    if (y < 2) col = y === 0 ? INK : pal[2];
    if (y === h - 1) col = INK;
    if (x === 0 || x === w - 1) col = INK;
    if (moss && hash(x >> 1, y >> 1, 9) > 0.8 && y > 1) col = '#3c5a33';
    px(ctx, x0 + x, y0 + y, col);
  }
  if (S.snow) snowCap(ctx, x0, y0, w, h, S, 0.68);
}

// Snow on a roof: thick near the ridge, thinning towards the eave with a ragged edge; icicles.
export function snowCap(ctx, x0, y0, w, h, S, frac) {
  for (let x = 1; x < w - 1; x++) {
    const depth = Math.round(h * frac + (noise(x * 0.12, y0 * 0.1 + x0, 3) - 0.5) * 6 + (hash(x, 0, 7) > 0.7 ? 1 : 0));
    for (let y = 1; y < Math.min(h - 2, depth); y++) {
      if (y > depth - 3 && hash(x, y, 4) > 0.75) continue; // shingles peek through at the edge
      px(ctx, x0 + x, y0 + y, y === depth - 1 ? S.snowShade : y < 3 ? '#f4f8ff' : hash(x, y, 9) > 0.93 ? S.snowShade : S.snow);
    }
    if (hash(x, 1, 5) > 0.8) { const len = 1 + Math.floor(hash(x, 2, 5) * 3); for (let k = 0; k < len; k++) px(ctx, x0 + x, y0 + h + k, k === len - 1 ? '#9fb3cf' : '#d8e4f2'); }
  }
}

function clapboard(ctx, x0, y0, w, h, pal = M.clap) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let col = y % 4 === 0 ? pal[0] : y % 4 === 1 ? pal[2] : pal[1];
    if (x === 0 || x === w - 1) col = INK;
    else if (x === 1 || x === w - 2) col = pal[3]; // corner boards
    px(ctx, x0 + x, y0 + y, col);
  }
  rect(ctx, x0, y0 + h - 2, w, 2, pal[0]);
}

function chimney(ctx, x, y, S) {
  rect(ctx, x, y, 6, 12, INK); rect(ctx, x + 1, y + 1, 4, 11, M.stone[2]); rect(ctx, x + 1, y + 4, 4, 1, M.stone[1]); rect(ctx, x + 1, y + 8, 4, 1, M.stone[1]);
  rect(ctx, x - 1, y, 8, 2, INK); rect(ctx, x, y, 6, 1, S.snow || M.stone[3]);
  return [x + 3, y - 1];
}

export function house(b, season) {
  const S = SEASONS[season], o = b.opts, T = 16;
  const W = b.w * T, over = 14, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = Math.min(34, Math.round(b.h * T * 0.48)), fy = H - fh;
  const pal = M.roof[o.roof] || M.roof.slate;
  let smoke = null;
  if (o.chimney) smoke = chimney(ctx, W - 18, 2, S);
  roof(ctx, 0, 6, W, fy - 6 + 2, pal, S);
  clapboard(ctx, 1, fy + 1, W - 2, fh - 1);
  const windows = [];
  const doorCol = b.doors.length ? b.doors[0][0] : o.door ?? -1;
  const lit = o.lit || [];
  let wi = 0;
  for (let col = 0; col < b.w; col++) {
    const cx = col * T + 8;
    if (col === doorCol) { door(ctx, cx - 5, H - 16, 10, 15, o.doorColor === 'black' ? [M.dark[0], '#0a0b12', '#20243a'] : M.wood); continue; }
    if (b.w >= 5 && (col === 0 || col === b.w - 1)) continue;
    const state = o.curtain === col ? 'curtain' : lit[wi % Math.max(1, lit.length)] ? 'lit' : 'dark';
    wi++;
    windowAt(ctx, cx - 4, fy + 8, 8, 10, state, { snow: S.snow, glass: o.sill === col });
    windows.push({ x: cx, y: fy + 13, lit: state !== 'dark', curtain: state === 'curtain' });
  }
  if (o.sign === 'herb') { // Malva: a bundle of herbs over the door
    const dx = doorCol * T + 8;
    line(ctx, dx - 3, fy + 2, dx + 3, fy + 2, M.wood[1]);
    for (let i = -3; i <= 3; i += 2) { px(ctx, dx + i, fy + 3, M.herb[1]); px(ctx, dx + i, fy + 4, M.herb[2]); px(ctx, dx + i, fy + 5, M.herb[3]); }
  }
  return { canvas: c, over, windows, smoke };
}

export function cottage(b, season) {
  const S = SEASONS[season], T = 16;
  const W = b.w * T, over = 12, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 24, fy = H - fh;
  const smoke = chimney(ctx, 6, 0, S);
  roof(ctx, 0, 4, W, fy - 2, M.roof.brown, S, { moss: true });
  // stone and timber walls, a little crooked
  for (let y = 0; y < fh; y++) for (let x = 1; x < W - 1; x++) {
    const row = Math.floor(y / 4), off = row % 2 ? 3 : 0, mortar = y % 4 === 0 || (x + off) % 7 === 0;
    px(ctx, x, fy + y, x === 1 || x === W - 2 ? INK : mortar ? M.stone[1] : shade(M.stone[2], (hash((x + off) / 7 | 0, row, 3) - 0.5) * 0.3));
  }
  rect(ctx, 1, fy, W - 2, 2, M.wood[1]);
  const dc = b.doors[0]?.[0] ?? 2;
  door(ctx, dc * T + 3, H - 15, 10, 14, M.wood);
  const wc = dc > 1 ? 1 : 3;
  windowAt(ctx, wc * T + 3, fy + 6, 9, 8, 'lit', { snow: S.snow });
  return { canvas: c, over, windows: [{ x: wc * T + 8, y: fy + 10, lit: true }], smoke };
}

export function shop(b, season) {
  const S = SEASONS[season], T = 16;
  const W = b.w * T, over = 16, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 34, fy = H - fh;
  roof(ctx, 0, 6, W, fy - 4, M.roof.plum, S);
  clapboard(ctx, 1, fy + 1, W - 2, fh - 1, ['#121220', '#191a2a', '#222436', '#2c2f44']);
  const dc = b.doors[0]?.[0] ?? 2, dx = dc * T + 8;
  door(ctx, dx - 5, H - 16, 10, 15, ['#05060a', '#0b0c14', '#1b1d2c'], '#8f6ad1');
  // hanging sign: a crescent moon
  line(ctx, dx + 7, fy + 2, dx + 14, fy + 2, M.metal[2]); line(ctx, dx + 12, fy + 2, dx + 12, fy + 4, M.metal[2]);
  rect(ctx, dx + 8, fy + 4, 9, 9, INK); rect(ctx, dx + 9, fy + 5, 7, 7, M.wood[2]);
  for (const [x, y] of [[12, 6], [11, 7], [11, 8], [11, 9], [12, 10], [13, 10]]) px(ctx, dx + x, fy + y, '#d9c8f0');
  const wx = dc > 2 ? 1 * T + 2 : 3 * T + 2;
  windowAt(ctx, wx, fy + 9, 10, 9, 'dark', { snow: S.snow });
  for (let i = 0; i < 4; i++) px(ctx, wx + 2 + i * 2, fy + 15 - (i % 2), ['#8f6ad1', '#4fd1a5', '#d98a4a', '#8f6ad1'][i]); // jars in the window
  return { canvas: c, over, windows: [{ x: wx + 5, y: fy + 13, lit: true, violet: true }], smoke: null };
}

export function hut(b, season) {
  const S = SEASONS[season], T = 16;
  const W = b.w * T, over = 14, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 24, fy = H - fh;
  const smoke = chimney(ctx, W - 14, 0, S);
  roof(ctx, 0, 4, W, fy - 2, ['#1f2a1c', '#2c3d26', '#3f5733'], S, { moss: true });
  for (let y = 0; y < fh; y++) for (let x = 1; x < W - 1; x++) { // logs
    const r = y % 5;
    px(ctx, x, fy + y, x === 1 || x === W - 2 ? INK : r === 0 ? M.wood[0] : r === 1 ? M.wood[3] : M.wood[2]);
  }
  for (let y = 0; y < fh; y += 5) { px(ctx, 1, fy + y + 2, M.wood[4]); px(ctx, W - 2, fy + y + 2, M.wood[4]); }
  door(ctx, W - 22, H - 15, 9, 14, M.wood);
  rect(ctx, 9, fy + 6, 10, 9, INK); rect(ctx, 10, fy + 7, 8, 7, M.lit[1]); rect(ctx, 13, fy + 7, 1, 7, INK); rect(ctx, 10, fy + 10, 8, 1, INK);
  for (const [x, y] of [[6, fy - 2], [12, fy - 1], [18, fy - 2], [24, fy - 1]]) { line(ctx, x, y, x, y + 4, M.herb[0]); px(ctx, x, y + 5, M.herb[3]); } // drying herbs
  return { canvas: c, over, windows: [{ x: 14, y: fy + 10, lit: true }], smoke };
}
