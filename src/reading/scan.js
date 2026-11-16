// The glance: count the hand before reading it (majors, suits, numbers, courts, reversed).
import { CARD } from '../data/cards.base.js';

// Suit that belongs to each field of the question.
export const NATIVE_SUIT = { amore: 'c', lavoro: 'p', casa: 'p', altri: 'c', se: 'w' };
const SUITS = ['w', 'c', 's', 'p'];
const IMPORTANCE = { foreign: 6, majors: 5, dominant: 4, missing: 3, number: 3, courts: 2, reversed: 2 };

// Rank a card counts for: minors 1-10 by number, majors I-X by their own number (no reduction: she must see it).
const rankOf = (c) => {
  if (c.arcana === 'minor') return c.n <= 10 ? c.n : null;
  let n = c.n;
  if (n > 10) return 0; // only numbers she can see on the cards: a major counts with its own number, 1 to 10
  return n === 0 ? null : n;
};

// cards: [{ card, rev }]. Unknown ids (stubs) are ignored by every count. Returns at most 2 findings.
export const scan = (cards, question = {}) => {
  const n = cards.length;
  if (n < 3) return [];
  const known = cards.map((x) => ({ ...x, c: CARD[x.card] })).filter((x) => x.c);
  const found = [];

  const majors = known.filter((x) => x.c.arcana === 'major').length;
  if (majors > n / 2) found.push({ kind: 'majors', count: majors });

  const bySuit = Object.fromEntries(SUITS.map((s) => [s, known.filter((x) => x.c.suit === s).length]));
  const top = SUITS.filter((s) => bySuit[s] === Math.max(...Object.values(bySuit)));
  const topSuit = top.length === 1 ? top[0] : null;

  const native = NATIVE_SUIT[question.ambito];
  let foreign = null;
  if (native && bySuit[native] === 0 && topSuit && bySuit[topSuit] >= 2) {
    // suit: the one the question calls for and is absent; other: the suit that fills the hand instead
    foreign = { kind: 'foreign', suit: native, other: topSuit, count: bySuit[topSuit] };
    found.push(foreign);
  }
  if (topSuit && bySuit[topSuit] >= 2 && bySuit[topSuit] * 2 >= n && !foreign) {
    found.push({ kind: 'dominant', suit: topSuit, count: bySuit[topSuit] });
  }

  if (n >= 7) {
    const missing = SUITS.find((s) => bySuit[s] === 0 && !(foreign && s === native));
    if (missing) found.push({ kind: 'missing', suit: missing });
  }

  const ranks = {};
  for (const x of known) { const r = rankOf(x.c); if (r) ranks[r] = (ranks[r] ?? 0) + 1; }
  const need = n >= 10 ? 3 : 2;
  const rep = Object.entries(ranks).filter(([, k]) => k >= need).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
  if (rep) found.push({ kind: 'number', n: Number(rep[0]), count: rep[1] });

  const courts = known.filter((x) => x.c.arcana === 'minor' && x.c.n >= 11).length;
  if (courts >= 2 && courts * 3 >= n) found.push({ kind: 'courts', count: courts });

  const rev = cards.filter((x) => x.rev).length;
  if (rev > n / 2) found.push({ kind: 'reversed', count: rev });

  // one remark for a small hand, two for a large one: more would bury the cards
  return found.sort((a, b) => IMPORTANCE[b.kind] - IMPORTANCE[a.kind]).slice(0, cards.length >= 7 ? 2 : 1);
};
