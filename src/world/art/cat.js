// Tartufo, the black cat: yellow eyes, a moonlit rim so he reads on dark ground.
// Frames (16x16): 0 sit, 1 sit with the tail flicked, 2-3 walk (side, facing left), 4 sit and blink.
import { makeCanvas, drawRows, addSheet } from './px.js';

const PAL = { o: '#07060b', a: '#17141f', b: '#0e0c14', c: '#3d3a5c', d: '#f2d24a', e: '#c97a8a', w: '#6a6890' };
const SIT = [
  '................',
  '....o.....o.....',
  '...oco...oco....',
  '...occoooocco...',
  '...oaaaaaaaao...',
  '...oadaaaadao...',
  '...oaaaeaaaao...',
  '....oaaaaaao....',
  '....ocaaaaao....',
  '...ocaaaaaaao...',
  '...ocaaaaaaaoo..',
  '...ocaaaaaaaoao.',
  '...ocaaaaaaaoao.',
  '...obaabaabaoao.',
  '....oooooooooo..',
  '................',
];
const SIT2 = SIT.map((r, i) => (i >= 9 && i <= 13 ? r.slice(0, 12) + (i === 9 ? 'o...' : i === 10 ? 'oao.' : i === 11 ? 'oo..' : '....') : r));
const BLINK = SIT.map((r, i) => (i === 5 ? '...oaaaaaaaao...' : r));
const WALK1 = [
  '................',
  '................',
  '..o.o...........',
  '.ocoo.........o.',
  '.oaaao.......oao',
  '.odaaoooooooooa.',
  'oeaaacccccccaao.',
  '.oaaaaaaaaaaaao.',
  '..oaaaaaaaaaaao.',
  '..oaaaaaaaaaaao.',
  '..obo.ob.ob.obo.',
  '..oo..oo..o.oo..',
  '...o..o...o..o..',
  '................',
  '................',
  '................',
];
const WALK2 = WALK1.map((r, i) => (i === 10 ? '..obob.o..obob..' : i === 11 ? '..o.oo....o.oo..' : i === 12 ? '.o...o...o...o..' : r));

export function makeCat(scene) {
  if (scene.textures.exists('tartufo')) return;
  const [c, ctx] = makeCanvas(16 * 5, 16);
  [SIT, SIT2, WALK1, WALK2, BLINK].forEach((rows, i) => drawRows(ctx, rows.map((r) => r.padEnd(16, '.').slice(0, 16)), PAL, i * 16, 0));
  addSheet(scene, 'tartufo', c, 16, 16);
  const a = scene.anims;
  if (!a.exists('tartufo-walk')) a.create({ key: 'tartufo-walk', frames: [{ key: 'tartufo', frame: 2 }, { key: 'tartufo', frame: 3 }], frameRate: 9, repeat: -1 });
  if (!a.exists('tartufo-sit')) a.create({ key: 'tartufo-sit', frames: [0, 0, 0, 4, 0, 0, 1, 1, 0, 0, 0, 0].map((f) => ({ key: 'tartufo', frame: f })), frameRate: 3, repeat: -1 });
}
