// A tiny event bus. Events are listed in docs/CONTRACT.md.
const subs = new Map();
export const on = (evt, fn) => { if (!subs.has(evt)) subs.set(evt, new Set()); subs.get(evt).add(fn); return () => subs.get(evt)?.delete(fn); };
export const emit = (evt, data) => { for (const fn of [...(subs.get(evt) || [])]) { try { fn(data); } catch (e) { console.error(`[bus] ${evt}`, e); } } };
