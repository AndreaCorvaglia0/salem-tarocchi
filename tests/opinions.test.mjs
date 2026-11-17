// «Che ne pensi di lei?»: the text (data/story/opinions.js) and the rules (glue/opinions.rules.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { fresh, parseSave } from '../src/core/state.js';
import { test as cond } from '../src/core/cond.js';
import { AXES, POWERS } from '../src/core/progress.js';
import { WITCHES } from '../src/core/witches.js';
import { SCRIPTS, SESSIONS, STEPS } from '../src/data/story/index.js';
import { SPREADS } from '../src/data/spreads.js';
import { PEOPLE } from '../src/data/cards.base.js';
import { PEOPLE_OP, READER, ASKERS, LEAST_FIRST, OPINION_SCRIPTS } from '../src/data/story/opinions.js';
import * as R from '../src/glue/opinions.rules.js';

const words = (t) => t.replace(/[«»(),.;:?]/g, ' ').split(/\s+/).filter(Boolean).length;
const ids = PEOPLE_OP.map((p) => p.id);
const P = (id) => PEOPLE_OP.find((p) => p.id === id);

// every flag a scene can set: { do: 'flag' } nodes and the flags of choice options
const FLAGS = new Set();
(function walk(x) {
  if (Array.isArray(x)) return x.forEach(walk);
  if (!x || typeof x !== 'object') return;
  if (x.do === 'flag' && x.k) FLAGS.add(x.k);
  if (typeof x.flag === 'string' && 't' in x) FLAGS.add(x.flag);
  Object.values(x).forEach(walk);
})([SCRIPTS, SESSIONS]);
const STEP_IDS = new Set(STEPS.map((s) => s.id));
// every leaf of a condition names something that exists
function checkCond(c, where) {
  if (c == null) return;
  if (Array.isArray(c)) return c.forEach((x) => checkCond(x, where));
  for (const [k, v] of Object.entries(c)) {
    if (k === 'any') v.forEach((x) => checkCond(x, where));
    else if (k === 'not') checkCond(v, where);
    else if (k === 'flag' || k === 'notFlag') assert.ok(FLAGS.has(v), `${where}: no scene sets the flag "${v}"`);
    else if (k === 'step') assert.ok(STEP_IDS.has(v), `${where}: no step "${v}"`);
    else if (k === 'stepIn') v.forEach((s) => assert.ok(STEP_IDS.has(s), `${where}: no step "${s}"`));
    else if (k === 'spread') assert.ok(SPREADS[v], `${where}: no spread "${v}"`);
    else if (k === 'power') assert.ok(POWERS.includes(v), `${where}: no power "${v}"`);
    else if (k === 'stat') assert.ok(v[0] in fresh().stats, `${where}: no stat "${v[0]}"`);
    else assert.fail(`${where}: condition "${k}" is not one this test knows how to check`);
  }
}

