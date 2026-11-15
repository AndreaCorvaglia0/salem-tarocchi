// The "Carte" ribbon: four quiet entries (lessons, review, a reading with my own deck, the Minors after
// the ending), then the 22 slots: the Fool apart, three rows of seven. A found card shows its image
// (veiled until its first star), three star marks and a red dot when it is due again; a missing one
// shows a silhouette and, on tap, the rumour of where it hides; a confiscated one looks taken away.
import { h, css } from '../core/dom.js';
import { state } from '../core/state.js';
import { call } from '../core/services.js';
import { CARD } from '../data/cards.base.js';
import { sheet } from '../data/cards.js';
import { PENCIL, RED } from './paper.js';
import { slot, slotCss } from './slots.js';
import { majorSlots, lessonsShown } from './logic.js';
import { openLessons } from './lessons.js';
import { openMinors } from './minors.js';
import { showCard } from './cardpage.js';
import { dueIds } from '../core/progress.js';

const CSS = `
.cs-ent{list-style:none;padding:0;margin:6px 0 4px!important}
.cs-ent li{line-height:30px}
.cs-ent .n{color:${PENCIL};font-size:18px}
.cs-fool{display:flex;align-items:center;gap:14px;margin:14px 0 4px}
.cs-fool .cs-slot{width:58px}
.cs-fool p{font-size:19px;line-height:25px;color:${PENCIL}}
.cs-row{margin-top:14px}
.cs-row .lb{font-size:18px;line-height:22px;color:${PENCIL};margin-bottom:4px}
.cs-cap{min-height:62px;margin-top:14px!important;line-height:28px}
.cs-cap b{font-weight:700}
.cs-legend{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px;font-size:18px;color:${PENCIL}}
.cs-legend i{display:inline-block;width:10px;height:10px;border-radius:50%;background:${RED};margin-right:6px;vertical-align:1px}
`;

// call another area's service with the grimoire hidden, then come back to it
async function away(ctx, name, args) {
  ctx.book.el.style.visibility = 'hidden';
  try { await call(name, args); } finally { ctx.book.el.style.visibility = ''; ctx.rerender(); }
}

export function cartePages(ctx) {
  css('ui-carte', CSS); slotCss();
  const { fool, rows } = majorSlots();
  const cap = h('p.cs-cap', { role: 'status' }, h('span.pencil', {}, 'Tocca una carta per aprirla.'));
  const slots = [];
  const tap = async (id, sl, b) => {
    for (const s of slots) s.classList.remove('on');
    cap.classList.add('gx-live');
    const c = CARD[id] || {}, S = sheet(id) || {};
    if (sl.kind === 'missing') { b.classList.add('on'); cap.replaceChildren(h('b', {}, `${c.roman}. `), S.rumour || 'Nessuno sa dove sia.'); return; }
    if (sl.kind === 'taken') { b.classList.add('on'); cap.replaceChildren(h('b', {}, `${c.name}: `), 'sequestrata dal tribunale. La riprendo al deposito, rispondendo su di lei.'); return; }
    await showCard(id);
    ctx.rerender();
  };
  const mk = (id) => { const s = slot(id, tap); slots.push(s); return s; };
  // the four entries
  const lessons = lessonsShown();
  const due = dueIds().length;
  const entry = (t, n, fn) => h('li', h('button.gx-link', { type: 'button', onclick: fn }, h('span.ar', { 'aria-hidden': 'true' }, '→'), h('span.t', {}, t), n ? h('span.n', {}, n) : null));
  const ents = [
    entry('Le lezioni delle maestre', lessons.length ? `(${lessons.length})` : '', async () => { await openLessons({ study: ctx.study }); }),
    entry('Ripassare', due ? `· ${due} da ripassare` : '', () => away(ctx, 'review.open', {})),
    entry('Leggere con il mio mazzo vero', '', () => away(ctx, 'reading.free')),
  ];
  if (state.flags?.['ending.seen']) ents.push(entry('Gli Arcani Minori', '', async () => { await openMinors(); ctx.rerender(); }));
  const L = [h('h2', {}, 'Le carte'), h('ul.cs-ent', ents)];
  L.push(h('div.cs-fool', mk(fool), h('p', {}, 'Il Matto, lo zero. Sono io.')));
  const titles = ['I – VII · il villaggio', 'VIII – XIV · il bosco', 'XV – XXI · il buio'];
  const R = rows.map((ids, i) => h('div.cs-row', h('div.lb', {}, titles[i]), h('div.cs-grid', ids.map(mk))));
  R.push(cap);
  if (due || Object.values(state.cards || {}).some((c) => c.found)) R.push(h('div.cs-legend', h('span', {}, h('i'), 'da ripassare'), h('span', {}, '★ una stella per ogni cosa che so')));
  return { L, R, single: true };
}
