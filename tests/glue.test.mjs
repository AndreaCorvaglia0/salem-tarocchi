// The integration glue (src/glue): the final cross, the returning clients, 
// throttling, the debug skips, and the runner's draw filter and jail-after-run.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { finalCards, FORK3 } from '../src/glue/finale.rules.js';
import { nextClient } from '../src/glue/clients.rules.js';
import { throttle } from '../src/glue/barks.js';
import { prepare, SKIPS } from '../src/glue/debug.rules.js';
import { state, setState } from '../src/core/state.js';
import { majorsFound, levelOf, dayCard, todayKey, findCard } from '../src/core/progress.js';
import { test as cond } from '../src/core/cond.js';
import { createRunner } from '../src/story/runner.js';
import { CLIENTS } from '../src/data/story/index.js';

const seq = (...xs) => { let i = 0; return () => xs[i++ % xs.length]; };

test('final cross: ten entries from the game, all different, draws at 6 and 10', () => {
  const owned = ['m00', 'm01', 'm02', 'm03', 'm07', 'm11', 'm13', 'm18'];
  const c = finalCards({ yourCard: 'm07', mostMissed: 'm13', birthCard: 'm07', flags: { 'b3.stealth': true, 'leaf.dream.m10': true, 'leaf.value.m11': true, 'leaf.fear.m13': true }, mostTrusting: 'malva', owned, rng: seq(0) });
  assert.equal(c.length, 10);
  assert.equal(c[0], 'm07'); assert.equal(c[1], 'm13'); assert.equal(c[3], FORK3.stealth); assert.equal(c[4], 'm10');
  assert.equal(c[5], 'fan'); assert.equal(c[6], 'm11'); assert.equal(c[7], 'm03'); assert.equal(c[9], 'number');
  assert.notEqual(c[2], 'm07'); // the birth card repeats position 1: replaced by another owned Major
  assert.notEqual(c[8], 'm13'); // the fear card repeats position 2
  const ids = c.filter((x) => x !== 'fan' && x !== 'number');
  assert.equal(new Set(ids).size, ids.length);
});

test('final cross: missing pieces fall back (no birth -> Il Matto, open fork -> La Giustizia)', () => {
  const c = finalCards({ yourCard: 'm00', mostMissed: null, birthCard: null, flags: { 'b3.open': true }, mostTrusting: 'ginepra', owned: ['m00', 'm05', 'm06'], rng: seq(0) });
  assert.equal(c[3], FORK3.open);
  assert.equal(c[7], 'm07');
  assert.ok(!c.slice(0, 5).includes(undefined));
});

test('returning clients: new ones first, then old faces with a known spread', () => {
  const done = new Set(['c1.widow']);
  const n = nextClient({ clients: CLIENTS, chapter: 1, done: (id) => done.has(id), spreads: { single: true }, rng: seq(0) });
  assert.equal(n.back, false); assert.notEqual(n.id, 'c1.widow'); assert.equal(n.spread, 'single');
  for (const c of CLIENTS) done.add(c.id);
  const b = nextClient({ clients: CLIENTS, chapter: 2, done: (id) => done.has(id), spreads: { single: true, ppf: true }, rng: seq(0.99) });
  assert.equal(b.back, true); assert.ok(['single', 'ppf'].includes(b.spread));
  assert.ok(CLIENTS.find((c) => c.id === b.id).chapter <= 2);
  assert.equal(nextClient({ clients: CLIENTS, chapter: 1, done: () => false, spreads: {} }), null);
});


test('throttle: once per kind per gap', () => {
  let t = 0;
  const once = throttle(1000, () => t);
  assert.equal(once('a'), true); assert.equal(once('a'), false); assert.equal(once('b'), true);
  t = 1500; assert.equal(once('a'), true);
});

test('debug skips prepare sane states that pass the chapter gates', () => {
  for (const key of Object.keys(SKIPS)) {
    assert.equal(prepare(key, { [SKIPS[key].at]: { map: 'x', x: 1, y: 1 } }), true);
    assert.equal(state.chapter, SKIPS[key].chapter);
    assert.equal(state.step, SKIPS[key].step);
    assert.equal(state.pos.map, 'x');
  }
  prepare('c2'); assert.ok(cond({ majorsMin: 6 })); assert.ok(levelOf() >= 4); assert.ok(state.powers.fire);
  prepare('c3'); assert.ok(cond({ majorsMin: 11 }));
  prepare('trial'); assert.equal(majorsFound(), 19); assert.ok(state.powers.broom || levelOf() >= 8);
});

test('card of the day: only today, only if owned', () => {
  setState({}); findCard('m03');
  state.day = { date: todayKey(), card: 'm03' }; assert.equal(dayCard(), 'm03');
  state.day = { date: '2001-01-01', card: 'm03' }; assert.equal(dayCard(), null);
});

const fakeUi = { say: async () => {}, choose: async () => 0, cinema: async () => {}, moment: async () => {}, sleep: async () => {}, end: async () => {} };

test('runner: an explicit draw pool skips found cards; a failed Exam sends her to the cell after the run', async () => {
  setState({ chapter: 1 }); findCard('m01'); findCard('m02');
  const calls = [];
  const call = async (name, o) => { calls.push([name, o]); if (name === 'draw.pick') return o.pool[0]; if (name === 'exam.start') return { passed: false }; return undefined; };
  const r = createRunner({ ui: fakeUi, call, warn: () => {} });
  await r.run([{ do: 'draw', pool: ['m01', 'm02', 'm03'], give: false }, { do: 'exam', kind: 'constable' }, { do: 'xp', n: 1 }]);
  const draw = calls.find(([n]) => n === 'draw.pick');
  assert.deepEqual(draw[1].pool, ['m03']);
  const names = calls.map(([n]) => n);
  assert.equal(names.at(-1), 'world.travel'); assert.equal(calls.at(-1)[1], 'depths.jail');
  assert.equal(state.flags['exam.passed'], false);
});

test('runner: { do: "call" } reaches a service by name', async () => {
  const seen = [];
  const r = createRunner({ ui: fakeUi, call: async (n, ...a) => { seen.push([n, a]); }, warn: () => {} });
  await r.run([{ do: 'call', name: 'shop.open' }, { do: 'call', name: 'x.y', args: [1, 2] }]);
  assert.deepEqual(seen, [['shop.open', []], ['x.y', [1, 2]]]);
});
