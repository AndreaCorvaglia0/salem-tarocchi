---
tipo: "fatto"
nome: "Il grimorio, e qualcuno che bussa"
flag: "step c1.grimoire → c1.client; flag door.opened / door.window"
capitolo: 1
quando: 110
scena: "c1.js#c1.grimoire"
chi_c_e:
  - "[[protagonista]]"
  - "[[tartufo]]"
  - "[[vedova-bray]]"
chi_lo_sa:
  - { chi: "[[lettrice]]", come: "Lo confronta con la risposta della porta chiusa (sessions.js#s1).", fonte: copione }
conseguenze:
  - "[[lettura-vedova-bray]]"
rami:
  - { scelta: "Apre subito / Guarda prima dalla finestra", flag: "door.opened / door.window", esito: "La Lettrice lo nota in s1." }
aperto:
---

Al tavolo la ragazza apre il quaderno portato da casa, che è il grimorio. Bussano tre colpi leggeri: è una donna con lo scialle nero.
