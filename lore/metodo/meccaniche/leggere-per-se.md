---
tipo: meccanica
nome: "Leggere per sé"
dinamica: "letture"
leggi:
  - "[[legge-il-concetto-e-una-chiave]]"
  - "[[legge-e-lei-a-decidere]]"
motivo: "Voglio sapere che cosa mi dicono le mie carte oggi, e il diario tiene quello che mi hanno detto."
effetto: "Prima di leggere provo io a dire l'idea di ogni carta (generazione); poi la lettura parla di me."
fonte: "copione"
dove:
  - "src/ui/selfread.js"
  - "src/glue/selfread.js"
  - "src/glue/selfread.rules.js"
  - "src/ui/readings.js"
  - "src/ui/title.js"
cosa_fa_la_giocatrice: "Dalla soglia, «Leggi le tue carte»: sceglie il tema con due o tre domande secche, pesca qui d'istinto oppure indica le carte vere che ha pescato a casa, prima di vedere il testo prova lei: per ogni carta sceglie tra tre l'idea che porta («Prima di leggere: che idea porta questa carta?»; «Leggo e basta» salta i tentativi di quella lettura), poi legge la lettura composta dal motore, con in testa quante ne aveva capite da sola, e scrive una nota. La lettura resta nel diario."
serve:
  - "[[alla-fine-il-suo-mazzo]]"
  - "[[mai-assillare]]"
insegna:
  - "[[leggere-il-proprio-mazzo]]"
  - "[[leggere-in-posizione]]"
  - "[[dire-l-idea-della-carta]]"
tecniche:
  - "[[trasferimento-con-la-pratica]]"
  - "[[effetto-generazione]]"
  - "[[pratica-di-recupero]]"
  - "[[difficolta-desiderabile]]"
  - "[[riscontro-immediato]]"
  - "[[riferimento-a-se]]"
ragione_nel_gioco: "Una strega legge anche per sé. La prima volta la Lettrice le dice qualche parola; il diario tiene quello che le carte le hanno detto."
premio: "5 punti, solo per la prima lettura di ogni giorno. Niente monete, niente popolarità. Un tentativo su una carta che possiede conta per il suo ripasso, come nelle letture ai clienti."
rischio: "Nessuno: i tentativi si contano solo per lei (state.readings[].tried), non danno né tolgono niente."
tratti: "Nessuno."
aperto: "Si prova solo l'idea della carta, a scelta tra tre: non che cosa vuol dire in quel posto, né con parole sue. I tentativi stanno nel diario ma nessuna schermata li mostra nel tempo. Si apre solo dopo la prima lettura a un cliente."
---

Una carta o tre; la croce celtica solo quando l'ha imparata. Le letture ai clienti finiscono anche loro nel diario, da sole.
