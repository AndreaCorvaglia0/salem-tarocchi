// The lessons as missions (flying, the course on the Minors in five lessons, the reversed cards), the chapter card before the long
// sessions, the special answers added to the scenes and the Reader's two new remarks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { setState, state } from '../src/core/state.js';
import { test as cond } from '../src/core/cond.js';
import { extrasShown, extraStatus, keyPending } from '../src/core/extras.js';
import { createRunner } from '../src/story/runner.js';
import { SPECIALS } from '../src/story/special.js';
import { SCRIPTS, CAST, STEPS, LESSON_MISSIONS } from '../src/data/story/index.js';
import { canAnnounce, dueLesson, minorLessonReady, minorTaught, taughtGroups, lessonOfMinor, minorsFound, oldCourse, THRESHOLDS } from '../src/glue/lessons.rules.js';
import { CHAPTER_CARDS } from '../src/data/story/chapters.js';
import { OPENERS } from '../src/data/story/visits.js';
import { HINTS } from '../src/data/story/hints.js';
import { LESSONS } from '../src/data/lessons.js';
import { SEMI, NUMERI, FIGURE } from '../src/data/reading/grid.js';
import { allAnchors } from '../src/world/maps.js';

const VOICES = {};
for (const f of readdirSync(new URL('../src/data/reading/voices/', import.meta.url)).filter((x) => /^[a-z]\d\d\.js$/.test(x))) {
  const v = (await import(`../src/data/reading/voices/${f}`)).default;
  VOICES[v.id] = v;
}
const UP = new Set(Object.values(VOICES).map((v) => v.up.essenza));
const REV = new Set(Object.values(VOICES).map((v) => v.rev.essenza));

function* walk(nodes) {
  for (const n of nodes || []) {
    yield n;
    if (n.choice) for (const o of n.choice) yield* walk(o.then);
    if (n.then) yield* walk(n.then);
    if (n.else) yield* walk(n.else);
  }
}
const all = (id) => [...walk(SCRIPTS[id])];
const texts = (id) => all(id).filter((n) => n.t).map((n) => n.t).join(' ');
const practice = (id) => all(id).filter((n) => n.choice && n.choice.some((o) => o.ok));

// plays a script with the real runner; `pick(texts, node)` chooses
async function play(id, pick = () => 0) {
  const calls = [], said = [];
  const ui = { say: async (who, t) => { said.push(t); }, choose: async (ts) => pick(ts), cinema: async () => {}, moment: async (t) => { said.push(t); }, sleep: async () => {}, end: async () => {} };
  const r = createRunner({ ui, call: async (name, ...a) => { calls.push([name, ...a]); }, getScript: (k) => SCRIPTS[k], warn: (...a) => { throw new Error(a.join(' ')); } });
  await r.run(id);
  return { calls, said };
}

const MINORS = [1, 2, 3, 4, 5].map((n) => `minors.${n}.lesson`);

test('seven lessons in order: each has its announcing script, its scene, a place that exists and a CAST entry that starts it', () => {
  assert.deepEqual(LESSON_MISSIONS.map((m) => m.id), ['lesson.fly', 'lesson.minors.1', 'lesson.minors.2', 'lesson.minors.3', 'lesson.minors.4', 'lesson.minors.5', 'lesson.reversed']);
  const anchors = allAnchors();
  for (const m of LESSON_MISSIONS) {
    assert.ok(Array.isArray(SCRIPTS[m.offer]) && Array.isArray(SCRIPTS[m.script]), `${m.id}: scripts`);
    assert.ok(anchors[m.at], `${m.id}: anchor ${m.at}`);
    assert.ok(/^[^:]{8,24}: .+[.]$/.test(m.text) && m.text.length <= 220, `${m.id}: text`);
    const entry = CAST.find((e) => e.script === m.script);
    assert.ok(entry && entry.at === m.at, `${m.id}: nobody starts ${m.script} at ${m.at}`);
    // the scene comes before the ordinary talk of the same person, and only once announced and until done
    const chat = CAST.findIndex((e) => e.id === entry.id && /\.chat$/.test(e.script));
    if (chat >= 0) assert.ok(CAST.indexOf(entry) < chat, `${m.id}: after the chat`);
    setState({ started: true, chapter: 3, flags: { [m.offered]: true } }); assert.ok(cond(entry.when), `${m.id}: not open once announced`);
    setState({ started: true, chapter: 3, flags: { [m.offered]: true, [m.done.flag]: true } }); assert.ok(!cond(entry.when), `${m.id}: still open when done`);
    setState({ started: true, chapter: 3 }); assert.ok(!cond(entry.when), `${m.id}: open before the announcement`);
    assert.equal(all(m.offer).filter((n) => n.do === 'flag').at(-1).k, m.offered, `${m.id}: the offer does not mark itself`);
    assert.ok(all(m.offer).some((n) => n.do === 'diary'), `${m.id}: the offer leaves no diary line`);
    const flags = all(m.script).filter((n) => n.do === 'flag').map((n) => n.k);
    assert.ok(flags.includes(m.done.flag), `${m.id}: the scene does not set its flag`);
  }
  // the last lesson of the course also sets the flag of the whole course
  assert.deepEqual(all('minors.5.lesson').filter((n) => n.do === 'flag').map((n) => n.k), ['lesson.minors.5', 'lesson.minors']);
  assert.ok(HINTS.lesson && HINTS.lesson.length <= 120 && HINTS.fly);
});

