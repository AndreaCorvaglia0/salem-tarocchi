---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "tratto"
nome: "Fiducia e legame con edera"
cosa: "Quello che lei e edera hanno costruito insieme: la fiducia dei copioni (state.trust) nutre il legame (state.bonds, glue/witches.js)."
stabilisce:
  - { dove: "c3.js#c3.edera", n: 1, scelta: "[[c3-c3-edera-2]]" }
  - { dove: "c3.js#c3.edera", n: 1, scelta: "[[c3-c3-edera-5]]" }
  - { dove: "c3.js#c3.edera", n: 1, scelta: "[[c3-c3-edera-5]]" }
  - { dove: "c3.js#c3.coven", n: 1, scelta: "[[c3-c3-coven-1]]" }
  - { dove: "c3.js#edera.chat", n: 1 }
  - { dove: "c3.js#edera.chat", n: 1, scelta: "[[c3-edera-chat-1]]" }
  - { dove: "c3.js#edera.chat", n: 1, scelta: "[[c3-edera-chat-1]]" }
mette_alla_prova:
  - { dove: "c3.js#c3.coven", condizione: "trust edera >= 2" }
  - { dove: "end.js#c3.trial", condizione: "trust edera >= 2" }
  - { dove: "end.js#f.last", condizione: "trust edera >= 2" }
  - { dove: "end.js#f.last", condizione: "trust malva >= 2 e trust ortica >= 2 e trust edera >= 2" }
  - { dove: "trials.js#trial.room.door", condizione: "trust edera >= 2" }
  - { dove: "visits.js#openers", condizione: "notFlag rd.edera e trust edera >= 2" }
  - { dove: "barks.js#BARKS.judge[6]", condizione: "trust edera >= 2" }
---

Quello che lei e edera hanno costruito insieme: la fiducia dei copioni (state.trust) nutre il legame (state.bonds, glue/witches.js).

Lo muovono 7 punti dei copioni e lo leggono 7 condizioni.

Il legame cresce anche dal codice: le prove (glue/trials.js) e le opinioni (glue/opinions.js).
