---
tipo: meccanica
nome: "Scegliere le pietre con Edera (l'interesse da strega)"
dinamica: "interessi"
leggi:
  - "[[legge-si-vede-e-si-tocca]]"
  - "[[legge-il-concetto-e-una-chiave]]"
  - "[[legge-e-lei-a-decidere]]"
motivo: "Edera ha perso la pietra della nonna e ricorda il colore ma non il nome: mi chiede una mano."
effetto: "Riconosco le pietre dall'aspetto e scrivo i cartellini: esempi concreti e azione, con il riscontro il giorno dopo."
fonte: "proposto"
dove:
  - "src/glue/interests.edera.js"
  - "src/glue/interests.edera.rules.js"
  - "src/data/interests/edera.js"
  - "src/data/story/scripts/interests.edera.js"
  - "src/ui/interests/cellar.js"
  - "src/ui/interests/stones.js"
  - "src/systems/exam.js"
cosa_fa_la_giocatrice: "Aiuta Edera con le mani: cerca nelle cantine il lapislazzuli di sua nonna (sei posti, Edera ne ricorda tre e sbaglia ogni volta) e lo lava al pozzo vecchio; sceglie tra le sue pietre quella che dà coraggio al conestabile del pozzo; scrive i cartellini sotto le pietre di Edera, in biblioteca, riconoscendole dall'aspetto. Ogni missione è per qualcuno che chiede, e il giorno dopo si vede che cosa è cambiato."
serve:
  - "[[vede-solo-quello-che-sa]]"
  - "[[arriva-a-chi-e-avanti]]"
  - "[[mai-assillare]]"
  - "[[erbe-come-storia]]"
  - "[[i-personaggi-non-spiegano]]"
  - "[[nelle-prove-si-perde]]"
insegna:
  - "[[conoscere-pianeti-e-segni]]"
  - "[[rispondere-a-chi-chiede]]"
tecniche:
  - "[[trasferimento-con-la-pratica]]"
  - "[[riscontro-immediato]]"
  - "[[doppia-codifica]]"
  - "[[effetto-dell-azione]]"
ragione_nel_gioco: "Edera ha perso la pietra della nonna, il conestabile del pozzo ha paura dei cani che abbaiano alla luna, e delle sue pietre Edera ricorda il colore ma non il nome: c'è sempre qualcuno che chiede."
premio: "Ogni missione: 5 punti e legame con Edera +1. Dopo la seconda, il primo gradino («In tasca»): dall'album tiene in tasca una pietra; se è di coraggio o di protezione, una volta al giorno l'errore che le farebbe perdere un Esame si annulla e la domanda dopo è su un'altra carta («Il conestabile esita.»)."
rischio: "Nessuno nelle missioni: una pietra sbagliata viene spiegata da Edera con quello a cui serve, e si sceglie di nuovo. Gli Esami restano rischiosi: la pietra toglie un solo errore, una volta al giorno, mai davanti al Giudice."
tratti: "Rischio (cercare subito o tornare), esplora o tono (il conestabile il giorno dopo)."
aperto:
  - "Proposto, da confermare: le missioni 4-6 di Edera (notes/interessi/PROGETTO.md §4). Nella sesta Edera la chiama una volta col suo nome vero invece che Rosalba (deciso il 18 novembre, decisioni-2026-11-18, interessi 2): non è ancora scritta."
  - "Proposto, da confermare: il gradino 1 nella versione leggera. Il progetto diceva «il primo Esame sbagliato del giorno diventa un secondo tentativo»: un secondo Esame intero toglieva quasi tutte le perdite (al capitolo 3, tre risposte giuste su quattro, l'Esame del conestabile si perde il 14% delle volte, con un secondo Esame intero l'1,5%, con la versione leggera circa il 6%: tests/interests.edera.test.mjs)."
  - "Il soprannome in paese («quella delle pietre», deciso il 18 novembre) e la fila di pietre sulla finestra arrivano con la fetta del preponderante."
---

Un interesse è una strega, un gesto delle mani e sei missioni; i gradini arrivano alla seconda, quarta e sesta, e non si annunciano (il gradino 1 si scopre con una riga dell'interfaccia, una volta, e nell'album). La catena è nel registro delle cose in più (una missione alla volta, una al giorno per questo interesse), dipende da quello che lei ha (le prime parole di Edera sulle pietre e tre pietre nell'album) e non è mai necessaria per finire la storia. Che cosa fa una pietra si ricava dal cerchio (src/data/sapere.js, lore/corso/concetti/pietra-*.md): la pietra giusta per il conestabile è una pietra di coraggio, non un elenco scritto a mano. Se tra le sue non ce n'è una, Edera ne mette una sua sul fazzoletto («Questa è mia. La prossima volta portami la tua.»).
