// ALTROVE · Sulle nuvole (docs/DESIGN.md "Altrove"): a walk on cloud banks over the sky, after a potion drunk
// by mistake. Its own look (src/world/art/elsewhere.js) and its own rule (src/world/elsewhere.rules.js):
// some cloud is thin, and stepping on it she falls. Format: README.md, section "Altrove".
//   ' ' sky   'l' cloud (a landing)   'u' thin cloud (always thin, a few, off the straight way)
//   '1'..'8' the bridges of the forks: digit d is fork floor((d-1)/3), option (d-1)%3. Closed until she
//   asks the cards at the fork; then the chosen one opens (solid if right, with thin patches if wrong)
//   and the others melt away.
export default {
  id: 'clouds',
  name: 'Sulle nuvole',
  mapDoor: 'village.cottage_door', // Altrove: she drank the green bottle in her cottage
  elsewhere: { world: 'clouds', rule: 'clouds' },
  look: 'clouds',
  cat: false, // Tartufo stays behind: the potion was hers
  mood: 'title',
  sky: { tint: 0x3a2a5a, outside: 0.05 }, // almost no night: a pale day over the clouds
  ground: 'l',
  start: 'start',
  tiles: {
    ' ': { ground: 'sky', solid: true },
    l: { ground: 'cloud' },
    u: { ground: 'cloud', thin: true },
    1: { ground: 'cloud', bridge: true }, 2: { ground: 'cloud', bridge: true }, 3: { ground: 'cloud', bridge: true },
    4: { ground: 'cloud', bridge: true }, 5: { ground: 'cloud', bridge: true }, 6: { ground: 'cloud', bridge: true },
    7: { ground: 'cloud', bridge: true }, 8: { ground: 'cloud', bridge: true },
  },
  rows: [ // sky above and below, so the camera can keep her clear of the dialogue at the foot of the screen
    '                              ',
    '                              ',
    '                              ',
    '  llllll7777777777777lllllll  ',
    ' llDllll7777777777777llllllul ',
    ' llDllll             llllllll ',
    ' lllllll8888888888888llllllll ',
    ' lllllll8888888888888llllllll ',
    ' lllllll             44 55 66 ',
    ' lllllll             44 55 66 ',
    ' llllll              44 55 66 ',
    '                     44 55 66 ',
    '                     44 55 66 ',
    '                     44 55 66 ',
    '  lllll              llllllll ',
    ' llllll11111111111111llllllll ',
    ' lTTlll11111111111111llllllll ',
    ' llllll              llulllll ',
    ' llllll22222222222222lllllHll ',
    ' llllll22222222222222lllllHlu ',
    ' llllll              lllllHll ',
    ' llllll33333333333333llllllll ',
    '  lllll33333333333333 llllll  ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
  ],
  key: {
    D: { kind: 'skydoor' }, // a door standing on its own in the sky: the way back
    H: { kind: 'ladder' }, // a ladder that goes nowhere
    T: { kind: 'teatable' }, // a tea table laid for someone
  },
  anchors: {
    start: [3, 20, 'Le nuvole'],
    fork1: [6, 18, 'Tre ponti'],
    fork2: [25, 15, 'Tre ponti'],
    fork3: [21, 5, 'Due ponti'],
    exit: [3, 6, 'La porta nel cielo'],
  },
};
