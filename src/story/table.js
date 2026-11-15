// The room of the sessions, painted in code: a dark wall with the cards you found pinned to it, the
// Reader as a hooded shape with a void for a face (never a face), a wooden table with a velvet cloth,
// a candle that gets shorter session after session, and the light that breathes around its flame.
import { canvas, rnd, lerp, clamp, lin, rad, glow, hexA, smooth } from './paint.js';
import { CARD } from '../data/cards.base.js';

// Everything is placed from W, H (device pixels) and a unit U that works on a phone and on a desktop.
export function geometry(W, H) {
  const U = Math.min(H, W * 1.8), horizon = 0.3 * H, cx = W / 2;
  const cardH = Math.min(0.33 * H, 0.66 * W), cardW = cardH * 0.583;
  return {
    W, H, U, horizon, cx, cardH, cardW,
    slotY: horizon + (H - horizon) * 0.27,
    candle: { x: cx + Math.min(W * 0.31, 0.42 * U), y: horizon + 0.07 * H },
    SW: Math.max(0.62 * U, 0.52 * W),
    shoulder: (side) => [cx + side * 0.17 * U, horizon - 0.05 * U],
    rest: (side) => ({ x: cx + side * 0.2 * U, y: horizon + 0.13 * U, rot: side * 0.16, curl: 0.3, spread: 0.6, point: 0 }),
    deckRest: { x: Math.max(0.15 * W, cx - 0.3 * U), y: horizon + 0.33 * U },
  };
}
const CANDLE_H = [0.15, 0.12, 0.092, 0.064, 0.036]; // in U, session 0..4

