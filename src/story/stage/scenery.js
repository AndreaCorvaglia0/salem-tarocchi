// Procedural scenery cut in paper: trees with curling twigs, a skyline with a meetinghouse, the ground and
// a road, a crowd, graves, cellar arches and stairs, a mill wheel, a prison tower, a table with a book,
// a house front with a lit doorway, a high bench, filigree vines for the corners.
// Pure (no DOM). Every generator returns placements: [{ parts: [d | {d, eo, a}], x, y, s?, flip?, tone? }]
// in its own units (origin at the base, y up negative); tone: undefined (shadow), 'snow', 'lit', 'mist'.
import { rnd, toPath, taper, tendril, ellipse, rect, poly } from './kit.js';
import { crowdBust, SIL } from './silhouettes.js';

// ---- trees: a trunk splitting into tapered branches; bare ones end in curls, leafy ones in leaves
export function tree(seed = 1, { h = 600, leafy = false, lean = 0, spread = 1 } = {}) {
  const r = rnd(seed), parts = [], leaves = [];
  const branch = (x, y, a, len, w, depth) => {
    const bend = (r() - 0.5) * 0.5, mx = x + Math.cos(a + bend * 0.5) * len * 0.5, my = y + Math.sin(a + bend * 0.5) * len * 0.5;
    const ex = x + Math.cos(a + bend) * len, ey = y + Math.sin(a + bend) * len;
    parts.push(taper([[x, y], [mx, my], [ex, ey]], w, w * 0.62));
    if (depth <= 0) {
      if (leafy) for (let i = 0; i < 9; i++) { const lx = ex + (r() - 0.5) * len * 1.1, ly = ey + (r() - 0.6) * len * 0.8, L = len * (0.22 + r() * 0.14), b = r() * 6.28; leaves.push(toPath([[lx, ly, 1], [lx + Math.cos(b - 0.45) * L * 0.55, ly + Math.sin(b - 0.45) * L * 0.55], [lx + Math.cos(b) * L, ly + Math.sin(b) * L, 1], [lx + Math.cos(b + 0.45) * L * 0.55, ly + Math.sin(b + 0.45) * L * 0.55]], true, 1)); }
      else parts.push(taper(tendril(ex, ey, a + bend, len * 0.7, (r() < 0.5 ? -1 : 1) * 0.22, 12), w * 0.6, 0.5));
      return;
    }
    const n = depth > 3 && r() < 0.3 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const da = ((i / (n - 1)) - 0.5) * (0.9 + r() * 0.5) * spread;
      branch(ex, ey, a + bend + da, len * (0.66 + r() * 0.14), w * 0.64, depth - 1);
    }
  };
  const base = h * 0.06;
  parts.push(toPath([[-base * 1.6, 0, 1], [-base * 0.7, -h * 0.05], [-base * 0.5, -h * 0.2], [base * 0.5, -h * 0.2], [base * 0.7, -h * 0.05], [base * 1.6, 0, 1]]));
  branch(0, -h * 0.18, -Math.PI / 2 + lean, h * 0.3, base * 1.05, leafy ? 5 : 6);
  return [{ parts: [...parts, ...leaves], x: 0, y: 0 }];
}

