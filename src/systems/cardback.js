// The back of a card (dark, a gold crescent and a star, drawn as inline SVG) and a flip card: a back that
// turns over to show the face. Used by the drawing, the reading table and the review.
import { h, css, cardUrl, reducedMotion } from '../core/dom.js';

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 600"><defs>
<pattern id="p" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M17 8l2.4 6.6 7 .3-5.5 4.4 1.9 6.8L17 22l-5.8 4.1 1.9-6.8-5.5-4.4 7-.3z" fill="#e0b95e" opacity=".16"/></pattern>
<radialGradient id="g" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="#3a2a52"/><stop offset="1" stop-color="#150e20"/></radialGradient></defs>
<rect width="350" height="600" fill="url(#g)"/><rect width="350" height="600" fill="url(#p)"/>
<rect x="14" y="14" width="322" height="572" rx="10" fill="none" stroke="#e0b95e" stroke-width="3"/><rect x="26" y="26" width="298" height="548" rx="6" fill="none" stroke="#e0b95e" stroke-width="1.2" opacity=".6"/>
<circle cx="175" cy="300" r="96" fill="#150e20" stroke="#e0b95e" stroke-width="3"/>
<path d="M200 232a76 76 0 1 0 0 136a60 60 0 1 1 0-136z" fill="#e0b95e"/>
<path d="M214 262l8 20 21 1-17 13 6 21-18-12-18 12 6-21-17-13 21-1z" fill="#fff3c4"/>
<path d="M175 40v28M175 532v28M40 300h28M282 300h28" stroke="#e0b95e" stroke-width="2.5" opacity=".7"/></svg>`;
export const BACK_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(SVG)}")`;

const CSS = `
.sxb{background:${BACK_URL} center/cover no-repeat;border-radius:10px;box-shadow:0 6px 18px #000a,0 0 0 1.5px #e0b95e66}
.sxf{position:relative;perspective:900px;aspect-ratio:350/600}
.sxf-in{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .75s cubic-bezier(.3,.1,.2,1)}
.sxf.up .sxf-in{transform:rotateY(180deg)}
.sxf-in>*{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:10px}
.sxf-face{transform:rotateY(180deg);background:#0b0710 center/cover no-repeat;box-shadow:0 6px 18px #000a,0 0 0 1.5px #e0b95e88}
.sxf.nomo .sxf-in{transition:none}
`;
export const cardBack = (cls = '') => (css('sxb', CSS), h(`div.sxb${cls ? '.' + cls : ''}`));

// A card that turns: flip(cardId?) shows the face. reversed: the picture is upside down.
export function flipCard(id, { reversed = false, instant = false } = {}) {
  css('sxb', CSS);
  const face = h('div.sxf-face');
  const el = h(`div.sxf${reducedMotion() || instant ? '.nomo' : ''}`, h('div.sxf-in', h('div.sxb'), face));
  const setFace = (cid) => {
    const url = `url(${cardUrl(cid)})`;
    face.style.backgroundImage = url;
    if (reversed) face.style.transform = 'rotateY(180deg) rotate(180deg)';
  };
  if (id) setFace(id);
  return { el, face, setFace, flip(cid) { if (cid) setFace(cid); el.classList.add('up'); }, unflip() { el.classList.remove('up'); } };
}
