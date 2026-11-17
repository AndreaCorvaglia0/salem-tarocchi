// «Che ne pensi di lei?» (docs/DESIGN.md, 17 novembre): what the people of Salem say of each other, the
// question they ask her about one another, and the Reader's own questions. Rules: glue/opinions.rules.js;
// play: glue/opinions.js; the page: ui/people.js. Writing rules: docs/WRITING.md (no line here genders her).
//
// PEOPLE_OP = [{ id, nome, detto, met, tratto, voci, domanda }]
//   nome     as a heading («Il Giudice»); detto: inside a sentence («il Giudice»)
//   met      a condition (core/cond.js) on what she HAS: a flag a scene set, a spread she was taught, a power
//   tratto   what the person stands for, a verb phrase: «Malva, che {tratto}.» (the Reader's mirror, the page)
//   voci     [{ by, t, when? }]: what `by` says of this person; said only when she has met both and `when` holds
//   domanda  { a: [{ t, v, trait }] x3 (v: 1 warm, 0 mixed, -1 wary; trait: one axis of the portrait, +-1),
//              by: { asker: { q, own, re: [reply to a[0], a[1], a[2]] } } }
//            own: the asker's own feeling for the person (1, 0, -1): the bond grows when her answer agrees
// Trait axes (core/progress.js AXES, positive pole first): esplora curiosa/dritta, parola schietta/accorta,
// tono gentile/pungente, rischio audace/prudente, guida cuore/testa.

const any = (...flags) => ({ any: flags.map((flag) => ({ flag })) });

