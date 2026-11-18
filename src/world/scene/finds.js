// Stones and figures of the sibyl lying on this map (spots: src/data/world/finds.js, sprites: art/finds.js).
// They are seen only from close: a small thing on the ground and, within GLINT.range tiles, a faint pale
// twinkle now and then (never the golden sparkle of a tarot card, which stays the thing that shines).
// Standing on or beside one, the action button says «Raccogli» and calls the service find.take
// (glue/collect.js), which puts it in the grimoire without stopping the game. Never solid.
import { state } from '../../core/state.js';
import { test as cond } from '../../core/cond.js';
import { call, has } from '../../core/services.js';
import { hash } from '../art/px.js';
import { makeFinds } from '../art/finds.js';
import { STONE_LIST, STONE } from '../../data/stones.js';
import { FIND_SPOTS } from '../../data/world/finds.js';
import { HERBS_OFF } from './herbs.js';

const T = 16;
export const GLINT = { range: 3, period: 3400 };
const NEAR = [[0, 0], [0, 1], [0, -1], [-1, 0], [1, 0]];
export const spotTaken = (id, s = state) => !!s.world?.once?.[`find.${id}`];
const texOf = (sp) => (sp.stone ? `find-stone-${sp.stone}` : sp.sibyl.length > 1 ? `find-bundle${Math.min(3, sp.sibyl.length)}` : 'find-card');

export class Finds {
  constructor(scene, map) {
    Object.assign(this, { scene, map });
    const here = map.elsewhere ? [] : FIND_SPOTS.filter((s) => s.map === map.id && (s.stone ? STONE[s.stone] : s.sibyl?.length));
    if (here.length) makeFinds(scene, STONE_LIST);
    this.list = here.map((s) => {
      const bx = s.x * T + 8, by = s.y * T + 12;
      const img = scene.add.image(bx, by, texOf(s)).setOrigin(0.5, 1).setDepth(by - 6).setFlipX(hash(s.x, s.y, 71) > 0.5).setVisible(false);
      const tw = scene.add.image(bx - 2, by - 6, 'find-twinkle').setDepth(9003).setAlpha(0);
      return { ...s, img, tw, phase: hash(s.x, s.y, 72) * GLINT.period };
    });
    this.refresh();
  }

  active(f) { return !spotTaken(f.id) && cond(f.when ?? true); }
  usable() { return this.list.length > 0 && !cond({ stepIn: HERBS_OFF }) && has('find.take'); }
  refresh() { for (const f of this.list) { const on = this.active(f); f.img.setVisible(on); if (!on) f.tw.setAlpha(0); } }
  at(x, y) { return this.list.find((f) => f.x === x && f.y === y && this.active(f)) || null; }
  entry(f) { return { type: 'find', x: f.x, y: f.y, label: 'Qualcosa per terra', verb: 'Raccogli', f }; }
  usableAt(x, y) { const f = this.usable() && this.at(x, y); return f ? [this.entry(f)] : []; }
  near(p) {
    if (!this.usable()) return null;
    const [fx, fy] = p.facing();
    const f = this.at(p.tx, p.ty) || this.at(fx, fy) || NEAR.map(([dx, dy]) => this.at(p.tx + dx, p.ty + dy)).find(Boolean);
    return f ? this.entry(f) : null;
  }
  async use(u) {
    const f = u.f;
    if (!has('find.take') || !this.active(f)) return;
    // where it lies on the screen: the little thing flies from there to the grimoire
    const cam = this.scene.cameras.main, wv = cam.worldView, z = cam.zoom;
    const from = { x: (f.img.x - wv.x) * z, y: (f.img.y - 6 - wv.y) * z };
    f.img.setVisible(false); f.tw.setAlpha(0);
    await call('find.take', f.id, { from });
    this.refresh();
  }

  update(time) {
    if (!this.list.length) return;
    const p = this.scene.player, on = this.usable();
    for (const f of this.list) {
      const d = Math.hypot(f.x - p.tx, f.y - p.ty);
      // from afar it is only a dull little thing on the ground; close up it is itself
      f.img.setAlpha(d <= GLINT.range ? 1 : Math.max(0.35, 1 - (d - GLINT.range) * 0.22));
      if (!on || d > GLINT.range || !f.img.visible) { if (f.tw.alpha) f.tw.setAlpha(0); continue; }
      const t = ((time + f.phase) % GLINT.period) / GLINT.period;
      // a short twinkle in the first quarter of the period, fainter with distance
      const k = t < 0.25 ? Math.sin((t / 0.25) * Math.PI) : 0;
      f.tw.setAlpha(k * (1 - d / (GLINT.range + 2.5)));
    }
  }
}
