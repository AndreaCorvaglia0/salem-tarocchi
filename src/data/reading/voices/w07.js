// Sette di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: sette (verifica, difesa) × Bastoni (la volontà). Upright: holding one's ground with courage,
// even against many. Reversed: tired of defending, overwhelmed, tempted to give way.
export default {
  id: 'w07',
  up: {
    favore: 0, moto: 'ferma',
    essenza: "Difendere il proprio posto, con coraggio.",
    amore: {
      situazione: "Stai difendendo il tuo amore da chi non lo approva, e non cedi.",
      origine: "Hai dovuto difendere la tua scelta in amore, contro il parere di molti.",
      ostacolo: "Ti frena lo stare sempre in difesa, anche con chi non ti attacca.",
      arrivo: "Dovrai difendere quello che provi, e ne avrai il coraggio.",
      consiglio: "Difendi la tua storia senza vergogna, se sai che ne vale la pena.",
    },
    lavoro: {
      situazione: "Tieni il tuo posto nel lavoro e lo difendi, anche se in molti lo vorrebbero.",
      origine: "Hai conquistato un buon posto, e da allora hai dovuto difenderlo ogni giorno.",
      ostacolo: "Premono i rivali da ogni parte, e difenderti ti costa fatica.",
      arrivo: "Qualcuno metterà in discussione il tuo lavoro, e saprai difenderlo.",
      consiglio: "Tieni il punto sul prezzo e sulle condizioni, senza farti intimorire.",
    },
    casa: {
      situazione: "Difendi le tue ragioni in casa, anche se hai tutti contro.",
      origine: "Avete difeso la vostra casa dalle pretese di altri, e alla fine l'avete tenuta.",
      ostacolo: "Pesa in casa il sentirsi sotto assedio, e ogni parola sembra una critica.",
      arrivo: "Verrà una sfida per la famiglia, e toccherà a te difenderla.",
      consiglio: "Proteggi la tua famiglia con fermezza, senza vedere attacchi dove non ci sono.",
    },
    altri: {
      situazione: "Reggi alle critiche della gente, e difendi quello che pensi.",
      origine: "Qualcuno ha cercato di toglierti il posto che avevi, e hai resistito.",
      ostacolo: "Ti isola il dover difendere ogni cosa senza un alleato.",
      arrivo: "Affronterai le critiche di più persone insieme, e la tua difesa reggerà.",
      consiglio: "Resta della tua idea anche in minoranza, e difendila con calma.",
    },
    se: {
      situazione: "Senti di dover lottare per quello in cui credi, e il coraggio non ti manca.",
      origine: "Hai imparato presto a difenderti, perché niente ti è arrivato senza lottare.",
      ostacolo: "Resta alta la guardia anche quando potresti riposare, e questo ti consuma.",
      arrivo: "Verrà messa alla prova la tua tenacia, e vedrai che sai difenderti.",
      consiglio: "Tieni duro e non cedere di un passo, perché sei in vantaggio.",
    },
  },
  rev: {
    favore: -1, moto: 'chiude',
    essenza: "La difesa stanca: viene voglia di cedere.",
    amore: {
      situazione: "Stai per cedere alle pressioni di chi è contro la vostra storia.",
      origine: "Hai smesso di lottare per un amore, perché difenderlo ti costava troppo.",
      ostacolo: "Ti pesa la stanchezza di difendere la storia senza l'aiuto di nessuno.",
      arrivo: "Cederai su un punto che difendevi con chi ami, e forse sarà un sollievo.",
      consiglio: "Chiediti se quello che difendi in amore vale ancora la fatica.",
    },
    lavoro: {
      situazione: "Senti che i rivali hanno la meglio, e fatichi a difendere il tuo posto.",
      origine: "Hai ceduto il passo a qualcuno più insistente, e hai perso terreno.",
      ostacolo: "Mancano le forze per difenderti ancora, perché troppe richieste arrivano tutte insieme.",
      arrivo: "Dovrai arretrare su qualcosa nel lavoro, perché non potrai difendere tutto.",
      consiglio: "Lascia andare quello che non riesci a tenere, e difendi solo l'essenziale.",
    },
    casa: {
      situazione: "Cedi su tutto in casa per quieto vivere, e le tue ragioni restano mute.",
      origine: "Avete ceduto a una pretesa di altri sulla casa, per stanchezza.",
      ostacolo: "Pesa in casa chi alza la voce, e gli altri hanno smesso di difendersi.",
      arrivo: "Cederà qualcuno in famiglia che resisteva da tempo, e la questione si chiuderà.",
      consiglio: "Scegli in casa una sola cosa su cui non cedere, e sul resto lascia correre.",
    },
    altri: {
      situazione: "Ti senti sotto il giudizio di tutti, e difenderti ti sembra inutile.",
      origine: "Qualcuno ti ha dato torto davanti a tutti, e hai ceduto senza difenderti.",
      ostacolo: "Ti schiacciano le critiche di troppi, e non hai più voglia di difenderti.",
      arrivo: "Smetterai di difenderti da ogni critica, e qualcuno lo prenderà per debolezza.",
      consiglio: "Chiedi aiuto a un amico, invece di reggere tutti gli attacchi con le tue forze.",
    },
    se: {
      situazione: "Stai perdendo la voglia di difenderti, e ti viene da mollare tutto.",
      origine: "Hai tenuto la guardia alta troppo a lungo, e a un certo punto hai ceduto.",
      ostacolo: "Resta poca fiducia nelle tue forze, e alla prima spinta fai un passo indietro.",
      arrivo: "Arriverà la tentazione di arrenderti, proprio quando la sfida si fa dura.",
      consiglio: "Riposati prima di decidere se cedere, perché la stanchezza consiglia male.",
    },
  },
};
