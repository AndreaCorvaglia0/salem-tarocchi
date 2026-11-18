// The two new albums of the grimoire, next to the herbarium (notes/collezioni.md): «Pietre» and the figures of
// the peddler's sibyl. Numbered empty slots for what she has not got; a slot says «nuova» until its page is
// opened. Each page shows only what she has (lore/principi/vede-solo-quello-che-sa.md).
//   stonePages(ctx), sibylPages(ctx)   the ribbons' pages (ui/grimoire.js)
//   showStone(id), showSibyl(n)        one page, opened from the album
//   flyToBook({ src, from })           the little picture flying into the grimoire button (glue/collect.js)
//   stoneSrc(id)                       the old plate, or the stone drawn in code (art/finds.js)
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { state, save } from '../core/state.js';
import { STONE, STONE_LIST, stoneUrl } from '../data/stones.js';
import { SIBYL, SIBYL_LIST, sibylUrl, sibylThumb, SIGN_GLYPH, PLANET_GLYPH } from '../data/sibyl.js';
import { SAPERE } from '../data/sapere.js';
import { FIND_SPOTS } from '../data/world/finds.js';
import { GIFT } from '../data/gifts.js';
import { albumSlots, markSeen, countOf, cameWith, firstTold } from '../glue/collect.rules.js';
import { canPlay, marksOf, lastOf, MARKS_SHOWN } from '../glue/sibylpairs.rules.js';
import { call, has } from '../core/services.js';
import { paintStone } from '../world/art/finds.js';
import { openSheet } from './sheet.js';
import { onEscape } from './book.js';
import { HAND, INK, PENCIL, RED } from './paper.js';

const CSS = `
.cl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px 8px;margin-top:8px}
.cl-grid.sb{grid-template-columns:repeat(4,1fr);gap:10px 6px}
.cl-it{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:0;border:0;background:none;color:${INK};font:18px/20px ${HAND};cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:center}
.cl-it img{width:100%;aspect-ratio:3/4;object-fit:cover;border:3px solid #fbf5e6;box-shadow:0 2px 6px #5a452c66;background:#f4ecd6;box-sizing:border-box}
.cl-it img.px{image-rendering:pixelated;object-fit:contain;padding:14% 10%}
.cl-grid.sb .cl-it img{aspect-ratio:3/5;border-width:2px}
.cl-it:nth-child(odd) img{transform:rotate(-1.2deg)}.cl-it:nth-child(even) img{transform:rotate(1deg)}
.cl-it.no{cursor:default;color:${PENCIL}}
.cl-it.no i{display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:3/4;border:2px dashed #b9a98a;border-radius:3px;box-sizing:border-box;font:700 20px ${HAND};color:#a8987a;font-style:normal}
.cl-grid.sb .cl-it.no i{aspect-ratio:3/5;font-size:18px}
.cl-new{position:absolute;top:-6px;right:-4px;padding:0 6px;border-radius:9px;background:${RED};color:#fbf5e6;font:700 15px/19px ${HAND};transform:rotate(6deg);box-shadow:0 1px 3px #0005}
.cl-pic{display:block;width:min(100%,280px);margin:8px auto 4px;padding:0;border:0;background:none;cursor:zoom-in}
.cl-pic img{display:block;width:100%;border:4px solid #fbf5e6;box-shadow:0 3px 10px #5a452c77;background:#f4ecd6;box-sizing:border-box}
.cl-pic img.px{image-rendering:pixelated;padding:16% 12%}
.cl-pic.sb{width:min(72%,230px)}
.cl-cred{margin:2px 0 0;text-align:center;font:15px/18px ${HAND};color:${PENCIL}}
.cl-sec{margin-top:12px}.cl-sec h3{margin:0 0 2px}.cl-sec p{margin:0}
.cl-keys{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:6px 0 0}
.cl-keys span{padding:1px 10px;border-radius:12px;border:1.5px solid #8a7a5a;font:19px/24px ${HAND};color:${INK};background:#fbf5e688}
.cl-verse{margin:4px 0 0;font-style:italic}
.cl-zoom{position:fixed;inset:0;z-index:130;display:flex;align-items:center;justify-content:center;background:#07070df0;overflow:auto;touch-action:pinch-zoom}
.cl-zoom img{max-width:100%;max-height:100%}
.cl-zoom img.px{image-rendering:pixelated;width:min(90vw,90vh)}
.cl-fly{position:fixed;z-index:95;left:0;top:0;width:34px;height:auto;pointer-events:none;filter:drop-shadow(0 3px 6px #000a);transition:transform .7s cubic-bezier(.45,.05,.7,.4),opacity .7s;will-change:transform}
.cl-fly.px{image-rendering:pixelated}
.cl-marks{display:block;height:8px;line-height:0;letter-spacing:0}.cl-marks i{display:inline-block;width:5px;height:5px;margin:0 1px;border-radius:50%;background:${PENCIL}}
.cl-play{position:relative;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin:10px 0 2px}
.cl-play .cl-new{top:-9px;right:6px}
.bk-rib.dot::after{content:'';position:absolute;top:7px;right:9px;width:9px;height:9px;border-radius:50%;background:#f0d27a;box-shadow:0 0 0 2px #2a2134aa}
@media (max-width:719px){.bk-ribs.many .bk-rib{font-size:17px}.bk-ribs.many{gap:4px;padding:0 6px}.bk-rib.dot::after{top:5px;right:4px;width:8px;height:8px}}
`;
export const cssOn = () => css('ui-collect', CSS);

