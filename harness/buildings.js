// Harness: the proof board for buildings with a personality (notes/buildings.md). No game logic,
// no Phaser: the painters draw into canvases, shown at the game's zoom (2 CSS px per art px on a
// 390 px phone: World.js zoomFor) with crisp pixels.
// Query: ?part=board | silhouettes | street | signs | close (default: all but close)
//        ?season=winter|spring|autumn  ?night (the board under the night tint)  ?stage=1..3 (street cottage)
//        ?only=<id>&z=4 (part=close: one new building, 4x).
import { house, cottage, hut } from '../src/world/art/houses.js';
import { court } from '../src/world/art/civic.js';
import { PROPS } from '../src/world/art/props.js';
import { courtHouse, libraryHouse, townHouse, GLYPHS } from '../src/world/art/facades.js';
import { malvaHouse, cottageHome, cottageBeds, orticaHut, SUITS } from '../src/world/art/witchhomes.js';
import { tree, pine, fence, herbs } from '../src/world/art/nature.js';
import { paintGround } from '../src/world/art/ground.js';
import { parseMap } from '../src/world/maps.js';
import { NIGHT, SKY, M } from '../src/world/art/palette.js';
import { INKS } from './buildings.ink.js';

const q = new URLSearchParams(location.search);
const SEASON = q.get('season') || 'winter';
const Z = Number(q.get('z') || 2);
const T = 16;
const app = document.getElementById('app');
const el = (tag, txt, cls) => { const e = document.createElement(tag); if (txt) e.textContent = txt; if (cls) e.className = cls; return e; };

// a block as the map parser makes it
const B = (w, h, door, opts = {}) => ({ w, h, doors: door ? [door] : [], opts });
// the six: today's painter and the new one(s), with footprint and door (col, row in the block)
const SIX = [
  { id: 'malva', name: 'Casa di Malva', sym: 'mortar', fp: '5x4, porta col 0 (come oggi)',
    today: (s) => house(B(5, 4, [0, 3], { roof: 'plum', lit: [1, 1], chimney: true, sign: 'herb' }), s), next: [['nuova', (s) => malvaHouse(B(5, 4, [0, 3]), s)]] },
  { id: 'cottage', name: 'La mia capanna', sym: 'cat', fp: '4x3, porta col 2 (come oggi); l\'orto 2x2 a destra',
    today: (s) => cottage(B(4, 3, [2, 2]), s),
    next: [['1 sbilenca', (s) => cottageHome(B(4, 3, [2, 2], { stage: 1 }), s)], ['2 rimessa a posto', (s) => cottageHome(B(4, 3, [2, 2], { stage: 2 }), s)],
      ['3 casa di strega', (s) => cottageHome(B(4, 3, [2, 2], { stage: 3, slots: { suit: 'cups', plants: ['lavanda', 'calendula', 'rosmarino', 'timo'], prize: 'ribbon' } }), s)]] },
  { id: 'ortica', name: 'La capanna di Ortica', sym: 'bird', fp: '4x3 nel bosco (come oggi), la chioma sporge 12 px per lato', season: 'spring',
    today: (s) => hut(B(4, 3, null), s), next: [['nuova', (s) => orticaHut(B(4, 3, null), s)]] },
  { id: 'court', name: 'Il tribunale', sym: 'scales', fp: '7x6, porta col 3 (come oggi)',
    today: (s) => court(B(7, 6, [3, 5]), s), next: [['nuovo', (s) => courtHouse(B(7, 6, [3, 5]), s)]] },
  { id: 'library', name: 'La biblioteca', sym: 'book', fp: '3x4 dentro il 5x4 di oggi, porta col 1 = stessa casella',
    today: (s) => house(B(5, 4, [2, 3], { roof: 'slate', lit: [0, 1] }), s), next: [['nuova', (s) => libraryHouse(B(3, 4, [1, 3]), s)]] },
  { id: 'house', name: 'Casa qualsiasi (non si entra)', sym: null, fp: '5x4, porta col 2 (come le case A, F)',
    today: (s) => house(B(5, 4, null, { roof: 'brown', door: 2, lit: [0, 1] }), s),
    next: [['semplice', (s) => townHouse(B(5, 4, [2, 3], { variant: 'plain' }), s)], ['ricca: i Proctor', (s) => townHouse(B(5, 4, [2, 3], { variant: 'rich' }), s)], ['in rovina', (s) => townHouse(B(5, 4, [2, 3], { variant: 'ruined' }), s)]] },
];

