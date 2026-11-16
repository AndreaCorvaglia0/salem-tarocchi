// The herbarium in play (docs/DESIGN.md "L'erbario"): looking at a plant in the world writes it in the book.
//   herb.look(id)  the first time: it enters the herbarium (state.herbs[id]) with a little experience; then,
//                  and every other time, its page opens (ui/herbs.js).
import { provide, call, has } from '../core/services.js';
import { state, save } from '../core/state.js';
import { emit } from '../core/bus.js';
import { addXp } from '../core/progress.js';
import { HERB } from '../data/herbs/base.js';
import { showHerb } from '../ui/herbs.js';

export const HERB_XP = 3;
provide('herb.look', async (id) => {
  if (!HERB[id]) return false;
  const herbs = state.herbs && typeof state.herbs === 'object' ? state.herbs : (state.herbs = {});
  const first = !herbs[id];
  if (first) {
    herbs[id] = { at: Date.now() }; save();
    addXp(HERB_XP, 'herb');
    emit('herb', { id });
    if (has('hud.toast')) call('hud.toast', `${HERB[id].name}: l'ho segnata nell'erbario.`);
  }
  await showHerb(id);
  return true;
});
