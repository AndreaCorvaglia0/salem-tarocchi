// The tile legend shared by every map file (src/data/world/README.md explains it to map authors),
// and the registry of block kinds (houses and props drawn over several tiles). Pure data: the
// parser, the tests and the painter all read it. No Phaser here.

// One character = one 16px tile.
//   ground: what the painter draws there; solid: you cannot walk on it; grass: tall grass (short
//   sight, constables see you only up close); deco: a sprite drawn on top (trees, fences...).
export const TILES = {
  '.': { ground: 'ground' },
  ',': { ground: 'ground', grass: true },
  '=': { ground: 'path' },
  '#': { ground: 'cobble' },
  '_': { ground: 'planks' },
  ':': { ground: 'flags' },
  ';': { ground: 'rug' },
  'h': { ground: 'soil', deco: 'herbs' },
  '+': { ground: 'path', door: true },
  '~': { ground: 'water', solid: true },
  'w': { ground: 'wall', solid: true },
  ' ': { ground: 'void', solid: true },
  't': { ground: 'ground', solid: true, deco: 'tree' },
  'p': { ground: 'ground', solid: true, deco: 'pine' },
  'y': { ground: 'ground', solid: true, deco: 'deadtree' },
  'b': { ground: 'ground', solid: true, deco: 'bush' },
  'f': { ground: 'ground', solid: true, deco: 'fence' },
  'r': { ground: 'ground', solid: true, deco: 'rock' },
  's': { ground: 'ground', solid: true, deco: 'stonewall' },
  'g': { ground: 'ground', solid: true, deco: 'grave' },
  'i': { ground: 'flags', solid: true, deco: 'bars' },
  'x': { ground: 'ground', solid: true },
};

// Block kinds: an uppercase letter in a map is declared in its `key` as { kind, ...options }.
// Each connected group of the same letter is one block; its bounding box is its footprint.
//   solid: blocks walking (default true). light: { x, y, r, col } in px from the top left of
//   the block, or a function of the options. Art lives in art/blocks*.js under the same name.
export const KINDS = {
  // buildings (doors are '+' tiles inside the bottom row)
  house: {}, cottage: {}, meeting: {}, court: {}, shop: {}, hut: {}, mill: {},
  // village props
  stall: {}, cart: {}, well: {}, lamp: { light: { x: 8, y: -11, r: 50, lamp: true } }, barrel: {}, crate: {},
  bench: {}, woodpile: {}, pillory: {}, board: {}, snowman: {}, hay: {}, trough: {},
  // forest and depths
  campfire: { light: { x: 8, y: 11, r: 80, warm: true, big: true } }, lantern: { light: { x: 12, y: -7, r: 56, lamp: true } },
  signpost: {}, stump: {}, log: {}, spring: {}, cross: {}, torch: { light: { x: 8, y: 1, r: 64, warm: true } },
  chains: {}, pillar: {}, den: {}, ivy: {}, ruin: {}, bones: { solid: false }, mushrooms: { solid: false },
  candles: { solid: false, light: { x: 8, y: 7, r: 44, warm: true, many: [[5, 8], [9, 5], [12, 9]] } }, cauldron: { light: { center: true, bottom: 8, r: 44, green: true } },
  // interiors
  hearth: { light: { center: true, bottom: 4, r: 96, warm: true, big: true } }, table: {}, chair: {}, bed: {}, shelf: {},
  counter: {}, lectern: {}, pews: {}, bench2: {}, dais: {}, dock: {}, cabinet: {}, window: {}, stairs: { solid: false },
  candle: { light: { x: 8, y: 0, r: 50, warm: true } }, herbsHang: {}, chest: {}, rugdeco: { solid: false }, plant: {},
  // Altrove (art/elsewhere.js): on the clouds, and inside a book
  skydoor: {}, ladder: {}, teatable: {}, glyph: {}, capital: {}, blot: {},
};

export const tileInfo = (ch) => TILES[ch] || TILES['.'];
