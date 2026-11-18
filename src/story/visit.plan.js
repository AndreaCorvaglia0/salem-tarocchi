// What a visit of the Reader says, composed from the pieces in data/story/visits.js (no DOM, no
// timing: tests/story.visit.test.mjs). docs/DESIGN.md "Le visite della Lettrice".
//   planVisit({ state, talk, openers, thread, rituals, closers, test, sheetOf, force }) -> null | {
//     opener, thread, recall, cards: [{ id, detail?, tell, words?, ask?: { q, a: [{ t, trait, re }] } }], ritual, closer }
// recall (docs/BACKLOG.md 2.4): before turning the new cards she asks about one she told before (pickRecall), or null.
// opener / thread / ritual / closer: the first entry `{ when, t, then? }` of its list that holds, or null.
// The order she hears: opener, thread, then per card detail -> tell -> words (-> the question), ritual, closer.
// At most three found-but-untold Majors, oldest first; null with fewer than two unless forced
// (and always with none). One card carries the question: the one whose axis is least explored.
import { AXES } from '../core/progress.js';
import { CARD, MAJORS } from '../data/cards.base.js';
import { leaks } from '../data/questions.js';

export const MAX_CARDS = 3;

export const untoldOf = (s) => Object.keys(s.cards || {})
  .filter((id) => /^m\d\d$/.test(id) && id !== 'm00' && s.cards[id]?.found && !s.cards[id]?.confiscated && !s.told?.[id])
  .sort((a, b) => (s.cards[a].at || 0) - (s.cards[b].at || 0) || (a < b ? -1 : 1));

// the axes a question moves (from the traits of its answers)
const axesOf = (ask) => [...new Set((ask?.a || []).flatMap((o) => Object.keys(o?.trait || {})).filter((k) => AXES.includes(k)))];
const explored = (s, k) => (s.hits?.[k]?.plus || 0) + (s.hits?.[k]?.minus || 0);
const validAsk = (ask) => !!ask && typeof ask.q === 'string' && Array.isArray(ask.a) && ask.a.filter((o) => o && o.t).length >= 2;

// Ties (two cards on the same axis, as Il Carro and L'Imperatore, L'Eremita and La Giustizia) used to go to the
// oldest card every time, so the other question was never asked (docs/BACKLOG.md 1.3). Now a tie is broken by
// how many answers she has given so far (all her trait hits): it changes from one game to the next.
const spin = (s) => AXES.reduce((a, k) => a + explored(s, k), 0);
export function pickAsk(s, ids, talk) {
  const withAsk = ids.filter((id) => validAsk(talk?.[id]?.ask));
  if (!withAsk.length) return null;
  let tied = [], bestN = Infinity;
  for (const id of withAsk) {
    const axes = axesOf(talk[id].ask);
    if (!axes.length) continue;
    const n = Math.min(...axes.map((k) => explored(s, k)));
    if (n < bestN) { bestN = n; tied = [id]; } else if (n === bestN) tied.push(id);
  }
  return tied.length ? tied[spin(s) % tied.length] : withAsk[0];
}

const first = (list, test) => {
  const e = Array.isArray(list) ? list.find((o) => o && (typeof o.t === 'string' || Array.isArray(o.then)) && test(o.when)) : null;
  return e ? { t: typeof e.t === 'string' ? e.t : null, then: Array.isArray(e.then) ? e.then : null } : null;
};

