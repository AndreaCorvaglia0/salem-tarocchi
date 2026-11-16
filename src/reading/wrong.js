// What the player chooses among while she reads a card, in two short questions, and the final answer.
// The level is a first course: if she knows the card, a moment of thought is enough.
//   1. recall():       which idea does this card bring?  (its `essenza` against the essenze of other cards)
//   2. alternatives(): what does that idea mean here?    (its sentence against the sentences other, clearly
//                      different cards would say in the same place: same ambito, same role)
//   3. verdictChoices(): what do you tell them, in the end?  (it goes well / it depends / it goes badly)
// Wrong options are never the same card in another role or ambito: those are shades, not mistakes one can reason about.
import { line, voice, voiceIds } from './voices.js';
import { CLOSINGS } from '../data/reading/frames.js';
import { closingFor } from './say.js';
import { shuffle } from './rng.js';

const side = (id, rev) => voice(id)?.[rev ? 'rev' : 'up'] || null;
// how far two card faces are: the further, the easier to tell apart
const far = (a, b) => (a && b ? Math.abs((a.favore ?? 0) - (b.favore ?? 0)) + (a.moto !== b.moto ? 1 : 0) : 0);

// Other faces to compare with, furthest first (random among equals). `verso` adds the same card turned the
// other way as the first candidate: only once reversed cards have been taught.
function rivals(step, { pool, rng, verso }) {
  const me = side(step.card, step.rev);
  const out = [];
  for (const id of pool) {
    if (id === step.card) continue;
    for (const rev of verso ? [false, true] : [false]) { const s = side(id, rev); if (s) out.push({ card: id, rev, d: far(me, s) }); }
  }
  let ranked = shuffle(out, rng).sort((a, b) => b.d - a.d);
  // two faces that say nearly the same thing (two beginnings, two endings) are never offered against each other,
  // as long as enough clearly different ones exist
  const clear = ranked.filter((r) => r.d >= 2);
  if (new Set(clear.map((r) => r.card)).size >= 2) ranked = clear;
  const one = []; const seenCard = new Set(); // one face per card
  for (const r of ranked) if (!seenCard.has(r.card)) { seenCard.add(r.card); one.push(r); }
  return verso && side(step.card, !step.rev) ? [{ card: step.card, rev: !step.rev, d: 9 }, ...one] : one;
}
function pick(step, right, textOf, { rng = Math.random, n = 3, pool = voiceIds(), verso = false } = {}) {
  if (!right) return [];
  const seen = new Set([right]); const wrong = [];
  for (const r of rivals(step, { pool, rng, verso })) {
    if (wrong.length >= n - 1) break;
    const text = textOf(r);
    if (text && !seen.has(text)) { seen.add(text); wrong.push({ text, ok: false, card: r.card, rev: r.rev }); }
  }
  return shuffle([{ text: right, ok: true, card: step.card, rev: step.rev }, ...wrong], rng);
}

// 1. The idea of the card: its essenza among those of other cards.
export const recall = (plan, i, opts = {}) => {
  const step = plan.steps[i];
  return pick(step, side(step.card, step.rev)?.essenza || null, (r) => side(r.card, r.rev)?.essenza || null, opts);
};

// 2. The idea applied: its sentence for this ambito and role among those of other cards in the same place.
export const alternatives = (plan, i, opts = {}) => {
  const step = plan.steps[i]; const { ambito } = plan.question;
  return pick(step, line(step.card, step.rev, ambito, step.role), (r) => line(r.card, r.rev, ambito, step.role), opts);
};

// 3. The final answer at three plain levels. `level` of a verdict code: bene | dipende | male.
export const LEVEL = { si: 'bene', si_piano: 'bene', dipende: 'dipende', no_cosi: 'male', no: 'male' };
const CODE_OF = { bene: 'si_piano', dipende: 'dipende', male: 'no_cosi' };
export const verdictChoices = (plan, { rng = Math.random } = {}) => {
  const { forma, ref } = plan.question; const mine = LEVEL[plan.verdict.code];
  if (!CLOSINGS[forma]) return [];
  return ['bene', 'dipende', 'male'].map((level) => ({
    level, ok: level === mine,
    text: closingFor(forma, level === mine ? plan.verdict.code : CODE_OF[level], ref, rng),
  }));
};
