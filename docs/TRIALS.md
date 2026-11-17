# Le prove: le regole scritte che i test fanno rispettare

Una prova è un pezzo di dati in `src/data/trials/` nel formato scritto in testa a `src/trials/run.js`
(`id`, `title`, `with`, `when`, `note`, `start`, `study`, `steps`, `rooms`, `outcomes`). Il motore la gioca,
`src/glue/trials.js` la registra da solo in `src/core/extras.js`. Questa pagina dice che cosa deve essere vero
perché `tests/trials.content.test.mjs` passi: sono regole di gioco, non gusti. Modelli: `src/data/trials/side.js`
(le prove con una strega), `src/data/trials/hat.js` (una piccola storia con una persona del villaggio) e
`src/data/trials/demo.js` (solo debug: un pezzo di ogni genere). Quando scegliere una prova invece di un
copione: `docs/KIT.md` §1.

## La forma

- **Bivi**: da tre a cinque. Ogni bivio ha due o tre opzioni ed è di un tipo: `segno` (le tre opzioni sono
  esattamente `go`, `slow`, `stop`), `idea` o `quesito` (il `quesito` ha `rule` e `by`: `suit`, `favore`,
  `moto` o `arcana`, la proprietà che la risposta può nominare). Nel capitolo 1 solo `segno` e `idea`; nel
  capitolo 3 le facce rovesciate.
- **Nessuna opzione nomina un Arcano** (Matto, Mago, Papa...): descrive un gesto, e le `tags` dicono quale carta
  la indica. La riga sotto la carta dice che cosa diceva la carta; mai la risposta prima.
- **Una strega tira una carta per lei** (`witchDraw`), almeno una volta, con una carta vera.
- **Studio**: da tre a quattro argomenti in `study` (`isTopic` in `src/trials/topics.js`: un Arcano `mNN`, un
  seme, un gruppo di numeri, `court`, `reversed`, `sign`). Sono quello che la biblioteca suggerisce, non la
  risposta.
- **Stanze**: ogni bivio ha una stanza buona (`good: true`, `right`) e una cattiva (`good: false`, `wrong`),
  ognuna con le sue righe e usata davvero. Una stanza non toglie mai una carta. Chi parla è `narra` o una
  persona di `PEOPLE`.
- **Esiti**: `perfect` (0 errori), `pass` (1-2), `fail` (3 o più), ciascuno con le sue righe. Un bivio sbagliato è
  un errore; con `escape` si deve scrivere sia `caught` sia `safe`, e l'essere presi vale un errore.
- **Premio perfetto**: una cosa (`reward.item` con un nome, o `reward.tool`). Nelle prove secondarie è sempre un
  oggetto con un nome, e una riga più avanti lo ricorda: `item.<nome>` deve comparire in `TRIAL_SCRIPTS` o in
  `BARKS`.
- **Perdita**: almeno 4 monete e una cosa tra un legame, uno strumento, una carta. Mai una carta che una
  condizione della storia chiede (`has` / `lacks`). Una prova con `with` (la strega) guadagna e perde
  esattamente un legame; senza `with` il legame si dà con `reward.with` / `loss.with`.
- **Titolo**: la schermata d'apertura mostra «Una prova» e il `title`, prima di cominciare. Non deve svelare niente
  della storia. `note` è una frase intera: è la riga del grimorio e dice dove andare.

## Le carte: il ventaglio e le facce giuste

Il ventaglio di un bivio esce da `knownPool` (`src/trials/ask.js`): gli Arcani che lei ha, le Minori solo dopo la
loro lezione (`minorTaught`), le facce rovesciate solo dopo `lesson.reversed`. Per ogni bivio, in ogni mazzo che
lei può avere quando la prova arriva:

- nessuna carta indica due porte;
- almeno **quattro facce** giuste (una carta sola per porta non basta; per insegnare una carta precisa la si
  mette insieme a due Arcani con la stessa idea, e senza le lezioni sulle Minori restano gli Arcani);
- nel mazzo pieno almeno due porte diverse, e per `idea` e `quesito` una carta per ogni porta.

Per far conoscere una carta precisa, una strega la tira davanti a lei (`witchDraw`) e un bivio chiede la sua
idea: non si assume mai che lei la abbia già.

**`poolsOf(id)`** in `tests/trials.content.test.mjs` elenca a mano i mazzi di ogni prova (la sua riga in testa
al file, scritta dal capitolo in cui arriva). Una prova nuova senza la sua riga fallisce con «pools». Va
aggiunta con i mazzi che lei può avere in quel momento.

