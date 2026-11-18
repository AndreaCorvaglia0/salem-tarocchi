// The map tab: the three places of the story as ink sketches drawn in code (not the tile map).
// Each region is a hand-drawn schematic: lanes between places, a small drawing per place, the name
// in pencil. Places not yet seen stay blank; the next one is circled in red pencil; a red pencil cross
// and «io» where she stands. What is drawn where comes from the world's maps (sketchmap.js: places,
// positions, lanes, her position); this file only gives it the hand-drawn look.
// sketch(region, { width, minWidth, seen, next, where, onPick, unnamed }) -> element
//   where: world.where() ({ map, x, y }) or null; onPick(id, place, button): a tap on a seen place.
//   The optional things' slips are added on top by ui/missions/page.js.
import { h } from '../core/dom.js';
import { INK, PENCIL, RED, HAND, canvas, rnd } from './paper.js';
import { REGIONS, REGION_OF, heightOf, layout, network, whereOnSketch, placeMe } from './sketchmap.js';
import { DRAWINGS } from './sketchink.js';

export { REGIONS, REGION_OF };

const wob = (x, y) => { const v = Math.sin(Math.round(x) * 12.9898 + Math.round(y) * 78.233) * 43758.5453; return (v - Math.floor(v) - 0.5) * 2.2; };
function mark(g, kind, k) {
  g.save(); g.scale(k, k); g.beginPath();
  (DRAWINGS[kind] || ((c) => c.arc(0, 0, 4, 0, 6.3)))(g);
  g.restore(); g.stroke();
}

