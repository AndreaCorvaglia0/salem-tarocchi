// Ortica's mortar (notes/interessi/PROGETTO.md §11, mission 2): four jars of clay with a herb showing over the rim,
// she picks two, then three turns of the pestle with the finger round the bowl (or three taps on «Pesta», like the
// rite's alternative). Then Ortica says whether those two make an ointment for the miller's knees; when they do
// not, she says what the wrong one is for, and the jars wait to be chosen again. Presentation only: the right
// herbs come from glue/interests.rules.js (the circle, src/data/sapere.js), the glue applies the result.
//   openMortar() -> { ok: true, herbs, tries } | { ok: false }
import { h, css } from '../../core/dom.js';
import { call } from '../../core/services.js';
import { MORTAR } from '../../data/interests/ortica.js';
import { mortarOk, mortarWhy } from '../../glue/interests.rules.js';
import { frame, herbCanvas, lower, dots, turns } from './common.js';
import { HAND, GOLD } from '../paper.js';

const snd = (n) => { try { call('sound.play', n); } catch { /* no sound here */ } };
const CSS = `
.mt{position:relative;height:206px}
.mt-jars{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:14px 10px 0}
.mt-jar{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-height:150px;padding:0 0 4px;border:0;background:none;color:#f1e6cb;font:17px/19px ${HAND};cursor:pointer;transition:transform .25s;-webkit-tap-highlight-color:transparent}
.mt-jar canvas{position:relative;z-index:1;margin-bottom:-14px}
.mt-jar .pot{position:relative;z-index:2;width:62px;height:62px;border-radius:12px 12px 22px 22px;background:radial-gradient(ellipse at 35% 30%,#c8865a,#8a4f2c 60%,#5e3219);border:2px solid #2a170c;box-shadow:inset 0 5px 0 #d89a6a55}
.mt-jar .pot::before{content:'';position:absolute;left:-4px;right:-4px;top:-6px;height:9px;border-radius:5px;background:#9a5a34;border:2px solid #2a170c}
.mt-jar .nm{margin-top:6px}
.mt-jar.on{transform:translateY(-10px)}
.mt-jar.on .pot{box-shadow:0 0 0 3px ${GOLD},inset 0 5px 0 #d89a6a55}
.mt-jar:disabled{opacity:.5;cursor:default}
.mt-bowl{position:absolute;left:50%;top:22px;width:190px;height:170px;margin-left:-95px;border-radius:50%;touch-action:none}
.mt-bowl .stone{position:absolute;left:15px;right:15px;top:62px;height:96px;border-radius:12px 12px 70px 70px;background:radial-gradient(ellipse at 40% 25%,#9d9488,#6a635a 60%,#45403a);border:2px solid #1f1c19}
.mt-bowl .stone::before{content:'';position:absolute;left:8px;right:8px;top:-10px;height:22px;border-radius:50%;background:radial-gradient(ellipse,#3a5a2a,#24361a 70%);border:2px solid #1f1c19}
.mt-pestle{position:absolute;left:50%;top:6px;width:20px;height:96px;margin-left:-10px;border-radius:10px 10px 12px 12px;background:linear-gradient(90deg,#8a7e70,#c4b8a6,#8a7e70);border:2px solid #1f1c19;transform-origin:50% 90%;transition:transform .25s}
`;

export function openMortar() {
  css('ui-interests-mortar', CSS);
  const F = frame({ title: MORTAR.title, closeText: MORTAR.close });
  const stage = h('div.mt');
  F.stage.append(stage);
  let picked = [], tries = 0, n = 0;

  function drawJars() {
    F.sub.textContent = MORTAR.pick;
    stage.replaceChildren(h('div.mt-jars', MORTAR.jars.map((id) => {
      const on = picked.includes(id);
      const b = h(`button.mt-jar${on ? '.on' : ''}`, { type: 'button', 'aria-pressed': on ? 'true' : 'false' }, herbCanvas(id, 2), h('span.pot'), h('span.nm', {}, lower(id)));
      b.onclick = () => { snd('tap'); picked = on ? picked.filter((x) => x !== id) : picked.length < 2 ? [...picked, id] : [picked[1], id]; drawJars(); };
      return b;
    })));
    const go = h('button.it-b.main', { type: 'button', disabled: picked.length < 2 }, MORTAR.put);
    go.onclick = () => { snd('tap'); n = 0; drawPound(); };
    F.body.replaceChildren(go);
  }
  function drawPound() {
    F.sub.textContent = `Nel mortaio: ${lower(picked[0])} e ${lower(picked[1])}.`;
    F.say.say('');
    const pestle = h('div.mt-pestle');
    const bowl = h('div.mt-bowl', { 'aria-label': MORTAR.pound }, h('div.stone'), pestle);
    stage.replaceChildren(bowl);
    const row = h('div');
    const turn = () => {
      if (n >= 3) return;
      n += 1; snd('tap');
      pestle.style.transform = `rotate(${n % 2 ? 14 : -14}deg)`;
      setTimeout(() => { pestle.style.transform = ''; }, 260);
      row.replaceChildren(dots(3, n));
      if (n >= 3) setTimeout(result, 350);
    };
    turns(bowl, turn);
    const tap = h('button.it-b', { type: 'button' }, MORTAR.tap);
    tap.onclick = turn;
    row.replaceChildren(dots(3, 0));
    F.body.replaceChildren(h('p.it-note', {}, MORTAR.pound), row, tap);
  }
  function result() {
    tries += 1;
    if (mortarOk(picked)) {
      F.say.say(MORTAR.right);
      const ok = h('button.it-b.main', { type: 'button' }, MORTAR.done);
      ok.onclick = () => { snd('tap'); F.done({ ok: true, herbs: [...picked], tries }); };
      F.body.replaceChildren(ok);
      F.foot.hidden = true;
      return;
    }
    F.say.say(mortarWhy(picked), true);
    const again = h('button.it-b.main', { type: 'button' }, MORTAR.again);
    again.onclick = () => { snd('tap'); picked = []; drawJars(); }; // Ortica's line stays while she chooses again
    F.body.replaceChildren(again);
  }
  drawJars();
  return F.result;
}
