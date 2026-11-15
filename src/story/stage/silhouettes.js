// Paper-cut figures for the shadow theatre, as path data. Pure data (no DOM): every figure is
//   SIL[name] = { h, parts: [{ d, a? }], anchors? }
// in units where a head is 100 tall; the origin is the middle of the base (feet, the table edge), y up
// is negative, and every figure faces right (the stage mirrors it). Figures are always still: the
// stage gives them life with light, parallax and slow drift. The witches are slender and graceful.
import { toPath, tf, taper, ellipse, rect, poly } from './kit.js';
import { head, lashes, shoulders, HAIR, HAT, hairExtra, braidLine } from './shapes.js';

const P = (pts, o) => toPath(tf(pts, o));
// a head (crown at y, neck centred on x) with its hair or hat; returns path data pieces
function headPieces({ x = 0, y = 0, s = 1, face = {}, hair = null, hat = null, neck = 44, flip = false, rot = 0 }) {
  const o = { x, y, s, flip, rot }, out = [];
  const shift = (pts) => pts.map(([px, py, c]) => (c ? [px - 40, py, 1] : [px - 40, py]));
  out.push(P(shift(head(face, neck)), o));
  for (const l of lashes(0.4)) out.push(taper(tf(shift(l), o), 1.2 * s, 0.2 * s));
  if (hair && HAIR[hair]) { out.push(P(shift(HAIR[hair]), o)); out.push(...hairExtra(hair, o, -40)); }
  if (hair === 'crown') for (const [bx, by] of braidLine().slice(1, -1)) out.push(P(ring(bx - 40, by, 9, 7), o));
  if (hat === 'witch') { out.push(P(shift(HAT.witch.cone), o), P(shift(HAT.witch.brim), o)); }
  else if (hat && HAT[hat]?.cone) out.push(P(shift(HAT[hat].cone), o), P(shift(HAT[hat].brim), o));
  else if (hat && HAT[hat]) out.push(P(shift(HAT[hat]), o));
  return out;
}
const ring = (cx, cy, rx, ry, n = 12) => Array.from({ length: n }, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry]);
const W = { nose: 0.9, up: 0.7, lips: 1.15, chin: 0.9 };
const MAN = { nose: 1.6, up: 0, lips: 0.5, chin: 1.5, brow: 1.4, jaw: 3, neckFront: 60, neckBack: 24 };

// ---- standing women in long cloaks (profile, facing right)
function cloaked({ hair, hat, face = W, crown = -700, hood = false, sweep = 1 }) {
  const parts = headPieces({ y: crown, face, hair, hat, neck: 46 });
  const n = crown + 146; // base of the neck
  const body = [[16, n - 4], [24, n + 14], [40, n + 50], [52, n + 92], [48, n + 122], [36, n + 152], [36, n + 200], [50, n + 300],
    [72, -140], [92, -50], [106, 0, 1], [40, 6], [-50, 6], [-164 * sweep, 0, 1], [-132 * sweep, -120], [-102, -280], [-78, n + 180],
    [-64, n + 100], [-54, n + 44], [-38, n + 12], [-14, n]];
  parts.unshift(toPath(body));
  if (hood) parts.unshift(toPath([[-10, n - 20], [-44, n - 8], [-62, n + 30], [-60, n + 70], [-30, n + 60], [0, n + 20]]));
  return { h: -crown + (hat === 'witch' ? 120 : 30), parts };
}

// ---- seated (on a log, by the fire), facing right
function seated({ hair, hat, face = W }) {
  const crown = -500, parts = headPieces({ y: crown, face, hair, hat, neck: 44, rot: 0.08, x: 6 });
  const n = crown + 142;
  parts.unshift(toPath([[18, n - 2], [30, n + 18], [46, n + 54], [50, n + 100], [56, -224], [96, -240], [132, -252], [152, -232],
    [148, -160], [142, -70], [158, 0, 1], [70, 0, 1], [60, -60], [36, -92], [-80, -100, 1], [-74, -160], [-60, -250], [-44, n + 30], [-22, n + 2]]));
  return { h: -crown + (hat === 'witch' ? 120 : 30), parts };
}

