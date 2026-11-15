// The six lessons of the mistresses (deck, single, ppf, celtic, suits, astro), each a few short pages.
// A page may show a spread (`spread`) or some cards (`cards`). Italian, in the voice of who teaches.

export const LESSONS = [
  {
    id: 'deck', title: 'Il mazzo', by: 'malva',
    pages: [
      { h: 'Settantotto carte', body: "Settantotto carte, e non farti venire il mal di testa. Ventidue Maggiori e cinquantasei Minori. Le Maggiori sono le storie grosse della vita: un inizio, un amore, una fine. Le Minori sono i giorni qualunque, quelli in cui si vive davvero.", cards: ['m00', 'm13', 'm19'] },
      { h: 'Quattro semi', body: "Le Minori hanno quattro semi: Bastoni, Coppe, Spade, Denari. Ognuno ha quattordici carte: l'Asso, poi dal Due al Dieci, poi quattro figure, che sono il Fante, il Cavaliere, la Regina e il Re. Conta, non ti ci vuole molto." },
      { h: 'Prima guarda', body: "Prima di cercare il significato, guarda. Chi c'è? Dove guarda? Che tempo fa? Cosa ti colpisce per primo? Quello che noti è già una risposta, e di solito è tua. I libri vengono dopo.", cards: ['m02'] },
      { h: 'Le capovolte', body: "Una carta capovolta non è una disgrazia. Di solito è la stessa carta ma bloccata, troppa o troppo poca. Se ti confonde, ignorale pure: c'è chi lo fa e legge benissimo lo stesso. Per ora, basta il dritto." },
    ],
  },
  {
    id: 'single', title: 'La carta singola', by: 'malva',
    pages: [
      { h: 'Una carta, una risposta', body: "Una carta sola. Serve per la giornata, per una domanda semplice, per capire da dove cominciare. Non fare la furba: se la domanda è un romanzo, la carta non basta.", spread: 'single' },
      { h: 'Come si fa', body: "Pensa alla domanda, mescola, pesca. Metti la carta in mezzo al tavolo. Guarda cosa vedi, poi cosa significa. La carta non è un oracolo: è uno specchio, e lo specchio non mente, ma nemmeno ti consola." },
      { h: 'Cosa dire al cliente', body: "Dì tre cose, in quest'ordine: cosa vedi, cosa vuol dire, cosa può farne lei. Poche frasi. Niente sentenze, niente «ti succederà». Chi esce dal tavolo deve avere una cosa da fare, non una paura.", cards: ['m03'] },
    ],
  },
  {
    id: 'ppf', title: 'Passato, presente, futuro', by: 'ortica',
    pages: [
      { h: 'Tre carte, una storia', body: "Ah, finalmente! Ti aspettavo, sai, ho appena sistemato la mia capanna, che era in uno stato, non puoi immaginare. Dunque: tre carte, in fila. Passato, presente, futuro. La prima da dove viene, la seconda dove sei, la terza dove va.", spread: 'ppf' },
      { h: 'Il filo', body: "La regola d'oro: non leggerle una per una, come i pesci al mercato. Cercale insieme. Si somigliano? C'è lo stesso colore, la stessa persona, lo stesso seme? Guardano nella stessa direzione? Il filo è quello, e chi lo trova ha già mezza lettura fatta. Come lo so? Me l'ha detto la moglie del mugnaio, che lo sa dalla sorella." },
      { h: 'Il futuro non è una sentenza', body: "E poi, ascoltami bene, che è importante: il futuro non è scritto. È dove vai se non cambi strada. Se la terza carta non ti piace, guarda la prima e la seconda: là c'è quello su cui puoi lavorare. Non spaventare nessuno. Mai." },
    ],
  },
  {
    id: 'celtic', title: 'La croce celtica', by: 'edera',
    pages: [
      { h: 'Dieci carte', body: "Oh, sei tu, cara. Come ti chiami? No, non dirmelo, lo dimentico lo stesso. Dieci carte, la croce e poi la colonna. Questa me la ricordo benissimo, che strano. La croce ha il suo ordine: la 1 al centro, e via di seguito.", spread: 'celtic' },
      { h: 'Il cuore: 1 e 2', body: "La prima carta è dove sei adesso. La seconda ci va di traverso, sopra: è ciò che ti attraversa. A volte è un ostacolo, a volte un aiuto: dipende da come la guardi. Leggile come una coppia, non come due carte separate." },
      { h: 'Attorno: 3, 4, 5, 6', body: "Sotto, la 3: le fondamenta, da dove viene tutto. A sinistra, la 4: il passato recente, ciò che si allontana. Sopra, la 5: ciò che può nascere. A destra, la 6: il futuro prossimo, ciò che arriva. Una piccola ruota intorno al centro." },
      { h: 'La colonna: 7, 8, 9, 10', body: "Poi la colonna a destra, dal basso. La 7 sei tu, adesso. L'8 è l'ambiente, chi hai intorno. La 9, le speranze e le paure: spesso sono la stessa cosa. E la 10 è l'esito, dove porta il cammino se non lo cambi. Chiudi sempre con quella." },
    ],
  },
  {
    id: 'suits', title: 'Semi ed elementi', by: 'malva',
    pages: [
      { h: 'Quattro semi, quattro elementi', body: "Bastoni: fuoco, volontà. Coppe: acqua, cuore. Spade: aria, testa. Denari: terra, concretezza. Imparali a memoria. Quando una carta ti confonde, chiediti di quale seme è: la metà del lavoro è già fatta." },
      { h: 'Semi e segni', body: "Ogni seme ha tre segni dello zodiaco, quelli del suo elemento. Bastoni: Ariete, Leone, Sagittario. Coppe: Cancro, Scorpione, Pesci. Spade: Gemelli, Bilancia, Acquario. Denari: Toro, Vergine, Capricorno. Il tuo segno ti dice il tuo seme." },
      { h: 'I numeri', body: "L'Asso è l'inizio, il seme. Il Due una scelta, il Tre una crescita, il Quattro una base. Il Cinque una crisi, il Sei una tregua, il Sette una prova. L'Otto è movimento, il Nove quasi arrivati, il Dieci la fine del giro. È una traccia, non una regola." },
      { h: 'Le figure', body: "Il Fante porta un messaggio, o è chi sta imparando. Il Cavaliere si muove, ha una direzione e un po' di fretta. La Regina padroneggia il seme dentro di sé. Il Re lo padroneggia fuori, sugli altri. Possono essere persone, o modi di stare in una situazione." },
    ],
  },
  {
    id: 'astro', title: 'Pianeti, segni, elementi', by: 'edera',
    pages: [
      { h: 'Il cielo nelle carte', body: "Ah, il cielo. Le Maggiori sono legate al cielo da una tradizione antica, quella della Golden Dawn, una società segreta dell'Ottocento: ogni carta ha un pianeta, un segno o un elemento. Come ti chiami? Non importa. Ti serve a ricordare: se sai che il Mago è Mercurio, sai già mezzo Mago." },
      { h: 'I sette pianeti', body: "Il Mago è Mercurio: mente e parole. La Sacerdotessa è la Luna: intuito. L'Imperatrice è Venere: amore e piacere. La Ruota è Giove: espansione e fortuna. La Torre è Marte: azione e scontro. Il Sole è il Sole: vita. Il Mondo è Saturno: limiti e compimento.", cards: ['m01', 'm02', 'm03', 'm10', 'm16', 'm19', 'm21'] },
      { h: 'I dodici segni', body: "L'Imperatore è l'Ariete, il Papa il Toro, gli Amanti i Gemelli, il Carro il Cancro, la Forza il Leone, l'Eremita la Vergine. La Giustizia è la Bilancia, la Morte lo Scorpione, la Temperanza il Sagittario, il Diavolo il Capricorno, la Stella l'Acquario, la Luna i Pesci. In ordine: segui il ciclo dell'anno.", cards: ['m04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm11', 'm13', 'm14', 'm15', 'm17', 'm18'] },
      { h: 'I tre elementi', body: "Restano tre carte, e sono i tre elementi: il Matto è l'Aria, l'Appeso è l'Acqua, il Giudizio è il Fuoco. La Terra, invece, la trovi nei Denari. E la tua carta di nascita è quella del tuo segno: questa, almeno, ricordala tu per me.", cards: ['m00', 'm12', 'm20'] },
    ],
  },
];
