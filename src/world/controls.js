// The world's own on-screen controls, in the DOM over the canvas: the round action button (touch),
// the stun button (with the stun power), the small prompt floating above what you can use, the
// name of the place when you arrive. Nothing here knows about Phaser.
import { h, css, root, isTouch } from '../core/dom.js';
import { FONT } from '../core/fonts.js';

css('world-controls', `
.w-ctl { position: fixed; z-index: 12; font-family: ${FONT.pixel}; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; }
.w-act { right: calc(18px + env(safe-area-inset-right)); bottom: calc(26px + env(safe-area-inset-bottom)); width: 78px; height: 78px; border-radius: 50%;
  border: 3px solid #e9d8a6; background: radial-gradient(circle at 40% 35%, #3a2f52, #17132a 70%); color: #fff3d0; font-size: 15px; letter-spacing: .02em;
  box-shadow: 0 0 0 3px #120f1c, 0 6px 18px rgba(0,0,0,.55), inset 0 0 14px rgba(255,214,131,.18); display: flex; align-items: center; justify-content: center; text-align: center; line-height: 1.05; padding: 6px; box-sizing: border-box; transition: transform .08s, opacity .2s; }
.w-act.idle { opacity: .45; border-color: #8a80a8; color: #cfc8e6; }
.w-act:active { transform: scale(.94); }
.w-act.on { animation: w-pulse 1.6s ease-in-out infinite; }
@keyframes w-pulse { 50% { box-shadow: 0 0 0 3px #120f1c, 0 0 22px rgba(255,214,131,.55), inset 0 0 14px rgba(255,214,131,.3); } }
.w-stun { right: calc(28px + env(safe-area-inset-right)); bottom: calc(118px + env(safe-area-inset-bottom)); width: 58px; height: 58px; border-radius: 50%;
  border: 3px solid #a8c8f0; background: #16203a; color: #e6f0ff; font-size: 11px; display: none; align-items: center; justify-content: center; text-align: center; line-height: 1.05;
  box-shadow: 0 0 0 3px #120f1c, 0 4px 12px rgba(0,0,0,.5); }
.w-stun.show { display: flex; }
.w-stun.wait { opacity: .45; }
.w-prompt { pointer-events: auto; transform: translate(-50%, -100%); padding: 3px 8px 4px; border-radius: 8px; background: rgba(18,15,28,.88); border: 2px solid #e9d8a6;
  color: #fff3d0; font-size: 13px; white-space: nowrap; display: none; box-shadow: 0 3px 10px rgba(0,0,0,.5); }
.w-prompt::after { content: ''; position: absolute; left: 50%; bottom: -7px; margin-left: -5px; border: 5px solid transparent; border-top-color: #e9d8a6; border-bottom: 0; }
.w-prompt.show { display: block; }
.w-prompt.dim { opacity: .62; border-color: #8a80a8; color: #cfc8e6; }
.w-prompt.dim::after { border-top-color: #8a80a8; }
.w-prompt kbd { font-family: inherit; font-size: 10px; opacity: .7; margin-left: 5px; border: 1px solid #8a80a8; border-radius: 3px; padding: 0 3px; }
.w-place { left: 50%; top: 22%; transform: translateX(-50%); color: #efe6cc; font-family: ${FONT.serif}; font-size: 26px; letter-spacing: .06em; text-shadow: 0 2px 10px #000, 0 0 18px rgba(0,0,0,.8);
  pointer-events: none !important; opacity: 0; transition: opacity .9s; white-space: nowrap; }
.w-place.show { opacity: 1; }
`);

export function mountControls({ onAct, onStun }) {
  const tap = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };
  const act = h('button.w-ctl.w-act.idle', { onpointerdown: tap(onAct), 'aria-label': 'Azione' }, '·');
  const stun = h('button.w-ctl.w-stun', { onpointerdown: tap(onStun) }, 'Stordisci');
  const prompt = h('div.w-ctl.w-prompt', { onpointerdown: tap(onAct) });
  const place = h('div.w-ctl.w-place');
  const r = root();
  r.append(prompt, place, stun);
  const touch = () => isTouch() || document.body.classList.contains('touch');
  if (touch()) r.append(act);
  window.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch' && !act.isConnected) r.append(act); }, { once: true });
  let placeTimer = null, last = '';
  return {
    // dim: something she cannot do yet (an obstacle without its magic)
    prompt(text, x, y, dim = false) {
      if (!text) { prompt.classList.remove('show'); return; }
      prompt.classList.toggle('dim', !!dim);
      const t = touch() ? text : `${text}`;
      if (t !== last) { last = t; prompt.replaceChildren(t, touch() ? '' : h('kbd', 'spazio')); }
      prompt.classList.add('show');
      const half = prompt.offsetWidth / 2 + 6; // keep it on screen near the edges
      prompt.style.left = `${Math.round(Math.min(innerWidth - half, Math.max(half, x)))}px`; prompt.style.top = `${Math.round(y)}px`;
    },
    act(label, dim = false) {
      act.classList.toggle('idle', !label || dim); act.classList.toggle('on', !!label && !dim);
      act.textContent = label || '·';
    },
    stun(show, ready) { stun.classList.toggle('show', !!show); stun.classList.toggle('wait', !ready); stun.textContent = ready ? 'Stordisci' : '...'; },
    place(name) {
      place.textContent = name; place.classList.add('show');
      clearTimeout(placeTimer); placeTimer = setTimeout(() => place.classList.remove('show'), 1800);
    },
    destroy() { act.remove(); stun.remove(); prompt.remove(); place.remove(); clearTimeout(placeTimer); },
  };
}
