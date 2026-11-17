---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 1 di ortica.chat"
dove: "c2.js#ortica.chat"
fatto: "[[ortica-ascolta-una-storia]]"
classe: "entrambe"
opzioni:
  - { t: "Mi ripeti come si leggono le tre carte?", imposta: "-" }
  - { t: "Raccontami qualcosa che non dovrei sapere.", imposta: "flag side.m09, fiducia ortica +1, flag ortica.gossip" }
  - { t: "Nel folto del bosco c'è una nebbia che mi ha riportata indi…", quando: "flag fog.lost", imposta: "-" }
  - { t: "Dall'alto ho visto il bosco intero: dimmi tu che cosa mi è …", quando: "power broom e flag lesson.fly", imposta: "-" }
  - { t: "Stavolta siediti tu, Ortica: ti racconto io una cosa.", quando: "title strega", imposta: "tool bottle, fiducia ortica +1, flag ortica.listened" }
---

Scelta 1 della scena `ortica.chat` (c2.js).

1. «Mi ripeti come si leggono le tre carte?»: niente.
2. «Raccontami qualcosa che non dovrei sapere.»: flag side.m09, fiducia ortica +1, flag ortica.gossip; quello che segue dipende dallo stato.
3. «Nel folto del bosco c'è una nebbia che mi ha riportata indi…» (solo se flag fog.lost): niente.
4. «Dall'alto ho visto il bosco intero: dimmi tu che cosa mi è …» (solo se power broom e flag lesson.fly): niente.
5. «Stavolta siediti tu, Ortica: ti racconto io una cosa.» (solo se title strega): tool bottle, fiducia ortica +1, flag ortica.listened.
