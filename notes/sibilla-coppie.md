# Le coppie della sibilla (pagina di progetto)

18 novembre 2026. BACKLOG 3.0, «un gioco nel gioco per allenare l'intuito» (Andrea). È il gioco che userà la catena
di Ginepra (`notes/interessi/PROGETTO.md` §5, «Il banco dell'ambulante»): qui solo il gioco, non la catena.
Tutto è **proposto**.

## Che cosa si gioca (un giro, meno di 40 secondi)

1. Dall'album «Sibilla», quando ha **almeno 4 figurine** e Ginepra le ha già detto che cosa sono (le prime parole,
   `first.sibyl`: prima di allora non sa che si leggono insieme), un tasto «Gioca a coppie».
2. Un banco del mercato (tenda a strisce, assi di legno, un panno): una domanda di tutti i giorni su un foglietto
   («Arriva una lettera?», «Il vicino è sincero?») e due figurine coperte, **solo tra quelle che ha**.
3. Tocca e si girano (le carte vecchie di `public/sibyl`); sotto ciascuna il nome e le parole chiave.
4. «Che cosa dicono insieme?»: tre frasi brevi scritte per quella coppia, oppure «Lo dico io» e scrive la sua.
5. Dopo, senza giudizio: la sua frase; **come si legge di solito** (la prima figura dice di che cosa si parla, la
   seconda ci mette il colore, con le parole chiave); e **Ginepra**, una riga leggera a modo suo. Niente «giusto»,
   niente punti, nessun segno su quale frase somiglia a quella di tradizione.
6. «Un'altra coppia» o «Basta così».

Dopo sei giri contati, con almeno sei figurine, un giro su due le figurine sono **tre** (si leggono a due a due:
la prima con la seconda, la seconda con la terza; le frasi diventano «prima, poi, alla fine» e «al centro»).

## Le tre frasi

- Per le coppie più belle (una trentina, comprese quelle dei regali) tre frasi scritte a mano, la lettura di
  tradizione e la riga di Ginepra.
- Per le altre le compone il motore da tre pezzi scritti per ogni figurina: `noun` (il fatto: «una notizia»),
  `tint` (il colore: «che arriva in fretta»), `event` (un pezzo di storia: «arriva qualcuno di corsa»). Le tre
  frasi guardano la coppia da tre lati: la prima colorata dalla seconda, la seconda colorata dalla prima, la
  storia («Prima…, poi…»). Allenano le parole chiave, l'unire due significati, il raccontare.

## Che cosa resta (mai assillare)

- Ogni giro conta fino a **3 al giorno**: una tacca a ogni figurina usata, visibile nell'album (puntini sotto la
  casella) e sulla sua pagina («Al banco»: quante volte, e l'ultima frase con chi). Più 1 punto d'esperienza a
  giro contato. Dopo il terzo si gioca lo stesso, per piacere, e lo dice una riga dell'interfaccia.
- Le frasi scritte da lei si tengono (le ultime 12): serviranno alla catena di Ginepra.

## Salvataggio

`sibylPlay: { day, today, plays, rounds, seen: { n: { c, with, t } }, mine: [] }` in `fresh()` e in `migrate()`
di `src/core/state.js` (solo le mie righe). Un salvataggio vecchio parte da zero.

## File

- Dati: `src/data/sibylpairs.js` (pezzi delle 36 figurine, domande, coppie a mano, righe di Ginepra).
- Regole pure: `src/glue/sibylpairs.rules.js`; colla: `src/glue/sibylpairs.js` (servizio `sibyl.pairs`).
- Schermata: `src/ui/sibylpairs.js`; il tasto e le tacche in `src/ui/collect.js`.
- Test: `tests/sibylpairs.test.mjs`. Vault: `lore/meccaniche/giocare-a-coppie-con-la-sibilla.md` (proposto).

## Non in questa fase

La catena di Ginepra, l'ambulante come persona, il banco nel mondo, il gioco dei dadi, le coppie nelle letture.
