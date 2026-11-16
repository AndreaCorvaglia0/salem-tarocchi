// Sette di Spade. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: sette (una prova, un dubbio) × Spade (la mente). Upright: a move made on the sly, cunning or deceit.
// Reversed: the trick is found out, and it is time to confess and give back.
export default {
  id: 's07',
  up: {
    favore: -1, moto: 'ferma',
    essenza: "Una mossa di nascosto: furbizia, o inganno.",
    amore: {
      situazione: "C'è qualcosa di nascosto tra voi, e uno dei due non dice tutta la verità.",
      origine: "Hai tenuto un segreto a chi amavi, pensando che fosse più furbo così.",
      ostacolo: "Ti frena un sospetto: senti che in questo amore qualcuno fa il furbo.",
      arrivo: "Scoprirai un piccolo inganno in amore, oppure sarai tu a nascondere qualcosa.",
      consiglio: "Guarda bene se chi ami ti nasconde qualcosa, e chiediti se lo fai anche tu.",
    },
    lavoro: {
      situazione: "Qualcuno intorno al tuo lavoro agisce di nascosto, e non tutto è come sembra.",
      origine: "Avevi ottenuto un vantaggio con la furbizia, per una via poco diritta.",
      ostacolo: "Pesa su un affare un inganno, o una furbizia che potrebbe ritorcersi contro.",
      arrivo: "Servirà astuzia per cavartela in un affare, ma senza passare all'inganno.",
      consiglio: "Controlla i conti e le promesse, perché qualcuno potrebbe fare il furbo.",
    },
    casa: {
      situazione: "Si nasconde qualcosa in casa, e chi lo fa crede che nessuno se ne accorga.",
      origine: "Qualcuno in famiglia ha preso o deciso una cosa di nascosto dagli altri.",
      ostacolo: "Resta in casa un segreto che mette diffidenza, anche tra chi si vuole bene.",
      arrivo: "Capiterà in famiglia una mossa fatta di nascosto, da chi pensa di essere più furbo.",
      consiglio: "Tieni gli occhi aperti sulle cose di casa, senza accusare nessuno di inganno prima di sapere.",
    },
    altri: {
      situazione: "Hai vicino una persona furba, che sorride e intanto fa i suoi interessi.",
      origine: "Ti hanno raccontato una bugia con belle parole, e te ne ricordi bene.",
      ostacolo: "Ti danneggia chi parla di nascosto alle tue spalle, e in faccia si mostra amico.",
      arrivo: "Incontrerai qualcuno che cercherà di raggirarti con la furbizia, e dovrai fare attenzione.",
      consiglio: "Guardati dai furbi, e non raccontare i tuoi piani a chiunque.",
    },
    se: {
      situazione: "Stai cercando una scorciatoia furba, e speri che nessuno se ne accorga.",
      origine: "Hai preferito la furbizia alla franchezza, e per un po' ha funzionato.",
      ostacolo: "Inganni prima di tutto te, quando ti racconti che va tutto bene.",
      arrivo: "Avrai la tentazione di cavartela con un trucco, e di fare le cose di nascosto.",
      consiglio: "Usa pure la furbizia, ma lascia stare quello che dovresti fare di nascosto.",
    },
  },
  rev: {
    favore: 0, moto: 'torna',
    essenza: "Il trucco è scoperto: confessare e restituire.",
    amore: {
      situazione: "Sta venendo fuori un segreto tra voi, e non si può più fare finta di niente.",
      origine: "Hai confessato una bugia a chi amavi, e dirla ti ha tolto un peso.",
      ostacolo: "Ti pesa una cosa nascosta, che prima o poi verrà scoperta comunque.",
      arrivo: "Verrà scoperto un inganno in amore, e ci sarà da dire tutta la verità.",
      consiglio: "Confessa quello che hai tenuto nascosto, prima che si scopra per altre vie.",
    },
    lavoro: {
      situazione: "Esce allo scoperto una furbizia nel lavoro, e chi l'ha fatta deve risponderne.",
      origine: "Avevi provato un trucco che è stato scoperto, e hai dovuto rimediare e restituire.",
      ostacolo: "Resta da restituire qualcosa preso senza diritto, e fino ad allora l'affare non riparte.",
      arrivo: "Scoprirai chi faceva il furbo alle tue spalle, e potrai riprenderti il tuo.",
      consiglio: "Restituisci quello che non è tuo, e rimetti le cose in chiaro.",
    },
    casa: {
      situazione: "Si scopre in casa quello che qualcuno nascondeva, e bisogna parlarne.",
      origine: "Un inganno è stato confessato in famiglia, e chi l'aveva fatto ha chiesto perdono.",
      ostacolo: "Pesa in casa la sfiducia dopo una bugia scoperta, e ci vuole tempo per ricucire.",
      arrivo: "Tornerà a casa una cosa presa di nascosto, insieme a qualche spiegazione.",
      consiglio: "Lascia a chi ha sbagliato in casa il modo di confessare, senza umiliarlo.",
    },
    altri: {
      situazione: "Vedi finalmente chi faceva il doppio gioco in paese, perché il trucco è stato scoperto.",
      origine: "Hai scoperto l'inganno di una persona falsa, e gli altri ti hanno dato ragione.",
      ostacolo: "Ti frena la vergogna per una furbizia venuta a galla, e non sai come rimediare.",
      arrivo: "Qualcuno verrà a confessarti un torto, e ti restituirà quello che ti doveva.",
      consiglio: "Ammetti la tua furbizia davanti a chi l'ha subita, e rimedia come puoi.",
    },
    se: {
      situazione: "Stai smettendo di raccontarti bugie, e scopri le cose come sono.",
      origine: "Hai capito che ingannavi soprattutto te, e hai deciso di cambiare.",
      ostacolo: "Ti trattiene la paura che si scopra una tua bugia, e vivi sempre in allarme.",
      arrivo: "Verrà il momento di confessare una cosa nascosta, e sarà un sollievo.",
      consiglio: "Togliti il peso di un segreto, confessandolo a chi ha diritto di saperlo.",
    },
  },
};
