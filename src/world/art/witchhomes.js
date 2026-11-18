// The witches' houses (notes/buildings.md; proof board: harness/buildings.html).
// The witches' houses, each eccentric in its own way and after who lives there (lore/retroscena):
//   malvaHouse   Malva's, by the road in: a saltbox with a long crooked roof, herbs under the eaves;
//   cottageHome  hers, at the edge of the wood, in three stages that grow with her (opts.stage 1..3),
//                with three slots the game can fill from her save (opts.slots: suit, plants, prize);
//   orticaHut    Ortica's, built between the two trunks of a beech in the wood.
// Same return shape as houses.js: { canvas, over, windows, smoke, ox? }.
import { SEASONS, M, INK } from './palette.js';
import { makeCanvas, hash, rect, px, line, ellipse } from './px.js';
import { windowAt } from './houses.js';
import { KINDS } from '../tiles.js';
import { SYMBOL_OF_BLOCK as SYM } from '../../data/world/symbols.js';
import { F, profileRoof, doorAt, vine, outline, smokeStack, hangSign } from './facades.js';

const T = 16;

// A broom leaning against a wall, bristles on the ground at (x, y); ribbon: its colours [dark, light].
export function broom(ctx, x, y, ribbon) {
  line(ctx, x + 6, y - 24, x + 1, y - 6, INK); line(ctx, x + 7, y - 24, x + 2, y - 6, M.wood[3]);
  for (let j = 0; j < 7; j++) { const w = 1 + (j >> 1); rect(ctx, x - w, y - 6 + j, w * 2 + 2, 1, j === 6 ? INK : j % 2 ? '#8f6527' : '#b88935'); px(ctx, x - w - 1, y - 6 + j, INK); px(ctx, x + w + 2, y - 6 + j, INK); }
  rect(ctx, x - 1, y - 7, 4, 1, INK);
  if (ribbon) { px(ctx, x + 3, y - 10, ribbon[1]); px(ctx, x + 2, y - 10, ribbon[0]); px(ctx, x + 1, y - 9, ribbon[0]); px(ctx, x + 1, y - 8, ribbon[1]); px(ctx, x + 4, y - 9, ribbon[0]); }
}

// Bundles of herbs hanging from a line: at each x a string and a bundle of `len` px.
export function bundles(ctx, xs, yAt, S, cols = [M.herb[1], M.herb[2], M.herb[3], '#b88935']) {
  xs.forEach((x, i) => {
    const y = yAt(x), len = 5 + (i % 3), c = cols[i % cols.length];
    px(ctx, x, y, INK); px(ctx, x, y + 1, M.wood[3]);
    for (let k = 0; k < len; k++) { const w = k < 2 ? 0 : 1; rect(ctx, x - w, y + 2 + k, w * 2 + 1, 1, k === len - 1 ? INK : k % 2 ? c : M.herb[0]); }
    if (S.snow) px(ctx, x, y - 1, S.snow);
  });
}

