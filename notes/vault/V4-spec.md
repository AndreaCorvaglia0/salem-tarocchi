# Vault, passo V4: un verso solo, l'ambito, e le sei voci più vere (specifica del capofila)

## 1. Ogni legame si scrive una volta sola

Si tolgono dai file e dalla tabella di `lore/README.md` i campi che sono il verso opposto di un campo che esiste:

| Campo da togliere | Da | È il rovescio di |
|---|---|---|
| `dove_la_usiamo` | tecniche | `tecniche` delle meccaniche |
| `meccaniche` | obiettivi | `insegna` delle meccaniche |

Prima di togliere: per ogni coppia verificare che il rovescio dica la stessa cosa. Dove il campo da togliere
contiene un legame che il campo diretto NON ha (una tecnica dice di essere usata in una meccanica che non la
elenca), **non perderlo**: aggiungerlo al campo diretto della meccanica se leggendo la scheda è vero, altrimenti
elencarlo nel resoconto. Gli strumenti che leggevano quei campi (`check.mjs`, `corso.mjs`, `dinamiche.mjs`, la
matrice, i test) usano il verso calcolato. `dove_manca` delle tecniche e `aperto` degli obiettivi restano.

## 2. `ambito` su tutte le schede del metodo

`ambito: generale | salem`. Le ricette ce l'hanno già. Da aggiungere:

- **leggi**: tutte `generale`.
- **tecniche**: tutte `generale`.
- **principi**: `salem` per alla-fine-il-suo-mazzo, erbe-come-storia, la-lettrice-legge-lei,
  le-carte-servono-a-muoversi, leggere-e-l-attivita-vera; `generale` tutti gli altri.
- **meccaniche**: tutte `salem`.

Controllo nuovo (**avvisi**, non errori: è l'elenco del lavoro di generalizzazione ancora da fare, da non
risolvere adesso):

- in una scheda `generale`, un collegamento a una scheda `salem` o a una scheda di `corso/` o `storia/` fuori dai
  campi dichiarati «di Salem» (`in_salem`, `dove_manca`, `si_controlla_con`, `lezioni`, `aperto`);
- in una scheda `generale`, nei campi non «di Salem» e nel testo, una di queste parole: Salem, e i nomi delle
  persone principali (Malva, Ortica, Edera, Ginepra, Tartufo, Lettrice).

Un avviso per scheda, con l'elenco di ciò che ha trovato. In fondo a `lore.mjs check` una riga: «N schede
generali parlano ancora di Salem». Non riscrivere le schede.

## 3. `concetti` sulle meccaniche, e le sei voci calcolate da lì

Oggi `_sei-voci` deduce motivo, uso e ritorno passando per gli obiettivi («una meccanica con la legge 2 che
insegna un obiettivo che riguarda la famiglia»): è troppo largo e dà dei «sì» falsi (per le stese risulta come
corpo «coltivare le erbe con Ortica»). Si aggiunge alle meccaniche il campo `concetti` (nomi di famiglia, come
negli obiettivi) e le voci corpo, motivo, uso e ritorno si calcolano così: *una meccanica che dichiara quella
famiglia e ha la legge 3 / 2 / 5 / 8*. Il corpo resta vero anche per l'immagine propria del concetto.

Proposta del capofila, **da verificare scheda per scheda** leggendo `cosa_fa_la_giocatrice` e il codice in
`dove`: qui l'agente corregge dove la scheda dice altro, e lo elenca nel resoconto.

| Meccanica | concetti |
|---|---|
| affrontare-le-prove | arcano |
| andare-altrove | arcano |
| aprire-i-sigilli | arcano |
| chiedere-alle-carte | arcano |
| coltivare-le-erbe-con-ortica | erba, intenzione, pianeta, fumo |
| curare-l-orto | erba |
| farsi-leggere-dalla-lettrice | arcano |
| girare-la-carta-di-oggi | arcano, seme, numero, figura, regola, storia |
| imparare-da-ortica | erba |
| leggere-ai-clienti | arcano, seme, numero, figura, stesa, regola |
| leggere-col-mazzo-vero | arcano, seme, numero, figura, stesa, regola |
| leggere-i-libri | erba, storia, pianeta, elemento |
| leggere-per-se | arcano, seme, numero, figura, stesa, regola |
| leggere-per-strada | arcano |
| raccogliere-le-erbe | erba |
| raccogliere-pietre-e-figurine | pietra, pianeta, elemento, intenzione |
| ripassare | arcano, seme, numero, figura |
| riprendere-le-carte-sequestrate | arcano |
| rispondere-a-memoria | arcano |
| scegliere-le-pietre-con-edera | pietra, intenzione, pianeta |
| seguire-le-lezioni | arcano, seme, numero, figura, stesa, regola |
| studiare-in-biblioteca | arcano, seme, numero, figura, stesa, regola |
| superare-l-esame | arcano, seme |
| trovare-una-carta | arcano, seme, numero, figura |
| accendere-il-fumo | fumo, intenzione, pianeta, elemento |
| scegliere-nella-storia | arcano |
| sfogliare-gli-album | erba, pietra, pianeta, elemento, intenzione |
| le altre (dire-cosa-pensa-degli-altri, far-crescere-la-luna, giocare-a-coppie-con-la-sibilla, legarsi-alle-streghe, salire-di-rango, spendere-in-bottega, stare-con-tartufo, volare-con-la-scopa, vedere-crescere-la-capanna, orientarsi-con-la-mappa, seguire-una-missione, annotare-i-luoghi) | `[]` (nessun concetto del corso) |

`concetti` è obbligatorio (anche vuoto). Nella pagina `_sei-voci`, in fondo, una sezione nuova: «Meccaniche che
non toccano nessun concetto» (è onesto vederle: tengono dentro, non insegnano il corso).

## 4. Test e strumenti

`node scripts/lore.mjs gen`, `check` (0 errori; dire quanti avvisi, e quanti sono quelli nuovi dell'ambito),
`npm test` verde, `node scripts/map.mjs`. Test nuovi in `tests/lore.verso.test.mjs`: i due campi non esistono
più in nessuna scheda; il rovescio calcolato copre tutto quello che c'era (salvare l'elenco prima di togliere);
ogni scheda del metodo ha `ambito`; ogni meccanica ha `concetti` con famiglie che esistono; `_sei-voci` non dà
più come corpo delle stese una meccanica delle erbe.

## 5. Non toccare

`lore-site/`, `scripts/lore/site.mjs`, `tests/lore.site.test.mjs`, `lore/.obsidian/` (un altro agente sta
rifinendo il visore), `lore/storia/` a mano, `src/`, `docs/MANIFESTO.md`. Mai git.

## Resoconto

Elenco dei legami che esistevano solo nel campo tolto (e che cosa ne è stato fatto); le correzioni alla tabella
dei `concetti` con il perché; la tabella riassuntiva di `_sei-voci` com'è adesso e i buchi che mostra; il numero
di schede generali che parlano ancora di Salem, con le cinque peggiori; risultati di check e test.
