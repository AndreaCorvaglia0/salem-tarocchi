// La Ruota della Fortuna. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Book words: cicli, sorte, svolta. Upright: luck turns in one's favour, something moves by itself, an occasion passes by.
// Reversed: luck turns against: a crooked spell, a standstill, which is also only one turn and will pass.
export default {
  id: 'm10',
  up: {
    favore: 1, moto: 'torna',
    essenza: "La sorte gira: una svolta a tuo favore.",
    amore: {
      situazione: "Vedi la sorte girare a tuo favore in amore, dopo un periodo in cui niente si muoveva.",
      origine: "Hai incontrato una persona per pura sorte, e quell'incontro è stato una svolta.",
      ostacolo: "Ti frena l'attesa che decida il destino, mentre l'occasione passa.",
      arrivo: "Arriverà una svolta in amore, un incontro o un ritorno che non aspettavi.",
      consiglio: "Cogli l'occasione appena si presenta, perché in amore il momento è favorevole.",
    },
    lavoro: {
      situazione: "Vivi un momento fortunato negli affari, e conviene approfittarne finché dura.",
      origine: "Hai avuto un colpo di fortuna, e gli affari hanno preso un'altra piega.",
      ostacolo: "Pesa l'incertezza: i guadagni vanno a cicli, e non sai quanto durerà quello buono.",
      arrivo: "Cambierà in meglio la tua sorte nel lavoro, con un'occasione che viene da fuori.",
      consiglio: "Muoviti finché il momento è buono, e metti da parte per i tempi magri.",
    },
    casa: {
      situazione: "Sta cambiando qualcosa in casa tua, e la sorte gira dalla vostra parte.",
      origine: "Avete visto cambiare la sorte della famiglia da un anno all'altro, in meglio.",
      ostacolo: "Manca la certezza del domani, perché in casa molto dipende dalla sorte.",
      arrivo: "Verrà una svolta per la famiglia, e chi stava in basso si rialzerà.",
      consiglio: "Accogli il cambiamento che arriva in casa, senza rimpiangere com'era prima.",
    },
    altri: {
      situazione: "Hai la sorte dalla tua fra la gente, e trovi appoggio dove non te lo aspettavi.",
      origine: "Qualcuno è entrato nella tua vita per caso, e ti ha portato fortuna.",
      ostacolo: "Cambiano in fretta le simpatie della gente, e non sai su chi contare.",
      arrivo: "Incontrerai per un caso fortunato la persona giusta, proprio al momento giusto.",
      consiglio: "Esci e fatti vedere in giro, perché la fortuna passa fra la gente.",
    },
    se: {
      situazione: "Senti che un ciclo sta finendo e che un altro comincia, più favorevole.",
      origine: "Conoscevi già gli alti e i bassi della sorte, e hai imparato che tutto gira.",
      ostacolo: "Resta fuori dalle tue mani quello che la sorte sta cambiando, e questo ti inquieta.",
      arrivo: "Girerà a tuo favore una situazione ferma da tempo, quasi senza il tuo intervento.",
      consiglio: "Asseconda la svolta che senti arrivare, e fai la tua parte per aiutarla.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "La sorte gira contro: un periodo storto, che passa.",
    amore: {
      situazione: "Vivi un periodo sfortunato in amore, in cui ogni incontro va storto.",
      origine: "Hai perso una persona per un caso sfortunato, senza colpa di nessuno.",
      ostacolo: "Ti frena l'idea di non avere fortuna in amore, e smetti di provarci.",
      arrivo: "Verrà un momento storto con chi ami, che passerà come è venuto.",
      consiglio: "Aspetta che il periodo storto passi, senza prendere decisioni definitive in amore.",
    },
    lavoro: {
      situazione: "Stai attraversando un periodo di magra, in cui gli affari girano male.",
      origine: "Avevi gli affari in salita, finché la sorte ha girato dall'altra parte.",
      ostacolo: "Pesa uno stallo: tutto è fermo, e non dipende da quello che fai.",
      arrivo: "Arriverà un colpo di sfortuna che ritarderà i guadagni, e dovrai aspettare.",
      consiglio: "Spendi poco e rischia meno, finché la sorte non gira di nuovo.",
    },
    casa: {
      situazione: "Capita in casa un guaio dopo l'altro, e sembra un periodo storto per tutti.",
      origine: "Avete avuto un'annata sfortunata in famiglia, e ne siete usciti stringendo i denti.",
      ostacolo: "Manca in casa la voglia di reagire, perché tutti danno la colpa alla sfortuna.",
      arrivo: "Dovrete rimandare un progetto di casa per un colpo di sfortuna, e riprenderlo in seguito.",
      consiglio: "Tieni unita la famiglia nel momento storto, e ricorda a tutti che passerà.",
    },
    altri: {
      situazione: "Senti di avere la sorte contro fra la gente, e ogni tentativo va storto.",
      origine: "Qualcuno che ti appoggiava è caduto in disgrazia, e hai perso il suo aiuto.",
      ostacolo: "Resta su di te una fama di poca fortuna, e qualcuno ti tiene a distanza.",
      arrivo: "Verrà meno un favore su cui contavi, perché in paese la sorte è girata.",
      consiglio: "Lascia passare il momento contrario, e conserva le poche amicizie sicure.",
    },
    se: {
      situazione: "Ti sembra che tutto vada storto, e che la sfortuna ce l'abbia con te.",
      origine: "Hai ripetuto lo stesso errore più volte, come in un ciclo che non si chiude.",
      ostacolo: "Fai fatica ad accettare quello che la sorte ha cambiato, e resti dove sei.",
      arrivo: "Passerà anche questo periodo storto, ma più lentamente di quanto vorresti.",
      consiglio: "Ricorda che anche la sfortuna gira, e non darti la colpa di tutto.",
    },
  },
};
