// Edera's interest, stones (notes/interessi/PROGETTO.md §4): missions 1-3 and the first step («In tasca»).
// Rules: src/glue/interests.edera.rules.js; words: src/data/interests/edera.js; scenes:
// src/data/story/scripts/interests.edera.js. The glue (src/glue/interests.edera.js) cannot be imported under node
// (it pulls the screens): its registration is checked on the source, the chain on the same entries.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as R from '../src/glue/interests.edera.rules.js';
import { levelOf, canStep } from '../src/glue/interests.rules.js';
import { EDERA_MISSIONS, CELLAR, COURAGE, WRONG_ORDER, LABELS, POCKET } from '../src/data/interests/edera.js';
import { INTEREST_EDERA_SCRIPTS as S } from '../src/data/story/scripts/interests.edera.js';
import { SAPERE, leavesOf } from '../src/data/sapere.js';
import { STONE, STONE_LIST } from '../src/data/stones.js';
import { TITLES } from '../src/ui/missions/titles.js';
import { test as cond } from '../src/core/cond.js';
import { fresh, parseSave, migrate } from '../src/core/state.js';
import { todayKey } from '../src/core/progress.js';
import { extraStatus, extrasShown, extraOpen } from '../src/core/extras.js';
import { allAnchors } from '../src/world/maps.js';
import { CAST } from '../src/data/story/index.js';
import { newExam, answerStep, failed } from '../src/systems/exam.rules.js';

const TODAY = todayKey();
const YESTERDAY = todayKey(new Date(Date.now() - 86400000));
const TOMORROW = todayKey(new Date(Date.now() + 86400000));
const LIMIT = 220;
const IDS = EDERA_MISSIONS.map((m) => m.id);
const E = R.ederaEntries();
const LIST = E.map((e) => e.extra);
const ALL = STONE_LIST.map((x) => x.id);
const stones = (...ids) => Object.fromEntries(ids.map((id, i) => [id, { at: 1000 + i, from: 'test' }]));
const three = stones('citrino', 'ossidiana', 'pietra-di-luna');
const save = (patch = {}) => migrate({ ...fresh(), started: true, chapter: 3, step: 'c3.coven', stones: three, ...patch,
  world: { opened: {}, taken: {}, talked: {}, once: { 'first.stone': true, ...(patch.once || {}) } }, flags: { ...(patch.flags || {}) } });
function* walk(nodes) { for (const n of nodes || []) { yield n; if (n.choice) for (const o of n.choice) { yield o; yield* walk(o.then); } if (n.then) yield* walk(n.then); if (n.else) yield* walk(n.else); } }
const texts = (id) => [...walk(S[id])].filter((n) => typeof n.t === 'string').map((n) => n.t);
const GLUE = readFileSync(new URL('../src/glue/interests.edera.js', import.meta.url), 'utf8');

// ---- rules ----------------------------------------------------------------------------------------------
test('the steps of Edera\'s interest come from her missions only; one mission a day, apart from Ortica\'s', () => {
  for (let k = 0; k <= 3; k++) {
    const s = save({ flags: Object.fromEntries(IDS.slice(0, k).map((id) => [id, true])) });
    assert.equal(levelOf('edera', s), Math.floor(k / 2));
    assert.equal(cond({ interest: ['edera', 1] }, s), k >= 2);
  }
  const s = save({ flags: { 'int.ortica.1': true, 'int.ortica.2': true } });
  assert.equal(levelOf('edera', s), 0, 'Ortica\'s missions are not Edera\'s');
  s.interests.day.ortica = TODAY;
  assert.equal(cond({ interestRested: 'edera' }, s), true, 'a mission of Ortica today does not hold Edera\'s back');
  s.interests.day.edera = TODAY;
  assert.equal(cond({ interestRested: 'edera' }, s), false);
  assert.equal(canStep('edera', s, TODAY), false);
});

test('the start: once Edera has spoken of stones and three are in her album', () => {
  assert.equal(R.ederaReady(save()), true);
  assert.equal(R.ederaReady(save({ stones: stones('citrino', 'ossidiana') })), false, 'two stones are not enough');
  const s = save(); delete s.world.once['first.stone'];
  assert.equal(R.ederaReady(s), false, 'not before her first words about stones');
  assert.equal(R.STONES_TO_START, 3);
});

