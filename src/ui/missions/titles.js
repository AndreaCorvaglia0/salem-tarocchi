// The short card of every optional thing in the extras registry (core/extras.js EXTRAS), for the Mappa
// page of the grimoire (src/ui/missions/page.js).
// For each id: a short title (2-4 words, no spoiler), who told her (null: she noticed it herself), what
// she gets in a few words. The kind word and the pencil symbol come from KIND; the place is the map's
// own label (sketchmap.js placeOf + REGIONS), never written here.
// Every id of EXTRAS must have an entry: tests/missions.page.test.mjs fails when a new one has none.
// «gets» is concrete and spoiler-free: never the name of the object a trial gives.

// kind -> the word on the card and the pencil symbol (symbols.js)
export const KIND = {
  carta: { word: 'una carta', sym: 'carta' },
  lezione: { word: 'una lezione', sym: 'lezione' },
  prova: { word: 'una prova', sym: 'prova' },
  orto: { word: "l'orto", sym: 'orto' },
  altrove: { word: 'Altrove', sym: 'altrove' },
  storia: { word: 'una storia', sym: 'storia' },
};

const T = (title, kind, who, gets) => ({ title, kind, who, gets });
const CARD = 'una carta grande per il mazzo';
const TRIAL = 'esperienza e monete; se va tutto bene, anche un oggetto da tenere';
const GARDEN = "un consiglio in più per l'orto";

export const TITLES = {
  'lesson.fly': T('Imparare a volare', 'lezione', 'Malva', 'volare con la scopa da un posto all\'altro'),
  'lesson.minors.1': T('I quattro semi', 'lezione', 'Ortica', 'le prime carte piccole'),
  'lesson.minors.2': T('Uno, due, tre', 'lezione', 'Ginepra', 'le carte piccole dall\'uno al tre'),
  'lesson.minors.3': T('Quattro, cinque, sei', 'lezione', 'Malva', 'le carte piccole dal quattro al sei'),
  'lesson.minors.4': T('Dal sette al dieci', 'lezione', 'Ortica', 'le carte piccole dal sette al dieci'),
  'lesson.minors.5': T('Le figure', 'lezione', 'Nonna Edera', 'i fanti, i cavalli, le regine e i re'),
  'lesson.reversed': T('Le carte capovolte', 'lezione', 'Nonna Edera', 'leggere una carta a testa in giù'),
  'side.m01': T('Sotto il banco', 'carta', 'il bottegaio', CARD),
  'side.m05': T('La Bibbia grande', 'carta', 'la lavandaia', CARD),
  'side.m02': T('Dietro la tenda', 'carta', 'un bambino', CARD),
  'side.m03': T('Tra i cavoli', 'carta', 'Malva', CARD),
  'side.m12': T('Il salice dello stagno', 'carta', 'il mugnaio', CARD),
  'side.m09': T('La lanterna nel folto', 'carta', 'Ortica', CARD),
  'side.m11': T('La pietra di confine', 'carta', 'il becchino', CARD),
  'side.m18': T('Le due torri', 'carta', 'una guardia', CARD),
  'garden.ortica': T('Un orto tutto mio', 'orto', 'Ortica', 'un orto accanto alla mia capanna'),
  'garden.lesson.acqua': T("L'acqua", 'orto', 'Ortica', GARDEN),
  'garden.lesson.luce': T('La luce', 'orto', 'Ortica', GARDEN),
  'garden.lesson.terra': T('La terra', 'orto', 'Ortica', GARDEN),
  'garden.lesson.vaso': T('Il vaso', 'orto', 'Ortica', GARDEN),
  'garden.lesson.semina': T('Semina e talea', 'orto', 'Ortica', GARDEN),
  'trial.night': T('Il cesto di Malva', 'prova', 'Malva', TRIAL),
  'trial.fog': T('La barba di bosco', 'prova', 'Ortica', TRIAL),
  'trial.cellars': T('La strada delle cantine', 'prova', 'Nonna Edera', TRIAL),
  'trial.vigil': T('Chiamata di notte', 'prova', 'Malva', TRIAL),
  'trial.well': T('Qualcosa nel pozzo', 'prova', 'Tartufo', TRIAL),
  'trial.kettle': T('Il paiolo di rame', 'prova', 'Ortica', TRIAL),
  'trial.grave': T('La tomba nel bosco', 'prova', 'la vedova Bray', TRIAL),
  'trial.room': T('La stanza murata', 'prova', 'Nonna Edera', TRIAL),
  'trial.dare': T('La scommessa di Ginepra', 'prova', 'Ginepra', TRIAL),
  'trial.hat': T('Un sacco dal mulino', 'storia', 'il mugnaio', 'esperienza, la gratitudine di Ortica e forse un oggetto da tenere'),
  'library.first': T('La biblioteca', 'lezione', 'Malva', 'i libri per prepararmi alle prove'),
  'elsewhere.book': T('Un libro che non c\'era', 'altrove', null, 'un viaggio dentro un libro, e forse un oggetto da riportare'),
  'elsewhere.clouds': T('La boccetta verde', 'altrove', null, 'un viaggio sulle nuvole, e forse un oggetto da riportare'),
};

// the card of an entry: its title data, or a plain fallback from its text (a new entry without a title
// still shows, with its first words)
export function cardOf(e) {
  const t = TITLES[e.id];
  if (t) return { ...t, kindWord: KIND[t.kind].word, sym: KIND[t.kind].sym };
  const kind = e.kind === 'lesson' ? 'lezione' : e.kind === 'side' ? 'carta' : e.kind === 'errand' ? 'orto' : 'prova';
  const words = String(e.text || '').split(/[:,.]/)[0].split(' ').slice(0, 4).join(' ');
  return { title: words, kind, who: null, gets: null, kindWord: KIND[kind].word, sym: KIND[kind].sym };
}
