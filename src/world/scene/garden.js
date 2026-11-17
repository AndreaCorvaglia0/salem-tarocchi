// The garden by the cottage door (docs/DESIGN.md "L'orto"): once Ortica has given it, four small soil beds
// on the 2x2 tiles whose bottom left is the anchor `village.orto`, each with the herb planted there
// drawn from its sprite, smaller while it grows. Scenery only: the beds are not solid, and the anchor is a
// usable prop of the CAST («L'orto», «Guarda»: glue/garden.js) that opens the same screen as the threshold.
import { state } from '../../core/state.js';
import { on } from '../../core/bus.js';
import { makeHerbs } from '../art/herbs.js';
import { makeCanvas, hash } from '../art/px.js';
import { GARDEN } from '../../data/garden.js';

const T = 16;
const SOIL = { leggera: ['#8a7050', '#a88a64'], ricca: ['#5e3a20', '#7a4e2c'], fresca: ['#43291a', '#5a3824'] };

// one bed: 14 x 10 px, a wooden edge and a soil top with a few lumps (light soil shows pebbles)
function bedTexture(scene, terra) {
  const key = `garden-bed-${terra}`;
  if (scene.textures.exists(key)) return key;
  const [dark, mid] = SOIL[terra] || SOIL.ricca;
  const [c, ctx] = makeCanvas(14, 10);
  ctx.fillStyle = '#2a1a0e'; ctx.fillRect(0, 1, 14, 9);
  ctx.fillStyle = '#6b4626'; ctx.fillRect(0, 0, 14, 2); ctx.fillRect(0, 8, 14, 2); ctx.fillRect(0, 0, 1, 10); ctx.fillRect(13, 0, 1, 10);
  ctx.fillStyle = '#8a5e34'; ctx.fillRect(0, 0, 14, 1);
  ctx.fillStyle = mid; ctx.fillRect(1, 2, 12, 6);
  ctx.fillStyle = dark;
  for (let i = 0; i < 10; i++) ctx.fillRect(1 + Math.floor(hash(i, 3, 71) * 12), 2 + Math.floor(hash(i, 5, 72) * 6), 1, 1);
  if (terra === 'leggera') { ctx.fillStyle = '#d9cbb0'; for (let i = 0; i < 5; i++) ctx.fillRect(1 + Math.floor(hash(i, 9, 73) * 12), 2 + Math.floor(hash(i, 7, 74) * 6), 1, 1); }
  scene.textures.addCanvas(key, c);
  return key;
}

export class GardenBeds {
  constructor(scene, map) {
    Object.assign(this, { scene, map, parts: [] });
    this.at = map.id === 'village' ? map.anchors['village.orto'] : null;
    if (!this.at) return;
    this.off = ['garden', 'flag'].map((e) => on(e, () => this.draw()));
    scene.events.once('shutdown', () => { for (const f of this.off) f(); });
    this.draw();
  }
  draw() {
    const sc = this.scene;
    if (!sc.sys) return;
    for (const p of this.parts) p.destroy();
    this.parts = [];
    if (!this.at || !state.garden?.unlocked) return;
    makeHerbs(sc);
    const x0 = this.at.x * T, y0 = (this.at.y - 1) * T;
    (state.garden.beds || []).slice(0, 4).forEach((b, i) => {
      const bx = x0 + (i % 2) * 16 + 8, by = y0 + Math.floor(i / 2) * 16 + 12;
      const bed = sc.add.image(bx, by, bedTexture(sc, b?.terra || 'ricca')).setOrigin(0.5, 0.5).setDepth(by - 6);
      this.parts.push(bed);
      const P = GARDEN[b?.herb];
      if (!P) return;
      const grow = Math.min(1, b.step / P.steps);
      const img = sc.add.sprite(bx, by + 2, `herb-${b.herb}`, 0).setOrigin(0.5, 1).setDepth(by + 1).setScale(b.step < 2 ? 0.45 : 0.6 + 0.4 * grow);
      this.parts.push(img);
    });
  }
}
