// Edera's cellars (notes/interessi/PROGETTO.md §4, mission 1): six places drawn on the stage; Edera says where
// she put her grandmother's stone, one place after the other, and each time she is wrong (the stone is in the
// crack beside the well, where the moonbeam shows it). Then the wash at the old well: the stone under the mud,
// four turns of the finger in the water (or four taps on «Strofina», like the sage of Ortica's bundle).
// Presentation only: the words are in data/interests/edera.js, the glue applies the result.
//   openCellar() -> { ok: true, searched: [ids] } | { ok: false }
import { h, css } from '../../core/dom.js';
import { call } from '../../core/services.js';
import { CELLAR } from '../../data/interests/edera.js';
import { STONE } from '../../data/stones.js';
import { paintStone } from '../../world/art/finds.js';
import { frame, dots, turns } from './common.js';
import { HAND, GOLD } from '../paper.js';

const snd = (n) => { try { call('sound.play', n); } catch { /* no sound here */ } };
const CSS = `
.ce{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:12px 8px 10px;background:radial-gradient(ellipse at 50% 20%,#3a2a1e,#1b130d 75%)}
.ce-spot{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;min-height:96px;padding:4px 2px;border:1px solid transparent;border-radius:8px;background:none;color:#f1e6cb;font:17px/19px ${HAND};cursor:pointer;-webkit-tap-highlight-color:transparent}
.ce-spot svg{width:64px;height:56px}
.ce-spot:hover,.ce-spot:focus-visible{border-color:${GOLD}88;outline:none}
.ce-spot.done{opacity:.5}
.ce-spot.said::after{content:'';position:absolute;top:4px;right:10px;width:9px;height:9px;border-radius:50%;background:#e6c26a;box-shadow:0 0 8px #e6c26a}
.ce-spot.shake svg{animation:it-shake .5s}
.ce-spot.found{border-color:${GOLD};background:#2a1e12}
.ce-wash{position:relative;height:200px;display:flex;align-items:center;justify-content:center;touch-action:none}
.ce-bowl{position:relative;width:220px;height:150px;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#2a4a6a,#14283c 60%,#0a1420);border:3px solid #4a4038;box-shadow:inset 0 8px 18px #000a}
.ce-bowl canvas{position:absolute;left:50%;top:50%;width:96px;height:auto;transform:translate(-50%,-50%);image-rendering:pixelated;image-rendering:crisp-edges}
.ce-mud{position:absolute;left:50%;top:50%;width:104px;height:90px;transform:translate(-50%,-50%);border-radius:46% 54% 50% 50%;background:radial-gradient(ellipse at 40% 40%,#7a5a3a,#5a4028 60%,#3e2c1c);transition:opacity .35s}
.ce-ring{position:absolute;inset:18px 30px;border-radius:50%;border:2px solid #9cc8ff33}
`;

// the six places, drawn small in SVG (64 x 56), in the cellar's browns
const ART = {
  botte: '<ellipse cx="32" cy="30" rx="20" ry="23" fill="#7a4a26" stroke="#2a170c" stroke-width="2"/><path d="M13 20 Q32 26 51 20 M12 40 Q32 46 52 40" stroke="#3a2a1a" stroke-width="3" fill="none"/><ellipse cx="32" cy="9" rx="14" ry="4" fill="#5a3618" stroke="#2a170c" stroke-width="1.5"/>',
  vasi: '<rect x="4" y="44" width="56" height="5" fill="#6b4423" stroke="#2a170c"/><rect x="9" y="24" width="13" height="20" rx="3" fill="#c8865a" stroke="#2a170c" stroke-width="1.5"/><rect x="26" y="20" width="13" height="24" rx="3" fill="#a86a42" stroke="#2a170c" stroke-width="1.5"/><rect x="43" y="27" width="12" height="17" rx="3" fill="#c89a6a" stroke="#2a170c" stroke-width="1.5"/><rect x="8" y="21" width="15" height="4" fill="#e6dcc0"/><rect x="25" y="17" width="15" height="4" fill="#e6dcc0"/><rect x="42" y="24" width="14" height="4" fill="#e6dcc0"/>',
  cesto: '<path d="M10 30 L54 30 L48 52 L16 52 Z" fill="#8a6a3a" stroke="#2a170c" stroke-width="2"/><path d="M14 38 L50 38 M12 45 L52 45" stroke="#5a4020" stroke-width="2"/><rect x="20" y="12" width="6" height="20" fill="#efe4c8" stroke="#6a5a48"/><rect x="29" y="8" width="6" height="24" fill="#f4ecd6" stroke="#6a5a48"/><rect x="38" y="14" width="6" height="18" fill="#efe4c8" stroke="#6a5a48"/>',
  gradino: '<rect x="4" y="38" width="56" height="14" fill="#6a635a" stroke="#1f1c19" stroke-width="2"/><rect x="12" y="24" width="44" height="14" fill="#7d766c" stroke="#1f1c19" stroke-width="2" transform="rotate(-4 34 31)"/><rect x="20" y="10" width="36" height="14" fill="#8a8378" stroke="#1f1c19" stroke-width="2"/>',
  pozzo: '<ellipse cx="32" cy="34" rx="26" ry="16" fill="#6a635a" stroke="#1f1c19" stroke-width="2"/><ellipse cx="32" cy="32" rx="18" ry="10" fill="#0a1420"/><path d="M26 2 L30 30 L36 30 L40 2 Z" fill="#cfe0ff" opacity=".25"/><ellipse cx="33" cy="31" rx="6" ry="2.5" fill="#cfe0ff" opacity=".55"/><path d="M8 38 Q10 50 32 51 Q54 50 56 38" fill="#5a544c" stroke="#1f1c19" stroke-width="2"/>',
  crepa: '<rect x="4" y="4" width="56" height="48" fill="#5e574e" stroke="#1f1c19" stroke-width="2"/><path d="M8 20 H58 M8 36 H58 M22 4 V20 M40 20 V36 M18 36 V52 M48 36 V52" stroke="#3e3a34" stroke-width="1.5"/><path d="M34 6 L30 18 L36 26 L31 38 L35 50" stroke="#0e0c0a" stroke-width="3" fill="none"/><g fill="#3f7a3a" stroke="#1d3a1a" stroke-width="1"><path d="M44 8 q8 2 6 10 q-8 -2 -6 -10z"/><path d="M48 20 q8 3 5 10 q-8 -3 -5 -10z"/><path d="M12 30 q-6 4 -2 10 q6 -4 2 -10z"/></g>',
};
const svg = (id) => { const s = document.createElement('span'); s.innerHTML = `<svg viewBox="0 0 64 56" aria-hidden="true">${ART[id] || ''}</svg>`; return s.firstChild; };

