// The only truly animated things: a candle flame (a teardrop of layered light that sways, stretches
// and breathes, with a blue root and a white heart) and a campfire made of the same tongues.
import { glow } from './draw.js';
import { wob } from './kit.js';

// a teardrop from the root (x, y) to a tip h above, half-width w, tip pushed sideways by `sway`
function drop(g, x, y, w, h, sway) {
  g.beginPath();
  g.moveTo(x, y + w * 0.35);
  g.bezierCurveTo(x - w * 1.25, y + w * 0.1, x - w * 0.95, y - h * 0.55, x + sway, y - h);
  g.bezierCurveTo(x + w * 0.95 + sway * 0.2, y - h * 0.55, x + w * 1.25, y + w * 0.1, x, y + w * 0.35);
  g.closePath();
}

// one flame: s = height in px; lean > 0 pushes the tip right (she spoke)
export function drawFlame(g, x, y, s, t, calm, lean = 0, bright = 1) {
  const k = calm ? 1 : 1 + 0.07 * wob(t * 4.1, 1) + 0.03 * wob(t * 11, 3);
  const sway = (calm ? 0 : wob(t * 1.7) * 0.1 * s) + lean * s * 0.35, h = s * k, w = s * 0.2;
  glow(g, x, y - h * 0.45, s * 7, '255,160,70', 0.22 * bright * k);
  glow(g, x, y - h * 0.5, s * 2.4, '255,200,120', 0.35 * bright * k);
  g.save();
  g.globalCompositeOperation = 'lighter';
  // the outer veil of the flame
  let gr = g.createRadialGradient(x, y - h * 0.3, 0, x, y - h * 0.35, h * 0.85);
  gr.addColorStop(0, 'rgba(255,200,110,0.9)'); gr.addColorStop(0.55, 'rgba(240,120,40,0.55)'); gr.addColorStop(1, 'rgba(200,60,20,0)');
  g.fillStyle = gr; drop(g, x, y, w * 1.25, h * 1.08, sway * 1.1); g.fill();
  // the body
  gr = g.createLinearGradient(x, y, x, y - h);
  gr.addColorStop(0, 'rgba(255,214,140,0.95)'); gr.addColorStop(0.5, 'rgba(255,190,90,0.9)'); gr.addColorStop(1, 'rgba(255,140,60,0.2)');
  g.fillStyle = gr; drop(g, x, y, w, h, sway); g.fill();
  // the white heart
  g.fillStyle = 'rgba(255,250,232,0.92)'; drop(g, x, y - h * 0.06, w * 0.45, h * 0.52, sway * 0.4); g.fill();
  // the blue root
  g.globalCompositeOperation = 'source-over';
  gr = g.createRadialGradient(x, y + w * 0.1, 0, x, y + w * 0.1, w * 0.9);
  gr.addColorStop(0, 'rgba(90,110,230,0.55)'); gr.addColorStop(1, 'rgba(90,110,230,0)');
  g.fillStyle = gr; g.beginPath(); g.ellipse(x, y + w * 0.05, w * 0.8, w * 0.6, 0, 0, 6.3); g.fill();
  g.restore();
}

// a candle as cut paper, rim-lit by its own flame; h, w in px (h shrinks session after session)
export function drawCandle(g, x, base, h, w, t, calm, lean = 0, d = 1) {
  const top = base - h;
  g.save();
  // the holder: a little dish
  g.fillStyle = '#0b0503';
  g.beginPath(); g.ellipse(x, base, w * 1.5, w * 0.32, 0, 0, 6.3); g.fill();
  g.fillRect(x - w * 1.5, base - 1, w * 3, w * 0.22);
  // the wax, with two drips
  g.beginPath();
  g.moveTo(x - w / 2, base); g.lineTo(x - w / 2, top + w * 0.12);
  g.quadraticCurveTo(x - w * 0.2, top - w * 0.06, x, top); g.quadraticCurveTo(x + w * 0.25, top + w * 0.05, x + w / 2, top + w * 0.1);
  g.lineTo(x + w / 2, base); g.closePath(); g.fill();
  g.beginPath(); g.ellipse(x - w * 0.5, top + w * 0.6, w * 0.13, w * 0.42, 0, 0, 6.3); g.ellipse(x + w * 0.5, top + w * 1.1, w * 0.11, w * 0.6, 0, 0, 6.3); g.fill();
  // a warm rim on the wax where the flame touches it
  const gr = g.createLinearGradient(x, top, x, top + w * 0.9);
  gr.addColorStop(0, 'rgba(255,190,110,0.4)'); gr.addColorStop(1, 'rgba(255,190,110,0)');
  g.fillStyle = gr; g.fillRect(x - w / 2, top, w, Math.min(h, w * 0.9));
  // the wick
  g.strokeStyle = '#120806'; g.lineWidth = Math.max(1, w * 0.07); g.beginPath(); g.moveTo(x, top + 1); g.quadraticCurveTo(x + w * 0.04, top - w * 0.12, x + w * 0.02, top - w * 0.24); g.stroke();
  g.restore();
  drawFlame(g, x + w * 0.02, top - w * 0.2, w * 1.9, t, calm, lean);
  void d;
}

// a campfire: tongues of the same flame, out of phase, and a few sparks rising
export function drawFire(g, x, y, s, t, calm) {
  glow(g, x, y - s * 0.4, s * 5, '255,150,60', 0.32 * (calm ? 1 : 1 + 0.12 * wob(t * 3)));
  const tongues = [[-0.36, 0.55, 0], [0.32, 0.6, 1.3], [-0.12, 0.9, 2.1], [0.12, 0.82, 3.7], [0, 1, 5.1]];
  for (const [dx, hh, ph] of tongues) drawFlameTongue(g, x + dx * s, y, s * hh, t + ph, calm);
  if (calm) return;
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = '#ffcf80';
  for (let i = 0; i < 9; i++) {
    const life = ((t * 0.35 + i * 0.137) % 1), sx = x + Math.sin(i * 7.1 + t * 0.8) * s * 0.4 * life, sy = y - s * 0.5 - life * s * 2.2;
    g.globalAlpha = (1 - life) * 0.8; g.beginPath(); g.arc(sx, sy, Math.max(1, s * 0.018) * (1 - life * 0.5), 0, 6.3); g.fill();
  }
  g.restore();
}
function drawFlameTongue(g, x, y, s, t, calm) {
  const k = calm ? 1 : 1 + 0.16 * wob(t * 3.3, 1), sway = calm ? 0 : wob(t * 2.1, 2) * 0.16 * s, h = s * k, w = s * 0.24;
  g.save(); g.globalCompositeOperation = 'lighter';
  let gr = g.createLinearGradient(x, y, x, y - h);
  gr.addColorStop(0, 'rgba(255,200,110,0.85)'); gr.addColorStop(0.6, 'rgba(240,110,40,0.55)'); gr.addColorStop(1, 'rgba(200,50,20,0)');
  g.fillStyle = gr; drop(g, x, y, w, h, sway); g.fill();
  gr = g.createLinearGradient(x, y, x, y - h * 0.55);
  gr.addColorStop(0, 'rgba(255,246,220,0.85)'); gr.addColorStop(1, 'rgba(255,220,150,0)');
  g.fillStyle = gr; drop(g, x, y - h * 0.03, w * 0.45, h * 0.5, sway * 0.4); g.fill();
  g.restore();
}
