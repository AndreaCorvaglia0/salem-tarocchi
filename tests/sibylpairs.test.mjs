// The sibyl pairs game (notes/sibilla-coppie.md): the data is complete, the rules deal only what she owns, the
// first rounds of a day leave a mark and the others do not, old saves load, and no text ever judges her answer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SIBYL_LIST, SIBYL } from '../src/data/sibyl.js';
import { PIECES, QUESTIONS, PAIRS, GINEPRA } from '../src/data/sibylpairs.js';
import { GIFTS } from '../src/data/gifts.js';
import { fresh, parseSave } from '../src/core/state.js';
import * as R from '../src/glue/sibylpairs.rules.js';

const words = (s) => String(s).trim().split(/\s+/).length;
// a deterministic random
const seeded = (seed) => { let a = seed >>> 0 || 1; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const withFigures = (ns, told = true) => { const s = fresh(); for (const n of ns) s.oracle[n] = { at: 1, from: 'x' }; if (told) s.world.once['first.sibyl'] = true; return s; };
// words that would judge her answer: never on this screen (the owner: «there is no wrong answer»)
const JUDGE = /giust[oaie]|sbagli|corrett|esatt[oaie]|indovin|punteggio|\bvoto\b|errore|risposta migliore|\bbrav[ao]\b/i;

test('every figure has its three pieces, short, and no adjective that must agree', () => {
  assert.deepEqual(Object.keys(PIECES).map(Number), SIBYL_LIST.map((c) => c.n));
  for (const [n, p] of Object.entries(PIECES)) {
    assert.match(p.noun, /^(un|una|uno|un')\b|^un'/, `${n}: the noun has its indefinite article («${p.noun}»)`);
    assert.ok(!/^che .* che /.test(p.tint), `${n}: one relative clause`);
    for (const k of ['noun', 'tint', 'event']) assert.ok(words(p[k]) >= 1 && words(p[k]) <= 7, `${n}.${k}: short («${p[k]}»)`);
    assert.doesNotMatch(p.noun, /\bche\b/, `${n}: no «che» in the noun, or «noun + tint» stumbles`);
  }
});

test('questions are everyday questions, unique, ending with a question mark', () => {
  assert.ok(QUESTIONS.length >= 12);
  assert.equal(new Set(QUESTIONS.map((q) => q.id)).size, QUESTIONS.length);
  for (const q of QUESTIONS) { assert.ok(q.t.endsWith('?'), q.id); assert.ok(words(q.t) <= 9, `${q.id}: short`); }
});

test('the pairs by hand: existing figures, three short phrasings, a reading, Ginepra; the gift pairs are there', () => {
  assert.ok(Object.keys(PAIRS).length >= 25);
  for (const [k, p] of Object.entries(PAIRS)) {
    const [a, b] = k.split('>').map(Number);
    assert.ok(SIBYL[a] && SIBYL[b] && a !== b, k);
    assert.equal(p.say.length, 3, `${k}: three phrasings`);
    assert.equal(new Set(p.say).size, 3, `${k}: three different phrasings`);
    for (const t of p.say) { assert.ok(words(t) <= 10, `${k}: short phrasing «${t}»`); assert.ok(/[.!?]$/.test(t), `${k}: a sentence «${t}»`); }
    assert.ok(p.trad && words(p.trad) <= 18, `${k}: the usual reading`);
    assert.ok(p.gin && words(p.gin) <= 32, `${k}: Ginepra's line`);
  }
  for (const g of GIFTS.filter((x) => x.sibyl?.length === 2)) assert.ok(PAIRS[R.pairKey(g.sibyl[0], g.sibyl[1])], `the gift pair ${g.id} is read by hand too`);
});

test('no text of the game judges her answer, and the historical name of the deck never shows', () => {
  const texts = [...QUESTIONS.map((q) => q.t), ...Object.values(PAIRS).flatMap((p) => [...p.say, p.trad, p.gin]), ...Object.values(GINEPRA).flat(), ...Object.values(PIECES).flatMap((p) => [p.noun, p.tint, p.event])];
  for (const t of texts) assert.doesNotMatch(t, JUDGE, `«${t}»`);
  // what the engine composes, for every ordered pair and many triples
  const rnd = seeded(7);
  for (const a of SIBYL_LIST) for (const b of SIBYL_LIST) {
    if (a.n === b.n) continue;
    const cards = [a.n, b.n];
    for (const o of R.options(cards, rnd)) assert.doesNotMatch(o.t, JUDGE);
    const tr = R.tradition(cards);
    assert.doesNotMatch(`${tr.how} ${tr.t}`, JUDGE);
    for (const k of ['mix', 'flip', 'story', 'own', 'hand']) { const g = R.ginepra(cards, k, rnd); assert.doesNotMatch(g, JUDGE); assert.doesNotMatch(g, /\{|\}/, 'every name filled'); }
  }
  for (let i = 0; i < 300; i++) {
    const cards = [1 + Math.floor(rnd() * 36), 1 + Math.floor(rnd() * 36), 1 + Math.floor(rnd() * 36)];
    if (new Set(cards).size < 3) continue;
    for (const o of R.options(cards, rnd)) assert.doesNotMatch(o.t, JUDGE);
    for (const k of ['three3', 'centre', 'story', 'own']) assert.doesNotMatch(R.ginepra(cards, k, rnd), /\{|\}|giust|sbagli/i);
  }
  for (const f of ['src/data/sibylpairs.js', 'src/ui/sibylpairs.js', 'src/glue/sibylpairs.rules.js', 'src/glue/sibylpairs.js']) {
    const shown = readFileSync(f, 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
    assert.doesNotMatch(shown, /lenormand/i, f);
  }
  const ui = readFileSync('src/ui/sibylpairs.js', 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  assert.doesNotMatch(ui, /['`](?:[^'`]*?)(giust|sbagli|corrett|punteggio)/i, 'the screen has no verdict word');
});

test('options: three different phrasings of three kinds, built from the pieces; tradition: first subject, second colour', () => {
  const rnd = seeded(3);
  const o = R.options([1, 27], rnd); // by hand
  assert.deepEqual(o.map((x) => x.t), PAIRS['1>27'].say);
  const e = R.options([5, 9], rnd);
  assert.equal(e.length, 3);
  assert.deepEqual(e.map((x) => x.kind).sort(), ['flip', 'mix', 'story']);
  assert.ok(e.find((x) => x.kind === 'mix').t.startsWith('Una crescita lenta che fa piacere'));
  assert.ok(e.find((x) => x.kind === 'story').t.startsWith('Prima '));
  const t = R.tradition([5, 9]);
  assert.match(t.how, /^L'albero dice di che cosa si parla \(salute\); il mazzo di fiori ci mette il colore \(un dono\)\.$/);
  assert.equal(t.t, 'Una crescita lenta che fa piacere.');
  assert.equal(R.tradition([27, 25]).t, PAIRS['27>25'].trad, 'a pair by hand has its own reading');
  assert.equal(R.tradition([23, 6]).how, 'I topi dicono di che cosa si parla (una perdita); le nuvole ci mettono il colore (dubbio).', 'the verb agrees with a plural figure');
  const three = R.options([1, 11, 24], rnd);
  assert.deepEqual(three.map((x) => x.kind).sort(), ['centre', 'story', 'three3']);
  assert.match(R.tradition([1, 11, 24]).how, /a due a due/);
  // Ginepra says her own reading of a pair by hand, unless she wrote her own words
  assert.equal(R.ginepra([27, 25], 'hand'), PAIRS['27>25'].gin);
  assert.ok(GINEPRA.own.includes(R.ginepra([27, 25], 'own', () => 0)));
});

test('she can play with four figures, after Ginepra told her what they are; only figures she owns are dealt', () => {
  assert.equal(R.canPlay(withFigures([1, 2, 3])), false);
  assert.equal(R.canPlay(withFigures([1, 2, 3, 4], false)), false, 'before Ginepra\'s words she does not know they are read together');
  const s = withFigures([3, 9, 27, 34]);
  assert.equal(R.canPlay(s), true);
  const rnd = seeded(11);
  let last = null;
  for (let i = 0; i < 200; i++) {
    const d = R.deal(s, rnd, { last });
    assert.equal(d.cards.length, 2);
    assert.equal(new Set(d.cards).size, 2);
    for (const n of d.cards) assert.ok(s.oracle[n], `dealt ${n} which she does not own`);
    if (last) assert.ok(!(d.cards.every((n) => last.includes(n))), 'never the same pair twice in a row');
    assert.ok(QUESTIONS.some((q) => q.id === d.q));
    last = d.cards;
  }
});

test('the first three rounds of a day leave a mark; then she plays for pleasure; a new day starts again', () => {
  const s = withFigures([1, 27, 25, 9]);
  const day = '2026-11-18';
  assert.equal(R.leftToday(s, day), 3);
  const a = R.record(s, [1, 27], { kind: 'mix', t: 'Una notizia per iscritto.' }, day);
  assert.deepEqual(a, { counted: true, left: 2 });
  assert.equal(R.marksOf(s, 1), 1);
  assert.deepEqual(R.lastOf(s, 27), { c: 1, with: [1], t: 'Una notizia per iscritto.' });
  R.record(s, [27, 25], { kind: 'hand', t: 'Un contratto.' }, day);
  const c = R.record(s, [25, 9], { kind: 'own', t: '  una festa di nozze  ' }, day);
  assert.deepEqual(c, { counted: true, left: 0 });
  const d = R.record(s, [1, 9], { kind: 'story', t: 'Prima..., poi...' }, day);
  assert.deepEqual(d, { counted: false, left: 0 });
  assert.equal(R.marksOf(s, 1), 1, 'a round past the third leaves no mark');
  assert.equal(s.sibylPlay.plays, 3);
  assert.equal(s.sibylPlay.rounds, 4);
  assert.deepEqual(s.sibylPlay.mine.map((m) => m.t), ['una festa di nozze'], 'her own words are kept, trimmed');
  assert.equal(R.leftToday(s, '2026-11-19'), 3);
  assert.equal(R.record(s, [1, 9], { kind: 'mix', t: 'x' }, '2026-11-19').counted, true);
  assert.equal(R.marksOf(s, 1), 2);
});

test('three figures come only after six counted rounds and with six figures, one round in two', () => {
  const s = withFigures([1, 2, 3, 4, 5]);
  s.sibylPlay.plays = 10; s.sibylPlay.rounds = 1;
  assert.equal(R.sizeOf(s), 2, 'five figures: always two');
  s.oracle[6] = { at: 1, from: 'x' };
  assert.equal(R.sizeOf(s), 3);
  s.sibylPlay.rounds = 2;
  assert.equal(R.sizeOf(s), 2);
  s.sibylPlay.plays = 5; s.sibylPlay.rounds = 1;
  assert.equal(R.sizeOf(s), 2, 'not before six counted rounds');
  s.sibylPlay.plays = 6;
  const d = R.deal(s, seeded(5));
  assert.equal(d.cards.length, 3);
  assert.equal(new Set(d.cards).size, 3);
});

test('old saves load: the key has its default, odd values are mended', () => {
  const old = fresh(); delete old.sibylPlay;
  const s = parseSave(JSON.stringify(old));
  assert.deepEqual(s.sibylPlay, R.freshPlay());
  const odd = parseSave(JSON.stringify({ ...fresh(), started: true, sibylPlay: [1, 2] }));
  assert.deepEqual(odd.sibylPlay, R.freshPlay());
  const half = { ...fresh(), started: true, sibylPlay: { plays: '4', seen: { 3: { c: 2 }, 99: { c: 5 }, 7: 'x' }, mine: 'no' } };
  const m = R.normPlay(parseSave(JSON.stringify(half)).sibylPlay);
  assert.equal(m.plays, 4);
  assert.deepEqual(Object.keys(m.seen), ['3']);
  assert.deepEqual(m.mine, []);
  // a save far ahead with figures and Ginepra's words can play at once
  const ahead = withFigures([26, 33, 8, 36, 27, 25]);
  ahead.chapter = 4;
  assert.equal(R.canPlay(parseSave(JSON.stringify(ahead))), true);
});
