---
tipo: "fatto"
nome: "La carta nella neve"
flag: "flag p.grab / p.looked; draw ROAD_POOL"
capitolo: 0
quando: 30
scena: "c0.js#p.road"
chi_c_e:
  - "[[protagonista]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[tartufo]]", come: "Le sue impronte erano accanto: la guardava da prima.", fonte: copione }
  - { chi: "[[malva]]", come: "Lo capisce dalle dita rosse (p.grab) o dalla neve sulle scarpe (p.looked), c1.js#c1.malva.", fonte: copione }
conseguenze:
  - "[[incontro-con-tartufo]]"
  - "[[accolta-da-malva]]"
rami:
  - { scelta: "La raccoglie subito / Prima si guarda intorno", flag: "p.grab / p.looked", esito: "Malva lo commenta." }
aperto:
---

Sul bordo della strada brilla qualcosa: è una carta, fredda come un sasso di fiume. Una delle carte del villaggio (dal Mago agli Amanti) entra nel suo mazzo. Il narratore dice che a Salem nessuno sa da dove vengano queste carte.
