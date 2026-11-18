# Il vault: piano di riordino

Terza stesura, 18 novembre 2026, dopo l'approvazione del manifesto (`docs/MANIFESTO.md`). Sostituisce le
precedenti. Da approvare; nel vault non è ancora cambiato niente. La misura di partenza è in
`lore-grafo-valutazione.md`.

## Scopo

Un vault che **spiega** il gioco a chi lo guarda e a chi ci lavora:

1. **Mnemopolis e il generatore**: portarsi via il metodo, pulito.
2. **Chi scrive scene e missioni** (agenti): non contraddire la storia, sapere che cosa lei sa.
3. **Il gioco**: il corso diventa dati.
4. **Andrea**: guardarlo ogni tanto e capire a colpo d'occhio perché ogni cosa c'è.

## Tre zone (è la legge 10 del manifesto)

Un vault solo, tre cartelle madri. I nomi dei file non cambiano, quindi nessun collegamento si rompe.

| Zona | Dentro (tipi di scheda) | Risponde a | In Mnemopolis |
|---|---|---|---|
| `metodo/` | **leggi** (10, nuove), **principi** (17), **tecniche** (14), **ricette** (le 36 schede oggi in `metodo/`), **meccaniche** (33) | perché e come si insegna | si copiano le schede generali |
| `corso/` | **obiettivi** (14), **concetti** (le 104 schede oggi in `sapere/`) | che cosa si impara | i concetti del corso |
| `storia/` | **persone**, **luoghi**, **fatti**, **retroscena**, **decisioni**; `generati/` (scelte, finali, tratti) | dove, con chi, che cosa succede | la città |

Scelte fatte, con il perché:

- **Le meccaniche stanno nel metodo**, come le pensa Andrea, anche se descrivono Salem: sono il punto in cui
  una legge diventa una cosa che lei fa. Ogni scheda del metodo dichiara l'`ambito`: `generale` o `salem`. Le
  generali non nominano Salem (un test lo controlla) e sono quelle che vanno in Mnemopolis; le meccaniche sono
  `salem`, e la loro forma generale esiste già: sono le ricette che le citano.
- **Gli obiettivi stanno nel corso**, non nel metodo: «riconoscere una carta» è del corso di tarocchi.
- **Un solo tipo nuovo: la legge.** Dieci schede, la spina del grafo. Niente tipo «dinamica»: è un campo delle
  meccaniche, e la tabella del manifesto diventa una pagina generata.
- **Niente riscritture.** Principi, tecniche, ricette, meccaniche e obiettivi restano come sono; si aggiungono
  pochi campi.

## I legami: pochi, con un nome, scritti una volta

Ogni legame sta in un campo, dal lato che lo conosce. Il verso opposto lo calcolano gli strumenti.

| Da | Campo | A | Stato |
|---|---|---|---|
| principio, tecnica, ricetta | `legge` | legge | **nuovo** (67 schede, una riga ciascuna) |
| meccanica | `leggi`, `motivo`, `effetto`, `dinamica` | legge; le due facce a parole | **nuovo** (33 schede; base: la tabella del manifesto) |
| meccanica | `serve`, `tecniche`, `insegna` | principi, tecniche, obiettivi | c'è |
| ricetta | `in_salem` | meccaniche | c'è |
| obiettivo | `concetti` | concetti (per famiglia: «gli Arcani maggiori») | **nuovo** (14 schede) |
| concetto | `peso` | `nucleo` o `contorno` (legge 1) | **nuovo** (una parola per scheda; il nucleo è già scritto: `nome` + `in_breve`) |
| concetto | elemento, pianeta, intenzioni… | concetti (il cerchio) | c'è |
| concetto | `sta_in` | luogo | **nuovo, generato** dai dati del mondo |
| fatto, persona, retroscena | chi, dove, conseguenze | persone, luoghi, fatti | c'è |

Si tolgono i campi doppi (`dove_la_usiamo` nelle tecniche, `meccaniche` negli obiettivi): sono il verso opposto
di campi che esistono già, e sono già andati fuori sincrono due volte.

