---
tipo: "fatto"
nome: "Il primo Esame in piazza"
flag: "step c1.explore → c1.venus; flag exam1.done, exam.passed, lied.constable / exam1.malva / exam1.bray"
capitolo: 1
quando: 150
scena: "c1b.js#c1.exam1"
chi_c_e:
  - "[[protagonista]]"
  - "[[conestabile-della-piazza]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[ginepra]]", come: "Ha visto tutto da dietro il fienile (c1b.js#c1.venus).", fonte: copione }
  - { chi: "[[conestabili]]", come: "La bugia «di passaggio» e la Bray finiscono nei loro rapporti (c2.js#c2.arrest, barks.js#constable).", fonte: copione }
  - { chi: "[[lettrice]]", come: "Cita la bugia (sessions.js#s1).", fonte: copione }
  - { chi: "[[giudice]]", come: "Legge i rapporti (end.js#c3.trial).", fonte: copione }
conseguenze:
  - "[[bicchiere-di-venere]]"
  - "[[notti-in-cella]]"
  - "[[fermate-dei-conestabili]]"
  - "[[arresto-di-ginepra]]"
rami:
  - { scelta: "Sto da Malva / Sono di passaggio / Chiedete alla vedova Bray", flag: "exam1.malva / lied.constable / exam1.bray", esito: "Ricordato all'arresto." }
  - { scelta: "Esame superato / fallito", flag: "exam.passed / jailed", esito: "Fallito: la prima notte in cella." }
aperto:
---

Un conestabile ferma la protagonista nella piazza vuota e le fa domande sulle figure delle carte. Se risponde bene la lascia andare; se esita, dorme nelle celle del tribunale.
