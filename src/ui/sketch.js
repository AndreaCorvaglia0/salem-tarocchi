// The map tab: the three places of the story as ink sketches drawn in code (not the tile map).
// Each region is a hand-drawn schematic: lanes between places, a small drawing per place, the name
// in pencil. Places not yet seen stay blank; the next one is circled in red pencil; "× io" where she is.
// sketch(region, { width, seen, next, here, onPick }) -> element
import { h } from '../core/dom.js';
import { INK, PENCIL, RED, HAND, canvas, rnd } from './paper.js';

// x, y in % of the region's box; kind picks the little drawing
export const REGIONS = {
  village: { name: 'Il villaggio', season: 'inverno', ratio: 0.86, places: {
    'village.forest_gate': { x: 50, y: 7, label: 'il cancello del bosco', kind: 'gate' },
    'village.cottage_door': { x: 80, y: 15, label: 'il mio cottage', kind: 'hut' },
    'village.garden': { x: 20, y: 18, label: "l'orto", kind: 'garden' },
    'village.malva_door': { x: 27, y: 36, label: 'Malva', kind: 'house' },
    'village.curtain': { x: 74, y: 35, label: 'la tenda', kind: 'tent' },
    'village.square': { x: 50, y: 50, label: 'la piazza', kind: 'well' },
    'village.stall': { x: 34, y: 55, label: 'la bancarella', kind: 'stall' },
    'village.venusglass': { x: 66, y: 57, label: 'il vetro', kind: 'glass' },
    'village.meeting_door': { x: 13, y: 70, label: 'la casa delle riunioni', kind: 'church' },
    'village.court_door': { x: 84, y: 64, label: 'il tribunale', kind: 'court' },
    'village.shop_door': { x: 34, y: 85, label: 'la bottega', kind: 'house' },
    'village.cart': { x: 64, y: 77, label: 'il carro', kind: 'cart' },
    'village.trapdoor': { x: 86, y: 86, label: 'la botola', kind: 'trap' },
    'village.arrival': { x: 50, y: 94, label: 'la strada', kind: 'road' },
  }, lanes: [
    ['village.arrival', 'village.square'], ['village.square', 'village.forest_gate'], ['village.square', 'village.malva_door'],
    ['village.square', 'village.curtain'], ['village.square', 'village.stall'], ['village.square', 'village.venusglass'],
    ['village.square', 'village.court_door'], ['village.square', 'village.meeting_door'], ['village.stall', 'village.shop_door'],
    ['village.venusglass', 'village.cart'], ['village.court_door', 'village.trapdoor'], ['village.malva_door', 'village.garden'],
    ['village.forest_gate', 'village.cottage_door'],
  ] },
  forest: { name: 'Il bosco', season: 'primavera', ratio: 0.7, places: {
    'forest.entry': { x: 50, y: 90, label: "l'ingresso", kind: 'gate' },
    'forest.ortica_hut': { x: 22, y: 70, label: 'Ortica', kind: 'hut' },
    'forest.campfire': { x: 52, y: 62, label: 'il fuoco', kind: 'fire' },
    'forest.den': { x: 82, y: 74, label: 'la tana', kind: 'den' },
    'forest.lantern': { x: 15, y: 40, label: 'la lanterna', kind: 'lantern' },
    'forest.mill': { x: 80, y: 44, label: 'il mulino', kind: 'mill' },
    'forest.pond': { x: 40, y: 34, label: 'lo stagno', kind: 'pond' },
    'forest.boundary': { x: 62, y: 22, label: 'il confine', kind: 'stones' },
    'forest.graveyard': { x: 22, y: 10, label: 'il cimitero', kind: 'graves' },
    'forest.spring': { x: 86, y: 10, label: 'la sorgente', kind: 'spring' },
  }, lanes: [
    ['forest.entry', 'forest.campfire'], ['forest.campfire', 'forest.ortica_hut'], ['forest.campfire', 'forest.den'],
    ['forest.campfire', 'forest.pond'], ['forest.pond', 'forest.lantern'], ['forest.campfire', 'forest.mill'],
    ['forest.pond', 'forest.boundary'], ['forest.lantern', 'forest.graveyard'], ['forest.boundary', 'forest.spring'],
  ] },
  depths: { name: 'Le cantine', season: 'autunno', ratio: 0.62, places: {
    'depths.entry': { x: 50, y: 10, label: 'la scala', kind: 'stairs' },
    'depths.edera_nook': { x: 18, y: 26, label: 'Edera', kind: 'nook' },
    'depths.coven': { x: 50, y: 42, label: 'la congrega', kind: 'circle' },
    'depths.chains': { x: 82, y: 28, label: 'le catene', kind: 'chains' },
    'depths.tower': { x: 84, y: 66, label: 'la torre', kind: 'tower' },
    'depths.well': { x: 20, y: 64, label: 'il pozzo', kind: 'well' },
    'depths.swamp': { x: 40, y: 88, label: 'la palude', kind: 'pond' },
    'depths.jail': { x: 66, y: 88, label: 'la prigione', kind: 'jail' },
  }, lanes: [
    ['depths.entry', 'depths.coven'], ['depths.coven', 'depths.edera_nook'], ['depths.coven', 'depths.chains'],
    ['depths.coven', 'depths.well'], ['depths.coven', 'depths.tower'], ['depths.well', 'depths.swamp'],
    ['depths.swamp', 'depths.jail'], ['depths.tower', 'depths.jail'],
  ] },
};
export const REGION_OF = (place) => (place || '').split('.')[0];