export const PEOPLE_OP = [
  {
    id: 'malva', nome: 'Comare Malva', detto: 'Malva', met: { any: [{ flag: 'shop.open' }, { spread: 'single' }] },
    tratto: 'tiene insieme il villaggio e non vuole sentirselo dire',
    voci: [
      { by: 'ortica', t: "Malva quando è sola canta, e ha anche una bella voce. Io gliel'ho detto una volta, anni fa, e da allora prima di cominciare chiude la finestra." },
      { by: 'ginepra', t: 'Malva mi sgrida ogni volta che mi vede, e poi mi riempie le tasche di pane. Secondo me sgrida soltanto le persone a cui tiene, o almeno lo spero.' },
      { by: 'tartufo', t: 'Malva ripete che non sono suo e non sono di nessuno. Però il lardo sulla madia lo lascia sempre dalla parte dove arrivo io.' },
      { by: 'bottegaio', t: 'La levatrice controlla tutto quello che le vendo e non mi ha mai fatto un complimento. È anche la sola cliente a cui non ho mai sbagliato il resto.' },
    ],
    domanda: {
      a: [
        { t: 'Brontola, ma intanto mi ha dato una casa e un mestiere.', v: 1, trait: { guida: 1 } },
        { t: 'Non capisco mai se è contenta di me, e mi pesa.', v: 0, trait: { parola: 1 } },
        { t: 'Con lei misuro le parole, perché non lascia passare niente.', v: -1, trait: { parola: -1 } },
      ],
      by: {
        ortica: { own: 1, q: 'Senti, già che sei qui te lo chiedo, perché su questo il merlo non mi sa dire niente: tu di Malva che idea ti sei fatta?', re: [
          'Una casa e un mestiere, ecco: hai detto in dieci parole quello che io racconto in un pomeriggio. Glielo riferisco, e vedrai che fa finta di non sentire.',
          'Non lo capisce nessuno, se ti consola. Io la conosco da trent\'anni e ho imparato a guardarle le mani: se ti mette davanti da mangiare, è contenta.',
          'Fai bene a misurarle. Sappi però che lei si segna tutto, anche le cose buone, e le cose buone non le racconta a nessuno.',
        ] },
        ginepra: { own: 1, q: 'Posso chiederti una cosa di Malva? Cioè, te la chiedo e basta: a te fa un poco paura, o succede soltanto a me?', re: [
          'Ah ah, è vero, brontola e intanto fa. A me una casa non l\'ha data, però il pane sì, e un giorno la ringrazio, cioè no, che porta male.',
          'Allora siamo in due, e mi sento già meglio. Io ho deciso che quando sta zitta è contenta, perché quando non lo è si sente fino al bosco.',
          'Tu le misuri, e io con lei le sbaglio tutte, ah ah. Però una volta mi ha ricucito un guanto senza dire niente, quindi qualcosa lo lascia passare.',
        ] },
        tartufo: { own: 1, q: 'Dimmi una cosa, visto che la conosci da meno tempo di me: della levatrice che cosa pensi, quando lei non sente?', re: [
          'È la risposta di chi ha guardato le mani e non la faccia. Con lei è il metodo giusto, e te lo dice uno che mangia il suo lardo da tre inverni.',
          'Ti svelo un segreto da gatto: quando è contenta non dice niente e ti trova un lavoro. Se un giorno ti lascia in pace, allora comincia a preoccuparti.',
          'È una prudenza che capisco. Io con lei non misuro niente e le dormo sul grembiule nero, ma ho il vantaggio di non dover rispondere quando parla.',
        ] },
      },
    },
  },
  {
    id: 'ortica', nome: 'Ortica', detto: 'Ortica', met: { spread: 'ppf' },
    tratto: 'parla senza sosta e in mezzo alle chiacchiere dice cose giuste',
    voci: [
      { by: 'malva', t: 'Ortica parla dalla mattina alla sera e si dimentica di dare da mangiare alla gente. Però quando una donna sta male davvero, è la prima che mando a chiamare.' },
      { by: 'ginepra', t: "Ortica mi fa lezione mentre parla d'altro, e io imparo senza accorgermene. Cioè, imparo la metà, ma è la metà che poi mi serve." },
      { by: 'edera', t: 'Ortica, quando viene a trovarmi, parla per tutte e due. Io intanto riposo la voce, e quando se ne va mi accorgo che la galleria è troppo silenziosa.' },
      { by: 'tartufo', t: "Ortica dà del tu a ogni sasso del bosco e di ognuno sa i fatti. A me dà del voi, ed è l'unica cosa che ha capito al primo colpo." },
    ],
    domanda: {
      a: [
        { t: 'Mi piace che dica tutto quello che le passa per la testa.', v: 1, trait: { parola: 1 } },
        { t: 'Mi stanca e mi diverte insieme, e non so quale delle due vince.', v: 0, trait: { tono: -1 } },
        { t: 'Davanti a lei sto in guardia: quello che dico fa il giro del bosco.', v: -1, trait: { parola: -1 } },
      ],
      by: {
        malva: { own: 0, q: "Nel bosco ormai ci hai passato del tempo, quindi un'opinione ce l'hai. Dimmi di Ortica, e dimmelo corto, che il lungo lo conosco già.", re: [
          "Quello che le passa per la testa è parecchia roba. Però hai ragione: da lei una bugia non l'ho mai sentita, e in trent'anni il tempo l'avrebbe avuto.",
          "D'inverno vince la stanchezza e d'estate il divertimento. Te lo dice una che la sopporta da trent'anni e che la va ancora a trovare.",
          'Fai bene, perché a Ortica un segreto dura quanto la neve ad aprile. Le cose serie però se le tiene, e lo so perché gliene ho affidate.',
        ] },
        ginepra: { own: 1, q: 'Tu Ortica la vedi da fuori, e io ci sto insieme dalla mattina alla sera. Com\'è, per chi non le fa da novizia?', re: [
          'Ah ah, tutto e anche di più. Però ti giuro che in tutto quel parlare non ha mai detto una cosa per farmi stare male, e io ci faccio caso.',
          'Da me vince il divertimento, però di poco, e la sera ho le orecchie che fischiano. Non dirglielo, cioè, diglielo pure, che tanto lo sa.',
          'È vero, con lei le notizie corrono più di me. Ho notato però che racconta i fatti di tutti e mai le paure di nessuno, e io le mie gliele ho dette.',
        ] },
        edera: { own: 1, q: 'Parlami un poco di Ortica, se hai pazienza. Quando viene quaggiù parla lei, e io non riesco mai a farmi dire che cosa ne pensano gli altri.', re: [
          'Piace anche a me, sai. Alla mia età quasi tutti mi parlano piano e scelgono le parole, mentre lei mi tratta come una che può ancora sentire tutto.',
          'È una risposta onesta, e un poco te la invidio. Io con lei ho smesso di decidere: mi siedo, la lascio parlare, e alla fine sto meglio di prima.',
          'La prudenza quaggiù non è un difetto. Ti dico soltanto che in tanti anni non le ho mai sentito ripetere una cosa che potesse far male a qualcuno.',
        ] },
      },
    },
  },
  {
    id: 'edera', nome: 'Nonna Edera', detto: 'Edera', met: { spread: 'celtic' },
    tratto: 'scorda i nomi e ricorda tutto quello che conta',
    voci: [
      { by: 'malva', t: 'Edera è più vecchia del villaggio e più elegante di tutte noi messe insieme. Sbaglia il nome a chiunque, ma di una carta girata davanti a lei non perde niente.' },
      { by: 'ortica', t: "Edera mi lascia parlare per un'ora e poi dice una frase sola, sottovoce. Il guaio è che in quella frase di solito c'è tutto quello che cercavo di dire io." },
      { by: 'tartufo', t: 'La vecchia delle cantine ha le ginocchia calde e non liscia il pelo al contrario. Il mio nome se lo ricorda, e non so quanti cristiani possano dire lo stesso.' },
      { by: 'ginepra', when: { flag: 'ending.seen' }, t: 'Nonna Edera mi chiama Ginevra, e una volta mi ha chiamata Giuditta. Io rispondo lo stesso, perché quando poi parla delle carte non sbaglia una virgola.' },
    ],
    domanda: {
      a: [
        { t: 'Accanto a lei mi viene da parlare più piano, e mi fa bene.', v: 1, trait: { tono: 1 } },
        { t: 'Mi chiedo quanto dimentichi davvero e quanto scelga di dimenticare.', v: 0, trait: { esplora: 1 } },
        { t: "Mi mette soggezione: ho l'impressione che mi legga come una carta.", v: -1, trait: { rischio: -1 } },
      ],
      by: {
        malva: { own: 1, q: 'Adesso che conosci la strada per la nicchia di Edera, dimmi come ti ci trovi. Io la vedo da trent\'anni e non mi fido più dei miei occhi.', re: [
          'Fa quell\'effetto a tutte, me compresa, e io non parlo piano con nessuno. Tienitelo, quel modo di parlare, che in paese serve più dell\'incenso.',
          'Te lo chiedi tu, e io me lo chiedo da anni. Ho smesso di cercare la risposta quando ho visto che dimentica soltanto le cose che non servono a nessuno.',
          'Ti legge, sì, ed è inutile coprirsi. Però non ho mai saputo che abbia usato contro qualcuno quello che ha letto, e di poche persone lo direi.',
        ] },
        ortica: { own: 1, q: 'Dimmi di Edera, dai, perché io quando scendo da lei parlo così tanto che poi non ricordo che faccia aveva. Tu che impressione ne hai?', re: [
          'Più piano, pensa un po\'. Io ci provo da trent\'anni e mi viene soltanto più svelto, però hai ragione che fa bene: da lei esco sempre più leggera.',
          'È una bella domanda, e gliel\'ho fatta anch\'io, ad alta voce, in faccia. Ha sorriso e mi ha chiesto come mi chiamo, quindi non lo sapremo mai.',
          'Ti legge di sicuro, come legge me, e con me ha più pagine. Ma è una che dopo aver letto richiude il libro piano, senza fare le orecchie agli angoli.',
        ] },
        tartufo: { own: 1, q: 'Parliamo della vecchia delle cantine, che a me sta simpatica, e la cosa mi insospettisce. Tu che cosa ne pensi?', re: [
          'Fa lo stesso effetto anche a me, e io di solito non abbasso la voce per nessuno. Credo che dipenda da come sta seduta.',
          'È la domanda giusta, e non avrai risposta. Io dimentico apposta metà delle cose che vedo, e ti assicuro che si vive benissimo.',
          'Ti legge, certo, come io sento un topo dietro un muro. La differenza è che lei dopo non salta, e a te conviene farci l\'abitudine.',
        ] },
      },
    },
  },
  {
    id: 'ginepra', nome: 'Ginepra', detto: 'Ginepra', met: { flag: 'met.ginepra' },
    tratto: 'si butta prima di pensare e ride quando ha paura',
    voci: [
      { by: 'malva', t: "Ginepra sarebbe capace di tornare indietro per vedere com'è andata a finire. Le voglio bene come si vuole bene al latte sul fuoco, cioè senza perderlo d'occhio." },
      { by: 'malva', when: { flag: 'ginepra.taken' }, t: "Quella ragazza ha più coraggio che giudizio, e gliel'ho ripetuto ogni volta. Poi si è fatta avanti al posto di un'altra, e non ho più saputo cosa dirle." },
      { by: 'ortica', t: 'Ginepra guarda le figure mentre io parlo e crede che non me ne accorga. Io me ne accorgo e parlo più forte, così qualcosa le resta attaccato.' },
      { by: 'tartufo', t: 'La tua amica coi guanti blu ride quando ha paura, e ride spesso. Io ho smesso di contare le volte e ho cominciato a starle vicino, senza farmi notare.' },
    ],
    domanda: {
      a: [
        { t: 'Con lei mi butto in cose che per conto mio non farei mai.', v: 1, trait: { rischio: 1 } },
        { t: 'Le voglio bene, ma certe volte vorrei che si fermasse a pensare.', v: 0, trait: { guida: -1 } },
        { t: 'Per colpa sua ho già avuto dei guai, e me lo ricordo.', v: -1, trait: { rischio: -1 } },
      ],
      by: {
        malva: { own: 1, q: 'Ti vedo sempre in giro con quella dei guanti blu. Dimmi che cosa pensi di Ginepra, e dimmi la verità, che tanto la so.', re: [
          'Lo immaginavo, e non so se è una buona notizia. Buttatevi pure, purché una delle due guardi dove si atterra, e preferirei che fossi tu.',
          'Vorrei la stessa cosa da quando la conosco. Tu continua a volerle bene e a dirglielo, perché a me non dà retta e a te forse sì.',
          'Fai bene a ricordartelo, e fai bene a restarle vicino lo stesso. Quella lì i guai li combina sempre in buona fede, che è il modo più difficile da sgridare.',
        ] },
        ortica: { own: 1, q: 'Parliamo della mia novizia, che tanto con quei ricci, se le fischiano le orecchie, non se ne accorge. Tu Ginepra come la vedi?', re: [
          'Lo sapevo che vi sareste trovate. A me faceva lo stesso effetto una ragazza di Boston, quarant\'anni fa, e te la racconto quando hai un pomeriggio libero.',
          'Fermarsi a pensare, proprio lei. Gliel\'ho chiesto anch\'io, e mi ha risposto che pensa mentre corre; io alla sua età ero uguale, e sono ancora qui.',
          'Te ne ricordi uno, e io me ne ricordo undici. Ti dico però che non ne ha mai combinato uno per cattiveria, e per me la differenza conta.',
        ] },
        tartufo: { own: 0, q: 'Parliamo di quella coi guanti blu, che la prima sera si è presa una tua carta e ha indicato a te la strada del conestabile. Che idea te ne sei fatta?', re: [
          'Lo avevo notato, e il mio pelo anche. Buttati pure insieme a lei, ma ricordati che di noi tre soltanto io atterro sempre in piedi.',
          'Fermarsi a pensare non è nel suo repertorio. Ti consiglio di volerle bene così com\'è, che è meno faticoso e alla fine costa uguale.',
          'Finalmente in questa casa qualcuno tiene il conto insieme a me. Però l\'ho vista restituire quello che aveva preso, e a Salem non capita spesso.',
        ] },
      },
    },
  },
  {
    id: 'tartufo', nome: 'Tartufo', detto: 'Tartufo', met: { power: 'cat' },
    tratto: "ha un'opinione su tutto e alla fine resta",
    voci: [
      { by: 'malva', t: 'Tartufo non si è mai affezionato a nessuna, e di ragazze ne ha viste passare parecchie. Se ti dorme sui piedi, tienitelo caro e non farglielo notare.' },
      { by: 'ginepra', t: 'Il tuo gatto mi guarda come se sapesse cosa sto per combinare, e di solito lo sa. Mi fido più di lui che di me, e la cosa dovrebbe preoccuparmi.' },
      { by: 'edera', t: 'Quel gatto ha buone maniere, per essere uno che finge di non averne. Mi sale in grembo soltanto quando ho freddo, e non so come faccia a saperlo.' },
      { by: 'bottegaio', t: 'Il gatto nero entra qui quando gli pare e annusa tutti i barattoli. Non ha mai rotto niente, e di certi clienti non posso dire lo stesso.' },
    ],
    domanda: {
      a: [
        { t: 'Fa il superbo, ma quando serve lo trovo sempre lì.', v: 1, trait: { guida: 1 } },
        { t: "Non ho ancora capito chi dei due ha scelto l'altro.", v: 0, trait: { esplora: 1 } },
        { t: 'Ha la battuta pronta su tutto, e certe sere ne farei a meno.', v: -1, trait: { tono: -1 } },
      ],
      by: {
        malva: { own: 1, q: "Quel gatto ti segue dalla prima sera, e io non gliel'avevo mai visto fare. Dimmi come ti ci trovi, con Tartufo.", re: [
          "Allora l'hai capito, e hai fatto prima di me. Quello lì la superbia la porta come io porto il grembiule, per non sporcare quello che c'è sotto.",
          'Ha scelto lui, te lo dico io, e toglitelo dalla testa di aver deciso qualcosa. Con i gatti neri funziona così, e a ben guardare anche con i bambini.',
          'Lo capisco, e certe sere lo metterei fuori anch\'io. Poi penso alla casa senza quella voce, e gli lascio il lardo sulla madia.',
        ] },
        ginepra: { own: 1, q: "Me lo dici com'è vivere con un gatto che parla? Cioè, con Tartufo: io lo sento soltanto quando mi prende in giro.", re: [
          "Lo sapevo che sotto sotto è un tenero. Non glielo dico, perché graffia, ma l'ho visto aspettarti sulla porta con l'aria di uno che passava di lì.",
          'Ah ah, secondo me ha scelto lui, e ha scelto bene. Io un gatto così me lo sogno, e invece ho fatto amicizia soltanto con il merlo di Ortica.',
          'Ah ah, a me le sue battute piacciono, però io non ci dormo insieme. Se una sera ti stanca mandalo al bivacco, che un posto vicino al fuoco c\'è.',
        ] },
        edera: { own: 1, q: 'Raccontami del tuo gatto, quello che sta così composto e che si chiama Tartufo, vedi che questo nome me lo ricordo. Come vi trovate, voi due?', re: [
          'È quello che pensavo guardandolo. I superbi veri non restano, e lui resta: tu continua a fare finta di non averlo notato.',
          'È una bella domanda, e spero che tu non trovi mai la risposta. Le compagnie migliori che ho avuto sono quelle in cui non si è mai saputo.',
          "Ti capisco, perché anch'io ho vissuto con qualcuno che voleva sempre l'ultima parola. Quando poi è arrivato il silenzio, ho scoperto che pesava di più.",
        ] },
      },
    },
  },
  {
    id: 'giudice', nome: 'Il Giudice', detto: 'il Giudice', met: any('trial.won', 'trial.lost'),
    tratto: 'fa paura con le buone maniere ed è convinto di fare il bene',
    voci: [
      { by: 'edera', t: 'Il Giudice da bambino mangiava le candele della chiesa e poi chiedeva scusa al sagrestano. Quando lo guardo vedo ancora quel bambino, e forse per questo non mi fa paura.' },
      { by: 'malva', t: 'Quel signore fa paura a mezzo villaggio e a me no, perché ho fatto nascere i suoi nipoti. Li tiene sulle ginocchia con le stesse mani con cui firma.' },
      { by: 'tartufo', t: 'Quel signore è il solo, a Salem, che mi abbia fatto rizzare anche il pelo che non sapevo di avere. Con i conestabili so cosa aspettarmi, e con lui no.' },
      { by: 'ginepra', t: 'Il Giudice in cella mi ha chiesto se avevo freddo, con la stessa voce con cui in aula faceva le domande. Non ho capito quale delle due volte era sincero.' },
    ],
    domanda: {
      a: [
        { t: 'Credo che sia convinto di fare il bene, e un poco mi fa pena.', v: 1, trait: { tono: 1 } },
        { t: 'Non riesco a detestarlo, e la cosa mi inquieta.', v: 0, trait: { parola: 1 } },
        { t: 'Mi fa più paura la sua gentilezza di qualunque lanterna.', v: -1, trait: { rischio: -1 } },
      ],
      by: {
        edera: { own: 0, q: "Adesso che ce l'hai avuto davanti anche tu, dimmi che cosa hai visto. Parlo del Giudice, quel bambino delle candele.", re: [
          'Fa pena anche a me, da molti anni. È cresciuto senza che nessuno gli dicesse mai di no, e io quando ho cominciato a dirglielo sono arrivata tardi.',
          'È la risposta più vera che potevi darmi. Io ho smesso di inquietarmi quando ho capito che si può non detestare una persona e fermarla lo stesso.',
          "Fai bene ad averne paura, perché è la parte di lui che funziona meglio. Io gliel'ho vista provare da piccolo, davanti al sagrestano.",
        ] },
        ginepra: { own: -1, q: 'Te lo chiedo adesso che è finita, perché prima mi veniva soltanto da ridere: tu del Giudice che cosa pensi, davvero?', re: [
          'Pena per lui, pensa, e io invece ho dato il suo nome a un topo e mi sembrava già un regalo. Hai più cuore di me, e non me ne stupisco.',
          'Inquieta anche me, ed è per quello che ridevo. Con uno che grida sai cosa fare, mentre con uno che ti chiede se hai freddo non lo sai più.',
          'Allora non sono matta io. Di lanterne ne ho viste parecchie, ah ah, e nessuna mi ha mai sorriso prima di chiudermi dentro.',
        ] },
        tartufo: { own: -1, q: 'Adesso che ne siamo usciti te lo posso chiedere senza che mi tremi la coda. Di quel signore del tribunale, tu che cosa pensi?', re: [
          'Hai più pazienza di me, che in questa casa è una qualità rara. Io la pena la tengo da parte per i topi, e nemmeno per tutti.',
          'Inquietati pure, che è la reazione sana. Nemmeno io sono riuscito a detestarlo, e ho avuto il pelo dritto per tre giorni.',
          'Su questo siamo d\'accordo, e non capita spesso. Una lanterna la vedi arrivare da lontano, mentre la sua voce ce l\'avevi già alle spalle.',
        ] },
      },
    },
  },
  {
    id: 'conestabile', nome: 'Il conestabile della piazza', detto: 'il conestabile della piazza', met: { flag: 'exam1.done' },
    tratto: 'fa domande a chi cammina di notte e conosce tutte le facce',
    voci: [
      { by: 'malva', t: "Il conestabile della piazza l'ho fatto nascere io, ed è venuto fuori con la faccia di chi sospetta. Sua madre diceva che a quattro anni contava le uova nel pollaio." },
      { by: 'ginepra', t: 'Il conestabile della piazza a me mi conosce già, e mi saluta per nome prima di fermarmi. Non so se è meglio o peggio, però almeno non devo presentarmi.' },
      { by: 'tartufo', t: "Quello della lanterna fa il giro della piazza alla stessa ora da vent'anni. È un uomo d'abitudini, e gli uomini d'abitudini si evitano con poco." },
      { by: 'bottegaio', t: 'Il conestabile della piazza viene a comprare il tabacco e intanto guarda gli scaffali. Io lo servo per primo, così resta poco, e finora ha funzionato.' },
    ],
    domanda: {
      a: [
        { t: 'Credo che sotto quella lanterna abbia più paura lui di noi.', v: 1, trait: { guida: 1 } },
        { t: 'Non ce l\'ho con lui, però cambio strada volentieri.', v: 0, trait: { rischio: -1 } },
        { t: 'Mi dà fastidio che decida lui chi è una ragazza perbene.', v: -1, trait: { parola: 1 } },
      ],
      by: {
        malva: { own: 0, q: 'Quello della piazza ha fatto le sue domande anche a te, come a tutte. Dimmi che cosa pensi di lui, che io sono di parte perché l\'ho fatto nascere.', re: [
          'Ha paura, sì, e l\'ha sempre avuta. Da piccolo non dormiva senza il lume, e adesso se lo porta in giro appeso a un bastone.',
          'È la cosa più sensata. Non ce l\'ho con lui nemmeno io, però quando passa sotto la mia finestra abbasso la candela.',
          "Dà fastidio anche a me, e gliel'ho detto in faccia più di una volta. Mi ascolta, abbassa gli occhi, e la sera dopo ricomincia.",
        ] },
        ginepra: { own: -1, q: 'Senti, ma a te il conestabile della piazza che cosa sembra? Io lo conosco troppo, cioè, è lui che conosce troppo me.', re: [
          'Paura, proprio lui? Ah ah, non ci avevo mai pensato, e la prossima volta che mi ferma lo guardo bene. Se trema glielo dico, anzi no, non glielo dico.',
          'Cambio strada anch\'io, soltanto che scelgo sempre quella dove sta andando lui. Devi insegnarmi come si fa, e lo dico sul serio.',
          'Ecco, è proprio quello che non riuscivo a dire. Per lui una ragazza perbene è una che risponde subito, e io subito so soltanto ridere.',
        ] },
        tartufo: { own: -1, q: 'Parliamo di quello con la lanterna, che mi rovina il pelo da tre inverni. Che opinione ne hai, dopo averlo avuto a due passi?', re: [
          'È un\'idea generosa, e temo che sia anche giusta. Un uomo tranquillo non ha bisogno di fare domande a chi torna a casa.',
          'È la politica di questa casa, e l\'ho inventata io. Si cambia strada, si arriva lo stesso, e il pelo resta in ordine.',
          'Dà fastidio anche a me, e io non sono nemmeno una ragazza. Lui decide, e intanto qui dentro si imparano le figure meglio di sua figlia.',
        ] },
      },
    },
  },
  {
    id: 'bottegaio', nome: 'Il bottegaio', detto: 'il bottegaio', met: { flag: 'side.m01' },
    tratto: 'sa i fatti di tutti e non fa credito a nessuno',
    voci: [
      { by: 'malva', t: "Il bottegaio, quando vuole fare il furbo, mescola la segatura all'incenso. Però di notte apre a chi bussa per bisogno, e questo glielo devo riconoscere." },
      { by: 'tartufo', t: 'Quello della porta nera vende cose che non dovrebbero esistere a gente che giura di non comprarle. A pensarci bene, è il commercio più onesto di Salem.' },
      { by: 'ortica', t: 'Il bottegaio della porta nera dice che a forza di chiacchiere gli faccio scappare i clienti. Ha ragione, e io mi offendo lo stesso ogni volta.' },
    ],
    domanda: {
      a: [
        { t: "Mi piace che non faccia finta di essere migliore di com'è.", v: 1, trait: { parola: 1 } },
        { t: 'Compro da lui, ma prima annuso sempre il sacchetto.', v: 0, trait: { guida: -1 } },
        { t: 'Non mi fido di chi sa i fatti di tutti e tace i suoi.', v: -1, trait: { parola: -1 } },
      ],
      by: {
        malva: { own: 0, q: 'Da quello della porta nera ormai ci vai per conto tuo. Dimmi che cosa pensi del bottegaio, che voglio vedere se hai occhio.', re: [
          'Vedo che hai occhio, perché è un furbo dichiarato. Con i furbi dichiarati si fanno affari migliori che con i santi, e io lo so da vent\'anni.',
          "È quello che faccio io da quando lo conosco, e non me ne sono mai pentita. Lui lo sa, e con me la segatura non ci prova più.",
          'I suoi fatti li tace perché sono pochi: una bottega, una porta nera e nessuno che lo aspetti la sera. Io di lui diffido il giusto, e non di più.',
        ] },
        tartufo: { own: 1, q: 'Dimmi del bottegaio, quello che vende i miei manicaretti a un prezzo che trovo offensivo per tutti e due. Tu come lo vedi?', re: [
          'È anche la mia opinione. A Salem fingono tutti di essere migliori, e lui ha scelto di fingere soltanto sul peso.',
          "È l'abitudine giusta, e mi piace pensare che tu l'abbia presa da me. Io annuso tutto da sempre, e la segatura non l'ho mai pagata.",
          'È un sospetto ragionevole. Tieni conto però che lo stesso si potrebbe dire di me, e io ti dormo sui piedi da mesi.',
        ] },
      },
    },
  },
  {
    id: 'tabita', nome: 'Tabita, la lavandaia', detto: 'Tabita', met: { flag: 'side.m05' },
    tratto: 'lavora senza lamentarsi e paga ogni debito',
    voci: [
      { by: 'malva', t: 'A Tabita ho fatto nascere sei figli senza vedere una moneta. In compenso il mio bucato lo fa lei da vent\'anni, e nessuna delle due ha mai fatto il conto.' },
      { by: 'tartufo', t: 'La lavandaia rompe il ghiaccio nel secchio con il manico della spazzola, tutte le mattine. Con sette bocche in casa ride ancora, e non ho mai capito di che cosa.' },
      { by: 'bottegaio', t: 'Tabita mi paga la lisciva in camicie stirate, e camicie così non le avevo mai avute. È il solo baratto che accetto, e non lo scrivo sul registro.' },
    ],
    domanda: {
      a: [
        { t: 'Mi piace che paghi sempre i suoi debiti, anche quelli piccoli.', v: 1, trait: { guida: -1 } },
        { t: 'Mi fa un poco paura quanto lavora senza lamentarsi.', v: 0, trait: { guida: 1 } },
        { t: 'Vede tutto, perfino i nodi, e con lei faccio attenzione.', v: -1, trait: { parola: -1 } },
      ],
      by: {
        malva: { own: 1, q: "Tabita, dopo una volta sola, un'opinione su di te ce l'ha già. Adesso voglio sentire la tua su di lei.", re: [
          'Li paga tutti, e li paga in lenzuola, che durano più delle monete. Tra me e lei non si è mai detto grazie, ed è per questo che va avanti.',
          'Fa paura anche a me, e non lo dico di molte. Il giorno che la vedi ferma vuol dire che è successo qualcosa di grosso: allora vieni a chiamarmi.',
          "Fai bene, perché a lei non scappa niente. Però quello che vede lo tiene nel secchio insieme ai panni, e non l'ho mai sentita riportare un fatto altrui.",
        ] },
        tartufo: { own: 1, q: 'Parliamo della lavandaia, quella che mi tira l\'acqua del secchio quando passo troppo vicino ai panni stesi. A te come sembra?', re: [
          'È una virtù che rispetto, da lontano. Io i debiti non li pago e non li faccio, che è un altro modo di avere i conti in ordine.',
          'Impressiona anche me, che in fatto di non lavorare ho una certa esperienza. Si vede che in questo villaggio qualcuno deve compensare.',
          'Fai bene a non abbassare la guardia. Una che riconosce un nodo rifatto riconosce anche un gatto che ha dormito sul bucato, e lo dico per esperienza.',
        ] },
      },
    },
  },
  {
    id: 'hale', nome: 'Comare Hale', detto: 'Comare Hale', met: any('b1.spoke', 'b1.hid'),
    tratto: 'ha sempre venduto candele e non ha mai fatto male a nessuno',
    voci: [
      { by: 'ortica', t: 'La Hale vendeva candele già quando io portavo le trecce, e non ha mai alzato la voce con nessuno. Lo dico da mesi che con gli spilli non c\'entra.' },
      { by: 'malva', when: { flag: 'b1.spoke' }, t: 'Hale è passata a lasciarmi una candela e non ha voluto niente in cambio. Ha ancora le mani che tremano, però il banco lo ha rimesso dov\'era.' },
      { by: 'malva', when: { flag: 'b1.hid' }, t: 'Sotto il portico il banco di Hale è ancora vuoto. È una donna che dà il resto giusto anche ai bambini, e in paese lo sanno tutti.' },
      { by: 'bottegaio', when: { flag: 'b1.spoke' }, t: 'La candelaia compra da me lo stoppino, e conta le monete due volte perché non manchi niente a me. Di clienti così ne ho pochi.' },
    ],
    domanda: {
      a: [
        { t: 'Penso spesso alle sue candele nella neve, e vorrei saperla tranquilla.', v: 1, trait: { guida: 1 } },
        { t: 'Non la conosco davvero: conosco soltanto quello che le hanno fatto.', v: 0, trait: { guida: -1 } },
        { t: 'Quando penso a lei mi viene paura per me, e me ne vergogno.', v: -1, trait: { parola: 1 } },
      ],
      by: {
        ortica: { own: 1, q: 'Tu la Hale l\'hai vista quella sera in piazza, con i tuoi occhi, e io invece no. Dimmi che cosa ti è rimasto di lei.', re: [
          'Ci penso anch\'io, sai, e quando ci penso sto zitta, che per me è tutto dire. Di chi pensa alle candele degli altri io mi fido subito.',
          'È una distinzione che in paese non fa nessuno. Io la conosco da una vita, e ti assicuro che quello che le hanno fatto non le somiglia per niente.',
          'Non vergognartene, perché quella sera la stessa paura l\'ha avuta tutta la piazza. Tu almeno la dici ad alta voce, e una paura detta fa meno strada.',
        ] },
        malva: { own: 1, q: 'Dopo quella sera in piazza non te l\'ho più chiesto, e adesso te lo chiedo. Di Comare Hale, tu che cosa pensi?', re: [
          'Ci penso anch\'io, più di quanto dico. Quando passi sotto il portico guarda dalla parte del suo banco, che certe cose si fanno anche soltanto con gli occhi.',
          'È giusto, e mi piace che tu non faccia finta di conoscerla. Se ti serve saperne una cosa in più, è una che la mattina saluta sempre per prima.',
          'Non c\'è niente di cui vergognarsi. Io ho avuto la stessa paura a ogni parto andato storto, e sono andata avanti lo stesso, con le mani che tremavano.',
        ] },
      },
    },
  },
  {
    id: 'mugnaio', nome: 'Il mugnaio', detto: 'il mugnaio', met: { flag: 'side.m12' },
    tratto: 'parla con la sua ruota e giura che gira al contrario',
    voci: [
      { by: 'ortica', t: 'Il mugnaio giura che la ruota gira al contrario, e sua moglie che è lui a bere. Li ho ascoltati per un pomeriggio, e voglio bene a tutti e due.' },
      { by: 'ginepra', t: 'Il mugnaio da ragazzo si appendeva al salice per i piedi, a guardare il mondo capovolto. Lo racconta a chiunque passi, e a me da allora sta simpatico.' },
      { by: 'tartufo', t: 'Quello del mulino guarda la ruota come un figlio che ha preso una brutta strada. È il solo, a Salem, che vedo discutere con qualcosa di più testardo di me.' },
    ],
    domanda: {
      a: [
        { t: 'Io gli credo: quella ruota gira al contrario davvero.', v: 1, trait: { guida: 1 } },
        { t: 'Mi fa tenerezza, ma dalla sua fiaschetta non berrei.', v: 0, trait: { rischio: -1 } },
        { t: 'Secondo me ha ragione sua moglie, e lui lo sa.', v: -1, trait: { guida: -1 } },
      ],
      by: {
        ortica: { own: 1, q: 'Adesso che al mulino ci hai messo piede anche tu, devi dirmi da che parte stai. Del mugnaio che cosa pensi?', re: [
          'Lo vedi che non lo dico soltanto io? Quel mulino è fatto con le pietre di una chiesa, e una cosa così secondo me ha il diritto di girare come vuole.',
          'Dalla fiaschetta non bevo nemmeno io, e io assaggio tutto. La tenerezza però te la passo, perché ha le ginocchia peggio delle mie e non salta un giorno.',
          'Lo sa di sicuro, e sua moglie sa che lui lo sa. Sono sposati da una vita e si reggono in piedi così, a darsi torto con affetto.',
        ] },
        ginepra: { own: 1, q: 'Tu al mugnaio ci credi? Te lo chiedo perché io, da quando ho sentito della ruota, non penso ad altro, cioè, quasi.', re: [
          'Lo sapevo, cioè, lo speravo, che per me è uguale. Una ruota che gira al contrario è la cosa più bella di tutto il bosco, e guai a chi me la tocca.',
          'Ah ah, la fiaschetta no, hai ragione, sa di unguento. Però uno che parla con una ruota non può essere cattivo, e io su queste cose non sbaglio quasi mai.',
          'Ah ah, può darsi, e se è così non dirglielo. Con la ruota storta ha una storia da raccontare, e senza gli resta soltanto la fiaschetta.',
        ] },
      },
    },
  },
];

