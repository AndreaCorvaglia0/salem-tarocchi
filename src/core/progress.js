// Everything the game remembers about the player's growth: experience and levels, the cards found
// and their stars, "la tua carta", trust, flags, the diary, the returning veil (spaced review).
// Pure functions of the state plus small mutators; every mutator saves and tells the bus.
import { state, save } from './state.js';
import { emit } from './bus.js';
import { CARD, MAJORS, SIGNS, signOf } from '../data/cards.base.js';
import * as PD from '../data/portrait.js'; // SIGNATURES, ADJ (being written: every read tolerates gaps)

// ---- levels ---------------------------------------------------------------------------------
// Nine levels, three per title. The first three come within the first quarter of an hour.
// Nine levels in the story, three per title; after the ending (Gran Maestra) three more, each needing
// clearly more, whose only gift is a wider sixth sense.
export const LEVEL_XP = [0, 30, 70, 200, 280, 370, 470, 590, 730, 950, 1250, 1650]; // xp for level 1..12
export const STORY_MAX = 9;
export const maxLevel = (s = state) => (s.flags?.['ending.seen'] ? LEVEL_XP.length : STORY_MAX);
export const TITLES = ['Novizia', 'Fattucchiera', 'Strega'];
export const levelOf = (xp = state.xp) => { let l = 1; for (let i = 0; i < LEVEL_XP.length; i++) if (xp >= LEVEL_XP[i]) l = i + 1; return Math.min(l, maxLevel()); };
export const titleOf = (level = levelOf()) => (state.flags['ending.seen'] ? 'Gran Maestra' : TITLES[Math.min(2, Math.floor((level - 1) / 3))]);
export const levelProgress = (xp = state.xp) => {
  const l = levelOf(xp);
  if (l >= maxLevel()) return { level: l, into: 1, need: 0, have: 0, top: true };
  const a = LEVEL_XP[l - 1], b = LEVEL_XP[l];
  return { level: l, into: (xp - a) / (b - a), need: b - a, have: xp - a, top: false };
};
// The sixth sense (power `sense`, Acqua): how far, in tiles, it feels a hidden card; it grows with every
// level from 5; at the top it covers the whole map (Infinity).
export const SENSE = { 5: 10, 6: 14, 7: 18, 8: 24, 9: 32, 10: 44, 11: 64 };
export const senseRadius = (level = levelOf()) => (level < 5 ? 0 : level >= LEVEL_XP.length ? Infinity : SENSE[level] || 0);
// The light she carries grows a little with each title (0, 1, 2): the world adds it to its radius.
export const lightStep = (level = levelOf()) => Math.min(2, Math.floor((level - 1) / 3));
// What each level brings (the world and the HUD read this).
// Power ids (state.powers): the familiar, the four elements of the four suits, the broom.
//   cat (Tartufo), fire (Fuoco, Bastoni: light in the dark, burns brambles), sense (Acqua, Coppe: the
//   sixth sense, senseRadius), move (Terra, Denari: roots and warded stones draw aside), stun (Aria,
//   Spade: a breath that confuses a constable, parts the fog), broom.
export const POWERS = ['cat', 'fire', 'sense', 'move', 'stun', 'broom'];
export const LEVEL_GIFTS = {
  2: { power: 'cat', text: 'Un gatto nero ha deciso che da stanotte starà con te.' },
  3: { text: 'Alla bottega del vicolo, adesso, ti aprono la porta.', flag: 'shop.open' },
  4: { power: 'fire', text: 'Ti si accende una fiammella sul palmo, e il buio non ti spaventa più.' },
  5: { power: 'sense', text: 'Quando una carta nascosta è vicina, adesso senti che ti chiama.' },
  6: { power: 'broom', text: 'La tua scopa adesso ti porta in volo nei posti che conosci.' },
  7: { power: 'stun', text: 'Ti basta un soffio per confondere chi vuole fermarti, e per diradare la nebbia.' },
  8: { power: 'move', text: 'Le radici e le pietre, se glielo chiedi, adesso si fanno da parte.' },
  9: { text: 'Adesso sei una strega fatta, e lo sanno tutte.', flag: 'level.nine' },
  10: { text: 'Le carte nascoste ti chiamano da più lontano.' },
  11: { text: 'Senti le carte nascoste quasi da un capo all\'altro del bosco.' },
  12: { text: 'Adesso senti ogni carta nascosta del posto in cui ti trovi.' },
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
// ---- the portrait: five traits, and "la tua carta" nearest to them ---------------------------
export const AXES = ['esplora', 'parola', 'tono', 'rischio', 'guida'];
export const TRAIT_MAX = 6;
const traitsOf = (s) => s.traits || {};
export const traitMass = (s = state) => AXES.reduce((a, k) => a + Math.abs(traitsOf(s)[k] || 0), 0);
// Each Major scores: how far the trait vector goes along its signature (dot product with the
// normalised signature), a small bonus from the old points, a head start for the birth card that fades
// as the traits fill, and a small edge for the card already announced (so it does not flap).
export const HEAD = 2.5, FADE = 8, POINT_W = 0.25, KEEP = 0.6;
export function cardScores(s = state) {
  const t = traitsOf(s), birth = s.player?.birthCard || 'm00', mass = traitMass(s);
  const head = HEAD * Math.max(0, 1 - mass / FADE);
  return MAJORS.map(({ id }) => {
    const sig = PD.SIGNATURES?.[id] || {};
    let dot = 0, nn = 0;
    for (const k of AXES) { const v = Number(sig[k]) || 0; dot += v * (t[k] || 0); nn += v * v; }
    const align = nn ? dot / Math.sqrt(nn) : 0;
    const score = align + POINT_W * (s.points?.[id] || 0) + (id === birth ? head : 0) + (id === s.cardNow ? KEEP : 0);
    return { id, score };
  });
}
export const yourCard = (s = state) => {
  if (!traitMass(s)) return s.player?.birthCard || 'm00';
  let best = null;
  for (const c of cardScores(s)) if (!best || c.score > best.score + 1e-9) best = c; // ties: the lower number
  return best.id;
};
// after anything that may move the card: announce it once
const settle = (before) => {
  const after = yourCard();
  if (after !== before) emit('yourcard:changed', { from: before, to: after });
  state.cardNow = after;
};
// "Il tuo seme", from the traits: Coppe cuore + gentile; Spade testa + schietta; Bastoni audace + dritta al
// punto; Denari prudente + accorta. The old suit tally is a small legacy bonus; the sign's element breaks ties.
export const SUIT_OF_TRAITS = {
  c: { guida: 1, tono: 1 }, s: { guida: -1, parola: 1 }, w: { rischio: 1, esplora: -1 }, p: { rischio: -1, parola: -1 },
};
export const suitScores = (s = state) => {
  const t = s.traits || {}, signSuit = SIGNS.find((x) => x.id === s.player?.sign)?.suit;
  return Object.fromEntries(Object.entries(SUIT_OF_TRAITS).map(([k, w]) => {
    const v = Object.entries(w).reduce((a, [ax, sg]) => a + Math.max(0, sg * (t[ax] || 0)), 0);
    return [k, v + 0.1 * (s.suit?.[k] || 0) + (k === signSuit ? 0.05 : 0)];
  }));
};
export const yourSuit = (s = state) => Object.entries(suitScores(s)).sort((a, b) => b[1] - a[1])[0][0];
// A reply or a behaviour gives a point to a card and, when given, to a suit.
export const addPoint = ({ card, suit, n = 1 } = {}) => {
  const before = yourCard();
  if (card && CARD[card]) { state.points[card] = (state.points[card] || 0) + n; state.lastPoint = card; }
  if (suit && suit in state.suit) state.suit[suit] += n;
  settle(before);
  save();
};
// addTrait({ parola: 1, tono: -1 }): clamped to -6..6, every contribution counted in state.hits.
export const addTrait = (delta = {}) => {
  const before = yourCard(), moved = {};
  for (const [k, raw] of Object.entries(delta || {})) {
    if (!AXES.includes(k)) continue;
    const n = Math.round(Number(raw) || 0);
    if (!n) continue;
    const h = state.hits[k] || (state.hits[k] = { plus: 0, minus: 0 });
    if (n > 0) h.plus += n; else h.minus -= n;
    const v = Math.max(-TRAIT_MAX, Math.min(TRAIT_MAX, (state.traits[k] || 0) + n));
    if (v !== state.traits[k]) moved[k] = v;
    state.traits[k] = v;
  }
  if (!Object.keys(delta || {}).some((k) => AXES.includes(k))) return;
  emit('trait', { delta, traits: { ...state.traits }, moved });
  settle(before);
  save();
};
// The Italian adjective of an axis when the trait is marked (|value| >= 3), else null.
export const traitWord = (axis, s = state) => {
  const v = traitsOf(s)[axis] || 0, adj = PD.ADJ?.[axis];
  if (Math.abs(v) < 3 || !adj) return null;
  return adj[v > 0 ? 0 : 1] || null;
};
// Up to three adjectives, strongest first (ties: axis order).
export const traitWords = (s = state, n = 3) => AXES.map((k, i) => ({ k, i, a: Math.abs(traitsOf(s)[k] || 0), w: traitWord(k, s) }))
  .filter((x) => x.w).sort((a, b) => b.a - a.a || a.i - b.i).slice(0, n).map((x) => x.w);
// The end of an encounter with the Reader: a snapshot of the portrait.
export const snapshot = () => {
  state.traitLog.push({ at: Date.now(), traits: { ...state.traits }, card: yourCard() });
  if (state.traitLog.length > 40) state.traitLog.shift();
  save();
};
export const lastSnapshot = (s = state) => (s.traitLog?.length ? s.traitLog[s.traitLog.length - 1] : null);
export const recordVerdict = () => { state.verdicts.push(yourCard()); save(); };
export const lastVerdict = (s = state) => (s.verdicts?.length ? s.verdicts[s.verdicts.length - 1] : null);
// The Reader told a card (a visit): it may now be asked by meaning; one star becomes two.
export const tellCard = (id) => {
  const c = state.cards[id];
  if (!c) return false;
  state.told[id] = true;
  if (c.stars === 1) { c.stars = 2; emit('card:star', { id, stars: 2 }); addXp(5, 'told'); }
  save();
  return true;
};
export const isTold = (id) => !!state.told?.[id];
export const untoldMajors = () => foundIds().filter((id) => CARD[id]?.arcana === 'major' && !state.told[id] && id !== 'm00')
  .sort((a, b) => (state.cards[a].at || 0) - (state.cards[b].at || 0));

// ---- trust, flags, diary, steps -------------------------------------------------------------
export const addTrust = (who, n) => { if (who in state.trust) { state.trust[who] += n; emit('trust', { who, n, value: state.trust[who] }); save(); } };
export const trusts = (who) => (state.trust[who] || 0) >= 2; // "si fida": she helps at the trial
export const mostTrusting = () => Object.entries(state.trust).sort((a, b) => b[1] - a[1])[0][0];
export const setFlag = (k, v = true) => { state.flags[k] = v; emit('flag', { k, v }); save(); };
export const flag = (k) => state.flags[k];
export const writeDiary = (t) => { state.diary.push({ t, at: Date.now() }); if (state.diary.length > 40) state.diary.shift(); emit('diary', { t }); save(); };
export const lastDiary = (n = 3) => state.diary.slice(-n);
// An interface hint, once per game (state.world.once['hint.<id>']); ui/hint.js shows it.
export const hintOnce = (id) => {
  const o = state.world.once || (state.world.once = {});
  if (o[`hint.${id}`]) return false;
  o[`hint.${id}`] = true; save(); emit('hint', { id });
  return true;
};
export const setStep = (id) => { if (state.step !== id) { state.step = id; emit('step', { id }); save(); } };
export const setChapter = (n) => { if (state.chapter !== n) { state.chapter = n; emit('chapter', { n }); save(); } };
export const stat = (k, n = 1) => { state.stats[k] = (state.stats[k] || 0) + n; save(); };
export const majorsMissingOfRow = (row) => MAJORS.filter((c) => c.row === row && !state.cards[c.id]?.found).map((c) => c.id);

// ---- the card of the day (drawn at the cottage bed, once per calendar day) --------------------
export const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const dayCard = () => (state.day?.date === todayKey() && hasCard(state.day.card) ? state.day.card : null);

// Old saves: the powers of the levels already reached (the table changed), nothing else.
export function syncPowers() {
  for (let l = 2; l <= levelOf(); l++) { const g = LEVEL_GIFTS[l]; if (g?.power) state.powers[g.power] = true; if (g?.flag) state.flags[g.flag] = true; }
}
syncPowers();
