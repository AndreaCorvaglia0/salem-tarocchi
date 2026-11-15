// The title screen "Le carte di Salem": night, a candle on a table, a card back. Three ways in:
// "Continua" (only with a save), "Nuova partita" (asks first when a save exists), "Sfoglia il
// grimorio" (study, without playing). openTitle() -> 'new' | 'continue' | 'study'.
import { snd, mood } from './sfx.js';
import { h, css, openOverlay } from '../core/dom.js';
import { hasSave } from '../core/state.js';
import { SERIF, HAND, GOLD, baseCss, rnd } from './paper.js';
import { cardBack } from './art.js';

const CSS = `
.tt{position:fixed;inset:0;z-index:50;overflow:hidden;display:flex;flex-direction:column;align-items:center;background:radial-gradient(ellipse 70% 45% at 50% 64%,#3a2414 0%,#1a1018 45%,#07070d 80%);color:#efe4c8;font:16px ${SERIF};animation:gx-fade .6s}
.tt-sky{position:absolute;inset:0 0 45% 0;pointer-events:none}
.tt-sky i{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff6dc;animation:tt-tw 4s ease-in-out infinite}
@keyframes tt-tw{50%{opacity:.25}}
.tt-head{position:relative;margin-top:calc(9vh + env(safe-area-inset-top));text-align:center}
.tt-head h1{margin:0;font:400 46px/1.05 ${SERIF};letter-spacing:.01em;color:#f3e7c9;text-shadow:0 0 24px #d8b25a33}
.tt-head p{margin:10px 0 0;font:italic 19px ${SERIF};color:#b9a98a}
.tt-scene{position:relative;flex:1;min-height:200px;width:100%;max-width:520px}
.tt-table{position:absolute;left:calc(50% - 50vw);width:100vw;bottom:-14px;height:calc(34% + 14px);background:linear-gradient(#2e1c12,#1a100b 55%,transparent);border-top:1px solid #5a3a22;box-shadow:0 -1px 0 #7a523366}
.tt-glow{position:absolute;left:50%;bottom:24%;width:360px;height:360px;margin-left:-180px;border-radius:50%;background:radial-gradient(circle,#ffc66a40,#ff9d3a14 45%,transparent 70%);animation:tt-gl 3.2s ease-in-out infinite;pointer-events:none}
@keyframes tt-gl{50%{transform:scale(.94);opacity:.85}}
.tt-candle{position:absolute;left:58%;bottom:22%;width:34px}
.tt-candle .wax{position:absolute;bottom:0;left:0;width:34px;height:96px;border-radius:5px 5px 3px 3px;background:linear-gradient(90deg,#d8ccb0,#f4ead2 40%,#c7b896)}
.tt-candle .wax::before{content:'';position:absolute;top:-2px;left:4px;width:12px;height:22px;border-radius:0 0 8px 8px;background:#efe4c8}
.tt-candle .wick{position:absolute;bottom:96px;left:16px;width:2px;height:8px;background:#2a1a10}
.tt-candle .fl{position:absolute;bottom:100px;left:7px;width:20px;height:38px;border-radius:50% 50% 45% 45%/62% 62% 38% 38%;background:radial-gradient(ellipse at 50% 72%,#fff9e0 0 22%,#ffd36e 45%,#ff9b3a99 70%,transparent 75%);transform-origin:50% 90%;animation:tt-fl 1.7s ease-in-out infinite;filter:blur(.3px)}
@keyframes tt-fl{0%,100%{transform:scale(1,1) rotate(-1deg)}30%{transform:scale(.94,1.06) rotate(2deg)}60%{transform:scale(1.03,.95) rotate(-2deg)}}
.tt-card{position:absolute;left:calc(50% - 108px);bottom:15%;transform:rotate(-9deg);filter:drop-shadow(0 10px 14px #000d) brightness(.92)}
.tt-acts{position:relative;display:flex;flex-direction:column;gap:12px;width:min(320px,calc(100% - 48px));margin:22px 0 calc(34px + env(safe-area-inset-bottom))}
.tt-b{min-height:52px;border-radius:6px;border:1px solid #d8b25a66;background:#0b0a10b0;color:#f1e6cb;font:21px ${SERIF};cursor:pointer;letter-spacing:.02em;-webkit-tap-highlight-color:transparent;transition:background .2s,border-color .2s}
.tt-b:hover,.tt-b:focus-visible{background:#2a2016;border-color:${GOLD};outline:none}
.tt-b.main{border-color:${GOLD};background:#2a2016d0}
.tt-q{margin:0 0 4px;text-align:center;font:22px/28px ${HAND};color:#e9dcc0}
@media (min-width:720px){.tt-head h1{font-size:64px}.tt-head{margin-top:8vh}}
@media (max-height:640px){.tt-head{margin-top:3vh}.tt-head h1{font-size:38px}}
`;

export function openTitle() {
  baseCss(); css('ui-title', CSS);
  mood('title');
  return new Promise((resolve) => {
    const sky = h('div.tt-sky');
    const r = rnd(7);
    for (let i = 0; i < 46; i++) sky.append(h('i', { style: { left: `${r() * 100}%`, top: `${r() * 100}%`, opacity: String(0.3 + r() * 0.6), animationDelay: `${(r() * 4).toFixed(2)}s`, transform: `scale(${(0.6 + r() * 0.9).toFixed(2)})` } }));
    const scene = h('div.tt-scene', h('div.tt-glow'), h('div.tt-table'), h('div.tt-card', { html: cardBack(104, 178) }),
      h('div.tt-candle', h('span.wick'), h('span.fl'), h('span.wax')));
    const acts = h('div.tt-acts');
    const el = h('div.tt', { role: 'dialog', 'aria-label': 'Le carte di Salem' }, sky,
      h('div.tt-head', h('h1', {}, 'Le carte', h('br'), 'di Salem'), h('p', {}, 'Arrivano a chi le sa guardare.')), scene, acts);
    const close = openOverlay(el);
    const done = (v) => { close(); resolve(v); };
    const b = (t, fn, main) => h(`button.tt-b${main ? '.main' : ''}`, { type: 'button', onclick: () => { snd('tap'); fn(); } }, t);
    const menu = () => {
      const saved = hasSave();
      acts.replaceChildren(...[
        saved ? b('Continua', () => done('continue'), true) : null,
        b('Nuova partita', () => (saved ? confirm() : done('new')), !saved),
        b('Sfoglia il grimorio', () => done('study'))].filter(Boolean));
      acts.querySelector('button')?.focus({ preventScroll: true });
    };
    const confirm = () => {
      acts.replaceChildren(h('p.tt-q', {}, 'Ricominciare da capo? La partita salvata si perde.'),
        b('Sì, ricomincio', () => done('new')), b('No, torno indietro', menu, true));
    };
    menu();
  });
}
