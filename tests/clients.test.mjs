// The generated clients (src/reading/clients.js, src/data/reading/people.js) and their rules (src/glue/clients.rules.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeClient, makeRefusal, streetClient, streetAsk, join, toYou, render, templatesFor, PAIRS, valuesFor, refOf } from '../src/reading/clients.js';
import { makeQuestion, AMBITI, FORME } from '../src/reading/ask.js';
import { seeded } from '../src/reading/rng.js';
import { NAMES, TIES, TEMPLATES, GREET, THANKS, REFUSALS, STREET, AMATO, CHI_CASA, CHI_ALTRI, QUANDO } from '../src/data/reading/people.js';
import { tierFor, pickVisitor, spreadFor, canQueue, pushRecent, rememberRead, readEntry, streetDue, streetPerson, STREET_GAP, REFUSE_RATE } from '../src/glue/clients.rules.js';
import { CLIENTS } from '../src/data/story/index.js';

// Italian checks every generated sentence must pass
const BAD_ART = /\b(di|a|da|su|in) (il|lo|la|i|gli|le)\b|\b(di|a|da|su|in) l'/i;
function clean(t, what) {
  assert.equal(typeof t, 'string', what);
  assert.ok(!/[{}]/.test(t), `unfilled slot in ${what}: ${t}`);
  assert.ok(!/ {2}/.test(t), `double space in ${what}: ${t}`);
  assert.ok(!BAD_ART.test(t), `article error in ${what}: ${t}`);
  assert.ok(!/ [,.?!]/.test(t), `space before punctuation in ${what}: ${t}`);
  assert.equal(t.trim(), t, `spaces at the ends of ${what}`);
}

