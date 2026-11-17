// Integrity of the story data (src/data/story): speakers, choices and their replies, traits, ids,
// anchors, steps, conditions, gates, visits, side missions, session leaves, line lengths, {tokens}.
import test from 'node:test';
import assert from 'node:assert/strict';
import { SCRIPTS, SESSIONS, STEPS, SIDE, CAST, CLIENTS, BARKS } from '../src/data/story/index.js';
import { allAnchors } from '../src/world/maps.js';
import { PEOPLE, CARD } from '../src/data/cards.base.js';

// the anchors of the real maps (src/data/world), read by the pure map parser
const ANCHORS = new Set(Object.keys(allAnchors()));
// copied from core/cond.js TESTS
const COND_KEYS = new Set(['flag', 'notFlag', 'chapter', 'chapterMin', 'chapterMax', 'step', 'stepIn', 'has', 'lacks', 'majorsMin',
  'level', 'power', 'spread', 'trust', 'stat', 'yourCard', 'birthCard', 'sign', 'word', 'tool', 'coinsMin', 'not', 'any',
  'trait', 'trend', 'steady', 'turned', 'torn', 'verdict', 'yourCardIsBirth', 'hasBirth', 'hasYear', 'element', 'modality', 'moon', 'bornOn',
  'pop', 'tartufo', 'explored', 'title', 'wrote', // 16 Nov
  'affinity', 'bond', 'attitude']); // 17 Nov: the witches (core/cond.js already knew them; no script read them)
const TOKENS = new Set(['name', 'sign', 'birthCard', 'yourCard', 'title', 'level', 'stat', 'word', 'words', 'card', 'trust', 'season', 'coins', 'majors', 'picked',
  'pickedId', 'pickedNumber', 'traits', 'trait', 'lastVerdict', 'element', 'modality', 'ruler', 'rulerCard', 'birthDay', 'dayPlanet', 'dayPlanetCard', 'moon']);
const ACTIONS = new Set(['giveCard', 'draw', 'teach', 'lesson', 'reading', 'exam', 'session', 'xp', 'coins', 'flag', 'trust', 'point',
  'word', 'diary', 'step', 'chapter', 'travel', 'tool', 'power', 'cinema', 'wait', 'goto', 'call', 'visit', 'trait', 'verdict']);
const AXES = ['esplora', 'parola', 'tono', 'rischio', 'guida'];
const POWERS = new Set(['cat', 'fire', 'sense', 'move', 'stun', 'broom']);
const TOOLS = new Set(['bottle', 'incense', 'pendulum']);
// conversations she can repeat at will: their options carry no trait (it could be farmed)
const REPEATABLE = new Set(['malva.chat', 'ortica.chat', 'edera.chat', 'trade.ginepra', 'post.ginepra', 'minors.1.lesson', 'minors.2.lesson', 'minors.3.lesson', 'minors.4.lesson', 'minors.5.lesson', 'reversed.lesson']); // + the lessons with practice questions
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
    if (k === 'trait' || k === 'trend') assert.ok(AXES.includes(v[0]), `${where}: trait ${v[0]}`);
    if (k === 'steady' || k === 'turned' || k === 'torn') assert.ok(AXES.includes(v), `${where}: axis ${v}`);
    if (k === 'power') assert.ok(POWERS.has(v), `${where}: power ${v}`);
    if (k === 'tool') assert.ok(TOOLS.has(v), `${where}: tool ${v}`);
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
    if (n.do === 'power') assert.ok(n.id === 'cat', `${w}: the story gives no power but the cat (levels give the rest): ${n.id}`);
    if (n.do === 'tool') assert.ok(TOOLS.has(n.id), `${w}: tool ${n.id}`);
  }
});

