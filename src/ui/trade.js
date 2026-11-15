// Swapping duplicates with Ginepra: she taps one of her duplicate Minors, then one of the three
// cards Ginepra offers (Minors she lacks). One duplicate for one card; the new card goes through
// the found ceremony (card.found). openTrade() -> Promise resolved when she leaves.
import { h, css, openOverlay, cardUrl } from '../core/dom.js';
import { state, save } from '../core/state.js';
import { call } from '../core/services.js';
import { CARD, MINORS } from '../data/cards.base.js';
import { hintOnce } from '../core/progress.js';
import { HAND, SERIF, GOLD, baseCss } from './paper.js';

const CSS = `
.tr-w{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:radial-gradient(ellipse 80% 60% at 50% 30%,#22281f,#0f120e 75%);color:#f1e7cf;animation:gx-fade .2s}
.tr-bar{flex:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:calc(6px + env(safe-area-inset-top)) 12px 4px;max-width:900px;width:100%;margin:0 auto;box-sizing:border-box}
.tr-t{font:700 24px ${HAND}}
.tr-main{flex:1;min-height:0;max-width:900px;width:100%;margin:0 auto;padding:6px 14px calc(18px + env(safe-area-inset-bottom));box-sizing:border-box}
.tr-h{font:21px ${HAND};color:#cdbfa3;margin:14px 0 10px;text-align:center}
.tr-row{display:flex;justify-content:center;gap:14px;flex-wrap:wrap}
.tr-c{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;width:96px;padding:6px 2px;border:2px solid transparent;border-radius:10px;background:none;color:#f1e7cf;font:18px/20px ${HAND};cursor:pointer}
.tr-c img{width:84px;height:144px;object-fit:cover;border-radius:6px;box-shadow:0 6px 12px #000a}
.tr-c.on{border-color:${GOLD};background:#ffffff14}
.tr-c:disabled{opacity:.45;cursor:default}
.tr-n{position:absolute;top:0;right:2px;min-width:26px;padding:2px 4px;border-radius:12px;background:#2b1c14;border:1px solid #a0835a;font:700 17px ${HAND}}
.tr-none{font:20px/26px ${HAND};color:#b9ab90;text-align:center;margin:8px 12px}
.tr-say{min-height:54px;text-align:center;font:italic 20px/27px ${SERIF};color:#e3d6bb;margin:14px 10px 0}
`;

const dupeIds = () => Object.keys(state.dupes || {}).filter((id) => state.dupes[id] > 0 && CARD[id]);
const missing = () => MINORS.filter((c) => !state.cards[c.id]?.found).map((c) => c.id);
// three cards she lacks, of different suits when possible
export function offer(lack = missing(), rng = Math.random) {
  const pool = [...lack].sort(() => rng() - 0.5), out = [];
  for (const id of pool) if (out.length < 3 && !out.some((o) => CARD[o].suit === CARD[id].suit)) out.push(id);
  for (const id of pool) if (out.length < 3 && !out.includes(id)) out.push(id);
  return out;
}

export function openTrade() {
  baseCss(); css('ui-trade', CSS);
  hintOnce('trade');
  return new Promise((resolve) => {
    let close = () => {}, picked = null, hers = offer();
    const main = h('div.tr-main.gx-scroll');
    const say = h('p.tr-say', { role: 'status' });
    const finish = () => { close(); resolve(); };
    const el = h('div.tr-w', { role: 'dialog', 'aria-label': 'Scambio con Ginepra' },
      h('div.tr-bar', h('span.tr-t', {}, 'Scambio con Ginepra'), h('button.gx-ui', { type: 'button', onclick: finish }, h('span', {}, 'Esci'), h('span.x', { 'aria-hidden': 'true' }, '✕'))), main);
    const card = (id, { n, on, disabled, onclick }) => h(`button.tr-c${on ? '.on' : ''}`, { type: 'button', disabled: !!disabled, onclick },
      h('img', { src: cardUrl(id), alt: '' }), n > 1 ? h('span.tr-n', {}, `×${n}`) : null, h('span', {}, CARD[id].name));
    const swap = async (give, take) => {
      state.dupes[give] -= 1; if (state.dupes[give] <= 0) delete state.dupes[give]; save();
      close();
      await call('card.found', take);
      picked = null; hers = offer();
      close = openOverlay(el); draw();
    };
    function draw() {
      const mine = dupeIds();
      main.replaceChildren();
      main.append(h('p.tr-h', {}, 'I miei doppioni'));
      if (!mine.length) main.append(h('p.tr-none', {}, 'Per ora non ho doppioni da darle. Ne troverò altri nell’erba alta.'));
      else main.append(h('div.tr-row', {}, ...mine.map((id) => card(id, { n: state.dupes[id], on: picked === id, onclick: () => { picked = picked === id ? null : id; draw(); } }))));
      main.append(h('p.tr-h', {}, 'Le carte di Ginepra'));
      if (!hers.length) main.append(h('p.tr-none', {}, 'Delle piccole non me ne manca più nessuna.'));
      else main.append(h('div.tr-row', {}, ...hers.map((id) => card(id, { disabled: !picked, onclick: () => swap(picked, id) }))));
      say.textContent = !mine.length || !hers.length ? '' : picked ? `In cambio del mio ${CARD[picked].name} posso scegliere una delle sue.` : 'Scelgo prima il doppione che le do.';
      main.append(say);
    }
    close = openOverlay(el); draw();
  });
}
