// The planner: turns a mood (moods.js) into timed events, a window at a time. Pure: no Web Audio.
// Same rng seed, same music. engine.js asks `until(t1)` on a timer and makes sound from the events.
//
// event types: pad {midi,dur,attack,wave,vel} · drone {midi,dur,vel,saw} · note {voice,midi,vel,ring}
//              pulse {midi,vel} · spark {midi,vel}
import { between, pick, scaleNote, motifNotes, motifLength, pulseInterval, lerp, clamp } from './theory.js';

export class Planner {
  constructor(def, rng, t0 = 0, params = {}) {
    this.def = def; this.rng = rng; this.params = { tension: 0, ...params };
    this.next = { pad: t0 + 0.2, drone: t0, mel: t0 + 2.5 + (def.mel ? between(rng, def.mel.gap) : 0), motif: Infinity, pulse: t0 + 0.4, spark: t0 + 3 };
    if (def.motif) this.next.motif = t0 + def.motif.first;
    if (!def.pad) this.next.pad = Infinity;
    if (!def.drone) this.next.drone = Infinity;
    if (!def.mel) this.next.mel = Infinity;
    if (!def.pulse) this.next.pulse = Infinity;
    if (!def.spark) this.next.spark = Infinity;
    this.padCount = 0; this.deg = def.mel ? Math.round((def.mel.span[0] + def.mel.span[1]) / 2) : 0; this.last = []; this.busyUntil = t0;
  }
  setParams(p) { this.params = { ...this.params, ...p }; }

  // all events that start before t1, in time order
  until(t1) {
    const out = [], layers = ['drone', 'pad', 'motif', 'mel', 'pulse', 'spark'];
    for (let guard = 0; guard < 400; guard++) {
      let k = null, tk = t1;
      for (const l of layers) if (this.next[l] < tk) { tk = this.next[l]; k = l; }
      if (!k) break;
      this[k](tk, out);
    }
    return out.sort((a, b) => a.t - b.t);
  }

  drone(t, out) {
    const d = this.def.drone;
    out.push({ type: 'drone', t, dur: d.dur, midi: d.midi, vel: d.vel, saw: !!d.saw });
    this.next.drone = t + d.dur * 0.72;
  }
  pad(t, out) {
    const d = this.def.pad, tense = d.tense && this.params.tension > 0.55;
    const first = d.first && this.padCount < d.first.length ? d.first[this.padCount] : null;
    const chord = first || pick(this.rng, tense ? d.tense : d.chords);
    for (const s of chord) out.push({ type: 'pad', t, dur: d.dur, attack: d.attack, wave: d.wave, midi: this.def.root + d.oct + s, vel: d.vel / Math.sqrt(chord.length) });
    this.next.pad = t + (first ? 4 : between(this.rng, d.every));
    this.padCount++;
  }
  motif(t, out) {
    const d = this.def.motif, variant = pick(this.rng, d.variants);
    const notes = motifNotes(d.kind, variant, (d.root ?? this.def.root) + 12, this.def.beat, this.rng);
    notes.forEach((n, i) => out.push({ type: 'note', t: t + n.t, voice: d.voice, midi: n.midi, vel: d.vel * (n.last ? 1 : 0.85), ring: n.last ? 1.4 : 1, motif: true, i }));
    this.busyUntil = t + motifLength(notes) + 2.5;
    this.next.motif = t + between(this.rng, d.every);
    if (this.next.mel < this.busyUntil) this.next.mel = this.busyUntil + between(this.rng, this.def.mel?.gap || [2, 4]) * 0.5;
  }
  mel(t, out) {
    const d = this.def.mel, rng = this.rng;
    this.next.mel = t + between(rng, d.gap);
    if (rng() < d.rest) this.next.mel += between(rng, [8, 18]); // a long silence
    if (t < this.busyUntil || rng() > d.p) return;
    const steps = [-2, -1, -1, 0, 1, 1, 2].filter((s) => Math.abs(s) <= d.step);
    let deg = clamp(this.deg + pick(rng, steps), d.span[0], d.span[1]);
    if (this.last.length >= 2 && this.last.every((x) => x === deg)) deg = clamp(deg + (deg * 2 >= d.span[0] + d.span[1] ? -1 : 1), d.span[0], d.span[1]); // never three the same
    this.deg = deg; this.last = [...this.last.slice(-1), deg];
    out.push({ type: 'note', t, voice: d.voice, midi: scaleNote(this.def.root + 12, this.def.mode, deg), vel: d.vel * (0.7 + rng() * 0.3), ring: 1 });
  }
  pulse(t, out) {
    const k = clamp(this.params.tension, 0, 1);
    out.push({ type: 'pulse', t, midi: this.def.pulse.root, vel: this.def.pulse.vel * lerp(0.55, 1, k) });
    this.next.pulse = t + pulseInterval(k);
  }
  spark(t, out) {
    const k = this.params.tension, d = this.def.spark;
    this.next.spark = t + between(this.rng, d.gap) * lerp(2, 0.6, k);
    if (k < 0.35 || this.rng() < 0.3) return;
    out.push({ type: 'spark', t, midi: scaleNote(this.def.root + 24, this.def.mode, pick(this.rng, [0, 1, 4, 5])), vel: d.vel * k });
  }
}
