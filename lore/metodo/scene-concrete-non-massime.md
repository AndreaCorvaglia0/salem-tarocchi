---
tipo: metodo
nome: "Una scena concreta, non una massima"
famiglia: scrivere
ambito: generale
problema: "Le frasi corte a effetto («Sette spicchi, una luna.») suonano finte e costringono chi legge a ricostruire i legami da sola."
soluzione: "Frasi intere, legate tra loro, in italiano di tutti i giorni. Al posto di una sentenza, una scena precisa e un gesto piccolo."
in_salem:
  - "[[il-testo-e-la-chiave]]"
  - "[[esempi-concreti]]"
  - "[[girare-la-carta-di-oggi]]"
si_controlla_con: "scripts/prose.mjs (raffiche di frasi corte, frasi di una o due parole); tests/daily.data.test.mjs (misure e stile delle frasi del giorno); node scripts/readings.mjs --lint (le frasi del motore); la lettura ad alta voce, a mano"
rischi: "Il controllo automatico trova la forma, non il tono: una massima lunga passa. Le righe della Lettrice alla luna piena sono ancora frasi a effetto (notes/lore-design.md, parte d)."
fonte: "WRITING.md, Il difetto da evitare e regole 1-3; DESIGN.md, La carta di oggi, in grande («una scena concreta di tutti i giorni e un gesto piccolo»)"
---

Esempio da WRITING.md: «Salem. Inverno. Notte.» diventa «È una notte d'inverno, e a Salem nevica ormai da tre giorni.». Le frasi della carta di oggi sono state riscritte così: da 12 a 24 parole, una scena di tutti i giorni, mai «una cosa» o «un impegno» (src/data/daily/). Le frasi del motore di lettura hanno le loro regole di forma in READING.md: da 7 a 18 parole, un'idea sola.

Per un altro gioco: Mnemopolis ha la sua guida alla prosa (skills/knowledge-base/references/9-prose.md). Le regole di WRITING.md sono pensate per l'italiano; per l'inglese vanno riscritte, non tradotte.
