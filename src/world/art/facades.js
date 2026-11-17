// The buildings with a personality (notes/buildings.md; proof board: harness/buildings.html).
// Buildings with a personality: shared helpers (a roof that follows any silhouette, wall materials,
// the hanging sign with its symbol, the ink outline) and the village ones: the court, the library,
// the ordinary house in three variants (plain, rich, ruined).
// Same return shape as houses.js: { canvas, over, windows, smoke, ox? }.
import { SEASONS, M, INK } from './palette.js';
import { makeCanvas, hash, noise, rect, px, line, ellipse } from './px.js';
import { windowAt } from './houses.js';
import { GLYPHS, SIGN_GLYPHS, SYMBOL_OF_BLOCK as SYM } from '../../data/world/symbols.js';
import { KINDS } from '../tiles.js';

const T = 16;

// New materials, all painted for the night like palette.js: dark, a little desaturated.
export const F = {
  daub: ['#3f3024', '#55402c', '#6b5236', '#806343'], // Malva: warm ochre limewash between dark timbers
  boards: ['#29262a', '#38332f', '#4a423b', '#5c5249'], // the cottage: silver-brown weathered boards
  sage: ['#1d3030', '#294443', '#385b58'], // her door, the paint peeling
  ashlar: ['#3b3840', '#524d55', '#6a646b', '#847c80', '#9e9594'], // the court: the only pale, dressed stone in town
  slate: ['#171c2a', '#212839', '#2c354b', '#3d4862'], // the library: a wall hung with slates
  oxblood: ['#2b181b', '#3f2226', '#552e30', '#6a3a39'], // the Proctors: red-brown paint, the colonial «Spanish brown»
  trim: ['#5e5852', '#7f776c', '#a0968a'], // their cream trim, dimmed by the night
  shutter: ['#16271f', '#213a2d', '#2f513d'], // painted green shutters
  grey: ['#262629', '#343337', '#444246', '#57544f'], // the ruin: boards bleached grey
  ivy: ['#18281b', '#243c25', '#33532f', '#4a6e3c'],
  copper: ['#4a2414', '#7a3e1e', '#b06a34', '#e0a464'],
  beech: ['#25252c', '#393a43', '#50515b', '#6b6c74'], // smooth grey bark
  turf: ['#1d2a1c', '#2b3d26', '#3b5331', '#56703e'],
  brass: '#c9a55a',
  cream: '#f2ead2',
};

// ---------- symbols: one table for signs, signposts and the grimoire's map (src/data/world/symbols.js)
export { GLYPHS, SIGN_GLYPHS };
// a symbol in pixels: the 7x7 sign pattern when big, else the 5x5 signpost one
export function glyph(ctx, sym, x, y, col, big = false) {
  const pat = (big && SIGN_GLYPHS[sym]) || GLYPHS[sym] || GLYPHS.house, off = big && !SIGN_GLYPHS[sym] ? 1 : 0;
  pat.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') px(ctx, x + off + i, y + off + j, col); }));
}

// A hanging sign: an iron bracket out of the wall at (wx, wy) towards dir (+1 right, -1 left), an 11x11
// board on two chains with the symbol (7x7) in cream. Only buildings you can enter have one.
export function hangSign(ctx, wx, wy, sym, dir, S, { board = M.wood, ribbons = null, ink = F.cream } = {}) {
  const len = 12, x1 = wx + dir * len;
  line(ctx, wx, wy, x1, wy, INK); line(ctx, wx, wy + 1, x1 - dir, wy + 1, M.metal[2]);
  line(ctx, wx, wy + 6, wx + dir * 5, wy + 1, INK); // the brace
  px(ctx, x1, wy - 1, INK); // curl at the tip
  const by = wy + 4, left = dir > 0 ? x1 - 10 : x1; // the board hangs under the outer part of the bracket
  px(ctx, left + 1, wy + 2, M.metal[1]); px(ctx, left + 1, wy + 3, M.metal[2]); px(ctx, left + 9, wy + 2, M.metal[1]); px(ctx, left + 9, wy + 3, M.metal[2]);
  rect(ctx, left, by, 11, 11, INK); rect(ctx, left + 1, by + 1, 9, 9, board[1]); rect(ctx, left + 1, by + 1, 9, 1, board[3] || board[2]);
  glyph(ctx, sym, left + 2, by + 2, ink, true);
  if (ribbons) ribbons.forEach((c, i) => { px(ctx, left + 3 + i * 2, by + 11, c); px(ctx, left + 3 + i * 2, by + 12 + (i % 2), c); });
  if (S.snow) { rect(ctx, left, by, 11, 1, S.snow); line(ctx, wx, wy - 1, x1 - dir, wy - 1, S.snow); }
  return [left + 5, by + 5];
}

// A sign hanging straight in front of the wall from a short rod (symmetrical facades: the court).
export function frontSign(ctx, cx, y, sym, S, board = M.wood) {
  rect(ctx, cx - 5, y, 11, 1, INK); px(ctx, cx - 4, y + 1, M.metal[2]); px(ctx, cx + 4, y + 1, M.metal[2]);
  rect(ctx, cx - 5, y + 2, 11, 11, INK); rect(ctx, cx - 4, y + 3, 9, 9, board[1]); rect(ctx, cx - 4, y + 3, 9, 1, board[3]);
  glyph(ctx, sym, cx - 3, y + 4, F.cream, true);
  if (S.snow) rect(ctx, cx - 5, y + 2, 11, 1, S.snow);
}

