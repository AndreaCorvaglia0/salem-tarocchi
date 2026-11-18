---
tipo: "meccanica"
nome: "Annotare i luoghi"
ambito: salem
dinamica: "misteri"
leggi:
  - "[[legge-sempre-un-motivo]]"
  - "[[legge-il-mondo-e-la-memoria]]"
motivo: "Un posto ha un «?» e una riga che lo descrive da fuori: voglio sapere che cosa c'è davvero."
effetto: "Curiosità che attira l'attenzione sul posto; le note in prima persona mi fanno ritrovare quello che so, senza premi svelati."
fonte: "copione"
dove:
  - "src/data/world/notes.js"
  - "src/ui/placenotes.js"
  - "src/ui/mappa.js"
  - "lore/metodo/principi/vede-solo-quello-che-sa.md"
cosa_fa_la_giocatrice: "Toccando sulla mappa un posto già visto, legge le sue note su quel posto, scritte in prima persona come appunti. Se non ne sa ancora niente c'è un «?» (o il nome, se è chiaro a chi guarda) e una riga semplice su quello che si vede o si sente da fuori; man mano che impara compaiono fino a tre note brevi, sotto i 70 caratteri. Un puntino a matita segna un posto con una nota che non ha ancora letto."
serve:
  - "[[vede-solo-quello-che-sa]]"
  - "[[il-testo-e-la-chiave]]"
concetti: []
insegna: []
tecniche:
  - "[[curiosita]]"
ragione_nel_gioco: "Una strega annota quello che sa dei posti, e un «?» è un posto che ancora non capisce."
premio: "Nessuno: le note sono quello che ha imparato, scritto da lei."
rischio: "Nessuno."
tratti: "Nessuno."
aperto: "Un test (tests/knows-only.test.mjs) controlla le condizioni, le lunghezze e che ogni nome proprio di una nota stia nei copioni."
---

Le note non usano mai i retroscena: ogni riga ha una condizione, e quello che lei non sa resta un «?».