// ---------- the ground, from a little map with the real tile painter
const groundCache = {};
function groundFor(rows, season) {
  const key = rows.join('|') + season;
  if (!groundCache[key]) groundCache[key] = paintGround(parseMap({ id: 'proof', name: 'proof', season, start: null, rows, key: {}, anchors: {}, doors: [], chests: [], gates: [], patrols: [], suits: [], obstacles: [] }), season);
  return groundCache[key];
}
const decoArt = {};
const deco = (kind, season, v = 0) => (decoArt[kind + season + v] ||= kind === 't' ? tree(season, v) : kind === 'p' ? pine(season, v) : kind === 'h' ? herbs(season, v) : fence(season, v ? 'v' : 'h'));

// Composes a scene at art resolution: ground, decorations and buildings sorted by their bottom,
// shadows, and (night) the tint with light cut out at windows and lamps, plus the glows.
function scene(rows, placed, season, { night = false, tint = null } = {}) {
  const g = groundFor(rows, season), W = g.width, H = g.height;
  const c = el('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(g, 0, 0);
  const draws = [], lights = [];
  rows.forEach((r, y) => [...r].forEach((ch, x) => {
    if ('tp'.includes(ch)) { const a = deco(ch, season, (x + y) % 2); draws.push([y * T + T, () => ctx.drawImage(a, x * T + 8 - (a.width >> 1), y * T + T + 1 - a.height)]); }
    if (ch === 'h') draws.push([y * T + 4, () => ctx.drawImage(deco('h', season, (x * 3 + y) % 2), x * T, y * T)]);
    if (ch === 'f') draws.push([y * T + T - 3, () => ctx.drawImage(deco('f', season, 0), x * T, y * T + T - 20)]);
  }));
  for (const p of placed) {
    const art = p.art, left = p.x * T - (art.ox || 0), bottom = (p.y + p.h) * T, top = bottom - art.canvas.height;
    draws.push([bottom - 1, () => {
      if (p.shadow !== false) { ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.beginPath(); ctx.ellipse(p.x * T + (p.w * T) / 2 + 2, bottom - 2, (p.w * T) / 2 + 2, 5, 0, 0, 7); ctx.fill(); }
      ctx.drawImage(art.canvas, left, top);
    }]);
    for (const w of art.windows || []) if (w.lit) lights.push({ x: left + w.x, y: top + w.y, r: w.lamp ? 46 : 30, lamp: w.lamp });
    if (p.light) lights.push({ x: left + p.light[0], y: top + p.light[1], r: 50, lamp: true });
    if (art.smoke) draws.push([bottom + 1, () => { ctx.fillStyle = 'rgba(200,205,220,0.35)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(left + art.smoke[0] + i * 2, top + art.smoke[1] - 3 - i * 5, 2 + i, 0, 7); ctx.fill(); } }]);
  }
  draws.sort((a, b) => a[0] - b[0]).forEach((d) => d[1]());
  const sky = tint || (night ? SKY[season] || SKY.winter : null);
  if (sky) {
    const n = el('canvas'); n.width = W; n.height = H;
    const nx = n.getContext('2d');
    const col = sky.tint.toString(16).padStart(6, '0');
    nx.fillStyle = `#${col}`; nx.globalAlpha = sky.outside ?? NIGHT.outside; nx.fillRect(0, 0, W, H); nx.globalAlpha = 1;
    nx.globalCompositeOperation = 'destination-out';
    for (const l of lights) { const gr = nx.createRadialGradient(l.x, l.y + 6, 0, l.x, l.y + 6, l.r); gr.addColorStop(0, 'rgba(0,0,0,0.7)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); nx.fillStyle = gr; nx.fillRect(l.x - l.r, l.y + 6 - l.r, l.r * 2, l.r * 2); }
    ctx.drawImage(n, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    for (const l of lights) { const r = l.lamp ? 14 : 10, gr = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, r); gr.addColorStop(0, 'rgba(255,190,90,0.45)'); gr.addColorStop(1, 'rgba(255,190,90,0)'); ctx.fillStyle = gr; ctx.fillRect(l.x - r, l.y - r, r * 2, r * 2); }
    ctx.globalCompositeOperation = 'source-over';
  }
  return c;
}
const show = (canvas, z = Z) => { canvas.style.width = `${canvas.width * z}px`; canvas.style.height = `${canvas.height * z}px`; return canvas; };

// one building on a patch of real ground (a path in front of the door), no margins
function onGround(art, w, h, season, opts) {
  const tilesW = Math.ceil((art.canvas.width) / T), extraTop = Math.ceil(art.canvas.height / T) - h;
  const rowsN = extraTop + h + 1, ox = art.ox ? 1 : 0;
  const rows = Array.from({ length: rowsN }, (_, y) => (y === rowsN - 1 ? '='.repeat(tilesW) : '.'.repeat(tilesW)));
  const c = scene(rows, [{ art, x: ox ? art.ox / T : 0, y: extraTop, w, h }], season, opts);
  return c;
}

// ---------- parts
function board() {
  const night = q.has('night');
  app.append(el('h2', `Tavola: oggi (A) e nuovo (B), ${SEASON}${night ? ', di notte' : ''}`));
  app.append(el('p', 'Zoom del gioco (2x su 390 px). Ogni edificio sul suo pezzo di terreno vero, la strada davanti alla porta.'));
  for (const b of SIX) {
    const s = b.season || SEASON;
    app.append(el('h3', b.name));
    app.append(el('div', `ingombro: ${b.fp}${b.sym ? ` · insegna: ${b.sym}` : ''}`, 'note'));
    const row = el('div', '', 'row');
    const add = (label, art, w, h) => { const cell = el('div', '', 'cell'); cell.append(show(onGround(art, w, h, s, { night }))); cell.append(el('small', label)); row.append(cell); };
    const ta = b.today(s);
    const [tw, th] = b.id === 'malva' || b.id === 'library' || b.id === 'house' ? [5, 4] : b.id === 'court' ? [7, 6] : [4, 3];
    add('A oggi', ta, tw, th);
    app.append(row);
    const rowB = el('div', '', 'row');
    for (const [label, fn] of b.next) { const art = fn(s); const [w, h] = b.id === 'library' ? [3, 4] : [tw, th]; const cell = el('div', '', 'cell'); cell.append(show(onGround(art, w, h, s, { night }))); cell.append(el('small', `B ${label}`)); rowB.append(cell); }
    app.append(rowB);
    if (b.id === 'cottage') slots(s);
  }
}

function slots(s) {
  app.append(el('h3', 'Le tre «caselle» della casa di strega (dal suo salvataggio)'));
  app.append(el('div', '(a) il seme che sa meglio: colore della porta e dell\'insegna, il segno sopra la porta', 'note'));
  const r1 = el('div', '', 'row');
  for (const suit of Object.keys(SUITS)) { const cell = el('div', '', 'cell'); cell.append(show(cottageHome(B(4, 3, [2, 2], { stage: 3, slots: { suit, plants: ['salvia', 'lavanda'], prize: null } }), s).canvas, 1.4)); cell.append(el('small', SUITS[suit].name)); r1.append(cell); }
  app.append(r1);
  app.append(el('div', '(b) le piante alla finestra: quelle che coltiva davvero · (c) un oggetto alla porta: un premio vinto', 'note'));
  const r2 = el('div', '', 'row');
  for (const [label, sl] of [['menta, camomilla', { suit: 'pentacles', plants: ['menta', 'camomilla', 'verbena'], prize: 'lume' }], ['ortica, salvia', { suit: 'wands', plants: ['ortica', 'salvia'], prize: 'chiave' }], ['niente ancora', { suit: 'swords', plants: [], prize: 'ribbon' }]]) {
    const cell = el('div', '', 'cell'); cell.append(show(cottageHome(B(4, 3, [2, 2], { stage: 3, slots: sl }), s).canvas, 1.9)); cell.append(el('small', label)); cell.append(el('small', sl.prize === 'lume' ? 'il lume di Malva' : sl.prize === 'chiave' ? 'la chiave' : 'nastro rosso')); r2.append(cell);
  }
  app.append(r2);
}

function silhouettes() {
  app.append(el('h2', 'Sagome a metà grandezza'));
  app.append(el('p', 'Tutto nero, 1x (metà dello zoom del gioco). Sopra le nuove, sotto quelle di oggi.'));
  const black = (art) => { const c = el('canvas'); c.width = art.canvas.width; c.height = art.canvas.height; const x = c.getContext('2d'); x.drawImage(art.canvas, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); return show(c, 1); };
  const rowN = el('div', '', 'row sil'), rowT = el('div', '', 'row sil');
  for (const b of SIX) {
    const s = b.season || SEASON;
    for (const [label, fn] of b.next) { const cell = el('div', '', 'cell'); cell.append(black(fn(s))); const sm = el('small', b.id === 'cottage' || b.id === 'house' ? label : b.name); sm.style.color = '#333'; cell.append(sm); rowN.append(cell); }
    const cell = el('div', '', 'cell'); cell.append(black(b.today(s))); const sm = el('small', b.name); sm.style.color = '#333'; cell.append(sm); rowT.append(cell);
  }
  app.append(el('h3', 'nuove')); app.append(rowN); app.append(el('h3', 'oggi')); app.append(rowT);
}

// a strip of village 12 tiles wide (what the phone shows across): upper stone, lower wood, the edge
const STREET = [
  'pppppppppppp',
  'p.t........p',
  '............',
  '............', '............', '............', '............', '............', '............',
  '############',
  '############',
  '............', '............', '............', '............', '............',
  '############',
  '..====..====',
  '.....=......',
  '......ffff..', '......hhhf..', '......hhhf..', '......hhhf..',
  '============',
  '............',
  '............', '............', '............', '............',
  '============',
  ',....=....t.',
  't.........,.',
  't..........t',
  't..........,',
  ',,,====...t.',
  't,..=..t,,,t',
  'p...=......p',
  't...=......t',
  'p...=......p',
  't..........p',
  'p...........',
  'p..........t',
  'pt..=......p',
  'ppp.=......p',
];
function street(night) {
  const s = SEASON, st = Number(q.get('stage') || 3);
  const lamp = PROPS.lamp(B(1, 1), s);
  const placed = [
    { art: courtHouse(B(7, 6, [3, 5]), s), x: 0, y: 3, w: 7, h: 6 },
    { art: libraryHouse(B(3, 4, [1, 3]), s), x: 8, y: 5, w: 3, h: 4 },
    { art: lamp, x: 7, y: 9, w: 1, h: 1, shadow: false, light: [8, 7] },
    { art: townHouse(B(5, 4, [2, 3], { variant: 'rich' }), s), x: 0, y: 11, w: 5, h: 4 },
    { art: townHouse(B(5, 4, [2, 3], { variant: 'plain' }), s), x: 6, y: 11, w: 5, h: 4 },
    { art: malvaHouse(B(5, 4, [0, 3]), s), x: 1, y: 19, w: 5, h: 4 },
    { art: lamp, x: 0, y: 22, w: 1, h: 1, shadow: false, light: [8, 7] },
    { art: townHouse(B(5, 4, [2, 3], { variant: 'ruined' }), s), x: 0, y: 25, w: 5, h: 4 },
    { art: townHouse(B(5, 4, [2, 3], { variant: 'plain' }), s), x: 6, y: 25, w: 5, h: 4 },
    { art: cottageHome(B(4, 3, [2, 2], { stage: st, slots: { suit: 'cups', plants: ['lavanda', 'calendula', 'rosmarino'], prize: 'ribbon' } }), s), x: 1, y: 32, w: 4, h: 3 },
    { art: { canvas: cottageBeds(s, st === 1 ? 0 : st), windows: [] }, x: 6, y: 33, w: 2, h: 2, shadow: false },
    { art: orticaHut(B(4, 3, null), s), x: 4, y: 40, w: 4, h: 3 },
  ];
  app.append(el('h2', `La strada, ${night ? 'di notte' : 'senza la notte'} (${s}, capanna allo stadio ${st})`));
  app.append(el('p', 'Larga 12 caselle: quello che il telefono mostra in larghezza. In alto la pietra (tribunale, biblioteca, i Proctor), poi il legno (Malva, la rovina), poi il limite del bosco.'));
  app.append(show(scene(STREET, placed, s, { night })));
}

function signs() {
  app.append(el('h2', 'Simboli: insegna = cartello = mappa'));
  const tb = el('table');
  tb.innerHTML = '<tr><th>luogo</th><th>simbolo</th><th>cartello</th><th>mappa</th></tr>';
  const rows = [['casa di Malva', 'mortar', 'malva'], ['la mia capanna', 'cat', 'cottage'], ['capanna di Ortica', 'bird', 'ortica'], ['tribunale', 'scales', 'court'], ['biblioteca', 'book', 'library'], ['casa delle riunioni', 'bell', 'church'], ['bottega', 'bottle', 'shop'], ['mulino', 'wheel', 'mill']];
  for (const [name, sym, ink] of rows) {
    const tr = el('tr'); tr.append(el('td', name)); tr.append(el('td', sym));
    const td = el('td'); const c = el('canvas'); c.width = 22; c.height = 10; const x = c.getContext('2d');
    x.fillStyle = '#120f1c'; x.fillRect(0, 0, 22, 10); x.fillStyle = M.wood[2]; x.fillRect(1, 1, 20, 8); x.fillStyle = M.wood[4]; x.fillRect(1, 1, 20, 1);
    x.fillStyle = '#f2ead2'; GLYPHS[sym].forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '#') x.fillRect(4 + i, 3 + j - 1, 1, 1); }));
    x.fillStyle = '#ffd683'; [[0, 2], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]].forEach(([dy, dx]) => x.fillRect(16 - dx + 2, 3 + dy, 1, 1));
    td.append(show(c, 3)); tr.append(td);
    const ti = el('td'); const k = el('canvas'); k.width = 66; k.height = 60; const g = k.getContext('2d');
    g.fillStyle = '#e9dcc0'; g.fillRect(0, 0, 66, 60); g.translate(33, 30); g.scale(1.75, 1.75); g.lineWidth = 0.75; g.strokeStyle = '#3a2e28'; g.beginPath(); (INKS[ink])(g); g.stroke();
    k.style.width = '44px'; k.style.height = '40px'; k.style.imageRendering = 'auto'; ti.append(k); tr.append(ti);
    tb.append(tr);
  }
  app.append(tb);
  app.append(el('p', 'La bottega non ha insegna (il bottegaio l\'ha staccata vent\'anni fa): al suo posto resta la staffa vuota; il cartello e la mappa tengono la bottiglia.'));
}

function close() {
  const id = q.get('only') || 'malva', b = SIX.find((x) => x.id === id), s = b.season || SEASON, idx = Number(q.get('i') || 0);
  const [label, fn] = b.next[idx];
  const [w, h] = b.id === 'library' ? [3, 4] : b.id === 'court' ? [7, 6] : ['malva', 'house'].includes(b.id) ? [5, 4] : [4, 3];
  app.append(el('h3', `${b.name} · ${label} · ${Z}x`));
  app.append(show(onGround(fn(s), w, h, s, { night: q.has('night') })));
}

const part = q.get('part');
if (part === 'close') close();
else {
  if (!part || part === 'board') board();
  if (!part || part === 'silhouettes') silhouettes();
  if (!part || part === 'signs') signs();
  if (!part || part === 'street') { if (!q.has('night')) street(false); if (!q.has('day')) street(true); }
}
window.__ready = true;
