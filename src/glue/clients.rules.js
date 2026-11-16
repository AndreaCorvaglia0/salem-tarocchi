// Who knocks at the cottage after the first, scripted reading of a chapter: a client of this chapter
// not read yet (random), then, when all are done, old faces come back. Pure (tests).
//   nextClient({ clients, chapter, done(id), spreads, rng }) -> { id, spread, back } | null
const BY_CHAPTER = { 1: 'single', 2: 'ppf', 3: 'celtic' };

export function nextClient({ clients, chapter, done, spreads = {}, rng = Math.random }) {
  const ch = Math.min(3, Math.max(1, chapter || 1));
  const known = ['single', 'ppf', 'celtic'].filter((s) => spreads[s]);
  if (!known.length) return null;
  const mine = clients.filter((c) => c.chapter === ch);
  const fresh = mine.filter((c) => !done(c.id));
  const pool = fresh.length ? fresh : clients.filter((c) => c.chapter >= 1 && c.chapter <= ch);
  if (!pool.length) return null;
  const c = pool[Math.floor(rng() * pool.length)];
  // a new client asks for the chapter's spread; one who comes back takes any spread she knows
  const want = BY_CHAPTER[c.chapter];
  const spread = !fresh.length ? known[Math.floor(rng() * known.length)] : spreads[want] ? want : known[known.length - 1];
  return { id: c.id, spread, back: !fresh.length };
}

// ---- the cottage is never empty (16 Nov): generated clients, the ones sent away, a second visitor ----

// The tier of a generated client, from popularity (core/bonds.js popLevel) and rank (xp level: 4
// Fattucchiera, 7 Strega). One visitor in four comes from the tier below: poor people keep knocking.
export function tierFor({ pop = 0, level = 1, rng = Math.random } = {}) {
  const score = (Number(pop) || 0) + (level >= 7 ? 2 : level >= 4 ? 1 : 0);
  const t = score >= 4 ? 2 : score >= 2 ? 1 : 0;
  return t > 0 && rng() < 0.25 ? t - 1 : t;
}
// About one visitor in six is sent away; more among the poor (tier 0), fewer among the important.
export const REFUSE_RATE = { 0: 0.25, 1: 1 / 6, 2: 0.12 };
export const BACK_RATE = 0.2; // an old face of the story comes back

// What knocks when no story client of this chapter is left: 'refuse' | 'back' | 'gen'.
export function pickVisitor({ tier = 0, hasBack = false, rng = Math.random } = {}) {
  const r = rng();
  const refuse = REFUSE_RATE[tier] ?? REFUSE_RATE[0];
  if (r < refuse) return 'refuse';
  if (hasBack && r < refuse + BACK_RATE) return 'back';
  return 'gen';
}

// The spread of a generated client: tier 0 always one card; tier 1 at most past-present-future; tier 2
// the chapter's spread. Only spreads she knows; null when she knows none.
const ORDER = ['single', 'ppf', 'celtic'];
export function spreadFor({ tier = 0, chapter = 1, spreads = {} } = {}) {
  const known = ORDER.filter((s) => spreads[s]);
  if (!known.length) return null;
  const want = BY_CHAPTER[Math.min(3, Math.max(1, chapter || 1))];
  const cap = tier <= 0 ? 'single' : tier === 1 ? 'ppf' : 'celtic';
  const top = ORDER[Math.min(ORDER.indexOf(want), ORDER.indexOf(cap))];
  return [...known].reverse().find((s) => ORDER.indexOf(s) <= ORDER.indexOf(top)) || known[0];
}

// With popularity 2 or more, a second visitor may wait outside (once per sitting).
export const canQueue = ({ pop = 0, second = false } = {}) => !second && pop >= 2;

// The recent keys of generated clients (makeClient avoid): the last `n` clients, three keys each at most.
export const pushRecent = (list = [], keys = [], max = 48) => [...(list || []), ...keys].slice(-max);

// People she has read for, remembered for the street: newest last, one entry per id, at most `max`.
export const rememberRead = (list = [], entry, max = 20) => (entry?.id ? [...(list || []).filter((e) => e.id !== entry.id), entry].slice(-max) : list || []);

// The story's clients who may stop her in the street (gender for the endings of the question); the twins
// (two people) and the woman without a shadow are not people one meets in the street.
export const STORY_PEOPLE = {
  'c1.widow': 'f', 'c1.baker': 'm', 'c1.mercy': 'f', 'c1.sailor': 'm', 'c2.miller': 'f', 'c2.hunter': 'm', 'c2.mother': 'f',
  'c3.clerk': 'm', 'c3.cook': 'f', 'c3.corey': 'm',
};
// The entry to remember after a reading. client: a story id or a generated client object; clients: CLIENTS.
export function readEntry(client, clients = []) {
  if (client && typeof client === 'object' && client.gen && !client.street) return { id: client.id, name: client.name, look: client.look, first: client.first, gender: client.gender, tier: client.tier };
  if (typeof client === 'string' && STORY_PEOPLE[client]) {
    const c = clients.find((x) => x.id === client);
    if (c) return { id: c.id, name: c.name, look: c.look, first: c.name, gender: STORY_PEOPLE[client], tier: null, story: true };
  }
  return null;
}

// In the street: when someone may stop her. Never in the prologue, never in chapter 1 before her first
// Exam, never during a script or near a patrol (the world checks that), only outdoors, only if she has
// read for someone; at most one every STREET_GAP[pop] ms of play, more often with popularity.
export const STREET_GAP = [360000, 300000, 240000, 180000, 150000];
export const streetChance = (pop = 0) => Math.min(0.75, 0.3 + 0.1 * (Number(pop) || 0));
export function streetDue({ chapter = 0, exams = 0, pop = 0, sinceMs = 0, outdoor = false, busy = false, known = 0 } = {}) {
  if (chapter < 1 || (chapter === 1 && !(exams > 0))) return false;
  if (busy || !outdoor || !(known > 0)) return false;
  return sinceMs >= STREET_GAP[Math.max(0, Math.min(4, pop))];
}
// who stops her: someone remembered, not the last one met in the street when there is a choice
export function streetPerson({ known = [], last = null, rng = Math.random } = {}) {
  const pool = known.length > 1 ? known.filter((k) => k.id !== last) : known;
  return pool.length ? pool[Math.floor(rng() * pool.length)] : null;
}
