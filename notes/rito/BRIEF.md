# Il rito del fumo: gara di progetto

Quattro proposte diverse, poi giudici, poi si costruisce la migliore (o un innesto). Tutto in italiano.

## Che cosa vuole Andrea (parole sue, 17 novembre)

«Lavoriamo concretamente al rito dell'incenso e della pulizia delle energie e dell'intuito sulla scelta
dell'atmosfera. Capiamo che soluzione di gameplay è migliore. […] Proviamo a vedere se produciamo qualcosa che
fila, non è pesante e ha davvero come effetto il rituale, l'attenzione ed eventualmente davvero imparare quale
incenso quando, se possibile.»

E prima: «un rituale del tipo: ascolta il respiro, pensa alla domanda, quale incenso sceglieresti; che porta
colore, atmosfera, suono, così ci si ricollega alla propria percezione, a una propria intuizione rispetto alla
domanda, e crea un momento di auto-ascolto». «Potrebbe accendere l'incenso con un gesto specifico sullo
schermo, magari diverso a seconda dell'incenso, magari con un significato.» Musica: brani veri, non generati.
Si sfrutta anche la convinzione: un rito fa effetto perché lo si compie.

## Vincoli che valgono per tutte le proposte

- Telefono, 390×844, un dito. Il gioco ha una protezione dai tocchi (un pulsante appena comparso non si tocca
  per 650 ms) e la pagina scorre: i gesti non devono litigare con questo.
- Dove vive: prima di una lettura per un cliente (`src/systems/consult.js`), prima di «Leggi le tue carte» col
  mazzo vero (`src/ui/selfread.js`, `src/systems/free.js`), e alla soglia. Deve funzionare la prima volta e la
  centesima: dire come si accorcia senza svuotarsi.
- Non pesa: il tempo totale va dichiarato al secondo, per la prima volta e per la ventesima.
- Niente risposta sbagliata sull'intuizione; nessuno spiega il gioco (lo fa la schermata); testo secondo
  `docs/WRITING.md`; a lei ci si rivolge al femminile; mai assillante; niente avvertenze.
- I sensi: musica vera scelta con ricette (`docs/BACKLOG.md` 3.5, `docs/RESEARCH.md`), strati d'ambiente,
  colore e movimento del fumo, luce. Nessuno di noi sente: vedi `lore/metodo/progettare-per-i-sensi-senza-averli.md`.
- I fumi e a che cosa servono: usare quelli di `docs/BACKLOG.md` 3.5 (provvisori; la base di conoscenza
  `lore/sapere/` è in costruzione e li confermerà). Al massimo cinque più quello d'apertura.
- Deve poter insegnare, se possibile, «quale incenso quando», senza trasformare l'intuizione in un quiz.
- Si deve poter costruire con ciò che c'è: DOM sopra il mondo, canvas, audio a file con dissolvenze
  (`src/sound/tracks.js`, `beds.js`), stato salvato con valori di default.

## Che cosa deve contenere ogni proposta (stesso ordine, massimo 220 righe)

1. **L'idea in tre righe**, e che cosa la distingue.
2. **La sequenza, secondo per secondo**, la prima volta: che cosa c'è sullo schermo, che cosa fa il dito, che
   cosa si sente, che cosa si legge (i testi veri, in italiano).
3. **La ventesima volta:** che cosa resta, che cosa sparisce, quanto dura.
4. **I gesti:** quali, con che significato, come si riconoscono senza errori, l'alternativa semplice.
5. **La pulizia delle energie:** dov'è, che cosa si fa, perché non è un passo in più.
6. **L'intuizione:** come sceglie l'atmosfera, come il gioco onora la scelta, lo specchio dopo.
7. **Imparare quale incenso quando:** se e come succede; dopo quante letture sa dire «la mirra è per…».
8. **Suono, colore, luce:** per ogni fumo, una riga; il motivo d'apertura; che cosa cambia nella stanza.
9. **Che cosa dà in gioco** (se dà qualcosa) e che cosa non toglie mai.
10. **Dati e stato:** che cosa si salva, valori di default, partite vecchie.
11. **La versione più piccola che vale la pena costruire**, e che cosa si aggiunge dopo.
12. **Dove può fallire**, onestamente, e come ce ne accorgeremmo.
