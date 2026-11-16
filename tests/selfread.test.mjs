import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state } from '../src/core/state.js';
import { TREE, walk, allPaths, makeQuestion, hasVoice } from '../src/reading/index.js';
import { CARD } from '../src/data/cards.base.js';
import { SPREADS } from '../src/data/spreads.js';
import {
  CAP, makeEntry, addReading, removeReading, compose, seedOf, clientEntry, pickerCards, PICK_TABS, realCards,
  spreadsFor, canSelfRead, xpDue, dateIt,
} from '../src/glue/selfread.rules.js';

const cards3 = [{ pos: 'past', card: 'm01', rev: false }, { pos: 'present', card: 'c05', rev: true }, { pos: 'future', card: 'm19', rev: false }];

test('saved shape', () => {
  const e = makeEntry({ at: '2026-11-16T20:00:00.000Z', question: { ambito: 'amore', forma: 'andra', text: '  Lui tornerà? ' }, spread: 'ppf', cards: cards3, note: 'boh', real: true });
  assert.deepEqual(Object.keys(e).sort(), ['at', 'cards', 'closing', 'note', 'question', 'real', 'spread', 'who']);
  assert.equal(e.who, 'me');
  assert.deepEqual(e.question, { ambito: 'amore', forma: 'andra', text: 'Lui tornerà?' });
  assert.deepEqual(e.cards, cards3);
  assert.equal(e.real, true);
  assert.ok(e.closing.length > 10);
  const plain = makeEntry({ question: { ambito: 'se', forma: 'quadro' }, spread: 'single', cards: [{ card: 'm00' }] });
  assert.equal('text' in plain.question, false);
  assert.equal(plain.cards[0].pos, 'present');
  assert.ok(!Number.isNaN(Date.parse(plain.at)));
  assert.throws(() => makeEntry({ question: { ambito: 'x', forma: 'sino' }, spread: 'single', cards: [{ card: 'm00' }] }));
  assert.throws(() => makeEntry({ question: { ambito: 'se', forma: 'sino' }, spread: 'ppf', cards: [{ card: 'm00' }] }));
  assert.throws(() => makeEntry({ question: { ambito: 'se', forma: 'sino' }, spread: 'single', cards: [{ card: 'zz' }] }));
});

test('the diary: newest first, capped at 60, delete by date', () => {
  let list = [];
  for (let i = 0; i < CAP + 5; i++) list = addReading(list, { at: `t${i}` });
  assert.equal(list.length, CAP);
  assert.equal(list[0].at, `t${CAP + 4}`);
  assert.equal(list[CAP - 1].at, 't5');
  assert.equal(removeReading(list, 't10').length, CAP - 1);
});

test('same text when reopened', () => {
  const e = makeEntry({ at: '2026-11-16T21:00:00.000Z', question: { ambito: 'lavoro', forma: 'scelta' }, spread: 'ppf', cards: cards3 });
  const a = compose(e), b = compose(JSON.parse(JSON.stringify(e)));
  assert.equal(a.full, b.full);
  assert.equal(a.closing || a.advice, e.closing);
  assert.notEqual(seedOf(e), seedOf({ ...e, at: '2026-11-16T21:00:00.001Z' }));
  assert.equal(a.parts.length, 3);
  assert.ok(a.parts.every((p) => typeof p.text === 'string' && p.text.length > 10));
});

test('the tree reaches a valid question on every path', () => {
  for (const p of allPaths(TREE)) {
    const w = walk(TREE, p.path);
    assert.equal(w.done, true);
    const q = makeQuestion({ ambito: w.ambito, forma: w.forma });
    const e = makeEntry({ question: q, spread: 'single', cards: [{ card: 'm17' }] });
    assert.ok(compose(e).full.length > 0);
    assert.ok(p.path.length <= 6);
  }
});

