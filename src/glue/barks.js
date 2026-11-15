// Picking one short line from data/story/barks.js for a situation, and throttling repeats.
import { test, fill } from '../core/cond.js';
import { BARKS } from '../data/story/index.js';

export const pick = (list, rng = Math.random) => (list.length ? list[Math.floor(rng() * list.length)] : null);
export const barkFor = (group, on, rng) => {
  const list = (BARKS[group] || []).filter((b) => b && (!on || b.on === on) && test(b.when));
  const b = pick(list, rng);
  return b ? fill(b.t) : null;
};

// once(kind, ms): true at most once every ms per kind (pure on a clock you pass, for tests)
export function throttle(ms, now = () => Date.now()) {
  const last = new Map();
  return (kind, gap = ms) => { const t = now(); if (last.has(kind) && t - last.get(kind) < gap) return false; last.set(kind, t); return true; };
}