// ---- the text
// she is never gendered: no vocatives, no participles or adjectives that agree with her
const CALL = '(ragazza|ragazzo|signorina|cara|caro|brava|bravo|figliola)';
const VOCATIVE = new RegExp(`,\\s*${CALL}\\b|\\b${CALL}\\s*[,:]|^${CALL}\\b|\\b(sei|eri) (un[ao]|la|il) \\w+`, 'i');
const TO_HER = /\b(sei|eri|sarai|saresti|fossi|ti sei|ti eri|ti ho|ti ha|ti hanno|ti avevo|ti aveva)\s+(\w+\s+)?\w+(at|it|ut)a\b/i; // «sei arrivata», «ti ho vista»
const BY_HER = /\b(sono|ero|sarei|fossi|sarò|mi sono|mi ero)\s+(\w+\s+)?(\w+(at|it|ut)[ao]|rimast[ao]|mess[ao]|pres[ao]|vist[ao]|chiest[ao]|accort[ao])\b|\b(mi ha|mi hanno|mi aveva)\s+(\w+(at|it|ut)a|vista|messa|presa)\b|\b(sono|ero|resto|mi sento)\s+(\w+\s+)?(sicur|content|grat|curios|tranquill|sol|pront|stanc|attent|cert|seren|preoccupat)[ao]\b|\bda sol[ao]\b/i;
const plain = (t, where) => {
  assert.equal(typeof t, 'string', where);
  assert.ok(!t.includes('!'), `${where}: no exclamation marks`);
  assert.ok(!/\s{2,}|^\s|\s$/.test(t), `${where}: stray spaces`);
  assert.ok(/[.?»)]$/.test(t), `${where}: ends without punctuation`);
};
const toHer = (t, where) => { plain(t, where); assert.ok(!VOCATIVE.test(t), `${where}: a gendered way of calling her`); assert.ok(!TO_HER.test(t), `${where}: genders her (${t.match(TO_HER)?.[0]})`); };
const byHer = (t, where) => { plain(t, where); assert.ok(!BY_HER.test(t), `${where}: genders her (${t.match(BY_HER)?.[0]})`); };
const between = (t, lo, hi, where) => { const n = words(t); assert.ok(n >= lo && n <= hi, `${where}: ${n} words, wanted ${lo}-${hi}: ${t}`); };
const answers = (a, where) => {
  assert.equal(a.length, 3, `${where}: three answers`);
  assert.deepEqual(a.map((x) => x.v).sort(), [-1, 0, 1], `${where}: one warm, one mixed, one wary`);
  a.forEach((x, i) => {
    byHer(x.t, `${where} a${i}`); between(x.t, 6, 18, `${where} a${i}`);
    const ax = Object.keys(x.trait);
    assert.equal(ax.length, 1, `${where} a${i}: one trait`);
    assert.ok(AXES.includes(ax[0]) && Math.abs(x.trait[ax[0]]) === 1, `${where} a${i}: trait ${ax[0]}`);
    assert.ok(!/^(mi piace|non mi piace|non (lo )?so)\.?$/i.test(x.t.trim()), `${where} a${i}: a real answer`);
  });
  assert.equal(new Set(a.map((x) => x.t)).size, 3);
};

test('the people: who they are, how she met them, what they stand for', () => {
  assert.ok(PEOPLE_OP.length >= 8);
  assert.equal(new Set(ids).size, ids.length);
  for (const w of WITCHES) assert.ok(ids.includes(w), `${w} is missing`);
  for (const p of PEOPLE_OP) {
    assert.ok(!R.RESERVED.includes(p.id), `${p.id}: a reserved key of state.opinions`);
    assert.ok(p.nome && p.detto && p.met, p.id);
    checkCond(p.met, `${p.id}.met`);
    plain(`${p.tratto}.`, `${p.id}.tratto`); between(p.tratto, 4, 14, `${p.id}.tratto`);
    assert.ok(/^[a-zà-ú]/.test(p.tratto), `${p.id}.tratto: a verb phrase, lower case («Malva, che …»)`);
  }
  assert.deepEqual([...LEAST_FIRST].sort(), [...ids].sort());
});

test('voci: at least two, by people who know them, in their own words, no spoilers without a `when`', () => {
  for (const p of PEOPLE_OP) {
    const always = p.voci.filter((v) => !v.when);
    assert.ok(p.voci.length >= 2 && p.voci.length <= 4, `${p.id}: ${p.voci.length} voci`);
    assert.ok(new Set(p.voci.map((v) => v.by)).size >= 2, `${p.id}: two different speakers`);
    assert.ok(always.length >= 1, `${p.id}: one line that needs no flag`);
    p.voci.forEach((v, i) => {
      const w = `${p.id}.voci[${i}]`;
      assert.ok(ASKERS[v.by] && (PEOPLE[v.by] || ids.includes(v.by)), `${w}: speaker ${v.by}`);
      assert.notEqual(v.by, p.id, `${w}: nobody speaks of themselves`);
      toHer(v.t, w); between(v.t, 12, 30, w);
      checkCond(v.when, `${w}.when`);
    });
    assert.equal(new Set(p.voci.map((v) => R.voceKey(p, v))).size, p.voci.length, `${p.id}: keys`);
  }
  // the Judge is spoken of only after the trial, and Edera only by those who have met her by then
  assert.ok(P('giudice').met.any.every((c) => /^trial\./.test(c.flag)));
});

