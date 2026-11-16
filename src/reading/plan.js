// The plan: which role each card plays, how steps attach to each other, and the verdict.
import { SPREADS } from '../data/spreads.js';
import { CARD } from '../data/cards.base.js';
import { scan } from './scan.js';
import { sideOf } from './voices.js';
import { seeded, shuffle } from './rng.js';

export { seeded, scan };

export const ROLE = {
  single: { present: 'situazione' }, // overridden by the question's forma, see SINGLE_ROLE
  ppf: { past: 'origine', present: 'situazione', future: 'arrivo' },
  celtic: {
    present: 'situazione', cross: 'ostacolo', root: 'origine', past: 'origine', possible: 'consiglio',
    future: 'arrivo', self: 'situazione', environment: 'situazione', hopefear: 'ostacolo', outcome: 'arrivo',
  },
};
export const SINGLE_ROLE = {
  sino: 'arrivo', scelta: 'consiglio', andra: 'arrivo', perche: 'origine', fare: 'consiglio', quadro: 'situazione',
};
export const roleOf = (spreadId, posId, forma) => (spreadId === 'single' ? SINGLE_ROLE[forma] ?? ROLE.single.present : ROLE[spreadId][posId]);

// Draw cards for a spread from `pool` (ids), no duplicates. Returns [{ pos, card, rev }].
export const drawCards = (spreadId, { rng = Math.random, pool = Object.keys(CARD), reversals = true, revChance = 0.3 } = {}) => {
  const spread = SPREADS[spreadId];
  if (!spread) throw new Error(`drawCards: unknown spread "${spreadId}"`);
  const ids = [...new Set(pool)];
  if (ids.length < spread.positions.length) throw new Error('drawCards: pool too small for this spread');
  const drawn = shuffle(ids, rng).slice(0, spread.positions.length);
  return spread.positions.map((p, i) => ({ pos: p.id, card: drawn[i], rev: reversals && rng() < revChance }));
};

// How step `cur` attaches to the one before it: contrast (sign flips) beats turn (before the last arrivo).
export const linkOf = (prev, cur, isLast) => {
  if (!prev) return 'apre';
  if (prev.favore * cur.favore < 0) return 'contrasto';
  if (isLast && cur.role === 'arrivo') return 'svolta';
  return 'seguito';
};

const CODES = [[1.2, 'si'], [0.4, 'si_piano'], [-0.4, 'dipende'], [-1.2, 'no_cosi']];
// Weighted mean of favore: the last step, `future` and `outcome` weigh double, obstacles weigh half.
export const verdictOf = (steps) => {
  let sum = 0;
  let weight = 0;
  steps.forEach((s, i) => {
    let w = s.role === 'ostacolo' ? 0.5 : 1;
    if (i === steps.length - 1 || s.pos === 'future' || s.pos === 'outcome') w *= 2;
    sum += w * s.favore;
    weight += w;
  });
  const score = weight ? sum / weight : 0;
  const code = (CODES.find(([min]) => score >= min) ?? [0, 'no'])[1];
  return { score, code };
};

// cards: [{ pos, card, rev }] as returned by drawCards.
export const plan = (question, spreadId, cards) => {
  const steps = [];
  cards.forEach((c, i) => {
    const s = sideOf(c.card, c.rev);
    const step = {
      pos: c.pos, role: roleOf(spreadId, c.pos, question.forma), card: c.card, rev: c.rev,
      favore: s?.favore ?? 0, moto: s?.moto ?? null,
    };
    step.link = linkOf(steps[i - 1], step, i === cards.length - 1);
    steps.push(step);
  });
  return { question, spread: spreadId, steps, scan: scan(cards, question), verdict: verdictOf(steps) };
};
