// The shop: a counter in the dark with four tools on paper tags (bottle, sieve and shears, incense,
// pendulum) and two cards for sale: two Majors of this chapter's row that she lacks, expensive.
// Buying a tool adds to state.tools; buying a card goes through the found ceremony (card.found).
// openShop() -> Promise resolved when she leaves.
import { h, css, openOverlay } from '../core/dom.js';
import { state, save } from '../core/state.js';
import { call } from '../core/services.js';
import { CARD } from '../data/cards.base.js';
import { addCoins } from '../core/progress.js';
import { INK, PENCIL, RED, HAND, SERIF, GOLD, baseCss, paperBg, svgEl } from './paper.js';
import { TOOL_ART, purse, cardBack } from './art.js';
import { TOOLS, CARD_PRICE, shopRow, shopCards, canBuy } from './logic.js';
import { onEscape } from './book.js';

const CSS = `
.sp-w{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:radial-gradient(ellipse 80% 60% at 50% 30%,#2a1f22,#110c10 75%);color:#f1e7cf;font:16px system-ui,sans-serif;animation:gx-fade .2s}
.sp-bar{flex:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:calc(6px + env(safe-area-inset-top)) 12px 4px;max-width:900px;width:100%;margin:0 auto;box-sizing:border-box}
.sp-purse{display:flex;align-items:center;gap:6px;font:700 22px ${HAND};color:#f1e7cf}
.sp-main{flex:1;min-height:0;display:flex;flex-direction:column;max-width:900px;width:100%;margin:0 auto;padding:4px 14px 0;box-sizing:border-box}
.sp-hello{font:italic 21px/28px ${SERIF};color:#e3d6bb;text-align:center;margin:6px 8px 14px}
.sp-hello small{display:block;font:18px ${HAND};color:#b9ab90;font-style:normal;margin-top:2px}
.sp-tools{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.sp-tag{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:12px 10px 12px;border-radius:4px 10px 4px 10px;background:${paperBg()};color:${INK};font:19px/23px ${HAND};text-align:center;box-shadow:0 6px 16px #000a;transform:rotate(var(--r))}
.sp-tag::before{content:'';position:absolute;top:-7px;left:50%;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:#2b1c14;box-shadow:inset 0 0 0 2px #a0835a}
.sp-tag .nm{font-weight:700;font-size:21px;line-height:24px}
.sp-tag .ln{color:${PENCIL};font-size:18px;line-height:21px;min-height:42px}
.sp-tag .own{color:${PENCIL};font-size:18px;min-height:22px}
.sp-buy{margin-top:6px;min-height:44px;min-width:110px;padding:0 14px;border-radius:10px;border:2px solid ${INK};background:#f8f0dc;color:${INK};font:700 20px ${HAND};cursor:pointer}
.sp-buy:disabled{opacity:.4;cursor:default}
.sp-buy:not(:disabled):hover{outline:2px solid ${RED};outline-offset:2px}
.sp-counter{flex:1 0 auto;margin:26px -14px 0;padding:14px 14px calc(18px + env(safe-area-inset-bottom));border-radius:4px 4px 0 0;background:linear-gradient(#5a3a22 0 6px,#3a2516 6px,#24170f);border-top:1px solid #8a6040;box-shadow:0 -8px 20px #0008}
.sp-h{font:20px ${HAND};color:#cdbfa3;margin:0 0 10px;text-align:center}
.sp-cards{display:flex;justify-content:center;gap:28px;flex-wrap:wrap}
.sp-card{display:flex;flex-direction:column;align-items:center;gap:6px}
.sp-card .sp-back{filter:drop-shadow(0 8px 14px #000c);transform:rotate(var(--r))}
.sp-card .nm{font:21px/24px ${HAND};color:#f1e7cf}
.sp-none{font:19px ${HAND};color:#b9ab90;text-align:center}
.sp-say{min-height:30px;text-align:center;font:20px ${HAND};color:${GOLD};margin-top:12px}
@media (max-width:719px){
  .sp-tools{grid-template-columns:1fr 1fr;gap:16px 12px}
  .sp-cards{gap:20px}
}
`;

export function openShop() {
  baseCss(); css('ui-shop', CSS);
  return new Promise((resolve) => {
    let closeOverlay = () => {}, popEsc = () => {};
    const finish = () => { popEsc(); closeOverlay(); resolve(); };
    const coins = h('span');
    const purseEl = h('div.sp-purse', svgEl(purse({ size: 34, stroke: '#e9dcc0' })), coins);
    const say = h('p.sp-say', { role: 'status' });
    const main = h('div.sp-main.gx-scroll');
    const el = h('div.sp-w', { role: 'dialog', 'aria-label': 'La bottega' },
      h('div.sp-bar', purseEl, h('button.gx-ui', { type: 'button', onclick: finish }, h('span', {}, 'Esci'), h('span.x', { 'aria-hidden': 'true' }, '✕'))), main);
    const draw = () => {
      coins.textContent = `${state.coins || 0} monete`;
      const tools = Object.values(TOOLS).map((t, i) => {
        const n = state.tools?.[t.id] || 0;
        return h('div.sp-tag', { style: `--r:${[-1.4, 1, -0.6, 1.5][i]}deg` },
          svgEl(TOOL_ART[t.id]({ size: 50 })), h('span.nm', {}, t.name), h('span.ln', {}, t.line),
          h('span.own', {}, n ? `ne ho ${n}` : ''),
          h('button.sp-buy', { type: 'button', disabled: !canBuy(t.price), onclick: () => buyTool(t) }, `${t.price} monete`));
      });
      const ids = shopCards(), price = CARD_PRICE[shopRow()] || 40;
      const cards = ids.length ? h('div.sp-cards', ids.map((id, i) => h('div.sp-card',
        h('div.sp-back', { style: `--r:${i ? 2.5 : -2.5}deg`, html: cardBack(92, 158) }),
        h('span.nm', {}, `${CARD[id]?.roman || ''} · ${CARD[id]?.name || id}`),
        h('button.sp-buy', { type: 'button', disabled: !canBuy(price), onclick: () => buyCard(id, price) }, `${price} monete`))))
        : h('p.sp-none', {}, 'Le carte di questo capitolo le ho già tutte.');
      main.replaceChildren(
        h('p.sp-hello', {}, '«Non chiedo da dove vengono le monete. Tu non chiedere da dove vengono queste.»', h('small', {}, 'il bottegaio')),
        h('div.sp-tools', tools), h('div.sp-counter', h('p.sp-h', {}, 'Sotto il banco'), cards, say));
    };
    const buyTool = (t) => {
      if (!canBuy(t.price)) return;
      addCoins(-t.price);
      state.tools[t.id] = (state.tools[t.id] || 0) + 1;
      save();
      draw();
      say.textContent = `Preso: ${t.name.toLowerCase()}.`;
    };
    const buyCard = async (id, price) => {
      if (!canBuy(price)) return;
      addCoins(-price);
      el.style.visibility = 'hidden';
      await call('card.found', id);
      el.style.visibility = '';
      draw();
    };
    closeOverlay = openOverlay(el);
    popEsc = onEscape(finish);
    draw();
    el.dataset.ready = '1';
  });
}
