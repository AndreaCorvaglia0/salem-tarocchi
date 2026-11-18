// The witches' interests, first slice: Ortica's herbs and garden (notes/interessi/PROGETTO.md §11).
// Rules: src/glue/interests.rules.js; words: src/data/interests/ortica.js; scenes:
// src/data/story/scripts/interests.ortica.js; the glue (src/glue/interests.js) cannot be imported under node (it
// pulls the screens and their CSS): its registration is checked on the source, the chain on the same entries.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as R from '../src/glue/interests.rules.js';
import { ORTICA_MISSIONS, HANG, MORTAR, BUNDLE, HEAL, BEAM } from '../src/data/interests/ortica.js';
import { INTEREST_ORTICA_SCRIPTS as S } from '../src/data/story/scripts/interests.ortica.js';
import { SAPERE, leavesOf } from '../src/data/sapere.js';
import { GARDEN } from '../src/data/garden.js';
import { HERB } from '../src/data/herbs/base.js';
import { REFUSALS } from '../src/data/reading/people.js';
import { TITLES } from '../src/ui/missions/titles.js';
import { test as cond, COND_KEYS } from '../src/core/cond.js';
import { fresh, parseSave, migrate } from '../src/core/state.js';
import { todayKey } from '../src/core/progress.js';
import { extraStatus, extrasShown, extraOpen } from '../src/core/extras.js';
import { freshRite, normRite, planRite, giftDue, afterGift, afterMade } from '../src/glue/rite.rules.js';
import { AIRS, TEXT } from '../src/data/rite.js';
import { allAnchors } from '../src/world/maps.js';
import { CAST } from '../src/data/story/index.js';

const TODAY = todayKey();
const YESTERDAY = todayKey(new Date(Date.now() - 86400000));
const LIMIT = 220;
const IDS = ORTICA_MISSIONS.map((m) => m.id);
const E = R.orticaEntries();
const GIFT = { id: 'garden.ortica', kind: 'errand', at: 'forest.ortica_hut', when: { flag: 'garden.offer' }, done: { flag: 'garden.given' } };
const LIST = [GIFT, ...E.map((e) => e.extra)];
const save = (patch = {}) => migrate({ ...fresh(), started: true, chapter: 2, step: 'c2.mill', ...patch, flags: { 'garden.offer': true, 'garden.given': true, ...(patch.flags || {}) } });
function* walk(nodes) { for (const n of nodes || []) { yield n; if (n.choice) for (const o of n.choice) { yield o; yield* walk(o.then); } if (n.then) yield* walk(n.then); if (n.else) yield* walk(n.else); } }
const texts = (id) => [...walk(S[id])].filter((n) => typeof n.t === 'string').map((n) => n.t);

// ---- rules --------------------------------------------------------------------------------------------
test('the steps come from the missions done (flags): 1 at two, 2 at four, 3 at six; cond agrees', () => {
  for (let k = 0; k <= 6; k++) {
    const flags = Object.fromEntries(Array.from({ length: k }, (_, i) => [`int.ortica.${i + 1}`, true]));
    const s = save({ flags });
    assert.equal(R.doneCount('ortica', s), k);
    assert.equal(R.levelOf('ortica', s), Math.floor(k / 2));
    for (let n = 1; n <= 3; n++) assert.equal(cond({ interest: ['ortica', n] }, s), R.levelOf('ortica', s) >= n, `${k} done, step ${n}`);
  }
  assert.equal(R.levelOf('malva', save({ flags: { 'int.ortica.1': true, 'int.ortica.2': true } })), 0, 'one witch\'s missions are hers only');
});

test('the two new condition keys exist and read the save: interest, interestRested', () => {
  assert.ok(COND_KEYS.includes('interest') && COND_KEYS.includes('interestRested'));
  const s = save();
  assert.equal(cond({ interestRested: 'ortica' }, s), true);
  s.interests.day.ortica = TODAY;
  assert.equal(cond({ interestRested: 'ortica' }, s), false);
  s.interests.day.ortica = YESTERDAY;
  assert.equal(cond({ interestRested: 'ortica' }, s), true);
  assert.equal(R.canStep('ortica', s, TODAY), true);
  assert.equal(R.canStep('ortica', s, YESTERDAY), false);
});