test('the flying lesson: outdoors, a place she knows; fear, the first lift, the places her feet know and the map; nothing of the interface', () => {
  const m = LESSON_MISSIONS[0];
  assert.ok(m.at.startsWith('village.') && cond(m.ready, { ...state, powers: { broom: true }, flags: {} }));
  const t = texts('fly.lesson');
  for (const w of ['paura', 'i piedi lasciano la terra', 'i tuoi piedi conoscono già', 'quaderno', 'mappa']) assert.ok(t.includes(w), `fly.lesson: ${w}`);
  assert.ok(!/grimorio|tocca|schermo|pulsante/i.test(t), 'fly.lesson: a character explains the interface');
  assert.equal(all('fly.lesson').filter((n) => n.choice).length, 2);
});

test('the course on the Minors: five lessons, each with the words of its part of the grid, two worked examples from the voices and a grimoire lesson', () => {
  const q = (id) => VOICES[id].up.essenza.replace(/\.$/, '');
  const head = (n) => NUMERI[n].idea.split(/[:,]/)[0];
  const want = {
    1: { by: 'ortica', words: ['w', 'c', 's', 'p'].flatMap((k) => [SEMI[k].dove, SEMI[k].elemento]), examples: ['c01', 'p01'] },
    2: { by: 'ginepra', words: [1, 2, 3].map((n) => NUMERI[n].parola), examples: ['w01', 'p03'] },
    3: { by: 'malva', words: [4, 5, 6].map((n) => NUMERI[n].parola), examples: ['s04', 'c05'] },
    4: { by: 'ortica', words: [7, 8, 9, 10].map(head), examples: ['p07', 'w08'] },
    5: { by: 'edera', words: [11, 12, 13, 14].map((n) => FIGURE[n].parola), examples: ['c11', 's14'] },
  };
  for (const [n, x] of Object.entries(want)) {
    const t = texts(`minors.${n}.lesson`);
    for (const w of x.words) assert.ok(t.includes(w), `lesson ${n}: "${w}"`);
    for (const id of x.examples) assert.ok(t.includes(q(id)), `lesson ${n}: worked example ${id}`);
    assert.ok(all(`minors.${n}.lesson`).some((k) => k.do === 'lesson' && k.id === `minors${n}`), `lesson ${n}: no grimoire page`);
    const page = LESSONS.find((l) => l.id === `minors${n}`);
    assert.equal(page.by, x.by);
    const body = page.pages.map((p) => p.body).join('\n');
    const grid = n === '1' ? ['w', 'c', 's', 'p'].flatMap((k) => [SEMI[k].nome, SEMI[k].dove, SEMI[k].idea]) : n === '5' ? [11, 12, 13, 14].flatMap((k) => [FIGURE[k].nome, FIGURE[k].parola]) : { 2: [1, 2, 3], 3: [4, 5, 6], 4: [7, 8, 9, 10] }[n].flatMap((k) => [NUMERI[k].parola, head(k)]);
    for (const w of grid) assert.ok(body.toLowerCase().includes(w.toLowerCase()), `page ${n}: "${w}"`);
    // short: a scene of a few lines, not a lecture
    const lines = all(`minors.${n}.lesson`).filter((k) => k.say).length;
    assert.ok(lines <= 40, `lesson ${n}: ${lines} lines`);
  }
  // lesson 2 has two stagings (Ginepra there, or the notebook she left), with the same questions
  const two = SCRIPTS['minors.2.lesson'][0];
  const opts = (nodes) => nodes.filter((k) => k.choice).map((k) => k.choice.map((o) => [o.t, !!o.ok]));
  assert.deepEqual(opts(two.then), opts(two.else));
  assert.ok(two.then.some((k) => k.say === 'ginepra') && !two.else.some((k) => k.say === 'ginepra'));
});

