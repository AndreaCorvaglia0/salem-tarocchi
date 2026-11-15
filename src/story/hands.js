// The Reader's hands, painted in code: long pale fingers, a gold ring, dark sleeves that come out of
// the dark behind the table. Never a face. Each hand is a small spring toward a pose; the scene sets
// the poses (rest, shuffle, turn a card) and calls draw() every frame.
import { smooth, lin, rad, clamp } from './paint.js';

const SKIN = { base: '#b99f8d', hi: '#d8c2ae', sh: '#6e5448', edge: '#3a2a24', nail: '#dccdc0' };
const FINGER = [{ x: -0.37, len: 0.92, w: 0.17 }, { x: -0.125, len: 1.05, w: 0.175 }, { x: 0.125, len: 0.94, w: 0.16 }, { x: 0.37, len: 0.72, w: 0.14 }];

export class Hand {
  // side: -1 = the hand on the left of the screen, +1 = the right (thumb toward the middle)
  constructor(side) {
    this.side = side;
    this.p = { x: 0, y: 0, rot: 0, curl: 0.2, spread: 0.6, point: 0 };
    this.to = { ...this.p };
    this.k = 7; this.seed = side > 0 ? 1.7 : 4.1;
    this.placed = false;
  }
  pose(to, k) { Object.assign(this.to, to); if (k) this.k = k; if (!this.placed) { Object.assign(this.p, this.to); this.placed = true; } }
  update(dt) { const a = 1 - Math.exp(-this.k * dt); for (const key of Object.keys(this.to)) this.p[key] += (this.to[key] - this.p[key]) * a; }

  // u: the scene's unit (px); sh: the shoulder the sleeve comes from; t: seconds; calm: reduced motion
  draw(g, u, sh, t, calm) {
    const s = calm ? 0 : 1, p = this.p, pw = 0.092 * u, pl = 0.105 * u;
    const sway = Math.sin(t * 0.9 + this.seed) * 0.006 * u * s;
    const x = p.x + sway, y = p.y + Math.cos(t * 1.1 + this.seed) * 0.004 * u * s;
    const rot = p.rot + Math.sin(t * 0.7 + this.seed) * 0.02 * s;
    // wrist point in screen space
    const wx = x + Math.sin(rot) * pl * 0.5, wy = y - Math.cos(rot) * pl * 0.5;
    this.sleeve(g, u, sh, [wx, wy]);
    // soft shadow of the hand on the table
    g.save(); g.fillStyle = 'rgba(0,0,0,0.28)'; g.beginPath(); g.ellipse(x + 0.012 * u, y + 0.03 * u, pw * 0.7, pl * 0.95, rot, 0, Math.PI * 2); g.fill(); g.restore();
    g.save();
    g.translate(x, y); g.rotate(rot); g.scale(this.side, 1);
    this.back(g, pw, pl, p, t, s);
    g.restore();
  }

  sleeve(g, u, sh, [wx, wy]) {
    const [sx, sy] = sh, w = 0.088 * u;
    const cpx = (sx + wx) / 2 + this.side * 0.035 * u, cpy = (sy + wy) / 2 - 0.02 * u;
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(cpx, cpy, wx, wy);
    g.strokeStyle = lin(g, sx, sy, wx, wy, [[0, '#050308'], [0.55, '#110b18'], [1, '#1c1325']]); g.lineWidth = w; g.stroke();
    g.strokeStyle = 'rgba(255,190,120,0.1)'; g.lineWidth = 1.5; // the candle catches the fold
    g.beginPath(); g.moveTo(sx - this.side * w * 0.3, sy); g.quadraticCurveTo(cpx - this.side * w * 0.3, cpy, wx - this.side * w * 0.3, wy); g.stroke();
    // the cuff: a darker band at the wrist with a thread of gold
    const tx = wx - cpx, ty = wy - cpy, tl = Math.hypot(tx, ty) || 1, ux = tx / tl, uy = ty / tl;
    g.lineCap = 'butt'; g.strokeStyle = '#2a1e30'; g.lineWidth = w * 0.86;
    g.beginPath(); g.moveTo(wx - ux * 0.03 * u, wy - uy * 0.03 * u); g.lineTo(wx, wy); g.stroke();
    g.strokeStyle = '#8c7340'; g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(wx - uy * w * 0.43, wy + ux * w * 0.43); g.lineTo(wx + uy * w * 0.43, wy - ux * w * 0.43); g.stroke();
    g.restore();
  }

