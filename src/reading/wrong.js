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
// Two ideas that share a key word ("festa", "vittoria", "fretta", "intuito") are too close to be offered against
// each other. Key words: 5+ letters, compared on their first five, without accents; common words do not count.
const COMMON = new Set(['quell', 'altri', 'altro', 'altra', 'senza', 'tropp', 'ancor', 'anche', 'sempr', 'tutto', 'tutti', 'prima', 'propr', 'nuovo', 'nuova', 'buone', 'buona', 'cuore', 'cose', 'persona', 'perso'].map((w) => w.slice(0, 5)));
const keys = (t) => new Set(String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z]+/).filter((w) => w.length >= 5).map((w) => w.slice(0, 5)).filter((w) => !COMMON.has(w)));
export const tooClose = (a, b) => { const A = keys(a); for (const k of keys(b)) if (A.has(k)) return true; return false; };
// For whole sentences one shared word is normal ("casa", "famiglia"); two shared key words make two readings one could both defend.
export const shared = (a, b) => { const A = keys(a); let n = 0; for (const k of keys(b)) if (A.has(k)) n += 1; return n; };
// how far two card faces are: the further, the easier to tell apart
const far = (a, b) => (a && b ? Math.abs((a.favore ?? 0) - (b.favore ?? 0)) + (a.moto !== b.moto ? 1 : 0) : 0);

// Other faces to compare with, furthest first (random among equals). `verso` adds the same card turned the
// other way as the first candidate: only once reversed cards have been taught.
function rivals(step, { pool, rng, verso }) {
  const me = side(step.card, step.rev);
  const out = [];
  for (const id of pool) {
    if (id === step.card) continue;
    for (const rev of verso ? [false, true] : [false]) { const s = side(id, rev); if (s && !tooClose(me?.essenza, s.essenza)) out.push({ card: id, rev, d: far(me, s) }); }
  }
  const mixed = shuffle(out, rng);
  // two faces that say nearly the same thing (two beginnings, two endings) are never offered against each other,
  // as long as enough clearly different ones exist. Among the clearly different ones the choice is random:
  // always taking the furthest would show the same two extreme cards every time.
  const clear = mixed.filter((r) => r.d >= 2);
  const ranked = new Set(clear.map((r) => r.card)).size >= 2 ? clear : [...mixed].sort((a, b) => b.d - a.d);
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
    if (text && !seen.has(text) && shared(right, text) < 2 && !wrong.some((w) => shared(w.text, text) >= 2)) { seen.add(text); wrong.push({ text, ok: false, card: r.card, rev: r.rev }); }
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
// `answers`: the client's own three answers ({ bene, dipende, male }), written for that very question; without
// them the closings of the form are used, and with a detail in the request the ones that name it ({di}).
export const verdictChoices = (plan, { rng = Math.random, answers = null } = {}) => {
  const { forma, ref } = plan.question; const mine = LEVEL[plan.verdict.code];
  if (!CLOSINGS[forma]) return [];
  const direct = (code) => {
    const named = ref?.di ? CLOSINGS[forma][code].filter((t) => t.includes('{di}')) : [];
    return named.length ? named[Math.floor(rng() * named.length)].replace('{di}', ref.di) : closingFor(forma, code, ref, rng);
  };
  return ['bene', 'dipende', 'male'].map((level) => ({
    level, ok: level === mine,
    text: answers?.[level] || direct(level === mine ? plan.verdict.code : CODE_OF[level]),
  }));
};
