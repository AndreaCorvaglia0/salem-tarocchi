---
# generato da scripts/lore.mjs, non modificare a mano
tipo: "finale"
nome: "c3.trial: So che una sera, in piazza, lei ha parlato in dif…"
dove: "end.js#c3.trial"
condizione: "flag b1.spoke"
si_guadagna:
  - { serve: "flag b1.spoke", dove: "c1b.js#c1.square [[c1b-c1-square-1]]" }
---

Una variante del finale in `c3.trial` (end.js).

- se flag b1.spoke: So che una sera, in piazza, lei ha parlato in difesa di Comare Hale. Io so quasi tutto qu…
- altrimenti: So che una sera, in piazza, mentre portavano via Comare Hale, lei è rimasta in silenzio. …

Si legge all'indietro: ogni voce di `si_guadagna` dice dove la condizione si conquista.