test('the picker returns valid cards', () => {
  const all = PICK_TABS.flatMap(([k]) => pickerCards(k));
  assert.equal(all.length, 78);
  assert.equal(new Set(all).size, 78);
  assert.ok(all.every((id) => CARD[id] && hasVoice(id)));
  assert.equal(pickerCards('m').length, 22);
  assert.deepEqual(realCards('ppf', [{ card: 'w01' }, { card: 'm05', rev: true }, { card: 'p14' }]),
    [{ pos: 'past', card: 'w01', rev: false }, { pos: 'present', card: 'm05', rev: true }, { pos: 'future', card: 'p14', rev: false }]);
  assert.equal(realCards('ppf', [{ card: 'w01' }, { card: 'w01' }, { card: 'p14' }]), null);
  assert.equal(realCards('ppf', [{ card: 'w01' }, null, { card: 'p14' }]), null);
  assert.equal(realCards('celtic', [{ card: 'w01' }]), null);
  const ten = pickerCards('c').slice(0, 10).map((card) => ({ card }));
  assert.equal(realCards('celtic', ten).length, SPREADS.celtic.positions.length);
});

test('client readings go to the diary compactly; the old flow and the finale do not', () => {
  const cl = { id: 'c1.widow', name: 'La vedova', question: 'Devo vendere il campo?', ambito: 'lavoro', forma: 'scelta' };
  const r = { ok: true, cards: [{ card: 'm01', rev: false, pos: 'present', idea: true, meaning: false }] };
  const e = clientEntry({ client: cl, spread: 'single' }, r, '2026-11-16T10:00:00.000Z');
  assert.equal(e.who, 'La vedova');
  assert.deepEqual(e.cards, [{ pos: 'present', card: 'm01', rev: false }]);
  assert.equal(e.question.text, 'Devo vendere il campo?');
  assert.equal(e.real, false);
  assert.equal(clientEntry({ client: cl, spread: 'single' }, { score: 1, coins: 2 }, 'x'), null);
  assert.equal(clientEntry({ client: 'self', spread: 'celtic' }, r, 'x'), null);
});

test('entry, spreads, once a day, dates', () => {
  setState({});
  assert.equal(canSelfRead(state), false);
  setState({ stats: { readings: 1 } });
  assert.equal(canSelfRead(state), true);
  assert.deepEqual(spreadsFor({}), ['single', 'ppf']);
  assert.deepEqual(spreadsFor({ celtic: true }), ['single', 'ppf', 'celtic']);
  assert.equal(xpDue(undefined, '2026-11-16'), true);
  assert.equal(xpDue('2026-11-16', '2026-11-16'), false);
  assert.equal(dateIt('2026-11-16T12:00:00'), '16 novembre 2026');
  assert.deepEqual(state.readings, []);
  setState({ readings: 'broken' });
  assert.deepEqual(state.readings, []);
});

test('glue: a reading for me pays a little xp once a day, never coins; client readings are kept', async () => {
  const { provide, call } = await import('../src/core/services.js');
  provide('reading.open', async () => ({ ok: true, cards: [{ pos: 'present', card: 'm03', rev: false }], coins: 3 }));
  const glue = await import('../src/glue/selfread.js');
  setState({ stats: { readings: 1 }, xp: 0, coins: 0, pop: 0 });
  const e = makeEntry({ question: { ambito: 'se', forma: 'fare' }, spread: 'single', cards: [{ card: 'm17' }] });
  glue.keepReading(e);
  glue.keepReading({ ...e, at: `${e.at}x` });
  assert.equal(state.xp, 5);
  assert.equal(state.coins, 0);
  assert.equal(state.pop, 0);
  assert.equal(state.readings.length, 2);
  glue.updateNote(e.at, 'una nota');
  assert.equal(state.readings[1].note, 'una nota');
  await call('reading.open', { spread: 'single', client: 'c1.widow' });
  assert.equal(state.readings.length, 3);
  assert.notEqual(state.readings[0].who, 'me');
  await call('reading.open', { spread: 'celtic', client: 'self' });
  assert.equal(state.readings.length, 3);
  glue.deleteReading(e.at);
  assert.equal(state.readings.length, 2);
  assert.equal(await call('selfread.intro'), false);
  assert.equal(await call('selfread.intro'), true);
});
