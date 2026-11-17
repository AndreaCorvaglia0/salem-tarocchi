// The cottage at the edge of the woods: your home, readings at the table, the card of the day in bed.
export default {
  id: 'cottage',
  name: 'La capanna',
  mapDoor: 'village.cottage_door', // inside: on the grimoire's map she is at its door
  inside: true,
  ground: '_',
  start: 'door',
  rows: [
    'wwwwwwwwww',
    'wwNwwRwHHw',
    'w______HHw',
    'w_____;;_w',
    'w_TT__;;Bw',
    'w_____;;Bw',
    'wL_______w',
    'w________w',
    'wwww+wwwww',
  ],
  key: {
    N: { kind: 'window' },
    R: { kind: 'shelf' },
    H: { kind: 'hearth', small: true },
    T: { kind: 'table', cloth: 'violet', cards: true },
    B: { kind: 'bed', quilt: 'violet' },
    L: { kind: 'candle' },
  },
  anchors: {
    door: [4, 7, 'La porta'],
    table: [2, 5, 'Il tavolo delle letture'],
    bed: [7, 5, 'Il letto'],
    shelf: [5, 2, 'La mensola'], // Altrove: the green bottle (glue/elsewhere.js)
  },
  doors: [{ at: 'door', to: 'village.cottage_door', look: 'mat' }],
};
