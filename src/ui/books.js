// The bookshelf and the book reader (notes/libri/CONCETTO.md). Phone first: one page at a time, a big
// picture (tap to enlarge), at most ~60 words in the book's print, a margin note in someone's hand, swipe or
// the two buttons to turn, and a last page «Che cosa è vero» outside the fiction.
//   shelfPages(ctx)   the «Libri» ribbon of the grimoire (ui/grimoire.js)
//   showShelf()       the same shelf as a sheet (the library's shelf, service books.shelf)
//   openBook(id)      the reader -> Promise resolved on close
//   flyBook(id)       the little cover flying into the grimoire button
import { h, css, openOverlay } from '../core/dom.js';
import { state, save } from '../core/state.js';
import { test } from '../core/cond.js';
import { emit } from '../core/bus.js';
import { call, has } from '../core/services.js';
import { BOOK, BOOK_LIST, EARN, AFTER } from '../data/books/index.js';
import { shelfSlots, openedBook, markRead, pageOrder, countBooks } from '../glue/books.rules.js';
import { openSheet } from './sheet.js';
import { onEscape } from './book.js';
import { flyToBook } from './collect.js';
import { snd } from './sfx.js';
import { HAND, SERIF, INK, PENCIL, RED, paperBg, baseCss } from './paper.js';

const url = (p) => p; // relative, like cards/<id>.webp (core/dom.js cardUrl)
const NOTE_INK = { edera: '#4f3f72', ortica: '#3a5520', ignota: '#40392f', antica: '#5e4129' };

const CSS = `
.bs-shelf{position:relative;margin:12px -6px 6px;padding:18px 10px 0;border-radius:4px;background:linear-gradient(#2c1d14,#3a2618 70%,#2a1b12);box-shadow:inset 0 8px 18px #0009}
.bs-row{display:flex;align-items:flex-end;gap:5px;min-height:196px;padding:0 4px}
.bs-plank{height:16px;margin:0 -10px;background:linear-gradient(#7a5233,#5a3a22 60%,#3e2817);box-shadow:0 6px 10px #0007;border-radius:0 0 3px 3px}
.bs-sp{position:relative;flex:none;width:50px;padding:0;border:0;border-radius:3px 3px 1px 1px;cursor:pointer;color:#f3e2b4;-webkit-tap-highlight-color:transparent;
  background:linear-gradient(90deg,#0006,transparent 22%,#fff2 48%,transparent 70%,#0007),var(--lth);box-shadow:inset 0 0 0 1px #0005,2px 0 3px #0006}
.bs-sp::before,.bs-sp::after{content:'';position:absolute;left:4px;right:4px;height:3px;border-top:1.5px solid #d8b25a99;border-bottom:1.5px solid #d8b25a99}
.bs-sp::before{top:12px}.bs-sp::after{bottom:14px}
.bs-sp span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-90deg);white-space:nowrap;font:700 var(--fs,18px)/1 ${SERIF};letter-spacing:.3px;text-shadow:0 1px 0 #0008}
.bs-sp:focus-visible{outline:2px solid #f0d27a;outline-offset:2px}
.bs-new{position:absolute;top:-10px;left:50%;transform:translateX(-50%) rotate(-4deg);padding:0 6px;border-radius:9px;background:${RED};color:#fbf5e6;font:700 15px/19px ${HAND};box-shadow:0 1px 3px #0006;z-index:2}
.bs-dust{flex:none;width:44px;height:150px;padding:0;border:2px dashed #b9a98a55;border-bottom:0;border-radius:3px 3px 0 0;background:linear-gradient(#cdb99a10,#cdb99a2a);cursor:pointer;-webkit-tap-highlight-color:transparent}
.bs-say{min-height:26px;margin:8px 0 0!important;color:${PENCIL}}
.bs-list{list-style:none;padding:0;margin:10px 0 0!important}
.bs-list li{margin-bottom:8px}
.bs-list button{display:block;width:100%;padding:6px 0;border:0;background:none;text-align:left;color:${INK};font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.bs-list .t{font:20px/24px ${SERIF};font-style:italic}
.bs-list .a{display:block;font:18px/22px ${HAND};color:${PENCIL}}
.bs-list .n{margin-left:6px;padding:0 6px;border-radius:9px;background:${RED};color:#fbf5e6;font:700 15px/19px ${HAND}}
.bs-list .ok{color:${PENCIL};font:18px ${HAND};margin-left:6px}
.bkr{position:fixed;inset:0;z-index:75;display:flex;justify-content:center;background:radial-gradient(ellipse at 50% 35%,#231b26,#08070c);animation:gx-fade .18s ease-out}
.bkr-in{position:relative;display:flex;flex-direction:column;width:100%;max-width:560px;height:100%;box-sizing:border-box;padding:calc(6px + env(safe-area-inset-top)) 8px calc(8px + env(safe-area-inset-bottom))}
.bkr-bar{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 2px 6px}
.bkr-bar .mid{flex:1;min-width:0;text-align:center;color:#cbbfa6;font:italic 17px ${SERIF};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bkr-bar .no{min-width:44px;text-align:right;color:#cbbfa6;font:18px ${HAND}}
.bkr-pg{flex:1;min-height:0;display:flex;flex-direction:column;border-radius:3px 6px 6px 3px;background:${paperBg()};box-shadow:inset 14px 0 18px -12px #5a452c99,0 14px 34px #000c;padding:14px 18px 12px;overflow:hidden;touch-action:pan-y}
.bkr-fig{position:relative;flex:none;display:flex;justify-content:center;margin:0 0 10px}
.bkr-fig button{padding:0;border:0;background:none;cursor:zoom-in;line-height:0}
.bkr-fig img{display:block;max-width:100%;max-height:36vh;border:3px solid #fbf5e6;box-shadow:0 3px 10px #5a452c77;background:#f4ecd6}
.bkr-pg.tall .bkr-fig img{max-height:46vh}
.bkr-note{position:absolute;right:-6px;bottom:-14px;max-width:62%;padding:2px 8px 4px;background:#f3e9cfee;border-radius:2px;box-shadow:0 2px 6px #5a452c55;font:20px/22px ${HAND};transform:rotate(-3deg);pointer-events:none}
.bkr-note.ortica{font-weight:700;font-size:21px;transform:rotate(2.5deg)}
.bkr-note.antica,.bkr-note.ignota{font-size:19px}
.bkr-txt{flex:1;min-height:0;overflow:auto;margin-top:10px;font:19px/27px ${SERIF};color:${INK};text-wrap:pretty}
.bkr-txt.hers{font:22px/28px ${HAND}}
.bkr-txt.front{text-align:center;font-style:italic}
.bkr-truth h2{margin:4px 0 10px;font:700 27px/32px ${HAND};color:${INK}}
.bkr-truth p{font:16px/23px system-ui,sans-serif;color:${INK}}
.bkr-truth .sub{margin-top:8px!important;color:${PENCIL}}
.bkr-truth a{display:block;margin-top:10px;color:${RED};font:16px/22px system-ui,sans-serif}
.bkr-nav{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 2px 0}
.bkr-nav .gx-btn{min-width:104px;padding:0 12px;white-space:nowrap}
.bkr-dots{display:flex;gap:4px;justify-content:center;min-width:0}
.bkr-dots i{flex:none;width:6px;height:6px;border-radius:50%;background:#cbbfa655}.bkr-dots i.on{background:#f0d27a}
.bkr-zoom{position:fixed;inset:0;z-index:130;display:flex;align-items:center;justify-content:center;background:#07070df2;overflow:auto;touch-action:pinch-zoom}
.bkr-zoom img{max-width:100%;max-height:100%}
`;
const cssOn = () => { baseCss(); css('ui-books', CSS); };

