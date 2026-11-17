// The threshold "Le carte di Salem" (docs/DESIGN.md "La soglia"): the witch's table at night. The moon grows
// one slice a day; the card on the table is the card of the day, turned with a tap; the slip of paper carries
// the note from the notebook, then the card's sentence for the day and a look at it. Below: "Continua" (or
// "Nuova partita"), a reading with her own deck, a short review. openTitle() -> 'new' | 'continue' | 'study'.
import { snd, mood } from './sfx.js';
import { h, css, openOverlay, cardUrl } from '../core/dom.js';
import { hasSave, state, loadTrouble } from '../core/state.js';
import { on } from '../core/bus.js';
import { call } from '../core/services.js';
import { titleOf } from '../core/progress.js';
import { restore, status, importCode, olderGame, takeOlder } from '../core/vault.js';
import { CARD } from '../data/cards.base.js';
import { MOON, moonName, moonPath } from '../glue/threshold.rules.js';
import { moonNow, touchMoon, giftToday, today, turnToday, noteToday, pairToday } from '../glue/threshold.js';
import { canSelfRead } from '../glue/selfread.rules.js';
import { openSelfRead } from './selfread.js';
import { openDayCard, dayCardUrl } from './daycard.js';
import { garden, gardenNote } from '../glue/garden.js';
import { CODE_CSS } from './savecode.js';
import { SERIF, HAND, GOLD, baseCss, rnd } from './paper.js';
import { cardBack } from './art.js';

