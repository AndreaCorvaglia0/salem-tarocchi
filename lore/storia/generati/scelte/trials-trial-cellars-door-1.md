---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di trial.cellars.door"
dove: "trials.js#trial.cellars.door"
fatto: "[[prova-delle-porte-di-sotto]]"
classe: "entrambe"
opzioni:
  - { t: "Prendo il bastone, per riportarglielo io.", imposta: "tono +1" }
  - { t: "Lo lascio dov'è, e guardo dove portano i corridoi.", imposta: "esplora +1" }
  - { t: "Resto ferma al buio ad ascoltare, prima di toccare qualunqu…", quando: "trait parola <= -3", imposta: "parola -1" }
---

Scelta 1 della scena `trial.cellars.door` (trials.js), dentro un ramo: notFlag trial.cellars.offered.

1. «Prendo il bastone, per riportarglielo io.»: tono +1.
2. «Lo lascio dov'è, e guardo dove portano i corridoi.»: esplora +1.
3. «Resto ferma al buio ad ascoltare, prima di toccare qualunqu…» (solo se trait parola <= -3): parola -1.
