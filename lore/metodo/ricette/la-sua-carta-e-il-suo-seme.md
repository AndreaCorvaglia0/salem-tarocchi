---
tipo: ricetta
nome: "La sua carta e il suo seme"
famiglia: personalizzare
ambito: salem
problema: "Cinque numeri non dicono niente a chi gioca: serve un'immagine in cui riconoscersi."
soluzione: "I tratti scelgono l'Arcano che le somiglia di più in quel momento. Parte dalla carta del suo segno e si sposta con lei. Dagli stessi tratti viene il seme, che si scopre nel finale."
in_salem:
  - "[[la-lettrice-legge-lei]]"
  - "[[legarsi-alle-streghe]]"
  - "[[conoscere-pianeti-e-segni]]"
  - "[[protagonista]]"
si_controlla_con: "tests/core.portrait.test.mjs; tests/core.test.mjs (il seme viene dai tratti, il segno decide i pareggi)"
rischi: "Una carta che cambia troppo spesso perde senso: un piccolo vantaggio alla carta già annunciata (`KEEP`) la tiene ferma. Le firme delle carte sono una scelta nostra, non un dato della tradizione."
fonte: "DESIGN.md, Il ritratto («La tua carta», «Il tuo seme»)"
---

`cardScores` e `yourCard` in src/core/progress.js confrontano i tratti con la firma di ogni Maggiore (`SIGNATURES` in src/data/portrait.js). La carta di nascita parte avanti, e il vantaggio si spegne mentre i tratti si riempiono. `SUIT_OF_TRAITS` fa lo stesso per il seme. Il grimorio mostra la carta con tre parole sotto, per esempio «Curiosa, schietta, gentile».

È legato ai tarocchi, per questo è segnato come Salem.

Per un altro gioco: in un corso di Mnemopolis il simbolo potrebbe essere un elemento del corso che le somiglia (un colore, una scala musicale). Funziona solo dove gli elementi hanno un carattere, e non tutti i corsi ce l'hanno.