// who may ask or speak, and how the Reader names them («l'avevi detto a Malva»)
export const ASKERS = { malva: 'Malva', ortica: 'Ortica', edera: 'Edera', ginepra: 'Ginepra', tartufo: 'Tartufo', bottegaio: 'il bottegaio' };
// when «chi ti dà più fastidio?» has no answers of hers to go by, the people offered first
export const LEAST_FIRST = ['giudice', 'conestabile', 'bottegaio', 'ortica', 'malva', 'ginepra', 'tartufo', 'mugnaio', 'edera', 'tabita', 'hale'];

// ---- the Reader: one question of her own at most per visit (and per day)
// pick: «Direi {detto}.» is her answer; the mirror joins the person's `tratto` with what she chose:
//   none (she never told anyone what she thinks of them), same (it agrees with what she told {by}), changed
// events: things that really happen in the scripts; `when` on flags the scenes set. Each answer: t, v, trait, re
// (the Reader's mirror: one or two lines, what the answer shows of her; never a diagnosis, never a rule).
export const READER = {
  lead: 'Prima di salutarti ti faccio una domanda che con queste carte non ha a che fare.',
  dream: "Appena chiudi gli occhi, dietro le palpebre c'è la luce di una candela che conosci.",
  hello: 'Non ti trattengo, stanotte: ho una domanda sola, e poi ti lascio dormire.',
  bye: 'Adesso dormi pure, che la candela la spengo io.',
  answer: 'Direi {detto}.',
  pick: {
    favourite: {
      q: "Dimmi una cosa che con le carte c'entra poco, o forse c'entra. Tra le persone che hai incontrato fin qui, chi ti piace di più?",
      mirror: {
        none: 'Hai scelto {detto}, che {tratto}. Di solito negli altri ci piace quello che vorremmo saper fare anche noi, e quindi me lo segno accanto al tuo nome.',
        same: "Hai scelto {detto}, che {tratto}, e l'avevi già fatto capire a {by}. Me lo segno, perché in chi ammiriamo c'è spesso una strada che vorremmo fare anche noi.",
        changed: 'Hai scelto {detto}, che {tratto}, eppure a {by} ne avevi parlato con più riserbo. Mi piacerebbe sapere se nel frattempo è cambiata quella persona o il tuo modo di guardarla.',
      },
    },
    least: {
      q: "Stasera ti faccio una domanda meno comoda del solito, e puoi rispondere senza riguardi. Tra le persone che hai incontrato, chi ti dà più fastidio?",
      mirror: {
        none: 'Mi dici {detto}, che {tratto}. Quello che ci urta in una persona è spesso una cosa che a noi non concediamo, e non lo dico per farti cambiare idea.',
        same: 'Mi dici {detto}, che {tratto}, e lo avevi lasciato intendere anche a {by}. Mi chiedo soltanto che cosa, in chi è fatto così, ti tocchi tanto da vicino.',
        changed: 'Mi dici {detto}, che {tratto}, e a {by} ne avevi parlato in un altro modo. Le due cose possono stare insieme, perché si può tenere a qualcuno e trovarlo faticoso.',
      },
    },
  },
  events: [
    { id: 'stopped', when: { flag: 'exam1.done' },
      q: 'Ho ripensato alla prima sera in piazza, quando il conestabile ti ha chiesto conto di te con la lanterna in mano. Che cosa ti è rimasto addosso, di quel momento?',
      a: [
        { t: 'La rabbia di dover dimostrare qualcosa a uno sconosciuto.', v: -1, trait: { tono: -1 },
          re: 'Quindi quello che ti pesa è rendere conto a chi non ne ha il diritto. Me lo segno, perché chi sente così di solito non chiede il permesso nemmeno per le cose buone.' },
        { t: 'La sorpresa di scoprire che le carte le sapevo davvero.', v: 1, trait: { rischio: 1 },
          re: 'Allora quella lanterna ti ha fatto un favore senza volerlo, perché ti ha mostrato una cosa tua. Mi piace che tu l\'abbia notata proprio in mezzo alla paura.' },
        { t: 'Il pensiero di quante altre ragazze lui ferma ogni notte.', v: 0, trait: { guida: 1 },
          re: 'Avevi una lanterna in faccia e pensavi alle altre. Lo scrivo accanto al tuo nome, perché non tutti guardano oltre la propria paura mentre ce l\'hanno addosso.' },
      ] },
    { id: 'square', when: any('b1.spoke', 'b1.hid'),
      q: 'La sera in cui in piazza hanno indicato la donna delle candele c\'era molta gente, e ognuno ha fatto la sua parte. Ripensandoci adesso, che cosa ti pesa di più?',
      a: [
        { t: 'Quanto in fretta una piazza intera ha creduto a un dito puntato.', v: -1, trait: { guida: -1 },
          re: 'A te resta in mente la piazza, più della donna e più di te. Chi guarda come si muove la gente tutta insieme di solito ha deciso di non muoversi così, e mi interessa.' },
        { t: 'Quello che ho fatto io, e mi chiedo ancora se bastava.', v: 0, trait: { guida: 1 },
          re: 'Te lo chiedi ancora, e non ti rispondo io, perché in piazza non c\'ero. Ti dico soltanto che chi continua a farsi quella domanda, la volta dopo, arriva con qualcosa in più.' },
        { t: 'Niente mi pesa: ho fatto quello che quella sera potevo fare.', v: 1, trait: { parola: 1 },
          re: 'Lo dici senza esitare, e ti credo. Non è da tutti chiudere una sera così e dormirci sopra: me lo segno, e vedremo se le prossime ti lasceranno la stessa pace.' },
      ] },
    { id: 'glass', when: { flag: 'ginepra.returned' },
      q: "Dietro la canonica la tua amica ha girato una carta che le diceva di lasciar stare, e l'uovo lo ha rotto lo stesso. Tu che cosa hai pensato, guardandola?",
      a: [
        { t: 'Che una carta dà un consiglio, e un consiglio si può non seguire.', v: 1, trait: { rischio: 1 },
          re: 'Per te la carta consiglia e non comanda. Molte ci arrivano dopo anni; a me interessa vedere che cosa farai il giorno in cui il consiglio non ti piacerà.' },
        { t: 'Che se chiedi e poi non ascolti, tanto vale non chiedere.', v: -1, trait: { guida: -1 },
          re: 'Vuoi che una domanda abbia delle conseguenze, e non hai torto. Hai poca pazienza con chi chiede per finta, e mi domando se ne hai di più quando a chiedere sei tu.' },
        { t: "Che aveva paura, e che l'uovo le serviva per non pensarci.", v: 0, trait: { guida: 1 },
          re: 'Hai guardato lei, e la carta è passata in secondo piano. È il modo di guardare di chi legge le persone prima delle figure, e a questo tavolo serve.' },
      ] },
    { id: 'depot', when: any('b2.went', 'b2.stayed'),
      q: 'La notte del deposito la tua amica è entrata a riprendersi il mazzo di sua nonna, e tu hai deciso da che parte stare. Per un mazzo di carte ne valeva la pena?',
      a: [
        { t: 'Sì: certe cose valgono più del rischio che costano.', v: 1, trait: { rischio: 1 },
          re: 'Quindi per te ci sono cose che non si pesano. Mi piacerebbe sapere quali sono le tue, perché chi risponde così di solito ne ha una in tasca.' },
        { t: 'No, e glielo direi ancora, anche se le voglio bene.', v: -1, trait: { parola: 1 },
          re: 'Sai voler bene a una persona e darle torto nella stessa frase. È meno comune di quanto credi, e a un\'amicizia fa più bene dell\'andare sempre d\'accordo.' },
        { t: 'Per il mazzo no. Per non lasciarla andare senza di me, forse sì.', v: 0, trait: { guida: 1 },
          re: 'Hai separato la cosa dalla persona, e hai scelto la persona. Me lo segno così com\'è, senza aggiungere niente di mio.' },
      ] },
    { id: 'sonoio', when: { flag: 'ginepra.taken' },
      q: 'Davanti alla tua porta una ragazza ha detto ai conestabili di essere lei quella che cercavano, perché non prendessero te. Che cosa si prova, quando qualcuno si fa avanti al posto tuo?',
      a: [
        { t: 'Gratitudine, e un debito che non so come pagare.', v: 1, trait: { guida: 1 },
          re: 'Lo chiami debito, e si capisce che i conti con chi ti vuole bene li tieni con cura. Io credo che lei non lo consideri tale, ma questo dovrai sentirlo dalla sua voce.' },
        { t: 'Rabbia, perché non le avevo chiesto di farlo.', v: -1, trait: { tono: -1 },
          re: 'Ti ha tolto la possibilità di scegliere, ed è questo che brucia. Chi si arrabbia così tiene alla propria parola più che alla propria pelle, e me lo segno.' },
        { t: "Mi domando ancora se io al suo posto l'avrei fatto.", v: 0, trait: { guida: -1 },
          re: 'È una domanda che pochi si fanno, perché la risposta può non piacere. Tu te la fai lo stesso, e per stasera a me basta questo.' },
      ] },
    { id: 'council', when: any('b3.stealth', 'b3.open'),
      q: "Sotto il villaggio tre maestre hanno smesso di discutere e hanno aspettato una parola tua. Com'è stato, decidere per tutte?",
      a: [
        { t: 'Mi è piaciuto più di quanto vorrei ammettere.', v: 1, trait: { rischio: 1 },
          re: 'Ti piace decidere, e ti piace poco dirlo. Io lo scrivo senza giudicarlo, perché a Salem servono persone a cui decidere non pesa, purché si ricordino di chi aspetta.' },
        { t: 'Mi tremavano le gambe, ma qualcuno doveva pur decidere.', v: 0, trait: { guida: -1 },
          re: 'Avevi paura e hai deciso lo stesso, perché andava fatto. È il modo di decidere di cui mi fido di più, e lo dico di rado.' },
        { t: 'Avrei preferito che decidessero loro, che ne sanno di più.', v: -1, trait: { rischio: -1 },
          re: 'Sai quanto vale quello che sanno gli altri, e non hai fretta di metterti davanti. Loro però hanno aspettato te, e mi chiedo che cosa abbiano visto che tu ancora non vedi.' },
      ] },
    { id: 'trial', when: any('trial.won', 'trial.lost'),
      q: "Il Giudice ti ha fatto le sue domande con molta gentilezza, davanti a tutti. Di quell'aula, che cosa ti porti dietro?",
      a: [
        { t: 'La sua voce: non pensavo che la gentilezza potesse fare paura.', v: -1, trait: { rischio: -1 },
          re: 'Hai imparato che una voce gentile può non volerti bene. È una cosa che costa, e mi dispiace che te l\'abbia insegnata lui; spero che non ti faccia diffidare delle altre.' },
        { t: 'Le facce in fondo all\'aula, quelle che erano lì per me.', v: 1, trait: { guida: 1 },
          re: 'Di un\'aula piena ricordi chi stava dalla tua parte. Vuol dire che anche nei momenti stretti conti le persone prima dei pericoli, e me lo segno volentieri.' },
        { t: 'Le domande: adesso so che cosa so, e che cosa no.', v: 0, trait: { guida: -1 },
          re: 'Da un processo hai ricavato un inventario di quello che sai. È il modo di fare di chi impara anche nei posti peggiori, e non me ne stupisco.' },
      ] },
    { id: 'cell', when: { stat: ['jailed', '>=', 1] },
      q: 'So che hai passato almeno una notte nelle celle del tribunale, con il pane duro e la porta chiusa da fuori. A che cosa pensavi, là dentro?',
      a: [
        { t: 'A come rispondere meglio, la volta dopo.', v: 1, trait: { guida: -1 },
          re: 'Quindi in cella ripassavi, mentre altre contano le ore. Comincio a capire perché dai posti peggiori torni sempre con qualcosa in più.' },
        { t: 'A chi mi aspettava fuori, e a quanto si preoccupava.', v: 0, trait: { guida: 1 },
          re: 'Avevi la porta chiusa e pensavi a chi stava fuori. Me lo segno, perché dice dove va il tuo pensiero quando non hai altro da fare che pensare.' },
        { t: 'A quanto poco basta, qui, per finire dietro una porta.', v: -1, trait: { rischio: -1 },
          re: 'Là dentro hai misurato quanto è sottile il muro tra una sera qualunque e una cella. Chi lo ha visto cammina in un altro modo, e spero che non diventi soltanto paura.' },
      ] },
  ],
};

// ---- Malva at home after chapter 1 (her everyday chat exists only in chapter 1): a short welcome, so that a
// player who is further on can still stop by her hearth and hear her. glue/opinions.js puts her there.
export const OPINION_SCRIPTS = {
  'malva.later': [
    { if: { flag: 'ending.seen' },
      then: [{ say: 'malva', t: 'Guarda chi si rivede. Il pane è nella madia e la sedia è quella di sempre, e io faccio finta di non aver guardato la strada tutta la mattina.' }],
      else: [{ if: { flag: 'ginepra.taken' },
        then: [{ say: 'malva', t: 'Lo so a che cosa pensi, perché ci penso anch\'io. Siediti un momento e mangia qualcosa, che a stomaco vuoto i pensieri vengono peggio.' }],
        else: [{ say: 'malva', t: 'Sei di nuovo qui, e a giudicare dalle scarpe arrivi dal bosco. Scaldati le mani, che il fuoco è acceso e non mi costa niente di più.' }] }] },
  ],
};
