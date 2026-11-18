// The circle of knowledge (lore/corso/concetti/, scripts/lore/sapere.mjs, src/data/sapere.js): every leaf hangs on hubs
// that exist; every hub has a leaf in each of the four groups (the circle closes); the herbs and the Majors agree
// with the game's data (or the difference is listed below); no two leaves of a group are the same on every hub;
// the data file and the tables of the one page are in step with the vault.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadVault } from '../scripts/lore/vault.mjs';
import { readSapere, circle, GROUPS, CONSENSO, HUB_FAMILIES } from '../scripts/lore/sapere.mjs';
import { sapereOutputs } from '../scripts/lore.mjs';
import { HERB_LIST, HERB } from '../src/data/herbs/base.js';
import { HERB_TEXTS } from '../src/data/herbs/texts.js';
import { MAJORS, SIGNS, SIGN_LORE, SUITS } from '../src/data/cards.base.js';
import { SAPERE_LEAVES, SAPERE_HUBS, leavesOf } from '../src/data/sapere.js';

const vault = loadVault();
const D = readSapere(vault);
const ALL = [...D.hubs, ...D.signs, ...D.leaves];
const BY = Object.fromEntries(ALL.map((e) => [e.id, e]));
const low = (s) => (s == null ? null : s.toLowerCase());
const hubName = (id) => (id ? id.replace(/^(elemento|pianeta)-/, '') : null);

// Where the circle says something different from the game's herbarium: { herbId: { pianeta?, elemento? } }.
// Empty on purpose: the circle follows the game, and the other versions are in each page's `varianti`.
const HERB_EXCEPTIONS = {};
// Leaves allowed without a planet (the Golden Dawn gives none, or no source does) or without an element.
const NO_PLANET = new Set(['seme-bastoni', 'seme-coppe', 'seme-spade', 'seme-denari', 'arcano-il-matto', "arcano-l-appeso", 'arcano-il-giudizio', 'erba-stramonio', 'pietra-forata']);
const NO_ELEMENT = new Set(['erba-stramonio']);

test('the vault has the hubs it promises: 4 elements, 7 planets, 8 intentions, 12 signs', () => {
  const n = (f) => ALL.filter((e) => e.famiglia === f).length;
  assert.equal(n('elemento'), 4); assert.equal(n('pianeta'), 7); assert.equal(n('intenzione'), 8); assert.equal(n('segno'), 12);
  assert.equal(n('seme'), 4); assert.equal(n('arcano'), 22);
});

test('every link points to an existing page of the right family', () => {
  const is = (id, fam, where) => assert.equal(BY[id]?.famiglia, fam, `${where}: ${id} is not a ${fam}`);
  for (const e of ALL) {
    if (e.elemento) is(e.elemento, 'elemento', e.id);
    if (e.pianeta) is(e.pianeta, 'pianeta', e.id);
    if (e.segno) is(e.segno, 'segno', e.id);
    for (const i of e.intenzioni) is(i, 'intenzione', e.id);
    if (e.erba) is(e.erba, 'erba', e.id);
    if (e.famiglia === 'segno') { is(e.arcano, 'arcano', e.id); is(e.seme, 'seme', e.id); }
    if (e.famiglia === 'pianeta') is(e.carta, 'arcano', e.id);
  }
  for (const h of D.hubs.filter((x) => x.famiglia === 'intenzione')) assert.ok(h.pianeta && h.elemento, `${h.id} needs a planet and an element`);
  for (const h of D.hubs.filter((x) => x.famiglia === 'pianeta')) assert.ok(h.elemento && h.giorno && h.metallo, `${h.id}`);
});

test('simple on purpose: one planet, one element, one or two intentions per leaf', () => {
  for (const L of D.leaves) {
    assert.ok(L.intenzioni.length >= 1 && L.intenzioni.length <= 2, `${L.id} has ${L.intenzioni.length} intentions`);
    assert.ok(L.pianeta || NO_PLANET.has(L.id), `${L.id} has no planet`);
    assert.ok(L.elemento || NO_ELEMENT.has(L.id), `${L.id} has no element`);
    assert.equal(new Set(L.intenzioni).size, L.intenzioni.length, `${L.id} repeats an intention`);
  }
});

test('every link says how shared it is (consenso), with a known value', () => {
  for (const e of ALL) {
    const c = e.consenso;
    for (const [k, v] of Object.entries(c)) assert.ok(v === null || CONSENSO.includes(v), `${e.id}.consenso.${k} = ${v}`);
    if (e.famiglia === 'intenzione' || D.leaves.includes(e)) {
      for (const k of ['pianeta', 'elemento']) if (e[k]) assert.ok(CONSENSO.includes(c[k]), `${e.id}: no consenso for ${k}`);
      if (D.leaves.includes(e)) assert.ok(CONSENSO.includes(c.intenzioni), `${e.id}: no consenso for intenzioni`);
    }
  }
});

test('THE CIRCLE CLOSES: every element, planet and intention has a leaf in tarocchi, erbe, fumi and pietre', () => {
  const { empty } = circle(D);
  assert.deepEqual(empty.map((x) => `${x.hub}/${x.group}`), [], 'empty cells of the circle');
  assert.equal(D.hubs.length, 19);
  for (const h of SAPERE_HUBS) for (const g of Object.keys(GROUPS)) assert.ok(leavesOf(h.id, g).length, `data: ${h.id}/${g}`);
});

