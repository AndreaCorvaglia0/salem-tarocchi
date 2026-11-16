// The trials (docs/DESIGN.md, "Le prove"): a piece of story with forks, good and bad rooms, an escape, and
// a count of errors. Pure: the screens and the world are injected (`io`), the state is read, never written:
// every gain and loss comes back as plain effects that glue/trials.js applies through the existing systems.
//
// A trial is data (src/data/trials/):
//   { id, title, with?: witchId, study: [topics], main?: true, debug?: true, when?: <cond>,
//     start?: { at: anchor, who?, label?, verb? },          (where it begins in the world, side trials)
//     steps: [ step... ], rooms: { id: room }, outcomes: { perfect, pass, fail } }
// Steps:
//   { say: who, t }  |  { lines: [[who, t], ...] }               story lines (the existing dialogue)
//   { witchDraw: { who, card, rev?, t } }                         a witch pulls a card in front of her
//   { fork: { kind: 'segno'|'idea'|'quesito', options, rule?, by? }, who?, t?, right?: roomId, wrong?: roomId }
//        options[i].room: a room that option leads to; else `right` / `wrong`: the room a right / wrong choice leads to.
//        A wrong choice is one error.
//   { room: roomId }                                              a room on the way, no choice
//   { escape: { from?, to, seconds? }, caught?: { error?: 1, exam?: 'constable', loss?, lines? }, safe?: lines }
//   { choice: [{ t, error?: true, bond?: n, trait?: {...}, then?: [[who, t]] }], who?, t? }
// Rooms: { good: true|false, lines: [[who, t]], gain?: { coins, xp }, loss?: { coins, tool } }
// Outcomes by errors (0 perfect, 1-2 pass, 3+ fail, or def.limits = [pass, fail]):
//   perfect|pass: { lines, reward: { coins, xp, tool, item, card, bond, flag } }
//   fail:         { lines, loss: { coins, tool, bond, loseCard: 'random-minor' | id }, exam? }
import { CARD } from '../data/cards.base.js';

export const LIMITS = [1, 3]; // errors from which it is a pass, and a fail
export const outcomeOf = (errors, limits = LIMITS) => (errors >= limits[1] ? 'fail' : errors >= limits[0] ? 'pass' : 'perfect');

// lines: a string (the narrator), one pair [who, t], or a list of pairs
const asLines = (x) => (!x ? [] : typeof x === 'string' ? [['narra', x]] : typeof x[0] === 'string' ? [x] : x);
export const linesOf = (step) => ('say' in step ? [[step.say, step.t]] : asLines(step.lines));

// ---- what a reward or a loss becomes -----------------------------------------------------------
// The card ids that the story's conditions ask for ({ has }, { lacks }): losing one could close a gate.
export function gateCards(...trees) {
  const out = new Set();
  const walk = (x, depth = 0) => {
    if (!x || typeof x !== 'object' || depth > 40) return;
    if (Array.isArray(x)) { for (const y of x) walk(y, depth + 1); return; }
    for (const [k, v] of Object.entries(x)) {
      if ((k === 'has' || k === 'lacks') && typeof v === 'string' && CARD[v]) out.add(v);
      else walk(v, depth + 1);
    }
  };
  for (const t of trees) walk(t);
  return out;
}
const owned = (s, id) => !!s.cards?.[id]?.found && !s.cards[id].confiscated;
// A card that may be taken: owned; a Minor, or a Major that no story gate asks for. Never a Major by chance.
export function safeToLose(id, s, gates = new Set()) {
  if (!CARD[id] || !owned(s, id)) return false;
  if (CARD[id].arcana === 'major') return !gates.has(id);
  return !gates.has(id);
}
// The card a 'random-minor' loss takes: one of her Minors (never one a gate asks for), else none.
export function pickLostCard(spec, s, { rng = Math.random, gates = new Set() } = {}) {
  if (!spec) return null;
  if (spec === 'random-minor') {
    const ids = Object.keys(s.cards || {}).filter((id) => CARD[id]?.arcana === 'minor' && safeToLose(id, s, gates)).sort();
    return ids.length ? ids[Math.floor(rng() * ids.length)] : null;
  }
  return safeToLose(spec, s, gates) ? spec : null;
}

// -> [effect]: { coins: n } { xp: n } { tool: id, n } { item: id } { card: id } { bond: { who, n } }
//    { flag: k } { confiscate: id }. Losses take only what she has (coins down to 0, a tool she carries).
export function planReward(reward = {}, def = {}) {
  const out = [];
  if (reward.coins) out.push({ coins: reward.coins });
  if (reward.xp) out.push({ xp: reward.xp });
  if (reward.tool) out.push({ tool: reward.tool, n: reward.n || 1 });
  if (reward.item) out.push({ item: reward.item });
  if (reward.card) out.push({ card: reward.card });
  if (reward.bond && (reward.with || def.with)) out.push({ bond: { who: reward.with || def.with, n: reward.bond } });
  if (reward.flag) out.push({ flag: reward.flag });
  return out;
}
export function planLoss(loss = {}, s, def = {}, { rng = Math.random, gates = new Set() } = {}) {
  const out = [];
  if (loss.coins) { const n = Math.min(Math.abs(loss.coins), Math.max(0, s.coins || 0)); if (n) out.push({ coins: -n }); }
  if (loss.tool) {
    const ids = loss.tool === 'any' ? Object.keys(s.tools || {}).filter((k) => (s.tools[k] || 0) > 0).sort() : [loss.tool];
    const id = ids.length ? ids[Math.floor(rng() * ids.length)] : null;
    if (id && (s.tools?.[id] || 0) > 0) out.push({ tool: id, n: -1 });
  }
  if (loss.bond && (loss.with || def.with)) out.push({ bond: { who: loss.with || def.with, n: -Math.abs(loss.bond) } });
  if (loss.loseCard) { const id = pickLostCard(loss.loseCard, s, { rng, gates }); if (id) out.push({ confiscate: id }); }
  if (loss.flag) out.push({ flag: loss.flag });
  return out;
}