const CSS = `
.tt{position:fixed;inset:0;z-index:50;overflow:hidden auto;display:flex;flex-direction:column;align-items:center;background:radial-gradient(ellipse 90% 340px at 50% 330px,#3a2414 0%,#1a1018 55%,#07070d 100%) #07070d;color:#efe4c8;font:16px ${SERIF};animation:gx-fade .6s;-webkit-overflow-scrolling:touch}
.tt-sky{position:absolute;left:0;right:0;top:0;height:330px;pointer-events:none}
.tt-sky i{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff6dc;animation:tt-tw 4s ease-in-out infinite}
@keyframes tt-tw{50%{opacity:.25}}
.tt-head{position:relative;flex:none;margin-top:calc(26px + env(safe-area-inset-top));text-align:center}
.tt-head h1{margin:0;font:400 30px/1 ${SERIF};letter-spacing:.02em;color:#f3e7c9;text-shadow:0 0 24px #d8b25a33}
.tt-moon{position:relative;flex:none;margin-top:14px;display:flex;flex-direction:column;align-items:center;gap:7px}
.tt-moon svg{display:block;filter:drop-shadow(0 0 14px #ffe9a833);transition:filter .8s}
.tt-moon.grew svg{filter:drop-shadow(0 0 22px #ffe9a8aa)}
.tt-dots{display:flex;gap:7px}.tt-dots i{width:8px;height:8px;border-radius:50%;border:1px solid #d8b25a88;transition:background .6s,box-shadow .6s}
.tt-dots i.on{background:#e6c26a;border-color:#e6c26a}.tt-dots i.new{box-shadow:0 0 8px 2px #ffe9a8}
.tt-moon p{margin:0;font:italic 15px ${SERIF};color:#b9a98a}
.tt-scene{position:relative;flex:none;height:214px;width:100%;max-width:520px;margin-top:2px}
.tt-table{position:absolute;left:calc(50% - 50vw);width:100vw;bottom:0;height:78px;background:linear-gradient(#2e1c12,#1a100b 60%,#120b0a);border-top:1px solid #5a3a22;box-shadow:0 -1px 0 #7a523366}
.tt-glow{position:absolute;left:50%;bottom:6px;width:300px;height:300px;margin-left:-150px;border-radius:50%;background:radial-gradient(circle,#ffc66a40,#ff9d3a14 45%,transparent 70%);animation:tt-gl 3.2s ease-in-out infinite;pointer-events:none}
@keyframes tt-gl{50%{transform:scale(.94);opacity:.85}}
.tt-candle{position:absolute;left:calc(50% + 44px);bottom:38px;width:28px}
.tt-candle .wax{position:absolute;bottom:0;left:0;width:28px;height:78px;border-radius:5px 5px 3px 3px;background:linear-gradient(90deg,#d8ccb0,#f4ead2 40%,#c7b896)}
.tt-candle .wick{position:absolute;bottom:78px;left:13px;width:2px;height:7px;background:#2a1a10}
.tt-candle .fl{position:absolute;bottom:82px;left:5px;width:18px;height:32px;border-radius:50% 50% 45% 45%/62% 62% 38% 38%;background:radial-gradient(ellipse at 50% 72%,#fff9e0 0 22%,#ffd36e 45%,#ff9b3a99 70%,transparent 75%);transform-origin:50% 90%;animation:tt-fl 1.7s ease-in-out infinite;filter:blur(.3px)}
@keyframes tt-fl{0%,100%{transform:scale(1,1) rotate(-1deg)}30%{transform:scale(.94,1.06) rotate(2deg)}60%{transform:scale(1.03,.95) rotate(-2deg)}}
.tt-card{position:absolute;left:calc(50% - 96px);bottom:20px;width:104px;height:178px;padding:0;border:0;background:none;cursor:pointer;transform:rotate(-7deg);filter:drop-shadow(0 10px 14px #000d);transition:transform .28s ease-in;-webkit-tap-highlight-color:transparent}
.tt-card.flip{transform:rotate(-7deg) scaleX(0)}
.tt-card.face{transform:rotate(-3deg)}
.tt-card.face.flip{transform:rotate(-3deg) scaleX(0)}
.tt-card img{display:block;width:104px;height:178px;object-fit:cover;border:4px solid #fbf5e6;border-radius:6px;box-sizing:border-box}
.tt-card.back svg{filter:drop-shadow(0 0 9px #ffd77a99);animation:tt-call 2.6s ease-in-out infinite}
@keyframes tt-call{50%{filter:drop-shadow(0 0 16px #ffd77a)}}
.tt-tap{position:absolute;left:calc(50% - 160px);width:230px;bottom:-6px;text-align:center;font:700 19px ${HAND};color:#ffe9a8;pointer-events:none}
.tt-slip{position:relative;flex:none;width:min(340px,calc(100% - 44px));margin-top:14px;padding:11px 16px 13px;background:linear-gradient(#f1e6c8,#e6d8b4);color:#3a2c1c;border-radius:3px 8px 4px 8px;box-shadow:0 8px 22px #000b;transform:rotate(-.6deg);font:21px/25px ${HAND}}
.tt-slip .lb{display:block;font:italic 14px/18px ${SERIF};color:#7a6a50;margin-bottom:2px}
.tt-slip b{display:block;font:700 26px/28px ${HAND}}
.tt-slip p{margin:0}.tt-slip p+p{margin-top:6px}
.tt-slip .kw{font-size:18px;line-height:22px;color:#5a4a34}
.tt-slip .gift{margin:0 0 8px;padding-bottom:8px;border-bottom:1px dashed #a8946c}
.tt-slip .gift i{display:block;font:italic 16px/21px ${SERIF};color:#5a4a34;margin-top:3px}
.tt-more{display:inline-block;margin-top:8px;padding:4px 0;border:0;background:none;color:#7a3b22;font:700 20px ${HAND};text-decoration:underline;text-underline-offset:4px;cursor:pointer}
.tt-acts{position:relative;flex:none;display:flex;flex-direction:column;gap:9px;width:min(340px,calc(100% - 44px));margin:16px 0 0}
.tt-b{min-height:52px;border-radius:6px;border:1px solid #d8b25a66;background:#0b0a10b0;color:#f1e6cb;font:21px ${SERIF};cursor:pointer;letter-spacing:.02em;-webkit-tap-highlight-color:transparent;transition:background .2s,border-color .2s}
.tt-b:hover,.tt-b:focus-visible{background:#2a2016;border-color:${GOLD};outline:none}
.tt-b.main{border-color:${GOLD};background:#2a2016d0;min-height:58px}
.tt-b small{display:block;font:italic 14px/16px ${SERIF};color:#b9a98a;letter-spacing:0;margin-top:2px}
.tt-row{display:flex;gap:9px}.tt-row .tt-b{flex:1;min-height:62px;font-size:18px;line-height:1.15;padding:4px 6px}
.tt-row.three{gap:7px}.tt-row.three .tt-b{flex:1 1 0;min-width:0;font-size:17px;padding:4px 3px}.tt-row.three .tt-b small{font-size:13px;line-height:15px}
.tt-foot{flex:none;display:flex;gap:18px;justify-content:center;margin:8px 0 calc(18px + env(safe-area-inset-bottom))}
.tt-s{margin:2px 0 0;text-align:center;font:18px/22px ${HAND};color:#b9a98a;min-height:22px}
.tt-l{border:0;background:none;color:#cdbf9f;font:17px ${SERIF};text-decoration:underline;text-underline-offset:4px;min-height:40px;cursor:pointer}
.tt-area{display:block;width:100%;height:96px;box-sizing:border-box;padding:8px;border-radius:6px;border:1px solid #d8b25a66;background:#0b0a10;color:#e9dcc0;font:13px/1.3 ui-monospace,monospace;resize:none;user-select:text;-webkit-user-select:text}
.tt-q{margin:0 0 4px;text-align:center;font:22px/28px ${HAND};color:#e9dcc0}
@media (min-height:880px){.tt-head{margin-top:calc(44px + env(safe-area-inset-top))}.tt-scene{height:232px}}
@media (prefers-reduced-motion:reduce){.tt-card,.tt-card.back svg,.tt-glow,.tt-candle .fl,.tt-sky i{animation:none;transition:none}}
`;

