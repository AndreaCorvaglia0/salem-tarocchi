// Pure logic of the grimoire area (no DOM): which slot shows what, which lessons are shown, the next
// step's line, what the shop sells, which place an anchor belongs to. Tested in tests/ui.logic.test.mjs.
// The data files are being written by other agents: every read here tolerates missing fields.
import { state as live } from '../core/state.js';
import { MAJORS, MINORS, SUITS, CARD } from '../data/cards.base.js';
import { LESSONS } from '../data/lessons.js';
import { STEPS } from '../data/story/index.js';
import { fill } from '../core/cond.js';

// ---- the 22 slots: the Fool apart, then three rows of seven (the three chapters)
export const majorSlots = () => ({
  fool: MAJORS.find((c) => c.n === 0)?.id || 'm00',
  rows: [1, 2, 3].map((row) => MAJORS.filter((c) => c.row === row).sort((a, b) => a.n - b.n).map((c) => c.id)),
});
export const minorSlots = () => Object.keys(SUITS).map((s) => ({ suit: s, name: SUITS[s].name, ids: MINORS.filter((c) => c.suit === s).sort((a, b) => a.n - b.n).map((c) => c.id) }));

// what a slot shows: 'missing' | 'taken' (confiscated) | 'veiled' (found, no star yet) | 'awake'
export function slotOf(id, s = live, now = Date.now()) {
  const c = s.cards?.[id];
  if (!c?.found) return { id, kind: 'missing', stars: 0, due: false };
  if (c.confiscated) return { id, kind: 'taken', stars: c.stars || 0, due: false };
  return { id, kind: (c.stars || 0) > 0 ? 'awake' : 'veiled', stars: c.stars || 0, due: (c.due || 0) <= now };
}
export const foundMajors = (s = live) => MAJORS.filter((c) => s.cards?.[c.id]?.found).length;

// ---- lessons: the ones the mistresses have taught (state.lessons[id]); in study mode the same set
export const lessonsShown = (s = live, lessons = LESSONS) => (lessons || []).filter((l) => l && s.lessons?.[l.id]);

// ---- the next step, as she would write it, and where it is
export function nextStep(s = live, steps = STEPS) {
  const st = (steps || []).find((x) => x.id === s.step);
  if (!st) return { text: s.flags?.['ending.seen'] ? 'Leggere. Per me.' : 'Guardarmi intorno.', at: null };
  let text = fill(st.text || '', s);
  if (st.need) { const have = foundMajors(s); if (have < st.need) text = `Trovare ancora ${st.need - have} ${st.need - have === 1 ? 'carta' : 'carte'}, poi: ${text[0].toLowerCase()}${text.slice(1)}`; }
  return { text, at: st.at || null, chapter: st.chapter };
}

// ---- the shop
export const TOOLS = {
  bottle: { id: 'bottle', short: 'bottiglia', name: 'Bottiglia della strega', line: 'Per un po\' nessuno mi ferma.', price: 12 },
  sieve: { id: 'sieve', short: 'setaccio', name: 'Setaccio e cesoie', line: 'Indicano la carta nascosta più vicina.', price: 8 },
  incense: { id: 'incense', short: 'incenso', name: 'Incenso', line: 'Calma un Esame: toglie sospetto.', price: 10 },
  pendulum: { id: 'pendulum', short: 'pendolo', name: 'Pendolo', line: 'Toglie una risposta sbagliata.', price: 10 },
};
export const CARD_PRICE = [0, 30, 45, 60]; // by row
export const shopRow = (s = live) => Math.max(1, Math.min(3, s.chapter || 1));
// two Majors of the current row the player lacks, in a stable order (the lowest numbers)
export const shopCards = (s = live) => MAJORS.filter((c) => c.row === shopRow(s) && !s.cards?.[c.id]?.found).sort((a, b) => a.n - b.n).slice(0, 2).map((c) => c.id);
export const canBuy = (price, s = live) => (s.coins || 0) >= price;

// ---- the map: the places of the sketch, and which place an anchor belongs to
// interiors belong to their door; anything else is its own place
const INTERIOR = { malva: 'village.malva_door', cottage: 'village.cottage_door', court: 'village.court_door', meeting: 'village.meeting_door', shop: 'village.shop_door' };
export const placeOf = (anchor) => {
  if (!anchor || typeof anchor !== 'string') return null;
  const map = anchor.split('.')[0];
  return INTERIOR[map] || anchor;
};
export const anchorsOfPlace = (place, all) => [place, ...(all || []).filter((a) => placeOf(a) === place && a !== place)];
export const isSeen = (place, s = live, all = []) => anchorsOfPlace(place, all).some((a) => !!s.stats?.seen?.[a]);

// the ceremony: the detail nearest to a tap (x, y in % of the image)
export function nearestDetail(details, x, y) {
  let best = null, bd = Infinity;
  for (const d of details || []) { const dd = ((d.x - x) * 0.35) ** 2 + ((d.y - y) * 0.6) ** 2; if (dd < bd) { bd = dd; best = d; } } // % of a 350x600 image, weighed as its pixels
  return best;
}

export const cardName = (id) => CARD[id]?.name || id;
