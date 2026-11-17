// The missions ON the grimoire's map (notes/missions-design.md, variant A): every optional thing someone
// told her about is a small paper slip pinned beside its place, with a pencil symbol of its kind
// (symbols.js); the main story is an ink star slip; the red circle is the one thing she follows. Tapping a
// slip opens its card: the title, the kind only if she knows it, who told her, where, what she was told (as
// she would note it), sometimes a line of presentiment, «Seguila». Never what she gets (titles.js).
// What is where comes from model.js (pure); this file draws it. mappa.js builds the page and calls:
//   missionsParts(ctx, { items, main, onTrack }) -> { top, legend, done, count(rid), pin(sk, rid, next), hasRegion(rid) }
// Two things at one place: two slips side by side and «due qui»; three or more: a small stack («tre qui»)
// that opens a card with one line each (a row of three did not fit beside a place on a phone).
import { h, css } from '../../core/dom.js';
import { state, save } from '../../core/state.js';
import { markSeen } from '../../core/extras.js';
import { PENCIL, RED, INK, HAND } from '../paper.js';
import { REGIONS, REGION_OF } from '../sketch.js';
import { placeOf } from '../sketchmap.js';
import { onEscape } from '../book.js';
import { cardOf, toldNow } from './titles.js';
import { test } from '../../core/cond.js';
import { symbol } from './symbols.js';
import { ackDone, missionsModel, regionCount, doneLine, hereCount, inWords, STACK } from './model.js';
import { placePins } from './pins.js';

