import test from 'node:test';
import assert from 'node:assert/strict';
import { fresh, parseSave } from '../src/core/state.js';
import {
  freshRite, normRite, breathsFor, stageOf, sameSession, planRite, arcSlots, emberAt, onRelease, knockDone, KNOCK_MS,
  afterLit, afterSkip, tradition, traditionLines, factDue, dayKey, addTime, giftDue, afterGift, malvaSceneDue,
  DUR, LIMIT, fixedTime, SAME_SESSION_MS,
} from '../src/glue/rite.rules.js';
import { ARC, START_AIRS, MALVA } from '../src/data/rite.js';

const T0 = new Date(2026, 10, 18, 21, 0).getTime();

test('the classifier: only x counts, between embers and over unlit slots nothing, outside nothing', () => {
  const slots = arcSlots(390);
  assert.equal(slots.length, 5);
  assert.deepEqual(slots.map((s) => s.id), ARC);
  const owned = [...START_AIRS];
  for (const s of slots) {
    assert.equal(emberAt(s.x, slots, owned), owned.includes(s.id) ? s.id : null, s.id);
    assert.equal(emberAt(s.x + s.half - 0.5, slots, owned), owned.includes(s.id) ? s.id : null);
  }
  // between two neighbours there is a gap where only the fire is
  for (let i = 0; i < slots.length - 1; i++) assert.equal(emberAt((slots[i].x + slots[i + 1].x) / 2, slots, ARC), null, `gap ${i}`);
  assert.equal(emberAt(-10, slots, ARC), null);
  assert.equal(emberAt(1000, slots, ARC), null);
  assert.equal(emberAt(NaN, slots, ARC), null);
  // salvia and mirra are not hers yet: their slots answer nothing
  assert.equal(emberAt(slots[1].x, slots, owned), null);
  assert.equal(emberAt(slots[3].x, slots, owned), null);
  // the three first airs sit at the two ends and the middle
  assert.deepEqual(START_AIRS.map((a) => ARC.indexOf(a)).sort(), [0, 2, 4]);
  // release: over an ember lights it; outside the layer, nothing
  assert.equal(onRelease(slots[0].x, slots, owned, true), 'rosa');
  assert.equal(onRelease(slots[0].x, slots, owned, false), null);
  assert.equal(onRelease((slots[0].x + slots[1].x) / 2, slots, owned), null);
  // a target is wide enough for a thumb on a 390 px phone (at least 44 px)
  for (const s of slots) assert.ok(s.half * 2 >= 44, `${s.id} ${s.half * 2}`);
});
test('the knock is held a second', () => {
  assert.equal(KNOCK_MS, 1000);
  assert.ok(!knockDone(999)); assert.ok(knockDone(1000));
});
test('breaths by count: three the first three times, two up to the ninth, then one, never zero', () => {
  assert.deepEqual([0, 1, 2].map(breathsFor), [3, 3, 3]);
  assert.deepEqual([3, 4, 8].map(breathsFor), [2, 2, 2]);
  assert.deepEqual([9, 10, 99, 10000].map(breathsFor), [1, 1, 1, 1]);
  for (let n = 0; n < 200; n++) assert.ok(breathsFor(n) >= 1);
  assert.deepEqual([0, 2, 3, 8, 9].map(stageOf), ['A', 'A', 'B', 'B', 'C']);
});
test('same session: within twenty minutes of the last air, the ember is still lit (no knock, no motif, one breath)', () => {
  const r = { ...freshRite(), n: 5, last: { air: 'rosa', at: T0 } };
  assert.ok(sameSession(r, T0 + 60e3));
  assert.ok(!sameSession(r, T0 + SAME_SESSION_MS));
  assert.ok(!sameSession(r, T0 - 1000)); // a clock that went back is not a session
  assert.ok(!sameSession(freshRite(), T0));
  const p = planRite(r, T0 + 5 * 60e3);
  assert.deepEqual([p.same, p.knock, p.motif, p.breaths, p.stage], [true, false, false, 1, 'same']);
  const q = planRite(r, T0 + 25 * 60e3);
  assert.deepEqual([q.same, q.knock, q.motif, q.breaths, q.stage], [false, true, true, 2, 'B']);
});
test('guides the first three times only; «senza fumo» from the fourth; the veil is the last air', () => {
  assert.ok(planRite(freshRite(), T0).guide);
  assert.ok(!planRite(freshRite(), T0).skip);
  assert.ok(planRite({ n: 2 }, T0).guide);
  assert.ok(!planRite({ n: 3 }, T0).guide);
  assert.ok(planRite({ n: 3 }, T0).skip);
  assert.equal(planRite({ n: 4, last: { air: 'cipresso', at: T0 - 86400e3 } }, T0).veil, 'cipresso');
  assert.equal(planRite(freshRite(), T0).veil, null);
});
test('the timing budget: the fixed parts leave her time to search within the spec limits', () => {
  assert.deepEqual(LIMIT, { A: 22, B: 14, C: 8, same: 5 });
  const minSearch = { A: 4, B: 2, C: 1.2, same: 1 }; // seconds left for her (the first time also reads the guides)
  for (const [stage, breaths] of [['A', 3], ['B', 2], ['C', 1], ['same', 1]]) {
    const f = fixedTime(stage, breaths);
    assert.ok(f + minSearch[stage] <= LIMIT[stage], `${stage}: ${f} + ${minSearch[stage]} > ${LIMIT[stage]}`);
    assert.ok(DUR[stage].breath >= 2.5, `${stage}: a breath must stay a breath`);
  }
  for (const n of [0, 3, 9, 30]) { const p = planRite({ n }, T0); assert.ok(p.fixed < p.limit, `${n}`); }
});
test('which airs are hers: three at first, the gifts one at a time and only once she knows who brings them', () => {
  assert.deepEqual(normRite(null).owned, START_AIRS);
  assert.deepEqual(normRite({ owned: ['mirra', 'nonsense'] }).owned, ['rosa', 'alloro', 'mirra', 'cipresso']);
  const s0 = { bonds: { ortica: 0, edera: 0 } };
  assert.equal(giftDue({ n: 10 }, s0), null); // nobody to bring them
  const s1 = { bonds: { ortica: 2, edera: 1 } };
  assert.equal(giftDue({ n: 3 }, s1), null);
  assert.equal(giftDue({ n: 4 }, s1).air, 'salvia');
  // the mirra never comes before the salvia, even far ahead
  assert.equal(giftDue({ n: 40 }, { bonds: { ortica: 0, edera: 3 } }), null);
  const r = afterGift({ n: 9 }, 'salvia');
  assert.deepEqual(r.owned, ['rosa', 'salvia', 'alloro', 'cipresso']);
  assert.equal(giftDue(r, s1).air, 'mirra');
  assert.equal(giftDue(afterGift(r, 'mirra'), s1), null);
  assert.equal(giftDue({ n: 9 }, { trust: { ortica: 1 } }).air, 'salvia'); // trust from before the bonds counts too
});
test('a lit air: counted, remembered for the veil and the session, per kind of question, timings as running means', () => {
  let r = freshRite();
  r = afterLit(r, { air: 'rosa', ambito: 'amore', at: T0, phases: { knock: 2, breath: 11.4, search: 3, name: 1.8 } });
  assert.equal(r.n, 1); assert.deepEqual(r.last, { air: 'rosa', at: T0 }); assert.deepEqual(r.picks.amore, ['rosa']);
  assert.equal(r.times.breath.mean, 11.4); assert.equal(r.times['total.A'].mean, 18.2);
  r = afterLit(r, { air: 'alloro', ambito: null, at: T0 + 3600e3, phases: { search: 5 } });
  assert.equal(r.n, 2); assert.equal(r.times.search.mean, 4); assert.equal(r.times.search.n, 2);
  assert.deepEqual(Object.keys(r.picks), ['amore']);
  const t = addTime({}, 'x', 700); assert.deepEqual(t, {}); // nonsense durations are not kept
  r = afterSkip(r); assert.equal(r.skipped, 1); assert.equal(r.n, 2);
});
test('her tradition: three times the same air for the same kind of question, different from Malva', () => {
  let r = freshRite();
  const pick = (air, i) => { r = afterLit(r, { air, ambito: 'casa', at: T0 + i * 86400e3 }); };
  pick('cipresso', 0); pick('cipresso', 1);
  assert.equal(tradition(r, 'casa'), null);
  pick('cipresso', 2);
  assert.equal(tradition(r, 'casa'), 'cipresso');
  assert.deepEqual(traditionLines(r), [{ ambito: 'casa', air: 'cipresso', malva: 'salvia' }]);
  // the same as Malva is no tradition of hers
  let m = freshRite();
  for (let i = 0; i < 3; i++) m = afterLit(m, { air: MALVA.amore.air, ambito: 'amore', at: T0 + i });
  assert.equal(tradition(m, 'amore'), null); assert.deepEqual(m.mine, {});
  // broken by another pick: no new line, but a line once written stays
  pick('rosa', 3);
  assert.equal(tradition(r, 'casa'), null);
  assert.equal(r.mine.casa, 'cipresso');
  // three of another air later: the line changes to it
  pick('alloro', 4); pick('alloro', 5); pick('alloro', 6);
  assert.equal(r.mine.casa, 'alloro');
});
test('the line after: a fact, at most once a calendar day, only after an air was lit', () => {
  const r = freshRite();
  assert.ok(factDue(r, T0, 'rosa'));
  assert.ok(!factDue(r, T0, null));
  const seen = { ...r, lineDay: dayKey(T0) };
  assert.ok(!factDue(seen, T0 + 3600e3, 'rosa'));
  assert.ok(factDue(seen, T0 + 86400e3, 'rosa'));
  assert.equal(dayKey(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
});
test('the scene at Malva\'s hearth: before the first rite only, once she has met Malva', () => {
  assert.ok(malvaSceneDue(freshRite(), { bonds: { malva: 1 } }));
  assert.ok(malvaSceneDue(freshRite(), { chapter: 2 }));
  assert.ok(!malvaSceneDue(freshRite(), { chapter: 0, bonds: { malva: 0 } }));
  assert.ok(!malvaSceneDue({ malva: true }, { chapter: 2 }));
  assert.ok(!malvaSceneDue({ n: 1 }, { chapter: 2 }));
});
test('state: the default is in fresh(), old saves load and start from the first rite, damaged values are mended', () => {
  assert.deepEqual(fresh().rite, freshRite());
  const old = { started: true, chapter: 3, flags: { 'ending.seen': false } }; // a save from before the rite
  const s = parseSave(JSON.stringify(old));
  assert.deepEqual(s.rite, freshRite());
  assert.deepEqual(normRite(s.rite), freshRite());
  const bad = normRite({ n: '7', last: { air: 'nope', at: 1 }, owned: 'x', picks: { amore: ['rosa', 'zzz'], nope: ['rosa'] }, mine: { casa: 'zzz' }, times: { a: { n: 1, mean: NaN } }, gifts: [] });
  assert.equal(bad.n, 7); assert.equal(bad.last, null); assert.deepEqual(bad.owned, START_AIRS);
  assert.deepEqual(bad.picks, { amore: ['rosa'] }); assert.deepEqual(bad.mine, {}); assert.deepEqual(bad.times, {}); assert.deepEqual(bad.gifts, {});
  for (const v of [null, undefined, 3, 'x', []]) assert.deepEqual(normRite(v), freshRite());
});
