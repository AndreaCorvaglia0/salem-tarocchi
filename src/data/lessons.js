// The lessons of the mistresses (deck, single, ppf, celtic, suits, astro, and those added on 16 Nov: the
// course on the Minors in five lessons, minors1..minors5, and reversed), each a few short pages.
// A page may show a spread (`spread`) or some cards (`cards`). Italian. These are pages to study from,
// so the register is the handbook's: plain paragraphs of whole, linked sentences (docs/WRITING.md),
// with a touch of the voice of who teaches: Malva brisk and practical, Ortica talkative, Edera slow,
// kind and bad with names.
// The grid of the Minors (four suits, ten numbers, four court ranks) is written out from
// data/reading/grid.js, one line each, so the page and the reading engine never disagree.
import { SEMI, NUMERI, FIGURE } from './reading/grid.js';

const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const NOMI = ['Asso', 'Due', 'Tre', 'Quattro', 'Cinque', 'Sei', 'Sette', 'Otto', 'Nove', 'Dieci'];
// "Coppe, l'acqua: il cuore. Quello che senti: affetti, legami, desideri."
const ART = { fuoco: 'il fuoco', acqua: "l'acqua", aria: "l'aria", terra: 'la terra' };
const semi = ['w', 'c', 's', 'p'].map((k) => `${SEMI[k].nome}, ${ART[SEMI[k].elemento]}: ${SEMI[k].dove}. ${cap(SEMI[k].idea)}.`).join('\n');
// "Cinque, scossa: qualcosa si rompe;" (one line per number of a lesson, a single sentence)
const numeri = (from, to) => `${NOMI.slice(from - 1, to).map((n, i) => `${n}, ${NUMERI[from + i].parola}: ${NUMERI[from + i].idea.split(/[:,]/)[0]}`).join(';\n')}.`;
// "Regina: chi custodisce. La padronanza dentro: cura, sensibilità, maturità."
const figure = [11, 12, 13, 14].map((n) => `${FIGURE[n].nome}: ${FIGURE[n].parola}. ${cap(FIGURE[n].idea)}.`).join('\n');

