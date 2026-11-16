// The "Io" ribbon: who I am in this story. Left page: name, title and level with the bar, my card
// (and, smaller, the card of my sign), the next step. Right page: the last lines of my diary and, at the
// foot, three small drawings: the cards found, the coins, the tools I carry.
import { h, css, cardUrl } from '../core/dom.js';
import { call } from '../core/services.js';
import { state } from '../core/state.js';
import { CARD, SIGNS } from '../data/cards.base.js';
import { sheet } from '../data/cards.js';
import { levelProgress, titleOf, yourCard, lastDiary, traitWords } from '../core/progress.js';
import { INK, PENCIL, RED, inkBar, svgEl } from './paper.js';
import { TOOL_ART, purse, fan, silhouette, treat, paw } from './art.js';
import { POP, popProgress, tartufoLevel, tartufoJudge } from '../core/bonds.js';
import { nextStep, foundMajors, slotOf, TOOLS } from './logic.js';

const CSS = `
.io-name{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.io-lv{display:flex;align-items:center;gap:12px;margin-top:6px;flex-wrap:wrap}
.io-lv .t{font-size:23px}
.io-card{display:flex;gap:16px;align-items:center;margin-top:20px}
.io-card .im{flex:none;width:104px;height:178px;box-shadow:0 3px 8px #5a452c77;border:3px solid #fbf5e6;transform:rotate(-2deg)}
.io-card .im.ghost{border:0;box-shadow:none;background:none}
.io-card .lb{display:block;color:${PENCIL};font-size:18px;line-height:22px}
.io-card .nm{display:block;font-weight:700;font-size:25px;line-height:30px}
.io-card .ln{display:block;line-height:27px;margin-top:2px}
.io-card .tw{display:block;margin-top:8px;font-size:24px;line-height:28px;color:${INK};transform:rotate(-1.5deg)}
.io-birth{display:flex;gap:12px;align-items:center;margin:18px 0 0 6px}
.io-birth .im{flex:none;width:38px;height:65px;border:2px solid #fbf5e6;box-shadow:0 2px 5px #5a452c66;transform:rotate(3deg)}
.io-birth .im.ghost{border:0;box-shadow:none}
.io-birth p{font-size:19px;line-height:24px;color:${PENCIL}}
.io-next{margin-top:34px;font-size:24px;line-height:32px}
.io-next .d{display:block;font-size:18px;line-height:22px;color:${PENCIL}}
.io-next .ar{color:${RED};margin-right:8px}
.io-bond{margin-top:12px;font-size:20px;line-height:25px}
.io-bond .k{display:block;font-size:17px;line-height:20px;color:${PENCIL}}
.io-bond .row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.io-bond .paws{display:inline-flex;gap:3px;vertical-align:middle}
.io-bond .j{display:block;margin-top:2px;font-size:19px;line-height:24px}
.io-r{margin-top:0}
@media (max-width:719px){.io-r{margin-top:34px}}
.io-diary{list-style:none;padding:0;margin-top:8px!important}
.io-diary li{position:relative;padding-left:22px;line-height:30px;margin-bottom:8px}
.io-diary li::before{content:'–';position:absolute;left:3px;color:${PENCIL}}
.io-things{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:22px;align-items:flex-end}
.io-thing{display:flex;flex-direction:column;align-items:center;min-width:56px;text-align:center}
.io-thing span{font-size:19px;line-height:22px;color:${INK}}
.io-thing svg{display:block}
.io-thing.use{font:inherit;background:none;border:0;padding:4px 6px;border-radius:8px;cursor:pointer;color:inherit;-webkit-tap-highlight-color:transparent}
.io-thing.use em{font-style:normal;font-size:18px;line-height:20px;color:${RED};text-decoration:underline}
.io-thing.use:focus-visible{outline:2px dashed ${RED}}
@media (max-width:719px){.io-card{gap:14px}.io-card .im{width:96px;height:164px}}
`;

const USABLE = { bottle: 'stappa' };
const thumb = (id, cls, { ghostRoman } = {}) => {
  const sl = slotOf(id);
  if (sl.kind === 'missing' || sl.kind === 'taken') { const g = h(`div.im.ghost${cls ? `.${cls}` : ''}`); g.append(svgEl(silhouette(ghostRoman ?? CARD[id]?.roman ?? ''))); return g; }
  return h(`span.im.gx-veil${sl.kind === 'veiled' ? '.veiled' : ''}`, {}, h('img', { src: cardUrl(id), alt: CARD[id]?.name || '', loading: 'lazy' }));
};

