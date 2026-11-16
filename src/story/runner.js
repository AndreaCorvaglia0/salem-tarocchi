// The script runner: interprets an array of story nodes (docs/CONTRACT.md, "Data: story").
// Pure logic: the UI it talks to is injected (say, choose, cinema, moment, sleep), so it runs in Node
// with fakes (tests/story-runner.*.test.mjs). A script never throws to the caller: unknown or broken
// nodes warn and the script goes on. Runs are queued: one at a time.
//
//   const r = createRunner({ ui, call, getScript, ext });
//   await r.run('c1.malva');            // by id (getScript) or an array of nodes
//   ui = { say(who, text), choose(texts, metas) -> index (metas[i]: null or { special, tag }, story/special.js), cinema(lines, node), moment(text), sleep(ms), end() }
//   ext(node, api) -> true when it handled a node the runner does not know (the sessions' ask/turn/pick).
import { state, save } from '../core/state.js';
import { test, fill } from '../core/cond.js';
import * as P from '../core/progress.js';
import { emit } from '../core/bus.js';
import * as SPREAD_DATA from '../data/spreads.js';
import * as LESSON_DATA from '../data/lessons.js';
import { orderOptions, metaOf } from './special.js';

const pad = (n) => String(n).padStart(2, '0');
// The card with the number n among the Majors, 22 -> the Fool.
export const cardOfNumber = (n) => `m${pad(Number(n) >= 22 ? 0 : Math.max(0, Number(n) || 0))}`;

export function createRunner({ ui, call, getScript = () => null, ext = null, warn = (...a) => console.warn('[story]', ...a), maxHops = 40 }) {
  const vars = {}; // extra {tokens} for the current run, e.g. {picked}
  let pending = 0;
  let tail = Promise.resolve();
  let jailAfter = false; // a failed Exam inside a script: the cell comes when the whole run is over

  const F = (t) => {
    let s = String(t ?? '');
    for (const k of Object.keys(vars)) s = s.split(`{${k}}`).join(String(vars[k]));
    return fill(s);
  };

  const askSafe = async (fn, fallback) => { try { return await fn(); } catch (e) { warn('ui failed:', e?.message || e); return fallback; } };

  async function exec(nodes) {
    if (!Array.isArray(nodes)) return null;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      try {
        const r = await step(node, isChoice(nodes[i + 1]));
        if (r && r.goto) return r;
      } catch (e) { warn('node failed:', e?.message || e, node); }
    }
    return null;
  }

  // a line right before a choice is its question: the UI shows the options once it is fully read
  const isChoice = (n) => !!n && typeof n === 'object' && 'choice' in n && Array.isArray(n.choice) && n.choice.some((o) => o && test(o.when));
  async function step(node, ask = false) {
    if (node == null || typeof node !== 'object') { warn('bad node', node); return null; }
    if ('say' in node) { await askSafe(() => ui.say(node.say, F(node.t), ask ? { ask: true } : undefined)); return null; }
    if ('choice' in node) return choice(node);
    if ('if' in node) return exec(test(node.if) ? node.then : node.else);
    if ('do' in node) return action(node);
    if (ext) { const handled = await ext(node, api); if (handled) return handled === true ? null : handled; }
    warn('unknown node', node);
    return null;
  }

  async function choice(node) {
    // special answers (story/special.js) go after the ordinary ones; the UI gets their tag beside the text
    const opts = orderOptions((Array.isArray(node.choice) ? node.choice : []).filter((o) => o && test(o.when)));
    if (!opts.length) { warn('choice with no options', node); return null; }
    const metas = opts.map((o) => metaOf(o));
    let i = await askSafe(() => (metas.some(Boolean) ? ui.choose(opts.map((o) => F(o.t)), metas) : ui.choose(opts.map((o) => F(o.t)))), 0);
    if (!Number.isInteger(i) || i < 0 || i >= opts.length) i = 0;
    const o = opts[i];
    if (o.tag && typeof o.tag === 'object') P.addPoint(o.tag); // a string tag is a special option's label
    if (o.trait) P.addTrait(o.trait);
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
    power: (n) => { const was = state.powers[n.id]; state.powers[n.id] = true; save(); if (!was) emit('power', { id: n.id }); },
    tool: (n) => { state.tools[n.id] = (state.tools[n.id] || 0) + (n.n ?? 1); save(); },
    giveCard: (n) => foundCeremony(n.id),
    draw: async (n) => {
      let pool = n.pool === 'row' || n.pool == null ? P.majorsMissingOfRow(state.chapter) : n.pool.filter((id) => !state.cards[id]?.found);
      if (!pool.length && n.pool !== 'row') pool = P.majorsMissingOfRow(state.chapter);
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
      if (res && res.passed === false && n.kind !== 'judge' && !n.noJail) jailAfter = true;
    },
    // a service by name: { do: 'call', name: 'shop.open', args: [...] } (props: the shop, the deposit, the bed)
    call: (n) => call(n.name, ...(n.args || [])),
    session: (n) => call('story.session', n.id),
    // { do: 'trait', trait: { tono: 1 } } or { do: 'trait', tono: 1 }
    trait: (n) => P.addTrait(n.trait && typeof n.trait === 'object' ? n.trait : Object.fromEntries(P.AXES.filter((k) => k in n).map((k) => [k, n[k]]))),
    visit: (n) => call('story.visit', { force: !!n.force }),
    verdict: () => P.recordVerdict(), // after the Reader has named her card

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
      if (pending === 0) {
        return askSafe(() => ui.end?.()).then(() => {
          if (jailAfter) { jailAfter = false; return call('world.travel', 'depths.jail'); }
          return null;
        });
      }
    });
    tail = p;
    return p;
  };

  // Exposed to ext handlers (sessions): run nested nodes, set tokens.
  const api = { run: exec, vars, F, warn, exec };
  return { run, exec, vars, F, get busy() { return pending > 0; } };
}
