// The rules of the sibyl pairs game (notes/sibilla-coppie.md), pure: no DOM, no Phaser. Tested by
// tests/sibylpairs.test.mjs. There is no right or wrong anywhere here: a round records what she said, and the
// first few rounds of a day leave a mark on the figures she used.
//   state.sibylPlay = { day, today, plays, rounds, seen: { n: { c, with, t } }, mine: [{ cards, t, at }] }
//     day/today  the day (YYYY-MM-DD) and how many rounds counted that day (at most PER_DAY)
//     plays      rounds that counted, ever; rounds: rounds played, ever (the two-or-three rhythm)
//     seen[n]    marks on figure n: c rounds that counted, and the last one (with whom, what she said)
//     mine       her own words, the last MINE_KEEP (for Ginepra's chain later)
import { SIBYL } from '../data/sibyl.js';
import { PIECES, QUESTIONS, PAIRS, GINEPRA } from '../data/sibylpairs.js';
import { firstTold } from './collect.rules.js';

export const MIN_FIGURES = 4; // she can play once she owns four
export const PER_DAY = 3; // rounds a day that leave a mark
export const THREE_AFTER = 6; // counted rounds before three figures can be laid
export const THREE_MIN = 6; // figures she needs for three
export const MINE_KEEP = 12;
export const MARKS_SHOWN = 5; // dots under a figure in the album

export const freshPlay = () => ({ day: null, today: 0, plays: 0, rounds: 0, seen: {}, mine: [] });
const obj = (v) => v && typeof v === 'object' && !Array.isArray(v);
// mend whatever an old or odd save holds
export function normPlay(p) {
  const f = freshPlay();
  if (!obj(p)) return f;
  return {
    day: typeof p.day === 'string' ? p.day : null,
    today: Math.max(0, Math.floor(Number(p.today) || 0)),
    plays: Math.max(0, Math.floor(Number(p.plays) || 0)),
    rounds: Math.max(0, Math.floor(Number(p.rounds) || 0)),
    seen: obj(p.seen) ? Object.fromEntries(Object.entries(p.seen).filter(([k, v]) => SIBYL[k] && obj(v)).map(([k, v]) => [k, { c: Math.max(0, Math.floor(Number(v.c) || 0)), with: Array.isArray(v.with) ? v.with.filter((n) => SIBYL[n]) : [], t: typeof v.t === 'string' ? v.t : '' }])) : {},
    mine: Array.isArray(p.mine) ? p.mine.filter((m) => obj(m) && typeof m.t === 'string').slice(0, MINE_KEEP) : [],
  };
}
const playOf = (s) => (s.sibylPlay = normPlay(s.sibylPlay));

export const owned = (s) => Object.keys(s.oracle || {}).map(Number).filter((n) => SIBYL[n]).sort((a, b) => a - b);
// four figures, and Ginepra has told her what they are (before that she does not know they are read together)
export const canPlay = (s) => owned(s).length >= MIN_FIGURES && firstTold(s, 'sibyl');
// rounds that still leave a mark today
export const leftToday = (s, day) => { const p = normPlay(s.sibylPlay); return p.day === day ? Math.max(0, PER_DAY - p.today) : PER_DAY; };
export const marksOf = (s, n) => normPlay(s.sibylPlay).seen[n]?.c || 0;
export const lastOf = (s, n) => normPlay(s.sibylPlay).seen[n] || null;
// two figures, and after THREE_AFTER counted rounds (with THREE_MIN figures) three every other round
export function sizeOf(s) {
  const p = normPlay(s.sibylPlay);
  return p.plays >= THREE_AFTER && owned(s).length >= THREE_MIN && p.rounds % 2 === 1 ? 3 : 2;
}

const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length) % arr.length];
const shuffle = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const pairKey = (a, b) => `${a}>${b}`;
const sameSet = (x, y) => !!x && !!y && x.length === y.length && x.every((n) => y.includes(n));

// Lay the cards: only figures she owns, never the very same set as last time; a pair written by hand comes
// up a bit more often when she owns both. -> { cards, q }
export function deal(s, rnd = Math.random, { last = null, lastQ = null } = {}) {
  const have = owned(s), size = Math.min(sizeOf(s), have.length);
  let cards = null;
  if (size === 2) {
    const hand = Object.keys(PAIRS).map((k) => k.split('>').map(Number)).filter(([a, b]) => have.includes(a) && have.includes(b) && !sameSet([a, b], last));
    if (hand.length && rnd() < 0.4) cards = pick(hand, rnd);
  }
  for (let i = 0; !cards && i < 12; i++) { const c = shuffle(have, rnd).slice(0, size); if (!sameSet(c, last) || i === 11) cards = c; }
  const qs = QUESTIONS.filter((q) => q.id !== lastQ);
  return { cards, q: pick(qs, rnd).id };
}

