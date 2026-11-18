---
tipo: "fatto"
nome: "Prova: la notte dai Proctor"
flag: "trial.vigil.perfect / pass / fail"
capitolo: 1
quando: 187
scena: "trials.js#trial.vigil.door, trials/side.js#vigil"
chi_c_e:
  - "[[protagonista]]"
  - "[[malva]]"
  - "[[famiglia-proctor]]"
chi_lo_sa:
  - { chi: "[[malva]]", come: "Lo ricorda nella prova del cesto.", fonte: copione }
  - { chi: "[[famiglia-proctor]]", come: "Il padre ha chiesto una carta.", fonte: copione }
conseguenze:
  - "[[prova-del-pozzo]]"
rami:
  - { scelta: "Perfetta", flag: "trial.vigil.perfect", esito: "Il cucchiaio d'argento di Malva." }
  - { scelta: "Fallita", flag: "trial.vigil.fail", esito: "Il padre le mette alla porta davanti ai vicini." }
aperto:
---

Il piccolo dei Proctor ha la febbre da tre giorni. La madre fa entrare Malva di notte; a metà notte confessa che il barbiere lo ha salassato due volte. Alla fine il padre chiede alla ragazza una carta per sapere se il figlio vivrà.
