// Quattro di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: quattro (sosta) × Bastoni (la volontà). Upright: a happy pause, a milestone celebrated at home
// on solid ground. Reversed: the celebration is put off, there is tension under the garlands, the ground is shaky.
export default {
  id: 'w04',
  up: {
    favore: 2, moto: 'ferma',
    essenza: "Una sosta felice: si festeggia un traguardo.",
    amore: {
      situazione: "Vivi un periodo felice e stabile in amore, e c'è qualcosa da festeggiare.",
      origine: "Avete festeggiato insieme un passo importante, e vi ha dato una base sicura.",
      ostacolo: "Ti frena il pensiero che la festa finisca presto, proprio mentre siete al traguardo.",
      arrivo: "Arriverà una festa per voi due, per un traguardo raggiunto insieme.",
      consiglio: "Festeggia quello che avete costruito insieme, senza pensare già al dopo.",
    },
    lavoro: {
      situazione: "Tocchi un primo traguardo nel lavoro, e puoi fermarti a goderlo.",
      origine: "Hai chiuso bene un lavoro, e ne hai ricavato una base solida.",
      ostacolo: "Ti frena la voglia di riposare sul traguardo raggiunto, e il resto aspetta.",
      arrivo: "Raggiungerai un traguardo, e ci sarà una stabilità da festeggiare.",
      consiglio: "Concediti una sosta dopo la fatica, e festeggia con chi ha lavorato con te.",
    },
    casa: {
      situazione: "Si festeggia un traguardo in casa, e la famiglia sta bene insieme.",
      origine: "C'era a casa tua l'abitudine di festeggiare insieme ogni traguardo.",
      ostacolo: "Pesa la paura di rovinare l'armonia di casa, e nessuno osa cambiare niente.",
      arrivo: "Verrà una festa in famiglia, e la casa si riempirà di gente contenta.",
      consiglio: "Apri la casa e invita tutti, perché c'è un traguardo da festeggiare.",
    },
    altri: {
      situazione: "Stai bene tra la tua gente, e ti senti a casa in mezzo a loro.",
      origine: "Hai trovato un paese che ti ha fatto festa, e ci hai messo radici.",
      ostacolo: "Ti tiene al caldo la festa con la solita compagnia, e fuori da lì non ti muovi.",
      arrivo: "Sarai tra quelli che festeggiano un traguardo, e ritroverai persone care.",
      consiglio: "Raduna gli amici per festeggiare, anche se il motivo è piccolo.",
    },
    se: {
      situazione: "Senti di avere una base sicura, e ti godi quello che hai costruito.",
      origine: "Hai raggiunto un traguardo che contava, e su quello hai costruito il resto.",
      ostacolo: "Resta la tentazione di fermarti qui, dove stai bene, e non cercare altro.",
      arrivo: "Troverai un posto dove sentirti a casa, e avrai un motivo per fare festa.",
      consiglio: "Fermati a guardare la strada fatta, e festeggia il traguardo raggiunto.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "La festa è rimandata: la stabilità traballa.",
    amore: {
      situazione: "Rimandate un passo che volevate festeggiare, e tra voi c'è un po' di tensione.",
      origine: "Avevate un progetto di vita insieme, e la festa è stata rimandata.",
      ostacolo: "Ti frena una base poco sicura, perché la storia c'è ma traballa.",
      arrivo: "Slitterà una festa o una promessa, e dovrete prima chiarire qualcosa.",
      consiglio: "Sistema quello che traballa tra voi, prima di pensare a festeggiare.",
    },
    lavoro: {
      situazione: "Stai lavorando su una base poco stabile, e il traguardo si allontana.",
      origine: "Hai festeggiato troppo presto un affare, e poi non è andato in porto.",
      ostacolo: "Manca la stabilità, e quello che hai costruito non ti fa stare in pace.",
      arrivo: "Tarderà un traguardo che credevi vicino, e la festa dovrà aspettare.",
      consiglio: "Rinforza le basi del tuo lavoro, prima di dire che il traguardo è raggiunto.",
    },
    casa: {
      situazione: "C'è tensione in casa sotto l'apparenza serena, e una festa è stata rimandata.",
      origine: "Avete vissuto un periodo instabile in famiglia, tra traslochi e discussioni.",
      ostacolo: "Pesa in casa un malumore che nessuno nomina, e rovina i momenti insieme.",
      arrivo: "Verrà un momento di tensione in casa, proprio quando volevate festeggiare.",
      consiglio: "Rimanda pure la festa, ma riporta la pace in casa.",
    },
    altri: {
      situazione: "Ti senti fuori posto tra la tua gente, come a una festa senza invito.",
      origine: "Qualcuno è mancato a una festa a cui tenevi, e ti è dispiaciuto molto.",
      ostacolo: "Ti pesa un'accoglienza fredda, e fatichi a sentirti a casa tra loro.",
      arrivo: "Salterà una festa che aspettavi, e la compagnia si vedrà meno.",
      consiglio: "Cerca chi ti fa sentire a casa, anche se la compagnia è cambiata.",
    },
    se: {
      situazione: "Senti la terra poco ferma sotto i piedi, e fatichi a goderti i traguardi.",
      origine: "Hai cambiato casa o abitudini, e per un po' hai perso i tuoi punti fermi.",
      ostacolo: "Resta un senso di instabilità, che ti toglie il gusto di festeggiare.",
      arrivo: "Passerai un periodo poco stabile, e avrai poca voglia di far festa.",
      consiglio: "Costruisci una base tua, piccola ma sicura, e festeggia i piccoli traguardi.",
    },
  },
};
