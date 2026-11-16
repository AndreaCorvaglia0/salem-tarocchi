// Small ink drawings in SVG for the grimoire, the HUD and the shop: the four tools, the coin purse,
// the little fan of cards, the closed grimoire (HUD button), the card back, a star mark.
// Each returns an SVG string drawn in a 48x48 box (unless said), stroked in the given ink.
import { INK, RED, GOLD } from './paper.js';

const wrap = (body, { size = 48, vb = 48, stroke = INK, sw = 1.8 } = {}) =>
  `<svg viewBox="0 0 ${vb} ${vb}" width="${size}" height="${size}" aria-hidden="true" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const TOOL_ART = {
  // the witch bottle: a round flask, cork, nails and herbs inside
  bottle: (o) => wrap(`<path d="M20 6.5h8.2M21 6.8v7.6c-6.6 2.3-10.4 7.8-10 14.4.5 7.2 6 12.4 13.2 12.4s12.6-5.4 12.8-12.6c.2-6.4-3.6-11.8-10-14.2V6.6"/><path d="M19.5 3.6c2.6-.9 6.4-.9 9 .1l-.2 3.2h-8.6z" fill="#b08a5a55"/><path d="M15.5 30c5.5 2.4 11.5 2.6 17.2-.2" stroke-width="1.2"/><path d="M19 34l4-6M26 36l3-7M22.5 37.5l.5-5" stroke-width="1.3"/><path d="M28 24c2-1 3.5-.5 4.5 1" stroke-width="1.1"/>`, o),
  // sieve and shears
  sieve: (o) => wrap(`<ellipse cx="21" cy="22" rx="14.5" ry="13.5"/><ellipse cx="21" cy="22" rx="11" ry="10"/><path d="M12 18h18M11 22h20M12 26h18M17 13v18M21 12v20M25 13v18" stroke-width=".9"/><path d="M30 33l11 9M33 30l8 12"/><circle cx="29" cy="35" r="2.6"/><circle cx="33" cy="29.5" r="2.6"/>`, o),
  // a cone of incense on a little dish, smoke curling
  incense: (o) => wrap(`<path d="M10 39c4 3 24 3 28 0"/><path d="M8.5 37.5h31"/><path d="M19 37l5-12 5 12"/><path d="M24 24c-3-3 3-5 0-8s3-5 0-8" stroke-width="1.3"/><path d="M27 20c2-2 0-4 2-6" stroke-width="1"/>`, o),
  // a pendulum on a chain
  pendulum: (o) => wrap(`<path d="M24 4v4"/><path d="M24 8c-.6 2 .6 3 0 5s.6 3 0 5 .6 3 0 5" stroke-width="1.3"/><circle cx="24" cy="4" r="2"/><path d="M24 24l-7 7 7 13 7-13z" fill="#7a6aa055"/><path d="M17 31h14" stroke-width="1.1"/>`, o),
};

// a treat for Tartufo: a little fish on a scrap of paper
export const treat = (o) => wrap(`<path d="M7 33c8 4 26 5 34 0l-3-4c-8 3-21 3-28 0z" fill="#e8dcc055" stroke-width="1.2"/><path d="M11 24c5-6 15-7 22-2l5-4v12l-5-4c-7 5-17 4-22-2z" fill="#9ab0b855"/><circle cx="16" cy="23" r="1.1" fill="currentColor"/><path d="M22 20c1 2 1 4 0 6M26 20c1 2 1 4 0 6" stroke-width="1"/>`, o);
// a paw print, filled or empty (Tartufo's bond on the "Io" page)
export const paw = (on, size = 18, ink = INK) => `<svg viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true" fill="${on ? ink : 'none'}" stroke="${ink}" stroke-width="1.2"><ellipse cx="10" cy="13.4" rx="4.4" ry="3.6"/><circle cx="4.2" cy="8.6" r="1.9"/><circle cx="8" cy="5" r="2"/><circle cx="12.4" cy="5" r="2"/><circle cx="16" cy="8.6" r="1.9"/></svg>`;

// a purse with a coin
export const purse = (o) => wrap(`<path d="M15 16c-6 6-9 13-7 19 2 6 10 8 16 8s14-2 16-8c2-6-1-13-7-19"/><path d="M15 16c3 2 15 2 18 0M17 12c2 2 12 2 14 0l-2 4H19z"/><circle cx="35" cy="34" r="6" fill="${GOLD}66"/><path d="M35 31v6" stroke-width="1.2"/>`, o);

