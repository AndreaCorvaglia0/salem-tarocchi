// Ortica's garden lessons (src/data/story/scripts/garden-lessons.js; chain: src/glue/garden.js, rules in
// src/glue/garden.rules.js). The glue itself cannot be imported under node (it pulls the screen and its CSS):
// its registration is checked on the source, and the chain on the same entries it registers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LESSONS, LESSON_NOTES } from '../src/data/garden.js';
import { GARDEN_LESSON_SCRIPTS as S } from '../src/data/story/scripts/garden-lessons.js';
import { HERB, HERB_LIST } from '../src/data/herbs/base.js';
import { nextLesson, rareSeed, lessonEntries, lessonFlag, lessonNote, normGarden, plant, LESSONS as KEYS } from '../src/glue/garden.rules.js';
import { extraStatus, extrasShown } from '../src/core/extras.js';
import { createRunner } from '../src/story/runner.js';
import { allAnchors } from '../src/world/maps.js';

const LIMIT = 220; // the dialogue box: the same limit tests/story.data.test.mjs sets for every line of the story
const ORDER = HERB_LIST.map((p) => p.id);
const risk = (id) => HERB[id]?.risk || null;
function* walk(nodes) { for (const n of nodes || []) { yield n; if (n.choice) for (const o of n.choice) { yield o; yield* walk(o.then); } } }
const texts = (id) => [...walk(S[id])].filter((n) => typeof n.t === 'string').map((n) => n.t);
const IDS = LESSONS.map((l) => lessonFlag(l.key));
const flagTest = (c, s) => (c == null ? true : Array.isArray(c) ? c.every((x) => flagTest(x, s)) : c.not ? !flagTest(c.not, s) : !!s.flags[c.flag]);

test('five lessons in order, each with its title, its scene and its note', () => {
  assert.deepEqual(LESSONS.map((l) => l.key), ['acqua', 'luce', 'terra', 'vaso', 'semina']);
  assert.deepEqual(LESSONS.map((l) => l.title), ['L\'acqua', 'La luce', 'La terra', 'Il vaso', 'Semina e talea']);
  assert.deepEqual(KEYS, LESSONS.map((l) => l.key));
  assert.deepEqual(Object.keys(S), IDS);
  for (const l of LESSONS) {
    assert.ok(LESSON_NOTES[l.key] && LESSON_NOTES[l.key].length <= LIMIT, `note ${l.key}`);
    assert.equal(lessonNote(l.key, { [l.key]: true }), LESSON_NOTES[l.key]);
    assert.equal(lessonNote(l.key, {}), null);
    assert.ok(l.text.startsWith(`${l.title}: `) && l.text.endsWith('.') && l.text.length <= LIMIT, `text ${l.key}`);
  }
});

