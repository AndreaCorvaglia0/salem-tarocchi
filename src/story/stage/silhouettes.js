// Paper-cut figures for the shadow theatre, as path data. Pure data (no DOM): every figure is
//   SIL[name] = { h, parts: [{ d, a? }], anchors? }
// in units where a head is 100 tall; the origin is the middle of the base (feet, the table edge), y up
// is negative, and every figure faces right (the stage mirrors it). Figures are always still: the
// stage gives them life with light, parallax and slow drift. The witches are slender and graceful.
import { toPath, tf, taper, ellipse, rect, poly, xform, tendril } from './kit.js';
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
function cloaked({ hair, hat, face = W, crown = -700, hood = false, sweep = 1, rot = 0 }) {
  const parts = headPieces({ x: rot * 140, y: crown + rot * 20, face, hair, hat, neck: 46, rot });
  const n = crown + 146; // base of the neck
  const body = [[16, n - 4], [24, n + 14], [40, n + 50], [52, n + 92], [48, n + 122], [36, n + 152], [36, n + 200], [50, n + 300],
    [72, -140], [92, -50], [106, 0, 1], [40, 6], [-50, 6], [-164 * sweep, 0, 1], [-132 * sweep, -120], [-102, -280], [-78, n + 180],
    [-64, n + 100], [-54, n + 44], [-38, n + 12], [-14, n]];
  parts.unshift(toPath(body));
  if (hood) parts.unshift(toPath([[-10, n - 20], [-44, n - 8], [-62, n + 30], [-60, n + 70], [-30, n + 60], [0, n + 20]]));
  return { h: -crown + (hat === 'witch' ? 120 : 30), parts };
}

// Tartufo sitting, facing right (also rides the broom)
const TARTUFO = [toPath([[84, -330], [92, -354, 1], [76, -338], [60, -340], [50, -362, 1], [44, -334], [30, -316], [26, -290], [32, -268], [20, -240],
  [-6, -204], [-30, -150], [-44, -90], [-50, -20], [-40, 0, 1], [110, 0, 1], [100, -60], [88, -140], [70, -192], [66, -232], [80, -248], [96, -262], [108, -268], [110, -280], [100, -298], [96, -314]]),
taper([[-40, -8], [-90, -6], [-120, -22], [-120, -50], [-100, -60]], 22, 6)];

// ---- seated on the ground (seat 0: knees up, arms wrapped round them) or on a log (seat > 0: leaning
// forward, forearms on the knees). The cloak pools behind; no hands are ever shown.
function seated({ hair, hat, face = W, seat = 0 }) {
  if (!seat) {
    const parts = headPieces({ x: 10, y: -470, face, hair, hat, neck: 40, rot: 0.08 });
    parts.unshift(toPath([[-10, -336], [-50, -316], [-80, -250], [-100, -160], [-140, -80], [-210, -24], [-270, 0, 1], [-10, 0, 1], [0, -100], [0, -300]]));
    parts.unshift(toPath([[20, -332], [44, -300], [54, -250], [46, -190], [52, -140], [100, -240], [134, -300], [156, -304], [172, -284], [176, -200], [176, -80], [176, -24],
      [210, -6], [214, 0, 1], [150, 0, 1], [146, -80], [140, -200], [128, -250, 1], [70, -120], [16, -24], [-20, 0, 1], [-70, -30], [-84, -120], [-70, -220], [-44, -300], [-18, -330]]));
    parts.push(taper([[26, -298], [80, -262], [130, -236], [166, -226]], 44, 40)); // arms round the shins (the hands are hidden behind them)
    return { h: 470 + (hat === 'witch' ? 120 : 30), parts };
  }
  const parts = headPieces({ x: 40, y: -560, face, hair, hat, neck: 40, rot: 0.18 });
  parts.unshift(toPath([[0, -426], [-40, -400], [-80, -320], [-110, -220], [-150, -120], [-200, -40], [-250, 0, 1], [-30, 0, 1], [-30, -100], [-10, -380]]));
  parts.unshift(toPath([[36, -420], [62, -386], [76, -330], [70, -260], [80, -200], [150, -232], [214, -254], [232, -228], [236, -160], [240, -80], [242, -24], [276, -6], [280, 0, 1],
    [214, 0, 1], [206, -80], [196, -170], [176, -200, 1], [100, -168], [30, -120], [-20, -92], [-50, -130], [-60, -240], [-40, -340], [-10, -412]]));
  parts.push(taper([[44, -392], [96, -322], [156, -272], [218, -262]], 44, 30), ellipse(220, -262, 18, 19)); // forearms on the knees
  return { h: 560 + (hat === 'witch' ? 120 : 30), parts };
}