test('the reversed cards: never "the opposite"; two worked examples from the voices; the lesson page', () => {
  const t = texts('reversed.lesson');
  assert.ok(t.includes('il contrario') && t.includes('non è così'));
  for (const w of ['trattenuta', 'in ritardo', 'chiusa dentro', 'troppa']) assert.ok(t.includes(w), w);
  const q = (s) => s.replace(/\.$/, '');
  // a hard card whose reverse is a relief, a happy card whose reverse is the difficulty of enjoying it
  assert.ok(VOICES.m15.up.favore < 0 && VOICES.m15.rev.favore > 0 && VOICES.m19.up.favore > 0 && VOICES.m19.rev.favore <= 0);
  for (const id of ['m15', 'm19']) assert.ok(t.includes(q(VOICES[id].up.essenza)) && t.includes(q(VOICES[id].rev.essenza)), id);
  const page = LESSONS.find((l) => l.id === 'reversed');
  assert.equal(page.by, 'edera');
  assert.ok(page.pages.map((p) => p.body).join(' ').includes('non dice il contrario'));
});

test('practice questions: two in each lesson of the course and in the reversed; one right option, three distinct texts from the voices or the grid', () => {
  const GRID = new Set(['w', 'c', 's', 'p'].flatMap((k) => [`${SEMI[k].idea.charAt(0).toUpperCase()}${SEMI[k].idea.slice(1)}.`, `Di ${SEMI[k].nome}, perché riguarda ${SEMI[k].dove}.`]));
  const want = { 'minors.1.lesson': [2, GRID], 'minors.2.lesson': [4, UP], 'minors.3.lesson': [2, UP], 'minors.4.lesson': [2, UP], 'minors.5.lesson': [2, UP], 'reversed.lesson': [2, REV] };
  for (const [id, [n, rightSet]] of Object.entries(want)) {
    const qs = practice(id);
    assert.equal(qs.length, n, `${id}: questions`);
    const where = [];
    for (const node of qs) {
      assert.equal(node.choice.length, 3);
      assert.equal(node.choice.filter((o) => o.ok).length, 1, `${id}: exactly one right option`);
      assert.equal(new Set(node.choice.map((o) => o.t)).size, 3, `${id}: three distinct texts`);
      for (const o of node.choice) {
        assert.ok(o.ok ? rightSet.has(o.t) : rightSet.has(o.t) || UP.has(o.t) || REV.has(o.t), `${id}: "${o.t}" is not a card's essence or a line of the grid`);
        assert.ok(!o.when && !o.special && !o.trait, `${id}: a practice option is plain`);
        const reply = o.then.filter((x) => x.say);
        assert.equal(reply.length, 1, `${id}: one reply`);
        assert.equal(o.then.some((x) => x.do === 'xp'), !!o.ok, `${id}: only the right answer is rewarded`);
      }
      assert.equal(new Set(node.choice.map((o) => o.then[0].t)).size, 3, `${id}: each option has its own reply`);
      where.push(node.choice.findIndex((o) => o.ok));
    }
    assert.ok(new Set(where).size > 1, `${id}: the right answer is always in the same place`);
    // the line before each question asks it, and never contains the right answer
    const flat = all(id);
    for (const node of qs) {
      const before = flat[flat.indexOf(node) - 1];
      assert.ok(before.say && /\?/.test(before.t), `${id}: no question before the options`);
      assert.ok(!before.t.includes(node.choice.find((o) => o.ok).t.replace(/\.$/, '')), `${id}: the question shows its answer`);
    }
  }
});