// ---- the Reader asks before telling (docs/BACKLOG.md 2.4, notes/imparare.md) ---------------------------
// One card she has already told: hers, not confiscated, not on the table now, with an idea on its sheet. Due
// for review first, then the one asked least (state.recalled), then the one due longest. The question offers
// its idea (the short line of its sheet) and two of other Majors (never one its sheet says is easily confused with it, never a sentence
// that names it), told ones first. -> { id, q, a: [{ t, ok }], right, wrong: [line, line] } | null
const ARTICLE = [[/^Il /, 'del '], [/^Lo /, 'dello '], [/^La /, 'della '], [/^L'/, "dell'"], [/^Gli /, 'degli '], [/^I /, 'dei '], [/^Le /, 'delle ']];
export const ofCard = (name) => { for (const [re, to] of ARTICLE) if (re.test(name)) return name.replace(re, to); return `di ${name}`; };
const capFirst = (t) => t[0].toUpperCase() + t.slice(1);
const hashOf = (str) => { let x = 2166136261; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; };
export const RECALL = {
  q: [
    'Prima di girarle, dimmi una cosa: ti ricordi che cosa ti avevo detto {di}?',
    'Prima delle carte nuove torniamo un momento a una che conosci già. Che cosa ti avevo detto {di}, te lo ricordi?',
  ],
  right: [
    'Sì, è proprio quello che ti avevo detto. Mi fa piacere che ti sia rimasto.',
    'Esatto, ed era la parte che contava. Allora possiamo andare avanti.',
  ],
  // two lines (a caption holds about forty words on a phone). The idea is the sheet's short line, not her exact
  // words: «in poche parole», never a quotation of what she said that night
  wrong: [
    ["No, questa è l'idea di un'altra carta, ma all'inizio succede di confonderle.", '{Di} ti avevo detto, in poche parole: «{core}»'],
    ["Non era questa, perché quella appartiene a un'altra carta.", 'Quello che ti avevo detto {di}, in poche parole, era questo: «{core}»'],
  ],
};
export function pickRecall(s, exclude = [], { sheetOf = () => ({}), now = Date.now() } = {}) {
  const core = (id) => { const c = sheetOf(id)?.core; return typeof c === 'string' && c.trim() && !leaks(c, id) ? c.trim() : null; };
  const asked = (id) => Number(s.recalled?.[id]) || 0;
  const cands = Object.keys(s.told || {}).filter((id) => s.told[id] && /^m\d\d$/.test(id) && CARD[id] && s.cards?.[id]?.found && !s.cards[id].confiscated && !exclude.includes(id) && core(id));
  if (!cands.length) return null;
  const due = (id) => Number(s.cards[id].due) || 0;
  cands.sort((a, b) => (due(a) <= now ? 0 : 1) - (due(b) <= now ? 0 : 1) || asked(a) - asked(b) || due(a) - due(b) || (a < b ? -1 : 1));
  const id = cands[0], right = core(id), n = Number(s.visits) || 0;
  const avoid = new Set([id, ...(sheetOf(id)?.confusables || [])]);
  const seed = (x) => hashOf(`${n}|${id}|${x}`);
  const others = MAJORS.map((c) => c.id).filter((x) => !avoid.has(x) && core(x) && core(x) !== right && !leaks(core(x), id))
    .sort((a, b) => (s.told?.[a] ? 0 : 1) - (s.told?.[b] ? 0 : 1) || seed(a) - seed(b)).slice(0, 2);
  if (others.length < 2) return null;
  const a = [{ t: right, ok: true }, ...others.map((x) => ({ t: core(x), ok: false }))]
    .map((o, i) => ({ o, k: seed(`o${i}`) })).sort((p, q) => p.k - q.k).map((p) => p.o);
  const di = ofCard(CARD[id].name);
  return {
    id, a,
    q: RECALL.q[n % RECALL.q.length].replace('{di}', di),
    right: RECALL.right[n % RECALL.right.length],
    wrong: RECALL.wrong[n % RECALL.wrong.length].map((t) => t.replace('{Di}', capFirst(di)).replace('{di}', di).replace('{core}', right)),
  };
}

export function planVisit({ state: s, talk = {}, openers = [], thread = [], rituals = [], closers = [], test = () => true, sheetOf = () => ({}), force = false, now = Date.now() }) {
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
  return { opener: first(openers, test), thread: first(thread, test), recall: pickRecall(s, ids, { sheetOf, now }), cards, ritual: first(rituals, test), closer: first(closers, test) };
}
