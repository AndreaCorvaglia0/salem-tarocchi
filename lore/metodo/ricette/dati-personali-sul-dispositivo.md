---
tipo: ricetta
nome: "I dati personali sono facoltativi e restano vicino a lei"
famiglia: personalizzare
ambito: generale
problema: "La data di nascita rende il gioco suo, ma è un dato personale: chi non vuole darlo non deve perdere niente."
soluzione: "Nome e data si chiedono una volta, all'inizio, e l'anno è facoltativo. Ogni frase che li usa ha una versione neutra quando mancano. I dati restano sul telefono."
in_salem:
  - "[[la-lettrice-legge-lei]]"
  - "[[protagonista]]"
  - "[[conoscere-pianeti-e-segni]]"
si_controlla_con: "tests/core.portrait.test.mjs (i dati della nascita); a mano: ogni segnaposto di `fill()` in src/core/cond.js ha la sua frase neutra"
rischi: "Il salvataggio contiene nome e data: ogni copia fuori dal telefono rompe la promessa. Dal 17 novembre la copia nell'archivio dell'artefatto è spenta (CLOUD in src/core/vault.js); il codice della partita da copiare resta, ed è lei a decidere dove incollarlo."
fonte: "DESIGN.md, Il ritratto («chiesti all'inizio e tenuti solo sul telefono»); WRITING.md, Esempio: la prima seduta"
---

Dalla data vengono cose vere: il segno con la sua carta, l'elemento, il pianeta; con l'anno anche il giorno della settimana e la luna di quella notte (`hasYear`, `moon`, `bornOn` in src/core/cond.js). Senza l'anno, `{ moon: … }` è falso e `{moon}` nel testo diventa «una luna che non conosco». La Lettrice lo chiede così: «l'anno, se non ti va, puoi tenerlo per te».

Per un altro gioco: Mnemopolis chiede solo il nome, tenuto sul dispositivo. Ogni dato in più va chiesto con lo stesso garbo, e con una strada per non darlo.
