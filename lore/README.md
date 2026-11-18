# Lore: il grafo dei contenuti

Questa cartella è un vault di Obsidian (aprila con «Apri cartella come vault») ed è anche dati: i test la
leggono. Un file per cosa. In testa i dati (YAML), sotto poche righe di testo. I collegamenti sono
`[[nome-del-file]]`, senza cartella e senza `.md`; i nomi dei file sono unici in tutto il vault (le pagine indice si chiamano `_indice-<cartella>`).

**Canone.** Quello che è scritto qui vale per ogni scena nuova. Ogni riga dice da dove viene:
`fonte: copione` (si vede nel gioco; indicare il file e la scena), `fonte: deciso` (lo ha deciso Andrea),
`fonte: proposto` (plausibile, non ancora confermato: non è canone finché Andrea non lo decide).
Niente viene inventato in silenzio: quello che manca va in `aperto:`.

## Tre zone

Le cartelle sono raccolte in tre zone, che rispondono a tre domande:

- **`metodo/`**: come si insegna. Leggi, principi, tecniche, ricette (le schede di metodo, generali o di Salem) e meccaniche.
- **`corso/`**: che cosa si impara. Obiettivi e concetti (il cerchio di erbe, fumi, pietre e tarocchi).
- **`storia/`**: dove e con chi. Persone, luoghi, fatti, retroscena, decisioni; in `storia/generati/` le scelte, i finali e i tratti scritti dagli strumenti.

Restano in cima al vault solo questo file, `inizio.md` e `.obsidian/`. I collegamenti non cambiano: sono per nome, senza cartella.

**Le leggi e le due facce.** `metodo/leggi/` ha le undici leggi di `docs/MANIFESTO.md`, una scheda ciascuna (`legge-...`). Ogni principio, tecnica e ricetta dice da quale legge pende col campo `legge` (e, se serve, `anche`), scritto come collegamento. Ogni meccanica ha due facce, il `motivo` (perché lei lo fa, dentro il gioco) e l'`effetto` (che cosa fa per l'apprendimento anche se lei non se ne accorge), e sceglie la sua `dinamica` tra le diciassette righe della tabella del manifesto: `trovare`, `misteri`, `laboratorio`, `parole-sue`, `decisioni`, `missioni`, `letture`, `esami-e-prove`, `ripasso`, `gesti-del-giorno`, `grimorio-e-album`, `gradi-e-zone`, `personaggi`, `casa`, `rito`, `libri`, `interessi`. La pagina `metodo/meccaniche/_dinamiche.md` è generata (`node scripts/lore.mjs gen`): per ogni dinamica, le sue meccaniche con le due facce. `lore check` dà errore a una meccanica senza `motivo`, `effetto`, `dinamica` valida o `leggi`, e a un principio, una tecnica o una ricetta senza una `legge` che esiste.

## Cartelle e campi