const SLIP = 32;
const CSS = `
.ms-top{margin:8px 0 6px;padding:10px 12px 12px;border:1.5px solid ${INK}55;border-radius:10px;background:#f6edd6aa}
.ms-top .k{display:flex;align-items:center;gap:8px;font-size:18px;line-height:22px;color:${RED}}
.ms-top .k i{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid ${RED};background:${RED}22;flex:none}
.ms-top .t{display:block;margin-top:2px;font-size:21px;line-height:27px;color:${INK}}
.ms-top .w{display:block;font-size:17px;line-height:21px;color:${PENCIL}}
.ms-back{display:flex;align-items:flex-start;gap:8px;width:100%;margin-top:10px;padding:8px 8px 6px;border:1px dashed ${INK}66;border-radius:8px;background:none;font:inherit;font-size:19px;line-height:24px;color:${INK};text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}
.ms-back svg{flex:none;margin-top:1px}
.ms-back b{display:block;font-weight:400;color:${RED};font-size:17px;line-height:21px}
.ms-lg{display:flex;flex-wrap:wrap;gap:4px 14px;margin:4px 2px 2px!important;font-size:17px;line-height:22px;color:${PENCIL}}
.ms-lg span{display:inline-flex;align-items:center;gap:5px}
.ms-lg .ms-slip{width:22px;height:22px;transform:rotate(-4deg);cursor:default}
.ms-lg .ms-slip::after{display:none}
.ms-lg .ring{display:inline-block;width:15px;height:13px;border:2px solid ${RED};border-radius:50%}
.ms-done{display:block;margin:2px 0 0;padding:6px 2px;min-height:44px;border:0;background:none;font:inherit;font-size:18px;line-height:24px;color:${PENCIL};text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}
.ms-done i{display:inline-block;font-style:normal;transition:transform .15s}
.ms-done[aria-expanded=true] i{transform:rotate(90deg)}
.ms-dl{margin:0 0 2px 12px!important;font-size:17px;line-height:22px;color:${PENCIL}}
.ms-dl s{text-decoration:line-through ${PENCIL}88;color:${INK}bb}
.ms-dls[hidden]{display:none}
.ms-pin{position:absolute;z-index:2;display:flex;flex-direction:column;align-items:center;visibility:hidden;pointer-events:none}
.ms-pin.ok{visibility:visible}
.ms-row{display:flex;gap:12px}
.ms-cap{font:15px/15px ${HAND};color:${PENCIL};margin-top:3px;white-space:nowrap;padding:0 3px;border-radius:5px;background:#ede2c5d0}
.ms-strings{position:absolute;left:0;top:0;pointer-events:none;z-index:1;overflow:visible}
.ms-slip{position:relative;display:flex;align-items:center;justify-content:center;width:${SLIP}px;height:${SLIP}px;flex:none;box-sizing:border-box;padding:0;border:1.2px solid ${PENCIL}aa;border-radius:3px;background:#fbf5e3;box-shadow:1px 2px 0 #00000022;transform:rotate(-5deg);cursor:pointer;pointer-events:auto;-webkit-tap-highlight-color:transparent}
.ms-row .ms-slip:nth-child(2n){transform:rotate(4deg)}
.ms-slip::before{content:'';position:absolute;left:50%;top:-4px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:${PENCIL}}
.ms-slip::after{content:'';position:absolute;inset:-7px -6px}
.ms-slip.main{border:1.6px solid ${INK};background:#fff8e6}
.ms-slip.main::before{background:${INK}}
.ms-slip.on{border:2px solid ${RED};box-shadow:0 0 0 2px ${RED}33,1px 2px 0 #00000022}
.ms-slip.on::before{background:${RED}}
.ms-slip.nw{background:#fffdf6;box-shadow:0 0 0 1.5px #fffdf6,1px 2px 0 #00000022}
.ms-slip.nw .dot{position:absolute;right:2px;top:2px;width:5px;height:5px;border-radius:50%;background:${INK}}
.ms-slip.done{opacity:.6;border-style:dashed}
.ms-stack{position:relative;width:${SLIP + 12}px;height:${SLIP + 8}px;flex:none;padding:0;border:0;background:none;cursor:pointer;pointer-events:auto;-webkit-tap-highlight-color:transparent}
.ms-stack::after{content:'';position:absolute;inset:-4px 0}
.ms-stack .ms-slip{position:absolute;pointer-events:none}
.ms-stack .ms-slip:nth-child(1){left:0;top:8px;transform:rotate(-9deg)}
.ms-stack .ms-slip:nth-child(2){left:6px;top:4px;transform:rotate(3deg)}
.ms-stack .ms-slip:nth-child(3){left:12px;top:0;transform:rotate(-4deg)}
.ms-stack:focus-visible{outline:2px dashed ${RED}}
.ms-card .pick{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;margin:0 0 6px;padding:6px 8px;border:0;border-bottom:1px dashed ${PENCIL}66;background:none;font:inherit;text-align:left;color:${INK};cursor:pointer;-webkit-tap-highlight-color:transparent}
.ms-card .pick .ms-slip{cursor:pointer}
.ms-card .pick .ms-slip::after{display:none}
.ms-card .pick b{display:block;font-weight:400;font-size:22px;line-height:25px}
.ms-card .pick small{display:block;font-size:17px;line-height:19px;color:${PENCIL}}
.ms-card .pick.on b{color:${RED}}
.ms-slip:focus-visible{outline:2px dashed ${RED}}
.ms-veil{position:fixed;inset:0;z-index:60;background:#0b0d1866;display:flex;align-items:flex-end;justify-content:center}
.ms-card{font-family:${HAND};width:min(420px,100%);max-height:calc(100% - 20px);overflow:auto;box-sizing:border-box;margin:0 8px 10px;padding:16px 18px 18px;border-radius:12px;background:#f3e9cf;color:${INK};box-shadow:0 -4px 24px #0006;transform:rotate(-.4deg)}
.ms-card .kd{display:flex;align-items:center;gap:8px;font-size:18px;line-height:22px;color:${PENCIL}}
.ms-card .kd .ms-slip{cursor:default}
.ms-card .kd .ms-slip::after{display:none}
.ms-card h4{margin:4px 0 8px;font-size:27px;line-height:32px;font-weight:700;color:${INK}}
.ms-card dl{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;margin:0 0 10px;font-size:21px;line-height:25px}
.ms-card dt{color:${PENCIL}}
.ms-card dd{margin:0}
.ms-card .hn{margin:-6px 0 14px;font-size:19px;line-height:24px;font-style:italic;color:${PENCIL}}
.ms-card blockquote{margin:0 0 14px;padding:8px 10px;border-left:2px solid ${PENCIL}88;font-size:20px;line-height:25px;color:${INK}dd;background:#ffffff40}
.ms-card .bt{display:flex;gap:10px 14px;flex-wrap:wrap;align-items:flex-start}
.ms-card .bt button{min-height:46px;padding:0 18px;border-radius:10px;font:inherit;font-size:22px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.ms-card .go{display:flex;flex-direction:column;align-items:flex-start}
.ms-card .go button{border:2px solid ${RED};background:${RED};color:#fbf3e2}
.ms-card .go small{margin-top:3px;font-size:17px;line-height:19px;color:${PENCIL}}
.ms-card .on{display:flex;align-items:center;gap:8px;min-height:46px;font-size:22px;color:${RED}}
.ms-card .on i{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid ${RED};background:${RED}22}
.ms-card .no{border:1.5px solid ${INK}77;background:none;color:${INK}}
`;

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const placeLabel = (place) => REGIONS[REGION_OF(place)]?.places[place]?.label || '';
const regionWord = (place) => ({ village: 'nel villaggio', forest: 'nel bosco', depths: 'nelle cantine' })[REGION_OF(place)] || '';
const whereText = (place) => [placeLabel(place), regionWord(place)].filter(Boolean).join(', ');
// numbers in the story's own text as words (Caveat's 7 reads as «?», the serif's 11 as «II»); 1 and
// numbers above 99 stay digits («uno» would not agree with «una carta»)
const nums = (text) => String(text || '').replace(/\b(\d{1,2})\b/g, (m, d) => (+d > 1 ? inWords(+d) : m));