// ---- the card back, made once
let backCv = null;
export function cardBack() {
  if (backCv) return backCv;
  const [c, g] = canvas(350, 600), r = rnd(3);
  g.fillStyle = lin(g, 0, 0, 350, 600, [[0, '#26214a'], [1, '#14122e']]); g.fillRect(0, 0, 350, 600);
  g.strokeStyle = 'rgba(184,154,82,0.16)'; g.lineWidth = 2;
  for (let i = -600; i < 700; i += 34) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 600, 600); g.stroke(); g.beginPath(); g.moveTo(i + 600, 0); g.lineTo(i, 600); g.stroke(); }
  g.strokeStyle = '#b89a52'; g.lineWidth = 5; g.strokeRect(18, 18, 314, 564); g.lineWidth = 2; g.strokeRect(30, 30, 290, 540);
  g.save(); g.translate(175, 300);
  g.fillStyle = '#14122e'; g.beginPath(); g.arc(0, 0, 96, 0, 7); g.fill(); g.strokeStyle = '#b89a52'; g.lineWidth = 3; g.stroke();
  for (let i = 0; i < 2; i++) { g.rotate(Math.PI / 4); g.strokeRect(-62, -62, 124, 124); }
  g.fillStyle = '#b89a52'; g.beginPath(); g.arc(0, 0, 30, 0.6, 5.7); g.arc(12, 0, 24, 5.4, 0.9, true); g.fill();
  g.restore();
  for (const [x, y] of [[52, 52], [298, 52], [52, 548], [298, 548]]) { g.fillStyle = '#b89a52'; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.04})`; g.fillRect(r() * 350, r() * 600, 2, 2); }
  backCv = c; return c;
}

// ---- the still part: wall, pinned cards, the Reader, table, cloth
function paintReader(g, geo) {
  const { U, horizon, cx, SW } = geo;
  const hy = horizon - 0.18 * U, hr = 0.095 * U;
  g.beginPath();
  smooth(g, [[cx, hy - hr * 1.2], [cx + hr * 0.95, hy - hr * 0.55], [cx + hr * 1.05, hy + hr * 0.45], [cx + hr * 0.9, hy + hr * 1.25], [cx + SW * 0.48, horizon - 0.07 * U], [cx + SW, horizon + 2], [cx - SW, horizon + 2], [cx - SW * 0.48, horizon - 0.07 * U], [cx - hr * 0.9, hy + hr * 1.25], [cx - hr * 1.05, hy + hr * 0.45], [cx - hr * 0.95, hy - hr * 0.55]], true);
  g.fillStyle = lin(g, 0, hy - hr, 0, horizon, [[0, '#0d0a12'], [1, '#06050a']]); g.fill();
  g.save(); g.clip(); g.strokeStyle = lin(g, cx - hr * 2, 0, cx + 0.5 * U, 0, [[0, 'rgba(255,170,90,0)'], [0.5, 'rgba(255,170,90,0.12)'], [1, 'rgba(255,170,90,0.5)']]); g.lineWidth = 5; g.stroke(); g.restore();
  g.fillStyle = rad(g, cx, hy + hr * 0.1, 0, hr * 0.85, [[0, '#000'], [0.7, '#010003'], [1, 'rgba(1,0,3,0)']]); g.beginPath(); g.ellipse(cx, hy + hr * 0.12, hr * 0.7, hr * 0.85, 0, 0, 7); g.fill();
}

export function paintBase(g, geo, found, imgOf, { empty = false } = {}) {
  const { W, H, U, horizon, cx, SW } = geo, r = rnd(11);
  // the wall
  g.fillStyle = lin(g, 0, 0, 0, horizon, [[0, '#120e18'], [1, '#2a1c22']]); g.fillRect(0, 0, W, horizon + 2);
  g.save(); g.globalAlpha = 0.06; g.strokeStyle = '#8a6a8a'; g.lineWidth = Math.max(1, W / 400);
  for (let x = -20; x < W + 40; x += 0.075 * U) { g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 14, horizon * 0.3, x - 14, horizon * 0.6, x, horizon); g.stroke(); }
  g.restore();
  // the pinned cards: each keeps its place from session to session
  const list = found.slice().sort((a, b) => num(a) - num(b)).slice(0, 26);
  const ch = 0.118 * H, cw = ch * 0.583, pins = [];
  for (const id of list) {
    const n = num(id), rr = rnd(n * 7 + 5);
    const x = W * (0.06 + 0.88 * (((n * 0.618034 + 0.17) % 1))), y = H * (0.06 + (n % 3) * 0.072) + (rr() - 0.5) * 0.02 * H, rot = (rr() - 0.5) * 0.28;
    pins.push([x, y - ch * 0.42]);
    g.save(); g.translate(x, y); g.rotate(rot);
    g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(-cw / 2 + 4, -ch / 2 + 6, cw, ch);
    const im = imgOf(id);
    if (im) g.drawImage(im, -cw / 2, -ch / 2, cw, ch); else g.drawImage(cardBack(), -cw / 2, -ch / 2, cw, ch);
    g.fillStyle = 'rgba(8,5,12,0.58)'; g.fillRect(-cw / 2, -ch / 2, cw, ch);
    g.fillStyle = '#b89a52'; g.beginPath(); g.arc(0, -ch * 0.42, Math.max(2.4, cw * 0.06), 0, 7); g.fill();
    g.restore();
  }
  // a thread between them, in the order they were found
  g.strokeStyle = 'rgba(150,40,48,0.5)'; g.lineWidth = Math.max(1, W / 380); g.beginPath();
  pins.forEach(([x, y], i) => { if (i === 0) g.moveTo(x, y); else { const [px, py] = pins[i - 1]; g.quadraticCurveTo((x + px) / 2, Math.max(y, py) + ch * 0.18, x, y); } });
  g.stroke();
  g.fillStyle = rad(g, cx, horizon - 0.15 * U, 0, 0.5 * U, [[0, 'rgba(150,84,60,0.3)'], [1, 'rgba(150,84,60,0)']]); g.fillRect(0, 0, W, horizon);
  // the Reader: a hood and shoulders against the wall; the face is a void (gone at the very end: the seat is empty)
  if (!empty) paintReader(g, geo);
  // the table: planks, in perspective
  const th = H - horizon;
  g.fillStyle = lin(g, 0, horizon, 0, H, [[0, '#3a281c'], [1, '#1c120c']]); g.fillRect(0, horizon, W, th);
  const N = 9;
  for (let k = 0; k < N; k++) {
    const y0 = horizon + th * Math.pow(k / N, 1.6), y1 = horizon + th * Math.pow((k + 1) / N, 1.6);
    g.fillStyle = r() < 0.5 ? 'rgba(80,55,36,0.28)' : 'rgba(10,6,4,0.2)'; g.fillRect(0, y0, W, y1 - y0);
    g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(0, y1 - 1.5, W, 2);
    g.strokeStyle = 'rgba(120,86,58,0.13)'; g.lineWidth = 1;
    for (let i = 0; i < 6; i++) { const y = lerp(y0, y1, r()); g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(W * 0.3, y + (r() - 0.5) * 8, W * 0.6, y + (r() - 0.5) * 8, W, y + (r() - 0.5) * 4); g.stroke(); }
  }
  g.fillStyle = 'rgba(255,200,140,0.22)'; g.fillRect(0, horizon, W, 2); // the far edge catches light
  g.fillStyle = lin(g, 0, horizon - 14, 0, horizon + 18, [[0, 'rgba(0,0,0,0.5)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, horizon - 14, W, 32);
  // the velvet cloth
  const fy = horizon + 0.04 * U, fh = Math.min(0.36 * W, 0.62 * U), nh = fh * 1.9, trap = (k) => [[cx - lerp(fh, nh, k), lerp(fy, H + 8, k)], [cx + lerp(fh, nh, k), lerp(fy, H + 8, k)]];
  const [fl, fr] = trap(0), [nl, nr] = trap(1);
  g.beginPath(); g.moveTo(...fl); g.lineTo(...fr); g.lineTo(...nr); g.lineTo(...nl); g.closePath();
  g.fillStyle = lin(g, 0, fy, 0, H, [[0, '#3b1424'], [1, '#210b16']]); g.fill();
  g.save(); g.clip(); g.globalAlpha = 0.07; for (let i = 0; i < 160; i++) { g.fillStyle = r() < 0.5 ? '#fff' : '#000'; g.fillRect(r() * W, fy + r() * (H - fy), 1 + r() * 2, 8 + r() * 14); } g.restore();
  g.strokeStyle = 'rgba(184,154,82,0.5)'; g.lineWidth = Math.max(1.5, W / 300); g.stroke();
  g.save(); g.translate(cx, lerp(fy, H, 0.5)); g.scale(0.94, 0.94); g.translate(-cx, -lerp(fy, H, 0.5)); g.strokeStyle = 'rgba(184,154,82,0.22)'; g.beginPath(); g.moveTo(...fl); g.lineTo(...fr); g.lineTo(...nr); g.lineTo(...nl); g.closePath(); g.stroke(); g.restore();
  g.strokeStyle = 'rgba(184,154,82,0.55)'; g.lineWidth = 1.2; for (let x = fl[0]; x < fr[0]; x += 5) { g.beginPath(); g.moveTo(x, fy); g.lineTo(x + 0.5, fy + 0.012 * U); g.stroke(); } // fringe
}
const num = (id) => (CARD[id]?.arcana === 'major' ? CARD[id].n : 30 + (CARD[id]?.n || 0) + (id.charCodeAt(0) % 5) * 14);

// ---- the candle (lit by itself, so drawn after the darkness)
export const flicker = (t, calm) => { const a = calm ? 0.35 : 1; return 1 + a * (0.045 * Math.sin(t * 9.7) * Math.sin(t * 5.3) + 0.03 * Math.sin(t * 21.3 + 1) + 0.02 * Math.sin(t * 2.1)); };

export function flamePos(geo, level, t, lean, calm) {
  const { candle, U } = geo, top = candle.y - CANDLE_H[Math.min(4, level)] * U;
  const sway = (calm ? 0 : Math.sin(t * 3.1) * 0.12 + Math.sin(t * 8.3) * 0.05) + lean;
  return { x: candle.x, y: top - 0.012 * U, top, sway };
}

export function drawCandle(g, geo, level, t, lean, calm) {
  const { candle, U } = geo, { x, y, top, sway } = flamePos(geo, level, t, lean, calm), cw = 0.026 * U, f = flicker(t, calm);
  // wax pool and holder
  g.fillStyle = 'rgba(0,0,0,0.45)'; g.beginPath(); g.ellipse(x + 0.01 * U, candle.y + 0.012 * U, cw * 2.4, cw * 0.8, 0, 0, 7); g.fill();
  g.fillStyle = lin(g, x - cw * 2, 0, x + cw * 2, 0, [[0, '#4a3a1c'], [0.5, '#c8a85a'], [1, '#6a5426']]); g.beginPath(); g.ellipse(x, candle.y, cw * 2.1, cw * 0.65, 0, 0, 7); g.fill();
  // the candle: cream wax, warm on the flame side, with a drip
  g.fillStyle = lin(g, x - cw, 0, x + cw, 0, [[0, '#a69473'], [0.45, '#f0e2bc'], [1, '#c9b48a']]);
  g.beginPath(); g.rect(x - cw / 2, top, cw, candle.y - top); g.fill();
  g.fillStyle = '#f6ebc8'; g.beginPath(); g.ellipse(x, top, cw / 2, cw * 0.2, 0, 0, 7); g.fill();
  g.fillStyle = '#e4d3a8'; g.beginPath(); g.roundRect?.(x + cw * 0.1, top, cw * 0.22, (candle.y - top) * 0.45, cw * 0.1); g.fill();
  // glow, then the flame: outer orange, inner yellow, a blue root
  glow(g, x, y, 0.2 * U * f, '255,160,70', 0.42);
  glow(g, x, y, 0.07 * U * f, '255,225,150', 0.7);
  const fh = 0.058 * U * (0.92 + 0.1 * f), fw = 0.0125 * U, tx = x + sway * fh * 0.6, ty = y - fh;
  const body = (k, col) => {
    g.beginPath(); g.moveTo(x, y + 0.004 * U);
    g.bezierCurveTo(x - fw * k, y - fh * 0.1 * k, x - fw * 0.8 * k + sway * fh * 0.1, y - fh * 0.62, tx, y - fh * (1 - (1 - k) * 0.5));
    g.bezierCurveTo(x + fw * 0.8 * k + sway * fh * 0.1, y - fh * 0.62, x + fw * k, y - fh * 0.1 * k, x, y + 0.004 * U);
    g.fillStyle = col; g.fill();
  };
  g.save(); g.globalCompositeOperation = 'lighter';
  body(1, rad(g, x, y - fh * 0.3, 0, fh * 0.8, [[0, 'rgba(255,200,90,0.95)'], [1, 'rgba(255,110,30,0.5)']]));
  g.restore();
  body(0.55, rad(g, x, y - fh * 0.25, 0, fh * 0.5, [[0, '#fffbe6'], [1, '#ffd36a']]));
  g.fillStyle = 'rgba(70,110,255,0.55)'; g.beginPath(); g.ellipse(x, y - 0.002 * U, fw * 0.45, fh * 0.1, 0, 0, 7); g.fill();
  g.strokeStyle = '#1a1208'; g.lineWidth = Math.max(1, U / 500); g.beginPath(); g.moveTo(x, y + 0.006 * U); g.lineTo(x, top); g.stroke();
}

// ---- the darkness with a pool of warm light in it; shorter candle, smaller pool
export function darkness(g, geo, level, t, calm) {
  const { W, H, U } = geo, fp = flamePos(geo, level, t, 0, calm), f = flicker(t, calm);
  const R = (1.2 - 0.085 * level) * Math.max(U, 0.8 * W) * (1 + (calm ? 0 : 0.03 * Math.sin(t * 1.1))) * (0.97 + (f - 1) * 1.2);
  g.fillStyle = rad(g, fp.x, fp.y, R * 0.04, R, [[0, 'rgba(3,2,7,0)'], [0.22, 'rgba(3,2,7,0.1)'], [0.5, 'rgba(3,2,7,0.44)'], [0.78, 'rgba(3,2,7,0.8)'], [1, 'rgba(2,1,4,0.95)']]);
  g.fillRect(0, 0, W, H);
  glow(g, fp.x, fp.y, R * 0.55, '255,140,60', 0.16 * f);
  return { R, fp };
}
export { hexA, clamp };
