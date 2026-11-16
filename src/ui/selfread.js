// «Una lettura per me»: she reads the cards for herself. The Reader's few words (the first time only), the
// theme by the engine's either/or tree, an optional line in her own words, the spread, then the cards: drawn
// here by instinct (draw.pick fan, from her voiced cards) or the real cards she drew at home (a picker of all
// 78, upright or reversed). The engine composes the reading, shown card by card, calm, no quiz; a note of hers
// and «Tieni nel diario». readingScreen() also shows a saved reading again (ui/readings.js).
// Rules: glue/selfread.rules.js. Saving goes through the services of glue/selfread.js.
import { h, css, cardUrl, openOverlay } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { call, has } from '../core/services.js';
import { state } from '../core/state.js';
import { ownedIds } from '../core/progress.js';
import { CARD } from '../data/cards.base.js';
import { SPREADS } from '../data/spreads.js';
import { TREE, walk, AMBITO_LABEL, FORMA_LABEL, hasVoice, voiceIds, drawCards, voice } from '../reading/index.js';
import { spreadsFor, PICK_TABS, pickerCards, realCards, makeEntry, compose, dateIt } from '../glue/selfread.rules.js';
import { snd } from './sfx.js';

const CSS = `
.sr{--ink:#120d17;--panel:#1d1626;--panel2:#271d33;--line:#43344f;--paper:#f0e6cf;--dim:#bdae96;--gold:#e0b95e;--gold-ink:#2a1d05;
  position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;color:var(--paper);font:19px/1.4 ${FONT.serif};
  background:radial-gradient(ellipse at 50% -10%,#2f2142 0%,var(--ink) 65%);padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom);touch-action:manipulation}
.sr *{box-sizing:border-box}
.sr button,.sr input,.sr textarea{font:inherit;color:inherit;-webkit-tap-highlight-color:transparent}
.sr-top{flex:none;display:flex;align-items:center;gap:10px;min-height:50px;padding:4px 8px 4px 14px;border-bottom:1px solid var(--line);background:#160f1dcc}
.sr-top h2{flex:1;margin:0;font-size:19px;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sr-x{min-width:48px;height:48px;border:0;background:none;color:var(--dim);font-size:26px;cursor:pointer}
.sr-body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;touch-action:pan-y}
.sr-col{max-width:560px;margin:0 auto;padding:12px 14px 20px;display:flex;flex-direction:column;gap:12px}
.sr-foot{flex:none;display:flex;gap:10px;padding:10px max(14px,calc((100% - 560px) / 2)) 14px;border-top:1px solid var(--line);background:#160f1dee}
.sr-foot[hidden]{display:none}
.sr-foot .sr-b{flex:1}
.sr-b{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:52px;padding:6px 18px;border-radius:12px;border:1.5px solid var(--line);background:var(--panel2);cursor:pointer;font-size:19px;text-align:center}
.sr-b small{color:var(--dim);font-size:15px}
.sr-b.go{background:var(--gold);border-color:var(--gold);color:var(--gold-ink);font-weight:700}
.sr-b.ghost{background:none}
.sr-b:disabled{opacity:.45;cursor:default}
.sr-b:active{transform:scale(.98)}
.sr-q{margin:14px 0 6px;text-align:center;font-size:24px;line-height:1.25}
.sr-pair{display:flex;flex-direction:column;gap:12px}
.sr-pair .sr-b{min-height:76px;font-size:22px}
.sr-lab{margin:0;color:var(--dim);font-size:16px;letter-spacing:.03em}
.sr-say{padding:12px 15px;border-radius:4px 14px 14px 14px;background:#f0e6cf;color:#2a2030;font-size:19px;line-height:1.4;font-style:italic}
.sr-say b{display:block;font-style:normal;font-weight:400;font-size:15px;color:#6b5a48;letter-spacing:.04em;text-transform:uppercase;margin-bottom:2px}
.sr-in{animation:srin .4s ease-out both}
@keyframes srin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.sr-theme{padding:10px 14px;border-left:3px solid var(--gold);background:#ffffff08;border-radius:0 10px 10px 0}
.sr-theme b{display:block;font-weight:400;font-size:20px}
.sr-theme i{display:block;margin-top:3px;font-size:17px;color:#fff7e3}
.sr-field{width:100%;min-height:52px;padding:10px 12px;border-radius:10px;border:1.5px solid var(--line);background:#0e0a13;font:24px/1.2 ${FONT.hand};color:#f3dfa6;outline:none;resize:none}
.sr-field:focus{border-color:var(--gold)}
.sr-field::placeholder{color:#bdae9688;font-family:${FONT.serif};font-size:17px;font-style:italic}
.sr-tabs{display:flex;gap:5px;overflow-x:auto;padding-bottom:2px}
.sr-tabs button{flex:none;min-height:44px;padding:0 9px;border-radius:22px;border:1.5px solid var(--line);background:none;cursor:pointer;font-size:16px}
.sr-tabs button.on{background:var(--gold);color:var(--gold-ink);border-color:var(--gold)}
.sr-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.sr-c{display:flex;flex-direction:column;gap:3px;padding:0;border:0;background:none;cursor:pointer;text-align:center;min-width:0}
.sr-c i{display:block;width:100%;aspect-ratio:350/600;border-radius:7px;background:#0b0710 center/cover no-repeat;box-shadow:0 3px 8px #000a}
.sr-c span{font-size:13px;line-height:1.1;color:var(--dim);min-height:2.2em}
.sr-c.sel i{box-shadow:0 0 0 3px var(--gold),0 0 14px #ffd97a88}
.sr-c:disabled{opacity:.3}
.sr-tog{display:flex;align-items:center;gap:10px;min-height:46px;padding:4px 14px;border:1.5px solid var(--line);border-radius:12px;background:none;cursor:pointer;font-size:17px}
.sr-tog i{flex:none;width:24px;height:24px;border-radius:6px;border:2px solid var(--dim);display:grid;place-items:center;font-style:normal;color:var(--gold-ink)}
.sr-tog.on i{background:var(--gold);border-color:var(--gold)}
.sr-pos{display:flex;align-items:center;justify-content:space-between;gap:10px}
.sr-pos h3{margin:0;font-weight:400;font-size:22px}
.sr-list{display:flex;flex-direction:column;gap:10px}
.sr-item{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-left:3px solid var(--gold);background:#ffffff0a;border-radius:0 8px 8px 0}
.sr-fig{flex:none;width:50px;display:flex;flex-direction:column;align-items:center;gap:3px}
.sr-fig i{display:block;width:50px;aspect-ratio:350/600;border-radius:6px;background:#0b0710 center/cover no-repeat;box-shadow:0 3px 8px #000a,0 0 0 1px #e0b95e55}
.sr-fig.rev i{transform:rotate(180deg)}
.sr-fig small{color:var(--dim);font-size:12px;font-style:italic}
.sr-item small.p{display:block;color:var(--dim);font-size:14px;letter-spacing:.04em;text-transform:uppercase}
.sr-item .nm{display:block;color:var(--gold);font-size:16px}
.sr-item .e{font-family:${FONT.hand};font-size:23px;line-height:1.1;color:#f3dfa6}
.sr-item p{margin:3px 0 0;font-size:17px;line-height:1.35}
.sr-glance{padding:8px 12px;border-radius:10px;background:#ffffff08;font-size:17px;font-style:italic}
.sr-close{padding:10px 14px;border-left:3px solid var(--gold);font-size:19px;font-style:italic;color:#fff7e3}
.sr-close+.sr-close{margin-top:-6px}
`;

