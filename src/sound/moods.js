// The moods as data. plan.js reads them and decides when things happen; engine.js makes the sound.
// All moods share one family of keys (A minor and its relatives) so a cross-fade never clashes.
//   pad    sustained chords: every [min,max] s, each lasting dur s, chords = semitone lists over root+oct
//   drone  one low sustained note, overlapping itself; saw=true makes it darker
//   mel    a sparse line: a random walk over the scale; gap seconds between ticks, p chance a tick sounds
//   motif  the game's theme, every [min,max] s, first one at `first`
//   pulse  the exam's heartbeat; spark: a faint high note, only with tension
export const MOODS = {
  title: {
    root: 57, mode: 'aeolian', lp: 1800, hall: 0.9, level: 1, beat: 1.0,
    pad: { every: [9, 14], dur: 16, attack: 5, oct: -12, chords: [[0, 7], [0, 7, 12], [-2, 5, 10]], vel: 0.7, wave: 'sine' },
    motif: { every: [18, 28], first: 1.5, voice: 'box', vel: 0.9, kind: 'minor', variants: ['full', 'full', 'slow'] },
    mel: { voice: 'box', gap: [7, 12], p: 0.35, span: [2, 8], step: 2, vel: 0.35, rest: 0.1 },
  },
  village: {
    root: 57, mode: 'aeolian', lp: 1500, hall: 1, level: 1, beat: 0.95,
    drone: { midi: 33, dur: 26, vel: 0.9, saw: true },
    pad: { every: [14, 22], dur: 24, attack: 7, oct: -12, chords: [[0, 7], [0, 5], [-2, 7]], vel: 0.45, wave: 'sine' },
    mel: { voice: 'box', gap: [4.5, 9], p: 0.5, span: [-1, 7], step: 2, vel: 0.5, rest: 0.25 },
    motif: { every: [40, 70], first: 7, voice: 'box', vel: 0.8, kind: 'minor', variants: ['full', 'head', 'tail', 'low'] },
  },
  forest: {
    root: 57, mode: 'dorian', lp: 2400, hall: 0.8, level: 1, beat: 0.7,
    pad: { every: [10, 15], dur: 14, attack: 4, oct: -12, chords: [[0, 7, 12], [5, 12, 16], [0, 9, 14]], vel: 0.5, wave: 'triangle' },
    mel: { voice: 'pluck', gap: [1.8, 4.2], p: 0.65, span: [0, 9], step: 2, vel: 0.5, rest: 0.18 },
    motif: { every: [30, 50], first: 5, voice: 'pluck', vel: 0.8, kind: 'minor', variants: ['full', 'high', 'head'] },
  },
  depths: {
    root: 45, mode: 'phrygian', lp: 700, hall: 1.2, level: 1, beat: 1.4,
    drone: { midi: 28, dur: 30, vel: 1, saw: true },
    pad: { every: [16, 24], dur: 26, attack: 9, oct: -12, chords: [[0, 7], [0, 6], [1, 7]], vel: 0.35, wave: 'sine' },
    mel: { voice: 'bell', gap: [14, 26], p: 0.45, span: [-3, 2], step: 1, vel: 0.35, rest: 0.3 },
    motif: { every: [80, 130], first: 22, voice: 'bell', vel: 0.5, kind: 'minor', variants: ['low', 'tail'] },
  },
  session: {
    root: 57, mode: 'aeolian', lp: 1700, hall: 1.1, level: 1, beat: 0.95,
    pad: { every: [8, 13], dur: 15, attack: 4, oct: -12, chords: [[0, 7, 12], [0, 7, 13], [0, 3, 7]], vel: 0.65, wave: 'triangle' },
    mel: { voice: 'glass', gap: [5, 10], p: 0.5, span: [0, 6], step: 1, vel: 0.5, rest: 0.2 },
    motif: { every: [30, 48], first: 4, voice: 'glass', vel: 0.75, kind: 'minor', variants: ['broken', 'head', 'slow'] },
  },
  exam: {
    root: 57, mode: 'phrygian', lp: 1300, hall: 0.5, level: 1, beat: 0.6,
    drone: { midi: 33, dur: 22, vel: 0.8, saw: true },
    pad: { every: [10, 14], dur: 14, attack: 3, oct: -12, chords: [[0, 7], [0, 6, 12]], tense: [[0, 1, 6], [0, 6, 13]], vel: 0.35, wave: 'triangle' },
    pulse: { vel: 1, root: 33 },
    spark: { gap: [1.2, 2.4], vel: 0.35 },
    mel: null, motif: null,
  },
  reading: {
    root: 60, mode: 'majpenta', lp: 2600, hall: 0.9, level: 1, beat: 0.8,
    pad: { every: [9, 14], dur: 15, attack: 4, oct: -12, chords: [[0, 7, 12], [-3, 4, 9], [0, 4, 9]], vel: 0.55, wave: 'sine' },
    mel: { voice: 'bell', gap: [2.8, 6], p: 0.6, span: [0, 7], step: 2, vel: 0.5, rest: 0.15 },
    motif: { every: [35, 55], first: 5, voice: 'bell', vel: 0.7, kind: 'minor', variants: ['full', 'head'], root: 57 },
  },
  ending: {
    root: 57, mode: 'major', lp: 2400, hall: 1, level: 1, beat: 0.95,
    pad: { every: [9, 13], dur: 16, attack: 4, oct: -12, chords: [[0, 4, 7, 12], [5, 9, 12], [0, 7, 16]], vel: 0.6, wave: 'triangle', first: [[5, 9, 12, 17], [0, 4, 7, 12]] },
    mel: { voice: 'box', gap: [4, 8], p: 0.5, span: [0, 6], step: 1, vel: 0.4, rest: 0.2 },
    motif: { every: [28, 44], first: 2.5, voice: 'box', vel: 0.9, kind: 'major', variants: ['full', 'full', 'head'] },
  },
};
export const MOOD_NAMES = Object.keys(MOODS);
