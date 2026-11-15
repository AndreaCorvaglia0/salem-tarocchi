// The 56 Minors, after the ending: four suits, fourteen slots each, the same logic as the Majors,
// compact. Left page: Bastoni and Coppe; right page: Spade and Denari. openMinors() -> Promise.
import { h, css } from '../core/dom.js';
import { state } from '../core/state.js';
import { CARD, SUITS } from '../data/cards.base.js';
import { PENCIL } from './paper.js';
import { slot, slotCss } from './slots.js';
import { minorSlots } from './logic.js';
import { openSheet } from './sheet.js';
import { showCard } from './cardpage.js';

const slotFound = (id) => !!state.cards?.[id]?.found;
const ZONE = { w: 'nel bosco', c: 'lungo il fiume', s: 'sulle alture', p: 'al mercato' };
const CSS = `
.mn-suit{margin-top:16px}
.mn-suit .lb{display:flex;justify-content:space-between;align-items:baseline;font-size:21px;line-height:26px;margin-bottom:6px}
.mn-suit .lb small{font-size:18px;color:${PENCIL}}
.mn-cap{min-height:56px;margin-top:14px!important}
`;

export function openMinors() {
  css('ui-minors', CSS); slotCss();
  return openSheet({ label: 'Gli Arcani Minori', build: (sheet) => {
    const cap = h('p.mn-cap.pencil', { role: 'status' }, 'Si trovano nell\'erba alta. I doppioni li scambio con Ginepra.');
    const suit = (s) => {
      const n = s.ids.filter((id) => CARD[id] && slotFound(id)).length;
      return h('div.mn-suit', h('div.lb', h('span', {}, s.name), h('small', {}, `${n} su 14 · ${SUITS[s.suit]?.element || ''}`)),
        h('div.cs-grid', s.ids.map((id) => slot(id, async (cid, sl) => {
          cap.classList.add('gx-live');
          if (sl.kind === 'missing') { cap.textContent = `${CARD[cid].name}: ancora da trovare, ${ZONE[s.suit]}.`; return; }
          if (sl.kind === 'taken') { cap.textContent = `${CARD[cid].name}: sequestrata.`; return; }
          await showCard(cid); sheet.refill(true);
        }))));
    };
    const all = minorSlots();
    return { L: [h('h2', {}, 'Gli Arcani Minori'), suit(all[0]), suit(all[1])], R: [suit(all[2]), suit(all[3]), cap], single: true };
  } });
}
