// The main path, in order: one clear next thing at a time (grimoire "Io" page and HUD line).
// Each step is set by a script with { do: 'step' }; the map circles `at`.
// c3.jail and c3.court are the two faces of fork 3: a run sees only one of them.

export const STEPS = [
  // prologue
  { id: 'p.session', chapter: 0, text: 'Sedermi al tavolo della Lettrice.', at: null },
  { id: 'p.road', chapter: 0, text: 'Raccogliere ciò che brilla nella neve.', at: 'village.arrival' },
  // chapter 1, the village
  { id: 'c1.malva', chapter: 1, text: 'Bussare da Comare Malva.', at: 'village.malva_door' },
  { id: 'c1.cottage', chapter: 1, text: 'Vedere la mia capanna al limite del bosco.', at: 'village.cottage_door' },
  { id: 'c1.client', chapter: 1, text: 'Leggere una carta al primo cliente.', at: 'cottage.table' },
  { id: 'c1.explore', chapter: 1, text: 'Uscire a cercare carte, verso la piazza.', at: 'village.square' },
  { id: 'c1.cart', chapter: 1, text: 'Guardare cosa luccica sotto il carro.', at: 'village.cart' },
  { id: 'c1.venus', chapter: 1, text: 'Trovare Ginepra al bicchiere di Venere.', at: 'village.venusglass' },
  { id: 'c1.square', chapter: 1, text: 'Andare in piazza: c\'è gente che urla.', at: 'village.square' },
  { id: 'c1.gate', chapter: 1, text: 'Uscire dal cancello verso il bosco.', at: 'village.forest_gate' },
  // chapter 2, the forest
  { id: 'c2.ortica', chapter: 2, text: 'Trovare la capanna di Ortica.', at: 'forest.ortica_hut' },
  { id: 'c2.client', chapter: 2, text: 'Leggere passato, presente e futuro a qualcuno.', at: 'cottage.table' },
  { id: 'c2.fire', chapter: 2, text: 'Raggiungere il bivacco nel bosco.', at: 'forest.campfire' },
  { id: 'c2.plan', chapter: 2, text: 'Trovare Ginepra davanti al tribunale.', at: 'village.court_door' },
  { id: 'c2.home', chapter: 2, text: 'Tornare al cottage. Subito.', at: 'village.cottage_door' },
  // chapter 3, the dark
  { id: 'c3.trapdoor', chapter: 3, text: 'Scendere dalla botola sotto il villaggio.', at: 'village.trapdoor' },
  { id: 'c3.edera', chapter: 3, text: 'Trovare Nonna Edera nelle cantine.', at: 'depths.edera_nook' },
  { id: 'c3.client', chapter: 3, text: 'Leggere una croce celtica al cottage.', at: 'cottage.table' },
  { id: 'c3.coven', chapter: 3, text: 'Andare al consiglio delle tre maestre.', at: 'depths.coven' },
  { id: 'c3.jail', chapter: 3, text: 'Arrivare alle celle dalle cantine.', at: 'depths.jail' },
  { id: 'c3.court', chapter: 3, text: 'Entrare in tribunale a viso aperto.', at: 'village.court_door' },
  { id: 'c3.trial', chapter: 3, text: 'Rispondere al Giudice.', at: 'court.dock' },
  // finale
  { id: 'f.dawn', chapter: 3, text: 'Volare via con Ginepra, all\'alba.', at: 'village.forest_gate' },
  { id: 'f.last', chapter: 3, text: 'Tornare al fuoco del bivacco.', at: 'forest.campfire' },
  { id: 'post.minors', chapter: 4, text: 'Cercare i Minori nell\'erba alta.', at: 'forest.entry' },
];
