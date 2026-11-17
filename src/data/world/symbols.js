// One table of symbols for finding the way: the same symbol is on a building's hanging sign (the world),
// on the signpost arrows at the crossroads (the world) and in the little ink drawing of the grimoire's map
// (src/ui/sketchink.js). tests/symbols.test.mjs checks that the three agree.
//   GLYPHS        5x5 pixel patterns, for the signposts' small boards (src/world/art/marks.js)
//   SIGN_GLYPHS   7x7 pixel patterns of the same symbols, for the hanging signs (src/world/art/facades.js)
//   PLACES        each building with a sign: its symbol, the block kind that draws it (src/data/world/*.js
//                 `key`) and the kind of its drawing on the grimoire's map (`map`)
// A new building with a sign: a row in PLACES, a SIGN_GLYPHS pattern if its symbol is new, its drawing in
// sketchink.js (made with `signed(kind)` there, so the map carries the same symbol). docs/KIT.md says where.

export const GLYPHS = {
  bottle: ['..#..', '.###.', '.#.#.', '#...#', '.###.'], bell: ['..#..', '.###.', '.###.', '#####', '..#..'],
  house: ['..#..', '.###.', '#####', '.#.#.', '.###.'], scales: ['..#..', '#####', '#.#.#', '#.#.#', '..#..'],
  coin: ['.###.', '#...#', '#.#.#', '#...#', '.###.'], hut: ['..#..', '.#.#.', '#...#', '.#.#.', '.###.'],
  drop: ['..#..', '.###.', '##.##', '#####', '.###.'], wheel: ['#.#.#', '.###.', '##.##', '.###.', '#.#.#'],
  tree: ['.###.', '#####', '.###.', '..#..', '..#..'], fire: ['..#..', '.##..', '.###.', '#####', '.###.'],
  book: ['##.##', '#.#.#', '#.#.#', '#.#.#', '.#.#.'], // an open book
  mortar: ['...#.', '..#..', '#####', '.###.', '.###.'], // a bowl with its pestle: Malva's unguents
  bird: ['.##..', '###.#', '.####', '..##.', '..#..'], // the blackbird, facing left
  cat: ['#...#', '#####', '#.#.#', '#####', '.###.'], // a cat's head: Tartufo, her cottage
};

// Bigger, for the hanging signs (a 9x9 board, 7x7 inside): they must read at the game's 2x on a phone.
export const SIGN_GLYPHS = {
  bottle: ['..###..', '...#...', '..###..', '.#####.', '.##.##.', '.#####.', '..###..'],
  bell: ['...#...', '..###..', '.#####.', '.#####.', '.#####.', '#######', '...#...'],
  scales: ['...#...', '#######', '#..#..#', '#..#..#', '##.#.##', '...#...', '.#####.'],
  book: ['##...##', '###.###', '#.###.#', '#..#..#', '#..#..#', '##.#.##', '..###..'],
  mortar: ['......#', '.....#.', '....#..', '#######', '.#####.', '..###..', '.#####.'],
  bird: ['.##....', '#.##...', '.####.#', '..#####', '..####.', '...#...', '..#.#..'],
  cat: ['#.....#', '##...##', '#######', '#.###.#', '#######', '.#####.', '..###..'],
  wheel: ['..###..', '.#.#.#.', '#..#..#', '#######', '#..#..#', '.#.#.#.', '..###..'],
  house: ['...#...', '..###..', '.#####.', '#######', '.#...#.', '.#.#.#.', '.#####.'],
};

export const PLACES = {
  malva: { symbol: 'mortar', block: 'malva', sketch: 'malva' }, // Malva's house: her unguents
  cottage: { symbol: 'cat', block: 'cottage', sketch: 'cottage' }, // her cottage: Tartufo
  ortica: { symbol: 'bird', block: 'ortica', sketch: 'ortica' }, // Ortica's hut: «è stato il merlo»
  court: { symbol: 'scales', block: 'court', sketch: 'court' },
  library: { symbol: 'book', block: 'library', sketch: 'library' },
  meeting: { symbol: 'bell', block: 'meeting', sketch: 'church' },
  shop: { symbol: 'bottle', block: 'shop', sketch: 'shop' },
  mill: { symbol: 'wheel', block: 'mill', sketch: 'mill' },
};
export const SYMBOL_OF_BLOCK = Object.fromEntries(Object.values(PLACES).map((p) => [p.block, p.symbol]));
export const SYMBOL_OF_SKETCH = Object.fromEntries(Object.values(PLACES).map((p) => [p.sketch, p.symbol]));