test('the preponderant interest: most missions, at least three; on a tie the one that grew last', () => {
  const s = save({ flags: { 'int.ortica.1': true, 'int.ortica.2': true } });
  assert.equal(R.preponderant(s), null);
  s.flags['int.ortica.3'] = true; s.interests.day.ortica = '2026-11-18';
  assert.equal(R.preponderant(s), 'ortica');
  Object.assign(s.flags, { 'int.malva.1': true, 'int.malva.2': true, 'int.malva.3': true }); s.interests.day.malva = '2026-11-19';
  assert.equal(R.preponderant(s), 'malva');
  s.flags['int.ortica.4'] = true;
  assert.equal(R.preponderant(s), 'ortica');
});

test('the chain: one link at a time, after the gift of the garden, each on a later day than the last mission', () => {
  const t = cond;
  const shown = (s) => extrasShown(s, t, LIST).filter((e) => IDS.includes(e.id)).map((e) => `${e.id}:${e.status}`).sort();
  let s = save({ pantry: { lavanda: 2 } });
  assert.deepEqual(shown(s), [], 'nothing before Ortica has asked');
  assert.ok(R.orticaReady(s));
  s.flags['int.ortica.offered'] = true;
  assert.deepEqual(shown(s), ['int.ortica.1:new']);
  // mission 1 done today: the second waits for tomorrow
  s.flags['int.ortica.1'] = true; s.interests.day.ortica = TODAY;
  assert.deepEqual(shown(s), ['int.ortica.1:done']);
  s.interests.day.ortica = YESTERDAY;
  assert.deepEqual(shown(s), ['int.ortica.1:done', 'int.ortica.2:new']);
  s.flags['int.ortica.2'] = true; s.interests.day.ortica = TODAY;
  assert.equal(extraOpen(LIST[3], s, t, LIST), false, 'the third waits a day');
  s.interests.day.ortica = YESTERDAY;
  assert.equal(extraStatus(LIST[3], s, t, LIST), 'new');
  // never a key: the story ends without them
  for (const e of E) { assert.equal(e.extra.kind, 'interest'); assert.ok(!e.extra.key); }
  // a save without the garden: nothing
  s = migrate({ ...fresh(), started: true, chapter: 2, pantry: { lavanda: 3 } });
  assert.equal(R.orticaReady(s), false);
});

test('the registry entries and the cast: places that exist, scenes that exist, Ortica before her everyday chat', () => {
  const anchors = allAnchors();
  E.forEach(({ extra, cast }, n) => {
    assert.ok(anchors[extra.at], extra.at);
    assert.deepEqual(extra.after, [n ? IDS[n - 1] : 'garden.ortica']);
    assert.deepEqual(extra.done, { flag: IDS[n] });
    assert.ok(Array.isArray(S[cast.script]), cast.script);
    assert.ok(TITLES[extra.id], `${extra.id}: a card on the map`);
  });
  for (const c of [R.ORTICA_START, R.MILLER_SQUARE]) { assert.ok(anchors[c.at], c.at); assert.ok(Array.isArray(S[c.script]), c.script); }
  assert.ok(CAST.some((c) => c.who === 'miller' && c.at === 'forest.mill'), 'the miller already stands in the world (cast.js): the square only moves him');
  const src = readFileSync(new URL('../src/glue/interests.js', import.meta.url), 'utf8');
  assert.match(src, /Object\.assign\(SCRIPTS, INTEREST_ORTICA_SCRIPTS\)/);
  assert.match(src, /for \(const \{ extra, cast \} of R\.orticaEntries\(\)\)/);
  assert.match(src, /EXTRAS\.push\(extra\)/);
  assert.match(src, /CAST\.splice\(.*entry\)/);
  for (const name of ['interests.beam', 'interests.mortar', 'interests.bundle', 'interests.step', 'interests.refusal', 'interests.give']) assert.match(src, new RegExp(`provide\\('${name.replace('.', '\\.')}'`));
  assert.match(readFileSync(new URL('../src/glue/index.js', import.meta.url), 'utf8'), /import '\.\/interests\.js'/);
  assert.match(readFileSync(new URL('../src/glue/clients.js', import.meta.url), 'utf8'), /call\('interests\.refusal', v\)/);
  // the services the scenes call are the ones provided
  const called = [...walk(Object.values(S).flat())].filter((n) => n.do === 'call').map((n) => n.name);
  for (const name of called) assert.match(src, new RegExp(`provide\\('${name.replace('.', '\\.')}'`), name);
});

