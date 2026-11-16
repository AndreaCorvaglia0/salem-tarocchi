// «Le streghe»: a page of the grimoire, reached from Io. Each witch she has met: a small portrait (the card the
// witch embodies), two short ink bars, Affinità (how much she sees herself in her: core/witches.js, from the
// traits) and Legame (what they built together: state.bonds), and one sentence in her hand on how that witch
// treats her now, chosen by the attitude (data/trials/witches.js, placeholders until the writer's pass).
import { h, css, cardUrl } from '../core/dom.js';
import { state } from '../core/state.js';
import { PEOPLE } from '../data/cards.base.js';
import { WITCHES, CARD_OF, affinityOf, bondOf, attitudeOf, metWitch } from '../core/witches.js';
import { WITCH_LINES } from '../data/trials/witches.js';
import { PENCIL, inkBar } from './paper.js';
import { openSheet } from './sheet.js';

const CSS = `
.wt-row{display:flex;gap:14px;align-items:flex-start;margin-top:18px}
.wt-row .im{flex:none;width:58px;aspect-ratio:350/600;border-radius:4px;background:#2a2430 center/cover no-repeat;border:3px solid #fbf5e6;box-shadow:0 2px 6px #5a452c88;transform:rotate(-2deg)}
.wt-row .nm{display:block;font-weight:700;font-size:23px;line-height:28px}
.wt-ax{display:flex;align-items:center;gap:10px;font-size:18px;line-height:24px;color:${PENCIL}}
.wt-ax span{min-width:76px}
.wt-row .ln{display:block;margin-top:4px;font-size:20px;line-height:26px}
`;
export const witchesMet = (s = state) => WITCHES.filter((w) => metWitch(w, s));

export function openWitches() {
  css('ui-witches', CSS);
  return openSheet({
    label: 'Le streghe', mid: 'Le streghe',
    build: () => {
      const row = (w) => h('div.wt-row', h('i.im', { style: { backgroundImage: `url(${cardUrl(CARD_OF[w])})` }, 'aria-hidden': 'true' }),
        h('div', h('span.nm', {}, PEOPLE[w]?.name || w),
          h('div.wt-ax', h('span', {}, 'Affinità'), inkBar(affinityOf(w) / 4, { w: 110, h: 10 })),
          h('div.wt-ax', h('span', {}, 'Legame'), inkBar(bondOf(w) / 4, { w: 110, h: 10, fill: '#2c5444' })),
          h('span.ln', {}, WITCH_LINES[w]?.[attitudeOf(w)] || '')));
      const met = witchesMet();
      const L = [h('h2', {}, 'Le streghe'), met.length ? null : h('p.pencil', { style: { marginTop: '10px' } }, 'Non ho ancora conosciuto nessuna strega.'), ...met.slice(0, 2).map(row)];
      return { L, R: met.slice(2).map(row), single: true };
    },
  });
}
