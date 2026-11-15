// The music: piano recordings (public domain, Musopen), one per mood, played by ONE media element.
// A phone only lets a page start a media element inside a gesture; after that first play the same
// element may change track on its own, so every mood reuses it. Each track remembers where it was,
// so coming back to a place does not start its piece from the first bar again.
// Credits: docs/CREDITS.md.
export const TRACKS = {
  title: 'gymnopedie', // Satie, Gymnopédie n. 1
  village: 'moonlight', // Beethoven, "Al chiaro di luna", Adagio sostenuto
  forest: 'reverie', // Debussy, Rêverie
  depths: 'pavane', // Ravel, Pavane pour une infante défunte
  session: 'goldberg', // Bach, Variazioni Goldberg, Aria
  exam: 'elegie', // Fauré, Élégie op. 24
  reading: 'clairdelune', // Debussy, Clair de lune
  ending: 'nocturne', // Chopin, Notturno op. 9 n. 2
};
export const VOLUME = 0.55, DUCKED = 0.3; // phones with their own volume keys ignore this (iPhone)

export function createTracks({ make = () => (typeof Audio !== 'undefined' ? new Audio() : null), url = (id) => `music/${id}.mp3`, doc = globalThis.document } = {}) {
  let el = null, want = null, on = true, ducked = false, cur = null, unlocked = false;
  const pos = {};
  const ensure = () => {
    if (el) return el;
    el = make();
    if (!el) return null;
    el.loop = true; el.preload = 'auto';
    el.setAttribute?.('playsinline', ''); el.setAttribute?.('x-webkit-airplay', 'deny');
    return el;
  };
  const vol = () => { try { if (el) el.volume = ducked ? DUCKED : VOLUME; } catch { /* read-only on some phones */ } };
  const play = () => { try { const p = el.play(); p?.then?.(() => { unlocked = true; })?.catch?.(() => {}); } catch { /* ignore */ } };
  function sync() {
    const id = on && want ? TRACKS[want] : null;
    if (!id) { if (el && cur) { pos[cur] = el.currentTime || 0; el.pause(); } return; }
    if (!ensure()) return;
    vol();
    if (cur !== id) {
      if (cur) pos[cur] = el.currentTime || 0;
      cur = id; el.src = url(id);
      const at = pos[id] || 0;
      if (at > 1) { const seek = () => { try { el.currentTime = at; } catch { /* ignore */ } el.removeEventListener?.('loadedmetadata', seek); }; el.addEventListener?.('loadedmetadata', seek); }
    }
    if (doc?.hidden) return;
    if (el.paused) play();
  }
  return {
    setMood(name) { want = name && TRACKS[name] ? name : null; sync(); },
    setOn(v) { on = !!v; sync(); },
    setDuck(v) { ducked = !!v; vol(); },
    gesture() { if (!unlocked || el?.paused) sync(); }, // call inside every tap: the first one unlocks the element
    hidden(h) { if (!el) return; if (h) { try { el.pause(); } catch { /* ignore */ } } else sync(); },
    get track() { return cur; },
    get playing() { return !!el && !el.paused; },
  };
}
