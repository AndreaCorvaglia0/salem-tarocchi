---
tipo: "meccanica"
nome: "Seguire una missione"
ambito: salem
dinamica: "missioni"
leggi:
  - "[[legge-sempre-un-motivo]]"
  - "[[legge-il-concetto-e-una-chiave]]"
motivo: "Qualcuno mi ha parlato di qualcosa e voglio andare a vedere: il foglietto mi ricorda chi, dove e che cosa."
effetto: "I concetti servono a qualcosa che mi hanno chiesto: richiamo e uso, con una cosa sola da seguire alla volta."
fonte: "copione"
dove:
  - "src/ui/missions/"
  - "src/core/extras.js"
  - "notes/missions-design.md"
cosa_fa_la_giocatrice: "Ogni cosa in più di cui qualcuno le ha parlato (una carta, una lezione, una prova, l'orto, Altrove, una storia) è un foglietto appuntato accanto al suo posto sulla mappa; la storia principale è un foglietto con la stella. Toccandolo apre una scheda: il titolo, chi gliel'ha detto, dove, quello che le hanno detto, mai che cosa ci guadagna. «Seguila» mette il cerchio rosso su quella cosa al posto della storia; ne segue una sola alla volta. Il gioco ne mostra poche nuove per volta."
serve:
  - "[[sempre-chiaro-cosa-fare]]"
  - "[[vede-solo-quello-che-sa]]"
  - "[[arriva-a-chi-e-avanti]]"
concetti: []
insegna: []
tecniche:
  - "[[curiosita]]"
ragione_nel_gioco: "Qualcuno le ha parlato di qualcosa e lei vuole andare a vedere: il foglietto le ricorda chi, dove e che cosa le hanno detto."
premio: "Non si legge sulla scheda: si scopre facendo. Finita, il foglietto sbiadisce con una spunta."
rischio: "Nessuno."
tratti: "Nessuno."
aperto: "Il tocco dei foglietti da 30 px e lo scorrimento della pagina su un telefono vero li può provare solo Andrea (notes/missions-design.md)."
---

Una cosa aggiunta in una versione nuova dipende solo da quello che lei ha, mai dal punto della storia: chi è già avanti la incontra lo stesso, una alla volta e in ordine (src/core/extras.js).
