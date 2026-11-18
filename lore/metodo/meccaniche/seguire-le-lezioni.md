---
tipo: meccanica
nome: "Seguire le lezioni"
dinamica: "missioni"
leggi:
  - "[[legge-si-entra-piano]]"
  - "[[legge-da-molti-lati]]"
motivo: "Sono un'apprendista: le maestre mi insegnano il mestiere perché serve a loro e al villaggio."
effetto: "Due esempi svolti e due domande di pratica, un passo alla volta; la voce della maestra rende il racconto."
fonte: "copione"
dove:
  - "src/data/lessons.js"
  - "src/data/story/scripts/lessons.js"
  - "src/glue/lessons.js"
  - "src/glue/lessons.rules.js"
  - "src/ui/lessons.js"
cosa_fa_la_giocatrice: "Ascolta una maestra in una scena breve. Le lezioni della storia (il mazzo, la carta singola, passato-presente-futuro, la croce celtica, semi ed elementi, pianeti) restano come pagine nel grimorio. Le cinque lezioni sui Minori e quella sulle capovolte hanno due esempi svolti e due domande di pratica."
serve:
  - "[[vede-solo-quello-che-sa]]"
  - "[[sempre-chiaro-cosa-fare]]"
  - "[[arriva-a-chi-e-avanti]]"
  - "[[prima-di-tutto-corretto]]"
  - "[[il-testo-e-la-chiave]]"
insegna:
  - "[[capire-i-minori]]"
  - "[[conoscere-le-stese]]"
  - "[[leggere-le-capovolte]]"
  - "[[conoscere-pianeti-e-segni]]"
tecniche:
  - "[[esempi-concreti]]"
  - "[[pratica-di-recupero]]"
  - "[[riscontro-immediato]]"
  - "[[metafora-e-analogia]]"
  - "[[storia-ed-emozione]]"
  - "[[padronanza-prima-di-avanzare]]"
ragione_nel_gioco: "È un'apprendista: le maestre le insegnano il mestiere perché serve a loro e al villaggio. Ogni lezione viene da una persona con la sua voce: Malva brusca, Ortica che divaga, Edera lenta e gentile."
premio: "Domanda di pratica giusta: 5 punti. Fine di una lezione sui Minori: 10 punti. La lezione apre le stese e i Minori nelle letture (minorTaught in src/glue/lessons.rules.js)."
rischio: "Nessuno: una risposta sbagliata riceve la correzione e la lezione continua."
tratti: "Alcune scelte nelle scene muovono un tratto."
aperto: "Le lezioni della storia sulle stese non hanno domande di pratica né un esempio svolto: sono solo pagine."
---

Le lezioni arrivano una alla volta, mai sopra una scena e mai dove la storia ha da fare (canAnnounce in src/glue/lessons.rules.js). Quelle aggiunte dopo arrivano anche a chi era già avanti.
