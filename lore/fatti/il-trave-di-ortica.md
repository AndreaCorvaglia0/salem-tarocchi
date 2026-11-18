---
tipo: "fatto"
nome: "Il trave di Ortica (le erbe di Ortica, 1)"
flag: "flag int.ortica.ready, int.ortica.offered, int.ortica.1.hung, int.ortica.1"
capitolo: 2
quando: 255
scena: "interests.ortica.js#int.ortica.start, interests.ortica.js#int.ortica.1"
fonte: proposto
chi_c_e:
  - "[[protagonista]]"
  - "[[ortica]]"
chi_lo_sa:
  - { chi: "[[ortica]]", come: "Le chiede lei di appendere i mazzetti, e le tiene la scala (interests.ortica.js#int.ortica.1).", fonte: proposto }
conseguenze:
  - "[[unguento-del-mortaio]]"
rami:
  - { scelta: "Sale subito sulla scala / Torna un altro giorno", flag: "— / —", esito: "Rischio audace o prudente; la missione resta sulla mappa finché non la fa." }
  - { scelta: "All'ombra e all'aria / Al sole / Sopra il fuoco", flag: "int.ortica.1.hung (solo la prima)", esito: "Le altre due: Ortica dice che cosa succederebbe, e lei sceglie di nuovo." }
aperto:
  - "Proposto, da confermare: Ortica ha la schiena a pezzi, e per questo il trave della capanna è vuoto da una settimana."
  - "Proposto, da confermare: i mazzetti di lei restano sul trave di Ortica fino al giorno dopo, poi tornano secchi nella sua dispensa (nel mondo vero ci vogliono due-quattro settimane: docs/RESEARCH.md)."
---

Il primo passo dell'interesse per le erbe (notes/interessi/PROGETTO.md). Quando lei ha un mazzetto suo in dispensa ed entra da Ortica, Ortica lo annusa, si tocca la schiena e le chiede di appendere i mazzetti al trave. Lei sceglie tre mazzetti (quelli che mancano li mette Ortica) e dove appenderli: all'ombra, dove passa l'aria, a testa in giù. Alla fine Ortica le parla del mugnaio che non scende più le scale.
