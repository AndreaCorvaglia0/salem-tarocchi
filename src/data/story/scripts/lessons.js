// The three lessons added on 16 Nov (docs/DESIGN.md "La lezione di volo", "I Minori"), each with the
// short line that announces it (played by glue/lessons.js when the lesson becomes available):
//   fly.offer -> fly.lesson          Malva, in the kitchen garden behind her house: the broom
//   minors.offer -> minors.lesson    Ortica, at her hut: a small card is a suit and a number
//   reversed.offer -> reversed.lesson  Edera, in her nook: a reversed card says the same thing, held back
// The words of the grid come from data/reading/grid.js and the meanings from the cards' voices
// (data/reading/voices): nothing of them is retyped here. A practice question is an ordinary choice whose
// right option carries `ok: true`; a wrong one gets the correction, and the lesson goes on.
import { N, T, malva, ortica, edera, cat, o, choice, IF, xp, flag, diary, travel, lesson } from '../h.js';
import { SEMI, NUMERI, FIGURE } from '../../reading/grid.js';
import c02 from '../../reading/voices/c02.js';
import c03 from '../../reading/voices/c03.js';
import c05 from '../../reading/voices/c05.js';
import c10 from '../../reading/voices/c10.js';
import c13 from '../../reading/voices/c13.js';
import m15 from '../../reading/voices/m15.js';
import m19 from '../../reading/voices/m19.js';
import p04 from '../../reading/voices/p04.js';
import p07 from '../../reading/voices/p07.js';
import p12 from '../../reading/voices/p12.js';
import p13 from '../../reading/voices/p13.js';
import s01 from '../../reading/voices/s01.js';
import s03 from '../../reading/voices/s03.js';
import s10 from '../../reading/voices/s10.js';
import s12 from '../../reading/voices/s12.js';
import w01 from '../../reading/voices/w01.js';
import w05 from '../../reading/voices/w05.js';
import w10 from '../../reading/voices/w10.js';
import w12 from '../../reading/voices/w12.js';

