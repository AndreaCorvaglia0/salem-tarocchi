// ALTROVE (docs/DESIGN.md "Altrove: i piccoli mondi fuori da Salem"): with a witch's device she leaves Salem
// for a short mission in a small, mad world with its own look and its own rule, played as a trial.
// Services:
//   elsewhere.go(id)        the passage (a colour and a shape that fit the device), then the visit; it returns
//                           at once (true if it started): the visit goes on by itself while she walks
//   elsewhere.leave(result) ends a visit early ('fail' records a fail; nothing: no record) and brings her back
//   elsewhere.status(id)    'open' | 'wait' (failed today) | 'done'
// While she is away: the HUD is one line («Altrove · <name>», on the clouds also the falls), no patrols, no
// Minors, no broom, no grimoire (all in the world: the maps have none, and src/world/index.js says no), and
// Tartufo comes or not per world (map `cat`). The trial runs on the trials' engine (src/trials/run.js); this
// file is its io: forks ask the cards and change the world (a bridge, a written line), rooms with `at` wait
// for her to walk there. At the end the passage takes her back exactly where she was, with what she won or lost.
// State: state.world.elsewhere = { in, from, results: { id: { result, errors, falls, day, at } } } (made on
// first use; old saves have none). A visit cut by a closed page: on reload she is back where she left
// (here, at import, before the world starts), nothing is recorded, and she can go again.
// Registry: each world is an entry (kind 'trial') chained with `after`; a small trigger in Salem (a CAST prop
// with a placeholder script, and its little picture in the world) starts it.
import { provide, call, has } from '../core/services.js';
import { state, save } from '../core/state.js';
import { on } from '../core/bus.js';
import { fill } from '../core/cond.js';
import { addXp, addCoins, setFlag, confiscate, todayKey, stat } from '../core/progress.js';
import { h, css, openOverlay } from '../core/dom.js';
import { SCRIPTS, CAST, STEPS, SIDE } from '../data/story/index.js';
import { DEFS } from '../data/world/index.js';
import { WORLDS, WORLD_LIST } from '../data/elsewhere/index.js';
import { runTrial, planLoss, gateCards } from '../trials/run.js';
import { askCards, knownPool } from '../trials/ask.js';
import { askScreen, endScreen } from '../ui/trial.js';
// the state, the restore after a reload, the registry and the triggers: pure, in elsewhere.rules.js
import { mem, restore, status, doneFlag } from './elsewhere.rules.js';

