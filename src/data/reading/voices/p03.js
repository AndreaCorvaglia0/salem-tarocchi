// Tre di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: tre (qualcosa cresce, insieme ad altri) × Denari (le cose concrete). Upright: work done well together,
// and recognised. Reversed: work that comes out badly because everyone goes their own way.
export default {
  id: 'p03',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "Un lavoro fatto bene insieme, e riconosciuto.",
    amore: {
      situazione: "Costruite la vostra storia insieme, un pezzo alla volta, e si vede.",
      origine: "Avete lavorato tutti e due per stare bene insieme, e il risultato c'è stato.",
      ostacolo: "Ti frena l'idea di dover fare tutto tu, quando in due verrebbe meglio.",
      arrivo: "Farete un progetto insieme, e ognuno ci metterà quello che sa fare.",
      consiglio: "Chiedi alla persona che ami di fare la sua parte, e riconosci la sua bravura.",
    },
    lavoro: {
      situazione: "Fai bene il tuo mestiere, e chi lavora con te lo riconosce.",
      origine: "Hai imparato a lavorare con altri, e la tua bravura è stata notata.",
      ostacolo: "Pesa il bisogno di mettersi d'accordo: il lavoro è buono, ma ognuno dice la sua.",
      arrivo: "Riceverai un incarico da svolgere con altri, e il tuo lavoro sarà apprezzato.",
      consiglio: "Lavora insieme a chi ne sa quanto te, e ascolta anche i loro consigli.",
    },
    casa: {
      situazione: "Collaborano tutti in casa, e ciascuno fa bene la sua parte.",
      origine: "Avete tirato su la casa con il lavoro di tutti, un poco per ciascuno.",
      ostacolo: "Manca un piano comune: in famiglia la buona volontà c'è, ma va messa insieme.",
      arrivo: "Sistemerete la casa insieme, e il lavoro riuscirà meglio del previsto.",
      consiglio: "Dai a ognuno in famiglia un compito adatto, e loda il lavoro fatto bene.",
    },
    altri: {
      situazione: "Godi della stima del paese per come lavori, e la gente ti cerca.",
      origine: "Hai dato una mano a un lavoro comune, e da allora ti stimano.",
      ostacolo: "Ti trattiene la paura del giudizio di chi guarda il tuo lavoro.",
      arrivo: "Qualcuno riconoscerà la tua bravura davanti a tutti, e ti chiederà di lavorare insieme.",
      consiglio: "Unisciti a chi sta costruendo qualcosa, e porta quello che sai fare meglio.",
    },
    se: {
      situazione: "Stai mettendo a frutto quello che sai fare, e gli altri se ne accorgono.",
      origine: "Hai avuto buoni maestri, e hai imparato che il lavoro riesce meglio in compagnia.",
      ostacolo: "Resta l'abitudine di fare per conto tuo, anche quando un aiuto migliorerebbe il lavoro.",
      arrivo: "Vedrai riconosciuto il tuo impegno, e capirai quanto vale lavorare con altri.",
      consiglio: "Mostra il tuo lavoro a chi può giudicarlo, e accetta le correzioni.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Un lavoro riuscito male: ognuno per conto suo.",
    amore: {
      situazione: "Fate ognuno per conto suo, e la vostra storia va avanti alla meno peggio.",
      origine: "Hai messo poco impegno in un legame, e l'altra persona ha fatto lo stesso.",
      ostacolo: "Vi frena la poca voglia di venirvi incontro, e ognuno tira dalla sua parte.",
      arrivo: "Verrà fuori che non state lavorando alla stessa cosa, e bisognerà parlarne.",
      consiglio: "Rimettiti d'accordo con chi ami su che cosa volete costruire insieme.",
    },
    lavoro: {
      situazione: "Lavori senza voglia e per conto tuo, e il risultato è appena passabile.",
      origine: "Hai lavorato con gente che non collaborava, e il lavoro è riuscito male.",
      ostacolo: "Pesa il poco accordo tra chi lavora con te: ognuno fa per conto suo.",
      arrivo: "Consegnerai un lavoro riuscito male, fatto in fretta e senza l'aiuto di nessuno.",
      consiglio: "Rifai con più cura quello che hai tirato via, e chiedi aiuto a chi sa.",
    },
    casa: {
      situazione: "Tirano tutti da parti diverse in casa, e i lavori restano a metà.",
      origine: "Avete fatto un lavoro in casa senza mettervi d'accordo, ed è venuto male.",
      ostacolo: "Manca la collaborazione in famiglia: uno fa, e gli altri stanno a guardare.",
      arrivo: "Nascerà una discussione su chi fa che cosa, perché il lavoro di casa pesa su pochi.",
      consiglio: "Riunisci la famiglia e dividete i compiti, invece di fare e brontolare.",
    },
    altri: {
      situazione: "Fatichi a lavorare con gli altri, e preferisci arrangiarti anche quando sbagli.",
      origine: "Qualcuno non ha riconosciuto il tuo lavoro, e ti è passata la voglia di collaborare.",
      ostacolo: "Ti danneggia chi lavora male accanto a te, perché il risultato è di tutti.",
      arrivo: "Mancherà l'accordo in un'impresa comune, e ognuno finirà per andare per la sua strada.",
      consiglio: "Scegli meglio con chi lavorare, e chiarisci prima chi deve fare che cosa.",
    },
    se: {
      situazione: "Stai facendo le cose male e per conto tuo, e sai che potresti farle meglio.",
      origine: "Hai rifiutato i consigli di chi ne sapeva di più, e il lavoro ne ha risentito.",
      ostacolo: "Resta la convinzione di non avere niente da imparare, che ti fa lavorare peggio.",
      arrivo: "Ti accontenterai di un lavoro mediocre, e in fondo ti dispiacerà.",
      consiglio: "Metti più cura in quello che fai, e lascia che qualcuno ti corregga.",
    },
  },
};
