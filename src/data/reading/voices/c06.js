// Sei di Coppe. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: sei (si dà e si riceve, torna l'equilibrio) × Coppe (il cuore). Upright: a sweet memory, a simple gift.
// Reversed: stuck in the past, nostalgia that holds back, memories that sting.
export default {
  id: 'c06',
  up: {
    favore: 1, moto: 'torna',
    essenza: "Un ricordo dolce, e un dono semplice.",
    amore: {
      situazione: "Vivi un affetto semplice e gentile, che ti ricorda i primi amori.",
      origine: "Hai avuto un amore di gioventù, e ne conservi un ricordo dolce.",
      ostacolo: "Ti trattiene il ricordo dolce di un amore passato, a cui paragoni quello di oggi.",
      arrivo: "Tornerà una persona del tuo passato, e la rivedrai con piacere.",
      consiglio: "Fai un dono semplice a chi ami, di quelli che si ricordano a lungo.",
    },
    lavoro: {
      situazione: "Lavori bene grazie a quello che hai imparato da giovane e a chi ti conosce da sempre.",
      origine: "Hai imparato il mestiere da giovane, da qualcuno che insegnava con gentilezza.",
      ostacolo: "Resta l'abitudine di fare come si faceva una volta, e le cose nuove le guardi poco.",
      arrivo: "Riceverai un aiuto o un dono da una vecchia conoscenza, senza che tu lo chieda.",
      consiglio: "Torna a chiedere un parere a chi ti ha insegnato il mestiere, e ringrazialo come una volta.",
    },
    casa: {
      situazione: "C'è in casa un'aria di altri tempi, fatta di ricordi e di piccole gentilezze.",
      origine: "Avevi da giovane una casa serena, di cui conservi un ricordo dolce.",
      ostacolo: "Lega tutti ai ricordi di casa un affetto così dolce, che cambiare qualcosa dispiace.",
      arrivo: "Tornerà a trovarvi qualcuno di famiglia, e si passerà la sera a ricordare.",
      consiglio: "Tira fuori i ricordi di famiglia e raccontali ai più giovani, che li ascoltano volentieri.",
    },
    altri: {
      situazione: "Ritrovi un'amicizia d'infanzia, e fra voi è tutto semplice come allora.",
      origine: "Qualcuno ti ha fatto una gentilezza quando eri giovane, e la ricordi ancora.",
      ostacolo: "Ti fidi soltanto di chi conosci da sempre, e ai nuovi arrivati dai poca confidenza.",
      arrivo: "Rivedrai una persona cara di una volta, e sarà come se il tempo non fosse passato.",
      consiglio: "Porta un piccolo dono a un vicino, come si faceva una volta, senza un motivo.",
    },
    se: {
      situazione: "Ripensi con dolcezza a quando eri giovane, e quel ricordo ti fa bene.",
      origine: "Hai portato con te dall'infanzia un modo semplice e gentile di guardare le cose.",
      ostacolo: "Ti manca un po' la leggerezza di una volta, e la cerchi nei ricordi.",
      arrivo: "Tornerà un ricordo felice a farti compagnia, e ti dirà che cosa ti piace davvero.",
      consiglio: "Riprendi una cosa che amavi fare da giovane, e falla con la semplicità di allora.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "Restare nel passato: la nostalgia che trattiene.",
    amore: {
      situazione: "Vivi di nostalgia per un amore passato, e quello che hai non lo guardi.",
      origine: "Hai rimpianto a lungo una persona di una volta, e nessuno ha preso il suo posto.",
      ostacolo: "Ti frena il confronto con il passato: nessuno regge il paragone con chi ricordi.",
      arrivo: "Tornerà qualcuno del passato, e riaprirà ricordi che ti faranno più male che bene.",
      consiglio: "Lascia il passato dov'è, e guarda chi hai davanti per quello che è oggi.",
    },
    lavoro: {
      situazione: "Rimpiangi i tempi in cui il lavoro andava meglio, e intanto non cambi niente.",
      origine: "Hai continuato a fare come una volta, anche quando non rendeva più.",
      ostacolo: "Resti con la testa nel passato, e i modi vecchi non ti fanno avanzare.",
      arrivo: "Capirai che i guadagni di una volta non tornano, e ti toccherà cercare altro.",
      consiglio: "Tieni del passato quello che serve ancora, e il resto lascialo andare.",
    },
    casa: {
      situazione: "Si vive di ricordi in casa tua, e ogni cosa nuova viene accolta male.",
      origine: "Avete tenuto la casa com'era una volta, per paura di perdere i ricordi.",
      ostacolo: "Pesa un ricordo di famiglia che punge ancora, ogni volta che qualcuno lo nomina.",
      arrivo: "Verrà a galla un vecchio ricordo di famiglia, e farà male a più d'uno.",
      consiglio: "Cambia qualcosa in casa, anche una cosa piccola, senza chiedere permesso ai ricordi.",
    },
    altri: {
      situazione: "Cerchi negli altri gli amici di una volta, e quelli di oggi ti deludono.",
      origine: "Qualcuno a cui tenevi è cambiato, e tu hai continuato a vederlo com'era una volta.",
      ostacolo: "Ti lega una vecchia amicizia che ormai vive soltanto di ricordi.",
      arrivo: "Rivedrai gente di una volta, e ti accorgerai che il tempo ha cambiato tutti.",
      consiglio: "Smetti di ripetere com'era bello una volta, e fai conoscenza con chi c'è adesso.",
    },
    se: {
      situazione: "Stai con la testa nel passato, e le tue giornate ti scivolano via.",
      origine: "Hai guardato con nostalgia alla giovinezza come a un'età d'oro, e il presente ci ha perso.",
      ostacolo: "Ti trattiene la nostalgia: vorresti tornare a com'eri, e così non cresci.",
      arrivo: "Sentirai pungere certi ricordi, finché non deciderai di guardare avanti.",
      consiglio: "Ringrazia il passato per quello che ti ha dato, e torna a occuparti di oggi.",
    },
  },
};
