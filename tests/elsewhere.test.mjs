// Altrove (glue/elsewhere.js, src/world/elsewhere.rules.js): the two worlds' own rules, the forks, the
// registry chain, a visit cut by a reload.
import test from 'node:test';
import assert from 'node:assert/strict';
import { getMap } from '../src/world/maps.js';
import { bridges, forkOptions, forkEnds, newCloudState, chooseBridge, cloudOpen, cloudThin, solidWay, bridgeOf, planWrite, inkOpen, key } from '../src/world/elsewhere.rules.js';
import { WORLDS, WORLD_LIST } from '../src/data/elsewhere/index.js';
import { CARD } from '../src/data/cards.base.js';
import { fairFaces, rightOptions, faceOf } from '../src/trials/ask.js';
import { runTrial } from '../src/trials/run.js';
import { fresh } from '../src/core/state.js';
import { test as cond } from '../src/core/cond.js';

const clouds = getMap('clouds');
const NF = forkOptions.length >= 0 ? [0, 1, 2] : [];
const combos = (lists) => lists.reduce((acc, l) => acc.flatMap((a) => l.map((x) => [...a, x])), [[]]);

test('clouds: three forks, each with its bridges; the bridges are closed until she asks', () => {
  assert.deepEqual(NF.map((f) => forkOptions(clouds, f).length), [3, 3, 2]);
  for (const [, tiles] of bridges(clouds)) for (const [x, y] of tiles) assert.equal(cloudOpen(clouds, newCloudState(), x, y), false);
  for (const f of NF) { const { from, to } = forkEnds(clouds, f); assert.ok(from && to, `fork ${f} ends`); }
  // the steps of the trial name the map's forks in order
  assert.deepEqual(WORLDS.clouds.steps.filter((s) => s.fork).map((s) => s.bridge), [0, 1, 2]);
  WORLDS.clouds.steps.filter((s) => s.fork).forEach((s) => assert.equal(s.fork.options.length, forkOptions(clouds, s.bridge).length));
});

test('clouds: the right choices give a solid way from the start to the door, whatever bridge was right', () => {
  const start = clouds.anchors['clouds.start'], exit = clouds.anchors['clouds.exit'];
  for (const pick of combos(NF.map((f) => forkOptions(clouds, f)))) {
    let s = newCloudState();
    pick.forEach((o, f) => { s = chooseBridge(clouds, s, f, o, true); assert.equal(s.added.length, 0, 'a right bridge has no thin tile'); });
    assert.ok(solidWay(clouds, s, start, exit), `solid way for ${pick}`);
    for (const [k, tiles] of bridges(clouds)) { const [f, o] = k.split(':').map(Number); if (pick[f] === o) for (const [x, y] of tiles) assert.ok(!cloudThin(clouds, s, x, y)); }
  }
});

test('clouds: a wrong bridge always has a thin tile, and a careful way across still exists', () => {
  for (const pick of combos(NF.map((f) => forkOptions(clouds, f)))) for (const wrongs of combos(NF.map(() => [true, false]))) {
    let s = newCloudState();
    pick.forEach((o, f) => {
      const ok = !wrongs[f];
      s = chooseBridge(clouds, s, f, o, ok);
      if (!ok) {
        assert.ok(s.added.length >= 1, `fork ${f} option ${o}: a thin tile`);
        for (const [x, y] of s.added) assert.equal(bridgeOf(clouds.at(x, y))?.option, o);
      }
      const { from, to } = forkEnds(clouds, f);
      assert.ok(solidWay(clouds, s, from, to), `fork ${f} option ${o}: a solid way`);
    });
  }
  // the other bridges of a fork are gone once she has chosen
  const s = chooseBridge(clouds, newCloudState(), 0, 1, true);
  for (const [x, y] of bridges(clouds).get('0:0')) assert.equal(cloudOpen(clouds, s, x, y), false);
});

// ---- the book ---------------------------------------------------------------------------------------
const forkSteps = WORLDS.book.steps.filter((s) => s.fork);
test('book: the right word always opens a line to the next fork; a wrong one ends in a blot, and goes on from there', () => {
  for (const wrongs of combos(forkSteps.map(() => [false, true]))) {
    const ink = {};
    const inkOf = (m) => ink[m] || (ink[m] = new Set());
    forkSteps.forEach((st, i) => {
      const mapId = st.at.split('.')[0], map = getMap(mapId), I = inkOf(mapId);
      // she stands on the fork (its sentence is written on the map)
      const a = map.anchors[st.at];
      assert.ok(inkOpen(map, I, a.x, a.y), `${st.at} stands on a written line`);
      const to = wrongs[i] ? st.blot : st.next;
      const t1 = planWrite(map, { fork: st.at, to }, I);
      assert.ok(t1 && t1.length > 2, `${st.at} -> ${to}`);
      t1.forEach(([x, y]) => I.add(key(x, y)));
      const end = map.anchors[to], last = t1[t1.length - 1];
      const goal = map.anchors[st.next];
      if (wrongs[i]) {
        assert.deepEqual(last, [end.x, end.y], 'the wrong word ends in the blot');
        const t2 = planWrite(map, { from: st.blot, to: st.next }, I);
        assert.ok(t2 && t2.length, `${st.blot} -> ${st.next}`);
        t2.forEach(([x, y]) => I.add(key(x, y)));
      }
      // the line reaches the next fork's sentence (or the next place) and is all walkable
      assert.ok(inkOpen(map, I, goal.x, goal.y) || map.at(goal.x, goal.y) === '-', `reaches ${st.next}`);
    });
  }
});
test('book: a line never runs beside the page corner except to reach it, nor into another fork\'s blank', () => {
  const map = getMap('book1');
  const t = planWrite(map, { fork: 'book1.fork1', to: 'book1.fork2' });
  const door = map.doors[0];
  for (const [x, y] of t) assert.ok(Math.abs(x - door.x) + Math.abs(y - door.y) > 1);
  const f2 = map.anchors['book1.fork2'];
  for (const [x, y] of t) assert.ok(!(y === f2.y && (x === f2.x + 1 || x === f2.x + 2)));
});