// ---- side-saddle on a broom, flying right; skirt, cloak and hair stream behind in the wind
function onBroom({ hair, hat, face = W }) {
  const crown = -400, parts = headPieces({ y: crown, face, hair: hair === 'curls' ? 'curls' : null, hat, neck: 42, x: -4, rot: -0.05 });
  const n = crown + 140;
  // hair in the wind: long locks blown back from the nape
  for (let i = 0; i < 5; i++) parts.unshift(taper([[-30, crown + 40 + i * 14], [-90, crown + 44 + i * 18], [-150 - i * 8, crown + 30 + i * 26], [-200 - i * 10, crown + 46 + i * 24]], 34 - i * 3, 3));
  parts.unshift(toPath([[16, n - 2], [28, n + 16], [44, n + 50], [46, n + 90], [38, n + 130], [36, n + 170], [50, -40], [80, -14], [104, 0], [118, 22],
    [112, 60], [120, 104], [98, 114, 1], [60, 104], [20, 130, 1], [0, 98], [-34, 116, 1], [-36, 70], [-26, 20], [-30, -40], [-36, n + 130], [-30, n + 50], [-14, n]]));
  parts.unshift(toPath([[-20, n + 6], [-80, n - 8], [-150, n + 14], [-226, n - 12, 1], [-172, n + 40], [-244, n + 64, 1], [-162, n + 88], [-90, n + 112], [-32, n + 132]]));
  // the broom: a long stick, a bound fan of twigs behind
  parts.push(taper([[250, -36], [120, -14], [0, 2], [-150, 16], [-250, 24]], 11, 9));
  for (let i = 0; i < 11; i++) { const a = (i - 5) * 0.075, L = 150 + (i % 3) * 24; parts.push(taper([[-240, 26], [-240 - L * 0.5, 26 + Math.sin(a) * L * 0.4 - 4], [-240 - L, 26 + Math.sin(a) * L * 1.1]], 12, 2)); }
  parts.push(rect(-252, 12, 18, 30));
  return { h: 560, parts };
}

// ---- busts behind a table edge (y 0 is the table)
function bust({ hair, hat, face = W, neck = 46, scale = 1, extra = [] }) {
  const crown = -330 * scale, s = scale;
  const parts = headPieces({ y: crown, s, face, hair, hat, neck });
  const top = crown / s + 100 + neck;
  parts.unshift(P(shoulders(top, 0).map(([x, y, c]) => (c ? [x - 40, y, 1] : [x - 40, y])), { s }));
  return { h: -crown + 40, parts: [...parts, ...extra] };
}

// a frontal head: an oval and a neck (Edera at the coven, the Judge); rx, ry are half sizes
const frontHead = (x, y, rx, ry, neckW, neckH) => [ellipse(x, y, rx, ry), rect(x - neckW / 2, y + ry * 0.6, neckW, neckH)];

