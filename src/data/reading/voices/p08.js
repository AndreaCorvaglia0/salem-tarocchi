// Otto di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: otto (le cose si muovono: impegno) × Denari (le cose concrete). Upright: everyday diligence, a craft
// learned by practice. Reversed: repeating without heart, diligence turned into habit or fussiness.
export default {
  id: 'p08',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "L'impegno di ogni giorno: la pratica del mestiere.",
    amore: {
      situazione: "Metti impegno ogni giorno in questo legame, con tanti piccoli gesti fatti con cura.",
      origine: "Hai imparato ad amare con la pratica, sbagliando e riprovando.",
      ostacolo: "Ti frena il troppo impegno nel lavoro, che ti lascia poche ore per chi ami.",
      arrivo: "Migliorerà il vostro rapporto, grazie all'impegno che ci metterete ogni giorno.",
      consiglio: "Cura le piccole cose di ogni giorno con chi ami, perché l'amore si impara facendo.",
    },
    lavoro: {
      situazione: "Lavori con impegno, e diventi sempre più capace nel tuo mestiere.",
      origine: "Hai imparato il mestiere ripetendo lo stesso lavoro, finché ti è venuto bene.",
      ostacolo: "Manca ancora un po' di pratica: la strada è giusta, ma il mestiere chiede tempo.",
      arrivo: "Avrai molto lavoro da fare, e facendolo bene crescerà la tua bravura.",
      consiglio: "Fai bene il lavoro di oggi, pezzo dopo pezzo, senza pensare già al guadagno.",
    },
    casa: {
      situazione: "Ci si dà da fare in casa tutti i giorni, e ogni cosa è fatta con cura.",
      origine: "Avete costruito quello che avete con il lavoro di ogni giorno, senza scorciatoie.",
      ostacolo: "Pesa il tanto da fare: in casa si lavora sempre, e resta poco tempo per stare insieme.",
      arrivo: "Richiederà impegno un lavoro di casa, e il risultato vi darà soddisfazione.",
      consiglio: "Dedica ogni giorno un po' di lavoro alla casa, e fallo con cura.",
    },
    altri: {
      situazione: "Ti fai apprezzare dagli altri per l'impegno e la serietà con cui lavori.",
      origine: "Qualcuno ti ha insegnato un mestiere giorno dopo giorno, facendoti provare e riprovare.",
      ostacolo: "Ti isola il troppo impegno: hai sempre da fare, e gli amici ti vedono poco.",
      arrivo: "Troverai qualcuno con cui fare pratica nel tuo mestiere, e migliorerete insieme.",
      consiglio: "Fai pratica accanto a chi lavora bene, e mettici impegno ogni giorno.",
    },
    se: {
      situazione: "Stai facendo pratica con impegno, e ogni giorno ti riesce un po' meglio.",
      origine: "Hai dedicato molte ore a migliorare in una cosa, e la fatica ha pagato.",
      ostacolo: "Resta la fretta di essere già capace, mentre certe cose vengono solo con la pratica.",
      arrivo: "Diventerai capace in quello che fai, a forza di pratica e di impegno.",
      consiglio: "Esercitati ogni giorno in quello che vuoi saper fare, anche solo per poco.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Ripetere senza voglia: l'impegno diventa abitudine.",
    amore: {
      situazione: "Ripeti gli stessi gesti con chi ami per abitudine, senza più metterci voglia.",
      origine: "Hai messo tutto l'impegno nel lavoro, e all'amore hai dato gli avanzi.",
      ostacolo: "Ti frena la noia di un affetto diventato abitudine, in cui nessuno si impegna più.",
      arrivo: "Diventerà un'abitudine quello che c'è tra voi, se nessuno ci rimette un po' di voglia.",
      consiglio: "Fai una cosa nuova con chi ami, invece di ripetere sempre le stesse giornate.",
    },
    lavoro: {
      situazione: "Fai un lavoro sempre uguale, e ci metti le mani senza metterci la testa.",
      origine: "Hai fatto per anni lo stesso lavoro senza voglia, solo per la paga.",
      ostacolo: "Pesa la pignoleria: rifai dieci volte la stessa cosa, e non finisci niente.",
      arrivo: "Verrà a noia il lavoro che ripeti ogni giorno, e la qualità ne risentirà.",
      consiglio: "Cerca nel tuo lavoro qualcosa che ti ridia voglia, oppure cambialo.",
    },
    casa: {
      situazione: "Si trascinano in casa le faccende di sempre, fatte per dovere e senza allegria.",
      origine: "Avete tirato via un lavoro di casa senza voglia, e si vede ancora.",
      ostacolo: "Manca la voglia: in casa ognuno fa il minimo, e sempre nello stesso modo.",
      arrivo: "Sembreranno tutti uguali i giorni in casa, pieni di faccende fatte senza voglia.",
      consiglio: "Cambia qualcosa nelle abitudini di casa, perché il lavoro di sempre pesa meno se varia.",
    },
    altri: {
      situazione: "Vedi sempre le stesse persone e fai gli stessi discorsi, più per abitudine che per piacere.",
      origine: "Qualcuno ti ha fatto lavorare tanto senza insegnarti niente, e ti ha tolto la voglia.",
      ostacolo: "Ti allontana dagli altri l'abitudine di correggere sempre tutto quello che fanno.",
      arrivo: "Ti stancherai dei soliti impegni con i soliti amici, e avrai voglia d'altro.",
      consiglio: "Proponi agli amici qualcosa di diverso dal solito, per ritrovare la voglia di stare insieme.",
    },
    se: {
      situazione: "Stai girando a vuoto: ti impegni molto, ma senza più sapere perché.",
      origine: "Hai rifatto mille volte le stesse cose per farle perfette, e hai perso la voglia.",
      ostacolo: "Resta la noia di fare ogni giorno le stesse cose, senza imparare più niente.",
      arrivo: "Perderai la voglia di migliorare, se continui a ripetere quello che sai già.",
      consiglio: "Ritrova la voglia con cui hai cominciato, invece di andare avanti per abitudine.",
    },
  },
};
