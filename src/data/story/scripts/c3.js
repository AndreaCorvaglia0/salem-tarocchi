// Chapter 3, the dark in autumn: the trapdoor (the rank of Strega), Nonna Edera and the Celtic cross,
// the council of the three mistresses, where she decides the plan and gives each her task (fork 3: by
// the cellars or in the open), the jail or the court door.
import {
  bell, N, T, malva, ortica, edera, ginepra, cat, judge, o, tg, choice, IF, xp, flag, diary, step, chapter, travel,
  draw, teach, lesson, cinema, goto, trust, visit,
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
      malva('Ti è venuta anche l\'aria, lo vedo da come ti si muove il mantello. È la magia delle Spade: basta un soffio, e un conestabile per un po\' non sa più dove stava andando.'),
      malva('Una volta ti avrei mandata a comprarmi l\'incenso. Adesso sei tu che dovresti dire a me cosa serve, e la cosa non mi dispiace quanto pensavo.'),
      IF({ flag: 'malva.cheeky' }, [malva('Tieniti forte alla scala con quelle mani delicate, che i pioli sono bagnati.')]),
      malva('Ginepra è una sciocca, e lo dico con tutto il bene che le voglio. Però si è fatta avanti per un\'altra, e una così a quel signore del tribunale non la lascio.'),
      IF({ flag: 'b2.stayed' }, [malva('So anche che tu al deposito non ci sei voluta andare. Hai fatto bene, e non pensare nemmeno per un momento che sia colpa tua.')]),
      IF({ flag: 'b2.went' }, [malva('So anche che al deposito c\'eri pure tu. Non ti dico niente, perché alla tua età ci sarei andata anch\'io.')]),
      choice(
        o('Grazie, Malva: da sola non avrei saputo da dove cominciare.', { tono: 1 }, [
          malva('Te l\'ho detto mille volte che ringraziare porta male, e tu niente. Scendi, va\', che è tardi.'),
          N('Però, alla luce della lanterna, l\'angolo della bocca le si alza appena, e fa in tempo a voltarsi prima che tu possa dirglielo.'),
        ], { trust: { malva: 1 }, tag: tg('m03', 'c') }),
        o('Chi c\'è, là sotto?', { esplora: 1 }, [
          malva('C\'è Edera, che è più vecchia del villaggio e più elegante di tutte noi messe insieme. Ti chiamerà con un nome che non è il tuo: lasciala fare, che tutto il resto se lo ricorda benissimo.'),
        ], { tag: tg('m02', 's') }),
      ),
      malva('Io ti tengo la lanterna fino in fondo alla scala e poi torno su, perché in paese qualcuno deve far finta di niente. Tu vai avanti finché trovi la nicchia di Edera.'),
      chapter(3),
      travel('depths.entry'),
      bell, // the cellars
      N('La scala è di pietra, umida, e sembra non finire mai. Sotto c\'è odore di terra bagnata e di vino vecchio, e un silenzio così grande che senti il tuo respiro.'),
      diary('Sono scesa sotto il villaggio dalla botola dietro il tribunale. Malva mi ha tenuto la lanterna fino all\'ultimo gradino.'),
      xp(5),
      step('c3.edera'),
    ], [
      malva('Ferma dove sei. Là sotto non ci porto una fattucchiera, nemmeno una brava come te. Ci porto una strega fatta, perché nelle cantine il buio è vero e il Giudice le carte le conosce tutte.'),
      malva('Lo so che vorresti scendere stanotte, e a Ginepra ci penso anch\'io a ogni ora. Ma se là sotto ti perdi, poi ne ho due da tirare fuori.'),
      malva('Leggi per chi bussa alla capanna, riguardati le carte, cerca quelle del bosco che ti mancano. È questione di giorni, non di mesi, e quando torni non ti chiederò niente: lo vedrò da me.'),
      flag('gate2.refused'),
      IF({ power: 'cat' }, [cat('(Ha ragione lei, anche se mi secca ammetterlo. Qualche lettura fatta bene, qualche carta in più, e la prossima volta quella botola te la apre da sola.)')]),
    ]),
  ],

  'c3.edera': [
    N('In fondo a una galleria c\'è una nicchia illuminata da una sola candela. Ci siede una donna con i capelli d\'argento raccolti in alto, dritta come una regina, che ti guarda arrivare come se ti avesse già letta.'),
    edera('Vieni avanti, cara, non restare al buio. Tu devi essere la ragazza di cui mi parlava Malva. Rosalba, mi pare.'),
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
    edera('Prima di tutto, però, prendine una dalle mie. È un\'usanza: chi viene fin qui non deve andarsene a mani vuote.'),
    draw(DEPTHS_POOL, 'Il dono di Edera'),
    edera('Questa che ti mostro si chiama croce: dieci carte, sei in croce e quattro in colonna. Con dieci carte sul tavolo si vede una vita intera, e bisogna avere la pazienza di guardarla tutta prima di parlare.'),
    teach('celtic'),
    lesson('celtic'),
    edera('Bada alla seconda, quella che si mette di traverso sulla prima. È ciò che attraversa la persona in quel momento: qualche volta la sorregge e qualche volta le sbarra il passo, e sta a te capire quale delle due.'),
    edera('Qui invece ti ho copiato i pianeti e i segni di ogni carta, con la mia mano di una volta, quando scrivevo ancora dritto.'),
    lesson('astro'),
    edera('Le altre carte di quaggiù le devi cercare tu, perché con queste gambe io non ci arrivo più. Il Diavolo sta alle catene, la Torre a nord, la Stella in fondo al pozzo e la Luna giù alla palude.'),
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
      ),
      edera('Comunque vada, al processo noi tre saremo in aula con te. Chi di noi ti conosce bene troverà il modo di darti una mano senza farsi notare.'),
      IF({ power: 'cat' }, [cat('(Le hai messe in riga tutte e tre, e nessuna ha fiatato. In un modo o nell\'altro finirai davanti al Giudice, però: io le figure me le riguarderei tutte, finché c\'è una candela accesa.)')]),
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
    cinema([
      'Oltre le catene la galleria si stringe e comincia a salire. In fondo c\'è una luce piccola, e qualcuno che canticchia una canzone, stonando.',
      'Le celle del tribunale sono lì, dietro una grata arrugginita. La voce che canta la riconosceresti anche al buio.',
    ], null, 'cellar'),
    IF({ flag: 'coven.ortica.talk' }, [N('Da qualche parte sopra di voi si sente Ortica, che sta raccontando del mugnaio a due guardie. Fino all\'alba non le lascerà andare.')]),
    ginepra('Sei venuta davvero! Lo sapevo, io. Cioè, lo speravo, che per me è la stessa cosa. Hai visto che so stare in prigione? Ho anche fatto amicizia con un topo.'),
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
    ),
    N('Alle vostre spalle qualcuno si schiarisce la voce. È una voce gentile, di quelle che chiedono scusa prima ancora di disturbare.'),
    judge('Buonasera a voi, signorine. Non correte, ve ne prego: questi gradini sono bagnati, e mi dispiacerebbe se una di voi si facesse male.'),
    judge('Due ragazze nelle mie celle in piena notte, e una delle due dalla parte sbagliata della grata. Ne parleremo domattina in aula, con calma e alla luce del giorno.'),
    IF({ power: 'cat' }, [cat('(Ho il pelo dritto dalla testa alla coda, compreso quello che non sapevo di avere. Questo fa più paura di tutti i conestabili messi insieme.)')]),
    diary('Sono arrivata alle celle passando dalle cantine. Il Giudice ci aspettava in cima alla scala, gentilissimo.'),
    travel('court.dock'),
    xp(5),
    step('c3.trial'),
    goto('c3.trial'),
  ],

  // ---- fork 3, in the open
  'c3.court': [
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
    ),
    ginepra('Tu sei matta, ah ah! Sei entrata dalla porta, davanti a tutti, e io che credevo di essere quella impulsiva.'),
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
    ),
  ],
};