test('no two leaves of a group are the same on every hub (they could not be told apart in play)', () => {
  for (const g of Object.keys(GROUPS)) {
    const seen = new Map();
    for (const L of D.leaves.filter((x) => x.gruppo === g)) {
      const key = [L.elemento, L.pianeta, [...L.intenzioni].sort().join('+')].join('|');
      assert.ok(!seen.has(key), `${L.id} and ${seen.get(key)} are identical on every hub`);
      seen.set(key, L.id);
    }
  }
});

test('the herbs agree with the herbarium (src/data/herbs), or the difference is in HERB_EXCEPTIONS', () => {
  const herbs = D.leaves.filter((L) => L.famiglia === 'erba');
  for (const h of HERB_LIST) {
    const L = herbs.find((x) => x.ref === h.id);
    assert.ok(L, `no page for the herb ${h.id}`);
    const t = HERB_TEXTS[h.id], ex = HERB_EXCEPTIONS[h.id] || {};
    assert.equal(hubName(L.pianeta), 'pianeta' in ex ? ex.pianeta : low(t.pianeta), `${h.id} planet`);
    assert.equal(hubName(L.elemento), 'elemento' in ex ? ex.elemento : t.elemento, `${h.id} element`);
    assert.equal(L.rischio, h.risk, `${h.id} risk`);
  }
  for (const L of herbs.filter((x) => x.ref)) assert.ok(HERB[L.ref], `${L.id}: ${L.ref} is not in the herbarium`);
  assert.ok(herbs.filter((x) => !x.ref).length <= 6, 'at most six plants outside the herbarium');
});

test('smoke made of an herbarium plant has the same planet and element as the herb', () => {
  for (const F of D.leaves.filter((L) => L.famiglia === 'fumo' && L.erba)) {
    assert.equal(F.pianeta, BY[F.erba].pianeta, `${F.id} planet`);
    assert.equal(F.elemento, BY[F.erba].elemento, `${F.id} element`);
  }
});

test('the Majors and the suits agree with the deck (Golden Dawn, src/data/cards.base.js)', () => {
  for (const m of MAJORS) {
    const L = D.leaves.find((x) => x.famiglia === 'arcano' && x.ref === m.id);
    assert.ok(L, `no page for ${m.id}`);
    const { kind, name } = m.astro;
    if (kind === 'planet') assert.equal(hubName(L.pianeta), low(name), `${m.id} planet`);
    if (kind === 'element') { assert.equal(hubName(L.elemento), low(name), `${m.id} element`); assert.equal(L.pianeta, null, `${m.id}`); }
    if (kind === 'sign') {
      const g = SIGNS.find((s) => s.name === name);
      assert.equal(L.segno, `segno-${g.id}`, `${m.id} sign`);
      assert.equal(hubName(L.elemento), low(g.element), `${m.id} element of the sign`);
      assert.equal(hubName(L.pianeta), low(SIGN_LORE[g.id].ruler), `${m.id} ruler of the sign`);
      const S = BY[`segno-${g.id}`];
      assert.equal(S.arcano, L.id); assert.equal(S.pianeta, L.pianeta); assert.equal(S.elemento, L.elemento);
      assert.equal(S.seme, `seme-${({ w: 'bastoni', c: 'coppe', s: 'spade', p: 'denari' })[g.suit]}`, `${S.id} suit`);
    }
  }
  for (const [k, s] of Object.entries(SUITS)) {
    const L = D.leaves.find((x) => x.famiglia === 'seme' && x.ref === k);
    assert.equal(hubName(L.elemento), low(s.element), `suit ${k}`);
  }
  for (const p of D.hubs.filter((h) => h.famiglia === 'pianeta')) assert.equal(BY[p.carta].pianeta, p.id, `${p.id}: its card`);
});

test('words: no exclamation marks, no new-age words, no doses for the poisonous plants', () => {
  for (const d of vault.ofTipo('concetto')) {
    const text = [d.data.in_breve, d.data.si_dice, d.data.da_dove_viene, ...(d.data.varianti || []), d.body].join(' ');
    assert.ok(!text.includes('!'), `${d.name} has an exclamation mark`);
    assert.ok(!/energi|vibrazion|universo/i.test(text), `${d.name} uses a banned word`);
    if (d.data.rischio === 'velenosa') assert.ok(!/\b(cucchiai\w*|grammi|gocce|mg|dose|dosi)\b/i.test(text.replace(/con dosi\./, '')), `${d.name} reads like a recipe`);
    assert.ok(String(d.data.in_breve).split(/\s+/).length <= 22, `${d.name}: in_breve is too long`);
  }
});

test('src/data/sapere.js and the tables of _il-cerchio.md are in step with the vault', () => {
  const { files } = sapereOutputs(vault);
  for (const [p, t] of files) assert.equal(readFileSync(p, 'utf8'), t, `${p} is out of step: run node scripts/lore.mjs sapere`);
  assert.equal(SAPERE_LEAVES.length, D.leaves.length);
  for (const f of HUB_FAMILIES) assert.ok(SAPERE_HUBS.some((h) => h.famiglia === f));
});
