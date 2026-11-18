// The smoke rite's rules, pure (no DOM, no clock of their own): what the rite looks like this time, which
// ember is under the thumb, what is saved, the line after, her tradition, the gifts. Data: src/data/rite.js.
// Spec: notes/rito/PROGETTO.md. Tests: tests/rite.rules.test.mjs, tests/rite.data.test.mjs.
import { AIRS, ARC, START_AIRS, MALVA, GIFTS } from '../data/rite.js';

export const SAME_SESSION_MS = 20 * 60 * 1000; // «la brace è ancora accesa» within twenty minutes
export const TRADITION_N = 3; // the same air three times for the same kind of question
export const KEEP_PICKS = 6; // the last picks kept per kind of question

// ---- the saved part: state.rite ----------------------------------------------------------------------
export const freshRite = () => ({
  n: 0, // rites completed (an air lit)
  last: null, // { air, at } the last air lit: the veil to clean, and «la brace è ancora accesa»
  owned: [...START_AIRS],
  picks: {}, // ambito -> [air, ...] (newest last, at most KEEP_PICKS)
  mine: {}, // ambito -> air: her tradition, once written in the grimoire
  skipped: 0, // «Leggo senza fumo»
  shown: 0, // how many times the rite was opened (lit, skipped or closed)
  times: {}, // phase -> { n, mean } seconds; and 'total.A' / 'total.B' / 'total.C' / 'total.same'
  lineDay: null, // the day the line after was last shown (YYYY-MM-DD)
  malva: false, // the scene at Malva's hearth has been seen
  gifts: {}, // air -> true once given
  deck: 0, // passes of smoke over the deck
  // made: { air: true } only once she has made an air with her own hands (the interests: Ortica's sage), shown
  // as «tua»; absent until then, so fresh() of core/state.js and old saves stay as they are
});

// Any saved value, old or damaged, becomes a valid rite (old saves have none: they start from the first rite).
export function normRite(r) {
  const f = freshRite();
  if (!r || typeof r !== 'object' || Array.isArray(r)) return f;
  const num = (v) => Math.max(0, Math.floor(Number(v) || 0));
  const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  const out = { ...f };
  out.n = num(r.n); out.skipped = num(r.skipped); out.shown = num(r.shown); out.deck = num(r.deck);
  out.last = r.last && AIRS[r.last.air] && Number.isFinite(Number(r.last.at)) ? { air: r.last.air, at: Number(r.last.at) } : null;
  const owned = new Set([...START_AIRS, ...(Array.isArray(r.owned) ? r.owned : []).filter((a) => AIRS[a])]);
  out.owned = ARC.filter((a) => owned.has(a));
  out.picks = {};
  for (const [k, v] of Object.entries(obj(r.picks))) if (MALVA[k] && Array.isArray(v)) out.picks[k] = v.filter((a) => AIRS[a]).slice(-KEEP_PICKS);
  out.mine = {};
  for (const [k, v] of Object.entries(obj(r.mine))) if (MALVA[k] && AIRS[v]) out.mine[k] = v;
  out.times = {};
  for (const [k, v] of Object.entries(obj(r.times))) if (v && Number.isFinite(v.mean) && v.n > 0) out.times[k] = { n: num(v.n), mean: Number(v.mean) };
  out.lineDay = typeof r.lineDay === 'string' ? r.lineDay : null;
  out.malva = !!r.malva;
  out.gifts = {};
  for (const [k, v] of Object.entries(obj(r.gifts))) if (AIRS[k] && v) out.gifts[k] = true;
  const made = Object.entries(obj(r.made)).filter(([k, v]) => AIRS[k] && v && out.owned.includes(k));
  if (made.length) out.made = Object.fromEntries(made.map(([k]) => [k, true]));
  return out;
}

