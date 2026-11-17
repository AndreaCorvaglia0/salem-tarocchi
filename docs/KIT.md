# Il kit: come si aggiunge un pezzo a Salem

Questa pagina è l'ingresso per chi deve aggiungere qualcosa al gioco: una storia secondaria, una persona,
un mondo. È anche la base per tornare a Mnemopolis e farne un generatore di storie (`docs/MNEMOPOLIS.md`).

## Tre prodotti

| Prodotto | Che cosa è | Dove |
|---|---|---|
| **Il metodo** | Come si impara, come si varia, come si personalizza, come si scrive, come cresce il progetto. Le regole, le tecniche con le loro fonti, e le schede che dicono come le abbiamo messe in pratica | `lore/principi`, `lore/tecniche`, `lore/metodo` (indice: `lore/metodo/_indice-metodo.md`) |
| **Lo schema** | I tipi di contenuto e i loro campi: persona, luogo, fatto, principio, meccanica, tecnica, obiettivo | `lore/README.md`; le istanze nelle cartelle di `lore/` |
| **Gli strumenti** | Che cosa controlla il vault e il gioco, e che cosa dice quello che manca | `docs/TOOLS.md`, `docs/TRIALS.md`, `scripts/`, `tests/` |

Come stanno insieme: il metodo dice **perché** una cosa si fa in un certo modo; lo schema dice **che
forma** ha un pezzo prima di diventare codice; gli strumenti dicono **se** il pezzo è a posto. Un pezzo
nuovo nasce nel vault (schema), segue le schede (metodo), poi diventa dati in `src/data/` e passa i
controlli (strumenti).

Prima di cominciare, leggere: `AGENTS.md`, `docs/MAP.md`, `docs/DESIGN.md`, `docs/WRITING.md`, e le schede
`lore/metodo/storie-in-piu-nel-registro.md`, `lore/metodo/ogni-riga-ha-una-fonte.md`, `lore/metodo/il-salvataggio-sopravvive.md`.

## Regole che valgono per tutti e tre

- Qualcuno sta già giocando. Il pezzo dipende da quello che lei **ha** (un flag, una carta, un potere, una
  persona incontrata), mai dal passo della storia in cui si trova. Ogni chiave nuova del salvataggio ha un
  valore in `fresh()` di `src/core/state.js`.
- Niente si inventa in silenzio: nel vault ogni riga nuova è `fonte: proposto` finché Andrea non dice sì.
- Il testo segue `docs/WRITING.md`. Lo si legge ad alta voce prima di consegnare.
- Si dice che cosa è stato verificato e che cosa no. Nessuno strumento prova un telefono vero o ascolta l'audio.
- Il genere di lei: nelle storie scritte a mano, principale e secondarie, le si parla al femminile; restano senza
  genere solo i testi che si riusano (frasi delle carte, opinioni). Deciso in `lore/decisioni/`, punto 8.

## I comandi che dicono che cosa manca

| Comando | Che cosa dice |
|---|---|
| `npm test` | Tutti i test: dati della storia, mondo, prove, registro, salvataggi vecchi |
| `node scripts/lore.mjs check` | Il vault: campi, collegamenti, coerenza con i copioni (dettagli in `docs/TOOLS.md`) |
| `node scripts/lore.mjs gen` | Riscrive `lore/tratti`, `lore/scelte`, `lore/finali` dai dati della storia |
| `node scripts/prose.mjs` | I difetti meccanici del testo (raffiche di frasi corte, frasi di una parola) |
| `node scripts/map.mjs --check` | Se `docs/MAP.md` è da riscrivere (un servizio nuovo, un evento nuovo) |
| `node scripts/shot.mjs <url> <out.png> --phone --until domcontentloaded --steps <file.mjs>` | Una schermata da telefono (390 x 844); tutto in `docs/TOOLS.md`, «Looking at it» |
| `/?debug&skip=c2` (`c3`, `trial`) e `window.__salem` | Saltare a un capitolo, chiamare un servizio a mano |

