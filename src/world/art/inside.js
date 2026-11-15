// Furniture of the rooms: hearths, tables (the reading table has cards on it), beds, shelves with
// jars, the shop counter, the lectern with the Bible, pews, the Judge's dais, the dock, the deposit
// cabinet, windows with moonlight, candles, herbs hanging from a beam, chests, a plant.
// Same shape as props.js: (b, season) -> { canvas, over }.
import { M, INK } from './palette.js';
import { makeCanvas, hash, rect, px, line, ellipse } from './px.js';

const T = 16;
const base = (b, over = 0) => { const [c, ctx] = makeCanvas(b.w * T, b.h * T + over); return [c, ctx, b.w * T, b.h * T + over]; };
const W4 = M.wood;

export const INSIDE = {
  hearth(b) {
    const [c, ctx, W, H] = base(b, 0);
    rect(ctx, 0, 0, W, H, INK);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const r = Math.floor(y / 4), off = r % 2 ? 3 : 0; px(ctx, x, y, y % 4 === 0 || (x + off) % 6 === 0 ? M.stone[1] : M.stone[2 + (hash((x + off) / 6 | 0, r, 3) > 0.6 ? 1 : 0)]); }
    const ow = W - 10, oy = H - 14;
    rect(ctx, 5, oy, ow, 13, '#0a0608'); ellipse(ctx, W / 2, oy, ow / 2, 3, '#0a0608');
    rect(ctx, 3, oy - 4, W - 6, 3, W4[1]); rect(ctx, 3, oy - 4, W - 6, 1, W4[3]); // mantel
    line(ctx, 8, H - 3, W - 8, H - 4, W4[1]); line(ctx, 9, H - 4, W - 9, H - 2, W4[2]); // logs
    if (!b.opts.small) { rect(ctx, 6, oy - 8, 3, 4, '#8f6a4a'); rect(ctx, W - 10, oy - 7, 3, 3, '#c9b7e0'); }
    return { canvas: c, over: 0 };
  },
  table(b) {
    const [c, ctx, W, H] = base(b, 4);
    const cl = b.opts.cloth ? M.cloth[b.opts.cloth] : null;
    rect(ctx, 1, 2, W - 2, H - 7, INK); rect(ctx, 2, 3, W - 4, H - 10, cl ? cl[1] : W4[3]); rect(ctx, 2, 3, W - 4, 1, cl ? cl[2] : W4[4]);
    rect(ctx, 2, H - 8, W - 4, 2, cl ? cl[0] : W4[1]);
    for (const x of [3, W - 5]) rect(ctx, x, H - 6, 2, 6, INK);
    if (b.opts.cards) { for (let i = 0; i < 3; i++) { rect(ctx, 6 + i * 6, 5, 5, 7, INK); rect(ctx, 7 + i * 6, 6, 3, 5, i === 1 ? '#e9e2c9' : '#5c3a6e'); } rect(ctx, W - 7, 4, 2, 4, M.bone[2]); }
    else { ellipse(ctx, W / 2 - 4, 7, 2, 1, '#c9bfa5'); rect(ctx, W / 2 + 3, 5, 3, 4, M.metal[2]); }
    return { canvas: c, over: 4 };
  },
  chair(b) {
    const high = b.opts.high, [c, ctx] = makeCanvas(16, high ? 30 : 22);
    const H = high ? 30 : 22;
    rect(ctx, 3, 0, 10, H - 9, INK); rect(ctx, 4, 1, 8, H - 11, high ? '#3d1f26' : W4[2]);
    rect(ctx, 2, H - 10, 12, 4, INK); rect(ctx, 3, H - 9, 10, 2, W4[3]); rect(ctx, 3, H - 6, 2, 6, INK); rect(ctx, 11, H - 6, 2, 6, INK);
    return { canvas: c, over: H - 16 };
  },
  bed(b) {
    const [c, ctx, W, H] = base(b, 4);
    const q = M.cloth[b.opts.quilt] || M.cloth.red;
    rect(ctx, 0, 0, W, H, INK); rect(ctx, 1, 1, W - 2, H - 2, W4[2]);
    const vertical = b.h > b.w;
    if (vertical) { rect(ctx, 2, 4, W - 4, 7, '#d3cab6'); rect(ctx, 2, 12, W - 4, H - 14, q[1]); for (let y = 14; y < H - 2; y += 4) rect(ctx, 2, y, W - 4, 1, q[0]); rect(ctx, 2, 12, W - 4, 1, q[2]); }
    else { rect(ctx, 2, 3, 7, H - 6, '#d3cab6'); rect(ctx, 10, 2, W - 12, H - 4, q[1]); for (let x = 12; x < W - 2; x += 4) rect(ctx, x, 2, 1, H - 4, q[0]); }
    return { canvas: c, over: 4 };
  },
  shelf(b) {
    const [c, ctx, W, H] = base(b, 0);
    rect(ctx, 0, 0, W, H, INK); rect(ctx, 1, 1, W - 2, H - 2, W4[1]);
    for (const y of [5, 10, 15]) rect(ctx, 1, y, W - 2, 1, W4[3]);
    const cols = b.opts.jars ? ['#4fd1a5', '#8f6ad1', '#d98a4a', '#c9b7e0', '#4fa0d1', '#b5442e'] : ['#6e4a35', '#8a6243', '#553457', '#36503f', '#8f3d3c'];
    for (let r = 0; r < 3; r++) for (let x = 2; x < W - 2; x += 3) { const h = 2 + Math.floor(hash(x, r, b.x) * 2); rect(ctx, x, r * 5 + 5 - h, 2, h, cols[Math.floor(hash(x, r, 7) * cols.length)]); }
    return { canvas: c, over: 0 };
  },
  counter(b) {
    const [c, ctx, W, H] = base(b, 6);
    rect(ctx, 0, 2, W, H - 2, INK); rect(ctx, 1, 3, W - 2, 5, W4[3]); rect(ctx, 1, 3, W - 2, 1, W4[4]); rect(ctx, 1, 8, W - 2, H - 9, W4[1]);
    for (let x = 6; x < W - 2; x += 8) rect(ctx, x, 9, 1, H - 10, W4[0]);
    rect(ctx, 6, 0, 3, 4, '#8f6ad1'); rect(ctx, 14, 1, 5, 3, '#c9bfa5'); ellipse(ctx, W - 10, 2, 3, 2, M.bone[2]); px(ctx, W - 11, 2, INK); px(ctx, W - 9, 2, INK);
    return { canvas: c, over: 6 };
  },
  lectern(b) {
    const [c, ctx] = makeCanvas(16, 26);
    rect(ctx, 6, 12, 4, 13, INK); rect(ctx, 7, 13, 2, 11, W4[3]); rect(ctx, 3, 23, 10, 3, INK);
    rect(ctx, 1, 6, 14, 7, INK); rect(ctx, 2, 7, 12, 5, '#3a1e1e'); rect(ctx, 2, 7, 5, 4, '#d8d1bf'); rect(ctx, 8, 7, 5, 4, '#cfc8b4'); rect(ctx, 7, 7, 1, 5, INK); // the open Bible
    rect(ctx, 9, 12, 1, 3, '#8f2a2a'); // a ribbon
    void b; return { canvas: c, over: 10 };
  },
  pews(b) {
    const [c, ctx, W, H] = base(b, 6);
    rect(ctx, 0, 0, W, 9, INK); rect(ctx, 1, 1, W - 2, 7, W4[2]); rect(ctx, 1, 1, W - 2, 1, W4[3]);
    rect(ctx, 0, 10, W, 6, INK); rect(ctx, 1, 11, W - 2, 3, W4[3]);
    for (const x of [1, W - 3]) rect(ctx, x, 14, 2, H - 14, INK);
    return { canvas: c, over: 6 };
  },
  dais(b) {
    const [c, ctx, W, H] = base(b, 8);
    rect(ctx, 0, 12, W, H - 12, INK); rect(ctx, 1, 13, W - 2, H - 14, W4[2]); rect(ctx, 1, 13, W - 2, 2, W4[4]);
    for (let x = 3; x < W - 3; x += 5) rect(ctx, x, 16, 1, H - 18, W4[1]);
    rect(ctx, W / 2 - 8, 0, 16, 20, INK); rect(ctx, W / 2 - 7, 1, 14, 18, '#3d1f26'); rect(ctx, W / 2 - 7, 1, 14, 2, '#c9a55a'); // the high chair
    rect(ctx, W / 2 - 5, 4, 10, 10, '#5c2c38');
    return { canvas: c, over: 8 };
  },
  dock(b) {
    const [c, ctx, W, H] = base(b, 6);
    rect(ctx, 0, 0, W, 3, INK); rect(ctx, 1, 1, W - 2, 1, W4[4]);
    for (let x = 1; x < W; x += 4) rect(ctx, x, 1, 2, H - 2, INK);
    for (let x = 2; x < W; x += 4) rect(ctx, x, 3, 1, H - 4, W4[3]);
    rect(ctx, 0, H - 3, W, 3, INK);
    return { canvas: c, over: 6 };
  },
  cabinet(b) {
    const [c, ctx] = makeCanvas(16, 30);
    rect(ctx, 0, 0, 16, 30, INK); rect(ctx, 1, 1, 14, 28, W4[1]); rect(ctx, 2, 2, 5, 25, W4[2]); rect(ctx, 9, 2, 5, 25, W4[2]);
    rect(ctx, 6, 12, 4, 5, M.metal[2]); px(ctx, 8, 14, INK); // a lock
    void b; return { canvas: c, over: 14 };
  },
  window(b) {
    const tall = b.opts.tall, [c, ctx] = makeCanvas(16, 16);
    const h = tall ? 12 : 9, y = tall ? 2 : 4;
    rect(ctx, 3, y - 1, 10, h + 2, INK); rect(ctx, 4, y, 8, h, '#2b3a66'); rect(ctx, 4, y, 4, h >> 1, '#5a6f9e');
    px(ctx, 10, y + 2, '#e8eef8'); rect(ctx, 8, y, 1, h, INK); rect(ctx, 4, y + (h >> 1), 8, 1, INK);
    rect(ctx, 2, y + h + 1, 12, 2, W4[3]);
    return { canvas: c, over: 0, wall: true };
  },
  stairs(b) {
    const [c, ctx, W, H] = base(b, 0);
    for (let i = 0; i < 4; i++) { rect(ctx, 0, i * 4, W, 4, INK); rect(ctx, 1 + i, i * 4 + 1, W - 2 - i * 2, 2, M.stone[3 - Math.min(2, i)]); }
    return { canvas: c, over: 0 };
  },
  candle() {
    const [c, ctx] = makeCanvas(16, 22);
    rect(ctx, 7, 5, 2, 15, INK); rect(ctx, 5, 19, 6, 2, M.metal[2]); rect(ctx, 6, 6, 4, 6, M.bone[2]); rect(ctx, 6, 6, 1, 6, '#ffffff');
    return { canvas: c, over: 6 };
  },
  herbsHang(b) {
    const [c, ctx, W] = base(b, 0);
    rect(ctx, 0, 2, W, 2, W4[1]);
    for (let x = 2; x < W; x += 4) { line(ctx, x, 4, x, 7, '#6a5a3a'); for (let k = 0; k < 5; k++) px(ctx, x + (k % 2 ? 1 : -1), 8 + k, M.herb[k % 3]); px(ctx, x, 13, M.herb[3]); }
    return { canvas: c, over: 0, wall: true };
  },
  chest() {
    const [c, ctx] = makeCanvas(16, 16);
    rect(ctx, 1, 4, 14, 11, INK); rect(ctx, 2, 5, 12, 9, W4[2]); rect(ctx, 2, 5, 12, 3, W4[3]); rect(ctx, 2, 8, 12, 1, INK);
    rect(ctx, 7, 7, 2, 3, '#c9a55a'); for (const x of [3, 12]) rect(ctx, x, 5, 1, 9, M.metal[1]);
    return { canvas: c, over: 0 };
  },
  plant() {
    const [c, ctx] = makeCanvas(16, 20);
    rect(ctx, 4, 13, 8, 6, INK); rect(ctx, 5, 14, 6, 4, '#7a3d2a');
    for (let k = 0; k < 9; k++) { const a = -Math.PI / 2 + (k - 4) * 0.35; line(ctx, 8, 13, Math.round(8 + Math.cos(a) * 7), Math.round(13 + Math.sin(a) * 10), k % 2 ? M.herb[1] : M.herb[2]); }
    return { canvas: c, over: 4 };
  },
  rugdeco(b) { const [c] = base(b, 0); return { canvas: c, over: 0 }; },
  bench2(b) { return INSIDE.pews(b); },
};
