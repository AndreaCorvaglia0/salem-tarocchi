// The garden at the cottage (docs/DESIGN.md "L'orto", "L'orto insegna davvero"): one bed shown large at a
// time, the four beds as thumbnails below to switch between. The large bed: its light (an icon and words) and
// its soil, the plant drawn from its world sprite (a sprout for the first two steps, then growing from the soil
// up), its name, a row of dots for the steps, what her finger found, one main button («Pianta», «Annaffia» or
// «Raccogli») and a second one, «Tocca la terra». Under it, after a gesture, one line says why, from the plant's
// real needs, and the advice for the wrong light or soil; «Sposta» and «Cambia terra» stay small at the bottom.
// No countdown anywhere: she learns to touch the soil. Rules: glue/garden.rules.js; actions: glue/garden.js.
// openGarden({ from: 'table' | 'world' }) -> Promise resolved when she closes it.
import { snd } from './sfx.js';
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { todayKey } from '../core/progress.js';
import { state } from '../core/state.js';
import { HERB, HERB_LIST } from '../data/herbs/base.js';
import { HERB_TEXTS } from '../data/herbs/texts.js';
import { GARDEN, SOILS, SOIL, LIGHT, BEDS } from '../data/garden.js';
import { herbArt } from '../world/art/herbs.js';
import { garden, seeds, pantry, settleAll, plantIn, waterIn, harvestIn, touchIn, resoilIn, moveIn } from '../glue/garden.js';
import { isReady, looksWet, feel, FEEL, lineFor, lightWhy, soilWhy, lessonNote, bedLight, summary } from '../glue/garden.rules.js';
import { SERIF, HAND, GOLD, RED, baseCss } from './paper.js';
import { onEscape } from './book.js';

