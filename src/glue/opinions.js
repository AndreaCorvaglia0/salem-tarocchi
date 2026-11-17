// «Che ne pensi di lei?» in play (docs/DESIGN.md, 17 novembre; rules: opinions.rules.js; text:
// data/story/opinions.js; the page: ui/people.js).
// - after an everyday chat (never a scene of the main path, never the prologue or the guided opening) the
//   person adds one thing at most: a line about someone she has met, or the question about someone, with
//   three answers and a reply. The extra nodes are queued on the story runner right behind the chat, so
//   they play in the same dialogue box.
// - at the cottage bed Tartufo does the same, and on alternate nights the Reader comes for one question
//   (a candle behind her eyelids): this is how her questions reach a player who has no visits left.
// - in a visit of the Reader (story/visit.js): `opinions.reader` gives her one question, before her goodbye.
// - Malva has an everyday chat only in chapter 1: from chapter 2 on she is at her hearth with a short
//   welcome (`malva.later`), so that she too can speak and ask.
// Services: opinions.reader() -> null | { lead, q, a: [{ t }], answer(k) -> mirror text }
//           opinions.answer({ id, by, k }), opinions.heard(key), opinions.event({ id, k }), opinions.pick({ kind, id })
//           opinions.open() the page
import { provide, wrap } from '../core/services.js';
import { state, save } from '../core/state.js';
import { emit } from '../core/bus.js';
import { test } from '../core/cond.js';
import { addTrait, todayKey } from '../core/progress.js';
import { WITCHES, addBond } from '../core/witches.js';
import { addTartufo } from '../core/bonds.js';
import { SCRIPTS, CAST } from '../data/story/index.js';
import { PEOPLE_OP, READER, ASKERS, LEAST_FIRST, OPINION_SCRIPTS } from '../data/story/opinions.js';
import { openPeople } from '../ui/people.js';
import * as R from './opinions.rules.js';

// the scripts that are an everyday chat, and who speaks in them
export const CHATS = {
  'malva.chat': 'malva', 'malva.later': 'malva', 'ortica.chat': 'ortica', 'edera.chat': 'edera',
  'post.ginepra': 'ginepra', 'trade.ginepra': 'ginepra', 'prop.shop': 'bottegaio', 'prop.bed': 'tartufo',
};
const ctx = () => ({ s: state, t: test, today: todayKey(), people: PEOPLE_OP });
const person = (id) => R.byId(PEOPLE_OP, id);
const call = (name, arg) => ({ do: 'call', name, args: [arg] });

// ---- what an answer does -------------------------------------------------------------------------------
function applyAnswer({ id, by, k }) {
  const r = R.answer(state, { id, by, k, today: todayKey() }, PEOPLE_OP);
  if (!r) return null;
  addTrait(r.trait);
  if (r.bond) { if (WITCHES.includes(r.bond)) addBond(r.bond, 1, 'opinion'); else if (r.bond === 'tartufo') addTartufo(1); }
  save(); emit('opinion', { id, by, v: r.v });
  return r;
}
function applyEvent({ id, k }) {
  const r = R.answerEvent(state, { id, k, today: todayKey() }, READER);
  if (!r) return null;
  addTrait(r.trait); save(); emit('opinion', { event: id, v: r.v });
  return r;
}
function applyPick({ kind, id }) { const r = R.answerPick(state, { kind, id, today: todayKey() }); save(); emit('opinion', { [kind]: id }); return r; }

// ---- nodes for the story runner ----------------------------------------------------------------------
const askNodes = (asker, p) => {
  const q = p.domanda.by[asker];
  return [{ say: asker, t: q.q }, { choice: p.domanda.a.map((a, k) => ({ t: a.t, then: [call('opinions.answer', { id: p.id, by: asker, k }), { say: asker, t: q.re[k] }] })) }];
};
const voceNodes = (plan) => [{ say: plan.by, t: plan.aside ? `(${plan.voce.t})` : plan.voce.t }, call('opinions.heard', plan.key)];

