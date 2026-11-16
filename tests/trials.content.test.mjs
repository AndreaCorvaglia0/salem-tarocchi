// The real trials (src/data/trials/main.js, side.js), the scenes round them (data/story/scripts/trials.js),
// the library's first scene and the witches' sentences: valid for the engine, fair over the cards she can
// have at that point, three outcomes each, losses that never break the story, and a registry that hands
// them out one at a time to a new player and to an old save.
// POOLS ASSUMED (what `knownPool` gives when the trial becomes available):
//   chapter 1 (night, vigil, well): Il Matto and N of m01-m07 upright (N from the trial's `majorsMin` - 1), every subset;
//   chapter 2 (fog, kettle, grave): Il Matto, five or more of m01-m07 (the forest gate asks for six Majors),
//     any of m08-m14 up to the trial's `majorsMin`; also with the Minors 1-6 taught;
//   chapter 3 (cellars, room): the same with five or more of m08-m14 and any of m15-m18; cellars with both
//     faces (it asks for the lesson on reversed cards) and also with the court taught;
//   after the ending (dare): twenty or more of the 22 Majors, with and without reversed faces.
import test from 'node:test';
import assert from 'node:assert/strict';
import { state, setState } from '../src/core/state.js';
import { test as cond } from '../src/core/cond.js';
import { CARD, PEOPLE } from '../src/data/cards.base.js';
import { TRIALS, LIBRARY_SCRIPTS, WITCH_LINES } from '../src/data/trials/index.js';
import { SCRIPTS, CAST, STEPS, SIDE } from '../src/data/story/index.js';
import { TRIAL_SCRIPTS } from '../src/data/story/scripts/trials.js';
import { BARKS } from '../src/data/story/barks.js';
import { allAnchors } from '../src/world/maps.js';
import { faceOf, fairFaces, rightOptions, judge } from '../src/trials/ask.js';
import { runTrial, gateCards, planLoss } from '../src/trials/run.js';
import { isTopic } from '../src/trials/topics.js';
import { extrasShown, extraStatus, keyPending } from '../src/core/extras.js';

const REAL = Object.values(TRIALS).filter((d) => !d.debug);
const MAIN = REAL.filter((d) => d.main), SIDES = REAL.filter((d) => !d.main);
const seeded = (n = 7) => () => { n = (n * 16807) % 2147483647; return n / 2147483647; };
const m = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => `m${String(a + i).padStart(2, '0')}`);
const minors = (lo, hi) => Object.keys(CARD).filter((id) => CARD[id].arcana === 'minor' && CARD[id].n >= lo && CARD[id].n <= hi);
const subsets = (a, k) => (k === 0 ? [[]] : a.length < k ? [] : [...subsets(a.slice(1), k - 1).map((s) => [a[0], ...s]), ...subsets(a.slice(1), k)]);
const pick = (a, k, rng) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r.slice(0, k); };
const ROW1 = m(1, 7), ROW2 = m(8, 14), ROW3 = m(15, 18);

