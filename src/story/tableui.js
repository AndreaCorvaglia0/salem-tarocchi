// The Reader's table, the DOM half: her lines as captions over the shadow-theatre stage and the
// choices as cards of text. Shared by sessions (session.js) and visits (visit.js). Every line goes
// through the tap gate (pace.js): it fades in word by word, a tap completes it, a second tap after a
// short pause goes on; the small light (the cue) shows only when a tap will be accepted.
//   const t = tableUi({ root, ui, scene, reduced })
//   await t.say(who, text, { ask })   ask: a question, the choices follow without a tap
//   await t.choose(texts) -> index    t.dropCap()   t.hold()  (keep the caption: a paper or pad comes)
//   t.release: what a tap does now (session.js sets it for its own widgets)   t.dispose()
import { h } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { gate, isTapKey } from './pace.js';
import { hintOnce } from '../core/progress.js';
import { normalizeChoices } from './special.js';

export const TABLE_CSS = `
.ss{position:fixed;inset:0;z-index:35;background:#000;font-family:${FONT.serif};color:#efe4cc;opacity:0;transition:opacity .7s;overflow:hidden;-webkit-user-select:none;user-select:none;touch-action:manipulation}
.ss.on{opacity:1}
.ss-stage{position:absolute;inset:0;opacity:0;transition:opacity 1.4s}
.ss.shown .ss-stage{opacity:1}
.ss-ui{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;gap:14px;padding:70px 18px max(18px,env(safe-area-inset-bottom));box-sizing:border-box;background:linear-gradient(rgba(3,2,6,0),rgba(3,2,6,.82) 55%);pointer-events:none}
.ss-ui>*{pointer-events:auto}
.ss-cap{width:min(100%,640px);min-height:1.4em;margin:0;font-size:clamp(21px,2.5vw,26px);line-height:1.42;text-align:center;text-shadow:0 2px 10px #000,0 0 3px #000;text-wrap:balance;transition:opacity .35s;pointer-events:none}
.ss-cap.out{opacity:0}
.ss-cap .w{opacity:0;transition:opacity .55s}
.ss-cap .w.on{opacity:1}
.ss-cap.thought{font-style:italic;color:#bcb4d8}
.ss-cap.narra{font-style:italic;color:#b9ad92;font-size:clamp(19px,2.2vw,23px)}
.ss-cap small{display:block;margin-bottom:4px;font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:#a9976a}
.ss-cue{display:flex;align-items:center;gap:8px;height:18px;font:italic 15px ${FONT.serif};color:rgba(240,214,160,.7);opacity:0;transition:opacity .4s;pointer-events:none}
.ss-cue.on{opacity:1}
.ss-dot{width:7px;height:7px;border-radius:50%;background:#ffd58a;box-shadow:0 0 10px #ffb35c;animation:ssd 1.8s ease-in-out infinite}
@keyframes ssd{50%{transform:scale(.55);opacity:.3}}
.ss-choices{display:grid;grid-template-columns:1fr;gap:12px;width:min(100%,700px)}
@media (min-width:720px){.ss-choices{grid-template-columns:1fr 1fr}.ss-choices.n1{grid-template-columns:1fr}}
.ss-opt{position:relative;min-height:74px;padding:14px 18px;font:inherit;font-size:clamp(19px,2.1vw,22px);line-height:1.34;text-align:left;color:#f1e6c8;background:linear-gradient(160deg,rgba(46,30,40,.96),rgba(22,14,24,.97));border:1px solid rgba(184,154,82,.7);border-radius:7px;box-shadow:inset 0 0 0 4px rgba(10,6,12,.7),inset 0 0 0 5px rgba(184,154,82,.28),0 8px 22px rgba(0,0,0,.6);cursor:pointer;-webkit-tap-highlight-color:transparent;animation:ssu .5s ease-out both;transition:transform .25s,opacity .4s,border-color .2s}
.ss-opt:nth-child(2){animation-delay:.12s}.ss-opt:nth-child(3){animation-delay:.24s}.ss-opt:nth-child(4){animation-delay:.36s}
.ss-opt:hover,.ss-opt:focus-visible{border-color:#ffe08a;outline:none;transform:translateY(-3px)}
.ss-opt.no{opacity:0;transform:scale(.97)}.ss-opt.yes{border-color:#ffe08a;box-shadow:inset 0 0 0 4px rgba(10,6,12,.7),0 0 28px rgba(255,190,90,.5)}
.ss-opt[disabled]{pointer-events:none}
.ss-opt.sp{border-color:#e2b84e;background:linear-gradient(160deg,rgba(58,40,30,.96),rgba(26,16,20,.97));box-shadow:inset 0 0 0 4px rgba(10,6,12,.7),inset 0 0 0 5px rgba(226,184,78,.45),0 0 18px rgba(226,184,78,.18),0 8px 22px rgba(0,0,0,.6)}
.ss-opt .tg{display:block;margin-bottom:4px;font-size:14px;line-height:1.1;letter-spacing:.14em;font-variant:small-caps;text-transform:lowercase;color:#e9c76c}
.ss-opt .tg::before{content:'✦ ';letter-spacing:0}
@keyframes ssu{from{opacity:0;transform:translateY(14px)}}
.sgc{transition:opacity .5s}
.ss.asking .sgc{opacity:.22}
.ss-back{position:absolute;top:max(14px,env(safe-area-inset-top));left:12px;z-index:5;min-height:40px;padding:6px 14px;border-radius:20px;border:1px solid rgba(217,201,160,.35);background:rgba(0,0,0,.35);color:#d9c9a0;font:italic 17px ${FONT.serif};cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s}
.ss-back.on{opacity:1;pointer-events:auto}
.ss-back:disabled{opacity:0;pointer-events:none}
.ss-moment{position:absolute;top:max(18px,env(safe-area-inset-top));left:0;right:0;text-align:center;font:italic 20px ${FONT.serif};color:#d9c9a0;text-shadow:0 2px 8px #000;pointer-events:none;animation:ssu .5s both}
@media (prefers-reduced-motion:reduce){.ss,.ss-stage,.ss-cap,.ss-cap .w,.ss-opt,.ss-cue{transition:none;animation:none}.ss-dot{animation:none}}
`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const WORD_MS = 70; // a calm reading pace, word by word

