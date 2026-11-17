// Her cottage grows with her (notes/buildings.md, «La capanna che cresce con lei»): three stages, the same
// footprint and door. Pure: derived every time the map is built from what she HAS, never from the step
// she is at and never stored, so an old save shows the right stage at once.
//   stage 1 «sbilenca»            at the start
//   stage 2 «rimessa a posto»     she has the garden ({ flag: 'garden.given' }), or is in chapter 3 or later
//                                 ({ chapterMin: 3 }), or holds the second title ({ title: 'fattucchiera' })
//   stage 3 «la casa di una strega»  she has seen the ending ({ flag: 'ending.seen' })
// Stage 3 fills three slots from her save: her suit (core/progress.js yourSuit; neutral while her portrait
// says nothing yet), what grows in her beds (state.garden.beds), one prize she won (flags 'item.<name>',
// set by glue/trials.js from the trials' rewards).
import { levelOf, suitScores, yourSuit } from '../core/progress.js';
import { test } from '../core/cond.js';

export const STAGE2 = { any: [{ flag: 'garden.given' }, { chapterMin: 3 }, { title: 'fattucchiera' }] };
export const STAGE3 = { flag: 'ending.seen' };
const SUIT_NAME = { c: 'cups', s: 'swords', w: 'wands', p: 'pentacles' };
// the prizes that show by her door, the first she holds wins (the latest story first)
export const PRIZES = [
  ['item.il nastro del cappello di Ortica', 'ribbon'], // the hat (data/trials/hat.js): a red ribbon on her broom
  ['item.la chiave della cantina grande', 'chiave'], // the cellars (data/trials/main.js)
  ['item.il lume cieco di Malva', 'lume'], // the night (data/trials/main.js)
];

// the title is read from s.xp (cond's { title } reads the live state: the same rule, testable)
const title2 = (s) => levelOf(Number(s.xp) || 0) >= 4;
export function homeStage(s) {
  if (!s) return 1;
  if (test(STAGE3, s)) return 3;
  if (test({ flag: 'garden.given' }, s) || test({ chapterMin: 3 }, s) || title2(s)) return 2;
  return 1;
}

export function homeSlots(s) {
  const scores = suitScores(s), known = Object.values(scores).some((v) => v > 0);
  const plants = [...new Set((s.garden?.beds || []).filter((b) => b && b.herb).map((b) => b.herb))].slice(0, 4);
  const prize = PRIZES.find(([k]) => s.flags?.[k])?.[1] || null;
  return { suit: known ? SUIT_NAME[yourSuit(s)] : null, plants, prize };
}

// the options the painter gets (art/witchhomes.js cottageHome), and a short signature for the texture key
export function homeOpts(s) {
  const stage = homeStage(s), slots = stage === 3 ? homeSlots(s) : {};
  return { stage, slots, sig: `${stage}-${slots.suit || ''}-${(slots.plants || []).join('.')}-${slots.prize || ''}` };
}