// -> [{ ids, reversed, name, full? }] the pools a trial is checked against
function poolsOf(id) {
  const rng = seeded(id.length * 31 + 5), out = [];
  const ch1 = (k) => { for (const s of subsets(ROW1, k)) out.push({ ids: ['m00', ...s], reversed: false, name: `m00+${s.join(',')}` }); out.push({ ids: m(0, 7), reversed: false, name: 'all of chapter 1', full: true }); };
  const later = (min2, row3, rev, extra = []) => {
    for (let i = 0; i < 150; i++) {
      const base = ['m00', ...pick(ROW1, 5 + Math.floor(rng() * 3), rng)];
      const two = pick(ROW2, Math.max(min2, Math.floor(rng() * 8)), rng), three = row3 ? pick(ROW3, Math.floor(rng() * 5), rng) : [];
      out.push({ ids: [...base, ...two, ...three, ...(i % 3 === 0 ? extra : [])], reversed: rev, name: `sample ${i}` });
    }
  };
  if (id === 'vigil') ch1(4);
  if (id === 'well') ch1(5);
  if (id === 'night') ch1(5);
  if (id === 'kettle') { later(0, false, false, minors(1, 6)); out.push({ ids: [...m(0, 14), ...minors(1, 6)], reversed: false, name: 'rich', full: true }); }
  if (id === 'fog') { later(3, false, false, minors(1, 6)); out.push({ ids: m(0, 14), reversed: false, name: 'majors only', poor: true }, { ids: [...m(0, 14), ...minors(1, 6)], reversed: false, name: 'rich', full: true }); }
  if (id === 'grave') { later(2, false, false, minors(1, 6)); out.push({ ids: [...m(0, 14), ...minors(1, 6)], reversed: false, name: 'rich', full: true }); }
  if (id === 'room') { later(5, true, false, minors(1, 10)); later(5, true, true); out.push({ ids: m(0, 18), reversed: false, name: 'majors', full: true }); }
  if (id === 'cellars') { later(5, true, true, minors(11, 14)); out.push({ ids: [...m(0, 18), ...minors(1, 14)], reversed: true, name: 'rich', full: true }, { ids: m(0, 18), reversed: true, name: 'no court', full: true, noCourt: true }); }
  if (id === 'dare') { for (let i = 0; i < 60; i++) out.push({ ids: pick(m(0, 21), 20 + Math.floor(rng() * 3), rng), reversed: i % 2 === 0, name: `sample ${i}` }); out.push({ ids: m(0, 21), reversed: true, name: 'all', full: true }); }
  return out;
}
const forksOf = (d) => d.steps.filter((s) => s.fork);
const WITCHES = ['malva', 'ortica', 'edera', 'ginepra'];
const linesIn = (d) => [
  ...d.steps.flatMap((s) => [s.t, ...(s.lines || []).map((l) => l[1]), s.witchDraw?.t, s.fork?.rule, ...(s.fork?.options || []).map((o) => o.text), ...(s.choice || []).flatMap((o) => [o.t, ...(o.then || []).map((l) => l[1])]), ...(s.safe || []).map((l) => l[1]), ...(s.caught?.lines || []).map((l) => l[1])]),
  ...Object.values(d.rooms).flatMap((r) => r.lines.map((l) => l[1])),
  ...Object.values(d.outcomes).flatMap((o) => o.lines.map((l) => l[1])), d.note,
].filter((t) => typeof t === 'string');

