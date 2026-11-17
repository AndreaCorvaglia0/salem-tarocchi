---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "tratto"
nome: "Fiducia e legame con malva"
cosa: "Quello che lei e malva hanno costruito insieme: la fiducia dei copioni (state.trust) nutre il legame (state.bonds, glue/witches.js)."
stabilisce:
  - { dove: "c1.js#c1.malva", n: 1, scelta: "[[c1-c1-malva-2]]" }
  - { dove: "c1b.js#c1.gate", n: 1, scelta: "[[c1b-c1-gate-1]]" }
  - { dove: "c3.js#c3.trapdoor", n: 1, scelta: "[[c3-c3-trapdoor-1]]" }
  - { dove: "post.js#enc.washer", n: 1 }
  - { dove: "lessons.js#fly.lesson", n: 1, scelta: "[[lessons-fly-lesson-1]]" }
mette_alla_prova:
  - { dove: "c1b.js#c1.gate", condizione: "trust malva >= 2" }
  - { dove: "c3.js#c3.coven", condizione: "trust malva >= 2" }
  - { dove: "end.js#c3.trial", condizione: "trust malva >= 2" }
  - { dove: "end.js#f.last", condizione: "trust malva >= 2" }
  - { dove: "end.js#f.last", condizione: "trust malva >= 2 e trust ortica >= 2 e trust edera >= 2" }
  - { dove: "trials.js#trial.vigil.door", condizione: "trust malva >= 2" }
  - { dove: "visits.js#openers", condizione: "notFlag rd.malva e trust malva >= 2" }
  - { dove: "barks.js#BARKS.judge[4]", condizione: "trust malva >= 2" }
---

Quello che lei e malva hanno costruito insieme: la fiducia dei copioni (state.trust) nutre il legame (state.bonds, glue/witches.js).

Lo muovono 5 punti dei copioni e lo leggono 8 condizioni.

Il legame cresce anche dal codice: le prove (glue/trials.js) e le opinioni (glue/opinions.js).
