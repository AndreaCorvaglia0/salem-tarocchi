// The page of one card, as the sheet in the book: the image large (tap to zoom), the detail I chose,
// my three words (editable, in my hand), what you see, what it says, other ways to see it, reversed,
// planet/sign/element, how to embody it, a question, and who embodies it in this story.
// showCard(id) -> Promise resolved when the page is closed.
import { h, css, cardUrl, openOverlay } from '../core/dom.js';
import { state } from '../core/state.js';
import { CARD, PEOPLE, SIGNS } from '../data/cards.base.js';
import { sheet } from '../data/cards.js';
import { setWords, yourCard } from '../core/progress.js';
import { INK, PENCIL, RED, HAND, svgEl } from './paper.js';
import { silhouette, starMark } from './art.js';
import { slotOf } from './logic.js';
import { openSheet } from './sheet.js';
import { onEscape } from './book.js';

const CSS = `
.cp-top{display:flex;gap:20px;align-items:flex-start;margin-top:10px}
.cp-img{flex:none;width:236px;padding:0;border:0;background:none;cursor:zoom-in;-webkit-tap-highlight-color:transparent}
.cp-img .gx-veil,.cp-img .ghost{width:236px;height:405px;border:5px solid #fbf5e6;box-shadow:0 4px 12px #5a452c88;box-sizing:border-box;border-radius:4px;transform:rotate(-1.2deg)}
.cp-img .ghost{border:0;box-shadow:none}
.cp-side{flex:1;min-width:0}
.cp-stars{display:flex;gap:3px;margin:2px 0 6px}
.cp-q{color:${PENCIL};font-size:18px;line-height:24px;display:block}
.cp-words{display:flex;flex-direction:column;gap:2px;margin-top:4px}
.cp-words input{width:100%;max-width:240px;box-sizing:border-box;min-height:40px;padding:2px 4px;border:0;border-bottom:1.5px dashed ${PENCIL};background:transparent;color:${INK};font:700 23px ${HAND};outline:none;border-radius:0}
.cp-words input:focus{border-bottom:2px solid ${RED}}
.cp-words input::placeholder{color:#6a625699;font-weight:400}
.cp-sec{margin-top:16px}
.cp-sec h3{font-size:20px;line-height:26px;color:${PENCIL};font-weight:400;text-decoration:none}
.cp-sec p{line-height:29px}
.cp-kw{line-height:30px}
.cp-ask{color:${RED}}
.cp-who{margin-top:14px!important;padding:6px 10px;border-left:3px solid #2c5444aa;line-height:28px}
.cp-zoom{position:fixed;inset:0;z-index:90;display:grid;place-items:center;background:#07060bf2;cursor:zoom-out;animation:gx-fade .15s}
.cp-zoom img{max-width:96vw;max-height:94vh;box-shadow:0 10px 40px #000}
@media (max-width:719px){
  .cp-top{flex-direction:column;align-items:center;gap:12px}
  .cp-img,.cp-img .gx-veil,.cp-img .ghost{width:190px}.cp-img .gx-veil,.cp-img .ghost{height:326px}
  .cp-side{align-self:stretch}
  .cp-words input{max-width:none}
}
`;

export function zoom(id) {
  const el = h('div.cp-zoom', { role: 'dialog', 'aria-label': CARD[id]?.name || '' }, h('img', { src: cardUrl(id), alt: CARD[id]?.name || '' }));
  const close = openOverlay(el);
  const pop = onEscape(() => { pop(); close(); });
  el.onclick = () => { pop(); close(); };
}

const astroLine = (c) => {
  const a = c.astro || {};
  if (!a.name) return null;
  const k = a.kind === 'planet' ? 'Pianeta' : a.kind === 'sign' ? 'Segno' : 'Elemento';
  return `${k}: ${a.name}.`;
};

