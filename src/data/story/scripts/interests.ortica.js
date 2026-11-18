// Ortica's interest, herbs and garden: the first slice (notes/interessi/PROGETTO.md §2, §11). The scene that
// starts it at her hut, the three missions, and the miller in the square the day after his ointment.
// Wiring: src/glue/interests.js (registry, cast, the screens). The screens are services called from here:
//   interests.beam    the beam: three bunches from her pantry, and where to hang them -> flag int.ortica.1.hung
//   interests.mortar  four jars, two in the mortar, three turns of the pestle      -> flag int.ortica.2.made
//   interests.bundle  the dried sage tied tight (hers if she has it: int.ortica.3.own) -> flag int.ortica.3.tied
//   interests.step    a mission done: its flag, today's date, and (3) the sage of the rite marked «tua»
// {mazzetto} is filled by the glue from her pantry («questa lavanda è tua», «questo timo è tuo»).
// She is spoken to as a woman (lore/storia/decisioni, point 8). Nobody explains the game: Ortica talks about her beam,
// the miller's knees and Malva's incense, and what is learnt comes out of the gestures.
import { N, T, ortica, malva, choice, o, xp, diary, open, goto, flag } from '../h.js';

const bond = { do: 'bond', who: 'ortica', n: 1, why: 'interest' };
const done = (n, note) => [diary(note), xp(5), bond, open('interests.step', 'ortica', n)];