// ---- a screen of its own (the reading screens of src/systems are another area) -------------------------
function screen(title, onClose) {
  css('ui-selfread', CSS);
  const col = h('div.sr-col'), body = h('div.sr-body', col), foot = h('div.sr-foot', { hidden: true });
  const el = h('div.sr', { role: 'dialog', 'aria-label': title }, h('div.sr-top', h('h2', title), h('button.sr-x', { type: 'button', 'aria-label': 'Chiudi', onclick: () => onClose() }, '×')), body, foot);
  const close = openOverlay(el);
  return {
    el, close,
    body(...n) { col.replaceChildren(...n.flat(Infinity).filter(Boolean)); body.scrollTop = 0; },
    foot(...n) { const k = n.flat(Infinity).filter(Boolean); foot.replaceChildren(...k); foot.hidden = !k.length; },
  };
}
const B = (label, onclick, cls = '') => h(`button.sr-b${cls ? `.${cls}` : ''}`, { type: 'button', onclick: (e) => { snd('tap'); onclick(e); } }, label);
const toggle = (label, on, onchange) => {
  const b = h('button.sr-tog', { type: 'button' }, h('i'), h('span', label));
  const set = () => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); b.firstChild.textContent = on ? '✓' : ''; };
  b.onclick = () => { on = !on; set(); onchange(on); };
  set();
  return b;
};

