// The effects: each is a recipe (kit, t, dest) that schedules a few soft tones and noises. All short,
// low-passed and gentle: nothing arcade-like. `vary` is a small random detune so repeats do not sound identical.
import { hz } from './theory.js';

const v = (kit, amount = 0.04) => 1 + (kit.R() - 0.5) * amount * 2;

export const SFX = {
  step(k, t, d) { k.noise({ t, dur: 0.07, a: 0.004, gain: 0.13, type: 'lowpass', f: 380 * v(k, 0.2), q: 0.5, dest: d }); },
  tap(k, t, d) {
    k.tone({ f: 520 * v(k), to: 340, t, dur: 0.07, a: 0.002, gain: 0.2, dest: d });
    k.noise({ t, dur: 0.03, a: 0.002, gain: 0.04, type: 'lowpass', f: 1800, dest: d });
  },
  page(k, t, d) { // paper turning: a soft swish and a small flutter at the end
    k.noise({ t, dur: 0.3, a: 0.07, gain: 0.14, type: 'bandpass', f: 1100, to: 2600, q: 0.6, dest: d, tc: 0.07 });
    k.noise({ t: t + 0.22, dur: 0.1, a: 0.01, gain: 0.07, type: 'bandpass', f: 2800, to: 1600, q: 1, dest: d });
  },
  card(k, t, d) { // a card turned: a light flick and a dull tap on the table
    k.noise({ t, dur: 0.08, a: 0.004, gain: 0.12, type: 'highpass', f: 2500, q: 0.5, dest: d });
    k.tone({ f: 190, to: 120, t: t + 0.05, dur: 0.12, a: 0.004, gain: 0.22, dest: d });
  },
  found(k, t, d) { [69, 72, 76, 81].forEach((m, i) => k.voice('bell', m, t + i * 0.1, 0.075, d, 0.35)); },
  pick(k, t, d) { k.voice('bell', 93, t, 0.05, d, 0.28); k.voice('bell', 98, t + 0.06, 0.03, d, 0.22); }, // something small picked up for the grimoire (glue/collect.js): two tiny high notes
  star(k, t, d) { k.voice('bell', 88, t, 0.08, d, 0.5); k.voice('bell', 100, t + 0.07, 0.035, d, 0.3); },
  level(k, t, d) { // warm three notes, then the chord holds
    [[69, 0], [76, 0.2], [81, 0.4]].forEach(([m, dt]) => k.tone({ f: hz(m), t: t + dt, dur: 1.6, a: 0.02, gain: 0.14, type: 'triangle', lp: 2400, dest: d, tc: 0.5 }));
    [73, 76, 81].forEach((m) => k.tone({ f: hz(m), t: t + 0.65, dur: 2.4, a: 0.15, gain: 0.06, type: 'sine', dest: d, tc: 0.7 }));
  },
  right(k, t, d) { [[76, 0], [81, 0.11]].forEach(([m, dt]) => k.tone({ f: hz(m), t: t + dt, dur: 0.5, a: 0.01, gain: 0.14, type: 'triangle', lp: 2600, dest: d, tc: 0.12 })); },
  wrong(k, t, d) { // a low soft thud, never harsh
    k.tone({ f: 135, to: 80, t, dur: 0.32, a: 0.008, gain: 0.3, dest: d, tc: 0.09 });
    k.noise({ t, dur: 0.08, a: 0.005, gain: 0.05, type: 'lowpass', f: 300, dest: d });
  },
  suspicion(k, t, d) { // being noticed: two soft low knocks, no sweep
    [[98, 0], [98, 0.22]].forEach(([f, dt]) => k.tone({ f, to: f * 0.8, t: t + dt, dur: 0.25, a: 0.006, gain: 0.14, type: 'triangle', lp: 420, dest: d, tc: 0.08 }));
  },
  caught(k, t, d) { // two low falling notes and a dull knock
    [[110, 0], [82, 0.28]].forEach(([f, dt]) => k.tone({ f, t: t + dt, dur: 1.2, a: 0.02, gain: 0.14, type: 'triangle', lp: 500, dest: d, tc: 0.3 }));
    k.tone({ f: 100, to: 55, t: t + 0.55, dur: 0.4, a: 0.005, gain: 0.2, dest: d, tc: 0.1 });
  },
  door(k, t, d) { // only the latch: a soft wooden knock (the creaking hinge sounded like a siren)
    k.tone({ f: 120, to: 70, t, dur: 0.2, a: 0.004, gain: 0.12, dest: d, tc: 0.06 });
    k.noise({ t, dur: 0.05, a: 0.004, gain: 0.03, type: 'lowpass', f: 500, dest: d });
  },
  coin(k, t, d) { [[1319, 0], [1760, 0.07]].forEach(([f, dt]) => k.tone({ f, t: t + dt, dur: 0.5, a: 0.002, gain: 0.09, dest: d, tc: 0.09 })); },
  cat(k, t, d) { // Tartufo noticing something: a tiny soft tick (the synthetic meow was unpleasant)
    k.noise({ t, dur: 0.04, a: 0.003, gain: 0.04, type: 'lowpass', f: 900, dest: d });
  },
  purr(k, t, d) { // optional: a cat's purr, a low rumble pulsing at about 24 Hz
    const o = k.ctx.createOscillator(), lp = k.filter('lowpass', 260, 0.7), am = k.gain(0.5), lfo = k.ctx.createOscillator(), lg = k.gain(0.5), g = k.gain(0);
    o.type = 'sawtooth'; o.frequency.value = 55; lfo.frequency.value = 24; lfo.connect(lg); lg.connect(am.gain);
    o.connect(lp); lp.connect(am); am.connect(g); g.connect(d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16, t + 0.3); g.gain.setValueAtTime(0.16, t + 1.1); g.gain.linearRampToValueAtTime(0, t + 1.6);
    o.start(t); lfo.start(t); o.stop(t + 1.7); lfo.stop(t + 1.7);
  },
  fire(k, t, d) { // a soft whoosh and a few crackles
    k.noise({ t, dur: 0.9, a: 0.25, gain: 0.1, type: 'bandpass', f: 400, to: 1100, q: 0.5, dest: d, tc: 0.25 });
    for (let i = 0; i < 7; i++) k.noise({ t: t + 0.1 + k.R() * 0.8, dur: 0.03, a: 0.002, gain: 0.06 * (0.4 + k.R()), type: 'bandpass', f: 1500 + k.R() * 2500, q: 2, dest: d });
  },
  stun(k, t, d) { // a falling, filtered zap with a muffled thump
    k.tone({ f: 880, to: 160, t, dur: 0.4, a: 0.005, gain: 0.14, type: 'triangle', lp: 1500, dest: d, tc: 0.15 });
    k.tone({ f: 95, to: 55, t: t + 0.08, dur: 0.25, a: 0.004, gain: 0.17, dest: d, tc: 0.07 });
  },
  write(k, t, d) { // pen on paper: a few short scratches
    const n = 4 + Math.floor(k.R() * 3); let x = t;
    for (let i = 0; i < n; i++) { const L = 0.05 + k.R() * 0.07; k.noise({ t: x, dur: L, a: 0.012, gain: 0.05, type: 'bandpass', f: 2800 + k.R() * 1200, to: 2200, q: 1.5, dest: d, tc: L / 3 }); x += L + 0.03 + k.R() * 0.05; }
  },
  bell(k, t, d) { // a distant church bell, struck twice, low and long
    k.voice('bell', 55, t, 0.2, d, 1.4); k.voice('bell', 55, t + 2.1, 0.15, d, 1.4);
  },
};
export const SFX_NAMES = Object.keys(SFX);
