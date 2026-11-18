// The threshold in play (rules: threshold.rules.js; the screen: ui/title.js): the moon, the card of the day
// with its sentence and its looks, the note from the notebook, the short review.
import { state, save } from '../core/state.js';
import { todayKey, addCoins, addTreats, dueIds, hasCard, answer } from '../core/progress.js';
import { CARD } from '../data/cards.base.js';
import { DAILY } from '../data/daily/cards.js';
import { NOTES } from '../data/daily/notes.js';
import { moonSeedGift } from './garden.js';
import { HERB } from '../data/herbs/base.js';
import { growMoon, moonShown, dayOf, noteOf, reviewPair, giftOf, giftText, readerLine, dayAnswer } from './threshold.rules.js';

const IDS = Object.keys(CARD).filter((id) => DAILY[id]);
const daily = () => (state.daily && typeof state.daily === 'object' ? state.daily : (state.daily = { looks: {}, notes: 0, noteDay: null }));
const seed = () => `${state.player?.name || ''}|${state.player?.birth ? `${state.player.birth.d}.${state.player.birth.m}` : ''}`;

export const moonNow = () => moonShown(state.moon, todayKey());
// One slice for today, whatever she did. -> null, or { n, full, gift: 'text', line } when it grew
export function touchMoon() {
  const r = growMoon(state.moon, todayKey());
  if (!r.grew) return null;
  state.moon = r.moon;
  let gift = null, line = null;
  if (r.full) {
    let g = giftOf(r.moon.cycles);
    // a seed for the garden (glue/garden.js): only once the garden is hers; otherwise a treat instead
    if (g.seed) { const id = moonSeedGift(r.moon.last); g = id ? { ...g, seedName: HERB[id].name.toLowerCase() } : { treats: 1, coins: g.coins }; }
    if (g.treats) addTreats(g.treats); if (g.coins) addCoins(g.coins); gift = giftText(g); line = readerLine(r.moon.cycles); state.moon.gift = { date: r.moon.last, gift, line };
  }
  save();
  return { n: r.moon.n, full: r.full, gift, line };
}
// the gift of today's full moon, to show again if she reopens the page
export const giftToday = () => (state.moon?.gift?.date === todayKey() ? state.moon.gift : null);

// The card of the day: { card, turned, name, oggi, look: { k, t } | null }
export function today() {
  const d = dayOf(state.day, todayKey(), IDS, seed(), dueIds());
  if (state.day?.date !== d.date || state.day?.card !== d.card) { state.day = d; save(); }
  const e = DAILY[d.card] || {}, looks = e.sguardi || [];
  const seen = Number(daily().looks?.[d.card]) || 0;
  // the look of today: the next one she has not read for this card (the same all day)
  const i = looks.length ? (d.turned ? Math.max(0, seen - 1) : seen) % looks.length : -1;
  return { card: d.card, turned: !!d.turned, name: CARD[d.card]?.name || '', oggi: (e.oggi || [])[d.v] || (e.oggi || [])[0] || '', look: i >= 0 ? looks[i] : null, lookIndex: i, seen };
}
export function turnToday() {
  const t = today();
  if (t.turned) return t;
  state.day.turned = true;
  const L = daily().looks || (daily().looks = {});
  L[t.card] = (Number(L[t.card]) || 0) + 1;
  save();
  return today();
}
// Her answer to «Senza guardare» (ui/daycard.js): a review answer on the card, if it is hers, once a day
// (the first answer counts; reopening the card she may answer again for herself). -> true when it counted
export function answerToday(ok) {
  const done = dayAnswer(state, todayKey(), today().card, ok, { holds: hasCard, answer });
  if (done) save();
  return done;
}
// The note of the day (one more is counted the first time each day)
export function noteToday() {
  const D = daily(), day = todayKey();
  if (D.noteDay !== day) { D.noteDay = day; D.notes = (Number(D.notes) || 0) + 1; save(); }
  return noteOf(NOTES, day, Math.max(0, D.notes - 1));
}
export const pairToday = () => reviewPair(state.cards);