// what a number does, in a few words: the part of its idea before the examples ("qualcosa si rompe")
export const head = (n) => NUMERI[n].idea.split(/[:,]/)[0];
// a card's meaning quoted inside a sentence: «Una perdita, e il rimpianto»
const q = (essenza) => `«${essenza.replace(/\.$/, '')}»`;
const { w, c, s, p } = SEMI;

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

  // ---- the lesson on the Minors: number × suit -------------------------------------------------
  'minors.offer': [
    IF({ power: 'cat' }, [
      cat('(Ho incontrato il merlo di Ortica, e mi ha tenuto lì mezz\'ora per dirmi una cosa sola. Lei ti aspetta alla capanna: dice che le carte piccole le raccogli a manciate, e poi non sai da che parte guardarle.)'),
      cat('(Io ci andrei. Sono cinquantasei, e a impararle una per una si fa notte: se lei conosce un modo più svelto, per una volta vale la pena di lasciarla parlare.)'),
    ], [
      T('Ortica mi ha mandato a dire che le carte piccole le raccolgo a manciate e poi non so da che parte guardarle. Ha ragione, e mi aspetta alla sua capanna.'),
    ]),
    diary('Ortica vuole spiegarmi come si leggono le carte piccole. Mi aspetta alla sua capanna, nel bosco.'),
    flag('minors.offered'),
  ],
  'minors.lesson': [
    ortica('Eccoti, era ora! Il merlo dice che raccogli le carte piccole nell\'erba e poi le guardi come una lettera scritta in un\'altra lingua. Non offenderti, che all\'inizio lo facevo anch\'io.'),
    ortica('Sono cinquantasei, e a memoria non le impara nessuna, nemmeno Edera che si ricorda tutto. Per fortuna non serve, perché ogni carta piccola è fatta di due pezzi: un seme e un numero.'),
    ortica('Hai presente il tavolo del Mago, con sopra una coppa, una spada, un bastone e una moneta? Sono i quattro semi, e io li tengo sulla mensola, tra il sale e la camomilla.'),
    ortica(`Il seme dice dove succede la cosa. I Bastoni sono ${w.dove}, le Coppe ${c.dove}, le Spade ${s.dove}, e i Denari ${p.dove}, cioè il lavoro, i soldi e la casa.`),
    ortica(`Il numero invece dice che cosa succede lì, ed è uguale in tutti e quattro i semi. Con l'Asso ${head(1)}, col Cinque ${head(5)}, col Dieci ${head(10)}; gli altri te li scrivo, che a dirli divago.`),
    ortica(`Prendi il Cinque di Coppe. Cinque vuol dire che ${head(5)}, e le Coppe sono ${c.dove}: una cosa che si rompe nel cuore è una perdita, e infatti la carta dice ${q(c05.up.essenza)}.`),
    ortica('Nel disegno c\'è uno col mantello nero che fissa tre coppe rovesciate, e non si volta verso le due rimaste in piedi. Il mugnaio fa uguale quando gli si spacca una macina, e sua moglie glielo dice sempre.'),
    ortica(`Adesso l'Asso di Bastoni. L'Asso è il numero in cui ${head(1)}, e i Bastoni sono ${w.dove}: è una voglia di fare che si accende, e difatti la carta dice ${q(w01.up.essenza)}.`),
    ortica(`Restano le figure, che sono quattro per seme. Loro non dicono che cosa succede ma chi c'è: il Fante è ${FIGURE[11].parola}, il Cavaliere ${FIGURE[12].parola}, la Regina ${FIGURE[13].parola} e il Re ${FIGURE[14].parola}.`),
    ortica(`La Regina di Denari, per dire, è ${FIGURE[13].parola} ${p.dove}: la carta dice ${q(p13.up.essenza)}. Somiglia a Malva in modo impressionante, ma non andare a dirle che l'ho detto io.`),
    ortica('Adesso prova tu, prima che a forza di ascoltarmi ti si chiudano gli occhi. Ti dico tre carte, e per ognuna mi dici che cosa ti aspetti, senza nemmeno guardare il disegno.'),
    ...practice(ortica, `Sette di Denari. Il Sette è il numero in cui ${head(7)}, e i Denari li conosci già: che cosa ti aspetti?`, [
      wrong(c03.up.essenza, 'Quella è una festa, e le feste stanno nelle Coppe, sotto il numero tre. Il Sette di Denari è più paziente: il lavoro è fatto, e bisogna aspettare che il raccolto maturi.'),
      right(p07.up.essenza, 'Proprio così: il lavoro è fatto, e adesso ci si ferma a guardare se il raccolto viene su. Nel disegno c\'è un contadino appoggiato alla zappa, che fissa la sua pianta come il mugnaio fissa la ruota.'),
      wrong(s12.up.essenza, 'Quello che va dritto e veloce è un Cavaliere, e qui di figure non ce ne sono. Il Sette di Denari sta fermo: ha lavorato, e adesso aspetta che il raccolto maturi.'),
    ]),
    ...practice(ortica, `Adesso il Due di Coppe. Il Due è il numero in cui ${head(2)}, e le Coppe sono ${c.dove}: che cosa ti aspetti?`, [
      right(c02.up.essenza, 'Brava: sono due persone che si vengono incontro alla pari, ognuna con la sua coppa in mano. È la carta che Ginepra trova sempre doppia, e non ha ancora capito che cosa vogliano dirle.'),
      wrong(w10.up.essenza, 'Quello è un carico, e i carichi sono roba di Bastoni, al numero dieci. Qui ci sono soltanto due persone che si incontrano col cuore, e ne viene un\'intesa alla pari.'),
      wrong(s01.up.essenza, 'Un\'idea chiara è faccenda di Spade, cioè di testa, e sta sotto l\'Asso. Qui c\'entra il cuore, e le cose che si incontrano sono due persone: ne viene un\'intesa alla pari.'),
    ]),
    ...practice(ortica, 'L\'ultima è una figura, e stavolta non ti aiuto: il Cavaliere di Bastoni. Che cosa ti aspetti?', [
      wrong(p04.up.essenza, `Chi tiene stretto sta fermo, ed è faccenda di Denari, al numero quattro. Il Cavaliere invece è ${FIGURE[12].parola}, e con i Bastoni va di corsa, spinto dalla passione.`),
      wrong(c13.up.essenza, `Quella è la Regina di Coppe, che ascolta e ha cura degli altri. Il Cavaliere invece è ${FIGURE[12].parola}, e i Bastoni sono ${w.dove}: va di corsa, spinto dalla passione.`),
      right(w12.up.essenza, 'Proprio lui: uno che va, spinto dalla volontà, e non ci pensa due volte. Somiglia a Ginepra quando ha visto una carta nell\'erba, e guai a chi si trova in mezzo.'),
    ]),
    ortica('Lo vedi che non c\'è bisogno di impararle a memoria? Con tutte le altre si fa uguale: guardi il seme, guardi il numero, e soltanto dopo guardi il disegno per vedere se avevi ragione.'),
    ortica('La tabella te l\'ho copiata sul quaderno, in bella, con tutti e dieci i numeri. In fondo ci ho messo anche una ricetta per la tosse, ma quella puoi saltarla.'),
    lesson('minors'),
    diary('Ortica mi ha insegnato a leggere le carte piccole: il seme dice dove succede una cosa, il numero che cosa succede, e le figure dicono chi c\'è.'),
    xp(10),
    flag('lesson.minors'),
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