// ---- when a trial may be played ---------------------------------------------------------------
// state.trials[id] = { result: 'perfect'|'pass'|'fail', errors, day, at }
// A main trial is played once: its outcome is final and the story goes on with it. A side trial that was
// failed can be tried again on another day (a calendar day of play); passed, it is done.
export function trialStatus(def, s, today) {
  const r = s.trials?.[def.id];
  if (!r) return 'open';
  if (r.result !== 'fail' || def.main) return 'done';
  return r.day === today ? 'wait' : 'open';
}
export const trialDone = (def, s) => { const r = s.trials?.[def.id]; return !!r && (r.result !== 'fail' || !!def.main); };

// ---- the run --------------------------------------------------------------------------------
// io: {
//   say(lines)                        story lines, resolves when read
//   witchDraw({ who, card, rev, t })  the gesture of a witch
//   ask(fork, step)  -> { k, face }   the decision with the cards (ui/trial.js does the drawing)
//   feedback(result, fork, step)      the panel after the choice (may be folded into ask)
//   room(room, id)                    shows a room's lines (gain or loss is applied by apply)
//   escape(spec)     -> 'safe' | 'caught'
//   choose(texts)    -> index
//   apply(effects, why)               gains and losses through the real systems
//   judge(decision, face, k) -> { ok } (src/trials/ask.js judge)
//   plan: { loss(loss) -> effects }   (so losses are planned on the live state at that moment)
// }
// -> { id, errors, outcome, log }
export async function runTrial(def, io) {
  const log = [];
  let errors = 0;
  const err = (why) => { errors += 1; log.push({ error: why }); };
  const room = async (id) => {
    const r = def.rooms?.[id];
    if (!r) return;
    await io.room?.(r, id);
    if (r.gain) await io.apply?.(planReward(r.gain, def), `room:${id}`);
    if (r.loss) await io.apply?.(io.plan?.loss(r.loss) || [], `room:${id}`);
    log.push({ room: id, good: !!r.good });
  };
  for (const step of def.steps || []) {
    if ('say' in step || 'lines' in step) { await io.say(linesOf(step)); continue; }
    if (step.witchDraw) { await io.witchDraw?.(step.witchDraw); continue; }
    if (step.room) { await room(step.room); continue; }
    if (step.fork) {
      if (step.t) await io.say([[step.who || 'narra', step.t]]);
      const res = await io.ask(step.fork, step);
      const j = res?.ok != null ? res : io.judge(res.decision || step.fork, res.face, res.k);
      log.push({ fork: step.fork.kind, card: res.face?.id, rev: !!res.face?.rev, ok: !!j.ok });
      if (!j.ok) err(`fork:${step.fork.kind}`);
      const chosen = step.fork.options?.[res.k];
      if (chosen?.room) await room(chosen.room);
      else if (j.ok && step.right) await room(step.right);
      else if (!j.ok && step.wrong) await room(step.wrong);
      continue;
    }
    if (step.escape) {
      const r = await io.escape(step.escape);
      log.push({ escape: r });
      if (r === 'caught') {
        const c = step.caught || {};
        for (let i = 0; i < (c.error ?? 1); i++) err('caught');
        if (c.lines) await io.say(asLines(c.lines));
        if (c.loss) await io.apply?.(io.plan?.loss(c.loss) || [], 'caught');
        if (c.exam) await io.apply?.([{ exam: c.exam }], 'caught');
      } else if (step.safe) await io.say(asLines(step.safe));
      continue;
    }
    if (step.choice) {
      if (step.t) await io.say([[step.who || 'narra', step.t]]);
      const opts = step.choice;
      let i = await io.choose(opts.map((o) => o.t), opts);
      if (!Number.isInteger(i) || !opts[i]) i = 0;
      const o = opts[i];
      log.push({ choice: i });
      if (o.error) err('choice');
      const fx = [];
      if (o.bond && def.with) fx.push({ bond: { who: def.with, n: o.bond } });
      if (o.trait) fx.push({ trait: o.trait });
      if (fx.length) await io.apply?.(fx, 'choice');
      if (o.then) await io.say(asLines(o.then));
      continue;
    }
  }
  const outcome = outcomeOf(errors, def.limits || LIMITS);
  const out = def.outcomes?.[outcome] || {};
  if (out.lines) await io.say(asLines(out.lines));
  const fx = outcome === 'fail' ? io.plan?.loss(out.loss || {}) || [] : planReward(out.reward || {}, def);
  if (outcome === 'fail' && out.exam) fx.push({ exam: out.exam });
  await io.end?.({ id: def.id, errors, outcome, effects: fx, def });
  return { id: def.id, errors, outcome, log, effects: fx };
}
