# Lore: il grafo dei contenuti

Questa cartella è un vault di Obsidian (aprila con «Apri cartella come vault») ed è anche dati: i test la
leggono. Un file per cosa. In testa i dati (YAML), sotto poche righe di testo. I collegamenti sono
`[[nome-del-file]]`, senza cartella e senza `.md`; i nomi dei file sono unici in tutto il vault (le pagine indice si chiamano `_indice-<cartella>`).

**Canone.** Quello che è scritto qui vale per ogni scena nuova. Ogni riga dice da dove viene:
`fonte: copione` (si vede nel gioco; indicare il file e la scena), `fonte: deciso` (lo ha deciso Andrea),
`fonte: proposto` (plausibile, non ancora confermato: non è canone finché Andrea non lo decide).
Niente viene inventato in silenzio: quello che manca va in `aperto:`.

## Cartelle e campi

| Cartella | `tipo` | Campi in testa |
|---|---|---|
| `persone/` | `persona` | `nome`, `id` (quello del codice), `ruolo`, `vuole`, `teme`, `nasconde`, `voce` (come parla: 3-5 tratti osservabili, con un esempio dal copione), `tic`, `incontro` (flag o passo in cui la si incontra), `arco` (lista di `[[fatti]]` in ordine), `legami` (lista di `{ con: "[[x]]", prova: "...", fonte }`), `sa` (lista di `{ fatto: "[[x]]", da: "[[scena o fatto]]" }`), `luoghi`, `carte` (le carte legate a lei), `aperto` |
| `luoghi/` | `luogo` | `nome`, `id` (mappa), `cosa_e`, `chi_ci_vive`, `atmosfera`, `si_apre_con`, `aperto` |
| `fatti/` | `fatto` | `nome`, `flag` (il flag o il passo del codice, se c'è), `capitolo`, `quando` (ordine: numero), `scena` (file e id del copione), `chi_c_e`, `chi_lo_sa`, `conseguenze` (lista di `[[fatti]]`), `rami` (se dipende da una scelta), `aperto` |
| `principi/` | `principio` | `nome`, `in_breve`, `perche`, `fonte` (sezione di DESIGN.md o parole di Andrea), `si_rompe_se` |
| `meccaniche/` | `meccanica` | `nome`, `fonte` (da dove viene la meccanica), `dove` (file del codice), `cosa_fa_la_giocatrice`, `serve` (lista di `[[principi]]`), `insegna` (lista di `[[obiettivi]]`), `tecniche` (lista di `[[tecniche]]`), `ragione_nel_gioco` (perché nel mondo di Salem ha senso farlo), `premio`, `rischio`, `tratti` (del ritratto che muove), `aperto` |
| `tecniche/` | `tecnica` | `nome`, `in_breve`, `come_funziona` (2-3 righe, con una fonte in RESEARCH.md se è un'affermazione sull'apprendimento), `fonte`, `dove_la_usiamo` (lista di `[[meccaniche]]`), `dove_manca` |
| `obiettivi/` | `obiettivo` | `nome`, `sa_fare` (cosa sa fare lei alla fine, osservabile), `si_vede_da` (come il gioco lo verifica), `meccaniche`, `aperto` |
| `tratti/` | `tratto` | generato: `nome`, `cosa` (che cosa misura), `stabilisce` (lista di `{ dove, n, scelta }`: chi lo muove), `mette_alla_prova` (lista di `{ dove, condizione }`: chi lo legge) |
| `scelte/` | `scelta` | generato: `nome`, `dove` (file e scena), `fatto` (il `[[fatto]]` della scena, se c'è), `classe` (`stabilisce`, `mette_alla_prova`, `entrambe`, `colore`), `opzioni` (lista di `{ t, quando, imposta }`) |
| `finali/` | `finale` | generato: `nome`, `dove`, `condizione`, `si_guadagna` (lista di `{ serve, dove }`) |
| `metodo/` | `metodo` | `nome`, `famiglia` (imparare, variare, personalizzare, scrivere, far-crescere), `ambito` (generale, salem), `problema`, `soluzione`, `in_salem` (lista di `[[...]]`), `si_controlla_con`, `rischi`, `fonte` |
| `retroscena/` | `retroscena` | `persona`, `fonte` (proposto finché Andrea non lo legge, poi deciso), `in_breve`, `vuole`, `teme` (non mostrato nel gioco: serve a dare profondità alle battute) |
| `decisioni/` | `decisione` | `nome`, `fonte` |

Le pagine che cominciano con `_` sono indici: possono non avere la testa. Le cartelle `tratti/`, `scelte/`
e `finali/` sono scritte da `node scripts/lore.mjs gen` a partire dai copioni: non si modificano a mano
(docs/TOOLS.md). `node scripts/lore.mjs check` controlla tutta la cartella.

Sotto la testa: un paragrafo che una persona legge volentieri, poi, se serve, `## Note`.
Italiano semplice, frasi corte, niente gergo. I nomi dei file: minuscole, trattini, senza accenti.