export function tableUi({ root, ui, scene, reduced = false }) {
  const t = { release: null };
  root.addEventListener('pointerdown', (e) => { if (e.target.closest('button,input,select,.ss-paper')) return; t.release?.('tap'); });
  const onKey = (e) => {
    if (e.target?.closest?.('input,select')) return;
    if (isTapKey(e)) { e.preventDefault(); e.stopPropagation(); t.release?.('tap'); }
    else if (/^[1-6]$/.test(e.key) && !e.repeat) t.release?.(`n${e.key}`);
  };
  window.addEventListener('keydown', onKey, true);

  let cap = null, cue = null, fadeT = 0;
  // going back: the lines already said in this encounter can be read again, one tap back at a time
  const history = [];
  const backBtn = h('button.ss-back', { type: 'button', 'aria-label': 'Rileggi la frase precedente', onclick: () => t.back?.() }, '‹ indietro');
  root.append(backBtn);
  const capClass = (kind) => `ss-cap${kind ? ` ${kind}` : ''}`;
  const capKids = ({ label, text }) => [label ? h('small', label) : null, ...String(text ?? '').split(/\s+/).filter(Boolean).flatMap((w, i) => (i ? [' ', h('span.w.on', w)] : [h('span.w.on', w)]))].filter(Boolean);
  t.dropCap = () => {
    clearTimeout(fadeT); cue?.remove(); cue = null;
    if (cap) { const c = cap; cap = null; c.classList.add('out'); setTimeout(() => c.remove(), 380); }
  };
  const lingerCap = () => { clearTimeout(fadeT); fadeT = setTimeout(t.dropCap, 180); };
  t.hold = () => clearTimeout(fadeT);

  t.say = async (who, text, { ask = false } = {}) => {
    t.dropCap();
    if (!reduced) await sleep(160);
    const kind = who === 'tu' ? 'thought' : who === 'narra' ? 'narra' : '';
    const words = String(text ?? '').split(/\s+/).filter(Boolean).map((w) => h('span.w', w));
    const label = who && !['lettrice', 'narra', 'tu'].includes(who) ? h('small', who) : null;
    const el = h(`p.ss-cap${kind ? `.${kind}` : ''}`, label, ...words.flatMap((w, i) => (i ? [' ', w] : [w])));
    cue = h('div.ss-cue', h('i.ss-dot'), h('span', 'tocca'));
    const myCue = cue;
    cap = el; ui.append(el, cue);
    if (who === 'lettrice') scene?.speak?.();
    let i = 0, timer = 0;
    const g = gate({
      auto: ask,
      start: (done) => {
        if (reduced) { words.forEach((w) => w.classList.add('on')); done(); return; }
        const next = () => { if (i < words.length) { words[i++].classList.add('on'); timer = setTimeout(next, WORD_MS); } else timer = setTimeout(done, 400); }; // the last word's fade
        next();
      },
      finish: () => { clearTimeout(timer); words.forEach((w) => w.classList.add('on')); },
      onReady: () => { myCue.classList.add('on'); hintOnce('tap'); }, // the first line that waits for a tap
    });
    history.push({ kind, text, label: label ? who : null });
    let view = history.length - 1;
    const paint = () => { const l = history[view]; el.className = capClass(l.kind); el.replaceChildren(...capKids(l)); backBtn.disabled = view === 0; };
    t.back = () => { if (view > 0) { view -= 1; paint(); } };
    t.release = () => { if (view < history.length - 1) { view += 1; paint(); } else g.tap(); };
    backBtn.disabled = view === 0; backBtn.classList.toggle('on', !ask);
    await g.done;
    t.release = null; t.back = null; backBtn.classList.remove('on');
    myCue.remove(); if (cue === myCue) cue = null;
    if (!ask) lingerCap(); // a question stays above its choices
  };

  // two cards of text (stacked on a phone); they appear once the question is fully shown. Special
  // answers (story/special.js: texts as { t, special, tag } or metas[i]) come last, gold-edged, tag above.
  t.choose = (texts, metas) => {
    const items = normalizeChoices(texts, metas).slice(0, 6);
    clearTimeout(fadeT);
    const list = h(`div.ss-choices${items.length === 1 ? '.n1' : ''}`);
    root.classList.add('asking'); // the cards on the table recede under the choices
    return new Promise((resolve) => {
      let picked = false;
      const pick = async (i) => {
        if (picked) return; picked = true;
        t.release = null;
        btns.forEach((b, j) => { b.disabled = true; b.classList.add(j === i ? 'yes' : 'no'); });
        await sleep(reduced ? 0 : 420);
        list.remove(); t.dropCap(); root.classList.remove('asking'); resolve(i);
      };
      const btns = items.map(({ t: x, meta }, i) => (meta
        ? h('button.ss-opt.sp', { type: 'button', onclick: () => pick(i) }, h('span.tg', meta.tag || ''), x)
        : h('button.ss-opt', { type: 'button', onclick: () => pick(i) }, x)));
      btns.forEach((b) => list.append(b)); ui.append(list);
      t.release = (how) => { const m = /^n(\d)$/.exec(how || ''); if (m && +m[1] <= btns.length) pick(+m[1] - 1); };
    });
  };

  t.moment = async (text) => { const el = h('div.ss-moment', text); root.append(el); await sleep(1900); el.remove(); };
  t.dispose = () => { t.dropCap(); window.removeEventListener('keydown', onKey, true); };
  return t;
}
