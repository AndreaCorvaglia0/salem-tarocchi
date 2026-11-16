// The Reader's visits (docs/DESIGN.md, "Le visite della Lettrice" and "Un ritratto solo"). A visit is
// composed, never written one by one: the first OPENERS entry that holds (how she has played lately),
// the first THREAD entry (the long thread: an earlier answer set against what happened since), the new
// cards told with TALK, the first RITUALS entry (the small ritual of this visit: her sign, a pair of
// cards), the first CLOSERS entry (the verdict on her card). Entries are { when, t, then? }: `then` are
// session nodes run after the line; here they set a flag so that a remark is made once, and record
// the verdict. Plan of the eleven encounters and what each list is for: notes/reader.md.

// ---- the 22 cards ----------------------------------------------------------------------------
// tell: from the picture to what the card says. details: one line per hotspot of the sheet, for the
// detail she touched first. words: picks up her own three words. ask: one question, two answers.
import { LIKE, VERDICTS } from '../portrait.js';

const A = (t, trait, re) => ({ t, trait, re });
const card = (tell, details, words, q, a, b) => ({ tell, details, words, ask: { q, a: [a, b] } });

export const TALK = {
  m00: card(
    "Il Matto lo conosci già: è il ragazzo col fagotto che cammina guardando il cielo, a un passo dal bordo di una rupe. In una lettura parla di un inizio, e dice che è il momento di partire fidandosi, anche senza sapere come andrà a finire.",
    {
      dog: "Del Matto hai guardato per primo il cagnolino, e mi fa pensare che noti subito chi sta accanto a chi rischia. Nessuno sa se lo avverte o se gioca: la carta lascia il dubbio apposta.",
      rose: "Del Matto hai guardato per prima la rosa bianca, che è la cosa più leggera di tutta la carta. La tiene in mano mentre cammina sull'orlo: è la fiducia di chi parte senza cattivi pensieri.",
      bag: "Del Matto hai guardato per primo il fagotto, e ti sarai chiesta che cosa ci sia dentro. C'è poco, ed è questo il punto: per cominciare, dice la carta, serve molto meno di quello che credi.",
      cliff: "Del Matto hai guardato per primo il bordo della rupe, quindi il rischio lo vedi prima del resto. Lui invece non lo guarda affatto, e la carta non dice se cadrà: dice soltanto che il passo va fatto.",
    },
    "Tu, per il Matto, avevi scritto: {words:m00}. Sono parole tue e le tengo buone; io ci aggiungerei soltanto «fiducia», perché senza quella non parte nessuno.",
    "Tu, davanti a una cosa nuova, sei più una che salta o una che prima guarda bene dove mette i piedi?",
    A("Salto, e poi si vedrà.", { rischio: 1 }, "Come lui, allora. Ti auguro un cagnolino che abbai al momento giusto."),
    A("Prima guardo bene.", { rischio: -1 }, "Sei più saggia di lui, non c'è dubbio. Ricordati soltanto che dal bordo, a forza di guardare, non è mai partito nessuno.")),
  m01: card(
    "Il Mago alza una bacchetta verso il cielo e con l'altra mano indica la terra, e sul tavolo ha una coppa, una spada, un bastone e una moneta: tutto quello che gli serve. Quando esce ti dice che i mezzi li hai già, e che adesso tocca a te usarli.",
    {
      infinity: "Del Mago hai notato per primo il segno sopra la testa, un otto coricato che vuol dire infinito. Guardi in alto prima che sul tavolo: la carta dice che a lui le idee non finiscono mai, e che il difficile è sceglierne una.",
      wand: "Del Mago hai guardato per prima la bacchetta alzata. È il gesto che fa tutta la carta: prende qualcosa dall'alto e con l'altra mano lo porta a terra, cioè trasforma un'idea in una cosa fatta.",
      table: "Del Mago hai guardato per primo il tavolo, quindi sei una che controlla che cosa c'è a disposizione. Fai bene, perché lì sopra ci sono i quattro semi del mazzo, e la carta dice proprio questo: guarda quello che hai già.",
      flowers: "Del Mago hai guardato per primi i fiori, le rose e i gigli che gli crescono intorno. Dicono che quello che fa non resta un trucco: se ci mette intenzione, poi qualcosa cresce davvero.",
    },
    "Per il Mago tu avevi scritto: {words:m01}. Non te le correggo, perché sono le tue; io ci metterei accanto «cominciare», che è la parola che lui dice a tutti.",
    "Quando hai in mente di fare una cosa, tu la annunci a tutti oppure la fai e ne parli dopo?",
    A("La dico subito.", { parola: 1 }, "Come lui, che di parole ne ha sempre. Bada soltanto che dopo averla detta ti resti la voglia di farla."),
    A("La faccio e ne parlo dopo.", { parola: -1 }, "Sei prudente: così, se non riesce, lo sai soltanto tu. Però anche quando riesce rischi che non lo sappia nessuno.")),
  m02: card(
    "La Sacerdotessa siede immobile tra due colonne, una scura e una chiara, con un rotolo mezzo nascosto in grembo e un velo alle spalle. In una lettura dice che c'è qualcosa che non viene detto, e che tu in fondo lo sai già: per sentirlo devi fare silenzio e ascoltare.",
    {
      crown: "Della Sacerdotessa hai guardato per prima la corona, che mostra la luna mentre cresce, quando è piena e mentre cala. Hai l'occhio per quello che cambia piano: la carta parla di un sapere così, che arriva a ondate e non a comando.",
      veil: "Della Sacerdotessa hai guardato per primo il velo, e scommetto che ti sei chiesta che cosa ci sia dietro. È la domanda giusta, perché la carta parla proprio di quello che sta dietro le cose e non si lascia vedere subito.",
      pillar: "Della Sacerdotessa hai guardato per prima la colonna scura, quella con la lettera B. L'altra è chiara e ha una J: lei siede esattamente in mezzo, e la carta dice che certe risposte non stanno né da una parte né dall'altra.",
      moon: "Della Sacerdotessa hai guardato per prima la luna ai suoi piedi, quasi nascosta dal manto che scende come acqua. Noti le cose che stanno in basso e in ombra, ed è proprio lì che questa carta manda a cercare.",
    },
    "Per lei avevi scritto: {words:m02}. Le ho lette senza commentarle, come farebbe lei; ti dico soltanto che «silenzio» ci sarebbe stata bene.",
    "Ti capita mai di sapere una cosa senza poter dire come la sai? E quando succede, ti fidi?",
    A("Sì, di solito mi fido.", { guida: 1 }, "Allora tu e lei vi capirete. Tieni soltanto presente che una sensazione va ascoltata, e poi va anche messa alla prova."),
    A("No, mi serve una prova.", { guida: -1 }, "È un modo onesto di ragionare. Lei ti direbbe che certe prove arrivano soltanto dopo che ti sei fidata, ma lei parla poco.")),
  m03: card(
    "L'Imperatrice sta seduta comoda sui cuscini in mezzo al grano maturo, con una corona di stelle e un bosco alle spalle. Quando esce parla di abbondanza: dice che quello di cui ti prendi cura cresce, e che puoi anche godertelo senza sentirti in colpa.",
    {
      crown: "Dell'Imperatrice hai guardato per prima la corona, che ha dodici stelle, una per ogni mese dell'anno. Guardi in alto anche quando tutto il resto invita a sdraiarsi: la carta dice che la cura ha bisogno di tempo, una stagione dopo l'altra.",
      heart: "Dell'Imperatrice hai guardato per primo lo scudo a forma di cuore, con sopra il segno di Venere. Vai dritta a quello che conta, perché la carta parla proprio di amore, nel senso più pratico che c'è: accudire qualcosa.",
      wheat: "Dell'Imperatrice hai guardato per primo il grano, che è maturo e pronto da raccogliere. Ti piace vedere i risultati, mi pare, e la carta te li promette: quello che è stato curato bene prima o poi dà frutto.",
      stream: "Dell'Imperatrice hai guardato per primo il ruscello che scende dal bosco. È l'acqua che fa crescere tutto il resto e quasi non si nota: la carta dice che dietro ogni abbondanza c'è qualcosa che la nutre senza farsi vedere.",
    },
    "Per lei avevi scritto: {words:m03}. Le tengo così come sono; se ne volessi una in più prenderei «cura», che in questa carta è dappertutto.",
    "Quando una persona a cui tieni sbaglia, tu sei una che consola o una che dice chiaro dove ha sbagliato?",
    A("Prima la consolo.", { tono: 1 }, "L'Imperatrice farebbe lo stesso. Stai soltanto attenta a non consolare così bene che l'altra si dimentica di avere sbagliato."),
    A("Glielo dico chiaro.", { tono: -1 }, "Anche questa è cura, sai, solo che punge. Malva, per dire, vuole bene a tutti in questo modo.")),
  m04: card(
    "L'Imperatore siede su un trono di pietra, con l'armatura sotto il manto rosso e le montagne nude alle spalle. In una lettura parla di ordine e di regole: c'è qualcosa, o qualcuno, che tiene in piedi tutto, e tu puoi appoggiarti oppure sentirtelo addosso.",
    {
      ram: "Dell'Imperatore hai guardato per prima la testa di montone scolpita sul trono. È il segno dell'Ariete, che parte a testa bassa: la carta parla di chi prende una decisione e poi non si sposta più.",
      ankh: "Dell'Imperatore hai guardato per primo lo scettro, che finisce con una croce ad anello. Hai notato subito chi comanda: la carta dice che un'autorità serve, quando protegge quello che le è stato affidato.",
      boots: "Dell'Imperatore hai guardato per primi i piedi, che sotto il manto sono coperti di ferro. Ti accorgi di quello che gli altri nascondono: lui sta seduto, ma è sempre pronto a difendere quello che ha costruito.",
      mountains: "Dell'Imperatore hai guardato per prime le montagne dietro di lui, dove non cresce niente. Sono dure e ferme come le sue regole: la carta dà solidità, e in cambio chiede di non dimenticare la morbidezza.",
    },
    "Per lui avevi scritto: {words:m04}. Lui le metterebbe in ordine alfabetico; io le lascio come sono e ci aggiungo soltanto «struttura».",
    "Una giornata senza niente di deciso ti piace, oppure hai bisogno di sapere prima che cosa farai?",
    A("Mi piace non sapere.", { esplora: 1 }, "L'Imperatore scuoterebbe la testa. Io no, purché ogni tanto tu sappia almeno dove dormi."),
    A("Preferisco avere un piano.", { esplora: -1 }, "Allora questa carta ti sarà simpatica. Ricordati soltanto che i piani migliori lasciano un po' di posto agli imprevisti.")),
  m05: card(
    "Il Papa siede tra due colonne con la mano alzata a benedire, e davanti a lui due chierici lo ascoltano in ginocchio. Quando esce parla di quello che si impara da chi ne sa di più: una tradizione, una regola condivisa, una strada che altri hanno già battuto.",
    {
      crown: "Del Papa hai guardato per prima la corona a tre piani. Ti colpisce chi sta in alto, e la carta parla proprio di questo: di un sapere che ha i suoi gradini, e che si sale uno alla volta.",
      hand: "Del Papa hai guardato per prima la mano alzata, con due dita su e due giù. È il gesto di chi insegna: una parte la dice e una la tiene per dopo, come fa ogni buona maestra.",
      keys: "Del Papa hai guardato per prime le due chiavi incrociate ai suoi piedi. Cerchi subito come si entra, mi pare: la carta dice che certe porte si aprono soltanto con quello che ti ha insegnato qualcun altro.",
      monk: "Del Papa hai guardato per primo uno dei due chierici, cioè chi ascolta invece di chi parla. La carta sta anche dalla loro parte: dice che imparare da qualcuno non è mai una debolezza.",
    },
    "Per il Papa avevi scritto: {words:m05}. Vanno bene così; io ci avrei messo anche «maestro», perché questa carta ne ha sempre uno.",
    "Se c'è una strada che hanno già fatto in tanti, tu la prendi, o ti viene voglia di cercarne un'altra?",
    A("Prendo quella sicura.", { rischio: -1 }, "Sei giudiziosa: chi è passato prima di te qualche buca l'ha già trovata, e non c'è motivo di caderci di nuovo."),
    A("Ne cerco un'altra.", { rischio: 1 }, "Lo sospettavo: il Papa ti guarderebbe storto, ma perfino lui, un giorno, avrà pur cominciato da una strada nuova.")),
  m06: card(
    "Gli Amanti sono un uomo e una donna in un giardino, e sopra di loro un angelo apre le braccia sotto il sole. Sembra una carta d'amore, e a volte lo è; in una lettura però parla più spesso di una scelta fatta col cuore, di quelle che dicono chi vuoi essere.",
    {
      angel: "Degli Amanti hai guardato per primo l'angelo. Lui non sceglie al posto loro: guarda dall'alto e benedice, perché la carta dice che una scelta fatta bene ha sempre qualcosa di più grande alle spalle.",
      snake: "Degli Amanti hai guardato per primo l'albero con il serpente, dietro la donna. Hai fiuto per le tentazioni, a quanto pare: la carta ricorda che ogni scelta vera ha accanto una strada più comoda.",
      fire: "Degli Amanti hai guardato per primo l'albero di fiamme, dietro l'uomo. Sono dodici fiammelle e bruciano come i desideri: la carta dice che un desiderio va ascoltato, e poi va messo d'accordo con quello in cui credi.",
      mountain: "Degli Amanti hai guardato per prima la montagna in fondo, in mezzo ai due. Vedi quello che separa prima di quello che unisce: la carta dice che scegliere qualcuno, o qualcosa, vuol dire sempre salire un po'.",
    },
    "Per questa carta avevi scritto: {words:m06}. Le tengo; io ci aggiungerei «scegliere», perché è la parola che chi comincia dimentica sempre quando la vede.",
    "Quando devi scegliere tra due cose che ti piacciono, alla fine decide il cuore o decide la testa?",
    A("Decide il cuore.", { guida: 1 }, "Come vuole la carta. La testa poi la chiami lo stesso, immagino, almeno per farti dire che hai fatto bene."),
    A("Decide la testa.", { guida: -1 }, "Va bene anche così. Fai soltanto attenzione, perché il cuore, quando non viene interpellato, tende a presentare il conto più tardi.")),
  m07: card(
    "Il Carro mostra un guerriero in piedi su un carro tirato da due sfingi, una nera e una bianca, e in mano non ha redini. Vuol dire che le guida con la volontà: in una lettura la carta parla di una meta, e della forza di tenere insieme quello che tira da due parti.",
    {
      star: "Del Carro hai guardato per prima la stella sulla corona. È quella che lui segue: guardi subito dove uno vuole arrivare, e la carta parla proprio di avere una direzione.",
      moons: "Del Carro hai guardato per prime le due lune sulle sue spalle, una che ride e una che fa il broncio. Noti gli umori, mi sembra: la carta dice che si va avanti anche con quelli addosso, senza farsene comandare.",
      sphinx: "Del Carro hai guardato per prima la sfinge nera. Da sola andrebbe per conto suo, e la bianca dall'altra parte: la carta dice che vincere vuol dire convincerle a tirare insieme.",
      emblem: "Del Carro hai guardato per primo lo stemma con le ali, sul davanti. Ti piacciono i dettagli che gli altri saltano: quelle ali dicono che il carro, quando la volontà è una sola, quasi vola.",
    },
    "Per il Carro avevi scritto: {words:m07}. Vanno bene; ci aggiungerei «direzione», perché senza quella lui sarebbe soltanto uno che corre.",
    "Quando hai una meta, ci vai per la strada più corta o ti concedi qualche deviazione?",
    A("Per la più corta.", { esplora: -1 }, "Come lui, e come Ginepra, che ogni tanto arriva prima ancora di avere capito dove."),
    A("Qualche deviazione la faccio.", { esplora: 1 }, "Il guerriero non approverebbe. Le sfingi però, lasciate un po' libere, a volte trovano strade migliori di lui.")),
  m08: card(
    "La Forza è una donna vestita di bianco che chiude con calma le fauci di un leone, e il leone la lascia fare. Lo vince con la pazienza e non con i muscoli: in una lettura la carta parla di un coraggio gentile, che le paure le addomestica invece di picchiarle.",
    {
      infinity: "Della Forza hai guardato per primo il segno dell'infinito sopra la sua testa. È lo stesso che porta il Mago: qui dice che la sua pazienza non finisce, ed è per questo che il leone alla fine cede.",
      jaw: "Della Forza hai guardato per prime le fauci del leone, cioè il punto in cui la cosa potrebbe finire male. Guardi il pericolo in faccia: la carta dice che si può tenerlo tra le mani senza farsi mordere.",
      garland: "Della Forza hai guardato per prima la ghirlanda di fiori. Lei il leone lo tiene con quelli, dove un'altra userebbe una catena: la carta dice che le cose selvatiche si legano meglio con la gentilezza.",
      face: "Della Forza hai guardato per primo il volto di lei, che è tranquillo. Cerchi le persone prima delle bestie: la carta sta tutta in quella calma, perché chi è sicuro di sé non ha bisogno di alzare la voce.",
    },
    "Per lei avevi scritto: {words:m08}. Sono parole buone; io ci metterei vicino «pazienza», che è la sua vera forza.",
    "Quando qualcuno ti fa perdere la pazienza, tu alzi la voce o la abbassi?",
    A("La abbasso.", { tono: 1 }, "Come lei col leone. È il modo più difficile, e di solito è anche quello che funziona."),
    A("La alzo, eccome.", { tono: -1 }, "Sei sincera, almeno. Ogni tanto ruggire fa bene, lo sa anche il leone: basta poi saper richiudere la bocca.")),
  m09: card(
    "L'Eremita è un vecchio col cappuccio, solo su una cima innevata, che alza una lanterna con dentro una stella. La luce arriva appena al passo successivo, e a lui basta: in una lettura la carta dice di ritirarti un po', e di cercare la risposta per conto tuo.",
    {
      lantern: "Dell'Eremita hai guardato per prima la lanterna, come farebbe chiunque abbia camminato al buio. Fa poca luce, e la carta dice proprio che non serve vedere tutta la strada: basta il prossimo passo.",
      staff: "Dell'Eremita hai guardato per primo il bastone. Badi a quello che regge le persone, mi pare: lui è arrivato fin lassù appoggiandosi a quello che ha imparato, e la carta dice che l'esperienza serve a questo.",
      hood: "Dell'Eremita hai guardato per primo il cappuccio, che gli nasconde quasi il viso. Lui guarda in basso, verso chi sta ancora salendo: la carta parla di chi cerca da solo, e poi fa luce anche agli altri.",
      snow: "Dell'Eremita hai guardato per prima la neve, e tu la neve la conosci. Lassù non c'è nessun altro, e la carta dice che certe cose si capiscono soltanto in un posto così, lontano dal rumore.",
    },
    "Per lui avevi scritto: {words:m09}. Non aggiungo quasi niente, per rispetto al suo silenzio; soltanto «cercare», che è quello che fa.",
    "Quando hai un pensiero che ti pesa, ne parli con qualcuno o prima te lo rigiri da sola?",
    A("Ne parlo subito.", { parola: 1 }, "Allora su quella cima ci resteresti poco. Va bene lo stesso: c'è chi la lanterna la accende parlando."),
    A("Prima ci penso da sola.", { parola: -1 }, "Come lui, allora. Ricordati soltanto di scendere, ogni tanto, perché la luce serve anche a chi ti aspetta giù.")),
  m10: card(
    "La Ruota della Fortuna gira in mezzo al cielo: una figura sale da una parte, un serpente scende dall'altra, e in cima una sfinge sta ferma a guardare. In una lettura dice che le cose stanno cambiando giro, e che conviene cogliere il momento.",
    {
      wheel: "Della Ruota hai guardato per prima la ruota, con tutte quelle lettere. Sei una che vuole capire il meccanismo; la carta però dice che gira comunque, anche quando non l'abbiamo capito.",
      sphinx: "Della Ruota hai guardato per prima la sfinge in cima, l'unica che non si muove. Hai scelto il posto migliore: la carta dice che chi resta calmo mentre tutto gira è il solo a vedere bene.",
      snake: "Della Ruota hai guardato per primo il serpente, che scende. Noti la parte in discesa, e non è pessimismo: la carta ricorda che chi scende adesso è lo stesso che prima o poi risale.",
      jackal: "Della Ruota hai guardato per prima la figura con la testa di sciacallo, che sale. Ti piace chi è in rimonta: la carta dice che la fortuna gira, e che quando tocca a te bisogna farsi trovare pronte.",
    },
    "Per la Ruota avevi scritto: {words:m10}. Le lascio girare così; io ci metterei anche «occasione», perché passa e non avverte.",
    "Quando ti capita un'occasione che non avevi previsto, la prendi al volo o chiedi tempo per pensarci?",
    A("La prendo al volo.", { rischio: 1 }, "La Ruota premia quelle come te una volta su due. L'altra volta insegna qualcosa, che non è poco."),
    A("Chiedo tempo.", { rischio: -1 }, "È saggio, finché l'occasione ha la pazienza di aspettarti. Purtroppo non tutte ce l'hanno.")),
  m11: card(
    "La Giustizia siede tra due colonne con una spada dritta in una mano e una bilancia nell'altra, e ti guarda in faccia. In una lettura parla di verità e di conseguenze: dice che ogni cosa fatta ha un peso, e che è ora di guardarlo con onestà.",
    {
      sword: "Della Giustizia hai guardato per prima la spada, che punta dritta in alto e taglia da tutte e due le parti. Vai al sodo, mi pare, e la carta fa lo stesso quando dice che una decisione va presa.",
      scales: "Della Giustizia hai guardato per prima la bilancia. Sei una che pesa le cose prima di parlare: la carta chiede proprio questo, di mettere sui piatti quello che è stato fatto e guardare da che parte pende.",
      crown: "Della Giustizia hai guardato per prima la corona, che è quadrata come una cosa fatta con la squadra. Ti piace l'ordine nelle idee: la carta dice che una verità, per reggere, deve avere gli angoli giusti.",
      shoe: "Della Giustizia hai guardato per prima la punta della scarpa che spunta dal manto, e sono poche a notarla. Vuol dire che anche lei, tanto composta, è pronta ad alzarsi: la verità prima o poi si muove.",
    },
    "Per lei avevi scritto: {words:m11}. Le ho pesate e le trovo giuste; «conseguenze» però ce la metterei, perché è la parola che lei non dimentica mai.",
    "Se sai una verità che a qualcuno farà dispiacere, gliela dici lo stesso?",
    A("Sì, gliela dico.", { parola: 1 }, "La Giustizia è dalla tua parte. Io ti chiedo soltanto di posare la spada sul tavolo, mentre parli."),
    A("Dipende, prima ci penso.", { parola: -1 }, "Anche scegliere il momento è un lavoro da bilancia. Stai attenta però che, a furia di pesarla, la verità non si raffreddi.")),
  m12: card(
    "L'Appeso pende a testa in giù, legato per una caviglia, e invece di disperarsi ha il viso sereno e una luce intorno alla testa. In una lettura parla di una pausa che non si può forzare: ti fermi, aspetti, e intanto vedi la cosa da un altro lato.",
    {
      halo: "Dell'Appeso hai guardato per prima la luce intorno alla testa. Hai visto subito che non sta soffrendo: la carta dice che da fermi, e perfino sottosopra, a volte si capisce più che correndo.",
      ankle: "Dell'Appeso hai guardato per prima la caviglia legata. Ti chiedi che cosa lo trattiene, ed è giusto: la corda però è una sola e lui non tira, perché in questa carta fermarsi è una scelta.",
      leg: "Dell'Appeso hai guardato per prima la gamba piegata dietro l'altra, che gli dà quasi l'aria di uno che riposa. Noti quanto sta comodo: la carta dice che l'attesa pesa meno quando smetti di combatterla.",
      tree: "Dell'Appeso hai guardato per primo il tronco, e avrai visto che ha ancora le foglie. È legno vivo: la carta dice che questa pausa non è un castigo, e che intanto qualcosa continua a crescere.",
    },
    "Per lui avevi scritto: {words:m12}. Lette a testa in giù valgono lo stesso; io aggiungerei «aspettare», che è il suo mestiere.",
    "Quando sei costretta ad aspettare, ti guardi intorno o conti i minuti?",
    A("Mi guardo intorno.", { esplora: 1 }, "Allora l'attesa a te pesa meno che ad altre. L'Appeso fa lo stesso, e da lassù vede cose che chi cammina non vede."),
    A("Conto i minuti.", { esplora: -1 }, "Ti capisco, hai sempre un posto dove andare. Lui ti direbbe che i minuti passano uguali anche se non li conti.")),
  m13: card(
    "La Morte, te lo dico subito, quasi mai parla di morire. Uno scheletro a cavallo avanza piano, e in fondo, tra due torri, sta sorgendo il sole. In una lettura dice che qualcosa è finito e va lasciato andare, perché ha già fatto posto a quello che viene dopo.",
    {
      flag: "Della Morte hai guardato per prima la bandiera, con la rosa bianca sul nero. Hai trovato subito la cosa viva in mezzo a tutto il resto: quella rosa dice che ogni fine si porta dietro qualcosa che ricomincia.",
      skull: "Della Morte hai guardato per primo il teschio, senza girare gli occhi. Hai fatto bene, perché è così che va guardata questa carta: lei non minaccia nessuno, dice soltanto con franchezza quello che è finito.",
      king: "Della Morte hai guardato per primo il re a terra, con la corona caduta. Noti chi perde: la carta dice che davanti a un cambiamento vero nessuno fa eccezione, e che opporsi serve a poco.",
      sun: "Della Morte hai guardato per primo il sole tra le due torri, laggiù in fondo. Sei andata a cercare l'uscita, e hai fatto bene: la carta finisce lì, con un giorno nuovo che comincia.",
    },
    "Per questa carta avevi scritto: {words:m13}. Qualunque cosa ti abbia fatto venire in mente, tienila; io ci scriverei accanto «lasciar andare».",
    "Quando una cosa è finita davvero, tu riesci a chiuderla o ne conservi un pezzo?",
    A("La chiudo e basta.", { guida: -1 }, "Sei netta, e la carta ti somiglia: a lei i cassetti pieni di cose finite non sono mai piaciuti."),
    A("Un pezzo lo conservo.", { guida: 1 }, "Ti capisco, e a guardar bene ti capisce anche la carta: la rosa sulla bandiera, in fondo, è un ricordo che si porta dietro.")),
  m14: card(
    "La Temperanza è un angelo che versa l'acqua da una coppa all'altra senza perderne una goccia, con un piede nello stagno e uno sulla riva. In una lettura parla di misura: mescolare cose diverse nella dose giusta, con pazienza, finché stanno bene insieme.",
    {
      cups: "Della Temperanza hai guardato per prime le due coppe, e l'acqua che passa in mezzo. Ti incuriosisce come fa a non cadere: è la carta intera, l'arte di dosare senza sprecare niente.",
      feet: "Della Temperanza hai guardato per primi i piedi, uno nell'acqua e uno sulla terra. Noti dove uno sta, prima di che cosa fa: la carta dice che l'equilibrio si trova tenendo un piede in ciascuna delle due cose.",
      sun: "Della Temperanza hai guardato per primo il sole in fondo al sentiero, tra i due monti. Guardi dove porta la strada: la carta dice che ci si arriva, ma al passo dell'angelo, che non ha nessuna fretta.",
      irises: "Della Temperanza hai guardato per primi gli iris gialli sulla riva. Crescono dove l'acqua incontra la terra, proprio come sta lui: la carta dice che le cose migliori nascono dove due mondi si toccano.",
    },
    "Per lei avevi scritto: {words:m14}. Sono ben dosate; io ci verserei sopra soltanto un po' di «pazienza».",
    "In una discussione tra due amiche, tu prendi le parti di una o cerchi di metterle d'accordo?",
    A("Cerco di metterle d'accordo.", { tono: 1 }, "L'angelo fa lo stesso con le sue coppe. È un bel mestiere, finché non ti dimentichi di avere anche tu un'opinione."),
    A("Sto con chi ha ragione.", { tono: -1 }, "È poco temperante, ma almeno si sa come la pensi. L'angelo ci metterebbe più tempo e scontenterebbe meno gente.")),
  m15: card(
    "Il Diavolo fa meno paura di quanto vorrebbe. Ai suoi piedi ci sono un uomo e una donna incatenati, ma guarda bene le catene: sono così larghe che potrebbero sfilarsele. In una lettura parla di un'abitudine o di un desiderio che ti comanda, e ricorda che puoi liberartene.",
    {
      pentagram: "Del Diavolo hai guardato per prima la stella rovesciata sulla fronte. Hai notato che è messa al contrario: la carta parla di quando le cose si capovolgono, e il desiderio finisce a comandare sulla testa.",
      chains: "Del Diavolo hai guardato per prime le catene, ed è lì che sta il segreto della carta. Sono larghe, e chi le porta potrebbe togliersele quando vuole: quello che ci lega, molto spesso, lo teniamo noi.",
      torch: "Del Diavolo hai guardato per prima la torcia, che lui tiene rivolta in basso. Guardi il fuoco prima di chi lo regge: la carta dice che un desiderio scalda finché lo tieni tu, e brucia quando è lui a tenere te.",
      woman: "Del Diavolo hai guardato per prima la donna, e avrai notato che non sembra affatto disperata. È questo che la carta vuole far vedere: a certe catene ci si abitua, e bisogna accorgersene per toglierle.",
    },
    "Per lui avevi scritto: {words:m15}. Non mi scandalizzo di niente; ci aggiungo soltanto «abitudine», che è la sua catena preferita.",
    "Quando una cosa ti tenta e sai che non dovresti, di solito cedi o resisti?",
    A("Cedo, quasi sempre.", { rischio: 1 }, "Almeno sei onesta. La carta non ti sgrida: ti chiede soltanto di ricordare che la catena la puoi sfilare quando vuoi."),
    A("Resisto.", { rischio: -1 }, "Brava, anche se un po' ti invidio la sicurezza. Con quelle come te il Diavolo si annoia in fretta, e cambia tavolo.")),
  m16: card(
    "La Torre a vederla spaventa, e lo capisco. Un fulmine fa saltare la corona di una torre altissima, e chi c'era dentro vola giù. In una lettura parla di qualcosa che crolla all'improvviso: fa male, ma cade soltanto quello che era costruito male, e dopo si vede più chiaro.",
    {
      crown: "Della Torre hai guardato per prima la corona che vola via dalla cima. Hai visto subito che cosa perde il posto: la carta dice che la prima cosa a cadere è la sicurezza di avere ragione.",
      lightning: "Della Torre hai guardato per primo il fulmine, cioè la causa prima dell'effetto. Ragioni bene: la carta parla di una verità che arriva tutta in una volta, senza chiedere il permesso.",
      falling: "Della Torre hai guardato per prima la figura che cade, e mi dice che pensi alle persone prima che ai muri. La carta non promette che non faccia male: promette che dopo, a terra, si ricomincia su qualcosa di vero.",
      rock: "Della Torre hai guardato per prima la roccia, che è l'unica cosa a restare ferma. Cerchi quello che tiene: la carta dice che crolla quello che è stato costruito sopra, e che il fondo rimane.",
    },
    "Per la Torre avevi scritto: {words:m16}. Ci stanno tutte; io aggiungerei «chiarezza», che è quello che resta quando la polvere si posa.",
    "Se ti accorgi che una cosa non sta più in piedi, la butti giù tu o aspetti che cada da sola?",
    A("La butto giù io.", { rischio: 1 }, "Allora a te il fulmine serve poco, perché fai da sola. È faticoso, però almeno il giorno lo scegli tu."),
    A("Aspetto che cada.", { rischio: -1 }, "È umano, lo facciamo quasi tutte. La Torre esiste proprio per questo: ogni tanto decide lei al posto nostro.")),
  m17: card(
    "La Stella viene subito dopo La Torre, e non è un caso. Una donna in ginocchio versa acqua da due brocche, una nello stagno e una sulla terra, sotto un cielo pieno di stelle. In una lettura parla della quiete dopo la tempesta: la speranza torna, e tu ricominci a dare.",
    {
      star: "Della Stella hai guardato per prima la stella grande, con le sette piccole intorno. Alzi gli occhi volentieri: la carta dice che una direzione c'è sempre, anche nelle notti in cui sembra di no.",
      pond: "Della Stella hai guardato per prima la brocca che versa nello stagno. L'acqua torna all'acqua: la carta dice che la prima cura è per te, e che rimettere dentro quello che hai consumato non è egoismo.",
      land: "Della Stella hai guardato per prima la brocca che versa sulla terra, dove l'acqua si divide in cinque rivoli. Guardi dove va a finire quello che si dà: la carta dice che la speranza, per servire, deve bagnare qualcosa.",
      bird: "Della Stella hai guardato per primo l'uccello sull'albero, che quasi nessuna nota. Sta lì e aspetta il momento di cantare: la carta dice che dopo un brutto periodo le cose buone tornano piano, a cominciare dalle più piccole.",
    },
    "Per lei avevi scritto: {words:m17}. Le tengo volentieri; io ci metterei anche «fiducia», perché è quella che lei versa.",
    "Quando le cose vanno male, tu riesci a sperare lo stesso o aspetti di vedere un miglioramento?",
    A("Spero lo stesso.", { guida: 1 }, "È il dono di questa carta, e tu ce l'hai già. Tienilo stretto, perché non si compra da nessuna parte."),
    A("Aspetto di vedere qualcosa.", { guida: -1 }, "Sei realista, e La Stella non ti dà torto. Ti fa soltanto notare che lei brilla anche prima che tu alzi gli occhi.")),
  m18: card(
    "La Luna è la carta della notte. Un cane e un lupo le ululano contro, un gambero esce dall'acqua, e un sentiero passa tra due torri e si perde lontano. In una lettura dice che non tutto è come sembra, e che al buio le paure fanno le ombre più grandi di quello che sono.",
    {
      moon: "Della Luna hai guardato per primo il volto, che tiene gli occhi bassi come chi sogna. Guardi in faccia anche le cose che non si capiscono: la carta parla di sogni e di intuizioni, da ascoltare senza prenderli alla lettera.",
      dogs: "Della Luna hai guardato per primi il cane e il lupo. Uno è di casa e l'altro è selvatico, e ululano insieme: la carta dice che dentro di noi stanno tutti e due, e che di notte si sentono meglio.",
      tower: "Della Luna hai guardato per prima una delle due torri. Stanno ai lati del sentiero come un cancello: la carta dice che per arrivare dall'altra parte bisogna passare in mezzo al buio, a piccoli passi.",
      crayfish: "Della Luna hai guardato per primo il gambero che esce dalla pozza, e poche cominciano da lì. È quello che sale dal fondo quando fa buio: la carta dice che certe paure vecchie vengono a galla proprio di notte.",
    },
    "Per la Luna avevi scritto: {words:m18}. Tartufo le approverebbe, credo; io ci aggiungo «ombre», che di notte sembrano sempre più grandi.",
    "Quando di notte ti viene un brutto pensiero, tu gli dai retta o aspetti la mattina per vedere se c'è ancora?",
    A("Gli do retta.", { guida: 1 }, "Allora di notte dormi poco, immagino. La carta ti direbbe di ascoltarlo, sì, ma di non decidere niente fino all'alba."),
    A("Aspetto la mattina.", { guida: -1 }, "È il consiglio migliore che questa carta possa dare, e tu lo sapevi già. Molte ombre, col sole, tornano a essere sedie.")),
  m19: card(
    "Il Sole è la carta più semplice del mazzo. Un bambino a cavallo, senza sella e a braccia aperte, ride sotto un sole enorme, con un muro di girasoli alle spalle: in una lettura dice che le cose vanno bene, che è tutto chiaro, e che puoi mostrarti per quella che sei.",
    {
      sun: "Del Sole hai guardato per primo il sole, che ti guarda dritto con una faccia tranquilla. Non ti fai abbagliare: la carta dice che ci sono giorni in cui non c'è niente di nascosto da cercare.",
      child: "Del Sole hai guardato per primo il bambino, che non ha sella, né vestiti, né paura. Ti intenerisce chi si fida così: la carta parla di una gioia che non deve giustificarsi con nessuno.",
      horse: "Del Sole hai guardato per primo il cavallo bianco, che va tranquillo anche se nessuno lo guida. Noti chi porta il peso: la carta dice che quando sei serena le cose ti vengono dietro senza bisogno di redini.",
      sunflowers: "Del Sole hai guardato per primi i girasoli sul muro. Di solito seguono il sole, e qui invece guardano il bambino: la carta dice che una persona contenta fa luce anche lei, e gli altri si voltano.",
    },
    "Per il Sole avevi scritto: {words:m19}. Non tolgo niente; ci metto vicino «chiarezza», perché con questa carta si vede tutto.",
    "Quando sei contenta, lo fai vedere a tutti o te lo tieni un po' per te?",
    A("Lo faccio vedere.", { parola: 1 }, "Come il bambino a braccia aperte. Fai bene, perché la gioia tenuta nascosta si sciupa prima."),
    A("Me lo tengo per me.", { parola: -1 }, "È una gioia discreta, e va bene. Ogni tanto però lasciala uscire, perché a qualcuno farebbe piacere saperlo.")),
  m20: card(
    "Il Giudizio mostra un angelo che suona la tromba, e dalle bare che galleggiano sul mare si alzano uomini, donne e un bambino, a braccia aperte. In una lettura parla di una chiamata a cui è ora di rispondere: fai i conti con quello che è stato, perdoni, e ricominci più vera di prima.",
    {
      trumpet: "Del Giudizio hai guardato per prima la tromba. Senti le chiamate prima di vedere chi chiama: la carta parla proprio di una voce che non si può più far finta di non sentire.",
      flag: "Del Giudizio hai guardato per prima la bandiera bianca con la croce rossa. È un segno di pace fatta: la carta dice che i conti col passato si fanno per chiuderli, e ripartire più leggere.",
      woman: "Del Giudizio hai guardato per prima la donna, che apre le braccia verso l'alto. Lei ha già risposto: la carta dice che quando una cosa ti chiama davvero, il corpo lo sa prima della testa.",
      man: "Del Giudizio hai guardato per prima la figura al centro, quella di spalle. Potrebbe essere chiunque, e quindi anche tu: la carta mette chi la guarda in mezzo agli altri, davanti alla stessa chiamata.",
    },
    "Per questa carta avevi scritto: {words:m20}. Le prendo come una risposta; io ci aggiungo «risveglio», che è la parola della tromba.",
    "Quando qualcuno ti ha fatto un torto e poi ti chiede scusa, tu perdoni in fretta o te lo ricordi a lungo?",
    A("Perdono in fretta.", { tono: 1 }, "Allora ti alzi leggera, come quelli della carta. Controlla soltanto di non perdonare prima ancora che l'altro abbia capito."),
    A("Me lo ricordo a lungo.", { tono: -1 }, "Hai buona memoria, e non è un difetto. La carta ti direbbe che i conti vanno fatti, appunto, per poterli chiudere.")),
  m21: card(
    "Il Mondo è l'ultima carta. Una figura danza dentro una corona di alloro, e ai quattro angoli la guardano un angelo, un'aquila, un toro e un leone. In una lettura dice che un giro si è chiuso e che ogni cosa ha trovato il suo posto: puoi festeggiare, e poi ricominciare.",
    {
      dancer: "Del Mondo hai guardato per prima la figura che danza. Dopo ventuno carte di fatiche, finalmente qualcuno balla: la carta dice che arrivare in fondo a una cosa va anche festeggiato, oltre che capito.",
      wreath: "Del Mondo hai guardato per prima la corona di alloro, che non ha inizio né fine. Ti piacciono le cose che si chiudono bene: la carta parla di un cerchio completo, dove non manca più nessun pezzo.",
      wand: "Del Mondo hai guardato per prime le bacchette, una per mano. Il Mago ne aveva una sola: la carta dice che adesso quello che sai e quello che fai stanno finalmente in equilibrio.",
      lion: "Del Mondo hai guardato per primo il leone nell'angolo. Con l'angelo, l'aquila e il toro stava già intorno alla Ruota: lì tutto girava, qui tutto è al suo posto, e la carta parla proprio di questo arrivo.",
    },
    "Per il Mondo avevi scritto: {words:m21}. Sono le ultime tre parole del tuo mazzo, e ci stanno bene; io ci metto accanto «compimento».",
    "Quando finisci una cosa lunga, ti fermi a godertela o stai già pensando alla prossima?",
    A("Mi fermo a godermela.", { esplora: 1 }, "È quello che la carta chiede, e sono poche a riuscirci. Balla pure, perché il prossimo giro non scappa."),
    A("Penso già alla prossima.", { esplora: -1 }, "Lo immaginavo: la figura della carta ti direbbe che un minuto per danzare, tra un giro e l'altro, lo trovi anche tu.")),
};

