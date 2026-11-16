// The lessons as missions (flying, the Minors, the reversed cards), the chapter card before the long
// sessions, the special answers added to the scenes and the Reader's two new remarks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { setState, state } from '../src/core/state.js';
import { test as cond } from '../src/core/cond.js';
import { extrasShown, extraStatus } from '../src/core/extras.js';
import { createRunner } from '../src/story/runner.js';
import { SPECIALS } from '../src/story/special.js';
import { SCRIPTS, CAST, LESSON_MISSIONS } from '../src/data/story/index.js';
import { dueOffer } from '../src/data/story/missions.js';
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

test('three lessons: each has its announcing script, its scene, a place that exists and a CAST entry that starts it', () => {
  assert.deepEqual(LESSON_MISSIONS.map((m) => m.id), ['lesson.fly', 'lesson.minors', 'lesson.reversed']);
  const anchors = allAnchors();
  for (const m of LESSON_MISSIONS) {
    assert.ok(Array.isArray(SCRIPTS[m.offer]) && Array.isArray(SCRIPTS[m.script]), `${m.id}: scripts`);
    assert.ok(anchors[m.at], `${m.id}: anchor ${m.at}`);
    assert.ok(/^[^:]{8,24}: (Malva|Ortica|Nonna Edera) mi aspetta .+[.]$/.test(m.text) && m.text.length <= 220, `${m.id}: text`);
    const entry = CAST.find((e) => e.script === m.script);
    assert.ok(entry && entry.at === m.at, `${m.id}: nobody starts ${m.script} at ${m.at}`);
    // the scene is offered before the ordinary talk of the same person, and only while the lesson is open
    const same = CAST.filter((e) => e.id === entry.id);
    if (same.length > 1) assert.ok(CAST.indexOf(entry) < CAST.findIndex((e) => e.id === entry.id && /\.chat$/.test(e.script)), `${m.id}: after the chat`);
    assert.ok(all(m.offer).some((n) => n.do === 'flag' && n.k === m.offered), `${m.id}: the offer does not mark itself`);
    assert.ok(all(m.offer).some((n) => n.do === 'diary'), `${m.id}: the offer leaves no diary line`);
    assert.equal(all(m.script).filter((n) => n.do === 'flag').at(-1).k, m.done.flag, `${m.id}: the scene sets its flag last`);
  }
  assert.ok(HINTS.lesson && HINTS.lesson.length <= 120 && HINTS.fly);
});

test('the flying lesson: outdoors, a place she knows; fear, the first lift, the places her feet know and the map; nothing of the interface', () => {
  const m = LESSON_MISSIONS[0];
  assert.ok(m.at.startsWith('village.') && cond(m.when, { ...state, powers: { broom: true }, flags: {} }));
  const t = texts('fly.lesson');
  for (const w of ['paura', 'i piedi lasciano la terra', 'i tuoi piedi conoscono già', 'quaderno', 'mappa']) assert.ok(t.includes(w), `fly.lesson: ${w}`);
  assert.ok(!/grimorio|tocca|schermo|pulsante/i.test(t), 'fly.lesson: a character explains the interface');
  assert.equal(all('fly.lesson').filter((n) => n.choice).length, 2);
});

