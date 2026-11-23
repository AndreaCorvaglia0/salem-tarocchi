// The Advent calendar (glue/avvento.rules.js, data/avvento.js, data/daily/feasts.js): dates, words, pages.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { adventShown, isWinterFeast, dayArrived, slotState, norm, wordFits, tryWord, nextToAsk, LAST_DAY } from '../src/glue/avvento.rules.js';
import { PAGES, PAGE, WORDS } from '../src/data/avvento.js';
import { FEASTS } from '../src/data/daily/feasts.js';
import { parseSave, fresh } from '../src/core/state.js';

const W = Object.fromEntries(Array.from({ length: 25 }, (_, i) => [i + 1, `parola${'abcdefghijklmnopqrstuvwxy'[i]}`]));

test('the calendar shows from the first of December, and after January only if she opened something', () => {
  assert.equal(adventShown('2026-11-30', {}), false);
  assert.equal(adventShown('2026-12-01', {}), true);
  assert.equal(adventShown('2027-01-31', {}), true);
  assert.equal(adventShown('2027-02-01', {}), false);
  assert.equal(adventShown('2027-02-01', { avvento: { opened: { 3: '2026-12-03' } } }), true);
  assert.equal(isWinterFeast('2026-12-24'), true); assert.equal(isWinterFeast('2027-01-06'), true); assert.equal(isWinterFeast('2027-01-07'), false);
});

test('a bag can be asked for from its day on, and a late day is never lost', () => {
  assert.equal(dayArrived(9, '2026-12-08'), false);
  assert.equal(dayArrived(9, '2026-12-09'), true);
  assert.equal(slotState({}, 3, '2026-12-20'), 'ask');
  assert.equal(slotState({}, 21, '2026-12-20'), 'wait');
  assert.equal(slotState({ avvento: { opened: { 3: 'x' } } }, 3, '2026-12-20'), 'open');
  assert.equal(nextToAsk({ avvento: { opened: { 5: 'x' } } }, '2026-12-05'), 4);
  assert.equal(nextToAsk({}, '2026-11-20'), null);
});

test('the word: no accents, no case, no spaces; wrong, early and empty are refused', () => {
  assert.equal(norm(' Stèlla! '), 'stella');
  assert.ok(wordFits('LUNA', 'luna')); assert.ok(!wordFits('lune', 'luna')); assert.ok(!wordFits('', ''));
  const s = { avvento: { opened: {} } };
  assert.equal(tryWord(s, 10, W[10], { words: W, date: '2026-12-09' }).why, 'early');
  assert.equal(tryWord(s, 2, '', { words: W, date: '2026-12-09' }).why, 'empty');
  assert.equal(tryWord(s, 2, W[3], { words: W, date: '2026-12-09' }).why, 'wrong');
  assert.deepEqual(s.avvento.opened, {});
  assert.equal(tryWord(s, 2, W[2].toUpperCase(), { words: W, date: '2026-12-09' }).ok, true);
  assert.equal(s.avvento.opened[2], '2026-12-09');
  assert.equal(tryWord(s, 2, 'anything', { words: W, date: '2026-12-10' }).already, true);
  const old = {}; assert.equal(tryWord(old, 1, W[1], { words: W, date: '2026-12-01' }).ok, true); assert.ok(old.avvento.opened[1]); // a state without the key
});

test('an old save gets the calendar key, and a broken one is mended', () => {
  assert.deepEqual(fresh().avvento, { opened: {} });
  assert.deepEqual(parseSave(JSON.stringify({ started: true })).avvento, { opened: {} });
  assert.deepEqual(parseSave(JSON.stringify({ started: true, avvento: [1] })).avvento, { opened: {} });
  assert.deepEqual(parseSave(JSON.stringify({ started: true, avvento: { opened: { 4: '2026-12-04' } } })).avvento.opened, { 4: '2026-12-04' });
});

test('25 pages, in order, each with a picture, a word and three short parts at most', () => {
  assert.equal(PAGES.length, LAST_DAY);
  PAGES.forEach((p, i) => {
    assert.equal(p.d, i + 1); assert.equal(PAGE[p.d], p);
    assert.ok(p.title && p.inside, `day ${p.d}`);
    assert.ok(!!p.img !== !!p.draw, `day ${p.d}: one picture`);
    if (p.img) assert.ok(existsSync(new URL(`../public/avvento/${p.img}.webp`, import.meta.url)), `day ${p.d}: ${p.img}.webp`);
    if (p.draw) assert.ok(['famiglio', 'tema', 'lune'].includes(p.draw));
    assert.ok(p.parts.length >= 2 && p.parts.length <= 3, `day ${p.d}: parts`);
    for (const x of p.parts) { assert.ok(x.h && x.p); assert.ok(x.p.length <= 520, `day ${p.d}: "${x.h}" is ${x.p.length} long`); assert.ok(!/—/.test(x.p)); }
    assert.ok(norm(WORDS[p.d]), `day ${p.d}: a word`);
  });
});

test('feast notes: valid dates, the size of a note', () => {
  for (const [k, t] of Object.entries(FEASTS)) {
    assert.match(k, /^(12-(0[1-9]|[12]\d|3[01])|01-0[1-6])$/);
    assert.ok(t.length >= 60 && t.length <= 240, `${k}: ${t.length}`);
  }
});