test('playing the scenes sets the flags and the grimoire lessons, whatever she answers and wherever Ginepra is', async () => {
  for (const [pick, flags] of [[() => 0, {}], [(ts) => ts.length - 1, { 'ginepra.taken': true }]]) {
    setState({ started: true, chapter: 3, step: 'c3.client', powers: { cat: true, broom: true }, flags });
    await play('fly.offer', pick);
    assert.equal(state.flags['fly.offered'], true);
    const fly = await play('fly.lesson', pick);
    assert.equal(state.flags['lesson.fly'], true);
    assert.ok(fly.calls.some(([n, a]) => n === 'world.travel' && a === 'village.garden'));
    for (const n of [1, 2, 3, 4, 5]) {
      assert.ok(!state.flags['lesson.minors'], 'the course is done only after the fifth lesson');
      await play(`minors.${n}.offer`, pick);
      assert.equal(state.flags[`minors.${n}.offered`], true);
      const r = await play(`minors.${n}.lesson`, pick);
      assert.equal(state.flags[`lesson.minors.${n}`], true); assert.equal(state.lessons[`minors${n}`], true);
      if (n === 2) assert.equal(r.said.some((t) => t.includes('quadernetto')), !!flags['ginepra.taken']);
    }
    assert.equal(state.flags['lesson.minors'], true);
    assert.ok(!state.flags['lesson.reversed'] && !state.lessons.reversed);
    await play('reversed.offer', pick); await play('reversed.lesson', pick);
    assert.equal(state.flags['lesson.reversed'], true); assert.equal(state.lessons.reversed, true); // systems/reading.js reads this flag
    assert.equal(state.diary.length, 14);
  }
  // the practice moves no trait, and a right answer gives a little experience
  setState({ started: true, chapter: 3 });
  const right = (id) => { const qs = practice(id).slice(0, 2); let i = 0; return () => qs[i++].choice.findIndex((o) => o.ok); };
  await play('minors.3.lesson', right('minors.3.lesson'));
  assert.equal(state.xp, 20);
  assert.deepEqual(Object.values(state.traits), [0, 0, 0, 0, 0]);
});

const found = (...ids) => Object.fromEntries(ids.map((id) => [id, { found: true }]));
// n Minors of the court of Coppe and Denari first, so that the count alone can be tested without the number groups
const someMinors = (n, pool) => found(...pool.slice(0, n));
const done = (...ns) => ({ 'fly.offered': true, 'lesson.fly': true, ...Object.fromEntries(ns.flatMap((n) => [[`minors.${n}.offered`, true], [`lesson.minors.${n}`, true]])) });

test('when each lesson of the course is ready: the one before done, and enough small cards or one of its own', () => {
  assert.deepEqual(THRESHOLDS, { 2: 3, 3: 6, 4: 10, 5: 14 });
  assert.equal(lessonOfMinor('w01'), 2); assert.equal(lessonOfMinor('c06'), 3); assert.equal(lessonOfMinor('s07'), 4); assert.equal(lessonOfMinor('p10'), 4);
  assert.equal(lessonOfMinor('p11'), 5); assert.equal(lessonOfMinor('c14'), 5); assert.equal(lessonOfMinor('m07'), null);
  assert.deepEqual(minorsFound({ ...found('w01', 'm03'), c02: { found: false } }), ['w01']);
  assert.equal(minorLessonReady(1, { flags: {} }), false);
  assert.equal(minorLessonReady(1, { flags: { 'lesson.fly': true } }), true); // the suits need no card
  const f1 = done(1);
  assert.equal(minorLessonReady(2, { flags: f1, cards: {} }), false);
  assert.equal(minorLessonReady(2, { flags: f1, cards: found('c12', 'c13') }), false); // two court cards: not her numbers, not enough
  assert.equal(minorLessonReady(2, { flags: f1, cards: found('c12', 'c13', 'p14') }), true); // three small cards
  assert.equal(minorLessonReady(2, { flags: f1, cards: found('s02') }), true); // a Two: its lesson at once
  assert.equal(minorLessonReady(2, { flags: done(), cards: found('s02') }), false); // not before the suits
  // a Seven before lesson 4: ready as soon as lesson 3 is done, and not before
  assert.equal(minorLessonReady(4, { flags: done(1, 2), cards: found('p07') }), false);
  assert.equal(minorLessonReady(4, { flags: done(1, 2, 3), cards: found('p07') }), true);
  assert.equal(minorLessonReady(4, { flags: done(1, 2, 3), cards: found('w01', 'w02', 'w03', 'w04', 'w05', 'w06', 'c01', 'c02', 'c03') }), false); // nine low cards
  assert.equal(minorLessonReady(4, { flags: done(1, 2, 3), cards: found('w01', 'w02', 'w03', 'w04', 'w05', 'w06', 'c01', 'c02', 'c03', 'c04') }), true); // ten
  assert.equal(minorLessonReady(5, { flags: done(1, 2, 3, 4), cards: found('c11') }), true);
});

