// The rules of a guided reading as pure functions: the line a card says in a position, the three
// alternatives (one right, two from other cards, never a card on the table), the score and the pay.
// Tests: tests/play.reading.test.mjs.
import { sheet } from '../data/cards.js';
import { MAJORS } from '../data/cards.base.js';

// The sentence that is right for a card in a position. The single card uses `says`; the others `as[position]`.
export function lineFor(cardId, positionId, spreadId) {
  const s = sheet(cardId) || {};
  if (spreadId === 'single') return s.says || s.as?.present || s.core || '';
  return s.as?.[positionId] || s.says || s.core || '';
}

// The pool of cards that may lend a wrong line: the card's confusables first, then every other Major.
const candidatesFor = (cardId, table) => {
  const bad = new Set([cardId, ...table]);
  const conf = (sheet(cardId)?.confusables || []).filter((id) => !bad.has(id));
  const rest = MAJORS.map((c) => c.id).filter((id) => !bad.has(id) && !conf.includes(id));
  return { conf, rest };
};

// -> [{ card, t, ok }] shuffled; exactly 3 when the deck allows it. table: ids of every card in the reading.
export function alternatives({ cardId, positionId, spreadId, table = [], rng = Math.random }) {
  const right = lineFor(cardId, positionId, spreadId);
  const { conf, rest } = candidatesFor(cardId, table);
  const order = (a) => a.map((id) => [rng(), id]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const seen = new Set([right]);
  const wrong = [];
  for (const id of [...order(conf), ...order(rest)]) {
    const t = lineFor(id, positionId, spreadId);
    if (!t || seen.has(t)) continue;
    seen.add(t); wrong.push({ card: id, t, ok: false });
    if (wrong.length === 2) break;
  }
  const opts = [{ card: cardId, t: right, ok: true }, ...wrong];
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
  return opts;
}

export const scoreOf = (oks) => (oks.length ? oks.filter(Boolean).length / oks.length : 0);
// The client pays by how well she reads (40% to 100%), +5% per Major she owns, and a bonus (+20%) when
// "la tua carta" is on the table.
export function payFor({ pay = 5, score = 0, owned = 0, yourCardOnTable = false, dayCardOnTable = false }) {
  const base = pay * (0.4 + 0.6 * score) * (1 + 0.05 * owned);
  return Math.max(0, Math.round(base + (yourCardOnTable ? pay * 0.2 : 0) + (dayCardOnTable ? pay * 0.3 : 0)));
}
export const xpFor = (score) => 10 + Math.round(20 * score);

// Which cards go where. given: the array the story prepared ('fan' | 'number' | id | null each) or undefined.
// -> [{ id|null, how: 'given'|'fan'|'top'|'number' }]
export function drawPlan(positions, given) {
  return positions.map((p, i) => {
    const g = given?.[i];
    if (g && g !== 'fan' && g !== 'number' && g !== 'top') return { id: g, how: 'given' };
    return { id: null, how: g === 'number' ? 'number' : g === 'fan' || (!given && i === 0) ? 'fan' : 'top' };
  });
}

// One short look prompt for a position, from the card's details; deterministic per card and position.
export function lookPrompt(cardId, index = 0) {
  const d = sheet(cardId)?.details || [];
  if (!d.length) return 'Lascia che l\'occhio vada dove vuole.';
  const x = d[index % d.length];
  return x.note ? `Guarda ${x.label ? `${x.label}. ` : ''}${x.note}` : `Guarda ${x.label}.`;
}
