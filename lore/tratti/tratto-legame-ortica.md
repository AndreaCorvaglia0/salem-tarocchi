---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "tratto"
nome: "Fiducia e legame con ortica"
cosa: "Quello che lei e ortica hanno costruito insieme: la fiducia dei copioni (state.trust) nutre il legame (state.bonds, glue/witches.js)."
stabilisce:
  - { dove: "c2.js#c2.ortica", n: 1, scelta: "[[c2-c2-ortica-1]]" }
  - { dove: "c2.js#c2.ortica", n: 1, scelta: "[[c2-c2-ortica-1]]" }
  - { dove: "c2.js#c2.ortica", n: 1, scelta: "[[c2-c2-ortica-3]]" }
  - { dove: "c2.js#ortica.chat", n: 1 }
  - { dove: "c2.js#ortica.chat", n: 1, scelta: "[[c2-ortica-chat-1]]" }
  - { dove: "c2.js#ortica.chat", n: 1, scelta: "[[c2-ortica-chat-1]]" }
  - { dove: "c3.js#c3.coven", n: 1, scelta: "[[c3-c3-coven-4]]" }
  - { dove: "garden-lessons.js#garden.lesson.acqua", n: 1 }
  - { dove: "garden-lessons.js#garden.lesson.luce", n: 1 }
  - { dove: "garden-lessons.js#garden.lesson.terra", n: 1 }
  - { dove: "garden-lessons.js#garden.lesson.vaso", n: 1 }
  - { dove: "garden-lessons.js#garden.lesson.semina", n: 1 }
  - { dove: "garden.js#garden.ortica", n: 1 }
  - { dove: "interests.ortica.js#int.ortica.1", n: 1 }
  - { dove: "interests.ortica.js#int.ortica.2", n: 1 }
  - { dove: "interests.ortica.js#int.ortica.3", n: 1 }
mette_alla_prova:
  - { dove: "c3.js#c3.coven", condizione: "trust ortica >= 2" }
  - { dove: "c3.js#c3.jail", condizione: "flag coven.ortica.talk e trust ortica >= 2" }
  - { dove: "end.js#c3.trial", condizione: "trust ortica >= 2" }
  - { dove: "end.js#f.last", condizione: "trust ortica >= 2" }
  - { dove: "end.js#f.last", condizione: "trust malva >= 2 e trust ortica >= 2 e trust edera >= 2" }
  - { dove: "trials.js#trial.kettle.door", condizione: "trust ortica >= 2" }
  - { dove: "visits.js#openers", condizione: "notFlag rd.ortica e trust ortica >= 2" }
  - { dove: "barks.js#BARKS.judge[5]", condizione: "trust ortica >= 2" }
---

Quello che lei e ortica hanno costruito insieme: la fiducia dei copioni (state.trust) nutre il legame (state.bonds, glue/witches.js).

Lo muovono 16 punti dei copioni e lo leggono 8 condizioni.

Il legame cresce anche dal codice: le prove (glue/trials.js) e le opinioni (glue/opinions.js).
