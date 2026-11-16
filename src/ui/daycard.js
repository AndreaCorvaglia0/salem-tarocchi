// The card of the day, large (docs/DESIGN.md "La soglia"): the card fills the screen and the text moves in
// pages under it, with a swipe or «Avanti». Each page moves the card: today's sentence (the whole card), the
// look (the card zooms on the detail, turns upside down, or gets the other card beside it), a question
// from memory (the card is covered, then shows where the answer was), its usual meaning.
// Two fingers zoom anywhere, a double tap zooms on a point. openDayCard({ flip }) -> Promise (closed).
import { h, css, openOverlay, cardUrl, reducedMotion } from '../core/dom.js';
import { snd } from './sfx.js';
import { CARD } from '../data/cards.base.js';
import { sheet } from '../data/cards.js';
import { VISUAL } from '../data/daily/visual.js';
import { today } from '../glue/threshold.js';
import { SERIF, HAND, GOLD } from './paper.js';
import { cardBack } from './art.js';

const CSS = `
.dc{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;background:radial-gradient(ellipse 90% 60% at 50% 34%,#2c1c14 0%,#150f18 55%,#07070d 100%) #07070d;color:#efe4c8;font:19px/1.4 ${SERIF};opacity:0;transition:opacity .45s;touch-action:none;overflow:hidden}
.dc.on{opacity:1}
.dc-bar{flex:none;width:100%;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;padding:calc(10px + env(safe-area-inset-top)) 14px 0 18px;min-height:52px}
.dc-date{font:italic 16px ${SERIF};color:#b9a98a}
.dc-x{width:46px;height:46px;border:1px solid #ffffff30;border-radius:50%;background:#ffffff1c;color:#fff7e2;font:26px/1 ${SERIF};cursor:pointer}
.dc-stage{position:relative;flex:1 1 auto;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;perspective:1300px}
.dc-view{position:relative;height:min(100%,calc((100vw - 56px) * 12 / 7));aspect-ratio:7/12;border-radius:10px;overflow:hidden;background:#efe4c8;box-shadow:0 0 0 1px #0008,0 18px 50px #000c,0 0 70px #d8b25a22;transition:transform .32s ease-in,filter .6s}
.dc.in .dc-view,.dc.rise .dc-view{transition:transform .8s cubic-bezier(.3,.7,.2,1)}
.dc.in .dc-view{transform:scale(.45) translateY(34%) rotate(-7deg)}
.dc-view.turning{transform:scaleX(0)}
.dc-face{position:absolute;inset:0}
.dc-face.back{background:#1b2150;display:none}
.dc-view.covered .dc-face.back{display:block}.dc-view.covered .dc-face.front{visibility:hidden}
.dc-face.back svg{width:100%;height:100%;display:block}
.dc-pan{position:absolute;inset:0;transform-origin:0 0;transition:transform .9s cubic-bezier(.3,.7,.2,1);will-change:transform}
.dc-pan.live{transition:none}
.dc-spin{position:absolute;inset:5px;border-radius:6px;overflow:hidden;transition:transform .9s cubic-bezier(.3,.7,.2,1)}
.dc-spin.rev{transform:rotate(180deg)}
.dc-spin img{display:block;width:100%;height:100%;object-fit:cover;-webkit-user-drag:none;user-select:none;-webkit-user-select:none}
.dc-view.old{filter:sepia(.55) saturate(.8)}
.dc-mate{position:absolute;right:calc(50% - min(46vw,220px));bottom:4%;display:flex;gap:6px;transform:translateX(30px) rotate(6deg);opacity:0;transition:opacity .6s,transform .6s;pointer-events:none}
.dc-mate.on{opacity:1;transform:rotate(6deg)}
.dc-mate img{width:74px;aspect-ratio:7/12;object-fit:cover;border:3px solid #fbf5e6;border-radius:5px;box-shadow:0 8px 20px #000c}
.dc-mate span{position:absolute;left:0;right:0;bottom:-20px;text-align:center;font:15px ${HAND};color:#e9dcc0;white-space:nowrap}
.dc-pages{flex:none;width:100%;height:clamp(170px,30vh,250px);display:flex;overflow:auto hidden;scroll-snap-type:x mandatory;scrollbar-width:none;touch-action:pan-x;-webkit-overflow-scrolling:touch}
.dc-pages::-webkit-scrollbar{display:none}
.dc-page{flex:none;width:100%;box-sizing:border-box;padding:12px 24px 4px;scroll-snap-align:center;scroll-snap-stop:always;overflow:hidden auto;text-align:center;touch-action:pan-x pan-y}
.dc-page h2{margin:0 0 4px;font:400 30px/1.1 ${SERIF};color:#f6ecd2}
.dc-page h3{margin:0 0 6px;font:italic 400 20px ${SERIF};color:${GOLD};letter-spacing:.03em}
.dc-page p{margin:0 auto;max-width:440px;font:20px/27px ${SERIF};text-wrap:pretty}
.dc-page p.day{font:25px/31px ${HAND};color:#fff3d6}
.dc-page p.kw{margin-top:8px;font:italic 18px/24px ${SERIF};color:#cdbf9f}
.dc-ans{display:flex;flex-direction:column;gap:8px;max-width:360px;margin:10px auto 0}
.dc-ans button{min-height:46px;border-radius:8px;border:1px solid #d8b25a66;background:#0b0a10b0;color:#f1e6cb;font:19px ${SERIF};cursor:pointer}
.dc-ans button.yes{border-color:#9fd6a6;background:#1c3a26}.dc-ans button.no{opacity:.45}.dc-ans button.was{border-color:${GOLD}}
.dc-foot{flex:none;width:100%;box-sizing:border-box;display:flex;align-items:center;gap:14px;padding:8px 18px calc(14px + env(safe-area-inset-bottom))}
.dc-dots{flex:1;display:flex;gap:2px}.dc-dots button{width:26px;height:44px;padding:0;border:0;background:none;cursor:pointer}.dc-dots i{display:block;margin:auto;width:8px;height:8px;border-radius:50%;background:#ffffff2a;transition:background .3s,transform .3s}.dc-dots i.on{background:${GOLD};transform:scale(1.25)}
.dc-next{min-height:50px;min-width:150px;padding:0 22px;border-radius:25px;border:1px solid ${GOLD};background:#2a2016;color:#f6ecd2;font:20px ${SERIF};cursor:pointer}
.dc-next.end{background:#efe4c8;color:#2a2016}
.dc-next.skip{border-color:#d8b25a55;background:none;color:#b9a98a;font-size:18px}
@media (prefers-reduced-motion:reduce){.dc,.dc-view,.dc-pan,.dc-spin,.dc-mate{transition:none}}
`;

