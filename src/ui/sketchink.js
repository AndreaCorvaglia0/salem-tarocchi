// The little ink drawings of the grimoire's map, one per `kind` (src/data/world/*.js `map`). Each draws a
// path on a 2D context, centred at 0,0, about 22 units wide; sketch.js scales and strokes it. A new kind
// needs a drawing here (tests/map.sketch.test.mjs asks for it). No DOM: the test draws them on a fake context.
const L = (g, pts) => { g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); };
const house = (g, w = 9, top = -10) => { L(g, [[-w, 8], [-w, -2], [0, top], [w, -2], [w, 8], [-w, 8]]); };
const door = (g) => { g.moveTo(-2, 8); g.lineTo(-2, 2); g.lineTo(2, 2); g.lineTo(2, 8); };

export const DRAWINGS = {
  house: (g) => { house(g); door(g); },
  // the court: columns either side of the door
  court: (g) => { house(g); door(g); g.moveTo(-6, 0); g.lineTo(-6, 7); g.moveTo(6, 0); g.lineTo(6, 7); },
  // the meetinghouse: a cross on the roof
  church: (g) => { house(g); door(g); g.moveTo(0, -10); g.lineTo(0, -16); g.moveTo(-2.5, -13.5); g.lineTo(2.5, -13.5); },
  // the black shop: its door inked solid (hatched)
  shop: (g) => { house(g); g.moveTo(-3, 8); g.lineTo(-3, 1); g.lineTo(3, 1); g.lineTo(3, 8); for (const x of [-2, -0.5, 1, 2.5]) { g.moveTo(x, 8); g.lineTo(x, 1.5); } },
  // the library: a house with an open book over the door
  library: (g) => { house(g); door(g); g.moveTo(0, -1); g.quadraticCurveTo(-3, -3.5, -6, -2); g.lineTo(-6, -5.5); g.quadraticCurveTo(-3, -7, 0, -4.5); g.quadraticCurveTo(3, -7, 6, -5.5); g.lineTo(6, -2); g.quadraticCurveTo(3, -3.5, 0, -1); g.lineTo(0, -4.5); },
  // the lane: two small houses side by side
  lane: (g) => { L(g, [[-11, 8], [-11, 0], [-6, -6], [-1, 0], [-1, 8]]); L(g, [[1, 8], [1, -2], [6, -8], [11, -2], [11, 8]]); g.moveTo(-12, 8); g.lineTo(12, 8); g.moveTo(-7, 8); g.lineTo(-7, 4); g.lineTo(-5, 4); g.lineTo(-5, 8); g.moveTo(4, 1); g.lineTo(8, 1); g.lineTo(8, 4); g.lineTo(4, 4); g.lineTo(4, 1); },
  hut: (g) => { L(g, [[-8, 8], [-8, 0], [0, -8], [8, 0], [8, 8], [-8, 8]]); g.moveTo(3, -4); g.lineTo(3, -9); g.lineTo(5, -9); g.lineTo(5, -2); },
  stall: (g) => { g.rect(-9, -1, 18, 9); L(g, [[-10, -1], [-7, -7], [7, -7], [10, -1]]); },
  well: (g) => { g.ellipse(0, 3, 8, 4, 0, 0, 6.3); g.moveTo(-8, 3); g.lineTo(-8, -6); g.lineTo(8, -6); g.lineTo(8, 3); },
  // the washing trough: a long stone basin on two feet, water in it
  trough: (g) => { L(g, [[-11, -3], [-9, 4], [9, 4], [11, -3], [-11, -3]]); g.moveTo(-7, 4); g.lineTo(-7, 8); g.moveTo(7, 4); g.lineTo(7, 8); g.moveTo(-7, -0.5); g.quadraticCurveTo(-3.5, -2.5, 0, -0.5); g.quadraticCurveTo(3.5, 1.5, 7, -0.5); },
  gate: (g) => { L(g, [[-9, 8], [-9, -6]]); L(g, [[9, 8], [9, -6]]); g.moveTo(-9, -6); g.quadraticCurveTo(0, -13, 9, -6); g.moveTo(-5, 8); g.lineTo(-5, -6); g.moveTo(0, 8); g.lineTo(0, -8); g.moveTo(5, 8); g.lineTo(5, -6); },
  garden: (g) => { for (const x of [-7, 0, 7]) { g.moveTo(x, 7); g.lineTo(x, -1); g.moveTo(x, 1); g.quadraticCurveTo(x - 4, -2, x - 3, -6); g.moveTo(x, 1); g.quadraticCurveTo(x + 4, -2, x + 3, -6); } },
  trap: (g) => { g.rect(-7, -5, 14, 10); g.moveTo(-7, 0); g.lineTo(7, 0); g.moveTo(2, 2.5); g.arc(0, 2.5, 2, 0, 6.3); },
  road: (g) => { g.moveTo(-5, 9); g.lineTo(-2, -8); g.moveTo(5, 9); g.lineTo(2, -8); },
  fire: (g) => { L(g, [[-8, 7], [8, 3]]); L(g, [[-8, 3], [8, 7]]); g.moveTo(0, 4); g.quadraticCurveTo(-6, -2, 0, -10); g.quadraticCurveTo(6, -2, 0, 4); },
  // tall grass: three tufts
  grass: (g) => { for (const x of [-7, 0, 7]) { g.moveTo(x - 3, 7); g.quadraticCurveTo(x - 2, 0, x - 4, -5); g.moveTo(x, 7); g.lineTo(x, -7); g.moveTo(x + 3, 7); g.quadraticCurveTo(x + 2, 0, x + 4, -4); } },
  den: (g) => { g.moveTo(-10, 7); g.quadraticCurveTo(0, -14, 10, 7); g.moveTo(-5, 7); g.quadraticCurveTo(0, -4, 5, 7); },
  // the deep wood: three pines close together
  pines: (g) => { for (const [x, s] of [[-6, 0.8], [6, 0.8], [0, 1]]) { L(g, [[x, -11 * s], [x - 5 * s, -2 * s], [x - 2.5 * s, -2 * s], [x - 6 * s, 5 * s], [x + 6 * s, 5 * s], [x + 2.5 * s, -2 * s], [x + 5 * s, -2 * s], [x, -11 * s]]); g.moveTo(x, 5 * s); g.lineTo(x, 8); } },
  mill: (g) => { g.rect(-5, -2, 10, 10); g.moveTo(0, -4); g.lineTo(-9, -12); g.moveTo(0, -4); g.lineTo(9, -12); g.moveTo(0, -4); g.lineTo(-9, 4); g.moveTo(0, -4); g.lineTo(9, 4); },
  pond: (g) => { g.ellipse(0, 1, 11, 6, 0, 0, 6.3); g.moveTo(-5, 1); g.quadraticCurveTo(-2.5, -1, 0, 1); g.quadraticCurveTo(2.5, 3, 5, 1); },
  // the swamp: reeds with their heads over a line of water
  swamp: (g) => { g.moveTo(-11, 7); g.quadraticCurveTo(-5, 4, 0, 7); g.quadraticCurveTo(5, 10, 11, 7); for (const [x, t] of [[-6, -6], [-1, -10], [5, -7]]) { g.moveTo(x, 6); g.lineTo(x, t + 4); g.moveTo(x + 1, t); g.ellipse(x, t + 1.5, 1.2, 2.6, 0, 0, 6.3); } },
  stones: (g) => { for (const x of [-7, 0, 7]) { g.moveTo(x - 2.5, 7); g.lineTo(x - 2.5, -3); g.quadraticCurveTo(x, -7, x + 2.5, -3); g.lineTo(x + 2.5, 7); } },
  graves: (g) => { for (const x of [-6, 6]) { g.moveTo(x, 8); g.lineTo(x, -6); g.moveTo(x - 4, -2); g.lineTo(x + 4, -2); } },
  spring: (g) => { g.moveTo(-8, 6); g.quadraticCurveTo(0, 0, 8, 6); g.moveTo(0, 2); g.quadraticCurveTo(-3, -4, 0, -9); g.moveTo(3, -1); g.quadraticCurveTo(5, -4, 4, -7); },
  stairs: (g) => { L(g, [[-9, 8], [-9, 3], [-3, 3], [-3, -2], [3, -2], [3, -7], [9, -7]]); },
  nook: (g) => { g.moveTo(-9, 8); g.lineTo(-9, -2); g.quadraticCurveTo(0, -14, 9, -2); g.lineTo(9, 8); g.moveTo(2, 1); g.arc(0, 1, 2, 0, 6.3); },
  circle: (g) => { g.arc(0, 0, 9, 0, 6.3); for (let i = 0; i < 5; i++) { const a = -1.57 + i * 2.513, b = -1.57 + ((i + 2) % 5) * 2.513; g.moveTo(Math.cos(a) * 9, Math.sin(a) * 9); g.lineTo(Math.cos(b) * 9, Math.sin(b) * 9); } },
  chains: (g) => { for (let i = -1; i <= 1; i++) { g.moveTo(i * 6 + 3, 0); g.ellipse(i * 6, 0, 3, 2, 0, 0, 6.3); } },
  tower: (g) => { L(g, [[-5, 9], [-4, -8], [4, -8], [5, 9]]); L(g, [[-6, -8], [-6, -12], [6, -12], [6, -8]]); g.moveTo(-1, -12); g.lineTo(2, -6); g.lineTo(-1, -1); },
  jail: (g) => { g.rect(-8, -7, 16, 15); for (const x of [-4, 0, 4]) { g.moveTo(x, -7); g.lineTo(x, 8); } },
};
