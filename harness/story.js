// Harness for the narrative area. ?view=dialogue | cinema | session&id=s0..s4   (&script=name for dialogue)
// Stub services log and resolve; card.found calls findCard. Real services come from other areas.
import '../src/core/fonts.js';
import { provide } from '../src/core/services.js';
import { setState, state } from '../src/core/state.js';
import { findCard, foundIds } from '../src/core/progress.js';
import { SESSIONS } from '../src/data/story/index.js';
import '../src/story/index.js';
import { runner } from '../src/story/index.js';
import { playSession } from '../src/story/session.js';
import { createRunner } from '../src/story/runner.js';
import * as dialogue from '../src/story/dialogue.js';
import { cinema } from '../src/story/cinema.js';

const q = new URLSearchParams(location.search);
const view = q.get('view') || 'dialogue';
const logEl = document.getElementById('log');
const log = (...a) => { console.log('[harness]', ...a); logEl.textContent = a.join(' ') + '\n' + logEl.textContent; };

const MAJORS = ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20', 'm21'];
const sid = q.get('id') || 's0', lvl = Math.max(0, Math.min(4, Number(/\d/.exec(sid)?.[0] || 0)));
setState({ started: true, chapter: Math.min(3, lvl), player: { name: (lvl || view === 'dialogue') ? 'Ada' : '', birth: lvl ? { d: 1, m: 10, y: 1995 } : null, sign: lvl ? 'bilancia' : null, birthCard: lvl ? 'm11' : null }, words: { value: lvl > 0 ? 'lealtà' : null, fear: lvl > 1 ? 'essere lasciata' : null }, flags: lvl > 0 ? { 'b1.spoke': true } : {} });
if (view === 'session' || view === 'cinema') for (const id of MAJORS.slice(0, [0, 5, 11, 16, 21][lvl])) findCard(id, { silent: true });

provide('card.found', async (id) => { findCard(id); log('card.found', id); await new Promise((r) => setTimeout(r, 300)); });
provide('draw.pick', async (a) => { log('draw.pick', JSON.stringify(a.pool), JSON.stringify(a.weights)); return a.pool[0]; });
provide('exam.start', async (a) => { log('exam.start', JSON.stringify(a)); await new Promise((r) => setTimeout(r, 300)); return { passed: true, right: 3, wrong: 0, suspicion: 0 }; });
provide('reading.open', async (a) => { log('reading.open', JSON.stringify(a)); return { score: 3, coins: 5 }; });
provide('world.travel', async (to) => { log('world.travel', to); });

// a demo script that uses every node type
const DEMO = {
  main: [
    { do: 'cinema', lines: ['Salem, di notte. La neve non smette.', 'Qualcuno ha lasciato una candela alla finestra.'] },
    { say: 'narra', t: 'La porta di Comare Malva è socchiusa. Dentro, il camino brontola.' },
    { say: 'malva', t: 'Chiudi la porta, {name}. Entra il freddo, e con il freddo entra chi non voglio.' },
    { say: 'tu', t: 'Sembra una persona che non ringrazia mai.' },
    { choice: [
      { t: 'Scusa.', tag: { card: 'm14', suit: 'c' }, trust: { malva: 1 }, flag: 'said.sorry', then: [{ say: 'malva', t: 'Non scusarti. Chiudila.' }] },
      { t: "L'ho chiusa io, la porta.", tag: { card: 'm04', suit: 's' }, then: [{ say: 'malva', t: 'Allora è il freddo che ce l\'ha con me.' }] },
      { t: 'Chi non vuole?', tag: { card: 'm18' }, then: [{ say: 'malva', t: 'Le domande dopo. Prima la legna.' }] } ] },
    { if: { flag: 'said.sorry' }, then: [{ say: 'ginepra', t: 'Hai chiesto scusa a Malva? Ah! Ti adotterà.' }], else: [{ say: 'ginepra', t: 'Ti sei salvata per un pelo.' }] },
    { say: 'ortica', t: 'Io lo so già come finisce. Non ti dico niente, ma finisce con una scopa e due gatti, e uno di quei gatti mi deve dei soldi.' },
    { say: 'edera', t: 'Tu sei... la ragazza. La ragazza con il mantello. Ricordo ogni carta, ma non il tuo nome.' },
    { say: 'tartufo', t: 'Miao. (Tradotto: sbrigati, c\'è un conestabile.)' },
    { say: 'conestabile', t: 'Ferma lì. Due domande, e poi vai.' },
    { do: 'exam', kind: 'constable', place: 'village.square' },
    { if: { flag: 'exam.passed' }, then: [{ say: 'conestabile', t: 'Passa pure.' }], else: [{ say: 'conestabile', t: 'Con me.' }] },
    { say: 'afflitta', t: 'È stata lei. L\'ho vista. Lo giuro sul pane.' },
    { say: 'bottegaio', t: 'Questa non la vendo a tutti. A te sì.' },
    { say: 'giudice', t: 'Non sono qui per punirvi. Sono qui perché stiate meglio.' },
    { do: 'giveCard', id: 'm01' },
    { do: 'draw', mode: 'fan', pool: 'row', give: true, title: 'Pesca' },
    { do: 'teach', spread: 'single' }, { do: 'lesson', id: 'deck' },
    { do: 'xp', n: 10 }, { do: 'coins', n: 5 }, { do: 'flag', k: 'met.malva' }, { do: 'trust', who: 'ortica', n: 1 },
    { do: 'point', card: 'm09', suit: 's' }, { do: 'word', k: 'fear', v: 'il buio' }, { do: 'diary', t: 'Ho chiuso la porta a Malva.' },
    { do: 'step', id: 'c1.find3' }, { do: 'power', id: 'cat' }, { do: 'tool', id: 'bottle', n: 1 },
    { do: 'reading', spread: 'single', client: 'c1.widow' },
    { do: 'wait', ms: 400 }, { do: 'travel', to: 'forest.entry' },
    { say: 'malva', t: 'Se vuoi, puoi rileggere ancora una volta.' },
    { choice: [{ t: 'Sì, di nuovo.', then: [{ do: 'goto', script: 'again' }] }, { t: 'No, basta così.' }] },
    { say: 'narra', t: 'Fine della dimostrazione.' },
  ],
  again: [{ say: 'malva', t: 'Eccoci di nuovo. (goto)' }],
  short: [{ say: 'malva', t: 'Chiudi la porta, {name}.' }, { choice: [{ t: 'Scusa.', tag: { card: 'm14' } }, { t: "L'ho chiusa." }] }, { say: 'tu', t: 'Brusca. Ma calda.' }],
};
const demoRunner = createRunner({ ui: { say: dialogue.say, choose: dialogue.choose, moment: dialogue.moment, cinema, sleep: (ms) => new Promise((r) => setTimeout(r, ms)), end: dialogue.end }, call: (await import('../src/core/services.js')).call, getScript: (id) => DEMO[id] });

