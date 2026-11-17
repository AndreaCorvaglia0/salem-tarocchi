// The ambience bed: a third layer under the music. Real recordings of a place (night wood, wind, a
// fire, rain, running water; credits in docs/CREDITS.md), short seamless loops. `bedFor` is the cue
// sheet (which loop, how loud) and `createBeds` plays it with two looping media elements ("decks")
// that cross-fade, wired exactly like the music decks in tracks.js: through gain nodes of the game's
// AudioContext when there is one (an iPhone ignores element.volume), stepped element volume without.
// The same two rules apply as for the music: the music setting switches it off, and nothing starts
// until a tap has unlocked the elements (gesture()).

export const BED_MASTER = 1.25; // the loops sit about 10 LU under the music (-34 LUFS against -24)

const bed = (t, v = 0.5, fade = 3) => ({ t, v, fade });
export const NONE = { t: null, v: 0, fade: 2.4 };
export const LOOPS = ['wind', 'fire', 'rain', 'stream'];
// (a night-wood loop was planned too, but the only free recordings found were refused by the network:
// notes/sound.md. When one exists: add it here and make the forest default below use it.)

// where in the forest a sound belongs: [x, y, radius in tiles, loop, level]
export const FOREST_SPOTS = [
  [15, 32, 6, 'fire', 0.85], // the campfire clearing
  [27, 21, 6, 'stream', 0.8], // the mill on the brook
  [18, 15, 5, 'stream', 0.7], // the pond
  [28, 5, 5, 'stream', 0.8], // the spring
  [15, 6, 6, 'wind', 0.9], // the graveyard: only the wind
];

// what is heard under the music for a mood the game asks for (same arguments as cueFor, plus the
// player's tile). Sessions, readings, exams, the title and the ending have no bed; the court and the
// cellars are silent places.
export function bedFor(mood, { map = null, chapter = 0, ended = false, x = null, y = null } = {}) {
  // the smoke rite: the fire leads while she searches, and stays low under the air she lit
  if (mood === 'rite') return bed('fire', 0.7, 1.5);
  if (typeof mood === 'string' && mood.startsWith('air.')) return bed('fire', 0.22, 3);
  if (mood !== 'village' && mood !== 'forest' && mood !== 'depths') return NONE;
  if (map === 'court' || map === 'depths' || mood === 'depths') return NONE;
  if (map === 'malva' || map === 'cottage') return bed('fire', 0.55, 2.5); // a hearth in the house
  if (map === 'shop' || map === 'meeting') return NONE;
  if (map === 'forest' || mood === 'forest') {
    if (Number.isFinite(x) && Number.isFinite(y)) {
      for (const [sx, sy, r, id, v] of FOREST_SPOTS) if (Math.hypot(x - sx, y - sy) <= r) return bed(id, v, 3.5);
    }
    return bed('wind', 1, 3.5); // the wood breathes: the bed leads, the music is low
  }
  // the village, by season
  if (ended || chapter >= 4) return bed('wind', 0.3, 4); // the dawn after the trial
  if (chapter >= 3) return bed('rain', 0.5, 4); // autumn, before the trial
  return bed('wind', 0.42, 4); // winter nights and spring: a light wind
}

