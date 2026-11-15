// The music and its direction. Recorded piano and chamber pieces (public domain, Musopen; credits in
// docs/CREDITS.md), chosen by a cue sheet: where she is (open air or a room), the chapter, and what
// she is doing (a session with the Reader, a reading, an Exam). A cue is a piece, a level and how
// slowly it comes in; a cue without a piece is silence. Pieces cross-fade, remember where they were,
// and the whole music dips for a moment when something else should be heard.
//
// Two media elements ("decks") take turns, each through its own gain node of the game's
// AudioContext when there is one (the only way to set a level on an iPhone, which ignores
// element.volume); without a context the element's own volume is stepped instead.

export const MASTER = 1.25; // the files are quiet (-24 LUFS): a winter night in the village ends near -27

// piece, level (0..1, before MASTER), seconds to come in
const cue = (t, v = 0.6, fade = 2.6) => ({ t, v, fade });
export const SILENCE = { t: null, v: 0, fade: 2.4 };

// what plays for a mood the game asks for; place moods are refined by the map and the chapter
export function cueFor(mood, { map = null, chapter = 0, ended = false } = {}) {
  switch (mood) {
    case 'title': return cue('gymnopedie', 0.75, 2);
    case 'session': return cue('goldberg', 0.55, 3); // the Reader's table: close and quiet
    case 'reading': return cue('clairdelune', 0.55, 3);
    case 'exam': return cue('elegie', 0.7, 0.7); // it comes in at once
    case 'ending': return cue('nocturne', 0.85, 3.5);
    case 'village': case 'forest': case 'depths': break;
    default: return SILENCE;
  }
  // rooms: warmer, lower; the court says nothing at all
  if (map === 'court') return SILENCE;
  if (map === 'malva' || map === 'cottage') return cue('consolation', 0.42, 2.2);
  if (map === 'shop') return cue('gymnopedie', 0.32, 2.2);
  if (map === 'meeting') return cue('pavane', 0.34, 2.2);
  if (map === 'depths' || mood === 'depths') return cue('pavane', 0.5, 3.2);
  if (map === 'forest' || mood === 'forest') return cue('reverie', chapter >= 3 ? 0.46 : 0.58, 3.2);
  // the village, by season
  if (ended || chapter >= 4) return cue('air', 0.6, 3.5); // the dawn after the trial
  if (chapter === 2) return cue('swan', 0.52, 3.2); // spring
  if (chapter >= 3) return cue('moonlight', 0.42, 3.2); // autumn, before the trial: lower
  return cue('moonlight', 0.56, 3.2); // winter nights
}

const OUT = 2.2; // seconds a piece takes to leave

