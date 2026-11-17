// The missions on the grimoire's map (src/ui/missions/, notes/missions-design.md): the pure parts.
// The drift guard: every entry of the extras registry needs a card in src/ui/missions/titles.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { TITLES, KIND, cardOf } from '../src/ui/missions/titles.js';
import { ackDone, missionsModel, inWords, regionCount, doneLine, hereCount, STACK } from '../src/ui/missions/model.js';
import { choosePin } from '../src/ui/missions/pins.js';
import { REGIONS, placeOf, REGION_OF } from '../src/ui/sketchmap.js';
import { SIDE, LESSON_MISSIONS } from '../src/data/story/index.js';
import { TRIALS } from '../src/data/trials/index.js';
import { WORLD_LIST } from '../src/data/elsewhere/index.js';
import { lessonEntries } from '../src/glue/garden.rules.js';

const SYMS = ['carta', 'lezione', 'prova', 'orto', 'altrove', 'storia', 'storiaMain', 'fatta'];

// Every place that registers entries (core/extras.js EXTRAS). The glue files cannot be imported in node
// (they pull in fonts and screens), so the ids are rebuilt from the same data they read.
const SITES = 6; // EXTRAS.push / EXTRAS.unshift outside core/extras.js
function registryIds() {
  const asList = (x) => (Array.isArray(x) ? x : Object.values(x || {}));
  return [
    ...asList(SIDE).filter((m) => m && m.id).map((m) => m.id), // core/extras.js itself
    ...LESSON_MISSIONS.map((m) => m.id), // glue/lessons.js
    'garden.ortica', ...lessonEntries().map((e) => e.extra.id), // glue/garden.js
    ...Object.values(TRIALS).filter((d) => !d.debug).map((d) => `trial.${d.id}`), 'library.first', // glue/trials.js
    ...WORLD_LIST.map((w) => `elsewhere.${w.id}`), // glue/elsewhere.rules.js
  ];
}
const srcFiles = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? srcFiles(p) : p.endsWith('.js') ? [p] : []; });

test('every entry of the extras registry has a card (title, kind, who, gets): add it to src/ui/missions/titles.js', () => {
  const sites = srcFiles('src').filter((f) => !f.endsWith(join('core', 'extras.js')))
    .reduce((n, f) => n + (readFileSync(f, 'utf8').match(/EXTRAS\.(push|unshift)\(/g) || []).length, 0);
  assert.equal(sites, SITES, 'a new place registers optional things: add its ids to registryIds() in tests/missions.page.test.mjs');
  const ids = registryIds();
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) {
    const t = TITLES[id];
    assert.ok(t, `${id}: no entry in src/ui/missions/titles.js (title, kind, who, gets)`);
    assert.ok(t.title && t.title.length <= 28, `${id}: a short title`);
    assert.ok(KIND[t.kind], `${id}: unknown kind ${t.kind}`);
    assert.ok(t.who === null || (typeof t.who === 'string' && t.who), `${id}: who told her (null: she noticed it)`);
    assert.ok(t.gets && !/ricordo/.test(t.gets), `${id}: what she gets, concrete`);
  }
  for (const id of Object.keys(TITLES)) assert.ok(ids.includes(id), `${id}: in titles.js but not in the registry`);
});

test('every kind has a word and a pencil symbol', () => {
  for (const [k, v] of Object.entries(KIND)) { assert.ok(v.word, k); assert.ok(SYMS.includes(v.sym), `${k}: symbol ${v.sym}`); }
  const symbols = readFileSync('src/ui/missions/symbols.js', 'utf8');
  for (const s of SYMS) assert.match(symbols, new RegExp(`\\b${s}:`), `symbols.js: ${s}`);
  // an entry with no card still shows, with a kind that has a symbol
  for (const kind of ['lesson', 'side', 'errand', 'trial']) assert.ok(KIND[cardOf({ id: 'x.new', kind, text: 'Una cosa nuova: da fare' }).kind]);
});

// a few registry entries, as extrasShown() gives them
const E = (id, at, status, tracked = false) => ({ id, at, status, tracked, text: `${id} text` });
const MAIN = { text: 'Devo portare l\'unguento di Ortica al mugnaio, al mulino.', at: 'forest.mill' };

test('N open things give N slips, each at its place, the story first; the followed one is marked', () => {
  const items = [E('lesson.fly', 'village.malva_door', 'seen'), E('side.m05', 'village.meeting_door', 'active', true),
    E('garden.ortica', 'forest.ortica_hut', 'new'), E('trial.dare', 'forest.den', 'new')];
  const M = missionsModel({ items, main: MAIN });
  const opt = M.pins.flatMap((g) => g.slips.filter((s) => !s.main));
  assert.equal(opt.length, 4);
  for (const e of items) {
    const g = M.pins.find((p) => p.slips.some((s) => s.id === e.id));
    assert.equal(g.place, placeOf(e.at), e.id);
    assert.ok(REGIONS[g.region].places[g.place], `${e.id}: a place of the sketch`);
  }
  assert.deepEqual(M.pins.find((g) => g.place === 'forest.mill').slips.map((s) => s.main), [true]);
  assert.equal(M.tracked.id, 'side.m05');
  const on = M.pins.flatMap((g) => g.slips).filter((s) => s.on);
  assert.deepEqual(on.map((s) => s.id), ['side.m05']); // the story's star is not «on» while she follows another
  assert.deepEqual(M.pins.flatMap((g) => g.slips).filter((s) => s.isNew).map((s) => s.id), ['garden.ortica', 'trial.dare']);
  assert.deepEqual(M.perRegion, { village: 2, forest: 2 });
  // following the story: its star is the marked one
  const M2 = missionsModel({ items: items.map((e) => ({ ...e, tracked: false })), main: MAIN });
  assert.deepEqual(M2.pins.flatMap((g) => g.slips).filter((s) => s.on).map((s) => s.main), [true]);
});

