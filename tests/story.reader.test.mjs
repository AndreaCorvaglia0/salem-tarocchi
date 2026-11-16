// The Reader's material (sessions, visits, portrait, hints, lessons): shapes, conditions, tokens, the
// thread flags, mechanical prose faults, and a played run of the five sessions with the real runner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setState, state } from '../src/core/state.js';
import { findCard, setPlayer, snapshot, AXES } from '../src/core/progress.js';
import { test as cond, fill } from '../src/core/cond.js';
import { CARD, MAJORS, SIGNS } from '../src/data/cards.base.js';
import { SHEETS } from '../src/data/cards.js';
import { SESSIONS, PICKED } from '../src/data/story/sessions.js';
import { TALK, OPENERS, THREAD, RITUALS, CLOSERS } from '../src/data/story/visits.js';
import { ADJ, SIGNATURES, LIKE, VERDICTS, PORTRAIT, PAIRS, SEEDS } from '../src/data/portrait.js';
import { HINTS, HINTS_KEYS } from '../src/data/story/hints.js';
import { LESSONS } from '../src/data/lessons.js';
import { createRunner, cardOfNumber } from '../src/story/runner.js';

const MAJOR_IDS = MAJORS.map((c) => c.id);
// core/cond.js TESTS, with the portrait and birth keys of docs/CONTRACT.md ("Portrait over time")
const COND_KEYS = new Set(['flag', 'notFlag', 'chapter', 'chapterMin', 'chapterMax', 'step', 'stepIn', 'has', 'lacks', 'majorsMin',
  'level', 'power', 'spread', 'trust', 'stat', 'yourCard', 'birthCard', 'sign', 'word', 'tool', 'coinsMin', 'not', 'any',
  'trait', 'trend', 'steady', 'turned', 'torn', 'verdict', 'yourCardIsBirth', 'hasBirth', 'hasYear', 'element', 'modality', 'moon', 'bornOn', 'pop', 'tartufo']); // + 16 Nov
const TOKENS = new Set(['name', 'sign', 'birthCard', 'yourCard', 'title', 'level', 'stat', 'word', 'words', 'card', 'trust', 'season',
  'coins', 'majors', 'traits', 'trait', 'lastVerdict', 'element', 'modality', 'ruler', 'rulerCard', 'birthDay', 'dayPlanet',
  'dayPlanetCard', 'moon', 'picked']);
// flags set by the story scenes (notes/story.md) that the Reader's conditions may read
const STORY_FLAGS = new Set(['b1.spoke', 'b1.hid', 'b2.went', 'b2.stayed', 'b3.stealth', 'b3.open', 'lied.constable', 'trial.won', 'trial.lost']);
const STATS = new Set(['steps', 'exams', 'examsPassed', 'examsFailed', 'jailed', 'stuns', 'fires', 'readings', 'draws', 'locks']);

function* walk(nodes, where) {
  for (const n of nodes || []) {
    yield [n, where];
    if (n.choice) for (const o of n.choice) yield* walk(o.then, where);
    if (n.then) yield* walk(n.then, where);
    if (n.else) yield* walk(n.else, where);
  }
}
const LISTS = { OPENERS, THREAD, RITUALS, CLOSERS };
const sessionNodes = () => Object.entries(SESSIONS).flatMap(([id, list]) => [...walk(list, `session ${id}`)]);
const listNodes = () => Object.entries(LISTS).flatMap(([k, list]) => list.flatMap((e, i) => [...walk(e.then, `${k}[${i}]`)]));
const allNodes = () => [...sessionNodes(), ...listNodes()];

