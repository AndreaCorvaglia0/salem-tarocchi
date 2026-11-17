---
tipo: metodo
nome: "Si nomina solo quello che è chiaro"
famiglia: personalizzare
ambito: generale
problema: "Un gioco che commenta ogni scossa sembra un oroscopo; uno che sbaglia su di lei perde credito."
soluzione: "Un tratto si dice a parole solo quando è marcato. Un cambio si nomina solo se è grosso. Quando lei tira forte da tutte e due le parti, il gioco lo racconta come una cosa sua."
in_salem:
  - "[[la-lettrice-legge-lei]]"
  - "[[farsi-leggere-dalla-lettrice]]"
  - "[[lettrice]]"
si_controlla_con: "tests/core.portrait.test.mjs (traitWord, steady, turned, torn); tests/story.data.test.mjs (ogni personaggio principale ha almeno quattro righe che compaiono solo con un tratto marcato)"
rischi: "Con soglie troppo alte il ritratto non dice mai niente; con soglie troppo basse si contraddice da una visita all'altra."
fonte: "DESIGN.md, Il ritratto («Si guardano le tendenze robuste, non ogni scossa»)"
---

In src/core/progress.js `traitWord` dà l'aggettivo solo da 3 in su. In src/core/cond.js ci sono `steady` (marcato e uguale all'ultima fotografia), `turned` (ha cambiato verso di almeno 4) e `torn` (almeno tre spinte da ogni parte e valore vicino a zero), che diventa «Il cuore e la testa in te non riescono a mettersi d'accordo». Le fotografie le fa `snapshot()` alla fine di ogni incontro con la Lettrice.

Per un altro gioco: vale per qualunque commento del mondo di Mnemopolis su chi gioca. Servono soglie scritte e una fotografia per confrontare il prima e il dopo.
