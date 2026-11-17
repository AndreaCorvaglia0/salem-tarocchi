# Prova del kit: «Il cappello in soffitta» (17 novembre)

Un agente nuovo ha aggiunto la storia secondaria del seme 3 di `notes/retroscena.md` (sezione e) seguendo
soltanto `docs/KIT.md`, sezione 1, e i documenti che indica. Qui sotto ogni punto in cui il kit non bastava:
che cosa mancava, dove l'ho trovato, e la frase che aggiungerei e dove. In fondo, che cosa ho fatto e che
cosa non ho verificato.

## Che cosa mancava

1. **Due ricette diverse per la stessa cosa.** KIT.md §1 dice che il modello è una prova secondaria
   (`src/data/trials/side.js`) o `SIDE`; `docs/TOOLS.md`, «Adding a side story», descrive un'altra strada
   (copione + voce in CAST + fatto) e non parla di prove. Nessuno dei due dice quale scegliere per una storia
   fatta di dialogo e di due posti. Trovato: leggendo i due file. Ho scelto la prova, perché è l'unico modo in
   cui le carte decidono qualcosa (punto 7).
   Da aggiungere a KIT.md §1, in testa: «Se nella storia le carte devono decidere qualcosa, è una prova (i bivi
   esistono solo lì); se è solo dialogo, è un copione con una voce in CAST e una voce nel registro, come dice
   TOOLS.md. `SIDE` serve solo per una carta nascosta.»

2. **Il canone nascosto non è nominato.** Il §1 non dice di leggere `lore/retroscena/` né
   `lore/decisioni/`, né che cosa vogliono dire `non_affiora` e `non_direbbe_mai`. Trovato: me l'ha detto il
   compito; i campi sono spiegati solo in `lore/README.md` (riga `retroscena`, senza `affiora`/`non_affiora`).
   Da aggiungere a KIT.md §1, passo 1: «Prima di scrivere leggere il retroscena di ogni persona coinvolta e
   `lore/decisioni/`. Quello che sta in `non_affiora` e `non_direbbe_mai` non si dice mai: affiora in un gesto
   o in una battuta di lato.» E in `lore/README.md`, riga retroscena: i campi `affiora`, `non_affiora`,
   `non_direbbe_mai`, `sostiene`, `corregge`.

3. **Vault: `arco` o `aperto`?** Il §1 dice di aggiungere il fatto all'`arco` delle persone; il compito diceva
   di toccare le persone solo aggiungendo ad `aperto` o con file nuovi. Ho seguito il compito (una riga in
   `aperto` di `mugnaio.md` e `ortica.md`). Da decidere e scrivere in KIT.md §1, passo 1: «Un fatto proposto
   si annota in `aperto` delle persone; entra nell'`arco` quando Andrea lo conferma.»

4. **La catena contro «arriva a chi è avanti».** Il passo 3 dice di agganciare la storia dopo `trial.dare`;
   questo la nasconde a chi è oltre il finale ma non ha vinto le sei prove. Senza catena però due prove
   secondarie possono essere nuove insieme, e i test vogliono «una alla volta» (`tests/trials.content.test.mjs`).
   Ho seguito il kit (catena dopo la scommessa di Ginepra). Da aggiungere al passo 3: «La catena tiene una
   prova secondaria alla volta, ed è la regola. Una storia che deve arrivare a chiunque abbia finito il gioco,
   anche senza le prove, va fuori dalla catena e bisogna cambiare il test "one announced at a time": è una
   decisione di Andrea.»

5. **Una storia in due posti.** Una prova ha un solo `start.at`. Per il mulino e la capanna di Ortica ho
   dovuto capire che il mondo mostra «la prima voce di CAST che vale, per id» (`src/world/scene/things.js`,
   `castHere`), che `glue/trials.js` aggiunge sempre una sua voce con lo stesso id (che farebbe partire la
   prova al mulino), che una persona ha una sola voce visibile per id (per far parlare Ortica della prova ho
   messo una voce con id `ortica` in testa a CAST, `CAST.unshift`) e che un oggetto (`prop`) vicino a una
   persona perde il tocco contro di lei (lo dice `current()` in `things.js`: le persone vengono prima).
   Da aggiungere a KIT.md §1, passo 4: «Se la storia comincia in un posto e la prova si gioca in un altro, la
   porta ha due voci in CAST con lo stesso id della prova: la prima a `start.at` (dove punta il grimorio),
   l'altra dopo il flag `trial.<id>.offered`; dopo l'offerta la porta di partenza resta con un copione che
   rimanda all'altro posto, altrimenti vince la voce di `glue/trials.js`. Se nel secondo posto c'è una persona,
   la porta è lei: una voce con il suo id in testa a CAST, con condizioni strette, perché copre le sue
   lezioni finché vale.»