// every condition of the Reader's data, with where it is
function conds() {
  const out = [];
  for (const [n, w] of allNodes()) {
    if ('if' in n) out.push([n.if, w]);
    if (n.choice) n.choice.forEach((o) => o.when && out.push([o.when, w]));
    if (n.observe) n.observe.forEach((o) => out.push([o.when, w]));
  }
  for (const [k, list] of Object.entries(LISTS)) list.forEach((e, i) => out.push([e.when, `${k}[${i}]`]));
  PAIRS.forEach((p, i) => out.push([p.when, `PAIRS[${i}]`]));
  return out;
}
const flagsRead = new Set();
function checkCond(c, where) {
  if (c == null || c === true) return;
  if (Array.isArray(c)) { c.forEach((x) => checkCond(x, where)); return; }
  assert.equal(typeof c, 'object', `${where}: condition ${c}`);
  for (const [k, v] of Object.entries(c)) {
    assert.ok(COND_KEYS.has(k), `${where}: unknown condition key ${k}`);
    if (k === 'not') checkCond(v, where);
    if (k === 'any') v.forEach((x) => checkCond(x, where));
    if (['has', 'lacks', 'yourCard', 'birthCard'].includes(k)) assert.ok(CARD[v], `${where}: card ${v}`);
    if (k === 'trait' || k === 'trend') { assert.ok(AXES.includes(v[0]), `${where}: axis ${v[0]}`); assert.ok(['>=', '>', '<=', '<', '==', '!='].includes(v[1]) && Number.isInteger(v[2]), `${where}: ${k}`); }
    if (['steady', 'turned', 'torn'].includes(k)) assert.ok(AXES.includes(v), `${where}: axis ${v}`);
    if (k === 'verdict') assert.ok(['first', 'same', 'changed'].includes(v), `${where}: verdict ${v}`);
    if (k === 'sign') assert.ok(SIGNS.some((s) => s.id === v), `${where}: sign ${v}`);
    if (k === 'element') assert.ok(['Fuoco', 'Acqua', 'Aria', 'Terra'].includes(v), `${where}: element ${v}`);
    if (k === 'modality') assert.ok(['cardinale', 'fisso', 'mobile'].includes(v), `${where}: modality ${v}`);
    if (k === 'moon') assert.ok(['nuova', 'crescente', 'piena', 'calante'].includes(v), `${where}: moon ${v}`);
    if (k === 'bornOn') assert.ok(['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'].includes(v), `${where}: day ${v}`);
    if (k === 'trust') assert.ok(['malva', 'ortica', 'edera', 'ginepra'].includes(v[0]), `${where}: trust ${v[0]}`);
    if (k === 'stat') assert.ok(STATS.has(v[0]), `${where}: stat ${v[0]}`);
    if (k === 'word') assert.ok(['value', 'fear', 'dream'].includes(v[0]), `${where}: word ${v[0]}`);
    if (k === 'flag' || k === 'notFlag') flagsRead.add(v);
  }
}
const isTrait = (t) => t && typeof t === 'object' && Object.keys(t).length >= 1 && Object.entries(t).every(([k, v]) => AXES.includes(k) && (v === 1 || v === -1));

// every text the player reads from the Reader's files: [text, where, limit]
function texts() {
  const out = [];
  for (const [n, w] of allNodes()) {
    if (typeof n.t === 'string') out.push([n.t, w, 260]);
    if (n.choice) n.choice.forEach((o) => out.push([o.t, `${w} option`, 60]));
    if (n.observe) n.observe.forEach((o) => out.push([o.t, `${w} observe`, 260]));
  }
  for (const [id, t] of Object.entries(PICKED)) out.push([t, `PICKED ${id}`, 260]);
  for (const [id, c] of Object.entries(TALK)) {
    out.push([c.tell, `TALK ${id} tell`, 300], [c.words, `TALK ${id} words`, 260], [c.ask.q, `TALK ${id} q`, 160]);
    for (const [d, t] of Object.entries(c.details)) out.push([t, `TALK ${id} ${d}`, 260]);
    for (const a of c.ask.a) out.push([a.t, `TALK ${id} answer`, 60], [a.re, `TALK ${id} re`, 200]);
  }
  for (const [k, list] of Object.entries(LISTS)) list.forEach((e, i) => out.push([e.t, `${k}[${i}]`, 260]));
  for (const [id, t] of Object.entries(LIKE)) out.push([t, `LIKE ${id}`, 200]);
  out.push([VERDICTS.none, 'VERDICTS.none', 200]);
  for (const [axis, sides] of Object.entries(PORTRAIT)) for (const [k, t] of Object.entries(sides)) out.push([t, `PORTRAIT ${axis}.${k}`, 260]);
  PAIRS.forEach((p, i) => out.push([p.t, `PAIRS[${i}]`, 260]));
  for (const [k, t] of Object.entries(SEEDS)) out.push([t, `SEEDS ${k}`, 260]);
  for (const [k, t] of Object.entries({ ...HINTS })) out.push([t, `HINTS ${k}`, 120]);
  for (const [k, t] of Object.entries(HINTS_KEYS)) out.push([t, `HINTS_KEYS ${k}`, 120]);
  for (const l of LESSONS) for (const p of l.pages) out.push([p.body, `lesson ${l.id} "${p.h}"`, 480]);
  return out;
}