// ---------- roofs and walls
// A roof that follows any silhouette: top(x) is its upper edge at column x (null: no roof there),
// depth(x) how far down it reaches. Shingle rows run parallel to the edge, so a slope reads as a slope.
export function profileRoof(ctx, x0, x1, top, depth, pal, S, { moss = 0, seed = 4, patch = null, after = null, snow = 0.55, lit = true } = {}) {
  for (let x = x0; x < x1; x++) {
    const t = top(x); if (t == null) continue;
    const k = depth(x);
    for (let d = 0; d < k; d++) {
      const row = Math.floor(d / 3), off = (row % 2) * 2;
      let col = d % 3 === 0 || (x + off) % 5 === 0 ? pal[0] : hash(Math.floor((x + off) / 5), row, seed) > 0.7 ? pal[2] : pal[1];
      if (d === 0 && lit) col = pal[2];
      if (moss && d > 0 && hash(x >> 1, (t + d) >> 1, seed + 9) > 1 - moss) col = hash(x, d, seed) > 0.5 ? '#3c5a33' : '#2e4628';
      if (patch) { const p = patch(x, t + d, d); if (p) col = p; }
      if (d === k - 1) col = INK;
      px(ctx, x, t + d, col);
    }
    if (S.snow && snow) {
      const dep = Math.max(1, Math.round(k * snow + (noise(x * 0.15, seed, 3) - 0.5) * 5));
      for (let d = 0; d < Math.min(dep, k - 2); d++) {
        if (d > dep - 3 && hash(x, d, 4) > 0.7) continue;
        px(ctx, x, t + d, d === dep - 1 ? S.snowShade : d < 2 ? '#f4f8ff' : hash(x, d, 9) > 0.93 ? S.snowShade : S.snow);
      }
      if (hash(x, 1, seed) > 0.85) { const len = 1 + Math.floor(hash(x, 2, seed) * 3); for (let j = 0; j < len; j++) px(ctx, x, t + k + j, j === len - 1 ? '#9fb3cf' : '#d8e4f2'); }
    }
    if (after) for (let d = 1; d < k - 1; d++) { const p = after(x, t + d, d); if (p) px(ctx, x, t + d, p); } // holes and patches: they show through the snow
  }
}

export function clapboard(ctx, x0, y0, w, h, pal, { gaps = null, corner = null } = {}) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let col = y % 4 === 0 ? pal[0] : y % 4 === 1 ? pal[2] : pal[1];
    if (gaps && gaps(x, y)) col = y % 4 === 0 ? INK : M.dark[0];
    if (x === 0 || x === w - 1) col = INK;
    else if (x === 1 || x === w - 2) col = corner || pal[3];
    px(ctx, x0 + x, y0 + y, col);
  }
  rect(ctx, x0, y0 + h - 2, w, 2, pal[0]);
}

export function ashlar(ctx, x0, y0, w, h, pal = F.ashlar, course = 5, block = 11) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const row = Math.floor(y / course), off = row % 2 ? (block >> 1) : 0, mortar = y % course === 0 || (x + off) % block === 0;
    const v = hash(((x + off) / block) | 0, row, 5);
    let col = mortar ? pal[1] : pal[v > 0.7 ? 4 : v > 0.3 ? 3 : 2];
    if (!mortar && y % course === 1) col = pal[Math.min(4, (v > 0.3 ? 3 : 2) + 1)]; // lit top of each block
    px(ctx, x0 + x, y0 + y, col);
  }
}

// A door: planks, a step; arch: a round top. Returns its centre x.
export function doorAt(ctx, x, y, w, h, pal, { knob = F.brass, arch = false, studs = false, step = M.stone } = {}) {
  rect(ctx, x - 1, y - 1, w + 2, h + 1, INK);
  rect(ctx, x, y, w, h, pal[1]);
  for (let i = 2; i < w; i += 3) rect(ctx, x + i, y, 1, h, pal[0]);
  rect(ctx, x, y, 1, h, pal[2]);
  if (arch) { const r = w >> 1; for (let j = 0; j < r; j++) { const cut = r - Math.round(Math.sqrt(r * r - (r - j) * (r - j))); rect(ctx, x, y + j, cut, 1, INK); rect(ctx, x + w - cut, y + j, cut, 1, INK); } }
  if (studs) for (let yy = y + 3; yy < y + h - 2; yy += 5) for (let xx = x + 2; xx < x + w - 1; xx += 4) px(ctx, xx, yy, M.metal[3]);
  if (knob) px(ctx, x + w - 3, y + (h >> 1) + 1, knob);
  if (step) { rect(ctx, x - 2, y + h, w + 4, 1, step[2]); }
  return x + (w >> 1);
}

// A climbing plant: a stem wandering up from (x, y0) to y1, leaves either side.
export function vine(ctx, x, y0, y1, seed, pal = F.ivy, spread = 3) {
  let cx = x;
  for (let y = y0; y > y1; y--) {
    cx += Math.round((noise(y * 0.2, seed, 7) - 0.5) * 1.4);
    px(ctx, cx, y, pal[0]);
    if (hash(y, seed, 3) > 0.35) { const s = hash(y, seed, 5) > 0.5 ? 1 : -1, len = 1 + Math.floor(hash(y, seed, 6) * spread); for (let k = 1; k <= len; k++) px(ctx, cx + s * k, y, pal[k === len ? 3 : hash(k, y, seed) > 0.5 ? 2 : 1]); }
  }
}

// The ink outline: every opaque pixel that touches the outside becomes INK (crisp silhouettes).
export function outline(ctx, W, H) {
  const img = ctx.getImageData(0, 0, W, H), d = img.data, A = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : d[(y * W + x) * 4 + 3]);
  const edge = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (A(x, y) > 0 && (!A(x - 1, y) || !A(x + 1, y) || !A(x, y - 1))) edge.push(x, y);
  for (let i = 0; i < edge.length; i += 2) px(ctx, edge[i], edge[i + 1], INK);
}

export function smokeStack(ctx, x, y, h, S, lean = 0, pal = M.stone) { // a chimney, maybe crooked
  for (let j = 0; j < h; j++) {
    const dx = Math.round((lean * j) / h), yy = y + h - 1 - j;
    rect(ctx, x + dx - 1, yy, 7, 1, INK); rect(ctx, x + dx, yy, 5, 1, j % 4 === 0 ? pal[1] : pal[2]); px(ctx, x + dx, yy, pal[3]);
  }
  const tx = x + lean;
  rect(ctx, tx - 2, y - 1, 9, 2, INK); rect(ctx, tx - 1, y - 1, 7, 1, S.snow || pal[3]);
  return [tx + 2, y - 2];
}

