// Cameo portraits for the dialogue box: a profile cut in dark paper inside a lit oval, with two or three
// accents of colour (hair, a collar, a jewel, Tartufo's yellow eye). Same request as portraits.js:
//   cameo(who, size = 96) -> a <canvas> (size x size CSS px, sharp on retina), or null for 'narra'
// CAMEOS is plain data (tests check every PEOPLE id has one); drawing happens only when asked.
import { toPath, tf, ellipse } from './kit.js';
import { head, faceLine, lashes, shoulders, HAIR, HAT, braidLine, hairExtra } from './shapes.js';

const INK = '#150c08';
// face options: women soft, men stronger
const W = { nose: 0.9, up: 0.7, lips: 1.15, chin: 0.9 };
const M = { nose: 1.7, up: 0, lips: 0.45, chin: 1.5, brow: 1.4, jaw: 3, neckFront: 60, neckBack: 25 };

export const CAMEOS = {
  tu: { face: { ...W, up: 0.9 }, hair: 'long', hairCol: '#4c2a1e', hat: 'witch', hatJewel: '#e8c25a', collar: 'cloak', collarCol: '#2c2448', bg: 'amber', jewel: null },
  ginepra: { face: { ...W, nose: 0.75, up: 1.3, lips: 1.2 }, hair: 'curls', hairCol: '#9a3418', collar: 'hood', collarCol: '#27427c', bg: 'amber', jewel: null, freckles: true },
  malva: { face: { ...W, nose: 1.05, up: 0.3, lips: 1.1, chin: 1.05 }, hair: 'crown', hairCol: '#5e3e2c', braid: true, collar: 'shawl', collarCol: '#2e5e3a', bg: 'amber', jewel: '#d6b25a' },
  ortica: { face: { ...W, nose: 0.95, up: 0.8, lips: 1.25 }, hair: 'wild', hairCol: '#6a3e1a', collar: 'plain', collarCol: '#33481f', bg: 'amber', sprig: '#7fae4a', eye: '#f0d070' },
  edera: { face: { ...W, nose: 1.1, up: 0.1, lips: 0.9, chin: 0.95 }, neck: 54, hair: 'bun', hairCol: '#aaa5b6', collar: 'high', collarCol: '#3a3052', bg: 'rose', jewel: '#f2efe6', brooch: '#6aa04a' },
  lettrice: { face: { ...W, nose: 0.85, up: 0.5 }, hair: null, veil: true, veilCol: 'rgba(58,26,52,0.86)', collar: null, bg: 'deep', circlet: '#d8b25a' },
  giudice: { face: M, hair: 'short', hairCol: '#1e1814', hat: 'tall', collar: 'bands', collarCol: '#ece6d6', bg: 'cold' },
  conestabile: { face: { ...M, nose: 1.4, chin: 1.3 }, hair: 'short', hairCol: '#1e1410', hat: 'brim', hatJewel: '#c9a24a', collar: 'buttons', collarCol: '#c9a24a', bg: 'amber', beard: true },
  afflitta: { face: { ...W, nose: 0.7, up: 1.1, lips: 0.9, chin: 0.8 }, hair: null, hat: 'bonnet', hatCol: '#d6cdb8', collar: 'wide', collarCol: '#c9bfa8', bg: 'cold' },
  bottegaio: { face: { ...M, nose: 1.9, brow: 1, chin: 1.1, jaw: 2 }, hair: 'short', hairCol: '#1b1a2b', hat: 'cap', hatCol: '#3a2a52', collar: 'plain', collarCol: '#33244e', bg: 'amber', specs: '#e8d9a0', beard: true },
  tartufo: { cat: true, bg: 'amber', eye: '#ffd23a' },
  child: { face: { nose: 0.6, up: 1.4, lips: 0.9, chin: 0.7 }, small: true, hair: 'short', hairCol: '#7a5238', hat: 'cap', hatCol: '#4a3826', collar: 'plain', collarCol: '#5e5038', bg: 'amber' },
  washer: { face: { ...W, nose: 1.1, up: 0.3 }, hair: null, hat: 'bonnet', hatCol: '#c9bfa8', collar: 'shawl', collarCol: '#3a4054', bg: 'amber' },
  hale: { face: { ...W, nose: 1.15, up: 0.2, lips: 0.95, chin: 1 }, hair: 'crown', hairCol: '#7a7268', collar: 'wide', collarCol: '#bfb49c', bg: 'rose', jewel: '#c98a5a' },
  gravedigger: { face: { ...M, nose: 2, chin: 1.2, jaw: 2 }, hair: 'short', hairCol: '#3a3430', hat: 'brim', collar: 'plain', collarCol: '#2e2a22', bg: 'cold', beard: true },
  miller: { face: { ...M, nose: 1.5, up: 0.3, chin: 1.4 }, hair: 'short', hairCol: '#d8d0c0', hat: 'cap', hatCol: '#d6cdb8', collar: 'plain', collarCol: '#8a7e62', bg: 'amber' },
};
export const hasCameo = (who) => !!CAMEOS[who];

