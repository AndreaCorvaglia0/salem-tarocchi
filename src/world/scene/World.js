// The pixel world scene: one map at a time. It builds the map, puts the player (and Tartufo) on
// it, runs walking, using things, patrols and Exams, the night and the weather, and saves where
// the player is. Travelling to another map restarts the scene with the new map.
import Phaser from 'phaser';
import { state, save } from '../../core/state.js';
import { blocked } from '../../core/dom.js';
import { call } from '../../core/services.js';
import { stat } from '../../core/progress.js';
import { on } from '../../core/bus.js';
import { getMap, anchorOf, nearAnchor } from '../maps.js';
import { makeFx } from '../art/fx.js';
import { makeCat } from '../art/cat.js';
import { makePerson, LOOKS } from '../art/people.js';
import { buildMap } from './build.js';
import { Walker } from './walker.js';
import { Things, toast } from './things.js';
import { Patrol } from './patrol.js';
import { Cat } from './cat.js';
import { Night } from './night.js';
import { Weather } from './weather.js';
import { Input } from './input.js';
import { bark } from './barks.js';

const T = 16, SPEED = 165;
export const CALM_MS = 20000, STUN_MS = 12000, STUN_COOLDOWN = 60000;
export const zoomFor = (W, H) => Math.max(1, Math.round(Math.min(W, H * 0.75) / (12 * T)));

export class WorldScene extends Phaser.Scene {
  constructor() { super('World'); }
  init(data) { this.start = data; }