// ---- the reading on screen: card by card, then the glance, the closing ---------------------------------
const PLAIN = { ppf: { past: 'Passato', present: 'Presente', future: 'Futuro' } };
export const posLabel = (spread, pos) => {
  const sp = SPREADS[spread];
  if (sp.positions.length === 1) return 'La carta';
  return PLAIN[spread]?.[pos] || sp.positions.find((p) => p.id === pos)?.label || pos;
};
const fig = (id, rev) => h(`div.sr-fig${rev ? '.rev' : ''}`, h('i', { style: { backgroundImage: `url(${cardUrl(id)})` }, role: 'img', 'aria-label': CARD[id]?.name || id }), rev ? h('small', 'rovesciata') : null);
export const themeBox = (q, who, real) => h('div.sr-theme', who && who !== 'me' ? h('span.sr-lab', `Per ${who}`) : null,
  h('b', `${AMBITO_LABEL[q.ambito]} · ${FORMA_LABEL[q.forma]}`), q.text ? h('i', `«${q.text}»`) : null,
  real ? h('span.sr-lab', 'Con il mio mazzo vero') : null);

export function readingNodes(entry) {
  const r = compose(entry);
  const items = entry.cards.map((c, i) => h('div.sr-item.sr-in', { style: { animationDelay: `${i * 0.35}s` } }, fig(c.card, c.rev),
    h('div', h('small.p', posLabel(entry.spread, c.pos)), h('span.nm', CARD[c.card]?.name || c.card),
      h('div.e', voice(c.card)?.[c.rev ? 'rev' : 'up']?.essenza || ''), r.parts[i]?.text ? h('p', r.parts[i].text) : null)));
  const late = { style: { animationDelay: `${entry.cards.length * 0.35}s` } };
  return [
    h('div.sr-list', items),
    r.scan.length ? [h('p.sr-lab.sr-in', late, "Colpo d'occhio"), h('div.sr-glance.sr-in', late, r.scan.join(' '))] : null,
    r.closing ? h('div.sr-close.sr-in', late, r.closing) : null,
    r.advice ? h('div.sr-close.sr-in', late, r.advice) : null,
  ];
}

// ---- the Reader, the first time ------------------------------------------------------------------------
const INTRO = [
  'Vuoi leggere le carte per te. È più difficile che leggerle per un\'altra persona, perché quando la domanda è tua una risposta, in fondo, la speri già.',
  'Quando qualcuno si siede davanti a me, lo guardo in faccia e vedo molte cose che le carte da sole non dicono. Da così lontano, invece, vedo molto meno.',
  'Per questo stasera le carte ti parleranno a grandi linee, e il resto dovrai metterlo tu, con il tuo istinto.',
  'Non avere fretta di capire tutto subito. Quello che senti mentre le guardi conta quanto quello che dicono.',
];
async function intro(scr) {
  for (let i = 0; i < INTRO.length; i++) {
    scr.body(h('div.sr-say.sr-in', h('b', 'La Lettrice'), INTRO[i]));
    const b = B(i === INTRO.length - 1 ? 'Comincio' : 'Avanti', () => {}, 'go');
    b.disabled = true;
    scr.foot(b);
    await new Promise((res) => { setTimeout(() => { b.disabled = false; }, 700); b.onclick = () => { snd('tap'); res(); }; });
  }
}

