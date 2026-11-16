// The experience balance: every XP source of the game (read from the code), and three simulated players
// who play the real story (the real runner, scripts and gates, with fake screens) and do the optional
// things in between: straight (only what the story requires), normal (about half of the optional things),
// explorer (everything once). Prints the level at each chapter boundary, at each rank gate, when each
// power arrives, the coins against the shop prices.
//   node scripts/balance.mjs            the tables
//   node scripts/balance.mjs --seeds 40 more runs per profile (default 24)
// The test tests/balance.test.mjs imports simulate() and pins the levels at the two gates.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setState, state } from '../src/core/state.js';
import { on } from '../src/core/bus.js';
import * as P from '../src/core/progress.js';
import { test as cond } from '../src/core/cond.js';
import { MAJORS, MINORS, CARD } from '../src/data/cards.base.js';
import { SCRIPTS, SESSIONS, STEPS, CAST, CLIENTS } from '../src/data/story/index.js';
import * as STORY from '../src/data/story/index.js';
import { SPREADS } from '../src/data/spreads.js';
import { createRunner, cardOfNumber } from '../src/story/runner.js';
import { planVisit } from '../src/story/visit.plan.js';
import { xpFor } from '../src/systems/reading.rules.js';
import { engineFor, questionOf, isGood, payOf } from '../src/systems/consult.rules.js';
import { questionCount, newExam, answerStep, passed as examPassed } from '../src/systems/exam.rules.js';
import { nextClient } from '../src/glue/clients.rules.js';
import { finalCards } from '../src/glue/finale.rules.js';
import { TOOLS, CARD_PRICE } from '../src/ui/logic.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---- 1. the XP sources, read from the code ---------------------------------------------------------
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : []; });
export function xpSources() {
  const out = [];
  for (const file of walk(join(ROOT, 'src'))) {
    const src = readFileSync(file, 'utf8'), rel = relative(ROOT, file);
    const rules = (() => { try { return readFileSync(file.replace(/\.js$/, '.rules.js'), 'utf8'); } catch { return ''; } })();
    const konst = (name) => Number((src + rules).match(new RegExp(`\\b${name}\\s*[:=]\\s*(\\d+)`))?.[1]);
    for (const m of src.matchAll(/addXp\(\s*([^,)]+?)\s*,\s*'([^']+)'/g)) {
      if (rel.endsWith('core/progress.js') && (m[1] === 'n' || m[1].includes('?'))) continue;
      const raw = m[1];
      const n = /^\d+$/.test(raw) ? Number(raw) : /^XP\.\w+$/.test(raw) ? P.XP[raw.slice(3)] : /^[A-Z_]+$/.test(raw) ? konst(raw) : null;
      out.push({ why: m[2], n, expr: raw, file: rel });
    }
    if (rel.startsWith('src/data/story')) {
      const ns = [...src.matchAll(/\bxp\((\d+)\)/g)].map((m) => Number(m[1]));
      if (ns.length) out.push({ why: 'story', n: ns.reduce((a, b) => a + b, 0), expr: `${ns.length} nodes xp(${[...new Set(ns)].join('|')})`, file: rel });
    }
    if (rel.startsWith('src/data/world')) for (const m of src.matchAll(/id: '([^']+chest[^']*)'[^\n]*?xp: (\d+)/g)) out.push({ why: 'chest', n: Number(m[2]), expr: m[1], file: rel });
  }
  return out;
}
// the amount of a source; with two of the same name (a story client 5, a generated one 3) the largest, or the smallest
const amount = (why, pick = Math.max) => { const ns = xpSources().filter((x) => x.why === why && x.n != null).map((x) => x.n); return ns.length ? pick(...ns) : 0; };

// ---- 2. the players --------------------------------------------------------------------------------
// share: the part of the optional things of each chapter she does (hidden Majors beyond what a gate asks,
// clients after the first, chests). reviews / exams: per chapter (a review is a five-question round; an
// exam is a constable met while walking). minors: Minors picked in the grass over the whole story
// (src/world/minorsim.js measures about 10 for a straight walk and about twice for a wandering one).
export const PROFILES = {
  straight: { share: 0, reviews: 0, exams: 1, minors: 10, day: 0, p: 0.75 },
  normal: { share: 0.5, reviews: 1, exams: 2, minors: 15, day: 1, p: 0.75 },
  explorer: { share: 1, reviews: 2, exams: 3, minors: 22, day: 1, p: 0.75 },
};
const CH_OF_MINORS = { 1: 0.3, 2: 0.4, 3: 0.3 };
const GATE_STEPS = STEPS.filter((s) => s.rank).map((s) => s.id); // c1.gate (4), c3.trapdoor (7)

