// The guided reading (cottage clients, and the finale): the client speaks, the cards are drawn and laid on
// the table, then position by position she chooses the right interpretation among three. Rules: reading.rules.js.
// When every card she can draw has a voice (consult.rules.js engineFor), a client reading goes to the reading
// engine instead (consult.js): the cards come only from the voiced ones she owns. Otherwise nothing changes.
import { h, cardUrl } from '../core/dom.js';
import { fill } from '../core/cond.js';
import { answer, addCoins, addXp, stat, ownedMajors, ownedIds, yourCard, dayCard } from '../core/progress.js';
import { state } from '../core/state.js';
import { drawCards } from '../reading/index.js';
import { CARD, MAJORS } from '../data/cards.base.js';
import { SPREADS } from '../data/spreads.js';
import { sheet } from '../data/cards.js';
import { CLIENTS } from '../data/story/index.js';
import { screen, btn, say, fb, sleep, snd, mood, moodBack } from './theme.js';
import { questionView } from './qview.js';
import { table } from './table.js';
import { readStyle, posHeader } from './readview.js';
import { pick } from './draw.js';
import { alternatives, scoreOf, payFor, xpFor, drawPlan, lookPrompt, } from './reading.rules.js';
import { engineFor, questionOf } from './consult.rules.js';
import { consult } from './consult.js';


const coreLine = (id) => { const c = sheet(id)?.core; return c ? h('p', { style: { color: 'var(--gold)' } }, `In una frase: ${c}`) : null; };
const wait = (scr, label, cls = 'go') => new Promise((res) => scr.setFoot(btn(label, res, cls)));
const firstSentence = (t) => (t.length > 110 ? (t.match(/^.*?[.!?](\s|$)/)?.[0] || t).trim() : t);
const clientOf = (c) => (c === 'self' ? null : (CLIENTS || []).find((x) => x.id === c) || (typeof c === 'object' && c) || { id: c, name: 'Una cliente', look: '', question: null, hello: 'Buonasera.', thanks: 'Grazie.', pay: 5 });

