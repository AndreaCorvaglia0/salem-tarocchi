---
tipo: meccanica
nome: "Studiare in biblioteca"
ambito: salem
dinamica: "ripasso"
leggi:
  - "[[legge-il-concetto-e-una-chiave]]"
  - "[[legge-poche-cose-verificate]]"
motivo: "Prima di una prova pericolosa voglio sapere che cosa «sente» la strega, e sfoglio il libro."
effetto: "Ripasso mirato prima di una notte difficile: pagine brevi con due domande (recupero e autospiegazione) per quella notte."
fonte: "copione"
dove:
  - "src/ui/library.js"
  - "src/trials/topics.js"
  - "src/glue/trials.js"
cosa_fa_la_giocatrice: "Nella casa di ardesia sfoglia il libro: in alto gli argomenti che una strega o Tartufo «sente» per la prossima prova, sotto tutto quello che può ripassare. Ogni argomento è una pagina breve (una carta, un seme, un gruppo di numeri, le capovolte) con due domande."
serve:
  - "[[vede-solo-quello-che-sa]]"
  - "[[sempre-chiaro-cosa-fare]]"
  - "[[le-carte-servono-a-muoversi]]"
  - "[[nelle-prove-si-perde]]"
concetti:
  - "arcano"
  - "seme"
  - "numero"
  - "figura"
  - "regola"
insegna:
  - "[[capire-i-minori]]"
  - "[[dire-l-idea-della-carta]]"
  - "[[leggere-le-capovolte]]"
  - "[[decidere-con-una-carta]]"
tecniche:
  - "[[pratica-di-recupero]]"
  - "[[elaborazione-e-autospiegazione]]"
  - "[[riscontro-immediato]]"
ragione_nel_gioco: "Prima di una cosa pericolosa si studia: non la risposta, ma quello da cui la risposta si ricava."
premio: "3 punti per argomento, una volta al giorno. La prima visita è una chiave prima delle prove."
rischio: "Nessuno."
tratti: "Nessuno."
aperto: "Aver studiato un argomento non cambia niente nella prova: isFresh (src/trials/topics.js) non è usato fuori dalla biblioteca."
---

Su tre o quattro argomenti sentiti, ne serviranno davvero due: così si ripassa senza sapere già la risposta.