// =====================================================================================
// MALVA'S HOUSE, 5x4, door col 0 (as today). The midwife and herb-witch (malva-retroscena), and it must say
// so at a glance, at night, in the snow, next to the proper Proctor house (pale boards, slate, shutters):
// a crooked saltbox whose ridge sags and kinks, mossy plum shingles, a tin crescent on the apex; a tall
// stone chimney bent like a finger that always breathes soft green smoke (build.js tints it); warm ochre
// daub between crooked dark timbers; a round gable window lit violet; ONE big window always lit, with
// coloured bottles on the sill (red, green, amber, violet: her remedies); a round-topped door painted deep
// purple with a pale crescent; a garlic braid by it; big bundles of herbs drying under the long eave; a
// cauldron on three legs by the door, its brew glowing green; the mortar sign; the broom with the green
// ribbon by the garden gate (she has not flown for twenty years); a vine taking the corner.
const BOTTLES = [['#5a1418', '#c8383a', '#ff9a8a'], ['#16461f', '#3fbf5f', '#b8f5b0'], ['#5a3608', '#e0962a', '#ffe0a0'], ['#2e1650', '#9a62e0', '#e0c8ff']];
const PURPLE = ['#24102f', '#3a1a4c', '#5a2c74'];
export function malvaHouse(b, season) {
  const S = SEASONS[season], W = b.w * T, over = KINDS.malva.over, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const ax = 22, ay = 12, ly = H - 38, ry = H - 18, k = 9, split = 60; // apex, left eave, right eave, roof band, lean-to
  // a crooked roof line: the short slope bellies in, the long one sags and has a kink where the lean-to begins
  const top = (x) => {
    if (x <= ax) { const t = x / ax; return Math.round(ly + (ay - ly) * t + Math.sin(t * Math.PI) * 2); }
    const t = (x - ax) / (W - 1 - ax);
    return Math.round(ay + (ry - ay) * t + Math.sin(t * Math.PI) * 6 + (x > split ? 2 : 0));
  };
  // the tall crooked chimney, bent like a finger, on the long slope (drawn first: the roof covers its foot)
  const chx = 42, chTop = 3, chFoot = top(chx) + 4, bend = (y) => (y < chTop + 9 ? 5 : y < chTop + 18 ? 3 : y < chTop + 26 ? 1 : 0); // it steps over as it rises
  for (let y = chTop; y < chFoot; y++) {
    const x0 = chx + bend(y);
    rect(ctx, x0 - 1, y, 8, 1, INK);
    for (let x = x0; x < x0 + 6; x++) px(ctx, x, y, (y % 3 === 0 || (x + (((y / 3) | 0) % 2) * 2) % 4 === 0) ? M.stone[2] : x === x0 ? M.stone[4] : M.stone[3]);
  }
  const tx = chx + bend(chTop);
  rect(ctx, tx - 1, chTop - 3, 8, 4, INK); rect(ctx, tx, chTop - 3, 6, 3, '#8a4a30'); rect(ctx, tx, chTop - 3, 6, 1, S.snow || '#b06a44'); // a clay pot on top
  const smoke = [tx + 3, chTop - 4];
  // walls: warm ochre daub under the whole roof; the lean-to a shade darker
  for (let x = 1; x < W - 1; x++) for (let y = top(x) + k - 2; y < H; y++) {
    const lean = x > split, r = (y + (x >> 3)) % 5;
    px(ctx, x, y, r === 0 ? F.daub[1] : lean ? F.daub[2] : hash(x >> 2, y >> 2, 3) > 0.8 ? F.daub[2] : F.daub[3]);
  }
  // crooked dark timbers: corner posts, a sill beam, a wobbly rail, braces
  const beam = (x0, y0, x1, y1) => { line(ctx, x0, y0, x1, y1, M.wood[1]); line(ctx, x0 + 1, y0, x1 + 1, y1, M.wood[0]); };
  for (const x of [1, split, W - 3]) beam(x, top(x) + k - 2, x + (x === split ? 1 : 0), H - 1);
  for (let x = 1; x < W - 1; x++) { const y = H - 31 + Math.round(Math.sin(x * 0.11) * 1.5); if (y > top(x) + k - 1) { px(ctx, x, y, M.wood[1]); px(ctx, x, y + 1, M.wood[0]); } }
  rect(ctx, 1, H - 3, W - 2, 2, M.wood[1]);
  beam(18, H - 30, 28, H - 4); beam(55, H - 30, 52, H - 4); beam(W - 4, top(W - 4) + k, split + 3, H - 20);
  // the round gable window, lit violet, under the short slope
  const gx = ax - 8, gy = ly - 6;
  ellipse(ctx, gx, gy, 5, 5, INK); ellipse(ctx, gx, gy, 4, 4, '#4a2a6a'); ellipse(ctx, gx, gy, 3, 3, '#a07ad8'); px(ctx, gx - 1, gy - 1, '#e0c8ff'); rect(ctx, gx, gy - 4, 1, 9, INK); rect(ctx, gx - 4, gy, 9, 1, INK);
  profileRoof(ctx, 0, W, top, (x) => k + (x > split ? 1 : 0), M.roof.plum, S, {
    seed: 7, moss: 0.16, snow: 0.45,
    after: (x, y, d) => (d === 2 && x % 9 === 4 ? M.roof.moss[2] : null), // tufts of moss show through the snow
  });
  // big bundles of herbs drying under the long eave: tied at the top, spreading at the bottom
  const herbCols = [[M.herb[2], M.herb[1], '#c8b0e0'], ['#7a6a9a', '#4a3a68', '#c8a0e8'], [M.herb[2], M.herb[0], '#e8d070'], ['#b88935', '#6b4a1d', '#e8c060'], [M.herb[3], M.herb[1], '#f0e8d0']];
  [27, 33, 38, 48, 53, 65, 71].forEach((x, i) => {
    const y = top(x) + k - 1, len = 9 + (i % 3) * 2, [lt, dk, fl] = herbCols[i % herbCols.length];
    rect(ctx, x, y, 1, 2, M.wood[3]); rect(ctx, x - 1, y + 2, 3, 1, '#8f3d3c'); // the string, a red tie
    for (let j = 0; j < len; j++) { // stems at the top, leaves spreading and hanging down, ragged at the end
      const w = j < 2 ? 0 : j < 4 ? 1 : j < len - 3 ? 2 : 3;
      for (let dx = -w; dx <= w; dx++) {
        if (j === len - 1 && hash(x + dx, j, 7) > 0.5) continue;
        px(ctx, x + dx, y + 3 + j, j < 2 ? M.herb[0] : hash(x + dx, j, 3) > 0.55 ? lt : dk);
      }
      if (j > 3 && hash(x, j, 11) > 0.6) px(ctx, x + (j % 2 ? w : -w), y + 3 + j, fl); // a flower head
    }
    if (S.snow) px(ctx, x, y - 1, S.snow);
  });
  // the big lit window, its sill crowded with bottles of every colour
  const wx = 31, wy = H - 28, ww = 19, wh = 14;
  windowAt(ctx, wx, wy, ww, wh, 'lit', { snow: S.snow });
  rect(ctx, wx, wy + wh - 1, ww, 1, M.wood[1]);
  [[1, 7], [5, 9], [9, 6], [13, 8], [16, 6]].forEach(([dx, h], i) => {
    const [dk, mid, hi] = BOTTLES[i % BOTTLES.length], bx = wx + dx, by = wy + wh - 1 - h;
    rect(ctx, bx, by + 3, 3, h - 3, mid); rect(ctx, bx + 1, by, 1, 3, dk); px(ctx, bx + 1, by - 1, M.wood[2]); // body, neck, cork
    px(ctx, bx, by + 4, hi); rect(ctx, bx + 2, by + 4, 1, h - 4, dk);
  });
  // the door: round-topped, deep purple, a pale crescent painted on it; a hood over it
  doorAt(ctx, 3, H - 19, 11, 18, PURPLE, { arch: true, knob: F.brass });
  for (const [x, y] of [[9, -15], [8, -16], [7, -16], [6, -15], [6, -14], [6, -13], [7, -12], [8, -12], [9, -13]]) px(ctx, x, H + y, '#e8d890');
  px(ctx, 7, H - 15, '#e8d890'); px(ctx, 7, H - 13, '#e8d890');
  rect(ctx, 1, H - 22, 15, 2, INK); rect(ctx, 2, H - 22, 13, 1, M.wood[3]); if (S.snow) rect(ctx, 1, H - 23, 15, 1, S.snow);
  // the lean-to: a low door to the garden
  rect(ctx, 63, H - 13, 8, 12, INK); rect(ctx, 64, H - 12, 6, 11, M.wood[1]); rect(ctx, 66, H - 12, 1, 11, M.wood[0]);
  // overgrown: a vine up the corner, a low bush of herbs
  vine(ctx, 2, H - 2, ly - 2, 3, F.ivy, 3); vine(ctx, split, H - 2, H - 18, 8, F.ivy, 2);
  outline(ctx, W, H);
  // drawn over the outline (they stand in front of the wall)
  // a tin crescent on the apex, on a short rod
  rect(ctx, ax, ay - 4, 1, 5, INK);
  ['..###', '.##..', '##...', '##...', '##...', '.##..', '..###'].forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') { px(ctx, ax - 2 + i, ay - 11 + j, '#f0e0a0'); } }));
  ['..###', '.##..', '##...', '##...', '##...', '.##..', '..###'].forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#' && (i === 0 || row[i - 1] !== '#')) px(ctx, ax - 3 + i, ay - 11 + j, INK); }));
  // a garlic braid hanging by the door
  rect(ctx, 16, H - 28, 1, 14, M.wood[3]);
  for (let j = 0; j < 4; j++) { const y = H - 25 + j * 4, x = 16 + (j % 2 ? 1 : -1); ellipse(ctx, x, y, 2, 2, INK); ellipse(ctx, x, y, 1, 1, '#ece4d0'); px(ctx, x, y - 2, '#ece4d0'); px(ctx, x + 1, y + 1, '#b8ae98'); px(ctx, x, y, '#d8b8c8'); }
  hangSign(ctx, 18, H - 36, SYM.malva, 1, S, { board: ['#2a1238', '#3a1a4c', '#5a2c74', '#7a4a98'] });
  // the cauldron on three legs, the brew glowing green
  const kx = 25, ky = H - 6;
  rect(ctx, kx - 4, ky + 2, 1, 4, INK); rect(ctx, kx + 4, ky + 2, 1, 4, INK); rect(ctx, kx, ky + 3, 1, 3, INK);
  ellipse(ctx, kx, ky, 6, 4, INK); ellipse(ctx, kx, ky, 5, 3, '#1c1a24'); px(ctx, kx - 3, ky + 1, '#3a3848');
  rect(ctx, kx - 6, ky - 4, 13, 2, INK); rect(ctx, kx - 5, ky - 4, 11, 1, '#5fe08a'); px(ctx, kx - 2, ky - 4, '#d0ffd8'); px(ctx, kx + 2, ky - 4, '#2fa85a');
  px(ctx, kx - 1, ky - 6, '#8ff0a8'); px(ctx, kx + 2, ky - 7, '#8ff0a8'); px(ctx, kx, ky - 9, '#5fe08a'); // bubbles rising
  broom(ctx, 74, H - 1, ['#1f6a3a', '#5fcf7a']);
  return {
    canvas: c, over, smoke, smokeTint: 0x8ff0a8,
    windows: [{ x: wx + 9, y: wy + 6, lit: true, keep: true }, { x: gx, y: gy, lit: true, keep: true, violet: true }, { x: kx, y: ky - 5, lit: true, keep: true, green: true }],
  };
}

