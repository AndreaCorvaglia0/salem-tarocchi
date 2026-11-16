// Everything on a map the player can use: doors, hidden cards (a glint; Tartufo makes it obvious),
// chests and sealed doors (a question opens them), iron gates, and the story's CAST (people to
// talk to, zones that start a scene when you walk in, props to use). Re-read on bus events.
import { state, save } from '../../core/state.js';
import { test, fill } from '../../core/cond.js';
import { call, has } from '../../core/services.js';
import { emit } from '../../core/bus.js';
import { addCoins, addXp } from '../../core/progress.js';
import { MAJORS } from '../../data/cards.base.js';
import * as STORY from '../../data/story/index.js';
import { Walker } from './walker.js';
import { makePerson, lookFor } from '../art/people.js';
import { anchorOf, getMap } from '../maps.js';

const T = 16, ADD = 1;
const TOOL_NAMES = { bottle: 'una bottiglia della strega', incense: "dell'incenso", pendulum: 'un pendolo' };
export const toast = (t) => call('hud.toast', fill(t));
export const say = async (t, who = 'tu') => (has('story.say') ? call('story.say', who, fill(t)) : toast(t));

export class Things {
  constructor(scene, map, built) {
    Object.assign(this, { scene, map, npcs: new Map(), zonesIn: new Set(), lastRefuse: 0, extra: new Map() }); // extra: people not in CAST (scene/stranger.js)
    this.gates = built.gates; this.chests = built.chests;
    this.cards = MAJORS.filter((c) => c.spot && c.spot.startsWith(`${map.id}.`) && map.anchors[c.spot]).map((c) => {
      const a = map.anchors[c.spot];
      const img = scene.add.image(a.x * T + 8, a.y * T + 9, 'fx-glint').setBlendMode(ADD).setAlpha(0);
      const halo = scene.add.image(a.x * T + 8, a.y * T + 9, 'fx-glow').setBlendMode(ADD).setAlpha(0).setScale(0.7);
      return { card: c, x: a.x, y: a.y, img, halo };
    });
    this.refresh(true);
  }

  // ---- what is shown now ----
  // Il Carro is given by the story (c1.venus), not found on the ground; m19-m21 have no spot at all
  cardActive(c) { const s = state; return c.card.id !== 'm07' && !s.cards[c.card.id]?.found && (s.player.birthCard === c.card.id || s.chapter >= c.card.row); }
  activeCards() { return this.cards.filter((c) => this.cardActive(c)); }
  gateOpen(g) { return test(g.when); }
  castHere() {
    const out = new Map();
    for (const e of STORY.CAST || []) {
      if (!e.at?.startsWith(`${this.map.id}.`) || out.has(e.id)) continue;
      if (e.once && state.world.once[e.id]) continue;
      if (!test(e.when)) continue;
      const a = this.map.anchors[e.at];
      if (!a) continue;
      let { x, y } = a;
      if (e.kind === 'npc') [x, y] = this.besideDoor(x, y);
      out.set(e.id, { ...e, x, y });
    }
    for (const e of this.extra.values()) if (!out.has(e.id)) out.set(e.id, e);
    return [...out.values()];
  }
  refresh(first = false) {
    this.cast = this.castHere();
    const want = new Map(this.cast.filter((e) => e.kind === 'npc').map((e) => [e.id, e]));
    for (const [id, n] of this.npcs) if (!want.has(id) || want.get(id).who !== n.e.who || want.get(id).at !== n.e.at) { n.w.destroy(); this.npcs.delete(id); }
    for (const [id, e] of want) if (!this.npcs.has(id)) {
      const key = `ch-${e.who}`;
      makePerson(this.scene, key, lookFor(e.who));
      const w = new Walker(this.scene, key, e.x, e.y, e.face || 'down');
      this.npcs.set(id, { e, w, next: this.scene.time.now + 1000 + Math.random() * 2000 });
    }
    for (const [id, n] of this.npcs) n.e = want.get(id);
    for (const g of this.gates) g.img.setVisible(!this.gateOpen(g));
    for (const c of this.chests) c.img.setTint(state.world.opened[c.id] ? 0x6a6470 : 0xffffff);
    for (const c of this.cards) if (!this.cardActive(c)) { c.img.setAlpha(0); c.halo.setAlpha(0); }
    // where the player appears, zones that play once still start (the scene calls entered()); the others wait for a real step in
    if (first) { const p = this.scene.player; if (p) this.zonesIn = new Set(this.zonesAt(p.tx, p.ty).filter((z) => !z.once).map((z) => z.id)); }
  }