test('domanda: three answers (+1, 0, -1), a valid trait, askers with a question and three replies', () => {
  for (const p of PEOPLE_OP) {
    answers(p.domanda.a, p.id);
    const by = Object.entries(p.domanda.by);
    assert.ok(by.length >= 1, `${p.id}: nobody asks`);
    for (const [asker, q] of by) {
      const w = `${p.id} by ${asker}`;
      assert.ok(ASKERS[asker] && asker !== p.id, w);
      assert.ok(asker === 'tartufo' || WITCHES.includes(asker), `${w}: askers are the witches and Tartufo`);
      assert.ok([-1, 0, 1].includes(q.own), `${w}: own`);
      toHer(q.q, `${w} q`); between(q.q, 10, 36, `${w} q`); assert.ok(q.q.includes('?') || /\.$/.test(q.q), `${w}: a question`);
      assert.equal(q.re.length, 3, `${w}: three replies`);
      q.re.forEach((t, i) => { toHer(t, `${w} re${i}`); between(t, 14, 36, `${w} re${i}`); });
    }
  }
});

test('the Reader: two pick questions with their mirrors, six to eight events that the scripts set', () => {
  assert.ok(READER.events.length >= 6 && READER.events.length <= 8);
  assert.equal(new Set(READER.events.map((e) => e.id)).size, READER.events.length);
  for (const e of READER.events) {
    assert.ok(e.when, `${e.id}: when`); checkCond(e.when, `event ${e.id}`);
    toHer(e.q, `event ${e.id} q`); between(e.q, 14, 40, `event ${e.id} q`); assert.ok(e.q.endsWith('?'));
    answers(e.a, `event ${e.id}`);
    e.a.forEach((a, i) => { toHer(a.re, `event ${e.id} re${i}`); between(a.re, 16, 40, `event ${e.id} re${i}`); });
  }
  for (const kind of ['favourite', 'least']) {
    const q = READER.pick[kind];
    toHer(q.q, kind); assert.ok(q.q.endsWith('?'));
    for (const [k, m] of Object.entries(q.mirror)) {
      assert.ok(m.includes('{detto}') && m.includes('{tratto}'), `${kind}.${k}: the person and what they stand for`);
      assert.equal(m.includes('{by}'), k !== 'none', `${kind}.${k}: {by}`);
      // filled for every person, it still reads as one or two plain lines
      for (const p of PEOPLE_OP) {
        const s = { opinions: k === 'none' ? {} : { [p.id]: { v: (kind === 'favourite') === (k === 'same') ? 1 : -1, by: 'malva' } } };
        const t = R.pickMirror(kind, p.id, s, PEOPLE_OP, READER, ASKERS);
        toHer(t, `${kind}.${k} ${p.id}`); between(t, 20, 60, `${kind}.${k} ${p.id}`);
        assert.ok(!/[{}]/.test(t) && t.includes(p.tratto) && (k === 'none' || t.includes('Malva')), t);
      }
    }
  }
  for (const k of ['lead', 'dream', 'hello', 'bye']) toHer(READER[k], k);
  for (const n of Object.values(OPINION_SCRIPTS).flat()) (function lines(x) { if (x.say) toHer(x.t, 'malva.later'); for (const k of ['then', 'else']) (x[k] || []).forEach(lines); if (x.if) checkCond(x.if, 'malva.later'); })(n);
});

// ---- the rules
const base = (extra = {}) => ({ ...fresh(), started: true, chapter: 2, step: 'c2.mill', ...extra });
const far = () => base({
  chapter: 4, step: 'post.minors', powers: { ...fresh().powers, cat: true }, spreads: { single: true, ppf: true, celtic: true },
  flags: { 'shop.open': true, 'met.ginepra': true, 'exam1.done': true, 'side.m01': true, 'side.m05': true, 'b1.spoke': true, 'side.m12': true, 'ginepra.returned': true, 'b2.went': true, 'ginepra.taken': true, 'b3.open': true, 'trial.won': true, 'ending.seen': true },
});
const ctx = (s, today = '2026-11-17') => ({ s, t: cond, today, people: PEOPLE_OP });

test('an old save without `opinions` works, and a broken one is repaired', () => {
  const old = JSON.parse(JSON.stringify(far())); delete old.opinions;
  const s = parseSave(JSON.stringify(old));
  assert.deepEqual(s.opinions, {});
  assert.equal(R.metPeople(s, cond, PEOPLE_OP).length, PEOPLE_OP.length, 'far ahead: she has met everyone');
  assert.ok(R.planChat({ speaker: 'ortica', ...ctx(s) }), 'and the first chat already brings something');
  const bad = base({ opinions: 'x' });
  assert.equal(R.norm(bad).since, R.VOICE_GAP);
  assert.equal(R.opinionOf({ opinions: { malva: 3, heard: { v: 1 } } }, 'malva'), null);
  assert.equal(R.opinionOf({ opinions: { heard: { v: 1 } } }, 'heard'), null);
  assert.equal(R.peopleOpen(fresh(), cond, PEOPLE_OP), false);
  assert.equal(R.peopleOpen(far(), cond, PEOPLE_OP), true);
});

