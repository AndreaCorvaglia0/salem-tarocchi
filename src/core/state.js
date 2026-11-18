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
  day: { date: null, card: null, turned: false, v: 0 }, // the card of the day (glue/threshold.rules.js)
  moon: { n: 0, last: null, cycles: 0 }, // the moon of the threshold: one slice a day she does something
  herbs: {}, // id -> { at }: the plants she has noticed (the herbarium)
  garden: { unlocked: false, beds: [null, null, null, null] }, // the beds at the cottage (glue/garden.rules.js)
  seeds: {}, // herb id -> seeds she owns
  pantry: {}, // herb id -> bunches harvested (for the potions, later)
  daily: { looks: {}, notes: 0, noteDay: null }, // looks read per card; notes shown so far
  settings: { music: true, sfx: true },
  // the portrait (docs/DESIGN.md "Il ritratto"): five axes -6..6, positive pole first
  traits: { esplora: 0, parola: 0, tono: 0, rischio: 0, guida: 0 },
  hits: { esplora: { plus: 0, minus: 0 }, parola: { plus: 0, minus: 0 }, tono: { plus: 0, minus: 0 }, rischio: { plus: 0, minus: 0 }, guida: { plus: 0, minus: 0 } },
  traitLog: [], // [{ at, traits, card }] at the end of every visit and session
  verdicts: [], // cards the Reader named, in order ({ do: 'verdict' })
  cardNow: null, // the last "la tua carta" announced (it keeps a small advantage: no flapping)
  told: {}, // card id -> true once the Reader has told it (a visit)
  visits: 0,
  // added 16 Nov (docs/DESIGN.md "Aggiunte del 16 novembre"): popularity and Tartufo points (levels in
  // core/bonds.js), treats she carries for him, the registry of optional things (core/extras.js:
  // id -> 'seen' | 'active' | 'done'), and the secondary mission she tracks instead of the main step
  pop: 0,
  tartufo: 0,
  treats: 0,
  extras: {},
  track: null,
  extrasAck: null, // done missions already shown once in the grimoire list (ui/mappa.js); null = a save from before: all acknowledged
  // the diary of readings (glue/selfread.js): [{ at, who, question, spread, cards, closing, note, real }], newest first
  readings: [],
  // the logic of 16 Nov afternoon (docs/DESIGN.md "La logica del gioco, ridefinita"): the bond with each witch
  // (core/witches.js; old saves start from trust in migrate), the trials played (src/trials: id -> { result,
  // errors, day, at }), the library (topic -> when it was last studied; topic -> the day it last gave xp),
  // the trial a witch or Tartufo has "sensed" (its study list is suggested in the library)
  bonds: {},
  trials: {},
  studied: {},
  studiedXp: {},
  trialSense: null,
  // «Che ne pensi di lei?» (glue/opinions.rules.js): what she said of the people she met, what she heard of them
  opinions: {},
  notesAck: null, // place notes she has read (ui/placenotes.js); null on an old save: what is true now counts as read
  // the smoke rite before a reading (glue/rite.rules.js freshRite: the same shape; normRite mends old values)
  rite: { n: 0, last: null, owned: ['rosa', 'alloro', 'cipresso'], picks: {}, mine: {}, skipped: 0, shown: 0, times: {}, lineDay: null, malva: false, gifts: {}, deck: 0 },
  // the grimoire's albums (glue/collect.js, notes/collezioni.md): the stones and the sibyl's figures she has
  // (id or card number -> { at, from }), the phrase a group of figures came with (from -> { who, phrase, cards }),
  // and the album pages not opened yet (key -> false means «nuova»: 'herb:<id>', 'stone:<id>', 'sibyl:<n>')
  stones: {},
  oracle: {},
  oracleFrom: {},
  albumSeen: {},
  // the sibyl pairs game (glue/sibylpairs.rules.js freshPlay: the same shape; normPlay mends old values)
  sibylPlay: { day: null, today: 0, plays: 0, rounds: 0, seen: {}, mine: [] },
  // the Reader asks about a card she told before, once a visit (story/visit.plan.js pickRecall): card id -> times asked
  recalled: {},
  dayAsked: null, // the day «Senza guardare» of the card of the day last counted as a review answer (glue/threshold.js)
  savedAt: 0, // when it was last written (ms): the newest copy wins when the game is restored
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
  for (const k of ['pop', 'tartufo', 'treats']) s[k] = Math.max(0, Number(s[k]) || 0);
  if (typeof s.extras !== 'object' || !s.extras || Array.isArray(s.extras)) s.extras = {};
  if (typeof s.track !== 'string') s.track = null;
  if (s.extrasAck != null && (typeof s.extrasAck !== 'object' || Array.isArray(s.extrasAck))) s.extrasAck = null;
  if (s.notesAck != null && (typeof s.notesAck !== 'object' || Array.isArray(s.notesAck))) s.notesAck = null;
  if (!Array.isArray(s.readings)) s.readings = [];
  for (const k of ['bonds', 'trials', 'studied', 'studiedXp']) if (typeof s[k] !== 'object' || !s[k] || Array.isArray(s[k])) s[k] = {};
  if (typeof s.trialSense !== 'string') s.trialSense = null;
  // One number per witch: the bond (state.bonds) is the truth, state.trust is only its copy for the readers
  // that still say `trust` (core/cond.js, core/progress.js). An old save keeps the larger of the two, so
  // nothing she built is lost (core/witches.js carryTrust: same rule).
  if (typeof s.trust !== 'object' || !s.trust || Array.isArray(s.trust)) s.trust = {};
  for (const w of ['malva', 'ortica', 'edera', 'ginepra']) {
    const b = Number.isFinite(s.bonds[w]) ? s.bonds[w] : 0, t = Math.round(Number(s.trust[w]) || 0);
    s.bonds[w] = Math.max(0, Math.round(b), t);
    s.trust[w] = s.bonds[w];
  }
  // the old power table: seals and the far sight are gone (sealed things open with a question)
  if (s.powers) for (const k of ['seals', 'sense2', 'light2']) delete s.powers[k];
  if (s.tools) delete s.tools.sieve; // the sieve is gone: the sixth sense and Tartufo do its job
  if (s.flags) delete s.flags['sight.far'];
  for (const k of ['stones', 'oracle', 'oracleFrom', 'albumSeen']) if (typeof s[k] !== 'object' || !s[k] || Array.isArray(s[k])) s[k] = {}; // the albums (glue/collect.js)
  if (typeof s.sibylPlay !== 'object' || !s.sibylPlay || Array.isArray(s.sibylPlay)) s.sibylPlay = { day: null, today: 0, plays: 0, rounds: 0, seen: {}, mine: [] }; // the sibyl pairs (glue/sibylpairs.js)
  // learning better (docs/BACKLOG.md 2): the Reader's recall questions, the day the card of the day last counted for the review
  if (typeof s.recalled !== 'object' || !s.recalled || Array.isArray(s.recalled)) s.recalled = {};
  if (typeof s.dayAsked !== 'string') s.dayAsked = null;
  return s;
};

