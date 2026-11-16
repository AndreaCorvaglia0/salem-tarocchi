// The scenes round the trials (the trials themselves are data: src/data/trials/). For each trial one script,
// `trial.<id>.door`, played at the place where it starts:
//   the first time   the scene that opens it: why she should come, one choice that is hers by character (a
//                    special answer by trait or trust), what the witch or Tartufo senses she should go over
//                    in the library first (`trial.sense`), a diary line; flag `trial.<id>.offered`;
//   then             the trial (`trial.start`); if she comes back after a failed side trial, the witch
//                    remembers it first; afterwards a diary line by outcome (the prize, or what it cost).
// The lines that remember a prize or a failure later on are here too (in the opening of the other trial
// of the same witch) and in barks.js (Tartufo).
// The world finds each door through a CAST entry pushed here, with the same id and conditions as the one
// glue/trials.js adds for `start.at`: the world shows the first matching entry per id, so this one wins and
// the glue's (which starts the trial at once) stays behind as a fallback.
import { N, T, malva, ortica, edera, ginepra, cat, o, sp, choice, IF, flag, diary, open } from '../h.js';
import { CAST } from '../cast.js';
import { TRIALS } from '../../trials/index.js';

const f = (id, k) => `trial.${id}.${k}`;
const failedOnly = (id) => [{ flag: f(id, 'fail') }, { notFlag: f(id, 'pass') }, { notFlag: f(id, 'perfect') }];
const won = (id) => ({ any: [{ flag: f(id, 'pass') }, { flag: f(id, 'perfect') }] });
const yours = { tag: '[È da te]' };
// diary lines by outcome, written once each
const coda = (id, d) => ['perfect', 'pass', 'fail'].map((k) => IF([{ flag: f(id, k) }, { notFlag: f(id, `${k}.told`) }], [diary(d[k]), flag(f(id, `${k}.told`))]));
const door = (id, { offer, note, again = [], after }) => [
  IF({ notFlag: f(id, 'offered') },
    [...offer, open('trial.sense', id), flag(f(id, 'offered')), diary(note)],
    [IF(failedOnly(id), again), open('trial.start', id), ...coda(id, after)]),
];

