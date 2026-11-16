// The herbarium, a ribbon of the grimoire (docs/DESIGN.md "L'erbario"): the plants she has noticed around,
// each with its old botanical plate; the others are only a number, to be found. herbPages(ctx) builds the
// ribbon; showHerb(id) opens one plant: how to recognise it, what tradition says, what it was used for, what
// is true of it, how to grow it. History and tradition, never a medical guide.
import { h, css, openOverlay } from '../core/dom.js';
import { state } from '../core/state.js';
import { HERB, HERB_LIST, herbUrl } from '../data/herbs/base.js';
import { HERB_TEXTS } from '../data/herbs/texts.js';
import { openSheet } from './sheet.js';
import { onEscape } from './book.js';
import { HAND, INK, PENCIL, RED } from './paper.js';

const CSS = `
.hb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 8px;margin-top:8px}
.hb-it{display:flex;flex-direction:column;align-items:center;gap:3px;padding:0;border:0;background:none;color:${INK};font:19px/21px ${HAND};cursor:pointer;-webkit-tap-highlight-color:transparent}
.hb-it img{width:100%;aspect-ratio:3/4;object-fit:cover;object-position:50% 30%;border:3px solid #fbf5e6;box-shadow:0 2px 6px #5a452c66;background:#f4ecd6}
.hb-it:nth-child(odd) img{transform:rotate(-1.2deg)}.hb-it:nth-child(even) img{transform:rotate(1deg)}
.hb-it.no{cursor:default;color:${PENCIL}}
.hb-it.no i{display:block;width:100%;aspect-ratio:3/4;border:2px dashed #b9a98a;border-radius:3px;box-sizing:border-box}
.hb-risk{display:inline-block;margin:2px 0 0;padding:1px 9px;border-radius:10px;font:700 17px/22px ${HAND};color:#fbf5e6;background:${RED}}
.hb-risk.att{background:#8a6a2a}
.hb-plate{display:block;width:min(100%,300px);margin:8px auto 4px;padding:0;border:0;background:none;cursor:zoom-in}
.hb-plate img{display:block;width:100%;border:4px solid #fbf5e6;box-shadow:0 3px 10px #5a452c77}
.hb-cred{margin:2px 0 0;text-align:center;font:15px/18px ${HAND};color:${PENCIL}}
.hb-sec{margin-top:12px}.hb-sec h3{margin:0 0 2px}.hb-sec p{margin:0}
.hb-grow{margin:2px 0 0;padding:0;list-style:none}.hb-grow li{margin:2px 0}.hb-grow b{font-weight:700}
.hb-zoom{position:fixed;inset:0;z-index:130;display:flex;align-items:center;justify-content:center;background:#07070df0;overflow:auto;touch-action:pinch-zoom}
.hb-zoom img{max-width:100%;max-height:100%}
`;

const seen = () => (state.herbs && typeof state.herbs === 'object' ? state.herbs : {});
export const herbsSeen = () => HERB_LIST.filter((p) => seen()[p.id]).length;
const riskTag = (p) => (p.risk === 'velenosa' ? h('span.hb-risk', {}, 'velenosa') : p.risk === 'attenzione' ? h('span.hb-risk.att', {}, 'da maneggiare con cura') : null);

function zoomPlate(id) {
  const el = h('div.hb-zoom', { role: 'dialog', 'aria-label': HERB[id]?.name || '' }, h('img', { src: herbUrl(id), alt: HERB[id]?.name || '' }));
  const close = openOverlay(el);
  const pop = onEscape(() => { pop(); close(); });
  el.onclick = () => { pop(); close(); };
}

export function herbBody(id) {
  css('ui-herbs', CSS);
  const p = HERB[id], T = HERB_TEXTS[id] || {};
  const sec = (t, body) => (body ? h('div.hb-sec', h('h3', {}, t), h('p', {}, body)) : null);
  const sky = [T.pianeta ? `Pianeta: ${T.pianeta}` : null, T.elemento ? `Elemento: ${T.elemento}` : null].filter(Boolean).join(' · ');
  const L = [h('h2', {}, p.name), h('p.pencil', { style: { margin: 0 } }, h('i', {}, p.latin)), riskTag(p),
    h('button.hb-plate', { type: 'button', 'aria-label': 'Ingrandisci la tavola', onclick: () => zoomPlate(id) }, h('img', { src: herbUrl(id), alt: `${p.name}, tavola botanica` })),
    h('p.hb-cred', {}, p.plate.work), sec('Come riconoscerla', T.riconosci)];
  const g = T.coltiva || {};
  const R = [sec('Che cosa se ne diceva', T.tradizione), sec('A che cosa serviva', T.usi), sec('Che cosa c\'è di vero', T.vero),
    g.luce || g.acqua || g.quando || g.nota ? h('div.hb-sec', h('h3', {}, 'Coltivarla'), h('ul.hb-grow', [['Luce', g.luce], ['Acqua', g.acqua], ['Quando', g.quando], ['Un consiglio', g.nota]].filter((x) => x[1]).map(([k, v]) => h('li', h('b', {}, `${k}: `), v)))) : null,
    sky ? h('p.pencil', { style: { marginTop: '12px' } }, sky) : null, sec('Una curiosità', T.curiosita)];
  return { L: L.filter(Boolean), R: R.filter(Boolean) };
}
export const showHerb = (id) => (HERB[id] ? openSheet({ label: HERB[id].name, build: () => ({ ...herbBody(id), single: true }) }) : Promise.resolve());

export function herbPages(ctx) {
  css('ui-herbs', CSS);
  const S = seen(), n = herbsSeen();
  const item = (p) => (S[p.id]
    ? h('button.hb-it', { type: 'button', onclick: async () => { await showHerb(p.id); ctx.rerender?.(); } }, h('img', { src: herbUrl(p.id), alt: '', loading: 'lazy' }), h('span', {}, p.name))
    : h('div.hb-it.no', {}, h('i'), h('span', {}, '?')));
  const half = Math.ceil(HERB_LIST.length / 2);
  const L = [h('h2', {}, 'L\'erbario'),
    h('p.pencil', {}, n ? `${n} piante su ${HERB_LIST.length}. Le altre sono in giro, da notare.` : 'Qui segno le piante che noto in giro: vicino alle case, lungo i sentieri, negli angoli in ombra.'),
    h('div.hb-grid', HERB_LIST.slice(0, half).map(item))];
  const R = [h('div.hb-grid', HERB_LIST.slice(half).map(item)), h('p.pencil', { style: { marginTop: '12px' } }, 'Storia e tradizione, non rimedi: le piante segnate come velenose non si assaggiano.')];
  return { L, R, single: true };
}