const WEEK = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const dateIt = (d = new Date()) => `${WEEK[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
const chapterName = () => (state.chapter <= 0 ? 'Prologo' : state.chapter >= 4 ? 'Dopo il finale' : `Capitolo ${state.chapter}`);

export function openTitle() {
  baseCss(); css('ui-title', CSS); css('ui-savecode', CODE_CSS);
  mood('title');
  return new Promise((resolve) => {
    const sky = h('div.tt-sky');
    const r = rnd(7);
    for (let i = 0; i < 40; i++) sky.append(h('i', { style: { left: `${r() * 100}%`, top: `${r() * 100}%`, opacity: String(0.3 + r() * 0.6), animationDelay: `${(r() * 4).toFixed(2)}s`, transform: `scale(${(0.6 + r() * 0.9).toFixed(2)})` } }));
    const moonEl = h('div.tt-moon'), cardEl = h('button.tt-card', { type: 'button' }), tapEl = h('span.tt-tap'), slip = h('div.tt-slip'), acts = h('div.tt-acts'), foot = h('div.tt-foot');
    const scene = h('div.tt-scene', h('div.tt-glow'), h('div.tt-table'), cardEl, tapEl, h('div.tt-candle', h('span.wick'), h('span.fl'), h('span.wax')));
    const el = h('div.tt', { role: 'dialog', 'aria-label': 'Le carte di Salem' }, sky, h('div.tt-head', h('h1', {}, 'Le carte di Salem')), moonEl, scene, slip, acts, foot);
    const close = openOverlay(el);
    const b = (t, fn, main, sub) => h(`button.tt-b${main ? '.main' : ''}`, { type: 'button', onclick: () => { snd('tap'); fn(); } }, t, sub ? h('small', {}, sub) : null);
    const link = (t, fn) => h('button.tt-l', { type: 'button', onclick: () => { snd('tap'); fn(); } }, t);
    let mode = 'wait', older = null, off = () => {};
    const done = (v) => { if (v !== 'study') touchMoon(); off(); close(); resolve(v); };

    // ---- the moon
    const moon = (grew = false) => {
      const n = moonNow();
      const svg = `<svg width="74" height="74" viewBox="0 0 74 74" aria-hidden="true"><defs><radialGradient id="ttm" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#fff7d8"/><stop offset=".6" stop-color="#e9d595"/><stop offset="1" stop-color="#c9b06a"/></radialGradient></defs><circle cx="37" cy="37" r="36" fill="#15131f" stroke="#d8b25a55"/><path d="${moonPath(n)}" fill="url(#ttm)"/></svg>`;
      const dots = h('div.tt-dots', Array.from({ length: MOON }, (_, i) => h(`i${i < n ? '.on' : ''}${grew && i === n - 1 ? '.new' : ''}`)));
      moonEl.replaceChildren(h('span', { html: svg }), dots, h('p', {}, n >= MOON ? 'Luna piena: sette notti passate di qui' : grew ? `Stanotte la luna è cresciuta: ${n} ${n === 1 ? 'notte' : 'notti'} su ${MOON}` : n === 0 ? 'La luna cresce ogni giorno che passi di qui' : `${moonName(n)}: ${n} ${n === 1 ? 'notte' : 'notti'} su ${MOON}, e alla luna piena un dono`));
      moonEl.setAttribute('aria-label', `La luna: ${n} notti su ${MOON}`);
      moonEl.classList.toggle('grew', grew);
    };
    // ---- the card of the day and the slip of paper
    const giftBlock = () => { const g = giftToday(); return g ? h('p.gift', {}, `La luna è piena. Sul tavolo trovi ${g.gift}.`, h('i', {}, `«${g.line}»`)) : null; };
    const table = () => {
      const t = today();
      cardEl.className = `tt-card ${t.turned ? 'face' : 'back'}`;
      cardEl.setAttribute('aria-label', t.turned ? `${t.name}: guarda la carta` : 'Gira la carta di oggi');
      if (t.turned) cardEl.replaceChildren(h('img', { src: dayCardUrl(t.card), alt: t.name })); else { cardEl.innerHTML = cardBack(104, 178); new Image().src = dayCardUrl(t.card); } // (loaded ahead, so it is there when she turns it)
      tapEl.textContent = t.turned ? '' : 'Gira la carta di oggi';
      if (!t.turned) { const n = noteToday(); slip.replaceChildren(...[giftBlock(), h('span.lb', {}, `Dal quaderno · ${WEEK[new Date().getDay()]}`), h('p', {}, n?.t || 'Stanotte il quaderno è rimasto chiuso.')].filter(Boolean)); return; }
      slip.replaceChildren(...[giftBlock(), h('span.lb', {}, `La carta di oggi · ${dateIt()}`), h('b', {}, t.name), h('p', {}, t.oggi)].filter(Boolean));
      tapEl.textContent = 'Tocca la carta per guardarla';
    };
    cardEl.onclick = async () => {
      const first = !today().turned;
      snd(first ? 'card' : 'tap');
      if (first) turnToday();
      await openDayCard({ flip: first });
      table();
      moon(!!touchMoon()); // she sees it grow, back at the table
    };
    // ---- the ways in
    const aside = async (fn) => { el.style.visibility = 'hidden'; try { await fn(); } finally { el.style.visibility = ''; mood('title'); const g = touchMoon(); moon(!!g); table(); menu(); } };
    const where = () => {
      if (!hasSave()) return loadTrouble ? 'Ho trovato una partita che non riesco a leggere: l\'ho messa da parte.' : '';
      return status().cloud === true ? 'partita salvata anche online' : 'partita salvata su questo telefono';
    };
    const menu = () => {
      mode = 'menu';
      const saved = hasSave(), pair = saved ? pairToday() : [];
      const row = [saved && canSelfRead(state) ? b('Leggi le tue carte', () => aside(() => openSelfRead()), false, 'con il mazzo vero') : null,
        pair.length ? b(pair.length > 1 ? 'Ripassa due carte' : 'Ripassa una carta', () => aside(() => call('review.open', { ids: pair, n: pair.length })), false, 'le più indietro, un minuto') : null,
        saved && garden().unlocked ? b('L\'orto', () => aside(() => call('garden.open', { from: 'table' })), false, gardenNote()) : null].filter(Boolean);
      acts.replaceChildren(...[
        saved ? b('Continua', () => done('continue'), true, `${state.player?.name ? `${state.player.name} · ` : ''}${chapterName()} · ${titleOf()}`) : b('Nuova partita', () => done('new'), true),
        !saved && older ? b('Riprendi la partita di prima', async () => { if (await takeOlder()) done('continue'); }) : null,
        row.length ? h(`div.tt-row${row.length > 2 ? '.three' : ''}`, row) : null].filter(Boolean));
      foot.replaceChildren(link('Grimorio', () => done('study')), link('Altro', more));
    };
    const more = () => {
      mode = 'more';
      acts.replaceChildren(...[hasSave() ? b('Nuova partita', confirm) : null, b('Ho un codice', code), b('Torno indietro', menu, true), h('p.tt-s', {}, where())].filter(Boolean));
      foot.replaceChildren();
    };
    const confirm = () => {
      mode = 'ask';
      acts.replaceChildren(h('p.tt-q', {}, 'Ricominciare da capo? La partita di adesso viene messa da parte.'),
        b('Sì, ricomincio', () => done('new')), b('No, torno indietro', menu, true));
      foot.replaceChildren();
    };
    const code = () => {
      mode = 'code';
      const area = h('textarea.tt-area', { placeholder: 'Incolla qui il codice della partita', 'aria-label': 'Il codice della partita', autocapitalize: 'off', autocomplete: 'off', spellcheck: false });
      const said = h('p.tt-s', {}, '');
      acts.replaceChildren(area, b('Riprendi da questo codice', async () => {
        if (await importCode(area.value)) done('continue'); else said.textContent = 'Questo codice non lo riconosco: controlla di averlo incollato tutto.';
      }, true), b('Torno indietro', menu), said);
      foot.replaceChildren();
    };
    off = on('vault', () => { if (mode === 'menu') { moon(); table(); menu(); } });
    moon(); table();
    // with no game here, look in the other places before offering a new one (a few seconds at most)
    if (hasSave()) menu(); else acts.replaceChildren(h('p.tt-q', {}, 'Cerco la tua partita…'));
    Promise.race([restore(), new Promise((r2) => setTimeout(r2, 9000))]).then(async () => { older = hasSave() ? null : await olderGame().catch(() => null); if (mode === 'wait' || mode === 'menu') { moon(); table(); menu(); } });
  });
}
