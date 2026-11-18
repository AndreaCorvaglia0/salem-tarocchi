---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: La tua storia la racconto a tutto il bosco, e ogn…"
dove: "end.js#f.last"
condizione: "trust ortica >= 2"
si_guadagna:
  - { serve: "trust ortica >= 2", dove: "[[tratto-legame-ortica]]" }
---

Una variante del finale in `f.last` (end.js).

- se trust ortica >= 2: La tua storia la racconto a tutto il bosco, e ogni volta mi viene un po' più lunga. Nell'…
- altrimenti: La tua storia la racconto lo stesso, sai, anche se in una versione corta. Senza il drago,…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
