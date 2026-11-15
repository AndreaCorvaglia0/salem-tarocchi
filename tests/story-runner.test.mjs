import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state } from '../src/core/state.js';
import { createRunner, cardOfNumber } from '../src/story/runner.js';

const make = ({ choices = [], scripts = {}, svc = {} } = {}) => {
  const log = [];
  const ch = [...choices];
  const ui = {
    say: async (who, t) => { log.push(['say', who, t]); },
    choose: async (texts) => { log.push(['choose', texts]); return ch.length ? ch.shift() : 0; },
    cinema: async (lines) => { log.push(['cinema', lines]); },
    moment: async (t) => { log.push(['moment', t]); },
    sleep: async (ms) => { log.push(['sleep', ms]); },
    end: async () => { log.push(['end']); },
  };
  const calls = [];
  const call = async (name, arg) => { calls.push([name, arg]); return svc[name] ? svc[name](arg) : undefined; };
  const warns = [];
  const r = createRunner({ ui, call, getScript: (id) => scripts[id], warn: (...a) => warns.push(a) });
  return { r, log, calls, warns };
};
const says = (log) => log.filter((l) => l[0] === 'say').map((l) => l[2]);

test('say fills tokens', async () => {
  setState({ player: { name: 'Ada' } });
  const { r, log } = make();
  await r.run([{ say: 'malva', t: 'Ciao {name}.' }]);
  assert.deepEqual(says(log), ['Ciao Ada.']);
});

test('choice: tag, trust, flag, then; only flagged options set a flag', async () => {
  setState({});
  const nodes = [{ choice: [
    { t: 'A', tag: { card: 'm14', suit: 'c' }, trust: { malva: 1 }, flag: 'x', then: [{ say: 'malva', t: 'uno' }] },
    { t: 'B', then: [{ say: 'malva', t: 'due' }] } ] }];
  let m = make({ choices: [0] });
  await m.r.run(nodes);
  assert.equal(state.points.m14, 1); assert.equal(state.suit.c, 1); assert.equal(state.trust.malva, 1); assert.equal(state.flags.x, true);
  assert.deepEqual(says(m.log), ['uno']);
  setState({});
  m = make({ choices: [1] });
  await m.r.run(nodes);
  assert.deepEqual(state.flags, {}); assert.deepEqual(says(m.log), ['due']);
});

test('bad choice index falls back to the first', async () => {
  setState({});
  const m = make({ choices: [9] });
  await m.r.run([{ choice: [{ t: 'A', flag: 'a' }, { t: 'B', flag: 'b' }] }]);
  assert.equal(state.flags.a, true);
});

test('if / then / else with conditions', async () => {
  setState({ flags: { yes: true } });
  const { r, log } = make();
  await r.run([{ if: { flag: 'yes' }, then: [{ say: 'tu', t: 'then' }], else: [{ say: 'tu', t: 'else' }] }, { if: { flag: 'no' }, then: [{ say: 'tu', t: 'x' }], else: [{ say: 'tu', t: 'y' }] }, { if: { flag: 'no' }, then: [{ say: 'tu', t: 'z' }] }]);
  assert.deepEqual(says(log), ['then', 'y']);
});

test('actions go to progress', async () => {
  setState({});
  const { r } = make();
  await r.run([
    { do: 'xp', n: 10 }, { do: 'coins', n: 5 }, { do: 'flag', k: 'k1' }, { do: 'trust', who: 'ortica', n: 2 },
    { do: 'point', card: 'm09', suit: 's' }, { do: 'word', k: 'fear', v: 'il buio' }, { do: 'diary', t: 'Riga.' },
    { do: 'step', id: 'c1.x' }, { do: 'chapter', n: 2 }, { do: 'power', id: 'fire' }, { do: 'tool', id: 'bottle', n: 2 },
    { do: 'lesson', id: 'deck' }, { do: 'teach', spread: 'ppf' } ]);
  assert.equal(state.xp, 10); assert.equal(state.coins, 5); assert.equal(state.flags.k1, true); assert.equal(state.trust.ortica, 2);
  assert.equal(state.points.m09, 1); assert.equal(state.suit.s, 1); assert.equal(state.words.fear, 'il buio'); assert.equal(state.diary[0].t, 'Riga.');
  assert.equal(state.step, 'c1.x'); assert.equal(state.chapter, 2); assert.equal(state.powers.fire, true); assert.equal(state.tools.bottle, 2);
  assert.equal(state.lessons.deck, true); assert.equal(state.spreads.ppf, true);
});

test('teach shows a moment', async () => {
  setState({});
  const { r, log } = make();
  await r.run([{ do: 'teach', spread: 'single' }]);
  assert.match(log.find((l) => l[0] === 'moment')[1], /^Hai imparato: /);
});

test('services: giveCard, draw (row, weights, give), reading, travel, session', async () => {
  setState({ chapter: 1, player: { birthCard: 'm06' } });
  const { r, calls } = make({ svc: { 'draw.pick': (a) => a.pool[0] } });
  await r.run([{ do: 'giveCard', id: 'm01' }, { do: 'draw', mode: 'fan', pool: 'row', give: true, title: 'T' }, { do: 'reading', spread: 'single', client: 'c1.widow' }, { do: 'travel', to: 'forest.entry' }, { do: 'session', id: 's1' }]);
  assert.deepEqual(calls[0], ['card.found', 'm01']);
  assert.equal(calls[1][0], 'draw.pick');
  assert.equal(calls[1][1].pool.length, 7);
  assert.equal(calls[1][1].weights.m06, 7); assert.equal(calls[1][1].weights.m01, 1); // birth card and your card favoured
  assert.deepEqual(calls[2], ['card.found', 'm01']); // first of the row (m01) given
  assert.equal(calls[3][0], 'reading.open'); assert.equal(calls[3][1].client, 'c1.widow');
  assert.deepEqual(calls[4], ['world.travel', 'forest.entry']); assert.deepEqual(calls[5], ['story.session', 's1']);
});

