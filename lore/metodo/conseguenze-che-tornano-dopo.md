---
tipo: metodo
nome: "Una scelta che qualcuno ricorda, più tardi"
famiglia: variare
ambito: generale
problema: "Una scelta che cambia subito una risposta e poi sparisce sembra finta."
soluzione: "Il peso viene dal ritorno: una battuta, una scena o una domanda della Lettrice ricorda la scelta capitoli dopo. Il ramo può essere piccolo; il ricordo deve essere preciso."
in_salem:
  - "[[storia-ed-emozione]]"
  - "[[fagotto-per-tabita]]"
  - "[[bivio-della-piazza]]"
  - "[[lettrice]]"
  - "[[ginepra]]"
si_controlla_con: "tests/story.paths.test.mjs (ogni ramo lascia i suoi flag); la colonna «Remembered by» di notes/paths.md, a mano"
rischi: "Un ricordo che non torna, o che torna sbagliato, rompe la fiducia: la Lettrice dice «in piazza non c'ero» e poi ne parla. Va tenuto il conto di chi può sapere che cosa (il campo `sa` delle persone, `chi_lo_sa` dei fatti)."
fonte: "DESIGN.md, Scelte («Il trucco che rende di più è far ricordare una scelta a qualcuno, più tardi»)"
---

Esempio: con il fagotto per Tabita (src/data/story/scripts/c1.js, scena c1.deliver) lei può aprirlo o no, tenere le tre monete o rifiutarle. Malva lo sa al cancello del bosco, la lavandaia lo ricorda più avanti, e una visita della Lettrice si apre proprio su questo (src/data/story/visits.js). Nel vault, [[fagotto-per-tabita]] dice chi lo sa e da dove.

Per un altro gioco: in Mnemopolis i proprietari delle case potrebbero ricordare come li si è aiutati (al primo colpo, o dopo un errore) e dirlo una casa dopo. Basta un flag e una riga.
