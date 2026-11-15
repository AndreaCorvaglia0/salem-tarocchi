// Things that grow or stand on a single tile: trees (re-tinted by season), pines, dead trees,
// bushes, fences, rocks, low stone walls, graves, herb beds, iron bars, tall grass tufts.
// Each painter returns a canvas; makeNature(scene, season) registers them as textures.
import { SEASONS, M, INK } from './palette.js';
import { makeCanvas, hash, noise, rect, px, ellipse, line, mix, addTex } from './px.js';

function blobs(ctx, list, pal, seed, edge, w, h) {
  const inside = (x, y) => list.some(([bx, by, r]) => (x - bx) ** 2 + (y - by) ** 2 <= r * r);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!inside(x, y)) continue;
    let best = list[0], bd = 1e9;
    for (const b of list) { const d = (x - b[0]) ** 2 + (y - b[1]) ** 2 - b[2] * b[2]; if (d < bd) { bd = d; best = b; } }
    const nx = (x - best[0]) / best[2], ny = (y - best[1]) / best[2];
    const l = -0.55 * nx - 0.8 * ny + (noise(x * 0.5, y * 0.5, seed) - 0.5) * 0.6;
    let col = l > 0.6 ? pal[3] : l > 0.15 ? pal[2] : l < -0.45 ? pal[0] : pal[1];
    if (pal[4] && hash(x, y, seed + 2) > 0.94 && l > -0.2) col = pal[4];
    const e = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
    px(ctx, x, y, e ? edge : col);
  }
  return inside;
}

function trunk(ctx, x, y, h, S) {
  rect(ctx, x - 2, y - h, 5, h, S.bark[0]);
  rect(ctx, x - 1, y - h, 2, h, S.bark[1]);
  px(ctx, x - 1, y - h + 3, S.bark[2]); px(ctx, x, y - 4, S.bark[2]);
  rect(ctx, x - 3, y - 1, 7, 1, S.bark[0]);
}

export function tree(season, v) {
  const S = SEASONS[season];
  const [c, ctx] = makeCanvas(32, 42);
  if (!S.crown) { // winter: bare branches, snow on them
    trunk(ctx, 16, 41, 22, S);
    const br = v ? [[16, 20, 7, 6], [16, 24, 25, 10], [16, 16, 13, 3], [16, 22, 22, 14], [16, 14, 19, 4]] : [[16, 20, 6, 9], [16, 22, 26, 8], [16, 15, 12, 4], [16, 18, 21, 5], [16, 26, 9, 16]];
    for (const [x0, y0, x1, y1] of br) { line(ctx, x0, y0, x1, y1, S.bark[1]); line(ctx, x0, y0 - 1, x1, y1 - 1, S.bark[0]); px(ctx, x1, y1 - 1, S.snow); px(ctx, (x0 + x1) >> 1, ((y0 + y1) >> 1) - 1, S.snow); }
    for (let i = 0; i < 18; i++) { const x = 6 + Math.floor(hash(i, v, 3) * 20), y = 4 + Math.floor(hash(i, v, 4) * 16); px(ctx, x, y, S.bark[1]); px(ctx, x, y - 1, S.snowShade); }
    return c;
  }
  trunk(ctx, 16, 41, 14, S);
  const list = v ? [[16, 15, 11], [8, 19, 7], [24, 19, 7], [16, 7, 7], [11, 10, 6], [21, 10, 6]] : [[16, 16, 10], [9, 18, 8], [23, 17, 8], [15, 8, 8], [20, 23, 6], [11, 24, 5]];
  blobs(ctx, list, S.crown, 3 + v, INK, 32, 32);
  return c;
}

export function pine(season, v) {
  const S = SEASONS[season];
  const [c, ctx] = makeCanvas(24, 40);
  rect(ctx, 10, 32, 4, 7, S.bark[0]); rect(ctx, 11, 32, 2, 7, S.bark[1]);
  const tiers = [[34, 11], [27, 9], [20, 7], [13, 5]];
  tiers.forEach(([by, r], i) => {
    const top = by - 11 + i;
    for (let y = top; y <= by; y++) {
      const t = (y - top) / (by - top), w = Math.round(1 + t * r + (hash(y, i, v) > 0.6 ? 1 : 0));
      for (let x = 12 - w; x <= 12 + w - 1; x++) {
        const side = (x - 12) / (w + 1);
        let col = side < -0.3 ? S.leaf[2] : side > 0.4 ? S.leaf[0] : S.leaf[1];
        if (y === by || x === 12 - w || x === 12 + w - 1) col = INK;
        if (S.snow && (y === top + Math.floor(t * 2) || (y < by - 1 && hash(x, y, 9 + v) > 0.8 && side < 0.2 && y - top < 4))) col = y === top ? S.snowShade : S.snow;
        px(ctx, x, y, col);
      }
    }
    if (S.snow) for (let x = 12 - Math.round(r * 0.8); x < 12 + Math.round(r * 0.5); x++) if (hash(x, by, v) > 0.3) px(ctx, x, by - 1, S.snow);
  });
  px(ctx, 12, 1, S.snow || S.leaf[2]);
  return c;
}

