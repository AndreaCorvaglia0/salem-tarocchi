import { test } from 'node:test';
import assert from 'node:assert/strict';
import { growMoon, moonShown, moonPath, dayOf, noteOf, reviewPair, giftOf, giftText, MOON } from '../src/glue/threshold.rules.js';

test('the moon grows once a day, fills at seven, and starts again the day after', () => {
  let m = { n: 0, last: null, cycles: 0 };
  let r = growMoon(m, '2026-11-16'); assert.equal(r.grew, true); assert.equal(r.moon.n, 1);
  r = growMoon(r.moon, '2026-11-16'); assert.equal(r.grew, false); assert.equal(r.moon.n, 1);
  m = r.moon;
  for (let d = 17; d <= 21; d++) m = growMoon(m, `2026-11-${d}`).moon;
  assert.equal(m.n, 6);
  r = growMoon(m, '2026-12-03'); // days skipped take nothing away
  assert.equal(r.full, true); assert.equal(r.moon.n, MOON); assert.equal(r.moon.cycles, 1);
  assert.equal(moonShown(r.moon, '2026-12-03'), 7);
  assert.equal(moonShown(r.moon, '2026-12-04'), 0);
  r = growMoon(r.moon, '2026-12-04'); assert.equal(r.moon.n, 1); assert.equal(r.full, false);
});
test('an old save without a moon starts from nothing', () => { assert.equal(growMoon(undefined, '2026-01-01').moon.n, 1); assert.equal(moonShown(undefined, 'x'), 0); });
test('the moon path: empty when new, a shape otherwise', () => { assert.equal(moonPath(0), ''); for (let n = 1; n <= 7; n++) assert.match(moonPath(n), /^M/); });
test('the card of the day is the same all day and keeps the one already drawn', () => {
  const ids = ['m00', 'm01', 'm02', 'c05', 's10'];
  const a = dayOf(null, '2026-11-16', ids, 'Anna'), b = dayOf(null, '2026-11-16', ids, 'Anna');
  assert.deepEqual(a, b); assert.equal(a.turned, false); assert.ok(ids.includes(a.card));
  assert.deepEqual(dayOf({ date: '2026-11-16', card: 'c05', turned: true, v: 1 }, '2026-11-16', ids), { date: '2026-11-16', card: 'c05', turned: true, v: 1 });
  assert.equal(dayOf({ date: '2026-11-16', card: 'c05' }, '2026-11-16', ids).turned, false); // drawn at the cottage: still to turn here
  const seen = new Set(); for (let d = 1; d <= 28; d++) seen.add(dayOf(null, `2026-02-${String(d).padStart(2, '0')}`, ids, 'Anna').card);
  assert.ok(seen.size >= 4);
});
test('the note of the day: tagged ones only on their day or month, free ones in a fixed order without repeats', () => {
  const notes = [{ t: 'lun', day: 1 }, { t: 'nov', month: 11 }, ...Array.from({ length: 10 }, (_, i) => ({ t: `f${i}` }))];
  for (let d = 1; d <= 30; d++) {
    const date = `2026-06-${String(d).padStart(2, '0')}`, n = noteOf(notes, date, d);
    if (n.day != null) assert.equal(new Date(`${date}T12:00:00`).getDay(), n.day);
    assert.notEqual(n.t, 'nov');
  }
  const free = new Set(); for (let i = 0; i < 10; i++) free.add(noteOf(notes.filter((n) => n.day == null && n.month == null), '2026-06-02', i).t);
  assert.equal(free.size, 10);
  assert.equal(noteOf([], '2026-06-02'), null);
});
test('the short review takes the two cards due longest, never one she does not hold', () => {
  const now = 1000;
  const cards = { a: { found: true, due: 500, stars: 2 }, b: { found: true, due: 100, stars: 3 }, c: { found: true, due: 5000, stars: 0 }, d: { found: true, due: 50, confiscated: true }, e: { found: false } };
  assert.deepEqual(reviewPair(cards, now), ['b', 'a']);
  assert.deepEqual(reviewPair({ c: cards.c }, now), ['c']);
  assert.deepEqual(reviewPair({}, now), []);
});
test('gifts are small and always say what they are', () => { for (let c = 1; c <= 9; c++) { const g = giftOf(c); assert.ok((g.treats || 0) + (g.coins || 0) > 0); assert.ok(giftText(g).length > 5); } });

