// The views of the lore graph (lore-site/, #/grafo/<vista>): which types each shows, how each is laid out, and
// which links it draws at rest. Pure functions of the notes, the family hubs and the named edges, so the layout
// is the same every time (tests/lore.site.test.mjs). The picture is designed 360 units wide: one unit is about
// one pixel on a phone when the whole view is in sight.
//   buildViews(ctx) -> views     ctx: { notes, hubs, edges: [[a, b, fieldIndex]], fields, nodeAt }
import { layout, spread } from '../../lore-site/layout.js';

const W = 360;
const SPINE = { insegna: ['legge', 'leggi'], impara: ['famiglia', 'riguarda', 'sta_in'], storia: ['luoghi', 'chi_ci_vive', 'persona'] };
const METODO = ['legge', 'principio', 'tecnica', 'ricetta', 'meccanica'];
const CORSO = ['obiettivo', 'famiglia', 'concetto'];
const STORIA = ['persona', 'luogo', 'fatto', 'retroscena', 'decisione'];

export const VIEWS = [
  { id: 'insegna', short: 'Metodo', label: 'Perché insegna', types: METODO },
  { id: 'impara', short: 'Corso', label: 'Che cosa si impara', types: ['obiettivo', 'famiglia', 'concetto', 'luogo'] },
  { id: 'storia', short: 'Storia', label: 'La storia', types: STORIA },
  { id: 'tutto', short: 'Tutto', label: 'Tutto', types: [...METODO, ...CORSO, 'luogo', 'persona', 'fatto', 'retroscena', 'decisione'] },
];
// the three doors of the home page: the zone, its question, the types it lists and the view it opens
export const ZONES = [
  { id: 'metodo', label: 'Metodo: come si insegna', view: 'insegna', types: METODO },
  { id: 'corso', label: 'Corso: che cosa si impara', view: 'impara', types: ['obiettivo', 'concetto'] },
  { id: 'storia', label: 'Storia: dove e con chi', view: 'storia', types: STORIA },
];
const zoneOf = (tipo) => (METODO.includes(tipo) ? 'metodo' : CORSO.includes(tipo) ? 'corso' : 'storia');
const WORDS = ['Nessuna legge', 'Una legge', 'Due leggi', 'Tre leggi', 'Quattro leggi', 'Cinque leggi', 'Sei leggi', 'Sette leggi', 'Otto leggi', 'Nove leggi', 'Dieci leggi', 'Undici leggi', 'Dodici leggi'];

const r1 = (v) => Math.round(v * 10) / 10;
const cut = (t, n) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);
const human = (s) => String(s).replace(/-/g, ' ');

// n circles of radius rs in rings around a circle of radius hubR: offsets and the radius of the whole cluster
export function ringPack(hubR, rs, n, gap = 2.5) {
  const pts = [];
  let rho = hubR + rs + gap + 0.5, ring = 0;
  while (pts.length < n) {
    const cap = Math.max(1, Math.floor((2 * Math.PI * rho) / (2 * rs + gap)));
    const k = Math.min(cap, n - pts.length), off = ring % 2 ? Math.PI / Math.max(cap, 2) : 0;
    for (let j = 0; j < k; j++) { const a = -Math.PI / 2 + off + (2 * Math.PI * j) / k; pts.push([rho * Math.cos(a), rho * Math.sin(a)]); }
    rho += 2 * rs + gap; ring++;
  }
  return { pts, R: n ? rho - (2 * rs + gap) + rs : hubR };
}

// items {w, h} in rows of at most `per`, centred in `width`; returns the centre of each and the total height
function flow(items, width, { gapX = 8, gapY = 10, per = 99 } = {}) {
  const out = [];
  let y = 0, i = 0;
  while (i < items.length) {
    let j = i, rw = 0;
    while (j < items.length && j - i < per && (j === i || rw + items[j].w + gapX <= width)) { rw += items[j].w + (j > i ? gapX : 0); j++; }
    const rh = Math.max(...items.slice(i, j).map((it) => it.h));
    let x = (width - rw) / 2;
    for (let k = i; k < j; k++) { out[k] = { x: x + items[k].w / 2, y: y + rh / 2, rowH: rh, rowTop: y }; x += items[k].w + gapX; }
    y += rh + gapY; i = j;
  }
  return { at: out, height: Math.max(0, y - gapY) };
}

