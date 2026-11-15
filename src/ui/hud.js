// What stays on screen while playing (docs/DESIGN.md: "il prossimo passo in una riga e la barra del
// livello. Nient'altro."): a paper slip with the next step and the level bar, and the grimoire button.
// It listens to the bus: the step line changes with a stroke of red pencil, the bar fills, a level up
// is a short full-width moment, "la tua carta" changing, a star, coins. hud.toast(text) for the rest.
import { snd } from './sfx.js';
import { h, css, openOverlay, cardUrl, reducedMotion } from '../core/dom.js';
import { on } from '../core/bus.js';
import { call, has } from '../core/services.js';
import { state, save } from '../core/state.js';
import { CARD } from '../data/cards.base.js';
import { levelProgress, titleOf } from '../core/progress.js';
import { INK, RED, HAND, SERIF, GOLD, PENCIL, baseCss, paperBg, inkBar, svgEl } from './paper.js';
import { book, starMark } from './art.js';
import { nextStep } from './logic.js';

const CSS = `
.hud{position:fixed;left:0;right:0;top:0;z-index:20;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:calc(8px + env(safe-area-inset-top)) 10px 0;pointer-events:none!important}
.hud>*{pointer-events:auto}
.hud-slip{position:relative;max-width:min(470px,calc(100vw - 92px));padding:6px 14px 8px 14px;background:${paperBg()};color:${INK};border-radius:2px 6px 3px 7px;box-shadow:0 4px 12px #000a;transform:rotate(-.6deg);font:21px/26px ${HAND};cursor:pointer;-webkit-tap-highlight-color:transparent}
.hud-slip::before{content:'';position:absolute;top:-6px;left:22px;width:46px;height:14px;background:#e6d9aacc;transform:rotate(-4deg);box-shadow:0 1px 2px #0003}
.hud-step{position:relative;display:flex;align-items:flex-start;gap:7px;min-height:26px;padding-bottom:2px;border-bottom:1px dashed ${PENCIL}66}
.hud-step .ar{flex:none;display:inline-grid;place-items:center;width:22px;height:22px;margin-top:2px}
.hud-step .ar svg{display:block}
.hud-step .t{display:block;flex:1;min-width:0;white-space:normal;overflow-wrap:break-word;text-wrap:pretty}
.hud-slip.asked .hud-step .ar svg{animation:hud-spin 1s ease-out}
@keyframes hud-spin{from{transform:rotate(-200deg)}}
.hud-step.out .t{animation:hud-out .5s forwards}
.hud-step .strike{position:absolute;left:18px;top:50%;height:2px;width:0;background:${RED};transform:rotate(-1.5deg);transition:width .35s}
.hud-step.in .t{animation:hud-in .7s both}
@keyframes hud-out{0%{opacity:1}60%{opacity:1}100%{opacity:0}}
@keyframes hud-in{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
.hud-lv{display:flex;align-items:center;gap:10px;margin-top:2px;font-size:19px;line-height:22px;color:${PENCIL}}
.hud-plus{position:absolute;right:10px;bottom:4px;color:${RED};font:700 19px ${HAND};animation:hud-plus 1.2s forwards;pointer-events:none}
@keyframes hud-plus{from{opacity:0;transform:translateY(4px)}20%{opacity:1}to{opacity:0;transform:translateY(-14px)}}
.hud-book{flex:none;display:grid;place-items:center;width:56px;height:56px;padding:0;border-radius:14px;border:1px solid #6a5a48;background:#1a1420d8;box-shadow:0 4px 12px #000a;cursor:pointer;-webkit-tap-highlight-color:transparent}
.hud-book:hover,.hud-book:focus-visible{outline:2px solid ${GOLD};outline-offset:2px}
.hud-book.pulse{animation:hud-pulse .6s 2}
.hud-book.beckon{animation:hud-pulse 1.4s ease-in-out infinite;border-color:${GOLD}}
@keyframes hud-pulse{50%{transform:scale(1.12);box-shadow:0 0 18px ${GOLD}aa}}
.hud-toasts{position:fixed;left:0;right:0;bottom:calc(92px + env(safe-area-inset-bottom));z-index:25;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none!important}
.hud-toast{display:flex;align-items:center;gap:10px;max-width:calc(100vw - 40px);padding:8px 16px;background:${paperBg()};color:${INK};border-radius:3px 8px 4px 8px;box-shadow:0 6px 18px #000b;font:21px/26px ${HAND};animation:gx-in .3s;transition:opacity .4s,transform .4s}
.hud-toast.bye{opacity:0;transform:translateY(8px)}
.hud-toast img{width:38px;height:65px;object-fit:cover;border:2px solid #fbf5e6;border-radius:2px;box-shadow:0 2px 4px #0005}
.hud-toast small{display:block;color:${PENCIL};font-size:18px;line-height:20px}
.hud-lvup{position:fixed;inset:0;z-index:85;display:grid;place-items:center;background:#05040a66;cursor:pointer;animation:gx-fade .25s}
.hud-band{position:relative;width:100%;padding:26px 20px 24px;background:linear-gradient(90deg,transparent,#120e18f2 14%,#120e18f2 86%,transparent);text-align:center;color:#f3e7c9;transform-origin:50% 50%;animation:hud-band .45s cubic-bezier(.2,.8,.2,1) both}
.hud-band::before,.hud-band::after{content:'';position:absolute;left:12%;right:12%;height:1px;background:linear-gradient(90deg,transparent,${GOLD},transparent)}
.hud-band::before{top:8px}.hud-band::after{bottom:8px}
@keyframes hud-band{from{transform:scaleY(0);opacity:0}to{transform:none;opacity:1}}
.hud-band .k{font:italic 19px ${SERIF};color:#c9b98f;letter-spacing:.06em}
.hud-band .lv{font:400 54px/1.05 ${SERIF};color:#fff3d2;text-shadow:0 0 30px ${GOLD}88;animation:gx-in .5s .15s both}
.hud-band .ti{font:700 27px/32px ${HAND};color:${GOLD};margin-top:4px;animation:gx-in .5s .35s both}
.hud-band .gf{font:22px/28px ${HAND};color:#e9dcc0;margin-top:6px;animation:gx-in .5s .5s both}
.hud-band .spark{position:absolute;top:50%;left:50%;width:4px;height:4px;border-radius:50%;background:${GOLD};box-shadow:0 0 8px ${GOLD};animation:hud-spark 1.1s ease-out both}
@keyframes hud-spark{from{transform:translate(-50%,-50%);opacity:1}to{transform:translate(var(--dx),var(--dy));opacity:0}}
.hud-lvup.bye{opacity:0;transition:opacity .35s}
`;