// BACKLOG 2.2: the card of the day enters the review
import { dayAnswer, countsToday, FROM_DUE } from '../src/glue/threshold.rules.js';
import { setState, state as S } from '../src/core/state.js';
import { answer, hasCard, isDue } from '../src/core/progress.js';

test('one day in three the card of the day is one of her due cards; with none due, the same card as before', () => {
  const ids = ['m00', 'm01', 'm02', 'm03', 'm04', 'c05', 's10', 'w03', 'p07', 'm17'];
  const due = ['m03', 'c05'];
  let fromDue = 0; const N = 600;
  for (let i = 0; i < N; i++) {
    const date = new Date(Date.UTC(2026, 0, 1) + i * 86400000).toISOString().slice(0, 10);
    const plain = dayOf(null, date, ids, 'Anna'), withDue = dayOf(null, date, ids, 'Anna', due);
    assert.deepEqual(dayOf(null, date, ids, 'Anna', []), plain); // nothing due: nothing changes
    assert.equal(withDue.v, plain.v);
    if (withDue.card !== plain.card) { fromDue++; assert.ok(due.includes(withDue.card)); }
    assert.deepEqual(dayOf(withDue, date, ids, 'Anna', ['m00']), withDue); // the same all day
  }
  const share = fromDue / N; // about 1/3 (less the days the plain card was already that due one)
  assert.ok(share > 0.22 && share < 0.42, `share ${share}`);
  assert.equal(FROM_DUE, 3);
  // a due card the day cannot show (no daily page) is never picked
  for (let d = 1; d <= 28; d++) assert.ok(ids.includes(dayOf(null, `2026-03-${String(d).padStart(2, '0')}`, ids, 'x', ['zz']).card));
});

test('«Senza guardare» counts as a review answer once a day, only on a card she holds', () => {
  assert.equal(countsToday(null, '2026-11-18', true), true);
  assert.equal(countsToday('2026-11-18', '2026-11-18', true), false);
  assert.equal(countsToday('2026-11-17', '2026-11-18', false), false);
  setState({ started: true, cards: { m03: { found: true, stars: 0, right: 0, wrong: 0, words: ['', '', ''], due: Date.now() - 1000, interval: 0 } } });
  assert.equal(S.dayAsked, null); // the default
  const deps = { holds: hasCard, answer };
  assert.equal(isDue('m03'), true);
  assert.equal(dayAnswer(S, '2026-11-18', 'm03', true, deps), true);
  assert.equal(isDue('m03'), false); assert.equal(S.cards.m03.right, 1); assert.equal(S.cards.m03.stars, 1);
  assert.equal(dayAnswer(S, '2026-11-18', 'm03', false, deps), false); // reopened: does not count twice
  assert.equal(S.cards.m03.wrong, 0);
  assert.equal(dayAnswer(S, '2026-11-19', 'm04', true, deps), false); // not hers
  assert.equal(S.dayAsked, '2026-11-18');
  assert.equal(dayAnswer(S, '2026-11-19', 'm03', false, deps), true); // the next day a wrong answer sends it back
  assert.equal(isDue('m03'), true); assert.equal(S.cards.m03.wrong, 1);
});

test('an old save without the new keys loads with their defaults', () => {
  setState({ started: true, cards: {}, daily: { looks: {}, notes: 3, noteDay: '2026-11-01' } });
  assert.equal(S.dayAsked, null); assert.deepEqual(S.recalled, {});
  setState({ started: true, dayAsked: 7, recalled: [1] });
  assert.equal(S.dayAsked, null); assert.deepEqual(S.recalled, {});
});
