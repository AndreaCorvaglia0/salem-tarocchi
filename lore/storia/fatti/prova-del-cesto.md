---
tipo: "fatto"
nome: "Prova: il cesto di Malva"
flag: "trial.night.perfect / pass / fail"
capitolo: 1
quando: 186
scena: "trials.js#trial.night.door, trials/main.js#night"
chi_c_e:
  - "[[protagonista]]"
  - "[[malva]]"
chi_lo_sa:
  - { chi: "[[malva]]", come: "Ne riparla dopo (item lume cieco).", fonte: copione }
  - { chi: "[[tartufo]]", come: "Commenta la lite delle boccette (barks.js).", fonte: copione }
conseguenze:
  - "[[prova-della-nebbia]]"
rami:
  - { scelta: "Perfetta", flag: "trial.night.perfect", esito: "Il lume cieco della madre di Malva e due coni d'incenso." }
  - { scelta: "Passata", flag: "trial.night.pass", esito: "" }
  - { scelta: "Fallita", flag: "trial.night.fail", esito: "Boccette rotte, monete al conestabile, Malva arrabbiata." }
aperto:
---

Gira voce che domattina i conestabili entrino nelle case: Malva deve portare oltre il cancello del bosco un cesto di unguenti. Gira L'Eremita e chiede alla ragazza di scegliere la strada con le carte.
