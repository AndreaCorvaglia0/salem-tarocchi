// The smoke rite's layer (notes/rito/PROGETTO.md «La sequenza»): a full-screen overlay that does not scroll,
// select or call out, with its own handling of the thumb. Knock (hold the coal a second) -> the opening
// motif and the clear smoke of the incense -> breathe with the hand free (a circle widens and narrows; each
// exhale thins the veil of the last smoke) -> search (the thumb slides sideways under five embers on an arc;
// over an ember of hers: the light of the room, the colour and motion of its smoke, one real note) -> lift
// over an ember: the element's sign draws itself, «Quest'aria è la rosa.», and its music comes in.
// Presentation only: the plan comes from glue/rite.rules.js (planRite), the saving from glue/rite.js.
// Service: rite.overlay({ plan, scene, gift, real }) -> { air, skipped, cancelled, deck, phases }.
//          rite.preview(host, airId, secs): a few seconds of an air in a small box («E Malva?»).
import { h, css, openOverlay, reducedMotion } from '../../core/dom.js';
import { FONT } from '../../core/fonts.js';
import { call, provide } from '../../core/services.js';
import { AIRS, OPENING, SIGNS, TEXT } from '../../data/rite.js';
import { arcSlots, emberAt, onRelease, KNOCK_MS } from '../../glue/rite.rules.js';
import { createSmoke } from './smoke.js';

const NEUTRAL = '#2a1a16'; // the room lit only by the fire
// z-index 96: above the interface hints (ui/hint.js, 95), which would otherwise sit on the coal and take the touch
const CSS = `
.rt{position:fixed;inset:0;z-index:96;overflow:hidden;background:#0c080e;color:#f0e6cf;font:19px/1.4 ${FONT.serif};
  touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;
  opacity:0;transition:opacity .45s ease}
.rt.in{opacity:1}
.rt *{box-sizing:border-box;-webkit-touch-callout:none}
.rt canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.rt-guide{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top) + 74px);padding:0 30px;text-align:center;font-size:21px;line-height:1.35;color:#f6eedb;opacity:0;transition:opacity .7s;text-shadow:0 1px 8px #000c;pointer-events:none}
.rt-guide.on{opacity:.94}
.rt-sign{position:absolute;left:50%;top:21%;width:120px;height:120px;margin-left:-60px;pointer-events:none;overflow:visible}
.rt-sign path{fill:none;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 6px currentColor)}
.rt-name{position:absolute;left:0;right:0;top:44%;text-align:center;font-size:27px;opacity:0;transition:opacity .6s;text-shadow:0 2px 12px #000;pointer-events:none}
.rt-name.on{opacity:1}
.rt-top{position:absolute;left:0;right:0;top:env(safe-area-inset-top);display:flex;justify-content:space-between;align-items:center;padding:4px 6px 0 10px;pointer-events:none}
.rt-top button{pointer-events:auto;border:0;background:none;color:#bdae96;font:inherit;cursor:pointer;min-height:48px}
.rt-x{min-width:48px;font-size:26px!important;margin-left:auto}
.rt-skip{font-size:16px!important;font-style:italic;padding:0 10px;opacity:0;transition:opacity 1.2s}
.rt-skip.on{opacity:.72}
.rt-skip[hidden]{display:none}
.rt-say{position:absolute;left:16px;right:16px;top:24%;max-width:520px;margin:0 auto;padding:13px 16px 12px;border-radius:4px 14px 14px 14px;background:#f0e6cf;color:#2a2030;font-size:19px;line-height:1.4;font-style:italic;box-shadow:0 8px 24px #000a;opacity:0;transform:translateY(6px);transition:opacity .4s,transform .4s}
.rt-say.on{opacity:1;transform:none}
.rt-say b{display:block;font-style:normal;font-weight:400;font-size:15px;color:#6b5a48;letter-spacing:.04em;text-transform:uppercase;margin-bottom:2px}
.rt-say.plain{background:#1d1626ee;color:#f0e6cf;border-radius:12px}
.rt-say small{display:block;margin-top:8px;font-style:normal;font-size:15px;color:#8a7a68;text-align:right}
.rt-say.plain small{color:#bdae96}
.rt-btns{position:absolute;left:16px;right:16px;bottom:calc(env(safe-area-inset-bottom) + 18px);display:flex;flex-direction:column;gap:10px;max-width:520px;margin:0 auto}
.rt-btns button{min-height:52px;border-radius:12px;border:1.5px solid #6b5a3a;background:#1d1626dd;color:#f0e6cf;font:inherit;font-size:18px;cursor:pointer}
.rt-btns button.go{background:#e0b95e;border-color:#e0b95e;color:#2a1d05;font-weight:700}
.rt-line{position:absolute;left:24px;right:24px;top:calc(env(safe-area-inset-top) + 70px);text-align:center;font-size:19px;font-style:italic;color:#f0e6cf;text-shadow:0 1px 8px #000;pointer-events:none}
.rtp{position:relative;height:150px;border-radius:12px;overflow:hidden;background:#0c080e}
.rtp canvas{position:absolute;inset:0;width:100%;height:100%}
`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const now = () => performance.now();
const noGuard = () => !!globalThis.__salemNoGuard;
const sample = (url, opts) => { try { return call('sound.sample', url, opts); } catch { return null; } };
const stopSample = (s, fade) => { try { if (s && typeof s.stop === 'function') s.stop(fade); else s?.then?.((x) => x?.stop?.(fade)); } catch { /* ignore */ } };
const ease = (t) => 0.5 - Math.cos(Math.PI * Math.max(0, Math.min(1, t))) / 2;

