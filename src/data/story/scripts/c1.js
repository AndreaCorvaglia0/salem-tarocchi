// Chapter 1, first half: the guided opening, one new thing at a time. Malva's door (talk, draw two
// cards), her table (the first reading, by doing), the shop (errand 1: the incense), back to Malva,
// the bundle for the washerwoman (errand 2: across the village), the cottage, the grimoire.
// The second half (Ginepra, the first Exam, the square, the gate) is in c1b.js.
import {
  N, T, malva, cat, keeper, o, tg, choice, IF, xp, coins, flag, diary, step, travel, draw, teach, lesson,
  reading, tool, cinema, open,
} from '../h.js';
import { ROAD_POOL } from './c0.js';

export const C1 = {
  // ---- talk, and draw: Malva takes her in
  'c1.malva': [
    cinema(['Bussi due volte, piano. La porta si apre quasi subito, e sulla soglia c\'è una donna con una treccia girata intorno alla testa e le mani sui fianchi.'], 'village.malva_door'),
    travel('malva.hearth'),
    malva('Sulla porta c\'è scritto di non bussare, e tu hai bussato lo stesso. Vuol dire che sai leggere e che non dai retta, e delle due cose non so quale mi preoccupa di più.'),
    malva('Sei la ragazza nuova, quella che doveva arrivare la settimana scorsa. Entra e chiudi, che il caldo costa.'),
    IF({ power: 'cat' }, [malva('E quello dietro di te è Tartufo. Non è mio e non è di nessuno, ma se ti ha seguita fin qui vuol dire che ha deciso, e quando decide lui non c\'è verso.')]),
    choice(
      o('Mi sono persa due volte, e la neve non aiutava.', { parola: 1 }, [
        malva('Almeno non ti inventi una scusa. La prima volta si perdono tutte: la strada del porto sembra fatta apposta.'),
      ], { tag: tg('m00', 'w') }),
      o('Non sapevo che qualcuno mi stesse aspettando.', { parola: -1 }, [
        malva('Ti aspettavo io, e non c\'è bisogno che tu lo vada a raccontare. Ho tenuto la minestra in caldo sei sere, e la settima l\'ho data al maiale.'),
      ], { tag: tg('m09', 'p') }),
    ),
    malva('Ti tengo qui perché mi serve qualcuno che spacchi la legna. Io le mani le devo tenere buone per i bambini che nascono.'),
    choice(
      o('Va bene, la legna la spacco io. Dove tieni l\'ascia?', { tono: 1 }, [
        malva('È dietro la porta, e il ceppo è in cortile. Non ti ringrazio, perché ringraziare porta male, ma domattina ti faccio trovare il latte caldo.'),
      ], { flag: 'malva.wood', trust: { malva: 1 }, tag: tg('m03', 'p') }),
      o('Con l\'ascia non valgo molto: ho le mani delicate.', { tono: -1 }, [
        malva('Le mani delicate durano una settimana, poi vengono i calli e non ci pensi più. A me sono venuti a dodici anni, e sono ancora qui.'),
      ], { flag: 'malva.cheeky', tag: tg('m01', 'w') }),
    ),
    malva('Adesso fammi vedere cos\'hai trovato venendo qui. Hai la faccia di una che ha qualcosa in tasca e non sa se dirlo.'),
    malva('Ecco, lo immaginavo. Di queste non se ne comprano in nessuna bottega: capitano, e di solito capitano a chi poi non riesce più a farne a meno.'),
    malva('Ne ho qualcuna da parte anch\'io. Te ne faccio scegliere due coperte, così non prendi quella col disegno più bello.'),
    draw(ROAD_POOL, 'Il dono di Malva'),
    malva('Adesso un\'altra, e poi basta, che non sono la fiera di primavera.'),
    draw(ROAD_POOL, 'Il dono di Malva'),
    malva('In un mazzo intero ce ne sono settantotto. Quello che c\'è da sapere te l\'ho scritto sul quaderno, perché io le cose le dico una volta sola.'),
    lesson('deck'),
    malva('Adesso siediti al tavolo, che le carte si imparano leggendole. Ne leggi una a me: ho una domanda che mi gira in testa da stamattina.'),
    diary('Comare Malva mi ha presa in casa. Dice che è per la legna, però mi ha regalato due carte.'),
    step('c1.read'),
  ],

  // ---- read a card: the first reading, for Malva herself, at her table
  'c1.read': [
    N('Ti siedi al tavolo con la tovaglia rossa. Malva si asciuga le mani nel grembiule e si siede di fronte a te, come farebbe una cliente qualsiasi.'),
    malva('Io ti dico cosa voglio sapere, tu giri una carta, la guardi bene e mi dici cosa ci vedi. Di quello che c\'è scritto nei libri parliamo un\'altra volta.'),
    reading('single', 'c0.malva'),
    malva('Ecco, leggere una carta sola è tutto qui: una domanda, una carta, e poche parole dette guardando in faccia chi te l\'ha chiesto.'),
    teach('single'),
    lesson('single'),
    choice(
      o('E se a una cliente dico una cosa sbagliata?', { rischio: -1 }, [
        malva('Capiterà, e più di una volta. L\'importante è che esca con una cosa da fare e non con una paura in più, perché di paure a Salem ne abbiamo già abbastanza.'),
      ], { tag: tg('m00', 'c') }),
      o('Mi aspettavo che fosse più difficile.', { rischio: 1 }, [
        malva('Anche far nascere un vitello sembra facile, a guardarlo da fuori. Ne riparliamo quando avrai davanti una vedova che piange e una carta che non ti piace.'),
      ], { tag: tg('m07', 'w') }),
    ),
    malva('Chi si fa leggere una carta lascia sempre qualcosa sul tavolo. Stasera lo faccio anch\'io, così vedi com\'è.'),
    coins(12),
    malva('Non metterle via, però, che servono subito. In fondo a questa strada, dove finiscono le case, c\'è una bottega con la porta nera: di\' che ti mando io e fatti dare dell\'incenso.'),
    flag('shop.open'),
    malva('Io lo brucio quando una donna in travaglio ha paura di non farcela. Calma i nervi a chiunque lo respiri, conestabili compresi, e una ragazza che gira di notte fa bene ad averne in borsa.'),
    diary('Ho letto la mia prima carta, per Malva. Mi ha pagata come una cliente e mi ha mandata alla bottega a comprare l\'incenso.'),
    xp(5),
    step('c1.shop'),
  ],

  // Malva at the hearth while she still has something to do for her
  'malva.nudge': [
    IF({ step: 'c1.read' },
      [malva('Il tavolo è quello lì, con la tovaglia rossa. Siediti, che le carte non mordono e io nemmeno, quasi mai.')],
      [malva('Sei ancora qui? La bottega è in fondo alla strada, dove finiscono le case, e ha la porta nera. L\'incenso da solo non viene.')]),
  ],

  // ---- errand 1, the shop: the purchase is told, then she may look at the rest
  'c1.shop': [
    N('La bottega è stretta e piena fino al soffitto di barattoli, mazzi d\'erbe e bottiglie tappate con la cera. Dietro il banco c\'è un uomo magro, che ti guarda arrivare senza smettere di pulire un bicchiere.'),
    keeper('Tu sei la ragazza nuova di Malva. Lo so perché qui dentro non entra nessuno che io non conosca, e te non ti conosco. Cosa vuole da me la levatrice, stavolta?'),
    choice(
      o('Mi manda a comprare dell\'incenso. Ho le monete contate.', { parola: 1 }, [
        keeper('Incenso per Malva, si capisce: ne brucia più lei per le partorienti che il pastore per i santi. Fanno dieci monete, e non faccio credito nemmeno a lei.'),
      ]),
      o('Prima vorrei capire cosa si vende, qui dentro.', { esplora: 1 }, [
        keeper('Cose che servono a chi gira di notte, e che non stanno scritte sull\'insegna perché l\'insegna non c\'è. Tu però sei venuta per l\'incenso di Malva, te lo leggo in faccia: fanno dieci monete.'),
      ]),
    ),
    N('Conti dieci monete sul banco, e lui ti passa un sacchetto di tela che profuma di resina.'),
    coins(-10),
    tool('incense', 1),
    keeper('Già che ti piacciono le figure: il merciaio, su al mercato, tiene sotto il banco una carta con un tale in piedi davanti a un tavolo. Sul tavolo ha una coppa, una spada, un bastone e una moneta.'),
    keeper('Vuol dire che ha tutto quello che gli serve, e sa di averlo. Il merciaio invece non ha capito cos\'ha in mano, e una che sa guardare gliela troverebbe sotto il naso.'),
    flag('side.m01'),
    keeper('Il resto della merce guardalo pure, che guardare non costa niente. Per comprare torna quando avrai in tasca qualcosa di più.'),
    open('shop.open'),
    diary('Ho comprato l\'incenso alla bottega con la porta nera. Il bottegaio dice che il merciaio del mercato nasconde una carta sotto il banco.'),
    xp(5),
    step('c1.back'),
  ],

  // ---- back to Malva: what the incense is to her, and errand 2
  'c1.back': [
    malva('Fammelo annusare un momento. Sì, ti ha dato quello buono: quando vuole fare il furbo ci mescola la segatura. Tienilo tu, che è tuo.'),
    malva('Quando sono arrivata io a Salem avevo la tua età e una borsa più piccola della tua. La levatrice di allora mi mandò alla stessa bottega, la prima sera, e mi fece pagare di tasca mia.'),
    choice(
      o('E poi ti sei trovata bene, qui a Salem?', { esplora: 1 }, [
        malva('Mi sono trovata da fare, che è meglio. Chiedersi se si sta bene o male è roba da gente che ha tempo, e io ho avuto trecento bambini da far nascere.'),
      ]),
      o('Almeno a me le monete le hai date tu.', { tono: -1 }, [
        malva('Appunto, e non farci l\'abitudine. È stata l\'ultima volta che pago qualcuno per sentirmi dire una cosa che sapevo già.'),
      ]),
    ),
    malva('Adesso un\'altra commissione, e poi ti lascio andare a dormire. Questo fagotto è per Tabita, la lavandaia: a quest\'ora la trovi col suo secchio davanti alla casa delle riunioni, nella parte alta del paese.'),
    malva('Dentro c\'è l\'unguento per le mani, che d\'inverno le si spaccano fino al sangue. Le ho fatto nascere sei figli e non mi ha mai dato una moneta, però il bucato di casa mia lo fa lei da vent\'anni.'),
    malva('La tua capanna è poco oltre, in cima alla strada che sale, proprio al limite del bosco. Ha un tetto, un letto e un tavolo, e per stanotte ti deve bastare.'),
    malva('Ti dico un\'ultima cosa: di notte girano i conestabili con le lanterne, e alle ragazze sole fanno domande, perché sono convinti che una ragazza perbene risponda senza esitare.'),
    malva('Se capita anche a te non scappare e non agitarti: pensa alle carte che hai guardato stasera e rispondi con calma. Quelle le sai già meglio di loro.'),
    diary('Malva mi ha dato un fagotto da portare alla lavandaia Tabita, nella parte alta del paese. La mia capanna è poco più su.'),
    step('c1.deliver'),
  ],

  // ---- errand 2: the washerwoman in front of the meeting house (she speaks through the narrator)
  'c1.deliver': [
    N('Davanti alla casa delle riunioni una donna rompe il ghiaccio in un secchio con il manico della spazzola. Ha le mani rosse e screpolate, e quando vede il fagotto capisce subito chi ti manda.'),
    N('«Sei la ragazza di Malva! Dammi qua, che lo aspetto da domenica. Quella donna mi ha fatto nascere sei figli senza volere un grazie, e adesso mi manda pure l\'unguento a casa.»'),
    choice(
      o('«Malva dice che il suo bucato lo fate voi da vent\'anni.»', { parola: 1 }, [
        N('«Da ventuno, se è per questo, e non le ho mai fatto pagare un fazzoletto. Tra noi due funziona così: lei non ringrazia e io non presento il conto.»'),
      ]),
      o('«Vi fanno molto male, le mani?»', { tono: 1 }, [
        N('«D\'inverno sì, ma con questo passa in tre giorni. Sei gentile a chiederlo: le ragazze di solito guardano il secchio e cambiano strada, per paura che le metta a lavare.»'),
      ]),
    ),
    N('«In cambio ti dico una cosa, visto che le figure sono il vostro mestiere. Là dentro, nella Bibbia grande, qualcuno ha infilato una carta: c\'è un vecchio seduto con la mano alzata, e due in ginocchio che lo ascoltano.»'),
    N('«Mia nonna diceva che è la carta di chi insegna le regole e di chi le impara. Il pastore sfoglia quel libro ogni domenica e non se n\'è mai accorto, il che la dice lunga.»'),
    flag('side.m05'),
    N('Prima di tornare al suo secchio ti mette in mano tre monete. «Queste sono per la strada che hai fatto. L\'unguento a Malva lo pago in lenzuola.»'),
    coins(3),
    diary('Ho portato l\'unguento alla lavandaia Tabita. Dice che nella Bibbia grande della casa delle riunioni è nascosta una carta.'),
    xp(5),
    step('c1.cottage'),
  ],

  // ---- the cottage: home, and Tartufo makes himself at home
  'c1.cottage': [
    travel('cottage.table'),
    N('La capanna è una stanza sola, con un tavolo, un letto e un focolare piccolo che qualcuno ha già acceso. C\'è odore di fumo vecchio e di mele messe a seccare.'),
    choice(
      o('È piccola e storta, ma mi piace già.', { guida: 1 }, [
        T('Appendo il mantello al chiodo dietro la porta, e mi sembra di averlo sempre appeso lì.'),
      ], { tag: tg('m03', 'c') }),
      o('Ci sarà da lavorare, a cominciare dal tetto.', { guida: -1 }, [
        T('Conto tre macchie di umido sul soffitto e decido che domani, con la luce, comincio da quella sopra il letto.'),
      ], { tag: tg('m04', 'p') }),
    ),
    cat('Il letto è già scaldato, perché ci dormo io da tre inverni. Malva ripeteva ogni anno che avrebbe mandato una ragazza, e nel frattempo qualcuno doveva pur tenere la casa.'),
    choice(
      o('Divido con lui il pane che mi è rimasto in borsa.', { tono: 1 }, [
        cat('Pane, a un gatto. Lo accetto soltanto per non offenderti.'),
        N('Lo mangia tutto, briciole comprese, e poi si lecca i baffi guardando da un\'altra parte.'),
      ], { flag: 'cat.fed', tag: tg('m14', 'c') }),
      o('Lo lascio in pace: ha l\'aria di uno che non chiede niente.', { guida: -1 }, [
        cat('Brava, vedo che hai capito con chi hai a che fare. Il pane che hai in borsa me lo prendo da solo più tardi, quando dormi.'),
      ], { flag: 'cat.proud', tag: tg('m08', 'w') }),
    ),
    cat('Ti conviene tenermi, comunque. Le carte nascoste le sento dall\'odore, come i topi, e i conestabili li sento ancora prima: se mi vedi il pelo dritto sulla schiena, ne sta arrivando uno.'),
    cat('Hai un quaderno, in quella borsa? Io al posto tuo mi siederei al tavolo e ci scriverei le carte di stasera, prima che una notte di sonno te le porti via.'),
    diary('Ho una capanna al limite del bosco, e dentro c\'era già Tartufo, che ha un\'opinione su tutto.'),
    step('c1.grimoire'),
  ],

  // ---- open the grimoire: the game opens it for her, here, the first time
  'c1.grimoire': [
    T('Mi siedo al tavolo e tiro fuori il quaderno che mi porto dietro da casa. Le prime pagine le ho già riempite stasera, quasi senza accorgermene.'),
    open('grimoire.open', { tab: 'io' }),
    cat('Hai una bella calligrafia, per una con le dita gelate. Io non so leggere, ma le figure le capisco, e quel ragazzo col fagotto in prima pagina ha qualcosa di tuo.'),
    N('Qualcuno bussa alla porta. Sono tre colpi leggeri, come fa chi spera di non essere sentito dai vicini.'),
    cat('A quest\'ora bussano soltanto quelli che di giorno si vergognano. Falli sedere qui e fai come hai fatto da Malva: una domanda, una carta.'),
    xp(5),
    step('c1.client'),
  ],
};
