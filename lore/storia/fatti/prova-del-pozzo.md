---
tipo: "fatto"
nome: "Prova: qualcosa nel pozzo"
flag: "trial.well.perfect / pass / fail"
capitolo: 1
quando: 188
scena: "trials.js#trial.well.door, trials/side.js#well"
chi_c_e:
  - "[[protagonista]]"
  - "[[tartufo]]"
  - "[[gatto-del-giudice]]"
chi_lo_sa:
  - { chi: "[[tartufo]]", come: "Non vuole parlarne «né stanotte né mai».", fonte: copione }
conseguenze:
  - "[[prova-del-paiolo]]"
rami:
  - { scelta: "Perfetta", flag: "trial.well.perfect", esito: "Il sonaglio d'argento; Tartufo passa sui tetti quando vuole." }
  - { scelta: "Fallita", flag: "trial.well.fail", esito: "Dal tribunale qualcuno vede una ragazza sulla soglia." }
aperto:
---

Nel pozzo della piazza c'è il gatto grigio del Giudice con una zampa rotta. Tartufo, suo nemico, non dorme finché la ragazza non scende a prenderlo.