6. **Il file della scena.** Il passo 4 dice che la scena va in `src/data/story/scripts/trials.js`. Quel file
   costruisce le porte in CAST con un ciclo all'import, e `scripts/lore/story.mjs` legge solo un elenco fisso
   di file (`loadStory`, in cima): un file nuovo in `scripts/` è invisibile a `lore gen` e `lore check`.
   Ho messo le scene in `src/data/story/scripts/hat.js` e in fondo a `trials.js` due righe che le uniscono a
   `TRIAL_SCRIPTS`; la voce in CAST la aggiunge `hat.js`, prima che giri il ciclo. Trovato: leggendo
   `trials.js`, `data/story/index.js` e `scripts/lore/story.mjs`.
   Da aggiungere al passo 4: «Le scene di una prova nuova possono stare in un file proprio, che `trials.js`
   importa in fondo e unisce a `TRIAL_SCRIPTS`: così `lore` le vede. Un file di copioni che non passa da lì va
   aggiunto all'elenco in testa a `loadStory` di `scripts/lore/story.mjs`.»

7. **Le carte decidono solo dentro una prova.** Il servizio `trial.ask` esiste, ma un copione non può
   leggerne il risultato (`{ do: 'call' }` in `src/story/runner.js` lo butta via), e i passi di una prova non
   hanno condizioni (`src/trials/run.js`). Quindi la riga che legge l'affinità sta nella scena della porta,
   dopo `trial.start`. Da aggiungere a `lore/meccaniche/chiedere-alle-carte.md` e al passo 4: «Una prova non ha
   `if`: quello che cambia per tratti, affinità o legame si scrive nella scena intorno, prima o dopo
   `trial.start`.»

8. **I test chiedono cose che il kit non dice.** `tests/trials.content.test.mjs` vuole: da tre a cinque bivi;
   almeno un `witchDraw`; tre o quattro argomenti in `study`; un oggetto con un nome come premio perfetto,
   ricordato più avanti da una riga (`item.<nome>` in `TRIAL_SCRIPTS` o `BARKS`); perdita con almeno 4 monete
   e un legame, uno strumento o una carta; una stanza buona e una cattiva per ogni bivio; nessuna opzione che
   nomini un Arcano; almeno quattro facce giuste per ogni bivio in ogni mazzo che lei può avere; ogni porta
   raggiungibile col mazzo pieno; una scena d'apertura con `trial.sense`, il flag `offered`, una riga di
   diario, una risposta speciale con `when`, e un ricordo del fallimento. E contiene elenchi scritti a mano da
   aggiornare: gli id delle prove secondarie, la catena, una prova per strega, e `poolsOf(id)`, i mazzi che lei
   può avere quando la prova arriva (senza, la prova fallisce «pools»).
   Da aggiungere al passo 6: l'elenco qui sopra, e «aggiungere l'id a `poolsOf` e agli elenchi del test, con i
   mazzi che lei può avere in quel momento». Più in generale: «quattro facce» vuol dire che una carta sola per
   porta non basta; per insegnare una carta precisa la si mette insieme a due Arcani con la stessa idea.

9. **Insegnare tre Minori precise.** Il kit non dice come. Il ventaglio di un bivio esce da `knownPool`
   (`src/trials/ask.js`): una Minore entra solo dopo la sua lezione. Quindi le tre carte le insegna Ortica con
   tre `witchDraw` (immagine e storia), e i bivi chiedono le loro tre idee: la carta di Coppe se lei ha fatto
   le lezioni, altrimenti due Arcani con la stessa idea. Da aggiungere a KIT.md §1, passo 2: «Le carte da
   insegnare: una strega le tira davanti a lei (`witchDraw`), poi un bivio chiede la loro idea. Nel ventaglio
   ci sono solo le carte che conosce.»

10. **L'affinità era vietata dai test.** `core/cond.js` conosce `affinity`, `bond`, `attitude`, ma l'elenco
    scritto a mano in `tests/story.data.test.mjs` (`COND_KEYS`) no: una scena che legge l'affinità fa fallire
    i test. Probabilmente è per questo che nessuno la leggeva. L'ho aggiunta all'elenco. La sintassi
    (`{ affinity: { ortica: 2 } }`, «almeno») è solo nel commento in testa a `cond.js`.
    Da aggiungere al passo 3: «Le condizioni sono in testa a `src/core/cond.js`; se una chiave che esiste lì fa
    fallire `story.data.test.mjs`, manca nel suo elenco `COND_KEYS`.» E in `tests/story.reader.test.mjs` c'è
    una seconda copia dello stesso elenco.

