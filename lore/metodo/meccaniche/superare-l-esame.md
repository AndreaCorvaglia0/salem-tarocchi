---
tipo: meccanica
nome: "Superare l'Esame"
dinamica: "esami-e-prove"
leggi:
  - "[[legge-poche-cose-verificate]]"
  - "[[legge-il-concetto-e-una-chiave]]"
motivo: "Un conestabile mi ferma e la barra del sospetto sale: non voglio essere scoperta."
effetto: "Verifico il nucleo sotto una posta vera, con domande miste e riscontro a ogni risposta: recupero con la posta."
fonte: "copione"
dove:
  - "src/systems/exam.js"
  - "src/systems/exam.rules.js"
  - "src/data/questions.js"
  - "src/world/scene/World.js"
cosa_fa_la_giocatrice: "Un conestabile con la lanterna o un'Afflitta la vede e la ferma. Lei risponde a tre domande (quattro nel capitolo 2, cinque nel 3) sulle sue carte mentre sale la barra del sospetto. Al processo il Giudice fa otto domande su tutti i Maggiori."
serve:
  - "[[nelle-prove-si-perde]]"
  - "[[le-carte-servono-a-muoversi]]"
  - "[[la-domanda-non-mostra-la-risposta]]"
  - "[[niente-tocchi-per-sbaglio]]"
insegna:
  - "[[riconoscere-una-carta]]"
  - "[[dire-l-idea-della-carta]]"
  - "[[conoscere-le-stese]]"
  - "[[conoscere-pianeti-e-segni]]"
tecniche:
  - "[[prova-con-la-posta]]"
  - "[[pratica-di-recupero]]"
  - "[[alternanza-dei-temi]]"
  - "[[riscontro-immediato]]"
  - "[[storia-ed-emozione]]"
ragione_nel_gioco: "Sapere le carte tiene in piedi l'incantesimo che la nasconde: chi esita si tradisce. A Salem gli accusati venivano davvero «esaminati» dai magistrati."
premio: "Esame superato: 10 punti. Ogni risposta muove le stelle e il ripasso della carta."
rischio: "Ogni errore alza il sospetto di 34 (il Giudice di 25; l'Afflitta parte già da 50). A 100, o a fine Esame sopra 67, è bocciata: la cella e una o due carte maggiori sequestrate, mai Il Matto, e almeno due carte le restano. Al processo non si sequestra niente: il seguito lo decide la storia. I primi due Esami perdonano un errore."
tratti: "Sfidare o evitare le ronde muove «rischio» (src/glue/traits.rules.js)."
aperto: ""
---

Aiuti: Tartufo toglie una risposta sbagliata una volta, il pendolo ne toglie una, l'incenso abbassa il sospetto di 30. Al processo aiutano le maestre che si fidano: Edera toglie una risposta, Ortica fa saltare una domanda, Malva perdona un errore. Le carte che la Lettrice non ha ancora raccontato si chiedono solo per nome o dettaglio.
