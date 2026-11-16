// The five sessions with the Reader (shadow theatre: a candle, cut paper, smoke, the real cards).
// s0 who you are (her first hypothesis), s1 values, s2 fears, s3 dreams, s4 she hands the deck over.
// s1-s3 have the same bones: back at the table, one true fact (observe), a tree of two-answer
// questions two levels deep with a follow-up on each leaf, an earlier answer set against a fork of
// the story, a tool of her trade (the quality of the sign, the moon), "dimmi un numero" with a short
// reading of the card, and the provisional verdict: confirmed or corrected, and recorded.
// Every answer moves a trait; every leaf leaves a word, a point and the flag leaf.<kind>.<card>
// (read by the final reading). The whole path, encounter by encounter: notes/reader.md.
import { reader as R, N, choice, IF, flag, step, travel, give, point } from './h.js';
import { VERDICTS, LIKE } from '../portrait.js';

// one answer: O('Busso alla porta.', { esplora: -1 }, [nodes], { flag: 's0.knock' })
const O = (t, trait, then = [], extra = {}) => ({ t, trait, then, ...extra });
const leaf = (kind, word, card, suit) => [point(card, suit), { do: 'word', k: kind, v: word }, flag(`leaf.${kind}.${card}`)];
const F = (k) => ({ flag: k });
const hi = (axis, n = 3) => ({ trait: [axis, '>=', n] });
const lo = (axis, n = -3) => ({ trait: [axis, '<=', n] });
const say = (when, t) => ({ when, t });

// ---- "dimmi un numero": what she says of the card that comes out -----------------------------
export const PICKED = {
  m00: "È Il Matto, il ragazzo sull'orlo della rupe. Ti dice che in questa faccenda c'è un passo da fare prima di avere tutte le risposte, e che puoi farlo con leggerezza.",
  m01: "È Il Mago, con tutti i suoi attrezzi sul tavolo. Ti dice che quello che ti serve ce l'hai già, e che è il momento di smettere di prepararti e cominciare.",
  m02: "È La Sacerdotessa, seduta in silenzio davanti al suo velo. Ti dice che la risposta la sai già, e che la senti meglio se per un po' non la spieghi a nessuno.",
  m03: "È L'Imperatrice, comoda in mezzo al suo grano. Ti dice di avere cura di quello che sta crescendo, e di concederti anche il piacere di guardarlo crescere.",
  m04: "È L'Imperatore, sul suo trono di pietra. Ti dice che qui serve un po' d'ordine: una regola chiara, decisa da te, a cui poi restare fedele.",
  m05: "È Il Papa, con la mano alzata. Ti dice che non devi inventare tutto da sola, perché questa strada qualcuno l'ha già fatta e vale la pena ascoltarlo.",
  m06: "Sono Gli Amanti, sotto il loro angelo. Ti dicono che c'è una scelta da fare, e che va fatta guardando a quello in cui credi più che a quello che conviene.",
  m07: "È Il Carro, con le sue due sfingi. Ti dice di scegliere una direzione e di tenerla, anche se una parte di te tira da un'altra parte.",
  m08: "È La Forza, la donna che accarezza il leone. Ti dice che qui si vince con la pazienza, e che la tua parte più selvatica va ascoltata prima che domata.",
  m09: "È L'Eremita, con la sua lanterna. Ti dice di prenderti un po' di silenzio, e di accontentarti di vedere il prossimo passo senza pretendere tutta la strada.",
  m10: "È La Ruota della Fortuna, che non sta mai ferma. Ti dice che qualcosa sta cambiando giro senza chiederti il permesso, e che c'è un'occasione da prendere mentre passa.",
  m11: "È La Giustizia, con la bilancia e la spada. Ti dice di guardare con onestà quanto pesa quello che hai fatto, e di decidere di conseguenza, anche se non è comodo.",
  m12: "È L'Appeso, sereno a testa in giù. Ti dice che questa cosa non si può forzare: fermati, e prova a guardarla dal lato da cui non l'hai mai guardata.",
  m13: "È La Morte, e non spaventarti del nome. Ti dice soltanto che qualcosa è già finito, e che lasciarlo andare ti costerà meno che trattenerlo.",
  m14: "È La Temperanza, l'angelo con le due coppe. Ti dice di andare piano e di dosare: un po' dell'una e un po' dell'altra cosa, finché non stanno bene insieme.",
  m15: "È Il Diavolo, con le sue catene larghe. Ti dice di guardare che cosa ti tiene legata per abitudine, perché è molto probabile che tu possa sfilartelo quando vuoi.",
  m16: "È La Torre, e non lasciarti impressionare dal disegno. Ti dice che qualcosa di costruito male sta per cedere, e che dopo, tolte le macerie, vedrai più chiaro.",
  m17: "È La Stella, sotto il suo cielo pulito. Ti dice che il peggio è alle spalle, e che puoi ricominciare a sperare senza sentirti ingenua.",
  m18: "È La Luna, la carta della notte. Ti dice di andare avanti piano, perché adesso le cose sembrano più grandi e più scure di quello che sono.",
  m19: "È Il Sole, col bambino a cavallo. Ti dice che qui non c'è niente di nascosto: puoi essere contenta, e puoi anche farlo vedere.",
  m20: "È Il Giudizio, con la tromba dell'angelo. Ti dice che c'è una chiamata a cui stai rimandando la risposta, e che è arrivato il momento di darla.",
  m21: "È Il Mondo, la figura che danza. Ti dice che un giro si sta chiudendo bene, e che puoi fermarti un momento a guardare quanta strada hai fatto.",
};
const pick = (...then) => ({ pick: 'number', read: PICKED, then });