test('nothing in the prologue or the guided opening, whoever she has met', () => {
  for (const step of R.QUIET_STEPS) { assert.ok(STEP_IDS.has(step), step); assert.equal(R.planChat({ speaker: 'malva', ...ctx({ ...far(), chapter: 1, step }) }), null); }
  assert.equal(R.planChat({ speaker: 'malva', ...ctx({ ...far(), chapter: 0 }) }), null);
  assert.equal(R.readerNext({ ...ctx({ ...far(), step: 'c1.read' }), reader: READER }), null);
});

test('nobody is asked about, or speaks of, someone she has not met', () => {
  // she knows Malva, the shopkeeper and Ginepra; she is talking to Malva
  const s = base({ chapter: 1, step: 'c1.square', flags: { 'shop.open': true, 'side.m01': true, 'met.ginepra': true } });
  const met = R.metPeople(s, cond, PEOPLE_OP).map((p) => p.id);
  assert.deepEqual(met, ['malva', 'ginepra', 'bottegaio']);
  for (const asker of Object.keys(ASKERS)) {
    for (const p of R.askable({ asker, ...ctx(s) })) { assert.ok(met.includes(p.id) && p.id !== asker); assert.ok(met.includes(asker)); }
    for (const x of R.sayable({ speaker: asker, ...ctx(s) })) { assert.ok(met.includes(x.person.id) && x.person.id !== asker && x.voce.by === asker); assert.ok(met.includes(asker), `${asker} speaks before she met them`); }
  }
  assert.deepEqual(R.askable({ asker: 'malva', ...ctx(s) }).map((p) => p.id), ['ginepra', 'bottegaio']);
  // a line with a `when` waits for its flag
  const g = (st) => R.sayable({ speaker: 'malva', ...ctx(st) }).find((x) => x.person.id === 'ginepra').voce;
  assert.equal(g(s).when, undefined);
  R.hear(s, R.voceKey(P('ginepra'), g(s)), 'd');
  assert.equal(R.sayable({ speaker: 'malva', ...ctx(s) }).some((x) => x.person.id === 'ginepra'), false, 'the arrest is not known yet');
  s.flags['ginepra.taken'] = true;
  assert.deepEqual(g(s).when, { flag: 'ginepra.taken' });
  // Hale: what Malva says depends on what happened in the square
  const hale = (flag) => R.sayable({ speaker: 'malva', ...ctx(base({ flags: { 'shop.open': true, [flag]: true } })) }).find((x) => x.person.id === 'hale').voce.when.flag;
  assert.equal(hale('b1.spoke'), 'b1.spoke'); assert.equal(hale('b1.hid'), 'b1.hid');
});