// the little drawings, centred at 0,0, about 22 units wide (scaled by k)
function mark(g, kind, k) {
  g.save(); g.scale(k, k); g.beginPath();
  const L = (pts) => { g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); };
  switch (kind) {
    case 'house': case 'court': case 'church':
      L([[-9, 8], [-9, -2], [0, -10], [9, -2], [9, 8], [-9, 8]]); g.moveTo(-2, 8); g.lineTo(-2, 2); g.lineTo(2, 2); g.lineTo(2, 8);
      if (kind === 'church') { g.moveTo(0, -10); g.lineTo(0, -16); g.moveTo(-2.5, -13.5); g.lineTo(2.5, -13.5); }
      if (kind === 'court') { g.moveTo(-6, 0); g.lineTo(-6, 7); g.moveTo(6, 0); g.lineTo(6, 7); }
      break;
    case 'hut': L([[-8, 8], [-8, 0], [0, -8], [8, 0], [8, 8], [-8, 8]]); g.moveTo(3, -4); g.lineTo(3, -9); g.lineTo(5, -9); g.lineTo(5, -2); break;
    case 'tent': L([[-9, 8], [0, -9], [9, 8]]); g.moveTo(0, -9); g.lineTo(-2, 8); break;
    case 'stall': g.rect(-9, -1, 18, 9); L([[-10, -1], [-7, -7], [7, -7], [10, -1]]); break;
    case 'glass': g.arc(0, 0, 7, 0, 6.3); g.moveTo(-3, -2); g.lineTo(1, -5); break;
    case 'well': g.ellipse(0, 3, 8, 4, 0, 0, 6.3); g.moveTo(-8, 3); g.lineTo(-8, -6); g.lineTo(8, -6); g.lineTo(8, 3); break;
    case 'cart': g.rect(-9, -5, 16, 8); g.moveTo(9, 3); g.arc(-4, 5, 3.5, 0, 6.3); g.moveTo(7.5, 5); g.arc(4, 5, 3.5, 0, 6.3); break;
    case 'gate': L([[-9, 8], [-9, -6]]); L([[9, 8], [9, -6]]); g.moveTo(-9, -6); g.quadraticCurveTo(0, -13, 9, -6); g.moveTo(-5, 8); g.lineTo(-5, -6); g.moveTo(0, 8); g.lineTo(0, -8); g.moveTo(5, 8); g.lineTo(5, -6); break;
    case 'garden': for (const x of [-7, 0, 7]) { g.moveTo(x, 7); g.lineTo(x, -1); g.moveTo(x, 1); g.quadraticCurveTo(x - 4, -2, x - 3, -6); g.moveTo(x, 1); g.quadraticCurveTo(x + 4, -2, x + 3, -6); } break;
    case 'trap': g.rect(-7, -5, 14, 10); g.moveTo(-7, 0); g.lineTo(7, 0); g.moveTo(2, 2.5); g.arc(0, 2.5, 2, 0, 6.3); break;
    case 'road': g.moveTo(-5, 9); g.lineTo(-2, -8); g.moveTo(5, 9); g.lineTo(2, -8); break;
    case 'fire': L([[-8, 7], [8, 3]]); L([[-8, 3], [8, 7]]); g.moveTo(0, 4); g.quadraticCurveTo(-6, -2, 0, -10); g.quadraticCurveTo(6, -2, 0, 4); break;
    case 'den': g.moveTo(-10, 7); g.quadraticCurveTo(0, -14, 10, 7); g.moveTo(-5, 7); g.quadraticCurveTo(0, -4, 5, 7); break;
    case 'lantern': g.rect(-4, -5, 8, 11); L([[-5, -5], [0, -10], [5, -5]]); g.moveTo(0, -10); g.lineTo(0, -13); break;
    case 'mill': g.rect(-5, -2, 10, 10); g.moveTo(0, -4); g.lineTo(-9, -12); g.moveTo(0, -4); g.lineTo(9, -12); g.moveTo(0, -4); g.lineTo(-9, 4); g.moveTo(0, -4); g.lineTo(9, 4); break;
    case 'pond': g.ellipse(0, 1, 11, 6, 0, 0, 6.3); g.moveTo(-5, 1); g.quadraticCurveTo(-2.5, -1, 0, 1); g.quadraticCurveTo(2.5, 3, 5, 1); break;
    case 'stones': for (const x of [-7, 0, 7]) { g.moveTo(x - 2.5, 7); g.lineTo(x - 2.5, -3); g.quadraticCurveTo(x, -7, x + 2.5, -3); g.lineTo(x + 2.5, 7); } break;
    case 'graves': for (const x of [-6, 6]) { g.moveTo(x, 8); g.lineTo(x, -6); g.moveTo(x - 4, -2); g.lineTo(x + 4, -2); } break;
    case 'spring': g.moveTo(-8, 6); g.quadraticCurveTo(0, 0, 8, 6); g.moveTo(0, 2); g.quadraticCurveTo(-3, -4, 0, -9); g.moveTo(3, -1); g.quadraticCurveTo(5, -4, 4, -7); break;
    case 'stairs': L([[-9, 8], [-9, 3], [-3, 3], [-3, -2], [3, -2], [3, -7], [9, -7]]); break;
    case 'nook': g.moveTo(-9, 8); g.lineTo(-9, -2); g.quadraticCurveTo(0, -14, 9, -2); g.lineTo(9, 8); g.moveTo(-2, 1); g.arc(0, 1, 2, 0, 6.3); break;
    case 'circle': g.arc(0, 0, 9, 0, 6.3); for (let i = 0; i < 5; i++) { const a = -1.57 + i * 2.513; const b = -1.57 + ((i + 2) % 5) * 2.513; g.moveTo(Math.cos(a) * 9, Math.sin(a) * 9); g.lineTo(Math.cos(b) * 9, Math.sin(b) * 9); } break;
    case 'chains': for (let i = -1; i <= 1; i++) { g.moveTo(i * 6 + 3, 0); g.ellipse(i * 6, 0, 3, 2, 0, 0, 6.3); } break;
    case 'tower': L([[-5, 9], [-4, -8], [4, -8], [5, 9]]); L([[-6, -8], [-6, -12], [6, -12], [6, -8]]); g.moveTo(-1, -12); g.lineTo(2, -6); g.lineTo(-1, -1); break;
    case 'jail': g.rect(-8, -7, 16, 15); for (const x of [-4, 0, 4]) { g.moveTo(x, -7); g.lineTo(x, 8); } break;
    default: g.arc(0, 0, 4, 0, 6.3);
  }
  g.restore(); g.stroke();
}

