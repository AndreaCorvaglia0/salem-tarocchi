// The worlds of Altrove in the scene: their textures, and their own rule while she walks there.
//   makeLookTex(scene)        brushes, ink tiles, the page corner, the two things set in Salem
//   makeRule(scene, map)      CloudRule | PageRule | null; the scene asks it canStand / arrived / update /
//                             beforeTravel, and world.elsewhere(...) asks it to show a change (do)
//   Trinkets                  in Salem: the green bottle and the open book, while their trigger is there
// What the rule shows comes from the live visit (../elsewhere.session.js), so a scene rebuilt by a page turn
// shows the same bridges and written lines.
import Phaser from 'phaser';
import { addTex } from '../art/px.js';
import { paintClouds, holeBrush, thinBrush, shimmer, inkTile, inkMaskAt, pageCorner, bottleArt, openBookArt, PAD } from '../art/elsewhere.js';
import { live, inkOf, stepped, fell } from '../elsewhere.session.js';
import { bridges, bridgeOf, cloudOpen, cloudThin, isLanding, inkOpen, key, lineOf } from '../elsewhere.rules.js';
import { emit } from '../../core/bus.js';
import { call, has } from '../../core/services.js';

const T = 16, ADD = Phaser.BlendModes.ADD;
const sfx = (n) => { if (has('sound.play')) try { Promise.resolve(call('sound.play', n)).catch(() => {}); } catch { /* none */ } };
const wait = (scene, ms) => new Promise((r) => scene.time.delayedCall(ms, r));

export function makeLookTex(scene) {
  const add = (k, fn) => { if (!scene.textures.exists(k)) addTex(scene, k, fn()); };
  add('el-hole', holeBrush); add('el-thin', thinBrush); add('el-shimmer', shimmer);
  add('door-page', pageCorner); add('el-bottle', bottleArt); add('el-openbook', openBookArt);
}
const inkKey = (scene, mask, v) => { const k = `el-ink-${mask}-${v}`; if (!scene.textures.exists(k)) addTex(scene, k, inkTile(mask, v * 31 + mask)); return k; };

// a soft glow on the place to reach next
class Beacon {
  constructor(scene, map) {
    this.scene = scene; this.map = map;
    this.img = scene.add.image(0, 0, 'fx-glow').setBlendMode(ADD).setDepth(3).setVisible(false).setTint(0xfff0c0);
  }
  update(time) {
    const a = live.target;
    const on = !!a && a.map === this.map.id;
    this.img.setVisible(on);
    if (on) this.img.setPosition(a.x * T + 8, a.y * T + 10).setScale(0.55 + Math.sin(time / 380) * 0.08).setAlpha(0.55 + Math.sin(time / 380) * 0.15);
  }
}