// ---- the steps -----------------------------------------------------------------------------------------
// The theme: one either/or question at a time; back goes to the question before. Resolves { ambito, forma, text } or null (back from the first).
function theme(scr, start = { answers: [], text: '' }) {
  return new Promise((res) => {
    const answers = [...start.answers];
    let text = start.text;
    const draw = () => {
      const w = walk(TREE, answers);
      if (!w.done) {
        scr.body(h('p.sr-q.sr-in', w.node.q), h('div.sr-pair', w.node.options.map((o, k) => B(o.label, () => { answers.push(k); draw(); }))));
        scr.foot(B('Indietro', () => { if (answers.length) { answers.pop(); draw(); } else res(null); }, 'ghost'));
        return;
      }
      const field = h('input.sr-field', { type: 'text', maxLength: 200, value: text, placeholder: 'Scrivi la domanda con parole tue', 'aria-label': 'Scrivi la domanda con parole tue', autocomplete: 'off', oninput: () => { text = field.value; } });
      scr.body(themeBox({ ambito: w.ambito, forma: w.forma }), field);
      scr.foot(B('Indietro', () => { answers.pop(); draw(); }, 'ghost'), B('Avanti', () => res({ ambito: w.ambito, forma: w.forma, text: text.trim(), answers }), 'go'));
    };
    draw();
  });
}
const choose = (scr, prompt, opts) => new Promise((res) => {
  scr.body(h('p.sr-q.sr-in', prompt), h('div.sr-pair', opts.map(([label, sub, v]) => B([h('span', label), sub ? h('small', sub) : null], () => res(v)))));
  scr.foot(B('Indietro', () => res(null), 'ghost'));
});

// The cards drawn here: face-down fan per position (draw.pick), from her voiced cards (all voiced ones when too few).
async function drawHere(scr, spread) {
  const sp = SPREADS[spread], N = sp.positions.length;
  scr.body(h('p.sr-q.sr-in', 'Mescola con calma, e aspetta la carta che ti chiama.'));
  const go = await new Promise((res) => scr.foot(B('Indietro', () => res(false), 'ghost'), B('Mescolo', () => res(true), 'go')));
  if (!go) return null;
  scr.foot();
  let pool = ownedIds().filter((id) => hasVoice(id));
  if (pool.length < N) pool = voiceIds().filter((id) => CARD[id]);
  const reversed = !!(state.flags?.['lesson.reversed'] || state.lessons?.reversed);
  const out = [];
  for (let i = 0; i < N; i++) {
    const left = pool.filter((id) => !out.some((c) => c.card === id));
    const id = await call('draw.pick', { mode: 'fan', pool: left, title: N > 1 ? `${posLabel(spread, sp.positions[i].id)} (${i + 1} di ${N})` : 'La tua carta' });
    if (!id) return null;
    out.push({ pos: sp.positions[i].id, card: id, rev: reversed && drawCards('single', { pool: [id], reversals: true })[0].rev });
  }
  return out;
}

// The real cards she drew at home: for each position, suit tabs, then the card, and upright or reversed.
function pickReal(scr, spread) {
  const sp = SPREADS[spread], N = sp.positions.length;
  const picks = new Array(N).fill(null);
  let i = 0, tab = 'm';
  return new Promise((res) => {
    const draw = () => {
      const cur = picks[i] || { card: null, rev: false };
      const taken = new Set(picks.filter((p, k) => p && k !== i).map((p) => p.card));
      const grid = h('div.sr-grid', pickerCards(tab).map((id) => h(`button.sr-c${cur.card === id ? '.sel' : ''}`, {
        type: 'button', disabled: taken.has(id), 'aria-label': CARD[id].name,
        onclick: () => { picks[i] = { card: id, rev: cur.rev }; snd('tap'); draw(); },
      }, h('i', { style: { backgroundImage: `url(${cardUrl(id)})` } }), h('span', CARD[id].arcana === 'major' ? `${CARD[id].roman} ${CARD[id].name.replace(/^(Il|La|Lo|L'|Gli|Le) ?/, '')}` : CARD[id].name))));
      const tabs = h('div.sr-tabs', PICK_TABS.map(([k, l]) => h(`button${tab === k ? '.on' : ''}`, { type: 'button', onclick: () => { tab = k; draw(); } }, l)));
      const rev = toggle('Rovesciata', cur.rev, (v) => { picks[i] = { card: picks[i]?.card ?? null, rev: v }; });
      scr.body(h('div.sr-pos', h('h3', posLabel(spread, sp.positions[i].id)), N > 1 ? h('span.sr-lab', `${i + 1} di ${N}`) : null), h('div', { style: { display: 'flex', justifyContent: 'flex-end' } }, rev), tabs, grid);
      const next = B(cur.card ? CARD[cur.card].name : 'Quale carta?', () => {
        if (i < N - 1) { i++; draw(); } else res(realCards(spread, picks));
      }, 'go');
      next.disabled = !cur.card;
      scr.foot(B('Indietro', () => { if (i) { i--; draw(); } else res(null); }, 'ghost'), next);
    };
    draw();
  });
}