// ---- what the rite looks like this time ---------------------------------------------------------------
// Breaths: three the first three times, two up to the ninth, then one; never zero.
export const breathsFor = (n) => (n < 3 ? 3 : n < 9 ? 2 : 1);
export const stageOf = (n) => (n < 3 ? 'A' : n < 9 ? 'B' : 'C');
export const sameSession = (r, now) => !!(r?.last && now >= r.last.at && now - r.last.at < SAME_SESSION_MS);

// The fixed durations of each part (seconds), per stage: the knock held, the ember lighting (with the
// motif), one breath, the name shown before the reading resumes. The spec's limits are for the whole rite
// (PROGETTO.md «Tempi da rispettare»); what is left is her time to search (tests/rite.rules.test.mjs).
export const DUR = {
  A: { knock: 1.0, light: 1.2, breath: 3.8, name: 1.8 },
  B: { knock: 1.0, light: 1.0, breath: 3.6, name: 1.4 },
  C: { knock: 1.0, light: 0.5, breath: 3.2, name: 0.9 },
  same: { knock: 0, light: 0, breath: 2.8, name: 1.0 },
};
export const LIMIT = { A: 22, B: 14, C: 8, same: 5 };
export const fixedTime = (stage, breaths) => { const d = DUR[stage]; return d.knock + d.light + d.breath * breaths + d.name; };

export function planRite(r, now) {
  const rr = normRite(r);
  const same = sameSession(rr, now);
  const stage = same ? 'same' : stageOf(rr.n);
  const breaths = same ? 1 : breathsFor(rr.n);
  return {
    n: rr.n, stage, same, breaths,
    knock: !same, // a second rite in the same sitting finds the ember already lit
    motif: !same,
    guide: rr.n < 3 && !same, // one short line per phase, the first three times
    skip: rr.n >= 3, // «Leggo senza fumo», quietly, from the fourth
    veil: rr.last ? rr.last.air : null, // the tint left by the last smoke, cleaned by the breaths
    owned: rr.owned,
    made: rr.owned.filter((a) => rr.made?.[a]), // her own airs: the name says «la tua salvia»
    dur: DUR[stage],
    fixed: fixedTime(stage, breaths),
    limit: LIMIT[stage],
  };
}

// ---- the arc and the thumb ---------------------------------------------------------------------------
// Five slots evenly spaced across the width; each ember answers within `catchK` of half the spacing, so
// between two embers there is a band where only the fire is (no ember, nothing lights). Only x counts:
// the thumb moves sideways under the arc, never diagonally.
export function arcSlots(width, { margin = 0.1, catchK = 0.72, rise = 46 } = {}) {
  const n = ARC.length, left = width * margin, step = (width - 2 * left) / (n - 1);
  return ARC.map((id, i) => {
    const t = (i / (n - 1)) * 2 - 1; // -1..1
    return { id, i, x: left + step * i, dy: -rise * (1 - t * t), half: (step / 2) * catchK };
  });
}
// x of the thumb -> the owned air whose ember is under it, or null (between embers, an unlit slot, outside)
export function emberAt(x, slots, owned) {
  if (!Number.isFinite(x)) return null;
  for (const s of slots) if (Math.abs(x - s.x) <= s.half) return owned.includes(s.id) ? s.id : null;
  return null;
}
// Lifting the thumb: an air lights only when it is lifted over a lit ember; anywhere else nothing happens
// (no air lights by staying still, by chance, or by default).
export const onRelease = (x, slots, owned, inside = true) => (inside ? emberAt(x, slots, owned) : null);

// The knock: held long enough on the coal (ms), never by a tap that lands in the first moments.
export const KNOCK_MS = 1000;
export const knockDone = (heldMs, need = KNOCK_MS) => heldMs >= need;

