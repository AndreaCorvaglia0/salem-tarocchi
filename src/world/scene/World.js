// The pixel world scene: one map at a time. It builds the map, puts the player (and Tartufo) on
// it, runs walking, using things, patrols and Exams, the night and the weather, and saves where
// the player is. Travelling to another map restarts the scene with the new map.
import Phaser from 'phaser';
import { state, save } from '../../core/state.js';
import { blocked } from '../../core/dom.js';
import { call, has } from '../../core/services.js';
import { stat } from '../../core/progress.js';
import { on, emit } from '../../core/bus.js';
import { getMap, anchorOf, nearAnchor } from '../maps.js';
import { makeFx } from '../art/fx.js';
import { makeCat } from '../art/cat.js';
import { makePerson, LOOKS } from '../art/people.js';
import { buildMap } from './build.js';
import { seasonFor, lightFor } from '../season.js';
import { Walker } from './walker.js';
import { Things, toast } from './things.js';
import { Patrol } from './patrol.js';
import { Cat } from './cat.js';
import { Night } from './night.js';
import { Weather } from './weather.js';
import { Input } from './input.js';
import { bark } from './barks.js';
import { Life } from './life.js';
import { Guide } from './guide.js';
import { Obstacles } from './obstacles.js';
import { Fog } from './fog.js';
import { Minors } from './minors.js';
import { Sense } from './sense.js';
import { guideRoute } from '../guidepath.js';

// sounds (notes/sound.md): the service may be missing (harness), then nothing plays
const MOOD = { forest: 'forest', depths: 'depths', court: 'depths' };
export const moodFor = (mapId) => MOOD[mapId] || 'village';
const sfx = (name) => { if (has('sound.play')) try { Promise.resolve(call('sound.play', name)).catch(() => {}); } catch { /* no sound */ } };
const HUD_PX = 124; // height of the HUD slip on a phone, in screen pixels
const mood = (name) => { if (has('sound.mood')) try { Promise.resolve(call('sound.mood', name)).catch(() => {}); } catch { /* no sound */ } };

const T = 16, SPEED = 165;
import { CALM_MS, SEE } from '../sight.js';

export { CALM_MS };
export const STUN_MS = 12000, STUN_COOLDOWN = 60000;
export const zoomFor = (W, H) => Math.max(1, Math.round(Math.min(W, H * 0.75) / (12 * T)));

export class WorldScene extends Phaser.Scene {
  constructor() { super('World'); }
  init(data) { this.start = data; }

