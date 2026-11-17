// The main path, in order: one clear next thing at a time (grimoire "Io" page and HUD line).
// `text` is a complete first-person sentence that says plainly what to do and where; `at` the anchor
// the map circles and the guide leads to. Each step is set by a script with { do: 'step' }.
// `need`: the Majors (Il Matto included) the gate of that step asks for; `rank`: the level it asks for
// (4 Fattucchiera, 7 Strega). c3.jail and c3.court are the two faces of fork 3: a run sees only one.

export const STEPS = [
  // prologue
  { id: 'p.session', chapter: 0, text: 'Devo sedermi al tavolo della Lettrice, davanti alla candela.', at: null },
  { id: 'p.road', chapter: 0, text: 'Devo raccogliere quella cosa che brilla nella neve, qui davanti sulla strada.', at: 'village.road_card' },
  // chapter 1, the village: the guided opening (talk, draw, read, the shop, the map, the grimoire)
  { id: 'c1.malva', chapter: 1, text: 'Devo bussare alla porta con la finestra accesa, poco più avanti sulla strada.', at: 'village.malva_door' },
  { id: 'c1.read', chapter: 1, text: 'Devo sedermi al tavolo di Malva, quello con la tovaglia rossa, e leggerle una carta.', at: 'malva.table' },
  { id: 'c1.shop', chapter: 1, text: 'Devo andare alla bottega con la porta nera, in fondo alla strada, e comprare l\'incenso.', at: 'shop.counter' },
  { id: 'c1.back', chapter: 1, text: 'Devo tornare da Malva, a casa sua, e farle vedere l\'incenso.', at: 'malva.hearth' },
  { id: 'c1.deliver', chapter: 1, text: 'Devo portare il fagotto alla lavandaia, davanti alla casa delle riunioni, nella parte alta del paese.', at: 'village.meeting_door' },
  { id: 'c1.cottage', chapter: 1, text: 'Devo salire fino alla mia capanna, al limite del bosco, poco oltre la casa delle riunioni.', at: 'village.cottage_door' },
  { id: 'c1.grimoire', chapter: 1, text: 'Devo sedermi al tavolo della capanna e aprire il mio grimorio.', at: 'cottage.table' },
  { id: 'c1.client', chapter: 1, text: 'Hanno bussato alla porta: devo tornare al tavolo e leggere una carta a chi è entrato.', at: 'cottage.table' },
  // chapter 1, from here she is freer
  { id: 'c1.cart', chapter: 1, text: 'Devo andare a vedere cosa luccica sotto il carretto del fieno, giù al mercato.', at: 'village.cart' },
  { id: 'c1.explore', chapter: 1, text: 'Devo attraversare la piazza per raggiungere Ginepra nel vicolo di sotto.', at: 'village.square' },
  { id: 'c1.venus', chapter: 1, text: 'Devo raggiungere Ginepra al davanzale nel vicolo, poco sotto la piazza.', at: 'village.venusglass' },
  { id: 'c1.square', chapter: 1, text: 'Devo tornare in piazza all\'imbrunire: c\'è gente, e qualcuno grida.', at: 'village.square' },
  { id: 'c1.gate', chapter: 1, text: 'Devo raggiungere Malva al cancello del bosco, in cima al villaggio.', at: 'village.forest_gate', need: 6, rank: 4 },
  // chapter 2, the forest
  { id: 'c2.ortica', chapter: 2, text: 'Devo seguire il sentiero del bosco fino alla capanna di Ortica.', at: 'forest.ortica_hut' },
  { id: 'c2.mill', chapter: 2, text: 'Devo portare l\'unguento di Ortica al mugnaio, al mulino sul torrente.', at: 'forest.mill' },
  { id: 'c2.client', chapter: 2, text: 'Devo tornare alla mia capanna e leggere tre carte a chi bussa.', at: 'cottage.table' },
  { id: 'c2.fire', chapter: 2, text: 'Devo raggiungere il bivacco di Ginepra, in fondo al sentiero del bosco.', at: 'forest.campfire' },
  { id: 'c2.plan', chapter: 2, text: 'Devo raggiungere Ginepra davanti al tribunale, giù al villaggio, di notte.', at: 'village.court_door', need: 11 },
  { id: 'c2.home', chapter: 2, text: 'Devo tornare subito alla mia capanna, al limite del bosco.', at: 'village.cottage_door' },
  // chapter 3, the dark (the chapter itself begins when Malva lets her down the trapdoor)
  { id: 'c3.trapdoor', chapter: 2, text: 'Devo raggiungere Malva alla botola dietro il tribunale.', at: 'village.trapdoor', rank: 7 },
  { id: 'c3.edera', chapter: 3, text: 'Devo trovare Nonna Edera nella sua nicchia, in fondo alle cantine.', at: 'depths.edera_nook' },
  { id: 'c3.client', chapter: 3, text: 'Devo tornare alla mia capanna e leggere una croce celtica a chi bussa.', at: 'cottage.table' },
  { id: 'c3.coven', chapter: 3, text: 'Devo scendere nelle cantine e raggiungere le tre maestre riunite al calderone.', at: 'depths.coven', need: 19 },
  { id: 'c3.jail', chapter: 3, text: 'Devo attraversare le cantine fino alle celle, oltre le catene.', at: 'depths.jail' },
  { id: 'c3.court', chapter: 3, text: 'Devo risalire al villaggio ed entrare in tribunale dalla porta principale.', at: 'village.court_door' },
  { id: 'c3.trial', chapter: 3, text: 'Devo rispondere alle domande del Giudice, in tribunale.', at: 'court.dock' },
  // finale
  { id: 'f.dawn', chapter: 3, text: 'Devo volare via dal paese insieme a Ginepra, adesso che è l\'alba.', at: 'village.forest_gate' },
  { id: 'f.last', chapter: 3, text: 'Devo tornare al bivacco nel bosco, dove mi aspettano tutte.', at: 'forest.campfire' },
  { id: 'post.minors', chapter: 4, text: 'Posso cercare le carte piccole nell\'erba alta, cominciando dal bosco.', at: 'forest.entry' },
];

