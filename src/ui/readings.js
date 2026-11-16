// «Le mie letture»: the diary of readings (state.readings, newest first), a page of the grimoire. Each line:
// the date in Italian, for whom, the small cards in a row. A tap reopens the reading as it was (ui/selfread.js
// readingScreen: recomposed from the saved cards with a fixed seed), with her note and a delete.
import { h, css, cardUrl } from '../core/dom.js';
import { state } from '../core/state.js';
import { CARD } from '../data/cards.base.js';
import { AMBITO_LABEL } from '../reading/index.js';
import { dateIt } from '../glue/selfread.rules.js';
import { INK, PENCIL, RED } from './paper.js';
import { openSheet } from './sheet.js';
import { readingScreen } from './selfread.js';

const CSS = `
.rd-list{list-style:none;padding:0;margin:8px 0 0!important;display:flex;flex-direction:column;gap:6px}
.rd-it{display:block;width:100%;padding:8px 6px 10px;border:0;border-bottom:1px dashed ${PENCIL}88;background:none;text-align:left;cursor:pointer;color:${INK};font:inherit;-webkit-tap-highlight-color:transparent}
.rd-it:focus-visible{outline:2px dashed ${RED}}
.rd-it .d{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.rd-it .d b{font-weight:700;font-size:21px}
.rd-it .d span{color:${PENCIL};font-size:18px;white-space:nowrap}
.rd-it .q{display:block;font-size:18px;line-height:23px;color:${PENCIL};overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rd-cards{display:flex;gap:4px;margin-top:5px;flex-wrap:wrap}
.rd-cards i{display:block;width:26px;height:44px;border-radius:3px;background:#2a2430 center/cover no-repeat;box-shadow:0 1px 3px #5a452c88}
.rd-cards i.rev{transform:rotate(180deg)}
.rd-cards em{font-style:normal;color:${PENCIL};font-size:17px;align-self:flex-end}
`;

const MAX_THUMBS = 5;
const item = (e, onopen) => {
  const thumbs = e.cards.slice(0, MAX_THUMBS).map((c) => h(`i${c.rev ? '.rev' : ''}`, { style: { backgroundImage: `url(${cardUrl(c.card)})` }, title: CARD[c.card]?.name || '' }));
  if (e.cards.length > MAX_THUMBS) thumbs.push(h('em', {}, `+${e.cards.length - MAX_THUMBS}`));
  return h('li', h('button.rd-it', { type: 'button', onclick: () => onopen(e) },
    h('span.d', h('b', {}, e.who === 'me' ? 'Per me' : `Per ${e.who}`), h('span', {}, dateIt(e.at))),
    h('span.q', {}, e.question?.text ? `«${e.question.text}»` : AMBITO_LABEL[e.question?.ambito] || ''),
    h('span.rd-cards', thumbs)));
};

export function openReadings() {
  css('ui-readings', CSS);
  return openSheet({
    label: 'Le mie letture', mid: 'Le mie letture',
    build: (sheet) => {
      const open = async (e) => {
        sheet.book.el.style.visibility = 'hidden';
        try { await readingScreen(e); } finally { sheet.book.el.style.visibility = ''; sheet.refill(); }
      };
      const list = Array.isArray(state.readings) ? state.readings : [];
      // two pages on a wide screen (the phone shows them as one)
      const half = Math.ceil(list.length / 2);
      const L = [h('h2', {}, 'Le mie letture'),
        list.length ? h('ul.rd-list', list.slice(0, half).map((e) => item(e, open))) : h('p.pencil', { style: { marginTop: '10px' } }, 'Non ho ancora tenuto nessuna lettura.')];
      const R = list.length > 1 ? [h('ul.rd-list', list.slice(half).map((e) => item(e, open)))] : [];
      return { L, R, single: true };
    },
  });
}
