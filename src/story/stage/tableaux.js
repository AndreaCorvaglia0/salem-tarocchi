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
    near: [{ gen: 'vines', args: [5, 'tl', 700], x: -0.5, y: 0.0, h: 0.4, edge: 'l' }, { gen: 'vines', args: [6, 'tr', 700], x: 0.5, y: 0.0, h: 0.4, edge: 'r' }],
    fx: [],
    cards: { x: 0, y: 0.42, h: 0.3 },
    smoke: { x: 0, y: 0.18, size: 0.22 },
  },
  // the prologue: night, snow, the road, the village far away, one small witch
  arrival: {
    light: { x: 0.2, y: 0.34, r: 1.15, c: ['#f2d6a0', '#a0603a', '#120806'] },
    far: [{ gen: 'skyline', args: [21, 0, { steeple: true, snow: true, h: 200 }], x: 0, y: 0.6, h: 0.36, full: true }],
    mid: [{ gen: 'ground', args: [7, 0, { amp: 16, snow: true, tufts: false }], x: 0, y: 0.615, h: 0.5, full: true },
      { gen: 'tree', args: [12, { h: 600 }], x: -0.4, y: 0.64, h: 0.72 }, { gen: 'tree', args: [15, { h: 600, lean: 0.1 }], x: 0.46, y: 0.635, h: 0.56 }],
    near: [{ gen: 'ground', args: [8, 0, { amp: 8, road: true, snow: true, tufts: true }], x: 0, y: 0.7, h: 0.5, full: true },
      { sil: 'witch', x: 0.02, y: 0.775, h: 0.3 }],
    fx: [{ fx: 'moon', x: 0.3, y: 0.14, r: 0.05 }, { fx: 'snow' }],
  },
  // Malva's lit doorway, hands on hips
  door: {
    light: { x: 0, y: 0.47, r: 0.72, c: ['#ffe2a8', '#c46a26', '#120604'] },
    far: [],
    mid: [{ gen: 'houseFront', args: [{ w: 1100, h: 820, door: [250, 520] }], x: 0, y: 0.66, h: 0.7 }, { sil: 'malva', x: 0, y: 0.66, h: 0.33 }],
    near: [{ gen: 'ground', args: [9, 0, { amp: 6, snow: true, tufts: true }], x: 0, y: 0.705, h: 0.5, full: true }, { sil: 'witch', x: -0.34, y: 0.84, h: 0.34 },
      { sil: 'tartufo', x: 0.38, y: 0.8, h: 0.11, flip: true }],
    fx: [{ fx: 'glow', x: 0, y: 0.56, r: 0.45, rgb: '255,200,120', a: 0.35 }, { fx: 'snow' }],
  },
  // the square: the crowd, an Afflicted pointing, a constable's lantern
  square: {
    light: { x: 0.06, y: 0.36, r: 1.0, c: ['#f4cc88', '#a85a28', '#120705'] },
    far: [{ gen: 'skyline', args: [44, 0, { steeple: true, snow: true, h: 240 }], x: 0, y: 0.6, h: 0.42, full: true }],
    mid: [{ gen: 'ground', args: [16, 0, { amp: 4, snow: true, tufts: false }], x: 0, y: 0.62, h: 0.5, full: true },
      { sil: 'afflicted', x: -0.24, y: 0.65, h: 0.44 }, { sil: 'constable', x: 0.34, y: 0.655, h: 0.46, flip: true, lantern: true }],
    near: [{ gen: 'crowd', args: [5, 0, { rows: 1, size: 1 }], x: 0, y: 0.8, h: 0.5, full: true }],
    fx: [{ fx: 'snow' }],
  },
  // two seated girls by a fire in the wood; only the fire moves
  campfire: {
    light: { x: 0, y: 0.6, r: 0.8, c: ['#ffd68a', '#b4501c', '#0e0503'] },
    far: [{ gen: 'tree', args: [41, { h: 600, leafy: true }], x: -0.62, y: 0.66, h: 0.9 }, { gen: 'tree', args: [42, { h: 600, leafy: true }], x: 0.08, y: 0.63, h: 0.8 }, { gen: 'tree', args: [43, { h: 600, leafy: true }], x: 0.7, y: 0.66, h: 0.9 }],
    mid: [{ gen: 'tree', args: [44, { h: 600, leafy: true, lean: -0.1 }], x: -0.56, y: 0.72, h: 1.15 }, { gen: 'tree', args: [45, { h: 600, leafy: true, lean: 0.1 }], x: 0.6, y: 0.72, h: 1.1 }],
    near: [{ gen: 'ground', args: [10, 0, { amp: 8 }], x: 0, y: 0.72, h: 0.5, full: true }, { gen: 'log', args: [400], x: -0.27, y: 0.735, h: 0.22 }, { gen: 'log', args: [400], x: 0.27, y: 0.735, h: 0.22 },
      { sil: 'witchSit', x: -0.27, y: 0.715, h: 0.36 }, { sil: 'ginepraSit', x: 0.27, y: 0.715, h: 0.31, flip: true }, { gen: 'fireplace', args: [], x: 0, y: 0.74, h: 0.22 }],
    fx: [{ fx: 'fire', x: 0, y: 0.728, h: 0.15 }],
  },
  // lanterns round the cottage: three constables at the door, Ginepra steps forward
  arrest: {
    light: { x: 0.22, y: 0.44, r: 0.95, c: ['#eac890', '#8a4826', '#0c0504'] },
    far: [{ gen: 'tree', args: [51, { h: 600, leafy: true }], x: -0.7, y: 0.66, h: 0.8 }, { gen: 'tree', args: [52, { h: 600, leafy: true }], x: 0.78, y: 0.64, h: 0.9 }],
    mid: [{ gen: 'houseFront', args: [{ w: 800, h: 520, door: [200, 400], snow: false }], x: 0.3, y: 0.67, h: 0.62 }],
    near: [{ gen: 'ground', args: [11, 0, { amp: 6 }], x: 0, y: 0.72, h: 0.5, full: true },
      { sil: 'constable', x: -0.5, y: 0.75, h: 0.4, lantern: true }, { sil: 'constable', x: -0.32, y: 0.76, h: 0.42 }, { sil: 'constable', x: -0.14, y: 0.755, h: 0.4, lantern: true },
      { sil: 'ginepra', x: 0.15, y: 0.745, h: 0.36, flip: true }],
    fx: [{ fx: 'glow', x: 0.3, y: 0.6, r: 0.25, rgb: '255,196,120', a: 0.4 }],
  },
  // the cellars: arches going down into the dark, a chain, Tartufo on the stairs, a light far below
  cellar: {
    light: { x: 0, y: 0.4, r: 0.62, c: ['#f3b66c', '#86381a', '#0a0403'] },
    far: [{ gen: 'arch', args: [520, 760], x: 0, y: 0.58, h: 0.3 }],
    mid: [{ gen: 'arch', args: [560, 820], x: 0, y: 0.67, h: 0.56 }, { gen: 'stairs', args: [6, 300, 46, 80], x: -0.12, y: 0.67, h: 0.42 }, { sil: 'tartufo', x: 0.12, y: 0.585, h: 0.12, flip: true }],
    near: [{ gen: 'arch', args: [700, 1080], x: 0, y: 0.84, h: 0.95 }],
    fx: [{ fx: 'candle', x: 0.0, y: 0.585, h: 0.06 }],
  },
  // three mistresses round one candle
  coven: {
    light: { x: 0, y: 0.42, r: 1.0, c: ['#f6c47c', '#a4532a', '#0c0504'] },
    far: [{ gen: 'vines', args: [21, 'tl', 800], x: -0.5, y: 0.0, h: 0.5, edge: 'l' }, { gen: 'vines', args: [22, 'tr', 800], x: 0.5, y: 0.0, h: 0.5, edge: 'r' }],
    mid: [{ sil: 'ederaBust', x: 0.02, y: 0.6, h: 0.52, flip: true }, { sil: 'malvaBust', x: -0.34, y: 0.62, h: 0.48 }, { sil: 'orticaBust', x: 0.37, y: 0.62, h: 0.48, flip: true }],
    near: [{ gen: 'cloth', args: [0, 160], x: 0, y: 0.62, h: 0.42, full: true }],
    fx: [{ fx: 'candle', x: 0, y: 0.613, h: 0.1 }],
    smoke: { x: 0, y: 0.32, size: 0.18 },
  },
  // the court: tall windows, the high bench, the Judge, one small figure below in the light
  trial: {
    light: { x: 0, y: 0.5, r: 0.95, c: ['#f2dcac', '#9a6438', '#0e0705'] },
    far: [{ gen: 'tallWindows', args: [{ n: 3, w: 200, h: 820, gap: 380 }], x: 0, y: 0.4, h: 0.4 }],
    mid: [{ sil: 'judge', x: 0, y: 0.352, h: 0.3 }, { gen: 'bench', args: [{ w: 1500, h: 400 }], x: 0, y: 0.44, h: 0.5 }],
    near: [{ sil: 'ginepra', x: 0.0, y: 0.632, h: 0.17, flip: true }, { gen: 'crowd', args: [7, 0, { rows: 1, size: 1 }], x: 0, y: 0.95, h: 0.7, full: true }],
    fx: [],
  },
  // dawn: two girls on brooms against the rising sun, clouds sliding past
  dawn: {
    light: { x: 0, y: 0.52, r: 1.2, c: ['#fff0c4', '#e69a62', '#3a141a'] },
    far: [{ gen: 'skyline', args: [61, 0, { steeple: true, snow: false, h: 160 }], x: 0, y: 0.76, h: 0.26, full: true }],
    mid: [{ fx: 'clouds' }, { sil: 'ginepraBroom', x: 0.26, y: 0.31, h: 0.34 }, { sil: 'witchBroom', x: -0.12, y: 0.45, h: 0.42 }],
    near: [{ gen: 'ground', args: [12, 0, { amp: 26 }], x: 0, y: 0.8, h: 0.5, full: true }, { gen: 'tree', args: [71, { h: 600, leafy: true }], x: -0.62, y: 0.84, h: 0.9 }, { gen: 'tree', args: [72, { h: 600, leafy: true }], x: 0.66, y: 0.84, h: 0.8 }],
    fx: [{ fx: 'sun', x: 0, y: 0.62, r: 0.13 }],
  },
  // the last image: a table, an open book, a candle end
  last: {
    light: { x: 0.04, y: 0.48, r: 0.66, c: ['#f0c07a', '#7a3818', '#080302'] },
    far: [],
    mid: [],
    near: [{ gen: 'tableBook', args: [{ w: 900 }], x: 0, y: 0.6, h: 0.8 }],
    fx: [{ fx: 'candle', x: 0.27, y: 0.592, h: 0.06 }],
    smoke: { x: 0, y: 0.34, size: 0.2 },
  },
  // the prison tower under the moon (c3.jail)
  tower: {
    light: { x: 0.1, y: 0.3, r: 1.0, c: ['#ecd0a0', '#8a5230', '#0e0605'] },
    far: [{ gen: 'skyline', args: [81, 0, { steeple: false, snow: false, h: 160 }], x: 0, y: 0.68, h: 0.3, full: true }],
    mid: [{ gen: 'tower', args: [1100, 300], x: 0.1, y: 0.72, h: 0.6 }, { gen: 'tree', args: [82, { h: 600 }], x: -0.46, y: 0.72, h: 0.7 }],
    near: [{ gen: 'ground', args: [13, 0, { amp: 10 }], x: 0, y: 0.74, h: 0.5, full: true }, { gen: 'graves', args: [14, 700], x: -0.12, y: 0.752, h: 0.34 }],
    fx: [{ fx: 'moon', x: -0.26, y: 0.14, r: 0.045 }],
  },
};
export const TABLEAU_NAMES = Object.keys(TABLEAUX);
// a scene name from a script, or a guess from its anchor (`pan`), else null
const BY_ANCHOR = { 'village.arrival': 'arrival', 'village.square': 'square', 'village.malva_door': 'door', 'village.cottage_door': 'arrest', 'forest.campfire': 'campfire',
  'depths.coven': 'coven', 'depths.jail': 'tower', 'court.dock': 'trial', 'village.forest_gate': 'dawn', 'court.deposit': 'cellar', 'depths.entry': 'cellar' };
export const sceneFor = (node = {}) => (TABLEAUX[node.scene] ? node.scene : BY_ANCHOR[node.pan] || null);