// ---- conditions in short ----------------------------------------------------------------------
const hi = (axis, n = 3) => ({ trait: [axis, '>=', n] });
const lo = (axis, n = -3) => ({ trait: [axis, '<=', n] });
const F = (k) => ({ flag: k });
const mark = (id) => ({ do: 'flag', k: `rd.${id}` });
// said once in the whole game: the flag rd.<id> is set by `then`
const once = (id, when, t, then = []) => ({ when: [{ notFlag: `rd.${id}` }, ...[].concat(when)], t, then: [...then, mark(id)] });
const signIn = (...ids) => ({ any: ids.map((s) => ({ sign: s })) });
const both = (...ids) => ids.map((id) => ({ has: id }));

// ---- the opening remark: how she has played lately ---------------------------------------------
// Order: a trait that turned over (an aside of the moment), news of the last stretch, a trait pulled
// both ways, two traits together, a trait that holds, lighter facts, the chapter. The last is always true.
export const OPENERS = [
  { when: [{ turned: 'rischio' }, { trait: ['rischio', '>', 0] }], t: "Fino all'altra volta ti avrei detta prudente, e l'avevo anche scritto. In questi giorni invece hai rischiato parecchio, e mi tocca correggere il quaderno." },
  { when: [{ turned: 'rischio' }, { trait: ['rischio', '<', 0] }], t: "L'altra volta avevo davanti una che si buttava. In questi giorni ti sei fatta più cauta, e non credo che sia paura: credo che adesso tu abbia qualcosa da perdere." },
  { when: [{ turned: 'esplora' }, { trait: ['esplora', '>', 0] }], t: "L'altra volta andavi dritta da un posto all'altro. Stavolta ti sei presa il tempo di guardarti intorno, e sono curiosa di sapere che cosa ti ha fatto cambiare passo." },
  { when: [{ turned: 'esplora' }, { trait: ['esplora', '<', 0] }], t: "L'altra volta ti perdevi volentieri per strada. In questi giorni invece sei andata dritta dove dovevi, come una che ha capito che cosa vuole." },
  { when: [{ turned: 'parola' }, { trait: ['parola', '>', 0] }], t: "Fino all'altra volta pesavi ogni parola. In questi giorni hai cominciato a dire le cose come stanno; non so chi devo ringraziare, ma mi piace." },
  { when: [{ turned: 'parola' }, { trait: ['parola', '<', 0] }], t: "L'altra volta dicevi tutto quello che ti passava per la testa. Adesso misuri di più le parole, e immagino che Salem c'entri qualcosa." },
  { when: [{ turned: 'tono' }, { trait: ['tono', '>', 0] }], t: "L'altra volta avevi la risposta pronta, e un po' appuntita. In questi giorni ti sei addolcita, e confesso che non ci avrei scommesso." },
  { when: [{ turned: 'tono' }, { trait: ['tono', '<', 0] }], t: "L'altra volta eri tutta gentilezza. In questi giorni ti ho sentita rispondere per le rime più di una volta, e ti dirò che ti dona." },
  { when: [{ turned: 'guida' }, { trait: ['guida', '>', 0] }], t: "L'altra volta ragionavi su tutto. In questi giorni hai dato retta a quello che sentivi, e anche le tue risposte sono cambiate insieme a te." },
  { when: [{ turned: 'guida' }, { trait: ['guida', '<', 0] }], t: "L'altra volta andavi dietro a quello che sentivi. In questi giorni ti ho vista ragionare di più prima di rispondere, e non lo dico come un rimprovero." },

  once('jail1', { stat: ['jailed', '==', 1] }, "Ho saputo che hai passato una notte in cella. Qui capita alle migliori; l'importante è che tu sia tornata fuori a cercare, e a quanto vedo l'hai fatto."),
  once('jail3', { stat: ['jailed', '>=', 3] }, "In cella ci sei finita {stat:jailed} volte, ormai. Un'altra avrebbe lasciato perdere; tu ogni volta sei uscita e hai ricominciato da dove eri rimasta."),
  once('stun', { stat: ['stuns', '>=', 1] }, "Mi dicono che l'altra notte un conestabile è rimasto imbambolato in mezzo alla strada, senza sapere perché. Io non ho visto niente, sia chiaro."),
  once('clean', [{ stat: ['examsPassed', '>=', 4] }, { stat: ['examsFailed', '==', 0] }], "I conestabili ti hanno fermata {stat:exams} volte e non ti hanno mai colta in fallo. Devono cominciare a pensare che tu sia una ragazza molto istruita."),
  once('broom', { power: 'broom' }, "Mi hanno detto che adesso voli. Vista dall'alto, Salem dev'essere più piccola di come sembra a starci dentro."),

  once('torn.guida', { torn: 'guida' }, "Il cuore e la testa in te non riescono a mettersi d'accordo, e non è detto che debbano. Io intanto li ascolto tutti e due, perché dicono cose interessanti."),
  once('torn.rischio', { torn: 'rischio' }, "Un giorno ti butti e il giorno dopo conti i passi. Più ti guardo e più mi convinco che tu le battaglie te le scelga una per una."),
  once('torn.parola', { torn: 'parola' }, "Con te non so mai se arriverà la verità tutta intera o una risposta misurata. Ho tenuto il conto, e fai le due cose quasi alla pari."),
  once('torn.tono', { torn: 'tono' }, "Sai essere gentile e sai pungere, e scegli di volta in volta. Ho smesso di cercare la regola: mi pare che tu guardi semplicemente chi hai davanti."),
  once('torn.esplora', { torn: 'esplora' }, "Certi giorni giri per ore e certi altri vai dritta come un fuso. Non ho ancora capito quale dei due sia l'eccezione, e forse non lo sai nemmeno tu."),

  once('pair.bold-quiet', [hi('rischio'), lo('parola')], "Sei una che rischia, ma non dice mai una parola di troppo. È una combinazione rara, perché di solito chi si butta poi lo racconta a tutti."),
  once('pair.kind-frank', [hi('tono'), hi('parola')], "Dici le cose come stanno, e riesci a dirle con garbo. Non so dove tu l'abbia imparato, ma tienitelo stretto."),
  once('pair.kind-bold', [hi('tono'), hi('rischio')], "Hai coraggio e hai modi gentili, tutti e due insieme. Chi ti incontra vede prima i modi, e il coraggio lo scopre soltanto dopo."),
  once('pair.sharp-heart', [lo('tono'), hi('guida')], "Pungi, e intanto senti tutto. Ho idea che le spine ti servano a proteggere il resto."),
  once('pair.curious-careful', [hi('esplora'), lo('rischio')], "Guardi dappertutto, ma tocchi poco. Sei curiosa come un gatto e prudente come un gatto, e la cosa è meno contraddittoria di quanto sembri."),
  once('pair.frank-head', [hi('parola'), lo('guida')], "Ragioni, e poi dici quello che hai concluso senza girarci intorno. Con te si sa sempre a che punto si è, e da queste parti è raro."),

  once('st.esplora+', [{ steady: 'esplora' }, hi('esplora'), { trend: ['esplora', '>=', 1] }], "Anche stavolta hai girato mezza Salem prima di tornare da me. Ormai lo so e ti aspetto con calma: chi guarda dappertutto arriva tardi, ma arriva con più cose."),
  once('st.esplora-', [{ steady: 'esplora' }, lo('esplora'), { trend: ['esplora', '<=', -1] }], "Sei venuta dritta anche stavolta, senza guardarti intorno. È il tuo passo, l'ho capito: quando sai dove andare non ti distrae niente."),
  once('st.parola+', [{ steady: 'parola' }, hi('parola')], "Continui a non usare mezze parole, con me come con gli altri. Comincio a contarci: da te mi aspetto sempre la versione senza zucchero."),
  once('st.parola-', [{ steady: 'parola' }, lo('parola')], "Continui a pesare le parole prima di dirle, con me come con gli altri. Chi parla con te deve imparare ad ascoltare anche quello che non dici."),
  once('st.tono+', [{ steady: 'tono' }, hi('tono')], "Sei rimasta gentile anche in questi giorni, e Salem non aiuta. Non è una cosa da poco, perché la gentilezza che resiste in un posto così è quella vera."),
  once('st.tono-', [{ steady: 'tono' }, lo('tono')], "Hai ancora la lingua affilata, ho notato. Va bene così: qui c'è gente che una risposta per le rime se la merita da anni."),
  once('st.rischio+', [{ steady: 'rischio' }, hi('rischio')], "Continui a preferire la strada rischiosa a quella sicura, ho notato. Ormai non mi stupisco più: mi limito a tenere accesa la candela finché non torni."),
  once('st.rischio-', [{ steady: 'rischio' }, lo('rischio')], "Continui a muoverti con prudenza, e finora i fatti ti danno ragione. A Salem chi fa un passo alla volta arriva più lontano di chi corre."),
  once('st.guida+', [{ steady: 'guida' }, hi('guida')], "Decidi ancora col cuore, ho notato. Le carte con quelle come te parlano volentieri, perché non devono farsi strada tra troppi ragionamenti."),
  once('st.guida-', [{ steady: 'guida' }, lo('guida')], "Continui a ragionare su tutto prima di decidere. Alle carte farai domande difficili, e sono curiosa di sentire che cosa ti risponderanno."),

  // what she did in the scenes (flags of notes/paths.md): the Reader notices, she does not flatter
  once('candles', F('b1.candles'), "Mi hanno raccontato che in piazza ti sei chinata a raccogliere le candele di quella donna, davanti a tutti. Parlare è una cosa; chinarsi nella neve mentre ti guardano è un'altra, e mi interessa di più."),
  once('watched', F('b1.watched'), "In piazza sei rimasta zitta, ma mi dicono che hai guardato tutti in faccia, uno per uno. Chi tace e guarda così non sta scappando: sta prendendo nota, e vorrei sapere per che cosa."),
  once('bray', F('depot.bray'), "Dal deposito del tribunale è sparito un mazzo che non era né tuo né della tua amica. Non ti chiedo niente, perché non voglio sentirti mentire; mi limito a segnare che pensi anche alle carte degli altri."),
  once('honest', F('mill.honest'), "Hai riportato a Ortica quattro monete che potevi tenerti, e che nessuno ti avrebbe chiesto. Me lo segno, anche se non ho ancora deciso se è onestà o se ti piace avere i conti in ordine."),
  once('peeked', F('bundle.peeked'), "La prima sera hai slegato il fagotto di Malva per vedere che cosa portavi. Non lo dico per rimproverarti: una che vuole sapere che cos'ha in mano, davanti alle carte, parte avvantaggiata."),
  once('tabita', F('tabita.owes'), "Ho saputo che alla lavandaia hai lasciato le sue tre monete. Non erano molte, e proprio per questo mi dice qualcosa: è nelle somme piccole che si vede come una persona fa i conti."),
  once('tartufo', { tartufo: 3 }, "Quel gatto ti viene dietro anche quando non hai niente in mano, mi dicono. Tartufo non si è mai affezionato a nessuna, quindi o sei cambiata tu o è cambiato lui, e io scommetterei su di te."),
  once('pop', { pop: 2 }, "Il tuo nome ormai gira per Salem, e arriva anche qui prima di te. Chi viene letta da te ne parla bene, e vorrei capire che cosa trova al tuo tavolo che non trova al mio."),
  once('malva', { trust: ['malva', '>=', 2] }, "Ho saputo che Malva ha cominciato a fidarsi di te. Lei non te lo dirà mai, e proprio per questo te lo dico io."),
  once('ortica', { trust: ['ortica', '>=', 2] }, "Ortica parla bene di te. Lei parla di tutti, è vero, ma quando parla bene di qualcuna è una notizia."),
  once('edera', { trust: ['edera', '>=', 2] }, "Edera si fida di te, anche se il tuo nome continua a sfuggirle. Da lei è il massimo che si possa avere."),
  once('readings', { stat: ['readings', '>=', 5] }, "Hai già letto le carte a {stat:readings} persone, e la voce comincia a girare. Tra poco verranno a bussare anche quelle che dicono di non crederci."),
  once('locks', { stat: ['locks', '>=', 3] }, "Ho saputo che hai aperto {stat:locks} serrature senza avere nessuna chiave. A Salem, per certe porte, conta più quello che sai di quello che hai in tasca."),
  once('fires', { stat: ['fires', '>=', 3] }, "Da quando sai fare luce, nel buio ci entri senza pensarci due volte: l'hai fatto già {stat:fires} volte. Non tutte, quando possono vedere, hanno poi voglia di guardare."),
  once('passed', { stat: ['examsPassed', '>=', 4] }, "Ai conestabili ormai rispondi senza scomporti: te la sei cavata {stat:examsPassed} volte. Sono curiosa di vedere se con me sei altrettanto pronta."),
  once('coins', { coinsMin: 30 }, "Vedo che la borsa comincia a pesare: {coins} monete, se ho contato bene. Leggere le carte non ha mai arricchito nessuna, ma a quanto pare ti dà da vivere."),

  { when: { chapterMax: 1 }, t: "Bentornata: hai le scarpe bagnate di neve e qualche carta in più dell'altra volta, e delle due cose mi interessa la seconda." },
  { when: { chapter: 2 }, t: "Bentornata: ti porti addosso l'odore del bosco, e in mano hai qualche carta che l'altra volta non avevi." },
  { when: { chapter: 3 }, t: "Bentornata: vieni dal buio delle cantine, e vedo che anche da là sotto sei riuscita a portarmi delle carte nuove." },
  { when: true, t: "Siediti, perché ho visto che hai qualcosa di nuovo da farmi vedere. Mettilo pure sul tavolo, con calma." },
];

