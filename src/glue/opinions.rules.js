// Pure rules for «Che ne pensi di lei?» (docs/DESIGN.md, 17 novembre; data: data/story/opinions.js; play:
// glue/opinions.js; tests: tests/opinions.test.mjs). Everything takes the state, a condition tester and the
// day key, so it runs in Node with plain objects. Nothing here depends on the current step of the story:
// only on whom she has met (each person's `met`) and on flags the scenes set.
//
// state.opinions = {
//   [personId]: { v, trait, by, day, text }   what she answered about that person, to whom, on which day
//   favourite, least: { id, day }             the Reader's two pick questions
//   events: { [eventId]: { k, v, trait, day, text } }   the Reader's questions about things that happened
//   heard: { [voceKey]: day }                 the lines she has heard (voceKey: person.speaker.n)
//   day: 'YYYY-MM-DD'                         the day of the last question (one a day, whoever asks)
//   since: n                                  everyday chats since the last line about someone
//   bed: n                                    questions asked at the cottage bed (Tartufo and the Reader take turns)
// }
export const VOICE_GAP = 2; // chats without a `voce` before the next one
export const MAX_PICK = 4; // people offered by the Reader's «chi ti piace di più?»
export const RESERVED = ['favourite', 'least', 'events', 'heard', 'day', 'since', 'bed'];
// the guided opening and the prologue: nothing is added there (same steps as data/story/cast.js OPENING)
export const QUIET_STEPS = ['p.session', 'p.road', 'c1.malva', 'c1.read', 'c1.shop', 'c1.back', 'c1.deliver', 'c1.cottage', 'c1.grimoire'];

const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
// the state key, always sane (an old save has none of it)
export function norm(s) {
  if (!isObj(s.opinions)) s.opinions = {};
  const o = s.opinions;
  for (const k of ['events', 'heard']) if (!isObj(o[k])) o[k] = {};
  if (!Number.isFinite(o.since)) o.since = VOICE_GAP;
  if (!Number.isFinite(o.bed)) o.bed = 0;
  if (typeof o.day !== 'string') o.day = null;
  for (const k of ['favourite', 'least']) if (o[k] != null && !isObj(o[k])) delete o[k];
  return o;
}
export const opinionOf = (s, id) => { const x = !RESERVED.includes(id) && isObj(s.opinions) ? s.opinions[id] : null; return isObj(x) && Number.isFinite(x.v) ? x : null; };
export const quiet = (s) => !s.started || (s.chapter || 0) < 1 || QUIET_STEPS.includes(s.step);

// ---- people
export const byId = (people, id) => people.find((p) => p.id === id) || null;
export const isMet = (p, s, t) => !!p && t(p.met, s);
export const metPeople = (s, t, people) => people.filter((p) => isMet(p, s, t));
export const voceKey = (p, v) => `${p.id}.${v.by}.${p.voci.filter((x) => x.by === v.by).indexOf(v)}`;
const heardAbout = (s, p) => p.voci.filter((v) => norm(s).heard[voceKey(p, v)]);
export const voicesHeard = (s, p) => heardAbout(s, p).map((v) => ({ by: v.by, t: v.t, day: s.opinions.heard[voceKey(p, v)] }));
export const spokenOf = (s, p) => heardAbout(s, p).length > 0;

// ---- one question a day, whoever asks; never the same twice
export const canQuestion = (s, today) => norm(s).day !== today;
// whom `asker` may ask about now: met, not the asker, never asked before (by anyone), a question of the asker's
export function askable({ asker, s, t, people }) {
  if (!isMet(byId(people, asker), s, t) && byId(people, asker)) return [];
  return people.filter((p) => p.id !== asker && p.domanda?.by?.[asker] && isMet(p, s, t) && !opinionOf(s, p.id))
    .map((p, i) => ({ p, i, n: heardAbout(s, p).length }))
    .sort((a, b) => b.n - a.n || a.i - b.i) // first the people she has heard most about
    .map((x) => x.p);
}
// the lines `speaker` may say now: both met, `when` true, not said before; never about `not` (who is present)
export function sayable({ speaker, s, t, people, not = null }) {
  const sp = byId(people, speaker);
  if (sp && !isMet(sp, s, t)) return [];
  const out = [];
  people.forEach((p, i) => {
    if (p.id === speaker || p.id === not || !isMet(p, s, t)) return;
    const v = p.voci.find((x) => x.by === speaker && t(x.when, s) && !norm(s).heard[voceKey(p, x)]);
    if (v) out.push({ p, v, i, asked: opinionOf(s, p.id) ? 1 : 0, n: heardAbout(s, p).length });
  });
  // first the people she has not been asked about, then those she has heard least of
  return out.sort((a, b) => a.asked - b.asked || a.n - b.n || a.i - b.i).map(({ p, v }) => ({ person: p, voce: v, key: voceKey(p, v) }));
}

