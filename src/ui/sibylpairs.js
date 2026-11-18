// The sibyl pairs game (notes/sibilla-coppie.md): a market stall, an everyday question on a slip, two (or three)
// of her figures face down. She turns them, says what they say together (three phrasings or her own words),
// then sees how they are usually read and what Ginepra says. No right or wrong, no score: only a mark on the
// figures for the first rounds of the day (the dots at the top).
//   openPairs({ state, day, onRound }) -> Promise resolved on close.
//   onRound(cards, choice) -> { counted, left }: the glue records the round (glue/sibylpairs.js).
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { snd } from './sfx.js';
import { onEscape } from './book.js';
import { HAND, SERIF, INK, PENCIL, RED, GOLD, paperBg } from './paper.js';
import { SIBYL, sibylUrl } from '../data/sibyl.js';
import { QUESTION } from '../data/sibylpairs.js';
import { deal, options, tradition, ginepra, leftToday, PER_DAY } from '../glue/sibylpairs.rules.js';

const CSS = `
.sp{position:fixed;inset:0;z-index:110;display:flex;flex-direction:column;overflow:hidden;color:${INK};font:20px/27px ${HAND};font-synthesis:none;
 background:repeating-linear-gradient(90deg,#00000000 0 62px,#00000022 62px 64px),linear-gradient(180deg,#6b4428,#5a3820 40%,#4a2d19);opacity:0;transition:opacity .3s}
.sp.on{opacity:1}
.sp-awn{flex:none;position:relative;padding:calc(8px + env(safe-area-inset-top)) 12px 18px 16px;display:flex;align-items:center;gap:10px;
 background:repeating-linear-gradient(90deg,#b23a2c 0 34px,#f1e4c4 34px 68px);box-shadow:0 6px 10px #0006}
.sp-awn::after{content:'';position:absolute;left:0;right:0;bottom:-10px;height:12px;background:radial-gradient(circle at 17px -4px,#b23a2c 15px,transparent 16px) 0 0/68px 12px repeat-x,radial-gradient(circle at 51px -4px,#f1e4c4 15px,transparent 16px) 0 0/68px 12px repeat-x}
.sp-title{flex:1;margin:0;padding:2px 12px;border-radius:8px;background:#1d140ecc;color:#f6ecd2;font:400 22px/30px ${SERIF};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sp-day{display:flex;align-items:center;gap:4px;padding:2px 9px;border-radius:8px;background:#1d140ecc;color:#e9dcc0;font:17px/26px ${HAND}}
.sp-day i{width:9px;height:9px;border-radius:50%;border:1.5px solid ${GOLD};box-sizing:border-box}.sp-day i.on{background:${GOLD}}
.sp-x{flex:none;width:44px;height:44px;border:1px solid #ffffff40;border-radius:50%;background:#1d140ecc;color:#fff7e2;font:26px/1 ${SERIF};cursor:pointer}
.sp-q{flex:none;align-self:center;margin:18px 16px 4px;max-width:340px;padding:6px 18px 8px;background:${paperBg()};box-shadow:0 3px 8px #0007;transform:rotate(-1.2deg);text-align:center}
.sp-q small{display:block;font:17px/20px ${HAND};color:${PENCIL}}
.sp-q b{font:700 23px/28px ${HAND}}
.sp-cloth{flex:none;position:relative;margin:10px 10px 0;padding:14px 8px 10px;border-radius:6px;background:radial-gradient(ellipse at 50% 30%,#2f5a46,#1f3d30 70%,#183126);box-shadow:inset 0 0 0 3px #d8b25a55,0 6px 14px #0008;display:flex;justify-content:center;gap:14px;transition:padding .4s}
.sp-cloth::before{content:'';position:absolute;top:-17px;right:26px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#a8683a,#5e3216);box-shadow:-19px 3px 0 -2px #6e3c1c,-8px -9px 0 -1px #7a4422}
.sp-slot{display:flex;flex-direction:column;align-items:center;width:var(--w);transition:width .4s}
.sp-card{position:relative;width:100%;aspect-ratio:600/977;padding:0;border:0;background:none;cursor:pointer;perspective:900px;-webkit-tap-highlight-color:transparent;animation:sp-in .45s both}
.sp-card:nth-child(2){animation-delay:.08s}
@keyframes sp-in{from{opacity:0;transform:translateY(-26px) rotate(-6deg)}to{opacity:1;transform:none}}
.sp-face{position:absolute;inset:0;border-radius:6px;overflow:hidden;box-shadow:0 6px 14px #000a;transition:transform .18s ease-in}
.sp-card.turning .sp-face{transform:scaleX(0)}
.sp-back{border:4px solid #f1e4c4;box-sizing:border-box;background:radial-gradient(circle at 50% 50%,${GOLD} 0 9px,transparent 10px),repeating-linear-gradient(45deg,transparent 0 9px,#d8b25a77 9px 10px),repeating-linear-gradient(-45deg,transparent 0 9px,#d8b25a77 9px 10px),#6b1f1a}
.sp-front{display:none;background:#efe4c8}
.sp-front img{display:block;width:100%;height:100%;object-fit:cover}
.sp-card.up .sp-front{display:block}.sp-card.up .sp-back{display:none}.sp-card.up{cursor:default}
.sp-card:not(.up)::after{content:'tocca';position:absolute;left:50%;bottom:-2px;transform:translate(-50%,50%);padding:0 9px;border-radius:9px;background:#f1e4c4;color:${INK};font:17px/22px ${HAND};box-shadow:0 2px 4px #0006}
.sp-cap{min-height:44px;margin-top:8px;text-align:center;color:#f6ecd2;opacity:0;transition:opacity .4s}
.sp-cap.on{opacity:1}
.sp-cap b{display:block;font:700 19px/22px ${HAND}}
.sp-cap span{display:block;font:17px/20px ${HAND};color:#e3d5b4}
.sp-panel{flex:1 1 auto;min-height:0;margin:12px 0 0;padding:14px 20px calc(16px + env(safe-area-inset-bottom));background:${paperBg()};box-shadow:0 -6px 14px #0007;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.sp-panel h3{margin:0 0 8px;font:700 22px/28px ${HAND}}
.sp-hint{margin:6px 0 0;text-align:center;color:${PENCIL}}
.sp-opts{display:flex;flex-direction:column;gap:9px}
.sp-opt{min-height:48px;padding:8px 14px;border-radius:12px 9px 13px 10px;border:2px solid ${INK};background:#f8f0dc;color:${INK};font:20px/25px ${HAND};text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;animation:tap-arm .65s both}
.sp-opt:hover,.sp-opt:focus-visible{background:#fffaf0;outline:2px solid ${RED};outline-offset:2px}
.sp-opt.own{border-style:dashed;color:${PENCIL}}
.sp-write textarea{display:block;width:100%;box-sizing:border-box;min-height:84px;padding:8px 10px;border:2px solid ${INK};border-radius:10px;background:#fffaf0;color:${INK};font:21px/27px ${HAND};resize:none}
.sp-row{display:flex;gap:10px;margin-top:10px}
.sp-row .gx-btn{flex:1}
.sp-btn{min-height:48px;padding:0 16px;border-radius:12px 9px 13px 10px;border:2px solid ${INK};background:#f8f0dc;color:${INK};font:700 20px ${HAND};cursor:pointer;flex:1}
.sp-btn.go{background:${INK};color:#f8f0dc}
.sp-btn:disabled{opacity:.45;cursor:default}
.sp-sec{margin:0 0 12px}
.sp-sec h4{margin:0;font:700 19px/24px ${HAND};color:${PENCIL}}
.sp-sec p{margin:0}
.sp-sec .how{color:${PENCIL};font-size:18px;line-height:24px}
.sp-gin h4{color:#9a3418}
.sp-gin h4::before{content:'';display:inline-block;width:10px;height:10px;margin-right:6px;border-radius:50%;background:#9a3418;box-shadow:3px -2px 0 -1px #c4542c}
.sp-note{margin:0 0 10px;color:${PENCIL};font-size:18px;line-height:24px}
.sp.after .sp-cloth{padding:8px 8px 6px}.sp.after .sp-slot{width:calc(var(--w) * .6)}
.sp.after .sp-cap{min-height:0;margin-top:4px}.sp.after .sp-cap span{display:none}
.sp.after .sp-q{margin-top:12px}
@media (prefers-reduced-motion:reduce){.sp,.sp-face,.sp-slot,.sp-cloth{transition:none}.sp-card{animation:none}}
`;

