---
tipo: ricetta
nome: "Il finale si progetta per primo"
famiglia: variare
ambito: generale
problema: "Un finale scritto per ultimo non trova nel salvataggio le cose che gli servono."
soluzione: "Si decide prima che cosa il finale dirà di lei, poi si fa in modo che il gioco lo registri lungo la strada: la carta su cui ha sbagliato di più, il suo valore, la sua paura, il suo sogno, chi si fida di più di lei."
in_salem:
  - "[[alla-fine-il-suo-mazzo]]"
  - "[[la-lettrice-legge-lei]]"
  - "[[seduta-finale]]"
  - "[[lettrice]]"
si_controlla_con: "tests/glue.test.mjs (la croce finale); tests/story.data.test.mjs (ogni foglia delle sedute lascia un flag)"
rischi: "Un dato che il finale legge ma che pochi percorsi riempiono: serve sempre una riserva. finalCards sostituisce un buco con un Maggiore che lei ha."
fonte: "DESIGN.md, Finale"
---

`finalCards` in src/glue/finale.rules.js costruisce le dieci carte: la sua carta, quella più sbagliata (`mostMissed`), quella di nascita, quella del terzo bivio, le foglie `leaf.value`, `leaf.fear` e `leaf.dream` scelte nelle sedute, la carta di chi si fida di più di lei, e due pescate. Ognuno di questi dati esiste perché il finale lo chiedeva.

Il catalogo dei finali e delle varianti sta in lore/storia/generati/finali, che scrive un altro agente.

Per un altro gioco: Mnemopolis ha già `endingOf` e le regole `ENDING_RULES`, decise prima di costruire i finali. Il passo in più è far leggere al finale cose personali (il concetto più sbagliato, la casa tornata più volte), non solo un livello.
