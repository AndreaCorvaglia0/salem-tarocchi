// Sei di Denari. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: sei (torna l'equilibrio: si dà e si riceve) × Denari (le cose concrete). Upright: giving and receiving
// generous help that goes both ways. Reversed: help that creates a debt, generosity with a purpose.
export default {
  id: 'p06',
  up: {
    favore: 1, moto: 'cresce',
    essenza: "Dare e ricevere: un aiuto generoso.",
    amore: {
      situazione: "Date e ricevete affetto con la stessa generosità, e nessuno dei due si sente in debito.",
      origine: "Hai ricevuto molto da una persona, e hai imparato a ricambiare.",
      ostacolo: "Ti frena il timore di chiedere, come se in amore si dovesse soltanto dare.",
      arrivo: "Riceverai le attenzioni che hai dato, da chi sa ricambiare.",
      consiglio: "Dai con generosità a chi ami, e accetta con la stessa semplicità quello che ricevi.",
    },
    lavoro: {
      situazione: "Ricevi una buona paga per quello che dai, e puoi permetterti di aiutare qualcuno.",
      origine: "Qualcuno ti ha dato una mano con i soldi, e tu hai ricambiato appena hai potuto.",
      ostacolo: "Pesa il dubbio su quanto dare e a chi, perché non puoi accontentare tutti.",
      arrivo: "Riceverai una paga onesta per il tuo lavoro, oppure un aiuto dato senza secondi fini.",
      consiglio: "Paga il giusto a chi lavora per te, e chiedi il giusto per il tuo lavoro.",
    },
    casa: {
      situazione: "Si divide in casa quello che c'è, e a ciascuno tocca la sua parte.",
      origine: "Avete ricevuto un aiuto dalla famiglia quando serviva, e poi l'avete reso.",
      ostacolo: "Manca un po' di equità in casa: qualcuno dà sempre, e qualcun altro riceve soltanto.",
      arrivo: "Verrà il momento di aiutare un parente, oppure di farvi aiutare voi.",
      consiglio: "Dividi le cose in famiglia con generosità, guardando ai bisogni di ciascuno.",
    },
    altri: {
      situazione: "Aiuti volentieri chi ha meno di te, e il paese ti vuole bene per questo.",
      origine: "Hai fatto del bene a qualcuno senza chiedere niente, e la voce è girata.",
      ostacolo: "Ti mette a disagio dover ricevere un aiuto, tu che di solito lo dai.",
      arrivo: "Riceverai da qualcuno l'aiuto che ti serve, e avrai modo di ricambiarlo.",
      consiglio: "Regala una parte di quello che hai a chi è nel bisogno, senza esagerare.",
    },
    se: {
      situazione: "Dai volentieri e ricevi volentieri, e questo ti fa stare in pace con tutti.",
      origine: "Hai conosciuto sia il bisogno sia l'abbondanza, e sai che cosa vuol dire aiutare.",
      ostacolo: "Resta la fatica ad accettare un dono senza sentirti subito in obbligo.",
      arrivo: "Avrai abbastanza per te e per dare agli altri, e lo farai volentieri.",
      consiglio: "Impara a ricevere con la stessa grazia con cui sai dare.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Un aiuto che crea un debito: dare per avere.",
    amore: {
      situazione: "Dai molto e ricevi poco, oppure ricevi regali che ti fanno sentire in debito.",
      origine: "Hai avuto accanto chi dava solo per avere qualcosa in cambio.",
      ostacolo: "Ti frena un debito di riconoscenza, che ti lega più dell'affetto.",
      arrivo: "Capirai che una gentilezza aveva un prezzo, e ci resterai male.",
      consiglio: "Guarda che cosa ti chiede in cambio chi ti riempie di attenzioni.",
    },
    lavoro: {
      situazione: "Lavori per chi ti paga meno del giusto, e te lo fa pesare come un favore.",
      origine: "Hai accettato un prestito a condizioni dure, e lo stai ancora pagando.",
      ostacolo: "Pesa un debito che non riesci a chiudere, e ti lega a chi te l'ha fatto.",
      arrivo: "Riceverai un'offerta di aiuto che nasconde un interesse, e ti costerà cara.",
      consiglio: "Chiedi che cosa vogliono in cambio prima di accettare soldi, e restituisci presto.",
    },
    casa: {
      situazione: "Si rinfacciano in casa i favori fatti, e ogni aiuto diventa un conto da pagare.",
      origine: "Avete ricevuto un aiuto in famiglia che poi vi è stato fatto pesare per anni.",
      ostacolo: "Manca l'equità in famiglia: chi ha dato molto pretende, e chi ha ricevuto si sente in debito.",
      arrivo: "Verrà chiesto il conto di un vecchio favore, e in casa ci sarà malumore.",
      consiglio: "Chiarisci in famiglia chi deve che cosa, prima che il debito diventi rancore.",
    },
    altri: {
      situazione: "Aiuti gli altri aspettandoti qualcosa in cambio, e loro lo sentono.",
      origine: "Qualcuno ti ha fatto un favore per interesse, e poi è venuto a riscuotere.",
      ostacolo: "Ti lega l'obbligo verso chi ti ha dato una mano, e non riesci a dirgli di no.",
      arrivo: "Scoprirai che la generosità di qualcuno aveva un secondo fine, e ti chiederà il conto.",
      consiglio: "Rifiuta i favori interessati, e dai soltanto quello che puoi dare senza aspettarti niente.",
    },
    se: {
      situazione: "Stai dando più di quello che hai per farti voler bene, e resti a mani vuote.",
      origine: "Hai creduto di dover comprare l'affetto degli altri con i regali.",
      ostacolo: "Resta la sensazione di essere sempre in debito, anche quando non devi niente a nessuno.",
      arrivo: "Ti accorgerai di dare per sentirti importante, più che per generosità.",
      consiglio: "Smetti di tenere il conto di quello che dai, oppure non darlo affatto.",
    },
  },
};
