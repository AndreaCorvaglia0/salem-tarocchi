// The library (docs/DESIGN.md, "La biblioteca"): a narrow room of shelves in the slate house of the upper
// village, where she goes over what a trial will need. The desk opens the library's book (ui/library.js,
// service library.open; the world finds it through a CAST prop added by glue/trials.js).
export default {
  id: 'library',
  name: 'La biblioteca',
  mapDoor: 'village.library_door', // inside: on the grimoire's map she is at its door
  inside: true,
  ground: '_',
  start: 'door',
  rows: [
    'wwwwwwwwww',
    'wRRwNwwRRw',
    'w_______Kw',
    'w_TT____Lw',
    'w________w',
    'w;;;___D_w',
    'w;;;_____w',
    'wwww+wwwww',
  ],
  key: {
    R: { kind: 'shelf' },
    N: { kind: 'window' },
    K: { kind: 'lectern' },
    T: { kind: 'table', cloth: 'violet' },
    L: { kind: 'candle' },
    D: { kind: 'cabinet' },
  },
  anchors: {
    door: [4, 6, 'La porta'],
    desk: [2, 4, 'Il tavolo dei libri'],
    book: [4, 3, 'Un libro aperto'], // Altrove: the story read in the library (glue/elsewhere.js)
  },
  doors: [{ at: 'door', to: 'village.library_door', look: 'mat' }],
};
