// The grimoire, the game's only menu (docs/DESIGN.md, "Il grimorio"): an object of the story written
// in her hand, first person. Three ribbon bookmarks: Io, Carte, Mappa. Settings sit behind a small
// plain button in the corner. grimoire.open({ tab, study }) resolves when it is closed.
import { h, openOverlay } from '../core/dom.js';
import { state, reset, saveNow } from '../core/state.js';
import { bookFrame, onEscape } from './book.js';
import { RIB } from './paper.js';
import { ioPages } from './io.js';
import { cartePages } from './carte.js';
import { mappaPages } from './mappa.js';

const TABS = [['io', 'Io'], ['carte', 'Carte'], ['mappa', 'Mappa']];
const BUILD = { io: ioPages, carte: cartePages, mappa: mappaPages };

function settingsPanel(panel, done) {
  const s = state.settings || (state.settings = { music: true, sfx: true });
  const tog = (key, label) => {
    const b = h('button.bk-tog', { type: 'button' });
    const draw = () => { b.setAttribute('aria-pressed', String(!!s[key])); b.replaceChildren(h('span', {}, label), h('span.v', {}, s[key] ? 'sì' : 'no')); };
    b.onclick = () => { s[key] = !s[key]; saveNow(); draw(); };
    draw();
    return b;
  };
  const again = h('button.bk-tog.warn', { type: 'button' }, h('span', {}, 'Ricomincia da capo'), h('span.v', {}, '›'));
  again.onclick = () => {
    panel.replaceChildren(h('p', {}, 'Si perde tutta la partita: carte, livelli, diario. Sicura?'),
      h('button.bk-tog.warn', { type: 'button', onclick: () => { reset(); done(); globalThis.location?.reload(); } }, h('span', {}, 'Sì, ricomincia'), h('span.v', {}, '')),
      h('button.bk-tog', { type: 'button', onclick: () => settingsPanel(panel, done) }, h('span', {}, 'No, tengo la partita'), h('span.v', {}, '')));
  };
  panel.replaceChildren(tog('music', 'Musica'), tog('sfx', 'Suoni'), again);
}

export function openGrimoire({ tab = 'io', study = false } = {}) {
  let cur = BUILD[tab] ? tab : 'io', closeOverlay = () => {}, popEsc = () => {}, resolveP;
  const ribs = h('div.bk-ribs', { role: 'tablist', 'aria-label': 'Segnalibri' });
  const btns = TABS.map(([id, name]) => h('button.bk-rib', { type: 'button', role: 'tab', style: `--rib:${RIB[id]}`, onclick: () => show(id) }, name));
  ribs.append(...btns);
  const finish = () => { popEsc(); globalThis.removeEventListener('keydown', key, true); closeOverlay(); resolveP?.(); };
  const b = bookFrame({ ribbons: ribs, onClose: finish, label: 'Il grimorio', mid: '', settings: (panel) => settingsPanel(panel, finish) });
  const ctx = { study, close: finish, rerender: () => show(cur), book: b };
  function show(t) {
    cur = t;
    btns.forEach((x, i) => x.setAttribute('aria-selected', String(TABS[i][0] === t)));
    const { L, R, single, folio } = BUILD[t](ctx);
    b.fill(L, R, { single, folio });
    b.el.dataset.tab = t;
  }
  const key = (e) => {
    if (e.target?.tagName === 'INPUT' || e.target?.tagName === 'TEXTAREA') return;
    if (document.querySelector('.sh-top')) return; // a sheet is open above
    const i = TABS.findIndex(([id]) => id === cur);
    if (e.key >= '1' && e.key <= '3') { e.preventDefault(); show(TABS[+e.key - 1][0]); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(TABS[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3][0]); }
  };
  return new Promise((resolve) => {
    resolveP = resolve;
    closeOverlay = openOverlay(b.el);
    popEsc = onEscape(() => { if (!b.el.closeSettings?.()) finish(); });
    globalThis.addEventListener('keydown', key, true);
    show(cur);
    b.el.dataset.ready = '1';
  });
}
