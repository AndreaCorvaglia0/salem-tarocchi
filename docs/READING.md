# Il motore di lettura

Progetto del 16 novembre 2026. Stato: approvato come direzione, non ancora costruito.
La lettura è l'attività vera del gioco, come il combattimento in un gioco di ruolo: gli esercizi
(dettaglio che colpisce, tre parole, ripasso, Esami) servono tutti a leggere meglio.

## Il problema

Oggi una lettura restituisce il significato della carta, che con la domanda del cliente non c'entra.
Serve un motore che, data una richiesta e delle carte (dritte o rovesciate) in una stesa, componga
una lettura vera: legata alla domanda, alla posizione e alle altre carte.

## L'idea in tre pezzi

1. **La richiesta ha due etichette.**
   - Ambito: `amore`, `lavoro` (lavoro e denaro), `casa` (casa e famiglia), `altri` (amici, vicini, il paese), `se` (sé stessa, la strada).
   - Forma: `sino`, `scelta`, `andra` (come andrà), `perche`, `fare` (cosa fare), `quadro` (nessuna domanda).
   - 30 richieste tipo. Si raggiungono con due o tre domande secche (albero): così le fa anche la giocatrice.
   - Dettagli facoltativi copiati dalla domanda alla risposta: `cosa` ("il campo"), `chi` ("tuo marito"), `quando` ("prima dell'estate").
2. **Ogni carta parla in ogni ambito, dritta e rovesciata.** L'unità di scrittura è la **frase intera**,
   non il frammento: per carta × orientamento × ambito si scrive una frase per ciascun ruolo.
   - Ruoli: `situazione`, `origine`, `ostacolo`, `arrivo`, `consiglio`.
   - Le dieci posizioni della croce celtica si riducono a questi cinque ruoli (tabella in `spreads`).
   - In più due valori per carta e orientamento: `favore` (-2..+2) e `moto` (inizia, cresce, ferma, chiude, torna).
3. **Il motore cuce.** Sceglie le frasi dai ruoli, mette i legami tra una carta e l'altra in base ai
   valori (contrasto: "adesso però"; continuità: "e infatti"; causa: "per questo"), aggiunge il colpo
   d'occhio, chiude rispondendo secondo la forma della domanda.

Volume: 78 carte × 2 orientamenti × 5 ambiti × 5 ruoli = 3900 frasi. Si scrivono per carta, da un
agente che ha davanti la scheda della carta: così il significato resta fedele.

## Il colpo d'occhio

Prima di leggere si conta (Theresa Reed, "scan and count"):
- Maggiori in maggioranza: forze grandi, meno controllo.
- Seme dominante: l'ambito più attivo. Seme estraneo alla domanda: la questione è un'altra.
- Seme assente: quello che manca alla situazione.
- Numeri ripetuti: il significato del numero (assi inizi, due scelte, ... dieci compimenti).
- Molte figure: troppe persone coinvolte.
- Molte rovesciate: energia trattenuta, cose non dette.

Produce una o due frasi nella lettura (solo da tre carte in su) e i consigli per la giocatrice.

## Dritta e rovesciata

Rovesciata non è "il contrario": è la stessa energia bloccata, tenuta dentro, in ritardo, o in eccesso.
Nel gioco le rovesciate arrivano con una lezione al capitolo 2. Prima, tutte dritte.

## Cosa fa la giocatrice

1. Ascolta la richiesta e la riformula (la classifica). Alcune si rifiutano: chi ha sbagliato porta,
   chi vuole il malocchio al vicino, chi chiede di morti e malattie.
2. Per ogni carta sceglie l'interpretazione giusta tra tre. Le sbagliate le genera il motore:
   orientamento sbagliato, ambito sbagliato, ruolo sbagliato, carta confondibile.
3. Dà la risposta finale. Può dirla **con garbo o male**: non cambia il contenuto, cambia la reazione
   del cliente e il ritratto (tratto `tono`).
4. Il cliente reagisce. Lettura corretta: esperienza, monete, **popolarità**.

## La voce viva (facoltativa)

