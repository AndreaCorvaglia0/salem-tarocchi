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
