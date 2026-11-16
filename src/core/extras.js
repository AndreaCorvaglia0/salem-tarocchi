// The registry of optional things (docs/DESIGN.md "Il registro delle cose in più"): every optional
// piece has an id, and state.extras[id] remembers 'seen' (opened once in the grimoire's list),
// 'active' (she tracked it) or 'done'. 'done' is also derived from the entry's `done` condition, so old
// saves show the right state; an entry added in a later version has no stored state and shows as new.
// Today the entries are the side missions (data/story SIDE); later content just adds entries.
// `track`: the secondary mission she follows instead of the main step (state.track, null = the main one).
import { state, save } from './state.js';
import { emit } from './bus.js';
import { test } from './cond.js';
import { SIDE } from '../data/story/index.js';

const asList = (x) => (Array.isArray(x) ? x : Object.values(x || {}));
// { id, kind, text, at, when, done, chapter }
export const EXTRAS = asList(SIDE).filter((m) => m && m.id).map((m) => ({ kind: 'side', ...m, text: m.text || m.note || '' }));
const byId = (id, list = EXTRAS) => list.find((e) => e.id === id) || null;

// Pure on a state and a condition tester (tests pass their own).
export const extraDone = (e, s = state, t = test) => s.extras?.[e.id] === 'done' || (e.done != null && t(e.done, s));
export const extraOpen = (e, s = state, t = test) => !extraDone(e, s, t) && t(e.when, s);
// 'done' | 'active' | 'seen' | 'new' (available, never opened) | 'hidden' (not available yet)
export function extraStatus(e, s = state, t = test) {
  if (extraDone(e, s, t)) return 'done';
  if (!t(e.when, s)) return 'hidden';
  const v = s.extras?.[e.id];
  return v === 'active' || v === 'seen' ? v : 'new';
}
export const extrasTotal = (list = EXTRAS) => list.length;
export const extrasDone = (s = state, t = test, list = EXTRAS) => list.filter((e) => extraDone(e, s, t)).length;
// the list shown in the grimoire: available ones first (tracked, new, the rest), then the done ones
// she had been given (a card found before anybody spoke of it counts as done, but is not listed)
const RANK = { active: 0, new: 1, seen: 2, done: 3 };
export const extrasShown = (s = state, t = test, list = EXTRAS) => list.map((e) => ({ ...e, status: extraStatus(e, s, t) }))
  .filter((e) => e.status !== 'hidden' && (e.status !== 'done' || t(e.when, s)))
  .map((e) => ({ ...e, tracked: s.track === e.id && e.status !== 'done' }))
  .sort((a, b) => (a.tracked ? -1 : b.tracked ? 1 : 0) || RANK[a.status] - RANK[b.status]);

// the anchor the guide and the map circle point to: the tracked mission's, else null (the main step's)
export const trackedExtra = (s = state, t = test, list = EXTRAS) => {
  const e = s.track ? byId(s.track, list) : null;
  return e && extraOpen(e, s, t) ? e : null;
};

export const markSeen = (id) => { if (!state.extras[id]) { state.extras[id] = 'seen'; save(); } };
export const track = (id) => {
  const e = id ? byId(id) : null;
  const next = e && extraOpen(e) ? e.id : null;
  if (next) { state.extras[next] = 'active'; }
  if (state.track === next) { save(); return; }
  state.track = next;
  save();
  emit('track', { id: next, at: e?.at || null });
};
// Store 'done' for finished entries and drop a finished tracked one (call it after anything may finish one).
export function syncExtras() {
  let changed = false;
  for (const e of EXTRAS) if (state.extras[e.id] !== 'done' && e.done != null && test(e.done)) { state.extras[e.id] = 'done'; changed = true; emit('extra:done', { id: e.id }); }
  if (state.track && !trackedExtra()) { state.track = null; changed = true; emit('track', { id: null, at: null }); }
  if (changed) save();
  return changed;
}
