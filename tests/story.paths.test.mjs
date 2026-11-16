// The small paths of the story (notes/paths.md): every script of the scenes is played through every
// combination of its options (all of them while they are few, then every option at least once plus a
// capped sweep), in three states: a newcomer with nothing unlocked, and a player with everything
// unlocked whose traits lean one way or the other. On every path the scene must end with no warning,
// offer two to six answers at each choice, and leave what the main path needs: the step, the chapter,
// the cards, the spreads, the flags. Then the whole story is played with random answers.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state } from '../src/core/state.js';
import { findCard, setPlayer, addXp } from '../src/core/progress.js';
import { test as cond } from '../src/core/cond.js';
import { MAJORS } from '../src/data/cards.base.js';
import { SCRIPTS, STEPS, CAST } from '../src/data/story/index.js';
import { C0 } from '../src/data/story/scripts/c0.js';
import { C1 } from '../src/data/story/scripts/c1.js';
import { C1B } from '../src/data/story/scripts/c1b.js';
import { C2 } from '../src/data/story/scripts/c2.js';
import { C3 } from '../src/data/story/scripts/c3.js';
import { END } from '../src/data/story/scripts/end.js';
import { POST } from '../src/data/story/scripts/post.js';
import { createRunner } from '../src/story/runner.js';

const MINE = { ...C0, ...C1, ...C1B, ...C2, ...C3, ...END, ...POST };
const CAP = 250; // paths per script and state beyond the one-at-a-time sweep
const pad = (n) => `m${String(n).padStart(2, '0')}`;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => pad(a + i));

// what a scene must leave behind when she comes to it ready (the gates open)
const NEED = {
  'p.road': { step: 'c1.malva', chapter: 1, powers: ['cat'] },
  'c1.malva': { step: 'c1.read', lessons: ['deck'] },
  'c1.read': { step: 'c1.shop', spreads: ['single'], flags: ['shop.open'], calls: ['reading.open'] },
  'c1.shop': { step: 'c1.back', tools: ['incense'], flags: ['side.m01'] },
  'c1.back': { step: 'c1.deliver' },
  'c1.deliver': { step: 'c1.cottage', flags: ['side.m05'], oneOf: [['bundle.closed', 'bundle.peeked']] },
  'c1.cottage': { step: 'c1.grimoire' },
  'c1.grimoire': { step: 'c1.client', oneOf: [['door.opened', 'door.window']] },
  'c1.cart': { step: 'c1.explore', flags: ['met.ginepra', 'ginepra.snatched'], oneOf: [['square.front', 'square.wall']] },
  'c1.exam1': { step: 'c1.venus', flags: ['exam1.done'], calls: ['exam.start'] },
  'c1.venus': { step: 'c1.square', cards: ['m07'], flags: ['ginepra.returned'] },
  'c1.square': { step: 'c1.gate', oneOf: [['b1.spoke', 'b1.hid']] },
  'c1.gate': { step: 'c2.ortica', chapter: 2, calls: ['story.session:s1'] },
  'c2.ortica': { step: 'c2.mill', spreads: ['ppf'], lessons: ['ppf', 'suits'] },
  'c2.mill': { step: 'c2.client', flags: ['side.m12'] },
  'c2.fire': { step: 'c2.plan' },
  'c2.plan': { step: 'c2.home', oneOf: [['b2.went', 'b2.stayed']] },
  'c2.arrest': { step: 'c3.trapdoor', flags: ['ginepra.taken'], calls: ['story.session:s2'], oneOf: [['arrest.front', 'arrest.hid']] },
  'c3.trapdoor': { step: 'c3.edera', chapter: 3 },
  'c3.edera': { step: 'c3.client', spreads: ['celtic'], lessons: ['celtic', 'astro'], oneOf: [['edera.light', 'edera.well']] },
  'c3.coven': { oneOf: [['b3.stealth', 'b3.open']], stepByFlag: { 'b3.stealth': 'c3.jail', 'b3.open': 'c3.court' } },
  // the two faces of fork 3 run on through the trial and the dawn
  'c3.jail': { step: 'f.last', cards: ['m19', 'm20'], oneOf: [['trial.won', 'trial.lost'], ['jail.chains', 'jail.barrels']], calls: ['exam.start', 'story.session:s3'] },
  'c3.court': { step: 'f.last', cards: ['m19', 'm20'], oneOf: [['trial.won', 'trial.lost']], calls: ['exam.start', 'story.session:s3'] },
  'c3.trial': { step: 'f.last', cards: ['m19', 'm20'], oneOf: [['trial.won', 'trial.lost']] },
  'f.dawn': { step: 'f.last', cards: ['m19'], calls: ['story.session:s3'] },
  'f.last': { step: 'post.minors', chapter: 4, flags: ['ending.seen'], calls: ['story.session:s4'] },
  'enc.child': { flags: ['enc.child'] }, 'enc.washer': { flags: ['enc.washer'] }, 'enc.hale': { flags: ['enc.hale'], tools: ['incense'] },
  'enc.gravedigger': { flags: ['enc.gravedigger', 'side.m11'] }, 'enc.miller': { flags: ['enc.miller'] }, 'enc.guard': { flags: ['enc.guard', 'side.m18'] },
  'minor.first': { flags: ['minor.first'] }, 'minor.dup': { flags: ['minor.dup'] }, 'fog.lost': { flags: ['fog.lost'] },
};
// a newcomer at the two rank gates is sent back, and the refusal is remembered
const REFUSED = { 'c1.gate': 'gate1.refused', 'c3.trapdoor': 'gate2.refused' };