export const TRIAL_SCRIPTS = {
  // ---- the three main trials ---------------------------------------------------------------------
  'trial.night.door': door('night', {
    offer: [
      N('Nel vicolo di sotto Malva sta legando un panno sopra un cesto, e quando ti vede non smette di fare il nodo.'),
      malva('Stanotte ho un lavoro da fare, e mi serve una che cammini piano. Qui in strada non ti dico altro, perché in questo vicolo anche i muri vanno a messa.'),
      IF({ flag: 'item.il cucchiaio d\'argento di Malva' }, [malva('Dopo la notte dai Proctor so che cosa vali, ed è per questo che lo chiedo a te e non a un\'altra.')]),
      IF(failedOnly('vigil'), [malva('Dai Proctor è andata com\'è andata, e non l\'ho dimenticato. Stanotte però mi servi lo stesso, e voglio vedere se da allora hai imparato qualcosa.')]),
      choice(
        o('Le chiedo che cosa c\'è nel cesto.', { esplora: 1 }, [malva('Unguenti, e una cosa o due che un conestabile chiamerebbe con un altro nome. Meno ne sai e meglio dormi, almeno fino a stanotte.')]),
        o('Le chiedo soltanto a che ora devo venire.', { esplora: -1 }, [malva('Quando si spegne l\'ultima finestra della piazza. Mi piace la gente che fa la domanda che serve, e nessun\'altra.')]),
        sp('trait', { trait: ['rischio', '<=', -3] }, 'Le dico che prima voglio vedere la strada di giorno.', { rischio: -1 }, [malva('Ecco una che ragiona come me. Fatti un giro adesso, conta le lanterne e guarda dove il muro fa ombra: stanotte mi dirai tu da che parte passare.')], yours),
      ),
      malva('Prima di stanotte, però, passa dai libri. Lo sento nel ginocchio buono: conteranno le carte che dicono di andare e quelle che dicono di aspettare, e il Matto, che parla di chi parte. Riguardati anche il Carro.'),
    ],
    note: 'Malva ha un cesto da far uscire dal villaggio stanotte, e vuole me. Prima mi conviene ripassare in biblioteca, nella casa di ardesia della parte alta, e poi tornare da lei nel vicolo di sotto.',
    after: {
      perfect: 'Il cesto di Malva è oltre il cancello, e nessuno ci ha viste. Mi ha dato il lume cieco di sua madre, quello con lo sportello che nasconde la fiamma, e due coni del suo incenso.',
      pass: 'Il cesto di Malva è arrivato oltre il cancello. Qualche spavento ce lo siamo preso, ma lei dice che alla sua prima notte fece di peggio.',
      fail: 'La notte del cesto è andata male: metà delle boccette rotte, le mie monete in mano a un conestabile, e Malva che per qualche giorno non vuole sentirne parlare.',
    },
  }),
  'trial.fog.door': door('fog', {
    offer: [
      N('Allo stagno Ortica sta affilando una falce piccola su un sasso, e parla alla falce finché non si accorge di te.'),
      ortica('Ah, sei tu, proprio te cercavo! Fra due sere la luna è giusta per la barba di bosco, che cresce al limite del bosco fitto e in nessun altro posto. Ci vado da trent\'anni, e quest\'anno ci vieni anche tu.'),
      IF({ flag: 'item.il coperchio con la faccia' }, [ortica('Una che mi ha riportato il paiolo di mia madre con il coperchio può benissimo riportarmi a casa dalla nebbia, dico io.')]),
      IF(failedOnly('kettle'), [ortica('Del paiolo non parliamo, che mi viene ancora il nervoso. Però nel bosco si ricomincia sempre da capo, ed è il bello del bosco.')]),
      choice(
        o('Le chiedo se quella nebbia è pericolosa davvero.', { rischio: -1 }, [ortica('Pericolosa no, è dispettosa: ti riporta sempre dove sei partita, e intanto viene notte. Chi ci ha lasciato le penne è perché si è messo a correre.')]),
        o('Le dico che la nebbia non mi fa paura.', { rischio: 1 }, [ortica('Lo dicevo anch\'io, e la prima volta ci ho girato dentro fino all\'alba cantando per farmi coraggio. Vedremo chi delle due canta meglio.')]),
        sp('trait', { trait: ['guida', '<=', -3] }, 'Le chiedo se c\'è una regola per uscirne.', { guida: -1 }, [ortica('Senti questa, che vuole le regole! Ce ne sono due, una di mia nonna e una dei carbonai, e te le dico quando saremo là, perché a dirle prima portano male.')], yours),
      ),
      ortica('Prima però fai un salto dai libri, che io queste cose le sento nelle ginocchia. Serviranno le carte del sì e del no, e la Ruota, che fa tornare ogni cosa al punto di prima. Guarda anche la Forza, che non guasta mai.'),
    ],
    note: 'Ortica mi vuole con sé al limite del bosco fitto, a tagliare la barba di bosco. Prima ripasso in biblioteca, e poi la raggiungo allo stagno.',
    after: {
      perfect: 'Siamo uscite dalla nebbia del bosco fitto senza sbagliare una svolta, con due sacchi pieni. Ortica mi ha dato il suo incenso di barba di bosco e il suo fischietto d\'osso.',
      pass: 'La nebbia ci ha fatto girare un po\', ma la barba di bosco è nel sacco e noi siamo intere.',
      fail: 'La nebbia del bosco fitto ci ha tenute fino a notte fonda. Il sacco è rimasto là dentro con quello che ho perso dalla borsa, e Ortica per ora non mi vuole vedere.',
    },
  }),
  'trial.cellars.door': door('cellars', {
    offer: [
      N('Nella cantina sotto la botola qualcuno ha lasciato una candela accesa su una botte, e accanto alla candela c\'è il bastone di Edera, appoggiato come un biglietto.'),
      cat('(La vecchia è passata di qui, o ha mandato qualcuno. Vuole parlarti delle porte di sotto, e quando Edera vuole una cosa lascia sempre il bastone al posto suo.)'),
      IF({ flag: 'item.il pendolo della nonna di Edera' }, [T('Da quando le ho riportato il pendolo di sua nonna, Edera mi chiede cose che prima non chiedeva a nessuna.')]),
      IF(failedOnly('room'), [T('Dopo la stanza murata pensavo che Edera non mi avrebbe più chiesto niente del genere. Evidentemente mi sbagliavo, e non so se esserne contenta.')]),
      choice(
        o('Prendo il bastone, per riportarglielo io.', { tono: 1 }, [cat('(Fai bene, perché se glielo riporti tu ti dirà tutto senza che tu debba chiedere.)')]),
        o('Lo lascio dov\'è, e guardo dove portano i corridoi.', { esplora: 1 }, [cat('(Da qui ne partono tre, e io ne ho annusati due. Il terzo sa di ferro e di gente che dorme vestita.)')]),
        sp('trait', { trait: ['parola', '<=', -3] }, 'Resto ferma al buio ad ascoltare, prima di toccare qualunque cosa.', { parola: -1 }, [N('Da qualche parte, lontano, qualcuno russa, e più lontano ancora gocciola dell\'acqua. Quando torni a respirare sai già da che parte stanno le celle.')], yours),
      ),
      cat('(Prima di tornare qui passa dai libri. Io sento odore di carte capovolte, e di carte che dicono sì e no. Guarda anche le figure, e il Diavolo, che quaggiù è di casa.)'),
    ],
    note: 'Edera vuole che impari la strada delle cantine fino alla porta delle celle. Prima ripasso in biblioteca, e poi torno alla cantina sotto la botola.',
    after: {
      perfect: 'Conosco i quattro passaggi delle cantine, e Edera dice che sono come li ricordava. Mi ha dato la chiave della cantina grande e la mirra che brucia una volta l\'anno.',
      pass: 'Sono arrivata alla porta delle celle e sono tornata. Edera dice che dove ho sbagliato io ha sbagliato anche lei, alla mia età.',
      fail: 'Nelle cantine è andata male. Un conestabile mi ha vuotato la borsa, e quello che manca lo ritrovo al deposito del tribunale. Edera è stata in pensiero, e ci metterà un po\' a perdonarmelo.',
    },
  }),

  // ---- the six side trials -----------------------------------------------------------------------
  'trial.vigil.door': door('vigil', {
    offer: [
      N('Nella parte alta, sotto una finestra con le imposte accostate, Malva parla a bassa voce con una donna che tiene il grembiule stretto fra le mani. Quando la donna rientra, Malva ti fa segno di avvicinarti.'),
      malva('Quella è la Proctor. Ha il piccolo con la febbre da tre giorni, e un marito che preferirebbe vederlo morire da cristiano che guarire per mano mia. Stanotte, quando lui dorme, mi apre lei.'),
      malva('Di solito ci vado da sola. Ma ho visto come hai tenuto la carta la prima sera, e a un letto come quello due che sanno guardare valgono più di una.'),
      choice(
        o('Le dico che vengo, e che porto io la borsa.', { tono: 1 }, [malva('La borsa la porto io, che so dove sta ogni cosa al buio. Tu porta le mani pulite e gli occhi aperti.')]),
        o('Le chiedo che cosa succede se il marito si sveglia.', { rischio: -1 }, [malva('Succede che ci parlo io, e che tu stai un passo indietro con l\'aria di una nipote. Hai la faccia adatta, per fortuna.')]),
        sp('witch', { trust: ['malva', '>=', 2] }, 'Le chiedo perché ci va, se in quella casa la disprezzano.', { parola: 1 }, [malva('Perché quel bambino l\'ho tirato fuori io, cinque anni fa, con il cordone intorno al collo. A te lo dico: quando ne hai fatto nascere uno, poi è un po\' tuo, qualunque cosa pensi suo padre.')], { tag: '[Malva si fida]' }),
        sp('trait', { trait: ['tono', '>=', 3] }, 'Le chiedo come sta la madre.', { tono: 1, guida: 1 }, [malva('Ecco una domanda che non mi fa mai nessuno. Sta in piedi da tre notti, e se non la mettiamo a sedere avremo due malati invece di uno.')], yours),
      ),
      cat('(Fidati del mio naso: stanotte conteranno le carte che dicono vai e quelle che dicono aspetta. Poi il Matto, e il Carro. Passa dai libri prima che faccia buio.)'),
    ],
    note: 'Stanotte Malva va dai Proctor, nella parte alta, per un bambino con la febbre, e vuole che l\'accompagni. Prima ripasso in biblioteca, e poi torno sotto la finestra accesa.',
    again: [malva('Il piccolo dei Proctor ha di nuovo la febbre, e la madre ha mandato a chiamare un\'altra volta. Dell\'altra notte non parlo: se sei qui è per fare meglio, e mi basta.')],
    after: {
      perfect: 'Il bambino dei Proctor è fuori pericolo, e il padre mi ha perfino chiesto una carta. Malva mi ha dato il cucchiaio d\'argento con cui ha dato da bere a tutti i bambini di Salem: adesso sta nella mia borsa.',
      pass: 'Il bambino dei Proctor dorme, e la febbre è scesa. Non è andato tutto liscio, ma Malva dice che una notte di sonno aggiusta il resto.',
      fail: 'Dai Proctor è andata male: il bambino si riprenderà, ma il padre ci ha messe alla porta davanti ai vicini, e Malva ha finito il suo unguento buono. Potrò riprovare un\'altra notte.',
    },
  }),
  'trial.well.door': door('well', {
    offer: [
      N('Tartufo è seduto sul bordo del pozzo della piazza e guarda giù, con le orecchie puntate in avanti. Quando ti avvicini non si volta.'),
      cat('(Là sotto c\'è qualcosa di vivo. L\'ho sentito cadere ieri sera, e da allora si lamenta a intervalli, sempre più piano. Di giorno, con la piazza piena, non si può fare niente.)'),
      cat('(Non te lo chiederei, se potessi scendere io. Stanotte, quando la ronda ha fatto il primo giro, voglio che tu venga qui con me.)'),
      choice(
        o('Gli dico che ci sarò, e che porto una corda.', { rischio: 1 }, [cat('(La corda non serve, c\'è una scala di ferro. Però mi piace che ci hai pensato.)')]),
        o('Gli chiedo che cosa crede che sia.', { esplora: 1 }, [cat('(Dall\'odore direi un gatto, e non uno piccolo. Ma è un odore che conosco e non mi piace, quindi preferisco sbagliarmi.)')]),
        sp('tartufo', { tartufo: 2 }, 'Lo prendo in braccio, e gli dico che lo tiriamo fuori insieme.', { tono: 1 }, [cat('(Mettimi giù, che ci guardano. Va bene, ancora un momento, ma soltanto perché stanotte ho dormito male.)')]),
      ),
      cat('(Prima passa dai libri, già che c\'è luce. Io sento che conteranno le carte che dicono vai e quelle che dicono fermati, e il Matto. Guarda anche l\'Imperatrice, che di creature ne capisce.)'),
    ],
    note: 'Nel pozzo della piazza è caduto qualcosa di vivo, e Tartufo vuole che stanotte scenda a prenderlo. Prima ripasso in biblioteca, e poi torno al pozzo.',
    again: [cat('(È ancora laggiù, e si sente appena. L\'altra notte è andata come è andata, e i topi te li ho portati. Stanotte riproviamo, e scendi con più giudizio.)')],
    after: {
      perfect: 'In fondo al pozzo c\'era il gatto del Giudice, con una zampa rotta, e l\'abbiamo riportato sulla sua stuoia. Mi ha lasciato il suo sonaglio d\'argento, che Tartufo non vuole portare e che tengo io.',
      pass: 'Abbiamo tirato fuori dal pozzo il gatto del Giudice e l\'abbiamo lasciato davanti al tribunale. Tartufo dice che del resto non vuole sentir parlare.',
      fail: 'Il gatto del Giudice è salvo, ma io sono tornata a casa zoppicando e con la borsa mezza vuota, e qualcuno dal tribunale mi ha vista. Tartufo, per scusarsi, mi porta dei topi.',
    },
  }),
  'trial.kettle.door': door('kettle', {
    offer: [
      N('Al confine del bosco, dietro la pietra che segna la fine delle terre di Salem, Ortica spia un carro fermo sulla strada del mare e borbotta fra i denti.'),
      ortica('Lo vedi quel carro? È del calderaio, che tre settimane fa si è preso il paiolo di mia madre per stagnarlo, con dodici monete in anticipo. Domani all\'alba parte per la costa, e il paiolo è ancora lì sopra!'),
      ortica('Di giorno ha un cane grosso come un vitello e una lingua più lunga della mia. Stanotte, però, dorme anche lui, e io vado a riprendermi quello che è mio. Tu hai le mani leggere, l\'ho visto subito.'),
      IF({ flag: 'item.il fischietto d\'osso di Ortica' }, [ortica('E poi con te sono uscita dalla nebbia, che è peggio di qualunque calderaio.')]),
      IF({ flag: 'trial.fog.fail' }, [ortica('Sì, lo so, nella nebbia è finita male. Ma lì c\'entrava la Luna, e qui c\'entra soltanto un uomo che russa.')]),
      choice(
        o('Le dico che è una cosa da fare, e che ci sto.', { rischio: 1 }, [ortica('Lo sapevo che ci stavi! Ginepra dice che sei prudente, ma Ginepra non capisce niente di persone.')]),
        o('Le chiedo perché non glielo chiede e basta.', { parola: 1 }, [ortica('Gliel\'ho chiesto sette volte, e sette volte mi ha detto domani. All\'ottava si passa ai fatti, è una regola di mia nonna.')]),
        sp('trait', { trait: ['rischio', '>=', 3] }, 'Le dico che ci vado io da sola, e lei fa il palo.', { rischio: 1, guida: -1 }, [ortica('Ah no, bella mia, il paiolo è mio e il divertimento pure! Però mi piace come ragioni: stanotte la prima a muoversi sei tu.')], yours),
        sp('witch', { trust: ['ortica', '>=', 2] }, 'Le chiedo perché tiene tanto a quel paiolo.', { tono: 1 }, [ortica('Perché mia madre ci ha fatto la zuppa il giorno che sono nata, e io ci ho fatto la sua l\'ultima sera. A te lo dico, ma se lo ripeti a Malva dico che te lo sei inventato.')], { tag: '[Ortica si fida]' }),
      ),
      ortica('Prima di stanotte vai a ripassare, che io sento prurito al naso, ed è segno di carte. Conteranno quelle che dicono vai e quelle che dicono fermati, e il Matto, e la Forza, che con i cani serve sempre.'),
    ],
    note: 'Stanotte Ortica va a riprendersi il paiolo di sua madre dal carro del calderaio, al confine del bosco, e mi vuole con sé. Prima ripasso in biblioteca.',
    again: [ortica('Il calderaio ha rimandato la partenza di un giorno, perché gli si è rotta una ruota, e io dico che è un segno. L\'altra notte me la sono legata al dito, ma stanotte si riprova, e stavolta si fa come dice la carta.')],
    after: {
      perfect: 'Ortica ha di nuovo il paiolo di sua madre. A me ha lasciato le sue dodici monete e il coperchio di rame, quello a cui la bambina del calderaio aveva disegnato una faccia: sta sulla mensola della capanna, e mi guarda.',
      pass: 'Il paiolo di Ortica è tornato a casa. Non è andata liscia come lei la racconterà al mulino, ma questo resta fra noi.',
      fail: 'Al carro del calderaio è andata male: siamo tornate a mani vuote, la bambina si è svegliata piangendo, e Ortica stasera non vuole vedere nessuno. Potrò riprovare un\'altra notte.',
    },
  }),
  'trial.grave.door': door('grave', {
    offer: [
      N('Al limite del bosco, seduta su un ceppo con le mani in grembo, c\'è la vedova Bray. Ha l\'aria di aspettare da un pezzo, e quando ti riconosce si alza troppo in fretta.'),
      N('«Figliola, speravo proprio che passaste di qui. Voi mi avete letto le carte la sera che nevicava, e quello che avete detto si è avverato, parola per parola. Per questo vengo da voi, e non dal ministro.»'),
      N('«Domani notte fa un anno che ho seppellito Josiah. Ogni mese, sulla sua pietra, trovo una candela che non ho acceso io. Devo sapere chi viene da lui di notte, e da sola nel bosco non ci vado.»'),
      choice(
        o('Le dico che l\'accompagno io.', { tono: 1 }, [N('«Lo sapevo che avreste detto di sì. Avete la stessa faccia di quando giravate le carte: di una che non scappa.»')]),
        o('Le chiedo di chi ha paura che sia.', { parola: 1 }, [N('La vedova abbassa gli occhi. «Di una donna, se proprio volete saperlo. Trent\'anni di matrimonio, e adesso mi viene questo pensiero. Vedete che ho bisogno di andarci?»')]),
        sp('pop', { pop: 2 }, 'Le dico che ormai in tante vengono da me, e che nessuna è rimasta sola.', { guida: 1 }, [N('«Lo dicono anche al lavatoio. Dicono che la ragazza della capanna non manda via nessuno, e io ho pensato: allora non manderà via nemmeno una vecchia con una fissazione.»')]),
        sp('trait', { trait: ['guida', '>=', 3] }, 'Le prendo le mani, che sono gelate, e gliele tengo finché non smette di tremare.', { guida: 1, tono: 1 }, [N('La vedova ti lascia fare, e per un momento non è più una vedova ma una donna stanca. «Josiah faceva così. Non diceva niente, e mi scaldava le mani.»')], yours),
      ),
      cat('(Questa ci porta al cimitero di notte, lo sento. Passa dai libri: conteranno le carte del sì e del no, e poi quel vecchio con la lanterna, e la Morte, che in un posto così è di casa e non fa male a nessuno.)'),
    ],
    note: 'La vedova Bray vuole sapere chi accende una candela sulla tomba di suo marito, e mi ha chiesto di accompagnarla di notte al cimitero del bosco. Prima ripasso in biblioteca, e poi la raggiungo al limite del bosco.',
    again: [N('«Figliola, ci ho pensato. Il mese è passato, la candela c\'è di nuovo, e io non ho ancora detto a quell\'uomo quello che dovevo. Se ve la sentite, stanotte ci riproviamo, e stavolta vado piano.»')],
    after: {
      perfect: 'Era il becchino ad accendere la candela sulla tomba di Josiah Bray, per un vecchio debito. La vedova mi ha dato la bussola d\'ottone del marito: la tengo in borsa, e l\'ago trema ogni volta che cammino.',
      pass: 'Ho accompagnato la vedova Bray sulla tomba del marito, e ha visto chi ci accende la candela. Qualche spavento gliel\'ho fatto prendere, ma mi ha pagata lo stesso.',
      fail: 'La notte al cimitero è andata male: la vedova Bray ha avuto più paura che pace, e io ci ho rimesso quello che avevo in borsa. Dice che fra qualche giorno possiamo riprovare.',
    },
  }),
  'trial.room.door': door('room', {
    offer: [
      N('Sotto la botola, a sinistra della scala, c\'è un arco chiuso con mattoni più chiari degli altri. Edera te ne ha parlato tenendoti il polso, con una fretta che non le avevi mai visto.'),
      T('Mi ha detto che là dietro c\'era la stanza di sua nonna, e che l\'hanno murata quando hanno fatto le prigioni. Dice che dentro è rimasta una cosa che dondola, e che non sa più se l\'ha vista o sognata.'),
      IF({ flag: 'item.la chiave della cantina grande' }, [T('Ha detto anche che una che conosce le porte di sotto è l\'unica a cui può chiederlo.')]),
      IF({ flag: 'trial.cellars.fail' }, [T('Ha detto anche che nelle cantine le ho fatto prendere uno spavento, e che questo è il modo di farmi perdonare.')]),
      choice(
        o('Appoggio l\'orecchio ai mattoni, per sentire se dietro c\'è il vuoto.', { esplora: 1 }, [N('Dietro c\'è il vuoto, e nel vuoto un filo d\'aria che sa di cera vecchia. La stanza, o qualcosa che le somiglia, c\'è ancora.')]),
        o('Ripeto a mente quello che Edera ha detto, parola per parola.', { guida: -1 }, [T('Ha detto tre cose diverse sulla strada, e una sola sulla porta. Se la conosco, quella sola è la vera.')]),
        sp('trait', { trait: ['esplora', '>=', 3] }, 'Cerco sul muro il segno di chi l\'ha chiuso.', { esplora: 1, parola: -1 }, [N('In basso, su un mattone, qualcuno ha inciso una data e una piccola croce. Chi ha murato questa stanza sapeva di chiudere qualcosa che contava, e ha voluto lasciarlo scritto.')], yours),
        sp('witch', { trust: ['edera', '>=', 2] }, 'Penso a come le tremava la voce, e decido che ci vado comunque vada.', { tono: 1 }, [T('Edera non chiede mai niente. Se stavolta ha chiesto, e a me, vuol dire che ha aspettato settant\'anni la persona giusta.')], { tag: '[Edera si fida]' }),
      ),
      cat('(Prima di infilarti là dentro passa dai libri. Sento odore di sì e di no, e di una donna seduta fra due colonne. Guarda anche la Morte: qui si tratta di una cosa finita che vuole cambiare.)'),
    ],
    note: 'Edera mi ha chiesto di cercare la stanza murata di sua nonna, dietro l\'arco sotto la botola. Prima ripasso in biblioteca, e poi torno all\'arco.',
    again: [T('Edera non me l\'ha chiesto una seconda volta, ma stamattina il bastone era di nuovo appoggiato all\'arco. Il cunicolo si è stretto, però si passa ancora.')],
    after: {
      perfect: 'Ho trovato la stanza della nonna di Edera, con tre carte ancora coperte sul tavolo. Edera mi ha lasciato il pendolo d\'ottone di sua nonna: lo tengo con le carte, e la catenella è lucida dove la tenevano le sue dita.',
      pass: 'La stanza della nonna di Edera c\'è ancora, e l\'ho vista. Il pendolo per ora resta da lei, e ogni tanto dovrò raccontarle di nuovo com\'era la polvere sul tavolo.',
      fail: 'Nella stanza murata è andata male: sono uscita a mani vuote e con un piede pesto, e il cunicolo si è chiuso di un altro palmo. Edera dice che non importa, e si vede che importa: un altro giorno potrò riprovare.',
    },
  }),
  'trial.dare.door': door('dare', {
    offer: [
      N('Davanti alla tana, a nord della capanna di Ortica, Ginepra è seduta su un sasso e lancia ghiande dentro il buio, una alla volta, ascoltando quanto ci mettono a fermarsi.'),
      ginepra('Lo sai che cosa c\'è là in fondo? Il mio nome. Ce l\'ho inciso a dodici anni, perché le ragazze grandi dicevano che non ne avevo il coraggio. Adesso che abbiamo affrontato un giudice, mi sono chiesta se ce l\'hai tu.'),
      ginepra('Scommetto il mio cappello che non arrivi in fondo. E siccome sono generosa vengo con te, così se ti perdi ci perdiamo in due.'),
      choice(
        o('Accetto la scommessa, e le dico di tenere pronto il cappello.', { rischio: 1 }, [ginepra('Ecco, questa è la risposta che volevo! Il cappello è già mezzo tuo, e l\'altra metà te la devi sudare.')]),
        o('Le chiedo che cosa c\'è davvero, in quella tana.', { rischio: -1 }, [ginepra('Buio, pipistrelli, un crepaccio e forse un tasso. Niente che una che è stata davanti al Giudice non possa guardare in faccia.')]),
        sp('trait', { trait: ['tono', '<=', -3] }, 'Le dico che se vinco voglio il cappello e anche le scuse per quando mi ha rubato Il Carro.', { tono: -1 }, [ginepra('Il Carro te l\'ho preso in prestito, e te l\'ho pure ridato! Va bene, cappello e scuse. Ma se perdi ti scusi tu, e non so ancora di che cosa.')], yours),
        sp('witch', { trust: ['ginepra', '>=', 2] }, 'Le chiedo perché ci vuole tornare proprio adesso.', { tono: 1 }, [ginepra('Perché in quella cella ho pensato a tutte le cose che avevo fatto per paura di sembrare paurosa, e questa era la prima della lista. Voglio rivederla con un\'amica accanto.')], { tag: '[Ginepra si fida]' }),
      ),
      ginepra('Prima però vai a ripassare, che non voglio vincere facile. Io punterei sulle carte del sì e del no, sul Carro perché è il mio, e sulla Luna, che là sotto ci starebbe benissimo.'),
    ],
    note: 'Ginepra scommette il suo cappello che non arrivo in fondo alla tana. Prima ripasso in biblioteca, e poi torno da lei davanti alla tana.',
    again: [ginepra('Guarda chi si rivede! Mi devi ancora da bere per l\'altra volta, e io non dimentico i debiti degli altri. Però la scommessa è sempre aperta: stesso cappello, stessa tana.')],
    after: {
      perfect: 'Ho inciso il mio segno accanto al nome di Ginepra, in fondo alla tana, e so che cosa c\'è scritto sotto. Il cappello adesso è mio, con quindici monete cucite nella fodera, e sta appeso al chiodo accanto alla porta.',
      pass: 'Sono arrivata in fondo alla tana con Ginepra, e siamo tornate. Il cappello se lo tiene ancora un po\', ma da bere ha pagato lei.',
      fail: 'Nella tana è andata male: in fondo ci sono arrivata per metà in spalla a Ginepra, la scommessa l\'ha vinta lei, e mi tocca pagarle da bere, almeno finché non riprovo.',
    },
  }),
};

// the doors in the world (see the header): same id and conditions as the entry glue/trials.js adds
const open3 = (id, main) => [f(id, 'perfect'), f(id, 'pass'), ...(main ? [f(id, 'fail')] : [])].map((k) => ({ notFlag: k }));
for (const d of Object.values(TRIALS)) {
  if (d.debug || !d.start?.at || !TRIAL_SCRIPTS[`trial.${d.id}.door`]) continue;
  const id = `trial.${d.id}`;
  if (CAST.some((c) => c.id === id)) continue;
  CAST.push({ id, kind: 'prop', at: d.start.at, when: [...[d.when ?? true].flat(), ...open3(d.id, d.main)], script: `trial.${d.id}.door`, label: d.start.label || d.title, verb: d.start.verb || 'Vai' });
}