// ---- the forks: never ambiguous, every option can be right -------------------------------------------
test('every fork of Altrove deals unambiguously and each option can be the right one', () => {
  const ALL = Object.keys(CARD);
  for (const W of WORLD_LIST) for (const st of W.steps.filter((s) => s.fork)) {
    const f = st.fork, faces = fairFaces(f.kind, f.options, ALL, true);
    assert.ok(faces.length, `${W.id}: fair faces`);
    for (const x of faces) assert.equal(rightOptions(f.kind, f.options, faceOf(x.id, x.rev)).length, 1);
    assert.equal(new Set(faces.map((x) => rightOptions(f.kind, f.options, faceOf(x.id, x.rev))[0])).size, f.options.length, `${W.id}: each option can be right`);
  }
});

test('the trial of each world runs on the engine: rooms, forks, outcomes', async () => {
  for (const W of WORLD_LIST) for (const right of [true, false]) {
    const rooms = [];
    const r = await runTrial(W, { say: async () => {}, ask: async () => ({ k: 0, ok: right }), room: async (_r, id) => { rooms.push(id); }, apply: async () => {}, plan: { loss: () => [] }, judge: () => ({ ok: true }) });
    assert.equal(r.outcome, right ? 'perfect' : 'fail');
    for (const id of rooms) assert.ok(W.rooms[id], id);
    for (const room of Object.values(W.rooms)) if (room.at) assert.ok(getMap(room.at.split('.')[0]).anchors[room.at], room.at);
    assert.ok(W.outcomes.perfect.reward.item === W.item.id);
    assert.ok(getMap(W.map).anchors[W.start]);
  }
});

// ---- registry, triggers, state ------------------------------------------------------------------------
test('registry: a chain after the library, by what she has, one at a time; old saves get them', async () => {
  const { EXTRAS, extraStatus } = await import('../src/core/extras.js');
  const { restore, status, mem } = await import('../src/glue/elsewhere.rules.js');
  const book = EXTRAS.find((e) => e.id === 'elsewhere.book'), cl = EXTRAS.find((e) => e.id === 'elsewhere.clouds');
  assert.ok(book && cl);
  assert.deepEqual(book.after, ['library.first']); assert.deepEqual(cl.after, ['elsewhere.book']);
  const s = fresh();
  s.chapter = 2;
  const st = (e) => extraStatus(e, s, cond);
  assert.equal(st(book), 'hidden', 'not before the library');
  s.flags['library.first'] = true;
  assert.notEqual(st(book), 'hidden');
  assert.equal(st(cl), 'hidden', 'one at a time');
  s.flags['elsewhere.book.done'] = true;
  assert.equal(st(book), 'done'); assert.notEqual(st(cl), 'hidden');
  // by the flying lesson, in chapter 1
  const s1 = fresh(); s1.chapter = 1; s1.flags['library.first'] = true;
  assert.equal(extraStatus(book, s1, cond), 'hidden');
  s1.flags['lesson.fly'] = true;
  assert.notEqual(extraStatus(book, s1, cond), 'hidden');
  // a visit cut by a reload: back where she was, nothing recorded, open again
  const s2 = fresh();
  assert.equal(restore(s2), false, 'an old save has no key');
  mem(s2).in = 'clouds'; mem(s2).from = { map: 'cottage', x: 5, y: 2 }; s2.pos = { map: 'clouds', x: 9, y: 13 };
  assert.equal(restore(s2), true);
  assert.deepEqual(s2.pos, { map: 'cottage', x: 5, y: 2 });
  assert.equal(mem(s2).in, null);
  assert.equal(status('clouds', s2, '2026-11-16'), 'open');
  mem(s2).results.clouds = { result: 'fail', day: '2026-11-16' };
  assert.equal(status('clouds', s2, '2026-11-16'), 'wait');
  assert.equal(status('clouds', s2, '2026-11-17'), 'open');
  mem(s2).results.clouds = { result: 'pass', day: '2026-11-17' };
  assert.equal(status('clouds', s2, '2026-11-18'), 'done');
});
test('the triggers stand in Salem on anchors, with a script that ends in the passage', async () => {
  const { SCRIPTS, CAST } = await import('../src/data/story/index.js');
  await import('../src/glue/elsewhere.rules.js');
  for (const W of WORLD_LIST) {
    const c = CAST.find((e) => e.id === `elsewhere.${W.id}`);
    assert.ok(c && getMap(c.at.split('.')[0]).anchors[c.at], W.id);
    assert.ok(!getMap(c.at.split('.')[0]).elsewhere, 'the trigger is in Salem');
    assert.deepEqual(SCRIPTS[c.script].at(-1), { do: 'elsewhere', id: W.id });
  }
});
