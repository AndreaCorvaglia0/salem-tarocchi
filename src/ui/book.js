// The book itself: a leather cover holding a two-page spread on a desktop, one page at a time on a
// phone. Used by the grimoire (with its ribbons) and by the sheets opened from it (a card's page, the
// lessons, the Minors), so every page of the game looks like the same object.
//   const b = bookFrame({ ribbons?, onClose, label }); b.fill(L, R, { single }); b.page(0|1); b.el
import { h, css, isNarrow } from '../core/dom.js';
import { PENCIL, HAND, baseCss } from './paper.js';

export function bookCss() {
  baseCss();
  css('ui-book', `
.bk{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:radial-gradient(ellipse at 50% 38%,#231b26f4,#08070cf8);font:16px system-ui,sans-serif;animation:gx-fade .18s ease-out}
.bk-bar{flex:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:calc(6px + env(safe-area-inset-top)) 12px 4px;max-width:1160px;width:100%;margin:0 auto;box-sizing:border-box}
.bk-bar .mid{flex:1;text-align:center;color:#cbbfa6;font:20px ${HAND};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bk-body{flex:1;min-height:0;display:flex;flex-direction:column;max-width:1160px;width:100%;margin:0 auto;padding:0 14px calc(14px + env(safe-area-inset-bottom));box-sizing:border-box}
.bk-ribs{flex:none;display:flex;gap:10px;padding:0 30px;height:50px;align-items:flex-end;position:relative;z-index:2}
.bk-rib{position:relative;flex:none;width:118px;height:40px;padding:10px 0 0;border:0;background:var(--rib);color:#f6eedb;font:700 21px/1 ${HAND};cursor:pointer;clip-path:polygon(0 0,50% 9px,100% 0,100% 100%,0 100%);box-shadow:inset 0 -8px 10px -8px #0008;opacity:.72;transition:height .18s,opacity .18s;-webkit-tap-highlight-color:transparent}
.bk-rib[aria-selected=true]{height:50px;opacity:1}
.bk-rib:focus-visible{outline:none;filter:brightness(1.25)}
.bk-cover{flex:1;min-height:0;display:flex;padding:9px;border-radius:10px 12px 12px 10px;background:linear-gradient(135deg,#3b2422,#22151a);box-shadow:0 20px 50px #000c,inset 0 0 0 2px #573632}
.bk-spread{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;border-radius:3px;overflow:hidden}
.bk-pg{position:relative;min-height:0;padding:26px 34px 30px 40px}
.bk-pg.l{box-shadow:inset -30px 0 32px -26px #5a452c99;border-right:1px solid #c6b28a}
.bk-pg.r{box-shadow:inset 30px 0 32px -26px #5a452c99;padding:26px 40px 30px 34px}
.bk-pg:focus{outline:none}
.bk-turn{display:none}
@media (min-width:720px){.bk-pg.gx-paper{font-size:22px;line-height:32px}}
.bk-folio{position:absolute;bottom:8px;font:18px ${HAND};color:${PENCIL}}
.bk-pg.l .bk-folio{left:20px}.bk-pg.r .bk-folio{right:20px}
.bk-set{position:absolute;top:calc(56px + env(safe-area-inset-top));left:12px;z-index:5;width:min(330px,calc(100vw - 24px));padding:14px;border-radius:12px;background:#17141c;border:1px solid #4a4256;box-shadow:0 12px 30px #000a;display:flex;flex-direction:column;gap:8px;box-sizing:border-box;color:#f2ece0}
.bk-set[hidden]{display:none}
.bk-tog{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:44px;padding:0 14px;border-radius:10px;background:none;border:1px solid #4a4256;color:#f2ece0;cursor:pointer;font:16px system-ui,sans-serif}
.bk-tog .v{color:#a99fb5}.bk-tog[aria-pressed=true] .v{color:#e7c873;font-weight:600}
.bk-tog.warn{color:#f0b3a8;border-color:#6b3a36}
.bk-set p{margin:0;font-size:15px;color:#cfc4b4}
@media (max-width:719px){
  .bk-bar{padding:calc(4px + env(safe-area-inset-top)) 8px 2px}
  .bk-body{padding:0 6px calc(6px + env(safe-area-inset-bottom))}
  .bk-ribs{padding:0 10px;gap:6px;height:46px}
  .bk-rib{flex:1;width:auto;height:36px;font-size:21px}
  .bk-rib[aria-selected=true]{height:46px}
  .bk-cover{padding:5px}
  .bk-spread{grid-template-columns:1fr}
  .bk-spread[data-p="0"]>.r,.bk-spread[data-p="1"]>.l{display:none}
  .bk-spread[data-single]>.r{display:none}
  .bk-spread[data-single]>.l{display:block}
  .bk-pg,.bk-pg.r{padding:20px 18px 26px 22px;box-shadow:inset 0 0 40px -18px #5a452c88;border:0}
  .bk-turn{display:flex;justify-content:flex-end;margin-top:22px}
  .bk-pg.r .bk-turn{justify-content:flex-start}
  .bk-folio{display:none}
}
`);
}

