// Tre di Coppe. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: tre (qualcosa cresce, insieme ad altri) × Coppe (il cuore). Upright: shared joy, a feast among friends.
// Reversed: the feast goes too far, or the group leaves someone out.
export default {
  id: 'c03',
  up: {
    favore: 2, moto: 'cresce',
    essenza: "La gioia condivisa: una festa tra amici.",
    amore: {
      situazione: "Gira allegria intorno al tuo amore, e chi ti vuole bene festeggia con te.",
      origine: "Hai vissuto un amore allegro, nato in compagnia e cresciuto fra gli amici.",
      ostacolo: "Ti trattiene il pudore di mostrare agli amici in festa quanto sei felice.",
      arrivo: "Arriverà una festa in cui il cuore avrà la sua parte, e la gioia sarà di tutti.",
      consiglio: "Porta chi ami in mezzo ai tuoi amici, e festeggiate quello che avete.",
    },
    lavoro: {
      situazione: "Lavori in buona compagnia, e i primi risultati si festeggiano tutti insieme.",
      origine: "Avete raggiunto insieme un buon risultato, e l'avete festeggiato come si deve.",
      ostacolo: "Ti costa tornare al lavoro dopo la festa, tanto si sta bene in compagnia.",
      arrivo: "Festeggerai un buon affare o un raccolto riuscito, insieme a chi ti ha dato una mano.",
      consiglio: "Dividi il merito con chi ha lavorato con te, e fate festa insieme.",
    },
    casa: {
      situazione: "C'è aria di festa in casa, e la tavola è piena di gente contenta.",
      origine: "Avevi una casa sempre aperta, dove ogni occasione era buona per fare festa.",
      ostacolo: "Dispiace a tutti in casa che la festa con gli amici debba finire.",
      arrivo: "Verrà una bella notizia in famiglia, e vi troverete tutti a festeggiare.",
      consiglio: "Invita a casa le persone care, e festeggia anche le cose piccole.",
    },
    altri: {
      situazione: "Vivi in mezzo ad amici veri, e insieme a loro ogni cosa diventa una festa.",
      origine: "Qualcuno ti ha fatto entrare nella sua compagnia, e fra quegli amici hai trovato allegria.",
      ostacolo: "Ti pesa dire di no agli amici, e per stare in compagnia trascuri il resto.",
      arrivo: "Riceverai un invito a una festa, e ci troverai gente con cui starai bene.",
      consiglio: "Cerca i tuoi amici e proponi una festa, anche senza un motivo.",
    },
    se: {
      situazione: "Stai bene in mezzo agli altri, e la tua gioia cresce quando la dividi.",
      origine: "Hai superato un momento difficile grazie agli amici, e alla fine avete festeggiato.",
      ostacolo: "Ti appoggi molto alla compagnia, e nelle giornate senza amici ti manca l'allegria.",
      arrivo: "Avrai qualcosa di tuo da festeggiare, e amici con cui farlo.",
      consiglio: "Racconta la tua gioia agli amici, perché divisa con loro diventa più grande.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "La festa esagera, e qualcuno resta fuori.",
    amore: {
      situazione: "Chi ami fa festa con tutti, e tu resti fuori a guardare.",
      origine: "Hai amato una persona tutta feste e compagnie, e per te restava poco posto.",
      ostacolo: "Ti frena l'esagerazione: troppe feste e troppa gente, e per voi due resta poco.",
      arrivo: "Verrà un periodo di troppa allegria fuori casa, e l'amore resterà in disparte.",
      consiglio: "Lascia fuori gli altri, per una volta, e passa del tempo con chi ami.",
    },
    lavoro: {
      situazione: "Resti fuori dagli accordi che gli altri prendono fra loro, e lavori per conto tuo.",
      origine: "Hai speso troppo in feste e compagnia, e i conti non sono più tornati.",
      ostacolo: "Manca la misura: si festeggia ogni guadagno prima di averlo in mano.",
      arrivo: "Finirà in feste esagerate un guadagno, e te ne resterà meno del previsto.",
      consiglio: "Festeggia con misura, e metti da parte qualcosa prima di offrire a tutti.",
    },
    casa: {
      situazione: "Qualcuno in casa resta fuori dai discorsi degli altri, e si sente di troppo.",
      origine: "Avete esagerato con una festa di famiglia, ed è finita con qualche parola di troppo.",
      ostacolo: "Pesa in casa chi esagera con le feste, e lascia agli altri le faccende.",
      arrivo: "Verrà una festa di famiglia a cui qualcuno non sarà invitato, e se ne parlerà a lungo.",
      consiglio: "Chiama a tavola anche chi di solito resta in disparte, e fagli posto.",
    },
    altri: {
      situazione: "Senti gli amici fare festa senza di te, e ti chiedi che cosa hai sbagliato.",
      origine: "Qualcuno ha sparlato di te in paese, e una compagnia ha smesso di invitarti.",
      ostacolo: "Ti ferisce restare fuori da una compagnia, e per orgoglio non chiedi di entrare.",
      arrivo: "Resterai fuori da una festa della compagnia, dopo una serata in cui si è esagerato.",
      consiglio: "Stai lontano da chi sparla degli assenti, e cerca compagnia dove c'è posto per tutti.",
    },
    se: {
      situazione: "Esageri con i divertimenti per non stare a pensare, e il giorno dopo va peggio.",
      origine: "Hai fatto di tutto per entrare in una compagnia, e la porta è rimasta chiusa.",
      ostacolo: "Ti lasci trascinare: quando stai bene esageri, e poi te ne penti.",
      arrivo: "Sentirai il bisogno di allontanarti dalla confusione, dopo un periodo di troppe feste.",
      consiglio: "Impara a stare bene anche senza compagnia, così soffrirai meno quando resti fuori.",
    },
  },
};
