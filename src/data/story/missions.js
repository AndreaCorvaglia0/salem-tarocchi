// The lessons offered as missions (docs/DESIGN.md "Il registro delle cose in più"): each is an entry of
// the extras registry (glue/lessons.js adds them to core/extras.js EXTRAS), so it is tracked, shown in
// the grimoire's missions list, and offered to a player who was already past the point where it enters.
//   when:    it is available (the registry shows it from here)      done: the flag its scene sets
//   offer:   the short script that announces it, played once (flag `offered`) as soon as she is free
//   script:  the scene itself, started by the CAST entry at `at`
// Order matters: the flying lesson, then the Minors, then the reversed cards; each opens the next.
// `text` begins with what the lesson is, because the list shows one line until she taps it.
// `now: true` asks the list to mark it as a thing to do now (a lesson, not a rumour to follow one day).
const met = (step) => ({ not: { step } }); // the mistress has already received her (the main scene comes first)

export const LESSON_MISSIONS = [
  { id: 'lesson.fly', kind: 'lesson', now: true, chapter: 1, at: 'village.malva_door',
    text: 'Imparare a volare: Malva mi aspetta davanti a casa sua, sulla strada da cui sono arrivata.',
    when: { power: 'broom' }, done: { flag: 'lesson.fly' }, offer: 'fly.offer', offered: 'fly.offered', script: 'fly.lesson' },
  { id: 'lesson.minors', kind: 'lesson', now: true, chapter: 2, at: 'forest.ortica_hut',
    text: 'Le carte piccole: Ortica mi aspetta alla sua capanna, nel bosco, per spiegarmi come si leggono.',
    when: [{ flag: 'lesson.fly' }, { chapterMin: 2 }, met('c2.ortica')], done: { flag: 'lesson.minors' }, offer: 'minors.offer', offered: 'minors.offered', script: 'minors.lesson' },
  { id: 'lesson.reversed', kind: 'lesson', now: true, chapter: 3, at: 'depths.edera_nook',
    text: 'Le carte capovolte: Nonna Edera mi aspetta nella sua nicchia, in fondo alle cantine.',
    when: [{ flag: 'lesson.minors' }, { chapterMin: 3 }, met('c3.edera')], done: { flag: 'lesson.reversed' }, offer: 'reversed.offer', offered: 'reversed.offered', script: 'reversed.lesson' },
];

// The lesson to announce now: the first that is available, not done and not yet announced (pure: pass
// the state and the condition tester). null when there is none.
export const dueOffer = (s, test, list = LESSON_MISSIONS) => list.find((m) => test(m.when, s) && !test(m.done, s) && !s.flags?.[m.offered]) || null;
// The CAST conditions of a lesson's scene: available and not done.
export const lessonOpen = (id) => { const m = LESSON_MISSIONS.find((x) => x.id === id); return [].concat(m.when, { not: m.done }); };
