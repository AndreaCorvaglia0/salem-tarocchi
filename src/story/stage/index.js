// The shadow-theatre stage: one canvas (light, cut paper, flame, smoke) and the real cards in the DOM.
//   const stage = createStage(container, { session: 0..4, found?: ids, tableau?: 'reader' })
//   the old scene API (session.js):  await stage.layCard(id); await stage.shuffle(); stage.speak();
//     await stage.clearCards(); stage.setLevel(n); stage.setFound(ids); stage.cards (ids); stage.dispose()
//   new:  await stage.tableau(name, { via: 'ink' | 'fade' | 'cut' }); await stage.symbol('moon');
//         stage.candle(level); stage.table (show/turn/row/celtic/highlight); stage.destroy()
//   await playTableau(name, lines, { skip = true }) : cinema, full screen, one line at a time
import { h, css, openOverlay, reducedMotion, cardUrl } from '../../core/dom.js';
import { FONT } from '../../core/fonts.js';
import { emit } from '../../core/bus.js';
import { foundIds } from '../../core/progress.js';
import { Painter } from './painter.js';
import { TABLEAUX } from './tableaux.js';
import { Smoke } from './smoke.js';
import { createCards } from './cards.js';
import { canvas } from './draw.js';
import { rnd, clamp, ease } from './kit.js';
import { gate, isTapKey } from '../pace.js';

const imgs = new Map();
const loadImg = (id, onload) => {
  let im = imgs.get(id);
  if (!im) { im = new Image(); im.src = cardUrl(id); imgs.set(id, im); }
  if (!im.complete) im.addEventListener('load', onload, { once: true });
  return im.complete && im.naturalWidth ? im : null;
};

