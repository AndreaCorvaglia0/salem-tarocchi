// The herbarium in play (docs/DESIGN.md "L'erbario"): looking at a plant in the world writes it in the book.
//   herb.look(id, { from })  the first time: it enters the herbarium (state.herbs[id]) with a little experience.
//     Only the very first plant she ever notices opens its page by itself; every other new plant flies into
//     the grimoire with one short line and waits there as «nuova» (notes/collezioni.md: finding never stops
//     the game). A plant she already knows opens its page, because she asked to look again.
import { provide, call, has } from '../core/services.js';
import { state, save } from '../core/state.js';
import { emit } from '../core/bus.js';
import { addXp } from '../core/progress.js';
import { HERB, herbUrl } from '../data/herbs/base.js';
import { showHerb } from '../ui/herbs.js';
import { flyToBook } from '../ui/collect.js';
import { herbOpensPage } from './collect.rules.js';

export const HERB_XP = 3;
provide('herb.look', async (id, { from = null } = {}) => {
  if (!HERB[id]) return false;
  const herbs = state.herbs && typeof state.herbs === 'object' ? state.herbs : (state.herbs = {});
  if (herbs[id]) { await showHerb(id); return true; }
  const page = herbOpensPage(state);
  herbs[id] = { at: Date.now() };
  if (!page) (state.albumSeen || (state.albumSeen = {}))[`herb:${id}`] = false;
  save();
  addXp(HERB_XP, 'herb');
  emit('herb', { id });
  if (page) { if (has('hud.toast')) call('hud.toast', `${HERB[id].name}: l'ho segnata nell'erbario.`); await showHerb(id); return true; }
  try { flyToBook({ src: herbUrl(id), from }); } catch { /* no DOM: the herb is in the book all the same */ }
  if (has('sound.play')) Promise.resolve(call('sound.play', 'pick')).catch(() => {});
  if (has('hud.toast')) call('hud.toast', `${HERB[id].name}: segnata nell'erbario.`);
  return true;
});