// ---- the provisional verdict ---------------------------------------------------------------------
const AXES = Object.keys(VERDICTS.lead);
const marked = (axis, pole, n) => ({ trait: [axis, pole === 'plus' ? '>=' : '<=', pole === 'plus' ? n : -n] });
// what she has seen most: the strongest marked trait first, then the three words and her card
const lead = (intro) => ({ observe: [
  ...[6, 5, 4, 3].flatMap((n) => AXES.flatMap((axis) => ['plus', 'minus'].map((pole) => say(marked(axis, pole, n),
    `${intro} ${VERDICTS.lead[axis][pole]}. Sei {traits}, e per me stanotte sei {yourCard}.`)))),
  say(true, VERDICTS.none),
] });
// why she changed her mind: what moved since the last encounter
const why = { observe: [
  ...AXES.flatMap((axis) => [
    say({ trend: [axis, '>=', 2] }, `Il perché è presto detto: ${VERDICTS.shift[axis].plus}.`),
    say({ trend: [axis, '<=', -2] }, `Il perché è presto detto: ${VERDICTS.shift[axis].minus}.`),
  ]),
  say(true, "Il perché non è una cosa sola: sono tante piccole cose che ho visto da allora, messe insieme."),
] };
const like = { observe: Object.entries(LIKE).map(([id, t]) => say({ yourCard: id }, t)) };
const verdict = (intro, later) => [
  IF({ verdict: 'changed' },
    [R("L'ultima volta ti avevo detto che eri {lastVerdict}. Ho cambiato idea, e non mi dispiace ammetterlo."), why],
    [R("L'ultima volta ti avevo detto che eri {lastVerdict}. Ti ho ascoltata con attenzione anche stasera, e lo penso ancora.")]),
  lead(intro),
  like,
  { do: 'verdict' },
  IF({ yourCardIsBirth: true },
    [R(`È anche la carta del tuo segno: per adesso le stelle e io andiamo d'accordo. ${later}`)],
    [IF({ hasBirth: true },
      [R(`Il tuo segno direbbe {birthCard}, ma io guardo te e non il calendario. ${later}`)],
      [R(later)])]),
];

