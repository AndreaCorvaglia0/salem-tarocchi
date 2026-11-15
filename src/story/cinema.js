// Cinema: black bars slide in, the HUD hides (bus 'cinema' true/false), one line at a time in the
// serif, tap / Space / Enter for the next, a small "salta" ends it. Adapted from Mnemopolis' cinema.js.
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { emit } from '../core/bus.js';

const CSS = `
.cn{position:fixed;inset:0;z-index:40;font-family:${FONT.serif};color:#f1ecd9;cursor:pointer;-webkit-user-select:none;user-select:none;touch-action:manipulation}
.cn-bar{position:absolute;left:0;right:0;background:#000;transition:transform .7s cubic-bezier(.3,.7,.2,1)}
.cn-top{top:0;height:max(11vh,70px);transform:translateY(-101%)}
.cn-bot{bottom:0;height:max(26vh,190px);transform:translateY(101%);background:linear-gradient(#000 70%,#000)}
.cn.in .cn-top,.cn.in .cn-bot{transform:none}
.cn-fade{position:absolute;left:0;right:0;bottom:max(26vh,190px);height:90px;background:linear-gradient(transparent,rgba(0,0,0,.35));opacity:0;transition:opacity .7s}
.cn.in .cn-fade{opacity:1}
.cn-cap{position:absolute;left:0;right:0;bottom:0;height:max(26vh,190px);display:flex;align-items:center;justify-content:center;padding:10px 22px 24px;box-sizing:border-box;text-align:center}
.cn-cap p{margin:0;max-width:min(92vw,760px);font-size:clamp(21px,2.6vw,27px);line-height:1.42;letter-spacing:.01em;text-wrap:balance;opacity:0;transform:translateY(5px);transition:opacity .6s,transform .6s}
.cn-cap p.on{opacity:1;transform:none}
.cn-skip{position:absolute;top:max(10px,env(safe-area-inset-top));right:12px;min-height:44px;min-width:44px;padding:0 16px;border:1px solid #4a4638;border-radius:6px;background:rgba(0,0,0,.7);color:#d4cdb6;font:italic 17px ${FONT.serif};cursor:pointer;opacity:0;transition:opacity .5s .5s;z-index:2}
.cn.in .cn-skip{opacity:1}
.cn-hint{position:absolute;right:16px;bottom:10px;font:italic 15px ${FONT.serif};color:#8f8a7c;opacity:0;transition:opacity .6s}
.cn-hint.on{opacity:1}
@media (prefers-reduced-motion:reduce){.cn-bar,.cn-cap p,.cn-fade,.cn-skip{transition:none}}
`;

export async function cinema(lines) {
  css('story-cinema', CSS);
  const list = (lines || []).filter(Boolean);
  if (!list.length) return;
  const reduced = reducedMotion();
  const cap = h('p'), hint = h('div.cn-hint', 'tocca');
  const skip = h('button.cn-skip', { type: 'button' }, 'salta ›');
  const root = h('div.cn', { role: 'dialog' }, h('div.cn-fade'), h('div.cn-bar.cn-top'), h('div.cn-bar.cn-bot'), h('div.cn-cap', cap), skip, hint);
  const close = openOverlay(root);
  emit('cinema', true);
  requestAnimationFrame(() => root.classList.add('in'));
  let skipped = false, next = null;
  const tap = () => { const f = next; next = null; f?.(); };
  root.addEventListener('pointerdown', (e) => { if (e.target === skip) return; e.preventDefault(); tap(); });
  skip.addEventListener('click', (e) => { e.stopPropagation(); skipped = true; tap(); });
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); skipped = true; tap(); }
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); tap(); }
  };
  window.addEventListener('keydown', onKey, true);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    await sleep(reduced ? 0 : 650);
    for (const line of list) {
      if (skipped) break;
      cap.textContent = line;
      void cap.offsetWidth; cap.classList.add('on');
      const hintT = setTimeout(() => hint.classList.add('on'), 1800);
      await new Promise((r) => { next = r; }); // no auto advance: a tap goes on
      clearTimeout(hintT); hint.classList.remove('on');
      cap.classList.remove('on');
      await sleep(reduced ? 0 : 320);
    }
  } finally {
    window.removeEventListener('keydown', onKey, true);
    root.classList.remove('in');
    await sleep(reduced ? 0 : 650);
    close();
    emit('cinema', false);
  }
}
