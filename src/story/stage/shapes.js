// Heads in profile and what goes on them (hair, hats, veil), as point lists in "head units": the crown
// at y 0, the chin at y 100, facing right, the back of the skull near x 0. Pure data, no DOM.
// The profile line is everything: forehead, brow, the dip at the bridge, nose, the little lip
// philtrum, the two lips, the soft fold under them, the chin, the jaw and a long neck.
import { tendril, taper, ellipse, tf } from './kit.js';

// the front line of a face, top of the forehead to the throat. o: nose (size), up (upturned tip),
// lips (fullness), chin, brow, jaw (heavier male jaw), all near 1 / 0
export function faceLine({ nose = 1, up = 0.4, lips = 1, chin = 1, brow = 0, jaw = 0 } = {}) {
  const tx = 83.6 + nose * 6.2, ty = 67.4 - up * 1.6, l = lips;
  return [
    [60, 2], [71, 8], [78.4, 18.6], [81.6, 30.6], [82.8 + brow * 0.6, 40.6], [82.6 + brow * 0.9, 46.2],
    [80.4 + brow * 0.4, 50.4], // the soft dip at the bridge
    [81.6 + nose * 1.4, 55.4], [(80 + tx) / 2 + 1, 61.4 - up * 0.6],
    [tx, ty, 1], // tip
    [tx - 1.4 - up * 0.6, ty + 2.8 + up * 0.3], [tx - 4.6, 72.2], [80.8, 73.6], // under the nose
    [81.2, 76.2], [83 + l * 1.6, 79], [82.8 + l * 1.2, 80.6], [80.6, 81.8, 1], // upper lip
    [82.4 + l * 1.3, 83.4], [82.4 + l * 1.3, 85.6], [79.4, 88.8], // lower lip and the fold
    [80.2 + chin * 1.2, 92.2], [80.8 + chin * 1.6, 96.2], [78.4 + chin, 99.6],
    [72 - jaw, 101.6 + jaw * 0.5], [64 - jaw * 0.5, 103.4], [58.6, 107],
  ];
}

// a whole head with a neck down to y = 100 + neck, the neck leaning forward as a real one does
export function head(o = {}, neck = 42) {
  const nf = o.neckFront ?? 58, nb = o.neckBack ?? 22, lean = neck * 0.06;
  return [
    ...faceLine(o),
    [nf - 0.6, 114], [nf - lean, 100 + neck, 1], [nb - lean * 1.4, 100 + neck, 1], [nb - lean * 0.3, 114],
    [23, 99], [13, 86], [4.5, 68], [2, 48], [6, 28], [17, 12], [33, 2.5], [46, -0.3],
  ];
}

// a few lashes on the profile: the classic touch of a silhouette cut
export const lashes = (k = 1) => [
  [[78.6, 51.4], [82.2, 50.6], [84.6 + k, 48.6]],
  [[78.2, 52.2], [81.4, 52.4], [84 + k, 51.6]],
];

// shoulders of a bust facing right, from the base of the neck (y top) down to y bottom
export function shoulders(top = 138, bottom = 260, { front = 0, back = 0, chest = 1 } = {}) {
  return [
    [52, top - 6], [56, top + 6], [64 + front, top + 22], [74 + front + chest * 4, top + 48], [80 + front + chest * 3, top + 80],
    [90 + front, bottom, 1], [-62 - back, bottom, 1], [-50 - back, top + 70], [-30 - back, top + 36], [-6, top + 16], [16, top + 2], [20, top - 8],
  ];
}

// ---- hair (all facing right, head units). Every style starts with the same front edge: the hairline
// at the forehead, the temple, in front of the ear, behind the jaw; so it covers the skull and leaves
// the face and the neck. Drawn over the head.
const FRONT = [[71, 7.5], [65, 15], [60, 27], [57, 41], [53, 55], [48, 68], [42, 80], [34, 90]];
function bumpy(cx, cy, rx, ry, a0, a1, n, amp, seed = 1, sharp = false) {
  const pts = [];
  for (let i = 0; i <= n * 2; i++) {
    const t = i / (n * 2), a = a0 + (a1 - a0) * t, out = i % 2 === 0 ? 1 : 1 - amp * (0.7 + 0.3 * Math.sin(seed * 7 + i));
    const p = [cx + Math.cos(a) * rx * out, cy + Math.sin(a) * ry * out];
    if (sharp && i % 2 === 0) p.push(1);
    pts.push(p);
  }
  return pts;
}
export const HAIR = {
  // long, loose, down the back past the shoulders
  long: [...FRONT, [28, 104], [22, 130], [17, 162], [12, 196], [4, 232, 1], [-6, 204], [-14, 166], [-16, 126], [-11, 88], [-7, 54],
    [-3, 28], [8, 9], [26, -3.5], [46, -5], [62, -1]],
  // Ginepra: a cloud down to the shoulders; the curls themselves are hairExtra('curls')
  curls: [...FRONT, [30, 104], [26, 130], [18, 158], [6, 176, 1], [-14, 168], [-22, 136], [-20, 100], [-16, 66], [-12, 38], [-4, 16],
    [10, 2], [28, -6], [46, -7], [62, -2]],
  // Malva: close to the head, a knot at the nape (the braid is drawn on top, braidLine)
  crown: [...FRONT, [27, 95], [24, 106], [12, 110], [0, 102], [-4, 88], [-7, 68], [-7, 46], [-2, 24], [10, 7], [28, -3], [46, -5], [62, -0.5]],
  // Ortica: a full mane blown back (the loose locks are hairExtra('wild'))
  wild: [...FRONT, [28, 100], [20, 124], [6, 140], [-14, 134], [-28, 110], [-34, 78], [-32, 44], [-22, 16], [-4, -4], [20, -14], [44, -12], [62, -3]],
  // Edera: swept up into a high bun, the long neck free
  bun: [...FRONT.slice(0, 7), [36, 86], [26, 90], [14, 84], [5, 70], [1, 50], [3, 30], [10, 14], [8, 0], [0, -12], [4, -28], [18, -37], [34, -33],
    [41, -19], [38, -6], [52, -3], [60, -2]],
};
// the braid of the crown, drawn as a separate row of little lobes over the hair (for cameos)
export const braidLine = () => bumpy(32, 50, 37, 54, -1.2, -3.0, 6, 0, 5).map(([x, y]) => [x, y]);