const chapterOf = (id) => (/^(p\.|c1\.|malva\.|enc\.(child|washer))/.test(id) ? 1 : /^(c2\.|ortica\.|fog\.|enc\.(hale|gravedigger|miller)|trade\.|minor\.)/.test(id) ? 2 : /^post\./.test(id) ? 4 : 3);
const foundFor = (id) => {
  const ch = chapterOf(id);
  if (ch <= 1) return ['m00', 'm03', 'm04', 'm05', 'm06', ...(id === 'c1.gate' || id === 'malva.chat' ? ['m07'] : [])];
  if (ch === 2) return range(0, 12);
  return range(0, /^(c3\.(trapdoor|edera))/.test(id) ? 16 : 18);
};

const UNLOCK_FLAGS = ['lesson.fly', 'fog.lost', 'coven.ortica.talk', 'client.c3.cook.done', 'client.c2.miller.done', 'minor.dup', 'met.ginepra',
  's0.knock', 'edera.promise', 'mill.honest', 'tabita.owes', 'depot.bray', 'mill.read'];

function prepare(id, mode) {
  setState({});
  setPlayer({ name: 'Viola', birth: { d: 3, m: 10, y: 1996 } });
  state.started = true;
  state.chapter = id === 'p.road' || id === 'p.arrive' ? 0 : chapterOf(id);
  state.step = STEPS.some((s) => s.id === id) ? id : state.step;
  if (id === 'c2.arrest') state.step = 'c2.home';
  if (id === 'c1.exam1') state.step = 'c1.explore';
  if (mode === 'new') { if (state.chapter >= 1) state.powers.cat = true; if (id === 'c2.fire') state.powers.fire = true; return; }
  for (const c of foundFor(id)) findCard(c, { silent: true });
  state.xp = 900;
  for (const p of ['cat', 'fire', 'sense', 'move', 'stun', 'broom']) state.powers[p] = true;
  if (mode === 'ready') return;
  // everything she could have earned, and a marked character
  state.pop = 40; state.tartufo = 40;
  for (const t of ['bottle', 'incense', 'pendulum']) state.tools[t] = 1;
  for (const w of Object.keys(state.trust)) state.trust[w] = 3;
  for (const k of ['esplora', 'parola', 'tono', 'rischio', 'guida']) state.traits[k] = mode === 'plus' ? 4 : -4;
  Object.assign(state.stats, { jailed: 1, readings: 6, examsPassed: 6, examsFailed: 0, exams: 6 });
  for (let i = 0; i < 30; i++) state.stats.seen[`place.${i}`] = 1;
  for (const f of UNLOCK_FLAGS) state.flags[f] = true;
  if (state.cards.m10) state.cards.m10.words = ['giro', 'sorte', 'svolta'];
  if (mode === 'minus' && id === 'c1.venus') delete state.cards.m06; // Ginepra leaves her Gli Amanti
}

