// Wrong alternatives for the player to choose among.
import { AMBITI } from './ask.js';
import { ROLES, line, voiceIds } from './voices.js';
import { CLOSINGS } from '../data/reading/frames.js';
import { closingFor } from './say.js';
import { shuffle } from './rng.js';

// Candidates by kind, in order of preference.
const candidates = (step, ambito, pool, rng) => {
  const { card, rev, role } = step;
  const others = (list, x) => shuffle(list.filter((y) => y !== x), rng);
  return [
    { why: 'verso', texts: [line(card, !rev, ambito, role)] },
    { why: 'ruolo', texts: others(ROLES, role).map((r) => line(card, rev, ambito, r)) },
    { why: 'ambito', texts: others(AMBITI, ambito).map((a) => line(card, rev, a, role)) },
    { why: 'carta', texts: others(pool, card).map((c) => line(c, rev, ambito, role)) },
  ];
};

// The right sentence plus n-1 wrong ones, shuffled. Fewer if the voices cannot supply enough distinct ones.
export const alternatives = (plan, i, { rng = Math.random, n = 3, pool = voiceIds() } = {}) => {
  const step = plan.steps[i];
  const { ambito } = plan.question;
  const right = line(step.card, step.rev, ambito, step.role);
  if (right === null) return [];
  const seen = new Set([right]);
  const wrong = [];
  const kinds = candidates(step, ambito, pool, rng);
  // Round robin: one of each kind first, then more of the same kinds if more are needed.
  for (let round = 0; wrong.length < n - 1 && round < 30; round++) {
    for (const k of kinds) {
      if (wrong.length >= n - 1) break;
      const text = k.texts[round];
      if (text && !seen.has(text)) { seen.add(text); wrong.push({ text, ok: false, why: k.why }); }
    }
  }
  return shuffle([{ text: right, ok: true, why: null }, ...wrong], rng);
};

// Closing options for the final answer: the right one for the verdict, others from other codes.
export const verdictChoices = (plan, { rng = Math.random, n = 3 } = {}) => {
  const { forma, ref } = plan.question;
  const codes = Object.keys(CLOSINGS[forma]);
  const right = { text: closingFor(forma, plan.verdict.code, ref, rng), ok: true, code: plan.verdict.code };
  const wrong = shuffle(codes.filter((c) => c !== plan.verdict.code), rng)
    .slice(0, n - 1)
    .map((code) => ({ text: closingFor(forma, code, ref, rng), ok: false, code }));
  return shuffle([right, ...wrong], rng);
};
