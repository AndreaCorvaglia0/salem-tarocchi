// People, drawn in code: one sheet of 16x26 frames per look.
// Frames: 0-2 facing down (stand, step, step), 3-5 up, 6-8 side (facing left; flip for right),
// 9 a pose (the Afflicted points, the others raise a hand).
import { INK } from './palette.js';
import { makeCanvas, addSheet, shade } from './px.js';

const SK = { light: ['#e9c3a0', '#c99a7a'], warm: ['#d9a37a', '#b07c58'], deep: ['#8d5a3b', '#6d432b'], pale: ['#e6d6cc', '#bfaea6'] };

export const LOOKS = {
  tu: { skin: 'light', hair: '#4a2a22', hairStyle: 'long', hat: 'witch', coat: ['#141224', '#221d38', '#342c52'], under: '#5c2c48', trim: '#a8823a' },
  malva: { skin: 'warm', hair: '#8a8478', hairStyle: 'bun', hat: 'coif', coat: ['#2a1d1a', '#4a3127', '#6b4a35'], under: '#7a3d45', trim: '#d3cab6', apron: '#a89e88' },
  ortica: { skin: 'light', hair: '#6b4a24', hairStyle: 'wild', hat: null, coat: ['#1d2a1c', '#2f4a2a', '#4a6a36'], under: '#8a6a3a', trim: '#c9a55a' },
  edera: { skin: 'pale', hair: '#e6e2dc', hairStyle: 'long', hat: 'hood', coat: ['#1f1a2c', '#352c48', '#4f4266'], under: '#5c4a6e', trim: '#8a7aa8', cane: true },
  ginepra: { skin: 'light', hair: '#b5492a', hairStyle: 'braid', hat: 'hood', coat: ['#3a1416', '#5c2024', '#7e3030'], under: '#2a2030', trim: '#d9a54a' },
  giudice: { skin: 'pale', hair: '#c9c4bb', hairStyle: 'short', hat: 'tall', coat: ['#0c0c12', '#16161f', '#262633'], under: '#e9e6dc', trim: '#e9e6dc', collar: true, pants: true },
  conestabile: { skin: 'warm', hair: '#2b1d16', hairStyle: 'short', hat: 'brim', coat: ['#141a2a', '#1f2840', '#2e3a58'], under: '#6a5a3a', trim: '#a8823a', pants: true, lantern: true, beard: '#2b1d16' },
  afflitta: { skin: 'pale', hair: '#2a2420', hairStyle: 'loose', hat: null, coat: ['#8a8578', '#b4ad9c', '#d8d1bf'], under: '#d8d1bf', trim: '#d8d1bf' },
  bottegaio: { skin: 'deep', hair: '#1b1a2b', hairStyle: 'short', hat: 'cap', coat: ['#1d1430', '#2d1f48', '#46306a'], under: '#c9a55a', trim: '#4fd1a5', pants: true, beard: '#1b1a2b' },
  child: { skin: 'light', hair: '#7a5238', hairStyle: 'short', hat: 'cap', coat: ['#2a2018', '#3e2f22', '#56412e'], under: '#8a7a5a', trim: '#a89e88', small: true },
  washer: { skin: 'warm', hair: '#5a3a28', hairStyle: 'bun', hat: 'coif', coat: ['#252a38', '#363d50', '#4a5266'], under: '#8a8578', trim: '#d3cab6', apron: '#b4ad9c' },
  lettrice: { skin: 'pale', hair: '#0c0a10', hairStyle: 'long', hat: 'hood', coat: ['#08070c', '#110f18', '#1c1926'], under: '#08070c', trim: '#3a3650' },
};
const VILLAGE = [
  { skin: 'light', hair: '#5a3a28', hairStyle: 'bun', hat: 'coif', coat: ['#2a2430', '#3d3445', '#544860'], under: '#6a5a4a', trim: '#d3cab6' },
  { skin: 'warm', hair: '#3b2a20', hairStyle: 'short', hat: 'brim', coat: ['#2a2018', '#3e2f22', '#56412e'], under: '#8a7a5a', trim: '#6a5a4a', pants: true },
  { skin: 'deep', hair: '#1b1a2b', hairStyle: 'long', hat: 'hood', coat: ['#1d2a30', '#2c3f48', '#3f5866'], under: '#7a6a4a', trim: '#a89e88' },
  { skin: 'light', hair: '#c9a06a', hairStyle: 'braid', hat: 'coif', coat: ['#30201e', '#4a2e2a', '#663f38'], under: '#d3cab6', trim: '#d3cab6' },
];
export const lookFor = (who) => LOOKS[who] || VILLAGE[[...String(who)].reduce((a, ch) => a + ch.charCodeAt(0), 0) % VILLAGE.length];