const CSS = `
.gd{position:fixed;inset:0;z-index:60;overflow:hidden auto;display:flex;flex-direction:column;align-items:center;background:radial-gradient(ellipse 90% 420px at 50% 36%,#3a2414 0%,#1a1018 60%,#07070d 100%) #07070d;color:#efe4c8;font:16px ${SERIF};animation:gx-fade .4s;-webkit-overflow-scrolling:touch}
.gd-head{flex:none;width:min(420px,calc(100% - 28px));margin-top:calc(14px + env(safe-area-inset-top));text-align:center}
.gd-head h1{margin:0;font:400 30px/1.1 ${SERIF};color:#f3e7c9;text-shadow:0 0 24px #d8b25a33}
.gd-head p{margin:3px 0 0;font:italic 16px/20px ${SERIF};color:#b9a98a}
.gd-bed{position:relative;flex:none;display:flex;flex-direction:column;align-items:center;width:min(400px,calc(100% - 24px));box-sizing:border-box;margin-top:12px;padding:10px 14px 12px;border-radius:10px;background:linear-gradient(#2a1a10,#1b120c);border:1px solid #5a3a22;box-shadow:0 10px 22px #000a, inset 0 1px 0 #7a523355}
.gd-tags{display:flex;justify-content:space-between;width:100%;font:italic 15px/20px ${SERIF};color:#cdbf9f}
.gd-tags span{display:inline-flex;align-items:center;gap:5px}
.gd-tags svg{flex:none}
.gd-plot{position:relative;width:100%;height:178px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.gd-soil{position:absolute;left:14%;right:14%;bottom:0;height:30px;border-radius:50% 50% 6px 6px/60% 60% 6px 6px;background:radial-gradient(ellipse at 50% 30%,#8a5a34,#5e3a20 70%);box-shadow:inset 0 -4px 0 #3a2414, 0 2px 0 #120b07;transition:background 1.2s}
.gd-soil.leggera{background:radial-gradient(ellipse at 50% 30%,#a0825e,#6e5636 70%)}
.gd-soil.leggera::before{content:'';position:absolute;inset:5px 10% 7px;background:radial-gradient(ellipse 3px 2px at 12% 40%,#d9cbb0 90%,transparent) ,radial-gradient(ellipse 2px 2px at 27% 70%,#c9b898 90%,transparent),radial-gradient(ellipse 3px 2px at 46% 30%,#e3d6bc 90%,transparent),radial-gradient(ellipse 2px 2px at 63% 65%,#c9b898 90%,transparent),radial-gradient(ellipse 3px 2px at 80% 35%,#d9cbb0 90%,transparent),radial-gradient(ellipse 2px 1.5px at 92% 70%,#bfae8e 90%,transparent)}
.gd-soil.fresca{background:radial-gradient(ellipse at 50% 30%,#6a4630,#43291a 70%)}
.gd-bed.wet .gd-soil{background:radial-gradient(ellipse at 50% 30%,#4a2e1c,#28180e 70%)}
.gd-pl{position:relative;z-index:1;display:block;width:96px;height:168px;margin-bottom:12px;image-rendering:pixelated;image-rendering:crisp-edges;transform-origin:50% 100%;filter:drop-shadow(0 2px 0 #0008)}
.gd-pl.pop{animation:gd-pop .7s cubic-bezier(.3,1.6,.5,1)}
@keyframes gd-pop{0%{transform:scale(.86)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
.gd-pl.sag{animation:gd-sag .9s ease-in-out}
@keyframes gd-sag{40%{transform:scale(1,.9) skewX(-3deg)}100%{transform:none}}
.gd-glow{position:absolute;left:50%;bottom:22px;width:150px;height:150px;margin-left:-75px;border-radius:50%;background:radial-gradient(circle,#ffe39a55,transparent 65%);pointer-events:none;animation:gd-gl 2.6s ease-in-out infinite}
@keyframes gd-gl{50%{opacity:.5;transform:scale(.92)}}
.gd-drop{position:absolute;z-index:2;top:0;width:4px;height:10px;border-radius:2px 2px 3px 3px;background:linear-gradient(#cfe8ff,#7fb0e0);opacity:0;animation:gd-drop .75s ease-in forwards}
@keyframes gd-drop{0%{opacity:0;transform:translateY(0)}15%{opacity:.95}90%{opacity:.9}100%{opacity:0;transform:translateY(160px)}}
.gd-spark{position:absolute;z-index:2;width:6px;height:6px;border-radius:50%;background:#fff3c4;box-shadow:0 0 8px 2px #ffd77a;opacity:0;animation:gd-spark .9s ease-out forwards}
@keyframes gd-spark{0%{opacity:0;transform:translate(0,0) scale(.4)}30%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-40px) scale(1)}}
.gd-empty{position:absolute;bottom:40px;left:0;right:0;text-align:center;font:19px ${HAND};color:#8f7c5e}
.gd-nm{display:flex;align-items:center;gap:8px;margin-top:6px;font:700 25px/26px ${HAND};color:#f3e7c9}
.gd-risk{display:inline-block;padding:0 9px;border-radius:10px;font:700 15px/20px ${HAND};color:#fbf5e6;background:${RED}}
.gd-risk.att{background:#8a6a2a}
.gd-dots{display:flex;gap:6px;margin-top:6px;min-height:9px}
.gd-dots i{width:9px;height:9px;border-radius:50%;border:1px solid #d8b25a88;box-sizing:border-box}
.gd-dots i.on{background:#e6c26a;border-color:#e6c26a}
.gd-dots i.new{box-shadow:0 0 7px 2px #ffe9a8}
.gd-feel{margin-top:6px;font:italic 16px/20px ${SERIF};color:#b9a98a;text-align:center;min-height:20px}
.gd-feel b{font-style:normal;font-weight:400;color:#f0dfae}
.gd-acts{display:flex;gap:10px;width:100%;margin-top:9px}
.gd-b{flex:1;min-height:50px;border-radius:6px;border:1px solid #d8b25a66;background:#0b0a10b0;color:#f1e6cb;font:19px ${SERIF};letter-spacing:.01em;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .2s,border-color .2s}
.gd-b:hover,.gd-b:focus-visible{background:#2a2016;border-color:${GOLD};outline:none}
.gd-b.main{border-color:${GOLD};background:#2a2016d0}
.gd-b.ripe{border-color:#f0cf7a;background:#3a2a12;color:#fff1c8}
.gd-b:disabled{opacity:.5;cursor:default}
.gd-ln{margin:10px 0 0;font:19px/22px ${HAND};color:#e9dcc0;text-align:center}
.gd-ln:empty{display:none}
.gd-ln.bad{color:#f0b08a}
.gd-why{margin:8px 0 0;padding-top:8px;border-top:1px dashed #5a3a22;width:100%;font:17px/20px ${HAND};color:#cdb98e;text-align:center}
.gd-why p{margin:0}.gd-why p+p{margin-top:4px}
.gd-why .ls{color:#a8c49a}
.gd-more{display:flex;justify-content:center;gap:22px;margin-top:6px}
.gd-l{min-height:40px;padding:0 4px;border:0;background:none;color:#cdbf9f;font:16px ${SERIF};text-decoration:underline;text-underline-offset:4px;cursor:pointer}
.gd-thumbs{flex:none;display:grid;grid-template-columns:repeat(4,1fr);gap:7px;width:min(400px,calc(100% - 24px));margin-top:10px}
.gd-th{position:relative;display:flex;flex-direction:column;align-items:center;gap:1px;min-height:92px;padding:4px 2px 5px;border-radius:8px;border:1px solid #4a3020;background:#160e0a;color:#e9dcc0;font:16px/17px ${HAND};cursor:pointer;-webkit-tap-highlight-color:transparent}
.gd-th.on{border-color:${GOLD};background:#2a1a10;box-shadow:0 0 0 1px ${GOLD}55}
.gd-th canvas{width:24px;height:42px;image-rendering:pixelated;image-rendering:crisp-edges}
.gd-th .nm{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gd-th .lt{display:flex;align-items:center;gap:3px;font:italic 12px ${SERIF};color:#a8987a}
.gd-th .pic{position:relative;display:flex;align-items:flex-end;justify-content:center;width:44px;height:44px}
.gd-th .pic::after{content:'';position:absolute;left:4px;right:4px;bottom:0;height:7px;border-radius:50% 50% 2px 2px/70% 70% 2px 2px;background:#6e4628}
.gd-th .pic canvas{position:relative;z-index:1;margin-bottom:3px}
.gd-th .rp{position:absolute;top:4px;right:5px;width:7px;height:7px;border-radius:50%;background:#ffe39a;box-shadow:0 0 6px 2px #ffd77a}
.gd-foot{flex:none;width:min(400px,calc(100% - 24px));margin:12px 0 calc(16px + env(safe-area-inset-bottom));text-align:center}
.gd-pan{margin:0;font:17px/21px ${HAND};color:#b9a98a}
.gd-pan b{font-weight:700;color:#e9dcc0}
.gd-close{margin-top:10px;min-height:48px;padding:0 26px;border-radius:6px;border:1px solid #d8b25a66;background:#0b0a10b0;color:#f1e6cb;font:19px ${SERIF};cursor:pointer}
.gd-pick{position:fixed;inset:0;z-index:61;display:flex;align-items:flex-end;justify-content:center;background:#07070dcc;animation:gx-fade .2s}
.gd-sheet{width:min(420px,100%);max-height:84%;overflow:auto;box-sizing:border-box;padding:14px 14px calc(16px + env(safe-area-inset-bottom));border-radius:12px 12px 0 0;background:linear-gradient(#2a1a10,#1b120c);border-top:1px solid #7a5233;box-shadow:0 -10px 24px #000b}
.gd-sheet h2{margin:0 0 2px;text-align:center;font:400 22px ${SERIF};color:#f3e7c9}
.gd-sheet>p{margin:0 0 10px;text-align:center;font:italic 15px/19px ${SERIF};color:#b9a98a}
.gd-opts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.gd-opt{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;min-height:96px;padding:6px 2px;border-radius:8px;border:1px solid #5a3a22;background:#120c08;color:#f1e6cb;font:18px/20px ${HAND};cursor:pointer}
.gd-opt:hover,.gd-opt:focus-visible{border-color:${GOLD};outline:none}
.gd-opt canvas{width:32px;height:56px;image-rendering:pixelated;image-rendering:crisp-edges}
.gd-opt .n{position:absolute;top:3px;right:6px;font:700 15px ${HAND};color:#e6c26a}
.gd-opt.poison{border-color:${RED}aa}
.gd-rows{display:flex;flex-direction:column;gap:8px}
.gd-row{display:flex;align-items:center;gap:12px;min-height:58px;padding:6px 12px;border-radius:8px;border:1px solid #5a3a22;background:#120c08;color:#f1e6cb;font:16px/19px ${SERIF};text-align:left;cursor:pointer}
.gd-row:hover,.gd-row:focus-visible{border-color:${GOLD};outline:none}
.gd-row b{display:block;font:700 20px/22px ${HAND}}
.gd-row i{display:block;color:#b9a98a}
.gd-row:disabled{opacity:.45;cursor:default}
.gd-sw{flex:none;width:34px;height:22px;border-radius:50% 50% 5px 5px/60% 60% 5px 5px;box-shadow:inset 0 -3px 0 #0006}
.gd-tip{margin:10px 2px 0;font:17px/21px ${HAND};color:#cdb98e;text-align:center}
.gd-none{margin:10px 0;text-align:center;font:19px/24px ${HAND};color:#cdbf9f}
@media (max-height:760px){.gd-plot{height:150px}.gd-pl{height:140px;width:80px}}
@media (prefers-reduced-motion:reduce){.gd-pl.pop,.gd-pl.sag,.gd-glow,.gd-drop,.gd-spark{animation:none}}
`;

