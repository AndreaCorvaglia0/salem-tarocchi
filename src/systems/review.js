// Calm flashcards, no stakes: the picture, she thinks, taps, sees the name, the core, the keywords and the
// planet or sign; then "La sapevo" or "Non ancora". Due cards first, then the rest of what she owns. Max 10.
import { h, css, cardUrl } from '../core/dom.js';
import { answer, dueIds, ownedIds, dayCard } from '../core/progress.js';
import { sheet } from '../data/cards.js';
import { screen, btn, say, shuffle, pickOne } from './theme.js';

const CSS = `
.sxv-card{display:flex;justify-content:center}
.sxv-card .sx-card{width:min(56vw,210px);aspect-ratio:350/600;background-size:cover}
.sxv-name{margin:0;text-align:center;font-size:28px;font-weight:400}
.sxv-name small{display:block;color:var(--gold);font-size:19px;margin-top:2px}
.sxv-core{margin:0;text-align:center;font-size:21px;font-style:italic;color:#fff7e3}
.sxv-kw{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.sxv-kw span{padding:3px 11px;border-radius:14px;background:#ffffff12;font-size:16px}
.sxv-astro{text-align:center;color:var(--sky);font-size:18px}
.sxv-prog{font-family:Georgia,'Times New Roman',serif;text-align:center;color:var(--dim);font-size:16px}
.sxv-think{text-align:center;font-size:21px;font-style:italic;color:var(--dim);margin:4px 0}
`;
const KIND = { planet: 'Pianeta', sign: 'Segno', element: 'Elemento' };
const END = {
  all: ['Tartufo si stira. «Tutte. Quasi mi annoio.»', 'Tartufo chiude un occhio, soddisfatto. «Va bene, va bene. Le sai.»'],
  some: ['Tartufo ti guarda dal davanzale. «Quelle che non sapevi tornano. Come me.»', 'Tartufo sbadiglia. «Ripassare è come fare le fusa: più lo fai, meglio ti viene.»'],
  none: ['Tartufo ti sale in grembo. «Giornata storta. Domani sarà un\'altra carta.»'],
};

export async function review({ ids } = {}) {
  css('sxv', CSS);
  const owned = new Set(ownedIds());
  let list;
  if (ids?.length) list = ids.filter((id) => owned.has(id) || sheet(id));
  else { const due = dueIds(); list = [...shuffle(due), ...shuffle([...owned].filter((id) => !due.includes(id)))]; }
  const today = dayCard(); // the card of the day comes first
  if (!ids?.length && today && owned.has(today)) list = [today, ...list.filter((id) => id !== today)];
  list = list.slice(0, 10);
  const scr = screen({ title: 'Ripasso', cls: 'sxreview', onClose: () => { stop = true; kick?.(); } });
  let stop = false, kick = null;
  const tap = (label, cls = 'go') => new Promise((res) => { kick = () => res(null); scr.setFoot(btn(label, () => res(true), cls)); });
  if (!list.length) {
    scr.setBody(say('Tartufo', 'Non hai ancora carte da ripassare. Trovane qualcuna, poi torno a farti le domande.'));
    await tap('Va bene'); scr.close(); return;
  }
  let knew = 0, seen = 0;
  for (let i = 0; i < list.length && !stop; i++) {
    const id = list[i], c = sheet(id);
    scr.setBody(h('div.sxv-prog', `${i + 1} di ${list.length}`), h('div.sxv-card.sx-in', h('div.sx-card', { style: { backgroundImage: `url(${cardUrl(id)})` } })), h('p.sxv-think', 'Che carta è? Cosa dice? Pensaci un momento.'));
    if (!(await tap('Mostrami'))) break;
    const astro = c.astro ? `${KIND[c.astro.kind] || ''}: ${c.astro.name}` : '';
    scr.setBody(h('div.sxv-prog', `${i + 1} di ${list.length}`), h('div.sxv-card', h('div.sx-card', { style: { backgroundImage: `url(${cardUrl(id)})` } })),
      h('h2.sxv-name.sx-in', c.name, c.roman ? h('small', c.roman) : null), c.core ? h('p.sxv-core', c.core) : null,
      c.keywords?.length ? h('div.sxv-kw', c.keywords.slice(0, 6).map((k) => h('span', k))) : null, astro ? h('div.sxv-astro', astro) : null);
    const ok = await new Promise((res) => { kick = () => res(null); scr.setFoot(btn('Non ancora', () => res(false), 'ghost'), btn('La sapevo', () => res(true), 'go')); });
    if (ok === null) break;
    seen++; if (ok) knew++;
    answer(id, ok, 'image'); // the review lifts only the first star: the others are earned by answering
  }
  const bucket = !seen ? 'some' : knew === seen ? 'all' : knew ? 'some' : 'none';
  scr.setBody(h('h2.sxv-name.sx-in', seen ? `${knew} su ${seen}` : 'A presto'), say('Tartufo', pickOne(END[bucket])));
  await tap('Chiudo il libro');
  scr.close();
}
