// Edera's interest in play, stones (notes/interessi/PROGETTO.md §4; rules: interests.edera.rules.js; scenes:
// data/story/scripts/interests.edera.js; words: data/interests/edera.js; screens: ui/interests/cellar.js, stones.js).
// Imported by glue/index.js right after glue/interests.js, which owns what the interests share (interests.step,
// one mission a day): this file wraps interests.step, so it must come after.
// - the start plays in Edera's nook once she has told her about stones and three are in her album (flag
//   `int.edera.ready`, set here from what she HAS, so a save far ahead gets it too);
// - three missions in the registry (core/extras.js, kind 'interest'): a chain, one offered at a time, each on a
//   later day than the last mission of this interest; never a key. Missions 4-6 are not written yet (the sixth
//   is the one where Edera calls her by her real name: lore/decisioni/decisioni-2026-11-18.md);
// - the screens are services the scenes call: interests.cellar, interests.courage, interests.labels;
//   interests.giveBack is the constable giving her stone back the day after;
// - level 1 («In tasca»): one stone in her pocket from its album page (service stones.pocket, asked by
//   ui/collect.js); with a stone of courage or protection, the decisive mistake of the day's first lost Exam
//   becomes a second try on another card (service exam.second, asked by systems/exam.js).
// Nothing here nags: one interface line when the pocket first becomes possible, then only the slips on the map.
import { provide, call, has, wrap } from '../core/services.js';
import { state, save } from '../core/state.js';
import { on } from '../core/bus.js';
import { todayKey, setFlag } from '../core/progress.js';
import { EXTRAS } from '../core/extras.js';
import { SCRIPTS, CAST } from '../data/story/index.js';
import { INTEREST_EDERA_SCRIPTS } from '../data/story/scripts/interests.edera.js';
import { POCKET } from '../data/interests/edera.js';
import { openCellar } from '../ui/interests/cellar.js';
import { openCourage, openLabels, pocketRow } from '../ui/interests/stones.js';
import { levelOf } from './interests.rules.js';
import * as R from './interests.edera.rules.js';

const pocket = () => (state.pocket = R.normPocket(state.pocket));

// the start, from what she has
function checkReady() {
  if (!state.started || state.flags['int.edera.ready']) return;
  if (R.ederaReady(state)) setFlag('int.edera.ready');
}

// ---- the screens ------------------------------------------------------------------------------------------
provide('interests.cellar', async () => {
  const res = await openCellar();
  if (res?.ok) setFlag('int.edera.1.found');
  return res;
});
provide('interests.courage', async () => {
  const p = pocket();
  const res = await openCourage(R.courageChoices(state.stones, p.lent?.stone || null));
  if (!res?.ok || !R.courageOk(res.stone)) return res;
  if (res.lent) setFlag('int.edera.2.lent');
  else if (state.stones?.[res.stone]) { state.pocket = R.lendTo(p, res.stone, todayKey()); save(); }
  setFlag('int.edera.2.chosen');
  return res;
});
provide('interests.labels', async () => {
  const shelf = R.shelfStones(state.stones);
  const res = await openLabels({ shelf, names: R.labelNames(state.stones, shelf) });
  if (res?.ok) setFlag('int.edera.3.written');
  return res;
});
provide('interests.giveBack', () => { state.pocket = R.giveBack(pocket()); save(); return Promise.resolve(true); });

// the step of the interest: once the pocket becomes possible, one interface line (never a character's)
wrap('interests.step', async (prev, witch, n, ...a) => {
  const r = await prev?.(witch, n, ...a);
  if (witch === 'edera' && levelOf('edera', state) >= 1 && !state.flags['int.edera.pocket.told']) {
    setFlag('int.edera.pocket.told');
    if (has('hud.toast')) call('hud.toast', POCKET.learnt);
  }
  return r;
});

// ---- level 1: the pocket -------------------------------------------------------------------------------------
// The section of a stone's album page (ui/collect.js): -> an element, or null before level 1 or for a stone
// she does not have. `refresh` rebuilds the page.
provide('stones.pocket', (id, refresh = () => {}) => {
  if (levelOf('edera', state) < 1 || !state.stones?.[id]) return null;
  const p = pocket();
  return pocketRow({
    id, inPocket: p.stone === id, lent: p.lent?.stone === id, other: p.stone && p.stone !== id ? p.stone : null,
    onPut: (x) => { if (!R.canPocket(state, x)) return; state.pocket = R.pocketPut(pocket(), x); save(); refresh(); },
    onTake: () => { state.pocket = R.pocketTake(pocket()); save(); refresh(); },
  });
});
// The Exam asks, at the decisive mistake (never with the judge): -> [title, line] once a day, or null
provide('exam.second', ({ kind } = {}) => {
  if (kind === 'judge') return null;
  const today = todayKey();
  const stone = R.secondTry(state, levelOf('edera', state), today);
  const words = stone ? R.secondWords(kind || 'constable', stone) : null;
  if (!words) return null;
  state.pocket = R.useSecond(pocket(), today); save();
  return words;
});

// ---- registration (at import, before the world starts) -------------------------------------------------------
Object.assign(SCRIPTS, INTEREST_EDERA_SCRIPTS);
// Edera's scenes go before her everyday chat (after her lessons, which come first in cast.js)
const beforeChat = (entry) => {
  if (CAST.some((e) => e.script === entry.script)) return;
  const chat = CAST.findIndex((e) => e.id === 'edera' && e.script === 'edera.chat');
  CAST.splice(chat >= 0 ? chat : CAST.length, 0, entry);
};
beforeChat(R.EDERA_START);
for (const { extra, cast } of R.ederaEntries()) {
  if (!EXTRAS.some((e) => e.id === extra.id)) EXTRAS.push(extra);
  if (cast.kind === 'npc') beforeChat(cast);
  else if (!CAST.some((e) => e.script === cast.script)) CAST.push(cast);
}
// the constable the day after his stone: before his own encounter, with its id, so only one stands at the well
if (!CAST.some((e) => e.script === R.GUARD_WELL.script)) {
  const enc = CAST.findIndex((e) => e.id === 'enc.guard');
  CAST.splice(enc >= 0 ? enc : CAST.length, 0, R.GUARD_WELL);
}

for (const e of ['talk', 'collect', 'map:enter', 'flag']) on(e, () => checkReady());
wrap('world.start', async (prev, ...a) => { pocket(); checkReady(); return prev?.(...a); });
