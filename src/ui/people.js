// «Le persone»: a page of the grimoire, reached from Io once she has met two people (docs/DESIGN.md, «Che ne
// pensi di lei?»). Each person she has met: the name; what the person stands for, once somebody has spoken
// of them; her own pencil note (the answer she gave, to whom, on which day); and what the others have said,
// each line with who said it. Text: data/story/opinions.js; rules: glue/opinions.rules.js.
import { h, css } from '../core/dom.js';
import { state } from '../core/state.js';
import { test } from '../core/cond.js';
import { PEOPLE_OP, ASKERS } from '../data/story/opinions.js';
import { metPeople, peopleOpen, opinionOf, voicesHeard, spokenOf, dayText } from '../glue/opinions.rules.js';
import { PENCIL, RED } from './paper.js';
import { openSheet } from './sheet.js';

const CSS = `
.pp-one{margin-top:20px}
.pp-one .nm{display:block;font-weight:700;font-size:24px;line-height:29px}
.pp-one .tr{display:block;font-size:20px;line-height:25px;color:${PENCIL}}
.pp-note{margin-top:6px;padding-left:12px;border-left:2px solid ${PENCIL}66;color:${PENCIL};font-size:21px;line-height:27px;transform:rotate(-.4deg)}
.pp-note .d{display:block;font-size:17px;line-height:21px}
.pp-voci{list-style:none;padding:0;margin-top:6px!important}
.pp-voci li{font-size:20px;line-height:26px;margin-top:6px}
.pp-voci .w{color:${RED}}
`;
export const peopleShown = (s = state) => peopleOpen(s, test, PEOPLE_OP);
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const who = (id) => cap(ASKERS[id] || id);

function one(p) {
  const mine = opinionOf(state, p.id), heard = voicesHeard(state, p);
  return h('div.pp-one',
    h('span.nm', {}, p.nome),
    spokenOf(state, p) ? h('span.tr', {}, `${cap(p.tratto)}.`) : h('span.tr', {}, 'Nessuno me ne ha ancora parlato.'),
    mine ? h('p.pp-note', {}, `«${mine.text.replace(/[«»]/g, '')}»`, h('span.d', {}, `L'ho detto a ${ASKERS[mine.by] || mine.by}${dayText(mine.day) ? `, ${/^(1|8|11) /.test(dayText(mine.day)) ? "l'" : 'il '}${dayText(mine.day)}` : ''}.`)) : null,
    heard.length ? h('ul.pp-voci', heard.map((v) => h('li', {}, h('span.w', {}, `${who(v.by)}: `), `«${v.t}»`))) : null);
}

export function openPeople() {
  css('ui-people', CSS);
  return openSheet({
    label: 'Le persone', mid: 'Le persone',
    build: () => {
      const met = metPeople(state, test, PEOPLE_OP), half = Math.ceil(met.length / 2);
      const L = [h('h2', {}, 'Le persone'), met.length ? h('p.pencil.small', { style: { marginTop: '8px' } }, 'Chi ho incontrato, che cosa ne penso io e che cosa ne dicono gli altri.') : h('p.pencil', { style: { marginTop: '10px' } }, 'Non ho ancora conosciuto nessuno.'), ...met.slice(0, half).map(one)];
      return { L, R: met.slice(half).map(one), single: true };
    },
  });
}