test('there are three main trials and six side ones, each a complete piece', () => {
  assert.deepEqual(MAIN.map((d) => d.id), ['night', 'fog', 'cellars']);
  assert.deepEqual(SIDES.map((d) => d.id), ['vigil', 'well', 'kettle', 'grave', 'room', 'dare']);
  assert.deepEqual(WITCHES.map((w) => SIDES.filter((d) => d.with === w).length), [1, 1, 1, 1], 'one side trial with each witch');
  const anchors = allAnchors();
  for (const d of REAL) {
    const w = `trial ${d.id}`;
    assert.ok(d.title && d.note && d.when && anchors[d.start?.at], `${w}: title, note, when, a real anchor`);
    assert.ok(d.study.length >= 3 && d.study.length <= 4 && d.study.every(isTopic), `${w}: three or four topics`);
    const n = forksOf(d).length;
    assert.ok(n >= 3 && n <= 5, `${w}: ${n} forks`);
    assert.ok(d.steps.some((s) => s.witchDraw && CARD[s.witchDraw.card] && s.witchDraw.t), `${w}: someone pulls a card for herself`);
    for (const k of ['perfect', 'pass', 'fail']) assert.ok(d.outcomes[k]?.lines?.length, `${w}: outcome ${k}`);
    assert.ok(d.outcomes.perfect.reward.item || d.outcomes.perfect.reward.tool, `${w}: the prize is a thing`);
    const loss = d.outcomes.fail.loss;
    assert.ok(loss.coins >= 4 && (loss.bond || loss.tool || loss.loseCard), `${w}: a real loss`);
    if (d.with) { assert.ok(WITCHES.includes(d.with)); assert.ok(d.outcomes.perfect.reward.bond === 1 && loss.bond === 1, `${w}: bond earned or lost`); }
    for (const s of d.steps) {
      if (s.fork) {
        assert.ok(['segno', 'idea', 'quesito'].includes(s.fork.kind) && s.fork.options.length >= 2 && s.fork.options.length <= 3, `${w}: fork`);
        // one line of story for the right way and one for the wrong way
        assert.ok(d.rooms[s.right]?.good === true && d.rooms[s.wrong]?.good === false, `${w}: a good and a bad room for every fork`);
        if (s.fork.kind === 'quesito') assert.ok(s.fork.rule && ['suit', 'favore', 'moto', 'arcana'].includes(s.fork.by), `${w}: a rule, and a property the feedback can name`);
        if (s.fork.kind === 'segno') assert.deepEqual(s.fork.options.map((o) => o.sign), ['go', 'slow', 'stop']);
        else for (const o of s.fork.options) assert.ok(o.tags && !/(Matto|Mago|Papessa|Sacerdotessa|Imperatr|Imperatore|Papa|Amanti|Carro|Forza|Eremita|Ruota|Giustizia|Appeso|Morte|Temperanza|Diavolo|Torre|Stella|Luna|Sole|Giudizio|Mondo)\b/.test(o.text), `${w}: an option never names a card: ${o.text}`);
      }
      for (const [who] of [...(s.lines || []), ...(s.say ? [[s.say]] : [])]) assert.ok(who === 'narra' || PEOPLE[who], `${w}: speaker ${who}`);
      if (s.escape) assert.ok(s.caught?.lines && s.safe, `${w}: both ends of the escape are told`);
    }
    for (const [k, r] of Object.entries(d.rooms)) assert.ok(d.steps.some((s) => s.right === k || s.wrong === k) && r.lines.length, `${w}: room ${k} is used`);
  }
  assert.equal(MAIN.filter((d) => d.steps.some((s) => s.escape)).length >= 2, true, 'an escape in at least two main trials');
  assert.equal(MAIN.filter((d) => d.outcomes.fail.loss.loseCard).length, 1, 'one main trial where a card is taken');
  // the kinds get harder: chapter 1 only segno and idea; chapter 3 asks for reversed faces
  assert.ok(forksOf(TRIALS.night).every((s) => s.fork.kind !== 'quesito'));
  assert.ok(forksOf(TRIALS.fog).some((s) => s.fork.kind === 'quesito') && forksOf(TRIALS.cellars).some((s) => s.fork.options.some((o) => o.tags?.rev === true)));
});

test('every fork is fair over the cards she can have: never ambiguous, at least four faces, not always the same door', () => {
  for (const d of REAL) {
    const pools = poolsOf(d.id);
    assert.ok(pools.length > 10, `${d.id}: pools`);
    forksOf(d).forEach((s, i) => {
      const { kind, options } = s.fork;
      for (const p of pools) {
        const w = `${d.id} fork ${i + 1} (${kind}) in ${p.name}`;
        for (const id of p.ids) for (const rev of p.reversed ? [false, true] : [false]) assert.ok(rightOptions(kind, options, faceOf(id, rev)).length <= 1, `${w}: ${id} points at two doors`);
        const faces = fairFaces(kind, options, p.ids, p.reversed);
        assert.ok(faces.length >= 4, `${w}: only ${faces.length} faces can be dealt`);
        if (!p.full) continue;
        const doors = new Set(faces.map((f) => rightOptions(kind, options, faceOf(f.id, f.rev))[0]));
        assert.ok(doors.size >= 2, `${w}: always the same door`);
        if (!p.noCourt && kind !== 'segno') assert.equal(doors.size, options.length, `${w}: a door no card points at`);
      }
    });
  }
  // stated exception: with no Minors taught, the suit rule of the fog always sends her up the ridge
  const suit = forksOf(TRIALS.fog).find((s) => s.fork.by === 'suit').fork;
  assert.equal(new Set(fairFaces('quesito', suit.options, m(0, 14), false).map((f) => rightOptions('quesito', suit.options, faceOf(f.id))[0])).size, 1);
});