const LOOK = { immagine: 'Guarda meglio', storia: 'Da dove viene', contesto: 'Accanto ad altre carte', rovescio: 'A testa in giù' };
const WEEK = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function openDayCard({ flip = false } = {}) {
  css('ui-daycard', CSS);
  const t = today(), id = t.card, V = VISUAL[id] || {}, S = sheet(id) || {};
  const spot = t.look ? (V.looks || [])[t.lookIndex] || null : null;
  const ask = (V.domande || [])[(Math.max(1, t.seen) - 1) % Math.max(1, (V.domande || []).length)] || null;
  const d = new Date();
  return new Promise((resolve) => {
    const img = h('img', { src: cardUrl(id), alt: t.name, draggable: false });
    const spin = h('div.dc-spin', img), pan = h('div.dc-pan', spin);
    const view = h(`div.dc-view${flip ? '.covered' : ''}`, h('div.dc-face.front', pan), h('div.dc-face.back', { html: cardBack(104, 178) }));
    const mate = h('div.dc-mate');
    const stage = h('div.dc-stage', view, mate);
    const pagesEl = h('div.dc-pages'), dots = h('div.dc-dots'), next = h('button.dc-next', { type: 'button' }, 'Avanti');
    const el = h(`div.dc${flip ? '.in' : ''}`, { role: 'dialog', 'aria-label': `La carta di oggi: ${t.name}` },
      h('div.dc-bar', h('span.dc-date', {}, `${WEEK[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`), h('button.dc-x', { type: 'button', 'aria-label': 'Torna al tavolo', onclick: () => end() }, '×')),
      stage, pagesEl, h('div.dc-foot', dots, next));
    const close = openOverlay(el);
    let ended = false;
    const end = () => { if (ended) return; ended = true; el.classList.remove('on'); setTimeout(() => { close(); resolve(); }, reducedMotion() ? 0 : 420); };

    // ---- the card: where it looks
    let z = 1, tx = 0, ty = 0;
    const size = () => [view.clientWidth, view.clientHeight];
    const apply = (live = false) => { const [W, H] = size(); tx = clamp(tx, W - W * z, 0); ty = clamp(ty, H - H * z, 0); pan.classList.toggle('live', live); pan.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${z.toFixed(3)})`; };
    const lookAt = (p) => { const [W, H] = size(); if (!p || p.x == null) { z = 1; tx = 0; ty = 0; } else { z = clamp(p.z || 2, 1, 3.4); tx = W / 2 - (p.x / 100) * W * z; ty = H / 2 - (p.y / 100) * H * z; } apply(); };
    // covering and uncovering: the card turns on its side, changes face, and turns back
    let coverT = 0, rising = flip;
    const cover = (on) => {
      if (rising || view.classList.contains('covered') === on) return;
      clearTimeout(coverT);
      if (reducedMotion()) { view.classList.toggle('covered', on); return; }
      view.classList.add('turning');
      coverT = setTimeout(() => { view.classList.toggle('covered', on); view.classList.remove('turning'); }, 330);
    };
    const pose = ({ at = null, rev = false, old = false, covered = false, mates = null } = {}) => {
      lookAt(at); spin.classList.toggle('rev', rev); view.classList.toggle('old', old); cover(covered);
      mate.replaceChildren(...(mates || []).map((m) => h('img', { src: cardUrl(m), alt: CARD[m]?.name || '' })), mates?.length ? h('span', {}, mates.map((m) => CARD[m]?.name).join(' · ')) : '');
      mate.classList.toggle('on', !!mates?.length);
    };
    // two fingers zoom, one finger moves a zoomed card, a double tap zooms on the point
    const pts = new Map(); let pinch = null, lastTap = 0;
    const local = (e) => { const r = view.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    view.addEventListener('pointerdown', (e) => {
      if (view.classList.contains('covered')) return;
      view.setPointerCapture?.(e.pointerId); pts.set(e.pointerId, local(e));
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z, cx: (a[0] + b[0]) / 2, cy: (a[1] + b[1]) / 2, tx, ty }; }
      else if (pts.size === 1) {
        const now = Date.now(), [x, y] = local(e);
        if (now - lastTap < 320) { if (z > 1.05) { z = 1; tx = 0; ty = 0; } else { const [W, H] = size(); z = 2.4; tx = W / 2 - x * z; ty = H / 2 - y * z; } apply(); lastTap = 0; } else lastTap = now;
      }
    });
    view.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return;
      const prev = pts.get(e.pointerId), cur = local(e); pts.set(e.pointerId, cur);
      if (pts.size === 2 && pinch) { const [a, b] = [...pts.values()]; const dd = Math.hypot(a[0] - b[0], a[1] - b[1]); const nz = clamp(pinch.z * dd / Math.max(1, pinch.d), 1, 4); tx = pinch.cx - (pinch.cx - pinch.tx) * nz / pinch.z; ty = pinch.cy - (pinch.cy - pinch.ty) * nz / pinch.z; z = nz; apply(true); }
      else if (pts.size === 1 && z > 1.02) { tx += cur[0] - prev[0]; ty += cur[1] - prev[1]; apply(true); }
    });
    const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; };
    view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);

    // ---- the pages
    const pages = [];
    pages.push({ el: h('div.dc-page', h('h2', {}, t.name), h('p.day', {}, t.oggi)), pose: () => pose() });
    if (t.look) pages.push({ el: h('div.dc-page', h('h3', {}, LOOK[t.look.k] || 'Guarda meglio'), h('p', {}, t.look.t)),
      pose: () => pose({ at: t.look.k === 'immagine' ? spot : null, rev: t.look.k === 'rovescio', old: t.look.k === 'storia', mates: t.look.k === 'contesto' ? spot?.con : null }) });
    if (ask) {
      const pg = h('div.dc-page'); let answered = false;
      const build = () => {
        const btns = ask.a.map((a, i) => h('button', { type: 'button', onclick: () => {
          if (answered) return; answered = true; snd(i === ask.ok ? 'card' : 'tap');
          btns.forEach((b, j) => { b.disabled = true; b.classList.add(j === ask.ok ? (i === ask.ok ? 'yes' : 'was') : 'no'); });
          pg.querySelector('h3').textContent = i === ask.ok ? 'Giusto: guarda' : 'Guarda com\'era';
          pose({ at: ask.at }); label();
        } }, a));
        pg.replaceChildren(h('h3', {}, 'Senza guardare'), h('p', {}, ask.q), h('div.dc-ans', btns));
      };
      build();
      pages.push({ el: pg, pose: () => (answered ? pose({ at: ask.at }) : pose({ covered: true })), open: () => !answered });
    }
    pages.push({ el: h('div.dc-page', h('h3', {}, 'Il suo significato'), h('p', {}, S.says || S.core || ''), (S.keywords || []).length ? h('p.kw', {}, S.keywords.join(' · ')) : null, S.reversed ? h('p.kw', {}, /^capovolt/i.test(S.reversed) ? S.reversed : `Capovolta: ${S.reversed}`) : null), pose: () => pose() });
    pagesEl.append(...pages.map((p) => p.el));
    dots.append(...pages.map((_, i) => h('button', { type: 'button', 'aria-label': `Pagina ${i + 1}`, onclick: () => go(i) }, h('i'))));
    let cur = -1;
    // the button says what it does: on the question, until she answers, it only offers to skip it
    const label = () => { const last = cur === pages.length - 1, open = !!pages[cur]?.open?.(); next.textContent = last ? 'Torna al tavolo' : open ? 'Salto la domanda' : 'Avanti'; next.classList.toggle('end', last); next.classList.toggle('skip', open); };
    const show = (i) => {
      if (i === cur) return; cur = i;
      [...dots.children].forEach((x, j) => x.firstChild.classList.toggle('on', j === i));
      label();
      pages[i].pose();
    };
    const go = (i) => pagesEl.scrollTo({ left: i * pagesEl.clientWidth, behavior: reducedMotion() ? 'auto' : 'smooth' });
    let st = 0;
    pagesEl.addEventListener('scroll', () => { clearTimeout(st); st = setTimeout(() => show(clamp(Math.round(pagesEl.scrollLeft / Math.max(1, pagesEl.clientWidth)), 0, pages.length - 1)), 60); });
    next.onclick = () => { snd('page'); if (cur >= pages.length - 1) end(); else go(cur + 1); };
    globalThis.addEventListener('resize', () => pages[Math.max(0, cur)]?.pose(), { passive: true });

    requestAnimationFrame(() => { el.classList.add('on'); show(0); if (flip) { snd('card'); el.classList.add('rise'); setTimeout(() => el.classList.remove('in'), 60); setTimeout(() => { rising = false; cover(false); el.classList.remove('rise'); }, 820); } });
  });
}
