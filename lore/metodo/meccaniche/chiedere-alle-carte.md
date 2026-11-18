---
tipo: meccanica
nome: "Chiedere alle carte"
fonte: "copione"
dove:
  - "src/trials/ask.js"
  - "src/glue/trials.js"
  - "src/glue/elsewhere.js"
  - "src/ui/trial.js"
cosa_fa_la_giocatrice: "A un bivio pesca una carta tra quelle che ha studiato. Tre modi: il segno (favorevole o contraria: vado o no), l'idea (le strade sono descritte con cose, e l'idea della carta ne indica una), il quesito (una regola detta chiara). Dopo la scelta vede che cosa diceva la carta e che cosa è successo. Vede anche le streghe tirare una carta e agire di conseguenza."
serve:
  - "[[le-carte-servono-a-muoversi]]"
  - "[[la-domanda-non-mostra-la-risposta]]"
  - "[[leggere-e-l-attivita-vera]]"
  - "[[pochi-concetti-legati]]"
insegna:
  - "[[decidere-con-una-carta]]"
  - "[[dire-l-idea-della-carta]]"
  - "[[capire-i-minori]]"
tecniche:
  - "[[trasferimento-con-la-pratica]]"
  - "[[pratica-di-recupero]]"
  - "[[metafora-e-analogia]]"
  - "[[riscontro-immediato]]"
  - "[[difficolta-desiderabile]]"
ragione_nel_gioco: "A Salem le streghe consultano le carte prima di fare una cosa che conta. Le carte avvertono, non comandano: chi va contro una carta contraria a volte paga."
premio: "La strada buona; nelle prove, un errore in meno."
rischio: "La strada sbagliata è un errore della prova, con la sua perdita."
tratti: "Nessuno direttamente."
aperto: "Fuori dalle prove e da Altrove non si usa: trial.ask è pronto ma nessuna scena del mondo lo chiama. Le streghe tirano carte solo dentro le prove (witchDraw compare solo in src/data/trials/)."
---

Nel modo «idea» il nome della carta non è mai la soluzione: serve sapere che cosa vuol dire. È il ponte tra studiare una carta e usarla.
