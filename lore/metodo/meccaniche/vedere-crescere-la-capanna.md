---
tipo: "meccanica"
nome: "Vedere crescere la capanna"
dinamica: "casa"
leggi:
  - "[[legge-e-lei-a-decidere]]"
  - "[[legge-si-entra-piano]]"
motivo: "È casa mia: parte sbilenca e voglio vederla diventare la casa di una strega."
effetto: "Il progresso si vede in un posto e porta cose della mia partita (riferimento a sé): una competenza da guardare."
fonte: "copione"
dove:
  - "src/world/home.js"
  - "src/glue/home.js"
  - "src/data/story/barks.js"
  - "notes/buildings.md"
cosa_fa_la_giocatrice: "La sua capanna nel villaggio cambia sagoma in tre stadi: sbilenca all'inizio; rimessa a posto quando ha l'orto, o è arrivata al capitolo 3, o ha il secondo titolo; la casa di una strega dopo il finale. Il terzo stadio prende tre cose dalla sua partita: il seme che le somiglia, le piante delle sue aiuole (fino a quattro) e un premio vinto in una prova. La prima volta che vede uno stadio nuovo, Tartufo a voce bassa (o un suo pensiero) dice una riga."
serve:
  - "[[arriva-a-chi-e-avanti]]"
  - "[[interfaccia-che-premia]]"
insegna: []
tecniche:
  - "[[riferimento-a-se]]"
  - "[[autonomia-competenza-legami]]"
ragione_nel_gioco: "È la sua casa: parte sbilenca e piena di spifferi, e migliora con lei."
premio: "Nessun punto: il premio è vedere la casa diversa."
rischio: "Nessuno."
tratti: "Nessuno direttamente; il seme viene dal ritratto (yourSuit in src/core/progress.js)."
aperto: "Lo stadio dipende da quello che lei ha (il giardino, il capitolo, il titolo, il finale visto), mai dal passo corrente: chi è già avanti vede subito lo stadio giusto, e sente solo la riga dell'ultimo."
---

Non c'è un numero che sale: il progresso si vede in un posto. Lo stadio non è salvato, si ricava ogni volta da quello che lei ha, così una partita vecchia mostra subito quello giusto.