// ---- after the rite ------------------------------------------------------------------------------------
export const dayKey = (d) => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
// a running mean of a phase's real duration
export function addTime(times, key, secs) {
  if (!Number.isFinite(secs) || secs < 0 || secs > 600) return times;
  const t = times[key] || { n: 0, mean: 0 };
  const n = t.n + 1;
  return { ...times, [key]: { n, mean: Math.round((t.mean + (secs - t.mean) / n) * 100) / 100 } };
}
// What a lit air changes in the save. ambito may be null (a general picture without one).
export function afterLit(r, { air, ambito, at, phases = {} }) {
  const rr = normRite(r);
  const plan = planRite(rr, at);
  rr.n += 1; rr.shown += 1;
  rr.last = { air, at };
  if (ambito && MALVA[ambito]) rr.picks[ambito] = [...(rr.picks[ambito] || []), air].slice(-KEEP_PICKS);
  let times = rr.times;
  for (const [k, v] of Object.entries(phases)) times = addTime(times, k, v);
  const total = Object.values(phases).reduce((a, b) => a + (Number(b) || 0), 0);
  if (total > 0) times = addTime(times, `total.${plan.stage}`, total);
  rr.times = times;
  const t = ambito ? tradition(rr, ambito) : null;
  if (t) rr.mine[ambito] = t;
  return rr;
}
export function afterSkip(r) { const rr = normRite(r); rr.skipped += 1; rr.shown += 1; return rr; }

// Her tradition: the last TRADITION_N picks for a kind of question are the same air, and it is not Malva's.
// -> that air, or null. (Nothing is won if it matches Malva, nothing is lost if not: it is only written.)
export function tradition(r, ambito) {
  const p = normRite(r).picks[ambito] || [];
  if (p.length < TRADITION_N || !MALVA[ambito]) return null;
  const last = p.slice(-TRADITION_N);
  return last.every((a) => a === last[0]) && last[0] !== MALVA[ambito].air ? last[0] : null;
}
// The lines of her tradition, for the grimoire: [{ ambito, air, malva }]
export const traditionLines = (r) => Object.entries(normRite(r).mine).map(([ambito, air]) => ({ ambito, air, malva: MALVA[ambito].air }));

// The line after the reading: at most once per calendar day, and only after an air was lit.
export const factDue = (r, now, air) => !!air && normRite(r).lineDay !== dayKey(now);
export const malvaFor = (ambito) => MALVA[ambito] || null;

// ---- the airs that arrive later ------------------------------------------------------------------------
// One at a time, in order, each after a few rites and only once she knows who brings it.
export const GIFT_AFTER = { salvia: 4, mirra: 8 };
export function giftDue(r, s) {
  const rr = normRite(r);
  for (const g of GIFTS) {
    if (rr.owned.includes(g.air)) continue;
    const met = (Number(s?.bonds?.[g.from]) || 0) > 0 || (Number(s?.trust?.[g.from]) || 0) > 0;
    return rr.n >= GIFT_AFTER[g.air] && met ? g : null; // the first missing one decides: never the second before it
  }
  return null;
}
export function afterGift(r, air) { const rr = normRite(r); if (!rr.owned.includes(air)) rr.owned = ARC.filter((a) => a === air || rr.owned.includes(a)); rr.gifts[air] = true; return rr; }
// An air she made herself (the interests, notes/interessi/PROGETTO.md §2, mission 3: the sage tied at Ortica's).
// She owns it from now on (no second gift later: giftDue skips an owned air), and it is «tua». A player who had
// already received it after four rites keeps it, and from now on it is hers too.
export function afterMade(r, air) { if (!AIRS[air]) return normRite(r); const rr = afterGift(r, air); rr.made = { ...(rr.made || {}), [air]: true }; return rr; }

// The scene at Malva's hearth before the very first rite: once, and only if she has met Malva.
export const malvaSceneDue = (r, s) => !normRite(r).malva && normRite(r).n === 0 && ((Number(s?.bonds?.malva) || 0) > 0 || (Number(s?.trust?.malva) || 0) > 0 || (s?.chapter || 0) >= 1);
