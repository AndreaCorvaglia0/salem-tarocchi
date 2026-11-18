// The seventeen dynamics of docs/MANIFESTO.md («Ogni dinamica, con le sue due facce») and the generated page
// lore/metodo/meccaniche/_dinamiche.md: for each dynamic, the mechanics that belong to it with their two faces
// (`motivo`: why she does it, inside the game; `effetto`: what it does for learning) and their laws.
import { linkTarget } from './vault.mjs';

// id (the `dinamica` field of a meccanica), the name of the manifesto's row, its motive, its effect, its laws
export const DINAMICHE = [
  { id: 'trovare', nome: 'Girare e trovare cose', motivo: 'qualcosa luccica; l\'album ha caselle vuote', effetto: 'esposizione ai posti e ai concetti; il concetto prende un luogo', leggi: [2, 6] },
  { id: 'misteri', nome: 'Misteri e segreti', motivo: 'voglio sapere chi è, che cosa c\'è sotto', effetto: 'curiosità: attenzione alta su tutto quello che sta intorno', leggi: [2] },
  { id: 'laboratorio', nome: 'Il laboratorio', motivo: 'è bello da vedere e da toccare', effetto: 'immagine e gesto: il concetto prende un corpo', leggi: [3] },
  { id: 'parole-sue', nome: 'Parole sue, dettagli, domande', motivo: 'dire la mia; essere letta', effetto: 'generare, guardare da più lati', leggi: [4, 7] },
  { id: 'decisioni', nome: 'Le decisioni', motivo: 'che cosa faccio? chi sono?', effetto: 'coinvolgimento; concetti usati per scegliere', leggi: [5, 7] },
  { id: 'missioni', nome: 'Le missioni', motivo: 'qualcuno ha bisogno; voglio andare avanti', effetto: 'richiamo attivo; i concetti diventano rilevanti', leggi: [2, 5] },
  { id: 'letture', nome: 'Le letture', motivo: 'una cliente aspetta una risposta', effetto: 'richiamo, unione di più concetti, trasferimento', leggi: [5] },
  { id: 'esami-e-prove', nome: 'Esami e prove', motivo: 'passare, non perdere', effetto: 'verifica del nucleo; l\'errore con riscontro', leggi: [1, 5] },
  { id: 'ripasso', nome: 'Il ripasso', motivo: 'mi serve per stanotte', effetto: 'recupero distanziato di quello che non regge', leggi: [1, 8] },
  { id: 'gesti-del-giorno', nome: 'I gesti del giorno', motivo: 'un minuto bello; l\'orto ha sete', effetto: 'costanza; ripasso travestito', leggi: [8] },
  { id: 'grimorio-e-album', nome: 'Grimorio, album, schede', motivo: 'vedere che cosa ho e che cosa manca', effetto: 'la mappa di quello che sa: nucleo e segnini', leggi: [1, 9] },
  { id: 'gradi-e-zone', nome: 'Gradi, poteri, zone nuove', motivo: 'diventare strega; arrivare dove non potevo', effetto: 'un passo alla volta; competenza', leggi: [9] },
  { id: 'personaggi', nome: 'I personaggi', motivo: 'mi piacciono; reagiscono a me', effetto: 'emozione e racconto; rispecchiarsi', leggi: [6, 7] },
  { id: 'casa', nome: 'La casa che cresce', motivo: 'è casa mia', effetto: 'il progresso si vede in un posto', leggi: [7, 9] },
  { id: 'rito', nome: 'Il rito', motivo: 'un momento mio prima di leggere', effetto: 'attenzione; un gesto con un significato', leggi: [3, 8] },
  { id: 'libri', nome: 'I libri', motivo: 'curiosità; uno scaffale da riempire', effetto: 'contorno facoltativo, legato al nucleo', leggi: [1, 2] },
  { id: 'interessi', nome: 'Gli interessi', motivo: 'scegliere chi diventare', effetto: 'applicazione pratica; i concetti si legano tra loro', leggi: [5, 7, 9] },
];
export const DINAMICA_IDS = DINAMICHE.map((d) => d.id);

const cell = (s) => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
const list = (v) => (Array.isArray(v) ? v : []).map(linkTarget).filter(Boolean);

// the page: V is the vault; returns the text of lore/metodo/meccaniche/_dinamiche.md
export function dinamichePage(V, header) {
  const mecc = V.ofTipo('meccanica').slice().sort((a, b) => a.name.localeCompare(b.name));
  const L = ['# Le dinamiche e le loro due facce', '', header, '',
    'Ogni meccanica ha due facce: il **motivo** (perché lei lo fa, dentro il gioco) e l\'**effetto** (che cosa fa per l\'apprendimento, anche se lei non se ne accorge). Le dinamiche sono le righe della tabella di `docs/MANIFESTO.md`; ogni meccanica sceglie la sua col campo `dinamica` e dice le sue leggi in `leggi`.', ''];
  for (const D of DINAMICHE) {
    const ms = mecc.filter((d) => d.data.dinamica === D.id);
    L.push(`## ${D.nome}`, '', `Nel manifesto: il motivo è «${D.motivo}»; l'effetto è «${D.effetto}». Leggi ${D.leggi.join(', ')}.`, '');
    if (!ms.length) { L.push('Nessuna meccanica.', ''); continue; }
    L.push('| Meccanica | Il motivo | L\'effetto | Leggi |', '|---|---|---|---|');
    for (const d of ms) L.push(`| [[${d.name}]] | ${cell(d.data.motivo)} | ${cell(d.data.effetto)} | ${list(d.data.leggi).map((x) => `[[${x}]]`).join(', ')} |`);
    L.push('');
  }
  return `${L.join('\n').trimEnd()}\n`;
}
