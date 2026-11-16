// The trial (the final Exam), the dawn flight, the epilogue by the campfire and the last session.
// Every epilogue line is gated on what really happened (flags, trust, stats, the tasks she gave).
import {
  bell, N, T, malva, ortica, edera, ginepra, cat, judge, o, tg, choice, IF, xp, flag, diary, step, chapter,
  travel, give, exam, session, cinema, goto, sp,
} from '../h.js';
import { chapterCard } from '../h.js';

const BOLD = { trait: ['rischio', '>=', 3] };

export const END = {
  'c3.trial': [
    bell,
    N('Ti fanno salire sul banco, accanto a Ginepra. Il Giudice sta più in alto di tutti, contro le finestre, e prima di parlare riordina i suoi fogli con molta cura.'),
    judge('Lei è la signorina {name}. È un nome grazioso, sa? Mia madre aveva una capretta che si chiamava quasi allo stesso modo, e le eravamo tutti molto affezionati.'),
    judge('Non abbia paura di me. In quest\'aula si cerca soltanto la verità, e la verità non ha mai fatto male a nessuno che non se lo meritasse.'),
    IF({ stat: ['jailed', '>=', 2] },
      [judge('Del resto noi due ci conosciamo già: lei ha dormito nelle mie celle {stat:jailed} volte. Spero che il pane fosse almeno fresco.')],
      [IF({ stat: ['jailed', '>=', 1] }, [judge('Del resto noi due ci conosciamo già: lei ha dormito una notte nelle mie celle. Spero che il pane fosse almeno fresco.')])]),
    IF({ flag: 'b1.spoke' },
      [judge('So che una sera, in piazza, lei ha parlato in difesa di Comare Hale. Io so quasi tutto quello che succede a Salem: è il mio mestiere, e lo faccio volentieri.')],
      [judge('So che una sera, in piazza, mentre portavano via Comare Hale, lei è rimasta in silenzio. È stata una scelta saggia, e mi auguro che la saggezza non l\'abbia abbandonata.')]),
    IF({ flag: 'b2.went' }, [judge('E so che la notte del deposito le ombre tra gli scaffali erano due. Ma ogni cosa a suo tempo: non abbiamo nessuna fretta.')]),
    IF({ trait: ['tono', '<=', -3] }, [judge('Mi riferiscono anche che lei ha la risposta tagliente. Qui dentro la prego di moderarla: in un\'aula, una lingua affilata finisce quasi sempre per ferire chi la porta.')]),
    IF({ trait: ['tono', '>=', 3] }, [judge('Mi dicono anche che lei è gentile con tutti. Vedrà che andremo d\'accordo, perché lo sono anch\'io.')]),
    IF({ trait: ['parola', '>=', 3] }, [judge('Dicono che lei parli chiaro, senza giri di parole. Lo apprezzo sinceramente, perché mi fa risparmiare molto tempo.')]),
    IF({ trait: ['parola', '<=', -3] }, [judge('Dicono che lei pesi ogni parola prima di dirla. È una virtù rara, signorina, e in quest\'aula la riconosco subito, perché è anche la mia.')]),
    IF({ flag: 'coven.watch.malva' },
      [N('Malva è in piedi in fondo all\'aula, dove le avevi chiesto di stare, e non stacca gli occhi dal Giudice nemmeno per battere le palpebre.')],
      [IF({ trust: ['malva', '>=', 2] }, [N('In fondo all\'aula, in piedi contro il muro, c\'è Malva con le braccia conserte. Ti guarda come guarda una catasta di legna ben fatta.')])]),
    IF({ trust: ['ortica', '>=', 2] }, [N('Ortica è seduta in terza fila e, per la prima volta da quando la conosci, sta zitta. Si vede che le costa moltissimo.')]),
    IF({ flag: 'coven.watch.edera' }, [
      N('Edera è seduta in prima fila, col vestito buono, proprio dove le avevi chiesto di mettersi. Sorride al Giudice come si sorride a un bambino sorpreso in sagrestia.'),
      judge('Vedo che c\'è anche la signora Edera, seduta di fronte a me. È curioso: non riesco a guardarla senza che mi tornino in mente certe candele.'),
    ], [IF({ trust: ['edera', '>=', 2] }, [N('Edera è vicino alla finestra, dritta sulla sedia. Quando incontra i tuoi occhi muove appena le labbra, e ci leggi sopra «Rosalba».')])]),
    judge('Le farò alcune domande sulle carte che le hanno trovato addosso. Una ragazza istruita le conosce e ne parla senza turbarsi; una ragazza che esita, invece, ha dentro qualcosa che esita al posto suo.'),
    judge('Mi sembra un metodo semplice, e anche giusto. Quando vuole, cominciamo.'),
    choice(
      o('«Sono pronta: chiedete pure.»', { guida: -1 }, [
        judge('Nessuno è mai davvero pronto, signorina, glielo dico per esperienza. Ma la buona volontà la apprezzo sempre.'),
      ], { tag: tg('m11', 's') }),
      o('Prima di rispondere guardo Ginepra, e non lui.', { guida: 1 }, [
        N('Ginepra ti fa una smorfia, la stessa di quando sbagliava a leggere La Ruota. Ti viene quasi da ridere, nel momento più sbagliato, e finalmente capisci come si sente lei.'),
      ], { trust: { ginepra: 1 }, tag: tg('m07', 'c') }),
    ),
    exam('judge', 'court.dock'),
    IF({ flag: 'exam.passed' }, [
      judge('Bene. Molto bene, signorina. Forse perfino troppo bene, per una ragazza arrivata a Salem con la neve.'),
      judge('Una che sa tutte queste cose mi lascia pensieroso. Ma la legge chiede risposte, e lei le ha date: siete assolte tutte e due.'),
      judge('Mi permetto un consiglio da amico: lasciate Salem prima che la piazza cambi idea. La piazza cambia idea spesso, e io di solito le do retta.'),
      flag('trial.won'),
      diary('Ho risposto a tutte le domande del Giudice. Ci ha assolte, e ci ha consigliato di sparire.'),
    ], [
      judge('Che peccato, signorina. Glielo dico sinceramente: speravo che andasse in un altro modo.'),
      judge('Domattina all\'alba, sulla collina, tutte e due. Fino ad allora non vi mancherà niente, ve lo prometto.'),
      N('In quel momento dal fondo dell\'aula parte un calamaio. Dalla terza fila si alza una voce che non smette più, e tutte le candele si spengono insieme, come se qualcuno ci avesse soffiato sopra con garbo.'),
      malva('Fuori, voi due, fuori! Dalla porta piccola! E guai a chi si ferma a ringraziare!'),
      flag('trial.lost'),
      diary('Davanti al Giudice ho sbagliato troppe risposte. Le maestre hanno spento l\'aula, e siamo scappate al buio.'),
    ]),
    N('Sul banco del Giudice, in mezzo ai fogli, c\'è una carta che non avevi ancora visto. Sopra c\'è un angelo che suona una tromba.'),
    IF({ flag: 'trial.won' },
      [judge('Quella era nel deposito, e credo che appartenga a lei. Dicono che queste carte vadano da chi le sa guardare. Io non ci credo, ma la prenda lo stesso.')],
      [T('La prendo io, e la infilo sotto il mantello. Mentre tutti gridano al buio, nessuno guarda le mani di una ragazza.')]),
    give('m20'),
    xp(20),
    step('f.dawn'),
    goto('f.dawn'),
  ],

  'f.dawn': [
    travel('village.forest_gate'),
    N('Quando arrivate al cancello del bosco sta facendo giorno. La neve è finita da mesi, ma a quest\'ora l\'aria ha ancora l\'odore dell\'inverno.'),
    N('Ginepra si ferma a riprendere fiato, ti guarda e scoppia a ridere. Per la prima volta da quando la conosci, è proprio il momento giusto.'),
    N('Il primo sole passa tra le sbarre del cancello e si posa su qualcosa che è infilato nel legno. È una carta, e stavolta nessuna delle due allunga la mano per prima.'),
    ginepra('Prendila tu, stavolta. Lo so che avevo detto che la prossima toccava a me, ma arrivo seconda, e mi va benissimo così.'),
    give('m19'),
    // she already flies (the broom comes mid chapter 2): a broom for Ginepra waits at the gate
    IF({ flag: 'coven.ortica.brooms' },
      [N('Appoggiata al cancello c\'è una scopa per Ginepra, con un biglietto lunghissimo legato al manico. Ortica l\'ha lasciata dove le avevi detto, e non ha resistito a raccontare qualcosa.')],
      [N('Appoggiata al cancello c\'è una scopa per Ginepra, con un nastro verde legato al manico. Chi l\'ha lasciata lì non ha voluto farsi ringraziare.')]),
    ginepra('Quella è una scopa vera, ed è per me? Di quelle che volano! Ah ah, dimmi che è facile, perché io non ne ho idea.'),
    choice(
      o('È facile: parti, e il resto lo capisci in aria.', { rischio: 1 }, [
        ginepra('Questa è la cosa più bella che mi abbia mai detto qualcuno. Parto, e se cado almeno cado dalla parte del bosco.'),
      ], { tag: tg('m00', 'w') }),
      o('Stammi dietro, fai quello che faccio io e non guardare giù.', { rischio: -1 }, [
        ginepra('Ti sto dietro, ti sto dietro. Però ti avverto: se cado, dico a tutti che l\'idea era tua.'),
      ], { tag: tg('m07', 'w') }),
      // special answer: she passes on what Malva taught her in the garden
      sp('broom', { flag: 'lesson.fly' }, 'Ti dico quello che Malva ha detto a me: tienila bassa, e pensa a un posto che conosci.', { parola: 1 }, [
        ginepra('Bassa e vicina, e un posto che conosco. Allora penso al bivacco, che l\'ho acceso io e me lo ricordo bene: se arrivo da un\'altra parte, la colpa è di Malva.'),
        ginepra('Aspetta, ma allora Malva vola? Ah ah, questa me la devi raccontare tutta, appena siamo in aria e non può sentirci.'),
      ], { trust: { ginepra: 1 } }),
    ),
    IF({ flag: 'fire.carriage' }, [ginepra('Te l\'avevo letto al fuoco, che avremmo fatto un viaggio noi due! Ho sbagliato soltanto la carrozza, e il colore, e la Ruota. Il resto era giusto.')]),
    IF({ flag: 'fire.promised' }, [ginepra('Al fuoco avevi detto che saresti venuta subito. Ci hai messo un po\', ma sei venuta, e adesso io a te credo per sempre.')]),
    IF({ flag: 'venus.looked' }, [ginepra('E quella bara nel bicchiere si sbagliava, hai visto? Non mi fiderò mai più di un uovo.')]),
    IF({ flag: 'b3.stealth' },
      [ginepra('Sei venuta a prendermi dalle cantine, al buio, in mezzo ai topi. Sei la persona più romantica che conosco, lo sai?')],
      [ginepra('Sei entrata dalla porta grande, davanti a tutto il villaggio, e hai detto il tuo nome. Questa non me la dimentico finché campo.')]),
    IF(BOLD, [ginepra('E adesso voliamo pure. Con te non c\'è mai una cosa che si possa fare da ferme, ed è per questo che la prima sera ti ho preso quella carta: volevo vedere se mi correvi dietro.')]),
    IF({ torn: 'tono' }, [ginepra('Con te non si capisce mai se stai per abbracciarmi o per mordermi. Non cambiare, eh: è il motivo per cui non mi annoio.')]),
    IF({ power: 'cat' }, [cat('Io viaggio in braccio a te, come sempre, e non con quella lì. Su questo non si discute.')]),
    cinema([
      'Salem diventa piccola sotto di voi, e in pochi minuti la tenete tutta in uno sguardo.',
      'Si vedono il tribunale, la piazza, il comignolo di Malva che fuma già. Poi ci sono soltanto gli alberi, e il sole che sale.',
    ], null, 'dawn'),
    diary('All\'alba siamo volate via da Salem. Ginepra rideva, e stavolta ridevo anch\'io.'),
    xp(15),
    session('s3'),
    step('f.last'),
    travel('forest.entry'),
  ],

  // by the campfire: the epilogue (what happened to everyone), then the last session
  'f.last': [
    N('Il bivacco è lo stesso dove Ginepra ti ha letto La Ruota. Stasera il fuoco è già acceso, e intorno ci sono anche le tre maestre, sedute più vicine tra loro di quanto ammetterebbero.'),
    IF({ flag: 'b1.spoke' },
      [N('Comare Hale vende ancora le sue candele sotto il portico. Ogni settimana ne lascia una sulla soglia della tua capanna, senza biglietto.')],
      [N('Di Comare Hale non si è più saputo niente. Sotto il portico qualcun altro ha riaperto il suo banco, e vende candele più care.')]),
    IF({ flag: 'b2.went' },
      [N('Ginepra ha di nuovo il suo mazzo. Lo mescola malissimo, facendo cadere metà delle carte, e ne va fiera.')],
      [N('Ginepra si è fatta un mazzo nuovo. Dice che quello vecchio le portava sfortuna, e nessuna di voi le fa notare che non è vero.')]),
    IF({ flag: 'b3.stealth' },
      [N('Nelle cantine i conestabili raccontano ancora di due ombre e di un gatto nero, e a ogni racconto le ombre diventano più alte.')],
      [N('Al villaggio si racconta di una ragazza che un mattino entrò in tribunale dalla porta e chiese di essere processata. I bambini ci giocano, in piazza.')]),
    IF({ flag: 'trial.won' },
      [N('Il Giudice, dopo avervi assolte, fa meno processi di prima. Lui dice che l\'età lo stanca; qualcuno dice che ha ancora in mente le tue risposte.')],
      [N('Il Giudice vi fa ancora cercare, con il garbo di sempre, e ogni mese firma un foglio nuovo. Non vi troverà.')]),
    IF({ trust: ['malva', '>=', 2] },
      [malva('Io ti ringrazio. Ecco, l\'ho detto, e che nessuno me lo faccia ripetere.'), N('Subito dopo Malva tocca il ferro della pentola, tre volte, e guarda male chiunque sorrida.')],
      [malva('Io non ringrazio, lo sai. Però la legna per l\'inverno te l\'ho già fatta spaccare, ed è accatastata dietro la capanna.')]),
    IF({ steady: 'parola' }, [
      IF({ trait: ['parola', '>=', 3] },
        [malva('E continua a dire le cose in faccia, mi raccomando. In questo paese siamo rimaste in poche.')],
        [malva('E tu, che pesi ogni parola da quando ti conosco: stasera una di troppo puoi anche dirla, che qui non ti sente nessuno.')]),
    ]),
    IF({ trust: ['ortica', '>=', 2] },
      [ortica('La tua storia la racconto a tutto il bosco, e ogni volta mi viene un po\' più lunga. Nell\'ultima versione c\'è anche un drago, ma ci sta bene, non stona.')],
      [ortica('La tua storia la racconto lo stesso, sai, anche se in una versione corta. Senza il drago, per intenderci.')]),
    IF([{ steady: 'esplora' }, { trait: ['esplora', '>=', 3] }], [ortica('E dimmi che continuerai a girare e a guardare tutto, perché ho ancora un sacco di posti da farti vedere, e i più belli non stanno su nessuna mappa.')]),
    IF({ trust: ['edera', '>=', 2] },
      [edera('Ho scritto il tuo nome sulla prima pagina del mio libro, per non perderlo più: Rosalba. No, aspetta, ho scritto bene: {name}.')],
      [edera('Che bella serata. E tu chi sei, cara? Ah, sì, certo: la ragazza delle carte. Hai la mano ferma, questo me lo ricordo.')]),
    IF([{ steady: 'tono' }, { trait: ['tono', '>=', 3] }], [edera('Sei rimasta gentile fino alla fine, anche con chi non lo era con te. È la cosa più difficile, e non c\'è carta che la insegni.')]),
    IF({ flag: 'cat.fed' },
      [cat('A proposito del pane della prima sera: non che mi interessi, ma non ne hai più offerto. Lo dico così, per la cronaca.')],
      [cat('Io non dico niente. Va bene, una cosa la dico: sono fiero di te. E adesso dimentichiamocelo tutti e due.')]),
    IF({ trait: ['esplora', '>=', 3] }, [cat('Hai annusato ogni angolo di Salem, più di quanto abbia fatto io in tre inverni. Detto da un gatto, è il complimento più grosso che esista.')]),
    IF({ trait: ['esplora', '<=', -3] }, [cat('Tu sei sempre andata dritta dove dovevi andare, senza perdere un passo. Un giorno ti insegnerò a perdere tempo, che è un\'arte anche quella.')]),
    ginepra('C\'è qualcuno che ti aspetta, laggiù, dove si vede quella candela tra gli alberi. Vai pure, che al fuoco ci penso io: ormai lo so tenere acceso.'),
    choice(
      o('Mi alzo e vado verso la candela.', { guida: -1 }, [
        N('Ti alzi e cammini tra gli alberi. La candela è posata su un tavolo che conosci bene, anche se non l\'avevi mai visto in un bosco.'),
      ], { tag: tg('m00', 'w') }),
      o('Prima abbraccio Ginepra.', { guida: 1 }, [
        ginepra('Ah ah, scusa, rido perché se no piango. Vai, dai, che ti aspetta. Ti voglio bene, e adesso vai davvero.'),
      ], { trust: { ginepra: 1 }, tag: tg('m07', 'c') }),
    ),
    chapterCard(4), // black screen, the title of the chapter that opens (story/chapter.js)
    session('s4'),
    flag('ending.seen'),
    chapter(4),
    xp(10),
    step('post.minors'),
  ],
};
