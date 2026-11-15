// Reading with her real deck ("verifica"): choose a spread, point at the cards she drew, then walk through
// the reading position by position. "Prova tu prima" hides the text until she taps. No score.
import { h, css, cardUrl } from '../core/dom.js';
import { state } from '../core/state.js';
import { CARD, MAJORS, MINORS, SUITS } from '../data/cards.base.js';
import { SPREADS } from '../data/spreads.js';
import { sheet } from '../data/cards.js';
import { screen, btn, mood, moodBack } from './theme.js';
import { posHeader } from './readview.js';
import { lineFor } from './reading.rules.js';

const CSS = `
.sxg-opts{display:flex;flex-direction:column;gap:10px}
.sxg-opts .sx-btn{flex-direction:column;align-items:flex-start;gap:0;text-align:left;min-height:64px}
.sxg-opts small{color:var(--dim);font-size:16px;font-weight:400}
.sxg-toggle{display:flex;align-items:center;gap:10px;min-height:48px;padding:6px 14px;border:1.5px solid var(--line);border-radius:12px;background:none;cursor:pointer;text-align:left;font-size:18px;color:inherit}
.sxg-toggle i{flex:none;width:26px;height:26px;border-radius:7px;border:2px solid var(--dim);display:grid;place-items:center;font-style:normal;color:var(--gold-ink)}
.sxg-toggle.on i{background:var(--gold);border-color:var(--gold)}
.sxg-tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}
.sxg-tabs button{flex:none;min-height:44px;padding:0 14px;border-radius:22px;border:1.5px solid var(--line);background:none;cursor:pointer;font-size:17px}
.sxg-tabs button.on{background:var(--gold);color:var(--gold-ink);border-color:var(--gold)}
.sxg-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.sxg-c{display:flex;flex-direction:column;gap:3px;padding:0;border:0;background:none;cursor:pointer;text-align:center;min-width:0}
.sxg-c .sx-card{width:100%;aspect-ratio:350/600;background-size:cover}
.sxg-c span{font-size:14px;line-height:1.1;color:var(--dim);min-height:2.2em}
.sxg-c.sel .sx-card{box-shadow:0 0 0 3px var(--gold),0 0 16px #ffd97a88}
.sxg-c:disabled{opacity:.3}
.sxg-big{display:flex;justify-content:center}
.sxg-big .sx-card{width:min(40vw,150px);aspect-ratio:350/600;background-size:cover}
.sxg-big.rev .sx-card{transform:rotate(180deg)}
.sxg-text{padding:12px 14px;border-radius:12px;background:var(--panel);border:1.5px solid var(--line);display:flex;flex-direction:column;gap:8px}
.sxg-text p{margin:0;font-size:19px}.sxg-text .core{color:var(--gold)}
.sxg-kw{display:flex;flex-wrap:wrap;gap:6px}.sxg-kw span{padding:3px 11px;border-radius:14px;background:#ffffff12;font-size:16px}
.sxg-rev{color:var(--sky);font-size:16px;letter-spacing:.04em;text-transform:uppercase}
`;

const SUIT_TABS = [['m', 'Maggiori'], ...Object.values(SUITS).map((s) => [s.id, s.name])];
const toggle = (label, sub, on, onchange) => {
  const b = h('button.sxg-toggle', { type: 'button' }, h('i'), h('span', label, sub ? h('small', { style: { display: 'block', color: 'var(--dim)', fontSize: '15px' } }, sub) : null));
  const set = (v) => { b.classList.toggle('on', v); b.firstChild.textContent = v ? '✓' : ''; };
  b.onclick = () => { on = !on; set(on); onchange?.(on); };
  set(on);
  return b;
};

