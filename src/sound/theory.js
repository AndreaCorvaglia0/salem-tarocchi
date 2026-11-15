// Pure music maths for the sound area: scales, the game's one motif and its variants, tension and
// scheduling helpers. No Web Audio, no DOM: tests/sound.theory.test.mjs runs it in Node.

export const MODES = {
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  minpenta: [0, 3, 5, 7, 10],
  majpenta: [0, 2, 4, 7, 9],
  major: [0, 2, 4, 5, 7, 9, 11],
};

export const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
export const lerp = (a, b, k) => a + (b - a) * Math.max(0, Math.min(1, k));
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Deterministic random numbers (mulberry32): same seed, same music.
export const prng = (seed = 1) => {
  let a = seed >>> 0 || 1;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};
export const between = (rng, [lo, hi]) => lo + rng() * (hi - lo);
export const pick = (rng, list) => list[Math.floor(rng() * list.length) % list.length];

// A scale degree (any integer, negative too) to a midi note: degree 0 is the root, the scale repeats per octave.
export function scaleNote(root, mode, degree) {
  const s = MODES[mode] || MODES.aeolian, n = s.length;
  const oct = Math.floor(degree / n), i = ((degree % n) + n) % n;
  return root + oct * 12 + s[i];
}
// The scale note closest to a midi note (ties go down).
export function snapToScale(root, mode, midi) {
  const s = MODES[mode] || MODES.aeolian;
  let best = midi, d = 99;
  for (let o = -3; o <= 3; o++) for (const x of s) { const m = root + o * 12 + x; if (Math.abs(m - midi) < d || (Math.abs(m - midi) === d && m < best)) { d = Math.abs(m - midi); best = m; } }
  return best;
}

// The motif: semitones above the root, length in beats. A, C, E ... D, C, back to A. It is the same
// tune everywhere; the minor third is what makes it Salem, the major third (ENDING) is the resolution.
export const MOTIF = {
  minor: [[0, 1], [3, 1], [7, 2], [5, 1], [3, 1], [0, 3]],
  major: [[0, 1], [4, 1], [7, 2], [5, 1], [4, 1], [0, 4]],
};
// Variants: which notes, how far to shift, how much slower.
export const VARIANTS = {
  full: { from: 0, to: 6, shift: 0, slow: 1 },
  head: { from: 0, to: 3, shift: 0, slow: 1 },
  tail: { from: 2, to: 6, shift: 0, slow: 1.2 },
  low: { from: 0, to: 6, shift: -12, slow: 1.3 },
  high: { from: 0, to: 4, shift: 12, slow: 0.9 },
  slow: { from: 0, to: 6, shift: 0, slow: 1.6 },
  broken: { from: 0, to: 6, shift: 0, slow: 1.1, drop: 1 }, // one note missing: the "slightly unsettling" one
};
// -> [{ t (seconds from start), midi, dur (seconds, to ring), last }]; beat is seconds per beat.
export function motifNotes(kind = 'minor', variant = 'full', root = 57, beat = 0.9, rng = null) {
  const v = VARIANTS[variant] || VARIANTS.full, src = (MOTIF[kind] || MOTIF.minor).slice(v.from, v.to);
  let t = 0; const out = [];
  src.forEach(([semi, beats], i) => {
    const dur = beats * beat * v.slow;
    const skip = v.drop && rng && i === v.drop + 1 && rng() < 0.7;
    if (!skip) out.push({ t, midi: root + semi + v.shift, dur, last: i === src.length - 1 });
    t += dur;
  });
  out.length && (out[out.length - 1].last = true);
  return out;
}
export const motifLength = (notes) => (notes.length ? notes[notes.length - 1].t + notes[notes.length - 1].dur : 0);

// The exam's heartbeat: seconds between beats at a tension 0..1 (it speeds up as suspicion rises).
export const pulseInterval = (tension = 0) => lerp(1.05, 0.36, tension);
// How far ahead the scheduler fills, given the timer period (it must cover at least two ticks).
export const lookahead = (tickSec) => Math.max(1.2, tickSec * 3);
