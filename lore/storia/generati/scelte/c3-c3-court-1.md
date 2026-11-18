---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c3.court"
dove: "c3.js#c3.court"
fatto: "[[ingresso-in-tribunale]]"
classe: "entrambe"
opzioni:
  - { t: "«Mi chiamo {name}. Se dovete processare qualcuno, processat…", imposta: "parola +1, guida -1, punto m11, seme s" }
  - { t: "«Lei non c'entra. La strega della capanna sono io.»", imposta: "guida +1, rischio +1, punto m07, seme w" }
  - { t: "Prima di parlare cerco tra la gente la cuoca del Giudice.", quando: "flag client.c3.cook.done", imposta: "flag court.cook, esplora +1" }
  - { t: "«Mi chiamo {name}. La mia carta è {yourCard}, e non l'ho ma…", quando: "non (yourCard m00)", imposta: "flag court.card, parola +1, rischio +1" }
---

Scelta 1 della scena `c3.court` (c3.js).

1. ««Mi chiamo {name}. Se dovete processare qualcuno, processat…»: parola +1, guida -1, punto m11, seme s.
2. ««Lei non c'entra. La strega della capanna sono io.»»: guida +1, rischio +1, punto m07, seme w.
3. «Prima di parlare cerco tra la gente la cuoca del Giudice.» (solo se flag client.c3.cook.done): flag court.cook, esplora +1.
4. ««Mi chiamo {name}. La mia carta è {yourCard}, e non l'ho ma…» (solo se non (yourCard m00)): flag court.card, parola +1, rischio +1.
