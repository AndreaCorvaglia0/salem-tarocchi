// Otto di Spade. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: otto (il movimento, qui impedito) × Spade (la mente). Upright: feeling trapped, a prison made of
// one's own fears, with the way out already open. Reversed: the trap opens, one gets free of the fears.
export default {
  id: 's08',
  up: {
    favore: -1, moto: 'ferma',
    essenza: "Sentirsi in trappola: una prigione fatta di paure.",
    amore: {
      situazione: "Ti senti in trappola in questo amore, anche se nessuno ti tiene davvero.",
      origine: "Hai creduto di essere in trappola in una storia, e per paura non hai fatto niente.",
      ostacolo: "Ti blocca la paura di perdere chi ami, e così non vedi la via d'uscita.",
      arrivo: "Avrai l'impressione di non avere scampo, ma sarà la paura a dirtelo.",
      consiglio: "Guarda bene che cosa ti tiene lì, perché è più paura che vero legame.",
    },
    lavoro: {
      situazione: "Vedi solo ostacoli nel lavoro, e per paura pensi di non poterne uscire.",
      origine: "Avevi paura di ogni mossa in un affare, e pensavi di non avere via d'uscita.",
      ostacolo: "Ti paralizza la paura di sbagliare, più dei limiti che hai davvero.",
      arrivo: "Verrà un periodo in cui ti sembrerà di essere in trappola, ma un'uscita ci sarà.",
      consiglio: "Conta gli ostacoli veri e quelli che la paura inventa, e comincia a togliere i secondi.",
    },
    casa: {
      situazione: "Stai in casa come in una prigione, piena di obblighi che in parte ti imponi tu.",
      origine: "Qualcuno in famiglia è rimasto bloccato dalla paura, e non ha mai chiesto aiuto.",
      ostacolo: "Pesano in casa regole e paure che nessuno ha il coraggio di mettere in discussione.",
      arrivo: "Sentirai stretta la vita di famiglia, e la paura ti dirà che non puoi muoverti.",
      consiglio: "Chiedi in casa quello che per paura non chiedi mai, perché forse nessuno te lo vieta.",
    },
    altri: {
      situazione: "Temi il giudizio della gente, e questa paura ti chiude da ogni parte.",
      origine: "Hai lasciato che le voci del paese decidessero che cosa potevi fare, per paura.",
      ostacolo: "Resta il timore di quello che diranno gli altri, e ti blocca prima di cominciare.",
      arrivo: "Crederai di avere tutti contro, e scoprirai che era più paura che verità.",
      consiglio: "Fai un passo fuori dalle tue paure, e vedrai che in paese nessuno ti ferma.",
    },
    se: {
      situazione: "Vivi dentro una gabbia di pensieri e di paure, e non vedi che la porta è aperta.",
      origine: "Hai passato molto tempo a dirti che non potevi, e hai finito per crederci.",
      ostacolo: "Manca la fiducia nelle tue forze, e ogni paura ti dice che non ce la farai.",
      arrivo: "Passerai un momento di blocco, in cui le paure sembreranno più forti di te.",
      consiglio: "Muovi un passo solo, anche piccolo, per dimostrare alle paure che puoi muoverti.",
    },
  },
  rev: {
    favore: 1, moto: 'torna',
    essenza: "La trappola si apre: liberarsi dalle paure.",
    amore: {
      situazione: "Stai trovando il coraggio di dire quello che vuoi, e ti senti meno in trappola.",
      origine: "Hai lasciato una storia che ti teneva in gabbia, e hai ripreso la tua libertà.",
      ostacolo: "Ti frena un resto di paura, proprio adesso che la porta è aperta.",
      arrivo: "Riuscirai a liberarti di una paura che pesava sul tuo amore.",
      consiglio: "Esci dal silenzio e di' che cosa desideri, perché niente ti obbliga a tacere.",
    },
    lavoro: {
      situazione: "Vedi finalmente una via d'uscita nel lavoro, dove la paura mostrava solo muri.",
      origine: "Temevi di cambiare lavoro, e poi hai scoperto di poterlo fare senza paura.",
      ostacolo: "Resta l'abitudine a sentirti senza scelta, anche adesso che la trappola è aperta.",
      arrivo: "Si sbloccherà una situazione che sembrava chiusa, e potrai muoverti liberamente.",
      consiglio: "Approfitta della strada che si è aperta, senza aspettare il permesso di nessuno.",
    },
    casa: {
      situazione: "Si allentano in casa i vecchi obblighi, e ognuno si sente più libero.",
      origine: "Qualcuno in famiglia ha rotto un divieto che durava da anni, e ha liberato tutti.",
      ostacolo: "Pesa ancora la vecchia paura in casa, e qualcuno fatica a credere di essere libero.",
      arrivo: "Ci sarà più libertà in famiglia, quando avrete il coraggio di parlarvi apertamente.",
      consiglio: "Aiuta chi in casa si sente in trappola a vedere che può scegliere.",
    },
    altri: {
      situazione: "Ti importa meno di quello che dice la gente, e ti muovi con più libertà.",
      origine: "Hai smesso di credere a chi ti diceva che non potevi, e hai fatto di testa tua.",
      ostacolo: "Ti trattiene ancora qualche voce del paese, che prima ti faceva tanta paura.",
      arrivo: "Uscirai da un giro di persone che ti soffocava, e ti sentirai finalmente fuori dalla trappola.",
      consiglio: "Chiedi aiuto a chi ti vuole bene, perché in due ci si libera prima dalle paure.",
    },
    se: {
      situazione: "Cominci a vedere che molte sbarre erano solo paure, e ti stai liberando.",
      origine: "Hai guardato in faccia una paura, e hai scoperto che era più piccola di te.",
      ostacolo: "Torna ogni tanto la vecchia paura di non farcela, ma ha meno forza.",
      arrivo: "Ritroverai la libertà di scegliere, e le paure di adesso non ti fermeranno più.",
      consiglio: "Togli di mezzo una paura alla volta, cominciando dalla più piccola.",
    },
  },
};