// ---- clouds -----------------------------------------------------------------------------------------
class CloudRule {
  constructor(scene, map) {
    Object.assign(this, { scene, map, layers: new Map(), shims: new Map() });
    this.hole = scene.make.image({ key: 'el-hole', add: false });
    this.thin = scene.make.image({ key: 'el-thin', add: false });
    const groups = new Map([['land', []], ...bridges(map)]);
    for (let y = 0; y < map.H; y++) for (let x = 0; x < map.W; x++) if ('lu'.includes(map.at(x, y))) groups.get('land').push([x, y]);
    for (const [k, tiles] of groups) {
      const set = new Set(tiles.map(([x, y]) => key(x, y)));
      const xs = tiles.map((t) => t[0]), ys = tiles.map((t) => t[1]);
      const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
      const tk = `el-cl-${map.id}-${k}`;
      if (!scene.textures.exists(tk)) addTex(scene, tk, paintClouds(map, (tx, ty) => set.has(key(tx, ty)), box, k.length + box[0]));
      const img = scene.textures.get(tk).getSourceImage();
      const rt = scene.add.renderTexture(box[0] * T - PAD, box[1] * T - PAD, img.width, img.height).setOrigin(0).setDepth(1);
      rt.draw(tk, 0, 0);
      this.layers.set(k, { rt, ox: box[0] * T - PAD, oy: box[1] * T - PAD });
    }
    // what the visit already holds (a restart after a fall at the limit, or a reload of the scene)
    const s = live.cloud;
    for (const [k, l] of this.layers) {
      if (k === 'land') continue;
      const [f, o] = k.split(':').map(Number);
      l.rt.setAlpha(s.chosen[f] === undefined ? 0.4 : s.chosen[f] === o ? 1 : 0);
    }
    for (let y = 0; y < map.H; y++) for (let x = 0; x < map.W; x++) if (cloudThin(map, s, x, y)) this.thinAt(x, y);
    for (const k of s.holes) { const [x, y] = k.split(',').map(Number); this.holeAt(x, y); }
    this.beacon = new Beacon(scene, map);
    scene.cameras.main.setBackgroundColor('#1d2667'); // the deep sky below, past the map's edges
    if (live.falls) this.wary();
  }
  // after a fall she knows what to look for: the shimmer of the thin tiles shows a little more
  wary() { for (const s of this.shims.values()) { this.scene.tweens.killTweensOf(s); s.setAlpha(0.35); this.scene.tweens.add({ targets: s, alpha: 0.85, duration: 700, yoyo: true, repeat: -1 }); } }
  layerOf(x, y) { const b = bridgeOf(this.map.at(x, y)); return this.layers.get(b ? `${b.fork}:${b.option}` : 'land'); }
  thinAt(x, y) {
    const l = this.layerOf(x, y);
    if (!l || this.shims.has(key(x, y))) return;
    this.thin.setAlpha(0.42); l.rt.erase(this.thin, x * T - l.ox, y * T - l.oy);
    const s = this.scene.add.image(x * T + 8, y * T + 8, 'el-shimmer').setBlendMode(ADD).setDepth(2).setAlpha(0.15);
    this.scene.tweens.add({ targets: s, alpha: 0.5, duration: 900 + Math.random() * 700, yoyo: true, repeat: -1, delay: Math.random() * 800 });
    this.shims.set(key(x, y), s);
  }
  holeAt(x, y) {
    const l = this.layerOf(x, y);
    if (!l) return;
    this.hole.setAlpha(1); l.rt.erase(this.hole, x * T - l.ox - 3, y * T - l.oy - 3);
    const s = this.shims.get(key(x, y)); if (s) { s.destroy(); this.shims.delete(key(x, y)); }
  }
  canStand(x, y) { return cloudOpen(this.map, live.cloud, x, y); }
  // after a first fall she knows the shimmer: a tapped walk keeps off thin cloud (a step by step walk does not)
  avoid(x, y) { return live.falls > 0 && cloudThin(this.map, live.cloud, x, y); }
  arrived(x, y) {
    if (cloudThin(this.map, live.cloud, x, y)) return this.fall(x, y);
    if (isLanding(this.map, x, y)) live.last = { map: this.map.id, x, y };
    stepped(this.map.id, x, y);
  }
  async fall(x, y) {
    const sc = this.scene, p = sc.player, sp = p.sprite;
    sc.busy++; sc.inputs.cancel();
    live.cloud.holes.add(key(x, y)); this.holeAt(x, y);
    sfx('wrong');
    sc.cameras.main.shake(160, 0.004);
    for (let i = 0; i < 6; i++) {
      const puff = sc.add.image(x * T + 8 + (Math.random() - 0.5) * 12, y * T + 10, 'fx-smoke').setTint(0xffffff).setDepth(sp.y + 2).setScale(1.5);
      sc.tweens.add({ targets: puff, y: puff.y + 10 + Math.random() * 10, alpha: 0, scale: 3, duration: 700, onComplete: () => puff.destroy() });
    }
    p.shadow.setVisible(false);
    await new Promise((r) => sc.tweens.add({ targets: sp, y: sp.y + 26, scale: 0.25, angle: 160, alpha: 0, duration: 650, ease: 'Quad.easeIn', onComplete: r }));
    const n = fell();
    emit('elsewhere:fall', { n, max: live.maxFalls });
    this.wary();
    if (n >= live.maxFalls) { sc.busy--; this.gone = true; return; } // the visit ends (glue/elsewhere.js)
    await wait(sc, 250);
    const l = live.last && live.last.map === this.map.id ? live.last : this.map.anchors[this.map.start];
    Object.assign(p, { tx: l.x, ty: l.y }); p.place();
    sp.setScale(1).setAngle(0).setAlpha(1); p.shadow.setVisible(true);
    const y0 = sp.y;
    sp.y -= 40;
    await new Promise((r) => sc.tweens.add({ targets: sp, y: y0, duration: 420, ease: 'Bounce.easeOut', onUpdate: () => p.sync(), onComplete: r }));
    sc.busy--;
    stepped(this.map.id, l.x, l.y);
  }
  // world.elsewhere('open', ...) has already changed live.cloud: show it
  async do(cmd, a = {}) {
    if (cmd !== 'open') return;
    const sc = this.scene, tw = (targets, alpha, duration) => new Promise((r) => sc.tweens.add({ targets, alpha, duration, onComplete: r }));
    const others = [], mine = this.layers.get(`${a.fork}:${a.option}`);
    for (const [k, l] of this.layers) if (k.startsWith(`${a.fork}:`) && l !== mine) others.push(l.rt);
    sfx('stun');
    await Promise.all([others.length ? tw(others, 0, 700) : null, mine ? tw(mine.rt, 1, 500) : null]);
    for (const [x, y] of a.added || []) { this.thinAt(x, y); await wait(sc, 60); }
  }
  update(time) { this.beacon.update(time); }
}

