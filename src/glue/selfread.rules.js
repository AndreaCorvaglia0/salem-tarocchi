// Pure rules of the readings for herself and of the diary of readings (state.readings): when the entry opens,
// which spreads she can lay, the picker of real cards, the saved shape, the cap, and the composition of a
// reading from its saved cards with a fixed seed (so a reading reopened from the diary says the same words).
// Screens: ui/selfread.js, ui/readings.js. Wiring: glue/selfread.js. Tests: tests/selfread.test.mjs.
import { makeQuestion, plan, say, seeded, AMBITI, FORME } from '../reading/index.js';
import { CARD, MAJORS, MINORS, SUITS } from '../data/cards.base.js';
import { SPREADS } from '../data/spreads.js';

export const CAP = 60; // readings kept in the diary; the oldest go
export const SELF_XP = 5; // a reading for herself, the first of each day

// The entry opens once she has read the cards to someone (any client reading counts).
export const canSelfRead = (s) => (Number(s?.stats?.readings) || 0) >= 1;
// One card or three; the Celtic cross once the story has taught it.
export const spreadsFor = (spreads = {}) => ['single', 'ppf', ...(spreads.celtic ? ['celtic'] : [])];
// Experience only for the first reading for herself of a calendar day (like the card of the day).
export const xpDue = (lastDay, today) => lastDay !== today;

// ---- the picker of real cards: suit tabs, then the card (all 78, owned or not) ----------------------
export const PICK_TABS = [['m', 'Maggiori'], ...Object.values(SUITS).map((s) => [s.id, s.name])];
export const pickerCards = (tab) => (tab === 'm' ? MAJORS : MINORS.filter((c) => c.suit === tab)).map((c) => c.id);
// Picks of one spread: one valid card per position, no card twice. -> [{ pos, card, rev }] or null.
export function realCards(spreadId, picks) {
  const sp = SPREADS[spreadId];
  if (!sp || !Array.isArray(picks) || picks.length !== sp.positions.length) return null;
  const ids = picks.map((p) => p?.card);
  if (ids.some((id) => !CARD[id]) || new Set(ids).size !== ids.length) return null;
  return sp.positions.map((p, i) => ({ pos: p.id, card: ids[i], rev: !!picks[i].rev }));
}

// ---- composing ---------------------------------------------------------------------------------------
// A 32-bit hash of what identifies a reading: the same entry always gives the same seed.
export function seedOf(e) {
  const s = `${e.at}|${e.spread}|${(e.cards || []).map((c) => `${c.pos}:${c.card}${c.rev ? 'r' : ''}`).join(',')}`;
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); }
  return x >>> 0;
}
// The reading of an entry, composed by the engine: { opening, parts, scan, closing, advice, full, missing }.
export function compose(e) {
  const q = makeQuestion({ ambito: e.question.ambito, forma: e.question.forma });
  const p = plan(q, e.spread, e.cards);
  return say(p, { rng: seeded(seedOf(e)), opening: 'never' });
}

// ---- the saved shape -----------------------------------------------------------------------------------
// { at (ISO), who: 'me' | client name, question: { ambito, forma, text? }, spread, cards: [{ pos, card, rev }],
//   closing, note, real }. Throws when the question, spread or cards are not valid.
export function makeEntry({ at = new Date().toISOString(), who = 'me', question, spread, cards, note = '', real = false }) {
  if (!SPREADS[spread]) throw new Error(`makeEntry: unknown spread "${spread}"`);
  if (!AMBITI.includes(question?.ambito) || !FORME.includes(question?.forma)) throw new Error('makeEntry: bad question');
  const n = SPREADS[spread].positions.length;
  if (!Array.isArray(cards) || cards.length !== n || cards.some((c) => !CARD[c?.card])) throw new Error('makeEntry: bad cards');
  const q = { ambito: question.ambito, forma: question.forma };
  const text = String(question.text || '').trim().slice(0, 200);
  if (text) q.text = text;
  const e = {
    at: String(at), who: String(who || 'me'), question: q, spread,
    cards: cards.map((c, i) => ({ pos: c.pos || SPREADS[spread].positions[i].id, card: c.card, rev: !!c.rev })),
    closing: '', note: String(note || '').slice(0, 600), real: !!real,
  };
  const r = compose(e);
  e.closing = r.closing || r.advice || '';
  return e;
}
// Newest first, at most `cap`. `at` identifies an entry (reopen, note, delete): a clash moves it on by 1 ms.
export const addReading = (list, entry, cap = CAP) => {
  const old = Array.isArray(list) ? list : [];
  const t = Date.parse(entry.at);
  if (!Number.isNaN(t)) {
    let n = t;
    while (old.some((e) => e.at === new Date(n).toISOString())) n++;
    if (n !== t) entry = { ...entry, at: new Date(n).toISOString() };
  }
  return [entry, ...old].slice(0, cap);
};
export const removeReading = (list, at) => (list || []).filter((e) => e.at !== at);

// A client reading, as the diary keeps it: from reading.open's options and its engine result (cards with
// pos/card/rev). null for the old flow (no cards in the result), the finale, or a client without tags.
export function clientEntry({ client, spread }, result, at) {
  if (!client || client === 'self' || !result || !Array.isArray(result.cards) || !result.cards.length) return null;
  if (!client.ambito || !client.forma) return null;
  try {
    return makeEntry({ at, who: client.name || 'Una cliente', question: { ambito: client.ambito, forma: client.forma, text: client.question || '' }, spread, cards: result.cards.map(({ pos, card, rev }) => ({ pos, card, rev })), real: false });
  } catch { return null; }
}

// "16 novembre 2026" (Italian, no library: the phone's locale may be anything).
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
export const dateIt = (iso) => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
