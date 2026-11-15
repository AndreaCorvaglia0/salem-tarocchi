// The reading table: lays the cards of a spread following SPREADS[spread].positions (x, y, rot in %).
// Cards are percent-sized, so the same table works large (the layout moment) and small (a map in the corner).
import { h, css } from '../core/dom.js';
import { flipCard } from './cardback.js';

const CSS = `
.sxt{position:relative;width:100%;border-radius:14px;background:radial-gradient(ellipse at 50% 50%,#3b2c2a 0,#241a22 70%);box-shadow:inset 0 0 0 1.5px #e0b95e33,inset 0 0 40px #000a;overflow:hidden}
.sxt-c{position:absolute;aspect-ratio:350/600;opacity:0;transition:opacity .4s,filter .4s,transform .5s}
.sxt-c.in{opacity:1}
.sxt-c .sxf{width:100%}
.sxt.dim .sxt-c.in:not(.on){filter:brightness(.55)}
.sxt-c.on{filter:drop-shadow(0 0 7px #ffd97a)}
.sxt-n{position:absolute;left:50%;bottom:-2px;transform:translate(-50%,0);min-width:1.4em;padding:0 3px;border-radius:9px;background:#120d17dd;color:#f0e6cf;font:600 12px/1.4 system-ui,sans-serif;text-align:center;pointer-events:none}
.sxt.big .sxt-n{font-size:15px}
`;

// The table's height (% of its width) and the biggest card width (% of the table's width) that makes no two
// different positions overlap, whatever coordinates the spread uses (positions on the same spot, like the cross, are meant to overlap).
export const sizeFor = (spread) => {
  const P = spread.positions, n = P.length;
  const ratio = n === 1 ? 0.72 : n <= 3 ? 0.56 : 1.2;
  const cap = n === 1 ? 34 : n <= 3 ? 30 : 22;
  for (let cw = cap; cw > 8; cw -= 0.5) {
    const ch = (cw * 600) / 350;
    const clash = P.some((a, i) => P.slice(i + 1).some((b) => {
      const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y) * ratio;
      if (dx < 1 && dy < 1) return false; // same spot on purpose
      return dx < cw * 0.98 && dy < ch * 0.98;
    }));
    if (!clash) return { cw, ratio };
  }
  return { cw: 10, ratio };
};

export function table(spread, { big = false, numbers = true, instant = false } = {}) {
  css('sxt', CSS);
  const { cw, ratio } = sizeFor(spread);
  const el = h(`div.sxt${big ? '.big' : ''}`, { style: { aspectRatio: `1 / ${ratio}` } });
  const cards = spread.positions.map((p, i) => {
    const f = flipCard(null, { instant });
    const c = h('div.sxt-c', { style: { left: `${p.x}%`, top: `${p.y}%`, width: `${cw}%`, transform: `translate(-50%,-50%) rotate(${p.rot || 0}deg)`, zIndex: p.rot ? 2 : 1 } }, f.el, numbers && spread.positions.length > 1 ? h('span.sxt-n', String(p.n ?? i + 1)) : null);
    el.append(c);
    return { c, f, id: null };
  });
  return {
    el, cards,
    // lay a card (face down; it turns when flip is true)
    place(i, id, { flip = false } = {}) { const k = cards[i]; k.id = id; k.f.setFace(id); k.c.classList.add('in'); if (flip) requestAnimationFrame(() => requestAnimationFrame(() => k.f.flip())); },
    turn(i) { cards[i].f.flip(); },
    active(i) { el.classList.toggle('dim', i != null); cards.forEach((k, j) => k.c.classList.toggle('on', j === i)); },
  };
}