export function slip(s, { onclick = null, size = 0 } = {}) {
  const cls = ['ms-slip', s.main ? 'main' : '', s.on ? 'on' : '', s.isNew ? 'nw' : '', s.done ? 'done' : ''].filter(Boolean).join(' ');
  const el = h(onclick ? 'button' : 'span', { class: cls, ...(onclick ? { type: 'button', 'aria-label': s.label || '' } : {}) });
  if (size) Object.assign(el.style, { width: `${size}px`, height: `${size}px` });
  el.append(symbol(s.done ? 'fatta' : s.sym, { size: size ? size - 8 : 22, color: s.main ? INK : s.on ? RED : '#4f473c', fill: s.main ? `${INK}22` : 'none', width: s.main ? 1.6 : 1.7 }));
  if (s.isNew) el.append(h('i.dot'));
  if (onclick) el.onclick = (e) => { e.stopPropagation(); onclick(e.currentTarget); };
  return el;
}

// the card of one optional thing, over the page; closes with «Chiudi», a tap outside, or Escape
export function openCard(e, { onTrack }) {
  const c = cardOf(e), place = placeOf(e.at), done = e.status === 'done';
  const veil = h('div.ms-veil', { role: 'dialog', 'aria-label': c.title });
  let popEsc = () => {};
  const shut = () => { popEsc(); veil.remove(); };
  veil.onclick = (ev) => { if (ev.target === veil) shut(); };
  let act = [];
  if (!done && e.tracked) act = [h('span.on', {}, h('i'), 'La sto seguendo'), h('button.no', { type: 'button', onclick: () => { shut(); onTrack(null); } }, 'Torna alla storia')];
  else if (!done) act = [h('div.go', {}, h('button', { type: 'button', onclick: () => { shut(); onTrack(e.id); } }, 'Seguila'), h('small', {}, 'il cerchio rosso si sposta qui'))];
  const rows = [
    ['Chi me l\'ha detto', c.who ? cap(c.who) : 'L\'ho notato io'],
    ['Dove', whereText(place) || '—'],
  ];
  const kd = done ? (c.kindWord ? `${c.kindWord}, fatta` : 'fatta') : c.kindWord;
  veil.append(h('div.ms-card',
    h('div.kd', {}, slip({ sym: c.sym, done }), kd ? h('span', {}, kd) : null),
    h('h4', {}, c.title),
    h('dl', {}, ...rows.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
    h('blockquote', {}, nums(toldNow(c, test) || e.text)),
    c.hunch && !done ? h('p.hn', {}, c.hunch) : null,
    h('div.bt', {}, ...act, h('button.no', { type: 'button', onclick: shut }, 'Chiudi'))));
  document.body.append(veil);
  popEsc = onEscape(shut);
  return veil;
}

// three or more things at one place are a small stack on the map; a tap on it opens this card, one line each
export function openChooser(place, slips, { open }) {
  const veil = h('div.ms-veil', { role: 'dialog', 'aria-label': `${hereCount(slips.length)}: ${placeLabel(place)}` });
  let popEsc = () => {};
  const shut = () => { popEsc(); veil.remove(); };
  veil.onclick = (ev) => { if (ev.target === veil) shut(); };
  veil.append(h('div.ms-card',
    h('div.kd', {}, h('span', {}, `${inWords(slips.length, { fem: true })} cose in più, qui`)),
    h('h4', {}, cap(whereText(place))),
    ...slips.map((s) => h('button', { type: 'button', class: `pick${s.on ? ' on' : ''}`, onclick: () => { shut(); open(s.id); } }, slip(s), h('span', {}, h('b', {}, s.title), h('small', {}, [s.kindWord, s.on ? 'la sto seguendo' : ''].filter(Boolean).join(': ') || (s.who ? `me l'ha detto ${s.who}` : 'l\'ho notato io'))))),
    h('div.bt', {}, h('button.no', { type: 'button', onclick: shut }, 'Chiudi'))));
  document.body.append(veil);
  popEsc = onEscape(shut);
  return veil;
}

// per opening of the grimoire (ctx): the things just done, and whether the done list is unfolded
const SESSION = new WeakMap();

export function missionsParts(ctx, { items = [], main = { text: '', at: null }, onTrack = () => {} } = {}) {
  css('ui-missions', CSS);
  let ses = SESSION.get(ctx);
  if (!ses) { const a = ackDone(state, items); if (a.dirty) save(); ses = { fresh: a.fresh, open: false }; SESSION.set(ctx, ses); }
  const M = missionsModel({ items, main, fresh: ses.fresh });
  const byId = Object.fromEntries(items.map((e) => [e.id, e]));
  const follow = (id) => { onTrack(id); ctx.rerender?.(); };
  const card = (id, btn) => {
    const e = byId[id]; if (!e) return;
    if (e.status === 'new') { markSeen(id); btn?.classList.remove('nw'); btn?.querySelector('.dot')?.remove(); }
    openCard(e, { onTrack: follow });
  };
  // what she follows, at the top
  const top = h('div.ms-top');
  if (!M.tracked) {
    top.append(h('span.k', {}, h('i'), 'Sto seguendo la storia'), h('span.t', {}, nums(main.text)), M.mainPlace ? h('span.w', {}, whereText(M.mainPlace)) : null);
  } else {
    const c = cardOf(M.tracked), p = placeOf(M.tracked.at);
    top.append(h('span.k', {}, h('i'), c.kindWord ? `Sto seguendo ${c.kindWord}` : 'Sto seguendo'), h('span.t', {}, c.title), h('span.w', {}, whereText(p)));
    top.append(h('button.ms-back', { type: 'button', onclick: () => follow(null) }, symbol('storiaMain', { size: 22, color: INK, fill: `${INK}22` }),
      h('span', {}, h('b', {}, 'La storia: tocca per tornare a seguirla'), nums(main.text))));
  }
  const legend = h('p.ms-lg', {},
    h('span', {}, slip({ main: true, sym: 'storiaMain' }, { size: 22 }), 'la storia'),
    h('span', {}, slip({ sym: 'nota' }, { size: 22 }), 'cose in più: toccane una per leggerla'),
    h('span', {}, h('i.ring'), 'quella che seguo'));
  // the done ones: folded under one line, unfolding a compact list (title and place)
  let done = null;
  if (M.done.length) {
    const list = h('div.ms-dls', { hidden: !ses.open }, ...M.done.map((d) => h('p.ms-dl', {}, h('s', {}, d.title), d.place ? ` · ${placeLabel(d.place)}` : '')));
    const btn = h('button.ms-done', { type: 'button', 'aria-expanded': String(ses.open), onclick: () => { ses.open = !ses.open; list.hidden = !ses.open; btn.setAttribute('aria-expanded', String(ses.open)); } }, `${doneLine(M.done.length)} `, h('i', {}, '›'));
    done = h('div', {}, btn, list);
  }
  // the slips of one region onto its sketch (called by mappa.js after sketch())
  const pin = (sk, rid, next = null) => {
    const R = REGIONS[rid], W = parseFloat(sk.style.width);
    const pos = (place) => { const b = [...sk.querySelectorAll('.sk-hit')].find((x) => x.getAttribute('aria-label') === R.places[place]?.label); return b ? [parseFloat(b.style.left), parseFloat(b.style.top)] : [W / 2, 40]; };
    let any = false;
    for (const g of M.pins) {
      if (g.region !== rid || !R.places[g.place]) continue;
      const one = (s) => {
        const label = s.main ? `la storia: ${main.text}` : s.done ? `${s.title}: fatta` : (s.kindWord ? `${s.kindWord}: ${s.title}` : s.title);
        const onclick = s.main ? () => { if (M.tracked) follow(null); } : (btn) => card(s.id, btn);
        return slip({ ...s, label }, { onclick });
      };
      const opt = g.slips.filter((s) => !s.main && !s.done);
      let cells = g.slips.map(one);
      if (!g.done && opt.length >= STACK) {
        // the followed one on top, then the new ones
        const pile = [...opt].sort((a, b) => (a.on - b.on) || (a.isNew - b.isNew));
        const st = h('button.ms-stack', { type: 'button', 'aria-label': `${hereCount(opt.length)}: ${opt.map((s) => s.title).join(', ')}`,
          onclick: (ev) => { ev.stopPropagation(); openChooser(g.place, pile.slice().reverse(), { open: (id) => card(id, null) }); } },
        ...pile.slice(-3).map((s) => slip(s)));
        cells = [...g.slips.filter((s) => s.main).map(one), st];
      }
      const capText = g.done ? (g.slips.length > 1 ? `${hereCount(g.slips.length).replace(' qui', '')} fatte` : 'fatta') : hereCount(g.count);
      const [x, y] = pos(g.place);
      sk.append(h('div.ms-pin', { 'data-x': x, 'data-y': y, 'data-place': g.place, 'data-key': g.key }, h('div.ms-row', {}, ...cells), capText ? h('span.ms-cap', {}, capText) : null));
      any = true;
    }
    if (any) requestAnimationFrame(() => placePins(sk, { next: R.places[next]?.label || null }));
  };
  return {
    top, legend, done, pin,
    count: (rid) => regionCount(M.perRegion[rid] || 0),
    hasRegion: (rid) => M.pins.some((g) => g.region === rid) || REGION_OF(M.mainPlace) === rid,
    model: M,
  };
}
