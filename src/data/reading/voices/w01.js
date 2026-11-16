// Asso di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: uno (inizio) × Bastoni (la volontà). Upright: a new spark, all eagerness to begin.
// Reversed: the spark does not catch, the start is late, lazy or forced.
export default {
  id: 'w01',
  up: {
    favore: 2, moto: 'inizia',
    essenza: "Una scintilla: un inizio pieno di slancio.",
    amore: {
      situazione: "Senti una scintilla nuova per qualcuno, e hai voglia di fare la prima mossa.",
      origine: "Hai sentito scattare una scintilla al primo incontro, e tutto è cominciato da lì.",
      ostacolo: "Ti frena la troppa foga, perché vuoi tutto subito e rischi di bruciare l'inizio.",
      arrivo: "Nascerà un desiderio nuovo, e avrai lo slancio per farti avanti.",
      consiglio: "Fai tu il primo passo, finché ne senti lo slancio.",
    },
    lavoro: {
      situazione: "Ti gira in testa un'idea nuova, e hai una gran voglia di cominciare.",
      origine: "Hai cominciato dal niente, con una buona idea e tanta voglia di fare.",
      ostacolo: "Mancano ancora i mezzi, e lo slancio da solo non basta.",
      arrivo: "Si aprirà una possibilità nuova, e avrai l'energia per coglierla.",
      consiglio: "Metti mano al progetto finché la voglia è tanta, e comincia oggi stesso.",
    },
    casa: {
      situazione: "C'è aria di novità in casa, e tutti hanno voglia di darsi da fare.",
      origine: "Avete messo su casa di slancio, senza pensarci troppo, e vi ha dato forza.",
      ostacolo: "Pesa la fretta di chi vuole cominciare subito, mentre in casa gli altri vanno piano.",
      arrivo: "Arriverà in casa un inizio nuovo, forse una nascita o un progetto da fare insieme.",
      consiglio: "Proponi in famiglia la tua idea, e comincia tu a darti da fare.",
    },
    altri: {
      situazione: "Porti entusiasmo tra la gente, e la tua voglia di cominciare contagia gli altri.",
      origine: "Qualcuno ti ha acceso un'idea con una chiacchierata, e da lì hai preso il via.",
      ostacolo: "Ti viene da partire senza aspettare nessuno, e chi vorrebbe aiutarti resta indietro.",
      arrivo: "Riceverai una proposta nuova da qualcuno pieno di iniziativa, e ti verrà voglia di accettare.",
      consiglio: "Coinvolgi gli altri in quello che stai cominciando, finché l'entusiasmo è fresco.",
    },
    se: {
      situazione: "Stai sentendo un'energia nuova, e hai voglia di cominciare qualcosa di tuo.",
      origine: "Hai avuto un'ispirazione improvvisa, e l'hai seguita senza chiedere a nessuno.",
      ostacolo: "Resta tutto una scintilla, perché cominci mille cose e non ne porti avanti nessuna.",
      arrivo: "Avrai un'idea chiara della strada da prendere, e lo slancio per partire.",
      consiglio: "Segui quello che ti accende di più, e fai subito il primo passo.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "La scintilla che non prende: slancio in ritardo.",
    amore: {
      situazione: "Provi interesse per qualcuno, ma la scintilla non prende e tutto resta fermo.",
      origine: "Hai visto una scintilla accendersi tra voi, e spegnersi in poche settimane.",
      ostacolo: "Ti manca lo slancio per farti avanti, e aspetti un segnale che non arriva.",
      arrivo: "Comincerà qualcosa che faticherà a partire, e dovrai avere pazienza.",
      consiglio: "Lascia tempo a un sentimento che parte piano, senza forzarlo.",
    },
    lavoro: {
      situazione: "Rimandi da tempo un progetto, e trovi ogni giorno un motivo per non cominciare.",
      origine: "Avevi cominciato in fretta e senza mezzi, e hai dovuto fermarti quasi subito.",
      ostacolo: "Manca la voglia di partire più dei mezzi, e l'idea resta ferma.",
      arrivo: "Tarderà a partire quello che aspetti, e dovrai arrangiarti con quello che hai.",
      consiglio: "Scegli il pezzo più piccolo del progetto, e comincia soltanto da quello.",
    },
    casa: {
      situazione: "C'è in casa un progetto annunciato da tempo, che nessuno si decide a cominciare.",
      origine: "Avevate una bella idea per la casa, e nessuno l'ha mai fatta partire.",
      ostacolo: "Pesa la stanchezza di tutti, e ognuno aspetta che sia un altro a cominciare.",
      arrivo: "Slitterà una novità che in famiglia aspettavate, e servirà pazienza.",
      consiglio: "Fissa con la famiglia un giorno per cominciare, e quel giorno comincia davvero.",
    },
    altri: {
      situazione: "Proponi cose che non trovano seguito, e il tuo entusiasmo si raffredda.",
      origine: "Qualcuno ti aveva promesso un aiuto per partire, e poi ha cambiato idea.",
      ostacolo: "Ti scoraggia chi accoglie ogni tua idea con freddezza, e smetti di proporne.",
      arrivo: "Verrà un invito detto a mezza voce, che nessuno porterà avanti davvero.",
      consiglio: "Cerca una sola persona che ci creda quanto te, e partite in due.",
    },
    se: {
      situazione: "Stai cercando una spinta che non arriva, e fai tutto senza voglia.",
      origine: "Hai forzato una partenza quando non era il momento, e ti è rimasta la stanchezza.",
      ostacolo: "Fai fatica a credere alle tue idee, e le lasci cadere prima di provarle.",
      arrivo: "Tornerà la voglia di fare, ma più tardi di quanto vorresti.",
      consiglio: "Riposati finché l'energia non torna, e guarda che cosa ti incuriosisce.",
    },
  },
};
