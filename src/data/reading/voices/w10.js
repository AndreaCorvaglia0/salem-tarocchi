// Dieci di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: dieci (compimento) × Bastoni (la volontà). Upright: all the weight of that suit, a load too
// heavy, carried alone with the goal in sight. Reversed: the load is put down or shared, or one gives way under it.
export default {
  id: 'w10',
  up: {
    favore: -1, moto: 'chiude',
    essenza: "Un carico troppo pesante, con la meta vicina.",
    amore: {
      situazione: "Porti tu tutto il peso della storia, e la fatica comincia a sentirsi.",
      origine: "Hai preso su di te i problemi di chi amavi, oltre ai tuoi.",
      ostacolo: "Ti schiaccia il troppo impegno, e l'amore è diventato un peso in più.",
      arrivo: "Sentirai pesante la storia per un tratto, ma la meta sarà vicina.",
      consiglio: "Chiedi a chi ami di portare la sua parte del peso.",
    },
    lavoro: {
      situazione: "Lavori sotto un carico troppo pesante, anche se la fine è vicina.",
      origine: "Hai accettato ogni incarico senza mai dire di no, e il carico è cresciuto.",
      ostacolo: "Pesano i debiti e le responsabilità, e non ti lasciano vedere altro.",
      arrivo: "Avrai molto lavoro e molta fatica, ma porterai il carico fino in fondo.",
      consiglio: "Porta a termine quello che manca, e la prossima volta prendi un carico più leggero.",
    },
    casa: {
      situazione: "Poggia su di te tutta la casa, ed è un carico troppo grande.",
      origine: "Avete avuto in famiglia troppi pesi insieme, e li ha portati uno solo.",
      ostacolo: "Grava sulla famiglia un dovere pesante, che toglie a tutti la leggerezza.",
      arrivo: "Verranno giorni carichi di faccende in casa, e il sollievo sarà vicino.",
      consiglio: "Fai in casa l'elenco dei pesi, e chiedi a ognuno di prenderne uno.",
    },
    altri: {
      situazione: "Ti fai carico dei problemi di tutti, e nessuno si accorge che fatichi.",
      origine: "Qualcuno ti ha lasciato sulle braccia un impegno suo, e l'hai portato tu.",
      ostacolo: "Ti pesa non saper dire di no, e tutti ne approfittano.",
      arrivo: "Riceverai altre richieste di aiuto, e il carico rischierà di diventare troppo.",
      consiglio: "Di' qualche no in più, perché non puoi portare i pesi di tutto il paese.",
    },
    se: {
      situazione: "Stai portando troppo, e la fatica non ti fa più vedere dove vai.",
      origine: "Hai sempre creduto di dover fare tutto tu, e hai preso troppi pesi.",
      ostacolo: "Resta sulle tue spalle un dovere che non ti spetta più, e continui a portarlo.",
      arrivo: "Arriverai alla meta con molta fatica, e potrai finalmente posare il carico.",
      consiglio: "Guarda quanto manca alla meta, e porta solo quello che serve per arrivarci.",
    },
  },
  rev: {
    favore: 0, moto: 'torna',
    essenza: "Posare il peso, prima di crollare.",
    amore: {
      situazione: "Stai posando un peso che portavi per due, e respiri meglio.",
      origine: "Hai lasciato una storia che ti pesava troppo, e hai sentito subito sollievo.",
      ostacolo: "Ti schiaccia ancora un peso in amore, perché non ti decidi a posarlo.",
      arrivo: "Dividerete meglio i pesi tra voi due, e la storia tornerà leggera.",
      consiglio: "Lascia andare il peso che in amore non è tuo, prima di crollare.",
    },
    lavoro: {
      situazione: "Stai cedendo sotto troppi impegni, ed è tempo di posarne qualcuno.",
      origine: "Hai retto troppo lavoro finché hai potuto, e a un certo punto è crollato tutto.",
      ostacolo: "Pesa il non saper delegare, perché vuoi fare tutto tu e non reggi più.",
      arrivo: "Lascerai un incarico troppo pesante, e ti resterà il tempo per il resto.",
      consiglio: "Affida a qualcun altro una parte del lavoro, senza sentirti in colpa.",
    },
    casa: {
      situazione: "Si dividono meglio i pesi in casa, perché hai smesso di fare tutto tu.",
      origine: "Avete avuto in casa un momento di crollo, quando i doveri erano troppi.",
      ostacolo: "Grava ancora su uno solo il carico di casa, e sta per cedere.",
      arrivo: "Verrà un sollievo in famiglia, quando un vecchio peso sarà finalmente posato.",
      consiglio: "Chiedi aiuto in casa prima di crollare, e accetta che facciano a modo loro.",
    },
    altri: {
      situazione: "Cominci a dire di no, e lasci agli altri i pesi che sono loro.",
      origine: "Qualcuno ti ha tolto un peso dalle braccia, quando ha visto che non reggevi.",
      ostacolo: "Ti tiene sotto il carico la paura di deludere chi conta su di te.",
      arrivo: "Restituirai a qualcuno un peso che era suo, e l'amicizia reggerà.",
      consiglio: "Smetti di caricarti i guai degli altri, e guarda chi può darti una mano.",
    },
    se: {
      situazione: "Senti che non puoi più portare tutto, e cominci a posare qualcosa.",
      origine: "Hai portato un peso inutile per anni, finché hai capito che potevi lasciarlo.",
      ostacolo: "Resta il senso del dovere, che ti fa riprendere ogni peso appena posato.",
      arrivo: "Poserai un carico che ti schiacciava, e sentirai le spalle leggere.",
      consiglio: "Scegli che cosa posare oggi stesso, senza aspettare che le forze finiscano.",
    },
  },
};
