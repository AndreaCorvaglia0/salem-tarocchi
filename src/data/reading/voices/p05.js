// Cinque di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: cinque (qualcosa si rompe, una prova) × Denari (le cose concrete). Upright: want, hard times, the
// feeling of being left outside. Reversed: the hard times end, one asks for help and recovers.
export default {
  id: 'p05',
  up: {
    favore: -2, moto: 'ferma',
    essenza: "La mancanza: tempi duri, e sentirsi fuori.",
    amore: {
      situazione: "Ti senti fuori dal cuore di chi ami, e patisci il freddo di quella distanza.",
      origine: "Hai sofferto la mancanza di affetto, e hai creduto di non meritarne.",
      ostacolo: "Pesa la paura di restare senza nessuno, e ti fa accettare anche le briciole.",
      arrivo: "Passerete tempi duri, con pochi mezzi, e l'amore sarà messo alla prova.",
      consiglio: "Di' a chi ami che ti manca qualcosa, invece di patire in silenzio.",
    },
    lavoro: {
      situazione: "Mancano i soldi, e ogni giorno devi scegliere a che cosa rinunciare.",
      origine: "Hai perso un lavoro o un guadagno, e hai conosciuto le ristrettezze.",
      ostacolo: "Pesa la vergogna di essere nel bisogno, che ti impedisce di chiedere aiuto.",
      arrivo: "Verranno tempi magri, e dovrai farti bastare il poco che avrai.",
      consiglio: "Chiedi aiuto a chi può dartelo: una porta aperta c'è, più vicina di quanto pensi.",
    },
    casa: {
      situazione: "Si tira avanti a fatica in casa, perché manca anche il necessario.",
      origine: "Avete passato anni di ristrettezze, e in casa se ne porta ancora il segno.",
      ostacolo: "Pesa su tutti la preoccupazione per i soldi, e in casa si parla solo di quello.",
      arrivo: "Dovrete stringervi in casa per un periodo, perché i mezzi saranno pochi.",
      consiglio: "Affrontate i tempi duri tutti insieme, senza nascondere a nessuno quanto manca.",
    },
    altri: {
      situazione: "Resti fuori dal giro degli altri, e ti sembra che nessuno si accorga del tuo bisogno.",
      origine: "Qualcuno ti ha negato un aiuto quando avevi bisogno, e non l'hai dimenticato.",
      ostacolo: "Ti isola l'orgoglio: piuttosto che chiedere, fai finta che non ti manchi niente.",
      arrivo: "Chi sta meglio di te ti lascerà fuori, e vedrai chi invece ti tende la mano.",
      consiglio: "Bussa da chi ha patito le stesse difficoltà, perché saprà capirti e aiutarti.",
    },
    se: {
      situazione: "Stai attraversando tempi duri, e ti senti senza un appoggio.",
      origine: "Hai vissuto un periodo di privazioni, e ti è rimasta la paura che torni.",
      ostacolo: "Ti blocca l'idea di non valere niente, solo perché ti manca molto.",
      arrivo: "Attraverserai un momento di povertà e di fatica, che però non durerà per sempre.",
      consiglio: "Accetta l'aiuto che ti offrono, senza prenderlo per un'umiliazione.",
    },
  },
  rev: {
    favore: 1, moto: 'torna',
    essenza: "I tempi duri finiscono: chiedere aiuto e riprendersi.",
    amore: {
      situazione: "Stai uscendo da un periodo di freddo con chi ami, e torna un po' di calore.",
      origine: "Hai chiesto affetto quando ti mancava, e qualcuno ha risposto.",
      ostacolo: "Ti frena l'abitudine a fare a meno di tutto, anche di chi vorrebbe aiutarti.",
      arrivo: "Tornerà qualcuno a starti accanto, e i tempi duri sembreranno più lontani.",
      consiglio: "Lasciati aiutare da chi ti vuole bene, perché i tempi duri stanno finendo.",
    },
    lavoro: {
      situazione: "Cominci a riprenderti dopo le ristrettezze, e i conti fanno meno paura.",
      origine: "Hai trovato un aiuto quando non avevi più niente, e da lì è cominciata la ripresa.",
      ostacolo: "Resta qualche debito dei tempi duri, che rallenta la ripresa.",
      arrivo: "Troverai un lavoro o un aiuto che ti toglierà dal bisogno.",
      consiglio: "Chiedi lavoro a chi può dartene, senza vergogna, perché la ripresa comincia da lì.",
    },
    casa: {
      situazione: "Torna il necessario in casa, e le preoccupazioni per i soldi si fanno più leggere.",
      origine: "Avete superato un brutto periodo aiutandovi a vicenda, e la famiglia ne è uscita unita.",
      ostacolo: "Pesa il ricordo delle ristrettezze, e in casa si ha ancora paura di spendere.",
      arrivo: "Arriverà un aiuto per la famiglia, e in casa finiranno i tempi più duri.",
      consiglio: "Accetta per la tua famiglia l'aiuto che viene offerto, e ringrazia senza imbarazzo.",
    },
    altri: {
      situazione: "Trovi finalmente una porta aperta, e qualcuno che si accorge delle tue difficoltà.",
      origine: "Qualcuno del paese ti ha teso la mano nel momento peggiore, e ti ha dato modo di riprenderti.",
      ostacolo: "Ti trattiene l'orgoglio, e rifiuti un aiuto che ti farebbe uscire dalle difficoltà.",
      arrivo: "Riceverai aiuto da chi non ti aspetti, e ti sentirai di nuovo parte del paese.",
      consiglio: "Ricambia l'aiuto ricevuto appena puoi, e ricordati di chi ha ancora bisogno.",
    },
    se: {
      situazione: "Ritrovi le forze dopo un periodo di privazioni, un giorno alla volta.",
      origine: "Hai passato il periodo peggiore e hai chiesto aiuto, ed è stata la scelta giusta.",
      ostacolo: "Rimane la paura di tornare nel bisogno, che non ti fa godere la ripresa.",
      arrivo: "Uscirai dalle difficoltà, più lentamente di quanto speri ma per davvero.",
      consiglio: "Abbi cura di te mentre ti riprendi, e non vergognarti dei tempi duri.",
    },
  },
};