// ---- riding a broom side-saddle, leaning into the wind, flying right and a little up; skirt, cloak
// and hair stream back in long curves, the bristles trail. Origin: the seat on the stick. cat: Tartufo
// sits at the back of the stick.
function onBroom({ hair, hat, face = W, cat = false, tilt = -0.12 }) {
  const crown = -430, parts = [], lean = 0.22;
  const L = (pts) => pts.map(([x, y, c]) => [x - Math.min(0, y) * lean, y, c]).map(([x, y, c]) => (c ? [x, y, 1] : [x, y]));
  // the cloak, far side, streaming back in three long tongues
  parts.push(toPath(L([[100, -282], [40, -292], [-40, -284], [-130, -306], [-220, -292], [-340, -326, 1], [-262, -258], [-200, -242], [-310, -214, 1], [-210, -190],
    [-150, -176], [-240, -128, 1], [-130, -120], [-70, -90], [-20, -60], [10, -150], [50, -230]])));
  // hair in the wind
  const locks = hair === 'curls' ? 7 : 6;
  for (let i = 0; i < locks; i++) {
    const x0 = 66 + 84 - i * 3, y0 = crown + 30 + i * 12, L = (hair === 'curls' ? 220 : 330) - Math.abs(i - 2) * 28, pts = [];
    for (let j = 0; j <= 8; j++) { const t = j / 8; pts.push([x0 - L * t, y0 + Math.sin(t * 5 + i * 0.9) * 13 * t + i * 7 * t + t * t * 20]); }
    if (hair === 'curls') { const [ex, ey] = pts[pts.length - 1]; parts.push(taper(pts, 30 - i * 2, 10)); parts.push(taper(tendril(ex, ey, Math.PI + 0.3, 46, (i % 2 ? 1 : -1) * 0.5, 10), 11, 1.5)); }
    else parts.push(taper(pts, 30 - i * 2.5, 1.6));
  }
  parts.push(...headPieces({ x: 96 + 84, y: crown + 14, face, hair: hair === 'curls' ? 'curls' : 'crown', hat, neck: 32, rot: -0.1 }));
  // body leaning into the wind: chest, the lap, knees together, shins down, the skirt streaming behind
  parts.push(toPath(L([[120, -292], [142, -262], [162, -222], [154, -190], [124, -142], [118, -92], [132, -52], [200, -46], [230, -28], [226, 20], [206, 80],
    [190, 116], [184, 136, 1], [130, 140], [60, 150], [-20, 140], [-110, 160], [-200, 146], [-320, 176, 1], [-230, 110], [-150, 80], [-100, 50], [-70, 18],
    [-60, -12], [-40, -62], [0, -150], [40, -222], [66, -268], [88, -292]])));
  parts.push(taper([[186, 128], [212, 140], [236, 156]], 16, 3)); // the shoe's point
  // the near arm in its sleeve, down to the stick (no hand: the cuff meets the wood)
  parts.push(taper(L([[112, -256], [168, -160], [226, -76]]).concat([[300, -14]]), 40, 24), ellipse(302, -10, 15, 12));
  // the broom: the stick, the binding, a long fan of twigs trailing
  parts.push(taper([[430, -20], [260, -10], [0, 2], [-200, 8], [-300, 10]], 13, 11));
  parts.push(toPath([[-292, -6, 1], [-330, -14], [-420, -30], [-530, -50, 1], [-470, 10], [-540, 70, 1], [-420, 48], [-330, 30], [-292, 24, 1]], true, 0.9));
  for (let i = 0; i < 13; i++) { const a = (i - 6) * 0.06 + 0.02, L = 240 + (i % 4) * 34 + (i % 3) * 10; parts.push(taper([[-310, 8 + (i - 6) * 2], [-310 - L * 0.5, 8 + Math.sin(a) * L * 0.5 + 4], [-310 - L, 8 + Math.sin(a) * L * 1.1 + 12]], 9, 1.4)); }
  parts.push(rect(-312, -12, 22, 38), rect(-296, -10, 6, 34));
  if (cat) parts.push(...TARTUFO.map((d) => xform(d, { s: 0.34, dx: -200, dy: 6 })));
  return { h: 600, parts: parts.map((d) => xform(d, { rot: tilt })) };
}

// ---- a standing villager for the crowd: man (coat, brim or tall hat), woman (bonnet, shawl), child, elder
// with a stick. Simple and still: the crowd is a mass of shapes, not people acting.
function villager(kind) {
  if (kind === 'woman' || kind === 'girl') {
    const f = cloaked({ hat: 'bonnet', face: { ...W, nose: 1 }, sweep: 0.7 });
    f.parts.push(toPath([[-60, -560], [40, -560], [62, -480], [10, -430, 1], [-70, -470]])); // the shawl
    return f;
  }
  const man = (hat, crown = -760, stick = false) => {
    const parts = headPieces({ y: crown, face: MAN, hat, neck: 38 });
    const n = crown + 138;
    parts.unshift(toPath([[20, n - 4], [38, n + 22], [54, n + 100], [52, n + 230], [62, -200], [66, -150, 1], [34, -150], [34, 0, 1], [8, 0, 1], [2, -140],
      [-16, -140], [-20, 0, 1], [-48, 0, 1], [-46, -150, 1], [-72, -170, 1], [-62, n + 220], [-54, n + 60], [-36, n + 8], [-16, n]]));
    if (stick) parts.push(taper([[104, n + 160], [110, -400], [118, 0]], 12, 10), taper([[40, n + 40], [80, n + 120], [104, n + 170]], 30, 22));
    return { h: -crown + 60, parts };
  };
  if (kind === 'tall') return man('tall');
  if (kind === 'elder') { const f = man('brim', -700, true); return { ...f, parts: f.parts.map((d) => xform(d, { rot: 0.04 })) }; }
  if (kind === 'child') return man('cap', -470);
  return man('brim');
}