// ---- the long thread: what she said earlier, set against what happened since --------------------
// A queue: each is said once, in this order, inside its chapter. None may hold: then nothing is said.
const DOOR = "La prima sera mi hai detto che davanti a una porta chiusa";
export const THREAD = [
  once('door', [{ chapterMax: 1 }, F('s0.knock'), lo('esplora')], `${DOOR} bussi. In questi giorni ti ho vista fare lo stesso con Salem: vai dove devi andare, senza girarci intorno.`),
  once('door', [{ chapterMax: 1 }, F('s0.knock'), hi('esplora', 2)], `${DOOR} bussi. Da quando sei arrivata, però, alle case di Salem giri intorno più di quanto ci entri. Non è una critica: mi incuriosisce.`),
  once('door', [{ chapterMax: 1 }, F('s0.window'), hi('esplora')], `${DOOR} cerchi una finestra. Ti credo, perché da quando sei arrivata guardi dappertutto prima di deciderti.`),
  once('door', [{ chapterMax: 1 }, F('s0.window'), lo('esplora', -2)], `${DOOR} cerchi una finestra. Qui a Salem però vai dritta alle porte, e mi chiedo quale delle due sia quella vera.`),
  once('door', [{ chapterMax: 1 }, F('s0.knock')], `${DOOR} bussi. Me lo sono segnato, e da allora faccio caso a come entri nei posti.`),
  once('door', [{ chapterMax: 1 }, F('s0.window')], `${DOOR} cerchi una finestra. Me lo sono segnato, e da allora faccio caso a come entri nei posti.`),

  once('door2', [{ chapterMax: 1 }, F('s0.enter'), { stat: ['exams', '>=', 1] }], "Mi avevi anche detto che in una casa entri pure quando sarebbe più comodo non farlo. So che i conestabili ti hanno già fermata e che la notte esci lo stesso: direi che è la stessa cosa."),
  once('door2', [{ chapterMax: 1 }, F('s0.enter')], "Mi avevi anche detto che in una casa entri pure quando sarebbe più comodo non farlo. Con le carte ti servirà, perché le più interessanti stanno sempre dove non conviene andare."),
  once('door2', [{ chapterMax: 1 }, F('s0.back'), { stat: ['readings', '>=', 1] }], "Mi avevi anche detto che lasci in pace chi vuole restare solo. Intanto però hai cominciato a leggere le carte a chi bussa da te, che è un bel modo di non lasciare sola la gente."),
  once('door2', [{ chapterMax: 1 }, F('s0.back')], "Mi avevi anche detto che lasci in pace chi vuole restare solo. È una delicatezza che qui hanno in poche, e spero che Salem non te la tolga."),
  once('door2', [{ chapterMax: 1 }, F('s0.wait')], "Mi avevi anche detto che davanti a una porta che non si apre resti ad aspettare. Con le carte ti servirà, perché quasi nessuna si lascia capire la prima volta."),
  once('door2', [{ chapterMax: 1 }, F('s0.leave')], "Mi avevi anche detto che dove non ti aprono non insisti. Con le carte ti chiederò il contrario: quando una non ti dice niente, è proprio lì che conviene restare."),

  once('value', [{ chapter: 2 }, F('leaf.value.m11'), F('lied.constable')], "L'altra volta mi hai detto che vuoi accanto chi ti dice le cose come stanno. Mi è tornato in mente il conestabile a cui hai raccontato che eri di passaggio: la sincerità, vedo, la riservi a chi se la merita."),
  once('value', [{ chapter: 2 }, F('leaf.value.m11')], "L'altra volta mi hai detto che vuoi accanto chi ti dice le cose come stanno. Me lo sono segnato, e d'ora in poi con te farò lo stesso, anche quando non ti farà piacere."),
  once('value', [{ chapter: 2 }, F('leaf.value.m19'), { trust: ['ginepra', '>=', 2] }], "L'altra volta mi hai detto che vuoi accanto chi ti fa ridere. Adesso capisco perché tu e Ginepra, che ride sempre nei momenti sbagliati, alla fine vi siete trovate."),
  once('value', [{ chapter: 2 }, F('leaf.value.m19')], "L'altra volta mi hai detto che vuoi accanto chi ti fa ridere. Nel bosco c'è meno da ridere che in paese, ma ho idea che tu il modo lo trovi lo stesso."),
  once('value', [{ chapter: 2 }, F('leaf.value.m01'), { spread: 'ppf' }], "L'altra volta mi hai detto che una sera libera la usi per imparare qualcosa. Ortica ti ha appena insegnato a leggere tre carte in fila, quindi le tue sere sono sistemate per un pezzo."),
  once('value', [{ chapter: 2 }, F('leaf.value.m00')], "L'altra volta mi hai detto che una sera libera ti piace lasciarla vuota. Da quando sei nel bosco di sere vuote ne hai avute poche, e mi chiedo se ti manchino."),

  once('square', [{ chapter: 2 }, F('b1.spoke'), hi('rischio', 2)], "Ripenso ogni tanto alla piazza. Quella sera hai parlato davanti a tutti, e da allora ti guardo per capire se è stata un'eccezione: per ora direi proprio di no."),
  once('square', [{ chapter: 2 }, F('b1.spoke'), lo('rischio', -2)], "Ripenso ogni tanto alla piazza. Quella sera hai parlato davanti a tutti, e da allora invece ti muovi con molta prudenza: forse una volta ti è bastata, e ti capisco."),
  once('square', [{ chapter: 2 }, F('b1.hid'), hi('rischio', 2)], "Ripenso ogni tanto alla piazza, dove sei rimasta in disparte. Da allora ti ho vista rischiare più di una volta, e comincio a pensare che quella sera stessi soltanto prendendo le misure."),
  once('square', [{ chapter: 2 }, F('b1.hid'), lo('rischio', -2)], "Ripenso ogni tanto alla piazza, dove sei rimasta in disparte. Da allora hai continuato a muoverti con prudenza, quindi quella sera eri proprio tu: una che prima guarda."),

  once('fear', [{ chapter: 3 }, F('leaf.fear.m18'), { stat: ['fires', '>=', 1] }], "L'altra volta mi hai detto che un rumore che non capisci vai a vedere che cos'è. Sotto il villaggio di rumori così ce ne sono tanti, e tu ci sei scesa con la tua luce: direi che eri sincera."),
  once('fear', [{ chapter: 3 }, F('leaf.fear.m18')], "L'altra volta mi hai detto che un rumore che non capisci vai a vedere che cos'è. Sotto il villaggio ne sentirai parecchi, e sono curiosa di sapere se lo farai anche lì."),
  once('fear', [{ chapter: 3 }, F('leaf.fear.m16')], "L'altra volta mi hai detto che non ti piace farti cogliere impreparata. Là sotto è difficile non esserlo, eppure ci sei scesa: vedo che certe paure ti rallentano e non ti fermano."),
  once('fear', [{ chapter: 3 }, F('leaf.fear.m06')], "L'altra volta mi hai detto che ti pesa il silenzio di una persona che non risponde. Da quando hanno portato via Ginepra ne hai uno addosso, e stai facendo l'unica cosa sensata: andare a riprenderla."),
  once('fear', [{ chapter: 3 }, F('leaf.fear.m09')], "L'altra volta mi hai detto che ti pesa una casa dove non c'è nessuno. Senza Ginepra che passa a disturbare il cottage dev'essere più silenzioso, e ho idea che sia anche per questo che la vuoi fuori."),

  once('notebook', [{ chapter: 3 }, { not: { word: ['value', null] } }, { not: { word: ['fear', null] } }], "Prima che arrivassi ho riletto il quaderno. Di te c'è scritto «{word:value}» alla voce di quello che conta, e «{word:fear}» alla voce della paura. Ne manca ancora una, e la riempiremo presto."),
];

