// One question on screen, shared by the Exam, the locks and the deposit: the prompt, the thing to look at
// (a card or a cropped detail), big options (text, or card images for "which image"). It does not decide
// anything: it calls onPick(index) and can mark, hide and lock options.
import { h, css, cardUrl } from '../core/dom.js';
import { CARD } from '../data/cards.base.js';
import { hasTitle } from '../data/questions.js';
import { FONT } from '../core/fonts.js';

const CSS = `
.sxq-prompt{margin:0;font-size:22px;line-height:1.3;color:#fff7e3}
/* her own words, in her hand (the review's words question: review.rules.js) */
.sxq-words{margin:2px 0;padding:10px 14px;border-left:3px solid var(--gold);background:#ffffff08;border-radius:0 10px 10px 0;font:30px/1.2 ${FONT.hand};color:#f3dfa6;text-align:center}
.sx-card{position:relative;overflow:hidden}
/* a deliberate-looking ribbon over the printed title, bottom 11% of the picture; it lifts after the answer */
.sxq-cover{position:absolute;left:0;right:0;bottom:0;height:11%;display:grid;place-items:center;background:linear-gradient(#3a1626,#1b0a14);border-top:2px solid #c9a24a;box-shadow:0 -3px 8px #0008;transition:transform .55s ease,opacity .55s ease}
.sxq-cover i{width:9px;height:9px;transform:rotate(45deg);background:#c9a24a;box-shadow:-18px 0 0 -3px #c9a24a,18px 0 0 -3px #c9a24a}
.sxq-cover.off{transform:translateY(105%);opacity:0}
.sxq-media{display:flex;justify-content:center}
.sxq-media .sx-card{width:min(120px,32vw);aspect-ratio:350/600}
.sxq-crop{width:min(190px,50vw);aspect-ratio:1;border-radius:50%;background-color:#0b0710;background-repeat:no-repeat;box-shadow:0 6px 18px #000a,0 0 0 2px #e0b95e88,inset 0 0 22px #000}
.sxq-opts{display:flex;flex-direction:column;gap:9px}
.sxq-o{display:flex;align-items:center;gap:12px;min-height:56px;padding:8px 14px;border-radius:12px;background:var(--panel);border:2px solid var(--line);text-align:left;cursor:pointer;font-size:20px;line-height:1.25;transition:opacity .25s}
.sxq-o:active:not(:disabled){transform:scale(.985)}
.sxq-o:disabled{cursor:default}
.sxq-o.ok{border-color:var(--moss);background:#1c3326}
.sxq-o.no{border-color:var(--blood);background:#40201f}
.sxq-o.gone{opacity:.25;text-decoration:line-through}
.sxq-imgs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.sxq-imgs .sxq-o{padding:6px;flex-direction:column;gap:4px;justify-content:flex-start;min-height:0}
.sxq-imgs .sx-card{width:100%;aspect-ratio:350/600}
.sxq-imgs .nm{font-size:15px;color:var(--dim);text-align:center;line-height:1.1}
`;

// The crop of a detail ({ x, y, r } in % of the image: a circle) shown zoomed in a round window.
export function cropStyle(crop, box = 190) {
  const r = Math.max(4, crop.r ?? 14);
  const w = (box * 100) / (2 * r); // image width so that 2r% of it fills the box
  const ht = (w * 600) / 350;
  return { backgroundSize: `${w}px ${ht}px`, backgroundPosition: `${box / 2 - (crop.x / 100) * w}px ${box / 2 - (crop.y / 100) * ht}px` };
}
// a card picture; with hideName the printed title is covered (Majors and courts only: pips have none)
export function cardFace(id, { hideName = false } = {}) {
  css('sxq', CSS);
  const el = h('div.sx-card', { style: { backgroundImage: `url(${cardUrl(id)})` } });
  if (hideName && hasTitle(id)) el.append(h('div.sxq-cover', h('i')));
  return el;
}
export const liftName = (el) => el?.querySelector?.('.sxq-cover')?.classList.add('off');
const media = (show) => {
  if (!show?.card) return null;
  const url = `url(${cardUrl(show.card)})`;
  if (show.crop) {
    const el = h('div.sxq-crop', { style: { backgroundImage: url } });
    // the box is responsive (min(190px,50vw)): measure after layout
    requestAnimationFrame(() => Object.assign(el.style, cropStyle(show.crop, el.clientWidth || 190)));
    return h('div.sxq-media', el);
  }
  return h('div.sxq-media', cardFace(show.card, { hideName: show.hideName }));
};

export function questionView(q, { onPick, hidden = [] } = {}) {
  css('sxq', CSS);
  const imgs = !q.textOnly && q.options.some((o) => o.card);
  const buttons = q.options.map((o, i) => {
    const b = h('button.sxq-o', { type: 'button', onclick: () => onPick?.(i) },
      o.card && !q.textOnly ? [h('div.sx-card', { style: { backgroundImage: `url(${cardUrl(o.card)})` } }), h('span.nm', CARD[o.card]?.name || '')] : o.t);
    if (hidden.includes(i)) { b.classList.add('gone'); b.disabled = true; }
    if (globalThis.__salem) b.dataset.ok = o.ok ? '1' : '0'; // the ?debug door only: the playthrough bot reads it
    return b;
  });
  const el = h('div.sxq', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
    h('p.sxq-prompt', q.prompt), q.words?.length ? h('p.sxq-words', q.words.join(' · ')) : null, q.after ? h('p.sxq-prompt', q.after) : null,
    media(q.show), h(imgs ? 'div.sxq-imgs' : 'div.sxq-opts', buttons));
  return {
    el, buttons,
    lock() { for (const b of buttons) b.disabled = true; },
    hide(i) { buttons[i]?.classList.add('gone'); if (buttons[i]) buttons[i].disabled = true; },
    // after the answer: the chosen one is red when wrong, the right one is always green
    reveal(picked) { this.lock(); liftName(el); q.options.forEach((o, i) => { if (o.ok) buttons[i].classList.add('ok'); else if (i === picked) buttons[i].classList.add('no'); }); },
  };
}
