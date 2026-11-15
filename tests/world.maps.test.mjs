// The world's maps: they parse, every anchor of the contract exists and can be reached on foot,
// doors lead somewhere real, card spots exist, patrol routes are walkable.
import test from 'node:test';
import assert from 'node:assert/strict';
import { MAPS, allAnchors, CHAPTER_START } from '../src/world/maps.js';
import { findPath } from '../src/world/path.js';
import { MAJORS } from '../src/data/cards.base.js';
import { KINDS } from '../src/world/tiles.js';

const CONTRACT = `village.arrival village.square village.malva_door village.cottage_door village.stall village.curtain
village.garden village.venusglass village.cart village.court_door village.meeting_door village.shop_door
village.forest_gate village.trapdoor malva.hearth malva.table cottage.table cottage.bed cottage.door court.chair
court.dock court.deposit court.stairs meeting.bible shop.counter forest.entry forest.ortica_hut forest.campfire
forest.den forest.lantern forest.mill forest.boundary forest.pond forest.graveyard forest.spring depths.entry
depths.edera_nook depths.coven depths.chains depths.tower depths.well depths.swamp depths.jail`.split(/\s+/);

const maps = MAPS();
// a tile one can stand on: not solid, not a chest, not a door (stepping on a door travels)
const walk = (m) => (x, y) => !m.isSolid(x, y) && m.at(x, y) !== '+';

test('every map parses without errors', () => {
  for (const m of Object.values(maps)) assert.deepEqual(m.errors, [], m.id);
});

test('every anchor of the contract exists and stands on a walkable tile', () => {
  const all = allAnchors();
  for (const id of CONTRACT) {
    const a = all[id];
    assert.ok(a, `missing anchor ${id}`);
    assert.ok(walk(maps[a.map])(a.x, a.y), `${id} at ${a.x},${a.y} is not walkable (${maps[a.map].at(a.x, a.y)})`);
  }
  for (const [id, a] of Object.entries(all)) assert.ok(walk(maps[a.map])(a.x, a.y), `${id} is not walkable`);
});

test('chapter starts and map starts are anchors', () => {
  const all = allAnchors();
  for (const ref of Object.values(CHAPTER_START)) assert.ok(all[ref], ref);
  for (const m of Object.values(maps)) assert.ok(all[m.start], `${m.id} start ${m.start}`);
});

test('every door is a + tile and leads to an existing anchor', () => {
  const all = allAnchors();
  for (const m of Object.values(maps)) for (const d of m.doors) {
    assert.equal(m.at(d.x, d.y), '+', `${d.id}`);
    assert.ok(d.to && all[d.to], `${d.id} leads to ${d.to}`);
  }
});

test('every + tile belongs to a door', () => {
  for (const m of Object.values(maps)) for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) {
    if (m.at(x, y) !== '+') continue;
    const house = m.blocks.some((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h && !m.doors.some((d) => d.x === x && d.y === y));
    assert.ok(m.doors.some((d) => d.x === x && d.y === y) || house, `${m.id}: + at ${x},${y} has no door`);
  }
});

test('every card spot is an anchor', () => {
  const all = allAnchors();
  for (const c of MAJORS) if (c.spot) assert.ok(all[c.spot], `${c.id} spot ${c.spot}`);
});

test('from each map start the player can walk to each of its anchors (gates open)', () => {
  for (const m of Object.values(maps)) {
    const s = m.anchors[m.start];
    for (const [id, a] of Object.entries(m.anchors)) {
      const p = findPath(s.x, s.y, new Set([`${a.x},${a.y}`]), walk(m));
      assert.ok(p, `${m.id}: no walk from ${m.start} to ${id}`);
    }
  }
});

test('the cells reach the court stairs with the gate shut', () => {
  const m = maps.depths, a = m.anchors['depths.jail'], b = m.anchors['depths.cells'];
  const shut = new Set(m.gates.map((g) => `${g.x},${g.y}`));
  assert.ok(findPath(a.x, a.y, new Set([`${b.x},${b.y}`]), (x, y) => walk(m)(x, y) && !shut.has(`${x},${y}`)));
});