  create() {
    const d = this.start, map = getMap(d.map);
    Object.assign(this, { map, busy: 0, leaving: false, reseason: false, steps: 0, calmUntil: this.time.now + 2500, stunReadyAt: 0, lastBark: -1e9, lastPatrolBark: -1e9, inDark: false, saveAt: 0 });
    this.controls = this.registry.get('controls');
    makeFx(this); makeCat(this); makePerson(this, 'ch-tu', LOOKS.tu);
    this.season = seasonFor(map.id, state.chapter); this.light = lightFor(map.id, state.chapter);
    this.built = buildMap(this, map, this.season);
    const [sx, sy] = this.freeNear(d.x, d.y);
    this.player = new Walker(this, 'ch-tu', sx, sy, d.dir || 'down');
    this.obstacles = new Obstacles(this, map); // before Things: it asks them what is solid
    this.things = new Things(this, map, this.built);
    this.fog = new Fog(this, map); this.minors = new Minors(this, map); this.sense = new Sense(this, map);
    if (this.things.solidAt(sx, sy)) { const [fx, fy] = this.freeNear(sx, sy, true); this.player.tx = fx; this.player.ty = fy; this.player.place(); }
    this.things.refresh(true);
    if (d.enter) this.things.zonesIn = new Set(); // sent here by a scene or the broom: zones under her start
    this.patrols = map.patrols.map((p) => new Patrol(this, p));
    const nb = [[-1, 0], [1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [this.player.tx + dx, this.player.ty + dy]).find(([x, y]) => this.canStand(x, y)) || [this.player.tx, this.player.ty];
    this.cat = new Cat(this, ...nb);
    this.night = new Night(this, map, this.built.lights, this.season, this.light);
    this.weather = new Weather(this, map, this.season, this.light);
    this.life = new Life(this, map, this.built, this.season, this.light);
    this.guide = new Guide(this, map); this.guide.set(this.registry.get('guide'));
    this.setMission(this.registry.get('mission'));
    this.bornAt = this.time.now;
    mood(moodFor(map.id));
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
    this.markSeen(this.player.tx, this.player.ty);
    this.cellAt(this.player.tx, this.player.ty, true);
    emit('map:enter', { map: map.id }); // glue/bonds.js: Tartufo's walks
    if (d.arrived) this.controls?.place(map.name);
    this.time.delayedCall(350, () => this.things.entered(this.player.tx, this.player.ty));
    this.game.events.emit('world:ready', map.id);
  }

  layout() {
    const cam = this.cameras.main, W = this.scale.width, H = this.scale.height, z = zoomFor(W, H);
    cam.setSize(W, H).setZoom(z);
    const vw = W / z, vh = H / z, mw = this.map.W * T, mh = this.map.H * T;
    const bx = mw < vw ? (mw - vw) / 2 : 0, by = mh < vh ? (mh - vh) / 2 : 0;
    // on a tall map the camera may rise above the first row, so what stands at the top edge (the
    // forest gate) shows below the paper slip of the HUD instead of under it
    const top = mh < vh ? 0 : Math.round(HUD_PX / z);
    cam.setBounds(bx, by - top, Math.max(mw, vw), Math.max(mh, vh) + top);
    this.night?.size();
  }

  refresh() {
    if (!this.sys.isActive()) return;
    this.things.refresh(); this.patrols.forEach((p) => p.refresh());
    // a new chapter changes the season: the map is drawn again, she stays where she is
    if (seasonFor(this.map.id, state.chapter) !== this.season || lightFor(this.map.id, state.chapter) !== this.light) this.reseason = true;
  }
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
    // nearest first, straight neighbours before diagonals (so she ends up facing a person, not beside them)
    for (let r = 1; r < 6; r++) {
      const ring = [];
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (Math.max(Math.abs(dx), Math.abs(dy)) === r) ring.push([dx, dy]);
      ring.sort((a, b) => Math.abs(a[0]) + Math.abs(a[1]) - Math.abs(b[0]) - Math.abs(b[1]));
      for (const [dx, dy] of ring) if (ok(x + dx, y + dy)) return [x + dx, y + dy];
    }
    return [x, y];
  }
  personNear(wx, wy) { // a tap on a person's body counts as a tap on their tile
    for (const n of this.things.npcs.values()) { const s = n.w.sprite; if (Math.abs(wx - s.x) < 8 && wy < s.y && wy > s.y - 30) return [n.w.tx, n.w.ty]; }
    return null;
  }

