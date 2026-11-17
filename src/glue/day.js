// The card of the day, at the cottage bed: once per calendar day she turns the top card of her
// Majors. That card comes first in the review and pays a little more in readings that day
// (core/progress.js dayCard(); systems/review.js and reading.js read it).
import { provide, call } from '../core/services.js';
import { state, save } from '../core/state.js';
import { ownedMajors, todayKey, dayCard, addXp } from '../core/progress.js';
import { CARD } from '../data/cards.base.js';

provide('day.draw', async () => {
  const have = dayCard();
  if (have) { await call('story.say', 'tu', `La carta di oggi è già uscita: ${CARD[have]?.name}. Domani un'altra.`); return have; }
  const pool = ownedMajors();
  if (!pool.length) { await call('story.say', 'tu', 'Nessuna carta da girare, ancora.'); return null; }
  const id = await call('draw.pick', { mode: 'top', pool, title: 'La carta del giorno' });
  if (!id) return null;
  state.day = { date: todayKey(), card: id }; save();
  addXp(5, 'day');
  call('hud.toast', `Oggi: ${CARD[id]?.name}. Sarà la prima del ripasso.`, { card: id, ms: 4500 });
  return id;
});
