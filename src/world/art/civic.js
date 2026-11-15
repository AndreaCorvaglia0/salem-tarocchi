// The big buildings: the meetinghouse with its belfry, the stone court with columns, the forest
// watermill. Same return shape as houses.js: { canvas, over, windows, smoke }.
import { SEASONS, M, INK } from './palette.js';
import { makeCanvas, hash, rect, px, line, ellipse } from './px.js';
import { windowAt, snowCap } from './houses.js';

function shingles(ctx, x0, y0, w, h, pal, S) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const row = Math.floor(y / 3), off = row % 2 ? 2 : 0;
    let col = (x + off) % 5 === 0 || y % 3 === 0 ? pal[0] : hash(Math.floor((x + off) / 5), row, 4) > 0.7 ? pal[2] : pal[1];
    if (y === 0 || y === h - 1 || x === 0 || x === w - 1) col = INK;
    px(ctx, x0 + x, y0 + y, col);
  }
  if (S.snow) snowCap(ctx, x0, y0, w, h, S, 0.6);
}

export function meeting(b, season) {
  const S = SEASONS[season], T = 16;
  const W = b.w * T, over = 44, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 36, fy = H - fh, cx = W >> 1;
  shingles(ctx, 0, over - 6, W, fy - over + 8, M.roof.slate, S);
  // belfry: a pale square tower with louvers, a cornice and a tall spire
  const bw = 9, by0 = 22, wall = ['#4a4858', '#5d5b6c', '#73718a'];
  rect(ctx, cx - bw - 1, by0, bw * 2 + 2, over - by0 + 8, INK);
  for (let y = by0 + 1; y < over + 7; y++) for (let x = cx - bw; x < cx + bw; x++) px(ctx, x, y, x < cx - bw + 3 ? wall[2] : x > cx + bw - 4 ? wall[0] : (y % 4 === 0 ? wall[0] : wall[1]));
  rect(ctx, cx - 4, by0 + 5, 8, 10, INK); ellipse(ctx, cx, by0 + 5, 4, 3, INK);
  rect(ctx, cx - 3, by0 + 5, 6, 10, '#1a1d2c'); ellipse(ctx, cx, by0 + 5, 3, 2, '#1a1d2c');
  for (let y = by0 + 7; y < by0 + 15; y += 2) rect(ctx, cx - 3, y, 6, 1, wall[0]); // louvers
  rect(ctx, cx - bw - 2, by0 - 2, bw * 2 + 4, 3, INK); rect(ctx, cx - bw - 1, by0 - 1, bw * 2 + 2, 1, S.snow || wall[2]);
  for (let y = 0; y < by0 - 2; y++) { const w = Math.round(((y + 1) / (by0 - 2)) * bw); for (let x = cx - w; x <= cx + w; x++) px(ctx, x, y, x === cx - w || x === cx + w ? INK : x < cx ? M.roof.slate[2] : M.roof.slate[1]); if (S.snow && y > 3 && y % 3 === 0) px(ctx, cx - w + 1, y, S.snow); }
  px(ctx, cx, 0, '#c9a55a');
  // white clapboard front (a plain Puritan meetinghouse)
  const pal = ['#3d3b49', '#4f4d5c', '#615f70', '#73718a'];
  for (let y = 0; y < fh; y++) for (let x = 1; x < W - 1; x++) px(ctx, x, fy + y, x === 1 || x === W - 2 ? INK : y % 4 === 0 ? pal[0] : y % 4 === 1 ? pal[2] : pal[1]);
  const dc = b.doors[0]?.[0] ?? 3, dx = dc * T + 8;
  rect(ctx, dx - 7, H - 21, 14, 21, INK); rect(ctx, dx - 6, H - 20, 12, 20, M.wood[1]); rect(ctx, dx, H - 20, 1, 20, INK);
  rect(ctx, dx - 6, H - 22, 12, 2, pal[3]); px(ctx, dx - 2, H - 10, '#c9a55a'); px(ctx, dx + 2, H - 10, '#c9a55a');
  rect(ctx, dx - 8, H - 1, 16, 1, M.stone[2]);
  const windows = [];
  for (const col of [0, 1, 5, 6].filter((c0) => c0 < b.w && Math.abs(c0 - dc) > 1)) {
    const x = col * T + 4, lit = col === 1;
    windowAt(ctx, x, fy + 8, 8, 14, lit ? 'dim' : 'dark', { snow: S.snow });
    windows.push({ x: x + 4, y: fy + 15, lit });
  }
  return { canvas: c, over, windows, smoke: null };
}

