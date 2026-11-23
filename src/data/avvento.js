// The Advent calendar (December 2026): the long page of each of the 25 paper bags Andrea hung for her.
// The bag holds the object and a short note; the note carries a word, and the word opens this page at the
// threshold (ui/avvento.js, rules in glue/avvento.rules.js). Written in Andrea's voice, first person.
// Each page: { d, title, img (public/avvento/<img>.webp) or draw (an illustration drawn in code: 'famiglio',
// 'tema', 'lune'), inside (what is in the bag), parts: [{ h, p }] }.
// The words are still placeholders: Andrea picks the real ones before printing the notes.

export const PLACEHOLDER = 'stella';
export const WORDS = {
  1: PLACEHOLDER, 2: PLACEHOLDER, 3: PLACEHOLDER, 4: PLACEHOLDER, 5: PLACEHOLDER, 6: PLACEHOLDER, 7: PLACEHOLDER,
  8: PLACEHOLDER, 9: PLACEHOLDER, 10: PLACEHOLDER, 11: PLACEHOLDER, 12: PLACEHOLDER, 13: PLACEHOLDER, 14: PLACEHOLDER,
  15: PLACEHOLDER, 16: PLACEHOLDER, 17: PLACEHOLDER, 18: PLACEHOLDER, 19: PLACEHOLDER, 20: PLACEHOLDER, 21: PLACEHOLDER,
  22: PLACEHOLDER, 23: PLACEHOLDER, 24: PLACEHOLDER, 25: PLACEHOLDER,
};

export const YEAR = 2026;

