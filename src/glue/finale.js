// The last session's reading: reading.open({ client: 'self' }) without cards gets the ten cards of
// her game (finale.rules.js) on the Celtic cross. systems/reading.js plays it on the reading engine's
// screens (consult.js, question shape `quadro` about herself, no tone, no pay); the session around it
// (her card, the portrait, the diary) is unchanged. Everything else goes through untouched.
import { wrap } from '../core/services.js';
import { state } from '../core/state.js';
import { yourCard, mostMissed, ownedMajors, mostTrusting } from '../core/progress.js';
import { finalCards } from './finale.rules.js';

wrap('reading.open', (prev, o = {}) => {
  if (o.client === 'self' && !o.cards) {
    const cards = finalCards({ yourCard: yourCard(), mostMissed: mostMissed(), birthCard: state.player.birthCard, flags: state.flags, mostTrusting: mostTrusting(), owned: ownedMajors() });
    return prev?.({ ...o, spread: 'celtic', cards });
  }
  return prev?.(o);
});
