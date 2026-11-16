// The screens of a trial (src/trials): asking the cards (a small fan face down, the card she picks turns over
// big with nothing but its picture, then the options, then always the feedback), a witch pulling a card in a
// scene, the title card and the end of a trial with what was won or lost. The look is the play area's night
// (dark plum, parchment, gold), copied here so the areas stay apart. Every function resolves when she taps on.
import { h, css, cardUrl, openOverlay, reducedMotion } from '../core/dom.js';
import { call } from '../core/services.js';
import { FONT } from '../core/fonts.js';
import { CARD, PEOPLE } from '../data/cards.base.js';
import { faceOf, judge } from '../trials/ask.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, reducedMotion() ? Math.min(ms, 60) : ms));
const snd = (n) => { try { Promise.resolve(call('sound.play', n)).catch(() => {}); } catch { /* no sound */ } };

const CSS = `
.tr{--ink:#120d17;--panel:#1d1626;--line:#43344f;--paper:#f0e6cf;--dim:#bdae96;--gold:#e0b95e;--moss:#86c093;--blood:#c44a3c;
  position:fixed;inset:0;z-index:55;display:flex;flex-direction:column;color:var(--paper);font:19px/1.4 ${FONT.serif};
  background:radial-gradient(ellipse at 50% -10%,#2f2142 0%,var(--ink) 65%);padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom);touch-action:manipulation;user-select:none;-webkit-user-select:none}
.tr *{box-sizing:border-box}.tr button{font:inherit;color:inherit;-webkit-tap-highlight-color:transparent}
.tr-body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}
.tr-col{max-width:560px;margin:0 auto;padding:12px 14px 18px;display:flex;flex-direction:column;gap:12px}
.tr-top{flex:none;display:flex;align-items:center;min-height:50px;padding:4px 14px;border-bottom:1px solid var(--line);background:#160f1dcc}
.tr-top h2{flex:1;margin:0;font-size:19px;font-weight:400;letter-spacing:.02em}
.tr-top small{color:var(--dim);font-size:15px}
.tr-foot{flex:none;display:flex;gap:10px;padding:10px max(14px,calc((100% - 560px) / 2)) 14px;border-top:1px solid var(--line);background:#160f1dee}
.tr-foot:empty{display:none}
.tr .tr-btn{flex:1;display:flex;align-items:center;justify-content:center;min-height:52px;padding:6px 18px;border-radius:12px;border:1.5px solid var(--gold);background:var(--gold);color:#2a1d05;font-weight:700;font-size:19px;cursor:pointer}
.tr-help{margin:0;text-align:center;color:var(--dim);font-size:17px;font-style:italic;min-height:24px}
.tr-rule{padding:12px 14px;border-radius:6px;background:#f0e6cf;color:#2a2030;font-size:18px;line-height:1.35;transform:rotate(-.6deg);box-shadow:0 6px 16px #0008}
.tr-rule b{display:block;font-weight:400;font-size:15px;letter-spacing:.05em;text-transform:uppercase;color:#6b5a48;margin-bottom:3px}
.tr-fan{position:relative;width:min(340px,92vw);height:230px;margin:6px auto 0}
.tr-fc{position:absolute;left:50%;bottom:0;width:96px;margin-left:-48px;aspect-ratio:350/600;padding:0;border:0;background:none;cursor:pointer;transform-origin:50% 140%;transition:transform .6s cubic-bezier(.3,.1,.2,1),opacity .35s}
.tr-fc.gone{opacity:0;pointer-events:none}
.tr-back,.tr-face{position:absolute;inset:0;border-radius:9px;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.tr-back{background:radial-gradient(circle at 50% 45%,#3a2a52,#150e20 70%);box-shadow:0 6px 18px #000a,0 0 0 1.5px #e0b95e88,inset 0 0 0 6px #150e20,inset 0 0 0 7.5px #e0b95e77}
.tr-back::after{content:'☾';position:absolute;inset:0;display:grid;place-items:center;color:#e0b95e;font-size:34px;opacity:.85}
.tr-face{background:#0b0710 center/cover no-repeat;box-shadow:0 6px 18px #000a,0 0 0 1.5px #e0b95e88;transform:rotateY(180deg)}
.tr-flip{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.3,.1,.2,1)}
.tr-up .tr-flip{transform:rotateY(180deg)}
.tr-rev .tr-face{transform:rotateY(180deg) rotate(180deg)}
.tr-big{display:flex;justify-content:center;margin-top:4px}
.tr-big .tr-card{position:relative;width:min(170px,44vw);aspect-ratio:350/600;perspective:900px}
.tr-opts{display:flex;flex-direction:column;gap:9px}
.tr-o{display:flex;align-items:center;min-height:56px;padding:8px 14px;border-radius:12px;background:var(--panel);border:2px solid var(--line);text-align:left;cursor:pointer;font-size:19px;line-height:1.25}
.tr-o:disabled{cursor:default}
.tr-o.ok{border-color:var(--moss);background:#1c3326}.tr-o.no{border-color:var(--blood);background:#40201f}.tr-o.dim{opacity:.4}
.tr-fb{padding:12px 14px;border-radius:12px;border:2px solid var(--line);background:var(--panel)}
.tr-fb.ok{border-color:#3d7a52}.tr-fb.no{border-color:#9a4a42}
.tr-fb h3{margin:0 0 4px;font-size:21px;font-weight:400}
.tr-fb .nm{color:var(--gold);font-size:18px}
.tr-fb .es{margin:2px 0 4px;font-family:${FONT.hand};font-size:25px;line-height:1.1;color:#f3dfa6}
.tr-fb p{margin:4px 0 0;font-size:18px}
.tr-in{animation:trin .3s ease-out}@keyframes trin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.tr-title{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:52vh;text-align:center}
.tr-title small{color:var(--dim);font-size:16px;letter-spacing:.08em;text-transform:uppercase}
.tr-title h1{margin:0;font-weight:400;font-size:34px;line-height:1.15}
.tr-title p{margin:0;color:var(--dim);font-style:italic}
.tr-end h1{margin:6px 0 0;text-align:center;font-weight:400;font-size:32px}
.tr-end .n{text-align:center;color:var(--dim)}
.tr-fx{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.tr-fx li{display:flex;gap:10px;align-items:center;padding:8px 12px;border-radius:10px;background:#ffffff0a;border-left:3px solid var(--gold);font-size:18px}
.tr-fx li.minus{border-left-color:var(--blood)}
.tr-fx i{flex:none;width:34px;aspect-ratio:350/600;border-radius:4px;background:#0b0710 center/cover no-repeat}
.trw{position:fixed;left:0;right:0;bottom:0;z-index:56;display:flex;justify-content:center;padding:0 10px calc(14px + env(safe-area-inset-bottom));pointer-events:auto}
.trw-veil{position:fixed;inset:0;z-index:55;background:linear-gradient(#0000 40%,#0009)}
.trw-box{display:flex;gap:12px;align-items:flex-end;width:100%;max-width:560px;padding:12px 14px;border-radius:6px 16px 16px 16px;background:#f0e6cf;color:#2a2030;box-shadow:0 10px 30px #000c;font:19px/1.35 ${FONT.serif}}
.trw-box .tr-card{position:relative;flex:none;width:74px;aspect-ratio:350/600;perspective:700px;margin-top:-46px}
.trw-box b{display:block;font-weight:400;font-size:15px;color:#6b5a48;letter-spacing:.05em;text-transform:uppercase}
.trw-box p{margin:2px 0 0;font-style:italic}
.trw-box .more{display:block;text-align:right;color:#a3372a;font-size:15px;opacity:0;transition:opacity .3s}.trw-box .more.on{opacity:1}
`;