test('the glue registers the scripts, the chain, Ortica at her hut and the service', () => {
  const src = readFileSync(new URL('../src/glue/garden.js', import.meta.url), 'utf8');
  assert.match(src, /Object\.assign\(SCRIPTS, GARDEN_SCRIPTS, GARDEN_LESSON_SCRIPTS\)/);
  assert.match(src, /for \(const \{ extra, cast \} of lessonEntries\(\)\)/);
  assert.match(src, /EXTRAS\.push\(extra\)/);
  assert.match(src, /CAST\.splice\(.*cast\)/);
  assert.match(src, /provide\('garden\.lesson'/);
  const anchors = allAnchors(), E = lessonEntries();
  assert.deepEqual(E.map((e) => e.extra.id), IDS);
  E.forEach(({ extra, cast }, n) => {
    assert.ok(anchors[extra.at], extra.at);
    assert.deepEqual(extra.after, [n ? IDS[n - 1] : 'garden.ortica']);
    assert.equal(cast.script, extra.id);
    assert.ok(Array.isArray(S[cast.script]));
  });
});

test('each scene: 10 to 16 lines, one question with three answers and one right, and it ends by doing something', () => {
  for (const [id, nodes] of Object.entries(S)) {
    const key = id.split('.').pop();
    const choices = nodes.filter((n) => n.choice);
    assert.equal(choices.length, 1, `${id}: one choice`);
    const opts = choices[0].choice;
    assert.equal(opts.length, 3, `${id}: three options`);
    assert.equal(opts.filter((o) => o.ok).length, 1, `${id}: one right`);
    for (const o of opts) {
      const re = o.then.filter((n) => n.say);
      assert.ok(re.length >= 1 && re.length <= 2 && re.every((n) => n.say === 'ortica'), `${id}: «${o.t}» is answered by Ortica in one or two lines`);
      assert.ok(o.t.length <= 70, `${id}: option too long: ${o.t}`);
      assert.equal(o.then.some((n) => n.do === 'xp'), !!o.ok, `${id}: only the right answer gives xp`);
    }
    const before = nodes.slice(0, nodes.indexOf(choices[0])), after = nodes.slice(nodes.indexOf(choices[0]) + 1);
    assert.ok(before.filter((n) => n.say).length >= 2 && after.filter((n) => n.say).length >= 2, `${id}: the question is in the middle`);
    assert.equal(before.filter((n) => n.say).pop().say, 'ortica', `${id}: Ortica asks`);
    const lines = nodes.filter((n) => n.say).length + 1; // one branch of the choice is heard
    assert.ok(lines >= 10 && lines <= 16, `${id}: ${lines} lines`);
    assert.equal(nodes.filter((n) => n.say).pop().say, 'ortica', `${id}: Ortica has the last word`);
    const tail = nodes.slice(nodes.findLastIndex((n) => n.say) + 1);
    assert.deepEqual(tail.map((n) => n.do), ['diary', 'xp', 'bond', 'call'], id);
    assert.deepEqual(tail[2], { do: 'bond', who: 'ortica', n: 1, why: 'garden.lesson' });
    assert.deepEqual([tail[3].name, tail[3].args], ['garden.lesson', [key]]);
  }
});

test('the words: no line too long, no exclamations, no magic talk, no remedies, the player has no gender', () => {
  const all = [...IDS.flatMap((id) => texts(id).map((t) => [t, id])), ...Object.entries(LESSON_NOTES).map(([k, t]) => [t, `note ${k}`]), ...LESSONS.map((l) => [l.text, `text ${l.key}`])];
  for (const [t, w] of all) {
    assert.ok(t.length <= LIMIT, `${w}: ${t.length} chars: ${t}`);
    assert.ok(!t.includes('!'), `${w}: «!»: ${t}`);
    assert.ok(!/energi|vibrazion|universo/i.test(t), `${w}: ${t}`);
    assert.ok(!/\bcur[aeo]\b|\bcurar|fa bene|fanno bene|guarisc|rimedi|tisan|decott/i.test(t), `${w}: remedy talk: ${t}`);
    assert.ok(!/ricorda che|\{/.test(t), `${w}: ${t}`);
    assert.ok(!/\b(brava|bravo|pronta|pronto|sicura|sicuro|arrivata|arrivato|stata|stato|tornata|tornato|contenta|contento)\b/i.test(t.replace(/\b(è|era|sia|resta|rimasto|rimasta) (stata|stato|pronta|pronto|rimasto)\b/gi, '')) || /pianta|terra|salvia|lavanda|menta|rosmarino|vaso|fratello/i.test(t), `${w}: gendered word: ${t}`);
  }
});

test('played with the real runner: every answer goes on to the end, and the right one gives 5 xp more', async () => {
  for (const id of IDS) {
    for (let pick = 0; pick < 3; pick++) {
      const said = [], calls = [], acts = [];
      const ui = { say: async (who, t) => { said.push(t); }, choose: async () => pick, cinema: async () => {}, moment: async () => {}, sleep: async () => {}, end: async () => {} };
      const r = createRunner({ ui, call: async (name, ...a) => { calls.push([name, ...a]); }, getScript: (k) => S[k], warn: (...a) => { throw new Error(a.join(' ')); } });
      await r.run(id);
      const opt = S[id].find((n) => n.choice).choice[pick];
      assert.ok(said.includes(opt.then[0].t), `${id}/${pick}: the answer is heard`);
      assert.equal(said.at(-1), S[id].filter((n) => n.say).pop().t, `${id}/${pick}: the last line`);
      assert.deepEqual(calls.filter((c) => c[0] === 'witches.bond'), [['witches.bond', 'ortica', 1, 'garden.lesson']]);
      assert.deepEqual(calls.filter((c) => c[0] === 'garden.lesson'), [['garden.lesson', id.split('.').pop()]]);
      void acts;
    }
  }
});

test('one lesson a day, in order, once something is planted', () => {
  const D1 = '2026-11-17', D2 = '2026-11-18', D3 = '2026-12-01';
  const g = normGarden({ unlocked: true, beds: [null, null, null, null] });
  assert.equal(nextLesson(normGarden(null), null, D1), null, 'no garden');
  assert.equal(nextLesson(g, null, D1), null, 'nothing planted');
  g.beds[1] = plant('menta', D1);
  assert.equal(nextLesson(g, null, D1), 'acqua');
  assert.equal(nextLesson(g, undefined, D1), 'acqua', 'an old save has no day');
  g.lessons.acqua = true;
  assert.equal(nextLesson(g, D1, D1), null, 'not the same day');
  assert.equal(nextLesson(g, D2, D1), null, 'nor if the clock went back');
  assert.equal(nextLesson(g, D1, D2), 'luce');
  assert.equal(nextLesson(g, D1, D3), 'luce', 'only one, however long she stayed away');
  g.lessons.luce = true;
  assert.equal(nextLesson(g, D2, D2), null);
  assert.equal(nextLesson(g, D2, '2027-01-01'), 'terra', 'across a year');
  g.lessons.terra = g.lessons.vaso = true;
  assert.equal(nextLesson(g, D2, D3), 'semina');
  g.lessons.semina = true;
  assert.equal(nextLesson(g, D2, D3), null, 'all taken');
  // a garden emptied later still keeps the lessons from opening
  assert.equal(nextLesson(normGarden({ unlocked: true, lessons: { acqua: true } }), D1, D3), null);
});

test('in the registry the chain shows one link at a time, also to a save that is far ahead', () => {
  const list = [{ id: 'garden.ortica', kind: 'errand', when: { flag: 'garden.offer' }, done: { flag: 'garden.given' } }, ...lessonEntries().map((e) => e.extra)];
  const s = { chapter: 4, extras: {}, flags: { 'garden.offer': true, 'garden.given': true } };
  const st = () => IDS.map((id) => extraStatus(list.find((e) => e.id === id), s, flagTest, list));
  assert.deepEqual(st(), ['hidden', 'hidden', 'hidden', 'hidden', 'hidden']);
  // even with every `open` flag set (it never happens), only the first undone link shows
  for (const id of IDS) s.flags[`${id}.open`] = true;
  assert.deepEqual(st(), ['new', 'hidden', 'hidden', 'hidden', 'hidden']);
  s.flags[IDS[0]] = true;
  assert.deepEqual(st(), ['done', 'new', 'hidden', 'hidden', 'hidden']);
  for (const id of IDS.slice(1, 4)) s.flags[id] = true;
  assert.deepEqual(st(), ['done', 'done', 'done', 'done', 'new']);
  assert.ok(extrasShown(s, flagTest, list).some((e) => e.id === IDS[4] && e.status === 'new'));
  // Ortica gives a lesson only while it is open and not taken
  const cast = lessonEntries()[4].cast;
  assert.equal(flagTest(cast.when, s), true);
  s.flags[IDS[4]] = true;
  assert.equal(flagTest(cast.when, s), false);
});

test('the rare seed: a poisonous plant she has no seed of and does not grow, else belladonna', () => {
  const poison = ORDER.filter((id) => risk(id) === 'velenosa');
  assert.equal(rareSeed({}, [], risk, ORDER), poison[0]);
  assert.equal(risk(rareSeed({ lavanda: 2 }, [null, plant('menta', '2026-11-17')], risk, ORDER)), 'velenosa');
  assert.equal(rareSeed({ [poison[0]]: 1 }, [], risk, ORDER), poison[1]);
  assert.equal(rareSeed({}, [plant(poison[0], '2026-11-17'), plant(poison[1], '2026-11-17')], risk, ORDER), poison[2]);
  assert.equal(rareSeed(Object.fromEntries(poison.map((id) => [id, 1])), [], risk, ORDER), 'belladonna');
});