export function sketch(regionId, { width = 320, minWidth = 330, seen = () => false, next = null, where = null, onPick = null, unnamed = null } = {}) {
  const R = REGIONS[regionId], W = Math.round(width), H = heightOf(regionId, W, minWidth), d = Math.min(2, globalThis.devicePixelRatio || 1);
  const Lay = layout(regionId, W, H), k = Lay.k;
  const [cv, g] = canvas(W * d, H * d);
  cv.style.width = `${W}px`; cv.style.height = `${H}px`;
  g.scale(d, d);
  const r = rnd(regionId.length * 97 + 5), j = () => (r() - 0.5) * 2.2;
  const P = (id) => Lay.pos[id];
  const pad = 14;
  // the region's border: a loose hand-drawn frame
  g.strokeStyle = 'rgba(42,33,52,.35)'; g.lineWidth = 1.1; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(pad + j(), pad + j()); g.lineTo(W - pad + j(), pad + j()); g.lineTo(W - pad + j(), H - pad + j()); g.lineTo(pad + j(), H - pad + j()); g.closePath(); g.stroke();
  // lanes between seen places, along the real way, a wobbling dashed pencil line
  g.strokeStyle = 'rgba(106,98,86,.6)'; g.lineWidth = 1.2; g.setLineDash([5, 4]);
  // each stretch of road once, along the real way; the wobble depends on the point, so it is stable
  for (const line of network(Lay, Lay.lanes.filter((ln) => seen(ln.a) && seen(ln.b)))) {
    // a hand does not rule straight lines: the corners are rounded (Chaikin) and each point wobbles a little
    let pts = line.map(([x, y], i, a) => (i && i < a.length - 1 ? [x + wob(x, y) * 1.6, y + wob(y, x) * 1.6] : [x, y]));
    for (let n = 0; n < 2 && pts.length > 2; n++) pts = [pts[0], ...pts.slice(0, -1).flatMap(([ax, ay], i) => { const [bx, by] = pts[i + 1]; return [[ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25], [ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]]; }).slice(1, -1), pts[pts.length - 1]];
    g.beginPath(); g.moveTo(...pts[0]);
    if (pts.length === 2) { const [[ax, ay], [bx, by]] = pts; g.quadraticCurveTo((ax + bx) / 2 + wob(ax, by) * 3, (ay + by) / 2 + wob(bx, ay) * 3, bx, by); }
    else for (const p of pts.slice(1)) g.lineTo(...p);
    g.stroke();
  }
  g.setLineDash([]);
  const wrap = h('div.sk', { style: { width: `${W}px`, height: `${H}px` } }, cv);
  const shown = [];
  for (const [id, p] of Object.entries(R.places)) {
    const [x, y] = P(id), on = seen(id), isNext = id === next;
    if (on) {
      // paper behind the drawing so lanes stop at it
      g.fillStyle = 'rgba(239,228,200,.9)'; g.beginPath(); g.arc(x, y, 12 * k, 0, 6.3); g.fill();
      g.strokeStyle = INK; g.lineWidth = 1.5; g.save(); g.translate(x, y); mark(g, p.kind, k); g.restore();
    }
    if (isNext) {
      g.strokeStyle = RED; g.lineWidth = 2; g.beginPath();
      const rr = 17 * k; for (let i = 0; i <= 30; i++) { const a = -0.6 + i / 30 * 6.9, q = rr * (1 + 0.08 * Math.sin(i * 1.7)); const px = x + Math.cos(a) * q * 1.15, py = y + Math.sin(a) * q; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
      if (!on) { g.fillStyle = RED; g.font = `700 22px ${HAND}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', x, y); }
    }
    if (on) {
      const b = Lay.labels[id];
      shown.push(b);
      const anon = !!(unnamed && unnamed(id)); // seen from outside, name not known yet: a pencil «?» (lore/metodo/principi/vede-solo-quello-che-sa.md)
      wrap.append(h(anon ? 'span.sk-lab.sk-anon' : 'span.sk-lab', { style: { left: `${(b.l + b.r) / 2}px`, top: `${b.t}px` } }, anon ? '?' : b.lines.join('\n')));
      if (onPick) wrap.append(h('button.sk-hit', { type: 'button', 'aria-label': anon ? 'Un posto che non conosco' : p.label, style: { left: `${x}px`, top: `${y}px` }, onclick: (e) => onPick(id, p, e.currentTarget) }));
    }
  }
  // where she is: a small red pencil cross and «io», on her real spot, moved off any name
  const me = where && whereOnSketch(where, Lay);
  if (me && me.region === regionId) {
    // not over a name, a drawing or the red circle: the cross must not read as part of them
    const busy = [...shown, ...Object.keys(R.places).filter((id) => seen(id) || id === next).map((id) => { const [px, py] = P(id), rr = (id === next ? 19 : 11) * k; return { l: px - rr * (id === next ? 1.15 : 1), r: px + rr * (id === next ? 1.15 : 1), t: py - rr, b: py + rr }; })];
    const [x, y] = placeMe(me.x, me.y, busy, W, H);
    g.strokeStyle = RED; g.lineWidth = 2.3;
    g.beginPath(); g.moveTo(x - 5 + j() * 0.5, y - 5); g.lineTo(x + 5, y + 5 + j() * 0.5); g.moveTo(x + 5 + j() * 0.5, y - 5); g.lineTo(x - 5, y + 5); g.stroke();
    wrap.append(h('span.sk-me', { style: { left: `${x - 9}px`, top: `${y - 12}px` }, 'aria-label': me.inside ? 'io sono qui dentro' : 'io sono qui' }, 'io'));
    wrap.dataset.me = `${Math.round(x)},${Math.round(y)}`;
  }
  return wrap;
}

export const SKETCH_CSS = `
.sk{position:relative;margin:4px auto 0}
.sk canvas{display:block}
.sk-anon{font-weight:700;font-size:22px}
.sk-lab{position:absolute;transform:translate(-50%,0);font:18px/19px ${HAND};color:${PENCIL};white-space:pre;text-align:center;pointer-events:none;padding:0 4px;border-radius:6px;background:#ede2c5e0}
.sk-hit{position:absolute;width:48px;height:48px;transform:translate(-50%,-50%);border:0;background:none;border-radius:50%;cursor:pointer;-webkit-tap-highlight-color:transparent}
.sk-hit:focus-visible{outline:2px dashed ${RED}}
.sk-hit.on{outline:2px dashed ${RED};outline-offset:-4px}
.sk-me{position:absolute;width:36px;height:24px;box-sizing:border-box;padding-left:17px;color:${RED};font:400 19px/24px ${HAND};white-space:nowrap;pointer-events:none;text-shadow:0 0 3px #efe4c8,0 0 2px #efe4c8}
`;
