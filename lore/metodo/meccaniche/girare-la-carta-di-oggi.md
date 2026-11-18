---
tipo: meccanica
nome: "Girare la carta di oggi"
fonte: "copione"
dove:
  - "src/ui/daycard.js"
  - "src/glue/threshold.js"
  - "src/glue/threshold.rules.js"
  - "src/data/daily/"
  - "src/glue/day.js"
  - "src/core/state.js"
cosa_fa_la_giocatrice: "Sulla soglia, fuori dalla partita, tocca la carta coperta del giorno: si alza e riempie lo schermo. Sotto scorrono le pagine: una frase per la giornata, uno sguardo nuovo sulla carta, una domanda a memoria, il significato. Prima di girarla legge una nota dal quaderno. Al cottage può anche girarla dal letto. Un giorno su tre la carta di oggi è una delle sue carte da ripassare, e la risposta a «Senza guardare» conta come una risposta del ripasso (una volta al giorno)."
serve:
  - "[[mai-assillare]]"
  - "[[interfaccia-che-premia]]"
  - "[[prima-di-tutto-corretto]]"
  - "[[arriva-a-chi-e-avanti]]"
  - "[[il-testo-e-la-chiave]]"
insegna:
  - "[[riconoscere-una-carta]]"
  - "[[dire-l-idea-della-carta]]"
  - "[[ricordare-i-dettagli]]"
  - "[[conoscere-la-storia-dei-tarocchi]]"
  - "[[leggere-le-capovolte]]"
tecniche:
  - "[[ripetizione-distanziata]]"
  - "[[doppia-codifica]]"
  - "[[esempi-concreti]]"
  - "[[elaborazione-e-autospiegazione]]"
  - "[[pratica-di-recupero]]"
ragione_nel_gioco: "Una strega guarda una carta ogni mattina. La frase non predice: è un modo di guardare la giornata che nasce dall'idea della carta, così leggendola la impara."
premio: "Fa crescere la luna di uno spicchio. Se la carta è sua, la domanda a memoria sposta la sua scadenza nel ripasso e può accendere la prima stella. Dal letto del cottage: 5 punti, e quella carta è la prima del ripasso."
rischio: "Nessuno."
tratti: "Nessuno."
aperto: "Due giorni su tre la carta è scelta a caso tra tutte le 78, anche tra quelle che non ha (BACKLOG 2.2, scelta: la scoperta resta). Il messaggio del letto dice che la carta del giorno «paga di più» nelle letture, ma il motore nuovo (payOf in src/systems/consult.rules.js) non lo fa."
---

Ogni carta ha tre sguardi diversi (un dettaglio, la storia, il contesto o il rovescio): ogni volta che torna ne mostra uno nuovo, e la carta si muove con la pagina.