export const LESSONS = [
  {
    id: 'deck', title: 'Il mazzo', by: 'malva',
    pages: [
      { h: 'Settantotto carte', body: "Un mazzo di tarocchi ha settantotto carte, e non c'è bisogno di farsi venire il mal di testa, perché si dividono in due gruppi. Ventidue sono gli Arcani Maggiori, che raccontano i grandi passaggi della vita, come un inizio, un amore o una fine. Le altre cinquantasei sono gli Arcani Minori e parlano dei giorni qualunque, che poi sono quelli in cui si vive davvero.", cards: ['m00', 'm13', 'm19'] },
      { h: 'Quattro semi', body: "I Minori si dividono in quattro semi: Bastoni, Coppe, Spade e Denari. Ogni seme ha quattordici carte: si comincia dall'Asso, si va avanti dal Due al Dieci, e si finisce con quattro figure, che sono il Fante, il Cavaliere, la Regina e il Re. Contale una volta con calma, e vedrai che non ci vuole molto a ricordarle." },
      { h: 'Prima guarda', body: "Prima di cercare che cosa significa una carta, guardala. Chiediti chi c'è nel disegno, da che parte guarda, che tempo fa, e soprattutto che cosa ti colpisce per primo. Quello che noti è già una risposta, e di solito è la tua: per questo i libri vengono dopo, quando hai già un'idea con cui confrontarli.", cards: ['m02'] },
      { h: 'Le capovolte', body: "Quando una carta esce capovolta non è una disgrazia. Di solito vuol dire la stessa cosa della carta dritta, ma bloccata, oppure in dose sbagliata: troppa o troppo poca. Se all'inizio ti confonde puoi anche non tenerne conto, perché c'è chi legge benissimo usando soltanto il dritto. Per adesso fai così anche tu." },
    ],
  },
  {
    id: 'single', title: 'La carta singola', by: 'malva',
    pages: [
      { h: 'Una carta, una risposta', body: "La stesa più semplice è fatta di una carta sola. Serve per orientarsi nella giornata, per rispondere a una domanda semplice, o per capire da dove cominciare quando una faccenda è ingarbugliata. Ha un limite, e conviene saperlo subito: se la domanda è lunga come un romanzo una carta non basta, e bisogna passare a una stesa più grande.", spread: 'single' },
      { h: 'Come si fa', body: "Pensa alla domanda, mescola il mazzo e pesca una carta, poi mettila in mezzo al tavolo. Guarda prima che cosa vedi, e soltanto dopo ricordati che cosa significa. Tieni presente che la carta non decide niente al posto tuo: funziona come uno specchio, cioè ti mostra le cose come stanno, senza mentire e senza consolare." },
      { h: 'Cosa dire a chi chiede', body: "A chi ti chiede una lettura devi dire tre cose, in quest'ordine: che cosa vedi nella carta, che cosa vuol dire, e che cosa può farne lei. Bastano poche frasi, e non devono mai suonare come una sentenza, quindi niente «ti succederà». Chi si alza dal tuo tavolo deve portarsi via una cosa da fare, e non una paura in più.", cards: ['m03'] },
    ],
  },
  {
    id: 'ppf', title: 'Passato, presente, futuro', by: 'ortica',
    pages: [
      { h: 'Tre carte, una storia', body: "Finalmente sei arrivata: ti aspettavo, e nel frattempo ho rimesso a posto la capanna, che era in uno stato che non ti dico. Veniamo a noi. Questa stesa ha tre carte, messe in fila da sinistra a destra: la prima è il passato, cioè da dove viene la faccenda; la seconda è il presente, cioè dove ti trovi adesso; la terza è il futuro, cioè dove stai andando.", spread: 'ppf' },
      { h: 'Il filo', body: "La cosa più importante è non leggerle una per una, come si guardano i pesci sul banco del mercato, ma tutte e tre insieme. Chiediti se si somigliano: se hanno lo stesso colore, la stessa figura, lo stesso seme, o se guardano dalla stessa parte. Quello che le lega è il filo della storia, e chi lo trova ha già fatto mezza lettura. A me l'ha insegnato la moglie del mugnaio, che l'aveva saputo da sua sorella." },
      { h: 'Il futuro non è una sentenza', body: "Adesso ascoltami bene, perché questa è la parte che conta: il futuro non è già scritto. La terza carta mostra soltanto dove arrivi se continui per la stessa strada. Quando non ti piace, torna a guardare la prima e la seconda, perché è lì che si può ancora cambiare qualcosa. E ricordati di non spaventare mai chi ti sta davanti, per nessun motivo." },
    ],
  },
  {
    id: 'celtic', title: 'La croce celtica', by: 'edera',
    pages: [
      { h: 'Dieci carte', body: "Oh, sei tu, cara. Dimmi come ti chiami; anzi no, lascia stare, perché tanto lo dimenticherei di nuovo. La croce celtica invece la ricordo benissimo, ed è curioso. È una stesa di dieci carte: sei formano una croce, a sinistra, e quattro una colonna, a destra. Si posano sempre nello stesso ordine, a cominciare dalla prima, che va al centro.", spread: 'celtic' },
      { h: 'Il cuore: 1 e 2', body: "La prima carta dice dove ti trovi adesso. La seconda si posa di traverso sopra la prima, e mostra che cosa ti attraversa: a volte è un ostacolo e a volte un aiuto, e dipende molto da come la guardi. Queste due vanno lette come una coppia, perché insieme sono il cuore della stesa, e tutte le altre carte girano intorno a loro." },
      { h: 'Attorno: 3, 4, 5, 6', body: "Intorno al centro si posano quattro carte, come una piccola ruota. La terza va sotto e mostra le fondamenta, cioè il punto da cui viene tutto il resto. La quarta va a sinistra, ed è il passato recente, che si sta allontanando. La quinta va sopra, ed è quello che può nascere. La sesta va a destra, ed è il futuro prossimo, cioè quello che sta arrivando." },
      { h: 'La colonna: 7, 8, 9, 10', body: "Poi viene la colonna a destra, che si posa dal basso verso l'alto. La settima carta sei tu, come sei in questo momento, e l'ottava è l'ambiente, cioè le persone che hai intorno. La nona raccoglie le speranze e le paure, che molto spesso sono la stessa cosa vista da due lati. La decima è l'esito, cioè dove porta il cammino se non lo cambi, e la lettura si chiude sempre con lei." },
    ],
  },
  {
    id: 'suits', title: 'Semi ed elementi', by: 'malva',
    pages: [
      { h: 'Quattro semi, quattro elementi', body: "Ogni seme corrisponde a un elemento e a una parte della vita. I Bastoni sono il fuoco, cioè la volontà e la voglia di fare. Le Coppe sono l'acqua, cioè il cuore e i sentimenti. Le Spade sono l'aria, cioè la testa e le parole. I Denari sono la terra, cioè le cose concrete, come il lavoro, la casa e i soldi. Imparali a memoria: quando una carta ti confonde basta chiedersi di che seme è, e metà del lavoro è fatta." },
      { h: 'Semi e segni', body: "Ogni seme ha anche tre segni dello zodiaco, che sono quelli del suo elemento. Ai Bastoni vanno l'Ariete, il Leone e il Sagittario; alle Coppe il Cancro, lo Scorpione e i Pesci; alle Spade i Gemelli, la Bilancia e l'Acquario; ai Denari il Toro, la Vergine e il Capricorno. In questo modo il tuo segno ti dice anche qual è il seme che ti è più vicino." },
      { h: 'I numeri', body: "Anche i numeri hanno un senso, che è lo stesso in tutti e quattro i semi. L'Asso è l'inizio, il Due è una scelta, il Tre una crescita e il Quattro una base solida. Con il Cinque arriva una crisi, con il Sei una tregua e con il Sette una prova. L'Otto è movimento, il Nove è l'ultimo tratto prima dell'arrivo, e il Dieci chiude il giro. Prendila come una traccia per orientarti, più che come una regola fissa." },
      { h: 'Le figure', body: "Restano le quattro figure. Il Fante porta un messaggio, oppure è qualcuno che sta ancora imparando. Il Cavaliere si muove, perché ha una direzione e un po' di fretta. La Regina conosce a fondo il suo seme e lo tiene dentro di sé, mentre il Re lo esercita fuori, sugli altri. In una lettura possono essere persone vere, oppure modi diversi di stare in una situazione." },
    ],
  },
  {
    id: 'astro', title: 'Pianeti, segni, elementi', by: 'edera',
    pages: [
      { h: 'Il cielo nelle carte', body: "Ah, il cielo. Gli Arcani Maggiori sono legati al cielo da una tradizione antica, messa in ordine nell'Ottocento da una società segreta che si chiamava Golden Dawn: a ogni carta corrisponde un pianeta, un segno oppure un elemento. Il tuo nome non lo ricordo più, cara, ma questo sì: serve soprattutto a fissare le carte nella memoria. Se sai che il Mago è Mercurio, per esempio, conosci già mezzo Mago." },
      { h: 'I sette pianeti', body: "Sette carte hanno un pianeta. Il Mago è Mercurio, che governa la mente e le parole. La Sacerdotessa è la Luna, cioè l'intuito, e l'Imperatrice è Venere, cioè l'amore e il piacere. La Ruota è Giove, che porta espansione e fortuna, mentre la Torre è Marte, che porta azione e scontro. Il Sole è il Sole, naturalmente, e vuol dire vita. Il Mondo è Saturno, che dà i limiti e porta le cose a compimento.", cards: ['m01', 'm02', 'm03', 'm10', 'm16', 'm19', 'm21'] },
      { h: 'I dodici segni', body: "Dodici carte hanno un segno, e per ricordarle basta seguire l'ordine dell'anno, dalla primavera all'inverno. L'Imperatore è l'Ariete, il Papa il Toro, gli Amanti i Gemelli, il Carro il Cancro, la Forza il Leone e l'Eremita la Vergine. Allo stesso modo la Giustizia è la Bilancia, la Morte lo Scorpione, la Temperanza il Sagittario, il Diavolo il Capricorno, la Stella l'Acquario e la Luna i Pesci.", cards: ['m04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm11', 'm13', 'm14', 'm15', 'm17', 'm18'] },
      { h: 'I tre elementi', body: "Restano tre carte, e a ciascuna corrisponde un elemento: il Matto è l'Aria, l'Appeso è l'Acqua e il Giudizio è il Fuoco. La Terra non ha una carta sua tra i Maggiori, e la ritrovi nel seme dei Denari. Quanto alla tua carta di nascita, è semplicemente quella del tuo segno: questa, almeno, ricordala tu al posto mio.", cards: ['m00', 'm12', 'm20'] },
    ],
  },
  {
    id: 'minors1', title: 'I quattro semi', by: 'ortica',
    pages: [
      { h: 'Dove succede', body: `Le carte piccole sono cinquantasei, e a memoria non le impara nessuna. Si comincia dal seme, perché ti dice di quale parte della vita parla la carta.\n\n${semi}` },
      { h: 'Due Assi', body: "Per vedere che cosa fa il seme, metti vicine due carte con lo stesso numero. L'Asso di Coppe è un sentimento nuovo, mentre l'Asso di Denari è un'occasione concreta, da cui può venire un guadagno. È lo stesso inizio, ma uno succede nel cuore e l'altro nella borsa. Io me ne sono accorta tardi, e nel frattempo ne avevo imparate a memoria venti, tutte sbagliate.", cards: ['c01', 'p01'] },
    ],
  },
  {
    id: 'minors2', title: 'Uno, due, tre', by: 'ginepra',
    pages: [
      { h: 'Come comincia una cosa', body: `Questa pagina l'ha scritta Ginepra, e si vede dalle macchie. I primi tre numeri raccontano come una cosa comincia e cresce, in qualunque seme.\n\n${numeri(1, 3)}` },
      { h: 'Due prove, con la stellina', body: "L'Asso di Bastoni è un inizio nella volontà, cioè una scintilla, una voglia di fare che si accende. Il Tre di Denari è una cosa concreta che cresce, cioè un lavoro fatto bene insieme ad altri. Il Due di Spade invece non sono due innamorati: sono due idee che si incontrano in testa, e chi le ha non sa quale scegliere.", cards: ['w01', 'p03', 's02'] },
    ],
  },
  {
    id: 'minors3', title: 'Quattro, cinque, sei', by: 'malva',
    pages: [
      { h: 'Fermo, rotto, aggiustato', body: `I tre numeri di mezzo vanno come un osso: prima sta fermo, poi si spezza, poi qualcuno lo rimette insieme. Vale per tutti e quattro i semi, e conviene ricordarselo così.\n\n${numeri(4, 6)}` },
      { h: 'Due carte da tenere a mente', body: "Il Quattro di Spade è la sosta della mente, cioè una pausa in cui la testa si riposa e recupera. Il Cinque di Coppe è la scossa nel cuore, cioè una perdita, e quella prima o poi l'abbiamo in mano tutte. Dopo il cinque viene sempre un sei: nei Denari, per dire, è qualcuno che dà una mano a chi ne ha bisogno.", cards: ['s04', 'c05', 'p06'] },
    ],
  },
  {
    id: 'minors4', title: 'Dal sette al dieci', by: 'ortica',
    pages: [
      { h: "L'ultimo pezzo di strada", body: `I numeri alti sono l'ultimo pezzo di una strada, e io li ho imparati andando al mulino: al bivio ci si ferma, in discesa si corre, quando si vede la ruota manca poco, e poi si arriva.\n\n${numeri(7, 10)}` },
      { h: 'Il bivio e la discesa', body: "Il Sette di Denari è il bivio: il lavoro è fatto, e ci si ferma a guardare se il raccolto viene su, con pazienza. L'Otto di Bastoni è la discesa, in cui tutto si muove in fretta e arrivano notizie. Il dieci è l'arrivo, con tutto il bene o tutto il peso del suo seme: nelle Coppe è una famiglia felice, nei Bastoni un carico troppo pesante.", cards: ['p07', 'w08', 'c10'] },
    ],
  },
  {
    id: 'minors5', title: 'Le figure', by: 'edera',
    pages: [
      { h: 'Chi c\'è', body: `Le figure sono quattro per seme, cara, e non dicono che cosa succede: dicono chi c'è. A volte sono una persona vera, a volte un modo di stare nelle cose.\n\n${figure}` },
      { h: 'Gente che conosci', body: "Il Fante di Coppe è chi impara col cuore, e porta una sorpresa gentile. Il Re di Spade è chi governa con la testa, con regole e un giudizio giusto: conosciamo un signore che vorrebbe somigliargli. La Regina di Denari custodisce la casa e chi ci entra, e il Cavaliere di Bastoni va di corsa dove lo porta la passione. A guardarsi intorno, li si riconosce quasi tutti.", cards: ['c11', 's14', 'p13', 'w12'] },
    ],
  },
  {
    id: 'reversed', title: 'Le carte capovolte', by: 'edera',
    pages: [
      { h: 'La stessa carta', body: "Sei tornata a rileggere, cara, e fai bene, perché io queste cose le dico una volta e poi non ricordo più a chi. Una carta capovolta non dice il contrario di quella dritta: dice la stessa cosa, che però fatica a uscire. Può essere trattenuta, può arrivare in ritardo, può restare chiusa dentro la persona. Qualche volta succede l'inverso, e allora ce n'è troppa." },
      { h: 'Una carta dura', body: "Il Diavolo, da dritto, parla di una dipendenza, cioè di catene che uno si è scelto. Capovolto è ancora il Diavolo e parla ancora di catene, ma la presa si è allentata, e chi lo riceve si sta liberando. Per questo una carta dura, quando esce capovolta, porta spesso un sollievo: il peso c'è ancora, però comincia a sollevarsi.", cards: ['m15'] },
      { h: 'Una carta lieta', body: "Con le carte liete bisogna stare più attente. Il Sole, da dritto, è una gioia piena, in cui tutto è chiaro. Capovolto non diventa buio: la gioia c'è ancora, ma tarda ad arrivare, oppure è così esagerata che non ci si crede, e chi ha la carta davanti fa fatica a godersela. Avevo un cugino fatto così, che teneva le imposte chiuse con il sole in casa.", cards: ['m19'] },
      { h: 'Come leggerle', body: "Quando una carta esce capovolta, per prima cosa ricordati che cosa dice da dritta. Poi chiediti che cosa le impedisce di stare dritta: se la cosa è trattenuta, se è in ritardo, se resta dentro la persona invece di uscire, oppure se è troppa. Di solito basta guardare le carte vicine per capirlo. E non spaventare nessuno, mi raccomando, perché una carta capovolta non è mai una condanna." },
    ],
  },
];
