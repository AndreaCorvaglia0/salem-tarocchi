// The garden in play (docs/DESIGN.md "L'orto"; rules: garden.rules.js; screen: ui/garden.js).
//   garden.open      the overlay (from the threshold with no world, or from the beds by the cottage door)
//   garden.thirsty   the threshold's subtitle: how many beds to check (or thirsty, once checked today)
//   garden.unlock    Ortica's gift: the beds and three seedlings (her scene `garden.ortica`)
// The unlock is a side thing in the registry (core/extras.js): it becomes available, also to a player far
// ahead, once she has met Ortica in the wood (chapter 2 on, past the step c2.ortica) and noticed at least
// four herbs; the flag `garden.offer` records that, `garden.given` that the scene was played.
import { provide, call, has, wrap } from '../core/services.js';
import { state, save } from '../core/state.js';
import { on, emit } from '../core/bus.js';
import { test } from '../core/cond.js';
import { EXTRAS } from '../core/extras.js';
import { todayKey, addXp, setFlag } from '../core/progress.js';
import { SCRIPTS, CAST } from '../data/story/index.js';
import { GARDEN_SCRIPTS } from '../data/story/scripts/garden.js';
import { HERB, HERB_LIST } from '../data/herbs/base.js';
import { openGarden } from '../ui/garden.js';
import { normGarden, normCounts, plant as plantBed, water as waterBed, settle, harvest as harvestBed, touch as touchBed, resoil, move, bedLight, summary, summaryText, readyCount, seedlings, moonSeed } from './garden.rules.js';

export const GARDEN_HERBS = 4; // herbs in the herbarium before Ortica offers the garden
const ORDER = HERB_LIST.map((p) => p.id);
const risk = (id) => HERB[id]?.risk || null;

// ---- the state, always sane (old saves have none of it) ---------------------------------------------
export function garden() {
  const g = normGarden(state.garden);
  state.garden = g;
  state.seeds = normCounts(state.seeds);
  state.pantry = normCounts(state.pantry);
  return g;
}
export const seeds = () => { garden(); return state.seeds; };
export const pantry = () => { garden(); return state.pantry; };
const changed = () => { save(); emit('garden', {}); };

// ---- the actions (the screen calls these) --------------------------------------------------------
// When the garden is opened: long-forgotten plants wilt a step. -> [bed indexes that wilted]
export function settleAll(today = todayKey()) {
  const g = garden(), out = [];
  g.beds.forEach((b, i) => { const r = settle(b, today); if (r.bed !== b) { g.beds[i] = r.bed; if (r.wilted) out.push(i); } });
  if (out.length || g.beds.some(Boolean)) save();
  return out;
}
export function plantIn(i, herb, terra, today = todayKey()) {
  const g = garden();
  if (g.beds[i] || !(state.seeds[herb] > 0)) return null;
  state.seeds[herb] -= 1; if (!state.seeds[herb]) delete state.seeds[herb];
  g.beds[i] = plantBed(herb, today, terra);
  changed();
  return g.beds[i];
}
export function waterIn(i, today = todayKey()) {
  const g = garden(), b = g.beds[i];
  if (!b) return null;
  const r = waterBed(b, today, bedLight(i));
  g.beds[i] = r.bed;
  changed();
  return r;
}
// «Tocca la terra»: what her finger finds -> 'wet' | 'top' | 'deep'
export function touchIn(i, today = todayKey()) {
  const g = garden(), b = g.beds[i];
  if (!b) return null;
  const r = touchBed(b, today);
  g.beds[i] = r.bed; changed();
  return r.feel;
}
export function resoilIn(i, terra, today = todayKey()) {
  const g = garden(), b = g.beds[i];
  if (!b || b.terra === terra) return null;
  g.beds[i] = resoil(b, terra, today); changed();
  return g.beds[i];
}
export function moveIn(from, to) {
  const g = garden(), beds = move(g.beds, from, to);
  if (!beds) return false;
  g.beds = beds; changed();
  return true;
}
// the threshold's subtitle: «2 da controllare», «una ha sete», «tutto a posto» ...
export const gardenNote = (today = todayKey()) => summaryText(summary(garden(), today));
export function harvestIn(i) {
  const g = garden(), r = harvestBed(g.beds[i]);
  if (!r) return null;
  g.beds[i] = r.bed;
  state.pantry[r.herb] = (state.pantry[r.herb] || 0) + 1;
  addXp(r.xp, 'garden');
  changed();
  return r;
}

