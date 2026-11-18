// The albums of stones and of the sibyl's figures (notes/collezioni.md): every page is complete, every item
// has exactly one source, every source is reachable by a save that is already far ahead, finding never
// opens a page (only the very first herb), old saves load.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { STONE_LIST, STONE, stoneUrl } from '../src/data/stones.js';
import { SIBYL_LIST, SIBYL, sibylUrl, sibylThumb, SIGN_GLYPH, PLANET_GLYPH, sibylFindLine } from '../src/data/sibyl.js';
import { FIND_SPOTS } from '../src/data/world/finds.js';
import { GIFTS, GIFT, FIRST } from '../src/data/gifts.js';
import { SAPERE } from '../src/data/sapere.js';
import { COND_KEYS, test as cond } from '../src/core/cond.js';
import { fresh, parseSave } from '../src/core/state.js';
import { CAST, SCRIPTS } from '../src/data/story/index.js';
import { movesStory } from '../src/glue/bonds.rules.js';
import * as R from '../src/glue/collect.rules.js';

const words = (s) => String(s).trim().split(/\s+/).length;
const SOURCES = [...FIND_SPOTS, ...GIFTS];

test('twelve stones, one page each, tied to the vault and with a picture', () => {
  assert.equal(STONE_LIST.length, 12);
  const vault = Object.values(SAPERE).filter((e) => e.famiglia === 'pietra').map((e) => e.id).sort();
  assert.deepEqual(STONE_LIST.map((s) => s.sapere).sort(), vault, 'the twelve stones of lore/corso/concetti/pietra-*.md');
  for (const s of STONE_LIST) {
    for (const k of ['name', 'find', 'com', 'dice', 'storia']) assert.ok(typeof s[k] === 'string' && s[k].length > 3, `${s.id}.${k}`);
    assert.ok(words(s.dice) >= 10 && words(s.dice) <= 45, `${s.id}: what is said, ${words(s.dice)} words`);
    assert.ok(words(s.com) <= 35 && words(s.storia) <= 40, `${s.id}: short pages`);
    assert.ok(words(s.find) <= 4 && s.find.endsWith('.'), `${s.id}: the find line is a few words («${s.find}»)`);
    assert.doesNotMatch(`${s.com} ${s.dice} ${s.storia}`, /consiglio medico|non sostituisce|attenzione:/i, `${s.id}: no disclaimers (lore/metodo/principi/erbe-come-storia.md)`);
    assert.ok(s.plate ? !s.drawn : s.drawn === true, `${s.id}: either an old plate or drawn: true`);
    const f = `public/stones/${s.id}.webp`;
    assert.ok(existsSync(f), `${f} missing`);
    assert.ok(statSync(f).size < 80000, `${f} too heavy`);
    assert.equal(stoneUrl(s.id), `stones/${s.id}.webp`, `${s.id}: stoneUrl`);
    if (s.plate) assert.ok(s.plate.work, `${s.id}: the plate names its work`);
    assert.ok(s.look?.pal?.length === 4 && s.look.shape, `${s.id}: the small world stone needs a look`);
  }
});

test('thirty-six figures, in order, each with its picture, words, verse and a sign that exists', () => {
  assert.equal(SIBYL_LIST.length, 36);
  SIBYL_LIST.forEach((c, i) => {
    assert.equal(c.n, i + 1);
    for (const f of [`public/${sibylUrl(c.n)}`, `public/${sibylThumb(c.n)}`]) { assert.ok(existsSync(f), `${f} missing`); assert.ok(statSync(f).size < 160000, `${f} too heavy`); }
    assert.ok(c.keys.length >= 2 && c.keys.length <= 3, `${c.n}: two or three keywords`);
    assert.ok(c.de.title && c.de.verse.length === 2 && c.it.title && c.it.verse.length === 2, `${c.n}: title and couplet, German and Italian`);
    assert.ok(SIGN_GLYPH[c.sign] && SAPERE[`segno-${c.sign}`], `${c.n}: the sign ${c.sign} is in the vault`);
    if (c.planet) assert.ok(PLANET_GLYPH[c.planet] && SAPERE[`pianeta-${c.planet.toLowerCase()}`], `${c.n}: planet ${c.planet}`);
  });
  // the deck repeats twelve signs in the same order: a misread one would break the cycle
  for (const c of SIBYL_LIST) if (c.n > 12) assert.equal(c.sign, SIBYL[((c.n - 1) % 12) + 1].sign, `${c.n}: sign out of the cycle`);
  assert.equal(sibylFindLine([7]), 'Una figurina: il serpente.');
  assert.equal(sibylFindLine([3, 35, 34]), 'Tre figurine legate con lo spago.');
});

