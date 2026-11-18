---
tipo: "fatto"
nome: "Bivio 1: la piazza"
flag: "step c1.square → c1.gate; flag b1.spoke / b1.hid, b1.candles, b1.watched"
capitolo: 1
quando: 180
scena: "c1b.js#c1.square"
chi_c_e:
  - "[[protagonista]]"
  - "[[ginepra]]"
  - "[[malva]]"
  - "[[afflitte]]"
  - "[[comare-hale]]"
  - "[[conestabili]]"
  - "[[tartufo]]"
chi_lo_sa:
  - { chi: "[[ortica]]", come: "«lo sa tutto il bosco» (c2.js#c2.ortica).", fonte: copione }
  - { chi: "[[lettrice]]", come: "Ne parla in s1, ma dice «in piazza non c'ero» (opinions.js#READER square).", fonte: copione }
  - { chi: "[[giudice]]", come: "«Io so quasi tutto quello che succede a Salem» (end.js#c3.trial).", fonte: copione }
  - { chi: "[[conestabili]]", come: "La ricordano (barks.js#constable b1.spoke).", fonte: copione }
  - { chi: "[[afflitte]]", come: "La ricordano (barks.js#afflicted).", fonte: copione }
conseguenze:
  - "[[dono-di-hale]]"
  - "[[malva-apre-il-cancello]]"
  - "[[seduta-dei-valori]]"
  - "[[ingresso-in-tribunale]]"
  - "[[epilogo-al-bivacco]]"
rami:
  - { scelta: "Parla per Hale / resta nell'ombra", flag: "b1.spoke / b1.hid", esito: "Hale torna a casa / viene portata via e non se ne sa più niente." }
  - { scelta: "Raccoglie le candele (audace)", flag: "b1.candles", esito: "Candele nuove all'epilogo." }
  - { scelta: "Guarda tutti in faccia (accorta)", flag: "b1.watched", esito: "Ortica e il Giudice lo notano." }
aperto:
---

All'imbrunire la piazza è piena. Un'Afflitta indica Comare Hale, la vecchia delle candele, e un conestabile vuole portarla al tribunale. La protagonista sceglie se parlare davanti a tutti o restare sotto il portico. Malva manda a casa le due ragazze.
