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

// BACKLOG 2.4: the Reader asks before telling
import { pickRecall, ofCard, RECALL } from '../src/story/visit.plan.js';
import { sheet } from '../src/data/cards.js';
import { CARD } from '../src/data/cards.base.js';
import { leaks } from '../src/data/questions.js';

const NOW = 1_800_000_000_000;
const held = (due = NOW + 1e9, extra = {}) => ({ found: true, stars: 2, at: 0, due, words: ['', '', ''], ...extra });

test('recall: nothing without a told card; never a card on the table, a confiscated or a lost one', () => {
  assert.equal(pickRecall({ cards: { m01: held() }, told: {} }, [], { sheetOf: sheet, now: NOW }), null);
  const s = { cards: { m01: held(), m02: held(NOW, { confiscated: true }), m03: held() }, told: { m01: true, m02: true, m04: true } };
  assert.equal(pickRecall(s, ['m01'], { sheetOf: sheet, now: NOW }), null); // m01 on the table, m02 taken, m04 not hers
  assert.equal(pickRecall(s, [], { sheetOf: sheet, now: NOW }).id, 'm01');
});

test('recall: due first, then the one asked least, then the one due longest', () => {
  const s = { visits: 2, cards: { m01: held(), m07: held(NOW - 10), m09: held(NOW - 5000) }, told: { m01: true, m07: true, m09: true }, recalled: {} };
  assert.equal(pickRecall(s, [], { sheetOf: sheet, now: NOW }).id, 'm09');
  s.recalled = { m09: 2 };
  assert.equal(pickRecall(s, [], { sheetOf: sheet, now: NOW }).id, 'm07');
  s.cards.m07.due = NOW + 1; s.cards.m09.due = NOW + 1; s.recalled = { m09: 1, m07: 1 };
  assert.equal(pickRecall(s, [], { sheetOf: sheet, now: NOW }).id, 'm01');
});

test('recall: the question names the card, the three ideas do not; one right; never a confusable', () => {
  for (const id of ['m00', 'm02', 'm06', 'm08', 'm10', 'm12', 'm18', 'm21']) {
    for (let v = 0; v < 4; v++) {
      const s = { visits: v, cards: { [id]: held(NOW) }, told: { [id]: true }, recalled: {} };
      const r = pickRecall(s, [], { sheetOf: sheet, now: NOW });
      assert.equal(r.id, id);
      assert.ok(r.q.includes(ofCard(CARD[id].name)), r.q);
      assert.equal(r.a.length, 3);
      assert.equal(r.a.filter((o) => o.ok).length, 1);
      assert.equal(r.a.find((o) => o.ok).t, sheet(id).core);
      for (const o of r.a) assert.ok(!leaks(o.t, id), o.t);
      for (const o of r.a.filter((x) => !x.ok)) {
        const other = Object.keys(CARD).find((k) => sheet(k).core === o.t);
        assert.ok(!(sheet(id).confusables || []).includes(other), `${id}: ${other}`);
      }
      assert.ok(RECALL.right.includes(r.right));
      assert.equal(r.wrong.length, 2);
      assert.ok(r.wrong[1].includes(sheet(id).core) && !/\{/.test(r.wrong.join(' ')));
      for (const line of [r.q, r.right, ...r.wrong]) assert.ok(line.split(/\s+/).length <= 32, line); // a caption, not a page
    }
  }
  assert.equal(ofCard('Il Carro'), 'del Carro'); assert.equal(ofCard("L'Eremita"), "dell'Eremita"); assert.equal(ofCard('Gli Amanti'), 'degli Amanti');
});

test('recall in the plan: the ideas of other told cards come first; no sheets, no recall', () => {
  const s = { visits: 0, cards: { m01: card(1), m02: card(2), m05: held(NOW), m07: held(), m09: held() }, told: { m05: true, m07: true, m09: true } };
  const p = planVisit({ state: s, talk, openers, closers, test: cond, sheetOf: sheet, now: NOW });
  assert.equal(p.recall.id, 'm05');
  const others = p.recall.a.filter((o) => !o.ok).map((o) => o.t);
  assert.ok(others.every((t) => [sheet('m07').core, sheet('m09').core].includes(t)), others.join(' | '));
  // without sheets (the old tests' plans): no recall, nothing else changes
  assert.equal(planVisit({ state: s, talk, openers, closers, test: cond }).recall, null);
});