// ---- the page ---------------------------------------------------------------------------------------
let turning = false; // a page turn is under way: the next page uncovers itself
class PageRule {
  constructor(scene, map) {
    Object.assign(this, { scene, map, imgs: new Map(), texts: new Map() });
    for (const k of inkOf(map.id)) { const [x, y] = k.split(',').map(Number); this.put(x, y, false); }
    // the sentences of the forks on this page, painted on the floor, with their blank
    for (const [ref, t] of Object.entries(live.texts)) {
      const a = map.anchors[ref];
      if (!a) continue;
      const line = lineOf(map, a), x0 = line[0][0] * T + 2, w = (a.x - line[0][0] + 1) * T - 4;
      const style = { fontFamily: '"IM Fell English", Georgia, serif', fontSize: '9px', color: '#3a2f44', fontStyle: 'italic', wordWrap: { width: w }, align: 'left', resolution: 3 };
      const s = scene.add.text(x0, a.y * T + 1, String(t).replace(/\s*_{2,}\s*$/, ''), style).setOrigin(0, 1).setDepth(4);
      const word = live.words[ref];
      const b = scene.add.text((a.x + 1) * T + 2, a.y * T + 1, word || '_____', { ...style, wordWrap: undefined, color: word ? '#9a2a22' : '#7a6a58', fontStyle: word ? 'bold italic' : 'italic' }).setOrigin(0, 1).setDepth(4);
      this.texts.set(ref, { s, b });
    }
    this.beacon = new Beacon(scene, map);
    scene.cameras.main.setBackgroundColor('#2a2030'); // the desk around the page
    if (turning) { turning = false; this.uncover(); }
  }
  isInk = (x, y) => inkOpen(this.map, inkOf(this.map.id), x, y);
  put(x, y, anim = true) {
    const k = key(x, y), v = (x * 7 + y * 3) % 2;
    let img = this.imgs.get(k);
    const tex = inkKey(this.scene, inkMaskAt(this.isInk, x, y), v);
    if (!img) { img = this.scene.add.image(x * T, y * T, tex).setOrigin(0).setDepth(1); this.imgs.set(k, img); } else img.setTexture(tex);
    if (anim) { img.setAlpha(0).setScale(0.6); this.scene.tweens.add({ targets: img, alpha: 1, scale: 1, duration: 160 }); }
    // the neighbours join the new tile
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = this.imgs.get(key(x + dx, y + dy)); if (n) n.setTexture(inkKey(this.scene, inkMaskAt(this.isInk, x + dx, y + dy), (x + dx) * 7 % 2)); }
  }
  canStand(x, y) { return this.isInk(x, y); }
  arrived(x, y) { stepped(this.map.id, x, y); }
  // world.elsewhere('write', ...) has already added the tiles to the visit: show the word, then the line
  async do(cmd, a = {}) {
    if (cmd !== 'write' || a.map !== this.map.id) return;
    const sc = this.scene;
    sc.busy++; sc.inputs.cancel();
    try {
      const t = a.fork && this.texts.get(a.fork);
      if (t && a.word) {
        t.b.setText(a.word).setColor('#9a2a22').setFontStyle('bold italic').setScale(1.6).setAlpha(0);
        sc.tweens.add({ targets: t.b, scale: 1, alpha: 1, duration: 320, ease: 'Back.easeOut' });
        sfx('write');
        await wait(sc, 450);
      }
      for (const [x, y] of a.tiles || []) { this.put(x, y); if (Math.random() < 0.25) sfx('write'); await wait(sc, 70); }
    } finally { sc.busy--; }
  }
  // the page turns: a sheet sweeps over the screen from the right, the next page uncovers from the left
  sheet() {
    const cam = this.scene.cameras.main, W = cam.width / cam.zoom, H = cam.height / cam.zoom;
    return this.scene.add.rectangle(0, 0, W, H, 0xefe3c3).setOrigin(0).setScrollFactor(0).setDepth(9500).setStrokeStyle(1, 0x8a7552);
  }
  async beforeTravel(door) {
    if (door?.look !== 'page') return;
    const r = this.sheet(), W = r.width;
    r.setOrigin(1, 0).setPosition(W, 0).setScale(0, 1);
    sfx('page');
    await new Promise((res) => this.scene.tweens.add({ targets: r, scaleX: 1, duration: 380, ease: 'Quad.easeIn', onComplete: res }));
    turning = true;
  }
  uncover() {
    const r = this.sheet();
    r.setOrigin(0, 0).setPosition(0, 0);
    this.scene.tweens.add({ targets: r, scaleX: 0, duration: 420, delay: 120, ease: 'Quad.easeOut', onComplete: () => r.destroy() });
  }
  update(time) { this.beacon.update(time); }
}

