// Due di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: due (due cose si incontrano, un equilibrio) × Denari (le cose concrete). Upright: two commitments
// kept in balance, lightly. Reversed: too many at once, the balance gives way.
export default {
  id: 'p02',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "Due impegni tenuti in equilibrio, con leggerezza.",
    amore: {
      situazione: "Ti dividi tra l'amore e gli altri impegni, e riesci a tenerli in equilibrio.",
      origine: "Hai dovuto dividerti tra una persona e i tuoi doveri, e hai trovato il modo.",
      ostacolo: "Pesa il poco tempo: tra due impegni, alla persona che ami restano gli avanzi.",
      arrivo: "Troverete un equilibrio tra quello che vuoi tu e quello che vuole l'altra persona.",
      consiglio: "Bilancia doveri e affetto con leggerezza, e trova ogni giorno un momento per chi ami.",
    },
    lavoro: {
      situazione: "Porti avanti due lavori insieme, e riesci a non farne cadere nessuno.",
      origine: "Hai fatto quadrare i conti con poco, spostando i soldi da una parte all'altra.",
      ostacolo: "Pesa il continuo salire e scendere delle entrate, che ti obbliga a destreggiarti.",
      arrivo: "Dovrai dividerti tra due impegni, e ce la farai con un po' di elasticità.",
      consiglio: "Tieni d'occhio entrate e uscite, e sposta le forze dove servono di più.",
    },
    casa: {
      situazione: "Dividi le giornate tra la casa e il lavoro, e l'equilibrio regge.",
      origine: "Avete tirato avanti la famiglia arrangiandovi, tra alti e bassi, senza perdere l'allegria.",
      ostacolo: "Manca un momento di calma: in casa si corre sempre da una cosa all'altra.",
      arrivo: "Cambieranno i ritmi di casa, e saprete ritrovare un equilibrio.",
      consiglio: "Spartisci i compiti di casa con gli altri, così il peso resta bilanciato.",
    },
    altri: {
      situazione: "Ti destreggi tra due amicizie che chiedono tempo, cercando di non scontentare nessuno.",
      origine: "Tenevi buoni rapporti con due parti diverse, dando un po' a ciascuna.",
      ostacolo: "Ti stanca dover accontentare tutti, un giorno da una parte e un giorno dall'altra.",
      arrivo: "Riuscirai a stare in equilibrio tra due persone che chiedono cose diverse.",
      consiglio: "Dai a ciascuno il suo tempo, senza promettere a due persone la stessa giornata.",
    },
    se: {
      situazione: "Stai tenendo insieme più cose di quante sembri possibile, e con un certo garbo.",
      origine: "Hai imparato presto ad adattarti, e a cambiare passo quando cambia la musica.",
      ostacolo: "Resta poco spazio per te, perché ogni giorno hai due cose da bilanciare.",
      arrivo: "Passerai un periodo movimentato, e lo attraverserai senza perdere l'equilibrio.",
      consiglio: "Prendi con leggerezza gli alti e bassi, e fai una cosa alla volta.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Troppi impegni insieme: l'equilibrio cede.",
    amore: {
      situazione: "Stai trascurando chi ami perché hai troppi impegni, e l'equilibrio tra voi cede.",
      origine: "Hai provato a tenere insieme troppe cose, e l'amore ne ha fatto le spese.",
      ostacolo: "Ti frena la confusione dei troppi impegni: dai un po' a tutti, e a nessuno abbastanza.",
      arrivo: "Dovrai scegliere a che cosa rinunciare, perché tutto insieme non starà più in piedi.",
      consiglio: "Togli un impegno dalla tua giornata, e dai quel tempo alla persona che ami.",
    },
    lavoro: {
      situazione: "Porti troppi impegni insieme, e qualcuno comincia a caderti di mano.",
      origine: "Avevi troppe spese da seguire, ne hai perso il conto e lo paghi ancora.",
      ostacolo: "Pesano i conti in disordine: copri un buco aprendone un altro.",
      arrivo: "Salterà uno degli impegni che tieni in piedi, e sarà quasi un sollievo.",
      consiglio: "Scegli il lavoro che conta di più, e lascia andare il resto.",
    },
    casa: {
      situazione: "Regna il disordine in casa, perché ognuno ha troppo da fare altrove.",
      origine: "Avete corso per anni tra mille impegni, e la casa è rimasta indietro.",
      ostacolo: "Manca un equilibrio in casa tra chi fa troppo e chi fa poco.",
      arrivo: "Verrà un periodo di troppe cose insieme, e in casa non si riuscirà a seguirle tutte.",
      consiglio: "Metti ordine nelle cose di casa una alla volta, cominciando dalla più urgente.",
    },
    altri: {
      situazione: "Prometti a troppa gente, e non riesci più a mantenere con tutti.",
      origine: "Hai detto di sì a tutti, e qualcuno è rimasto deluso.",
      ostacolo: "Ti toglie le forze chi ti chiede sempre qualcosa in più, e tu non sai rifiutare.",
      arrivo: "Mancherai a un impegno preso con qualcuno, per averne presi troppi.",
      consiglio: "Di' qualche no, prima che i troppi sì ti facciano mancare alla parola.",
    },
    se: {
      situazione: "Corri dietro a troppe cose, e cominci a perdere l'equilibrio.",
      origine: "Hai voluto fare tutto insieme, finché le forze non ti hanno più retto.",
      ostacolo: "Resta la fatica a scegliere: tieni tutto in aria per non rinunciare a niente.",
      arrivo: "Sentirai che troppi impegni non li reggi, e ti toccherà rallentare.",
      consiglio: "Fermati a decidere che cosa viene prima, invece di rincorrere tutto.",
    },
  },
};
