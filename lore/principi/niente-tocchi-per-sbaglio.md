---
tipo: principio
nome: "Niente tocchi per sbaglio"
in_breve: "I tasti nuovi ignorano i tocchi per un attimo, e i momenti da leggere non si saltano per sbaglio."
perche: "Sul telefono un tocco di troppo fa perdere una battuta o sceglie una risposta che lei non voleva."
fonte: "DESIGN.md, Le regole 3; MAP.md, regola 2; parole di Andrea"
si_rompe_se: "Un tasto nuovo non passa dalla guardia di 650 millisecondi, o una scena va avanti da sola mentre lei sta ancora leggendo."
---

Ogni riga resta finché lei non tocca. La guardia sta in src/core/dom.js. Chi scrive test automatici la spegne con `window.__salemNoGuard`.

## Note

Meccaniche che lo servono:

- [[trovare-una-carta]] — Trovare una carta
- [[superare-l-esame]] — Superare l'Esame
- [[farsi-leggere-dalla-lettrice]] — Farsi leggere dalla Lettrice
