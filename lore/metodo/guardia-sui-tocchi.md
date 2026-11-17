---
tipo: metodo
nome: "Una guardia sui tocchi, e momenti che non si saltano"
famiglia: far-crescere
ambito: generale
problema: "Sul telefono un tocco di troppo fa perdere una battuta o sceglie una risposta che lei non voleva."
soluzione: "I tasti nuovi ignorano i tocchi per 650 millisecondi. Ogni riga resta finché lei non tocca, e il primo tocco completa la riga prima di passare alla successiva."
in_salem:
  - "[[niente-tocchi-per-sbaglio]]"
  - "[[il-testo-e-la-chiave]]"
si_controlla_con: "tests/story.pace.test.mjs (un tocco completa, un secondo dopo la pausa va avanti, mai due righe)"
rischi: "Un tasto fatto a mano che non passa dalla guardia. I test automatici la spengono con `window.__salemNoGuard`: una schermata provata solo così può nascondere il problema."
fonte: "DESIGN.md, Le regole 3; MAP.md, Three rules that are easy to break; Andrea (principio «Niente tocchi per sbaglio»)"
---

La guardia è `GUARD = 650` in src/core/dom.js; il ritmo delle righe è in src/story/pace.js. scripts/playthrough.mjs tocca solo quando il segnale dice che il tocco sarà accettato. Le scene d'atmosfera cominciano piano e non vanno avanti da sole.

Per un altro gioco: Mnemopolis lascia saltare i momenti di cinema con un tocco (docs/STORY.md di Mnemopolis), ed è una scelta voluta. La guardia sui tasti nuovi vale comunque, perché il problema è il dito, non la storia.
