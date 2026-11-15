// Outdoor props: the pedlar's stall, the cart, the well, lamps, barrels, the pillory, the notice
// board; in the forest and the depths: the campfire, a hanging lantern, the spring, boundary stone,
// torches, chains, a fallen tower, bones, mushrooms, candles, the cauldron.
// Each painter (b, season) returns { canvas, over } (over: px above the footprint; the picture is
// as wide as the footprint unless it says ox, px it sticks out on the left).
import { SEASONS, M, INK } from './palette.js';
import { makeCanvas, hash, rect, px, line, ellipse } from './px.js';

const T = 16;
const base = (b, over = 0, extraW = 0) => { const [c, ctx] = makeCanvas(b.w * T + extraW * 2, b.h * T + over); return [c, ctx, b.w * T + extraW * 2, b.h * T + over]; };
const snowTop = (ctx, x, y, w, S) => { if (S.snow) { rect(ctx, x, y, w, 1, '#ffffff'); rect(ctx, x, y + 1, w, 1, S.snow); } };

export const PROPS = {
  stall(b, season) {
    const S = SEASONS[season], [c, ctx, W, H] = base(b, 14);
    const cl = M.cloth[b.opts.awning] || M.cloth.violet;
    for (const x of [2, W - 4]) { rect(ctx, x, 6, 2, H - 6, INK); rect(ctx, x, 7, 1, H - 8, M.wood[3]); }
    rect(ctx, 1, H - 14, W - 2, 8, INK); rect(ctx, 2, H - 13, W - 4, 6, M.wood[2]); rect(ctx, 2, H - 13, W - 4, 1, M.wood[4]); // counter
    for (let x = 0; x < W; x++) { const s = Math.floor(x / 6) % 2; rect(ctx, x, 2, 1, 10, s ? cl[2] : cl[0]); px(ctx, x, 12, x % 6 < 3 ? cl[1] : INK); }
    rect(ctx, 0, 1, W, 1, INK); snowTop(ctx, 0, 1, W, S);
    if (b.opts.goods === 'apples') for (let i = 0; i < 9; i++) ellipse(ctx, 6 + i * 4 + (i % 2), H - 15 - (i % 3), 1, 1, i % 3 ? '#8f2a2a' : '#b5442e');
    else { // odd things: bottles, a skull, a bundle of cards, candles
      const items = [['#4fd1a5', 3], ['#8f6ad1', 4], ['#d98a4a', 3], [M.bone[2], 3], ['#c9a55a', 2], ['#4fa0d1', 4]];
      items.forEach(([col, h], i) => { const x = 5 + i * 7; rect(ctx, x, H - 14 - h, 3, h, INK); rect(ctx, x + 1, H - 14 - h + 1, 1, h - 1, col); });
      rect(ctx, W - 12, H - 17, 5, 3, '#e9e2c9'); rect(ctx, W - 11, H - 18, 5, 3, '#c9b7e0'); // a stack of cards
    }
    rect(ctx, 3, H - 6, W - 6, 6, 'rgba(0,0,0,0.35)');
    return { canvas: c, over: 14 };
  },
  cart(b, season) {
    const S = SEASONS[season], [c, ctx, W, H] = base(b, 10);
    rect(ctx, 2, 6, W - 6, 12, INK); rect(ctx, 3, 7, W - 8, 10, M.wood[2]); for (let x = 5; x < W - 6; x += 4) rect(ctx, x, 7, 1, 10, M.wood[1]);
    rect(ctx, 3, 7, W - 8, 1, M.wood[4]); snowTop(ctx, 3, 6, W - 8, S);
    line(ctx, W - 5, 14, W - 1, 18, INK); line(ctx, W - 5, 13, W - 1, 17, M.wood[3]); // shaft
    for (const x of [6, W - 12]) { ellipse(ctx, x, H - 5, 4, 4, INK); ellipse(ctx, x, H - 5, 3, 3, M.wood[1]); px(ctx, x, H - 5, M.metal[3]); line(ctx, x - 2, H - 5, x + 2, H - 5, M.wood[3]); line(ctx, x, H - 7, x, H - 3, M.wood[3]); }
    rect(ctx, 8, 3, 6, 4, M.cloth.cream[1]); rect(ctx, 15, 4, 5, 3, M.cloth.ochre[1]); // sacks
    return { canvas: c, over: 10 };
  },
  well(b, season) {
    const S = SEASONS[season], old = b.opts.old, [c, ctx, W, H] = base(b, 16);
    ellipse(ctx, W / 2, H - 9, W / 2 - 1, 8, INK);
    ellipse(ctx, W / 2, H - 9, W / 2 - 2, 7, M.stone[old ? 1 : 2]);
    ellipse(ctx, W / 2, H - 11, W / 2 - 5, 4, '#05060c');
    for (let x = 2; x < W - 2; x += 5) rect(ctx, x, H - 8, 1, 6, M.stone[1]);
    if (!old) {
      for (const x of [3, W - 5]) { rect(ctx, x, 2, 2, H - 10, INK); rect(ctx, x, 3, 1, H - 12, M.wood[3]); }
      rect(ctx, 1, 0, W - 2, 4, INK); rect(ctx, 2, 1, W - 4, 2, M.roof.brown[2]); snowTop(ctx, 2, 0, W - 4, S);
      line(ctx, W / 2, 4, W / 2, H - 16, '#8a7a5a'); rect(ctx, W / 2 - 2, H - 16, 4, 3, M.wood[2]);
    }
    if (S.snow) { ellipse(ctx, W / 2, H - 16, W / 2 - 3, 1, S.snow); }
    return { canvas: c, over: 16 };
  },
  lamp(b, season) {
    const S = SEASONS[season], [c, ctx] = makeCanvas(16, 34);
    rect(ctx, 7, 10, 2, 22, INK); px(ctx, 7, 14, M.metal[2]); rect(ctx, 5, 30, 6, 3, INK); rect(ctx, 6, 30, 4, 1, M.metal[2]);
    rect(ctx, 4, 2, 8, 9, INK); rect(ctx, 5, 4, 6, 6, M.lit[1]); rect(ctx, 6, 5, 4, 3, M.lit[2]); rect(ctx, 3, 1, 10, 2, INK); rect(ctx, 6, 0, 4, 1, INK);
    if (S.snow) rect(ctx, 4, 1, 8, 1, S.snow);
    return { canvas: c, over: 18 };
  },
  barrel(b, season) {
    const S = SEASONS[season], [c, ctx] = makeCanvas(16, 18);
    rect(ctx, 3, 3, 10, 14, INK); rect(ctx, 4, 4, 8, 12, M.wood[2]); rect(ctx, 5, 4, 2, 12, M.wood[3]);
    for (const y of [6, 12]) rect(ctx, 3, y, 10, 1, M.metal[1]);
    ellipse(ctx, 8, 4, 4, 1, M.wood[1]); if (S.snow) ellipse(ctx, 8, 3, 4, 1, S.snow);
    return { canvas: c, over: 2 };
  },
  crate(b, season) {
    const S = SEASONS[season], [c, ctx] = makeCanvas(16, 18);
    rect(ctx, 1, 4, 14, 13, INK); rect(ctx, 2, 5, 12, 11, M.wood[3]); line(ctx, 2, 5, 13, 15, M.wood[1]); line(ctx, 13, 5, 2, 15, M.wood[1]); rect(ctx, 2, 5, 12, 1, M.wood[4]);
    if (S.snow) rect(ctx, 2, 4, 12, 1, S.snow);
    return { canvas: c, over: 2 };
  },
  bench(b, season) {
    const S = SEASONS[season], [c, ctx] = makeCanvas(16, 16);
    rect(ctx, 1, 6, 14, 4, INK); rect(ctx, 2, 7, 12, 2, M.wood[3]); rect(ctx, 3, 10, 2, 5, INK); rect(ctx, 11, 10, 2, 5, INK);
    if (S.snow) rect(ctx, 2, 6, 12, 1, S.snow);
    return { canvas: c, over: 0 };
  },
  woodpile(b, season) {
    const S = SEASONS[season], [c, ctx] = makeCanvas(16, 18);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3 - (r === 2 ? 1 : 0); k++) { const x = 2 + k * 4 + (r === 2 ? 2 : 0), y = 13 - r * 4; ellipse(ctx, x + 2, y + 2, 2, 2, INK); ellipse(ctx, x + 2, y + 2, 1, 1, M.wood[4]); }
    if (S.snow) rect(ctx, 4, 5, 8, 1, S.snow);
    return { canvas: c, over: 2 };
  },
  pillory(b, season) {
    const S = SEASONS[season], [c, ctx] = makeCanvas(16, 34);
    rect(ctx, 7, 6, 3, 27, INK); rect(ctx, 8, 7, 1, 25, M.wood[3]);
    rect(ctx, 0, 6, 16, 6, INK); rect(ctx, 1, 7, 14, 4, M.wood[2]); rect(ctx, 1, 9, 14, 1, INK);
    for (const x of [3, 8, 12]) ellipse(ctx, x, 9, 1, 1, '#05060c');
    if (S.snow) rect(ctx, 1, 6, 14, 1, S.snow);
    return { canvas: c, over: 18 };
  },
  board(b, season) {
    const S = SEASONS[season], [c, ctx] = makeCanvas(16, 26);
    rect(ctx, 2, 12, 2, 13, INK); rect(ctx, 12, 12, 2, 13, INK);
    rect(ctx, 0, 2, 16, 13, INK); rect(ctx, 1, 3, 14, 11, M.wood[2]);
    for (const [x, y, w] of [[2, 4, 5], [8, 5, 5], [3, 9, 4], [9, 10, 4]]) { rect(ctx, x, y, w, 4, '#c9bfa5'); rect(ctx, x + 1, y + 1, w - 2, 1, '#6a6050'); }
    if (S.snow) rect(ctx, 0, 2, 16, 1, S.snow);
    return { canvas: c, over: 10 };
  },
  hay(b, season) {
    const S = SEASONS[season], [c, ctx] = makeCanvas(16, 18);
    ellipse(ctx, 8, 11, 7, 6, INK); ellipse(ctx, 8, 11, 6, 5, '#8a7343'); for (let i = 0; i < 12; i++) px(ctx, 3 + hash(i, 1, 2) * 10, 7 + hash(i, 2, 2) * 8, '#b59a5a');
    if (S.snow) ellipse(ctx, 8, 7, 4, 1, S.snow);
    return { canvas: c, over: 2 };
  },
  snowman() { const [c, ctx] = makeCanvas(16, 20); ellipse(ctx, 8, 14, 5, 5, '#dfe7f4'); ellipse(ctx, 8, 6, 3, 3, '#e6edf7'); px(ctx, 7, 5, INK); px(ctx, 9, 5, INK); px(ctx, 10, 6, '#d9822f'); return { canvas: c, over: 4 }; },
  trough(b) { const [c, ctx, W] = base(b); rect(ctx, 1, 5, W - 2, 9, INK); rect(ctx, 2, 6, W - 4, 3, '#8fa7c4'); rect(ctx, 2, 9, W - 4, 4, M.wood[2]); return { canvas: c, over: 0 }; },

  // ---- forest and depths ----
  campfire() {
    const [c, ctx] = makeCanvas(16, 16);
    ellipse(ctx, 8, 11, 6, 3, '#1a1414');
    for (let k = 0; k < 7; k++) { const a = (k / 7) * Math.PI * 2; ellipse(ctx, Math.round(8 + Math.cos(a) * 6), Math.round(11 + Math.sin(a) * 3), 1, 1, M.stone[3]); }
    line(ctx, 4, 12, 12, 9, M.wood[1]); line(ctx, 4, 9, 12, 12, M.wood[2]);
    return { canvas: c, over: 0 };
  },
  lantern(b, season) {
    const S = SEASONS[season], [c, ctx] = makeCanvas(16, 36);
    rect(ctx, 3, 2, 2, 33, INK); rect(ctx, 3, 3, 1, 31, M.wood[3]); rect(ctx, 3, 2, 11, 2, INK);
    line(ctx, 12, 4, 12, 8, M.metal[2]);
    rect(ctx, 9, 8, 7, 9, INK); rect(ctx, 10, 10, 5, 6, M.lit[1]); rect(ctx, 11, 11, 3, 3, M.lit[2]); rect(ctx, 10, 8, 5, 1, M.metal[2]);
    if (S.snow) rect(ctx, 3, 1, 11, 1, S.snow);
    return { canvas: c, over: 20 };
  },
  stump(b, season) { const S = SEASONS[season], [c, ctx] = makeCanvas(16, 16); ellipse(ctx, 8, 11, 6, 4, INK); rect(ctx, 3, 8, 11, 4, S.bark[1]); ellipse(ctx, 8, 8, 5, 2, M.wood[3]); ellipse(ctx, 8, 8, 2, 1, M.wood[2]); return { canvas: c, over: 0 }; },
  log(b, season) { const S = SEASONS[season], [c, ctx] = makeCanvas(16, 16); rect(ctx, 1, 8, 14, 6, INK); rect(ctx, 2, 9, 12, 4, S.bark[1]); rect(ctx, 2, 9, 12, 1, S.bark[2]); ellipse(ctx, 14, 11, 1, 2, M.wood[3]); return { canvas: c, over: 0 }; },
  spring() {
    const [c, ctx] = makeCanvas(16, 18);
    ellipse(ctx, 8, 11, 7, 5, INK); ellipse(ctx, 8, 11, 6, 4, M.stone[3]); ellipse(ctx, 8, 11, 4, 2, '#4f8fb0'); px(ctx, 6, 10, '#cfe8f5'); px(ctx, 10, 11, '#cfe8f5');
    rect(ctx, 7, 2, 2, 7, INK); px(ctx, 7, 3, M.stone[4]); line(ctx, 8, 6, 8, 9, '#8fc9e0');
    return { canvas: c, over: 2 };
  },
  cross() { // the boundary stone: half for one land, half for the other
    const [c, ctx] = makeCanvas(16, 26);
    rect(ctx, 4, 4, 8, 21, INK); rect(ctx, 5, 5, 3, 19, M.stone[3]); rect(ctx, 8, 5, 3, 19, M.stone[1]);
    ellipse(ctx, 8, 5, 4, 2, INK); rect(ctx, 5, 10, 6, 1, INK); px(ctx, 6, 13, M.stone[4]); px(ctx, 9, 16, M.stone[2]);
    return { canvas: c, over: 10 };
  },
  torch() {
    const [c, ctx] = makeCanvas(16, 20);
    rect(ctx, 7, 6, 2, 9, INK); rect(ctx, 7, 7, 1, 7, M.wood[3]); rect(ctx, 5, 5, 6, 2, M.metal[1]);
    return { canvas: c, over: 4 };
  },
  chains(b) {
    const [c, ctx, W] = base(b, 8);
    for (let x = 3; x < W; x += 8) { for (let y = 0; y < 18; y += 3) { rect(ctx, x, y, 2, 3, INK); px(ctx, x, y + 1, M.metal[2 + (y % 2)]); } rect(ctx, x - 1, 18, 4, 3, M.metal[1]); }
    return { canvas: c, over: 8 };
  },
  pillar() { const [c, ctx] = makeCanvas(16, 32); rect(ctx, 3, 0, 10, 32, INK); rect(ctx, 4, 1, 8, 30, M.stone[2]); rect(ctx, 4, 1, 2, 30, M.stone[3]); return { canvas: c, over: 16 }; },
  ruin(b) {
    const [c, ctx, W, H] = base(b, 26);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const top = 6 + Math.abs(Math.sin(x * 0.4)) * 10 + (x > W * 0.6 ? 12 : 0);
      if (y < top) continue;
      const row = Math.floor(y / 5), off = row % 2 ? 4 : 0, mortar = y % 5 === 0 || (x + off) % 9 === 0;
      px(ctx, x, y, y < top + 1 || x === 0 || x === W - 1 ? INK : mortar ? M.stone[0] : M.stone[1 + (hash((x + off) / 9 | 0, row, 2) > 0.5 ? 1 : 0)]);
    }
    rect(ctx, W / 2 - 4, H - 14, 8, 14, '#05060c'); ellipse(ctx, W / 2, H - 14, 4, 3, '#05060c');
    return { canvas: c, over: 26 };
  },
  bones() {
    const [c, ctx] = makeCanvas(16, 16);
    ellipse(ctx, 6, 10, 3, 2, M.bone[1]); px(ctx, 5, 10, INK); px(ctx, 7, 10, INK); line(ctx, 9, 12, 14, 9, M.bone[0]); line(ctx, 2, 13, 6, 14, M.bone[0]);
    return { canvas: c, over: 0 };
  },
  mushrooms() {
    const [c, ctx] = makeCanvas(16, 16);
    for (const [x, y, r, col] of [[5, 9, 2, '#8f3d3c'], [10, 11, 3, '#b5662e'], [7, 13, 1, '#c9b7e0']]) { rect(ctx, x, y, 1, 3, M.bone[2]); ellipse(ctx, x, y, r, 1, col); px(ctx, x - 1, y, '#e9e2c9'); }
    return { canvas: c, over: 0 };
  },
  candles() {
    const [c, ctx] = makeCanvas(16, 16);
    for (const [x, h] of [[4, 6], [8, 9], [11, 5]]) { rect(ctx, x, 14 - h, 2, h, M.bone[2]); px(ctx, x, 14 - h, M.bone[1]); }
    ellipse(ctx, 8, 14, 6, 1, M.bone[1]);
    return { canvas: c, over: 0 };
  },
  cauldron(b) {
    const big = b.w > 1, [c, ctx, W, H] = base(b, 4);
    const cx = W / 2, r = big ? 12 : 6;
    for (const [x, y] of [[-3, 2], [3, 2], [0, 4]]) { const k = big ? 2 : 1; line(ctx, cx + x * k * 1.4, H - 6, cx + x * k * 1.4, H - 2, M.wood[1]); void y; }
    ellipse(ctx, cx, H - (big ? 14 : 8), r, big ? 9 : 5, INK); ellipse(ctx, cx, H - (big ? 14 : 8), r - 1, big ? 8 : 4, M.metal[1]);
    ellipse(ctx, cx, H - (big ? 19 : 11), r - 1, big ? 3 : 2, '#3f8f5a'); px(ctx, cx - 2, H - (big ? 20 : 12), '#8fe0a0');
    return { canvas: c, over: 4 };
  },
};
