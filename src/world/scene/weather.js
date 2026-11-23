// What falls through the air, by season: snow in winter, petals and fireflies in spring, leaves
// and slow fog banks in autumn, dust in rooms and cellars, a little mist at dawn. Particles live
// in world space around the camera and wrap at its edges, so they cost the same on any map size.
import Phaser from 'phaser';

const KINDS = {
  winter: { tex: ['fx-flake', 'fx-flake1', 'fx-flake1'], n: 70, vy: [9, 20], vx: [-5, 3], depth: 9010, alpha: [0.5, 0.95] },
  spring: { tex: ['fx-petal', 'fx-petal', 'fx-firefly'], n: 30, vy: [3, 9], vx: [4, 10], depth: 9010, alpha: [0.5, 0.9] },
  autumn: { tex: ['fx-leaf', 'fx-leaf', 'fx-flake1'], n: 22, vy: [5, 12], vx: [-6, 6], depth: 9010, alpha: [0.4, 0.8], fog: 7 },
  dawn: { tex: ['fx-leaf', 'fx-flake1'], n: 10, vy: [4, 9], vx: [-4, 5], depth: 8996, alpha: [0.5, 0.9], fog: 4 },
  inside: { tex: ['fx-flake1'], n: 14, vy: [-1, 1], vx: [-1, 1], depth: 8995, alpha: [0.08, 0.22] },
  cave: { tex: ['fx-flake1'], n: 26, vy: [-1, 2], vx: [-1, 1], depth: 8995, alpha: [0.1, 0.3] },
};
const r = (a, b) => a + Math.random() * (b - a);
// the real calendar: from the first of December to Epiphany the sky outside snows (the threshold does too)
const winterFeast = (d = new Date()) => d.getMonth() === 11 || (d.getMonth() === 0 && d.getDate() <= 6);

export class Weather {
  constructor(scene, map, season = map.season, light = 'night') {
    this.scene = scene;
    this.box = map.inside ? { x: 16, y: 32, r: map.W * 16 - 16, b: map.H * 16 - 16 } : null; // dust stays in the room
    const kind = map.inside ? 'inside' : map.id === 'depths' ? 'cave' : winterFeast() ? 'winter' : light === 'dawn' ? 'dawn' : season; // in December it snows on every season
    this.k = KINDS[kind] || KINDS.winter;
    this.p = [];
    const v = scene.cameras.main.worldView;
    for (let i = 0; i < this.k.n; i++) {
      const tex = this.k.tex[i % this.k.tex.length];
      const b = this.box, img = scene.add.image(b ? r(b.x, b.r) : v.x + Math.random() * 400, b ? r(b.y, b.b) : v.y + Math.random() * 900, tex).setDepth(this.k.depth).setAlpha(r(...this.k.alpha));
      const glow = tex === 'fx-firefly';
      if (glow) img.setBlendMode(Phaser.BlendModes.ADD);
      this.p.push({ img, vx: r(...this.k.vx), vy: glow ? r(-3, 3) : r(...this.k.vy), ph: Math.random() * 6, glow });
    }
    // fog banks: big soft shapes drifting slowly, under the night so they take its colour
    for (let i = 0; i < (this.k.fog || 0); i++) {
      const img = scene.add.image(v.x + Math.random() * 500, v.y + Math.random() * 900, 'fx-fog').setDepth(8994).setAlpha(light === 'dawn' ? 0.35 : 0.22).setScale(r(1.2, 2.2), r(0.8, 1.2));
      this.p.push({ img, vx: r(2, 5), vy: 0, ph: Math.random() * 6, fog: true });
    }
  }
  update(time, dt) {
    const cv = this.scene.cameras.main.worldView, s = dt / 1000;
    const v = this.box ? { x: this.box.x, y: this.box.y, right: this.box.r, bottom: this.box.b } : cv;
    for (const q of this.p) {
      const o = q.img, m = q.fog ? 90 : 8;
      o.x += (q.vx + (q.fog ? 0 : Math.sin(time / 900 + q.ph) * 4)) * s;
      o.y += q.vy * s;
      if (q.glow) o.setAlpha(0.35 + 0.65 * Math.max(0, Math.sin(time / 500 + q.ph)));
      if (o.y > v.bottom + m) o.y = v.y - m; else if (o.y < v.y - m) o.y = v.bottom + m;
      if (o.x > v.right + m) o.x = v.x - m; else if (o.x < v.x - m) o.x = v.right + m;
    }
  }
}
