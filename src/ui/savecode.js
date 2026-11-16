// "Il codice della partita": the whole game as a text she can copy somewhere safe (the notes of the phone)
// and paste back from the title screen ("Ho un codice"). openCode() shows it with a Copy button.
import { h, css, openOverlay } from '../core/dom.js';
import { exportCode, status } from '../core/vault.js';
import { SERIF, HAND, GOLD } from './paper.js';

const CSS = `
.sc{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;padding:18px;background:#07070de8;animation:gx-fade .3s}
.sc-box{width:min(420px,100%);padding:20px 18px;border:1px solid ${GOLD};border-radius:8px;background:#17121c;color:#efe4c8;font:18px/1.4 ${SERIF}}
.sc-box h2{margin:0 0 8px;font:400 26px ${SERIF}}
.sc-box p{margin:0 0 12px}
.sc-box .note{font:20px/25px ${HAND};color:#cdbf9f}
.sc-box textarea{display:block;width:100%;height:120px;box-sizing:border-box;padding:8px;border-radius:6px;border:1px solid #d8b25a66;background:#0b0a10;color:#e9dcc0;font:13px/1.3 ui-monospace,monospace;resize:none;word-break:break-all;user-select:text;-webkit-user-select:text}
.sc-acts{display:flex;gap:10px;margin-top:14px}
.sc-acts button{flex:1;min-height:50px;border-radius:6px;border:1px solid #d8b25a66;background:#0b0a10;color:#f1e6cb;font:20px ${SERIF};cursor:pointer}
.sc-acts button.main{border-color:${GOLD};background:#2a2016}
`;
export const CODE_CSS = CSS;

export async function openCode() {
  css('ui-savecode', CSS);
  const code = await exportCode();
  const area = h('textarea', { readOnly: true, 'aria-label': 'Il codice della partita' }); area.value = code;
  const said = h('p.note', {}, status().cloud === true ? 'La partita è salvata anche online. Il codice è una copia in più.' : 'Incollalo nelle note del telefono: se la partita sparisce, dalla prima schermata tocchi «Ho un codice» e riprendi da qui.');
  return new Promise((resolve) => {
    const copy = h('button.main', { type: 'button', onclick: async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(code); ok = true; } catch { /* select it instead */ }
      if (!ok) { area.focus(); area.select(); try { ok = document.execCommand('copy'); } catch { /* */ } }
      said.textContent = ok ? 'Copiato. Adesso incollalo in un posto sicuro, per esempio nelle note.' : 'Non riesco a copiarlo da solo: tieni premuto sul codice, scegli «Seleziona tutto» e poi «Copia».';
    } }, 'Copia');
    const el = h('div.sc', { role: 'dialog', 'aria-label': 'Il codice della partita' }, h('div.sc-box', h('h2', {}, 'Il codice della partita'),
      h('p', {}, 'Questo codice contiene tutta la partita fino a questo momento.'), area, said,
      h('div.sc-acts', copy, h('button', { type: 'button', onclick: () => { close(); resolve(); } }, 'Chiudi'))));
    const close = openOverlay(el);
  });
}
