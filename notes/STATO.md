# Stato del lavoro (checkpoint)

Si aggiorna a ogni passo chiuso. Se una sessione si interrompe, la prossima riparte da qui: legge questa
pagina, `git log --oneline -15`, `git status`, e riprende dal primo punto non chiuso.

Ordine deciso da Andrea il 18 novembre, 00:29: «fai tutto uno dietro l'altro senza fermarti», con checkpoint.

## Coda

| # | Lavoro | Stato | Dove guardare |
|---|---|---|---|
| 0 | Mappa: solo quello che lei sa + note dei luoghi | **fatto, pubblicato** (main 602c0df, gh-pages 2896b60) | `tests/knows-only.test.mjs` |
| 1 | Rito dell'incenso (`notes/rito/PROGETTO.md`) | **fatto, pubblicato** (main 3b8bc48, gh-pages 2704fe8); musiche provvisorie fino all'ascolto alla cieca: https://andreacorvaglia0.github.io/salem-tarocchi/ascolto/ ; codice → `node scripts/audio/ascolto-decode.mjs <codice>` | `notes/rito/costruzione.md`, `notes/rito/musica.md` |
| 2 | Promesse (BACKLOG 1.1–1.4) | **fatto, pubblicato** (main 7213183, gh-pages bdf2829). Debito: `progress.addTrust` dovrebbe chiamare `addBond` e `cond.js` leggere `bonds`, poi togliere la copia `trust` | schermate in `/home/claude/shots/promesse/` |
| 3 | Collezioni: pietre e sibilla come l'erbario | agente in corso | `notes/collezioni.md`; **le 36 carte della sibilla già ritagliate e controllate** in `/home/claude/ext/sibilla/cards/01..36.jpg` (ordine giusto, foglio di prova `contact.jpg`) |
| 4 | Test dei lettori ingenui sul villaggio | primo giro fatto: Malva/Proctor confuse, biblioteca non trovata → agente arte in corso; poi rifare il test (scatti in `/home/claude/shots/village-new/after2/`) | `notes/village-test.md` |
| 5 | Libri in biblioteca: pagina di concetto + tre libri di prova | da fare | BACKLOG sezione 7 |
| 6 | Imparare meglio (BACKLOG 2.1–2.4) | da fare | |
| 7 | Sibilla: il gioco delle coppie (BACKLOG 3.0) | da fare, dopo 3 | |
| 8 | Interessi da strega: pagina di progetto | da fare | BACKLOG sezione 6 |

## Regole del giro

- Pubblicare solo da una copia pulita di main (`git worktree add /home/claude/wt HEAD`, link a node_modules,
  `npm test`, `sh scripts/deploy.sh` dalla copia), così i file a metà di un agente non vanno online.
- Al massimo due agenti insieme, cartelle separate; il capofila guarda le schermate, testa, committa, pubblica.
- Dopo ogni punto: aggiornare questa tabella, committare, e scrivere ad Andrea due righe.
- Mai: aggiornare l'artefatto Claude; aggirare blocchi di rete (Wikimedia 429: una richiesta alla volta).
- Escludere sempre `scripts/fetch-old-cards.py` dai commit.
