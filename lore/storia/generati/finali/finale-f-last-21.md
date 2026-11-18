---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: risposta «Prima ringrazio le maestre, una per una…»"
dove: "end.js#f.last"
condizione: "trust malva >= 2 e trust ortica >= 2 e trust edera >= 2"
si_guadagna:
  - { serve: "trust malva >= 2", dove: "[[tratto-legame-malva]]" }
  - { serve: "trust ortica >= 2", dove: "[[tratto-legame-ortica]]" }
  - { serve: "trust edera >= 2", dove: "[[tratto-legame-edera]]" }
---

Una variante del finale in `f.last` (end.js).

- risposta speciale «Prima ringrazio le maestre, una per una, anche se porta mal…»

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