test('TALK: all 22 Majors, a line for every hotspot of the sheet, words, a two-answer question', () => {
  assert.deepEqual(Object.keys(TALK).sort(), [...MAJOR_IDS].sort());
  for (const id of MAJOR_IDS) {
    const c = TALK[id], name = CARD[id].name.replace(/^(Il|La|Lo|Gli|L')\s?/, '');
    assert.ok(c.tell.length >= 150, `${id} tell is too thin`);
    assert.ok(c.tell.includes(name), `${id} tell does not name the card`);
    assert.ok(/[Ii]n una lettura|[Qq]uando esce/.test(c.tell), `${id} tell does not arrive at the reading`);
    assert.deepEqual(Object.keys(c.details).sort(), SHEETS[id].details.map((d) => d.id).sort(), `${id} details`);
    for (const [d, t] of Object.entries(c.details)) assert.ok(/hai (guardato|notato)/.test(t) && t.length >= 110, `${id}.${d} detail line`);
    assert.ok(c.words.includes(`{words:${id}}`), `${id} words token`);
    assert.ok(c.ask.q.trim().endsWith('?'), `${id} question`);
    assert.equal(c.ask.a.length, 2, `${id} answers`);
    for (const a of c.ask.a) { assert.ok(a.t && a.re, `${id} answer text and reaction`); assert.ok(isTrait(a.trait), `${id} answer trait`); }
    assert.notDeepEqual(c.ask.a[0].trait, c.ask.a[1].trait, `${id}: the two answers move the same way`);
  }
});

test('the questions of the visits move every axis, both ways', () => {
  const seen = new Set();
  for (const c of Object.values(TALK)) for (const a of c.ask.a) for (const [k, v] of Object.entries(a.trait)) seen.add(`${k}${v}`);
  for (const k of AXES) for (const v of [1, -1]) assert.ok(seen.has(`${k}${v}`), `${k} ${v}`);
});

test('OPENERS, THREAD, RITUALS, CLOSERS: shape; OPENERS and CLOSERS end with an always-true entry', () => {
  assert.ok(OPENERS.length >= 20, `openers: ${OPENERS.length}`);
  assert.ok(CLOSERS.length >= 10, `closers: ${CLOSERS.length}`);
  for (const [k, list] of Object.entries(LISTS)) for (const [i, e] of list.entries()) {
    assert.ok(typeof e.t === 'string' && e.t.length > 40, `${k}[${i}] text`);
    assert.ok('when' in e, `${k}[${i}] when`);
    if (e.then) assert.ok(Array.isArray(e.then), `${k}[${i}] then`);
  }
  assert.equal(OPENERS.at(-1).when, true);
  assert.equal(CLOSERS.at(-1).when, true);
  for (const list of [OPENERS, CLOSERS]) list.slice(0, -1).forEach((e, i) => assert.notEqual(e.when, true, `always-true entry before the end at ${i}`));
});

test('a remark guarded by notFlag rd.x sets rd.x in its then; closers that name her card record the verdict', () => {
  for (const [k, list] of Object.entries(LISTS)) for (const [i, e] of list.entries()) {
    const guards = (Array.isArray(e.when) ? e.when : [e.when]).filter((c) => c && c.notFlag).map((c) => c.notFlag);
    for (const g of guards) assert.ok((e.then || []).some((n) => n.do === 'flag' && n.k === g), `${k}[${i}] never sets ${g}`);
  }
  for (const [i, e] of CLOSERS.entries()) if (/\{yourCard\}|\{lastVerdict\}/.test(e.t)) assert.ok((e.then || []).some((n) => n.do === 'verdict'), `CLOSERS[${i}] names her card without { do: 'verdict' }`);
});

test('every condition uses known keys and real ids', () => {
  for (const [c, w] of conds()) checkCond(c, w);
});

test('every flag the Reader reads is set by her own data or by the story', () => {
  for (const [c, w] of conds()) checkCond(c, w);
  const set = new Set(STORY_FLAGS);
  for (const [n] of allNodes()) {
    if (n.do === 'flag') set.add(n.k);
    if (n.choice) n.choice.forEach((o) => o.flag && set.add(o.flag));
  }
  for (const f of flagsRead) assert.ok(set.has(f), `flag ${f} is read but never set`);
});

test('SIGNATURES: 22 cards, two or three axes in -2..2, all directions distinct', () => {
  assert.deepEqual(Object.keys(SIGNATURES).sort(), [...MAJOR_IDS].sort());
  const unit = (s) => { const n = Math.hypot(...AXES.map((k) => s[k] || 0)); return AXES.map((k) => ((s[k] || 0) / n).toFixed(4)).join(','); };
  const seen = new Map();
  for (const [id, s] of Object.entries(SIGNATURES)) {
    const ks = Object.keys(s);
    assert.ok(ks.length >= 2 && ks.length <= 3, `${id}: ${ks.length} axes`);
    for (const k of ks) { assert.ok(AXES.includes(k), `${id}: axis ${k}`); assert.ok(Number.isInteger(s[k]) && s[k] !== 0 && Math.abs(s[k]) <= 2, `${id}.${k}`); }
    const u = unit(s);
    assert.ok(!seen.has(u), `${id} has the same direction as ${seen.get(u)}`);
    seen.set(u, id);
  }
  // no two cards closer than 45 degrees: each has room of its own
  const vec = (s) => AXES.map((k) => s[k] || 0);
  const ids = Object.keys(SIGNATURES);
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const a = vec(SIGNATURES[ids[i]]), b = vec(SIGNATURES[ids[j]]);
    const cos = a.reduce((x, v, k) => x + v * b[k], 0) / (Math.hypot(...a) * Math.hypot(...b));
    assert.ok(cos <= 0.72, `${ids[i]} and ${ids[j]} are too alike (${cos.toFixed(2)})`);
  }
});

test('portrait: adjectives, three sentences (and the torn one) for five axes, a line for each card and suit', () => {
  assert.deepEqual(Object.keys(ADJ).sort(), [...AXES].sort());
  for (const k of AXES) {
    assert.equal(ADJ[k].length, 2); assert.notEqual(ADJ[k][0], ADJ[k][1]);
    for (const side of ['plus', 'mid', 'minus', 'torn']) assert.ok(typeof PORTRAIT[k][side] === 'string' && PORTRAIT[k][side].length > 80, `PORTRAIT ${k}.${side}`);
    for (const group of ['lead', 'shift']) for (const side of ['plus', 'minus']) assert.ok(VERDICTS[group][k][side], `VERDICTS ${group} ${k} ${side}`);
  }
  assert.equal(new Set(Object.values(ADJ).flat()).size, 10);
  assert.deepEqual(Object.keys(LIKE).sort(), [...MAJOR_IDS].sort());
  for (const id of MAJOR_IDS) assert.ok(LIKE[id].includes(CARD[id].name), `LIKE ${id} names its card`);
  assert.deepEqual(Object.keys(SEEDS).sort(), ['c', 'p', 's', 'w']);
  assert.ok(PAIRS.length >= 6);
  assert.ok(VERDICTS.none.includes('{yourCard}'));
});

test('sessions: every option has a trait; every leaf sets word, flag and point and has a follow-up', () => {
  for (const [n, w] of sessionNodes()) if (n.choice) {
    assert.equal(n.choice.length, 2, `${w}: a question has two answers`);
    for (const o of n.choice) assert.ok(isTrait(o.trait), `${w}: option "${o.t}" has no trait`);
  }
  const cards = new Set();
  for (const [id, kind] of [['s1', 'value'], ['s2', 'fear'], ['s3', 'dream']]) {
    const tree = SESSIONS[id].find((n) => n.choice);
    const leaves = tree.choice.flatMap((o) => o.then.find((n) => n.choice).choice);
    assert.equal(leaves.length, 4, `${id}: leaves`);
    for (const l of leaves) {
      const p = l.then.find((n) => n.do === 'point'), wd = l.then.find((n) => n.do === 'word'), f = l.then.find((n) => n.do === 'flag');
      assert.ok(p && wd && f, `${id}: leaf "${l.t}"`);
      assert.equal(wd.k, kind); assert.equal(f.k, `leaf.${kind}.${p.card}`);
      assert.ok(CARD[p.card] && 'wcsp'.includes(p.suit));
      assert.ok(!cards.has(p.card), `${id}: leaf card ${p.card} is used twice`); cards.add(p.card);
      assert.ok(l.then.some((n) => n.choice), `${id}: leaf "${l.t}" has no follow-up question`);
    }
    assert.equal(new Set(leaves.map((l) => l.then.find((n) => n.do === 'point').suit)).size, 4, `${id}: the four leaves give the four suits`);
  }
});

test('sessions: observe, pick and verdict', () => {
  for (const id of ['s1', 's2', 's3']) {
    const s = SESSIONS[id];
    const obs = s.find((n) => n.observe).observe;
    assert.ok(obs.length >= 8 && obs.length <= 12, `${id}: observe ${obs.length}`);
    assert.equal(obs.at(-1).when, true, `${id}: the last observe entry is always true`);
    const pick = s.find((n) => n.pick === 'number');
    assert.ok(pick && pick.then.length, `${id}: pick`);
    assert.equal(pick.read, PICKED);
    assert.ok(s.indexOf(s.find((n) => n.do === 'verdict')) > s.indexOf(pick), `${id}: the verdict comes after the pick`);
  }
  assert.deepEqual(Object.keys(PICKED).sort(), [...MAJOR_IDS].sort());
  for (const id of MAJOR_IDS) assert.ok(PICKED[id].includes(CARD[id].name), `PICKED ${id} names its card`);
  for (const id of Object.keys(SESSIONS)) assert.ok(SESSIONS[id].some((n) => n.do === 'verdict'), `${id}: no verdict recorded`);
  const s0 = SESSIONS.s0, s4 = SESSIONS.s4;
  assert.ok(s0.some((n) => n.ask === 'name') && s0.some((n) => n.ask === 'birth') && s0.some((n) => n.turn === 'm00'));
  assert.ok(s4.some((n) => n.do === 'reading' && n.spread === 'celtic' && n.client === 'self'));
  assert.ok(s4.some((n) => n.portrait === true) && s4.some((n) => n.tableau === 'last'));
  assert.ok(s4.indexOf(s4.find((n) => n.portrait)) > s4.indexOf(s4.find((n) => n.do === 'reading')));
});

test('texts: within their length, known tokens, no mechanical prose faults', () => {
  const sentences = (t) => t.replace(/[«»"“”]/g, '').split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
  const words = (s) => s.replace(/\{[^}]+\}/g, 'x').split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
  const OK_SHORT = /^(sì|no|grazie|prego|ecco|già|certo|forse|bene|appunto|davvero)[.!?…]*$/i;
  for (const [t, w, max] of texts()) {
    assert.ok(typeof t === 'string' && t.trim(), `${w}: missing text`);
    assert.ok(t.length <= max, `${w}: ${t.length} chars (max ${max}): ${t}`);
    for (const m of t.matchAll(/\{([a-zA-Z]+)(?::[^}]+)?\}/g)) assert.ok(TOKENS.has(m[1]), `${w}: token ${m[0]}`);
    assert.ok(!/\(provvisorio\)/.test(t), `${w}: stub text`);
    if (/option|answer/.test(w)) continue; // her own answers may be short
    const ss = sentences(t), ws = ss.map(words);
    for (let i = 0; i + 2 < ss.length; i++) assert.ok(!(ws[i] <= 5 && ws[i + 1] <= 5 && ws[i + 2] <= 5), `${w}: three short sentences in a row: ${t}`);
    if (ss.length > 1) ss.forEach((s, i) => assert.ok(ws[i] > 2 || OK_SHORT.test(s), `${w}: a sentence of one or two words: ${t}`));
    assert.ok(!(/\bNon [^.?!]{1,40}[.] (Ti|Mi|Ci|Lo|La|È|Sono|Si)\b/.test(t) && ws[0] <= 6 && ws[1] <= 6), `${w}: effect antithesis: ${t}`);
  }
});

test('hints: the five interface lines exist, one sentence each', () => {
  for (const k of ['move', 'action', 'grimoire', 'exam', 'reading']) assert.ok(HINTS[k], k);
  for (const t of [...Object.values(HINTS), ...Object.values(HINTS_KEYS)]) assert.equal((t.match(/[.!?](\s|$)/g) || []).length, 1, t);
  for (const k of Object.keys(HINTS_KEYS)) assert.ok(HINTS[k], `HINTS_KEYS.${k} has no touch wording`);
});

// ---- played: the five sessions in a row with the real runner and fake screens -------------------
async function playAll({ choose, birth = { d: 3, m: 10, y: 1996 }, number = 7, between = () => {} }) {
  setState({});
  const warnings = [], lines = [];
  const say = (t) => { assert.ok(!/\{[a-zA-Z]+(:[^}]+)?\}/.test(t), `unfilled token: ${t}`); lines.push(t); };
  const ext = async (n, api) => {
    if (n.ask === 'name') { setPlayer({ name: 'Viola' }); return true; }
    if (n.ask === 'birth') { if (birth) setPlayer({ birth }); return true; }
    if (n.turn) { findCard(n.turn, { silent: true }); return true; }
    if (n.pick === 'number') { const cid = cardOfNumber(number); api.vars.picked = CARD[cid].name; if (n.read?.[cid]) say(api.F(n.read[cid])); await api.exec(n.then); return true; }
    if (n.observe) { const hit = n.observe.find((o) => cond(o.when)); if (hit) say(api.F(hit.t)); return true; }
    if (n.symbol || n.tableau) return true;
    if (n.portrait) { for (const k of AXES) { const v = state.traits[k]; say(fill(PORTRAIT[k][cond({ torn: k }) ? 'torn' : v >= 3 ? 'plus' : v <= -3 ? 'minus' : 'mid'])); } return true; }
    return false;
  };
  const call = async (name, arg) => { if (name === 'card.found') findCard(arg); return null; };
  let n = 0;
  const ui = { say: (who, t) => say(t), choose: (opts) => choose(n++, opts), cinema() {}, moment() {}, sleep() {}, end() {} };
  const runner = createRunner({ ui, call, getScript: () => null, ext, warn: (...a) => warnings.push(a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ')) });
  const marks = {};
  for (const id of ['s0', 's1', 's2', 's3', 's4']) {
    const from = lines.length;
    between(id);
    await runner.run(SESSIONS[id]);
    snapshot();
    marks[id] = lines.slice(from);
  }
  return { warnings, lines, marks };
}

const FORKS = { s1: 'b1.spoke', s2: 'b2.went', s3: 'b3.open' };
for (const [label, opt] of [
  ['first answers', { choose: () => 0 }],
  ['second answers, no year', { choose: () => 1, birth: { d: 14, m: 2 }, number: 22 }],
  ['alternating answers, no birth date', { choose: (i) => i % 2, birth: null, number: 13 }],
]) {
  test(`played: ${label}`, async () => {
    const { warnings, marks } = await playAll({ ...opt, between: (id) => { if (FORKS[id]) state.flags[FORKS[id]] = true; state.chapter = Math.max(0, Number(id[1]) - 1); } });
    assert.deepEqual(warnings, []);
    for (const k of ['value', 'fear', 'dream']) assert.ok(state.words[k], `word ${k}`);
    assert.equal(Object.keys(state.flags).filter((f) => f.startsWith('leaf.')).length, 3);
    assert.equal(state.verdicts.length, 5, 'one verdict per session');
    // from the second session on she says what she said the last time, and her card, with its reason
    for (const id of ['s1', 's2', 's3']) {
      const said = marks[id].join('\n');
      assert.ok(/L'ultima volta ti avevo detto che eri /.test(said), `${id}: the thread is missing`);
      assert.ok(/per me stanotte sei /i.test(said), `${id}: the verdict is missing`);
      assert.ok(marks[id].length >= 14 && marks[id].length <= 24, `${id}: ${marks[id].length} lines`);
    }
    assert.ok(marks.s0.some((t) => /mi farai cambiare idea/.test(t)), 's0: the provisional verdict');
    assert.ok(marks.s4.some((t) => /sceglie sempre una carta che rappresenta chi chiede/.test(t)), 's4: the significator');
  });
}

test('played: a visit can always be composed (some opener and some closer hold in any state)', () => {
  for (const patch of [{}, { chapter: 2, traits: { esplora: 5, parola: -4, tono: 3, rischio: 3, guida: -3 } }, { chapter: 3, verdicts: ['m07'], flags: { 'rd.same.3a': true, 'rd.same.3b': true } }]) {
    setState(patch);
    assert.ok(OPENERS.some((e) => cond(e.when)));
    assert.ok(CLOSERS.some((e) => cond(e.when)));
    for (const list of Object.values(LISTS)) for (const e of list) { cond(e.when); assert.ok(!/\{[a-zA-Z]+(:[^}]+)?\}/.test(fill(e.t)), `unfilled token in ${e.t}`); }
  }
});
