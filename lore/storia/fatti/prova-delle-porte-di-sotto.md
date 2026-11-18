---
tipo: "fatto"
nome: "Prova: le porte di sotto"
flag: "trial.cellars.perfect / pass / fail"
capitolo: 3
quando: 313
scena: "trials.js#trial.cellars.door, trials/main.js#cellars"
chi_c_e:
  - "[[protagonista]]"
  - "[[edera]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[edera]]", come: "Le ha chiesto lei di andare.", fonte: copione }
conseguenze:
  - "[[prova-della-stanza-murata]]"
rami:
  - { scelta: "Perfetta", flag: "trial.cellars.perfect", esito: "La chiave della cantina grande e la mirra." }
  - { scelta: "Fallita", flag: "trial.cellars.fail", esito: "Un conestabile le vuota la borsa; può perdere una carta piccola." }
aperto:
---

Edera vuole sapere se i quattro passaggi dalle cantine alla porta delle celle sono come li ricorda. Gira La Stella e la manda avanti da sola.