// a rich demo session: every session node
SESSIONS.demo = [
  { say: 'lettrice', t: 'Siediti. Non ti chiedo perché sei qui.' },
  { shuffle: true },
  { say: 'lettrice', t: 'Dimmi come ti chiami. Lo scrivo qui.' },
  { ask: 'name' },
  { say: 'lettrice', t: '{name}. Un nome che si sente nelle stanze vuote.' },
  { say: 'lettrice', t: 'E il giorno in cui sei nata?' },
  { ask: 'birth' },
  { turn: 'm00' },
  { say: 'lettrice', t: 'Questa sei tu, {name}. Una che salta prima di guardare.' },
  { say: 'lettrice', t: 'Una cosa mi interessa. Quando qualcuno ti mente, ma con gentilezza...' },
  { choice: [
    { t: 'Preferisco che mi dica la verità, anche se fa male.', tag: { card: 'm11', suit: 's' }, flag: 's.truth', then: [{ say: 'lettrice', t: 'Lo immaginavo. Si vede dalle mani.' }] },
    { t: 'Se lo fa per bontà, lascio correre.', tag: { card: 'm14', suit: 'c' }, then: [{ say: 'lettrice', t: 'La bontà costa. Qualcuno la paga.' }] } ] },
  { observe: [{ when: { flag: 'b1.spoke' }, t: 'In piazza hai parlato. Lo rifaresti?' }, { when: { notFlag: 'b1.spoke' }, t: 'Non hai ancora detto nulla di importante.' }] },
  { say: 'tu', t: 'Mi sta guardando le mani, non la faccia.' },
  { say: 'lettrice', t: 'Dimmi un numero, da uno a ventidue.' },
  { pick: 'number', then: [{ say: 'lettrice', t: '{picked}. Non l\'ho scelta io.' }] },
  { do: 'word', k: 'value', v: 'verità' },
  { say: 'narra', t: 'La candela si abbassa di un dito.' },
  { say: 'lettrice', t: 'Basta così, per stasera.' },
];

const start = async () => {
  if (view === 'portraits') {
    const { portrait } = await import('../src/story/portraits.js');
    const wrap = document.createElement('div'); wrap.style.cssText = 'position:fixed;inset:0;display:flex;flex-wrap:wrap;gap:12px;padding:12px;background:#10132a;z-index:5;align-content:flex-start';
    for (const id of ['malva', 'ortica', 'edera', 'ginepra', 'tartufo', 'giudice', 'conestabile', 'afflitta', 'bottegaio', 'tu']) { const c = portrait(id); c.style.cssText = 'width:144px;height:144px;image-rendering:pixelated;border:3px solid #6a5f48'; wrap.append(c); }
    document.body.append(wrap); return;
  }
  if (view === 'cinema') {
    await cinema(['Salem, di notte. La neve non smette.', 'Qualcuno ha lasciato una candela alla finestra.', 'E tu eri già in cammino.']);
    log('cinema done');
  } else if (view === 'session') {
    await playSession('demo', { level: lvl });
    log('session done');
  } else {
    await demoRunner.run(q.get('script') || 'main');
    log('dialogue done');
  }
};
window.__story = { runner, start, state, foundIds, dialogue };
if (!q.has('manual')) start();
