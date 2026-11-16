// Cinque di Coppe. The model voice: every other card follows this file (docs/READING.md, "Come si scrive una voce").
// Number × suit: cinque (qualcosa si rompe) × Coppe (il cuore). Upright: a loss, and the eyes fixed on what was
// spilled. Reversed: the grief loosens, one turns to what still stands.
export default {
  id: 'c05',
  up: {
    favore: -1, moto: 'chiude',
    essenza: "Una perdita, e il rimpianto.",
    amore: {
      situazione: "Stai piangendo un amore finito, e non vedi chi ti è rimasto accanto.",
      origine: "Hai perso una persona a cui tenevi, e ci pensi ancora.",
      ostacolo: "Ti frena il rimpianto per quello che poteva essere e non è stato.",
      arrivo: "Arriverà una delusione, ma qualcosa di buono resterà in piedi.",
      consiglio: "Concediti di essere triste, poi guarda quello che ti è rimasto.",
    },
    lavoro: {
      situazione: "Stai contando quello che hai perso, e non guardi quello che ti resta.",
      origine: "Hai subìto una perdita, e da allora hai paura che succeda di nuovo.",
      ostacolo: "Ti pesa un affare andato male, e non riesci a pensare al prossimo.",
      arrivo: "Perderai una parte di quello che hai messo, ma non tutto.",
      consiglio: "Fai il conto di quello che ti è rimasto: è più di quanto credi.",
    },
    casa: {
      situazione: "C'è un vuoto in casa, e tutti ci girano intorno senza parlarne.",
      origine: "Hai vissuto una perdita in famiglia, e in casa nessuno ne ha più parlato.",
      ostacolo: "Pesa su tutti un dolore vecchio, che in casa ognuno porta da solo.",
      arrivo: "Verrà un momento triste in casa, e vedrai chi c'è davvero.",
      consiglio: "Parla di chi manca, e guarda chi è ancora seduto a quel tavolo.",
    },
    altri: {
      situazione: "Ti senti in disparte dopo un'amicizia finita, e guardi solo le porte chiuse.",
      origine: "Qualcuno ti ha voltato le spalle, e da allora ti fidi meno di tutti.",
      ostacolo: "Ti blocca il ricordo di un torto, e tieni lontano anche chi non c'entra.",
      arrivo: "Perderai l'appoggio di qualcuno, e scoprirai chi invece è rimasto.",
      consiglio: "Smetti di contare chi se n'è andato, e bussa da chi è rimasto.",
    },
    se: {
      situazione: "Stai guardando solo quello che è andato storto, e il resto non lo vedi.",
      origine: "Hai perso qualcosa a cui tenevi, e da allora te lo rimproveri.",
      ostacolo: "Ti trattiene il rimorso: ripassi gli stessi errori, e non cambia niente.",
      arrivo: "Passerai un periodo di malinconia, e capirai meglio che cosa conta per te.",
      consiglio: "Lascia che il dispiacere passi, senza crederlo tutto quello che sei.",
    },
  },
  rev: {
    favore: 1, moto: 'torna',
    essenza: "Accettare la perdita e ripartire.",
    amore: {
      situazione: "Stai ricominciando a guardarti intorno, e il dolore di prima pesa meno.",
      origine: "Hai sofferto a lungo per una storia finita, e poi hai smesso di aspettarla.",
      ostacolo: "Ti frena la paura di soffrire ancora, proprio ora che potresti riprovarci.",
      arrivo: "Tornerà la voglia di fidarti, e forse tornerà anche una persona.",
      consiglio: "Perdona quello che c'è da perdonare, a cominciare da te.",
    },
    lavoro: {
      situazione: "Ti stai rimettendo in piedi dopo una perdita, e vedi che cosa si salva.",
      origine: "Hai preso un colpo duro, e hai ricominciato da quello che ti restava.",
      ostacolo: "Ti rallenta la prudenza di chi ha già perso, e rischi di mancare un'occasione.",
      arrivo: "Recupererai una parte di quello che credevi perduto, abbastanza per ripartire.",
      consiglio: "Riprendi quello che hai lasciato a metà: ora lo vedi con più calma.",
    },
    casa: {
      situazione: "Si torna a respirare in casa: il peggio è passato.",
      origine: "Hai visto la tua famiglia soffrire e poi, poco alla volta, rimettersi insieme.",
      ostacolo: "Resta una cosa non detta dopo quel dolore, e la pace è a metà.",
      arrivo: "Verrà una riconciliazione: qualcuno che si era allontanato si rifarà vivo.",
      consiglio: "Fai tu il primo passo verso chi si è allontanato, senza aspettare scuse.",
    },
    altri: {
      situazione: "Stai riallacciando i rapporti, e scopri che non tutti se n'erano andati.",
      origine: "Hai chiuso con chi ti aveva deluso, e col tempo la rabbia è passata.",
      ostacolo: "Ti trattiene l'orgoglio: vorresti tornare da qualcuno, ma aspetti che si muova per primo.",
      arrivo: "Ritroverai un'amicizia che davi per finita, più semplice di prima.",
      consiglio: "Accetta la mano che ti tendono, anche se arriva tardi.",
    },
    se: {
      situazione: "Stai facendo pace con un tuo sbaglio, e ricordarlo non ti fa più male.",
      origine: "Hai passato molto tempo a rimproverarti, finché hai capito che non serviva.",
      ostacolo: "Ti resta l'abitudine alla tristezza, che torna anche quando non hai motivo.",
      arrivo: "Sentirai il peso alleggerirsi, e riprenderai i progetti che avevi messo via.",
      consiglio: "Raccogli quello che è rimasto in piedi, e riparti da lì.",
    },
  },
};