// ---- the shelf ----------------------------------------------------------------------------------------
function shelfBody(onOpen) {
  cssOn();
  const slots = shelfSlots(state, BOOK_LIST, EARN), n = countBooks(state, BOOK_LIST, EARN);
  const say = h('p.bs-say.small', {}, '');
  const spine = (sl, i) => (sl.have
    ? h('button.bs-sp', { type: 'button', 'aria-label': BOOK[sl.id].title, style: { '--lth': sl.leather, '--fs': sl.spine.length > 12 ? '15px' : '18px', height: `${Math.max(164 + ((i * 37) % 4) * 8, sl.spine.length * 9 + 48)}px` }, onclick: () => onOpen(sl.id) },
      h('span', {}, sl.spine), sl.nuovo ? h('i.bs-new', {}, 'nuovo') : null)
    : h('button.bs-dust', { type: 'button', 'aria-label': 'Un posto vuoto', onclick: () => { say.textContent = 'Qui c\'era un libro. La polvere ha lasciato il segno.'; } }));
  const shelf = h('div.bs-shelf', h('div.bs-row', slots.map(spine)), h('div.bs-plank'));
  const list = h('ul.bs-list', BOOK_LIST.filter((b) => slots.find((s) => s.id === b.id)).map((b) => {
    const sl = slots.find((s) => s.id === b.id);
    return h('li', h('button', { type: 'button', onclick: () => onOpen(b.id) },
      h('span.t', {}, b.title), sl.nuovo ? h('span.n', {}, 'nuovo') : sl.read ? h('span.ok', {}, '(letto)') : null,
      h('span.a', {}, `${b.author}${b.year ? `, ${b.year}` : ''} · ${b.from}`)));
  }));
  const intro = n > 1 ? 'I libri che ho. Tocco un dorso per aprirlo.' : 'Per ora c\'è un libro solo, e tra la polvere i segni di quelli che mancano.';
  return [h('h2', {}, 'I libri'), h('p.pencil', {}, intro), shelf, say, list];
}
export function shelfPages(ctx) {
  const L = shelfBody(async (id) => { await openBook(id); ctx.rerender?.(); });
  return { L, R: [], single: true };
}
export function showShelf() {
  cssOn();
  return openSheet({ label: 'Lo scaffale', mid: 'Lo scaffale', build: (sheet) => ({ L: shelfBody(async (id) => { await openBook(id); sheet.refill(); }), R: [], single: true }) });
}