test('patrol routes are walkable and connected', () => {
  for (const m of Object.values(maps)) for (const p of m.patrols) {
    for (const [x, y] of p.route) assert.ok(walk(m)(x, y), `${p.id} waypoint ${x},${y}`);
    for (let i = 0; i < p.route.length; i++) {
      const [ax, ay] = p.route[i], [bx, by] = p.route[(i + 1) % p.route.length];
      assert.ok(findPath(ax, ay, new Set([`${bx},${by}`]), walk(m)), `${p.id} leg ${i}`);
    }
  }
});

test('every block kind is known', () => {
  for (const m of Object.values(maps)) for (const b of m.blocks) assert.ok(KINDS[b.kind], `${m.id} ${b.kind}`);
});

test('every block kind has art', async () => {
  const { hasArt } = await import('../src/world/art/blocks.js');
  for (const k of Object.keys(KINDS)) assert.ok(hasArt(k), k);
});

test('every CAST entry stands on an existing anchor', async () => {
  const { CAST } = await import('../src/data/story/index.js');
  const all = allAnchors();
  for (const e of CAST || []) assert.ok(all[e.at], `${e.id} at ${e.at}`);
});

test('the arrival is a gentle tutorial: short straight road, the card, Malva\'s door, nothing else', async () => {
  const { test: cond } = await import('../src/core/cond.js');
  const { fresh } = await import('../src/core/state.js');
  const m = maps.village, A = (n) => m.anchors[`village.${n}`];
  const walkTo = (a, b) => findPath(a.x, a.y, new Set([`${b.x},${b.y}`]), walk(m));
  const toCard = walkTo(A('arrival'), A('road_card')), toDoor = walkTo(A('road_card'), A('malva_door'));
  assert.ok(toCard && toCard.length <= 5, 'the card is a few steps ahead');
  assert.ok(toDoor && toDoor.length <= 6, 'the door is a short walk further on');
  assert.ok(A('malva_door').y < A('arrival').y, 'she walks on, up the road');
  // nothing else to use along the way: no other door, chest or gate within 4 tiles of the stretch
  const stretch = [A('arrival'), A('road_card'), A('malva_door')];
  const near = (x, y) => stretch.some((a) => Math.abs(a.x - x) + Math.abs(a.y - y) <= 4);
  for (const d of m.doors) if (d.anchor !== 'village.malva_door') assert.ok(!near(d.x, d.y), `door ${d.id} on the arrival stretch`);
  for (const c of m.chests) assert.ok(!near(c.x, c.y), `chest ${c.id} on the arrival stretch`);
  // no patrol walks before the first Exam scene
  for (const step of ['p.road', 'c1.malva', 'c1.cottage', 'c1.client']) for (const ch of [0, 1]) {
    const s = { ...fresh(), chapter: ch, step };
    for (const p of m.patrols) assert.ok(!cond(p.when, s), `${p.id} is out at ${step}`);
  }
});

test('the guide leads to the anchor, or to the first door on the way there', async () => {
  const { guideRoute } = await import('../src/world/guidepath.js');
  const v = maps.village, a = v.anchors['village.arrival'];
  const r1 = guideRoute(v, a.x, a.y, 'village.malva_door');
  assert.deepEqual(r1.dest, [v.anchors['village.malva_door'].x, v.anchors['village.malva_door'].y]);
  assert.ok(r1.tiles.length > 0);
  const r2 = guideRoute(v, a.x, a.y, 'malva.hearth');
  assert.deepEqual(r2.dest, [v.anchors['village.malva_door'].x, v.anchors['village.malva_door'].y]);
  const r3 = guideRoute(v, a.x, a.y, 'forest.campfire');
  assert.deepEqual(r3.dest, [v.anchors['village.forest_gate'].x, v.anchors['village.forest_gate'].y]);
  const c = maps.cottage, d = c.anchors['cottage.door'];
  assert.ok(guideRoute(c, d.x, d.y, 'depths.coven'), 'from a room to the depths');
});