// ---- a village skyline: gabled houses with chimneys, a meetinghouse with a steeple, snow on the roofs
export function skyline(seed = 2, span = 2000, { steeple = true, snow = true, h = 220 } = {}) {
  const r = rnd(seed), out = [], lights = [];
  let x = -span / 2 - 40;
  const mid = steeple ? (r() - 0.5) * span * 0.2 : 1e9;
  while (x < span / 2 + 40) {
    if (Math.abs(x - mid) < 120 && steeple) {
      const w = 190, bh = h * 1.1;
      const body = poly([[x, 0], [x, -bh], [x + w / 2, -bh - 90], [x + w, -bh], [x + w, 0]]);
      const tw = 56, tx = x + w / 2 - tw / 2;
      const tower = toPath([[tx, -bh - 40, 1], [tx, -bh - 170, 1], [tx - 8, -bh - 176, 1], [tx + tw / 2, -bh - 214, 1], [tx + tw + 8, -bh - 176, 1], [tx + tw, -bh - 170, 1], [tx + tw, -bh - 40, 1]], true, 0);
      const spire = poly([[tx + 4, -bh - 214], [tx + tw / 2, -bh - 400], [tx + tw - 4, -bh - 214]]);
      out.push({ parts: [body, tower, spire, rect(tx + tw / 2 - 1.5, -bh - 440, 3, 44), rect(tx + tw / 2 - 12, -bh - 428, 24, 3)], x: 0, y: 0 });
      if (snow) out.push({ parts: [poly([[x - 4, -bh + 2], [x + w / 2, -bh - 92], [x + w + 4, -bh + 2], [x + w - 10, -bh + 2], [x + w / 2, -bh - 78], [x + 10, -bh + 2]])], x: 0, y: 0, tone: 'snow' });
      lights.push([x + w / 2, -bh * 0.5, 16], [tx + tw / 2, -bh - 110, 10]);
      x += w + 10 + r() * 30;
      continue;
    }
    const w = 110 + r() * 110, bh = h * (0.45 + r() * 0.45), rh = w * (0.32 + r() * 0.22);
    const pts = [[x, 0], [x, -bh], [x + w / 2, -bh - rh], [x + w, -bh], [x + w, 0]];
    const parts = [poly(pts)];
    if (r() < 0.75) { const cx = x + w * (0.2 + r() * 0.55); parts.push(rect(cx, -bh - rh * 0.9, 16, rh * 0.7)); }
    out.push({ parts, x: 0, y: 0 });
    if (snow) out.push({ parts: [poly([[x - 6, -bh + 4], [x + w / 2, -bh - rh - 3], [x + w + 6, -bh + 4], [x + w - 8, -bh + 4], [x + w / 2, -bh - rh + 8], [x + 8, -bh + 4]])], x: 0, y: 0, tone: 'snow' });
    if (r() < 0.6) lights.push([x + w * (0.25 + r() * 0.5), -bh * (0.3 + r() * 0.4), 9 + r() * 5]);
    x += w + 6 + r() * 60;
  }
  return Object.assign(out, { lights });
}

// ---- the ground: a gentle line across the span, a road that narrows into the distance (cut out light)
export function ground(seed = 3, span = 2000, { amp = 30, depth = 4000, road = false, snow = false, tufts = true } = {}) {
  const r = rnd(seed), pts = [], n = 14;
  for (let i = 0; i <= n; i++) { const x = -span / 2 - 60 + (span + 120) * (i / n); pts.push([x, -amp * Math.sin(i * 0.9 + r() * 2) * (0.5 + r() * 0.5)]); }
  const field = { d: toPath([[-span / 2 - 60, depth, 1], ...pts, [span / 2 + 60, depth, 1]], true, 0.8) }, parts = snow ? [] : [field];
  if (tufts) for (let i = 0; i < span / 40; i++) {
    const x = -span / 2 + r() * span, y = -amp * 0.2 + r() * 8, hh = 14 + r() * 26;
    parts.push(taper([[x, y + 6], [x + (r() - 0.5) * 10, y - hh * 0.6], [x + (r() - 0.5) * 22, y - hh]], 4, 0.5));
  }
  const out = snow ? [{ parts: [field], x: 0, y: 0, tone: 'field' }, { parts, x: 0, y: 0 }] : [{ parts, x: 0, y: 0 }];
  if (road) { // footprints in the snow, from her feet back to the edge of the picture
    const steps = [];
    for (let i = 1; i < 16; i++) { const t = i / 15, x = Math.sin(t * 2.6) * 60 * t + (i % 2 ? -14 : 14) * (1 + t), y = 170 + t * t * 900; steps.push(ellipse(x, y, 7 + t * 12, 3 + t * 6)); }
    out.push({ parts: steps, x: 0, y: 0, tone: 'trodden' });
  }
  return out;
}

// ---- a crowd: rows of little busts with hats and bonnets, facing every way
export function crowd(seed = 4, span = 2000, { rows = 2, size = 1 } = {}) {
  const r = rnd(seed), out = [];
  for (let row = 0; row < rows; row++) {
    const s = size * (0.8 + row * 0.25), step = 120 * s;
    for (let x = -span / 2 - 60 + r() * step; x < span / 2 + 60; x += step * (0.65 + r() * 0.5)) {
      out.push({ parts: crowdBust(Math.floor(r() * 12), r() < 0.5), x, y: row * 90 * size + r() * 20, s: s * (0.9 + r() * 0.2) });
    }
  }
  return out;
}

