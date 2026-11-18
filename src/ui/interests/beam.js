// Ortica's beam (notes/interessi/PROGETTO.md §11, mission 1): her fresh bunches at the bottom, tap one and it
// hangs from the beam upside down (tap it on the beam to take it back); Ortica lends what she lacks to make
// three; then three places to hang them. A wrong place is answered by Ortica with what would happen, and she
// chooses again. The tied sage (mission 3) is here too: tap or turn the finger round it to wrap the string.
// Presentation only: the glue (glue/interests.js) applies the result.
//   openBeam({ pantry }) -> { ok, mine: [herb ids], lent, place } | { ok: false }
//   openBundle({ own }) -> { ok } | { ok: false }
import { h, css } from '../../core/dom.js';
import { call } from '../../core/services.js';
import { BEAM, HANG, BUNDLE } from '../../data/interests/ortica.js';
import { freshList, dryOk } from '../../glue/interests.rules.js';
import { frame, herbCanvas, lower, dots, turns } from './common.js';
import { HAND } from '../paper.js';

const snd = (n) => { try { call('sound.play', n); } catch { /* no sound here */ } };
const CSS = `
.bm{position:relative;height:196px}
.bm-wood{position:absolute;left:-6px;right:-6px;top:26px;height:20px;background:repeating-linear-gradient(90deg,#6b4423 0 22px,#5c3a1e 22px 26px,#74492a 26px 60px),#6b4423;border-top:2px solid #8a5a32;border-bottom:3px solid #2a170c;box-shadow:0 6px 10px #0008}
.bm-hooks{position:absolute;left:0;right:0;top:46px;display:flex;justify-content:space-around;padding:0 24px}
.bm-slot{position:relative;display:flex;flex-direction:column;align-items:center;width:88px;min-height:140px;border:0;background:none;color:#e9dcc0;font:16px/18px ${HAND};cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}
.bm-slot::before{content:'';width:2px;height:16px;background:#c9b48a}
.bm-slot .tie{width:16px;height:5px;margin-top:-1px;border-radius:2px;background:#c9b48a}
.bm-slot.empty::after{content:'';width:34px;height:70px;margin-top:4px;border:2px dashed #7a5a3a;border-radius:6px}
.bm-slot .who{margin-top:4px;font:15px/17px ${HAND};color:#b9a98a}
.bm-slot canvas{transform-origin:50% 0;margin-top:-1px}
.bm.hung .bm-slot canvas{animation:it-sway 2.8s ease-in-out infinite}
.bm.shake .bm-slot canvas{animation:it-shake .5s}
.bm-sun,.bm-fire{position:absolute;bottom:10px;font:15px ${HAND};color:#b9a98a}
.bd{position:relative;height:210px;display:flex;align-items:center;justify-content:center}
.bd-bunch{position:relative;width:150px;height:200px;border-radius:50%;touch-action:none}
.bd-bunch svg{position:absolute;inset:0;width:100%;height:100%}
.bd-bunch canvas{position:relative;z-index:1}
.bd-wrap{position:absolute;z-index:2;left:52px;right:52px;height:5px;border-radius:3px;background:#d9c28e;box-shadow:0 1px 0 #3a2410}
`;

