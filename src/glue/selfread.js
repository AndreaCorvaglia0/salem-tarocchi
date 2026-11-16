// The diary of readings (state.readings) in play: every client reading done with the reading engine is kept
// there automatically, compactly (wrap of reading.open, src/systems untouched); a reading for herself is
// saved by keepReading() and gives a little experience the first time each day, never coins or popularity.
// Rules: selfread.rules.js. Screens: ui/selfread.js, ui/readings.js.
import { wrap, provide } from '../core/services.js';
import { state, save } from '../core/state.js';
import { emit } from '../core/bus.js';
import { addXp, todayKey } from '../core/progress.js';
import { CLIENTS } from '../data/story/index.js';
import { addReading, removeReading, clientEntry, xpDue, SELF_XP } from './selfread.rules.js';

const once = () => state.world.once || (state.world.once = {});
const list = () => (Array.isArray(state.readings) ? state.readings : (state.readings = []));
const clientOf = (c) => (typeof c === 'object' && c) || (CLIENTS || []).find((x) => x.id === c) || null;

// Saves an entry (newest first, capped). A reading for herself pays its daily experience here.
export function keepReading(entry) {
  state.readings = addReading(list(), entry);
  if (entry.who === 'me' && xpDue(once()['selfread.day'], todayKey())) { once()['selfread.day'] = todayKey(); addXp(SELF_XP, 'selfread'); }
  save();
  emit('readings', { n: state.readings.length });
}
export function updateNote(at, note) {
  const e = list().find((x) => x.at === at);
  if (e) { e.note = String(note || '').slice(0, 600); save(); }
}
export function deleteReading(at) { state.readings = removeReading(list(), at); save(); emit('readings', { n: state.readings.length }); }
// The Reader's few words before the first reading for herself: once.
export const introSeen = () => !!once()['selfread.intro'];
export const markIntro = () => { once()['selfread.intro'] = true; save(); };

// for the screens (ui/selfread.js, ui/readings.js), which do not import glue
provide('readings.keep', (e) => { keepReading(e); return Promise.resolve(); });
provide('readings.note', (at, note) => { updateNote(at, note); return Promise.resolve(); });
provide('readings.delete', (at) => { deleteReading(at); return Promise.resolve(); });
provide('selfread.intro', () => { const seen = introSeen(); if (!seen) markIntro(); return Promise.resolve(seen); });

wrap('reading.open', async (prev, o = {}) => {
  const r = await prev?.(o);
  try {
    const cl = o.client && o.client !== 'self' ? clientOf(o.client) : null;
    const e = cl && clientEntry({ client: cl, spread: o.spread || 'single' }, r, new Date().toISOString());
    if (e) { state.readings = addReading(list(), e); save(); emit('readings', { n: state.readings.length }); }
  } catch { /* the diary never breaks a reading */ }
  return r;
});
