// The automatic player of scripts/coverage.mjs: the whole story with random answers, through the real
// runner (src/story/runner.js), as tests/story.paths.test.mjs plays it, plus what that test leaves out:
// the sessions with the Reader, her visits, the optional scenes of the CAST along the way, and a rough
// stand-in for the systems (exams on the road, readings, words on the cards) so that the lines gated on
// them are not all zero. Every branch of the data is marked, so a run returns which ones it showed.
//   const P = createPlayer(model);       model: scripts/lore/story.mjs loadStory()
//   const r = await P.play(seed, { rich });   -> { shown: Set(branch ids), scenes: Set, end: { traits, ... }, warnings }
import { setState, state } from '../../src/core/state.js';
import { findCard, setPlayer, addXp, addTrait, snapshot, tellCard, yourCard, yourSuit, stat } from '../../src/core/progress.js';
import { test as cond } from '../../src/core/cond.js';
import { MAJORS, CARD } from '../../src/data/cards.base.js';
import { createRunner, cardOfNumber } from '../../src/story/runner.js';
import { planVisit } from '../../src/story/visit.plan.js';

export const rng = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };
const MARK = '__cov', CHOICE = '__choice';
// a CAST entry that waits for the end of the story: { chapterMin: 4 } among its conditions
const atoms4 = (w) => JSON.stringify(w || {}).includes('"chapterMin":4');

// A copy of every script with a marker at the start of every branch. Ids are the ones of model.branches.
export function instrument(M) {
  const idOf = new Map(); // original object -> { then, else } | option id | observe id
  for (const b of M.branches) {
    if (b.kind === 'if-then') idOf.set(b.node, { ...(idOf.get(b.node) || {}), then: b.id });
    else if (b.kind === 'if-else') idOf.set(b.node, { ...(idOf.get(b.node) || {}), else: b.id });
    else idOf.set(b.node, b.id);
  }
  const mark = (id) => ({ do: 'call', name: MARK, args: [id] });
  const clone = (nodes) => (Array.isArray(nodes) ? nodes.map(one) : nodes);
  function one(n) {
    if (!n || typeof n !== 'object') return n;
    if ('if' in n) {
      const ids = idOf.get(n) || {};
      return { if: n.if, then: [...(ids.then ? [mark(ids.then)] : []), ...clone(n.then || [])], ...(n.else ? { else: [...(ids.else ? [mark(ids.else)] : []), ...clone(n.else)] } : {}) };
    }
    if ('choice' in n && Array.isArray(n.choice)) {
      const opts = n.choice.map((o) => (o ? { ...o, then: [mark(idOf.get(o) || '?'), ...clone(o.then || [])], __id: idOf.get(o) } : o));
      return { __wrap: true, nodes: [{ do: 'call', name: CHOICE, args: [opts] }, { choice: opts }] };
    }
    if (Array.isArray(n.observe)) return { observe: n.observe.map((e) => (e ? { ...e, then: clone(e.then), __id: idOf.get(e) } : e)) };
    if (n.pick) return { ...n, then: clone(n.then) };
    return n;
  }
  // a choice becomes two nodes: flatten the wrappers
  const flat = (nodes) => (Array.isArray(nodes) ? nodes.flatMap((n) => (n && n.__wrap ? n.nodes.map(deep) : [deep(n)])) : nodes);
  function deep(n) {
    if (!n || typeof n !== 'object') return n;
    if ('if' in n) return { ...n, then: flat(n.then), ...(n.else ? { else: flat(n.else) } : {}) };
    if ('choice' in n) return { ...n, choice: n.choice.map((o) => (o ? { ...o, then: flat(o.then) } : o)) };
    if (n.observe) return { observe: n.observe.map((e) => (e ? { ...e, then: flat(e.then) } : e)) };
    if (n.pick) return { ...n, then: flat(n.then) };
    if (n.do === 'call' && n.name === CHOICE) return n;
    return n;
  }
  const scripts = {}, sessions = {};
  for (const s of M.scenes) {
    const nodes = [mark(`scene:${s.file}#${s.id}`), ...flat(clone(s.nodes))];
    if (s.kind === 'session') sessions[s.id] = nodes;
    else if (s.kind === 'script') scripts[s.id] = { nodes, key: `${s.file}#${s.id}` };
  }
  // the scripts the game knows by id (SCRIPTS) come first: same ids, same content
  return { scripts, sessions };
}

