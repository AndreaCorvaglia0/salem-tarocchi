// What lies on the ground for the albums (src/data/world/finds.js): every spot is on a map of Salem, on open
// ground, clear of paths, doors, anchors, plants, patrols and building pictures, and she can walk to it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FIND_SPOTS } from '../src/data/world/finds.js';
import { HERB_SPOTS } from '../src/data/world/herbs.js';
import { DEFS } from '../src/data/world/index.js';
import { getMap } from '../src/world/maps.js';
import { KINDS } from '../src/world/tiles.js';
import { readFileSync } from 'node:fs';

const T = 16;
const OPEN = ['ground', 'soil', 'planks', 'flags', 'rug'];

test('every spot is on a map of Salem, inside it, on open ground (never a path, cobbles or a door)', () => {
  for (const s of FIND_SPOTS) {
    const m = getMap(s.map), at = `${s.id} ${s.map} ${s.x},${s.y}`;
    assert.ok(m && !m.elsewhere && DEFS.some((d) => d.id === s.map), `${at}: no such map of Salem`);
    assert.ok(s.x >= 0 && s.y >= 0 && s.x < m.W && s.y < m.H, `${at}: outside the map`);
    assert.ok(!m.isSolid(s.x, s.y), `${at}: on something solid (${m.at(s.x, s.y)})`);
    assert.ok(OPEN.includes(m.tile(s.x, s.y).ground), `${at}: on ${m.tile(s.x, s.y).ground}`);
    assert.ok(!/[A-Z]/.test(m.at(s.x, s.y)), `${at}: on a block`);
    assert.ok(!m.isGrass(s.x, s.y), `${at}: in the tall grass (the Minors' place)`);
    assert.ok(!m.fogAt(s.x, s.y), `${at}: in thick fog`);
    assert.ok(typeof s.where === 'string' && s.where.length > 8, `${at}: where she found it, for the album`);
  }
});

test('nothing hides something else, and no spot is beside a door or on a round', () => {
  const seen = new Set(HERB_SPOTS.map((h) => `${h.map}:${h.x},${h.y}`));
  for (const s of FIND_SPOTS) {
    const m = getMap(s.map), at = `${s.id} ${s.map} ${s.x},${s.y}`;
    for (const a of Object.values(m.anchors)) assert.ok(!(a.x === s.x && a.y === s.y), `${at}: on the anchor ${a.name}`);
    for (const t of [...m.doors, ...m.chests, ...m.gates, ...m.obstacles]) assert.ok(!(t.x === s.x && t.y === s.y), `${at}: on ${t.id || 'a door'}`);
    assert.ok(![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => m.at(s.x + dx, s.y + dy) === '+'), `${at}: in front of a door`);
    for (const p of m.patrols) for (let i = 0; i < p.route.length; i++) {
      const [a, b] = p.route[i], [c, d] = p.route[(i + 1) % p.route.length];
      assert.ok(!(s.x >= Math.min(a, c) && s.x <= Math.max(a, c) && s.y >= Math.min(b, d) && s.y <= Math.max(b, d)), `${at}: on the round of ${p.id}`);
    }
    const k = `${s.map}:${s.x},${s.y}`;
    assert.ok(!seen.has(k), `${at}: a plant or another find is already there`);
    seen.add(k);
  }
});

test('no spot lies under a building picture', () => {
  for (const s of FIND_SPOTS) {
    const m = getMap(s.map);
    for (const b of m.blocks.filter((q) => KINDS[q.kind]?.over != null)) {
      const K = KINDS[b.kind], ox = K.ox || 0, right = K.right ?? ox;
      const x0 = Math.floor((b.x * T - ox) / T), x1 = Math.floor(((b.x + b.w) * T + right - 1) / T), y0 = Math.floor((b.y * T - K.over) / T);
      assert.ok(!(s.x >= x0 && s.x <= x1 && s.y >= y0 && s.y < b.y + b.h), `${s.id}: under the ${b.kind}`);
    }
  }
});

test('she can walk to every spot from where the map starts (gates and obstacles open in time)', () => {
  for (const s of FIND_SPOTS) {
    const m = getMap(s.map);
    const st = m.anchors[`${m.id}.${m.def.start}`] || Object.values(m.anchors)[0];
    const pass = (x, y) => !m.isSolid(x, y) || m.gates.some((g) => g.x === x && g.y === y) || m.obstacles.some((o) => o.x === x && o.y === y);
    const seen = new Set([`${st.x},${st.y}`]), q = [[st.x, st.y]];
    while (q.length) {
      const [x, y] = q.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
        if (seen.has(k) || nx < 0 || ny < 0 || nx >= m.W || ny >= m.H || !pass(nx, ny)) continue;
        seen.add(k); q.push([nx, ny]);
      }
    }
    assert.ok(seen.has(`${s.x},${s.y}`), `${s.id}: she cannot walk to ${s.map} ${s.x},${s.y}`);
  }
});

test('they glint only from close: two or three tiles', () => {
  // read from the scene's source (it imports Phaser, which needs a browser)
  const range = Number(/GLINT = \{ range: (\d+(?:\.\d+)?)/.exec(readFileSync('src/world/scene/finds.js', 'utf8'))?.[1]);
  assert.ok(range >= 2 && range <= 3, `glint range ${range}`);
});
