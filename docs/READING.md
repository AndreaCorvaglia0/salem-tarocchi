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