export function cardBody(id) {
  css('ui-cardpage', CSS);
  const c = CARD[id] || {}, S = sheet(id) || {}, sl = slotOf(id), cs = state.cards?.[id];
  const known = sl.kind === 'veiled' || sl.kind === 'awake';
  const title = h('h2', {}, c.arcana === 'major' ? `${c.roman}. ${c.name}` : c.name);
  const img = h('button.cp-img', { type: 'button', 'aria-label': 'Ingrandisci' });
  if (known) { img.append(h(`span.gx-veil${sl.kind === 'veiled' ? '.veiled' : ''}`, {}, h('img', { src: cardUrl(id), alt: c.name }))); img.onclick = () => zoom(id); }
  else { const g = h('span.ghost'); g.style.display = 'block'; g.append(svgEl(silhouette(c.roman || ''))); img.append(g); img.style.cursor = 'default'; }
  const side = h('div.cp-side');
  if (known) {
    const st = h('div.cp-stars', { 'aria-label': `${sl.stars} stelle su 3` });
    for (let i = 0; i < 3; i++) st.append(svgEl(starMark(i < sl.stars, 18)));
    side.append(st);
    if (sl.kind === 'veiled') side.append(h('p.pencil.small', {}, 'Ancora velata. Si sveglia con la prima risposta giusta.'));
    const det = (S.details || []).find((d) => d.id === cs?.detail);
    if (det) side.append(h('div.cp-sec', h('span.cp-q', {}, 'Mi ha colpito'), h('p', {}, `${det.label}. `, h('span.pencil', {}, det.note || ''))));
    const words = [...(cs?.words || ['', '', ''])];
    const inputs = [0, 1, 2].map((i) => h('input', { type: 'text', value: words[i] || '', maxLength: 24, placeholder: ['una parola…', 'un\'altra…', 'e una terza'][i], 'aria-label': `Parola ${i + 1}`, autocomplete: 'off', autocapitalize: 'none', spellcheck: false,
      onchange: (e) => { words[i] = e.target.value; setWords(id, words); } }));
    side.append(h('div.cp-sec', h('span.cp-q', {}, 'Le mie tre parole'), h('div.cp-words', inputs)));
  } else if (sl.kind === 'taken') side.append(h('p', {}, 'Sequestrata dal tribunale.'), h('p.pencil', {}, 'La riprendo al deposito, rispondendo su di lei.'));
  else side.append(h('p.pencil', {}, S.rumour || 'Non l\'ho ancora trovata.'));
  // who embodies it here
  const who = Object.values(PEOPLE).filter((p) => p.card === id && p.id !== 'tu').map((p) => p.name);
  const mine = [];
  if (id === 'm00') mine.push('Il Matto sono io.');
  if (id === yourCard() && id !== 'm00') mine.push('È la mia carta, adesso.');
  if (id === state.player?.birthCard) mine.push(`La carta del mio segno${state.player?.sign ? `, ${SIGNS.find((s) => s.id === state.player.sign)?.name || ''}` : ''}.`);
  if (who.length) mine.push(`In questa storia è ${who.join(' e ')}.`);
  if (mine.length) side.append(h('p.cp-who', {}, mine.join(' ')));
  const L = [title, h('div.cp-top', img, side)];
  // the book's sheet
  const R = [];
  if (known || sl.kind === 'taken') {
    const sec = (t, body, cls) => (body ? h('div.cp-sec', h('h3', {}, t), h(`p${cls ? `.${cls}` : ''}`, {}, body)) : null);
    R.push(sec('Cosa si vede', S.see), sec('Cosa dice', S.says || S.core),
      sec('Altri modi di vederla', (S.keywords || []).join(' · '), 'cp-kw'), sec('Capovolta', S.reversed),
      sec(c.arcana === 'major' ? 'Pianeta, segno, elemento' : 'Elemento', astroLine(c)),
      sec('Come incarnarla', S.embody), sec('Una domanda', S.ask, 'cp-ask'));
  } else R.push(h('p.pencil', { style: { marginTop: '10px' } }, 'Quando la trovo, qui scrivo cosa vedo e cosa dice.'));
  if (R[0]) R[0].style.marginTop = '4px';
  return { L, R: R.filter(Boolean) };
}

export const showCard = (id) => openSheet({ label: CARD[id]?.name || 'Carta', build: () => ({ ...cardBody(id), single: true }) });
