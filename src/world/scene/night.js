// The night layer: a dark tint over what the camera sees, with light cut out of it (windows, lamps,
// fires, the constables' lanterns and the player's own glow). In tall grass and dark places the
// night closes in: only a soft circle around the player stays clear ("vista corta"); the fire
// power widens it, the far sight (flag sight.far) widens it again.
import { NIGHT } from '../art/palette.js';
import { state } from '../../core/state.js';

export const SIGHT = { base: 30, fire: 52, far: 74 };
export const sightRadius = (s = state) => (s.flags['sight.far'] ? SIGHT.far : s.powers.fire ? SIGHT.fire : SIGHT.base);

export class Night {
  constructor(scene, map, lights) {
    Object.assign(this, { scene, map, lights, short: 0, extra: [] });
    this.base = map.inside ? NIGHT.inside : NIGHT.outside;
    this.brush = scene.make.image({ key: 'fx-light', add: false });
    this.sight = scene.make.image({ key: 'fx-sight', add: false });
    this.size();
  }
  size() {
    const cam = this.scene.cameras.main, w = Math.ceil(cam.width / cam.zoom) + 32, h = Math.ceil(cam.height / cam.zoom) + 32;
    if (this.rt && this.rt.width === w && this.rt.height === h) return;
    this.rt?.destroy();
    this.rt = this.scene.add.renderTexture(0, 0, w, h).setOrigin(0).setDepth(9000);
  }
  // shortTarget: 0 open night, 1 short sight. cones: Graphics to erase (lantern light).
  update(time, dt, { px, py, shortTarget, cones = [] }) {
    this.short += Math.sign(shortTarget - this.short) * Math.min(Math.abs(shortTarget - this.short), dt / 450);
    const v = this.scene.cameras.main.worldView, ox = Math.floor(v.x) - 16, oy = Math.floor(v.y) - 16;
    const rt = this.rt;
    rt.setPosition(ox, oy);
    rt.clear();
    const a = this.base + (NIGHT.dark - this.base) * this.short;
    rt.fill(NIGHT.tint, a);
    const cut = (img, x, y, r, alpha = 1) => {
      if (x + r < ox || y + r < oy || x - r > ox + rt.width || y - r > oy + rt.height) return;
      img.setScale((r * 2) / img.width).setAlpha(alpha);
      rt.erase(img, x - ox, y - oy);
    };
    for (const l of this.lights) {
      const f = l.flick ? 1 + Math.sin(time / 90 + l.x) * 0.04 + Math.sin(time / 37 + l.y) * 0.03 : 1;
      cut(this.brush, l.x, l.y, l.r * f, l.window ? 0.7 : 0.95);
    }
    for (const l of this.extra) cut(this.brush, l.x, l.y, l.r, l.a ?? 0.9);
    for (const g of cones) { g.setPosition(-ox, -oy); rt.erase(g); g.setPosition(0, 0); }
    // the player: a faint glow in the open night, the circle of short sight in the dark
    const open = this.map.inside ? 48 : 40, r = open + (sightRadius() - open) * this.short;
    cut(this.short > 0.05 ? this.sight : this.brush, px, py, r * (1 + Math.sin(time / 300) * 0.02), this.short > 0.05 ? 1 : 0.55);
  }
  destroy() { this.rt?.destroy(); this.brush.destroy(); this.sight.destroy(); }
}
