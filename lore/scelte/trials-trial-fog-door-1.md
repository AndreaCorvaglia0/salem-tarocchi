---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di trial.fog.door"
dove: "trials.js#trial.fog.door"
fatto: "[[prova-della-nebbia]]"
classe: "entrambe"
opzioni:
  - { t: "Le chiedo se quella nebbia è pericolosa davvero.", imposta: "rischio -1" }
  - { t: "Le dico che la nebbia non mi fa paura.", imposta: "rischio +1" }
  - { t: "Le chiedo se c'è una regola per uscirne.", quando: "trait guida <= -3", imposta: "guida -1" }
---

Scelta 1 della scena `trial.fog.door` (trials.js), dentro un ramo: notFlag trial.fog.offered.

1. «Le chiedo se quella nebbia è pericolosa davvero.»: rischio -1.
2. «Le dico che la nebbia non mi fa paura.»: rischio +1.
3. «Le chiedo se c'è una regola per uscirne.» (solo se trait guida <= -3): guida -1.