const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// the hidden Majors a straight player must look for in each chapter (the gates ask for them): the optional
// ones are the rest
let NEEDED = null;
const needed = async () => NEEDED || (NEEDED = (await simulate({ ...PROFILES.straight, needed: {} })).hunted);
export async function simulate(profile = 'straight', { seed = 1, pick = 0 } = {}) {
  const pr = typeof profile === 'string' ? { ...PROFILES[profile], needed: await needed() } : profile;
  const rng = mulberry(seed * 7919 + 13);
  const right = () => rng() < pr.p;
  setState({});
  const X = { visit: amount('visit'), client: amount('client'), gen: amount('client', Math.min), exam: amount('exam'), review: amount('review'), day: amount('day') };
  const log = { levels: {}, chapters: {}, gates: {}, coins: {}, end: null, study: {}, hunted: {}, readings: 0, reviews: 0, exams: 0, spent: 0 };
  const by = {};
  const off = [
    on('xp', ({ n, why }) => { why = why || 'story'; by[why] = (by[why] || 0) + n; }),
    on('level:up', ({ level }) => { log.levels[level] = { step: state.step, chapter: state.chapter, xp: state.xp }; }),
    on('chapter', ({ n }) => { log.chapters[n] = { level: P.levelOf(), xp: state.xp, coins: state.coins }; }),
  ];
  const owned = () => P.ownedIds();
  const nextStar = (id) => { const c = state.cards[id]; return !c || c.stars === 0 ? 'image' : c.stars === 1 ? (state.told[id] ? 'meaning' : 'image') : 'astro'; };

  // a client reading (systems/reading.js + consult.js), with her accuracy
  const reading = ({ spread = 'single', client, cards } = {}) => {
    const sp = SPREADS[spread] || SPREADS.single, N = sp.positions.length;
    const cl = client === 'self' ? CLIENTS.find((c) => c.id === 'self') : CLIENTS.find((c) => c.id === client) || { id: client, pay: 5 };
    if (client === 'self' && !cards) cards = finalCards({ yourCard: P.yourCard(), mostMissed: P.mostMissed(), birthCard: state.player.birthCard, flags: state.flags, mostTrusting: P.mostTrusting(), owned: P.ownedMajors(), rng });
    const eng = engineFor({ client: client === 'self' ? 'x' : cl.id, n: N, owned: owned(), given: cards });
    const pool = eng.use ? [...eng.pool] : P.ownedMajors();
    const ids = [];
    for (let i = 0; i < N; i++) {
      const g = cards?.[i];
      if (g && g !== 'fan' && g !== 'number' && g !== 'top') { ids.push(g); continue; }
      const left = pool.filter((id) => !ids.includes(id) && !(cards || []).includes(id));
      ids.push(left.length ? left[Math.floor(rng() * left.length)] : MAJORS.find((c) => !ids.includes(c.id)).id);
    }
    let wrong = 0, total = 0, oks = [];
    if (eng.use) {
      for (const id of ids) { const a = right(), b = right(); total += 2; wrong += !a + !b; P.answer(id, a && b, 'meaning'); }
      let levelOk = true;
      if (N > 1) { levelOk = right(); total++; if (!levelOk) wrong++; }
      const good = isGood({ wrong, total, levelOk });
      const coins = client === 'self' ? 0 : payOf(cl.pay ?? 0, good);
      if (coins) P.addCoins(coins);
      P.addXp(xpFor((total - wrong) / total, total), 'reading');
    } else {
      for (const id of ids) { const ok = right(); oks.push(ok); P.answer(id, ok, 'meaning'); }
      P.addXp(xpFor(oks.filter(Boolean).length / N, N), 'reading');
    }
    log.readings++;
    return { ok: true };
  };
  const cottage = () => { // glue/clients.js clients.next
    const n = nextClient({ clients: CLIENTS, chapter: state.chapter, done: (id) => !!state.flags[`client.${id}.done`], spreads: state.spreads, rng });
    if (!n) return false;
    reading({ spread: n.spread, client: n.id });
    // a story client of the chapter; when none is left, someone else knocks (an old face, a generated
    // client: glue/clients.js), counted here as a generated one
    if (!n.back) { P.setFlag(`client.${n.id}.done`); P.addXp(X.client, 'client'); } else P.addXp(X.gen, 'client');
    return true;
  };
  const review = () => { // systems/review.js: five questions on her cards, due first
    const ids = owned(); if (!ids.length) return;
    for (let i = 0; i < 5; i++) { const id = ids[Math.floor(rng() * ids.length)], ok = right(); P.answer(id, ok, nextStar(id)); if (ok) P.addXp(X.review, 'review'); }
    log.reviews++;
  };
  const exam = (kind = 'constable') => { // systems/exam.js
    let s = newExam({ kind, chapter: state.chapter, exams: state.stats.exams || 0 });
    const ids = owned().length ? owned() : ['m00'];
    while (!s.over) { const id = ids[Math.floor(rng() * ids.length)], ok = right(); if (state.cards[id]) P.answer(id, ok, nextStar(id)); s = answerStep(s, ok).state; }
    state.stats.exams = (state.stats.exams || 0) + 1;
    const pass = examPassed(s);
    if (pass) P.addXp(X.exam, 'exam');
    log.exams++;
    return { passed: pass };
  };
  const visit = ({ force } = {}) => { // story/visit.js
    const plan = planVisit({ state, force });
    if (!plan) return false;
    for (const c of plan.cards) P.tellCard(c.id);
    state.visits++; P.addXp(X.visit, 'visit');
    return true;
  };

  let runner;
  const ext = async (n, api) => {
    if (n.ask === 'name') { P.setPlayer({ name: 'Viola' }); return true; }
    if (n.ask === 'birth') { P.setPlayer({ birth: { d: 3, m: 10, y: 1996 } }); return true; }
    if (n.turn) { P.findCard(n.turn, { silent: true }); return true; }
    if (n.pick === 'number') { api.vars.picked = cardOfNumber(7); return (await api.exec(n.then)) || true; }
    return true; // the other session nodes (observe, portrait, the last image) show things only
  };
  const call = async (name, arg) => {
    if (name === 'card.found') { P.findCard(arg); return; }
    if (name === 'draw.pick') return arg.pool.find((id) => !state.cards[id]?.found) || arg.pool[0];
    if (name === 'exam.start') return exam(arg?.kind);
    if (name === 'story.session') return runner.exec(SESSIONS[arg]);
    if (name === 'story.visit') return visit(arg);
    if (name === 'reading.open') return reading(arg || {});
    if (name === 'clients.next') return cottage();
    if (name === 'shop.open') return null;
    return null;
  };
  let choiceN = 0;
  const ui = { say() {}, choose: (opts) => (pick === 0 ? 0 : opts.length - 1 + 0 * choiceN++), cinema() {}, moment() {}, sleep() {}, end() {} };
  runner = createRunner({ ui, call, getScript: (id) => SCRIPTS[id], ext, warn: () => {} });

  // the optional things, scheduled at the steps of their chapter (done before that step is tried)
  const order = STEPS.map((s) => s.id);
  const idx = (id) => order.indexOf(id);
  const plan = []; // [{ at: index, fn }]
  const spreadOver = (ch, from, items) => {
    const steps = STEPS.filter((s) => s.chapter === ch && s.at && idx(s.id) > idx(from));
    items.forEach((fn, i) => { const s = steps[Math.min(steps.length - 1, Math.floor(((i + 1) * steps.length) / (items.length + 1)))]; if (s) plan.push({ at: idx(s.id), fn }); });
  };
  const n = (k) => Math.round(k * pr.share);
  const CLIENT_AFTER = { 1: 'c1.cart', 2: 'c2.fire', 3: 'c3.coven' };
  const START = { 1: 'c1.malva', 2: 'c2.ortica', 3: 'c3.edera' };
  const CHESTS = { 1: 'village', 2: 'forest', 3: 'depths' };
  const chestXp = xpSources().filter((x) => x.why === 'chest');
  for (const ch of [1, 2, 3]) {
    const items = [];
    // hidden Majors of the row beyond what the gates ask (found in the order of the cards)
    const hidden = MAJORS.filter((c) => c.spot && c.row === ch && c.id !== 'm07');
    const spare = Math.max(0, hidden.length - (pr.needed?.[ch] ?? 0));
    for (let i = 0; i < Math.round(spare * pr.share); i++) items.push(() => { const c = MAJORS.find((k) => k.spot && k.row === ch && !state.cards[k.id]?.found && k.id !== 'm07'); if (c) P.findCard(c.id); });
    for (const c of chestXp.filter((x) => x.file.includes(CHESTS[ch])).slice(0, n(chestXp.filter((x) => x.file.includes(CHESTS[ch])).length))) items.push(() => { P.addXp(c.n, 'chest'); const id = owned()[0]; if (id) P.answer(id, right(), nextStar(id)); });
    for (let i = 0; i < pr.exams; i++) items.push(() => exam('constable'));
    const minors = Math.round(pr.minors * CH_OF_MINORS[ch]);
    for (let i = 0; i < minors; i++) items.push(() => { const free = MINORS.filter((c) => !state.cards[c.id]?.found); if (free.length) P.findCard(free[Math.floor(rng() * free.length)].id); });
    spreadOver(ch, START[ch], items);
    const later = [];
    for (let i = 0; i < n(3); i++) later.push(() => cottage());
    for (let i = 0; i < pr.reviews; i++) later.push(() => review());
    if (ch === 1 && pr.day) later.push(() => P.addXp(X.day, 'day'));
    spreadOver(ch, ch === 1 ? 'c1.grimoire' : CLIENT_AFTER[ch], later.filter((_, i) => i >= 0)); // reviews from the grimoire on
    if (ch === 1) { /* clients of chapter 1 open only after the first one (c1.cart) */
      const lastItems = plan.splice(plan.length - later.length, later.length);
      lastItems.forEach((it, i) => { it.at = Math.max(it.at, idx(CLIENT_AFTER[1]) + (i % 2)); plan.push(it); });
    }
  }
  plan.sort((a, b) => a.at - b.at);

  // the lessons offered as missions (data/story/missions.js): the game announces each as soon as it is
  // available and marks it as a thing to do now, so every player takes it (offer, then the scene)
  const lessons = async () => {
    for (const m of STORY.LESSON_MISSIONS || []) {
      if (!cond(m.when) || cond(m.done)) continue;
      if (m.offer && SCRIPTS[m.offer]) await runner.run(m.offer);
      if (SCRIPTS[m.script]) await runner.run(m.script);
      if (!cond(m.done) && m.done?.flag) P.setFlag(m.done.flag);
      log.lessons = (log.lessons || 0) + 1;
    }
  };
  await runner.run(SESSIONS.s0);
  let done = 0;
  for (let guard = 0; guard < 400 && state.step !== 'post.minors'; guard++) {
    const before = state.step, i = idx(before);
    while (done < plan.length && plan[done].at <= i) { plan[done].fn(); done++; }
    await lessons();
    const st = STEPS.find((s) => s.id === before);
    if (GATE_STEPS.includes(before) && !log.gates[before]) log.gates[before] = { by: { ...by }, level: P.levelOf(), xp: state.xp, need: P.LEVEL_XP[st.rank - 1], majors: P.majorsFound(), coins: state.coins };
    const entry = CAST.find((c) => c.at === st.at && cond(c.when));
    if (!entry) throw new Error(`no cast entry for step ${before}`);
    await runner.run(entry.script);
    if (state.step === before) {
      // a gate refused: the Majors first (a player looks for them), then the rank: she studies
      const missing = MAJORS.find((c) => c.spot && !state.cards[c.id]?.found && c.row <= state.chapter && c.id !== 'm07');
      if (st.need && P.majorsFound() < st.need && missing) { P.findCard(missing.id); log.hunted[missing.row] = (log.hunted[missing.row] || 0) + 1; continue; }
      log.study[before] = (log.study[before] || 0) + 1;
      if (log.study[before] > 60) throw new Error(`stuck at ${before}`);
      if (log.study[before] % 2 && cottage()) continue;
      review();
    }
  }
  log.end = { level: P.levelOf(), xp: state.xp, coins: state.coins, majors: P.majorsFound(), cards: P.foundIds().length, step: state.step };
  log.lastLevelAt = Object.entries(log.levels).map(([l, v]) => ({ l: Number(l), ...v }));
  off.forEach((f) => f());
  return log;
}

