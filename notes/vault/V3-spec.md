# Vault, passo V3: il corso (specifica del capofila)

Si fa dopo V2 (servono le `leggi` delle meccaniche). Zona: `lore/corso/`. Le classificazioni sono decise dal
capofila; si applicano così come sono.

## 1. `peso` (legge 1 del manifesto: poche cose da sapere)

### Sui concetti (`lore/corso/concetti/`), per famiglia

| Famiglia | peso | Perché |
|---|---|---|
| arcano (22), seme (4) | nucleo | è il corso |
| numero, figura, stesa, regola (nuove, vedi 2) | nucleo | senza non si legge una carta piccola né una stesa |
| elemento, pianeta, segno, intenzione | contorno | paralleli che aiutano a ricordare |
| erba, fumo, pietra | contorno | il cerchio intorno alle carte; facoltativo |
| storia (nuova) | contorno | |

### Sugli obiettivi (`lore/corso/obiettivi/`)

- **nucleo**: riconoscere-una-carta, dire-l-idea-della-carta, capire-i-minori, leggere-in-posizione,
  leggere-le-capovolte, conoscere-le-stese, unire-le-carte, rispondere-a-chi-chiede, leggere-il-proprio-mazzo.
- **contorno**: ricordare-i-dettagli, decidere-con-una-carta, conoscere-pianeti-e-segni,
  conoscere-la-storia-dei-tarocchi, riconoscere-e-curare-le-piante.

## 2. Concetti del nucleo che nel vault mancano

Gli obiettivi parlano di numeri, figure, stese e capovolte, ma non c'è nessuna scheda concetto: nel grafo il
nucleo del corso è monco. Si aggiungono schede **sottili**, scritte SOLO dai dati del gioco (niente inventato;
`fonte: copione` con il file):

| Famiglia | Schede | Da dove |
|---|---|---|
| numero | dall'Asso al Dieci (10) | `src/data/cards/minors.js`, `src/data/cards.base.js` (RANKS), `src/data/lessons.js` |
| figura | Fante, Cavallo, Regina, Re (4) | gli stessi |
| stesa | carta singola, passato-presente-futuro, croce celtica (3), con le posizioni in un campo | `src/data/spreads.js` |
| regola | le-capovolte (1) | `src/data/lessons.js`, `docs/READING.md` |
| storia | storia-dei-tarocchi (1), con i fatti verificati | `docs/RESEARCH.md` |

Campi: `nome`, `famiglia`, `peso`, `in_breve` (una riga: è il nucleo), `si_dice` o `posizioni` se servono,
`dati` (il file del gioco), `fonte`. I nomi dei file come le altre (`numero-asso`, `figura-fante`,
`stesa-croce-celtica`, …), unici in tutto il vault.

**Vincolo duro:** `src/data/sapere.js` (generato da `node scripts/lore.mjs sapere`) deve restare identico byte
per byte: il generatore e il test del cerchio (`tests/sapere.test.mjs`) lavorano sulle nove famiglie del
cerchio (arcano, seme, erba, fumo, pietra, pianeta, elemento, segno, intenzione); le famiglie nuove ne restano
fuori con un elenco esplicito nel codice. Fare una copia prima e `diff` alla fine.

## 3. `concetti` sugli obiettivi (nomi di famiglia, non collegamenti)

| Obiettivo | concetti |
|---|---|
| riconoscere-una-carta | arcano, seme |
| ricordare-i-dettagli | arcano |
| dire-l-idea-della-carta | arcano, seme, numero, figura |
| capire-i-minori | seme, numero, figura |
| leggere-in-posizione | stesa, arcano |
| leggere-le-capovolte | regola, arcano |
| conoscere-le-stese | stesa |
| unire-le-carte | arcano, seme, numero, stesa |
| rispondere-a-chi-chiede | arcano, stesa |
| leggere-il-proprio-mazzo | arcano, seme, numero, figura, stesa, regola |
| decidere-con-una-carta | arcano |
| conoscere-pianeti-e-segni | pianeta, segno, elemento |
| conoscere-la-storia-dei-tarocchi | storia |
| riconoscere-e-curare-le-piante | erba |

Nessun obiettivo riguarda oggi fumo, pietra e intenzione: si vedrà nella tabella dei buchi (è giusto così: sono
contorno arrivato dopo; va scritto in `aperto` di `_il-cerchio.md`, una riga).

## 4. `sta_in`: il posto di un concetto (scritto nella scheda, controllato da un test)

Campo `sta_in: "[[luogo]]"` nelle schede dei concetti che nel gioco hanno un posto. Si scrive una volta a mano
(dall'agente) e **un test lo confronta con i dati del gioco**, così non può andare fuori sincrono:

- arcano: `spot` in `src/data/cards.base.js` (un'ancora, es. `depths.well`) → il luogo del vault con quell'`id`,
  o il luogo a cui l'ancora appartiene (`placeOf` in `src/ui/sketchmap.js`; le schede dei luoghi hanno `id`).
  I quattro senza posto (Il Matto, Il Sole, Il Giudizio, Il Mondo) non hanno `sta_in`: arrivano dalla storia;
  campo `arriva_da` con il fatto del vault se esiste, altrimenti niente.
- erba: `src/data/world/herbs.js` (mappa e casella) → il luogo più vicino della mappa a matita, o la regione.
- pietra: `src/data/world/finds.js` per quelle per terra; quelle in regalo: `la_da: "[[persona]]"` da
  `src/data/gifts.js`.
- semi, numeri, figure, stese: se i dati dicono dove si imparano (una lezione di una maestra in un posto:
  `src/data/lessons.js`), `si_impara_da: "[[persona]]"`; altrimenti niente.

Se un'ancora non ha un luogo nel vault, non si inventa la scheda: si elenca nel resoconto.

## 5. Pagina generata `lore/corso/_sei-voci.md` (i buchi)

Per le famiglie del nucleo, e sotto per quelle di contorno, le sei voci dell'unità di crescita:

| Voce | Si calcola così |
|---|---|
| nucleo | `in_breve` c'è |
| corpo | c'è un'immagine del concetto (`public/cards/<id>.webp` per le carte; tavola per erbe e pietre) **oppure** una meccanica con la legge 3 che insegna un obiettivo che riguarda la famiglia |
| posto | `sta_in` (o `arriva_da`, `la_da`, `si_impara_da`: scritto qual è) |
| motivo | una meccanica con la legge 2 che insegna un obiettivo che riguarda la famiglia |
| uso | lo stesso con la legge 5 |
| ritorno | lo stesso con la legge 8 |

Uscita: una tabella per famiglia (sei colonne, sì/no con il nome di ciò che la copre) e sotto l'elenco dei
concetti a cui manca una voce propria (posto, corpo). In fondo: obiettivi senza concetti, famiglie senza
obiettivi. Entra in `lore.mjs gen` e `gen --check`.

## 6. Controlli

- errore: un concetto senza `peso`; un obiettivo senza `peso` o senza `concetti`; una famiglia in `concetti` che
  non esiste;
- errore: `sta_in` verso una scheda che non è un luogo;
- test: `sta_in` degli arcani coincide con `spot` di `cards.base.js`; ogni concetto del nucleo ha `in_breve`;
  `sapere.js` invariato.
- I campi nuovi nella tabella di `lore/README.md`.

## 7. Non toccare

`lore/metodo/` (tranne ciò che si rigenera da solo), `lore/storia/` (si leggono le schede dei luoghi; non si
scrivono), `lore-site/`, `scripts/lore/site.mjs`, `src/` (si legge soltanto). Mai git.
