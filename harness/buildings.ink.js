// Proposed ink drawings for the grimoire's map (same format as src/ui/sketchink.js: a path centred
// at 0,0, about 22 units wide). Today's are reused; the new ones carry the same symbol as the sign.
import { DRAWINGS } from '../src/ui/sketchink.js';

const L = (g, pts) => { g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); };
const door = (g) => { g.moveTo(-2, 8); g.lineTo(-2, 2); g.lineTo(2, 2); g.lineTo(2, 8); };

export const INKS = {
  ...DRAWINGS,
  // Malva: the saltbox (short slope left, long slope right) and a mortar with its pestle
  malva: (g) => { L(g, [[-10, 8], [-10, -1], [-4, -11], [10, 3], [10, 8], [-10, 8]]); door(g); g.moveTo(3, 1); g.quadraticCurveTo(5.5, 6, 8, 1); g.lineTo(3, 1); g.moveTo(6.5, 1); g.lineTo(8.5, -3.5); },
  // her cottage: a lopsided little house and the cat's ears on the sign
  cottage: (g) => { L(g, [[-9, 8], [-9, -1], [-1, -8], [9, 1], [9, 8], [-9, 8]]); door(g); g.moveTo(-6, 4); g.lineTo(-6, 1); g.lineTo(-5, 2.5); g.lineTo(-4, 1); g.lineTo(-4, 4); g.moveTo(-1, -8); g.lineTo(-1, -12); },
  // Ortica: a hut between two trunks under a crown, a bird on the side
  ortica: (g) => { g.moveTo(-7, 8); g.quadraticCurveTo(-8, -2, -10, -7); g.moveTo(7, 8); g.quadraticCurveTo(8, -2, 10, -7); g.moveTo(-10, -7); g.quadraticCurveTo(0, -16, 10, -7); g.moveTo(-6, 8); g.lineTo(-6, 2); g.quadraticCurveTo(0, -3, 6, 2); g.lineTo(6, 8); g.moveTo(-1.5, 8); g.lineTo(-1.5, 4.5); g.quadraticCurveTo(0, 3, 1.5, 4.5); g.lineTo(1.5, 8); g.moveTo(11, -1); g.ellipse(12.5, -1, 1.5, 1, 0, 0, 6.3); },
  // the court with the scales over the door
  court: (g) => { DRAWINGS.court(g); g.moveTo(0, -7); g.lineTo(0, -2); g.moveTo(-3, -5.5); g.lineTo(3, -5.5); g.moveTo(-3, -5.5); g.lineTo(-4, -3.5); g.lineTo(-2, -3.5); g.lineTo(-3, -5.5); g.moveTo(3, -5.5); g.lineTo(2, -3.5); g.lineTo(4, -3.5); g.lineTo(3, -5.5); },
  // the library: tall and narrow, the book over the door
  library: (g) => { L(g, [[-5, 8], [-5, -4], [0, -13], [5, -4], [5, 8], [-5, 8]]); door(g); g.moveTo(0, -1); g.lineTo(-3, -2); g.lineTo(-3, -5); g.lineTo(0, -4); g.lineTo(3, -5); g.lineTo(3, -2); g.lineTo(0, -1); g.lineTo(0, -4); },
};