// =====================================================================================
// HER COTTAGE, 4x3, door col 2 (as today). «Storta e piena di spifferi» (luoghi/capanna): the left
// wall taller than the right, the ridge sagging. It grows with her: opts.stage
//   1 «sbilenca»: patched roof, chimney leaning and cold, a cracked window, the paint peeling;
//   2 «rimessa a posto»: roof mended (new shingles show), chimney straight and smoking, a lit window
//      with a curtain, a lantern by the door, a woodpile; still modest;
//   3 «la casa di una strega»: hers, not Malva's: a patchwork roof kept on purpose, a tall pot on the
//      chimney with a crescent, a round reading window, a little porch with a bench where a client
//      waits, herbs drying along the porch, her broom by the door, her own sign.
// Slots (stage 3; opts.slots, all optional), filled by the game from what she HAS:
//   suit: 'cups' | 'swords' | 'wands' | 'pentacles' (her best suit) -> door and sign colour, a mark over the door;
//   plants: up to 4 herb ids she grows (data/herbs) -> the window box;
//   prize: 'ribbon' (the red velvet ribbon of the hat story) | 'lume' (Malva's blind lantern) |
//          'chiave' (the key of the big cellar) -> one object by the door.
export const SUITS = {
  cups: { name: 'coppe', pal: ['#18243c', '#26395e', '#3f5e8e', '#7e9ccc'], glyph: ['#...#', '#####', '.###.', '..#..', '.###.'] },
  swords: { name: 'spade', pal: ['#22252e', '#373d4b', '#59627a', '#a2acc0'], glyph: ['..#..', '..#..', '..#..', '#####', '..#..'] },
  wands: { name: 'bastoni', pal: ['#341710', '#55261a', '#874226', '#c8784a'], glyph: ['...##', '...#.', '..#..', '.#...', '#....'] },
  pentacles: { name: 'denari', pal: ['#2e2812', '#4f4219', '#86702c', '#d0b05a'], glyph: ['.###.', '#...#', '#.#.#', '#...#', '.###.'] },
};
const PLANT = { // leaf, flower
  lavanda: ['#3f6a3f', '#a08ab8'], rosmarino: ['#2c4a30', '#9fb8d8'], salvia: ['#4f6f55', '#8fa88a'], calendula: ['#3f6a3f', '#d99a45'],
  camomilla: ['#3f6a3f', '#e8e0c0'], menta: ['#3f7a44', '#6fa860'], timo: ['#4a5e3a', '#c49ac0'], ortica: ['#2c4a30', '#5d8c4a'], verbena: ['#3f6a3f', '#8a6ad0'],
  alloro: ['#2c4a30', '#3f6a3f'], melissa: ['#4f7f48', '#d8e0a0'], achillea: ['#4a5e3a', '#e8e0d0'], valeriana: ['#3f6a3f', '#e0b8c8'], artemisia: ['#6b7f6b', '#b0b8a0'],
  assenzio: ['#7a8a7a', '#c8c890'], ruta: ['#4f6f55', '#d8c860'], belladonna: ['#2c4a30', '#5a3a6a'], aconito: ['#2c4a30', '#5a6ad0'], giusquiamo: ['#4a5e3a', '#c8b880'],
  cicuta: ['#3f6a3f', '#f0f0e0'], stramonio: ['#2c4a30', '#f0e8f0'],
};

