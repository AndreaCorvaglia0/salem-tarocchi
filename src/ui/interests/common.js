// What the screens of the interests share (src/ui/interests/beam.js, mortar.js): the look (the warm dark of the
// garden screen, ui/garden.js), Ortica's speech bubble, a herb drawn from its world sprite, and the frame of a
// screen that resolves a promise when it closes. Presentation only: the rules are in glue/interests.rules.js.
import { h, css, openOverlay } from '../../core/dom.js';
import { herbArt } from '../../world/art/herbs.js';
import { HERB } from '../../data/herbs/base.js';
import { SERIF, HAND, GOLD, baseCss } from '../paper.js';
import { onEscape } from '../book.js';

const CSS = `
.it{position:fixed;inset:0;z-index:60;overflow:hidden auto;display:flex;flex-direction:column;align-items:center;background:radial-gradient(ellipse 90% 420px at 50% 34%,#3a2414 0%,#1a1018 60%,#07070d 100%) #07070d;color:#efe4c8;font:16px ${SERIF};animation:gx-fade .4s;-webkit-overflow-scrolling:touch}
.it-head{flex:none;width:min(420px,calc(100% - 28px));margin-top:calc(14px + env(safe-area-inset-top));text-align:center}
.it-head h1{margin:0;font:400 29px/1.1 ${SERIF};color:#f3e7c9;text-shadow:0 0 24px #d8b25a33}
.it-head p{margin:5px 0 0;font:19px/23px ${HAND};color:#e2d3b2}
.it-stage{position:relative;flex:none;width:min(400px,calc(100% - 24px));margin-top:12px;border-radius:10px;background:linear-gradient(#2a1a10,#1b120c);border:1px solid #5a3a22;box-shadow:0 10px 22px #000a, inset 0 1px 0 #7a523355;overflow:hidden}
.it-say{flex:none;width:min(400px,calc(100% - 24px));box-sizing:border-box;margin-top:12px;padding:10px 14px 11px;border-radius:4px 14px 14px 14px;background:#f0e6cf;color:#2a2030;font:italic 18px/1.35 ${SERIF};box-shadow:0 6px 18px #000a;animation:gx-fade .3s}
.it-say b{display:block;font:400 14px ${SERIF};font-style:normal;color:#6b5a48;letter-spacing:.05em;text-transform:uppercase;margin-bottom:1px}
.it-say.bad{background:#f3dcc8}
.it-say.mine{border-radius:14px;font:19px/23px ${HAND};font-style:normal;background:#e9dfc6}
.it-say:empty{display:none}
.it-body{flex:none;width:min(400px,calc(100% - 24px));margin-top:12px;display:flex;flex-direction:column;gap:9px}
.it-note{margin:0;text-align:center;font:17px/21px ${HAND};color:#cdb98e}
.it-b{min-height:52px;border-radius:8px;border:1px solid #d8b25a66;background:#0b0a10b0;color:#f1e6cb;font:19px/22px ${SERIF};padding:6px 14px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .2s,border-color .2s}
.it-b:hover,.it-b:focus-visible{background:#2a2016;border-color:${GOLD};outline:none}
.it-b.main{border-color:${GOLD};background:#3a2a12;color:#fff1c8}
.it-b.opt{text-align:left;font:20px/24px ${HAND}}
.it-b:disabled{opacity:.45;cursor:default}
.it-foot{flex:none;width:min(400px,calc(100% - 24px));margin:14px 0 calc(18px + env(safe-area-inset-bottom));text-align:center}
.it-x{min-height:44px;padding:0 6px;border:0;background:none;color:#b9a98a;font:16px ${SERIF};text-decoration:underline;text-underline-offset:4px;cursor:pointer}
.it-herb{display:block;image-rendering:pixelated;image-rendering:crisp-edges}
.it-chips{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.it-chip{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;min-height:92px;padding:6px 2px 5px;border-radius:8px;border:1px solid #5a3a22;background:#120c08;color:#f1e6cb;font:18px/20px ${HAND};cursor:pointer;-webkit-tap-highlight-color:transparent}
.it-chip:hover,.it-chip:focus-visible{border-color:${GOLD};outline:none}
.it-chip:disabled{opacity:.4;cursor:default}
.it-chip .n{position:absolute;top:3px;right:7px;font:700 16px ${HAND};color:#e6c26a}
.it-chip.on{border-color:${GOLD};background:#2a1a10;box-shadow:0 0 0 1px ${GOLD}66}
.it-dots{display:flex;justify-content:center;gap:9px}
.it-dots i{width:12px;height:12px;border-radius:50%;border:1.5px solid #d8b25a99;box-sizing:border-box}
.it-dots i.on{background:#e6c26a;border-color:#e6c26a}
@keyframes it-shake{20%{transform:rotate(4deg)}50%{transform:rotate(-4deg)}80%{transform:rotate(2deg)}}
@keyframes it-sway{50%{transform:rotate(3deg)}}
@media (prefers-reduced-motion:reduce){.it *{animation:none!important}}
`;

