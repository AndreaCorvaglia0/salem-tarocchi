// The real cards on the stage: DOM images over the canvas, upright, warmly lit, with soft shadows and
// a CSS flip. No hands: cards appear out of the dark, turn by themselves, settle.
//   const cards = createCards(parent, { calm })
//   cards.zone({ x, y, h })   centre and card height in CSS px (the tableau's lit place)
//   await cards.lay(id)       face down out of the dark, then turned; at most three in a row
//   cards.show(id) / await cards.turn(i) / await cards.row(ids) / await cards.celtic(ids) / cards.highlight(i)
//   await cards.shuffle()     a fan of backs opens and closes, slowly    await cards.clear()
import { h, css, cardUrl } from '../../core/dom.js';
import { SPREADS } from '../../data/spreads.js';

const CSS = `
.sgc{position:absolute;inset:0;pointer-events:none;perspective:1400px}
.sgc-card{position:absolute;left:0;top:0;transform-style:preserve-3d;transition:transform 1.1s cubic-bezier(.3,.7,.2,1),opacity .9s,filter .8s;opacity:0;will-change:transform}
.sgc-card.on{opacity:1}
.sgc-card.dim{filter:brightness(.45) saturate(.7)}
.sgc-in{position:absolute;inset:0;transform-style:preserve-3d;transition:transform 1.15s cubic-bezier(.45,.05,.25,1)}
.sgc-card.up .sgc-in{transform:rotateY(180deg)}
.sgc-f,.sgc-b{position:absolute;inset:0;border-radius:4.5%/2.6%;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;box-shadow:0 18px 34px rgba(0,0,0,.62),0 0 0 1px rgba(255,226,180,.18)}
.sgc-f{transform:rotateY(180deg);background:#2a1a10}
.sgc-f img{width:100%;height:100%;display:block;object-fit:cover;filter:sepia(.16) saturate(.92) contrast(1.04) brightness(.97)}
.sgc-f::after,.sgc-b::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 30%,rgba(255,214,150,.0) 45%,rgba(40,14,4,.42));pointer-events:none}
.sgc-b{background-size:cover}
.sgc-card.hi .sgc-f{box-shadow:0 22px 40px rgba(0,0,0,.65),0 0 42px rgba(255,196,110,.55),0 0 0 1px rgba(255,226,180,.4)}
@media (prefers-reduced-motion:reduce){.sgc-card,.sgc-in{transition:opacity .6s}}
`;

let backUrl = '';
function cardBack() {
  if (backUrl) return backUrl;
  const c = document.createElement('canvas'); c.width = 350; c.height = 600;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 600); gr.addColorStop(0, '#3a1218'); gr.addColorStop(1, '#1e080c');
  g.fillStyle = gr; g.fillRect(0, 0, 350, 600);
  g.strokeStyle = '#c9a24a'; g.lineWidth = 4; g.strokeRect(16, 16, 318, 568); g.lineWidth = 1.5; g.strokeRect(28, 28, 294, 544);
  g.save(); g.translate(175, 300); g.strokeStyle = 'rgba(201,162,74,0.85)'; g.fillStyle = '#c9a24a'; g.lineWidth = 2.5;
  g.beginPath(); g.arc(0, 0, 92, 0, 6.3); g.stroke(); g.beginPath(); g.arc(0, 0, 78, 0, 6.3); g.stroke();
  g.beginPath(); g.arc(-8, 0, 46, Math.PI * 0.3, Math.PI * 1.7); g.arc(12, 0, 36, Math.PI * 1.55, Math.PI * 0.45, true); g.closePath(); g.fill();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.beginPath(); g.moveTo(Math.cos(a) * 100, Math.sin(a) * 100); g.lineTo(Math.cos(a) * (i % 2 ? 120 : 140), Math.sin(a) * (i % 2 ? 120 : 140)); g.stroke(); }
  g.restore();
  for (const [x, y] of [[175, 70], [175, 530]]) { g.save(); g.translate(x, y); g.fillStyle = '#c9a24a'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 6 : 15; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.fill(); g.restore(); }
  backUrl = c.toDataURL('image/png');
  return backUrl;
}

