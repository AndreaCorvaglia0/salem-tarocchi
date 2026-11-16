// Sei di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: sei (armonia, verso il meglio) × Bastoni (la volontà). Upright: a victory, and everyone
// recognises it. Reversed: the victory is late, the praise is missing or hollow, and pride takes the blow.
export default {
  id: 'w06',
  up: {
    favore: 2, moto: 'cresce',
    essenza: "Una vittoria, e il riconoscimento degli altri.",
    amore: {
      situazione: "Vivi un amore riuscito, e tutti riconoscono quanto state bene insieme.",
      origine: "Hai vinto le resistenze di qualcuno, e ne è nata una storia felice.",
      ostacolo: "Ti frena l'orgoglio della vittoria, e dai per scontato chi hai accanto.",
      arrivo: "Vincerai i dubbi di chi ami, e la vostra storia sarà riconosciuta da tutti.",
      consiglio: "Mostra con orgoglio la persona che ami, senza nasconderla a nessuno.",
    },
    lavoro: {
      situazione: "Stai raccogliendo un successo nel lavoro, e gli altri te lo riconoscono.",
      origine: "Hai portato a termine bene un incarico, e ne hai avuto lodi e stima.",
      ostacolo: "Pesa su di te l'attesa di tutti, dopo la tua prima vittoria.",
      arrivo: "Arriverà un riconoscimento per il tuo lavoro, forse un premio o un avanzamento.",
      consiglio: "Fatti avanti e prendi il merito di quello che hai fatto bene.",
    },
    casa: {
      situazione: "C'è orgoglio in casa per un successo, e tutta la famiglia lo festeggia.",
      origine: "Avete superato insieme una prova difficile, e la famiglia ne è uscita vincitrice.",
      ostacolo: "Fa ombra agli altri il successo di uno solo, e in casa nasce qualche invidia.",
      arrivo: "Porterai a casa una vittoria, e la famiglia ti accoglierà con orgoglio.",
      consiglio: "Riconosci in casa i meriti di ognuno, perché la vittoria è di tutti.",
    },
    altri: {
      situazione: "Godi della stima di tutti, e in paese si parla bene di te.",
      origine: "Qualcuno ha parlato bene di te a tutti, e la tua fama è cresciuta.",
      ostacolo: "Ti lega il bisogno di piacere a tutti, da quando ricevi tanti applausi.",
      arrivo: "Riceverai l'applauso della gente, per una cosa che hai fatto bene.",
      consiglio: "Accetta i complimenti senza schermirti, e ringrazia chi ha creduto in te.",
    },
    se: {
      situazione: "Senti di avercela fatta, e cammini a testa alta.",
      origine: "Hai vinto una sfida difficile, e da allora credi di più nelle tue forze.",
      ostacolo: "Ti insidia la vanità, perché dopo un successo credi di avere sempre ragione.",
      arrivo: "Otterrai la vittoria che cerchi, e avrai la conferma che vali.",
      consiglio: "Credi nel tuo successo, e comportati come chi sa di poter vincere.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "La vittoria tarda, e l'orgoglio ne soffre.",
    amore: {
      situazione: "Aspetti da chi ami un riconoscimento che non arriva, e il tuo orgoglio ne soffre.",
      origine: "Hai creduto di aver conquistato qualcuno, e poi hai scoperto che non era così.",
      ostacolo: "Ti frena l'orgoglio ferito, e non fai più un passo verso chi ami.",
      arrivo: "Tarderà la risposta che speri da chi ami, e ti sembrerà di contare poco.",
      consiglio: "Metti da parte l'orgoglio, e di' chiaramente che cosa ti aspetti.",
    },
    lavoro: {
      situazione: "Lavori bene e nessuno te lo riconosce, mentre altri si prendono il merito.",
      origine: "Avevi in mano un successo, e ti è sfuggito proprio all'ultimo.",
      ostacolo: "Manca il riconoscimento per quello che fai, e la voglia cala.",
      arrivo: "Arriverà più tardi del previsto il successo che aspetti, e senza applausi.",
      consiglio: "Continua a lavorare bene anche senza lodi, e fai notare i tuoi risultati.",
    },
    casa: {
      situazione: "Passano inosservati in casa i tuoi sforzi, e nessuno ti dice grazie.",
      origine: "Avete avuto in famiglia una delusione, dopo un successo dato per sicuro.",
      ostacolo: "Pesa in casa l'orgoglio di qualcuno, che non ammette di aver sbagliato.",
      arrivo: "Verrà una delusione per un successo atteso in famiglia, e servirà incoraggiarsi.",
      consiglio: "Di' grazie tu a chi in casa fa tanto, e il riconoscimento tornerà anche a te.",
    },
    altri: {
      situazione: "Senti che la gente non ti apprezza quanto meriti, e te ne dispiace.",
      origine: "Qualcuno ti ha fatto fare una brutta figura davanti a tutti, e brucia ancora.",
      ostacolo: "Ti inganna una fama vuota, perché molti ti lodano e pochi ti aiutano davvero.",
      arrivo: "Perderai un po' del favore della gente, e vedrai chi ti stima davvero.",
      consiglio: "Cerca la stima di pochi che contano, più che l'applauso di tutti.",
    },
    se: {
      situazione: "Dubiti di te perché la vittoria tarda, e ogni critica ti ferisce.",
      origine: "Hai peccato di troppa sicurezza, e una caduta ti ha insegnato l'umiltà.",
      ostacolo: "Resta il bisogno di applausi, e senza quelli ti sembra di non valere.",
      arrivo: "Dovrai aspettare ancora il successo, e imparerai a farne a meno.",
      consiglio: "Riconosci tu il tuo valore, senza aspettare che lo facciano gli altri.",
    },
  },
};
