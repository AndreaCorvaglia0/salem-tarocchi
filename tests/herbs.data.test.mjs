// The herbarium's texts: one page per plant of the base list, every field there and within its size,
// and nothing that reads like a preparation, a dose or a slogan.
import test from 'node:test';
import assert from 'node:assert/strict';
import { HERB_LIST } from '../src/data/herbs/base.js';
import { HERB_TEXTS } from '../src/data/herbs/texts.js';

const LIMITS = { riconosci: [18, 40], tradizione: [25, 55], usi: [25, 55], vero: [15, 40], curiosita: [15, 40] };
const GROW = ['luce', 'acqua', 'quando', 'nota'];
const PLANETS = ['Sole', 'Luna', 'Mercurio', 'Venere', 'Marte', 'Giove', 'Saturno'];
const ELEMENTS = ['fuoco', 'acqua', 'aria', 'terra'];
const KEYS = [...Object.keys(LIMITS), 'coltiva', 'pianeta', 'elemento'].sort();
const words = (s) => s.trim().split(/\s+/).length;
const texts = (t) => [...Object.keys(LIMITS).map((k) => [k, t[k]]), ...GROW.map((k) => [`coltiva.${k}`, t.coltiva[k]])];

test('there is exactly one page for each plant of the list', () => {
  assert.deepEqual(Object.keys(HERB_TEXTS).sort(), HERB_LIST.map((h) => h.id).sort());
});

test('every page has every field, within its word limits', () => {
  for (const { id } of HERB_LIST) {
    const t = HERB_TEXTS[id];
    assert.deepEqual(Object.keys(t).sort(), KEYS, `${id} keys`);
    for (const [k, [a, b]] of Object.entries(LIMITS)) {
      assert.equal(typeof t[k], 'string', `${id}.${k}`);
      const n = words(t[k]);
      assert.ok(n >= a && n <= b, `${id}.${k} has ${n} words (${a}-${b})`);
    }
    assert.deepEqual(Object.keys(t.coltiva).sort(), [...GROW].sort(), `${id} coltiva keys`);
    for (const k of GROW) {
      assert.equal(typeof t.coltiva[k], 'string', `${id}.coltiva.${k}`);
      const n = words(t.coltiva[k]);
      assert.ok(n >= 4 && n <= 18, `${id}.coltiva.${k} has ${n} words (4-18)`);
    }
  }
});

test('planet and element are the traditional ones, or null', () => {
  for (const { id } of HERB_LIST) {
    const t = HERB_TEXTS[id];
    assert.ok(t.pianeta === null || PLANETS.includes(t.pianeta), `${id} pianeta ${t.pianeta}`);
    assert.ok(t.elemento === null || ELEMENTS.includes(t.elemento), `${id} elemento ${t.elemento}`);
  }
});

test('no slogans, no preparations, no doses', () => {
  for (const { id } of HERB_LIST) {
    for (const [k, s] of texts(HERB_TEXTS[id])) {
      assert.ok(!s.includes('!'), `${id}.${k} has an exclamation mark`);
      assert.ok(!/energia|vibrazion|universo/i.test(s), `${id}.${k} uses a banned word`);
      assert.ok(!/\b(infuso|decotto|tisana|cucchiai|grammi|gocce|mg)\b/i.test(s), `${id}.${k} reads like a preparation or a dose`);
    }
  }
});

test('poisonous plants say so plainly, and the others that need care say why', () => {
  for (const h of HERB_LIST) {
    const t = HERB_TEXTS[h.id];
    if (h.risk === 'velenosa') {
      assert.ok(/velenos/i.test(t.vero), `${h.id}.vero does not say it is poisonous`);
      assert.ok(/guant/i.test(t.coltiva.nota), `${h.id}.coltiva.nota lacks the practical caution`);
    }
  }
});

test('a plant does not repeat the same sentence in two fields', () => {
  for (const { id } of HERB_LIST) {
    const all = texts(HERB_TEXTS[id]).map(([, s]) => s);
    assert.equal(new Set(all).size, all.length, `${id} repeats a text`);
  }
});
