import test from 'node:test';
import assert from 'node:assert/strict';
import { alternatives, scoreOf, payFor, xpFor, drawPlan, lineFor } from '../src/systems/reading.rules.js';
import { weightedPick, weightedSample, numberToCard, numberRange } from '../src/systems/draw.rules.js';
import { MAJORS } from '../src/data/cards.base.js';
import { SPREADS } from '../src/data/spreads.js';
import { sheet } from '../src/data/cards.js';

const ids = MAJORS.map((c) => c.id);
const seeded = (a) => () => { a = (a * 1664525 + 1013904223) % 4294967296; return a / 4294967296; };

test('alternatives: three, one right, no duplicate line, no card from the table', () => {
  for (const [spreadId, sp] of Object.entries(SPREADS)) {
    const table = ids.slice(0, sp.positions.length);
    for (let t = 0; t < 40; t++) for (const [i, pos] of sp.positions.entries()) {
      const alts = alternatives({ cardId: table[i], positionId: pos.id, spreadId, table, rng: seeded(t * 7 + i) });
      assert.equal(alts.length, 3);
      assert.equal(alts.filter((a) => a.ok).length, 1);
      assert.equal(new Set(alts.map((a) => a.t)).size, 3);
      assert.equal(alts.find((a) => a.ok).t, lineFor(table[i], pos.id, spreadId));
      for (const a of alts.filter((x) => !x.ok)) assert.ok(!table.includes(a.card), `${a.card} is on the table`);
    }
  }
});
test('alternatives prefer the card\'s confusables', () => {
  const id = ids.find((c) => sheet(c).confusables?.length >= 2);
  const conf = sheet(id).confusables;
  const alts = alternatives({ cardId: id, positionId: 'present', spreadId: 'single', table: [id], rng: seeded(3) });
  const wrong = alts.filter((a) => !a.ok).map((a) => a.card);
  assert.ok(wrong.every((c) => conf.includes(c)), `${wrong} from ${conf}`);
});
test('single uses says, the others as[position]', () => {
  const id = ids[3]; const s = sheet(id);
  assert.equal(lineFor(id, 'present', 'single'), s.says); assert.equal(lineFor(id, 'past', 'ppf'), s.as.past);
});
test('score, xp and pay', () => {
  assert.equal(scoreOf([true, true, false]), 2 / 3); assert.equal(scoreOf([]), 0);
  assert.equal(xpFor(0), 10); assert.equal(xpFor(1), 30);
  assert.equal(payFor({ pay: 10, score: 1, owned: 0 }), 10);
  assert.equal(payFor({ pay: 10, score: 0, owned: 0 }), 4);
  assert.equal(payFor({ pay: 10, score: 1, owned: 10 }), 15); // +5% per card
  assert.equal(payFor({ pay: 10, score: 1, owned: 0, yourCardOnTable: true }), 12); // bonus
  assert.ok(payFor({ pay: 10, score: 1, owned: 12 }) > payFor({ pay: 10, score: 1, owned: 6 }));
});
test('draw plan: fan first, top after; given cards kept; fan/number entries are drawn', () => {
  const pos = new Array(3).fill({});
  assert.deepEqual(drawPlan(pos).map((p) => p.how), ['fan', 'top', 'top']);
  assert.deepEqual(drawPlan(pos, ['m01', 'number', 'fan']).map((p) => p.how), ['given', 'number', 'fan']);
  assert.equal(drawPlan(pos, ['m01'])[0].id, 'm01');
});

test('number to card: deterministic, in the pool, covers the pool, 1 and max are the ends', () => {
  const pool = ids; const max = numberRange(pool.length);
  assert.equal(max, 22);
  assert.equal(numberToCard(1, pool), pool[0]); assert.equal(numberToCard(22, pool), pool[21]);
  assert.equal(numberToCard(7, pool), numberToCard(7, pool));
  const seen = new Set(); for (let n = 1; n <= max; n++) { const c = numberToCard(n, pool); assert.ok(pool.includes(c)); seen.add(c); }
  assert.equal(seen.size, 22);
  const small = ['m01', 'm02', 'm03']; const got = new Set(); for (let n = 1; n <= 22; n++) got.add(numberToCard(n, small)); assert.equal(got.size, 3);
  assert.equal(numberToCard(0, pool), pool[0]); assert.equal(numberToCard(999, pool), pool[21]); // clamped
});
test('number to card follows the weights', () => {
  const pool = ['a', 'b']; const w = { a: 3, b: 1 };
  let a = 0; for (let n = 1; n <= 22; n++) if (numberToCard(n, pool, w) === 'a') a++;
  assert.ok(a >= 15 && a <= 18, `a=${a}`);
  assert.equal(numberToCard(22, pool, { a: 0, b: 1 }), 'b'); assert.equal(numberToCard(1, pool, { a: 0, b: 1 }), 'b');
});
test('weighted pick and sample', () => {
  const pool = ['a', 'b', 'c'];
  assert.equal(weightedPick(pool, { a: 0, b: 0, c: 5 }, () => 0.5), 'c');
  assert.equal(weightedPick(pool, undefined, () => 0.99), 'c'); assert.equal(weightedPick(pool, undefined, () => 0), 'a');
  assert.equal(weightedPick([], {}), null);
  const s = weightedSample(ids, 5, undefined, seeded(2)); assert.equal(new Set(s).size, 5);
  assert.equal(weightedSample(['x', 'y'], 5).length, 2);
  let hits = 0; for (let i = 0; i < 400; i++) if (weightedPick(['a', 'b'], { a: 9, b: 1 }, seeded(i + 1)) === 'a') hits++; assert.ok(hits > 300);
});