export function openCellar() {
  css('ui-interests-cellar', CSS);
  const F = frame({ title: CELLAR.title, closeText: CELLAR.close, who: CELLAR.who });
  const searched = [];
  // the place Edera names now: the first of her memories not searched yet
  const named = () => CELLAR.spots.filter((x) => x.memory).sort((a, b) => a.memory - b.memory).find((x) => !searched.includes(x.id))?.id || null;
  let found = false, rubs = 0;

  function drawSearch() {
    F.sub.textContent = CELLAR.pick;
    const now = named();
    const grid = h('div.ce', CELLAR.spots.map((x) => {
      const b = h(`button.ce-spot${searched.includes(x.id) ? '.done' : ''}${x.id === now ? '.said' : ''}`, { type: 'button', 'aria-label': x.t }, svg(x.id), h('span', {}, x.t));
      b.onclick = () => {
        if (found) return;
        snd('tap');
        if (!searched.includes(x.id)) searched.push(x.id);
        if (x.found) { found = true; F.say.say(x.re); drawSearch(); b.classList.add('found'); return; }
        F.say.say(x.re, !x.memory);
        drawSearch();
        const again = F.stage.querySelector(`[aria-label="${x.t}"]`);
        if (again) { again.classList.remove('shake'); void again.offsetWidth; again.classList.add('shake'); }
      };
      return b;
    }));
    F.stage.replaceChildren(grid);
    if (found) {
      grid.querySelector(`[aria-label="${CELLAR.spots.find((x) => x.found).t}"]`)?.classList.add('found');
      const go = h('button.it-b.main', { type: 'button' }, 'La porto al pozzo e la lavo');
      go.onclick = () => { snd('tap'); drawWash(); };
      F.body.replaceChildren(go);
    } else F.body.replaceChildren();
  }

  function drawWash() {
    F.sub.textContent = CELLAR.wash;
    F.say.say(CELLAR.washSay);
    const L = STONE.lapislazzuli;
    const stone = paintStone(L.look, 30, 26, 11);
    const mud = h('div.ce-mud');
    const bowl = h('div.ce-bowl', { 'aria-label': CELLAR.wash }, h('div.ce-ring'), stone, mud);
    F.stage.replaceChildren(h('div.ce-wash', bowl));
    const row = h('div');
    const rub = h('button.it-b', { type: 'button' }, CELLAR.rub);
    const once = () => {
      if (rubs >= CELLAR.turns) return;
      rubs += 1; snd('tap');
      mud.style.opacity = String(Math.max(0, 1 - rubs / CELLAR.turns));
      paint();
    };
    rub.onclick = once;
    turns(bowl, once);
    function paint() {
      row.replaceChildren(dots(CELLAR.turns, rubs));
      if (rubs >= CELLAR.turns) {
        const ok = h('button.it-b.main', { type: 'button' }, CELLAR.done);
        ok.onclick = () => { snd('tap'); F.done({ ok: true, searched: [...searched] }); };
        F.body.replaceChildren(row, ok);
        F.foot.hidden = true;
      } else F.body.replaceChildren(row, rub);
    }
    paint();
  }

  F.say.say(CELLAR.first);
  drawSearch();
  return F.result;
}
