// Short recorded samples played through the game's AudioContext: the struck gong that opens the smoke rite
// and the five real instrument notes of its embers (public/rite/notes/, src/data/rite.js). Decoded once and
// kept; each play is a buffer source through its own gain, so notes can overlap and fade. Nothing happens
// before a gesture has created the context (index.js attaches it), and never a throw.
export function createSamples({ fetcher = (u) => globalThis.fetch?.(u) } = {}) {
  let ctx = null, out = null;
  const cache = new Map();
  const load = (url) => {
    if (!ctx) return Promise.resolve(null);
    if (!cache.has(url)) {
      cache.set(url, Promise.resolve(fetcher(url)).then((r) => (r && r.ok ? r.arrayBuffer() : null))
        .then((b) => (b ? new Promise((res) => { try { const p = ctx.decodeAudioData(b, res, () => res(null)); p?.catch?.(() => res(null)); } catch { res(null); } }) : null))
        .catch(() => null));
    }
    return cache.get(url);
  };
  return {
    attach(c) { if (ctx || !c?.createGain) return; try { ctx = c; out = c.createGain(); out.gain.value = 1; out.connect(c.destination); } catch { ctx = null; out = null; } },
    preload(urls) { for (const u of urls || []) load(u); },
    // -> { stop(fade) } (stop does nothing if the sample never started)
    play(url, { gain = 1, fadeIn = 0.005 } = {}) {
      let src = null, g = null, stopped = false;
      load(url).then((buf) => {
        if (!buf || stopped || !ctx) return;
        try {
          src = ctx.createBufferSource(); src.buffer = buf; g = ctx.createGain();
          const t = ctx.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + fadeIn);
          src.connect(g); g.connect(out); src.start(t);
          src.onended = () => { try { src.disconnect(); g.disconnect(); } catch { /* gone */ } };
        } catch { /* ignore */ }
      });
      return {
        stop(fade = 0.25) {
          stopped = true;
          if (!src || !g || !ctx) return;
          try { const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + fade); src.stop(t + fade + 0.02); } catch { /* ignore */ }
        },
      };
    },
    get ready() { return !!ctx; },
  };
}
