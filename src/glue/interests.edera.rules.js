// Edera's interest, stones (notes/interessi/PROGETTO.md §4), pure rules: no DOM, no clock of their own
// (`today` is a todayKey 'YYYY-MM-DD'). Tests: tests/interests.edera.test.mjs. Shared rules (steps, one mission a
// day, the preponderant interest) are in interests.rules.js.
//   a mission done is the flag `int.edera.<n>`; the step 1 («In tasca») comes after two
//   state.pocket = { stone: id | null, used: todayKey of the last second try | '', lent: { stone, day } | null }
//     stone  the one stone she keeps in her pocket (chosen on its album page)
//     used   the day the stone last turned a lost Exam into a second try (once a day)
//     lent   her stone left in the constable's pocket for a night (mission 2), until he gives it back
// The albums are never changed here: a stone she has stays in state.stones.
import { SAPERE } from '../data/sapere.js';
import { STONE, STONE_LIST } from '../data/stones.js';
import { EDERA_MISSIONS, CELLAR, COURAGE, WRONG_ORDER, LABELS, POCKET } from '../data/interests/edera.js';

const owned = (stones) => STONE_LIST.map((x) => x.id).filter((id) => stones?.[id]);
// the intentions of a stone, from the circle
export const intentionsOf = (id) => SAPERE[STONE[id]?.sapere]?.intenzioni || [];
export const stonesFor = (intention) => STONE_LIST.map((x) => x.id).filter((id) => intentionsOf(id).includes(intention));

// ---- the start ---------------------------------------------------------------------------------------
// Edera asks once she has told her about stones (the first-of-a-kind words, glue/collect.js) and she has at
// least three in her album.
export const STONES_TO_START = 3;
export const ederaReady = (s) => !!s?.world?.once?.['first.stone'] && owned(s?.stones).length >= STONES_TO_START;

// ---- 1. the cellars ----------------------------------------------------------------------------------------
export const cellarFound = (spot) => !!CELLAR.spots.find((x) => x.id === spot)?.found;
// what Edera says when she looks in a place
export const cellarLine = (spot) => CELLAR.spots.find((x) => x.id === spot)?.re || null;

// ---- 2. a stone of courage --------------------------------------------------------------------------------
export const courageOk = (id) => intentionsOf(id).includes(COURAGE.intention);
// the stones on Edera's handkerchief: hers (album order, not one she has lent), and Edera's own when none of
// hers gives courage -> { mine: [ids], lent: [ids] }
export function courageChoices(stones, lentNow = null) {
  const mine = owned(stones).filter((id) => id !== lentNow);
  return { mine, lent: mine.some(courageOk) ? [] : [COURAGE.lend] };
}
// what Edera says of the stone she picked: { ok, line }
export function courageLine(id) {
  if (courageOk(id)) return { ok: true, line: COURAGE.right[id] || null };
  const its = intentionsOf(id);
  const k = WRONG_ORDER.find((x) => its.includes(x));
  return { ok: false, line: (k && COURAGE.wrong[k]) || null };
}

// ---- 3. the labels -------------------------------------------------------------------------------------------
// The four stones on the shelf: the ones she has, in the order she got them (the oldest she knows best), then
// Edera's others in album order. -> [ids]
export function shelfStones(stones, n = LABELS.n) {
  const ok = (id) => !LABELS.skip.includes(id);
  const mine = owned(stones).filter(ok).sort((a, b) => (Number(stones[a]?.at) || 0) - (Number(stones[b]?.at) || 0));
  const rest = STONE_LIST.map((x) => x.id).filter((id) => ok(id) && !mine.includes(id));
  return [...mine, ...rest].slice(0, n);
}
// The names she can write: the shelf's, and `decoys` more (hers first), in album order. -> [ids]
export function labelNames(stones, shelf, decoys = LABELS.decoys) {
  const ok = (id) => !LABELS.skip.includes(id) && !shelf.includes(id);
  const extra = [...owned(stones).filter(ok), ...STONE_LIST.map((x) => x.id).filter((id) => ok(id) && !stones?.[id])].slice(0, decoys);
  return STONE_LIST.map((x) => x.id).filter((id) => shelf.includes(id) || extra.includes(id));
}
export const labelOk = (stone, name) => stone === name;
// the line in her head when the name is wrong: what that stone looks like
export const labelWhy = (stone, name) => (labelOk(stone, name) ? null : LABELS.look[name] || null);

