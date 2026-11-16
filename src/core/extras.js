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
// { id, kind, text, at, when, done, chapter, after, key }
// CATCHING UP (the rule for everything added after players have started): a new piece is an entry whose
// availability depends only on what she HAS (a power, a flag, a count), never on being at a certain point
// of the story, so a player who is already further on still gets it.
//   after: [ids]  the entries that must be done first. A chain shows only its first undone link, so
//                 a save that is far ahead meets the pieces one at a time, in order.
//   key: true     she needs it to go on (a lesson the next chapter relies on): it is never held back by
//                 the cap below, and `keyPending()` lets the story ask for it before a chapter gate.
// At most MAX_NEW entries that she has never opened are shown at once (keys excepted); the others wait
// their turn, oldest first, so a new version never drops a dozen missions on her at the same time.
export const EXTRAS = asList(SIDE).filter((m) => m && m.id).map((m) => ({ kind: 'side', ...m, text: m.text || m.note || '' }));
const byId = (id, list = EXTRAS) => list.find((e) => e.id === id) || null;

// Pure on a state and a condition tester (tests pass their own).
export const extraDone = (e, s = state, t = test) => s.extras?.[e.id] === 'done' || (e.done != null && t(e.done, s));
export const MAX_NEW = 2;
const afterDone = (e, s, t, list) => asList(e.after).every((id) => { const a = byId(id, list); return !a || extraDone(a, s, t); });
// available by its own conditions and by its chain (not yet by the cap)
const ready = (e, s, t, list) => t(e.when, s) && afterDone(e, s, t, list);
// the never-opened entries allowed on the list now: every key, then the first MAX_NEW others in registry order
function allowedNew(s, t, list) {
  const out = new Set(); let n = 0;
  for (const e of list) {
    if (extraDone(e, s, t) || !ready(e, s, t, list)) continue;
    const v = s.extras?.[e.id];
    if (v === 'active' || v === 'seen') { if (!e.key && e.kind !== 'side') n += 1; continue; } // already on her list: it uses a place
    if (e.key || e.kind === 'side') out.add(e.id); // keys, and the notes the story itself hands her
  }
  for (const e of list) {
    if (n >= MAX_NEW) break;
    if (e.key || e.kind === 'side' || extraDone(e, s, t) || !ready(e, s, t, list)) continue;
    const v = s.extras?.[e.id];
    if (v === 'active' || v === 'seen') continue;
    out.add(e.id); n += 1;
  }
  return out;
}
export const extraOpen = (e, s = state, t = test, list = EXTRAS) => !extraDone(e, s, t) && ready(e, s, t, list);
// the key pieces she still has to do, first of each chain first: the story may ask for them before a gate
export const keyPending = (s = state, t = test, list = EXTRAS) => list.filter((e) => e.key && extraOpen(e, s, t, list));
// 'done' | 'active' | 'seen' | 'new' (available, never opened) | 'hidden' (not available yet)
export function extraStatus(e, s = state, t = test, list = EXTRAS, allowed = null) {
  if (extraDone(e, s, t)) return 'done';
  if (!ready(e, s, t, list)) return 'hidden';
  const v = s.extras?.[e.id];
  if (v === 'active' || v === 'seen') return v;
  return (allowed || allowedNew(s, t, list)).has(e.id) ? 'new' : 'hidden';
}
export const extrasTotal = (list = EXTRAS) => list.length;
export const extrasDone = (s = state, t = test, list = EXTRAS) => list.filter((e) => extraDone(e, s, t)).length;
// the list shown in the grimoire: available ones first (tracked, new, the rest), then the done ones
// she had been given (a card found before anybody spoke of it counts as done, but is not listed)
const RANK = { active: 0, new: 1, seen: 2, done: 3 };
export const extrasShown = (s = state, t = test, list = EXTRAS, allowed = allowedNew(s, t, list)) => list.map((e) => ({ ...e, status: extraStatus(e, s, t, list, allowed) }))
  .filter((e) => e.status !== 'hidden' && (e.status !== 'done' || t(e.when, s)))
  .map((e) => ({ ...e, tracked: s.track === e.id && e.status !== 'done' }))
  .sort((a, b) => (a.tracked ? -1 : b.tracked ? 1 : 0) || RANK[a.status] - RANK[b.status]);

// the anchor the guide and the map circle point to: the tracked mission's, else null (the main step's)
export const trackedExtra = (s = state, t = test, list = EXTRAS) => {
  const e = s.track ? byId(s.track, list) : null;
  return e && extraOpen(e, s, t, list) ? e : null;
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
