// SHE SEES ONLY WHAT SHE KNOWS (lore/principi/vede-solo-quello-che-sa.md; docs/LEZIONI.md 34).
// The guard against spoilers: everything the grimoire's map says about the world is what she has seen or
// been told, with a condition (src/core/cond.js) where it depends on that.
//   - the cards of the optional things (src/ui/missions/titles.js): no reward field, no reward or spoiler
//     word, presentiments few and different
//   - her notes on the places (src/data/world/notes.js): three states for every place on the sketches,
//     valid conditions naming flags, steps, trials and cards that exist, short lines, old saves quiet
//   - both: no proper name that the scripts never say (a name known only to lore/retroscena is a backstory)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { TITLES } from '../src/ui/missions/titles.js';
import { PLACE_NOTES } from '../src/data/world/notes.js';
import { placeNotes, adoptNotes, freshNotes, readNotes, SHOWN } from '../src/ui/placenotes.js';
import { REGIONS } from '../src/ui/sketchmap.js';
import { COND_KEYS } from '../src/core/cond.js';
import { STEPS } from '../src/data/story/index.js';
import { TRIALS } from '../src/data/trials/index.js';
import { WORLD_LIST } from '../src/data/elsewhere/index.js';
import { CARD } from '../src/data/cards.base.js';
import { lessonEntries } from '../src/glue/garden.rules.js';

const files = (dir, ext = '.js') => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? files(p, ext) : p.endsWith(ext) ? [p] : []; });
// what the game can say: every source file, except the two files under guard
const GUARDED = [join('src', 'ui', 'missions', 'titles.js'), join('src', 'data', 'world', 'notes.js')];
const SRC = files('src').filter((f) => !GUARDED.some((g) => f.endsWith(g))).map((f) => readFileSync(f, 'utf8')).join('\n');
// the scripts: what she can hear or read in the game (story, trials, worlds, lessons, data texts)
const SAID = files(join('src', 'data')).filter((f) => !GUARDED.some((g) => f.endsWith(g))).map((f) => readFileSync(f, 'utf8')).join('\n');