// =====================================================================================
// THE COURT, 7x6, door col 3. Broad, severe, symmetrical: a plinth of steps, two floors of tall
// windows in the town's only dressed pale stone, a cornice, and a tall temple pediment with the scales cut
// in it that rises over the low hipped roof, a stone urn on each corner and one on the apex: even as a black
// shape it is the court (the triangle and the three points), not just the biggest box.
// Two lanterns by the door. One window lit, up on the right: the Judge's study above the cells, where he
// keeps a single candle (giudice-retroscena).
export function courtHouse(b, season) {
  const S = SEASONS[season], W = b.w * T, over = KINDS.court.over, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const cx = W >> 1, fy = H - 64, base = H - 9; // facade top, top of the plinth
  // a low hipped roof of dark slate behind the cornice
  const rTop = fy - 18, inset = (x) => Math.max(Math.abs(x + 0.5 - cx) - (W / 2 - 20), 0);
  profileRoof(ctx, 4, W - 4, (x) => rTop + Math.round(inset(x) * 1.2), (x) => fy - (rTop + Math.round(inset(x) * 1.2)) + 2, M.roof.slate, S, { snow: 0.3, seed: 11 });
  // the pediment over the whole front: a tall triangle of pale stone with a dark tympanum
  const pw = W / 2 - 5, ph = 40, py = fy - ph + 1;
  for (let y = 0; y < ph; y++) {
    const w = Math.round((y / (ph - 1)) * pw);
    rect(ctx, cx - w, py + y, w * 2 + 1, 1, F.ashlar[2]);
    const iw = w - 5; if (y > 6 && iw > 0) rect(ctx, cx - iw, py + y, iw * 2 + 1, 1, y > ph - 4 ? F.ashlar[4] : F.ashlar[1]); // the tympanum, recessed
    px(ctx, cx - w - 1, py + y, INK); px(ctx, cx + w + 1, py + y, INK); px(ctx, cx - w, py + y, F.ashlar[4]); px(ctx, cx - w + 1, py + y, F.ashlar[4]);
    if (S.snow && y > 1) { px(ctx, cx - w, py + y - 1, S.snow); px(ctx, cx + w, py + y - 1, S.snow); }
  }
  // the scales, in relief, big: they read from the street
  const sy = py + 15;
  rect(ctx, cx, sy - 2, 1, 18, F.ashlar[4]); rect(ctx, cx - 10, sy + 1, 21, 2, F.ashlar[4]); rect(ctx, cx - 4, sy + 16, 9, 2, F.ashlar[4]);
  for (const sx of [cx - 10, cx + 10]) { line(ctx, sx, sy + 3, sx - 3, sy + 9, F.ashlar[3]); line(ctx, sx, sy + 3, sx + 3, sy + 9, F.ashlar[3]); rect(ctx, sx - 4, sy + 9, 9, 2, F.ashlar[4]); rect(ctx, sx - 3, sy + 11, 7, 1, F.ashlar[3]); }
  ellipse(ctx, cx, sy - 3, 1, 1, F.ashlar[4]);
  // the facade
  ashlar(ctx, 1, fy, W - 2, base - fy);
  rect(ctx, 0, fy - 1, W, 4, INK); rect(ctx, 1, fy, W - 2, 2, F.ashlar[4]); rect(ctx, 1, fy + 2, W - 2, 1, F.ashlar[1]); // cornice
  if (S.snow) rect(ctx, 0, fy - 1, W, 1, S.snow);
  rect(ctx, 1, fy + 30, W - 2, 2, F.ashlar[4]); rect(ctx, 1, fy + 32, W - 2, 1, F.ashlar[1]); // the string course between the floors
  for (const x of [1, 40, W - 46, W - 7]) { rect(ctx, x, fy + 3, 6, base - fy - 3, F.ashlar[3]); rect(ctx, x, fy + 3, 1, base - fy - 3, F.ashlar[4]); rect(ctx, x + 5, fy + 3, 1, base - fy - 3, F.ashlar[1]); } // pilasters
  const windows = [];
  for (const x of [13, 27, W - 35, W - 21]) { // upper floor: small windows; ground floor: tall ones
    const lit = x === W - 21;
    windowAt(ctx, x, fy + 9, 8, 13, lit ? 'lit' : 'dark', { snow: S.snow });
    if (lit) windows.push({ x: x + 4, y: fy + 15, lit: true, keep: true });
    windowAt(ctx, x, fy + 38, 8, 15, 'dark', { snow: S.snow });
    rect(ctx, x - 1, fy + 36, 10, 1, F.ashlar[4]); // lintels
  }
  // the door in the middle bay under a round arch with a keystone
  const dw = 16, dh = 25, dx = cx - (dw >> 1), dy = base - dh;
  ellipse(ctx, cx, dy + 1, 10, 7, INK); ellipse(ctx, cx, dy + 1, 9, 6, F.ashlar[4]); ellipse(ctx, cx, dy + 1, 7, 5, M.dark[0]);
  doorAt(ctx, dx, dy, dw, dh, ['#1a1214', '#2a1c1c', '#3d2a26'], { knob: null, studs: true, step: null });
  rect(ctx, cx, dy, 1, dh, INK); px(ctx, cx - 2, dy + 15, F.brass); px(ctx, cx + 2, dy + 15, F.brass);
  rect(ctx, cx - 1, dy - 7, 3, 4, F.ashlar[4]); rect(ctx, cx - 1, dy - 7, 3, 1, INK);
  // the plinth and three broad steps
  rect(ctx, 0, base, W, H - base, INK);
  ashlar(ctx, 1, base, W - 2, H - base - 1, F.ashlar, 4, 9);
  for (let s = 0; s < 3; s++) { const w = 26 + s * 7, y = base + s * 3; rect(ctx, cx - w, y, w * 2 + 1, 3, INK); rect(ctx, cx - w + 1, y, w * 2 - 1, 1, F.ashlar[4]); rect(ctx, cx - w + 1, y + 1, w * 2 - 1, 1, F.ashlar[3]); if (S.snow) rect(ctx, cx - w + 1, y, w * 2 - 1, 1, S.snow); }
  // two lanterns on iron brackets, one on each pilaster of the door bay
  for (const lx of [43, W - 43]) {
    rect(ctx, lx - 1, base - 31, 3, 2, INK);
    rect(ctx, lx - 3, base - 29, 7, 9, INK); rect(ctx, lx - 2, base - 28, 5, 7, M.lit[1]); rect(ctx, lx - 1, base - 27, 3, 3, M.lit[2]);
    rect(ctx, lx - 4, base - 30, 9, 2, INK); rect(ctx, lx - 1, base - 20, 3, 2, INK);
    if (S.snow) rect(ctx, lx - 3, base - 30, 7, 1, S.snow);
    windows.push({ x: lx, y: base - 25, lit: true, keep: true, lamp: true });
  }
  // stone urns: on both corners of the cornice and on the apex
  const urn = (ux, uy) => { // uy: its foot
    rect(ctx, ux - 3, uy - 2, 7, 2, F.ashlar[3]); rect(ctx, ux - 1, uy - 4, 3, 2, F.ashlar[2]);
    ellipse(ctx, ux, uy - 7, 3, 3, F.ashlar[3]); px(ctx, ux - 1, uy - 8, F.ashlar[4]); rect(ctx, ux, uy - 12, 1, 2, F.ashlar[3]); px(ctx, ux, uy - 13, F.ashlar[4]);
    if (S.snow) { rect(ctx, ux - 2, uy - 10, 5, 1, S.snow); rect(ctx, ux - 3, uy - 2, 7, 1, S.snow); }
  };
  urn(4, fy - 1); urn(W - 5, fy - 1); urn(cx, py + 1);
  outline(ctx, W, H);
  frontSign(ctx, cx, dy - 2 - 13, SYM.court, S, ['#1f1d24', '#2e2b34', '#3d3a44', '#57525d']);
  return { canvas: c, over, windows, smoke: null };
}

