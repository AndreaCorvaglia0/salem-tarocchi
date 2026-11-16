// The "Mappa" ribbon: the village, the wood and the cellars as ink sketches (sketch.js). Places not
// seen yet stay blank; the next place is circled in red pencil; "× io" marks where I am. With the
// broom, and not in study mode, tapping a seen outdoor place offers "Vola qui" (glue/fly.js decides
// whether she can take off from where she is; if not, the caption says why).
import { h, css, isNarrow } from '../core/dom.js';
import { state } from '../core/state.js';
import { call, has } from '../core/services.js';
import { PENCIL, RED, INK } from './paper.js';
import { REGIONS, REGION_OF, sketch, SKETCH_CSS } from './sketch.js';
import { nextStep, placeOf, isSeen } from './logic.js';
import { test } from '../core/cond.js';
import * as STORY from '../data/story/index.js';
import { extrasShown, extrasDone, extrasTotal, trackedExtra, track, markSeen } from '../core/extras.js';

const CSS = `${SKETCH_CSS}
.mp-reg{margin-top:4px}
.mp-reg+.mp-reg{margin-top:26px}
.mp-reg h3{display:flex;justify-content:space-between;align-items:baseline}
.mp-reg h3 small{font-size:18px;font-weight:400;color:${PENCIL}}
.mp-blank{margin:10px 0 18px!important}
.mp-cap{min-height:56px;margin-top:10px!important;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.mp-cap .nx{color:${RED}}
.mp-ms{margin:6px 0 18px}
.mp-ms h3{display:flex;justify-content:space-between;align-items:baseline}
.mp-ms h3 small{font-size:18px;font-weight:400;color:${PENCIL}}
.mp-m{display:block;width:100%;margin:6px 0 0;padding:6px 8px 6px 30px;position:relative;border:0;border-radius:8px;background:none;color:${INK};font:inherit;font-size:21px;line-height:27px;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mp-m::before{content:'';position:absolute;left:6px;top:11px;width:14px;height:14px;border-radius:50%;border:2px solid ${INK}88}
.mp-m.on::before{border-color:${RED};background:${RED}33;box-shadow:0 0 0 3px ${RED}22}
.mp-m:focus-visible{outline:2px dashed ${RED}}
.mp-m .st{display:block;font-size:17px;line-height:20px;color:${PENCIL}}
.mp-m.on .st{color:${RED}}
.mp-m.sec{color:${PENCIL};font-size:20px;line-height:25px}
.mp-m.sec::before{border-style:dashed;border-color:${PENCIL}aa}
.mp-m.sec .tx{display:block;text-decoration:underline dashed ${PENCIL}99;text-underline-offset:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-m.sec.on .tx,.mp-m.sec.open .tx{white-space:normal}
.mp-m.sec.done .tx{text-decoration:line-through ${PENCIL}88}
.mp-m .lb{display:inline-block;margin-right:8px;padding:0 6px;border:1px solid ${PENCIL}88;border-radius:9px;font-size:15px;line-height:18px;color:${PENCIL};transform:rotate(-2deg)}
.mp-m .nw{display:inline-block;margin-right:8px;padding:0 6px;border-radius:9px;background:${RED};color:#fbf3e2;font-size:15px;line-height:18px;transform:rotate(1.5deg)}

`;

const ALL = Object.values(REGIONS).flatMap((r) => Object.keys(r.places));
// side missions (data/story SIDE, optional): the active ones are pencil notes at their place, not a list.
// Active: its `when` holds and its `done` (if any) does not.
export const sideNotes = (side = STORY.SIDE, t = test) => (Array.isArray(side) ? side : Object.values(side || {}))
  .filter((m) => m && m.note && m.at && t(m.when) && !(m.done != null && t(m.done)))
  .map((m) => ({ place: placeOf(m.at), text: m.note }));

