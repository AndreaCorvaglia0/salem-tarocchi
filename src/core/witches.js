// The witches look at her along two axes that have nothing to do with each other (docs/DESIGN.md, "Le streghe:
// affinità e legame, due assi diversi"):
//   affinity  how much the witch sees herself in her: from who she is (the five traits, her card). Computed,
//             never stored: it moves only when her character moves. 0..4.
//   bond      what they built together: state.bonds[witch] points, levels 0..4. It is the only number:
//             state.trust is a copy of it, rewritten by addBond and by core/state.js migrate, for the readers
//             that still say `trust` (core/cond.js, core/progress.js trusts). Story trust (progress.addTrust)
//             reaches the bond through glue/witches.js, which then puts the copy back in line.
// The two together give one attitude: pari (affine and bound), prova (affine, not bound), brontola (bound,
// not affine), fredda (neither). Pure on a state; addBond is the only writer.
import { state, save } from './state.js';
import { emit } from './bus.js';
import { yourCard } from './progress.js';

export const WITCHES = ['malva', 'ortica', 'edera', 'ginepra'];
// The poles each witch recognises herself in, as [axis, sign] (positive pole first, docs/CONTRACT.md "Portrait"):
//   Malva: gentile (tono +), prudente (rischio -), cuore (guida +)
//   Ortica: audace (rischio +), schietta (parola +), testa (guida -)
//   Edera: accorta (parola -), curiosa (esplora +), testa (guida -): "ascolta prima di parlare" is already
//          accorta, so the third is derived from "esatta": she reasons, she does not follow her heart
//   Ginepra: audace (rischio +), gentile (tono +), cuore (guida +)
export const AFFINITY = {
  malva: [['tono', 1], ['rischio', -1], ['guida', 1]],
  ortica: [['rischio', 1], ['parola', 1], ['guida', -1]],
  edera: [['parola', -1], ['esplora', 1], ['guida', -1]],
  ginepra: [['rischio', 1], ['tono', 1], ['guida', 1]],
};
export const CARD_OF = { malva: 'm03', ortica: 'm01', edera: 'm02', ginepra: 'm07' };
export const POLE_FULL = 4; // a trait at 4 on her pole counts fully; the opposite pole counts against

// affinity(witch, traits, yourCard) -> 0..4: each of her three poles gives -1..1 (value / 4 along the pole),
// her card being the witch's own card gives 1 more; the sum is rounded and kept in 0..4.
export function affinity(witch, traits = {}, card = null) {
  const poles = AFFINITY[witch];
  if (!poles) return 0;
  let sum = 0;
  for (const [axis, sign] of poles) sum += Math.max(-1, Math.min(1, (sign * (Number(traits[axis]) || 0)) / POLE_FULL));
  if (card && card === CARD_OF[witch]) sum += 1;
  return Math.max(0, Math.min(4, Math.round(sum)));
}
export const affinityOf = (witch, s = state) => affinity(witch, s.traits || {}, yourCard(s));

// bond points -> level 0..4
export const BOND_AT = [0, 1, 2, 4, 6];
export const bondLevel = (points) => { let l = 0; for (let i = 0; i < BOND_AT.length; i++) if ((Number(points) || 0) >= BOND_AT[i]) l = i; return l; };
export const bondOf = (witch, s = state) => bondLevel(s.bonds?.[witch]);

// Old saves: the bond keeps the larger of bond and trust (never below 0), and trust becomes its copy. Pure on s.
export function carryTrust(s) {
  if (!s.bonds || typeof s.bonds !== 'object' || Array.isArray(s.bonds)) s.bonds = {};
  if (!s.trust || typeof s.trust !== 'object' || Array.isArray(s.trust)) s.trust = {};
  for (const w of WITCHES) {
    const b = Number.isFinite(s.bonds[w]) ? s.bonds[w] : 0;
    s.bonds[w] = Math.max(0, Math.round(b), Math.round(Number(s.trust[w]) || 0));
    s.trust[w] = s.bonds[w];
  }
  return s;
}

export const AFFINE = 2, BOUND = 2; // from these levels she counts as affine, as bound
export const ATTITUDES = ['pari', 'prova', 'brontola', 'fredda'];
export const attitude = (aff, bondLv) => (aff >= AFFINE ? (bondLv >= BOUND ? 'pari' : 'prova') : bondLv >= BOUND ? 'brontola' : 'fredda');
export const attitudeOf = (witch, s = state) => attitude(affinityOf(witch, s), bondOf(witch, s));

// Has she met the witch? Her own flag, a lesson of hers, or some trust or bond already between them.
const MET = { malva: (s) => (s.chapter || 0) >= 1 || !!s.spreads?.single, ortica: (s) => !!s.spreads?.ppf, edera: (s) => !!s.spreads?.celtic, ginepra: () => false };
export const metWitch = (witch, s = state) => !!s.flags?.[`met.${witch}`] || (s.trust?.[witch] || 0) !== 0 || (s.bonds?.[witch] || 0) > 0 || !!MET[witch]?.(s);

// The only writer: points clamp at 0 and at the top level's threshold + 4. Emits `bond` and `bond:up`/`bond:down`.
export const BOND_MAX = BOND_AT[BOND_AT.length - 1] + 4;
export function addBond(witch, n, why = '') {
  n = Math.round(Number(n) || 0);
  if (!WITCHES.includes(witch) || !n) return 0;
  // the story's trust has just moved its copy (progress.addTrust): the bond, not the copy, is what counts
  if (state.trust && Number.isFinite(state.bonds?.[witch])) state.trust[witch] = state.bonds[witch];
  carryTrust(state);
  const before = bondLevel(state.bonds[witch]), cur = state.bonds[witch];
  state.bonds[witch] = Math.max(0, Math.min(Math.max(BOND_MAX, cur), cur + n)); // an old save above the top keeps it
  state.trust[witch] = state.bonds[witch];
  const after = bondLevel(state.bonds[witch]);
  emit('bond', { who: witch, n, why, value: state.bonds[witch], level: after });
  if (after !== before) emit(after > before ? 'bond:up' : 'bond:down', { who: witch, level: after });
  save();
  return n;
}
