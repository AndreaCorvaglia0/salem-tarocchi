// The "Mappa" ribbon: the village, the wood and the cellars as ink sketches (sketch.js). Places not
// seen yet stay blank; the next place is circled in red pencil; a red cross and "io" mark where I really
// stand (world.where through sketchmap.js; inside a building: at its door), and the page opens on that
// region. The optional things are paper slips pinned beside their place, with a card on tap
// (missions/page.js; notes/missions-design.md). With the broom, and not in study mode, tapping a seen
// outdoor place offers "Vola qui" (glue/fly.js decides whether she can take off from where she is; if
// not, the caption says why). Tapping a seen place shows HER notes on it (placenotes.js, data in
// src/data/world/notes.js): «?» and one plain line while she knows nothing of it, then up to three short
// notes; a place with a note she has not read yet has a small pencil dot, once.
import { h, css, isNarrow } from '../core/dom.js';
import { state, save } from '../core/state.js';
import { call, has } from '../core/services.js';
import { PENCIL, RED } from './paper.js';
import { REGIONS, REGION_OF, sketch, SKETCH_CSS } from './sketch.js';
import { ALL_PLACES, hereOf, regionOf, inFog } from './sketchmap.js';
import { nextStep, placeOf, isSeen, provenSeen } from './logic.js';
import { test } from '../core/cond.js';
import { EXTRAS, extrasShown, trackedExtra, track, extraDone } from '../core/extras.js';
import { missionsParts } from './missions/page.js';
import { placeNotes, adoptNotes, freshNotes, readNotes } from './placenotes.js';

const CSS = `${SKETCH_CSS}
.mp-reg{margin-top:4px}
.mp-reg+.mp-reg{margin-top:26px}
.mp-reg h3{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.mp-reg h3 small{font-size:18px;font-weight:400;color:${PENCIL};text-align:right}
.mp-blank{margin:10px 0 18px!important}
.mp-cap{min-height:56px;margin-top:10px!important;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.mp-cap .nx{color:${RED}}
.mp-cap .q{font-size:1.25em;line-height:1}
.mp-nt{flex:1 1 100%;min-width:0;margin:-6px 0 0;padding:0;list-style:none;overflow-wrap:anywhere}
.mp-nt li{position:relative;padding-left:14px;line-height:1.22}
.mp-nt li::before{content:'–';position:absolute;left:0;color:${PENCIL}}
.mp-nt li.nw::before{content:'';top:.5em;left:1px;width:7px;height:7px;border-radius:50%;background:${PENCIL}}
.mp-nt.un li::before{content:none}
.mp-nt.un li{padding-left:0}
.sk-hit .mp-dot{position:absolute;right:6px;top:5px;width:7px;height:7px;border-radius:50%;background:${PENCIL};box-shadow:0 0 0 1.5px #f3e9cf;pointer-events:none}
`;

const ALL = ALL_PLACES;

// A place new on the map (or an anchor added after she walked by) is marked seen when the save proves she
// has been there (logic.js provenSeen): an old save does not show blank where she has certainly been, and
// the broom may land there.
export function adoptSeen(s = state) {
  const seen = s.stats.seen || (s.stats.seen = {});
  let n = 0;
  for (const p of provenSeen(s, { extras: EXTRAS, done: (e) => extraDone(e, s) })) if (!seen[p]) { seen[p] = true; n += 1; }
  if (n) save();
  return n;
}

