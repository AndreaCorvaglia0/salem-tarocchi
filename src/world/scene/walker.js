// Grid movement for the player, the townsfolk and the constables (adapted from Mnemopolis
// systems/walker.js). A Walker owns a sprite and its shadow and steps one tile at a time.
const T = 16;
export const DIRS = {
  up: { dx: 0, dy: -1, frame: 3, anim: 'walk-up', flip: false },
  down: { dx: 0, dy: 1, frame: 0, anim: 'walk-down', flip: false },
  left: { dx: -1, dy: 0, frame: 6, anim: 'walk-side', flip: false },
  right: { dx: 1, dy: 0, frame: 6, anim: 'walk-side', flip: true },
};

export class Walker {
  constructor(scene, key, tx, ty, dir = 'down') {
    Object.assign(this, { scene, key, tx, ty, dir, moving: false, stepping: null });
    this.shadow = scene.add.image(0, 0, 'fx-shadow').setDepth(2);
    this.sprite = scene.add.sprite(0, 0, key, DIRS[dir].frame).setOrigin(0.5, 1);
    scene.tweens.setLagSmooth();
    this.place();
  }
  get gone() { return !this.sprite.scene; }
  place() {
    this.sprite.setPosition(this.tx * T + T / 2, this.ty * T + T);
    this.sync();
    this.face(this.dir);
  }
  sync() { this.shadow.setPosition(this.sprite.x, this.sprite.y - 1); this.sprite.setDepth(this.sprite.y); }
  face(dir) {
    this.dir = dir;
    if (this.gone) return;
    if (!this.moving) { this.sprite.anims.stop(); this.sprite.setFrame(DIRS[dir].frame); }
    this.sprite.setFlipX(DIRS[dir].flip);
  }
  // canEnter(x, y) -> true to step; anything else is returned (a door, a thing, false)
  step(dir, canEnter, speed = 170, onDone = null) {
    if (this.gone || this.moving) return false;
    this.face(dir);
    const d = DIRS[dir], nx = this.tx + d.dx, ny = this.ty + d.dy;
    const res = canEnter(nx, ny);
    if (res !== true) return res;
    this.moving = true;
    this.sprite.anims.play(`${this.key}-${d.anim}`, true);
    this.sprite.anims.timeScale = 170 / speed;
    this.stepping = { at: this.scene.time.now, nx, ny, onDone };
    this.stepping.tw = this.scene.tweens.add({
      targets: this.sprite, x: nx * T + T / 2, y: ny * T + T, duration: speed,
      onUpdate: () => this.sync(),
      onComplete: () => this.arrive(),
    });
    return true;
  }
  arrive() {
    if (!this.moving || !this.stepping) return;
    const { nx, ny, onDone } = this.stepping;
    Object.assign(this, { tx: nx, ty: ny, moving: false, stepping: null });
    this.sprite.setPosition(nx * T + T / 2, ny * T + T);
    this.sync();
    onDone?.(nx, ny);
  }
  // a step that never finished (a stalled tween): snap to the target after two seconds
  unstick() { if (this.moving && this.stepping && this.scene.time.now - this.stepping.at > 2000) { this.stepping.tw?.stop(); this.arrive(); } }
  stopAnim() { if (!this.moving && !this.gone) { this.sprite.anims.stop(); this.sprite.setFrame(DIRS[this.dir].frame); } }
  facing() { const d = DIRS[this.dir]; return [this.tx + d.dx, this.ty + d.dy]; }
  faceToward(x, y) { const dx = x - this.tx, dy = y - this.ty; if (!dx && !dy) return; this.face(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up'); }
  destroy() { this.stepping?.tw?.stop(); this.sprite.destroy(); this.shadow.destroy(); }
}