// A full-screen layer: { el, col, foot, set(...nodes), close() }
export function trialScreen({ title, sub } = {}) {
  css('ui-trial', CSS);
  const col = h('div.tr-col'), foot = h('div.tr-foot');
  const el = h('div.tr', title ? h('div.tr-top', h('h2', title, sub ? h('small', ` · ${sub}`) : null)) : null, h('div.tr-body', col), foot);
  const close = openOverlay(el);
  return { el, col, foot, set: (...n) => col.replaceChildren(...n.flat().filter(Boolean)), close };
}
export const onTap = (scr, label = 'Avanti') => new Promise((res) => { scr.foot.replaceChildren(h('button.tr-btn', { type: 'button', onclick: () => { scr.foot.replaceChildren(); res(); } }, label)); });

// a card that turns over: card(id, rev).up() shows the face
function card(id, rev) {
  const face = h('div.tr-face', { style: { backgroundImage: `url(${cardUrl(id)})` } });
  const el = h(`div.tr-card${rev ? '.tr-rev' : ''}`, h('div.tr-flip', h('div.tr-back'), face));
  return { el, up: () => el.classList.add('tr-up') };
}

// ---- asking the cards ----------------------------------------------------------------------------
// decision: from src/trials/ask.js askCards. prompt: what she is asked (a line already said in the story).
// -> { k, face, ok, right }
export async function askScreen(decision, { title = 'Chiedi alle carte', who = null, rng = Math.random } = {}) {
  const scr = trialScreen({ title, sub: who ? PEOPLE[who]?.short : null });
  const help = h('p.tr-help', 'Tocca la carta che ti chiama.');
  const rule = decision.kind === 'quesito' && decision.rule ? h('div.tr-rule.tr-in', h('b', 'La regola'), decision.rule) : null;
  const fan = h('div.tr-fan');
  const n = decision.fan.length;
  const angle = (i) => (n === 1 ? 0 : -24 + (48 * i) / (n - 1));
  const picked = await new Promise((res) => {
    decision.fan.forEach((f, i) => {
      const b = h('button.tr-fc', { type: 'button', 'aria-label': `Carta ${i + 1}`, style: { transform: `rotate(${angle(i)}deg)` } }, h('div.tr-back'));
      b.addEventListener('click', () => { for (const x of fan.children) x.disabled = true; b.style.transform = 'translateY(-30px) scale(1.1)'; for (const x of fan.children) if (x !== b) x.classList.add('gone'); res(f); }, { once: true });
      fan.append(b);
    });
    scr.set(rule, help, fan);
  });
  snd('card');
  await sleep(450);
  const face = faceOf(picked.id, picked.rev);
  const c = card(picked.id, picked.rev);
  help.textContent = picked.rev ? 'È uscita capovolta. Guardala bene, poi scegli.' : 'Guardala bene, poi scegli.';
  const opts = h('div.tr-opts');
  scr.set(rule, help, h('div.tr-big.tr-in', c.el), opts);
  await sleep(60); c.up();
  await sleep(700);
  const buttons = decision.options.map((o, i) => h('button.tr-o.tr-opt.tr-in', { type: 'button', onclick: () => choose(i) }, o.text));
  let choose;
  const k = await new Promise((res) => { choose = res; opts.append(...buttons); });
  const j = judge(decision, face, k);
  buttons.forEach((b, i) => { b.disabled = true; b.classList.add(i === j.right ? 'ok' : i === k ? 'no' : 'dim'); });
  snd(j.ok ? 'right' : 'wrong');
  const name = `${CARD[face.id]?.name || face.id}${face.rev ? ', capovolta' : ''}`;
  const fb = h(`div.tr-fb.tr-in.${j.ok ? 'ok' : 'no'}`, h('h3', j.ok ? 'Hai letto bene la carta.' : 'La carta diceva un\'altra cosa.'),
    h('div.nm', name), h('div.es', face.essenza), h('p', j.said));
  opts.after(fb);
  help.textContent = '';
  requestAnimationFrame(() => fb.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' }));
  await onTap(scr);
  scr.close();
  return { k, face, ok: j.ok, right: j.right };
}

// ---- a witch pulls a card in a scene: the card small beside her line --------------------------------
export async function witchDrawScreen({ who, card: id, rev = false, t = '' } = {}) {
  css('ui-trial', CSS);
  if (!CARD[id]) return;
  const c = card(id, rev);
  const more = h('span.more', '▼');
  const box = h('div.trw-box.tr-in', c.el, h('div', h('b', PEOPLE[who]?.short || who || ''), h('p', t), more));
  const veil = h('div.trw-veil');
  const wrap = h('div', veil, h('div.trw', box));
  const close = openOverlay(wrap);
  snd('card');
  await sleep(500); c.up();
  await sleep(900); more.classList.add('on');
  await new Promise((res) => wrap.addEventListener('pointerup', res, { once: true }));
  close();
}

// ---- the title card and the end ------------------------------------------------------------------
export async function titleScreen(def) {
  const scr = trialScreen({});
  scr.set(h('div.tr-title.tr-in', h('small', 'Una prova'), h('h1', def.title || ''), def.with ? h('p', `con ${PEOPLE[def.with]?.name || def.with}`) : null));
  await onTap(scr, 'Comincia');
  scr.close();
}

const HEAD = { perfect: 'Tutto giusto', pass: 'Ce l\'hai fatta', fail: 'È andata male' };
const TOOL_IT = { bottle: 'una boccetta', incense: 'un incenso', pendulum: 'un pendolo' };
// one plain line per effect (gains and losses): [{ t, minus, card? }]
export function effectLines(fx = []) {
  const out = [];
  for (const e of fx) {
    if (e.xp) out.push({ t: `+${e.xp} punti esperienza` });
    if (e.coins) out.push(e.coins > 0 ? { t: `+${e.coins} monete` } : { t: `${e.coins} monete`, minus: true });
    if (e.tool) out.push(e.n > 0 ? { t: `Hai ${TOOL_IT[e.tool] || e.tool} in più` } : { t: `Hai perso ${TOOL_IT[e.tool] || e.tool}`, minus: true });
    if (e.item) out.push({ t: `Hai ricevuto: ${e.item}` });
    if (e.card) out.push({ t: `Una carta nuova: ${CARD[e.card]?.name || e.card}`, card: e.card });
    if (e.bond) out.push(e.bond.n > 0 ? { t: `Il legame con ${PEOPLE[e.bond.who]?.short || e.bond.who} si fa più stretto` } : { t: `Il legame con ${PEOPLE[e.bond.who]?.short || e.bond.who} si allenta`, minus: true });
    if (e.confiscate) out.push({ t: `Hai perso ${CARD[e.confiscate]?.name || e.confiscate}. La ritrovi al deposito del tribunale.`, minus: true, card: e.confiscate });
  }
  return out;
}
export async function endScreen({ def, outcome, errors, effects }) {
  const scr = trialScreen({ title: def.title });
  const lines = effectLines(effects);
  scr.set(h('div.tr-end.tr-in', h('h1', HEAD[outcome] || ''), h('p.n', errors === 0 ? 'Nessun errore.' : errors === 1 ? 'Un errore.' : `${errors} errori.`)),
    lines.length ? h('ul.tr-fx.tr-in', lines.map((l) => h(`li${l.minus ? '.minus' : ''}`, l.card ? h('i', { style: { backgroundImage: `url(${cardUrl(l.card)})` } }) : null, h('span', l.t)))) : null);
  snd(outcome === 'fail' ? 'wrong' : 'right');
  await onTap(scr, 'Continua');
  scr.close();
}
