---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di trial.kettle.door"
dove: "trials.js#trial.kettle.door"
fatto: "[[prova-del-paiolo]]"
classe: "entrambe"
opzioni:
  - { t: "Le dico che è una cosa da fare, e che ci sto.", imposta: "rischio +1" }
  - { t: "Le chiedo perché non glielo chiede e basta.", imposta: "parola +1" }
  - { t: "Le dico che ci vado io da sola, e lei fa il palo.", quando: "trait rischio >= 3", imposta: "rischio +1, guida -1" }
  - { t: "Le chiedo perché tiene tanto a quel paiolo.", quando: "trust ortica >= 2", imposta: "tono +1" }
---

Scelta 1 della scena `trial.kettle.door` (trials.js), dentro un ramo: notFlag trial.kettle.offered.

1. «Le dico che è una cosa da fare, e che ci sto.»: rischio +1.
2. «Le chiedo perché non glielo chiede e basta.»: parola +1.
3. «Le dico che ci vado io da sola, e lei fa il palo.» (solo se trait rischio >= 3): rischio +1, guida -1.
4. «Le chiedo perché tiene tanto a quel paiolo.» (solo se trust ortica >= 2): tono +1.
