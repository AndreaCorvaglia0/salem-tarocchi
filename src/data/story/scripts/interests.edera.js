// Edera's interest, stones (notes/interessi/PROGETTO.md §4): the scene that starts it in her nook, missions 1-3,
// and the constable at the old well the day after his stone. Wiring: src/glue/interests.edera.js. The screens
// are services called from here:
//   interests.cellar   six places in the cellars, then the wash at the old well   -> flag int.edera.1.found
//   interests.courage  her stones on Edera's handkerchief, one for the constable  -> flag int.edera.2.chosen
//                      (int.edera.2.lent when it was Edera's own: she had none of courage)
//   interests.labels   four stones on Edera's shelf in the library, six names     -> flag int.edera.3.written
//   interests.step     a mission done: its flag and today's date (shared with Ortica's)
//   interests.giveBack the constable gives her stone back (when it was hers)
// Edera calls her «cara», or Rosalba if she let her (flag edera.rosalba); never by her real name here: that is
// kept for the sixth mission (lore/storia/decisioni/decisioni-2026-11-18.md, interessi 2), not written yet.
// Nobody explains the game: what a stone is for comes out of Edera's choices and the constable's night.
import { N, T, edera, cop, choice, o, xp, diary, open, goto, flag, IF } from '../h.js';

const bond = { do: 'bond', who: 'edera', n: 1, why: 'interest' };
const done = (n, note) => [diary(note), xp(5), bond, open('interests.step', 'edera', n)];

