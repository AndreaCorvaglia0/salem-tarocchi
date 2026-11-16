// Sette di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: sette (ci si ferma a valutare, una prova di pazienza) × Denari (le cose concrete). Upright: patience,
// the work is done and the harvest must ripen. Reversed: impatience, effort that does not pay, harvesting too early.
export default {
  id: 'p07',
  up: {
    favore: 0, moto: 'ferma',
    essenza: "Pazienza: il lavoro è fatto, il raccolto deve maturare.",
    amore: {
      situazione: "Aspetti con pazienza i frutti di un legame a cui hai dato molto.",
      origine: "Qualcuno ti ha fatto aspettare a lungo, e tu hai coltivato quell'affetto con pazienza.",
      ostacolo: "Ti pesa l'attesa: hai seminato tanto, e i frutti tardano a vedersi.",
      arrivo: "Vedrai maturare questo legame, e la pazienza di aspettare sarà premiata.",
      consiglio: "Dai tempo a questo sentimento, con pazienza, e guarda se vale la fatica.",
    },
    lavoro: {
      situazione: "Ti fermi a guardare il lavoro fatto, e ti chiedi se renderà quanto speravi.",
      origine: "Hai lavorato a lungo senza guadagno, pensando al raccolto che sarebbe venuto.",
      ostacolo: "Manca ancora tempo al guadagno, e la pazienza comincia a consumarsi.",
      arrivo: "Vedrai i frutti del tuo lavoro, ma non prima che siano maturi.",
      consiglio: "Aspetta ancora prima di raccogliere, e valuta con calma dove mettere altre forze.",
    },
    casa: {
      situazione: "Cresce piano un progetto per la casa, e richiede a tutti ancora pazienza.",
      origine: "Avete fatto sacrifici per anni, pensando al bene che ne sarebbe venuto alla famiglia.",
      ostacolo: "Pesa la lentezza: in casa si lavora molto, e i risultati tardano.",
      arrivo: "Darà frutto quello che state seminando in famiglia, se avrete la pazienza di aspettare.",
      consiglio: "Continua a prenderti cura della casa con pazienza, senza pretendere tutto subito.",
    },
    altri: {
      situazione: "Attendi con pazienza che un'amicizia coltivata a lungo dia i suoi frutti.",
      origine: "Hai seminato fiducia tra la gente, un favore alla volta, senza fretta.",
      ostacolo: "Ti scoraggia vedere che gli altri raccolgono prima di te, con meno fatica.",
      arrivo: "Maturerà piano la stima degli altri, e ti tornerà quello che hai dato con pazienza.",
      consiglio: "Valuta con calma su chi vale la pena puntare, e abbi pazienza con loro.",
    },
    se: {
      situazione: "Stai facendo il punto su quello che hai costruito, in attesa che dia frutto.",
      origine: "Hai messo tempo e fatica in qualcosa che cresce lentamente.",
      ostacolo: "Resta il dubbio di aver lavorato per niente, mentre aspetti i frutti.",
      arrivo: "Raccoglierai quello che hai seminato, a patto di saper aspettare.",
      consiglio: "Guarda quanto è cresciuto quello che hai seminato, e aspetta il frutto con pazienza.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Impazienza: fatica che non rende, raccolto prima del tempo.",
    amore: {
      situazione: "Vuoi risposte subito da chi ami, e la tua fretta non lascia crescere niente.",
      origine: "Hai dato tanto a una persona senza riceverne niente, ed è stata fatica sprecata.",
      ostacolo: "Ti frena l'impazienza: pretendi frutti da un legame appena nato.",
      arrivo: "Ti stancherai di aspettare un affetto che non matura, e vorrai lasciar perdere.",
      consiglio: "Chiediti se questo legame ti dà qualcosa, oppure se stai solo faticando.",
    },
    lavoro: {
      situazione: "Lavori molto e raccogli poco, e cominci a chiederti dove sbagli.",
      origine: "Hai messo soldi e fatica in un affare che non ha reso niente.",
      ostacolo: "Pesa la fretta di guadagnare, che ti fa raccogliere prima del tempo.",
      arrivo: "Renderà meno del previsto il lavoro che stai facendo, e servirà cambiare qualcosa.",
      consiglio: "Smetti di mettere forze dove non torna niente, e spostale su un lavoro migliore.",
    },
    casa: {
      situazione: "Si fatica molto in casa senza vedere risultati, e la pazienza è finita.",
      origine: "Avete fatto sacrifici per la casa che non hanno dato il frutto sperato.",
      ostacolo: "Manca la pazienza in famiglia: si vuole tutto subito, e niente arriva a maturare.",
      arrivo: "Andrà per le lunghe un progetto di famiglia, più di quanto avete voglia di aspettare.",
      consiglio: "Rivedi con la famiglia dove vanno tempo e soldi, perché qualcosa non rende.",
    },
    altri: {
      situazione: "Dai molto agli altri e ti torna poco, e cominci a spazientirti.",
      origine: "Coltivavi un'amicizia a senso unico, che non ti ha mai dato niente.",
      ostacolo: "Ti rode vedere premiato chi ha faticato meno, e perdi la voglia di impegnarti.",
      arrivo: "Resterà senza frutto un favore fatto a qualcuno, e ti servirà di lezione.",
      consiglio: "Lascia perdere chi prende soltanto, e dedica il tuo tempo a chi ricambia.",
    },
    se: {
      situazione: "Stai perdendo la pazienza con te e con i tuoi progressi troppo lenti.",
      origine: "Hai abbandonato qualcosa a metà perché i risultati non arrivavano abbastanza in fretta.",
      ostacolo: "Resta la tentazione di mollare tutto proprio quando manca poco al raccolto.",
      arrivo: "Sentirai di aver faticato a vuoto, e dovrai decidere se insistere o cambiare.",
      consiglio: "Decidi con calma che cosa merita ancora la tua fatica, senza farti guidare dalla fretta.",
    },
  },
};
