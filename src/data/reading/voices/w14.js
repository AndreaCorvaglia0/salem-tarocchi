// Re di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Who × suit: Re (chi governa) × Bastoni (la volontà). Upright: a leader with a vision, who gets things started
// and takes others along. Reversed: the same command turned overbearing and impatient, ordering without listening.
export default {
  id: 'w14',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "Chi guida gli altri e fa partire le cose.",
    amore: {
      situazione: "Guidi tu la storia con decisione, e chi ami si fida di te.",
      origine: "Hai preso tu l'iniziativa in amore, e hai saputo dove guidare la storia.",
      ostacolo: "Ti frena l'abitudine a guidare sempre tu, anche quando servirebbe seguire.",
      arrivo: "Arriverà una persona decisa e generosa, che saprà guidare la storia.",
      consiglio: "Prendi tu la guida e di' chiaramente dove vuoi che vada la storia.",
    },
    lavoro: {
      situazione: "Stai guidando un progetto con mano sicura, e gli altri ti seguono.",
      origine: "Hai avviato un'attività con una visione chiara, e hai convinto altri a seguirti.",
      ostacolo: "Pesa la responsabilità di chi guida, perché tutti aspettano che decida tu.",
      arrivo: "Avrai un ruolo di guida nel lavoro, e saprai far partire le cose.",
      consiglio: "Mettiti alla guida del progetto, e affida a ognuno il suo compito.",
    },
    casa: {
      situazione: "Fai da guida alla famiglia, e in casa tutti contano sulle tue decisioni.",
      origine: "C'era in famiglia una persona autorevole e generosa, che faceva da guida a tutti.",
      ostacolo: "Dipende tutto da una sola guida in casa, e senza di lei niente si muove.",
      arrivo: "Toccherà a te guidare la famiglia in una decisione importante, e lo farai bene.",
      consiglio: "Decidi con fermezza per il bene della casa, come fa una buona guida.",
    },
    altri: {
      situazione: "Guidi il gruppo con il tuo esempio, e la gente ti ascolta.",
      origine: "Qualcuno di autorevole ha creduto in te, e ti ha fatto da guida.",
      ostacolo: "Ti isola il ruolo di capo, perché tutti ti seguono e pochi ti parlano alla pari.",
      arrivo: "Troverai una guida esperta e leale, oppure sarai tu a guidare gli altri.",
      consiglio: "Fai tu il primo passo davanti a tutti, e gli altri ti verranno dietro.",
    },
    se: {
      situazione: "Sai dove vuoi andare, e governi la tua vita con mano ferma.",
      origine: "Hai imparato a decidere con la tua testa, e a guidare la tua vita.",
      ostacolo: "Resta difficile delegare, per chi è abituato a guidare come te.",
      arrivo: "Prenderai in mano la tua strada, con l'audacia di chi guida.",
      consiglio: "Comportati da guida della tua vita, e mantieni la parola data.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Chi comanda senza ascoltare: prepotenza e impazienza.",
    amore: {
      situazione: "Vuoi comandare tu nella storia, e non ascolti chi ami.",
      origine: "Hai amato qualcuno che comandava senza ascoltare, e hai obbedito troppo a lungo.",
      ostacolo: "Ti frena la prepotenza, perché imponi i tuoi tempi e l'altra persona si chiude.",
      arrivo: "Verrà uno scontro con chi ami, perché nessuno dei due vorrà ascoltare l'altro.",
      consiglio: "Ascolta chi ami prima di decidere, e rinuncia ad avere sempre ragione.",
    },
    lavoro: {
      situazione: "Comandi con impazienza nel lavoro, e chi lavora con te non osa parlare.",
      origine: "Hai visto il lavoro guastarsi per colpa di chi decideva tutto senza ascoltare nessuno.",
      ostacolo: "Guasta il lavoro la tua impazienza: dai ordini uno sull'altro, e nessuno riesce a seguirti.",
      arrivo: "Avrai a che fare con un capo prepotente, che vorrà le cose a modo suo.",
      consiglio: "Chiedi il parere degli altri prima di dare ordini, e l'opera riuscirà meglio.",
    },
    casa: {
      situazione: "C'è in casa chi comanda a voce alta, e gli altri obbediscono controvoglia.",
      origine: "Avete avuto in famiglia un padrone più che una guida, e ne restano i segni.",
      ostacolo: "Pesa in casa la prepotenza di chi non ammette repliche, nemmeno sulle piccole cose.",
      arrivo: "Nascerà in casa una ribellione contro chi comanda troppo, e servirà ascoltarsi.",
      consiglio: "Lascia decidere anche gli altri in casa, senza comandare su tutto.",
    },
    altri: {
      situazione: "Imponi le tue idee al gruppo senza ascoltare, e la gente comincia a evitarti.",
      origine: "Qualcuno di potente ti ha dato ordini senza ascoltarti, e ti è rimasta la rabbia.",
      ostacolo: "Ti mette contro tutti il tono di comando, anche quando hai ragione.",
      arrivo: "Incontrerai un prepotente che vorrà dettare legge, e dovrai tenergli testa con calma.",
      consiglio: "Guida gli altri con l'esempio, più che con gli ordini e la voce grossa.",
    },
    se: {
      situazione: "Stai pretendendo troppo da te e dagli altri, e la tua impazienza cresce.",
      origine: "Hai preso decisioni avventate per impazienza, senza ascoltare il parere di nessuno.",
      ostacolo: "Resta sorda la tua volontà, perché vuoi comandare su tutto e non ascolti nemmeno te.",
      arrivo: "Perderai il seguito di qualcuno, se continuerai a comandare senza ascoltare.",
      consiglio: "Governa prima la tua impazienza, e gli altri ti seguiranno più volentieri.",
    },
  },
};
