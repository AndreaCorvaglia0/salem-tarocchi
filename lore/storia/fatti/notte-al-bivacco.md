---
tipo: "fatto"
nome: "La notte al fuoco con Ginepra"
flag: "step c2.fire → c2.plan (serve il fuoco); flag fire.taught, fire.carriage, fire.promised / fire.joked"
capitolo: 2
quando: 240
scena: "c2.js#c2.fire"
chi_c_e:
  - "[[protagonista]]"
  - "[[ginepra]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[ortica]]", come: "Ginepra le racconta la promessa (c2.js#ortica.chat).", fonte: copione }
  - { chi: "[[ginepra]]", come: "Ripete «subito» all'arresto, in cella, all'alba.", fonte: copione }
conseguenze:
  - "[[quarta-visita-della-lettrice]]"
  - "[[bivio-del-deposito]]"
  - "[[arresto-di-ginepra]]"
rami:
  - { scelta: "Lo accendo io / Ti insegno", flag: "— / fire.taught", esito: "In cella Ginepra accende un fuoco." }
  - { scelta: "La Ruota cambia / Dove va la carrozza?", flag: "— / fire.carriage", esito: "All'alba: «ho sbagliato soltanto la carrozza»." }
  - { scelta: "Verrei subito / Dipende da quanto sei stata scema", flag: "fire.promised / fire.joked", esito: "Ricordato all'arresto e in cella." }
aperto:
  - "Contraddizione: Ginepra «pesca dal suo mazzo» e subito dopo dice che il mazzo gliel'hanno preso (vedi notes/lore-story.md)."
---

Al bivacco la protagonista accende il fuoco con la fiammella. Ginepra le legge La Ruota sbagliando tutto, le chiede se verrebbe a cercarla se la prendessero, e le dice che a ottobre i conestabili le hanno preso il mazzo di sua nonna: vuole riprenderselo.