test('the order of the offers: a new player, 0 / 4 / 9 / 20 small cards, an old save past the ending; never two at once', () => {
  const s = (patch) => { setState({ started: true, ...patch }); return state; };
  const due = (patch) => dueLesson(s(patch), cond)?.id || null;
  const LOW = ['w01', 'w02', 'w03', 'c01', 'c02', 'c03', 'w04', 'w05', 'w06', 'c04', 'c05', 'c06', 'w07', 'w08', 'w09', 'w10', 'c07', 'c08', 'c09', 'c10', 'p11', 'p12'];
  // a new player: nothing until the broom; then the flying lesson, also in chapter 1 and after the ending
  assert.equal(due({ chapter: 1, step: 'c1.cart' }), null);
  assert.equal(due({ chapter: 2, step: 'c2.mill', cards: someMinors(20, LOW) }), null); // small cards alone start nothing
  assert.equal(due({ chapter: 1, step: 'c1.square', powers: { broom: true } }), 'lesson.fly');
  assert.equal(due({ chapter: 3, powers: { broom: true }, flags: { 'fly.offered': true } }), null); // announced, not done: nothing else
  // the suits: after the flying lesson, when Ortica can be reached and has received her
  assert.equal(due({ chapter: 1, step: 'c1.gate', flags: done() }), null);
  assert.equal(due({ chapter: 2, step: 'c2.ortica', flags: done() }), null);
  assert.equal(due({ chapter: 2, step: 'c2.mill', flags: done() }), 'lesson.minors.1'); // with 0 small cards
  // 0 small cards after the suits: she waits until she finds some
  assert.equal(due({ chapter: 2, step: 'c2.mill', flags: done(1) }), null);
  // 4 small cards: lesson 2; after it lesson 3 only if one of the four is a Four, a Five or a Six
  assert.equal(due({ chapter: 2, step: 'c2.mill', flags: done(1), cards: someMinors(4, LOW) }), 'lesson.minors.2');
  assert.equal(due({ chapter: 2, step: 'c2.mill', flags: done(1, 2), cards: found('w01', 'w02', 'w03', 'c01') }), null);
  assert.equal(due({ chapter: 2, step: 'c2.mill', flags: done(1, 2), cards: found('w01', 'w02', 'w03', 'c05') }), 'lesson.minors.3');
  // 9 small cards: lessons 2 and 3 one after the other, then lesson 4 waits for the tenth or for a high card
  const nine = someMinors(9, LOW);
  assert.equal(due({ chapter: 2, step: 'c2.fire', flags: done(1), cards: nine }), 'lesson.minors.2');
  assert.equal(due({ chapter: 2, step: 'c2.fire', flags: { ...done(1), 'minors.2.offered': true }, cards: nine }), null); // one at a time
  assert.equal(due({ chapter: 2, step: 'c2.fire', flags: done(1, 2), cards: nine }), 'lesson.minors.3');
  assert.equal(due({ chapter: 2, step: 'c2.fire', flags: done(1, 2, 3), cards: nine }), null);
  assert.equal(due({ chapter: 2, step: 'c2.fire', flags: done(1, 2, 3), cards: { ...nine, ...found('s09') } }), 'lesson.minors.4');
  // 20 small cards: all of them in a row; the court waits for the cellars, the reversed cards for the whole course
  const twenty = someMinors(20, LOW);
  for (const [n, flags] of [[1, done()], [2, done(1)], [3, done(1, 2)], [4, done(1, 2, 3)]]) assert.equal(due({ chapter: 2, step: 'c2.fire', flags, cards: twenty }), `lesson.minors.${n}`);
  assert.equal(due({ chapter: 2, step: 'c3.trapdoor', flags: done(1, 2, 3, 4), cards: twenty }), null);
  assert.equal(due({ chapter: 3, step: 'c3.edera', flags: done(1, 2, 3, 4), cards: twenty }), null);
  assert.equal(due({ chapter: 3, step: 'c3.client', flags: done(1, 2, 3, 4), cards: twenty }), 'lesson.minors.5');
  assert.equal(due({ chapter: 3, step: 'c3.client', flags: { ...done(1, 2, 3, 4, 5), 'lesson.minors': true }, cards: twenty }), 'lesson.reversed');
  // the reversed cards hang from the first lesson only: with no small card, in the cellars, they come without waiting for the course
  assert.equal(due({ chapter: 3, step: 'c3.client', flags: done(1) }), 'lesson.reversed');
  assert.equal(due({ chapter: 2, step: 'c2.fire', flags: done(1) }), null); // Edera cannot be reached yet
  assert.equal(due({ chapter: 3, step: 'c3.client', flags: done() }), 'lesson.minors.1'); // not before the suits
  // a player at level 5 in chapter 2 who never had the flying lesson: nothing until the broom, then it first, then the rest one at a time
  const five = { chapter: 2, step: 'c2.fire', xp: 345, cards: someMinors(6, LOW) };
  assert.equal(due(five), null);
  assert.equal(due({ ...five, powers: { broom: true } }), 'lesson.fly');
  assert.equal(due({ ...five, powers: { broom: true }, flags: done() }), 'lesson.minors.1');
  assert.equal(due({ ...five, powers: { broom: true }, flags: done(1) }), 'lesson.minors.2');
  assert.equal(due({ ...five, powers: { broom: true }, flags: done(1, 2) }), 'lesson.minors.3');
  assert.equal(due({ ...five, powers: { broom: true }, flags: done(1, 2, 3) }), null); // six low cards: lesson 4 waits
  // an old save past the ending, nothing of this seen: the whole chain, one lesson after the other
  const old = { chapter: 4, step: 'post.minors', powers: { broom: true }, cards: someMinors(22, LOW) };
  const order = [];
  let flags = { 'ending.seen': true, 'ginepra.taken': true, 'trial.won': true };
  for (let i = 0; i < 9; i++) {
    const m = dueLesson(s({ ...old, flags }), cond);
    if (!m) break;
    order.push(m.id);
    assert.equal(dueLesson(s({ ...old, flags: { ...flags, [m.offered]: true } }), cond), null, `${m.id}: a second offer while it waits`);
    flags = { ...flags, [m.offered]: true, [m.done.flag]: true, ...(m.id === 'lesson.minors.5' ? { 'lesson.minors': true } : {}) };
  }
  assert.deepEqual(order, LESSON_MISSIONS.map((m) => m.id));
  // one chain in the registry: fly -> 1 -> 2 -> 3 -> 4 -> 5, the reversed cards after 1; two keys
  assert.deepEqual(LESSON_MISSIONS.map((m) => m.after || []), [[], ['lesson.fly'], ['lesson.minors.1'], ['lesson.minors.2'], ['lesson.minors.3'], ['lesson.minors.4'], ['lesson.minors.1']]);
  assert.deepEqual(LESSON_MISSIONS.filter((m) => m.key).map((m) => m.id), ['lesson.fly', 'lesson.minors.1']);
  s({ chapter: 4, step: 'post.minors', powers: { broom: true }, flags: { 'ending.seen': true } });
  assert.deepEqual(keyPending(state, cond, LESSON_MISSIONS).map((e) => e.id), ['lesson.fly']); // the second key waits for the first
  assert.deepEqual(extrasShown(state, cond, LESSON_MISSIONS).map((e) => e.id), ['lesson.fly']); // an old save sees one link, not seven
  s({ chapter: 4, step: 'post.minors', powers: { broom: true }, flags: { 'ending.seen': true, ...done() } });
  assert.deepEqual(keyPending(state, cond, LESSON_MISSIONS).map((e) => e.id), ['lesson.minors.1']);
  // the registry lists a lesson of the course once it is announced, and as done from its flag
  s({ chapter: 3, step: 'c3.client', powers: { broom: true }, flags: { ...done(1), 'minors.2.offered': true } });
  assert.deepEqual(extrasShown(state, cond, LESSON_MISSIONS).map((e) => [e.id, e.status]), [['lesson.minors.2', 'new'], ['lesson.fly', 'done'], ['lesson.minors.1', 'done']]);
  assert.equal(extraStatus(LESSON_MISSIONS[3], state, cond), 'hidden');
});