export function createCards(parent, { calm = false } = {}) {
  css('stage-cards', CSS);
  const el = h('div.sgc'); parent.append(el);
  const sleep = (ms) => new Promise((r) => setTimeout(r, calm ? Math.min(ms, 250) : ms));
  let Z = { x: 195, y: 420, h: 160 };
  const list = []; // { id, el, x, y, w, rot, s }

  const make = (id) => {
    const c = h('div.sgc-card', h('div.sgc-in', h('div.sgc-b', { style: { backgroundImage: `url(${cardBack()})` } }), h('div.sgc-f', id ? h('img', { src: cardUrl(id), alt: '', draggable: false }) : null)));
    el.append(c);
    const item = { id, el: c, x: Z.x, y: Z.y + Z.h * 0.1, w: Z.h * 0.583, rot: 0, s: 0.94 };
    place(item);
    return item;
  };
  function place(it) {
    const w = it.w, hh = w / 0.583;
    Object.assign(it.el.style, { width: `${w}px`, height: `${hh}px`, transform: `translate(${it.x - w / 2}px,${it.y - hh / 2}px) rotate(${it.rot}deg) scale(${it.s})` });
  }
  const live = () => list.filter((c) => !c.gone);
  function layoutRow() {
    const L = live(), n = L.length, w = Math.min(Z.h * 0.583, (parent.clientWidth * 0.86) / (n * 1.12));
    L.forEach((c, i) => { c.w = w; c.x = Z.x + (i - (n - 1) / 2) * w * 1.12; c.y = Z.y; c.rot = (((c.id || '').charCodeAt(2) || 0) % 5 - 2) * 0.6; c.s = 1; place(c); });
  }
  const retire = async (c) => { c.gone = true; c.el.classList.remove('on'); c.y -= Z.h * 0.12; place(c); await sleep(900); c.el.remove(); list.splice(list.indexOf(c), 1); };

  async function lay(id) {
    const L = live();
    if (L.length >= 3) retire(L[0]);
    const c = make(id); list.push(c);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    c.el.classList.add('on'); layoutRow();
    await sleep(900);
    c.el.classList.add('up');
    await sleep(1250);
    return c;
  }
  function show(id) { const c = make(id); list.push(c); requestAnimationFrame(() => { c.el.classList.add('on'); layoutRow(); }); return c; }
  async function turn(i = live().length - 1) { const c = typeof i === 'string' ? live().find((x) => x.id === i) : live()[i]; if (!c) return; c.el.classList.add('up'); await sleep(1250); }
  async function row(ids) { for (const id of ids) { show(id); await sleep(260); } await sleep(700); for (let i = 0; i < ids.length; i++) { live()[i].el.classList.add('up'); await sleep(420); } await sleep(900); }
  async function celtic(ids) {
    await clear();
    const pos = SPREADS.celtic.positions, boxW = Math.min(parent.clientWidth * 0.94, Z.h * 3.1), boxH = boxW * 1.25, w = boxW * 0.16;
    ids.slice(0, 10).forEach((id, i) => {
      const p = pos[i], c = make(id); list.push(c);
      c.w = w; c.x = Z.x + (p.x / 100 - 0.47) * boxW; c.y = Z.y + (p.y / 100 - 0.5) * boxH; c.rot = p.rot || 0; c.s = 1;
      setTimeout(() => { c.el.classList.add('on'); place(c); }, (calm ? 40 : 220) * i);
      setTimeout(() => c.el.classList.add('up'), (calm ? 60 : 220) * i + (calm ? 300 : 900));
    });
    await sleep(220 * ids.length + 1800);
  }
  function highlight(i) { live().forEach((c, j) => { c.el.classList.toggle('hi', j === i); c.el.classList.toggle('dim', i != null && j !== i); c.s = j === i ? 1.06 : 1; c.y = j === i ? Z.y - Z.h * 0.04 : Z.y; place(c); }); }
  async function clear() { const all = live(); all.forEach((c) => retire(c)); if (all.length) await sleep(950); }
  // the shuffle without hands: a deck rises, opens into a fan, closes, twice, and settles
  async function shuffle() {
    const backs = Array.from({ length: 7 }, () => { const c = make(''); c.s = 0.9; c.w = Z.h * 0.5; place(c); return c; });
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    backs.forEach((c) => c.el.classList.add('on'));
    await sleep(700);
    for (let k = 0; k < (calm ? 1 : 2); k++) {
      backs.forEach((c, i) => { const a = (i - 3) * 9; c.rot = a; c.x = Z.x + (i - 3) * Z.h * 0.09; c.y = Z.y + Math.abs(i - 3) * Z.h * 0.03; place(c); });
      await sleep(1100);
      backs.forEach((c, i) => { c.rot = (i - 3) * 0.7; c.x = Z.x; c.y = Z.y - i * 1.5; place(c); });
      await sleep(900);
    }
    backs.forEach((c) => { c.el.classList.remove('on'); });
    await sleep(800);
    backs.forEach((c) => c.el.remove());
  }
  return {
    el, lay, show, turn, row, celtic, highlight, clear, shuffle,
    zone(z) { Z = { ...Z, ...z }; layoutRow(); },
    get ids() { return live().map((c) => c.id); },
    destroy() { el.remove(); },
  };
}