// a small compass: the next-step line can be tapped to see the way
const COMPASS = `<svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="none" stroke="${PENCIL}" stroke-width="1.4"/><path d="M11 3.5 L13.4 11 L11 18.5 L8.6 11 Z" fill="${RED}"/><path d="M11 11 L13.4 11 L11 18.5 L8.6 11 Z" fill="${INK}"/><circle cx="11" cy="11" r="1.3" fill="#f3e7c9"/></svg>`;

let mounted = null;
const queue = [];
let showing = false;

function toastsBox() {
  let box = document.querySelector('.hud-toasts');
  if (!box) { box = h('div.hud-toasts'); openOverlay(box, { block: false }); }
  return box;
}

export function toast(text, { icon = null, card = null, small = null, ms = 2600 } = {}) {
  baseCss(); css('ui-hud', CSS);
  const t = h('div.hud-toast', { role: 'status' }, card ? h('img', { src: cardUrl(card), alt: '' }) : null, icon ? (typeof icon === 'string' && icon.startsWith('<') ? svgEl(icon) : h('span', {}, icon)) : null, h('span', {}, text, small ? h('small', {}, small) : null));
  const box = toastsBox();
  box.append(t);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => { t.classList.add('bye'); setTimeout(() => t.remove(), 450); }, ms);
}

// the level-up moment: about two seconds, tap to dismiss; queued, and held while a ceremony is open
function levelUp({ level, title, gift } = {}) { queue.push({ level, title, gift }); pump(); }
async function pump() {
  if (showing || !queue.length) return;
  if (document.querySelector('.fd')) { setTimeout(pump, 400); return; }
  showing = true;
  const { level, title, gift } = queue.shift();
  const changed = level > 1 && titleOf(level - 1) !== title;
  const band = h('div.hud-band', h('div.k', {}, 'Sali di livello'), h('div.lv', {}, `Livello ${level}`),
    changed ? h('div.ti', {}, `Ora sei ${title}.`) : null, gift?.text ? h('div.gf', {}, gift.text) : null);
  if (!reducedMotion()) for (let i = 0; i < 14; i++) { const a = (i / 14) * 6.28; band.append(h('i.spark', { style: `--dx:${Math.cos(a) * (120 + (i % 3) * 50)}px;--dy:${Math.sin(a) * (50 + (i % 2) * 30)}px;animation-delay:${0.1 + (i % 4) * 0.05}s` })); }
  const el = h('div.hud-lvup', { role: 'status' }, band);
  const close = openOverlay(el, { block: false });
  let gone = false;
  const bye = () => { if (gone) return; gone = true; el.classList.add('bye'); setTimeout(() => { close(); showing = false; pump(); }, 350); };
  el.onclick = bye;
  setTimeout(bye, changed ? 2600 : 2100);
}

