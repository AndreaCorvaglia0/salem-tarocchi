// Paints the ground of a whole map into one canvas, pixel by pixel: snow, grass or leaf litter by
// season, trodden paths with soft edges, cobbles, ice and water, wooden floors, flagstones, rugs
// and the walls of rooms and cellars (a dark top and a lit face).
import { SEASONS, M } from './palette.js';
import { makeCanvas, hexToRgb, hash, noise, fbm } from './px.js';

const T = 16;
const SOFT = new Set(['ground', 'path', 'soil', 'water']);
const C = (hex) => hexToRgb(hex);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const ramp = (cols, t) => { const n = cols.length - 1, i = Math.max(0, Math.min(n - 1e-6, t * n)), k = Math.floor(i); return lerp(cols[k], cols[k + 1], i - k); };

export function paintGround(map) {
  const S = SEASONS[map.season] || SEASONS.winter;
  const W = map.W * T, H = map.H * T;
  const P = {
    ground: S.ground.map(C), path: S.path.map(C), soil: S.soil.map(C), grass: S.grass.map(C), water: S.water.map(C),
    cob: M.cobble.map(C), floor: M.inside.floor.map(C), flag: M.inside.flag.map(C), rug: M.inside.rug.map(C),
    wallTop: [C('#0e0c14'), C('#1a1622')], snow: S.snow ? C(S.snow) : null,
  };
  const style = map.def.wall || (map.id === 'depths' ? 'cave' : map.inside && map.def.ground === ':' ? 'stone' : 'wood');
  const kindAt = (tx, ty) => {
    if (tx < 0 || ty < 0 || tx >= map.W || ty >= map.H) return map.inside || map.id === 'depths' ? 'void' : 'ground';
    const t = map.tile(tx, ty);
    if (t.grass) return 'tall';
    return t.ground;
  };
  const isWallish = (k) => k === 'wall' || k === 'void';
  const [canvas, ctx] = makeCanvas(W, H);
  const img = ctx.createImageData(W, H), out = img.data;

  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const tx = Math.floor(x / T), ty = Math.floor(y / T), lx = x % T, ly = y % T;
    let k = kindAt(tx, ty);
    if (SOFT.has(k) || k === 'tall') { // organic borders between soft grounds
      const dx = (noise(x * 0.11, y * 0.11, 11) - 0.5) * 8, dy = (noise(x * 0.11 + 40, y * 0.11 + 40, 23) - 0.5) * 8;
      const w = kindAt(Math.floor((x + dx) / T), Math.floor((y + dy) / T));
      if (SOFT.has(w) || w === 'tall') k = w;
    }
    const n = fbm(x * 0.05, y * 0.05, 5, 2), h = hash(x, y, 3);
    let col;
    if (k === 'ground' || k === 'tall' || k === 'soil') {
      const base = k === 'soil' ? P.soil : P.ground;
      col = ramp(base, Math.min(1, Math.max(0, 0.5 + (n - 0.5) * 0.55 + (k === 'tall' ? -0.25 : 0))));
      if (h > 0.985) col = ramp(base, 0.95);
      else if (h < 0.02) col = ramp(base, 0.05);
      if (map.season === 'winter' && k !== 'soil' && hash(x >> 1, y >> 1, 7) > 0.995) col = C('#ffffff'); // glitter
      if (map.season === 'autumn' && hash(x >> 1, y >> 1, 8) > 0.97) col = lerp(col, C(['#8a4423', '#b5662e', '#6e6a40'][Math.floor(hash(x, y, 9) * 3)]), 0.7);
      if (map.season === 'spring' && k === 'ground' && hash(x >> 2, y >> 2, 91) > 0.993 && (x & 3) === 1 && (y & 3) === 1) col = C(SEASONS.spring.flower[Math.floor(hash(x, y, 5) * 3)]);
      if (k === 'soil' && ly % 4 === 0) col = lerp(col, P.soil[0], 0.6); // furrows
    } else if (k === 'path') {
      col = ramp(P.path, Math.min(1, Math.max(0, 0.45 + (n - 0.5) * 0.8)));
      if (h > 0.985) col = ramp(P.path, 1); else if (h < 0.015) col = P.path[0];
      if (P.snow) { // trodden snow: soft drifts over the slush
        const sn = fbm(x * 0.07, y * 0.07, 31, 3);
        if (sn > 0.7) col = lerp(col, ramp(P.ground, 0.55), Math.min(0.85, (sn - 0.7) * 6));
        if ((x + y * 3) % 11 === 0 && h > 0.6) col = lerp(col, P.path[0], 0.6); // footprints
      }
      const rim = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([ex, ey]) => { const w = kindAt(Math.floor((x + ex) / T), Math.floor((y + ey) / T)); return w === 'ground' || w === 'tall'; });
      if (rim) col = lerp(col, ramp(P.ground, 0.25), 0.5);
    } else if (k === 'cobble') {
      // organic cobbles: the nearest of jittered points decides the stone, near a border is mortar
      const cs = 6, gx = Math.floor(x / cs), gy = Math.floor(y / cs);
      let d1 = 1e9, d2 = 1e9, id = 0;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
        const cx = (gx + i) * cs + hash(gx + i, gy + j, 21) * cs, cy = (gy + j) * cs + hash(gx + i, gy + j, 22) * cs;
        const d = (x - cx) ** 2 + (y - cy) ** 2;
        if (d < d1) { d2 = d1; d1 = d; id = (gx + i) * 7919 + (gy + j); } else if (d < d2) d2 = d;
      }
      const edge = Math.sqrt(d2) - Math.sqrt(d1);
      const v = hash(id, 0, 4);
      col = edge < 1 ? P.cob[0] : ramp(P.cob, 0.4 + v * 0.35 + (edge < 2 ? -0.1 : 0.04));
      if (P.snow) {
        const sn = fbm(x * 0.05, y * 0.05, 43, 3);
        if (edge < 1.2 && sn > 0.5) col = lerp(P.cob[1], ramp(P.ground, 0.4), 0.6);
        if (sn > 0.6) col = lerp(col, ramp(P.ground, 0.55), Math.min(0.9, (sn - 0.6) * 6));
      }
    } else if (k === 'planks' || k === 'rug') {
      const row = Math.floor(y / 4), sy = y % 4, seg = Math.floor((x + hash(row, 0, 6) * 40) / 24), sx = Math.floor(x + hash(row, 0, 6) * 40) % 24;
      col = ramp(P.floor, 0.35 + hash(seg, row, 2) * 0.4 + (sy === 0 ? -0.3 : sy === 1 ? 0.12 : 0) + (sx === 0 ? -0.3 : 0) + (n - 0.5) * 0.2);
      if (k === 'rug') {
        const edgeT = (dx, dy) => kindAt(Math.floor((x + dx) / T), Math.floor((y + dy) / T)) !== 'rug';
        const border = edgeT(-2, 0) || edgeT(2, 0) || edgeT(0, -2) || edgeT(0, 2);
        const fringe = edgeT(-1, 0) || edgeT(1, 0) || edgeT(0, -1) || edgeT(0, 1);
        const d = (Math.abs((x % 8) - 4) + Math.abs((y % 8) - 4));
        col = fringe ? P.rug[3] : border ? P.rug[0] : d === 3 ? P.rug[3] : d < 2 ? P.rug[2] : P.rug[1];
      }
    } else if (k === 'flags') {
      const fx = Math.floor(x / 8), fy = Math.floor(y / 8), off = fy % 2 ? 4 : 0, gx = Math.floor((x + off) / 8);
      const mortar = (x + off) % 8 === 0 || y % 8 === 0;
      col = mortar ? P.flag[0] : ramp(P.flag, 0.3 + hash(gx, fy, 5) * 0.5 + (n - 0.5) * 0.3 + ((y % 8) === 1 ? 0.12 : 0));
      if (map.id === 'depths' && hash(x >> 2, y >> 2, 12) > 0.9) col = lerp(col, C('#2a3a2c'), 0.5); // moss
      void fx;
    } else if (k === 'water') {
      if (S.ice) {
        col = ramp(P.water, 0.4 + n * 0.5);
        const crack = Math.abs(noise(x * 0.12, y * 0.12, 61) - 0.5) < 0.02;
        if (crack) col = P.water[2];
        if (h > 0.992) col = C('#ffffff');
      } else {
        col = ramp(P.water, 0.15 + n * 0.35);
        if ((y + Math.floor(noise(x * 0.1, y * 0.3, 7) * 6)) % 7 === 0 && h > 0.5) col = P.water[2];
      }
      const shore = [[0, -1], [-1, 0], [1, 0]].some(([ex, ey]) => kindAt(Math.floor((x + ex * 2) / T), Math.floor((y + ey * 2) / T)) !== 'water');
      if (shore) col = lerp(col, P.water[0], 0.5);
    } else if (k === 'wall') {
      const below = kindAt(tx, ty + 1);
      const face = !isWallish(below);
      if (!face) col = lerp(P.wallTop[0], P.wallTop[1], hash(tx, ty, 2) * 0.6 + (ly === 15 || lx === 0 ? 0.4 : 0));
      else if (style === 'wood') {
        const plank = Math.floor(x / 5);
        col = ramp(M.wood.map(C), 0.3 + hash(plank, ty, 3) * 0.3 + (x % 5 === 0 ? -0.25 : 0) - (ly < 2 ? 0.25 : 0));
        if (ly >= 13) col = ramp(M.wood.map(C), 0.15 + (ly === 13 ? 0.35 : 0)); // baseboard
      } else {
        const row = Math.floor(ly / 4), off = row % 2 ? 4 : 0, bx = Math.floor((x + off) / 8);
        const mortar = ly % 4 === 0 || (x + off) % 8 === 0;
        const st = (style === 'cave' ? M.stone.slice(0, 4) : M.stone).map(C);
        col = mortar ? st[0] : ramp(st, 0.25 + hash(bx, row + ty * 4, 7) * 0.45 - (ly < 3 ? 0.2 : 0));
        if (style === 'cave' && hash(x >> 1, y >> 1, 14) > 0.93) col = lerp(col, C('#2c3b2e'), 0.5);
      }
    } else {
      col = [8, 7, 14];
    }
    // soft shadow under walls and on the floor just below a wall face
    if (k !== 'wall' && k !== 'void' && ly < 4 && isWallish(kindAt(tx, ty - 1))) col = lerp(col, [6, 5, 12], 0.45 - ly * 0.1);
    const i = (y * W + x) * 4;
    out[i] = col[0]; out[i + 1] = col[1]; out[i + 2] = col[2]; out[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}
