// Chapter 2, the forest in spring: Ortica and the three cards, the errand to the mill (the third and
// last), the campfire night with Ginepra, the seized deck (fork 2), the arrest at the cottage ("Sono io.").
// Also: Ortica at home, and the thick fog of the deep wood that sends her back.
import {
  bell, N, T, ortica, ginepra, cat, cop, o, tg, choice, IF, xp, coins, flag, diary, step, draw, teach, lesson,
  session, cinema, wait, trust, visit, tool, sp, flag as setFlag,
} from '../h.js';
import { chapterCard } from '../h.js';

const CURIOUS = { trait: ['esplora', '>=', 3] };
const STRAIGHT = { trait: ['esplora', '<=', -3] };
const BOLD = { trait: ['rischio', '>=', 3] };
const CAREFUL = { trait: ['rischio', '<=', -3] };
const FLIES = [{ power: 'broom' }, { flag: 'lesson.fly' }];

export const C2 = {
  'c2.ortica': [
    N('La capanna di Ortica è mezza casa e mezza cespuglio. Dal tetto pendono mazzi di erbe, e dalla porta aperta esce una voce che stava parlando da sola da prima che tu arrivassi.'),
    ortica('Eccoti, sei la ragazza di Malva! Ti aspettavo per ieri, ma ieri pioveva, e poi il merlo mi ha detto che avevi da fare in paese, e il merlo di solito è bene informato.'),
    IF({ flag: 'malva.wood' }, [ortica('Malva dice che spacchi la legna storta. Detto da lei è un complimento grosso, sai: di me in trent\'anni ha detto soltanto che parlo.')]),
    IF({ flag: 'malva.cheeky' }, [ortica('Malva mi ha raccontato delle tue mani delicate, e mentre lo raccontava ha riso. Malva che ride! L\'ultima volta che è successo c\'era ancora il vecchio pastore.')]),
    IF({ flag: 'b1.spoke' },
      [ortica('E in piazza hai parlato per la Hale, lo sa tutto il bosco. Gliel\'ho detto io, per la verità, ma l\'avrebbero saputo lo stesso.')],
      [ortica('E in piazza sei stata zitta, mi dicono. Io non ci sarei riuscita nemmeno con un sasso in bocca, quindi non sarò certo io a farti la predica.')]),
    IF({ flag: 'b1.watched' }, [ortica('Però mi dicono anche che li hai guardati in faccia uno per uno, senza abbassare gli occhi. A Salem chi guarda così poi si ricorda, e qualcuno ha già cominciato a temerlo.')]),
    IF({ flag: 'malva.hutstory' }, [ortica('E dormi nella mia capanna, quella storta al limite del bosco! La macchia di umido sopra il letto c\'era già ai miei tempi, e io le avevo anche dato un nome.')]),
    IF({ flag: 'gate.flew' }, [ortica('Il merlo dice anche che al cancello volevi passare da sopra, con la scopa, davanti a Malva. Avrei pagato per vedere la sua faccia, e io non pago mai niente.')]),
    IF({ flag: 'gate.advice' }, [ortica('Scommetto che Malva ti ha detto di rispondermi corto, perché lo dice a tutte. Tu fai pure come dice lei, che tanto il resto ce lo metto io.')]),
    IF(CURIOUS, [ortica('Mi dicono anche che giri dappertutto e metti il naso in ogni angolo. Brava, è così che si fa: io in questo bosco do del tu a ogni sasso, e di ognuno so i fatti.')]),
    IF(STRAIGHT, [ortica('Sei arrivata dritta come una freccia, senza fermarti nemmeno alla radura dei funghi. Peccato, quest\'anno sono venuti benissimo, ma si vede che sai dove vuoi andare.')]),
    ortica('Io sono Ortica, e prima che tu lo chieda: sì, pungo, ma curo anche, come la pianta. È una battuta vecchia, lo so, però funziona ancora e non vedo perché cambiarla.'),
    choice(
      o('Malva dice che hai qualcosa da insegnarmi.', { esplora: -1 }, [
        ortica('Dritta al punto, eh? Si vede che ti ha tirata su Malva, anche se soltanto per un inverno. Va bene, cominciamo subito, e le chiacchiere le facciamo dopo.'),
      ], { tag: tg('m01', 's') }),
      o('Parli sempre così tanto, o lo fai per me?', { parola: 1 }, [
        ortica('Sempre, anche quando dormo! Il gufo qui sopra ha cambiato albero due volte. Però mi piace che tu me l\'abbia chiesto in faccia, perché di solito la gente lo pensa e annuisce.'),
      ], { trust: { ortica: 1 }, tag: tg('m00', 'w') }),
      // special: one who looks at everything asks about the roof first
      sp('trait', CURIOUS, 'Prima dimmi cosa pende dal tetto: quelle erbe non le ho mai viste.', { esplora: 1 }, [
        ortica('Finalmente una che guarda in su! Quella è artemisia, quella è ruta, e quella in fondo non lo so nemmeno io: è cresciuta da sola e non ho avuto cuore di toglierla.'),
        ortica('Tu sei una che prima di sedersi fa il giro della stanza, l\'ho capito subito. Andremo d\'accordo, perché io il giro lo faccio a voce.'),
      ], { trust: { ortica: 1 } }),
    ),
    ortica('Prima però dimmi una cosa tu, che ormai sei una fattucchiera e in paese ci hai passato l\'inverno. La Hale, secondo te, c\'entrava qualcosa con quegli spilli?'),
    choice(
      o('No. Era una vecchia con una cesta di candele, e basta.', { parola: 1 }, [
        ortica('Lo penso anch\'io, e mi fa piacere sentirlo da una che c\'era. Io lo dico da mesi, ma io dico tante di quelle cose che ormai non mi contano più.'),
      ]),
      o('Non lo so. Io ho visto soltanto una ragazza che tremava davvero.', { guida: 1 }, [
        ortica('Ecco, questa è una risposta da fattucchiera: hai guardato anche l\'altra. Quella ragazza trema sul serio, e nessuno in paese si domanda di che cosa.'),
      ]),
      // special: she answers with what the people at her table say
      sp('pop', { pop: 2 }, 'Ti dico cosa ne pensa la gente che viene a farsi leggere le carte da me.', { parola: -1 }, [
        ortica('Senti senti, hai già un tavolo dove la gente parla! E cosa dicono? No, aspetta, non dirmelo tutto insieme, che me lo voglio godere un pezzo alla volta.'),
        ortica('Dicono che della Hale non ci crede nessuno e che nessuno ha il coraggio di dirlo, vero? Lo sapevo, io, e a te lo raccontano perché giri le carte e non fai domande.'),
      ], { tag: '[Ti conoscono]' }),
    ),
    // the gesture (m03 upright): she gives
    N('Mentre parla Ortica gira una carta sul davanzale, la guarda appena e continua il discorso da dove l\'aveva lasciato.'),
    ortica('L\'Imperatrice, dritta: abbondanza, e quello che curi cresce e dà frutto. Vuol dire che oggi posso dare via senza contare, e io glielo chiedo sempre, prima di aprire la scatola.'),
    ortica('Adesso un regalo, perché senza carte nuove non si impara niente. Queste le ha portate il bosco: pescane una e non sbirciare. Io sbircio sempre, ma io sono vecchia del mestiere.'),
    draw('row', 'Il dono di Ortica'),
    ortica('Da me si impara a leggere il tempo: tre carte in fila, una per quello che è stato, una per adesso e una per quello che viene.'),
    teach('ppf'),
    lesson('ppf'),
    ortica('Mi raccomando la terza. Non dice come va a finire: dice dove sta andando la persona se continua così, e a saperlo prima si fa ancora in tempo a cambiare strada.'),
    ortica('Malva mi ha dato anche un foglio per te, sui quattro semi. Dice che te lo doveva dall\'inverno, e io le commissioni le faccio, anche se poi le racconto a tutti.'),
    lesson('suits'),
    IF({ power: 'fire' },
      [ortica('Vedo che ti è già venuta la fiammella sul palmo. È il fuoco dei Bastoni, il primo che arriva: fa luce dove è buio, e brucia i rovi che chiudono certi sentieri.')],
      [ortica('Il fuoco sul palmo non ti è ancora venuto, vero? È roba di Bastoni e arriva per primo, vedrai. Intanto resta dove c\'è luce, perché sotto gli alberi fitti non si vede a tre passi.')]),
    ortica('Ti confido una cosa, visto che sei nuova e non ti sei ancora stancata: a me non mi ascolta nessuno, da trent\'anni. Mi ascoltano le ortiche, ma quelle intanto pungono.'),
    choice(
      o('Io ti sto ascoltando, e non mi annoio per niente.', { tono: 1 }, [
        ortica('Davvero? Si vede, sai, hai la faccia di una che ascolta. Allora un giorno ti racconto del mugnaio, ma ci vuole un pomeriggio intero e bisogna portarsi da mangiare.'),
      ], { trust: { ortica: 1 }, tag: tg('m01', 'c') }),
      o('Forse ti ascolterebbero di più, se ogni tanto ti fermassi.', { tono: -1 }, [
        ortica('Fermarmi, proprio io! L\'ho fatto una volta, anni fa, e c\'è stato un tale silenzio che mi sono spaventata da sola. Però hai ragione, e te lo dico subito, prima di dimenticarmelo.'),
      ], { tag: tg('m09', 'p') }),
    ),
    ortica('Senti, ti chiedo un piacere, e te lo chiedo perché oggi ho la schiena a pezzi, non perché sei la più giovane. Porteresti questo barattolo al mugnaio? È l\'unguento per le sue ginocchia.'),
    ortica('Il mulino è sul torrente, e non puoi sbagliare perché la ruota cigola. Ah, ieri è passata Ginepra e ha chiesto di te tre volte: la sera accende un fuoco al bivacco, in fondo al sentiero.'),
    choice(
      o('Ha chiesto di me? E che cosa voleva sapere?', { esplora: 1 }, [
        ortica('Se eri arrivata, se stavi bene e se avevi ancora quella faccia seria. Io ho risposto di sì a tutte e tre, anche se la terza non potevo saperla.'),
      ]),
      o('Prima passo dal mulino, e poi vado da lei.', { esplora: -1 }, [
        ortica('Prima il mulino e poi l\'amica, come una persona seria. Io avrei fatto il contrario, e infatti con me l\'unguento sarebbe arrivato a Natale.'),
      ]),
      // special: with the broom the errand is a matter of minutes
      sp('broom', FLIES, 'Al mulino ci vado in volo, così il mugnaio lo vede arrivare dal cielo.', { rischio: 1 }, [
        ortica('In volo, dal mugnaio! Quello dirà alla moglie che una strega gli è scesa in cortile, e lei gli risponderà che beve. Vai, vai, e poi raccontami la faccia che fa.'),
      ], { flag: 'mill.flew' }),
    ),
    diary('Ortica mi ha insegnato a leggere il tempo in tre carte, e intanto mi ha raccontato mezzo bosco. Mi ha chiesto di portare un unguento al mulino.'),
    xp(5),
    N('Mentre Ortica continua a parlare ti si chiudono gli occhi un momento, e dietro le palpebre c\'è la luce di una candela che conosci.'),
    visit,
    step('c2.mill'),
  ],

  // ---- errand 3, the last: the mill (the miller speaks through the narrator)
  'c2.mill': [
    IF({ flag: 'mill.flew' }, [
      N('Scendi nel cortile del mulino con la scopa che frena sulla ghiaia. Il mugnaio, che stava guardando la ruota, alza la testa e resta con la fiaschetta a mezz\'aria.'),
      N('«Una strega che mi scende in cortile con l\'unguento di Ortica! A mia moglie non lo racconto, tanto direbbe che bevo. Dammi qua, che ho le ginocchia che scricchiolano più della ruota.»'),
    ], [
      N('Il mulino sta sul torrente e si sente da lontano, perché la ruota cigola a ogni giro. Il mugnaio è fermo lì davanti e la guarda come si guarda un figlio che ha preso una brutta strada.'),
      N('«Ti manda Ortica con l\'unguento? Era ora, ho le ginocchia che scricchiolano più della ruota. Di solito viene lei e ci mette due ore, perché prima deve raccontarmi tutto il bosco.»'),
    ]),
    N('«Guardala, quella ruota: da un mese gira al contrario. Mia moglie dice che sono io che bevo. Ma questo mulino l\'ha tirato su mio nonno con le pietre della vecchia chiesa, e da allora fa quello che gli pare.»'),
    choice(
      o('«Avete ragione voi: gira proprio al contrario.»', { tono: 1 }, [
        N('«Lo vedi che lo dicevo io?» Per festeggiare ti offre un sorso dalla fiaschetta, e dall\'odore capisci che è meglio non sapere cosa c\'è dentro.'),
      ], { tag: tg('m10', 'w') }),
      o('«Mi sa che ha ragione vostra moglie.»', { parola: 1 }, [
        N('«Anche tu, adesso?» Sospira, guarda la ruota ancora un momento e poi posa la fiaschetta sul muretto.'),
      ], { tag: tg('m11', 's') }),
      // special: she has read for enough people to read for a wheel
      sp('trait', { stat: ['readings', '>=', 3] }, 'Giro una carta per la ruota, qui sul muretto, e gliela leggo.', { guida: 1 }, [
        N('Giri una carta sul muretto e gli dici quello che ci vedi: una cosa che gira al contrario sta tornando da dove è venuta, e conviene chiedersi che cosa ha lasciato indietro.'),
        N('«Mio nonno ha lasciato indietro un debito col vecchio pastore, per quelle pietre.» Si gratta la testa a lungo. «Guarda che roba: sono venuto a farmi ungere le ginocchia e mi hanno letto il mulino.»'),
      ], { flag: 'mill.read', tag: '[Sai leggere]' }),
    ),
    N('«Per il disturbo ti racconto una cosa. Giù allo stagno c\'è un salice dove da ragazzi ci appendevamo per i piedi, a guardare il mondo capovolto. Su un ramo è rimasta una carta, con uno appeso proprio così.»'),
    N('«Ha la faccia tranquilla, quello lì, come uno che ha smesso di agitarsi e aspetta di capire. Da sotto in su le cose sembrano diverse, e qualche volta più chiare.»'),
    choice(
      o('«E voi ci siete più tornato, a quel salice?»', { guida: 1 }, [
        N('«Una volta sola, l\'anno che è morto mio padre. Mi sono appeso come da ragazzo, e il mondo capovolto mi è sembrato più sensato di quello dritto. Poi mi è girata la testa.»'),
      ]),
      o('«Allora ci passo oggi stesso, prima che faccia buio.»', { rischio: 1 }, [
        N('«Passaci, ma tieniti ai rami bassi, che quelli alti sono marci. Te lo dice uno che lo sa per esperienza, e che da allora zoppica quando cambia il tempo.»'),
      ]),
    ),
    flag('side.m12'),
    IF({ lacks: 'm10' }, [N('«E qui tra le pale, ogni tanto, ne vedo girare un\'altra insieme alla ruota. Se riesci a prenderla senza bagnarti, è tua.»')]),
    N('Ti conta in mano quattro monete, due volte. «Sarebbero per Ortica. Anzi no, tienile tu, che lei mi deve ancora tre storie lasciate a metà.»'),
    choice(
      o('Le tengo, visto che me le dà lui, e a Ortica non dico niente.', { parola: -1 }, [
        N('Le fai sparire in tasca prima che ci ripensi. Il mugnaio ti strizza l\'occhio, come uno che ha appena concluso un affare alle spalle di una chiacchierona.'),
        coins(4),
      ]),
      o('«Sono di Ortica, quindi le porto a lei.»', { parola: 1 }, [
        N('«Fai come credi, ma poi non lamentarti se ti tiene lì due ore per ringraziarti.» Te le lega in un fazzoletto, perché non si mescolino con le tue.'),
      ], { flag: 'mill.honest' }),
    ),
    IF({ power: 'cat' }, [cat('(Con questa fanno tre commissioni, e scommetto che è stata l\'ultima. Le novizie si mandano in giro; a una fattucchiera, prima o poi, si comincia a chiedere consiglio.)')]),
    diary('Ho portato l\'unguento di Ortica al mugnaio. Dice che allo stagno, su un salice, c\'è una carta con un uomo appeso per i piedi.'),
    xp(5),
    step('c2.client'),
  ],

  'c2.fire': [
    IF({ power: 'fire' }, [
      N('Ginepra è già al bivacco, seduta su un tronco, con un mucchio di rami davanti e un acciarino in mano che non ne vuole sapere.'),
      ginepra('Meno male che sei arrivata. Sono qui da un\'ora e ho fatto soltanto fumo, e nemmeno tanto. Tu lo sai accendere, vero? Tu sai sempre fare tutto.'),
      choice(
        o('Lascia fare a me, ci metto un momento.', { esplora: -1 }, [
          N('Apri la mano sopra i rami, e la fiammella che hai imparato a tenere sul palmo scende tra i rametti più sottili. Ginepra batte le mani da sola in mezzo al bosco.'),
        ], { tag: tg('m08', 'w') }),
        o('Ti faccio vedere come si fa, così la prossima volta lo accendi tu.', { tono: 1 }, [
          ginepra('Si fa così? Aspetta, lo tengo più sotto, ecco che ha preso! Ha preso, e l\'ho acceso io! Cioè, me l\'hai fatto accendere tu, ma l\'acciarino lo tenevo io.'),
        ], { flag: 'fire.taught', trust: { ginepra: 1 }, tag: tg('m14', 'c') }),
      ),
      cinema(['Il fuoco adesso scalda davvero. Ginepra resta sul tronco e tu ti siedi per terra, con le ginocchia tra le braccia, e per un po\' nessuna delle due dice niente.'], 'forest.campfire'),
      IF({ level: 7 }, [ginepra('Ortica dice che ormai sei una strega fatta e che dovrei darti del voi. Ah ah, non ci penso nemmeno.')]),
      IF({ flag: 'venus.card' }, [ginepra('Tu quella notte hai messo Gli Amanti sul davanzale, te lo ricordi? Da allora ho deciso che prima si chiede alle carte, e alle uova soltanto dopo.')]),
      IF({ flag: 'mill.honest' }, [ginepra('Ortica racconta a tutto il bosco che le hai riportato le monete del mugnaio. Io me le sarei tenute, sia chiaro, e poi me ne sarei vergognata per una settimana.')]),
      IF({ flag: 'mill.flew' }, [ginepra('E il mugnaio giura che gli è scesa una strega in cortile! Sua moglie dice che beve, ma io lo so chi era, e sono verde d\'invidia.')]),
      ginepra('Adesso ti leggo una carta io. Ho studiato, sai, almeno un pochino. Diciamo che ho guardato le figure mentre Ortica parlava.'),
      N('Pesca dal suo mazzo, gira la carta sul ginocchio e la guarda a lungo. È La Ruota della Fortuna.'),
      ginepra('Allora, vediamo un po\'. Qui c\'è una ruota, quindi vuol dire che farai un viaggio, e lo farai in carrozza. Sarà una carrozza rossa, con le tendine.'),
      choice(
        o('Veramente la Ruota parla di una cosa che gira e cambia.', { parola: 1 }, [
          ginepra('Ah, una cosa che gira e cambia. Sì, in effetti è più da Ortica. Però la carrozza era bella, ammettilo, e io ci avevo già messo dentro i cuscini.'),
        ], { tag: tg('m10', 's') }),
        o('Vai avanti, voglio sapere dove va questa carrozza.', { guida: 1 }, [
          ginepra('Va lontano, dove non ci conosce nessuno, e dentro ci siamo noi due che ce ne andiamo da Salem. Ah ah, è una bella lettura, no? Sarà anche sbagliata, ma è bella.'),
        ], { flag: 'fire.carriage', trust: { ginepra: 1 }, tag: tg('m14', 'c') }),
        // special: the three words she wrote for the Wheel
        sp('trait', { wrote: 'm10' }, 'Io per la Ruota, sul quaderno, ho scritto: {words:m10}.', { esplora: 1 }, [
          ginepra('Fammi sentire: {words:m10}. Suona molto meglio della mia carrozza, accidenti! Però le tendine le tengo, perché una ruota senza carrozza non va da nessuna parte.'),
          ginepra('Me le presti, quelle parole? Giuro che le imparo e poi le dico a Ortica come se fossero mie, così per una volta resta zitta lei.'),
        ], { trust: { ginepra: 1 }, tag: '[L\'hai scritto tu]' }),
      ),
      ginepra('Posso chiederti una cosa seria? Cioè, seria per come sono fatta io.'),
      ginepra('Se un giorno i conestabili venissero a prendere me, tu verresti a cercarmi?'),
      choice(
        o('Sì. Verrei subito, senza pensarci.', { guida: 1, rischio: 1 }, [
          ginepra('Lo sapevo, io. Cioè, lo speravo, che per me è la stessa cosa. Non te lo faccio giurare, perché a te credo anche senza.'),
        ], { flag: 'fire.promised', trust: { ginepra: 1 }, tag: tg('m07', 'w') }),
        o('Dipende da quanto sei stata scema per farti prendere.', { tono: -1 }, [
          ginepra('Moltissimo, te lo dico già adesso. Sarò stata scema come non mai, ah ah. E tu verrai lo stesso, perché brontoli ma poi vieni.'),
        ], { flag: 'fire.joked', tag: tg('m00', 'w') }),
        // special: she has slept in those cells, and knows what is missing there
        sp('trait', { stat: ['jailed', '>=', 1] }, 'Verrei, e ti porterei il pane: quello delle celle lo conosco.', { tono: 1 }, [
          ginepra('Ah ah, è vero, tu ci sei già stata! Allora portami anche una coperta, e un pettine. E dimmi che da lì si esce, perché tu ne sei uscita.'),
        ], { flag: 'fire.promised', trust: { ginepra: 1 }, tag: '[Ci sei passata]' }),
      ),
      IF(BOLD, [ginepra('Sai cosa mi piace di te? Che dove io mi butto, tu ti butti lo stesso, solo senza gridare. In due così non ci ferma nessuno, oppure ci fermano subito.')]),
      IF(CAREFUL, [ginepra('Tu prima di fare un passo guardi dove metti il piede, l\'ho capito. Va bene così: una delle due deve pur arrivare intera.')]),
      ginepra('C\'è un\'altra cosa. A ottobre i conestabili mi hanno preso il mazzo, tutto intero, ed è chiuso nel deposito del tribunale insieme a quelli delle altre. Io lo rivoglio, e so da dove si entra.'),
      choice(
        o('Prima di tutto dimmi da dove si entra.', { guida: -1 }, [
          ginepra('Dalla porta laterale, quella della legna, che ha il chiavistello rotto da quando c\'era il vecchio custode. Vedi che almeno questo l\'ho studiato?'),
        ]),
        o('Ginepra, è un mazzo di carte. Ne vale la pena?', { rischio: -1 }, [
          ginepra('È il mazzo di mia nonna, e ha ancora l\'odore della sua cucina. Lo so che è una sciocchezza, ma è la mia sciocchezza e ci tengo.'),
        ]),
      ),
      ginepra('Una di queste notti mi trovi davanti al tribunale. Prima però ripassiamo le carte, tutte e due, perché là dentro se ci prendono fanno domande. Pensaci, ma non troppo, che a pensarci troppo si finisce per avere ragione.'),
      IF({ power: 'cat' }, [cat('(È un\'idea pessima, e il guaio è che detta da lei sembra quasi bella. Io te l\'ho detto; poi fai come credi.)')]),
      diary('Al fuoco Ginepra mi ha letto La Ruota. L\'ha letta malissimo, ed è stata la lettura più bella che mi abbiano mai fatto.'),
      xp(10),
      N('Il fuoco si abbassa, e nelle braci, per un momento, ti sembra di vedere la fiamma di un\'altra candela.'),
      visit,
      step('c2.plan'),
    ], [
      N('Il bivacco è spento, e sotto questi alberi il buio è così fitto che non distingui il sentiero dai cespugli.'),
      IF({ power: 'cat' },
        [cat('(Qui senza un lume non si va avanti, e tu il fuoco non lo sai ancora accendere. Ortica dice che viene da sé, a forza di leggere carte.)')],
        [T('Qui senza un lume non vado avanti, e il fuoco non lo so ancora accendere. Ortica dice che viene da sé, con la pratica.')]),
    ]),
  ],

  // ---- fork 2: the seized deck
  'c2.plan': [
    IF({ majorsMin: 11 }, [
      N('Davanti al tribunale le finestre sono buie. Ginepra ti aspetta nell\'angolo della porta laterale, e batte i piedi per il freddo o per l\'impazienza.'),
      ginepra('Sei venuta davvero! Aspetta: sei venuta per entrare, o sei venuta a dirmi di no? Dalla faccia non si capisce, tu hai sempre la stessa faccia.'),
      IF({ power: 'cat' }, [cat('(Dentro ci sono due guardie. Una dorme e l\'altra ci sta arrivando, ma a me il pelo si è rizzato lo stesso.)')]),
      IF({ flag: 'b1.hid' }, [ginepra('Quella sera in piazza sei sparita sotto il portico e non ti ha vista nessuno, nemmeno io che ti cercavo. Stanotte serve proprio quello.')]),
      IF({ flag: 'b1.spoke' }, [ginepra('In piazza hai parlato davanti a tutto il villaggio, e sei stata magnifica. Stanotte però ti prego: qualunque cosa succeda, non dire una parola.')]),
      IF([{ power: 'cat' }, BOLD], [cat('(Ti conosco, stai già guardando la porta. Io te lo dico lo stesso: è una pessima idea.)')]),
      IF([{ power: 'cat' }, CAREFUL], [cat('(Tu di solito ci pensi due volte, ed è il motivo per cui siamo ancora interi. Pensaci anche stanotte.)')]),
      // the gesture, contrary, and she goes anyway (m10 reversed): the lantern and the bell follow
      N('Ginepra tira fuori dal guanto l\'unica carta che i conestabili non le hanno trovato, la gira contro il muro e resta zitta un momento, cosa che non le capita mai.'),
      ginepra('La Ruota, a testa in giù. La sorte gira contro, dice: un periodo storto. Però dice anche che passa, e il mazzo di mia nonna è là dentro adesso. Io entro lo stesso.'),
      choice(
        o('Vengo con te: fai strada.', { rischio: 1 }, [
          ginepra('Lo sapevo, io! Allora: la porta laterale ha il chiavistello rotto, ma cigola. Sul retro c\'è la finestra della legnaia, che è stretta però non fa rumore. Decidi tu, che io ho già deciso troppo.'),
          choice(
            o('Dalla porta laterale, come avevi pensato tu.', { esplora: -1 }, [
              N('La porta cigola esattamente come aveva detto, per un tempo che vi sembra un\'ora. Dentro però non si muove niente, e Ginepra ti stringe il braccio per non ridere.'),
            ], { flag: 'depot.door' }),
            o('Dalla finestra della legnaia, anche se è stretta.', { esplora: 1 }, [
              N('La finestra è stretta davvero, e ci passate una alla volta, tirandovi dentro per i polsi. Atterri su una catasta di legna, e sotto la finestra, nel fango, resta l\'impronta del tuo stivale.'),
            ], { flag: 'depot.window' }),
            // special answers: the air of the Swords, or the cat sent ahead
            sp('magic', { power: 'stun' }, 'Dalla porta: prima però soffio piano verso la guardia sveglia.', { tono: -1 }, [
              N('Soffi verso lo spiraglio, e nel corridoio la guardia sveglia si ferma a metà di un passo, come chi ha dimenticato perché si era alzato. La porta cigola lo stesso, ma lui non si volta.'),
              ginepra('(Cosa gli hai fatto? No, non dirmelo adesso. Dimmelo dopo, e dimmi anche se si può fare a Ortica quando racconta del mugnaio.)'),
            ], { flag: 'depot.door' }),
            sp('tartufo', { tartufo: 2 }, 'Mando avanti Tartufo, a vedere quale delle due guardie dorme davvero.', { guida: -1 }, [
              N('Tartufo si infila sotto la porta e torna dopo un momento, con l\'aria di chi ha fatto un favore che costerà caro.'),
              cat('(Dormono tutte e due, e una russa. C\'è però un terzo, in fondo, che fa il giro con la lanterna: avete il tempo di un padrenostro, e io non ne conosco di corti.)'),
            ], { flag: 'depot.door' }),
          ),
          cinema(['Il deposito è una stanza lunga, che sa di cera e di carta umida. Sugli scaffali ci sono decine di mazzi, ognuno con un cartellino legato con lo spago.'], null, 'cellar'),
          choice(
            o('Aiuto Ginepra a cercare il suo, e non tocco altro.', { rischio: -1 }, [
              N('Scorrete i cartellini insieme, lei da un capo dello scaffale e tu dall\'altro, finché le vostre dita si incontrano sullo stesso spago.'),
            ]),
            o('Intanto leggo i nomi sugli altri cartellini.', { esplora: 1 }, [
              N('Su uno c\'è scritto «Hale, candelaia», su un altro un nome che non conosci, e su un terzo «Bray, vedova». Quest\'ultimo lo sfili dallo scaffale e te lo metti sotto il mantello, quasi senza deciderlo.'),
            ], { flag: 'depot.bray' }),
          ),
          cinema([
            'Ginepra trova il suo quasi subito, e se lo stringe al petto come si fa con un gatto che era scappato.',
            'Poi, in fondo al corridoio, si accende una lanterna. Qualcuno ha visto due ombre muoversi tra gli scaffali.',
          ], null, 'cellar'),
          IF({ flag: 'depot.window' },
            [ginepra('Corri, dalla finestra, corri! No, dalla finestra non ci passiamo in fretta: dalla porta di dietro! Ah ah, non ridere, cioè, non sto ridendo io, corri!')],
            [ginepra('Corri, dalla porta di dietro, corri! Ah ah, non ridere, cioè, non sto ridendo io, corri!')]),
          N('Correte fino al mercato senza voltarvi, e lì vi dividete. Alle vostre spalle, dalla parte del tribunale, comincia a suonare una campana.'),
          diary('Sono entrata nel deposito del tribunale con Ginepra. Ha ripreso il suo mazzo, ma qualcuno ci ha viste.'),
        ], { flag: 'b2.went', trust: { ginepra: 1 }, tag: tg('m07', 'w') }),
        o('Non vengo, Ginepra. È troppo pericoloso, anche per te.', { rischio: -1 }, [
          ginepra('Va bene così. No, davvero, va bene, non fare quella faccia. Vado da sola e faccio in un momento: sono veloce, lo sai, me l\'hai visto prendere Il Carro.'),
          choice(
            o('Allora resto qui fuori, e ti faccio il palo.', { tono: 1 }, [
              N('Resti nell\'angolo della porta e conti fino a cento, poi ricominci. Alla terza volta, dietro una finestra, si accende una lanterna, e tu fischi più forte che puoi.'),
              N('Ginepra sbuca dalla porta di dietro con qualcosa stretto al petto e ti fa segno di sparire. Vi dividete di corsa, e dalla parte del tribunale comincia a suonare una campana.'),
              diary('Ginepra è entrata nel deposito del tribunale da sola. Io sono rimasta fuori a fare il palo, e quando ho fischiato ha suonato una campana.'),
            ], { flag: 'plan.lookout' }),
            o('Torno verso casa: qui davanti la faccio soltanto scoprire.', { guida: -1 }, [
              N('La guardi infilarsi nella porta laterale e sparire. Aspetti un poco, poi ti avvii verso casa, perché restare lì davanti è il modo più sicuro di farla scoprire.'),
              N('Sei a metà strada quando, dalla parte del tribunale, comincia a suonare una campana.'),
              diary('Ginepra è entrata nel deposito del tribunale da sola. Io sono tornata indietro, e poi ha suonato una campana.'),
            ]),
          ),
        ], { flag: 'b2.stayed', tag: tg('m11', 's') }),
      ),
      IF({ power: 'cat' }, [cat('(Quella campana non mi piace per niente. Torniamo alla capanna, e subito.)')]),
      xp(5),
      step('c2.home'),
    ], [
      T('Davanti al tribunale non c\'è ancora nessuno. Ginepra vuole che prima ripassiamo le carte, e a me ne mancano ancora, di quelle del bosco.'),
      IF({ power: 'cat' }, [cat('(Lei intanto è al bivacco, a ripassare le sue. Finisci di cercare quelle del bosco, e se hai dei doppioni delle piccole portaglieli, che non aspetta altro.)')]),
    ]),
  ],

  // ---- the arrest
  'c2.arrest': [
    bell,
    cinema([
      'Intorno alla tua capanna ci sono delle lanterne, e non le hai accese tu.',
      'Sono tre conestabili, fermi davanti alla porta. Quello in mezzo tiene in mano un foglio chiuso con un sigillo rosso.',
    ], 'village.cottage_door'),
    choice(
      o('Vado dritta alla porta: è casa mia.', { rischio: 1 }, [
        N('Cammini verso le lanterne senza rallentare. I tre si voltano insieme, e quello col foglio ti guarda arrivare come si guarda una che ha risparmiato loro la fatica di cercarla.'),
      ], { flag: 'arrest.front' }),
      o('Mi fermo dietro la legnaia, a guardare.', { rischio: -1 }, [
        N('Dietro la legnaia c\'è già qualcuno, accovacciato al buio, che ti prende la mano e te la stringe forte senza dire niente. Ha un guanto di lana, e trema.'),
        N('Poi un conestabile alza la lanterna da quella parte e ti chiama per nome. La mano ti lascia andare, e tu esci nella luce da sola.'),
      ], { flag: 'arrest.hid' }),
    ),
    IF({ flag: 'b2.went' },
      [cop('Stanotte nel deposito del tribunale sono entrate due persone. Abbiamo seguito le impronte nel fango, e un paio arriva fino a questa porta.')],
      [cop('Stanotte qualcuno è entrato a rubare nel deposito del tribunale. Le impronte nel fango portano da questa parte del villaggio, e da questa parte ci abiti tu.')]),
    IF({ flag: 'depot.window' }, [cop('E sotto la finestra della legnaia del tribunale c\'è l\'impronta di uno stivale piccolo, da ragazza. Il tuo piede lo misuriamo dopo, con comodo.')]),
    IF({ stat: ['jailed', '>=', 1] }, [cop('E tu nelle nostre celle ci hai già dormito. Per noi non sei una faccia nuova.')]),
    IF({ flag: 'exam1.bray' }, [cop('E stavolta non tirare in mezzo la vedova Bray, come hai fatto in piazza col mio collega. L\'abbiamo già sentita, e dice che a quell\'ora dormiva.')]),
    IF({ flag: 'lied.constable' }, [cop('La prima sera, al mio collega, hai detto che eri di passaggio e che ripartivi la mattina dopo. Sono passati dei mesi, ragazza, e noi le bugie ce le segniamo.')]),
    cop('Te lo chiedo una volta sola, quindi pensa bene a cosa rispondi. Sei tu la strega della capanna?'),
    choice(
      o('«Sì, sono io.»', { parola: 1, rischio: 1 }, [
        N('Fai per dirlo, e hai già aperto la bocca, quando dal buio dietro la legnaia qualcuno lo dice prima di te.'),
      ], { tag: tg('m11', 's') }),
      o('«Non so di cosa state parlando.»', { parola: -1, rischio: -1 }, [
        N('Il conestabile non ti crede, e fa un passo verso di te. Dal buio dietro la legnaia qualcuno ne fa uno più svelto, e si mette in mezzo.'),
      ], { tag: tg('m18', 'c') }),
      // special answers: neither changes who steps forward
      sp('magic', { power: 'stun' }, 'Soffio piano verso la lanterna di quello col foglio.', { esplora: 1 }, [
        N('La lanterna si spegne, e per un momento il conestabile guarda il foglio senza ricordare che cosa ci sia scritto. Gli altri due però le lanterne le hanno ancora, e uno fa un passo verso di te.'),
        N('Non fa in tempo a farne un secondo, perché dal buio dietro la legnaia qualcuno parla prima di tutti.'),
      ]),
      sp('pop', { pop: 2 }, '«Chiedete in paese chi sono: ve lo dirà mezza Salem.»', { tono: -1 }, [
        cop('L\'abbiamo chiesto, ragazza, ed è proprio questo il guaio: a mezza Salem hai letto le carte, e l\'altra mezza aspetta il suo turno.'),
        N('Fa per aprire il foglio col sigillo, ma dal buio dietro la legnaia qualcuno parla prima di lui.'),
      ], { tag: '[Ti conoscono]' }),
    ),
    ginepra('Sono io.'),
    wait(700),
    cop('Tu? La ragazza di Ortica?'),
    ginepra('Sono io quella che cercate. Lei non c\'entra niente: spacca la legna per Malva e legge le carte alle vedove, e non saprebbe aprire una porta nemmeno con la chiave.'),
    IF({ flag: 'b1.spoke' },
      [ginepra('In piazza hai parlato tu per una che nemmeno conoscevi. Stavolta lascia che parli io per te, che almeno ci conosciamo.')],
      [ginepra('In piazza sei stata zitta, e avevi ragione tu. Fallo anche adesso, ti prego: è l\'unica volta che te lo chiedo.')]),
    IF({ flag: 'fire.promised' }, [ginepra('E ricordati cosa mi hai detto al fuoco, eh. Hai detto «subito», e io me lo ricordo.')]),
    IF({ flag: 'fire.joked' }, [ginepra('Te l\'avevo detto che sarei stata scema come non mai. Vedi che mantengo, ah ah?')]),
    IF({ flag: 'b2.stayed' }, [ginepra('Avevi ragione tu, era troppo pericoloso. Non dirmelo adesso, però: dimmelo quando torno.')]),
    IF({ flag: 'plan.lookout' }, [ginepra('E il tuo fischio l\'ho sentito, sai? È per quello che sono arrivata fin qui prima di loro, quindi il palo l\'hai fatto bene.')]),
    IF({ flag: 'arrest.hid' }, [ginepra('Dietro la legnaia mi hai stretto la mano anche tu, e a me è bastato quello. Adesso stai ferma dove sei.')]),
    IF(BOLD, [ginepra('E non metterti a fare la coraggiosa proprio stanotte, che ti conosco. Per una volta la matta la faccio io, da sola.')]),
    N('La portano via in mezzo alle lanterne. Ride anche adesso, piano, nel momento più sbagliato che potesse scegliere, e si capisce da lontano che ha paura.'),
    choice(
      o('Grido il suo nome, più forte che posso.', { guida: 1 }, [
        N('Lei si volta, ti cerca nel buio e ti fa l\'occhiolino. Poi la strada gira, e le lanterne se la portano dietro le case.'),
      ], { tag: tg('m07', 'w') }),
      o('Stringo i pugni e resto zitta, come mi ha chiesto.', { guida: -1 }, [
        IF({ power: 'cat' },
          [cat('(Hai fatto bene, anche se lo so che ti costa. Adesso serve la testa; per gridare ci sarà tempo quando l\'avremo tirata fuori.)')],
          [T('Mi costa più di quanto pensassi. Ma adesso mi serve la testa: per gridare ci sarà tempo quando l\'avrò tirata fuori.')]),
      ], { tag: tg('m15', 'p') }),
    ),
    IF({ power: 'cat' }, [cat('(Malva e Ortica da sole non bastano, per una cosa così. Ce n\'è una terza, più vecchia di tutte e due, che vive sotto il villaggio. Malva ti aspetta alla botola dietro il tribunale.)')]),
    flag('ginepra.taken'),
    diary('Hanno portato via Ginepra. Ha detto «Sono io» ai conestabili, perché non prendessero me.'),
    xp(10),
    chapterCard(3), // black screen, the title of the chapter that opens (story/chapter.js)
    session('s2'),
    step('c3.trapdoor'),
  ],

  // ---- Ortica in her hut, later in chapter 2 and after
  'ortica.chat': [
    IF({ flag: 'ginepra.taken' },
      [ortica('L\'hanno presa, lo so, lo sa tutto il bosco, e stavolta giuro che non l\'ho detto io. Guarda le ortiche lungo il sentiero: sono così arrabbiate che pungono il doppio.')],
      [IF({ flag: 'fire.promised' },
        [ortica('Ginepra dice che al fuoco le hai promesso una cosa, e non ha voluto dirmi quale. Cioè, me l\'ha detta subito, ma le ho promesso di fare finta di niente.')],
        [ortica('Il mugnaio giura che la ruota del mulino gira al contrario. Sua moglie dice che è lui che beve. Io li ho ascoltati tutti e due per un pomeriggio, e non ho ancora deciso.')])]),
    IF([{ flag: 'mill.honest' }, { notFlag: 'mill.paid' }], [
      ortica('Le quattro monete del mugnaio me le hai portate davvero! In trent\'anni non mi era mai tornato indietro un soldo da quel mulino, e adesso ho una storia nuova da raccontare.'),
      ortica('Tienine sei, e non discutere: due sono per l\'onestà, che da queste parti va pagata meglio della furbizia, altrimenti non la pratica più nessuno.'),
      coins(6), trust('ortica', 1), setFlag('mill.paid'),
    ]),
    IF({ level: 7 }, [ortica('Adesso che sei una strega fatta dovrei stare zitta e ascoltare te. Ci provo, eh. Comincia pure tu, che io resisto finché posso.')]),
    IF([{ power: 'broom' }, { flag: 'lesson.fly' }, { notFlag: 'ortica.broom' }], [
      ortica('Ti ho vista passare sopra i faggi a cavallo della scopa! Io la mia non la uso più da quando ho perso il cappello sopra il mulino, ma tu vai, vai: dall\'alto il bosco è tutto un altro pettegolezzo.'),
      flag('ortica.broom'),
    ]),
    IF(CURIOUS, [ortica('Mi dicono che non c\'è sentiero del bosco dove tu non abbia messo il naso. Mi sembra di rivedere me a vent\'anni, soltanto più silenziosa.')]),
    choice(
      o('Mi ripeti come si leggono le tre carte?', null, [
        ortica('La prima dice da dove viene la faccenda, la seconda come sta adesso, la terza dove sta andando. Te l\'ho detto quaranta volte e questa fa quarantuno, ma io le cose le ripeto volentieri.'),
      ]),
      o('Raccontami qualcosa che non dovrei sapere.', null, [
        ortica('Allora: il becchino ha paura dei gatti, la Torre è finita nelle cantine sotto il villaggio, e Malva quando è sola canta. Ha anche una bella voce, ma se glielo dici nega.'),
        ortica('E nel folto, dove non va nessuno, c\'è una lanterna accesa che nessuno tiene in mano. Dicono che l\'abbia lasciata un vecchio che cercava qualcosa da solo, e che faccia luce anche a chi passa dopo di lui.'),
        flag('side.m09'),
        IF({ notFlag: 'ortica.gossip' }, [trust('ortica', 1), flag('ortica.gossip')]),
      ]),
      o('Nel folto del bosco c\'è una nebbia che mi ha riportata indietro: che cos\'è?', null, [
        ortica('Ah, quella nebbia lì! È vecchia, sta lì da prima di me. Si apre soltanto con l\'aria, che è la magia delle Spade, e l\'aria si fa aspettare: prima vengono il fuoco dei Bastoni e l\'acqua delle Coppe.'),
        ortica('Io ci ho messo undici anni, ma io parlavo troppo e mi mancava il fiato. A te verrà quando sarai una strega fatta, e allora con un soffio sposterai la nebbia, e anche qualche conestabile.'),
      ], { when: { flag: 'fog.lost' } }),
      // special answers: what the wood looks like from above, and a Strega who makes her listen
      sp('broom', [{ power: 'broom' }, { flag: 'lesson.fly' }], 'Dall\'alto ho visto il bosco intero: dimmi tu che cosa mi è sfuggito.', null, [
        ortica('Dall\'alto si vede tutto tranne quello che conta, perché le carte stanno sotto le foglie! Però hai fatto bene a chiedere, che io il bosco lo conosco dal basso, sasso per sasso.'),
        IF({ lacks: 'm08' },
          [ortica('Allora ti dico della tana, a nord della mia capanna, dove il sentiero finisce. Dentro c\'è una carta con una donna che chiude la bocca a un leone con due dita, senza bisogno di gridare.')],
          [IF({ lacks: 'm14' },
            [ortica('Allora ti dico della fonte, in alto a levante, oltre lo stagno. Sul bordo c\'è una carta con un angelo che versa l\'acqua da una coppa all\'altra, e non ne perde una goccia.')],
            [ortica('Per la verità non ti è sfuggito niente, perché le carte grosse che so io le hai già trovate tutte. Restano le piccole nell\'erba, e di quelle non tiene il conto nessuno.')])]),
      ]),
      sp('rank', { title: 'strega' }, 'Stavolta siediti tu, Ortica: ti racconto io una cosa.', null, [
        ortica('A me, una storia? Aspetta che mi siedo, perché l\'ultima volta che qualcuno mi ha raccontato qualcosa ero in piedi, e mi sono dovuta appoggiare al muro.'),
        IF({ notFlag: 'ortica.listened' }, [
          ortica('Ho ascoltato fino in fondo e non ti ho interrotta nemmeno una volta. Va bene, due, ma la seconda era per darti ragione. Tieni questa bottiglia, che l\'ho tappata io: con lei addosso i conestabili guardano altrove.'),
          tool('bottle', 1), trust('ortica', 1), flag('ortica.listened'),
        ], [
          ortica('Ho ascoltato fino in fondo anche stavolta, e comincio a prenderci gusto. Non dirlo al merlo, però, che poi lo racconta a tutto il bosco e mi rovina la fama.'),
        ]),
      ]),
    ),
  ],

  // ---- the thick fog of the deep wood (and of the swamp): the world plays this when it brings her back
  'fog.lost': [
    N('Fai dieci passi dentro la nebbia, e non distingui più gli alberi dal cielo. Cammini convinta di andare dritta, e quando la nebbia si apre sei di nuovo nel punto da cui eri entrata.'),
    IF({ power: 'cat' },
      [cat('(Abbiamo girato in tondo come due galline. Questa nebbia non si attraversa a piedi: ci vuole un fiato che la sposti, e tu quel fiato non ce l\'hai ancora.)')],
      [T('Ho girato in tondo senza accorgermene. Questa nebbia non si attraversa a piedi: ci vorrebbe qualcosa che la sposti, e io non ce l\'ho ancora.')]),
    flag('fog.lost'),
  ],
};