export const SESSIONS = {
  // ---- the prologue: name, birth, the Fool, the closed door, the first hypothesis ----------------
  s0: [
    R("Vieni avanti e siediti, non c'è fretta. Ho acceso una candela apposta per te."),
    R("Non ti chiedo perché sei venuta: chi si siede a questo tavolo di solito non lo sa ancora. Per cominciare mi basta sapere come ti chiami."),
    { ask: 'name' },
    R("{name}: è un nome che si ricorda volentieri."),
    R("Adesso dimmi quando sei nata. Mi servono il giorno e il mese; l'anno, se non ti va, puoi tenerlo per te."),
    { ask: 'birth' },
    IF({ hasBirth: true }, [
      R("Sei nata in {season}, sotto il segno {sign}. Ognuna di noi ha un'affinità con certe carte, e chi nasce sotto il tuo segno di solito ce l'ha con {birthCard}."),
      R("Di solito, però. Io credo che in te ci sia dell'altro, e mi piacerebbe capire che cosa."),
    ], [
      R("Va bene, tienilo per te: certe cose si dicono più avanti, oppure non si dicono affatto."),
      R("Vorrà dire che dovrò capire chi sei senza l'aiuto delle stelle, e ti confesso che così mi piace di più."),
    ]),
    { turn: 'm00' },
    R("Intanto questa è per te. Si chiama Il Matto ed è la prima carta del mazzo: un ragazzo che parte con un fagotto in spalla e non guarda dove mette i piedi."),
    R("Non offenderti, capita a tutte all'inizio. È la carta di chi sta per cominciare qualcosa e non sa ancora bene che cosa."),
    R("Prima di lasciarti andare vorrei farti un paio di domande. Non ci sono risposte giuste: mi servono soltanto per conoscerti."),
    { symbol: 'key' }, // smoke: the closed door
    R("Immagina di arrivare, di notte, davanti a una casa in cui c'è qualcosa che ti interessa. La porta è chiusa. Bussi, oppure fai il giro per cercare una finestra?"),
    choice(
      O("Busso alla porta.", { esplora: -1 }, [
        R("Bussi, quindi preferisci che siano gli altri ad aprirti. È una cosa che dice più di quanto pensi."),
        R("E se non risponde nessuno? Resti lì ad aspettare, o a quel punto te ne vai?"),
        choice(
          O("Aspetto.", { rischio: -1 }, [R("Allora sai aspettare. Non è da tutte, anche se qualche volta diventa un difetto.")], { flag: 's0.wait' }),
          O("Me ne vado.", { guida: -1 }, [R("Non insisti dove non ti vogliono. Ne riparleremo, perché non sempre è una virtù.")], { flag: 's0.leave' }),
        ),
      ], { flag: 's0.knock' }),
      O("Cerco una finestra.", { esplora: 1 }, [
        R("La finestra, allora. Ti piace sapere cosa c'è dentro prima di farti vedere."),
        R("Dalla finestra vedi che in casa c'è una persona che piange. Entri lo stesso, o torni indietro senza farti sentire?"),
        choice(
          O("Entro lo stesso.", { rischio: 1 }, [R("Entri anche quando sarebbe più comodo non farlo. Me lo segno, perché mi piace.")], { flag: 's0.enter' }),
          O("Torno indietro.", { tono: 1 }, [R("Lasci in pace chi vuole restare solo. È una gentilezza, oppure è prudenza: non l'ho ancora capito.")], { flag: 's0.back' }),
        ),
      ], { flag: 's0.window' }),
    ),
    R("Ancora una cosa, e poi ti lascio andare. Quando qualcuno ti dice come andrà a finire una faccenda, tu di solito gli credi?"),
    choice(
      O("Di solito un po' ci credo.", { guida: 1 }, [R("Allora con me dovrai stare attenta, perché io di cose ne dico parecchie. Mi fa piacere, però: chi non crede a niente, a questo tavolo, si annoia.")], { flag: 's0.believes' }),
      O("No, preferisco vedere come va.", { guida: -1 }, [R("Fai bene, e te lo dice una che di mestiere racconta come andrà a finire. Vorrà dire che la tua fiducia dovrò guadagnarmela.")], { flag: 's0.doubts' }),
    ),
    R("Mi sto facendo un'idea di te, anche se è presto per dirlo."),
    IF({ hasBirth: true }, [
      IF({ yourCardIsBirth: true },
        [R("Per stanotte direi che la tua carta è proprio {birthCard}, come vuole il tuo segno. Vedremo se andando avanti mi farai cambiare idea.")],
        [R("Per il tuo segno dovresti essere {birthCard}. Per come rispondi, stanotte ti vedo più vicina a {yourCard}. Vedremo se andando avanti mi farai cambiare idea.")]),
    ], [
      R("Per come rispondi, stanotte ti vedo vicina a {yourCard}. È soltanto una prima impressione: vedremo se andando avanti mi farai cambiare idea."),
    ]),
    { do: 'verdict' },
    R("Adesso vai: la strada per il villaggio è qui fuori, e stanotte nevica."),
    step('p.road'),
    travel('village.arrival'),
  ],

  // ---- after the village: what matters to her ----------------------------------------------------
  s1: [
    R("Bentornata, siediti e scaldati le mani: la candela è la stessa della prima sera, si è soltanto accorciata un po'."),
    { observe: [
      say({ stat: ['jailed', '>=', 2] }, "Ho saputo che in cella ci sei già finita {stat:jailed} volte. Eppure sei ancora qui, e con più carte di prima."),
      say({ stat: ['jailed', '>=', 1] }, "Ho saputo che una notte l'hai passata in cella. A quanto vedo non ti ha tolto la voglia di cercare carte."),
      say({ stat: ['examsPassed', '>=', 3] }, "I conestabili ti hanno fermata {stat:exams} volte, e {stat:examsPassed} te la sei cavata. Per una arrivata da poco, hai imparato in fretta a rispondere."),
      say(hi('esplora'), "Da quando sei arrivata hai guardato dietro ogni angolo del villaggio. Qualcuno direbbe che perdi tempo; io dico che è così che si trovano le carte."),
      say(lo('esplora'), "Da quando sei arrivata vai dove devi andare e basta. Ammiro la disciplina, anche se qualche carta si nasconde proprio nei giri inutili."),
      say(F('lied.constable'), "Al primo conestabile hai raccontato che eri soltanto di passaggio. Era una bugia piccola e detta bene, e me la sono segnata lo stesso."),
      say({ has: 'm03' }, "All'Imperatrice, quando l'hai trovata, hai dato tre parole tue: {words:m03}. Le ho lette, e mi hanno detto qualcosa anche di te."),
      say(true, "La prima sera avevi una carta sola, e adesso ne hai {majors}. Comincia a essere un mazzo vero."),
    ] },
    IF(F('door.window'), [R("La prima sera mi hai detto come ti comporti davanti a una porta chiusa. Poi hanno bussato alla tua, e prima di aprire sei andata a guardare dalla finestra: l'ho saputo, e l'ho messo accanto a quella risposta.")]),
    IF(F('door.opened'), [R("La prima sera mi hai detto come ti comporti davanti a una porta chiusa. Poi hanno bussato alla tua, e hai aperto prima che finissero di bussare: l'ho saputo, e l'ho messo accanto a quella risposta.")]),
    R("Stasera vorrei capire che cosa conta per te. Non te lo chiedo direttamente, perché a quella domanda rispondono tutte allo stesso modo."),
    { symbol: 'coin' }, // smoke: what is worth something
    R("Mettiamo che tu abbia una sera tutta per te, senza niente da fare per forza. La passi con qualcuno, oppure te la tieni per te?"),
    choice(
      O("La passo con qualcuno.", { tono: 1 }, [
        R("Con qualcuno, quindi. Allora quello che conta, per te, passa dalle persone."),
        R("E questo qualcuno com'è? Uno che ti fa ridere, o uno che ti dice le cose come stanno anche quando non ti piacciono?"),
        choice(
          O("Uno che mi fa ridere.", { guida: 1 }, [
            ...leaf('value', 'allegria', 'm19', 'c'),
            R("Scegli chi ti fa ridere. Non è una risposta leggera come sembra: vuol dire che la sera i pesi li vuoi posare, e non contare."),
            R("E tu, di solito, da che parte stai? Sei quella che fa ridere gli altri, o quella che ride?"),
            choice(
              O("Faccio ridere io.", { parola: 1 }, [R("Me l'aspettavo: chi cerca l'allegria, di solito, ne porta sempre un po' in tasca.")]),
              O("Sono quella che ride.", { parola: -1 }, [R("Allora sei un buon pubblico, e non è poco. Chi fa ridere ha bisogno di una come te più di quanto ammetta.")]),
            ),
          ]),
          O("Uno che mi dice le cose come stanno.", { guida: -1 }, [
            ...leaf('value', 'sincerità', 'm11', 's'),
            R("Preferisci una verità scomoda a una serata facile. Lo dicono in molte; vediamo se vale anche quando la verità riguarda te."),
            R("Facciamo la prova. Se un'amica ti chiede un parere su una cosa che ha fatto male, tu glielo dici tutto?"),
            choice(
              O("Sì, glielo dico tutto.", { parola: 1 }, [R("Addirittura tutto: sei coerente, e spero per lei che tu sappia anche scegliere il momento.")]),
              O("Glielo dico, ma con garbo.", { tono: 1 }, [R("Quindi la verità la dai a piccole dosi. Va bene, anche se a volte una dose piccola non basta.")]),
            ),
          ]),
        ),
      ]),
      O("Me la tengo per me.", { parola: -1 }, [
        R("Te la tieni per te. Non lo dico per farti un complimento, ma chi sa stare da sola a questo tavolo impara più in fretta."),
        R("E in una sera così che cosa fai? Ti metti a imparare qualcosa, oppure non fai proprio niente e lasci che la sera passi?"),
        choice(
          O("Imparo qualcosa.", { esplora: 1 }, [
            ...leaf('value', 'imparare', 'm01', 'p'),
            R("Anche da sola, quindi, ti dai da fare. Mi chiedo se sia curiosità, o se a stare ferma proprio non ci riesci."),
            R("Dimmi allora: una cosa la impari per usarla, o ti basta sapere che adesso la sai?"),
            choice(
              O("La imparo per usarla.", { guida: -1 }, [R("Sei pratica, e con le carte ti troverai bene, perché si imparano soltanto leggendole a qualcuno.")]),
              O("Mi basta saperla.", { guida: 1 }, [R("Sapere per il gusto di sapere. È un lusso, e sono contenta che tu te lo conceda.")]),
            ),
          ]),
          O("Non faccio niente.", { rischio: 1 }, [
            ...leaf('value', 'libertà', 'm00', 'w'),
            R("Niente del tutto. Ci vuole più coraggio di quanto si creda, a non riempire una sera."),
            R("E mentre non fai niente, ti senti un po' in colpa oppure no?"),
            choice(
              O("Un po' sì.", { guida: -1 }, [R("Lo immaginavo: sai stare ferma, ma una parte di te tiene i conti. Tienila d'occhio, perché sa essere severa.")]),
              O("No, per niente.", { guida: 1 }, [R("Beata te, e lo dico sul serio. È una libertà che molte imparano tardi, e qualcuna mai.")]),
            ),
          ]),
        ),
      ]),
    ),
    { observe: [
      say([F('s0.knock'), F('b1.spoke')], "La prima sera mi hai detto che davanti a una porta chiusa bussi. In piazza hai fatto lo stesso: ti sei fatta avanti e hai parlato per quella donna."),
      say([F('s0.knock'), F('b1.hid')], "La prima sera mi hai detto che davanti a una porta chiusa bussi. In piazza però sei rimasta zitta, nell'ombra del portico: quella sera parlare costava caro."),
      say([F('s0.window'), F('b1.hid')], "La prima sera mi hai detto che prima di entrare cerchi una finestra. In piazza hai fatto così: sei rimasta sotto il portico a guardare che cosa succedeva."),
      say([F('s0.window'), F('b1.spoke')], "La prima sera mi hai detto che prima di entrare cerchi una finestra. In piazza però non ne hai cercata nessuna: hai parlato subito, davanti a tutti."),
      say(true, "In piazza, l'altra sera, c'eri anche tu. Di quello che hai fatto lì riparleremo, perché non l'ho ancora capito fino in fondo."),
    ] },
    IF({ hasBirth: true }, [{ observe: [
      say({ modality: 'cardinale' }, "Ho ripensato anche al tuo segno. È un segno cardinale, di quelli che aprono una stagione: di solito siete voi a cominciare le cose, e altri le portano avanti."),
      say({ modality: 'fisso' }, "Ho ripensato anche al tuo segno. È un segno fisso, di quelli che stanno nel cuore di una stagione: quando avete deciso che una cosa conta, non la mollate più."),
      say({ modality: 'mobile' }, "Ho ripensato anche al tuo segno. È un segno mobile, di quelli che chiudono una stagione e preparano la prossima: cambiate strada senza farne un dramma."),
    ] }]),
    R("Adesso ripensa alla sera della piazza, a quello che hai fatto e a come ti sei sentita dopo. Tienila in mente e dimmi un numero da uno a ventidue."),
    pick(R("Io la leggo così, pensando alla piazza. Tu portati dietro {picked} per qualche giorno, e guarda se quello che dice ti torna.")),
    ...verdict("Di te, finora, ho visto soprattutto questo:", "Vedremo se nel bosco mi farai cambiare idea."),
    R("Adesso vai: oltre il cancello comincia il bosco, e là è già primavera."),
  ],

  // ---- after the forest: what frightens her (small fears, gently) -----------------------------------
  s2: [
    R("Siediti, e prenditi un momento prima di parlare. So che hanno portato via Ginepra, e so che eri lì quando è successo."),
    { observe: [
      say({ stat: ['jailed', '>=', 3] }, "In cella ormai ci sei finita {stat:jailed} volte. La strada per uscirne la conosci meglio dei conestabili."),
      say({ stat: ['stuns', '>=', 1] }, "So che hai imparato a lasciare i conestabili imbambolati in mezzo alla strada. Spero che tu lo faccia con garbo."),
      say({ stat: ['fires', '>=', 5] }, "Da quando sai fare luce sei entrata nel buio {stat:fires} volte. Chi ha paura del buio, di solito, non ci torna così spesso."),
      say({ stat: ['readings', '>=', 6] }, "Hai letto le carte a {stat:readings} persone, ormai. Quasi tutte venivano per una paura, e stasera tocca a te stare da quella parte."),
      say({ stat: ['examsPassed', '>=', 6] }, "Ai conestabili hai risposto bene {stat:examsPassed} volte. Ti confesso che all'inizio non ci avrei scommesso."),
      say({ trust: ['ginepra', '>=', 2] }, "Tu e Ginepra avevate imparato a fidarvi, e si vedeva. Capisco che stanotte tu abbia la testa altrove."),
      say({ has: 'm13' }, "Alla Morte, quando l'hai trovata, hai dato tre parole tue: {words:m13}. Le ho rilette stasera, prima che arrivassi."),
      say(true, "Hai {majors} carte, adesso, e quando sei entrata nel bosco ne avevi molte meno. È stata una buona stagione, fino a stanotte."),
    ] },
    IF(F('arrest.hid'), [R("So anche che quella notte, dietro la legnaia, qualcuno ti ha stretto la mano al buio. Non te lo dico per farti male: te lo dico perché certe mani poi si vanno a riprendere.")]),
    IF(F('plan.lookout'), [R("Quella notte sei rimasta fuori a fare il palo, mi dicono, e hai fischiato in tempo. Restare a guardare una porta è più faticoso che entrarci, e non tutte lo sanno.")]),
    R("Stasera vorrei parlare di quello che ti fa paura. Niente di grave: mi interessano le paure piccole, quelle di tutti i giorni, perché dicono molto di una persona."),
    { symbol: 'moon' }, // smoke: the night
    R("Immagina di camminare da sola, di notte, per una strada che non conosci. Ti mette più a disagio un rumore che non capisci, o un silenzio troppo lungo?"),
    choice(
      O("Un rumore che non capisco.", { guida: -1 }, [
        R("Il rumore, quindi. Ti dà fastidio non sapere che cos'è una cosa, più della cosa in sé."),
        R("E quando lo senti, quel rumore, che cosa fai? Vai a vedere che cos'è, o allunghi il passo?"),
        choice(
          O("Vado a vedere.", { rischio: 1 }, [
            ...leaf('fear', 'il dubbio', 'm18', 's'),
            R("Vai a vedere. Allora la tua non è paura del buio: è che non sopporti di restare col dubbio."),
            R("E se poi scopri che era soltanto un gatto, ridi oppure te la prendi con te stessa?"),
            choice(
              O("Rido.", { tono: 1 }, [R("Meno male, perché chi sa ridere di uno spavento se lo porta dietro molto meno.")]),
              O("Me la prendo un po'.", { tono: -1 }, [R("Con te stessa sei severa, lo sospettavo. Tienilo a mente: un gatto resta un gatto, anche se ti ha fatta saltare.")]),
            ),
          ]),
          O("Allungo il passo.", { rischio: -1 }, [
            ...leaf('fear', "l'imprevisto", 'm16', 'p'),
            R("Allunghi il passo, e non ti do torto. Quello che non ti piace, mi pare, è farti cogliere impreparata."),
            R("Dimmi però una cosa: quando sei al sicuro, ti volti a guardare che cos'era?"),
            choice(
              O("Sì, mi volto.", { esplora: 1 }, [R("Lo sapevo: scappi, ma la curiosità non la lasci per strada.")]),
              O("No, tiro dritto.", { esplora: -1 }, [R("Tiri dritto, quindi. È un modo di proteggersi e funziona, anche se ogni tanto ti lascia senza la fine della storia.")]),
            ),
          ]),
        ),
      ]),
      O("Un silenzio troppo lungo.", { guida: 1 }, [
        R("Il silenzio, allora. Quello che temi non sta in strada: sta in quello che ti immagini mentre non succede niente."),
        R("Pensa a un silenzio che ti pesa. È quello di una persona che non ti risponde, o quello di una casa dove non c'è nessuno?"),
        choice(
          O("Una persona che non mi risponde.", { tono: 1 }, [
            ...leaf('fear', 'il silenzio di qualcuno', 'm06', 'c'),
            R("Il silenzio di qualcuno, dunque. Vuol dire che agli altri tieni parecchio, forse più di quanto fai vedere."),
            R("E quando qualcuno tace così, tu che cosa fai? Glielo chiedi, che cos'ha, oppure aspetti che parli?"),
            choice(
              O("Glielo chiedo.", { parola: 1 }, [R("Glielo chiedi, ed è la strada più corta; di solito è anche la più gentile.")]),
              O("Aspetto che parli.", { parola: -1 }, [R("Aspetti, ed è una forma di rispetto; bada soltanto che l'altro non la scambi per indifferenza.")]),
            ),
          ]),
          O("Una casa dove non c'è nessuno.", { esplora: -1 }, [
            ...leaf('fear', 'la casa vuota', 'm09', 'w'),
            IF({ any: [F('leaf.value.m01'), F('leaf.value.m00')] },
              [R("La casa vuota. Eppure mi avevi detto che una sera libera te la tieni per te: forse il silenzio ti pesa soltanto quando non l'hai scelto tu.")],
              [R("La casa vuota. Va d'accordo con quello che mi avevi detto, che una sera libera la passi con qualcuno: a te le stanze piacciono abitate.")]),
            R("E in una casa vuota che cosa fai per prima cosa? Accendi tutte le luci, o ti metti a fare rumore?"),
            choice(
              O("Accendo le luci.", { guida: -1 }, [R("Vuoi vedere con i tuoi occhi che non c'è niente. Sei una che si rassicura guardando.")]),
              O("Faccio rumore.", { parola: 1 }, [R("Il silenzio lo riempi tu. Mi piace: invece di aspettare che la casa si animi, la animi da sola.")]),
            ),
          ]),
        ),
      ]),
    ),
    { observe: [
      say([F('leaf.fear.m16'), F('b2.went')], "Mi dici che al buio allunghi il passo. Eppure quella notte, con Ginepra, nel deposito ci sei entrata, e il passo l'hai allungato soltanto dopo."),
      say([F('leaf.fear.m18'), F('b2.stayed')], "Mi dici che un rumore vai a vedere che cos'è. Quella notte però Ginepra è andata a vedere da sola, e tu sei rimasta fuori: lo tengo accanto all'altra risposta."),
      say(F('b2.went'), "Quando Ginepra è andata a riprendersi il mazzo nel deposito del tribunale, tu eri con lei. Sul quaderno, accanto a «{word:value}», adesso scrivo anche questo."),
      say(F('b2.stayed'), "Quando Ginepra è andata a riprendersi il mazzo nel deposito del tribunale, tu non l'hai seguita. Non lo scrivo tra le paure: a volte restare fuori è la cosa più sensata."),
      say(true, "Della notte del deposito riparleremo un'altra volta, con più calma."),
    ] },
    IF({ hasYear: true }, [{ observe: [
      say({ moon: 'nuova' }, "Ho guardato che luna c'era la notte in cui sei nata: era nuova, cioè non si vedeva. Di chi nasce al buio si dice che al buio si orienti meglio degli altri."),
      say({ moon: 'crescente' }, "Ho guardato che luna c'era la notte in cui sei nata: stava crescendo. Di chi nasce così si dice che voglia sempre arrivare un po' più in là di dove si trova."),
      say({ moon: 'piena' }, "Ho guardato che luna c'era la notte in cui sei nata: era piena, e illuminava tutto. Di chi nasce così si dice che faccia fatica a tenere nascosto quello che prova."),
      say({ moon: 'calante' }, "Ho guardato che luna c'era la notte in cui sei nata: stava calando. Di chi nasce così si dice che sappia lasciar andare le cose, e che per questo le pesino meno."),
    ] }]),
    R("Adesso ripensa un momento a quella notte, a Ginepra e al deposito del tribunale. Tienila in mente e dimmi un numero da uno a ventidue."),
    pick(R("Prendi {picked} come la risposta delle carte a quella notte. Non devi essere d'accordo: mi basta che te ne ricordi.")),
    ...verdict("In questo tempo, più di tutto, ho visto che", "Vedremo se là sotto, al buio, mi farai cambiare idea."),
    R("Adesso vai: sotto il villaggio c'è una persona che ti aspetta da molto tempo, anche se non ricorda il tuo nome."),
  ],

  // ---- after the rescue: what she wishes for -------------------------------------------------------
  s3: [
    R("Siediti piano, perché devi essere stanca. L'hai portata fuori, e a quest'ora a Salem lo sanno già tutti."),
    { observe: [
      say(F('trial.won'), "So come hai risposto al Giudice. Non gli hai lasciato niente a cui aggrapparsi, e lui è uno che si aggrappa a tutto."),
      say(F('trial.lost'), "So che davanti al Giudice qualche risposta ti è mancata. Ginepra l'hai portata fuori lo stesso, e questo conta più delle risposte."),
      say({ stat: ['readings', '>=', 12] }, "Hai letto le carte a {stat:readings} persone. Stasera vorrei che ti ricordassi che cosa speravano, perché ti riguarda."),
      say({ stat: ['examsPassed', '>=', 8] }, "In tutto hai tenuto testa ai conestabili {stat:examsPassed} volte. A questo punto dovrebbero essere loro a temere le tue domande."),
      say({ stat: ['locks', '>=', 5] }, "Hai aperto {stat:locks} serrature con le sole risposte giuste. Mi domando quante porte ti resteranno chiuse, d'ora in poi."),
      say({ stat: ['jailed', '>=', 3] }, "Sei finita in cella {stat:jailed} volte e ne sei sempre uscita. Stanotte ne hai tirata fuori anche un'altra, ed è la volta che conta."),
      say({ has: 'm17' }, "Alla Stella, quando l'hai trovata, hai dato tre parole tue: {words:m17}. Stasera mi sembrano scritte apposta."),
      say(true, "Hai {majors} carte, ormai, e il mazzo è quasi intero. Quello che manca lo tengo io ancora per un po'."),
    ] },
    IF(F('court.card'), [R("In aula hai detto la tua carta ad alta voce, davanti al Giudice. Io te la dico sottovoce da un anno; sentirla dire da te, e in quel posto, mi ha fatto un certo effetto.")]),
    IF(F('coven.cat.in'), [R("Mi dicono che davanti al Giudice avevi un gatto sotto il mantello. Non so se ti abbia aiutata a rispondere, ma chi si porta dietro un amico in un posto così di solito sa perché lo fa.")]),
    { observe: [
      say([F('s0.knock'), F('b3.open')], "La prima sera mi hai detto che davanti a una porta chiusa bussi. Al processo hai fatto proprio così: ti sei presentata a viso aperto, dalla porta grande."),
      say([F('s0.knock'), F('b3.stealth')], "La prima sera mi hai detto che davanti a una porta chiusa bussi. Da Ginepra però sei arrivata di nascosto, dalle cantine: stavolta hai cercato la finestra."),
      say([F('s0.window'), F('b3.stealth')], "La prima sera mi hai detto che davanti a una porta chiusa cerchi una finestra. Per Ginepra l'hai trovata: sei passata dalle cantine, senza farti vedere."),
      say([F('s0.window'), F('b3.open')], "La prima sera mi hai detto che davanti a una porta chiusa cerchi una finestra. Al processo però ti sei presentata a viso aperto: qualcosa in te è cambiato."),
      say(true, "La prima sera ti ho chiesto che cosa fai davanti a una porta chiusa. Stanotte ne hai aperta una che sembrava chiusa per sempre."),
    ] },
    R("Dopo tutto questo vorrei sapere che cosa desideri. Parlo dei sogni che si fanno da sveglie, quelli che poi si possono anche realizzare."),
    { symbol: 'star' }, // smoke: what you hope for
    R("Quando questa storia sarà finita, dove ti immagini? In un posto che non hai mai visto, oppure in un posto finalmente tuo?"),
    choice(
      O("In un posto che non ho mai visto.", { esplora: 1 }, [
        R("Un posto nuovo. Potrei pensare che tu voglia scappare da qui, ma non mi sembri una che scappa: mi sembri una che vuole vedere."),
        R("E in questo posto nuovo ci arrivi da sola, o con qualcuno che cammina accanto a te?"),
        choice(
          O("Da sola.", { rischio: 1 }, [
            ...leaf('dream', 'partire', 'm07', 'w'),
            R("Da sola, quindi. Ci vuole fegato, e dopo stanotte so che ce l'hai."),
            R("E una volta arrivata, quello che hai visto lo racconti a qualcuno?"),
            choice(
              O("Sì, a chi è rimasto.", { parola: 1 }, [R("Allora non è un viaggio per sparire: è un viaggio per tornare con qualcosa da dire.")]),
              O("No, me lo tengo.", { parola: -1 }, [R("Te lo tieni. È vero che certe cose, a raccontarle, si consumano.")]),
            ),
          ]),
          O("Con qualcuno accanto.", { guida: 1 }, [
            ...leaf('dream', 'un viaggio in due', 'm14', 'c'),
            R("In compagnia, quindi. Il posto nuovo ti interessa, ma mi pare che ti interessi di più con chi lo guardi."),
            R("E tra voi due, la strada chi la decide?"),
            choice(
              O("La decido io.", { rischio: 1 }, [R("Me l'aspettavo, e spero che chi ti accompagna abbia buone gambe.")]),
              O("La decidiamo insieme.", { tono: 1 }, [R("La decidete insieme, dunque. È più lento, lo sai, ma si litiga meno all'arrivo.")]),
            ),
          ]),
        ),
      ]),
      O("In un posto finalmente mio.", { esplora: -1 }, [
        R("Un posto tuo. È il desiderio di chi ha girato abbastanza, e adesso vuole una porta da chiudere quando le pare."),
        R("E dentro, in questo posto, che cosa c'è? È pieno di libri, o è pieno di piante?"),
        choice(
          O("È pieno di libri.", { guida: -1 }, [
            ...leaf('dream', 'una casa piena di libri', 'm02', 's'),
            R("Libri, e ormai non mi stupisce: è da un pezzo che ti vedo raccogliere carte come altre raccolgono pagine."),
            R("E questi libri li tieni per te, o un giorno li apri a qualcun altro?"),
            choice(
              O("Li tengo per me.", { parola: -1 }, [R("Una biblioteca chiusa a chiave. Va bene, purché ogni tanto tu ci faccia entrare almeno un gatto.")]),
              O("Li apro a chi vuole.", { tono: 1 }, [R("Allora quello che sogni, sotto sotto, è una scuola. Tienilo presente, perché tra poco potrebbe servirti.")]),
            ),
          ]),
          O("È pieno di piante.", { guida: 1 }, [
            ...leaf('dream', 'un giardino', 'm03', 'p'),
            R("Le piante, allora. Vuol dire che ti piace aspettare che le cose crescano, e dopo tante notti di corsa ti capisco."),
            R("E le piante le vuoi in ordine, ognuna nel suo vaso, o le lasci crescere come viene?"),
            choice(
              O("In ordine.", { esplora: -1 }, [R("Un giardino con le sue regole. A Malva piaceresti, anche se non te lo direbbe mai.")]),
              O("Come viene.", { esplora: 1 }, [R("Un giardino che fa di testa sua. A Ortica piaceresti, e te lo direbbe per un'ora di fila.")]),
            ),
          ]),
        ),
      ]),
    ),
    R("Ormai i numeri delle carte li conosci quasi tutti. Stavolta scegli tu, da uno a ventidue, la carta che vuoi portarti dietro in quel posto."),
    pick(R("Stavolta {picked} l'hai scelta tu, e il caso non c'entra. Ricordatelo quando la rivedrai sul tavolo.")),
    ...verdict("Dopo tutte queste sere, la cosa che di te vedo meglio è che", "Te lo dico per l'ultima volta da questa parte del tavolo."),
    R("Adesso va' a riposare. La prossima volta che ti siederai qui troverai il tavolo un po' cambiato."),
  ],

  // ---- the finale: no questions; she hands the deck over ------------------------------------------
  s4: [
    R("Siediti pure, ma stasera non ti chiedo niente. Le domande le ho finite, e tu hai risposto a tutte."),
    IF(F('s0.window'),
      [R("La prima sera non sapevi ancora perché eri venuta. Mi hai detto il tuo nome, e poi che davanti a una porta chiusa cerchi una finestra.")],
      [R("La prima sera non sapevi ancora perché eri venuta. Mi hai detto il tuo nome, e poi che davanti a una porta chiusa bussi.")]),
    R("Da allora sul mio quaderno ho messo tre parole: «{word:value}» per quello che conta, «{word:fear}» per quello che temi, «{word:dream}» per quello che sogni."),
    IF(F('s0.believes'),
      [R("Mi avevi anche detto che a chi ti racconta come andrà a finire un po' credi. Io non l'ho mai fatto, ci hai badato? Ti ho detto soltanto chi vedevo.")],
      [R("Mi avevi anche detto che non credi a chi ti racconta come andrà a finire. Avrai notato che non l'ho mai fatto: ti ho detto soltanto chi vedevo.")]),
    IF({ verdict: 'changed' },
      [R("Chi legge sceglie sempre una carta che rappresenta chi chiede, e la mette al centro. L'ultima volta ti ho detto {lastVerdict}, ma stasera la tua è {yourCard}.")],
      [R("Chi legge sceglie sempre una carta che rappresenta chi chiede, e la mette al centro. La tua è {yourCard}: te l'ho detto l'ultima volta, e non ho cambiato idea.")]),
    like,
    { do: 'verdict' },
    IF({ yourCardIsBirth: true },
      [R("È la carta del tuo segno. Hai fatto tutto questo giro per tornare da dove eri partita, però adesso sai perché.")],
      [IF({ hasBirth: true }, [R("Sei nata sotto {birthCard} e sei diventata {yourCard}. Nessuna delle due è sbagliata: una è da dove vieni, l'altra è dove sei arrivata.")])]),
    N("Il mazzo scivola piano sul tavolo, fino a fermarsi davanti a te."),
    R("Adesso leggi tu, e leggi per te. Io resto qui a guardare, e stavolta sto zitta."),
    { do: 'reading', spread: 'celtic', client: 'self' },
    R("Hai letto, e com'è andata lo sai meglio tu di me: è giusto così."),
    R("Prima di lasciarti ti dico come ti ho vista in tutte queste sere. Prendilo per quello che è: il parere di una che ti ha guardata a lungo."),
    { portrait: true },
    R("Manca ancora una carta, e l'ho tenuta io fino a stasera."),
    give('m21'),
    R("È Il Mondo, l'ultima: una figura che danza dentro una corona, perché ha finito il giro e ogni cosa è al suo posto."),
    R("Con questa sono ventidue. Il mazzo adesso è intero, ed è tuo."),
    choice(
      O("Chi sei, tu?", { parola: 1 }, [R("Guarda bene il tavolo, e lo capirai da sola.")]),
      O("Grazie di tutto.", { tono: 1 }, [R("Sono io che ringrazio te. Adesso guarda bene il tavolo.")]),
    ),
    N("Il tavolo è lo stesso, e la candela anche. Tu però adesso lo stai guardando dall'altra parte."),
    { tableau: 'last' }, // the Reader is gone: only the grimoire, open, and the candle (story/stage)
    N("Il grimorio aperto davanti a te è scritto con la tua calligrafia."),
    N("Di fronte c'è una sedia vuota, e ha l'aria di aspettare qualcuno."),
  ],
};
