---
tipo: ricetta
nome: "Dalla mano tenuta al mazzo vero"
famiglia: imparare
ambito: generale
problema: "Un gioco che aiuta sempre insegna a scegliere tra tre risposte, non a leggere da sola."
soluzione: "Una scala con gradini chiari: la lezione con la maestra, la lettura guidata con tre scelte, la lettura per sé, la lettura con le carte vere pescate a casa. A ogni gradino il gioco toglie un aiuto."
in_salem:
  - "[[alla-fine-il-suo-mazzo]]"
  - "[[seguire-le-lezioni]]"
  - "[[leggere-ai-clienti]]"
  - "[[leggere-per-se]]"
  - "[[leggere-col-mazzo-vero]]"
  - "[[leggere-il-proprio-mazzo]]"
si_controlla_con: "a mano: oggi nessun test lo misura"
rischi: "L'ultimo gradino non ha riscontro: il gioco non sa se lei ci riesce. Due schermate fanno la stessa cosa (src/systems/free.js e src/ui/selfread.js)."
fonte: "DESIGN.md, Finale («Adesso leggi tu. Per te.»); Andrea, principio «Alla fine, il suo mazzo»"
---

Il finale è il gradino più alto dentro il gioco: la Lettrice le passa il mazzo e lei legge per sé una croce celtica fatta con la sua partita (src/glue/finale.rules.js). Dopo, dalla soglia, la lettura per sé le lascia indicare le carte vere pescate a casa e salva la lettura nel diario (src/glue/selfread.rules.js).

Il gradino che manca è «Prova tu prima»: scegliere l'idea di ogni carta prima di vedere il testo del motore (proposta in notes/lore-design.md, parte e).

Per un altro gioco: in Mnemopolis l'ultimo gradino è usare il concetto fuori dal gioco, per esempio mescolare un colore vero o suonare un accordo sulla chitarra, con il gioco che accompagna senza dare la risposta.