// ---- data ------------------------------------------------------------------------------------------------
test('the mortar: the right herbs are exactly the jars of the intention in the circle (src/data/sapere.js)', () => {
  assert.ok(SAPERE[MORTAR.intention]);
  const circle = leavesOf(MORTAR.intention, 'erbe').map((L) => L.ref);
  const right = MORTAR.jars.filter((id) => circle.includes(id));
  assert.deepEqual(R.rightJars(), right);
  assert.equal(right.length, 2, 'two right jars of four');
  assert.equal(MORTAR.jars.length, 4);
  for (const id of MORTAR.jars) assert.ok(HERB[id], id);
  for (const id of MORTAR.jars.filter((x) => !right.includes(x))) assert.ok(MORTAR.wrong[id], `${id}: Ortica says what it is for`);
  assert.ok(R.mortarOk(right) && R.mortarOk([...right].reverse()));
  assert.ok(!R.mortarOk([right[0], right[0]]) && !R.mortarOk([right[0]]));
  for (const bad of Object.keys(MORTAR.wrong)) { assert.ok(!R.mortarOk([right[0], bad])); assert.equal(R.mortarWhy([right[0], bad]), MORTAR.wrong[bad]); }
  for (const id of right) assert.match(MORTAR.right, new RegExp(HERB[id].name, 'i'), 'the right line names the two herbs');
});

test('the beam: one right place; the bunches are neither made nor lost (fresh -> beam -> dried the next day)', () => {
  assert.equal(HANG.filter((p) => p.ok).length, 1);
  assert.ok(R.dryOk('ombra') && !R.dryOk('sole') && !R.dryOk('fuoco'));
  for (const p of HANG) assert.ok(p.t.length <= 70 && p.re.length <= LIMIT, p.id);
  const pantry = { lavanda: 2, menta: 1 };
  assert.deepEqual(R.freshList(pantry).sort(), ['lavanda', 'lavanda', 'menta']);
  assert.deepEqual(R.beamPicks(pantry, ['lavanda']), { mine: ['lavanda'], lent: 2 });
  assert.equal(R.beamPicks(pantry, ['salvia']), null, 'only her own bunches');
  assert.equal(R.beamPicks(pantry, ['menta', 'menta']), null);
  const total = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  const h1 = R.hang(pantry, [], ['lavanda', 'lavanda', 'menta'], TODAY);
  assert.deepEqual(h1.pantry, {});
  assert.equal(h1.hung.reduce((a, b) => a + b.n, 0), 3);
  let r = R.settleHung(h1.hung, {}, TODAY);
  assert.equal(r.moved, 0, 'not dry on the same day');
  r = R.settleHung(h1.hung, { salvia: 1 }, todayKey(new Date(Date.now() + 86400000)));
  assert.deepEqual(r.dry, { salvia: 1, lavanda: 2, menta: 1 });
  assert.equal(total(r.dry) - 1 + total(h1.pantry), 3);
  assert.deepEqual(r.hung, []);
  assert.equal(BEAM.lent(1).length > 10 && BEAM.lent(3).length > 10, true);
});

test('the sage of mission 3: hers if she has some dried, else Ortica\'s; taking a bunch never goes below zero', () => {
  assert.ok(R.sageOwn({ salvia: 1 }) && !R.sageOwn({}) && !R.sageOwn({ salvia: 0 }));
  assert.deepEqual(R.takeBunch({}, { salvia: 1 }, 'salvia', true), { pantry: {}, dry: {} });
  assert.equal(R.takeBunch({ salvia: 1 }, {}, 'salvia', true), null);
  assert.ok(BUNDLE.turns >= 3);
});