const BG = {
  amber: ['#f6d08a', '#d98c3e', '#6a2c12'],
  rose: ['#f4d0a0', '#cf7f56', '#5a2420'],
  cold: ['#ecd8a8', '#b88a52', '#3e2618'],
  deep: ['#e8b46a', '#a2502a', '#2a0f0a'],
};
const SHORT = [[64, 6], [50, -1.5], [32, -1.5], [16, 5], [5, 20], [1, 40], [4, 58], [12, 72], [22, 80], [30, 72], [30, 56], [38, 40], [50, 26], [60, 16]];

// path data for the parts of one cameo, in head units (crown 0, chin 100)
export function cameoParts(who) {
  const c = CAMEOS[who];
  if (!c) return null;
  if (c.cat) return catParts();
  const neck = c.neck ?? 40, top = 100 + neck;
  const parts = [];
  const add = (fill, d, alpha = 1) => parts.push({ fill, d, alpha });
  // back things first: the veil, the hood, the long hair behind the shoulders
  if (c.veil) add(c.veilCol, toPath(HAT.veil), 1);
  if (c.collar === 'hood') add(c.collarCol, toPath([[30, top - 20], [-6, top - 12], [-44, top + 10], [-58, top + 60], [-40, top + 92], [10, top + 70], [40, top + 30]]));
  // the dark bust
  add(INK, toPath([...shoulders(top - 2, top + 160, { chest: c.small ? 0 : 1 })]));
  add(INK, toPath(head(c.face, neck + 6)));
  if (!c.small && /^(tu|ginepra|malva|ortica|edera|lettrice|afflitta|washer|hale)$/.test(who)) for (const l of lashes(0.5)) add(INK, toPath(l, false), 'stroke');
  // hair on top of the head
  if (HAIR[c.hair]) { add(c.hairCol, toPath(HAIR[c.hair])); for (const d of hairExtra(c.hair)) add(c.hairCol, d); }
  if (c.hair === 'short') add(c.hairCol, toPath(SHORT));
  if (c.braid) add(shade(c.hairCol), braidLine().slice(1, -1).map(([x, y]) => ellipse(x, y, 5.4, 3.8)).join(''));
  if (c.beard) add(INK, toPath([[60, 104], [70, 103], [79, 98], [82, 92], [80, 112], [66, 120], [54, 118], [48, 100]]));
  // collars and clothes
  if (c.collar === 'cloak') add(c.collarCol, toPath([[54, top + 4], [66, top + 24], [80, top + 70], [84, top + 160, 1], [-48, top + 160, 1], [-46, top + 60], [-34, top + 10], [-30, top - 30, 1], [-12, top - 8], [18, top + 2], [34, top + 14]]));
  if (c.collar === 'shawl') add(c.collarCol, toPath([[54, top - 2], [64, top + 20], [78, top + 58], [74, top + 92], [44, top + 70], [6, top + 96], [-40, top + 110], [-50, top + 60], [-36, top + 30], [-6, top + 12], [20, top - 2]]));
  if (c.collar === 'high') add(c.collarCol, toPath([[52, top - 26], [58, top - 2], [72, top + 40], [82, top + 160, 1], [-46, top + 160, 1], [-44, top + 50], [-20, top + 8], [12, top - 16], [16, top - 40, 1], [34, top - 30]]));
  if (c.collar === 'plain' || c.collar === 'buttons') add(c.collarCol, toPath([[56, top + 8], [66, top + 28], [78, top + 72], [82, top + 160, 1], [-46, top + 160, 1], [-44, top + 60], [-24, top + 22], [14, top + 6], [36, top + 18]]));
  if (c.collar === 'bands') { add(c.collarCol, toPath([[40, top - 16], [62, top - 14], [66, top - 4, 1], [36, top - 2, 1]])); add(c.collarCol, toPath([[58, top - 6, 1], [68, top - 4, 1], [72, top + 36, 1], [62, top + 38, 1]])); }
  if (c.collar === 'buttons') for (let i = 0; i < 3; i++) add(c.collarCol, ellipse(74 + i * 2.5, top + 40 + i * 26, 3.2));
  if (c.collar === 'wide') add(c.collarCol, toPath([[54, top], [66, top + 18], [84, top + 44, 1], [40, top + 56], [-10, top + 50], [-48, top + 44, 1], [-32, top + 14], [20, top]]));
  // hats
  if (c.hat === 'witch') { add(INK, toPath(HAT.witch.cone)); add(INK, toPath(HAT.witch.brim)); add(c.hairCol ? shade(c.collarCol) : INK, toPath(HAT.witch.band)); }
  if (c.hat === 'tall' || c.hat === 'brim') { add(INK, toPath(HAT[c.hat].cone)); add(INK, toPath(HAT[c.hat].brim)); }
  if (c.hat === 'bonnet') add(c.hatCol, toPath(HAT.bonnet));
  if (c.hat === 'cap') add(c.hatCol, toPath(HAT.cap));
  // jewels and little lights
  if (c.hatJewel) add(c.hatJewel, star(c.hat === 'witch' ? 40 : 46, c.hat === 'witch' ? 4 : 2, 6));
  if (c.circlet) { add(c.circlet, toPath(HAT.circlet)); add(c.circlet, toPath([[73, 11], [75.4, 15], [73.6, 19.4, 1], [71.6, 15]])); }
  if (c.jewel) { add(c.jewel, ellipse(44, 78, 3.6)); if (who === 'edera') add(c.jewel, ellipse(44, 86, 2.4)); }
  if (c.brooch) add(c.brooch, leaf(76, top + 30, 12));
  if (c.sprig) { add(c.sprig, leaf(40, -4, 13, -0.8)); add(c.sprig, leaf(52, -6, 10, -0.2)); }
  if (c.eye) add(c.eye, ellipse(76.5, 53, 1.7));
  if (c.specs) add(c.specs, `${ellipse(80, 54, 6.4, 5)}${ellipse(80, 54, 4.8, 3.6)}`, 'eo');
  if (c.freckles) for (const [x, y] of [[78, 64], [74, 66], [77, 69]]) add('rgba(232,170,120,0.65)', ellipse(x, y, 1.1));
  if (c.veil) add('rgba(255,214,160,0.18)', toPath(HAT.veil.slice(1, 9), false), 'stroke');
  return parts;
}
const shade = (hex) => { if (!hex || hex[0] !== '#') return INK; const n = parseInt(hex.slice(1), 16), k = 0.62; return `rgb(${((n >> 16) & 255) * k | 0},${((n >> 8) & 255) * k | 0},${(n & 255) * k | 0})`; };
const star = (cx, cy, r) => toPath(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r * 0.42 : r; return [cx + Math.cos(a) * q, cy + Math.sin(a) * q, 1]; }));
const leaf = (x, y, s, a = 0.6) => toPath(tf([[0, 0, 1], [0.35, -0.28], [1, 0, 1], [0.35, 0.28]], { x, y, s, rot: a }));

