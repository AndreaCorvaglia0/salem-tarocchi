// Cavaliere di Coppe. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Who × suit: Cavaliere (chi va, qualcuno che arriva) × Coppe (il cuore). Upright: someone comes forward with the
// heart, a proposal. Reversed: fine promises that stay empty, a charm that deceives.
export default {
  id: 'c12',
  up: {
    favore: 1, moto: 'inizia',
    essenza: "Chi si fa avanti col cuore: una proposta.",
    amore: {
      situazione: "Qualcuno si sta facendo avanti con te, con garbo e con il cuore in mano.",
      origine: "Hai ricevuto una proposta d'amore fatta con tanta grazia, che la ricordi ancora.",
      ostacolo: "Ti frena un po' di romanticismo: aspetti la proposta perfetta, e il tempo passa.",
      arrivo: "Arriverà una dichiarazione, o una proposta seria, da chi ti corteggia.",
      consiglio: "Fatti avanti e proponi quello che hai nel cuore, con gentilezza.",
    },
    lavoro: {
      situazione: "Valuti una proposta che ti piace, fatta da una persona garbata.",
      origine: "Hai accettato una proposta seguendo il cuore, più che il guadagno.",
      ostacolo: "Resta da vedere se la proposta è solida, oltre che bella da sentire.",
      arrivo: "Riceverai un'offerta presentata con molto garbo, e ti verrà voglia di accettare.",
      consiglio: "Presenta la tua proposta con calore, perché il modo conta quanto la sostanza.",
    },
    casa: {
      situazione: "Bussa a casa tua qualcuno con una proposta gentile, e la famiglia lo ascolta volentieri.",
      origine: "È entrato in famiglia qualcuno che si era fatto avanti con garbo e con pazienza.",
      ostacolo: "Manca un po' di senso pratico a chi in casa propone tante cose belle.",
      arrivo: "Verrà in casa un invito, o una proposta fatta col cuore, e porterà allegria.",
      consiglio: "Proponi alla famiglia quello che ti sta a cuore, con dolcezza e senza imporlo.",
    },
    altri: {
      situazione: "Ricevi inviti e proposte da una persona gentile, che ti cerca con il cuore.",
      origine: "Qualcuno è venuto da te a proporre la pace, e l'ha fatto con molto garbo.",
      ostacolo: "Ti lasci convincere in fretta da chi si fa avanti con bei modi.",
      arrivo: "Si farà avanti qualcuno con un invito gentile, e ti farà piacere accettarlo.",
      consiglio: "Vai tu da chi vuoi conoscere, e porta un invito fatto con il cuore.",
    },
    se: {
      situazione: "Segui il cuore, e ti fai avanti verso quello che ti attira.",
      origine: "Hai fatto le tue scelte per amore, andando dove ti chiamava il cuore.",
      ostacolo: "Ti trascina il sentimento: parti dietro a ogni bella proposta, e a metà cambi idea.",
      arrivo: "Sentirai il cuore spingerti verso qualcuno, e ti verrà voglia di farti avanti.",
      consiglio: "Fai la proposta che rimandi da tempo, anche a costo di sentirti dire di no.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Belle promesse vuote: un fascino che inganna.",
    amore: {
      situazione: "Ascolti belle parole da qualcuno che promette molto e mantiene poco.",
      origine: "Hai creduto a una promessa d'amore fatta con fascino, e poi rimasta vuota.",
      ostacolo: "Ti incanta il fascino di una persona, e non vedi che alle promesse non seguono i fatti.",
      arrivo: "Arriverà qualcuno pieno di fascino e di promesse, a cui converrà credere poco.",
      consiglio: "Giudica chi ti corteggia da quello che fa, e non dalle promesse.",
    },
    lavoro: {
      situazione: "Suona bene la proposta che ti hanno fatto, ma sono promesse con poca sostanza.",
      origine: "Hai accettato un'offerta per le belle promesse di chi la faceva, e ti è costata cara.",
      ostacolo: "Pesa una promessa di guadagno che non si avvera mai, e tu continui ad aspettare.",
      arrivo: "Riceverai un'offerta piena di promesse, troppo bella per essere vera.",
      consiglio: "Chiedi fatti e non promesse, prima di dare la tua parola o il tuo denaro.",
    },
    casa: {
      situazione: "Qualcuno in casa promette sempre e non mantiene, e gli altri hanno smesso di credergli.",
      origine: "Avete dato fiducia a una persona affascinante, che in famiglia ha lasciato soltanto promesse.",
      ostacolo: "Resta in famiglia chi incanta tutti con le promesse, e poi sparisce al momento di fare.",
      arrivo: "Verrà fatta in casa una bella promessa, che tarderà o resterà a metà.",
      consiglio: "Prometti alla famiglia soltanto quello che puoi mantenere, e mantienilo.",
    },
    altri: {
      situazione: "Frequenti una persona piena di fascino, che dice a tutti quello che vogliono sentire.",
      origine: "Qualcuno ti ha fatto una promessa a parole, e poi non si è più visto.",
      ostacolo: "Ti fidi troppo dei bei modi, e scambi il fascino per sincerità.",
      arrivo: "Incontrerai chi sa farsi voler bene con due parole, e non mantiene le promesse.",
      consiglio: "Diffida di chi lusinga e promette troppo, e credi soltanto a quello che mantiene.",
    },
    se: {
      situazione: "Fai a te promesse belle che poi non mantieni, e cambi umore spesso.",
      origine: "Hai promesso molto, a te e agli altri, sull'onda di un entusiasmo durato poco.",
      ostacolo: "Ti inganni con le tue promesse: dici che farai, e il fare resta lì.",
      arrivo: "Proverai uno slancio forte che durerà poco, come una promessa fatta in un momento.",
      consiglio: "Mantieni una promessa piccola, prima di farne un'altra grande.",
    },
  },
};