  // ---- every frame ----
  update(time, dt) {
    const p = this.player, map = this.map;
    if (this.reseason && this.canAct() && !p.moving) { this.reseason = false; this.leaving = true; this.scene.restart({ map: map.id, x: p.tx, y: p.ty, dir: p.dir }); return; }
    p.unstick();
    const free = this.canAct();
    if (free && !p.moving) {
      const dir = this.fog.steer(this.inputs.dir());
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
    this.watch(time, dt);
    this.tartufo(time);

    const dark = map.isDark(p.tx, p.ty), short = dark || map.isGrass(p.tx, p.ty);
    const fire = dark && state.powers.fire;
    this.hand.setVisible(fire).setPosition(p.sprite.x + (p.dir === 'left' ? -5 : 5), p.sprite.y - 8).setDepth(p.sprite.y + 1);
    this.night.extra = [...this.patrols.filter((q) => q.active).map((q) => ({ x: q.w.sprite.x, y: q.w.sprite.y - 10, r: 22, a: 0.8 })), ...(fire ? [{ x: this.hand.x, y: this.hand.y - 3, r: 26, a: 0.6 }] : [])];
    this.night.extra.push(...this.life.update(time, p.sprite.x, p.sprite.y - 10), ...this.guide.update(time));
    this.firstHints(time);
    this.obstacles.update(time); this.minors.update(time); this.sense.update(time);
    const fog = this.fog.update(time, dt);
    this.night.update(time, dt, { px: p.sprite.x, py: p.sprite.y - 10, shortTarget: short ? 1 : 0, cones, fog, air: !!state.powers.stun });
    this.weather.update(time, dt);
    this.prompt();
  }

  // the grimoire map reads state.stats.seen[anchor]: a place counts once she has stood near it
  markSeen(x, y) {
    const a = nearAnchor(this.map.id, x, y, 3);
    const seen = state.stats.seen || (state.stats.seen = {});
    if (a && !seen[a]) { seen[a] = true; save(); emit('seen', { anchor: a }); } // glue/traits.js
    if (this.map.inside && !seen[`${this.map.id}.door`]) { seen[`${this.map.id}.door`] = true; save(); }
  }

  // Visited 8x8-tile cells per map (state.world.cells[map]['cx,cy']): entering a cell tells the bus
  // `cell` { map, fresh, nearRoute } (glue/bonds.js: Tartufo may find a treat). quiet: just record it.
  cellAt(x, y, quiet = false) {
    const key = `${x >> 3},${y >> 3}`;
    if (key === this.cell) return;
    this.cell = key;
    const all = state.world.cells || (state.world.cells = {}), m = all[this.map.id] || (all[this.map.id] = {});
    const fresh = !m[key];
    if (fresh) { m[key] = 1; save(); }
    if (!quiet) emit('cell', { map: this.map.id, cell: key, fresh, nearRoute: this.nearRoute(x, y) });
  }
  // The mission's way on this map (the tracked or main target; glue sets it with world.mission): the
  // walkable path from where she was when the target was set. With no target, the roads count as the way.
  setMission(ref) {
    this.mission = ref || null;
    const r = ref && this.player ? guideRoute(this.map, this.player.tx, this.player.ty, ref, (x, y) => !this.things?.solidAt(x, y)) : null;
    this.route = r?.tiles?.length ? r.tiles : null;
  }
  nearRoute(x, y, d = 3) {
    if (!this.route) return this.map.tile(x, y)?.ground === 'path';
    return this.route.some(([a, b]) => Math.abs(a - x) <= d && Math.abs(b - y) <= d);
  }
  // A tap on Tartufo (input.js): near her, it is for him (glue/bonds.js gives a treat or a pat).
  catHit(wx, wy) {
    const c = this.cat?.s;
    if (!state.powers.cat || !c?.visible) return false;
    return Math.abs(wx - c.x) < 9 && wy < c.y + 3 && wy > c.y - 16;
  }
  tapCat() {
    const p = this.player, c = this.cat;
    if (Math.abs(c.tx - p.tx) + Math.abs(c.ty - p.ty) > 3) return false;
    p.faceToward(c.tx, c.ty);
    this.tweens.add({ targets: c.s, y: c.s.y - 4, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
    emit('tartufo:tap', { map: this.map.id });
    return true;
  }

  arrived(x, y, from) {
    this.cat.follow(...from);
    this.markSeen(x, y);
    state.pos = { map: this.map.id, x, y };
    stat('steps');
    if (++this.steps % 2 === 0) sfx('step');
    const dark = this.map.isDark(x, y);
    if (dark && !this.inDark && state.powers.fire) { stat('fires'); sfx('fire'); }
    this.inDark = dark;
    this.cellAt(x, y);
    this.fog.arrived(x, y, from); this.minors.arrived(x, y, this.player.dir);
    this.things.entered(x, y);
  }

  // first-time hints (another module shows the words): she has never moved; she stands by something usable
  hintOnce(id) {
    const once = state.world.once || (state.world.once = {});
    if (once[`hint.${id}`]) return;
    once[`hint.${id}`] = true; save();
    emit('hint', { id });
  }
  firstHints(time) {
    if (!this.canAct()) return;
    if (!(state.stats.steps > 0) && time - this.bornAt > 3500) this.hintOnce('move');
    if (!this.player.moving && this.things.current(this.player)) this.hintOnce('action');
    if (state.stats.steps > 0 && this.patrols.some((q) => q.active) && this.nearestPatrol(6)) this.hintOnce('patrol'); // a constable on screen, near her
  }

  prompt() {
    const c = this.controls;
    if (!c) return;
    const u = this.canAct() && !this.player.moving ? this.things.current(this.player) : null;
    c.act(u ? u.verb : null, !!u?.dim);
    if (!u) return c.prompt(null);
    const cam = this.cameras.main, v = cam.worldView, z = cam.zoom;
    const mine = u.x === this.player.tx && u.y === this.player.ty; // on her own tile: above her hat
    const lift = mine || u.type === 'npc' ? 30 : u.type === 'door' ? 4 : u.type === 'chest' ? 2 : 10;
    const wx = u.x * T + 8, wy = u.y * T + T - lift - (u.type === 'door' ? 0 : 6);
    const rect = this.game.canvas.getBoundingClientRect();
    c.prompt(u.label, rect.left + (wx - v.x) * z, rect.top + (wy - v.y) * z - 4, !!u.dim);
  }

  // ---- using things ----
  async use(u) {
    this.busy++;
    this.inputs.cancel();
    try { if (u.type === 'door') { if (await this.things.tryDoor(u.d)) { sfx('door'); this.travel(u.d.to); } } else await this.things.use(u); }
    catch (e) { console.error('[world] use', e); }
    finally { this.busy--; }
  }
  useDoor(d) { return this.use({ type: 'door', d, x: d.x, y: d.y }); }

  // enter: true when a scene (world.travel) sends her, false through a door (zones under the door wait)
  travel(ref, enter = false) {
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
      this.markSeen(x, y);
      // a scene sent her onto a zone of this map: it starts like after a walk (zones already under her wait)
      this.things.refresh();
      this.time.delayedCall(350, () => { if (this.sys.isActive()) this.things.entered(this.player.tx, this.player.ty); });
      return Promise.resolve(true);
    }
    this.leaving = true;
    return new Promise((res) => {
      this.cameras.main.fadeOut(220, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => { this.scene.restart({ map: a.map, x: a.x, y: a.y, dir, arrived: true, enter }); res(true); });
    });
  }

  // ---- patrols ----
  // a constable needs a moment to notice her (SEE.notice): a faint "?" grows over him meanwhile
  watch(time, dt) {
    const off = !this.canAct() || time < this.calmUntil || (state.world.bottleUntil || 0) > Date.now();
    const p = this.player, px = p.sprite.x, py = p.sprite.y - 6, grass = this.map.isGrass(p.tx, p.ty);
    let seen = null;
    for (const q of this.patrols) {
      const in_ = !off && q.sees(px, py, grass, this.sightBlocked, time);
      q.noticed = in_ ? (q.noticed || 0) + dt : Math.max(0, (q.noticed || 0) - 2 * dt);
      if (off) q.noticed = 0;
      q.hint(q.noticed / SEE.notice);
      if (q.noticed >= SEE.notice && !seen) seen = q;
    }
    if (seen) { seen.noticed = 0; seen.hint(0); this.spotted(seen); }
  }
  async spotted(q) {
    this.busy++;
    this.inputs.cancel();
    emit('patrol:seen', { kind: q.kind }); // glue/traits.js
    q.shout(); sfx('suspicion'); q.w.faceToward(this.player.tx, this.player.ty); this.player.faceToward(q.w.tx, q.w.ty);
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
    if (r && r.passed === false) call('world.travel', 'depths.jail'); // through the service: the glue adds the wake-up
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
    q.stun(now, STUN_MS); this.stunReadyAt = now + STUN_COOLDOWN; stat('stuns'); sfx('stun'); emit('stun', {});
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
    if (card && !this.cat.target) { this.cat.seek(card.x, card.y); sfx('cat'); if (now - this.lastBark > 12000) { this.lastBark = now; const l = bark('tartufo', 'card'); if (l) toast(l); } }
    const q = this.nearestPatrol(6);
    if (q && now - this.lastPatrolBark > 25000 && now > this.calmUntil) { this.lastPatrolBark = now; const l = bark('tartufo', 'patrol'); if (l) { toast(l); sfx('cat'); } }
  }
}