test('what she has been taught, for the reading screens; a save that did the course as one lesson', () => {
  assert.deepEqual(taughtGroups({}), { suits: false, numbers: [], court: false, lessons: [] });
  assert.deepEqual(taughtGroups(done(1, 3)), { suits: true, numbers: [4, 5, 6], court: false, lessons: [1, 3] });
  assert.equal(minorTaught('m07', {}), true); // not a Minor: as before
  assert.equal(minorTaught('c05', {}), false);
  assert.equal(minorTaught('c05', done(1)), false); // the suit alone is not enough
  assert.equal(minorTaught('c02', done(1, 2)), true);
  assert.equal(minorTaught('c05', done(1, 2)), false);
  assert.equal(minorTaught('c05', done(1, 2, 3)), true);
  assert.equal(minorTaught('s09', done(1, 2, 3)), false); assert.equal(minorTaught('s09', done(1, 2, 3, 4)), true);
  assert.equal(minorTaught('p13', done(1, 2, 3, 4)), false); assert.equal(minorTaught('p13', done(1, 2, 3, 4, 5)), true);
  const all5 = taughtGroups({ 'lesson.minors': true });
  assert.ok(all5.suits && all5.court && all5.numbers.length === 10 && minorTaught('w14', { 'lesson.minors': true }));
  // the first version taught the Minors in one lesson (flag lesson.minors): the five count as done
  assert.deepEqual(oldCourse({ flags: { 'lesson.minors': true }, lessons: { minors: true } }), { flags: [1, 2, 3, 4, 5].map((n) => `lesson.minors.${n}`), lessons: [1, 2, 3, 4, 5].map((n) => `minors${n}`) });
  assert.deepEqual(oldCourse({ flags: done(1, 2) }), { flags: [], lessons: [] });
  setState({ started: true, chapter: 4, powers: { broom: true }, flags: { 'lesson.fly': true, 'fly.offered': true, 'lesson.minors': true, 'minors.offered': true, 'ending.seen': true } });
  for (const k of oldCourse(state).flags) state.flags[k] = true;
  assert.equal(dueLesson(state, cond).id, 'lesson.reversed');
});

