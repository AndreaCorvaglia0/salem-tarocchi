// The trials in play (src/trials: the pure engine; ui/trial.js: the screens; data/trials: the trials).
// Services:
//   trial.start(id)          plays a trial; -> { id, errors, outcome } (null if it cannot be played now)
//   trial.witchDraw({ who, card, rev, t })   a witch pulls a card in a scene (story node `witchDraw`)
//   trial.ask({ kind, options, rule?, by? }) one decision with the cards, outside a trial -> { k, ok, face }
//   trial.sense(id)          a witch or Tartufo senses a trial: its study list is suggested in the library
//   library.open()           the library's book (ui/library.js)
// It also: registers the real trials and the first visit to the library in the extras registry (kind
// 'trial'), puts the library's desk and the side trials' starting points in the world (CAST entries and
// tiny scripts added to the story's tables at import), and applies gains and losses through the existing
// systems (coins, xp, tools, cards through the found ceremony, confiscation to the court deposit, bonds).
import { provide, call, has } from '../core/services.js';
import { state, save } from '../core/state.js';
import { fill, test } from '../core/cond.js';
import { addXp, addCoins, addTrait, setFlag, confiscate, todayKey, stat, hintOnce } from '../core/progress.js';
import { emit } from '../core/bus.js';
import { addBond } from '../core/witches.js';
import { EXTRAS, extrasShown } from '../core/extras.js';
import { SCRIPTS, CAST, STEPS, SIDE } from '../data/story/index.js';
import { DEFS } from '../data/world/index.js';
import { TRIALS, LIBRARY_SCRIPTS } from '../data/trials/index.js';
import { askCards, knownPool } from '../trials/ask.js';
import { runTrial, planLoss, gateCards, trialStatus } from '../trials/run.js';
import { askScreen, witchDrawScreen, titleScreen, endScreen, effectLines } from '../ui/trial.js';
import { openLibrary } from '../ui/library.js';

const toast = (t) => { if (t && has('hud.toast')) call('hud.toast', t); };

// ---- the registry, the world, the scripts (at import, before the world starts) ---------------------
const real = Object.values(TRIALS).filter((d) => !d.debug);
for (const d of real) {
  const id = `trial.${d.id}`;
  if (!EXTRAS.some((e) => e.id === id)) EXTRAS.push({ id, kind: 'trial', text: d.note || d.title, at: d.start?.at || null, when: d.when ?? true, done: { trial: d.id }, key: !!d.main, after: d.after });
  if (d.start?.at) {
    SCRIPTS[id] = [{ do: 'call', name: 'trial.start', args: [d.id] }];
    CAST.push({ id, kind: d.start.who ? 'npc' : 'prop', who: d.start.who, at: d.start.at, when: [d.when ?? true, { not: { trial: d.id } }], script: id, label: d.start.label || d.title, verb: d.start.verb || 'Comincia' });
  }
}
// the first visit to the library is a key: it shows while a real trial is open and she has never been there
if (!EXTRAS.some((e) => e.id === 'library.first')) EXTRAS.push({ id: 'library.first', kind: 'trial', key: true, text: 'Devo passare dalla biblioteca, nella casa di ardesia della parte alta del villaggio.', at: 'library.desk', when: { trialPending: true }, done: { flag: 'library.first' } });
Object.assign(SCRIPTS, LIBRARY_SCRIPTS);
// the desk: the introduction once (writer's script `library.first`), then the book
SCRIPTS['library.desk'] = [{ if: { notFlag: 'library.first' }, then: [...(LIBRARY_SCRIPTS['library.first'] || []), { do: 'flag', k: 'library.first' }] }, { do: 'call', name: 'library.open' }];
CAST.push({ id: 'library.desk', kind: 'prop', at: 'library.desk', script: 'library.desk', label: 'I libri', verb: 'Studia' });

// the cards the story's gates ask for: a trial never takes one of them
let gates = null;
const gateSet = () => (gates ||= gateCards(SCRIPTS, CAST, STEPS, SIDE, DEFS));

// ---- effects through the existing systems ---------------------------------------------------------
let examFailed = false;
async function apply(fx = [], why = '') {
  for (const e of fx) {
    if (e.xp) addXp(e.xp, 'trial');
    if (e.coins) addCoins(e.coins);
    if (e.tool) { state.tools[e.tool] = Math.max(0, (state.tools[e.tool] || 0) + (e.n || 1)); save(); }
    if (e.item) setFlag(`item.${e.item}`, true);
    if (e.card && !state.cards[e.card]?.found) await call('card.found', e.card);
    if (e.bond) addBond(e.bond.who, e.bond.n, `trial:${why}`);
    if (e.flag) setFlag(e.flag, true);
    if (e.confiscate) confiscate([e.confiscate]);
    if (e.trait) addTrait(e.trait);
    if (e.exam) { const r = await call('exam.start', { kind: e.exam }); if (r && r.passed === false && e.exam !== 'judge') examFailed = true; }
  }
  if (why.startsWith('room') || why === 'caught') for (const l of effectLines(fx)) toast(l.t);
}