// ---- pictures ----
const drawn = {};
// a stone with no old plate is painted in code, big pixels on paper
export function stoneSrc(id) {
  const url = stoneUrl(id);
  if (url) return { src: url, px: false };
  if (!drawn[id]) drawn[id] = paintStone(STONE[id].look, 30, 26, id.length).toDataURL('image/png');
  return { src: drawn[id], px: true };
}
function zoom(src, px, label) {
  cssOn();
  const el = h('div.cl-zoom', { role: 'dialog', 'aria-label': label }, h(px ? 'img.px' : 'img', { src, alt: label }));
  const close = openOverlay(el);
  const pop = onEscape(() => { pop(); close(); });
  el.onclick = () => { pop(); close(); };
}
const sec = (t, ...body) => (body.some(Boolean) ? h('div.cl-sec', h('h3', {}, t), ...body.filter(Boolean).map((b) => (typeof b === 'string' ? h('p', {}, b) : b))) : null);

// ---- how she got it, in her words ----
const GIVER = { bottegaio: 'il bottegaio', gravedigger: 'il becchino', ortica: 'Ortica', edera: 'Nonna Edera', ginepra: 'Ginepra', tartufo: 'Tartufo' };
const spotOf = (from) => FIND_SPOTS.find((s) => s.id === from) || null;
// «a» joined to the article: insieme al libro e alla chiave
const A = [[/^il /, 'al '], [/^lo /, 'allo '], [/^la /, 'alla '], [/^l'/, "all'"], [/^i /, 'ai '], [/^gli /, 'agli '], [/^le /, 'alle ']];
const toA = (name) => { for (const [re, to] of A) if (re.test(name)) return name.replace(re, to); return `a ${name}`; };
export const withNames = (ns) => { const a = ns.map((n) => SIBYL[n]?.name.toLowerCase()).filter(Boolean).map(toA); return a.length < 2 ? a[0] || '' : `${a.slice(0, -1).join(', ')} e ${a[a.length - 1]}`; };
function stoneHow(id) {
  const from = state.stones?.[id]?.from, sp = spotOf(from);
  if (sp) return `L'ho trovata ${sp.where}.`;
  const who = GIFT[from]?.who;
  return who === 'tartufo' ? 'Me l\'ha portata Tartufo.' : who ? `Me l'ha data ${GIVER[who]}.` : null;
}
function sibylHow(n) {
  const w = cameWith(state, n), sp = spotOf(state.oracle?.[n]?.from);
  if (sp) return w?.others.length ? `Era per terra ${sp.where}, legata con lo spago insieme ${withNames(w.others)}.` : `Era per terra ${sp.where}.`;
  if (!w) return null;
  const giver = w.who === 'tartufo' ? 'Me l\'ha portata Tartufo' : `Me l'ha data ${GIVER[w.who] || 'qualcuno'}`;
  return w.others.length ? `${giver} insieme ${withNames(w.others)}${w.phrase ? `: «${w.phrase}»` : '.'}` : `${giver}.`;
}

// ---- the stones ----
export function stoneBody(id) {
  cssOn();
  const s = STONE[id], sap = SAPERE[s.sapere] || {}, pic = stoneSrc(id);
  const nm = (k) => SAPERE[k]?.nome || null;
  const circle = [sap.pianeta ? `Pianeta: ${nm(sap.pianeta)}` : null, sap.elemento ? `Elemento: ${String(nm(sap.elemento)).toLowerCase()}` : null].filter(Boolean).join(' · ');
  const uses = (sap.intenzioni || []).map((k) => String(nm(k)).toLowerCase()).filter(Boolean).join(' · ');
  const L = [h('h2', {}, s.name),
    h('button.cl-pic', { type: 'button', 'aria-label': 'Ingrandisci', onclick: () => zoom(pic.src, pic.px, s.name) }, h(pic.px ? 'img.px' : 'img', { src: pic.src, alt: s.name })),
    h('p.cl-cred', {}, s.plate ? s.plate.work : 'Nessuna tavola antica: l\'ho disegnata io.'),
    sec('Com\'è', s.com)];
  const R = [sec('Che cosa se ne dice', s.dice), sec('Da dove viene', s.storia),
    circle || uses ? h('div.cl-sec', h('h3', {}, 'Nel cerchio'), circle ? h('p', {}, circle) : null, uses ? h('p', {}, `Serve per: ${uses}`) : null) : null,
    sec('Come l\'ho avuta', stoneHow(id))];
  return { L: L.filter(Boolean), R: R.filter(Boolean) };
}
export const showStone = (id) => {
  if (!STONE[id]) return Promise.resolve();
  if (markSeen(state, 'stone', id)) save();
  return openSheet({ label: STONE[id].name, build: () => ({ ...stoneBody(id), single: true }) });
};
export function stonePages(ctx) {
  cssOn();
  const slots = albumSlots(state, 'stone', STONE_LIST), n = countOf(state, 'stone');
  const item = (sl) => {
    if (!sl.have) return h('div.cl-it.no', {}, h('i', {}, String(sl.n)));
    const pic = stoneSrc(sl.id);
    return h('button.cl-it', { type: 'button', onclick: async () => { await showStone(sl.id); ctx.rerender?.(); } },
      h(pic.px ? 'img.px' : 'img', { src: pic.src, alt: '', loading: 'lazy' }), h('span', {}, sl.name), sl.nuova ? h('span.cl-new', {}, 'nuova') : null);
  };
  const L = [h('h2', {}, 'Le pietre'),
    h('p.pencil', {}, n ? `${n} pietre su ${STONE_LIST.length}. Le altre sono da qualche parte, per terra o in tasca a qualcuno.` : 'Qui tengo le pietre che trovo.'),
    h('div.cl-grid', slots.slice(0, 6).map(item))];
  const R = [h('div.cl-grid', slots.slice(6).map(item))];
  return { L, R, single: true };
}

// ---- the sibyl ----
export function sibylBody(n) {
  cssOn();
  const c = SIBYL[n], sign = SAPERE[`segno-${c.sign}`];
  const T = '\uFE0E'; // the text form of the glyph, never the coloured emoji
  const corner = [sign ? `${SIGN_GLYPH[c.sign] || ''}${T} ${sign.nome}` : null, c.planet ? `${PLANET_GLYPH[c.planet] || ''}${T} ${c.planet}` : null].filter(Boolean).join(' · ');
  const L = [h('h2', {}, `${n}. ${c.name.charAt(0).toUpperCase()}${c.name.slice(1)}`),
    h('button.cl-pic.sb', { type: 'button', 'aria-label': 'Ingrandisci la figurina', onclick: () => zoom(sibylUrl(n), false, c.name) }, h('img', { src: sibylUrl(n), alt: c.name })),
    h('div.cl-keys', c.keys.map((k) => h('span', {}, k)))];
  const R = [
    h('div.cl-sec', h('h3', {}, 'Che cosa c\'è scritto'), h('p', {}, `«${c.it.title}»`), h('p.cl-verse', {}, c.it.verse[0]), h('p.cl-verse', {}, c.it.verse[1]),
      h('p.pencil', { style: { marginTop: '4px' } }, c.unsure ? 'È in tedesco, in caratteri gotici; l\'ultima parola del titolo non si legge bene.' : 'È in tedesco, in caratteri gotici: questo è quello che ci leggo io.')),
    corner ? sec('Nell\'angolo', corner) : null,
    sec('Come l\'ho avuta', sibylHow(n)),
    sec('Al banco', pairsHow(n))];
  return { L, R: R.filter(Boolean) };
}
export const showSibyl = (n) => {
  if (!SIBYL[n]) return Promise.resolve();
  if (markSeen(state, 'sibyl', n)) save();
  return openSheet({ label: SIBYL[n].name, build: () => ({ ...sibylBody(n), single: true }) });
};
// the pairs game (glue/sibylpairs.js): the dots under a figure are the rounds it was turned in (the first few of a day)
function marks(n) {
  const c = Math.min(MARKS_SHOWN, marksOf(state, n));
  return c ? h('span.cl-marks', { 'aria-label': `girata in coppia ${marksOf(state, n)} volte` }, Array.from({ length: c }, () => h('i'))) : null;
}
function playButton(ctx) {
  if (!canPlay(state) || !has('sibyl.pairs')) return null;
  const never = !(state.sibylPlay?.rounds > 0);
  return h('button.gx-btn.cl-play', { type: 'button', onclick: async () => { await call('sibyl.pairs'); ctx.rerender?.(); } },
    'Gioca a coppie', never ? h('span.cl-new', {}, 'nuovo') : null);
}
function pairsHow(n) {
  const m = lastOf(state, n);
  if (!m?.c) return null;
  const times = m.c === 1 ? 'L\'ho girata in coppia una volta' : `L'ho girata in coppia ${m.c} volte`;
  const w = withNames(m.with || []);
  return m.t && w ? `${times}. L'ultima volta era insieme ${w}, e ci ho visto: «${m.t}»` : `${times}.`;
}
// before Ginepra has told her what they are, they are only «figurine»
export const sibylTitle = () => (firstTold(state, 'sibyl') ? 'Sibilla' : 'Figurine');
export function sibylPages(ctx) {
  cssOn();
  const slots = albumSlots(state, 'sibyl', SIBYL_LIST), n = countOf(state, 'sibyl'), told = firstTold(state, 'sibyl');
  const item = (sl) => (sl.have
    ? h('button.cl-it', { type: 'button', onclick: async () => { await showSibyl(sl.id); ctx.rerender?.(); } },
      h('img', { src: sibylThumb(sl.id), alt: '', loading: 'lazy' }), h('span', {}, String(sl.n)), marks(sl.id), sl.nuova ? h('span.cl-new', {}, 'nuova') : null)
    : h('div.cl-it.no', {}, h('i', {}, String(sl.n))));
  const L = [h('h2', {}, told ? 'La sibilla' : 'Le figurine'),
    h('p.pencil', {}, told
      ? `Le figurine della sibilla dell'ambulante: ne ho ${n} su 36. Ginepra dice di tenerle insieme, perché da sole dicono poco.`
      : `Figurine colorate, ognuna con un numero, due righe in tedesco e dei segni nell'angolo. Ne ho ${n}, e non so di chi fossero.`),
    playButton(ctx),
    h('div.cl-grid.sb', slots.slice(0, 20).map(item))];
  const R = [h('div.cl-grid.sb', slots.slice(20).map(item))];
  return { L, R, single: true };
}

// ---- the little flight into the grimoire ----
export function flyToBook({ src, px = false, from = null } = {}) {
  cssOn();
  const book = document.querySelector('.hud-book');
  const W = globalThis.innerWidth || 390, H = globalThis.innerHeight || 844;
  const a = from || { x: W / 2, y: H * 0.45 };
  const r = book?.getBoundingClientRect();
  const b = r && r.width ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: W - 40, y: 40 };
  const img = h(px ? 'img.cl-fly.px' : 'img.cl-fly', { src, alt: '' });
  img.style.transform = `translate(${a.x - 17}px, ${a.y - 24}px) scale(1.3)`;
  document.body.append(img);
  const pulse = () => { if (book) { book.classList.remove('pulse'); void book.offsetWidth; book.classList.add('pulse'); } };
  if (reducedMotion()) { setTimeout(() => { img.remove(); pulse(); }, 250); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    img.style.transform = `translate(${b.x - 17}px, ${b.y - 24}px) scale(.45)`;
    img.style.opacity = '0.2';
  }));
  setTimeout(() => { img.remove(); pulse(); }, 760);
}