// a player for the engine: answers right except the first `wrong` forks, is caught or not
const player = (d, { wrong = 0, caught = false } = {}) => {
  const seen = { lines: 0, rooms: [], fx: [] }; let n = 0;
  const pool = poolsOf(d.id).find((p) => p.full);
  const io = {
    say: async (ls) => { for (const [who, t] of ls) { assert.ok(who && t); seen.lines += 1; } },
    witchDraw: async () => { seen.lines += 1; },
    ask: async (fork) => {
      const f = fairFaces(fork.kind, fork.options, pool.ids, pool.reversed)[0], face = faceOf(f.id, f.rev);
      const right = rightOptions(fork.kind, fork.options, face)[0];
      const k = n++ < wrong ? (right + 1) % fork.options.length : right;
      return { k, face, decision: fork };
    },
    judge, room: async (r, id) => { seen.rooms.push(id); }, escape: async () => (caught ? 'caught' : 'safe'), choose: async () => 0,
    apply: async (fx) => { seen.fx.push(...fx); },
    plan: { loss: (loss) => planLoss(loss, { coins: 20, tools: { incense: 1, bottle: 1, pendulum: 0 }, cards: { c05: { found: true }, m00: { found: true } } }, d, { rng: () => 0, gates: gateCards(SCRIPTS, CAST, STEPS, SIDE) }) },
  };
  return { io, seen };
};
test('every trial plays through: perfect, pass and fail, with the rooms and the losses that follow', async () => {
  for (const d of REAL) {
    const a = player(d), ra = await runTrial(d, a.io);
    assert.equal(ra.outcome, 'perfect', d.id);
    assert.ok(a.seen.rooms.length === forksOf(d).length && a.seen.rooms.every((r) => d.rooms[r].good), `${d.id}: a good room after every right choice`);
    assert.ok(ra.effects.some((e) => e.item || e.tool), `${d.id}: a prize`);
    const b = player(d, { wrong: 1 }), rb = await runTrial(d, b.io);
    assert.equal(rb.outcome, 'pass', d.id);
    assert.equal(b.seen.rooms.filter((r) => !d.rooms[r].good).length, 1);
    const c = player(d, { wrong: 3, caught: true }), rc = await runTrial(d, c.io);
    assert.equal(rc.outcome, 'fail', d.id);
    assert.ok(rc.effects.some((e) => e.coins < 0), `${d.id}: the failure costs coins`);
    if (d.with) assert.ok(rc.effects.some((e) => e.bond?.who === d.with && e.bond.n < 0), `${d.id}: and the witch's bond`);
    // caught in the escape and nothing else wrong: still a pass, one error
    if (d.steps.some((s) => s.escape)) assert.equal((await runTrial(d, player(d, { caught: true }).io)).errors, 1);
  }
});