// =====================================================================================
// THE LIBRARY, 3x4 (inside today's 5x4 slate house: same door tile), door col 1. Tall and narrow,
// a steep gable, the walls hung with slates like fish scales; a lancet window lit high up (Edera's
// books, waiting: «i nastri alle pagine per chi sale a ripassare»); a quill for a weathervane.
export function libraryHouse(b, season) {
  const S = SEASONS[season], W = b.w * T, over = KINDS.library.over, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const cx = W >> 1, ey = 50, ay = 6, k = 8; // eave line, apex, roof band depth
  const top = (x) => Math.round(ay + (Math.abs(x + 0.5 - cx) / cx) * (ey - ay));
  // slate-hung walls under the whole gable
  for (let y = ay + 3; y < H; y++) for (let x = 1; x < W - 1; x++) {
    if (y < top(x) + k - 1) continue;
    const row = Math.floor(y / 3), off = row % 2 ? 2 : 0, s = (x + off) % 4;
    px(ctx, x, y, y % 3 === 0 ? F.slate[0] : s === 0 ? F.slate[1] : s === 3 ? F.slate[3] : F.slate[2]);
  }
  for (let y = ey; y < H; y++) { px(ctx, 1, y, F.slate[3]); px(ctx, W - 2, y, F.slate[0]); }
  profileRoof(ctx, 0, W, top, () => k, M.roof.slate, S, { seed: 21, snow: 0.6 });
  // a band between the floors
  rect(ctx, 1, H - 30, W - 2, 2, F.slate[0]); rect(ctx, 1, H - 31, W - 2, 1, F.slate[3]);
  // the lancet window, lit
  const lw = 10, lh = 24, lx = cx - 5, ly = ey - 18;
  const lancet = (x0, y0, w, h, fill) => { for (let y = 0; y < h; y++) { const half = w / 2, t = y < half ? Math.round(half - Math.sqrt(Math.max(0, half * half - (half - y) * (half - y)) ) * 0.9) : 0; rect(ctx, x0 + t, y0 + y, w - t * 2, 1, fill(y)); } };
  lancet(lx - 1, ly - 1, lw + 2, lh + 2, () => INK);
  lancet(lx, ly, lw, lh, (y) => (y < 6 ? M.lit[2] : y % 7 === 6 ? INK : M.lit[1]));
  rect(ctx, cx, ly + 3, 1, lh - 3, INK);
  for (let i = 0; i < 4; i++) px(ctx, lx + 1 + i * 2, ly + lh - 3, ['#8f3d3c', '#3f6a3f', '#734a88', '#b88935'][i]); // book spines on the sill
  rect(ctx, lx - 2, ly + lh + 1, lw + 4, 2, F.slate[3]); if (S.snow) rect(ctx, lx - 2, ly + lh + 1, lw + 4, 1, S.snow);
  // two slit windows on the ground floor, dark
  for (const x of [5, W - 9]) { rect(ctx, x - 1, H - 25, 6, 12, INK); rect(ctx, x, H - 24, 4, 10, M.dark[0]); px(ctx, x + 2, H - 23, '#3a4766'); }
  // the door: narrow and pointed
  const dw = 10, dh = 18, dx = cx - 5;
  lancet(dx - 1, H - dh - 2, dw + 2, dh + 2, () => INK);
  lancet(dx, H - dh - 1, dw, dh, (y) => (y % 3 === 0 ? '#2a1c19' : '#3e2a22'));
  px(ctx, dx + dw - 3, H - 9, F.brass);
  rect(ctx, dx - 2, H - 1, dw + 4, 1, M.stone[2]);
  // the weathervane: a quill
  rect(ctx, cx, 0, 1, ay + 1, INK); line(ctx, cx - 4, 2, cx + 4, 0, M.metal[3]); px(ctx, cx + 4, 1, M.metal[2]); px(ctx, cx - 4, 3, F.cream);
  hangSign(ctx, dx - 1, H - 26, SYM.library, -1, S, { ribbons: ['#8f3d3c', '#3f8a4f', '#8a5ab0'] });
  outline(ctx, W, H);
  return { canvas: c, over, windows: [{ x: cx, y: ly + 12, lit: true, keep: true }], smoke: null };
}

