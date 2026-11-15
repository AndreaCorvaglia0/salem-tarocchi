// The rules of the Exam as pure functions (no DOM, no state): suspicion maths, mercy, helps, pass/fail,
// consequences. The screen (exam.js) only plays them. Tests: tests/play.exam.test.mjs.
export const FAIL_AT = 100; // suspicion at or above this: failed at once
export const FAIL_END = 67; // at the end, at or above this: failed
const CONF = {
  constable: { start: 0, wrong: 34, right: 10 },
  afflicted: { start: 50, wrong: 34, right: 10 },
  judge: { start: 0, wrong: 25, right: 10 },
};
export const confOf = (kind) => CONF[kind] || CONF.constable;

// How many questions: constable and afflicted 3 (4 from chapter 2, 5 in chapter 3); the judge 8.
export const questionCount = (kind, chapter = 1) => (kind === 'judge' ? 8 : chapter >= 3 ? 5 : chapter >= 2 ? 4 : 3);

// The cards an Exam asks about: what she owns; with fewer than 3, the Fool joins; the judge asks about every Major.
export const examPool = ({ kind, owned = [], majors = [] }) => {
  if (kind === 'judge') return [...majors];
  const pool = [...owned];
  if (pool.length < 3 && !pool.includes('m00')) pool.push('m00');
  return pool;
};

export const newExam = ({ kind, chapter = 1, exams = 0, total } = {}) => ({
  kind, total: total ?? questionCount(kind, chapter), asked: 0, right: 0, wrong: 0, skipped: 0,
  suspicion: confOf(kind).start, mercy: exams < 2, forgiven: 0, over: false,
});

// One answer. opts.forgive: the mistake costs nothing (Malva's help). The mercy of the first
// Exams works the same way, once. Returns { state, effect: 'right'|'wrong'|'mercy'|'forgiven' }.
export function answerStep(s, ok, { forgive = false } = {}) {
  const c = confOf(s.kind);
  const n = { ...s, asked: s.asked + 1 };
  let effect;
  if (ok) { n.right += 1; n.suspicion = Math.max(0, s.suspicion - c.right); effect = 'right'; }
  else {
    n.wrong += 1;
    if (forgive) { n.forgiven += 1; effect = 'forgiven'; }
    else if (s.mercy) { n.mercy = false; effect = 'mercy'; }
    else { n.suspicion = s.suspicion + c.wrong; effect = 'wrong'; }
  }
  n.over = n.suspicion >= FAIL_AT || n.asked + n.skipped >= n.total;
  return { state: n, effect };
}
// Ortica lets one question go by: it is not asked, the Exam gets shorter.
export const skipStep = (s) => { const n = { ...s, skipped: s.skipped + 1 }; n.over = n.asked + n.skipped >= n.total; return n; };
// Incense: calms the room.
export const calm = (s, n = 30) => ({ ...s, suspicion: Math.max(0, s.suspicion - n) });

export const failed = (s) => s.suspicion >= FAIL_AT || (s.over && s.suspicion >= FAIL_END);
export const passed = (s) => s.over && !failed(s);
export const result = (s) => ({ passed: passed(s), right: s.right, wrong: s.wrong, suspicion: Math.min(FAIL_AT, Math.max(0, Math.round(s.suspicion))) });

// Wrong options to take away (a hint): returns the index of one visible wrong option, or -1.
export const wrongToRemove = (options, hidden = [], rng = Math.random) => {
  const c = options.map((o, i) => (!o.ok && !hidden.includes(i) ? i : -1)).filter((i) => i >= 0);
  // never leave the right one alone against nothing: keep at least 2 visible
  if (!c.length || options.length - hidden.length <= 2) return -1;
  return c[Math.floor(rng() * c.length)];
};

// What a failed Exam takes: one or two random owned Majors; never the Fool; she keeps at least 2 cards.
export const toConfiscate = (owned, rng = Math.random) => {
  const cand = owned.filter((id) => /^m\d\d$/.test(id) && id !== 'm00');
  const room = Math.max(0, owned.length - 2);
  const n = Math.min(cand.length, room, rng() < 0.5 ? 1 : 2);
  const pool = [...cand], out = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  return out;
};
