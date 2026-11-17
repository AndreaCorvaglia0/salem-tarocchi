---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "tratto"
nome: "Fiducia e legame con ginepra"
cosa: "Quello che lei e ginepra hanno costruito insieme: la fiducia dei copioni (state.trust) nutre il legame (state.bonds, glue/witches.js)."
stabilisce:
  - { dove: "c1b.js#c1.cart", n: 1, scelta: "[[c1b-c1-cart-1]]" }
  - { dove: "c1b.js#c1.cart", n: 1, scelta: "[[c1b-c1-cart-1]]" }
  - { dove: "c1b.js#c1.venus", n: 1, scelta: "[[c1b-c1-venus-2]]" }
  - { dove: "c1b.js#c1.venus", n: 1, scelta: "[[c1b-c1-venus-2]]" }
  - { dove: "c1b.js#c1.venus", n: 1, scelta: "[[c1b-c1-venus-2]]" }
  - { dove: "c1b.js#c1.square", n: 1, scelta: "[[c1b-c1-square-1]]" }
  - { dove: "c1b.js#c1.square", n: 1, scelta: "[[c1b-c1-square-1]]" }
  - { dove: "c2.js#c2.fire", n: 1, scelta: "[[c2-c2-fire-1]]" }
  - { dove: "c2.js#c2.fire", n: 1, scelta: "[[c2-c2-fire-2]]" }
  - { dove: "c2.js#c2.fire", n: 1, scelta: "[[c2-c2-fire-2]]" }
  - { dove: "c2.js#c2.fire", n: 1, scelta: "[[c2-c2-fire-3]]" }
  - { dove: "c2.js#c2.fire", n: 1, scelta: "[[c2-c2-fire-3]]" }
  - { dove: "c2.js#c2.plan", n: 1, scelta: "[[c2-c2-plan-1]]" }
  - { dove: "c3.js#c3.jail", n: 1, scelta: "[[c3-c3-jail-2]]" }
  - { dove: "end.js#c3.trial", n: 1, scelta: "[[end-c3-trial-1]]" }
  - { dove: "end.js#f.dawn", n: 1, scelta: "[[end-f-dawn-2]]" }
  - { dove: "end.js#f.last", n: 1, scelta: "[[end-f-last-2]]" }
mette_alla_prova:
  - { dove: "trials.js#trial.dare.door", condizione: "trust ginepra >= 2" }
  - { dove: "sessions.js#s2", condizione: "trust ginepra >= 2" }
  - { dove: "visits.js#thread", condizione: "notFlag rd.value e chapter 2 e flag leaf.value.m19 e trust ginepra >= 2" }
---

Quello che lei e ginepra hanno costruito insieme: la fiducia dei copioni (state.trust) nutre il legame (state.bonds, glue/witches.js).

Lo muovono 17 punti dei copioni e lo leggono 3 condizioni.

Il legame cresce anche dal codice: le prove (glue/trials.js) e le opinioni (glue/opinions.js).
