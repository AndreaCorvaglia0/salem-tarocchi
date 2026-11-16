// Otto di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: otto (movimento) × Bastoni (la volontà). Upright: everything moves fast, news arrives,
// things get unstuck. Reversed: the movement jams, with delays, lost messages and a haste that confuses.
export default {
  id: 'w08',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "Tutto si muove in fretta: arrivano notizie.",
    amore: {
      situazione: "Corre veloce la vostra storia, e ogni giorno porta una novità.",
      origine: "Avete bruciato le tappe, perché tra voi tutto è andato in fretta.",
      ostacolo: "Ti travolge la velocità di questa storia, e non hai il tempo di capirla.",
      arrivo: "Arriverà di corsa una notizia da chi ami, forse una lettera o una visita.",
      consiglio: "Rispondi subito a chi ti cerca, senza far passare i giorni.",
    },
    lavoro: {
      situazione: "Si muove tutto in fretta nel tuo lavoro, e gli affari arrivano uno dopo l'altro.",
      origine: "Hai ricevuto una notizia che ha messo in moto ogni cosa in pochi giorni.",
      ostacolo: "Manca il tempo di fare bene, perché troppe cose corrono insieme.",
      arrivo: "Riceverai in fretta la risposta che aspetti, e dovrai muoverti subito.",
      consiglio: "Agisci subito finché le cose si muovono, perché il momento non dura.",
    },
    casa: {
      situazione: "C'è un gran viavai in casa, tra notizie, visite e cose da fare di corsa.",
      origine: "Avete deciso in fretta un cambiamento per la casa, e tutto si è mosso subito.",
      ostacolo: "Pesa in casa la fretta, perché si corre tanto e non ci si parla più.",
      arrivo: "Giungerà in famiglia una notizia improvvisa, e forse ci sarà un viaggio da fare.",
      consiglio: "Prepara la casa a un cambiamento veloce, e non rimandare le decisioni.",
    },
    altri: {
      situazione: "Girano veloci le voci in paese, e ricevi notizie da ogni parte.",
      origine: "Qualcuno ti ha portato una notizia inattesa, e da lì tutto ha preso a correre.",
      ostacolo: "Ti confondono le troppe notizie insieme, e non sai a chi dare retta.",
      arrivo: "Verranno notizie da amici lontani, e gli inviti si moltiplicheranno.",
      consiglio: "Manda oggi stesso quel messaggio, perché la risposta arriverà in fretta.",
    },
    se: {
      situazione: "Senti che tutto accelera, e hai l'energia per stare al passo.",
      origine: "Hai preso una decisione al volo, e la tua vita si è mossa di colpo.",
      ostacolo: "Resta poco tempo per pensare, e rischi di andare veloce nella direzione sbagliata.",
      arrivo: "Vedrai le cose sbloccarsi all'improvviso, e andrai avanti a grandi passi.",
      consiglio: "Segui il movimento senza frenare, e decidi in fretta dove vuoi arrivare.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Il movimento si inceppa: ritardi e fretta confusa.",
    amore: {
      situazione: "Aspetti notizie da chi ami, e il messaggio tarda ad arrivare.",
      origine: "Avete corso troppo insieme, e dalla fretta sono nati dei malintesi.",
      ostacolo: "Ti frena il ritardo di una risposta, o un messaggio capito male.",
      arrivo: "Tarderà un incontro che aspetti, e l'attesa ti renderà impaziente.",
      consiglio: "Rallenta e chiarisci i malintesi, prima di correre a conclusioni sbagliate.",
    },
    lavoro: {
      situazione: "Vanno a rilento gli affari, tra ritardi e risposte che non arrivano.",
      origine: "Hai agito con troppa fretta, e hai dovuto rifare tutto da capo.",
      ostacolo: "Mancano all'appello notizie importanti, e senza quelle resta tutto fermo.",
      arrivo: "Subirai dei ritardi in quello che ti devono, e dovrai aspettare.",
      consiglio: "Controlla due volte prima di dare una risposta, perché la fretta confonde.",
    },
    casa: {
      situazione: "Regna la confusione in casa: tutti corrono, e niente arriva in fondo.",
      origine: "Avete aspettato a lungo una notizia per la famiglia, e ha tardato troppo.",
      ostacolo: "Pesa in casa un continuo rimandare, che tiene tutti con il fiato sospeso.",
      arrivo: "Slitterà un viaggio o una visita in famiglia, per un contrattempo.",
      consiglio: "Metti ordine in casa tra le cose da fare, e fanne una alla volta.",
    },
    altri: {
      situazione: "Ricevi notizie confuse e in ritardo, e non sai più che cosa è vero.",
      origine: "Qualcuno non ti ha fatto arrivare un messaggio in tempo, e ne è nato un guaio.",
      ostacolo: "Ti intralciano le voci che corrono in paese, più veloci della verità.",
      arrivo: "Giungerà tardi un invito o una risposta, quando avrai già fatto altri piani.",
      consiglio: "Vai a parlare di persona, invece di affidarti a messaggi che si perdono.",
    },
    se: {
      situazione: "Stai correndo senza una direzione, e la fretta ti fa girare a vuoto.",
      origine: "Hai perso un'occasione per un ritardo, e ti è rimasta l'ansia di fare in fretta.",
      ostacolo: "Resta tutto bloccato proprio quando vorresti muoverti, e l'impazienza cresce.",
      arrivo: "Dovrai aspettare più del previsto, e le cose ripartiranno con lentezza.",
      consiglio: "Fermati un momento a capire dove vai, prima di rimetterti a correre.",
    },
  },
};
