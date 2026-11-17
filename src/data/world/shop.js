// The black shop: shelves of things that should not be there, a counter, a cauldron.
export default {
  id: 'shop',
  name: 'La bottega',
  mapDoor: 'village.shop_door', // inside: on the grimoire's map she is at its door
  inside: true,
  ground: '_',
  start: 'door',
  rows: [
    'wwwwwwwwww',
    'wRRwNwwRRw',
    'w_______Cw',
    'w_KKKK__Pw',
    'w________w',
    'w;;;___U_w',
    'w;;;____Lw',
    'wwww+wwwww',
  ],
  key: {
    R: { kind: 'shelf', jars: true },
    N: { kind: 'window' },
    K: { kind: 'counter' },
    P: { kind: 'plant' },
    C: { kind: 'cauldron' },
    U: { kind: 'chest' },
    L: { kind: 'candle' },
  },
  anchors: {
    door: [4, 6, 'La porta'],
    counter: [3, 4, 'Il bancone'],
    keeper: [3, 2, 'Dietro il bancone'],
  },
  doors: [{ at: 'door', to: 'village.shop_door', look: 'mat' }],
};