// names in the backstory that the scripts never say: they must never reach her
const RETRO = files(join('lore', 'retroscena'), '.md').map((f) => readFileSync(f, 'utf8')).join('\n');
const capWords = (text) => [...String(text).matchAll(/(?<![.!?«]\s|^)(?<=[\s'’(]|^)([A-ZÀ-Ý][a-zà-ÿ]{2,})/gm)].map((m) => m[1]);
// plus, by hand, the backstory names that the game uses for something else (in the scripts «Ruta» is only a
// herb; in lore/retroscena she is a person, and nothing she has seen tells her so)
const BACKSTORY_ONLY = [...new Set([...capWords(RETRO).filter((w) => !SAID.includes(w)), 'Ruta'])];

// every text the map can show
const cardTexts = Object.entries(TITLES).flatMap(([id, t]) => [t.title, t.told, t.later?.[1], t.hunch].filter(Boolean).map((x) => [id, x]));
const noteTexts = Object.entries(PLACE_NOTES).flatMap(([p, P]) => [P.unknown, ...P.notes.map((n) => n.t)].map((x) => [p, x]));

const REWARD_FIELDS = ['gets', 'reward', 'prize', 'gain', 'gains', 'premio', 'ricompensa'];
const FORBIDDEN = /\b(ricompens\w*|monet\w*|esperienza|premi\w*|guadagn\w*|oggett\w*|regal\w*|in cambio)\b/i;

test('the cards of the optional things never say what she gets or what happens', () => {
  for (const [id, t] of Object.entries(TITLES)) {
    for (const f of REWARD_FIELDS) assert.ok(!(f in t), `${id}: «${f}»: the map never says what she gets`);
    for (const text of [t.title, t.told, t.later?.[1], t.hunch]) if (text) assert.doesNotMatch(text, FORBIDDEN, `${id}: a spoiler word in «${text}»`);
  }
  const hunches = Object.values(TITLES).map((t) => t.hunch).filter(Boolean);
  assert.ok(hunches.length <= Object.keys(TITLES).length / 3, 'presentiments only where they add something');
  assert.equal(new Set(hunches.map((x) => x.split(/\s+/).slice(0, 3).join(' '))).size, hunches.length, 'two presentiments open the same way');
});

// ---- conditions ---------------------------------------------------------------------------------------
const STEP_IDS = new Set(STEPS.map((s) => s.id));
const GARDEN = new Set(lessonEntries().map((e) => e.extra.id));
const flagExists = (f) => {
  let m = /^trial\.(\w+)\.(offered|pass|perfect|fail)$/.exec(f);
  if (m) return !!TRIALS[m[1]];
  m = /^elsewhere\.(\w+)\.done$/.exec(f);
  if (m) return WORLD_LIST.some((w) => w.id === m[1]);
  if (GARDEN.has(f)) return true;
  return SRC.includes(`'${f}'`) || SRC.includes(`"${f}"`);
};
function checkCond(c, where) {
  if (c === true || c == null) return;
  if (Array.isArray(c)) { c.forEach((x) => checkCond(x, where)); return; }
  for (const [k, v] of Object.entries(c)) {
    assert.ok(COND_KEYS.includes(k), `${where}: unknown condition key ${k}`);
    if (k === 'not') checkCond(v, where);
    if (k === 'any') v.forEach((x) => checkCond(x, where));
    if (k === 'flag' || k === 'notFlag') assert.ok(flagExists(v), `${where}: no flag ${v} in the game`);
    if (k === 'step') assert.ok(STEP_IDS.has(v), `${where}: no step ${v}`);
    if (k === 'stepIn') for (const s of v) assert.ok(STEP_IDS.has(s), `${where}: no step ${s}`);
    if (k === 'trial') assert.ok(TRIALS[Array.isArray(v) ? v[0] : v], `${where}: no trial ${v}`);
    if (k === 'has' || k === 'lacks') assert.ok(CARD[v], `${where}: no card ${v}`);
    if (k === 'stat') assert.match(readFileSync('src/core/state.js', 'utf8'), new RegExp(`\\b${v[0]}:`), `${where}: no stat ${v[0]}`);
  }
}

test('every place on the sketches has her three states: blank, «?» and a line, then notes with a condition', () => {
  const places = Object.values(REGIONS).flatMap((r) => Object.keys(r.places));
  for (const p of places) {
    const P = PLACE_NOTES[p];
    assert.ok(P, `${p}: no notes in src/data/world/notes.js`);
    assert.ok(P.unknown && P.unknown.length <= 70, `${p}: one plain line while she knows nothing of it (<= 70 characters)`);
    assert.ok(P.notes.length >= 1, `${p}: at least one note for when she knows it`);
    for (const n of P.notes) {
      assert.ok(n.if && n.if !== true, `${p}: «${n.t}» has no condition`);
      checkCond(n.if, `${p}: «${n.t}»`);
      assert.ok(n.t.length <= 70, `${p}: «${n.t}» is longer than 70 characters`);
      assert.match(n.t, /[.!?]$/, `${p}: «${n.t}»: a whole sentence`);
    }
    assert.equal(new Set(P.notes.map((n) => n.t)).size, P.notes.length, `${p}: the same note twice`);
  }
  for (const p of Object.keys(PLACE_NOTES)) assert.ok(places.includes(p), `${p}: in notes.js but not on the sketches`);
  for (const t of Object.values(TITLES)) if (t.later) checkCond(t.later[0], t.title);
});

test('no name from the backstory: every proper name the map says is said somewhere in the scripts', () => {
  assert.ok(BACKSTORY_ONLY.length > 0, 'the backstory has names the scripts never say (if not, the guard is empty)');
  for (const [id, text] of [...cardTexts, ...noteTexts]) {
    for (const w of BACKSTORY_ONLY) assert.doesNotMatch(text, new RegExp(`\\b${w}\\b`), `${id}: «${w}» exists only in lore/retroscena`);
    for (const w of capWords(text)) assert.ok(SAID.includes(w), `${id}: «${w}» is never said in the scripts («${text}»)`);
  }
});

test('her notes: the last three that hold; an old save shows nothing new; a new note shows once', () => {
  const flags = {};
  const t = (c) => (c && typeof c === 'object' && !Array.isArray(c) && 'flag' in c ? !!flags[c.flag] : false);
  // unknown: only the plain line
  let N = placeNotes('forest.mill', t);
  assert.equal(N.known, false); assert.equal(N.lines.length, 0); assert.ok(N.unknown);
  // an old save, the night it opens the map: what is already true is read
  flags['mill.read'] = true;
  const old = {};
  assert.ok(adoptNotes(old, t));
  assert.deepEqual(freshNotes(old, 'forest.mill', t), []);
  assert.ok(!adoptNotes(old, t));
  // something new happens: one fresh note, read once
  flags['trial.hat.pass'] = true;
  const t2 = (c) => t(c) || (c?.trial === 'hat');
  N = placeNotes('forest.mill', t2);
  assert.equal(N.lines.length, 2);
  assert.equal(freshNotes(old, 'forest.mill', t2).length, 1);
  assert.ok(readNotes(old, 'forest.mill', t2));
  assert.deepEqual(freshNotes(old, 'forest.mill', t2), []);
  // never more than three lines, the newest last
  const all = () => true;
  for (const p of Object.keys(PLACE_NOTES)) {
    const L = placeNotes(p, all).lines;
    assert.ok(L.length <= SHOWN);
    assert.equal(L[L.length - 1].t, PLACE_NOTES[p].notes.at(-1).t);
  }
  // a broken stored value counts as an old save
  assert.ok(adoptNotes({ notesAck: [] }, t));
});
