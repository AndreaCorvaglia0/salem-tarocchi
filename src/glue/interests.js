// The witches' interests in play (notes/interessi/PROGETTO.md; rules: interests.rules.js; scenes:
// data/story/scripts/interests.ortica.js; words: data/interests/ortica.js; screens: ui/interests/).
// The first slice is Ortica's, herbs and garden:
// - the scene that starts it plays at her hut once her garden is hers and she has a bunch of her own in the pantry
//   (flag `int.ortica.ready`, set here from what she HAS, so a save far ahead gets it too);
// - three missions in the registry (core/extras.js, kind 'interest'): a chain after Ortica's gift of the garden,
//   one offered at a time, each on a later day than the last mission; never a key;
// - the screens are services the scenes call: interests.beam, interests.mortar, interests.bundle; interests.step
//   marks a mission done (its flag, today's date) and, after the third, gives the sage of the rite as «tua»;
// - the bunches hung on Ortica's beam are dried bunches in her pantry from the next day (settled on the way);
// - level 1 («Le mani»): a herb for a visitor who asks about an illness (glue/clients.js asks interests.refusal),
//   and that visitor comes back on a later night to say how it went (+1 popularity).
// Nothing here nags: no toast, no reminder, nothing at the threshold. Only the slip on the map.
import { provide, call, has, wrap } from '../core/services.js';
import { state, save } from '../core/state.js';
import { on } from '../core/bus.js';
import { test } from '../core/cond.js';
import { todayKey, setFlag } from '../core/progress.js';
import { addPop } from '../core/bonds.js';
import { EXTRAS } from '../core/extras.js';
import { SCRIPTS, CAST } from '../data/story/index.js';
import { INTEREST_ORTICA_SCRIPTS } from '../data/story/scripts/interests.ortica.js';
import { HEAL, HEAL_TAG } from '../data/interests/ortica.js';
import { pantry as gardenPantry } from './garden.js';
import { normRite, afterMade } from './rite.rules.js';
import { openBeam, openBundle } from '../ui/interests/beam.js';
import { openMortar } from '../ui/interests/mortar.js';
import * as R from './interests.rules.js';

const ix = () => {
  const i = state.interests && typeof state.interests === 'object' ? state.interests : (state.interests = {});
  if (!i.day || typeof i.day !== 'object') i.day = {};
  for (const k of ['hung', 'back']) if (!Array.isArray(i[k])) i[k] = [];
  if (!state.pantryDry || typeof state.pantryDry !== 'object') state.pantryDry = {};
  gardenPantry(); // the fresh pantry, normalised
  return i;
};

// ---- the beam dries: bunches hung on an earlier day come back dry -------------------------------------
export function settle(today = todayKey()) {
  const i = ix();
  if (!i.hung.length) return 0;
  const r = R.settleHung(i.hung, state.pantryDry, today);
  if (r.moved || r.hung.length !== i.hung.length) { i.hung = r.hung; state.pantryDry = r.dry; save(); }
  return r.moved;
}
// the start, from what she has
function checkReady() {
  if (!state.started || state.flags['int.ortica.ready']) return;
  ix();
  if (R.orticaReady(state)) setFlag('int.ortica.ready');
}

// ---- the scenes' tokens: {mazzetto} from her pantry ---------------------------------------------------------
const TOKENS = { 'int.ortica.start': () => ({ mazzetto: (() => { const id = R.firstBunch(state.pantry); return id ? R.bunchPhrase(id) : 'questo mazzetto è tuo'; })() }) };
const fillNodes = (x, v) => (typeof x === 'string' ? x.replace(/\{(\w+)\}/g, (all, k) => (k in v ? v[k] : all))
  : Array.isArray(x) ? x.map((y) => fillNodes(y, v)) : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, y]) => [k, fillNodes(y, v)])) : x);
wrap('story.run', (prev, what, ...a) => {
  const nodes = typeof what === 'string' && TOKENS[what] && SCRIPTS[what] ? fillNodes(SCRIPTS[what], TOKENS[what]()) : what;
  return prev?.(nodes, ...a);
});