test('choice tags point at real cards and suits', () => {
  for (const [n, w] of nodes()) if (n.choice) for (const o of n.choice) {
    if (typeof o.tag === 'string') assert.ok(o.special && /^\[.+\]$/.test(o.tag), `${w}: a string tag is the label of a special answer: ${o.tag}`);
    else if (o.tag) { assert.ok(CARD[o.tag.card], `${w}: tag ${o.tag.card}`); assert.ok(['w', 'c', 's', 'p'].includes(o.tag.suit), `${w}: suit ${o.tag.suit}`); }
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

test('steps: unique, anchors exist, chapters in order, full first-person sentences that say where', () => {
  assert.equal(STEP_IDS.size, STEPS.length);
  assert.ok(STEPS.length >= 25 && STEPS.length <= 35, `steps: ${STEPS.length}`);
  let ch = 0;
  for (const s of STEPS) {
    if (s.at) assert.ok(ANCHORS.has(s.at), `step ${s.id}: anchor ${s.at}`);
    assert.ok(s.chapter >= ch, `step ${s.id} goes back a chapter`); ch = s.chapter;
    const words = s.text.split(/\s+/).filter((x) => /\p{L}/u.test(x));
    assert.ok(words.length >= 6, `step ${s.id}: not a full sentence: ${s.text}`);
    assert.ok(/^(Devo|Posso|Hanno) /.test(s.text) && /[.]$/.test(s.text), `step ${s.id}: first person, ends with a full stop: ${s.text}`);
    assert.ok(s.text.length <= 110, `step ${s.id} too long for the HUD: ${s.text.length}`);
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

test('clients: 4 per chapter plus Malva (the tutorial) and self, complete', () => {
  for (const ch of [1, 2, 3]) assert.equal(CLIENTS.filter((c) => c.chapter === ch).length, 4);
  assert.ok(CLIENT_IDS.has('self') && CLIENT_IDS.has('c0.malva'));
  for (const c of CLIENTS) if (c.id !== 'self') {
    for (const k of ['hello', 'thanks']) assert.ok(c[k].split(/(?<=[.!?])\s+/).length >= 2, `client ${c.id}: ${k} is a small story, at least two sentences`);
  }
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

test('no line over 220 characters; tokens are known', () => {
  for (const [t, w] of texts()) {
    assert.ok(typeof t === 'string', `${w}: missing text`);
    assert.ok(t.length <= 220, `${w}: ${t.length} chars: ${t}`);
    for (const m of t.matchAll(/\{([a-zA-Z]+)(?::[^}]+)?\}/g)) assert.ok(TOKENS.has(m[1]), `${w}: token ${m[0]}`);
  }
  for (const m of SIDE) assert.ok(m.note.length <= 220, `side ${m.id}: note too long`);
});

// ---- choices: what she says changes how the other answers ------------------------------------
const scriptNodes = () => Object.entries(SCRIPTS).flatMap(([k, v]) => [...walk(v, k)]);
// the first thing the player reads after picking an option
const firstReply = (nodes) => {
  for (const [n] of walk(nodes, '')) {
    if (n.t && 'say' in n) return n.t;
    if (n.do === 'cinema') return n.lines[0];
    if (n.do === 'call') return `call ${n.name}`;
  }
  return null;
};

test('every choice option has a reply specific to it', () => {
  for (const [n, w] of scriptNodes()) if (n.choice) {
    const replies = n.choice.map((o) => firstReply(o.then));
    n.choice.forEach((o, i) => assert.ok(replies[i], `${w}: "${o.t}" has no reply of its own`));
    assert.equal(new Set(replies).size, replies.length, `${w}: two options get the same reply: ${replies[0]}`);
  }
});

test('options are sentences she would say or do; each carries a trait and the two pull different ways', () => {
  for (const [n, w] of scriptNodes()) if (n.choice) {
    for (const o of n.choice) {
      assert.ok(/[.!?»]$/.test(o.t) && o.t.split(/\s+/).length >= 3, `${w}: option is not a sentence: ${o.t}`);
      if (o.trait) {
        const ks = Object.keys(o.trait);
        assert.ok(ks.length >= 1 && ks.length <= 2, `${w}: one or two axes: ${o.t}`);
        for (const k of ks) { assert.ok(AXES.includes(k), `${w}: axis ${k}`); assert.ok(Math.abs(o.trait[k]) === 1, `${w}: one point at a time: ${o.t}`); }
      }
    }
    if (REPEATABLE.has(w)) { n.choice.forEach((o) => assert.equal(o.trait, undefined, `${w}: a repeatable chat must not move traits`)); continue; }
    n.choice.forEach((o) => assert.ok(o.trait, `${w}: option without trait: ${o.t}`));
    const sig = n.choice.map((o) => JSON.stringify(Object.entries(o.trait).sort()));
    assert.equal(new Set(sig).size, sig.length, `${w}: two options pull the same way: ${n.choice[0].t}`);
  }
});

// ---- the portrait in the scenes ---------------------------------------------------------------
const hasTraitCond = (c) => {
  if (c == null || c === true) return false;
  if (Array.isArray(c)) return c.some(hasTraitCond);
  return Object.entries(c).some(([k, v]) => ['trait', 'steady', 'torn', 'turned'].includes(k) || ((k === 'not' || k === 'any') && hasTraitCond(v)));
};
test('each main character has at least four lines that only appear when a trait is marked', () => {
  const count = {};
  const add = (who) => { count[who] = (count[who] || 0) + 1; };
  const under = (nodes, on) => {
    for (const n of nodes || []) {
      const here = on || ('if' in n && hasTraitCond(n.if));
      if (on && 'say' in n) add(n.say);
      if (n.choice) n.choice.forEach((o) => under(o.then, on));
      under(n.then, here); under(n.else, on);
    }
  };
  Object.values(SCRIPTS).forEach((v) => under(v, false));
  for (const [who, list] of Object.entries(BARKS)) if (Array.isArray(list)) list.forEach((b) => { if (hasTraitCond(b.when)) add({ constable: 'conestabile', judge: 'giudice' }[who] || who); });
  for (const who of ['malva', 'ortica', 'edera', 'ginepra', 'giudice', 'tartufo']) assert.ok((count[who] || 0) >= 4, `${who}: ${count[who] || 0} trait lines`);
});

// ---- visits, gates, errands, side missions ----------------------------------------------------
test('the Reader visits twice inside each chapter; the long sessions close the chapters', () => {
  const per = { 1: 0, 2: 0, 3: 0 };
  for (const [k, v] of Object.entries(SCRIPTS)) {
    const ch = (k.match(/^(?:client\.)?c([123])\b/) || [])[1];
    const n = [...walk(v, k)].filter(([x]) => x.do === 'visit').length;
    if (n) { assert.ok(ch, `${k}: a visit outside the chapters`); per[ch] += n; }
  }
  assert.deepEqual(per, { 1: 2, 2: 2, 3: 2 });
  const sessionIn = (script, id) => [...walk(SCRIPTS[script], script)].some(([n]) => n.do === 'session' && n.id === id);
  assert.ok(sessionIn('c1.gate', 's1') && sessionIn('c2.arrest', 's2') && sessionIn('f.dawn', 's3') && sessionIn('f.last', 's4'));
});

const condHas = (c, key, val) => {
  if (c == null || c === true) return false;
  if (Array.isArray(c)) return c.some((x) => condHas(x, key, val));
  return Object.entries(c).some(([k, v]) => (k === key && JSON.stringify(v) === JSON.stringify(val)) || ((k === 'not' || k === 'any') && condHas(v, key, val)));
};
test('two rank gates: the forest asks for a Fattucchiera, the trapdoor for a Strega; both refuse and remember', () => {
  for (const [script, level, refused, chapterN] of [['c1.gate', 4, 'gate1.refused', 2], ['c3.trapdoor', 7, 'gate2.refused', 3]]) {
    const top = SCRIPTS[script][0];
    assert.ok('if' in top && condHas(top.if, 'level', level), `${script}: no level ${level} gate`);
    assert.ok(top.else?.length, `${script}: no refusal`);
    const flagsSet = (nodes) => [...walk(nodes, script)].filter(([n]) => n.do === 'flag').map(([n]) => n.k);
    assert.ok(flagsSet(top.else).includes(refused), `${script}: the refusal is not remembered`);
    assert.ok([...walk(top.then, script)].some(([n]) => 'if' in n && condHas(n.if, 'flag', refused)), `${script}: no callback when she comes back ready`);
    assert.ok([...walk(top.then, script)].some(([n]) => n.do === 'chapter' && n.n === chapterN), `${script}: the chapter starts on acceptance`);
    assert.equal(STEPS.find((s) => s.id === script).rank, level);
  }
});

test('three errands, each a step with its place: the shop, the washerwoman, the mill', () => {
  const at = Object.fromEntries(STEPS.map((s) => [s.id, s.at]));
  assert.equal(at['c1.shop'], 'shop.counter');
  assert.equal(at['c1.deliver'], 'village.meeting_door');
  assert.equal(at['c2.mill'], 'forest.mill');
  // the incense is bought inside the story: she cannot fail to have it
  assert.ok([...walk(SCRIPTS['c1.shop'], '')].some(([n]) => n.do === 'tool' && n.id === 'incense'));
});

test('side missions: about eight, each given by a conversation, at the hiding place of its card', () => {
  assert.ok(SIDE.length >= 7 && SIDE.length <= 9, `side missions: ${SIDE.length}`);
  const flags = new Set(nodes().filter(([n]) => n.do === 'flag').map(([n]) => n.k));
  for (const m of SIDE) {
    assert.ok(ANCHORS.has(m.at), `${m.id}: anchor ${m.at}`);
    assert.ok(m.when?.flag && flags.has(m.when.flag), `${m.id}: nobody gives it`);
    assert.ok(CARD[m.done?.has], `${m.id}: done`);
    assert.equal(CARD[m.done.has].spot, m.at, `${m.id}: the note is not at the card's hiding place`);
    assert.ok([1, 2, 3].includes(m.chapter) && CARD[m.done.has].row === m.chapter, `${m.id}: chapter`);
    assert.ok(/[.]$/.test(m.note) && m.note.split(/\s+/).length >= 8, `${m.id}: the note is one full sentence`);
  }
});

test('the small cards: first Minor, first duplicate, swapping with Ginepra', () => {
  for (const k of ['minor.first', 'minor.dup', 'trade.ginepra', 'fog.lost']) assert.ok(SCRIPTS[k], k);
  assert.ok([...walk(SCRIPTS['trade.ginepra'], '')].some(([n]) => n.do === 'call' && n.name === 'trade.open'));
  for (const on of ['minor', 'minor.dup']) assert.ok(BARKS.tartufo.some((b) => b.on === on), `tartufo bark ${on}`);
});

test('nothing speaks of what the game no longer has', () => {
  for (const [t, w] of texts()) assert.ok(!/setaccio|porte sigillate|vista lunga|luce grande/i.test(t), `${w}: ${t}`);
});