export function createTracks({ make = () => (typeof Audio !== 'undefined' ? new Audio() : null), url = (id) => `music/${id}.mp3`, doc = globalThis.document, timers = globalThis } = {}) {
  let ctx = null, bus = null, wired = false;
  let on = true, wantCue = SILENCE, active = null, dipT = 0, ducked = false, dipped = 1;
  const pos = {};
  const decks = [0, 1].map(() => ({ el: null, gain: null, id: null, level: 0, stopT: 0, stepT: 0, unlocked: false }));
  const busLevel = () => MASTER * (ducked ? 0.6 : 1) * dipped;

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
  // level of one deck, reached in `secs`
  function ramp(d, to, secs) {
    d.level = to;
    timers.clearInterval(d.stepT);
    if (d.gain && ctx) {
      const g = d.gain.gain, now = ctx.currentTime;
      try { g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(to, now + Math.max(0.05, secs)); } catch { g.value = to; }
      return;
    }
    if (!d.el) return;
    // no context: step the element's own volume (does nothing on an iPhone)
    const from = Number(d.el.volume) || 0, n = Math.max(1, Math.round(secs * 20)); let i = 0;
    d.stepT = timers.setInterval(() => {
      i += 1;
      try { d.el.volume = Math.max(0, Math.min(1, from + ((to * busLevel()) - from) * (i / n))); } catch { /* ignore */ }
      if (i >= n) timers.clearInterval(d.stepT);
    }, 50);
  }
  function setBus(secs = 0.6) {
    if (!bus || !ctx) { for (const d of decks) if (d.el && d.id && !d.gain) ramp(d, d.level, secs); return; }
    const g = bus.gain, now = ctx.currentTime;
    try { g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(busLevel(), now + secs); } catch { g.value = busLevel(); }
  }
  const play = (d) => { try { const p = d.el.play(); p?.then?.(() => { d.unlocked = true; })?.catch?.(() => {}); } catch { /* ignore */ } };
  function leave(d, secs = OUT) {
    if (!d?.el || !d.id) return;
    const id = d.id;
    ramp(d, 0, secs);
    timers.clearTimeout(d.stopT);
    d.stopT = timers.setTimeout(() => { if (d.id === id && d.level === 0) { pos[id] = d.el.currentTime || 0; try { d.el.pause(); } catch { /* ignore */ } d.id = null; } }, secs * 1000 + 80);
  }
  function enter(d, c) {
    if (!elOf(d)) return;
    timers.clearTimeout(d.stopT);
    if (d.id !== c.t) {
      if (d.id) pos[d.id] = d.el.currentTime || 0;
      d.id = c.t; d.el.src = url(c.t);
      const at = pos[c.t] || 0;
      if (at > 1) { const seek = () => { try { d.el.currentTime = at; } catch { /* ignore */ } d.el.removeEventListener?.('loadedmetadata', seek); }; d.el.addEventListener?.('loadedmetadata', seek); }
      if (d.gain && ctx) { try { d.gain.gain.cancelScheduledValues(ctx.currentTime); d.gain.gain.setValueAtTime(0, ctx.currentTime); } catch { /* ignore */ } } else { try { d.el.volume = 0; } catch { /* ignore */ } }
    }
    if (!doc?.hidden && d.el.paused) play(d);
    ramp(d, c.v, c.fade);
  }
  function sync() {
    const c = on ? wantCue : SILENCE;
    if (!c.t) { for (const d of decks) leave(d, c.fade || OUT); active = null; return; }
    if (active && active.id === c.t) { enter(active, c); return; } // same piece: only its level moves
    const other = decks.find((d) => d !== active && d.id === c.t) || decks.find((d) => d !== active) || decks[0];
    if (active) leave(active, Math.max(OUT, c.fade));
    active = other;
    enter(active, c);
  }

  return {
    // the game's AudioContext, once a gesture has created it: from here on levels are real gains
    attach(audioCtx) {
      if (ctx || !audioCtx?.createMediaElementSource) return;
      try { ctx = audioCtx; bus = ctx.createGain(); bus.gain.value = busLevel(); bus.connect(ctx.destination); for (const d of decks) { timers.clearInterval(d.stepT); wire(d); } } catch { ctx = null; bus = null; }
    },
    setCue(c) { wantCue = c && c.t ? c : SILENCE; sync(); },
    setOn(v) { if (on === !!v) return; on = !!v; sync(); },
    setDuck(v) { if (ducked === !!v) return; ducked = !!v; setBus(0.8); },
    // step back for a moment (a card found, a patrol close by), then come back slowly
    dip(to = 0.45, secs = 3) { dipped = to; setBus(0.35); timers.clearTimeout(dipT); dipT = timers.setTimeout(() => { dipped = 1; setBus(1.8); }, secs * 1000); },
    // inside every tap: a phone lets an element play only after a first play in a gesture
    gesture() {
      for (const d of decks) {
        if (!elOf(d) || d.unlocked) continue;
        if (d.id) { play(d); continue; }
        try { d.el.src = 'silence.wav'; } catch { /* ignore */ } // the idle deck: unlocked on silence
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
