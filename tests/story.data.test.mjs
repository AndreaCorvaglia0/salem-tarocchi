// Integrity of the story data (src/data/story): speakers, choices, ids, anchors, steps,
// conditions, session leaves, line lengths, {tokens}.
import test from 'node:test';
import assert from 'node:assert/strict';
import { SCRIPTS, SESSIONS, STEPS, CAST, CLIENTS, BARKS } from '../src/data/story/index.js';
import { PEOPLE, CARD } from '../src/data/cards.base.js';

// copied from docs/CONTRACT.md, "World"
const ANCHORS = new Set([
  'village.arrival', 'village.square', 'village.malva_door', 'village.cottage_door', 'village.stall', 'village.curtain',
  'village.garden', 'village.venusglass', 'village.cart', 'village.court_door', 'village.meeting_door', 'village.shop_door',
  'village.forest_gate', 'village.trapdoor', 'malva.hearth', 'malva.table', 'cottage.table', 'cottage.bed', 'cottage.door',
  'court.chair', 'court.dock', 'court.deposit', 'court.stairs', 'meeting.bible', 'shop.counter',
  'forest.entry', 'forest.ortica_hut', 'forest.campfire', 'forest.den', 'forest.lantern', 'forest.mill', 'forest.boundary',
  'forest.pond', 'forest.graveyard', 'forest.spring',
  'depths.entry', 'depths.edera_nook', 'depths.coven', 'depths.chains', 'depths.tower', 'depths.well', 'depths.swamp', 'depths.jail',
  'shop.keeper', 'depths.coven_malva', 'depths.coven_ortica', 'depths.coven_edera', 'village.arrest_a', 'village.arrest_b', 'village.arrest_c', // world extra anchors
]);
// copied from core/cond.js TESTS
const COND_KEYS = new Set(['flag', 'notFlag', 'chapter', 'chapterMin', 'chapterMax', 'step', 'stepIn', 'has', 'lacks', 'majorsMin',
  'level', 'power', 'spread', 'trust', 'stat', 'yourCard', 'birthCard', 'sign', 'word', 'tool', 'coinsMin', 'not', 'any']);
const TOKENS = new Set(['name', 'sign', 'birthCard', 'yourCard', 'title', 'level', 'stat', 'word', 'words', 'card', 'trust', 'season', 'coins', 'majors', 'picked']);
const ACTIONS = new Set(['giveCard', 'draw', 'teach', 'lesson', 'reading', 'exam', 'session', 'xp', 'coins', 'flag', 'trust', 'point',
  'word', 'diary', 'step', 'chapter', 'travel', 'tool', 'power', 'cinema', 'wait', 'goto', 'call']);
const SPEAKERS = new Set([...Object.keys(PEOPLE), 'tu', 'narra']);
const STEP_IDS = new Set(STEPS.map((s) => s.id));
const CLIENT_IDS = new Set(CLIENTS.map((c) => c.id));

// every node of every script and session, with where it comes from
function* walk(nodes, where) {
  for (const n of nodes || []) {
    yield [n, where];
    if (n.choice) for (const o of n.choice) yield* walk(o.then, where);
    if (n.then) yield* walk(n.then, where);
    if (n.else) yield* walk(n.else, where);
  }
}
const ALL = [...Object.entries(SCRIPTS).map(([k, v]) => [`script ${k}`, v]), ...Object.entries(SESSIONS).map(([k, v]) => [`session ${k}`, v])];
const nodes = () => ALL.flatMap(([w, list]) => [...walk(list, w)]);

function checkCond(c, where) {
  if (c == null || c === true) return;
  if (Array.isArray(c)) { c.forEach((x) => checkCond(x, where)); return; }
  for (const [k, v] of Object.entries(c)) {
    assert.ok(COND_KEYS.has(k), `${where}: unknown condition key ${k}`);
    if (k === 'not') checkCond(v, where);
    if (k === 'any') v.forEach((x) => checkCond(x, where));
    if (k === 'has' || k === 'lacks' || k === 'yourCard' || k === 'birthCard') assert.ok(CARD[v], `${where}: card ${v}`);
    if (k === 'step') assert.ok(STEP_IDS.has(v), `${where}: step ${v}`);
    if (k === 'stepIn') v.forEach((s) => assert.ok(STEP_IDS.has(s), `${where}: step ${s}`));
    if (k === 'trust') assert.ok(['malva', 'ortica', 'edera', 'ginepra'].includes(v[0]), `${where}: trust ${v[0]}`);
  }
}
function texts() {
  const out = [];
  for (const [n, w] of nodes()) {
    if (n.t) out.push([n.t, w]);
    if (n.choice) n.choice.forEach((o) => out.push([o.t, w]));
    if (n.do === 'cinema') n.lines.forEach((l) => out.push([l, w]));
    if (n.do === 'diary') out.push([n.t, w]);
    if (n.observe) n.observe.forEach((o) => out.push([o.t, w]));
  }
  for (const [k, list] of Object.entries(BARKS)) {
    if (Array.isArray(list)) list.forEach((b) => out.push([b.t, `bark ${k}`]));
    else Object.values(list).forEach((t) => out.push([t, `bark ${k}`]));
  }
  for (const c of CLIENTS) for (const k of ['name', 'look', 'question', 'hello', 'thanks']) if (c[k]) out.push([c[k], `client ${c.id}`]);
  for (const s of STEPS) out.push([s.text, `step ${s.id}`]);
  return out;
}