// =====================================================================================
// AN ORDINARY HOUSE, 5x4 (or any size), not enterable: the village's base. Three variants for little cost:
//   plain: dark clapboard, today's house;
//   rich: the Proctors' (famiglia-proctor-retroscena: a church family): red-brown paint, cream trim, green
//         shutters, a fanlight and a hood over the door, a brass knocker, two chimneys; nothing more (a
//         Puritan village: restraint);
//   ruined: bleached boards with gaps, a roof with holes to the rafters, a boarded window, ivy.
// Options (b.opts, as house() in houses.js): door (col of a painted door when the block has no '+'),
// lit [1, 0] windows lit in turn, curtain (col of the curtained window: a card hides behind it), sill
// (col of the window with a glass on the sill: a card on it), chimney, and small cheap differences:
// extra: 'washing' (a line of washing under the eave) | 'woodpile' (logs against a corner) | 'barrel'.
export function townHouse(b, season) {
  const S = SEASONS[season], o = b.opts || {}, v = o.variant || 'plain', W = b.w * T, over = KINDS.house.over, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 32, fy = H - fh, dc = b.doors?.[0]?.[0] ?? o.door ?? 2, dx = dc * T + 8;
  let smoke = null;
  const windows = [];
  if (v === 'rich') { smokeStack(ctx, 10, 2, 12, S, 0, M.stone); smoke = smokeStack(ctx, W - 16, 2, 12, S, 0, M.stone); }
  else if (v === 'plain') { if (o.chimney !== false) smoke = smokeStack(ctx, (b.x || 0) % 2 ? 8 : W - 18, 2, 12, S); }
  else smokeStack(ctx, 12, 5, 8, S, -1, F.grey); // the ruin: a broken stack, no smoke
  // roof: tidy slate (rich), its own colour (plain), holed and sagging (ruined)
  const sag = (x) => (v === 'ruined' ? Math.round(Math.sin((x / W) * Math.PI) * 6) : 0); // the ridge has given way in the middle
  const holes = v === 'ruined' ? (x, y, d) => {
    const hole = (hx, hy, rw, rh) => Math.abs(x - hx) <= rw && Math.abs(d - hy) <= rh - (Math.abs(x - hx) === rw ? 1 : 0);
    if (hole(W - 26, 13, 6, 5) || hole(20, 20, 3, 3)) return (x % 4 === 1) ? M.wood[2] : (d % 6 === 3 ? M.wood[1] : '#0a0b12'); // rafters over the dark
    return null;
  } : null;
  const missing = v === 'ruined' ? (x, y, d) => (hash(x >> 2, d >> 1, 33) > 0.86 && d > 3 ? (d % 2 ? F.grey[0] : '#151417') : null) : null; // missing shingles (under the snow)
  const pal = v === 'rich' ? M.roof.slate : v === 'ruined' ? ['#25221f', '#332e29', '#423a33'] : M.roof[o.roof] || M.roof.brown;
  profileRoof(ctx, 0, W, (x) => 6 + sag(x), (x) => fy - 4 - sag(x), pal, S, { after: holes, patch: missing, moss: v === 'ruined' ? 0.12 : 0, seed: v.length + (b.x || 0) });
  // walls
  if (v === 'rich') clapboard(ctx, 1, fy + 1, W - 2, fh - 1, F.oxblood, { corner: F.trim[1] });
  else if (v === 'ruined') clapboard(ctx, 1, fy + 1, W - 2, fh - 1, F.grey, { gaps: (x, y) => (x > W - 30 && x < W - 18 && y > 14 && y < 24 && hash(x >> 2, y >> 2, 3) > 0.3) || (x > 6 && x < 12 && y > 4 && y < 9) });
  else clapboard(ctx, 1, fy + 1, W - 2, fh - 1, M.clap);
  if (v === 'rich') { rect(ctx, 1, fy + 1, W - 2, 1, F.trim[2]); rect(ctx, 1, fy + 2, W - 2, 1, F.trim[0]); } // a cornice board
  // windows: every column but the door's and the corners'; lit in turn (o.lit), the curtain and the sill kept
  const lit = o.lit || [0, 1];
  let wi = 0;
  for (let col = 0; col < b.w; col++) {
    if (col === dc || (b.w >= 5 && (col === 0 || col === b.w - 1))) continue;
    const x = col * T + 4, y = fy + 8;
    if (v === 'ruined' && col === b.w - 2) { // boarded up
      rect(ctx, x - 1, y - 1, 10, 12, INK); rect(ctx, x, y, 8, 10, '#0a0b12');
      line(ctx, x - 2, y + 1, x + 9, y + 7, INK); line(ctx, x - 2, y + 2, x + 9, y + 8, F.grey[3]); line(ctx, x - 2, y + 8, x + 9, y + 2, INK); line(ctx, x - 2, y + 9, x + 9, y + 3, F.grey[2]);
      px(ctx, x - 1, y + 2, M.metal[3]); px(ctx, x + 8, y + 8, M.metal[3]);
      continue;
    }
    const state = o.curtain === col ? 'curtain' : v === 'ruined' ? 'dark' : v === 'rich' ? 'lit' : lit[wi % Math.max(1, lit.length)] ? 'lit' : 'dark';
    wi++;
    windowAt(ctx, x, y, 8, 10, state, { snow: S.snow, glass: o.sill === col });
    if (state !== 'dark') windows.push({ x: x + 4, y: y + 5, lit: true, curtain: state === 'curtain' });
    if (v === 'rich') for (const sx of [x - 5, x + 9]) { rect(ctx, sx, y - 1, 4, 12, INK); rect(ctx, sx + 1, y, 2, 10, F.shutter[1]); px(ctx, sx + 1, y + 2, F.shutter[2]); px(ctx, sx + 1, y + 7, F.shutter[2]); rect(ctx, sx + 1, y + 5, 2, 1, F.shutter[0]); }
    if (v === 'rich') { rect(ctx, x - 1, y - 3, 10, 2, F.trim[1]); px(ctx, x - 1, y - 3, F.trim[2]); }
  }
  // door
  if (v === 'rich') {
    rect(ctx, dx - 7, H - 25, 14, 2, INK); rect(ctx, dx - 6, H - 25, 12, 1, F.trim[2]); // a hood over the door
    ellipse(ctx, dx, H - 19, 4, 2, INK); ellipse(ctx, dx, H - 19, 3, 1, M.lit[0]); // the fanlight
    doorAt(ctx, dx - 4, H - 16, 9, 15, ['#141a16', '#1d2a22', '#2b3d31'], { knob: null });
    rect(ctx, dx - 6, H - 23, 1, 22, F.trim[1]); rect(ctx, dx + 6, H - 23, 1, 22, F.trim[1]); // pilasters
    px(ctx, dx, H - 11, F.brass); px(ctx, dx - 1, H - 10, F.brass); px(ctx, dx + 1, H - 10, F.brass); px(ctx, dx, H - 9, '#8a6a30'); // the brass knocker
    windows.push({ x: dx, y: H - 19, lit: true });
  } else if (v === 'ruined') {
    doorAt(ctx, dx - 5, H - 16, 10, 15, [F.grey[0], F.grey[1], F.grey[2]], { knob: null });
    line(ctx, dx - 7, H - 12, dx + 6, H - 7, INK); line(ctx, dx - 7, H - 11, dx + 6, H - 6, F.grey[3]); // a plank nailed across
    vine(ctx, 3, H - 2, fy - 6, 5, F.ivy, 4); vine(ctx, 9, H - 2, fy + 4, 9, F.ivy, 3); vine(ctx, W - 4, H - 2, fy + 10, 13, F.ivy, 3);
  } else {
    doorAt(ctx, dx - 5, H - 16, 10, 15, M.wood);
  }
  outline(ctx, W, H);
  // small differences, drawn over the outline (they stand in front of the wall)
  if (o.extra === 'washing') { // a line under the eave, with sheets and a shirt
    const y = fy + 3, x0 = 4, x1 = W - 5;
    line(ctx, x0, y, x1, y, M.wood[3]);
    [[8, 6, F.cream], [17, 4, '#8f8778'], [26, 7, '#b3aa98'], [W - 22, 5, '#6b2a2e'], [W - 14, 6, F.cream]].forEach(([x, h, col]) => { if (Math.abs(x - dx) < 8) return; rect(ctx, x - 1, y + 1, 6, h, INK); rect(ctx, x, y + 1, 4, h - 1, col); px(ctx, x, y, INK); px(ctx, x + 3, y, INK); if (S.snow) rect(ctx, x, y + 1, 4, 1, S.snow); });
  }
  if (o.extra === 'woodpile') { // logs stacked against the right corner
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3 - (r >> 1); k++) { const lx = W - 6 - k * 5 - (r % 2) * 2, ly = H - 3 - r * 4; ellipse(ctx, lx, ly, 2, 2, INK); ellipse(ctx, lx, ly, 1, 1, M.wood[4]); px(ctx, lx, ly, M.wood[2]); }
    if (S.snow) rect(ctx, W - 18, H - 13, 14, 1, S.snow);
  }
  if (o.extra === 'barrel') { const bx = 3; rect(ctx, bx, H - 11, 8, 10, INK); rect(ctx, bx + 1, H - 10, 6, 9, M.wood[2]); rect(ctx, bx + 1, H - 8, 6, 1, M.metal[2]); rect(ctx, bx + 1, H - 4, 6, 1, M.metal[2]); if (S.snow) rect(ctx, bx + 1, H - 11, 6, 1, S.snow); }
  return { canvas: c, over, windows, smoke };
}

