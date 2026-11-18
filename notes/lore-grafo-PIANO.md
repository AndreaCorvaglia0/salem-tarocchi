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

## Aggiunta dopo il manifesto (18 novembre, 11:30)

L'esempio di Andrea vale per tutto: ogni dinamica ha un motivo nel gioco e un effetto sull'imparare. Il
disegno largo è ora in `docs/MANIFESTO.md` e diventa la **radice della zona `metodo/`**:

    manifesto → 7 leggi → principi e tecniche → meccaniche → obiettivi → concetti → luoghi → storia

Conseguenze per il piano: (a) sette schede `legge` in cima a `metodo/` (unico tipo nuovo, giustificato: sono
la spina del grafo); ogni principio e ogni tecnica dichiara la sua legge; (b) ogni meccanica ha due campi
espliciti, `motivo` e `effetto` (le due facce), e il controllo avvisa se ne manca uno; (c) ogni concetto del
corso ha i quattro legami dell'unità di crescita: posto, motivo, uso, ritorno; il controllo elenca i concetti
a cui ne manca uno. Passo 0 del piano: approvare il manifesto.

## Aggiunta dopo il secondo giro del manifesto (18 novembre, 12:00)

Le leggi sono dieci, in tre gruppi (che cosa, come, com'è costruito). Tre conseguenze per il vault:

- **Le tre zone sono la legge 10**: `corso/` (concetti), `storia/`, e i materiali (che stanno nel codice e in
  `public/`, con i crediti); `metodo/` è la parte che non sa niente di Salem. Il test «il metodo non nomina
  Salem» e «la storia non contiene il testo dei concetti» sono i controlli della legge 10.
- **Nucleo e contorno (legge 1)** diventano due campi di ogni concetto: `nucleo` (una riga: che cosa sapere) e
  `segnini` (applicazioni, metafore, paralleli, ognuno legato al nucleo). Gli obiettivi dicono quali concetti
  del nucleo coprono; il controllo elenca i concetti del nucleo che nessuna verifica tocca.
- **L'unità di crescita ha sei voci** (nucleo, corpo, posto, motivo, uso, ritorno): il controllo fa una tabella
  concetto × sei voci e mostra i buchi. È la stessa tabella che servirà a Mnemopolis per dire se una casa è
  finita.

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