test('every speaker exists', () => {
  for (const [n, w] of nodes()) if ('say' in n) assert.ok(SPEAKERS.has(n.say), `${w}: speaker ${n.say}`);
});

test('every choice has at least two options, each with text', () => {
  for (const [n, w] of nodes()) if (n.choice) {
    assert.ok(n.choice.length >= 2, `${w}: choice with ${n.choice.length} options`);
    for (const o of n.choice) assert.ok(typeof o.t === 'string' && o.t.length, `${w}: option without text`);
  }
});

test('every action is known and its ids exist', () => {
  for (const [n, w] of nodes()) {
    if (!('do' in n)) continue;
    assert.ok(ACTIONS.has(n.do), `${w}: action ${n.do}`);
    if (n.do === 'giveCard') assert.ok(CARD[n.id], `${w}: card ${n.id}`);
    if (n.do === 'point') { assert.ok(CARD[n.card], `${w}: card ${n.card}`); assert.ok('wcsp'.includes(n.suit) && n.suit, `${w}: suit`); }
    if (n.do === 'draw' && n.pool !== 'row') n.pool.forEach((id) => assert.ok(CARD[id], `${w}: pool card ${id}`));
    if (n.do === 'reading') assert.ok(CLIENT_IDS.has(n.client), `${w}: client ${n.client}`);
    if (n.do === 'goto') assert.ok(SCRIPTS[n.script], `${w}: goto ${n.script}`);
    if (n.do === 'session') assert.ok(SESSIONS[n.id], `${w}: session ${n.id}`);
    if (n.do === 'step') assert.ok(STEP_IDS.has(n.id), `${w}: step ${n.id}`);
    if (n.do === 'travel') assert.ok(ANCHORS.has(n.to), `${w}: anchor ${n.to}`);
    if (n.do === 'cinema' && n.pan) assert.ok(ANCHORS.has(n.pan), `${w}: pan ${n.pan}`);
    if (n.do === 'trust') assert.ok(['malva', 'ortica', 'edera', 'ginepra'].includes(n.who), `${w}: trust ${n.who}`);
    if (n.do === 'word') assert.ok(['value', 'fear', 'dream'].includes(n.k), `${w}: word ${n.k}`);
    if (n.do === 'flag') assert.equal(n.v, undefined, `${w}: flags are booleans`);
  }
});

test('choice tags point at real cards and suits', () => {
  for (const [n, w] of nodes()) if (n.choice) for (const o of n.choice) {
    if (o.tag) { assert.ok(CARD[o.tag.card], `${w}: tag ${o.tag.card}`); assert.ok(['w', 'c', 's', 'p'].includes(o.tag.suit), `${w}: suit ${o.tag.suit}`); }
    if (o.trust) for (const k of Object.keys(o.trust)) assert.ok(['malva', 'ortica', 'edera', 'ginepra'].includes(k), `${w}: trust ${k}`);
  }
});

test('every condition uses keys known to core/cond.js', () => {
  for (const [n, w] of nodes()) {
    if ('if' in n) checkCond(n.if, w);
    if (n.choice) n.choice.forEach((o) => checkCond(o.when, w));
    if (n.observe) n.observe.forEach((o) => checkCond(o.when, w));
  }
  for (const c of CAST) checkCond(c.when, `cast ${c.id}`);
  for (const [k, list] of Object.entries(BARKS)) if (Array.isArray(list)) list.forEach((b) => checkCond(b.when, `bark ${k}`));
});

test('cast: anchors, scripts, kinds', () => {
  for (const c of CAST) {
    assert.ok(ANCHORS.has(c.at), `cast ${c.id}: anchor ${c.at}`);
    assert.ok(SCRIPTS[c.script], `cast ${c.id}: script ${c.script}`);
    assert.ok(['npc', 'zone', 'prop'].includes(c.kind), `cast ${c.id}: kind`);
  }
});

