// Due di Spade. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: due (una scelta, un equilibrio) × Spade (la mente). Upright: a choice put off, a stalemate, a truce
// kept by not looking. Reversed: the stalemate breaks and one has to choose at last, late and with some confusion.
export default {
  id: 's02',
  up: {
    favore: 0, moto: 'ferma',
    essenza: "Indecisione: lo stallo di chi non vuole scegliere.",
    amore: {
      situazione: "Sei in bilico tra due sentimenti, e rimandi la scelta per non soffrire.",
      origine: "Hai evitato a lungo di scegliere, e la storia è rimasta ferma a metà.",
      ostacolo: "Ti frena l'indecisione: rimandi una scelta che in fondo conosci già.",
      arrivo: "Verrà un periodo di stallo tra voi, in cui nessuno farà il primo passo.",
      consiglio: "Guarda in faccia la scelta che rimandi, perché aspettare non la rende più facile.",
    },
    lavoro: {
      situazione: "Hai davanti due strade che si equivalgono, e non ti decidi per nessuna.",
      origine: "Avevi una decisione da prendere su un affare, e l'hai rimandata più volte.",
      ostacolo: "Resta tutto fermo finché non scegli, e a forza di rimandare il tempo passa.",
      arrivo: "Dovrai scegliere tra due proposte alla pari, e per un po' resterai nel dubbio.",
      consiglio: "Pesa con calma le due possibilità, poi decidi senza aspettare un segno.",
    },
    casa: {
      situazione: "C'è una tregua in casa, ma la decisione vera nessuno la vuole prendere.",
      origine: "Nessuno in famiglia ha voluto scegliere da che parte stare, e il nodo è rimasto.",
      ostacolo: "Pesa in casa una decisione rimandata, che tutti fingono di non vedere.",
      arrivo: "Arriverà in famiglia una scelta difficile, e all'inizio nessuno vorrà prenderla.",
      consiglio: "Proponi tu di decidere insieme quella cosa che in casa si rimanda sempre.",
    },
    altri: {
      situazione: "Stai nel mezzo tra due persone in disaccordo, e non vuoi scegliere.",
      origine: "Hai taciuto per non schierarti in una lite altrui, e la cosa è rimasta sospesa.",
      ostacolo: "Ti blocca il timore di scontentare qualcuno, e così non decidi con chi stare.",
      arrivo: "Ti chiederanno di scegliere una parte, e la prima voglia sarà di rimandare.",
      consiglio: "Smetti di restare nel mezzo per quieto vivere, e di' da che parte stai.",
    },
    se: {
      situazione: "Tieni in sospeso una decisione, e preferisci non vedere quanto ti pesa.",
      origine: "Chiudevi gli occhi davanti a una scelta, sperando che si risolvesse da sola.",
      ostacolo: "Manca il coraggio di decidere, e il dubbio ti tiene sempre allo stesso punto.",
      arrivo: "Vivrai un momento di indecisione, con la testa che dice una cosa e il cuore un'altra.",
      consiglio: "Datti un giorno preciso per decidere, e non rimandare oltre.",
    },
  },
  rev: {
    favore: 0, moto: 'torna',
    essenza: "Lo stallo si rompe: bisogna scegliere, anche in ritardo.",
    amore: {
      situazione: "Stai finalmente vedendo come stanno le cose tra voi, e sai che devi scegliere.",
      origine: "Hai rimandato una scelta d'amore finché qualcuno ha deciso al posto tuo.",
      ostacolo: "Ti confonde il troppo pensare: più ci ragioni, meno riesci a deciderti.",
      arrivo: "Finirà lo stallo tra voi, e dovrete dirvi che cosa avete scelto.",
      consiglio: "Scegli adesso, anche se in ritardo, prima che sia il tempo a scegliere per te.",
    },
    lavoro: {
      situazione: "Si sblocca una situazione ferma da tempo, e tocca a te decidere.",
      origine: "Troppi consigli diversi ti hanno fatto perdere tempo, e la scelta è arrivata tardi.",
      ostacolo: "Ti costa cara la lunga indecisione, perché un'occasione non aspetta per sempre.",
      arrivo: "Dovrai prendere in fretta una decisione che hai tenuto ferma troppo a lungo.",
      consiglio: "Decidi con quello che sai oggi, senza aspettare di sapere tutto.",
    },
    casa: {
      situazione: "È finita la tregua in casa, e la decisione rimandata torna fuori.",
      origine: "Qualcuno in famiglia ha smesso di tacere, e ha costretto tutti a scegliere.",
      ostacolo: "Pesano in casa troppe opinioni diverse, e la decisione arriva sempre più tardi.",
      arrivo: "Verrà il momento di decidere in famiglia, e stavolta non si potrà rimandare.",
      consiglio: "Aiuta i tuoi a scegliere, mettendo sul tavolo le cose come stanno.",
    },
    altri: {
      situazione: "Capisci che non puoi più accontentare tutti, e che devi scegliere con chi stare.",
      origine: "Hai tenuto il piede in due scarpe con due amici, finché non è stato più possibile.",
      ostacolo: "Ti tirano da due parti, e l'indecisione cresce quando dovrebbe finire.",
      arrivo: "Vedrai chiaramente chi merita la tua fiducia, e la scelta verrà da sé.",
      consiglio: "Prendi parte, con garbo ma senza ambiguità, e accetta che qualcuno ci resti male.",
    },
    se: {
      situazione: "Apri gli occhi su una scelta che evitavi, e capisci che tocca a te.",
      origine: "Hai aspettato tanto a decidere che il dubbio è diventato un'abitudine.",
      ostacolo: "Resta la paura di sbagliare scelta, che ti fa cambiare idea ogni giorno.",
      arrivo: "Uscirai dall'indecisione, e ti stupirà quanto era semplice scegliere.",
      consiglio: "Smetti di chiedere pareri a tutti, e scegli quello che dentro di te sai già.",
    },
  },
};