test('the material is big enough', () => {
  assert.ok(NAMES.f.length + NAMES.m.length >= 40);
  assert.ok(TIES.length >= 30);
  for (const a of AMBITI) for (const f of FORME) {
    const list = TEMPLATES[`${a}.${f}`];
    assert.ok(list && list.length >= 4, `${a}.${f}`);
  }
  assert.equal(PAIRS.length, 30);
  for (const t of [0, 1, 2]) {
    assert.ok(GREET[t].length >= 6 && THANKS[t].length >= 6, `tier ${t}`);
    // every pair can be asked at every tier
    const pairs = new Set(templatesFor(t).map((x) => x.pair));
    assert.equal(pairs.size, 30, `tier ${t} covers every pair`);
    for (const g of ['f', 'm']) assert.ok(TIES.some((x) => x.tiers.includes(t) && x[g]), `tier ${t} has ties for ${g}`);
  }
  const ids = new Set(TIES.map((t) => t.id));
  for (const p of PAIRS) for (const tp of TEMPLATES[p]) for (const id of [...(tp.ties || []), ...(tp.notTies || [])]) assert.ok(ids.has(id), `${p}: tie ${id}`);
  assert.ok(REFUSALS.length >= 12);
  assert.ok(REFUSALS.filter((r) => r.turn).length >= 6);
  for (const r of REFUSALS) for (const k of ['death', 'illness']) if (r.kind === k && r.turn) assert.ok(!/guarir|morir|morte|vivere/i.test(r.turn.q), r.id);
  // ref.di is picked up after «Mi chiedi»: it always starts with a form of "di"
  for (const p of PAIRS) for (const tp of TEMPLATES[p]) assert.match(tp.di, /^(\{di:\w+\}|di |del |dello |della |dell'|dei |degli |delle )/, `${p}: ${tp.di}`);
});

test('grammar helpers', () => {
  assert.equal(join('di', 'il fabbro'), 'del fabbro');
  assert.equal(join('a', "l'armatore del porto"), "all'armatore del porto");
  assert.equal(join('da', 'la locandiera'), 'dalla locandiera');
  assert.equal(join('in', 'il mulino'), 'nel mulino');
  assert.equal(join('di', 'mia sorella'), 'di mia sorella');
  assert.equal(join('con', 'il mugnaio'), 'con il mugnaio');
  assert.equal(join('di', 'gli zii'), 'degli zii');
  assert.equal(toYou('la mia gallina e mio fratello'), 'la tua gallina e tuo fratello');
  assert.equal(render('{di:x} e {a:x}.', { x: 'la vicina' }), 'Della vicina e alla vicina.');
  assert.equal(render('ciao. {x} dorme.', { x: 'il gatto' }), 'Ciao. Il gatto dorme.');
});

test('2000 generated clients: correct Italian, valid questions, no repeats within the last 12', () => {
  const rng = seeded(1692);
  let recent = [];
  const last = [];
  const tiers = { 0: 0, 1: 0, 2: 0 };
  const pairs = new Set();
  for (let i = 0; i < 2000; i++) {
    const tier = i % 3;
    const c = makeClient({ tier, rng, avoid: recent });
    tiers[tier]++;
    for (const k of ['name', 'look', 'question', 'hello', 'thanks']) clean(c[k], `${c.id} ${k}`);
    assert.ok(c.question.endsWith('?'), c.question);
    assert.match(c.question, /^\p{Lu}/u);
    assert.deepEqual(makeQuestion({ ambito: c.ambito, forma: c.forma, ref: c.ref }), { ambito: c.ambito, forma: c.forma, ref: c.ref });
    clean(c.ref.di, `${c.id} ref.di`);
    assert.match(c.ref.di, /^(di|del|dello|della|dell'|dei|degli|delle)\b/, c.ref.di);
    assert.ok(!/\b(mio|mia|miei|mie)\b/.test(c.ref.di), `ref.di in the first person: ${c.ref.di}`);
    if (c.ref.chi) clean(c.ref.chi, 'ref.chi');
    assert.ok(c.pay >= [2, 5, 10][tier] && c.pay <= [3, 7, 14][tier]);
    pairs.add(`${c.ambito}.${c.forma}`);
    // the same person or question is never in the last 12
    const n = c.keys.find((k) => k.startsWith('n:')), q = c.keys.find((k) => k.startsWith('q:'));
    for (const prev of last) { assert.notEqual(prev.n, n, `name repeated: ${n}`); assert.notEqual(prev.q, q, `question repeated: ${q}`); }
    last.push({ n, q }); if (last.length > 12) last.shift();
    recent = pushRecent(recent, c.keys, 36);
  }
  assert.equal(pairs.size, 30);
});

test('deterministic with a seeded rng', () => {
  const a = makeClient({ tier: 1, rng: seeded(5) }), b = makeClient({ tier: 1, rng: seeded(5) });
  assert.deepEqual(a, b);
  assert.deepEqual(makeRefusal({ tier: 0, rng: seeded(9) }), makeRefusal({ tier: 0, rng: seeded(9) }));
});

test('every template reads correctly with every filler', () => {
  // brute force: each template x each filler of each slot it uses x both genders x every tier it has
  let n = 0;
  for (const pair of PAIRS) for (const tp of TEMPLATES[pair]) for (const g of ['f', 'm']) for (const tier of tp.t) {
    const base = valuesFor({ gender: g }, tier, () => 0, tp);
    const lists = { x: tp.x || [base.x], amato: AMATO[g], chi: CHI_CASA, vicino: CHI_ALTRI, quando: QUANDO[tier] };
    for (const [slot, list] of Object.entries(lists)) for (const v of list) {
      if (v === undefined) continue;
      const vals = { ...base, [slot]: v };
      for (const s of [tp.s, tp.q, ...GREET[tier], ...THANKS[tier]]) clean(render(s, vals), `${pair} ${s}`);
      assert.ok(render(tp.q, vals).endsWith('?'));
      const ref = refOf(tp, vals);
      clean(ref.di, `${pair} di`);
      assert.match(ref.di, /^(di|del|dello|della|dell'|dei|degli|delle)\b/, ref.di);
      n++;
    }
  }
  assert.ok(n > 1000);
});

test('every refusal reads correctly', () => {
  const rng = seeded(3);
  for (let i = 0; i < 3000; i++) {
    const r = makeRefusal({ tier: i % 3, rng });
    for (const k of ['hello', 'ask']) clean(r[k], `${r.id} ${k}`);
    assert.match(r.ask, /[?.]$/, r.ask);
    assert.ok(r.options.length >= 2 && r.options.length <= 3);
    for (const o of r.options) { clean(o.me, `${r.id} me`); clean(o.re, `${r.id} re`); }
    if (r.turn) {
      assert.equal(r.turn.forma, 'fare');
      assert.ok(r.turn.question.endsWith('?'));
      clean(r.turn.question, 'turn'); clean(r.turn.ref.di, 'turn di'); clean(r.turn.thanks, 'turn thanks');
      makeQuestion(r.turn);
    }
  }
});

test('street client: same person, one card question, small pay', () => {
  const person = { id: 'c1.baker', name: 'Tobia il fornaio', look: 'farina', first: 'Tobia il fornaio', gender: 'm', tier: null };
  const c = streetClient({ person, tier: 0, rng: seeded(2) });
  assert.equal(c.name, 'Tobia il fornaio'); assert.equal(c.pay, 1); assert.ok(c.street);
  clean(c.question, 'street q'); clean(c.thanks, 'street thanks');
  for (let i = 0; i < 50; i++) clean(streetAsk({ gender: i % 2 ? 'm' : 'f' }, seeded(i)), 'street ask');
  assert.ok(STREET.ask.length >= 4);
});

test('rules: tiers, visitors, spreads, queue', () => {
  const zero = () => 0.99;
  assert.equal(tierFor({ pop: 0, level: 1, rng: zero }), 0);
  assert.equal(tierFor({ pop: 1, level: 4, rng: zero }), 1);
  assert.equal(tierFor({ pop: 2, level: 7, rng: zero }), 2);
  assert.equal(tierFor({ pop: 2, level: 7, rng: () => 0 }), 1); // sometimes from the tier below
  assert.equal(pickVisitor({ tier: 0, rng: () => 0.1 }), 'refuse');
  assert.equal(pickVisitor({ tier: 2, rng: () => 0.2, hasBack: true }), 'back');
  assert.equal(pickVisitor({ tier: 1, rng: () => 0.9, hasBack: true }), 'gen');
  // about one in six, more at tier 0
  const rng = seeded(11);
  let n = 0;
  for (let i = 0; i < 6000; i++) if (pickVisitor({ tier: 1, rng, hasBack: true }) === 'refuse') n++;
  assert.ok(Math.abs(n / 6000 - 1 / 6) < 0.02);
  assert.ok(REFUSE_RATE[0] > REFUSE_RATE[1] && REFUSE_RATE[1] > REFUSE_RATE[2]);
  const all = { single: true, ppf: true, celtic: true };
  assert.equal(spreadFor({ tier: 0, chapter: 3, spreads: all }), 'single');
  assert.equal(spreadFor({ tier: 1, chapter: 3, spreads: all }), 'ppf');
  assert.equal(spreadFor({ tier: 2, chapter: 3, spreads: all }), 'celtic');
  assert.equal(spreadFor({ tier: 2, chapter: 1, spreads: all }), 'single');
  assert.equal(spreadFor({ tier: 2, chapter: 3, spreads: { single: true } }), 'single');
  assert.equal(spreadFor({ tier: 1, spreads: {} }), null);
  assert.equal(canQueue({ pop: 1 }), false); assert.equal(canQueue({ pop: 2 }), true); assert.equal(canQueue({ pop: 3, second: true }), false);
});

test('rules: remembering people and the street', () => {
  let read = [];
  read = rememberRead(read, readEntry('c1.baker', CLIENTS));
  read = rememberRead(read, readEntry('c0.malva', CLIENTS) || null);
  read = rememberRead(read, readEntry('self', CLIENTS));
  read = rememberRead(read, readEntry('c1.baker', CLIENTS));
  assert.equal(read.length, 1);
  const gen = makeClient({ tier: 0, rng: seeded(1) });
  read = rememberRead(read, readEntry(gen, CLIENTS));
  assert.equal(read.length, 2); assert.equal(read[1].gender, gen.gender);
  assert.equal(readEntry(streetClient({ person: read[1], rng: seeded(1) }), CLIENTS), null); // a street reading adds nobody
  const base = { chapter: 2, exams: 0, pop: 0, sinceMs: STREET_GAP[0], outdoor: true, busy: false, known: 2 };
  assert.equal(streetDue(base), true);
  assert.equal(streetDue({ ...base, chapter: 1 }), false); // chapter 1 before the first Exam
  assert.equal(streetDue({ ...base, chapter: 1, exams: 1 }), true);
  assert.equal(streetDue({ ...base, chapter: 0, exams: 3 }), false);
  assert.equal(streetDue({ ...base, busy: true }), false);
  assert.equal(streetDue({ ...base, outdoor: false }), false);
  assert.equal(streetDue({ ...base, known: 0 }), false);
  assert.equal(streetDue({ ...base, sinceMs: STREET_GAP[0] - 1 }), false);
  assert.equal(streetDue({ ...base, pop: 4, sinceMs: STREET_GAP[4] }), true); // more often with popularity
  assert.equal(streetPerson({ known: read, last: read[0].id, rng: () => 0 }).id, read[1].id);
  assert.equal(streetPerson({ known: [] }), null);
});