const NAME = (id) => HERB[id]?.name || id;
const lower = (id) => NAME(id).toLowerCase();
const riskTag = (id) => (HERB[id]?.risk === 'velenosa' ? h('span.gd-risk', {}, 'velenosa') : HERB[id]?.risk === 'attenzione' ? h('span.gd-risk.att', {}, 'con cura') : null);
const ORDER = HERB_LIST.map((p) => p.id);
const SOIL_SWATCH = { leggera: '#a0825e', ricca: '#7a4e2c', fresca: '#4e3220' };

// the light of a bed: a small drawing (full sun, half shade, shade)
function lightIcon(light, size = 16) {
  const c = '#f0cf7a';
  const body = light === 'sole'
    ? `<circle cx="8" cy="8" r="3.4" fill="${c}"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; return `<line x1="${(8 + Math.cos(r) * 5.2).toFixed(1)}" y1="${(8 + Math.sin(r) * 5.2).toFixed(1)}" x2="${(8 + Math.cos(r) * 7.2).toFixed(1)}" y2="${(8 + Math.sin(r) * 7.2).toFixed(1)}" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>`; }).join('')}`
    : light === 'mezzombra'
      ? `<circle cx="8" cy="8" r="5.5" fill="none" stroke="${c}" stroke-width="1.3"/><path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="${c}"/>`
      : `<circle cx="8" cy="8" r="5.5" fill="#3a3040" stroke="#a8987a" stroke-width="1.3"/>`;
  const s = document.createElement('span');
  s.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 16 16" aria-hidden="true">${body}</svg>`;
  return s.firstChild;
}

