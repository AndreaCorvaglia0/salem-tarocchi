// The Minor Arcana in the tall grass, on screen (rules: ../minors.js). On a tagged grass tile now
// and then something glints two or three tiles ahead; using it gives a Minor through card.found,
// or a duplicate: state.dupes[id] + 1, a few coins, bus `dupe { id }`. The glinter lives across
// map changes, so the cooldown holds when she walks through a door.
import Phaser from 'phaser';
import { state, save } from '../../core/state.js';
import { test as cond } from '../../core/cond.js';
import { emit } from '../../core/bus.js';
import { call } from '../../core/services.js';
import { addCoins } from '../../core/progress.js';
import { Glinter, MINOR, MINORS_WHEN, gift } from '../minors.js';

const T = 16, ADD = Phaser.BlendModes.ADD;
const glinter = new Glinter();
export const minorGlinter = glinter; // for the harness

export class Minors {
  constructor(scene, map) {
    Object.assign(this, { scene, map });
    glinter.glint = null;
    this.img = scene.add.image(0, 0, 'mk-glint').setBlendMode(ADD).setDepth(9003).setVisible(false);
    this.halo = scene.add.image(0, 0, 'fx-glow-cool').setBlendMode(ADD).setDepth(9002).setVisible(false).setScale(0.5);
  }
  get glint() { return glinter.glint; }
  allowed(x, y) { return cond(MINORS_WHEN) && !(this.map.fogAt(x, y) && !state.powers.stun); }
  arrived(x, y, dir) {
    if (!this.allowed(x, y)) return;
    const ok = (tx, ty) => this.scene.canStand(tx, ty) && this.allowed(tx, ty);
    if (glinter.step(this.map, x, y, dir, Date.now(), ok)) this.show();
  }
  // for the harness: a glint now, ahead of her
  force(x, y, suit) { glinter.glint = { x, y, suit, at: Date.now() }; this.show(); }
  show() { const g = glinter.glint; this.img.setPosition(g.x * T + 8, g.y * T + 11).setVisible(true); this.halo.setPosition(g.x * T + 8, g.y * T + 10).setVisible(true); }
  hide() { this.img.setVisible(false); this.halo.setVisible(false); }
  usableAt(x, y) { const g = glinter.glint; return g && g.x === x && g.y === y ? [{ type: 'minor', x, y, label: 'Qualcosa luccica', verb: 'Raccogli' }] : []; }
  async use() {
    const g = glinter.take(Date.now());
    this.hide();
    if (!g) return;
    const r = gift(g.suit, (id) => !!state.cards[id]?.found);
    if (r.dupe) {
      state.dupes = state.dupes || {};
      state.dupes[r.id] = (state.dupes[r.id] || 0) + 1; save();
      addCoins(r.coins);
      emit('dupe', { id: r.id });
    } else await call('card.found', r.id);
  }
  update(time) {
    const g = glinter.glint;
    if (!g) { if (this.img.visible) this.hide(); return; }
    const p = this.scene.player;
    if (Date.now() - g.at > MINOR.ttl || Math.hypot(g.x - p.tx, g.y - p.ty) > MINOR.away) { glinter.glint = null; this.hide(); return; }
    const pulse = 0.5 + 0.5 * Math.sin(time / 230);
    this.img.setAlpha(0.55 + pulse * 0.45).setScale(0.8 + pulse * 0.5).setAngle((time / 30) % 360);
    this.halo.setAlpha(0.25 + pulse * 0.3);
  }
}
