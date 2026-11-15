// Shared look and small helpers of the play area (sx-*): a dark plum night, parchment text, a gold
// accent, the old serif voice. Phone first: text >= 16px, targets >= 48px. Used by every screen here.
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { call } from '../core/services.js';

export const sleep = (ms) => new Promise((r) => setTimeout(r, reducedMotion() ? Math.min(ms, 60) : ms));
export const shuffle = (a, rng = Math.random) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
// sound, always through the service locator (the sound area is never imported); all fire and forget
export const snd = (name) => { call('sound.play', name); };
export const mood = (name, opts) => { call('sound.mood', name, opts); };
export const moodBack = () => { call('sound.back'); }; // the music of the map she stands in
export const pickOne = (a, rng = Math.random) => a[Math.floor(rng() * a.length)];

const CSS = `
.sx{--ink:#120d17;--panel:#1d1626;--panel2:#271d33;--line:#43344f;--paper:#f0e6cf;--dim:#bdae96;--gold:#e0b95e;--gold-ink:#2a1d05;--blood:#c44a3c;--moss:#86c093;--sky:#9bb4e0;
  position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;color:var(--paper);font:19px/1.4 ${FONT.serif};
  background:radial-gradient(ellipse at 50% -10%,#2f2142 0%,var(--ink) 65%);padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom);touch-action:manipulation;user-select:none;-webkit-user-select:none}
.sx *{box-sizing:border-box}
.sx button{font:inherit;color:inherit;-webkit-tap-highlight-color:transparent}
.sx [hidden]{display:none !important}
.sx-body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;touch-action:pan-y}
.sx-col{max-width:560px;margin:0 auto;padding:10px 14px 18px;display:flex;flex-direction:column;gap:12px}
.sx-top{flex:none;display:flex;align-items:center;gap:10px;min-height:50px;padding:4px 8px 4px 14px;border-bottom:1px solid var(--line);background:#160f1dcc}
.sx-top h2{flex:1;margin:0;font-size:19px;font-weight:400;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sx-top small{color:var(--dim);font-size:16px}
.sx-x{min-width:48px;height:48px;border:0;background:none;color:var(--dim);font-size:26px;cursor:pointer}
.sx-btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;padding:6px 18px;border-radius:12px;border:1.5px solid var(--line);background:var(--panel2);cursor:pointer;font-size:19px;text-align:center}
.sx-btn:active{transform:scale(.98)}
.sx-btn.go{background:var(--gold);border-color:var(--gold);color:var(--gold-ink);font-weight:700}
.sx-btn.ghost{background:none}
.sx-btn:disabled{opacity:.45;cursor:default}
.sx-foot{flex:none;display:flex;gap:10px;padding:10px max(14px,calc((100% - 560px) / 2)) 14px;border-top:1px solid var(--line);background:#160f1dee}
.sx-foot .sx-btn{flex:1}
.sx-say{position:relative;padding:11px 14px;border-radius:4px 14px 14px 14px;background:#f0e6cf;color:#2a2030;font-size:19px;line-height:1.35;font-style:italic}
.sx-say b{font-style:normal;font-weight:400;display:block;font-size:16px;color:#6b5a48;letter-spacing:.04em;margin-bottom:2px;text-transform:uppercase}
.sx-lab{color:var(--dim);font-size:16px;letter-spacing:.03em}
.sx-card{border-radius:10px;background:#0b0710 center/cover no-repeat;box-shadow:0 6px 18px #000a,0 0 0 1.5px #e0b95e55}
.sx-fb{padding:12px 14px;border-radius:12px;border:2px solid var(--line);background:var(--panel)}
.sx-fb.ok{border-color:#3d7a52}.sx-fb.no{border-color:#9a4a42}.sx-fb.mercy{border-color:#b8964a}
.sx-fb h3{margin:0 0 4px;font-size:21px;font-weight:400}
.sx-fb p{margin:5px 0 0;font-size:18px}
.sx-num{font-family:Georgia,'Times New Roman',serif;font-variant-numeric:lining-nums}
.sx-in{animation:sxin .3s ease-out}
@keyframes sxin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes sxshake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(2px)}}
.sx-shake{animation:sxshake .42s ease-in-out}
@media (prefers-reduced-motion:reduce){.sx *{animation-duration:.01s !important;transition-duration:.01s !important}}
@media (min-width:720px){.sx{font-size:20px}.sx-col{padding-top:18px}}
`;

// A full-screen layer. parts: { title, onClose, body (array of nodes), foot (array of nodes) }.
// Returns { el, body, foot, close, setBody(...nodes), setFoot(...nodes) }.
export function screen({ title, sub, onClose, cls = '' } = {}) {
  css('sx-theme', CSS);
  const body = h('div.sx-body');
  const col = h('div.sx-col');
  body.append(col);
  const foot = h('div.sx-foot', { hidden: true });
  const top = title != null ? h('div.sx-top', h('h2', title, sub ? h('small', ` ${sub}`) : null), onClose ? h('button.sx-x', { 'aria-label': 'Chiudi', onclick: onClose }, '×') : null) : null;
  const el = h(`div.sx.${cls || 'sx-plain'}`, top, body, foot);
  const close = openOverlay(el);
  const api = {
    el, body, col, foot, close, top,
    setBody(...nodes) { col.replaceChildren(...nodes.flat(Infinity).filter(Boolean)); body.scrollTop = 0; },
    setFoot(...nodes) { const n = nodes.flat(Infinity).filter(Boolean); foot.replaceChildren(...n); foot.hidden = n.length === 0; },
    // bring an element into view with the least scrolling
    show(el) { el.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' }); },
    scrollDown() { body.scrollTo({ top: body.scrollHeight, behavior: reducedMotion() ? 'auto' : 'smooth' }); },
  };
  return api;
}

export const num = (v) => h('span.sx-num', String(v));
export const btn = (label, onclick, cls = '') => h(`button.sx-btn${cls ? '.' + cls.split(' ').join('.') : ''}`, { type: 'button', onclick }, label);
export const say = (who, text) => h('div.sx-say.sx-in', who ? h('b', who) : null, text);
// Waits for one tap on a button; resolves with the value. Convenience for linear flows.
export const choose = (scr, buttons) => new Promise((res) => {
  scr.setFoot(buttons.map(([label, value, cls]) => btn(label, () => res(value), cls)));
});

// A feedback box: kind 'ok' | 'no' | 'mercy'.
export const fb = (kind, title, ...paras) => h(`div.sx-fb.${kind}.sx-in`, h('h3', title), paras.flat().filter(Boolean).map((p) => (typeof p === 'string' ? h('p', p) : p)));