test('the chain: one link at a time after her start scene, each on a later day than the last mission; never a key', () => {
  const shown = (s) => extrasShown(s, cond, LIST).map((e) => `${e.id}:${e.status}`).sort();
  const s = save();
  assert.deepEqual(shown(s), [], 'nothing before Edera has asked');
  s.flags['int.edera.offered'] = true;
  assert.deepEqual(shown(s), ['int.edera.1:new']);
  s.flags['int.edera.1'] = true; s.interests.day.edera = TODAY;
  assert.deepEqual(shown(s), ['int.edera.1:done'], 'the second waits for tomorrow');
  s.interests.day.edera = YESTERDAY;
  assert.deepEqual(shown(s), ['int.edera.1:done', 'int.edera.2:new']);
  s.flags['int.edera.2'] = true; s.interests.day.edera = TODAY;
  assert.equal(extraOpen(LIST[2], s, cond, LIST), false);
  s.interests.day.edera = YESTERDAY;
  assert.equal(extraStatus(LIST[2], s, cond, LIST), 'new');
  for (const e of E) { assert.equal(e.extra.kind, 'interest'); assert.ok(!e.extra.key); }
});

test('the registry entries and the cast: places, scenes and cards that exist; Edera before her chat; the constable before his encounter', () => {
  const anchors = allAnchors();
  E.forEach(({ extra, cast }, n) => {
    assert.ok(anchors[extra.at], extra.at);
    assert.deepEqual(extra.after, n ? [IDS[n - 1]] : []);
    assert.deepEqual(extra.done, { flag: IDS[n] });
    assert.equal(cast.at, extra.at);
    assert.ok(Array.isArray(S[cast.script]), cast.script);
    assert.ok(TITLES[extra.id], `${extra.id}: a card on the map`);
  });
  assert.equal(E[2].cast.kind, 'prop', 'in the library the shelf is a thing, not a person');
  assert.notEqual(E[2].cast.id, 'library.shelf', 'never the bookshelf\'s own id (glue/books.js adds it only if missing)');
  for (const c of [R.EDERA_START, R.GUARD_WELL]) { assert.ok(anchors[c.at], c.at); assert.ok(Array.isArray(S[c.script]), c.script); }
  assert.ok(CAST.some((c) => c.id === 'enc.guard' && c.at === 'depths.well'), 'the constable stands at the old well (cast.js)');
  assert.equal(R.GUARD_WELL.id, 'enc.guard');
  assert.match(GLUE, /Object\.assign\(SCRIPTS, INTEREST_EDERA_SCRIPTS\)/);
  assert.match(GLUE, /for \(const \{ extra, cast \} of R\.ederaEntries\(\)\)/);
  assert.match(GLUE, /EXTRAS\.push\(extra\)/);
  assert.match(GLUE, /findIndex\(\(e\) => e\.id === 'enc\.guard'\)/);
  assert.match(readFileSync(new URL('../src/glue/index.js', import.meta.url), 'utf8'), /import '\.\/interests\.js';[^\n]*\nimport '\.\/interests\.edera\.js'/, 'after interests.js, whose interests.step it wraps');
  const called = [...walk(Object.values(S).flat())].filter((n) => n.do === 'call').map((n) => n.name);
  const shared = readFileSync(new URL('../src/glue/interests.js', import.meta.url), 'utf8');
  for (const name of called) assert.ok(new RegExp(`provide\\('${name.replace('.', '\\.')}'`).test(GLUE + shared), name);
});

// ---- data ------------------------------------------------------------------------------------------------------
test('the cellars: three memories in order, all wrong, and the stone beside the last one', () => {
  const mem = CELLAR.spots.filter((x) => x.memory).sort((a, b) => a.memory - b.memory);
  assert.deepEqual(mem.map((x) => x.memory), [1, 2, 3]);
  assert.deepEqual(CELLAR.spots.filter((x) => x.found).map((x) => x.id), ['crepa']);
  assert.ok(mem.every((x) => !x.found));
  assert.equal(new Set(CELLAR.spots.map((x) => x.id)).size, CELLAR.spots.length);
  for (const x of CELLAR.spots) { assert.ok(x.re && x.re.length <= LIMIT, x.id); assert.equal(R.cellarFound(x.id), !!x.found); }
  assert.match(CELLAR.first, /vasetti/, 'she names the first memory first');
  assert.match(CELLAR.spots.find((x) => x.memory === 1).re, /candele/, 'each memory leads to the next');
  assert.match(CELLAR.spots.find((x) => x.memory === 2).re, /pozzo/);
  assert.ok(CELLAR.turns >= 3 && STONE.lapislazzuli);
});

