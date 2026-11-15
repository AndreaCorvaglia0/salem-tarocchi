// Smoke and ink: thin wisps rise from a source (the candle) and drift; on cue many particles gather
// into a symbol (moon, star, eye...), hold it, breathing, then let it go. Drawn as soft sprites in a
// pale gold, additive, so the shape glows over dark paper and lighter parchment alike.
import { canvas } from './draw.js';
import { sampleSymbol } from './symbols.js';
import { rnd, ease, easeOut, wob } from './kit.js';

let sprite = null;
const getSprite = () => {
  if (sprite) return sprite;
  const [c, g] = canvas(64, 64), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,236,200,0.9)'); gr.addColorStop(0.35, 'rgba(255,214,160,0.35)'); gr.addColorStop(1, 'rgba(255,200,140,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  sprite = c; return c;
};

export class Smoke {
  constructor(seed = 11) { this.r = rnd(seed); this.wisps = []; this.shape = null; this.src = null; this.acc = 0; }
  source(x, y) { this.src = x == null ? null : [x, y]; }
  // gather into a symbol at (cx, cy), size = half-width in px. Resolves when it has gone.
  symbol(name, cx, cy, size, { hold = 2.4, calm = false } = {}) {
    const pts = sampleSymbol(name, 240), r = this.r;
    const from = this.src || [cx, cy + size * 1.6];
    const ps = pts.map(([px, py], i) => {
      const a = r() * 6.28, rad = size * (0.6 + r() * 1.4);
      return { sx: from[0] + Math.cos(a) * size * 0.25 * r(), sy: from[1] - r() * size * 0.3, cx: cx + Math.cos(a) * rad, cy: cy + Math.sin(a) * rad * 0.8,
        tx: cx + px * size, ty: cy + py * size, d: (i / pts.length) * 0.5 + r() * 0.25, ph: r() * 6, s: 0.7 + r() * 0.6, vx: (r() - 0.5), vy: -0.4 - r() };
    });
    return new Promise((res) => { this.shape = { ps, t: 0, gather: calm ? 0.9 : 2.4, hold, out: calm ? 0.9 : 2, calm, size, res }; });
  }
  update(dt, t, d) {
    // wisps from the source
    if (this.src) {
      this.acc += dt * 5;
      while (this.acc > 1) { this.acc -= 1; this.wisps.push({ x: this.src[0] + (this.r() - 0.5) * 3 * d, y: this.src[1], age: 0, life: 3 + this.r() * 2, ph: this.r() * 6 }); }
    }
    for (let i = this.wisps.length - 1; i >= 0; i--) {
      const w = this.wisps[i]; w.age += dt;
      if (w.age > w.life) { this.wisps.splice(i, 1); continue; }
      w.y -= dt * 22 * d; w.x += Math.sin(t * 0.9 + w.ph + w.age * 1.6) * dt * 9 * d * w.age;
    }
    if (this.shape) { this.shape.t += dt; const S = this.shape; if (S.t > S.gather + S.hold + S.out) { this.shape = null; S.res(); } }
  }
  draw(g, t, d, calm) {
    const sp = getSprite();
    g.save(); g.globalCompositeOperation = 'lighter';
    for (const w of this.wisps) {
      const k = w.age / w.life, s = (5 + k * 26) * d;
      g.globalAlpha = Math.sin(Math.PI * k) * 0.09;
      g.drawImage(sp, w.x - s / 2, w.y - s / 2, s, s);
    }
    const S = this.shape;
    if (S) {
      const { gather, hold, out } = S;
      for (const p of S.ps) {
        let x, y, a;
        const tg = (S.t - p.d * (S.calm ? 0 : 1)) / gather;
        if (S.t < gather + hold || S.calm) {
          if (S.calm) { x = p.tx; y = p.ty; a = Math.min(1, S.t / gather) * (S.t > gather + hold ? Math.max(0, 1 - (S.t - gather - hold) / out) : 1); }
          else {
            const k = ease(Math.min(1, Math.max(0, tg)));
            const u = 1 - k; // quadratic Bezier: rise from the source, swirl wide, settle on the line
            x = u * u * p.sx + 2 * u * k * p.cx + k * k * p.tx; y = u * u * p.sy + 2 * u * k * p.cy + k * k * p.ty;
            const br = Math.min(1, Math.max(0, S.t - gather) / 0.8);
            x += wob(t * 0.8, p.ph) * 1.6 * d * br; y += wob(t * 0.7, p.ph + 2) * 1.6 * d * br;
            a = Math.min(1, Math.max(0, tg) * 1.6);
          }
        } else {
          const k = (S.t - gather - hold) / out, e = easeOut(k);
          x = p.tx + p.vx * S.size * 0.5 * e + Math.sin(t + p.ph) * 4 * d * k; y = p.ty + p.vy * S.size * 0.6 * e; a = 1 - k;
        }
        const s = (S.size * 0.11 + 4 * d) * p.s;
        g.globalAlpha = Math.max(0, a) * 0.32;
        g.drawImage(sp, x - s / 2, y - s / 2, s, s);
      }
    }
    g.restore(); void calm;
  }
}