test('a failed trial never takes a card the story needs', () => {
  const gates = gateCards(SCRIPTS, CAST, STEPS, SIDE);
  for (const d of REAL) {
    const spec = d.outcomes.fail.loss.loseCard;
    if (!spec) continue;
    assert.ok(spec === 'random-minor' || (CARD[spec]?.arcana === 'minor' && !gates.has(spec)), `${d.id}: ${spec}`);
    // with every card in hand the one taken is a Minor, and with none nothing is taken
    const all = Object.fromEntries(Object.keys(CARD).map((id) => [id, { found: true }]));
    for (let i = 0; i < 40; i++) {
      const fx = planLoss(d.outcomes.fail.loss, { coins: 9, tools: {}, cards: all }, d, { rng: seeded(i + 1), gates });
      const id = fx.find((e) => e.confiscate)?.confiscate;
      assert.ok(id && CARD[id].arcana === 'minor' && !gates.has(id), `${d.id}: took ${id}`);
    }
    assert.ok(!planLoss(d.outcomes.fail.loss, { coins: 9, tools: {}, cards: { m00: { found: true } } }, d, { gates }).some((e) => e.confiscate));
  }
  for (const d of REAL) for (const r of Object.values(d.rooms)) assert.ok(!r.loss?.loseCard, `${d.id}: a room never takes a card`);
});

// ---- the registry ------------------------------------------------------------------------------
// the entries as glue/trials.js builds them
const ENTRIES = [...REAL.map((d) => ({ id: `trial.${d.id}`, kind: 'trial', text: d.note || d.title, at: d.start?.at || null, when: d.when ?? true, done: { trial: d.id }, key: !!d.main, after: d.after })),
  { id: 'library.first', kind: 'trial', key: true, text: 'x', at: 'library.desk', when: { trialPending: true }, done: { flag: 'library.first' } }];
const save = ({ chapter = 1, majors = [], flags = [], spreads = [], minorsFound = [] } = {}) => {
  setState({}); const s = state; // the live state: `majorsMin` reads it
  s.chapter = chapter; s.powers.cat = true;
  for (const id of [...majors, ...minorsFound]) s.cards[id] = { found: true };
  for (const k of flags) s.flags[k] = true;
  for (const k of spreads) s.spreads[k] = true;
  return s;
};
const finish = (s, id, result = 'perfect') => { s.trials[id] = { result, errors: 0, day: 'x', at: 1 }; s.flags[`trial.${id}.${result}`] = true; };
const open = (s) => ENTRIES.filter((e) => e.id !== 'library.first' && extraStatus(e, s, cond, ENTRIES) !== 'hidden' && extraStatus(e, s, cond, ENTRIES) !== 'done').map((e) => e.id.slice(6));
const OLD2 = () => save({ chapter: 2, majors: m(0, 9), flags: ['exam1.done', 'client.c1.widow.done'], spreads: ['single', 'ppf'] });
const ENDED = () => save({ chapter: 4, majors: m(0, 21), flags: ['exam1.done', 'client.c1.widow.done', 'lesson.reversed', 'ending.seen'], spreads: ['single', 'ppf', 'celtic'] });

test('the chains hold: after the main trials one by one, the side ones one by one', () => {
  assert.deepEqual(MAIN.map((d) => d.after || []), [[], ['trial.night'], ['trial.fog']]);
  assert.deepEqual(SIDES.map((d) => d.after || []), [[], ['trial.vigil'], ['trial.well'], ['trial.kettle'], ['trial.grave'], ['trial.room']]);
  for (const d of REAL) for (const a of d.after || []) assert.ok(ENTRIES.some((e) => e.id === a), `${d.id}: after ${a}`);
});

