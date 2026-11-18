---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di trial.grave.door"
dove: "trials.js#trial.grave.door"
fatto: "[[prova-della-tomba]]"
classe: "entrambe"
opzioni:
  - { t: "Le dico che l'accompagno io.", imposta: "tono +1" }
  - { t: "Le chiedo di chi ha paura che sia.", imposta: "parola +1" }
  - { t: "Le dico che ormai in tante vengono da me, e che nessuna è r…", quando: "pop 2", imposta: "guida +1" }
  - { t: "Le prendo le mani, che sono gelate, e gliele tengo finché n…", quando: "trait guida >= 3", imposta: "guida +1, tono +1" }
---

Scelta 1 della scena `trial.grave.door` (trials.js), dentro un ramo: notFlag trial.grave.offered.

1. «Le dico che l'accompagno io.»: tono +1.
2. «Le chiedo di chi ha paura che sia.»: parola +1.
3. «Le dico che ormai in tante vengono da me, e che nessuna è r…» (solo se pop 2): guida +1.
4. «Le prendo le mani, che sono gelate, e gliele tengo finché n…» (solo se trait guida >= 3): guida +1, tono +1.
