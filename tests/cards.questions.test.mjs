// Questions and exams: shape rules over thousands of random draws, determinism, no repeated cards.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, MAJORS, MINORS, CARD } from '../src/data/cards.base.js';
import { SHEETS } from '../src/data/cards.js';
import { makeQuestion, makeExam, KINDS } from '../src/data/questions.js';

const mulberry = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const majors = MAJORS.map((c) => c.id), minors = MINORS.map((c) => c.id), all = CARDS.map((c) => c.id);
const STAR = { name: 'image', detail: 'image', which: 'image', meaning: 'meaning', odd: 'meaning', position: 'meaning', order: 'meaning', astro: 'astro' };

const check = (q, level, pool) => {
  assert.ok(KINDS.includes(q.kind), q.kind);
  assert.equal(q.star, STAR[q.kind]);
  assert.ok(typeof q.prompt === 'string' && q.prompt.length > 8 && q.prompt.length < 140, q.prompt);
  assert.ok(typeof q.explain === 'string' && q.explain.length > 10 && q.explain.length < 260, q.explain);
  assert.ok(!/undefined|\bnull\b|\{/.test(q.prompt + q.explain), `${q.prompt} / ${q.explain}`);
  assert.equal(q.options.length, level === 1 ? 3 : 4, `${q.kind} options`);
  assert.equal(q.options.filter((o) => o.ok).length, 1, `${q.kind} exactly one ok`);
  const keys = q.options.map((o) => (o.card != null ? `c:${o.card}` : `t:${String(o.t).toLowerCase()}`));
  assert.equal(new Set(keys).size, keys.length, `${q.kind} duplicate options ${keys}`);
  for (const o of q.options) assert.ok(o.card != null ? CARD[o.card] : typeof o.t === 'string' && o.t.length > 0);
  if (q.kind === 'position') assert.equal(q.cardId, null);
  else { assert.ok(CARD[q.cardId]); assert.ok(pool.includes(q.cardId), `${q.cardId} not in pool`); }
  if (q.kind === 'which') for (const o of q.options) assert.ok(o.card && !('t' in o));
  if (q.kind === 'which') assert.equal(q.options.find((o) => o.ok).card, q.cardId);
  if (q.kind === 'name' || q.kind === 'detail') assert.equal(q.options.find((o) => o.ok).t, CARD[q.cardId].name);
  if (q.kind === 'meaning') assert.equal(q.options.find((o) => o.ok).t, SHEETS[q.cardId].core);
  if (q.kind === 'detail') {
    const { x, y, r } = q.show.crop; assert.equal(q.show.card, q.cardId);
    assert.ok(SHEETS[q.cardId].details.some((d) => d.x === x && d.y === y && d.r === r && d.quiz !== false));
  }
  if (q.kind === 'astro') assert.equal(CARD[q.cardId].arcana, 'major');
  if (q.kind === 'odd') {
    const bad = q.options.find((o) => o.ok).t;
    assert.ok(!SHEETS[q.cardId].keywords.some((k) => k.toLowerCase() === bad.toLowerCase()));
    for (const o of q.options.filter((x) => !x.ok)) assert.ok(SHEETS[q.cardId].keywords.includes(o.t));
  }
};

test('5000 random questions are well formed (majors, minors, mixed; levels 1-3)', () => {
  const rng = mulberry(7);
  const seen = {};
  for (let i = 0; i < 5000; i++) {
    const pool = [majors, minors, all, majors.slice(0, 5)][i % 4];
    const level = 1 + (i % 3);
    const q = makeQuestion({ pool, kinds: KINDS, level, rng });
    check(q, level, pool);
    seen[q.kind] = (seen[q.kind] || 0) + 1;
  }
  for (const k of KINDS) assert.ok(seen[k] > 100, `kind ${k} appeared ${seen[k]} times`);
});

test('every single kind works alone, with each card of the Majors', () => {
  const rng = mulberry(11);
  for (const kind of KINDS) for (const id of majors) for (const level of [1, 3]) {
    const q = makeQuestion({ pool: [id], kinds: [kind], level, rng });
    check(q, level, [id]);
    if (kind !== 'position') assert.equal(q.kind, kind, `${kind} fell back for ${id}`);
  }
});

test('astro only asks the cards of the pool, with the right answer from the base file', () => {
  const rng = mulberry(3);
  for (let i = 0; i < 600; i++) {
    const pool = [majors[1 + (i % 21)], majors[1 + ((i * 7) % 21)]];
    const q = makeQuestion({ pool, kinds: ['astro'], level: 2, rng });
    assert.ok(pool.includes(q.cardId));
    const ok = q.options.find((o) => o.ok).t;
    assert.ok(ok === CARD[q.cardId].astro.name || ok === CARD[q.cardId].name);
  }
});

test('position questions take a spread and ask about its position', () => {
  const rng = mulberry(5);
  for (const spread of ['single', 'ppf', 'celtic']) for (let i = 0; i < 100; i++) {
    const q = makeQuestion({ pool: majors, kinds: ['position'], level: 2, rng, spread });
    assert.equal(q.spread, spread); check(q, 2, majors);
  }
});

test('deterministic with an injected rng', () => {
  const a = makeExam({ kind: 'judge', pool: all, level: 2, n: 8, rng: mulberry(99) });
  const b = makeExam({ kind: 'judge', pool: all, level: 2, n: 8, rng: mulberry(99) });
  assert.deepEqual(a, b);
  const c = makeExam({ kind: 'judge', pool: all, level: 2, n: 8, rng: mulberry(100) });
  assert.notDeepEqual(a, c);
});

test('exams: n questions, no repeated card when the pool allows, kinds as expected', () => {
  const rng = mulberry(21);
  for (let i = 0; i < 300; i++) {
    const kind = ['constable', 'afflicted', 'judge'][i % 3], level = 1 + (i % 3);
    const poolSize = 3 + (i % 8), pool = [...majors].sort(() => rng() - 0.5).slice(0, poolSize);
    const n = 3 + (i % 3);
    const ex = makeExam({ kind, pool, level, n, rng });
    assert.equal(ex.length, n);
    ex.forEach((q) => check(q, level, pool));
    if (poolSize >= n) {
      const ids = ex.filter((q) => q.cardId).map((q) => q.cardId);
      assert.equal(new Set(ids).size, ids.length, `repeated card in ${kind} exam: ${ids}`);
    }
  }
  const counts = { name: 0, meaning: 0, which: 0, other: 0 };
  for (let i = 0; i < 400; i++) for (const q of makeExam({ kind: 'constable', pool: majors, n: 5, rng })) counts[q.kind in counts ? q.kind : 'other']++;
  assert.ok(counts.name + counts.meaning + counts.which > counts.other * 3, JSON.stringify(counts));
  const judge = new Set();
  for (let i = 0; i < 200; i++) for (const q of makeExam({ kind: 'judge', pool: majors, level: 3, n: 8, rng })) judge.add(q.kind);
  assert.equal(judge.size, 8);
});

test('empty or odd pools still give a question', () => {
  const q = makeQuestion({ pool: [], rng: mulberry(1) });
  assert.ok(CARD[q.cardId]);
  const q2 = makeQuestion({ pool: ['zzz', 'm03'], rng: mulberry(1) });
  assert.equal(q2.cardId, 'm03');
});