| Cartella | `tipo` | Campi in testa |
|---|---|---|
| `storia/persone/` | `persona` | `nome`, `id` (quello del codice), `ruolo`, `vuole`, `teme`, `nasconde`, `voce` (come parla: 3-5 tratti osservabili, con un esempio dal copione), `tic`, `incontro` (flag o passo in cui la si incontra), `arco` (lista di `[[fatti]]` in ordine), `legami` (lista di `{ con: "[[x]]", prova: "...", fonte }`), `sa` (lista di `{ fatto: "[[x]]", da: "[[scena o fatto]]" }`), `luoghi`, `carte` (le carte legate a lei), `aperto` |
| `storia/luoghi/` | `luogo` | `nome`, `id` (mappa), `cosa_e`, `chi_ci_vive`, `atmosfera`, `si_apre_con`, `aperto` |
| `storia/fatti/` | `fatto` | `nome`, `flag` (il flag o il passo del codice, se c'è), `capitolo`, `quando` (ordine: numero), `scena` (file e id del copione), `chi_c_e`, `chi_lo_sa`, `conseguenze` (lista di `[[fatti]]`), `rami` (se dipende da una scelta), `aperto` |
| `metodo/leggi/` | `legge` | `nome`, `numero` (1-11), `gruppo` (che-cosa, come, com-e-costruito), `in_breve`, `perche` (le prove, con la forza dichiarata), `si_rompe_se`, `lezioni` (i numeri di docs/LEZIONI.md), `fonte` |
| `metodo/principi/` | `principio` | `nome`, `legge` (la legge da cui pende, un `[[legge-...]]`; facoltativo `anche`, una seconda), `in_breve`, `perche`, `fonte` (sezione di DESIGN.md o parole di Andrea), `si_rompe_se` |
| `metodo/meccaniche/` | `meccanica` | `nome`, `dinamica` (una parola, una delle diciassette: vedi sotto), `leggi` (lista di `[[leggi]]`), `motivo` (perché lei lo fa, dentro il gioco: una riga, al massimo 20 parole), `effetto` (che cosa fa per l'apprendimento, con il nome della tecnica: una riga, al massimo 20 parole), `fonte` (da dove viene la meccanica), `dove` (file del codice), `cosa_fa_la_giocatrice`, `serve` (lista di `[[principi]]`), `insegna` (lista di `[[obiettivi]]`), `tecniche` (lista di `[[tecniche]]`), `ragione_nel_gioco` (perché nel mondo di Salem ha senso farlo), `premio`, `rischio`, `tratti` (del ritratto che muove), `aperto` |
| `metodo/tecniche/` | `tecnica` | `nome`, `legge` (un `[[legge-...]]`; facoltativo `anche`), `in_breve`, `come_funziona` (2-3 righe, con una fonte in RESEARCH.md se è un'affermazione sull'apprendimento), `fonte`, `dove_la_usiamo` (lista di `[[meccaniche]]`), `dove_manca` |
| `corso/obiettivi/` | `obiettivo` | `nome`, `sa_fare` (cosa sa fare lei alla fine, osservabile), `si_vede_da` (come il gioco lo verifica), `meccaniche`, `aperto` |
| `storia/generati/tratti/` | `tratto` | generato: `nome`, `cosa` (che cosa misura), `stabilisce` (lista di `{ dove, n, scelta }`: chi lo muove), `mette_alla_prova` (lista di `{ dove, condizione }`: chi lo legge) |
| `storia/generati/scelte/` | `scelta` | generato: `nome`, `dove` (file e scena), `fatto` (il `[[fatto]]` della scena, se c'è), `classe` (`stabilisce`, `mette_alla_prova`, `entrambe`, `colore`), `opzioni` (lista di `{ t, quando, imposta }`) |
| `storia/generati/finali/` | `finale` | generato: `nome`, `dove`, `condizione`, `si_guadagna` (lista di `{ serve, dove }`) |
| `metodo/ricette/` | `ricetta` | `nome`, `legge` (un `[[legge-...]]`; facoltativo `anche`), `famiglia` (imparare, variare, personalizzare, scrivere, far-crescere), `ambito` (generale, salem), `problema`, `soluzione`, `in_salem` (lista di `[[...]]`), `si_controlla_con`, `rischi`, `fonte` |
| `storia/retroscena/` | `retroscena` | `persona`, `fonte` (proposto finché Andrea non lo legge, poi deciso), `in_breve`, `vuole`, `teme` (non mostrato nel gioco: serve a dare profondità alle battute; campi facoltativi, nei retroscena lunghi: `ferita`, `non_direbbe_mai`, `bugia_che_si_racconta`, `cosa_pensa` (lista `{ di, cosa }`), `ipotesi` (lista `{ su, cosa, perche }`), `sente_tartufo`, `affiora`, `non_affiora`, `sostiene` (lista `{ dove, cosa }`: le righe dei copioni che il retroscena spiega), `corregge` (lista `{ contraddizione, come, cambia }`)) |
| `storia/decisioni/` | `decisione` | `nome`, `fonte` |
| `corso/concetti/` | `concetto` | il cerchio di erbe, fumi, pietre e tarocchi ([[_il-cerchio]]): `nome`, `famiglia` (elemento, pianeta, intenzione, segno; seme, arcano, erba, fumo, pietra), `elemento`, `pianeta`, `intenzioni` (lista di `[[intenzione-...]]`), `in_breve` (una riga da ricordare, detta come la dice la tradizione), `si_dice`, `da_dove_viene`, `consenso` (per ogni legame: alto, medio, basso, oppure nostro quando la scelta è del gioco), `varianti`, `nel_gioco`, `fonte` (nomi brevi delle fonti, spiegati in RESEARCH.md, «Il cerchio»; campi facoltativi: colore, id, rischio, segno, seme, arcano, erba, giorno, metallo, carta, segni) |

Le pagine che cominciano con `_` sono indici: possono non avere la testa. Le cartelle `storia/generati/tratti/`, `storia/generati/scelte/`
e `storia/generati/finali/` sono scritte da `node scripts/lore.mjs gen` a partire dai copioni: non si modificano a mano
(docs/TOOLS.md). `node scripts/lore.mjs check` controlla tutta la cartella.

Sotto la testa: un paragrafo che una persona legge volentieri, poi, se serve, `## Note`.
Italiano semplice, frasi corte, niente gergo. I nomi dei file: minuscole, trattini, senza accenti.

## Per chi scrive una scena nuova

**`affiora` e `non_affiora`.** Sono la parte del retroscena che serve a chi scrive. `affiora` sono gesti e
battute di lato che si possono mostrare, e mostrare così: senza spiegarli. `non_affiora` è quello che non si dice
mai, nemmeno per allusione chiara: non lo dice un personaggio, non lo spiega il narratore. `non_direbbe_mai` è
la stessa cosa dal lato della persona: la frase che lei non pronuncerebbe. Una scena può far intravedere un
`non_affiora` solo come un gesto che non lo nomina (come le due mani passate due volte sul sacco nel cappello).

**`arco` o `aperto`.** Un fatto scritto da un agente (`fonte: proposto`) si annota nell'`aperto` delle persone,
in una riga che lo cita; entra nell'`arco` quando Andrea lo conferma e il fatto passa a `deciso`. L'`arco`
elenca solo fatti accettati, in ordine.

**Il genere di lei.** Deciso il 17 novembre ([[decisioni-2026-11-17]], punto 8): nelle storie scritte a mano,
principale e secondarie, le si parla al femminile («sei arrivata»). Restano senza genere solo i testi che si
riusano: le frasi delle carte (`src/data/reading/voices/`), le opinioni, i testi generati (`docs/READING.md`,
«Chi chiede può essere chiunque»).
