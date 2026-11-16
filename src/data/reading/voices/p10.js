// Dieci di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: dieci (il ciclo si chiude: tutto il bene di quel seme) × Denari (le cose concrete). Upright: a wealth
// that lasts, family and inheritance. Reversed: the inheritance divides, quarrels in the family over money.
export default {
  id: 'p10',
  up: {
    favore: 2, moto: 'cresce',
    essenza: "Una ricchezza che dura: famiglia ed eredità.",
    amore: {
      situazione: "Vivi un legame solido, di quelli che durano e diventano famiglia.",
      origine: "Hai avuto in famiglia l'esempio di un amore che dura, e te lo porti dentro.",
      ostacolo: "Pesa il parere della famiglia su chi ami, perché da voi le tradizioni contano.",
      arrivo: "Metterete su casa e famiglia, e sarà una cosa fatta per durare.",
      consiglio: "Costruisci con chi ami qualcosa che duri negli anni, come si fa una famiglia.",
    },
    lavoro: {
      situazione: "Godi di un lavoro stabile e di guadagni sicuri, abbastanza da pensare a chi verrà dopo.",
      origine: "Hai ereditato un mestiere o dei beni, e hai cominciato da una base solida.",
      ostacolo: "Ti lega il peso di un'eredità: devi portare avanti quello che altri hanno cominciato.",
      arrivo: "Raggiungerai una ricchezza solida, che resterà anche a chi viene dopo di te.",
      consiglio: "Metti i soldi in cose che durano, e pensa a che cosa vuoi lasciare.",
    },
    casa: {
      situazione: "Regna in casa la sicurezza di una famiglia unita, che dura da generazioni.",
      origine: "Avete ricevuto in eredità dai vostri vecchi una casa e delle abitudini, e le avete mantenute.",
      ostacolo: "Pesano le tradizioni di famiglia, che danno sicurezza e lasciano poco spazio alle novità.",
      arrivo: "Vedrete la famiglia riunita e la casa al sicuro, per molti anni.",
      consiglio: "Tieni unita la famiglia, e abbi cura di quello che vi è stato lasciato.",
    },
    altri: {
      situazione: "Appartieni a una famiglia stimata in paese, e questo ti apre molte porte.",
      origine: "Avevi intorno gente solida, vicini e parenti su cui contare sempre.",
      ostacolo: "Ti condiziona il buon nome della famiglia, che in paese tutti si aspettano di vederti onorare.",
      arrivo: "Entrerai a far parte di una cerchia solida, che ti accoglierà come in famiglia.",
      consiglio: "Coltiva i legami che durano da generazioni, perché sono la tua vera ricchezza.",
    },
    se: {
      situazione: "Senti di avere radici solide, e sai da dove vieni e che cosa possiedi.",
      origine: "Hai ricevuto dalla tua famiglia più di quanto pensi, in beni e in insegnamenti.",
      ostacolo: "Resta il dubbio se la strada sia tua, oppure quella che la famiglia ha scelto per te.",
      arrivo: "Arriverai a una stabilità piena, con la sensazione di aver costruito qualcosa che resta.",
      consiglio: "Onora quello che hai ereditato, e aggiungi qualcosa di tuo da lasciare a chi verrà.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "L'eredità che divide: liti in famiglia per i soldi.",
    amore: {
      situazione: "Litigate per i soldi o per le famiglie, e l'affetto passa in secondo piano.",
      origine: "Hai visto la tua famiglia mettersi in mezzo a un tuo amore, fino a dividervi.",
      ostacolo: "Ti frena il peso delle famiglie, che su di voi hanno troppo da dire.",
      arrivo: "Nascerà una lite sui beni o sulla casa, e metterà alla prova il vostro legame.",
      consiglio: "Tieni i conti di famiglia fuori dall'amore, e decidete in due quello che vi riguarda.",
    },
    lavoro: {
      situazione: "Vedi andare in fumo un patrimonio che sembrava sicuro, tra liti e spese sbagliate.",
      origine: "Hai perso una parte di quello che ti spettava, per una lite tra parenti.",
      ostacolo: "Pesa una questione di eredità non risolta, che tiene fermi soldi e persone.",
      arrivo: "Si dividerà un bene di famiglia, e non tutti saranno contenti della loro parte.",
      consiglio: "Metti per iscritto chi ha diritto a che cosa, prima che i soldi rovinino i rapporti.",
    },
    casa: {
      situazione: "Si litiga in casa per i soldi, e la famiglia non è più unita come sembrava.",
      origine: "Avete visto la famiglia dividersi dopo una spartizione, e certi rancori sono rimasti.",
      ostacolo: "Mancano basi solide: la famiglia sembra ricca e unita, ma i soldi la dividono.",
      arrivo: "Verrà fuori in casa una vecchia questione di soldi, e bisognerà affrontarla.",
      consiglio: "Cerca un accordo giusto in famiglia, perché nessuna eredità vale una lite che dura anni.",
    },
    altri: {
      situazione: "Tutto il paese chiacchiera delle liti della tua famiglia, e ne soffri.",
      origine: "Qualcuno ha rotto con te per una questione di soldi, dopo anni di amicizia.",
      ostacolo: "Ti pesa il nome della tua famiglia, che in paese non è più stimato come una volta.",
      arrivo: "Perderai un vecchio appoggio per una lite di interessi, e ti dispiacerà.",
      consiglio: "Resta fuori dalle liti per i soldi degli altri, e non prestare a chi ti è caro.",
    },
    se: {
      situazione: "Senti la tua famiglia come un peso, e nelle sue liti non ti riconosci più.",
      origine: "Hai rifiutato quello che la famiglia voleva lasciarti, oppure ti è stato negato.",
      ostacolo: "Rimane l'insicurezza di chi non ha una famiglia solida su cui contare.",
      arrivo: "Dovrai cavartela senza l'aiuto della famiglia, e costruire da te quello che ti serve.",
      consiglio: "Smetti di aspettare l'eredità che ti spetta, e comincia a costruire qualcosa di tuo.",
    },
  },
};