export async function open({ spread = 'single', client, cards, script, rng = Math.random } = {}) {
  readStyle();
  const sp = SPREADS[spread] || SPREADS.single;
  const cl = clientOf(client);
  const self = !cl;
  const N = sp.positions.length;
  // the reading engine: a client with tagged question, and enough voiced cards
  const question = self ? null : questionOf(cl);
  const eng = question ? engineFor({ client: cl.id, n: N, owned: ownedIds(), given: cards }) : { use: false };
  // reversed cards only after their lesson (a flag in the saved state; nothing sets it yet)
  const reversed = !!(state.flags?.['lesson.reversed'] || state.lessons?.reversed);
  const scr = screen({ cls: 'sxread' });
  mood('reading');

  // ---- hello ---------------------------------------------------------------------------------
  const nm = self ? 'La Lettrice' : cl.name;
  scr.setBody(
    h('div.sxr-who', h('div.sxr-badge'), h('div', h('b', nm), h('small', self ? 'Il tavolo è tuo.' : cl.look || ''))),
    say(nm, fill(self ? 'Adesso leggi tu. Per te.' : cl.hello || 'Buonasera.')),
    h('p.sx-lab', self ? 'Un quadro generale: dieci carte, la tua storia.' : cl.question ? `Domanda: «${fill(cl.question)}»` : 'Non ha una domanda: vuole un quadro generale.'),
    h('p.sx-lab', `Stesa: ${sp.name}.`));
  await wait(scr, self ? 'Comincio' : 'Mescolo');

  // ---- draw ----------------------------------------------------------------------------------
  const ids = new Array(N).fill(null);
  const plan = drawPlan(sp.positions, cards);
  plan.forEach((p, i) => { if (p.id) ids[i] = p.id; });
  const left = () => { const taken = new Set(ids.filter(Boolean)); if (eng.use) return eng.pool.filter((id) => !taken.has(id)); let pool = ownedMajors().filter((id) => !taken.has(id)); if (!pool.length) pool = MAJORS.map((c) => c.id).filter((id) => !taken.has(id)); return pool; };
  for (let i = 0; i < N; i++) {
    if (ids[i]) continue;
    const how = plan[i].how === 'given' ? 'top' : plan[i].how;
    ids[i] = await pick({ mode: how, pool: left(), title: N > 1 ? `${sp.positions[i].label} (${i + 1} di ${N})` : 'Pesca la carta', quick: how === 'top' && N > 1, rng });
  }

  // upright or reversed: the engine's own rule (drawCards), one card at a time, since she chose the cards
  const revs = ids.map((id) => eng.use && reversed && drawCards('single', { pool: [id], reversals: true, rng })[0].rev);

  // ---- the table -----------------------------------------------------------------------------
  const big = table(sp, { big: true });
  scr.setBody(h('p.sxr-q', { style: { textAlign: 'center' } }, N > 1 ? 'Ecco le carte, al loro posto.' : 'Ecco la carta.'), big.el);
  scr.setFoot();
  for (let i = 0; i < N; i++) {
    big.place(i, ids[i]);
    if (revs[i]) big.cards[i].f.face.style.transform = 'rotateY(180deg) rotate(180deg)';
    await sleep(i ? 200 : 350); big.turn(i); snd('card');
  }
  await sleep(700);
  await wait(scr, 'Leggiamo');

  if (eng.use) {
    const r = await consult({ scr, sp, cl, cards: sp.positions.map((p, i) => ({ pos: p.id, card: ids[i], rev: !!revs[i] })), question, pool: eng.pool, verso: reversed, rng });
    scr.close();
    moodBack();
    return r;
  }

  // ---- position by position ------------------------------------------------------------------
  const oks = [], chosen = [];
  for (let i = 0; i < N; i++) {
    const pos = sp.positions[i], id = ids[i];
    const alts = alternatives({ cardId: id, positionId: pos.id, spreadId: sp.id, table: ids, rng });
    const q = { prompt: 'Cosa dice questa carta, qui?', options: alts, textOnly: true };
    let resolve;
    const done = new Promise((r) => { resolve = r; });
    const view = questionView(q, { onPick: (k) => resolve(k) });
    scr.setBody(
      posHeader(sp, ids, i),
      h('div.sxr-look', h('div.sx-card', { style: { backgroundImage: `url(${cardUrl(id)})` } }), h('div.t', h('b', CARD[id]?.name || id), lookPrompt(id, i))),
      view.el);
    scr.setFoot();
    const k = await done;
    const ok = !!alts[k]?.ok;
    view.reveal(k);
    snd(ok ? 'right' : 'wrong');
    oks.push(ok); chosen.push(alts[k]?.t || '');
    answer(id, ok, 'meaning');
    scr.col.append(ok ? fb('ok', 'Esatto.', `Qui ${CARD[id]?.name} dice proprio questo.`, coreLine(id)) : fb('no', 'Non proprio.', alts[k]?.card ? `Quella frase appartiene a ${CARD[alts[k].card]?.name}.` : null, `Per ${CARD[id]?.name}, qui, era la frase segnata in verde.`, coreLine(id)));
    scr.show(scr.col.lastChild);
    await wait(scr, i === N - 1 ? 'Finito' : 'Avanti');
  }

  // ---- the end -------------------------------------------------------------------------------
  const score = scoreOf(oks);
  const owned = ownedMajors().length;
  const coins = self ? 0 : payFor({ pay: cl.pay ?? 5, score, owned, yourCardOnTable: ids.includes(yourCard()), dayCardOnTable: !!dayCard() && ids.includes(dayCard()) });
  if (coins) addCoins(coins);
  addXp(xpFor(score), 'reading');
  stat('readings');
  const right = oks.filter(Boolean).length;
  scr.setBody(
    h('div.sxr-score.sx-in', `${right} su ${N}`, h('small', right === N ? 'Hai letto tutto giusto.' : right >= N / 2 ? 'Hai letto bene.' : 'Le carte hanno più da dire: ripassale.')),
    h('p.sx-lab', 'La storia che raccontano:'),
    h('div.sxr-story', chosen.map((t, i) => h('div', h('small', N > 1 ? sp.positions[i].label : CARD[ids[i]]?.name), firstSentence(t)))),
    self ? null : say(cl.name, fill(cl.thanks || 'Grazie.')),
    coins ? h('div.sxr-coins', `+${coins} monete`) : null);
  await wait(scr, 'Chiudo il libro');
  scr.close();
  moodBack();
  return { score, coins };
}
