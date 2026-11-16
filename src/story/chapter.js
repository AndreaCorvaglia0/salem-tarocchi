// The chapter card (docs/DESIGN.md "Il capitolo si apre dalla Lettrice"): when she goes to the Reader at
// the end of a chapter the screen goes black, the music stops, the title and the name of the chapter
// that opens fade in, then its one line (data/story/chapters.js). It stays until she taps; the cue
// "tocca" comes two seconds after the line. Then the session begins, with its own music.
//   service story.chapterCard(n) -> Promise, resolved on her tap. The black stays a little longer and
//   fades over whatever opened meanwhile (the session), so the world never shows in between.
// Scripts call it right before { do: 'session' }: { do: 'call', name: 'story.chapterCard', args: [2] }.
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { emit } from '../core/bus.js';
import { call, has, provide } from '../core/services.js';
import { CHAPTER_CARDS } from '../data/story/chapters.js';

// when each part comes in (ms from the black), and how long the black lingers after her tap
export const TIMES = { title: 1500, name: 2300, line: 4300, cue: 2000, linger: 900, out: 900 };

const CSS = `
.cc{position:fixed;inset:0;z-index:60;background:#000;color:#efe4cc;font-family:${FONT.serif};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 34px calc(8vh + env(safe-area-inset-bottom));box-sizing:border-box;text-align:center;opacity:0;transition:opacity .9s ease;cursor:pointer;-webkit-user-select:none;user-select:none;touch-action:manipulation}
.cc.on{opacity:1}
.cc.out{opacity:0;pointer-events:none}
.cc>*{opacity:0;transition:opacity 1.6s ease,transform 1.6s ease;transform:translateY(6px)}
.cc>.in{opacity:1;transform:none}
.cc-t{margin:0;font-size:15px;letter-spacing:.42em;text-indent:.42em;text-transform:uppercase;color:#a8946a}
.cc-n{margin:22px 0 0;font-weight:400;font-size:clamp(40px,11vw,58px);line-height:1.08;letter-spacing:.01em;color:#f4ead2;text-wrap:balance}
.cc-r{width:54px;height:1px;margin:34px 0 32px;background:linear-gradient(90deg,transparent,#b89a52,transparent)}
.cc-l{margin:0;max-width:19em;font-style:italic;font-size:clamp(21px,5.6vw,26px);line-height:1.5;color:#d9cdb0;text-wrap:balance}
.cc-c{position:absolute;left:0;right:0;bottom:calc(34px + env(safe-area-inset-bottom));font-style:italic;font-size:16px;letter-spacing:.08em;color:#7d7462;transform:none!important}
@media (prefers-reduced-motion:reduce){.cc,.cc>*{transition:none}}
`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function chapterCard(n) {
  const card = CHAPTER_CARDS[n];
  if (!card || typeof document === 'undefined') return;
  css('story-chapter', CSS);
  const fast = reducedMotion();
  const at = (ms) => (fast ? 0 : ms);
  const title = h('p.cc-t', {}, card.title), name = h('h1.cc-n', {}, card.name), rule = h('div.cc-r');
  const line = h('p.cc-l', {}, card.line), cue = h('div.cc-c', {}, 'tocca');
  const root = h('div.cc', { role: 'dialog', 'aria-label': `${card.title}. ${card.name}` }, title, name, rule, line, cue);
  const close = openOverlay(root);
  emit('cinema', true); // the HUD hides
  if (has('sound.stop')) call('sound.stop'); // silence: the session that follows starts its own music
  let ready = false, done;
  const tapped = new Promise((r) => { done = r; });
  const tap = (e) => { e?.preventDefault?.(); if (ready) done(); };
  const onKey = (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); e.stopPropagation(); tap(); } };
  root.addEventListener('pointerdown', tap);
  window.addEventListener('keydown', onKey, true);
  const timers = [];
  const later = (ms, fn) => timers.push(setTimeout(fn, at(ms)));
  requestAnimationFrame(() => root.classList.add('on'));
  later(TIMES.title, () => title.classList.add('in'));
  later(TIMES.name, () => { name.classList.add('in'); rule.classList.add('in'); });
  later(TIMES.line, () => line.classList.add('in'));
  // a tap counts once the line can be read; the cue comes two seconds after it
  later(TIMES.line + 1700, () => { ready = true; });
  later(TIMES.line + TIMES.cue, () => cue.classList.add('in'));
  await tapped;
  timers.forEach(clearTimeout);
  window.removeEventListener('keydown', onKey, true);
  for (const el of [title, name, rule, line, cue]) el.classList.remove('in');
  await sleep(at(1700)); // the words go, and the black stays for a breath
  emit('cinema', false); // whoever comes next (the session) takes the screen for itself
  // let go: the caller opens the session under the black, which then fades away over it
  setTimeout(() => {
    root.classList.add('out');
    setTimeout(close, at(TIMES.out) + 50);
  }, at(TIMES.linger));
}

provide('story.chapterCard', (n) => chapterCard(n));