export function ioPages(ctx) {
  const { study } = ctx;
  css('ui-io', CSS);
  const name = state.player?.name || '';
  const lp = levelProgress();
  const L = [];
  L.push(h('div.io-name', h('h2', {}, name || 'Io')));
  L.push(h('div.io-lv', h('span.t', {}, `${titleOf(lp.level)} · ${lp.level}`), inkBar(lp.top ? 1 : lp.into, { w: 150, h: 13 })));
  // popularity and Tartufo: two small lines (core/bonds.js)
  if (!study || state.started) {
    const pp = popProgress();
    L.push(h('div.io-bond', h('span.k', {}, 'Popolarità'), h('span.row', h('span', {}, `${POP[pp.level].name}.`), pp.top ? null : inkBar(pp.into, { w: 70, h: 7 }))));
    if (state.powers?.cat) {
      const tl = tartufoLevel(), paws = h('span.paws', { 'aria-label': `${tl + 1} su 5` });
      for (let i = 0; i < 5; i++) paws.append(svgEl(paw(i <= tl, 16)));
      L.push(h('div.io-bond', h('span.row', h('span.k', {}, 'Tartufo'), paws), h('span.j', {}, tartufoJudge())));
    }
  }
  // my card
  const mine = yourCard(), mineFound = slotOf(mine).kind !== 'missing';
  const S = sheet(mine) || {};
  // three handwritten words of how I am (the portrait), when there are any: "Curiosa, schietta, gentile."
  const words = traitWords();
  const tw = words.length ? `${words.join(', ').replace(/^./, (c) => c.toUpperCase())}.` : null;
  L.push(h('div.io-card', thumb(mine), h('div', {},
    h('span.lb', {}, 'La mia carta'),
    h('span.nm', {}, CARD[mine]?.name || 'Il Matto'),
    h('span.ln', {}, mineFound ? (S.core || (CARD[mine]?.words || []).join(', ')) : 'Non l\'ho ancora trovata.'),
    tw ? h('span.tw', {}, tw) : null)));
  // the card of my sign, smaller
  const bc = state.player?.birthCard, sign = SIGNS.find((x) => x.id === state.player?.sign);
  if (bc && CARD[bc]) L.push(h('div.io-birth', thumb(bc), h('p', {}, `La carta del mio segno, ${sign?.name || ''}: ${CARD[bc].name}.`)));
  // the next step
  if (!study || state.started) {
    const st = nextStep();
    L.push(h('p.io-next', h('span.d', {}, 'Adesso'), h('span.ar', { 'aria-hidden': 'true' }, '→'), st.text));
  }
  // right page: the diary and the things
  const R = [h('h2', {}, 'Diario')];
  const lines = lastDiary(3);
  R.push(lines.length ? h('ul.io-diary', lines.map((d) => h('li', {}, d.t))) : h('p.pencil', { style: { marginTop: '8px' } }, 'Ancora niente da scrivere.'));
  R.push(h('div.sp'), h('div.sp'));
  const things = [h('div.io-thing', svgEl(fan({ size: 52 })), h('span', {}, `${foundMajors()} su 22`))];
  things.push(h('div.io-thing', svgEl(purse({ size: 52 })), h('span', {}, `${state.coins || 0} monete`)));
  for (const [id, n] of Object.entries(state.tools || {})) {
    if (!(n > 0) || !TOOL_ART[id]) continue;
    const kids = [svgEl(TOOL_ART[id]({ size: 52 })), h('span', {}, `${TOOLS[id]?.short || ''}${n > 1 ? ` ×${n}` : ''}`)];
    // the bottle is used from here (the grimoire closes, a note says what happened)
    if (!study && USABLE[id]) things.push(h('button.io-thing.use', { type: 'button', title: TOOLS[id]?.name, onclick: () => { ctx.close?.(); call('tool.use', id); } }, ...kids, h('em', {}, USABLE[id])));
    else things.push(h('div.io-thing', { title: TOOLS[id]?.name }, ...kids));
  }
  if (state.treats > 0) things.push(h('div.io-thing', { title: 'Manicaretti per Tartufo' }, svgEl(treat({ size: 52 })), h('span', {}, `manicaretti ×${state.treats}`)));
  R.push(h('div.io-things', things));
  return { L, R: [h('div.io-r', R)], single: true };
}