// ---- obstacles, fog, Minors in the grass, and what each chapter's powers reach ----
const POW = { 1: { cat: true }, 2: { cat: true, fire: true }, 3: { cat: true, fire: true, sense: true, broom: true, stun: true } };

test('every obstacle has a known kind and the magic it needs; every grass suit is valid', async () => {
  const { NEED } = await import('../src/world/reach.js');
  for (const m of Object.values(maps)) {
    for (const o of m.obstacles) {
      assert.ok(NEED[o.kind], `${o.id}: kind ${o.kind}`);
      assert.equal(o.need, NEED[o.kind], `${o.id}: need ${o.need}`);
      if (!o.on) assert.ok(!m.isSolid(o.x, o.y) && m.at(o.x, o.y) !== '+', `${o.id} must sit on a walkable tile`);
    }
    for (const z of m.def.suits || []) assert.ok(['p', 's', 'w', 'c'].includes(z.suit), `${m.id} suit ${z.suit}`);
  }
  const tagged = (id, suit) => { const m = maps[id]; let n = 0; for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) if (m.suitAt(x, y) === suit) n++; return n; };
  for (const [id, suit] of [['village', 'p'], ['village', 's'], ['forest', 'w'], ['forest', 'c'], ['depths', 'c']]) assert.ok(tagged(id, suit) >= 10, `${id} has grass of suit ${suit}`);
  // never on the arrival road before Malva's door
  const v = maps.village, a = v.anchors['village.arrival'], d = v.anchors['village.malva_door'];
  for (let y = d.y; y <= a.y + 1; y++) for (let x = a.x - 6; x <= a.x + 6; x++) assert.equal(v.suitAt(x, y), null, `suit on the arrival road at ${x},${y}`);
});

test('each chapter\'s Major spots are reachable with the powers of that chapter; the Hermit needs the Air', async () => {
  const { explore, reached, stateWith } = await import('../src/world/reach.js');
  const at = (ch, powers) => explore('village.arrival', stateWith({ chapter: ch, powers, flags: { 'shop.open': true } }));
  for (const ch of [1, 2, 3]) {
    const prev = at(ch, POW[ch]);
    for (const c of MAJORS.filter((k) => k.spot && k.row === ch)) {
      if (c.id === 'm09') continue;
      assert.ok(reached(prev, c.spot), `chapter ${ch}: ${c.id} at ${c.spot} out of reach`);
    }
  }
  assert.ok(!reached(at(2, POW[2]), 'forest.lantern'), 'the lantern needs the Air');
  assert.ok(reached(at(2, { ...POW[2], stun: true }), 'forest.lantern'), 'with the Air the lantern is reachable');
  assert.ok(!reached(at(2, { cat: true }), 'forest.graveyard'), 'the brambles bar the graveyard without Fire');
  assert.ok(!reached(at(3, { ...POW[3], fire: false }), 'depths.chains'), 'the brambles bar the chains without Fire');
  assert.ok(!reached(at(3, { ...POW[3], stun: false }), 'depths.swamp'), 'the swamp fog needs the Air');
  // Earth (move) gates nothing required: every Major reachable with it is reachable without it
  const all = { ...POW[3] }, withMove = at(3, { ...all, move: true }), without = at(3, all);
  for (const c of MAJORS.filter((k) => k.spot)) assert.equal(reached(without, c.spot), reached(withMove, c.spot), `${c.id} needs Earth`);
  // every step of the main path can be walked with its chapter's powers
  const { STEPS } = await import('../src/data/story/index.js');
  for (const st of STEPS) if (st.at && st.chapter >= 1 && st.chapter <= 3) assert.ok(reached(at(st.chapter, POW[st.chapter]), st.at), `step ${st.id} at ${st.at}`);
});

