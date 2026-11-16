// The trials' engine (src/trials): asking the cards, the run and its outcomes, losses, the library's topics,
// the escape's planning.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state } from '../src/core/state.js';
import { test as cond } from '../src/core/cond.js';
import { CARD } from '../src/data/cards.base.js';
import { TRIALS } from '../src/data/trials/index.js';
import { SCRIPTS, CAST, STEPS, SIDE } from '../src/data/story/index.js';
import { DEFS } from '../src/data/world/index.js';
import { faceOf, matches, signFor, rightOptions, fair, fairFaces, dealFor, dealFan, askCards, judge, knownPool, saidLine } from '../src/trials/ask.js';
import { outcomeOf, runTrial, gateCards, safeToLose, pickLostCard, planLoss, planReward, trialStatus } from '../src/trials/run.js';
import { topicPage, topicQuestions, taughtTopics, studyXp, kindOf } from '../src/trials/topics.js';
import { plan, straightMakesIt, distances, HESITATE, PLAYER_STEP } from '../src/world/escape.plan.js';

const ALL = Object.keys(CARD);
const seeded = (n = 1) => () => { n = (n * 16807) % 2147483647; return n / 2147483647; };
const forks = Object.values(TRIALS).flatMap((t) => t.steps.filter((s) => s.fork).map((s) => s.fork));
const SUIT_RULE = { kind: 'quesito', by: 'suit', options: [{ text: 'a', tags: { suit: ['c', 's'] } }, { text: 'b', tags: { suit: ['w', 'p'] } }, { text: 'c', tags: { suit: 'major' } }] };

test('every card has a face with favore, moto and essenza, both ways', () => {
  for (const id of ALL) for (const rev of [false, true]) {
    const f = faceOf(id, rev);
    assert.ok(f && Number.isInteger(f.favore) && f.moto && f.essenza, `${id} ${rev}`);
  }
});

test('segno: the sign of favore; zero is the cautious option', () => {
  const three = [{ sign: 'go' }, { sign: 'slow' }, { sign: 'stop' }], two = [{ sign: 'go' }, { sign: 'stop' }];
  assert.equal(signFor({ favore: 2 }, three), 'go');
  assert.equal(signFor({ favore: -1 }, three), 'stop');
  assert.equal(signFor({ favore: 0 }, three), 'slow');
  assert.equal(signFor({ favore: 0 }, two), 'stop');
  for (const id of ALL) for (const rev of [false, true]) {
    const f = faceOf(id, rev);
    assert.deepEqual(rightOptions('segno', three, f), [f.favore > 0 ? 0 : f.favore < 0 ? 2 : 1]);
  }
});

test('idea and quesito: tags match the face', () => {
  const f = faceOf('c05');
  assert.ok(matches({ suit: 'c' }, f));
  assert.ok(matches({ suit: ['w', 'c'], group: '4-6' }, f));
  assert.ok(!matches({ suit: 'c', group: '1-3' }, f));
  assert.ok(matches({ arcana: 'minor', favore: f.favore < 0 ? '-' : f.favore > 0 ? '+' : '0' }, f));
  assert.ok(matches({ cards: ['c05'] }, f));
  assert.ok(!matches({}, f), 'no tags never match');
  assert.ok(matches({ suit: 'major' }, faceOf('m13')));
  assert.ok(matches({ moto: faceOf('m13').moto }, faceOf('m13')));
});

test('deals are never ambiguous, over the whole deck and both orientations', () => {
  for (const fork of [...forks, SUIT_RULE]) {
    const faces = fairFaces(fork.kind, fork.options, ALL, true);
    assert.ok(faces.length > 0, `${fork.kind}: some fair face`);
    for (const x of faces) assert.equal(rightOptions(fork.kind, fork.options, faceOf(x.id, x.rev)).length, 1);
    // every option can be the right one somewhere in the deck
    const rights = new Set(faces.map((x) => rightOptions(fork.kind, fork.options, faceOf(x.id, x.rev))[0]));
    assert.equal(rights.size, fork.options.length, `${fork.kind}: each option can be right`);
    const rng = seeded(7);
    for (let i = 0; i < 300; i++) {
      const d = dealFor(fork.options, ALL, rng, { kind: fork.kind, reversed: true });
      assert.ok(d && fair(fork.kind, fork.options, faceOf(d.id, d.rev)));
    }
    const fan = dealFan(fork.options, ALL, rng, { kind: fork.kind, reversed: true });
    assert.equal(new Set(fan.map((x) => x.id)).size, fan.length, 'a fan has distinct cards');
    for (const x of fan) assert.ok(fair(fork.kind, fork.options, faceOf(x.id, x.rev)));
  }
});

