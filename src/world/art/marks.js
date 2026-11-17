// Art for what the four magics meet in the world, and for finding the way: brambles (burn with
// Fire), roots and warded stones (Earth draws them aside; the stone's carved mark glows), the wisps
// of thick fog and the gust of Air, the sixth sense's ripple (Water), the glint of a Minor in the
// grass, a burst of fire, and the signpost block (pixel arrows and symbols, no words).
import { SEASONS, M, INK } from './palette.js';
import { makeCanvas, hash, rect, px, line, ellipse, addTex, addSheet } from './px.js';
import { GLYPHS } from '../../data/world/symbols.js';

const T = 16;

// small 5x5 symbols for the signposts: the same table as the hanging signs and the grimoire's map
const GLYPH = GLYPHS;
const ARROW = { left: ['..#', '.##', '###', '.##', '..#'], right: ['#..', '##.', '###', '##.', '#..'], up: ['..#..', '.###.', '#####'], down: ['#####', '.###.', '..#..'] };
const draw = (ctx, pat, x, y, col) => pat.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') px(ctx, x + i, y + j, col); }));

export const MARKS = {
  signpost(b, season) { // a post with one small board per arrow: [dir, symbol]
    const S = SEASONS[season], arrows = b.opts.arrows || [], n = arrows.length, W = 26, over = 6 + n * 8;
    const [c, ctx] = makeCanvas(W, T + over);
    const H = T + over;
    rect(ctx, 12, 4, 3, H - 6, INK); rect(ctx, 13, 5, 1, H - 8, M.wood[3]);
    ellipse(ctx, 13, H - 3, 4, 1, 'rgba(0,0,0,0.35)');
    arrows.forEach(([dir, sym], i) => {
      const y = 2 + i * 8, left = dir === 'left';
      const bx = dir === 'left' ? 1 : dir === 'right' ? 6 : 3;
      rect(ctx, bx, y, 20, 8, INK); rect(ctx, bx + 1, y + 1, 18, 6, M.wood[2]); rect(ctx, bx + 1, y + 1, 18, 1, M.wood[4]);
      if (left) { px(ctx, bx - 1, y + 3, INK); px(ctx, bx - 1, y + 4, INK); } else if (dir === 'right') { px(ctx, bx + 20, y + 3, INK); px(ctx, bx + 20, y + 4, INK); }
      const a = ARROW[dir], ax = left ? bx + 2 : dir === 'right' ? bx + 15 : bx + 14, ay = y + (a.length === 3 ? 2 : 1);
      draw(ctx, a, ax, ay, '#ffd683');
      draw(ctx, GLYPH[sym] || GLYPH.tree, left ? bx + 8 : bx + 4, y + 1, '#f2ead2');
      if (S.snow) rect(ctx, bx, y, 20, 1, S.snow);
    });
    return { canvas: c, over, ox: 5 };
  },
};