test('the scenes: lines that fit the box, one token only, every mission ends with diary, xp, the bond and the step', () => {
  for (const id of Object.keys(S)) {
    for (const t of texts(id)) {
      assert.ok(t.length <= LIMIT, `${id}: «${t}» is too long`);
      for (const [, k] of t.matchAll(/\{(\w+)\}/g)) assert.equal(k, 'mazzetto', `${id}: unknown token {${k}}`);
    }
    for (const c of [...walk(S[id])].filter((n) => n.choice)) {
      assert.ok(c.choice.length >= 2, `${id}: two answers at least`);
      for (const o of c.choice) assert.ok(o.trait && o.t.length <= 90, `${id}: «${o.t}»`);
    }
  }
  for (const n of [1, 2, 3]) {
    const branch = S[`int.ortica.${n}`].find((x) => x.if)?.then || [];
    const tail = branch.slice(-4);
    assert.deepEqual(tail.map((x) => x.do), ['diary', 'xp', 'bond', 'call'], `int.ortica.${n}`);
    assert.deepEqual(tail[2], { do: 'bond', who: 'ortica', n: 1, why: 'interest' });
    assert.deepEqual([tail[3].name, tail[3].args], ['interests.step', ['ortica', n]]);
  }
  // the start: the request is made before she answers, so the card on the map is something she was told
  const start = S['int.ortica.start'];
  assert.ok(start.findIndex((x) => x.do === 'flag' && x.k === 'int.ortica.offered') < start.findIndex((x) => x.choice));
  // the start differs for one who has had Ortica's garden lessons
  assert.ok(start.some((x) => x.if?.flag === 'garden.lesson.acqua'));
  // each mission tells of the next before it ends (the card says what she was told)
  assert.match(texts('int.ortica.1').join(' '), /mugnaio non scende più le scale/);
  assert.match(texts('int.ortica.2').join(' '), /segatura nell'incenso di Malva/);
  // she is spoken to as a woman, and nobody says doses
  assert.doesNotMatch(Object.keys(S).flatMap(texts).join(' '), /\b\d+\s*(g|grammi|ml|gocce|cucchiaini)\b/);
});

test('the words of the bunch Ortica smells, and of the herb given for an illness', () => {
  assert.equal(R.bunchPhrase('lavanda'), 'questa lavanda è tua');
  assert.equal(R.bunchPhrase('timo'), 'questo timo è tuo');
  assert.equal(R.herbPhrase('melissa', true), 'della melissa secca');
  assert.equal(R.herbPhrase('timo', true), 'del timo secco');
  assert.equal(R.herbPhrase('calendula', false), 'della calendula fresca');
  assert.equal(R.firstBunch({ menta: 1, lavanda: 3 }), 'lavanda');
  assert.equal(R.firstBunch({}), null);
});

// ---- level 1: a herb for an illness ----------------------------------------------------------------------
test('level 1: an answer only for the illness refusals, only from step 1, with a healing herb she has', () => {
  const ill = REFUSALS.filter((r) => r.kind === 'illness').map((r) => r.id).sort();
  assert.deepEqual(Object.keys(HEAL).sort(), ill, 'one answer per illness refusal, and only those');
  for (const [id, H] of Object.entries(HEAL)) {
    assert.match(H.me, /\{herb\}/, id);
    assert.ok(H.me.length <= 140 && H.re.length <= LIMIT && H.back.every((t) => t.length <= LIMIT), id);
    assert.match(H.me, /^Le carte su questo non le guardo/, id);
  }
  const heal = R.herbsFor(MORTAR.intention);
  assert.deepEqual(R.healHerb({ lavanda: 3 }, { rosmarino: 1 }), null, 'no healing herb: no answer');
  assert.deepEqual(R.healHerb({ melissa: 1 }, { timo: 1 }), { herb: 'timo', dry: true }, 'dried first');
  assert.deepEqual(R.healHerb({ melissa: 1 }, {}), { herb: 'melissa', dry: false });
  for (const id of heal.filter((x) => GARDEN[x])) assert.notEqual(HERB[id].risk, 'velenosa');
  // the gate the glue uses
  assert.equal(cond({ interest: ['ortica', 1] }, save({ flags: { 'int.ortica.1': true } })), false);
  assert.equal(cond({ interest: ['ortica', 1] }, save({ flags: { 'int.ortica.1': true, 'int.ortica.2': true } })), true);
  const src = readFileSync(new URL('../src/glue/interests.js', import.meta.url), 'utf8');
  assert.match(src, /test\(\{ interest: \['ortica', 1\] \}\)/);
  // the visitor comes back on a later day, not the same one
  const [due, wait] = R.backDue([{ id: 'ill.figlio', day: YESTERDAY }, { id: 'ill.mucca', day: TODAY }], TODAY);
  assert.deepEqual(due.map((b) => b.id), ['ill.figlio']);
  assert.deepEqual(wait.map((b) => b.id), ['ill.mucca']);
});

// ---- old saves, a save far ahead ----------------------------------------------------------------------------
test('old saves load with the new keys and lose nothing; a save that has ended the game gets the start', () => {
  const old = { started: true, chapter: 2, step: 'c2.mill', pantry: { lavanda: 2 }, flags: { 'garden.given': true }, rite: { n: 6, owned: ['rosa', 'salvia', 'alloro', 'cipresso'], gifts: { salvia: true } } };
  const s = parseSave(JSON.stringify(old));
  assert.deepEqual(s.pantryDry, {});
  assert.deepEqual(s.interests, { day: {}, hung: [], back: [] });
  assert.deepEqual(s.pantry, { lavanda: 2 });
  assert.ok(R.orticaReady(s));
  // damaged values are mended
  const bad = parseSave(JSON.stringify({ started: true, pantryDry: [], interests: { day: 3, hung: 'x' } }));
  assert.deepEqual(bad.pantryDry, {}); assert.deepEqual(bad.interests.day, {}); assert.deepEqual(bad.interests.hung, []); assert.deepEqual(bad.interests.back, []);
  // ENDED: the whole story played, the garden hers, bunches in the pantry
  const ended = parseSave(JSON.stringify({ started: true, chapter: 4, step: 'post.minors', flags: { 'ending.seen': true, 'garden.offer': true, 'garden.given': true, 'lesson.fly': true }, pantry: { salvia: 1, calendula: 2 }, garden: { unlocked: true } }));
  assert.ok(R.orticaReady(ended));
  ended.flags['int.ortica.offered'] = true;
  const shown = extrasShown(ended, cond, LIST).filter((e) => IDS.includes(e.id));
  assert.deepEqual(shown.map((e) => e.id), ['int.ortica.1'], 'one at a time, the first');
  assert.equal(shown[0].status, 'new');
});

// ---- the sage of the rite, «tua» ------------------------------------------------------------------------------
test('the sage: mission 3 gives it as «tua»; who had it after four rites keeps it and it becomes hers; never twice', () => {
  // a player who never had it
  let r = afterMade(freshRite(), 'salvia');
  assert.ok(r.owned.includes('salvia'));
  assert.deepEqual(r.made, { salvia: true });
  assert.deepEqual(planRite(r, Date.now()).made, ['salvia']);
  const met = { bonds: { ortica: 1, edera: 1 } };
  assert.equal(giftDue({ ...r, n: 9 }, met).air, 'mirra', 'the sage gift after four rites does not come again');
  // a player who received it after four rites
  r = afterGift({ ...freshRite(), n: 5 }, 'salvia');
  assert.equal(planRite(r, Date.now()).made.length, 0);
  r = afterMade(r, 'salvia');
  assert.ok(r.owned.includes('salvia') && r.gifts.salvia && r.made.salvia);
  assert.equal(r.owned.filter((a) => a === 'salvia').length, 1);
  // the save keeps it, and an empty or broken one stays as it was
  assert.deepEqual(normRite(JSON.parse(JSON.stringify(r))).made, { salvia: true });
  assert.equal('made' in normRite(freshRite()), false);
  assert.equal('made' in normRite({ made: { salvia: true } }), false, 'not «tua» if not owned');
  // the words in the rite
  assert.equal(TEXT.named(AIRS.salvia, true), "Quest'aria è la tua salvia.");
  assert.equal(TEXT.named(AIRS.cipresso, true), "Quest'aria è il tuo cipresso.");
  assert.equal(TEXT.named(AIRS.salvia), "Quest'aria è la salvia.");
  // the glue gives it at the third mission
  const src = readFileSync(new URL('../src/glue/interests.js', import.meta.url), 'utf8');
  assert.match(src, /afterMade\(normRite\(state\.rite\), 'salvia'\)/);
});
