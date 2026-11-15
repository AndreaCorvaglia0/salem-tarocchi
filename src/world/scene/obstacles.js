// Obstacles on a map (map files: `obstacles`, README.md): brambles that Fire burns, roots and warded
// stones that Earth draws aside. Unopened, they are solid; once opened they stay gone
// (state.world.opened[id]). Without the magic the prompt is dimmed and using it only says so on
// the bus: `blocked { kind, need }` (someone else turns it into words).
import { state, save } from '../../core/state.js';
import { emit } from '../../core/bus.js';
import { call, has } from '../../core/services.js';
import { makeMarks } from '../art/marks.js';

const T = 16, ADD = 1;
const sfx = (n) => { if (has('sound.play')) Promise.resolve(call('sound.play', n)).catch(() => {}); };
// interface labels: with the magic / without it
const LABEL = {
  brambles: { can: 'Brucia i rovi', cannot: 'Rovi', verb: 'Brucia' },
  roots: { can: 'Scosta le radici', cannot: 'Radici', verb: 'Scosta' },
  stone: { can: 'Scosta la pietra', cannot: 'Una pietra segnata', verb: 'Scosta' },
};

export class Obstacles {
  constructor(scene, map) {
    makeMarks(scene);
    this.scene = scene; this.map = map;
    this.list = map.obstacles.filter((o) => !state.world.opened[o.id]).map((o) => {
      const bx = o.x * T + 8, by = o.y * T + T + (o.on ? 2 : 0);
      const key = o.kind === 'brambles' ? 'mk-brambles' : o.kind === 'roots' ? 'mk-roots' : 'mk-stone';
      const img = scene.add.image(bx, by, key).setOrigin(0.5, 1).setDepth(by + 1);
      const sigil = o.kind === 'stone' ? scene.add.image(bx, by, 'mk-sigil').setOrigin(0.5, 1).setDepth(by + 2).setBlendMode(ADD) : null;
      const glow = o.kind === 'stone' ? scene.add.image(bx, by - 10, 'fx-glow-cool').setDepth(9002).setBlendMode(ADD).setScale(0.45).setAlpha(0.3) : null;
      return { o, img, sigil, glow };
    });
  }
  open(o) { return !!state.world.opened[o.id]; }
  // the tile is barred (an obstacle that sits on a chest leaves the chest's own solidity)
  solidAt(x, y) { return this.list.some((e) => !e.o.on && e.o.x === x && e.o.y === y && !this.open(e.o)); }
  guards(chestId) { return this.list.some((e) => e.o.on === chestId && !this.open(e.o)); }
  usableAt(x, y) {
    const out = [];
    for (const e of this.list) {
      if (e.o.x !== x || e.o.y !== y || this.open(e.o)) continue;
      const can = !!state.powers[e.o.need], L = LABEL[e.o.kind];
      out.push({ type: 'obstacle', x, y, label: can ? L.can : L.cannot, verb: can ? L.verb : 'Guarda', dim: !can, e });
    }
    return out;
  }
  async use(u) {
    const { e } = u, o = e.o, sc = this.scene;
    if (!state.powers[o.need]) {
      sc.tweens.add({ targets: [e.img, e.sigil].filter(Boolean), x: '+=1', duration: 50, yoyo: true, repeat: 2 });
      emit('blocked', { kind: o.kind, need: o.need });
      return;
    }
    state.world.opened[o.id] = true; save();
    emit('opened', { id: o.id, kind: o.kind });
    if (o.kind === 'brambles') {
      sfx('fire');
      const f = sc.add.sprite(e.img.x, e.img.y + 1, 'mk-burn').setOrigin(0.5, 1).setDepth(e.img.depth + 1).setScale(1.2);
      const glow = sc.add.image(e.img.x, e.img.y - 8, 'fx-glow').setBlendMode(ADD).setDepth(9003).setScale(1.6).setAlpha(0.9);
      f.play('mk-burn');
      sc.tweens.add({ targets: e.img, alpha: 0, tint: 0x301010, duration: 600, delay: 200 });
      await new Promise((ok) => f.once('animationcomplete', ok));
      sc.tweens.add({ targets: [f, glow], alpha: 0, duration: 300, onComplete: () => { f.destroy(); glow.destroy(); } });
    } else {
      sfx('door');
      if (e.sigil) sc.tweens.add({ targets: [e.sigil, e.glow], alpha: 1, duration: 250, yoyo: true });
      const side = o.kind === 'roots' ? 0 : 12;
      await new Promise((ok) => sc.tweens.add({ targets: [e.img, e.sigil].filter(Boolean), y: o.kind === 'roots' ? '+=10' : '+=0', x: `+=${side}`, alpha: 0, duration: 700, delay: 200, ease: 'Sine.easeIn', onComplete: ok }));
      e.glow?.destroy();
    }
    e.img.destroy(); e.sigil?.destroy();
    this.list = this.list.filter((k) => k !== e);
  }
  // the carved mark glows faintly, breathing
  update(time) {
    for (const e of this.list) if (e.sigil) { const a = 0.45 + 0.35 * Math.sin(time / 600 + e.o.x); e.sigil.setAlpha(a); e.glow.setAlpha(a * 0.5); }
  }
}