test('steps: unique, anchors exist, chapters in order, short first-person lines', () => {
  assert.equal(STEP_IDS.size, STEPS.length);
  assert.ok(STEPS.length >= 25 && STEPS.length <= 35, `steps: ${STEPS.length}`);
  let ch = 0;
  for (const s of STEPS) {
    if (s.at) assert.ok(ANCHORS.has(s.at), `step ${s.id}: anchor ${s.at}`);
    assert.ok(s.chapter >= ch, `step ${s.id} goes back a chapter`); ch = s.chapter;
    assert.ok(s.text.length < 60, `step ${s.id} too long`);
  }
});

test('every step after the first is set by some script or session', () => {
  const set = new Set(nodes().filter(([n]) => n.do === 'step').map(([n]) => n.id));
  for (const s of STEPS.slice(1)) assert.ok(set.has(s.id), `step ${s.id} is never set`);
});

test('steps are set in path order inside each script', () => {
  const idx = Object.fromEntries(STEPS.map((s, i) => [s.id, i]));
  // each gate cast entry leads to a later step
  for (const c of CAST) {
    const from = c.when && !Array.isArray(c.when) && c.when.step;
    if (!from) continue;
    const later = [...walk(SCRIPTS[c.script], c.script)].filter(([n]) => n.do === 'step').map(([n]) => idx[n.id]);
    for (const l of later) assert.ok(l > idx[from], `cast ${c.id}: ${c.script} sets an earlier step than ${from}`);
  }
});

test('session leaves: s1-s3 trees have 4 leaves, each with a point, a word and a leaf flag', () => {
  for (const id of ['s1', 's2', 's3']) {
    const tree = SESSIONS[id].find((n) => n.choice);
    const leaves = [];
    for (const o of tree.choice) {
      const sub = o.then.find((n) => n.choice);
      assert.ok(sub, `${id}: second level missing`);
      leaves.push(...sub.choice);
    }
    assert.equal(leaves.length, 4, `${id}: leaves`);
    const kind = { s1: 'value', s2: 'fear', s3: 'dream' }[id];
    for (const l of leaves) {
      const p = l.then.find((n) => n.do === 'point');
      const w = l.then.find((n) => n.do === 'word');
      const f = l.then.find((n) => n.do === 'flag');
      assert.ok(p && w && f, `${id}: leaf "${l.t}"`);
      assert.equal(w.k, kind);
      assert.equal(f.k, `leaf.${kind}.${p.card}`);
    }
    const obs = SESSIONS[id].find((n) => n.observe);
    assert.ok(obs && obs.observe.length >= 5 && obs.observe.length <= 8, `${id}: observe`);
    assert.ok(SESSIONS[id].some((n) => n.pick === 'number'), `${id}: pick`);
  }
});

test('s0 asks name and birth and turns the Fool; s4 reads for herself', () => {
  const s0 = SESSIONS.s0;
  assert.ok(s0.some((n) => n.ask === 'name') && s0.some((n) => n.ask === 'birth') && s0.some((n) => n.turn === 'm00'));
  assert.ok(SESSIONS.s4.some((n) => n.do === 'reading' && n.client === 'self' && n.spread === 'celtic'));
});

test('clients: 4 per chapter plus self, complete', () => {
  for (const ch of [1, 2, 3]) assert.equal(CLIENTS.filter((c) => c.chapter === ch).length, 4);
  assert.ok(CLIENT_IDS.has('self'));
  for (const c of CLIENTS) for (const k of ['id', 'name', 'look', 'theme', 'hello', 'thanks']) assert.ok(c[k], `client ${c.id}: ${k}`);
});

test('the three forks exist with both sides', () => {
  const flags = new Set();
  for (const [n] of nodes()) if (n.choice) n.choice.forEach((o) => o.flag && flags.add(o.flag));
  for (const f of ['b1.spoke', 'b1.hid', 'b2.went', 'b2.stayed', 'b3.stealth', 'b3.open']) assert.ok(flags.has(f), f);
});

test('the story gives the story cards and every Major is obtainable', () => {
  const given = new Set();
  for (const [n] of nodes()) {
    if (n.do === 'giveCard') given.add(n.id);
    if (n.turn) given.add(n.turn);
  }
  for (const id of ['m00', 'm07', 'm19', 'm20', 'm21']) assert.ok(given.has(id), `${id} not given`);
  for (let i = 0; i < 22; i++) {
    const id = `m${String(i).padStart(2, '0')}`;
    assert.ok(CARD[id].spot || given.has(id), `${id} cannot be obtained`);
  }
});

test('no line over 160 characters; tokens are known', () => {
  for (const [t, w] of texts()) {
    assert.ok(typeof t === 'string', `${w}: missing text`);
    assert.ok(t.length <= 160, `${w}: ${t.length} chars: ${t}`);
    for (const m of t.matchAll(/\{([a-zA-Z]+)(?::[^}]+)?\}/g)) assert.ok(TOKENS.has(m[1]), `${w}: token ${m[0]}`);
  }
});