// What comes after an everyday chat with `speaker`: one thing at most.
//   { kind: 'ask', asker, person } | { kind: 'voce', by, person, voce, key, aside } | null
// The first thing she ever gets is a line, not a question; a question needs a day without one; a line needs
// VOICE_GAP chats since the last. `cat`: Tartufo is with her and may add a line of his own about someone absent.
export function planChat({ speaker, s, t, today, people, cat = false }) {
  if (quiet(s)) return null;
  const o = norm(s);
  const heardAny = Object.keys(o.heard).length > 0;
  const lines = o.since >= VOICE_GAP || !heardAny ? sayable({ speaker, s, t, people }) : [];
  const asks = canQuestion(s, today) ? askable({ asker: speaker, s, t, people }) : [];
  if (asks.length && (heardAny || !lines.length)) return { kind: 'ask', asker: speaker, person: asks[0] };
  if (lines.length) return { kind: 'voce', by: speaker, ...lines[0], aside: false };
  if (cat && speaker !== 'tartufo' && o.since >= VOICE_GAP) {
    const side = sayable({ speaker: 'tartufo', s, t, people, not: speaker });
    if (side.length) return { kind: 'voce', by: 'tartufo', ...side[0], aside: true };
  }
  return null;
}
// count an everyday chat (call it once per chat, after planChat)
export function tick(s, plan) { const o = norm(s); o.since = plan?.kind === 'voce' ? 0 : Math.min(99, o.since + 1); return o.since; }
export function hear(s, key, today) { const o = norm(s); if (!o.heard[key]) o.heard[key] = today; return o.heard[key]; }

// What an answer does. Writes state.opinions[id] and the day; returns what the glue must apply:
//   { v, trait, bond: who | null }   bond: the asker, when the asker's own feeling agrees with her answer
// Nothing is ever taken away, whatever she answers.
export function answer(s, { id, by, k, today }, people) {
  const p = byId(people, id), a = p?.domanda?.a?.[k], q = p?.domanda?.by?.[by];
  if (!a || !q || opinionOf(s, id)) return null;
  const o = norm(s);
  o[id] = { v: a.v, trait: { ...a.trait }, by, day: today, text: a.t };
  o.day = today;
  return { v: a.v, trait: { ...a.trait }, bond: q.own === a.v ? by : null, reply: q.re[k] };
}

// ---- the Reader
// Her next question, or null: { kind: 'event', event } | { kind: 'favourite' | 'least', ids: [personId] }
// The most recent thing that happened first; «chi ti piace di più?» after one event (or when there is none),
// with three people met; «chi ti dà più fastidio?» later, with four.
export function readerNext({ s, t, today, people, reader, leastFirst = [] }) {
  if (quiet(s) || !canQuestion(s, today)) return null;
  const o = norm(s);
  const open = reader.events.filter((e) => t(e.when, s) && !o.events[e.id]);
  const done = Object.keys(o.events).length, met = metPeople(s, t, people).length;
  if (!o.favourite && met >= 3 && (done >= 1 || !open.length)) return { kind: 'favourite', ids: pickOptions('favourite', s, t, people) };
  if (o.favourite && !o.least && met >= 4 && (done >= 3 || !open.length)) return { kind: 'least', ids: pickOptions('least', s, t, people, leastFirst) };
  return open.length ? { kind: 'event', event: open[open.length - 1] } : null;
}
// the people offered: at most MAX_PICK, the most relevant first (what she said of them, how much she heard)
export function pickOptions(kind, s, t, people, leastFirst = []) {
  const o = norm(s), other = kind === 'favourite' ? o.least?.id : o.favourite?.id;
  const sign = kind === 'favourite' ? 1 : -1;
  const rank = (p, i) => (kind === 'least' && leastFirst.includes(p.id) ? leastFirst.indexOf(p.id) : i);
  return metPeople(s, t, people).filter((p) => p.id !== other)
    .map((p, i) => ({ id: p.id, v: sign * (opinionOf(s, p.id)?.v || 0), n: heardAbout(s, p).length, i: rank(p, i) }))
    .sort((a, b) => b.v - a.v || (kind === 'favourite' ? b.n - a.n : 0) || a.i - b.i)
    .slice(0, MAX_PICK).map((x) => x.id);
}
// the mirror for a pick: the person's `tratto` with what she chose, and what she had told someone before
export function pickMirror(kind, id, s, people, reader, askers = {}) {
  const p = byId(people, id), was = opinionOf(s, id), m = reader.pick[kind].mirror;
  const agrees = was && (kind === 'favourite' ? was.v > 0 : was.v < 0);
  const tpl = !was || !askers[was.by] ? m.none : agrees ? m.same : m.changed;
  return tpl.replace('{detto}', p.detto).replace('{tratto}', p.tratto).replace('{by}', askers[was?.by] || '');
}
export function answerPick(s, { kind, id, today }) { const o = norm(s); o[kind] = { id, day: today }; o.day = today; return o[kind]; }
export function answerEvent(s, { id, k, today }, reader) {
  const e = reader.events.find((x) => x.id === id), a = e?.a?.[k];
  if (!a || norm(s).events[id]) return null;
  const o = norm(s);
  o.events[id] = { k, v: a.v, trait: { ...a.trait }, day: today, text: a.t };
  o.day = today;
  return { v: a.v, trait: { ...a.trait }, reply: a.re };
}

// at the cottage bed: the Reader's question (a candle behind her eyelids) and Tartufo's take turns
export const bedTurn = (s) => (norm(s).bed % 2 === 0 ? 'reader' : 'tartufo');

// ---- the page «Le persone»: shown once she has met two
export const peopleOpen = (s, t, people) => metPeople(s, t, people).length >= 2;
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
// '2026-11-17' -> '17 novembre'
export const dayText = (key) => { const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(key || ''); return m && MONTHS[+m[2] - 1] ? `${+m[3]} ${MONTHS[+m[2] - 1]}` : ''; };
