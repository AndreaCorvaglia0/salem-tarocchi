// The Advent calendar at the threshold: today's date (a test date with ?debug&oggi=2026-12-09 or the hash
// #oggi-2026-12-09), what shows, and the word that opens a page. Rules: glue/avvento.rules.js; pages:
// data/avvento.js; screen: ui/avvento.js (opened from ui/title.js).
import { state, saveNow } from '../core/state.js';
import { todayKey } from '../core/progress.js';
import { WORDS, YEAR } from '../data/avvento.js';
import { adventShown, isWinterFeast, slotState, tryWord, nextToAsk, openedCount } from './avvento.rules.js';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
function fakeDate() {
  try {
    const hm = (globalThis.location?.hash || '').match(/^#oggi-(\d{4}-\d{2}-\d{2})$/);
    if (hm) return hm[1];
    const p = new URLSearchParams(globalThis.location?.search || '');
    const q = p.get('oggi');
    return p.has('debug') && q && ISO.test(q) ? q : null;
  } catch { return null; }
}
export const adventDate = () => fakeDate() || todayKey();
export const adventVisible = () => adventShown(adventDate(), state, YEAR);
export const winterFeast = () => isWinterFeast(adventDate(), YEAR);
export const slot = (d) => slotState(state, d, adventDate(), YEAR);
export const toAsk = () => nextToAsk(state, adventDate(), YEAR);
export const adventOpened = () => openedCount(state);
// -> { ok, why? }: saved at once (a page she opened must never be lost)
export function openWithWord(d, typed) {
  const r = tryWord(state, d, typed, { words: WORDS, date: adventDate(), year: YEAR });
  if (r.ok && !r.already) saveNow();
  return r;
}