// ---- storage ---------------------------------------------------------------------------------------
// Two copies in localStorage (KEY, and BAK refreshed about once a minute); a save that cannot be read is
// never overwritten in silence: it is kept under BROKEN and `loadTrouble` says so. core/vault.js mirrors
// every save outside localStorage (IndexedDB, the artifact's own store) and restores from there.
const BAK = `${KEY}-bak`, OLD = `${KEY}-old`, BROKEN = `${KEY}-broken`;
const ls = () => { try { return globalThis.localStorage || null; } catch { return null; } };
const read = (k) => { try { return ls()?.getItem(k) || null; } catch { return null; } };
const put = (k, v) => { try { ls()?.setItem(k, v); return true; } catch { return false; } };
export const parseSave = (raw) => { try { const o = typeof raw === 'string' ? JSON.parse(raw) : raw; return o && typeof o === 'object' ? migrate(merge(fresh(), o)) : null; } catch { return null; } };
export let loadTrouble = false;
const load = () => {
  const raw = read(KEY), bak = read(BAK);
  const a = raw ? parseSave(raw) : null, b = bak ? parseSave(bak) : null;
  if (raw && !a) { loadTrouble = true; put(BROKEN, raw); }
  if (a?.started) return a;
  if (b?.started) return b;
  return a || fresh();
};

export const state = load();

const hooks = [];
// fn(raw): called after every write of a started game (core/vault.js mirrors it elsewhere)
export const onSaved = (fn) => { hooks.push(fn); };
let lastBak = 0;
const write = () => {
  state.savedAt = Date.now();
  let raw;
  try { raw = JSON.stringify(state); } catch { return; }
  put(KEY, raw);
  if (!state.started) return;
  if (state.savedAt - lastBak > 60000) { lastBak = state.savedAt; put(BAK, raw); }
  for (const fn of hooks) { try { fn(raw); } catch { /* a mirror must never break the game */ } }
};
let timer = null;
export const save = () => {
  if (timer) return;
  timer = setTimeout(() => { timer = null; write(); }, 150);
};
export const saveNow = () => write();
export const hasSave = () => !!state.started;
const replace = (f) => { for (const k of Object.keys(state)) delete state[k]; Object.assign(state, f); };
// A new game never destroys the old one: it is set aside (OLD, and the mirrors through `onArchive`).
const archivers = [];
export const onArchive = (fn) => { archivers.push(fn); };
export const archived = () => { const s = read(OLD) ? parseSave(read(OLD)) : null; return s?.started ? s : null; };
export const reset = () => {
  if (state.started) { let raw = null; try { raw = JSON.stringify(state); } catch { /* keep going */ } if (raw) { put(OLD, raw); for (const fn of archivers) { try { fn(raw); } catch { /* */ } } } }
  try { ls()?.removeItem(BAK); } catch { /* */ }
  lastBak = 0;
  // the threshold belongs to her, not to one game: the moon and the card of the day stay
  const keep = { moon: state.moon, day: state.day, daily: state.daily };
  replace({ ...fresh(), ...JSON.parse(JSON.stringify(keep)) }); saveNow();
};
// Replace the running game with a saved one (a mirror, the set-aside game, a code): -> true if it was taken
export const adopt = (raw) => { const s = parseSave(raw); if (!s?.started) return false; replace(s); lastBak = 0; saveNow(); return true; };
export const savedAtOf = (s) => (s?.started ? Math.max(1, Number(s.savedAt) || 0) : 0);
// tests and harness pages: replace the state with a prepared one
export const setState = (patch) => { replace(migrate(merge(fresh(), patch))); };
