// PROOF BOARD (not wired into the maps yet; see notes/buildings.md and harness/buildings.html).
// Buildings with a personality: shared helpers (a roof that follows any silhouette, wall materials,
// the hanging sign with its symbol, the ink outline) and the village ones: the court, the library,
// the ordinary house in three variants (plain, rich, ruined).
// Same return shape as houses.js: { canvas, over, windows, smoke, ox? }.
import { SEASONS, M, INK } from './palette.js';
import { makeCanvas, hash, noise, rect, px, line, ellipse } from './px.js';
import { windowAt } from './houses.js';

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

// ---------- symbols: 5x5, the same set as the signposts (marks.js GLYPH) plus the new ones
export const GLYPHS = {
  bottle: ['..#..', '.###.', '.#.#.', '#...#', '.###.'], bell: ['..#..', '.###.', '.###.', '#####', '..#..'],
  house: ['..#..', '.###.', '#####', '.#.#.', '.###.'], scales: ['..#..', '#####', '#.#.#', '#.#.#', '..#..'],
  hut: ['..#..', '.#.#.', '#...#', '.#.#.', '.###.'], wheel: ['#.#.#', '.###.', '##.##', '.###.', '#.#.#'],
  // new
  book: ['##.##', '#.#.#', '#.#.#', '#.#.#', '.#.#.'], // an open book
  mortar: ['....#', '...#.', '#.#.#', '#####', '.###.'], // mortar and pestle: Malva's unguents
  bird: ['.##..', '###.#', '.####', '..##.', '..#..'], // the blackbird, facing left
  cat: ['#...#', '##.##', '#####', '#.#.#', '.###.'], // a cat's head: Tartufo, her cottage
};
export function glyph(ctx, sym, x, y, col) {
  (GLYPHS[sym] || GLYPHS.house).forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') px(ctx, x + i, y + j, col); }));
}

// A hanging sign: an iron bracket out of the wall at (wx, wy) towards dir (+1 right, -1 left), a 9x9
// board on two chains with the symbol in cream. Only buildings you can enter have one.
export function hangSign(ctx, wx, wy, sym, dir, S, { board = M.wood, ribbons = null } = {}) {
  const len = 10, x1 = wx + dir * len;
  line(ctx, wx, wy, x1, wy, INK); line(ctx, wx, wy + 1, x1 - dir, wy + 1, M.metal[2]);
  line(ctx, wx, wy + 6, wx + dir * 5, wy + 1, INK); // the brace
  px(ctx, x1, wy - 1, INK); // curl at the tip
  const by = wy + 4, left = dir > 0 ? x1 - 8 : x1; // the board hangs under the outer half of the bracket
  px(ctx, left + 1, wy + 2, M.metal[1]); px(ctx, left + 1, wy + 3, M.metal[2]); px(ctx, left + 7, wy + 2, M.metal[1]); px(ctx, left + 7, wy + 3, M.metal[2]);
  rect(ctx, left, by, 9, 9, INK); rect(ctx, left + 1, by + 1, 7, 7, board[1]); rect(ctx, left + 1, by + 1, 7, 1, board[3]);
  glyph(ctx, sym, left + 2, by + 2, F.cream);
  if (ribbons) ribbons.forEach((c, i) => { px(ctx, left + 2 + i * 2, by + 9, c); px(ctx, left + 2 + i * 2, by + 10 + (i % 2), c); });
  if (S.snow) { rect(ctx, left, by, 9, 1, S.snow); line(ctx, wx, wy - 1, x1 - dir, wy - 1, S.snow); }
  return [left + 4, by + 4];
}

