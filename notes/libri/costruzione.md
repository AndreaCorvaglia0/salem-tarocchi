# Lo scaffale: com'è costruito (18 novembre, agente dei libri)

- Dati: `src/data/books/<id>.js` (un libro per file) e `src/data/books/index.js` (ordine, `EARN` come arriva,
  `AFTER` che cosa lascia). Regole pure: `src/glue/books.rules.js`. Cablaggio: `src/glue/books.js`.
  Schermi: `src/ui/books.js` (scaffale e lettore). Nastro «Libri» del grimorio (`ui/grimoire.js`) dopo la prima
  visita in biblioteca o il primo libro; nella biblioteca l'ancora `library.shelf` («Sfoglia»).
- Stato: `books`, `booksRead`, `bookDay` (in `fresh()` e `migrate()`); copie nei flag `book.<id>` e
  `book.<id>.read`, che qualunque condizione di `cond.js` può chiedere (per esempio l'interesse delle erbe:
  `{ flag: 'book.durante.read' }`).
- Ritmo: un libro nuovo al giorno al massimo (quello iniziale e quelli in un posto esclusi). Se lei è dentro una
  scena, la consegna alla capanna o di Tartufo riprova fino a tre volte, poi alla prossima entrata.
- Libri: Agrippa (all'inizio, di Edera), Durante (Ortica), Artemidoro (vedova Bray, dietro la porta della
  capanna), Scot (deposito del tribunale), il libro illeggibile (Tartufo, dopo aver letto il Durante).
- Mancano: i due libri della Lettrice (Court de Gébelin 1781, Waite 1911), il lapidario, l'almanacco, i segreti,
  Josselyn, il quaderno del sagrestano. Per Waite non c'è su Internet Archive una scansione del 1911 (solo
  ristampe del 1959-1975): da cercare altrove.
- Schermate: `harness/books.steps.mjs` → `/home/claude/shots/libri/`.