// ---- the screens ------------------------------------------------------------------------------------------
provide('interests.beam', async () => {
  ix(); settle();
  const res = await openBeam({ pantry: { ...state.pantry } });
  if (!res?.ok) return res;
  const pick = R.beamPicks(state.pantry, res.mine);
  if (!pick) return { ok: false };
  const i = ix(), r = R.hang(state.pantry, i.hung, pick.mine, todayKey());
  state.pantry = r.pantry; i.hung = r.hung; save();
  setFlag('int.ortica.1.hung');
  return res;
});
provide('interests.mortar', async () => {
  const res = await openMortar();
  if (res?.ok && R.mortarOk(res.herbs)) setFlag('int.ortica.2.made');
  return res;
});
provide('interests.bundle', async () => {
  ix(); settle();
  const own = R.sageOwn(state.pantryDry);
  const res = await openBundle({ own });
  if (!res?.ok) return res;
  if (own) {
    const t = R.takeBunch(state.pantry, state.pantryDry, 'salvia', true);
    if (t) { state.pantry = t.pantry; state.pantryDry = t.dry; save(); setFlag('int.ortica.3.own'); }
  }
  setFlag('int.ortica.3.tied');
  return res;
});
// a mission done: its flag and today's date (one a day); the third gives the sage of the rite, «tua»
provide('interests.step', (witch, n) => {
  const i = ix();
  i.day[witch] = todayKey();
  if (witch === 'ortica' && Number(n) === 3) state.rite = afterMade(normRite(state.rite), 'salvia');
  save();
  setFlag(R.missionFlag(witch, n));
  return Promise.resolve(true);
});

// ---- level 1: a herb for an illness, and the visitor who comes back ----------------------------------------
// glue/clients.js asks for one more option for a visitor she sends away: -> an option for the story runner, or null
provide('interests.refusal', (v) => {
  const H = v && HEAL[v.id];
  if (!H || !test({ interest: ['ortica', 1] })) return null;
  ix();
  const pick = R.healHerb(state.pantry, state.pantryDry);
  if (!pick) return null;
  const herb = R.herbPhrase(pick.herb, pick.dry);
  return {
    t: H.me.replace('{herb}', herb), special: 'magic', tag: HEAL_TAG, trait: { tono: 1 },
    then: [{ say: v.name, t: H.re }, { do: 'call', name: 'interests.give', args: [v.id, v.name, v.person?.gender || 'f', pick.herb, pick.dry] }],
  };
});
provide('interests.give', (id, name, gender, herb, dry) => {
  const i = ix();
  const t = R.takeBunch(state.pantry, state.pantryDry, herb, !!dry);
  if (t) { state.pantry = t.pantry; state.pantryDry = t.dry; }
  i.back = [...i.back.filter((b) => b.id !== id), { id, name, gender, herb, day: todayKey() }];
  save();
  return Promise.resolve(true);
});
const ending = (g) => (g === 'm' ? 'o' : 'a');
async function serveBack() {
  const i = ix();
  const [due, wait] = R.backDue(i.back, todayKey());
  const b = due.find((x) => HEAL[x.id]);
  if (!b) return false;
  i.back = [...due.filter((x) => x !== b), ...wait]; save();
  const [n, said] = HEAL[b.id].back;
  await call('story.run', [{ say: 'narra', t: n.replace('{name}', b.name).replace(/\{o\}/g, ending(b.gender)) }, { say: b.name, t: said }]);
  addPop(1);
  return true;
}
if (has('clients.next')) {
  wrap('clients.next', async (prev, opts = {}) => {
    if (!opts.force && !opts.second) { try { await serveBack(); } catch (e) { console.warn('[interests]', e); } }
    return prev?.(opts);
  });
}

// ---- registration (at import, before the world starts) -------------------------------------------------------
Object.assign(SCRIPTS, INTEREST_ORTICA_SCRIPTS);
const beforeChat = (entry) => {
  if (CAST.some((e) => e.script === entry.script)) return;
  const chat = CAST.findIndex((e) => e.id === 'ortica' && e.script === 'ortica.chat');
  CAST.splice(chat >= 0 ? chat : CAST.length, 0, entry);
};
beforeChat(R.ORTICA_START);
for (const { extra, cast } of R.orticaEntries()) {
  if (!EXTRAS.some((e) => e.id === extra.id)) EXTRAS.push(extra);
  beforeChat(cast);
}
if (!CAST.some((e) => e.script === R.MILLER_SQUARE.script)) CAST.push(R.MILLER_SQUARE);

// the garden page shows the dried bunches: settle them first
wrap('garden.open', (prev, ...a) => { settle(); return prev?.(...a); });
for (const e of ['garden', 'map:enter', 'flag']) on(e, () => checkReady());
on('map:enter', () => settle());
globalThis.document?.addEventListener?.('visibilitychange', () => { if (!globalThis.document.hidden) settle(); });
wrap('world.start', async (prev, ...a) => { settle(); checkReady(); return prev?.(...a); });