export function cottageHome(b, season) {
  const S = SEASONS[season], o = b.opts || {}, st = o.stage || 1, sl = o.slots || {};
  const W = b.w * T, over = KINDS.cottage.over, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const suit = st === 3 ? SUITS[sl.suit] || null : null;
  const wallTop = (x) => H - 28 + Math.round((x * 4) / W); // lower on the right: lopsided
  // slumping to the right and sagging (1); set straight again, the ridge almost level (2, 3)
  const ridge = (x) => (st === 1 ? 13 + Math.round(Math.pow(x / W, 1.4) * 11) + Math.round(Math.sin((x / W) * Math.PI) * 2) : 12 + Math.round((x / W) * 6));
  // chimney: leaning and cold / straight and smoking / a tall pot with a crescent
  let smoke = null;
  if (st === 1) smokeStack(ctx, 7, 6, 13, S, -2, M.stone);
  else if (st === 2) { // rebuilt: taller, straight, a clay pot on top (the silhouette changes, not only the colour)
    smoke = smokeStack(ctx, 7, 2, 17, S, 0, M.stone);
    rect(ctx, 8, 0, 5, 2, INK); rect(ctx, 9, 0, 3, 1, '#8a4a30');
  }
  else {
    smoke = smokeStack(ctx, 7, 2, 17, S, 0, M.stone); // taller, with a pot
    rect(ctx, 8, 0, 5, 2, INK); rect(ctx, 9, 0, 3, 1, '#8a4a30');
  }
  // the roof
  const after = st === 1 ? (x, y) => {
    if (x >= 13 && x < 22 && y >= 36 && y < 43) return (x + y) % 3 ? M.roof.slate[1] : M.roof.slate[0]; // a patch of somebody's slates
    if (x >= 41 && x < 48 && y >= 32 && y < 38) return (x + y) % 4 ? M.roof.plum[1] : M.roof.plum[2]; // and of somebody's plum shingles
    if ((y === 45 || y === 46) && x >= 27 && x < 43) return y === 45 ? M.wood[3] : M.wood[1]; // a plank nailed over a hole
    if ((x === 28 || x === 41) && y === 45) return M.metal[3];
    if (x >= 52 && x < 57 && y >= 39 && y < 43) return '#0a0b12'; // a hole still open
    return null;
  } : st === 2 ? (x, y) => (x >= 13 && x < 30 && y >= 35 && y < 44 ? ((x + (y >> 1)) % 5 === 0 || y % 3 === 0 ? '#4a3428' : '#7a5640') : null) // the new shingles, still pale
    : (x, y) => { if (y < 33) return null; const cell = (Math.floor(x / 8) * 3 + Math.floor((y + 1) / 5)) % 7; const seam = x % 8 === 0 || y % 5 === 4; return seam ? null : cell === 1 ? M.roof.plum[1] : cell === 4 ? M.roof.moss[1] : cell === 6 && suit ? suit.pal[1] : null; }; // a patchwork kept on purpose, quieter
  profileRoof(ctx, 0, W, ridge, (x) => wallTop(x) - ridge(x) + 2, M.roof.brown, S, { after, moss: st === 1 ? 0.1 : 0, seed: 12, snow: 0.4 });
  if (st === 3) { // a weathervane on the ridge: a sitting black cat with its tail up, over an arrow
    const vx = 46, vy = ridge(46);
    rect(ctx, vx, vy - 7, 1, 7, INK); line(ctx, vx - 5, vy - 5, vx + 5, vy - 5, INK); px(ctx, vx + 4, vy - 6, INK); px(ctx, vx + 4, vy - 4, INK); rect(ctx, vx - 6, vy - 6, 2, 3, INK);
    ['#.#......', '###......', '###......', '.####....', '.#####..#', '.#####.#.', '.######..'].forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') px(ctx, vx - 4 + i, vy - 14 + j, INK); }));
    px(ctx, vx - 3, vy - 12, '#e8d060');
  }
  // walls: a stone footing and weathered boards
  for (let x = 1; x < W - 1; x++) for (let y = wallTop(x) + 2; y < H; y++) {
    const foot = y >= H - 7, row = (y >> 2);
    let col = foot ? ((x + (row % 2) * 3) % 7 === 0 || y % 4 === 0 ? M.stone[1] : M.stone[2]) : x % 5 === 0 ? F.boards[0] : x % 5 === 1 ? F.boards[3] : F.boards[hash(x, y >> 3, 2) > 0.85 ? 1 : 2];
    if (st === 1 && !foot && hash(x, y >> 2, 6) > 0.96) col = M.dark[0]; // gaps: the draughts
    px(ctx, x, y, col);
  }
  const door = suit ? suit.pal : st === 1 ? F.sage : ['#1f3a39', '#2c5150', '#3e6e6a'];
  // the door, low, col 2
  const dx = 35, dw = 10, dh = 15;
  doorAt(ctx, dx, H - dh - 1, dw, dh, door, {});
  if (st === 1) for (let i = 0; i < 6; i++) px(ctx, dx + 1 + Math.floor(hash(i, 1, 4) * 8), H - dh + Math.floor(hash(i, 2, 4) * 12), M.wood[3]); // peeling
  // the cat door, low beside it: Tartufo's (three winters he slept here alone)
  rect(ctx, 47, H - 6, 5, 5, INK); rect(ctx, 48, H - 5, 3, 4, M.dark[0]); px(ctx, 48, H - 4, '#e8d060'); px(ctx, 50, H - 4, '#e8d060');
  // the window
  const windows = [];
  windowAt(ctx, 10, H - 21, 10, 9, st === 1 ? 'dim' : 'lit', { snow: S.snow && st < 3 ? S.snow : null });
  if (st === 1) { line(ctx, 11, H - 20, 14, H - 16, '#c7d6ea'); rect(ctx, 21, H - 21, 3, 10, INK); rect(ctx, 22, H - 20, 1, 8, F.boards[2]); } // a cracked pane, one shutter left, hanging
  else { rect(ctx, 10, H - 21, 2, 9, F.cream); rect(ctx, 18, H - 21, 2, 9, F.cream); px(ctx, 12, H - 18, F.cream); px(ctx, 17, H - 18, F.cream); } // a curtain
  windows.push({ x: 15, y: H - 17, lit: true, keep: st > 1 });
  if (st === 3) { // the window box: what she grows
    rect(ctx, 7, H - 11, 17, 3, INK); rect(ctx, 8, H - 11, 15, 2, M.wood[3]);
    (sl.plants || []).slice(0, 4).forEach((id, i) => { const [lf, fl] = PLANT[id] || PLANT.salvia, x = 9 + i * 4; rect(ctx, x, H - 14, 1, 3, lf); px(ctx, x + 1, H - 13, lf); px(ctx, x - 1, H - 13, lf); px(ctx, x, H - 15, fl); px(ctx, x + 1, H - 14, fl); });
    // a dormer with a round reading window, a candle in it: her table for the clients is under it
    const dcx = 22, db = ridge(dcx) + 13, ay = db - 21;
    for (let y = ay; y < db; y++) { const w = Math.min(8, Math.round(((y - ay) / 9) * 8)); for (let x = dcx - w; x <= dcx + w; x++) px(ctx, x, y, y - ay < 10 ? ((Math.abs(x - dcx) >= w - 2) ? (x < dcx ? M.roof.brown[2] : M.roof.brown[0]) : F.boards[2]) : (x % 4 === 0 ? F.boards[0] : F.boards[2])); }
    for (let y = ay; y < ay + 10; y++) { const w = Math.round(((y - ay) / 9) * 9); px(ctx, dcx - w, y, INK); px(ctx, dcx + w, y, INK); if (S.snow && y > ay) { px(ctx, dcx - w + 1, y, S.snow); } }
    rect(ctx, dcx - 8, db - 1, 17, 1, INK);
    ellipse(ctx, dcx, db - 7, 4, 4, INK); ellipse(ctx, dcx, db - 7, 3, 3, M.lit[1]); px(ctx, dcx - 1, db - 8, M.lit[2]); px(ctx, dcx, db - 6, INK); rect(ctx, dcx - 3, db - 7, 7, 1, INK);
    windows.push({ x: dcx, y: db - 7, lit: true, keep: true });
  }
  // apples drying on a string under the eave (luoghi/capanna: «mele messe a seccare»)
  for (let x = 4; x < 30; x += 3) { const y = wallTop(x) + 3 + ((x >> 1) % 2); px(ctx, x, y - 1, M.wood[1]); if (st > 1 || x % 2) px(ctx, x, y, x % 6 ? '#8f3d3c' : '#b85a3a'); }
  // the sign: her cat, from a bracket between window and door
  hangSign(ctx, 33, wallTop(33) + 3, SYM.cottage, -1, S, suit ? { board: suit.pal } : {});
  if (st >= 2) { // a woodpile against the left foot, a lantern by the door
    for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) { ellipse(ctx, 3 + k * 4, H - 3 - r * 4, 2, 2, INK); ellipse(ctx, 3 + k * 4, H - 3 - r * 4, 1, 1, M.wood[4]); }
    if (st === 2) { // a lantern on an iron arm out of the wall by the door
      line(ctx, 46, H - 26, 53, H - 26, INK); line(ctx, 46, H - 22, 50, H - 26, INK); rect(ctx, 52, H - 25, 1, 2, INK);
      rect(ctx, 50, H - 23, 5, 7, INK); rect(ctx, 51, H - 22, 3, 5, M.lit[1]); px(ctx, 52, H - 21, M.lit[2]); rect(ctx, 49, H - 24, 7, 1, INK);
      windows.push({ x: 52, y: H - 20, lit: true, keep: true, lamp: true });
    }
  }
  outline(ctx, W, H);
  if (st === 3) {
    // the porch: two posts and a lean-to canopy over a bench, where a client waits for a reading
    const py = H - 24;
    for (const x of [52, 62]) { rect(ctx, x, py, 2, 23, INK); px(ctx, x, py + 1, M.wood[3]); rect(ctx, x, py + 2, 1, 20, M.wood[2]); }
    for (let x = 48; x < 64; x++) { const y = py - 4 + ((x - 48) >> 2); rect(ctx, x, y - 3, 1, 6, x === 48 || x === 63 ? INK : (x % 3 === 0 ? M.roof.brown[0] : M.roof.brown[x % 2 ? 1 : 2])); px(ctx, x, y - 4, INK); px(ctx, x, y + 3, INK); if (S.snow) { px(ctx, x, y - 3, S.snow); px(ctx, x, y - 2, S.snowShade); } }
    rect(ctx, 53, H - 8, 9, 2, INK); rect(ctx, 53, H - 8, 9, 1, M.wood[3]); rect(ctx, 54, H - 6, 1, 5, INK); rect(ctx, 60, H - 6, 1, 5, INK); // the bench
    bundles(ctx, [51, 55, 59], (x) => py + ((x - 48) >> 2), S, [M.herb[3], '#b88935', M.herb[2]]);
    for (const [x, y] of [[16, 1], [15, 2], [15, 3], [15, 4], [16, 5]]) px(ctx, x, y, M.lit[1]); // a little tin crescent by the pot
    // the suit mark over the door, and her broom
    if (suit) suit.glyph.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') px(ctx, dx + 3 + i, H - dh - 8 + j, suit.pal[3]); }));
    const prize = sl.prize;
    broom(ctx, 48, H - 1, prize === 'ribbon' ? ['#6a1c22', '#c0404a'] : null);
    if (prize === 'lume') { rect(ctx, 30, H - 24, 1, 3, INK); rect(ctx, 28, H - 21, 5, 6, INK); rect(ctx, 29, H - 20, 3, 2, M.lit[1]); rect(ctx, 29, H - 18, 3, 2, M.metal[2]); windows.push({ x: 30, y: H - 19, lit: true, keep: true, lamp: true }); }
    if (prize === 'chiave') { ellipse(ctx, 29, H - 17, 2, 2, INK); px(ctx, 29, H - 17, M.dark[0]); rect(ctx, 29, H - 15, 1, 7, INK); rect(ctx, 30, H - 10, 2, 1, INK); rect(ctx, 30, H - 12, 2, 1, INK); px(ctx, 28, H - 16, F.brass); }
  }
  return { canvas: c, over, windows, smoke };
}