// ---- graves: rounded stones and crosses, a little tilted
export function graves(seed = 5, span = 900) {
  const r = rnd(seed), parts = [];
  for (let x = -span / 2; x < span / 2; x += 90 + r() * 90) {
    const hh = 70 + r() * 70, w = 40 + r() * 30, t = (r() - 0.5) * 0.16;
    const sk = (px, py) => [x + px + py * t, py];
    if (r() < 0.35) parts.push(poly([sk(-5, 0), sk(-5, -hh), sk(-w * 0.6, -hh), sk(-w * 0.6, -hh - 12), sk(-5, -hh - 12), sk(-5, -hh - 40), sk(5, -hh - 40), sk(5, -hh - 12), sk(w * 0.6, -hh - 12), sk(w * 0.6, -hh), sk(5, -hh), sk(5, 0)]));
    else parts.push(toPath([[...sk(-w / 2, 0), 1], sk(-w / 2, -hh + w / 2), sk(0, -hh), sk(w / 2, -hh + w / 2), [...sk(w / 2, 0), 1]], true, 0.9));
  }
  return [{ parts, x: 0, y: 0 }];
}

// ---- cellar arches: a wall with an arched opening (cut out), receding copies make the depth
export function arch(w = 600, h = 900, { span = 3000, top = 1800 } = {}) {
  const wall = `${rect(-span / 2, -top, span, top + 200)}${toPath([[-w / 2, 0, 1], [-w / 2, -h + w / 2], [-w * 0.35, -h + w * 0.14], [0, -h], [w * 0.35, -h + w * 0.14], [w / 2, -h + w / 2], [w / 2, 0, 1]], true, 1)}`;
  const stones = [];
  for (let i = 0; i <= 8; i++) { const a = Math.PI + (i / 8) * Math.PI, rx = w / 2 + 22, ry = w / 2 + 22, cy = -h + w / 2; stones.push(taper([[Math.cos(a) * (w / 2), cy + Math.sin(a) * (w / 2)], [Math.cos(a) * rx * 1.12, cy + Math.sin(a) * ry * 1.12]], 6, 6)); }
  void stones;
  return [{ parts: [{ d: wall, eo: true }], x: 0, y: 0 }];
}
export function stairs(n = 7, w = 340, rise = 46, run = 70) {
  const pts = [[-w / 2, 0, 1]];
  for (let i = 0; i < n; i++) { pts.push([-w / 2 + i * run, -i * rise, 1], [-w / 2 + i * run, -(i + 1) * rise, 1]); }
  pts.push([-w / 2 + n * run + 400, -n * rise, 1], [-w / 2 + n * run + 400, 0, 1]);
  return [{ parts: [poly(pts)], x: 0, y: 0 }];
}
export function chain(len = 500, link = 34) {
  const parts = [];
  for (let y = 0, i = 0; y < len; y += link * 0.8, i++) parts.push({ d: i % 2 ? rect(-3, y, 6, link) : `${ellipse(0, y + link / 2, link * 0.32, link * 0.55)}${ellipse(0, y + link / 2, link * 0.16, link * 0.38)}`, eo: true });
  return [{ parts, x: 0, y: -len }];
}

// ---- the mill: a house and a big wheel with paddles
export function mill(seed = 6) {
  const parts = [poly([[-260, 0], [-260, -300], [-130, -420], [0, -300], [0, 0]]), rect(-200, -380, 26, 70)];
  const R = 230, cx = 120, cy = -200, wheel = [];
  wheel.push({ d: `${ellipse(cx, cy, R, R)}${ellipse(cx, cy, R - 24, R - 24)}`, eo: true }, ellipse(cx, cy, 30, 30));
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    if (i % 2 === 0) wheel.push(taper([[cx, cy], [cx + c * (R - 12), cy + s * (R - 12)]], 10, 8));
    wheel.push(poly([[cx + c * (R - 6) - s * 16, cy + s * (R - 6) + c * 16], [cx + c * (R + 36) - s * 16, cy + s * (R + 36) + c * 16], [cx + c * (R + 36) + s * 16, cy + s * (R + 36) - c * 16], [cx + c * (R - 6) + s * 16, cy + s * (R - 6) - c * 16]]));
  }
  void seed;
  return [{ parts: [...parts, ...wheel], x: 0, y: 0 }];
}

// ---- the prison tower: crenellations, a narrow barred window (cut out)
export function tower(h = 1100, w = 300) {
  const pts = [[-w / 2, 0], [-w / 2 + 10, -h]];
  for (let i = 0; i < 5; i++) { const x0 = -w / 2 - 20 + i * ((w + 40) / 5); pts.push([x0, -h], [x0, -h - 60], [x0 + (w + 40) / 10, -h - 60], [x0 + (w + 40) / 10, -h]); }
  pts.push([w / 2 + 20, -h], [w / 2 - 10, -h + 0], [w / 2, 0]);
  const win = toPath([[-30, -h * 0.62, 1], [-30, -h * 0.75], [0, -h * 0.79], [30, -h * 0.75], [30, -h * 0.62, 1]], true, 1);
  const bars = [rect(-12, -h * 0.79, 6, h * 0.17), rect(8, -h * 0.79, 6, h * 0.17)];
  return Object.assign([{ parts: [{ d: `${poly(pts)}${win}`, eo: true }, ...bars], x: 0, y: 0 }], { lights: [[0, -h * 0.7, 40]] });
}

