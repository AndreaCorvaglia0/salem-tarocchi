// The meetinghouse: pews, a lectern with the big Bible.
export default {
  id: 'meeting',
  name: 'La casa delle riunioni',
  mapDoor: 'village.meeting_door', // inside: on the grimoire's map she is at its door
  inside: true,
  ground: '_',
  start: 'door',
  rows: [
    'wwwwwwwwwwwwww',
    'wwNwwwwwwwwNww',
    'wL____B_____Lw',
    'w____________w',
    'w_PPPP__PPPP_w',
    'w____________w',
    'w_PPPP__PPPP_w',
    'w____________w',
    'w_PPPP__PPPP_w',
    'w____________w',
    'wwwwww+wwwwwww',
  ],
  key: {
    N: { kind: 'window', tall: true },
    L: { kind: 'candle' },
    B: { kind: 'lectern' },
    P: { kind: 'pews' },
  },
  anchors: {
    door: [6, 9, 'La porta'],
    bible: [6, 3, 'La Bibbia'],
  },
  doors: [{ at: 'door', to: 'village.meeting_door', look: 'mat' }],
};
