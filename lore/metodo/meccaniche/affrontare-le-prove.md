---
tipo: meccanica
nome: "Affrontare le prove"
dinamica: "esami-e-prove"
leggi:
  - "[[legge-il-concetto-e-una-chiave]]"
  - "[[legge-poche-cose-verificate]]"
motivo: "Ho una notte difficile davanti e non voglio perdere niente: a ogni bivio devo scegliere la strada giusta."
effetto: "Uso le carte in una situazione nuova (trasferimento), con una posta vera: sbagliare costa, e il riscontro spiega perché."
fonte: "copione"
dove:
  - "src/trials/run.js"
  - "src/glue/trials.js"
  - "src/ui/trial.js"
  - "src/data/trials/"
cosa_fa_la_giocatrice: "Una prova è un pezzo di storia con bivi: a ogni bivio lei chiede alle carte e sceglie la strada. Ci sono stanze buone e cattive, fughe con qualcuno dietro, e un conto degli errori. Tre principali, una per capitolo, e alcune secondarie con le streghe."
serve:
  - "[[vede-solo-quello-che-sa]]"
  - "[[nelle-prove-si-perde]]"
  - "[[le-carte-servono-a-muoversi]]"
  - "[[arriva-a-chi-e-avanti]]"
insegna:
  - "[[decidere-con-una-carta]]"
  - "[[capire-i-minori]]"
  - "[[leggere-le-capovolte]]"
tecniche:
  - "[[prova-con-la-posta]]"
  - "[[trasferimento-con-la-pratica]]"
  - "[[storia-ed-emozione]]"
  - "[[difficolta-desiderabile]]"
  - "[[riscontro-immediato]]"
ragione_nel_gioco: "Le streghe non decidono a caso: prima di una cosa che conta tirano fuori una carta. Portare di notte il cesto di Malva o uscire dalla nebbia con Ortica sono cose che servono a loro."
premio: "Senza errori: un premio vero, per esempio 30-40 punti, incenso, un oggetto, legame con la strega +1. Con uno o due errori si passa, con meno: 10-18 punti e qualche moneta (src/data/trials/main.js, side.js)."
rischio: "Ogni stanza cattiva toglie monete o uno strumento. Con tre errori o più si perdono monete, uno strumento e legame; nelle cantine anche un Minore, che va riscattato al deposito. Una prova non toglie mai una carta che serve a un cancello (gateCards in src/trials/run.js)."
tratti: "Alcune scelte muovono un tratto o il legame."
aperto: ""
---

Le prove sono dati, non codice: se ne aggiungono scrivendo un file in src/data/trials/ e passano dal registro.
