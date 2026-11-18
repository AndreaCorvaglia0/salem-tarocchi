---
tipo: ricetta
nome: "Ogni riga del canone dice da dove viene"
famiglia: scrivere
ambito: generale
problema: "Chi scrive una scena nuova inventa un dettaglio plausibile, e dopo un mese nessuno sa più se è canone o fantasia."
soluzione: "Ogni riga del vault porta la sua fonte: copione (si vede nel gioco, con file e scena), deciso (lo ha deciso Andrea), proposto (non è canone finché Andrea non decide). Quello che manca va in `aperto`."
in_salem:
  - "[[protagonista]]"
  - "[[malva]]"
  - "[[lettrice]]"
si_controlla_con: "scripts/lore.mjs (lo scrive un altro agente, vedi docs/TOOLS.md); a mano, la lista «Dettagli proposti» di notes/lore-story.md"
rischi: "Le righe «proposto» si accumulano senza risposta. Le contraddizioni tra copioni (l'età di Malva, quanto resta in cella Ginepra) si scoprono solo leggendo tutto."
fonte: "lore/README.md, Canone («Niente viene inventato in silenzio»)"
---

Esempio: in lore/storia/persone/malva.md ogni voce ha `fonte: copione` e una scena come «c1.js#c1.malva»; i dubbi stanno in `aperto` («Quanti anni ha Malva?»). notes/lore-story.md raccoglie i buchi, le contraddizioni e i dettagli proposti, uno per riga, da confermare con un sì o con un no.

Per un altro gioco: un generatore di storie per Mnemopolis dovrebbe scrivere tutto come «proposto», con la scena da cui nasce, e diventerebbe canone solo dopo il sì di Andrea.