test('two or more things at one place get the count; three or more are a stack', () => {
  const items = [E('lesson.minors.1', 'forest.ortica_hut', 'seen'), E('garden.lesson.acqua', 'forest.ortica_hut', 'seen'),
    E('lesson.minors.4', 'forest.ortica_hut', 'seen'), E('trial.dare', 'forest.den', 'seen')];
  const M = missionsModel({ items, main: MAIN });
  const hut = M.pins.find((g) => g.place === 'forest.ortica_hut' && !g.done), den = M.pins.find((g) => g.place === 'forest.den');
  assert.equal(hut.count, 3);
  assert.equal(hereCount(hut.count), 'tre qui');
  assert.ok(hut.count >= STACK);
  assert.equal(den.count, 1);
  assert.equal(hereCount(den.count), '');
  assert.equal(hereCount(2), 'due qui');
});

test('done things are folded (title and place); the ones done since the last opening are pinned once as «fatta»', () => {
  const items = [E('side.m01', 'village.market', 'seen'), E('side.m12', 'forest.pond', 'done'), E('side.m02', 'village.lane', 'done'), E('lesson.fly', 'village.malva_door', 'done')];
  const M = missionsModel({ items, main: MAIN, fresh: ['side.m12'] });
  assert.deepEqual(M.done.map((d) => d.id), ['side.m12', 'side.m02', 'lesson.fly']); // the fresh one first
  assert.ok(M.done.every((d) => d.title && d.place));
  const fresh = M.pins.filter((g) => g.done);
  assert.deepEqual(fresh.map((g) => [g.place, g.slips.map((s) => s.id)]), [['forest.pond', ['side.m12']]]);
  assert.ok(!M.pins.some((g) => !g.done && g.slips.some((s) => s.done)));
  assert.equal(M.perRegion.forest, undefined); // done ones are not counted as «da fare»
  assert.equal(doneLine(3), 'Cose in più già fatte: tre');
});

test('just done: an old save without extrasAck shows nothing; afterwards only what is new', () => {
  const items = [E('side.m12', 'forest.pond', 'done'), E('side.m02', 'village.lane', 'done'), E('side.m01', 'village.market', 'seen')];
  const old = { extras: {} }; // a save from before the acknowledgements (extrasAck missing)
  const a = ackDone(old, items);
  assert.deepEqual(a.fresh, []);
  assert.ok(a.dirty);
  assert.deepEqual(old.extrasAck, { 'side.m12': true, 'side.m02': true });
  const b = ackDone(old, [...items, E('side.m03', 'village.orto', 'done')]);
  assert.deepEqual(b.fresh, ['side.m03']);
  assert.deepEqual(ackDone(old, items).fresh, []); // shown once
  const nul = { extrasAck: null };
  assert.deepEqual(ackDone(nul, items).fresh, []);
});

test('small numbers are words (the hand font\'s 7 was read as «?»)', () => {
  assert.equal(inWords(7), 'sette');
  assert.equal(inWords(1, { fem: true }), 'una');
  assert.equal(inWords(21), 'ventuno');
  assert.equal(inWords(23), 'ventitré');
  assert.equal(inWords(28), 'ventotto');
  assert.equal(inWords(34), 'trentaquattro');
  assert.equal(regionCount(4), 'quattro cose in più da fare');
  assert.equal(regionCount(1), 'una cosa in più da fare');
  assert.equal(regionCount(0), '');
  for (const r of Object.keys(REGIONS)) assert.equal(REGION_OF(Object.keys(REGIONS[r].places)[0]), r);
});

test('a pin stays touching its place and off the drawings and names when there is room', () => {
  const places = [{ x: 100, y: 100 }, { x: 150, y: 100 }];
  const busy = [{ l: 70, t: 112, r: 130, b: 130 }]; // the name under the place
  const p = choosePin({ x: 100, y: 100, w: 32, hh: 32, W: 330, H: 300, places, busy });
  assert.ok(p.free);
  const vis = { l: p.l, t: p.t, r: p.l + 32, b: p.t + 32 };
  const d = (x, y) => Math.hypot(Math.max(vis.l - x, 0, x - vis.r), Math.max(vis.t - y, 0, y - vis.b));
  assert.ok(d(100, 100) >= 14 && d(100, 100) <= 34, `near its place: ${d(100, 100)}`);
  assert.ok(d(150, 100) >= 14, 'off the other drawing');
  assert.ok(!(vis.l < busy[0].r && vis.r > busy[0].l && vis.t < busy[0].b && vis.b > busy[0].t), 'off the name');
});
