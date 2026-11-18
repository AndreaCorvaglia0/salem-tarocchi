// The look shared by every screen of the grimoire area: the palette (paper, iron-gall ink, pencil,
// red pencil), the paper's grain painted once in code, and the CSS used by more than one screen.
// Everything on the paper is in her hand (FONT.hand), never smaller than 17px.
import { css } from '../core/dom.js';
import { FONT } from '../core/fonts.js';

export const INK = '#2a2134', PENCIL = '#6a6256', RED = '#a3372a', PAPER = '#efe4c8', GOLD = '#d8b25a';
export const HAND = FONT.hand, SERIF = FONT.serif;
export const RIB = { io: '#7d2a2a', carte: '#2c5444', mappa: '#2b3866', erbe: '#5d6a2c', pietre: '#4e4466', sibilla: '#8a4e2a', libri: '#5a3a22' };

// a deterministic random for drawings that must look the same every time
export const rnd = (seed) => { let a = seed >>> 0 || 1; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
export const canvas = (w, hh) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(hh)); return [c, c.getContext('2d')]; };

// the paper's grain: fibres on a tile, painted once
let TEX = '';
export function texture() {
  if (TEX) return TEX;
  const [c, g] = canvas(256, 256), r = rnd(23);
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '120,95,55' : '255,250,232'},${0.03 + r() * 0.05})`; g.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1); }
  for (let i = 0; i < 46; i++) { g.strokeStyle = `rgba(105,85,50,${0.05 + r() * 0.06})`; g.lineWidth = 0.6; const x = r() * 256, y = r() * 256, a = r() * 6.28, l = 4 + r() * 12; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  TEX = `url(${c.toDataURL('image/png')})`;
  return TEX;
}

// paper as a background: the grain, a warm light, darker edges
export const paperBg = () => `${texture()}, radial-gradient(ellipse at 40% 30%, #fff8e430, #b8996a26 85%), ${PAPER}`;

export function baseCss() {
  css('ui-base', `
.gx-hand{font-family:${HAND};font-synthesis:none}
.gx-paper{background:${paperBg()};color:${INK};font:21px/31px ${HAND};font-synthesis:none}
:where(.gx-paper) :where(p,ul,ol,figure,h2,h3){margin:0}
.gx-paper h2{font:700 28px/34px ${HAND};color:${INK};text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:6px;text-decoration-color:${INK}99}
.gx-paper h3{font:700 23px/30px ${HAND};color:${INK}}
.gx-paper .pencil{color:${PENCIL}}
.gx-paper .small{font-size:18px;line-height:25px}
.gx-paper .red{color:${RED}}
.gx-paper .sp{height:18px}
.gx-ui{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;min-width:44px;padding:0 14px;border-radius:10px;background:#1d1a24cc;border:1px solid #4a4256;color:#f2ece0;font:600 16px system-ui,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.gx-ui:hover,.gx-ui:focus-visible{background:#2b2635;outline:2px solid ${GOLD}88;outline-offset:1px}
.gx-ui .x{font-size:19px;line-height:1}
.gx-btn{min-height:46px;padding:0 20px;border-radius:12px 9px 13px 10px;border:2px solid ${INK};background:#f8f0dc;color:${INK};font:700 21px ${HAND};font-synthesis:none;cursor:pointer;-webkit-tap-highlight-color:transparent}
.gx-btn:hover,.gx-btn:focus-visible{background:#fffaf0;outline:2px solid ${RED};outline-offset:2px}
.gx-btn:disabled{opacity:.45;cursor:default}
.gx-link{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0;border:0;background:none;color:${INK};font:inherit;cursor:pointer;text-align:left;-webkit-tap-highlight-color:transparent}
.gx-link .ar{color:${RED}}
.gx-link:hover .t,.gx-link:focus-visible .t{text-decoration:underline wavy ${RED};text-underline-offset:5px}
.gx-link:focus-visible{outline:none}
.gx-scroll{overflow:auto;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch}
.gx-bar{display:inline-block;position:relative;height:12px;width:150px;vertical-align:middle}
.gx-bar svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.gx-veil{position:relative;display:block;overflow:hidden;border-radius:4px;background:#2a2430}
.gx-veil img{display:block;width:100%;height:100%;object-fit:cover}
.gx-veil.veiled img{filter:grayscale(.55) brightness(.82) blur(.6px)}
.gx-veil.veiled::after{content:'';position:absolute;inset:0;background:linear-gradient(160deg,#d9d2e6aa,#8a7f9c88 55%,#d6cfe0aa);mix-blend-mode:normal;pointer-events:none}
@media (max-width:719px){.gx-live{position:sticky;bottom:-26px;z-index:3;margin:14px -22px -26px -22px!important;padding:10px 22px 16px!important;background:${paperBg()};box-shadow:0 -6px 14px -6px #5a452c88;animation:gx-in .25s}}
@keyframes gx-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes gx-fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`);
}

// a hand-drawn level bar (SVG): the frame wobbles, the fill is an ink wash
export function inkBar(frac, { w = 150, h: hh = 12, color = INK, fill = '#8c2f39' } = {}) {
  const f = Math.max(0, Math.min(1, frac || 0));
  const el = document.createElement('span');
  el.className = 'gx-bar';
  el.style.width = `${w}px`; el.style.height = `${hh}px`;
  el.innerHTML = `<svg viewBox="0 0 ${w} ${hh}" preserveAspectRatio="none" aria-hidden="true">
<rect class="fill" x="2" y="2.5" width="${Math.max(0, (w - 4) * f)}" height="${hh - 5}" rx="3" fill="${fill}" opacity=".78" style="transition:width .7s cubic-bezier(.3,.8,.3,1)"/>
<path d="M1.5 2 C${w * 0.3} 0.8 ${w * 0.7} 2.8 ${w - 1.5} 1.6 L${w - 0.8} ${hh - 1.8} C${w * 0.6} ${hh - 0.6} ${w * 0.3} ${hh - 2.4} 1 ${hh - 1.4} Z" fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  el.set = (v) => { const r = el.querySelector('.fill'); r.setAttribute('width', String(Math.max(0, (w - 4) * Math.max(0, Math.min(1, v))))); };
  return el;
}

export const svgEl = (html) => { const s = document.createElement('span'); s.innerHTML = html.trim(); return s.firstChild; };
