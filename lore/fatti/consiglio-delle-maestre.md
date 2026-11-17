---
tipo: "fatto"
nome: "Il consiglio delle maestre"
flag: "step c3.coven (need 19); flag b3.stealth / b3.open, coven.watch.edera / coven.watch.malva, coven.ortica.talk / coven.ortica.brooms / coven.ortica.free, coven.cells, coven.cat.in / coven.cat.out"
capitolo: 3
quando: 320
scena: "c3.js#c3.coven"
chi_c_e:
  - "[[protagonista]]"
  - "[[malva]]"
  - "[[ortica]]"
  - "[[edera]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[lettrice]]", come: "Può chiedere «com'è stato decidere per tutte» (opinions.js#READER council).", fonte: copione }
conseguenze:
  - "[[sesta-visita-della-lettrice]]"
  - "[[salvataggio-dalle-cantine]]"
  - "[[ingresso-in-tribunale]]"
  - "[[processo-davanti-al-giudice]]"
  - "[[volo-all-alba]]"
rami:
  - { scelta: "Di nascosto dalle cantine", flag: "b3.stealth", esito: "step c3.jail" }
  - { scelta: "A viso aperto dalla porta", flag: "b3.open", esito: "step c3.court" }
  - { scelta: "Compiti: Edera davanti al Giudice / Malva in fondo all'aula", flag: "coven.watch.edera / coven.watch.malva", esito: "Si vedono al processo." }
  - { scelta: "Ortica parla alle guardie / porta una scopa / sceglie lei", flag: "coven.ortica.talk / coven.ortica.brooms / coven.ortica.free", esito: "Si vedono nel salvataggio e all'alba." }
  - { scelta: "Tartufo fuori / sotto il mantello", flag: "coven.cat.out / coven.cat.in", esito: "Si vede al processo." }
aperto:
---

Le tre maestre litigano su come salvare Ginepra, poi tacciono e aspettano la sua parola: è la prima volta. Lei decide il piano e dà a ognuna un compito; Edera gira La Giustizia dritta.