// the average over seeds of the numbers that matter
export async function measure(profile, { seeds = 24, pick = 0 } = {}) {
  const runs = [];
  for (let s = 1; s <= seeds; s++) runs.push(await simulate(profile, { seed: s, pick }));
  const avg = (f) => runs.reduce((a, r) => a + (f(r) ?? 0), 0) / runs.length;
  const out = { profile, runs: runs.length, gates: {}, chapters: {}, powers: {}, end: {} };
  for (const g of GATE_STEPS) out.gates[g] = { level: avg((r) => r.gates[g]?.level), xp: avg((r) => r.gates[g]?.xp), need: runs[0].gates[g]?.need, study: avg((r) => r.study[g] || 0), coins: avg((r) => r.gates[g]?.coins), by: {} };
  for (const g of GATE_STEPS) for (const k of new Set(runs.flatMap((r) => Object.keys(r.gates[g]?.by || {})))) out.gates[g].by[k] = Math.round(avg((r) => r.gates[g]?.by?.[k] || 0));
  for (const c of [1, 2, 3, 4]) out.chapters[c] = { level: avg((r) => r.chapters[c]?.level), xp: avg((r) => r.chapters[c]?.xp), coins: avg((r) => r.chapters[c]?.coins) };
  for (let l = 2; l <= 9; l++) {
    const where = {};
    for (const r of runs) { const k = r.levels[l] ? `${r.levels[l].step}` : 'never'; where[k] = (where[k] || 0) + 1; }
    out.powers[l] = Object.entries(where).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}${runs.length > 1 ? ` ${Math.round((100 * v) / runs.length)}%` : ''}`).join(', ');
  }
  out.end = { level: avg((r) => r.end.level), xp: avg((r) => r.end.xp), coins: avg((r) => r.end.coins), readings: avg((r) => r.readings), reviews: avg((r) => r.reviews), exams: avg((r) => r.exams) };
  return out;
}

// ---- 3. the report ---------------------------------------------------------------------------------
const GIFT = { 2: 'cat', 3: 'shop', 4: 'fire', 5: 'sense', 6: 'broom', 7: 'stun', 8: 'move', 9: 'Strega' };
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const seeds = Number(process.argv[process.argv.indexOf('--seeds') + 1]) || 24;
  console.log('XP SOURCES (from the code)');
  for (const s of xpSources()) console.log(`  ${String(s.why).padEnd(8)} ${String(s.n ?? '?').padStart(4)}  ${s.expr.padEnd(34)} ${s.file}`);
  console.log(`  card     ${P.XP.card} a Major, ${P.XP.minor} a Minor (core/progress.js findCard); star ${P.XP.star}; told ${P.XP.told} (core/progress.js)`);
  console.log(`  reading  xpFor(score, questions) (systems/reading.rules.js): 1 card (2 questions) ${xpFor(1, 2)} all right, ${xpFor(0.5, 2)} one right, ${xpFor(0, 2)} none; 3 cards (7) ${xpFor(1, 7)} all right, ${xpFor(5 / 7, 7)} with 5; cross (21) ${xpFor(16 / 21, 21)} with 16`);
  console.log(`\nLEVEL_XP ${JSON.stringify(P.LEVEL_XP)}`);
  console.log(`seeds per profile: ${seeds}; accuracy ${PROFILES.straight.p}; first options of every choice\n`);
  for (const name of Object.keys(PROFILES)) {
    const m = await measure(name, { seeds });
    console.log(`== ${name}  ${JSON.stringify(PROFILES[name])}`);
    for (const [g, v] of Object.entries(m.gates)) console.log(`  gate ${g.padEnd(12)} arrives at level ${v.level.toFixed(2)} (xp ${v.xp.toFixed(0)}, needs ${v.need}); studies ${v.study.toFixed(1)} times (client or review) to pass; coins ${v.coins.toFixed(0)}\n      xp so far by source: ${Object.entries(v.by).map(([k, n]) => `${k} ${n}`).join(', ')}`);
    for (const [c, v] of Object.entries(m.chapters)) console.log(`  chapter ${c} starts: level ${v.level.toFixed(2)}, xp ${v.xp.toFixed(0)}, coins ${v.coins.toFixed(0)}`);
    for (const [l, w] of Object.entries(m.powers)) console.log(`  level ${l} (${GIFT[l]}): ${w}`);
    console.log(`  end: level ${m.end.level.toFixed(2)}, xp ${m.end.xp.toFixed(0)}, coins ${m.end.coins.toFixed(0)}; readings ${m.end.readings.toFixed(1)}, reviews ${m.end.reviews.toFixed(1)}, exams ${m.end.exams.toFixed(1)}\n`);
  }
  for (const p of [0.6, 0.9]) {
    const m = await measure({ ...PROFILES.straight, p, needed: await needed() }, { seeds });
    console.log(`straight with accuracy ${p}: ${Object.entries(m.gates).map(([g, v]) => `${g} level ${v.level.toFixed(2)}, studies ${v.study.toFixed(1)}`).join('; ')}; end level ${m.end.level.toFixed(2)}`);
  }
  console.log(`SHOP: ${Object.values(TOOLS).map((t) => `${t.short} ${t.price}`).join(', ')}, treat 3, a card ${CARD_PRICE.slice(1).join('/')} (by row)`);
}
