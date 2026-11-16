// A client reading with the reading engine (docs/READING.md, "Il livello"). reading.js lays the cards and
// hands over here when engineFor() says yes. Per card: «Che idea porta questa carta?» (recall) and «E qui,
// per questa domanda, che cosa vuol dire?» (alternatives); then the whole reading and, from two cards on, the
// final answer at three levels (verdictChoices); then the tone; then the client reacts and pays.
// Rules: consult.rules.js. Returns { ok, wrong, total, helped, level, levelOk, tone, cards, score, coins }.
import { h, css, cardUrl } from '../core/dom.js';
import { FONT } from '../core/fonts.js';
import { fill } from '../core/cond.js';
import { answer, addCoins, addXp, addTrait, stat } from '../core/progress.js';
import { CARD } from '../data/cards.base.js';
import { REACTIONS } from '../data/story/clients.js';
import { plan as makePlan, recall, alternatives, verdictChoices, sayStep, say as sayAll, LEVEL, voice } from '../reading/index.js';
import { btn, say, sleep, snd } from './theme.js';
import { questionView } from './qview.js';
import { xpFor } from './reading.rules.js';
import { posLabel, helpNote, isGood, payOf, TONES, toneOf, reactionOf } from './consult.rules.js';

const CSS = `
.sxc-head{flex:none;padding:6px 14px 8px;border-bottom:1px solid var(--line);background:#160f1dee}
.sxc-head>*{max-width:560px;margin-left:auto;margin-right:auto}
.sxc-head small{display:block;color:var(--dim);font-size:15px;letter-spacing:.03em}
.sxc-head p{margin:0;font-size:18px;line-height:1.25;font-style:italic;color:#fff7e3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sxc-row{display:flex;gap:12px;align-items:flex-start}
.sxc-fig{flex:none;width:88px;display:flex;flex-direction:column;align-items:center;gap:3px}
.sxc-fig .sx-card{width:88px;aspect-ratio:350/600}
.sxc-rev .sx-card{transform:rotate(180deg)}
.sxc-fig small{color:var(--dim);font-size:14px;font-style:italic}
.sxc-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.sxc-txt .n{color:var(--dim);font-size:15px}
.sxc-txt h3{margin:0;font-size:23px;font-weight:400;line-height:1.1}
.sxc-txt b{font-weight:400;color:var(--gold);font-size:18px}
.sxc-anchor{margin:2px 0 0;font-family:${FONT.hand};font-size:24px;line-height:1.1;color:#f3dfa6}
.sxc-help{align-self:flex-start;min-height:44px;margin-top:4px;padding:4px 14px;border-radius:22px;border:1.5px solid #e0b95e88;background:none;color:var(--gold);font-size:17px;cursor:pointer}
.sxc-help:disabled{opacity:.35;cursor:default}
.sxc .sxq-prompt{font-size:20px}
.sxc .sxq-o{font-size:18px;line-height:1.25;min-height:58px;padding:8px 12px}
.sxc .sxq-o.ok{border-color:var(--gold);background:#3a2e12;color:#fff3c4}
.sxc .sxq-o.no{border-color:#8a5a52;background:#2a1b1e}
.sxc-good{flex:none !important;align-self:center;color:var(--gold);font-size:18px;font-style:italic;padding-right:4px}
.sxc-veil{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:20px;background:#0009}
.sxc-note{max-width:340px;width:100%;padding:16px 18px 14px;border-radius:6px;background:#f0e6cf;color:#2a2030;box-shadow:0 10px 30px #000c;transform:rotate(-1deg)}
.sxc-note h4{margin:0 0 6px;font-weight:400;font-size:18px;color:#6b5a48;letter-spacing:.03em}
.sxc-note .w{font-family:${FONT.hand};font-size:28px;line-height:1.15;margin:0 0 6px}
.sxc-note p{margin:0;font-size:17px;line-height:1.35}
.sxc-note .x{display:block;margin:12px 0 0 auto;min-height:44px;padding:4px 16px;border-radius:10px;border:1.5px solid #6b5a48;background:none;color:#2a2030;font-size:17px;cursor:pointer}
.sxc-list{display:flex;flex-direction:column;gap:10px}
.sxc-item{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-left:3px solid var(--gold);background:#ffffff0a;border-radius:0 8px 8px 0}
.sxc-item .sxc-fig{width:46px}.sxc-item .sxc-fig .sx-card{width:46px}
.sxc-item .sxc-fig small{font-size:12px;text-transform:none;letter-spacing:0}
.sxc p.sx-lab{margin:2px 0 -6px}
.sxc-item>div>small{display:block;color:var(--dim);font-size:14px;letter-spacing:.04em;text-transform:uppercase}
.sxc-item .e{font-family:${FONT.hand};font-size:22px;line-height:1.1;color:#f3dfa6}
.sxc-item p{margin:2px 0 0;font-size:17px;line-height:1.3}
.sxc-glance{padding:8px 12px;border-radius:10px;background:#ffffff08;font-size:17px;font-style:italic}
.sxc-quote{padding:10px 14px;border-left:3px solid var(--gold);font-size:18px;font-style:italic}
`;

