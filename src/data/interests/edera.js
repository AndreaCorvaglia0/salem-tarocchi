// Edera's interest, stones (notes/interessi/PROGETTO.md §4): missions 1-3 and the first step («In tasca»).
// Words and choices only; the rules are in src/glue/interests.edera.rules.js, the wiring in
// src/glue/interests.edera.js, the scenes in src/data/story/scripts/interests.edera.js, the screens in
// src/ui/interests/cellar.js and stones.js. A mission done is the flag `int.edera.<n>`, as for Ortica.
// What a stone is for comes from the circle (src/data/sapere.js, lore/corso/concetti/pietra-*.md): the right stone for
// the constable is any stone of «coraggio» there, never a list written here. In the game stones do protect and
// give courage, said as tradition says (lore/metodo/principi/erbe-come-storia.md).
// Missions 4-6 are not written yet: the sixth is where Edera calls her once by her real name instead of
// Rosalba (lore/storia/decisioni/decisioni-2026-11-18.md, interessi 2).

// the three missions, in order: where the scene plays, and the registry text (the grimoire's next step)
export const EDERA_MISSIONS = [
  { n: 1, id: 'int.edera.1', at: 'depths.edera_nook', script: 'int.edera.1',
    text: 'Edera ha perso nelle cantine una pietra di sua nonna, e vuole che la cerchi con lei. Mi aspetta nella sua nicchia.' },
  { n: 2, id: 'int.edera.2', at: 'depths.edera_nook', script: 'int.edera.2',
    text: 'Edera vuole che scelga una pietra per il conestabile del pozzo vecchio. Mi aspetta nella sua nicchia.' },
  { n: 3, id: 'int.edera.3', at: 'library.stones', script: 'int.edera.3',
    text: 'Edera vuole che scriva i cartellini delle sue pietre, sullo scaffale a destra della finestra, in biblioteca.' },
];

// ---- 1. the cellars: her grandmother's stone, then the wash at the old well ------------------------------
// Six places on the stage. Edera remembers three of them, one after the other (`memory` is the order), and
// each time she is wrong; the stone is beside the last one. `re` is what Edera says when she looks there.
export const CELLAR = {
  title: 'La pietra della nonna',
  who: 'Nonna Edera',
  pick: 'Tocca un posto per cercarci.',
  first: 'Io dico dietro i vasetti della marmellata. Ne sono sicura, come sono sicura ogni mattina di un posto diverso.',
  spots: [
    { id: 'botte', t: 'la botte', re: 'Nella botte tenevo le mele, quando ne avevo. Le pietre no, che poi sanno di sidro.' },
    { id: 'vasi', t: 'i vasetti', memory: 1, re: 'Ah, il mio ditale, che cercavo da Natale! La pietra però no. Allora era nel cesto delle candele, sotto quelle nuove, perché stesse al buio.' },
    { id: 'cesto', t: 'le candele', memory: 2, re: 'Soltanto candele, e i mozziconi che tengo per l\'inverno. Allora era al pozzo, dove la sera scende il raggio di luna: la posavo sul bordo, perché prendesse la luce.' },
    { id: 'gradino', t: 'il gradino', re: 'Sotto il gradino ci sono due chiodi e una delle mie forcine. La forcina la tengo, grazie, cara.' },
    { id: 'pozzo', t: 'il pozzo', memory: 3, re: 'Sul bordo c\'è soltanto muschio bagnato. Però guarda, cara: il raggio di luna fa luccicare qualcosa nel muro, lì accanto.' },
    { id: 'crepa', t: 'la crepa', found: true, re: 'Eccola, nella crepa dietro l\'edera, a due passi dal pozzo! Non sul bordo, ma quasi: vedi che un poco me la ricordavo?' },
  ],
  wash: 'Lavala nell\'acqua del pozzo: strofina col dito, quattro giri.',
  washSay: 'Piano, cara, che è vecchia quanto me, ma è più dura.',
  rub: 'Strofina',
  turns: 4,
  done: 'Fatto',
  close: 'Lascio stare, per oggi',
};

