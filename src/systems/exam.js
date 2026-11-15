// The Exam: a constable, an Afflicted or the Judge stops her. The questions are in the witch's head:
// knowing the cards keeps up the spell that hides her. Rules: exam.rules.js. Screen pieces: exam.ui.js.
import { h } from '../core/dom.js';
import { state, save } from '../core/state.js';
import { test, fill } from '../core/cond.js';
import { answer, ownedIds, confiscate, stat, addXp, trusts } from '../core/progress.js';
import { CARD, MAJORS } from '../data/cards.base.js';
import { makeExam, makeQuestion } from '../data/questions.js';
import { BARKS } from '../data/story/index.js';
import { screen, btn, say, pickOne, sleep, snd, mood, moodBack } from './theme.js';
import { questionView } from './qview.js';
import { header, DEFAULT_OPEN, CLOSING } from './exam.ui.js';
import * as R from './exam.rules.js';

const HINT_LINES = ['Tartufo ti struscia la gamba, poi soffia verso una risposta: non è quella.', 'Tartufo rizza il pelo davanti a una delle risposte. Quella no.'];
const barkOf = (kind, rng) => {
  const list = (BARKS?.[kind === 'afflicted' ? 'afflicted' : kind] || []).filter((b) => b?.t && test(b.when));
  return fill(pickOne(list.length ? list : (DEFAULT_OPEN[kind] || DEFAULT_OPEN.constable).map((t) => ({ t })), rng).t);
};
const useTool = (id) => { if ((state.tools[id] || 0) > 0) { state.tools[id] -= 1; save(); return true; } return false; };