## 1. Aggiungere una storia secondaria

**Prima si sceglie il genere.** Se nella storia le carte devono decidere qualcosa, è una **prova** (i bivi
esistono solo lì): dati in `src/data/trials/<id>.js`, scene intorno in `src/data/story/scripts/<id>.js`. Se è
solo dialogo, è un **copione** con una voce in `CAST` e un fatto (`docs/TOOLS.md`, «Adding a side story»).
`SIDE` in `src/data/story/steps.js` serve solo per una carta nascosta che qualcuno racconta. Esempio
completo, una prova in due posti con una persona che cambia con l'affinità: `src/data/trials/hat.js` e
`src/data/story/scripts/hat.js` («Il cappello in soffitta»). Le regole scritte delle prove: `docs/TRIALS.md`.

1. **Nel vault.** Prima di scrivere, leggere il retroscena di ogni persona coinvolta (`lore/retroscena/`) e
   `lore/decisioni/`: quello che sta in `non_affiora` e `non_direbbe_mai` non si dice mai, affiora in un gesto
   o in una battuta di lato. Scrivere `lore/fatti/<nome>.md` (tipo `fatto`, `fonte: proposto`: chi c'è, chi lo
   sa, conseguenze, `aperto`). Alle persone coinvolte si aggiunge una riga in `aperto` che lo cita; entra
   nell'`arco` solo quando Andrea lo conferma. Se c'è un posto nuovo, `lore/luoghi/<nome>.md`.
2. **Decidere il perché.** Quale obiettivo di `lore/obiettivi` allena, quale meccanica usa (di solito
   `lore/meccaniche/affrontare-le-prove.md` e `lore/meccaniche/chiedere-alle-carte.md`), che cosa si vince e che
   cosa si perde (`lore/metodo/posta-vera-ma-recuperabile.md`). Una riga per ciascuno, prima del testo. Per
   insegnare carte precise: una strega le tira davanti a lei (`witchDraw`), poi un bivio chiede la loro idea;
   nel ventaglio ci sono solo le carte che lei conosce.
3. **Decidere quando arriva.** Un `when` su quello che lei ha (`{ majorsMin: 8 }`, `{ power: 'cat' }`, un flag,
   una persona incontrata), mai sul passo. Le chiavi valide sono in testa a `src/core/cond.js`; l'elenco
   `COND_KEYS` si esporta da lì e i test lo leggono, quindi non c'è un elenco da aggiornare. La catena delle
   prove secondarie tiene una nuova alla volta: `after: ['trial.<id dell'ultima>']`, e la catena è la regola; una
   storia che deve arrivare a chiunque abbia finito il gioco, anche senza le prove, va fuori dalla catena e il
   test va cambiato (decide Andrea). Non si possono scrivere «fallita oggi» e «ha già parlato una volta»
   (`docs/TRIALS.md`, limiti noti).
4. **I dati.** La prova: `id`, `title` (si legge prima di cominciare: non deve svelare niente), `with`, `when`,
   `note` (una frase intera: la riga del grimorio), `start.at` (un'ancora di `src/data/world/<mappa>.js`),
   `study`, `steps`, `rooms`, `outcomes`; in fondo a `LIST` in `src/data/trials/index.js`. Una prova non ha
   `if`: quello che cambia per tratti, affinità o legame si scrive nella scena intorno, prima o dopo
   `trial.start`. Le scene (apertura, ritorno dopo un fallimento, ricordo del premio) in un file proprio di
   `src/data/story/scripts/`, che `trials.js` unisce a `TRIAL_SCRIPTS` in fondo (`lore` vede da solo ogni file
   di quella cartella). Se la storia comincia in un posto e si gioca in un altro, le voci di CAST vanno fatte
   come dice `docs/TRIALS.md`, «Una storia in due posti».
5. **Il registro.** Non serve scrivere niente: `src/glue/trials.js` registra da solo ogni prova vera in
   `src/core/extras.js`. Il tetto di due novità alla volta vale anche per lei.
6. **I controlli.** Aggiungere la riga della prova a `poolsOf` in `tests/trials.content.test.mjs` (i mazzi che lei
   può avere in quel momento) e, se serve, a `OLD2` / `ENDED`; poi `npm test`, `node scripts/lore.mjs gen` e
   `check`, `node scripts/prose.mjs`. `node scripts/map.mjs --check` fallisce anche solo per le righe in più:
   `docs/MAP.md` lo rifà chi guida.
7. **Sul telefono.** Schermate (come, in `docs/TOOLS.md`, «Looking at it») di: la riga nel grimorio (dice dove
   andare, in una riga); la scena d'apertura; ogni bivio (la regola del quesito si legge intera, nessuna risposta
   è visibile prima della scelta); una stanza buona e una cattiva (non dicono quale strada era giusta); la
   schermata finale. Le scritte devono leggersi senza ingrandire.
