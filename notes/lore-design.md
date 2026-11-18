# Lore, metà design: cosa ne esce

Il vault: `lore/metodo/principi` (16), `lore/metodo/meccaniche` (27, più `_matrice`), `lore/metodo/tecniche` (14), `lore/corso/obiettivi` (14).
Fonti delle tecniche in `docs/RESEARCH.md`, «Tecniche di apprendimento».

## a) Obiettivi che nessuna meccanica verifica

- **Leggere il suo mazzo da sola.** Le due letture con le carte vere non hanno punteggio: il gioco non sa se lei ci riesce.
- **Dire l'idea con parole sue.** Tutto è a scelta tra tre o quattro. Le tre parole sue non tornano mai.
- **Unire le carte.** Il colpo d'occhio si mostra, non si chiede.
- **Rispondere con garbo.** La scelta del tono è stata tolta (`consult.js`, `tone = null`).
- **Storia dei tarocchi.** Si legge, non si chiede mai.
- **Riconoscere una pianta.** Nell'erbario basta guardarla.
- **Decidere con una carta** si verifica solo dentro prove e Altrove.

## b) Tecniche poco usate, e il posto più economico

- **Generazione** (solo le tre parole): nel ripasso, «Le tue parole erano: … Che carta è?». I dati sono già nel salvataggio.
- **Autospiegazione** (mai chiesta): nella lettura per sé, una riga sua per carta prima del testo del motore.
- **Luoghi** (il posto di ogni carta non torna): sulla mappa del grimorio, la carta a matita dove l'ha trovata.
- **Analogia** (strega = carta, mai usata): una domanda nel ripasso, «Quale strega somiglia a questa carta?».
- **Spaziatura nella carta di oggi**: la risposta «Senza guardare» chiama `answer()` se la carta è sua. Una riga in `ui/daycard.js`.
- **Alternanza**: un argomento in biblioteca «carte che si confondono», con le `confusables` delle schede.

## c) Meccaniche senza un perché didattico

- **Comprare carte in bottega**: salta la ricerca e non insegna. Proposta: la carta si compra solo rispondendo a una domanda su di lei.
- **Leggere col mazzo vero dal grimorio** (`systems/free.js`) fa la stessa cosa di «Leggi le tue carte»: tenerne una sola, con il «Prova tu prima» dell'una e il diario dell'altra.
- **La dispensa dell'orto**: i mazzetti non servono ancora a niente.
- **«Che ne pensi di lei?», Tartufo, il volo, la luna**: non insegnano carte, ma servono il ritratto o il «mai assillare». Vanno bene così; al massimo agganciarli alle carte che le persone incarnano.

## d) Principi che il gioco rompe oggi

- **I personaggi non spiegano**: Malva nella lezione di volo spiega come usare la mappa del quaderno (`data/story/scripts/lessons.js`, `fly.lesson`). Tartufo alla fine del ripasso: «Ripassare è come fare le fusa» (`systems/review.js`).
- **Il testo è la chiave**: righe della Lettrice alla luna piena, «Non serve leggere tanto. Serve tornare.» e «Sette spicchi, una luna.» (`glue/threshold.rules.js`): frasi a effetto, e spiegano il gioco.
- **Prima di tutto corretto**: il messaggio della carta del giorno dice che «chi la vede in una lettura paga di più» (`glue/day.js`), ma il motore nuovo non lo fa (`payOf` in `systems/consult.rules.js`).
- **La domanda non mostra la risposta** (in parte): «Ricordamela» mostra le parole della carta prima della scelta e non costa niente (`systems/consult.js`).
- **Pochi concetti**: fiducia e legame sono due numeri per la stessa cosa; gli aiuti al processo guardano la fiducia (`trusts` in `core/progress.js`), il grimorio il legame (`core/witches.js`). E due schermate per il mazzo vero (sopra).
- **Le carte servono a muoversi**: chiedere alle carte nel mondo non c'è; `trial.ask` è pronto ma nessuno lo chiama, e le streghe tirano carte solo nelle prove.

## e) Le cinque proposte migliori

1. **Le tue parole tornano.** Nel ripasso, le sue tre parole come indizio per il nome. Generazione e recupero insieme, a costo quasi zero.
2. **Prova tu prima, anche per sé.** Nella lettura per sé lei sceglie l'idea di ogni carta prima di vedere il testo. È il passo che manca verso il mazzo vero.
3. **Chiedere alle carte per strada.** Tre o quattro bivi piccoli nel mondo (una porta, due sentieri) con `trial.ask`. Il servizio esiste già.
4. **La Lettrice chiede, prima di raccontare.** In ogni visita, una carta della volta prima: «Ti ricordi che cosa ti avevo detto del Carro?». Recupero dentro la scena più amata.
5. **La carta di oggi entra nel ripasso.** La risposta a memoria aggiorna la carta; una volta su tre la carta di oggi è una di quelle scadute.
