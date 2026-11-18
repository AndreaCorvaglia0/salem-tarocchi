---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di c3.trial"
dove: "end.js#c3.trial"
fatto: "[[processo-davanti-al-giudice]]"
classe: "entrambe"
opzioni:
  - { t: "«Sono pronta: chiedete pure.»", imposta: "guida -1, esplora -1, punto m11, seme s" }
  - { t: "Prima di rispondere guardo Ginepra, e non lui.", imposta: "guida +1, fiducia ginepra +1, punto m07, seme c" }
  - { t: "«Cominciamo pure, e dopo, se avanza tempo, mi racconta dell…", quando: "trait tono <= -3", imposta: "flag trial.candles, tono -1" }
  - { t: "«I suoi conestabili me ne hanno già fatte tante, di domande…", quando: "stat examsPassed >= 5 e stat examsFailed == 0", imposta: "rischio +1" }
---

Scelta 1 della scena `c3.trial` (end.js).

1. ««Sono pronta: chiedete pure.»»: guida -1, esplora -1, punto m11, seme s.
2. «Prima di rispondere guardo Ginepra, e non lui.»: guida +1, fiducia ginepra +1, punto m07, seme c.
3. ««Cominciamo pure, e dopo, se avanza tempo, mi racconta dell…» (solo se trait tono <= -3): flag trial.candles, tono -1.
4. ««I suoi conestabili me ne hanno già fatte tante, di domande…» (solo se stat examsPassed >= 5 e stat examsFailed == 0): rischio +1.
