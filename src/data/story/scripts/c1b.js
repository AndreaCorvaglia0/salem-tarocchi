// Chapter 1, second half: Ginepra and Il Carro, the first Exam (a scare in the square), the Venus
// glass, the square (fork 1), the gate to the forest (cards and rank), Malva at home.
import {
  bell, N, T, malva, ginepra, cat, cop, say, o, tg, choice, IF, xp, flag, diary, step, chapter, travel, give,
  exam, session, cinema, point, visit, sp, tool,
} from '../h.js';
import { chapterCard } from '../h.js';

const FRANK = { trait: ['parola', '>=', 3] };
const WARY = { trait: ['parola', '<=', -3] };
const BOLD = { trait: ['rischio', '>=', 3] };

export const C1B = {
  // ---- meet Ginepra: she takes the card from under her nose
  'c1.cart': [
    N('Il carretto del fieno è fermo accanto ai banchi vuoti del mercato. Sotto una ruota, mezza sepolta nella neve, c\'è una carta, e ti chini per prenderla.'),
    N('Una mano con un guanto blu arriva un attimo prima della tua, e subito dopo arriva una risata.'),
    ginepra('L\'ho presa io! Scusa, eh, però l\'ho vista prima io. Cioè, l\'hai vista prima tu, ma io sono arrivata prima, e conta chi arriva.'),
    ginepra('Mi chiamo Ginepra e sono novizia anch\'io, da Ortica, quella del bosco. Tu devi essere la ragazza nuova di Malva: ne parla tutto il villaggio, e sei qui da un giorno.'),
    choice(
      o('Quella carta è mia, quindi ridammela subito.', { rischio: 1, tono: -1 }, [
        ginepra('Vieni a prendertela, allora! No, aspetta, ferma, che qui sotto è tutto ghiaccio e se cadiamo ci rompiamo il naso tutte e due.'),
      ], { flag: 'ginepra.chased', tag: tg('m07', 'w') }),
      o('Tienila pure, per stasera. Poi però ne riparliamo.', { rischio: -1, tono: 1 }, [
        ginepra('Mi piace come dici «per stasera»: sembra una sfida fatta con educazione. Guarda che ti prendo in parola.'),
      ], { flag: 'ginepra.let', trust: { ginepra: 1 }, tag: tg('m14', 'c') }),
      // special: the cat is quicker than both, and keeps the card until the night
      sp('tartufo', { tartufo: 1 }, 'Faccio un cenno a Tartufo, che è più svelto di tutte e due.', { esplora: 1 }, [
        N('Tartufo passa tra le vostre gambe, sfila la carta dalle dita di Ginepra con i denti e va a sedersi in cima al carretto, dove non arriva nessuna delle due.'),
        ginepra('Ah ah, non vale, hai un complice! Va bene, gatto, tienila tu fino a stanotte: mi fido più di te che di me, e la cosa dovrebbe preoccuparmi.'),
      ], { flag: 'cart.cat', trust: { ginepra: 1 } }),
    ),
    ginepra('È Il Carro, guarda: uno che parte e non si volta indietro nemmeno se lo chiami. Dicono tutti che mi somiglia.'),
    ginepra('Te lo ridò, giuro, ma prima voglio farti vedere una cosa. Stanotte faccio il bicchiere di Venere, sul davanzale nel vicolo di sotto, e da sola non mi va.'),
    N('In fondo alla via, dalla parte della piazza, dondola la luce di una lanterna.'),
    ginepra('Quello è un conestabile, e a me mi conosce già. Io passo da dietro le case. Tu attraversa pure la piazza: prima o poi ti fermano lo stesso, e la prima volta è meglio togliersela subito.'),
    choice(
      o('Allora attraverso la piazza in mezzo, a testa alta.', { rischio: 1 }, [
        ginepra('Ecco, brava, fatti vedere! Io la prima volta ho fatto il giro largo e mi hanno presa lo stesso, quindi tanto vale andarci incontro.'),
      ], { flag: 'square.front' }),
      o('Io passo lungo il muro della chiesa, dove c\'è ombra.', { rischio: -1 }, [
        ginepra('Lungo il muro, come i gatti. Va bene, però guarda che le lanterne girano, e l\'ombra di adesso tra un momento è già in piena luce.'),
      ], { flag: 'square.wall' }),
    ),
    IF({ power: 'cat' }, [cat('(Simpatica, la tua nuova amica: ti ha preso una carta e ti ha mandata dritta in bocca al conestabile, e ci ha messo meno di un minuto.)')]),
    flag('met.ginepra'),
    flag('ginepra.snatched'),
    diary('Una certa Ginepra mi ha soffiato Il Carro da sotto il naso, ridendo. Mi aspetta stanotte nel vicolo di sotto.'),
    xp(5),
    step('c1.explore'),
  ],

  // ---- the first Exam, in fiction a scare: a constable stops her in the empty square
  'c1.exam1': [
    IF({ flag: 'square.wall' }, [
      N('Costeggi il muro della chiesa un passo alla volta, con il fiato corto. La lanterna però non era dove credevi: gira l\'angolo proprio davanti a te, e si ferma a due passi.'),
      cop('Ferma lì, ragazza. Chi cammina rasente ai muri di solito ha un motivo, e io a Salem conosco tutte le facce, ma la tua non l\'ho mai vista.'),
    ], [IF({ flag: 'square.front' }, [
      N('Attraversi la piazza vuota proprio nel mezzo, senza affrettare il passo. La lanterna, che prima era lontana, cambia strada apposta per venirti incontro e si ferma a due passi da te.'),
      cop('Ferma lì, ragazza. Cammini come se la piazza fosse tua, e invece io a Salem conosco tutte le facce, e la tua non l\'ho mai vista.'),
    ])]),
    IF({ power: 'cat' }, [cat('(Il pelo non mi si rizza mai per niente, te l\'avevo detto. Stai calma e lascia parlare lui.)')]),
    cop('Sei in giro da sola, di notte, con un gatto nero alle calcagna. Dimmi tu come la dovrei chiamare, una così.'),
    choice(
      o('Sto da Comare Malva, la levatrice. Sono arrivata ieri sera.', { parola: 1 }, [
        cop('Da Malva, dici. Quella donna ha fatto nascere mezzo villaggio, me compreso, e non per questo mi fido di chi le gira per casa.'),
      ], { flag: 'exam1.malva', tag: tg('m03', 'p') }),
      o('Sono solo di passaggio, e riparto domattina.', { parola: -1 }, [
        cop('Di passaggio lo dicono tutte. Poi le ritrovo qui a Pasqua, e qualcuna la ritrovo in piazza a gridare.'),
      ], { flag: 'lied.constable', tag: tg('m18', 'c') }),
      // special: the first person she read for is known to him
      sp('pop', { pop: 1 }, 'Chiedete alla vedova Bray, che ieri sera era al mio tavolo.', { guida: -1 }, [
        cop('La Bray, dici? Quella non parla bene di nessuno da quando le è morto il marito, quindi se di te ha parlato bene qualcosa vorrà dire. Le domande però te le faccio lo stesso.'),
      ], { flag: 'exam1.bray', tag: '[Ti conoscono]' }),
    ),
    cop('Facciamo così: ti faccio qualche domanda su quelle figure che avete voi ragazze. Una ragazza istruita risponde senza pensarci, mentre una che ha qualcosa da nascondere comincia a balbettare.'),
    IF({ power: 'cat' }, [
      IF({ tool: 'incense' },
        [cat('(Respira piano, intanto. Ti chiede delle tue carte, e quelle le conosci: pensa alle figure e non alla sua lanterna. Se poi ti manca la voce, in borsa hai l\'incenso di Malva.)')],
        [cat('(Respira piano, intanto. Ti chiede delle tue carte, e quelle le conosci: pensa alle figure e non alla sua lanterna.)')]),
    ]),
    exam('constable', 'village.square'),
    IF({ flag: 'exam.passed' }, [
      cop('Mh, ne sai più di mia figlia, e mia figlia va a scuola dal pastore. Vai a casa, e che non ti ritrovi in giro dopo mezzanotte.'),
      choice(
        o('«Buonanotte, conestabile, e buona guardia.»', { tono: 1 }, [
          cop('Buona guardia, dice. In vent\'anni di ronde non me l\'aveva mai augurato nessuno, e non so ancora se devo insospettirmi.'),
        ]),
        o('Me ne vado senza voltarmi, e senza una parola.', { tono: -1 }, [
          N('Senti la lanterna che ti segue per una decina di passi, come un dito puntato tra le scapole. Poi la luce torna indietro, e la piazza è di nuovo buia.'),
        ]),
      ),
      IF({ power: 'cat' }, [cat('(Hai visto che non era difficile? Adesso cammina piano, come una che non ha niente da nascondere.)')]),
    ], [
      cop('Troppe esitazioni, ragazza. Stanotte dormi nelle celle del tribunale, e domattina vediamo se ti è tornata la memoria.'),
      IF({ power: 'cat' }, [cat('(Non è la fine del mondo, ci sono passate tutte. Ti aspetto fuori, e la prossima volta le figure le riguardiamo prima di uscire.)')]),
    ]),
    IF({ flag: 'lied.constable' }, [diary('Al conestabile ho detto che ero di passaggio. Non era vero, e lo rifarei.')]),
    flag('exam1.done'),
    xp(5),
    step('c1.venus'),
  ],

  // ---- the Venus glass, behind the parsonage
  'c1.venus': [
    N('Dietro la canonica c\'è un davanzale basso, riparato dal vento. Ginepra ci ha posato un bicchiere d\'acqua e lo tiene fermo con due dita, alla luce della luna.'),
    IF({ flag: 'exam.passed' },
      [ginepra('Ti ha fermata, vero? Ho guardato tutto da dietro il fienile. Hai risposto senza battere ciglio, e io la prima volta mi sono messa a piangere.')],
      [ginepra('Ti hanno tenuta dentro, lo so, ho visto tutto da dietro il fienile. La prima volta ci sono finita anch\'io, e il pane era lo stesso.')]),
    IF({ flag: 'square.wall' }, [ginepra('E ti ho vista strisciare lungo il muro della chiesa, sai? Sembravi un\'ombra con il mantello. Ti ha presa lo stesso, ma almeno ha dovuto girare l\'angolo.')]),
    IF({ flag: 'square.front' }, [ginepra('E hai attraversato la piazza proprio nel mezzo, come una processione! Ha dovuto cambiare strada lui per fermarti, e questa a Salem la racconteranno.')]),
    ginepra('Questo si chiama bicchiere di Venere. Ci fai cadere il bianco di un uovo, guardi che forma prende, e la forma ti dice chi sposerai, o almeno che mestiere farà.'),
    ginepra('Le ragazze del villaggio lo fanno tutte di nascosto, anche se il pastore dice che è peccato. Lui dice che è peccato anche ridere in chiesa, quindi non fa testo.'),
    // the gesture, contrary, and she goes anyway (m18 upright): the coffin follows
    N('Prima di toccare l\'uovo tira fuori dalla manica una carta sola, la gira sul davanzale e fa una smorfia.'),
    ginepra('È La Luna, e Ortica dice che è un sogno confuso, pieno di paure, e che con lei niente è come sembra: sarebbe un «lascia stare». Però l\'uovo l\'ho già rubato, e rimetterlo sotto la gallina è peggio.'),
    choice(
      o('Dai, guardiamo insieme cosa viene fuori.', { esplora: 1 }, [
        N('Ginepra rompe l\'uovo sul bordo e lascia scivolare l\'albume nell\'acqua, dove si apre piano, come una mano che si stende.'),
      ], { flag: 'venus.looked', tag: tg('m06', 'c') }),
      o('Io non guardo: queste cose non mi sembrano un gioco.', { rischio: -1 }, [
        ginepra('Tutto è un gioco finché qualcuno non si mette a gridare. Va bene, tu tieni d\'occhio la strada, che guardo io per tutte e due.'),
      ], { flag: 'venus.refused', tag: tg('m02', 's') }),
      // special: she already has the card that answers the glass's question
      sp('trait', { has: 'm06' }, 'Appoggio Gli Amanti accanto al bicchiere, e guardiamo anche quelli.', { guida: 1 }, [
        ginepra('Ce li hai già, Gli Amanti! Allora mettili lì, che chi sposerò preferisco sentirlo da loro. L\'uovo però lo rompo lo stesso, perché l\'ho rubato apposta.'),
        N('Ginepra rompe l\'uovo sul bordo e lascia scivolare l\'albume nell\'acqua, mentre i due della carta guardano ostinatamente da un\'altra parte.'),
        flag('venus.card'),
      ], { flag: 'venus.looked', tag: '[Hai Gli Amanti]' }),
    ),
    N('Nel bicchiere l\'albume si allunga e poi si stringe ai lati, finché prende la forma di una cassa lunga e stretta.'),
    ginepra('Quella è una bara, vero? Ah ah, scusa, non c\'è niente da ridere: è che quando ho paura mi viene da ridere, e sono fatta così da sempre.'),
    ginepra('Le ragazze che l\'hanno fatto la settimana scorsa adesso sono quelle che gridano in piazza. Dicono che di notte qualcuno le punge con gli spilli.'),
    choice(
      o('Dammi il bicchiere, che lo butto via io.', { guida: 1 }, [
        ginepra('Sì, buttalo tu, per favore, e lontano, oltre la siepe. Io quel bicchiere non lo tocco più nemmeno con i guanti.'),
      ], { trust: { ginepra: 1 }, tag: tg('m14', 'c') }),
      o('È il bianco di un uovo, Ginepra, e nient\'altro.', { guida: -1 }, [
        ginepra('Hai ragione, è un uovo. Un uovo che ha fatto una bara. Me lo ripeto finché ci credo, e tu intanto parlami d\'altro.'),
      ], { tag: tg('m01', 's') }),
      // special answers: two other ways to get rid of that shape
      sp('tartufo', { tartufo: 1 }, 'Faccio un cenno a Tartufo, che sa già cosa fare.', { rischio: 1 }, [
        N('Tartufo salta sul davanzale, annusa il bicchiere e lo spinge oltre il bordo con una zampa sola, guardandoti negli occhi mentre lo fa. Nella neve resta soltanto una macchia chiara.'),
        ginepra('Ah ah, l\'ha fatto apposta, hai visto come ti guardava? Meglio lui di noi due: un gatto nero che rovescia una bara porta bene per forza, o almeno io ho deciso così.'),
      ], { trust: { ginepra: 1 } }),
      sp('magic', { power: 'fire' }, 'Ci passo sopra la fiammella, finché quella forma si scioglie.', { tono: 1 }, [
        N('Apri la mano sopra il bicchiere, e la fiammella scalda l\'acqua finché l\'albume si rapprende in un grumo bianco, che non somiglia più a niente.'),
        ginepra('Adesso è un uovo cotto male, e di un uovo cotto male non ha mai avuto paura nessuno. Me lo insegni, quel fuoco lì? Ortica dice che a me verrà tardi, perché non sto mai ferma.'),
      ], { trust: { ginepra: 1 } }),
    ),
    IF({ flag: 'cart.cat' },
      [ginepra('I patti sono patti, e il tuo gatto li ha fatti rispettare: Il Carro me l\'ha riportato lui un\'ora fa, e adesso è tuo. La prossima carta che troviamo insieme, però, la prendo io.')],
      [ginepra('I patti sono patti: Il Carro è tuo, perché l\'avevi visto prima tu. Però te lo dico adesso, così dopo non ti offendi: la prossima carta che troviamo insieme la prendo io.')]),
    give('m07'),
    flag('ginepra.returned'),
    IF({ flag: 'ginepra.chased' }, [ginepra('E comunque sul ghiaccio non mi avresti presa. Forse. Non lo sapremo mai, ed è meglio per tutte e due.')]),
    IF({ flag: 'ginepra.let' }, [ginepra('Avevi detto «per stasera», e stasera è finita. Vedi che sono una persona seria?')]),
    IF({ lacks: 'm06' }, [ginepra('Ce n\'è un\'altra infilata dietro il vaso, qui sul davanzale. Sono Gli Amanti, e te la lascio volentieri: stanotte di sapere chi sposo non ho più nessuna voglia.')]),
    ginepra('Domani all\'imbrunire in piazza ci sarà gente, per via delle ragazze che gridano. Io ci vado, anche se so che non dovrei. Vieni anche tu?'),
    choice(
      o('Vengo, ma restiamo in fondo, vicino al portico.', { rischio: -1 }, [
        ginepra('In fondo, vicino al portico, dove si vede tutto e non ti vede nessuno. Ah ah, sei qui da due giorni e ragioni già come una di Salem.'),
      ]),
      o('Vengo, e voglio vedere bene chi è che grida.', { esplora: 1 }, [
        ginepra('Allora ci mettiamo davanti. Però se cominciano a indicare la gente io ti tiro per il mantello, e te lo dico adesso così dopo non ti offendi.'),
      ]),
    ),
    diary('Nel bicchiere di Venere è venuta fuori una bara. Ginepra ha riso, ma non perché le sembrasse divertente.'),
    xp(5),
    N('Sulla strada di casa ripensi a quella forma nell\'acqua, e per un momento ti sembra di rivedere la candela della Lettrice.'),
    visit,
    step('c1.square'),
  ],

  // ---- fork 1: the square
  'c1.square': [
    bell,
    cinema([
      'All\'imbrunire la piazza è piena, eppure nessuno parla ad alta voce. La gente sta in cerchio e lascia uno spazio vuoto davanti alla chiesa.',
      'In mezzo a quello spazio c\'è una ragazza che trema dalla testa ai piedi. È una delle Afflitte, quelle che hanno guardato nel bicchiere di Venere e da allora vedono streghe dappertutto.',
    ], 'village.square'),
    say('afflitta', 'È lei, è lei! La vedo anche adesso, mi sta pungendo le braccia con gli spilli! Fatela smettere subito!'),
    N('Il dito della ragazza indica Comare Hale, la vecchia che vende candele sotto il portico. A Hale cade la cesta di mano, e le candele rotolano nella neve.'),
    cop('Comare Hale, dovete venire con noi al tribunale. Non fate storie, che è peggio per voi.'),
    IF({ flag: 'venus.looked' }, [T('Ieri notte in quel bicchiere ho guardato anch\'io, insieme a Ginepra. Potrei esserci io, là in mezzo, a tremare e a indicare qualcuno.')]),
    IF({ flag: 'venus.refused' }, [T('Ieri notte in quel bicchiere non ho voluto guardare. Adesso capisco meglio da che cosa mi tenevo lontana.')]),
    IF({ power: 'cat' }, [cat('(Pensaci bene prima di muoverti. Se apri bocca, tutta questa gente smette di guardare lei e comincia a guardare te.)')]),
    choice(
      o('Mi faccio avanti e lo dico forte: «Le candele non hanno mai punto nessuno.»', { rischio: 1, parola: 1 }, [
        N('La voce ti esce più alta di quanto volevi, e cento facce si girano insieme dalla tua parte.'),
      ], { flag: 'b1.spoke', trust: { ginepra: 1 }, tag: tg('m11', 's') }),
      o('Resto dove sono, nell\'ombra del portico, e non dico niente.', { rischio: -1, parola: -1 }, [
        N('Ti stringi nel mantello e fai un passo indietro, sotto il portico. Nessuno si accorge di te, ed è proprio quello che volevi.'),
      ], { flag: 'b1.hid', tag: tg('m02', 'c') }),
      // special answers: the same two sides, taken in her own way
      sp('trait', BOLD, 'Raccolgo le candele dalla neve, e dico forte che sono soltanto candele.', { rischio: 1, tono: 1 }, [
        N('Attraversi lo spazio vuoto senza chiedere permesso, ti chini e raccogli le candele una per una. Nessuno ti ferma, perché nessuno l\'aveva mai visto fare, e quando parli ti sentono fino al sagrato.'),
        flag('b1.candles'),
      ], { flag: 'b1.spoke', trust: { ginepra: 1 } }),
      sp('trait', WARY, 'Resto zitta, ma guardo bene in faccia chi accusa e chi porta via.', { parola: -1, esplora: 1 }, [
        N('Non ti muovi dal portico, però non abbassi gli occhi. Guardi la ragazza che trema, il conestabile che evita di guardarla, e ogni faccia della piazza che si volta dall\'altra parte.'),
        flag('b1.watched'),
      ], { flag: 'b1.hid' }),
    ),
    IF({ flag: 'b1.spoke' }, [
      say('afflitta', 'Anche quella lì! Ha gli stessi occhi di quell\'altra, guardatela!'),
      N('Adesso il dito punta te, e trema. Resta alzato per un tempo che ti sembra lunghissimo, poi piano piano si abbassa, perché in piazza nessuno ha più voglia di seguirlo.'),
      cop('Tu sei la ragazza nuova di Malva. La tua faccia me la ricorderò, stanne certa.'),
      IF({ flag: 'b1.candles' }, [
        N('Quella sera Comare Hale torna a casa sua, con la cesta che le hai riempito tu stretta contro il petto. Sulla soglia si volta a cercarti, e non trova le parole.'),
        point('m11', 's'),
        diary('In piazza ho raccolto le candele di Comare Hale davanti a tutti, e ho detto che erano soltanto candele. Lei è tornata a casa.'),
      ], [
        N('Quella sera Comare Hale torna a casa sua. Prima però si china e raccoglie le candele dalla neve, una per una, senza lasciarne nemmeno una.'),
        point('m11', 's'),
        diary('In piazza ho parlato davanti a tutti. Mi tremava la voce, ma Comare Hale è tornata a casa.'),
      ]),
    ], [
      N('Comare Hale attraversa la piazza in mezzo a due conestabili, senza voltarsi. Le sue candele restano dove sono cadute, e la neve comincia a coprirle.'),
      IF({ flag: 'b1.watched' },
        [T('Non ho detto niente, ma li ho guardati tutti, uno per uno, e me li ricordo. Non so ancora a cosa mi servirà, però so che non è stato per paura.')],
        [T('Avrei potuto dire qualcosa, e lo sapevo anche mentre stavo zitta. Non ho ancora capito se è stata prudenza o paura.')]),
      point('m02', 'c'),
      diary('In piazza sono rimasta zitta, e Comare Hale l\'hanno portata via.'),
    ]),
    IF({ flag: 'b1.spoke' },
      [ginepra('Tu sei matta, lo sai? Ah ah, sei matta da legare, e io non ho mai visto una cosa così bella in vita mia.')],
      [ginepra('Hai fatto bene a stare ferma, credo. Non lo so. Non ho fatto niente nemmeno io, e a casa mia ero quella coraggiosa.')]),
    malva('Per stasera di piazza ne avete avuta abbastanza. Filate a casa tutte e due, e passate da dietro.'),
    choice(
      o('Prima accompagno Ginepra fino al sentiero.', { tono: 1 }, [
        malva('Accompagnala, e poi dritta a casa. Quella lì sarebbe capace di tornare indietro a vedere com\'è andata a finire.'),
      ]),
      o('Vado, ma domani voglio capire chi sono quelle ragazze.', { esplora: 1 }, [
        malva('Sono figlie di gente che conosco da quando è nata, ed è proprio questo il guaio. Domani te ne parlo io, a porte chiuse e davanti al fuoco.'),
      ]),
    ),
    IF({ flag: 'b1.spoke' },
      [malva('Sei coraggiosa e senza giudizio, due cose che vanno spesso a braccetto. Però stanotte le candele di Hale bruciano a casa sua, e questo non me lo dimentico.')],
      [malva('Non fare quella faccia. A volte tacere è l\'unica cosa che una può fare, e stasera non toccava certo a una ragazza arrivata da due giorni.')]),
    malva('In paese ormai ti hanno vista, e non è un bene. Finisci di cercare le carte che ci sono qui, poi vieni al cancello in cima al villaggio: se ti trovo pronta, ti mando nel bosco da Ortica.'),
    xp(10),
    step('c1.gate'),
  ],

  // ---- the gate to the forest: the cards of the village, and the rank of Fattucchiera
  'c1.gate': [
    IF([{ majorsMin: 6 }, { level: 4 }], [
      IF({ flag: 'gate1.refused' },
        [malva('L\'altra volta ti ho rimandata indietro e non mi hai tenuto il muso. Guardati adesso: giri le carte come una che lo fa da anni. Sei una fattucchiera, e nel bosco ci puoi andare.')],
        [malva('Ti ho guardata lavorare, in questi giorni, senza dirtelo. Non sei più la novizia che ha bussato alla mia porta: sei una fattucchiera, e nel bosco ci puoi andare.')]),
      // the gesture (m00 upright): she opens the gate
      N('Malva ha una mano sul chiavistello e con l\'altra gira una carta contro il legno del cancello, senza fretta.'),
      malva('Il Matto, dritto. È un inizio, e dice di saltare con fiducia: quando esce lui il cancello si apre, e io non mi sono mai permessa di discutere.'),
      malva('In questo fagotto c\'è pane per due giorni. Ortica parla dalla mattina alla sera e si dimentica di dar da mangiare alla gente, ma tu ascoltala lo stesso: in mezzo alle chiacchiere dice cose giuste.'),
      IF({ flag: 'malva.wood' }, [malva('La legna l\'hai spaccata tutta storta, sappilo. Però l\'hai spaccata, e la catasta arriva fino alla finestra.')]),
      IF({ flag: 'malva.cheeky' }, [malva('E fammi vedere quelle mani delicate. Ecco, lo dicevo io: un callo c\'è già.')]),
      IF({ flag: 'bundle.peeked' }, [malva('Tabita mi ha detto che il nodo del fagotto non era il mio. Non ti sgrido, perché una che non guarda cosa porta in giro a Salem dura poco.')]),
      IF({ flag: 'bundle.closed' }, [malva('Tabita mi ha detto che il fagotto le è arrivato col mio nodo. Sappi che l\'avevo fatto doppio apposta, per vedere se resistevi.')]),
      IF({ flag: 'tabita.owes' }, [malva('E le sue tre monete non le hai volute. Non te lo dico per farti un complimento: da allora lei ti lava le lenzuola per niente, e con me non l\'ha mai fatto.')]),
      IF(FRANK, [malva('Una cosa te la dico, visto che parti: con te si fa presto, perché dici le cose come stanno. Non perderlo, questo vizio, nemmeno quando ti converrebbe.')]),
      IF(WARY, [malva('Tu le parole le pesi come il sale, l\'ho notato. Con i conestabili fai bene; con me puoi anche buttarle giù a manciate.')]),
      choice(
        o('Grazie di tutto, Malva.', { tono: 1 }, [
          malva('Ti ho detto che ringraziare porta male, e tu lo fai lo stesso, proprio sulla porta del bosco. Vai, prima che mi tocchi anche risponderti.'),
        ], { tag: tg('m03', 'c') }),
        o('Mi mancherai, anche se non lo vuoi sentire.', { parola: 1, guida: 1 }, [
          malva('Non dire sciocchezze, che sto a mezz\'ora di strada. E copriti la gola, perché nel bosco è primavera soltanto di nome.'),
        ], { trust: { malva: 1 }, tag: tg('m06', 'c') }),
        // special answers: over the gate on the broom; a real piece of advice from one who trusts her
        sp('broom', { power: 'broom' }, 'Non serve che mi apri il cancello: passo da sopra.', { rischio: 1 }, [
          malva('Da sopra, dice lei. Scendi subito di lì, che il cancello lo apro io come si è sempre fatto, e in paese quella scopa tienila bassa.'),
          N('Però, mentre gira la chiave, guarda la scopa più a lungo di quanto vorrebbe, come si guarda una cosa che si è avuta da giovani.'),
        ], { flag: 'gate.flew' }),
        sp('witch', { trust: ['malva', '>=', 2] }, 'Dammi un consiglio per Ortica, Malva, ma uno vero.', { guida: -1 }, [
          malva('Uno solo: quando ti chiede un parere, daglielo corto, perché quello lungo se lo fa da sola. E prendi questo incenso del mio, che nel bosco la bottega non c\'è.'),
          tool('incense', 1),
        ], { flag: 'gate.advice', tag: '[Malva si fida]' }),
      ),
      diary('Ho lasciato il villaggio per il bosco. Malva mi ha accompagnata al cancello e ha fatto finta di guardare altrove.'),
      chapterCard(2), // black screen, the title of the chapter that opens (story/chapter.js)
      session('s1'),
      chapter(2),
      xp(10),
      step('c2.ortica'),
      travel('forest.entry'),
    ], [
      IF({ level: 4 }, [
        malva('Le mani ormai le hai, ma ti mancano ancora carte del villaggio, e Ortica non comincia da capo per nessuno. Cercale: sul quaderno hai segnato dove dicono di averle viste.'),
      ], [
        malva('Dove credi di andare? Nel bosco ci mando le fattucchiere, e tu sei ancora una novizia che conta le carte sulle dita. Non è un\'offesa: è stato così per tutte.'),
        malva('Torna alla capanna e leggi per chi bussa, riguardati le figure la sera, cerca le carte che ti mancano. Quando sarai pronta me ne accorgerò io, prima di te.'),
      ]),
      IF({ notFlag: 'gate1.refused' }, [choice(
        o('Hai ragione tu: torno quando sono pronta.', { rischio: -1 }, [
          malva('Lo so che ho ragione, ma fa sempre piacere sentirselo dire. Vai, e non metterci troppo, che il pane per il viaggio non si conserva.'),
        ]),
        o('Mettimi alla prova adesso, Malva.', { rischio: 1 }, [
          malva('Alla prova ti ci mette il bosco, non io, e il bosco le domande non le ripete. Torna a leggere per chi bussa, e ne riparliamo presto.'),
        ]),
      )]),
      flag('gate1.refused'),
      IF({ power: 'cat' }, [cat('(Non te la prendere. Ti ha detto di no con più parole di quante ne spende di solito in una settimana, e da lei vuol dire che ci tiene.)')]),
    ]),
  ],

  // ---- Malva at home, any time in chapter 1 after the errands
  'malva.chat': [
    IF({ stat: ['jailed', '>=', 1] },
      [malva('So che ti hanno tenuta in cella: qui le notizie arrivano prima del pane. Siediti e mangia qualcosa, che a stomaco vuoto si risponde peggio.')],
      [IF({ flag: 'b1.spoke' },
        [malva('Stamattina mezzo villaggio parlava di te, e l\'altro mezzo veniva da me a chiedere chi sei. Ho risposto che spacchi la legna.')],
        [malva('Cosa c\'è, hai fame? Il pane è nella madia. Prendilo da te e non stare lì a ringraziare.')])]),
    IF({ trait: ['tono', '<=', -3] }, [malva('Ho sentito come rispondi alla gente, e non dico che sbagli. Solo, la lingua tienila affilata per chi se lo merita.')]),
    IF({ trait: ['tono', '>=', 3] }, [malva('Mi dicono che sei gentile con tutti. Va bene, ma non esserlo anche con chi ti fruga nella borsa.')]),
    IF({ level: 4 }, [malva('Guarda chi c\'è, la fattucchiera. Una volta entravi in punta di piedi, e adesso ti siedi senza aspettare che te lo dica io. Va bene così.')]),
    choice(
      o('Mi ripeti come si legge una carta sola?', null, [
        malva('Una domanda, una carta. Guardi la figura, dici cosa vedi e cosa può farne chi ti ascolta, e poi stai zitta, che è la parte più difficile.'),
      ]),
      o('Cos\'è che cresce nel tuo orto, sotto la neve?', null, [
        malva('Niente che abbia piantato io, e questo è il bello. L\'altra sera tra i cavoli ho visto luccicare una di quelle figure: una donna seduta in mezzo al grano, grossa di un bambino.'),
        malva('È la carta di tutto quello che cresce se qualcuno ne ha cura. Io non la raccolgo, perché ho già le mie; ma l\'orto è dietro casa, e il cancelletto non ha il chiavistello.'),
        flag('side.m03'),
      ]),
      o('Niente, passavo soltanto a salutare.', null, [
        malva('Allora hai salutato. Quando esci chiudi bene la porta, che entra il freddo.'),
      ]),
      // special answers (story/special.js): shown only when their `when` holds, after the others
      { t: 'Lascio che Tartufo ti salti in grembo.', special: 'tartufo', when: { tartufo: 1 }, then: [
        malva('Toglimelo di dosso, che perde il pelo sul grembiule nero. Però guarda come fa le fusa, questo mascalzone: con me non le ha mai fatte.'),
        malva('Si vede che ti ha presa in simpatia, e i gatti neri di rado si sbagliano. Dagli quel pezzo di lardo sulla madia, prima che se lo prenda da solo.'),
      ] },
      { t: 'Ti chiedo se è vero che in paese parlano di me.', special: 'pop', when: { pop: 1 }, then: [
        malva('Parlano, sì, e per una volta non dicono male. La moglie del fabbro è venuta a chiedermi se sei brava quanto dicono, e io le ho risposto di venire a vedere da sé.'),
        malva('Però non montarti la testa, perché la gente che oggi ti cerca è la stessa che domani ti indica col dito. Qui a Salem si fa presto a cambiare idea.'),
      ] },
    ),
  ],
};
