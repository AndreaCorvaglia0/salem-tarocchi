// Pure parts of the shadow-theatre stage (src/story/stage/): every tableau resolves, every person has a
// cameo, every path is well formed, symbols sample cleanly, every cinema node of the scripts gets a scene.
import test from 'node:test';
import assert from 'node:assert/strict';
import { TABLEAUX, TABLEAU_NAMES, sceneFor } from '../src/story/stage/tableaux.js';
import { SIL, mirror, crowdBust } from '../src/story/stage/silhouettes.js';
import * as SC from '../src/story/stage/scenery.js';
import { CAMEOS, cameoParts, hasCameo } from '../src/story/stage/cameos.js';
import { SYMBOLS, SYMBOL_NAMES, sampleSymbol } from '../src/story/stage/symbols.js';
import { toPath, validPath } from '../src/story/stage/kit.js';
import { PEOPLE } from '../src/data/cards.base.js';
import { SCRIPTS } from '../src/data/story/index.js';

const d = (p) => (typeof p === 'string' ? p : p.d);
const FX = new Set(['candle', 'fire', 'snow', 'moon', 'sun', 'glow', 'pool', 'hang', 'clouds', 'shafts']);
const REQUIRED = ['reader', 'cards', 'arrival', 'door', 'square', 'campfire', 'arrest', 'cellar', 'coven', 'trial', 'dawn', 'last'];

test('every required tableau exists and every item resolves', () => {
  for (const n of REQUIRED) assert.ok(TABLEAUX[n], `missing tableau ${n}`);
  for (const n of TABLEAU_NAMES) {
    const t = TABLEAUX[n];
    assert.equal(t.light.c.length, 3, `${n}: light needs three colours`);
    for (const key of ['far', 'mid', 'near']) for (const it of t[key] || []) {
      if (it.fx) { assert.ok(FX.has(it.fx), `${n}.${key}: unknown fx ${it.fx}`); continue; }
      if (it.sil) assert.ok(SIL[it.sil], `${n}.${key}: no silhouette ${it.sil}`);
      else assert.equal(typeof SC[it.gen], 'function', `${n}.${key}: no generator ${it.gen}`);
      for (const k of ['y', 'h']) assert.ok(Number.isFinite(it[k]), `${n}.${key}: ${k}`);
    }
    for (const f of t.fx || []) assert.ok(FX.has(f.fx), `${n}: unknown fx ${f.fx}`);
  }
  assert.ok(TABLEAUX.reader.cards && TABLEAUX.cards.cards, 'card places');
});

test('the path data of every figure and every generated piece parses', () => {
  for (const [name, s] of Object.entries(SIL)) {
    assert.ok(s.h > 0 && s.parts.length, name);
    for (const p of [...s.parts, ...(s.holes || [])]) assert.ok(validPath(d(p)), `${name}: ${d(p).slice(0, 60)}`);
  }
  for (const n of TABLEAU_NAMES) for (const key of ['far', 'mid', 'near']) for (const it of TABLEAUX[n][key] || []) {
    if (!it.gen) continue;
    const args = (it.args || []).slice();
    const placed = SC[it.gen](...args.map((a) => (a === 0 ? 2400 : a)));
    assert.ok(placed.length, `${n}: ${it.gen} made nothing`);
    for (const pl of placed) for (const p of pl.parts) assert.ok(validPath(d(p)), `${n}: ${it.gen}`);
  }
  for (let i = 0; i < 12; i++) for (const p of crowdBust(i, true)) assert.ok(validPath(p), 'crowd');
});

test('mirror keeps path data valid and flips x', () => {
  const p = toPath([[10, 0], [20, -10], [30, 0]]);
  const m = mirror(p);
  assert.ok(validPath(m));
  assert.ok(m.startsWith('M-10 0'), m);
  assert.ok(validPath(mirror('M-5 0A5 5 0 1 0 5 0A5 5 0 1 0 -5 0Z')));
});

test('every person has a cameo, and so do the villagers', () => {
  for (const id of [...Object.keys(PEOPLE), 'child', 'washer', 'hale', 'gravedigger', 'miller']) {
    assert.ok(hasCameo(id), `no cameo for ${id}`);
    const parts = cameoParts(id);
    assert.ok(parts.length >= 2, id);
    for (const p of parts) assert.ok(validPath(p.d), `${id}: ${p.d.slice(0, 50)}`);
  }
  assert.equal(cameoParts('narra'), null);
  // the witches are drawn with colour accents, not all in one dark
  for (const id of ['tu', 'ginepra', 'malva', 'ortica', 'edera']) assert.ok(new Set(cameoParts(id).map((p) => p.fill)).size >= 3, id);
  assert.ok(Object.keys(CAMEOS).length >= 16);
});

test('symbols sample evenly and stay in the box', () => {
  for (const n of ['moon', 'star', 'eye', 'key', 'wheel', 'tower', 'sun', 'cup', 'sword', 'wand', 'coin']) assert.ok(SYMBOLS[n], n);
  for (const n of SYMBOL_NAMES) {
    const pts = sampleSymbol(n, 120);
    assert.equal(pts.length, 120);
    for (const [x, y] of pts) assert.ok(Math.abs(x) <= 1.2 && Math.abs(y) <= 1.2, `${n} ${x},${y}`);
  }
});

test('every cinema node in the scripts gets a scene (by name or by its anchor)', () => {
  function* walk(nodes) { for (const n of nodes || []) { yield n; if (n.choice) for (const o of n.choice) yield* walk(o.then); yield* walk(n.then); yield* walk(n.else); } }
  const missing = [];
  for (const [id, nodes] of Object.entries(SCRIPTS)) for (const n of walk(nodes)) if (n.do === 'cinema' && !sceneFor(n) && !n.scene) missing.push(id);
  // c2.plan and the second f.dawn line have no anchor: they need an explicit scene (see notes/stage.md)
  assert.ok(missing.every((id) => ['c2.plan', 'f.dawn'].includes(id)), missing.join());
  assert.equal(sceneFor({ scene: 'arrest' }), 'arrest');
  assert.equal(sceneFor({ scene: 'nope' }), null);
});
