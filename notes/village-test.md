# Prova dei lettori ingenui: orientarsi guardando (17 novembre)

**Stato: 18 novembre, due giri. Malva e biblioteca corrette e ora riconosciute; bottega riconosciuta; quartieri ambigui.** L'agente che ha portato gli edifici nel gioco non aveva lo strumento per lanciare altri agenti
(nessun «Agent» fra i suoi strumenti), e non ha voluto aggirarlo lanciando a mano un altro Claude dalla riga di
comando. Le schermate e le domande sono pronte qui sotto: la prova la lancia il capofila (modello «haiku», uno o
due alla volta, ognuno vede UNA sola schermata e niente altro), e scrive le risposte in questo file.

## Le schermate

Del gioco vero, telefono 390x844 a 2x, senza nomi sulle porte, senza fumetti né suggerimenti
(`harness/village.steps.mjs`). Dopo: `/home/claude/shots/village-new/after/`; prima, gli stessi punti con l'arte
di prima: `/home/claude/shots/village-new/before/` (utile come confronto: stessa domanda, schermata vecchia).

| # | schermata | domanda | risposta giusta |
|---|---|---|---|
| 1 | `door-library.png` | «Quale di questi edifici è la biblioteca? e il tribunale? la casa di una strega? Come lo capisci?» | biblioteca: la torre stretta d'ardesia con la finestra a punta accesa (in alto); tribunale: pietra chiara, frontone con la bilancia (in basso); strega: nessuna |
| 2 | `door-court.png` | come 1 | tribunale al centro; in basso la casa in rovina |
| 3 | `door-malva.png` | «Quale di queste case è di una strega? Come lo capisci?» | quella in basso, calda, con erbe appese, scopa e insegna col mortaio; sopra c'è la casa ricca (Proctor) |
| 4 | `door-meeting.png` | «Che cos'è l'edificio con la torre? Che cosa si vede da lontano qui?» | casa delle riunioni (campanile, insegna con la campana) |
| 5 | `door-shop.png` | «C'è una bottega? Quale? Che cosa vende, secondo te?» | la casa nera con la porta nera, la vetrina viola, l'insegna con la bottiglia |
| 6 | `district-upper.png` + `district-lower.png` (due tester diversi) | «Questa è la parte ricca o la parte povera del paese? Da che cosa lo capisci?» | alta: lastre di pietra, ordinata; bassa: terra battuta, assi storte |
| 7 | `district-market.png` | «Dove sei: in piazza, al mercato o in una strada di case?» | al mercato (banchi, paglia) |
| 8 | `square-night.png` | «Se dovessi dare appuntamento a qualcuno qui, che cosa gli diresti di cercare?» | il pozzo, il grande albero, il campanile |
| 9 | `forest-ortica.png` | «Chi abita qui, secondo te? Come lo capisci?» | una strega delle erbe (il faggio, i vasi, il paiolo, il merlo) |
| 10 | `forest-mill.png` | «Che edificio è?» | il mulino (la ruota) |
| 11 | `cottage-1.png`, `cottage-2.png`, `cottage-3-cups.png` (un tester ciascuna, poi uno che le vede tutte e tre) | «Com'è messa questa casa? Chi ci vive?» / «Che cosa è cambiato da una all'altra?» | sbilenca; rimessa a posto; casa di una strega |

Se un lettore non distingue due edifici (per esempio biblioteca e casa delle riunioni, o Malva e la casa ricca dei
Proctor), si cambia quello che li confonde e si rifà la prova solo su quelli.

## Che cosa ha guardato l'agente (non è una prova ingenua: sa già le risposte)

- Tribunale: il frontone alto con la bilancia e le tre urne si legge anche nel buio e sotto la neve; non somiglia
  più a un grosso scatolone.
- Biblioteca: alta, stretta, ardesia blu, una sola finestra a punta accesa: si distingue dal tribunale e dalle case.
- Campanile: si vede dalla piazza, dalla parte alta e dal cancello del bosco; vicino al cancello la guglia passa
  davanti alla staccionata (in una vista dall'alto le cose alte coprono quello che sta dietro).
- Malva: tavole ocra calde, camino storto, erbe sotto la gronda, scopa: meno chalet della tavola di prova. Rischio:
  la casa ricca dei Proctor, subito sopra, è anch'essa calda (rosso bruno, tre finestre accese): un lettore
  ingenuo potrebbe scambiarle. Da provare (domanda 3).
- La capanna: lo stadio 2 si distingue dall'1 per il camino più alto e dritto col comignolo e la lanterna; lo
  stadio 3 per l'abbaino tondo, la banderuola col gatto, il portichetto. Nelle schermate a piedi la capanna sta
  in cima alla mappa e la telecamera non la centra: si vede, ma piccola.
- Mappa del grimorio: ogni edificio con insegna ha accanto una tavoletta col simbolo. Sul telefono il disegnino è
  piccolo (circa 22 px): il simbolo si riconosce a fatica; da guardare sul telefono vero.
- Quartieri: la parte alta a lastre e la parte bassa con le assi si vedono; la paglia del mercato è discreta.

## Risultati, primo giro (18 novembre, haiku, una schermata ciascuno)

- **Domanda 3, `door-malva.png`: fallita.** «Non lo so con certezza» quale sia la casa della strega; le due case
  (Malva e Proctor) «facili da confondere: entrambe in legno, porta verde, finestre gialle accese; si distinguono
  solo per il tetto e l'insegna». Il lettore prende la figura col cappello (la giocatrice) come indizio di strega.
- **Domanda 1, `door-library.png`: metà.** Il tribunale si riconosce subito dalla bilancia. La biblioteca **non
  si trova**: nessun libro visibile, insegna troppo piccola; la torre stretta d'ardesia viene presa per la casa
  di una strega (per il gatto e la figura davanti, che sono la giocatrice).
- Correzione affidata a un agente (casa di Malva eccentrica e diversa dai Proctor; biblioteca con libri e
  insegna leggibile); poi si rifanno le domande 1 e 3 con lettori nuovi, e le altre nove.

## Secondo giro (18 novembre, lettori nuovi, scatti `after2/` dopo la correzione)

- **Domanda 3, Malva: passata.** «la casetta con tetto viola, falce di luna, calderone, bottiglie colorate, porta
  viola ad arco». Resta: di notte le finestre calde di tutte e due le case si somigliano un poco; l'insegna viola
  «può sembrare un negozio» (va bene: è anche una bottega di erbe).
- **Domanda 1, biblioteca: passata.** «finestra ad arco piena di libri colorati, libro aperto sopra la porta».
  Tribunale riconosciuto dalla bilancia.
- **Domanda 5, bottega (`after/door-shop.png`): passata.** Riconosce l'insegna con l'ampolla; pensa a pozioni.
- **Domanda 6, quartiere basso (`after2/district-lower.png`): incerta.** Vede la casa ricca dei Proctor e quella di
  Malva come «parte ricca» e le case buie a sinistra come povere: l'inquadratura mescola i due quartieri. Non si
  corregge ora: da rifare con un'inquadratura solo del quartiere basso.
- Non rifatte: 2, 4, 7–11.