export const PAGES = [
  { d: 1, title: 'Il Daruma', img: 'daruma', inside: 'Un Daruma rosso in porcellana e un pennarello nero', parts: [
    { h: 'Da dove viene', p: "Il Daruma prende il nome da Bodhidharma, il monaco che secondo la leggenda portò lo Zen in Cina. Si racconta che meditò nove anni davanti a un muro, così a lungo che le braccia e le gambe smisero di servirgli: per questo il Daruma è tondo, senza mani e senza piedi." },
    { h: 'Perché si rialza', p: "Ha il fondo pesante, e se lo spingi torna su da solo. In Giappone lo accompagna un proverbio: sette volte cadi, otto ti rialzi. È rosso come la veste del monaco, e nel periodo Edo quel rosso si teneva in casa anche per allontanare le malattie." },
    { h: 'Cosa farci', p: "Arriva con gli occhi bianchi. Il primo si dipinge quando si esprime il desiderio, il secondo quando si è avverato, e intanto lui sta in un posto dove lo vedi ogni giorno. Il tuo occhio lo dipingi il 9, con la luna nuova. Fino ad allora pensa con calma a cosa chiedergli: ce lo teniamo per tutto il mese." },
  ] },
  { d: 2, title: 'Salvia bianca e lavanda', img: 'salvia', inside: 'Quattordici bastoncini di salvia bianca e lavanda', parts: [
    { h: 'Le due erbe', p: "La salvia bianca cresce sulle colline della California, e i popoli nativi di quella costa la bruciano da secoli per pulire i luoghi e le persone. La lavanda viene dal Mediterraneo: il suo nome viene probabilmente da lavare, perché i Romani la mettevano nell'acqua del bagno e nei panni." },
    { h: 'La luna di questi giorni', p: "La luna piena è passata il 24 novembre e adesso cala, notte dopo notte, fino a sparire il 9. Per tradizione è il tempo per togliere, svuotare, chiudere le cose rimaste a metà, così quando arriva la luna nuova c'è posto." },
    { h: 'Cosa farci', p: "Ogni bastoncino dura una mezz'ora. Accendilo, fai il giro della casa partendo dalla porta, insisti negli angoli e dietro le porte, dove l'aria sta ferma. Alla fine apri una finestra e lascia uscire il fumo, insieme a quello che non serve più." },
  ] },
  { d: 3, title: 'Il palo santo', img: 'protezione', inside: 'Due bastoncini di palo santo, uno semplice e uno ricoperto', parts: [
    { h: 'Il legno santo', p: "Il palo santo è un albero delle foreste secche dell'Ecuador e del Perù. Il profumo arriva solo dopo che l'albero è morto da solo ed è rimasto a terra per anni, mentre la resina matura dentro il legno: per questo si raccoglie quello caduto e non si taglia quello vivo. Gli Spagnoli lo chiamarono legno santo." },
    { h: 'Due bastoncini', p: "Uno è semplice, l'altro è ricoperto: il negozio lo ha mandato in regalo e ha il legno avvolto in una pasta profumata. Usa prima quello semplice, così senti il profumo vero del legno, e tieni l'altro per una sera speciale." },
    { h: 'Cosa farci', p: "Tienilo inclinato verso il basso e lascia che la fiamma lo prenda per una trentina di secondi, poi soffia. Il fumo dura poco, quindi passalo subito intorno a te, dalla testa ai piedi, e poi siediti con il Daruma davanti. Quando smette di fumare si può riaccendere tante volte." },
  ] },
  { d: 4, title: 'Le pietre di Santa Barbara', img: 'protezione', inside: 'Alcune pietre assortite e un pezzo di tormalina nera', parts: [
    { h: 'Santa Barbara', p: "Il 4 dicembre si festeggia Santa Barbara, protettrice dei minatori, degli artiglieri e dei vigili del fuoco: di chi lavora sotto terra e con il fuoco. In Germania, in Austria e sulle Alpi oggi si taglia un ramo di ciliegio e lo si mette in un vaso al caldo. Se fiorisce per Natale, l'anno nuovo sarà buono." },
    { h: 'La tormalina nera', p: "Tra le pietre c'è un pezzo di tormalina nera, che arriva quasi sempre dal Brasile. È la pietra che si usa di più per la protezione, perché si dice che assorba quello che non va. Ha anche una cosa vera e curiosa: se la scaldi o la schiacci si carica di elettricità, e per questo gli Olandesi la usavano per pulire la cenere dalle pipe." },
    { h: 'Cosa farci', p: "Sei della Vergine, un segno di terra, quindi oggi il ramo lo facciamo con una pietra. Pescane una a occhi chiusi, senza scegliere, e portala in tasca fino a Natale. Se a fine mese ti sembra che non sia servita a niente, hai vinto tu. Se ti accorgi che la cerchi con le dita, ho vinto io." },
  ] },
  { d: 5, title: 'La tisana della Terra', img: 'tisana', inside: 'Quattro bustine di tisana Touch the Ground', parts: [
    { h: 'Cosa c\'è dentro', p: "È una tisana biologica della linea Cinque Elementi di Shoti Maa, e questa è quella della Terra. C'è honeybush, un arbusto del Sudafrica che fa un infuso dolce, poi cannella, anice, finocchio, zenzero, coriandolo, un po' di salvia e di lavanda, pepe nero, cardamomo e chiodi di garofano." },
    { h: 'Perché la Terra', p: "Sul calendario è la casella dell'acqua, ma la tisana parla di terra: serve a tenere i piedi per terra quando la testa va troppo avanti. Mi sembrava fatta per una Vergine, che vive con un piede nel prossimo mese." },
    { h: 'Come si fa', p: "Acqua appena bollita e cinque o sei minuti con il piattino sopra, così l'aroma non scappa. Bevila stasera senza fare altro, e se ti va a piedi nudi sul pavimento. Le bustine tienile chiuse e lontane dall'incenso, perché si prendono il profumo." },
  ] },
  { d: 6, title: 'Il telo', img: 'telo', inside: 'Il telo da lettura "Strega antica", 75 per 75 centimetri', parts: [
    { h: 'A cosa serve un telo', p: "Chi legge i tarocchi appoggia le carte su un panno e non sul tavolo nudo. Le protegge e le fa scorrere meglio, ma soprattutto segna un confine: dentro il telo c'è la lettura, fuori c'è la cucina con le briciole. Molti avvolgono anche il mazzo in un panno, quando lo mettono via." },
    { h: 'Questo', p: "È nero e misura 75 centimetri per lato, abbastanza per una stesa grande. Al centro ha tre posti già disegnati, uno accanto all'altro, giusti per una lettura a tre carte. Intorno ci sono il pentacolo, le lune, le erbe e i funghi, e in alto una farfalla." },
    { h: 'Cosa farci', p: "La prima volta che lo stendi tira una carta sola e lasciala lì un momento. Sarà la carta di questo dicembre: segnatela, e a fine mese vediamo se aveva ragione." },
  ] },
  { d: 7, title: 'Il Nag Champa', img: 'nagchampa', inside: 'Una confezione di incenso Goloka Nag Champa', parts: [
    { h: 'L\'incenso dei templi', p: "Nag Champa è forse l'incenso indiano più famoso. Il nome viene dal champa, un albero della famiglia della magnolia che fa fiori gialli molto profumati, e di solito la miscela ha dentro anche sandalo, erbe e miele. In India lo chiamano agarbatti, che vuol dire semplicemente bastoncino d'incenso." },
    { h: 'Perché lo accendono', p: "Nei templi e nelle case indiane si accende prima della preghiera. Il profumo segna l'inizio: da quel momento non si sta facendo una cosa qualsiasi. È lo stesso motivo per cui si cambia voce entrando in una chiesa." },
    { h: 'Cosa farci', p: "Dura circa mezz'ora, più o meno quanto una lettura con calma. Potresti farne il segnale delle tue letture: accendi un bastoncino, stendi il telo di ieri, e da lì in poi si parla con le carte." },
  ] },
  { d: 8, title: 'Il Famiglio', draw: 'famiglio', inside: 'Una carta stampata con Tartufo, "Il Famiglio"', parts: [
    { h: 'Cos\'è un famiglio', p: "Nelle storie delle streghe inglesi del Cinque e Seicento ogni strega aveva un famiglio, uno spirito che viveva con lei in forma di animale. Poteva essere un rospo, una lepre, un cane, ma il più delle volte era un gatto. Anche a Salem, nel 1692, nelle accuse si parlava di animali che seguivano le streghe." },
    { h: 'La carta', p: "Il tuo famiglio ce l'hai già, ed è nero come da regolamento. Gli ho fatto una carta tutta sua, con il titolo che hanno gli Arcani: Il Famiglio. Non ha un numero perché non sta in fila con le altre, sta accanto." },
    { h: 'Cosa farci', p: "Tienila sul telo quando leggi, in un angolo, a fare la guardia. Oggi è anche l'Immacolata, il giorno in cui in tante case si fa l'albero: se lo facciamo, Tartufo vorrà controllare ogni pallina, una per una." },
  ] },
  { d: 9, title: 'La luna nuova', img: 'candele', inside: 'Una candela Winter Ritual', parts: [
    { h: 'Stanotte', p: "La luna nuova cade all'1:52 di stanotte, ora italiana. In cielo non si vede, perché sta tra noi e il Sole e ci mostra la faccia al buio. In molti calendari antichi, come quello ebraico e quello islamico, il mese comincia proprio da qui, quando la luna torna." },
    { h: 'La candela', p: "Fa parte di un pacco di dodici candele pensate per Yule e il solstizio, verdi e profumate di cedro e pino. Le troverai anche nei prossimi giorni, sempre più numerose, fino alla notte più lunga." },
    { h: 'Il Daruma', p: "È il momento del desiderio. Accendi la candela, prendi il pennarello del primo giorno e dipingi un occhio al Daruma, pieno e nero. Mentre lo fai di' il desiderio ad alta voce, anche piano: deve sentirlo. Poi mettilo dove lo vedi ogni giorno, così ti guarda con un occhio solo finché non arriva il momento dell'altro." },
  ] },
  { d: 10, title: 'Coni alla lavanda', img: 'lavanda', inside: 'Sei coni a cascata alla lavanda', parts: [
    { h: 'Perché il fumo scende', p: "Questi coni hanno un canale nel mezzo. Quando bruciano, il fumo passa da lì, si raffredda e diventa più pesante dell'aria intorno, così invece di salire scivola giù per il bruciaincenso come acqua. Lo so che lo sai, ma da fisico mi piace che sia vero." },
    { h: 'La lavanda', p: "Sono coni naturali alla lavanda. È il profumo per la sera, quello che si mette nei cassetti e sotto il cuscino, e i coni sono sei: gli altri sei arrivano più avanti, quando la luna sarà quasi piena." },
    { h: 'Cosa farci', p: "Niente. Ieri hai detto il desiderio, e i desideri appena detti si lasciano stare. Accendi un cono, guardalo scendere e pensa ad altro." },
  ] },
  { d: 11, title: 'La tisana in due', img: 'tisana', inside: 'Quattro bustine di tisana Touch the Ground', parts: [
    { h: 'Due e due', p: "Le bustine sono quattro anche oggi, ma queste sono da dividere: due per te e due per me. Stasera la beviamo insieme, la prima tazza calda e la seconda quando ci viene voglia." },
    { h: 'Il desiderio', p: "Puoi raccontarmi cosa hai chiesto al Daruma, oppure no. C'è chi dice che un desiderio detto in giro perde forza e chi dice che detto a una persona sola diventa una promessa. Decidi tu, io bevo la tisana in ogni caso." },
    { h: 'Una cosa vera', p: "L'anice e il finocchio che ci sono dentro hanno lo stesso profumo per un motivo: tutti e due contengono anetolo, la sostanza che sa di liquirizia. Se a te non piace, dimmelo, che per le prossime cerco un'altra tisana." },
  ] },
  { d: 12, title: 'Il tema natale', draw: 'tema', inside: 'Il tuo tema natale stampato', parts: [
    { h: 'La mappa del cielo', p: "Il tema natale è il cielo fotografato nel momento esatto in cui sei nata, visto dal posto in cui sei nata. È diviso in dodici case e attraversato dai dodici segni, e dentro ci sono il Sole, la Luna e i pianeti, ognuno nel suo segno." },
    { h: 'Le tre cose da guardare per prime', p: "Il Sole è nella Vergine, ed è il segno che conosci: racconta chi sei. La Luna dice di cosa hai bisogno per stare bene. L'Ascendente è il segno che sorgeva all'orizzonte in quel minuto, e racconta come ti vede chi ti incontra la prima volta. La Vergine è governata da Mercurio, che nei tarocchi è il Mago." },
    { h: 'Cosa farci', p: "Te lo do il 12 perché dodici sono i segni e dodici le case. Trova dov'è la tua Luna e leggimela. Poi cerca la mia, che io il mio l'ho guardato e non ci ho capito niente." },
  ] },
  { d: 13, title: 'Santa Lucia', img: 'candele', inside: 'Due candele Winter Ritual', parts: [
    { h: 'La festa della luce', p: "Prima del 1582, quando papa Gregorio cambiò il calendario, il 13 dicembre cadeva vicino al solstizio, nei giorni più bui dell'anno. Da lì il proverbio: Santa Lucia, il giorno più corto che ci sia. Il nome viene da lux, luce, e per questo la sua festa è fatta di candele." },
    { h: 'Dove la festeggiano', p: "In Svezia una ragazza vestita di bianco con una corona di candele in testa apre una processione che canta nel buio del mattino. Nel Nord Italia, da Bergamo a Verona, nella notte tra il 12 e il 13 Santa Lucia passa con l'asinello e porta i regali ai bambini, che le lasciano un po' di fieno." },
    { h: 'Cosa farci', p: "Le candele sono due. Una accendila stasera. L'altra mettila da parte per una sera storta, una di quelle in cui serve una luce in più: quando arriva, sai già cosa fare." },
  ] },
  { d: 14, title: 'L\'occhio di Nazar', img: 'protezione', inside: 'Il portachiavi con l\'occhio di Nazar', parts: [
    { h: 'L\'occhio blu', p: "In Turchia si chiama nazar boncuğu, la perla del malocchio. È un occhio di vetro blu, con l'iride bianca e la pupilla scura, e lo trovi sulle porte, nelle culle, sulle auto, perfino sugli aerei. L'idea è antica e vale in tutto il Mediterraneo: un occhio che guarda per te e rimanda indietro gli sguardi cattivi." },
    { h: 'Questo', p: "È un portachiavi, e l'occhio gira su sé stesso: lo puoi far ruotare con le dita quando aspetti, che è anche un piccolo antistress. È il primo pezzo del Kit Protezione, da cui vengono anche il palo santo del 3 e la tormalina del 4." },
    { h: 'Cosa farci', p: "Va portato addosso, quindi attaccalo alle chiavi di casa. Si dice che quando un nazar si incrina o si rompe non sia sfortuna: ha appena fermato qualcosa, e va sostituito con uno nuovo." },
  ] },
  { d: 15, title: 'Una sera tranquilla', img: 'tisana', inside: 'Quattro bustine di tisana Touch the Ground', parts: [
    { h: 'In mezzo', p: "Siamo a metà tra il desiderio del 9 e la luna piena del 24. Domani ti lego una cosa al polso, e dopodomani è 17. Oggi quindi niente riti." },
    { h: 'Cosa farci', p: "Una tazza di tisana, una coperta e Tartufo, se si degna. Se ti va di leggere, una carta sola, senza domanda: solo per vedere chi si presenta." },
  ] },
  { d: 16, title: 'Il filo rosso', img: 'protezione', inside: 'Il bracciale rosso a sette nodi', parts: [
    { h: 'Un filo antico', p: "Il filo rosso legato al polso contro il malocchio si trova in mezzo mondo: nel Sud Italia, in Grecia, nei Balcani, nella tradizione ebraica della Cabbala, in India. Il rosso è il colore del sangue e della vita, e per questo si pensava che il male non riuscisse ad attraversarlo." },
    { h: 'Le regole', p: "Va al polso sinistro, il lato del cuore e da cui, si diceva, entra quello che arriva da fuori. Ha sette nodi, come i giorni della settimana e i pianeti antichi. E deve legarlo una persona che ti vuole bene, altrimenti è solo un braccialetto." },
    { h: 'Cosa farci', p: "Vieni qui, che te lo lego io, un nodo alla volta. Non si toglie: quando un giorno si romperà da solo, vorrà dire che il suo lavoro l'ha fatto." },
  ] },
  { d: 17, title: 'La tavola del gatto nero', img: 'tavola', inside: 'Una tavola rotonda in ceramica', parts: [
    { h: 'Il 17', p: "In Italia il 17 porta male, e il motivo è un gioco di lettere: in numeri romani si scrive XVII, che anagrammato fa VIXI, ho vissuto, cioè sono morto. In quasi tutto il resto del mondo è un numero come un altro." },
    { h: 'Il gatto nero', p: "Da noi il gatto nero che attraversa la strada porta sfortuna, ma in Inghilterra e in Scozia porta fortuna se entra in casa, e in Giappone si dice che tenga lontani i malintenzionati e che aiuti le ragazze a trovare l'amore. Un 17 con un gatto nero, quindi, secondo me fa pari." },
    { h: 'Cosa farci', p: "È una tavola in ceramica, nera, con un gatto al centro e una frase in inglese: cerca, e il gatto rivelerà. A cosa serva non te lo dico, ma le parole sul bordo forse te lo fanno intuire. Mettila sul telo e lasciala lì. Le manca un pezzo, e arriva domani. Oggi intanto è primo quarto: la luna è a metà strada." },
  ] },
  { d: 18, title: 'Il pendolo', img: 'blackcat', inside: 'Il pendolo in ossidiana del kit Black Cat', parts: [
    { h: 'Il pezzo che mancava', p: "La tavola di ieri è una tavola per il pendolo, e questo è il suo pendolo. La punta è di ossidiana, che è vetro naturale: si forma quando la lava di un vulcano si raffredda così in fretta da non avere il tempo di diventare cristallo." },
    { h: 'Come si usa', p: "Appoggia il gomito al tavolo e tieni la catenella tra pollice e indice, con il pendolo fermo sopra il centro della tavola. Prima chiedigli di mostrarti il suo sì, poi il suo no, e guarda come si muove. Poi fagli una domanda sola, una a cui si risponde con sì o no." },
    { h: 'Quello che ne penso io', p: "Da fisico ti dico che a muoverlo sono le tue dita, con movimenti piccolissimi che non decidi tu: si chiama effetto ideomotorio. Ma è proprio per questo che è interessante, perché a volte la mano sa la risposta prima della testa. Se non ti convince, lo regaliamo a Tartufo." },
  ] },
  { d: 19, title: 'Coni al sandalo', img: 'sandalo', inside: 'Una confezione di coni a cascata al sandalo', parts: [
    { h: 'Il sandalo', p: "Il legno di sandalo viene dall'India del Sud, ed è uno dei profumi più antichi che si conoscano: si brucia nei templi da millenni e si mette nelle pozioni, nei rosari, nelle scatole. Cresce piano e profuma nel cuore del legno, per questo è prezioso." },
    { h: 'Cosa farci', p: "Il desiderio l'hai detto il 9, la domanda l'hai fatta ieri. Stasera non si chiede più niente: si accende la cascata e si guarda il fumo cadere, che è una cosa che calma. Il sandalo è per quando serve vederci chiaro." },
  ] },
  { d: 20, title: 'La vigilia del solstizio', img: 'tisana', inside: 'Le ultime quattro bustine di tisana', parts: [
    { h: 'Domani', p: "Domani è la notte più lunga dell'anno, e c'è una cosa da fare. Stasera quindi ci si prepara: una tisana, poca luce, e pensare a cosa lasciare in questo 2026 e cosa portarsi nel 2027." },
    { h: 'Cosa farci', p: "Sono le ultime quattro bustine, due per te e due per me come l'altra volta. Se ti viene in mente qualcosa per domani, scrivilo da qualche parte: domani ti servirà." },
  ] },
  { d: 21, title: 'Il solstizio', img: 'candele', inside: 'Sette candele Winter Ritual, due foglietti', parts: [
    { h: 'Alle 21:50', p: "Stasera alle 21:50 il Sole tocca il punto più basso del suo viaggio e si ferma: solstizio vuol dire proprio sole fermo. È la notte più lunga dell'anno, e da domani le giornate ricominciano ad allungarsi, all'inizio di pochi secondi alla volta." },
    { h: 'Yule', p: "Nel Nord Europa questa festa si chiamava Yule. Si portava in casa un grosso ceppo e lo si faceva bruciare tutta la notte, perché il fuoco aiutasse il Sole a tornare, e un pezzo si teneva per accendere quello dell'anno dopo. Il tronchetto di Natale che si mangia oggi viene da lì." },
    { h: 'Cosa farci', p: "Nel sacchetto ci sono due foglietti. Su uno scrivi quello che vuoi lasciarti alle spalle, sull'altro quello che vuoi far crescere. Il primo bruciatelo su un piattino, il secondo tienilo con il Daruma. Poi accendi le candele, una o tutte e sette, e lasciale andare finché vai a dormire." },
  ] },
  { d: 22, title: 'Le lune del 2027', draw: 'lune', inside: 'Il calendario lunare del 2027, stampato', parts: [
    { h: 'La luce torna', p: "Da ieri le giornate si allungano. Questo mese hai seminato con la luna nuova del 9 e dopodomani vedrai la luna piena: un ciclo intero, dall'inizio alla fine. Qui ci sono tutte le lune del prossimo anno." },
    { h: 'Le prime', p: "La prima luna nuova del 2027 cade il 7 gennaio, alle 21:24 ora italiana. La prima piena è il 22 gennaio, ed è una superluna: la luna è più vicina del solito alla Terra e sembra un po' più grande. La chiamano Luna del Lupo, perché a gennaio i lupi affamati si sentivano ululare vicino ai villaggi." },
    { h: 'Cosa farci', p: "Appendilo dove lo vedi e segna subito il 7 gennaio: è il giorno buono per cominciare quello che hai deciso stanotte. E nel 2027 sappiamo già quando fare le cose e quando tirare le somme." },
  ] },
  { d: 23, title: 'La notte della luna piena', img: 'lavanda', inside: 'Sei coni a cascata alla lavanda', parts: [
    { h: 'Mentre dormi', p: "Stanotte, alle 2:28, la luna diventa piena. Non c'è bisogno di aspettarla sveglia: per tradizione la luna piena vale per tre notti, quella prima, quella giusta e quella dopo." },
    { h: 'Cosa farci', p: "Accendi la cascata prima di andare a letto, con gli ultimi coni alla lavanda, che aiuta a dormire. Lascia le tende un po' aperte: se ti svegli nella notte, guarda fuori. Domani sera la guardiamo per bene." },
  ] },
  { d: 24, title: 'La Luna Fredda', img: 'gelsomino', inside: 'Incenso al gelsomino e due candele Winter Ritual', parts: [
    { h: 'L\'ultima luna dell\'anno', p: "La luna piena di dicembre si chiama Luna Fredda, ed è l'ultima del 2026. Quest'anno cade proprio la notte della vigilia, che non capita spesso. È anche la luna che sale più in alto nel cielo: in inverno la luna piena fa la strada che d'estate fa il Sole." },
    { h: 'Il gelsomino', p: "Molti gelsomini profumano soprattutto di sera, quando l'aria si raffredda. In India intrecciano i fiori nelle ghirlande delle feste e nei capelli delle spose. Mi sembrava giusto per una notte di luna piena." },
    { h: 'Cosa farci', p: "Sono passate due settimane da quando hai dipinto l'occhio al Daruma, al buio. Accendi il gelsomino e le due candele, vai alla finestra e guardala. Raccontale com'è andato questo mese, e poi raccontalo anche a me." },
  ] },
  { d: 25, title: 'Il libro di incantesimi', img: 'scatola', inside: 'La scatola Black Cat a forma di libro, e dentro un biglietto', parts: [
    { h: 'Il libro', p: "Sembra un vecchio libro di incantesimi, con il gatto nero in copertina, le lune e la scritta Book of Spells. Viene dalla stessa famiglia della tavola e del pendolo. Ma è una scatola, ed è la casa per il mazzo a cui tieni di più." },
    { h: 'Quello che c\'è dentro', p: "Prima di metterci le carte aprila, perché dentro c'è già una cosa. È un posto al seminario di Karl Simon sui Tarocchi Rider-Waite, la seconda parte, dedicata agli Arcani Minori: domenica 10 gennaio 2027, dalle 10 alle 18, alla Libreria Esoterica in Galleria Unione, a Milano. Karl Simon è l'autore del manuale italiano sul Rider-Waite, il mazzo che usi tu." },
    { h: 'Buon Natale', p: "Gli Arcani Minori sono quelli che nel gioco trovi nell'erba alta, uno alla volta: a gennaio te li racconta qualcuno che li conosce davvero. E il secondo occhio del Daruma dipingilo quando senti che è il momento. Buon Natale, strega mia." },
  ] },
];

export const PAGE = Object.fromEntries(PAGES.map((p) => [p.d, p]));