  back(g, pw, pl, p, t, s) {
    const finger = (f, i) => {
      const curl = clamp(p.curl + (i === 1 ? -p.point * 0.6 : p.point * 0.5) + Math.sin(t * 1.3 + i + this.seed) * 0.03 * s, 0, 1);
      const L = f.len * pl * 1.02 * (1 - 0.38 * curl), w = f.w * pw;
      const a = (i - 1.5) * 0.1 * p.spread;
      const bx = f.x * pw, by = pl * 0.46;
      const bendDir = (i - 1.5) * 0.05, ang1 = a + curl * 0.1 + bendDir * 0.3, ang2 = a + curl * 0.42 + bendDir;
      const k1 = [bx + Math.sin(ang1) * L * 0.55, by + Math.cos(ang1) * L * 0.55];
      const tip = [k1[0] + Math.sin(ang2) * L * 0.5, k1[1] + Math.cos(ang2) * L * 0.5];
      g.lineCap = 'round'; g.lineJoin = 'round';
      g.strokeStyle = SKIN.edge; g.lineWidth = w + 2.2; g.beginPath(); g.moveTo(bx, by); g.lineTo(k1[0], k1[1]); g.stroke();
      g.lineWidth = w * 0.86 + 2.2; g.beginPath(); g.moveTo(k1[0], k1[1]); g.lineTo(tip[0], tip[1]); g.stroke();
      g.strokeStyle = SKIN.base; g.lineWidth = w; g.beginPath(); g.moveTo(bx, by); g.lineTo(k1[0], k1[1]); g.stroke();
      g.lineWidth = w * 0.86; g.beginPath(); g.moveTo(k1[0], k1[1]); g.lineTo(tip[0], tip[1]); g.stroke();
      g.strokeStyle = SKIN.hi; g.globalAlpha = 0.5; g.lineWidth = w * 0.28; g.beginPath(); g.moveTo(bx - w * 0.15, by); g.lineTo(k1[0] - w * 0.15, k1[1]); g.lineTo(tip[0] - w * 0.12, tip[1] - w * 0.2); g.stroke(); g.globalAlpha = 1;
      g.strokeStyle = SKIN.sh; g.globalAlpha = 0.55; g.lineWidth = Math.max(1, w * 0.08); g.beginPath(); g.moveTo(k1[0] - w * 0.4, k1[1]); g.lineTo(k1[0] + w * 0.4, k1[1]); g.stroke(); g.globalAlpha = 1; // the joint
      g.fillStyle = SKIN.nail; g.save(); g.translate(tip[0], tip[1]); g.rotate(-ang2); g.beginPath(); g.ellipse(0, -w * 0.12, w * 0.3, w * 0.4, 0, 0, Math.PI * 2); g.fill(); g.restore();
      if (i === 2) { g.strokeStyle = '#c8a64e'; g.lineWidth = w * 0.22; g.beginPath(); g.moveTo(bx - w * 0.5 + (k1[0] - bx) * 0.5, by + (k1[1] - by) * 0.5); g.lineTo(bx + w * 0.5 + (k1[0] - bx) * 0.5, by + (k1[1] - by) * 0.5); g.stroke(); }
    };
    // thumb first (it lies under the palm's edge), then the palm, then the fingers over its lower edge
    const th = () => {
      const a = 1.0 + p.curl * 0.2 - p.point * 0.3, L = pl * 0.56, w = pw * 0.26;
      const bx = -pw * 0.46, by = pl * 0.1, k1 = [bx - Math.sin(a) * L * 0.55, by + Math.cos(a) * L * 0.55], tip = [k1[0] - Math.sin(a - 0.5) * L * 0.5, k1[1] + Math.cos(a - 0.5) * L * 0.5];
      g.lineCap = 'round'; g.strokeStyle = SKIN.edge; g.lineWidth = w + 2.2; g.beginPath(); g.moveTo(bx, by); g.lineTo(k1[0], k1[1]); g.lineTo(tip[0], tip[1]); g.stroke();
      g.strokeStyle = SKIN.base; g.lineWidth = w; g.stroke();
    };
    th();
    g.beginPath();
    smooth(g, [[-pw * 0.38, -pl * 0.5], [pw * 0.38, -pl * 0.5], [pw * 0.52, -pl * 0.05], [pw * 0.5, pl * 0.5], [-pw * 0.5, pl * 0.5], [-pw * 0.54, -pl * 0.05]], true);
    g.fillStyle = rad(g, 0, -pl * 0.15, pw * 0.05, pw * 0.8, [[0, SKIN.hi], [0.55, SKIN.base], [1, SKIN.sh]]);
    g.fill(); g.strokeStyle = SKIN.edge; g.lineWidth = 1.6; g.stroke();
    g.strokeStyle = SKIN.sh; g.globalAlpha = 0.35; g.lineWidth = 1.2; // tendons
    for (const dx of [-0.25, 0, 0.25]) { g.beginPath(); g.moveTo(dx * pw * 0.5, -pl * 0.42); g.lineTo(dx * pw * 1.1, pl * 0.4); g.stroke(); }
    g.globalAlpha = 1;
    // fingers, the middle ones last so they overlap the neighbours a little
    [0, 3, 1, 2].forEach((i) => finger(FINGER[i], i));
    g.fillStyle = SKIN.hi; g.globalAlpha = 0.5; for (const f of FINGER) { g.beginPath(); g.arc(f.x * pw, pl * 0.45, pw * 0.07, 0, Math.PI * 2); g.fill(); } g.globalAlpha = 1; // knuckles
    // a dark stone ring on the index
    g.fillStyle = '#5a1f2c'; g.beginPath(); g.arc(FINGER[0].x * pw, pl * 0.46 + pl * 0.28, pw * 0.07, 0, Math.PI * 2); g.fill();
  }
}