export function buildViews(ctx) {
  const { notes, hubs, edges, fields, nodeAt } = ctx;
  const all = [...notes.map((n, i) => i), ...hubs.map((h) => h.index)];
  const fname = (e) => fields[e[2]];
  const tipoOf = (i) => nodeAt(i).tipo;
  const out = {};
  for (const def of VIEWS) if (def.id !== 'tutto') out[def.id] = oneView(def);
  out.tutto = tutto();
  return VIEWS.map((d) => out[d.id]);

  // ----- common
  function members(def) { return all.filter((i) => def.types.includes(tipoOf(i)) && !String(nodeAt(i).id).startsWith('_')); }
  function viewPairs(set) {
    const seen = new Set(), pairs = [];
    for (const [a, b] of edges) {
      if (!set.has(a) || !set.has(b) || a === b) continue;
      const k = a < b ? `${a},${b}` : `${b},${a}`;
      if (!seen.has(k)) { seen.add(k); pairs.push([a, b]); }
    }
    return pairs;
  }
  function degOf(pairs) { const d = new Map(); for (const [a, b] of pairs) { d.set(a, (d.get(a) || 0) + 1); d.set(b, (d.get(b) || 0) + 1); } return d; }

  function oneView(def) {
    const set = new Set(members(def));
    const pairs = viewPairs(set), deg = degOf(pairs);
    const linked = new Set([...set].filter((i) => deg.get(i)));
    const ctxv = { set, linked, deg };
    const res = def.id === 'insegna' ? insegna(ctxv) : def.id === 'impara' ? impara(ctxv) : storia(def, ctxv);
    return finish(def, set, pairs, res);
  }

  // placed: Map(index -> { x, y, r, label?, ldy?, lw?, always? }); caps; caption
  function finish(def, set, pairs, { placed, caps, caption, restFn }) {
    const ids = [...placed.keys()];
    const loose = [...set].filter((i) => !placed.has(i));
    const loc = new Map(ids.map((g, k) => [g, k]));
    // centre the picture on 0
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of placed.values()) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const rest = [];
    const restSet = new Set(restFn ? [] : (SPINE[def.id] || []));
    const seen = new Set();
    for (const e of edges) {
      const a = e[0], b = e[1];
      if (!loc.has(a) || !loc.has(b) || a === b) continue;
      if (restFn ? !restFn(a, b) : !restSet.has(fname(e))) continue;
      const la = loc.get(a), lb = loc.get(b), k = la < lb ? `${la},${lb}` : `${lb},${la}`;
      if (!seen.has(k)) { seen.add(k); rest.push([la, lb]); }
    }
    const lbl = {}, always = [];
    ids.forEach((g, k) => { const p = placed.get(g); if (p.label) lbl[k] = { t: p.label, dy: r1(p.ldy ?? 0), lw: p.lw || 0 }; if (p.always) always.push(k); });
    const count = {};
    for (const g of ids) count[tipoOf(g)] = (count[tipoOf(g)] || 0) + 1;
    const lo = {};
    for (const g of loose) lo[tipoOf(g)] = (lo[tipoOf(g)] || 0) + 1;
    return {
      id: def.id, short: def.short, label: def.label, caption, ids,
      pos: ids.flatMap((g) => [Math.round(placed.get(g).x - cx), Math.round(placed.get(g).y - cy)]),
      r: ids.map((g) => r1(placed.get(g).r)), loose, rest, lbl, always,
      caps: caps.map(([x, y, t, kind]) => [Math.round(x - cx), Math.round(y - cy), t, kind]),
      legend: def.types.map((tipo) => ({ tipo, count: count[tipo] || 0, loose: lo[tipo] || 0 })).filter((t) => t.count || t.loose),
    };
  }

  // ----- «Perché insegna»: eleven clusters, one per law; below, the mechanics grouped by dinamica
  function insegna({ linked, deg }) {
    const placed = new Map(), caps = [];
    const laws = [...linked].filter((i) => tipoOf(i) === 'legge').sort((a, b) => (nodeAt(a).fm?.numero ?? 99) - (nodeAt(b).fm?.numero ?? 99) || (nodeAt(a).id < nodeAt(b).id ? -1 : 1));
    const lawOf = new Map(); // principio / tecnica / ricetta -> its main law (the field `legge`)
    for (const e of edges) if (fname(e) === 'legge' && linked.has(e[0]) && linked.has(e[1]) && tipoOf(e[1]) === 'legge' && !lawOf.has(e[0])) lawOf.set(e[0], e[1]);
    const order = { principio: 0, tecnica: 1, ricetta: 2 };
    const sat = (l) => [...lawOf].filter(([, law]) => law === l).map(([m]) => m).sort((a, b) => order[tipoOf(a)] - order[tipoOf(b)] || (nodeAt(a).id < nodeAt(b).id ? -1 : 1));
    const groups = laws.map((l) => ({ law: l, sats: sat(l) }));
    const orphans = [...linked].filter((i) => order[tipoOf(i)] !== undefined && !lawOf.has(i)).sort((a, b) => order[tipoOf(a)] - order[tipoOf(b)] || (nodeAt(a).id < nodeAt(b).id ? -1 : 1));
    if (orphans.length) groups.push({ law: null, sats: orphans });
    const satR = (m) => Math.min(6, 3.2 + 0.7 * Math.sqrt(deg.get(m) || 1));
    for (const g of groups) {
      g.rs = Math.max(3.5, ...g.sats.map(satR));
      g.hubR = g.law != null ? 12 : 0;
      g.pack = ringPack(g.hubR, g.rs, g.sats.length);
      g.R = Math.max(g.pack.R, g.hubR);
    }
    const top = 16;
    const f = flow(groups.map((g) => ({ w: 2 * g.R, h: 2 * g.R + 26 })), W, { gapX: 6, gapY: 6, per: 4 });
    caps.push([W / 2, 0, laws.length ? `${(WORDS[laws.length] || `${laws.length} leggi`).toUpperCase()}, E CIÒ CHE NE DISCENDE` : 'PRINCIPI, TECNICHE, RICETTE', 'title']);
    groups.forEach((g, k) => {
      const c = f.at[k], cx = c.x, cy = top + c.rowTop + c.rowH / 2 - 13;
      const rowR = (c.rowH - 26) / 2;
      if (g.law != null) {
        const n = nodeAt(g.law);
        placed.set(g.law, { x: cx, y: cy, r: g.hubR, always: true, label: `${n.fm?.numero ?? ''}${n.fm?.numero != null ? ' · ' : ''}${cut(n.fm?.nome || n.title, 22)}`, ldy: rowR + 3, lw: 84 });
      }
      g.sats.forEach((m, j) => placed.set(m, { x: cx + g.pack.pts[j][0], y: cy + g.pack.pts[j][1], r: satR(m) }));
    });
    // the mechanics: small groups by dinamica, in a band of their own
    const mech = [...linked].filter((i) => tipoOf(i) === 'meccanica');
    const byDin = new Map();
    for (const m of mech) { const k = String(nodeAt(m).fm?.dinamica || 'altro'); if (!byDin.has(k)) byDin.set(k, []); byDin.get(k).push(m); }
    const lawNum = (m) => Math.min(99, ...edges.filter((e) => e[0] === m && tipoOf(e[1]) === 'legge').map((e) => nodeAt(e[1]).fm?.numero ?? 99));
    const dins = [...byDin].map(([k, ms]) => ({ k, ms: ms.sort((a, b) => (nodeAt(a).id < nodeAt(b).id ? -1 : 1)), n: Math.min(...ms.map(lawNum)) }))
      .sort((a, b) => a.n - b.n || (a.k < b.k ? -1 : 1));
    const mr = (m) => Math.min(6.5, 3.4 + 0.8 * Math.sqrt(deg.get(m) || 1));
    for (const d of dins) {
      d.cols = d.ms.length > 2 ? 2 : d.ms.length;
      d.rows = Math.ceil(d.ms.length / d.cols);
      d.s = 2 * Math.max(...d.ms.map(mr)) + 3;
      d.w = Math.max(40, d.cols * d.s); d.h = d.rows * d.s + 14;
    }
    const gy = top + f.height + 34;
    caps.push([W / 2, gy - 16, 'QUELLO CHE LEI FA', 'title']);
    const fm = flow(dins.map((d) => ({ w: Math.max(d.w, 56), h: d.h })), W, { gapX: 8, gapY: 8, per: 5 });
    dins.forEach((d, k) => {
      const c = fm.at[k], x0 = c.x - (d.cols * d.s) / 2, y0 = gy + c.rowTop;
      d.ms.forEach((m, j) => placed.set(m, { x: x0 + (j % d.cols) * d.s + d.s / 2, y: y0 + Math.floor(j / d.cols) * d.s + d.s / 2, r: mr(m) }));
      caps.push([c.x, y0 + d.rows * d.s + 6, human(d.k), 'group']);
    });
    const nl = laws.length;
    return { placed, caps, caption: `${WORDS[nl] || `${nl} leggi`}${nl ? '; intorno a ognuna, i principi, le tecniche e le ricette che ne discendono. Sotto, quello che lei fa.' : ': i principi, le tecniche e le ricette. Sotto, quello che lei fa.'}` };
  }

  // ----- «Che cosa si impara»: obiettivi (top) -> families with their concepts (middle) -> luoghi (bottom)
  function impara({ linked, deg }) {
    const placed = new Map(), caps = [];
    const cr = (c) => { const p = nodeAt(c).fm?.peso; return p === 'nucleo' ? 6.2 : p === 'contorno' ? 3.8 : Math.min(6, 3.4 + 0.7 * Math.sqrt(deg.get(c) || 1)); };
    const famOfConcept = new Map();
    for (const h of hubs) for (const m of h.members) if (linked.has(m) && linked.has(h.index)) famOfConcept.set(m, h.index);
    const clusters = hubs.filter((h) => linked.has(h.index)).map((h) => ({ hub: h.index, ms: h.members.filter((m) => linked.has(m)).sort((a, b) => (nodeAt(a).id < nodeAt(b).id ? -1 : 1)) }));
    const loneConcepts = [...linked].filter((i) => tipoOf(i) === 'concetto' && !famOfConcept.has(i)).sort((a, b) => (nodeAt(a).id < nodeAt(b).id ? -1 : 1));
    if (loneConcepts.length) clusters.push({ hub: null, ms: loneConcepts });
    for (const c of clusters) {
      c.nucleo = c.ms.length > 0 && c.ms.filter((m) => nodeAt(m).fm?.peso === 'nucleo').length * 2 >= c.ms.length;
      c.rs = Math.max(3.5, ...c.ms.map(cr));
      c.hubR = c.hub == null ? 0 : Math.min(c.nucleo ? 14 : 11, (c.nucleo ? 9 : 7) + 0.9 * Math.sqrt(c.ms.length));
      c.pack = ringPack(c.hubR, c.rs, c.ms.length);
      c.R = Math.max(c.pack.R, c.hubR); c.d = 2 * c.R;
    }
    const big = clusters.filter((c) => c.nucleo).sort((a, b) => b.d - a.d);
    const side = clusters.filter((c) => !c.nucleo).sort((a, b) => b.d - a.d);
    const OB_TOP = 14, FAM_TOP = 104;
    const spot = new Map(); // cluster -> centre
    const label = (c, cx, cy) => ({ label: c.hub == null ? 'Senza famiglia' : nodeAt(c.hub).title, ldy: c.R + 2, lw: 92 });
    // centre column: the nucleo families, two to a row when they fit
    const colC = { x: 180, w: 160 };
    const fc = flow(big.map((c) => ({ w: c.d + 22, h: c.d + 22 })), colC.w, { gapX: 4, gapY: 2 });
    big.forEach((c, k) => spot.set(c, { x: colC.x - colC.w / 2 + fc.at[k].x, y: FAM_TOP + fc.at[k].y }));
    // side columns: the others, each to the shorter column
    const cols = [{ x: 56, h: 0, items: [] }, { x: 304, h: 0, items: [] }];
    for (const c of side) { const col = cols[0].h <= cols[1].h ? cols[0] : cols[1]; col.items.push(c); col.h += c.d + 22; }
    for (const col of cols) { let y = FAM_TOP; for (const c of col.items) { spot.set(c, { x: col.x, y: y + c.d / 2 + 4 }); y += c.d + 22; } }
    const bandBottom = Math.max(FAM_TOP + fc.height, ...cols.map((c) => FAM_TOP + c.h));
    const hubX = new Map();
    for (const c of clusters) {
      const p = spot.get(c);
      if (c.hub != null) { placed.set(c.hub, { x: p.x, y: p.y, r: c.hubR, always: true, ...label(c) }); hubX.set(c.hub, p.x); }
      c.ms.forEach((m, j) => placed.set(m, { x: p.x + c.pack.pts[j][0], y: p.y + c.pack.pts[j][1], r: cr(m) }));
    }
    // obiettivi: a labelled row on top, ordered by where their families are
    const obj = [...linked].filter((i) => tipoOf(i) === 'obiettivo');
    const mx = (o) => { const xs = edges.filter((e) => e[0] === o && hubX.has(e[1])).map((e) => hubX.get(e[1])); return xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : W / 2; };
    obj.sort((a, b) => mx(a) - mx(b) || (nodeAt(a).id < nodeAt(b).id ? -1 : 1));
    const orad = (o) => { const p = nodeAt(o).fm?.peso; return p === 'nucleo' ? 8.5 : p === 'contorno' ? 5.5 : Math.min(8, 4 + 0.8 * Math.sqrt(deg.get(o) || 1)); };
    const perRow = Math.min(7, Math.max(1, obj.length)), rowsN = Math.ceil(obj.length / perRow);
    caps.push([W / 2, 0, 'OBIETTIVI: CHE COSA LEI SA FARE', 'title']);
    obj.forEach((o, k) => {
      const row = Math.floor(k / perRow), inRow = Math.min(perRow, obj.length - row * perRow), j = k % perRow;
      const step = (W - 40) / perRow, x = W / 2 - ((inRow - 1) * step) / 2 + j * step;
      placed.set(o, { x, y: OB_TOP + 8 + row * 30, r: orad(o), ...(nodeAt(o).fm?.peso === 'nucleo' ? { always: false } : {}) });
    });
    caps.push([W / 2, FAM_TOP - 34 + 6 - 2, 'FAMIGLIE DI CONCETTI', 'title']);
    // luoghi: only those a concept `sta_in`, in a row at the bottom, ordered by where their concepts are
    const luoghi = [...linked].filter((i) => tipoOf(i) === 'luogo');
    let bottomY = bandBottom;
    if (luoghi.length) {
      const bx = (l) => { const xs = edges.filter((e) => e[1] === l && placed.has(e[0]) && tipoOf(e[0]) === 'concetto').map((e) => placed.get(e[0]).x); return xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : W / 2; };
      luoghi.sort((a, b) => bx(a) - bx(b) || (nodeAt(a).id < nodeAt(b).id ? -1 : 1));
      const lr = 5.5, per = Math.floor((W - 30) / (2 * lr + 7)), n = luoghi.length, rowsL = Math.ceil(n / per), y0 = bandBottom + 36;
      caps.push([W / 2, y0 - 20, 'LUOGHI: DOVE SI IMPARA', 'title']);
      luoghi.forEach((l, k) => {
        const row = Math.floor(k / per), inRow = Math.min(per, n - row * per), j = k % per, step = Math.min(2 * lr + 7, (W - 40) / Math.max(1, inRow - 1 || 1));
        placed.set(l, { x: W / 2 - ((inRow - 1) * step) / 2 + j * step, y: y0 + row * (2 * lr + 6), r: lr });
      });
      bottomY = y0 + rowsL * (2 * lr + 6);
    }
    return { placed, caps, caption: 'In alto, che cosa lei sa fare; in mezzo, le famiglie di concetti (le più grandi sono il nucleo); in basso, i luoghi dove li si trova.' };
  }

  // ----- «La storia»: discs by type, laid out by forces (persone in the middle)
  function storia(def, { linked, deg }) {
    const ids = [...linked];
    const loc = new Map(ids.map((g, k) => [g, k]));
    const local = viewPairs(linked).map(([a, b]) => [loc.get(a), loc.get(b)]);
    const base = ids.map((g) => Math.round(Math.min(10, 3 + 1.3 * Math.sqrt(deg.get(g))) * 10) / 10);
    const types = [...new Set(def.types)];
    const anchors = { persona: [0, 0], fatto: [0, -1.3], retroscena: [1.1, 0.9], luogo: [-1.1, 0.9], decisione: [1.2, -1.3] };
    const group = ids.map((g) => types.indexOf(tipoOf(g)));
    let s0 = 1, p = null, rUsed = base;
    for (let pass = 0; pass < 3; pass++) {
      rUsed = base.map((v) => v / s0);
      p = arrange(rUsed);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (let k = 0; k < ids.length; k++) { x0 = Math.min(x0, p[2 * k]); x1 = Math.max(x1, p[2 * k]); y0 = Math.min(y0, p[2 * k + 1]); y1 = Math.max(y1, p[2 * k + 1]); }
      s0 = Math.min(1, 340 / Math.max(1, x1 - x0), 520 / Math.max(1, y1 - y0));
    }
    function arrange(rw) {
      const area = types.map(() => 0), num = types.map(() => 0);
      ids.forEach((g, k) => { area[group[k]] += (rw[k] + 2.5) ** 2; num[group[k]]++; });
      const R = area.map((a) => Math.sqrt(a) * 1.3);
      const au = types.map((t) => [(anchors[t] || [0, 0])[0], (anchors[t] || [0, 0])[1] * 1.3]);
      let A = 40;
      for (let i = 0; i < types.length; i++) for (let j = i + 1; j < types.length; j++) {
        if (!num[i] || !num[j]) continue;
        A = Math.max(A, ((R[i] + R[j]) * 0.9) / (Math.hypot(au[i][0] - au[j][0], au[i][1] - au[j][1]) || 1));
      }
      const at = au.map(([x, y]) => [x * A, y * A]);
      const init = new Float64Array(2 * ids.length), seen = {};
      ids.forEach((g, k) => { const gi = group[k], c = (seen[gi] = (seen[gi] || 0) + 1), rr = 9 * Math.sqrt(c), ang = c * 2.39996323; init[2 * k] = at[gi][0] + rr * Math.cos(ang); init[2 * k + 1] = at[gi][1] + rr * Math.sin(ang); });
      const pull = types.map((t, i) => Math.min(14, Math.max(0.3, (1200 * num[i]) / ((R[i] * R[i]) || 1))));
      const q = layout(ids.length, local, { iterations: 360, dist: 20, init, gravity: 0.01, hubGravity: 1.2, group, groupPull: pull, groupAt: at, rad: rw, pad: 5 });
      spread(q, rw, { iterations: 400, pad: 4 });
      return q;
    }
    const placed = new Map();
    ids.forEach((g, k) => placed.set(g, { x: p[2 * k], y: p[2 * k + 1], r: rUsed[k], ...(tipoOf(g) === 'persona' && rUsed[k] >= 9 ? { always: false } : {}) }));
    return { placed, caps: [], caption: 'Fatti in alto, persone al centro, luoghi e retroscena ai lati. Le linee dicono chi vive dove e di chi è ogni retroscena.' };
  }

  // ----- «Tutto»: the three zones one under the other; at rest only the links that cross zones
  function tutto() {
    const def = VIEWS[3];
    const set = new Set(members(def)), pairs = viewPairs(set), deg = degOf(pairs);
    const linkedAll = new Set([...set].filter((i) => deg.get(i)));
    const part = (d) => { const s = new Set(members(d)); const pr = viewPairs(s), dg = degOf(pr); return { s, deg: dg, linked: new Set([...s].filter((i) => dg.get(i))) }; };
    const A = insegna(part(VIEWS[0])), B = impara(part(VIEWS[1])), C = storia(VIEWS[2], part(VIEWS[2]));
    const placed = new Map(), caps = [];
    const bbox = (pl) => { let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; for (const p of pl.values()) { x0 = Math.min(x0, p.x - p.r); x1 = Math.max(x1, p.x + p.r); y0 = Math.min(y0, p.y - p.r); y1 = Math.max(y1, p.y + p.r); } return { x0, x1, y0, y1 }; };
    const zones = [
      { id: 'metodo', title: 'METODO: COME SI INSEGNA', R: A, keep: (g) => tipoOf(g) !== 'x', k: 0.8 },
      { id: 'corso', title: 'CORSO: CHE COSA SI IMPARA', R: B, keep: (g) => tipoOf(g) !== 'luogo', k: 0.8 },
      { id: 'storia', title: 'STORIA: DOVE E CON CHI', R: C, keep: () => true, k: 0.75 },
    ];
    let y = 0;
    for (const z of zones) {
      const pl = new Map([...z.R.placed].filter(([g]) => z.keep(g)));
      const b = bbox(pl), w = (b.x1 - b.x0) * z.k, ox = W / 2 - (((b.x0 + b.x1) / 2) * z.k);
      caps.push([W / 2, y + 6, z.title, 'title']);
      const top = y + 26;
      for (const [g, p] of pl) {
        if (!linkedAll.has(g)) continue;
        placed.set(g, { x: p.x * z.k + ox, y: (p.y - b.y0) * z.k + top, r: Math.max(2.2, p.r * z.k * 0.85) });
      }
      y = top + (b.y1 - b.y0) * z.k + 26;
      z.w = w;
    }
    const restFn = (a, b) => zoneOf(tipoOf(a)) !== zoneOf(tipoOf(b));
    return finish(def, set, pairs, { placed, caps, restFn, caption: 'Le tre zone una sotto l’altra. Le linee sono i ponti: quello che lei fa insegna un obiettivo, un concetto sta in un luogo, una ricetta passa da una persona.' });
  }
}
