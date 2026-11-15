// Tartufo follows a step behind, sits when you stop, and runs to a hidden card when he smells one
// (he sits beside it until you take it). He never blocks the way.
import { state } from '../../core/state.js';

const T = 16;

export class Cat {
  constructor(scene, x, y) {
    this.scene = scene;
    this.trail = [];
    this.shadow = scene.add.image(0, 0, 'fx-shadow').setScale(0.8).setDepth(2);
    this.s = scene.add.sprite(x * T + 8, y * T + 14, 'tartufo', 0).setOrigin(0.5, 1);
    this.tx = x; this.ty = y; this.moving = false; this.target = null; this.sitting = false;
    this.sit();
  }
  get on() { return !!state.powers.cat; }
  // the player left tile (x, y)
  follow(x, y) { this.trail.push([x, y]); if (this.trail.length > 3) this.trail.shift(); }
  // run to a card spot and wait there
  seek(x, y) { this.target = [x, y]; }
  release() { this.target = null; }
  sit() { this.sitting = true; this.s.play('tartufo-sit', true); }
  moveTo(x, y, ms) {
    this.moving = true; this.sitting = false;
    this.s.play('tartufo-walk', true);
    if (x !== this.tx) this.s.setFlipX(x > this.tx);
    this.scene.tweens.add({ targets: this.s, x: x * T + 8, y: y * T + 14, duration: ms, onUpdate: () => this.sync(), onComplete: () => { this.tx = x; this.ty = y; this.moving = false; } });
  }
  sync() { this.s.setDepth(this.s.y - 1); this.shadow.setPosition(this.s.x, this.s.y - 1); }
  update(player, canStand) {
    const vis = this.on;
    this.s.setVisible(vis); this.shadow.setVisible(vis);
    if (!vis) { this.trail = []; this.tx = player.tx; this.ty = player.ty; this.s.setPosition(player.tx * T + 8, player.ty * T + 14); return; }
    this.sync();
    if (this.moving) return;
    if (this.target) {
      const [gx, gy] = this.target;
      // a free tile next to the spot (or the spot itself)
      const spots = [[gx + 1, gy], [gx - 1, gy], [gx, gy + 1], [gx, gy - 1], [gx, gy]].filter(([x, y]) => canStand(x, y));
      const goal = spots.sort((a, b) => Math.hypot(a[0] - this.tx, a[1] - this.ty) - Math.hypot(b[0] - this.tx, b[1] - this.ty))[0];
      if (goal && (goal[0] !== this.tx || goal[1] !== this.ty)) {
        const dx = Math.sign(goal[0] - this.tx), dy = Math.sign(goal[1] - this.ty);
        const nx = dx && canStand(this.tx + dx, this.ty) ? this.tx + dx : this.tx, ny = nx === this.tx && dy ? this.ty + dy : this.ty;
        if ((nx !== this.tx || ny !== this.ty) && (canStand(nx, ny) || (nx === gx && ny === gy))) { this.moveTo(nx, ny, 110); return; }
        this.target = null; // stuck: give up, follow again
      } else if (!this.sitting) { this.s.setFlipX(gx > this.tx); this.sit(); }
      return;
    }
    const far = Math.abs(player.tx - this.tx) + Math.abs(player.ty - this.ty);
    if (far > 8) { this.trail = []; this.s.setPosition(player.tx * T + 8, player.ty * T + 14); this.tx = player.tx; this.ty = player.ty; return; }
    if (this.trail.length > 1) {
      const [x, y] = this.trail.shift();
      if (x !== player.tx || y !== player.ty) { this.moveTo(x, y, 160); return; }
    }
    if (!player.moving && !this.sitting) { this.sit(); this.s.setFlipX(player.tx > this.tx); }
  }
  destroy() { this.s.destroy(); this.shadow.destroy(); }
}
