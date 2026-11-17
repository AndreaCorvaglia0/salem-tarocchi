---
tipo: meccanica
nome: "Trovare una carta"
fonte: "copione"
dove:
  - "src/ui/found.js"
  - "src/core/progress.js"
  - "src/world/scene/minors.js"
cosa_fa_la_giocatrice: "Gira per Salem e trova una carta nascosta, o un Minore nell'erba alta. La carta si gira grande: lei tocca il dettaglio che la colpisce e legge la sua nota, scrive tre parole sue, poi vede le tre parole del libro e che cosa dice la carta."
serve:
  - "[[le-carte-servono-a-muoversi]]"
  - "[[interfaccia-che-premia]]"
  - "[[la-lettrice-legge-lei]]"
  - "[[sempre-chiaro-cosa-fare]]"
  - "[[niente-tocchi-per-sbaglio]]"
insegna:
  - "[[riconoscere-una-carta]]"
  - "[[ricordare-i-dettagli]]"
  - "[[dire-l-idea-della-carta]]"
tecniche:
  - "[[effetto-generazione]]"
  - "[[doppia-codifica]]"
  - "[[loci-e-immagini-vivide]]"
  - "[[elaborazione-e-autospiegazione]]"
ragione_nel_gioco: "È una strega che impara: le carte sono sparse per Salem, ognuna in un posto preciso, e si guadagnano trovandole. Il suo sguardo sul dettaglio è quello da cui la Lettrice partirà per raccontargliela."
premio: "10 punti esperienza per un Maggiore, 2 per un Minore (XP in src/core/progress.js). La carta entra nel grimorio."
rischio: "Nessuno. Le tre parole si possono saltare con «Salta»."
tratti: "Nessuno direttamente; le deviazioni per cercarla muovono «esplora» (src/glue/traits.rules.js)."
aperto: "Le tre parole e il dettaglio non tornano mai come domanda."
---

È un piccolo rito di venti secondi: prima guardare, poi dire qualcosa di suo, poi sentire il libro. Quello che lei sceglie qui (il dettaglio, le parole) viene salvato nella carta e riusato dalla Lettrice.
