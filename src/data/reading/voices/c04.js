// Quattro di Coppe. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: quattro (ci si ferma) × Coppe (il cuore). Upright: the heart stands still, boredom hides an offer.
// Reversed: the boredom lifts, the offer is seen and the will comes back.
export default {
  id: 'c04',
  up: {
    favore: -1, moto: 'ferma',
    essenza: "Il cuore fermo: noia, e un'offerta non vista.",
    amore: {
      situazione: "Provi noia in amore, e non vedi l'affetto che qualcuno ti sta offrendo.",
      origine: "Hai lasciato cadere un'offerta d'amore, perché niente ti sembrava abbastanza.",
      ostacolo: "Ti frena la svogliatezza: guardi quello che manca, e chi ti cerca non lo noti.",
      arrivo: "Verrà qualcuno a offrirti il suo affetto, e rischierai di non farci caso.",
      consiglio: "Alza gli occhi da quello che ti annoia, e guarda chi ti offre qualcosa.",
    },
    lavoro: {
      situazione: "Fai il tuo lavoro senza voglia, e un'occasione buona ti passa accanto.",
      origine: "Hai rifiutato una proposta per noia, senza nemmeno starla a sentire.",
      ostacolo: "Pesa la noia di fare sempre le stesse cose, e ti toglie la voglia di cercare altro.",
      arrivo: "Arriverà un'offerta di lavoro in un momento in cui avrai poca voglia di ascoltarla.",
      consiglio: "Ascolta fino in fondo quello che ti propongono, prima di dire che non ti interessa.",
    },
    casa: {
      situazione: "C'è noia in casa: ognuno sta per conto suo, e le giornate sono tutte uguali.",
      origine: "Avete vissuto in casa un periodo fermo, di noia, in cui nessuno aveva voglia di niente.",
      ostacolo: "Resta in casa uno scontento senza motivo, e le cose buone nessuno le nota più.",
      arrivo: "Verranno giornate di noia in famiglia, e un gesto gentile passerà senza risposta.",
      consiglio: "Siediti a tavola con gli altri anche se non ne hai voglia, e ascolta che cosa propongono.",
    },
    altri: {
      situazione: "Stai in disparte, senza voglia di vedere nessuno, e rifiuti ogni invito.",
      origine: "Qualcuno ti ha offerto la sua compagnia, e tu per svogliatezza hai detto di no.",
      ostacolo: "Ti annoiano le solite facce, e così non vedi chi avrebbe qualcosa di nuovo da offrirti.",
      arrivo: "Riceverai un invito che ti sembrerà noioso, e che varrebbe la pena accettare.",
      consiglio: "Esci di casa quando ti invitano, anche di malavoglia, e guarda che cosa succede.",
    },
    se: {
      situazione: "Niente ti accontenta, e per la noia non vedi le cose buone che hai davanti.",
      origine: "Hai rimuginato a lungo nella noia, e intanto le occasioni passavano.",
      ostacolo: "Ti trattiene la noia: aspetti che qualcosa ti scuota, e non muovi un dito.",
      arrivo: "Attraverserai un periodo di svogliatezza, in cui dovrai badare a non perdere un'occasione.",
      consiglio: "Guarda con attenzione quello che ti viene offerto, invece di contare quello che manca.",
    },
  },
  rev: {
    favore: 1, moto: 'torna',
    essenza: "La noia passa: vedi l'offerta, e torna la voglia.",
    amore: {
      situazione: "Stai uscendo dalla noia, e ti accorgi di chi ti voleva bene da tempo.",
      origine: "Hai capito tardi quanto valeva un affetto che ti veniva offerto, e l'hai accolto.",
      ostacolo: "Ti frena un resto di svogliatezza: l'offerta la vedi, ma tardi a rispondere.",
      arrivo: "Tornerà la voglia di amare, e accetterai un affetto che prima lasciavi cadere.",
      consiglio: "Rispondi a chi ti cerca, visto che la voglia è tornata.",
    },
    lavoro: {
      situazione: "Ritrovi la voglia di fare, e guardi con occhi nuovi una proposta lasciata da parte.",
      origine: "Hai ripreso in mano un'offerta che avevi scartato, e hai fatto bene.",
      ostacolo: "Resta il dubbio che l'offerta buona sia già passata, mentre tu guardavi altrove.",
      arrivo: "Arriverà un'occasione nuova, e questa volta la vedrai in tempo per prenderla.",
      consiglio: "Accetta la proposta che avevi messo da parte, se è ancora valida.",
    },
    casa: {
      situazione: "Si risveglia la casa dopo un periodo di noia, e torna la voglia di stare insieme.",
      origine: "Avete avuto mesi di noia, in casa, finché qualcuno ha proposto una cosa nuova.",
      ostacolo: "Pesa ancora un po' di pigrizia: la voglia è tornata, ma in casa ci si muove piano.",
      arrivo: "Finirà la noia in famiglia, e accoglierete volentieri una novità.",
      consiglio: "Proponi tu qualcosa da fare insieme, dato che in casa la noia è finita.",
    },
    altri: {
      situazione: "Torni ad avere voglia di gente, e accetti gli inviti che prima rifiutavi.",
      origine: "Qualcuno ha insistito per tirarti fuori di casa, e alla fine hai detto di sì.",
      ostacolo: "Ti imbarazza tornare da chi avevi trascurato per noia, e rimandi la visita.",
      arrivo: "Riceverai di nuovo un invito, e questa volta avrai voglia di andarci.",
      consiglio: "Ringrazia chi ha continuato a invitarti quando non avevi voglia, e fatti vedere più spesso.",
    },
    se: {
      situazione: "Senti che la noia sta passando, e torni a vedere le possibilità che hai.",
      origine: "Hai smesso di guardare quello che ti mancava, e ti è tornata la voglia.",
      ostacolo: "Ti manca ancora la spinta per muoverti, anche se le occasioni ormai le vedi.",
      arrivo: "Uscirai dalla noia, e coglierai un'occasione che avevi sotto gli occhi.",
      consiglio: "Cogli la prima occasione buona che vedi, senza aspettare di averne voglia del tutto.",
    },
  },
};