export function sketch(regionId, { width = 320, seen = () => false, next = null, here = null, onPick = null } = {}) {
  const R = REGIONS[regionId], W = Math.round(width), H = Math.round(width * R.ratio), d = Math.min(2, globalThis.devicePixelRatio || 1);
  const [cv, g] = canvas(W * d, H * d);
  cv.style.width = `${W}px`; cv.style.height = `${H}px`;
  g.scale(d, d);
  const r = rnd(regionId.length * 97 + 5), j = () => (r() - 0.5) * 2.2;
  const P = (id) => { const p = R.places[id]; return [p.x / 100 * W, p.y / 100 * H]; };
  const pad = 14, k = Math.max(0.85, Math.min(1.25, W / 360));
  // the region's border: a loose hand-drawn frame
  g.strokeStyle = 'rgba(42,33,52,.35)'; g.lineWidth = 1.1; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(pad + j(), pad + j()); g.lineTo(W - pad + j(), pad + j()); g.lineTo(W - pad + j(), H - pad + j()); g.lineTo(pad + j(), H - pad + j()); g.closePath(); g.stroke();
  // lanes between seen places, a pencil double line wobbling
  g.strokeStyle = 'rgba(106,98,86,.6)'; g.lineWidth = 1.2; g.setLineDash([5, 4]);
  for (const [a, b] of R.lanes) {
    if (!seen(a) || !seen(b)) continue;
    const [ax, ay] = P(a), [bx, by] = P(b), mx = (ax + bx) / 2 + j() * 4, my = (ay + by) / 2 + j() * 4;
    g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo(mx, my, bx, by); g.stroke();
  }
  g.setLineDash([]);
  const wrap = h('div.sk', { style: { width: `${W}px`, height: `${H}px` } }, cv);
  for (const [id, p] of Object.entries(R.places)) {
    const [x, y] = P(id), on = seen(id), isNext = id === next;
    if (on) {
      // paper behind the drawing so lanes stop at it
      g.fillStyle = 'rgba(239,228,200,.9)'; g.beginPath(); g.arc(x, y, 12 * k, 0, 6.3); g.fill();
      g.strokeStyle = INK; g.lineWidth = 1.5 / 1; g.save(); g.translate(x, y); mark(g, p.kind, k); g.restore();
    }
    if (isNext) {
      g.strokeStyle = RED; g.lineWidth = 2; g.beginPath();
      const rr = 17 * k; for (let i = 0; i <= 30; i++) { const a = -0.6 + i / 30 * 6.9, q = rr * (1 + 0.08 * Math.sin(i * 1.7)); const px = x + Math.cos(a) * q * 1.15, py = y + Math.sin(a) * q; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
      if (!on) { g.fillStyle = RED; g.font = `700 22px ${HAND}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', x, y); }
    }
    if (on) {
      const lab = h('span.sk-lab', { style: { left: `${x}px`, top: `${y + 16 * k}px` } }, p.label);
      if (x < W * 0.18) lab.classList.add('sk-l'); else if (x > W * 0.82) lab.classList.add('sk-r');
      wrap.append(lab);
      if (onPick) wrap.append(h('button.sk-hit', { type: 'button', 'aria-label': p.label, style: { left: `${x}px`, top: `${y}px` }, onclick: (e) => onPick(id, p, e.currentTarget) }));
    }
  }
  if (here && R.places[here]) {
    const [x, y] = P(here);
    wrap.append(h('span.sk-me', { style: { left: `${x + 13 * k}px`, top: `${y - 14 * k}px` } }, '×', h('i', {}, ' io')));
  }
  return wrap;
}

export const SKETCH_CSS = `
.sk{position:relative;margin:4px auto 0}
.sk canvas{display:block}
.sk-lab{position:absolute;transform:translate(-50%,0);font:18px/19px ${HAND};color:${PENCIL};white-space:nowrap;pointer-events:none;padding:0 4px;border-radius:6px;background:#ede2c5e0}
.sk-lab.sk-l{transform:translate(-30%,0)}.sk-lab.sk-r{transform:translate(-75%,0)}
.sk-hit{position:absolute;width:48px;height:48px;transform:translate(-50%,-50%);border:0;background:none;border-radius:50%;cursor:pointer;-webkit-tap-highlight-color:transparent}
.sk-hit:focus-visible{outline:2px dashed ${RED}}
.sk-hit.on{outline:2px dashed ${RED};outline-offset:-4px}
.sk-me{position:absolute;color:${RED};font:700 24px/1 ${HAND};white-space:nowrap;pointer-events:none;text-shadow:0 0 3px #efe4c8}
.sk-me i{font-size:19px;font-style:normal;font-weight:400}
`;
