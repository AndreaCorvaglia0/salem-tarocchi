// Popularity, Tartufo, the registry of optional things, special answers (added 16 Nov).
import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state, migrate, fresh } from '../src/core/state.js';
import { on } from '../src/core/bus.js';
import { test as cond } from '../src/core/cond.js';
import { LEVEL_XP } from '../src/core/progress.js';
import {
  levelFrom, progressFrom, POP, popLevel, addPop, popForReading, wrongOf, TARTUFO, tartufoLevel, tartufoJudge, addTartufo,
  tapOutcome, treatChance, PAT_MS, FIND_GAP,
} from '../src/core/bonds.js';
import { EXTRAS, extraStatus, extrasShown, extrasDone, extrasTotal, trackedExtra, track, markSeen, syncExtras } from '../src/core/extras.js';
import { orderOptions, specialTag, metaOf, normalizeChoices, rankTag } from '../src/story/special.js';
import { createRunner } from '../src/story/runner.js';
import { popLine, movesStory } from '../src/glue/bonds.rules.js';
import { trailTarget } from '../src/glue/hints.rules.js';
import { BARKS, SCRIPTS } from '../src/data/story/index.js';

test('levels from thresholds', () => {
  const at = POP.map((p) => p.at);
  assert.deepEqual(at, [0, 3, 8, 16, 30]);
  assert.deepEqual(TARTUFO.map((t) => t.at), [0, 4, 10, 20, 35]);
  assert.equal(levelFrom(0, at), 0); assert.equal(levelFrom(2, at), 0); assert.equal(levelFrom(3, at), 1);
  assert.equal(levelFrom(29, at), 3); assert.equal(levelFrom(300, at), 4);
  assert.deepEqual(progressFrom(5, at), { level: 1, into: 0.4, top: false });
  assert.equal(progressFrom(30, at).top, true);
});

test('popularity from a reading', () => {
  assert.equal(popForReading({ wrong: 0 }), 2);
  assert.equal(popForReading({ wrong: 1 }), 1);
  assert.equal(popForReading({ wrong: 2 }), 1);
  assert.equal(popForReading({ wrong: 3 }), 0);
  assert.equal(popForReading({ wrong: 0, firstBack: true }), 3);
  assert.equal(popForReading({ wrong: 5, firstBack: true }), 1);
  assert.equal(wrongOf({ score: 1 }, 3), 0);
  assert.equal(wrongOf({ score: 1 / 3 }, 3), 2);
  assert.equal(wrongOf({ score: 0.5, wrong: 4 }, 10), 4);
  assert.equal(wrongOf({}, 3), null);
});

test('addPop and addTartufo emit a level event per level reached', () => {
  setState({});
  const ups = [];
  const off1 = on('pop:up', (e) => ups.push(['pop', e.level]));
  const off2 = on('tartufo:up', (e) => ups.push(['tartufo', e.level]));
  addPop(2); assert.equal(popLevel(), 0);
  addPop(7); assert.equal(state.pop, 9); assert.equal(popLevel(), 2);
  addTartufo(10); assert.equal(tartufoLevel(), 2);
  assert.equal(tartufoJudge(), TARTUFO[2].judge);
  off1(); off2();
  assert.deepEqual(ups, [['pop', 1], ['pop', 2], ['tartufo', 1], ['tartufo', 2]]);
});

test('old saves get the new keys', () => {
  const s = migrate(Object.assign(fresh(), { pop: 'x', tartufo: -3, treats: undefined, extras: null, track: 5 }));
  assert.equal(s.pop, 0); assert.equal(s.tartufo, 0); assert.equal(s.treats, 0);
  assert.deepEqual(s.extras, {}); assert.equal(s.track, null);
  setState({ xp: 10 });
  assert.equal(state.pop, 0); assert.deepEqual(state.extras, {});
});

test('tapping Tartufo: a treat, or a pat every three minutes of play', () => {
  assert.deepEqual(tapOutcome({ treats: 2, now: 0 }), { kind: 'treat', points: 3 });
  assert.deepEqual(tapOutcome({ treats: 0, now: 0 }), { kind: 'pat', points: 1 });
  assert.deepEqual(tapOutcome({ treats: 0, now: PAT_MS - 1, lastPat: 0 }), { kind: 'pat', points: 0 });
  assert.deepEqual(tapOutcome({ treats: 0, now: PAT_MS, lastPat: 0 }), { kind: 'pat', points: 1 });
});