11. **Il genere.** `lore/metodo/non-dare-un-genere.md` dice che la storia principale parla a lei al femminile;
    le prove secondarie lo fanno («figliola», «sono tornata»); il compito chiedeva di evitarlo dove il gioco lo
    evita. Non è scritto quale regola valga per una storia secondaria. Ho scritto tutto senza genere per lei
    (le frasi del mugnaio e di Ortica e il diario). Da aggiungere a KIT.md, «Regole che valgono per tutti e
    tre»: «Le storie aggiunte dopo parlano a lei senza genere (WRITING.md non lo dice ancora); i personaggi
    possono dire "una che"»; oppure il contrario, ma scritto.

12. **Due condizioni che non si possono scrivere.** «Una prova fallita oggi» (stato `wait` di
    `trialStatus`) non è una condizione di `cond.js`: se lei riprova lo stesso giorno, Ortica dice la riga del
    ritorno e poi arriva l'avviso «Per oggi basta». E «ha già parlato con questa persona una volta» (`once`, in
    `state.world.once`) neppure: se lei non ha mai fatto l'incontro `enc.miller`, al mulino ci sono sia il
    mugnaio dell'incontro sia la porta della prova. Da annotare in KIT.md §1, passo 3, come limiti noti.

13. **Le schermate.** Il passo 7 dice che cosa fotografare ma non come. `docs/TOOLS.md` non parla di
    `scripts/shot.mjs`; l'esempio di passi è in `harness/play.steps.mjs`. Serve: un server (`npx vite`), la
    pagina `/?debug&skip=trial`, `--until domcontentloaded`, `window.__salemNoGuard = true`, lo stato preparato
    a mano da `window.__salem.state` (non c'è un salto «dopo il finale»), `window.__salem.travel(anchor)`, e un
    tocco sul pulsante d'azione con un `PointerEvent('pointerdown')` su `.w-act`; le battute avanzano con
    `pointerdown` su `.sy-layer`, la carta di una strega con `pointerup`, i bivi con `.tr-fc` e `.tr-opt`,
    le schermate della prova con `.tr-btn`. Attenzione: `page.evaluate` che restituisce la promessa di
    `grimoire.open` aspetta per sempre. Da aggiungere a `docs/TOOLS.md` una sezione «Schermate» con queste
    righe, e a `debug.rules.js` un salto `ended` (dopo il finale).

14. **Il titolo della prova si vede.** La schermata d'apertura mostra «Una prova» e il `title`: un titolo come
    «Il cappello in soffitta» avrebbe svelato il centro della storia. Ho usato «Un sacco dal mulino». Da
    aggiungere al passo 4: «Il `title` si legge prima di cominciare: non deve svelare niente.»

15. **`map --check`.** Dopo i file nuovi `node scripts/map.mjs --check` dice che `docs/MAP.md` è da
    riscrivere (cambiano i conteggi delle righe per cartella). MAP.md lo scrive chi guida; non l'ho rifatto.
    Da aggiungere al passo 6: «`map --check` fallisce anche solo per le righe in più: lo rifà chi guida.»

## Che cosa ho fatto

- La prova `src/data/trials/hat.js` («Un sacco dal mulino»), in `LIST` di `src/data/trials/index.js`, ultimo
  anello della catena (dopo `trial.dare`), con `when` su quello che lei ha: il mugnaio incontrato
  (`side.m12`), la scopa e la lezione di volo, la scommessa di Ginepra vinta.
- Le scene in `src/data/story/scripts/hat.js`, unite a `TRIAL_SCRIPTS` in fondo a `trials.js` (due righe).
- Il fatto `lore/fatti/cappello-in-soffitta.md` (`fonte: proposto`), una riga in `aperto` di
  `lore/persone/mugnaio.md` e `lore/persone/ortica.md`. Nessun retroscena toccato.
- Test: `tests/trials.content.test.mjs` (elenchi, catena, `poolsOf('hat')`, il salvataggio dopo il finale con
  mugnaio e scopa), `tests/story.data.test.mjs` (`affinity`, `bond`, `attitude` in `COND_KEYS`).

## Non verificato

- Un telefono vero, e il suono. Il testo letto ad alta voce lo deve sentire Andrea.
- L'esito perfetto con il nastro e la riga del mugnaio che lo vede (provato solo dai test sul motore), e
  l'esito fallito con il ritorno da Ortica: nelle schermate sono usciti due esiti «superata».
- Il caso in cui lei non ha mai fatto l'incontro `enc.miller`: al mulino ci sarebbero due cose da toccare.
- `npm run coverage`: per costruzione non entra nelle prove.