const toast = (t) => { if (t && has('hud.toast')) call('hud.toast', t); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (restore()) save(); // a visit cut by a closed page

const trinkets = () => WORLD_LIST.map((W) => ({ id: `elsewhere.${W.id}`, at: W.trigger.at, art: W.trigger.art, dx: W.trigger.dx, dy: W.trigger.dy }));
if (has('world.elsewhere')) call('world.elsewhere', 'trinkets', trinkets());

// ---- effects through the existing systems (as glue/trials.js) ---------------------------------------
let gates = null;
const gateSet = () => (gates ||= gateCards(SCRIPTS, CAST, STEPS, SIDE, DEFS));
async function apply(fx = [], why = '') {
  for (const e of fx) {
    if (e.xp) addXp(e.xp, 'elsewhere');
    if (e.coins) addCoins(e.coins);
    if (e.tool) { state.tools[e.tool] = Math.max(0, (state.tools[e.tool] || 0) + (e.n || 1)); save(); }
    if (e.item) setFlag(`item.${e.item}`, true);
    if (e.card && !state.cards[e.card]?.found) await call('card.found', e.card);
    if (e.flag) setFlag(e.flag, true);
    if (e.confiscate) confiscate([e.confiscate]);
  }
  if (why.startsWith('room')) for (const e of fx) if (e.coins < 0) toast(`${e.coins} monete`);
}
const say = async (lines) => { for (const [who, t] of lines || []) if (t) await call('story.say', who, fill(t)); };
async function ask(fork, who) {
  const p = knownPool(state);
  const d = askCards({ pool: p.ids, kind: fork.kind, options: fork.options, rule: fork.rule, by: fork.by, reversed: p.reversed });
  if (!d) return { k: 0, ok: true, face: null };
  stat('draws');
  return askScreen(d, { who: who && who !== 'narra' && who !== 'tu' ? who : null });
}

// ---- the passage -------------------------------------------------------------------------------------
const CSS = `
.alt-pass{position:fixed;inset:0;z-index:95;overflow:hidden;pointer-events:auto;perspective:900px}
.alt-pass.potion{background:radial-gradient(circle at 50% 55%,#c8ffd8 0,#3fbf6a 35%,#0e3a22 80%);opacity:0;transition:opacity .5s}
.alt-pass.potion.on{opacity:1}
.alt-pass.potion .sw{position:absolute;left:50%;top:50%;width:160vmax;height:160vmax;margin:-80vmax 0 0 -80vmax;border-radius:50%;
  background:conic-gradient(from 0deg,#0e3a22,#3fbf6a,#b8f5c8,#3fbf6a,#0e3a22,#3fbf6a,#b8f5c8,#0e3a22);transform:scale(.05) rotate(0);transition:transform 1s ease-in}
.alt-pass.potion.on .sw{transform:scale(1) rotate(540deg)}
.alt-pass.potion .wh{position:absolute;inset:0;background:radial-gradient(circle,#fff 0,#f7cfdc 70%);opacity:0;transition:opacity .45s .7s}
.alt-pass.potion.on .wh{opacity:1}
.alt-pass.pages{background:#2a2030cc;opacity:0;transition:opacity .3s}
.alt-pass.pages.on{opacity:1}
.alt-pass.pages .pg{position:absolute;inset:6vh 4vw;background:linear-gradient(90deg,#d9c79f,#f6edd4 12%,#efe3c3);border-radius:2px 8px 8px 2px;
  box-shadow:0 6px 30px #000a;transform-origin:left center;transform:rotateY(-110deg);transition:transform .55s cubic-bezier(.4,.1,.3,1)}
.alt-pass.pages .pg::after{content:'';position:absolute;left:12%;right:10%;top:12%;bottom:12%;background:repeating-linear-gradient(#0000 0 22px,#b8c2d877 22px 23px)}
.alt-pass.pages.on .pg{transform:rotateY(0)}
.alt-pass.pages .pg:nth-child(2){transition-delay:.18s}.alt-pass.pages .pg:nth-child(3){transition-delay:.36s;inset:0}
.alt-pass.nightmare{background:#06040a;opacity:0;transition:opacity .9s,transform 1.1s;transform:rotate(0) scale(1.2)}
.alt-pass.nightmare.on{opacity:1;transform:rotate(-7deg) scale(1.4)}
.alt-pass.out{opacity:0!important;transition:opacity .6s}
.salem-away .hud{display:none!important}
.alt-band{position:fixed;left:50%;top:calc(8px + env(safe-area-inset-top));transform:translateX(-50%);z-index:21;display:flex;gap:10px;align-items:center;
  padding:5px 14px;border-radius:14px;background:#1c1626cc;color:#f3e8cc;font:17px/1.2 Georgia,serif;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 10px #0007}
body:has(.tr) .alt-band{visibility:hidden} /* the line steps aside for the cards' screens */
.alt-band b{font-weight:400;color:#e2b64a}
.alt-band .falls{display:flex;gap:4px}.alt-band .falls i{width:10px;height:10px;border-radius:50%;border:1.5px solid #f3e8cc}.alt-band .falls i.on{background:#d0605a;border-color:#d0605a}
`;
const PASS_MS = { potion: 1250, pages: 1050, nightmare: 1200 };
// -> { covered: Promise, uncover(): Promise }
function passage(device = 'potion') {
  css('glue-elsewhere', CSS);
  const kids = device === 'potion' ? [h('div.sw'), h('div.wh')] : device === 'pages' ? [h('div.pg'), h('div.pg'), h('div.pg')] : [];
  const el = h(`div.alt-pass.${device}`, ...kids);
  const close = openOverlay(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on')));
  return {
    covered: sleep(PASS_MS[device] || 1100),
    uncover: async () => { el.classList.add('out'); await sleep(650); close(); el.remove(); },
  };
}
let band = null;
function showBand(W) {
  css('glue-elsewhere', CSS);
  document.body.classList.add('salem-away');
  const falls = W.maxFalls ? h('span.falls', ...Array.from({ length: W.maxFalls }, () => h('i'))) : null;
  band = h('div.alt-band', h('span', h('b', 'Altrove'), ` · ${W.title}`), falls);
  document.body.append(band);
}
function hideBand() { document.body.classList.remove('salem-away'); band?.remove(); band = null; }
on('elsewhere:fall', ({ n } = {}) => {
  band?.querySelectorAll('.falls i').forEach((d, i) => d.classList.toggle('on', i < n));
  if (n === 1) toast('Le nuvole sottili luccicano appena: guarda bene prima di passare.');
});

// ---- the visit ---------------------------------------------------------------------------------------
let running = null; // { W, leave: result | undefined }
const world = (cmd, arg) => call('world.elsewhere', cmd, arg);

// the world's side of a fork: a bridge opens (clouds) or a word is written and its line drawn (page)
async function change(W, step, r, ctx) {
  if (step.bridge != null) { await world('open', { map: W.map, fork: step.bridge, option: r.k, ok: r.ok }); return; }
  if (!step.at) return;
  const word = step.fork.options?.[r.k]?.text || '';
  const mapOf = (ref) => ref.split('.')[0];
  await world('write', { map: mapOf(step.at), fork: step.at, word, to: r.ok ? step.next : step.blot });
  if (!r.ok) ctx.pending = { map: mapOf(step.at), from: step.blot, to: step.next };
}

async function visit(W, veil) {
  const def = W, ctx = { wrong: 0, pending: null, result: null };
  const where = has('world.where') ? await call('world.where') : null;
  const m = mem();
  m.in = W.id; m.from = where ? { map: where.map, x: where.x, y: where.y } : state.pos; save();
  await veil.covered;
  const texts = Object.fromEntries(def.steps.filter((s) => s.fork && s.at && s.sentence).map((s) => [s.at, fill(s.sentence)]));
  await world('begin', { world: W.id, maxFalls: W.maxFalls || 0, texts });
  showBand(W);
  await call('world.travel', W.start);
  await sleep(400);
  await veil.uncover();
  let aborted = null;
  const io = {
    say,
    witchDraw: (w) => call('trial.witchDraw', w),
    judge: () => ({ ok: true }),
    ask: async (fork, step) => {
      const r = await ask(fork, step.who);
      if (!r.ok) ctx.wrong += 1;
      await change(W, step, r, ctx);
      return r;
    },
    room: async (r) => {
      const p = ctx.pending;
      if (p && r.at !== p.from) { ctx.pending = null; await world('write', { map: p.map, from: p.from, to: p.to }); }
      if (r.at) { toastOnce(W); await world('wait', r.at); }
      await say(r.lines);
    },
    escape: async () => 'safe',
    choose: (texts) => call('story.choose', texts.map((t) => ({ t: fill(t) }))),
    apply,
    plan: { loss: (loss) => planLoss(loss, state, def, { gates: gateSet() }) },
    end: async ({ outcome, errors, effects }) => { ctx.result = { outcome, errors, effects }; await apply(effects, 'end'); },
  };
  try { await runTrial(def, io); } catch (e) { if (e && e.abort) aborted = e.abort; else throw e; }
  const falls = await world('falls');
  if (aborted === 'falls' || (aborted === 'left' && running?.leave === 'fail')) {
    // three falls (or a visit ended as a fail): she wakes up in Salem with nothing, and a small loss
    const out = def.outcomes?.fail || {};
    if (aborted === 'falls') { await sleep(500); await say(out.lines); }
    const effects = planLoss(out.loss || {}, state, def, { gates: gateSet() });
    await apply(effects, 'end');
    ctx.result = { outcome: 'fail', errors: ctx.wrong, effects };
  }
  const res = ctx.result;
  if (res) {
    m.results = m.results || {};
    m.results[W.id] = { result: res.outcome, errors: res.errors, falls, day: todayKey(), at: Date.now() };
    setFlag(`elsewhere.${W.id}.${res.outcome}`, true);
    if (res.outcome !== 'fail') setFlag(doneFlag(W.id), true);
  }
  await leave(W);
  if (res) await endScreen({ def: { ...def, title: `Altrove · ${def.title}` }, outcome: res.outcome, errors: res.errors, effects: res.effects.map((e) => (e.item && W.item?.id === e.item ? { ...e, item: W.item.name } : e)) });
  return res;
}
const hinted = new Set();
function toastOnce(W) { if (!hinted.has(W.id) && W.hint) { hinted.add(W.id); toast(W.hint); } }

// back to Salem, exactly where she was
async function leave(W) {
  const m = mem(), from = m.from;
  const veil = passage(W.device);
  await veil.covered;
  await world('end');
  hideBand();
  m.in = null; m.from = null; save();
  if (from) await call('world.travel', from);
  await sleep(400);
  await veil.uncover();
  if (has('sound.back')) call('sound.back');
}

export function go(id) {
  const W = WORLDS[id];
  if (!W || running) return Promise.resolve(false);
  const debug = typeof location !== 'undefined' && /[?&]debug/.test(location.search);
  const st = status(id);
  if (st !== 'open' && !debug) { toast(st === 'wait' ? 'Per oggi basta: potrai riprovare domani.' : 'Ci sei già stata.'); return Promise.resolve(false); }
  running = { W };
  const veil = passage(W.device); // at once, so the world stops while the passage starts
  visit(W, veil).catch((e) => console.error('[elsewhere]', e)).finally(() => { running = null; hideBand(); });
  return Promise.resolve(true);
}
export function leaveNow(result) {
  if (!running) return Promise.resolve(false);
  running.leave = result;
  return world('end').then(() => true);
}

provide('elsewhere.go', (id) => go(id));
provide('elsewhere.leave', (result) => leaveNow(result));
provide('elsewhere.status', (id) => Promise.resolve(status(id)));
