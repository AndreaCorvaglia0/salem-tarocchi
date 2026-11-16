// The card of the day (docs/DESIGN.md "La soglia"): for each of the 78 cards, two sentences for the day and
// three looks at the card that are not in the grimoire. `oggi`: a way to look at an ordinary day, born from
// the card's core idea. `sguardi`: k = 'immagine' (a detail of the Rider-Waite-Smith picture), 'storia'
// (older decks, old names, what changed in 1909), 'contesto' (how the meaning shifts), 'rovescio' (a nuance
// of the reversed card). Ordered with the most surprising first.
export const DAILY = {
  m00: {
    oggi: [
      "Per cominciare non serve sapere già come va a finire: può bastare il primo passo di quella cosa che rimandi finché non ti senti all'altezza.",
      "Se oggi qualcuno ti propone una cosa mai fatta, prima di rispondere che non fa per te prova a chiederti che cosa rischi davvero.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi di Marsiglia il Matto non ha numero, e in quello dei Visconti è un poveraccio vestito di stracci, con delle piume tra i capelli. Lo zero glielo danno gli occultisti dell'Ottocento, che lo mettono in testa alla fila." },
      { k: 'immagine', t: "Sul cappello ha una piuma rossa, e la stessa piuma torna in testa al bambino del Sole, quasi alla fine dei Maggiori. Chi parte e chi arriva portano lo stesso segno." },
      { k: 'contesto', t: "In amore è la voglia di buttarsi senza garanzie; sul lavoro la stessa leggerezza chiede almeno di controllare dov'è il bordo. Vicino al Diavolo avverte che il salto può essere una fuga." },
    ],
  },
  m01: {
    oggi: [
      "Quello che ti serve per cominciare è probabilmente già sul tavolo: guarda che cosa hai sotto mano prima di pensare a quello che ti manca.",
      "Una cosa detta bene oggi può cambiare una situazione più di tante cose pensate: scegli una frase che rimandi e dilla con parole tue.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei tarocchi italiani si chiama Il Bagatto, e nei mazzi di Marsiglia è un prestigiatore da fiera con dadi e bussolotti sul banco. Fu il mazzo del 1909 a mettergli davanti i quattro semi." },
      { k: 'immagine', t: "La cintura del Mago è un serpente che si morde la coda, un antico segno dell'eternità. È piccola e si nota appena, sopra il bianco della veste." },
      { k: 'rovescio', t: "Rovesciato può essere anche chi prepara il tavolo all'infinito: compra gli strumenti, mette in ordine, fa progetti, e non comincia mai perché l'inizio vero lo spaventa." },
    ],
  },
  m02: {
    oggi: [
      "Non tutto quello che sai va detto subito: puoi tenere una cosa per te ancora un giorno e vedere se domani ti sembra ancora vera.",
      "Se una persona o una proposta non ti convince e non sai dire perché, oggi non serve trovare le prove: basta prenderne nota e aspettare.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sul rotolo che tiene in grembo si leggono quattro lettere, TORA, e il resto sparisce sotto il manto. Quello che sa è scritto, ma lei ne mostra soltanto un pezzo." },
      { k: 'storia', t: "Nei mazzi antichi è La Papessa: una donna con la tiara del papa in testa. Waite ne fece una sacerdotessa e le mise accanto le due colonne del tempio di Salomone." },
      { k: 'contesto', t: "Come consiglio dice di aspettare e ascoltare prima di muoverti; come ostacolo dice che qualcuno tace una cosa che ti riguarda. Vicino al Mago: lui fa, lei sa." },
    ],
  },
  m03: {
    oggi: [
      "Le cose crescono dove qualcuno se ne occupa: oggi scegline una sola, una pianta, un'amicizia o il tuo pranzo, e dalle dieci minuti veri.",
      "Un piacere piccolo non va guadagnato prima: se oggi qualcosa di buono ti capita davanti, prova a godertelo senza fare il conto di quanto lo meriti.",
    ],
    sguardi: [
      { k: 'storia', t: "La Golden Dawn le assegnò la lettera ebraica Daleth, che significa porta. Nei mazzi più antichi l'Imperatrice teneva uno scudo con l'aquila imperiale: il segno di Venere è arrivato dopo." },
      { k: 'immagine', t: "Waite scrive che le stelle della corona sono dodici: c'è chi ci legge i mesi dell'anno e chi i segni dello zodiaco. Al collo porta un filo di perle." },
      { k: 'rovescio', t: "Rovesciata parla anche di chi non riesce a ricevere: prepara la cena per tutti e resta in piedi, e se qualcuno insiste perché si sieda risponde che non ha fame." },
    ],
  },
  m04: {
    oggi: [
      "Un po' d'ordine regge la giornata meglio della buona volontà: decidi adesso le due cose che contano e lascia che il resto si adatti.",
      "Dire un no chiaro a volte è il modo più gentile di proteggere qualcosa: guarda se oggi c'è un confine che tocca a te mettere.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le teste di montone sul trono sono quattro: due sui braccioli e due in cima allo schienale. Quattro è anche il numero della carta, e la tradizione lo lega a ciò che sta saldo." },
      { k: 'storia', t: "Nei mazzi di Marsiglia l'Imperatore è seduto di profilo, con le gambe incrociate e uno scudo con l'aquila. Nel 1909 viene girato di fronte, e sotto il manto compare un'armatura." },
      { k: 'contesto', t: "Sul lavoro è una buona notizia: un contratto, un capo che decide, un piano che regge. In amore chiede attenzione, perché proteggere e comandare, visti da vicino, si somigliano." },
    ],
  },
  m05: {
    oggi: [
      "Prima di inventare un modo tuo, chiedi a chi quella cosa l'ha già fatta cento volte: oggi una domanda semplice può risparmiarti una settimana.",
      "Certe abitudini le segui perché le hai scelte e altre perché le hai trovate: oggi guardane una e chiediti a quale dei due gruppi appartiene.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi antichi si chiama Il Papa. Waite lo chiamò Ierofante, come il sacerdote che nell'antica Grecia guidava i riti dei misteri di Eleusi." },
      { k: 'immagine', t: "Sulle scarpe bianche ha due piccole croci, e altre tre scendono lungo la stola. Dei due chierici vedi soltanto la nuca rasata: chi guarda la carta è in fila dietro di loro." },
      { k: 'rovescio', t: "Rovesciato non è per forza ribellione. A volte è il consiglio buono che arriva da chi non ha titoli: una nonna, un vicino, uno che il mestiere l'ha imparato facendolo." },
    ],
  },
  m06: {
    oggi: [
      "Una scelta piccola dice che cosa ti sta a cuore quanto una grande: oggi, davanti a due possibilità, prova a seguire quella che ti somiglia di più.",
      "Stare bene con qualcuno non vuol dire pensarla uguale: se oggi salta fuori una differenza, guardala con curiosità prima di volerla sistemare.",
    ],
    sguardi: [
      { k: 'immagine', t: "Segui gli sguardi: l'uomo guarda la donna, e la donna guarda l'angelo. Nessuno dei due guarda l'albero che ha alle spalle." },
      { k: 'storia', t: "Nei mazzi di Marsiglia la scena era un'altra: un giovane fermo tra due donne, e sopra di loro Cupido con l'arco teso. Il giardino con l'angelo è del 1909." },
      { k: 'contesto', t: "Fuori dall'amore è spesso un bivio di lavoro o di casa, e chiede quale delle due strade ti somiglia. Vicino al Diavolo distingue il legame scelto da quello che non riesci a mollare." },
    ],
  },
  m07: {
    oggi: [
      "Se una parte di te vuole correre e un'altra vuole restare a letto, non serve metterle d'accordo: scegli una direzione per oggi e portale tutte e due.",
      "Una meta piccola e chiara vale più di tanta fretta: decidi a che punto vuoi trovarti stasera con una cosa sola, e togli di mezzo una distrazione.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi di Marsiglia il carro è tirato da due cavalli. Le sfingi arrivano nell'Ottocento, da un disegno dell'occultista francese Éliphas Lévi, e il mazzo del 1909 le riprende." },
      { k: 'immagine', t: "Dietro il carro scorre un fiume, e la città resta dall'altra parte. Il guerriero se l'è lasciata alle spalle: è già partito, anche se le sfingi sono ancora accucciate." },
      { k: 'rovescio', t: "Rovesciato può voler dire che una delle due sfingi ha già scelto per te: continui a tirare dritto per orgoglio, su una strada che una parte di te ha smesso di volere." },
    ],
  },
  m08: {
    oggi: [
      "Con una paura o con un nervoso oggi funziona meglio la mano aperta del pugno: prova a parlarle piano, come faresti con un animale agitato.",
      "La pazienza con una persona difficile non è debolezza, se la scegli tu: guarda se oggi puoi rispondere un tono più basso di quello che ricevi.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi antichi La Forza era l'undicesima carta e La Giustizia l'ottava. Fu Waite a scambiarle, nel 1909, perché la Forza cadesse sotto il segno del Leone." },
      { k: 'immagine', t: "Il leone ha la coda tra le zampe e tira fuori la lingua, come un cane che si lascia fare. Lei è china su di lui e porta fiori anche alla cintura." },
      { k: 'contesto', t: "In amore è la pazienza con un brutto carattere, compreso il tuo. Sul lavoro è reggere una persona difficile senza alzare la voce. Come ostacolo dice che stai tenendo a bada troppo." },
    ],
  },
  m09: {
    oggi: [
      "Per capire che cosa pensi davvero di una cosa ti serve un po' di silenzio: oggi cerca mezz'ora senza voci, nemmeno quelle del telefono.",
      "Non serve vedere tutta la strada per muoversi: forse oggi basta sapere qual è il prossimo passo, e lasciare gli altri a quando ci arrivi.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi dipinti a mano del Quattrocento il vecchio aveva in mano una clessidra, non una lanterna, e la carta era chiamata anche Il Tempo." },
      { k: 'immagine', t: "Tiene la lanterna all'altezza del viso ma guarda in basso, con le palpebre abbassate. La luce non serve a lui: è per chi lo vede da lontano, più giù sulla montagna." },
      { k: 'rovescio', t: "Rovesciato è anche il consiglio che non vuoi chiedere: fai tutto per conto tuo per non disturbare, e intanto giri in tondo su una cosa che un'altra persona vedrebbe subito." },
    ],
  },
  m10: {
    oggi: [
      "Una giornata storta non è un giudizio su di te, e nemmeno una fortunata: le cose girano, e oggi puoi guardare a che punto del giro sei.",
      "Certe occasioni passano una volta e non aspettano che tu abbia finito di pensarci: se oggi ne vedi una piccola, allunga la mano.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le quattro lettere sulla ruota, lette in tondo, fanno TARO; partendo da un'altra fanno ROTA, che in latino vuol dire ruota. In mezzo ci sono le lettere ebraiche del nome di Dio." },
      { k: 'storia', t: "Nel mazzo dei Visconti quattro persone stanno attorno alla ruota, e accanto a ognuna c'è una scritta in latino: regnerò, regno, ho regnato, sono senza regno." },
      { k: 'contesto', t: "Come risposta a una domanda secca è un sì, ma a tempo: vale adesso. Vicino a una carta di fatica come il Dieci di Bastoni dice che il periodo pesante sta per girare." },
    ],
  },
  m11: {
    oggi: [
      "Quello che fai ha un peso anche quando nessuno lo misura: oggi guarda con onestà una cosa che devi a qualcuno, o che qualcuno deve a te.",
      "Essere giusti con sé stessi vuol dire usare la stessa bilancia che usi per gli altri: prova a giudicare un tuo sbaglio come giudicheresti quello di un'amica.",
    ],
    sguardi: [
      { k: 'immagine', t: "A differenza delle statue dei tribunali, questa Giustizia non ha la benda: guarda dritto chi le sta davanti. Decide sapendo bene chi sei." },
      { k: 'storia', t: "Con la Forza e la Temperanza è una delle quattro virtù cardinali. Tre stanno nei tarocchi fin dal Quattrocento; la quarta, la Prudenza, non c'è, e nessuno sa dire con certezza perché." },
      { k: 'rovescio', t: "Rovesciata può essere anche una severità sbagliata verso di te: ti condanni per uno sbaglio con una pena che non daresti a nessun altro per la stessa cosa." },
    ],
  },
  m12: {
    oggi: [
      "Se una cosa oggi non si sblocca, forse non va spinta: lasciala ferma e prova a guardarla da un punto da cui non l'avevi mai guardata.",
      "Un'attesa non è per forza tempo perso: mentre aspetti una risposta che non dipende da te, guarda che cosa noti che di corsa non avresti visto.",
    ],
    sguardi: [
      { k: 'storia', t: "In Italia, nel Quattrocento, la carta era chiamata anche Il Traditore: i traditori venivano dipinti così sui muri delle città, appesi per un piede, per svergognarli davanti a tutti." },
      { k: 'immagine', t: "Le mani non si vedono, e niente dice che siano legate. Le gambe disegnano un quattro, le braccia un triangolo, e i capelli pendono dritti dentro la luce." },
      { k: 'contesto', t: "Sul lavoro è un progetto fermo che non dipende da te, e spingere non serve. In amore è una pausa che fa capire qualcosa. Vicino alla Morte, l'attesa è l'ultimo tratto prima di chiudere." },
    ],
  },
  m13: {
    oggi: [
      "Qualcosa che è finito occupa posto finché non lo saluti: oggi puoi chiudere una cosa piccola, un abbonamento, una chat, un cassetto, e sentire lo spazio che fa.",
      "Lasciar andare un'abitudine o un'idea di te non cancella quello che è stato: guarda se ne porti ancora addosso una che ti va stretta.",
    ],
    sguardi: [
      { k: 'storia', t: "In molti mazzi di Marsiglia questa carta non ha il nome scritto, soltanto il numero tredici, e lo scheletro va a piedi con una falce. Il cavallo e l'armatura sono del 1909." },
      { k: 'immagine', t: "Sulle redini del cavallo ci sono teschi e ossa incrociate, e sul fiume in fondo passa una piccola barca. La vita, là dietro, continua ad andare da qualche parte." },
      { k: 'rovescio', t: "Rovesciata è spesso un trasloco fatto a metà: gli scatoloni di una vita finita restano in corridoio per mesi, e ci giri intorno senza aprirli né portarli via." },
    ],
  },
  m14: {
    oggi: [
      "Tra il tutto e il niente c'è quasi sempre una misura che funziona: oggi prova la dose di mezzo in una cosa in cui di solito esageri o rinunci.",
      "Due impegni o due persone che sembrano tirare in versi opposti si possono mescolare un poco alla volta: comincia da una cosa minuscola e guarda come va.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla fronte dell'angelo c'è un cerchio con un punto al centro, il segno che gli astrologi usano per il Sole. Il triangolo sul petto è chiuso dentro un quadrato." },
      { k: 'storia', t: "È una delle virtù cardinali, e nei mazzi del Quattrocento era una donna senza ali che versava da una brocca all'altra: allungava il vino con l'acqua. Le ali sono arrivate dopo." },
      { k: 'contesto', t: "In amore è trovare un passo comune tra due abitudini diverse. Sul lavoro è la via di mezzo. Nel mazzo viene subito dopo la Morte: finito il taglio, si ricuce." },
    ],
  },
  m15: {
    oggi: [
      "C'è qualcosa che fai ogni giorno senza più sceglierlo: oggi non serve smettere, basta accorgerti del momento esatto in cui la mano parte da sola.",
      "Un desiderio forte non è una colpa, però conviene sapere chi dei due comanda: guarda se oggi una voglia decide al posto tuo dove vanno tempo e soldi.",
    ],
    sguardi: [
      { k: 'immagine', t: "Mettila accanto agli Amanti: è la stessa coppia, con il Diavolo al posto dell'angelo. La coda di lei finisce in un grappolo, quella di lui in una fiamma, come i due alberi del giardino." },
      { k: 'storia', t: "Nel mazzo dei Visconti arrivato fino a noi il Diavolo manca, e non si sa se sia andato perduto o se non sia mai stato dipinto. Quello del 1909 somiglia al Bafometto disegnato da Éliphas Lévi." },
      { k: 'rovescio', t: "Rovesciato non sempre libera subito. Può essere il momento in cui vedi la catena con chiarezza e te ne vergogni: è scomodo, ma è già il primo passo fuori." },
    ],
  },
  m16: {
    oggi: [
      "Quando una cosa che sembrava solida scricchiola, fa meno male guardare la crepa che fingere di non vederla: oggi puoi nominarne una ad alta voce.",
      "Un imprevisto che manda all'aria i piani mostra anche che cosa reggeva davvero: se oggi qualcosa salta, guarda che cosa è rimasto in piedi.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi di Marsiglia si chiama La Maison Dieu, la Casa di Dio, e nessuno sa spiegare bene quel nome. Nel mazzo dei Visconti arrivato fino a noi questa carta non c'è." },
      { k: 'immagine', t: "Le gocce di fuoco hanno la forma della lettera ebraica Yod e sono ventidue, quanti gli Arcani Maggiori. La torre non cade: salta via soltanto la corona che aveva in cima." },
      { k: 'contesto', t: "Sul lavoro è un cambio brusco di piani; in casa, una verità detta a tavola che nessuno si aspettava. Nel mazzo, subito dopo, viene la Stella: è lì che conviene guardare." },
    ],
  },
  m17: {
    oggi: [
      "Dopo una fatica la fiducia torna piano: oggi lascia che una cosa guarisca senza metterci le mani ogni cinque minuti.",
      "Una speranza piccola e precisa aiuta più di una grande e vaga: scegli una cosa buona che può succedere entro stasera e tienila d'occhio.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ha un ginocchio a terra e l'altro piede appoggiato sull'acqua, senza affondare. Nella Temperanza il piede entrava nello stagno; qui ci resta sopra, leggero." },
      { k: 'storia', t: "Nei mazzi di Marsiglia la scena è già questa: una donna nuda, due brocche, le stelle e un uccello su un albero. È una delle carte che in tre secoli è cambiata meno." },
      { k: 'rovescio', t: "Rovesciata può essere una speranza messa troppo lontano: aspetti il grande cambiamento e non vedi il piccolo sollievo di oggi, che è già una brocca versata." },
    ],
  },
  m18: {
    oggi: [
      "Di sera e da soli i pensieri fanno ombre lunghe: se oggi una paura ti sembra enorme, aspetta la luce del mattino prima di crederle del tutto.",
      "Un sogno strano o una sensazione senza motivo non chiedono di essere spiegati: oggi puoi scriverli in due righe e lasciarli lì.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le gocce che cadono dalla luna hanno la forma della lettera ebraica Yod, come quelle della Torre. E le due torri le hai già viste in fondo alla carta della Morte, con il sole in mezzo." },
      { k: 'storia', t: "Nei mazzi di Marsiglia ci sono già i due cani, le due torri e il gambero nello stagno. Nel 1909 uno dei cani diventa un lupo: il domestico e il selvatico davanti alla stessa luna." },
      { k: 'contesto', t: "In amore parla di cose immaginate più che sapute, e chiede di domandare prima di concludere. Sul lavoro è un quadro poco chiaro. Vicino al Sole, la confusione ha le ore contate." },
    ],
  },
  m19: {
    oggi: [
      "Se oggi una cosa ti mette allegria, non serve spiegare perché né abbassare la voce: puoi dirlo e basta, come farebbe un bambino.",
      "Le cose semplici alla luce del giorno si vedono per quello che sono: prova a fare all'aperto, o davanti a una finestra, quella che ti pesa di più.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi di Marsiglia non c'è nessun cavallo: due bambini stanno in piedi davanti a un muretto, sotto il sole. Il bambino solo, a cavallo, con la bandiera, è del 1909." },
      { k: 'immagine', t: "I raggi del sole sono uno dritto e uno ondulato, a turno. I girasoli, poi, non guardano il sole: sono girati verso il bambino." },
      { k: 'rovescio', t: "Rovesciato resta una carta buona, ed è raro. Dice soltanto che la contentezza c'è e fai fatica a mostrarla, come quando ricevi una bella notizia e la racconti a mezza voce." },
    ],
  },
  m20: {
    oggi: [
      "C'è una cosa che sai di dover fare da tempo e che ogni tanto torna a bussare: oggi puoi almeno risponderle e dire quando.",
      "Fare pace con una vecchia versione di te alleggerisce la giornata: ripensa a uno sbaglio lontano e prova a guardarlo come guarderesti quello di una persona cara.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le persone che si alzano sono sei: tre in primo piano e tre più lontane, che ripetono lo stesso gesto. La chiamata non è per uno solo." },
      { k: 'storia', t: "Nei mazzi italiani più antichi la carta si chiamava L'Angelo. La bandiera bianca con la croce rossa appesa alla tromba c'è già nei mazzi di Marsiglia." },
      { k: 'contesto', t: "Sul lavoro è una vocazione che torna a farsi sentire, o un vecchio progetto da riprendere. In amore è una telefonata a qualcuno del passato. Come ostacolo, è un giudizio che temi." },
    ],
  },
  m21: {
    oggi: [
      "Quando finisci qualcosa, anche una cosa piccola, fermati un momento prima di passare alla successiva: oggi una cosa conclusa merita di essere guardata.",
      "Forse sei più avanti di quanto ti sembra: fai l'elenco di quello che un anno fa non sapevi fare e che oggi fai senza pensarci.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le gambe della figura sono incrociate come quelle dell'Appeso, ma qui è in piedi e balla. Quello che là era attesa, qui è diventato movimento." },
      { k: 'storia', t: "Nei mazzi di Marsiglia è già così: una figura dentro una ghirlanda e, agli angoli, i simboli dei quattro evangelisti. Nei tarocchi quei quattro stanno anche per gli elementi e per i semi." },
      { k: 'rovescio', t: "Rovesciato è il traguardo raggiunto senza accorgersene: hai finito e continui a ritoccare, perché consegnare una cosa vuol dire anche lasciarla." },
    ],
  },

  w01: {
    oggi: [
      "Una voglia nuova dura poco se non le dai subito qualcosa da fare: oggi dedica dieci minuti all'idea che ti è venuta, prima che si raffreddi.",
      "Non serve un piano per accendere qualcosa: se stamattina una cosa ti incuriosisce, seguila per un pezzetto e guarda dove porta.",
    ],
    sguardi: [
      { k: 'storia', t: "Nelle carte da gioco francesi i Bastoni sono diventati i fiori. Nei mazzi italiani antichi, però, erano proprio bastoni da battaglia; il ramo vivo che mette foglie è un'idea del 1909." },
      { k: 'immagine', t: "Alcune foglie si sono staccate dal ramo e restano sospese in aria, senza cadere. Sulla collina in fondo c'è un castello: la meta si vede già, anche se è lontana." },
      { k: 'contesto', t: "Come consiglio dice di cominciare adesso, anche male. In amore è un'attrazione che parte in fretta. Vicino a una carta lenta come il Sette di Denari, la scintilla dovrà avere pazienza." },
    ],
  },
  w02: {
    oggi: [
      "Hai un progetto in mano e guardi fuori dalla finestra: oggi prova a fare una sola mossa concreta, anche soltanto chiedere un preventivo o un orario.",
      "Per il fine settimana o per l'anno prossimo, la domanda è la stessa: guarda se scegli il posto più comodo o quello che ti fa venire voglia.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sul muro c'è uno stemma con rose rosse e gigli bianchi incrociati, gli stessi fiori del Mago. Uno dei due bastoni è fissato al bastione con un anello: quello non parte." },
      { k: 'contesto', t: "Sul lavoro è il momento tra l'idea e la partenza: hai il mondo in mano ma sei ancora dentro le mura. In amore chiede se vuoi allargare la vita o tenerla com'è." },
      { k: 'rovescio', t: "Rovesciato può essere un piano fatto così bene da sostituire il viaggio: mappe, liste, preventivi, e il piacere di organizzare al posto di quello di andare." },
    ],
  },
  w03: {
    oggi: [
      "Hai già messo in moto qualcosa, e adesso una parte non dipende più da te: oggi puoi smettere di controllare e guardare un po' più lontano.",
      "Certe cose danno frutto con i loro tempi: se aspetti una risposta, usa la giornata per pensare a che cosa farai quando arriva.",
    ],
    sguardi: [
      { k: 'immagine', t: "Si appoggia a uno solo dei tre bastoni, e il mare davanti a lui è giallo come il cielo. Le navi sono piccolissime: quello che ha mandato fuori è già lontano." },
      { k: 'contesto', t: "Nel Due si decideva, qui le navi sono partite. In amore parla di distanza e di attese; sul lavoro di una risposta che arriva da fuori, da un'altra città o da un altro ufficio." },
      { k: 'rovescio', t: "Rovesciato è anche guardare l'orizzonte per non guardare i piedi: aspetti il risultato grande e trascuri la cosa piccola che oggi lo farebbe avanzare." },
    ],
  },
  w04: {
    oggi: [
      "Non serve aspettare la fine di tutto per festeggiare: oggi puoi fermarti a una tappa, anche piccola, e brindare con chi c'è.",
      "Casa è anche dove qualcuno è contento di vederti arrivare: guarda se oggi c'è una persona a cui far sapere che per te è così.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le due figure alzano dei mazzi di fiori, e a sinistra, più piccola, c'è altra gente che fa festa. Sulla destra un ponte porta dentro le mura del castello." },
      { k: 'contesto', t: "È una delle carte più serene del mazzo. In amore parla di convivenza, di nozze, di una casa aperta agli amici; sul lavoro è una tappa raggiunta, non ancora la fine della strada." },
      { k: 'rovescio', t: "Rovesciato resta quasi buono: la festa c'è, ma qualcuno manca, oppure si festeggia per abitudine. Vale la pena chiedersi per chi è apparecchiata la tavola." },
    ],
  },
  w05: {
    oggi: [
      "Una discussione di oggi può essere solo voglia di misurarsi: prima di prenderla sul personale, chiediti se è un gioco in cui puoi entrare anche tu.",
      "Quando tutti parlano insieme nessuno ha torto e nessuno viene ascoltato: prova a dire la tua una volta sola, con calma, e poi a fare una domanda.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ognuno dei cinque è vestito in modo diverso dagli altri, e nessun bastone ha ancora toccato qualcuno. Per questo molti lettori ci vedono una gara tra ragazzi più che una battaglia." },
      { k: 'contesto', t: "Sul lavoro è una riunione da cui, nella confusione, può uscire un'idea buona. In amore è il battibecco di chi si tiene testa. Vicino al Cinque di Spade si fa più seria." },
      { k: 'rovescio', t: "Rovesciato è spesso la discussione fatta solo nella tua testa: prepari le risposte sotto la doccia, e all'altra persona non hai ancora detto niente." },
    ],
  },
  w06: {
    oggi: [
      "Un complimento si può accettare senza restituirlo subito e senza sminuirlo: se oggi te ne arriva uno, prova a rispondere soltanto grazie.",
      "Quello che hai fatto bene merita di essere visto: oggi puoi raccontare a qualcuno una cosa che ti è riuscita, senza aspettare che te la chiedano.",
    ],
    sguardi: [
      { k: 'immagine', t: "Il cavallo è coperto da un drappo verde fino a terra e gira l'occhio verso chi guarda la carta. Della folla si vedono soltanto qualche testa e cinque bastoni." },
      { k: 'contesto', t: "Come risposta è un sì. Sul lavoro è un riconoscimento pubblico, un grazie detto davanti a tutti; in amore, qualcuno che è fiero di farsi vedere con te." },
      { k: 'rovescio', t: "Rovesciato chiede di chi sia l'applauso che aspetti. Può darsi che il lavoro sia buono e che manchi soltanto il pubblico: sono due cose diverse." },
    ],
  },
  w07: {
    oggi: [
      "Tenere la tua posizione non richiede di convincere tutti: oggi puoi dire che la pensi diversamente e lasciare che gli altri restino della loro idea.",
      "Se ti senti sotto attacco, guarda bene quanti stanno attaccando davvero: a volte è una domanda sola, e tu hai risposto come se fossero sei.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ai piedi ha uno stivale da una parte e una scarpa bassa dall'altra. La tradizione ci legge uno che è stato colto di sorpresa, si è vestito in fretta e si è difeso lo stesso." },
      { k: 'contesto', t: "Sul lavoro è tenere il punto con chi vorrebbe il tuo posto o la tua idea. In amore è difendere una scelta davanti alla famiglia. Sta in alto: il vantaggio ce l'ha lui." },
      { k: 'rovescio', t: "Rovesciato può essere una difesa diventata abitudine: rispondi a tono anche a chi stava solo chiedendo, e poi ti domandi perché la gente con te misura le parole." },
    ],
  },
  w08: {
    oggi: [
      "Quando le cose si muovono in fretta conviene rispondere invece di rimuginare: oggi a quel messaggio lasciato lì puoi dare una risposta breve e subito.",
      "Certe giornate vanno più veloci di te, e inseguirle non serve: scegli le due cose che devono proprio partire oggi e lascia volare le altre.",
    ],
    sguardi: [
      { k: 'immagine', t: "È una delle due sole carte numerate in cui non compare nessuna persona; l'altra è il Tre di Spade. I bastoni stanno già scendendo: tra poco toccano terra." },
      { k: 'storia', t: "La Golden Dawn la chiamava «Rapidità» e le assegnava Mercurio, il pianeta dei messaggi. Per questo ancora oggi molti lettori ci vedono lettere, telefonate, viaggi decisi in fretta." },
      { k: 'contesto', t: "È una delle poche carte che parlano di tempi: presto, nel giro di giorni. In amore è un messaggio che arriva; sul lavoro, cose ferme che si sbloccano tutte insieme." },
    ],
  },
  w09: {
    oggi: [
      "Se ti senti senza forze proprio vicino alla fine, è normale: oggi non serve fare di più, basta non mollare la presa su quello che hai già fatto.",
      "Chi ha già preso una botta sta in guardia anche quando non serve: guarda se oggi puoi abbassare le spalle con una persona che non ti ha fatto niente.",
    ],
    sguardi: [
      { k: 'immagine', t: "Non guarda davanti a sé: gli occhi vanno di lato, verso la parte da cui potrebbe arrivare qualcosa. I bastoni alle sue spalle non sono tutti alti uguali." },
      { k: 'contesto', t: "Viene subito prima del Dieci: lui resiste, quello dopo si carica di tutto. Sul lavoro è l'ultima settimana prima di una consegna; in amore è chi tiene la guardia alta." },
      { k: 'rovescio', t: "Rovesciato è la guardia montata quando non c'è più nessuno da cui difendersi: la ferita è vecchia, la fasciatura potrebbe venire via, e tu continui a tenerla." },
    ],
  },
  w10: {
    oggi: [
      "Non tutto quello che porti è tuo da portare: oggi guarda l'elenco delle cose da fare e chiediti quale potresti passare a qualcuno, o lasciare cadere.",
      "Quando manca poco viene da stringere i denti e fare tutto da sé: prova invece a chiedere una mano per un pezzo solo, anche piccolo.",
    ],
    sguardi: [
      { k: 'storia', t: "La figura curva sotto il fascio viene da un mazzo italiano del Quattrocento, il Sola Busca. Nel 1907 il British Museum ne ricevette le fotografie, e Pamela Colman Smith ne riprese alcune scene." },
      { k: 'immagine', t: "Porta i bastoni nel modo più faticoso, tutti davanti alla faccia, e così non vede la strada. Il paese è lì a pochi passi, e lui non può saperlo." },
      { k: 'contesto', t: "Sul lavoro è aver detto troppi sì. In casa è chi fa tutto perché fa prima a farlo che a chiederlo. Vicino al Sei di Denari, l'aiuto c'è: basta domandarlo." },
    ],
  },
  w11: {
    oggi: [
      "Per imparare una cosa nuova serve soprattutto la voglia di provarci male: oggi fai il principiante in qualcosa, senza scusarti di esserlo.",
      "Una buona notizia piccola va raccontata finché è calda: se oggi ne hai una, mandala a qualcuno prima di decidere che non è abbastanza importante.",
    ],
    sguardi: [
      { k: 'immagine', t: "Dietro di lui ci sono tre colline a punta che ricordano le piramidi: è lo stesso deserto del Cavaliere di Bastoni. Guarda la cima del bastone come se lo vedesse per la prima volta." },
      { k: 'storia', t: "In italiano il Fante era il soldato a piedi o il giovane servitore; in inglese è il Page, il paggio. Nella tradizione i quattro Fanti portano notizie, ognuno quelle del suo seme." },
      { k: 'rovescio', t: "Rovesciato è l'entusiasmo dei primi tre giorni: il corso comprato e non cominciato, il quaderno nuovo con una pagina scritta. Niente di grave, se lo si riconosce." },
    ],
  },
  w12: {
    oggi: [
      "La voglia di partire subito è preziosa e dura poco: oggi usala per la parte più difficile di una cosa, quella che da fredda non faresti.",
      "Se una cosa ti appassiona al punto da farti correre, guarda anche chi ti sta accanto: forse oggi serve dirgli dove stai andando.",
    ],
    sguardi: [
      { k: 'immagine', t: "Dall'elmo e dal braccio dell'armatura escono piume rosse che sembrano fiamme. Anche il cavallo è del colore del fuoco, e s'impenna senza che lui si scomponga." },
      { k: 'contesto', t: "In amore è una passione che arriva di corsa e non promette di fermarsi. Sul lavoro è un cambio, un viaggio, un'occasione da prendere al volo. Come consiglio: muoviti, poi aggiusterai." },
      { k: 'rovescio', t: "Rovesciato è partire per non restare: si cambia città, lavoro o progetto ogni volta che comincia la parte noiosa, che di solito è quella in cui le cose si costruiscono." },
    ],
  },
  w13: {
    oggi: [
      "Puoi occupare il tuo posto senza chiedere scusa: oggi entra in una stanza, o in una conversazione, come una persona che è contenta di esserci.",
      "Il calore che dai agli altri funziona meglio se ne tieni un po' per te: guarda che cosa ti scalda davvero e mettilo nella giornata.",
    ],
    sguardi: [
      { k: 'immagine', t: "È l'unica delle quattro regine seduta di fronte, con lo sguardo appena girato. Sui braccioli del trono ci sono due leoni, e altri due, rossi, stanno sullo schienale." },
      { k: 'contesto', t: "Per via del gatto nero molti lettori la considerano la regina delle streghe. In una lettura è spesso una persona precisa: calda, diretta, una che quando entra si nota." },
      { k: 'rovescio', t: "Rovesciata è il calore che ha bisogno di pubblico: se nessuno guarda si spegne, e allora cerca attenzione dove può, anche facendo scintille per poco." },
    ],
  },
  w14: {
    oggi: [
      "Qualcuno deve dire da che parte si va, e oggi puoi essere tu: proponi una direzione chiara invece di chiedere a tutti che cosa preferiscono.",
      "Far partire una cosa non vuol dire farla tutta: guarda se oggi puoi dare il via e poi fidarti di chi la porta avanti con te.",
    ],
    sguardi: [
      { k: 'immagine', t: "Accanto al trono, sulla pedana, c'è una salamandra viva, piccola e scura. Nei bestiari antichi era l'animale che attraversa il fuoco senza bruciarsi." },
      { k: 'contesto', t: "Come persona è un capo che sa entusiasmare, o chi in famiglia decide e se ne prende la responsabilità. Come consiglio: smetti di chiedere il permesso e guida tu questa cosa." },
      { k: 'rovescio', t: "Rovesciato può essere chi accende tutto e non porta a termine niente: grandi annunci il lunedì, e il venerdì il lavoro vero è rimasto agli altri." },
    ],
  },

  c01: {
    oggi: [
      "Un affetto comincia spesso da un gesto minuscolo: oggi puoi fare tu il primo, un messaggio o un sorriso, senza sapere che cosa torna indietro.",
      "Se qualcosa ti commuove, una canzone, una frase, un cane per strada, non passare oltre in fretta: lascia che ti resti addosso un momento.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla coppa c'è una lettera: sembra una W, oppure una M capovolta. Nel suo libro Waite non la spiega, e i lettori ne discutono da più di cent'anni." },
      { k: 'storia', t: "Nelle carte da gioco francesi le Coppe sono diventate i cuori. Per questo il seme è rimasto, anche per chi gioca a carte senza pensare ai tarocchi, quello dei sentimenti." },
      { k: 'contesto', t: "Non è soltanto amore di coppia: può essere un'amicizia che nasce, un bambino, la voglia di disegnare che torna. Vicino a una carta di Denari è un lavoro che finalmente piace." },
    ],
  },
  c02: {
    oggi: [
      "Un'intesa vera si riconosce perché nessuno dei due tiene il conto: oggi con una persona prova a dare e a prendere nella stessa misura.",
      "Per sentirsi vicini a qualcuno basta a volte guardarlo mentre parla: scegli una conversazione di oggi e falla senza il telefono in mano.",
    ],
    sguardi: [
      { k: 'immagine', t: "Il bastone con i due serpenti è il caduceo, l'insegna di Mercurio, dio dei messaggeri e degli scambi. In fondo, tra i due, si vede una casa dal tetto rosso su una collina." },
      { k: 'contesto', t: "Fuori dall'amore è un buon socio, una pace fatta, un accordo in cui nessuno ci rimette. Somiglia agli Amanti in piccolo: lì una scelta di vita, qui una stretta di mano." },
      { k: 'rovescio', t: "Rovesciato chiede chi dei due sta tenendo la coppa più in alto. A volte è solo un malinteso: due persone che si vogliono bene e hanno smesso di dirselo." },
    ],
  },
  c03: {
    oggi: [
      "Una gioia divisa con qualcuno diventa più grande: se oggi ti succede una cosa bella, anche piccola, raccontala a un'amica prima di sera.",
      "Non serve un'occasione per trovarsi: guarda se oggi puoi proporre un caffè o una cena a qualcuno che non vedi da troppo tempo.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ai piedi delle tre c'è una zucca, e una di loro tiene in mano un grappolo d'uva: è una festa del raccolto. Una delle tre ci volta le spalle." },
      { k: 'contesto', t: "Sul lavoro è una squadra che si trova bene. In amore può voler dire che c'è una terza persona, e conviene guardare le carte vicine prima di preoccuparsi." },
      { k: 'rovescio', t: "Rovesciato è anche la compagnia che stanca: esci perché ci sono tutti, ridi quando ridono gli altri, e torni a casa con meno voglia di prima." },
    ],
  },
  c04: {
    oggi: [
      "Quando niente ti va, è facile non vedere quello che ti viene offerto: oggi alza gli occhi una volta in più, e guarda se c'è un invito che avevi scartato.",
      "La noia a volte è solo stanchezza del solito: prova a cambiare una cosa minuscola, la strada, il posto a tavola, la musica, e senti che effetto fa.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ha le braccia incrociate e anche le gambe: è chiuso due volte. La mano che esce dalla nuvola è la stessa che regge i quattro Assi del mazzo." },
      { k: 'contesto', t: "Come consiglio è raro ma prezioso: dire di no a una cosa buona, perché non è la tua. Sul lavoro è la noia di un posto sicuro; in amore, chi c'è e non partecipa." },
      { k: 'rovescio', t: "Rovesciato è il giorno in cui alzi gli occhi. Non serve accettare la quarta coppa: basta accorgersi che qualcuno la stava offrendo, e da quanto tempo." },
    ],
  },
  c05: {
    oggi: [
      "Un dispiacere ha diritto al suo tempo, ma non a tutta la giornata: oggi, dopo averlo guardato, voltati e conta che cosa è rimasto in piedi.",
      "Ripensare a come poteva andare non cambia com'è andata: se un rimpianto torna a trovarti, prova a chiedergli che cosa vuole che tu faccia adesso.",
    ],
    sguardi: [
      { k: 'immagine', t: "Dalle coppe cadute escono due liquidi diversi, uno rosso e uno verde. Tra la figura e il castello scorre un fiume, e il ponte per attraversarlo è lì, a due passi." },
      { k: 'contesto', t: "Dipende molto da che cosa ha vicino: con il Sei di Coppe è nostalgia, con il Tre di Spade un dolore fresco, con una carta di Denari una perdita che si può contare." },
      { k: 'rovescio', t: "Rovesciato è il momento in cui la figura si gira. Le tre coppe restano per terra e nessuno le rimette in piedi: cambia soltanto dove guardi." },
    ],
  },
  c06: {
    oggi: [
      "Un gesto gentile senza motivo è una delle poche cose che funzionano sempre: oggi fanne uno come si fa da bambini, senza aspettarti niente.",
      "Un ricordo che torna può scaldare senza trattenerti: se oggi ti viene in mente un posto o una persona di allora, salutali e poi torna a oggi.",
    ],
    sguardi: [
      { k: 'immagine', t: "In fondo a sinistra una guardia con la lancia si allontana e volta le spalle ai bambini. I fiori nelle coppe sono bianchi e hanno cinque punte, come piccole stelle." },
      { k: 'contesto', t: "In amore è spesso qualcuno che torna dal passato, o un affetto semplice. Sul lavoro è un mestiere ritrovato. In casa parla di fratelli, di sorelle, del posto dove si è cresciuti." },
      { k: 'rovescio', t: "Rovesciato è il ricordo ritoccato: un periodo che a ripensarci sembra tutto dolce, e che a viverlo aveva anche le sue giornate storte." },
    ],
  },
  c07: {
    oggi: [
      "Avere tante possibilità in testa può voler dire non averne nessuna in mano: oggi scegline una, la più piccola, e falle fare un passo nel mondo.",
      "Sognare a occhi aperti fa bene, se poi ti dice che cosa ti manca: guarda quale fantasia torna più spesso e che cosa chiede davvero.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla coppa con la corona d'alloro, quella della vittoria, è disegnato un teschio. E la figura al centro, sotto il velo, è l'unica delle sette cose che non si lascia vedere." },
      { k: 'contesto', t: "Sul lavoro è avere troppe idee aperte; in amore, innamorarsi di una possibilità più che di una persona. Come consiglio dice di sognare pure, e poi sceglierne una e toccarla." },
      { k: 'rovescio', t: "Rovesciato è una nuvola in meno: delle sette coppe ne resta una vera. Può fare un po' di tristezza, come sempre quando si sceglie e le altre porte si chiudono." },
    ],
  },
  c08: {
    oggi: [
      "Andare via da una cosa che funziona ancora un po' non è un capriccio: guarda se c'è qualcosa che tieni solo perché l'hai già pagata cara.",
      "Quando una cosa non ti basta più, il corpo lo sa prima della testa: oggi fai caso a dove vai volentieri e a dove trascini i piedi.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le coppe sono cinque sotto e tre sopra, e nella fila in alto resta un posto vuoto. Quello che manca non è per terra: non c'è mai stato, e lui va a cercarlo." },
      { k: 'storia', t: "La Golden Dawn la chiamava «Successo abbandonato»: le coppe sono piene e in piedi, niente è andato male. È una delle poche carte in cui si lascia qualcosa che funziona." },
      { k: 'rovescio', t: "Rovesciato può essere tornare indietro a controllare: vai via e ti volti dieci volte, o resti con le valigie fatte nell'ingresso. Capita, prima di una partenza vera." },
    ],
  },
  c09: {
    oggi: [
      "Essere contenti di quello che c'è non vuol dire smettere di volere: oggi siediti un momento davanti a una cosa che hai desiderato e che adesso hai.",
      "Un desiderio diventa più chiaro quando lo dici con parole precise: prova a scrivere in una riga che cosa vorresti da questa settimana.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le coppe stanno su un banco coperto da una tovaglia azzurra che arriva fino a terra, e nessuno vede che cosa c'è sotto. Lui siede su una semplice panca di legno." },
      { k: 'contesto', t: "Molti lettori la chiamano la carta del desiderio: in risposta a una cosa che vuoi, è un sì. Vicino al Dieci di Coppe passa dal piacere di uno alla gioia di tutti." },
      { k: 'rovescio', t: "Rovesciato chiede se il desiderio era tuo. Si può ottenere proprio quello che si era chiesto e scoprire che lo si voleva per far contento qualcun altro." },
    ],
  },
  c10: {
    oggi: [
      "La felicità di casa è fatta di cose che si ripetono: oggi fai caso a un momento qualunque, la colazione, un saluto, e guardalo come se fosse una festa.",
      "Famiglia sono anche le persone che hai scelto: manda due righe a qualcuno con cui stai bene, solo per dirglielo.",
    ],
    sguardi: [
      { k: 'immagine', t: "I due bambini ballano tenendosi per mano e non guardano l'arcobaleno: lo guardano soltanto i grandi. La coppia è vista di spalle, e ognuno dei due alza un braccio solo." },
      { k: 'contesto', t: "Il Nove era la contentezza di uno solo, seduto davanti alle sue coppe; il Dieci è in piedi, all'aperto, con altri. In una domanda di lavoro dice che la risposta sta a casa." },
      { k: 'rovescio', t: "Rovesciato è l'arcobaleno che c'è e nessuno guarda, perché in famiglia si sta discutendo di chi lava i piatti. Spesso basta che uno alzi la testa." },
    ],
  },
  c11: {
    oggi: [
      "Le cose gentili arrivano spesso da dove non guardavi: oggi lasciati sorprendere da un'idea strana o da un invito che non ti aspettavi, prima di dire no.",
      "Non serve essere esperti di sentimenti per dirne uno: prova a far sapere a una persona, con parole semplici, che l'hai pensata.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla tunica ha dei fiori rosa e bianchi che molti leggono come fiori di loto, gli stessi dello stagno dell'Asso di Coppe. Il pesce lo guarda negli occhi, e lui sorride." },
      { k: 'contesto', t: "Come notizia è un invito, un messaggio affettuoso, a volte l'annuncio di un bambino. Come persona è qualcuno di giovane e sensibile. Come consiglio: prendi sul serio un'idea che ti sembra strana." },
      { k: 'rovescio', t: "Rovesciato è la sensibilità che si offende presto: un messaggio letto nel tono sbagliato, una risposta che tarda e diventa subito un rifiuto." },
    ],
  },
  c12: {
    oggi: [
      "Farsi avanti con un sentimento richiede più coraggio che tenerselo: oggi puoi fare una proposta, anche piccola, e lasciare all'altra persona il tempo di rispondere.",
      "Le cose dette con garbo arrivano più lontano: se oggi devi chiedere qualcosa, prova a chiederla come chi porta un regalo e non come chi presenta un conto.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ha le ali sull'elmo e anche ai talloni, come Mercurio, il messaggero degli dei. Sulla tunica sono ricamati dei pesci rossi, e il cavallo tiene la testa bassa." },
      { k: 'contesto', t: "È il più lento dei quattro Cavalieri dopo quello di Denari: va al passo e tiene la coppa dritta. In amore è una dichiarazione; sul lavoro, un'offerta fatta con garbo." },
      { k: 'rovescio', t: "Rovesciato è chi ama l'idea di arrivare con la coppa in mano più della persona a cui la porta. Belle parole, e poi sparisce fino alla prossima scena." },
    ],
  },
  c13: {
    oggi: [
      "Ascoltare qualcuno fino in fondo, senza preparare la risposta, è già un aiuto: oggi provaci con una persona, e poi fallo anche con te.",
      "Quello che senti entrando in una stanza è un'informazione, non un capriccio: oggi fidati di una prima impressione abbastanza da farci caso.",
    ],
    sguardi: [
      { k: 'immagine', t: "È l'unica coppa chiusa di tutto il seme: ha un coperchio e due figure con le ali ai lati. Lei la guarda e non la apre: quello che c'è dentro lo sa già." },
      { k: 'contesto', t: "Come persona è chi ti ascolta senza darti subito la soluzione. Come consiglio: fidati di quello che senti, anche senza prove. Vicino alle Spade ricorda che capire non basta." },
      { k: 'rovescio', t: "Rovesciata è la spugna: assorbe l'umore di chiunque entri nella stanza, e a sera non sa più quale tristezza sia la sua." },
    ],
  },
  c14: {
    oggi: [
      "Si può sentire molto e restare calmi: se oggi qualcosa ti agita, prova a dirlo con voce tranquilla invece di tenerlo dentro o di alzare il tono.",
      "Chi sta male accanto a te non ha sempre bisogno di una soluzione: forse oggi basta restare lì e non farti portare via dalla sua onda.",
    ],
    sguardi: [
      { k: 'immagine', t: "Porta al collo un ciondolo a forma di pesce. Il trono sta su una lastra di pietra in mezzo alle onde, e lui non si bagna nemmeno la punta delle scarpe." },
      { k: 'contesto', t: "Come persona è chi resta calmo quando gli altri si agitano: un medico, un padre, un amico più grande. Sul lavoro è trattare con tatto. In amore, sentimenti profondi e poche parole." },
      { k: 'rovescio', t: "Rovesciato è la calma usata come coperchio. Fuori è tutto in ordine, sotto il mare è mosso, e ogni tanto esce da una battuta troppo tagliente." },
    ],
  },

  s01: {
    oggi: [
      "Un'idea chiara taglia via mezz'ora di giri: oggi prova a dire in una frase sola qual è il problema, prima di cercare la soluzione.",
      "La verità detta con semplicità fa meno danni di quella tenuta dentro: guarda se c'è una cosa da chiarire con qualcuno, e scegli parole pulite.",
    ],
    sguardi: [
      { k: 'immagine', t: "Intorno alla lama cadono sei gocce dorate, tre per parte, con la forma della lettera ebraica Yod. Dalla corona pendono un ramo d'ulivo e uno di palma: pace e vittoria." },
      { k: 'storia', t: "Nelle carte da gioco francesi le Spade sono diventate le picche. Nei tarocchi sono il seme della testa: pensieri, parole, decisioni, e i tagli che ne vengono." },
      { k: 'contesto', t: "È il più tagliente degli Assi: una decisione presa, una verità detta, un contratto firmato. In amore non è romantico, ma è la chiarezza che permette di sapere a che punto si è." },
    ],
  },
  s02: {
    oggi: [
      "Non scegliere è una scelta che si paga in stanchezza: oggi non serve decidere tutto, basta guardare in faccia le due possibilità e dar loro un nome.",
      "A volte teniamo gli occhi chiusi per non vedere che sappiamo già la risposta: chiediti che cosa diresti a un'amica nella tua stessa situazione.",
    ],
    sguardi: [
      { k: 'storia', t: "La Golden Dawn chiamava questa carta «Pace ristabilita» e le assegnava la Luna in Bilancia. Più che un blocco, per loro era una tregua: le spade sono incrociate, nessuna colpisce." },
      { k: 'immagine', t: "Dà le spalle al mare, e dall'acqua dietro di lei spuntano degli scogli. La benda le copre gli occhi, ma le mani sono libere: se l'è messa da sola e da sola può toglierla." },
      { k: 'rovescio', t: "Rovesciato può essere anche aver chiesto troppi pareri: dieci persone ti hanno detto dieci cose, e la benda adesso è fatta delle voci degli altri." },
    ],
  },
  s03: {
    oggi: [
      "Una cosa che fa male, detta con il suo nome, fa un po' meno male: oggi puoi dire «questa cosa mi ha ferito» senza aggiungere altro.",
      "Il dolore per una parola o per una notizia non va aggiustato in giornata: lascialo piovere, e intanto fai una cosa gentile per te.",
    ],
    sguardi: [
      { k: 'storia', t: "Il cuore trafitto da tre spade è quasi identico a una carta del Sola Busca, mazzo italiano di fine Quattrocento. Dal 1907 le sue fotografie erano al British Museum: è probabile che Pamela Colman Smith le abbia viste lì." },
      { k: 'immagine', t: "Non c'è nessuna persona, solo il cuore e la pioggia. Le spade lo attraversano da parte a parte senza romperlo: resta intero, rosso, al centro della carta." },
      { k: 'contesto', t: "Essendo una carta di Spade, il dolore passa dalla testa: una frase sentita, una verità letta in un messaggio. Vicino alle Coppe guarisce; vicino ad altre Spade ci si rimugina." },
    ],
  },
  s04: {
    oggi: [
      "Riposare non è un premio per chi ha finito tutto: oggi mettilo in agenda come un impegno, anche solo venti minuti a occhi chiusi.",
      "Una decisione presa da stanchi viene quasi sempre storta: se puoi, quella di oggi lasciala a domani mattina e intanto dormici sopra.",
    ],
    sguardi: [
      { k: 'immagine', t: "Nella vetrata una figura si inginocchia davanti a un'altra, in piedi. Le tre spade sul muro hanno la punta in giù, verso il cavaliere; la quarta è scolpita sul fianco della tomba." },
      { k: 'contesto', t: "Dopo il Tre viene il Quattro: prima la ferita, poi il letto. Sul lavoro sono ferie da prendere davvero. In amore è una pausa che fa bene, non un addio." },
      { k: 'rovescio', t: "Rovesciato è il riposo che non riposa: ti stendi sul divano con il telefono in mano, e dopo due ore hai più pensieri di prima." },
    ],
  },
  s05: {
    oggi: [
      "Si può avere ragione e perdere qualcosa lo stesso: prima di chiudere una discussione di oggi con l'ultima parola, guarda che cosa ti costa.",
      "Se ieri hai vinto male o perso male, oggi puoi fare un gesto piccolo verso l'altra persona, senza riaprire la questione.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ne tiene tre e ne lascia due per terra: sono quelle di chi se n'è andato. Le nuvole sono strappate e tirate dal vento, tutte nella stessa direzione." },
      { k: 'contesto', t: "La domanda della carta è chi sei tu nella scena: quello che raccoglie le spade o uno dei due che se ne vanno. Sul lavoro è una discussione vinta che costa un collega." },
      { k: 'rovescio', t: "Rovesciato è l'ultima parola lasciata all'altro, per una volta. Brucia per dieci minuti, e poi ci si accorge che la serata è salva." },
    ],
  },
  s06: {
    oggi: [
      "Uscire da un periodo pesante è un viaggio lento, e va bene così: oggi guarda soltanto se sei un po' più in là di ieri.",
      "Per stare meglio a volte basta spostarsi di poco: cambia stanza, fai un giro a piedi, e lascia il pensiero difficile dov'era.",
    ],
    sguardi: [
      { k: 'immagine', t: "L'acqua è mossa da un lato della barca e liscia dall'altro, quello verso cui vanno. Le spade restano piantate a bordo: i pensieri di prima viaggiano con loro." },
      { k: 'contesto', t: "È un miglioramento lento, non una festa: si va verso il meglio con la schiena curva. Può essere un viaggio vero, un trasloco, o il primo mese dopo un periodo brutto." },
      { k: 'rovescio', t: "Rovesciato è arrivare sull'altra riva e scoprire di aver portato tutto con sé: casa nuova, stessi pensieri. Vuol dire che un pezzo del viaggio va fatto dentro." },
    ],
  },
  s07: {
    oggi: [
      "Fare le cose di nascosto pesa più che farle alla luce: guarda se oggi c'è una piccola mezza verità che puoi raddrizzare con una frase.",
      "L'astuzia serve quando la strada dritta è chiusa, non per abitudine: oggi, prima di aggirare un problema, prova a chiedere apertamente quello che ti serve.",
    ],
    sguardi: [
      { k: 'immagine', t: "Tiene le spade per la lama, a mani nude, e cammina in punta di piedi guardandosi indietro. In fondo a sinistra, piccolissime, si vedono delle figure attorno a un fuoco." },
      { k: 'contesto', t: "Non è sempre un ladro. Sul lavoro è fare da sé senza chiedere permesso; in amore è una cosa non detta. Le carte vicine dicono quanto pesa." },
      { k: 'rovescio', t: "Rovesciato può essere la piccola bugia che racconti a te: «lo faccio domani», «non mi importa». Le due spade rimaste piantate sono quello che sai benissimo." },
    ],
  },
  s08: {
    oggi: [
      "Molti «non posso» sono «ho paura di provare»: oggi prendine uno e fai un passo solo, per sentire se qualcosa ti ferma davvero.",
      "Quando ti sembra di non avere scelta, prova a scriverne tre, anche assurde: di solito almeno una non è assurda come pareva.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le spade stanno ai lati e dietro: davanti a lei non ce n'è nessuna. Le bende le legano le braccia ma non le gambe, e in alto, sulla roccia, c'è un castello." },
      { k: 'contesto', t: "In amore è restare perché «non ho alternative»; sul lavoro, credere di non saper fare altro. Somiglia al Diavolo, ma qui le catene sono pensieri, non voglie." },
      { k: 'rovescio', t: "Rovesciato non scioglie tutto insieme. Di solito cade prima la benda: vedi dove sei, vedi che davanti è libero, e le braccia restano legate ancora un po'." },
    ],
  },
  s09: {
    oggi: [
      "Le preoccupazioni delle tre di notte al mattino pesano la metà: se una ti ha tenuto compagnia, oggi scrivila e guarda quanto è lunga davvero.",
      "Un pensiero che gira in tondo si ferma quando lo dici a qualcuno: scegli una persona e raccontale la cosa che ti preoccupa, anche male.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sul fianco del letto è intagliata una scena: una figura ne abbatte un'altra. Le spade sono appese nel buio alle spalle di chi è nel letto, e nessuna lo tocca." },
      { k: 'contesto', t: "È una carta di pensieri, non di fatti: dice quanto sei in ansia, non che la cosa temuta succederà. Vicino al Sole o alla Stella è proprio l'ora prima del mattino." },
      { k: 'rovescio', t: "Rovesciato è la luce accesa sul comodino. Il pensiero è lo stesso, ma appena lo scrivi o lo dici a qualcuno prende la misura giusta, quasi sempre più piccola." },
    ],
  },
  s10: {
    oggi: [
      "Quando una cosa è finita male e del tutto, c'è almeno questo di buono: non può peggiorare. Oggi puoi smettere di difenderla e guardare che ora è.",
      "Una brutta giornata non ha bisogno di essere capita subito: lasciala finire, e domani guarda che cosa di lei ti serve ancora.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le spade sono dieci, ma ne sarebbe bastata una: è una carta che esagera, e molti lettori la leggono con un mezzo sorriso. Dietro, l'acqua è ferma e il cielo schiarisce dal basso." },
      { k: 'contesto', t: "È una fine nei pensieri prima che nei fatti: un'idea, un progetto, un modo di vedere una persona. Dopo il Dieci il seme ricomincia dall'Asso, cioè da un'idea nuova e pulita." },
      { k: 'rovescio', t: "Rovesciato, le spade cadono da sole: per come è disegnata la carta, basta girarla. È il mattino dopo una brutta giornata, quando ci si alza con la schiena indolenzita." },
    ],
  },
  s11: {
    oggi: [
      "Fare una domanda in più non è sfiducia, è attenzione: oggi, davanti a una cosa poco chiara, chiedi invece di immaginare la risposta.",
      "La curiosità è un modo di volersi bene: scegli una cosa che non sai, anche inutile, e vai a guardarla da vicino per un quarto d'ora.",
    ],
    sguardi: [
      { k: 'immagine', t: "Nel cielo, in alto a sinistra, volano dieci uccelli in gruppo. Il vento gli tira i capelli da una parte, e lui guarda dall'altra: tiene d'occhio qualcosa alle sue spalle." },
      { k: 'contesto', t: "Come notizia è un'informazione, a volte una chiacchiera da verificare. Come persona è qualcuno di sveglio che fa domande scomode. Come consiglio: prima di decidere, informati meglio." },
      { k: 'rovescio', t: "Rovesciato è controllare troppo: il telefono dell'altro, l'ultimo accesso, le parole esatte di un messaggio. La spada alzata diventa un modo per non fidarsi." },
    ],
  },
  s12: {
    oggi: [
      "Dire le cose in modo diretto fa risparmiare tempo a tutti: oggi prova a chiedere esattamente quello che vuoi, in una frase, senza giri.",
      "La fretta di rispondere fa dire cose che poi tocca spiegare: prima di mandare quel messaggio, contalo fino a dieci e rileggilo una volta.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla bardatura del cavallo ci sono farfalle e uccelli, le creature dell'aria. Il pennacchio dell'elmo e il mantello volano all'indietro: corre contro vento." },
      { k: 'contesto', t: "È il più veloce dei Cavalieri, e non sempre guarda dove arriva. Sul lavoro è una decisione rapida, una mail scritta di getto. In amore, qualcuno che dice tutto subito." },
      { k: 'rovescio', t: "Rovesciato è la risposta mandata prima di finire di leggere la domanda. Spesso basta rileggere il proprio messaggio dieci minuti dopo per sentire il vento calare." },
    ],
  },
  s13: {
    oggi: [
      "Si può dire una cosa vera senza farne un'arma: oggi, se devi dire a qualcuno come stanno le cose, tieni una mano aperta mentre parli.",
      "Vedere chiaro vuol dire anche non raccontarsela: guarda una situazione di oggi come la guarderebbe una persona che ti vuole bene e non ti fa sconti.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei vecchi manuali era la carta della vedova: una donna che ha conosciuto una perdita e per questo vede chiaro. Oggi si legge come chiunque dica la verità senza farne un'arma." },
      { k: 'immagine', t: "Sul fianco del trono è scolpita la testa di un bambino con le ali. Dal polso alzato le pende una nappa, e sopra di lei, in tutto il cielo, vola un uccello solo." },
      { k: 'rovescio', t: "Rovesciata è la battuta che ha ragione e fa male lo stesso. La mano tesa si abbassa, resta soltanto la spada, e chi la tiene di solito è stato ferito per primo." },
    ],
  },
  s14: {
    oggi: [
      "Una regola chiara, decisa a mente fredda, ti evita di ridiscutere tutto ogni volta: oggi stabiliscine una per una cosa che ti fa perdere tempo.",
      "Giudicare bene vuol dire guardare i fatti prima delle simpatie: in una questione di oggi prova a separare che cosa è successo da come ti ha fatto sentire.",
    ],
    sguardi: [
      { k: 'immagine', t: "La sua spada non è del tutto dritta: pende appena da una parte, a differenza di quella della Giustizia. Nel cielo, alla sua sinistra, volano due uccelli." },
      { k: 'contesto', t: "Come persona è un giudice, un medico, un consulente: qualcuno a cui si chiede un parere chiaro. Come consiglio: metti da parte la simpatia e guarda i fatti, per iscritto se serve." },
      { k: 'rovescio', t: "Rovesciato è avere ragione a tutti i costi. Il ragionamento fila, le regole sono dalla tua parte, e intanto a tavola non parla più nessuno." },
    ],
  },

  p01: {
    oggi: [
      "Un'occasione concreta ha spesso un aspetto modesto: oggi guarda se ti passa in mano qualcosa di piccolo e solido, un contatto, un'offerta, un'ora libera.",
      "Le cose che durano cominciano da un gesto pratico: metti da parte dieci euro, pianta un seme, prendi un appuntamento che rimandi.",
    ],
    sguardi: [
      { k: 'immagine', t: "È l'unico dei quattro Assi in cui dal cielo non cade niente: né foglie né gocce. Tutto quello che questa carta promette sta già nella mano, e più giù, nel giardino." },
      { k: 'storia', t: "Nelle carte da gioco francesi i Denari sono diventati i quadri. Nei mazzi italiani antichi erano monete d'oro; la stella a cinque punte nel cerchio arriva con gli occultisti inglesi, tra Otto e Novecento." },
      { k: 'contesto', t: "In amore non è passione: è qualcuno che c'è, che si presenta, che fa una cosa concreta per te. Sul lavoro è un'offerta, un primo incasso, un posto." },
    ],
  },
  p02: {
    oggi: [
      "Tenere insieme due impegni è più facile se smetti di volerli fermi: oggi lascia che uno salga e l'altro scenda, e poi fai cambio.",
      "Un po' di leggerezza aiuta a destreggiarsi meglio della serietà: guarda se nella giornata piena di oggi c'è un punto in cui puoi ridere di come corri.",
    ],
    sguardi: [
      { k: 'immagine', t: "Il cappello rosso è alto quasi quanto il suo busto, e le navi alle sue spalle sono due, su onde alte come colline. Lui intanto guarda una delle monete, non il mare." },
      { k: 'storia', t: "La Golden Dawn la chiamava «Cambiamento armonioso»: per loro non era affanno, era il ritmo di una cosa che sale mentre un'altra scende, come le due navi sulle onde." },
      { k: 'rovescio', t: "Rovesciato è un'agenda in cui ogni ora è già di qualcuno. La soluzione della carta non è diventare più bravi a destreggiarsi: è posare una delle due monete." },
    ],
  },
  p03: {
    oggi: [
      "Un lavoro viene meglio quando qualcuno lo guarda con te: oggi mostra a una persona una cosa che stai facendo, anche se non è finita.",
      "Saper fare bene una cosa è un piacere che non ha bisogno di grandi occasioni: metti cura in un gesto pratico di oggi e nota chi se ne accorge.",
    ],
    sguardi: [
      { k: 'immagine', t: "L'artigiano lavora in piedi su una panca. I due che lo guardano sono un monaco con la tonsura e una figura in un mantello a pois, e i tre denari sono scolpiti nella pietra dell'arco." },
      { k: 'contesto', t: "In amore è una coppia che costruisce qualcosa insieme, anche solo montare un mobile senza litigare. Sul lavoro è la carta migliore per una collaborazione: ognuno porta un mestiere diverso." },
      { k: 'rovescio', t: "Rovesciato è il lavoro di gruppo in cui uno fa e due commentano. Oppure sei tu che non mostri a nessuno quello che fai finché non è perfetto." },
    ],
  },
  p04: {
    oggi: [
      "Tenersi stretto quello che si ha dà sicurezza e toglie le mani: guarda se oggi puoi aprirne una, prestare una cosa, offrire un caffè, cedere su un dettaglio.",
      "Il bisogno di controllare tutto nasce spesso dalla paura che manchi qualcosa: chiediti che cosa temi di perdere, e se è davvero in pericolo.",
    ],
    sguardi: [
      { k: 'immagine', t: "Volta le spalle alla città e tiene i piedi sopra due monete: finché le protegge così, non può alzarsi. Ne ha una anche sulla testa, sopra la corona." },
      { k: 'contesto', t: "Sui soldi è prudenza, e non c'è niente di male. In amore è tenersi stretti per paura. Come consiglio vale per un periodo: adesso metti da parte, poi però riapri le mani." },
      { k: 'rovescio', t: "Rovesciato può essere una spesa fatta per sentirsi vivi dopo mesi di rinunce. Né bene né male: dice che la presa era troppo stretta da troppo tempo." },
    ],
  },
  p05: {
    oggi: [
      "Nei periodi stretti viene da cavarsela in silenzio: guarda se oggi c'è una porta a cui potresti bussare, e che non vedi perché cammini a testa bassa.",
      "Sentirsi fuori da un gruppo o da una festa fa freddo davvero: oggi cerca una persona sola che sta dalla tua parte e passa un momento con lei.",
    ],
    sguardi: [
      { k: 'immagine', t: "L'uomo con le stampelle porta una campanella al collo, come nel Medioevo i malati che dovevano annunciarsi. La vetrata è accesa, ma nel disegno non si vede nessuna porta." },
      { k: 'contesto', t: "Non parla solo di soldi: è sentirsi fuori da un gruppo, da una famiglia. I due però camminano insieme, e in amore questo conta: l'inverno si attraversa in due." },
      { k: 'rovescio', t: "Rovesciato è accorgersi della finestra. L'orgoglio di cavarsela senza nessuno si scioglie un po', e si bussa: di solito qualcuno apre più in fretta del previsto." },
    ],
  },
  p06: {
    oggi: [
      "Dare e ricevere sono due metà della stessa cosa: se oggi qualcuno ti offre un aiuto, prova ad accettarlo senza promettere subito di ricambiare.",
      "La generosità ha una misura giusta, quella che non ti lascia senza: guarda che cosa puoi dare oggi volentieri, tempo, attenzione o soldi, e fermati lì.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le monete cadono nelle mani di uno solo dei due: l'altro aspetta ancora. Sul mantello azzurro di quello che aspetta c'è una piccola toppa rossa." },
      { k: 'contesto', t: "Chiede sempre da che parte della bilancia stai: oggi dai o ricevi. Sul lavoro è un aumento, un prestito, un favore. In amore, un periodo in cui uno sostiene l'altro." },
      { k: 'rovescio', t: "Rovesciato è il regalo che ti fa sentire in debito, o il favore che poi viene ricordato a tavola. Vale anche al contrario: dare per sentirsi in alto." },
    ],
  },
  p07: {
    oggi: [
      "Hai fatto la tua parte, e adesso tocca al tempo: oggi puoi appoggiarti un momento e guardare quanto è già cresciuto quello che hai seminato.",
      "Chiedersi se ne vale la pena non è arrendersi: fai il punto su una cosa in cui metti fatica da mesi, e decidi se continuare uguale o cambiare qualcosa.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sei monete stanno sulla pianta e una è per terra, davanti ai suoi piedi: forse il primo frutto, già colto. Lui tiene il mento sulle mani e le mani sul manico." },
      { k: 'storia', t: "La Golden Dawn la chiamava «Successo non compiuto»: il lavoro è fatto e il risultato non ancora. È la carta di chi sta a metà e deve decidere se continuare a zappare." },
      { k: 'rovescio', t: "Rovesciato è strappare la pianta per vedere se ha messo radici. Controlli i risultati ogni giorno, e ogni giorno ti sembrano pochi perché ieri erano gli stessi." },
    ],
  },
  p08: {
    oggi: [
      "Le cose si imparano rifacendole, e la decima volta viene meglio della prima: oggi ripeti con cura un gesto che conosci, senza cercare la novità.",
      "L'impegno di un giorno qualsiasi conta più dello slancio di un giorno speciale: fai il tuo pezzetto di oggi, anche se nessuno lo vede.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sei monete sono appese al palo, una è sotto lo scalpello e una aspetta per terra. Il paese è lontano, alle sue spalle: per imparare si è messo in disparte." },
      { k: 'contesto', t: "Rispetto al Tre di Denari qui non c'è pubblico: nessuno guarda, nessuno applaude. È lo studio, la gavetta, il corso serale. In amore sono le attenzioni piccole ripetute ogni giorno." },
      { k: 'rovescio', t: "Rovesciato è rifare la stessa moneta per paura di consegnarla. Oppure il contrario: farne otto in fretta, tutte un po' storte, per finire prima." },
    ],
  },
  p09: {
    oggi: [
      "Quello che hai costruito con le tue mani puoi anche godertelo: oggi concediti una cosa bella che ti sei guadagnata, senza dividerla e senza giustificarla.",
      "Stare bene per conto proprio è una capacità, non una mancanza: prenditi un'ora tua, a casa o fuori, e trattala come un appuntamento importante.",
    ],
    sguardi: [
      { k: 'immagine', t: "Il falco ha il cappuccio rosso sugli occhi, come si usa nella caccia. In basso, sul sentiero, passa una lumaca, e i fiori della veste somigliano al segno di Venere." },
      { k: 'contesto', t: "È una delle poche carte in cui una persona sta bene da sola, e si vede. In amore dice che non hai bisogno di qualcuno per stare in piedi, e questo cambia chi scegli." },
      { k: 'rovescio', t: "Rovesciato è il giardino curato in cui non entra nessuno. Tutto è in ordine e guadagnato, e manca qualcuno a cui far assaggiare l'uva." },
    ],
  },
  p10: {
    oggi: [
      "Molte cose che usi ogni giorno te le ha lasciate qualcuno: una ricetta, un modo di dire, un mobile. Oggi fai caso a una e ringrazia, anche in silenzio.",
      "Quello che dura si costruisce in tanti e in tanto tempo: guarda che cosa stai mettendo da parte, non solo in soldi, per chi verrà dopo.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le dieci monete non sono messe a caso: disegnano l'Albero della Vita della Cabala, con le sue dieci sfere. Il bambino, mezzo nascosto, allunga la mano verso uno dei cani." },
      { k: 'contesto', t: "È una carta di tempi lunghi: mutui, case, cognomi, cose che passano dai nonni ai nipoti. In amore parla di famiglie che si incontrano più che di due persone sole." },
      { k: 'rovescio', t: "Rovesciato è l'eredità che non sono soldi: il modo di litigare, di tacere, di fare il Natale. Si può ricevere una casa insieme alle sue abitudini, e scegliere quali tenere." },
    ],
  },
  p11: {
    oggi: [
      "Una cosa nuova si impara guardandola a lungo prima di usarla: oggi dedica attenzione vera a un dettaglio pratico che di solito sbrighi in fretta.",
      "Prendere sul serio un progetto piccolo è il modo in cui diventa grande: scrivi il primo passo concreto e la data in cui lo fai.",
    ],
    sguardi: [
      { k: 'immagine', t: "La moneta sembra galleggiare sopra le sue dita: la sfiora appena. In fondo a destra c'è un pezzo di campo già arato, lo stesso che ritrovi nel Cavaliere di Denari." },
      { k: 'contesto', t: "Come notizia riguarda cose pratiche: un colloquio, un esame, un preventivo. Come persona è chi studia sul serio. Come consiglio: comincia in piccolo e impara il mestiere prima di chiedere il risultato." },
      { k: 'rovescio', t: "Rovesciato è lo studente eterno: un altro corso, un altro libro, un altro video, per non arrivare mai al giorno in cui si prova davvero." },
    ],
  },
  p12: {
    oggi: [
      "Andare piano e arrivare vale più di partire forte: oggi fai la cosa noiosa che tiene in piedi le altre, senza cercare scorciatoie.",
      "La costanza è fatta di giorni come questo, in cui non succede niente di speciale: fai il tuo passo di oggi e non guardare quanti ne mancano.",
    ],
    sguardi: [
      { k: 'immagine', t: "È l'unico cavallo nero dei quattro Cavalieri. Sull'elmo di lui e sulla testa del cavallo c'è lo stesso ciuffo di foglie verdi, e il campo davanti è già arato." },
      { k: 'contesto', t: "È il più lento dei Cavalieri e il più affidabile: quello che dice lo fa, anche se ci mette un mese. In amore non fa sorprese, e fa trovare la macchina con il pieno." },
      { k: 'rovescio', t: "Rovesciato è l'abitudine che ha preso il posto della scelta. Stessa strada, stesso orario, stesso piatto, e non ricordi più se ti piacciono o se sono soltanto comodi." },
    ],
  },
  p13: {
    oggi: [
      "Prendersi cura comincia dalle cose pratiche: oggi mangia con calma, a tavola, bevi un bicchiere d'acqua, sistema un angolo di casa, e poi pensa agli altri.",
      "Accogliere qualcuno non richiede una casa perfetta: basta una sedia libera e il tempo di ascoltare. Guarda se oggi puoi offrirli a una persona.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sul bracciolo del trono è scolpita una testa di capra, e sullo schienale frutti e figure. Sopra di lei le rose fanno un arco, come sopra il Mago." },
      { k: 'contesto', t: "Come persona è chi ti fa sedere e ti mette davanti un piatto prima di chiederti che cosa è successo. Sul lavoro è buon senso con i soldi. Come consiglio: occupati del corpo e della casa." },
      { k: 'rovescio', t: "Rovesciata è la dispensa piena di chi non mangia mai seduto. Tutto funziona per gli altri, e la parte viva e leggera, quella del coniglio ai suoi piedi, è scappata." },
    ],
  },
  p14: {
    oggi: [
      "La sicurezza vera lascia spazio per essere generosi: guarda che cosa hai in abbondanza oggi, anche solo esperienza o tempo, e a chi potrebbe servire.",
      "Le cose solide si fanno con metodo e senza fretta: scegli una faccenda pratica, un conto, una scadenza, una riparazione, e sistemala per bene.",
    ],
    sguardi: [
      { k: 'immagine', t: "Da sotto la veste, tutta grappoli e foglie di vite, spunta un piede in armatura. Le teste di toro sul trono sono quattro: due in alto e due sui braccioli." },
      { k: 'contesto', t: "Come persona è chi ha costruito qualcosa di solido e lo condivide: un datore di lavoro giusto, un padre presente. Come consiglio: fidati di ciò che dura e rende piano." },
      { k: 'rovescio', t: "Rovesciato è misurare tutto in soldi, anche il tempo degli altri. Oppure è avere abbastanza da anni e non riuscire a sentirlo." },
    ],
  },
};
