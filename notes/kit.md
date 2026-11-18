# Il kit: buchi trovati (17 novembre)

Scritto mentre preparavo `lore/metodo/ricette/`, `docs/KIT.md` e `docs/MNEMOPOLIS.md`. Tre elenchi: cose che il gioco
fa e che nessuna scheda spiega; regole di Andrea che non stanno scritte nella repo; punti in cui il vault,
DESIGN.md e il codice non dicono la stessa cosa.

## 1. Cose che il gioco fa e che nessuna scheda spiega

- **Le streghe pescano una carta per sé prima di agire** (tipo G in notes/paths.md: Malva gira La Temperanza,
  Ginepra va contro La Luna e qualcosa va storto). È un modo di insegnare mostrando un'altra che lo fa. Manca
  una scheda «imparare guardando gli altri».
- **Le risposte speciali che si sommano** («[Popolare]», «[Hai la scopa]», «[Strega]»: DESIGN.md, La terza
  risposta e Le risposte speciali si sommano). Le schede ne parlano solo di passaggio.
- **La biblioteca prima della prova**: si ripassa «quello da cui la risposta si ricava», con argomenti che una
  strega «sente». Nessuna scheda; e `isFresh` (src/trials/topics.js) non è usato fuori dalla biblioteca.
- **Il motore di lettura come generatore**: frasi per carta, verso, ambito e ruolo, cucite con legami scelti
  da `favore` e `moto` (READING.md). È il pezzo più vicino a un generatore di storie che abbiamo, e merita
  una scheda sua (famiglia variare).
- **I clienti generati da modelli** («all'inizio poveri e ridicoli, poi più seri»: READING.md, src/reading/clients.js).
  Stesso discorso: generazione piccola e controllata.
- **Il grimorio come menu dentro la storia**, scritto a mano in prima persona, con il prossimo passo in una riga.
- **L'inizio guidato**: una cosa alla volta, usandola, la scia di lucine. C'è il principio
  `sempre-chiaro-cosa-fare`, manca la scheda su come è fatto.
- **«Se una cosa non si può mostrare bene, non si mostra»** (DESIGN.md, Le regole 7): il teatro d'ombre.
- **La simulazione di tre giocatrici** (scripts/balance.mjs) per tarare i cancelli: citata solo dentro la scheda
  sulle strettoie.
- **Una prova secondaria fallita si riprova un altro giorno** (stato «wait»): regola di ritmo non descritta.

## 2. Regole di Andrea che non stanno scritte nella repo

- Prima una pagina di progetto da approvare, poi il codice; una fase con un tema solo che finisce con qualcosa
  da provare dal telefono; al massimo due agenti economici insieme; chi guida guarda le schermate, unisce e
  pubblica. Stanno nelle istruzioni del progetto (fuori dalla repo). AGENTS.md e CONTRACT.md ne hanno solo
  una parte. Le schede `progetto-e-fasi` e `agenti-con-cartelle-proprie` le citano come fonte.
- Non pubblicare un artefatto condiviso senza il suo via: `scripts/deploy.sh` è «lead only», ma la regola non è scritta.
- Il genere: WRITING.md non dice niente. La regola sta in READING.md (le frasi del motore) e in notes/opinions.md
  (un'istruzione del compito). Il resto del gioco si rivolge a lei al femminile. Va deciso se è una regola
  generale (scheda `non-dare-un-genere`).
- I lettori ingenui sulle schermate sono stati usati una volta (la carta di oggi): non è scritto che vadano
  usati sempre.

## 3. Dove vault, DESIGN.md e codice non coincidono

- **I dati di nascita.** DESIGN.md, Il ritratto: «tenuti solo sul telefono». `src/core/vault.js` copia tutto il
  salvataggio, data compresa, anche nell'archivio dell'artefatto legato all'account. Da dire chiaro o da cambiare.
- **Chi piace alle streghe.** DESIGN.md, Il ritratto: «A Malva piace chi è schietta, a Ortica chi è curiosa,
  a Edera chi è gentile, a Ginepra chi è audace». Più avanti DESIGN.md e `AFFINITY` in `src/core/witches.js`
  dicono altro (Malva gentile, prudente, cuore; Ortica audace, schietta, testa; Edera accorta, curiosa, testa).
  La riga vecchia andrebbe tolta.
- **Il seme.** DESIGN.md: Bastoni «audacia», Denari «prudenza». `SUIT_OF_TRAITS` in `src/core/progress.js`
  aggiunge un secondo polo (Bastoni anche «dritta al punto», Denari anche «accorta»). Piccolo, ma diverso.
- **Le missioni secondarie.** DESIGN.md, Le streghe e la storia: «Non stanno in un elenco: sono appunti a
  matita». DESIGN.md, Il registro: «stanno nel grimorio e si possono scegliere». Il codice fa la seconda
  (`extrasShown` in src/core/extras.js).
- **Il tetto delle novità.** DESIGN.md dice «al massimo due cose nuove alla volta (chiavi e appunti della
  storia a parte)». Il codice fa così, ma le prove e i mondi Altrove sono registrati come `kind: 'trial'` e
  contano nel tetto, mentre le note `side` no: con molte note nuove il tetto non protegge.
- **Fiducia e legame** (già in notes/lore-design.md, d): gli aiuti al processo e la croce finale usano la
  fiducia (`trusts`, `mostTrusting`), il grimorio e le opinioni il legame.
- **Il tipo `metodo` non ha una riga in lore/README.md.** `node scripts/lore.mjs check` lo segnala come
  avviso per ognuna delle 35 schede e non ne controlla i campi. Riga proposta per la tabella (la aggiunge chi
  guida, per non toccare il README mentre un altro agente lo modifica):

  `| metodo/ | metodo | nome, famiglia (imparare, variare, personalizzare, scrivere, far-crescere), ambito (generale, salem), problema, soluzione, in_salem (lista di [[...]]), si_controlla_con, rischi, fonte |`

## 4. Schede che oggi nessuno strumento controlla

`si_controlla_con: a mano` in: `obiettivo-con-una-ragione`, `dalla-guida-al-mazzo-vero`,
`istruzioni-fuori-dalla-finzione`, `non-dare-un-genere`, `progetto-e-fasi`, `cosa-non-si-personalizza`.
Due potrebbero avere un controllo semplice, da provare prima di fidarsi:
- i personaggi che spiegano: cercare nelle battute dei personaggi parole dell'interfaccia (tocca, grimorio,
  punti, livello, tasto);
- il genere nelle frasi del motore e nelle opinioni: cercare participi e aggettivi dopo «sei», «ti senti».
Tutti e due darebbero falsi allarmi: andrebbero usati come avvisi, come `scripts/prose.mjs`.
