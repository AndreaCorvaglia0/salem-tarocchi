// Dieci di Coppe. Voice written on the model of c05.js (docs/READING.md, "Come si scrive una voce").
// Number × suit: dieci (il ciclo si chiude, tutto il bene del seme) × Coppe (il cuore). Upright: full happiness,
// a family in harmony. Reversed: the harmony creaks, a family united only in appearance.
export default {
  id: 'c10',
  up: {
    favore: 2, moto: 'cresce',
    essenza: "La felicità piena: una famiglia in armonia.",
    amore: {
      situazione: "Vivi un amore felice e tranquillo, di quelli su cui si costruisce una famiglia.",
      origine: "Hai trovato la persona con cui ti senti a casa, e avete costruito una famiglia felice.",
      ostacolo: "Ti frena il timore che tanta felicità non duri, e non te la godi fino in fondo.",
      arrivo: "Arriverà un amore che dura, di quelli che diventano una famiglia felice.",
      consiglio: "Fai progetti di famiglia con chi ami, perché il momento è felice.",
    },
    lavoro: {
      situazione: "Lavori in armonia con gli altri, e quello che guadagni fa stare bene la tua famiglia.",
      origine: "Hai lavorato per la felicità dei tuoi, e la fatica è stata ripagata.",
      ostacolo: "Conta per te più la famiglia del guadagno, e rinunci a quello che ti porterebbe lontano.",
      arrivo: "Raggiungerai una sicurezza che ti permetterà di goderti in pace la tua famiglia.",
      consiglio: "Scegli il lavoro che ti lascia tempo per la famiglia, anche se rende un po' meno.",
    },
    casa: {
      situazione: "C'è armonia in casa tua: ci si vuole bene, e si vede.",
      origine: "Avevi intorno una famiglia unita, e ne hai ricevuto una base di felicità.",
      ostacolo: "Pesa appena il desiderio che tutto resti com'è, in una casa così felice.",
      arrivo: "Verrà un periodo di pace in famiglia, in cui tutti saranno felici di stare insieme.",
      consiglio: "Riunisci la famiglia intorno a un tavolo, e di' a tutti quanto ci tieni.",
    },
    altri: {
      situazione: "Vivi in armonia con i vicini, e in paese ti senti come in famiglia.",
      origine: "Qualcuno ti ha aperto la sua casa, come a una persona di famiglia.",
      ostacolo: "Ti basta la tua famiglia, e fuori da quel cerchio ti fai vedere poco.",
      arrivo: "Troverai fra la gente un'armonia che non ti aspettavi, come in una grande famiglia.",
      consiglio: "Apri la tua casa agli amici, e fai sentire in famiglia chi non ne ha una.",
    },
    se: {
      situazione: "Vivi in armonia con te e con le persone che ami, e non ti manca niente.",
      origine: "Hai capito che la tua felicità stava nelle persone care, più che nelle cose.",
      ostacolo: "Resta la paura di perdere questa felicità, che ti fa tenere tutto troppo stretto.",
      arrivo: "Sentirai una felicità piena, di quelle che vengono quando ogni cosa è al suo posto.",
      consiglio: "Ringrazia per quello che hai, e goditi la felicità senza cercarle un difetto.",
    },
  },
  rev: {
    favore: -1, moto: 'ferma',
    essenza: "L'armonia scricchiola: una famiglia unita solo in apparenza.",
    amore: {
      situazione: "Sembrate una coppia felice, ma sotto l'armonia c'è qualcosa che scricchiola.",
      origine: "Hai sognato una famiglia perfetta, e quella vera ti è sembrata poca cosa.",
      ostacolo: "Ti frena la paura di rompere l'armonia, e così taci quello che non va.",
      arrivo: "Verrà una tensione a incrinare l'armonia fra voi, e non potrai fare finta di niente.",
      consiglio: "Parla di quello che scricchiola fra voi, anche se da fuori sembra tutto a posto.",
    },
    lavoro: {
      situazione: "Il lavoro ti toglie alla famiglia, e l'armonia di casa ne risente.",
      origine: "Hai litigato con i tuoi per questioni di soldi, e l'armonia si è incrinata.",
      ostacolo: "Pesano i malumori di casa sul tuo lavoro: ci pensi, e combini poco.",
      arrivo: "Nasceranno discussioni in famiglia sul denaro, dietro un'apparenza di accordo.",
      consiglio: "Metti d'accordo lavoro e famiglia, prima che l'uno rovini l'altra.",
    },
    casa: {
      situazione: "Sembra unita la tua famiglia, vista da fuori, ma in casa ognuno fa per sé.",
      origine: "Avete tenuto alle apparenze, in famiglia, più che a dirvi le cose come stavano.",
      ostacolo: "Resta sotto la bella apparenza una lite mai chiusa, e l'armonia in casa è fragile.",
      arrivo: "Si vedranno le crepe di un'armonia che in famiglia era soltanto apparenza.",
      consiglio: "Smetti di difendere l'apparenza, e affronta in casa quello che divide.",
    },
    altri: {
      situazione: "Mostri al paese una famiglia felice, e ti costa fatica tenere su l'apparenza.",
      origine: "Qualcuno ha guastato l'armonia fra vicini, e da allora ci si saluta appena.",
      ostacolo: "Ti pesa il confronto con le famiglie degli altri, che ti sembrano tutte più felici.",
      arrivo: "Verranno a galla tensioni in un gruppo che pareva unito come una famiglia.",
      consiglio: "Lascia perdere quello che pensa la gente, e bada a come state davvero in famiglia.",
    },
    se: {
      situazione: "Cerchi una felicità perfetta, e quella che hai ti sembra sempre incrinata.",
      origine: "Hai creduto di dover mostrare felicità a tutti i costi, e hai nascosto il resto.",
      ostacolo: "Ti blocca un'idea troppo alta di famiglia e di armonia, che nessuno potrebbe raggiungere.",
      arrivo: "Capirai che l'armonia vera ha qualche crepa, e ti peserà meno fingere.",
      consiglio: "Accetta una felicità imperfetta, invece di recitarne una senza difetti.",
    },
  },
};
