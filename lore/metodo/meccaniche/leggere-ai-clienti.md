---
tipo: meccanica
nome: "Leggere ai clienti"
dinamica: "letture"
leggi:
  - "[[legge-il-concetto-e-una-chiave]]"
motivo: "Una cliente aspetta una risposta e paga chi legge bene: se leggo bene, il mio nome gira."
effetto: "Richiamo l'idea di ogni carta e unisco più carte per una domanda vera: pratica di recupero e trasferimento."
fonte: "copione"
dove:
  - "src/systems/reading.js"
  - "src/systems/consult.js"
  - "src/systems/consult.rules.js"
  - "src/systems/reading.rules.js"
  - "src/glue/clients.js"
  - "src/glue/clients.rules.js"
  - "src/reading/"
  - "src/core/bonds.js"
cosa_fa_la_giocatrice: "Al cottage bussa qualcuno con una domanda. Lei pesca le carte e per ognuna risponde a due domande: «Che idea porta questa carta?» e «E qui, per questa domanda, che cosa vuol dire?». Poi vede la lettura intera e sceglie che cosa rispondere: bene, dipende o male. Qualche visitatore va mandato via."
serve:
  - "[[leggere-e-l-attivita-vera]]"
  - "[[alla-fine-il-suo-mazzo]]"
  - "[[le-carte-servono-a-muoversi]]"
  - "[[il-testo-e-la-chiave]]"
insegna:
  - "[[dire-l-idea-della-carta]]"
  - "[[leggere-in-posizione]]"
  - "[[unire-le-carte]]"
  - "[[rispondere-a-chi-chiede]]"
  - "[[leggere-le-capovolte]]"
  - "[[capire-i-minori]]"
tecniche:
  - "[[trasferimento-con-la-pratica]]"
  - "[[pratica-di-recupero]]"
  - "[[esempi-concreti]]"
  - "[[riscontro-immediato]]"
  - "[[storia-ed-emozione]]"
ragione_nel_gioco: "È il suo mestiere e il suo pane: la gente di Salem ha domande vere (un raccolto, un figlio, un amore) e paga chi legge bene. Se legge bene il suo nome gira, e bussano persone più importanti."
premio: "Punti: 6, più 5 per risposta giusta in proporzione (xpFor in src/systems/reading.rules.js). Monete: paga intera se la risposta finale è giusta e gli errori non superano un terzo, altrimenti metà (payOf). Popolarità: +2 senza errori, +1 con pochi, +1 la prima volta che un cliente torna (popForReading in src/core/bonds.js)."
rischio: "Metà paga e niente popolarità se sbaglia troppo. Un errore rimette la carta a domani nel ripasso."
tratti: "Le risposte ai visitatori da mandare via muovono un tratto (src/glue/clients.js). Il tono della risposta è stato tolto."
aperto: "Il tono (con garbo o senza giri di parole) di READING.md non c'è più. L'aiuto «Ricordamela» non costa niente e dal 18 novembre dà un indizio, non le parole della carta (src/systems/consult.rules.js helpNote). Quando non tutte le carte hanno una voce si usa ancora il vecchio motore (src/systems/reading.js)."
---

Le letture usano solo le carte che lei ha, e i Minori solo dopo la loro lezione. Con la popolarità arrivano clienti migliori e, a volte, un secondo visitatore che aspetta fuori.