// ---- the small ritual of the visit, after the cards ---------------------------------------------
// Her sign (once each: element in the village, ruler and weekday in the forest), then cards read
// together: an image that returns in three of her cards, or two cards that explain each other.
const RULER = "Il tuo segno ha un pianeta che lo governa, ed è";
const DAY = "Ho fatto un conto sulla tua data, e sei nata di";
const pair = (a, b, t) => once(`pair.${a}${b}`, both(a, b), t);
export const RITUALS = [
  once('element', [{ chapterMax: 1 }, { element: 'Fuoco' }], "Ho ripensato alla tua data. Il tuo segno, {sign}, è un segno di Fuoco, e il Fuoco nelle carte è la voglia di fare: chi ce l'ha comincia le cose volentieri, e la pazienza se la deve guadagnare."),
  once('element', [{ chapterMax: 1 }, { element: 'Acqua' }], "Ho ripensato alla tua data. Il tuo segno, {sign}, è un segno d'Acqua, e l'Acqua nelle carte è quello che si sente prima di capirlo. Tienilo a mente quando una figura ti colpisce senza che tu sappia dire perché."),
  once('element', [{ chapterMax: 1 }, { element: 'Aria' }], "Ho ripensato alla tua data. Il tuo segno, {sign}, è un segno d'Aria, e l'Aria nelle carte sono i pensieri e le parole. Chi nasce così le carte vuole capirle; io ogni tanto ti chiederò soltanto di guardarle."),
  once('element', [{ chapterMax: 1 }, { element: 'Terra' }], "Ho ripensato alla tua data. Il tuo segno, {sign}, è un segno di Terra, e la Terra nelle carte sono le cose che si possono toccare. Chi nasce così impara facendo, quindi con te parlerò poco e ti farò leggere molto."),

  once('ruler', [{ chapter: 2 }, signIn('ariete', 'scorpione')], `${RULER} Marte. Nelle carte Marte è La Torre: non badare al disegno, vuol dire che in te c'è abbastanza forza da buttare giù quello che non regge più.`),
  once('ruler', [{ chapter: 2 }, signIn('toro', 'bilancia')], `${RULER} Venere. Nelle carte Venere è L'Imperatrice, che ama le cose belle e fatte con cura, e non mi stupirebbe che le amassi anche tu.`),
  once('ruler', [{ chapter: 2 }, signIn('gemelli', 'vergine')], `${RULER} Mercurio. Nelle carte Mercurio è Il Mago: la mente svelta, e la parola giusta al momento giusto. È un buon pianeta per chi deve imparare a leggere le carte agli altri.`),
  once('ruler', [{ chapter: 2 }, signIn('cancro')], `${RULER} la Luna. Nelle carte la Luna è La Sacerdotessa, quella che sa le cose senza che nessuno gliele dica. Vuol dire che di certe tue impressioni ti puoi fidare.`),
  once('ruler', [{ chapter: 2 }, signIn('leone')], `${RULER} il Sole. Nelle carte ha una carta tutta sua, la più luminosa del mazzo: chi nasce sotto di lui fa fatica a passare inosservata, anche quando vorrebbe.`),
  once('ruler', [{ chapter: 2 }, signIn('sagittario', 'pesci')], `${RULER} Giove. Nelle carte Giove è La Ruota della Fortuna: è un pianeta largo di maniche, e a chi governa regala la convinzione che alla fine le cose girino dalla parte giusta.`),
  once('ruler', [{ chapter: 2 }, signIn('capricorno', 'acquario')], `${RULER} Saturno. Nelle carte Saturno è Il Mondo, l'ultima del mazzo: è il pianeta della pazienza, e a chi governa insegna a portare le cose fino in fondo.`),

  once('day', [{ chapter: 2 }, { bornOn: 'lunedì' }], `${DAY} lunedì. È il giorno della Luna, lo dice il nome: nelle carte è La Sacerdotessa, e a chi nasce quel giorno si attribuisce da sempre un buon intuito.`),
  once('day', [{ chapter: 2 }, { bornOn: 'martedì' }], `${DAY} martedì. È il giorno di Marte, lo dice il nome: nelle carte è La Torre, e di chi nasce quel giorno si dice che non lasci le cose come le ha trovate.`),
  once('day', [{ chapter: 2 }, { bornOn: 'mercoledì' }], `${DAY} mercoledì. È il giorno di Mercurio, lo dice il nome: nelle carte è Il Mago, e di chi nasce quel giorno si dice che con le parole se la cavi sempre.`),
  once('day', [{ chapter: 2 }, { bornOn: 'giovedì' }], `${DAY} giovedì. È il giorno di Giove, lo dice il nome: nelle carte è La Ruota della Fortuna, e di chi nasce quel giorno si dice che si aspetti il meglio, e che spesso lo trovi.`),
  once('day', [{ chapter: 2 }, { bornOn: 'venerdì' }], `${DAY} venerdì. È il giorno di Venere, lo dice il nome: nelle carte è L'Imperatrice, e di chi nasce quel giorno si dice che sappia farsi voler bene.`),
  once('day', [{ chapter: 2 }, { bornOn: 'sabato' }], `${DAY} sabato. È il giorno di Saturno, anche se in italiano il nome non lo dice più: nelle carte è Il Mondo, e di chi nasce quel giorno si dice che finisca quello che comincia.`),
  once('day', [{ chapter: 2 }, { bornOn: 'domenica' }], `${DAY} domenica. È il giorno del Sole, e in certe lingue si chiama ancora così: nelle carte è Il Sole, e di chi nasce quel giorno si dice che porti un po' di luce dove va.`),

  once('three.pillars', both('m02', 'm05', 'm11'), "Tra le tue carte ce ne sono già tre con una figura seduta tra due colonne: La Sacerdotessa, Il Papa e La Giustizia. Quando un'immagine torna così, il mazzo ti sta dicendo che chi siede lì custodisce una soglia."),
  once('three.angels', both('m06', 'm14', 'm20'), "Tra le tue carte ci sono già tre angeli: quello degli Amanti, quello della Temperanza e quello del Giudizio. Il primo benedice una scelta, il secondo la cura, il terzo chiama a renderne conto."),
  pair('m16', 'm17', "Hai sia La Torre sia La Stella, che nel mazzo vengono una dopo l'altra. Tienile vicine: prima crolla quello che non reggeva e poi torna la calma, e la seconda non arriva mai senza la prima."),
  pair('m06', 'm15', "Metti vicini Gli Amanti e Il Diavolo e guardali bene, perché sono le stesse due persone. Nella prima carta scelgono liberamente, nella seconda si sono lasciate legare, e la differenza sta tutta nelle catene."),
  pair('m02', 'm18', "Hai La Sacerdotessa e La Luna, e in tutte e due c'è la luna: sotto i piedi dell'una, in cielo nell'altra. La prima la tiene a bada in silenzio, mentre la seconda ti ci fa camminare sotto."),
  pair('m14', 'm17', "La Temperanza e La Stella versano tutte e due dell'acqua. L'angelo la passa da una coppa all'altra senza perderne una goccia, mentre la donna la lascia andare senza contarla: sono due modi di dare, e servono entrambi."),
  pair('m09', 'm12', "L'Eremita e L'Appeso sono i due solitari del mazzo. Uno si allontana per cercare e l'altro resta fermo perché non può fare altro, e tutti e due alla fine vedono qualcosa che gli altri non vedono."),
  pair('m02', 'm11', "La Sacerdotessa e La Giustizia siedono tutte e due tra due colonne, con un velo alle spalle. La prima custodisce quello che non si dice, mentre la seconda sta lì apposta per dirlo."),
  pair('m01', 'm08', "Guarda sopra la testa del Mago e sopra quella della Forza: c'è lo stesso segno, l'otto coricato. Lui lo usa per fare e lei per resistere, e tutti e due attingono a qualcosa che non finisce."),
  pair('m07', 'm08', "Il Carro e La Forza stanno vicini nel mazzo e parlano della stessa cosa da due lati. Lui tiene a bada due sfingi con la volontà, lei un leone con la dolcezza, e conviene saper fare tutte e due le cose."),
  pair('m03', 'm04', "L'Imperatrice e L'Imperatore vanno letti in coppia. Lei fa crescere le cose e lui dà loro una forma: quando in una lettura ne esce uno solo, vale la pena chiedersi dov'è finito l'altro."),
  pair('m02', 'm05', "La Sacerdotessa e Il Papa siedono tutti e due tra due colonne, ma fanno mestieri opposti. Lei sa e tace, mentre lui sa e insegna a voce alta a chi gli si inginocchia davanti."),
  pair('m04', 'm05', "L'Imperatore e Il Papa sono i due che comandano, uno con le regole e l'altro con gli insegnamenti. Quando escono insieme qualcuno ti sta dicendo che cosa devi fare, e sta a te decidere se ascoltarlo."),
  pair('m00', 'm01', "Il Matto e Il Mago sono le prime due carte, e conviene guardarle insieme. Il primo parte senza niente e il secondo ha già tutto sul tavolo: tra l'uno e l'altro c'è soltanto la decisione di cominciare."),
];

