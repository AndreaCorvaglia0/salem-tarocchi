// The lessons added on 16 Nov (docs/DESIGN.md "La lezione di volo", "I Minori"), each with the short
// scene that announces it (played by glue/lessons.js when the lesson is due: glue/lessons.rules.js):
//   fly.offer -> fly.lesson                  Malva, in the kitchen garden behind her house: the broom
//   minors.N.offer -> minors.N.lesson        the course on the small cards, five short lessons:
//     1 the four suits (Ortica)   2 one, two, three (Ginepra, or her notebook)   3 four, five, six (Malva)
//     4 from seven to ten (Ortica, walking to the mill)   5 the court (Edera)
//   reversed.offer -> reversed.lesson        Edera, in her nook: a reversed card says the same thing, held back
// Each lesson of the course: a short scene, two worked examples, two practice questions.
// The words of the grid come from data/reading/grid.js and the meanings from the cards' voices
// (data/reading/voices): nothing of them is retyped here. A practice question is an ordinary choice whose
// right option carries `ok: true`; a wrong one gets the correction, and the lesson goes on.
import { N, T, malva, ortica, edera, ginepra, cat, o, choice, IF, xp, flag, diary, travel, lesson } from '../h.js';
import { SEMI, NUMERI, FIGURE } from '../../reading/grid.js';
import c01 from '../../reading/voices/c01.js';
import c02 from '../../reading/voices/c02.js';
import c03 from '../../reading/voices/c03.js';
import c05 from '../../reading/voices/c05.js';
import c07 from '../../reading/voices/c07.js';
import c08 from '../../reading/voices/c08.js';
import c10 from '../../reading/voices/c10.js';
import c11 from '../../reading/voices/c11.js';
import m15 from '../../reading/voices/m15.js';
import m19 from '../../reading/voices/m19.js';
import p01 from '../../reading/voices/p01.js';
import p03 from '../../reading/voices/p03.js';
import p04 from '../../reading/voices/p04.js';
import p05 from '../../reading/voices/p05.js';
import p06 from '../../reading/voices/p06.js';
import p07 from '../../reading/voices/p07.js';
import p08 from '../../reading/voices/p08.js';
import p12 from '../../reading/voices/p12.js';
import p13 from '../../reading/voices/p13.js';
import p14 from '../../reading/voices/p14.js';
import s02 from '../../reading/voices/s02.js';
import s03 from '../../reading/voices/s03.js';
import s04 from '../../reading/voices/s04.js';
import s10 from '../../reading/voices/s10.js';
import s14 from '../../reading/voices/s14.js';
import w01 from '../../reading/voices/w01.js';
import w02 from '../../reading/voices/w02.js';
import w03 from '../../reading/voices/w03.js';
import w04 from '../../reading/voices/w04.js';
import w05 from '../../reading/voices/w05.js';
import w06 from '../../reading/voices/w06.js';
import w07 from '../../reading/voices/w07.js';
import w08 from '../../reading/voices/w08.js';
import w10 from '../../reading/voices/w10.js';
import w11 from '../../reading/voices/w11.js';
import w12 from '../../reading/voices/w12.js';
import w13 from '../../reading/voices/w13.js';
import { GINEPRA_FREE } from '../missions.js';

// what a number does, in a few words: the part of its idea before the examples ("qualcosa si rompe")
export const head = (n) => NUMERI[n].idea.split(/[:,]/)[0];
// a card's meaning quoted inside a sentence: «Una perdita, e il rimpianto»
const q = (essenza) => `«${essenza.replace(/\.$/, '')}»`;
const { w, c, s, p } = SEMI;
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const n = (k) => NUMERI[k].parola; // the word of a number: "scossa"
const f = (k) => FIGURE[k].parola; // who a court card is: "chi custodisce"

// a practice question: the line that asks it, then the three options in the order they are written
const right = (t, re) => ({ t, ok: true, re });
const wrong = (t, re) => ({ t, re });
const practice = (who, question, options) => [
  who(question),
  choice(...options.map((x) => ({ t: x.t, ...(x.ok ? { ok: true } : {}), then: [who(x.re), ...(x.ok ? [xp(5)] : [])] }))),
];