export function deadtree(season, v) {
  const S = SEASONS[season];
  const [c, ctx] = makeCanvas(24, 36);
  rect(ctx, 10, 14, 4, 21, S.bark[0]); rect(ctx, 11, 14, 1, 21, S.bark[1]);
  for (const [x0, y0, x1, y1] of [[12, 18, 4, 9], [12, 16, 20, 6], [12, 14, 13, 2], [4, 9, 2, 5], [20, 6, 22, 2], [12, 22, 19, 17]]) { line(ctx, x0, y0, x1, y1, S.bark[0]); line(ctx, x0 + 1, y0, x1 + 1, y1, S.bark[1]); }
  if (S.snow) [[4, 8], [20, 5], [13, 1], [18, 16]].forEach(([x, y]) => px(ctx, x, y, S.snow));
  void v;
  return c;
}

export function bush(season) {
  const S = SEASONS[season];
  const [c, ctx] = makeCanvas(16, 16);
  const pal = [S.leaf[0], S.leaf[1], S.leaf[2], S.leaf[3], season === 'spring' ? S.flower[0] : null];
  const inside = blobs(ctx, [[8, 10, 6], [4, 12, 4], [12, 12, 4], [8, 6, 4]], pal, 4, INK, 16, 16);
  if (S.snow) for (let x = 0; x < 16; x++) for (let y = 0; y < 16; y++) if (inside(x, y) && !inside(x, y - 1)) { px(ctx, x, y, S.snow); if (inside(x, y + 1) && hash(x, y, 2) > 0.4) px(ctx, x, y + 1, S.snowShade); }
  return c;
}

export function fence(season, dir) { // dir: 'h' | 'v' | 'post'
  const S = SEASONS[season], W = M.wood;
  const [c, ctx] = makeCanvas(16, 20);
  if (dir === 'v') { rect(ctx, 6, 0, 4, 18, INK); rect(ctx, 7, 0, 2, 17, W[3]); px(ctx, 7, 4, W[4]); px(ctx, 7, 11, W[4]); if (S.snow) rect(ctx, 7, 0, 2, 1, S.snow); return c; }
  for (const x of [1, 13]) { rect(ctx, x, 6, 3, 13, INK); rect(ctx, x + 1, 7, 1, 11, W[3]); if (S.snow) px(ctx, x + 1, 6, S.snow); }
  if (dir === 'h') for (const y of [9, 14]) { rect(ctx, 0, y, 16, 3, INK); rect(ctx, 0, y + 1, 16, 1, W[3]); if (S.snow) rect(ctx, 0, y, 16, 1, S.snow); }
  return c;
}

export function rock(season, v) {
  const S = SEASONS[season];
  const [c, ctx] = makeCanvas(16, 16);
  blobs(ctx, v ? [[8, 10, 6], [5, 11, 4], [11, 9, 4]] : [[7, 10, 6], [11, 11, 4]], [M.stone[1], M.stone[2], M.stone[3], M.stone[4]], 6 + v, INK, 16, 16);
  if (S.snow) for (let x = 3; x < 13; x++) px(ctx, x, 4 + Math.abs(x - 8) * 0.4, S.snow);
  return c;
}

export function stonewall(season, joinL, joinR) {
  const S = SEASONS[season];
  const [c, ctx] = makeCanvas(16, 16);
  const x0 = joinL ? 0 : 1, x1 = joinR ? 16 : 15;
  rect(ctx, x0, 4, x1 - x0, 12, INK);
  for (let r = 0; r < 3; r++) for (let k = -1; k < 4; k++) {
    const sx = k * 5 + (r % 2 ? 2 : 0), sy = 5 + r * 4;
    const a = Math.max(x0 + 1, sx), b = Math.min(x1 - 1, sx + 4);
    if (b > a) { rect(ctx, a, sy, b - a, 3, M.stone[2 + (hash(k, r, 3) > 0.5 ? 1 : 0)]); px(ctx, a, sy, M.stone[4]); }
  }
  if (S.snow) rect(ctx, x0, 4, x1 - x0, 1, S.snow);
  return c;
}

