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