test('the fog is deep enough: without the Air she is turned back before the lantern', async () => {
  const { FOG } = await import('../src/world/reach.js');
  const m = maps.forest, a = m.anchors['forest.lantern'];
  // walking in the fog from any edge tile, the lantern is more than FOG.lost steps in
  const edge = [];
  for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) if (m.fogAt(x, y) && walk(m)(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => walk(m)(x + dx, y + dy) && !m.fogAt(x + dx, y + dy))) edge.push([x, y]);
  assert.ok(edge.length, 'the fog has an edge');
  for (const [x, y] of edge) {
    const p = findPath(x, y, new Set([`${a.x},${a.y}`]), (tx, ty) => walk(m)(tx, ty) && !!m.fogAt(tx, ty));
    if (p) assert.ok(p.length + 1 > FOG.lost, `from ${x},${y} the lantern is ${p.length + 1} fog steps in`);
  }
});

test('the upper village, and the shop easy to find from Malva\'s door', () => {
  const v = maps.village, up = v.anchors['village.upper'], md = v.anchors['village.meeting_door'], cd = v.anchors['village.court_door'];
  assert.ok(up && up.x > md.x && up.x < cd.x + 2 && up.y < cd.y, 'village.upper lies between the meetinghouse and the court');
  const from = v.anchors['village.malva_door'], shop = v.anchors['village.shop_door'];
  const p = findPath(from.x, from.y, new Set([`${shop.x},${shop.y}`]), walk(v));
  assert.ok(p && p.length <= 20, `the shop is ${p?.length} steps from Malva's door`);
  const near = (b, x, y, r) => Math.abs(b.x - x) <= r && Math.abs(b.y - y) <= r;
  assert.ok(v.blocks.some((b) => b.kind === 'lamp' && near(b, shop.x, shop.y, 3)), 'a lamp by the shop door');
  assert.ok(v.blocks.some((b) => b.kind === 'signpost' && near(b, from.x, from.y, 6) && b.opts.arrows.some(([, s]) => s === 'bottle')), 'a signpost to the shop near Malva');
});

test('the broom: outdoors only, never in fog or from the cell; lands on seen outdoor anchors', async () => {
  const { flyFrom, canLandOn } = await import('../src/world/fly.js');
  assert.equal(flyFrom({ map: 'village', x: 18, y: 22 }).ok, true);
  assert.equal(flyFrom({ map: 'cottage', x: 3, y: 3 }).why, 'inside');
  assert.equal(flyFrom({ map: 'depths', x: 33, y: 3 }).why, 'under');
  assert.equal(flyFrom({ map: 'depths', x: 8, y: 29, near: 'depths.jail' }).why, 'cell');
  assert.equal(flyFrom({ map: 'forest', x: 33, y: 10 }).why, 'fog');
  assert.ok(canLandOn('village.square', { 'village.square': true }));
  assert.ok(!canLandOn('village.square', {}), 'not seen');
  assert.ok(!canLandOn('shop.counter', { 'shop.counter': true }), 'indoors');
  assert.ok(!canLandOn('forest.lantern', { 'forest.lantern': true }), 'in the fog');
});

test('the sixth sense feels hidden spots within its radius, every map at the top', async () => {
  const { sensedFrom } = await import('../src/world/hidden.js');
  const { stateWith } = await import('../src/world/reach.js');
  const s = stateWith({ chapter: 2 }), at = { map: 'forest', x: 11, y: 10 };
  const near = sensedFrom(s, at, 10);
  assert.ok(near.some((h) => h.anchor === 'forest.graveyard'), 'the graveyard card is near');
  assert.ok(near.every((h) => h.map === 'forest' && h.dist <= 10));
  assert.equal(sensedFrom(s, at, 0).length, 0);
  assert.ok(sensedFrom(s, at, Infinity).some((h) => h.map === 'village'), 'the whole world at the top');
});