// =====================================================================================
// THE MEETINGHOUSE, 7x5, door col 3: the landmark of the village. A plain pale clapboard hall with a square
// tower in front of it, rising high over every roof: an open belfry with the bell (the scene hangs the
// swinging bell sprite at `bell`), a cornice, a tall slate spire with a weathervane. The sign with the bell
// hangs by the door. The tower is what she sees from the market, the square and the lane.
export function meetingHouse(b, season) {
  const S = SEASONS[season], W = b.w * T, over = KINDS.meeting.over, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 36, fy = H - fh, cx = W >> 1, pal = ['#3d3b49', '#4f4d5c', '#615f70', '#73718a'];
  // the hall's roof, side-on: a band of slate between the eave and the ridge
  profileRoof(ctx, 0, W, () => fy - 34, () => 36, M.roof.slate, S, { seed: 3, snow: 0.6 });
  clapboard(ctx, 1, fy + 1, W - 2, fh - 1, pal);
  const windows = [];
  for (const col of [0, 1, 5, 6].filter((c0) => c0 < b.w)) {
    const x = col * T + 4, lit = col === 1;
    windowAt(ctx, x, fy + 8, 8, 16, lit ? 'dim' : 'dark', { snow: S.snow });
    rect(ctx, x - 1, fy + 5, 10, 2, pal[3]); // a plain pediment over each window
    windows.push({ x: x + 4, y: fy + 15, lit });
  }
  // the tower: pale boards, from the ground to the belfry
  const tw = 13, tt = 40; // half width, top of the tower's shaft
  rect(ctx, cx - tw - 1, tt, tw * 2 + 3, H - tt, INK);
  for (let y = tt + 1; y < H; y++) for (let x = cx - tw; x <= cx + tw; x++) px(ctx, x, y, x < cx - tw + 2 ? pal[3] : x > cx + tw - 2 ? pal[0] : y % 4 === 0 ? pal[0] : y % 4 === 1 ? pal[2] : pal[1]);
  // the belfry: an open round arch, the dark inside, louvres below the bell
  const ay = tt + 6;
  rect(ctx, cx - 6, ay + 4, 13, 16, INK); ellipse(ctx, cx, ay + 4, 6, 5, INK);
  rect(ctx, cx - 5, ay + 4, 11, 15, '#141726'); ellipse(ctx, cx, ay + 4, 5, 4, '#141726');
  rect(ctx, cx - 5, ay + 15, 11, 1, pal[0]); rect(ctx, cx - 5, ay + 17, 11, 1, pal[0]); // the rail
  rect(ctx, cx - tw - 2, ay + 22, tw * 2 + 5, 3, INK); rect(ctx, cx - tw - 1, ay + 22, tw * 2 + 3, 1, S.snow || pal[3]); // a ledge
  // a round window lower on the tower, dark (a clock face would be too rich for them)
  ellipse(ctx, cx, ay + 34, 4, 4, INK); ellipse(ctx, cx, ay + 34, 3, 3, M.dark[1]); rect(ctx, cx, ay + 31, 1, 7, INK); rect(ctx, cx - 3, ay + 34, 7, 1, INK);
  // the cornice and the spire
  rect(ctx, cx - tw - 3, tt - 3, tw * 2 + 7, 4, INK); rect(ctx, cx - tw - 2, tt - 2, tw * 2 + 5, 1, S.snow || pal[3]); rect(ctx, cx - tw - 2, tt - 1, tw * 2 + 5, 1, pal[2]);
  const sp = tt - 3, top = 6;
  for (let y = top; y < sp; y++) { const w = Math.round(((y - top + 1) / (sp - top)) * (tw - 2)); for (let x = cx - w; x <= cx + w; x++) px(ctx, x, y, x === cx - w || x === cx + w ? INK : x < cx ? M.roof.slate[2] : M.roof.slate[1]); if (S.snow && y % 4 === 0 && w > 1) px(ctx, cx - w + 1, y, S.snow); }
  // the weathervane: a rod, a ball, an arrow
  rect(ctx, cx, 0, 1, top + 1, INK); px(ctx, cx, 2, F.brass); line(ctx, cx - 4, 3, cx + 4, 3, INK); px(ctx, cx + 4, 2, INK); px(ctx, cx + 4, 4, INK); px(ctx, cx - 4, 2, INK);
  // the door at the foot of the tower: double, under a hood
  const dc = b.doors[0]?.[0] ?? 3, dx = dc * T + 8;
  rect(ctx, dx - 8, H - 24, 17, 2, INK); rect(ctx, dx - 7, H - 24, 15, 1, S.snow || pal[3]);
  doorAt(ctx, dx - 6, H - 21, 13, 20, M.wood, { knob: null });
  rect(ctx, dx, H - 21, 1, 20, INK); px(ctx, dx - 2, H - 11, F.brass); px(ctx, dx + 2, H - 11, F.brass);
  outline(ctx, W, H);
  hangSign(ctx, cx + tw + 1, fy + 2, SYM.meeting, 1, S);
  return { canvas: c, over, windows, smoke: null, bell: [cx, ay + 4] };
}