// ---- the last line: the verdict on her card -------------------------------------------------------
// When her card moved since the last verdict she says why (what changed since the last encounter)
// and names the new one; otherwise she confirms the old one. `then` records it ({ do: 'verdict' }).
const like = { observe: Object.entries(LIKE).map(([id, t]) => ({ when: { yourCard: id }, t })) };
const verdict = { do: 'verdict' };
const CHANGED = "Prima che tu vada, devo dirti che ho cambiato idea. L'altra volta eri {lastVerdict};";
const changed = (axis, pole) => ({
  when: [{ verdict: 'changed' }, { trend: [axis, pole === 'plus' ? '>=' : '<=', pole === 'plus' ? 2 : -2] }],
  t: `${CHANGED} ${VERDICTS.shift[axis][pole]}, e stanotte ti vedo {yourCard}.`,
  then: [like, verdict],
});
const same = (id, when, t) => once(`same.${id}`, [{ verdict: 'same' }, ...[].concat(when)], t, [verdict]);
export const CLOSERS = [
  ...Object.keys(VERDICTS.shift).flatMap((axis) => [changed(axis, 'plus'), changed(axis, 'minus')]),
  { when: { verdict: 'changed' }, t: `${CHANGED} non è successa una cosa sola, sono tante piccole cose messe insieme, e stanotte ti vedo {yourCard}.`, then: [like, verdict] },
  same('1a', { chapterMax: 1 }, "Prima che tu vada: l'altra volta ti avevo detto che eri {lastVerdict}. Ti ho guardata bene anche stasera, e lo penso ancora."),
  same('1b', { chapterMax: 1 }, "Te ne vai, e io resto dell'idea dell'altra volta: per me sei ancora {lastVerdict}. Non è testardaggine, è che finora mi dai ragione."),
  same('2a', { chapter: 2 }, "Prima che tu torni nel bosco: per me sei ancora {lastVerdict}, come ti avevo detto. Comincio a pensare di averci visto giusto, ma non lo dico troppo forte."),
  same('2b', { chapter: 2 }, "Ti lascio andare con la stessa carta dell'altra volta, {lastVerdict}. Se cambierai me ne accorgerò prima io di te, perché è il mio mestiere."),
  same('3a', { chapter: 3 }, "Prima che tu scenda di nuovo là sotto: per me sei ancora {lastVerdict}. Il buio cambia molte persone, e sono curiosa di vedere se cambierà anche te."),
  same('3b', { chapter: 3 }, "Sei ancora {lastVerdict}, e ormai te lo dico senza guardare il quaderno. Adesso vai, perché hai una cosa importante da fare."),
  { when: { verdict: 'same' }, t: "Per stanotte ci fermiamo qui. Per me resti {lastVerdict}, finché non mi dimostri il contrario.", then: [verdict] },
  { when: true, t: "Per stanotte ci fermiamo qui. Le carte che ti ho raccontato tienile vicine per qualche giorno, e guarda se ti capita di riconoscerle in giro." },
];