export function createStage(container, { session = 0, level = session, found, tableau = 'reader' } = {}) {
  const calm = !!reducedMotion();
  const wrap = h('div', { style: { position: 'absolute', inset: '0', overflow: 'hidden', background: '#0a0403' } });
  const cv = h('canvas', { 'aria-hidden': 'true', style: { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' } });
  wrap.append(cv); container.append(wrap);
  const g = cv.getContext('2d');
  const table = createCards(wrap, { calm });
  const smoke = new Smoke(7);
  let rebuildT = 0;
  const env = { W: 0, H: 0, d: 1, level: clamp(level | 0, 0, 4), found: (found || foundIds()).slice(), calm, imgOf: (id) => loadImg(id, () => { clearTimeout(rebuildT); rebuildT = setTimeout(() => cur?.build(), 120); }) };
  let cur = null, prev = null, tr = null, buf = null, raf = 0, alive = true, last = 0, clock = 0, cost = 0, skip = false;

  const size = () => {
    const cw = cv.clientWidth || 390, ch = cv.clientHeight || 844;
    let d = Math.min(globalThis.devicePixelRatio || 1, 1.5);
    if (cw * ch * d * d > 0.72e6) d = Math.sqrt(0.72e6 / (cw * ch)); // soft art: a capped canvas keeps phones cool
    const W = Math.round(cw * d), H = Math.round(ch * d);
    if (W === env.W && H === env.H) return false;
    Object.assign(env, { W, H, d }); cv.width = W; cv.height = H; buf = null;
    return true;
  };
  const zone = () => { const z = cur?.cardsAt; if (z) table.zone({ x: z.x / env.d, y: z.y / env.d, h: z.h / env.d }); };
  size();
  cur = new Painter(TABLEAUX[tableau] ? tableau : 'reader', env); // painters share env (size, level, found)
  zone();

  function frame(now) {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden) { last = 0; return; }
    if (cost > 14 && (skip = !skip)) return; // a slow phone: every other frame
    const t0 = performance.now(), dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now; clock += dt;
    if (size()) { cur.build(); prev?.build(); zone(); }
    smoke.update(dt, clock, env.d);
    if (tr) {
      tr.k = clamp((clock - tr.t0) / tr.dur);
      prev.frame(g, clock, dt, null);
      if (!buf) [buf] = canvas(env.W, env.H);
      const bg = buf.getContext('2d');
      cur.frame(bg, clock, dt, smoke);
      inkReveal(g, buf, tr, env);
      if (tr.k >= 1) { const r = tr.res; tr = null; prev = null; r(); }
    } else cur.frame(g, clock, dt, smoke);
    cost = cost * 0.9 + (performance.now() - t0) * 0.1;
  }
  raf = requestAnimationFrame(frame);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const api = {
    el: wrap, table,
    // ---- the scene API session.js already uses
    layCard: (id) => table.lay(id),
    clearCards: () => table.clear(),
    shuffle: async () => { const s = cur.smokeAt; await Promise.all([table.shuffle(), calm ? null : smoke.symbol('star', s.x, s.y, s.size * 0.6, { hold: 0.6, calm })]); },
    wait: sleep,
    speak() { cur.lean = 0.35; }, // the flame leans toward you when she speaks
    setLevel(n) { api.candle(n); },
    setFound(ids) { env.found = ids.slice(); cur.build(); },
    get cards() { return table.ids; },
    // ---- new
    get name() { return cur.name; },
    tableau(name, { via = 'ink', ms = 1800 } = {}) {
      if (!TABLEAUX[name] || name === cur.name) return Promise.resolve();
      if (tr) { tr.res(); tr = null; }
      prev = cur; cur = new Painter(name, env); zone();
      if (via === 'cut') { prev = null; return Promise.resolve(); }
      return new Promise((res) => { tr = { t0: clock, dur: (calm ? 900 : ms) / 1000, via: calm ? 'fade' : via, res, seed: name.length * 31 + clock * 10 }; });
    },
    symbol(name, opts = {}) { const s = cur.smokeAt; return smoke.symbol(name, s.x, s.y, s.size, { ...opts, calm }); },
    candle(n) { env.level = clamp(n | 0, 0, 4); cur.build(); },
    dispose() { alive = false; cancelAnimationFrame(raf); clearTimeout(rebuildT); table.destroy(); wrap.remove(); },
  };
  api.destroy = api.dispose;
  return api;
}

// the reveal between two tableaux: ink blots spreading (the new picture shows through them) over a soft
// dissolve, or a plain dissolve
function inkReveal(g, buf, tr, env) {
  const k = tr.k, { W, H } = env;
  if (tr.via === 'fade') { g.save(); g.globalAlpha = ease(k); g.drawImage(buf, 0, 0); g.restore(); return; }
  g.save(); g.globalAlpha = ease(k) * 0.55; g.drawImage(buf, 0, 0); g.restore();
  const r = rnd(tr.seed | 0), R = Math.hypot(W, H);
  g.save(); g.beginPath();
  for (let i = 0; i < 16; i++) {
    const x = r() * W, y = r() * H, delay = r() * 0.45, rr = R * 0.38 * ease(clamp((k - delay) / (1 - delay)));
    if (rr <= 0) continue;
    for (let j = 0; j < 5; j++) { const a = r() * 6.28, o = rr * 0.35 * r(); g.moveTo(x + Math.cos(a) * o + rr * (0.6 + r() * 0.3), y + Math.sin(a) * o); g.arc(x + Math.cos(a) * o, y + Math.sin(a) * o, rr * (0.6 + r() * 0.3), 0, 6.3); }
  }
  g.clip(); g.drawImage(buf, 0, 0); g.restore();
}

// ---- cinema on the stage: full screen, the tableau, one line at a time, a soft dark band under it
const CSS = `
.sgm{position:fixed;inset:0;z-index:40;background:#000;font-family:${FONT.serif};color:#f3e8cf;cursor:pointer;-webkit-user-select:none;user-select:none;touch-action:manipulation;opacity:0;transition:opacity .9s}
.sgm.in{opacity:1}
.sgm-band{position:absolute;left:0;right:0;bottom:0;height:max(34vh,250px);background:linear-gradient(rgba(6,2,1,0),rgba(6,2,1,.62) 38%,rgba(4,1,0,.86));pointer-events:none}
.sgm-cap{position:absolute;left:0;right:0;bottom:max(7vh,46px);display:flex;justify-content:center;padding:0 24px;box-sizing:border-box;pointer-events:none}
.sgm-cap p{margin:0;max-width:min(92vw,720px);font-size:clamp(22px,2.6vw,28px);line-height:1.42;text-align:center;text-wrap:balance;text-shadow:0 2px 12px rgba(0,0,0,.9),0 0 2px #000;opacity:0;transform:translateY(6px);transition:opacity .8s,transform .8s}
.sgm-cap p.on{opacity:1;transform:none}
.sgm-skip{position:absolute;top:max(10px,env(safe-area-inset-top));right:12px;min-height:44px;min-width:44px;padding:0 16px;border:1px solid rgba(217,190,140,.35);border-radius:22px;background:rgba(10,4,2,.45);color:#e0d0ac;font:italic 18px ${FONT.serif};cursor:pointer;z-index:2}
.sgm-hint{position:absolute;left:0;right:0;bottom:max(2.5vh,14px);text-align:center;font:italic 15px ${FONT.serif};color:rgba(230,210,170,.55);opacity:0;transition:opacity .8s;pointer-events:none}
.sgm-hint.on{opacity:1}
@media (prefers-reduced-motion:reduce){.sgm,.sgm-cap p,.sgm-hint{transition:opacity .3s}}
`;
export async function playTableau(name, lines, { skip: canSkip = true, via } = {}) {
  css('stage-cinema', CSS);
  const list = (lines || []).filter(Boolean);
  const calm = reducedMotion();
  const cap = h('p'), hint = h('div.sgm-hint', 'tocca per continuare');
  const skipBtn = canSkip ? h('button.sgm-skip', { type: 'button' }, 'salta ›') : null;
  const holder = h('div', { style: { position: 'absolute', inset: '0' } });
  const root = h('div.sgm', { role: 'dialog', 'aria-label': list[0] || name }, holder, h('div.sgm-band'), h('div.sgm-cap', cap), hint, skipBtn);
  const close = openOverlay(root);
  emit('cinema', true);
  const stage = createStage(holder, { tableau: TABLEAUX[name] ? name : 'arrival' });
  void via;
  requestAnimationFrame(() => root.classList.add('in'));
  let skipped = false, g = null;
  const tap = () => { if (skipped) { g?.cancel(); return; } g?.tap(); }; // the tap gate (story/pace.js)
  root.addEventListener('pointerdown', (e) => { if (e.target === skipBtn) return; e.preventDefault(); tap(); });
  skipBtn?.addEventListener('click', (e) => { e.stopPropagation(); skipped = true; tap(); });
  const onKey = (e) => {
    if (e.key === 'Escape' && canSkip) { e.preventDefault(); skipped = true; tap(); }
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (isTapKey(e)) tap(); }
  };
  window.addEventListener('keydown', onKey, true);
  const sleep = (ms) => new Promise((r) => setTimeout(r, calm ? Math.min(ms, 200) : ms));
  try {
    await sleep(1800); // the picture first, then the words
    for (const line of list) {
      if (skipped) break;
      cap.textContent = line; void cap.offsetWidth;
      let t = 0;
      g = gate({
        start: (done) => { cap.style.transition = ''; cap.classList.add('on'); t = setTimeout(done, calm ? 0 : 850); },
        finish: () => { clearTimeout(t); cap.style.transition = 'none'; },
        onReady: () => hint.classList.add('on'),
      });
      await g.done;
      g = null; hint.classList.remove('on'); cap.style.transition = ''; cap.classList.remove('on');
      await sleep(420);
    }
  } finally {
    window.removeEventListener('keydown', onKey, true);
    root.classList.remove('in');
    await sleep(900);
    stage.dispose(); close(); emit('cinema', false);
  }
}
export { TABLEAUX };
