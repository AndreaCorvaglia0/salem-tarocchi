---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "s4: Mi avevi anche detto che a chi ti racconta come a…"
dove: "sessions.js#s4"
condizione: "flag s0.believes"
si_guadagna:
  - { serve: "flag s0.believes", dove: "sessions.js#s0 [[sessions-s0-4]]" }
---

Una variante del finale in `s4` (sessions.js).

- se flag s0.believes: Mi avevi anche detto che a chi ti racconta come andrà a finire un po' credi. Io non l'ho …
- altrimenti: Mi avevi anche detto che non credi a chi ti racconta come andrà a finire. Avrai notato ch…

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
