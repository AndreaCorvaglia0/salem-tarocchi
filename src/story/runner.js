// The script runner: interprets an array of story nodes (docs/CONTRACT.md, "Data: story").
// Pure logic: the UI it talks to is injected (say, choose, cinema, moment, sleep), so it runs in Node
// with fakes (tests/story-runner.*.test.mjs). A script never throws to the caller: unknown or broken
// nodes warn and the script goes on. Runs are queued: one at a time.
//
//   const r = createRunner({ ui, call, getScript, ext });
//   await r.run('c1.malva');            // by id (getScript) or an array of nodes
//   ui = { say(who, text), choose(texts) -> index, cinema(lines, node), moment(text), sleep(ms), end() }
//   ext(node, api) -> true when it handled a node the runner does not know (the sessions' ask/turn/pick).
import { state, save } from '../core/state.js';
import { test, fill } from '../core/cond.js';
import * as P from '../core/progress.js';
import * as SPREAD_DATA from '../data/spreads.js';
import * as LESSON_DATA from '../data/lessons.js';

const pad = (n) => String(n).padStart(2, '0');
// The card with the number n among the Majors, 22 -> the Fool.
export const cardOfNumber = (n) => `m${pad(Number(n) >= 22 ? 0 : Math.max(0, Number(n) || 0))}`;

export function createRunner({ ui, call, getScript = () => null, ext = null, warn = (...a) => console.warn('[story]', ...a), maxHops = 40 }) {
  const vars = {}; // extra {tokens} for the current run, e.g. {picked}
  let pending = 0;
  let tail = Promise.resolve();

  const F = (t) => {
    let s = String(t ?? '');
    for (const k of Object.keys(vars)) s = s.split(`{${k}}`).join(String(vars[k]));
    return fill(s);
  };

  const askSafe = async (fn, fallback) => { try { return await fn(); } catch (e) { warn('ui failed:', e?.message || e); return fallback; } };

  async function exec(nodes) {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      try {
        const r = await step(node);
        if (r && r.goto) return r;
      } catch (e) { warn('node failed:', e?.message || e, node); }
    }
    return null;
  }

  async function step(node) {
    if (node == null || typeof node !== 'object') { warn('bad node', node); return null; }
    if ('say' in node) { await askSafe(() => ui.say(node.say, F(node.t))); return null; }
    if ('choice' in node) return choice(node);
    if ('if' in node) return exec(test(node.if) ? node.then : node.else);
    if ('do' in node) return action(node);
    if (ext) { const handled = await ext(node, api); if (handled) return handled === true ? null : handled; }
    warn('unknown node', node);
    return null;
  }

  async function choice(node) {
    const opts = (Array.isArray(node.choice) ? node.choice : []).filter((o) => o && test(o.when));
    if (!opts.length) { warn('choice with no options', node); return null; }
    let i = await askSafe(() => ui.choose(opts.map((o) => F(o.t))), 0);
    if (!Number.isInteger(i) || i < 0 || i >= opts.length) i = 0;
    const o = opts[i];
    if (o.tag) P.addPoint(o.tag);
    if (o.trust) for (const [who, n] of Object.entries(o.trust)) P.addTrust(who, n);
    if (o.flag) P.setFlag(o.flag, true); // only options that name a flag are remembered
    return exec(o.then);
  }

  const drawWeights = (pool) => {
    const w = {};
    const yours = P.yourCard(), birth = state.player.birthCard;
    for (const id of pool) w[id] = 1 + (id === yours ? 3 : 0) + (id === birth ? 3 : 0);
    return w;
  };
  const foundCeremony = async (id) => { if (id && !state.cards[id]?.found) await call('card.found', id); };

  const ACTIONS = {
    xp: (n) => P.addXp(n.n, n.why || ''),
    coins: (n) => P.addCoins(n.n),
    flag: (n) => P.setFlag(n.k, n.v === undefined ? true : n.v),
    trust: (n) => P.addTrust(n.who, n.n),
    point: (n) => P.addPoint({ card: n.card, suit: n.suit, n: n.n }),
    word: (n) => { state.words[n.k] = n.v; save(); },
    diary: (n) => P.writeDiary(F(n.t)),
    step: (n) => P.setStep(n.id),
    chapter: (n) => P.setChapter(n.n),
    power: (n) => { state.powers[n.id] = true; save(); },
    tool: (n) => { state.tools[n.id] = (state.tools[n.id] || 0) + (n.n ?? 1); save(); },
    giveCard: (n) => foundCeremony(n.id),
    draw: async (n) => {
      const pool = n.pool === 'row' || n.pool == null ? P.majorsMissingOfRow(state.chapter) : n.pool;
      if (!pool.length) { warn('draw: empty pool', n); return; }
      const id = await call('draw.pick', { mode: n.mode || 'fan', pool, weights: n.weights || drawWeights(pool), title: n.title });
      if (n.give && id) await foundCeremony(id);
    },
    teach: async (n) => {
      state.spreads[n.spread] = true; save();
      await askSafe(() => ui.moment(`Hai imparato: ${SPREAD_DATA.SPREADS?.[n.spread]?.name || n.spread}`));
    },
    lesson: async (n) => {
      state.lessons[n.id] = true; save();
      const l = (LESSON_DATA.LESSONS || []).find((x) => x.id === n.id);
      await askSafe(() => ui.moment(`Hai imparato: ${l?.title || n.id}`));
    },
    reading: (n) => call('reading.open', { spread: n.spread, client: n.client, cards: n.cards, script: n.script }),
    exam: async (n) => {
      const res = await call('exam.start', { kind: n.kind, place: n.place });
      P.setFlag('exam.passed', !!res?.passed); // the next node can test { flag: 'exam.passed' }
    },
    session: (n) => call('story.session', n.id),
    travel: (n) => call('world.travel', n.to),
    cinema: (n) => askSafe(() => ui.cinema((n.lines || []).map(F), n)),
    wait: (n) => askSafe(() => ui.sleep(n.ms ?? 600)),
    goto: (n) => ({ goto: n.script }),
  };

  async function action(node) {
    const fn = ACTIONS[node.do];
    if (!fn) { warn('unknown action', node.do); return null; }
    const r = await fn(node);
    return r && r.goto ? r : null;
  }

  async function play(what) {
    let nodes = typeof what === 'string' ? getScript(what) : what;
    if (!Array.isArray(nodes)) { warn('no such script', what); return; }
    for (let hops = 0; nodes && hops <= maxHops; hops++) {
      const r = await exec(nodes);
      if (!r || !r.goto) break;
      nodes = getScript(r.goto);
      if (!Array.isArray(nodes)) { warn('goto: no such script', r.goto); break; }
    }
  }

  // Runs are queued: a call while another run is playing waits its turn.
  const run = (what) => {
    pending += 1;
    const p = tail.then(() => play(what)).catch((e) => warn('run failed:', e?.message || e)).then(() => {
      pending -= 1;
      if (pending === 0) return askSafe(() => ui.end?.());
    });
    tail = p;
    return p;
  };

  // Exposed to ext handlers (sessions): run nested nodes, set tokens.
  const api = { run: exec, vars, F, warn, exec };
  return { run, exec, vars, F, get busy() { return pending > 0; } };
}
