---
tipo: "fatto"
nome: "La capanna, e Tartufo che ci viveva"
flag: "step c1.cottage; flag cat.fed / cat.proud"
capitolo: 1
quando: 100
scena: "c1.js#c1.cottage"
chi_c_e:
  - "[[protagonista]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[tartufo]]", come: "Ricorda il pane della prima sera fino all'epilogo (end.js#f.last).", fonte: copione }
conseguenze:
  - "[[apertura-del-grimorio]]"
rami:
  - { scelta: "Divide il pane / Lo lascia in pace", flag: "cat.fed / cat.proud", esito: "Tartufo ne riparla nel finale." }
aperto:
---

La capanna è una stanza sola con un focolare già acceso. Tartufo dice che ci dorme da tre inverni, mentre Malva prometteva ogni anno una ragazza, e che sente le carte e i conestabili.