// ---- the drawing of a plant ------------------------------------------------------------------------
const PW = 16, PH = 28, K = 6; // the sprite box, and the scale of the drawing canvas
const LEAF = ['#3f6b2a', '#5d8f36', '#86b84a'];
// a seedling: a stem and two (then three) leaves, pixel by pixel
function sprout(ctx, big) {
  const p = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x * K, y * K, K, K); };
  const base = PH - 1, top = base - (big ? 6 : 4);
  for (let y = base; y >= top; y--) p(8, y, LEAF[0]);
  p(7, top, LEAF[1]); p(6, top - 1, LEAF[2]); p(6, top, LEAF[1]); p(5, top - 1, LEAF[1]);
  p(9, top, LEAF[1]); p(10, top - 1, LEAF[2]); p(10, top, LEAF[1]); p(11, top - 1, LEAF[1]);
  if (big) { p(8, top - 1, LEAF[1]); p(8, top - 2, LEAF[2]); p(7, top + 3, LEAF[1]); p(6, top + 2, LEAF[2]); p(9, top + 2, LEAF[1]); }
}
// the plant at its stage: a sprout for steps 0-1, then the sprite growing from the soil up (scaled from the
// bottom, from a little more than half its height to all of it)
export function plantCanvas(id, step) {
  const c = document.createElement('canvas');
  c.width = PW * K; c.height = PH * K;
  const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  const P = GARDEN[id];
  if (!P) return c;
  if (step < 2) { sprout(ctx, step === 1); return c; }
  const art = herbArt(id);
  if (!art) { sprout(ctx, true); return c; }
  const f = Math.min(1, (step - 1) / Math.max(1, P.steps - 1));
  const s = (0.5 + 0.5 * f) * K;
  const w = PW * s, hh = art.height * s;
  ctx.drawImage(art, 0, 0, PW, art.height, Math.round((PW * K - w) / 2), Math.round(PH * K - hh), Math.round(w), Math.round(hh));
  return c;
}

