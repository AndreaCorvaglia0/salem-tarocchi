// The sixth sense (power `sense`, the Water): when a hidden Major spot or an unopened chest is
// within senseRadius(level) tiles, every few seconds a ripple leaves her feet towards the nearest,
// like a ring on water, brighter the closer it is. Nothing when nothing is in range.
import Phaser from 'phaser';
import { state } from '../../core/state.js';
import { senseRadius } from '../../core/progress.js';
import { sensedFrom } from '../hidden.js';

const T = 16, ADD = Phaser.BlendModes.ADD, EVERY = 2800;

export class Sense {
  constructor(scene, map) { Object.assign(this, { scene, map, next: scene.time.now + 1500 }); }
  target() {
    const p = this.scene.player, r = senseRadius();
    return sensedFrom(state, { map: this.map.id, x: p.tx, y: p.ty }, r).find((h) => h.map === this.map.id && h.dist > 0.5) || null;
  }
  update(time) {
    if (time < this.next || !state.powers.sense) return;
    this.next = time + EVERY;
    if (!this.scene.canAct()) return;
    const t = this.target();
    if (!t) return;
    const r = senseRadius(), near = r === Infinity ? Math.max(0.35, 1 - t.dist / 40) : Math.max(0.3, 1 - t.dist / r);
    this.pulse(t, near);
    this.scene.time.delayedCall(320, () => this.pulse(t, near * 0.7));
  }
  pulse(t, strength) {
    const sc = this.scene;
    if (!sc.sys.isActive()) return;
    const p = sc.player.sprite, x0 = p.x, y0 = p.y - 2;
    const dx = t.x * T + 8 - x0, dy = t.y * T + 12 - y0, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    const reach = Math.min(d, 44 + strength * 24);
    const g = sc.add.graphics().setDepth(9003).setBlendMode(ADD);
    const o = { k: 0 };
    sc.tweens.add({
      targets: o, k: 1, duration: 1500, ease: 'Sine.easeOut',
      onUpdate: () => {
        const k = o.k, cx = x0 + ux * reach * k, cy = y0 + uy * reach * k, rx = 4 + k * 18, a = Math.min(1, 0.35 + strength) * (1 - k * k);
        g.clear();
        g.lineStyle(2, 0x8fd0ff, a).strokeEllipse(cx, cy, rx * 2, rx * 0.95);
        g.lineStyle(1, 0xf0faff, a * 0.8).strokeEllipse(cx, cy, rx * 1.25, rx * 0.55);
      },
      onComplete: () => g.destroy(),
    });
  }
}
