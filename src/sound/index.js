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
import { createTracks, cueFor } from './tracks.js';

const TICK = 0.25; // seconds between scheduler runs
let ctx = null, engine = null, timer = null, armed = false, broken = false;
let want = { name: 'title', opts: { tension: 0 } }; // the mood the game asked for (kept until audio can start)
let ducked = false, running = false;
const allow = makeThrottle();
const tracks = createTracks(); // the music is recorded piano (tracks.js); the engine keeps the effects

function start() {
  if (ctx || broken) return;
  try {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) { broken = true; return; }
    ctx = new AC();
    engine = createEngine(ctx, { seed: (Date.now() & 0xffff) || 1 });
    tracks.attach(ctx);
    apply();
    timer = setInterval(tick, TICK * 1000);
    resume();
  } catch (e) { broken = true; ctx = null; engine = null; console.warn('[sound] disabled:', e?.message || e); }
}
function resume() { try { if (ctx && ctx.state !== 'running') ctx.resume?.()?.catch?.(() => {}); } catch { /* ignore */ } }
function onVisible() {
  try { tracks.hidden(document.hidden); } catch { /* ignore */ }
  if (!ctx) return;
  try { if (document.hidden) { hush?.pause?.(); ctx.suspend?.(); } else { ctx.resume?.(); engine?.resync(); } } catch { /* ignore */ }
}
// bring the graph in line with the settings and the wanted mood (called on every change)
function apply() {
  try { tracks.setOn(musicOn(state)); tracks.setDuck(ducked); tracks.setCue(cueFor(want.name, { map: state.pos?.map, chapter: state.chapter, ended: !!state.flags?.['ending.seen'] })); } catch (e) { console.warn('[sound] tracks', e?.message || e); }
  if (!engine) return;
  try {
    engine.setMusicOn(false); engine.setMood(null); running = false;
  } catch (e) { console.warn('[sound]', e?.message || e); }
}
function tick() {
  return; // the generated music is off: nothing to schedule
  // eslint-disable-next-line no-unreachable
  if (!engine || !ctx || ctx.state !== 'running' || !musicOn(state)) return;
  try { engine.pump(ctx.currentTime + lookahead(TICK)); } catch (e) { console.warn('[sound] pump', e?.message || e); }
}

// iPhone: with the ring switch on silent, Web Audio alone stays mute. A media element that is
// playing (two seconds of silence, looped, a file of this page) makes the phone treat the page as
// "playing something", and then the generated sound comes out too. Started inside a gesture.
let hush = null;
function unmute() {
  try {
    if (typeof Audio === 'undefined') return;
    if (!hush) {
      hush = new Audio('silence.wav');
      hush.loop = true; hush.preload = 'auto'; hush.volume = 0.01;
      hush.setAttribute('playsinline', ''); hush.setAttribute('x-webkit-airplay', 'deny');
    }
    if (hush.paused && !document.hidden) hush.play()?.catch?.(() => {});
  } catch { /* ignore */ }
}

// Browsers only start audio inside a gesture, and on a touch screen `pointerdown` does not count:
// the finger has to come up (touchend / pointerup / click). The first such gesture creates the
// context; every later one resumes it if the browser has suspended it again (a call, a tab switch).
function arm() {
  if (armed || typeof window === 'undefined' || !window.addEventListener) return;
  armed = true;
  // iOS 17+: play like a game, also with the ring switch on silent
  try { if (globalThis.navigator?.audioSession) globalThis.navigator.audioSession.type = 'playback'; } catch { /* ignore */ }
  const go = () => { if (!ctx) start(); else resume(); apply(); tracks.gesture(); unmute(); };
  globalThis.document?.addEventListener?.('visibilitychange', onVisible);
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
  setTimeout(apply, 350); // the world reports the new map a moment after asking for its mood
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
on('chapter', () => apply()); // the village changes its piece with the season
on('flag', (e) => { if (e?.k === 'ending.seen') apply(); });
// the music steps back when something else should be heard
on('card:found', () => tracks.dip(0.4, 3.5));
on('level:up', () => tracks.dip(0.4, 3));
on('patrol:seen', () => tracks.dip(0.3, 6));

arm();

// for the harness and for debugging: what the audio side is doing
export const status = () => ({ context: ctx ? ctx.state : null, mood: engine ? engine.mood : null, counts: engine ? { ...engine.counts } : {}, broken, music: musicOn(state), sfx: sfxOn(state) });
