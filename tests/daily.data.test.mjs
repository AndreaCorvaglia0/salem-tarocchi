// The card of the day and the notebook notes (docs/DESIGN.md "La soglia"): shape, sizes and style rules.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CARD } from '../src/data/cards.base.js';
import { DAILY } from '../src/data/daily/cards.js';
import { NOTES } from '../src/data/daily/notes.js';

const words = (s) => s.trim().split(/\s+/).length;
const KINDS = ['immagine', 'storia', 'contesto', 'rovescio'];
const BANNED = /!|\b(universo|energi[ae]|vibrazion\w*)\b/i;
const clean = (s, what) => {
  assert.ok(typeof s === 'string' && s.trim() === s && s.length > 0, `${what}: empty or untrimmed`);
  assert.ok(!BANNED.test(s), `${what}: banned word or "!"`);
  assert.ok(/[.»]$/.test(s), `${what}: no final full stop`);
};

test('DAILY has exactly the 78 cards', () => {
  assert.deepEqual(Object.keys(DAILY).sort(), Object.keys(CARD).sort());
  assert.equal(Object.keys(DAILY).length, 78);
});

test('every card has two different sentences for the day, 12-24 words', () => {
  for (const [id, d] of Object.entries(DAILY)) {
    assert.ok(Array.isArray(d.oggi) && d.oggi.length === 2, `${id} oggi`);
    assert.notEqual(d.oggi[0], d.oggi[1], `${id} oggi equal`);
    d.oggi.forEach((s, i) => {
      clean(s, `${id} oggi ${i}`);
      const n = words(s);
      assert.ok(n >= 12 && n <= 24, `${id} oggi ${i}: ${n} words`);
    });
    assert.equal(d.segreto, undefined, `${id} still has segreto`);
  }
});

test('at most a third of the sentences for the day start with "Oggi"', () => {
  const all = Object.values(DAILY).flatMap((d) => d.oggi);
  const n = all.filter((s) => /^Oggi\b/.test(s)).length;
  assert.ok(n <= all.length / 3, `${n} of ${all.length} start with Oggi`);
});

test('every card has three looks: valid kinds, at least two kinds, one of the image, 15-40 words', () => {
  for (const [id, d] of Object.entries(DAILY)) {
    assert.ok(Array.isArray(d.sguardi) && d.sguardi.length === 3, `${id} sguardi`);
    const kinds = d.sguardi.map((g) => g.k);
    for (const k of kinds) assert.ok(KINDS.includes(k), `${id} kind ${k}`);
    assert.ok(new Set(kinds).size >= 2, `${id} kinds not distinct`);
    assert.ok(kinds.includes('immagine'), `${id} lacks an 'immagine'`);
    d.sguardi.forEach((g, i) => {
      assert.deepEqual(Object.keys(g).sort(), ['k', 't'], `${id} sguardo ${i} fields`);
      clean(g.t, `${id} sguardo ${i}`);
      const n = words(g.t);
      assert.ok(n >= 15 && n <= 40, `${id} sguardo ${i} (${g.k}): ${n} words`);
    });
  }
});

test('the four kinds of look are all used across the deck', () => {
  const count = Object.fromEntries(KINDS.map((k) => [k, 0]));
  for (const d of Object.values(DAILY)) for (const g of d.sguardi) count[g.k]++;
  for (const k of KINDS) assert.ok(count[k] >= 20, `${k}: only ${count[k]}`);
});

test('no daily text is used twice', () => {
  const all = Object.values(DAILY).flatMap((d) => [...d.oggi, ...d.sguardi.map((g) => g.t)]);
  assert.equal(new Set(all).size, all.length);
});

test('NOTES: at least 110, 14-34 words, clean, no duplicates', () => {
  assert.ok(NOTES.length >= 110, `only ${NOTES.length}`);
  NOTES.forEach((n, i) => {
    clean(n.t, `note ${i}`);
    const w = words(n.t);
    assert.ok(w >= 14 && w <= 34, `note ${i}: ${w} words: ${n.t}`);
  });
  assert.equal(new Set(NOTES.map((n) => n.t)).size, NOTES.length);
});

test('NOTES: valid tags, exactly two per weekday and two per month', () => {
  for (const [i, n] of NOTES.entries()) {
    for (const k of Object.keys(n)) assert.ok(['t', 'day', 'month'].includes(k), `note ${i}: key ${k}`);
    assert.ok(!('day' in n && 'month' in n), `note ${i}: both tags`);
    if ('day' in n) assert.ok(Number.isInteger(n.day) && n.day >= 0 && n.day <= 6, `note ${i}: day ${n.day}`);
    if ('month' in n) assert.ok(Number.isInteger(n.month) && n.month >= 1 && n.month <= 12, `note ${i}: month ${n.month}`);
  }
  for (let d = 0; d <= 6; d++) assert.equal(NOTES.filter((n) => n.day === d).length, 2, `weekday ${d}`);
  for (let m = 1; m <= 12; m++) assert.equal(NOTES.filter((n) => n.month === m).length, 2, `month ${m}`);
  assert.ok(NOTES.filter((n) => !('day' in n) && !('month' in n)).length >= 60, 'too few untagged notes');
});