function paint(ctx, ox, L, view, step, pose) {
  // a child is the same figure, shorter: the head and the top of the coat drop four pixels
  const sy = (y) => (L.small ? (y < 21 ? Math.min(23, y + 4 - (y > 16 ? Math.floor((y - 16) * 0.8) : 0)) : y) : y);
  const P = (x, y, col) => { y = sy(y); if (x < 0 || x > 15 || y < 0 || y > 25 || !col) return; ctx.fillStyle = col; ctx.fillRect(ox + x, y, 1, 1); };
  const R = (x, y, w, h, col) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) P(x + i, y + j, col); };
  const [skin, skinS] = SK[L.skin] || SK.light;
  const [c0, c1, c2] = L.coat;
  const bob = step ? 1 : 0;
  // ---- feet
  const shoe = '#0e0c12';
  if (view === 'side') {
    const a = step === 1 ? [3, 9] : step === 2 ? [6, 6] : [5, 8];
    R(a[0], 24, 3, 2, shoe); R(a[1], 24, 3, 2, shoe);
  } else {
    if (step !== 2) R(5, 24 - (step === 1 ? 0 : 0), 2, 2, shoe); else R(5, 24, 2, 1, shoe);
    if (step !== 1) R(9, 24, 2, 2, shoe); else R(9, 24, 2, 1, shoe);
    if (L.pants) { R(5, 22, 2, 2, '#1a1a22'); R(9, 22, 2, 2, '#1a1a22'); }
  }
  if (view === 'side' && L.pants) { const a = step === 1 ? [4, 9] : step === 2 ? [7, 7] : [6, 8]; R(a[0], 22, 2, 2, '#1a1a22'); R(a[1], 22, 2, 2, '#1a1a22');
  }
  // ---- body (cloak or coat), y from 14 to 23
  const top = 14 + bob, bottom = L.pants ? 21 : 23;
  for (let y = top; y <= bottom; y++) {
    const t = (y - top) / (bottom - top);
    const half = view === 'side' ? Math.round(3 + t * 2.5) : Math.round(4 + t * 2.5);
    const cx = view === 'side' ? 7.5 : 7.5;
    const sway = step && y > bottom - 2 ? (step === 1 ? 1 : -1) * (view === 'side' ? 1 : 0) : 0;
    const x0 = Math.round(cx - half) + sway, x1 = Math.round(cx + half) - 1 + sway;
    for (let x = x0; x <= x1; x++) {
      let col = x === x0 || x === x1 || y === bottom ? INK : x < x0 + 2 ? c2 : x > x1 - 2 ? c0 : c1;
      if (view === 'down' && x >= 7 && x <= 8 && y > top + 1 && y < bottom) col = L.under;
      if (view === 'down' && L.apron && x >= 5 && x <= 10 && y > top + 3 && y < bottom - 1) col = x === 5 || x === 10 ? shade(L.apron, -0.2) : L.apron;
      if (view === 'side' && x === x0 + 1 && y > top + 1) col = c2;
      P(x, y, col);
    }
  }
  if (view === 'down' && L.collar) { R(6, top, 4, 2, L.trim); P(7, top + 2, L.trim); P(8, top + 2, L.trim); }
  if (view !== 'up') R(view === 'side' ? 5 : 6, top, view === 'side' ? 5 : 4, 1, L.trim); // clasp / neckline
  // hands
  if (view === 'down') { P(3, 20 + bob, skin); P(12, 20 + bob, skin); }
  if (view === 'side') P(view === 'side' ? 6 + (step === 1 ? -1 : step === 2 ? 1 : 0) : 0, 19 + bob, skin);
  if (pose) { // an arm raised and pointing (side view, to the left)
    R(1, 15 + bob, 5, 1, c1); P(0, 15 + bob, skin); P(1, 14 + bob, INK); R(1, 16 + bob, 5, 1, INK);
  }
  if (L.lantern && view !== 'up') { const lx = view === 'side' ? 3 : 12, ly = 18 + bob; R(lx, ly, 3, 4, INK); P(lx + 1, ly + 1, '#ffd683'); P(lx + 1, ly + 2, '#f2b14a'); }
  if (L.cane && view !== 'up') { for (let y = 15; y < 26; y++) P(view === 'side' ? 3 : 13, y, '#6e4a35'); }
  // ---- head, y 6..13
  const hy = 6 + bob, hx = view === 'side' ? 5 : 4, hw = view === 'side' ? 7 : 8;
  R(hx, hy, hw, 8, INK);
  R(hx + 1, hy + 1, hw - 2, 7, L.hair);
  if (view === 'down') { R(5, hy + 3, 6, 4, skin); R(5, hy + 6, 6, 1, skinS); P(6, hy + 4, INK); P(9, hy + 4, INK); P(5, hy + 5, '#d98a8a'); P(10, hy + 5, '#d98a8a'); R(hx, hy + 7, hw, 1, INK); R(6, hy + 7, 4, 1, skinS); }
  if (view === 'side') { R(5, hy + 3, 4, 4, skin); P(4, hy + 4, skin); P(4, hy + 5, INK); P(6, hy + 4, INK); R(5, hy + 6, 3, 1, skinS); }
  if (L.beard && view !== 'up') { if (view === 'down') R(5, hy + 6, 6, 2, L.beard); else R(5, hy + 6, 3, 2, L.beard); }
  // hair styles
  const hs = L.hairStyle;
  if (hs === 'long' || hs === 'loose' || hs === 'braid') {
    if (view === 'down') { R(3, hy + 3, 2, hs === 'loose' ? 9 : 7, L.hair); R(11, hy + 3, 2, hs === 'loose' ? 9 : 7, L.hair); P(3, hy + 10, INK); P(12, hy + 10, INK); }
    if (view === 'up') R(4, hy + 7, 8, hs === 'loose' ? 7 : 5, L.hair);
    if (view === 'side') R(9, hy + 3, 3, hs === 'loose' ? 9 : 6, L.hair);
    if (hs === 'braid' && view !== 'down') { for (let k = 0; k < 6; k++) P(view === 'side' ? 11 : 8, hy + 9 + k, k % 2 ? INK : L.hair); }
  }
  if (hs === 'wild') { for (const [x, y] of [[3, 1], [12, 1], [2, 3], [13, 3], [4, 0], [11, 0], [3, 5], [12, 5]]) P(x, hy + y, L.hair); }
  if (hs === 'bun' && !['coif'].includes(L.hat)) R(6, hy - 2, 4, 2, L.hair);
  // ---- hats
  const H = L.hat;
  if (H === 'witch') {
    R(1, hy + 1, 14, 2, INK); R(2, hy + 1, 12, 1, c1); // brim
    for (let y = 0; y < 8; y++) { const w = Math.max(1, 4 - Math.floor(y / 2)), x = 8 - w + (y > 5 ? 1 : 0); R(x, hy - y, w * 2, 1, y === 0 ? L.trim : c1); P(x - 1, hy - y, INK); P(x + w * 2, hy - y, INK); }
    P(10, hy - 7, c2); P(11, hy - 7, INK); P(11, hy - 6, INK);
  } else if (H === 'hood') {
    R(hx, hy, hw, 3, c1);
    if (view === 'down') { R(hx - 1, hy + 1, 2, 8, c1); R(hx + hw - 1, hy + 1, 2, 8, c0); }
    if (view === 'side') { R(hx + 2, hy, hw - 1, 2, c1); R(hx + hw - 3, hy + 1, 4, 8, c1); R(hx + hw, hy + 2, 1, 7, c0); P(hx + 1, hy + 2, c1); }
    if (view === 'up') R(hx, hy, hw, 9, c1);
    R(hx, hy - 1, hw, 1, INK);
  } else if (H === 'coif') {
    R(hx + 1, hy, hw - 2, 3, '#d3cab6'); R(hx, hy + 1, 1, 5, '#d3cab6'); R(hx + hw - 1, hy + 1, 1, 5, '#b3aa98'); if (view === 'up') R(hx + 1, hy, hw - 2, 7, '#d3cab6');
  } else if (H === 'brim' || H === 'tall') {
    R(1, hy + 1, 14, 2, INK); R(2, hy + 1, 12, 1, H === 'tall' ? '#1a1a24' : '#2a2018');
    const hh = H === 'tall' ? 6 : 3;
    R(4, hy + 1 - hh, 8, hh, INK); R(5, hy + 2 - hh, 6, hh - 1, H === 'tall' ? '#14141c' : '#3a2c20'); R(5, hy, 6, 1, L.trim === '#e9e6dc' ? '#c9a55a' : L.trim);
  } else if (H === 'cap') {
    R(hx, hy - 1, hw, 3, L.coat[2]); R(hx, hy - 1, hw, 1, INK);
  }
}

export function makePerson(scene, key, look) {
  if (scene.textures.exists(key)) return;
  const [c, ctx] = makeCanvas(16 * 10, 26);
  const order = [['down', 0], ['down', 1], ['down', 2], ['up', 0], ['up', 1], ['up', 2], ['side', 0], ['side', 1], ['side', 2]];
  order.forEach(([v, s], i) => paint(ctx, i * 16, look, v, s, false));
  paint(ctx, 9 * 16, look, 'side', 0, true);
  addSheet(scene, key, c, 16, 26);
  const a = scene.anims;
  const mk = (name, frames, rate) => { if (!a.exists(`${key}-${name}`)) a.create({ key: `${key}-${name}`, frames: frames.map((f) => ({ key, frame: f })), frameRate: rate, repeat: -1 }); };
  mk('walk-down', [1, 0, 2, 0], 8); mk('walk-up', [4, 3, 5, 3], 8); mk('walk-side', [7, 6, 8, 6], 8);
}
