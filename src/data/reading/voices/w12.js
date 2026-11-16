// Cavaliere di Bastoni. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Who × suit: Cavaliere (chi va) × Bastoni (la volontà). Upright: someone who rides off at full speed, all passion,
// action and adventure. Reversed: haste and anger, departures with no destination, or standing still at the start.
export default {
  id: 'w12',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "Chi va di corsa, spinto dalla passione.",
    amore: {
      situazione: "Vivi una passione travolgente, e ti butti senza pensarci due volte.",
      origine: "Hai seguito l'impulso del momento, e ne è nata una passione.",
      ostacolo: "Ti frena la tua stessa irruenza, perché corri troppo e l'altra persona si spaventa.",
      arrivo: "Arriverà qualcuno pieno di passione, e ti trascinerà in un'avventura.",
      consiglio: "Buttati in questa storia con tutta la passione che senti.",
    },
    lavoro: {
      situazione: "Stai andando di corsa verso un obiettivo, con tanta energia e poca pazienza.",
      origine: "Hai lasciato una strada sicura per un'avventura, senza guardarti indietro.",
      ostacolo: "Manca la pazienza, perché agisci d'impulso e i dettagli restano indietro.",
      arrivo: "Partirai per un'impresa nuova, forse un viaggio o un cambio di lavoro.",
      consiglio: "Passa all'azione senza aspettare oltre, finché hai tutta questa energia.",
    },
    casa: {
      situazione: "C'è in casa qualcuno sempre in movimento, che trascina tutti nelle sue imprese.",
      origine: "Avete cambiato casa o vita d'impulso, per seguire una passione.",
      ostacolo: "Pesa in casa l'irrequietezza di chi vuole partire, mentre gli altri vogliono restare.",
      arrivo: "Verrà una partenza o un trasloco improvviso, e la casa si metterà in movimento.",
      consiglio: "Porta in casa un po' d'avventura, e proponi di fare una cosa mai fatta.",
    },
    altri: {
      situazione: "Trascini gli altri con la tua passione, e ti seguono volentieri.",
      origine: "Qualcuno di impetuoso è entrato nella tua vita, e l'ha messa in movimento.",
      ostacolo: "Ti lasci indietro i compagni quando parti di corsa, e resti senza nessuno.",
      arrivo: "Incontrerai una persona coraggiosa e impulsiva, che ti proporrà un'avventura.",
      consiglio: "Parti con chi ha il tuo stesso coraggio, senza aspettare i più prudenti.",
    },
    se: {
      situazione: "Senti il bisogno di agire e di muoverti, e stare dove sei ti pesa.",
      origine: "Hai sempre seguito le tue passioni di corsa, senza chiedere il permesso.",
      ostacolo: "Resta difficile finire le cose, perché la passione ti porta già verso l'impresa dopo.",
      arrivo: "Avrai il coraggio di partire per quello che ti appassiona, senza più esitare.",
      consiglio: "Segui la passione e passa ai fatti, perché hai pensato abbastanza.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Chi corre senza meta: troppa fretta e rabbia.",
    amore: {
      situazione: "Bruci le tappe in amore con troppa fretta, e basta poco per farti arrabbiare.",
      origine: "Hai lasciato qualcuno in un momento di rabbia, senza pensarci.",
      ostacolo: "Ti frena la rabbia improvvisa, che ti fa dire cose di cui ti penti.",
      arrivo: "Incontrerai qualcuno che arriva di corsa e riparte subito, senza una meta.",
      consiglio: "Conta fino a dieci prima di parlare, quando la rabbia sale.",
    },
    lavoro: {
      situazione: "Corri da una cosa all'altra senza una meta, e sprechi molte energie.",
      origine: "Avevi mollato un lavoro per uno scatto di rabbia, senza un altro in vista.",
      ostacolo: "Rovina tutto la fretta, perché parti senza una meta e torni al punto di partenza.",
      arrivo: "Farai una mossa avventata negli affari, se la fretta avrà la meglio.",
      consiglio: "Decidi dove vuoi arrivare, prima di ripartire di corsa.",
    },
    casa: {
      situazione: "C'è in casa chi si arrabbia per niente, e tutti camminano in punta di piedi.",
      origine: "Avete avuto in famiglia partenze brusche e porte sbattute per rabbia.",
      ostacolo: "Pesa in casa l'impazienza di qualcuno, che vuole tutto subito e alza la voce.",
      arrivo: "Scoppierà in casa una sfuriata, e qualcuno minaccerà di andarsene.",
      consiglio: "Lascia sbollire la rabbia in casa, e riparlane il giorno dopo.",
    },
    altri: {
      situazione: "Rispondi d'impulso a tutti, e ti fai la fama di persona litigiosa.",
      origine: "Qualcuno è partito di corsa dalla tua vita, senza dare spiegazioni.",
      ostacolo: "Ti frena la fretta con cui giudichi tutti, e la rabbia ti fa perdere amicizie.",
      arrivo: "Avrai uno scontro con una persona frettolosa e irascibile, che non sente ragioni.",
      consiglio: "Evita di seguire chi corre senza sapere dove, anche se ti trascina.",
    },
    se: {
      situazione: "Stai correndo senza sapere dove, e la fretta ti rende irritabile.",
      origine: "Hai cominciato molte imprese con furia, e le hai abbandonate a metà strada.",
      ostacolo: "Resta tanta energia senza una direzione, e si trasforma in rabbia.",
      arrivo: "Sentirai la voglia di mollare tutto e partire, ma sarà solo impazienza.",
      consiglio: "Sfoga l'energia in una fatica utile, e datti una meta precisa.",
    },
  },
};