export function grave(season, v) {
  const S = SEASONS[season];
  const [c, ctx] = makeCanvas(16, 20);
  ellipse(ctx, 8, 18, 6, 2, 'rgba(0,0,0,0.35)');
  if (v) { rect(ctx, 7, 3, 3, 15, INK); rect(ctx, 3, 7, 11, 3, INK); rect(ctx, 8, 4, 1, 13, M.stone[3]); rect(ctx, 4, 8, 9, 1, M.stone[3]); }
  else { ellipse(ctx, 8, 8, 5, 5, INK); rect(ctx, 3, 8, 11, 10, INK); ellipse(ctx, 8, 8, 4, 4, M.stone[2]); rect(ctx, 4, 8, 9, 9, M.stone[2]); rect(ctx, 4, 5, 1, 12, M.stone[3]); rect(ctx, 6, 9, 5, 1, M.stone[1]); rect(ctx, 6, 11, 4, 1, M.stone[1]); }
  if (S.snow) rect(ctx, 5, 3 + (v ? 0 : 1), 6, 1, S.snow);
  return c;
}

export function herbs(season, v) {
  const S = SEASONS[season];
  const [c, ctx] = makeCanvas(16, 16);
  for (let i = 0; i < 4; i++) {
    const x = 2 + i * 4, y = 5 + (i % 2) * 6;
    const h = 4 + Math.floor(hash(i, v, 1) * 3);
    for (let k = 0; k < h; k++) { px(ctx, x, y + 4 - k, M.herb[1]); if (k > 1) { px(ctx, x - 1, y + 4 - k, M.herb[k % 2 ? 0 : 2]); px(ctx, x + 1, y + 4 - k - 1, M.herb[2]); } }
    if (hash(i, v, 2) > 0.5) px(ctx, x, y + 4 - h, M.herb[3]);
    if (S.snow) px(ctx, x, y + 3 - h, S.snow);
  }
  return c;
}

export function bars() {
  const [c, ctx] = makeCanvas(16, 22);
  rect(ctx, 0, 3, 16, 2, M.metal[0]); rect(ctx, 0, 3, 16, 1, M.metal[2]);
  for (let x = 1; x < 16; x += 4) { rect(ctx, x, 3, 2, 19, M.metal[0]); px(ctx, x, 5, M.metal[3]); rect(ctx, x, 6, 1, 15, M.metal[2]); }
  return c;
}

export function tallGrass(season, front, sway) {
  const S = SEASONS[season];
  const [c, ctx] = makeCanvas(16, 16);
  const tufts = [[2, 9], [7, 7], [12, 9], [4, 15], [10, 14], [14, 15], [0, 14]];
  for (const [tx, ty] of tufts) {
    if (front && ty < 12) continue;
    for (const [dx, hgt] of [[-2, 4], [-1, 6], [0, 8], [1, 6], [2, 4], [3, 3]]) for (let k = 0; k < hgt; k++) {
      const lean = sway && k > hgt / 2 ? 1 : 0, x = tx + dx + lean, y = ty - k;
      if (x < 0 || x > 15 || y < 0) continue;
      px(ctx, x, y, k === hgt - 1 ? S.grass[2] : k > hgt / 2 ? S.grass[1] : S.grass[0]);
    }
  }
  return c;
}

// Register every nature texture for a season (keys end with the season).
export function makeNature(scene, season) {
  const k = (n) => `${n}-${season}`;
  if (scene.textures.exists(k('pine-0'))) return;
  for (const v of [0, 1]) {
    addTex(scene, k(`tree-${v}`), tree(season, v)); addTex(scene, k(`pine-${v}`), pine(season, v));
    addTex(scene, k(`rock-${v}`), rock(season, v)); addTex(scene, k(`grave-${v}`), grave(season, v)); addTex(scene, k(`herbs-${v}`), herbs(season, v));
  }
  addTex(scene, k('deadtree-0'), deadtree(season, 0)); addTex(scene, k('bush-0'), bush(season));
  for (const d of ['h', 'v', 'post']) addTex(scene, k(`fence-${d}`), fence(season, d));
  for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) addTex(scene, k(`stonewall-${a}${b}`), stonewall(season, a, b));
  addTex(scene, k('bars-0'), bars());
  for (const f of [0, 1]) for (const s of [0, 1]) addTex(scene, k(`grass-${f ? 'front' : 'back'}-${s}`), tallGrass(season, f, s));
  void mix;
}