test('the chance Tartufo finds a treat', () => {
  assert.equal(treatChance({ fresh: true, nearRoute: false }), 0.25);
  assert.equal(treatChance({ fresh: true, nearRoute: true }), 0.02);
  assert.equal(treatChance({ fresh: false, nearRoute: false }), 0.02);
  assert.equal(treatChance({ fresh: true, script: true }), 0);
  assert.equal(treatChance({ fresh: true, now: FIND_GAP - 1, lastFind: 0 }), 0);
  assert.equal(treatChance({ fresh: true, now: FIND_GAP, lastFind: 0 }), 0.25);
});

test('conditions: pop, tartufo, explored, title', () => {
  setState({ pop: 8, tartufo: 4, stats: { seen: { 'village.square': true, 'village.stall': true } } });
  assert.ok(cond({ pop: 2 })); assert.ok(!cond({ pop: 3 }));
  assert.ok(cond({ tartufo: 1 })); assert.ok(!cond({ tartufo: 2 }));
  assert.ok(cond({ explored: 2 })); assert.ok(!cond({ explored: 3 }));
  assert.ok(cond({ title: 'novizia' })); assert.ok(!cond({ title: 'fattucchiera' }));
  setState({ xp: LEVEL_XP[3] });
  assert.ok(cond({ title: 'fattucchiera' })); assert.ok(!cond({ title: 'strega' }));
  setState({ xp: LEVEL_XP[6] });
  assert.ok(cond({ title: 'Strega' })); assert.ok(!cond({ title: 'gran maestra' }));
});

test('the registry of extras: states derived for old saves, new entries, tracking', () => {
  assert.equal(extrasTotal(), EXTRAS.length);
  assert.ok(EXTRAS.length >= 8 && EXTRAS.every((e) => e.id && e.text && e.at));
  const m03 = EXTRAS.find((e) => e.id === 'side.m03');
  // an old save: the flag was given and the card found, nothing stored in extras
  setState({ flags: { 'side.m03': true, 'side.m01': true }, cards: { m03: { found: true } } });
  assert.equal(extraStatus(m03), 'done');
  assert.equal(extraStatus(EXTRAS.find((e) => e.id === 'side.m01')), 'new');
  assert.equal(extraStatus(EXTRAS.find((e) => e.id === 'side.m05')), 'hidden');
  assert.equal(extrasDone(), 1);
  // an entry added later is simply unknown to the save: available -> new
  const later = [{ id: 'x.later', text: 'Una cosa nuova.', at: 'village.square', when: null, done: { flag: 'x.done' } }];
  assert.equal(extraStatus(later[0]), 'new');
  assert.deepEqual(extrasShown(state, cond, later).map((e) => e.status), ['new']);
  // tracking: only an open entry; it shows first; finishing it drops the tracking
  markSeen('side.m01');
  assert.equal(extraStatus(EXTRAS.find((e) => e.id === 'side.m01')), 'seen');
  const evts = [];
  const off = on('track', (e) => evts.push(e.id));
  track('side.m03'); assert.equal(state.track, null); // done: cannot be tracked
  track('side.m01'); assert.equal(state.track, 'side.m01'); assert.equal(trackedExtra().at, 'village.stall');
  assert.equal(extrasShown()[0].id, 'side.m01'); assert.equal(extrasShown()[0].tracked, true);
  state.cards.m01 = { found: true };
  assert.ok(syncExtras());
  assert.equal(state.track, null); assert.equal(state.extras['side.m01'], 'done');
  off();
  assert.deepEqual(evts, ['side.m01', null]);
});

test('special answers: order, tags, metas', () => {
  const opts = [{ t: 'a' }, { t: 's1', special: 'tartufo' }, { t: 'b', tag: { card: 'm01' } }, { t: 's2', special: 'pop', tag: 'Famosa' }, { t: 'c', special: 'nope' }];
  assert.deepEqual(orderOptions(opts).map((o) => o.t), ['a', 'b', 'c', 's1', 's2']);
  assert.equal(specialTag(opts[1]), '[Tartufo]');
  assert.equal(specialTag(opts[3]), '[Famosa]');
  assert.equal(specialTag(opts[2]), null);
  assert.equal(specialTag({ special: 'rank' }, 'Fattucchiera'), '[Fattucchiera]');
  assert.equal(specialTag({ special: 'rank' }, 'Strega'), '[Strega]');
  assert.equal(rankTag('Gran Maestra'), '[Strega]');
  for (const [k, v] of Object.entries({ pop: '[Popolare]', magic: '[Magia]', broom: '[Hai la scopa]', witch: '[Una strega amica]', explore: '[Conosci la strada]', trait: '[È da te]' })) assert.equal(specialTag({ special: k }), v);
  assert.equal(metaOf(opts[0]), null);
  assert.deepEqual(metaOf(opts[1]), { special: 'tartufo', tag: '[Tartufo]' });
  assert.deepEqual(normalizeChoices(['x', { t: 'y', special: 'magic' }], [null, null]), [{ t: 'x', meta: null }, { t: 'y', meta: { special: 'magic', tag: '[Magia]' } }]);
});

