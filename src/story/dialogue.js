// The dialogue box of the pixel world: a profile cameo, the name, text typed out quickly, choices as
// big buttons stacked above the box. story.say / story.choose / (moment) live here.
// Tap or Space/Enter completes the typing, then goes on. The layer stays open while a run plays
// (it blocks the world) and closes on end().
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { call } from '../core/services.js';
import { PEOPLE } from '../data/cards.base.js';
import { cameo } from './stage/cameos.js';

const CSS = `
.sy-layer{position:fixed;inset:0;pointer-events:none;z-index:30;font-family:${FONT.pixel};color:#f1ead6;-webkit-user-select:none;user-select:none}
.sy-layer.on{pointer-events:auto}
.sy-stack{position:absolute;left:0;right:0;bottom:max(10px,env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:10px;padding:0 8px;box-sizing:border-box}
.sy-box,.sy-choices,.sy-moment{width:min(100%,720px);box-sizing:border-box}
.sy-box{position:relative;display:flex;gap:12px;align-items:flex-start;min-height:104px;padding:14px 14px 22px;background:rgba(16,16,34,.96);border:3px solid #d9c9a0;box-shadow:0 0 0 3px #07070f,inset 0 0 0 3px #232345,0 10px 30px rgba(0,0,0,.6);transform:translateY(30px);opacity:0;transition:transform .16s ease-out,opacity .16s;cursor:pointer}
.sy-box.in{transform:none;opacity:1}
.sy-port{flex:none;display:block}
.sy-name{position:absolute;left:14px;top:-17px;padding:2px 10px 3px;background:#d9c9a0;color:#1a1424;font-size:16px;font-weight:600;letter-spacing:.04em;box-shadow:0 0 0 2px #07070f}
.sy-text{flex:1;min-width:0;font-size:18px;line-height:1.38;min-height:75px;padding-top:2px;word-wrap:break-word}
.sy-text .h{visibility:hidden}
.sy-more{position:absolute;right:12px;bottom:6px;font-size:15px;color:#d9c9a0;opacity:0;animation:sybl 1s steps(2) infinite}
.sy-more.on{opacity:1}
@keyframes sybl{50%{transform:translateY(3px)}}
.sy-box.thought{background:rgba(24,22,46,.9);border-style:dashed;border-color:#8c88c8}
.sy-box.thought .sy-text{color:#c9c6ff;font-style:italic}
.sy-box.thought .sy-port{filter:brightness(.9) saturate(.8)}
.sy-box.thought .sy-name{background:#8c88c8;color:#10102a;font-weight:400}
.sy-box.narra,.sy-box.plain{background:rgba(10,10,20,.94);border-color:#6a5f48}
.sy-box.narra .sy-text{font-style:italic;color:#d8d0bc;text-align:left}
.sy-box.plain .sy-text,.sy-box.narra .sy-text{min-height:60px}
.sy-box.narra,.sy-box.plain{min-height:84px}
.sy-choices{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
.sy-opt{display:flex;gap:12px;align-items:center;min-height:54px;padding:10px 14px;font:inherit;font-size:18px;line-height:1.3;text-align:left;color:#f1ead6;background:rgba(30,28,58,.97);border:3px solid #8c7f5e;box-shadow:0 0 0 3px #07070f,0 6px 16px rgba(0,0,0,.5);cursor:pointer;-webkit-tap-highlight-color:transparent;animation:syup .18s ease-out both}
.sy-opt:nth-child(2){animation-delay:.04s}.sy-opt:nth-child(3){animation-delay:.08s}.sy-opt:nth-child(4){animation-delay:.12s}
.sy-opt b{flex:none;display:grid;place-items:center;width:26px;height:26px;background:#d9c9a0;color:#1a1424;font-size:16px}
.sy-opt:hover,.sy-opt:focus-visible{border-color:#ffe08a;background:rgba(48,42,86,.98);outline:none}
.sy-opt:active{transform:translateY(2px)}
@keyframes syup{from{opacity:0;transform:translateY(10px)}}
.sy-moment{position:fixed;top:max(16px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);width:auto;max-width:calc(100% - 24px);padding:10px 18px;background:#d9c9a0;color:#1a1424;font-size:18px;font-weight:600;text-align:center;box-shadow:0 0 0 3px #07070f,0 8px 24px rgba(0,0,0,.6);animation:syup .25s ease-out both;pointer-events:none}
@media (min-width:720px){.sy-text{font-size:20px;min-height:96px}.sy-box{min-height:124px}.sy-name{font-size:17px}.sy-opt{font-size:20px}}
@media (prefers-reduced-motion:reduce){.sy-box,.sy-opt,.sy-moment{transition:none;animation:none}.sy-more{animation:none}}
`;

