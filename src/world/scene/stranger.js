// Someone in the street who stops her (glue/street.js): a person who appears on a road tile a few steps
// from her, waits, and leaves after the exchange, after a while, or when a constable comes near.
// It lives in Things.extra, so it is drawn, solid, tappable and usable like a CAST npc; using it calls
// spec.run() instead of a script.
//   show({ id?, who, label, run }) -> true if the person is on the map (false: indoors, a patrol near, no spot)
//   hide()                         the person fades out and is gone
const T = 16;
export const STRANGER_ID = 'street.stranger';

export class Stranger {
  constructor(scene) { this.scene = scene; this.e = null; this.talking = false; }
  get here() { return !!this.e; }

  // a free road tile 2-5 steps away (nearest to 3 first); a plain free tile if there is no road
  spot() {
    const sc = this.scene, m = sc.map, p = sc.player;
    const near = (x, y) => [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => m.at(x + dx, y + dy) === '+');
    const ok = (x, y) => sc.canStand(x, y) && !(x === p.tx && y === p.ty) && !(x === sc.cat?.tx && y === sc.cat?.ty) && !near(x, y);
    const all = [];
    for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) {
      const d = Math.abs(dx) + Math.abs(dy);
      if (d < 2 || d > 5) continue;
      const x = p.tx + dx, y = p.ty + dy;
      if (ok(x, y)) all.push({ x, y, d, road: m.tile(x, y)?.ground === 'path' });
    }
    all.sort((a, b) => (b.road - a.road) || Math.abs(a.d - 3) - Math.abs(b.d - 3));
    return all[0] || null;
  }

  show(spec = {}) {
    const sc = this.scene;
    if (this.e || !sc.map.open || !sc.canAct() || sc.nearestPatrol(9)) return false;
    const at = this.spot();
    if (!at) return false;
    const id = spec.id || STRANGER_ID;
    this.e = { id, kind: 'npc', who: spec.who || 'street', label: spec.label || 'Una persona', x: at.x, y: at.y, run: async () => {
      this.talking = true;
      try { await spec.run?.(); } finally { this.talking = false; }
    } };
    sc.things.extra.set(id, this.e);
    sc.things.refresh();
    const n = sc.things.npcs.get(id);
    if (n) {
      n.w.faceToward(sc.player.tx, sc.player.ty);
      n.w.sprite.setAlpha(0); n.w.shadow.setAlpha(0);
      sc.tweens.add({ targets: [n.w.sprite, n.w.shadow], alpha: 1, duration: 500 });
      // a small raised hand, so she sees someone calling her
      if (n.w.sprite.texture.frameTotal > 10) { n.w.sprite.anims.stop(); n.w.sprite.setFrame(9); sc.time.delayedCall(900, () => { if (!n.w.gone) n.w.rest(); }); }
    }
    return true;
  }

  hide() {
    const sc = this.scene, e = this.e;
    if (!e) return;
    this.e = null;
    const n = sc.things.npcs.get(e.id);
    const gone = () => { sc.things.extra.delete(e.id); if (sc.sys.isActive()) sc.things.refresh(); };
    if (!n || n.w.gone) return gone();
    sc.tweens.add({ targets: [n.w.sprite, n.w.shadow], alpha: 0, y: `-=${T / 4}`, duration: 450, onComplete: gone });
  }

  // a constable coming near: the person slips away (not while they are talking to her)
  update() {
    if (this.e && !this.talking && this.scene.canAct() && this.scene.nearestPatrol(6)) this.hide();
  }
}