export function mappaPages(ctx) {
  css('ui-mappa', CSS);
  adoptSeen();
  if (adoptNotes(state, test)) save();
  const extra = []; // anchors of the world that the sketch does not draw (interiors, card spots) still count as seen
  const seenAnchors = Object.keys(state.stats?.seen || {});
  for (const a of seenAnchors) if (!ALL.includes(a)) extra.push(a);
  // a place that shows only from some point on (her garden: `when` in the world's map) stays blank before
  const shows = (place) => { const w = REGIONS[REGION_OF(place)]?.places[place]?.when; return !w || test(w); };
  const seen = (place) => shows(place) && isSeen(place, state, extra);
  const tracked = ctx.study ? null : trackedExtra();
  const main = nextStep();
  const next = placeOf(tracked?.at || main.at);
  // the missions (not in study mode): the box of what she follows, the legend, the done ones, the slips
  const ms = ctx.study ? null : missionsParts(ctx, { items: extrasShown(), main, onTrack: track });
  let fly = false, why = '';
  const intro = () => h('span.pencil', {}, fly ? 'Tocca un posto per volarci.' : why || (next ? (tracked ? 'Il cerchio rosso: la cosa in più che seguo.' : 'Il cerchio rosso: dove devo andare.') : ''));
  const cap = h('p.mp-cap', { role: 'status' }, intro());
  if (!ctx.study && state.powers?.broom && has('fly.check')) {
    Promise.resolve(call('fly.check')).then((c) => { fly = !!c?.ok; why = c?.why || ''; if (!cap.classList.contains('gx-live')) cap.replaceChildren(intro()); }).catch(() => {});
  }
  const landable = (id) => ['village', 'forest'].includes(REGION_OF(id)) && seen(id) && !inFog(id);
  let here = null, where = null;
  const pick = (id, p, btn) => {
    for (const b of document.querySelectorAll('.sk-hit.on')) b.classList.remove('on');
    btn?.classList.add('on');
    cap.classList.add('gx-live');
    // her notes: what she knows of the place, or «?» and one plain line
    const N = placeNotes(id, test), fresh = new Set(freshNotes(state, id, test));
    const name = `${p.label[0].toUpperCase()}${p.label.slice(1)}.`;
    const kids = [N.known || N.named ? h('span', {}, name) : h('span.pencil.q', { 'aria-label': 'Non so che posto è' }, '?')];
    if (id === next) kids.push(h('span.nx', {}, tracked ? 'La cosa in più che seguo è qui.' : 'Devo andare qui.'));
    if (id === here) kids.push(h('span.pencil', {}, 'Sono qui.'));
    if (fly && id !== here && landable(id)) kids.push(h('button.gx-btn', { type: 'button', onclick: () => { ctx.close(); call('fly.to', id); } }, 'Vola qui'));
    else if (!fly && why && state.powers?.broom && !ctx.study) kids.push(h('span.pencil', {}, why));
    const lines = N.known ? N.lines.map((l) => h(fresh.has(l.key) ? 'li.nw' : 'li', {}, l.t)) : N.unknown ? [h('li', {}, N.unknown)] : [];
    if (lines.length) kids.splice(1, 0, h(N.known ? 'ul.mp-nt.pencil' : 'ul.mp-nt.pencil.un', {}, ...lines));
    cap.replaceChildren(...kids);
    if (readNotes(state, id, test)) { save(); btn?.querySelector('.mp-dot')?.remove(); }
  };
  const region = (rid, width) => {
    const R = REGIONS[rid], any = Object.keys(R.places).some(seen) || REGION_OF(next) === rid || !!ms?.hasRegion(rid);
    const box = h('div.mp-reg', h('h3', {}, R.name, ms?.count(rid) ? h('small', {}, ms.count(rid)) : null));
    if (!any) { box.append(h('p.pencil.mp-blank', {}, 'Non ci sono ancora stata.')); return box; }
    const sk = sketch(rid, { width, minWidth: phone ? 330 : 0, seen, next, where: ctx.study ? null : where, onPick: pick, unnamed: ctx.study ? null : (id) => { const N = placeNotes(id, test); return !N.known && !N.named; } });
    box.dataset.region = rid;
    box.append(sk);
    // a pencil dot on a place with a note she has not read yet
    for (const b of sk.querySelectorAll('.sk-hit')) {
      const pid = Object.keys(R.places).find((k) => R.places[k].label === b.getAttribute('aria-label'));
      if (pid && seen(pid) && freshNotes(state, pid, test).length) b.append(h('i.mp-dot'));
    }
    ms?.pin(sk, rid, next);
    return box;
  };
  // sizes: the page's inner width; on a desktop each page is height-bound (the left one also holds the box
  // of what she follows, the legend and the caption)
  const pg = ctx.book.L, phone = isNarrow();
  const innerW = Math.max(240, (pg.clientWidth || 340) - (phone ? 44 : 78));
  const innerH = Math.max(300, (pg.clientHeight || 600) - 70);
  const head = ms ? 250 + (ms.done ? 44 : 0) + (ms.model.tracked ? 70 : 0) : 0;
  const wL = phone ? innerW : Math.min(innerW, Math.max(310, (innerH - 60 - head) / REGIONS.village.ratio));
  const wR = phone ? innerW : Math.min(innerW, (innerH - 120) / (REGIONS.forest.ratio + REGIONS.depths.ratio));
  const L = h('div'), Rr = h('div');
  const draw = () => {
    L.replaceChildren(...[h('h2', {}, 'Mappa'), ms?.top, ms?.legend, ms?.done, region('village', wL), phone ? null : cap].filter(Boolean));
    Rr.replaceChildren(...[region('forest', wR), region('depths', wR), phone ? cap : null].filter(Boolean));
  };
  draw();
  // where am I: from the world (its position when it runs, else the saved one); the page opens on my region
  if (!ctx.study && has('world.where')) {
    Promise.resolve(call('world.where')).then((w) => {
      if (!w?.map) return;
      where = w; here = hereOf(w); draw();
      const rid = regionOf(w);
      if (phone && rid) requestAnimationFrame(() => [L, Rr].map((el) => el.querySelector(`.mp-reg[data-region="${rid}"]`)).find(Boolean)?.scrollIntoView({ block: 'start' }));
    }).catch(() => {});
  }
  return { L: [L], R: [Rr], single: true };
}
