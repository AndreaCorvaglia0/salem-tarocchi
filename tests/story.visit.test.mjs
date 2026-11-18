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

// BACKLOG 1.3: nine questions were never asked. Two cards on the same axis in one visit (Il Carro and
// L'Imperatore, L'Eremita and La Giustizia) always gave the question to the older one; and after the coven
// the story had no more visits, so the third row was never told. Ties now turn with her answers, and after
// the ending the bed brings the Reader back (props.js#prop.bed) until every card is told.
test('a tie between two cards on the same axis does not always go to the older one', () => {
  const t = { m07: { ask: { q: 'Q7', a: [{ t: 'a', trait: { esplora: 1 } }, { t: 'b', trait: { esplora: -1 } }] } },
    m04: { ask: { q: 'Q4', a: [{ t: 'a', trait: { esplora: 1 } }, { t: 'b', trait: { esplora: -1 } }] } } };
  const pick = (n) => pickAsk({ hits: { esplora: { plus: 2, minus: 0 }, tono: { plus: n, minus: 0 } } }, ['m07', 'm04'], t);
  assert.deepEqual(new Set([0, 1, 2, 3].map(pick)), new Set(['m07', 'm04']));
  assert.equal(pick(5), pick(5), 'the same state gives the same card');
});

test('after the ending the bed brings a visit, even for one card left', async () => {
  const { PROPS } = await import('../src/data/story/scripts/props.js');
  const visits = JSON.stringify(PROPS['prop.bed']).match(/"do":"visit"[^}]*/g) || [];
  assert.deepEqual(visits, ['"do":"visit","force":true']);
  const node = PROPS['prop.bed'].find((n) => n.if && JSON.stringify(n).includes('"visit"'));
  assert.deepEqual(node.if, { chapterMin: 4 }, 'never before the ending: the story\'s own visits keep their cards');
  // one card left (Il Mondo, given in the last session): forced, it is told
  const s = { cards: { m21: card(1) }, told: {} };
  assert.deepEqual(planVisit({ state: s, talk, openers, closers, test: cond, force: true }).cards.map((c) => c.id), ['m21']);
});

test('random play: every question of the Reader comes out (the Fool has none to ask)', async () => {
  const { loadStory } = await import('../scripts/lore/story.mjs');
  const { measure } = await import('../scripts/coverage.mjs');
  const r = await measure({ runs: 120, seed: 1, model: await loadStory() });
  const asked = new Set(r.sceneUnits.filter((u) => u.n > 0).map((u) => u.key));
  const never = Array.from({ length: 21 }, (_, i) => `visits.js#talk.m${String(i + 1).padStart(2, '0')}`).filter((k) => !asked.has(k));
  assert.deepEqual(never.filter((k) => /m0[4]|m1[15-9]|m2[01]/.test(k)), [], 'the nine of the backlog');
  assert.ok(never.length <= 3, `at most the rarest ones missing in 120 runs: ${never.join(', ')}`);
});
