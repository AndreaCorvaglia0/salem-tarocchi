// Dieci di Spade. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: dieci (il ciclo si chiude, con tutto il suo peso) × Spade (pensieri e conflitti). Upright: hitting
// the bottom, a painful ending from which one can only rise. Reversed: getting up again, the worst is over.
export default {
  id: 's10',
  up: {
    favore: -2, moto: 'chiude',
    essenza: "Toccare il fondo: da lì si può solo risalire.",
    amore: {
      situazione: "Hai toccato il fondo in questa storia, e peggio di così non può andare.",
      origine: "Una storia è finita nel modo più doloroso, e hai toccato il fondo.",
      ostacolo: "Ti pesa una fine che fa male, e dal fondo non vedi ancora la risalita.",
      arrivo: "Finirà male qualcosa in amore, e da quel fondo comincerai a risalire.",
      consiglio: "Accetta che questa storia è arrivata in fondo, e non cercare di tenerla in piedi.",
    },
    lavoro: {
      situazione: "Stai vivendo il momento peggiore di un affare, quello in cui si tocca il fondo.",
      origine: "Hai visto un progetto andare a fondo, e hai dovuto ricominciare da capo.",
      ostacolo: "Pesa una sconfitta piena, di quelle che portano a toccare il fondo.",
      arrivo: "Toccherai il fondo in una faccenda di soldi, e da lì potrai solo risalire.",
      consiglio: "Chiudi quello che è finito, e conserva le forze per quando si risale.",
    },
    casa: {
      situazione: "C'è in casa l'aria pesante di quando si è toccato il fondo.",
      origine: "Una fiducia tradita ha fatto vivere alla famiglia il suo momento peggiore.",
      ostacolo: "Resta in casa il peso di una brutta fine, e nessuno ha ancora la forza di risalire.",
      arrivo: "Verrà per la famiglia il momento più basso, e subito dopo le cose miglioreranno.",
      consiglio: "Stringiti ai tuoi in questo momento duro, perché dopo il fondo viene la risalita.",
    },
    altri: {
      situazione: "Chi credevi dalla tua parte ti ha voltato le spalle, e la tua fiducia tocca il fondo.",
      origine: "Hai subìto un torto grave da una persona amica, e l'amicizia è finita lì.",
      ostacolo: "Ti schiaccia la delusione per un voltafaccia, e dal fondo non ti fidi di nessuno.",
      arrivo: "Finirà in modo doloroso un rapporto con qualcuno, e peggio di così non potrà andare.",
      consiglio: "Lascia andare chi ti ha voltato le spalle, e tieni le forze per risalire.",
    },
    se: {
      situazione: "Sei al punto più basso, e proprio per questo puoi soltanto risalire.",
      origine: "Avevi toccato il fondo, e proprio allora hai visto la prima luce.",
      ostacolo: "Manca la forza di risalire, e ti racconti che è tutto finito per sempre.",
      arrivo: "Arriverai in fondo a un periodo nero, e subito dopo comincerà la risalita.",
      consiglio: "Riposa finché sei a terra, e pensa che più in basso del fondo non si va.",
    },
  },
  rev: {
    favore: 1, moto: 'torna',
    essenza: "Rialzarsi dal fondo: il peggio è passato.",
    amore: {
      situazione: "Ti stai rialzando dopo una fine dolorosa, e il peggio è alle spalle.",
      origine: "Hai passato il momento peggiore di una storia, e poi hai cominciato a rialzarti.",
      ostacolo: "Ti trattiene un dolore che tiri per le lunghe, quando potresti già rialzarti.",
      arrivo: "Tornerai ad avere fiducia in amore, piano, perché il peggio sarà passato.",
      consiglio: "Rialzati senza fretta, e non riaprire una storia che è arrivata alla fine.",
    },
    lavoro: {
      situazione: "Stai risalendo dopo un brutto colpo, perché nel lavoro il peggio è passato.",
      origine: "Avevi perso quasi tutto in un affare, e un poco alla volta hai rialzato la testa.",
      ostacolo: "Resta la tentazione di trascinare un affare finito, quando è tempo di rialzarsi.",
      arrivo: "Vedrai i conti migliorare, perché il peggio lo hai già passato.",
      consiglio: "Riparti dal poco che si è salvato, perché il peggio è passato.",
    },
    casa: {
      situazione: "Si rialza la famiglia dopo il momento più duro, e in casa torna un po' di luce.",
      origine: "Qualcuno in famiglia è caduto molto in basso, e gli altri lo hanno aiutato a rialzarsi.",
      ostacolo: "Pesa in casa chi non vuole chiudere una storia finita, e ritarda la ripresa di tutti.",
      arrivo: "Passerà il peggio per la tua casa, e vi rialzerete su basi più sincere.",
      consiglio: "Aiuta i tuoi a rialzarsi, cominciando dalle cose di ogni giorno.",
    },
    altri: {
      situazione: "Ritrovi un po' di fiducia nella gente, perché il peggio è passato.",
      origine: "Hai superato un brutto voltafaccia, e hai visto chi ti aiutava a rialzarti.",
      ostacolo: "Ti frena la voglia di rivalsa, che ti tiene in basso quando potresti rialzarti.",
      arrivo: "Qualcuno ti aiuterà a rialzarti, e saprai su chi puoi contare davvero.",
      consiglio: "Appoggiati a chi ti tende la mano, perché ci si rialza prima in due.",
    },
    se: {
      situazione: "Senti tornare le forze dopo il periodo peggiore, e ti stai rialzando.",
      origine: "Hai conosciuto il fondo, e da lì hai trovato la forza di rialzarti.",
      ostacolo: "Fatichi a credere che il peggio sia passato, e aspetti un altro colpo.",
      arrivo: "Vedrai tornare il giorno dopo il periodo peggiore, e ti rialzerai.",
      consiglio: "Alzati e fai una cosa piccola ogni giorno, perché ci si rialza così.",
    },
  },
};
