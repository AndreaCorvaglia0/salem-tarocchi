// Tre di Spade. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: tre (qualcosa viene alla luce) × Spade (la mente, le parole). Upright: a truth or a word that hurts
// the heart, a clear sorrow. Reversed: the wound heals and one forgives, unless one keeps brooding over it.
export default {
  id: 's03',
  up: {
    favore: -2, moto: 'chiude',
    essenza: "Un dolore al cuore: una verità che ferisce.",
    amore: {
      situazione: "Hai il cuore ferito da una verità che non volevi sapere.",
      origine: "Qualcuno che amavi ti ha detto parole che ti hanno fatto molto male.",
      ostacolo: "Ti pesa una ferita d'amore ancora aperta, che fa male ogni volta che ci pensi.",
      arrivo: "Arriverà un dolore in amore, chiaro e senza inganni, e col tempo passerà.",
      consiglio: "Lascia uscire il dolore senza vergogna, perché trattenerlo lo fa durare di più.",
    },
    lavoro: {
      situazione: "Stai soffrendo per una delusione nel lavoro, e ti fa male più di quanto mostri.",
      origine: "Hai ricevuto una brutta notizia su un affare, e ti ha ferito nell'orgoglio.",
      ostacolo: "Ti frena il dolore per una parola ingiusta, detta da qualcuno con cui lavori.",
      arrivo: "Riceverai una risposta che ti farà male, e almeno saprai la verità.",
      consiglio: "Accetta che questa delusione ti fa male, senza fingere che non ti tocchi.",
    },
    casa: {
      situazione: "C'è tristezza in casa per parole che hanno ferito, e ognuno la tiene per sé.",
      origine: "Una verità detta in famiglia ha lasciato una ferita, e ancora nessuno l'ha curata.",
      ostacolo: "Pesa sul cuore di tutti un dolore di famiglia, di cui si parla poco.",
      arrivo: "Verrà un giorno triste in casa, per una verità che a qualcuno farà male.",
      consiglio: "Consola chi in casa sta soffrendo, anche solo restando lì vicino.",
    },
    altri: {
      situazione: "Soffri per il gesto di una persona amica, che ti ha ferito senza preavviso.",
      origine: "Qualcuno di cui ti fidavi ti ha ferito con le parole, e ci pensi ancora.",
      ostacolo: "Resta il dolore di una frase cattiva, che ti fa stare in guardia con tutti.",
      arrivo: "Sentirai dire una cosa che ti farà male, da chi credevi dalla tua parte.",
      consiglio: "Di' con semplicità a chi ti ha ferito che le sue parole ti hanno fatto male.",
    },
    se: {
      situazione: "Porti un dolore chiaro nel cuore, e sai bene da dove viene.",
      origine: "Hai capito una verità triste su di te, e ti ha fatto male.",
      ostacolo: "Ti trattiene la tristezza, che in questi giorni colora ogni tuo pensiero.",
      arrivo: "Attraverserai un dolore vero, di quelli che fanno piangere e poi passano.",
      consiglio: "Piangi quello che c'è da piangere, perché questo dolore passa solo attraversandolo.",
    },
  },
  rev: {
    favore: 1, moto: 'torna',
    essenza: "La ferita si chiude: guarire e perdonare.",
    amore: {
      situazione: "Stai guarendo da una ferita d'amore, e pensarci fa meno male.",
      origine: "Hai sofferto molto per parole dure, e poi hai trovato il modo di perdonare.",
      ostacolo: "Ti frena il rimuginare su un vecchio dolore, che così non guarisce mai.",
      arrivo: "Guarirà la ferita che porti, e potrai voler bene senza paura.",
      consiglio: "Perdona chi ti ha ferito, più per la tua pace che per la sua.",
    },
    lavoro: {
      situazione: "Ti stai riprendendo da una delusione nel lavoro, e la ferita all'orgoglio guarisce.",
      origine: "Un rifiuto ti aveva fatto molto male, e col tempo quel dolore è guarito.",
      ostacolo: "Resta un dispiacere che non hai detto a nessuno, e così fatica a guarire.",
      arrivo: "Passerà il dolore per un torto ricevuto, e tornerai a lavorare con serenità.",
      consiglio: "Perdona quel torto e chiudi il conto, poi rimetti le mani su quello che sai fare.",
    },
    casa: {
      situazione: "Si chiudono in casa le ferite di un brutto periodo, un poco alla volta.",
      origine: "Qualcuno in famiglia ha chiesto scusa per parole dure, e il dolore si è sciolto.",
      ostacolo: "Pesa ancora un vecchio dolore di famiglia, che qualcuno riapre a ogni occasione.",
      arrivo: "Arriverà il perdono in famiglia, dopo un dolore che sembrava non passare.",
      consiglio: "Parla con i tuoi di quello che vi ha fatto male, così la ferita può chiudersi.",
    },
    altri: {
      situazione: "Fa meno male il torto di una persona amica, e cominci a perdonare.",
      origine: "Hai portato a lungo il peso di un'offesa, finché hai deciso di perdonarla.",
      ostacolo: "Ti trattiene il ricordo dell'offesa, che rimugini ogni volta che incontri quella persona.",
      arrivo: "Riuscirai a salutare senza dolore chi ti aveva ferito.",
      consiglio: "Smetti di raccontare a tutti il male ricevuto, perché ogni volta riapri la ferita.",
    },
    se: {
      situazione: "Senti che il dolore si allenta, e la ferita comincia a chiudersi.",
      origine: "Hai pianto quello che dovevi piangere, e da lì è cominciata la guarigione.",
      ostacolo: "Torna spesso un pensiero triste, che rimugini anche quando la ferita è chiusa.",
      arrivo: "Starai meglio, e di questo dolore ti resterà soprattutto quello che hai capito.",
      consiglio: "Abbi pazienza con il tuo cuore, perché guarisce piano ma guarisce.",
    },
  },
};
