// The card of the day (docs/DESIGN.md "La soglia"): for each of the 78 cards, two sentences for the day and
// three looks at the card that are not in the grimoire. `oggi`: a way to look at an ordinary day, born from
// the card's core idea. `sguardi`: k = 'immagine' (a detail of the Rider-Waite-Smith picture), 'storia'
// (older decks, old names, what changed in 1909), 'contesto' (how the meaning shifts), 'rovescio' (a nuance
// of the reversed card). Ordered with the most surprising first.
export const DAILY = {
  m00: {
    oggi: [
      "Iscriviti alla lezione di prova che guardi da un mese: per la prima volta non serve essere capaci.",
      "Se un'amica ti propone un posto dove non hai mai messo piede, stasera di' di sì prima di pensarci.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi di Marsiglia il Matto non ha numero, e in quello dei Visconti è un poveraccio vestito di stracci, con delle piume tra i capelli. Lo zero glielo danno gli occultisti dell'Ottocento, che lo mettono in testa alla fila." },
      { k: 'immagine', t: "Sul cappello ha una piuma rossa, e la stessa piuma torna in testa al bambino del Sole, quasi alla fine dei Maggiori. Chi parte e chi arriva portano lo stesso segno." },
      { k: 'contesto', t: "In amore è la voglia di buttarsi senza garanzie; sul lavoro la stessa leggerezza chiede almeno di controllare dov'è il bordo. Vicino al Diavolo avverte che il salto può essere una fuga." },
    ],
  },
  m01: {
    oggi: [
      "Il curriculum da rifare lo sai già scrivere: apri il file e butta giù le prime tre righe adesso.",
      "La frase che provi sotto la doccia da una settimana la sai a memoria: oggi dilla alla persona giusta.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei tarocchi italiani si chiama Il Bagatto, e nei mazzi di Marsiglia è un prestigiatore da fiera con dadi e bussolotti sul banco. Fu il mazzo del 1909 a mettergli davanti i quattro semi." },
      { k: 'immagine', t: "La cintura del Mago è un serpente che si morde la coda, un antico segno dell'eternità. È piccola e si nota appena, sopra il bianco della veste." },
      { k: 'rovescio', t: "Rovesciato può essere anche chi prepara il tavolo all'infinito: compra gli strumenti, mette in ordine, fa progetti, e non comincia mai perché l'inizio vero lo spaventa." },
    ],
  },
  m02: {
    oggi: [
      "Hai capito una cosa su una persona e non l'hai detta a nessuno: tienila ancora un giorno, e guarda se resta vera.",
      "Prima di chiedere un parere a tutti su quella decisione, chiediti che cosa ne pensi tu: di solito lo sai già.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sul rotolo che tiene in grembo si leggono quattro lettere, TORA, e il resto sparisce sotto il manto. Quello che sa è scritto, ma lei ne mostra soltanto un pezzo." },
      { k: 'storia', t: "Nei mazzi antichi è La Papessa: una donna con la tiara del papa in testa. Waite ne fece una sacerdotessa e le mise accanto le due colonne del tempio di Salomone." },
      { k: 'contesto', t: "Come consiglio dice di aspettare e ascoltare prima di muoverti; come ostacolo dice che qualcuno tace una cosa che ti riguarda. Vicino al Mago: lui fa, lei sa." },
    ],
  },
  m03: {
    oggi: [
      "Guarda la pianta sul davanzale mentre le dai l'acqua: cresce perché te ne occupi un poco ogni settimana.",
      "Cucina per te come cucineresti per un ospite: apparecchia, siediti e mangia con calma.",
    ],
    sguardi: [
      { k: 'storia', t: "La Golden Dawn le assegnò la lettera ebraica Daleth, che significa porta. Nei mazzi più antichi l'Imperatrice teneva uno scudo con l'aquila imperiale: il segno di Venere è arrivato dopo." },
      { k: 'immagine', t: "Waite scrive che le stelle della corona sono dodici: c'è chi ci legge i mesi dell'anno e chi i segni dello zodiaco. Al collo porta un filo di perle." },
      { k: 'rovescio', t: "Rovesciata parla anche di chi non riesce a ricevere: prepara la cena per tutti e resta in piedi, e se qualcuno insiste perché si sieda risponde che non ha fame." },
    ],
  },
  m04: {
    oggi: [
      "Scrivi su un foglio i tre compiti di oggi, in ordine, e attaccalo accanto allo schermo.",
      "Quando in riunione nessuno decide chi fa che cosa, dillo tu: nomi e scadenze, a voce calma.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le teste di montone sul trono sono quattro: due sui braccioli e due in cima allo schienale. Quattro è anche il numero della carta, e la tradizione lo lega a ciò che sta saldo." },
      { k: 'storia', t: "Nei mazzi di Marsiglia l'Imperatore è seduto di profilo, con le gambe incrociate e uno scudo con l'aquila. Nel 1909 viene girato di fronte, e sotto il manto compare un'armatura." },
      { k: 'contesto', t: "Sul lavoro è una buona notizia: un contratto, un capo che decide, un piano che regge. In amore chiede attenzione, perché proteggere e comandare, visti da vicino, si somigliano." },
    ],
  },
  m05: {
    oggi: [
      "Chiedi a tua madre o a tua nonna come si fa quel sugo: certe ricette non stanno scritte da nessuna parte.",
      "Al lavoro c'è chi fa quel mestiere da vent'anni: prima di cercare un tutorial, vai alla sua scrivania e chiedi.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi antichi si chiama Il Papa. Waite lo chiamò Ierofante, come il sacerdote che nell'antica Grecia guidava i riti dei misteri di Eleusi." },
      { k: 'immagine', t: "Sulle scarpe bianche ha due piccole croci, e altre tre scendono lungo la stola. Dei due chierici vedi soltanto la nuca rasata: chi guarda la carta è in fila dietro di loro." },
      { k: 'rovescio', t: "Rovesciato non è per forza ribellione. A volte è il consiglio buono che arriva da chi non ha titoli: una nonna, un vicino, uno che il mestiere l'ha imparato facendolo." },
    ],
  },
  m06: {
    oggi: [
      "Tra i due inviti di sabato scegli quello dove hai voglia di andare, non quello dove ti aspettano.",
      "Prima di comprare quel vestito chiediti se piace a te o a chi vuoi che ti guardi.",
    ],
    sguardi: [
      { k: 'immagine', t: "Segui gli sguardi: l'uomo guarda la donna, e la donna guarda l'angelo. Nessuno dei due guarda l'albero che ha alle spalle." },
      { k: 'storia', t: "Nei mazzi di Marsiglia la scena era un'altra: un giovane fermo tra due donne, e sopra di loro Cupido con l'arco teso. Il giardino con l'angelo è del 1909." },
      { k: 'contesto', t: "Fuori dall'amore è spesso un bivio di lavoro o di casa, e chiede quale delle due strade ti somiglia. Vicino al Diavolo distingue il legame scelto da quello che non riesci a mollare." },
    ],
  },
  m07: {
    oggi: [
      "Scegli a che punto vuoi essere stasera con quel lavoro, e togli il telefono dal tavolo.",
      "Metti le scarpe da corsa prima di chiederti se ne hai voglia: di solito la voglia arriva dopo.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi di Marsiglia il carro è tirato da due cavalli. Le sfingi arrivano nell'Ottocento, da un disegno dell'occultista francese Éliphas Lévi, e il mazzo del 1909 le riprende." },
      { k: 'immagine', t: "Dietro il carro scorre un fiume, e la città resta dall'altra parte. Il guerriero se l'è lasciata alle spalle: è già partito, anche se le sfingi sono ancora accucciate." },
      { k: 'rovescio', t: "Rovesciato può voler dire che una delle due sfingi ha già scelto per te: continui a tirare dritto per orgoglio, su una strada che una parte di te ha smesso di volere." },
    ],
  },
  m08: {
    oggi: [
      "Quando il collega alza la voce, tu abbassa la tua: una risposta calma lo ferma meglio di una dura.",
      "Con la tua rabbia di stamattina fai come con un cane agitato: non sgridarla, portala a fare un giro.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi antichi La Forza era l'undicesima carta e La Giustizia l'ottava. Fu Waite a scambiarle, nel 1909, perché la Forza cadesse sotto il segno del Leone." },
      { k: 'immagine', t: "Il leone ha la coda tra le zampe e tira fuori la lingua, come un cane che si lascia fare. Lei è china su di lui e porta fiori anche alla cintura." },
      { k: 'contesto', t: "In amore è la pazienza con un brutto carattere, compreso il tuo. Sul lavoro è reggere una persona difficile senza alzare la voce. Come ostacolo dice che stai tenendo a bada troppo." },
    ],
  },
  m09: {
    oggi: [
      "Stasera cammina mezz'ora senza cuffie e senza meta: ascolta che cosa pensi quando nessuno ti parla.",
      "Puoi dire di no all'aperitivo senza inventare una scusa: una sera in casa per conto tuo è un impegno vero.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi dipinti a mano del Quattrocento il vecchio aveva in mano una clessidra, non una lanterna, e la carta era chiamata anche Il Tempo." },
      { k: 'immagine', t: "Tiene la lanterna all'altezza del viso ma guarda in basso, con le palpebre abbassate. La luce non serve a lui: è per chi lo vede da lontano, più giù sulla montagna." },
      { k: 'rovescio', t: "Rovesciato è anche il consiglio che non vuoi chiedere: fai tutto per conto tuo per non disturbare, e intanto giri in tondo su una cosa che un'altra persona vedrebbe subito." },
    ],
  },
  m10: {
    oggi: [
      "Il treno perso o il semaforo rosso non ce l'hanno con te: oggi tocca così, domani gira.",
      "Manda quella candidatura anche se pensi di avere poche possibilità: la fortuna gira solo per chi è in gioco.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le quattro lettere sulla ruota, lette in tondo, fanno TARO; partendo da un'altra fanno ROTA, che in latino vuol dire ruota. In mezzo ci sono le lettere ebraiche del nome di Dio." },
      { k: 'storia', t: "Nel mazzo dei Visconti quattro persone stanno attorno alla ruota, e accanto a ognuna c'è una scritta in latino: regnerò, regno, ho regnato, sono senza regno." },
      { k: 'contesto', t: "Come risposta a una domanda secca è un sì, ma a tempo: vale adesso. Vicino a una carta di fatica come il Dieci di Bastoni dice che il periodo pesante sta per girare." },
    ],
  },
  m11: {
    oggi: [
      "Restituisci oggi i venti euro o il libro che hai in prestito da mesi: i conti piccoli pesano più dei grandi.",
      "Se ieri hai risposto male a qualcuno in casa, oggi dillo tu, prima che te lo faccia notare.",
    ],
    sguardi: [
      { k: 'immagine', t: "A differenza delle statue dei tribunali, questa Giustizia non ha la benda: guarda dritto chi le sta davanti. Decide sapendo bene chi sei." },
      { k: 'storia', t: "Con la Forza e la Temperanza è una delle quattro virtù cardinali. Tre stanno nei tarocchi fin dal Quattrocento; la quarta, la Prudenza, non c'è, e nessuno sa dire con certezza perché." },
      { k: 'rovescio', t: "Rovesciata può essere anche una severità sbagliata verso di te: ti condanni per uno sbaglio con una pena che non daresti a nessun altro per la stessa cosa." },
    ],
  },
  m12: {
    oggi: [
      "La risposta che aspetti non arriva prima se guardi il telefono: lascialo in un'altra stanza per un'ora.",
      "Sdraiati sul pavimento della tua stanza cinque minuti: da lì sotto anche il problema di oggi cambia forma.",
    ],
    sguardi: [
      { k: 'storia', t: "In Italia, nel Quattrocento, la carta era chiamata anche Il Traditore: i traditori venivano dipinti così sui muri delle città, appesi per un piede, per svergognarli davanti a tutti." },
      { k: 'immagine', t: "Le mani non si vedono, e niente dice che siano legate. Le gambe disegnano un quattro, le braccia un triangolo, e i capelli pendono dritti dentro la luce." },
      { k: 'contesto', t: "Sul lavoro è un progetto fermo che non dipende da te, e spingere non serve. In amore è una pausa che fa capire qualcosa. Vicino alla Morte, l'attesa è l'ultimo tratto prima di chiudere." },
    ],
  },
  m13: {
    oggi: [
      "Dai via oggi il cappotto che non metti da tre inverni: nell'armadio serve spazio per chi sei adesso.",
      "Archivia la chat con quella persona che non risponde da mesi: una storia finita non ha bisogno di stare in cima.",
    ],
    sguardi: [
      { k: 'storia', t: "In molti mazzi di Marsiglia questa carta non ha il nome scritto, soltanto il numero tredici, e lo scheletro va a piedi con una falce. Il cavallo e l'armatura sono del 1909." },
      { k: 'immagine', t: "Sulle redini del cavallo ci sono teschi e ossa incrociate, e sul fiume in fondo passa una piccola barca. La vita, là dietro, continua ad andare da qualche parte." },
      { k: 'rovescio', t: "Rovesciata è spesso un trasloco fatto a metà: gli scatoloni di una vita finita restano in corridoio per mesi, e ci giri intorno senza aprirli né portarli via." },
    ],
  },
  m14: {
    oggi: [
      "Oggi non scegliere tra il lavoro e la serata con un'amica: accorcia un po' l'uno e un po' l'altra.",
      "Dopo una giornata tutta di corsa, stasera cucina una cosa semplice e mangiala a tavola, con calma.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla fronte dell'angelo c'è un cerchio con un punto al centro, il segno che gli astrologi usano per il Sole. Il triangolo sul petto è chiuso dentro un quadrato." },
      { k: 'storia', t: "È una delle virtù cardinali, e nei mazzi del Quattrocento era una donna senza ali che versava da una brocca all'altra: allungava il vino con l'acqua. Le ali sono arrivate dopo." },
      { k: 'contesto', t: "In amore è trovare un passo comune tra due abitudini diverse. Sul lavoro è la via di mezzo. Nel mazzo viene subito dopo la Morte: finito il taglio, si ricuce." },
    ],
  },
  m15: {
    oggi: [
      "Guarda quante ore di schermo segna oggi il telefono: quel numero lo decidi tu, un pollice alla volta.",
      "Stai per riscrivere a chi ti fa stare male: fermati con il messaggio a metà e chiediti chi te lo fa fare.",
    ],
    sguardi: [
      { k: 'immagine', t: "Mettila accanto agli Amanti: è la stessa coppia, con il Diavolo al posto dell'angelo. La coda di lei finisce in un grappolo, quella di lui in una fiamma, come i due alberi del giardino." },
      { k: 'storia', t: "Nel mazzo dei Visconti arrivato fino a noi il Diavolo manca, e non si sa se sia andato perduto o se non sia mai stato dipinto. Quello del 1909 somiglia al Bafometto disegnato da Éliphas Lévi." },
      { k: 'rovescio', t: "Rovesciato non sempre libera subito. Può essere il momento in cui vedi la catena con chiarezza e te ne vergogni: è scomodo, ma è già il primo passo fuori." },
    ],
  },
  m16: {
    oggi: [
      "Se oggi salta un piano a cui tenevi, guarda che cosa resta in piedi: quello era solido davvero.",
      "La frase che ti è scappata in una lite era vera: invece di ritirarla, prova a ripeterla con calma.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi di Marsiglia si chiama La Maison Dieu, la Casa di Dio, e nessuno sa spiegare bene quel nome. Nel mazzo dei Visconti arrivato fino a noi questa carta non c'è." },
      { k: 'immagine', t: "Le gocce di fuoco hanno la forma della lettera ebraica Yod e sono ventidue, quanti gli Arcani Maggiori. La torre non cade: salta via soltanto la corona che aveva in cima." },
      { k: 'contesto', t: "Sul lavoro è un cambio brusco di piani; in casa, una verità detta a tavola che nessuno si aspettava. Nel mazzo, subito dopo, viene la Stella: è lì che conviene guardare." },
    ],
  },
  m17: {
    oggi: [
      "Dopo una settimana pesante fai una doccia lunga e metti lenzuola pulite: si ricomincia da gesti così.",
      "Stasera affacciati alla finestra due minuti prima di dormire: guarda il cielo e pensa a un desiderio piccolo per domani.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ha un ginocchio a terra e l'altro piede appoggiato sull'acqua, senza affondare. Nella Temperanza il piede entrava nello stagno; qui ci resta sopra, leggero." },
      { k: 'storia', t: "Nei mazzi di Marsiglia la scena è già questa: una donna nuda, due brocche, le stelle e un uccello su un albero. È una delle carte che in tre secoli è cambiata meno." },
      { k: 'rovescio', t: "Rovesciata può essere una speranza messa troppo lontano: aspetti il grande cambiamento e non vedi il piccolo sollievo di oggi, che è già una brocca versata." },
    ],
  },
  m18: {
    oggi: [
      "Il messaggio che alle due di notte ti sembra freddo, rileggilo dopo colazione: di notte ogni virgola fa paura.",
      "L'ombra sul muro della camera è la sedia con i vestiti: accendi la luce prima di credere a una paura.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le gocce che cadono dalla luna hanno la forma della lettera ebraica Yod, come quelle della Torre. E le due torri le hai già viste in fondo alla carta della Morte, con il sole in mezzo." },
      { k: 'storia', t: "Nei mazzi di Marsiglia ci sono già i due cani, le due torri e il gambero nello stagno. Nel 1909 uno dei cani diventa un lupo: il domestico e il selvatico davanti alla stessa luna." },
      { k: 'contesto', t: "In amore parla di cose immaginate più che sapute, e chiede di domandare prima di concludere. Sul lavoro è un quadro poco chiaro. Vicino al Sole, la confusione ha le ore contate." },
    ],
  },
  m19: {
    oggi: [
      "Fai colazione vicino alla finestra, con la luce in faccia: dieci minuti di sole valgono anche di martedì.",
      "Quando oggi ti fanno un complimento, rispondi soltanto grazie: non spiegare perché non lo meriti.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei mazzi di Marsiglia non c'è nessun cavallo: due bambini stanno in piedi davanti a un muretto, sotto il sole. Il bambino solo, a cavallo, con la bandiera, è del 1909." },
      { k: 'immagine', t: "I raggi del sole sono uno dritto e uno ondulato, a turno. I girasoli, poi, non guardano il sole: sono girati verso il bambino." },
      { k: 'rovescio', t: "Rovesciato resta una carta buona, ed è raro. Dice soltanto che la contentezza c'è e fai fatica a mostrarla, come quando ricevi una bella notizia e la racconti a mezza voce." },
    ],
  },
  m20: {
    oggi: [
      "Richiama oggi la persona a cui pensi da mesi: una telefonata di cinque minuti può chiudere un conto aperto da anni.",
      "Tira fuori la chitarra o il quaderno che hai messo via: se ti chiama ancora, rispondi per un quarto d'ora.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le persone che si alzano sono sei: tre in primo piano e tre più lontane, che ripetono lo stesso gesto. La chiamata non è per uno solo." },
      { k: 'storia', t: "Nei mazzi italiani più antichi la carta si chiamava L'Angelo. La bandiera bianca con la croce rossa appesa alla tromba c'è già nei mazzi di Marsiglia." },
      { k: 'contesto', t: "Sul lavoro è una vocazione che torna a farsi sentire, o un vecchio progetto da riprendere. In amore è una telefonata a qualcuno del passato. Come ostacolo, è un giudizio che temi." },
    ],
  },
  m21: {
    oggi: [
      "Hai finito un lavoro lungo e stai già pensando al prossimo: per stasera guarda quello finito e basta.",
      "Appendi il quadro che sta appoggiato al muro da mesi: l'ultimo chiodo fa di una stanza una casa.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le gambe della figura sono incrociate come quelle dell'Appeso, ma qui è in piedi e balla. Quello che là era attesa, qui è diventato movimento." },
      { k: 'storia', t: "Nei mazzi di Marsiglia è già così: una figura dentro una ghirlanda e, agli angoli, i simboli dei quattro evangelisti. Nei tarocchi quei quattro stanno anche per gli elementi e per i semi." },
      { k: 'rovescio', t: "Rovesciato è il traguardo raggiunto senza accorgersene: hai finito e continui a ritoccare, perché consegnare una cosa vuol dire anche lasciarla." },
    ],
  },

  w01: {
    oggi: [
      "L'idea che ti è venuta ieri sera sotto le coperte vale dieci minuti oggi: scrivila prima che si raffreddi.",
      "Hai voglia di ridipingere una parete o di tagliarti i capelli: prendi l'appuntamento finché la voglia è calda.",
    ],
    sguardi: [
      { k: 'storia', t: "Nelle carte da gioco francesi i Bastoni sono diventati i fiori. Nei mazzi italiani antichi, però, erano proprio bastoni da battaglia; il ramo vivo che mette foglie è un'idea del 1909." },
      { k: 'immagine', t: "Alcune foglie si sono staccate dal ramo e restano sospese in aria, senza cadere. Sulla collina in fondo c'è un castello: la meta si vede già, anche se è lontana." },
      { k: 'contesto', t: "Come consiglio dice di cominciare adesso, anche male. In amore è un'attrazione che parte in fretta. Vicino a una carta lenta come il Sette di Denari, la scintilla dovrà avere pazienza." },
    ],
  },
  w02: {
    oggi: [
      "Hai aperto dieci volte la pagina di quel volo: oggi guarda le date sul calendario e decidi se parti.",
      "L'annuncio di lavoro salvato tra i preferiti scade: rileggilo oggi e scegli se rispondere o cancellarlo.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sul muro c'è uno stemma con rose rosse e gigli bianchi incrociati, gli stessi fiori del Mago. Uno dei due bastoni è fissato al bastione con un anello: quello non parte." },
      { k: 'contesto', t: "Sul lavoro è il momento tra l'idea e la partenza: hai il mondo in mano ma sei ancora dentro le mura. In amore chiede se vuoi allargare la vita o tenerla com'è." },
      { k: 'rovescio', t: "Rovesciato può essere un piano fatto così bene da sostituire il viaggio: mappe, liste, preventivi, e il piacere di organizzare al posto di quello di andare." },
    ],
  },
  w03: {
    oggi: [
      "Del corso che hai iniziato non vedi ancora i frutti: segna sul calendario dove vuoi essere a giugno.",
      "Sali all'ultimo piano o su una collina e guarda lontano: da lì la tua settimana sembra più piccola.",
    ],
    sguardi: [
      { k: 'immagine', t: "Si appoggia a uno solo dei tre bastoni, e il mare davanti a lui è giallo come il cielo. Le navi sono piccolissime: quello che ha mandato fuori è già lontano." },
      { k: 'contesto', t: "Nel Due si decideva, qui le navi sono partite. In amore parla di distanza e di attese; sul lavoro di una risposta che arriva da fuori, da un'altra città o da un altro ufficio." },
      { k: 'rovescio', t: "Rovesciato è anche guardare l'orizzonte per non guardare i piedi: aspetti il risultato grande e trascuri la cosa piccola che oggi lo farebbe avanzare." },
    ],
  },
  w04: {
    oggi: [
      "Hai chiuso un mese difficile: stasera compra dei fiori o una bottiglia e brinda, anche in due, anche in cucina.",
      "Invita a cena le persone che ti hanno dato una mano col trasloco o con l'esame: si festeggia insieme.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le due figure alzano dei mazzi di fiori, e a sinistra, più piccola, c'è altra gente che fa festa. Sulla destra un ponte porta dentro le mura del castello." },
      { k: 'contesto', t: "È una delle carte più serene del mazzo. In amore parla di convivenza, di nozze, di una casa aperta agli amici; sul lavoro è una tappa raggiunta, non ancora la fine della strada." },
      { k: 'rovescio', t: "Rovesciato resta quasi buono: la festa c'è, ma qualcuno manca, oppure si festeggia per abitudine. Vale la pena chiedersi per chi è apparecchiata la tavola." },
    ],
  },
  w05: {
    oggi: [
      "Nella chat di gruppo tutti vogliono un ristorante diverso: proponi un sondaggio e smetti di discutere.",
      "Se in riunione parlate tutti insieme, alza la mano e ripeti l'idea di un altro prima della tua.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ognuno dei cinque è vestito in modo diverso dagli altri, e nessun bastone ha ancora toccato qualcuno. Per questo molti lettori ci vedono una gara tra ragazzi più che una battaglia." },
      { k: 'contesto', t: "Sul lavoro è una riunione da cui, nella confusione, può uscire un'idea buona. In amore è il battibecco di chi si tiene testa. Vicino al Cinque di Spade si fa più seria." },
      { k: 'rovescio', t: "Rovesciato è spesso la discussione fatta solo nella tua testa: prepari le risposte sotto la doccia, e all'altra persona non hai ancora detto niente." },
    ],
  },
  w06: {
    oggi: [
      "Racconta a qualcuno l'esame passato o il lavoro riuscito bene: una vittoria detta ad alta voce vale doppio.",
      "Rileggi la mail in cui ti ringraziano per un lavoro fatto bene: tienila in una cartella per i giorni storti.",
    ],
    sguardi: [
      { k: 'immagine', t: "Il cavallo è coperto da un drappo verde fino a terra e gira l'occhio verso chi guarda la carta. Della folla si vedono soltanto qualche testa e cinque bastoni." },
      { k: 'contesto', t: "Come risposta è un sì. Sul lavoro è un riconoscimento pubblico, un grazie detto davanti a tutti; in amore, qualcuno che è fiero di farsi vedere con te." },
      { k: 'rovescio', t: "Rovesciato chiede di chi sia l'applauso che aspetti. Può darsi che il lavoro sia buono e che manchi soltanto il pubblico: sono due cose diverse." },
    ],
  },
  w07: {
    oggi: [
      "Se il collega ti interrompe a metà frase, di' con calma «fammi finire» e finisci la frase.",
      "Ti chiedono di spostare ancora la tua sera libera: stavolta rispondi che quella sera è occupata, da te.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ai piedi ha uno stivale da una parte e una scarpa bassa dall'altra. La tradizione ci legge uno che è stato colto di sorpresa, si è vestito in fretta e si è difeso lo stesso." },
      { k: 'contesto', t: "Sul lavoro è tenere il punto con chi vorrebbe il tuo posto o la tua idea. In amore è difendere una scelta davanti alla famiglia. Sta in alto: il vantaggio ce l'ha lui." },
      { k: 'rovescio', t: "Rovesciato può essere una difesa diventata abitudine: rispondi a tono anche a chi stava solo chiedendo, e poi ti domandi perché la gente con te misura le parole." },
    ],
  },
  w08: {
    oggi: [
      "Se oggi arrivano tre messaggi insieme, rispondi subito a quelli da una riga: la giornata corre, corri con lei.",
      "La bolletta e il modulo da spedire stanno sul mobile dell'ingresso: sbrigali stamattina, tutti e due in un colpo.",
    ],
    sguardi: [
      { k: 'immagine', t: "È una delle due sole carte numerate in cui non compare nessuna persona; l'altra è il Tre di Spade. I bastoni stanno già scendendo: tra poco toccano terra." },
      { k: 'storia', t: "La Golden Dawn la chiamava «Rapidità» e le assegnava Mercurio, il pianeta dei messaggi. Per questo ancora oggi molti lettori ci vedono lettere, telefonate, viaggi decisi in fretta." },
      { k: 'contesto', t: "È una delle poche carte che parlano di tempi: presto, nel giro di giorni. In amore è un messaggio che arriva; sul lavoro, cose ferme che si sbloccano tutte insieme." },
    ],
  },
  w09: {
    oggi: [
      "Ti mancano due capitoli, o due giorni alla consegna: non mollare adesso, fai un caffè e torna alla scrivania.",
      "All'ultimo chilometro di corsa le gambe dicono basta: guarda il prossimo lampione e arriva fino a quello.",
    ],
    sguardi: [
      { k: 'immagine', t: "Non guarda davanti a sé: gli occhi vanno di lato, verso la parte da cui potrebbe arrivare qualcosa. I bastoni alle sue spalle non sono tutti alti uguali." },
      { k: 'contesto', t: "Viene subito prima del Dieci: lui resiste, quello dopo si carica di tutto. Sul lavoro è l'ultima settimana prima di una consegna; in amore è chi tiene la guardia alta." },
      { k: 'rovescio', t: "Rovesciato è la guardia montata quando non c'è più nessuno da cui difendersi: la ferita è vecchia, la fasciatura potrebbe venire via, e tu continui a tenerla." },
    ],
  },
  w10: {
    oggi: [
      "Hai detto di sì a tutti questa settimana: scegli un favore dalla lista e chiedi a un altro di farlo.",
      "Fai due viaggi con le borse della spesa invece di uno: nessuno ti dà un premio per le dita viola.",
    ],
    sguardi: [
      { k: 'storia', t: "La figura curva sotto il fascio viene da un mazzo italiano del Quattrocento, il Sola Busca. Nel 1907 il British Museum ne ricevette le fotografie, e Pamela Colman Smith ne riprese alcune scene." },
      { k: 'immagine', t: "Porta i bastoni nel modo più faticoso, tutti davanti alla faccia, e così non vede la strada. Il paese è lì a pochi passi, e lui non può saperlo." },
      { k: 'contesto', t: "Sul lavoro è aver detto troppi sì. In casa è chi fa tutto perché fa prima a farlo che a chiederlo. Vicino al Sei di Denari, l'aiuto c'è: basta domandarlo." },
    ],
  },
  w11: {
    oggi: [
      "Chiedi a una persona che ti incuriosisce come ha imparato il suo mestiere, e ascolta fino in fondo.",
      "Prova stasera la ricetta mai fatta o il primo accordo di ukulele: sbagliare la prima volta fa parte del gioco.",
    ],
    sguardi: [
      { k: 'immagine', t: "Dietro di lui ci sono tre colline a punta che ricordano le piramidi: è lo stesso deserto del Cavaliere di Bastoni. Guarda la cima del bastone come se lo vedesse per la prima volta." },
      { k: 'storia', t: "In italiano il Fante era il soldato a piedi o il giovane servitore; in inglese è il Page, il paggio. Nella tradizione i quattro Fanti portano notizie, ognuno quelle del suo seme." },
      { k: 'rovescio', t: "Rovesciato è l'entusiasmo dei primi tre giorni: il corso comprato e non cominciato, il quaderno nuovo con una pagina scritta. Niente di grave, se lo si riconosce." },
    ],
  },
  w12: {
    oggi: [
      "Oggi dai la prima mezz'ora a quello che ti appassiona, il ballo o la pittura, e i doveri dopo.",
      "Hai una mattina piena di slancio: usala per la parte più dura del lavoro, non per sistemare le cartelle.",
    ],
    sguardi: [
      { k: 'immagine', t: "Dall'elmo e dal braccio dell'armatura escono piume rosse che sembrano fiamme. Anche il cavallo è del colore del fuoco, e s'impenna senza che lui si scomponga." },
      { k: 'contesto', t: "In amore è una passione che arriva di corsa e non promette di fermarsi. Sul lavoro è un cambio, un viaggio, un'occasione da prendere al volo. Come consiglio: muoviti, poi aggiusterai." },
      { k: 'rovescio', t: "Rovesciato è partire per non restare: si cambia città, lavoro o progetto ogni volta che comincia la parte noiosa, che di solito è quella in cui le cose si costruiscono." },
    ],
  },
  w13: {
    oggi: [
      "Davanti allo specchio prima di uscire, cerca la parte di te che ti piace e vestiti per lei.",
      "Proponi tu il posto e l'ora per stasera: le persone vengono volentieri da chi le invita con calore.",
    ],
    sguardi: [
      { k: 'immagine', t: "È l'unica delle quattro regine seduta di fronte, con lo sguardo appena girato. Sui braccioli del trono ci sono due leoni, e altri due, rossi, stanno sullo schienale." },
      { k: 'contesto', t: "Per via del gatto nero molti lettori la considerano la regina delle streghe. In una lettura è spesso una persona precisa: calda, diretta, una che quando entra si nota." },
      { k: 'rovescio', t: "Rovesciata è il calore che ha bisogno di pubblico: se nessuno guarda si spegne, e allora cerca attenzione dove può, anche facendo scintille per poco." },
    ],
  },
  w14: {
    oggi: [
      "Il regalo di gruppo non lo organizza nessuno: apri tu la colletta e dai a ognuno un compito.",
      "Prima di dire alla squadra che cosa fare, chiedi a ognuno che cosa ne pensa: poi decidi tu.",
    ],
    sguardi: [
      { k: 'immagine', t: "Accanto al trono, sulla pedana, c'è una salamandra viva, piccola e scura. Nei bestiari antichi era l'animale che attraversa il fuoco senza bruciarsi." },
      { k: 'contesto', t: "Come persona è un capo che sa entusiasmare, o chi in famiglia decide e se ne prende la responsabilità. Come consiglio: smetti di chiedere il permesso e guida tu questa cosa." },
      { k: 'rovescio', t: "Rovesciato può essere chi accende tutto e non porta a termine niente: grandi annunci il lunedì, e il venerdì il lavoro vero è rimasto agli altri." },
    ],
  },

  c01: {
    oggi: [
      "Se pensando a una persona ti viene da sorridere sul tram, non spiegartelo subito: goditi il sorriso.",
      "Di' a qualcuno «ti voglio bene» oggi, senza un motivo e senza aspettare il compleanno.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla coppa c'è una lettera: sembra una W, oppure una M capovolta. Nel suo libro Waite non la spiega, e i lettori ne discutono da più di cent'anni." },
      { k: 'storia', t: "Nelle carte da gioco francesi le Coppe sono diventate i cuori. Per questo il seme è rimasto, anche per chi gioca a carte senza pensare ai tarocchi, quello dei sentimenti." },
      { k: 'contesto', t: "Non è soltanto amore di coppia: può essere un'amicizia che nasce, un bambino, la voglia di disegnare che torna. Vicino a una carta di Denari è un lavoro che finalmente piace." },
    ],
  },
  c02: {
    oggi: [
      "Al bar con una persona a cui tieni, fai una domanda per ogni storia che racconti: metà e metà.",
      "Stasera guarda chi lava i piatti e chi cucina: se da un po' fa tutto uno solo, cambiate turno.",
    ],
    sguardi: [
      { k: 'immagine', t: "Il bastone con i due serpenti è il caduceo, l'insegna di Mercurio, dio dei messaggeri e degli scambi. In fondo, tra i due, si vede una casa dal tetto rosso su una collina." },
      { k: 'contesto', t: "Fuori dall'amore è un buon socio, una pace fatta, un accordo in cui nessuno ci rimette. Somiglia agli Amanti in piccolo: lì una scelta di vita, qui una stretta di mano." },
      { k: 'rovescio', t: "Rovesciato chiede chi dei due sta tenendo la coppa più in alto. A volte è solo un malinteso: due persone che si vogliono bene e hanno smesso di dirselo." },
    ],
  },
  c03: {
    oggi: [
      "Scrivi agli amici una data precisa, non un «dobbiamo vederci»: giovedì alle otto, a casa tua.",
      "Una bella notizia di un'amica è anche festa tua: chiamala e fatti raccontare tutto dall'inizio.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ai piedi delle tre c'è una zucca, e una di loro tiene in mano un grappolo d'uva: è una festa del raccolto. Una delle tre ci volta le spalle." },
      { k: 'contesto', t: "Sul lavoro è una squadra che si trova bene. In amore può voler dire che c'è una terza persona, e conviene guardare le carte vicine prima di preoccuparsi." },
      { k: 'rovescio', t: "Rovesciato è anche la compagnia che stanca: esci perché ci sono tutti, ridi quando ridono gli altri, e torni a casa con meno voglia di prima." },
    ],
  },
  c04: {
    oggi: [
      "Se ti annoi sul divano scorrendo lo schermo, riguarda l'invito a cui non hai risposto: forse è per stasera.",
      "Il caffè che ti offrono in ufficio lo rifiuti per abitudine: oggi accettalo e scambia due parole.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ha le braccia incrociate e anche le gambe: è chiuso due volte. La mano che esce dalla nuvola è la stessa che regge i quattro Assi del mazzo." },
      { k: 'contesto', t: "Come consiglio è raro ma prezioso: dire di no a una cosa buona, perché non è la tua. Sul lavoro è la noia di un posto sicuro; in amore, chi c'è e non partecipa." },
      { k: 'rovescio', t: "Rovesciato è il giorno in cui alzi gli occhi. Non serve accettare la quarta coppa: basta accorgersi che qualcuno la stava offrendo, e da quanto tempo." },
    ],
  },
  c05: {
    oggi: [
      "Se ripensi ancora a come poteva andare, apri il frigo e guarda che cosa c'è: si cena con quello che è rimasto.",
      "Hai perso un'amicizia e guardi solo quella: oggi scrivi a una delle due persone che ci sono ancora.",
    ],
    sguardi: [
      { k: 'immagine', t: "Dalle coppe cadute escono due liquidi diversi, uno rosso e uno verde. Tra la figura e il castello scorre un fiume, e il ponte per attraversarlo è lì, a due passi." },
      { k: 'contesto', t: "Dipende molto da che cosa ha vicino: con il Sei di Coppe è nostalgia, con il Tre di Spade un dolore fresco, con una carta di Denari una perdita che si può contare." },
      { k: 'rovescio', t: "Rovesciato è il momento in cui la figura si gira. Le tre coppe restano per terra e nessuno le rimette in piedi: cambia soltanto dove guardi." },
    ],
  },
  c06: {
    oggi: [
      "Manda a un amico d'infanzia la foto vecchia che hai ritrovato, senza altro motivo che farlo ridere.",
      "Compra la merendina che mangiavi alle elementari e mangiala piano: un ricordo buono costa un euro.",
    ],
    sguardi: [
      { k: 'immagine', t: "In fondo a sinistra una guardia con la lancia si allontana e volta le spalle ai bambini. I fiori nelle coppe sono bianchi e hanno cinque punte, come piccole stelle." },
      { k: 'contesto', t: "In amore è spesso qualcuno che torna dal passato, o un affetto semplice. Sul lavoro è un mestiere ritrovato. In casa parla di fratelli, di sorelle, del posto dove si è cresciuti." },
      { k: 'rovescio', t: "Rovesciato è il ricordo ritoccato: un periodo che a ripensarci sembra tutto dolce, e che a viverlo aveva anche le sue giornate storte." },
    ],
  },
  c07: {
    oggi: [
      "Hai venti schede aperte e tre serie cominciate: stasera scegline una e chiudi le altre.",
      "Tra il corso di ceramica, il viaggio e il cambio di lavoro, scrivi quale faresti se potessi farne uno solo.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla coppa con la corona d'alloro, quella della vittoria, è disegnato un teschio. E la figura al centro, sotto il velo, è l'unica delle sette cose che non si lascia vedere." },
      { k: 'contesto', t: "Sul lavoro è avere troppe idee aperte; in amore, innamorarsi di una possibilità più che di una persona. Come consiglio dice di sognare pure, e poi sceglierne una e toccarla." },
      { k: 'rovescio', t: "Rovesciato è una nuvola in meno: delle sette coppe ne resta una vera. Può fare un po' di tristezza, come sempre quando si sceglie e le altre porte si chiudono." },
    ],
  },
  c08: {
    oggi: [
      "Se esci dalla stessa serata ogni volta con un po' di vuoto, sabato prova a non andarci.",
      "Il libro che ti trascini da mesi senza piacere puoi chiuderlo a metà: sul comodino ce n'è un altro.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le coppe sono cinque sotto e tre sopra, e nella fila in alto resta un posto vuoto. Quello che manca non è per terra: non c'è mai stato, e lui va a cercarlo." },
      { k: 'storia', t: "La Golden Dawn la chiamava «Successo abbandonato»: le coppe sono piene e in piedi, niente è andato male. È una delle poche carte in cui si lascia qualcosa che funziona." },
      { k: 'rovescio', t: "Rovesciato può essere tornare indietro a controllare: vai via e ti volti dieci volte, o resti con le valigie fatte nell'ingresso. Capita, prima di una partenza vera." },
    ],
  },
  c09: {
    oggi: [
      "Ordina il piatto che vuoi davvero, non quello più ragionevole, e mangialo senza chiedere scusa a nessuno.",
      "Pensa a un desiderio di due anni fa che oggi è la tua vita normale: fermati un minuto a godertelo.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le coppe stanno su un banco coperto da una tovaglia azzurra che arriva fino a terra, e nessuno vede che cosa c'è sotto. Lui siede su una semplice panca di legno." },
      { k: 'contesto', t: "Molti lettori la chiamano la carta del desiderio: in risposta a una cosa che vuoi, è un sì. Vicino al Dieci di Coppe passa dal piacere di uno alla gioia di tutti." },
      { k: 'rovescio', t: "Rovesciato chiede se il desiderio era tuo. Si può ottenere proprio quello che si era chiesto e scoprire che lo si voleva per far contento qualcun altro." },
    ],
  },
  c10: {
    oggi: [
      "Alla cena di famiglia posa la forchetta un momento e guarda la tavola: tienti questa immagine.",
      "Chiama casa senza un motivo, solo per sentire le voci e sapere che cosa hanno mangiato.",
    ],
    sguardi: [
      { k: 'immagine', t: "I due bambini ballano tenendosi per mano e non guardano l'arcobaleno: lo guardano soltanto i grandi. La coppia è vista di spalle, e ognuno dei due alza un braccio solo." },
      { k: 'contesto', t: "Il Nove era la contentezza di uno solo, seduto davanti alle sue coppe; il Dieci è in piedi, all'aperto, con altri. In una domanda di lavoro dice che la risposta sta a casa." },
      { k: 'rovescio', t: "Rovesciato è l'arcobaleno che c'è e nessuno guarda, perché in famiglia si sta discutendo di chi lava i piatti. Spesso basta che uno alzi la testa." },
    ],
  },
  c11: {
    oggi: [
      "Lascia un biglietto sul tavolo a chi vive con te: due righe a mano, senza un'occasione.",
      "Se ti scappa da piangere per una canzone in macchina, lasciala finire: è il cuore che si allena.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla tunica ha dei fiori rosa e bianchi che molti leggono come fiori di loto, gli stessi dello stagno dell'Asso di Coppe. Il pesce lo guarda negli occhi, e lui sorride." },
      { k: 'contesto', t: "Come notizia è un invito, un messaggio affettuoso, a volte l'annuncio di un bambino. Come persona è qualcuno di giovane e sensibile. Come consiglio: prendi sul serio un'idea che ti sembra strana." },
      { k: 'rovescio', t: "Rovesciato è la sensibilità che si offende presto: un messaggio letto nel tono sbagliato, una risposta che tarda e diventa subito un rifiuto." },
    ],
  },
  c12: {
    oggi: [
      "Invita tu a prendere un caffè la persona che ti piace: una proposta chiara, con giorno e ora.",
      "Se hai promesso a qualcuno una gita o un cinema, oggi fissa la data: le belle parole scadono.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ha le ali sull'elmo e anche ai talloni, come Mercurio, il messaggero degli dei. Sulla tunica sono ricamati dei pesci rossi, e il cavallo tiene la testa bassa." },
      { k: 'contesto', t: "È il più lento dei quattro Cavalieri dopo quello di Denari: va al passo e tiene la coppa dritta. In amore è una dichiarazione; sul lavoro, un'offerta fatta con garbo." },
      { k: 'rovescio', t: "Rovesciato è chi ama l'idea di arrivare con la coppa in mano più della persona a cui la porta. Belle parole, e poi sparisce fino alla prossima scena." },
    ],
  },
  c13: {
    oggi: [
      "Quando oggi qualcuno ti racconta un guaio, non cercare la soluzione: chiedi «e tu come stai» e ascolta.",
      "Dopo una giornata passata ad ascoltare tutti, chiudi la porta del bagno e chiediti come stai tu.",
    ],
    sguardi: [
      { k: 'immagine', t: "È l'unica coppa chiusa di tutto il seme: ha un coperchio e due figure con le ali ai lati. Lei la guarda e non la apre: quello che c'è dentro lo sa già." },
      { k: 'contesto', t: "Come persona è chi ti ascolta senza darti subito la soluzione. Come consiglio: fidati di quello che senti, anche senza prove. Vicino alle Spade ricorda che capire non basta." },
      { k: 'rovescio', t: "Rovesciata è la spugna: assorbe l'umore di chiunque entri nella stanza, e a sera non sa più quale tristezza sia la sua." },
    ],
  },
  c14: {
    oggi: [
      "Ti arriva una frecciata a pranzo dai parenti: respira, versa da bere a chi l'ha detta e cambia discorso.",
      "Hai il cuore in tempesta e una giornata di lavoro davanti: riconosci la tempesta, poi fai una telefonata alla volta.",
    ],
    sguardi: [
      { k: 'immagine', t: "Porta al collo un ciondolo a forma di pesce. Il trono sta su una lastra di pietra in mezzo alle onde, e lui non si bagna nemmeno la punta delle scarpe." },
      { k: 'contesto', t: "Come persona è chi resta calmo quando gli altri si agitano: un medico, un padre, un amico più grande. Sul lavoro è trattare con tatto. In amore, sentimenti profondi e poche parole." },
      { k: 'rovescio', t: "Rovesciato è la calma usata come coperchio. Fuori è tutto in ordine, sotto il mare è mosso, e ogni tanto esce da una battuta troppo tagliente." },
    ],
  },

  s01: {
    oggi: [
      "Scrivi in una riga sola qual è il problema, su un foglio: se non ci sta, non l'hai ancora capito.",
      "Di' il vero motivo per cui non vieni sabato, in una frase gentile, invece della solita scusa.",
    ],
    sguardi: [
      { k: 'immagine', t: "Intorno alla lama cadono sei gocce dorate, tre per parte, con la forma della lettera ebraica Yod. Dalla corona pendono un ramo d'ulivo e uno di palma: pace e vittoria." },
      { k: 'storia', t: "Nelle carte da gioco francesi le Spade sono diventate le picche. Nei tarocchi sono il seme della testa: pensieri, parole, decisioni, e i tagli che ne vengono." },
      { k: 'contesto', t: "È il più tagliente degli Assi: una decisione presa, una verità detta, un contratto firmato. In amore non è romantico, ma è la chiarezza che permette di sapere a che punto si è." },
    ],
  },
  s02: {
    oggi: [
      "Non sai decidere tra due case o due offerte: lancia una moneta e nota per quale lato fai il tifo.",
      "Hai smesso di rispondere a una persona per non scegliere: anche il tuo silenzio le arriva come una risposta.",
    ],
    sguardi: [
      { k: 'storia', t: "La Golden Dawn chiamava questa carta «Pace ristabilita» e le assegnava la Luna in Bilancia. Più che un blocco, per loro era una tregua: le spade sono incrociate, nessuna colpisce." },
      { k: 'immagine', t: "Dà le spalle al mare, e dall'acqua dietro di lei spuntano degli scogli. La benda le copre gli occhi, ma le mani sono libere: se l'è messa da sola e da sola può toglierla." },
      { k: 'rovescio', t: "Rovesciato può essere anche aver chiesto troppi pareri: dieci persone ti hanno detto dieci cose, e la benda adesso è fatta delle voci degli altri." },
    ],
  },
  s03: {
    oggi: [
      "Una frase ti ha fatto male ieri e oggi brucia ancora: non fare finta di niente, dillo a una persona fidata.",
      "Se oggi il petto ti pesa, non riempire la giornata per non sentirlo: siediti dieci minuti e lascialo pesare.",
    ],
    sguardi: [
      { k: 'storia', t: "Il cuore trafitto da tre spade è quasi identico a una carta del Sola Busca, mazzo italiano di fine Quattrocento. Dal 1907 le sue fotografie erano al British Museum: è probabile che Pamela Colman Smith le abbia viste lì." },
      { k: 'immagine', t: "Non c'è nessuna persona, solo il cuore e la pioggia. Le spade lo attraversano da parte a parte senza romperlo: resta intero, rosso, al centro della carta." },
      { k: 'contesto', t: "Essendo una carta di Spade, il dolore passa dalla testa: una frase sentita, una verità letta in un messaggio. Vicino alle Coppe guarisce; vicino ad altre Spade ci si rimugina." },
    ],
  },
  s04: {
    oggi: [
      "Metti la sveglia venti minuti dopo pranzo e sdraiati al buio: il lavoro del pomeriggio ti aspetta lo stesso.",
      "Stasera rispondi «ne parliamo domani» a ogni discussione che comincia dopo le dieci.",
    ],
    sguardi: [
      { k: 'immagine', t: "Nella vetrata una figura si inginocchia davanti a un'altra, in piedi. Le tre spade sul muro hanno la punta in giù, verso il cavaliere; la quarta è scolpita sul fianco della tomba." },
      { k: 'contesto', t: "Dopo il Tre viene il Quattro: prima la ferita, poi il letto. Sul lavoro sono ferie da prendere davvero. In amore è una pausa che fa bene, non un addio." },
      { k: 'rovescio', t: "Rovesciato è il riposo che non riposa: ti stendi sul divano con il telefono in mano, e dopo due ore hai più pensieri di prima." },
    ],
  },
  s05: {
    oggi: [
      "Hai avuto l'ultima parola e l'altra persona ha smesso di scrivere: chiediti che cosa hai vinto.",
      "In coda o nel traffico qualcuno ti passa davanti: lascialo andare, oggi quella gara non vale la giornata.",
    ],
    sguardi: [
      { k: 'immagine', t: "Ne tiene tre e ne lascia due per terra: sono quelle di chi se n'è andato. Le nuvole sono strappate e tirate dal vento, tutte nella stessa direzione." },
      { k: 'contesto', t: "La domanda della carta è chi sei tu nella scena: quello che raccoglie le spade o uno dei due che se ne vanno. Sul lavoro è una discussione vinta che costa un collega." },
      { k: 'rovescio', t: "Rovesciato è l'ultima parola lasciata all'altro, per una volta. Brucia per dieci minuti, e poi ci si accorge che la serata è salva." },
    ],
  },
  s06: {
    oggi: [
      "Dopo una giornata storta, torna a casa a piedi per la strada lunga: i guai restano un poco indietro.",
      "Sul treno che ti porta via da una settimana pesante, guarda dal finestrino e non aprire il computer.",
    ],
    sguardi: [
      { k: 'immagine', t: "L'acqua è mossa da un lato della barca e liscia dall'altro, quello verso cui vanno. Le spade restano piantate a bordo: i pensieri di prima viaggiano con loro." },
      { k: 'contesto', t: "È un miglioramento lento, non una festa: si va verso il meglio con la schiena curva. Può essere un viaggio vero, un trasloco, o il primo mese dopo un periodo brutto." },
      { k: 'rovescio', t: "Rovesciato è arrivare sull'altra riva e scoprire di aver portato tutto con sé: casa nuova, stessi pensieri. Vuol dire che un pezzo del viaggio va fatto dentro." },
    ],
  },
  s07: {
    oggi: [
      "Hai detto una piccola bugia per saltare una festa: prima che si complichi, di' com'è andata davvero.",
      "Se stai leggendo di nascosto il profilo di qualcuno, chiediti che cosa cerchi, e se puoi chiederlo a voce.",
    ],
    sguardi: [
      { k: 'immagine', t: "Tiene le spade per la lama, a mani nude, e cammina in punta di piedi guardandosi indietro. In fondo a sinistra, piccolissime, si vedono delle figure attorno a un fuoco." },
      { k: 'contesto', t: "Non è sempre un ladro. Sul lavoro è fare da sé senza chiedere permesso; in amore è una cosa non detta. Le carte vicine dicono quanto pesa." },
      { k: 'rovescio', t: "Rovesciato può essere la piccola bugia che racconti a te: «lo faccio domani», «non mi importa». Le due spade rimaste piantate sono quello che sai benissimo." },
    ],
  },
  s08: {
    oggi: [
      "La mail che temi di aprire pesa di più chiusa: aprila in piedi, leggila una volta, poi decidi.",
      "Ti ripeti «non posso» davanti alla porta del capo: prova a bussare, e scopri se era chiusa a chiave.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le spade stanno ai lati e dietro: davanti a lei non ce n'è nessuna. Le bende le legano le braccia ma non le gambe, e in alto, sulla roccia, c'è un castello." },
      { k: 'contesto', t: "In amore è restare perché «non ho alternative»; sul lavoro, credere di non saper fare altro. Somiglia al Diavolo, ma qui le catene sono pensieri, non voglie." },
      { k: 'rovescio', t: "Rovesciato non scioglie tutto insieme. Di solito cade prima la benda: vedi dove sei, vedi che davanti è libero, e le braccia restano legate ancora un po'." },
    ],
  },
  s09: {
    oggi: [
      "Se stanotte i pensieri non ti lasciano dormire, alzati e bevi un bicchiere d'acqua in cucina: a letto diventano più grandi.",
      "La preoccupazione che ti tieni da giorni, dilla a voce a qualcuno mentre camminate: detta pesa meno.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sul fianco del letto è intagliata una scena: una figura ne abbatte un'altra. Le spade sono appese nel buio alle spalle di chi è nel letto, e nessuna lo tocca." },
      { k: 'contesto', t: "È una carta di pensieri, non di fatti: dice quanto sei in ansia, non che la cosa temuta succederà. Vicino al Sole o alla Stella è proprio l'ora prima del mattino." },
      { k: 'rovescio', t: "Rovesciato è la luce accesa sul comodino. Il pensiero è lo stesso, ma appena lo scrivi o lo dici a qualcuno prende la misura giusta, quasi sempre più piccola." },
    ],
  },
  s10: {
    oggi: [
      "È andata male, e peggio di così oggi non va: mangia una minestra calda e vai a letto presto.",
      "Il colloquio è andato malissimo e ormai è finito: scrivi una risposta che daresti diversa, poi chiudi il quaderno.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le spade sono dieci, ma ne sarebbe bastata una: è una carta che esagera, e molti lettori la leggono con un mezzo sorriso. Dietro, l'acqua è ferma e il cielo schiarisce dal basso." },
      { k: 'contesto', t: "È una fine nei pensieri prima che nei fatti: un'idea, un progetto, un modo di vedere una persona. Dopo il Dieci il seme ricomincia dall'Asso, cioè da un'idea nuova e pulita." },
      { k: 'rovescio', t: "Rovesciato, le spade cadono da sole: per come è disegnata la carta, basta girarla. È il mattino dopo una brutta giornata, quando ci si alza con la schiena indolenzita." },
    ],
  },
  s11: {
    oggi: [
      "In riunione, prima di dire la tua, fai una domanda vera e ascolta la risposta intera.",
      "Hai sentito una voce su una persona: prima di ripeterla chiediti da chi viene e chi l'ha verificata.",
    ],
    sguardi: [
      { k: 'immagine', t: "Nel cielo, in alto a sinistra, volano dieci uccelli in gruppo. Il vento gli tira i capelli da una parte, e lui guarda dall'altra: tiene d'occhio qualcosa alle sue spalle." },
      { k: 'contesto', t: "Come notizia è un'informazione, a volte una chiacchiera da verificare. Come persona è qualcuno di sveglio che fa domande scomode. Come consiglio: prima di decidere, informati meglio." },
      { k: 'rovescio', t: "Rovesciato è controllare troppo: il telefono dell'altro, l'ultimo accesso, le parole esatte di un messaggio. La spada alzata diventa un modo per non fidarsi." },
    ],
  },
  s12: {
    oggi: [
      "Hai una risposta tagliente sulla punta delle dita: scrivila nelle note, non nella chat, e rileggila tra un'ora.",
      "Hai una critica da fare a un collega: dilla oggi, in faccia e in due frasi, senza girarci intorno.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sulla bardatura del cavallo ci sono farfalle e uccelli, le creature dell'aria. Il pennacchio dell'elmo e il mantello volano all'indietro: corre contro vento." },
      { k: 'contesto', t: "È il più veloce dei Cavalieri, e non sempre guarda dove arriva. Sul lavoro è una decisione rapida, una mail scritta di getto. In amore, qualcuno che dice tutto subito." },
      { k: 'rovescio', t: "Rovesciato è la risposta mandata prima di finire di leggere la domanda. Spesso basta rileggere il proprio messaggio dieci minuti dopo per sentire il vento calare." },
    ],
  },
  s13: {
    oggi: [
      "Se ti chiedono un parere su un vestito o su un fidanzato, di' quello che pensi, con una frase gentile davanti.",
      "Guarda il tuo errore di ieri come guarderesti quello di una persona cara: i fatti, senza insulti.",
    ],
    sguardi: [
      { k: 'storia', t: "Nei vecchi manuali era la carta della vedova: una donna che ha conosciuto una perdita e per questo vede chiaro. Oggi si legge come chiunque dica la verità senza farne un'arma." },
      { k: 'immagine', t: "Sul fianco del trono è scolpita la testa di un bambino con le ali. Dal polso alzato le pende una nappa, e sopra di lei, in tutto il cielo, vola un uccello solo." },
      { k: 'rovescio', t: "Rovesciata è la battuta che ha ragione e fa male lo stesso. La mano tesa si abbassa, resta soltanto la spada, e chi la tiene di solito è stato ferito per primo." },
    ],
  },
  s14: {
    oggi: [
      "Due persone ti raccontano la stessa lite: ascoltale entrambe fino in fondo prima di dire chi ha ragione.",
      "Datti una regola per le spese di questo mese, scrivila e rispettala: una sola, e chiara.",
    ],
    sguardi: [
      { k: 'immagine', t: "La sua spada non è del tutto dritta: pende appena da una parte, a differenza di quella della Giustizia. Nel cielo, alla sua sinistra, volano due uccelli." },
      { k: 'contesto', t: "Come persona è un giudice, un medico, un consulente: qualcuno a cui si chiede un parere chiaro. Come consiglio: metti da parte la simpatia e guarda i fatti, per iscritto se serve." },
      { k: 'rovescio', t: "Rovesciato è avere ragione a tutti i costi. Il ragionamento fila, le regole sono dalla tua parte, e intanto a tavola non parla più nessuno." },
    ],
  },

  p01: {
    oggi: [
      "Ti hanno proposto un lavoretto o un corso pagato: prima di dire «vediamo», chiedi oggi i dettagli.",
      "Metti da parte dieci euro oggi, in un barattolo o su un conto: un seme si pianta piccolo.",
    ],
    sguardi: [
      { k: 'immagine', t: "È l'unico dei quattro Assi in cui dal cielo non cade niente: né foglie né gocce. Tutto quello che questa carta promette sta già nella mano, e più giù, nel giardino." },
      { k: 'storia', t: "Nelle carte da gioco francesi i Denari sono diventati i quadri. Nei mazzi italiani antichi erano monete d'oro; la stella a cinque punte nel cerchio arriva con gli occultisti inglesi, tra Otto e Novecento." },
      { k: 'contesto', t: "In amore non è passione: è qualcuno che c'è, che si presenta, che fa una cosa concreta per te. Sul lavoro è un'offerta, un primo incasso, un posto." },
    ],
  },
  p02: {
    oggi: [
      "Hai la lavatrice che gira e una consegna alle cinque: fai un pezzo dell'una e un pezzo dell'altra, canticchiando.",
      "Tra l'affitto e il regalo di compleanno i conti ballano: sposta una spesa alla settimana prossima, senza drammi.",
    ],
    sguardi: [
      { k: 'immagine', t: "Il cappello rosso è alto quasi quanto il suo busto, e le navi alle sue spalle sono due, su onde alte come colline. Lui intanto guarda una delle monete, non il mare." },
      { k: 'storia', t: "La Golden Dawn la chiamava «Cambiamento armonioso»: per loro non era affanno, era il ritmo di una cosa che sale mentre un'altra scende, come le due navi sulle onde." },
      { k: 'rovescio', t: "Rovesciato è un'agenda in cui ogni ora è già di qualcuno. La soluzione della carta non è diventare più bravi a destreggiarsi: è posare una delle due monete." },
    ],
  },
  p03: {
    oggi: [
      "Fai leggere la presentazione a chi lavora con te prima di consegnarla: quattro occhi vedono l'errore.",
      "Di' a chi ha montato la libreria con te che cosa ha fatto bene: il merito di un lavoro si divide.",
    ],
    sguardi: [
      { k: 'immagine', t: "L'artigiano lavora in piedi su una panca. I due che lo guardano sono un monaco con la tonsura e una figura in un mantello a pois, e i tre denari sono scolpiti nella pietra dell'arco." },
      { k: 'contesto', t: "In amore è una coppia che costruisce qualcosa insieme, anche solo montare un mobile senza litigare. Sul lavoro è la carta migliore per una collaborazione: ognuno porta un mestiere diverso." },
      { k: 'rovescio', t: "Rovesciato è il lavoro di gruppo in cui uno fa e due commentano. Oppure sei tu che non mostri a nessuno quello che fai finché non è perfetto." },
    ],
  },
  p04: {
    oggi: [
      "Apri il cassetto dove tieni le cose «che possono servire» e regalane una oggi.",
      "Se controlli il saldo del conto tre volte al giorno, oggi guardalo una volta sola e offri un gelato.",
    ],
    sguardi: [
      { k: 'immagine', t: "Volta le spalle alla città e tiene i piedi sopra due monete: finché le protegge così, non può alzarsi. Ne ha una anche sulla testa, sopra la corona." },
      { k: 'contesto', t: "Sui soldi è prudenza, e non c'è niente di male. In amore è tenersi stretti per paura. Come consiglio vale per un periodo: adesso metti da parte, poi però riapri le mani." },
      { k: 'rovescio', t: "Rovesciato può essere una spesa fatta per sentirsi vivi dopo mesi di rinunce. Né bene né male: dice che la presa era troppo stretta da troppo tempo." },
    ],
  },
  p05: {
    oggi: [
      "Se questo mese i soldi non bastano, dillo a una persona di cui ti fidi: da soli pesa il doppio.",
      "Quando ti pare che tutti abbiano una serata tranne te, scrivi a una persona: «ci sei stasera?».",
    ],
    sguardi: [
      { k: 'immagine', t: "L'uomo con le stampelle porta una campanella al collo, come nel Medioevo i malati che dovevano annunciarsi. La vetrata è accesa, ma nel disegno non si vede nessuna porta." },
      { k: 'contesto', t: "Non parla solo di soldi: è sentirsi fuori da un gruppo, da una famiglia. I due però camminano insieme, e in amore questo conta: l'inverno si attraversa in due." },
      { k: 'rovescio', t: "Rovesciato è accorgersi della finestra. L'orgoglio di cavarsela senza nessuno si scioglie un po', e si bussa: di solito qualcuno apre più in fretta del previsto." },
    ],
  },
  p06: {
    oggi: [
      "Quando qualcuno si offre di pagarti il pranzo o di darti un passaggio, di' grazie e accetta.",
      "Regala un'ora precisa del tuo tempo a chi te la chiede, e non segnare il debito da nessuna parte.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le monete cadono nelle mani di uno solo dei due: l'altro aspetta ancora. Sul mantello azzurro di quello che aspetta c'è una piccola toppa rossa." },
      { k: 'contesto', t: "Chiede sempre da che parte della bilancia stai: oggi dai o ricevi. Sul lavoro è un aumento, un prestito, un favore. In amore, un periodo in cui uno sostiene l'altro." },
      { k: 'rovescio', t: "Rovesciato è il regalo che ti fa sentire in debito, o il favore che poi viene ricordato a tavola. Vale anche al contrario: dare per sentirsi in alto." },
    ],
  },
  p07: {
    oggi: [
      "Sei in palestra da due mesi e lo specchio non dice niente: continua, il corpo cambia più piano della voglia.",
      "Non tirare fuori la torta dal forno per guardarla ogni due minuti: oggi con quel progetto fai lo stesso.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sei monete stanno sulla pianta e una è per terra, davanti ai suoi piedi: forse il primo frutto, già colto. Lui tiene il mento sulle mani e le mani sul manico." },
      { k: 'storia', t: "La Golden Dawn la chiamava «Successo non compiuto»: il lavoro è fatto e il risultato non ancora. È la carta di chi sta a metà e deve decidere se continuare a zappare." },
      { k: 'rovescio', t: "Rovesciato è strappare la pianta per vedere se ha messo radici. Controlli i risultati ogni giorno, e ogni giorno ti sembrano pochi perché ieri erano gli stessi." },
    ],
  },
  p08: {
    oggi: [
      "Fai i tuoi venti minuti di inglese anche oggi che non ne hai voglia: conta la fila dei giorni.",
      "Rifai con cura un gesto di ogni giorno, il letto o la piega delle camicie: così si impara un mestiere.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sei monete sono appese al palo, una è sotto lo scalpello e una aspetta per terra. Il paese è lontano, alle sue spalle: per imparare si è messo in disparte." },
      { k: 'contesto', t: "Rispetto al Tre di Denari qui non c'è pubblico: nessuno guarda, nessuno applaude. È lo studio, la gavetta, il corso serale. In amore sono le attenzioni piccole ripetute ogni giorno." },
      { k: 'rovescio', t: "Rovesciato è rifare la stessa moneta per paura di consegnarla. Oppure il contrario: farne otto in fretta, tutte un po' storte, per finire prima." },
    ],
  },
  p09: {
    oggi: [
      "Con i soldi che hai guadagnato tu, comprati oggi un piccolo lusso e non giustificarlo con nessuno.",
      "Passa un'ora per conto tuo in un posto bello, un giardino o una libreria: te la sei guadagnata.",
    ],
    sguardi: [
      { k: 'immagine', t: "Il falco ha il cappuccio rosso sugli occhi, come si usa nella caccia. In basso, sul sentiero, passa una lumaca, e i fiori della veste somigliano al segno di Venere." },
      { k: 'contesto', t: "È una delle poche carte in cui una persona sta bene da sola, e si vede. In amore dice che non hai bisogno di qualcuno per stare in piedi, e questo cambia chi scegli." },
      { k: 'rovescio', t: "Rovesciato è il giardino curato in cui non entra nessuno. Tutto è in ordine e guadagnato, e manca qualcuno a cui far assaggiare l'uva." },
    ],
  },
  p10: {
    oggi: [
      "Usa oggi un oggetto che viene dalla tua famiglia, la moka della nonna o una coperta: è già un'eredità.",
      "Guarda una vecchia foto di famiglia e cerca il tuo naso o le tue mani in una faccia di allora.",
    ],
    sguardi: [
      { k: 'immagine', t: "Le dieci monete non sono messe a caso: disegnano l'Albero della Vita della Cabala, con le sue dieci sfere. Il bambino, mezzo nascosto, allunga la mano verso uno dei cani." },
      { k: 'contesto', t: "È una carta di tempi lunghi: mutui, case, cognomi, cose che passano dai nonni ai nipoti. In amore parla di famiglie che si incontrano più che di due persone sole." },
      { k: 'rovescio', t: "Rovesciato è l'eredità che non sono soldi: il modo di litigare, di tacere, di fare il Natale. Si può ricevere una casa insieme alle sue abitudini, e scegliere quali tenere." },
    ],
  },
  p11: {
    oggi: [
      "Prima di iscriverti al master o di aprire la partita IVA, studia un'ora i numeri veri: quanto costa e quanto dura.",
      "Leggi fino in fondo il manuale o il contratto che hai solo sfogliato: oggi un capitolo, con la matita in mano.",
    ],
    sguardi: [
      { k: 'immagine', t: "La moneta sembra galleggiare sopra le sue dita: la sfiora appena. In fondo a destra c'è un pezzo di campo già arato, lo stesso che ritrovi nel Cavaliere di Denari." },
      { k: 'contesto', t: "Come notizia riguarda cose pratiche: un colloquio, un esame, un preventivo. Come persona è chi studia sul serio. Come consiglio: comincia in piccolo e impara il mestiere prima di chiedere il risultato." },
      { k: 'rovescio', t: "Rovesciato è lo studente eterno: un altro corso, un altro libro, un altro video, per non arrivare mai al giorno in cui si prova davvero." },
    ],
  },
  p12: {
    oggi: [
      "Riordina un solo cassetto oggi e uno domani: una casa si sistema così, senza un sabato di fatica.",
      "Al lavoro oggi fai il compito noioso che tutti rimandano, dall'inizio alla fine, senza cercare scorciatoie.",
    ],
    sguardi: [
      { k: 'immagine', t: "È l'unico cavallo nero dei quattro Cavalieri. Sull'elmo di lui e sulla testa del cavallo c'è lo stesso ciuffo di foglie verdi, e il campo davanti è già arato." },
      { k: 'contesto', t: "È il più lento dei Cavalieri e il più affidabile: quello che dice lo fa, anche se ci mette un mese. In amore non fa sorprese, e fa trovare la macchina con il pieno." },
      { k: 'rovescio', t: "Rovesciato è l'abitudine che ha preso il posto della scelta. Stessa strada, stesso orario, stesso piatto, e non ricordi più se ti piacciono o se sono soltanto comodi." },
    ],
  },
  p13: {
    oggi: [
      "Prepara una pentola di zuppa che basti per tre giorni, e portane un piatto a chi abita di fianco.",
      "Hai badato a tutti e alla casa: adesso siediti, metti i piedi su una sedia e bevi il tè finché è caldo.",
    ],
    sguardi: [
      { k: 'immagine', t: "Sul bracciolo del trono è scolpita una testa di capra, e sullo schienale frutti e figure. Sopra di lei le rose fanno un arco, come sopra il Mago." },
      { k: 'contesto', t: "Come persona è chi ti fa sedere e ti mette davanti un piatto prima di chiederti che cosa è successo. Sul lavoro è buon senso con i soldi. Come consiglio: occupati del corpo e della casa." },
      { k: 'rovescio', t: "Rovesciata è la dispensa piena di chi non mangia mai seduto. Tutto funziona per gli altri, e la parte viva e leggera, quella del coniglio ai suoi piedi, è scappata." },
    ],
  },
  p14: {
    oggi: [
      "Oggi paga tu il giro al bar, senza farlo pesare: è bello che il tuo lavoro arrivi anche agli altri.",
      "Guarda quello che hai messo insieme in questi anni, il mestiere o i risparmi, e chiediti con chi dividerlo.",
    ],
    sguardi: [
      { k: 'immagine', t: "Da sotto la veste, tutta grappoli e foglie di vite, spunta un piede in armatura. Le teste di toro sul trono sono quattro: due in alto e due sui braccioli." },
      { k: 'contesto', t: "Come persona è chi ha costruito qualcosa di solido e lo condivide: un datore di lavoro giusto, un padre presente. Come consiglio: fidati di ciò che dura e rende piano." },
      { k: 'rovescio', t: "Rovesciato è misurare tutto in soldi, anche il tempo degli altri. Oppure è avere abbastanza da anni e non riuscire a sentirlo." },
    ],
  },
};
