// Chapter 2, the forest in spring: Ortica and the three cards, the errand to the mill (the third and
// last), the campfire night with Ginepra, the seized deck (fork 2), the arrest at the cottage ("Sono io.").
// Also: Ortica at home, and the thick fog of the deep wood that sends her back.
import {
  bell, N, T, ortica, ginepra, cat, cop, o, tg, choice, IF, xp, coins, flag, diary, step, draw, teach, lesson,
  session, cinema, wait, trust, visit,
} from '../h.js';

const CURIOUS = { trait: ['esplora', '>=', 3] };
const STRAIGHT = { trait: ['esplora', '<=', -3] };
const BOLD = { trait: ['rischio', '>=', 3] };
const CAREFUL = { trait: ['rischio', '<=', -3] };

export const C2 = {
  'c2.ortica': [
    N('La capanna di Ortica è mezza casa e mezza cespuglio. Dal tetto pendono mazzi di erbe, e dalla porta aperta esce una voce che stava parlando da sola da prima che tu arrivassi.'),
    ortica('Eccoti, sei la ragazza di Malva! Ti aspettavo per ieri, ma ieri pioveva, e poi il merlo mi ha detto che avevi da fare in paese, e il merlo di solito è bene informato.'),
    IF({ flag: 'malva.wood' }, [ortica('Malva dice che spacchi la legna storta. Detto da lei è un complimento grosso, sai: di me in trent\'anni ha detto soltanto che parlo.')]),
    IF({ flag: 'malva.cheeky' }, [ortica('Malva mi ha raccontato delle tue mani delicate, e mentre lo raccontava ha riso. Malva che ride! L\'ultima volta che è successo c\'era ancora il vecchio pastore.')]),
    IF({ flag: 'b1.spoke' },
      [ortica('E in piazza hai parlato per la Hale, lo sa tutto il bosco. Gliel\'ho detto io, per la verità, ma l\'avrebbero saputo lo stesso.')],
      [ortica('E in piazza sei stata zitta, mi dicono. Io non ci sarei riuscita nemmeno con un sasso in bocca, quindi non sarò certo io a farti la predica.')]),
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
    ),
    ortica('Prima però dimmi una cosa tu, che ormai sei una fattucchiera e in paese ci hai passato l\'inverno. La Hale, secondo te, c\'entrava qualcosa con quegli spilli?'),
    choice(
      o('No. Era una vecchia con una cesta di candele, e basta.', { parola: 1 }, [
        ortica('Lo penso anch\'io, e mi fa piacere sentirlo da una che c\'era. Io lo dico da mesi, ma io dico tante di quelle cose che ormai non mi contano più.'),
      ]),
      o('Non lo so. Io ho visto soltanto una ragazza che tremava davvero.', { guida: 1 }, [
        ortica('Ecco, questa è una risposta da fattucchiera: hai guardato anche l\'altra. Quella ragazza trema sul serio, e nessuno in paese si domanda di che cosa.'),
      ]),
    ),
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
    diary('Ortica mi ha insegnato a leggere il tempo in tre carte, e intanto mi ha raccontato mezzo bosco. Mi ha chiesto di portare un unguento al mulino.'),
    xp(5),
    N('Mentre Ortica continua a parlare ti si chiudono gli occhi un momento, e dietro le palpebre c\'è la luce di una candela che conosci.'),
    visit,
    step('c2.mill'),
  ],

  // ---- errand 3, the last: the mill (the miller speaks through the narrator)
  'c2.mill': [
    N('Il mulino sta sul torrente e si sente da lontano, perché la ruota cigola a ogni giro. Il mugnaio è fermo lì davanti e la guarda come si guarda un figlio che ha preso una brutta strada.'),
    N('«Ti manda Ortica con l\'unguento? Era ora, ho le ginocchia che scricchiolano più della ruota. Di solito viene lei e ci mette due ore, perché prima deve raccontarmi tutto il bosco.»'),
    N('«Guardala, quella ruota: da un mese gira al contrario. Mia moglie dice che sono io che bevo. Ma questo mulino l\'ha tirato su mio nonno con le pietre della vecchia chiesa, e da allora fa quello che gli pare.»'),
    choice(
      o('«Avete ragione voi: gira proprio al contrario.»', { tono: 1 }, [
        N('«Lo vedi che lo dicevo io?» Per festeggiare ti offre un sorso dalla fiaschetta, e dall\'odore capisci che è meglio non sapere cosa c\'è dentro.'),
      ], { tag: tg('m10', 'w') }),
      o('«Mi sa che ha ragione vostra moglie.»', { parola: 1 }, [
        N('«Anche tu, adesso?» Sospira, guarda la ruota ancora un momento e poi posa la fiaschetta sul muretto.'),
      ], { tag: tg('m11', 's') }),
    ),
    N('«Per il disturbo ti racconto una cosa. Giù allo stagno c\'è un salice dove da ragazzi ci appendevamo per i piedi, a guardare il mondo capovolto. Su un ramo è rimasta una carta, con uno appeso proprio così.»'),
    N('«Ha la faccia tranquilla, quello lì, come uno che ha smesso di agitarsi e aspetta di capire. Da sotto in su le cose sembrano diverse, e qualche volta più chiare.»'),
    flag('side.m12'),
    IF({ lacks: 'm10' }, [N('«E qui tra le pale, ogni tanto, ne vedo girare un\'altra insieme alla ruota. Se riesci a prenderla senza bagnarti, è tua.»')]),
    N('Ti conta in mano quattro monete, due volte. «Sarebbero per Ortica. Anzi no, tienile tu, che lei mi deve ancora tre storie lasciate a metà.»'),
    coins(4),
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
        ], { trust: { ginepra: 1 }, tag: tg('m14', 'c') }),
      ),
      cinema(['Il fuoco adesso scalda davvero. Ginepra resta sul tronco e tu ti siedi per terra, con le ginocchia tra le braccia, e per un po\' nessuna delle due dice niente.'], 'forest.campfire'),
      IF({ level: 7 }, [ginepra('Ortica dice che ormai sei una strega fatta e che dovrei darti del voi. Ah ah, non ci penso nemmeno.')]),
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
      ),
      IF(BOLD, [ginepra('Sai cosa mi piace di te? Che dove io mi butto, tu ti butti lo stesso, solo senza gridare. In due così non ci ferma nessuno, oppure ci fermano subito.')]),
      IF(CAREFUL, [ginepra('Tu prima di fare un passo guardi dove metti il piede, l\'ho capito. Va bene così: una delle due deve pur arrivare intera.')]),
      ginepra('C\'è un\'altra cosa. A ottobre i conestabili mi hanno preso il mazzo, tutto intero, ed è chiuso nel deposito del tribunale insieme a quelli delle altre. Io lo rivoglio, e so da dove si entra.'),
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
      choice(
        o('Vengo con te: fai strada.', { rischio: 1 }, [
          cinema([
            'Il deposito è una stanza lunga, che sa di cera e di carta umida. Sugli scaffali ci sono decine di mazzi, ognuno con un cartellino legato con lo spago.',
            'Ginepra trova il suo quasi subito, e se lo stringe al petto come si fa con un gatto che era scappato.',
            'Poi, in fondo al corridoio, si accende una lanterna. Qualcuno ha visto due ombre muoversi tra gli scaffali.',
          ], null, 'cellar'),
          ginepra('Corri, dalla porta di dietro, corri! Ah ah, non ridere, cioè, non sto ridendo io, corri!'),
          N('Correte fino al mercato senza voltarvi, e lì vi dividete. Alle vostre spalle, dalla parte del tribunale, comincia a suonare una campana.'),
          diary('Sono entrata nel deposito del tribunale con Ginepra. Ha ripreso il suo mazzo, ma qualcuno ci ha viste.'),
        ], { flag: 'b2.went', trust: { ginepra: 1 }, tag: tg('m07', 'w') }),
        o('Non vengo, Ginepra. È troppo pericoloso, anche per te.', { rischio: -1 }, [
          ginepra('Va bene così. No, davvero, va bene, non fare quella faccia. Vado da sola e faccio in un momento: sono veloce, lo sai, me l\'hai visto prendere Il Carro.'),
          N('La guardi infilarsi nella porta laterale e sparire. Aspetti un poco, poi ti avvii verso casa, perché restare lì davanti è il modo più sicuro di farla scoprire.'),
          N('Sei a metà strada quando, dalla parte del tribunale, comincia a suonare una campana.'),
          diary('Ginepra è entrata nel deposito del tribunale da sola. Io sono tornata indietro, e poi ha suonato una campana.'),
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
    IF({ flag: 'b2.went' },
      [cop('Stanotte nel deposito del tribunale sono entrate due persone. Abbiamo seguito le impronte nel fango, e un paio arriva fino a questa porta.')],
      [cop('Stanotte qualcuno è entrato a rubare nel deposito del tribunale. Le impronte nel fango portano da questa parte del villaggio, e da questa parte ci abiti tu.')]),
    IF({ stat: ['jailed', '>=', 1] }, [cop('E tu nelle nostre celle ci hai già dormito. Per noi non sei una faccia nuova.')]),
    cop('Te lo chiedo una volta sola, quindi pensa bene a cosa rispondi. Sei tu la strega della capanna?'),
    choice(
      o('«Sì, sono io.»', { parola: 1, rischio: 1 }, [
        N('Fai per dirlo, e hai già aperto la bocca, quando dal buio dietro la legnaia qualcuno lo dice prima di te.'),
      ], { tag: tg('m11', 's') }),
      o('«Non so di cosa state parlando.»', { parola: -1, rischio: -1 }, [
        N('Il conestabile non ti crede, e fa un passo verso di te. Dal buio dietro la legnaia qualcuno ne fa uno più svelto, e si mette in mezzo.'),
      ], { tag: tg('m18', 'c') }),
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
    IF({ level: 7 }, [ortica('Adesso che sei una strega fatta dovrei stare zitta e ascoltare te. Ci provo, eh. Comincia pure tu, che io resisto finché posso.')]),
    IF([{ power: 'broom' }, { notFlag: 'ortica.broom' }], [
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