// ---- a table with an open book (and room for a candle)
export function tableBook({ w = 900, book = true } = {}) {
  const parts = [toPath([[-w / 2 - 30, -20, 1], [w / 2 + 30, -20, 1], [w / 2 + 20, 20, 1], [-w / 2 - 20, 20, 1]], true, 0),
    rect(-w / 2 + 30, 20, 40, 600), rect(w / 2 - 70, 20, 40, 600)];
  if (book) parts.push(toPath([[-260, -20, 1], [-250, -60], [-130, -86], [0, -60, 1], [130, -86], [250, -60], [260, -20, 1], [0, -28]], true, 0.9));
  const pages = book ? [toPath([[-236, -44], [-130, -70], [-6, -50, 1], [-6, -36, 1], [-120, -54], [-232, -32, 1]], true, 0.8), toPath([[236, -44], [130, -70], [6, -50, 1], [6, -36, 1], [120, -54], [232, -32, 1]], true, 0.8)] : [];
  return [{ parts, x: 0, y: 0 }, ...(book ? [{ parts: pages, x: 0, y: 0, tone: 'lit' }] : [])];
}

// ---- a house front with a doorway (cut out: the light comes through it), windows, two steps, snow
export function houseFront({ w = 1100, h = 900, door = [220, 470], snow = true } = {}) {
  const [dw, dh] = door;
  const wall = `${poly([[-w / 2, 120], [-w / 2, -h], [-w / 2 - 60, -h], [0, -h - 420], [w / 2 + 60, -h], [w / 2, -h], [w / 2, 120]])}`;
  const hole = toPath([[-dw / 2, 0, 1], [-dw / 2, -dh + dw / 2], [0, -dh], [dw / 2, -dh + dw / 2], [dw / 2, 0, 1]], true, 1);
  const win = (x, y) => `${rect(x - 70, y - 90, 140, 180)}`;
  const parts = [{ d: wall + hole + win(-330, -560) + win(330, -560), eo: true }, rect(-336, -650, 12, 180), rect(-400, -566, 140, 12), rect(324, -650, 12, 180), rect(260, -566, 140, 12),
    poly([[-dw / 2 - 40, 0], [dw / 2 + 40, 0], [dw / 2 + 60, 40], [-dw / 2 - 60, 40]]), poly([[-dw / 2 - 70, 40], [dw / 2 + 70, 40], [dw / 2 + 90, 90], [-dw / 2 - 90, 90]]),
    rect(w * 0.22, -h - 330, 60, 200)];
  const out = [{ parts, x: 0, y: 0 }];
  if (snow) out.push({ parts: [poly([[-w / 2 - 70, -h + 6], [0, -h - 432], [w / 2 + 70, -h + 6], [w / 2 + 40, -h + 6], [0, -h - 404], [-w / 2 - 40, -h + 6]]), poly([[-dw / 2 - 90, 92], [dw / 2 + 90, 92], [dw / 2 + 110, 120], [-dw / 2 - 110, 120]])], x: 0, y: 0, tone: 'snow' });
  return Object.assign(out, { lights: [[0, -dh * 0.45, dh * 0.75], [-330, -560, 120], [330, -560, 120]] });
}

// ---- the high bench of the court, with arched windows behind (light) and a rail below
export function bench({ w = 1400, h = 520 } = {}) {
  const panels = [];
  for (let i = 0; i < 5; i++) { const x = -w / 2 + 60 + i * ((w - 120) / 5); panels.push(rect(x + 18, -h + 70, (w - 120) / 5 - 36, h - 140)); }
  // the bench stands on three heavy pillars down to the floor: light passes between them
  const legs = [-w / 2 + 30, w / 2 - 110].map((x) => rect(x, 40, 80, 760));
  return [{ parts: [rect(-w / 2, -h, w, h + 40), rect(-w / 2 - 40, -h - 30, w + 80, 34), rect(-w / 2 - 20, 30, w + 40, 24), ...legs, rect(-w * 2, 800, w * 4, 3000)], x: 0, y: 0 },
    { parts: panels, x: 0, y: 0, tone: 'trodden', ghost: false }];
}
export function tallWindows({ n = 3, w = 220, h = 900, gap = 420 } = {}) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * gap;
    parts.push(toPath([[x - w / 2, 0, 1], [x - w / 2, -h + w / 2], [x, -h], [x + w / 2, -h + w / 2], [x + w / 2, 0, 1]], true, 1));
  }
  return [{ parts, x: 0, y: 0, tone: 'lit' }];
}

