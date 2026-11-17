---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 4 di c2.ortica"
dove: "c2.js#c2.ortica"
fatto: "[[arrivo-da-ortica]]"
classe: "entrambe"
opzioni:
  - { t: "Ha chiesto di me? E che cosa voleva sapere?", imposta: "esplora +1" }
  - { t: "Prima passo dal mulino, e poi vado da lei.", imposta: "esplora -1" }
  - { t: "Al mulino ci vado in volo, così il mugnaio lo vede arrivare…", quando: "power broom e flag lesson.fly", imposta: "flag mill.flew, rischio +1" }
---

Scelta 4 della scena `c2.ortica` (c2.js).

1. «Ha chiesto di me? E che cosa voleva sapere?»: esplora +1.
2. «Prima passo dal mulino, e poi vado da lei.»: esplora -1.
3. «Al mulino ci vado in volo, così il mugnaio lo vede arrivare…» (solo se power broom e flag lesson.fly): flag mill.flew, rischio +1.
