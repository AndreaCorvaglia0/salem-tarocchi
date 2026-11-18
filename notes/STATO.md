# Stato del lavoro (checkpoint)

Si aggiorna a ogni passo chiuso. **Per la revisione:** `notes/VERIFICA.md` (che cosa è verificato, che cosa no, i dubbi, voce per voce). Se una sessione si interrompe, la prossima riparte da qui: legge questa
pagina, `git log --oneline -15`, `git status`, e riprende dal primo punto non chiuso.

Ordine deciso da Andrea il 18 novembre, 00:29: «fai tutto uno dietro l'altro senza fermarti», con checkpoint.

## Coda

| # | Lavoro | Stato | Dove guardare |
|---|---|---|---|
| 0 | Mappa: solo quello che lei sa + note dei luoghi | **fatto, pubblicato** (main 602c0df, gh-pages 2896b60) | `tests/knows-only.test.mjs` |
| 1 | Rito dell'incenso (`notes/rito/PROGETTO.md`) | **fatto, pubblicato** (main 3b8bc48, gh-pages 2704fe8); musiche provvisorie fino all'ascolto alla cieca: https://andreacorvaglia0.github.io/salem-tarocchi/ascolto/ ; codice → `node scripts/audio/ascolto-decode.mjs <codice>` | `notes/rito/costruzione.md`, `notes/rito/musica.md` |
| 2 | Promesse (BACKLOG 1.1–1.4) | **fatto, pubblicato** (main 7213183, gh-pages bdf2829). Debito: `progress.addTrust` dovrebbe chiamare `addBond` e `cond.js` leggere `bonds`, poi togliere la copia `trust` | schermate in `/home/claude/shots/promesse/` |
| 3 | Collezioni: pietre e sibilla | **fatto, pubblicato** (main 7a28077, gh-pages c3bf1a1) | `notes/collezioni.md`; **le 36 carte della sibilla già ritagliate e controllate** in `/home/claude/ext/sibilla/cards/01..36.jpg` (ordine giusto, foglio di prova `contact.jpg`) |
| 4 | Test dei lettori ingenui sul villaggio | **fatto** per Malva, biblioteca, bottega (correzione pubblicata: main 41ba213, gh-pages 1429248); quartieri da rifare con inquadratura migliore | `notes/village-test.md` |
| 5 | Libri in biblioteca: pagina di concetto + tre libri di prova | **scritto**, in attesa delle risposte di Andrea (6 domande in fondo a `notes/libri/CONCETTO.md`) | BACKLOG sezione 7 |
| 6 | Imparare meglio (BACKLOG 2) | **fatto, pubblicato** (main 95eec8b, gh-pages 500d95e) | |
| 7 | Sibilla: il gioco delle coppie (BACKLOG 3.0) | **fatto, pubblicato** (main 610b172, gh-pages 334528b) | |
| 8 | Interessi da strega: pagina di progetto | **approvata** (`lore/storia/decisioni/decisioni-2026-11-18.md`) |
| 9 | Interessi: prima fetta (Ortica, erbe, tre missioni) | **fatto, pubblicato** (main 6c4861e) |
| 10 | Libri: scaffale in biblioteca, primi cinque libri | **fatto, pubblicato** (main 0ee9952, gh-pages 0ef7d33). Mancano: i due libri della Lettrice (Court de Gébelin 1781, Waite 1911: scansione di Waite non trovata), gli altri del catalogo | BACKLOG sezione 6 |
| 11 | Pietre: immagini | **fatto, pubblicato** (main 809e9a6, gh-pages 5b8154a): eliotropio da Kurr 1859, sei pietre dipinte al computer |
| 12 | Interessi: pietre di Edera, missioni 1–3 + grado 1 | **fatto, pubblicato** (main 8ac1bb4, gh-pages 235f646). Da fare: missioni 4–6 (nella 6 il nome vero) |

## Riordino del vault (via libera di Andrea, 18/11 13:49) — piano in `notes/lore-grafo-PIANO.md`, radice `docs/MANIFESTO.md`

| Passo | Che cosa | Stato |
|---|---|---|
| V1a | Spostare le cartelle nelle tre zone, tipi `ricetta` e `concetto`, strumenti e riferimenti | **fatto, pubblicato** (main dd63c35): 744 file spostati, 654 test, check 0 errori |
| V1b | Visore: tre viste con disposizione propria, generati nascosti | agente in corso |
| V2 | Dieci schede `legge`; `legge` su principi/tecniche/ricette; `leggi`, `motivo`, `effetto`, `dinamica` sulle meccaniche; `_dinamiche` (specifica: `notes/vault/V2-spec.md`) | agente in corso |
| V3 | `peso` sui concetti; `concetti` sugli obiettivi; `sta_in` generato; `_sei-voci` | da fare |
| V4 | Togliere i campi doppi; `ambito` e controllo «il metodo generale non nomina Salem» | da fare |
| V5 | Legami con il nome e «la catena» nel visore; pagina d'ingresso | da fare |
| V6 | Prova: copiare il metodo generale in Mnemopolis | da fare (chiedere ad Andrea prima di toccare la repo di Mnemopolis) |

## Da dove ripartire (scritto il 18/11 alle 10:55, token quasi finiti)

Tutto è committato e pubblicato fino a main 8ac1bb4 / gh-pages 235f646; nessun agente in corso.
Ordine proposto, a pezzi piccoli e paralleli (due agenti, cartelle separate):
1. Interessi: prima fetta di Malva (fumi e sacchetti, 3 missioni), riusando la macchina di Ortica/Edera.
2. Interessi: Edera missioni 4–6 (nella 6 il nome vero, deciso da Andrea).
3. Ortica missioni 4–6; poi Ginepra (il banco dell'ambulante con un nome: deciso).
4. I due libri della Lettrice (Court de Gébelin 1781; Waite 1911, scansione da trovare).
5. Debiti piccoli (sotto).
Prima di tutto: far rileggere `notes/VERIFICA.md` (revisione con Fable chiesta da Andrea).

## Dopo la coda (in attesa di Andrea)

- Ascolto alla cieca del rito: codici da decodificare con `node scripts/audio/ascolto-decode.mjs`.
- Debiti piccoli: `addTrust`→`addBond` e `cond.js` su `bonds`; pietre disegnate da sostituire con tavole;
  opzioni sbagliate nelle letture ai clienti prese dalla stessa stesa; quartiere basso da rifotografare.

## Regole del giro

- Pubblicare solo se nella copia pulita i test danno `# fail 0` (controllarlo con `grep -q '^# fail 0'`, non solo stamparlo: il 18/11 un test fallito non ha fermato la pubblicazione).
- Pubblicare solo da una copia pulita di main (`git worktree add /home/claude/wt HEAD`, link a node_modules,
  `npm test`, `sh scripts/deploy.sh` dalla copia), così i file a metà di un agente non vanno online.
- Al massimo due agenti insieme, cartelle separate; il capofila guarda le schermate, testa, committa, pubblica.
- Dopo ogni punto: aggiornare questa tabella, committare, e scrivere ad Andrea due righe.
- Mai: aggiornare l'artefatto Claude; aggirare blocchi di rete (Wikimedia 429: una richiesta alla volta).
- A ogni lavoro chiuso: aggiornare anche `notes/VERIFICA.md`.
- Escludere sempre `scripts/fetch-old-cards.py` dai commit.
