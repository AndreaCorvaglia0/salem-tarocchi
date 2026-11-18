---
tipo: "fatto"
nome: "Gli Esami per strada"
flag: "exam constable / afflicted; stat exams, examsPassed, examsFailed"
capitolo: 1
quando: 151
scena: "barks.js#constable, afflicted; systems/exam.js"
chi_c_e:
  - "[[protagonista]]"
  - "[[conestabili]]"
  - "[[afflitte]]"
chi_lo_sa:
  - { chi: "[[giudice]]", come: "Ha letto i rapporti: «l'hanno fermata {stat:examsPassed} volte» (end.js#c3.trial).", fonte: copione }
  - { chi: "[[lettrice]]", come: "Conta le fermate (sessions.js#s1-s3).", fonte: copione }
conseguenze:
  - "[[notti-in-cella]]"
rami:
aperto:
  - "Avviene più volte, in qualunque momento dopo il primo Esame."
---

Di notte un conestabile o un'Afflitta può fermarla e interrogarla sulle carte. Rispondere bene la lascia andare; esitare porta in cella.