// ---- 2. a stone for the constable at the old well -----------------------------------------------------
// The right stones are the ones of this intention in the circle. A wrong one is answered by what it is for:
// the line of its first intention in WRONG_ORDER. With no stone of courage among hers, Edera puts one of her
// own on the handkerchief (`lend`), and the mission counts the same (decisioni-2026-11-18, interessi 3).
export const COURAGE = {
  intention: 'intenzione-coraggio',
  lend: 'occhio-di-tigre',
  title: 'Una pietra in tasca',
  who: 'Nonna Edera',
  pick: 'Scegli la pietra da dare al conestabile del pozzo.',
  lent: 'Edera ha messo sul fazzoletto anche una pietra sua.',
  mine: 'mia',
  hers: 'di Edera',
  done: 'La porto al pozzo',
  close: 'Lascio stare, per oggi',
  right: {
    'occhio-di-tigre': 'L\'occhio di tigre, brava. Dà sicurezza a chi deve stare fermo davanti a una paura, ed è del Sole: al buio, un poco di sole in tasca a quel ragazzo farà bene.',
    eliotropio: 'L\'eliotropio, brava. Lo portano i soldati, perché dà forza, ed è di Marte, il pianeta di chi non scappa. Per un conestabile è quasi un obbligo.',
  },
  wrong: {
    'intenzione-protezione': 'Questa è uno scudo, cara: tiene lontano chi ti vuole male. Ma i cani non gli vogliono male, abbaiano e basta, e a lui serve un poco di cuore, non un muro.',
    'intenzione-sonno-e-sogni': 'Questa fa dormire, e quel ragazzo, credimi, dorme già abbastanza anche senza.',
    'intenzione-amore': 'Questa è per il cuore, ma per un\'altra faccenda: i cani della palude non sono innamorati di lui, almeno spero.',
    'intenzione-chiarezza': 'Questa fa vedere chiaro, e i cani lui li vede anche troppo bene. Gli serve qualcosa che lo tenga fermo quando li sente.',
    'intenzione-fortuna-e-denaro': 'Questa chiama i soldi, e con la paga che gli danno gli farebbe comodo, ma non è il guaio di stanotte.',
    'intenzione-guarigione-e-conforto': 'Questa consola chi sta male, ma lui sta benissimo: ha soltanto paura, che è un\'altra cosa.',
    'intenzione-purificare': 'Questa pulisce una casa piena di brutti pensieri e li lascia andare. Lui però non deve lasciar andare niente, deve restare al suo posto.',
  },
};
export const WRONG_ORDER = ['intenzione-protezione', 'intenzione-chiarezza', 'intenzione-sonno-e-sogni', 'intenzione-amore', 'intenzione-guarigione-e-conforto', 'intenzione-fortuna-e-denaro', 'intenzione-purificare'];

// ---- 3. the labels on Edera's shelf in the library -------------------------------------------------------
// Four of Edera's stones on the shelf (the ones she has in her album first) and six names: she writes each
// name under its stone. A wrong name is answered, in her own head, by what that stone looks like (the album's
// «Com'è», src/data/stones.js). The lapis lazuli is not there: Edera wears it.
export const LABELS = {
  title: 'Lo scaffale di Edera',
  pick: 'Tocca una pietra, poi il suo nome.',
  name: 'Adesso scegli il suo nome.',
  n: 4,
  decoys: 2,
  skip: ['lapislazzuli'],
  done: 'Fatto',
  close: 'Lascio stare, per oggi',
  look: {
    agata: 'L\'agata ha strisce di colori diversi, come gli anelli di un tronco tagliato.',
    ametista: 'L\'ametista è un cristallo viola, più scuro sulla punta.',
    citrino: 'Il quarzo giallo è trasparente, del colore del miele chiaro.',
    'pietra-di-luna': 'La pietra di luna è bianco latte, con un riflesso azzurro quando la giri.',
    eliotropio: 'L\'eliotropio è verde scuro, con macchioline rosse come gocce di sangue.',
    'pietra-forata': 'La pietra forata ha un buco che la passa da parte a parte.',
    'occhio-di-tigre': 'L\'occhio di tigre è bruno e dorato, a strisce, con un riflesso che scorre.',
    ossidiana: 'L\'ossidiana è vetro nero e lucido, con i bordi taglienti.',
    'quarzo-ialino': 'Il cristallo di rocca è trasparente come l\'acqua, con la punta a sei facce.',
    'quarzo-rosa': 'Il quarzo rosa è rosa pallido, opaco come lo zucchero.',
    'tormalina-nera': 'La tormalina nera è un cristallo nero, lungo e rigato per il lungo.',
  },
};

// ---- level 1, «In tasca»: one stone in her pocket (the album's stone page) --------------------------------
// With a stone of courage or protection in her pocket, the decisive mistake of the day's first lost Exam
// becomes a second try on another card (src/systems/exam.js asks the service exam.second).
export const POCKET = {
  intentions: ['intenzione-coraggio', 'intenzione-protezione'],
  head: 'In tasca',
  put: 'Tienila in tasca',
  back: 'La rimetto via',
  isIn: 'Ce l\'ho in tasca.',
  one: 'In tasca ne tengo una sola alla volta.',
  lent: 'L\'ho prestata al conestabile del pozzo vecchio, per una notte.',
  learnt: 'Nell\'album delle pietre adesso puoi tenerne una in tasca.',
  // the stone with its article, for the line of the Exam (every stone of the two intentions has one: tested)
  the: { 'occhio-di-tigre': 'l\'occhio di tigre', eliotropio: 'l\'eliotropio', 'pietra-forata': 'la pietra forata', ossidiana: 'l\'ossidiana', 'tormalina-nera': 'la tormalina nera' },
  exam: {
    constable: ['Il conestabile esita.', 'Infili una mano in tasca e stringi {pietra}. Il conestabile si gratta la testa, come se avesse perso il filo, e ti chiede un\'altra carta.'],
    afflicted: ['L\'Afflitta esita.', 'Infili una mano in tasca e stringi {pietra}. L\'Afflitta si porta una mano alla fronte, come se avesse perso il filo, e ti chiede un\'altra carta.'],
  },
};
