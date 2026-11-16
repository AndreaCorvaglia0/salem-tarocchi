// Cinque di Spade. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: cinque (qualcosa si rompe) × Spade (parole e conflitti). Upright: a quarrel won badly, a victory
// that costs too much. Reversed: after the quarrel, making peace or keeping the grudge.
export default {
  id: 's05',
  up: {
    favore: -1, moto: 'chiude',
    essenza: "Una lite vinta male: la vittoria è amara.",
    amore: {
      situazione: "Vuoi vincere ogni lite con chi ami, e intanto quella persona si allontana.",
      origine: "Hai vinto una discussione con chi amavi, e ti è rimasto l'amaro in bocca.",
      ostacolo: "Ti frena l'orgoglio, che in ogni lite ti fa cercare la vittoria e non la pace.",
      arrivo: "Verrà una lite in cui uno dei due vincerà, e ci perderete entrambi.",
      consiglio: "Rinuncia a vincere questa lite, se ci tieni più alla persona che alla ragione.",
    },
    lavoro: {
      situazione: "Stai vincendo una contesa nel lavoro, ma a un prezzo troppo alto.",
      origine: "Hai avuto la meglio su un rivale, e da quella vittoria ti guardano con diffidenza.",
      ostacolo: "Pesa un conflitto in cui ognuno pensa solo a vincere, e nessuno si fida più.",
      arrivo: "Otterrai quello che vuoi con uno scontro, e ti chiederai se ne valeva la pena.",
      consiglio: "Scegli con cura per che cosa litigare, perché questa vittoria ti costerebbe troppo.",
    },
    casa: {
      situazione: "C'è aria di lite in casa, e chi alza di più la voce crede di vincere.",
      origine: "Qualcuno in famiglia l'ha avuta vinta con prepotenza, e gli altri non hanno dimenticato.",
      ostacolo: "Resta l'amarezza di una lite finita male, che in casa ha lasciato vincitori e vinti.",
      arrivo: "Scoppierà una lite in famiglia, e chi la vincerà non ne sarà contento.",
      consiglio: "Cedi su una cosa piccola con i tuoi, perché vincere una lite in casa non paga.",
    },
    altri: {
      situazione: "Ti trovi in mezzo a una contesa dove si gioca sporco, e nessuno vince davvero.",
      origine: "Hai umiliato qualcuno in una discussione, e quella vittoria ti è costata un'amicizia.",
      ostacolo: "Ti isola la fama di chi vuole sempre vincere, e gli altri evitano di contraddirti.",
      arrivo: "Qualcuno cercherà di vincere su di te con le parole, a costo di rompere i rapporti.",
      consiglio: "Lascia perdere chi vuole solo litigare, e vattene senza voltarti a ribattere.",
    },
    se: {
      situazione: "Litighi con tutti per dimostrare qualcosa, e di ogni vittoria ti resta poco.",
      origine: "Avevi bisogno di vincere sempre, e così hai perso persone che contavano.",
      ostacolo: "Manca l'umiltà di ammettere una sconfitta, e questo ti tiene dentro la lite.",
      arrivo: "Capirai che una vittoria ti è costata troppo, e ne sentirai l'amarezza.",
      consiglio: "Chiediti che cosa vinci davvero, prima di buttarti nella prossima lite.",
    },
  },
  rev: {
    favore: 0, moto: 'torna',
    essenza: "Dopo la lite: fare pace, o serbare rancore.",
    amore: {
      situazione: "Vi state riavvicinando dopo una lite, anche se un po' di rancore resta.",
      origine: "Hai chiesto scusa dopo un brutto litigio, e la pace è tornata a fatica.",
      ostacolo: "Ti frena il rancore per le parole di una vecchia lite, che non riesci a dimenticare.",
      arrivo: "Farete pace dopo la lite, se uno dei due avrà il coraggio di cedere.",
      consiglio: "Smetti di tenere il conto dei torti, e proponi la pace senza condizioni.",
    },
    lavoro: {
      situazione: "Stai cercando la pace dopo un conflitto di lavoro, e accetti di cedere qualcosa.",
      origine: "Avevi una lite aperta con un rivale, e avete finito per stringervi la mano.",
      ostacolo: "Cova ancora un rancore tra chi lavora con te, e basta poco per riaccendere la lite.",
      arrivo: "Si chiuderà una contesa di lavoro con una pace a metà, senza vincitori.",
      consiglio: "Ammetti la tua parte di torto in quella lite, e proponi di ricominciare.",
    },
    casa: {
      situazione: "Torna la pace in casa dopo le liti, anche se qualcuno tiene ancora il muso.",
      origine: "La pace in famiglia è tornata perché qualcuno ha ceduto, senza essere convinto.",
      ostacolo: "Resta in casa un rancore non detto, che rende fredda la pace.",
      arrivo: "Finiranno le liti in famiglia, quando ognuno avrà ammesso i suoi sbagli.",
      consiglio: "Metti fine alla lite di casa con una parola gentile, anche se hai ragione.",
    },
    altri: {
      situazione: "Cerchi di fare pace con qualcuno in paese, e non sai se si fida ancora.",
      origine: "Hai perso una lite davanti a tutti, e hai dovuto mandare giù il rancore.",
      ostacolo: "Ti pesa un rancore che in paese dura da troppo, e nessuno vuole cedere.",
      arrivo: "Qualcuno verrà a chiederti pace dopo una lite, e starà a te rispondere.",
      consiglio: "Lascia cadere il rancore verso un vicino, e salutalo come prima della lite.",
    },
    se: {
      situazione: "Senti il peso di una lite passata, e vorresti fare pace con chi hai offeso.",
      origine: "Hai capito tardi che vincere la lite non bastava, e ti è dispiaciuto.",
      ostacolo: "Ti rode ancora una sconfitta, e il rancore ti toglie la pace.",
      arrivo: "Riuscirai a fare pace con una vecchia sconfitta, e il rancore si spegnerà.",
      consiglio: "Arrenditi dove non c'è niente da vincere, e non portarti dietro il rancore.",
    },
  },
};
