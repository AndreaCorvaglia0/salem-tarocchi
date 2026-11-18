---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "f.last: Io ti ringrazio. Ecco, l'ho detto, e che nessuno …"
dove: "end.js#f.last"
condizione: "trust malva >= 2"
si_guadagna:
  - { serve: "trust malva >= 2", dove: "[[tratto-legame-malva]]" }
---

Una variante del finale in `f.last` (end.js).

- se trust malva >= 2: Io ti ringrazio. Ecco, l'ho detto, e che nessuno me lo faccia ripetere.
- altrimenti: Io non ringrazio, lo sai. Però la legna per l'inverno te l'ho già fatta spaccare, ed è ac…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
