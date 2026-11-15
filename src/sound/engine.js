// The audio graph, on any AudioContext (live in the game, Offline in the harness, a fake in tests).
// It imports nothing from the game: index.js owns the context, the settings and the bus.
//
//   mood bus -> tone LP -+-> musicIn ---------------+
//                        +-> hall send -> convolver-+   musicIn -> enable -> duck -> master
//   effects -> sfxIn ----+-> small hall -> sfxIn     sfxIn -> sfxLevel -> master
//   master -> compressor -> soft clip (tanh) -> out
//
// pump(until) schedules the notes of the current mood that start before `until`. It is called on a timer
// (live) or once (offline). Nothing is allocated per frame.
import { MOODS } from './moods.js';
import { Planner } from './plan.js';
import { makeKit, makeImpulse } from './kit.js';
import { SFX } from './sfx.js';
import { hz, prng } from './theory.js';

// Every level in one place (linear gains). Modest on purpose: the game is mostly quiet.
export const LEVELS = { master: 0.8, music: 0.9, sfx: 0.85, pad: 0.05, drone: 0.05, note: 0.09, pulse: 0.11, spark: 0.05, hall: 0.5, duck: 0.3 };
export const FADE = 0.5; // time constant of the cross-fade: about two seconds to settle

export function createEngine(ctx, { out = ctx.destination, seed = 1 } = {}) {
  const kit = makeKit(ctx, seed + 6), rng = prng(seed), { gain, filter } = kit;
  const ir = makeImpulse(ctx, 2.8, seed + 10);
  // ---- output chain: master -> compressor -> soft clip
  const curve = new Float32Array(1024); for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh((i / 511.5 - 1) * 1.2) / Math.tanh(1.2) * 0.92;
  const clip = ctx.createWaveShaper(); clip.curve = curve;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 6; comp.attack.value = 0.01; comp.release.value = 0.4;
  const master = gain(LEVELS.master); master.connect(comp); comp.connect(clip); clip.connect(out);
  // ---- music side
  const musicIn = gain(1), enable = gain(1), duck = gain(1), musicLevel = gain(LEVELS.music);
  musicIn.connect(enable); enable.connect(duck); duck.connect(musicLevel); musicLevel.connect(master);
  const hall = ctx.createConvolver(); hall.buffer = ir; const hallRet = gain(LEVELS.hall); hall.connect(hallRet); hallRet.connect(musicIn);
  // ---- effects side (not under the music switch or the duck)
  const sfxIn = gain(1), sfxLevel = gain(LEVELS.sfx), sfxHall = ctx.createConvolver(), sfxSend = gain(0.12), sfxRet = gain(1);
  sfxHall.buffer = ir; sfxIn.connect(sfxLevel); sfxLevel.connect(master); sfxIn.connect(sfxSend); sfxSend.connect(sfxHall); sfxHall.connect(sfxRet); sfxRet.connect(sfxLevel);

  const glide = (param, v, tc, at = ctx.currentTime) => param.setTargetAtTime(v, Math.max(at, ctx.currentTime), tc);
  let cur = null; const old = []; const counts = {};

  function newMood(name, opts) {
    const def = MOODS[name], now = ctx.currentTime;
    const bus = gain(0), lp = filter('lowpass', def.lp, 0.5), send = gain(0.45 * def.hall);
    bus.gain.setValueAtTime(0, now); glide(bus.gain, def.level, FADE, now);
    bus.connect(lp); lp.connect(musicIn); lp.connect(send); send.connect(hall);
    return { name, def, bus, lp, send, planner: new Planner(def, rng, now + 0.15, opts) };
  }
  function retire(m) { glide(m.bus.gain, 0, FADE); old.push({ m, until: ctx.currentTime + 14 }); }

  const api = {
    kit, counts, nodes: { master, musicIn, sfxIn, enable, duck },
    get mood() { return cur ? cur.name : null; },
    // Switch the mood (a cross-fade). The same mood again only updates its options (the exam's tension).
    setMood(name, opts = {}) {
      if (cur && cur.name === name) { cur.planner.setParams(opts); return false; }
      if (cur) retire(cur);
      cur = name && MOODS[name] ? newMood(name, opts) : null;
      return true;
    },
    setMusicOn(on) { glide(enable.gain, on ? 1 : 0, 0.25); },
    setDuck(on) { glide(duck.gain, on ? LEVELS.duck : 1, 0.4); },
    // schedule everything of the current mood starting before `until` (seconds on the context clock)
    pump(until) {
      const now = ctx.currentTime;
      for (let i = old.length - 1; i >= 0; i--) if (now > old[i].until) { try { old[i].m.bus.disconnect(); old[i].m.lp.disconnect(); old[i].m.send.disconnect(); } catch { /* already gone */ } old.splice(i, 1); }
      if (!cur) return 0;
      let n = 0;
      for (const e of cur.planner.until(until)) {
        if (e.t < now - 0.05) continue; // never in the past (after a stall)
        counts[e.type] = (counts[e.type] || 0) + 1; n++;
        const dest = cur.lp;
        if (e.type === 'note') kit.voice(e.voice, e.midi, Math.max(e.t, now), LEVELS.note * e.vel, dest, e.ring);
        else if (e.type === 'pad') kit.pad({ midi: e.midi, t: e.t, dur: e.dur, attack: e.attack, level: LEVELS.pad * e.vel, wave: e.wave, dest });
        else if (e.type === 'drone') kit.pad({ midi: e.midi, t: e.t, dur: e.dur, attack: e.dur * 0.25, level: LEVELS.drone * e.vel, wave: e.saw ? 'sawtooth' : 'sine', dest });
        else if (e.type === 'pulse') for (const [dt, k] of [[0, 1], [0.26, 0.6]]) kit.tone({ f: hz(e.midi + 12), to: hz(e.midi), t: e.t + dt, dur: 0.5, a: 0.02, gain: LEVELS.pulse * e.vel * k, dest, tc: 0.08 });
        else if (e.type === 'spark') kit.voice('glass', e.midi, e.t, LEVELS.spark * e.vel, dest, 0.5);
      }
      return n;
    },
    // restart the planner from now (after a pause or when music comes back on)
    resync() { if (cur) cur.planner = new Planner(cur.def, rng, ctx.currentTime + 0.15, cur.planner.params); },
    sfx(name, at = ctx.currentTime + 0.01) {
      const fn = SFX[name]; if (!fn) return false;
      fn(kit, Math.max(at, ctx.currentTime), sfxIn); return true;
    },
  };
  return api;
}
