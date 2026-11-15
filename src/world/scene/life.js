// Little life, small and cheap: eyes that blink far away in the dark wood, will-o'-the-wisps over
// the swamp, the moonlight down the open well, a few lit windows that go dark as the night goes
// on, crows on the roofs and an owl in autumn, the meetinghouse bell swinging now and then.
// Map files may declare: eyes: [[x, y, w, h]], wisps: [[x, y, w, h]], moon: [[x, y]] (tiles).
// update() returns extra lights for the night layer.
import Phaser from 'phaser';

const T = 16, ADD = Phaser.BlendModes.ADD;
const rnd = (a, b) => a + Math.random() * (b - a);

export class Life {
  constructor(scene, map, built, season, light) {
    Object.assign(this, { scene, map, built, lights: [], eyes: [], wisps: [], crows: [] });
    const def = map.def, night = light !== 'dawn';
    // the moon down the well: a shaft of light and a pale circle on the floor
    for (const [x, y] of def.moon || []) {
      const cx = x * T + 8, cy = y * T + 8;
      scene.add.image(cx, cy + 10, 'fx-moonbeam').setOrigin(0.5, 1).setScale(1.3, 0.95).setBlendMode(ADD).setDepth(9003).setAlpha(0.55);
      this.lights.push({ x: cx, y: cy, r: 46, a: 0.85 });
    }
    // eyes in the dark: a few pairs, each appears far from her, blinks, goes away
    this.eyeAreas = def.eyes || [];
    for (let i = 0; i < (this.eyeAreas.length ? 3 : 0); i++) this.eyes.push({ s: scene.add.sprite(0, 0, 'fx-eyes', 0).setDepth(9004).setVisible(false), next: scene.time.now + rnd(1500, 6000) });
    // will-o'-the-wisps: cold lights drifting over the water
    for (const [x, y, w, h] of def.wisps || []) for (let i = 0; i < Math.max(2, Math.round((w * h) / 30)); i++) {
      const s = scene.add.image(0, 0, 'fx-glow-cool').setBlendMode(ADD).setDepth(9004).setScale(0.35).setTint(i % 2 ? 0x9ff0c8 : 0xa8c8ff);
      const core = scene.add.image(0, 0, 'fx-flake').setDepth(9005).setTint(0xe8fff4);
      this.wisps.push({ s, core, box: [x * T, y * T, w * T, h * T], ph: Math.random() * 10, sp: rnd(0.15, 0.35) });
    }
    // windows go dark late: after a while, one house after another sleeps (never all of them)
    const win = built.lights.filter((l) => l.window && !l.keep);
    if (night && !map.inside && win.length > 2) {
      const order = Phaser.Utils.Array.Shuffle(win.slice()).slice(0, Math.floor(win.length / 2));
      order.forEach((l, i) => scene.time.delayedCall(rnd(40000, 70000) * (i + 1), () => {
        scene.tweens.add({ targets: l.glow, alpha: 0, duration: 1600 });
        const k = built.lights.indexOf(l); if (k >= 0) built.lights.splice(k, 1);
      }));
    }
    // crows on the roofs and trees in autumn; an owl in the autumn forest
    if (season === 'autumn' && !map.inside && map.id !== 'depths') {
      const spots = Phaser.Utils.Array.Shuffle(built.perches.slice()).slice(0, map.id === 'forest' ? 2 : 4);
      for (const [x, y] of spots) this.crows.push({ s: scene.add.sprite(x, y, 'fx-crow', 0).setDepth(y + 60).setFlipX(Math.random() > 0.5), home: [x, y], next: scene.time.now + rnd(8000, 30000) });
      if (map.id === 'forest' && built.perches.length) {
        const [x, y] = built.perches[Math.floor(built.perches.length / 2)];
        this.owl = scene.add.sprite(x - 4, y + 6, 'fx-owl', 0).setDepth(y + 70);
        scene.time.addEvent({ delay: 2600, loop: true, callback: () => { this.owl.setFrame(1); scene.time.delayedCall(180, () => this.owl.setFrame(0)); } });
      }
    }
    // the bell swings now and then
    for (const b of built.bells) scene.time.addEvent({ delay: rnd(45000, 80000), loop: true, callback: () => scene.tweens.add({ targets: b, angle: { from: -18, to: 18 }, duration: 520, yoyo: true, repeat: 2, ease: 'Sine.easeInOut', onComplete: () => b.setAngle(0) }) });
  }

  update(time, px, py) {
    const extra = [...this.lights];
    // eyes
    for (const e of this.eyes) {
      if (time < e.next) continue;
      if (e.s.visible) { e.s.setVisible(false); e.next = time + rnd(3000, 9000); continue; }
      const spot = this.eyeSpot(px, py);
      if (!spot) { e.next = time + 2000; continue; }
      e.s.setPosition(...spot).setVisible(true).setFrame(0).setAlpha(0.95);
      const blink = () => { e.s.setFrame(1); this.scene.time.delayedCall(140, () => e.s.setFrame(0)); };
      this.scene.time.delayedCall(rnd(700, 1200), blink); this.scene.time.delayedCall(rnd(1800, 2400), blink);
      e.next = time + rnd(2800, 4200);
    }
    // wisps
    for (const w of this.wisps) {
      const [bx, by, bw, bh] = w.box, t = time / 1000 * w.sp + w.ph;
      const x = bx + bw * (0.5 + 0.45 * Math.sin(t * 1.3)), y = by + bh * (0.5 + 0.4 * Math.sin(t * 0.9 + 1.7)) + Math.sin(time / 300 + w.ph) * 2;
      const a = 0.45 + 0.4 * Math.sin(time / 700 + w.ph * 3);
      w.s.setPosition(x, y).setAlpha(a); w.core.setPosition(x, y).setAlpha(Math.min(1, a + 0.3));
      extra.push({ x, y, r: 14, a: a * 0.8 });
    }
    // crows take off, circle, land somewhere else nearby
    for (const c of this.crows) {
      if (time < c.next || c.flying) continue;
      c.flying = true;
      c.s.play('crow-fly');
      const [hx, hy] = c.home, tx = hx + rnd(-60, 60), ty = hy - rnd(40, 90);
      this.scene.tweens.add({ targets: c.s, x: tx, y: ty, duration: 1400, ease: 'Sine.easeOut', yoyo: true, hold: 600, onComplete: () => { c.s.anims.stop(); c.s.setFrame(0); c.flying = false; c.next = this.scene.time.now + rnd(15000, 40000); } });
    }
    return extra;
  }

  // a dark spot of the eye areas, 5 to 9 tiles from her, not on a path
  eyeSpot(px, py) {
    const m = this.map;
    for (let tries = 0; tries < 12; tries++) {
      const [x, y, w, h] = this.eyeAreas[Math.floor(Math.random() * this.eyeAreas.length)];
      const tx = x + Math.floor(Math.random() * w), ty = y + Math.floor(Math.random() * h);
      const d = Math.hypot(tx * T + 8 - px, ty * T + 8 - py) / T;
      if (d < 5 || d > 9) continue;
      if (!m.isSolid(tx, ty)) continue; // among the trees, not where she can walk
      return [tx * T + 8, ty * T + 4];
    }
    return null;
  }
}