// Side missions, optional: somebody tells her something that leads to the hiding place of a Major and,
// in telling it, teaches a little about that card. They are not listed anywhere: `note` is the pencil
// note on the grimoire's map at `at`, shown from `when` (the conversation that gives it) until `done`.
// Every card stays findable without them.
const side = (card, chapter, at, note) => ({ id: `side.${card}`, chapter, at, note, when: { flag: `side.${card}` }, done: { has: card } });
export const SIDE = [
  side('m01', 1, 'village.stall', 'Il bottegaio dice che il merciaio tiene sotto il banco una carta: un uomo con tutto quello che gli serve sul tavolo.'),
  side('m05', 1, 'meeting.bible', 'La lavandaia dice che nella Bibbia grande è infilata una carta: un vecchio che insegna, e due che lo ascoltano.'),
  side('m02', 1, 'village.curtain', 'Un bambino dice che dietro la tenda della sarta c\'è una carta: una signora che sa le cose e non le dice.'),
  side('m03', 1, 'village.garden', 'Malva ha visto luccicare una carta nel suo orto, tra i cavoli: una donna in mezzo al grano, e tutto quello che cresce.'),
  side('m12', 2, 'forest.pond', 'Il mugnaio dice che allo stagno, su un salice, c\'è una carta: un uomo appeso per i piedi, con la faccia tranquilla.'),
  side('m09', 2, 'forest.lantern', 'Ortica dice che nel folto c\'è una lanterna accesa, lasciata da un vecchio che cercava qualcosa da solo.'),
  side('m11', 2, 'forest.boundary', 'Il becchino dice che sulla pietra di confine c\'è una carta: una donna con la bilancia, che rende a ognuno il suo.'),
  side('m18', 3, 'depths.swamp', 'Una guardia dice che alla palude c\'è un sentiero tra due torri, con due cani che abbaiano alla luna.'),
];