// ---- seen from behind, small, facing the bench: Ginepra in the dock (curls, cloak to the floor)
function backView() {
  const curls = [];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, r = 42 + (i % 3) * 6; curls.push(ellipse(Math.cos(a) * r, -600 + Math.sin(a) * r * 1.05 + (Math.sin(a) > 0 ? 18 : 0), 18 + (i % 2) * 4, 17)); }
  return { h: 680, parts: [ellipse(0, -600, 48, 56), ...curls, rect(-16, -560, 32, 50),
    toPath([[-24, -530], [-80, -500], [-92, -420], [-96, -300], [-116, -120], [-138, 0, 1], [138, 0, 1], [116, -120], [96, -300], [92, -420], [80, -500], [24, -530]])] };
}

// ---- busts behind a table edge (y 0 is the table)
function bust({ hair, hat, face = W, neck = 40, scale = 1, extra = [] }) {
  const crown = -330 * scale, s = scale;
  const parts = headPieces({ y: crown, s, face, hair, hat, neck });
  const top = crown / s + 100 + neck;
  parts.unshift(P(shoulders(top - 26, 0).map(([x, y, c]) => (c ? [x - 40, y, 1] : [x - 40, y])), { s }));
  return { h: -crown + 40, parts: [...parts, ...extra] };
}

// a frontal head: an oval and a neck (Edera at the coven, the Judge); rx, ry are half sizes
const frontHead = (x, y, rx, ry, neckW, neckH) => [ellipse(x, y, rx, ry), rect(x - neckW / 2, y + ry * 0.6, neckW, neckH)];

export const SIL = {
  witch: cloaked({ hair: 'long', hat: 'witch', face: { ...W, up: 0.9 } }),
  ginepra: cloaked({ hair: 'curls', face: { ...W, nose: 0.75, up: 1.3, lips: 1.2 }, hood: true, sweep: 0.9 }),
  witchSit: seated({ hair: 'long', hat: 'witch', face: { ...W, up: 0.9 } }),
  ginepraSit: seated({ hair: 'curls', face: { ...W, nose: 0.75, up: 1.3, lips: 1.2 }, seat: 90 }),
  witchBroom: onBroom({ hair: 'long', hat: 'witch', face: { ...W, up: 0.9 }, cat: true }),
  ginepraBroom: onBroom({ hair: 'curls', face: { ...W, nose: 0.75, up: 1.3, lips: 1.2 }, tilt: -0.2 }),
  villagerMan: villager('man'), villagerTall: villager('tall'), villagerWoman: villager('woman'), villagerChild: villager('child'), villagerElder: villager('elder'),
  accused: (() => { const f = cloaked({ hair: 'crown', face: { ...W, nose: 1, up: 0.4 }, sweep: 0.8, rot: 0.2 }); return f; })(),
  ginepraBack: backView(),
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
  ederaBust: bust({ hair: 'bun', face: { ...W, nose: 1.1, up: 0.1, lips: 0.9, chin: 0.95 }, neck: 50 }), // silver hair in a high bun, a long neck
  judge: (() => { // frontal, seen from below: the tall hat, a long face, the white bands (cut out), wide shoulders
    const parts = [
      ellipse(0, -420, 40, 54), rect(-22, -380, 44, 60),
      toPath([[-46, -456, 1], [-36, -470], [-30, -600, 1], [30, -600, 1], [36, -470], [46, -456, 1], [96, -446, 1], [92, -432, 1], [-92, -432, 1], [-96, -446, 1]], true, 0.6), // tall hat
      toPath([[-24, -336], [-90, -318], [-160, -290], [-196, -220], [-210, 0, 1], [210, 0, 1], [196, -220], [160, -290], [90, -318], [24, -336]]),
      toPath([[-36, -350], [-78, -366, 1], [-64, -318], [64, -318], [78, -366, 1], [36, -350]]), // the high collar
    ];
    return { h: 600, parts, holes: [rect(-13, -326, 11, 64), rect(2, -326, 11, 64), rect(-14, -486, 28, 22)] };
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
  tartufo: { h: 370, parts: TARTUFO, anchors: { eye: [86, -302] } },
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
