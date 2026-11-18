---
tipo: meccanica
nome: "Farsi leggere dalla Lettrice"
dinamica: "personaggi"
leggi:
  - "[[legge-e-lei-a-decidere]]"
  - "[[legge-da-molti-lati]]"
motivo: "La Lettrice racconta le mie carte partendo da quello che ho toccato e detto io: voglio sapere che cosa vede."
effetto: "Prima richiamo quello che mi aveva detto, poi la lettura riparte dalle mie parole: generazione, racconto e riscontro."
fonte: "copione"
dove:
  - "src/story/visit.js"
  - "src/story/visit.plan.js"
  - "src/story/session.js"
  - "src/core/progress.js"
  - "src/data/portrait.js"
  - "src/glue/finale.rules.js"
cosa_fa_la_giocatrice: "A metà capitolo la Lettrice, prima di girare le carte nuove, le chiede che cosa le aveva detto di una carta già raccontata («Ti ricordi che cosa ti avevo detto del Carro?», tre idee), e risponde lei. Poi gira le carte nuove e le racconta partendo dal dettaglio che lei ha toccato e dalle sue tre parole, poi fa una domanda a due risposte. Alle sedute di fine capitolo fa domande ad albero (valori, paure, sogni) e dice qual è, per ora, la sua carta. Nel finale le passa il mazzo per una croce celtica fatta con la sua partita."
serve:
  - "[[la-lettrice-legge-lei]]"
  - "[[il-testo-e-la-chiave]]"
  - "[[i-personaggi-non-spiegano]]"
  - "[[alla-fine-il-suo-mazzo]]"
  - "[[niente-tocchi-per-sbaglio]]"
insegna:
  - "[[dire-l-idea-della-carta]]"
  - "[[riconoscere-una-carta]]"
tecniche:
  - "[[elaborazione-e-autospiegazione]]"
  - "[[storia-ed-emozione]]"
  - "[[effetto-generazione]]"
  - "[[doppia-codifica]]"
  - "[[pratica-di-recupero]]"
  - "[[riscontro-immediato]]"
  - "[[riferimento-a-se]]"
ragione_nel_gioco: "La Lettrice è la voce fuori dal gioco, e legge lei. Ogni tratto di strada finisce al suo tavolo."
premio: "Ogni carta raccontata prende la seconda stella (+5 punti) e da allora può essere chiesta per significato. Una visita vale 10 punti. La risposta alla domanda della Lettrice conta per il ripasso di quella carta."
rischio: "Nessuno."
tratti: "Tutti e cinque, con le risposte; la sua carta si sposta con loro."
aperto: "La domanda è a scelta tra tre e su una carta sola per visita; le sedute di fine capitolo non chiedono niente delle carte."
---

Il ritratto sono cinque tratti tra due poli (src/core/progress.js AXES). La carta finale «quella su cui ha sbagliato di più» viene dagli errori registrati (mostMissed).
