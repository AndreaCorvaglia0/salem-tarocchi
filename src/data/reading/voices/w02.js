// Due di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: due (coppia, scelta) × Bastoni (la volontà). Upright: a plan is ready and one must choose
// whether to stay or set out. Reversed: the plan stays put, held back by the fear of leaving what is known.
export default {
  id: 'w02',
  up: {
    favore: 1, moto: 'inizia',
    essenza: "Un piano pronto, e una scelta: restare o partire.",
    amore: {
      situazione: "Stai facendo piani per due, e devi scegliere se fare il passo.",
      origine: "Hai scelto di guardare più lontano, e hai conosciuto qualcuno fuori dal tuo giro.",
      ostacolo: "Ti frena la scelta tra un amore sicuro e uno ancora da scoprire.",
      arrivo: "Verrà il momento di scegliere, e saprai che cosa vuoi da questa storia.",
      consiglio: "Decidi che cosa vuoi per il futuro, e dillo a chi ami.",
    },
    lavoro: {
      situazione: "Hai un piano pronto, e stai decidendo se è tempo di partire.",
      origine: "Avevi fatto bene i tuoi conti, e hai scelto di puntare più in alto.",
      ostacolo: "Ti tiene sul posto la scelta tra un guadagno sicuro e un progetto più grande.",
      arrivo: "Troverai due strade di lavoro, e un buon piano ti aiuterà a scegliere.",
      consiglio: "Prepara bene il piano prima di muoverti, e poi scegli senza voltarti.",
    },
    casa: {
      situazione: "Si fanno progetti in casa, e c'è da decidere se restare o cambiare.",
      origine: "Avete discusso a lungo di un cambiamento, e avete scelto insieme che cosa fare.",
      ostacolo: "Pesa una decisione rimasta a metà, tra chi vuole restare e chi vuole partire.",
      arrivo: "Farete piani per il futuro della famiglia, e ci sarà una scelta da fare.",
      consiglio: "Metti il piano sul tavolo, e scegli con i tuoi da che parte andare.",
    },
    altri: {
      situazione: "Guardi oltre la solita compagnia, e stai scegliendo con chi fare progetti.",
      origine: "Qualcuno ti ha proposto un progetto in due, e hai dovuto scegliere.",
      ostacolo: "Ti divide la scelta tra due compagnie, e non vuoi scontentare nessuno.",
      arrivo: "Arriverà una proposta da qualcuno di lontano, e dovrai decidere se accettarla.",
      consiglio: "Scegli con chi vuoi fare progetti, e parlane apertamente.",
    },
    se: {
      situazione: "Sai dove vorresti arrivare e hai un piano, ma ti manca la decisione.",
      origine: "Hai capito che il tuo posto ti andava stretto, e hai cominciato a fare piani.",
      ostacolo: "Resta da fare la scelta, perché guardi lontano ma esiti a partire.",
      arrivo: "Vedrai con chiarezza le tue possibilità, e sceglierai quale strada prendere.",
      consiglio: "Pensa a dove vuoi arrivare, e fai un piano prima di muoverti.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Il piano resta fermo, per paura di partire.",
    amore: {
      situazione: "Rimandi una scelta in amore, perché hai paura di lasciare quello che conosci.",
      origine: "Avevate fatto piani insieme, e all'ultimo qualcuno ha cambiato idea.",
      ostacolo: "Ti frena la paura di fare il passo, e la storia resta ferma.",
      arrivo: "Cambieranno all'ultimo i piani che avevate fatto, e bisognerà riparlarne.",
      consiglio: "Chiediti che cosa ti fa paura, prima di rinunciare a un progetto in due.",
    },
    lavoro: {
      situazione: "Tieni fermo un piano che era pronto, e non ti decidi a rischiare.",
      origine: "Hai preferito il posto sicuro, e il tuo progetto è rimasto chiuso in un cassetto.",
      ostacolo: "Ti blocca la paura di sbagliare, e rifai i conti senza partire mai.",
      arrivo: "Salterà un piano su cui contavi, e dovrai pensarne un altro.",
      consiglio: "Fai un passo piccolo fuori dal sicuro, senza aspettare il piano perfetto.",
    },
    casa: {
      situazione: "Restate fermi in casa su una decisione, perché nessuno vuole cambiare per primo.",
      origine: "Avete rinunciato a un cambiamento per prudenza, e il progetto è rimasto lì.",
      ostacolo: "Pesa la paura di lasciare la casa di sempre, e i progetti restano fermi.",
      arrivo: "Verrà rimandato un progetto di famiglia, e qualcuno ci resterà male.",
      consiglio: "Parla in casa del piano fermo, e chiedi a ognuno che cosa teme.",
    },
    altri: {
      situazione: "Resti nel tuo giro di sempre, e lasci cadere le proposte di chi viene da fuori.",
      origine: "Qualcuno ti aveva offerto di partire insieme, e hai detto di no per prudenza.",
      ostacolo: "Ti trattiene il timore di quello che dirà la gente, e non scegli.",
      arrivo: "Sfumerà un progetto fatto con altri, perché qualcuno avrà paura di partire.",
      consiglio: "Esci dalla solita cerchia almeno una volta, e guarda che cosa c'è fuori.",
    },
    se: {
      situazione: "Stai al riparo e guardi lontano, ma la paura ti tiene dove sei.",
      origine: "Hai lasciato passare un'occasione di partire, e ancora ci ripensi.",
      ostacolo: "Manca il coraggio più del piano, perché sai che cosa fare e resti dove sei.",
      arrivo: "Capirai che il piano va cambiato, e partirai più tardi del previsto.",
      consiglio: "Smetti di rifare i piani, e muovi il primo passo anche con la paura.",
    },
  },
};
