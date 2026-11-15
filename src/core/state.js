// The whole game state, one object, saved to localStorage. Storage can be missing or throw
// (private artifact, private tab): every access is guarded and the game runs from memory.
// The shape is the contract between modules: docs/CONTRACT.md, "State".
const KEY = 'salem-tarocchi-v1';

export const fresh = () => ({
  v: 1,
  started: false,
  player: { name: '', birth: null, sign: null, birthCard: null }, // birth: { d, m, y }
  chapter: 0, // 0 prologue, 1..3 chapters, 4 after the ending
  step: 'p.session', // id of the next step of the main path (data/story/steps.js)
  xp: 0,
  coins: 0,
  cards: {}, // id -> { found, stars (0..3), right, wrong, detail, words: ['', '', ''], due, interval, confiscated, at }
  points: {}, // card id -> points towards "la tua carta"
  lastPoint: null,
  suit: { w: 0, c: 0, s: 0, p: 0 },
  trust: { malva: 0, ortica: 0, edera: 0, ginepra: 0 },
  flags: {}, // story flags and choices: 'b1.spoke': true ...
  words: { value: null, fear: null, dream: null }, // one word each, left by the sessions
  diary: [], // [{ t: 'Ho mentito al conestabile.', at }]
  stats: { steps: 0, exams: 0, examsPassed: 0, examsFailed: 0, jailed: 0, stuns: 0, fires: 0, readings: 0, draws: 0, locks: 0, wrongByCard: {}, examsByPlace: {}, seen: {} },
  tools: { bottle: 0, sieve: 0, incense: 0, pendulum: 0 },
  powers: { cat: false, fire: false, seals: false, stun: false, broom: false },
  spreads: { single: false, ppf: false, celtic: false }, // taught by the mistresses
  lessons: {}, // lesson id -> true once taught
  pos: null, // { map, x, y }
  world: { opened: {}, taken: {}, talked: {}, once: {} },
  day: { date: null, card: null },
  settings: { music: true, sfx: true },
});

const merge = (base, saved) => {
  for (const k of Object.keys(saved || {})) {
    if (saved[k] && typeof saved[k] === 'object' && !Array.isArray(saved[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], saved[k]);
    else base[k] = saved[k];
  }
  return base;
};

const load = () => {
  try { const raw = globalThis.localStorage?.getItem(KEY); if (raw) return merge(fresh(), JSON.parse(raw)); } catch { /* no storage */ }
  return fresh();
};

export const state = load();

let timer = null;
export const save = () => {
  if (timer) return;
  timer = setTimeout(() => { timer = null; try { globalThis.localStorage?.setItem(KEY, JSON.stringify(state)); } catch { /* no storage */ } }, 150);
};
export const saveNow = () => { try { globalThis.localStorage?.setItem(KEY, JSON.stringify(state)); } catch { /* no storage */ } };
export const hasSave = () => !!state.started;
export const reset = () => { const f = fresh(); for (const k of Object.keys(state)) delete state[k]; Object.assign(state, f); saveNow(); };
// tests and harness pages: replace the state with a prepared one
export const setState = (patch) => { const f = merge(fresh(), patch); for (const k of Object.keys(state)) delete state[k]; Object.assign(state, f); };
