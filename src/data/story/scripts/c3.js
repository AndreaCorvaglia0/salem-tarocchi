// Chapter 3, the dark in autumn: the trapdoor (the rank of Strega), Nonna Edera and the Celtic cross,
// the council of the three mistresses, where she decides the plan and gives each her task (fork 3: by
// the cellars or in the open), the jail or the court door.
import {
  bell, N, T, malva, ortica, edera, ginepra, cat, judge, o, tg, choice, IF, xp, flag, diary, step, chapter, travel,
  draw, teach, lesson, cinema, goto, trust, visit, sp, coins, tool,
} from '../h.js';

// the hidden Majors of the cellars (Il Sole, Il Giudizio, Il Mondo come from the story)
export const DEPTHS_POOL = ['m15', 'm16', 'm17', 'm18'];

const KIND = { trait: ['tono', '>=', 3] };
const SHARP = { trait: ['tono', '<=', -3] };

export const C3 = {
  // ---- the trapdoor: Malva takes down only a Strega
  'c3.trapdoor': [
    IF({ level: 7 }, [
      N('Malva ti aspetta accanto a una botola di legno, dietro il tribunale, con la lanterna schermata dallo scialle. Non ti saluta: solleva il coperchio e ti guarda.'),
      IF({ flag: 'gate2.refused' },
        [malva('L\'altra volta ti ho fermata e ti è bruciato, l\'ho visto. Guardati adesso: sei una strega fatta, e là sotto ci scendi a testa alta.')],
        [malva('Ho saputo tutto stanotte, quindi risparmiami il racconto, che mi va il sangue alla testa. Sei una strega fatta, ormai, e là sotto ci puoi scendere.')]),
      // the gesture (m08 upright): she lifts the lid
      N('Sul coperchio della botola c\'è una carta girata, e Malva la tiene ferma con due dita perché il vento non se la porti.'),
      malva('L\'ho chiesto prima che arrivassi, ed è uscita La Forza, dritta: coraggio gentile, di quello che doma con la pazienza. Con una carta così si scende, e si scende stanotte.'),
      malva('Ti è venuta anche l\'aria, lo vedo da come ti si muove il mantello. È la magia delle Spade: basta un soffio, e un conestabile per un po\' non sa più dove stava andando.'),
      malva('Una volta ti avrei mandata a comprarmi l\'incenso. Adesso sei tu che dovresti dire a me cosa serve, e la cosa non mi dispiace quanto pensavo.'),
      IF({ flag: 'malva.cheeky' }, [malva('Tieniti forte alla scala con quelle mani delicate, che i pioli sono bagnati.')]),
      malva('Ginepra è una sciocca, e lo dico con tutto il bene che le voglio. Però si è fatta avanti per un\'altra, e una così a quel signore del tribunale non la lascio.'),
      IF({ flag: 'b2.stayed' }, [malva('So anche che tu al deposito non ci sei voluta andare. Hai fatto bene, e non pensare nemmeno per un momento che sia colpa tua.')]),
      IF({ flag: 'b2.went' }, [malva('So anche che al deposito c\'eri pure tu. Non ti dico niente, perché alla tua età ci sarei andata anch\'io.')]),
      IF({ flag: 'depot.bray' }, [
        malva('E stamattina la vedova Bray ha trovato il suo mazzo sul davanzale, legato con lo spago del tribunale. Non ha chiesto chi ce l\'ha messo, ma mi ha lasciato queste per te.'),
        coins(6),
      ]),
      IF({ flag: 'plan.lookout' }, [malva('Mi dicono che quella notte davanti al tribunale qualcuno ha fischiato. Chi resta fuori a fare il palo rischia quanto chi entra, e se lo ricorda più a lungo.')]),
      choice(
        o('Grazie, Malva: da sola non avrei saputo da dove cominciare.', { tono: 1 }, [
          malva('Te l\'ho detto mille volte che ringraziare porta male, e tu niente. Scendi, va\', che è tardi.'),
          N('Però, alla luce della lanterna, l\'angolo della bocca le si alza appena, e fa in tempo a voltarsi prima che tu possa dirglielo.'),
        ], { trust: { malva: 1 }, tag: tg('m03', 'c') }),
        o('Chi c\'è, là sotto?', { esplora: 1 }, [
          malva('C\'è Edera, che è più vecchia del villaggio e più elegante di tutte noi messe insieme. Ti chiamerà con un nome che non è il tuo: lasciala fare, che tutto il resto se lo ricorda benissimo.'),
        ], { tag: tg('m02', 's') }),
        // special: she makes her own light, and Malva stays up
        sp('magic', { power: 'fire' }, 'Tieni pure la lanterna, Malva: la luce me la faccio io.', { rischio: 1 }, [
          malva('La fiammella sul palmo, davanti a me, come una che l\'ha sempre avuta. Va bene, la lanterna la tengo io, così in paese vedono una levatrice che prende aria e basta.'),
        ], { flag: 'trapdoor.light' }),
      ),
      IF({ flag: 'trapdoor.light' },
        [malva('Io resto quassù, allora, perché in paese qualcuno deve far finta di niente. Tu vai avanti finché trovi la nicchia di Edera, e non spegnerti per strada.')],
        [malva('Io ti tengo la lanterna fino in fondo alla scala e poi torno su, perché in paese qualcuno deve far finta di niente. Tu vai avanti finché trovi la nicchia di Edera.')]),
      chapter(3),
      travel('depths.entry'),
      bell, // the cellars
      IF({ flag: 'trapdoor.light' }, [
        N('Scendi con la fiammella aperta sul palmo, e la scala di pietra ti viene incontro un gradino alla volta. Sotto c\'è odore di terra bagnata e di vino vecchio, e la tua luce è l\'unica.'),
        diary('Sono scesa sotto il villaggio dalla botola dietro il tribunale, facendomi luce da sola. Malva è rimasta su, con la lanterna in mano.'),
      ], [
        N('La scala è di pietra, umida, e sembra non finire mai. Sotto c\'è odore di terra bagnata e di vino vecchio, e un silenzio così grande che senti il tuo respiro.'),
        diary('Sono scesa sotto il villaggio dalla botola dietro il tribunale. Malva mi ha tenuto la lanterna fino all\'ultimo gradino.'),
      ]),
      xp(5),
      step('c3.edera'),
    ], [
      malva('Ferma dove sei. Là sotto non ci porto una fattucchiera, nemmeno una brava come te. Ci porto una strega fatta, perché nelle cantine il buio è vero e il Giudice le carte le conosce tutte.'),
      malva('Lo so che vorresti scendere stanotte, e a Ginepra ci penso anch\'io a ogni ora. Ma se là sotto ti perdi, poi ne ho due da tirare fuori.'),
      // the gesture, contrary (m12 upright): she waits
      IF({ notFlag: 'gate2.refused' }, [
        N('Malva gira una carta sul coperchio chiuso della botola, e te la mostra senza togliere la mano.'),
        malva('È uscito L\'Appeso, che è una sospensione: dice di arrendersi all\'attesa e di guardare la cosa da un altro lato. Non è la carta che volevo nemmeno io, ma stanotte la botola resta chiusa.'),
      ]),
      malva('Leggi per chi bussa alla capanna, riguardati le carte, cerca quelle del bosco che ti mancano. È questione di giorni, non di mesi, e quando torni non ti chiederò niente: lo vedrò da me.'),
      IF({ notFlag: 'gate2.refused' }, [choice(
        o('Dimmi almeno come sta, se lo sai.', { guida: 1 }, [
          malva('Canta, mi dicono, e stona. Finché canta vuol dire che sta bene, e tu pensa ad arrivare da lei tutta intera.'),
        ]),
        o('Allora torno a studiare, stanotte stessa.', { guida: -1 }, [
          malva('Stanotte dormi, perché a studiare con gli occhi chiusi non ha mai imparato niente nessuno. Da domani, però, sì.'),
        ]),
      )]),
      flag('gate2.refused'),
      IF({ power: 'cat' }, [cat('(Ha ragione lei, anche se mi secca ammetterlo. Qualche lettura fatta bene, qualche carta in più, e la prossima volta quella botola te la apre da sola.)')]),
    ]),
  ],

  'c3.edera': [
    N('Dopo un centinaio di passi la galleria si divide. A sinistra, lontano, c\'è una luce debole e ferma, mentre da destra arriva un rumore d\'acqua che scorre.'),
    choice(
      o('Vado a sinistra, verso la luce.', { guida: -1 }, [
        N('La luce è una candela sola, in una nicchia in fondo alla galleria. Ci siede una donna con i capelli d\'argento raccolti in alto, dritta come una regina, che ti guarda arrivare come se ti avesse già letta.'),
        edera('Vieni avanti, cara. Sei venuta dritta alla candela, come fanno le falene e le persone di buon senso. Tu devi essere la ragazza di cui mi parlava Malva: Rosalba, mi pare.'),
      ], { flag: 'edera.light' }),
      o('Vado a destra, dietro al rumore dell\'acqua.', { guida: 1 }, [
        N('L\'acqua ti porta a un pozzo vecchio, con qualcosa che luccica sul fondo. Di lì una scala sale verso una candela, e accanto alla candela siede una donna con i capelli d\'argento, dritta come una regina.'),
        edera('Vieni avanti, cara. Sei salita dal pozzo, lo sento dal muschio che hai addosso: è la strada lunga, ed è quella che avrei preso io. Tu devi essere la ragazza di Malva: Rosalba, mi pare.'),
      ], { flag: 'edera.well' }),
    ),
    IF({ flag: 'trapdoor.light' }, [edera('Ti ho vista arrivare da lontano, con quella fiammella sul palmo. Quaggiù una luce che cammina da sola non si vedeva da anni, e mi ha fatto piacere.')]),
    choice(
      o('Veramente mi chiamo {name}.', { parola: 1 }, [
        edera('{name}, ma certo, perdonami. È un bel nome, e lo dimenticherò prima di sera. Con le carte non mi succede mai, ed è una fortuna, perché sono le carte che ci servono.'),
      ], { tag: tg('m00', 'w') }),
      o('Rosalba va benissimo.', { tono: 1 }, [
        edera('Sei gentile a non correggermi. Lo so che non ti chiami così, l\'ho capito da come hai sorriso; ma lasciami Rosalba ancora per un poco, che mi ci sono affezionata.'),
      ], { trust: { edera: 1 }, flag: 'edera.rosalba', tag: tg('m02', 'c') }),
    ),
    edera('Malva dice che sei una strega fatta, e si vede da come tieni le spalle. Allora non ti faccio la lezione: ti mostro una cosa che so, e poi mi dirai tu cosa ne pensi.'),
    edera('Io ricordo ogni carta che ho girato in settant\'anni. In compenso non ricordo i nomi delle persone, dove ho posato gli occhiali, e certe mattine nemmeno perché sono scesa quaggiù.'),
    choice(
      o('In settant\'anni, qual è la prima che hai girato?', { esplora: 1 }, [
        edera('Il Sole, cara, a sei anni, sul tavolo di mia nonna. Pensai che fosse soltanto un bambino a cavallo, e per molto tempo ho creduto di avere ragione io.'),
      ]),
      o('Gli occhiali li hai sulla testa, Edera.', { parola: 1 }, [
        edera('Ma guarda, erano lì. Vedi che ho fatto bene a farti scendere? In settant\'anni nessuna me l\'aveva detto così in fretta, e senza ridere.'),
      ]),
    ),
    edera('Prima di tutto, però, prendine una dalle mie. È un\'usanza: chi viene fin qui non deve andarsene a mani vuote.'),
    draw(DEPTHS_POOL, 'Il dono di Edera'),
    edera('Questa che ti mostro si chiama croce: dieci carte, sei in croce e quattro in colonna. Con dieci carte sul tavolo si vede una vita intera, e bisogna avere la pazienza di guardarla tutta prima di parlare.'),
    teach('celtic'),
    lesson('celtic'),
    edera('Bada alla seconda, quella che si mette di traverso sulla prima. È ciò che attraversa la persona in quel momento: qualche volta la sorregge e qualche volta le sbarra il passo, e sta a te capire quale delle due.'),
    edera('Qui invece ti ho copiato i pianeti e i segni di ogni carta, con la mia mano di una volta, quando scrivevo ancora dritto.'),
    lesson('astro'),
    edera('Le altre carte di quaggiù le devi cercare tu, perché con queste gambe io non ci arrivo più. Il Diavolo sta alle catene, la Torre a nord, la Stella in fondo al pozzo e la Luna giù alla palude.'),
    IF({ flag: 'edera.well' }, [edera('Il pozzo è quello da cui sei salita, e quel luccichio sul fondo l\'hai già visto. Sei passata accanto alla Stella senza saperlo, come capita quasi sempre con lei.')]),
    choice(
      o('Quando le trovo te le porto a vedere, una per una.', { tono: 1 }, [
        edera('Davvero lo faresti? Sono vent\'anni che non vedo la Stella da vicino. Portami quella per prima, cara, e io ti preparo qualcosa da portare via.'),
      ], { flag: 'edera.promise' }),
      o('Le cerco io: dimmi soltanto da quale cominciare.', { rischio: -1 }, [
        edera('Dalla Stella, che è la più vicina e la meno pericolosa: il pozzo vecchio è proprio qui sotto. Il Diavolo lascialo per ultimo, perché ha tutta la pazienza che a te manca.'),
      ]),
    ),
    IF({ flag: 'fog.lost' }, [edera('Mi dicono che nel bosco la nebbia ti ha già riportata indietro una volta. Alla palude ce n\'è di uguale, ma adesso hai l\'aria delle Spade, e con un soffio te la togli di torno.')]),
    IF(KIND, [edera('Malva dice che sei gentile con la gente, anche con chi non lo merita. Non lasciartelo togliere: quaggiù la gentilezza è la sola cosa che fa luce senza consumarsi.')]),
    IF(SHARP, [edera('Mi dicono che hai la risposta pronta, e che punge. Da giovane l\'avevo anch\'io; poi ho scoperto che a voce bassa le stesse cose arrivano più lontano.')]),
    edera('Posso chiederti un piacere, cara? Quando mi dimentico un nome, tu ripetilo piano, come se niente fosse, senza farmelo pesare.'),
    choice(
      o('Lo ripeterò volentieri, tutte le volte che serve.', { tono: 1 }, [
        edera('Sei una brava ragazza. C\'è un\'altra, tra noi tre, che quando dimentico qualcosa me lo fa notare ad alta voce. Non ti dico chi è, anche perché in questo momento non me lo ricordo.'),
      ], { trust: { edera: 1 }, tag: tg('m02', 'c') }),
      o('Io i nomi me li scrivo. Potrei scriverli anche per te.', { guida: -1 }, [
        edera('Che idea pratica. Tu scrivi i nomi e io ti detto le carte, e alla fine avremo fatto un libro in due. Purché ti ricordi tu dove l\'hai messo, perché in questo non posso aiutarti.'),
      ], { tag: tg('m09', 'p') }),
      // special: her birth sign, something Edera does not forget
      sp('trait', { hasBirth: true }, 'Legalo a una cosa che ricordi: sono nata sotto il segno {sign}.', { esplora: 1 }, [
        IF({ element: 'Fuoco' }, [edera('Un segno di Fuoco, come i Bastoni. Allora sei quella che arriva e accende, e questo non lo dimentico: il nome andrà e verrà, ma la fiamma me la ricordo.')]),
        IF({ element: 'Acqua' }, [edera('Un segno d\'Acqua, come le Coppe. Allora sei quella che sente prima di capire, e questo non lo dimentico: il nome andrà e verrà, ma l\'acqua me la ricordo.')]),
        IF({ element: 'Aria' }, [edera('Un segno d\'Aria, come le Spade. Allora sei quella che pensa svelta e parla chiaro, e questo non lo dimentico: il nome andrà e verrà, ma il vento me lo ricordo.')]),
        IF({ element: 'Terra' }, [edera('Un segno di Terra, come i Denari. Allora sei quella che costruisce piano e non molla, e questo non lo dimentico: il nome andrà e verrà, ma la terra me la ricordo.')]),
        edera('Vedi, cara, i segni e le carte mi restano. Sono soltanto i nomi di battesimo che scivolano via, e in fondo sono la cosa che una persona ha scelto di meno.'),
      ], { trust: { edera: 1 }, flag: 'edera.sign', tag: '[Il tuo segno]' }),
    ),
    edera('Adesso risali, e la croce provala su qualcuno alla tua capanna. Quando avrai trovato tutte le carte torna quaggiù: ci riuniamo noi tre, e sarai tu a dirci come riprenderci quella ragazza.'),
    diary('Nonna Edera mi chiama Rosalba e non ricorda dove ha messo gli occhiali, però le carte se le ricorda tutte. Mi ha insegnato la croce celtica.'),
    xp(5),
    N('Nel buio delle cantine basta chiudere gli occhi un momento, e la candela che vedi non è più quella di Edera.'),
    visit,
    step('c3.client'),
  ],

  // ---- the council: they listen, she decides (fork 3) and gives each her task
  'c3.coven': [
    IF({ majorsMin: 19 }, [
      cinema([
        'In una sala bassa, sotto il villaggio, tre donne siedono vicine alla luce di una fiamma sola.',
        'Stanno discutendo da prima che tu arrivassi, e da come si guardano si capisce che nessuna è d\'accordo con le altre due.',
      ], 'depths.coven'),
      ortica('Io dico che si passa dalle cantine, che le conosco come casa mia. Si arriva alle celle, si apre, si esce, e intanto che ci siamo si potrebbe anche...'),
      malva('Intanto un bel niente. Tu là sotto cominci a raccontare del mugnaio, e ci sentono fino a Boston.'),
      edera('Il Giudice lo conosco da quando era alto così. Era un bambino educato, che chiedeva sempre permesso, e intanto mangiava le candele della chiesa.'),
      malva('Adesso basta, tutte e tre, me compresa. Là dentro ci va lei, ed è una strega fatta: stiamo zitte e sentiamo cosa ha deciso.'),
      N('Le tre maestre smettono di parlare e si voltano verso di te. È la prima volta, da quando sei a Salem, che aspettano loro una parola tua.'),
      choice(
        o('Edera, dimmi cos\'altro ricordi di lui: può servirmi.', { esplora: 1 }, [
          edera('Che prima di soffiare su una candela sorrideva sempre, come per scusarsi. Lo fa ancora adesso, con le persone. Vedi che quando serve me le ricordo, le cose?'),
        ], { trust: { edera: 1 }, tag: tg('m02', 's') }),
        o('Edera, delle candele parliamo dopo. Adesso serve altro.', { esplora: -1 }, [
          edera('Hai ragione, cara. È che i particolari inutili sono quelli che mi restano meglio in testa, e a una certa età ci si affeziona a quello che resta.'),
        ], { tag: tg('m07', 'w') }),
        // special: she has slept in those cells
        sp('trait', { stat: ['jailed', '>=', 1] }, 'Le celle le conosco, perché ci ho dormito. Ditemi piuttosto dove sta lui, di notte.', { parola: 1 }, [
          malva('Sentila, parla delle celle del tribunale come della sua dispensa. È l\'unica di noi che ci ha dormito, e stasera ci torna utile.'),
          edera('Di notte sta nello studio sopra le celle, cara, con una candela sola. Dorme poco, perché chi spegne tanta gente al buio non ci sta volentieri.'),
        ], { flag: 'coven.cells', tag: '[Ci sei passata]' }),
      ),
      IF({ trust: ['malva', '>=', 2] }, [malva('Io di questa ragazza mi fido. Fa quello che dice e non si lamenta, che è più di quanto si possa dire di noi tre.')]),
      IF({ trust: ['ortica', '>=', 2] }, [ortica('Io mi fido da un pezzo, e l\'ho già detto a tutto il bosco, quindi ormai non posso più tirarmi indietro.')]),
      IF({ trust: ['edera', '>=', 2] }, [edera('Rosalba ha la mano ferma quando gira una carta. Io delle mani mi fido più che delle facce.')]),
      IF({ trait: ['parola', '>=', 3] }, [malva('E poi dice quello che pensa, anche a me. Davanti a quel signore le servirà.')]),
      IF(KIND, [edera('Ed è gentile davvero. Lui la gentilezza la imita così bene che davanti a quella vera, di solito, si confonde.')]),
      // fork 3: the plan is hers
      choice(
        o('Passo dalle cantine, di nascosto, e la porto fuori io.', { rischio: -1, parola: -1 }, [
          ortica('Lo sapevo, io! Cioè, lo speravo tanto che è come se l\'avessi saputo. Ti disegno la strada sul palmo della mano, così non la perdi.'),
          malva('Cammina sui bordi delle gallerie, dove non c\'è ghiaia. E se alle spalle senti una voce gentile, non fidarti.'),
          edera('Le celle sono subito dopo le catene, cara. Il Diavolo sta lì da sempre e non ha nessuna fretta; tu invece non fermarti.'),
          diary('Ho deciso io: passo dalle cantine, e vado a prendere Ginepra di nascosto, dal buio.'),
          step('c3.jail'),
        ], { flag: 'b3.stealth', tag: tg('m18', 'c') }),
        o('Entro dalla porta del tribunale, a viso aperto.', { rischio: 1, parola: 1 }, [
          IF({ flag: 'b1.spoke' },
            [malva('Davanti a tutto il villaggio, come quella sera in piazza. Una volta l\'hai già fatto, e sei ancora qui.')],
            [malva('Davanti a tutto il villaggio. Quella sera in piazza sei stata zitta, e forse era giusto così; stavolta la voce ti servirà tutta.')]),
          edera('Il Giudice ama fare domande più di ogni altra cosa. Tu rispondigli con calma, e meglio di come risponderebbe lui.'),
          ortica('E va bene, dalla porta. Io però mi siedo in terza fila, e se mi scappa da parlare, parlo.'),
          diary('Ho deciso io: entro in tribunale dalla porta, col mio nome, davanti a tutti.'),
          step('c3.court'),
        ], { flag: 'b3.open', tag: tg('m11', 's') }),
      ),
      // the gesture (m11 upright): the council moves
      N('Edera gira una carta sul bordo del calderone, con la mano lenta di chi lo fa da settant\'anni, e la guarda prima di guardare te.'),
      edera('La Giustizia, dritta: verità e conseguenze, e a ognuno il giusto. È la carta che volevo per un tribunale, cara, quindi la strada che hai scelto si può fare.'),
      malva('Allora è deciso. Adesso dicci cosa deve fare ognuna di noi, e fai presto, prima che Ortica ricominci.'),
      choice(
        o('Edera, siediti dove il Giudice ti vede: lui non riesce a guardarti senza tornare bambino.', { guida: 1 }, [
          edera('Mi metterò il vestito buono, e gli sorriderò come quando lo sorprendevo in sagrestia. Vedrai che gli tremerà la penna.'),
        ], { flag: 'coven.watch.edera' }),
        o('Malva, tu stai in fondo all\'aula e non lo perdi d\'occhio un momento.', { guida: -1 }, [
          malva('Quel signore fa paura a mezzo villaggio, ma a me no: ho fatto nascere i suoi nipoti. Stai tranquilla che non gli stacco gli occhi di dosso.'),
        ], { flag: 'coven.watch.malva' }),
      ),
      choice(
        o('Ortica, tu trova le guardie e parlaci finché non si dimenticano che ore sono.', { tono: 1 }, [
          ortica('Mi stai chiedendo di parlare, a me? È la prima volta in trent\'anni che qualcuno me lo chiede, e giuro che non ti deluderò.'),
        ], { flag: 'coven.ortica.talk', trust: { ortica: 1 }, tag: tg('m01', 'c') }),
        o('Ortica, tu porti una scopa per Ginepra al cancello del bosco, e per una volta non lo dici a nessuno.', { tono: -1 }, [
          ortica('La scopa al cancello, e zitta: va bene. Posso farcela, zitta, basta che poi qualcuno mi lasci raccontare com\'è andata.'),
        ], { flag: 'coven.ortica.brooms', tag: tg('m18', 's') }),
        // special: she lets Ortica choose, because Ortica trusts her
        sp('witch', { trust: ['ortica', '>=', 2] }, 'Ortica, tu fai quello che ti riesce meglio: scegli tu, e non dirmelo.', { parola: -1 }, [
          ortica('Scelgo io, e non te lo dico? Questa è la cosa più difficile che mi abbiano mai chiesto, e anche la più bella. Va bene: lo saprai quando succede, come tutti gli altri.'),
        ], { flag: 'coven.ortica.free', tag: '[Ortica si fida]' }),
      ),
      edera('Comunque vada, al processo noi tre saremo in aula con te. Chi di noi ti conosce bene troverà il modo di darti una mano senza farsi notare.'),
      IF({ power: 'cat' }, [
        cat('(Le hai messe in riga tutte e tre, e nessuna ha fiatato. In un modo o nell\'altro finirai davanti al Giudice, però: io le figure me le riguarderei tutte, finché c\'è una candela accesa.)'),
        cat('(A me invece non hai dato nessun compito, e non credere che non me ne sia accorto.)'),
        choice(
          o('Se finisco davanti al Giudice, tu resti fuori, e se va male corri da Malva.', { rischio: -1 }, [
            cat('(Fuori, sul davanzale, a fare la sentinella. È un compito da gatto serio e lo accetto, anche se dalle finestre di quel posto entra una corrente che non ti dico.)'),
          ], { flag: 'coven.cat.out' }),
          o('Se finisco davanti al Giudice, tu vieni con me, sotto il mantello.', { rischio: 1 }, [
            cat('(Sotto il mantello, al buio, senza vedere niente. Va bene, ma sappi che se quel signore alza la voce io le unghie le tiro fuori, e le tue costole sono le più vicine.)'),
          ], { flag: 'coven.cat.in' }),
        ),
      ]),
      xp(10),
      N('Prima di muoverti chiudi gli occhi e respiri a fondo, e nel buio c\'è una candela accesa che ti aspetta.'),
      visit,
    ], [
      edera('Non è ancora il momento, Rosalba. Il Giudice le carte le conosce tutte, una per una, e davanti a lui non puoi permetterti di averne lasciata indietro qualcuna.'),
      edera('Torna quando avrai trovato tutte quelle che si possono trovare. Noi da qui non ci muoviamo: alla nostra età è la cosa che ci riesce meglio.'),
      IF({ power: 'cat' }, [cat('(Sul quaderno hai segnato dove dicono di averle viste, quelle che mancano. E se i conestabili te ne hanno prese, stanno al deposito del tribunale, col tuo nome sul cartellino.)')]),
    ]),
  ],

  // ---- fork 3, by the cellars
  'c3.jail': [
    bell,
    T('Per arrivare alle celle ci sono due strade. Quella delle catene è la più corta, ma il ferro batte contro il muro a ogni corrente d\'aria; quella delle botti fa un giro lungo, in mezzo all\'odore di vino.'),
    choice(
      o('Passo dalle catene, in fretta, come ha detto Edera.', { esplora: -1 }, [
        IF({ lacks: 'm15' }, [N('Tra un anello e l\'altro, appesa a un chiodo, c\'è una carta con una figura cornuta e due persone alla catena. Ti costa non fermarti, e ti riprometti di tornare.')]),
        cinema([
          'Oltre le catene la galleria si stringe e comincia a salire. In fondo c\'è una luce piccola, e qualcuno che canticchia una canzone, stonando.',
          'Le celle del tribunale sono lì, dietro una grata arrugginita. La voce che canta la riconosceresti anche al buio.',
        ], null, 'cellar'),
        ginepra('Ti ho sentita arrivare dalle catene, sai? Hanno suonato tutte insieme, come le campane a Pasqua. Per fortuna qui le guardie hanno il sonno pesante.'),
      ], { flag: 'jail.chains' }),
      o('Faccio il giro dalle botti, anche se è più lungo.', { esplora: 1 }, [
        cinema([
          'Dietro le botti la galleria fa due gomiti e poi sale. In fondo c\'è una luce piccola, e qualcuno che canticchia una canzone, stonando.',
          'Le celle del tribunale sono lì, dietro una grata arrugginita. La voce che canta la riconosceresti anche al buio.',
        ], null, 'cellar'),
        ginepra('Da dove sei sbucata? Non ti ho sentita per niente, e sì che ho l\'orecchio fino. Sai di vino come il sagrestano la domenica, però.'),
      ], { flag: 'jail.barrels' }),
    ),
    IF({ flag: 'coven.ortica.talk' }, [N('Da qualche parte sopra di voi si sente Ortica, che sta raccontando del mugnaio a due guardie. Fino all\'alba non le lascerà andare.')]),
    IF({ flag: 'coven.ortica.free' }, [N('Da qualche parte sopra di voi cade qualcosa di grosso, e una voce che conosci chiede scusa molto a lungo. Qualunque cosa Ortica abbia scelto di fare, la sta facendo adesso.')]),
    ginepra('Sei venuta davvero! Lo sapevo, io. Cioè, lo speravo, che per me è la stessa cosa. Hai visto che so stare in prigione? Ho anche fatto amicizia con un topo.'),
    IF({ flag: 'fire.taught' }, [ginepra('Ho anche acceso un fuoco, sai, con due sassi e la paglia, come mi hai fatto vedere tu al bivacco. Il carceriere non ha gradito, ma io sì.')]),
    IF({ flag: 'arrest.hid' }, [ginepra('Qui dentro ho ripensato a quando mi hai stretto la mano dietro la legnaia. Mi ha tenuto compagnia più del topo, e il topo è simpatico.')]),
    IF({ flag: 'fire.promised' }, [ginepra('Al fuoco avevi detto «subito». Non è stato proprio subito, ma qui dentro il tempo passa strano, quindi vale lo stesso.')]),
    IF({ flag: 'fire.joked' }, [ginepra('Avevi detto che dipendeva da quanto ero stata scema. Si vede che sono stata scema abbastanza.')]),
    choice(
      o('Parla piano, che adesso provo ad aprire.', { guida: -1 }, [
        N('La serratura è vecchia quanto la grata. Cede al terzo tentativo, con un cigolio così lungo che vi guardate tutte e due senza respirare.'),
      ], { tag: tg('m01', 'w') }),
      o('Prima dimmi come stai.', { guida: 1 }, [
        ginepra('Sto bene, davvero. Il pane è di pietra e il topo l\'ho chiamato Giudice, perché mangia le candele, ah ah. Dai, apri, che se continuo a parlare mi metto a piangere.'),
        N('Ti metti al lavoro sulla serratura, che alla fine cede con un cigolio lunghissimo.'),
      ], { trust: { ginepra: 1 }, tag: tg('m14', 'c') }),
      // special answers: four other ways to open the same grate, without that creak
      sp('magic', { power: 'move' }, 'Chiedo ai cardini di farsi da parte, come si chiede a una pietra.', { esplora: -1 }, [
        N('Posi la mano sul ferro e glielo chiedi piano, come hai imparato a fare con le radici. I cardini escono dal muro senza un rumore, e la grata si apre da sola, dalla parte sbagliata.'),
        ginepra('Ma l\'hai aperta dai cardini! Ah ah, e io che in due giorni ho consumato una forcina sulla serratura. Insegnamelo, eh, appena siamo fuori di qui.'),
        xp(5),
      ], { flag: 'jail.hinges' }),
      sp('tartufo', { tartufo: 2 }, 'Mando Tartufo a prendere le chiavi dal chiodo, in fondo al corridoio.', { rischio: 1 }, [
        N('Tartufo sparisce nel buio senza fare domande. Torna dopo un momento con l\'anello delle chiavi tra i denti, e lo posa ai tuoi piedi come poserebbe un topo.'),
        cat('(La guardia dorme con la bocca aperta, e le chiavi stavano appese sopra la sua testa. Non ringraziarmi adesso, che i conti li facciamo a casa.)'),
        xp(5),
      ], { flag: 'jail.keys' }),
      sp('witch', [{ flag: 'coven.ortica.talk' }, { trust: ['ortica', '>=', 2] }], 'Fischio piano verso la scala, come mi ha insegnato Ortica.', { tono: 1 }, [
        N('Dall\'alto arriva la voce di Ortica, che chiede a una guardia di farle vedere com\'è fatto un mazzo di chiavi. Un momento dopo l\'anello scende dalla grata dell\'aria, legato a un filo d\'erba.'),
        ginepra('Quella è Ortica, la riconosco dal nodo, che li fa tutti storti! Ah ah, apri, svelta, prima che ricominci a raccontare e si dimentichi di noi.'),
        xp(5),
      ], { flag: 'jail.ortica' }),
      sp('pop', { pop: 2 }, 'Busso piano alla porta del carceriere: a sua moglie ho letto le carte.', { parola: 1 }, [
        N('Il carceriere apre uno spiraglio, ti riconosce e resta un momento a pensare. Poi stacca una chiave dall\'anello, te la mette in mano e richiude la porta, come se non ti avesse vista.'),
        ginepra('Ti ha dato la chiave così, senza una parola? Ah ah, io qui dentro ho fatto amicizia con un topo, e tu là fuori con mezza Salem.'),
        xp(5),
      ], { flag: 'jail.jailer' }),
    ),
    N('Alle vostre spalle qualcuno si schiarisce la voce. È una voce gentile, di quelle che chiedono scusa prima ancora di disturbare.'),
    judge('Buonasera a voi, signorine. Non correte, ve ne prego: questi gradini sono bagnati, e mi dispiacerebbe se una di voi si facesse male.'),
    judge('Due ragazze nelle mie celle in piena notte, e una delle due dalla parte sbagliata della grata. Ne parleremo domattina in aula, con calma e alla luce del giorno.'),
    choice(
      o('Mi metto davanti a Ginepra, tra lei e la scala.', { rischio: 1 }, [
        judge('Che gesto generoso, signorina. Lo terrò presente domattina, anche se non le prometto che andrà a suo favore.'),
      ]),
      o('«Buonasera a voi, signor Giudice.»', { parola: -1 }, [
        judge('Vede che tra persone educate ci si intende subito, perfino in una cantina? Mi fa piacere, perché domani avremo molto da dirci.'),
      ]),
    ),
    IF({ power: 'cat' }, [cat('(Ho il pelo dritto dalla testa alla coda, compreso quello che non sapevo di avere. Questo fa più paura di tutti i conestabili messi insieme.)')]),
    diary('Sono arrivata alle celle passando dalle cantine. Il Giudice ci aspettava in cima alla scala, gentilissimo.'),
    travel('court.dock'),
    xp(5),
    step('c3.trial'),
    goto('c3.trial'),
  ],

  // ---- fork 3, in the open
  'c3.court': [
    IF({ flag: 'coven.ortica.free' }, [N('Davanti al tribunale c\'è un carretto di ortiche rovesciato in mezzo alla strada, e tutte le guardie intorno che si grattano le mani. Di Ortica non c\'è traccia, e tu passi senza che nessuno ti guardi.')]),
    IF({ flag: 'coven.ortica.talk' }, [N('Alla porta del tribunale le guardie non ti fermano nemmeno: Ortica le ha messe in un angolo, e sta raccontando loro del mugnaio dall\'inizio.')]),
    cinema([
      'È mattina presto, e il tribunale è già pieno fino in fondo. La luce entra dalle finestre alte e cade sul banco del Giudice.',
      'Ginepra è in piedi davanti a lui, da sola, con le mani legate. Da qui sembra molto più piccola di come la ricordavi.',
    ], 'court.dock'),
    IF({ flag: 'b1.spoke' },
      [N('Spingi la porta ed entri. Le teste si girano una dopo l\'altra, come quella sera in piazza, e anche stavolta guardano te.')],
      [N('Spingi la porta ed entri. Le teste si girano una dopo l\'altra, e stavolta non c\'è nessun portico sotto cui ripararsi: guardano te.')]),
    choice(
      o('«Mi chiamo {name}. Se dovete processare qualcuno, processate me.»', { parola: 1, guida: -1 }, [
        judge('Che pensiero gentile, signorina. Si accomodi pure accanto alla sua amica: per le persone di buona volontà una sedia in più l\'abbiamo sempre.'),
      ], { tag: tg('m11', 's') }),
      o('«Lei non c\'entra. La strega della capanna sono io.»', { guida: 1, rischio: 1 }, [
        judge('Lo so, signorina, lo sapevo dalla prima sera. Ma è molto più bello sentirselo dire, e la ringrazio di avermi risparmiato la fatica di dimostrarlo.'),
      ], { tag: tg('m07', 'w') }),
      // special answers: someone she read for speaks up; she names her own card
      sp('pop', { flag: 'client.c3.cook.done' }, 'Prima di parlare cerco tra la gente la cuoca del Giudice.', { esplora: 1 }, [
        N('La cuoca è in piedi vicino alla porta delle cucine, con la cuffia bianca. Quando ti vede fa di sì con la testa, e dice forte, a chi le sta intorno, che quella ragazza le ha letto le carte e ha visto giusto.'),
        judge('Vedo che lei ha delle amicizie perfino nella mia cucina, signorina. Questo spiega il caffè di stamattina, che era freddo, e mi dispone male.'),
        T('«Mi chiamo {name}, e sono io la strega della capanna.» Lo dico guardando la cuoca, perché è più facile che guardare lui.'),
      ], { flag: 'court.cook', tag: '[Hai letto per lei]' }),
      sp('trait', { not: { yourCard: 'm00' } }, '«Mi chiamo {name}. La mia carta è {yourCard}, e non l\'ho mai nascosta.»', { parola: 1, rischio: 1 }, [
        judge('La sua carta è {yourCard}, dunque. La conosco, signorina, come le conosco tutte, e le confesso che per lei avrei scommesso su un\'altra.'),
        N('Dalla terza fila qualcuno soffoca una risata. Il Giudice riordina i fogli due volte, e la seconda non ce n\'era bisogno.'),
      ], { flag: 'court.card', tag: '[La tua carta]' }),
    ),
    ginepra('Tu sei matta, ah ah! Sei entrata dalla porta, davanti a tutti, e io che credevo di essere quella impulsiva.'),
    choice(
      o('Qualcuno doveva pur entrare dalla porta.', { tono: -1 }, [
        ginepra('Ah ah, lo dici come se fosse stata un\'idea normale! Quando usciamo di qui te lo faccio ripetere davanti a Malva, e voglio vedere la sua faccia.'),
      ]),
      o('Stammi vicina, e lascia parlare me.', { tono: 1 }, [
        ginepra('Ti sto vicina, e sto zitta. Cioè, ci provo: se mi scappa da ridere tu dammi un pizzicotto, che funziona quasi sempre.'),
      ]),
    ),
    diary('Sono entrata in tribunale dalla porta e ho detto il mio nome ad alta voce, davanti a tutti.'),
    travel('court.dock'),
    xp(5),
    step('c3.trial'),
    goto('c3.trial'),
  ],

  // the trapdoor after the first descent: down again
  'c3.trapdoor.again': [
    T('Questa è la botola da cui si scende nelle cantine. Sollevo il coperchio e vado giù, tenendomi bene alla scala.'),
    travel('depths.entry'),
  ],

  // ---- Edera in her nook, later in chapter 3
  'edera.chat': [
    IF({ flag: 'edera.rosalba' },
      [edera('Rosalba, sei tornata! Sei Rosalba, vero? Sì, lo sento da come cammini, anche se una vocina mi dice che dovrei controllare.')],
      [edera('Aspetta, non dirmelo, che stavolta ci arrivo da sola: sei {name}. Ho indovinato, o no? Dalla tua faccia direi di sì, ma non ci giurerei.')]),
    IF([{ flag: 'edera.promise' }, { has: 'm17' }, { notFlag: 'edera.star' }], [
      edera('Me l\'avevi promesso, e me l\'hai portata. Fammela tenere un momento: guarda come versa l\'acqua, senza guardare le brocche, e non ne perde una goccia.'),
      edera('Tieni, cara, questo è per te. È incenso della chiesa di sopra, che il sagrestano mi porta di nascosto da quando gli ho letto le carte per il figlio.'),
      tool('incense', 1), trust('edera', 1), flag('edera.star'),
    ]),
    IF({ flag: 'edera.sign' }, [edera('Del tuo nome non sono sicura, ma del segno sì: sei nata sotto il segno {sign}. Vedi che una cosa di te l\'ho tenuta?')]),
    IF(KIND, [edera('Mi fa sempre piacere quando scendi, cara. Sei una delle poche persone che mi parla come si parla a una signora, e non a una vecchia.')]),
    choice(
      o('Mi ripeti le posizioni della croce?', null, [
        edera('Te le ripeto volentieri. Il presente, ciò che lo attraversa, le fondamenta sotto, il passato a sinistra, le possibilità sopra, il futuro a destra.'),
        edera('Poi viene la colonna, dal basso: tu come sei adesso, chi ti sta intorno, le speranze e le paure, e in cima l\'esito.'),
      ]),
      o('Mi racconti ancora del Giudice?', null, [
        edera('Da bambino mangiava le candele della chiesa e chiedeva scusa al sagrestano. Da grande spegne le persone, e chiede scusa anche a loro. È sempre stato un ragazzo molto educato.'),
        IF({ notFlag: 'edera.told' }, [trust('edera', 1), flag('edera.told')]),
      ]),
      // special answers: the cat on her lap, and the cellars walked from end to end
      sp('tartufo', { tartufo: 2 }, 'Ti lascio Tartufo sulle ginocchia, finché parliamo.', null, [
        edera('Che bel gatto, e come sta composto. Lui si chiama Tartufo, vedi che questo me lo ricordo? I nomi delle bestie mi restano, e sono quelli dei cristiani che scappano.'),
        cat('(Ha le ginocchia calde e non mi liscia il pelo al contrario. Resto qui finché non avete finito, e se vi dilungate non sarò io a lamentarmi.)'),
        IF({ notFlag: 'edera.cat' }, [trust('edera', 1), flag('edera.cat')]),
      ]),
      sp('explore', { explored: 20 }, 'Ho girato tutte le cantine: dimmi tu se ho dimenticato un angolo.', null, [
        edera('Tutte è una parola grossa, cara, perché queste gallerie sono più vecchie di me, e io sono vecchia. Però si vede che hai camminato: hai ancora la polvere sull\'orlo del mantello.'),
        IF({ lacks: 'm15' },
          [edera('Alle catene non ti sei fermata abbastanza. Sono dalla parte opposta alla mia, in fondo a tutte le gallerie, e il Diavolo sta lì, dove senti il ferro che batte contro il muro.')],
          [IF({ lacks: 'm16' },
            [edera('La Torre l\'hai lasciata indietro. Sta oltre la sala del calderone, scendendo, dove la galleria si allarga e dall\'alto cade ancora qualche pietra.')],
            [IF({ lacks: 'm17' },
              [edera('La Stella è nel pozzo vecchio, sotto questa mia nicchia. Scendi dritta, e quando senti l\'acqua guarda in fondo, perché luccica anche senza luna.')],
              [IF({ lacks: 'm18' },
                [edera('Ti manca la palude, che è in fondo a tutto, oltre la Torre. La Luna sta lì, tra due torri piccole, e i cani che senti abbaiare non mordono nessuno.')],
                [edera('Di carte quaggiù non te ne manca nessuna, e te lo dico con una punta d\'invidia. Io per trovarle tutte ci ho messo undici inverni, e avevo le gambe buone.')])])])]),
      ]),
    ),
  ],
};