// ---- the reader ---------------------------------------------------------------------------------------
function zoom(src, alt) {
  const el = h('div.bkr-zoom', { role: 'dialog', 'aria-label': alt }, h('img', { src, alt }));
  const close = openOverlay(el);
  const pop = onEscape(() => { pop(); close(); });
  el.onclick = () => { pop(); close(); };
}

export function openBook(id) {
  const book = BOOK[id];
  if (!book) return Promise.resolve();
  cssOn();
  if (openedBook(state, id)) save();
  const order = pageOrder(book), total = order.length + 1; // + the truth page
  let at = 0, firstRead = false;
  return new Promise((resolve) => {
    const pg = h('section.bkr-pg', { 'aria-live': 'polite' });
    const no = h('span.no', {});
    const dots = h('div.bkr-dots', Array.from({ length: total }, () => h('i')));
    const prev = h('button.gx-btn', { type: 'button', onclick: () => go(at - 1) }, '← Prima');
    const next = h('button.gx-btn', { type: 'button', onclick: () => go(at + 1) }, 'Avanti →');
    const shut = h('button.gx-ui', { type: 'button', 'aria-label': 'Chiudi il libro', onclick: () => finish() }, h('span', {}, 'Chiudi'), h('span.x', { 'aria-hidden': 'true' }, '✕'));
    const el = h('div.bkr', { role: 'dialog', 'aria-label': book.title },
      h('div.bkr-in', h('div.bkr-bar', shut, h('span.mid', {}, book.title), no), pg, h('div.bkr-nav', prev, dots, next)));
    const draw = () => {
      no.textContent = `${at + 1}/${total}`;
      [...dots.children].forEach((d, i) => d.classList.toggle('on', i === at));
      prev.disabled = at === 0;
      next.textContent = at === total - 1 ? 'Chiudi' : 'Avanti →';
      pg.className = 'bkr-pg';
      if (at === total - 1) {
        pg.classList.add('bkr-truth');
        pg.replaceChildren(h('h2', {}, 'Che cosa è vero'),
          h('div.bkr-txt', h('p', {}, book.truth.text),
            h('p.sub', {}, 'È l\'ultima pagina, fuori dal gioco: come i titoli di coda.'),
            ...(book.truth.links || []).map((l) => h('a', { href: l.url, target: '_blank', rel: 'noopener' }, `${l.t} ↗`))));
        return;
      }
      const p = book.pages[order[at]], src = url(p.img);
      if (p.tall) pg.classList.add('tall');
      const fig = h('div.bkr-fig', h('button', { type: 'button', 'aria-label': 'Ingrandisci la figura', onclick: () => zoom(src, p.alt) }, h('img', { src, alt: p.alt })),
        p.note ? h(`p.bkr-note.${p.note.by}`, { style: { color: NOTE_INK[p.note.by] || PENCIL } }, p.note.t) : null);
      const front = order[at] === 0 && !book.shuffle;
      pg.replaceChildren(fig, h(`div.bkr-txt${book.voice === 'hers' ? '.hers' : ''}${front ? '.front' : ''}`, {}, p.text));
    };
    const go = (i) => {
      if (i >= total) { finish(); return; }
      if (i < 0 || i === at) return;
      at = i; snd('page'); draw();
      if (at >= total - 2 && markRead(state, id)) { firstRead = true; save(); emit('books:read', { id }); }
    };
    let sx = 0, sy = 0;
    pg.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    pg.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(at + (dx < 0 ? 1 : -1));
    }, { passive: true });
    const key = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1); } };
    let closeOverlay = () => {}, popEsc = () => {};
    function finish() {
      popEsc(); globalThis.removeEventListener('keydown', key, true); closeOverlay();
      const th = AFTER[id]?.thought;
      if (firstRead && th && test(th.when ?? true) && has('hud.toast')) setTimeout(() => call('hud.toast', th.t), 400);
      resolve();
    }
    closeOverlay = openOverlay(el);
    popEsc = onEscape(finish);
    globalThis.addEventListener('keydown', key, true);
    snd('page');
    draw();
    el.dataset.ready = '1';
  });
}

// ---- a new book flies into the grimoire --------------------------------------------------------------
export function flyBook(id) {
  if (!BOOK[id]) return;
  flyToBook({ src: url(`books/${id}/t.webp`), px: false });
}