La catena che ne esce, sempre nello stesso verso:

    legge → principio / tecnica / ricetta → meccanica → obiettivo → concetto → luogo → persone e fatti

## Tre viste (i «grafi»)

Le cartelle dicono di chi è una scheda; le viste dicono che cosa si guarda. Sono filtri per tipo, come
pulsanti nel visore del browser (e come colori in Obsidian).

1. **Perché il gioco insegna**: leggi al centro, intorno principi, tecniche e ricette, sul bordo le
   meccaniche. Si legge: «questa legge → si fa così in Salem».
2. **Che cosa si impara, e dove**: obiettivi → concetti (nucleo grande, contorno piccolo) → luoghi; le
   meccaniche compaiono come ciò che verifica un obiettivo.
3. **La storia**: persone, luoghi, fatti, retroscena.
4. Tutto insieme, con le zone a colori.

Scelte, finali e tratti non compaiono in nessuna vista (restano file per i test).

Per renderle esplicative, nel visore:
- **i legami hanno un nome** (passando sopra: «insegna», «sta in», «serve»), perché vengono da campi con un nome;
- **la catena di una scheda**: aprendo una scheda qualsiasi si vede il filo dalla legge al luogo («perché c'è»);
- le leggi sono i nodi più grandi; il nucleo del corso più grande del contorno.

## Due pagine generate che mostrano i buchi

- `corso/_sei-voci.md`: per ogni concetto del nucleo le sei voci dell'unità di crescita (nucleo, corpo, posto,
  motivo, uso, ritorno), con una casella vuota dove manca. È la tabella che in Mnemopolis dirà se una casa è
  finita.
- `metodo/_dinamiche.md`: la tabella del manifesto con, per ogni dinamica, le meccaniche di Salem, il loro
  motivo e il loro effetto.

## Controlli (pochi)

1. Ogni meccanica ha `motivo`, `effetto` e almeno una legge.
2. Ogni obiettivo ha una meccanica che lo insegna e dichiara i suoi concetti; ogni concetto del nucleo è
   coperto da un obiettivo e ha un posto.
3. Una scheda `generale` del metodo non punta fuori dal metodo, tranne che in `in_salem`.
4. Quelli che ci sono già (collegamenti rotti, campi mancanti, pagine generate vecchie, il cerchio).

## Passi

Ognuno finisce con i test verdi e con qualcosa che si vede nel visore.

| # | Passo | Si vede |
|---|---|---|
| 1 | Spostare le cartelle nelle tre zone; aggiornare strumenti e visore; pulsanti delle tre viste, colori per zona, generati nascosti | tre grafi nel browser |
| 2 | Dieci schede `legge`; `legge` su principi, tecniche, ricette; `leggi`, `motivo`, `effetto`, `dinamica` sulle meccaniche; pagina `_dinamiche` | la vista 1 ha una spina |
| 3 | `peso` sui concetti; `concetti` sugli obiettivi; `sta_in` generato; pagina `_sei-voci` | la vista 2 lega concetti e luoghi; elenco dei buchi |
| 4 | Togliere i campi doppi; `ambito` e controllo 3 | il metodo è pulito |
| 5 | Legami con il nome e «la catena» nel visore; pagina d'ingresso con le tre porte | il grafo si spiega da solo |
| 6 | Prova: copiare le schede generali in Mnemopolis | se serve ritoccarle, non erano pulite |

Il passo 1 va da solo (sposta tutto). I passi 2 e 3 possono andare insieme (zone diverse). Non si riempiono
a mano le schede di persone e luoghi: il loro contenuto c'è già, nei campi.

## Rischi

- Spostare 600 file: i link sono per nome, non per cartella, e gli strumenti leggono quasi tutto per tipo; i
  percorsi fissi sono pochi (`GEN_DIRS`, il cerchio, i colori di Obsidian). Si fa in un commit solo, con i test.
- I campi nuovi delle meccaniche sono scrittura: li propone un agente dalla tabella del manifesto, li rilegge
  il capofila.
- `sta_in` generato funziona per carte, erbe, pietre, figurine (hanno un posto nei dati); per pianeti ed
  elementi non c'è un posto: restano contorno senza luogo, ed è giusto così.
