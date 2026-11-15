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
  tools: { bottle: 0, incense: 0, pendulum: 0 },
  powers: { cat: false, fire: false, sense: false, move: false, stun: false, broom: false }, // core/progress.js POWERS
  spreads: { single: false, ppf: false, celtic: false }, // taught by the mistresses
  lessons: {}, // lesson id -> true once taught
  pos: null, // { map, x, y }
  world: { opened: {}, taken: {}, talked: {}, once: {} },
  dupes: {}, // Minor duplicates found in the grass: { id: count }
  day: { date: null, card: null },
  settings: { music: true, sfx: true },
  // the portrait (docs/DESIGN.md "Il ritratto"): five axes -6..6, positive pole first
  traits: { esplora: 0, parola: 0, tono: 0, rischio: 0, guida: 0 },
  hits: { esplora: { plus: 0, minus: 0 }, parola: { plus: 0, minus: 0 }, tono: { plus: 0, minus: 0 }, rischio: { plus: 0, minus: 0 }, guida: { plus: 0, minus: 0 } },
  traitLog: [], // [{ at, traits, card }] at the end of every visit and session
  verdicts: [], // cards the Reader named, in order ({ do: 'verdict' })
  cardNow: null, // the last "la tua carta" announced (it keeps a small advantage: no flapping)
  told: {}, // card id -> true once the Reader has told it (a visit)
  visits: 0,
});

const merge = (base, saved) => {
  for (const k of Object.keys(saved || {})) {
    if (saved[k] && typeof saved[k] === 'object' && !Array.isArray(saved[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], saved[k]);
    else base[k] = saved[k];
  }
  return base;
};

// old saves: the portrait keys come from fresh(); here only values that would break the maths are fixed
export const migrate = (s) => {
  for (const k of Object.keys(s.traits)) { const v = Math.round(Number(s.traits[k]) || 0); s.traits[k] = Math.max(-6, Math.min(6, v)); }
  for (const k of ['traitLog', 'verdicts']) if (!Array.isArray(s[k])) s[k] = [];
  if (typeof s.told !== 'object' || !s.told) s.told = {};
  s.visits = Number(s.visits) || 0;
  // the old power table: seals and the far sight are gone (sealed things open with a question)
  if (s.powers) for (const k of ['seals', 'sense2', 'light2']) delete s.powers[k];
  if (s.tools) delete s.tools.sieve; // the sieve is gone: the sixth sense and Tartufo do its job
  if (s.flags) delete s.flags['sight.far'];
  return s;
};

const load = () => {
  try { const raw = globalThis.localStorage?.getItem(KEY); if (raw) return migrate(merge(fresh(), JSON.parse(raw))); } catch { /* no storage */ }
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
export const setState = (patch) => { const f = migrate(merge(fresh(), patch)); for (const k of Object.keys(state)) delete state[k]; Object.assign(state, f); };
