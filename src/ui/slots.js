// One slot of the card grid (the Majors in the grimoire, the Minors after the ending): the image
// (veiled until the first star), three star marks, a red dot when due; a silhouette when missing;
// a seal when confiscated. slot(id, onTap) -> button.
import { h, css, cardUrl } from '../core/dom.js';
import { CARD } from '../data/cards.base.js';
import { RED, SERIF, svgEl } from './paper.js';
import { silhouette, starMark } from './art.js';
import { slotOf } from './logic.js';

export const slotCss = () => css('ui-slots', `
.cs-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px 7px}
.cs-slot{position:relative;display:block;width:100%;padding:0;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:center}
.cs-slot .fr{position:relative;display:block;aspect-ratio:7/12;width:100%}
.cs-slot .gx-veil{width:100%;height:100%;box-shadow:0 2px 4px #5a452c66;border:2px solid #fbf5e6;box-sizing:border-box;border-radius:3px}
.cs-slot .st{display:flex;justify-content:center;gap:1px;height:12px;margin-top:3px}
.cs-slot .due{position:absolute;top:-4px;right:-4px;width:12px;height:12px;border-radius:50%;background:${RED};box-shadow:0 0 0 2px #efe4c8}
.cs-slot.taken .fr::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(135deg,transparent 0 6px,#6a625633 6px 7px)}
.cs-slot .seal{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%) rotate(-14deg);padding:1px 3px;border:1.5px solid ${RED};border-radius:3px;color:${RED};font:italic 11px/1.1 ${SERIF};background:#efe4c8dd;white-space:nowrap}
.cs-slot:focus-visible{outline:2px dashed ${RED};outline-offset:3px}
.cs-slot.on .fr{outline:2px dashed ${RED};outline-offset:3px;border-radius:4px}
@media (max-width:719px){.cs-grid{gap:7px 5px}.cs-slot .seal{font-size:10px;padding:0 2px}}
`);

export function slot(id, onTap) {
  const sl = slotOf(id), c = CARD[id] || {};
  const b = h(`button.cs-slot.${sl.kind}`, { type: 'button', 'aria-label': sl.kind === 'missing' ? `${c.roman}: ancora da trovare` : c.name, 'data-id': id });
  const fr = h('span.fr');
  if (sl.kind === 'missing') fr.append(svgEl(silhouette(c.roman ?? String(c.n ?? ''))));
  else if (sl.kind === 'taken') { fr.append(svgEl(silhouette(c.roman ?? String(c.n ?? '')))); fr.append(h('span.seal', {}, 'sequestrata')); }
  else fr.append(h(`span.gx-veil${sl.kind === 'veiled' ? '.veiled' : ''}`, {}, h('img', { src: cardUrl(id), alt: c.name || '', loading: 'lazy', decoding: 'async' })));
  if (sl.due && sl.kind !== 'missing') fr.append(h('span.due', { title: 'da ripassare' }));
  b.append(fr);
  const st = h('span.st');
  if (sl.kind === 'awake' || sl.kind === 'veiled') for (let i = 0; i < 3; i++) st.append(svgEl(starMark(i < sl.stars, 11)));
  b.append(st);
  b.onclick = () => onTap(id, sl, b);
  return b;
}

