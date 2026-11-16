// ALTROVE · Dentro un libro, first page (docs/DESIGN.md "Altrove"): a story read in the library. The map is
// a page: cream paper, margins, big letters, ink blots. Its own rule (src/world/elsewhere.rules.js): she
// walks only on written lines. A fork is a sentence painted on the page with a missing word; the word she
// chooses (asking the cards) draws the line onward: to the next sentence, or into a blot.
//   '.' paper (where a line can be written: not walkable until written)   '-' a written line
//   'm' the margin   '+' the corner of the page (the page turns)
export default {
  id: 'book1',
  name: 'Dentro un libro',
  elsewhere: { world: 'book', rule: 'page' },
  look: 'page',
  cat: true, // Tartufo jumped into the book with her
  mood: 'reading',
  sky: { tint: 0x2a1c10, outside: 0.04 }, // the warm light of a reading lamp
  ground: '.',
  start: 'start',
  tiles: {
    '.': { ground: 'paper' },
    '-': { ground: 'ink' },
    m: { ground: 'margin', solid: true },
  },
  rows: [
    'mmmmmmmmmmmmmm',
    'm...........+m',
    'm............m',
    'm............m',
    'm............m',
    'mBB..........m',
    'mBB......GGG.m',
    'm........GGG.m',
    'm........GGG.m',
    'm............m',
    'm............m',
    'm............m',
    'm............m',
    'm.-----......m',
    'm............m',
    'm............m',
    'm..SSS.......m',
    'm..SSS....BB.m',
    'm..SSS....BB.m',
    'm............m',
    'm............m',
    'm............m',
    'm.------.....m',
    'm............m',
    'm............m',
    'm............m',
    'm............m',
    'm............m',
    'm............m',
    'm............m',
    'mmmmmmmmmmmmmm',
  ],
  key: {
    G: { kind: 'glyph', ch: 'A' },
    S: { kind: 'glyph', ch: 'S' },
    B: { kind: 'blot' },
  },
  anchors: {
    start: [2, 22, 'La prima riga'],
    fork1: [7, 22, 'Una parola manca'],
    blot1: [9, 18, 'Una macchia'],
    fork2: [6, 13, 'Una parola manca'],
    blot2: [3, 6, 'Una macchia'],
    turn: [11, 1, 'L\'angolo della pagina'],
  },
  doors: [{ at: 'turn', to: 'book2.start', look: 'page' }],
};