test('the historical name of the deck is never shown to her', () => {
  for (const f of ['src/data/sibyl.js', 'src/data/gifts.js', 'src/data/world/finds.js', 'src/ui/collect.js']) {
    const shown = readFileSync(f, 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
    assert.doesNotMatch(shown, /lenormand/i, `${f}: «la sibilla dell'ambulante», never the historical name`);
  }
});

test('every stone and every figure has exactly one source, a spot on the ground or a gift', () => {
  const stones = SOURCES.map((s) => s.stone).filter(Boolean), cards = SOURCES.flatMap((s) => s.sibyl || []);
  assert.deepEqual([...stones].sort(), STONE_LIST.map((s) => s.id).sort());
  assert.deepEqual([...cards].sort((a, b) => a - b), SIBYL_LIST.map((c) => c.n));
  for (const s of SOURCES) assert.ok(!!s.stone !== !!s.sibyl, `${s.id}: a stone or figures`);
  for (const s of SOURCES.filter((x) => x.sibyl)) assert.ok(s.sibyl.length >= 1 && s.sibyl.length <= 3, `${s.id}: one to three figures`);
  const sibylSources = SOURCES.filter((s) => s.sibyl).length;
  assert.ok(sibylSources >= 14 && sibylSources <= 16, `36 figures in ${sibylSources} finds and gifts (about 14-16)`);
  // a stone on the ground at most once per kind (one of each type in the world)
  const ground = FIND_SPOTS.filter((s) => s.stone).map((s) => s.stone);
  assert.equal(new Set(ground).size, ground.length);
  assert.equal(new Set(SOURCES.map((s) => s.id)).size, SOURCES.length, 'ids are unique');
});

test('gifts: figures come two or three together with a phrase; every line is one line in a voice', () => {
  for (const g of GIFTS) {
    if (g.sibyl) { assert.ok(g.sibyl.length >= 2, `${g.id}: figures are given in twos or threes`); assert.ok(g.phrase && words(g.phrase) <= 8, `${g.id}: a short phrase`); }
    assert.ok(words(g.line) <= 45, `${g.id}: one line, ${words(g.line)} words`);
    if (g.after) assert.equal(GIFT[g.after]?.who, g.who, `${g.id}: after a gift of the same person`);
    assert.ok(['narra', g.who].includes(g.say), `${g.id}: said by the giver, or by the narrator for a villager`);
  }
  for (const [k, f] of Object.entries(FIRST)) for (const L of [f.lines, f.given].filter(Boolean)) assert.ok(L.length >= 2 && L.length <= 4, `${k}: two to four lines`);
});

// ---- conditions and reachability ------------------------------------------------------------------------
function checkCond(c, where) {
  if (c == null || c === true) return;
  if (Array.isArray(c)) { c.forEach((x) => checkCond(x, where)); return; }
  for (const [k, v] of Object.entries(c)) {
    assert.ok(COND_KEYS.includes(k), `${where}: unknown condition key ${k}`);
    if (k === 'not') checkCond(v, where);
    if (k === 'any') v.forEach((x) => checkCond(x, where));
    assert.ok(k !== 'step' && k !== 'stepIn', `${where}: depends on what she has, never on the step`);
  }
}
test('every condition uses keys of core/cond.js and none depends on the step', () => {
  for (const s of SOURCES) checkCond(s.when, s.id);
});

// a save that has finished the story: everything must still reach her
const farAhead = () => {
  const s = fresh();
  Object.assign(s, { started: true, chapter: 4, step: 'f.done' });
  Object.assign(s.flags, { 'met.ginepra': true, 'ending.seen': true, 'exam1.done': true, 'shop.open': true });
  for (const k of Object.keys(s.powers)) s.powers[k] = true;
  for (const k of Object.keys(s.spreads)) s.spreads[k] = true;
  return s;
};
const freeTalk = (who, s) => CAST.filter((c) => c.kind === 'npc' && c.who === who && !movesStory(c.script, SCRIPTS) && cond(c.when ?? true, s));

test('a save far ahead can get every gift: the giver can be talked to freely and the chain runs to the end', () => {
  const s = farAhead();
  for (const who of [...new Set(GIFTS.map((g) => g.who))]) {
    if (who !== 'tartufo') assert.ok(freeTalk(who, s).length, `${who}: no free talk for a save far ahead`);
    let n = 0, g;
    while ((g = R.giftFor({ who, s, test: cond, gifts: GIFTS })) && n < 20) { R.giveGift(s, g, 1); n += 1; }
    assert.equal(n, GIFTS.filter((x) => x.who === who).length, `${who}: every gift, one per talk`);
  }
  for (const sp of FIND_SPOTS) assert.ok(R.spotActive(sp, s, cond), `${sp.id}: lies there for a save far ahead`);
  for (const sp of FIND_SPOTS) R.takeSpot(s, sp, 1);
  assert.equal(R.countOf(s, 'stone'), 12);
  assert.equal(R.countOf(s, 'sibyl'), 36);
});

test('the first words of each kind come once, from their person, as soon as she has one', () => {
  const s = farAhead();
  assert.deepEqual(R.firstDue({ who: 'edera', s, first: FIRST }), []);
  R.takeSpot(s, FIND_SPOTS.find((x) => x.stone), 1);
  assert.deepEqual(R.firstDue({ who: 'ginepra', s, first: FIRST }), []);
  assert.deepEqual(R.firstDue({ who: 'edera', s, first: FIRST }), ['stone']);
  R.markFirst(s, 'stone');
  assert.deepEqual(R.firstDue({ who: 'edera', s, first: FIRST }), []);
  R.giveGift(s, GIFT['g.ginepra.promise'], 1);
  assert.deepEqual(R.firstDue({ who: 'ginepra', s, first: FIRST }), ['sibyl']);
});

test('what comes in is «nuova» until its page is opened; groups remember their phrase', () => {
  const s = farAhead();
  const got = R.giveGift(s, GIFT['g.ginepra.promise'], 5);
  assert.equal(got.length, 2);
  assert.ok(R.isNew(s, 'sibyl', 27) && R.albumHasNew(s, 'sibyl') && !R.albumHasNew(s, 'stone'));
  assert.deepEqual(R.cameWith(s, 25), { from: 'g.ginepra.promise', who: 'ginepra', phrase: 'Una promessa scritta.', others: [27] });
  assert.ok(R.markSeen(s, 'sibyl', 27) && R.markSeen(s, 'sibyl', 25));
  assert.ok(!R.albumHasNew(s, 'sibyl'));
  // a missing slot shows only its number
  const slots = R.albumSlots(s, 'sibyl', SIBYL_LIST);
  assert.deepEqual(slots[0], { n: 1, have: false });
  assert.equal(slots[26].name, 'La lettera');
  assert.equal(R.giveGift(s, GIFT['g.ginepra.promise'], 6).length, 0, 'a gift is given once');
});

test('finding never opens a page: only the very first plant does, and old saves are past it', () => {
  assert.ok(R.herbOpensPage(fresh()));
  assert.ok(!R.herbOpensPage({ ...fresh(), herbs: { salvia: { at: 1 } } }));
  // the glue of the albums opens no page at all
  const glue = readFileSync('src/glue/collect.js', 'utf8');
  assert.doesNotMatch(glue, /showStone|showSibyl|openSheet|showHerb/);
  // the herbarium opens a page by itself only behind herbOpensPage
  const herbs = readFileSync('src/glue/herbs.js', 'utf8');
  assert.match(herbs, /if \(page\) \{.*await showHerb\(id\); return true; \}/);
});

test('old saves load with empty albums, and odd values are mended', () => {
  const old = JSON.parse(JSON.stringify(fresh()));
  for (const k of ['stones', 'oracle', 'oracleFrom', 'albumSeen']) delete old[k];
  old.started = true; old.herbs = { salvia: { at: 1 } };
  const s = parseSave(JSON.stringify(old));
  for (const k of ['stones', 'oracle', 'oracleFrom', 'albumSeen']) assert.deepEqual(s[k], {}, k);
  assert.ok(!R.isNew(s, 'herb', 'salvia'), 'plants of an old save are not «nuova»');
  const odd = parseSave(JSON.stringify({ ...old, stones: [], oracle: null, albumSeen: 3 }));
  assert.deepEqual([odd.stones, odd.oracle, odd.albumSeen], [{}, {}, {}]);
});