export async function startExam({ kind = 'constable', place = 'village', rng = Math.random } = {}) {
  const chapter = Math.max(1, state.chapter || 1);
  const mercyNow = (state.stats.exams || 0);
  stat('exams'); state.stats.examsByPlace[place] = (state.stats.examsByPlace[place] || 0) + 1; save();

  const pool = R.examPool({ kind, owned: ownedIds(), majors: MAJORS.map((c) => c.id) });
  let s = R.newExam({ kind, chapter, exams: mercyNow });
  let qs = [];
  try { qs = makeExam({ kind, pool, level: chapter, n: s.total, rng }) || []; } catch { qs = []; }
  while (qs.length < s.total) qs.push(makeQuestion({ pool, level: chapter, rng }));
  qs = qs.slice(0, s.total);

  const head = header(kind);
  const scr = screen({ cls: 'sxe' });
  scr.el.insertBefore(head.el, scr.body);
  head.setCount(0, s.total); head.setSuspicion(s.suspicion);
  const tense = () => mood('exam', { tension: Math.min(1, s.suspicion / R.FAIL_AT) });
  tense();

  // ---- the stop ------------------------------------------------------------------------------
  const lines = [say(kind === 'judge' ? 'Il Giudice' : kind === 'afflicted' ? "L'Afflitta" : 'Il conestabile', barkOf(kind, rng))];
  if (kind === 'afflicted') lines.push(h('p.sx-lab', 'Sei già sotto gli occhi di tutti: il sospetto parte a metà.'));
  if (kind === 'judge') lines.push(h('p.sx-lab', `Otto domande, su tutte le carte maggiori. Chi si fida di te può aiutarti.`));
  else lines.push(h('p.sx-lab', 'Rispondi con calma. Ogni errore alza il sospetto.'));
  scr.setBody(lines);
  await new Promise((res) => scr.setFoot(btn('Rispondo', res, 'go')));

  // ---- the questions -------------------------------------------------------------------------
  const used = { cat: false, malva: false, ortica: false, edera: false };
  const judge = kind === 'judge';
  for (let qi = 0; qi < qs.length && !s.over; qi++) {
    const q = qs[qi];
    const hidden = [];
    head.setCount(s.asked + s.skipped + 1, s.total);
    let resolveQ;
    const done = new Promise((r) => { resolveQ = r; });
    let answered = false, skipped = false;
    const view = questionView(q, { hidden, onPick: (i) => { if (!answered) { answered = true; resolveQ(i); } } });
    const note = h('p.note');
    const helps = h('div.sxe-help');
    const removeOne = () => { const i = R.wrongToRemove(q.options, hidden, rng); if (i < 0) { note.textContent = 'Non c\'è più niente da togliere: restano due risposte.'; return false; } hidden.push(i); view.hide(i); return true; };
    const addHelp = (label, fn) => { const b = btn(label, () => { if (answered) return; fn(b); }, 'ghost'); helps.append(b); return b; };
    if (state.powers.cat) addHelp('Tartufo, aiutami', (b) => { if (used.cat) return; if (removeOne()) { used.cat = true; b.disabled = true; note.textContent = pickOne(HINT_LINES, rng); } });
    if ((state.tools.pendulum || 0) > 0) addHelp(`Pendolo (${state.tools.pendulum})`, (b) => { if (removeOne() && useTool('pendulum')) { note.textContent = 'Il pendolo oscilla, e si ferma lontano da una risposta.'; b.textContent = `Pendolo (${state.tools.pendulum})`; if (!state.tools.pendulum) b.disabled = true; } });
    if ((state.tools.incense || 0) > 0) addHelp(`Incenso (${state.tools.incense})`, (b) => { if (!useTool('incense')) return; s = R.calm(s, 30); head.setSuspicion(s.suspicion); tense(); note.textContent = 'Il fumo dolce riempie la stanza. Tutti respirano più piano.'; b.textContent = `Incenso (${state.tools.incense})`; if (!state.tools.incense) b.disabled = true; });
    if (judge && trusts('edera')) addHelp('Nonna Edera', (b) => { if (used.edera) return; if (removeOne()) { used.edera = true; b.disabled = true; note.textContent = 'Nonna Edera, dal fondo, tossisce piano. Una risposta ti pare più lontana.'; } });
    if (judge && trusts('ortica')) addHelp('Ortica: salta', (b) => { if (used.ortica) return; used.ortica = true; b.disabled = true; skipped = true; answered = true; resolveQ(-1); });
    if (judge && trusts('malva') && !used.malva) helps.append(h('p.note', 'Comare Malva è in fondo all\'aula, con le braccia incrociate. Veglia su di te.'));
    helps.append(note);
    scr.setBody(view.el, helps);
    scr.setFoot();
    const picked = await done;

    if (skipped) {
      s = R.skipStep(s);
      scr.setBody(h('div.sx-fb.mercy.sx-in', h('h3', 'Ortica salta fuori'), h('p', 'Si mette a parlare, e parla, e parla: la domanda si perde per strada. Il Giudice non la ripete.')));
      await new Promise((res) => scr.setFoot(btn('Avanti', res, 'go')));
      continue;
    }
    const ok = !!q.options[picked]?.ok;
    const forgive = !ok && judge && trusts('malva') && !used.malva && !s.mercy;
    if (forgive) used.malva = true;
    const r = R.answerStep(s, ok, { forgive });
    s = r.state;
    answer(q.cardId, ok, q.star);
    view.reveal(picked);
    snd(r.effect === 'right' ? 'right' : 'wrong');
    helps.remove();
    head.setSuspicion(s.suspicion, { flick: r.effect === 'wrong' || r.effect === 'mercy' });
    tense();
    head.setCount(s.asked + s.skipped, s.total);
    const fb = {
      right: ['ok', 'Giusto.', null], wrong: ['no', 'Sbagliato.', 'La fiamma trema. Il sospetto sale.'],
      mercy: ['mercy', 'Sbagliato, ma...', 'Sei nuova, e per un attimo l\'incantesimo vacilla. Nessuno se ne accorge: il primo errore non ti costa niente.'],
      forgiven: ['mercy', 'Sbagliato, ma...', 'Comare Malva tossisce forte. Tutti si voltano verso di lei, e nessuno bada alla tua risposta.'],
    }[r.effect];
    const box = h(`div.sx-fb.${fb[0]}.sx-in`, h('h3', fb[1]), fb[2] ? h('p', fb[2]) : null, h('p', q.explain));
    scr.col.append(box);
    scr.show(box);
    if (r.effect === 'wrong') scr.el.classList.add('sx-shake'), setTimeout(() => scr.el.classList.remove('sx-shake'), 450);
    const last = s.over;
    await new Promise((res) => scr.setFoot(btn(last ? 'Vediamo' : 'Avanti', res, 'go')));
  }

  // ---- the end -------------------------------------------------------------------------------
  const out = R.result(s);
  const text = CLOSING[kind] || CLOSING.constable;
  const lost = [];
  if (out.passed) { stat('examsPassed'); addXp(10, 'exam'); }
  else if (!judge) {
    stat('examsFailed'); stat('jailed');
    snd('caught');
    lost.push(...R.toConfiscate(ownedIds(), rng));
    if (lost.length) confiscate(lost);
  }
  head.setSuspicion(s.suspicion);
  scr.setBody(h('div.sxe-end.sx-in',
    h('h1', out.passed ? 'Passi.' : judge ? 'Non basta.' : 'Ti portano via.'),
    say(null, out.passed ? text.pass : text.fail),
    lost.length ? h('p.sx-lab', { style: { textAlign: 'center' } }, lost.length === 1 ? 'Ti tolgono una carta. La trovi al deposito del tribunale:' : 'Ti tolgono due carte. Le trovi al deposito del tribunale:') : null,
    lost.length ? h('div.sxe-lost', lost.map((id) => h('div.sx-card', { title: CARD[id]?.name, style: { backgroundImage: `url(cards/${id}.webp)` } }))) : null,
    lost.length ? h('p.sx-lab', { style: { textAlign: 'center' } }, lost.map((id) => CARD[id]?.name).join(' e ')) : null,
    out.passed ? h('p.sx-lab', { style: { textAlign: 'center' } }, 'Hai imparato qualcosa: +10 punti esperienza.') : null));
  await new Promise((res) => scr.setFoot(btn('Continua', res, 'go')));
  scr.close();
  moodBack();
  await sleep(0);
  return out;
}