// ---- the screen --------------------------------------------------------------------------------------
export function openGarden({ from = 'world' } = {}) {
  baseCss(); css('ui-garden', CSS);
  return new Promise((resolve) => {
    let closeOverlay = () => {}, popEsc = () => {}, busy = false;
    const lines = {}; // bed index -> { t, bad, key } the last line under it, while the screen is open
    const felt = {}; // bed index -> what her finger found, this time
    const finish = () => { popEsc(); closeOverlay(); resolve(); };
    const sub = h('p'), bedBox = h('div.gd-bed'), thumbs = h('div.gd-thumbs'), pan = h('p.gd-pan');
    const el = h('div.gd', { role: 'dialog', 'aria-label': 'L\'orto' },
      h('div.gd-head', h('h1', {}, 'L\'orto'), sub), bedBox, thumbs,
      h('div.gd-foot', pan, h('button.gd-close', { type: 'button', onclick: () => { snd('tap'); finish(); } }, from === 'table' ? 'Torna al tavolo' : 'Chiudi')));
    // the bed shown large: the first one with a plant
    let cur = Math.max(0, garden().beds.findIndex(Boolean));
    const today = () => todayKey();

    const headline = () => {
      const g = garden(), s = summary(g, today());
      if (!s.planted) { sub.textContent = Object.keys(seeds()).length ? 'Quattro aiuole contro il muro: due al sole, una a mezz\'ombra, una all\'ombra.' : 'Quattro aiuole vuote. I semi si trovano in bottega.'; return; }
      const W = ['', 'Una', 'Due', 'Tre', 'Quattro'];
      sub.textContent = s.check ? `${s.check === 1 ? 'Una pianta' : `${W[s.check]} piante`} da controllare: tocco la terra prima di bagnare.`
        : s.thirsty ? `${s.thirsty === 1 ? 'Una pianta ha' : `${W[s.thirsty]} piante hanno`} sete.`
          : s.ready ? `${s.ready === 1 ? 'Una pianta è pronta' : `${W[s.ready]} piante sono pronte`} da raccogliere.` : 'Per oggi è tutto a posto.';
    };
    const pantryLine = () => {
      const P = pantry(), ids = ORDER.filter((id) => P[id]), S = seeds(), ns = Object.values(S).reduce((a, b) => a + b, 0);
      const list = (O, ks) => ks.flatMap((id, i) => [i ? ' · ' : '', h('b', {}, `${lower(id)} ${O[id]}`)]);
      // once she has dried bunches with Ortica (glue/interests.js), the pantry has two columns: fresh and dried
      const D = state.pantryDry || {}, dry = ORDER.filter((id) => D[id] > 0);
      const hung = (state.interests?.hung || []).reduce((a, b) => a + (Number(b?.n) || 0), 0);
      const parts = state.flags?.['int.ortica.1'] || dry.length || hung
        ? [h('span', {}, 'Fresche: ', ...(ids.length ? list(P, ids) : ['nessuna'])), h('br'), h('span', {}, 'Secche: ', ...(dry.length ? list(D, dry) : ['nessuna'])),
          ...(hung ? [h('br'), h('span', {}, `Sul trave di Ortica: ${hung === 1 ? 'un mazzetto' : `${hung} mazzetti`}.`)] : [])]
        : [ids.length ? h('span', {}, 'In dispensa: ', ...list(P, ids)) : h('span', {}, 'La dispensa è ancora vuota.')];
      if (ns) parts.push(h('br'), h('span', {}, `Da piantare: ${ns} tra piantine e semi.`));
      pan.replaceChildren(...parts);
    };

    const tags = (i, b) => h('div.gd-tags',
      h('span', {}, lightIcon(bedLight(i)), LIGHT[bedLight(i)]),
      h('span', {}, b ? SOIL[b.terra].name.toLowerCase() : 'terra smossa'));

    function drawBed() {
      const i = cur, g = garden(), b = g.beds[i], t = today();
      const L = lines[i];
      const line = h(`p.gd-ln${L?.bad ? '.bad' : ''}`, { role: 'status' }, L?.t || '');
      const plot = h('div.gd-plot', h(`div.gd-soil${b ? `.${b.terra}` : ''}`));
      bedBox.className = 'gd-bed';
      if (!b) {
        plot.append(h('div.gd-empty', {}, 'aiuola vuota'));
        bedBox.replaceChildren(tags(i, null), plot, h('div.gd-nm', {}, ' '),
          h('div.gd-acts', h('button.gd-b.main', { type: 'button', onclick: () => { snd('tap'); pickSeed(i); } }, 'Pianta')), line,
          h('div.gd-why', h('p', {}, bedLight(i) === 'ombra' ? 'Qui il sole non arriva quasi mai: poche erbe ci stanno bene.' : bedLight(i) === 'mezzombra' ? 'Qui il sole batte solo la mattina.' : 'Qui il sole batte quasi tutto il giorno.')));
        return;
      }
      const P = GARDEN[b.herb], ripe = isReady(b);
      bedBox.classList.toggle('wet', looksWet(b, t));
      if (ripe) plot.append(h('div.gd-glow'));
      const pl = plantCanvas(b.herb, b.step); pl.className = 'gd-pl'; pl.setAttribute('aria-hidden', 'true');
      plot.append(pl);
      const dots = h('div.gd-dots', { 'aria-label': `${b.step} passi su ${P.steps}` }, Array.from({ length: P.steps }, (_, k) => h(`i${k < b.step ? '.on' : ''}`)));
      const f = felt[i] || (b.felt === t ? feel(b, t) : null);
      const feelEl = h('p.gd-feel', {}, ripe ? (/o$/.test(NAME(b.herb)) ? 'È pronto da raccogliere.' : 'È pronta da raccogliere.') : f ? h('span', {}, 'La terra: ', h('b', {}, FEEL[f])) : 'Prima di bagnare, tocco la terra.');
      const acts = ripe ? [h('button.gd-b.ripe', { type: 'button', onclick: () => doHarvest(i) }, 'Raccogli')]
        : [h('button.gd-b', { type: 'button', onclick: () => doTouch(i) }, 'Tocca la terra'), h('button.gd-b.main', { type: 'button', onclick: () => doWater(i) }, 'Annaffia')];
      // the lasting advice: the wrong light, the wrong soil, and Ortica's fuller notes once learned
      const lessons = g.lessons || {};
      const lw = lightWhy(b.herb, bedLight(i)), sw = soilWhy(b.herb, b.terra);
      // at most one of Ortica's fuller notes at a time: the one of the line just said, else light, else soil
      const note = (L?.key && lessonNote(L.key, lessons)) || (lw && lessonNote('light', lessons)) || (sw && lessonNote('soil', lessons)) || null;
      const why = [[lw], [sw], [note, 1]].filter((x) => x[0]);
      const free = g.beds.some((x, k) => !x && k !== i);
      bedBox.replaceChildren(...[tags(i, b), plot, h('div.gd-nm', {}, NAME(b.herb), riskTag(b.herb)), dots, feelEl, h('div.gd-acts', acts), line,
        why.length ? h('div.gd-why', why.map(([w, ls]) => h(`p${ls ? '.ls' : ''}`, {}, w))) : null,
        h('div.gd-more', free ? h('button.gd-l', { type: 'button', onclick: () => { snd('tap'); pickBed(i); } }, 'Sposta') : null,
          h('button.gd-l', { type: 'button', onclick: () => { snd('tap'); pickSoil(i, b.herb, b.terra); } }, 'Cambia terra'))].filter(Boolean));
    }
    function drawThumbs() {
      const g = garden();
      thumbs.replaceChildren(...g.beds.map((b, i) => {
        const pic = h('span.pic', {}, b ? plantCanvas(b.herb, b.step) : null);
        return h(`button.gd-th${i === cur ? '.on' : ''}`, { type: 'button', 'aria-label': `Aiuola ${i + 1}, ${LIGHT[bedLight(i)]}${b ? `: ${NAME(b.herb)}` : ', vuota'}`, 'aria-pressed': String(i === cur), onclick: () => { if (i === cur) return; snd('tap'); cur = i; draw(); } },
          b && isReady(b) ? h('i.rp') : null, pic, h('span.nm', {}, b ? NAME(b.herb) : 'vuota'), h('span.lt', {}, lightIcon(bedLight(i), 11), LIGHT[bedLight(i)]));
      }));
    }
    const draw = () => { headline(); drawBed(); drawThumbs(); pantryLine(); };
    const sleep = (ms) => new Promise((r) => setTimeout(r, reducedMotion() ? 0 : ms));
    const plotNow = () => bedBox.querySelector('.gd-plot');

    function doTouch(i) {
      if (busy) return;
      snd('tap');
      felt[i] = touchIn(i);
      lines[i] = null;
      draw();
    }
    async function doWater(i) {
      if (busy) return; busy = true;
      try {
        snd('tap');
        for (const btn of bedBox.querySelectorAll('button')) btn.disabled = true;
        const plot = plotNow();
        if (plot && !reducedMotion()) for (let k = 0; k < 9; k++) plot.append(h('i.gd-drop', { style: { left: `${30 + ((k * 37) % 40)}%`, animationDelay: `${k * 60}ms` } }));
        await sleep(500);
        bedBox.classList.add('wet');
        await sleep(350);
        const r = waterIn(i);
        if (!r) return;
        const id = r.bed.herb;
        felt[i] = null;
        lines[i] = { t: lineFor(r.key, id, { light: bedLight(i) }), bad: r.ok === 'drowned', key: r.key };
        draw();
        const pl = bedBox.querySelector('.gd-pl');
        if (r.grew) {
          snd(r.key === 'ready' ? 'found' : 'star');
          pl?.classList.add('pop');
          const on = bedBox.querySelectorAll('.gd-dots i.on'); on[on.length - 1]?.classList.add('new');
          const p2 = plotNow();
          if (p2 && !reducedMotion()) for (let k = 0; k < 5; k++) p2.append(h('i.gd-spark', { style: { left: `${36 + k * 7}%`, bottom: `${70 + (k % 2) * 30}px`, '--dx': `${(k - 2) * 8}px`, animationDelay: `${k * 60}ms` } }));
        } else if (r.ok === 'drowned') { snd('wrong'); pl?.classList.add('sag'); }
      } finally { busy = false; }
    }
    function doHarvest(i) {
      if (busy) return;
      const r = harvestIn(i);
      if (!r) return;
      snd('coin');
      lines[i] = { t: lineFor('harvest', r.herb), key: 'harvest' };
      draw();
      bedBox.querySelector('.gd-pl')?.classList.add('pop');
    }

    // ---- the small sheets: what to plant, in which soil, where to move it
    function sheet(label, kids) {
      let closeIt = () => {}, pop = () => {};
      const done = () => { pop(); closeIt(); };
      const wrap = h('div.gd-pick', {}, h('div.gd-sheet', { role: 'dialog', 'aria-label': label }, ...kids(done),
        h('div', { style: { textAlign: 'center' } }, h('button.gd-close', { type: 'button', onclick: () => { snd('tap'); done(); } }, 'Non adesso'))));
      wrap.onclick = (e) => { if (e.target === wrap) done(); };
      closeIt = openOverlay(wrap);
      pop = onEscape(done);
      return done;
    }
    function pickSeed(i) {
      const S = seeds(), ids = ORDER.filter((id) => S[id] > 0);
      sheet('Che cosa pianto', (done) => [h('h2', {}, 'Che cosa ci pianto?'),
        ids.length ? h('p', {}, `Questa aiuola è in ${LIGHT[bedLight(i)]}.`) : null,
        ids.length ? h('div.gd-opts', ids.map((id) => h(`button.gd-opt${HERB[id]?.risk === 'velenosa' ? '.poison' : ''}`, { type: 'button', onclick: () => { snd('tap'); done(); pickSoil(i, id, null); } },
          h('span.n', {}, `×${S[id]}`), plantCanvas(id, 99), h('span', {}, NAME(id)), riskTag(id))))
          : h('p.gd-none', {}, 'Non ho più niente da piantare. In bottega vendono i semi delle erbe che conosco, e a volte ne porta uno la luna piena.')]);
    }
    // the soil: when planting (now = null) or to change it (a transplant costs a step)
    function pickSoil(i, id, now) {
      const T = HERB_TEXTS[id]?.coltiva || {};
      sheet('In che terra', (done) => [h('h2', {}, now ? 'In che terra la sposto?' : 'In che terra la metto?'),
        h('p', {}, now ? 'Ogni trapianto le costa un passo.' : `${NAME(id)}, in ${LIGHT[bedLight(i)]}.`),
        h('div.gd-rows', SOILS.map((s) => h('button.gd-row', { type: 'button', disabled: s.id === now, onclick: () => {
          snd('tap'); done();
          if (now) { if (resoilIn(i, s.id)) lines[i] = { t: lineFor('resoil', id, { terra: s.id }), key: 'resoil' }; } else if (plantIn(i, id, s.id)) lines[i] = { t: lineFor('planted', id), key: 'planted' };
          felt[i] = null; cur = i; draw(); bedBox.querySelector('.gd-pl')?.classList.add('pop');
        } }, h('span.gd-sw', { style: { background: SOIL_SWATCH[s.id] } }), h('span', {}, h('b', {}, s.name), h('i', {}, s.id === now ? 'quella di adesso' : s.line))))),
        T.acqua ? h('p.gd-tip', {}, `Nell'erbario, sull'acqua: «${T.acqua}»`) : null]);
    }
    function pickBed(i) {
      const g = garden(), b = g.beds[i];
      sheet('Dove la sposto', (done) => [h('h2', {}, 'Dove la sposto?'), h('p', {}, 'Spostarla non le costa niente: viene via con tutta la sua terra.'),
        h('div.gd-rows', [...Array(BEDS).keys()].filter((k) => k !== i).map((k) => h('button.gd-row', { type: 'button', disabled: !!g.beds[k], onclick: () => {
          snd('tap'); done();
          if (moveIn(i, k)) { lines[k] = { t: lineFor('moved', b.herb, { light: bedLight(k) }), key: 'moved' }; lines[i] = null; felt[k] = felt[i]; felt[i] = null; cur = k; draw(); }
        } }, lightIcon(bedLight(k), 22), h('span', {}, h('b', {}, `Aiuola ${k + 1}, ${LIGHT[bedLight(k)]}`), h('i', {}, g.beds[k] ? `c'è già ${lower(g.beds[k].herb)}` : 'libera')))))]);
    }

    // a long absence: the forgotten plants wilt a step (said under the bed)
    for (const i of settleAll()) lines[i] = { t: lineFor('wilted', garden().beds[i].herb), bad: true, key: 'wilted' };
    closeOverlay = openOverlay(el);
    popEsc = onEscape(finish);
    draw();
    el.dataset.ready = '1';
  });
}
