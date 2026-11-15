// What falls through the air, by season: light snow in the winter village, petals and fireflies
// in the spring forest, leaves and dust in the autumn depths. Particles live in world space around
// the camera and wrap at its edges, so they cost the same on any map size.
import Phaser from 'phaser';

const KINDS = {
  winter: { tex: ['fx-flake', 'fx-flake1', 'fx-flake1'], n: 70, vy: [9, 20], vx: [-5, 3], depth: 9010, alpha: [0.5, 0.95] },
  spring: { tex: ['fx-petal', 'fx-firefly'], n: 26, vy: [3, 9], vx: [4, 10], depth: 9010, alpha: [0.5, 0.9], fire: true },
  autumn: { tex: ['fx-leaf', 'fx-flake1'], n: 22, vy: [5, 12], vx: [-6, 6], depth: 9010, alpha: [0.4, 0.8] },
  inside: { tex: ['fx-flake1'], n: 14, vy: [-1, 1], vx: [-1, 1], depth: 8995, alpha: [0.08, 0.22] },
};
const r = (a, b) => a + Math.random() * (b - a);

export class Weather {
  constructor(scene, map) {
    this.scene = scene;
    this.box = map.inside ? { x: 16, y: 32, r: map.W * 16 - 16, b: map.H * 16 - 16 } : null; // dust stays in the room
    this.k = KINDS[map.inside ? 'inside' : map.season] || KINDS.winter;
    this.p = [];
    const v = scene.cameras.main.worldView;
    for (let i = 0; i < this.k.n; i++) {
      const tex = this.k.tex[i % this.k.tex.length];
      const b = this.box, img = scene.add.image(b ? r(b.x, b.r) : v.x + Math.random() * 400, b ? r(b.y, b.b) : v.y + Math.random() * 900, tex).setDepth(this.k.depth).setAlpha(r(...this.k.alpha));
      const glow = tex === 'fx-firefly';
      if (glow) img.setBlendMode(Phaser.BlendModes.ADD);
      this.p.push({ img, vx: r(...this.k.vx), vy: glow ? r(-3, 3) : r(...this.k.vy), ph: Math.random() * 6, glow });
    }
  }
  update(time, dt) {
    const cv = this.scene.cameras.main.worldView, s = dt / 1000, m = 8;
    const v = this.box ? { x: this.box.x, y: this.box.y, right: this.box.r, bottom: this.box.b } : cv;
    for (const q of this.p) {
      const o = q.img;
      o.x += (q.vx + Math.sin(time / 900 + q.ph) * 4) * s;
      o.y += q.vy * s;
      if (q.glow) o.setAlpha(0.35 + 0.65 * Math.max(0, Math.sin(time / 500 + q.ph)));
      if (o.y > v.bottom + m) o.y = v.y - m; else if (o.y < v.y - m) o.y = v.bottom + m;
      if (o.x > v.right + m) o.x = v.x - m; else if (o.x < v.x - m) o.x = v.right + m;
    }
  }
}