// ---- hats and veils
export const HAT = {
  // the witch hat: a wide brim and a cone whose tip bends back
  witch: {
    brim: [[-44, 30], [-20, 19], [20, 11], [70, 9], [112, 15], [134, 25, 1], [108, 23.5], [64, 20.5], [20, 23], [-18, 29], [-46, 35, 1]],
    cone: [[-6, 20, 1], [6, -6], [16, -38], [22, -66], [20, -88], [10, -104], [-12, -114, 1], [4, -98], [14, -80], [24, -56],
      [40, -26], [62, -2], [90, 12, 1]],
    band: [[-2, 18], [88, 11], [70, 1], [6, 6]],
  },
  // a tall puritan hat (the Judge, the constables' is lower and wider)
  tall: { brim: [[-30, 14], [20, 8], [100, 10], [118, 16, 1], [-34, 20, 1]], cone: [[-6, 12, 1], [0, -40], [4, -78, 1], [82, -74, 1], [86, -36], [92, 12, 1]] },
  brim: { brim: [[-40, 18], [20, 10], [104, 12], [124, 19, 1], [-44, 24, 1]], cone: [[-4, 14, 1], [2, -20], [10, -32, 1], [76, -30, 1], [84, -16], [90, 14, 1]] },
  // a bonnet framing the face (the Afflicted, villagers)
  bonnet: [[80, 4], [84, 14], [82, 24, 1], [70, 16], [56, 10], [40, 10], [22, 18], [10, 36], [6, 62], [14, 88], [6, 102, 1],
    [-14, 98], [-16, 70], [-14, 36], [-4, 10], [16, -6], [44, -10], [68, -6]],
  // a plain cap (child, miller)
  cap: [[74, 14], [96, 22, 1], [72, 20], [50, 18], [20, 22], [0, 30, 1], [-2, 14], [10, 0], [30, -10], [54, -10], [68, -2]],
  // the Reader's veil: higher than the skull, falling far behind, with a lace edge (scallops in veilEdge)
  veil: [[71, 6], [70, -2], [58, -12], [38, -16], [18, -10], [2, 4], [-10, 30], [-18, 70], [-30, 120], [-46, 176], [-64, 236], [-78, 290, 1],
    [70, 290, 1], [64, 240], [50, 190], [34, 150], [30, 128], [40, 108], [48, 86], [52, 62], [58, 36], [66, 18]],
  circlet: [[64, 4.5], [74, 9.6], [73.6, 11.6], [63.4, 6.8]],
};

// a lace edge: small half-moons along a polyline (returns circles [x, y, r])
export function lace(line, r = 4, gap = 1.9) {
  const out = [];
  for (let i = 0; i < line.length - 1; i++) {
    const [ax, ay] = line[i], [bx, by] = line[i + 1], len = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(len / (r * gap)));
    for (let k = 0; k < n; k++) out.push([ax + ((bx - ax) * (k + 0.5)) / n, ay + ((by - ay) * (k + 0.5)) / n, r]);
  }
  return out;
}

// strands blowing from a mane (thin tendrils), for Ortica and the brooms
export const strands = (x, y, a, n, len, seed = 3) => Array.from({ length: n }, (_, i) => tendril(x, y + i * 6, a + Math.sin(seed + i) * 0.25, len * (0.7 + 0.3 * Math.cos(seed * 3 + i)), 0.05 * (i % 2 ? 1 : -1), 10));

// extra hair as path pieces: Ginepra's curls, Ortica's loose locks. o: a tf() transform, dx a shift first
export function hairExtra(kind, o = {}, dx = 0) {
  const T = (pts) => tf(pts.map(([x, y]) => [x + dx, y]), o), sc = o.s ?? 1;
  if (kind === 'curls') {
    const out = [];
    const ring = [[60, -4], [44, -9], [26, -8], [8, 0], [-6, 14], [-14, 34], [-20, 56], [-22, 80], [-24, 104], [-22, 128], [-16, 150], [-6, 166], [8, 174], [20, 160], [28, 140], [30, 118]];
    ring.forEach(([x, y], i) => { const r = 9 + (i % 3) * 2.2, [[X, Y]] = T([[x, y]]); out.push(ellipse(X, Y, r * sc, r * 0.92 * sc)); });
    for (const [x, y] of [[24, 176], [10, 186], [-6, 176]]) { const [[X, Y], [X2, Y2]] = T([[x, y], [x + 1, y + 13]]); out.push(ellipse(X, Y, 6.5 * sc, 8.5 * sc), ellipse(X2, Y2, 5 * sc, 6.5 * sc)); }
    return out;
  }
  if (kind === 'wild') {
    const locks = [[[-16, 12], [-48, 2], [-78, 14], [-104, 6]], [[-22, 48], [-56, 46], [-84, 64], [-112, 60]],
      [[-22, 86], [-52, 98], [-74, 120], [-102, 126]], [[-12, 118], [-30, 142], [-38, 170], [-58, 188]]];
    return locks.map((l, i) => taper(T(l), (34 - i * 3) * sc, 1.5 * sc));
  }
  return [];
}
