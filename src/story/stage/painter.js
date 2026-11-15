// Paints one tableau: the lit field, three sheets of cut paper (cached canvases, a little wider than
// the screen for the parallax), the animated things (candle, fire, snow, smoke, dust, clouds), the
// vignette. new Painter(def, env) -> .frame(g, t, dt) every frame; .rebuild() when an image arrives.
import { TABLEAUX } from './tableaux.js';
import { SIL } from './silhouettes.js';
import * as SC from './scenery.js';
import { canvas, drawSil, glow } from './draw.js';
import { paintField, paintVignette, flicker, Dust, Snow, drawMoon, drawSun } from './light.js';
import { drawCandle, drawFire } from './flame.js';
import { rnd, wob, clamp } from './kit.js';

const SPAN_ARG = { skyline: 1, ground: 1, crowd: 1, band: 0, cloth: 0 };
// paper per sheet: far is thin and pale, near is thick and black; tones for snow, light, mist
const SHEET = {
  far: { color: '#4a2412', alpha: 0.5, soft: 2.2, depth: 0.35 },
  mid: { color: '#1e0e07', alpha: 0.9, soft: 1.2, depth: 0.65 },
  near: { color: '#0b0503', alpha: 1, soft: 0.8, depth: 1 },
};
const TONE = { snow: ['#f1e2c8', 0.55], lit: ['#ffe2aa', 0.3], mist: ['#7a4a2c', 0.35], field: ['#d8b483', 0.3], trodden: ['#5a3a26', 0.45] };
export const CANDLE_LEVEL = [1, 0.8, 0.6, 0.42, 0.24]; // session 0..4: the candle burns down