test('the stone for the constable: the right ones are exactly the stones of courage in the circle (src/data/sapere.js)', () => {
  const circle = leavesOf(COURAGE.intention, 'pietre').map((L) => L.id).sort();
  const right = ALL.filter(R.courageOk);
  assert.deepEqual(right.map((id) => STONE[id].sapere).sort(), circle);
  assert.deepEqual(Object.keys(COURAGE.right).sort(), [...right].sort(), 'a line for each right stone, and only those');
  for (const id of right) assert.match(COURAGE.right[id], new RegExp(STONE[id].name, 'i'), 'the right line names the stone');
  for (const id of ALL.filter((x) => !R.courageOk(x))) {
    const r = R.courageLine(id);
    assert.equal(r.ok, false);
    assert.ok(r.line && r.line.length <= LIMIT, `${id}: Edera says what it is for`);
  }
  assert.deepEqual(Object.keys(COURAGE.wrong).sort(), [...WRONG_ORDER].sort());
  for (const k of WRONG_ORDER) assert.ok(SAPERE[k], k);
  // protection first: a shield is the likeliest mistake, and Edera says why it is not the one
  assert.equal(R.courageLine('ossidiana').line, COURAGE.wrong['intenzione-protezione']);
  assert.ok(R.courageOk(COURAGE.lend), 'the stone Edera lends gives courage');
});

test('the witch lends what is missing: Edera\'s own stone when none of hers gives courage, never otherwise', () => {
  assert.deepEqual(R.courageChoices(three), { mine: ['citrino', 'pietra-di-luna', 'ossidiana'], lent: ['occhio-di-tigre'] });
  assert.deepEqual(R.courageChoices(stones('citrino', 'eliotropio', 'ossidiana')).lent, []);
  // her only stone of courage is with the constable tonight: Edera lends hers
  const c = R.courageChoices(stones('citrino', 'eliotropio', 'ossidiana'), 'eliotropio');
  assert.ok(!c.mine.includes('eliotropio'));
  assert.deepEqual(c.lent, ['occhio-di-tigre']);
  // the scene says whose it was
  assert.ok(S['int.edera.2'].some((n) => n.if?.flag === 'int.edera.2.chosen' && n.then.some((m) => m.if?.flag === 'int.edera.2.lent')));
  assert.match(texts('int.edera.2').join(' '), /Questa è mia, ma va bene lo stesso\. La prossima volta portami la tua/);
});

test('the labels: four stones of the shelf (hers first, the oldest first, never the lapis lazuli), six names, a look line for each', () => {
  const s = stones('quarzo-rosa', 'agata', 'lapislazzuli');
  const shelf = R.shelfStones(s);
  assert.equal(shelf.length, LABELS.n);
  assert.deepEqual(shelf.slice(0, 2), ['quarzo-rosa', 'agata'], 'hers first, in the order she got them');
  assert.ok(!shelf.includes('lapislazzuli'), 'Edera wears it');
  const names = R.labelNames(s, shelf);
  assert.equal(names.length, LABELS.n + LABELS.decoys);
  assert.ok(shelf.every((id) => names.includes(id)) && !names.includes('lapislazzuli'));
  assert.equal(new Set(names).size, names.length);
  const many = stones(...ALL);
  assert.deepEqual(R.labelNames(many, R.shelfStones(many)).filter((id) => !many[id]), [], 'with all twelve, every name is one she has');
  for (const id of ALL.filter((x) => !LABELS.skip.includes(x))) {
    assert.ok(LABELS.look[id] && LABELS.look[id].length <= 120, `${id}: what it looks like`);
    assert.match(LABELS.look[id], new RegExp(`^(L'|Il |La )${STONE[id].name}`, 'i'), `${id}: the line names it`);
  }
  assert.equal(R.labelWhy('agata', 'agata'), null);
  assert.equal(R.labelWhy('agata', 'ossidiana'), LABELS.look.ossidiana);
});

// ---- level 1: the pocket and the second try ---------------------------------------------------------------------
test('the pocket: courage or protection works, read from the circle; every such stone has its words in the Exam', () => {
  const works = ALL.filter(R.pocketWorks);
  const circle = new Set(POCKET.intentions.flatMap((k) => leavesOf(k, 'pietre').map((L) => L.id)));
  assert.deepEqual(works.map((id) => STONE[id].sapere).sort(), [...circle].sort());
  assert.deepEqual(Object.keys(POCKET.the).sort(), [...works].sort());
  for (const id of works) for (const kind of ['constable', 'afflicted']) {
    const w = R.secondWords(kind, id);
    assert.ok(w && w[1].includes(POCKET.the[id]) && !w[1].includes('{'), `${kind} ${id}`);
  }
  assert.equal(R.secondWords('judge', 'ossidiana'), null, 'never with the judge');
  assert.equal(POCKET.exam.constable[0], 'Il conestabile esita.');
});

