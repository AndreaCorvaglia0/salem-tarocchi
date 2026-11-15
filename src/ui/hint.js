// Interface hints, outside the fiction (docs/DESIGN.md, rule 2 and 4): bus `hint { id }` -> one plain
// line near the bottom, in the pixel font with a small icon, from HINTS (data/story/hints.js). It stays
// until she does the thing (or after some seconds). For `move` on a touch screen a small animated tap
// marker shows a few tiles ahead on the road (service world.ahead). Who emits which hint: notes/systems.md.
import { h, css, openOverlay, isTouch, reducedMotion, blocked } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { on } from '../core/bus.js';
import { call, has } from '../core/services.js';
import { state } from '../core/state.js';
import * as HD from '../data/story/hints.js';

const CSS = `
.uh{position:fixed;left:50%;bottom:calc(118px + env(safe-area-inset-bottom));z-index:95;transform:translate(-50%,10px);display:flex;align-items:center;gap:10px;width:max-content;max-width:calc(100vw - 36px);box-sizing:border-box;padding:9px 14px 10px 10px;background:rgba(14,14,30,.94);color:#f4ecd4;border:2px solid #9fb8ff;border-radius:4px;box-shadow:0 0 0 2px #07070f,0 8px 22px rgba(0,0,0,.6);font:17px/1.3 ${FONT.pixel};opacity:0;transition:opacity .35s,transform .35s;pointer-events:none}
.uh.on{opacity:1;transform:translate(-50%,0)}
.uh-i{flex:none;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#9fb8ff;color:#0e0e1e;font:700 16px ${FONT.pixel}}
.uh-tap{position:fixed;z-index:94;width:0;height:0;pointer-events:none}
.uh-tap i{position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;border:3px solid #fff3c4;box-shadow:0 0 12px #ffd77a;animation:uh-ring 1.4s ease-out infinite}
.uh-tap b{position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#fff3c4;box-shadow:0 0 10px #ffd77a;animation:uh-dot 1.4s ease-in-out infinite}
@keyframes uh-ring{0%{transform:scale(.4);opacity:0}25%{opacity:1}100%{transform:scale(1.25);opacity:0}}
@keyframes uh-dot{0%,100%{transform:scale(1)}20%{transform:scale(.7)}}
/* over a screen of its own (a session line, the ceremony, the pad): at the top */
.uh.top{bottom:auto;top:calc(14px + env(safe-area-inset-top))}
@media (min-width:720px){.uh{bottom:calc(40px + env(safe-area-inset-bottom));font-size:18px}}
@media (prefers-reduced-motion:reduce){.uh{transition:none}.uh-tap i,.uh-tap b{animation:none}}
`;

// how long each hint may stay at most (ms), and what counts as "she did it"
const MAX = { move: 16000, action: 14000, grimoire: 20000, exam: 9000, reading: 10000, tap: 12000, detail: 12000, words: 14000, number: 10000, guide: 12000, patrol: 9000 };
// hints about a screen that is itself on top: shown at once, over it; TOP ones at the top of the screen
const OVER = ['exam', 'reading', 'tap', 'detail', 'words', 'number', 'draw', 'shop', 'trade'];
const TOP = ['tap', 'detail', 'words', 'number'];
const DEFAULT = { move: 'Tocca un punto della strada per camminare.', action: 'Quando sei vicina a qualcosa, tocca il pulsante in basso.', grimoire: 'Tocca il libro in alto per aprire il grimorio.', exam: 'Rispondi con calma.', reading: 'Scegli la lettura adatta a chi hai davanti.' };
export const hintText = (id) => {
  const t = HD.HINTS?.[id];
  if (typeof t === 'string' && t) return isTouch() || !HD.HINTS_KEYS?.[id] ? t : HD.HINTS_KEYS[id];
  return DEFAULT[id] || null;
};

let cur = null;
function hide() {
  if (!cur) return;
  const c = cur; cur = null;
  c.offs.forEach((f) => f()); clearInterval(c.poll); clearInterval(c.guard); clearTimeout(c.timer);
  c.el.classList.remove('on'); c.tap?.remove();
  setTimeout(() => c.close(), 400);
}

export function showHint(id) {
  const text = hintText(id);
  if (!text) return;
  hide();
  css('ui-hint', CSS);
  const el = h(`div.uh${TOP.includes(id) ? '.top' : ''}`, { role: 'status', 'aria-live': 'polite' }, h('span.uh-i', { 'aria-hidden': 'true' }, 'i'), h('span', {}, text));
  const close = openOverlay(el, { block: false });
  requestAnimationFrame(() => el.classList.add('on'));
  const c = { id, el, close, offs: [], poll: 0, timer: 0, tap: null, guard: 0, left: MAX[id] || 12000 };
  cur = c;
  // a scene that covers the world (it may start right after the hint) hides the hint and stops its clock
  const own = OVER.includes(id);
  let last = Date.now();
  c.guard = setInterval(() => {
    const covered = !own && !!document.querySelector(COVER);
    el.style.visibility = covered ? 'hidden' : '';
    if (c.tap) c.tap.style.visibility = covered ? 'hidden' : '';
    const now = Date.now();
    if (!covered) c.left -= now - last;
    last = now;
    if (c.left <= 0) hide();
  }, 200);
  const steps0 = state.stats?.steps || 0;
  if (id === 'move') {
    if (isTouch() && has('world.ahead')) {
      c.tap = h('div.uh-tap', { 'aria-hidden': 'true' }, h('i'), h('b'));
      document.body.append(c.tap);
      c.tap.style.display = 'none';
    }
    c.poll = setInterval(async () => {
      if ((state.stats?.steps || 0) > steps0) { hide(); return; }
      if (!c.tap) return;
      const p = await call('world.ahead', 4);
      if (cur !== c) return;
      if (p) { c.tap.style.display = ''; c.tap.style.left = `${Math.round(p.x)}px`; c.tap.style.top = `${Math.round(p.y)}px`; } else c.tap.style.display = 'none';
    }, reducedMotion() ? 500 : 250);
  } else if (id === 'action') {
    c.offs.push(on('card:found', hide));
    c.poll = setInterval(() => { if (blocked()) hide(); }, 300); // she used it: a dialogue, a scene or the ceremony
  } else if (id === 'tap' || id === 'detail' || id === 'number') {
    const off = () => { window.removeEventListener('pointerdown', bye, true); window.removeEventListener('keydown', bye, true); };
    const bye = () => setTimeout(hide, 200); // she did it
    setTimeout(() => { if (cur === c) { window.addEventListener('pointerdown', bye, true); window.addEventListener('keydown', bye, true); } }, 300);
    c.offs.push(off);
  } else if (id === 'words') {
    c.poll = setInterval(() => { if (!document.querySelector('.fd.writing')) hide(); }, 300);
  } else if (id === 'grimoire') {
    c.offs.push(on('grimoire:open', hide));
  }
}

// a hint waits while a scene, a session or a dialogue covers the world (the world may emit it just
// before a scene starts); the Exam and reading hints are meant to show over their own screens
const COVER = '.sgm,.cn,.ss,.sy-layer.on,.fd';
const free = () => !document.querySelector(COVER) && !blocked();
function whenFree(id, tries = 0) {
  const own = OVER.includes(id);
  if (own || free()) { setTimeout(() => { if (own || free()) showHint(id); else whenFree(id, tries + 1); }, own ? 0 : 500); return; }
  if (tries < 600) setTimeout(() => whenFree(id, tries + 1), 400); // up to four minutes
}
on('hint', ({ id } = {}) => { if (id) whenFree(id); });
export const hideHint = hide;