export function createBeds({ make = () => (typeof Audio !== 'undefined' ? new Audio() : null), url = (id) => `ambience/${id}.mp3`, doc = globalThis.document, timers = globalThis } = {}) {
  let ctx = null, bus = null, wired = false;
  let on = true, want = NONE, active = null, ducked = false;
  const decks = [0, 1].map(() => ({ el: null, gain: null, id: null, level: 0, stopT: 0, stepT: 0, unlocked: false }));
  const busLevel = () => BED_MASTER * (ducked ? 0.6 : 1);

  function wire(d) {
    if (!ctx || d.gain || !d.el) return;
    try {
      const src = ctx.createMediaElementSource(d.el);
      d.gain = ctx.createGain(); d.gain.gain.value = d.level;
      src.connect(d.gain); d.gain.connect(bus);
      try { d.el.volume = 1; } catch { /* ignore */ }
      wired = true;
    } catch { d.gain = null; }
  }
  const elOf = (d) => {
    if (d.el) return d.el;
    d.el = make();
    if (!d.el) return null;
    d.el.loop = true; d.el.preload = 'auto';
    d.el.setAttribute?.('playsinline', ''); d.el.setAttribute?.('x-webkit-airplay', 'deny');
    try { d.el.volume = 0; } catch { /* read-only on some phones */ }
    if (ctx) wire(d);
    return d.el;
  };
  function ramp(d, to, secs) {
    d.level = to;
    timers.clearInterval(d.stepT);
    if (d.gain && ctx) {
      const g = d.gain.gain, now = ctx.currentTime;
      try { g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(to, now + Math.max(0.05, secs)); } catch { g.value = to; }
      return;
    }
    if (!d.el) return;
    const from = Number(d.el.volume) || 0, n = Math.max(1, Math.round(secs * 20)); let i = 0;
    d.stepT = timers.setInterval(() => {
      i += 1;
      try { d.el.volume = Math.max(0, Math.min(1, from + ((to * busLevel()) - from) * (i / n))); } catch { /* ignore */ }
      if (i >= n) timers.clearInterval(d.stepT);
    }, 50);
  }
  function setBus(secs = 0.8) {
    if (!bus || !ctx) { for (const d of decks) if (d.el && d.id && !d.gain) ramp(d, d.level, secs); return; }
    const g = bus.gain, now = ctx.currentTime;
    try { g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(busLevel(), now + secs); } catch { g.value = busLevel(); }
  }
  const play = (d) => { try { const p = d.el.play(); p?.then?.(() => { d.unlocked = true; })?.catch?.(() => {}); } catch { /* ignore */ } };
  function leave(d, secs) {
    if (!d?.el || !d.id) return;
    const id = d.id;
    ramp(d, 0, secs);
    timers.clearTimeout(d.stopT);
    d.stopT = timers.setTimeout(() => { if (d.id === id && d.level === 0) { try { d.el.pause(); } catch { /* ignore */ } d.id = null; } }, secs * 1000 + 80);
  }
  function enter(d, c) {
    if (!elOf(d)) return;
    timers.clearTimeout(d.stopT);
    if (d.id !== c.t) {
      d.id = c.t; d.el.loop = true; d.el.src = url(c.t);
      if (d.gain && ctx) { try { d.gain.gain.cancelScheduledValues(ctx.currentTime); d.gain.gain.setValueAtTime(0, ctx.currentTime); } catch { /* ignore */ } } else { try { d.el.volume = 0; } catch { /* ignore */ } }
    }
    if (!doc?.hidden && d.el.paused) play(d);
    ramp(d, c.v, c.fade);
  }
  function sync() {
    const c = on ? want : NONE;
    if (!c.t) { for (const d of decks) leave(d, c.fade || NONE.fade); active = null; return; }
    if (active && active.id === c.t) { enter(active, c); return; } // same loop: only its level moves
    const other = decks.find((d) => d !== active && d.id === c.t) || decks.find((d) => d !== active) || decks[0];
    if (active) leave(active, Math.max(2.2, c.fade));
    active = other;
    enter(active, c);
  }

  return {
    attach(audioCtx) {
      if (ctx || !audioCtx?.createMediaElementSource) return;
      try { ctx = audioCtx; bus = ctx.createGain(); bus.gain.value = busLevel(); bus.connect(ctx.destination); for (const d of decks) { timers.clearInterval(d.stepT); wire(d); } } catch { ctx = null; bus = null; }
    },
    setCue(c) { want = c && c.t ? c : NONE; sync(); },
    setOn(v) { if (on === !!v) return; on = !!v; sync(); },
    setDuck(v) { if (ducked === !!v) return; ducked = !!v; setBus(0.8); },
    // inside every tap: a phone lets an element play only after a first play in a gesture
    gesture() {
      for (const d of decks) {
        if (!elOf(d) || d.unlocked) continue;
        if (d.id) { play(d); continue; }
        try { d.el.src = 'silence.wav'; d.el.loop = true; } catch { /* ignore */ } // the idle deck: unlocked on silence
        play(d);
      }
      if (active?.el?.paused && on && !doc?.hidden) play(active);
    },
    hidden(h) { for (const d of decks) { if (!d.el) continue; if (h) { try { d.el.pause(); } catch { /* ignore */ } } else if (d.id && d.level > 0 && on) play(d); } },
    get track() { return active?.id || null; },
    get level() { return active?.level || 0; },
    get wired() { return wired; },
  };
}
