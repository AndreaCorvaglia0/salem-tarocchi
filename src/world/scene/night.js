// The night layer: a dark tint over what the camera sees, with light cut out of it (windows, lamps,
// fires, the constables' lanterns and the player's own glow). In tall grass and dark places the
// night closes in: only a soft circle around the player stays clear ("vista corta"); the fire
// power widens it, and the light grows a little with each title (core/progress.js lightStep).
import { NIGHT, SKY } from '../art/palette.js';
import { state } from '../../core/state.js';
import { lightStep } from '../../core/progress.js';

export const SIGHT = { base: 30, fire: 52, title: 7 };
// in thick fog: the clear circle around her, lost (no Air) or parting it (Air); the fog's colour
export const FOG_SIGHT = { lost: 9, air: 30 };
const FOG_TINT = 0xaab1c6;
export const sightRadius = (s = state) => (s.powers.fire ? SIGHT.fire : SIGHT.base) + SIGHT.title * lightStep();

export class Night {
  constructor(scene, map, lights, season = 'winter', light = 'night') {
    Object.assign(this, { scene, map, lights, short: 0, extra: [] });
    const sky = SKY[light === 'dawn' ? 'dawn' : season] || SKY.winter;
    this.tint = sky.tint;
    this.base = map.inside ? sky.inside ?? NIGHT.inside : sky.outside;
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
  // fog: 0..1 how much thick fog covers her (scene/fog.js); air: she parts it (a wider clear circle)
  update(time, dt, { px, py, shortTarget, cones = [], fog = 0, air = false }) {
    this.short += Math.sign(shortTarget - this.short) * Math.min(Math.abs(shortTarget - this.short), dt / 450);
    const v = this.scene.cameras.main.worldView, ox = Math.floor(v.x) - 16, oy = Math.floor(v.y) - 16;
    const rt = this.rt;
    rt.setPosition(ox, oy);
    rt.clear();
    const a = this.base + (NIGHT.dark - this.base) * this.short;
    rt.fill(this.tint, a);
    if (fog > 0.01) rt.fill(FOG_TINT, Math.min(0.9, fog * (air ? 0.7 : 0.92)));
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
    const open = this.map.inside ? 48 : 40, r0 = open + (sightRadius() - open) * this.short;
    const r = fog > 0.01 ? r0 + ((air ? FOG_SIGHT.air : FOG_SIGHT.lost) - r0) * Math.min(1, fog) : r0;
    cut(this.short > 0.05 ? this.sight : this.brush, px, py, r * (1 + Math.sin(time / 300) * 0.02), this.short > 0.05 ? 1 : 0.55);
  }
  destroy() { this.rt?.destroy(); this.brush.destroy(); this.sight.destroy(); }
}