export function makeMarks(scene) {
  if (scene.textures.exists('mk-brambles')) return;
  { // brambles: a thorny tangle, dark red-brown canes with thorns and a few dry leaves
    const [c, ctx] = makeCanvas(22, 26);
    ellipse(ctx, 11, 22, 10, 3, 'rgba(0,0,0,0.4)');
    for (let i = 0; i < 13; i++) {
      const x0 = 2 + hash(i, 1, 7) * 18, x1 = 2 + hash(i, 2, 7) * 18, y0 = 23, y1 = 2 + hash(i, 3, 7) * 12;
      line(ctx, x0 - 1, y0, x1 - 1, y1, INK); line(ctx, x0, y0, x1, y1, i % 2 ? '#8a3a34' : '#a0523a'); line(ctx, x0 + 1, y0, x1 + 1, y1, INK);
      for (let k = 1; k < 4; k++) { const t = k / 4; px(ctx, x0 + (x1 - x0) * t + 2, y0 + (y1 - y0) * t, '#f0dcb0'); px(ctx, x0 + (x1 - x0) * t - 2, y0 + (y1 - y0) * t + 1, '#f0dcb0'); }
    }
    for (let i = 0; i < 8; i++) px(ctx, 2 + hash(i, 4, 7) * 18, 4 + hash(i, 5, 7) * 16, ['#7a5a2a', '#8f3d3c', '#5c6a3a'][i % 3]);
    addTex(scene, 'mk-brambles', c);
  }
  { // roots: thick gnarled roots arching out of the ground across the tile
    const [c, ctx] = makeCanvas(20, 18);
    ellipse(ctx, 10, 14, 9, 3, 'rgba(0,0,0,0.35)');
    for (const [x0, y0, x1, y1, w] of [[0, 14, 9, 4, 3], [9, 4, 19, 13, 3], [3, 15, 14, 8, 2], [12, 15, 18, 9, 2], [6, 6, 2, 14, 2]]) {
      for (let k = -1; k <= w; k++) line(ctx, x0, y0 + k, x1, y1 + k, k === -1 || k === w ? INK : k === 0 ? '#7a6048' : '#4e3a2c');
    }
    px(ctx, 9, 3, '#8fa060'); px(ctx, 10, 3, '#6f8048');
    addTex(scene, 'mk-roots', c);
  }
  { // the warded stone: a squat standing stone with a carved sigil (the sigil glows on its own layer)
    const [c, ctx] = makeCanvas(18, 22);
    ellipse(ctx, 9, 19, 8, 2, 'rgba(0,0,0,0.4)');
    ellipse(ctx, 9, 12, 7, 9, INK); ellipse(ctx, 9, 12, 6, 8, M.stone[2]); ellipse(ctx, 7, 9, 3, 5, M.stone[3]); rect(ctx, 3, 15, 12, 4, M.stone[1]);
    for (let i = 0; i < 5; i++) px(ctx, 4 + hash(i, 1, 3) * 10, 6 + hash(i, 2, 3) * 12, '#5a6a50');
    addTex(scene, 'mk-stone', c);
    const [g, gx] = makeCanvas(18, 22); // the sigil: a circle with a cross, carved
    const col = '#b8f0ff';
    for (let a = 0; a < 16; a++) px(gx, 9 + Math.round(Math.cos(a / 16 * Math.PI * 2) * 3), 12 + Math.round(Math.sin(a / 16 * Math.PI * 2) * 3), col);
    line(gx, 9, 8, 9, 16, col); line(gx, 6, 12, 12, 12, col);
    addTex(scene, 'mk-sigil', g);
  }
  { // the Minor's glint in the grass: a small flat card edge catching light
    const [c, ctx] = makeCanvas(11, 11);
    const g = '#fff6cf';
    px(ctx, 5, 5, '#ffffff'); for (let k = 1; k < 4; k++) { const a = k < 2 ? g : '#c9d8ff'; px(ctx, 5 - k, 5, a); px(ctx, 5 + k, 5, a); px(ctx, 5, 5 - k, a); px(ctx, 5, 5 + k, a); }
    px(ctx, 4, 4, g); px(ctx, 6, 6, g); px(ctx, 4, 6, g); px(ctx, 6, 4, g);
    addTex(scene, 'mk-glint', c);
  }
  { // a wisp of fog: a soft pale smear
    const [c, ctx] = makeCanvas(64, 28);
    const gr = ctx.createRadialGradient(32, 14, 1, 32, 14, 31); gr.addColorStop(0, 'rgba(225,230,240,0.95)'); gr.addColorStop(0.55, 'rgba(210,215,232,0.45)'); gr.addColorStop(1, 'rgba(200,205,225,0)');
    ctx.setTransform(1, 0, 0, 0.44, 0, 7.8); ctx.fillStyle = gr; ctx.fillRect(0, 0, 64, 64);
    addTex(scene, 'mk-fog', c, true);
  }
  { // a streak of wind (the gust of Air)
    const [c, ctx] = makeCanvas(18, 5);
    line(ctx, 0, 3, 13, 3, 'rgba(230,240,255,0.8)'); line(ctx, 10, 2, 15, 1, 'rgba(230,240,255,0.8)'); px(ctx, 16, 1, 'rgba(230,240,255,0.6)'); px(ctx, 17, 2, 'rgba(230,240,255,0.4)');
    addTex(scene, 'mk-gust', c);
  }
  { // fire bursting from the brambles: 4 frames of 16x20
    const [c, ctx] = makeCanvas(64, 20);
    const F = M.fire;
    for (let f = 0; f < 4; f++) {
      const o = f * 16, h = [14, 18, 16, 9][f];
      for (let i = 0; i < 5; i++) {
        const x = o + 2 + i * 3, hh = Math.max(3, h - (hash(i, f, 5) * 6 | 0));
        ellipse(ctx, x + 1, 19 - hh / 2, 2, hh / 2, F[1]); ellipse(ctx, x + 1, 19 - hh / 3, 1, hh / 3, F[2]); px(ctx, x + 1, 18, F[3]);
      }
      if (f === 3) for (let i = 0; i < 6; i++) px(ctx, o + 2 + hash(i, 9, 5) * 12, 6 + hash(i, 8, 5) * 12, '#4a4048');
    }
    addSheet(scene, 'mk-burn', c, 16, 20);
    if (!scene.anims.exists('mk-burn')) scene.anims.create({ key: 'mk-burn', frames: [0, 1, 2, 1, 2, 3].map((f) => ({ key: 'mk-burn', frame: f })), frameRate: 9 });
  }
}
