// Input for the world: arrows and WASD, Space/Enter/E to use things, and tap (or click) to walk
// (adapted from Mnemopolis systems/tapnav.js): the player walks the shortest way to the tapped
// tile; tapping something she can use walks next to it and uses it; tapping a door walks through.
import Phaser from 'phaser';
import { findPath, DIRS } from '../path.js';

const T = 16, JD = (k) => Phaser.Input.Keyboard.JustDown(k);

export class Input {
  constructor(scene) {
    this.scene = scene;
    this.path = []; this.target = null; this.pendingUse = false; this.actQueued = false;
    // no capture: Phaser would otherwise swallow these letters everywhere, also in the text fields
    // of the overlays (her three words for a card could not contain a, e, s, d, w or a space)
    this.keys = scene.input.keyboard?.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ENTER,E', false);
    scene.input.keyboard?.disableGlobalCapture?.();
    this.marker = scene.add.graphics().setDepth(8999).setVisible(false);
    scene.input.on('pointerup', (p) => this.tap(p));
  }
  cancel() { this.path = []; this.pendingUse = false; this.marker.setVisible(false); }
  queueAct() { this.actQueued = true; }

  // the direction to step now, or null
  dir() {
    const k = this.keys;
    if (k) {
      const d = k.LEFT.isDown || k.A.isDown ? 'left' : k.RIGHT.isDown || k.D.isDown ? 'right' : k.UP.isDown || k.W.isDown ? 'up' : k.DOWN.isDown || k.S.isDown ? 'down' : null;
      if (d) { this.cancel(); return d; }
    }
    if (!this.path.length) return null;
    const d = this.path.shift();
    if (!this.path.length) this.marker.setVisible(false);
    return d;
  }
  // true once when the player asked to use what is in front of her
  act() {
    const k = this.keys;
    if (k && (JD(k.SPACE) || JD(k.ENTER) || JD(k.E))) return true;
    if (this.actQueued) { this.actQueued = false; return true; }
    const p = this.scene.player;
    if (this.pendingUse && !this.path.length && !p.moving) {
      this.pendingUse = false;
      p.faceToward(...this.target);
      return true;
    }
    return false;
  }

  tap(p) {
    const sc = this.scene;
    if (!sc.canAct() || p.getDistance() > 14) return;
    const wp = sc.cameras.main.getWorldPoint(p.x, p.y);
    let tx = Math.floor(wp.x / T), ty = Math.floor(wp.y / T);
    if (sc.catHit?.(wp.x, wp.y) && sc.tapCat()) { this.cancel(); return; } // Tartufo, close by
    // a tap on a tall sprite (a person's head) means the person
    const person = sc.personNear(wp.x, wp.y);
    if (person) [tx, ty] = person;
    this.plan(tx, ty);
  }

  plan(tx, ty) {
    const sc = this.scene, pl = sc.player;
    this.cancel();
    const usable = sc.things.usableAt(tx, ty).filter((u) => u.type !== 'door');
    const door = sc.things.doorAt(tx, ty);
    if (tx === pl.tx && ty === pl.ty) { if (usable.length) this.actQueued = true; return; }
    const stand = sc.canStand(tx, ty);
    let goals;
    if (door || (stand && !usable.some((u) => u.type === 'npc'))) goals = new Set([`${tx},${ty}`]);
    else goals = new Set(Object.values(DIRS).map(([dx, dy]) => [tx + dx, ty + dy]).filter(([x, y]) => (x === pl.tx && y === pl.ty) || sc.canStand(x, y)).map(([x, y]) => `${x},${y}`));
    if (!goals.size) return this.flash(tx, ty, 0xd0605a);
    // a world of Altrove may ask taps to keep off what she has learnt to see (thin cloud after a fall)
    const path = findPath(pl.tx, pl.ty, goals, (x, y) => sc.canStand(x, y) && !sc.rule?.avoid?.(x, y), { limit: 6000 });
    if (!path) return this.flash(tx, ty, 0xd0605a);
    this.path = path; this.target = [tx, ty];
    this.pendingUse = usable.length > 0;
    this.flash(tx, ty, usable.length || door ? 0xffd683 : 0xb8c8f0);
    if (!path.length && this.pendingUse) pl.faceToward(tx, ty);
  }

  flash(tx, ty, col) {
    const g = this.marker;
    g.clear().setVisible(true).setAlpha(1).lineStyle(1, col, 0.95).strokeRoundedRect(tx * T + 2, ty * T + 2, T - 4, T - 4, 3);
    this.scene.tweens.add({ targets: g, alpha: 0.2, duration: 450, yoyo: true, repeat: 1, onComplete: () => g.setVisible(false) });
  }
}