export function mappaPages(ctx) {
  css('ui-mappa', CSS);
  const extra = []; // anchors of the world that the sketch does not draw (interiors) still count as seen
  const seenAnchors = Object.keys(state.stats?.seen || {});
  for (const a of seenAnchors) if (!ALL.includes(a)) extra.push(a);
  const seen = (place) => isSeen(place, state, extra);
  const tracked = ctx.study ? null : trackedExtra();
  const next = placeOf(tracked?.at || nextStep().at);
  let fly = false, why = '';
  const intro = () => h('span.pencil', {}, fly ? 'Tocca un posto per volarci.' : why || (next ? (tracked ? 'Il cerchio rosso: la missione in più che seguo.' : 'Il cerchio rosso: dove devo andare.') : ''));
  const cap = h('p.mp-cap', { role: 'status' }, intro());
  if (!ctx.study && state.powers?.broom && has('fly.check')) {
    Promise.resolve(call('fly.check')).then((c) => { fly = !!c?.ok; why = c?.why || ''; if (!cap.classList.contains('gx-live')) cap.replaceChildren(intro()); }).catch(() => {});
  }
  const landable = (id) => ['village', 'forest'].includes(REGION_OF(id)) && seen(id);
  let here = null;
  const pick = (id, p, btn) => {
    for (const b of document.querySelectorAll('.sk-hit.on')) b.classList.remove('on');
    btn?.classList.add('on');
    cap.classList.add('gx-live');
    const kids = [h('span', {}, `${p.label[0].toUpperCase()}${p.label.slice(1)}.`)];
    if (id === next) kids.push(h('span.nx', {}, tracked ? 'La missione che seguo è qui.' : 'Devo andare qui.'));
    if (id === here) kids.push(h('span.pencil', {}, 'Sono qui.'));
    if (fly && id !== here && landable(id)) kids.push(h('button.gx-btn', { type: 'button', onclick: () => { ctx.close(); call('fly.to', id); } }, 'Vola qui'));
    else if (!fly && why && state.powers?.broom && !ctx.study) kids.push(h('span.pencil', {}, why));
    cap.replaceChildren(...kids);
  };
  const region = (rid, width) => {
    const R = REGIONS[rid], any = Object.keys(R.places).some(seen) || REGION_OF(next) === rid || sideNotes().some((n) => R.places[n.place]);
    const box = h('div.mp-reg', h('h3', {}, R.name, h('small', {}, R.season)));
    if (!any) { box.append(h('p.pencil.mp-blank', {}, 'Non ci sono ancora stata.')); return box; }
    box.append(sketch(rid, { width, seen, next, here, onPick: pick, notes: ctx.study ? [] : sideNotes() }));
    return box;
  };
  // sizes: the page's inner width; on a desktop the right page holds two sketches, so it is height-bound
  const pg = ctx.book.L, phone = isNarrow();
  const innerW = Math.max(240, (pg.clientWidth || 340) - (phone ? 44 : 78));
  const innerH = Math.max(300, (pg.clientHeight || 600) - 70);
  const wL = phone ? innerW : Math.min(innerW, (innerH - 60) / REGIONS.village.ratio);
  const wR = phone ? innerW : Math.min(innerW, (innerH - 120) / (REGIONS.forest.ratio + REGIONS.depths.ratio));
  const L = h('div'), Rr = h('div');
  const ms = ctx.study ? null : missions(ctx, tracked);
  const draw = () => {
    L.replaceChildren(...[h('h2', {}, 'Mappa'), phone ? ms : null, region('village', wL), phone ? null : cap, phone ? null : ms].filter(Boolean));
    Rr.replaceChildren(...[region('forest', wR), region('depths', wR), phone ? cap : null].filter(Boolean));
  };
  draw();
  // where am I: from the world when it runs, else from the saved position
  if (!ctx.study && has('world.where')) {
    Promise.resolve(call('world.where')).then((w) => { const p = placeOf(w?.near); if (p && ALL.includes(p)) { here = p; draw(); } }).catch(() => {});
  }
  return { L: [L], R: [Rr], single: true };
}

// "Missioni": the main mission in ink, then the optional ones in pencil (core/extras.js). Tapping one
// follows it (the red circle and the trail point there); tapping the main one goes back to it.
const STATUS = { active: 'la sto seguendo', new: 'da fare', seen: 'da fare', done: 'fatta' };
function missions(ctx, tracked) {
  const list = extrasShown();
  const main = h('button.mp-m', { type: 'button', class: tracked ? 'mp-m' : 'mp-m on', onclick: () => { track(null); ctx.rerender(); } },
    h('span.st', {}, tracked ? 'la storia: tocca per tornare a seguirla' : 'la storia: la sto seguendo'), nextStep().text);
  const rows = list.map((e) => {
    const on = !!e.tracked, done = e.status === 'done';
    const cls = ['mp-m', 'sec', on ? 'on' : '', done ? 'done' : ''].filter(Boolean).join(' ');
    return h('button', { type: 'button', class: cls, disabled: done, onclick: () => { markSeen(e.id); if (!done) track(e.id); ctx.rerender(); } },
      h('span.st', {}, h('span.lb', {}, 'in più'), e.status === 'new' ? h('span.nw', {}, 'nuova') : null, on ? STATUS.active : STATUS[e.status] || ''),
      h('span.tx', {}, e.text));
  });
  return h('div.mp-ms', h('h3', {}, 'Missioni', h('small', {}, `in più: fatte ${extrasDone()} di ${extrasTotal()}`)), main, ...rows);
}
