// Asso di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: asso (comincia qualcosa) × Denari (le cose concrete). Upright: a concrete chance, the seed of a gain.
// Reversed: the chance slips away, or is taken badly (money spent on a poor plan).
export default {
  id: 'p01',
  up: {
    favore: 2, moto: 'inizia',
    essenza: "Un'occasione concreta: il seme di un guadagno.",
    amore: {
      situazione: "Si apre per te l'occasione di una storia seria, fatta di cose concrete.",
      origine: "Hai avuto l'occasione di conoscere una persona affidabile, e da lì è nato qualcosa di solido.",
      ostacolo: "Ti frena la cautela di chi ha davanti un'occasione seria e vuole coglierla bene.",
      arrivo: "Arriverà l'occasione di costruire qualcosa di vero con una persona.",
      consiglio: "Cogli l'occasione che hai davanti, e dimostra l'affetto con i fatti.",
    },
    lavoro: {
      situazione: "Tieni tra le mani un'occasione di guadagno, piccola ma concreta.",
      origine: "Hai cominciato con poco, e quel poco era il seme giusto.",
      ostacolo: "Resta tutto da coltivare: l'occasione c'è, ma è ancora soltanto un seme.",
      arrivo: "Arriverà un'offerta concreta, un lavoro o un guadagno da cui partire.",
      consiglio: "Accetta l'occasione che ti offrono, e comincia subito a darti da fare.",
    },
    casa: {
      situazione: "Si presenta l'occasione di sistemare la casa, o di trovarne una.",
      origine: "Avete cominciato da un piccolo dono, e la casa è cresciuta da quel seme.",
      ostacolo: "Manca ancora l'accordo di tutti in casa, per far fruttare un'occasione così concreta.",
      arrivo: "Verrà un primo guadagno, e sarà il seme di qualcosa per tutta la famiglia.",
      consiglio: "Metti da parte il primo soldo per la casa: è un seme che crescerà.",
    },
    altri: {
      situazione: "Qualcuno del paese ti offre un'occasione concreta, e vale la pena ascoltare.",
      origine: "Un conoscente ti ha aperto un'occasione di guadagno, e da lì hai potuto cominciare.",
      ostacolo: "Ti imbarazza accettare un'occasione così buona da un amico, e temi di restare in debito.",
      arrivo: "Qualcuno ti proporrà un affare buono, e da lì comincerà un lavoro in comune.",
      consiglio: "Chiedi in giro senza vergogna: l'occasione che cerchi passa dalle persone che conosci.",
    },
    se: {
      situazione: "Stai per cominciare qualcosa di concreto, e hai i mezzi per farlo bene.",
      origine: "Hai avuto in mano un'occasione vera, e hai saputo riconoscerla.",
      ostacolo: "Ti manca soltanto di credere che un'occasione così concreta sia proprio per te.",
      arrivo: "Avrai l'occasione di mettere a frutto quello che sai fare.",
      consiglio: "Comincia dal piccolo e dal concreto, e lascia che il seme cresca.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "L'occasione sfuggita, o colta nel modo sbagliato.",
    amore: {
      situazione: "Stai lasciando sfuggire un'occasione con una persona che fa sul serio.",
      origine: "Hai perso un'occasione per esitazione, e l'altra persona ha smesso di aspettare.",
      ostacolo: "Ti frena il pensiero dell'occasione mancata, e non vedi quelle che hai davanti.",
      arrivo: "Sfumerà un'occasione su cui contavi, perché alle parole non seguiranno i fatti.",
      consiglio: "Rispondi finché l'occasione c'è ancora, perché non aspetterà a lungo.",
    },
    lavoro: {
      situazione: "Stai mettendo soldi in un affare pensato male, e il guadagno non si vede.",
      origine: "Hai lasciato passare un'offerta buona, e l'hai capito troppo tardi.",
      ostacolo: "Pesa una spesa sbagliata fatta all'inizio, che ancora ti mangia i guadagni.",
      arrivo: "Tarderà il guadagno che aspetti, e un'occasione potrà sfuggirti di mano.",
      consiglio: "Rifai bene i conti prima di spendere, perché l'occasione non è buona come sembra.",
    },
    casa: {
      situazione: "Sfugge alla famiglia un'occasione buona, perché nessuno si muove per tempo.",
      origine: "Avete speso male una somma che doveva servire a cominciare.",
      ostacolo: "Pesa in casa un'occasione persa, di cui ancora ci si rimprovera a vicenda.",
      arrivo: "Salterà un'occasione per la casa su cui contavate, e bisognerà aspettarne un'altra.",
      consiglio: "Pensa bene prima di spendere per la casa, perché non ogni occasione è buona.",
    },
    altri: {
      situazione: "Diffidi di ogni proposta, e intanto le occasioni buone vanno ad altri.",
      origine: "Qualcuno ti ha proposto un affare che non valeva niente, e ci hai rimesso.",
      ostacolo: "Ti danneggia chi promette molto e non mantiene, e l'occasione vera ti passa accanto.",
      arrivo: "Riceverai un'offerta che sembrerà buona, e che andrà guardata due volte.",
      consiglio: "Lascia perdere chi ti propone guadagni facili, e cerca gente di parola.",
    },
    se: {
      situazione: "Sprechi un'occasione perché aspetti che tutto sia perfetto per cominciare.",
      origine: "Avevi una possibilità concreta, e l'hai lasciata cadere per poca fiducia.",
      ostacolo: "Resta il vizio di cominciare male, in fretta e senza un piano.",
      arrivo: "Coglierai male un'occasione, per fretta, e dovrai ricominciare con più attenzione.",
      consiglio: "Prepara bene il terreno prima di seminare, e la prossima occasione non ti sfuggirà.",
    },
  },
};
