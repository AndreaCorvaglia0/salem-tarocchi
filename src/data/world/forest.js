// The forest: spring and summer in chapter 2, autumn from chapter 3 (src/world/season.js).
// Ortica's hut with a lit window, the campfire clearing, the mill with its turning wheel on the
// brook, two brooks meeting at the spring, the pond with a tree in it, the graveyard, the den,
// tall grass, and in the north-east the deep wood: dark, short sight, eyes far away, the Hermit's
// lantern. Paths loop round the pond and the mill; dead ends hide chests. Format: README.md.
export default {
  id: 'forest',
  name: 'Il bosco',
  season: 'spring',
  start: 'entry',
  rows: [
    'pppppppppppppppppppppppppppppppppppppppp',
    'pt.pt.ttbt...rbtt.p.ptpt.t..p.~.p.~pppyp',
    'p..p..bssssssssss.pp...t.ttptb~py.~.py.p',
    'pttptt.s......y.s.....b...tptt~ppp~ypppp',
    'p..ttt.s.g.g.g..st..pp.....p.S~~~~~py..p',
    'p...ptts........s...r..tt.===.~..ppbyLpp',
    'p.b.t....g.g.g..==tb.b..pt=...~.yppp=pbp',
    'pt..b..s........s=.tt.t...=...~pp====pyp',
    'p......ssssssssss=........=...~..=p.pppp',
    'p..,,..p..p.b....==========...~pp=pppppp',
    'p.DD================r..t=p.t.=_===pbpppp',
    'p..,,..r...........=bbt.=.t..t~pp=pppppp',
    'p..,,..t.b..b.t..r.=.bp.=.b..t~pp=py.ppp',
    'p,,,,,,.rt..~~~~~..=tppt=ttt..~py=p.pp.p',
    'p,,,,,,,,,,~~~~~~~.=....=.ttb.~pp====.yp',
    'p,,,,p,t.p.~~~~~~~.=.tp.=..tpp~pppppyb.p',
    'pt,,,,,.pp..~~~~~..=.b..=.bttt~pyy.bbpbp',
    'p,,,,t,rt,,,,~~~...=.r..=.MMMM~....pp.tp',
    'p..,,....,,,,,,,,,.=tt..=.MMMM~.,,,,,,,p',
    'pt.,,OOOOXhh...ttt.=....=.MMMM~p,,t,,,,p',
    'p..,,OOOO.hh.ttr..t=..pt=.MMMM~.,,,t,,,p',
    'p..,,OOOO........p.=...t=U..t.~.,,,t,,,p',
    'p..P...======================._=,,,,,,,p',
    'pt........=.......G==t........~.,,,,,,,p',
    'pt........=..t..trt==,,,,,,,,r~.p,,,,,tp',
    'prrt..tt..=..t..tb.==,,,,,,,,t~p,,,,t,,p',
    'p.tt.b....=.t.t.tp.==,,,,t,,,t~.....sbpp',
    'pptt..t...=...t...t==,,,,,,,,p~.p.ttsp.p',
    'p,t,,,,,,t=...t.tr.==,,,,,,,,t~.bbtps..p',
    'pp,,,,,,t.=........==..r..b...~.p...s.tp',
    'p,,,,,,,p.......U..===========_====Bsbpp',
    'p,,,,,,,,t.,Q,F,,,,==,,,,,,,,t~.t.pps..p',
    'pp,,,,,,,..,,,,,,====.r,p.t.bb~p.t.tst.p',
    'p,,========,,,Q,,,,==pp,b...r.~pr.pts.bp',
    'p,,,,,,t,..,,,,,,,,==..,t.ttt.~.pt.tsp.p',
    'p,,,p,,,,..bptpp,t,==..,tt...b~.pttts..p',
    'p,,,,,,,,..btp,,bt,==..,.b..p.~t.btbtt.p',
    'p...pb..b..tt,,,,,,==t.ttt.t..~..tpp.bbp',
    'ptp.tptbrt.t.pfffff+fffff...tbpbtb.bt..p',
    'pppppppppppppppp.......ppppppppppppppppp',
  ],
  key: {
    F: { kind: 'campfire' },
    Q: { kind: 'log' },
    O: { kind: 'hut' },
    P: { kind: 'cauldron' },
    X: { kind: 'woodpile' },
    M: { kind: 'mill' },
    S: { kind: 'spring' },
    D: { kind: 'den' },
    L: { kind: 'lantern' },
    B: { kind: 'cross' },
    U: { kind: 'stump' },
    G: { kind: 'signpost', arrows: [['left', 'hut'], ['up', 'drop'], ['right', 'wheel']] }, // the crossing: Ortica, the pond, the mill
  },
  anchors: {
    entry: [19, 37, 'Il limite del bosco'],
    ortica_hut: [7, 22, 'La capanna di Ortica'],
    campfire: [15, 32, 'Il fuoco'], // beside the fire (14,31), not under it: Ginepra stands here
    den: [4, 10, 'La tana'],
    lantern: [36, 6, 'La lanterna'],
    mill: [27, 21, 'Il mulino'],
    boundary: [34, 30, 'Il confine'],
    pond: [18, 15, 'Lo stagno'],
    graveyard: [15, 6, 'Il cimitero'],
    spring: [28, 5, 'La fonte'],
    deep: [33, 10, 'Il bosco fitto'],
    grove: [5, 33, "L'erba alta"],
  },
  // the grimoire's map (format: village.js `map`)
  map: {
    entry: { label: 'il cancello', kind: 'gate' }, // the same gate as the village's «cancello del bosco»
    campfire: { label: 'il bivacco', kind: 'fire' },
    ortica_hut: { label: 'la capanna di Ortica', kind: 'hut' },
    grove: { label: "l'erba alta", kind: 'grass' },
    den: { label: 'la tana', kind: 'den' },
    pond: { label: 'lo stagno', kind: 'pond' },
    mill: { label: 'il mulino', kind: 'mill' },
    boundary: { label: 'il confine', kind: 'stones' },
    graveyard: { label: 'il cimitero', kind: 'graves' },
    spring: { label: 'la fonte', kind: 'spring' },
    deep: { label: 'il bosco fitto', kind: 'pines' },
    lantern: { in: 'deep' }, // the Hermit's lantern, inside the deep wood (a card by it)
  },
  doors: [{ at: 'entry', to: 'village.forest_gate', look: 'gate' }],
  chests: [
    { id: 'forest.chest.mill', at: [29, 21], ask: { kind: 'astro' }, give: { coins: 10, xp: 15 } },
    { id: 'forest.chest.grove', at: [2, 33], ask: { kind: 'meaning' }, give: { coins: 8, xp: 10 } },
    { id: 'forest.chest.deep', at: [37, 14], ask: { kind: 'name' }, give: { coins: 14, xp: 20 } },
  ],
  dark: [[31, 1, 8, 16]],
  // the deep wood: thick fog (only the Air finds the way through), the Hermit's lantern inside
  fog: [{ id: 'deepfog', area: [31, 1, 8, 16] }],
  obstacles: [
    { kind: 'brambles', need: 'fire', at: [16, 6] },              // the graveyard gate (Fuoco, chapter 2)
    { kind: 'roots', need: 'move', at: [7, 6] },                  // a shortcut into the graveyard (Terra)
    { kind: 'roots', need: 'move', on: 'forest.chest.grove' },    // roots over the grove chest (Terra)
  ],
  // Minor Arcana: Bastoni in the woods, Coppe by the water (the pond, the brook)
  suits: [
    { suit: 'w', area: [1, 9, 7, 13] }, { suit: 'w', area: [9, 29, 10, 9] }, { suit: 'c', area: [21, 30, 9, 7] }, { suit: 'w', area: [1, 27, 9, 10] },
    { suit: 'c', area: [7, 12, 12, 7] }, { suit: 'c', area: [20, 23, 10, 6] }, { suit: 'c', area: [31, 17, 9, 12] },
  ],
  eyes: [[31, 1, 8, 16]],
  patrols: [
    // the only constable in the forest: on the road, near the gate
    { id: 'forest.path', route: [[20, 33], [20, 21]], pause: 2200 },
  ],
};