export async function free({ all = false } = {}) {
  css('sxg', CSS);
  const scr = screen({ title: 'Lettura con il tuo mazzo', cls: 'sxfree', onClose: () => finish(null) });
  mood('reading');
  let finish;
  const closed = new Promise((r) => { finish = r; });
  const run = async () => {
    // ---- the spread --------------------------------------------------------------------------
    const taught = Object.values(SPREADS).filter((s) => state.spreads[s.id]);
    const list = all || !taught.length ? Object.values(SPREADS) : taught;
    let tryFirst = false;
    const sp = await new Promise((res) => {
      scr.setBody(h('p.sx-lab', 'Hai steso delle carte con il tuo mazzo vero? Dimmi quali e ti accompagno, posizione per posizione.'),
        h('div.sxg-opts', list.map((s) => btn([s.name, h('small', `${s.positions.length} ${s.positions.length === 1 ? 'carta' : 'carte'}`)], () => res(s)))),
        toggle('Prova tu prima', 'Il testo resta nascosto: leggi la carta tu, poi controlli.', false, (v) => { tryFirst = v; }));
      scr.setFoot();
    });

    // ---- the cards she drew ------------------------------------------------------------------
    const N = sp.positions.length, ids = new Array(N).fill(null), rev = new Array(N).fill(false);
    const minors = (state.chapter || 0) >= 4;
    let tab = 'm';
    for (let i = 0; i < N; i++) {
      let sel = null, reversed = false;
      const draw = () => {
        const set = tab === 'm' ? MAJORS : MINORS.filter((c) => c.suit === tab);
        const taken = new Set(ids.filter(Boolean));
        const grid = h('div.sxg-grid', set.map((c) => h(`button.sxg-c${sel === c.id ? '.sel' : ''}`, { type: 'button', disabled: taken.has(c.id), onclick: () => { sel = c.id; draw(); } },
          h('div.sx-card', { style: { backgroundImage: `url(${cardUrl(c.id)})` } }), h('span', c.arcana === 'major' ? `${c.roman} ${c.name.replace(/^(Il|La|Lo|L'|Gli|Le) ?/, '')}` : c.name))));
        const tabs = minors ? h('div.sxg-tabs', SUIT_TABS.map(([k, l]) => h(`button${tab === k ? '.on' : ''}`, { type: 'button', onclick: () => { tab = k; draw(); } }, l))) : null;
        scr.setBody(posHeader(sp, ids, i, 0), h('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, h('p.sx-lab', { style: { flex: 1, margin: 0 } }, 'Quale carta hai estratto?'), h('div', { style: { flex: 'none' } }, toggle('A rovescio', null, reversed, (v) => { reversed = v; }))), tabs, grid);
        scr.setFoot(i ? btn('Indietro', () => back(), 'ghost') : null, btn(sel ? `${CARD[sel].name}` : 'Scegli una carta', () => next(), 'go'));
        scr.foot.lastChild.disabled = !sel;
      };
      let next, back;
      const r = await new Promise((res) => { next = () => res(1); back = () => res(-1); draw(); });
      if (r === -1) { i -= 2; continue; }
      ids[i] = sel; rev[i] = reversed;
    }

    // ---- the walk-through --------------------------------------------------------------------
    for (let i = 0; i < N; i++) {
      const id = ids[i], c = sheet(id), pos = sp.positions[i];
      let shown = !tryFirst;
      const text = h('div.sxg-text');
      const fillText = () => {
        text.replaceChildren();
        if (!shown) { text.append(h('p.sx-lab', 'Prima guarda la carta. Cosa ti dice, in questa posizione? Poi controlla.')); return; }
        if (rev[i]) text.append(h('span.sxg-rev', 'A rovescio'), h('p', c.reversed || 'Capovolta: il contrario, o lo stesso ma bloccato.'));
        else text.append(h('p', lineFor(id, pos.id, sp.id)));
        if (c.core) text.append(h('p.core', c.core));
        if (c.keywords?.length) text.append(h('div.sxg-kw', c.keywords.map((k) => h('span', k))));
      };
      fillText();
      scr.setBody(posHeader(sp, ids, i, N),
        h(`div.sxg-big${rev[i] ? '.rev' : ''}`, h('div.sx-card', { style: { backgroundImage: `url(${cardUrl(id)})` } })),
        h('div', { style: { textAlign: 'center', fontSize: '24px' } }, CARD[id].name, rev[i] ? ' (a rovescio)' : ''),
        text);
      const r = await new Promise((res) => {
        scr.setFoot(i ? btn('Indietro', () => res(-1), 'ghost') : null,
          tryFirst ? btn('Mostra cosa dice', (e) => { shown = true; fillText(); e.currentTarget.hidden = true; }, 'ghost') : null,
          btn(i === N - 1 ? 'Fine' : 'Avanti', () => res(1), 'go'));
      });
      if (r === -1) i -= 2;
    }
  };
  run().then(() => finish(null));
  await closed;
  scr.close();
  moodBack();
}