export const NAME = (id) => HERB[id]?.name || id;
export const lower = (id) => NAME(id).toLowerCase();

// a herb from its world sprite (the still frame), `k` px per sprite pixel; `flip` upside down (a bunch hung to dry)
export function herbCanvas(id, k = 3, { flip = false } = {}) {
  const art = herbArt(id), c = document.createElement('canvas');
  const w = 16, hh = art ? art.height : 20;
  c.width = w * k; c.height = hh * k; c.className = 'it-herb';
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  if (art) {
    if (flip) { g.translate(0, c.height); g.scale(1, -1); }
    g.drawImage(art, 0, 0, w, hh, 0, 0, w * k, hh * k);
  }
  return c;
}

// A witch's bubble: say(text, bad?) changes it, say('') hides it. `who` null: her own thought (no name, no «»).
export function bubble(who = 'Ortica') {
  const el = h(`div.it-say${who ? '' : '.mine'}`, { role: 'status', 'aria-live': 'polite' });
  el.say = (t, bad = false) => { el.classList.toggle('bad', !!bad); el.replaceChildren(...(t ? (who ? [h('b', {}, who), `«${t}»`] : [t]) : [])); if (t) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; } };
  return el;
}

// The frame: a title, a subtitle, the stage, the bubble, the body (buttons), and a quiet «leave it» at the bottom.
// -> { el, sub, stage, say, body, done(result) } and a promise in `result`
export function frame({ title, label, closeText, who = 'Ortica' }) {
  baseCss(); css('ui-interests', CSS);
  let close = () => {}, pop = () => {}, finish;
  const result = new Promise((r) => { finish = r; });
  const sub = h('p'), stage = h('div.it-stage'), say = bubble(who), body = h('div.it-body');
  const done = (v) => { pop(); close(); finish(v); };
  const x = h('button.it-x', { type: 'button', onclick: () => done({ ok: false }) }, closeText);
  const el = h('div.it', { role: 'dialog', 'aria-label': label || title }, h('div.it-head', h('h1', {}, title), sub), stage, say, body, h('div.it-foot', x));
  close = openOverlay(el);
  pop = onEscape(() => done({ ok: false }));
  return { el, sub, stage, say, body, done, foot: x, result };
}

// A circular gesture around a centre: calls onTurn() at every full turn of the finger (either way).
export function turns(target, onTurn) {
  let last = null, acc = 0;
  const angle = (e) => { const r = target.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)); };
  target.addEventListener('pointerdown', (e) => { last = angle(e); try { target.setPointerCapture(e.pointerId); } catch { /* */ } });
  target.addEventListener('pointermove', (e) => {
    if (last == null) return;
    const a = angle(e); let d = a - last; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
    last = a; acc += d;
    if (Math.abs(acc) >= 2 * Math.PI) { acc = 0; onTurn(); }
  });
  const up = () => { last = null; };
  target.addEventListener('pointerup', up); target.addEventListener('pointercancel', up);
  target.style.touchAction = 'none';
}

export const dots = (n, on) => h('div.it-dots', Array.from({ length: n }, (_, i) => h(`i${i < on ? '.on' : ''}`)));
