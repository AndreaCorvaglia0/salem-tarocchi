// Light and small effects: the soft brushes that cut light out of the night, glows, the glint of a
// hidden card, flames, snowflakes, petals and leaves, smoke, shadows, the constable's "!", the
// stun stars, and the little pictures of doors that are not part of a building (gate, trapdoor,
// stairs, door mat, an iron gate).
import { M, INK } from './palette.js';
import { makeCanvas, radial, rect, px, ellipse, line, addTex, addSheet } from './px.js';

export function makeFx(scene) {
  if (scene.textures.exists('fx-light')) return;
  addTex(scene, 'fx-light', radial(128, [[0, 'rgba(255,255,255,1)'], [0.45, 'rgba(255,255,255,0.85)'], [0.8, 'rgba(255,255,255,0.25)'], [1, 'rgba(255,255,255,0)']]), true);
  addTex(scene, 'fx-sight', radial(256, [[0, 'rgba(255,255,255,1)'], [0.55, 'rgba(255,255,255,1)'], [0.8, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]), true);
  addTex(scene, 'fx-glow', radial(64, [[0, 'rgba(255,200,110,0.9)'], [0.35, 'rgba(255,170,80,0.35)'], [1, 'rgba(255,150,60,0)']]), true);
  addTex(scene, 'fx-glow-violet', radial(64, [[0, 'rgba(190,140,255,0.8)'], [0.4, 'rgba(150,100,230,0.3)'], [1, 'rgba(120,80,200,0)']]), true);
  addTex(scene, 'fx-glow-cool', radial(64, [[0, 'rgba(220,235,255,0.9)'], [0.4, 'rgba(180,200,255,0.3)'], [1, 'rgba(160,180,255,0)']]), true);
  { const [c, ctx] = makeCanvas(14, 6); ellipse(ctx, 7, 3, 6, 2, 'rgba(5,4,12,0.45)'); addTex(scene, 'fx-shadow', c); }
  { const [c, ctx] = makeCanvas(9, 9); // the glint: a four-pointed star
    const g = '#fff6cf'; px(ctx, 4, 4, '#ffffff'); for (let k = 1; k < 5; k++) { const a = k < 3 ? g : '#d9b85a'; px(ctx, 4 - k, 4, a); px(ctx, 4 + k, 4, a); px(ctx, 4, 4 - k, a); px(ctx, 4, 4 + k, a); }
    px(ctx, 3, 3, g); px(ctx, 5, 5, g); px(ctx, 3, 5, g); px(ctx, 5, 3, g); addTex(scene, 'fx-glint', c); }
  { const [c, ctx] = makeCanvas(24, 10); // flame, 3 frames of 8x10
    const F = M.fire;
    [[3, 1], [4, 0], [2, 2]].forEach(([tip, lean], i) => {
      const o = i * 8;
      ellipse(ctx, o + 4, 7, 3, 2, F[1]); ellipse(ctx, o + 4, 6, 2, 3, F[2]); rect(ctx, o + tip, 1 + lean, 1, 3, F[2]); ellipse(ctx, o + 4, 7, 1, 1, F[3]); px(ctx, o + 4, 7, F[4]);
    });
    addSheet(scene, 'fx-flame', c, 8, 10);
    if (!scene.anims.exists('flame')) scene.anims.create({ key: 'flame', frames: [0, 1, 2, 1].map((f) => ({ key: 'fx-flame', frame: f })), frameRate: 8, repeat: -1 });
  }
  { const [c, ctx] = makeCanvas(2, 2); rect(ctx, 0, 0, 2, 2, '#f2f6ff'); addTex(scene, 'fx-flake', c); }
  { const [c, ctx] = makeCanvas(1, 1); px(ctx, 0, 0, '#f2f6ff'); addTex(scene, 'fx-flake1', c); }
  { const [c, ctx] = makeCanvas(3, 2); rect(ctx, 0, 0, 3, 1, '#e8b0cf'); px(ctx, 1, 1, '#c98aae'); addTex(scene, 'fx-petal', c); }
  { const [c, ctx] = makeCanvas(3, 3); px(ctx, 1, 0, '#b5662e'); rect(ctx, 0, 1, 3, 1, '#d99a45'); px(ctx, 1, 2, '#8a4423'); addTex(scene, 'fx-leaf', c); }
  { const [c, ctx] = makeCanvas(2, 2); rect(ctx, 0, 0, 2, 2, '#c9e88a'); addTex(scene, 'fx-firefly', c); }
  { const [c, ctx] = makeCanvas(6, 6); ellipse(ctx, 3, 3, 2, 2, 'rgba(160,160,180,0.55)'); addTex(scene, 'fx-smoke', c); }
  { // a fog bank: a soft wide blob
    const [c, ctx] = makeCanvas(96, 40);
    const g = ctx.createRadialGradient(48, 20, 2, 48, 20, 46); g.addColorStop(0, 'rgba(200,205,220,0.9)'); g.addColorStop(0.6, 'rgba(190,195,215,0.35)'); g.addColorStop(1, 'rgba(180,185,210,0)');
    ctx.setTransform(1, 0, 0, 0.42, 0, 11.6); ctx.fillStyle = g; ctx.fillRect(0, 0, 96, 96); addTex(scene, 'fx-fog', c, true); }
  { const [c, ctx] = makeCanvas(7, 11); rect(ctx, 0, 0, 7, 11, INK); rect(ctx, 1, 1, 5, 9, '#ffd683'); rect(ctx, 3, 2, 1, 4, INK); px(ctx, 3, 8, INK); addTex(scene, 'fx-alert', c); }
  { const [c, ctx] = makeCanvas(7, 11); rect(ctx, 0, 0, 7, 11, INK); rect(ctx, 1, 1, 5, 9, '#e9e2c9'); rect(ctx, 2, 2, 3, 1, INK); px(ctx, 4, 3, INK); px(ctx, 3, 4, INK); px(ctx, 3, 5, INK); px(ctx, 3, 8, INK); addTex(scene, 'fx-query', c); }
  { const [c, ctx] = makeCanvas(13, 5); for (const x of [1, 6, 11]) { px(ctx, x, 2, '#fff1a8'); px(ctx, x - 1, 2, '#f2c94c'); px(ctx, x + 1, 2, '#f2c94c'); px(ctx, x, 1, '#f2c94c'); px(ctx, x, 3, '#f2c94c'); } addTex(scene, 'fx-stars', c); }
  // doors that are not part of a building
  { const [c, ctx] = makeCanvas(16, 22); // a wooden gate in a fence
    for (const x of [0, 13]) { rect(ctx, x, 2, 3, 20, INK); rect(ctx, x + 1, 3, 1, 18, M.wood[3]); }
    rect(ctx, 2, 8, 12, 2, INK); rect(ctx, 2, 15, 12, 2, INK); for (let x = 3; x < 13; x += 3) { rect(ctx, x, 6, 2, 15, INK); rect(ctx, x, 7, 1, 13, M.wood[2]); }
    line(ctx, 3, 18, 12, 9, M.wood[1]); addTex(scene, 'door-gate', c); }
  { const [c, ctx] = makeCanvas(16, 16); rect(ctx, 1, 2, 14, 12, INK); rect(ctx, 2, 3, 12, 10, M.wood[1]); for (let x = 4; x < 14; x += 3) rect(ctx, x, 3, 1, 10, M.wood[0]); rect(ctx, 2, 7, 12, 1, M.metal[1]); ellipse(ctx, 8, 10, 1, 1, M.metal[3]); addTex(scene, 'door-trapdoor', c); }
  { const [c, ctx] = makeCanvas(16, 16); for (let i = 0; i < 4; i++) { rect(ctx, 0, i * 4, 16, 4, '#05040a'); rect(ctx, 1 + i, i * 4 + 1, 14 - i * 2, 2, M.stone[3 - Math.min(3, i)]); } addTex(scene, 'door-stairs', c); }
  { const [c, ctx] = makeCanvas(16, 16); rect(ctx, 0, 0, 16, 16, '#0a0812'); rect(ctx, 2, 6, 12, 8, M.cloth.ochre[0]); rect(ctx, 3, 7, 10, 6, M.cloth.ochre[1]); addTex(scene, 'door-mat', c); }
  { const [c, ctx] = makeCanvas(16, 24); rect(ctx, 0, 6, 16, 2, M.metal[0]); for (let x = 1; x < 16; x += 3) { rect(ctx, x, 4, 2, 20, M.metal[0]); rect(ctx, x, 5, 1, 18, M.metal[2]); px(ctx, x, 4, M.metal[3]); } addTex(scene, 'gate-bars', c); }
}
