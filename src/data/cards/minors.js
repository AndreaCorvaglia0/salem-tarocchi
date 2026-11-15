// Compact sheets of the 56 Minor Arcana (Rider-Waite-Smith). Per card: what you see, a noun phrase
// ("gist") the core and the ten spread sentences are built from, four keywords, the reversed meaning.
import { MINORS } from '../cards.base.js';

export const AS_KEYS = ['present', 'cross', 'root', 'past', 'possible', 'future', 'self', 'environment', 'hopefear', 'outcome'];

// One sentence per spread position, built around the gist (always a noun phrase, used as an object).
const TEMPLATES = {
  present: (g) => `Adesso, in questo momento, stai vivendo ${g}.`,
  cross: (g) => `Il tuo cammino incrocia ${g}, e può sostenerti o frenarti.`,
  root: (g) => `Da molto tempo porti dentro, alla base di tutto, ${g}.`,
  past: (g) => `Nel passato recente hai incontrato ${g}, e ne porti ancora il segno.`,
  possible: (g) => `Se vuoi, puoi costruire qualcosa a partire da ${g}.`,
  future: (g) => `Nel futuro prossimo incontrerai ${g}, e conviene prepararsi.`,
  self: (g) => `Tu, adesso, ti muovi dentro ${g}, e lo senti addosso.`,
  environment: (g) => `Chi ti sta intorno porta con sé ${g}.`,
  hopefear: (g) => `Speri e insieme temi ${g}: guardaci dentro con calma.`,
  outcome: (g) => `Se prosegui così, la strada va verso ${g}.`,
};
export const asFromGist = (gist) => Object.fromEntries(AS_KEYS.map((k) => [k, TEMPLATES[k](gist)]));
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// [see, gist, keywords, reversed]
const W = [
  ["Una mano esce da una nuvola e regge un bastone che mette già foglie. Sotto, un paesaggio verde e un castello lontano.", "una scintilla nuova, tutta voglia di partire", ["slancio", "inizio", "energia", "ispirazione"], "L'idea non parte: pigrizia, partenza falsa, scintilla spenta."],
  ["Un uomo sul bastione di un castello tiene un globo in mano e guarda il mare. Due bastoni gli stanno accanto.", "un piano in mano e il mare davanti", ["piani", "scelta", "orizzonte", "decisione"], "Paura di uscire dal castello, piani bloccati o cambiati all'ultimo."],
  ["Un uomo, visto di spalle, sta su un'altura e guarda le navi sul mare. Tre bastoni sono piantati nel terreno.", "una visione che prende il largo", ["visione", "attesa", "espansione", "previsione"], "Navi in ritardo, piani che non decollano, sguardo troppo corto."],
  ["Quattro bastoni reggono una ghirlanda di fiori. Sotto, due persone alzano le braccia in festa; sullo sfondo, un castello.", "una festa a casa, un porto sicuro", ["festa", "casa", "armonia", "traguardo"], "Festa rimandata, tensioni in casa, instabilità sotto le ghirlande."],
  ["Cinque ragazzi si affrontano con i bastoni, ognuno per conto suo, in una zuffa confusa.", "una zuffa confusa dove ognuno spinge la sua idea", ["conflitto", "competizione", "confusione", "scontro"], "Una tregua, un conflitto evitato; oppure rancori tenuti dentro."],
  ["Un cavaliere con una corona d'alloro su un cavallo bianco regge un bastone con una ghirlanda. La folla lo applaude.", "un ritorno trionfale con la folla che applaude", ["vittoria", "riconoscimento", "orgoglio", "successo"], "Vittoria che non arriva, fama vuota, caduta da cavallo."],
  ["Un uomo su un'altura impugna un bastone e si difende da sei bastoni che salgono dal basso.", "la difesa della tua posizione, anche in svantaggio", ["difesa", "coraggio", "tenacia", "sfida"], "Cedere, sentirsi sopraffatti, stancarsi di difendersi."],
  ["Otto bastoni volano in diagonale nel cielo sopra un paesaggio di colline e di fiume.", "una raffica di notizie e movimenti veloci", ["velocità", "notizie", "movimento", "slancio"], "Ritardi, fretta che confonde, messaggi che non arrivano."],
  ["Un uomo con la testa fasciata si appoggia a un bastone. Dietro di lui altri otto bastoni formano una specie di staccionata.", "la stanchezza di chi, ferito, resta di guardia", ["resistenza", "cautela", "fatica", "perseveranza"], "Esaurimento, diffidenza, voglia di mollare a un passo dalla fine."],
  ["Un uomo cammina curvo portando dieci bastoni in fascio. Davanti a lui, un villaggio.", "un carico troppo pesante, con la meta ormai vicina", ["peso", "fatica", "responsabilità", "carico"], "Mollare un peso, delegare; oppure crollare sotto troppi impegni."],
  ["Un giovane con un cappello piumato sta nel deserto e guarda un bastone che mette foglie. Sulla tunica, delle salamandre.", "un messaggio pieno di entusiasmo e curiosità", ["entusiasmo", "curiosità", "messaggio", "esplorazione"], "Entusiasmo che si spegne, notizie deludenti, voglia senza costanza."],
  ["Un cavaliere in armatura su un cavallo che s'impenna regge un bastone. Sulla tunica, salamandre.", "una corsa a briglia sciolta, tutta passione", ["passione", "azione", "impulso", "avventura"], "Fretta, rabbia, partenze senza meta; oppure restare fermo al via."],
  ["Una regina su un trono con girasoli, tiene un bastone in fiore e un girasole. Ai suoi piedi, un gatto nero.", "un calore sicuro di sé che attira gli altri", ["carisma", "calore", "fiducia", "indipendenza"], "Gelosia, pretese, un carattere che scotta."],
  ["Un re sul trono con salamandre e leoni regge un bastone che mette foglie, sguardo deciso.", "una guida visionaria che sa far partire le cose", ["visione", "leadership", "audacia", "onore"], "Prepotenza, impazienza, un capo che comanda senza ascoltare."],
];
const C = [
  ["Una mano esce da una nuvola e regge una coppa. Una colomba vi lascia cadere un'ostia, cinque rivoli d'acqua scendono sul laghetto con i fiori di loto.", "un cuore che si apre a nuova gioia", ["amore", "apertura", "gioia", "intuito"], "Cuore chiuso, emozioni trattenute, un dono che non si riceve."],
  ["Un uomo e una donna si scambiano due coppe, con una corona di fiori. Tra loro, un bastone con le ali e una testa di leone.", "uno scambio alla pari tra due persone", ["legame", "reciprocità", "attrazione", "intesa"], "Squilibrio nella coppia, rottura, un'intesa che non c'è più."],
  ["Tre donne danzano in cerchio con le coppe alzate. Ai loro piedi frutta e fiori.", "una festa tra amiche, gioia condivisa", ["amicizia", "festa", "comunità", "condivisione"], "Eccessi, pettegolezzi, un gruppo che esclude."],
  ["Un giovane siede sotto un albero con le braccia incrociate, davanti a tre coppe. Da una nuvola una mano gliene offre una quarta.", "la noia che non fa vedere l'offerta in arrivo", ["apatia", "noia", "riflessione", "distacco"], "Ti accorgi dell'offerta, o la rifiuti ancora."],
  ["Una figura in mantello nero guarda tre coppe rovesciate. Dietro di lei, due coppe ancora in piedi; più in là, un ponte e un castello.", "il lutto per tre coppe cadute", ["perdita", "rimpianto", "lutto", "delusione"], "Superare la perdita, voltarsi verso ciò che resta."],
  ["In un cortile, un bambino porge a un altro una coppa piena di fiori. Intorno, altre coppe con fiori.", "un ricordo dolce e un gesto semplice d'infanzia", ["nostalgia", "innocenza", "ricordi", "gentilezza"], "Restare incollati al passato, o ricordi che pungono."],
  ["Una figura vista di spalle guarda sette coppe nelle nuvole, ognuna con dentro qualcosa di strano: un drago, un gioiello, un volto.", "troppe fantasie tra cui scegliere, nessuna concreta", ["sogni", "illusione", "scelte", "fantasia"], "Chiarezza: scegli, oppure ti perdi nelle illusioni."],
  ["Un viandante di spalle si allontana di notte da otto coppe impilate, verso le montagne, sotto una luna.", "la partenza da ciò che non nutre più", ["abbandono", "ricerca", "distacco", "partenza"], "Restare per paura, o scappare senza aver capito perché."],
  ["Un uomo con le braccia conserte siede davanti a un tavolo ad arco con nove coppe in fila, soddisfatto.", "un desiderio esaudito, una soddisfazione tutta tua", ["appagamento", "desideri", "soddisfazione", "benessere"], "Appagamento di facciata, vanità, voglia mai sazia."],
  ["Una coppia con due bambini sta davanti a una casa. In cielo, un arcobaleno di dieci coppe.", "la famiglia che sogni sotto un arcobaleno di pace", ["famiglia", "armonia", "felicità", "casa"], "Armonia che scricchiola, una casa ideale solo in foto."],
  ["Un giovane in riva al mare guarda un pesce che spunta da una coppa e lo guarda a sua volta.", "una sorpresa gentile che arriva dal cuore", ["sorpresa", "sensibilità", "creatività", "messaggio"], "Immaturità emotiva, un messaggio d'amore che si perde."],
  ["Un cavaliere con l'elmo alato su un cavallo bianco avanza piano, con una coppa in mano, vicino a un fiume.", "una proposta romantica offerta con grazia", ["romanticismo", "proposta", "fascino", "sogno"], "Promesse belle e vuote, un fascino che inganna."],
  ["Una regina siede su un trono in riva al mare e guarda una coppa coperta, elaborata, come fosse una reliquia.", "un'empatia profonda e un intuito che ascolta", ["empatia", "intuito", "compassione", "cura"], "Emotività che travolge, confini poco chiari, dipendenza."],
  ["Un re siede su un trono in mezzo al mare, con una coppa e uno scettro. Un pesce salta, una nave passa.", "una maturità emotiva che sente senza farsi travolgere", ["equilibrio", "diplomazia", "generosità", "calma"], "Freddezza, manipolazione, emozioni tenute a freno."],
];
const S = [
  ["Una mano esce da una nuvola e regge una spada dritta con una corona, ramo d'ulivo e di palma. Sotto, montagne rocciose.", "un'idea limpida che taglia la nebbia", ["chiarezza", "verità", "intuizione", "svolta"], "Confusione, parole dure, un'idea che ferisce."],
  ["Una donna bendata, seduta con due spade incrociate sul petto, di fronte al mare con una luna crescente.", "una decisione rimandata, a occhi bendati", ["stallo", "indecisione", "tregua", "equilibrio"], "La benda cade: vedi la scelta, oppure l'indecisione peggiora."],
  ["Un cuore rosso è trafitto da tre spade, sotto nuvole grigie e pioggia.", "un dolore chiaro, che trafigge e poi passa", ["dolore", "cuore spezzato", "tristezza", "verità"], "Guarire, perdonare, oppure rimuginare la ferita."],
  ["Un cavaliere di pietra giace su una tomba, con le mani giunte. Sul muro, tre spade; sotto, un'altra. Una vetrata colorata.", "una pausa per ricaricarsi, a occhi chiusi", ["riposo", "pausa", "recupero", "ritiro"], "Stanchezza che non passa, o un risveglio troppo presto."],
  ["Un uomo sorride e raccoglie delle spade, mentre due persone si allontanano a testa bassa. Cielo di tempesta.", "una vittoria amara, vinta a caro prezzo", ["sconfitta", "orgoglio", "conflitto", "amarezza"], "Riconciliazione, resa, oppure un rancore che continua."],
  ["Un traghettatore con la pertica spinge una barca con una donna incappucciata e un bambino. Nella barca, sei spade piantate.", "una traversata verso acque più calme", ["transizione", "viaggio", "sollievo", "passaggio"], "Non riuscire a lasciare la riva, o fuggire senza risolvere."],
  ["Un uomo si allontana di nascosto da un accampamento con cinque spade in braccio. Altre due restano piantate a terra.", "una mossa furba di nascosto, ingegno o inganno", ["astuzia", "furbizia", "segreto", "strategia"], "Il trucco viene scoperto: confessare, restituire."],
  ["Una donna bendata e legata sta ferma in mezzo a otto spade piantate attorno a lei, con l'acqua ai piedi.", "una prigione di paure con la via già aperta", ["blocco", "paura", "limiti", "vittimismo"], "Liberarsi, togliere la benda, vedere la strada."],
  ["Una persona è seduta nel letto con il volto tra le mani. Sul muro, nove spade orizzontali; sulla coperta, rose e segni zodiacali.", "notti insonni e preoccupazioni che ingrandiscono tutto", ["ansia", "insonnia", "preoccupazione", "incubi"], "Cominciare a parlarne, oppure l'ansia che si aggrava."],
  ["Un uomo giace a terra a faccia in giù, con dieci spade nella schiena. Il cielo è nero, ma all'orizzonte sorge l'alba.", "una fine dolorosa con l'alba già dietro l'orizzonte", ["fine", "tradimento", "sconfitta", "rinascita"], "Rialzarsi: il peggio è passato; oppure tirare per le lunghe."],
  ["Un giovane su un'altura ventosa regge una spada alzata, con lo sguardo vigile. Il cielo è pieno di nuvole.", "una mente curiosa e agile, piena di domande", ["curiosità", "vigilanza", "domande", "studio"], "Parlare troppo, pettegolezzo, domande taglienti."],
  ["Un cavaliere carica a spada alzata su un cavallo al galoppo. Il vento piega gli alberi e le nuvole.", "un'idea lanciata a testa bassa, veloce e dritta", ["determinazione", "rapidità", "ambizione", "franchezza"], "Fretta, parole che feriscono, azioni sconsiderate."],
  ["Una regina siede su un trono tra le nuvole, con la spada dritta in una mano e l'altra mano aperta e tesa.", "una lucidità senza sconti, detta con garbo", ["lucidità", "onestà", "indipendenza", "esperienza"], "Freddezza, durezza, un'amarezza che chiude il cuore."],
  ["Un re siede su un trono con una spada dritta in mano. Il cielo è mosso, con nuvole e farfalle sullo schienale.", "una mente al comando: logica, regole, giudizio", ["intelletto", "autorità", "verità", "giustizia"], "Rigidità, potere usato con freddezza, parole come armi."],
];
const P = [
  ["Una mano esce da una nuvola e regge un pentacolo. Sotto, un giardino fiorito con un arco di rose che porta alle montagne.", "un'occasione concreta, seme di un guadagno", ["occasione", "prosperità", "seme", "concretezza"], "Occasione sfuggita, un investimento mal pensato."],
  ["Un giovane danza tenendo due pentacoli legati da un nastro a forma di infinito. Dietro di lui, navi su onde alte.", "due cose tenute in equilibrio con un sorriso", ["equilibrio", "flessibilità", "adattamento", "gestione"], "Troppe palle in aria, un equilibrio che cede."],
  ["Un artigiano scolpisce un arco in una cattedrale. Due persone lo guardano con un progetto in mano.", "un mestiere fatto bene, riconosciuto dagli altri", ["squadra", "mestiere", "competenza", "progetto"], "Lavoro svogliato, poca collaborazione, risultato mediocre."],
  ["Un uomo con la corona siede tenendo stretto un pentacolo. Un altro è sulla testa, due sotto i piedi. Dietro, una città.", "l'attaccamento a ciò che hai, forse troppo stretto", ["sicurezza", "risparmio", "controllo", "possesso"], "Lasciar andare, generosità; oppure avarizia che isola."],
  ["Due persone povere, una zoppa, camminano nella neve davanti a una vetrata illuminata di una chiesa.", "il freddo della mancanza, con una porta aperta vicina", ["difficoltà", "povertà", "esclusione", "bisogno"], "Ripresa, chiedere aiuto, oppure restare al buio."],
  ["Un mercante con una bilancia dà monete a due mendicanti inginocchiati, che alzano le mani.", "un dare e ricevere in giusta misura", ["generosità", "scambio", "aiuto", "equità"], "Aiuto che nasconde un debito, generosità con un fine."],
  ["Un contadino si appoggia alla zappa e guarda un cespuglio con sette pentacoli come frutti.", "una pausa a guardare crescere il raccolto", ["pazienza", "raccolto", "valutazione", "investimento"], "Impazienza, frutti che non maturano, fatica senza risultati."],
  ["Un artigiano al banco scolpisce un pentacolo dopo l'altro. Sei sono già finiti, gli altri appesi vicino a un villaggio.", "un mestiere imparato ripetendo il gesto con cura", ["dedizione", "pratica", "mestiere", "impegno"], "Lavoro ripetitivo, perfezionismo, mestiere fatto senza voglia."],
  ["Una donna in veste ricca cammina in un giardino con viti cariche di uva, un falco sul guanto e nove pentacoli.", "un benessere guadagnato da sé e goduto con eleganza", ["indipendenza", "benessere", "raffinatezza", "autonomia"], "Solitudine dorata, dipendenza da ciò che si possiede."],
  ["Un anziano con due cani siede sotto un arco; una coppia e un bambino gli stanno accanto. In alto, dieci pentacoli.", "un'eredità solida e una famiglia che dura nel tempo", ["eredità", "famiglia", "stabilità", "tradizione"], "Liti per i soldi, radici che non reggono."],
  ["Un giovane in un campo fiorito tiene alto un pentacolo e lo guarda con attenzione.", "un nuovo progetto studiato con attenzione", ["studio", "progetto", "serietà", "opportunità"], "Pigrizia, distrazione, un progetto che non decolla."],
  ["Un cavaliere su un cavallo nero, fermo, regge un pentacolo davanti a un campo arato.", "una costanza lenta ma sicura, un passo dopo l'altro", ["costanza", "affidabilità", "metodo", "pazienza"], "Noia, testardaggine, lavoro che non avanza."],
  ["Una regina siede su un trono in un giardino fiorito e culla un pentacolo. Un coniglio salta ai suoi piedi.", "una concretezza calda, fatta di cura e accoglienza", ["cura", "praticità", "abbondanza", "accoglienza"], "Ansia per le cose materiali, trascurare sé stessi."],
  ["Un re siede su un trono ornato di grappoli e di tori, con uno scettro e un pentacolo. Dietro, un castello.", "un successo costruito con metodo, e generoso", ["successo", "stabilità", "abbondanza", "affidabilità"], "Attaccamento ai soldi, ostinazione, una ricchezza fredda."],
];
const BY_SUIT = { w: W, c: C, s: S, p: P };

export const MINOR_SHEETS = Object.fromEntries(MINORS.map((c) => {
  const [see, gist, keywords, reversed] = BY_SUIT[c.suit][c.n - 1];
  const core = `${cap(gist)}.`;
  return [c.id, { see, says: core, details: [], core, keywords, reversed, as: asFromGist(gist), confusables: [] }];
}));