export const INTEREST_ORTICA_SCRIPTS = {
  // ---- the start: she has a bunch of her own in the pantry, and comes to Ortica's hut ------------------
  'int.ortica.start': [
    N('Ortica è sulla soglia con un cesto vuoto sotto il braccio, ma appena ti vede lo posa per terra e annusa l\'aria due volte, girando la testa come fa il merlo.'),
    { if: { flag: 'garden.lesson.acqua' },
      then: [ortica('Da quando ti ho insegnato a bagnare hai le mani che sanno d\'orto, e si sente da qui: {mazzetto}, vero? Fammelo annusare un momento.')],
      else: [ortica('Tu hai le mani che sanno d\'orto, e non dirmi di no, che il naso non mi ha mai tradito: {mazzetto}, vero? Fammelo annusare un momento.')] },
    N('Le passi il mazzetto che tieni in tasca. Lei lo gira tra le dita, ci affonda il naso, e per un momento, cosa rara, non dice niente.'),
    ortica('È buono, e te lo dice una che è difficile. Il guaio è che un mazzetto fresco dura pochi giorni, e poi in fondo alla tasca diventa una poltiglia.'),
    N('Si porta una mano alla schiena e guarda in alto, verso il trave della capanna, dove pendono soltanto i ganci vuoti e una ragnatela.'),
    ortica('Il trave è vuoto da una settimana, perché la schiena mi ha detto basta proprio in cima alla scala. Se mi porti i tuoi mazzetti li appendiamo insieme: tu sali, e io ti dico come si fa.'),
    flag('int.ortica.offered'),
    choice(
      o('Prendo la scala e salgo adesso, finché i mazzetti sono freschi.', { rischio: 1 }, [goto('int.ortica.1')]),
      o('Oggi non ho tempo, ma torno a darti una mano, te lo prometto.', { rischio: -1 }, [
        ortica('Il trave non scappa, e io nemmeno, con questa schiena. Quando torni, porta i mazzetti.'),
      ]),
    ),
  ],

  // ---- 1. «A testa in giù»: drying -------------------------------------------------------------------
  'int.ortica.1': [
    N('Ortica trascina la scala fino al trave e la tiene ferma con tutte e due le mani, mentre il merlo, dalla finestra, vi guarda come se dovesse darvi il voto.'),
    ortica('Prima scegli i mazzetti e legali stretti alla base, perché seccando si ritirano e scappano dallo spago. Se non ne hai abbastanza ci metto dei miei, che a me un trave vuoto mette tristezza.'),
    open('interests.beam', 'ortica'),
    { if: { flag: 'int.ortica.1.hung' },
      then: [
        N('Dall\'alto della scala vedi i mazzetti appesi in fila, con le punte verso il pavimento, che girano piano nell\'aria che entra dalla porta.'),
        ortica('Il fresco va nella pentola e il secco va nei fumi e nei sacchetti, perché un\'erba fresca sulla brace fa soltanto un fumo bianco che piange. I tuoi te li tengo qui finché frusciano come carta, e poi sono tuoi.'),
        ortica('Ah, il merlo dice anche che il mugnaio non scende più le scale, con quelle ginocchia. L\'unguento glielo portavo io, ma con questa schiena è un\'altra storia: domani ci pensiamo, tu e io.'),
        ...done(1, 'Ho appeso i miei mazzetti al trave di Ortica, a testa in giù, all\'ombra e dove passa l\'aria. Il secco serve per i fumi e i sacchetti, e il fresco per la pentola.'),
      ],
      else: [ortica('Va bene, i mazzetti stanno in dispensa e il trave sta qui. Torna quando hai voglia di salire.')] },
  ],

  // ---- 2. «Le scale del mulino»: the mortar ----------------------------------------------------------------
  'int.ortica.2': [
    N('Davanti alla capanna Ortica ha messo in fila quattro vasetti di coccio e un mortaio di pietra grande come una zuppiera.'),
    ortica('Il merlo è tornato dal mulino stamattina e dice che il mugnaio sta in cima alle scale da tre giorni, con le ginocchia gonfie come pagnotte. Il pestello va girato a lungo, e oggi la mia schiena non ne vuole sapere.'),
    ortica('Per due ginocchia così ci vuole un\'erba che guarisce e consola, non una che fa la guardia alla porta di casa. Nei vasetti ce ne sono quattro: scegline due, e pesta.'),
    open('interests.mortar', 'ortica'),
    { if: { flag: 'int.ortica.2.made' },
      then: [
        N('Ortica ci mescola un cucchiaio di grasso, lo annusa con gli occhi chiusi e chiude il vasetto con un pezzo di tela legato stretto.'),
        ortica('Portaglielo tu, che il mulino è giù per il sentiero, e digli che la storia della volpe e del parroco gliela finisco la prossima volta.'),
        ortica('E già che ci sei, ascolta questa: il merlo giura che il bottegaio mette la segatura nell\'incenso di Malva. Con un mazzo di salvia secca si farebbe di meglio, ma ne parliamo domani.'),
        N('Al mulino il mugnaio apre la finestra di sopra e cala un cestino legato a una corda, perché le scale, dice, oggi le guarda e basta. Ci metti il vasetto, e il cestino risale cigolando come la ruota.'),
        N('«Questa è calendula!» grida di lassù, appena tolta la tela. «La sento dall\'odore. Di\' a Ortica che adesso una storia gliela devo anch\'io.»'),
        ...done(2, 'Ho pestato nel mortaio di Ortica la calendula e la melissa, che guariscono e consolano, e ho portato l\'unguento al mugnaio. Chissà se domani riesce a scendere le scale.'),
      ],
      else: [ortica('Il mortaio non scappa, e il mugnaio con quelle ginocchia nemmeno. Torna quando hai voglia di pestare.')] },
  ],

  // ---- the day after: the miller in the square (he speaks through the narrator, as in c2.mill) --------------
  'int.ortica.miller': [
    N('In piazza, accanto al pozzo, c\'è il mugnaio con un bastone nuovo e un capannello di gente intorno. Quando ti vede alza il bastone come una bandiera.'),
    N('«Eccola, la ragazza dell\'unguento! Ieri ho fatto le scale due volte, e stamattina sono venuto fin qui a piedi, per dire a tutti che la ruota gira al contrario.»'),
    N('«Non mi crede nessuno lo stesso, ma almeno adesso me lo dicono in faccia, e non alle spalle.»'),
    choice(
      o('Sono contenta di vedervi in piedi. E la ruota, gira ancora al contrario?', { esplora: 1 }, [
        N('«Da un mese e una settimana, ormai. Ma con queste ginocchia nuove, che giri pure come le pare.»'),
      ]),
      o('L\'unguento l\'ha fatto Ortica: io ho soltanto girato il pestello.', { tono: 1 }, [
        N('«Allora dille che la calendula l\'ho sentita subito. Lei mi deve tre storie, e adesso io le devo una gamba.»'),
      ]),
    ),
    flag('int.ortica.miller'),
    xp(3),
  ],

  // ---- 3. «Il fumo di Malva»: the sage reaches the rite ------------------------------------------------------
  'int.ortica.3': [
    N('Sul ceppo davanti alla capanna Ortica ha steso un pezzo di tela, e sopra ci sono un rotolo di spago e un mazzo di salvia secca che fruscia come carta appena lo tocchi.'),
    ortica('Il merlo giura che il bottegaio mette la segatura nell\'incenso di Malva. Lei dice che controlla, ma la segatura nel fumo non la sente nessuno finché non comincia a tossire.'),
    ortica('Malva un incenso nostro non lo chiederebbe mai, quindi glielo portiamo senza chiedere.'),
    ortica('La salvia è un\'erba d\'aria, ed è di Giove, che è il re generoso: pulisce una stanza come il vento pulisce l\'aia. Però deve essere secca, se no sulla brace fa soltanto fumo e lacrime.'),
    open('interests.bundle', 'ortica'),
    { if: { flag: 'int.ortica.3.tied' },
      then: [
        { if: { flag: 'int.ortica.3.own' },
          then: [ortica('Questa è la salvia del tuo orto, e si sente: è più forte della mia, ma non dirlo in giro che ne soffro.')],
          else: [ortica('Questa è mia, ma va bene lo stesso. La prossima volta portami la tua, che la voglio annusare.')] },
        ortica('Malva le foglie le sbriciola sulla brace una alla volta, come fa con l\'incenso, e il mazzo legato serve a portargliela intera. Quella che avanza tienila tu, per il tuo fumo prima di leggere.'),
        N('La sera lasci il mazzo sul tavolo di Malva. Lei lo annusa, lo gira tra le mani, sbriciola una foglia sulla brace e guarda il fumo salire dritto.'),
        malva('L\'hai legato stretto, bene. La segatura del bottegaio, d\'ora in poi, la spargo sul pavimento quando nevica.'),
        T('Malva non ringrazia mai nessuno, ma il mazzo l\'ha messo accanto al focolare, dove tiene le cose che usa.'),
        ...done(3, 'Ho legato un mazzo di salvia secca per Malva, al posto dell\'incenso del bottegaio. La salvia è un\'erba d\'aria e di Giove, e pulisce; quella che avanza è mia, per il fumo prima di leggere.'),
      ],
      else: [ortica('La salvia aspetta, che secca com\'è non va più a male. Torna quando hai le mani libere.')] },
  ],
};
