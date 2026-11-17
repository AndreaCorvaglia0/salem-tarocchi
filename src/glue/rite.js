// The smoke rite's wiring (rules: rite.rules.js; overlay: ui/rite/; data: data/rite.js; spec: notes/rito/PROGETTO.md).
//   rite.run({ where: 'self' | 'client', ambito, real }) -> { air | null, skipped?, cancelled?, bypass? }
//     before a reading: plans this rite from what she has done (state.rite), adds the scene at Malva's hearth
//     the very first time and a gift when one is due, opens the overlay, saves what happened. The air's music
//     stays for the reading (the reading's own sound.back puts the place's music back at the end); when no
//     air is lit the music she had before comes back at once.
//   rite.after() -> a node or null: the line after the reading (at most once a calendar day), with «E Malva?».
// Scripted tests and harness pages set window.__salemNoRite = true to read without the rite.
import { provide, call, has } from '../core/services.js';
import { state, save } from '../core/state.js';
import { h, css } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { AIRS, MALVA, MALVA_SCENE, TEXT } from '../data/rite.js';
import { normRite, planRite, afterLit, afterSkip, afterGift, giftDue, malvaSceneDue, factDue, dayKey, malvaFor } from './rite.rules.js';
import '../ui/rite/index.js'; // rite.overlay, rite.preview

let pending = null; // the last air lit, for the line after this reading: { air, ambito, at }
const PENDING_MS = 3 * 3600 * 1000;

provide('rite.run', async ({ where = 'self', ambito = null, real = false } = {}) => {
  pending = null;
  if (globalThis.__salemNoRite || !has('rite.overlay')) return { air: null, bypass: true };
  const prev = has('sound.want') ? await call('sound.want') : null;
  let r = normRite(state.rite);
  const scene = malvaSceneDue(r, state) ? MALVA_SCENE : null;
  if (scene) r.malva = true;
  const gift = giftDue(r, state);
  if (gift) r = afterGift(r, gift.air);
  state.rite = r; save();
  const plan = planRite(r, Date.now());
  const res = (await call('rite.overlay', { plan, scene, gift, real, where })) || { air: null, cancelled: true };
  r = normRite(state.rite);
  if (res.air && AIRS[res.air]) {
    r = afterLit(r, { air: res.air, ambito, at: Date.now(), phases: res.phases || {} });
    if (res.deck) r.deck += 1;
    pending = { air: res.air, ambito, at: Date.now() };
  } else {
    if (res.skipped) r = afterSkip(r); else r.shown += 1;
    if (prev) call('sound.mood', prev);
  }
  state.rite = r; save();
  return res;
});

const CSS = `
.rta{display:flex;flex-direction:column;gap:8px;margin-top:6px;padding:10px 14px;border-left:3px solid #6b5a3a;border-radius:0 10px 10px 0;background:#ffffff07}
.rta p{margin:0;font-size:17px;font-style:italic;color:#e9dfc8}
.rta button{align-self:flex-start;min-height:44px;padding:4px 14px;border-radius:22px;border:1.5px solid #e0b95e66;background:none;color:#e0b95e;font:17px ${FONT.serif};cursor:pointer}
.rta .say{padding:10px 13px;border-radius:4px 12px 12px 12px;background:#f0e6cf;color:#2a2030;font-size:17px;line-height:1.35;font-style:italic}
.rta .say b{display:block;font-style:normal;font-weight:400;font-size:14px;color:#6b5a48;letter-spacing:.04em;text-transform:uppercase}
`;

provide('rite.after', () => {
  const p = pending; pending = null;
  if (!p?.air || Date.now() - p.at > PENDING_MS) return null;
  const r = normRite(state.rite);
  if (!factDue(r, Date.now(), p.air)) return null;
  r.lineDay = dayKey(Date.now()); state.rite = r; save();
  css('glue-rite-after', CSS);
  const m = p.ambito ? malvaFor(p.ambito) : null;
  const box = h('div.rta', h('p', TEXT.fact(AIRS[p.air])));
  if (m) {
    const b = h('button', { type: 'button' }, TEXT.askMalva);
    b.onclick = () => {
      call('sound.play', 'tap');
      b.replaceWith(h('div.say', h('b', 'Malva'), `«${m.line}»`));
      call('rite.preview', box, m.air, 4);
    };
    box.append(b);
  }
  return box;
});

// for the harness and the grimoire: what she does with the rite, and Malva's air for a kind of question
provide('rite.state', () => normRite(state.rite));
provide('rite.malva', (ambito) => MALVA[ambito] || null);