## La porta e la catena

- Una scena `trial.<id>.door` registrata in `SCRIPTS`, che è la prima voce di CAST con quell'id e sta a
  `start.at`. Se `d.start.at` è un'ancora vera, il resto lo fa `glue/trials.js`.
- La scena si apre con: `trial.sense` (la strega o Tartufo dice che cosa ripassare), il flag
  `trial.<id>.offered`, una riga di diario; nelle secondarie una scelta di carattere con una risposta
  speciale (`special` con `when`); e, quando torna dopo una prova fallita, qualcuno che la ricorda.
- **Una prova non ha `if`.** I passi di una prova non hanno condizioni. Quello che cambia per tratti,
  affinità o legame si scrive nella scena intorno, prima o dopo `trial.start`. Un copione non può leggere
  il risultato di `trial.ask` (`{ do: 'call' }` lo butta via): le carte decidono solo dentro una prova.
- **Catena.** Le prove secondarie sono una catena, ognuna con `after: ['trial.<la precedente>']` (e lo stesso
  per le tre principali). Il test la ricava dall'ordine di `LIST` in `src/data/trials/index.js`: una prova nuova
  si mette in fondo alla lista e ha `after` sull'ultima. Così a una giocatrice avanti arriva una sola
  prova secondaria nuova alla volta (test «one at a time»). Una storia che deve arrivare a tutte, anche
  senza le prove, va fuori dalla catena e il test va cambiato: lo decide Andrea.
- **`when`** dipende da quello che lei ha, mai dal passo. Se la scena ha bisogno di una persona incontrata o di
  un potere, quello va nel `when` della prova (è così che `hat` chiede il mugnaio, la scopa e la lezione di volo).

## Una storia in due posti

Una prova ha un solo `start.at`. Se la storia comincia in un posto e si gioca in un altro (`hat`: il sacco al
mulino, la prova nella capanna di Ortica), il mondo mostra la **prima voce di CAST che vale, per id**
(`castHere` in `src/world/scene/things.js`), e `glue/trials.js` aggiunge sempre una sua voce con l'id della
prova, che farebbe partire la prova nel posto sbagliato. Quindi:

- nel posto di partenza, due voci con l'id della prova, spinte in CAST all'import del file dei copioni: la prima
  fino al flag `trial.<id>.offered` (la scena d'apertura, dove punta il grimorio), l'altra dopo (un copione che
  rimanda all'altro posto, come `trial.hat.wait`). Vanno spinte prima che giri `glue/trials.js`: la sua voce
  (che farebbe partire la prova qui) resta indietro, perché vince la prima;
- nel secondo posto, se c'è una persona, la porta è lei: una voce con il **suo** id in testa a CAST
  (`CAST.unshift`), con condizioni strette (da `offered` a prova superata), perché copre le sue lezioni finché
  vale. Un oggetto (`prop`) vicino a una persona perde il tocco contro di lei (`current()`, `usableAt()`: le
  persone vengono prima);
- il mondo ricorda cose più tardi con altre voci (`hat.after`, `once: true`).

## Due cose che non si possono scrivere (limiti noti)

- «Una prova fallita oggi» (stato `wait` di `trialStatus`) non è una condizione di `core/cond.js`: se lei
  riprova lo stesso giorno, la persona dice la riga del ritorno e poi arriva il messaggio «Per oggi basta».
- «Ha già parlato con questa persona una volta» (`once`, in `state.world.once`) non è una condizione: se lei
  non ha mai fatto l'incontro `enc.miller`, al mulino ci sono sia il mugnaio dell'incontro sia la porta della
  prova. Per questo `hat` chiede `side.m12` nel suo `when`.

## I testi

Seguono `docs/WRITING.md` e `scripts/prose.mjs` (il test li controlla: niente TODO, niente trattini lunghi,
niente frasi di una parola, niente tre frasi brevissime di fila); ogni opzione sta in 120 caratteri.

## Gli elenchi a mano che restano nel test

Quasi tutto è ricavato dai dati (la catena, le prove secondarie, una per strega, le prove che il registro
offre). A mano restano solo: `poolsOf(id)`, la scia di `a new player meets them in order` (una riga per prova,
con quello che lei deve avere) e i salvataggi `OLD2` / `ENDED`, che sono salvataggi veri e hanno bisogno dei
flag della storia nuova se la sua `when` li chiede.