// three cards fanned
export const fan = (o) => wrap(`<g transform="rotate(-16 24 40)"><rect x="15" y="10" width="15" height="25" rx="2" fill="#efe4c8"/></g><g transform="rotate(14 24 40)"><rect x="18" y="10" width="15" height="25" rx="2" fill="#efe4c8"/></g><rect x="16.5" y="8" width="15" height="25" rx="2" fill="#f7efdb"/><path d="M24 15l1.4 3 3.2.4-2.3 2.2.6 3.2-2.9-1.5-2.9 1.5.6-3.2-2.3-2.2 3.2-.4z" stroke-width="1.1"/>`, o);

// the closed grimoire, for the HUD button (light ink on a dark button)
export const book = (o = {}) => wrap(`<path d="M10 9h24c2 0 4 2 4 4v26c0 1-1 2-2 2H12c-1.4 0-2.4-1-2.4-2.4z" fill="#3a2430" stroke="${o.stroke || '#e9dcc0'}"/><path d="M10 37c0-1.6 1.2-2.6 2.6-2.6H38"/><path d="M14 9v25" stroke-width="1.1"/><circle cx="25" cy="20" r="5" stroke="${GOLD}"/><path d="M25 13.5v-1.6M25 28v-1.6M18.5 20h-1.6M33.1 20h-1.6" stroke="${GOLD}" stroke-width="1.2"/><path d="M31 38v8l2-2 2 2v-8" fill="${RED}" stroke="${RED}" stroke-width="1"/>`, { ...o, stroke: o.stroke || '#e9dcc0' });

// a five-point star mark, filled or empty (stars of a card)
export const starMark = (on, size = 14) => `<svg viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true"><path d="M10 1.8l2.4 5.4 5.8.6-4.3 3.9 1.2 5.8L10 14.6l-5.1 2.9 1.2-5.8L1.8 7.8l5.8-.6z" fill="${on ? GOLD : 'none'}" stroke="${on ? '#7a5a1a' : '#6a6256'}" stroke-width="1.3" stroke-linejoin="round"/></svg>`;

// the back of a card, drawn in code (title screen, ceremony): night blue, gold frame, a moon and stars
export function cardBack(w = 140, hh = 240) {
  const sx = w / 140, sy = hh / 240;
  const stars = [[30, 50], [108, 44], [40, 190], [102, 196], [70, 28], [70, 214], [22, 120], [118, 120]];
  return `<svg viewBox="0 0 140 240" width="${w}" height="${hh}" aria-hidden="true" style="display:block">
<defs><radialGradient id="cbg" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#28305a"/><stop offset="1" stop-color="#0f1430"/></radialGradient></defs>
<rect x="1" y="1" width="138" height="238" rx="9" fill="#f1e6c8"/>
<rect x="7" y="7" width="126" height="226" rx="6" fill="url(#cbg)"/>
<rect x="12" y="12" width="116" height="216" rx="4" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".85"/>
<rect x="16" y="16" width="108" height="208" rx="3" fill="none" stroke="${GOLD}" stroke-width=".6" opacity=".6"/>
<circle cx="70" cy="120" r="30" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity=".9"/>
<path d="M79 100a22 22 0 1 0 0 40a18 18 0 1 1 0-40z" fill="${GOLD}" opacity=".92"/>
${stars.map(([x, y]) => `<path d="M${x} ${y - 5}l1.3 3.7 3.7 1.3-3.7 1.3-1.3 3.7-1.3-3.7-3.7-1.3 3.7-1.3z" fill="${GOLD}" opacity=".8"/>`).join('')}
<path d="M70 82v-8M70 166v-8M32 120h-8M116 120h-8" stroke="${GOLD}" stroke-width="1" opacity=".7"/>
</svg>`.replace('<svg', `<svg data-s="${sx.toFixed(2)},${sy.toFixed(2)}"`);
}

// a veiled silhouette for a missing card: a dashed outline, a faint figure, the number
export const silhouette = (roman) => `<svg viewBox="0 0 70 120" aria-hidden="true" style="display:block;width:100%;height:100%">
<rect x="2" y="2" width="66" height="116" rx="5" fill="#d9ccab55" stroke="#6a6256" stroke-width="1.4" stroke-dasharray="4 3"/>
<path d="M35 34c5 0 8 4 8 8.5S40 51 35 51s-8-4-8-8.5S30 34 35 34zM22 86c0-14 6-26 13-26s13 12 13 26z" fill="#6a625622"/>
<text x="35" y="108" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#6a6256">${roman}</text></svg>`;
