// The three spreads taught in the game: where each card goes, what it means there, how to lay it.
// x y are the centre of the card, in percent of a portrait rectangle; cardW is the suggested card
// width in percent of that rectangle. `rot` is a rotation in degrees (the crossing card of the cross).
// Position ids are the keys of `as` in data/cards.js.

export const SPREADS = {
  single: {
    id: 'single',
    name: 'Carta singola',
    taughtBy: 'malva',
    modes: ['domanda', 'quadro'],
    cardW: 40,
    how: 'Pensa alla domanda, mescola e pesca una carta sola, da mettere al centro. Guardala prima per quello che vedi, poi chiediti cosa dice a te, oggi.',
    positions: [
      { id: 'present', n: 1, label: 'La carta', hint: 'La risposta di oggi, in una sola immagine.', x: 50, y: 50 },
    ],
  },
  ppf: {
    id: 'ppf',
    name: 'Passato, presente, futuro',
    taughtBy: 'ortica',
    modes: ['domanda', 'quadro'],
    cardW: 27,
    how: 'Pesca tre carte e mettile in fila da sinistra a destra: passato, presente, futuro. Leggile come una piccola storia, dall\'inizio alla fine, e cerca il filo che le tiene insieme.',
    positions: [
      { id: 'past', n: 1, label: 'Passato', hint: 'Da dove viene la storia.', x: 18, y: 50 },
      { id: 'present', n: 2, label: 'Presente', hint: 'Dove si trova adesso.', x: 50, y: 50 },
      { id: 'future', n: 3, label: 'Futuro', hint: 'Dove va, se nulla cambia.', x: 82, y: 50 },
    ],
  },
  celtic: {
    id: 'celtic',
    name: 'Croce celtica',
    taughtBy: 'edera',
    modes: ['domanda', 'quadro'],
    cardW: 18,
    how: 'Metti la 1 al centro, la 2 di traverso sopra la 1, poi la 3 sotto, la 4 a sinistra, la 5 sopra e la 6 a destra; infine la colonna a destra, dal basso verso l\'alto: 7, 8, 9, 10. Leggi prima il cuore della croce (1 e 2), poi le quattro carte attorno, poi la colonna, e chiudi con la 10.',
    positions: [
      { id: 'present', n: 1, label: 'Il presente', hint: 'Il cuore della questione, qui e ora.', x: 34, y: 50 },
      { id: 'cross', n: 2, label: 'Ciò che ti attraversa', hint: 'Ciò che ti ostacola o ti sostiene, di traverso.', x: 34, y: 50, rot: 90 },
      { id: 'root', n: 3, label: 'Le fondamenta', hint: 'Le radici: da dove nasce la storia.', x: 34, y: 82 },
      { id: 'past', n: 4, label: 'Il passato recente', hint: 'Ciò che si sta allontanando.', x: 10, y: 50 },
      { id: 'possible', n: 5, label: 'Le possibilità', hint: 'Ciò che potrebbe nascere, sopra di te.', x: 34, y: 18 },
      { id: 'future', n: 6, label: 'Il futuro prossimo', hint: 'Ciò che sta arrivando a breve.', x: 58, y: 50 },
      { id: 'self', n: 7, label: 'Tu adesso', hint: 'Come ti vedi e come ti poni.', x: 84, y: 86 },
      { id: 'environment', n: 8, label: "L'ambiente", hint: 'Le persone e le cose attorno a te.', x: 84, y: 62 },
      { id: 'hopefear', n: 9, label: 'Speranze e paure', hint: 'Ciò che speri e ciò che temi.', x: 84, y: 38 },
      { id: 'outcome', n: 10, label: "L'esito", hint: 'Dove porta tutto, se prosegui.', x: 84, y: 14 },
    ],
  },
};
