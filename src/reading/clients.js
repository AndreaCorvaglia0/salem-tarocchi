// The generated clients (docs/READING.md, "Le declinazioni"): a person (a first name and a trade or a tie
// to the village), a situation and a question built from a template for one of the 30 pairs ambito x forma,
// with the details the reading picks up (ref.di, ref.chi, ref.quando). Pure and deterministic with a
// seeded rng. The Italian material is in src/data/reading/people.js.
//   makePerson({ tier, rng, avoid })                 -> { first, gender, tie, name, look, keys }
//   makeClient({ tier, rng, avoid, person? })        -> a client for reading.open (see below)
//   streetClient({ person, tier, rng, avoid })       -> the same person, a one-card question in the street
//   makeRefusal({ tier, rng, avoid })                -> a visitor she sends away (or turns to a reading)
// avoid: keys of recent clients ('n:<first>', 'q:<template>', 't:<tie>', 'r:<refusal>'); the first two
// and refusals are never repeated, ties only when nothing else is left.
import { makeQuestion } from './ask.js';
import { pick } from './rng.js';
import { NAMES, TIES, TEMPLATES, CHI_CASA, CHI_ALTRI, AMATO, SPOSO, QUANDO, GREET, THANKS, REFUSALS, STREET } from '../data/reading/people.js';