const face = (id) => h('div.sx-card', { style: { backgroundImage: `url(${cardUrl(id)})` } });
const fig = (id, rev) => h(`div.sxc-fig${rev ? '.sxc-rev' : ''}`, face(id), rev ? h('small', 'rovesciata') : null);

// The small paper note «Ricordamela»: what she knows of the card. Resolves when closed.
function note(id, host) {
  const n = helpNote(id);
  if (!n) return Promise.resolve();
  return new Promise((res) => {
    const close = () => { veil.remove(); res(); };
    const body = n.kind === 'major'
      ? [h('p.w', n.words.join(' · ')), h('p', n.says)]
      : [h('p.w', n.line)];
    const veil = h('div.sxc-veil', { onclick: (e) => { if (e.target === veil) close(); } },
      h('div.sxc-note.sx-in', h('h4', n.name), body, h('button.x', { type: 'button', onclick: close }, 'Chiudi')));
    host.append(veil);
  });
}

// One question with three options; resolves { ok, k, helped } after the feedback and «Avanti».
async function ask(scr, { top, prompt, options, help }) {
  let resolve;
  const done = new Promise((r) => { resolve = r; });
  const q = { prompt, options: options.map((o) => ({ t: o.text, ok: o.ok })), textOnly: true };
  const view = questionView(q, { onPick: (k) => resolve(k) });
  let helped = false;
  const helpBtn = help ? h('button.sxc-help', { type: 'button', onclick: async () => { helped = true; await note(help, scr.el); } }, 'Ricordamela') : null;
  if (helpBtn && top) top.querySelector('.sxc-txt')?.append(helpBtn);
  scr.setBody(top, view.el);
  scr.setFoot();
  const k = await done;
  const ok = !!q.options[k]?.ok;
  view.reveal(k);
  if (helpBtn) helpBtn.disabled = true;
  snd(ok ? 'right' : 'wrong');
  await sleep(250);
  await new Promise((res) => scr.setFoot(ok ? h('span.sxc-good', 'Sì, è questa.') : null, btn('Avanti', res, 'go')));
  scr.setFoot();
  return { ok, k, helped };
}

// Options for one question: from the cards she owns with a voice; from every voiced card when too few.
const three = (fn, plan, i, { rng, pool, verso }) => {
  const a = fn(plan, i, { rng, pool, verso });
  return a.length >= 3 ? a : fn(plan, i, { rng, verso });
};