// =====================================================================================
// THE SHOP, 5x4, door col 2: the only black house, with the black door; a small window of jars lit violet;
// a bottle on the sign (the signposts point to it with the same bottle).
export function blackShop(b, season) {
  const S = SEASONS[season], W = b.w * T, over = KINDS.shop.over, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 34, fy = H - fh;
  // a steep plum roof, a little crooked at the ridge
  profileRoof(ctx, 0, W, (x) => 6 + (x > W * 0.6 ? 1 : 0), () => fy - 4, M.roof.plum, S, { seed: 8 });
  clapboard(ctx, 1, fy + 1, W - 2, fh - 1, ['#0c0c16', '#121220', '#191a2a', '#24263a']);
  const dc = b.doors[0]?.[0] ?? 2, dx = dc * T + 8;
  // the black door, with a violet knob, under a black hood
  rect(ctx, dx - 8, H - 21, 17, 2, INK); if (S.snow) rect(ctx, dx - 7, H - 22, 15, 1, S.snow);
  doorAt(ctx, dx - 6, H - 18, 12, 17, ['#030308', '#07070e', '#14152a'], { knob: '#a07ad8' });
  // the window: jars and bottles on two shelves, lit violet
  const wx = dc > 2 ? T + 1 : 3 * T + 1, wy = fy + 7;
  rect(ctx, wx - 1, wy - 1, 14, 14, INK); rect(ctx, wx, wy, 12, 12, '#2a1f3d');
  rect(ctx, wx, wy + 5, 12, 1, INK); rect(ctx, wx, wy + 11, 12, 1, INK);
  ['#8f6ad1', '#4fd1a5', '#d98a4a', '#c8b0f0'].forEach((col, i) => { rect(ctx, wx + 1 + i * 3, wy + 2, 2, 3, col); px(ctx, wx + 1 + i * 3, wy + 1, INK); rect(ctx, wx + 2 + i * 3 - (i % 2), wy + 8, 2, 3, ['#4fd1a5', '#8f6ad1', '#c8b0f0', '#d98a4a'][i]); });
  rect(ctx, wx - 2, wy + 13, 16, 2, M.wood[2]); if (S.snow) rect(ctx, wx - 2, wy + 13, 16, 1, S.snow);
  // the other side: a shuttered window
  const ox = dc > 2 ? 3 * T + 3 : T + 3;
  rect(ctx, ox - 1, wy - 1, 11, 13, INK); rect(ctx, ox, wy, 4, 11, '#1a1a28'); rect(ctx, ox + 5, wy, 4, 11, '#1a1a28'); px(ctx, ox + 3, wy + 5, M.metal[3]);
  outline(ctx, W, H);
  hangSign(ctx, dx + 7, fy + 4, SYM.shop, 1, S, { board: ['#0c0c16', '#1b1b2c', '#2a2a40', '#3a3a52'], ink: '#c8b0f0' });
  return { canvas: c, over, windows: [{ x: wx + 6, y: wy + 6, lit: true, violet: true }], smoke: null };
}

