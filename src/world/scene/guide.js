// The guide (service world.guide(anchor | null)): a soft trail of small lights along the walkable
// path from the player to an anchor, re-computed as she moves, and a gently pulsing beacon on the
// target. If the anchor is on another map, the trail leads to the door that starts the way there.
// Pure path work is in guideRoute (no Phaser), so the tests can check it.
import Phaser from 'phaser';
import { anchorOf } from '../maps.js';
import { guideRoute } from '../guidepath.js';

const T = 16, ADD = Phaser.BlendModes.ADD, MAX = 16;

export class Guide {
  constructor(scene, map) {
    Object.assign(this, { scene, map, target: null, from: null, path: [], dest: null });
    const warm = scene.season !== 'spring'; // sparks in the snow and the dark, fireflies in spring
    this.dots = Array.from({ length: MAX }, () => scene.add.image(0, 0, 'fx-glow').setBlendMode(ADD).setScale(0.22).setDepth(9006).setVisible(false).setTint(warm ? 0xffe2a0 : 0xd8ffb0));
    this.cores = Array.from({ length: MAX }, () => scene.add.image(0, 0, 'fx-flake').setDepth(9007).setVisible(false).setTint(0xfff6d8));
    this.beacon = scene.add.image(0, 0, 'fx-glow').setBlendMode(ADD).setDepth(9006).setVisible(false).setTint(0xfff0b8);
    this.ring = scene.add.image(0, 0, 'fx-glint').setDepth(9007).setVisible(false);
  }
  set(ref) { this.target = ref || null; this.from = null; }
  // called every frame; returns lights for the night layer
  update(time, px, py) {
    const p = this.scene.player;
    if (!this.target) { this.hide(); return []; }
    const key = `${p.tx},${p.ty}`;
    if (key !== this.from) {
      this.from = key;
      const r = guideRoute(this.map, p.tx, p.ty, this.target, (x, y) => !this.scene.things.solidAt(x, y));
      this.path = r ? r.tiles : []; this.dest = r ? r.dest : null;
    }
    if (!this.dest) { this.hide(); return []; }
    // a light every other tile, the first ones nearest her; a slow wave runs towards the target
    const tiles = this.path.filter((_, i) => i % 2 === 1).slice(0, MAX);
    this.dots.forEach((d, i) => {
      const t = tiles[i], on = !!t;
      d.setVisible(on); this.cores[i].setVisible(on);
      if (!on) return;
      const wave = 0.5 + 0.5 * Math.sin(time / 260 - i * 0.7);
      const x = t[0] * T + 8 + Math.sin(time / 700 + i) * 1.5, y = t[1] * T + 10 + Math.cos(time / 900 + i * 2) * 1.5;
      d.setPosition(x, y).setAlpha(0.25 + 0.5 * wave);
      this.cores[i].setPosition(x, y).setAlpha(0.4 + 0.6 * wave);
    });
    const [bx, by] = [this.dest[0] * T + 8, this.dest[1] * T + 8];
    const pulse = 0.5 + 0.5 * Math.sin(time / 420);
    this.beacon.setVisible(true).setPosition(bx, by).setScale(0.7 + 0.35 * pulse).setAlpha(0.45 + 0.4 * pulse);
    // the star marks the place itself; when the way only leads to a door (the place is on another map) there
    // is just the soft light, or it looks like something to pick up that cannot be taken
    const here = String(this.target).split('.')[0] === this.map.id;
    this.ring.setVisible(here);
    if (here) this.ring.setPosition(bx, by - 14 - pulse * 3).setAlpha(0.6 + 0.4 * pulse);
    else this.beacon.setScale(0.5 + 0.2 * pulse).setAlpha(0.3 + 0.25 * pulse);
    void px; void py;
    return [{ x: bx, y: by, r: 22 + 8 * pulse, a: 0.7 }];
  }
  hide() { for (const d of this.dots) d.setVisible(false); for (const c of this.cores) c.setVisible(false); this.beacon.setVisible(false); this.ring.setVisible(false); }
  get targetAnchor() { return this.target ? anchorOf(this.target) : null; }
}
