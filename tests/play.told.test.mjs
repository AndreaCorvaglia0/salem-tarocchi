// Exams ask what a card says only once the Reader has told it (src/systems/exam.rules.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuestions, toldPool, toldShare, RECOGNIZE } from '../src/systems/exam.rules.js';
import { makeExam, makeQuestion } from '../src/data/questions.js';

const seq = (seed = 1) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

test('told pool and share', () => {
  assert.deepEqual(toldPool(['m00', 'm01', 'm02'], { m02: true }), ['m00', 'm02']);
  assert.equal(toldShare(4, ['a', 'b', 'c', 'd'], []), 0);
  assert.equal(toldShare(3, ['a', 'b', 'c', 'd', 'e', 'f'], ['a']), 1);
  assert.equal(toldShare(4, ['a', 'b'], ['a', 'b']), 4);
});

test('untold cards are only recognised; told cards may be asked anything', () => {
  for (let s = 1; s < 40; s++) {
    const pool = ['m00', 'm01', 'm02', 'm03', 'm05'], told = { m03: true };
    const qs = buildQuestions({ kind: 'constable', pool, told, n: 4, level: 1, rng: seq(s), makeExam, makeQuestion });
    assert.equal(qs.length, 4);
    for (const q of qs) if (q.cardId && !['m00', 'm03'].includes(q.cardId)) assert.ok(RECOGNIZE.includes(q.kind), `${q.cardId} asked by ${q.kind}`);
  }
});

test('nothing told: every question is recognition', () => {
  const qs = buildQuestions({ kind: 'constable', pool: ['m01', 'm02', 'm03'], told: {}, n: 3, level: 1, rng: seq(7), makeExam, makeQuestion });
  for (const q of qs) assert.ok(RECOGNIZE.includes(q.kind) || q.cardId === 'm00', q.kind);
});
