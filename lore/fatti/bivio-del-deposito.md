---
tipo: "fatto"
nome: "Bivio 2: il mazzo sequestrato"
flag: "step c2.plan (need 11) → c2.home; flag b2.went / b2.stayed, depot.door / depot.window, depot.bray, plan.lookout"
capitolo: 2
quando: 260
scena: "c2.js#c2.plan"
chi_c_e:
  - "[[protagonista]]"
  - "[[ginepra]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[conestabili]]", come: "Seguono le impronte; con depot.window misurano lo stivale (c2.js#c2.arrest).", fonte: copione }
  - { chi: "[[malva]]", come: "Sa se c'era e del fischio (c3.js#c3.trapdoor).", fonte: copione }
  - { chi: "[[giudice]]", come: "Sa che le ombre erano due (b2.went).", fonte: copione }
  - { chi: "[[vedova-bray]]", come: "Ritrova il suo mazzo sul davanzale (depot.bray).", fonte: copione }
  - { chi: "[[lettrice]]", come: "Lo confronta con le paure (sessions.js#s2).", fonte: copione }
conseguenze:
  - "[[arresto-di-ginepra]]"
  - "[[discesa-dalla-botola]]"
  - "[[processo-davanti-al-giudice]]"
  - "[[epilogo-al-bivacco]]"
rami:
  - { scelta: "Vengo con te", flag: "b2.went (+ depot.door / depot.window, depot.bray)", esito: "Ginepra riprende il mazzo; suona una campana." }
  - { scelta: "Non vengo", flag: "b2.stayed (+ plan.lookout)", esito: "Ginepra entra da sola; suona una campana." }
aperto:
---

Davanti al tribunale Ginepra gira La Ruota capovolta, che dice un periodo storto, ed entra lo stesso nel deposito. La protagonista la accompagna o resta fuori. Ginepra riprende il mazzo della nonna; qualcuno le vede e suona una campana.
