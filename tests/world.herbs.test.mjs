// The herbs in the world (src/data/world/herbs.js): every plant of the herbarium grows somewhere, and
// every spot is a sensible tile of an existing outdoor map.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HERB_SPOTS } from '../src/data/world/herbs.js';
import { HERB_LIST } from '../src/data/herbs/base.js';
import { getMap } from '../src/world/maps.js';

const POISON = new Set(HERB_LIST.filter((h) => h.risk === 'velenosa').map((h) => h.id));

test('every herb of the herbarium has at least one spot, and only herbs of the herbarium have spots', () => {
  const ids = new Set(HERB_LIST.map((h) => h.id));
  for (const s of HERB_SPOTS) assert.ok(ids.has(s.id), `unknown herb ${s.id}`);
  for (const h of HERB_LIST) assert.ok(HERB_SPOTS.some((s) => s.id === h.id), `${h.id} grows nowhere`);
  for (const id of POISON) assert.ok(HERB_SPOTS.filter((s) => s.id === id).length <= 2, `${id}: a poisonous plant should be rare`);
});

test('every spot is on an existing outdoor map, inside it, on open ground', () => {
  for (const s of HERB_SPOTS) {
    const m = getMap(s.map), at = `${s.id} ${s.map} ${s.x},${s.y}`;
    assert.ok(m, `${at}: no such map`);
    assert.ok(!m.inside && m.open && !m.elsewhere, `${at}: not an outdoor map of Salem`);
    assert.ok(s.x >= 0 && s.y >= 0 && s.x < m.W && s.y < m.H, `${at}: outside the map`);
    assert.ok(!m.isSolid(s.x, s.y), `${at}: on something solid (${m.at(s.x, s.y)})`);
    const g = m.tile(s.x, s.y).ground;
    assert.ok(g === 'ground' || g === 'soil', `${at}: on ${g} (paths, cobbles, doors stay clear)`);
    assert.ok(!m.isGrass(s.x, s.y), `${at}: in the tall grass (the Minors' place)`);
    assert.ok(!m.fogAt(s.x, s.y), `${at}: in thick fog`);
  }
});

test('she can stand next to every plant, and no plant hides something else', () => {
  const seen = new Set();
  for (const s of HERB_SPOTS) {
    const m = getMap(s.map), at = `${s.id} ${s.map} ${s.x},${s.y}`;
    const free = (x, y) => !m.isSolid(x, y) && m.at(x, y) !== '+';
    assert.ok([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => free(s.x + dx, s.y + dy)), `${at}: nowhere to stand beside it`);
    for (const a of Object.values(m.anchors)) assert.ok(!(a.x === s.x && a.y === s.y), `${at}: on the anchor ${a.name}`);
    for (const t of [...m.doors, ...m.chests, ...m.gates, ...m.obstacles]) assert.ok(!(t.x === s.x && t.y === s.y), `${at}: on ${t.id}`);
    for (const p of m.patrols) for (let i = 0; i < p.route.length; i++) {
      const [a, b] = p.route[i], [c, d] = p.route[(i + 1) % p.route.length];
      const on = s.x >= Math.min(a, c) && s.x <= Math.max(a, c) && s.y >= Math.min(b, d) && s.y <= Math.max(b, d);
      assert.ok(!on, `${at}: on the round of ${p.id}`);
    }
    const k = `${s.map}:${s.x},${s.y}`;
    assert.ok(!seen.has(k), `${at}: two plants on one tile`);
    seen.add(k);
  }
});