test('a new player meets them in order, never more than one main and one side at a time', () => {
  const s = save({ majors: m(0, 3) });
  assert.deepEqual(open(s), [], 'nothing during the opening');
  s.flags['exam1.done'] = true; s.cards.m04 = { found: true };
  assert.deepEqual(open(s), ['vigil']);
  assert.deepEqual(keyPending(s, cond, ENTRIES).map((e) => e.id), ['library.first'], 'the library first, as a key');
  s.flags['library.first'] = true; s.cards.m05 = { found: true };
  assert.deepEqual(open(s), ['night', 'vigil']);
  assert.deepEqual(keyPending(s, cond, ENTRIES).map((e) => e.id), ['trial.night']);
  finish(s, 'vigil'); assert.deepEqual(open(s), ['night', 'well']);
  finish(s, 'night', 'fail'); finish(s, 'well', 'pass');
  assert.deepEqual(open(s), [], 'a failed main trial is final, and chapter 2 has not come');
  s.chapter = 2; s.spreads.ppf = true; for (const id of m(6, 9)) s.cards[id] = { found: true };
  assert.deepEqual(open(s), ['fog', 'kettle']);
  finish(s, 'kettle'); assert.deepEqual(open(s), ['fog'], 'the widow waits until she has read for her');
  s.flags['client.c1.widow.done'] = true; assert.deepEqual(open(s), ['fog', 'grave']);
  finish(s, 'fog'); finish(s, 'grave'); assert.deepEqual(open(s), []);
  s.chapter = 3; s.spreads.celtic = true; assert.deepEqual(open(s), ['room']);
  s.flags['lesson.reversed'] = true; assert.deepEqual(open(s), ['cellars', 'room']);
  finish(s, 'cellars'); finish(s, 'room'); assert.deepEqual(open(s), []);
  s.flags['ending.seen'] = true; assert.deepEqual(open(s), ['dare']);
  finish(s, 'dare'); assert.deepEqual(open(s), []);
  assert.ok(ENTRIES.filter((e) => e.id !== 'library.first').every((e) => extraStatus(e, s, cond, ENTRIES) === 'done'));
});

test('an old save in chapter 2 and one after the ending get them from the first, one at a time', () => {
  for (const make of [OLD2, ENDED]) {
    const s = make();
    assert.deepEqual(open(s), ['night', 'vigil'], 'the first of each chain, although she is far ahead');
    assert.deepEqual(keyPending(s, cond, ENTRIES).map((e) => e.id).sort(), ['library.first', 'trial.night']);
    assert.ok(extrasShown(s, cond, ENTRIES).filter((e) => e.status === 'new' && !e.key).length <= 1, 'one announced at a time');
    // a failed side trial stays open (another day); passed, the next comes
    s.trials.vigil = { result: 'fail', errors: 3, day: 'x', at: 1 }; s.flags['trial.vigil.fail'] = true;
    assert.deepEqual(open(s), ['night', 'vigil']);
    finish(s, 'vigil', 'pass'); finish(s, 'night');
    assert.deepEqual(open(s), ['fog', 'well']);
  }
  const s = ENDED();
  const order = [];
  for (let i = 0; i < 12 && open(s).length; i++) { const id = open(s)[0]; order.push(id); finish(s, id); assert.ok(open(s).filter((x) => !TRIALS[x].main).length <= 1 && open(s).filter((x) => TRIALS[x].main).length <= 1); }
  assert.deepEqual(order.sort(), REAL.map((d) => d.id).sort(), 'after the ending every trial can be reached');
});

test('the doors: one scene for each trial, at its anchor, with the same conditions as the registry', () => {
  for (const d of REAL) {
    const id = `trial.${d.id}`, sc = TRIAL_SCRIPTS[`${id}.door`];
    assert.ok(sc && SCRIPTS[`${id}.door`] === sc, `${id}: scene registered`);
    const first = CAST.find((c) => c.id === id);
    assert.ok(first && first.script === `${id}.door` && first.at === d.start.at, `${id}: the door is the first entry of its id`);
    const offer = sc[0].then, go = sc[0].else;
    assert.ok(offer.some((n) => n.do === 'call' && n.name === 'trial.sense' && n.args[0] === d.id) && offer.some((n) => n.do === 'flag' && n.k === `${id}.offered`) && offer.some((n) => n.do === 'diary'), `${id}: sensed, offered, written down`);
    assert.ok(go.some((n) => n.do === 'call' && n.name === 'trial.start' && n.args[0] === d.id), `${id}: started`);
    if (!d.main) {
      const ch = offer.find((n) => n.choice);
      assert.ok(ch && ch.choice.some((o) => o.special && o.when), `${id}: one answer that is hers by character`);
      assert.ok(go[0].if && go[0].then.length, `${id}: who was there remembers a failure`);
    }
    for (const s of [OLD2(), ENDED()]) {
      const shown = CAST.find((c) => c.id === id && cond(c.when, s));
      assert.equal(!!shown, open(s).includes(d.id), `${id}: the door is there exactly when the registry offers it`);
    }
  }
  // prizes are named things, written in the notebook and remembered by somebody later
  const later = JSON.stringify([TRIAL_SCRIPTS, BARKS]);
  for (const d of REAL) {
    const item = d.outcomes.perfect.reward.item;
    if (!item) continue;
    assert.ok(later.includes(`item.${item}`), `${d.id}: «${item}» is remembered in a later line`);
  }
  for (const d of SIDES) assert.ok(d.outcomes.perfect.reward.item, `${d.id}: the prize is a named thing`);
});

