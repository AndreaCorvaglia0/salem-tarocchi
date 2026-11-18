// Edera's stones (notes/interessi/PROGETTO.md §4): two screens and one row of the album.
//   openCourage({ mine, lent })   mission 2: her stones on Edera's handkerchief (and Edera's own when none of
//                                 hers gives courage); she taps one, Edera says what it is for; the right one
//                                 goes to the constable -> { ok: true, stone, lent: bool } | { ok: false }
//   openLabels({ shelf, names })  mission 3: four stones on Edera's shelf with blank labels and six names; she
//                                 taps a stone, then a name, and the name is written under it
//                                 -> { ok: true, tries } | { ok: false }
//   pocketRow({ id, ... })        level 1: the «In tasca» section of a stone's album page (ui/collect.js asks
//                                 the service stones.pocket, glue/interests.edera.js builds it with this)
// Presentation only: the right stone and the right name come from glue/interests.edera.rules.js.
import { h, css } from '../../core/dom.js';
import { call } from '../../core/services.js';
import { COURAGE, LABELS, POCKET } from '../../data/interests/edera.js';
import { STONE } from '../../data/stones.js';
import { courageLine, labelOk, labelWhy } from '../../glue/interests.edera.rules.js';
import { stoneSrc } from '../collect.js';
import { frame } from './common.js';
import { HAND, GOLD, INK, PENCIL } from '../paper.js';

const snd = (n) => { try { call('sound.play', n); } catch { /* no sound here */ } };
const CSS = `
.st-cloth{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px 10px;background:repeating-linear-gradient(45deg,#e9dcc0 0 10px,#e2d3b2 10px 20px);border-radius:8px}
.st-pick{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;min-height:104px;padding:6px 2px 4px;border:1px solid #b9a98a;border-radius:8px;background:#fbf5e6cc;color:${INK};font:17px/19px ${HAND};cursor:pointer;-webkit-tap-highlight-color:transparent}
.st-pick img{width:62px;height:62px;object-fit:contain;border-radius:4px;background:#f4ecd6}
.st-pick img.px{image-rendering:pixelated;padding:6px;box-sizing:border-box}
.st-pick .who{font:14px/15px ${HAND};color:${PENCIL}}
.st-pick:hover,.st-pick:focus-visible{border-color:${GOLD};outline:none}
.st-pick.on{border-color:${GOLD};box-shadow:0 0 0 2px ${GOLD}}
.st-pick.no{opacity:.45}
.st-pick.shake img{animation:it-shake .5s}
.st-shelf{padding:14px 8px 8px;background:linear-gradient(#2a1a10,#1b120c)}
.st-row{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;align-items:end}
.st-slot{display:flex;flex-direction:column;align-items:center;gap:6px;padding:0;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent}
.st-slot img{width:70px;height:70px;object-fit:contain;border-radius:4px;background:#f4ecd6;border:2px solid transparent;box-sizing:border-box}
.st-slot img.px{image-rendering:pixelated;padding:7px}
.st-slot.on img{border-color:${GOLD};box-shadow:0 0 12px #e6c26a88}
.st-slot.shake img{animation:it-shake .5s}
.st-tag{display:flex;align-items:center;justify-content:center;width:100%;min-height:40px;padding:2px 3px;box-sizing:border-box;background:#f6efdc;border:1px solid #8a7a5a;border-radius:2px;color:${INK};font:16px/16px ${HAND};text-align:center;box-shadow:0 2px 3px #0006}
.st-tag.blank{color:transparent}
.st-tag.ink{animation:st-ink .6s ease-out}
@keyframes st-ink{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
.st-plank{height:10px;margin-top:6px;border-radius:2px;background:linear-gradient(#8a5a32,#5c3a1e);box-shadow:0 5px 8px #0008}
.st-names{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.st-names .it-b{font:19px/21px ${HAND}}
.it-b.used{text-decoration:line-through;opacity:.4}
.st-pocket{margin-top:12px}
.st-pocket h3{margin:0 0 2px}
.st-pocket p{margin:0}
.st-pocket .gx-btn{margin-top:6px}
`;
const pic = (id) => { const p = stoneSrc(id); return h(p.px ? 'img.px' : 'img', { src: p.src, alt: '' }); };
const nm = (id) => STONE[id]?.name || id;

