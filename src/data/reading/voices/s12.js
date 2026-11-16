// Cavaliere di Spade. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Who × suit: Cavaliere (chi va) × Spade (la mente, le parole). Upright: someone who goes straight and fast for an
// idea and speaks frankly. Reversed: the charge overdone, haste and rash words.
export default {
  id: 's12',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "Chi va dritto e veloce, e parla schietto.",
    amore: {
      situazione: "Vai dritto verso chi ti piace, e dici schietto quello che pensi.",
      origine: "Hai dichiarato in fretta quello che provavi, con parole schiette.",
      ostacolo: "Ti spinge una gran voglia di andare veloce, e chi ami fatica a starti dietro.",
      arrivo: "Arriverà qualcuno deciso e schietto, che ti dirà subito che cosa vuole.",
      consiglio: "Parla schietto e fatti avanti, perché questo è il momento di muoversi.",
    },
    lavoro: {
      situazione: "Stai andando veloce e dritto verso un obiettivo, con le idee ben decise.",
      origine: "Avevi un'idea in testa e l'hai seguita veloce, senza esitare.",
      ostacolo: "Corre tutto molto veloce, e devi decidere in fretta senza perdere la direzione.",
      arrivo: "Si muoverà tutto velocemente in un affare, e dovrai andare dritto allo scopo.",
      consiglio: "Agisci con decisione e di' schietto come stanno le cose, senza perdere altro tempo.",
    },
    casa: {
      situazione: "C'è in casa qualcuno che decide e parte veloce, e trascina tutti con sé.",
      origine: "Una parola schietta, detta in famiglia, ha fatto muovere tutto in poco tempo.",
      ostacolo: "Cambia tutto molto veloce in casa, e qualcuno fatica a stare al passo.",
      arrivo: "Verrà una decisione veloce in famiglia, presa con parole schiette e senza ripensamenti.",
      consiglio: "Prendi l'iniziativa in casa, e di' schietto quello che va cambiato.",
    },
    altri: {
      situazione: "Dici schietto in faccia quello che pensi, e la gente sa sempre come la vedi.",
      origine: "Hai difeso un'idea davanti a tutti, andando dritto e senza paura.",
      ostacolo: "Ti viene incontro una persona decisa, che va veloce e non ama discutere.",
      arrivo: "Incontrerai chi va dritto allo scopo, e con la sua spinta farai più strada.",
      consiglio: "Schierati con parole schiette per quello in cui credi, senza aspettare il consenso di tutti.",
    },
    se: {
      situazione: "Hai la mente decisa e veloce, e sai dove vuoi arrivare.",
      origine: "Inseguivi un'idea andando dritto, e niente ti faceva deviare.",
      ostacolo: "Pesa la voglia di arrivare veloce, che ti fa saltare qualche passaggio.",
      arrivo: "Troverai la decisione per andare dritto verso una cosa che rimandavi.",
      consiglio: "Vai dritto con la tua idea, guardando anche dove metti i piedi.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Chi parte alla carica: fretta e parole avventate.",
    amore: {
      situazione: "Corri troppo in questo amore, e con la fretta dici parole avventate.",
      origine: "Hai detto parole avventate in un momento di rabbia, e hanno fatto danno.",
      ostacolo: "Ti tradisce la fretta, che ti fa parlare e agire prima di pensare.",
      arrivo: "Arriverà uno scatto di parole avventate tra voi, detto senza riflettere.",
      consiglio: "Conta fino a dieci prima di rispondere, e non decidere niente in fretta.",
    },
    lavoro: {
      situazione: "Ti butti a testa bassa in un affare, con troppa fretta di concludere.",
      origine: "Avevi preso una decisione affrettata, e hai dovuto rimediare ai danni.",
      ostacolo: "Pesa la troppa fretta, che ti fa sbagliare cose che sapresti fare bene.",
      arrivo: "Avrai la tentazione di fare in fretta in un affare, e rischierai di rovinarlo.",
      consiglio: "Rallenta e rileggi i tuoi piani, perché la fretta ti costerebbe cara.",
    },
    casa: {
      situazione: "C'è in casa chi parla senza riguardo, e con parole avventate offende gli altri.",
      origine: "Qualcuno in famiglia ha deciso per tutti, in fretta e senza ascoltare nessuno.",
      ostacolo: "Si accende ogni discussione in casa per parole avventate, dette senza pensare.",
      arrivo: "Qualcuno in famiglia farà un gesto avventato, e ci sarà da calmare gli animi.",
      consiglio: "Frena la lingua con i tuoi quando hai fretta, e rimanda il discorso a mente calma.",
    },
    altri: {
      situazione: "Affronti la gente a muso duro, e le tue parole avventate passano per prepotenza.",
      origine: "Hai attaccato qualcuno con parole avventate davanti a tutti, e da allora ti evita.",
      ostacolo: "Ti viene addosso una persona impulsiva, che parla in fretta e non ascolta.",
      arrivo: "Qualcuno ti dirà una cosa sgarbata per troppa fretta, senza vera cattiveria.",
      consiglio: "Evita di rispondere in fretta a chi ti provoca, e lascia passare la furia.",
    },
    se: {
      situazione: "Hai la testa che corre più dei fatti, e per fretta agisci prima di avere capito.",
      origine: "Inseguivi ogni idea in fretta, e molte le hai lasciate a metà strada.",
      ostacolo: "Manca la pazienza di fermarti a pensare, e la fretta decide per te.",
      arrivo: "Rischierai un passo avventato, se non terrai a freno la fretta.",
      consiglio: "Fermati un momento prima di lanciarti, e chiediti dove porta questa fretta.",
    },
  },
};