export function makeRule(scene, map) {
  const r = map.elsewhere?.rule;
  if (!r) return null;
  makeLookTex(scene);
  return r === 'clouds' ? new CloudRule(scene, map) : r === 'page' ? new PageRule(scene, map) : null;
}

// ---- in Salem: the things that start a visit -----------------------------------------------------
// TRINKETS (filled by glue/elsewhere.js): [{ id: castId, at: anchor, art: 'bottle' | 'book', dx, dy }]
export const TRINKETS = [];
export class Trinkets {
  constructor(scene, map) {
    Object.assign(this, { scene, map, items: [] });
    const mine = TRINKETS.filter((t) => map.anchors[t.at]);
    if (!mine.length) return;
    makeLookTex(scene);
    for (const t of mine) {
      const a = map.anchors[t.at], x = (a.x + (t.dx || 0)) * T + 8, y = (a.y + (t.dy || 0)) * T + 12;
      const img = scene.add.image(x, y, t.art === 'bottle' ? 'el-bottle' : 'el-openbook').setOrigin(0.5, 1).setDepth(y + 3).setVisible(false); // behind her when she stands in front
      const glow = scene.add.image(x, y - 5, 'fx-glow').setBlendMode(ADD).setTint(t.art === 'bottle' ? 0x9cf0b0 : 0xfff0c0).setScale(0.35).setDepth(y + 4).setVisible(false);
      this.items.push({ t, img, glow });
    }
    this.refresh();
  }
  refresh() {
    const here = new Set((this.scene.things?.cast || []).map((e) => e.id));
    for (const it of this.items) { const on = here.has(it.t.id); it.img.setVisible(on); it.glow.setVisible(on); }
  }
  update(time) { for (const it of this.items) if (it.glow.visible) it.glow.setAlpha(0.35 + Math.sin(time / 500) * 0.2); }
}