test('the chapter card comes right before the long sessions, with the chapter that opens', () => {
  const before = (script, sid) => { const flat = all(script); const i = flat.findIndex((n) => n.do === 'session' && n.id === sid); return flat[i - 1]; };
  // card 1 comes before the prologue session, which main.js starts
  assert.ok(/await call\('story\.chapterCard', 1\);[^\n]*\n\s*await call\('story\.session', 's0'\);/.test(readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')));
  assert.ok(CHAPTER_CARDS[1].line);
  for (const [script, sid, n] of [['c1.gate', 's1', 2], ['c2.arrest', 's2', 3], ['f.last', 's4', 4]]) {
    const node = before(script, sid);
    assert.deepEqual([node.do, node.name, node.args], ['call', 'story.chapterCard', [n]], `${script}: no card before ${sid}`);
    const c = CHAPTER_CARDS[n];
    assert.ok(c.title && c.name && /[.]$/.test(c.line));
  }
});

test('special answers: at least eight choices over chapters 1-3 and after, each with its condition and two or three lines of reply', () => {
  const found = [];
  for (const [id, script] of Object.entries(SCRIPTS)) for (const n of walk(script)) if (n.choice && n.choice.some((o) => o.special)) found.push([id, n]);
  const mine = found.filter(([id]) => id !== 'malva.chat');
  assert.ok(mine.length >= 8, `choices with specials: ${mine.length}`);
  for (const id of ['c1.venus', 'c3.jail', 'edera.chat', 'enc.child', 'enc.gravedigger', 'f.dawn', 'ortica.chat', 'post.ginepra']) assert.ok(mine.some(([k]) => k === id), `${id}: no special`); // others may add more
  const kinds = new Set();
  // the fifteen written with the lessons (how their texts begin)
  const MINE = ['Faccio un cenno a Tartufo', 'Ci passo sopra la fiammella', 'Gli accendo una fiammella', 'Gli faccio accarezzare Tartufo', 'Lascio che Tartufo gli si strusci', 'Dall\'alto ho visto il bosco', 'Stavolta siediti tu', 'Chiedo ai cardini',
    'Mando Tartufo a prendere le chiavi', 'Fischio piano verso la scala', 'Busso piano alla porta del carceriere', 'Ti lascio Tartufo sulle ginocchia', 'Ho girato tutte le cantine', 'Facciamo a gara in volo', 'Ti porto io dove cercare', 'Ti dico quello che Malva'];
  let seen = 0;
  for (const [id, n] of found) {
    assert.ok(n.choice.filter((o) => !o.special).length >= 2, `${id}: the ordinary options are still there`);
    for (const o of n.choice.filter((x) => x.special)) {
      kinds.add(o.special);
      assert.ok(SPECIALS.includes(o.special) && o.when, `${id}: ${o.t}`);
      assert.ok(/[.!?»]$/.test(o.t), `${id}: ${o.t}`);
      // the lines she reads after choosing it, on the longest and on the shortest branch
      const count = (nodes, pick) => (nodes || []).reduce((a, x) => a + (x.say ? 1 : 0) + (x.if ? pick(count(x.then, pick), count(x.else, pick)) : 0), 0);
      if (MINE.some((t) => o.t.startsWith(t))) { seen += 1; assert.ok(count(o.then, Math.min) >= 2 && count(o.then, Math.max) <= 3, `${id}: "${o.t}" has ${count(o.then, Math.min)}-${count(o.then, Math.max)} lines of reply`); }
    }
  }
  assert.ok(seen >= 15, `my specials found: ${seen}`);
  for (const k of ['tartufo', 'magic', 'pop', 'witch', 'broom', 'explore', 'rank']) assert.ok(kinds.has(k), `no special of kind ${k}`);
  // the grate of the cell opens by four different means
  const jail = found.find(([id]) => id === 'c3.jail')[1].choice.filter((o) => o.special).map((o) => o.special);
  for (const k of ['magic', 'pop', 'tartufo', 'witch']) assert.ok(jail.includes(k), `the cell: ${k}`);
});

test('the Reader remarks once on a close Tartufo and on a name that goes round', () => {
  for (const key of ['tartufo', 'pop']) {
    const o = OPENERS.find((x) => JSON.stringify(x.when).includes(`"${key}"`));
    assert.ok(o && o.then.some((n) => n.do === 'flag' && n.k === `rd.${key}`), key);
    setState({ started: true, chapter: 2, [key]: 100 });
    assert.ok(cond(o.when));
    setState({ started: true, chapter: 2 });
    assert.ok(!cond(o.when));
  }
});

// The main story always wins: found by the bot at step c3.edera, where the announcement of a lesson came up
// in front of Edera and she could not be talked to until it was tapped away.
test('a lesson never takes the place of a main-story talk: at every main step, whatever the lesson flags, the same entry starts there', () => {
  // who is shown at an anchor: the first matching CAST entry per id (world/scene/things.js castHere)
  const shown = (at) => { const out = new Map(); for (const e of CAST) if (e.at === at && !out.has(e.id) && cond(e.when)) out.set(e.id, e.script); return out; };
  const lessonScripts = new Set(LESSON_MISSIONS.map((m) => m.script));
  let checked = 0;
  for (const step of STEPS.filter((x) => x.at)) {
    const base = { started: true, chapter: step.chapter, step: step.id, powers: { cat: true, broom: true } };
    setState(base);
    const main = [...shown(step.at)].filter(([, script]) => !lessonScripts.has(script));
    // every lesson: not announced / announced / done (3^7 states)
    const n = LESSON_MISSIONS.length;
    for (let k = 0; k < 3 ** n; k++) {
      const flags = {};
      LESSON_MISSIONS.forEach((m, i) => { const v = Math.floor(k / 3 ** i) % 3; if (v >= 1) flags[m.offered] = true; if (v === 2) { flags[m.done.flag] = true; if (m.id === 'lesson.minors.5') flags['lesson.minors'] = true; } });
      setState({ ...base, flags });
      const now = shown(step.at);
      for (const [id, script] of main) assert.equal(now.get(id), script, `step ${step.id}: at ${step.at} "${id}" starts ${now.get(id)} instead of ${script} with ${Object.keys(flags).join(', ')}`);
      // and no announcement comes up while she stands there
      assert.equal(canAnnounce({ near: step.at, stepAt: step.at, flags }), false);
      checked += 1;
    }
  }
  assert.ok(checked > 50000);
  // the steps where a lesson's teacher also has story business: the story's own script is the one shown
  setState({ started: true, chapter: 3, step: 'c3.edera', powers: { broom: true }, flags: { 'minors.5.offered': true, 'reversed.offered': true } });
  assert.equal(shown('depths.edera_nook').get('edera'), 'c3.edera');
  setState({ started: true, chapter: 2, step: 'c2.ortica', powers: { broom: true }, flags: { 'minors.1.offered': true, 'minors.4.offered': true } });
  assert.equal(shown('forest.ortica_hut').get('ortica'), 'c2.ortica');
  // elsewhere an announcement may come, except at the place of a lesson that is waiting for her
  assert.equal(canAnnounce({ near: 'forest.pond', stepAt: 'depths.edera_nook', flags: {} }), true);
  assert.equal(canAnnounce({ near: null, stepAt: 'depths.edera_nook' }), true);
  // nor a few steps away from the place of the step: she is walking up to the person
  const A = allAnchors(), nook = A['depths.edera_nook'];
  assert.equal(canAnnounce({ pos: { map: 'depths', x: nook.x - 5, y: nook.y }, anchors: A, stepAt: 'depths.edera_nook' }), false);
  assert.equal(canAnnounce({ pos: { map: 'depths', x: nook.x - 12, y: nook.y }, anchors: A, stepAt: 'depths.edera_nook' }), true);
  assert.equal(canAnnounce({ pos: { map: 'village', x: nook.x, y: nook.y }, anchors: A, stepAt: 'depths.edera_nook' }), true);
  assert.equal(canAnnounce({ near: 'village.malva_door', stepAt: 'forest.mill', flags: { 'fly.offered': true } }), false);
  assert.equal(canAnnounce({ near: 'village.malva_door', stepAt: 'forest.mill', flags: { 'fly.offered': true, 'lesson.fly': true } }), true);
});