test('draw with an explicit pool and a card already found is not repeated', async () => {
  setState({});
  const { r, calls } = make({ svc: { 'draw.pick': (a) => a.pool[1] } });
  await r.run([{ do: 'draw', pool: ['m02', 'm03'], give: true }]);
  assert.deepEqual(calls[1], ['card.found', 'm03']);
});

test('exam sets exam.passed both ways', async () => {
  for (const passed of [true, false]) {
    setState({});
    const { r, log, calls } = make({ svc: { 'exam.start': () => ({ passed }) } });
    await r.run([{ do: 'exam', kind: 'constable' }, { if: { flag: 'exam.passed' }, then: [{ say: 'tu', t: 'ok' }], else: [{ say: 'tu', t: 'ko' }] }]);
    assert.deepEqual(says(log), [passed ? 'ok' : 'ko']);
    assert.equal(calls[0][1].kind, 'constable');
  }
});

test('goto jumps and ends the current script', async () => {
  setState({});
  const { r, log } = make({ scripts: { b: [{ say: 'tu', t: 'B' }] } });
  await r.run([{ say: 'tu', t: 'A' }, { choice: [{ t: 'x', then: [{ do: 'goto', script: 'b' }] }, { t: 'y' }] }, { say: 'tu', t: 'never' }]);
  assert.deepEqual(says(log), ['A', 'B']);
});

test('cinema, wait and run by id', async () => {
  setState({ player: { name: 'Ada' } });
  const { r, log } = make({ scripts: { s: [{ do: 'cinema', lines: ['Ciao {name}'] }, { do: 'wait', ms: 50 }] } });
  await r.run('s');
  assert.deepEqual(log[0], ['cinema', ['Ciao Ada']]); assert.deepEqual(log[1], ['sleep', 50]);
});

test('unknown nodes and actions warn and continue; failures never throw', async () => {
  setState({});
  const m = make({ svc: { 'exam.start': () => { throw new Error('boom'); } } });
  await m.r.run([{ foo: 1 }, { do: 'nope' }, null, { do: 'exam', kind: 'judge' }, { say: 'tu', t: 'still here' }]);
  assert.equal(m.warns.length >= 3, true);
  assert.deepEqual(says(m.log), ['still here']);
  await m.r.run('missing');
  await m.r.run(undefined);
});

test('runs are queued', async () => {
  setState({});
  const order = [];
  let release;
  const gate = new Promise((res) => { release = res; });
  const { r } = make({ scripts: { slow: [{ do: 'session', id: 'x' }], fast: [{ do: 'flag', k: 'fast' }] }, svc: { 'story.session': async () => { order.push('start'); await gate; order.push('end'); } } });
  const a = r.run('slow');
  const b = r.run('fast').then(() => order.push('fast'));
  await new Promise((res) => setTimeout(res, 20));
  assert.deepEqual(order, ['start']);
  release();
  await Promise.all([a, b]);
  assert.deepEqual(order, ['start', 'end', 'fast']);
});

test('end() is called once the queue is empty', async () => {
  setState({});
  const { r, log } = make();
  await Promise.all([r.run([{ say: 'tu', t: '1' }]), r.run([{ say: 'tu', t: '2' }])]);
  assert.equal(log.filter((l) => l[0] === 'end').length, 1);
});

test('ext handles session nodes and shares {picked}', async () => {
  setState({});
  const log = [];
  const ui = { say: async (w, t) => { log.push(t); }, choose: async () => 0 };
  const r = createRunner({ ui, call: async () => {}, ext: async (node, api) => {
    if (node.pick) { api.vars.picked = 'La Forza'; await api.run(node.then); return true; }
    return false;
  }, warn: () => {} });
  await r.run([{ pick: 'number', then: [{ say: 'lettrice', t: 'Hai detto {picked}.' }] }]);
  assert.deepEqual(log, ['Hai detto La Forza.']);
});

test('cardOfNumber: 22 is the Fool', () => {
  assert.equal(cardOfNumber(1), 'm01'); assert.equal(cardOfNumber(21), 'm21'); assert.equal(cardOfNumber(22), 'm00');
});

test('portrait nodes: option trait, do trait, verdict, visit; a question line is marked', async () => {
  setState({ player: { birthCard: 'm11' } });
  const m = make({ choices: [1] });
  await m.r.run([
    { do: 'trait', trait: { tono: 2 } }, { do: 'trait', parola: -1 },
    { say: 'lettrice', t: 'Domanda?' },
    { choice: [{ t: 'A', trait: { guida: 1 } }, { t: 'B', trait: { guida: -1 } }] },
    { do: 'verdict' }, { do: 'visit', force: true },
  ]);
  assert.equal(state.traits.tono, 2); assert.equal(state.traits.parola, -1); assert.equal(state.traits.guida, -1);
  assert.equal(state.verdicts.length, 1);
  assert.deepEqual(m.calls.find((c) => c[0] === 'story.visit'), ['story.visit', { force: true }]);
});
