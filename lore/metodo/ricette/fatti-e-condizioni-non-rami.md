---
tipo: ricetta
nome: "Fatti e condizioni, non rami"
famiglia: variare
ambito: generale
problema: "Una storia a rami raddoppia il lavoro a ogni scelta, e dopo tre scelte nessuno la controlla più."
soluzione: "Una scelta lascia un fatto (un flag) e la scena si ricongiunge subito. Le scene dopo guardano i fatti con condizioni semplici e cambiano una riga, una risposta, un aiuto."
in_salem:
  - "[[arriva-a-chi-e-avanti]]"
  - "[[pochi-concetti-legati]]"
  - "[[bivio-della-piazza]]"
si_controlla_con: "tests/story.data.test.mjs (ogni condizione usa chiavi note a src/core/cond.js); tests/story.paths.test.mjs (ogni copione percorso in tutte le combinazioni di risposte)"
rischi: "Troppi flag con nomi poco chiari non li ricorda più nessuno. Un flag che nessuna scena legge è lavoro sprecato."
fonte: "DESIGN.md, Scelte; Le streghe e la storia («Ginepra viene sempre presa e sempre salvata. Cambia come, con chi, cosa vi dite.»)"
---

Le condizioni sono oggetti semplici, scritti in testa a src/core/cond.js: `{ flag }`, `{ has: 'm02' }`, `{ trait: ['tono', '<=', -3] }`, `{ attitude: { edera: 'brontola' } }`. Sono le stesse per i copioni, il mondo, il registro e le prove. notes/paths.md elenca i piccoli rami di ogni scena, dove si ricongiungono e chi li ricorda.

La storia grande ha solo tre bivi veri. Tutto il resto è colore che cambia sopra la stessa strada.

Per un altro gioco: Mnemopolis ha già funzioni dello stato come `tierOf` ed `endingOf`. Una lingua di condizioni comune, come cond.js, permetterebbe a un generatore di scrivere varianti senza scrivere codice.