// ---- the unlock --------------------------------------------------------------------------------------
const MET_ORTICA = [{ chapterMin: 2 }, { not: { step: 'c2.ortica' } }];
const herbsSeen = () => Object.keys(state.herbs || {}).filter((id) => HERB[id]).length;
export const gardenOffered = () => test(MET_ORTICA) && herbsSeen() >= GARDEN_HERBS;
function checkOffer() {
  if (!state.started || state.flags['garden.offer'] || !gardenOffered()) return;
  setFlag('garden.offer');
}
function unlock() {
  const g = garden();
  if (g.unlocked) return [];
  const gift = seedlings(state.herbs, risk, ORDER);
  // the seedlings wait in her hands: she plants them herself, where she likes
  for (const id of gift) state.seeds[id] = (state.seeds[id] || 0) + 1;
  g.unlocked = true;
  if (!state.flags['garden.given']) state.flags['garden.given'] = true;
  changed();
  emit('flag', { k: 'garden.given', v: true });
  const names = gift.map((id) => HERB[id].name.toLowerCase());
  if (has('hud.toast')) call('hud.toast', `Tre piantine da mettere a dimora: ${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}. L'orto è accanto alla porta della tua capanna, e si apre anche dal tavolo, prima di entrare in partita.`);
  return gift;
}

// a seed from the full moon (glue/threshold.js): one of her herbs, once the garden is hers
export function moonSeedGift(date = todayKey()) {
  if (!garden().unlocked) return null;
  const id = moonSeed(state.herbs, ORDER, date);
  if (!id) return null;
  state.seeds[id] = (state.seeds[id] || 0) + 1; save();
  return id;
}
export const buySeed = (id) => { seeds(); state.seeds[id] = (state.seeds[id] || 0) + 1; save(); };

// ---- registration (at import, before the world starts) --------------------------------------------
Object.assign(SCRIPTS, GARDEN_SCRIPTS);
if (!EXTRAS.some((e) => e.id === 'garden.ortica')) {
  EXTRAS.push({ id: 'garden.ortica', kind: 'errand', at: 'forest.ortica_hut', when: { flag: 'garden.offer' }, done: { flag: 'garden.given' },
    text: 'Ortica ha qualcosa per me, per fare un orto accanto alla mia capanna: devo passare da lei, nel bosco.' });
}
// Ortica at her hut: before her everyday chat, after the lessons she gives there
const GARDEN_CAST = { id: 'ortica', kind: 'npc', who: 'ortica', at: 'forest.ortica_hut', when: [{ flag: 'garden.offer' }, { notFlag: 'garden.given' }], script: 'garden.ortica', label: 'Ortica' };
if (!CAST.includes(GARDEN_CAST)) {
  const chat = CAST.findIndex((e) => e.id === 'ortica' && e.script === 'ortica.chat');
  CAST.splice(chat >= 0 ? chat : CAST.length, 0, GARDEN_CAST);
}
// the beds by the cottage door
CAST.push({ id: 'garden.beds', kind: 'prop', at: 'village.orto', when: { flag: 'garden.given' }, script: 'garden.look', label: 'L\'orto', verb: 'Guarda' });

provide('garden.unlock', () => Promise.resolve(unlock()));
// what the threshold shows under «L'orto» (no count of thirsty plants until she has touched their soil)
provide('garden.thirsty', () => Promise.resolve(garden().unlocked ? gardenNote() : null));
provide('garden.ready', () => Promise.resolve(readyCount(garden())));
provide('garden.open', (o) => openGarden(o));

for (const e of ['herb', 'step', 'chapter']) on(e, () => checkOffer());
checkOffer();
// a game restored or begun later: check again when the world starts
wrap('world.start', async (prev, ...a) => { checkOffer(); return prev?.(...a); });