// ---- mission 2: the stone for the constable ------------------------------------------------------------------
export function openCourage({ mine = [], lent = [] } = {}) {
  css('ui-interests-stones', CSS);
  const F = frame({ title: COURAGE.title, closeText: COURAGE.close, who: COURAGE.who });
  F.sub.textContent = COURAGE.pick;
  const tried = new Set();
  let chosen = null;
  const items = [...mine.map((id) => ({ id, lent: false })), ...lent.map((id) => ({ id, lent: true }))];
  function draw() {
    const cloth = h('div.st-cloth', items.map((it) => {
      const b = h(`button.st-pick${chosen === it ? '.on' : ''}${tried.has(it.id) && chosen !== it ? '.no' : ''}`, { type: 'button', 'aria-label': nm(it.id) },
        pic(it.id), h('span', {}, nm(it.id)), h('span.who', {}, it.lent ? COURAGE.hers : COURAGE.mine));
      b.onclick = () => {
        if (chosen) return;
        snd('tap');
        const r = courageLine(it.id);
        tried.add(it.id);
        if (r.ok) { chosen = it; F.say.say(r.line); draw(); return; }
        F.say.say(r.line, true);
        draw();
        const again = F.stage.querySelector(`[aria-label="${nm(it.id)}"]`);
        if (again) { again.classList.remove('shake'); void again.offsetWidth; again.classList.add('shake'); }
      };
      return b;
    }));
    F.stage.replaceChildren(cloth);
    const note = lent.length ? [h('p.it-note', {}, COURAGE.lent)] : [];
    if (chosen) {
      const ok = h('button.it-b.main', { type: 'button' }, COURAGE.done);
      ok.onclick = () => { snd('tap'); F.done({ ok: true, stone: chosen.id, lent: chosen.lent, tries: tried.size }); };
      F.body.replaceChildren(ok);
      F.foot.hidden = true;
    } else F.body.replaceChildren(...note);
  }
  draw();
  return F.result;
}

// ---- mission 3: the labels ------------------------------------------------------------------------------------
export function openLabels({ shelf = [], names = [] } = {}) {
  css('ui-interests-stones', CSS);
  const F = frame({ title: LABELS.title, closeText: LABELS.close, who: null });
  const written = {}; // stone -> name
  let sel = null, tries = 0;
  const left = () => shelf.filter((id) => !written[id]);
  function draw(inked = null) {
    F.sub.textContent = !left().length ? '' : sel ? LABELS.name : LABELS.pick;
    const row = h('div.st-row', shelf.map((id) => {
      const b = h(`button.st-slot${sel === id ? '.on' : ''}`, { type: 'button', 'aria-label': written[id] ? nm(id) : 'una pietra senza nome', disabled: !!written[id] },
        pic(id), h(`span.st-tag${written[id] ? (inked === id ? '.ink' : '') : '.blank'}`, {}, written[id] ? nm(id) : '·'));
      b.dataset.stone = id;
      b.onclick = () => { if (written[id]) return; snd('tap'); sel = sel === id ? null : id; draw(); };
      return b;
    }));
    F.stage.replaceChildren(h('div.st-shelf', row, h('div.st-plank')));
    if (!left().length) {
      const ok = h('button.it-b.main', { type: 'button' }, LABELS.done);
      ok.onclick = () => { snd('tap'); F.done({ ok: true, tries }); };
      F.body.replaceChildren(ok);
      F.foot.hidden = true;
      return;
    }
    const used = new Set(Object.values(written));
    F.body.replaceChildren(h('div.st-names', names.map((n) => {
      const b = h(`button.it-b${used.has(n) ? '.used' : ''}`, { type: 'button', disabled: used.has(n) || !sel }, nm(n));
      b.onclick = () => {
        if (!sel || used.has(n)) return;
        tries += 1; snd('tap');
        if (labelOk(sel, n)) { written[sel] = n; const id = sel; sel = null; F.say.say(''); draw(id); return; }
        F.say.say(labelWhy(sel, n), true);
        const slot = F.stage.querySelector(`[data-stone="${sel}"]`);
        if (slot) { slot.classList.remove('shake'); void slot.offsetWidth; slot.classList.add('shake'); }
      };
      return b;
    })));
  }
  draw();
  return F.result;
}

// ---- level 1: the pocket, on a stone's album page -----------------------------------------------------------
// { id, inPocket, lent, other, onPut, onTake } -> the section (h3 «In tasca», a line, a button), or null
export function pocketRow({ id, inPocket = false, lent = false, other = null, onPut, onTake }) {
  css('ui-interests-stones', CSS);
  if (lent) return h('div.st-pocket', h('h3', {}, POCKET.head), h('p', {}, POCKET.lent));
  const line = inPocket ? POCKET.isIn : other ? `${POCKET.one} Adesso ho in tasca: ${nm(other).toLowerCase()}.` : POCKET.one;
  const b = h('button.gx-btn', { type: 'button' }, inPocket ? POCKET.back : POCKET.put);
  b.onclick = () => { snd('tap'); (inPocket ? onTake : onPut)?.(id); };
  return h('div.st-pocket', h('h3', {}, POCKET.head), h('p', {}, line), b);
}
