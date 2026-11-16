// The real herbs of the herbarium (src/data/herbs/base.js) as small sprites in the world: one per plant,
// drawn in code from its botanical plate (public/herbs/<id>.webp), 16 px wide and 12-28 px tall, the base
// on the last row. Each texture 'herb-<id>' is a sheet of two frames: still, and the top swayed one pixel
// (scene/herbs.js swaps them now and then). A soft dark rim, like the rest of the world's art, keeps
// them readable under the night tint. makeHerbs(scene) registers all of them; herbArt(id) is the bare canvas.
import { INK } from './palette.js';
import { makeCanvas, hash, addSheet } from './px.js';

const W = 16;
const RIM = 'rgba(18,15,28,0.5)';

// A pixel grid: plants are drawn in it, then rendered with a rim and a sway.
class Grid {
  constructor(h) { this.h = h; this.p = new Map(); }
  set(x, y, c) { x = Math.round(x); y = Math.round(y); if (x < 0 || x >= W || y < 0 || y >= this.h || !c) return; this.p.set(y * W + x, c); }
  has(x, y) { return x >= 0 && x < W && y >= 0 && y < this.h && this.p.has(y * W + x); }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    for (let i = 0; i <= n; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, typeof c === 'function' ? c(i, n) : c);
  }
  // a filled ellipse lit from the top left: [dark, mid, light]
  blob(cx, cy, rx, ry, pal, seed = 0) {
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) {
      const d = (x * x) / ((rx + 0.5) ** 2) + (y * y) / ((ry + 0.5) ** 2);
      if (d > 1) continue;
      const l = -0.6 * (x / (rx + 0.5)) - 0.8 * (y / (ry + 0.5)) + (hash(cx + x, cy + y, seed) - 0.5) * 0.5;
      this.set(cx + x, cy + y, l > 0.45 ? pal[2] : l < -0.35 ? pal[0] : pal[1]);
    }
  }
}

// A pointed leaf from (x0, y0) along angle a (degrees, 0 = right, -90 = up): len long, wid half-wide,
// pal [rib/dark, shade, light]; teeth: a jagged rim
function leaf(g, x0, y0, a, len, wid, pal, teeth = false) {
  const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  for (let t = 0; t <= len; t += 0.5) {
    const hw = wid * Math.pow(Math.sin(Math.PI * Math.min(1, (t + 0.5) / (len + 0.5))), 0.7);
    for (let k = -hw; k <= hw + 0.01; k += 0.5) {
      const edge = Math.abs(k) > hw - 0.6;
      if (teeth && edge && Math.round(t) % 2) continue;
      g.set(x0 + c * t - s * k, y0 + s * t + c * k, Math.abs(k) < 0.3 && t > 0.5 ? pal[0] : k < 0 ? pal[2] : pal[1]);
    }
  }
}

// frame 1 leans the upper part of the plant one pixel (stiff: only the top third)
function render(g, sway = 0.45) {
  const H = g.h, [c, ctx] = makeCanvas(W * 2, H);
  for (let f = 0; f < 2; f++) {
    const shift = (y) => (f && sway && (H - 1 - y) / (H - 1) > sway ? 1 : 0);
    const at = (x, y) => g.has(x - shift(y), y);
    // the rim: empty pixels next to the plant
    ctx.fillStyle = RIM;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (at(x, y)) continue;
      const l = at(x - 1, y), r = at(x + 1, y), u = at(x, y - 1), d = at(x, y + 1);
      if ((l && r) || (u && d)) continue; // a gap inside the plant stays open
      if (l || r || u || d) ctx.fillRect(f * W + x, y, 1, 1);
    }
    for (const [k, col] of g.p) {
      const x = k % W, y = (k - x) / W, sx = x + shift(y);
      if (sx < 0 || sx >= W) continue;
      ctx.fillStyle = col; ctx.fillRect(f * W + sx, y, 1, 1);
    }
  }
  return c;
}