test('askCards: from the cards she knows, reversed only after the lesson, widened when none fits', () => {
  setState({ cards: { m01: { found: true }, m16: { found: true }, m03: { found: true, confiscated: true } } });
  let p = knownPool(state);
  assert.deepEqual(p.ids.sort(), ['m01', 'm16']);
  assert.equal(p.reversed, false);
  setState({ cards: { m01: { found: true } }, flags: { 'lesson.minors.1': true, 'lesson.minors.2': true, 'lesson.reversed': true } });
  p = knownPool(state);
  assert.ok(p.ids.includes('c01') && p.ids.includes('w03') && !p.ids.includes('w04'));
  assert.equal(p.reversed, true);
  const seg = forks.find((f) => f.kind === 'segno');
  const d = askCards({ pool: ['m01', 'm16'], rng: seeded(3), ...seg });
  assert.ok(d.fan.every((x) => ['m01', 'm16'].includes(x.id) && !x.rev));
  const none = askCards({ pool: ['m01'], rng: seeded(3), kind: 'quesito', options: [{ text: 'x', tags: { suit: 'c' } }] });
  assert.ok(none.widened && none.fan.every((x) => CARD[x.id].suit === 'c'));
  const j = judge(d, faceOf(d.fan[0].id), 0);
  assert.equal(typeof j.ok, 'boolean');
  assert.match(j.said, /^Era una carta/);
  assert.match(saidLine({ kind: 'idea', options: [{ text: 'La scala.' }] }, faceOf('m13'), 0), /^Diceva «.*», e per questo indicava «La scala»\.$/);
  assert.match(saidLine({ ...SUIT_RULE }, faceOf('c05'), 0), /^Era una carta di Coppe/);
});

test('outcomes by errors: 0 perfect, 1-2 pass, 3+ fail', () => {
  assert.deepEqual([0, 1, 2, 3, 7].map((n) => outcomeOf(n)), ['perfect', 'pass', 'pass', 'fail', 'fail']);
});

const fakeIo = ({ right = true, escape = 'safe' } = {}) => {
  const seen = { rooms: [], said: 0, applied: [], end: null };
  return { seen, io: {
    say: async (l) => { seen.said += l.length; },
    witchDraw: async () => {},
    ask: async (fork) => ({ k: 0, ok: typeof right === 'function' ? right(fork) : right, face: null }),
    room: async (r, id) => { seen.rooms.push(id); },
    escape: async () => escape,
    choose: async () => 0,
    apply: async (fx) => { seen.applied.push(...fx); },
    plan: { loss: (l) => planLoss(l, { coins: 10, tools: {}, cards: { w05: { found: true } } }, TRIALS.demo, { rng: seeded(1) }) },
    end: async (r) => { seen.end = r; },
  } };
};

test('the demo trial runs: perfect, pass, fail with real losses', async () => {
  let { io, seen } = fakeIo();
  let r = await runTrial(TRIALS.demo, io);
  assert.equal(r.outcome, 'perfect'); assert.equal(r.errors, 0);
  assert.ok(seen.rooms.includes('good.pantry'));
  assert.ok(r.effects.some((e) => e.xp) && r.effects.some((e) => e.bond?.who === 'ortica' && e.bond.n > 0));
  ({ io, seen } = fakeIo({ right: (f) => f.kind !== 'segno' }));
  r = await runTrial(TRIALS.demo, io);
  assert.equal(r.outcome, 'pass'); assert.ok(seen.rooms.includes('bad.stairs'));
  ({ io, seen } = fakeIo({ right: false, escape: 'caught' }));
  r = await runTrial(TRIALS.demo, io);
  assert.equal(r.errors, 4); assert.equal(r.outcome, 'fail');
  assert.ok(seen.rooms.includes('bad.cellar'));
  assert.ok(r.effects.some((e) => e.coins < 0) && r.effects.some((e) => e.bond?.n < 0) && r.effects.some((e) => e.confiscate === 'w05'));
  assert.ok(seen.applied.some((e) => e.coins === -2), 'the escape caught: its loss');
});

test('losses never break a story gate and take only what she has', () => {
  const gates = gateCards(SCRIPTS, CAST, STEPS, SIDE, DEFS);
  for (const id of ['m17', 'm13', 'm06', 'm03']) assert.ok(gates.has(id), id);
  const s = { coins: 2, tools: { bottle: 0, incense: 1 }, cards: { m17: { found: true }, m09: { found: true }, w05: { found: true }, c02: { found: true, confiscated: true } } };
  assert.equal(safeToLose('m17', s, gates), false);
  assert.equal(pickLostCard('m17', s, { gates }), null);
  for (let i = 0; i < 50; i++) assert.equal(pickLostCard('random-minor', s, { rng: seeded(i + 1), gates }), 'w05');
  assert.equal(pickLostCard('random-minor', { cards: { m09: { found: true } } }, { gates }), null);
  const fx = planLoss({ coins: 5, tool: 'bottle', bond: 2, loseCard: 'random-minor' }, s, { with: 'malva' }, { gates });
  assert.deepEqual(fx, [{ coins: -2 }, { bond: { who: 'malva', n: -2 } }, { confiscate: 'w05' }]);
  assert.deepEqual(planLoss({ tool: 'any' }, s, {}, { gates }), [{ tool: 'incense', n: -1 }]);
  assert.deepEqual(planReward({ xp: 5, tool: 'incense', bond: 1, flag: 'x' }, { with: 'ortica' }), [{ xp: 5 }, { tool: 'incense', n: 1 }, { bond: { who: 'ortica', n: 1 } }, { flag: 'x' }]);
});

