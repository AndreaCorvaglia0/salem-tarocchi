// The witches' interests (notes/interessi/PROGETTO.md), pure rules: no DOM, no clock of their own (`today` is a
// todayKey 'YYYY-MM-DD'). Tests: tests/interests.test.mjs. The first slice is Ortica's: herbs and garden.
//   a mission done is the flag `int.<witch>.<n>`; the steps (1, 2, 3) come at the 2nd, 4th and 6th mission
//   state.interests = { day: { witch: todayKey of her last mission }, hung: [{ herb, n, day }], back: [...] }
//   state.pantry = { herb: fresh bunches }   state.pantryDry = { herb: dried bunches }
// Bunches are never made nor lost here: a fresh bunch she hangs on Ortica's beam is a dried one the next day.
import { GARDEN } from '../data/garden.js';
import { leavesOf } from '../data/sapere.js';
import { ORTICA_MISSIONS, HANG, MORTAR } from '../data/interests/ortica.js';

export const WITCHES = ['ortica', 'malva', 'edera', 'ginepra'];
export const MISSIONS = { ortica: ORTICA_MISSIONS };
export const missionFlag = (witch, n) => `int.${witch}.${n}`;
const MAX = 6;
const cnt = (o) => Object.values(o || {}).reduce((a, b) => a + (Number(b) || 0), 0);

// ---- how far she is ---------------------------------------------------------------------------------
export const doneCount = (witch, s) => Array.from({ length: MAX }, (_, i) => i + 1).filter((n) => s?.flags?.[missionFlag(witch, n)]).length;
// the step of an interest (0..3): 1 after two missions, 2 after four, 3 after six (core/cond.js { interest } agrees)
export const levelOf = (witch, s) => Math.floor(doneCount(witch, s) / 2);
// The interest that weighs most: the one with most missions, at least three; on a tie, the one that grew last
// (the later day of the last mission). null when none has three.
export function preponderant(s) {
  let best = null;
  for (const w of WITCHES) {
    const n = doneCount(w, s);
    if (n < 3) continue;
    const day = s?.interests?.day?.[w] || '';
    if (!best || n > best.n || (n === best.n && day > best.day)) best = { w, n, day };
  }
  return best ? best.w : null;
}
// one mission a day per interest
export const canStep = (witch, s, today) => s?.interests?.day?.[witch] !== today;

// ---- the start ---------------------------------------------------------------------------------------
// Ortica asks once her garden is hers and she has a bunch of her own in the pantry (a garden lesson is not needed).
export const orticaReady = (s) => !!s?.flags?.['garden.given'] && cnt(s?.pantry) > 0;

// ---- 1. the beam ---------------------------------------------------------------------------------------
export const dryOk = (place) => !!HANG.find((p) => p.id === place)?.ok;
// her fresh bunches as a list of herb ids, one entry per bunch, in a stable order (the screen shows them)
export const freshList = (pantry, order = Object.keys(GARDEN)) => order.flatMap((id) => Array(Math.max(0, Number(pantry?.[id]) || 0)).fill(id));
// What she hangs: up to three of her bunches (`picked`, herb ids, one per bunch, she must own them); Ortica
// lends the rest. -> { mine: [ids], lent: n } or null when a pick is not hers.
export function beamPicks(pantry, picked, n = 3) {
  const left = { ...(pantry || {}) }, mine = [];
  for (const id of (picked || []).slice(0, n)) { if (!(left[id] > 0)) return null; left[id] -= 1; mine.push(id); }
  return { mine, lent: n - mine.length };
}
// Hanging moves her bunches from the fresh pantry to the beam, dated today. -> { pantry, hung }
export function hang(pantry, hung, mine, today) {
  const p = { ...(pantry || {}) }, add = {};
  for (const id of mine) { if (!(p[id] > 0)) continue; p[id] -= 1; if (!p[id]) delete p[id]; add[id] = (add[id] || 0) + 1; }
  return { pantry: p, hung: [...(hung || []), ...Object.entries(add).map(([herb, k]) => ({ herb, n: k, day: today }))] };
}
// On a later day the bunches on the beam are dry and come back to her pantry. -> { hung, dry, moved }
export function settleHung(hung, dry, today) {
  const keep = [], d = { ...(dry || {}) };
  let moved = 0;
  for (const b of hung || []) {
    if (!b || !GARDEN[b.herb] || !(b.n > 0)) continue;
    if (typeof b.day === 'string' && b.day < today) { d[b.herb] = (d[b.herb] || 0) + b.n; moved += b.n; } else keep.push(b);
  }
  return { hung: keep, dry: d, moved };
}

