// Two small measures added on 16 Nov (docs/DESIGN.md "Aggiunte del 16 novembre"): popularity (how much
// the village talks of her, from good readings) and Tartufo's points (treats, pats, walks together).
// Each is a number of points in the state with five levels 0..4; reaching a level emits `pop:up` or
// `tartufo:up` { level }. The pure rules for gaining points live here too, so they can be tested.
import { state, save } from './state.js';
import { emit } from './bus.js';

// level 0..n-1 of `points` against ascending thresholds (the first is 0)
export const levelFrom = (points, thresholds) => {
  let l = 0;
  for (let i = 0; i < thresholds.length; i++) if ((Number(points) || 0) >= thresholds[i]) l = i;
  return l;
};
// how far into the current level: { level, into 0..1, top }
export const progressFrom = (points, thresholds) => {
  const l = levelFrom(points, thresholds);
  if (l >= thresholds.length - 1) return { level: l, into: 1, top: true };
  const a = thresholds[l], b = thresholds[l + 1];
  return { level: l, into: Math.max(0, Math.min(1, ((Number(points) || 0) - a) / (b - a))), top: false };
};

// ---- popularity ---------------------------------------------------------------------------------
// The names are for the grimoire only; the characters say it in their own words (data/story/barks.js `pop`).
export const POP = [
  { at: 0, name: 'Nessuno sa chi sei' },
  { at: 3, name: 'Qualcuno parla di te' },
  { at: 8, name: 'Il tuo nome gira' },
  { at: 16, name: 'Vengono a cercarti' },
  { at: 30, name: 'Ti conosce tutto il villaggio' },
];
export const POP_AT = POP.map((p) => p.at);
export const popLevel = (s = state) => levelFrom(s.pop, POP_AT);
export const popProgress = (s = state) => progressFrom(s.pop, POP_AT);

// A client's reading: +2 with no wrong answer, +1 with one or two, 0 otherwise; +1 more the first time
// a returning client is served. wrong: wrong answers in the reading.
export const popForReading = ({ wrong = 0, total = 0, firstBack = false } = {}) => {
  const w = Math.max(0, Math.round(Number(wrong) || 0));
  // a reading asks two questions per card and one at the end: "a few mistakes" is up to a third of them
  const few = total > 0 ? w * 3 <= total : w <= 2;
  return (w === 0 ? 2 : few ? 1 : 0) + (firstBack ? 1 : 0);
};
// wrong answers from a reading's result: { wrong } when the reading says it, else from score and size
export const wrongOf = (result, n) => {
  if (Number.isFinite(result?.wrong)) return result.wrong;
  const sc = Number(result?.score), k = Number(n) || 0;
  if (!Number.isFinite(sc) || !k) return null;
  return Math.max(0, Math.round((1 - sc) * k));
};

const bump = (key, n, thresholds, evt) => {
  n = Math.round(Number(n) || 0);
  if (!n) return 0;
  const before = levelFrom(state[key], thresholds);
  state[key] = Math.max(0, (Number(state[key]) || 0) + n);
  const after = levelFrom(state[key], thresholds);
  emit(key, { n, value: state[key] });
  for (let l = before + 1; l <= after; l++) emit(evt, { level: l });
  save();
  return n;
};
export const addPop = (n) => bump('pop', n, POP_AT, 'pop:up');

// ---- Tartufo ------------------------------------------------------------------------------------
// The judgement in the grimoire is his opinion of her, by level.
export const TARTUFO = [
  { at: 0, judge: 'Ti tollera, come si tollera un mobile nuovo.' },
  { at: 4, judge: 'Ha deciso che puoi restare, purché tu non tocchi il suo angolo.' },
  { at: 10, judge: 'Ti segue anche quando non hai niente in mano, e questo lui lo considera un grande complimento.' },
  { at: 20, judge: 'Dorme sul tuo grimorio aperto: lo ritiene suo, e ritiene sua anche te.' },
  { at: 35, judge: 'Sei la sua umana. Non lo ammetterà mai, ma ti ha già presentata alla luna.' },
];
export const TARTUFO_AT = TARTUFO.map((t) => t.at);
export const tartufoLevel = (s = state) => levelFrom(s.tartufo, TARTUFO_AT);
export const tartufoJudge = (s = state) => TARTUFO[tartufoLevel(s)].judge;
export const addTartufo = (n) => bump('tartufo', n, TARTUFO_AT, 'tartufo:up');
export const addTreats = (n = 1) => { state.treats = Math.max(0, (Number(state.treats) || 0) + n); emit('treats', { n, treats: state.treats }); save(); };

// What a tap on Tartufo does: a treat if she has one (+3), else a pat (+1, at most once every PAT_MS of play).
export const TREAT_PTS = 3, PAT_MS = 180000;
export const tapOutcome = ({ treats = 0, now = 0, lastPat = -Infinity } = {}) => {
  if (treats > 0) return { kind: 'treat', points: TREAT_PTS };
  return { kind: 'pat', points: now - lastPat >= PAT_MS ? 1 : 0 };
};
// The chance he finds a treat when she steps into an 8x8 cell: 0.25 in a cell never visited away
// from the mission's way, 0.02 in one already visited (and on the way), 0 during a script; at most
// one find every FIND_GAP ms.
export const FIND_GAP = 40000;
export const treatChance = ({ fresh = false, nearRoute = false, script = false, now = 0, lastFind = -Infinity } = {}) => {
  if (script || now - lastFind < FIND_GAP) return 0;
  return fresh && !nearRoute ? 0.25 : 0.02;
};
