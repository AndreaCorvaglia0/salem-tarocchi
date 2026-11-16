// Tre di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: tre (crescita) × Bastoni (la volontà). Upright: what was started grows, one looks far ahead
// and waits for the first fruits. Reversed: growth is slow, help and results come late, the view is too short.
export default {
  id: 'w03',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "Il progetto cresce: guardi lontano e aspetti i frutti.",
    amore: {
      situazione: "Vedi crescere la vostra storia, e cominci a guardare lontano insieme a chi ami.",
      origine: "Hai fatto il primo passo senza fretta, e la storia è cresciuta da lì.",
      ostacolo: "Ti pesa la distanza: guardi lontano con chi ami, e il presente vi sembra poco.",
      arrivo: "Crescerà quello che c'è tra voi, e farete progetti più grandi.",
      consiglio: "Guarda avanti con chi ami, e lascia alla storia il tempo di crescere.",
    },
    lavoro: {
      situazione: "Stai vedendo i primi frutti del tuo lavoro, e pensi già ad allargarti.",
      origine: "Hai avviato bene i tuoi affari, e hai saputo aspettare che crescessero.",
      ostacolo: "Resta da aspettare, perché il progetto è partito ma il guadagno deve ancora arrivare.",
      arrivo: "Arriveranno i primi guadagni di quello che hai avviato, e potrai allargarti.",
      consiglio: "Pensa in grande e guarda lontano, perché il tuo progetto sta crescendo.",
    },
    casa: {
      situazione: "Cresce la famiglia, o crescono i suoi progetti, e in casa si guarda avanti.",
      origine: "Avete costruito insieme una base solida, e da lì la famiglia è cresciuta.",
      ostacolo: "Pesa in casa l'attesa dei frutti, perché tutto è avviato ma serve ancora tempo.",
      arrivo: "Vedrete i frutti di quello che avete avviato, e la casa si allargherà.",
      consiglio: "Fai progetti lunghi per la casa, e non avere fretta di vederli finiti.",
    },
    altri: {
      situazione: "Si allarga il tuo giro di conoscenze, e trovi chi collabora volentieri con te.",
      origine: "Avevi lavorato bene insieme ad altri, e ne è nato qualcosa che cresce ancora.",
      ostacolo: "Ti tocca dipendere dai tempi degli altri, e l'attesa ti mette alla prova.",
      arrivo: "Verranno aiuti e notizie da lontano, e il tuo progetto crescerà.",
      consiglio: "Cerca alleati anche fuori dal paese, perché il tuo progetto può crescere.",
    },
    se: {
      situazione: "Guardi lontano con fiducia, perché quello che hai cominciato sta crescendo.",
      origine: "Hai cominciato con coraggio, e hai visto arrivare i primi frutti.",
      ostacolo: "Ti rende impaziente l'attesa, e vorresti raccogliere prima del tempo.",
      arrivo: "Raccoglierai i primi frutti dei tuoi sforzi, e vedrai più lontano di prima.",
      consiglio: "Continua sulla strada che hai preso, e allarga lo sguardo più che puoi.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Il progetto stenta a crescere, i frutti tardano.",
    amore: {
      situazione: "Aspetti che la storia cresca, ma resta ferma al punto di partenza.",
      origine: "Avevi sperato in un amore lontano, che ha tardato troppo ad arrivare.",
      ostacolo: "Ti frena uno sguardo corto, perché pensi solo a oggi e la storia non cresce.",
      arrivo: "Tarderà quello che aspetti da chi ami, e la pazienza sarà messa alla prova.",
      consiglio: "Chiedi a chi ami dove volete arrivare, invece di aspettare in silenzio.",
    },
    lavoro: {
      situazione: "Stenta a crescere quello che hai avviato, e i guadagni si fanno aspettare.",
      origine: "Hai puntato su un affare che è partito piano, e ha reso meno del previsto.",
      ostacolo: "Ti rallentano gli aiuti che non arrivano, e il progetto resta a metà.",
      arrivo: "Arriveranno in ritardo i frutti del tuo lavoro, e dovrai farteli bastare.",
      consiglio: "Rivedi il progetto con calma, e guarda se hai contato su tempi troppo brevi.",
    },
    casa: {
      situazione: "Vanno a rilento i progetti di casa, e la famiglia comincia a spazientirsi.",
      origine: "Avete aspettato a lungo un aiuto per la casa, ed è arrivato tardi.",
      ostacolo: "Pesa in casa chi guarda solo al giorno dopo, e nessun progetto cresce.",
      arrivo: "Slitteranno i progetti della famiglia, e toccherà aspettare un'altra stagione.",
      consiglio: "Fai con la famiglia un progetto più piccolo, che dia frutti prima.",
    },
    altri: {
      situazione: "Conti su persone che tardano a farsi vive, e il progetto resta ad aspettare.",
      origine: "Qualcuno ti aveva promesso una mano, e l'aiuto è arrivato quando non serviva più.",
      ostacolo: "Manca la collaborazione, perché ognuno guarda il suo e insieme non si cresce.",
      arrivo: "Riceverai con ritardo una risposta attesa, e dovrai fare con le tue forze.",
      consiglio: "Sollecita chi ti deve una risposta, senza aspettare che si ricordi di te.",
    },
    se: {
      situazione: "Stai aspettando frutti che non vengono, e ti chiedi se hai sbagliato strada.",
      origine: "Hai guardato troppo vicino, e ti è sfuggita un'occasione più grande.",
      ostacolo: "Ti scoraggia la lentezza, perché lavori tanto e vedi crescere poco.",
      arrivo: "Vedrai i risultati più tardi di quanto speri, ma li vedrai.",
      consiglio: "Alza lo sguardo da quello che non cresce, e chiediti dove vuoi arrivare.",
    },
  },
};