test('one question a day, never the same twice; a line every few chats; the first thing is a line', () => {
  const s = far();
  const chat = (speaker, today) => { const p = R.planChat({ speaker, ...ctx(s, today) }); R.tick(s, p); if (p?.kind === 'voce') R.hear(s, p.key, today); return p; };
  const a = chat('ortica', '2026-11-17');
  assert.equal(a.kind, 'voce'); assert.equal(a.by, 'ortica'); assert.equal(a.aside, false);
  const b = chat('ortica', '2026-11-17');
  assert.equal(b.kind, 'ask'); assert.equal(b.asker, 'ortica');
  assert.equal(b.person.id, a.person.id, 'she is asked first about the person she has just heard of');
  const r = R.answer(s, { id: b.person.id, by: 'ortica', k: 0, today: '2026-11-17' }, PEOPLE_OP);
  assert.ok(r); assert.equal(s.opinions.day, '2026-11-17');
  // the same day: no more questions from anyone, the Reader included; lines only after the gap
  assert.equal(R.canQuestion(s, '2026-11-17'), false);
  assert.equal(R.readerNext({ ...ctx(s), reader: READER }), null);
  assert.equal(chat('malva', '2026-11-17'), null, 'one chat since the last line: nothing');
  assert.equal(chat('malva', '2026-11-17').kind, 'voce', 'two chats since the last line');
  assert.equal(chat('malva', '2026-11-17'), null); assert.equal(chat('edera', '2026-11-17'), null);
  assert.equal(chat('edera', '2026-11-17').kind, 'voce');
  // the next day a question again, and never about the same person
  const d = chat('malva', '2026-11-18');
  assert.equal(d.kind, 'ask'); assert.notEqual(d.person.id, b.person.id);
  assert.equal(R.answer(s, { id: b.person.id, by: 'malva', k: 1, today: '2026-11-18' }, PEOPLE_OP), null, 'already answered');
  assert.equal(R.askable({ asker: 'ginepra', ...ctx(s, '2026-11-19') }).some((p) => p.id === b.person.id), false);
  // every line is said once, and they run out without breaking anything
  R.answer(s, { id: d.person.id, by: 'malva', k: 1, today: '2026-11-18' }, PEOPLE_OP);
  for (let i = 0; i < 200; i++) chat(['malva', 'ortica', 'edera', 'ginepra', 'tartufo', 'bottegaio'][i % 6], '2026-11-18');
  const all = PEOPLE_OP.flatMap((p) => p.voci.filter((v) => cond(v.when, s)).map((v) => R.voceKey(p, v)));
  assert.deepEqual(Object.keys(s.opinions.heard).sort(), all.sort());
  assert.equal(chat('ortica', '2026-11-18'), null);
});

test('Tartufo adds his own line, in an aside, never about who is present', () => {
  const s = far();
  for (const p of PEOPLE_OP) for (const v of p.voci) if (v.by === 'malva') R.hear(s, R.voceKey(p, v), 'd');
  s.opinions.day = '2026-11-17';
  const p = R.planChat({ speaker: 'malva', ...ctx(s), cat: true });
  assert.equal(p.kind, 'voce'); assert.equal(p.by, 'tartufo'); assert.equal(p.aside, true); assert.notEqual(p.person.id, 'malva');
  assert.equal(R.planChat({ speaker: 'malva', ...ctx(s), cat: false }), null);
});

test('what an answer does: the note, the trait, the bond when the asker feels the same, never less', () => {
  const s = far();
  // Ortica is fond of Malva: a warm answer brings her closer
  const warm = R.answer(s, { id: 'malva', by: 'ortica', k: 0, today: '2026-11-17' }, PEOPLE_OP);
  const a0 = P('malva').domanda.a[0];
  assert.deepEqual(s.opinions.malva, { v: 1, trait: a0.trait, by: 'ortica', day: '2026-11-17', text: a0.t });
  assert.deepEqual(warm, { v: 1, trait: a0.trait, bond: 'ortica', reply: P('malva').domanda.by.ortica.re[0] });
  // a wary answer about Ginepra to Malva, who loves her: no bond, and nothing is taken away
  const wary = R.answer(s, { id: 'ginepra', by: 'malva', k: 2, today: '2026-11-18' }, PEOPLE_OP);
  assert.equal(wary.v, -1); assert.equal(wary.bond, null);
  // the Judge: Ginepra is wary of him, so the wary answer is the one she shares
  assert.equal(R.answer(s, { id: 'giudice', by: 'ginepra', k: 2, today: '2026-11-19' }, PEOPLE_OP).bond, 'ginepra');
  for (const p of PEOPLE_OP) for (const [asker, q] of Object.entries(p.domanda.by)) for (let k = 0; k < 3; k++) {
    const r = R.answer(far(), { id: p.id, by: asker, k, today: 'd' }, PEOPLE_OP);
    assert.ok(r.bond === null || r.bond === asker); assert.equal(r.reply, q.re[k]);
    assert.ok(Object.values(r.trait).every((n) => Math.abs(n) === 1));
  }
  assert.equal(R.answer(s, { id: 'malva', by: 'nobody', k: 0, today: 'd' }, PEOPLE_OP), null);
  assert.equal(R.dayText('2026-11-17'), '17 novembre'); assert.equal(R.dayText(null), '');
});

