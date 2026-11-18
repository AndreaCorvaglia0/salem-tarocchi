---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: Nelle cantine i conestabili raccontano ancora di …"
dove: "end.js#f.last"
condizione: "flag b3.stealth"
si_guadagna:
  - { serve: "flag b3.stealth", dove: "c3.js#c3.coven [[c3-c3-coven-2]]" }
---

Una variante del finale in `f.last` (end.js).

- se flag b3.stealth: Nelle cantine i conestabili raccontano ancora di due ombre e di un gatto nero, e a ogni r…
- altrimenti: Al villaggio si racconta di una ragazza che un mattino entrò in tribunale dalla porta e c…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
