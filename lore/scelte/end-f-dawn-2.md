---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "scelta"
nome: "Scelta 2 di f.dawn"
dove: "end.js#f.dawn"
fatto: "[[volo-all-alba]]"
classe: "entrambe"
opzioni:
  - { t: "È facile: parti, e il resto lo capisci in aria.", imposta: "rischio +1, punto m00, seme w" }
  - { t: "Stammi dietro, fai quello che faccio io e non guardare giù.", imposta: "rischio -1, punto m07, seme w" }
  - { t: "Ti dico quello che Malva ha detto a me: tienila bassa, e pe…", quando: "flag lesson.fly", imposta: "parola +1, fiducia ginepra +1" }
  - { t: "Guarda Tartufo, che ti fa vedere dove si mettono i piedi.", quando: "tartufo 3", imposta: "tono +1" }
---

Scelta 2 della scena `f.dawn` (end.js).

1. «È facile: parti, e il resto lo capisci in aria.»: rischio +1, punto m00, seme w.
2. «Stammi dietro, fai quello che faccio io e non guardare giù.»: rischio -1, punto m07, seme w.
3. «Ti dico quello che Malva ha detto a me: tienila bassa, e pe…» (solo se flag lesson.fly): parola +1, fiducia ginepra +1.
4. «Guarda Tartufo, che ti fa vedere dove si mettono i piedi.» (solo se tartufo 3): tono +1.
