// Asso di Coppe. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: asso (comincia qualcosa) × Coppe (il cuore). Upright: a new feeling, the heart opens.
// Reversed: the heart stays shut, affection is held in, a gift is not taken.
export default {
  id: 'c01',
  up: {
    favore: 2, moto: 'inizia',
    essenza: "Un sentimento nuovo: il cuore si apre.",
    amore: {
      situazione: "Senti nascere un sentimento nuovo, e il cuore ti si apre senza fatica.",
      origine: "Hai aperto il cuore a una persona, e da lì è cominciato tutto.",
      ostacolo: "Ti frena la paura di mostrare un sentimento così nuovo e così grande.",
      arrivo: "Nascerà un amore nuovo, oppure quello che hai tornerà fresco come all'inizio.",
      consiglio: "Apri il cuore e di' quello che provi, senza aspettare il momento perfetto.",
    },
    lavoro: {
      situazione: "Stai cominciando qualcosa di nuovo nel lavoro, e ci metti tutto il cuore.",
      origine: "Hai scelto il tuo lavoro col cuore, e all'inizio ti dava una gioia grande.",
      ostacolo: "Rischi di buttarti in ogni novità col cuore, e ai conti pensi soltanto dopo.",
      arrivo: "Arriverà un'occasione nuova, di quelle che si accettano col cuore leggero.",
      consiglio: "Di' di sì alla novità che ti dà gioia, anche se è piccola.",
    },
    casa: {
      situazione: "C'è un affetto nuovo in casa, e tutti si parlano con più dolcezza.",
      origine: "È nato in famiglia un affetto nuovo, e la casa si è riempita di gioia.",
      ostacolo: "Manca ancora l'abitudine: in casa questo affetto nuovo nessuno sa bene come mostrarlo.",
      arrivo: "Entrerà in casa una gioia nuova, e la famiglia si sentirà più unita.",
      consiglio: "Accogli a cuore aperto chi arriva in casa, e fagli subito un posto a tavola.",
    },
    altri: {
      situazione: "Stai conoscendo una persona nuova, e ti viene naturale aprirle il cuore.",
      origine: "Qualcuno ti ha offerto la sua amicizia senza chiedere niente, e ti si è aperto il cuore.",
      ostacolo: "Ti trattiene il timore di aprirti troppo presto con chi conosci appena.",
      arrivo: "Nascerà un'amicizia nuova, di quelle in cui ci si vuole bene da subito.",
      consiglio: "Offri tu la tua amicizia, senza aspettare che siano gli altri a cominciare.",
    },
    se: {
      situazione: "Senti dentro una gioia nuova, e ti viene voglia di volere bene a tutti.",
      origine: "Hai sentito il cuore aprirsi, dopo un tempo lungo in cui era rimasto chiuso.",
      ostacolo: "Ti spaventa questo sentimento nuovo, perché avevi perso l'abitudine di sentire così tanto.",
      arrivo: "Tornerai a sentire con il cuore aperto, come quando ogni cosa era nuova.",
      consiglio: "Lascia entrare quello che senti, e segui la cosa nuova che ti dà gioia.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Il cuore resta chiuso: un affetto trattenuto.",
    amore: {
      situazione: "Tieni chiuso dentro quello che provi, e l'altra persona non sa che cosa senti.",
      origine: "Hai chiuso il cuore dopo una delusione, e da allora lo apri a fatica.",
      ostacolo: "Ti frena un cuore chiuso: l'affetto c'è, ma non riesci a mostrarlo.",
      arrivo: "Arriverà un gesto d'amore, e farai fatica a lasciarlo entrare.",
      consiglio: "Di' almeno una delle cose che tieni chiuse dentro, alla persona che ami.",
    },
    lavoro: {
      situazione: "Lavori senza metterci il cuore, e la gioia di una volta resta chiusa dentro.",
      origine: "Hai rifiutato un'offerta sincera, perché avevi il cuore chiuso e poca fiducia.",
      ostacolo: "Resta una delusione che tieni chiusa dentro, e ti toglie la voglia di fare.",
      arrivo: "Verrà un'offerta buona, e a cuore chiuso rischierai di lasciarla cadere.",
      consiglio: "Sfogati con qualcuno di quello che trattieni, prima di decidere sul lavoro.",
    },
    casa: {
      situazione: "Ci si vuole bene in casa tua, ma nessuno lo dice e ognuno resta chiuso.",
      origine: "Avete avuto in famiglia l'abitudine di trattenere l'affetto, e di non dirselo mai.",
      ostacolo: "Pesa in casa un silenzio vecchio: i sentimenti restano chiusi dietro le faccende di ogni giorno.",
      arrivo: "Resterà chiuso in casa un affetto che c'è, finché qualcuno non lo dirà.",
      consiglio: "Mostra l'affetto che trattieni: in casa basta un abbraccio, anche se non si usa.",
    },
    altri: {
      situazione: "Stai sulle tue con tutti, e l'affetto che avresti da dare resta chiuso.",
      origine: "Qualcuno ti ha teso la mano con affetto, e tu non l'hai presa.",
      ostacolo: "Ti trattiene la diffidenza: tieni tutti a distanza, e nessuno arriva al tuo cuore.",
      arrivo: "Riceverai una gentilezza sincera, e con il cuore chiuso farai fatica a crederci.",
      consiglio: "Accetta l'affetto che ti offrono, senza chiederti che cosa vogliono in cambio.",
    },
    se: {
      situazione: "Senti poco, come se avessi chiuso il cuore a chiave.",
      origine: "Hai trattenuto a lungo quello che sentivi, per paura di sembrare debole.",
      ostacolo: "Ti blocca l'abitudine a trattenerti: ogni emozione la rimandi a un altro giorno.",
      arrivo: "Sentirai il bisogno di piangere o di ridere, e capirai quanto hai trattenuto.",
      consiglio: "Lascia uscire quello che trattieni, poco alla volta, con qualcuno di cui ti fidi.",
    },
  },
};
