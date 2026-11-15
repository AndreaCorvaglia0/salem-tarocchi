// Harness for the shadow-theatre stage (src/story/stage/).
//   ?view=tableau&name=reader[&level=0..4][&found=8][&card=m05][&symbol=moon][&row=a,b,c][&celtic=ids][&strip=far,fx]
//   ?view=cameos (every cameo at 96 and 64 px)   ?view=big&ids=malva,tu&size=380
//   ?view=session (a demo session on the new stage: harness/stage.session.js)   ?view=cinema&name=arrival
//   ?view=sils (every figure on one sheet)   ?view=bench (build time of every tableau)
import '../src/core/fonts.js';
import { setState } from '../src/core/state.js';
import { findCard } from '../src/core/progress.js';
import { provide } from '../src/core/services.js';
import { cameo, CAMEOS } from '../src/story/stage/cameos.js';
import { createStage, playTableau, TABLEAUX } from '../src/story/stage/index.js';
import { SIL } from '../src/story/stage/silhouettes.js';
import { drawSil } from '../src/story/stage/draw.js';
import { Painter } from '../src/story/stage/painter.js';
import { TABLEAU_NAMES } from '../src/story/stage/tableaux.js';
import { playSession } from './stage.session.js';

const q = new URLSearchParams(location.search);
const view = q.get('view') || 'cameos';
const sheet = () => { document.body.classList.add('sheet'); const w = document.createElement('div'); w.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;padding:10px;align-items:flex-end'; document.body.append(w); return w; };

if (view === 'cameos') {
  const wrap = sheet();
  for (const size of [96, 64]) for (const id of Object.keys(CAMEOS)) {
    const box = document.createElement('div');
    box.style.cssText = 'display:flex;flex-direction:column;align-items:center;font:11px Georgia;gap:2px';
    box.append(cameo(id, size), id);
    wrap.append(box);
  }
}

if (view === 'big') { const wrap = sheet(); for (const id of (q.get('ids') || 'malva,ginepra').split(',')) wrap.append(cameo(id, Number(q.get('size') || 380))); }

if (view === 'sils') {
  const cv = document.createElement('canvas'), W = innerWidth, H = innerHeight;
  cv.width = W; cv.height = H; document.body.append(cv);
  const g = cv.getContext('2d');
  const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7); gr.addColorStop(0, '#f3c77c'); gr.addColorStop(1, '#8a4a1e');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const names = (q.get('names') || Object.keys(SIL).join(',')).split(',');
  const cols = Math.ceil(Math.sqrt((names.length * W) / H)), rows = Math.ceil(names.length / cols), cw = W / cols, ch = H / rows;
  names.forEach((n, i) => {
    const s = SIL[n], cx = ((i % cols) + 0.5) * cw, by = (Math.floor(i / cols) + 0.92) * ch, k = Math.min((ch * 0.8) / s.h, (cw * 0.4) / Number(q.get('wid') || 260));
    drawSil(g, s, cx, by, k, false, { color: '#140a06', soft: 1.5 });
    g.fillStyle = '#2a1408'; g.font = '11px monospace'; g.fillText(n, cx - cw / 2 + 4, by + 12);
  });
}

if (view === 'bench') {
  const out = [];
  for (const n of TABLEAU_NAMES) { const t0 = performance.now(); new Painter(n, { W: 585, H: 1266, d: 1.5, level: 0, found: [], calm: false, imgOf: () => null }); out.push(`${n}:${Math.round(performance.now() - t0)}ms`); }
  document.body.append(out.join(' ')); window.__bench = out.join(' ');
}

if (view === 'tableau') {
  setState({ started: true, player: { name: 'Ada' } });
  for (const id of ['m00', 'm01', 'm02', 'm03', 'm05', 'm07', 'm09', 'm12'].slice(0, Number(q.get('found') ?? 8))) findCard(id, { silent: true });
  const name = q.get('name') || 'reader';
  for (const k of (q.get('strip') || '').split(',').filter(Boolean)) if (TABLEAUX[name]) TABLEAUX[name][k] = [];
  const st = createStage(document.getElementById('ui'), { tableau: name, session: Number(q.get('level') || 0) });
  window.__stage = st;
  if (q.get('card')) setTimeout(() => st.layCard(q.get('card')), 300);
  if (q.get('symbol')) setTimeout(() => st.symbol(q.get('symbol'), { hold: 30 }), 300);
  if (q.get('row')) setTimeout(() => st.table.row(q.get('row').split(',')), 300);
  if (q.get('celtic')) setTimeout(() => st.table.celtic(q.get('celtic').split(',')), 300);
}

if (view === 'session') {
  const lvl = Number(q.get('level') || 1);
  setState({ started: true, chapter: 1, player: { name: 'Ada', birth: { d: 1, m: 10, y: 1995 }, sign: 'bilancia', birthCard: 'm11' }, words: { value: 'lealtà' }, flags: { 'b1.spoke': true } });
  for (const id of ['m00', 'm01', 'm02', 'm03', 'm05', 'm07'].slice(0, 2 + lvl * 2)) findCard(id, { silent: true });
  for (const s of ['card.found', 'draw.pick', 'exam.start', 'reading.open', 'world.travel']) provide(s, async () => {});
  const R = (t) => ({ say: 'lettrice', t });
  const nodes = [
    R('Siediti, {name}. La candela si è accorciata da quando sei arrivata.'),
    R('In piazza hai parlato. Davanti a una porta chiusa, adesso: bussi, o cerchi la finestra?'),
    { choice: [{ t: 'Busso.', then: [R('Bussi. Annoto.')] }, { t: 'Cerco la finestra.', then: [R('La finestra. Annoto.')] }] },
    { turn: 'm00' },
    R('Il Matto. Un passo sull\'orlo. Questa eri tu, la prima notte.'),
    { symbol: 'moon' },
    R('Il fumo ha visto una luna. Non chiedermi perché.'),
    R('Dimmi un numero.'),
    { pick: 'number', then: [R('{picked}. Non te la spiego. Esce adesso perché adesso serve.')] },
    R('Vai. Il bosco ti aspetta.'),
  ];
  playSession('demo', { level: lvl, nodes }).then(() => { document.body.dataset.done = '1'; });
}

if (view === 'cinema') {
  const name = q.get('name') || 'arrival';
  const LINES = { arrival: ['Salem. Inverno. Notte.', 'La neve copre la strada e i passi di chi è passato prima.', 'Hai una borsa, un nome, e nessuna idea di cosa ti aspetta.'] };
  playTableau(name, LINES[name] || ['Una riga di prova, lunga abbastanza da andare a capo su un telefono.', 'E una seconda.']).then(() => { document.body.dataset.done = '1'; });
}
