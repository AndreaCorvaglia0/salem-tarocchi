// Constables walking their routes with a lantern, and the Afflicted, who stand still and point.
// Each sees in a cone in front of them (drawn as lantern light, cut by walls). If the player is in
// it, the scene starts an Exam. Tall grass hides her except up close.
import Phaser from 'phaser';
import { test } from '../../core/cond.js';
import { findPath } from '../path.js';
import { Walker } from './walker.js';
import { makePerson, LOOKS } from '../art/people.js';

import { SEE, ANG, T, eyeAt, inSight } from '../sight.js';

export { SEE };

export class Patrol {
  constructor(scene, def) {
    this.scene = scene; this.def = def; this.kind = def.kind || 'constable';
    const look = this.kind === 'afflicted' ? 'afflitta' : 'conestabile';
    makePerson(scene, `ch-${look}`, LOOKS[look]);
    const [x, y] = def.route[0];
    this.w = new Walker(scene, `ch-${look}`, x, y, def.face || 'down');
    this.i = 0; this.waitUntil = 0; this.stunUntil = 0; this.alert = null;
    this.speed = def.speed || 380;
    this.cone = scene.add.graphics().setDepth(8990).setBlendMode(Phaser.BlendModes.ADD);
    this.mask = scene.make.graphics({ add: false });
    this.stars = scene.add.image(0, 0, 'fx-stars').setDepth(9003).setVisible(false);
    this.query = scene.add.image(0, 0, 'fx-query').setDepth(9004).setOrigin(0.5, 1).setVisible(false);
    if (this.kind === 'afflicted') this.w.sprite.anims.stop(), this.w.sprite.setFrame(9).setFlipX(this.w.dir === 'right');
    this.refresh();
  }
  get active() { return this.on; }
  refresh() { this.on = test(this.def.when); for (const o of [this.w.sprite, this.w.shadow, this.cone]) o.setVisible(this.on); }
  stunned(now) { return now < this.stunUntil; }
  stun(now, ms) { this.stunUntil = now + ms; }

  update(time, paused, canStep) {
    if (!this.on) return;
    const w = this.w;
    w.unstick();
    const stun = this.stunned(time);
    this.stars.setVisible(stun).setPosition(w.sprite.x, w.sprite.y - 28 + Math.sin(time / 120) * 1.5);
    if (this.alert) this.alert.setPosition(w.sprite.x, w.sprite.y - 30);
    if (paused || stun || w.moving) return;
    if (this.kind === 'afflicted') { // she turns, slowly, to point somewhere else
      if (time > this.waitUntil) {
        this.waitUntil = time + 3200 + Math.random() * 2000;
        const opts = this.def.look || [this.def.face || 'down', 'left', 'right'];
        const d = opts[Math.floor(Math.random() * opts.length)];
        w.dir = d; w.sprite.setFrame(d === 'up' ? 3 : d === 'down' ? 0 : 9).setFlipX(d === 'right');
      }
      return;
    }
    if (time < this.waitUntil) return;
    const route = this.def.route;
    const [gx, gy] = route[this.i];
    if (w.tx === gx && w.ty === gy) {
      if (route.length < 2) return;
      this.i = (this.i + 1) % route.length;
      this.waitUntil = time + (this.def.pause || 1500);
      // look around while waiting
      const dirs = ['up', 'down', 'left', 'right'];
      this.scene.time.delayedCall((this.def.pause || 1500) / 2, () => { if (!this.stunned(this.scene.time.now) && !w.moving) w.face(dirs[Math.floor(Math.random() * 4)]); });
      return;
    }
    const path = findPath(w.tx, w.ty, new Set([`${gx},${gy}`]), (x, y) => canStep(x, y), { limit: 4000 });
    if (!path || !path.length) { this.waitUntil = time + 800; return; }
    if (w.step(path[0], (x, y) => canStep(x, y), this.speed) !== true) this.waitUntil = time + 500;
  }

  // the eye: lantern height, a little in front
  eye() { const s = this.w.sprite; return eyeAt(s.x, s.y, this.w.dir); }

  // Can she see the player at pixel (px, py)? blocked(x, y) says if a tile stops the sight.
  sees(px, py, inGrass, blocked, now) {
    if (!this.on || this.stunned(now)) return false;
    const [ex, ey] = this.eye();
    return inSight(ex, ey, this.w.dir, px, py, inGrass, blocked);
  }

  // Draw the cone (visible light) and its shape for the night layer.
  draw(time, blocked) {
    const g = this.cone, m = this.mask;
    g.clear(); m.clear();
    if (!this.on || this.stunned(time)) return null;
    const [ex, ey] = this.eye(), a0 = ANG[this.w.dir], R = SEE.range * T;
    const pts = [];
    for (let k = 0; k <= 14; k++) {
      const a = a0 - SEE.half + (2 * SEE.half * k) / 14;
      let r = 0;
      while (r < R) { r += 3; if (blocked(Math.floor((ex + Math.cos(a) * r) / T), Math.floor((ey + 6 + Math.sin(a) * r) / T))) break; }
      pts.push({ x: ex + Math.cos(a) * r, y: ey + Math.sin(a) * r });
    }
    const flick = 0.85 + Math.sin(time / 70) * 0.08;
    const afflicted = this.kind === 'afflicted';
    g.fillStyle(afflicted ? 0xbfc8ff : 0xffb24a, (afflicted ? 0.1 : 0.16) * flick);
    g.fillPoints([{ x: ex, y: ey }, ...pts], true);
    g.fillStyle(afflicted ? 0xbfc8ff : 0xffd27a, 0.1 * flick);
    g.fillPoints([{ x: ex, y: ey }, ...pts.slice(3, 12).map((p) => ({ x: ex + (p.x - ex) * 0.6, y: ey + (p.y - ey) * 0.6 }))], true);
    m.fillStyle(0xffffff, afflicted ? 0.25 : 0.42);
    m.fillPoints([{ x: ex, y: ey }, ...pts], true);
    m.fillStyle(0xffffff, 0.9); m.fillCircle(ex, ey, 9);
    return m;
  }

  shout() {
    this.alert?.destroy();
    this.alert = this.scene.add.image(this.w.sprite.x, this.w.sprite.y - 30, 'fx-alert').setDepth(9004).setOrigin(0.5, 1);
    this.scene.tweens.add({ targets: this.alert, y: '-=4', duration: 160, yoyo: true });
  }
  calm() { this.alert?.destroy(); this.alert = null; }
  // f: 0..1, how close he is to noticing her
  hint(f) {
    const on = f > 0.05 && this.on && !this.alert;
    this.query.setVisible(on);
    if (on) this.query.setPosition(this.w.sprite.x, this.w.sprite.y - 28).setAlpha(0.35 + 0.65 * Math.min(1, f)).setScale(0.7 + 0.3 * Math.min(1, f));
  }
  destroy() { this.w.destroy(); this.cone.destroy(); this.mask.destroy(); this.stars.destroy(); this.query.destroy(); this.alert?.destroy(); }
}