// =====================================================================================
// THE MILL, 4x4 in the forest, on the brook: a tall timber mill on a stone footing, a hoist hood under the
// ridge, and a big wheel on the water side (the scene turns it: `wheel` is its centre). The wheel is what
// she sees from the crossing; the sign with the wheel hangs by the door.
export function millHouse(b, season) {
  const S = SEASONS[season], W = b.w * T + 20, over = KINDS.mill.over, H = b.h * T + over, BW = b.w * T;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 46, fy = H - fh, cx = BW >> 1;
  // a steep gable roof
  const top = (x) => Math.round(8 + Math.abs(x + 0.5 - cx) * 0.95);
  profileRoof(ctx, 0, BW, top, (x) => fy - top(x) + 3, M.roof.brown, S, { seed: 5, moss: 0.08 });
  // the hoist hood: a little roof sticking out under the ridge, a beam with a rope
  for (let y = 0; y < fy - 8; y++) for (let x = 1; x < BW - 1; x++) if (y >= top(x) + 10) px(ctx, x, y, x % 6 === 0 ? M.wood[1] : M.wood[2]);
  rect(ctx, cx - 5, 20, 11, 10, INK); rect(ctx, cx - 4, 21, 9, 9, M.dark[0]); rect(ctx, cx - 1, 14, 3, 7, INK); rect(ctx, cx, 15, 1, 15, M.wood[3]);
  // timber walls on a stone footing
  for (let y = fy; y < H; y++) for (let x = 1; x < BW - 1; x++) {
    const foot = y >= H - 12;
    px(ctx, x, y, foot ? (((x + (y >> 2) * 3) % 7 === 0 || y % 4 === 0) ? M.stone[1] : M.stone[2]) : x % 6 === 0 ? M.wood[1] : M.wood[2 + ((y % 9 === 0) ? 1 : 0)]);
  }
  rect(ctx, 1, fy, BW - 2, 2, M.wood[3]);
  // the door and two windows
  doorAt(ctx, 22, H - 19, 14, 18, M.wood, { knob: null });
  rect(ctx, 28, H - 19, 1, 18, INK);
  windowAt(ctx, 7, fy + 8, 8, 9, 'dim', { snow: S.snow });
  windowAt(ctx, BW - 15, fy + 8, 8, 9, 'dark', { snow: S.snow });
  // sacks by the door
  for (const [x, y] of [[40, H - 3], [46, H - 3], [43, H - 8]]) { ellipse(ctx, x, y, 3, 3, INK); ellipse(ctx, x, y, 2, 2, '#b3aa98'); px(ctx, x - 1, y - 1, '#d3cab6'); }
  // the axle and its frame on the water side
  rect(ctx, BW - 3, H - 30, 8, 4, M.metal[1]); rect(ctx, BW - 2, H - 29, 6, 1, M.metal[3]);
  outline(ctx, W, H);
  hangSign(ctx, 21, fy + 6, SYM.mill, -1, S);
  return { canvas: c, over, windows: [{ x: 11, y: fy + 12, lit: true }], smoke: null, wheel: [BW + 3, H - 28] };
}

// =====================================================================================
// THE BIG TREE OF THE SQUARE, 1x1 (the trunk is solid), its crown drawn far above and around: an old elm
// seen from anywhere in the village. Bare and snowy in winter, in blossom in spring, red in autumn.
export function bigTree(b, season) {
  const S = SEASONS[season], ox = KINDS.bigtree.ox, W = T + ox * 2, over = KINDS.bigtree.over, H = T + over;
  const [c, ctx] = makeCanvas(W, H);
  const cx = W >> 1;
  // roots and trunk
  for (let y = 36; y < H; y++) {
    const flare = y > H - 6 ? (y - (H - 6)) : 0, w = 4 + flare;
    for (let x = cx - w; x <= cx + w; x++) px(ctx, x, y, x === cx - w || x === cx + w ? INK : x < cx - w + 2 ? S.bark[2] : x > cx + w - 2 ? S.bark[0] : hash(x, y >> 2, 4) > 0.85 ? S.bark[0] : S.bark[1]);
  }
  // the big limbs
  const limbs = [[cx, 46, cx - 24, 22], [cx, 44, cx + 22, 18], [cx, 40, cx - 6, 10], [cx, 42, cx + 8, 12], [cx - 2, 52, cx - 28, 40], [cx + 2, 50, cx + 28, 36]];
  for (const [x0, y0, x1, y1] of limbs) { line(ctx, x0 - 1, y0, x1 - 1, y1, INK); line(ctx, x0, y0, x1, y1, S.bark[2]); line(ctx, x0 + 1, y0, x1 + 1, y1, S.bark[1]); line(ctx, x0 + 2, y0, x1 + 2, y1, INK); }
  if (S.crown) {
    for (const [x, y, r] of [[cx - 16, 26, 13], [cx + 14, 22, 14], [cx, 15, 14], [cx - 24, 40, 10], [cx + 24, 36, 10], [cx - 6, 34, 12], [cx + 8, 36, 11]]) {
      ellipse(ctx, x, y, r + 1, Math.round(r * 0.8) + 1, INK);
      ellipse(ctx, x, y, r, Math.round(r * 0.8), S.crown[1]);
      ellipse(ctx, x - 2, y - 2, r - 4, Math.round(r * 0.55), S.crown[2]);
      ellipse(ctx, x - 4, y - 4, Math.max(2, r - 9), Math.max(1, Math.round(r * 0.3)), S.crown[3]);
      for (let i = 0; i < r; i++) px(ctx, x - r + Math.floor(hash(i, x, 5) * r * 2), y - 2 + Math.floor(hash(i, y, 6) * r), S.crown[i % 5 === 0 && S.crown[4] ? 4 : 0]);
    }
  } else { // winter: a dense fan of bare twigs with snow along them
    for (let i = 0; i < 46; i++) {
      const a = Math.PI * (1.05 + hash(i, 1, 9) * 0.9), r0 = 10 + hash(i, 2, 9) * 14, r1 = r0 + 8 + hash(i, 3, 9) * 12;
      const x0 = cx + Math.cos(a) * r0, y0 = 46 + Math.sin(a) * r0 * 1.1, x1 = cx + Math.cos(a) * r1, y1 = 46 + Math.sin(a) * r1 * 1.1;
      line(ctx, x0, y0, x1, y1, S.bark[1]); line(ctx, x0, y0 + 1, x1, y1 + 1, INK);
      if (S.snow && i % 2) { px(ctx, x1, y1 - 1, S.snow); px(ctx, (x0 + x1) / 2, (y0 + y1) / 2 - 1, S.snow); }
    }
  }
  // a ring of stones round the foot
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, x = cx + Math.cos(a) * 9, y = H - 4 + Math.sin(a) * 3; ellipse(ctx, x, y, 2, 1, INK); px(ctx, x, y, M.stone[3]); if (S.snow) px(ctx, x, y - 1, S.snow); }
  return { canvas: c, over, ox, windows: [], smoke: null };
}