export function riteOverlay({ plan, scene = null, gift = null, real = false } = {}) {
  css('ui-rite', CSS);
  const reduced = !!reducedMotion();
  const canvas = h('canvas');
  const guide = h('div.rt-guide');
  const name = h('div.rt-name');
  const svgNS = 'http://www.w3.org/2000/svg';
  const sign = document.createElementNS(svgNS, 'svg'); sign.setAttribute('class', 'rt-sign'); sign.setAttribute('viewBox', '0 0 100 100');
  const skipBtn = h('button.rt-skip', { type: 'button', hidden: !plan.skip }, TEXT.skip);
  const xBtn = h('button.rt-x', { type: 'button', 'aria-label': 'Chiudi' }, '×');
  const root = h('div.rt', { role: 'dialog', 'aria-label': 'Il fumo' }, canvas, guide, sign, name, h('div.rt-top', skipBtn, xBtn));
  const close = openOverlay(root);
  const smoke = createSmoke(canvas, { reduced });
  smoke.start();
  requestAnimationFrame(() => root.classList.add('in'));
  globalThis.__salemRiteStats = () => smoke.stats();

  let W = 0, H = 0, slots = [], arcY = 0, hearthY = 0;
  const layout = () => {
    smoke.resize(); ({ W, H } = smoke.size);
    hearthY = Math.round(H * 0.8); arcY = Math.round(H * 0.665);
    slots = arcSlots(W);
    smoke.scene({ hearthY, arcY, slots, owned: plan.owned });
  };
  layout();
  const onResize = () => layout();
  globalThis.addEventListener?.('resize', onResize);
  smoke.roomNow(NEUTRAL);
  smoke.scene({ coal: plan.knock ? 0 : 1, show: 0, hover: null, lit: null });
  if (plan.veil && AIRS[plan.veil]) smoke.veil(AIRS[plan.veil].color, 0.3, true);
  call('sound.mood', 'rite');
  call('sound.preload', [OPENING.note, ...plan.owned.map((a) => AIRS[a].note)]);

  let mode = 'none', phaseAt = now(), done = false, finish;
  const setMode = (m) => { mode = m; root.dataset.mode = m; }; // data-mode: for the harness and scripted tests
  const result = new Promise((r) => { finish = r; });
  const phases = {};
  const end = (v) => {
    if (done) return; done = true;
    stopSample(noteNow, 0.4);
    root.classList.remove('in');
    setTimeout(() => { smoke.stop(); close(); globalThis.removeEventListener?.('resize', onResize); if (globalThis.__salemRiteStats) delete globalThis.__salemRiteStats; }, 460);
    finish({ phases, deck: false, ...v });
  };
  skipBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
  xBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
  skipBtn.onclick = () => { call('sound.play', 'tap'); end({ air: null, skipped: true }); };
  xBtn.onclick = () => end({ air: null, cancelled: true });
  const setGuide = (t) => { if (!t) { guide.classList.remove('on'); return; } guide.textContent = t; guide.classList.add('on'); };

  // ---- the thumb -----------------------------------------------------------------------------------
  let held = null; // the knock: { id, at, raf }
  let hover = null, noteNow = null, tap = null;
  const rel = (e) => { const r = root.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom }; };
  const young = () => !noGuard() && now() - phaseAt < 650;
  function setHover(id) {
    if (id === hover) return;
    hover = id;
    smoke.scene({ hover: id });
    stopSample(noteNow, 0.35); noteNow = null;
    if (!id) { smoke.room(NEUTRAL); smoke.off('air'); return; }
    const a = AIRS[id];
    smoke.room(a.room);
    // the air's smoke rises from the one fire in the middle, whichever ember is under the thumb: so every
    // smoke is seen whole, in the same place, and only its colour and its way of moving change
    smoke.source('air', { x: W / 2, y: hearthY - 14, p: a.smoke, color: a.color, on: true, warm: Math.min(2.2, a.smoke.life * 0.45) });
    noteNow = sample(a.note, { gain: 0.9 });
  }
  root.addEventListener('pointerdown', (e) => {
    if (done) return;
    const p = rel(e);
    if (mode === 'tap') { if (!young()) tap = e.pointerId; return; }
    if (mode === 'knock') {
      if (young()) return;
      if (Math.hypot(p.x - W / 2, p.y - hearthY) > 80) return;
      try { root.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      held = { id: e.pointerId, at: now() };
      const grow = () => {
        if (!held || mode !== 'knock') return;
        const t = (now() - held.at) / KNOCK_MS;
        smoke.scene({ coal: Math.min(1, t) * 0.7 });
        if (t >= 1) { held = null; knocked(); return; }
        held.raf = requestAnimationFrame(grow);
      };
      grow();
      return;
    }
    if (mode === 'search' || mode === 'deck') {
      try { root.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      if (mode === 'search') setHover(emberAt(p.x, slots, plan.owned));
      else deckMove(p);
    }
  });
  root.addEventListener('pointermove', (e) => {
    if (done) return;
    const p = rel(e);
    if (mode === 'knock' && held && Math.hypot(p.x - W / 2, p.y - hearthY) > 110) { cancelAnimationFrame(held.raf); held = null; smoke.scene({ coal: 0 }); }
    if (mode === 'search' && e.buttons !== 0 || mode === 'search' && e.pointerType === 'touch') setHover(emberAt(p.x, slots, plan.owned));
    if (mode === 'deck' && (e.buttons || e.pointerType === 'touch')) deckMove(p);
  });
  const up = (e, cancel) => {
    if (done) return;
    const p = rel(e);
    if (mode === 'tap') { if (tap === e.pointerId && !cancel) { tap = null; tapped?.(); } return; }
    if (mode === 'knock' && held) { cancelAnimationFrame(held.raf); held = null; smoke.scene({ coal: 0 }); return; }
    if (mode === 'search') {
      const air = cancel ? null : onRelease(p.x, slots, plan.owned, p.inside);
      if (air) lit(air); else setHover(null);
    }
    if (mode === 'deck') smoke.off('deck');
  };
  root.addEventListener('pointerup', (e) => up(e, false));
  root.addEventListener('pointercancel', (e) => up(e, true));
  root.addEventListener('contextmenu', (e) => e.preventDefault());

  // ---- the parts ------------------------------------------------------------------------------------
  let tapped = null;
  const waitTap = () => new Promise((r) => { setMode('tap'); phaseAt = now(); tapped = () => { tapped = null; r(); }; });
  async function lines(list) {
    for (const l of list) {
      const box = h(`div.rt-say${l.who ? '' : '.plain'}`, l.who ? h('b', l.who) : null, l.t, h('small', 'tocca per andare avanti'));
      root.append(box); requestAnimationFrame(() => box.classList.add('on'));
      await waitTap(); if (done) return;
      box.classList.remove('on'); setTimeout(() => box.remove(), 400);
      await sleep(250);
    }
  }
  let knockedRes = null;
  function knocked() {
    setMode('none');
    phases.knock = (now() - phaseAt) / 1000;
    smoke.scene({ coal: 1 });
    if (plan.motif) sample(OPENING.note, { gain: 1 });
    smoke.source('olibano', { x: W / 2, y: hearthY - 12, p: OPENING.smoke, color: OPENING.color });
    setGuide(null);
    knockedRes?.();
  }
  async function breathe() {
    const t0 = now(), d = plan.dur, cx = W / 2, cy = Math.round(H * 0.37);
    if (d.light) await sleep(d.light * 1000);
    if (done) return;
    if (plan.guide) setGuide(TEXT.guide.breath);
    const v0 = plan.veil ? 0.3 : 0;
    for (let k = 0; k < plan.breaths && !done; k++) {
      const T = d.breath * 1000, inh = T * 0.45, b0 = now();
      await new Promise((res) => {
        const f = () => {
          if (done) return res();
          const t = now() - b0;
          const r = t < inh ? 34 + 58 * ease(t / inh) : 92 - 58 * ease((t - inh) / (T - inh));
          smoke.breath({ x: cx, y: cy, r });
          if (t >= inh && v0) smoke.veil(null, v0 * (1 - (k + 1) / plan.breaths)); // the exhale takes a part of the veil away
          if (t >= T) return res();
          requestAnimationFrame(f);
        };
        f();
      });
    }
    smoke.breath(null);
    smoke.veil(null, 0);
    phases.breath = (now() - t0) / 1000;
  }
  async function search() {
    setGuide(plan.guide ? TEXT.guide.search : null);
    smoke.off('olibano');
    for (let i = 1; i <= 8; i++) { smoke.scene({ show: i / 8 }); await sleep(30); }
    setMode('search'); phaseAt = now();
    return new Promise((r) => { litRes = r; });
  }
  let litRes = null;
  async function lit(id) {
    if (mode !== 'search') return;
    setMode('none');
    phases.search = (now() - phaseAt) / 1000;
    skipBtn.hidden = true;
    const t0 = now(), a = AIRS[id];
    setGuide(null);
    smoke.scene({ lit: id, hover: id });
    smoke.room(a.room);
    // the sign draws itself in the smoke
    sign.replaceChildren(); sign.style.color = a.color;
    const path = document.createElementNS(svgNS, 'path'); path.setAttribute('d', SIGNS[a.element]); path.setAttribute('stroke', a.color);
    sign.append(path);
    const L = path.getTotalLength?.() || 300;
    path.style.strokeDasharray = `${L}`; path.style.strokeDashoffset = `${L}`;
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset ${Math.min(0.9, plan.dur.name * 0.6)}s ease-out`;
    path.style.strokeDashoffset = '0';
    name.textContent = TEXT.named(a); name.classList.add('on');
    call('sound.mood', `air.${id}`);
    await sleep(plan.dur.name * 1000);
    phases.name = (now() - t0) / 1000;
    litRes?.(id);
  }

  // ---- the deck, with her real cards (on request) -----------------------------------------------------
  function deckMove(p) { if (curAir) smoke.source('deck', { x: p.x, y: p.y - 30, p: { ...AIRS[curAir].smoke, rise: Math.max(20, AIRS[curAir].smoke.rise * 0.5) }, color: AIRS[curAir].color }); }
  let curAir = null;
  async function deckPass(id) {
    curAir = id;
    const ask = h('button', { type: 'button' }, TEXT.deckAsk);
    const btns = h('div.rt-btns', ask);
    let want = false;
    ask.addEventListener('pointerdown', (e) => e.stopPropagation());
    ask.onclick = () => { want = true; };
    root.append(btns);
    for (let t = 0; t < 26 && !want && !done; t++) await sleep(100); // a moment to ask for it, then the reading
    btns.remove();
    if (!want || done) return false;
    name.classList.remove('on'); sign.replaceChildren();
    smoke.deck({ x: W / 2, y: H * 0.42, w: 120, h: 190 });
    smoke.off('air');
    const line = h('div.rt-line', TEXT.deckLine); root.append(line);
    const ok = h('button.go', { type: 'button' }, TEXT.deckDone);
    ok.addEventListener('pointerdown', (e) => e.stopPropagation());
    const btns2 = h('div.rt-btns', ok); root.append(btns2);
    setMode('deck'); phaseAt = now();
    await new Promise((r) => { ok.onclick = r; });
    setMode('none'); smoke.off('deck'); smoke.deck(null); line.remove(); btns2.remove();
    return true;
  }

  (async () => {
    try {
      await sleep(80);
      if (scene?.length) { await lines(scene); if (done) return; }
      if (gift) {
        await lines([{ who: null, t: gift.intro }, { who: gift.who, t: gift.line }]);
        if (done) return;
      }
      skipBtn.classList.add('on');
      if (plan.knock) {
        if (plan.guide) setGuide(TEXT.guide.knock);
        setMode('knock'); phaseAt = now();
        await new Promise((r) => { knockedRes = r; });
      } else {
        // a second rite in the same sitting: the ember is still lit
        phases.knock = 0;
        smoke.source('olibano', { x: W / 2, y: hearthY - 12, p: OPENING.smoke, color: OPENING.color });
        setGuide(TEXT.still);
      }
      if (done) return;
      await breathe();
      if (done) return;
      const air = await search();
      if (done) return;
      skipBtn.hidden = true;
      let deck = false;
      if (real) deck = await deckPass(air);
      end({ air, deck });
    } catch (e) { console.warn('[rite]', e); end({ air: null, cancelled: true, error: true }); }
  })();
  return result;
}

// A few seconds of an air in a small box: its light, its smoke and its note («E Malva?»).
export function previewAir(host, id, secs = 4) {
  const a = AIRS[id]; if (!a || !host) return Promise.resolve();
  css('ui-rite', CSS);
  const canvas = h('canvas'), box = h('div.rtp', canvas);
  host.append(box);
  const smoke = createSmoke(canvas, { reduced: !!reducedMotion() });
  smoke.start();
  const { W, H } = smoke.size;
  smoke.roomNow(NEUTRAL); smoke.room(a.room);
  smoke.source('air', { x: W / 2, y: H - 14, p: { ...a.smoke, rise: a.smoke.rise * 0.6, size: a.smoke.size.map((s) => s * 0.7) }, color: a.color });
  const n = sample(a.note, { gain: 0.9 });
  return new Promise((res) => setTimeout(() => {
    smoke.off('air'); smoke.room(NEUTRAL); stopSample(n, 0.6);
    setTimeout(() => { smoke.stop(); box.remove(); res(); }, 1400);
  }, secs * 1000));
}

provide('rite.overlay', (o) => riteOverlay(o));
provide('rite.preview', (host, id, secs) => previewAir(host, id, secs));
