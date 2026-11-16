// La Morte. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Upright: something has ended and makes room for what comes next. Reversed: the ending is resisted and dragged out, and comes anyway.
export default {
  id: 'm13',
  up: {
    favore: 0, moto: 'chiude',
    amore: {
      situazione: "Sta finendo una storia, o almeno il modo in cui l'avete vissuta finora, e in fondo lo sai da un pezzo.",
      origine: "Hai chiuso un amore che non aveva più niente da dare, e dopo quel taglio non hai più amato allo stesso modo.",
      ostacolo: "Ti frena il dispiacere di chiudere: sai che è finita, ma dirlo ad alta voce lo renderebbe definitivo.",
      arrivo: "Finirà una fase della tua vita sentimentale, e quello che verrà dopo non somiglierà a niente di quello che conosci.",
      consiglio: "Smetti di tenere in piedi quello che tra voi è già finito, perché vi costa più che lasciarlo andare.",
    },
    lavoro: {
      situazione: "Si sta esaurendo un lavoro, o una fonte di guadagno, e conviene prenderne atto finché puoi scegliere tu come uscirne.",
      origine: "Hai perso un posto o un'entrata su cui contavi, e da lì hai dovuto ricominciare in un altro modo.",
      ostacolo: "Viene a mancare un guadagno sicuro prima che tu abbia pronta un'alternativa, e questo ti costringe a cambiare strada.",
      arrivo: "Cambierà del tutto il tuo modo di guadagnarti da vivere, e all'inizio sembrerà una perdita più che un passaggio.",
      consiglio: "Chiudi i conti rimasti aperti e lascia l'attività che non rende più, senza aspettare che finisca da sola.",
    },
    casa: {
      situazione: "Sta cambiando la tua casa, perché qualcuno va a vivere altrove o un'epoca della famiglia è arrivata in fondo.",
      origine: "Avete lasciato una casa o un modo di stare insieme, e la famiglia che hai oggi è nata da quella fine.",
      ostacolo: "Ti pesa vedere la famiglia cambiare forma, perché i ruoli di una volta non valgono più e quelli nuovi non ci sono ancora.",
      arrivo: "Verrà il momento di svuotare una stanza o di lasciare una casa, e dopo vi sentirete più leggeri.",
      consiglio: "Regala o butta quello che in casa non serve più a nessuno, e senti com'è lo spazio che resta.",
    },
    altri: {
      situazione: "Si sta chiudendo un'amicizia, o il tuo posto in un gruppo, senza litigi e senza che nessuno ne abbia colpa.",
      origine: "Frequentavi tutt'altra gente, finché quel giro si è sciolto, e chi ti conosceva allora oggi farebbe fatica a riconoscerti.",
      ostacolo: "Ti lega a una persona soltanto il passato che avete in comune, e ormai non basta più a tenervi vicini.",
      arrivo: "Perderai di vista qualcuno che per anni ha contato molto, e capirai che le vostre strade si erano già divise.",
      consiglio: "Saluta con gratitudine chi ha fatto un pezzo di strada con te, senza forzare un legame che si è esaurito.",
    },
    se: {
      situazione: "Stai cambiando pelle: quello che eri fino a ieri non ti somiglia più, e il nuovo non ha ancora un nome.",
      origine: "Hai attraversato una fine che ti ha tolto molto, e proprio da lì è cominciata la persona che sei.",
      ostacolo: "Fai fatica a lasciare un'idea di te che è scaduta, perché senza quella non sai ancora chi sei.",
      arrivo: "Si chiuderà un periodo intero della tua vita, e ne verrà fuori una persona con altri desideri.",
      consiglio: "Lascia andare quello che ha fatto il suo tempo senza chiamarlo fallimento, e fai posto a quello che viene.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    amore: {
      situazione: "Stai trascinando una storia che è finita da tempo, e ogni mese che passa ti costa un po' di più.",
      origine: "Hai rimandato a lungo un addio che andava detto, e quell'attesa ha fatto più male della separazione stessa.",
      ostacolo: "Ti trattiene la paura del vuoto che verrebbe dopo, e per non sentirlo resti dove non c'è più niente.",
      arrivo: "Arriverà comunque la fine che stai evitando, solo più lenta e con più strascichi di quanti ne avrebbe oggi.",
      consiglio: "Ammetti almeno dentro di te che è finita, anche se non hai ancora la forza di dirlo all'altra persona.",
    },
    lavoro: {
      situazione: "Resti in un lavoro o in un affare che non ha più futuro, perché l'idea di cambiare ti spaventa di più.",
      origine: "Hai continuato a mettere soldi in qualcosa che non rendeva, pur di non ammettere che non c'era più niente da fare.",
      ostacolo: "Ti frena l'attaccamento al vecchio modo di lavorare, che conosci bene ma non porta più da nessuna parte.",
      arrivo: "Sarà qualcun altro a decidere al posto tuo, se continui a rimandare un cambiamento che ormai è inevitabile.",
      consiglio: "Taglia la spesa o l'impegno che tieni solo per abitudine, e fallo adesso che puoi ancora scegliere come.",
    },
    casa: {
      situazione: "Si vive in casa come se niente fosse cambiato, mentre tutti sanno che quel tempo è passato.",
      origine: "Avete tenuto tutto com'era dopo un grande cambiamento, e la casa è rimasta ferma a quel giorno.",
      ostacolo: "Manca a tutti il coraggio di dire che così non si può continuare, e le cose vanno avanti per inerzia.",
      arrivo: "Verrà fuori tutta insieme la questione che in famiglia rimandate da anni, e non si potrà più far finta di niente.",
      consiglio: "Apri tu in famiglia il discorso che tutti evitano, e chiedi che se ne parli con calma una volta per tutte.",
    },
    altri: {
      situazione: "Continui a frequentare persone con cui non hai più niente da dirti, solo perché si è sempre fatto così.",
      origine: "Qualcuno si è allontanato da te senza spiegazioni, e hai continuato a cercarlo quando era chiaro che non voleva.",
      ostacolo: "Pesa il timore di restare senza compagnia, che ti fa accettare amicizie da cui non ricevi più niente.",
      arrivo: "Finirà per conto suo un'amicizia che tieni in piedi a fatica, e ti dispiacerà meno di quanto temi.",
      consiglio: "Smetti di rincorrere chi si è già allontanato, e tieni le forze per chi ti cerca davvero.",
    },
    se: {
      situazione: "Stai resistendo a un cambiamento che dentro di te è già avvenuto, e la fatica viene tutta da lì.",
      origine: "Hai portato avanti per anni un ruolo che non ti apparteneva più, per non deludere nessuno.",
      ostacolo: "Ti aggrappi a un'immagine di te ormai vecchia, e chiami coerenza quella che è paura di cambiare.",
      arrivo: "Cambierai lo stesso, che tu lo voglia o no, e più resisti più il passaggio sarà lungo.",
      consiglio: "Scegli una sola cosa che sai già finita e chiudila davvero, così vedrai che dopo si sta meglio.",
    },
  },
};