// Her four garden beds (luoghi/capanna; the game draws them itself in scene/garden.js once Ortica has
// given them): here only for the board, 2x2 tiles. planted: 0 none, 1 seedlings, 2 in flower.
export function cottageBeds(season, planted = 1) {
  const S = SEASONS[season], [c, ctx] = makeCanvas(32, 32);
  [[1, 3], [17, 3], [1, 19], [17, 19]].forEach(([x, y], i) => {
    rect(ctx, x, y + 1, 14, 9, '#2a1a0e'); rect(ctx, x, y, 14, 2, '#6b4626'); rect(ctx, x, y + 8, 14, 2, '#6b4626'); rect(ctx, x, y, 1, 10, '#6b4626'); rect(ctx, x + 13, y, 1, 10, '#6b4626');
    rect(ctx, x + 1, y + 2, 12, 6, '#5e3a20');
    if (planted) for (let k = 0; k < 3; k++) { const px0 = x + 3 + k * 4; rect(ctx, px0, y + 1, 1, 5, M.herb[1]); px(ctx, px0 - 1, y + 3, M.herb[2]); px(ctx, px0 + 1, y + 2, M.herb[2]); if (planted > 1) px(ctx, px0, y, Object.values(PLANT)[(i * 3 + k) % 9][1]); }
    if (S.snow && !planted) rect(ctx, x + 1, y + 2, 12, 2, S.snow);
  });
  return c;
}

