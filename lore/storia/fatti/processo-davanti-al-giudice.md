---
tipo: "fatto"
nome: "Il processo"
flag: "step c3.trial; exam judge; flag trial.won / trial.lost, trial.candles; giveCard m20"
capitolo: 3
quando: 350
scena: "end.js#c3.trial"
chi_c_e:
  - "[[protagonista]]"
  - "[[ginepra]]"
  - "[[giudice]]"
  - "[[malva]]"
  - "[[ortica]]"
  - "[[edera]]"
chi_lo_sa:
  - { chi: "[[lettrice]]", come: "«So come hai risposto al Giudice» (s3).", fonte: copione }
  - { chi: "[[ginepra]]", come: "Ne parla all'alba (trial.candles, court.card).", fonte: copione }
conseguenze:
  - "[[volo-all-alba]]"
  - "[[epilogo-al-bivacco]]"
rami:
  - { scelta: "Esame superato", flag: "trial.won", esito: "Assolte tutte e due, con il consiglio di lasciare Salem." }
  - { scelta: "Esame fallito", flag: "trial.lost", esito: "Condanna all'alba; un calamaio, una voce, le candele spente: fuga dalla porta piccola." }
aperto:
  - "Chi delle maestre c'è davvero in aula dipende da compiti e fiducia; con trial.lost Malva c'è sempre (grida «Fuori, voi due»)."
---

Il Giudice interroga la protagonista sulle carte, ricordando quello che sa di lei. Se risponde bene le assolve e le consiglia di sparire; se no le condanna, e le maestre spengono l'aula per farle scappare. Sul banco c'è Il Giudizio, che finisce nelle sue mani.
