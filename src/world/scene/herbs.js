// The real herbs growing on this map (spots: src/data/world/herbs.js, sprites: art/herbs.js). They are
// scenery she may notice: standing on or beside one, the action button says «Guarda» over its name (or
// «Una pianta» until she has looked at it) and calls the service herb.look (glue/herbs.js), which writes
// it in the herbarium. Plants she has not looked at yet give off, now and then, a faint pale mote that
// drifts up (not the card's golden star, not the Minors' turning glint, not the guide's lights).
// Never solid; in the prologue and on the arrival road they are drawn but not usable.
import Phaser from 'phaser';
import { state } from '../../core/state.js';
import { test as cond } from '../../core/cond.js';
import { call, has } from '../../core/services.js';
import { hash } from '../art/px.js';
import { makeHerbs } from '../art/herbs.js';
import { HERB } from '../../data/herbs/base.js';
import { HERB_SPOTS } from '../../data/world/herbs.js';

const T = 16, ADD = Phaser.BlendModes.ADD;
export const HERBS_OFF = ['p.session', 'p.road', 'c1.malva']; // drawn, not usable
export const GLIMMER = { range: 7, period: 5200, rise: 7 };
const NEAR = [[0, 0], [0, 1], [0, -1], [-1, 0], [1, 0]];

export class Herbs {
  constructor(scene, map) {
    Object.assign(this, { scene, map, nextSway: 0 });
    const here = map.elsewhere ? [] : HERB_SPOTS.filter((s) => s.map === map.id && HERB[s.id]);
    if (here.length) makeHerbs(scene);
    this.list = here.map((s, i) => {
      const bx = s.x * T + 8, by = s.y * T + T, flip = hash(s.x, s.y, 61) > 0.5;
      scene.add.image(bx + 1, by - 2, 'fx-shadow').setScale(0.8, 0.9).setDepth(2).setAlpha(0.7);
      const img = scene.add.sprite(bx, by, `herb-${s.id}`, 0).setOrigin(0.5, 1).setFlipX(flip).setDepth(by - 1);
      const top = by - img.height + 4;
      const halo = scene.add.image(bx, by - img.height / 2, 'fx-glow-cool').setBlendMode(ADD).setDepth(9001).setScale(0.32).setTint(0xdff2c4).setAlpha(0);
      const mote = scene.add.image(bx, top, 'fx-flake1').setDepth(9003).setTint(0xf2f6dc).setAlpha(0);
      return { ...s, img, halo, mote, top, phase: hash(s.x, s.y, 62) * GLIMMER.period, i };
    });
  }

  seen(id) { return !!state.herbs?.[id]; }
  usable() { return this.list.length > 0 && !cond({ stepIn: HERBS_OFF }) && has('herb.look'); }
  at(x, y) { return this.list.find((h) => h.x === x && h.y === y) || null; }
  entry(h) { return { type: 'herb', x: h.x, y: h.y, label: this.seen(h.id) ? HERB[h.id].name : 'Una pianta', verb: 'Guarda', h }; }
  usableAt(x, y) { const h = this.usable() && this.at(x, y); return h ? [this.entry(h)] : []; }
  // the plant on her tile, in front of her, or beside her (things.current asks after everything else)
  near(p) {
    if (!this.usable()) return null;
    const [fx, fy] = p.facing();
    const h = this.at(p.tx, p.ty) || this.at(fx, fy) || NEAR.map(([dx, dy]) => this.at(p.tx + dx, p.ty + dy)).find(Boolean);
    return h ? this.entry(h) : null;
  }
  async use(u) {
    if (!has('herb.look')) return;
    this.scene.tweens.add({ targets: u.h.img, scaleY: 0.94, duration: 140, yoyo: true });
    await call('herb.look', u.h.id);
  }

  update(time) {
    if (!this.list.length) return;
    // a gentle sway: now and then one plant leans and comes back
    if (time > this.nextSway) {
      this.nextSway = time + 260;
      const h = this.list[(Math.random() * this.list.length) | 0];
      if (h.img.frame.name !== 1) { h.img.setFrame(1); this.scene.time.delayedCall(700, () => h.img.active && h.img.setFrame(0)); }
    }
    const p = this.scene.player, on = this.usable();
    for (const h of this.list) {
      const d = Math.hypot(h.x - p.tx, h.y - p.ty);
      if (!on || this.seen(h.id) || d > GLIMMER.range) { if (h.mote.alpha || h.halo.alpha) { h.mote.setAlpha(0); h.halo.setAlpha(0); } continue; }
      const t = ((time + h.phase) % GLIMMER.period) / GLIMMER.period; // 0..1, once per period
      const fade = 1 - d / (GLIMMER.range + 1);
      h.halo.setAlpha((0.05 + 0.09 * Math.sin(t * Math.PI)) * fade);
      // a single pale mote rises from the top of the plant in the first half of the period
      const m = t < 0.5 ? t / 0.5 : 0;
      h.mote.setPosition(h.img.x + (h.i % 2 ? 1 : -1) * Math.round(m * 2), h.top - m * GLIMMER.rise).setAlpha(m ? Math.sin(m * Math.PI) * 0.85 * fade : 0);
    }
  }
}