export async function consult({ scr, sp, cl, cards, question, pool, verso = false, rng = Math.random }) {
  css('sxc', CSS);
  scr.el.classList.add('sxc');
  const head = h('div.sxc-head', h('div', h('small', cl.name), h('p', cl.question ? `«${fill(cl.question)}»` : 'Un quadro generale')));
  scr.el.insertBefore(head, scr.body);

  const plan = makePlan(question, sp.id, cards);
  const N = cards.length;
  let wrong = 0, total = 0, helped = 0;
  const per = [];

  // ---- card by card: the idea, then the idea here
  for (let i = 0; i < N; i++) {
    const { card, rev } = cards[i];
    const ess = voice(card)?.[rev ? 'rev' : 'up']?.essenza || '';
    const top = (anchor) => h('div.sxc-row.sx-in', fig(card, rev), h('div.sxc-txt',
      N > 1 ? h('span.n.sx-num', `${i + 1} di ${N}`) : null, h('h3', posLabel(sp, i)), h('b', CARD[card]?.name || card),
      anchor ? h('p.sxc-anchor', ess) : null));
    const a = await ask(scr, { top: top(false), prompt: 'Che idea porta questa carta?', options: three(recall, plan, i, { rng, pool, verso }), help: card });
    const b = await ask(scr, { top: top(true), prompt: 'E qui, per questa domanda, che cosa vuol dire?', options: three(alternatives, plan, i, { rng, pool, verso }), help: card });
    for (const x of [a, b]) { total++; if (!x.ok) wrong++; if (x.helped) helped++; }
    answer(card, a.ok && b.ok, 'meaning');
    per.push({ card, rev, pos: cards[i].pos, idea: a.ok, meaning: b.ok });
  }

  // ---- the whole reading, then the answer
  const used = new Set();
  const parts = plan.steps.map((_, i) => sayStep(plan, i, { rng, used }));
  const glance = N >= 3 ? sayAll(plan, { rng }).scan : [];
  const list = h('div.sxc-list', cards.map((c, i) => h('div.sxc-item', fig(c.card, c.rev),
    h('div', h('small', posLabel(sp, i)), h('div.e', voice(c.card)?.[c.rev ? 'rev' : 'up']?.essenza || ''), h('p', parts[i].text || '')))));
  const glanceEl = glance.length ? [h('p.sx-lab', "Colpo d'occhio"), h('div.sxc-glance', glance.join(' '))] : null;
  const level = LEVEL[plan.verdict.code];
  let levelOk = true, answerText = parts[N - 1]?.text || '';
  const fin = N > 1 ? verdictChoices(plan, { rng }) : [];
  if (fin.length) {
    let resolve;
    const done = new Promise((r) => { resolve = r; });
    const q = { prompt: 'Quindi, che cosa rispondi?', options: fin.map((o) => ({ t: o.text, ok: o.ok })), textOnly: true };
    const view = questionView(q, { onPick: (k) => resolve(k) });
    scr.setBody(h('p.sx-lab', 'La lettura'), list, glanceEl, view.el);
    scr.setFoot();
    const k = await done;
    levelOk = !!q.options[k]?.ok;
    view.reveal(k);
    snd(levelOk ? 'right' : 'wrong');
    const right = view.buttons[q.options.findIndex((o) => o.ok)];
    total++; if (!levelOk) wrong++;
    answerText = fin.find((o) => o.ok)?.text || answerText;
    await sleep(250);
    await new Promise((res) => { scr.setFoot(levelOk ? h('span.sxc-good', 'Sì, è questa.') : null, btn('Avanti', res, 'go')); requestAnimationFrame(() => right && scr.show(right)); });
  } else {
    scr.setBody(h('p.sx-lab', 'La lettura'), list, glanceEl);
    await new Promise((res) => scr.setFoot(btn('Avanti', res, 'go')));
  }
  scr.setFoot();

  // ---- the tone
  let pickTone;
  const toneDone = new Promise((r) => { pickTone = r; });
  const tv = questionView({ prompt: 'Come glielo dici?', options: TONES.map((t) => ({ t: t.t, ok: true })), textOnly: true }, { onPick: (k) => pickTone(k) });
  scr.setBody(answerText ? h('div.sxc-quote.sx-in', answerText) : null, tv.el);
  const tone = toneOf(TONES[await toneDone]?.id).id;
  tv.lock();
  addTrait(toneOf(tone).trait);

  // ---- the client reacts and pays
  const good = isGood({ wrong, total, levelOk });
  const coins = payOf(cl.pay ?? 0, good);
  const score = total ? (total - wrong) / total : 0;
  if (coins) addCoins(coins);
  addXp(xpFor(score), 'reading');
  stat('readings');
  const words = reactionOf({ good, tone, thanks: fill(cl.thanks || ''), lines: REACTIONS, rng });
  scr.setBody(
    h('div.sxr-who', h('div.sxr-badge'), h('div', h('b', cl.name), h('small', cl.look || ''))),
    words.map((t) => say(cl.name, t)),
    h('div.sxr-score.sx-in', h('span.sx-num', `${total - wrong} su ${total}`)),
    coins ? h('div.sxr-coins', `+${coins} monete`) : null);
  await new Promise((res) => scr.setFoot(btn('Chiudo il libro', res, 'go')));
  head.remove();
  return { ok: good, wrong, total, helped, level, levelOk, tone, cards: per, score, coins };
}
