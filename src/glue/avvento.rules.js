// The Advent calendar's rules (pure, no DOM): when the calendar shows at the threshold, which pages can be
// asked for today, and whether the word she typed opens one. The pages live in data/avvento.js; the screen is
// ui/avvento.js. state.avvento = { opened: { [day]: isoDate } }: what she opened stays hers (it survives a
// new game, like the moon).

export const LAST_DAY = 25;
// the calendar shows from the first of December; after January it stays only if she opened something
export function adventShown(date, s, year = 2026) {
  if (!date || date < `${year}-12-01`) return false;
  if (date <= `${year + 1}-01-31`) return true;
  return openedCount(s) > 0;
}
// December is snowy at the threshold and in the world (from the first of December to Epiphany)
export const isWinterFeast = (date, year = 2026) => !!date && ((date >= `${year}-12-01` && date <= `${year}-12-31`) || (date >= `${year + 1}-01-01` && date <= `${year + 1}-01-06`));

const pad = (n) => String(n).padStart(2, '0');
export const dayDate = (d, year = 2026) => `${year}-12-${pad(d)}`;
// a bag can be asked for from its own day on (a late day is never lost)
export const dayArrived = (d, date, year = 2026) => !!date && date >= dayDate(d, year);
export const opened = (s, d) => !!s?.avvento?.opened?.[d];
export const openedCount = (s) => Object.keys(s?.avvento?.opened || {}).length;
// 'open' (she has the page), 'ask' (its day has come: the word opens it), 'wait' (not yet)
export const slotState = (s, d, date, year = 2026) => (opened(s, d) ? 'open' : dayArrived(d, date, year) ? 'ask' : 'wait');

// letters only, lower case, no accents: «Stèlla! » == «stella»
export const norm = (w) => String(w || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
export const wordFits = (typed, word) => !!norm(word) && norm(typed) === norm(word);

// -> { ok, why? }; on success it writes s.avvento.opened[d] (the caller saves)
export function tryWord(s, d, typed, { words, date, year = 2026 }) {
  if (opened(s, d)) return { ok: true, already: true };
  if (!dayArrived(d, date, year)) return { ok: false, why: 'early' };
  if (!norm(typed)) return { ok: false, why: 'empty' };
  if (!wordFits(typed, words[d])) return { ok: false, why: 'wrong' };
  if (!s.avvento || typeof s.avvento !== 'object') s.avvento = { opened: {} };
  if (!s.avvento.opened || typeof s.avvento.opened !== 'object') s.avvento.opened = {};
  s.avvento.opened[d] = date;
  return { ok: true };
}

// the day whose bag is the newest she can ask for and has not opened (the one to offer first), or null
export const nextToAsk = (s, date, year = 2026) => { for (let d = LAST_DAY; d >= 1; d--) if (slotState(s, d, date, year) === 'ask') return d; return null; };
