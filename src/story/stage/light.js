// The light and the paper: a warm field like a lantern behind parchment (amber to deep brown-black),
// paper fibres and blotches baked in, a soft vignette, the breathing flicker, dust motes in the beam,
// snow. Everything is cached per size; per frame only cheap draws happen.
import { canvas, glow } from './draw.js';
import { rnd, wob, clamp } from './kit.js';

// the lit screen behind the figures. light: { x, y, r } in px, c: [inner, mid, outer]
export function paintField(W, H, light, seed = 1) {
  const [c, g] = canvas(W, H), r = rnd(seed);
  const [a, b, e] = light.c;
  g.fillStyle = e; g.fillRect(0, 0, W, H);
  const gr = g.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.r);
  gr.addColorStop(0, a); gr.addColorStop(0.42, b); gr.addColorStop(1, e);
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // parchment: soft blotches, then long fibres, then a fine speckle
  const S = Math.max(W, H);
  for (let i = 0; i < 18; i++) {
    const x = r() * W, y = r() * H, rr = S * (0.08 + r() * 0.2);
    const bl = g.createRadialGradient(x, y, 0, x, y, rr);
    bl.addColorStop(0, r() < 0.5 ? 'rgba(60,24,6,0.10)' : 'rgba(255,230,180,0.06)'); bl.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = bl; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  g.lineWidth = Math.max(1, S / 900);
  for (let i = 0; i < 70; i++) {
    const y = r() * H, x = r() * W, len = S * (0.1 + r() * 0.3);
    g.strokeStyle = r() < 0.6 ? 'rgba(255,236,200,0.05)' : 'rgba(50,20,6,0.06)';
    g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + len * 0.3, y + (r() - 0.5) * 12, x + len * 0.7, y + (r() - 0.5) * 12, x + len, y + (r() - 0.5) * 8); g.stroke();
  }
  return c;
}

// the darkness at the edges and a fine paper speckle that also lies over the figures
export function paintVignette(W, H, strength = 0.85, seed = 2) {
  const [c, g] = canvas(W, H), r = rnd(seed);
  const gr = g.createRadialGradient(W / 2, H * 0.42, Math.min(W, H) * 0.28, W / 2, H * 0.45, Math.hypot(W, H) * 0.62);
  gr.addColorStop(0, 'rgba(8,3,1,0)'); gr.addColorStop(0.7, `rgba(8,3,1,${strength * 0.55})`); gr.addColorStop(1, `rgba(6,2,1,${strength})`);
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const n = Math.round((W * H) / 900), s = Math.max(1, Math.round(Math.max(W, H) / 700));
  for (let i = 0; i < n; i++) { g.fillStyle = r() < 0.5 ? 'rgba(255,240,210,0.035)' : 'rgba(0,0,0,0.05)'; g.fillRect(r() * W, r() * H, s, s); }
  return c;
}

// the breath of a candle: around 1, never still, never jumpy
export const flicker = (t) => 1 + 0.045 * wob(t * 2.6) + 0.02 * wob(t * 8.3, 2);

// dust motes: only seen inside the beam
export class Dust {
  constructor(n = 34, seed = 5) { const r = rnd(seed); this.p = Array.from({ length: n }, () => ({ x: r(), y: r(), vx: (r() - 0.5) * 0.006, vy: -0.002 - r() * 0.006, ph: r() * 6, s: 0.6 + r() * 1.4 })); }
  draw(g, W, H, t, lx, ly, R, calm, d = 1) {
    g.save(); g.fillStyle = '#ffe2b0';
    for (const p of this.p) {
      const x = (((p.x + (calm ? 0 : p.vx * t)) % 1) + 1) % 1 * W, y = (((p.y + (calm ? 0 : p.vy * t)) % 1) + 1) % 1 * H;
      const a = clamp(1 - Math.hypot(x - lx, y - ly) / R) * (0.35 + 0.3 * Math.sin(t * 1.3 + p.ph));
      if (a < 0.03) continue;
      g.globalAlpha = a * 0.8; const s = p.s * d * 1.3; g.beginPath(); g.arc(x, y, s, 0, 6.3); g.fill();
    }
    g.restore();
  }
}

// snow: slow, three depths, a little sway; calm = frozen flakes
export class Snow {
  constructor(n = 80, seed = 9) { const r = rnd(seed); this.p = Array.from({ length: n }, (_, i) => ({ x: r(), y: r(), z: i % 3, v: 0.012 + r() * 0.02, ph: r() * 6 })); }
  draw(g, W, H, t, calm, d = 1, drift = 0) {
    g.save(); g.fillStyle = '#f4e6cc';
    for (const p of this.p) {
      const sp = p.v * (0.6 + p.z * 0.4), y = (((p.y + (calm ? 0 : sp * t)) % 1) + 1) % 1;
      const x = (((p.x + (calm ? 0 : Math.sin(t * 0.6 + p.ph) * 0.006) + drift * (0.3 + p.z * 0.35)) % 1) + 1) % 1;
      g.globalAlpha = 0.25 + p.z * 0.22;
      g.beginPath(); g.arc(x * W, y * H, (0.9 + p.z * 0.9) * d, 0, 6.3); g.fill();
    }
    g.restore();
  }
}

// a pale moon: a disc of light with a halo (a hole in the dark paper)
export function drawMoon(g, x, y, r, t) {
  glow(g, x, y, r * 6, '255,226,170', 0.22);
  g.save(); g.fillStyle = '#fbe9c4'; g.globalAlpha = 0.92; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
  g.globalAlpha = 0.12; g.fillStyle = '#c9a072'; g.beginPath(); g.arc(x - r * 0.3, y - r * 0.15, r * 0.28, 0, 6.3); g.arc(x + r * 0.25, y + r * 0.3, r * 0.2, 0, 6.3); g.fill();
  g.restore(); void t;
}

// the rising sun: a big pale disc and long soft rays that breathe slowly (rays cached in a sprite)
let sunSprite = null;
export function drawSun(g, x, y, r, t, calm) {
  const R = Math.round(r * 6);
  if (!sunSprite || sunSprite.R !== R) {
    const [c, sg] = canvas(R * 2, R * 2);
    sg.translate(R, R); sg.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2, w = 0.05 + (i % 2) * 0.03;
      const gr = sg.createLinearGradient(0, 0, Math.cos(a) * R, Math.sin(a) * R);
      gr.addColorStop(0, 'rgba(255,230,180,0.16)'); gr.addColorStop(1, 'rgba(255,230,180,0)');
      sg.fillStyle = gr; sg.beginPath(); sg.moveTo(0, 0); sg.arc(0, 0, R, a - w, a + w); sg.closePath(); sg.fill();
    }
    sunSprite = { c, R };
  }
  glow(g, x, y, r * 7, '255,214,150', 0.5);
  // the rays breathe instead of turning: a rotated large image is slow on phones without a GPU path
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = calm ? 1 : 0.85 + 0.15 * Math.sin(t * 0.35);
  g.drawImage(sunSprite.c, x - R, y - R); g.restore();
  g.save(); g.fillStyle = '#fff3d6'; g.globalAlpha = 0.95; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill(); g.restore();
}
export { glow };