export const INTEREST_EDERA_SCRIPTS = {
  // ---- the start: three stones in her album, and Edera has already told her what stones are -----------------
  'int.edera.start': [
    N('Edera fruga nel cestino del cucito con tutte e due le mani, e ogni tanto si tocca la testa, dove gli occhiali ci sono già.'),
    IF({ flag: 'edera.rosalba' },
      [edera('Rosalba, sei tu? Aspetta che trovo gli occhiali, che senza non ti vedo bene.')],
      [edera('Sei tu, cara? Aspetta che trovo gli occhiali, che senza non ti riconosco nemmeno dalla voce.')]),
    N('Poi si ferma con le mani a mezz\'aria e piega la testa da una parte, come se avesse sentito un rumore lontano.'),
    edera('Tu hai delle pietre in tasca, cara, e non una sola: si sente da come cammini, perché tintinnano piano a ogni passo.'),
    edera('Io ne avevo una, di mia nonna, blu come la notte e con dei puntini d\'oro. L\'ho posata da qualche parte quaggiù, per tenerla al sicuro, un anno fa o forse ieri.'),
    edera('Da allora la cerco ogni mattina, e ogni mattina mi ricordo un posto diverso. Mi aiuti a cercarla? Con i tuoi occhi, magari, ci mettiamo meno di un anno.'),
    flag('int.edera.offered'),
    choice(
      o('Prendo una candela e la cerchiamo adesso.', { rischio: 1 }, [goto('int.edera.1')]),
      o('Oggi non posso, ma torno a cercarla con te.', { rischio: -1 }, [
        edera('Non ha fretta, cara: è stata ferma fino adesso, e starà ferma ancora un poco. Quando torni, porta i tuoi occhi.'),
      ]),
    ),
  ],

  // ---- 1. «La pietra della nonna»: searching the cellars, washing at the old well -----------------------------
  'int.edera.1': [
    N('Edera accende una seconda candela dalla sua e te la mette in mano, poi si appoggia al bastone e guarda la galleria come si guarda una pagina scritta fitta.'),
    edera('Ogni mattina mi viene in mente un posto, e ogni mattina sono sicura. Adesso te li dico uno alla volta, e tu fai finta di non vedere che non tornano.'),
    open('interests.cellar'),
    IF({ flag: 'int.edera.1.found' }, [
      N('Sotto il fango la pietra è di un blu profondo, come il cielo un\'ora dopo il tramonto, e alla luce della candela i puntini d\'oro brillano come stelle piccole.'),
      edera('Lapislazzuli, ecco come si chiama. Il nome mi è tornato insieme alla pietra, e non me lo aspettavo più.'),
      edera('Mia nonna la portava al collo quando leggeva le carte, perché aiuta a dire il vero e a sentirlo dagli altri. È di Venere e dell\'acqua, e apre una vista di dentro che gli occhiali non danno.'),
      edera('Guarda che blu: è lo stesso del manto della Sacerdotessa. Da bambina credevo che glielo avesse prestato la nonna, e un poco lo credo ancora.'),
      N('Edera ci passa sopra il pollice due volte, poi la infila in un cordoncino e se la mette al collo, sotto lo scialle.'),
      edera('Stanotte dormirò meglio, e spero di non essere la sola. Il ragazzo che fa la guardia al pozzo parla da solo, di notte: ha paura dei cani che abbaiano alla luna, e io lo sento fino a qui.'),
      edera('Una pietra in tasca gli farebbe bene, ma deve sceglierla qualcuno che le pietre le tiene in mano tutti i giorni. Ne parliamo domani, cara.'),
      ...done(1, 'Ho ritrovato nelle cantine il lapislazzuli della nonna di Edera e l\'ho lavato al pozzo vecchio. È la pietra di Venere e del vero, blu come il manto della Sacerdotessa.'),
    ], [
      edera('La pietra è stata ferma fino adesso, e starà ferma ancora un poco. Torna quando hai una candela e un po\' di pazienza, che quaggiù ne serve tanta.'),
    ]),
  ],

  // ---- 2. «Occhi chiusi»: a stone of courage for the constable at the old well --------------------------------
  'int.edera.2': [
    N('Sul tavolino di Edera, accanto alla candela, c\'è un fazzoletto steso con cura. Lei ci batte sopra due dita, e il lapislazzuli le dondola al collo.'),
    edera('Il ragazzo del pozzo stanotte ha parlato da solo fino all\'alba. I cani della palude abbaiavano alla luna, e lui diceva che non aveva paura con una voce che tremava.'),
    edera('Metti le tue pietre qui sul fazzoletto e scegli quella che gli dà coraggio. Scegli tu, che le tieni in mano tutti i giorni: io ti guardo, e ti dico se sbagli.'),
    open('interests.courage'),
    IF({ flag: 'int.edera.2.chosen' }, [
      IF({ flag: 'int.edera.2.lent' },
        [edera('Questa è mia, ma va bene lo stesso. La prossima volta portami la tua, che voglio vedere come la tieni.')],
        [edera('Questa è tua, e si sente: è ancora calda della tua tasca. Gliela presti per una notte, e domani te la rende.')]),
      edera('In tasca, però, non al collo. Al collo le pietre le porta chi vuole farsi vedere, e lui deve stare tranquillo al buio, con una mano chiusa su qualcosa di caldo.'),
      N('Al pozzo vecchio il conestabile dorme in piedi, appoggiato al muro, e borbotta qualcosa sui cani. Gli fai scivolare la pietra nella tasca della giubba, piano, e lui non si sveglia.'),
      N('Dopo un poco la sua mano trova la pietra da sola e ci si chiude sopra, e il borbottio si spegne piano, come una candela a cui manca l\'aria.'),
      edera('Domani passa dal pozzo, cara, che voglio sapere come ha dormito. A me queste cose le raccontano soltanto se le chiedo.'),
      edera('E un\'altra cosa, se un giorno sali in biblioteca. Le mie pietre stanno sullo scaffale a destra della finestra, e di ognuna ricordo il colore ma non il nome: mi scriveresti i cartellini?'),
      ...done(2, 'Ho scelto una pietra di coraggio per il conestabile del pozzo vecchio, che ha paura dei cani che abbaiano alla luna. Edera dice di tenerla in tasca, non al collo.'),
    ], [
      edera('Le pietre aspettano, e il ragazzo pure, anche se lui aspetta con meno grazia. Torna quando vuoi.'),
    ]),
  ],

  // ---- the day after: the constable at the old well ----------------------------------------------------------
  'int.edera.guard': [
    N('Il conestabile del pozzo vecchio dorme in piedi, appoggiato al muro, con una mano in tasca e la bocca un poco aperta. Quando ti sente arrivare apre un occhio solo.'),
    cop('Non stavo dormendo, sia chiaro: stavo facendo coraggio con gli occhi chiusi, che si fa meglio.'),
    cop('Stanotte i cani hanno abbaiato come sempre, e io me ne sono accorto soltanto stamattina. Mia nonna direbbe che è la luna che cambia, io dico che è questa.'),
    IF({ flag: 'int.edera.2.lent' },
      [cop('La signora delle cantine dice che posso tenerla finché non smetto di avere paura. Le dica che la tengo da conto, e che non la mostro a nessuno.')],
      [
        cop('È sua, vero? L\'ho capito da com\'era calda. Gliela rendo, perché la signora delle cantine stamattina me ne ha portata una delle sue, uguale.'),
        { do: 'call', name: 'interests.giveBack' },
      ]),
    choice(
      o('E prima come facevate, con i cani?', { esplora: 1 }, [
        cop('Fischiavo, per farmi compagnia. Ma i cani rispondevano, e allora era peggio.'),
      ]),
      o('Sono contenta che stanotte abbiate dormito tranquillo.', { tono: 1 }, [
        cop('Pensato tranquillo, signorina, pensato. Però sì, grazie: è la prima notte da un mese.'),
      ]),
    ),
    flag('int.edera.guard'),
    xp(3),
  ],

  // ---- 3. «I cartellini»: the labels on Edera's shelf, in the library ------------------------------------------
  'int.edera.3': [
    N('Sullo scaffale a destra della finestra, tra due libri appoggiati di traverso, c\'è una fila di pietre impolverate, e sotto ognuna un cartellino bianco.'),
    T('Accanto c\'è una penna con la punta sporca d\'inchiostro, e una boccetta mezza piena. Prima di scrivere le guardo bene, una alla volta.'),
    open('interests.labels'),
    IF({ flag: 'int.edera.3.written' }, [
      T('Adesso sotto ogni pietra c\'è il suo nome, con la mia calligrafia un po\' storta. La prossima volta che scendo lo dico a Edera, che di ognuna ricorda il colore.'),
      ...done(3, 'Ho scritto i cartellini delle pietre di Edera, sullo scaffale della biblioteca, guardandole una alla volta: il colore, le strisce, i puntini.'),
    ], [
      T('Le pietre stanno ferme dove sono, e la penna pure. Torno quando ho voglia di guardarle con calma.'),
    ]),
  ],
};