// =====================================================================================
// ORTICA'S HUT, 4x3 in the forest (as today; no door tile: you talk at the anchor below, col 2).
// «Mezza casa e mezza cespuglio» (luoghi/capanna-di-ortica), in her grandmother's beeches: a low hut
// of wattle and logs wedged between the two trunks of one beech («il faggio dai due tronchi»,
// ortica-retroscena), a turf roof bulging between them, the crown over all of it; a round window
// always lit; her mother's copper pot by the door; jars on a plank; herbs hanging from a branch; a
// perch with the blackbird («è stato il merlo»); a bush swallowing the right half. The pointed hat
// is not here: it fell in the mill-race (and the nail is inside).
export function orticaHut(b, season) {
  const S = SEASONS[season], ox = KINDS.ortica.ox, W = b.w * T + ox * 2, over = KINDS.ortica.over, H = b.h * T + over;
  const [c, ctx] = makeCanvas(W, H);
  const crown = S.crown;
  // the two trunks, leaning apart, grey and smooth like beech; roots flaring
  const trunk = (x0, x1, lean) => {
    for (let y = 20; y < H; y++) {
      const t = (H - y) / (H - 20), cx = Math.round(x0 + lean * t * t * 10), w = Math.round(4 + (y > H - 10 ? (y - (H - 10)) * 0.8 : 0));
      for (let x = cx - w; x <= cx + w; x++) px(ctx, x, y, x === cx - w || x === cx + w ? INK : x < cx - w + 2 ? F.beech[3] : x > cx + w - 2 ? F.beech[0] : (hash(x, y >> 2, 3) > 0.92 ? F.beech[0] : F.beech[2]));
    }
    void x1;
  };
  trunk(ox + 4, 0, -1); trunk(W - ox - 4, 0, 1);
  // branches up into the crown
  for (const [x0, y0, x1, y1] of [[ox + 2, 30, ox - 6, 12], [ox + 4, 26, 30, 8], [W - ox - 4, 28, W - 22, 6], [W - ox - 2, 30, W - 4, 14], [ox + 3, 40, ox + 14, 30]]) { line(ctx, x0, y0, x1, y1, INK); line(ctx, x0 + 1, y0, x1 + 1, y1, F.beech[2]); line(ctx, x0 + 2, y0, x1 + 2, y1, INK); }
  // the crown: big blobs (bare and snowy in winter)
  if (crown) {
    for (const [x, y, r] of [[22, 16, 14], [44, 10, 15], [66, 16, 14], [34, 24, 10], [56, 24, 10], [10, 26, 9], [W - 8, 26, 9], [30, 36, 9], [46, 34, 10], [60, 38, 8], [40, 44, 7]]) {
      ellipse(ctx, x, y, r + 1, Math.round(r * 0.75) + 1, INK);
      ellipse(ctx, x, y, r, Math.round(r * 0.75), crown[1]);
      ellipse(ctx, x - 2, y - 2, r - 4, Math.round(r * 0.55), crown[2]);
      ellipse(ctx, x - 4, y - 4, Math.max(2, r - 9), Math.max(1, Math.round(r * 0.3)), crown[3]);
      for (let i = 0; i < r; i++) px(ctx, x - r + Math.floor(hash(i, x, 5) * r * 2), y - 2 + Math.floor(hash(i, y, 6) * r * 0.9), crown[0]);
    }
  } else { // winter: a dense tangle of bare branches, snow along them
    for (let i = 0; i < 26; i++) {
      const fromL = i % 2 === 0, x0 = fromL ? ox + 2 + hash(i, 1, 7) * 6 : W - ox - 8 + hash(i, 1, 7) * 6, y0 = 14 + hash(i, 2, 7) * 18;
      const x1 = x0 + (fromL ? -6 : -14) + hash(i, 3, 7) * 20, y1 = y0 - 6 - hash(i, 4, 7) * 12;
      line(ctx, x0, y0, x1, y1, S.bark[1]); line(ctx, x0, y0 + 1, x1, y1 + 1, INK);
      if (S.snow) { px(ctx, x1, y1 - 1, S.snow); px(ctx, (x0 + x1) >> 1, ((y0 + y1) >> 1) - 1, S.snow); }
    }
  }
  // the hut between the trunks
  const hx0 = ox + 9, hx1 = W - ox - 9, wy = H - 22;
  for (let x = hx0; x < hx1; x++) for (let y = wy; y < H; y++) { // wattle: woven horizontal
    const r = (y - wy) % 4, weave = ((x >> 2) + ((y - wy) >> 2)) % 2;
    px(ctx, x, y, r === 0 ? M.wood[0] : weave ? M.wood[2] : M.wood[3]);
  }
  // the turf roof: a mound between the trunks, grass and ferns on it
  for (let x = hx0 - 3; x < hx1 + 3; x++) {
    const t = (x - (hx0 - 3)) / (hx1 - hx0 + 6), top = Math.round(wy - 3 - Math.sin(t * Math.PI) * 8);
    for (let y = top; y < wy + 2; y++) px(ctx, x, y, y === top ? (S.snow || F.turf[3]) : y === wy + 1 ? INK : y - top < 2 ? F.turf[3] : hash(x, y, 4) > 0.8 ? F.turf[0] : F.turf[2]);
    if (!S.snow && hash(x, 3, 9) > 0.7) { px(ctx, x, top - 1, F.turf[3]); if (hash(x, 4, 9) > 0.5) px(ctx, x, top - 2, F.turf[2]); }
  }
  // the round window, always lit
  const rx = hx0 + 9, ry = H - 13;
  ellipse(ctx, rx, ry, 5, 5, INK); ellipse(ctx, rx, ry, 4, 4, M.lit[0]); ellipse(ctx, rx - 1, ry - 1, 2, 2, M.lit[2]); rect(ctx, rx, ry - 4, 1, 9, INK); rect(ctx, rx - 4, ry, 9, 1, INK);
  // the door at col 2, round-topped
  const dcx = ox + 2 * T + 8;
  doorAt(ctx, dcx - 5, H - 17, 10, 16, M.wood, { arch: true, step: null });
  // the bush swallowing the right half
  for (const [x, y, r] of [[hx1 - 4, H - 6, 7], [hx1 + 2, H - 10, 6], [hx1 - 9, H - 4, 5]]) { ellipse(ctx, x, y, r + 1, r, INK); ellipse(ctx, x, y, r, r - 1, (crown || S.leaf)[1]); ellipse(ctx, x - 2, y - 2, r - 3, r - 3, (crown || S.leaf)[2]); if (S.snow) rect(ctx, x - r + 2, y - r + 1, r * 2 - 4, 1, S.snow); }
  outline(ctx, W, H);
  // things outside, drawn over the outline: the jars on a plank, the copper pot, the herbs, the blackbird
  rect(ctx, ox + 6, H - 24, 14, 2, INK); rect(ctx, ox + 7, H - 24, 12, 1, M.wood[3]);
  ['#8f6ad1', '#4fd1a5', '#d98a4a', '#6b8f4f'].forEach((col, i) => { const x = ox + 8 + i * 3; rect(ctx, x - 1, H - 29, 3, 5, INK); px(ctx, x, H - 28, col); px(ctx, x, H - 27, col); px(ctx, x, H - 26, col); px(ctx, x, H - 29, M.wood[3]); });
  const cpx = dcx + 9; // the copper pot on a hook
  px(ctx, cpx, H - 18, INK); px(ctx, cpx, H - 17, M.metal[2]);
  for (let j = 0; j < 3; j++) { px(ctx, cpx - 3 + j, H - 17 + j, INK); px(ctx, cpx + 3 - j, H - 17 + j, INK); } // the bail
  rect(ctx, cpx - 5, H - 14, 11, 7, INK); rect(ctx, cpx - 4, H - 13, 9, 5, F.copper[2]); rect(ctx, cpx - 4, H - 13, 9, 1, F.copper[3]); rect(ctx, cpx + 2, H - 12, 2, 4, F.copper[1]); px(ctx, cpx - 3, H - 12, F.copper[3]);
  rect(ctx, cpx - 3, H - 8, 7, 1, INK); px(ctx, cpx - 4, H - 9, INK); px(ctx, cpx + 4, H - 9, INK);
  bundles(ctx, [hx0 + 1, hx0 + 16, hx0 + 19, hx0 + 22], () => wy + 1, S, [M.herb[3], M.herb[2], '#b88935', M.herb[1], '#8f6ad1']); // herbs hanging from the turf eave
  // the perch and the blackbird
  const bx = W - ox + 6, by = H - 40;
  line(ctx, W - ox - 1, by + 3, bx + 4, by + 3, INK); line(ctx, W - ox - 1, by + 4, bx + 4, by + 4, F.beech[1]);
  rect(ctx, bx - 2, by - 2, 5, 4, INK); rect(ctx, bx + 2, by - 1, 3, 2, INK); px(ctx, bx + 5, by - 1, INK); px(ctx, bx + 5, by, INK); // body and tail
  rect(ctx, bx - 3, by - 4, 3, 3, INK); px(ctx, bx - 4, by - 3, '#e89a2a'); px(ctx, bx - 5, by - 3, '#e89a2a'); px(ctx, bx - 2, by - 3, '#f0c060'); // head, beak, eye ring
  px(ctx, bx, by - 1, '#2a2a3a'); px(ctx, bx - 1, by + 2, '#e89a2a'); px(ctx, bx + 1, by + 2, '#e89a2a');
  hangSign(ctx, ox + 3, H - 46, SYM.ortica, 1, S);
  return { canvas: c, over, ox, windows: [{ x: rx, y: ry, lit: true, keep: true }], smoke: null };
}
