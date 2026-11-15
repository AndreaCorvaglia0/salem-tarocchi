// A session with the Reader: full screen, the shadow-theatre stage (stage/) and the DOM on top:
// her lines as captions (never a face), choices as two cards of text, a paper to write on, a pad of
// numbers. The script itself is run by runner.js; this file gives it a UI and the session nodes
// (ask, turn, pick, observe, portrait). Captions and choices: tableui.js (paced by pace.js).
import { h, css, openOverlay, reducedMotion } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { emit } from '../core/bus.js';
import { call } from '../core/services.js';
import { test } from '../core/cond.js';
import { setPlayer, foundIds, findCard, tellCard, snapshot, hintOnce } from '../core/progress.js';
import { CARD } from '../data/cards.base.js';
import { SESSIONS, SCRIPTS } from '../data/story/index.js';
import { createRunner, cardOfNumber } from './runner.js';
import { createStage } from './stage/index.js';
import { tableUi, TABLE_CSS } from './tableui.js';
import { portraitLines } from './portrait.js';

const CSS = `
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
@media (prefers-reduced-motion:reduce){.ss-paper,.ss-pad{animation:none}}
`;
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function playSession(id, { level: forced, warn = (...a) => console.warn('[session]', ...a) } = {}) {
  const nodes = SESSIONS[id];
  if (!Array.isArray(nodes)) { warn('no such session', id); return; }
  css('story-table', TABLE_CSS); css('story-session', CSS);
  const reduced = reducedMotion();
  const level = Math.max(0, Math.min(4, forced ?? (Number(/^s(\d+)$/.exec(id)?.[1]) || 0)));
  const stage = h('div.ss-stage'), ui = h('div.ss-ui');
  const root = h('div.ss', { role: 'dialog' }, stage, ui);
  const close = openOverlay(root);
  emit('cinema', true);
  requestAnimationFrame(() => root.classList.add('on'));
  // the music: a mood of its own, held so that a reading or an Exam inside it comes back to it
  const sessionMood = id === 's4' ? 'ending' : 'session';
  call('sound.hold', sessionMood); call('sound.mood', sessionMood);
  const scene = createStage(stage, { session: level, found: foundIds() });
  stage.append(ui);
  setTimeout(() => root.classList.add('shown'), reduced ? 0 : 750);

  const T = tableUi({ root, ui, scene, reduced });
  const { say, choose } = T, dropCap = T.dropCap;

  // ---- a paper to write on
  const paper = (el) => new Promise((resolve) => { T.hold(); ui.append(el); el.__done = (v) => { el.remove(); resolve(v); }; });
  async function askName() {
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
    const day = h('select', { 'aria-label': 'Giorno' }, h('option', { value: '' }, '—'), ...Array.from({ length: 31 }, (_, i) => h('option', { value: i + 1 }, String(i + 1))));
    const month = h('select', { 'aria-label': 'Mese' }, h('option', { value: '' }, '—'), ...MONTHS.map((m, i) => h('option', { value: i + 1 }, m)));
    const year = h('input', { type: 'text', inputMode: 'numeric', maxLength: 4, placeholder: 'anno', 'aria-label': 'Anno', autocomplete: 'off' });
    const ok = h('button.ss-btn', { type: 'button', disabled: true }, 'Ecco');
    const skip = h('button.ss-link', { type: 'button' }, 'preferisco non dirlo');
    const el = h('div.ss-paper', h('label', 'quando sei nata'), h('div.ss-row', h('div', h('label', 'giorno'), day), h('div', h('label', 'mese'), month), h('div', h('label', 'anno'), year)), h('div.ss-btns', skip, ok));
    const valid = () => {
      const d = +day.value, m = +month.value, y = +year.value, max = new Date(2000, m, 0).getDate(); // 2000 is a leap year
      const yearOk = !year.value || (y >= 1900 && y <= new Date().getFullYear()); // the year may stay empty
      return d >= 1 && m >= 1 && d <= max && yearOk;
    };
    const check = () => { ok.disabled = !valid(); };
    [day, month, year].forEach((e) => e.addEventListener('input', check));
    year.addEventListener('input', () => { year.value = year.value.replace(/\D/g, ''); check(); });
    ok.addEventListener('click', () => el.__done({ d: +day.value, m: +month.value, y: +year.value || null }));
    skip.addEventListener('click', () => el.__done(null));
    const birth = await paper(el);
    dropCap();
    if (birth) setPlayer({ birth }); // the session's own lines follow (with a hasBirth: false branch)
    void api;
  }

  // ---- "dimmi un numero": a pad of 22
  function padNumber() {
    T.hold();
    const wrap = h('div.ss-pad');
    root.classList.add('asking');
    return new Promise((resolve) => {
      for (let n = 1; n <= 22; n++) wrap.append(h('button', { type: 'button', onclick: async (e) => { e.currentTarget.classList.add('yes'); await sleep(reduced ? 0 : 280); wrap.remove(); dropCap(); root.classList.remove('asking'); resolve(n); } }, String(n)));
      ui.append(wrap);
      hintOnce('number');
    });
  }

  const sessionUi = {
    say, choose,
    cinema: async (lines) => { for (const l of lines) await say('narra', l); },
    moment: T.moment,
    sleep,
  };
  const ext = async (node, api) => {
    if (node.ask === 'name') { await askName(); return true; }
    if (node.ask === 'birth') { await askBirth(api); return true; }
    if (node.turn) { dropCap(); call('sound.play', 'card'); await scene.layCard(node.turn); findCard(node.turn); tellCard(node.turn); return true; } // a card the Reader turns for her is hers, and told (the Fool)
    if (node.symbol) { dropCap(); await scene.symbol(node.symbol); return true; } // a smoke symbol: { symbol: 'moon' }
    if (node.tableau) { dropCap(); await scene.tableau(node.tableau); return true; } // another picture: { tableau: 'last' }
    if (node.shuffle) { dropCap(); await scene.shuffle(); return true; }
    if (node.pick === 'number') {
      const n = await padNumber(), cid = cardOfNumber(n);
      api.vars.picked = CARD[cid]?.name || cid; api.vars.pickedId = cid; api.vars.pickedNumber = n;
      call('sound.play', 'card');
      await scene.layCard(cid);
      if (node.read?.[cid]) await say('lettrice', api.F(node.read[cid])); // what that card says to her now
      await api.exec(node.then);
      return true;
    }
    if (node.portrait) { await portrait(api); return true; }
    if (node.observe) {
      const hit = node.observe.find((o) => o && test(o.when));
      if (hit) await say('lettrice', api.F(hit.t));
      return true;
    }
    return false;
  };
  // the final portrait (portraitLines below)
  async function portrait(api) {
    for (const line of portraitLines()) await say('lettrice', api.F(line));
  }
  const runner = createRunner({ ui: sessionUi, call, ext, getScript: (sid) => SESSIONS[sid] || SCRIPTS[sid], warn });
  // the room and the candle are seen for a breath before the first line
  try { await sleep(reduced ? 0 : 3000); await runner.run(nodes); } finally {
    snapshot(); // every encounter with the Reader leaves a snapshot of the portrait
    T.dispose();
    root.classList.remove('shown');
    await sleep(reduced ? 0 : 900);
    root.classList.remove('on');
    await sleep(reduced ? 0 : 750);
    scene.dispose(); close(); emit('cinema', false);
    call('sound.hold', null); call('sound.back');
  }
}
