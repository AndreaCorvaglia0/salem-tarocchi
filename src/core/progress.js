// Everything the game remembers about the player's growth: experience and levels, the cards found
// and their stars, "la tua carta", trust, flags, the diary, the returning veil (spaced review).
// Pure functions of the state plus small mutators; every mutator saves and tells the bus.
import { state, save } from './state.js';
import { emit } from './bus.js';
import { CARD, MAJORS, SIGNS, signOf } from '../data/cards.base.js';

// ---- levels ---------------------------------------------------------------------------------
// Nine levels, three per title. The first three come within the first quarter of an hour.
export const LEVEL_XP = [0, 30, 70, 200, 280, 370, 470, 590, 730]; // xp needed for level 1..9: 2-3 in the first minutes, then one title per chapter (playthrough numbers)
export const TITLES = ['Novizia', 'Fattucchiera', 'Strega'];
export const levelOf = (xp = state.xp) => { let l = 1; for (let i = 0; i < LEVEL_XP.length; i++) if (xp >= LEVEL_XP[i]) l = i + 1; return l; };
export const titleOf = (level = levelOf()) => (state.flags['ending.seen'] ? 'Gran Maestra' : TITLES[Math.min(2, Math.floor((level - 1) / 3))]);
export const levelProgress = (xp = state.xp) => {
  const l = levelOf(xp);
  if (l >= 9) return { level: 9, into: 1, need: 0, have: 0 };
  const a = LEVEL_XP[l - 1], b = LEVEL_XP[l];
  return { level: l, into: (xp - a) / (b - a), need: b - a, have: xp - a };
};
// What each level brings (the world and the HUD read this).
export const LEVEL_GIFTS = {
  2: { text: 'Al cottage ti aspetta qualcuno. Ha quattro zampe.' }, // the cat itself comes with the story (c1.cottage)
  3: { text: 'La bottega ti apre la porta.', flag: 'shop.open' },
  4: { power: 'fire', text: 'Sai accendere il fuoco: vedi nel buio.' },
  5: { text: 'Vedi più lontano.', flag: 'sight.far' },
  6: { power: 'seals', text: 'Apri le porte sigillate.' },
  7: { power: 'stun', text: 'Sai stordire chi ti ferma, ogni tanto.' },
  8: { power: 'broom', text: 'La scopa: voli nei luoghi che conosci.' },
  9: { text: 'Sei una Strega fatta.', flag: 'level.nine' },
};
export const addXp = (n, why = '') => {
  if (!n) return;
  const before = levelOf();
  state.xp += n;
  const after = levelOf();
  emit('xp', { n, why, xp: state.xp });
  for (let l = before + 1; l <= after; l++) {
    const g = LEVEL_GIFTS[l] || {};
    if (g.power) state.powers[g.power] = true;
    if (g.flag) state.flags[g.flag] = true;
    emit('level:up', { level: l, title: titleOf(l), gift: g });
  }
  save();
};
export const addCoins = (n) => { state.coins = Math.max(0, state.coins + n); emit('coins', { n, coins: state.coins }); save(); };

// ---- cards ----------------------------------------------------------------------------------
const DAY = 86400000;
export const INTERVALS = [1, 3, 7, 16]; // days before a card veils again (spaced review)
export const cardState = (id) => state.cards[id] || null;
export const hasCard = (id) => !!state.cards[id]?.found && !state.cards[id]?.confiscated;
export const foundIds = () => Object.keys(state.cards).filter((id) => state.cards[id].found);
export const ownedIds = () => foundIds().filter((id) => !state.cards[id].confiscated);
export const ownedMajors = () => ownedIds().filter((id) => CARD[id]?.arcana === 'major');
export const majorsFound = () => foundIds().filter((id) => CARD[id]?.arcana === 'major').length;
export const findCard = (id, { silent = false } = {}) => {
  if (!CARD[id] || state.cards[id]?.found) return false;
  state.cards[id] = { found: true, stars: 0, right: 0, wrong: 0, detail: null, words: ['', '', ''], due: Date.now() + DAY, interval: 0, confiscated: false, at: Date.now() };
  if (!silent) emit('card:found', { id });
  addXp(20, 'card');
  return true;
};
// A right or wrong answer about a card. kind: 'image' | 'meaning' | 'astro' (the three stars).
export const answer = (id, ok, kind = 'meaning') => {
  const c = state.cards[id];
  if (!c) return;
  if (ok) {
    c.right += 1;
    const want = kind === 'image' ? 1 : kind === 'astro' ? 3 : 2;
    // stars come in order: one right answer of the right kind lifts the next star
    if (c.stars < 3 && c.stars + 1 <= want) { c.stars += 1; emit('card:star', { id, stars: c.stars }); addXp(10, 'star'); }
    c.interval = Math.min(INTERVALS.length - 1, c.interval + (isDue(id) ? 1 : 0));
    c.due = Date.now() + INTERVALS[c.interval] * DAY;
  } else {
    c.wrong += 1;
    state.stats.wrongByCard[id] = (state.stats.wrongByCard[id] || 0) + 1;
    c.interval = 0;
    c.due = Date.now();
  }
  save();
};
export const isDue = (id, now = Date.now()) => !!state.cards[id]?.found && (state.cards[id].due || 0) <= now;
export const dueIds = (now = Date.now()) => ownedIds().filter((id) => isDue(id, now));
export const confiscate = (ids) => { for (const id of ids) if (state.cards[id]) state.cards[id].confiscated = true; emit('cards:confiscated', { ids }); save(); };
export const recover = (id) => { if (state.cards[id]) { state.cards[id].confiscated = false; emit('card:recovered', { id }); save(); } };
export const confiscatedIds = () => foundIds().filter((id) => state.cards[id].confiscated);
export const setDetail = (id, detail) => { if (state.cards[id]) { state.cards[id].detail = detail; save(); } };
export const setWords = (id, words) => { if (state.cards[id]) { state.cards[id].words = words.slice(0, 3).map((w) => String(w || '').trim().slice(0, 24)); save(); } };
export const mostMissed = () => Object.entries(state.stats.wrongByCard).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