  // A person on a door's anchor would block the door: they stand one step aside.
  besideDoor(x, y) {
    const m = this.map;
    if (![[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => m.at(x + dx, y + dy) === '+')) return [x, y];
    const ok = (a, b) => !m.isSolid(a, b) && m.at(a, b) !== '+';
    return [[x + 1, y], [x - 1, y], [x + 1, y + 1], [x - 1, y + 1], [x, y + 1]].find(([a, b]) => ok(a, b)) || [x, y];
  }

  // ---- the grid ----
  solidAt(x, y) {
    for (const n of this.npcs.values()) if (n.w.tx === x && n.w.ty === y) return true;
    for (const g of this.gates) if (g.x === x && g.y === y && !this.gateOpen(g)) return true;
    return !!this.scene.obstacles?.solidAt(x, y);
  }
  gateAt(x, y) { return this.gates.find((g) => g.x === x && g.y === y && !this.gateOpen(g)) || null; }
  doorAt(x, y) { return this.map.doors.find((d) => d.x === x && d.y === y) || null; }
  zonesAt(x, y) { return this.cast.filter((e) => e.kind === 'zone' && Math.max(Math.abs(e.x - x), Math.abs(e.y - y)) <= (e.r || 0)); }

  // Usable things on one tile, best first.
  usableAt(x, y) {
    const out = [];
    // label: the words above the thing; verb: the action button
    const lostIn = (cx, cy) => this.map.fogAt(cx, cy) && !state.powers.stun; // in thick fog without the Air nothing shows
    for (const c of this.activeCards()) if (c.x === x && c.y === y && !lostIn(x, y)) out.push({ type: 'card', x, y, label: 'Qualcosa luccica', verb: 'Guarda', c });
    for (const n of this.npcs.values()) if (n.w.tx === x && n.w.ty === y) out.push({ type: 'npc', x, y, label: n.e.label ? `${n.e.label}` : 'Parla', verb: 'Parla', n });
    out.push(...(this.scene.minors?.usableAt(x, y) || []), ...(this.scene.obstacles?.usableAt(x, y) || []));
    for (const c of this.chests) if (c.x === x && c.y === y && !state.world.opened[c.id] && !this.scene.obstacles?.guards(c.id)) out.push({ type: 'chest', x, y, label: c.seal ? 'Un baule sigillato' : 'Un baule', verb: 'Apri', c });
    for (const e of this.cast) if (e.kind === 'prop' && e.x === x && e.y === y) out.push({ type: 'prop', x, y, label: e.label || 'Guarda', verb: e.verb || 'Usa', e });
    out.push(...(this.scene.herbs?.usableAt(x, y) || []));
    const d = this.doorAt(x, y);
    if (d) { const to = anchorOf(d.to); const name = to && getMap(to.map)?.name; out.push({ type: 'door', x, y, label: this.map.inside ? 'Esci' : name || 'Entra', verb: this.map.inside ? 'Esci' : 'Entra', d }); }
    const g = this.gateAt(x, y);
    if (g) out.push({ type: 'gate', x, y, label: 'Una grata', verb: 'Guarda', g });
    return out;
  }
  // What the player would use now: on her tile, in front of her, or a person next to her.
  current(p) {
    const here = this.usableAt(p.tx, p.ty).filter((u) => u.type !== 'door' && u.type !== 'herb');
    if (here.length) return here[0];
    const [fx, fy] = p.facing();
    const front = this.usableAt(fx, fy).filter((u) => u.type !== 'herb');
    if (front.length) return front[0];
    for (const [dx, dy] of [[0, 1], [0, -1], [-1, 0], [1, 0]]) {
      const u = this.usableAt(p.tx + dx, p.ty + dy).find((v) => v.type === 'npc' || v.type === 'card' || v.type === 'prop' || v.type === 'minor');
      if (u) return u;
    }
    return this.scene.herbs?.near(p) || null; // plants come last (scene/herbs.js)
  }

  // ---- using things ----
  async use(u) {
    const sc = this.scene;
    if (u.type !== 'door') sc.player.faceToward(u.x, u.y);
    if (u.type === 'card') { await call('card.found', u.c.card.id); u.c.img.setAlpha(0); u.c.halo.setAlpha(0); sc.cat?.release(); }
    else if (u.type === 'npc') {
      const n = u.n; n.w.faceToward(sc.player.tx, sc.player.ty);
      state.world.talked[n.e.id] = (state.world.talked[n.e.id] || 0) + 1;
      if (n.e.once) state.world.once[n.e.id] = true;
      save();
      emit('talk', { id: n.e.id, at: n.e.at }); // glue/traits.js
      if (n.e.run) await n.e.run();
      else if (n.e.script) await call('story.run', n.e.script);
    } else if (u.type === 'prop') {
      state.world.talked[u.e.id] = (state.world.talked[u.e.id] || 0) + 1;
      if (u.e.once) state.world.once[u.e.id] = true;
      save();
      if (u.e.script) await call('story.run', u.e.script);
    } else if (u.type === 'chest') await this.openChest(u.c);
    else if (u.type === 'door') return this.tryDoor(u.d);
    else if (u.type === 'gate') await say(u.g.refuse || 'Chiuso.');
    else if (u.type === 'obstacle') await sc.obstacles.use(u);
    else if (u.type === 'minor') await sc.minors.use(u);
    else if (u.type === 'herb') await sc.herbs.use(u);
    this.refresh();
  }

  async openChest(c) {
    const ok = await call('lock.ask', { ...(c.ask || {}), label: c.ask?.label || (c.seal ? 'Un sigillo' : 'Un baule chiuso') });
    if (!ok) return;
    state.world.opened[c.id] = true;
    const g = c.give || {};
    if (g.tool) { state.tools[g.tool] = (state.tools[g.tool] || 0) + (g.n || 1); toast(`Dentro c'è ${TOOL_NAMES[g.tool] || g.tool}.`); }
    if (g.coins) { addCoins(g.coins); if (!g.tool) toast(`Dentro ci sono ${g.coins} monete.`); }
    if (g.xp) addXp(g.xp, 'chest');
    save();
  }

  // A door: true if the player may go through (the scene then travels).
  async tryDoor(d) {
    if (d.when && !test(d.when)) {
      if (this.scene.time.now - this.lastRefuse > 1500) { this.lastRefuse = this.scene.time.now; await say(d.refuse || 'È chiuso.'); }
      return false;
    }
    if (d.seal && !state.world.opened[d.id]) {
      const ok = await call('lock.ask', { ...(d.ask || {}), label: d.ask?.label || 'Una porta sigillata' });
      if (!ok) return false;
      state.world.opened[d.id] = true; save();
    }
    return true;
  }

  // The player arrived on a tile: zones start their scene.
  async entered(x, y) {
    const now = this.zonesAt(x, y), ids = new Set(now.map((z) => z.id));
    const fresh = now.filter((z) => !this.zonesIn.has(z.id));
    this.zonesIn = ids;
    for (const z of fresh) {
      if (z.once) state.world.once[z.id] = true;
      state.world.talked[z.id] = (state.world.talked[z.id] || 0) + 1;
      save();
      if (z.script) await call('story.run', z.script);
      this.refresh();
    }
  }

  // ---- every frame: glints and people's small idle motions ----
  update(time, p) {
    const cat = !!state.powers.cat;
    for (const c of this.cards) {
      if (!this.cardActive(c) || (this.map.fogAt(c.x, c.y) && !state.powers.stun)) { c.img.setAlpha(0); c.halo.setAlpha(0); continue; }
      const d = Math.hypot(c.x - p.tx, c.y - p.ty), range = cat ? 7 : 4;
      const pulse = 0.5 + Math.sin(time / (cat ? 260 : 420) + c.x) * 0.5;
      const a = d > range ? 0 : cat ? 0.65 + pulse * 0.35 : (0.18 + pulse * 0.32) * (1 - d / (range + 1)) * 1.6;
      c.img.setAlpha(Math.min(1, a)).setScale(cat ? 1 + pulse * 0.4 : 0.7 + pulse * 0.2).setAngle(time / 40 % 360 * (cat ? 1 : 0)).setDepth(cat ? 9002 : c.y * T + T + 3);
      c.halo.setAlpha(cat && d <= range ? 0.35 + pulse * 0.25 : 0).setDepth(9001);
    }
    for (const n of this.npcs.values()) {
      if (time < n.next || n.w.moving) continue;
      n.next = time + 1800 + Math.random() * 2600;
      const near = Math.abs(n.w.tx - p.tx) + Math.abs(n.w.ty - p.ty) <= 3;
      if (near) n.w.faceToward(p.tx, p.ty);
      else n.w.face(['down', 'left', 'right', 'down', 'up'][Math.floor(Math.random() * 5)]);
      this.scene.tweens.add({ targets: n.w.sprite, scaleY: 1.04, duration: 220, yoyo: true });
    }
  }
}