export function bookFrame({ ribbons = null, onClose, label = 'Grimorio', mid = '', closeText = 'Chiudi', settings = null } = {}) {
  bookCss();
  const el = h('div.bk', { role: 'dialog', 'aria-label': label });
  const close = h('button.gx-ui', { type: 'button', 'aria-label': closeText, onclick: () => onClose?.() }, h('span', {}, closeText), h('span.x', { 'aria-hidden': 'true' }, '✕'));
  let left = h('span');
  let panel = null;
  if (settings) {
    panel = h('div.bk-set', { hidden: true });
    const btn = h('button.gx-ui', { type: 'button', 'aria-label': 'Impostazioni', 'aria-expanded': 'false' }, h('span', { 'aria-hidden': 'true', style: { fontSize: '19px' } }, '⚙'));
    btn.onclick = () => { panel.hidden = !panel.hidden; btn.setAttribute('aria-expanded', String(!panel.hidden)); if (!panel.hidden) settings(panel); };
    left = btn;
    el.closeSettings = () => { if (panel.hidden) return false; panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); return true; };
  }
  const spread = h('div.bk-spread', { 'data-p': '0' });
  const L = h('section.bk-pg.l.gx-paper.gx-scroll', { tabindex: '-1' }), R = h('section.bk-pg.r.gx-paper.gx-scroll', { tabindex: '-1' });
  spread.append(L, R);
  const body = h('div.bk-body', ribbons, h('div.bk-cover', spread));
  el.append(...[h('div.bk-bar', left, h('span.mid', {}, mid), close), panel, body].filter(Boolean));
  const page = (p) => { spread.dataset.p = String(p); (p ? R : L).scrollTop = 0; };
  const turn = (to) => h('div.bk-turn', h('button.gx-btn', { type: 'button', onclick: () => page(to) }, to ? 'Pagina dopo →' : '← Pagina prima'));
  const fill = (lk, rk, { single = false, folio = null } = {}) => {
    const phone = isNarrow();
    if (single && phone) { spread.dataset.single = '1'; L.replaceChildren(...[...lk, ...rk].filter(Boolean)); R.replaceChildren(); }
    else {
      delete spread.dataset.single;
      L.replaceChildren(...lk.filter(Boolean), turn(1)); R.replaceChildren(...rk.filter(Boolean), turn(0));
      if (folio) { L.append(h('span.bk-folio', {}, folio[0])); R.append(h('span.bk-folio', {}, folio[1])); }
    }
    page(0);
  };
  // swipe between the two pages on a phone (horizontal, clearly more than vertical)
  let sx = 0, sy = 0;
  spread.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  spread.addEventListener('touchend', (e) => {
    if (!isNarrow() || spread.dataset.single) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) page(dx < 0 ? 1 : 0);
  }, { passive: true });
  return { el, L, R, spread, fill, page, close };
}

export const pencilNote = (t) => h('p.pencil.small', {}, t);

// Escape closes the topmost thing only (a sheet above the grimoire, the zoom above a sheet...)
const escs = [];
let listening = false;
export function onEscape(fn) {
  escs.push(fn);
  if (!listening) {
    listening = true;
    globalThis.addEventListener?.('keydown', (e) => { if (e.key === 'Escape' && escs.length) { e.preventDefault(); e.stopPropagation(); escs[escs.length - 1](); } }, true);
  }
  return () => { const i = escs.lastIndexOf(fn); if (i >= 0) escs.splice(i, 1); };
}
export const escDepth = () => escs.length;
