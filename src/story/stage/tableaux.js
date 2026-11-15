// The named tableaux: still pictures composed in three sheets (far, mid, near) over a lit field.
// Pure data (tests resolve every name). Units: x is an offset from the centre in U (U is a portrait
// column: the phone width, about 0.62 of the height on a desktop), y is the base as a fraction of the
// height, h is a size in U (a figure's height; for generated scenery, U per 1000 of its units).
//   item: { sil, x, y, h, flip } | { gen, args, x, y, h, flip, full }   (full: generated across the width)
//   fx:   candle | fire | snow | moon | sun | glow | lanterns | hang (found cards) | clouds
//   cards: where real cards are laid { x, y, h } (h: card height as a fraction of the height)
export const TABLEAUX = {
  // the sessions: the Reader, veiled, still; the candle; your found cards hanging in the dark
  reader: {
    light: { x: 0.04, y: 0.27, r: 0.95, c: ['#f6d08a', '#b9642a', '#170804'] },
    far: [{ fx: 'hang' }],
    mid: [{ sil: 'reader', x: 0.18, y: 0.5, h: 0.7, flip: true }],
    near: [{ gen: 'cloth', args: [0, 200], x: 0, y: 0.5, h: 0.42, full: true }],
    fx: [{ fx: 'candle', x: -0.3, y: 0.493, h: 0.19 }, { fx: 'pool', x: 0, y: 0.67, r: 0.6 }],
    cards: { x: 0, y: 0.645, h: 0.17 },
    smoke: { x: -0.08, y: 0.3, size: 0.2 },
  },
  // the table is only light: real cards upright in a warm pool
  cards: {
    light: { x: 0, y: 0.42, r: 0.85, c: ['#f2c27a', '#8e4420', '#100503'] },
    far: [],
    mid: [],
    near: [{ gen: 'vines', args: [5, 'tl', 700], x: -0.5, y: 0.0, h: 0.4, edge: 'l' }, { gen: 'vines', args: [6, 'tr', 700], x: 0.5, y: 0.0, h: 0.4, edge: 'r' },
      { gen: 'vines', args: [7, 'bl', 640], x: -0.5, y: 1.0, h: 0.4, edge: 'l', only: 'tall' }, { gen: 'vines', args: [8, 'br', 640], x: 0.5, y: 1.0, h: 0.4, edge: 'r', only: 'tall' }],
    fx: [],
    cards: { x: 0, y: 0.42, h: 0.3 },
    smoke: { x: 0, y: 0.18, size: 0.22 },
  },
  // the prologue: night, snow, the road, the village far away, one small witch
  arrival: {
    light: { x: 0.2, y: 0.34, r: 1.15, c: ['#f2d6a0', '#a0603a', '#120806'], tall: { y: 0.36 } },
    far: [{ gen: 'skyline', args: [21, 0, { steeple: true, snow: true, h: 200 }], x: 0, y: 0.6, h: 0.36, full: true, tall: { y: 0.56 } }],
    mid: [{ gen: 'ground', args: [7, 0, { amp: 16, snow: true, tufts: false }], x: 0, y: 0.615, h: 0.5, full: true, tall: { y: 0.575 } },
      { gen: 'tree', args: [12, { h: 600 }], x: -0.4, y: 0.64, h: 0.72, tall: { y: 0.6 } }, { gen: 'tree', args: [15, { h: 600, lean: 0.1 }], x: 0.46, y: 0.635, h: 0.56, tall: { y: 0.595 } }],
    near: [{ gen: 'ground', args: [8, 0, { amp: 8, road: true, snow: true, tufts: true }], x: 0, y: 0.7, h: 0.5, full: true, tall: { y: 0.65 } },
      { sil: 'witch', x: 0.02, y: 0.775, h: 0.3, tall: { y: 0.735, h: 0.32 } },
      { gen: 'fence', args: [24, { n: 4, gap: 190, h: 360 }], x: -0.62, y: 0.9, h: 0.42, only: 'tall' },
      { gen: 'bank', args: [25, 0, { rise: 520, low: 30, snow: true, grass: 1.2, flat: 0.45 }], x: 0, y: 0.93, h: 0.42, full: true, only: 'tall' }],
    fx: [{ fx: 'moon', x: 0.3, y: 0.14, r: 0.05 }, { fx: 'snow' }],
  },
  // Malva's lit doorway, hands on hips
  door: {
    light: { x: 0, y: 0.47, r: 0.72, c: ['#ffe2a8', '#c46a26', '#120604'], tall: { y: 0.44, r: 0.85 } },
    far: [],
    mid: [{ gen: 'houseFront', args: [{ w: 1100, h: 820, door: [250, 520] }], x: 0, y: 0.66, h: 0.7, tall: { y: 0.62 } }, { sil: 'malva', x: 0, y: 0.66, h: 0.33, tall: { y: 0.62 } }],
    near: [{ gen: 'ground', args: [9, 0, { amp: 6, snow: true, tufts: true }], x: 0, y: 0.705, h: 0.5, full: true, tall: { y: 0.665 } }, { sil: 'witch', x: -0.34, y: 0.84, h: 0.34, tall: { y: 0.8, h: 0.36 } },
      { sil: 'tartufo', x: 0.38, y: 0.8, h: 0.11, flip: true, tall: { y: 0.77 } },
      { gen: 'fence', args: [26, { n: 4, gap: 170, h: 300 }], x: 0.22, y: 0.92, h: 0.42, only: 'tall' },
      { gen: 'bank', args: [27, 0, { rise: 420, low: 20, snow: true, grass: 1, flat: 0.5 }], x: 0, y: 0.94, h: 0.42, full: true, only: 'tall' }],
    fx: [{ fx: 'glow', x: 0, y: 0.56, r: 0.45, rgb: '255,200,120', a: 0.35, tall: { y: 0.52 } }, { fx: 'snow' }],
  },
  // the square: a crowd of all kinds keeps its distance; the Afflicted, apart, points; the accused woman
  // stands alone in a small pool of light; a constable's lantern; spectators' backs in front of us
  square: {
    light: { x: 0.06, y: 0.4, r: 0.95, c: ['#f4cc88', '#a85a28', '#120705'], tall: { y: 0.44 } },
    far: [{ gen: 'skyline', args: [44, 0, { steeple: true, snow: true, h: 240 }], x: 0, y: 0.56, h: 0.36, full: true, tall: { y: 0.55, h: 0.4 } }],
    mid: [{ gen: 'ground', args: [16, 0, { amp: 4, snow: true, tufts: false }], x: 0, y: 0.58, h: 0.5, full: true, tall: { y: 0.57 } },
      { gen: 'throng', args: [5, 0, { gaps: [[-200, 380], [-900, -460]], step: 170 }], x: 0, y: 0.6, h: 0.42, full: true, tall: { y: 0.595, h: 0.44 } },
      { sil: 'accused', x: 0.08, y: 0.67, h: 0.27, tall: { y: 0.665, h: 0.27 } },
      { sil: 'afflicted', x: -0.3, y: 0.76, h: 0.4, tall: { x: -0.28, y: 0.77, h: 0.38 } },
      { sil: 'constable', x: 0.42, y: 0.77, h: 0.44, flip: true, lantern: true, tall: { x: 0.38, y: 0.785, h: 0.42 } }],
    near: [{ gen: 'backs', args: [6, 0, { gap: [-200, 260] }], x: 0, y: 0.9, h: 0.42, full: true, tall: { y: 0.88, h: 0.4 } }],
    fx: [{ fx: 'glow', x: 0.08, y: 0.66, r: 0.2, rgb: '255,224,170', a: 0.6, under: true }, { fx: 'snow' }],
  },
  // two girls by a fire in the wood: you on the ground hugging your knees, Ginepra on a log; only the fire moves
  campfire: {
    light: { x: 0, y: 0.6, r: 0.8, c: ['#ffd68a', '#b4501c', '#0e0503'], tall: { y: 0.64, r: 1.0 } },
    far: [{ gen: 'tree', args: [41, { h: 600, leafy: true }], x: -0.62, y: 0.66, h: 0.9, tall: { y: 0.7, h: 1.2 } }, { gen: 'tree', args: [42, { h: 600, leafy: true }], x: 0.08, y: 0.63, h: 0.8, tall: { y: 0.775, h: 1.25 } }, { gen: 'tree', args: [43, { h: 600, leafy: true }], x: 0.7, y: 0.66, h: 0.9, tall: { y: 0.7, h: 1.2 } }],
    mid: [{ gen: 'tree', args: [44, { h: 600, leafy: true, lean: -0.1 }], x: -0.56, y: 0.72, h: 1.15, tall: { y: 0.77, h: 1.5 } }, { gen: 'tree', args: [45, { h: 600, leafy: true, lean: 0.1 }], x: 0.6, y: 0.72, h: 1.1, tall: { y: 0.77, h: 1.45 } }],
    near: [{ gen: 'ground', args: [10, 0, { amp: 8 }], x: 0, y: 0.72, h: 0.5, full: true, tall: { y: 0.77 } },
      { gen: 'log', args: [460], x: 0.3, y: 0.73, h: 0.2, tall: { y: 0.78, h: 0.22 } },
      { sil: 'witchSit', x: -0.3, y: 0.735, h: 0.3, tall: { y: 0.784, h: 0.36, x: -0.32 } }, { sil: 'ginepraSit', x: 0.3, y: 0.735, h: 0.33, flip: true, tall: { y: 0.784, h: 0.4, x: 0.32 } },
      { gen: 'fireplace', args: [], x: 0, y: 0.745, h: 0.2, tall: { y: 0.79 } },
      { gen: 'bank', args: [46, 0, { rise: 900, low: 40, grass: 1.6, flat: 0.5 }], x: 0, y: 0.9, h: 0.5, full: true, only: 'tall' }],
    fx: [{ fx: 'fire', x: 0, y: 0.733, h: 0.15, tall: { y: 0.78, h: 0.17 } }],
  },
  // lanterns round the cottage: three constables at the door, Ginepra steps forward
  arrest: {
    light: { x: 0.22, y: 0.44, r: 0.95, c: ['#eac890', '#8a4826', '#0c0504'], tall: { y: 0.5, r: 1.05 } },
    far: [{ gen: 'tree', args: [51, { h: 600, leafy: true }], x: -0.7, y: 0.66, h: 0.8, tall: { y: 0.74, h: 1.1 } }, { gen: 'tree', args: [52, { h: 600, leafy: true }], x: 0.78, y: 0.64, h: 0.9, tall: { y: 0.72, h: 1.2 } }],
    mid: [{ gen: 'houseFront', args: [{ w: 800, h: 520, door: [200, 400], snow: false }], x: 0.3, y: 0.67, h: 0.62, tall: { x: 0.26, y: 0.74, h: 0.56 } }],
    near: [{ gen: 'ground', args: [11, 0, { amp: 6 }], x: 0, y: 0.72, h: 0.5, full: true, tall: { y: 0.79 } },
      { sil: 'constable', x: -0.5, y: 0.75, h: 0.4, lantern: true, tall: { x: -0.4, y: 0.82, h: 0.42 } }, { sil: 'constable', x: -0.32, y: 0.76, h: 0.42, tall: { x: -0.25, y: 0.83, h: 0.44 } }, { sil: 'constable', x: -0.14, y: 0.755, h: 0.4, lantern: true, tall: { x: -0.1, y: 0.825, h: 0.42 } },
      { sil: 'ginepra', x: 0.15, y: 0.745, h: 0.36, flip: true, tall: { x: 0.12, y: 0.815, h: 0.38 } },
      { gen: 'bank', args: [53, 0, { rise: 800, low: 30, grass: 1.5, flat: 0.25 }], x: 0, y: 0.9, h: 0.42, full: true, only: 'tall' }],
    fx: [{ fx: 'glow', x: 0.3, y: 0.6, r: 0.25, rgb: '255,196,120', a: 0.4, tall: { x: 0.26, y: 0.68 } }],
  },
  // the cellars: arches going down into the dark, a chain, Tartufo on the stairs, a light far below
  cellar: {
    light: { x: 0, y: 0.4, r: 0.62, c: ['#f3b66c', '#86381a', '#0a0403'], tall: { y: 0.44, r: 0.8 } },
    far: [{ gen: 'arch', args: [520, 760], x: 0, y: 0.58, h: 0.3, tall: { y: 0.56, h: 0.36 } }],
    mid: [{ gen: 'arch', args: [560, 820], x: 0, y: 0.67, h: 0.56, tall: { y: 0.68, h: 0.7 } }, { gen: 'stairs', args: [6, 300, 46, 80], x: -0.12, y: 0.67, h: 0.42, tall: { y: 0.68, h: 0.5, x: -0.14 } },
      { sil: 'tartufo', x: 0.12, y: 0.585, h: 0.12, flip: true, tall: { y: 0.57, h: 0.13 } }],
    near: [{ gen: 'arch', args: [700, 1080], x: 0, y: 0.84, h: 0.95, tall: { y: 0.86, h: 1.05 } }],
    fx: [{ fx: 'candle', x: 0.0, y: 0.585, h: 0.06, tall: { y: 0.567 } }],
  },
  // three mistresses round one candle
  coven: {
    light: { x: 0, y: 0.42, r: 1.0, c: ['#f6c47c', '#a4532a', '#0c0504'], tall: { y: 0.52 } },
    far: [{ gen: 'vines', args: [21, 'tl', 800], x: -0.5, y: 0.0, h: 0.5, edge: 'l' }, { gen: 'vines', args: [22, 'tr', 800], x: 0.5, y: 0.0, h: 0.5, edge: 'r' }],
    mid: [{ sil: 'ederaBust', x: 0.02, y: 0.6, h: 0.52, flip: true, tall: { y: 0.7, h: 0.6 } }, { sil: 'malvaBust', x: -0.34, y: 0.62, h: 0.48, tall: { y: 0.72, h: 0.54, x: -0.33 } }, { sil: 'orticaBust', x: 0.37, y: 0.62, h: 0.48, flip: true, tall: { y: 0.72, h: 0.54, x: 0.34 } }],
    near: [{ gen: 'cloth', args: [0, 160], x: 0, y: 0.62, h: 0.42, full: true, tall: { y: 0.72, args: [0, 900] } },
      { gen: 'vines', args: [23, 'bl', 700], x: -0.5, y: 1.0, h: 0.45, edge: 'l', only: 'tall' }, { gen: 'vines', args: [24, 'br', 700], x: 0.5, y: 1.0, h: 0.45, edge: 'r', only: 'tall' }],
    fx: [{ fx: 'candle', x: 0, y: 0.613, h: 0.1, tall: { y: 0.713, h: 0.11 } }],
    smoke: { x: 0, y: 0.32, size: 0.18 },
  },
  // the court, seen from the floor: the high heavy bench, the Judge above it against tall windows, the
  // shafts of morning light, a rail; Ginepra small and alone below, her long shadow coming toward us
  trial: {
    light: { x: 0, y: 0.22, r: 0.9, c: ['#f2dcac', '#8a5434', '#0c0604'], tall: { y: 0.2, r: 1.0 } },
    far: [{ gen: 'tallWindows', args: [{ n: 3, w: 200, h: 820, gap: 420 }], x: 0, y: 0.32, h: 0.36, tall: { y: 0.27, h: 0.34 } },
      { gen: 'floor', args: [0, 3000, 'trodden'], x: 0, y: 0.68, h: 0.5, full: true, tall: { y: 0.62 } }],
    mid: [{ sil: 'judge', x: 0, y: 0.38, h: 0.36, tall: { y: 0.4, h: 0.5 } }, { gen: 'bench', args: [{ w: 2000, h: 1050 }], x: 0, y: 0.68, h: 0.42, tall: { y: 0.62, h: 0.62 } },
      { gen: 'rail', args: [0, { h: 240 }], x: 0, y: 0.73, h: 0.36, full: true, tall: { y: 0.665, h: 0.4 } }],
    near: [{ fx: 'shafts', at: [[-0.151, 0.072], [0, 0.072], [0.151, 0.072]], y: 0.39, to: 0.9, a: 0.15, slant: 0.3, tall: { at: [[-0.143, 0.068], [0, 0.068], [0.143, 0.068]], y: 0.3, to: 0.84 } },
      { gen: 'castShadow', args: [60, 1100, 200], x: 0.02, y: 0.86, h: 0.2, tall: { y: 0.8, h: 0.26 } },
      { sil: 'ginepraBack', x: 0.02, y: 0.86, h: 0.12, tall: { y: 0.8, h: 0.16 } },
      { gen: 'backs', args: [7, 0, { gap: [-330, 380] }], x: 0, y: 0.97, h: 0.45, full: true, tall: { y: 0.95, h: 0.55 } }],
    fx: [{ fx: 'glow', x: 0.02, y: 0.85, r: 0.2, rgb: '255,220,160', a: 0.55, under: true, tall: { y: 0.79 } }],
  },
  // dawn: the two of you on brooms climbing past the rising sun, Salem small below, clouds sliding by
  dawn: {
    light: { x: 0, y: 0.56, r: 1.2, c: ['#fff0c4', '#e69a62', '#3a141a'], tall: { y: 0.58 } },
    far: [{ gen: 'skyline', args: [61, 0, { steeple: true, snow: false, h: 160 }], x: 0, y: 0.72, h: 0.13, full: true, tall: { y: 0.69, h: 0.11 } },
      { gen: 'woods', args: [62, 0, { amp: 30, crown: 50 }], x: 0, y: 0.77, h: 0.3, full: true, tall: { y: 0.735, h: 0.32 } }],
    mid: [{ fx: 'clouds' }, { gen: 'woods', args: [63, 0, { amp: 50, crown: 60 }], x: 0, y: 0.84, h: 0.4, full: true, tall: { y: 0.8, h: 0.45 } },
      { sil: 'ginepraBroom', x: 0.42, y: 0.3, h: 0.3, tall: { x: 0.3, y: 0.3, h: 0.28 } },
      { sil: 'witchBroom', x: -0.05, y: 0.5, h: 0.42, tall: { x: -0.02, y: 0.53, h: 0.44 } }],
    near: [{ gen: 'woods', args: [64, 0, { amp: 70, crown: 80 }], x: 0, y: 0.93, h: 0.5, full: true, tall: { y: 0.88, h: 0.55 } },
      { gen: 'tree', args: [71, { h: 600, leafy: true }], x: -0.7, y: 0.98, h: 0.75, tall: { x: -0.52, y: 0.99, h: 0.95 } },
      { gen: 'tree', args: [72, { h: 600, leafy: true, lean: -0.1 }], x: 0.74, y: 0.98, h: 0.65, tall: { x: 0.54, y: 1.0, h: 0.8 } }],
    fx: [{ fx: 'sun', x: 0, y: 0.68, r: 0.12, tall: { y: 0.66 } }],
  },
  // the last image: a table, an open book, a candle end
  last: {
    light: { x: 0.04, y: 0.48, r: 0.66, c: ['#f0c07a', '#7a3818', '#080302'], tall: { y: 0.5, r: 0.8 } },
    far: [],
    mid: [],
    near: [{ gen: 'tableBook', args: [{ w: 900 }], x: 0, y: 0.6, h: 0.8, tall: { y: 0.6, h: 0.95 } },
      { sil: 'tartufo', x: -0.36, y: 0.584, h: 0.13, tall: { x: -0.33, y: 0.581, h: 0.14 } },
      { gen: 'cloth', args: [0, 300], x: 0, y: 0.86, h: 0.5, full: true, only: 'tall' }],
    fx: [{ fx: 'candle', x: 0.27, y: 0.592, h: 0.06, tall: { x: 0.31, y: 0.59 } }],
    smoke: { x: 0, y: 0.34, size: 0.2 },
  },
  // the prison tower under the moon (c3.jail)
  tower: {
    light: { x: 0.1, y: 0.3, r: 1.0, c: ['#ecd0a0', '#8a5230', '#0e0605'], tall: { y: 0.36 } },
    far: [{ gen: 'skyline', args: [81, 0, { steeple: false, snow: false, h: 160 }], x: 0, y: 0.68, h: 0.3, full: true, tall: { y: 0.74 } }],
    mid: [{ gen: 'tower', args: [1100, 300], x: 0.1, y: 0.73, h: 0.6, tall: { y: 0.81, h: 0.72 } }, { gen: 'tree', args: [82, { h: 600 }], x: -0.46, y: 0.72, h: 0.7, tall: { y: 0.79, h: 0.95 } }],
    near: [{ gen: 'ground', args: [13, 0, { amp: 10 }], x: 0, y: 0.74, h: 0.5, full: true, tall: { y: 0.8 } }, { gen: 'graves', args: [14, 700], x: -0.12, y: 0.752, h: 0.34, tall: { y: 0.815, h: 0.42 } },
      { gen: 'bank', args: [83, 0, { rise: 800, low: 30, grass: 1.5, flat: 0.25 }], x: 0, y: 0.9, h: 0.42, full: true, only: 'tall' }],
    fx: [{ fx: 'moon', x: -0.26, y: 0.14, r: 0.045, tall: { y: 0.18 } }],
  },
};
export const TABLEAU_NAMES = Object.keys(TABLEAUX);
// a scene name from a script, or a guess from its anchor (`pan`), else null
const BY_ANCHOR = { 'village.arrival': 'arrival', 'village.square': 'square', 'village.malva_door': 'door', 'village.cottage_door': 'arrest', 'forest.campfire': 'campfire',
  'depths.coven': 'coven', 'depths.jail': 'tower', 'court.dock': 'trial', 'village.forest_gate': 'dawn', 'court.deposit': 'cellar', 'depths.entry': 'cellar' };
export const sceneFor = (node = {}) => (TABLEAUX[node.scene] ? node.scene : BY_ANCHOR[node.pan] || null);
