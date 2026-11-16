// The rules of the lessons, pure (tests/story.lessons.test.mjs):
// - which lesson is announced now: `dueLesson(state, test)`. One at a time: nothing new is announced
//   while an announced lesson is still to do. The order is the chain of the registry (`after`: the
//   flying lesson, the five lessons on the Minors; the reversed cards after the first of them);
// - when each lesson of the course on the Minors is ready: `minorLessonReady(n, { flags, cards })`.
//   Lesson 1 (the suits) after the flying lesson. Each following one when the one before is done and
//   she has small cards to care about it: either she has found enough of them (THRESHOLDS), or she holds
//   one of the very cards that lesson is about (a Seven makes "Dal sette al dieci" ready at once);
// - what she has been taught, for the reading screens: `minorTaught(id, flags)`, `taughtGroups(flags)`.
import { LESSON_MISSIONS } from '../data/story/missions.js';

export const LESSONS_MINORS = [1, 2, 3, 4, 5]; // suits; 1-3; 4-6; 7-10; the court
// Minors found before lessons 2..5 are offered anyway
export const THRESHOLDS = { 2: 3, 3: 6, 4: 10, 5: 14 };
const MINOR = /^[wcsp](0[1-9]|1[0-4])$/;
export const isMinor = (id) => typeof id === 'string' && MINOR.test(id);
// the lesson (2..5) that teaches the number or the rank of that Minor; null for any other card
export const lessonOfMinor = (id) => { if (!isMinor(id)) return null; const n = Number(id.slice(1)); return n <= 3 ? 2 : n <= 6 ? 3 : n <= 10 ? 4 : 5; };
export const flagOf = (n) => `lesson.minors.${n}`;
export const minorsFound = (cards = {}) => Object.keys(cards || {}).filter((id) => isMinor(id) && cards[id]?.found);

const has = (flags, n) => !!flags && (!!flags['lesson.minors'] || !!flags[flagOf(n)]); // `lesson.minors`: the whole course
// -> { suits, numbers: [1..10 taught], court, lessons: [1..5 done] }
export function taughtGroups(flags = {}) {
  const lessons = LESSONS_MINORS.filter((n) => has(flags, n));
  return { suits: lessons.includes(1), numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => lessons.includes(n <= 3 ? 2 : n <= 6 ? 3 : 4)), court: lessons.includes(5), lessons };
}
// A card she can be asked to read: any card that is not a Minor, and a Minor once she knows its suit
// (lesson 1) and its number group or the court.
export function minorTaught(id, flags = {}) {
  if (!isMinor(id)) return true;
  return has(flags, 1) && has(flags, lessonOfMinor(id));
}

export function minorLessonReady(n, { flags = {}, cards = {} } = {}) {
  if (n === 1) return !!flags['lesson.fly'];
  if (!flags[flagOf(n - 1)]) return false;
  const found = minorsFound(cards);
  return found.length >= THRESHOLDS[n] || found.some((id) => lessonOfMinor(id) === n);
}

// The lesson to announce now, or null. `test` is core/cond.js test (state as second argument).
// One at a time: nothing while an announced lesson is still to do. Then the first, in the list's order,
// whose chain is done (`after`, as in core/extras.js), that is ready and whose teacher can be reached.
export function dueLesson(s, test, list = LESSON_MISSIONS) {
  const isDone = (m) => test(m.done, s);
  if (list.some((m) => !isDone(m) && s.flags?.[m.offered])) return null;
  const chain = (m) => (m.after || []).every((id) => { const a = list.find((x) => x.id === id); return !a || isDone(a); });
  const ready = (m) => (m.minor ? minorLessonReady(m.minor, { flags: s.flags, cards: s.cards }) : test(m.ready, s));
  return list.find((m) => !isDone(m) && chain(m) && ready(m) && test(m.reach, s)) || null;
}

// A save that did the Minors as the single lesson of the first version: the whole course counts as done.
// -> the flags and grimoire lessons to set (empty when there is nothing to do)
export function oldCourse(s) {
  if (!s.flags?.['lesson.minors'] || LESSONS_MINORS.every((n) => s.flags[flagOf(n)])) return { flags: [], lessons: [] };
  return { flags: LESSONS_MINORS.map(flagOf).filter((k) => !s.flags[k]), lessons: LESSONS_MINORS.map((n) => `minors${n}`).filter((k) => !s.lessons?.[k]) };
}

// An announcement is a short scene that waits for her tap: it must not come up where the story has
// business with her. Not while she is at, or a few steps from, the place of the current main step (the
// person there must be free to talk), nor at the place of a lesson that is waiting for her.
//   near: the anchor she stands at;  pos { map, x, y } and anchors { id: { map, x, y } }: for the distance
export const KEEP_AWAY = 8; // tiles
export function canAnnounce({ near = null, stepAt = null, flags = {}, pos = null, anchors = null } = {}, list = LESSON_MISSIONS) {
  const places = [stepAt, ...list.filter((m) => flags[m.offered] && !flags[m.done.flag]).map((m) => m.at)].filter(Boolean);
  if (near && places.includes(near)) return false;
  if (!pos || !anchors) return true;
  return !places.some((id) => { const a = anchors[id]; return !!a && a.map === pos.map && Math.abs(a.x - pos.x) + Math.abs(a.y - pos.y) <= KEEP_AWAY; });
}
