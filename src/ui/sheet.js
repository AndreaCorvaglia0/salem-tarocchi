// A sheet: a book opened above everything else for one thing (a card's page, the lessons, the Minors).
// openSheet({ label, mid, build: (sheet) => ({ L, R, single }) }) -> Promise resolved on close.
// sheet.refill() rebuilds the pages; sheet.close() closes.
import { openOverlay } from '../core/dom.js';
import { bookFrame, onEscape } from './book.js';

export function openSheet({ label = 'Pagina', mid = '', closeText = 'Chiudi', build }) {
  return new Promise((resolve) => {
    let closeOverlay = () => {}, popEsc = () => {};
    const sheet = {};
    const finish = () => { popEsc(); closeOverlay(); resolve(); };
    const b = bookFrame({ onClose: finish, label, mid, closeText });
    b.el.classList.add('sh-top');
    b.el.style.zIndex = '70';
    sheet.close = finish;
    sheet.book = b;
    sheet.refill = (keepPage) => { const { L, R, single } = build(sheet); const p = b.spread.dataset.p; b.fill(L, R, { single }); if (keepPage) b.page(+p || 0); };
    closeOverlay = openOverlay(b.el);
    popEsc = onEscape(finish);
    sheet.refill();
    b.el.dataset.ready = '1';
  });
}
