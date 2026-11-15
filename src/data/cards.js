// STUB written by the lead so that other modules can import while the real sheets are being written.
// The cards agent replaces this whole file (schema: docs/CONTRACT.md, "Data: cards").
import { CARD, CARDS } from './cards.base.js';
const AS = ['present', 'cross', 'root', 'past', 'possible', 'future', 'self', 'environment', 'hopefear', 'outcome'];
export const SHEETS = Object.fromEntries(CARDS.map((c) => [c.id, {
  see: `Nell'immagine: ${c.name}. (testo provvisorio)`,
  details: [{ id: 'a', label: 'la figura', x: 50, y: 45, r: 16, note: 'Cosa sta facendo?' }, { id: 'b', label: 'il cielo', x: 50, y: 12, r: 12, note: 'Che ora è?' }, { id: 'c', label: 'il terreno', x: 50, y: 85, r: 12, note: 'Dove siamo?' }],
  says: `${c.name} parla di ${(c.words || ['qualcosa']).join(', ')}. (testo provvisorio)`,
  core: `${(c.words || ['qualcosa'])[0]}.`,
  keywords: [...(c.words || ['uno', 'due', 'tre']), 'quattro', 'cinque', 'sei'],
  reversed: 'Capovolta: il contrario, o lo stesso ma bloccato. (testo provvisorio)',
  embody: 'Fai una cosa piccola che le somigli. (testo provvisorio)',
  ask: 'Quando ti è successo? (testo provvisorio)',
  as: Object.fromEntries(AS.map((k) => [k, `${c.name} come ${k}. (testo provvisorio)`])),
  confusables: [],
  rumour: 'Si dice che sia da qualche parte. (testo provvisorio)',
}]));
export const sheet = (id) => ({ ...CARD[id], ...SHEETS[id] });