export function court(b, season) {
  const S = SEASONS[season], T = 16;
  const W = b.w * T, over = 18, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 50, fy = H - fh;
  // stone roof with a pediment
  shingles(ctx, 0, 8, W, fy - 4, ['#1f1e27', '#2b2a35', '#383643'], S);
  for (let y = 0; y < 14; y++) { const w = Math.round((y / 13) * (W / 2 - 6)); rect(ctx, (W >> 1) - w, fy - 14 + y, w * 2, 1, y === 13 ? INK : M.stone[2 + (y % 3 === 0 ? 1 : 0)]); px(ctx, (W >> 1) - w, fy - 14 + y, INK); px(ctx, (W >> 1) + w - 1, fy - 14 + y, INK); }
  ellipse(ctx, W >> 1, fy - 6, 3, 3, INK); ellipse(ctx, W >> 1, fy - 6, 2, 2, M.stone[4]); // a round seal
  line(ctx, (W >> 1) - 2, fy - 6, (W >> 1) + 2, fy - 6, INK);
  // stone wall
  for (let y = 0; y < fh; y++) for (let x = 1; x < W - 1; x++) {
    const row = Math.floor(y / 5), off = row % 2 ? 6 : 0, mortar = y % 5 === 0 || (x + off) % 12 === 0;
    px(ctx, x, fy + y, x === 1 || x === W - 2 ? INK : mortar ? M.stone[1] : M.stone[2 + (hash((x + off) / 12 | 0, row, 5) > 0.6 ? 1 : 0)]);
  }
  // columns
  for (const col of [0, 2, 4, 6].filter((k) => k < b.w)) {
    const x = col * T + (col === 0 ? 3 : col === b.w - 1 ? 7 : 5);
    rect(ctx, x, fy + 2, 6, fh - 4, INK); rect(ctx, x + 1, fy + 3, 4, fh - 6, M.stone[3]); rect(ctx, x + 1, fy + 3, 1, fh - 6, M.stone[4]);
    rect(ctx, x - 1, fy + 1, 8, 3, INK); rect(ctx, x, fy + 2, 6, 1, M.stone[4]);
    if (S.snow) rect(ctx, x - 1, fy + 1, 8, 1, S.snow);
  }
  const windows = [];
  for (const col of [1, 5].filter((k) => k < b.w)) {
    const x = col * T + 3;
    windowAt(ctx, x, fy + 10, 10, 18, col === 5 ? 'dim' : 'dark', { snow: S.snow });
    windows.push({ x: x + 5, y: fy + 19, lit: col === 5 });
  }
  const dc = b.doors[0]?.[0] ?? 3, dx = dc * T + 8;
  rect(ctx, dx - 7, H - 24, 14, 24, INK); rect(ctx, dx - 6, H - 23, 12, 23, '#241a1a'); rect(ctx, dx, H - 23, 1, 23, INK);
  for (let y = H - 20; y < H - 2; y += 6) { px(ctx, dx - 3, y, '#7a6a4a'); px(ctx, dx + 3, y, '#7a6a4a'); }
  rect(ctx, dx - 10, H - 2, 20, 2, M.stone[3]); rect(ctx, dx - 9, H - 3, 18, 1, M.stone[4]);
  return { canvas: c, over, windows, smoke: null };
}

export function mill(b, season) {
  const S = SEASONS[season], T = 16;
  const W = b.w * T + 12, over = 14, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const fh = 30, fy = H - fh;
  shingles(ctx, 0, 4, b.w * T, fy - 2, M.roof.brown, S);
  for (let y = 0; y < fh; y++) for (let x = 1; x < b.w * T - 1; x++) px(ctx, x, fy + y, x === 1 || x === b.w * T - 2 ? INK : x % 6 === 0 ? M.wood[1] : M.wood[2 + (y % 7 === 0 ? 1 : 0)]);
  rect(ctx, 22, H - 16, 12, 16, INK); rect(ctx, 23, H - 15, 10, 15, M.wood[0]);
  windowAt(ctx, 7, fy + 6, 8, 8, 'dim', {});
  // the wheel on the stream side
  const wx = b.w * T + 2, wy = H - 18;
  ellipse(ctx, wx, wy, 9, 14, INK); ellipse(ctx, wx, wy, 7, 12, M.wood[1]); ellipse(ctx, wx, wy, 4, 8, M.wood[0]);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(ctx, wx, wy, Math.round(wx + Math.cos(a) * 8), Math.round(wy + Math.sin(a) * 13), M.wood[3]); }
  return { canvas: c, over, windows: [{ x: 11, y: fy + 10, lit: true }], smoke: null };
}