8. **Che cosa decide Andrea.** Se la storia entra nel canone (i fatti da `proposto` a `deciso`, e dall'`aperto`
   all'`arco`), con quale persona, che cosa si può perdere, il genere di lei, e il testo letto ad alta voce.

## 2. Aggiungere una persona

Modello: `lore/persone/malva.md` per il vault; il mugnaio e il bottegaio per una persona del villaggio.

1. **Nel vault.** `lore/persone/<id>.md` con tutti i campi di `lore/README.md`. Il più importante è `voce`:
   da tre a cinque abitudini che si vedono, ognuna con un esempio (`lore/metodo/voci-da-abitudini.md`). `vuole`, `teme`,
   `nasconde` all'inizio sono quasi tutti `proposto` o in `aperto`.
2. **Decidere quanto conta.** Una persona che parla con il suo nome ha bisogno di più pezzi. Una che compare
   una volta può parlare attraverso la narrazione, come il mugnaio (`src/data/story/scripts/c2.js`).
3. **I dati, se parla con il suo nome.** Una voce in `PEOPLE` di `src/data/cards.base.js` (è un file della
   guida: chiederlo a chi guida), con la carta che incarna se ne ha una; il ritratto di profilo in `CAMEOS`
   di `src/story/stage/cameos.js`; l'aspetto nel mondo in `src/world/art/people.js`.
4. **Dove sta.** Una o più voci in `CAST` di `src/data/story/cast.js`: `kind: 'npc'`, `who`, `at` (un'ancora
   esistente), `when` su quello che lei ha, `script`. Il mondo mostra la prima voce che vale per quell'id:
   l'ordine conta.
5. **Che cosa dice.** Il copione in `src/data/story/scripts/`, con i costruttori di `src/data/story/h.js`.
   Ogni scelta ha almeno due risposte, frasi intere in prima persona, ognuna con il suo tratto e la sua replica.
6. **Che cosa ne pensano gli altri** (facoltativo). Una voce in `PEOPLE_OP` di `src/data/story/opinions.js`:
   `met`, `tratto`, le `voci` degli altri, la `domanda` con tre risposte. Nessuna riga dà un genere a lei.
7. **I controlli.** `npm test` (`tests/story.data.test.mjs`: ogni chi parla esiste; `tests/stage.data.test.mjs`:
   ogni persona ha il suo ritratto; `tests/opinions.test.mjs`; `tests/world.maps.test.mjs`), poi
   `node scripts/lore.mjs check` e `node scripts/prose.mjs`.
8. **Sul telefono.** Il ritratto si riconosce in piccolo; il nome sopra la battuta; la prima battuta si capisce
   da sola; le risposte stanno sullo schermo senza scorrere.
9. **Che cosa decide Andrea.** Chi è (che cosa vuole e teme), se incarna una carta, quali dettagli diventano
   canone, e la voce letta ad alta voce.

## 3. Aggiungere un mondo (Altrove)

Modello: `src/data/elsewhere/book.js` (Dentro un libro) e `clouds.js` (Sulle nuvole); le note in
`notes/elsewhere.md`.

1. **Nel vault.** `lore/luoghi/<nome>.md` (come `sulle-nuvole` e `dentro-un-libro`) e un fatto per il viaggio
   (come `viaggio-nel-libro`). In una frase: la regola del mondo («in un libro si cammina solo sulle righe
   scritte») e l'espediente per arrivarci (un libro, una pozione, un incubo).
2. **Decidere la regola.** Se il mondo riusa una regola che c'è (cadere, camminare sulle righe) basta scrivere
   dati. Se la regola è nuova serve codice nel mondo (`src/world/elsewhere.rules.js`, `src/world/scene/`,
   `src/world/art/elsewhere.js`): è un compito per un agente del mondo, con le sue cartelle.
3. **La mappa.** Un file in `src/data/world/<id>.js` nel formato di `src/data/world/README.md`, registrato in
   `src/data/world/index.js`. Senza ronde né Minori. Il campo `cat` dice se Tartufo viene.
4. **Il mondo come dati.** `src/data/elsewhere/<id>.js` con: `id`, `title`, `map`, `start`, `device`
   (`potion`, `pages` o `nightmare`), `mood` (la musica), `maxFalls`, `note` (la riga del grimorio), `when`,
   `after` (di solito l'ultimo mondo: `elsewhere.clouds`), `trigger` (l'oggetto in Salem che fa partire il
   viaggio: `at`, `art`, `label`, `verb`, e due battute), `item` (il premio senza errori), `hint` (la regola
   in una riga d'interfaccia), `steps` con tre bivi (uno per grado: segno, idea, quesito), `rooms`. Aggiungerlo
   a `WORLD_LIST` in `src/data/elsewhere/index.js`.
5. **Il registro.** Non serve scrivere niente: `src/glue/elsewhere.rules.js` crea la voce `elsewhere.<id>`, la
   catena e l'oggetto in Salem. Controllare che l'ancora di `trigger.at` esista nella mappa di Salem.
6. **I controlli.** `npm test` (`tests/elsewhere.test.mjs`, `tests/world.maps.test.mjs`), poi
   `node scripts/lore.mjs check`. Per entrare subito: `/?debug`, poi `window.__salem.call('elsewhere.go', '<id>')`.
7. **Sul telefono.** Il passaggio d'andata; la riga in alto «Altrove · <nome>»; la regola si capisce dalla
   prima schermata; il punto che brilla si vede; ogni bivio; il ritorno esattamente dove lei era; la schermata
   finale. Provare anche una pagina chiusa a metà viaggio: al riavvio lei deve essere di nuovo in Salem.
8. **Che cosa decide Andrea.** Se il mondo gli piace («piccolo, folle e tutto diverso»), la regola, l'oggetto
   che si porta a casa, che cosa si perde cadendo.

## La mappa del grimorio

Ogni ancora di una regione (`village.js`, `forest.js`, `depths.js`) ha una voce nel suo campo `map`, accanto
alle ancore: `{ label, kind }` se è un luogo dello schizzo (il nome a matita, minuscolo, quello che il gioco usa
nei copioni; `kind` è il disegnino, in `src/ui/sketchink.js`), `{ in: '<ancora>' }` se fa parte di un luogo
(il nascondiglio di una carta, un punto vicino), `{ off: 'perché' }` se non va sulla mappa (le guardie, l'erba
dei Minori). Una mappa nuova dentro una casa o in Altrove dice a quale porta appartiene: `mapDoor:
'village.<porta>'`. Posizioni e strade si calcolano dalle mattonelle: non si scrivono a mano. Un'ancora nuova,
una porta nuova, un posto nuovo dove la storia la manda: `tests/map.sketch.test.mjs` chiede dove va.

## Dopo

Ogni pezzo aggiunto si annota: in `notes/<area>.md` le decisioni prese e quello che non è verificato; in
`notes/kit.md` quello che il kit non spiega ancora. Se un pezzo ha richiesto un passo che qui non c'è,
quel passo va aggiunto qui.
