// HARNESS ONLY: a snapshot of src/story/session.js with the scene swapped for the shadow-theatre stage,
// to show that the swap is a few lines (see notes/stage.md). Differences from the original are marked SWAP.
// A session with the Reader: full screen, the table scene on a canvas (scene.js) and the DOM on top:
// her lines as captions (never a face), choices as two cards of text, a paper to write on, a pad of
// numbers. The script itself is run by runner.js; this file gives it a UI and the session nodes
// (ask, turn, pick, observe).
import { h, css, openOverlay, reducedMotion } from '../src/core/dom.js';
import { FONT } from '../src/core/fonts.js';
import { emit } from '../src/core/bus.js';
import { call } from '../src/core/services.js';
import { test } from '../src/core/cond.js';
import { setPlayer, foundIds, findCard } from '../src/core/progress.js';
import { CARD } from '../src/data/cards.base.js';
import { SESSIONS, SCRIPTS } from '../src/data/story/index.js';
import { createRunner, cardOfNumber } from '../src/story/runner.js';
import { createStage } from '../src/story/stage/index.js'; // SWAP: was createScene from './scene.js'

const CSS = `
.ss{position:fixed;inset:0;z-index:35;background:#000;font-family:${FONT.serif};color:#efe4cc;opacity:0;transition:opacity .7s;overflow:hidden;-webkit-user-select:none;user-select:none;touch-action:manipulation}
.ss.on{opacity:1}
.ss-stage{position:absolute;inset:0;opacity:0;transition:opacity 1s}
.ss.shown .ss-stage{opacity:1}
.ss-ui{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;gap:14px;padding:70px 18px max(18px,env(safe-area-inset-bottom));box-sizing:border-box;background:linear-gradient(rgba(3,2,6,0),rgba(3,2,6,.82) 55%);pointer-events:none}
.ss-ui>*{pointer-events:auto}
.ss-cap{width:min(100%,640px);min-height:1.4em;margin:0;font-size:clamp(21px,2.5vw,26px);line-height:1.42;text-align:center;text-shadow:0 2px 10px #000,0 0 3px #000;text-wrap:balance;transition:opacity .35s;pointer-events:none}
.ss-cap.out{opacity:0}
.ss-cap .w{opacity:0;transition:opacity .7s}
.ss-cap .w.on{opacity:1}
.ss-cap.thought{font-style:italic;color:#bcb4d8}
.ss-cap.narra{font-style:italic;color:#b9ad92;font-size:clamp(19px,2.2vw,23px)}
.ss-cap small{display:block;margin-bottom:4px;font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:#a9976a}
.ss-dot{width:7px;height:7px;border-radius:50%;background:#ffd58a;box-shadow:0 0 10px #ffb35c;opacity:0;animation:ssd 1.8s ease-in-out infinite}
.ss-dot.on{opacity:.8}
@keyframes ssd{50%{transform:scale(.55);opacity:.3}}
.ss-choices{display:grid;grid-template-columns:1fr;gap:12px;width:min(100%,700px)}
@media (min-width:720px){.ss-choices{grid-template-columns:1fr 1fr}.ss-choices.n1{grid-template-columns:1fr}}
.ss-opt{position:relative;min-height:74px;padding:14px 18px;font:inherit;font-size:clamp(19px,2.1vw,22px);line-height:1.34;text-align:left;color:#f1e6c8;background:linear-gradient(160deg,rgba(46,30,40,.96),rgba(22,14,24,.97));border:1px solid rgba(184,154,82,.7);border-radius:7px;box-shadow:inset 0 0 0 4px rgba(10,6,12,.7),inset 0 0 0 5px rgba(184,154,82,.28),0 8px 22px rgba(0,0,0,.6);cursor:pointer;-webkit-tap-highlight-color:transparent;animation:ssu .5s ease-out both;transition:transform .25s,opacity .4s,border-color .2s}
.ss-opt:nth-child(2){animation-delay:.1s}.ss-opt:nth-child(3){animation-delay:.2s}.ss-opt:nth-child(4){animation-delay:.3s}
.ss-opt:hover,.ss-opt:focus-visible{border-color:#ffe08a;outline:none;transform:translateY(-3px)}
.ss-opt.no{opacity:0;transform:scale(.97)}.ss-opt.yes{border-color:#ffe08a;box-shadow:inset 0 0 0 4px rgba(10,6,12,.7),0 0 28px rgba(255,190,90,.5)}
@keyframes ssu{from{opacity:0;transform:translateY(14px)}}
.ss-paper{position:relative;width:min(100%,360px);padding:16px 20px 18px;box-sizing:border-box;color:#2a2038;transform:rotate(-1.2deg);animation:ssu .6s ease-out both;background:radial-gradient(120% 100% at 50% 0,#f4ead0,#e2d3ac 70%,#cdb98a);box-shadow:0 12px 30px rgba(0,0,0,.7),inset 0 0 40px rgba(120,80,30,.25)}
.ss-paper label{display:block;font:22px ${FONT.hand};color:#7a6a58;margin-bottom:2px}
.ss-paper input,.ss-paper select{font-family:${FONT.hand};font-size:34px;line-height:1.1;color:#1d1830;background:transparent;border:0;border-bottom:2px solid rgba(40,30,60,.55);border-radius:0;padding:2px 4px;width:100%;box-sizing:border-box;outline:none;-webkit-appearance:none;appearance:none}
.ss-paper input:focus,.ss-paper select:focus{border-bottom-color:#8a2a3a}
.ss-row{display:grid;grid-template-columns:72px 1fr 96px;gap:12px;align-items:end}
.ss-row div{min-width:0}.ss-row label{font-size:19px}
.ss-row select,.ss-row input{font-size:30px}
.ss-btns{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px}
.ss-btn{min-height:46px;padding:0 22px;font:600 22px ${FONT.hand};color:#f4e7c4;background:#3a1424;border:0;border-radius:4px;cursor:pointer;box-shadow:0 3px 0 #1a0a12}
.ss-btn:disabled{opacity:.4}
.ss-link{min-height:46px;padding:0 6px;font:20px ${FONT.hand};color:#6a5a68;background:none;border:0;cursor:pointer;text-decoration:underline}
.ss-pad{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;width:min(100%,420px);animation:ssu .5s ease-out both}
@media (min-width:720px){.ss-pad{grid-template-columns:repeat(11,1fr);width:min(100%,720px)}}
.ss-pad button{height:46px;font:600 clamp(20px,2.4vw,24px) ${FONT.serif};color:#f1e6c8;background:rgba(34,22,34,.95);border:1px solid rgba(184,154,82,.6);border-radius:6px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.ss-pad button:hover,.ss-pad button:focus-visible{border-color:#ffe08a;outline:none;background:rgba(66,40,56,.98)}
.ss-pad button.yes{background:#6a2a3a;border-color:#ffe08a}
.ss-moment{position:absolute;top:max(18px,env(safe-area-inset-top));left:0;right:0;text-align:center;font:italic 20px ${FONT.serif};color:#d9c9a0;text-shadow:0 2px 8px #000;pointer-events:none;animation:ssu .5s both}
@media (prefers-reduced-motion:reduce){.ss,.ss-stage,.ss-cap,.ss-cap .w,.ss-opt{transition:none;animation:none}.ss-paper,.ss-pad{animation:none}.ss-dot{animation:none}}
`;
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function playSession(id, { level: forced, nodes: given, warn = (...a) => console.warn('[session]', ...a) } = {}) {
  const nodes = given || SESSIONS[id]; // harness: nodes can be given
  if (!Array.isArray(nodes)) { warn('no such session', id); return; }
  css('story-session', CSS);
  const reduced = reducedMotion();
  const level = Math.max(0, Math.min(4, forced ?? (Number(/^s(\d+)$/.exec(id)?.[1]) || 0)));
  const stage = h('div.ss-stage'), ui = h('div.ss-ui');
  const root = h('div.ss', { role: 'dialog' }, stage, ui);
  const close = openOverlay(root);
  emit('cinema', true);
  requestAnimationFrame(() => root.classList.add('on'));
  const scene = createStage(stage, { session: level, found: foundIds() }); // SWAP
  stage.append(ui);
  setTimeout(() => root.classList.add('shown'), reduced ? 0 : 750);

  // ---- tap / key plumbing: `release` is what a tap does right now
  let release = null;
  root.addEventListener('pointerdown', (e) => { if (e.target.closest('button,input,select,.ss-paper')) return; release?.('tap'); });
  const onKey = (e) => {
    if (e.target?.closest?.('input,select')) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); release?.('tap'); }
    else if (/^[1-4]$/.test(e.key)) release?.(`n${e.key}`);
  };
  window.addEventListener('keydown', onKey, true);

  // ---- captions
  let cap = null, fadeT = 0;
  const dropCap = () => { clearTimeout(fadeT); if (cap) { const c = cap; cap = null; c.classList.add('out'); setTimeout(() => c.remove(), 380); } };
  const lingerCap = () => { clearTimeout(fadeT); fadeT = setTimeout(dropCap, 180); };
  async function say(who, text) {
    dropCap();
    if (!reduced) await sleep(120);
    const kind = who === 'tu' ? 'thought' : who === 'narra' ? 'narra' : '';
    const words = String(text ?? '').split(/\s+/).filter(Boolean).map((w) => h('span.w', w));
    const label = who && !['lettrice', 'narra', 'tu'].includes(who) ? h('small', who) : null;
    const dot = h('div.ss-dot');
    const el = h(`p.ss-cap${kind ? `.${kind}` : ''}`, label, ...words.flatMap((w, i) => (i ? [' ', w] : [w])));
    cap = el; ui.append(el, dot);
    if (who === 'lettrice') scene.speak();
    return new Promise((resolve) => {
      let i = 0, done = false, timer = 0;
      const all = () => { clearTimeout(timer); words.forEach((w) => w.classList.add('on')); done = true; dot.classList.add('on'); };
      const next = () => { if (i < words.length) { words[i++].classList.add('on'); timer = setTimeout(next, 62); } else { done = true; dot.classList.add('on'); } };
      if (reduced) all(); else next();
      let armed = 0;
      release = () => {
        if (!done) { all(); armed = performance.now() + 150; return; }
        if (performance.now() < armed) return;
        release = null; dot.remove(); lingerCap(); resolve();
      };
    });
  }

  // ---- choices: two cards of text (stacked on a phone)
  function choose(texts) {
    clearTimeout(fadeT);
    const list = h(`div.ss-choices${texts.length === 1 ? '.n1' : ''}`);
    return new Promise((resolve) => {
      const btns = texts.slice(0, 4).map((t, i) => h('button.ss-opt', { type: 'button', onclick: () => pick(i) }, t));
      btns.forEach((b) => list.append(b)); ui.append(list);
      const pick = async (i) => {
        release = null;
        btns.forEach((b, j) => b.classList.add(j === i ? 'yes' : 'no'));
        await sleep(reduced ? 0 : 420);
        list.remove(); dropCap(); resolve(i);
      };
      release = (how) => { const m = /^n(\d)$/.exec(how || ''); if (m && +m[1] <= btns.length) pick(+m[1] - 1); };
    });
  }

  // ---- a paper to write on
  const paper = (el) => new Promise((resolve) => { ui.append(el); el.__done = (v) => { el.remove(); resolve(v); }; });
  async function askName() {
    clearTimeout(fadeT);
    const inp = h('input', { type: 'text', maxLength: 20, autocomplete: 'off', autocapitalize: 'words', spellcheck: false, 'aria-label': 'Il tuo nome' });
    const ok = h('button.ss-btn', { type: 'button', disabled: true }, 'Ecco');
    const el = h('div.ss-paper', h('label', 'il tuo nome'), inp, h('div.ss-btns', h('span'), ok));
    const submit = () => { const v = inp.value.trim(); if (v) el.__done(v); };
    inp.addEventListener('input', () => { ok.disabled = !inp.value.trim(); });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    ok.addEventListener('click', submit);
    if (!matchMedia('(pointer: coarse)').matches) setTimeout(() => inp.focus(), 200);
    const name = await paper(el);
    dropCap();
    setPlayer({ name });
  }
  async function askBirth(api) {
    clearTimeout(fadeT);
    const day = h('select', { 'aria-label': 'Giorno' }, h('option', { value: '' }, '—'), ...Array.from({ length: 31 }, (_, i) => h('option', { value: i + 1 }, String(i + 1))));
    const month = h('select', { 'aria-label': 'Mese' }, h('option', { value: '' }, '—'), ...MONTHS.map((m, i) => h('option', { value: i + 1 }, m)));
    const year = h('input', { type: 'text', inputMode: 'numeric', maxLength: 4, placeholder: 'anno', 'aria-label': 'Anno', autocomplete: 'off' });
    const ok = h('button.ss-btn', { type: 'button', disabled: true }, 'Ecco');
    const skip = h('button.ss-link', { type: 'button' }, 'preferisco non dirlo');
    const el = h('div.ss-paper', h('label', 'quando sei nata'), h('div.ss-row', h('div', h('label', 'giorno'), day), h('div', h('label', 'mese'), month), h('div', h('label', 'anno'), year)), h('div.ss-btns', skip, ok));
    const valid = () => {
      const d = +day.value, m = +month.value, y = +year.value, max = new Date(2000, m, 0).getDate(); // 2000 is a leap year
      return d >= 1 && m >= 1 && d <= max && y >= 1900 && y <= new Date().getFullYear();
    };
    const check = () => { ok.disabled = !valid(); };
    [day, month, year].forEach((e) => e.addEventListener('input', check));
    year.addEventListener('input', () => { year.value = year.value.replace(/\D/g, ''); check(); });
    ok.addEventListener('click', () => el.__done({ d: +day.value, m: +month.value, y: +year.value }));
    skip.addEventListener('click', () => el.__done(null));
    const birth = await paper(el);
    dropCap();
    if (birth) {
      setPlayer({ birth });
      await say('lettrice', api.F('{sign}. Per nascita, la tua carta è {birthCard}.'));
    } else await say('lettrice', 'Va bene. Alcune cose si dicono più tardi.');
  }

  // ---- "dimmi un numero": a pad of 22
  function padNumber() {
    clearTimeout(fadeT);
    const wrap = h('div.ss-pad');
    return new Promise((resolve) => {
      for (let n = 1; n <= 22; n++) wrap.append(h('button', { type: 'button', onclick: async (e) => { e.currentTarget.classList.add('yes'); await sleep(reduced ? 0 : 280); wrap.remove(); dropCap(); resolve(n); } }, String(n)));
      ui.append(wrap);
    });
  }

  const sessionUi = {
    say, choose,
    cinema: async (lines) => { for (const l of lines) await say('narra', l); },
    moment: async (text) => { const el = h('div.ss-moment', text); root.append(el); await sleep(1700); el.remove(); },
    sleep,
  };
  const ext = async (node, api) => {
    if (node.ask === 'name') { await askName(); return true; }
    if (node.ask === 'birth') { await askBirth(api); return true; }
    if (node.turn) { dropCap(); await scene.layCard(node.turn); findCard(node.turn); return true; } // a card turned for her is hers (the Fool)
    if (node.shuffle) { dropCap(); await scene.shuffle(); return true; }
    if (node.symbol) { dropCap(); await scene.symbol(node.symbol); return true; } // SWAP: new node
    if (node.tableau) { dropCap(); await scene.tableau(node.tableau); return true; } // SWAP: new node
    if (node.pick === 'number') {
      const n = await padNumber(), cid = cardOfNumber(n);
      api.vars.picked = CARD[cid]?.name || cid; api.vars.pickedId = cid; api.vars.pickedNumber = n;
      await scene.layCard(cid);
      await api.exec(node.then);
      return true;
    }
    if (node.observe) {
      const hit = node.observe.find((o) => o && test(o.when));
      if (hit) await say('lettrice', api.F(hit.t));
      return true;
    }
    return false;
  };
  const runner = createRunner({ ui: sessionUi, call, ext, getScript: (sid) => SESSIONS[sid] || SCRIPTS[sid], warn });
  try { await sleep(reduced ? 0 : 1500); await runner.run(nodes); } finally {
    dropCap();
    root.classList.remove('shown');
    await sleep(reduced ? 0 : 900);
    root.classList.remove('on');
    await sleep(reduced ? 0 : 750);
    window.removeEventListener('keydown', onKey, true);
    scene.dispose(); close(); emit('cinema', false);
  }
}
