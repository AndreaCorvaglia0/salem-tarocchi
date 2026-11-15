// A visit of the Reader (story.visit): a short scene on the shadow-theatre stage. The reader tableau,
// the new cards face down on the table; she opens with an observation, turns them one at a time and
// tells them (from the detail she chose, to what the card says, to her own three words), asks one
// question that moves a trait, and closes. Composition: visit.plan.js. Captions: tableui.js.
// Order: opener, thread, the cards (detail, tell, words, the one question), ritual, closer; each of
// the four remarks may carry `then` nodes, run with the session runner.
//   playVisit({ force }) -> boolean (played)
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { emit } from '../core/bus.js';
import { state, save } from '../core/state.js';
import { call } from '../core/services.js';
import { test, fill } from '../core/cond.js';
import { foundIds, tellCard, addTrait, addXp, snapshot } from '../core/progress.js';
import * as V from '../data/story/visits.js';
import { sheet } from '../data/cards.js';
import { createStage } from './stage/index.js';
import { tableUi, TABLE_CSS } from './tableui.js';
import { planVisit } from './visit.plan.js';
import { createRunner } from './runner.js';
import { SCRIPTS, SESSIONS } from '../data/story/index.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let playing = false;

export async function playVisit({ force = false } = {}) {
  if (playing) return false;
  const plan = planVisit({ state, talk: V.TALK || {}, openers: V.OPENERS || [], thread: V.THREAD || [], rituals: V.RITUALS || [], closers: V.CLOSERS || [], test, sheetOf: (id) => { try { return sheet(id); } catch { return {}; } }, force });
  if (!plan) return false;
  playing = true;
  css('story-table', TABLE_CSS);
  const reduced = reducedMotion();
  const stage = h('div.ss-stage'), ui = h('div.ss-ui');
  const root = h('div.ss', { role: 'dialog', 'aria-label': 'La Lettrice' }, stage, ui);
  const close = openOverlay(root);
  emit('cinema', true);
  requestAnimationFrame(() => root.classList.add('on'));
  call('sound.hold', 'session'); call('sound.mood', 'session');
  const level = Math.max(0, Math.min(3, state.chapter | 0));
  // the cards she has not told yet are not pinned on the wall: they are on the table
  const scene = createStage(stage, { session: level, found: foundIds().filter((id) => !plan.cards.some((c) => c.id === id)), tableau: 'reader' });
  stage.append(ui);
  setTimeout(() => root.classList.add('shown'), reduced ? 0 : 750);
  const T = tableUi({ root, ui, scene, reduced });
  const say = (t, o) => (t ? T.say('lettrice', fill(t), o) : Promise.resolve());
  // `then` nodes of a remark: flags, a verdict, one more line or a choice, with the session runner
  const ext = async (node, api) => {
    if (node.observe) { const hit = node.observe.find((o) => o && test(o.when)); if (hit) await T.say('lettrice', api.F(hit.t)); return true; }
    return false;
  };
  const runner = createRunner({ ui: { say: T.say, choose: T.choose, cinema: async (ls) => { for (const l of ls) await T.say('narra', l); }, moment: T.moment, sleep }, call, ext, getScript: (sid) => SESSIONS[sid] || SCRIPTS[sid] });
  const remark = async (e) => {
    if (!e) return;
    if (e.t) await say(e.t, e.then && 'choice' in (e.then[0] || {}) ? { ask: true } : undefined);
    if (e.then) await runner.run(e.then);
  };
  try {
    await sleep(reduced ? 0 : 2600); // the room first
    await remark(plan.opener);
    await remark(plan.thread);
    for (const c of plan.cards) { scene.table.show(c.id); await sleep(reduced ? 0 : 320); }
    await sleep(reduced ? 0 : 900);
    for (let i = 0; i < plan.cards.length; i++) {
      const c = plan.cards[i];
      scene.table.highlight(i);
      call('sound.play', 'card');
      await scene.table.turn(i);
      await say(c.detail); // from what struck her
      await say(c.tell); // to what the card says
      await say(c.words); // and her own three words
      if (c.ask) {
        await say(c.ask.q, { ask: true });
        const k = await T.choose(c.ask.a.map((o) => fill(o.t)));
        const o = c.ask.a[k] || c.ask.a[0];
        if (o.trait) addTrait(o.trait);
        await say(o.re);
      }
      tellCard(c.id);
    }
    scene.table.highlight(null);
    await remark(plan.ritual);
    await remark(plan.closer);
    state.visits = (state.visits || 0) + 1; save();
    addXp(10, 'visit');
    emit('visit', { ids: plan.cards.map((c) => c.id) });
  } catch (e) { console.error('[visit]', e); } finally {
    for (const c of plan.cards) if (!state.told[c.id]) tellCard(c.id); // an error mid-way still counts them told
    snapshot();
    T.dispose();
    root.classList.remove('shown');
    await sleep(reduced ? 0 : 900);
    root.classList.remove('on');
    await sleep(reduced ? 0 : 700);
    scene.dispose(); close(); emit('cinema', false);
    call('sound.hold', null); call('sound.back');
    playing = false;
  }
  return true;
}
