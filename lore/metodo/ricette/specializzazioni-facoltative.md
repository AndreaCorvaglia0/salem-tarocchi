---
tipo: ricetta
nome: "Un ramo da approfondire, per chi ne ha voglia"
famiglia: variare
ambito: generale
problema: "Un argomento in più, come le piante, interessa una giocatrice e annoia un'altra; se è obbligatorio appesantisce la storia."
soluzione: "Una piccola scuola a parte, con la sua maestra: poche lezioni brevi, una alla volta, ognuna apre o spiega un pezzo di quello che lei ha già. Chi non le segue ha comunque l'orto e i consigli sotto le aiuole."
in_salem:
  - "[[imparare-da-ortica]]"
  - "[[curare-l-orto]]"
  - "[[raccogliere-le-erbe]]"
  - "[[ortica]]"
  - "[[riconoscere-e-curare-le-piante]]"
si_controlla_con: "tests/garden.lessons.test.mjs; tests/garden.test.mjs"
rischi: "Il ramo cresce e chiede premi suoi che poi non servono: il mazzetto in dispensa oggi non serve a niente, perché le pozioni non ci sono. Ogni consiglio deve essere vero e avere la sua fonte."
fonte: "DESIGN.md, L'orto insegna davvero («una piccola scuola di giardinaggio vero… per chi ne ha voglia»)"
---

Le lezioni di Ortica (src/data/story/scripts/garden-lessons.js) sono una catena in src/glue/garden.js: l'acqua, la luce, la terra, il vaso, semina e talea. Ognuna fa crescere il legame con Ortica e lascia una nota sotto le aiuole (`LESSON_NOTES` in src/data/garden.js). L'orto si apre dopo la scena di Ortica e con quattro piante nell'erbario: dipende da quello che lei ha. Le fonti sono in notes/garden-lessons.md.

Per un altro gioco: in un corso di Mnemopolis il ramo è una casa in più con il suo proprietario e tre lezioni brevi; chi la salta finisce lo stesso il corso.