// ---- grammar -----------------------------------------------------------------------------------------
const JOIN = {
  di: { il: 'del', lo: 'dello', la: 'della', "l'": "dell'", i: 'dei', gli: 'degli', le: 'delle' },
  a: { il: 'al', lo: 'allo', la: 'alla', "l'": "all'", i: 'ai', gli: 'agli', le: 'alle' },
  da: { il: 'dal', lo: 'dallo', la: 'dalla', "l'": "dall'", i: 'dai', gli: 'dagli', le: 'dalle' },
  su: { il: 'sul', lo: 'sullo', la: 'sulla', "l'": "sull'", i: 'sui', gli: 'sugli', le: 'sulle' },
  in: { il: 'nel', lo: 'nello', la: 'nella', "l'": "nell'", i: 'nei', gli: 'negli', le: 'nelle' },
};
// a preposition before a noun phrase: di + il fabbro -> del fabbro, a + l'armatore -> all'armatore
export function join(prep, np) {
  if (prep === 'con' || !JOIN[prep]) return `${prep} ${np}`;
  const m = /^(il|lo|la|i|gli|le) (.*)$/.exec(np) || /^(l')(.*)$/.exec(np);
  if (!m) return `${prep} ${np}`;
  const art = JOIN[prep][m[1]];
  return art.endsWith("'") ? `${art}${m[2]}` : `${art} ${m[2]}`;
}
// the client's words said back to them: mia sorella -> tua sorella
const YOU = { mio: 'tuo', mia: 'tua', miei: 'tuoi', mie: 'tue', nostro: 'vostro', nostra: 'vostra', nostri: 'vostri', nostre: 'vostre' };
export const toYou = (s) => String(s).replace(/\b(mio|mia|miei|mie|nostro|nostra|nostri|nostre)\b/g, (w) => YOU[w]);
const cap = (s) => s.replace(/^\s*\S/, (c) => c.toUpperCase()).replace(/([.!?] )(\p{Ll})/gu, (_, a, b) => a + b.toUpperCase());

// fill {slot} and {prep:slot}; vals: { name: string }; you: turn the fillers into the second person
const SLOT = /\{(?:(di|a|da|su|in|con):)?(\w+)\}/g;
export function render(str, vals, { you = false, capital = true } = {}) {
  const out = String(str).replace(SLOT, (m, prep, name) => {
    if (!(name in vals)) return m;
    let v = vals[name];
    if (you) v = toYou(v);
    return prep ? join(prep, v) : v;
  });
  return capital ? cap(out) : out;
}
const slotsIn = (...strs) => new Set(strs.join(' ').match(SLOT)?.map((m) => m.replace(/[{}]/g, '').split(':').pop()) || []);

// ---- people --------------------------------------------------------------------------------------------
// the ties of a tier (or the ones a template names, any tier), minus the ones it excludes
const tiesFor = (tier, gender, only = null, not = null) => TIES.filter((t) => (only ? only.includes(t.id) : t.tiers.includes(tier)) && !(not || []).includes(t.id) && t[gender]);
const PEOPLE_SLOTS = ['amato', 'sposo', 'chi', 'vicino'];

// first try: nothing of avoid; then soft keys (ties) may repeat
function choose(list, keyOf, avoid, rng, soft = false) {
  const free = list.filter((x) => !avoid.has(keyOf(x)));
  if (free.length) return pick(free, rng);
  return soft || !list.length ? pick(list, rng) : null;
}

export function makePerson({ tier = 0, rng = Math.random, avoid = [], only = null, not = null } = {}) {
  const av = new Set(avoid);
  tier = clampTier(tier);
  // a gender with free names; ties of that gender in this tier
  const genders = ['f', 'm'].filter((g) => NAMES[g].some((n) => !av.has(`n:${n}`)) && tiesFor(tier, g, only, not).length);
  const gender = pick(genders.length ? genders : ['f', 'm'].filter((g) => tiesFor(tier, g, only, not).length), rng);
  const first = choose(NAMES[gender], (n) => `n:${n}`, av, rng, true);
  const tie = choose(tiesFor(tier, gender, only, not), (t) => `t:${t.id}`, av, rng, true);
  return { first, gender, tier, tie: tie.id, name: `${first} ${tie[gender]}`, look: tie.look, keys: [`n:${first}`, `t:${tie.id}`] };
}

const clampTier = (t) => Math.max(0, Math.min(2, Math.round(Number(t) || 0)));
export const PAIRS = Object.keys(TEMPLATES);
export const templatesFor = (tier) => PAIRS.flatMap((pair) => TEMPLATES[pair].map((tp, i) => ({ ...tp, pair, id: `${pair}.${i}` })).filter((tp) => tp.t.includes(tier)));

// the values of every slot a template (and the greeting/thanks) may use
export function valuesFor(person, tier, rng, tp = {}) {
  const g = person.gender, beloved = g === 'f' ? 'm' : 'f';
  return {
    o: g === 'f' ? 'a' : 'o',
    gli: beloved === 'm' ? 'gli' : 'le', lo: beloved === 'm' ? 'lo' : 'la', lui: beloved === 'm' ? 'lui' : 'lei',
    amato: pick(AMATO[g], rng), sposo: SPOSO[g], chi: pick(CHI_CASA, rng), vicino: pick(CHI_ALTRI, rng),
    quando: pick(QUANDO[tier], rng), ...(tp.x ? { x: pick(tp.x, rng) } : {}),
  };
}
export const refOf = (tp, vals) => {
  const used = slotsIn(tp.s, tp.q, tp.di);
  const ref = { di: render(tp.di, vals, { you: true, capital: false }) };
  const who = PEOPLE_SLOTS.find((k) => used.has(k));
  if (who) ref.chi = toYou(vals[who]);
  if (used.has('quando')) ref.quando = vals.quando;
  return ref;
};

export const PAY = { 0: [2, 3], 1: [5, 7], 2: [10, 14] };
const payFor = (tier, rng) => { const [a, b] = PAY[tier]; return a + Math.floor(rng() * (b - a + 1)); };

// The client: { id, gen: true, tier, name, look, first, gender, tie, question, ambito, forma, ref, hello,
// thanks, pay, keys }. The same shape as the story's clients (data/story/clients.js), so reading.open
// takes it as `client`.
export function makeClient({ tier = 0, rng = Math.random, avoid = [], person = null } = {}) {
  tier = clampTier(tier);
  const av = new Set(avoid);
  // a known person (the street) takes only questions that fit anyone
  const pool = templatesFor(tier).filter((x) => !person || (!x.ties && !x.notTies));
  const tp = choose(pool, (x) => `q:${x.id}`, av, rng, true);
  const p = person || makePerson({ tier, rng, avoid, only: tp.ties || null, not: tp.notTies || null });
  const [ambito, forma] = tp.pair.split('.');
  const vals = valuesFor(p, tier, rng, tp);
  const ref = refOf(tp, vals);
  const q = makeQuestion({ ambito, forma, ref });
  return {
    id: `gen.${tp.id}.${p.first}.${p.tie}`, gen: true, tier,
    name: p.name, look: p.look, first: p.first, gender: p.gender, tie: p.tie,
    question: render(tp.q, vals), ambito: q.ambito, forma: q.forma, ref: q.ref,
    hello: `${render(pick(GREET[tier], rng), vals)} ${render(tp.s, vals)}`,
    thanks: render(pick(THANKS[tier], rng), vals),
    pay: payFor(tier, rng),
    keys: [...new Set([...(p.keys || [`n:${p.first}`]), `q:${tp.id}`])],
  };
}

// Someone she has read for, in the street: one card, a small pay. person: { first, gender, name, look, tie? }
export const STREET_PAY = { 0: 1, 1: 2, 2: 4 };
export function streetClient({ person, tier = 0, rng = Math.random, avoid = [] } = {}) {
  tier = clampTier(tier);
  const p = { ...person, keys: [`n:${person.first}`] };
  const c = makeClient({ tier, rng, avoid, person: p });
  const vals = { o: p.gender === 'f' ? 'a' : 'o' };
  return { ...c, id: `street.${c.id}`, street: true, name: person.name, look: person.look || '', hello: STREET.hello, thanks: render(pick(STREET.thanks, rng), vals), pay: STREET_PAY[tier] };
}
// her first exchange in the street (the stranger's line), with the client's endings
export const streetAsk = (person, rng = Math.random) => render(pick(STREET.ask, rng), { o: person?.gender === 'm' ? 'o' : 'a' });

// A visitor she sends away: { id, kind, person, name, look, hello, ask, options: [{ id, me, re, trait }],
// turn: a client for reading.open (forma 'fare') or null, keys }.
const TRAIT = { kind: { tono: 1 }, curt: { tono: -1 }, turn: { tono: 1 } };
export function makeRefusal({ tier = 0, rng = Math.random, avoid = [] } = {}) {
  tier = clampTier(tier);
  const av = new Set(avoid);
  const r = choose(REFUSALS, (x) => `r:${x.id}`, av, rng, true);
  const p = makePerson({ tier, rng, avoid });
  const vals = valuesFor(p, tier, rng);
  const R = (s) => render(s, vals);
  const options = [
    { id: 'kind', me: R(r.kind_.me), re: R(r.kind_.re), trait: TRAIT.kind },
    { id: 'curt', me: R(r.curt.me), re: R(r.curt.re), trait: TRAIT.curt },
  ];
  let turn = null;
  if (r.turn) {
    options.push({ id: 'turn', me: R(r.turn.me), re: R(r.turn.re), trait: TRAIT.turn });
    const q = makeQuestion({ ambito: r.turn.ambito, forma: 'fare', ref: { di: render(r.turn.di, vals, { you: true, capital: false }) } });
    turn = {
      id: `gen.turn.${r.id}.${p.first}`, gen: true, tier, name: p.name, look: p.look, first: p.first, gender: p.gender, tie: p.tie,
      question: R(r.turn.q), ambito: q.ambito, forma: q.forma, ref: q.ref,
      hello: R(r.turn.re), thanks: R(r.turn.thanks), pay: payFor(tier, rng),
    };
  }
  return { id: r.id, kind: r.kind, person: p, name: p.name, look: p.look, hello: R(r.hello), ask: R(r.ask), options, turn, keys: [...p.keys, `r:${r.id}`] };
}
