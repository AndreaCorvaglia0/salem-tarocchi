// Art for the forest and the depths, and the little life of the world: the animal den, ivy on a
// cellar wall, a stone arch, the mill wheel (turns), the meetinghouse bell (swings), crows and an
// owl, eyes that blink in the dark, will-o'-the-wisps, the shaft of moonlight down the well.
// Block painters (b, season) -> { canvas, over } like props.js; makeWild(scene) registers the rest.
import { SEASONS, M, INK } from './palette.js';
import { makeCanvas, hash, rect, px, line, ellipse, addTex, addSheet } from './px.js';

const T = 16;

export const WILD = {
  den(b, season) { // a low earth mound under roots, a dark hole, scratch marks
    const S = SEASONS[season], W = b.w * T, H = b.h * T + 10, [c, ctx] = makeCanvas(W, H);
    ellipse(ctx, W / 2, H - 7, W / 2 - 1, 9, INK);
    ellipse(ctx, W / 2, H - 7, W / 2 - 2, 8, S.soil[1]);
    ellipse(ctx, W / 2 - 3, H - 11, W / 2 - 6, 4, S.ground[1]);
    ellipse(ctx, W / 2, H - 5, 5, 4, '#07050a'); rect(ctx, W / 2 - 5, H - 5, 11, 4, '#07050a');
    for (const [x0, y0, x1, y1] of [[3, H - 13, W / 2 - 4, H - 8], [W - 4, H - 12, W / 2 + 5, H - 7], [W / 2, H - 16, W / 2 + 2, H - 9]]) { line(ctx, x0, y0, x1, y1, S.bark[0]); line(ctx, x0, y0 - 1, x1, y1 - 1, S.bark[1]); }
    for (let i = 0; i < 4; i++) px(ctx, W / 2 - 6 + i * 4, H - 2, S.soil[0]);
    if (S.snow) ellipse(ctx, W / 2 - 2, H - 15, W / 2 - 6, 1, S.snow);
    if (S.flower) px(ctx, 4, H - 9, S.flower[0]);
    return { canvas: c, over: 10 };
  },
  ivy(b) { // ivy over a stone wall (put it in the wall's face row)
    const W = b.w * T, H = b.h * T, [c, ctx] = makeCanvas(W, H);
    for (let i = 0; i < W * 2; i++) {
      const x = Math.floor(hash(i, 1, 41) * W), y = Math.floor(Math.pow(hash(i, 2, 41), 0.7) * (H - 2));
      line(ctx, x, 0, x + (hash(i, 3, 41) > 0.5 ? 1 : -1), y, '#2a3a22');
      px(ctx, x, y, ['#2f5a30', '#3f7a3c', '#5c9a4c'][i % 3]); px(ctx, x + 1, y, '#2f5a30'); px(ctx, x, y + 1, '#24462a');
    }
    return { canvas: c, over: 0 };
  },
};

// A stone arch over a passage `w` tiles wide (drawn over the player: she walks under it).
export function archArt(w) {
  const W = w * T + 8, H = 30, [c, ctx] = makeCanvas(W, H);
  const cx = W / 2, rx = W / 2 - 1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const inner = y > 8 && Math.abs(x - cx) < rx - 5 && (y > 16 || ((x - cx) / (rx - 5)) ** 2 + ((y - 16) / 8) ** 2 < 1);
    const outer = Math.abs(x - cx) <= rx && (y > 12 || ((x - cx) / rx) ** 2 + ((y - 12) / 12) ** 2 <= 1);
    if (!outer || inner) continue;
    const ring = !inner && (y <= 16 && ((x - cx) / (rx - 5)) ** 2 + ((y - 16) / 8) ** 2 < 1.5);
    const edge = !(Math.abs(x + 1 - cx) <= rx) || !(Math.abs(x - 1 - cx) <= rx) || y === 0;
    const block = (Math.floor(Math.atan2(y - 16, x - cx) * 3) + (y > 16 ? Math.floor(y / 4) : 0)) % 2;
    px(ctx, x, y, edge ? INK : ring ? M.stone[block ? 3 : 2] : M.stone[(Math.floor(y / 4) + Math.floor((x + (Math.floor(y / 4) % 2) * 3) / 6)) % 2 ? 1 : 2]);
  }
  return c;
}