// ---- logs and stones of a campfire; a log to sit on
export function fireplace() {
  return [{ parts: [taper([[-120, 0], [0, -30], [120, -6]], 30, 24), taper([[110, 4], [0, -36], [-110, -2]], 28, 22),
    ...[-170, -110, 110, 170].map((x, i) => ellipse(x, 8 - (i % 2) * 6, 34, 24))], x: 0, y: 0 }];
}
export const log = (w = 520) => [{ parts: [toPath([[-w / 2, 0, 1], [-w / 2 - 6, -60], [-w / 2 + 20, -90], [w / 2 - 20, -96], [w / 2 + 8, -62], [w / 2, 0, 1]], true, 0.8)], x: 0, y: 0 }];

// ---- filigree vines from a corner (Reiniger's frames): curling tendrils with leaves; corner 'tl' 'tr' 'bl' 'br'
export function vines(seed = 7, corner = 'tl', size = 700) {
  const r = rnd(seed), parts = [], sx = corner.includes('r') ? -1 : 1, sy = corner.includes('b') ? -1 : 1;
  const grow = (x, y, a, len, w, depth) => {
    const line = tendril(x, y, a, len, (r() < 0.5 ? 1 : -1) * (0.08 + r() * 0.1), 16);
    parts.push(taper(line, w, 0.6));
    if (depth <= 0) return;
    for (let i = 4; i < line.length - 2; i += 3 + Math.floor(r() * 3)) {
      const [px, py] = line[i], b = a + (r() - 0.5) * 2.4;
      if (r() < 0.55) grow(px, py, b, len * (0.35 + r() * 0.25), w * 0.55, depth - 1);
      else { const L = 14 + r() * 26; parts.push(toPath([[px, py, 1], [px + Math.cos(b - 0.5) * L * 0.6, py + Math.sin(b - 0.5) * L * 0.6], [px + Math.cos(b) * L, py + Math.sin(b) * L, 1], [px + Math.cos(b + 0.5) * L * 0.6, py + Math.sin(b + 0.5) * L * 0.6]], true, 1)); }
    }
  };
  grow(0, 0, Math.atan2(0.35 * sy, sx), size, 18, 3);
  grow(0, 0, Math.atan2(sy, 0.35 * sx), size * 0.85, 16, 3);
  return [{ parts, x: 0, y: 0 }];
}

// ---- paper clouds for the dawn (drawn translucent, they drift on their own)
export function cloud(seed = 8, w = 600) {
  // a flat-bottomed paper cloud: a base and a few round heads, one shape (drawn whole, then faded)
  const r = rnd(seed), parts = [toPath([[-w / 2, 0, 1], [-w * 0.3, -18], [w * 0.3, -18], [w / 2, 0, 1]], true, 1)];
  for (let i = 0; i < 5; i++) { const x = -w * 0.32 + (w * 0.64 * i) / 4, rr = w * (0.09 + r() * 0.07) * (0.6 + 0.4 * Math.sin(Math.PI * (0.15 + 0.7 * i / 4))); parts.push(ellipse(x, -rr * 0.55, rr * 1.25, rr)); }
  return [{ parts, x: 0, y: 0 }];
}
export { SIL };

// ---- a plain band (a table seen edge-on, a floor): straight top with a fine moulding line
export const band = (span = 2000, depth = 1400, lip = 14) => [{ parts: [rect(-span / 2 - 60, 0, span + 120, depth), rect(-span / 2 - 60, -lip, span + 120, lip * 0.6)], x: 0, y: 0 }];

// ---- a table edge with a hanging cloth: a scalloped hem and little tassels (the Reader's table)
export function cloth(span = 2000, drop = 200) {
  const pts = [[-span / 2 - 60, -24, 1], [span / 2 + 60, -24, 1]], sc = 70;
  const n = Math.ceil((span + 120) / sc);
  for (let i = n; i >= 0; i--) { const x = -span / 2 - 60 + i * sc; pts.push([x, drop, 1], [x - sc / 2, drop + 26]); }
  const tassels = [];
  for (let i = 0; i <= n; i++) { const x = -span / 2 - 60 + i * sc; tassels.push(taper([[x, drop], [x, drop + 34]], 4, 3), ellipse(x, drop + 42, 7, 11)); }
  return [{ parts: [toPath(pts, true, 0.9), ...tassels, rect(-span / 2 - 60, -40, span + 120, 16)], x: 0, y: 0 }];
}
