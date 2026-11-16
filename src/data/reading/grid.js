// How a Minor is read without learning 56 cards by heart: NUMBER × SUIT.
// The suit says WHERE in life (which of the four elements), the number says WHAT is happening there.
// "Cinque di Coppe" = cinque (qualcosa si rompe) × Coppe (il cuore) = una perdita che fa male al cuore.
// Every Minor's `essenza` must be readable as this product. The lesson on the Minors teaches this table,
// and the reading screen can show it as a reminder.
export const SEMI = {
  w: { nome: 'Bastoni', elemento: 'fuoco', dove: 'la volontà', idea: 'quello che vuoi fare: slancio, azione, progetti' },
  c: { nome: 'Coppe', elemento: 'acqua', dove: 'il cuore', idea: 'quello che senti: affetti, legami, desideri' },
  s: { nome: 'Spade', elemento: 'aria', dove: 'la mente', idea: 'quello che pensi e dici: idee, parole, conflitti' },
  p: { nome: 'Denari', elemento: 'terra', dove: 'le cose concrete', idea: 'quello che hai e costruisci: lavoro, soldi, casa, corpo' },
};
// 1..10: what happens. One plain phrase each, and a single word to remember it by.
export const NUMERI = {
  1: { parola: 'inizio', idea: 'comincia qualcosa: un seme, un dono, una possibilità' },
  2: { parola: 'coppia', idea: 'due cose si incontrano: un legame, un equilibrio, una scelta' },
  3: { parola: 'crescita', idea: 'qualcosa cresce e dà il primo frutto, spesso insieme ad altri' },
  4: { parola: 'sosta', idea: 'ci si ferma: stabilità, riposo, ma anche immobilità' },
  5: { parola: 'scossa', idea: 'qualcosa si rompe: un conflitto, una perdita, una prova' },
  6: { parola: 'armonia', idea: 'torna l\'equilibrio: si dà e si riceve, si va verso il meglio' },
  7: { parola: 'verifica', idea: 'ci si ferma a valutare: una prova di pazienza, un dubbio, una difesa' },
  8: { parola: 'movimento', idea: 'le cose si muovono: impegno, velocità, oppure un allontanarsi' },
  9: { parola: 'quasi', idea: 'si è quasi in fondo: il culmine, nel bene o nel peso' },
  10: { parola: 'compimento', idea: 'il ciclo si chiude: tutto il bene, o tutto il peso, di quel seme' },
};
// 11..14: the court. WHO, more than what: a person, or a way of being.
export const FIGURE = {
  11: { nome: 'Fante', parola: 'chi impara', idea: 'una notizia, un inizio da apprendista, la curiosità' },
  12: { nome: 'Cavaliere', parola: 'chi va', idea: 'l\'azione, la spinta, qualcuno che arriva o parte' },
  13: { nome: 'Regina', parola: 'chi custodisce', idea: 'la padronanza dentro: cura, sensibilità, maturità' },
  14: { nome: 'Re', parola: 'chi governa', idea: 'la padronanza fuori: autorità, responsabilità, guida' },
};