export const LESSON_SCRIPTS = {
  // ---- the flying lesson ----------------------------------------------------------------------
  'fly.offer': [
    IF({ power: 'cat' }, [
      cat('(Malva ti ha vista passare con quella scopa sottobraccio, e ha fatto la faccia di quando il latte sta per uscire dalla pentola.)'),
      cat('(Dice di passare da casa sua prima di provarla da sola, perché le ossa rotte poi tocca a lei rimetterle a posto. Io ci andrei: in volo vengo anch\'io, e alla pelle ci tengo.)'),
    ], [
      T('Ho una scopa che freme come un cavallo giovane, e non ho idea di come si monti. Malva di sicuro lo sa: conviene passare da casa sua prima di provarci da sola.'),
    ]),
    diary('Malva vuole insegnarmi a volare prima che ci provi da sola. Mi aspetta davanti a casa sua, sulla strada da cui sono arrivata.'),
    flag('fly.offered'),
  ],
  'fly.lesson': [
    N('Malva è sulla porta di casa, con lo scialle sulle spalle, e ti guarda arrivare. Non ti saluta: dà un\'occhiata alla scopa che hai in mano e si avvia verso l\'orto dietro casa, sicura che la seguirai.'),
    travel('village.garden'),
    malva('Qui dalla strada non ci vede nessuno, ed è l\'unico motivo per cui non lo facciamo in piazza. Fammi vedere come la tieni.'),
    malva('Così ci spazzi il cortile. Una scopa che vola si tiene bassa e vicina, come un cavallo che non conosci ancora: sente se hai paura, e se ne hai troppa non si muove.'),
    choice(
      o('Un po\' di paura ce l\'ho, e preferisco dirtelo.', { parola: 1 }, [
        malva('Meno male che lo dici, perché quelle che non ne avevano le ho raccolte io dai tetti, una per una. La paura tienila pure: basta che il manico lo tenga tu.'),
      ], { trust: { malva: 1 } }),
      o('Io non ho paura: dimmi soltanto da che parte si sale.', { rischio: 1 }, [
        malva('Si sale dalla stessa parte da cui poi si cade, quindi abbassa la cresta. Le spavalde le ho raccolte io dai tetti, una per una, e pesavano tutte più di quanto sembrava.'),
      ]),
    ),
    malva('Adesso siediti di traverso, con i piedi uniti, e non stringerla così, che non è il collo di una gallina. Guarda il mio comignolo e pensa di volerci arrivare: non devi fare nient\'altro.'),
    N('Per un momento non succede niente. Poi il manico ti si scalda tra le mani, i piedi lasciano la terra dell\'orto, e i cavoli di Malva diventano piccoli come bottoni.'),
    IF({ power: 'cat' }, [cat('(Io sono salito con te soltanto perché non mi hai dato il tempo di scendere. Non guardo giù, e ti consiglio di fare lo stesso.)')]),
    choice(
      o('Resto su ancora un momento, a guardare i tetti.', { esplora: 1 }, [
        N('Da quassù Salem è un pugno di tetti con il fumo sopra, e la strada da cui sei arrivata è un filo scuro che scende verso il porto. Poi Malva batte le mani due volte, e ti decidi a scendere.'),
      ]),
      o('Torno giù subito, piano, prima che mi giri la testa.', { rischio: -1 }, [
        N('Pensi alla terra dell\'orto, e la scopa scende da sola, più dolcemente di quanto temevi. Tocchi con un piede solo, e l\'altro ci mette un momento a fidarsi.'),
      ]),
    ),
    malva('Sei tornata giù intera, e non mi hai rovinato i cavoli. A me la prima volta non è andata così bene, ma questo non andarlo a raccontare a Ortica.'),
    malva('Adesso stammi a sentire, perché questa è la cosa che conta. La scopa non conosce le strade: va soltanto nei posti che i tuoi piedi conoscono già, e la direzione la prende da lì.'),
    malva('Tu hai quel quaderno, con la mappa che ti sei disegnata strada facendo. Aprilo, cerca un posto dove sei già stata e pensalo bene, che al resto ci pensa lei.'),
    malva('Al chiuso non si alza, e sotto terra nemmeno, perché le serve il cielo sopra la testa. E non partire mai con un conestabile che ti guarda: una ragazza che cammina la dimenticano, una che vola no.'),
    malva('Per oggi basta così. La prossima volta che passi di qui arriva dall\'alto, che voglio vedere se hai imparato o se ti ho soltanto fatto prendere freddo.'),
    diary('Malva mi ha insegnato a volare, nell\'orto dietro casa sua. La scopa va soltanto nei posti dove sono già stata: li cerco sulla mappa del quaderno.'),
    xp(10),
    flag('lesson.fly'),
  ],

  // ---- the course on the Minors, 1 of 5: the four suits (Ortica, at her shelf) ---------------------
  'minors.1.offer': [
    IF({ power: 'cat' }, [
      cat('(Ho incontrato il merlo di Ortica, e mi ha tenuto lì mezz\'ora per dirmi una cosa sola. Lei ti aspetta alla capanna: dice che le carte piccole le raccogli a manciate, e poi non sai da che parte guardarle.)'),
      cat('(Io ci andrei. Sono cinquantasei, e a impararle una per una si fa notte: se lei conosce un modo più svelto, per una volta vale la pena di lasciarla parlare.)'),
    ], [
      T('Ortica mi ha mandato a dire che le carte piccole le raccolgo a manciate e poi non so da che parte guardarle. Ha ragione, e mi aspetta alla sua capanna.'),
    ]),
    diary('Ortica vuole cominciare a spiegarmi le carte piccole, partendo dai quattro semi. Mi aspetta alla sua capanna, nel bosco.'),
    flag('minors.1.offered'),
  ],
  'minors.1.lesson': [
    ortica('Eccoti, era ora! Il merlo dice che raccogli le carte piccole nell\'erba e poi le guardi come una lettera scritta in un\'altra lingua. Non offenderti, che all\'inizio lo facevo anch\'io.'),
    ortica('Sono cinquantasei, e a memoria non le impara nessuna. Si comincia dal seme, che è la cosa più facile, e per oggi ci fermiamo lì: il resto te lo insegnerà chi capita, un pezzo alla volta.'),
    ortica('Hai presente il tavolo del Mago, con sopra una coppa, una spada, un bastone e una moneta? Sono i quattro semi, e io li tengo sulla mensola, tra il sale e la camomilla.'),
    ortica(`Il seme dice di quale parte della vita parla la carta. I Bastoni sono ${w.dove}, le Coppe ${c.dove}, le Spade ${s.dove}, e i Denari ${p.dove}, cioè il lavoro, i soldi e la casa.`),
    ortica(`Sono gli stessi elementi delle nostre magie: il ${w.elemento} sul palmo è dei Bastoni, e l'${c.elemento} che ti tira verso le carte è delle Coppe. L'${s.elemento} che sposta la nebbia è delle Spade, e la ${p.elemento} che si scosta è dei Denari.`),
    ortica(`Guarda questi due Assi, che ho trovato ieri sotto il fico. Quello di Coppe dice ${q(c01.up.essenza)}, e quello di Denari dice ${q(p01.up.essenza)}.`),
    ortica('È lo stesso inizio, vedi, ma uno succede nel cuore e l\'altro nella borsa. Il numero è uguale e il seme cambia tutto, come due sorelle cresciute in due case diverse.'),
    ...practice(ortica, 'Adesso prova tu, prima che io ricominci a divagare. Se ti esce una carta di Spade, di che cosa ti sta parlando?', [
      wrong(`${cap(c.idea)}.`, `Quello che senti è roba di Coppe, che sono l'${c.elemento} e ${c.dove}. Le Spade sono l'${s.elemento}, cioè ${s.dove}: quello che pensi e quello che dici.`),
      wrong(`${cap(p.idea)}.`, `Quello che hai e costruisci è roba di Denari, che sono la ${p.elemento}. Le Spade sono l'${s.elemento}, cioè ${s.dove}: quello che pensi e quello che dici.`),
      right(`${cap(s.idea)}.`, 'Proprio così: le Spade sono la testa, con tutto quello che ci passa dentro e quello che esce dalla bocca. Per questo tagliano, e io che parlo tanto lo so bene.'),
    ]),
    ...practice(ortica, `Adesso al contrario. Una carta dice ${q(p08.up.essenza)}: di che seme sarà?`, [
      wrong(`Di ${c.nome}, perché riguarda ${c.dove}.`, 'Il cuore qui c\'entra poco, perché si parla di un mestiere imparato giorno per giorno. È una cosa concreta, e le cose concrete sono dei Denari.'),
      right(`Di ${p.nome}, perché riguarda ${p.dove}.`, 'Brava: il mestiere e il lavoro di ogni giorno sono cose concrete, e le cose concrete sono dei Denari. È l\'Otto, per la precisione, ma dei numeri oggi non parliamo.'),
      wrong(`Di ${s.nome}, perché riguarda ${s.dove}.`, 'La mente serve anche lì, ma la carta parla di mani che lavorano ogni giorno. È una cosa concreta, e le cose concrete sono dei Denari.'),
    ]),
    ortica('Per oggi basta, e non lo dico spesso. Quando raccogli una carta piccola guarda per prima cosa il seme: saprai già di che cosa parla, anche se non sai ancora che cosa dice.'),
    ortica('Te l\'ho copiato sul quaderno, in bella. In fondo ci ho messo anche una ricetta per la tosse, ma quella puoi saltarla.'),
    lesson('minors1'),
    diary('Ortica mi ha insegnato i quattro semi delle carte piccole: i Bastoni sono la volontà, le Coppe il cuore, le Spade la mente e i Denari le cose concrete.'),
    xp(10),
    flag('lesson.minors.1'),
  ],

  // ---- 2 of 5: one, two, three (Ginepra in the tall grass, who gets one wrong; while she is held,
  //      the notebook she left there: the same two questions, answered in pencil) ----------------------
  'minors.2.offer': [
    IF(GINEPRA_FREE, [
      IF({ power: 'cat' },
        [cat('(Ginepra è nell\'erba alta vicino al bivacco da stamattina, e mi ha gridato dietro che ha capito una cosa sulle carte piccole. Vuole dirla a qualcuno prima di dimenticarla, e ha scelto te.)')],
        [T('Ginepra è nell\'erba alta vicino al bivacco da stamattina, e dice di aver capito una cosa sulle carte piccole. Vuole dirla a qualcuno prima di dimenticarla.')]),
      diary('Ginepra dice di aver capito i primi tre numeri delle carte piccole. Mi aspetta nell\'erba alta vicino al bivacco, nel bosco.'),
    ], [
      IF({ power: 'cat' },
        [cat('(Nell\'erba alta vicino al bivacco è rimasto il quadernetto di Ginepra, quello dove si segnava le carte piccole. Lei adesso non può venire a riprenderlo, e dentro c\'è qualcosa che ti riguarda.)')],
        [T('Nell\'erba alta vicino al bivacco dev\'essere rimasto il quadernetto di Ginepra, quello dove si segnava le carte piccole. Lei adesso non può venire a riprenderlo.')]),
      diary('Nell\'erba alta vicino al bivacco, nel bosco, è rimasto il quadernetto dove Ginepra si segnava le carte piccole. Vado a prenderlo io.'),
    ]),
    flag('minors.2.offered'),
  ],
  'minors.2.lesson': [
    IF(GINEPRA_FREE, [
      N('Nell\'erba alta vicino al bivacco si vede soltanto un ciuffo di ricci rossi che va avanti e indietro. Poi Ginepra salta fuori, con tre carte in mano e l\'erba nei capelli.'),
      ginepra(`Ho capito una cosa, e te la dico subito, prima che mi scappi! I numeri piccoli sono una storia: l'uno è un ${n(1)}, il due è una ${n(2)}, il tre è una ${n(3)}. Me l'ha detto Ortica, ma l'ho capito io.`),
      ginepra(`Guarda l'Asso di Bastoni: è un inizio nella volontà, e difatti dice ${q(w01.up.essenza)}. L'ho provato su tutti gli Assi che ho, e torna sempre.`),
      ginepra(`E il Tre di Denari è una cosa concreta che cresce, cioè ${q(p03.up.essenza)}. Lo vedi che funziona? Con il due invece ho ancora qualche dubbio.`),
      ...practice(ginepra, 'Adesso il Due di Spade. Due vuol dire coppia, quindi sono due innamorati che si regalano le spade! No? Dalla tua faccia direi di no.', [
        wrong(c02.up.essenza, 'Lo vedi che lo pensi anche tu? Aspetta, no: l\'intesa tra due persone è il Due di Coppe, quello che trovo sempre doppio. Con le Spade le due cose si incontrano in testa, e viene fuori uno stallo.'),
        right(s02.up.essenza, 'Uno stallo, certo! È una coppia anche quella, ma con le Spade le due cose si incontrano in testa: sono due idee, e non sai quale scegliere. Ah ah, altro che innamorati.'),
        wrong(s03.up.essenza, 'Un dolore al cuore, addirittura? No, quello è il Tre, che ha tre spade piantate in un cuore. Nel due le cose si incontrano soltanto: in testa, vuol dire che non sai quale scegliere.'),
      ]),
      ...practice(ginepra, 'L\'ultima la so, giuro: il Tre di Bastoni. Tre è crescita e i Bastoni sono la volontà, quindi... aiutami, che ce l\'ho sulla punta della lingua. Che cosa dice?', [
        wrong(w01.up.essenza, 'La scintilla è l\'Asso, l\'ho detto io un momento fa. Nel tre la cosa è già partita e cresce: uno guarda le sue navi andare lontano, e aspetta i frutti.'),
        wrong(w02.up.essenza, 'Il piano pronto è il Due, quando si deve ancora scegliere se partire. Nel tre si è già partiti, e la cosa cresce: uno guarda le sue navi andare lontano, e aspetta i frutti.'),
        right(w03.up.essenza, 'Ecco, il progetto che cresce! Nel disegno c\'è uno di spalle che guarda le sue navi andare lontano. Lo sapevo, cioè lo stavo per sapere, che per me è quasi uguale.'),
      ]),
      ginepra('Comincia, si incontra, cresce: me lo scrivo sul guanto, così non lo perdo. Gli altri numeri li chiediamo a qualcuna più vecchia, perché io fin qui ci sono arrivata e mi gira già la testa.'),
      diary('Ginepra mi ha spiegato i primi tre numeri delle carte piccole, e una gliel\'ho corretta io: l\'uno è un inizio, il due una coppia, il tre una crescita.'),
    ], [
      N('Nell\'erba alta vicino al bivacco c\'è un quadernetto con la copertina blu, umido di rugiada. È di Ginepra: dentro ha copiato le sue carte piccole, con una calligrafia che corre più della penna.'),
      N(`In cima a una pagina ha scritto, sottolineando due volte: «L'uno è un ${n(1)}, il due è una ${n(2)}, il tre è una ${n(3)}. Me l'ha detto Ortica, ma l'ho capito io.»`),
      N(`Sotto ha fatto due prove. La prima dice «Asso di Bastoni: un inizio nella volontà», e accanto ha copiato dalla carta ${q(w01.up.essenza)}.`),
      N(`La seconda dice «Tre di Denari: una cosa concreta che cresce», e accanto ${q(p03.up.essenza)}. Vicino a tutte e due ha disegnato una stellina, che per lei vuol dire giusto.`),
      ...practice(T, 'Più giù Ginepra ha scritto «Due di Spade: due innamorati che si regalano le spade?», e il punto di domanda l\'ha messo lei. Che cosa le scrivo accanto, a matita?', [
        wrong(c02.up.essenza, 'Comincio a scriverlo e mi fermo, perché l\'intesa tra due persone è il Due di Coppe. Con le Spade le due cose si incontrano in testa: cancello, e scrivo «uno stallo».'),
        right(s02.up.essenza, 'Scrivo «uno stallo», e sotto ci metto il perché: è una coppia anche questa, ma con le Spade le due cose si incontrano in testa. Quando lo leggerà dirà che lo sapeva.'),
        wrong(s03.up.essenza, 'Comincio a scriverlo e mi fermo, perché il dolore al cuore è il Tre, con le sue tre spade piantate. Nel due le cose si incontrano soltanto: cancello, e scrivo «uno stallo».'),
      ]),
      ...practice(T, 'L\'ultima riga è rimasta a metà: «Tre di Bastoni: tre è crescita, i Bastoni sono la volontà, quindi», e poi c\'è soltanto una macchia d\'inchiostro. Come la finisco io?', [
        wrong(w01.up.essenza, 'Ci ripenso subito, perché la scintilla è l\'Asso, e l\'ha già scritto lei due righe più su. Nel tre la cosa è partita e cresce: scrivo che il progetto cresce, e si aspettano i frutti.'),
        wrong(w02.up.essenza, 'Ci ripenso subito, perché il piano pronto è il Due, quando si deve ancora scegliere se partire. Nel tre si è già partiti: scrivo che il progetto cresce, e si aspettano i frutti.'),
        right(w03.up.essenza, 'Scrivo che il progetto cresce, e che nel disegno c\'è uno di spalle che guarda le sue navi andare lontano. Poi ci disegno accanto una stellina, come fa lei.'),
      ]),
      T('Metto il quadernetto in borsa, al riparo dalla rugiada. Glielo ridò io quando l\'avremo tirata fuori, e intanto quello che aveva capito lei l\'ho capito anch\'io.'),
      diary('Ho trovato il quadernetto di Ginepra nell\'erba alta e ho finito io la sua pagina: l\'uno è un inizio, il due una coppia, il tre una crescita.'),
    ]),
    lesson('minors2'),
    xp(10),
    flag('lesson.minors.2'),
  ],

  // ---- 3 of 5: four, five, six (Malva, at her kitchen table) ----------------------------------------
  'minors.3.offer': [
    IF({ power: 'cat' }, [
      cat('(Malva ha visto le carte piccole che ti porti in borsa, e ha detto che le tieni come una che non sa quali scottano. Passa da casa sua quando puoi: ha già messo l\'acqua sul fuoco.)'),
    ], [
      T('Malva ha visto le carte piccole che mi porto in borsa, e dice che le tengo come una che non sa quali scottano. Mi aspetta a casa sua.'),
    ]),
    diary('Malva vuole parlarmi dei numeri di mezzo delle carte piccole: il quattro, il cinque e il sei. Mi aspetta a casa sua, accanto al focolare.'),
    flag('minors.3.offered'),
  ],
  'minors.3.lesson': [
    N('Malva ti fa segno di sederti al tavolo con la tovaglia rossa, lo stesso dove le hai letto la tua prima carta. Davanti al tuo posto c\'è già una tazza che fuma.'),
    malva('Siediti, che in piedi non si impara niente. Ho visto le carte piccole che ti porti in borsa, e le tieni come una che non sa quali scottano.'),
    malva(`I semi e i primi tre numeri li sai già, mi dicono. A me toccano i tre di mezzo, che conosco per mestiere: il quattro è una ${n(4)}, il cinque è una ${n(5)}, il sei è l'${n(6)} che torna.`),
    malva('È come con un osso. Finché uno sta fermo va tutto bene, poi qualcosa si spezza, e poi, se c\'è chi sa fare, si rimette insieme. Di ossa ne ho aggiustate quasi quanti bambini ho fatto nascere.'),
    // the gesture (docs/DESIGN.md "Un solo gesto"): she asks the cards before a small decision of her own
    N('Prima di andare avanti Malva prende il suo mazzo dalla mensola, gira una carta sulla tovaglia e la guarda un momento, con lo scialle già mezzo sulle spalle.'),
    malva(`Il Quattro di Spade, che dice ${q(s04.up.essenza)}. Allora dalla moglie del fabbro ci vado domattina, perché stanotte quel bambino non nasce. Chiedo sempre a loro, prima di uscire al freddo.`),
    malva(`Ti serve anche da esempio, perché è la sosta della mente. Il Cinque di Coppe invece è la scossa nel cuore, e dice ${q(c05.up.essenza)}: quella l'abbiamo avuta in mano tutte.`),
    ...practice(malva, 'Adesso dimmelo tu, e non tirare a indovinare. Il Sei di Denari: che cosa ti aspetti?', [
      wrong(p05.up.essenza, 'Quella è la scossa, cioè il cinque, quando i soldi mancano e uno resta fuori al freddo. Il sei viene dopo: torna l\'equilibrio, e qualcuno dà una mano a chi ne ha bisogno.'),
      right(p06.up.essenza, 'Così va bene: dopo la scossa torna l\'equilibrio, e con i Denari vuol dire che chi ha dà a chi non ha. Nel disegno c\'è uno con la bilancia in mano, e fa bene a tenerla.'),
      wrong(p04.up.essenza, 'Quello è il quattro, uno che sta fermo e si tiene stretto quello che ha. Nel sei invece torna l\'equilibrio, e con i Denari vuol dire che chi ha dà a chi non ha.'),
    ]),
    ...practice(malva, 'E il Cinque di Bastoni? Pensa a che cosa si rompe, quando di mezzo c\'è la volontà di più persone.', [
      right(w05.up.essenza, 'Proprio quello: cinque teste dure nella stessa stanza, e ognuna spinge dalla sua parte. Vieni con me a un parto con tre suocere, se vuoi vederlo dal vero.'),
      wrong(w04.up.essenza, 'La festa è il quattro, quando ci si ferma contenti di un lavoro finito. Nel cinque quella pace si rompe: ognuno vuole fare a modo suo, e ci si scontra.'),
      wrong(w06.up.essenza, 'La vittoria è il sei, quando le cose si sono già rimesse a posto. Prima viene il cinque, che è lo scontro: ognuno vuole fare a modo suo, e nessuno ascolta.'),
    ]),
    malva('Fermo, rotto e aggiustato: tienilo a mente così, che è più facile. E adesso finisci la tisana, che l\'ho fatta per te, e non la faccio per tutti.'),
    lesson('minors3'),
    diary('Malva mi ha insegnato i numeri di mezzo delle carte piccole: il quattro è una sosta, il cinque una scossa, il sei l\'armonia che torna.'),
    xp(10),
    flag('lesson.minors.3'),
  ],

  // ---- 4 of 5: from seven to ten (Ortica, walking from her hut to the mill) -------------------------
  'minors.4.offer': [
    IF({ power: 'cat' }, [
      cat('(Il merlo di Ortica è tornato, e stavolta è stato breve, per quanto può esserlo un merlo. Lei vuole fare due passi con te fino al mulino, perché dice che i numeri alti si imparano camminando.)'),
    ], [
      T('Ortica mi ha mandato a dire che vuole fare due passi con me fino al mulino, perché i numeri alti delle carte piccole si imparano camminando.'),
    ]),
    diary('Ortica vuole spiegarmi i numeri dal sette al dieci facendo due passi fino al mulino. Mi aspetta alla sua capanna, nel bosco.'),
    flag('minors.4.offered'),
  ],
  'minors.4.lesson': [
    ortica('Brava che sei venuta, perché oggi non si sta sedute. I numeri dal sette al dieci sono l\'ultimo pezzo di una strada, e una strada si capisce soltanto facendola: andiamo al mulino.'),
    N('Ortica si avvia sul sentiero senza smettere di parlare, e tu le vai dietro. Al primo bivio si ferma di colpo, guarda a destra e a sinistra, e ci pensa su.'),
    ortica(`Questo è il sette, in cui ${head(7)}: uno ha fatto un bel pezzo di strada, e si domanda se è quella giusta. Il Sette di Denari dice proprio ${q(p07.up.essenza)}.`),
    // the gesture: at the fork she draws a card to choose the way, and goes where it says
    N('Per scegliere la strada Ortica non tira a indovinare: infila la mano nella tasca del grembiule e ne tira fuori una carta, senza guardarla prima.'),
    ortica(`È l'Otto di Bastoni, e dice ${q(w08.up.essenza)}. Allora si scende di qua, e di buon passo: io al bivio chiedo sempre a loro, anche soltanto per andare al mulino.`),
    N('Dopo il bivio il sentiero scende, e Ortica scende con lui, a passi così svelti che per starle dietro devi quasi correre.'),
    ortica(`Questo è l'otto, in cui ${head(8)}, e ce l'hai sotto i piedi. Nel disegno della carta ci sono soltanto otto bastoni che volano, senza nessuno che li tenga.`),
    N('In fondo alla discesa, tra gli alberi, si vede già la ruota del mulino. Ortica rallenta, e per la prima volta da quando siete partite ha il fiato corto.'),
    ortica(`Qui siamo al nove, in cui ${head(9)}: si vede l'arrivo, e le gambe pesano. Il dieci è quando ci arrivi e ${head(10)}, con tutto il bene o tutto il peso che ti sei portata dietro.`),
    ...practice(ortica, 'Adesso che abbiamo il fiato corto tutte e due, dimmi del Dieci di Coppe. Che cosa ti aspetti?', [
      wrong(c07.up.essenza, 'Quello è il sette, quando ci si ferma davanti a troppe coppe e non se ne sceglie nessuna. Il dieci è l\'arrivo: tutto il bene del cuore, cioè una famiglia in armonia.'),
      right(c10.up.essenza, 'Proprio quella: il cuore che arriva in fondo alla strada con tutto il bene che ha raccolto. Nel disegno c\'è un arcobaleno di coppe sopra una famiglia, e due bambini che ballano.'),
      wrong(c08.up.essenza, 'Quello è l\'otto, uno che si mette in cammino e lascia le coppe dietro di sé. Il dieci è l\'arrivo: tutto il bene del cuore, cioè una famiglia in armonia.'),
    ]),
    ...practice(ortica, 'E il Sette di Bastoni? Ricordati del bivio, e di che cosa succede quando uno si ferma e gli altri gli vengono addosso.', [
      wrong(w10.up.essenza, 'Il carico pesante è il dieci, quando la strada è finita e uno si porta addosso tutto. Nel sette ci si ferma, e con i Bastoni vuol dire piantare i piedi e difendere il proprio posto.'),
      wrong(w08.up.essenza, 'Quello è l\'otto, la discesa di poco fa, quando tutto corre. Nel sette ci si ferma, e con i Bastoni vuol dire piantare i piedi e difendere il proprio posto.'),
      right(w07.up.essenza, 'Brava: uno si è fermato sul suo pezzo di strada, e lo difende da quelli che salgono. È una prova anche quella, e chi la supera riparte più sicuro.'),
    ]),
    travel('forest.mill'),
    N('Siete arrivate al mulino. La ruota gira, non si capisce bene da che parte, e Ortica si siede sul muretto a riprendere fiato.'),
    ortica('Ti fermi a guardare, corri, quasi ci sei, e arrivi: dal sette al dieci è tutto qui. Io torno indietro piano, che al ritorno la strada la racconto al contrario e mi diverto di più.'),
    lesson('minors4'),
    diary('Ortica mi ha insegnato i numeri alti camminando fino al mulino: al sette ci si ferma a valutare, all\'otto ci si muove, al nove si è quasi in fondo, al dieci si arriva.'),
    xp(10),
    flag('lesson.minors.4'),
  ],

  // ---- 5 of 5: the court (Edera, who knows them as people) -----------------------------------------
  'minors.5.offer': [
    IF({ power: 'cat' }, [
      cat('(Nonna Edera vuole parlarti delle figure, quelle con la corona e quelle a cavallo. Dice che in un mazzo sono le più facili da riconoscere e le più difficili da capire, come certa gente.)'),
    ], [
      T('Nonna Edera vuole parlarmi delle figure delle carte piccole, quelle con la corona e quelle a cavallo. Mi aspetta nella sua nicchia.'),
    ]),
    diary('Nonna Edera vuole parlarmi delle figure delle carte piccole. Mi aspetta nella sua nicchia, in fondo alle cantine.'),
    flag('minors.5.offered'),
  ],
  'minors.5.lesson': [
    edera('Vieni, cara, siediti. Oggi ti presento della gente: in ogni seme ci sono quattro figure, e io le conosco da così tanto tempo che le saluto per nome, cosa che con i vivi non mi riesce più.'),
    edera(`Le altre carte dicono che cosa succede, mentre le figure dicono chi c'è. Il Fante è ${f(11)}, il Cavaliere ${f(12)}, la Regina ${f(13)} e il Re ${f(14)}: a volte sono una persona vera, a volte un modo di fare.`),
    edera(`Il Fante di Coppe è ${f(11)} nel cuore, e dice ${q(c11.up.essenza)}. Somiglia a te la prima volta che sei scesa quaggiù, con la faccia di chi non sa ancora dove mettere le mani.`),
    edera(`Il Re di Spade è ${f(14)} con la mente, e dice ${q(s14.up.essenza)}. Conosciamo tutte e due un signore che vorrebbe somigliargli, e che della carta ha preso soltanto la sedia.`),
    ...practice(edera, 'Adesso dimmelo tu: chi è la Regina di Denari? Secondo me la conosci di persona.', [
      wrong(p12.up.essenza, `Quello è il Cavaliere, cara, che va piano ma va. La Regina non va da nessuna parte: è ${f(13)}, e con i Denari custodisce la casa e chi ci entra.`),
      wrong(p14.up.essenza, `Quello è il Re, che governa le cose da fuori e si fa vedere. La Regina è ${f(13)}, e lo fa da dentro, senza rumore: tiene la casa, e ha cura di chi ci entra.`),
      right(p13.up.essenza, 'È lei, e somiglia a una levatrice che non ringrazia mai, il cui nome adesso mi sfugge. Custodisce la casa e quelli che ci entrano, e non lo fa pesare a nessuno.'),
    ]),
    ...practice(edera, 'E il Cavaliere di Bastoni, chi sarà mai? Pensa a una ragazza coi ricci rossi, se ti aiuta.', [
      right(w12.up.essenza, 'Proprio lei, o proprio lui, come preferisci. Va di corsa dove lo porta la passione, e a fermarsi a pensare ci arriva sempre dopo: bisogna volergli bene, e tenergli pronto un letto.'),
      wrong(w11.up.essenza, `Quello è il Fante, che impara e porta le notizie. Il Cavaliere non ha tempo di imparare, cara: è ${f(12)}, e con i Bastoni va di corsa, spinto dalla passione.`),
      wrong(w13.up.essenza, `Quella è la Regina, che il fuoco lo custodisce e lo tiene acceso per gli altri. Il Cavaliere invece è ${f(12)}, e con i Bastoni va di corsa, spinto dalla passione.`),
    ]),
    edera('Adesso le carte piccole le sai leggere tutte: guardi il seme, poi il numero o la figura, e soltanto dopo il disegno. Ci hai messo meno di me, che in ogni figura cercavo un marito.'),
    lesson('minors5'),
    diary('Nonna Edera mi ha presentato le figure delle carte piccole: il Fante è chi impara, il Cavaliere chi va, la Regina chi custodisce, il Re chi governa.'),
    xp(10),
    flag('lesson.minors.5'),
    flag('lesson.minors'), // the whole course: the reversed cards wait for this
  ],

  // ---- the lesson on reversed cards ------------------------------------------------------------
  'reversed.offer': [
    IF({ power: 'cat' }, [
      cat('(Nonna Edera ha chiesto di te. Per la verità ha chiesto di una certa Rosalba, ma ho capito lo stesso, perché di ragazze con un gatto come me ce n\'è una sola.)'),
      cat('(Dice che sulle carte c\'è una cosa che Malva ti ha fatto saltare, e che adesso hai le mani per impararla. Ti aspetta nella sua nicchia, in fondo alle cantine.)'),
    ], [
      T('Nonna Edera mi ha mandato a dire che sulle carte c\'è una cosa che Malva mi ha fatto saltare. Mi aspetta nella sua nicchia, in fondo alle cantine.'),
    ]),
    diary('Nonna Edera vuole insegnarmi le carte capovolte. Mi aspetta nella sua nicchia, in fondo alle cantine.'),
    flag('reversed.offered'),
  ],
  'reversed.lesson': [
    IF({ flag: 'edera.rosalba' },
      [edera('Rosalba, cara, siediti qui vicino alla candela. Ti ho fatta chiamare per le carte che escono a testa in giù, perché ormai hai le mani pronte anche per quelle.')],
      [edera('Siediti qui vicino alla candela, cara, e non dirmi il tuo nome, che voglio provare a ricordarlo da sola. Ti ho fatta chiamare per le carte che escono a testa in giù.')]),
    edera('Malva ti avrà detto di raddrizzarle e di non pensarci, e per una novizia è il consiglio giusto. Ma una carta capovolta ha qualcosa da dire, e sarebbe un peccato non starla a sentire.'),
    edera('Molte credono che capovolta voglia dire il contrario, e non è così. È la stessa carta e parla della stessa cosa, che però fatica a uscire: è trattenuta, oppure arriva in ritardo, oppure resta chiusa dentro.'),
    edera('Qualche volta succede l\'inverso, e allora ce n\'è troppa. In tutti i casi la domanda da farsi è una sola: che cosa impedisce a questa carta di stare dritta?'),
    edera(`Prendi il Diavolo, che abita qui vicino, alle catene. Dritto dice ${q(m15.up.essenza)}. Capovolto parla ancora di catene, ma dice ${q(m15.rev.essenza)}.`),
    edera('Lo vedi che non è diventato un angelo? È rimasto il Diavolo, con le sue catene, soltanto che la presa è più debole: per questo una carta dura, quando si gira, porta un sollievo.'),
    edera(`Con le carte liete bisogna stare più attente. Il Sole dritto dice ${q(m19.up.essenza)}. Capovolto non diventa buio: dice ${q(m19.rev.essenza)}.`),
    edera('La gioia c\'è ancora, vedi, ma chi ha la carta davanti fa fatica a godersela. Avevo un cugino così, di cui mi sfugge il nome: aveva il sole in casa tutto il giorno, e teneva le imposte chiuse.'),
    edera('Adesso prova a dirmelo tu, con calma, che qui sotto il tempo non manca a nessuna.'),
    ...practice(edera, `Il Dieci di Spade, dritto, dice ${q(s10.up.essenza)}. Se ti esce capovolto, che cosa ti aspetti?`, [
      wrong(c10.up.essenza, 'Quello sarebbe il contrario, cara, ed è lo sbaglio che abbiamo fatto tutte. Il fondo c\'è stato davvero: la carta capovolta dice soltanto che da lì ci si sta rialzando.'),
      right(s10.rev.essenza, 'Brava, cara: il fondo è lo stesso di prima, ma la carta capovolta guarda già verso l\'alto. Ci si sta rialzando, e il peggio è alle spalle.'),
      wrong(w05.up.essenza, 'Quella è un\'altra carta, cara, con dentro altra gente che litiga. Resta sul Dieci di Spade: il fondo è lo stesso, e capovolta dice che ci si sta rialzando.'),
    ]),
    ...practice(edera, `E il Tre di Coppe, che dritto dice ${q(c03.up.essenza)}? Dimmi che cosa diventa quando si capovolge.`, [
      wrong(s03.up.essenza, 'Hai cercato il contrario della festa e hai trovato il Tre di Spade, che è tutta un\'altra carta. Il Tre di Coppe capovolto resta una festa: soltanto che esagera, e qualcuno resta fuori.'),
      wrong(p12.rev.essenza, 'Quello è un Cavaliere che si è impuntato, cara, e alla festa non l\'hanno nemmeno invitato. Il Tre di Coppe capovolto resta una festa: soltanto che esagera, e qualcuno resta fuori.'),
      right(c03.rev.essenza, 'È proprio così: la festa c\'è ancora, ma è diventata troppa, e a un certo punto qualcuna si ritrova in un angolo con il bicchiere vuoto.'),
    ]),
    edera('D\'ora in poi, quando mescoli, lascia che qualcuna si giri da sola, e non raddrizzarla. Chi viene a farsi leggere le carte porta anche cose trattenute e cose in ritardo, e le capovolte servono a dar loro un nome.'),
    edera('Te l\'ho scritto sul quaderno, con la mia mano di una volta. Se un giorno te ne dimentichi guarda lì, perché io nel frattempo avrò dimenticato di avertelo detto.'),
    lesson('reversed'),
    diary('Nonna Edera mi ha insegnato le carte capovolte: dicono la stessa cosa di quelle dritte, ma trattenuta, in ritardo, chiusa dentro oppure in eccesso.'),
    xp(10),
    flag('lesson.reversed'),
  ],
};
