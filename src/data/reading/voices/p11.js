// Fante di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Court × suit: Fante (chi impara) × Denari (le cose concrete). Upright: the one who learns, a new project studied
// seriously. Reversed: the one who gets distracted, a project studied by halves.
export default {
  id: 'p11',
  up: {
    favore: 1, moto: 'inizia',
    essenza: "Chi impara con serietà: un progetto nuovo da studiare.",
    amore: {
      situazione: "Studi con attenzione una persona che ti piace, e vuoi fare le cose con serietà.",
      origine: "Hai cominciato una storia da principiante, con tanta buona volontà e tutto da imparare.",
      ostacolo: "Ti frena la troppa serietà: studi ogni mossa, e alla fine non ne fai nessuna.",
      arrivo: "Riceverai una proposta seria, da qualcuno che vuole imparare a conoscerti.",
      consiglio: "Impara a conoscere chi ti piace un poco alla volta, con attenzione e senza fretta.",
    },
    lavoro: {
      situazione: "Stai imparando un lavoro nuovo, e lo studi con tutta la serietà che hai.",
      origine: "Hai cominciato da apprendista, guardando e imparando da chi ne sapeva di più.",
      ostacolo: "Manca ancora l'esperienza: il progetto è buono, ma sei all'inizio e hai da imparare.",
      arrivo: "Arriverà una buona notizia sui soldi, o la possibilità di imparare un mestiere.",
      consiglio: "Studia bene il progetto prima di cominciare, e chiedi a chi ha più esperienza.",
    },
    casa: {
      situazione: "Si studia in casa un progetto nuovo, con molta attenzione e ancora pochi mezzi.",
      origine: "Avete imparato a mandare avanti una casa partendo dal niente, facendo i conti con cura.",
      ostacolo: "Pesa in casa l'inesperienza di chi è alle prime armi, e ha bisogno di una guida.",
      arrivo: "Porterà una buona notizia in casa qualcuno di giovane, con un progetto serio.",
      consiglio: "Insegna ai più giovani di casa a tenere i conti, e ascolta i loro progetti.",
    },
    altri: {
      situazione: "Frequenti una persona giovane e seria, che ha voglia di imparare da te.",
      origine: "Qualcuno ti ha portato una notizia utile, e ti ha messo in testa un progetto.",
      ostacolo: "Ti trattiene la timidezza di chi sta imparando, e in mezzo agli altri parli poco.",
      arrivo: "Conoscerai qualcuno di affidabile, con cui studiare un progetto concreto.",
      consiglio: "Fai domande a chi sa più di te, perché nessuno impara senza chiedere.",
    },
    se: {
      situazione: "Senti la voglia di imparare qualcosa di utile, e ti ci applichi con attenzione.",
      origine: "Hai sempre studiato le cose con cura, prima di metterci le mani.",
      ostacolo: "Resta la paura di sbagliare di chi è agli inizi, e ti fa studiare senza mai provare.",
      arrivo: "Comincerai a studiare qualcosa di nuovo, e scoprirai che ti riesce.",
      consiglio: "Scegli una cosa concreta da imparare, e comincia a studiarla con serietà.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Chi si distrae: un progetto studiato a metà.",
    amore: {
      situazione: "Pensi ad altro quando sei con chi ami, e la tua distrazione si nota.",
      origine: "Hai lasciato una storia a metà per pigrizia, senza mai impegnarti davvero.",
      ostacolo: "Ti frena la poca voglia di impegnarti: prometti di cambiare, e rimandi sempre.",
      arrivo: "Riceverai attenzioni distratte, da qualcuno che fa le cose a metà.",
      consiglio: "Presta attenzione a chi ami, e mantieni almeno una delle cose che hai promesso.",
    },
    lavoro: {
      situazione: "Rimandi un progetto di giorno in giorno, e intanto ti perdi in cose da poco.",
      origine: "Hai cominciato a imparare un mestiere, e hai smesso alle prime difficoltà.",
      ostacolo: "Pesa la distrazione: fai errori nei conti perché hai la testa altrove.",
      arrivo: "Arriverà una notizia deludente sui soldi, oppure un progetto resterà a metà.",
      consiglio: "Finisci quello che hai cominciato prima di pensare a un progetto nuovo.",
    },
    casa: {
      situazione: "Restano a metà in casa molti lavori, perché nessuno ha voglia di finirli.",
      origine: "Avete fatto tanti progetti per la casa senza mai studiarne uno fino in fondo.",
      ostacolo: "Manca in casa chi si prenda un impegno sul serio, e tutto viene rimandato.",
      arrivo: "Darà qualche pensiero qualcuno di giovane in casa, distratto e senza voglia di fare.",
      consiglio: "Dai un compito preciso a chi in casa perde tempo, e controlla che lo finisca.",
    },
    altri: {
      situazione: "Ascolti gli altri a metà, e dimentichi quello che avevi promesso di fare.",
      origine: "Qualcuno ti ha fatto perdere tempo con un progetto che non aveva studiato.",
      ostacolo: "Ti danneggia la fama di persona poco affidabile, che comincia e non finisce.",
      arrivo: "Sentirai molte chiacchiere su un progetto comune, e vedrai pochi fatti.",
      consiglio: "Scegli compagni seri per i tuoi progetti, e lascia perdere chi parla soltanto.",
    },
    se: {
      situazione: "Stai studiando troppe cose insieme, e non ne impari bene nessuna.",
      origine: "Hai avuto buone idee che sono rimaste idee, per mancanza di applicazione.",
      ostacolo: "Resta la pigrizia, che ti fa lasciare a metà ogni cosa che cominci a studiare.",
      arrivo: "Perderai interesse per un progetto appena cominciato, come ti è già successo.",
      consiglio: "Concentrati su una cosa sola, e portala in fondo prima di cambiare.",
    },
  },
};