test('the Minors: the scene uses the words of the grid and the cards\' own essences; the lesson page shows the whole grid', () => {
  const t = texts('minors.lesson');
  for (const k of ['w', 'c', 's', 'p']) assert.ok(t.includes(SEMI[k].dove), `suit ${k}`);
  for (const n of [11, 12, 13, 14]) assert.ok(t.includes(FIGURE[n].parola), `court ${n}`);
  for (const n of [1, 5, 10, 7, 2]) assert.ok(t.includes(NUMERI[n].idea.split(/[:,]/)[0]), `number ${n}`);
  for (const id of ['c05', 'w01', 'p13']) assert.ok(t.includes(VOICES[id].up.essenza.replace(/\.$/, '')), `worked example ${id}`);
  const page = LESSONS.find((l) => l.id === 'minors');
  assert.equal(page.by, 'ortica');
  const body = page.pages.map((p) => p.body).join('\n');
  for (const k of ['w', 'c', 's', 'p']) for (const f of ['nome', 'dove', 'idea']) assert.ok(body.toLowerCase().includes(SEMI[k][f].toLowerCase()), `page: suit ${k} ${f}`);
  for (let n = 1; n <= 10; n++) assert.ok(body.includes(NUMERI[n].parola), `page: number ${n}`);
  for (const n of [11, 12, 13, 14]) assert.ok(body.includes(FIGURE[n].nome) && body.includes(FIGURE[n].parola), `page: court ${n}`);
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

test('practice questions: three for the Minors, two for the reversed; one right option, three distinct texts taken from the voices', () => {
  const want = { 'minors.lesson': [3, UP], 'reversed.lesson': [2, REV] };
  for (const [id, [n, rightSet]] of Object.entries(want)) {
    const qs = practice(id);
    assert.equal(qs.length, n, `${id}: questions`);
    const where = [];
    for (const node of qs) {
      assert.equal(node.choice.length, 3);
      assert.equal(node.choice.filter((o) => o.ok).length, 1, `${id}: exactly one right option`);
      assert.equal(new Set(node.choice.map((o) => o.t)).size, 3, `${id}: three distinct texts`);
      for (const o of node.choice) {
        assert.ok(o.ok ? rightSet.has(o.t) : UP.has(o.t) || REV.has(o.t), `${id}: "${o.t}" is not a card's essence`);
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
      assert.ok(before.say && /\?|Dimmi/.test(before.t), `${id}: no question before the options`);
      assert.ok(!before.t.includes(node.choice.find((o) => o.ok).t.replace(/\.$/, '')), `${id}: the question shows its answer`);
    }
  }
});

test('playing the scenes sets the flags and the grimoire lessons, whatever she answers', async () => {
  for (const pick of [() => 0, (ts) => ts.length - 1]) {
    setState({ started: true, chapter: 3, step: 'c3.client', powers: { cat: true, broom: true } });
    await play('fly.offer', pick);
    assert.equal(state.flags['fly.offered'], true);
    const fly = await play('fly.lesson', pick);
    assert.equal(state.flags['lesson.fly'], true);
    assert.ok(fly.calls.some(([n, a]) => n === 'world.travel' && a === 'village.garden'));
    await play('minors.offer', pick); await play('minors.lesson', pick);
    assert.equal(state.flags['lesson.minors'], true); assert.equal(state.lessons.minors, true);
    assert.ok(!state.flags['lesson.reversed'] && !state.lessons.reversed);
    await play('reversed.offer', pick); await play('reversed.lesson', pick);
    assert.equal(state.flags['lesson.reversed'], true); assert.equal(state.lessons.reversed, true); // systems/reading.js reads this flag
    assert.equal(state.diary.length, 6);
  }
  // the practice moves no trait, and a right answer gives a little experience
  setState({ started: true, chapter: 3 });
  const right = (id) => { const qs = practice(id); let i = 0; return () => qs[i++].choice.findIndex((o) => o.ok); };
  await play('minors.lesson', right('minors.lesson'));
  assert.equal(state.xp, 25);
  assert.deepEqual(Object.values(state.traits), [0, 0, 0, 0, 0]);
});

test('old saves get the lessons offered, one after the other, each where its mistress can be reached', () => {
  const s = (patch) => { setState({ started: true, ...patch }); return state; };
  assert.equal(dueOffer(s({ chapter: 2, step: 'c2.mill' }), cond), null); // no broom yet
  assert.equal(dueOffer(s({ chapter: 1, step: 'c1.square', powers: { broom: true } }), cond).id, 'lesson.fly'); // the broom came early
  assert.equal(dueOffer(s({ chapter: 4, step: 'post.minors', powers: { broom: true }, flags: { 'ending.seen': true } }), cond).id, 'lesson.fly'); // a finished game
  assert.equal(dueOffer(s({ chapter: 3, powers: { broom: true }, flags: { 'fly.offered': true } }), cond), null); // announced, not done: no second announcement
  const flown = { powers: { broom: true }, flags: { 'fly.offered': true, 'lesson.fly': true } };
  assert.equal(dueOffer(s({ chapter: 1, step: 'c1.gate', ...flown }), cond), null); // Ortica is in the wood: not before chapter 2
  assert.equal(dueOffer(s({ chapter: 2, step: 'c2.ortica', ...flown }), cond), null); // nor before she has received her
  assert.equal(dueOffer(s({ chapter: 2, step: 'c2.mill', ...flown }), cond).id, 'lesson.minors');
  const minors = { powers: { broom: true }, flags: { ...flown.flags, 'minors.offered': true, 'lesson.minors': true } };
  assert.equal(dueOffer(s({ chapter: 2, step: 'c3.trapdoor', ...minors }), cond), null); // Edera is below: chapter 3
  assert.equal(dueOffer(s({ chapter: 3, step: 'c3.edera', ...minors }), cond), null);
  assert.equal(dueOffer(s({ chapter: 3, step: 'c3.client', ...minors }), cond).id, 'lesson.reversed');
  assert.equal(dueOffer(s({ chapter: 4, step: 'post.minors', ...minors }), cond).id, 'lesson.reversed');
  assert.equal(dueOffer(s({ chapter: 4, flags: { ...minors.flags, 'lesson.reversed': true }, powers: { broom: true } }), cond), null);
  // the same entries in the registry: new when available, done from the flag (no stored state needed)
  s({ chapter: 3, step: 'c3.client', powers: { broom: true } });
  assert.deepEqual(extrasShown(state, cond, LESSON_MISSIONS).map((e) => [e.id, e.status]), [['lesson.fly', 'new']]);
  s({ chapter: 3, step: 'c3.client', ...flown });
  assert.deepEqual(extrasShown(state, cond, LESSON_MISSIONS).map((e) => [e.id, e.status]), [['lesson.minors', 'new'], ['lesson.fly', 'done']]);
  assert.equal(extraStatus(LESSON_MISSIONS[2], state, cond), 'hidden');
  // the CAST scene of each lesson is there exactly while it is available and not done
  const open = (script) => cond(CAST.find((e) => e.script === script).when);
  assert.ok(open('minors.lesson') && !open('fly.lesson') && !open('reversed.lesson'));
});

test('the chapter card comes right before the long sessions, with the chapter that opens', () => {
  const before = (script, sid) => { const flat = all(script); const i = flat.findIndex((n) => n.do === 'session' && n.id === sid); return flat[i - 1]; };
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
  assert.deepEqual([...new Set(mine.map(([id]) => id))].sort(), ['c1.venus', 'c3.jail', 'edera.chat', 'enc.child', 'enc.gravedigger', 'f.dawn', 'ortica.chat', 'post.ginepra']);
  const kinds = new Set();
  for (const [id, n] of found) {
    assert.ok(n.choice.filter((o) => !o.special).length >= 2, `${id}: the ordinary options are still there`);
    for (const o of n.choice.filter((x) => x.special)) {
      kinds.add(o.special);
      assert.ok(SPECIALS.includes(o.special) && o.when, `${id}: ${o.t}`);
      assert.ok(/[.!?]$/.test(o.t) && o.t.length <= 100, `${id}: ${o.t}`);
      // the lines she reads after choosing it, on the longest and on the shortest branch
      const count = (nodes, pick) => (nodes || []).reduce((a, x) => a + (x.say ? 1 : 0) + (x.if ? pick(count(x.then, pick), count(x.else, pick)) : 0), 0);
      assert.ok(count(o.then, Math.min) >= 2 && count(o.then, Math.max) <= 3, `${id}: "${o.t}" has ${count(o.then, Math.min)}-${count(o.then, Math.max)} lines of reply`);
    }
  }
  for (const k of ['tartufo', 'magic', 'pop', 'witch', 'broom', 'explore', 'rank']) assert.ok(kinds.has(k), `no special of kind ${k}`);
  // the grate of the cell opens by four different means
  const jail = found.find(([id]) => id === 'c3.jail')[1].choice.filter((o) => o.special).map((o) => o.special);
  assert.deepEqual(jail.sort(), ['magic', 'pop', 'tartufo', 'witch']);
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
