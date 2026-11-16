// The data behind the card-of-the-day picture: where each look points and the memory questions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DAILY } from '../src/data/daily/cards.js';
import { VISUAL } from '../src/data/daily/visual.js';

const pad = (n) => String(n).padStart(2, '0');
const IDS = [
  ...Array.from({ length: 22 }, (_, i) => `m${pad(i)}`),
  ...['w', 'c', 's', 'p'].flatMap((s) => Array.from({ length: 14 }, (_, i) => `${s}${pad(i + 1)}`)),
];

const isSpot = (p) =>
  p !== null && typeof p === 'object' &&
  typeof p.x === 'number' && p.x >= 0 && p.x <= 100 &&
  typeof p.y === 'number' && p.y >= 0 && p.y <= 100 &&
  typeof p.z === 'number' && p.z >= 1.5 && p.z <= 3.2;

test('VISUAL has exactly the 78 cards', () => {
  assert.deepEqual(Object.keys(VISUAL).sort(), [...IDS].sort());
});

test('looks follow the sguardi of each card, one by one', () => {
  for (const id of IDS) {
    const sguardi = DAILY[id].sguardi;
    const looks = VISUAL[id].looks;
    assert.equal(looks.length, sguardi.length, `${id}: looks length`);
    sguardi.forEach((s, i) => {
      const l = looks[i];
      const where = `${id} look ${i} (${s.k})`;
      if (s.k === 'immagine') {
        assert.ok(isSpot(l), `${where}: needs x, y in 0..100 and z in 1.5..3.2`);
      } else if (s.k === 'storia' || s.k === 'rovescio') {
        assert.equal(l, null, `${where}: must be null`);
      } else if (s.k === 'contesto') {
        if (l === null) return;
        assert.ok(Array.isArray(l.con) && l.con.length >= 1 && l.con.length <= 2, `${where}: con has 1-2 ids`);
        assert.equal(new Set(l.con).size, l.con.length, `${where}: con ids are distinct`);
        for (const c of l.con) {
          assert.ok(IDS.includes(c), `${where}: unknown card ${c}`);
          assert.notEqual(c, id, `${where}: names itself`);
        }
      } else {
        assert.fail(`${where}: unknown kind`);
      }
    });
  }
});

test('each card has two well-formed questions', () => {
  for (const id of IDS) {
    const d = VISUAL[id].domande;
    assert.equal(d.length, 2, `${id}: two questions`);
    d.forEach((q, i) => {
      const where = `${id} question ${i}`;
      assert.ok(typeof q.q === 'string' && q.q.trim().length > 0, `${where}: text`);
      assert.ok(q.q.trim().split(/\s+/).length <= 14, `${where}: at most 14 words`);
      assert.ok(Array.isArray(q.a) && q.a.length === 3, `${where}: three answers`);
      assert.ok(q.a.every((a) => typeof a === 'string' && a.trim().length > 0), `${where}: answers are text`);
      assert.equal(new Set(q.a.map((a) => a.trim().toLowerCase())).size, 3, `${where}: answers are distinct`);
      assert.ok([0, 1, 2].includes(q.ok), `${where}: ok in 0..2`);
      assert.ok(isSpot(q.at), `${where}: at`);
    });
    assert.notEqual(d[0].q, d[1].q, `${id}: two different questions`);
  }
});

test('the right answer moves around', () => {
  const count = [0, 0, 0];
  let total = 0;
  for (const id of IDS) for (const q of VISUAL[id].domande) { count[q.ok] += 1; total += 1; }
  count.forEach((n, i) => assert.ok(n / total >= 0.15, `index ${i} is right only ${n} times out of ${total}`));
});
