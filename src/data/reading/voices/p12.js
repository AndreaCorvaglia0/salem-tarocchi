// Cavaliere di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Court × suit: Cavaliere (chi va) × Denari (le cose concrete). Upright: the one who goes slowly and surely, constancy
// and method. Reversed: the one who has stopped, constancy turned into stubbornness and boredom.
export default {
  id: 'p12',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "Chi va piano e sicuro: costanza e metodo.",
    amore: {
      situazione: "Trovi accanto a te una persona costante e affidabile, che va piano e fa sul serio.",
      origine: "Hai costruito questo legame piano e con costanza, senza colpi di testa.",
      ostacolo: "Ti frena la troppa prudenza: vai così piano che l'altra persona si spazientisce.",
      arrivo: "Crescerà piano un amore sicuro, fatto di costanza più che di grandi gesti.",
      consiglio: "Dimostra l'affetto con la costanza, mantenendo ogni giorno quello che prometti.",
    },
    lavoro: {
      situazione: "Lavori con metodo, un passo dopo l'altro, e il lavoro va avanti sicuro.",
      origine: "Hai fatto ogni giorno il tuo dovere, senza fretta e senza saltare un passo.",
      ostacolo: "Pesa la lentezza: fai tutto bene, ma ci metti più tempo degli altri.",
      arrivo: "Arriverà il guadagno, piano ma sicuro, se continui con la stessa costanza.",
      consiglio: "Vai avanti con metodo, e finisci un lavoro prima di cominciarne un altro.",
    },
    casa: {
      situazione: "Va avanti la casa con regolarità, perché qualcuno ci pensa ogni giorno con costanza.",
      origine: "Avete tirato su la famiglia con costanza e metodo, senza mai rischiare troppo.",
      ostacolo: "Manca un po' di slancio in casa, dove tutto si fa piano e sempre uguale.",
      arrivo: "Sistemerete le cose di casa una alla volta, con calma, e resteranno sistemate.",
      consiglio: "Prenditi un impegno per la famiglia e portalo avanti con costanza, senza saltare un giorno.",
    },
    altri: {
      situazione: "Puoi contare su qualcuno di fidato, che fa poco rumore e mantiene la parola.",
      origine: "Qualcuno ti è stato vicino con costanza, nei giorni buoni e in quelli cattivi.",
      ostacolo: "Passi per una persona lenta agli occhi di chi va di fretta, e ti lasciano indietro.",
      arrivo: "Guadagnerai la fiducia del paese un passo alla volta, mantenendo sempre quello che dici.",
      consiglio: "Sii la persona su cui si può contare, anche nelle cose piccole e noiose.",
    },
    se: {
      situazione: "Stai andando avanti piano ma senza fermarti, e sai dove vuoi arrivare.",
      origine: "Hai sempre preferito la strada lunga e sicura a quella corta e rischiosa.",
      ostacolo: "Resta la paura di cambiare passo, anche quando un po' di fretta servirebbe.",
      arrivo: "Arriverai dove vuoi con la costanza, più tardi di altri ma senza cadere.",
      consiglio: "Continua con il tuo passo, e non farti mettere fretta da nessuno.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Chi si è fermato: costanza diventata testardaggine.",
    amore: {
      situazione: "Sta ferma la vostra storia, perché nessuno dei due vuole cambiare di un passo.",
      origine: "Hai lasciato che un legame si fermasse, per noia o per pigrizia.",
      ostacolo: "Ti frena la testardaggine: sai che dovresti muoverti, e resti dove sei per principio.",
      arrivo: "Andrà a rilento quello che c'è tra voi, fino a sembrare fermo.",
      consiglio: "Fai tu un passo verso chi ami, invece di puntare i piedi.",
    },
    lavoro: {
      situazione: "Resta fermo il tuo lavoro: ti dai da fare ogni giorno, e non si muove niente.",
      origine: "Hai insistito per testardaggine su una strada che non portava da nessuna parte.",
      ostacolo: "Pesa la tua ostinazione a fare come hai sempre fatto, anche quando non funziona.",
      arrivo: "Si fermerà un affare che procedeva piano, e dovrai dargli una spinta.",
      consiglio: "Cambia metodo dove il lavoro è fermo, senza intestardirti sul solito.",
    },
    casa: {
      situazione: "Regna in casa la noia, perché tutto è fermo da tempo e nessuno vuole cambiare.",
      origine: "Avete rimandato per anni un cambiamento in casa, perché qualcuno non voleva sentire ragioni.",
      ostacolo: "Blocca tutta la famiglia la testardaggine di uno solo, che non si sposta di un dito.",
      arrivo: "Resterà tutto fermo in casa, finché qualcuno non si deciderà a cedere.",
      consiglio: "Cedi su qualcosa in famiglia, perché a forza di impuntarsi non si va avanti.",
    },
    altri: {
      situazione: "Tratti con una persona testarda, che non si smuove dalle sue idee.",
      origine: "Qualcuno ti ha fatto aspettare a lungo un aiuto promesso, e non si è mai mosso.",
      ostacolo: "Ti allontana dagli altri la pigrizia: resti a casa tua, e gli inviti si diradano.",
      arrivo: "Troverai qualcuno che non si lascia smuovere, per quanto tu abbia ragione.",
      consiglio: "Smuovi chi è fermo con l'esempio, senza perdere tempo a discutere con i testardi.",
    },
    se: {
      situazione: "Resti dove sei per paura di sbagliare strada, e chiami prudenza la tua immobilità.",
      origine: "Hai perso molto tempo ad aspettare la certezza, senza fare un passo.",
      ostacolo: "Rimane l'abitudine a una vita sempre ferma, da cui non hai il coraggio di muoverti.",
      arrivo: "Ti impunterai su una decisione sbagliata, pur di non ammettere di dover cambiare.",
      consiglio: "Muoviti anche senza avere tutto chiaro, perché restando lì non arrivi da nessuna parte.",
    },
  },
};
