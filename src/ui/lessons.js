// The lessons the mistresses have taught, re-read in the grimoire. Left page: the index; right page:
// one page of a lesson with a simple pager, and the spread drawn from SPREADS when the page has one.
// openLessons({ study }) -> Promise resolved on close.
import { h, css, cardUrl } from '../core/dom.js';
import { PEOPLE, CARD } from '../data/cards.base.js';
import { SPREADS } from '../data/spreads.js';
import { INK, PENCIL, RED, HAND } from './paper.js';
import { lessonsShown } from './logic.js';
import { openSheet } from './sheet.js';

const CSS = `
.ls-idx{list-style:none;padding:0;margin-top:8px!important}
.ls-idx li{line-height:28px;margin-bottom:6px}
.ls-idx .by{display:block;font-size:18px;color:${PENCIL};padding-left:30px;line-height:20px}
.ls-idx .gx-link[aria-current=true] .t{text-decoration:underline wavy ${RED};text-underline-offset:5px}
.ls-body{margin-top:10px!important;line-height:30px;white-space:pre-line}
.ls-pager{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:22px}
.ls-pager .n{color:${PENCIL};font-size:18px}
.ls-sp{position:relative;margin:16px auto 6px;width:100%;max-width:380px}
.ls-sp .c{position:absolute;display:grid;place-items:start center;padding-top:3px;box-sizing:border-box;transform:translate(-50%,-50%);border:1.6px solid ${INK};border-radius:3px;background:#f8f0dc;font:700 18px ${HAND};color:${INK};box-shadow:1px 2px 0 #5a452c33}
.ls-sp .c.x{place-items:center end;padding:0 6px 0 0;background:#f8f0dc40;border-color:${RED};color:${RED}}
.ls-leg{list-style:none;padding:0;margin-top:6px!important;columns:2;column-gap:18px}
.ls-leg li{font-size:18px;line-height:24px;break-inside:avoid}
.ls-leg b{color:${RED};margin-right:4px}
.ls-cards{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
.ls-cards figure{width:64px;text-align:center}
.ls-cards img{width:64px;height:110px;object-fit:cover;border:2px solid #fbf5e6;box-shadow:0 2px 5px #5a452c66;border-radius:3px}
.ls-cards figcaption{font-size:17px;line-height:19px}
@media (max-width:719px){.ls-leg{columns:1}}
`;

export function spreadDiagram(spreadId) {
  const sp = SPREADS[spreadId];
  if (!sp?.positions?.length) return null;
  const many = sp.positions.length > 3;
  const cw = many ? 10 : 17; // card width in % of the box
  const box = h('div.ls-sp', { style: { aspectRatio: many ? '1.08' : '1.9' } });
  for (const p of sp.positions) {
    const rot = p.rot === 90 || p.rot === 270;
    box.append(h(`span.c${rot ? '.x' : ''}`, { style: { left: `${p.x}%`, top: `${p.y}%`, width: `${rot ? cw * 12 / 7 : cw}%`, aspectRatio: rot ? '12/7' : '7/12', zIndex: rot ? 2 : 1 } }, String(p.n)));
  }
  return [box, h('ol.ls-leg', sp.positions.map((p) => h('li', h('b', {}, `${p.n}`), p.label)))];
}

export function openLessons({ study = false } = {}) {
  css('ui-lessons', CSS);
  const list = lessonsShown();
  let li = 0, pi = 0;
  return openSheet({ label: 'Le lezioni', build: (sheet) => {
    const L = [h('h2', {}, 'Le lezioni')];
    if (!list.length) {
      L.push(h('p.pencil', { style: { marginTop: '10px' } }, study ? 'Le maestre non mi hanno ancora insegnato niente. Si impara giocando.' : 'Le maestre non mi hanno ancora insegnato niente.'));
      return { L, R: [], single: true };
    }
    L.push(h('ul.ls-idx', list.map((l, i) => h('li', h('button.gx-link', { type: 'button', 'aria-current': String(i === li), onclick: () => { li = i; pi = 0; sheet.refill(); sheet.book.page(1); } },
      h('span.ar', { 'aria-hidden': 'true' }, '→'), h('span.t', {}, l.title)), h('span.by', {}, PEOPLE[l.by]?.name || '')))));
    const les = list[li], pages = les.pages || [], pg = pages[pi] || {};
    const R = [h('h2', {}, les.title), h('p.pencil.small', {}, PEOPLE[les.by]?.name ? `Me l'ha insegnato ${PEOPLE[les.by].name}.` : '')];
    if (pg.h) R.push(h('h3', { style: { marginTop: '14px' } }, pg.h));
    if (pg.body) R.push(h('p.ls-body', {}, pg.body));
    if (pg.spread) R.push(...(spreadDiagram(pg.spread) || []));
    if (pg.cards?.length) R.push(h('div.ls-cards', pg.cards.filter((id) => CARD[id]).map((id) => h('figure', h('img', { src: cardUrl(id), alt: CARD[id].name, loading: 'lazy' }), h('figcaption', {}, CARD[id].name)))));
    if (pages.length > 1) {
      const go = (d) => { pi = Math.max(0, Math.min(pages.length - 1, pi + d)); sheet.refill(true); };
      R.push(h('div.ls-pager',
        h('button.gx-btn', { type: 'button', disabled: pi === 0, onclick: () => go(-1) }, '←'),
        h('span.n', {}, `pagina ${pi + 1} di ${pages.length}`),
        h('button.gx-btn', { type: 'button', disabled: pi === pages.length - 1, onclick: () => go(1) }, '→')));
    }
    return { L, R };
  } });
}