export const SIL = {
  witch: cloaked({ hair: 'long', hat: 'witch', face: { ...W, up: 0.9 } }),
  ginepra: cloaked({ hair: 'curls', face: { ...W, nose: 0.75, up: 1.3, lips: 1.2 }, hood: true, sweep: 0.9 }),
  witchSit: seated({ hair: 'long', hat: 'witch', face: { ...W, up: 0.9 } }),
  ginepraSit: seated({ hair: 'curls', face: { ...W, nose: 0.75, up: 1.3, lips: 1.2 } }),
  witchBroom: onBroom({ hair: 'long', hat: 'witch', face: { ...W, up: 0.9 } }),
  ginepraBroom: onBroom({ hair: 'curls', face: { ...W, nose: 0.75, up: 1.3, lips: 1.2 } }),
  malvaBust: bust({ hair: 'crown', face: { ...W, nose: 1.05, up: 0.3, lips: 1.1, chin: 1.05 },
    // her shawl: wrapped over the shoulders, knotted in front, the ends hanging
    extra: [toPath([[-4, -168], [30, -150], [48, -100], [58, -60], [72, -40, 1], [44, -46], [34, -20, 1], [20, -60], [-40, -70], [-104, -40], [-112, -90], [-80, -140], [-40, -166]])] }),
  orticaBust: bust({ hair: 'wild', face: { ...W, nose: 0.95, up: 0.8, lips: 1.25 } }),
  reader: (() => {
    const b = bust({ face: { ...W, nose: 0.85, up: 0.5 }, neck: 48, scale: 1.25 });
    const o = { s: 1.25, y: -330 * 1.25 }, sh = (pts) => pts.map(([x, y, c]) => (c ? [x - 40, y, 1] : [x - 40, y]));
    const veil = HAT.veil.map(([x, y, c]) => (y > 280 ? [x, 300, 1] : c ? [x, y, 1] : [x, y]));
    return { h: b.h, parts: [{ d: P(sh(veil), o), a: 0.62 }, ...b.parts.map((d) => ({ d })), { d: P(sh(HAT.veil.slice(0, 9)).concat(sh([[22, 30], [44, 10], [62, 12]])), o) }], anchors: { eye: [36 * 1.25, -330 * 1.25 + 52 * 1.25] } };
  })(),
  ederaBust: (() => { // in profile: silver hair swept into a high bun, a long neck, a standing collar
    const b = bust({ hair: 'bun', face: { ...W, nose: 1.1, up: 0.1, lips: 0.9, chin: 0.95 }, neck: 60 });
    const top = 0;
    void top;
    return b;
  })(),
  judge: (() => {
    const parts = [
      ...frontHead(0, -330, 36, 48, 30, 70),
      toPath([[-48, -360, 1], [-34, -364], [-30, -470, 1], [30, -470, 1], [34, -364], [48, -360, 1], [80, -350, 1], [-80, -350, 1]]), // tall hat
      toPath([[-18, -262], [-70, -244], [-120, -210], [-140, -150], [-150, 0, 1], [150, 0, 1], [140, -150], [120, -210], [70, -244], [18, -262]]),
      toPath([[-30, -262], [-62, -276, 1], [-50, -244], [50, -244], [62, -276, 1], [30, -262]]), // the high collar
    ];
    return { h: 480, parts, holes: [rect(-11, -250, 9, 44), rect(2, -250, 9, 44)] };
  })(),
  malva: (() => { // frontal, in a doorway, hands on hips: the gaps under her arms are light
    const parts = [
      ellipse(0, -704, 36, 46), rect(-14, -672, 28, 52),
      toPath([[-26, -744], [-40, -760], [-28, -776], [-12, -770], [0, -782], [12, -770], [28, -776], [40, -760], [26, -744]]), // the crown braid
      toPath([[-16, -626], [-64, -606], [-60, -560], [-36, -470], [-38, -430], [-70, -380], [-110, -200], [-150, 0, 1], [150, 0, 1], [110, -200], [70, -380], [38, -430], [36, -470], [60, -560], [64, -606], [16, -626]]),
      taper([[-60, -598], [-118, -520], [-46, -446]], 30, 22), taper([[60, -598], [118, -520], [46, -446]], 30, 22),
      toPath([[-64, -608], [-4, -560], [0, -520], [4, -560], [64, -608], [70, -580], [0, -490], [-70, -580]]), // the shawl's point
    ];
    return { h: 790, parts };
  })(),
  tartufo: (() => {
    const body = [[84, -330], [92, -354, 1], [76, -338], [60, -340], [50, -362, 1], [44, -334], [30, -316], [26, -290], [32, -268], [20, -240],
      [-6, -204], [-30, -150], [-44, -90], [-50, -20], [-40, 0, 1], [110, 0, 1], [100, -60], [88, -140], [70, -192], [66, -232], [80, -248], [96, -262], [108, -268], [110, -280], [100, -298], [96, -314]];
    return { h: 370, parts: [toPath(body), taper([[-40, -8], [-90, -6], [-120, -22], [-120, -50], [-100, -60]], 22, 6)], anchors: { eye: [86, -302] } };
  })(),
  constable: (() => { // a man in a long coat, brimmed hat, an arm down holding a lantern (the lantern is its own piece)
    const crown = -780, parts = headPieces({ y: crown, face: MAN, hat: 'brim', neck: 40 });
    const n = crown + 140;
    parts.unshift(toPath([[20, n - 4], [36, n + 20], [52, n + 90], [50, n + 200], [60, -260], [64, -200, 1], [30, -200], [32, 0, 1], [6, 0, 1], [0, -190], [-14, -190], [-20, 0, 1], [-46, 0, 1], [-40, -200, 1],
      [-70, -210, 1], [-60, n + 220], [-52, n + 60], [-34, n + 8], [-16, n]]));
    parts.push(taper([[30, n + 30], [60, n + 150], [74, n + 280]], 28, 20));
    return { h: 800, parts, anchors: { hand: [76, n + 290] } };
  })(),
  afflicted: (() => { // a girl in a bonnet, the arm out, pointing
    const crown = -680, parts = headPieces({ y: crown, face: { ...W, nose: 0.7, up: 1.1, chin: 0.8 }, hat: 'bonnet', neck: 40 });
    const n = crown + 140;
    parts.unshift(toPath([[16, n - 2], [26, n + 20], [36, n + 70], [30, n + 120], [26, n + 160], [40, -300], [70, -140], [92, 0, 1], [-96, 0, 1], [-70, -160], [-48, -320], [-40, n + 120], [-36, n + 40], [-18, n]]));
    parts.push(taper([[4, n + 30], [80, n + 6], [160, n - 22], [200, n - 34]], 24, 9), taper([[196, n - 32], [232, n - 44]], 6, 2.4));
    return { h: 720, parts };
  })(),
  lantern: { h: 90, parts: [poly([[-22, -70], [22, -70], [26, -10], [-26, -10]]), toPath([[-30, -10, 1], [30, -10, 1], [24, 0, 1], [-24, 0, 1]]), toPath([[-16, -70, 1], [0, -90, 1], [16, -70, 1]]), taper([[0, -90], [0, -110]], 3, 3)],
    holes: [poly([[-15, -62], [-3, -62], [-3, -18], [-17, -18]]), poly([[3, -62], [15, -62], [17, -18], [3, -18]])], anchors: { light: [0, -40] } },
};