export class Painter {
  // env: { W, H, d (device px per css px), level, found: ids, imgOf(id) -> Image|null, calm }
  constructor(name, env) {
    this.name = name; this.def = TABLEAUX[name] || TABLEAUX.reader; this.env = env;
    this.dust = new Dust(30, name.length * 7); this.snow = new Snow(90, name.length * 3); this.lean = 0;
    this.build();
  }
  get U() { const { W, H } = this.env; return Math.min(W, H * 0.62); }
  px(x) { return this.env.W / 2 + x * this.U; }
  build() {
    const { W, H, d } = this.env, def = this.def, U = this.U;
    this.pad = Math.round(U * 0.05);
    const L = def.light;
    this.light = { x: this.px(L.x), y: L.y * H, r: L.r * Math.max(U, H * 0.55), c: L.c };
    this.field = paintField(W, H, this.light, this.name.length * 13);
    // the sun is still: baked into the field once
    const sun = (def.fx || []).find((f) => f.fx === 'sun');
    if (sun) drawSun(this.field.getContext('2d'), this.px(sun.x), sun.y * H, sun.r * U, 0, true);
    this.vignette = paintVignette(W, H, 0.82);
    this.lights = []; this.lanterns = [];
    this.sheets = {};
    for (const key of ['far', 'mid', 'near']) this.sheets[key] = this.paintSheet(key, def[key] || []);
    this.cardsAt = def.cards ? { x: this.px(def.cards.x), y: def.cards.y * H, h: def.cards.h * H * (W > H ? 1.25 : 1) } : null; // a bit larger on a wide screen
    this.smokeAt = def.smoke ? { x: this.px(def.smoke.x), y: def.smoke.y * H, size: def.smoke.size * U } : { x: W / 2, y: H * 0.3, size: U * 0.22 };
    this.candleAt = null;
    for (const f of def.fx || []) if (f.fx === 'candle') this.candleAt = { x: this.px(f.x), y: f.y * H, h: f.h * U, w: Math.max(6 * d, U * 0.045) };
    if (this.candleAt) this.candleAt.top = this.candleAt.y - this.candleAt.h * CANDLE_LEVEL[clamp(this.env.level | 0, 0, 4)];
  }
  paintSheet(key, items) {
    const { W, H, d } = this.env, U = this.U, pad = this.pad, sh = SHEET[key];
    const [c, g] = canvas(W + pad * 2, H);
    const ghost = { dx: U * 0.006, dy: U * 0.004, color: '#000', alpha: key === 'far' ? 0.06 : 0.14 };
    for (const it of items) {
      if (it.fx === 'hang') { this.paintHanging(g, pad); continue; }
      if (it.fx) continue;
      const bx = (it.edge === 'l' ? 0 : it.edge === 'r' ? W : this.px(it.x)) + pad, by = it.y * H;
      if (it.sil) {
        const s = SIL[it.sil]; if (!s) continue;
        const k = (it.h * U) / s.h;
        drawSil(g, s, bx, by, k, !!it.flip, { color: sh.color, alpha: sh.alpha, soft: sh.soft * d, ghost });
        if (it.lantern && s.anchors?.hand) {
          const [hx, hy] = s.anchors.hand, lx = bx + (it.flip ? -hx : hx) * k, ly = by + hy * k + SIL.lantern.h * k * 0.9;
          drawSil(g, SIL.lantern, lx, ly, k * 0.9, false, { color: sh.color, alpha: 1, soft: sh.soft * d });
          this.lanterns.push([lx - pad, ly + SIL.lantern.anchors.light[1] * k * 0.9, k * 90]);
        }
        continue;
      }
      const fn = SC[it.gen]; if (!fn) continue;
      const k = (it.h * U) / 1000, args = (it.args || []).slice();
      if (it.full && SPAN_ARG[it.gen] != null) args[SPAN_ARG[it.gen]] = (W + pad * 2) / k + 200;
      const placed = fn(...args);
      for (const p of placed) {
        const tone = p.tone && TONE[p.tone];
        const x = bx + (it.flip ? -p.x : p.x) * k, y = by + p.y * k, kk = k * (p.s || 1), flip = !!it.flip !== !!p.flip;
        if (tone) drawSil(g, p.parts, x, y, kk, flip, { color: tone[0], alpha: tone[1] * (key === 'far' ? 0.6 : 1), soft: sh.soft * d });
        else drawSil(g, p.parts, x, y, kk, flip, { color: sh.color, alpha: sh.alpha, soft: sh.soft * d, ghost: p.ghost === false ? null : ghost });
      }
      if (placed.lights) for (const [lx, ly, r] of placed.lights) this.lights.push([bx - pad + (it.flip ? -lx : lx) * k, by + ly * k, r * k, key]);
    }
    return c;
  }
  // the cards you found, small, on threads from the dark above; each keeps its place
  paintHanging(g, pad) {
    const { W, H, found = [], imgOf } = this.env, U = this.U, list = found.slice().sort().slice(0, 22);
    const ch = Math.min(H * 0.056, U * 0.13), cw = ch * 0.583;
    list.forEach((id) => {
      const n = parseInt(id.slice(1), 10) || 0, r = rnd(n * 7 + 3);
      const x = pad + W * (0.05 + 0.9 * ((n * 0.618034 + 0.13) % 1)), y = H * (0.05 + (n % 4) * 0.035) + r() * H * 0.015, rot = (r() - 0.5) * 0.18;
      g.save();
      g.strokeStyle = 'rgba(40,18,8,0.5)'; g.lineWidth = Math.max(1, U / 500); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y - ch / 2); g.stroke();
      g.translate(x, y); g.rotate(rot);
      const im = imgOf?.(id);
      g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 6;
      if (im) { g.globalAlpha = 0.42; g.drawImage(im, -cw / 2, -ch / 2, cw, ch); g.shadowBlur = 0; g.globalAlpha = 0.55; g.fillStyle = '#3a1608'; g.fillRect(-cw / 2, -ch / 2, cw, ch); }
      else { g.fillStyle = 'rgba(30,14,6,0.6)'; g.fillRect(-cw / 2, -ch / 2, cw, ch); }
      g.restore();
    });
  }
  // the camera: a very slow drift, each sheet by its depth
  drift(t, depth) { const U = this.U; return this.env.calm ? 0 : (Math.sin(t * 0.07) * 0.6 + Math.sin(t * 0.031 + 1) * 0.4) * U * 0.03 * depth; }
  frame(g, t, dt, smoke) {
    const { W, H, d, calm } = this.env, U = this.U, fl = calm ? 1 : flicker(t), def = this.def, pad = this.pad;
    this.lean *= Math.exp(-dt * 2.2);
    g.drawImage(this.field, 0, 0);
    glow(g, this.light.x, this.light.y, this.light.r * 0.7, '255,190,110', 0.12 * (fl - 0.92) * 6);
    const moon = (def.fx || []).find((f) => f.fx === 'moon');
    if (moon) drawMoon(g, this.px(moon.x), moon.y * H, moon.r * U, t);
    for (const key of ['far', 'mid', 'near']) {
      const off = this.drift(t, SHEET[key].depth);
      if (key === 'mid' && (def.mid || []).some((i) => i.fx === 'clouds')) this.clouds(g, t);
      g.drawImage(this.sheets[key], -pad + off, 0);
      if (key === 'far') for (const [x, y, r, k] of this.lights) if (k === 'far') glow(g, x + off, y, r * 2.2, '255,200,120', 0.42 * fl);
      if (key === 'mid') for (const [x, y, r, k] of this.lights) if (k === 'mid') glow(g, x + off, y, r * 1.4, '255,200,120', 0.3 * fl);
      if (key === 'near') for (const [x, y, r] of this.lanterns) { glow(g, x + off, y, r * 4, '255,190,100', 0.45 * fl); glow(g, x + off, y, r * 0.8, '255,236,190', 0.7 * fl); }
      if (key === 'mid') {
        for (const f of def.fx || []) {
          if (f.fx === 'glow') glow(g, this.px(f.x) + off, f.y * H, f.r * U, f.rgb, f.a * fl);
          if (f.fx === 'pool') glow(g, this.px(f.x), f.y * H, f.r * U, '255,190,110', 0.16 * fl);
        }
      }
    }
    const offN = this.drift(t, 1);
    for (const f of def.fx || []) {
      if (f.fx === 'fire') drawFire(g, this.px(f.x) + offN, f.y * H, f.h * U, t, calm);
      if (f.fx === 'candle' && this.candleAt) { const c = this.candleAt; drawCandle(g, c.x + offN, c.y, c.y - c.top, c.w, t, calm, this.lean, d); }
    }
    if (smoke) { if (this.candleAt) smoke.source(this.candleAt.x + offN, this.candleAt.top - this.candleAt.w * 4); else smoke.source(null); smoke.draw(g, t, d, calm); }
    if ((def.fx || []).some((f) => f.fx === 'snow')) this.snow.draw(g, W, H, t, calm, d, this.drift(t, 1) / W);
    this.dust.draw(g, W, H, t, this.light.x, this.light.y, this.light.r * 0.8, calm, d);
    g.drawImage(this.vignette, 0, 0);
  }
  // paper clouds sliding slowly across the dawn
  clouds(g, t) {
    if (!this.cloudSheets) {
      const U = this.U; this.cloudSheets = [0, 1, 2].map((i) => {
        const p = SC.cloud(90 + i, 700 + i * 200), k = U * (0.5 + i * 0.15) / 1000;
        const [c, cg] = canvas(U * 0.75, U * 0.2);
        drawSil(cg, p[0].parts, c.width / 2, c.height * 0.9, k, i % 2 === 1, { color: '#7a3424', alpha: 1, soft: 3 });
        return { c, a: [0.42, 0.32, 0.5][i], y: [0.24, 0.36, 0.14][i], v: [0.006, 0.01, 0.004][i], x0: [0.1, 0.6, 0.35][i] };
      });
    }
    const { W, H, calm } = this.env;
    for (const cl of this.cloudSheets) {
      const span = W + cl.c.width, x = ((((cl.x0 + (calm ? 0 : cl.v * t)) * span) % span) + span) % span - cl.c.width;
      g.globalAlpha = cl.a; g.drawImage(cl.c, x, cl.y * H - cl.c.height); g.globalAlpha = 1;
    }
  }
}
export { wob };