// A sign hanging straight in front of the wall from a short rod (symmetrical facades: the court).
export function frontSign(ctx, cx, y, sym, S, board = M.wood) {
  rect(ctx, cx - 4, y, 9, 1, INK); px(ctx, cx - 3, y + 1, M.metal[2]); px(ctx, cx + 3, y + 1, M.metal[2]);
  rect(ctx, cx - 4, y + 2, 9, 9, INK); rect(ctx, cx - 3, y + 3, 7, 7, board[1]); rect(ctx, cx - 3, y + 3, 7, 1, board[3]);
  glyph(ctx, sym, cx - 2, y + 4, F.cream);
  if (S.snow) rect(ctx, cx - 4, y + 2, 9, 1, S.snow);
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
// windows in the town's only dressed pale stone, a cornice, a pediment with the scales cut in it,
// a dark hipped roof behind. Two lanterns on posts by the steps. One window lit, up on the right:
// the Judge's study above the cells, where he keeps a single candle (giudice-retroscena).
export function courtHouse(b, season) {
  const S = SEASONS[season], W = b.w * T, over = 30, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const cx = W >> 1, fy = H - 64, base = H - 9; // facade top, top of the plinth
  // hipped roof of dark slate behind the cornice: a trapezoid
  const rTop = 14, rBot = fy;
  profileRoof(ctx, 2, W - 2, (x) => { const inset = Math.max(Math.abs(x - cx) - (W / 2 - 14), 0); return rTop + Math.round(inset * 1.6); }, (x) => { const inset = Math.max(Math.abs(x - cx) - (W / 2 - 14), 0); return rBot - (rTop + Math.round(inset * 1.6)) + 2; }, M.roof.slate, S, { snow: 0.22, seed: 11 });
  // the pediment over the middle bay, with the scales in relief
  const pw = 34, ph = 22, py = fy - ph + 2;
  for (let y = 0; y < ph; y++) { const w = Math.round((y / (ph - 1)) * pw); rect(ctx, cx - w, py + y, w * 2 + 1, 1, y < 2 ? F.ashlar[4] : F.ashlar[2 + (y % 5 === 0 ? 1 : 0)]); px(ctx, cx - w - 1, py + y, INK); px(ctx, cx + w + 1, py + y, INK); px(ctx, cx - w, py + y, F.ashlar[4]); }
  if (S.snow) for (let y = 0; y < ph - 3; y++) { const w = Math.round((y / (ph - 1)) * pw); px(ctx, cx - w, py + y - 1, S.snow); px(ctx, cx + w, py + y - 1, S.snow); }
  // scales relief, 11 px
  const sy = py + 7;
  rect(ctx, cx, sy, 1, 11, F.ashlar[0]); rect(ctx, cx - 6, sy + 2, 13, 1, F.ashlar[0]); rect(ctx, cx - 2, sy + 11, 5, 1, F.ashlar[0]);
  for (const sx of [cx - 6, cx + 6]) { px(ctx, sx, sy + 3, F.ashlar[0]); px(ctx, sx - 1, sy + 4, F.ashlar[0]); px(ctx, sx + 1, sy + 4, F.ashlar[0]); rect(ctx, sx - 2, sy + 5, 5, 1, F.ashlar[0]); rect(ctx, sx - 1, sy + 6, 3, 1, F.ashlar[1]); }
  px(ctx, cx, sy - 1, F.ashlar[4]);
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
  outline(ctx, W, H);
  frontSign(ctx, cx, dy - 2, 'scales', S, ['#1f1d24', '#2e2b34', '#3d3a44', '#57525d']);
  return { canvas: c, over, windows, smoke: null };
}

// =====================================================================================
// THE LIBRARY, 3x4 (inside today's 5x4 slate house: same door tile), door col 1. Tall and narrow,
// a steep gable, the walls hung with slates like fish scales; a lancet window lit high up (Edera's
// books, waiting: «i nastri alle pagine per chi sale a ripassare»); a quill for a weathervane.
export function libraryHouse(b, season) {
  const S = SEASONS[season], W = b.w * T, over = 52, H = b.h * T + over;
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
  hangSign(ctx, dx - 1, H - 26, 'book', -1, S, { ribbons: ['#8f3d3c', '#3f8a4f', '#8a5ab0'] });
  outline(ctx, W, H);
  return { canvas: c, over, windows: [{ x: cx, y: ly + 12, lit: true, keep: true }], smoke: null };
}

// =====================================================================================
// AN ORDINARY HOUSE, 5x4, not enterable: the village's base. Three variants for little cost:
//   plain: today's dark clapboard, one window lit;
//   rich: the Proctors' (famiglia-proctor-retroscena: a church family of the upper village): red-brown
//         paint, cream trim, green shutters, a fanlight and a hood over the door, a brass knocker,
//         two chimneys; nothing more (a Puritan village: restraint);
//   ruined: bleached boards with gaps, a roof with holes to the rafters, a boarded window, ivy.
export function townHouse(b, season) {
  const S = SEASONS[season], o = b.opts || {}, v = o.variant || 'plain', W = b.w * T, over = 14, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 32, fy = H - fh, dc = b.doors?.[0]?.[0] ?? o.door ?? 2, dx = dc * T + 8;
  let smoke = null;
  const windows = [];
  if (v === 'rich') { smokeStack(ctx, 10, 2, 12, S, 0, M.stone); smoke = smokeStack(ctx, W - 16, 2, 12, S, 0, M.stone); }
  else if (v === 'plain') smoke = smokeStack(ctx, W - 18, 2, 12, S);
  else smokeStack(ctx, 12, 5, 8, S, -1, F.grey); // the ruin: a broken stack, no smoke
  // roof: tidy slate (rich), brown (plain), holed and sagging (ruined)
  const sag = (x) => (v === 'ruined' ? Math.round(Math.sin((x / W) * Math.PI) * 6) : 0); // the ridge has given way in the middle
  const holes = v === 'ruined' ? (x, y, d) => {
    const hole = (hx, hy, rw, rh) => Math.abs(x - hx) <= rw && Math.abs(d - hy) <= rh - (Math.abs(x - hx) === rw ? 1 : 0);
    if (hole(54, 13, 6, 5) || hole(20, 20, 3, 3)) return (x % 4 === 1) ? M.wood[2] : (d % 6 === 3 ? M.wood[1] : '#0a0b12'); // rafters over the dark
    return null;
  } : null;
  const missing = v === 'ruined' ? (x, y, d) => (hash(x >> 2, d >> 1, 33) > 0.86 && d > 3 ? (d % 2 ? F.grey[0] : '#151417') : null) : null; // missing shingles (under the snow)
  profileRoof(ctx, 0, W, (x) => 6 + sag(x), (x) => fy - 4 - sag(x), v === 'rich' ? M.roof.slate : v === 'ruined' ? ['#25221f', '#332e29', '#423a33'] : M.roof.brown, S, { after: holes, patch: missing, moss: v === 'ruined' ? 0.12 : 0, seed: v.length });
  // walls
  if (v === 'rich') clapboard(ctx, 1, fy + 1, W - 2, fh - 1, F.oxblood, { corner: F.trim[1] });
  else if (v === 'ruined') clapboard(ctx, 1, fy + 1, W - 2, fh - 1, F.grey, { gaps: (x, y) => (x > 50 && x < 62 && y > 14 && y < 24 && hash(x >> 2, y >> 2, 3) > 0.3) || (x > 6 && x < 12 && y > 4 && y < 9) });
  else clapboard(ctx, 1, fy + 1, W - 2, fh - 1, M.clap);
  if (v === 'rich') { rect(ctx, 1, fy + 1, W - 2, 1, F.trim[2]); rect(ctx, 1, fy + 2, W - 2, 1, F.trim[0]); } // a cornice board
  // windows
  for (let col = 0; col < b.w; col++) {
    if (col === dc || col === 0 || col === b.w - 1) continue;
    const x = col * T + 4, y = fy + 8;
    if (v === 'ruined' && col === b.w - 2) { // boarded up
      rect(ctx, x - 1, y - 1, 10, 12, INK); rect(ctx, x, y, 8, 10, '#0a0b12');
      line(ctx, x - 2, y + 1, x + 9, y + 7, INK); line(ctx, x - 2, y + 2, x + 9, y + 8, F.grey[3]); line(ctx, x - 2, y + 8, x + 9, y + 2, INK); line(ctx, x - 2, y + 9, x + 9, y + 3, F.grey[2]);
      px(ctx, x - 1, y + 2, M.metal[3]); px(ctx, x + 8, y + 8, M.metal[3]);
      continue;
    }
    const lit = v === 'ruined' ? false : v === 'rich' ? true : col === 1;
    windowAt(ctx, x, y, 8, 10, lit ? 'lit' : 'dark', { snow: S.snow });
    if (lit) windows.push({ x: x + 4, y: y + 5, lit: true });
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
  return { canvas: c, over, windows, smoke };
}