export function makeWild(scene) {
  if (scene.textures.exists('mill-wheel')) return;
  { // the mill wheel, 4 frames turning
    const [c, ctx] = makeCanvas(26 * 4, 30);
    for (let f = 0; f < 4; f++) {
      const ox = f * 26, cx = ox + 13, cy = 15;
      ellipse(ctx, cx, cy, 12, 14, INK); ellipse(ctx, cx, cy, 10, 12, M.wood[1]); ellipse(ctx, cx, cy, 7, 9, '#0c0a10');
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + (f / 4) * (Math.PI / 4); line(ctx, cx, cy, Math.round(cx + Math.cos(a) * 11), Math.round(cy + Math.sin(a) * 13), k % 2 ? M.wood[3] : M.wood[2]); px(ctx, Math.round(cx + Math.cos(a) * 11), Math.round(cy + Math.sin(a) * 13), M.wood[4]); }
      ellipse(ctx, cx, cy, 2, 2, M.metal[2]);
    }
    addSheet(scene, 'mill-wheel', c, 26, 30);
    if (!scene.anims.exists('mill-wheel')) scene.anims.create({ key: 'mill-wheel', frames: [0, 1, 2, 3].map((f) => ({ key: 'mill-wheel', frame: f })), frameRate: 5, repeat: -1 });
  }
  { const [c, ctx] = makeCanvas(9, 9); // the bell
    rect(ctx, 3, 0, 3, 2, INK); ellipse(ctx, 4, 4, 3, 3, INK); rect(ctx, 0, 5, 9, 3, INK);
    ellipse(ctx, 4, 4, 2, 2, '#b8913a'); rect(ctx, 1, 5, 7, 2, '#d9b25a'); px(ctx, 3, 3, '#f2d88a'); px(ctx, 4, 8, INK);
    addTex(scene, 'fx-bell', c); }
  { const [c, ctx] = makeCanvas(24, 8); // a crow: sitting, wings up, wings down
    const body = (o) => { ellipse(ctx, o + 4, 5, 2, 2, '#0a0910'); px(ctx, o + 2, 3, '#0a0910'); px(ctx, o + 1, 3, '#3a3020'); px(ctx, o + 2, 2, '#0a0910'); px(ctx, o + 7, 6, '#0a0910'); px(ctx, o + 2, 3, '#0a0910'); px(ctx, o + 3, 2, '#c9c4bb'); };
    body(0); line(ctx, 3, 7, 3, 7, '#3a3020'); line(ctx, 5, 7, 5, 7, '#3a3020');
    body(8); line(ctx, 11, 4, 9, 0, '#0a0910'); line(ctx, 13, 4, 15, 0, '#0a0910');
    body(16); line(ctx, 19, 5, 16, 7, '#0a0910'); line(ctx, 21, 5, 23, 7, '#0a0910');
    addSheet(scene, 'fx-crow', c, 8, 8);
    if (!scene.anims.exists('crow-fly')) scene.anims.create({ key: 'crow-fly', frames: [1, 2].map((f) => ({ key: 'fx-crow', frame: f })), frameRate: 8, repeat: -1 });
  }
  { const [c, ctx] = makeCanvas(20, 12); // the owl: eyes open, eyes shut
    for (const o of [0, 10]) { ellipse(ctx, o + 5, 6, 4, 5, INK); ellipse(ctx, o + 5, 6, 3, 4, '#5a4632'); px(ctx, o + 2, 1, INK); px(ctx, o + 8, 1, INK); px(ctx, o + 5, 7, '#c9a55a'); rect(ctx, o + 4, 9, 3, 1, '#8a7356'); }
    px(ctx, 3, 5, '#f2d24a'); px(ctx, 7, 5, '#f2d24a'); px(ctx, 13, 5, '#3a2c20'); px(ctx, 17, 5, '#3a2c20');
    addSheet(scene, 'fx-owl', c, 10, 12); }
  { const [c, ctx] = makeCanvas(14, 6); // eyes in the dark: open, half, shut
    rect(ctx, 1, 1, 3, 2, '#f2e27a'); rect(ctx, 9, 1, 3, 2, '#f2e27a'); px(ctx, 2, 1, '#fffbe0'); px(ctx, 10, 1, '#fffbe0');
    rect(ctx, 1, 4, 3, 1, '#c9b84a'); rect(ctx, 9, 4, 3, 1, '#c9b84a');
    addSheet(scene, 'fx-eyes', c, 14, 3); }
  { const [c, ctx] = makeCanvas(32, 64); // the moonlight down the well: a soft shaft
    const g = ctx.createLinearGradient(0, 0, 0, 64); g.addColorStop(0, 'rgba(200,215,255,0)'); g.addColorStop(0.35, 'rgba(200,215,255,0.35)'); g.addColorStop(1, 'rgba(200,215,255,0.55)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(22, 0); ctx.lineTo(30, 64); ctx.lineTo(2, 64); ctx.closePath(); ctx.fill();
    addTex(scene, 'fx-moonbeam', c, true); }
}