test('the runner hides specials whose when fails, puts the rest last and passes their tags', async () => {
  setState({ pop: 3 });
  const seen = [];
  const ui = { say: async () => {}, choose: async (texts, metas) => { seen.push([texts, metas]); return texts.length - 1; } };
  const said = [];
  ui.say = async (w, t) => { said.push(t); };
  const r = createRunner({ ui, call: async () => {}, warn: () => {} });
  await r.run([{ choice: [
    { t: 'Tartufo', special: 'tartufo', when: { tartufo: 1 }, then: [{ say: 'malva', t: 'no' }] },
    { t: 'Uno', then: [] },
    { t: 'Popolare', special: 'pop', when: { pop: 1 }, then: [{ say: 'malva', t: 'sì' }] },
    { t: 'Due', then: [] },
  ] }]);
  assert.deepEqual(seen[0][0], ['Uno', 'Due', 'Popolare']);
  assert.deepEqual(seen[0][1], [null, null, { special: 'pop', tag: '[Popolare]' }]);
  assert.deepEqual(said, ['sì']);
  // without specials the UI gets the texts alone, as before
  seen.length = 0;
  await r.run([{ choice: [{ t: 'A' }, { t: 'B' }] }]);
  assert.equal(seen[0][1], undefined);
});

test('the worked example: malva.chat has a Tartufo and a Popolare answer', () => {
  const ch = SCRIPTS['malva.chat'].find((n) => n.choice).choice;
  assert.deepEqual(ch.filter((o) => o.special).map((o) => [o.special, o.when]), [['tartufo', { tartufo: 1 }], ['pop', { pop: 1 }]]);
  assert.ok(ch.filter((o) => o.special).every((o) => o.then.length === 2));
});

test('popularity lines: who says what, once, the highest first', () => {
  const lines = BARKS.pop;
  assert.deepEqual(lines.map((l) => [l.level, l.who]), [[1, 'malva'], [2, 'ginepra'], [3, 'malva']]);
  assert.equal(popLine({ who: 'malva', level: 0, lines }), null);
  assert.equal(popLine({ who: 'malva', level: 1, lines }).level, 1);
  assert.equal(popLine({ who: 'malva', level: 3, lines }).level, 3);
  assert.equal(popLine({ who: 'malva', level: 3, lines, said: (l) => l === 3 }).level, 1);
  assert.equal(popLine({ who: 'ginepra', level: 1, lines }), null);
  assert.equal(popLine({ who: 'ginepra', level: 4, lines }).level, 2);
});

test('a talk that moves the story is a scene, a chat is not', () => {
  assert.equal(movesStory('malva.chat', SCRIPTS), false);
  assert.equal(movesStory('c1.back', SCRIPTS), true);
  assert.equal(movesStory('trade.ginepra', SCRIPTS), false);
  assert.equal(movesStory('x', { x: [{ goto: 1 }, { do: 'goto', script: 'y' }], y: [{ if: {}, then: [{ do: 'step', id: 'a' }] }] }), true);
});

test('Tartufo lines are his thoughts, in parentheses', () => {
  for (const k of ['tartufo.treat', 'tartufo.pat', 'tartufo.found']) {
    assert.ok(BARKS[k].length >= 3, k);
    for (const b of BARKS[k]) assert.match(b.t, /^\(.+\)$/);
  }
  assert.equal(BARKS['tartufo.treat'].length, 4);
  assert.equal(BARKS['tartufo.pat'].length, 3);
});

test('the trail follows a tracked side mission', () => {
  const steps = [{ id: 's', at: 'village.square' }];
  assert.equal(trailTarget({ chapter: 1, step: 's', steps, found: ['m01'] }), 'village.square');
  assert.equal(trailTarget({ chapter: 1, step: 's', steps, found: ['m01'], track: 'village.stall' }), 'village.stall');
  assert.equal(trailTarget({ chapter: 2, step: 's', steps, track: 'village.stall' }), null);
  assert.equal(trailTarget({ chapter: 2, step: 's', steps, track: 'village.stall', temp: true }), 'village.stall');
});
