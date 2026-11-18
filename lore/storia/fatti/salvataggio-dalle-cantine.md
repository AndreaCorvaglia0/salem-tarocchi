---
tipo: "fatto"
nome: "Bivio 3: dalle cantine"
flag: "step c3.jail → c3.trial; flag jail.chains / jail.barrels, jail.hinges / jail.keys / jail.ortica / jail.jailer"
capitolo: 3
quando: 340
scena: "c3.js#c3.jail"
chi_c_e:
  - "[[protagonista]]"
  - "[[ginepra]]"
  - "[[giudice]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[ginepra]]", come: "Ne parla all'alba.", fonte: copione }
  - { chi: "[[lettrice]]", come: "«stavolta hai cercato la finestra» (s3).", fonte: copione }
  - { chi: "[[conestabili]]", come: "Raccontano di due ombre e un gatto nero (end.js#f.last).", fonte: copione }
conseguenze:
  - "[[processo-davanti-al-giudice]]"
rami:
  - { scelta: "Le catene / Le botti", flag: "jail.chains / jail.barrels", esito: "" }
  - { scelta: "Apre la serratura / i cardini / le chiavi di Tartufo / le chiavi di Ortica / la chiave del carceriere", flag: "— / jail.hinges / jail.keys / jail.ortica / jail.jailer", esito: "Ginepra lo ricorda all'alba." }
aperto:
---

La protagonista attraversa le cantine fino alle celle, dove Ginepra canta stonando. Apre la grata; alle loro spalle il Giudice si schiarisce la voce e rimanda tutto «a domattina in aula».
