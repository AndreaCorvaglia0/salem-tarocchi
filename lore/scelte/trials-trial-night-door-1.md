---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di trial.night.door"
dove: "trials.js#trial.night.door"
fatto: "[[prova-del-cesto]]"
classe: "entrambe"
opzioni:
  - { t: "Le chiedo che cosa c'è nel cesto.", imposta: "esplora +1" }
  - { t: "Le chiedo soltanto a che ora devo venire.", imposta: "esplora -1" }
  - { t: "Le dico che prima voglio vedere la strada di giorno.", quando: "trait rischio <= -3", imposta: "rischio -1" }
---

Scelta 1 della scena `trial.night.door` (trials.js), dentro un ramo: notFlag trial.night.offered.

1. «Le chiedo che cosa c'è nel cesto.»: esplora +1.
2. «Le chiedo soltanto a che ora devo venire.»: esplora -1.
3. «Le dico che prima voglio vedere la strada di giorno.» (solo se trait rischio <= -3): rischio -1.