test('the second try: from level 1, with a stone that works, once a day, never a lent stone or one she lacks', () => {
  const s = save({ stones: stones('citrino', 'ossidiana', 'pietra-di-luna') });
  assert.equal(R.secondTry(s, 1, TODAY), null, 'nothing in her pocket');
  s.pocket = R.pocketPut(s.pocket, 'ossidiana');
  assert.equal(R.secondTry(s, 0, TODAY), null, 'not before level 1');
  assert.equal(R.secondTry(s, 1, TODAY), 'ossidiana');
  s.pocket = R.useSecond(s.pocket, TODAY);
  assert.equal(R.secondTry(s, 1, TODAY), null, 'once a day');
  assert.equal(R.secondTry(s, 1, TOMORROW), 'ossidiana', 'and again tomorrow');
  s.pocket = R.pocketPut(s.pocket, 'citrino');
  assert.equal(R.secondTry(s, 1, TOMORROW), null, 'the yellow quartz calls money, not courage');
  assert.deepEqual(R.pocketPut(s.pocket, 'ossidiana').stone, 'ossidiana', 'one at a time: the new one replaces the old');
  // lent to the constable: not in her pocket, not usable, until he gives it back
  s.pocket = R.lendTo(R.pocketPut(s.pocket, 'ossidiana'), 'ossidiana', TODAY);
  assert.equal(s.pocket.stone, null);
  assert.equal(R.canPocket(s, 'ossidiana'), false);
  s.pocket = R.giveBack(s.pocket);
  assert.equal(R.canPocket(s, 'ossidiana'), true);
  assert.equal(R.canPocket(s, 'eliotropio'), false, 'not a stone she has');
  // the Exam and the glue
  const exam = readFileSync(new URL('../src/systems/exam.js', import.meta.url), 'utf8');
  assert.match(exam, /!ok && !judge && R\.failed\(r\.state\) && has\('exam\.second'\)/);
  assert.match(exam, /qs\.splice\(qi \+ 1, 0, nq\)/, 'the next question is on another card');
  assert.match(GLUE, /provide\('exam\.second'/);
  assert.match(GLUE, /levelOf\('edera', state\) < 1/, 'the pocket section only from level 1');
});

// The measure (notes/interessi/PROGETTO.md §4, gradino 1): «the first lost Exam of the day becomes a second try».
// Played literally (a whole second Exam) it takes almost every loss away from a player with one Exam a day:
// at chapter 3 with three answers in four right, a constable's Exam is lost 14% of the time, and 1.5% with a
// whole second try. The lighter version kept here: only the mistake that would lose the Exam is taken back,
// and the next question is on another card; the loss stays real (about 6%), once a day.
test('balance: the second try takes back one decisive mistake and leaves the Exams their risk', () => {
  let seed = 11;
  const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const play = (kind, p, mode) => {
    let s = newExam({ kind, chapter: 3, exams: 9 }), used = false;
    while (!s.over) {
      const ok = rng() < p, r = answerStep(s, ok);
      if (!ok && mode === 'one' && !used && failed(r.state)) { used = true; continue; }
      s = r.state;
    }
    return failed(s) && mode === 'full' ? play(kind, p, 'base') : failed(s);
  };
  const rate = (kind, p, mode, n = 20000) => { let f = 0; for (let i = 0; i < n; i++) f += play(kind, p, mode); return f / n; };
  const base = rate('constable', 0.75, 'base'), one = rate('constable', 0.75, 'one'), full = rate('constable', 0.75, 'full');
  assert.ok(base > 0.11 && base < 0.17, `constable base ${base}`);
  assert.ok(full < 0.03, `a whole second Exam leaves almost no risk: ${full}`);
  assert.ok(one > 0.04 && one < base * 0.6, `the lighter version: ${one} against ${base}`);
  const aBase = rate('afflicted', 0.75, 'base'), aOne = rate('afflicted', 0.75, 'one');
  assert.ok(aOne > 0.15 && aOne < aBase, `afflicted ${aOne} against ${aBase}`);
});

// ---- the scenes ---------------------------------------------------------------------------------------------------
test('the scenes: lines that fit, no tokens, never her real name; each mission ends with diary, xp, the bond and the step', () => {
  for (const id of Object.keys(S)) {
    for (const t of texts(id)) {
      assert.ok(t.length <= LIMIT, `${id}: «${t}» is too long`);
      assert.doesNotMatch(t, /\{\w+\}/, `${id}: a token in «${t}»`);
    }
    for (const c of [...walk(S[id])].filter((n) => n.choice)) {
      assert.ok(c.choice.length >= 2, `${id}: two answers at least`);
      for (const o of c.choice) assert.ok(o.trait && o.t.length <= 90, `${id}: «${o.t}»`);
    }
  }
  for (const n of [1, 2, 3]) {
    const branch = S[`int.edera.${n}`].find((x) => x.if)?.then || [];
    const tail = branch.slice(-4);
    assert.deepEqual(tail.map((x) => x.do), ['diary', 'xp', 'bond', 'call'], `int.edera.${n}`);
    assert.deepEqual(tail[2], { do: 'bond', who: 'edera', n: 1, why: 'interest' });
    assert.deepEqual([tail[3].name, tail[3].args], ['interests.step', ['edera', n]]);
  }
  const start = S['int.edera.start'];
  assert.ok(start.findIndex((x) => x.do === 'flag' && x.k === 'int.edera.offered') < start.findIndex((x) => x.choice), 'asked before she answers');
  assert.ok(start.some((x) => x.if?.flag === 'edera.rosalba'), 'Rosalba, if she let her');
  // each mission tells of the next before it ends (the card says what she was told)
  assert.match(texts('int.edera.1').join(' '), /cani che abbaiano alla luna/);
  assert.match(texts('int.edera.2').join(' '), /cartellini/);
  assert.match(texts('int.edera.2').join(' '), /In tasca, però, non al collo/);
  // the lapis: Venus, the truth, the Priestess's blue (lore/sapere/pietra-lapislazzuli.md)
  assert.equal(SAPERE['pietra-lapislazzuli'].pianeta, 'pianeta-venere');
  assert.match(texts('int.edera.1').join(' '), /Venere/);
  assert.match(texts('int.edera.1').join(' '), /Sacerdotessa/);
});

// ---- old saves, a save far ahead ------------------------------------------------------------------------------------
test('old saves load with the pocket and lose nothing; a save that has ended the game gets the start, then one mission', () => {
  const s = parseSave(JSON.stringify({ started: true, chapter: 3, stones: three, world: { once: { 'first.stone': true } } }));
  assert.deepEqual(s.pocket, { stone: null, used: '', lent: null });
  assert.deepEqual(Object.keys(s.stones).sort(), Object.keys(three).sort());
  assert.ok(R.ederaReady(s));
  const bad = parseSave(JSON.stringify({ started: true, pocket: [1], interests: 'x' }));
  assert.deepEqual(bad.pocket, { stone: null, used: '', lent: null });
  const bad2 = parseSave(JSON.stringify({ started: true, pocket: { stone: 4, used: null, lent: { stone: 3 } } }));
  assert.deepEqual(bad2.pocket, { stone: null, used: '', lent: null });
  assert.deepEqual(R.normPocket({ stone: 'nonesiste', lent: { stone: 'agata', day: TODAY } }), { stone: null, used: '', lent: { stone: 'agata', day: TODAY } });
  // ENDED: the whole story played, Edera's lessons done, every stone, Ortica's interest done too
  const ended = parseSave(JSON.stringify({ started: true, chapter: 4, step: 'post.minors', stones: stones(...ALL),
    flags: { 'ending.seen': true, 'edera.rosalba': true, 'lesson.reversed': true, 'int.ortica.1': true, 'int.ortica.2': true, 'int.ortica.3': true },
    interests: { day: { ortica: TODAY } }, world: { once: { 'first.stone': true } } }));
  assert.ok(R.ederaReady(ended));
  ended.flags['int.edera.offered'] = true;
  const shown = extrasShown(ended, cond, LIST);
  assert.deepEqual(shown.map((e) => `${e.id}:${e.status}`), ['int.edera.1:new'], 'one at a time, the first, even on a day Ortica\'s interest moved');
  // far ahead with all twelve: a stone of courage is hers, so Edera lends nothing
  assert.deepEqual(R.courageChoices(ended.stones).lent, []);
});