const say = async (lines) => { for (const [who, t] of lines || []) if (t) await call('story.say', who, fill(t)); };
const pool = () => knownPool(state);
async function ask(fork, { who = null, title } = {}, rng = Math.random) {
  const p = pool();
  const d = askCards({ pool: p.ids, rng, kind: fork.kind, options: fork.options, rule: fork.rule, by: fork.by, reversed: p.reversed });
  if (!d) return { k: 0, ok: true, face: null };
  stat('draws');
  return askScreen(d, { who, title });
}

// ---- the trial ------------------------------------------------------------------------------------
let running = false;
export async function startTrial(id, { rng = Math.random } = {}) {
  const def = TRIALS[id];
  if (!def || running) return null;
  const st = trialStatus(def, state, todayKey());
  if (st !== 'open' && !def.debug) { toast(st === 'wait' ? 'Per oggi basta: potrai riprovare domani.' : 'Questa prova l\'hai già affrontata.'); return null; }
  running = true; examFailed = false;
  try {
    await titleScreen(def);
    const res = await runTrial(def, {
      say,
      witchDraw: (w) => witchDrawScreen(w),
      ask: (fork, step) => { setTimeout(() => hintOnce('trial'), 900); return ask(fork, { who: step.who && step.who !== 'narra' ? step.who : def.with }, rng); },
      judge: () => ({ ok: true }),
      room: (r) => say(r.lines),
      escape: (spec) => (has('world.escape') ? (setTimeout(() => hintOnce('escape'), 300), call('world.escape', spec)) : 'safe'),
      choose: (texts) => call('story.choose', texts.map((t) => ({ t: fill(t) }))),
      apply,
      plan: { loss: (loss) => planLoss(loss, state, def, { rng, gates: gateSet() }) },
      end: async ({ outcome, errors, effects }) => {
        await apply(effects, 'end');
        state.trials[def.id] = { result: outcome, errors, day: todayKey(), at: Date.now() };
        setFlag(`trial.${def.id}.${outcome}`, true);
        if (state.trialSense === def.id) state.trialSense = null;
        save();
        await endScreen({ def, outcome, errors, effects });
      },
    });
    if (examFailed) await call('world.travel', 'depths.jail');
    return { id: res.id, errors: res.errors, outcome: res.outcome };
  } finally { running = false; }
}

// ---- the library ----------------------------------------------------------------------------------
// the suggested topics: the sensed trial's study list (if it is still to do), else the first open real trial's
export function suggested(s = state) {
  const d = (s.trialSense && TRIALS[s.trialSense]) || real.find((x) => trialStatus(x, s, todayKey()) === 'open' && test(x.when, s));
  return d && trialStatus(d, s, todayKey()) !== 'done' ? { trial: d, topics: d.study || [] } : { trial: null, topics: [] };
}

provide('trial.start', (id, o) => startTrial(id, o));
provide('trial.witchDraw', (n = {}) => witchDrawScreen({ who: n.who, card: n.card, rev: !!n.rev, t: fill(n.t || '') }));
provide('trial.ask', (fork = {}) => ask(fork, { who: fork.who }));
provide('trial.sense', (id) => { if (TRIALS[id]) { state.trialSense = id; save(); toast('In biblioteca puoi ripassare quello che servirà.'); } return Promise.resolve(); });
provide('library.open', () => { const sg = suggested(); if (sg.trial && sg.topics.length) setTimeout(() => hintOnce('library'), 700); return openLibrary(sg); });

// ---- news: a trial that has just come onto her list is said once, outside the fiction ---------------
// (interface line `news`, shown when the world is free: ui/hint.js). One at a time, never during a trial.
export const trialNews = (s = state, list = extrasShown(s)) => list.find((e) => e.kind === 'trial' && e.id.startsWith('trial.') && e.status === 'new' && !s.world?.once?.[`news.${e.id}`]) || null;
let newsAt = 0;
setInterval(() => {
  if (running || !state.started || state.chapter < 1 || Date.now() < newsAt) return;
  const e = trialNews();
  if (!e) return;
  (state.world.once || (state.world.once = {}))[`news.${e.id}`] = true; save();
  newsAt = Date.now() + 30000;
  emit('hint', { id: 'news' });
}, 6000)?.unref?.();
