// Sound area entry: importing this registers the services and the bus listeners. It does nothing
// (no AudioContext) until the first tap or key press, never throws if Web Audio is missing, and
// reads state.settings.music / .sfx live, every time. All sound is generated in code.
//
// Services: sound.play(name) · sound.mood(name, { tension }) · sound.stop() · sound.music(on) · sound.sfx(on)
// Bus in: card:found, card:star, level:up, coins, cinema, settings.  What to call from where: notes/sound.md
import { state, save } from '../core/state.js';
import { on, emit } from '../core/bus.js';
import { provide } from '../core/services.js';
import { createEngine } from './engine.js';
import { SFX_NAMES } from './sfx.js';
import { MOOD_NAMES } from './moods.js';
import { musicOn, sfxOn, makeThrottle, wantsMood } from './gate.js';
import { lookahead } from './theory.js';

const TICK = 0.25; // seconds between scheduler runs
let ctx = null, engine = null, timer = null, armed = false, broken = false;
let want = { name: 'title', opts: { tension: 0 } }; // the mood the game asked for (kept until audio can start)
let ducked = false, running = false;
const allow = makeThrottle();

function start() {
  if (ctx || broken) return;
  try {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) { broken = true; return; }
    ctx = new AC();
    engine = createEngine(ctx, { seed: (Date.now() & 0xffff) || 1 });
    document.addEventListener('visibilitychange', onVisible);
    apply();
    timer = setInterval(tick, TICK * 1000);
    resume();
  } catch (e) { broken = true; ctx = null; engine = null; console.warn('[sound] disabled:', e?.message || e); }
}
function resume() { try { if (ctx && ctx.state !== 'running') ctx.resume?.()?.catch?.(() => {}); } catch { /* ignore */ } }
function onVisible() {
  if (!ctx) return;
  try { if (document.hidden) ctx.suspend?.(); else { ctx.resume?.(); engine?.resync(); } } catch { /* ignore */ }
}
// bring the graph in line with the settings and the wanted mood (called on every change)
function apply() {
  if (!engine) return;
  try {
    const m = musicOn(state);
    engine.setMusicOn(m);
    if (m && !running) engine.resync();
    running = m;
    engine.setDuck(ducked);
    if (m && want.name) engine.setMood(want.name, want.opts); else if (!m) engine.setMood(null);
  } catch (e) { console.warn('[sound]', e?.message || e); }
}
function tick() {
  if (!engine || !ctx || ctx.state !== 'running' || !musicOn(state)) return;
  try { engine.pump(ctx.currentTime + lookahead(TICK)); } catch (e) { console.warn('[sound] pump', e?.message || e); }
}

// Browsers only start audio inside a gesture, and on a touch screen `pointerdown` does not count:
// the finger has to come up (touchend / pointerup / click). The first such gesture creates the
// context; every later one resumes it if the browser has suspended it again (a call, a tab switch).
function arm() {
  if (armed || typeof window === 'undefined' || !window.addEventListener) return;
  armed = true;
  // iOS 17+: play like a game, also with the ring switch on silent
  try { if (globalThis.navigator?.audioSession) globalThis.navigator.audioSession.type = 'playback'; } catch { /* ignore */ }
  const go = () => { if (!ctx) start(); else resume(); };
  for (const ev of ['touchend', 'pointerup', 'click', 'keydown']) window.addEventListener(ev, go, { capture: true, passive: true });
}

export function play(name) {
  try {
    if (!engine || !sfxOn(state) || !SFX_NAMES.includes(name)) return;
    if (!allow(name, performance.now())) return;
    resume(); engine.sfx(name);
  } catch (e) { console.warn('[sound] play', name, e?.message || e); }
}
export function mood(name, opts) {
  const w = wantsMood(name, opts, MOOD_NAMES);
  if (!w) { console.warn(`[sound] unknown mood "${name}"`); return; }
  want = w; apply();
}
export function stop() { want = { name: null, opts: {} }; apply(); }
function setSetting(k, v) { state.settings[k] = !!v; save(); apply(); emit('settings', state.settings); }

provide('sound.play', (name) => { play(name); return Promise.resolve(); });
provide('sound.mood', (name, opts) => { mood(name, opts); return Promise.resolve(); });
provide('sound.stop', () => { stop(); return Promise.resolve(); });
provide('sound.music', (v) => { setSetting('music', v); return Promise.resolve(); });
provide('sound.sfx', (v) => { setSetting('sfx', v); return Promise.resolve(); });

on('settings', () => apply());
on('card:found', () => play('found'));
on('card:star', () => play('star'));
on('level:up', () => play('level'));
on('coins', (e) => { if (!e || !(e.n < 0)) play('coin'); }); // spending (n < 0) stays silent
on('cinema', (v) => { ducked = !!v; apply(); });
// 'chapter': nothing, on purpose

arm();

// for the harness and for debugging: what the audio side is doing
export const status = () => ({ context: ctx ? ctx.state : null, mood: engine ? engine.mood : null, counts: engine ? { ...engine.counts } : {}, broken, music: musicOn(state), sfx: sfxOn(state) });
