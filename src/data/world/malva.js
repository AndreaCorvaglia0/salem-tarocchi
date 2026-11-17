// Comare Malva's house: hearth, table, drying herbs. Format: README.md in this folder.
export default {
  id: 'malva',
  name: 'Casa di Malva',
  mapDoor: 'village.malva_door', // inside: on the grimoire's map she is at its door
  inside: true,
  ground: '_',
  start: 'door',
  rows: [
    'wwwwwwwwwwww',
    'wNwwRHHwRwNw',
    'w__P_HH____w',
    'w__________w',
    'w_;;;;___BBw',
    'w_;TT;_____w',
    'w_;;;;___C_w',
    'w__________w',
    'w________U_w',
    'wwwww+wwwwww',
  ],
  key: {
    N: { kind: 'window' },
    R: { kind: 'herbsHang' },
    H: { kind: 'hearth' },
    P: { kind: 'cauldron' },
    T: { kind: 'table', cloth: 'red' },
    B: { kind: 'bed' },
    C: { kind: 'chair' },
    U: { kind: 'barrel' },
  },
  anchors: {
    door: [5, 8, 'La porta'],
    hearth: [6, 3, 'Il focolare'],
    table: [4, 6, 'Il tavolo'],
  },
  doors: [{ at: 'door', to: 'village.malva_door', look: 'mat' }],
};
