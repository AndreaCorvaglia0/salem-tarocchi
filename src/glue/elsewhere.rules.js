// Altrove, the pure part of glue/elsewhere.js (node can import it): the state key, the restore after a
// reload, a world's status, and at import the registry entries, the triggers' CAST props and scripts.
import { state } from '../core/state.js';
import { todayKey } from '../core/progress.js';
import { EXTRAS } from '../core/extras.js';
import { SCRIPTS, CAST } from '../data/story/index.js';
import { WORLD_LIST } from '../data/elsewhere/index.js';

export const mem = (s = state) => { const w = s.world || (s.world = {}); return w.elsewhere || (w.elsewhere = { in: null, from: null, results: {} }); };

// ---- a visit cut short by a closed page: back in Salem, where she was ------------------------------
export function restore(s = state) {
  const m = s.world?.elsewhere;
  if (!m?.in) return false;
  if (m.from) s.pos = { ...m.from };
  m.in = null; m.from = null;
  return true;
}

// ---- the registry, the triggers in Salem (at import) -------------------------------------------------------------
export const doneFlag = (id) => `elsewhere.${id}.done`;
export function status(id, s = state, today = todayKey()) {
  const r = mem(s).results?.[id];
  if (!r) return 'open';
  if (r.result !== 'fail') return 'done';
  return r.day === today ? 'wait' : 'open';
}
for (const W of WORLD_LIST) {
  const id = `elsewhere.${W.id}`;
  // the chain also as conditions, so it holds even where the entry it follows is not registered
  const chain = (W.after || []).map((a) => (a === 'library.first' ? { flag: 'library.first' } : a.startsWith('elsewhere.') ? { flag: doneFlag(a.slice(10)) } : true));
  if (!EXTRAS.some((e) => e.id === id)) EXTRAS.push({ id, kind: 'trial', text: W.note, at: W.trigger.at, when: [W.when, ...chain], done: { flag: doneFlag(W.id) }, after: W.after });
  SCRIPTS[id] = [...(W.trigger.script || []), { do: 'elsewhere', id: W.id }];
  // shown while it is on her list: available, its chain done, not yet passed
  if (!CAST.some((e) => e.id === id)) CAST.push({ id, kind: 'prop', at: W.trigger.at, when: [W.when, ...chain, { notFlag: doneFlag(W.id) }], script: id, label: W.trigger.label, verb: W.trigger.verb || 'Guarda' });
}
