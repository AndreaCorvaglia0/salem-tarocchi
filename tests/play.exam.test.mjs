import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../src/systems/exam.rules.js';

const run = (kind, oks, opts = {}) => { let s = R.newExam({ kind, chapter: opts.chapter || 1, exams: opts.exams ?? 9 }); const fx = []; for (const ok of oks) { const r = R.answerStep(s, ok, opts.forgive?.shift?.() ? { forgive: true } : {}); s = r.state; fx.push(r.effect); if (s.over) break; } return { s, fx }; };

test('question counts: constable 3, 4 from chapter 2, 5 in chapter 3; judge 8', () => {
  assert.equal(R.questionCount('constable', 1), 3); assert.equal(R.questionCount('constable', 2), 4); assert.equal(R.questionCount('constable', 3), 5);
  assert.equal(R.questionCount('afflicted', 2), 4); assert.equal(R.questionCount('judge', 1), 8);
});
test('start values: constable 0, afflicted 50, judge 0', () => {
  assert.equal(R.newExam({ kind: 'constable' }).suspicion, 0); assert.equal(R.newExam({ kind: 'afflicted' }).suspicion, 50); assert.equal(R.newExam({ kind: 'judge' }).suspicion, 0);
});
test('constable: +34 per mistake, -10 per right (never below 0)', () => {
  let s = R.newExam({ kind: 'constable', exams: 9 });
  s = R.answerStep(s, false).state; assert.equal(s.suspicion, 34);
  s = R.answerStep(s, true).state; assert.equal(s.suspicion, 24);
  s = R.answerStep(s, true).state; assert.equal(s.suspicion, 14);
  let z = R.answerStep(R.newExam({ kind: 'constable', exams: 9 }), true).state; assert.equal(z.suspicion, 0);
});
test('judge: +25 per mistake', () => { const s = R.answerStep(R.newExam({ kind: 'judge', exams: 9 }), false).state; assert.equal(s.suspicion, 25); });
test('mercy: only while exams < 2, only the first mistake, and it says so', () => {
  let s = R.newExam({ kind: 'constable', exams: 0 });
  const a = R.answerStep(s, false); assert.equal(a.effect, 'mercy'); assert.equal(a.state.suspicion, 0); assert.equal(a.state.wrong, 1);
  const b = R.answerStep(a.state, false); assert.equal(b.effect, 'wrong'); assert.equal(b.state.suspicion, 34);
  assert.equal(R.newExam({ kind: 'constable', exams: 1 }).mercy, true); assert.equal(R.newExam({ kind: 'constable', exams: 2 }).mercy, false);
});
test('forgiven mistake (Malva) costs nothing', () => { const r = R.answerStep(R.newExam({ kind: 'judge', exams: 9 }), false, { forgive: true }); assert.equal(r.effect, 'forgiven'); assert.equal(r.state.suspicion, 0); });
test('failed at 100 at any time, or at 67 at the end', () => {
  // afflicted starts at 50: two mistakes reach 118 -> over at once, before the questions end
  const a = run('afflicted', [false, false, true, true, true]); assert.equal(a.s.over, true); assert.equal(R.failed(a.s), true); assert.equal(R.result(a.s).suspicion, 100);
  // constable: 2 mistakes = 68 >= 67 at the end of 3 questions: right at the end brings 58 -> pass; wrong, wrong, then nothing
  const e = run('constable', [false, false, true]); assert.equal(e.s.suspicion, 58); assert.equal(R.passed(e.s), true);
  const f = run('constable', [true, false, false]); assert.equal(f.s.suspicion, 68); assert.equal(R.failed(f.s), true);
  const g = run('constable', [false, true, true]); assert.equal(g.s.suspicion, 14); assert.equal(R.passed(g.s), true);
});
test('not over before the last question and below 100', () => { const s = R.answerStep(R.newExam({ kind: 'constable', exams: 9 }), false).state; assert.equal(s.over, false); assert.equal(R.passed(s), false); assert.equal(R.failed(s), false); });
test('judge: 8 questions, 3 mistakes in a row are 75: failed at the end; four reach 100 at once', () => {
  const j = run('judge', [false, false, false, true, true, true, true, true]);
  // 75, then -10 five times floors at 25: passes
  assert.equal(R.passed(j.s), true);
  const k = run('judge', [false, false, false, false]); assert.equal(k.s.suspicion, 100); assert.equal(k.s.over, true); assert.equal(R.failed(k.s), true);
});
test('skip (Ortica) shortens the exam; incense calms 30', () => {
  let s = R.newExam({ kind: 'judge', exams: 9 }); s = R.skipStep(s); assert.equal(s.skipped, 1); assert.equal(s.over, false);
  assert.equal(R.calm({ suspicion: 80 }, 30).suspicion, 50); assert.equal(R.calm({ suspicion: 10 }, 30).suspicion, 0);
  let t = R.newExam({ kind: 'constable', exams: 9, total: 2 }); t = R.skipStep(t); t = R.answerStep(t, true).state; assert.equal(t.over, true);
});
test('pool: owned cards, the Fool joins under 3 cards; the judge asks about every Major', () => {
  assert.deepEqual(R.examPool({ kind: 'constable', owned: ['m01', 'm02'] }), ['m01', 'm02', 'm00']);
  assert.deepEqual(R.examPool({ kind: 'constable', owned: ['m01', 'm02', 'm03'] }), ['m01', 'm02', 'm03']);
  assert.equal(R.examPool({ kind: 'judge', owned: ['m01'], majors: ['a', 'b', 'c'] }).length, 3);
});
test('hint removes a wrong option, never the right one, keeps two visible', () => {
  const opts = [{ ok: false }, { ok: true }, { ok: false }];
  const i = R.wrongToRemove(opts, [], () => 0.99); assert.ok(i === 0 || i === 2);
  assert.equal(R.wrongToRemove(opts, [i]), -1);
});
test('confiscation: one or two Majors, never the Fool, always leaves 2 cards', () => {
  const owned = ['m00', 'm01', 'm02', 'm03', 'c01'];
  for (let k = 0; k < 50; k++) { const out = R.toConfiscate(owned, Math.random); assert.ok(out.length >= 1 && out.length <= 2); assert.ok(!out.includes('m00')); assert.ok(owned.length - out.length >= 2); assert.ok(out.every((id) => /^m\d\d$/.test(id))); }
  assert.deepEqual(R.toConfiscate(['m00', 'm01'], Math.random), []);
  assert.equal(R.toConfiscate(['m00', 'm01', 'm02'], () => 0.9).length, 1);
});
