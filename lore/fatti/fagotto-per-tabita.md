---
tipo: "fatto"
nome: "Il fagotto per Tabita"
flag: "step c1.deliver; flag bundle.closed / bundle.peeked, side.m05, tabita.owes"
capitolo: 1
quando: 90
scena: "c1.js#c1.deliver"
chi_c_e:
  - "[[protagonista]]"
  - "[[tabita]]"
chi_lo_sa:
  - { chi: "[[malva]]", come: "Tabita le dice del nodo e delle monete rifiutate (c1b.js#c1.gate).", fonte: copione }
  - { chi: "[[lettrice]]", come: "Lo cita (visits.js#OPENERS peeked, tabita).", fonte: copione }
conseguenze:
  - "[[dicerie-delle-carte]]"
  - "[[tabita-di-nuovo]]"
  - "[[epilogo-al-bivacco]]"
rami:
  - { scelta: "Lo consegna chiuso / Slega un angolo", flag: "bundle.closed / bundle.peeked", esito: "Malva aveva fatto il nodo doppio apposta." }
  - { scelta: "Tiene le tre monete / Le lascia a Tabita", flag: "— / tabita.owes", esito: "Tabita le «deve un bucato» per sempre: coperta sul letto, coperta all'epilogo." }
aperto:
---

La seconda commissione: un unguento per le mani di Tabita, davanti alla casa delle riunioni. Tabita racconta della carta infilata nella Bibbia grande.