// ---- the beam ---------------------------------------------------------------------------------------------
export function openBeam({ pantry = {} } = {}) {
  css('ui-interests-beam', CSS);
  const F = frame({ title: BEAM.title, closeText: BEAM.close });
  const all = freshList(pantry);
  const have = {}; for (const id of all) have[id] = (have[id] || 0) + 1;
  const need = Math.min(3, all.length), lent = 3 - need;
  const picked = []; // her herb ids on the beam
  let phase = 'pick', place = null;

  const beam = h('div.bm'), slots = h('div.bm-hooks');
  beam.append(h('div.bm-wood'), slots);
  F.stage.append(beam);

  const left = (id) => have[id] - picked.filter((x) => x === id).length;
  function drawBeam() {
    slots.replaceChildren();
    for (let i = 0; i < 3; i++) {
      const id = picked[i];
      if (id) {
        const b = h('button.bm-slot', { type: 'button', 'aria-label': `Togli ${lower(id)}`, disabled: phase !== 'pick' }, h('span.tie'), herbCanvas(id, 3, { flip: true }), h('span.who', {}, lower(id)));
        b.onclick = () => { if (phase !== 'pick') return; snd('tap'); picked.splice(i, 1); draw(); };
        slots.append(b);
      } else if (i >= need) {
        slots.append(h('div.bm-slot', h('span.tie'), herbCanvas(['rosmarino', 'timo', 'lavanda'][i % 3], 3, { flip: true }), h('span.who', {}, BEAM.hers)));
      } else slots.append(h('div.bm-slot.empty'));
    }
  }
  function drawPick() {
    F.sub.textContent = BEAM.pick;
    const ids = [...new Set(all)];
    const chips = h('div.it-chips', ids.map((id) => {
      const c = h('button.it-chip', { type: 'button', disabled: left(id) <= 0 || picked.length >= need }, h('span.n', {}, String(left(id))), herbCanvas(id, 2), h('span', {}, lower(id)));
      c.onclick = () => { if (picked.length >= need || left(id) <= 0) return; snd('tap'); picked.push(id); draw(); };
      return c;
    }));
    const go = h('button.it-b.main', { type: 'button', disabled: picked.length < need }, BEAM.tie);
    go.onclick = () => { snd('tap'); phase = 'where'; draw(); };
    F.body.replaceChildren(...(ids.length ? [chips] : []), ...(lent ? [h('p.it-note', {}, BEAM.lent(lent))] : []), go);
  }
  function drawWhere() {
    F.sub.textContent = BEAM.where;
    F.body.replaceChildren(...HANG.map((p) => {
      const b = h('button.it-b.opt', { type: 'button' }, p.t);
      b.onclick = () => {
        snd('tap');
        if (dryOk(p.id)) { place = p.id; phase = 'done'; F.say.say(p.re); draw(); return; }
        F.say.say(p.re, true);
        beam.classList.remove('shake'); void beam.offsetWidth; beam.classList.add('shake');
      };
      return b;
    }));
  }
  function drawDone() {
    F.sub.textContent = '';
    beam.classList.add('hung');
    const ok = h('button.it-b.main', { type: 'button' }, BEAM.done);
    ok.onclick = () => { snd('tap'); F.done({ ok: true, mine: [...picked], lent, place }); };
    F.body.replaceChildren(ok);
    F.foot.hidden = true;
  }
  function draw() { drawBeam(); if (phase === 'pick') drawPick(); else if (phase === 'where') drawWhere(); else drawDone(); }
  draw();
  return F.result;
}

// ---- the sage bundle ---------------------------------------------------------------------------------------
// a bundle of dried sage drawn in SVG: grey-green leaves fanning up from a fistful of stems (where the string goes)
function sageBundle() {
  const leaves = [];
  for (let i = 0; i < 15; i++) {
    const a = -32 + (i % 5) * 16 + (i > 9 ? 6 : 0), y = 28 + Math.floor(i / 5) * 24, x = 75 + Math.sin(i * 1.7) * 6;
    const col = ['#9aa58a', '#8a9478', '#b0b49a', '#7d876c'][i % 4];
    leaves.push(`<ellipse cx="${x}" cy="${y + 26}" rx="11" ry="27" transform="rotate(${a} ${x} ${y + 52})" fill="${col}" stroke="#2a2a20" stroke-width="1.6"/>`);
    leaves.push(`<line x1="${x}" y1="${y + 6}" x2="${x}" y2="${y + 48}" transform="rotate(${a} ${x} ${y + 52})" stroke="#5e6650" stroke-width="1"/>`);
  }
  const stems = [66, 70, 74, 78, 82, 86].map((x, i) => `<line x1="${x}" y1="108" x2="${x + (i - 2.5) * 2}" y2="186" stroke="#6b5a3a" stroke-width="3" stroke-linecap="round"/>`);
  const el = document.createElement('span');
  el.innerHTML = `<svg viewBox="0 0 150 200" aria-hidden="true">${stems.join('')}${leaves.join('')}</svg>`;
  return el.firstChild;
}

export function openBundle({ own = false } = {}) {
  css('ui-interests-beam', CSS);
  const F = frame({ title: BUNDLE.title, closeText: BUNDLE.close });
  let n = 0;
  const bunch = h('div.bd-bunch', { 'aria-label': BUNDLE.wrap }, sageBundle());
  F.stage.append(h('div.bd', bunch));
  F.sub.textContent = own ? BUNDLE.mine : BUNDLE.hers;
  const row = h('div');
  const tap = h('button.it-b', { type: 'button' }, BUNDLE.tap);
  const wrapOnce = () => {
    if (n >= BUNDLE.turns) return;
    n += 1; snd('tap');
    bunch.append(h('div.bd-wrap', { style: { top: `${118 + n * 9}px` } })); // round the stems, under the leaves
    paint();
  };
  tap.onclick = wrapOnce;
  turns(bunch, wrapOnce);
  function paint() {
    row.replaceChildren(dots(BUNDLE.turns, n));
    if (n >= BUNDLE.turns) {
      const ok = h('button.it-b.main', { type: 'button' }, BUNDLE.done);
      ok.onclick = () => { snd('tap'); F.done({ ok: true }); };
      F.body.replaceChildren(row, ok);
      F.foot.hidden = true;
    } else F.body.replaceChildren(h('p.it-note', {}, BUNDLE.wrap), row, tap);
  }
  paint();
  return F.result;
}