// figures for the crowd: little busts with different hats, facing either way (pure, seeded)
export const CROWD_HATS = ['bonnet', 'brim', 'tall', null, 'cap', 'bonnet'];
export function crowdBust(i, flip) {
  const hat = CROWD_HATS[i % CROWD_HATS.length], man = hat === 'brim' || hat === 'tall' || hat === 'cap';
  const b = bust({ face: man ? MAN : { ...W, nose: 1 }, hat, hair: hat ? null : 'crown', neck: 38 });
  return flip ? b.parts.map((d) => mirror(d)) : b.parts;
}
// mirror path data (absolute commands only, as made here) around x = 0
export function mirror(d) {
  return d.replace(/([MLCHVAZ])([^MLCHVAZ]*)/g, (m, cmd, args) => {
    const n = (args.match(/-?\d*\.?\d+/g) || []).map(Number);
    if (cmd === 'H') return `H${-n[0]}`;
    if (cmd === 'A') { const out = []; for (let i = 0; i < n.length; i += 7) out.push(n[i], n[i + 1], n[i + 2], n[i + 3], 1 - n[i + 4], -n[i + 5], n[i + 6]); return `A${out.join(' ')}`; }
    if (cmd === 'V' || cmd === 'Z') return m;
    return cmd + n.map((v, i) => (i % 2 ? v : -v)).join(' ');
  });
}