// ---- the player, the birth card, "la tua carta" -----------------------------------------------
export const setPlayer = ({ name, birth }) => {
  if (name != null) state.player.name = String(name).trim().slice(0, 20);
  if (birth) {
    const s = signOf(birth.d, birth.m);
    state.player.birth = birth; state.player.sign = s.id; state.player.birthCard = s.card;
    state.suit[s.suit] += 2; // the element of the sign gives the first push to the suit
    if (!state.lastPoint) { state.points[s.card] = (state.points[s.card] || 0) + 2; state.lastPoint = s.card; }
  }
  save();
};
export const signNow = () => SIGNS.find((s) => s.id === state.player.sign) || null;
export const isBirthday = (now = new Date()) => !!state.player.birth && state.player.birth.d === now.getDate() && state.player.birth.m === now.getMonth() + 1;
export const seasonOfBirth = () => { const m = state.player.birth?.m; if (!m) return null; return m === 12 || m <= 2 ? 'inverno' : m <= 5 ? 'primavera' : m <= 8 ? 'estate' : 'autunno'; };
// The card with most points; on a tie, the most recent.
export const yourCard = () => {
  let best = null, top = 0;
  for (const [id, n] of Object.entries(state.points)) if (n > top || (n === top && id === state.lastPoint)) { best = id; top = n; }
  return best || state.player.birthCard || 'm00';
};
export const yourSuit = () => Object.entries(state.suit).sort((a, b) => b[1] - a[1])[0][0];
// A reply or a behaviour gives a point to a card and, when given, to a suit.
export const addPoint = ({ card, suit, n = 1 } = {}) => {
  const before = yourCard();
  if (card && CARD[card]) { state.points[card] = (state.points[card] || 0) + n; state.lastPoint = card; }
  if (suit && suit in state.suit) state.suit[suit] += n;
  const after = yourCard();
  if (after !== before) emit('yourcard:changed', { from: before, to: after });
  save();
};

// ---- trust, flags, diary, steps -------------------------------------------------------------
export const addTrust = (who, n) => { if (who in state.trust) { state.trust[who] += n; emit('trust', { who, n, value: state.trust[who] }); save(); } };
export const trusts = (who) => (state.trust[who] || 0) >= 2; // "si fida": she helps at the trial
export const mostTrusting = () => Object.entries(state.trust).sort((a, b) => b[1] - a[1])[0][0];
export const setFlag = (k, v = true) => { state.flags[k] = v; emit('flag', { k, v }); save(); };
export const flag = (k) => state.flags[k];
export const writeDiary = (t) => { state.diary.push({ t, at: Date.now() }); if (state.diary.length > 40) state.diary.shift(); emit('diary', { t }); save(); };
export const lastDiary = (n = 3) => state.diary.slice(-n);
export const setStep = (id) => { if (state.step !== id) { state.step = id; emit('step', { id }); save(); } };
export const setChapter = (n) => { if (state.chapter !== n) { state.chapter = n; emit('chapter', { n }); save(); } };
export const stat = (k, n = 1) => { state.stats[k] = (state.stats[k] || 0) + n; save(); };
export const majorsMissingOfRow = (row) => MAJORS.filter((c) => c.row === row && !state.cards[c.id]?.found).map((c) => c.id);

// ---- the card of the day (drawn at the cottage bed, once per calendar day) --------------------
export const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const dayCard = () => (state.day?.date === todayKey() && hasCard(state.day.card) ? state.day.card : null);
