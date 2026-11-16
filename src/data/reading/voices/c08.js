// Otto di Coppe. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: otto (le cose si muovono, ci si allontana) × Coppe (il cuore). Upright: leaving what no longer
// feeds the heart, to look for something else. Reversed: staying out of fear, or running off without knowing why.
export default {
  id: 'c08',
  up: {
    favore: 0, moto: 'chiude',
    essenza: "Lasciare quello che non basta più, e cercare altro.",
    amore: {
      situazione: "Senti che questo amore non ti basta più, e pensi di andartene.",
      origine: "Hai lasciato una persona a cui volevi ancora bene, perché quell'amore non ti bastava più.",
      ostacolo: "Ti pesa lasciare quello che avete costruito, anche se il cuore è già altrove.",
      arrivo: "Verrà il momento di lasciare un legame che non ti dà più niente.",
      consiglio: "Vai via senza rancore, se hai capito che restare non ti fa bene.",
    },
    lavoro: {
      situazione: "Fai un lavoro che rende ma non ti basta più, e guardi altrove.",
      origine: "Hai lasciato un posto sicuro, per cercare qualcosa che ti somigliasse di più.",
      ostacolo: "Resta la fatica già spesa: ti dispiace lasciare quello che ti è costato tanto.",
      arrivo: "Lascerai un'attività avviata, e partirai in cerca di qualcosa che valga di più per te.",
      consiglio: "Lascia il lavoro che non ti basta più, anche se a conti fatti conviene.",
    },
    casa: {
      situazione: "Pensi di andare via di casa, perché lì dentro non trovi più quello che cerchi.",
      origine: "Qualcuno ha lasciato la casa senza litigare, soltanto perché sentiva di dover andare.",
      ostacolo: "Pesa il pensiero di chi resta: andartene ti sembra un torto alla famiglia.",
      arrivo: "Partirà qualcuno di casa, o partirai tu, e sarà una scelta fatta in silenzio.",
      consiglio: "Saluta con affetto prima di andare via, e spiega che cosa vai a cercare.",
    },
    altri: {
      situazione: "Stai lasciando una compagnia che non ti somiglia più, senza fare rumore.",
      origine: "Avevi un giro di amici di sempre, e l'hai lasciato quando non ti bastava più.",
      ostacolo: "Ti trattiene l'abitudine: sono amicizie vuote, ma lasciarle ti fa sentire in colpa.",
      arrivo: "Lascerai indietro qualcuno che non cammina più con te, e cercherai altra compagnia.",
      consiglio: "Allontanati da chi non ti dà più niente, senza bisogno di spiegare tutto.",
    },
    se: {
      situazione: "Stai cercando qualcosa di più vero, e quello che hai non ti basta più.",
      origine: "Hai lasciato una vita comoda, perché dentro sentivi che ti mancava qualcosa.",
      ostacolo: "Ti spaventa partire senza sapere che cosa troverai, e rimandi di giorno in giorno.",
      arrivo: "Prenderai una strada nuova, lasciando cose che fino a ieri ti sembravano tutto.",
      consiglio: "Parti con poco bagaglio, e fidati della voglia che hai di cercare altro.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Restare per paura, o scappare senza capire.",
    amore: {
      situazione: "Resti in un amore che non ti basta, perché hai paura di andartene.",
      origine: "Hai lasciato e ripreso più volte la stessa persona, senza capire che cosa volevi.",
      ostacolo: "Ti frena la paura di restare senza nessuno, e così rimani dove non stai bene.",
      arrivo: "Proverai ad andartene e tornerai indietro, finché non avrai capito che cosa vuoi.",
      consiglio: "Chiediti perché vuoi andartene, prima di partire o di decidere che resti.",
    },
    lavoro: {
      situazione: "Rimani in un lavoro che non ti piace più, per paura di perdere il sicuro.",
      origine: "Hai lasciato un lavoro di corsa, senza capire che cosa non andava.",
      ostacolo: "Pesa la paura di cambiare: vorresti andartene, ma temi di non trovare di meglio.",
      arrivo: "Resterai dove sei ancora per un po', più per paura che per convinzione.",
      consiglio: "Prepara con calma un'altra strada, invece di restare per paura o di scappare.",
    },
    casa: {
      situazione: "Qualcuno in casa vorrebbe andarsene e non osa, e la sua scontentezza si sente.",
      origine: "Avete tenuto insieme la casa per paura dei cambiamenti, più che per voglia.",
      ostacolo: "Resta in casa chi non ci sta più volentieri, e non ne parla per paura.",
      arrivo: "Tornerà a casa qualcuno che era scappato in fretta, senza aver risolto niente.",
      consiglio: "Parla in famiglia di quello che non ti basta, prima di pensare a scappare.",
    },
    altri: {
      situazione: "Frequenti per abitudine gente che non ti dà più niente, per paura di restare senza compagnia.",
      origine: "Avevi degli amici, e li hai lasciati da un giorno all'altro, senza dare spiegazioni.",
      ostacolo: "Ti trattiene la paura di quello che dirà la gente, se lasci la solita compagnia.",
      arrivo: "Sparirai per un po' dalla vista di tutti, e tornerai senza aver capito perché.",
      consiglio: "Decidi chi vuoi davvero vicino, invece di restare con tutti o di sparire.",
    },
    se: {
      situazione: "Sai che dovresti cambiare strada, e resti dove sei per paura.",
      origine: "Hai cambiato spesso direzione, scappando ogni volta dallo stesso scontento.",
      ostacolo: "Ti blocca la paura di lasciare il certo, anche quando il certo non ti basta.",
      arrivo: "Girerai ancora intorno alla stessa decisione, fra la voglia di partire e la paura.",
      consiglio: "Cerca di capire da che cosa scappi, prima di partire un'altra volta.",
    },
  },
};