// ---- 2. the mortar --------------------------------------------------------------------------------------
// the herbs of an intention, from the circle (src/data/sapere.js): ids of the herbarium
export const herbsFor = (intention) => leavesOf(intention, 'erbe').map((L) => L.ref).filter(Boolean);
export const rightJars = (jars = MORTAR.jars, intention = MORTAR.intention) => jars.filter((id) => herbsFor(intention).includes(id));
// two different jars, both of the intention
export const mortarOk = (herbs, intention = MORTAR.intention) => Array.isArray(herbs) && herbs.length === 2 && herbs[0] !== herbs[1] && herbs.every((id) => herbsFor(intention).includes(id));
// what Ortica says of a wrong pair: the line of its first herb that is not of the intention
export const mortarWhy = (herbs, intention = MORTAR.intention) => { const bad = (herbs || []).find((id) => !herbsFor(intention).includes(id)); return bad ? MORTAR.wrong[bad] || null : null; };

// ---- 3. the sage ---------------------------------------------------------------------------------------
// her own dried sage if she has some, else Ortica's (the witch always lends)
export const sageOwn = (dry) => (Number(dry?.salvia) || 0) > 0;

// ---- level 1: a herb for an illness ---------------------------------------------------------------------
// The herbs of «guarigione e conforto» she can give, dried first: -> { herb, dry } or null
export function healHerb(pantry, dry, intention = MORTAR.intention) {
  const ok = herbsFor(intention).filter((id) => GARDEN[id]); // none of these is poisonous
  const d = ok.find((id) => (Number(dry?.[id]) || 0) > 0);
  if (d) return { herb: d, dry: true };
  const f = ok.find((id) => (Number(pantry?.[id]) || 0) > 0);
  return f ? { herb: f, dry: false } : null;
}
const male = (id) => /^(il|lo) /.test(GARDEN[id]?.the || '') || ['alloro', 'assenzio', 'aconito'].includes(id);
// «della melissa secca», «del timo secco», «dell'achillea fresca»
export function herbPhrase(id, dry) {
  const the = GARDEN[id]?.the || id, adj = dry ? (male(id) ? 'secco' : 'secca') : (male(id) ? 'fresco' : 'fresca');
  const part = the.replace(/^la /, 'della ').replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, 'dell\'');
  return `${part} ${adj}`;
}
// «questa lavanda è tua», «questo timo è tuo» (Ortica, sniffing the bunch she has in the pantry; after a colon)
export function bunchPhrase(id) {
  const name = (GARDEN[id]?.the || id).replace(/^(la |il |lo |l')/, '');
  return male(id) ? `questo ${name} è tuo` : `questa ${name} è tua`;
}
// the herb she has most of, fresh (Ortica smells it)
export const firstBunch = (pantry, order = Object.keys(GARDEN)) => order.filter((id) => (Number(pantry?.[id]) || 0) > 0).sort((a, b) => pantry[b] - pantry[a])[0] || null;
// Taking one bunch: from the dried pantry if `dry`, else the fresh one. -> the new { pantry, dry } or null
export function takeBunch(pantry, dry, herb, isDry) {
  const p = { ...(pantry || {}) }, d = { ...(dry || {}) }, src = isDry ? d : p;
  if (!(src[herb] > 0)) return null;
  src[herb] -= 1; if (!src[herb]) delete src[herb];
  return { pantry: p, dry: d };
}
// the visitors who come back: the ones given a herb on an earlier day -> [due], [still waiting]
export const backDue = (back, today) => [(back || []).filter((b) => b && b.day < today), (back || []).filter((b) => b && !(b.day < today))];

// ---- the registry and the cast -----------------------------------------------------------------------------
// The chain: each mission after the one before (the first after Ortica's gift of the garden), each one shown only
// on a later day than the last mission (one step a day). Never a key: the story ends without them.
export function orticaEntries(list = ORTICA_MISSIONS) {
  return list.map((m, i) => {
    const prev = i ? list[i - 1].id : null;
    const when = prev ? [{ flag: prev }, { interestRested: 'ortica' }] : { flag: 'int.ortica.offered' };
    return {
      extra: { id: m.id, kind: 'interest', at: m.at, when, done: { flag: m.id }, after: [prev || 'garden.ortica'], text: m.text },
      cast: { id: 'ortica', kind: 'npc', who: 'ortica', at: m.at, when: [...(Array.isArray(when) ? when : [when]), { notFlag: m.id }], script: m.script, label: 'Ortica' },
    };
  });
}
// the scene that starts it, and the miller in the square on a later day than his ointment
export const ORTICA_START = { id: 'ortica', kind: 'npc', who: 'ortica', at: 'forest.ortica_hut', when: [{ flag: 'int.ortica.ready' }, { notFlag: 'int.ortica.offered' }], script: 'int.ortica.start', label: 'Ortica' };
export const MILLER_SQUARE = { id: 'int.miller', kind: 'npc', who: 'miller', at: 'village.well', when: [{ flag: 'int.ortica.2' }, { notFlag: 'int.ortica.miller' }, { interestRested: 'ortica' }], script: 'int.ortica.miller', label: 'Il mugnaio' };