// one run of a script following `plan` (an index per decision, 0 beyond its end); returns what was offered
async function runOnce(id, mode, plan) {
  prepare(id, mode);
  const warnings = [], calls = [], sizes = [], offered = [];
  let k = 0;
  const decide = (n) => { const i = plan[k] ?? 0; k += 1; sizes.push(n); return Math.min(i, n - 1); };
  const call = async (name, arg) => {
    calls.push(name === 'story.session' ? `${name}:${arg}` : name);
    if (name === 'card.found') { findCard(arg, { silent: true }); return null; }
    if (name === 'draw.pick') return arg.pool.find((c) => !state.cards[c]?.found) || arg.pool[0];
    if (name === 'exam.start') return { passed: decide(2) === 0 };
    return null;
  };
  const ui = {
    say() {}, cinema() {}, moment() {}, sleep() {}, end() {},
    choose: (texts, metas) => { offered.push({ texts, metas: metas || [] }); return decide(texts.length); },
  };
  const runner = createRunner({ ui, call, getScript: (x) => SCRIPTS[x], warn: (...a) => warnings.push(a.join(' ')) });
  await runner.run(id);
  return { warnings, calls, sizes, offered, flags: { ...state.flags } };
}

function check(id, mode, r, plan) {
  const where = `${id} [${mode}] ${JSON.stringify(plan)}`;
  assert.deepEqual(r.warnings, [], where);
  for (const c of r.offered) assert.ok(c.texts.length >= 2 && c.texts.length <= 6, `${where}: ${c.texts.length} answers`);
  const need = NEED[id];
  if (!need) return;
  if (mode === 'new' && REFUSED[id]) { assert.ok(state.flags[REFUSED[id]], `${where}: refusal not remembered`); assert.equal(state.step, id, where); return; }
  if (mode === 'new' && id === 'c3.coven') return; // the council waits for the cards
  if (mode === 'new' && id === 'c2.plan') return; // Ginepra waits for the cards
  if (need.step) assert.equal(state.step, need.step, `${where}: step`);
  if (need.chapter != null) assert.equal(state.chapter, need.chapter, `${where}: chapter`);
  for (const f of need.flags || []) assert.ok(state.flags[f], `${where}: flag ${f}`);
  for (const c of need.cards || []) assert.ok(state.cards[c]?.found, `${where}: card ${c}`);
  for (const s of need.spreads || []) assert.ok(state.spreads[s], `${where}: spread ${s}`);
  for (const l of need.lessons || []) assert.ok(state.lessons[l], `${where}: lesson ${l}`);
  for (const p of need.powers || []) assert.ok(state.powers[p], `${where}: power ${p}`);
  for (const t of need.tools || []) assert.ok(state.tools[t] > 0, `${where}: tool ${t}`);
  for (const c of need.calls || []) assert.ok(r.calls.includes(c), `${where}: call ${c}`);
  for (const group of need.oneOf || []) assert.equal(group.filter((f) => state.flags[f]).length, 1, `${where}: exactly one of ${group}`);
  if (need.stepByFlag) for (const [f, s] of Object.entries(need.stepByFlag)) if (state.flags[f]) assert.equal(state.step, s, `${where}: step for ${f}`);
}

// every plan worth playing: the baseline, each answer of each decision alone, then a breadth-first sweep
async function plans(id, mode) {
  const seen = new Map();
  const play = async (plan) => {
    const key = plan.join(',');
    if (seen.has(key)) return seen.get(key);
    const r = await runOnce(id, mode, plan);
    check(id, mode, r, plan);
    seen.set(key, r);
    return r;
  };
  const queue = [[]];
  while (queue.length && seen.size < CAP) {
    const plan = queue.shift();
    const r = await play(plan);
    // extend at every decision this run met at or after the end of its plan
    for (let d = plan.length; d < r.sizes.length; d++) {
      for (let i = 1; i < r.sizes[d]; i++) queue.push([...plan, ...Array(d - plan.length).fill(0), i]);
    }
  }
  return [...seen.values()];
}