// ---- the words ---------------------------------------------------------------------------------
const sentences = (t) => t.replace(/[«»"“”()]/g, '').split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
const words = (s) => s.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
const faults = (t) => { // the rules of scripts/prose.mjs
  const ss = sentences(t), ws = ss.map(words), out = [];
  for (let i = 0; i + 2 < ss.length; i++) if (ws[i] <= 5 && ws[i + 1] <= 5 && ws[i + 2] <= 5) out.push('three short sentences');
  if (ss.length > 1 && ws.some((n) => n <= 2)) out.push('a sentence of one or two words');
  if (/\bNon [^.?!]{1,40}[.] (Ti|Mi|Ci|Lo|La|È|Sono|Si)\b/.test(t) && ss.length >= 2 && ws[0] <= 6 && ws[1] <= 6) out.push('antithesis');
  return out;
};
test('the texts follow the writing rules, and nothing is left to write', () => {
  const texts = [...REAL.flatMap((d) => linesIn(d).map((t) => [`trial ${d.id}`, t])), ...Object.entries(WITCH_LINES).flatMap(([w, o]) => Object.values(o).map((t) => [`witch ${w}`, t]))];
  const walk = (n, w) => { if (Array.isArray(n)) return n.forEach((x) => walk(x, w)); if (!n || typeof n !== 'object') return; if (typeof n.t === 'string') texts.push([w, n.t]); for (const v of Object.values(n)) walk(v, w); };
  walk(LIBRARY_SCRIPTS, 'library');
  assert.ok(texts.length > 400);
  for (const [w, t] of texts) {
    assert.ok(!/TODO/.test(t), `${w}: ${t}`);
    assert.deepEqual(faults(t), [], `${w}: ${t}`);
    assert.ok(!/[—–]/.test(t) && !/\{[^}]*\}/.test(t.replace('{name}', '')), `${w}: dashes or unknown tokens: ${t}`);
  }
  for (const d of REAL) for (const s of d.steps) for (const o of s.fork?.options || []) assert.ok(o.text.length <= 120, `${d.id}: option too long for the phone: ${o.text}`);
});

test('the library\'s first scene and the sixteen sentences', () => {
  const sc = LIBRARY_SCRIPTS['library.first'];
  const says = sc.filter((n) => n.say).length, choices = sc.filter((n) => n.choice);
  assert.ok(says >= 10 && says + choices.length <= 18 && choices.length >= 1 && choices.length <= 2, `${says} lines, ${choices.length} choices`);
  for (const c of choices) for (const o of c.choice) assert.ok(o.trait && o.then.length, 'her answers carry a trait and get a reply');
  assert.equal(sc.at(-1).say, 'tu', 'it ends with her sitting down to study');
  for (const w of WITCHES) {
    assert.deepEqual(Object.keys(WITCH_LINES[w]), ['pari', 'prova', 'brontola', 'fredda']);
    for (const t of Object.values(WITCH_LINES[w])) { assert.ok(t.startsWith(`${PEOPLE[w].short} `), t); assert.equal(sentences(t).length, 1, t); }
  }
});