let layer = null, stack = null, box = null, closeLayer = null, hideT = 0, active = 0;
let release = null; // what a tap / Space / Enter does right now

const onKey = (e) => {
  if (!release) return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); release('key'); }
  else if (/^[1-4]$/.test(e.key)) release(`n${e.key}`);
};

function ensure() {
  css('story-dialogue', CSS);
  clearTimeout(hideT);
  if (layer) return;
  stack = h('div.sy-stack');
  layer = h('div.sy-layer', stack);
  layer.addEventListener('pointerdown', (e) => { if (e.target.closest('.sy-opt')) return; e.preventDefault(); release?.('tap'); });
  closeLayer = openOverlay(layer);
  window.addEventListener('keydown', onKey, true);
}
const scheduleHide = () => {
  clearTimeout(hideT);
  hideT = setTimeout(() => { if (active === 0 && box) { box.remove(); box = null; layer?.classList.remove('on'); } }, 60);
};

// Shows one line. Resolves when the player taps after the text is complete.
export function say(who, text) {
  ensure();
  active += 1;
  const person = PEOPLE[who];
  // the Reader stays faceless in the world; everyone else (and the extra villagers) has a profile cameo
  const cv = who === 'lettrice' ? null : cameo(who, matchMedia('(min-width:720px)').matches ? 96 : 72);
  cv?.classList.add('sy-port');
  const kind = who === 'tu' ? 'thought' : who === 'narra' ? 'narra' : cv ? '' : 'plain';
  const t1 = h('span'), t2 = h('span.h'), more = h('div.sy-more', '▼');
  const name = who === 'narra' ? null : person?.short || (typeof who === 'string' ? who : null);
  const fresh = h(`div.sy-box${kind ? `.${kind}` : ''}`, name && who !== 'tu' ? h('div.sy-name', name) : null, who === 'tu' ? h('div.sy-name', 'pensi') : null, cv, h('div.sy-text', t1, t2), more);
  if (box) box.remove();
  box = fresh;
  stack.append(box);
  layer.classList.add('on');
  requestAnimationFrame(() => box === fresh && fresh.classList.add('in'));
  const full = String(text ?? '');
  return new Promise((resolve) => {
    const start = performance.now(), per = reducedMotion() ? 0 : 20; // ms per character
    let n = 0, done = false, raf = 0, armed = 0;
    const paint = () => { t1.textContent = full.slice(0, n); t2.textContent = full.slice(n); };
    const finish = () => { n = full.length; paint(); done = true; more.classList.add('on'); armed = performance.now() + 120; };
    const tick = (now) => {
      if (done) return;
      n = per ? Math.min(full.length, Math.floor((now - start) / per)) : full.length;
      paint();
      if (n >= full.length) finish(); else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    release = () => {
      if (!done) { cancelAnimationFrame(raf); finish(); return; }
      if (performance.now() < armed) return;
      release = null; active -= 1; call('sound.play', 'tap'); scheduleHide(); resolve();
    };
  });
}

// Shows 2-4 options above the box. Resolves with the index.
export function choose(texts) {
  ensure();
  active += 1;
  layer.classList.add('on');
  const list = h('div.sy-choices');
  const btns = texts.slice(0, 4);
  return new Promise((resolve) => {
    const pick = (i) => { list.remove(); release = null; active -= 1; scheduleHide(); resolve(i); };
    btns.forEach((t, i) => list.append(h('button.sy-opt', { type: 'button', onclick: () => pick(i) }, h('b', String(i + 1)), h('span', t))));
    stack.insertBefore(list, box || null);
    release = (how) => { const m = /^n(\d)$/.exec(how || ''); if (m && +m[1] <= btns.length) pick(+m[1] - 1); };
    setTimeout(() => list.querySelector('.sy-opt')?.focus?.({ preventScroll: true }), 30);
  });
}

// A short banner ("Hai imparato: ...") that goes by itself.
export function moment(text, ms = 1900) {
  ensure();
  const el = h('div.sy-moment', text);
  layer.append(el);
  return new Promise((r) => setTimeout(() => { el.remove(); r(); }, reducedMotion() ? Math.min(ms, 900) : ms));
}

export function end() {
  clearTimeout(hideT);
  active = 0; release = null;
  box?.remove(); box = null;
  window.removeEventListener('keydown', onKey, true);
  closeLayer?.(); closeLayer = null; layer = null; stack = null;
}