// ---- words ----
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
export const nameOf = (n) => SIBYL[n].name.toLowerCase();
// le nuvole, i topi, gli uccelli: the verb agrees
export const plural = (n) => /^(i|gli|le) /.test(nameOf(n));
const fill = (t, cards) => t.replace(/\{([abcA])\}/g, (_, k) => { const n = cards[{ a: 0, b: 1, c: 2, A: 0 }[k]]; const nm = n ? nameOf(n) : ''; return k === 'A' ? cap(nm) : nm; });
const mix = (a, b) => `${cap(PIECES[a].noun)} ${PIECES[b].tint}.`;

// Three phrasings for the cards she turned, in the order shown: [{ kind, t }]
export function options(cards, rnd = Math.random) {
  const [a, b, c] = cards, A = PIECES[a], B = PIECES[b];
  if (cards.length === 2) {
    const hand = PAIRS[pairKey(a, b)];
    if (hand) return hand.say.map((t) => ({ kind: 'hand', t }));
    return shuffle([{ kind: 'mix', t: mix(a, b) }, { kind: 'flip', t: mix(b, a) }, { kind: 'story', t: `Prima ${A.event}, poi ${B.event}.` }], rnd);
  }
  const C = PIECES[c];
  return shuffle([
    { kind: 'three3', t: `${cap(A.noun)} ${B.tint}, e alla fine ${C.event}.` },
    { kind: 'story', t: `Prima ${A.event}, poi ${B.event}, e alla fine ${C.event}.` },
    { kind: 'centre', t: `Al centro ${B.noun}, tra ${A.noun} e ${C.noun}.` },
  ], rnd);
}

// How the cards are usually read: the first is what it is about, the second gives it its colour; three are read
// two by two. -> { how, t }: `how` names the roles with the keywords, `t` is the reading.
export function tradition(cards) {
  const [a, b, c] = cards, k = (n) => SIBYL[n].keys[0];
  if (cards.length === 2) {
    const hand = PAIRS[pairKey(a, b)];
    return { how: `${cap(nameOf(a))} ${plural(a) ? 'dicono' : 'dice'} di che cosa si parla (${k(a)}); ${nameOf(b)} ci ${plural(b) ? 'mettono' : 'mette'} il colore (${k(b)}).`, t: hand ? hand.trad : mix(a, b) };
  }
  return { how: `Si leggono a due a due: ${nameOf(a)} con ${nameOf(b)}, poi ${nameOf(b)} con ${nameOf(c)}.`, t: `${cap(PIECES[a].noun)} ${PIECES[b].tint}; e poi ${PIECES[b].noun} ${PIECES[c].tint}.` };
}

// What Ginepra says: her own reading of a pair written by hand, otherwise a comment on what she chose.
export function ginepra(cards, kind, rnd = Math.random) {
  const hand = cards.length === 2 ? PAIRS[pairKey(cards[0], cards[1])] : null;
  if (hand && kind !== 'own') return hand.gin;
  const pool = [...(GINEPRA[kind] || []), ...(kind === 'own' ? [] : GINEPRA.any)];
  return fill(pick(pool.length ? pool : GINEPRA.any, rnd), cards);
}

// Record a round: -> { counted, left }. `choice` = { kind, t } (kind 'own' for her own words).
export function record(s, cards, choice, day, now = Date.now()) {
  const p = playOf(s);
  if (p.day !== day) { p.day = day; p.today = 0; }
  p.rounds += 1;
  const t = String(choice?.t || '').trim().slice(0, 140);
  if (choice?.kind === 'own' && t) { p.mine.unshift({ cards: [...cards], t, at: now }); p.mine = p.mine.slice(0, MINE_KEEP); }
  const counted = p.today < PER_DAY;
  if (counted) {
    p.today += 1; p.plays += 1;
    for (const n of cards) { const m = p.seen[n] || { c: 0 }; p.seen[n] = { c: m.c + 1, with: cards.filter((x) => x !== n), t }; }
  }
  return { counted, left: Math.max(0, PER_DAY - p.today) };
}