// Tartufo: a black cat in profile, ears up, one yellow eye
function catParts() {
  const body = [[84, 30], [92, 6, 1], [76, 22], [60, 20], [50, -2, 1], [44, 26], [30, 44], [26, 70], [32, 92], [20, 120], [-6, 156], [-30, 210], [-40, 270], [-44, 360, 1], [120, 360, 1], [100, 270], [88, 220], [70, 168], [66, 128], [80, 112], [96, 98], [108, 92], [110, 80], [100, 62], [96, 46]];
  return [
    { fill: INK, d: toPath(body), alpha: 1 },
    { fill: '#ffd23a', d: toPath([[78, 58], [86, 54], [92, 58, 1], [85, 62]]), alpha: 1 },
    { fill: '#140a06', d: ellipse(86, 58, 1.1, 3), alpha: 1 },
    { fill: 'rgba(255,230,190,0.5)', d: [[96, 84, 128, 78], [96, 88, 130, 90], [96, 86, 126, 98]].map(([a, b, c, e]) => `M${a} ${b}L${c} ${e}`).join(''), alpha: 'stroke' },
  ];
}

// draw: an oval of lantern light, the gold rim, the cut paper on top
export function cameo(who, size = 96) {
  const c = CAMEOS[who], parts = cameoParts(who);
  if (!parts) return null;
  const dpr = Math.min(3, Math.max(1, globalThis.devicePixelRatio || 1)), px = Math.round(size * dpr);
  const cv = document.createElement('canvas');
  cv.width = px; cv.height = px; cv.style.width = `${size}px`; cv.style.height = `${size}px`;
  cv.className = 'cameo'; cv.setAttribute('aria-hidden', 'true');
  const g = cv.getContext('2d'), S = px, rx = S * 0.4, ry = S * 0.48, cx = S / 2, cy = S / 2;
  const [a, b, e] = BG[c.bg] || BG.amber;
  g.save();
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.clip();
  const gr = g.createRadialGradient(cx + S * 0.08, cy - S * 0.12, 0, cx, cy, ry * 1.05);
  gr.addColorStop(0, a); gr.addColorStop(0.55, b); gr.addColorStop(1, e);
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  // the paper: a few fibres
  g.globalAlpha = 0.08; g.strokeStyle = '#fff3d8'; g.lineWidth = Math.max(1, S / 160);
  for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(0, (i + 0.5) * S / 9); g.bezierCurveTo(S * 0.3, (i + 0.2) * S / 9, S * 0.7, (i + 0.9) * S / 9, S, (i + 0.4) * S / 9); g.stroke(); }
  g.globalAlpha = 1;
  // place the head: crown near the top of the oval, profile a bit right of centre
  const k = c.cat ? S / 330 : S / (c.small ? 230 : c.hat === 'witch' ? 300 : c.hat === 'tall' ? 280 : c.hair === 'bun' ? 270 : 238);
  const ox = cx - (c.cat ? 52 : 44) * k, oy = cy - ry + (c.cat ? 18 : c.hat === 'witch' ? 128 : c.hat === 'tall' ? 92 : c.hair === 'bun' ? 52 : 26) * k + (c.small ? 50 * k : 0);
  // the cut paper is composed apart, then laid on the light with one soft shadow (no seams between pieces)
  const pc = document.createElement('canvas'); pc.width = px; pc.height = px;
  const pg = pc.getContext('2d');
  pg.translate(ox, oy); pg.scale(k, k);
  for (const p of parts) {
    const path = new Path2D(p.d);
    if (p.alpha === 'stroke') { pg.strokeStyle = p.fill; pg.lineWidth = c.cat ? 1.6 : 1.3; pg.lineCap = 'round'; pg.stroke(path); continue; }
    pg.fillStyle = p.fill; pg.fill(path, p.alpha === 'eo' ? 'evenodd' : 'nonzero');
  }
  g.shadowColor = 'rgba(30,10,4,0.6)'; g.shadowBlur = 3 * dpr; g.shadowOffsetX = -0.6 * dpr; g.shadowOffsetY = 0.8 * dpr;
  g.drawImage(pc, 0, 0);
  g.restore();
  // the rim: dark, then a fine gold line
  g.lineWidth = S * 0.035; g.strokeStyle = '#1a0f0a';
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.stroke();
  g.lineWidth = Math.max(1, S * 0.011); g.strokeStyle = '#c9a24a';
  g.beginPath(); g.ellipse(cx, cy, rx - S * 0.02, ry - S * 0.02, 0, 0, Math.PI * 2); g.stroke();
  return cv;
}
export { faceLine };