  create() {
    const d = this.start, map = getMap(d.map);
    Object.assign(this, { map, busy: 0, leaving: false, calmUntil: this.time.now + 2500, stunReadyAt: 0, lastBark: -1e9, lastPatrolBark: -1e9, inDark: false, saveAt: 0 });
    this.controls = this.registry.get('controls');
    makeFx(this); makeCat(this); makePerson(this, 'ch-tu', LOOKS.tu);
    this.built = buildMap(this, map);
    const [sx, sy] = this.freeNear(d.x, d.y);
    this.player = new Walker(this, 'ch-tu', sx, sy, d.dir || 'down');
    this.things = new Things(this, map, this.built);
    if (this.things.solidAt(sx, sy)) { const [fx, fy] = this.freeNear(sx, sy, true); this.player.tx = fx; this.player.ty = fy; this.player.place(); }
    this.things.refresh(true);
    this.patrols = map.patrols.map((p) => new Patrol(this, p));
    const nb = [[-1, 0], [1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [this.player.tx + dx, this.player.ty + dy]).find(([x, y]) => this.canStand(x, y)) || [this.player.tx, this.player.ty];
    this.cat = new Cat(this, ...nb);
    this.night = new Night(this, map, this.built.lights);
    this.weather = new Weather(this, map);
    this.inputs = new Input(this);
    this.hand = this.add.sprite(0, 0, 'fx-flame').setOrigin(0.5, 1).setScale(0.55).setVisible(false).play('flame');
    this.input.keyboard?.on('keydown-Q', () => this.stun());

    const cam = this.cameras.main;
    cam.setRoundPixels(true);
    this.layout();
    cam.startFollow(this.player.sprite, true, 0.18, 0.18, 0, 10);
    cam.centerOn(this.player.sprite.x, this.player.sprite.y - 10);
    cam.fadeIn(280, 0, 0, 0);
    this.scale.on('resize', this.layout, this);

    const offs = ['step', 'flag', 'chapter', 'card:found', 'level:up', 'card:recovered'].map((e) => on(e, () => this.refresh()));
    this.events.once('shutdown', () => { offs.forEach((f) => f()); this.scale.off('resize', this.layout, this); this.night.destroy(); this.controls?.prompt(null); });
    state.pos = { map: map.id, x: this.player.tx, y: this.player.ty }; save();
    if (d.arrived) this.controls?.place(map.name);
    this.time.delayedCall(350, () => this.things.entered(this.player.tx, this.player.ty));
    this.game.events.emit('world:ready', map.id);
  }

  layout() {
    const cam = this.cameras.main, W = this.scale.width, H = this.scale.height, z = zoomFor(W, H);
    cam.setSize(W, H).setZoom(z);
    const vw = W / z, vh = H / z, mw = this.map.W * T, mh = this.map.H * T;
    const bx = mw < vw ? (mw - vw) / 2 : 0, by = mh < vh ? (mh - vh) / 2 : 0;
    cam.setBounds(bx, by, Math.max(mw, vw), Math.max(mh, vh));
    this.night?.size();
  }

  refresh() { if (!this.sys.isActive()) return; this.things.refresh(); this.patrols.forEach((p) => p.refresh()); }
  canAct() { return !blocked() && !this.busy && !this.leaving; }

  // ---- the grid ----
  patrolAt(x, y) { return this.patrols.some((p) => p.active && p.w.tx === x && p.w.ty === y); }
  canStand(x, y) { return !this.map.isSolid(x, y) && this.map.at(x, y) !== '+' && !this.things.solidAt(x, y) && !this.patrolAt(x, y); }
  canEnter = (x, y) => {
    const door = this.things.doorAt(x, y);
    if (door) return { door };
    const gate = this.things.gateAt(x, y);
    if (gate) return { gate };
    return this.canStand(x, y);
  };
  sightBlocked = (x, y) => this.map.isSolid(x, y) && this.map.tile(x, y).ground !== 'water';
  freeNear(x, y, strict = false) {
    const ok = (a, b) => !this.map.isSolid(a, b) && this.map.at(a, b) !== '+' && (!strict || !this.things.solidAt(a, b));
    if (ok(x, y)) return [x, y];
    for (let r = 1; r < 6; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (ok(x + dx, y + dy)) return [x + dx, y + dy];
    return [x, y];
  }
  personNear(wx, wy) { // a tap on a person's body counts as a tap on their tile
    for (const n of this.things.npcs.values()) { const s = n.w.sprite; if (Math.abs(wx - s.x) < 8 && wy < s.y && wy > s.y - 26) return [n.w.tx, n.w.ty]; }
    return null;
  }

  // ---- every frame ----
  update(time, dt) {
    const p = this.player, map = this.map;
    p.unstick();
    const free = this.canAct();
    if (free && !p.moving) {
      const dir = this.inputs.dir();
      if (dir) {
        const from = [p.tx, p.ty];
        const r = p.step(dir, this.canEnter, SPEED, (nx, ny) => this.arrived(nx, ny, from));
        if (r && r.door) { this.inputs.cancel(); this.useDoor(r.door); }
        else if (r && r.gate) { this.inputs.cancel(); this.use({ type: 'gate', g: r.gate, x: r.gate.x, y: r.gate.y }); }
        else if (r !== true) this.inputs.cancel();
      } else p.stopAnim();
      if (this.canAct() && this.inputs.act()) { const u = this.things.current(p); if (u) this.use(u); }
    } else if (!free && !p.moving) { p.stopAnim(); if (blocked()) this.inputs.cancel(); }

    this.cat.update(p, (x, y) => this.canStand(x, y));
    this.things.update(time, p);
    const paused = !this.canAct();
    const cones = [];
    for (const pt of this.patrols) {
      pt.update(time, paused, (x, y) => !map.isSolid(x, y) && map.at(x, y) !== '+' && !(x === p.tx && y === p.ty) && !this.things.solidAt(x, y));
      const m = pt.draw(time, this.sightBlocked);
      if (m) cones.push(m);
    }
    this.watch(time);
    this.tartufo(time);

    const dark = map.isDark(p.tx, p.ty), short = dark || map.isGrass(p.tx, p.ty);
    const fire = dark && state.powers.fire;
    this.hand.setVisible(fire).setPosition(p.sprite.x + (p.dir === 'left' ? -5 : 5), p.sprite.y - 8).setDepth(p.sprite.y + 1);
    this.night.extra = [...this.patrols.filter((q) => q.active).map((q) => ({ x: q.w.sprite.x, y: q.w.sprite.y - 10, r: 22, a: 0.8 })), ...(fire ? [{ x: this.hand.x, y: this.hand.y - 3, r: 26, a: 0.6 }] : [])];
    this.night.update(time, dt, { px: p.sprite.x, py: p.sprite.y - 10, shortTarget: short ? 1 : 0, cones });
    this.weather.update(time, dt);
    this.prompt();
  }

  arrived(x, y, from) {
    this.cat.follow(...from);
    state.pos = { map: this.map.id, x, y };
    stat('steps');
    const dark = this.map.isDark(x, y);
    if (dark && !this.inDark && state.powers.fire) stat('fires');
    this.inDark = dark;
    this.things.entered(x, y);
  }

  prompt() {
    const c = this.controls;
    if (!c) return;
    const u = this.canAct() && !this.player.moving ? this.things.current(this.player) : null;
    c.act(u ? u.verb : null);
    if (!u) return c.prompt(null);
    const cam = this.cameras.main, v = cam.worldView, z = cam.zoom;
    const mine = u.x === this.player.tx && u.y === this.player.ty; // on her own tile: above her hat
    const lift = mine || u.type === 'npc' ? 30 : u.type === 'door' ? 4 : u.type === 'chest' ? 2 : 10;
    const wx = u.x * T + 8, wy = u.y * T + T - lift - (u.type === 'door' ? 0 : 6);
    const rect = this.game.canvas.getBoundingClientRect();
    c.prompt(u.label, rect.left + (wx - v.x) * z, rect.top + (wy - v.y) * z - 4);
  }

  // ---- using things ----
  async use(u) {
    this.busy++;
    this.inputs.cancel();
    try { if (u.type === 'door') { if (await this.things.tryDoor(u.d)) this.travel(u.d.to); } else await this.things.use(u); }
    catch (e) { console.error('[world] use', e); }
    finally { this.busy--; }
  }
  useDoor(d) { return this.use({ type: 'door', d, x: d.x, y: d.y }); }

  travel(ref) {
    const a = anchorOf(ref);
    if (!a) { console.warn(`[world] unknown anchor ${ref}`); return Promise.resolve(false); }
    const m = getMap(a.map);
    const door = [[0, 1, 'up'], [0, -1, 'down'], [-1, 0, 'right'], [1, 0, 'left']].find(([dx, dy]) => m.at(a.x + dx, a.y + dy) === '+');
    const dir = door ? door[2] : 'down';
    this.inputs.cancel();
    if (a.map === this.map.id) {
      const [x, y] = this.freeNear(a.x, a.y, true);
      this.player.stepping?.tw?.stop(); this.player.moving = false;
      Object.assign(this.player, { tx: x, ty: y }); this.player.place(); this.player.face(dir);
      this.cameras.main.centerOn(this.player.sprite.x, this.player.sprite.y);
      state.pos = { map: a.map, x, y }; save();
      return Promise.resolve(true);
    }
    this.leaving = true;
    return new Promise((res) => {
      this.cameras.main.fadeOut(220, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => { this.scene.restart({ map: a.map, x: a.x, y: a.y, dir, arrived: true }); res(true); });
    });
  }

  // ---- patrols ----
  watch(time) {
    if (!this.canAct() || time < this.calmUntil || (state.world.bottleUntil || 0) > Date.now()) return;
    const p = this.player, px = p.sprite.x, py = p.sprite.y - 6, grass = this.map.isGrass(p.tx, p.ty);
    const seen = this.patrols.find((q) => q.sees(px, py, grass, this.sightBlocked, time));
    if (seen) this.spotted(seen);
  }
  async spotted(q) {
    this.busy++;
    this.inputs.cancel();
    q.shout(); q.w.faceToward(this.player.tx, this.player.ty); this.player.faceToward(q.w.tx, q.w.ty);
    this.cameras.main.shake(140, 0.003);
    let r = null;
    try {
      const line = bark(q.kind === 'afflicted' ? 'afflicted' : 'constable', 'seen');
      if (line) toast(line);
      await new Promise((ok) => this.time.delayedCall(650, ok));
      r = await call('exam.start', { kind: q.kind, place: nearAnchor(this.map.id, this.player.tx, this.player.ty, 8) || this.map.id });
    } catch (e) { console.error('[world] exam', e); }
    q.calm();
    this.calmUntil = this.time.now + CALM_MS;
    this.busy--;
    if (r && r.passed === false) this.travel('depths.jail');
  }
  nearestPatrol(max = 7) {
    const p = this.player;
    let best = null, bd = max + 1;
    for (const q of this.patrols) { if (!q.active) continue; const d = Math.hypot(q.w.tx - p.tx, q.w.ty - p.ty); if (d < bd) { bd = d; best = q; } }
    return best;
  }
  stun() {
    const now = this.time.now;
    if (!state.powers.stun || now < this.stunReadyAt || !this.canAct()) return;
    const q = this.nearestPatrol();
    if (!q) return;
    q.stun(now, STUN_MS); this.stunReadyAt = now + STUN_COOLDOWN; stat('stuns');
    this.cameras.main.flash(160, 200, 210, 255);
    toast(q.kind === 'afflicted' ? 'Si ferma, smarrita. Hai un momento.' : 'Il conestabile barcolla. Hai un momento.');
  }

  // Tartufo smells cards and constables (only with the cat).
  tartufo(time) {
    const c = this.controls, now = time;
    const near = state.powers.stun && this.nearestPatrol();
    c?.stun(!!near, now >= this.stunReadyAt);
    if (!state.powers.cat || !this.canAct()) return;
    const p = this.player;
    const card = this.things.activeCards().find((k) => Math.hypot(k.x - p.tx, k.y - p.ty) <= 6);
    if (card && !this.cat.target) { this.cat.seek(card.x, card.y); if (now - this.lastBark > 12000) { this.lastBark = now; const l = bark('tartufo', 'card'); if (l) toast(l); } }
    const q = this.nearestPatrol(6);
    if (q && now - this.lastPatrolBark > 25000 && now > this.calmUntil) { this.lastPatrolBark = now; const l = bark('tartufo', 'patrol'); if (l) toast(l); }
  }
}
