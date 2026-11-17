// The depths: cellars and caves under the village, always dark (short sight everywhere, light
// only from torches and candles). The stair down from the trapdoor into a vaulted cellar of
// barrels; a long corridor to the chains on the wall; the round room of the coven; Edera's nook
// (warm: candles, a rug, ivy); the foot of the prison tower beside the barred cells (a failed
// Exam ends there; the cells connect to the court); the old well open to the sky with a shaft of
// moonlight; and out of it, the swamp at night: reeds, will-o'-the-wisps. Format: README.md.
export default {
  id: 'depths',
  name: 'Le cantine',
  season: 'autumn',
  dark: true,
  under: true, // underground: no sky, no broom
  start: 'entry',
  rows: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww+wwwwww',
    'wwwXNNNNNNXwwwwwwwwwwwwwwwXUU::::::::Xww',
    'www::::::::wwwUwwwwwwwUwww::::::::::U:ww',
    'www::::::::::::::::::::::::::::::::::Uww',
    'www:::::::::::::::::::::::::::::::::::ww',
    'www::::::::wwwwwwww::wwwww::::::::::::ww',
    'www::::::M:wwwwwwww::wwwwwUUZ:::::::ZUww',
    'wwwwwwwwwwwwwwwwwww:::wwwwwwwwwww::wwwww',
    'wwwwwwwwwwwwwwwww:::::::wwwwwwwww::wwwww',
    'wwwwwwwwwwwwwwwwK::::::K:wwwwwVVV::VVVww',
    'wwwwwwwwwwwwwww:::::::::::wwwwGG::Y:KRww',
    'wwwwwwwwwwwwwww::::CC:::::wwww:;;;;;;Rww',
    'wwwwwwwwwwwwwww::::CC::::::::::;;;;;;:ww',
    'wwwwwwwwwwwwwwwK::::::::K:::::H;;;;;;:ww',
    'wwwwwwwwwwwwwww:::::::::::wwww:;;;;;;:ww',
    'wwwwwwwwwwwwwwww:::::::::wwwwwK::::::Lww',
    'wwwwwwwwwwwwwwwwwK::::K:wwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwww::::wwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwww::::wwwwwwwrr......rww',
    'ww:X::::::::::XwTTTT::X:U:Z:X...OO....ww',
    'ww:::::::::::+:wTTTT:::::::::...OO....ww',
    'ww::::::::::::::::::::::::::..........ww',
    'ww:::::::::::::w::::::::::::..........ww',
    'wwiii:iiii:ii:iw:::::::::::::r......rrww',
    'ww::::i::::i:::w::wwwwwwwwwwwwwww..wwwww',
    'ww::::i::::i:::::wppyppppyppppypp=.ypppp',
    'ww::::i::::i:::wwwp.,.,,.,,..~.~.=....~p',
    'ww::::i::::i:::wwwp~~~~.,.y~======.,..,p',
    'ww::::i::M:i:::wwwy~~~~~.,..=~~..,...,.p',
    'ww::::i::::i:::wwwp~~.~======,..,,...,.p',
    'ww::::i::::i:::wwwp..===..,....,.,.,...p',
    'wwwwwwwwwwwwwwwwwwy....,.,.....y,,..~~~p',
    'wwwwwwwwwwwwwwwwwwpppppppppppppppppppppp',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  key: {
    X: { kind: 'torch' },
    N: { kind: 'chains' },
    M: { kind: 'bones' },
    T: { kind: 'ruin' },
    C: { kind: 'cauldron', big: true },
    K: { kind: 'candles' },
    U: { kind: 'barrel' },
    Z: { kind: 'crate' },
    V: { kind: 'ivy' },
    G: { kind: 'bed', quilt: 'violet' },
    R: { kind: 'shelf', jars: true },
    Y: { kind: 'plant' },
    H: { kind: 'table', cloth: 'violet' },
    L: { kind: 'candle' },
    O: { kind: 'well', old: true },
  },
  anchors: {
    entry: [33, 3, 'Sotto la botola'],
    cellar: [31, 6, 'La cantina'],
    edera_nook: [33, 14, "L'angolo di Edera"],
    coven: [20, 17, 'La congrega'],
    coven_malva: [17, 15, 'Malva'], coven_ortica: [22, 15, 'Ortica'], coven_edera: [20, 12, 'Edera'], // round the cauldron
    chains: [6, 5, 'Le catene'],
    tower: [18, 23, 'La torre'],
    well: [32, 23, 'Il pozzo vecchio'],
    swamp: [24, 31, 'La palude'],
    jail: [8, 29, 'La cella'],
    cells: [12, 22, 'Le prigioni'],
  },
  // the grimoire's map (format: village.js `map`)
  map: {
    entry: { label: 'la scala', kind: 'stairs' }, // down from the trapdoor
    cellar: { in: 'entry' }, // the barrel cellar at the foot of the stair
    edera_nook: { label: 'la nicchia di Edera', kind: 'nook' },
    coven: { label: 'la congrega', kind: 'circle' },
    coven_malva: { in: 'coven' }, coven_ortica: { in: 'coven' }, coven_edera: { in: 'coven' },
    chains: { label: 'le catene', kind: 'chains' },
    tower: { label: 'la torre', kind: 'tower' },
    well: { label: 'il pozzo', kind: 'well' },
    swamp: { label: 'la palude', kind: 'swamp' },
    cells: { label: 'la scala del tribunale', kind: 'stairs' }, // up to the court
    jail: { label: 'la cella', kind: 'jail' },
  },
  doors: [
    { at: 'entry', to: 'village.trapdoor', look: 'stairs' },
    { at: 'cells', to: 'court.stairs', look: 'stairs' },
  ],
  gates: [{ at: [15, 27], when: { chapterMin: 3 }, refuse: 'Una grata, chiusa. Dall\'altra parte gocciola qualcosa.' }],
  chests: [{ id: 'depths.chest.tower', at: [16, 23], ask: { kind: 'name' }, give: { coins: 12, tool: 'incense' }, seal: true }],
  decor: [
    { kind: 'arch', at: [19, 8], w: 2 }, { kind: 'arch', at: [33, 10], w: 2 },
    { kind: 'arch', at: [18, 20], w: 4 }, { kind: 'arch', at: [33, 26], w: 2 },
  ],
  moon: [[32.5, 21.5]],
  // the swamp: thick fog (only the Air finds the way through), La Luna inside
  fog: [{ id: 'swampfog', area: [18, 27, 21, 7] }],
  obstacles: [
    { kind: 'brambles', need: 'fire', at: [12, 5] }, { kind: 'brambles', need: 'fire', at: [12, 6] }, // the way to the chains
    { kind: 'stone', need: 'move', at: [15, 23] },                // a shortcut from the cells to the tower (Terra)
  ],
  suits: [{ suit: 'c', area: [18, 27, 21, 7] }],
  wisps: [[19, 28, 19, 5]],
  patrols: [
    { id: 'depths.cells', route: [[3, 23], [13, 23]], pause: 2200, when: [{ chapterMin: 3 }, { not: { step: 'c3.jail' } }] },
    // round the foot of the tower; off once the council can meet (step c3.coven with every card)
    { id: 'depths.coven', route: [[20, 24], [26, 24]], pause: 2000, when: [{ chapterMin: 3 }, { not: [{ step: 'c3.coven' }, { majorsMin: 19 }] }] },
  ],
};
