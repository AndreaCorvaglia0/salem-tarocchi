// The thin layer over Web Audio: small helpers (tone, noise, filter, envelope) and the note voices.
// It only calls the AudioContext API, so tests give it a fake context and the harness an
// OfflineAudioContext. Nothing here knows about the game.
import { prng, hz } from './theory.js';

// partials: [ratio, amplitude, share of ring time]; attack and ring in seconds
export const VOICES = {
  bell: { attack: 0.012, ring: 5, partials: [[1, 1, 1], [2, 0.28, 0.55], [2.76, 0.22, 0.4], [5.4, 0.06, 0.15]] },
  box: { attack: 0.005, ring: 2.8, partials: [[1, 1, 1], [2, 0.3, 0.5], [3, 0.1, 0.3], [4.2, 0.05, 0.15]] }, // music box
  pluck: { attack: 0.01, ring: 2.0, partials: [[1, 1, 1], [2.01, 0.2, 0.35], [3.02, 0.08, 0.2], [5.6, 0.03, 0.08]] }, // dulcimer-ish
  glass: { attack: 0.18, ring: 4.2, partials: [[1, 0.8, 1], [1.0017, 0.6, 1], [2, 0.1, 0.55]] }, // warm, slightly beating
};

export function makeKit(ctx, seed = 7) {
  const R = prng(seed), sr = ctx.sampleRate || 44100;
  const noiseBuf = ctx.createBuffer(1, Math.floor(sr * 2), sr);
  { const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
  let nCount = 0;
  const gain = (v = 1) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const filter = (type, f, q = 0.7) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
  const now = () => ctx.currentTime;

  // an enveloped sound: rise to `peak` over `a`, then fall with time constant tc, ending at t + dur
  function envelope(g, t, peak, a, dur, tc) {
    const p = g.gain;
    p.setValueAtTime(0, t); p.linearRampToValueAtTime(peak, t + Math.max(0.002, a));
    p.setTargetAtTime(0, t + a, tc ?? Math.max(0.01, (dur - a) / 6));
  }
  // a tone: { f, to?, t, dur, a, gain, type, dest, tc, lp?, detune? } -> { osc, gain }
  function tone({ f, to, t, dur = 0.3, a = 0.005, gain: peak = 0.2, type = 'sine', dest, tc, lp, detune = 0 }) {
    const o = ctx.createOscillator(), g = gain(0);
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (to && to !== f) o.frequency.exponentialRampToValueAtTime(to, t + dur * 0.9);
    if (detune) o.detune.value = detune;
    envelope(g, t, peak, a, dur, tc);
    let tail = o; if (lp) { const l = filter('lowpass', lp, 0.5); o.connect(l); tail = l; }
    tail.connect(g); g.connect(dest);
    o.start(t); o.stop(t + dur + 0.05);
    return { osc: o, gain: g };
  }
  // filtered noise: { t, dur, a, gain, type, f, to?, q, dest, tc }
  function noise({ t, dur = 0.2, a = 0.01, gain: peak = 0.1, type = 'bandpass', f = 1000, to, q = 1, dest, tc }) {
    const s = ctx.createBufferSource(), fl = filter(type, f, q), g = gain(0);
    s.buffer = noiseBuf; s.loop = true;
    if (to) { fl.frequency.setValueAtTime(f, t); fl.frequency.exponentialRampToValueAtTime(to, t + dur * 0.9); }
    envelope(g, t, peak, a, dur, tc);
    s.connect(fl); fl.connect(g); g.connect(dest);
    s.start(t, (nCount++ * 0.37) % 1.5); s.stop(t + dur + 0.05);
    return { src: s, gain: g };
  }
  // a note in one of the voices (additive partials, each with its own decay)
  function voice(name, midi, t, level, dest, ring = 1) {
    const v = VOICES[name] || VOICES.bell, f0 = hz(midi), T = v.ring * ring;
    for (const [ratio, amp, share] of v.partials) {
      const f = f0 * ratio; if (f > 5200) continue; // no harsh highs
      tone({ f, t, dur: T * share + 0.2, a: v.attack, gain: level * amp, dest, tc: (T * share) / 5 });
    }
  }
  // a sustained pad voice: a soft body and a quieter saw, slowly detuned, with attack and release
  function pad({ midi, t, dur, attack = 4, level, wave = 'triangle', dest }) {
    const f = hz(midi), rel = Math.min(8, dur * 0.4), g = gain(0), saw = wave === 'sawtooth';
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g2 = gain(saw ? 0.5 : 0.18);
    o1.type = saw ? 'triangle' : wave; o2.type = 'sawtooth'; o1.frequency.value = f; o2.frequency.value = f;
    o1.detune.setValueAtTime(-6, t); o1.detune.linearRampToValueAtTime(4, t + dur);
    o2.detune.setValueAtTime(7, t); o2.detune.linearRampToValueAtTime(-5, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + attack);
    g.gain.setValueAtTime(level, t + Math.max(attack, dur - rel)); g.gain.linearRampToValueAtTime(0, t + dur);
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(dest);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
  }
  return { ctx, gain, filter, tone, noise, voice, pad, now, noiseBuf, R };
}

// a short generated reverb tail (stereo noise, darker as it fades)
export function makeImpulse(ctx, seconds = 2.8, seed = 11) {
  const R = prng(seed), sr = ctx.sampleRate || 44100, len = Math.floor(sr * seconds), ir = ctx.createBuffer(2, len, sr);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c); let lp = 0;
    for (let i = 0; i < len; i++) { const t = i / sr, k = Math.min(0.97, 0.35 + t * 0.2); lp = lp * k + (R() * 2 - 1) * (1 - k); d[i] = t < 0.02 ? 0 : lp * Math.exp(-t / 0.6) * 3; }
  }
  return ir;
}