test('the Reader: the latest event first, then who she likes most, later who annoys her', () => {
  const s = far();
  const next = (today) => R.readerNext({ ...ctx(s, today), reader: READER, leastFirst: LEAST_FIRST });
  const seen = [];
  for (let day = 1; day <= 12; day++) {
    const today = `2026-12-${String(day).padStart(2, '0')}`, n = next(today);
    if (!n) break;
    if (n.kind === 'event') { seen.push(n.event.id); const r = R.answerEvent(s, { id: n.event.id, k: day % 3, today }, READER); assert.equal(r.reply, n.event.a[day % 3].re); }
    else {
      seen.push(n.kind);
      assert.ok(n.ids.length >= 2 && n.ids.length <= R.MAX_PICK);
      for (const id of n.ids) assert.ok(cond(P(id).met, s));
      R.answerPick(s, { kind: n.kind, id: n.ids[0], today });
    }
    assert.equal(next(today), null, 'one a day');
  }
  // far ahead with no night in the cell: seven events, most recent first, the two picks in between
  assert.deepEqual(seen, ['trial', 'favourite', 'council', 'sonoio', 'least', 'depot', 'glass', 'square', 'stopped']);
  assert.notEqual(s.opinions.favourite.id, s.opinions.least.id);
  assert.equal(R.answerEvent(s, { id: 'trial', k: 0, today: 'x' }, READER), null, 'never twice');
  // early in the story: only what has happened
  const early = base({ chapter: 1, step: 'c1.venus', flags: { 'shop.open': true, 'exam1.done': true, 'side.m01': true }, powers: { ...fresh().powers, cat: true } });
  assert.equal(R.readerNext({ ...ctx(early), reader: READER }).event.id, 'stopped');
  early.stats.jailed = 1;
  assert.equal(R.readerNext({ ...ctx(early), reader: READER }).event.id, 'cell');
});

test('the people offered and the mirror follow what she said of them', () => {
  const s = far();
  s.opinions = { edera: { v: 1, by: 'malva' }, ortica: { v: -1, by: 'ginepra' }, malva: { v: 1, by: 'ortica' } };
  const fav = R.pickOptions('favourite', s, cond, PEOPLE_OP);
  assert.deepEqual(fav.slice(0, 2), ['malva', 'edera']); assert.ok(!fav.includes('ortica'));
  R.answerPick(s, { kind: 'favourite', id: 'edera', today: 'd' });
  const least = R.pickOptions('least', s, cond, PEOPLE_OP, LEAST_FIRST);
  assert.equal(least[0], 'ortica'); assert.deepEqual(least.slice(1), ['giudice', 'conestabile', 'bottegaio']); assert.ok(!least.includes('edera'));
  const M = READER.pick;
  const fill = (tpl, id, by) => tpl.replace('{detto}', P(id).detto).replace('{tratto}', P(id).tratto).replace('{by}', by);
  assert.equal(R.pickMirror('favourite', 'edera', s, PEOPLE_OP, READER, ASKERS), fill(M.favourite.mirror.same, 'edera', 'Malva'));
  assert.equal(R.pickMirror('favourite', 'ortica', s, PEOPLE_OP, READER, ASKERS), fill(M.favourite.mirror.changed, 'ortica', 'Ginepra'));
  assert.equal(R.pickMirror('least', 'ortica', s, PEOPLE_OP, READER, ASKERS), fill(M.least.mirror.same, 'ortica', 'Ginepra'));
  assert.equal(R.pickMirror('least', 'giudice', s, PEOPLE_OP, READER, ASKERS), fill(M.least.mirror.none, 'giudice', ''));
  assert.ok(R.pickMirror('least', 'giudice', s, PEOPLE_OP, READER, ASKERS).startsWith('Mi dici il Giudice, che fa paura'));
});

test('the page: the trait stays hidden until someone has spoken of the person', () => {
  const s = far(), p = P('ortica');
  assert.equal(R.spokenOf(s, p), false); assert.deepEqual(R.voicesHeard(s, p), []);
  R.hear(s, R.voceKey(p, p.voci[1]), '2026-11-17');
  assert.equal(R.spokenOf(s, p), true);
  assert.deepEqual(R.voicesHeard(s, p), [{ by: p.voci[1].by, t: p.voci[1].t, day: '2026-11-17' }]);
  assert.equal(R.bedTurn(s), 'reader'); s.opinions.bed = 1; assert.equal(R.bedTurn(s), 'tartufo');
});
