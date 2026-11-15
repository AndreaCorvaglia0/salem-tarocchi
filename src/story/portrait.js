// The Reader's final portrait, as lines (pure: tests/story.portrait.test.mjs). Used by the session
// node { portrait: true }.
import { state } from '../core/state.js';
import { test } from '../core/cond.js';
import { AXES, yourSuit } from '../core/progress.js';
import * as PD from '../data/portrait.js';

// The final portrait (docs/CONTRACT.md "Portrait and visits"): per axis PORTRAIT[axis].torn when the
// axis is torn, else plus (>= 3) / minus (<= -3) / mid; then the first two PAIRS that hold; then
// SEEDS[yourSuit()]. Every piece may be missing.
export function portraitLines(s = state) {
  const out = [], t = s.traits || {};
  for (const k of AXES) {
    const p = PD.PORTRAIT?.[k];
    if (!p) continue;
    const v = t[k] || 0;
    const line = (p.torn && test({ torn: k }, s)) ? p.torn : p[v >= 3 ? 'plus' : v <= -3 ? 'minus' : 'mid'];
    if (line) out.push(line);
  }
  if (Array.isArray(PD.PAIRS)) out.push(...PD.PAIRS.filter((e) => e && e.t && test(e.when, s)).slice(0, 2).map((e) => e.t));
  const seed = PD.SEEDS?.[yourSuit()];
  if (seed) out.push(typeof seed === 'string' ? seed : seed.t);
  return out.filter((x) => typeof x === 'string' && x);
}
