---
tipo: "fatto"
nome: "«Sono io»: l'arresto di Ginepra"
flag: "step c2.home; flag arrest.front / arrest.hid, ginepra.taken; session s2"
capitolo: 2
quando: 270
scena: "c2.js#c2.arrest"
chi_c_e:
  - "[[protagonista]]"
  - "[[ginepra]]"
  - "[[conestabili]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[malva]]", come: "«Ho saputo tutto stanotte» (c3.js#c3.trapdoor).", fonte: copione }
  - { chi: "[[ortica]]", come: "«lo sa tutto il bosco» (c2.js#ortica.chat).", fonte: copione }
  - { chi: "[[lettrice]]", come: "«So che hanno portato via Ginepra, e so che eri lì» (s2).", fonte: copione }
  - { chi: "[[edera]]", come: "Lo sa, perché al consiglio si parla di riprendere «quella ragazza» (c3.js#c3.edera).", fonte: copione }
conseguenze:
  - "[[seduta-delle-paure]]"
  - "[[discesa-dalla-botola]]"
rami:
  - { scelta: "Vado alla porta / Mi nascondo dietro la legnaia", flag: "arrest.front / arrest.hid", esito: "Con arrest.hid Ginepra le stringe la mano al buio." }
aperto:
---

Tre conestabili con un foglio sigillato aspettano davanti alla capanna. Prima che la protagonista risponda, Ginepra esce dal buio e dice «Sono io». La portano via; ride piano, e ha paura.
