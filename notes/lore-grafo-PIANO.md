# Il vault: piano di riordino (proposta, 18 novembre)

Da approvare. Sostituisce le proposte in `lore-grafo-valutazione.md`. Niente è ancora cambiato nel vault.

## A che cosa serve

1. **Mnemopolis e il generatore** (lo scopo principale): portarsi via il metodo, pulito.
2. **Chi scrive scene** (agenti): non contraddire la storia, sapere che cosa lei sa.
3. **Il gioco**: il contenuto del corso diventa dati (`sapere.js`).
4. **Andrea**: guardarlo ogni tanto, e che abbia senso a colpo d'occhio.

## L'idea: un vault, tre zone, una catena

Un solo vault (due vault spezzerebbero proprio i legami che contano), con tre cartelle madri:

| Zona | Dentro | In Mnemopolis |
|---|---|---|
| `metodo/` **come si insegna** | principi, tecniche, meccaniche, obiettivi, ricette (le attuali schede `metodo`) | si copia com'è |
| `corso/` **che cosa si impara** | i concetti (l'attuale `sapere/`: carte, erbe, pietre, fumi, pianeti…) | i concetti del corso (le case) |
| `storia/` **dove e con chi** | persone, luoghi, fatti, retroscena, decisioni; `generati/` (scelte, finali, tratti) | la città e la sua storia |

Tra le zone passa **una catena sola**, sempre nello stesso verso:

    principio → tecnica → meccanica → obiettivo → concetto → luogo → (persone, fatti)
    perché       come      con che cosa  per saper fare  che cosa   dove

L'esempio di Andrea, letto sulla catena: «l'ambientazione è fatta per essere ricordata» (principio) → luoghi e
immagini vivide (tecnica) → trovare una carta, la mappa (meccaniche) → riconoscere una carta (obiettivo) → il
Carro (concetto) → il posto dove sta (luogo) → chi ci abita e che cosa ci è successo (storia). In Mnemopolis
l'ultimo tratto è «la casa è il concetto»: è lo stesso legame.

## Che cosa manca oggi (misurato)

- **L'anello concetto → luogo non esiste**: nessuna delle 22 schede degli Arcani dice dove sta la carta. È
  proprio il legame «casa», e si può **ricavare dai dati del mondo** (carte, erbe, pietre, figurine hanno già
  un posto nel codice): generato, non scritto a mano.
- **L'anello obiettivo → concetti non esiste**: un obiettivo non dice quali concetti copre.
- **Il principio dell'esempio non c'è** tra i 17 principi (è solo la lezione 11 in LEZIONI.md): va scritto.
- **Legami scritti due volte** (tecnica ↔ meccanica, obiettivo ↔ meccanica) che vanno fuori sincrono: ne sono
  già stati trovati due sbagliati.
- **Meccaniche con Salem dentro**: descrivono «gira per Salem»; per Mnemopolis serve la forma generale.
- I generati (275 file) coprono il disegno; 34 retroscena e 35 ricette non hanno nessuno che punti a loro.
- Correzione: avevo scritto che persone e luoghi sono vuoti. Il contenuto c'è, ma sta nei campi in testa
  (circa 70 parole); è il testo sotto che è di una riga.

## Le regole (poche)

1. **Ogni legame si scrive in un posto solo**, dal lato che lo conosce; il verso opposto lo calcolano gli
   strumenti (Obsidian lo fa già con i «collegamenti in entrata»). Si tolgono i campi doppi.
2. **Quello che si può ricavare dal codice si genera** (concetto → luogo; meccanica → file).
3. **Il metodo non nomina Salem.** Ogni meccanica ha la forma generale; l'esempio di Salem sta in un campo
   solo (`in_salem`), l'unico ponte ammesso dal metodo alla storia. Un test lo controlla.
4. **I generati restano file** (servono ai test) ma fuori dal disegno.
5. Tre controlli al posto di molti: ogni obiettivo ha una meccanica e almeno un concetto; ogni concetto ha un
   posto e un obiettivo; ogni persona ha il suo retroscena e il suo luogo.

## Che cosa NON si fa

- Niente tipi nuovi di scheda: si usano quelli che ci sono (le «ricette» restano, legate al principio o alla
  tecnica che applicano).
- Niente secondo vault, niente database, niente riscrittura delle schede buone (meccaniche, obiettivi,
  tecniche, principi funzionano già).
- Niente arricchimento a mano di 100 schede: prima i legami; il testo sotto le schede di persone e luoghi si
  scrive solo per i principali.

## Passi (ognuno piccolo e verificabile)

1. Spostare le cartelle nelle tre zone e aggiornare gli strumenti (i nomi dei file non cambiano, quindi nessun
   link si rompe). Disegno: tre colori, generati nascosti.
2. Un verso solo: togliere i campi doppi, il controllo usa il verso calcolato.
3. Generare concetto → luogo dai dati del mondo; aggiungere `concetti` agli obiettivi (per famiglia: «gli
   Arcani maggiori», non 22 righe).
4. Scrivere il principio mancante; legare ogni ricetta al suo principio o tecnica; ogni persona al retroscena.
5. Meccaniche in forma generale + `in_salem`; test «il metodo non nomina Salem».
6. Pagina d'ingresso con le tre porte e la catena dell'esempio, da seguire con i clic.
7. Copiare `metodo/` in Mnemopolis come prova: se serve ritoccarlo, il metodo non era pulito.

## Da decidere con Andrea

- I nomi delle tre zone (`metodo`, `corso`, `storia`).
- Se il passo 7 (prova su Mnemopolis) si fa subito o dopo.
