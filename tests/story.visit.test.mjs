// Visits composed from the pieces (src/story/visit.plan.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { planVisit, untoldOf, pickAsk } from '../src/story/visit.plan.js';

const card = (at, extra = {}) => ({ found: true, stars: 1, at, words: ['', '', ''], detail: null, ...extra });
const talk = {
  m01: { tell: 'T1', details: { wand: 'D1' }, words: 'W1 {words:m01}', ask: { q: 'Q1', a: [{ t: 'a', trait: { esplora: 1 }, re: 'r' }, { t: 'b', trait: { esplora: -1 }, re: 's' }] } },
  m02: { tell: 'T2', details: {}, words: 'W2', ask: { q: 'Q2', a: [{ t: 'a', trait: { tono: 1 }, re: 'r' }, { t: 'b', trait: { tono: -1 }, re: 's' }] } },
  m03: { tell: 'T3' },
};
const openers = [{ when: { never: 1 }, t: 'no' }, { when: true, t: 'O' }];
const closers = [{ when: true, t: 'C' }];
const cond = (c) => c === true || c == null || !c.never;

test('fewer than two untold: nothing, unless forced', () => {
  const s = { cards: { m00: card(0), m01: card(1) }, told: {} };
  assert.equal(planVisit({ state: s, talk, openers, closers, test: cond }), null);
  assert.equal(planVisit({ state: s, talk, openers, closers, test: cond, force: true }).cards.length, 1);
  assert.equal(planVisit({ state: { cards: {}, told: {} }, force: true }), null);
});

test('oldest first, at most three, told and confiscated and the Fool left out', () => {
  const s = { cards: { m05: card(5), m01: card(1), m02: card(2), m03: card(3), m04: card(4, { confiscated: true }), m06: card(0) }, told: { m06: true } };
  assert.deepEqual(untoldOf(s), ['m01', 'm02', 'm03', 'm05']);
  const p = planVisit({ state: s, talk, openers, closers, test: cond });
  assert.deepEqual(p.cards.map((c) => c.id), ['m01', 'm02', 'm03']);
  assert.deepEqual(p.opener, { t: 'O', then: null }); assert.deepEqual(p.closer, { t: 'C', then: null });
  assert.equal(p.thread, null); assert.equal(p.ritual, null);
  assert.deepEqual(Object.keys(p.cards[0]).slice(0, 4), ['id', 'detail', 'tell', 'words']);
});

test('detail only when TALK has it; words only when she wrote one; fallback tell from the sheet', () => {
  const s = { cards: { m01: card(1, { detail: 'wand', words: ['luce', '', ''] }), m02: card(2, { detail: 'veil' }), m09: card(3) }, told: {} };
  const p = planVisit({ state: s, talk, openers, closers, test: cond, sheetOf: (id) => (id === 'm09' ? { says: 'S9' } : {}) });
  const [a, b, c] = p.cards;
  assert.equal(a.detail, 'D1'); assert.equal(a.words, 'W1 {words:m01}');
  assert.equal(b.detail, null); assert.equal(b.words, null);
  assert.equal(c.tell, 'S9');
});

test('one question: on the card whose axis is least explored', () => {
  const s = { cards: { m01: card(1), m02: card(2) }, told: {}, hits: { esplora: { plus: 3, minus: 1 }, tono: { plus: 0, minus: 1 } } };
  assert.equal(pickAsk(s, ['m01', 'm02'], talk), 'm02');
  const p = planVisit({ state: s, talk, openers, closers, test: cond });
  assert.equal(p.cards.filter((c) => c.ask).length, 1);
  assert.equal(p.cards.find((c) => c.ask).id, 'm02');
  // no question data anywhere: no question
  assert.equal(pickAsk(s, ['m03'], talk), null);
});

test('thread and rituals: first that holds, with its nodes', () => {
  const s = { cards: { m01: card(1), m02: card(2) }, told: {} };
  const then = [{ do: 'flag', k: 'x' }];
  const p = planVisit({ state: s, talk, openers, thread: [{ when: { never: 1 }, t: 'no' }, { when: true, t: 'TH', then }], rituals: [{ when: { never: 1 }, t: 'R' }], closers, test: cond });
  assert.deepEqual(p.thread, { t: 'TH', then }); assert.equal(p.ritual, null);
});
