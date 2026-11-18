// BACKLOG 2.1: her own three words come back in the review (src/systems/review.rules.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { wordsCard, wordsQuestion, wordsOf } from '../src/systems/review.rules.js';
import { leaks } from '../src/data/questions.js';
import { CARD } from '../src/data/cards.base.js';
import { SHEETS } from '../src/data/cards.js';

const card = (words, extra = {}) => ({ found: true, stars: 1, words, due: Date.now() + 86400000, ...extra });
const seq = (...v) => { let i = 0; return () => v[i++ % v.length]; };

test('only cards with words of hers that do not already say the name', () => {
  assert.equal(wordsOf(card(['', '', '']), 'm07'), null);
  assert.equal(wordsOf(card(['carro', 'corsa', 'meta']), 'm07'), null); // the name is in her words
  assert.equal(wordsOf(card(['bastoni', 'tre', '']), 'w03'), null); // the suit gives it away
  assert.equal(wordsOf(card(['tre', 'nave', '']), 'w03'), null); // and so does the number
  assert.deepEqual(wordsOf(card([' corsa ', '', 'meta']), 'm07'), ['corsa', 'meta']);
  assert.equal(wordsOf(undefined, 'm07'), null);
  assert.equal(wordsOf({ found: true }, 'm07'), null); // an old card without words
});

test('the card: one she holds, with words; a due one first; never a confiscated one', () => {
  const now = Date.now();
  const cards = {
    m01: card(['inizio', 'mani', 'tavolo']),
    m02: card(['silenzio'], { due: now - 1000 }),
    m03: card(['', '', ''], { due: now - 1000 }),
    m04: card(['trono', 'ordine'], { confiscated: true, due: now - 1000 }),
  };
  assert.equal(wordsCard(cards, ['m01', 'm02', 'm03', 'm04'], now), 'm02');
  assert.equal(wordsCard(cards, ['m01', 'm03', 'm04'], now), 'm01');
  assert.equal(wordsCard(cards, ['m03', 'm04'], now), null);
  assert.equal(wordsCard({}, ['m01'], now), null);
});

test('the question shows her words, never the answer, and has one right name', () => {
  const cards = { m09: card(['lanterna', 'solitudine', 'neve']), m01: card(['x']), m17: card(['y']) };
  for (let r = 0; r < 30; r++) {
    const rng = seq(r / 30, 0.7, 0.2, 0.9, 0.4);
    const q = wordsQuestion('m09', cards, { rng });
    assert.equal(q.cardId, 'm09'); assert.equal(q.kind, 'words'); assert.equal(q.star, 'image');
    assert.deepEqual(q.words, ['lanterna', 'solitudine', 'neve']);
    assert.equal(q.prompt, 'Le tue parole erano:'); assert.equal(q.after, 'Che carta è?');
    assert.equal(q.options.length, 3);
    assert.equal(q.options.filter((o) => o.ok).length, 1);
    assert.equal(q.options.find((o) => o.ok).t, CARD.m09.name);
    assert.equal(new Set(q.options.map((o) => o.t)).size, 3);
    // nothing on screen before the answer names the card: not the prompt, not her words
    assert.ok(!leaks(`${q.prompt} ${q.words.join(' ')} ${q.after}`, 'm09'));
    // the other names are Majors, and never one the sheet says is easily confused with it
    for (const o of q.options.filter((x) => !x.ok)) {
      const id = Object.keys(CARD).find((k) => CARD[k].name === o.t);
      assert.equal(CARD[id].arcana, 'major');
      assert.ok(!(SHEETS.m09.confusables || []).includes(id));
    }
  }
  assert.equal(wordsQuestion('m09', { m09: card(['', '', '']) }), null);
});

test('one word: «La tua parola era»; the cards she holds come first among the other names', () => {
  const cards = { c05: card(['rimpianto']), c02: card(['a']), s07: card(['b']) };
  const q = wordsQuestion('c05', cards, { rng: seq(0.5) });
  assert.equal(q.prompt, 'La tua parola era:');
  const names = q.options.filter((o) => !o.ok).map((o) => o.t).sort();
  const held = ['c02', 's07'].filter((id) => !(SHEETS.c05.confusables || []).includes(id)).map((id) => CARD[id].name).sort();
  assert.deepEqual(names, held);
});
