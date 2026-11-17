---
tipo: "fatto"
nome: "Malva apre il cancello del bosco"
flag: "step c1.gate (need 6, rank 4); flag gate1.refused, gate.flew, gate.advice; chapter 2"
capitolo: 1
quando: 190
scena: "c1b.js#c1.gate"
chi_c_e:
  - "[[protagonista]]"
  - "[[malva]]"
chi_lo_sa:
  - { chi: "[[ortica]]", come: "Il merlo le dice della scopa (gate.flew); indovina il consiglio (gate.advice).", fonte: copione }
conseguenze:
  - "[[seduta-dei-valori]]"
  - "[[arrivo-da-ortica]]"
rami:
  - { scelta: "Non ancora pronta", flag: "gate1.refused", esito: "Malva la rimanda a studiare." }
  - { scelta: "Passo da sopra (scopa) / Dammi un consiglio (fiducia)", flag: "gate.flew / gate.advice", esito: "Ortica lo commenta." }
aperto:
---

Quando è fattucchiera e ha le carte del villaggio, Malva gira Il Matto dritto contro il cancello e la manda nel bosco da Ortica con il pane per due giorni.
