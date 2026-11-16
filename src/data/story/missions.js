// The lessons offered as missions (docs/DESIGN.md "Il registro delle cose in più"): each is an entry of
// the extras registry (glue/lessons.js adds them to core/extras.js EXTRAS), so it is tracked, shown in
// the grimoire's missions list, and offered to a player who was already past the point where it enters.
// In order: the flying lesson, the course on the Minors in five small lessons, the reversed cards.
// Availability depends on what she has (the broom, the small cards found, the lesson before), never on
// where she is in the story, except that the teacher must be reachable (`reach`).
//   ready:   what must have happened (a condition), or `minor: n` for the course, whose rule also counts
//            the small cards she has found (glue/lessons.rules.js `minorLessonReady`)
//   reach:   who teaches it can be reached (the mistress has already received her)
//   offer:   the short script that announces it, played once (flag `offered`) when she is free
//   when:    from when the registry lists it: once announced; the two key lessons as soon as they can be done
//   after:   the chain (core/extras.js): fly -> minors 1 -> 2 -> 3 -> 4 -> 5, and the reversed cards after minors 1
//   key:     she needs it to go on: the flying lesson and the four suits
//   script:  the scene itself, started by the CAST entry at `at`;  done: the flag the scene sets
// Which lesson is announced when: glue/lessons.rules.js `dueLesson` (one at a time, in this order).
// `text` begins with what the lesson is, because the list shows one line until she taps it.
// `now: true` asks the list to mark it as a thing to do now (a lesson, not a rumour to follow one day).
const met = (step) => ({ not: { step } }); // the main scene with that mistress comes first
const WOOD = [{ chapterMin: 2 }, met('c2.ortica')];
const CELLARS = [{ chapterMin: 3 }, met('c3.edera')];

const minor = (n, chapter, at, text, reach) => ({ id: `lesson.minors.${n}`, kind: 'lesson', now: true, minor: n, chapter, at, text, reach,
  after: [n === 1 ? 'lesson.fly' : `lesson.minors.${n - 1}`], ...(n === 1 ? { key: true } : {}),
  when: n === 1 ? reach : { flag: `minors.${n}.offered` }, done: { flag: `lesson.minors.${n}` }, offer: `minors.${n}.offer`, offered: `minors.${n}.offered`, script: `minors.${n}.lesson` });

export const LESSON_MISSIONS = [
  { id: 'lesson.fly', kind: 'lesson', now: true, chapter: 1, at: 'village.malva_door',
    text: 'Imparare a volare: Malva mi aspetta davanti a casa sua, sulla strada da cui sono arrivata.',
    key: true, ready: { power: 'broom' }, reach: null, when: { power: 'broom' }, done: { flag: 'lesson.fly' }, offer: 'fly.offer', offered: 'fly.offered', script: 'fly.lesson' },
  minor(1, 2, 'forest.ortica_hut', 'I quattro semi: Ortica mi aspetta alla sua capanna, nel bosco, per spiegarmi le carte piccole.', WOOD),
  minor(2, 2, 'forest.grove', 'Uno, due, tre: nell\'erba alta vicino al bivacco, nel bosco, c\'è qualcosa di Ginepra per me.', WOOD),
  minor(3, 2, 'malva.hearth', 'Quattro, cinque, sei: Malva mi aspetta a casa sua, accanto al focolare, per parlarmi delle carte piccole.', null),
  minor(4, 2, 'forest.ortica_hut', 'Dal sette al dieci: Ortica mi aspetta alla sua capanna, per fare due passi fino al mulino.', WOOD),
  minor(5, 3, 'depths.edera_nook', 'Le figure: Nonna Edera mi aspetta nella sua nicchia, in fondo alle cantine.', CELLARS),
  { id: 'lesson.reversed', kind: 'lesson', now: true, chapter: 3, at: 'depths.edera_nook',
    text: 'Le carte capovolte: Nonna Edera mi aspetta nella sua nicchia, in fondo alle cantine.',
    after: ['lesson.minors.1'], ready: { flag: 'lesson.minors.1' }, reach: CELLARS, when: { flag: 'reversed.offered' }, done: { flag: 'lesson.reversed' }, offer: 'reversed.offer', offered: 'reversed.offered', script: 'reversed.lesson' },
];

// The CAST conditions of a lesson's scene: announced and not done.
export const lessonOpen = (id) => { const m = LESSON_MISSIONS.find((x) => x.id === id); return [{ flag: m.offered }, { not: m.done }]; };
// Ginepra can be met in the wood: before the arrest, and again once the trial is over
export const GINEPRA_FREE = { any: [{ notFlag: 'ginepra.taken' }, { flag: 'trial.won' }, { flag: 'trial.lost' }] };