export function mountHud() {
  baseCss(); css('ui-hud', CSS);
  if (mounted) return mounted;
  const stepT = h('span.t');
  const step = h('span.hud-step', h('span.ar', { 'aria-hidden': 'true' }, svgEl(COMPASS)), stepT);
  const lvT = h('span');
  const bar = inkBar(0, { w: 110, h: 11 });
  const slip = h('div.hud-slip', { role: 'button', tabindex: '0', 'aria-label': 'Prossimo passo: mostrami la strada' }, step, h('div.hud-lv', lvT, bar));
  const bk = h('button.hud-book', { type: 'button', 'aria-label': 'Grimorio' }, svgEl(book({ size: 40 })));
  const el = h('div.hud', slip, bk);
  const open = (tab) => call('grimoire.open', { tab });
  bk.onclick = () => { snd('tap'); open('io'); };
  // the next-step line: from chapter 2 it shows the trail for a few seconds (glue/hints.js); while the
  // trail is always on (chapters 0-1), or with no world, it opens the map
  const ask = async () => {
    snd('tap');
    slip.classList.remove('asked'); void slip.offsetWidth; slip.classList.add('asked');
    const shown = has('guide.ask') ? await call('guide.ask') : false;
    if (!shown) open('mappa');
  };
  slip.onclick = ask;
  slip.onkeydown = (e) => { if (e.key === 'Enter') ask(); };
  // the grimoire beckons after the first card, until she opens it once
  const once = () => state.world?.once || {};
  const beckon = () => bk.classList.toggle('beckon', !!once()['hint.grimoire'] && !once()['grimoire.opened']);
  beckon();
  const drawLevel = () => { const lp = levelProgress(); lvT.textContent = `${titleOf(lp.level)} · ${lp.level}`; bar.set(lp.top ? 1 : lp.into); };
  stepT.textContent = nextStep().text;
  drawLevel();
  openOverlay(el, { block: false });
  const offs = [
    on('step', () => {
      const text = nextStep().text;
      if (text === stepT.textContent) return;
      if (reducedMotion()) { stepT.textContent = text; return; }
      const strike = h('span.strike');
      step.append(strike);
      requestAnimationFrame(() => { strike.style.width = `${Math.min(stepT.offsetWidth, 400)}px`; });
      step.classList.add('out');
      setTimeout(() => { strike.remove(); step.classList.remove('out'); stepT.textContent = text; step.classList.remove('in'); void step.offsetWidth; step.classList.add('in'); }, 520);
    }),
    on('xp', ({ n } = {}) => { drawLevel(); if (n > 0) slip.append(h('span.hud-plus', {}, `+${n}`)); setTimeout(() => slip.querySelector('.hud-plus')?.remove(), 1300); }),
    on('level:up', (d) => { drawLevel(); levelUp(d); }),
    on('yourcard:changed', ({ to } = {}) => { if (CARD[to]) toast('Le carte ti vedono diversa.', { card: to, small: CARD[to].name, ms: 3400 }); }),
    on('card:star', ({ id, stars } = {}) => { if (CARD[id]) toast(`${CARD[id].name}: ${stars === 1 ? 'una stella' : `${stars} stelle`}.`, { icon: starMark(true, 22) }); }),
    on('coins', ({ n } = {}) => { if (n > 0) toast(`+${n} monete`); }),
    on('cinema', (v) => { el.style.visibility = v ? 'hidden' : ''; }), // film bars and sessions: nothing of the HUD peeks through
    on('hint', ({ id } = {}) => { if (id === 'grimoire') beckon(); }),
    on('grimoire:open', () => { const o = state.world.once || (state.world.once = {}); if (!o['grimoire.opened']) { o['grimoire.opened'] = true; save(); } beckon(); }),
    on('card:found', () => { if (!step.classList.contains('out')) stepT.textContent = nextStep().text; bk.classList.remove('pulse'); void bk.offsetWidth; bk.classList.add('pulse'); }),
  ];
  mounted = { el, unmount: () => { offs.forEach((f) => f()); el.remove(); mounted = null; } };
  return mounted;
}
