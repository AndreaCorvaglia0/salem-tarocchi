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
