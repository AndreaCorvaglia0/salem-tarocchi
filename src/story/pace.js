// Pacing of every line the player reads (sessions, visits, cinema, the dialogue box): the text
// appears; a tap while it appears completes it; only a tap after a short pause past completion goes
// on; the cue ("tocca") shows only when a tap will be accepted. Nothing goes on by itself.
// Pure timing, no DOM: tests/story.pace.test.mjs.
//
//   const g = gate({ start(done), finish(), onReady(), pause })
//   start(done): begin revealing, call done() when the whole text is shown
//   finish():    show the whole text now (a tap while it appears)
//   g.tap() -> 'complete' | 'wait' | 'next' | 'gone';  await g.done;  g.cancel()
export const PAUSE = 350;

export function gate({ start, finish = () => {}, onReady = () => {}, pause = PAUSE, auto = false, now = () => Date.now() } = {}) {
  let phase = 'showing', timer = 0, resolve;
  const done = new Promise((r) => { resolve = r; });
  const shown = () => {
    if (phase !== 'showing') return;
    phase = 'shown';
    timer = setTimeout(() => {
      if (phase !== 'shown') return;
      phase = 'ready';
      if (auto) { phase = 'gone'; resolve('auto'); return; } // a question: the choices come without a tap
      onReady();
    }, pause);
  };
  const g = {
    done,
    get phase() { return phase; },
    tap() {
      if (phase === 'showing') { finish(); shown(); return 'complete'; }
      if (phase === 'shown') return 'wait';
      if (phase === 'ready') { phase = 'gone'; resolve('tap'); return 'next'; }
      return 'gone';
    },
    cancel() { clearTimeout(timer); if (phase !== 'gone') { phase = 'gone'; resolve('cancel'); } },
  };
  void now;
  try { start(shown); } catch (e) { console.error('[pace]', e); shown(); }
  return g;
}

// A key that should count as a tap (no auto-repeat: holding Space must not run through the lines).
export const isTapKey = (e) => (e.key === ' ' || e.key === 'Enter') && !e.repeat;