const keysOf = (n, k = 2) => SIBYL[n].keys.slice(0, k).join(' · ');
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

export function openPairs({ state, day, onRound }) {
  css('ui-sibylpairs', CSS);
  return new Promise((resolve) => {
    const title = h('h2.sp-title', {}, 'Le coppie');
    const dayEl = h('div.sp-day', { 'aria-label': 'Le tacche di oggi' });
    const x = h('button.sp-x', { type: 'button', 'aria-label': 'Chiudi', onclick: () => end() }, '×');
    const qEl = h('div.sp-q');
    const cloth = h('div.sp-cloth');
    const panel = h('div.sp-panel');
    const el = h('div.sp', { role: 'dialog', 'aria-label': 'Le coppie della sibilla' }, h('div.sp-awn', title, dayEl, x), qEl, cloth, panel);
    const close = openOverlay(el);
    const popEsc = onEscape(() => end());
    let ended = false, round = null, last = null, lastQ = null;
    const end = () => { if (ended) return; ended = true; popEsc(); el.classList.remove('on'); setTimeout(() => { close(); resolve(); }, reducedMotion() ? 0 : 300); };
    requestAnimationFrame(() => el.classList.add('on'));

    const drawDay = () => {
      const done = PER_DAY - leftToday(state, day);
      dayEl.replaceChildren(h('span', {}, 'oggi'), ...Array.from({ length: PER_DAY }, (_, i) => h(i < done ? 'i.on' : 'i')));
    };

    // ---- one round ----
    function start() {
      const d = deal(state, Math.random, { last, lastQ });
      last = d.cards; lastQ = d.q;
      round = { cards: d.cards, q: d.q, up: 0, opts: options(d.cards) };
      el.classList.remove('after');
      qEl.replaceChildren(h('small', {}, 'La domanda'), h('b', {}, `«${QUESTION[d.q].t}»`));
      const w = d.cards.length === 3 ? 'min(29vw,118px)' : 'min(37vw,150px)';
      cloth.style.setProperty('--w', w);
      cloth.replaceChildren(...d.cards.map((n) => slot(n, d.cards.length === 3 ? 1 : 2)));
      panel.replaceChildren(h('p.sp-hint', {}, d.cards.length === 3 ? 'Tocca le tre figurine per girarle.' : 'Tocca le figurine per girarle.'));
      drawDay();
    }
    function slot(n, k) {
      const capEl = h('div.sp-cap', h('b', {}, cap(SIBYL[n].name.toLowerCase())), h('span', {}, keysOf(n, k)));
      const card = h('button.sp-card', { type: 'button', 'aria-label': 'Una figurina coperta' },
        h('div.sp-face.sp-back'), h('div.sp-face.sp-front', h('img', { src: sibylUrl(n), alt: SIBYL[n].name, draggable: false })));
      card.onclick = () => {
        if (card.classList.contains('up') || card.classList.contains('turning')) return;
        snd('card');
        const flip = () => { card.classList.add('up'); card.classList.remove('turning'); card.setAttribute('aria-label', SIBYL[n].name); capEl.classList.add('on'); round.up += 1; if (round.up === round.cards.length) setTimeout(ask, 350); };
        if (reducedMotion()) { flip(); return; }
        card.classList.add('turning');
        setTimeout(flip, 180);
      };
      return h('div.sp-slot', card, capEl);
    }
    function ask() {
      if (ended) return;
      const opts = round.opts.map((o) => h('button.sp-opt', { type: 'button', onclick: () => chose(o) }, o.t));
      const own = h('button.sp-opt.own', { type: 'button', onclick: write }, 'Lo dico io, con parole mie…');
      panel.replaceChildren(h('h3', {}, round.cards.length === 3 ? 'Che cosa dicono, tutte e tre?' : 'Che cosa dicono insieme?'), h('div.sp-opts', ...opts, own));
      panel.scrollTop = 0;
    }
    function write() {
      snd('tap');
      const ta = h('textarea', { maxLength: 140, rows: 3, placeholder: 'Che cosa ci vedo…', 'aria-label': 'Che cosa ci vedi' });
      const ok = h('button.sp-btn.go', { type: 'button', disabled: true, onclick: () => chose({ kind: 'own', t: ta.value.trim() }) }, 'Ecco');
      ta.oninput = () => { ok.disabled = ta.value.trim().length < 2; };
      panel.replaceChildren(h('div.sp-write', h('h3', {}, 'Che cosa ci vedo'), ta, h('div.sp-row', h('button.sp-btn', { type: 'button', onclick: ask }, 'Indietro'), ok)));
      setTimeout(() => ta.focus(), 50);
    }
    function chose(choice) {
      if (ended || !choice?.t) return;
      snd('tap');
      const res = onRound(round.cards, choice) || { counted: false, left: 0 };
      const tr = tradition(round.cards), gin = ginepra(round.cards, choice.kind);
      el.classList.add('after');
      drawDay();
      const note = res.counted && res.left === 0 ? h('p.sp-note', {}, 'Le tacche di oggi ci sono tutte: da qui si gioca per piacere.') : null;
      panel.replaceChildren(
        h('div.sp-sec', h('h4', {}, 'Io ci vedo'), h('p', {}, `«${choice.t}»`)),
        h('div.sp-sec', h('h4', {}, 'Come si legge di solito'), h('p.how', {}, tr.how), h('p', {}, tr.t)),
        h('div.sp-sec.sp-gin', h('h4', {}, 'Ginepra'), h('p', {}, `«${gin}»`)),
        ...(note ? [note] : []),
        h('div.sp-row', h('button.sp-btn', { type: 'button', onclick: () => end() }, 'Basta così'), h('button.sp-btn.go', { type: 'button', onclick: () => { snd('tap'); start(); } }, 'Un altro giro')));
      panel.scrollTop = 0;
    }
    start();
  });
}