La pagina può chiedere a Claude di riscrivere il testo (capacità `sample` degli artefatti). Si usa
così, e solo così:
- Il motore decide **cosa** dire (carte, ruoli, valori, colpo d'occhio, verdetto). Il modello cambia
  solo **come**: riceve il piano e la domanda scritta da lei, restituisce la lettura in prosa.
- Solo nella lettura per sé, dove lei può scrivere la domanda con parole sue.
- Se la capacità manca (non concessa, senza rete), esce il testo del motore. Il gioco non ne dipende mai.
- Non verificato: se funziona per chi apre la pagina dal link pubblico.

## Le declinazioni

- **Clienti generati**: mestiere, situazione e domanda da modelli con dettagli variabili. All'inizio
  poveri e ridicoli, poi più seri. Quelli della storia restano scritti a mano, con ambito e forma.
- **Per strada**: chi è già venuto ti riconosce e chiede sottovoce una lettura a una carta.
- **Lettura per sé e diario**: tema scelto con l'albero (o scritto a mano, con la voce viva), carte
  coperte scelte d'istinto, lettura salvata con data e nota sua. Oppure inserimento delle carte vere
  pescate a casa. La Lettrice spiega perché da lontano si vede meno.

## Software

- `src/reading/`: funzioni pure, senza interfaccia. `ask.js` (richiesta e albero), `scan.js` (colpo
  d'occhio), `plan.js` (ruoli, legami, verdetto), `say.js` (testo), `wrong.js` (alternative sbagliate),
  `clients.js` (generatore).
- `src/data/reading/`: `voices/<carta>.js` (le frasi), `frames.js` (legami, aperture, chiusure),
  `people.js` (mestieri, situazioni, dettagli).
- Controlli: test di copertura (ogni carta ha tutte le frasi), regole di forma sulle frasi, script che
  genera migliaia di letture e segnala ripetizioni e lunghezze, campioni riletti da un agente.

## Fasi

1. Motore, 22 Maggiori, una e tre carte, sui clienti che ci sono già. Popolarità.
2. Minori (lezione chiave), rovesciate, colpo d'occhio, clienti generati, rifiuti.
3. Diario, lettura per sé, voce viva, letture per strada.

## Limiti

- Dopo molte letture si riconosce la forma: si attenua con varianti, non sparisce.
- Il motore non capisce una domanda scritta a mano: per questo c'è l'albero (e la voce viva dove c'è).
- I significati vengono dalla tradizione Rider-Waite-Smith; il confronto riga per riga col libro resta da fare.

## Contratto dei dati (per chi scrive codice e frasi)

```js
// src/data/reading/voices/<id>.js   (id: m00..m21, w/c/s/p 01..14)
export default {
  id: 'c05',
  up:  { favore: -1, moto: 'chiude',            // favore -2..2; moto: inizia|cresce|ferma|chiude|torna
         amore: { situazione, origine, ostacolo, arrivo, consiglio },   // cinque frasi
         lavoro: {...}, casa: {...}, altri: {...}, se: {...} },
  rev: { favore: 0, moto: 'torna', amore: {...}, lavoro: {...}, casa: {...}, altri: {...}, se: {...} },
};
```

Regole di forma di una frase (le controlla un test):
- Frase intera, rivolta a chi chiede con il tu, tra 9 e 26 parole, con il punto finale.
- Comincia con il verbo o con il soggetto, mai con un avverbio di tempo o di luogo e mai con
  "ma", "e", "però", "invece": il motore può metterle davanti "Nel passato", "Adesso però", "Più avanti".
  Deve reggere sia da sola (con la maiuscola) sia dopo uno di questi attacchi (con la minuscola).
- Tempi: `origine` al passato; `situazione` e `ostacolo` al presente; `arrivo` al futuro o al presente
  di chi vede arrivare; `consiglio` all'imperativo con il tu.
- Non nomina la carta, non dice "la carta", "le carte", "questa posizione". Parla della vita di chi chiede.
- Niente dettagli che la domanda non ha (nomi, mestieri, oggetti): quelli li mette il motore.
- Vale tutto `docs/WRITING.md`: naturale, piana, niente frasi a effetto.

Domanda: `{ ambito, forma, ref?: { di: 'del campo', chi?: 'tuo marito' } }`.
Carta stesa: `{ pos, card, rev }`. Ruolo di ogni posizione: tabella `ROLE` in `src/reading/plan.js`.

## Come si scrive una voce

Il modello è `src/data/reading/voices/c05.js` (Cinque di Coppe). Oltre alle regole di forma:

- **Chi chiede può essere chiunque.** Mai aggettivi o participi che gli danno un genere: non
  "ti sei accorta", "sei stanco", "ti senti sola". Si gira la frase: "hai capito", "ti pesa la stanchezza",
  "ti senti in disparte".
- **Ogni frase dice una cosa della vita, non della carta.** Prima si pensa a cosa vuol dire quella
  carta, in quel verso, per quell'ambito e in quel ruolo; poi lo si dice come lo direbbe una persona
  seduta davanti a te. Niente simboli ("le coppe rovesciate"), niente parole chiave messe in fila.
- **L'ambito cambia la sostanza, non una parola.** La frase d'amore e quella di lavoro della stessa
  carta devono essere due osservazioni diverse, non la stessa con un nome sostituito.
- **Il ruolo cambia il tempo e l'angolo.** `origine` racconta un fatto già successo; `situazione` dice
  com'è adesso; `ostacolo` nomina che cosa frena (comincia spesso con "Ti frena", "Ti pesa", "Ti
  trattiene", "Resta"); `arrivo` dice che cosa viene; `consiglio` dà una cosa da fare, concreta.
- **Rovesciata** è la stessa energia trattenuta, in ritardo, rivolta all'interno o esagerata: mai un
  semplice "non". Per le carte dure, rovesciata è spesso il sollievo; per le carte felici, la fatica a goderne.
- **Concreto ma aperto.** "Un affare andato male", "un posto a tavola": abbastanza preciso da sembrare
  vero, abbastanza largo da valere per chiunque. Mai nomi, mestieri, oggetti della domanda.
- **`favore`** dice quanto la carta, in quel verso, aiuta chi chiede (-2 molto contraria … +2 molto
  favorevole). **`moto`** dice che cosa fa alla storia: `inizia`, `cresce`, `ferma`, `chiude`, `torna`.
- Dentro la stessa carta non si ripete lo stesso attacco più di tre volte per verso, e non si ripete
  la stessa immagine in due ambiti.

## Il livello, dopo la prima lettura dei campioni (16 novembre)

Riscontro di Andrea: il gioco insegna, e chi gioca è alle prime armi. Quindi:

- **Livello superficiale.** Le letture dicono cose di massima: andrà bene, andrà male, dipende, un consiglio. Si può perdere specificità.
- **Il legame con la carta si deve sempre vedere.** Chi gioca ricorda poche cose di una carta e deve capire come quelle poche cose cambiano con la domanda.
- **Ogni carta ha un'`essenza`**: la sua idea in poche parole, dritta e rovesciata ("Una perdita, e il rimpianto." / "Accettare la perdita e ripartire."). Sta nel file della voce, accanto a `favore`.
- **Si legge in due domande brevi per carta, poi una risposta finale** (`src/reading/wrong.js`):
  1. *Che idea porta questa carta?* L'essenza giusta tra quelle di altre carte.
  2. *E qui, che cosa vuol dire?* La frase giusta tra quelle che direbbero, nello stesso posto, altre carte chiaramente diverse.
  3. *Quindi, che cosa rispondi?* Tre livelli soli: bene, dipende, male. Poi il tono: con garbo o male.
- **Come sono le alternative sbagliate.** Mai la stessa carta in un altro ruolo o in un altro ambito: sono sfumature, non errori su cui si può ragionare. Sempre altre carte, lontane per significato (due inizi o due fini non si mettono mai una contro l'altra). La stessa carta nell'altro verso entra solo dopo la lezione sulle rovesciate.
- **Chi sa la carta risponde facile; chi non la sa può ragionare.** C'è sempre un aiuto per rivedere le parole della carta.
- **Con una carta sola** si va diretti: idea, significato, tono.
- **Frasi più corte**: da 7 a 18 parole, un'idea sola, e l'idea della carta riconoscibile, con la sua parola o una vicinissima.
- La lettura finale si mostra carta per carta: miniatura, essenza, frase. Poi la risposta.
