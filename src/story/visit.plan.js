// What a visit of the Reader says, composed from the pieces in data/story/visits.js (no DOM, no
// timing: tests/story.visit.test.mjs). docs/DESIGN.md "Le visite della Lettrice".
//   planVisit({ state, talk, openers, thread, rituals, closers, test, sheetOf, force }) -> null | {
//     opener, thread, cards: [{ id, detail?, tell, words?, ask?: { q, a: [{ t, trait, re }] } }], ritual, closer }
// opener / thread / ritual / closer: the first entry `{ when, t, then? }` of its list that holds, or null.
// The order she hears: opener, thread, then per card detail -> tell -> words (-> the question), ritual, closer.
// At most three found-but-untold Majors, oldest first; null with fewer than two unless forced
// (and always with none). One card carries the question: the one whose axis is least explored.
import { AXES } from '../core/progress.js';

export const MAX_CARDS = 3;

export const untoldOf = (s) => Object.keys(s.cards || {})
  .filter((id) => /^m\d\d$/.test(id) && id !== 'm00' && s.cards[id]?.found && !s.cards[id]?.confiscated && !s.told?.[id])
  .sort((a, b) => (s.cards[a].at || 0) - (s.cards[b].at || 0) || (a < b ? -1 : 1));

// the axes a question moves (from the traits of its answers)
const axesOf = (ask) => [...new Set((ask?.a || []).flatMap((o) => Object.keys(o?.trait || {})).filter((k) => AXES.includes(k)))];
const explored = (s, k) => (s.hits?.[k]?.plus || 0) + (s.hits?.[k]?.minus || 0);
const validAsk = (ask) => !!ask && typeof ask.q === 'string' && Array.isArray(ask.a) && ask.a.filter((o) => o && o.t).length >= 2;

export function pickAsk(s, ids, talk) {
  const withAsk = ids.filter((id) => validAsk(talk?.[id]?.ask));
  if (!withAsk.length) return null;
  let best = null, bestN = Infinity;
  for (const id of withAsk) {
    const axes = axesOf(talk[id].ask);
    if (!axes.length) continue;
    const n = Math.min(...axes.map((k) => explored(s, k)));
    if (n < bestN) { bestN = n; best = id; }
  }
  return best || withAsk[0];
}

const first = (list, test) => {
  const e = Array.isArray(list) ? list.find((o) => o && (typeof o.t === 'string' || Array.isArray(o.then)) && test(o.when)) : null;
  return e ? { t: typeof e.t === 'string' ? e.t : null, then: Array.isArray(e.then) ? e.then : null } : null;
};

export function planVisit({ state: s, talk = {}, openers = [], thread = [], rituals = [], closers = [], test = () => true, sheetOf = () => ({}), force = false }) {
  const untold = untoldOf(s);
  if (!untold.length || (untold.length < 2 && !force)) return null;
  const ids = untold.slice(0, MAX_CARDS);
  const askId = pickAsk(s, ids, talk);
  const cards = ids.map((id) => {
    const T = talk[id] || {}, c = s.cards[id];
    // a card with no lines yet: what it says in a reading, from its sheet
    const tell = T.tell || sheetOf(id)?.says || sheetOf(id)?.core || null;
    const detail = c.detail && T.details?.[c.detail] ? T.details[c.detail] : null;
    const words = (c.words || []).some((w) => String(w || '').trim()) && T.words ? T.words : null;
    const out = { id, detail, tell, words };
    if (id === askId) out.ask = { q: T.ask.q, a: T.ask.a.filter((o) => o && o.t).slice(0, 2) };
    return out;
  });
  return { opener: first(openers, test), thread: first(thread, test), cards, ritual: first(rituals, test), closer: first(closers, test) };
}