// ---- the whole flow ------------------------------------------------------------------------------------
export function openSelfRead() {
  return new Promise((done) => {
    let closed = false;
    const scr = screen('Una lettura per me', () => finish());
    const finish = () => { if (closed) return; closed = true; scr.close(); call('sound.back'); done(); };
    const guard = (p) => p.then((v) => (closed ? new Promise(() => {}) : v)); // stop the flow once closed
    call('sound.mood', 'reading');
    (async () => {
      const seen = await call('selfread.intro');
      if (!seen) await guard(intro(scr));
      let q = { answers: [], text: '' }, spread = null, how = null, cards = null;
      for (let stage = 0; stage < 4;) {
        if (stage === 0) { const t = await guard(theme(scr, q)); if (!t) return finish(); q = t; stage = 1; }
        else if (stage === 1) {
          const list = spreadsFor(state.spreads);
          spread = await guard(choose(scr, 'Quante carte?', list.map((id) => [SPREADS[id].name, id === 'single' ? 'una carta' : `${SPREADS[id].positions.length} carte`, id])));
          stage = spread ? 2 : 0;
        } else if (stage === 2) {
          how = await guard(choose(scr, 'Le carte', [['Pesco qui', null, 'here'], ['Le ho pescate io', 'con il mio mazzo, a casa', 'real']]));
          stage = how ? 3 : 1;
        } else {
          cards = await guard(how === 'here' ? drawHere(scr, spread) : pickReal(scr, spread));
          stage = cards ? 4 : 2;
        }
      }
      const entry = makeEntry({ at: new Date().toISOString(), who: 'me', question: { ambito: q.ambito, forma: q.forma, text: q.text }, spread, cards, real: how === 'real' });
      const note = h('textarea.sr-field', { rows: 2, maxLength: 600, placeholder: 'Una nota mia', 'aria-label': 'Una nota mia' });
      scr.body(themeBox(entry.question, 'me', entry.real), readingNodes(entry), h('p.sr-lab', { style: { marginTop: '8px' } }, 'Una nota mia'), note);
      scr.foot(B('Tieni nel diario', async () => {
        entry.note = note.value.trim().slice(0, 600);
        await call('readings.keep', entry);
        if (has('hud.toast')) call('hud.toast', 'L\'ho scritta nel diario delle letture.');
        finish();
      }, 'go'));
    })();
  });
}

// A saved reading, as it was, with the note editable and a delete with confirmation. Resolves 'deleted' | 'closed'.
export function readingScreen(entry) {
  return new Promise((done) => {
    let note;
    const end = async (v) => { if (v !== 'deleted' && note.value.trim() !== (entry.note || '')) { await call('readings.note', entry.at, note.value.trim()); entry.note = note.value.trim(); } scr.close(); done(v); };
    const scr = screen(dateIt(entry.at), () => end('closed'));
    note = h('textarea.sr-field', { rows: 2, maxLength: 600, value: entry.note || '', placeholder: 'Una nota mia', 'aria-label': 'Una nota mia' });
    scr.body(themeBox(entry.question, entry.who, entry.real), readingNodes(entry), h('p.sr-lab', { style: { marginTop: '8px' } }, 'Una nota mia'), note);
    const feet = () => scr.foot(B('Cancella', () => scr.foot(B('No, la tengo', feet, 'ghost'), B('Sì, la cancello', async () => { await call('readings.delete', entry.at); end('deleted'); })), 'ghost'), B('Chiudi', () => end('closed'), 'go'));
    feet();
  });
}