test('a main trial is final; a failed side trial waits for another day', () => {
  const side = { id: 's' }, main = { id: 'm', main: true };
  assert.equal(trialStatus(side, { trials: {} }, 'd1'), 'open');
  assert.equal(trialStatus(side, { trials: { s: { result: 'fail', day: 'd1' } } }, 'd1'), 'wait');
  assert.equal(trialStatus(side, { trials: { s: { result: 'fail', day: 'd1' } } }, 'd2'), 'open');
  assert.equal(trialStatus(side, { trials: { s: { result: 'pass', day: 'd1' } } }, 'd2'), 'done');
  assert.equal(trialStatus(main, { trials: { m: { result: 'fail', day: 'd1' } } }, 'd2'), 'done');
});

test('trial conditions, and old saves get the new keys', () => {
  setState({ trials: { demo: { result: 'fail', day: 'x' } } });
  assert.ok(cond({ trial: ['demo', 'fail'] }));
  assert.ok(!cond({ trial: 'demo' }), 'a failed side trial is not done');
  assert.ok(!cond({ trialPending: true }), 'the demo never counts');
  setState({});
  assert.deepEqual([state.trials, state.studied, state.studiedXp, state.trialSense], [{}, {}, {}, null]);
  setState({ studied: { m13: 5 } });
  assert.ok(cond({ studied: 'm13' }) && !cond({ studied: 'm14' }));
});

test('the library: a page and two questions for every kind of topic, xp once a day', () => {
  for (const t of ['m13', 'c', '1-3', '4-6', '7-10', 'court', 'reversed', 'sign']) {
    assert.ok(kindOf(t), t);
    const p = topicPage(t);
    assert.ok(p.title && (p.paras.length || p.rows.length), t);
    for (let i = 0; i < 20; i++) {
      const qs = topicQuestions(t, seeded(i + 2));
      assert.equal(qs.length, 2, t);
      for (const q of qs) {
        assert.equal(q.options.filter((o) => o.ok).length, 1, `${t}: ${q.prompt}`);
        assert.ok(q.options.length >= 3, `${t}: ${q.prompt} options`);
        assert.equal(new Set(q.options.map((o) => o.t)).size, q.options.length, `${t}: distinct options`);
      }
    }
  }
  assert.deepEqual(taughtTopics({ cards: {}, flags: {} }), []);
  const tt = taughtTopics({ cards: { m01: { found: true } }, flags: { 'lesson.minors.1': true, 'lesson.minors.4': true, 'lesson.reversed': true } });
  assert.deepEqual(tt, ['m01', 'sign', 'w', 'c', 's', 'p', '7-10', 'reversed']);
  assert.equal(studyXp('m01', { studiedXp: {} }, 'd'), 3);
  assert.equal(studyXp('m01', { studiedXp: { m01: 'd' } }, 'd'), 0);
});

test('the escape: walking straight makes it, standing still is caught in about eight seconds', () => {
  const open = (W, H) => (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  for (const [W, H, px, py] of [[40, 40, 20, 20], [30, 3, 2, 1], [12, 12, 0, 0]]) {
    const p = plan({ px, py, ok: open(W, H) });
    assert.ok(p, `${W}x${H}`);
    assert.ok(straightMakesIt(p), `${W}x${H}`);
    const caughtIn = (p.gap - 1) * p.stepMs;
    assert.ok(caughtIn > 4000 && caughtIn <= HESITATE, `${W}x${H}: caught in ${caughtIn}`);
    assert.ok(p.seconds * 1000 > p.dist * PLAYER_STEP * 2, 'generous time');
  }
  const corridor = plan({ px: 5, py: 0, ok: (x, y) => y === 0 && x >= 0 && x < 30 });
  assert.ok(corridor.target[0] > 5 ? corridor.start[0] < 5 : corridor.start[0] > 5, 'he comes from behind');
  assert.equal(distances(0, 0, open(3, 3)).get('2,2'), 4);
  assert.equal(plan({ px: 0, py: 0, ok: () => false }), null);
});