// the Reader's question as { q, a: [{ t, re, apply }] }, or null
function readerQuestion() {
  const next = R.readerNext({ ...ctx(), reader: READER, leastFirst: LEAST_FIRST });
  if (!next) return null;
  if (next.kind === 'event') {
    const e = next.event;
    return { q: e.q, a: e.a.map((a, k) => ({ t: a.t, re: a.re, apply: () => applyEvent({ id: e.id, k }) })) };
  }
  if (next.ids.length < 2) return null;
  return { q: READER.pick[next.kind].q, a: next.ids.map((id) => ({
    t: READER.answer.replace('{detto}', person(id).detto),
    re: R.pickMirror(next.kind, id, state, PEOPLE_OP, READER, ASKERS), // from what she had said before this answer
    apply: () => applyPick({ kind: next.kind, id }),
  })) };
}
// at the bed: the candle, her one question, and she lets her sleep
let dream = null; // the question being asked at the bed (its answers are applied through opinions.dream)
function dreamNodes() {
  dream = readerQuestion();
  if (!dream) return null;
  return [{ say: 'narra', t: READER.dream }, { say: 'lettrice', t: READER.hello }, { say: 'lettrice', t: dream.q },
    { choice: dream.a.map((a, k) => ({ t: a.t, then: [call('opinions.dream', k), { say: 'lettrice', t: a.re }] })) },
    { say: 'lettrice', t: READER.bye }];
}

// what follows the everyday chat `script`, as story nodes (or null)
export function afterChat(script) {
  const speaker = CHATS[script];
  if (!speaker || R.quiet(state)) return null;
  if (speaker === 'tartufo' && !state.powers?.cat) return null;
  const c = ctx();
  let nodes = null, plan = null;
  if (script === 'prop.bed' && R.canQuestion(state, c.today)) {
    // the Reader and Tartufo take turns; whoever has nothing to ask leaves the night to the other
    const tartufo = () => { const a = R.askable({ asker: 'tartufo', ...c }); return a.length && Object.keys(R.norm(state).heard).length ? askNodes('tartufo', a[0]) : null; };
    nodes = R.bedTurn(state) === 'reader' ? dreamNodes() || tartufo() : tartufo() || dreamNodes();
    if (nodes) { R.norm(state).bed += 1; R.tick(state, null); save(); return nodes; }
  }
  plan = R.planChat({ speaker, ...c, cat: !!state.powers?.cat });
  R.tick(state, plan); save();
  if (!plan) return null;
  return plan.kind === 'ask' ? askNodes(plan.asker, plan.person) : voceNodes(plan);
}

provide('opinions.answer', (o) => Promise.resolve(applyAnswer(o || {})));
provide('opinions.heard', (key) => { R.hear(state, key, todayKey()); save(); return Promise.resolve(true); });
provide('opinions.dream', (k) => Promise.resolve(dream?.a?.[k]?.apply() || null));
provide('opinions.open', () => openPeople());
// a visit of the Reader: her one question near the end. answer(k) applies it and gives back her mirror.
provide('opinions.reader', () => {
  const q = readerQuestion();
  return Promise.resolve(q ? { lead: READER.lead, q: q.q, a: q.a.map((a) => ({ t: a.t })), answer: (k) => { const a = q.a[k] || q.a[0]; a.apply(); return a.re; } } : null);
});

// ---- registration (at import, before the world starts) -------------------------------------------------
Object.assign(SCRIPTS, OPINION_SCRIPTS);
// Malva at her hearth from chapter 2 on, except when the story has her elsewhere. It shares the id of her
// lesson on the small cards (data/story/cast.js `malva.lesson`), which comes first when it is open.
const ELSEWHERE = ['c3.trapdoor', 'c3.coven', 'c3.jail', 'c3.court', 'c3.trial', 'f.dawn', 'f.last'];
if (!CAST.some((e) => e.script === 'malva.later')) {
  CAST.push({ id: 'malva.lesson', kind: 'npc', who: 'malva', at: 'malva.hearth', when: [{ chapterMin: 2 }, { not: { stepIn: ELSEWHERE } }], script: 'malva.later', label: 'Malva' });
}
// the hook: an everyday chat is followed by what the person adds, in the same run of the dialogue box
wrap('story.run', (prev, what) => {
  const first = prev?.(what);
  let nodes = null;
  try { nodes = typeof what === 'string' ? afterChat(what) : null; } catch (e) { console.warn('[opinions]', e); }
  if (!nodes || !prev) return first;
  const second = prev(nodes); // queued behind the chat
  return Promise.resolve(first).then((r) => Promise.resolve(second).then(() => r));
});