// small building bits
const leafPair = (g, x, y, len, pal, droop = 0) => { // opposite leaves on a stem at (x, y)
  for (let i = 1; i <= len; i++) { const yy = y + (i > len / 2 ? droop : 0); g.set(x - i, yy, i === len ? pal[0] : pal[1]); g.set(x + i, yy, i === len ? pal[0] : pal[1]); }
  g.set(x - 1, y - 1, pal[2]); g.set(x + 1, y - 1, pal[2]);
};
const daisy = (g, x, y, big = false) => {
  const P = '#f4f2ea', S = '#cfccc2', Y = '#f2c43a';
  g.set(x - 1, y, P); g.set(x + 1, y, P); g.set(x, y - 1, P); g.set(x, y + 1, S);
  if (big) { g.set(x - 2, y, S); g.set(x + 2, y, P); g.set(x - 1, y + 1, S); g.set(x + 1, y + 1, S); g.set(x - 1, y - 1, P); g.set(x + 1, y - 1, P); }
  g.set(x, y, Y);
};

const PAINT = {
  lavanda() { // grey-green tuft of narrow leaves, long slender stems, purple spikes
    const g = new Grid(22), L = ['#5f7660', '#7f9a7c', '#a2b69c'];
    const tops = [[2, 6], [4, 3], [6, 1], [9, 0], [11, 2], [13, 4], [14, 8]];
    for (const [x, y] of tops) g.line(8, 20, x, y + 5, '#86a07e');
    for (let i = -4; i <= 4; i++) g.line(8, 21, 8 + i * 1.2, 21 - 5 + Math.abs(i) * 0.7, (k) => L[(k + i + 9) % 3]);
    for (const [x, y] of tops) for (let k = 0; k < 5; k++) g.set(x, y + k, ['#c4aef0', '#9a7cd6', '#b49ae6', '#7a5cb8', '#8a6cc4'][k]);
    return render(g);
  },

  rosmarino() { // woody upright stems, needle leaves, small pale blue flowers
    const g = new Grid(22), N = ['#2c4632', '#44664a', '#62845c'];
    const stems = [[7, 1], [4, 4], [10, 2], [13, 5], [2, 8]];
    for (const [tx, ty] of stems) {
      g.line(8, 21, tx, ty, '#6a4c36');
      const n = 21 - ty;
      for (let i = 2; i < n; i++) {
        const x = 8 + ((tx - 8) * i) / n, y = 21 - i;
        if (i % 2 === 0) g.set(x - 1, y, N[(i + tx) % 3]); else g.set(x + 1, y, N[(i + tx + 1) % 3]);
      }
      g.set(tx, ty - 1, N[2]);
    }
    for (const [x, y] of [[7, 4], [10, 6], [4, 8], [12, 9], [6, 12], [3, 11]]) g.set(x, y, hash(x, y, 4) > 0.5 ? '#b4caf6' : '#88a0e0');
    return render(g, 0.5);
  },

  salvia() { // broad, soft grey-green leaves in a low clump; two violet-pink flower stalks
    const g = new Grid(18), L = ['#56664f', '#7c8e76', '#a8b8a2'];
    g.line(6, 13, 5, 2, '#6c7a62'); g.line(10, 13, 11, 3, '#6c7a62');
    for (const [x, y] of [[5, 3], [5, 6], [11, 4], [11, 7]]) { g.set(x - 1, y, '#b07ab0'); g.set(x + 1, y, '#8a5296'); g.set(x, y - 1, '#c898c8'); g.set(x - 1, y + 1, '#8a5296'); }
    for (const [x, y, a, len] of [[8, 17, -150, 6], [8, 17, -30, 6], [8, 17, -120, 6], [8, 17, -60, 6], [8, 17, -95, 5], [6, 12, -160, 3], [10, 12, -20, 3]]) leaf(g, x, y, a, len, 1.6, L);
    return render(g, 0);
  },

  alloro() { // a small dark tree: a short trunk and a dense crown of glossy leaves, a few cream flowers
    const g = new Grid(28), C = ['#1d3424', '#2b4e33', '#3f6e44'];
    g.line(8, 27, 8, 17, '#4a3628'); g.line(7, 27, 7, 19, '#34261e'); g.set(9, 26, '#5e4632'); g.line(8, 20, 11, 17, '#4a3628');
    for (const [x, y, rx, ry] of [[8, 11, 5, 7], [4, 13, 3, 4], [12, 12, 3, 5], [8, 5, 3, 3], [6, 16, 3, 2], [11, 16, 3, 2]]) g.blob(x, y, rx, ry, C, 11);
    for (let i = 0; i < 26; i++) { const x = 2 + Math.floor(hash(i, 1, 21) * 12), y = 3 + Math.floor(hash(i, 2, 21) * 15); if (g.has(x, y) && g.has(x + 1, y)) { g.set(x, y, '#5a8a52'); g.set(x + 1, y, C[2]); } }
    for (const [x, y] of [[6, 7], [10, 9], [5, 12], [11, 14], [9, 5]]) g.set(x, y, '#e6dca6');
    return render(g, 0.6);
  },
  menta() { // upright stems with paired bright leaves, lilac flower spikes on top
    const g = new Grid(18), L = ['#2f7034', '#4f9e44', '#7cc862'];
    for (const [x0, x1, top] of [[8, 8, 3], [6, 4, 6], [10, 12, 5]]) {
      g.line(x0, 17, x1, top, '#3e6a32');
      for (let y = 15; y > top + 3; y -= 3) { const x = Math.round(x0 + ((x1 - x0) * (17 - y)) / (17 - top)); leafPair(g, x, y, 2, L); }
      for (let k = 0; k < 4; k++) { g.set(x1, top - k + 2, k % 2 ? '#d2b0dc' : '#b08cc4'); g.set(x1 + (k % 2 ? -1 : 1), top - k + 2, '#c4a0d2'); }
    }
    return render(g);
  },
  timo() { // a low woody mat of tiny leaves with tiny pink flowers
    const g = new Grid(12), L = ['#4e5c40', '#6c7c56', '#8c9a70'];
    for (let y = 4; y < 12; y++) for (let x = 0; x < W; x++) {
      const d = ((x - 7.5) / 7.5) ** 2 + ((y - 10) / 5.5) ** 2;
      if (d > 1 || hash(x, y, 31) > 0.86 - (1 - d) * 0.5) continue;
      g.set(x, y, L[Math.floor(hash(x, y, 32) * 3)]);
    }
    for (const [x, y] of [[4, 11], [11, 11], [7, 10]]) g.line(x, y, x + (x < 8 ? -2 : 2), y - 2, '#5a4636');
    for (const [x, y] of [[3, 6], [6, 5], [9, 5], [12, 6], [5, 7], [10, 7], [8, 4], [2, 8], [13, 8], [7, 7]]) g.set(x, y, hash(x, y, 33) > 0.5 ? '#e8b4d0' : '#c88ab4');
    return render(g, 0);
  },
  camomilla() { // thin feathery stems, white daisies with yellow centres
    const g = new Grid(18), S = '#7ea062', F = '#9cbe78';
    const heads = [[4, 6, 0], [8, 3, 1], [12, 7, 0], [6, 10, 0], [11, 12, 0]];
    for (const [x, y] of heads) g.line(8, 17, x, y + 1, S);
    for (let y = 9; y < 17; y += 2) { g.set(7 - (y % 4 ? 1 : 2), y, F); g.set(9 + (y % 4 ? 1 : 2), y - 1, F); g.set(6, y + 1, S); g.set(10, y, S); }
    for (const [x, y, big] of heads) daisy(g, x, y, big);
    return render(g);
  },
  melissa() { // a bushy clump of bright, rounded, crinkled leaves; tiny white flowers
    const g = new Grid(16), L = ['#3a6e30', '#5a9a46', '#82c264'];
    g.line(8, 15, 8, 3, '#4a7a3a'); g.line(8, 13, 4, 6, '#4a7a3a'); g.line(8, 13, 12, 5, '#4a7a3a');
    for (const [x, y] of [[8, 3], [4, 6], [12, 5], [6, 9], [10, 8], [3, 11], [13, 10], [8, 12], [5, 14], [11, 14]]) { g.blob(x, y, 2, 1, L, x * 3 + y); g.set(x, y, L[0]); }
    for (const [x, y] of [[7, 6], [9, 10], [5, 11], [11, 7]]) g.set(x, y, '#eef2e2');
    return render(g, 0.55);
  },
  calendula() { // lance leaves and round orange flowers
    const g = new Grid(16), L = ['#3c6e30', '#5a8e44', '#78ac58'];
    g.line(8, 15, 4, 5, '#4e7a3a'); g.line(8, 15, 11, 3, '#4e7a3a'); g.line(8, 15, 8, 9, '#4e7a3a');
    for (const [x0, y0, x1, y1] of [[7, 14, 2, 12], [9, 14, 14, 12], [7, 12, 3, 9], [9, 11, 13, 8], [8, 15, 4, 15], [8, 15, 12, 15]]) { g.line(x0, y0, x1, y1, L[1]); g.line(x0, y0 - 1, x1, y1 - 1, L[2]); }
    for (const [x, y, r] of [[4, 4, 2], [11, 3, 2], [8, 8, 1]]) {
      g.blob(x, y, r, r === 2 ? 1 : 1, ['#c8601a', '#ee8a26', '#f8b244'], x);
      if (r === 2) { g.set(x - 2, y + 1, '#d87020'); g.set(x + 2, y - 1, '#f8a238'); g.set(x, y - 2, '#f8a238'); }
      g.set(x, y, '#8a4214');
    }
    return render(g);
  },
  achillea() { // ferny leaves low down, stiff stems, flat white umbels
    const g = new Grid(22), F = ['#3a5a34', '#507a44', '#6a9456'];
    g.line(8, 21, 5, 6, '#6a8a58'); g.line(8, 21, 11, 9, '#6a8a58');
    for (let y = 13; y < 21; y++) for (const side of [-1, 1]) { const len = 2 + ((y * 7) % 3); for (let i = 1; i <= len; i++) if ((i + y) % 2 || i === 1) g.set(8 + side * (i + (y % 2)), y - (i > 2 ? 1 : 0), F[(i + y) % 3]); }
    for (const [x, y, w] of [[5, 4, 3], [11, 7, 2]]) {
      for (let dx = -w; dx <= w; dx++) { g.set(x + dx, y, (dx + y) % 3 ? '#efece2' : '#d2cdbf'); if (Math.abs(dx) < w) g.set(x + dx, y + 1, '#c2bdae'); }
      for (let dx = 1 - w; dx < w; dx += 2) g.set(x + dx, y - 1, '#f8f6ee');
      g.line(x, y + 2, x, y + 3, '#6a8a58');
    }
    return render(g);
  },
  valeriana() { // tall: pinnate leaves at the foot, a tall stem, rounded pale pink heads
    const g = new Grid(28), L = ['#3c6038', '#55804a', '#74a060'];
    g.line(8, 27, 8, 6, '#6a8a56'); g.line(8, 16, 12, 9, '#6a8a56'); g.line(8, 18, 4, 11, '#6a8a56');
    for (const [dir, top] of [[-1, 19], [1, 20], [-1, 23], [1, 23]]) {
      const ex = 8 + dir * 6;
      g.line(8, 27, ex, top, L[0]);
      for (let i = 1; i < 6; i += 2) { const x = 8 + dir * i, y = Math.round(27 - ((27 - top) * i) / 6); g.set(x, y - 1, L[2]); g.set(x, y + 1, L[1]); }
    }
    leafPair(g, 8, 13, 2, L, 1);
    for (const [x, y, rx] of [[8, 4, 2], [12, 7, 2], [4, 9, 1]]) { g.blob(x, y, rx, 1, ['#c88ca8', '#e8b2c8', '#f8d8e6'], x); g.set(x, y - 2, '#f8d8e6'); }
    return render(g, 0.4);
  },
  verbena() { // thin wiry stems like a candelabra, few leaves, tiny lilac spikes
    const g = new Grid(22), S = '#5a7a48';
    g.line(8, 21, 8, 3, S); g.line(8, 14, 4, 9, S); g.line(4, 9, 3, 4, S); g.line(8, 12, 12, 8, S); g.line(12, 8, 13, 2, S);
    for (const [x, y, d] of [[7, 19, -1], [9, 19, 1], [7, 17, -1], [9, 16, 1]]) { g.set(x + d, y, '#4a7040'); g.set(x + 2 * d, y - 1, '#4a7040'); g.set(x + 2 * d, y + 1, '#3a5a34'); g.set(x + 3 * d, y, '#62904e'); }
    for (const [x, y] of [[8, 3], [3, 4], [13, 2]]) for (let k = 0; k < 5; k += 2) { g.set(x + (k % 4 ? 1 : -1), y + k, k ? '#a88ccc' : '#c8b0e8'); g.set(x, y - 1, '#c8b0e8'); }
    return render(g, 0.4);
  },
  ortica() { // tall and dark: pairs of pointed, toothed leaves down the stem, drooping green catkins
    const g = new Grid(26), L = ['#1a3020', '#2a4a2c', '#3e6a3c'];
    g.line(8, 25, 8, 1, '#2a4628');
    for (const [y, len] of [[21, 6], [15, 5], [9, 4], [4, 3]]) { leaf(g, 8, y, 200, len, 1.8, L, true); leaf(g, 8, y, -20, len, 1.8, L, true); }
    g.set(8, 0, L[2]);
    for (const [x, y] of [[7, 16], [9, 16], [7, 10], [9, 10]]) g.line(x, y, x + (x < 8 ? -1 : 1), y + 4, '#8aa862');
    return render(g, 0.5);
  },

  artemisia() { // tall grey-green stems, cut leaves silver beneath, mauve flower spikes
    const g = new Grid(28), L = ['#3e5440', '#5e745a', '#a4b2a0'];
    for (const [x1, y1] of [[7, 1], [3, 6], [13, 4]]) g.line(8, 27, x1, y1, '#6a4a4e');
    for (let y = 26; y > 8; y -= 2) for (const d of [-1, 1]) {
      const x = 8 + d * Math.round((27 - y) * 0.15);
      g.set(x + d, y, L[1]); g.set(x + 2 * d, y - 1, L[0]); g.set(x + 2 * d, y, L[2]); g.set(x + 3 * d, y - 1 + (y % 4 ? 1 : 0), L[1]);
    }
    for (const [x1, y1] of [[7, 1], [3, 6], [13, 4]]) {
      const n = 9;
      for (let i = 0; i < n; i++) { const x = Math.round(8 + ((x1 - 8) * (n + 10 - i)) / (n + 10) ), y = y1 + i; if (i % 2 === 0) { g.set(x - 1, y, '#a46478'); g.set(x + 1, y, '#7a4658'); } g.set(x, y, i % 3 ? '#8a5466' : L[2]); }
    }
    return render(g, 0.45);
  },
  assenzio() { // silver and feathery; arching panicles of tiny yellow heads
    const g = new Grid(20), L = ['#7a877c', '#a4aea2', '#d0d8cc'];
    for (const [a, len] of [[-170, 7], [-10, 7], [-145, 7], [-35, 7], [-120, 7], [-60, 7], [-90, 6]]) {
      const r = (a * Math.PI) / 180;
      g.line(8, 19, 8 + Math.cos(r) * len, 19 + Math.sin(r) * len, L[1]);
      for (let t = 2; t <= len; t += 2) { const x = 8 + Math.cos(r) * t, y = 19 + Math.sin(r) * t; g.set(x - Math.sin(r) * 1.2, y + Math.cos(r) * 1.2, L[2]); g.set(x + Math.sin(r) * 1.2, y - Math.cos(r) * 1.2, L[0]); }
    }
    for (const [x0, x1, y1] of [[8, 7, 2], [7, 3, 5], [9, 13, 4]]) {
      g.line(x0, 12, x1, y1, '#9aa694');
      for (let k = 0; k < 6; k += 2) { const x = Math.round(x1 + ((x0 - x1) * k) / 10), y = y1 + k; g.set(x - 1, y, '#dccb5c'); g.set(x + 1, y + 1, '#b8a640'); g.set(x, y - 1, '#e8d870'); }
    }
    return render(g, 0.5);
  },

  ruta() { // blue-green rounded lobed leaves, a flat top of small yellow flowers
    const g = new Grid(18), L = ['#44706a', '#5e8e86', '#82b0a6'];
    g.line(8, 17, 8, 4, '#6a8a70'); g.line(8, 9, 4, 4, '#6a8a70'); g.line(8, 9, 12, 3, '#6a8a70');
    for (const [x, y] of [[5, 16], [11, 16], [3, 14], [13, 13], [6, 13], [10, 12], [4, 11], [12, 10], [7, 10], [9, 15]]) { g.set(x, y, L[1]); g.set(x + 1, y, L[2]); g.set(x, y + 1, L[0]); g.set(x - 1, y, L[1]); g.set(x, y - 1, L[2]); }
    for (const [x, y] of [[4, 3], [6, 4], [8, 3], [10, 4], [12, 2], [3, 5], [13, 4], [7, 2]]) { g.set(x, y, '#ecd040'); if (hash(x, y, 51) > 0.5) g.set(x, y - 1, '#c8a826'); }
    return render(g, 0.5);
  },
  belladonna() { // broad dark oval leaves, dull purple bells hanging below them, shiny black berries
    const g = new Grid(24), L = ['#1a2c18', '#2a4426', '#3e5e36'];
    g.line(8, 23, 8, 4, '#3a4c2a'); g.line(8, 15, 3, 8, '#3a4c2a'); g.line(8, 12, 13, 6, '#3a4c2a');
    for (const [x, y, a, len] of [[8, 21, 200, 6], [8, 20, -20, 6], [5, 12, 210, 4], [11, 10, -30, 4], [8, 5, -100, 4], [8, 15, -10, 4]]) leaf(g, x, y, a, len, 2, L);
    const bell = (x, y) => { g.set(x, y, '#4a6a3a'); g.set(x, y + 1, '#8a4c70'); g.set(x + 1, y + 1, '#6a3656'); g.set(x - 1, y + 2, '#6a3656'); g.set(x, y + 2, '#a0628a'); g.set(x + 1, y + 2, '#5a2a48'); g.set(x - 1, y + 3, '#4a2238'); g.set(x + 1, y + 3, '#4a2238'); };
    bell(3, 9); bell(13, 7); bell(5, 16);
    const berry = (x, y) => { g.set(x - 1, y - 1, '#5a7a44'); g.set(x + 2, y - 1, '#5a7a44'); g.set(x, y, '#9a9ab4'); g.set(x + 1, y, '#141018'); g.set(x, y + 1, '#141018'); g.set(x + 1, y + 1, '#0a0810'); };
    berry(11, 15); berry(2, 13); berry(9, 1);
    return render(g, 0.5);
  },

  aconito() { // dark, deeply cut palmate leaves; a tall spike of deep-blue hooded flowers
    const g = new Grid(28), L = ['#1e3a26', '#2e5434', '#44703e'];
    g.line(8, 27, 8, 1, '#2e4a2e');
    for (let a = -3; a <= 3; a++) for (const [y0, len] of [[25, 6], [20, 5]]) {
      g.line(8, y0, 8 + a * 2 * (len / 6), y0 - len + Math.abs(a) * 1.4, (k, n) => (k === n ? L[2] : L[(k + a + 3) % 2]));
    }
    const hood = (x, y, d) => {
      g.set(x, y, '#2a3270'); g.set(x + d, y, '#3c4aa8');
      g.set(x - d, y + 1, '#3c4aa8'); g.set(x, y + 1, '#6878d8'); g.set(x + d, y + 1, '#2a3270');
      g.set(x, y + 2, '#3c4aa8'); g.set(x + d, y + 2, '#5060c0');
    };
    for (const [y, d] of [[13, -1], [11, 1], [9, -1], [7, 1], [5, -1]]) hood(8 + d * 2, y, d);
    g.set(8, 1, '#5060c0'); g.set(8, 2, '#3c4aa8'); g.set(9, 3, '#2a3270'); g.set(7, 4, '#5060c0');
    return render(g, 0.45);
  },
  giusquiamo() { // grey-green, toothed, hairy leaves; pale yellow cups veined and centred in purple
    const g = new Grid(20), L = ['#4a5a3e', '#6a7a54', '#949f78'];
    g.line(8, 19, 8, 4, '#5a6a46');
    for (const [x, y, a, len] of [[8, 18, 195, 7], [8, 18, -15, 7], [8, 13, 210, 5], [8, 12, -30, 5], [8, 16, -90, 3]]) leaf(g, x, y, a, len, 2, L, true);
    const cup = (x, y) => {
      g.set(x - 1, y, '#e8d890'); g.set(x, y, '#5a1e4a'); g.set(x + 1, y, '#e0cc80');
      g.set(x - 1, y - 1, '#f4eab0'); g.set(x, y - 1, '#8a4a6a'); g.set(x + 1, y - 1, '#f4eab0');
      g.set(x - 2, y - 1, '#d8c47a'); g.set(x + 2, y - 1, '#d8c47a'); g.set(x, y + 1, '#6c7c56');
    };
    cup(8, 3); cup(4, 7); cup(12, 7);
    return render(g, 0.5);
  },

  cicuta() { // tall, a pale stem with purple spots, lacy leaves, domes of white umbels
    const g = new Grid(28), L = ['#3c6a32', '#55843f', '#72a052'];
    g.line(8, 27, 8, 4, (k) => (k % 3 === 1 ? '#7a2c52' : '#86a86a'));
    g.line(8, 14, 3, 8, '#86a86a'); g.line(8, 12, 13, 7, '#86a86a');
    for (let y = 25; y > 15; y -= 2) for (const d of [-1, 1]) for (let i = 1; i <= 5 - (25 - y) / 4; i++) if ((i + y) % 2 || i === 1) g.set(8 + d * i, y - (i % 2), L[(i + y) % 3]);
    for (const [x, y, w] of [[8, 2, 3], [3, 6, 2], [13, 5, 2]]) {
      for (let dx = -w; dx <= w; dx++) g.set(x + dx, y, (dx + 9) % 2 ? '#efece2' : '#d8d4c6');
      for (let dx = 1 - w; dx < w; dx++) g.set(x + dx, y - 1, '#f8f6ee');
      g.set(x - 1, y + 1, '#86a86a'); g.set(x + 1, y + 1, '#86a86a'); g.set(x, y + 1, '#86a86a');
    }
    return render(g, 0.4);
  },
  stramonio() { // big dark jagged leaves, long white trumpets, a spiky green fruit
    const g = new Grid(24), L = ['#1e3a1c', '#30562c', '#4a783e'];
    g.line(8, 23, 8, 10, '#4a6a3a'); g.line(8, 13, 4, 8, '#4a6a3a'); g.line(8, 12, 12, 8, '#4a6a3a');
    for (const [x, y, a, len] of [[8, 22, 195, 7], [8, 22, -15, 7], [8, 17, 215, 6], [8, 16, -35, 6]]) leaf(g, x, y, a, len, 2.5, L, true);
    const trumpet = (x, y, d) => {
      g.set(x - 1, y, '#f6f4ec'); g.set(x, y, '#ffffff'); g.set(x + 1, y, '#f6f4ec'); g.set(x + 2 * d, y - 1, '#e6e4da'); g.set(x - 2 * d, y, '#d6d4ca');
      for (let k = 1; k < 6; k++) { g.set(x + Math.round((k * -d) / 3), y + k, k < 3 ? '#e8e8de' : '#c8ccb8'); if (k < 4) g.set(x + Math.round((k * -d) / 3) + d, y + k, '#b8bca8'); }
    };
    trumpet(4, 2, -1); trumpet(12, 3, 1);
    g.blob(8, 8, 1, 1, ['#3e5a2c', '#5a7a3a', '#7a9a50'], 3);
    for (const [x, y] of [[6, 7], [10, 8], [8, 6], [7, 10], [9, 10], [6, 9], [10, 6]]) g.set(x, y, '#a4c070');
    return render(g, 0.45);
  },

};

export const HERB_ART_IDS = Object.keys(PAINT);
export const herbArt = (id) => PAINT[id]?.() || null;
export const herbSize = (id) => { const c = herbArt(id); return c ? [c.width / 2, c.height] : null; };

export function makeHerbs(scene) {
  if (scene.textures.exists('herb-lavanda')) return;
  for (const id of HERB_ART_IDS) { const c = PAINT[id](); addSheet(scene, `herb-${id}`, c, W, c.height); }
  void INK;
}
