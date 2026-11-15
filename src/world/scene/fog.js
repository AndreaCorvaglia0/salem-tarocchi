// Thick fog (map files: `fog` zones). Banks of mist drift over the zone and show from outside.
// Without the Air (power `stun`) she can walk in: sight closes in over the first steps, her steps
// stop going where she means, and after FOG.lost steps she is back at the edge where she came in,
// facing out (bus `lost { zone }`, once per entry). With the Air a gust parts the fog as she enters
// and it stays thin around her: short sight, but she keeps her bearings.
import Phaser from 'phaser';
import { state } from '../../core/state.js';
import { emit } from '../../core/bus.js';
import { FOG } from '../reach.js';

const T = 16, ADD = Phaser.BlendModes.ADD;
const BACK = { up: 'down', down: 'up', left: 'right', right: 'left' };
const SIDE = { up: ['left', 'right'], down: ['left', 'right'], left: ['up', 'down'], right: ['up', 'down'] };

export class Fog {
  constructor(scene, map) {
    Object.assign(this, { scene, map, zone: null, steps: 0, entry: null, amount: 0, wisps: [] });
    for (const z of map.fogZones) {
      const [x, y, w, h] = z.area;
      for (let yy = y; yy < y + h; yy += 2) for (let xx = x; xx < x + w; xx += 2) {
        const s = scene.add.image(0, 0, 'mk-fog').setDepth(9002).setAlpha(0).setScale(1.1 + Math.random() * 0.6);
        this.wisps.push({ s, x: (xx + 1) * T + Math.random() * 12 - 6, y: (yy + 1) * T + Math.random() * 12 - 6, ph: Math.random() * 10, a: 0.42 + Math.random() * 0.2 });
      }
    }
  }
  get air() { return !!state.powers.stun; }
  in() { return !!this.zone; }

  // the direction she means to step: lost in the fog, now and then her feet go another way
  steer(dir) {
    if (!dir || !this.zone || this.air || this.steps < 2 || Math.random() > 0.4) return dir;
    this.scene.inputs.cancel();
    return SIDE[dir][Math.random() < 0.5 ? 0 : 1];
  }

  arrived(x, y, from) {
    const z = this.map.fogAt(x, y);
    if (z && !this.zone) {
      this.zone = z; this.steps = 0; this.entry = this.map.fogAt(...from) ? this.edge(from) : from; // she may wake up inside it (a save)
      const dx = x - from[0], dy = y - from[1];
      this.inDir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
      if (this.air) this.gust();
    }
    if (!z) { this.zone = null; return; }
    this.steps++;
    if (!this.air && this.steps >= FOG.lost) this.bounce();
  }

  // the nearest walkable tile outside the fog
  edge([x, y]) {
    const m = this.map, seen = new Set([`${x},${y}`]), q = [[x, y]];
    for (let i = 0; i < q.length && i < 4000; i++) {
      const [cx, cy] = q[i];
      if (!m.fogAt(cx, cy) && this.scene.canStand(cx, cy)) return [cx, cy];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = `${cx + dx},${cy + dy}`; if (!seen.has(k) && !m.isSolid(cx + dx, cy + dy)) { seen.add(k); q.push([cx + dx, cy + dy]); } }
    }
    return [x, y];
  }

  // lost: a fade, and she finds herself back at the edge, facing out
  bounce() {
    const sc = this.scene, z = this.zone, [ex, ey] = this.entry;
    this.zone = null;
    sc.busy++; sc.inputs.cancel();
    const cam = sc.cameras.main;
    cam.fadeOut(420, 200, 205, 220);
    cam.once('camerafadeoutcomplete', () => {
      const p = sc.player;
      p.stepping?.tw?.stop(); p.moving = false;
      Object.assign(p, { tx: ex, ty: ey }); p.place(); p.face(BACK[this.inDir] || 'down');
      state.pos = { map: this.map.id, x: ex, y: ey };
      this.amount = 0.6;
      cam.centerOn(p.sprite.x, p.sprite.y);
      cam.fadeIn(520, 200, 205, 220);
      sc.busy--;
      emit('lost', { zone: z.id });
    });
  }

  // the Air parts the fog: streaks of wind leave her in a ring
  gust() {
    const sc = this.scene, p = sc.player.sprite;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.random() * 0.3;
      const s = sc.add.image(p.x, p.y - 8, 'mk-gust').setDepth(9004).setBlendMode(ADD).setRotation(a).setAlpha(0.9);
      sc.tweens.add({ targets: s, x: p.x + Math.cos(a) * 40, y: p.y - 8 + Math.sin(a) * 30, alpha: 0, scale: 1.6, duration: 700, ease: 'Sine.easeOut', onComplete: () => s.destroy() });
    }
    for (const w of this.wisps) {
      const d = Math.hypot(w.x - p.x, w.y - p.y);
      if (d < 70) sc.tweens.add({ targets: w, x: w.x + ((w.x - p.x) / (d || 1)) * 22, duration: 900, ease: 'Sine.easeOut' });
    }
  }

  // -> how much fog covers her sight now (0..1)
  update(time, dt) {
    const p = this.scene.player.sprite;
    const target = this.zone ? (this.air ? 0.55 : Math.min(1, 0.45 + this.steps / FOG.closeIn * 0.55)) : 0;
    this.amount += Math.sign(target - this.amount) * Math.min(Math.abs(target - this.amount), dt / 600);
    const v = this.scene.cameras.main.worldView;
    for (const w of this.wisps) {
      const x = w.x + Math.sin(time / 2400 + w.ph) * 10, y = w.y + Math.sin(time / 3100 + w.ph * 2) * 4;
      if (x < v.x - 60 || x > v.right + 60 || y < v.y - 40 || y > v.bottom + 40) { w.s.setVisible(false); continue; }
      const d = Math.hypot(x - p.x, y - p.y + 8);
      const thin = this.air ? Math.min(1, Math.max(0.12, (d - 18) / 40)) : 1;
      w.s.setVisible(true).setPosition(x, y).setAlpha(w.a * thin * (0.85 + 0.15 * Math.sin(time / 900 + w.ph)));
    }
    return this.amount;
  }
}
