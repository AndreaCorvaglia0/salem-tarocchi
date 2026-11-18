// The sibyl pairs game (notes/sibilla-coppie.md), opened from the Sibilla album once she owns four figures
// and Ginepra has told her what they are.
//   sibyl.pairs()   opens the market stall (ui/sibylpairs.js); resolves when she closes it
// A round is recorded here: the first PER_DAY rounds of a day leave a mark on the figures used and give 1 xp.
// Rules: glue/sibylpairs.rules.js. It depends only on what she has, so a save far ahead gets it at once.
import { provide } from '../core/services.js';
import { emit } from '../core/bus.js';
import { state, save } from '../core/state.js';
import { addXp, todayKey } from '../core/progress.js';
import { canPlay, record } from './sibylpairs.rules.js';
import { openPairs } from '../ui/sibylpairs.js';

export const PAIR_XP = 1;
provide('sibyl.pairs', () => {
  if (!canPlay(state)) return Promise.resolve(false);
  const day = todayKey();
  return openPairs({
    state, day,
    onRound: (cards, choice) => {
      const res = record(state, cards, choice, day);
      if (res.counted) addXp(PAIR_XP, 'pairs');
      save();
      emit('pairs', { cards, kind: choice.kind, counted: res.counted });
      return res;
    },
  }).then(() => true);
});