const offeredTexts = new Set();
const MODES = ['new', 'ready', 'plus', 'minus'];
for (const id of Object.keys(MINE)) {
  test(`paths: ${id}`, async () => {
    for (const mode of MODES) {
      const runs = await plans(id, mode);
      for (const r of runs) for (const c of r.offered) c.texts.forEach((t) => offeredTexts.add(t));
    }
  });
}

test('every answer written in the scenes is offered on some path, the special ones included', () => {
  const walk = function* (nodes) { for (const n of nodes || []) { yield n; if (n.choice) for (const o of n.choice) yield* walk(o.then); yield* walk(n.then); yield* walk(n.else); } };
  // {tokens} are filled before the UI sees a text: compare the part before the first token
  const head = (t) => t.split('{')[0];
  const heads = [...offeredTexts].map(head);
  const missing = [];
  for (const [id, script] of Object.entries(MINE)) for (const n of walk(script)) if (n.choice) for (const o of n.choice) {
    if (!heads.some((h) => h.startsWith(head(o.t)) || head(o.t).startsWith(h))) missing.push(`${id}: ${o.t}`);
  }
  // reached only from an earlier scene's state, covered by the random walks below
  const LATER = ['Fischio piano verso la scala'];
  assert.deepEqual(missing.filter((m) => !LATER.some((t) => m.includes(t))), []);
});

// ---- the whole story with random answers: it always reaches the end ------------------------------
const rng = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };
async function wholeStory(seed, rich) {
  setState({});
  setPlayer({ name: 'Viola', birth: { d: 3, m: 10, y: 1996 } });
  findCard('m00', { silent: true });
  state.step = 'p.road';
  if (rich) { state.pop = 40; state.tartufo = 40; for (const w of Object.keys(state.trust)) state.trust[w] = 2; state.flags['lesson.fly'] = true; }
  const rand = rng(seed), warnings = [];
  const call = async (name, arg) => {
    if (name === 'card.found') findCard(arg, { silent: true });
    if (name === 'draw.pick') return arg.pool.find((c) => !state.cards[c]?.found) || arg.pool[0];
    if (name === 'exam.start') return { passed: rand() < 0.6 };
    return null;
  };
  const ui = { say() {}, cinema() {}, moment() {}, sleep() {}, end() {}, choose: (texts) => Math.floor(rand() * texts.length) };
  const runner = createRunner({ ui, call, getScript: (x) => SCRIPTS[x], warn: (...a) => warnings.push(a.join(' ')) });
  for (let guard = 0; guard < 200 && state.step !== 'post.minors'; guard++) {
    const before = state.step;
    if (rich) for (const p of ['fire', 'sense', 'move', 'stun', 'broom']) state.powers[p] = true;
    const at = STEPS.find((s) => s.id === before).at;
    const entry = CAST.find((c) => c.at === at && cond(c.when));
    assert.ok(entry, `seed ${seed}: no cast entry for ${before}`);
    await runner.run(entry.script.startsWith('client.') ? [{ do: 'step', id: { 'c1.client': 'c1.cart', 'c2.client': 'c2.fire', 'c3.client': 'c3.coven' }[before] }] : entry.script);
    if (state.step === before) {
      const next = MAJORS.find((c) => c.spot && !state.cards[c.id]?.found && c.row <= state.chapter && c.id !== 'm07');
      if (next) findCard(next.id, { silent: true }); else addXp(40, 'study');
    }
  }
  assert.deepEqual(warnings, [], `seed ${seed}`);
  assert.equal(state.step, 'post.minors', `seed ${seed}`);
  assert.ok(state.flags['ending.seen'] && state.chapter === 4, `seed ${seed}`);
  for (const c of ['m07', 'm19', 'm20']) assert.ok(state.cards[c]?.found, `seed ${seed}: ${c}`);
  for (const [a, b] of [['b1.spoke', 'b1.hid'], ['b2.went', 'b2.stayed'], ['b3.stealth', 'b3.open'], ['trial.won', 'trial.lost']]) {
    assert.ok(!!state.flags[a] !== !!state.flags[b], `seed ${seed}: exactly one of ${a} / ${b}`);
  }
}
test('the whole story with random answers reaches the same ending, with and without everything unlocked', async () => {
  for (let seed = 1; seed <= 30; seed++) { await wholeStory(seed, false); await wholeStory(seed * 7 + 3, true); }
});