// ---- level 1: in her pocket ------------------------------------------------------------------------------------
export const freshPocket = () => ({ stone: null, used: '', lent: null });
export function normPocket(p) {
  const o = p && typeof p === 'object' && !Array.isArray(p) ? p : {};
  const lent = o.lent && typeof o.lent === 'object' && STONE[o.lent.stone] ? { stone: o.lent.stone, day: String(o.lent.day || '') } : null;
  return { stone: STONE[o.stone] ? o.stone : null, used: typeof o.used === 'string' ? o.used : '', lent };
}
// a stone that works in the pocket: courage or protection, in the circle
export const pocketWorks = (id) => POCKET.intentions.some((k) => intentionsOf(id).includes(k));
// may she put this stone in her pocket? her own, not lent tonight
export const canPocket = (s, id) => !!s?.stones?.[id] && normPocket(s?.pocket).lent?.stone !== id;
// put it in (one at a time: the one before goes back) or take it out -> the new pocket
export const pocketPut = (p, id) => ({ ...normPocket(p), stone: id });
export const pocketTake = (p) => ({ ...normPocket(p), stone: null });
// The second try of the day: level 1 of the interest, a stone that works in her pocket and still hers, not yet
// used today. -> the stone id, or null. `level` is levelOf('edera', s), passed by the caller.
export function secondTry(s, level, today) {
  if (!(level >= 1)) return null;
  const p = normPocket(s?.pocket);
  if (!p.stone || p.used === today || !canPocket(s, p.stone) || !pocketWorks(p.stone)) return null;
  return p.stone;
}
export const useSecond = (p, today) => ({ ...normPocket(p), used: today });
// the words in the Exam: [title, line] for that kind of Exam (never the judge)
export function secondWords(kind, stone) {
  const w = POCKET.exam[kind];
  if (!w || !POCKET.the[stone]) return null;
  return [w[0], w[1].replace('{pietra}', POCKET.the[stone])];
}

// ---- mission 2: her stone in the constable's pocket for a night -----------------------------------------------
export const lendTo = (p, stone, today) => ({ ...normPocket(p), lent: { stone, day: today }, stone: normPocket(p).stone === stone ? null : normPocket(p).stone });
export const giveBack = (p) => ({ ...normPocket(p), lent: null });

// ---- the registry and the cast -------------------------------------------------------------------------------
// The chain: each mission after the one before, each on a later day than the last mission of this interest.
// The first one waits for her start scene. Never a key: the story ends without them.
export function ederaEntries(list = EDERA_MISSIONS) {
  return list.map((m, i) => {
    const prev = i ? list[i - 1].id : null;
    const when = prev ? [{ flag: prev }, { interestRested: 'edera' }] : { flag: 'int.edera.offered' };
    const extra = { id: m.id, kind: 'interest', at: m.at, when, done: { flag: m.id }, after: prev ? [prev] : [], text: m.text };
    const whenCast = [...(Array.isArray(when) ? when : [when]), { notFlag: m.id }];
    // in the nook Edera asks; in the library the shelf is a thing (a prop beside the bookshelf)
    const cast = m.at === 'depths.edera_nook'
      ? { id: 'edera', kind: 'npc', who: 'edera', at: m.at, when: whenCast, script: m.script, label: 'Nonna Edera' }
      : { id: 'int.edera.shelf', kind: 'prop', at: m.at, when: whenCast, script: m.script, label: 'Le pietre di Edera', verb: 'Scrivi' };
    return { extra, cast };
  });
}
// the scene that starts it, in the nook
export const EDERA_START = { id: 'edera', kind: 'npc', who: 'edera', at: 'depths.edera_nook', when: [{ flag: 'int.edera.ready' }, { notFlag: 'int.edera.offered' }], script: 'int.edera.start', label: 'Nonna Edera' };
// the constable at the old well on a later day than mission 2. It takes the id of his own encounter (`enc.guard`,
// cast.js) and stands before it, so the two are never on the same tile at once.
export const GUARD_WELL = { id: 'enc.guard', kind: 'npc', who: 'conestabile', at: 'depths.well', when: [{ flag: 'int.edera.2' }, { notFlag: 'int.edera.guard' }, { interestRested: 'edera' }], script: 'int.edera.guard', label: 'Il conestabile del pozzo' };