export function createPlayer(M) {
  const I = instrument(M);
  const V = M.visits;
  const STEPS = M.STEPS, CAST = M.CAST;
  const getScript = (id) => I.scripts[id]?.nodes || null;

  // the clock is part of the state (when a card was found orders the visits): a fixed, ticking clock per run
  async function play(seed, opts = {}) {
    const realNow = Date.now;
    let t = 1.7e12;
    Date.now = () => (t += 1000);
    try { return await playRun(seed, opts); } finally { Date.now = realNow; }
  }

  async function playRun(seed, { rich = false } = {}) {
    const rand = rng(seed);
    const pick = (n) => Math.floor(rand() * n);
    const shown = new Set(), scenes = new Set(), warnings = [];
    setState({});
    const birth = { d: 1 + pick(28), m: 1 + pick(12), ...(rand() < 0.7 ? { y: 1980 + pick(30) } : {}) };
    setPlayer({ name: 'Viola', birth });
    findCard('m00', { silent: true });
    state.step = 'p.road';
    if (rich) { state.pop = 40; state.tartufo = 40; for (const w of Object.keys(state.trust)) state.trust[w] = 2; state.flags['lesson.fly'] = true; }
    let current = null; // the options of the choice about to be asked
    const exam = () => { stat('exams'); const ok = rand() < 0.6; stat(ok ? 'examsPassed' : 'examsFailed'); if (!ok) stat('jailed'); return ok; };
    const visit = async () => {
      const plan = planVisit({ state, talk: V.TALK, openers: V.OPENERS, thread: V.THREAD, rituals: V.RITUALS, closers: V.CLOSERS, test: cond, force: false });
      if (!plan) return null;
      for (const [list, key] of [['OPENERS', 'openers'], ['THREAD', 'thread'], ['RITUALS', 'rituals'], ['CLOSERS', 'closers']]) {
        const e = V[list].find((x) => x && cond(x.when));
        if (!e) continue;
        const b = M.branches.find((x) => x.file === 'visits.js' && x.scene === key && x.node === e);
        scenes.add(`visits.js#${key}`);
        if (b) shown.add(b.id);
        if (e.then) await runner.exec(e.then);
      }
      for (const c of plan.cards) {
        tellCard(c.id);
        if (c.ask) {
          scenes.add(`visits.js#talk.${c.id}`);
          c.ask.a.forEach((_, k) => shown.add(`visits.js#talk.${c.id}#c1.${k}:shown`));
          const k = pick(c.ask.a.length);
          shown.add(`visits.js#talk.${c.id}#c1.${k}`);
          if (c.ask.a[k].trait) addTrait(c.ask.a[k].trait);
        }
      }
      addXp(10, 'visit');
      snapshot();
      return null;
    };
    const ext = async (n, api) => {
      if (n.ask) return true;
      if (n.turn) { findCard(n.turn, { silent: true }); tellCard(n.turn); return true; }
      if (n.pick === 'number') { const cid = cardOfNumber(1 + pick(22)); api.vars.picked = CARD[cid]?.name || cid; await api.exec(n.then); return true; }
      if (n.observe) { const hit = n.observe.find((o) => o && cond(o.when)); if (hit) { if (hit.__id) shown.add(hit.__id); if (hit.then) await api.exec(hit.then); } return true; }
      if (n.symbol || n.tableau || n.portrait || n.shuffle) return true;
      return false;
    };
    const call = async (name, arg) => {
      if (name === MARK) { if (arg.startsWith('scene:')) scenes.add(arg.slice(6)); else shown.add(arg); return null; }
      if (name === CHOICE) { current = arg.filter((o) => o && cond(o.when)); for (const o of current) if (o.__id) shown.add(`${o.__id}:shown`); return null; }
      if (name === 'card.found') findCard(arg, { silent: true });
      if (name === 'draw.pick') return arg.pool.find((c) => !state.cards[c]?.found) || arg.pool[0];
      if (name === 'exam.start') return { passed: exam() };
      if (name === 'reading.open') stat('readings');
      if (name === 'story.session') { await runner.exec(I.sessions[arg]); snapshot(); return null; }
      if (name === 'story.visit') return visit();
      return null;
    };
    const ui = { say() {}, cinema() {}, moment() {}, sleep() {}, end() {}, choose: (texts) => pick(texts.length) };
    const runner = createRunner({ ui, call, getScript, ext, warn: (...a) => warnings.push(a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ')) });
    const runScene = async (id) => { await runner.run(id); };
    const once = new Set();
    // the prologue session, as the game opens with it
    await runner.exec(I.sessions.s0); snapshot();
    for (let guard = 0; guard < 300 && state.step !== 'post.minors'; guard++) {
      const before = state.step;
      if (rich) for (const p of ['fire', 'sense', 'move', 'stun', 'broom']) state.powers[p] = true;
      const at = STEPS.find((s) => s.id === before).at;
      // wandering: the optional scenes standing somewhere now, each with some chance
      for (const c of CAST) {
        if (c.at === at || !I.scripts[c.script] || c.script.startsWith('client.') || (c.once && once.has(c.id))) continue;
        if (!cond(c.when) || rand() > 0.3) continue;
        if (c.once) once.add(c.id);
        await runScene(c.script);
        if (state.step !== before) break;
      }
      if (state.step !== before) continue;
      if (rand() < 0.25) exam(); // a patrol on the road
      const entry = CAST.find((c) => c.at === at && cond(c.when));
      if (!entry) { warnings.push(`no cast entry for ${before}`); break; }
      if (entry.script.startsWith('client.')) {
        await runner.run([{ do: 'step', id: { 'c1.client': 'c1.cart', 'c2.client': 'c2.fire', 'c3.client': 'c3.coven' }[before] }]);
      } else await runScene(entry.script);
      if (state.step === before) {
        const next = MAJORS.find((c) => c.spot && !state.cards[c.id]?.found && c.row <= state.chapter && c.id !== 'm07');
        if (next) { findCard(next.id, { silent: true }); if (rand() < 0.3) state.cards[next.id].words = ['uno', 'due', 'tre']; } else addXp(40, 'study');
      }
    }
    // after the end: what waits by the campfire and at the table
    if (state.flags['ending.seen']) for (const c of CAST) if (I.scripts[c.script] && !c.script.startsWith('client.') && c.at !== STEPS.find((x) => x.id === 'post.minors').at && atoms4(c.when) && cond(c.when) && !(c.once && once.has(c.id))) { if (c.once) once.add(c.id); await runScene(c.script); }
    return {
      shown, scenes, warnings, ended: !!state.flags['ending.seen'],
      end: { traits: { ...state.traits }, trust: { ...state.trust }, card: yourCard(), suit: yourSuit(), flags: { ...state.flags } },
    };
  }
  return { play, instrumented: I };
}
