// STUB by the lead; the cards agent replaces it (docs/CONTRACT.md).
export const SPREADS = {
  single: { id: 'single', name: 'Carta singola', taughtBy: 'malva', positions: [{ id: 'present', n: 1, label: 'La carta', hint: 'Una risposta, un consiglio.', x: 50, y: 50 }] },
  ppf: { id: 'ppf', name: 'Passato, presente, futuro', taughtBy: 'ortica', positions: [
    { id: 'past', n: 1, label: 'Passato', hint: 'Da dove viene.', x: 20, y: 50 }, { id: 'present', n: 2, label: 'Presente', hint: 'Dove si trova.', x: 50, y: 50 }, { id: 'future', n: 3, label: 'Futuro', hint: 'Dove sta andando.', x: 80, y: 50 }] },
  celtic: { id: 'celtic', name: 'Croce celtica', taughtBy: 'edera', positions: [
    { id: 'present', n: 1, label: 'Il presente', hint: 'Dove sei adesso.', x: 34, y: 50 }, { id: 'cross', n: 2, label: 'Ciò che ti attraversa', hint: 'Ostacolo o sostegno.', x: 34, y: 50, rot: 90 },
    { id: 'root', n: 3, label: 'Le fondamenta', hint: 'Da dove vieni.', x: 34, y: 82 }, { id: 'past', n: 4, label: 'Il passato recente', hint: 'Ciò che si allontana.', x: 12, y: 50 },
    { id: 'possible', n: 5, label: 'Le possibilità', hint: 'Ciò che può nascere.', x: 34, y: 18 }, { id: 'future', n: 6, label: 'Il futuro prossimo', hint: 'Ciò che arriva.', x: 56, y: 50 },
    { id: 'self', n: 7, label: 'Tu adesso', hint: 'Il tuo atteggiamento.', x: 84, y: 86 }, { id: 'environment', n: 8, label: "L'ambiente", hint: 'Chi e cosa ti sta intorno.', x: 84, y: 62 },
    { id: 'hopefear', n: 9, label: 'Speranze e paure', hint: 'Ciò che speri e temi.', x: 84, y: 38 }, { id: 'outcome', n: 10, label: "L'esito", hint: 'Dove sei diretta.', x: 84, y: 14 }] },
};
