# Da Salem a Mnemopolis

Che cosa ha imparato Salem che Mnemopolis non ha ancora, e che cosa servirebbe per un generatore di storie.
Confronto fatto il 17 novembre 2026 leggendo il README, AGENTS.md e docs/ di Mnemopolis (GAME, DESIGN, STORY,
ROADMAP, WORLD). Non ho letto tutto il codice del motore di Mnemopolis: dove una cosa potrebbe già esserci,
lo scrivo.

Le schede citate sono in `lore/metodo/ricette/`.

## Le idee, una per riga

Sforzo: **piccolo** (dati e una regola), **medio** (un sistema nuovo nel motore), **grande** (cambia il modo
di giocare).

| Idea | Dove vive in Salem | Che cosa sarebbe in una città di Mnemopolis | Sforzo |
|---|---|---|---|
| Un registro delle cose in più, con `when`, `after`, `key` e al massimo due novità alla volta | `src/core/extras.js`; scheda `storie-in-piu-nel-registro` | Case extra, lucchetti e storie piccole come voci di un registro, che arrivano anche a chi ha già finito il corso | medio |
| Una lingua di condizioni comune | `src/core/cond.js`; scheda `fatti-e-condizioni-non-rami` | Le stesse condizioni (`{ flag }`, `{ stamp: 'casa3' }`, `{ tier: 'known' }`) per battute, porte, finali | piccolo |
| Scelte ricordate più tardi | `notes/paths.md`; scheda `conseguenze-che-tornano-dopo` | Un proprietario ricorda come è stato aiutato e lo dice una casa dopo | piccolo |
| Il vault con le fonti delle righe (copione, deciso, proposto) e un controllo | `lore/`, `scripts/lore.mjs`; scheda `ogni-riga-ha-una-fonte` | Il canone della storia della nave e del faro scritto come dati, con quello che è aperto | medio |
| Un tetto al ritmo, scritto e testato | `src/glue/opinions.rules.js`, `src/core/extras.js`; scheda `un-tetto-al-ritmo` | Costanti con un nome per passanti, minigiochi, commenti del mondo | piccolo |
| La soglia fuori dalla partita | `src/ui/title.js`, `src/glue/threshold.rules.js`; scheda `ritorno-con-i-rituali` | Un concetto al giorno sulla schermata del titolo, che fa crescere qualcosa senza mai punire | medio |
| Il finale costruito con la partita | `src/glue/finale.rules.js`; scheda `finali-pensati-a-ritroso` | `endingOf` c'è già; in più, il finale nomina il concetto più sbagliato e la casa più tornata | piccolo |
| Applicare il concetto per decidere, a un bivio, con riscontro | `src/trials/`, `src/data/trials/`; schede `usare-quello-che-sa`, `obiettivo-con-una-ragione` | Prove fatte di dati: a un bivio il concetto della casa dice quale porta aprire | grande |
| Mondi piccoli e chiusi (Altrove) | `src/data/elsewhere/`, `src/glue/elsewhere.js` | Una missione breve dentro un quadro, uno spartito, un esperimento, con una regola sua | grande (dopo la riga sopra) |
| Un ramo da approfondire | `src/glue/garden.js`; scheda `specializzazioni-facoltative` | Una casa in più con tre lezioni brevi, per chi ne ha voglia | piccolo |
| Il ritratto: tratti a due poli, solo tendenze robuste | `src/core/progress.js`; schede `due-poli-nessuno-giusto`, `solo-tendenze-robuste` | Due o tre assi letti dal modo di usare i laboratori («prova subito» o «guarda prima») | grande |
| Una voce che legge chi gioca | `src/story/visit.plan.js`; scheda `una-voce-che-legge-chi-gioca` | Il guardiano e il commissario commentano già il livello: commenterebbero anche il modo di giocare | medio (serve il ritratto) |
| Le persone reagiscono a chi è | `src/core/witches.js`; scheda `le-persone-reagiscono` | I temperamenti dei proprietari cambiano battuta con l'affinità | medio (serve il ritratto) |
| Il salvataggio in più posti | `src/core/vault.js`, `scripts/savecheck.mjs` | Oggi il motore salva solo nel localStorage (`engine/src/systems/state.js`): in più IndexedDB e un codice da copiare | medio |
| Il test di tutti i piccoli rami | `tests/story.paths.test.mjs` | Utile solo quando la storia di Mnemopolis avrà rami | medio |
| Lettori ingenui sulle schermate | DESIGN.md, La carta di oggi; scheda `verificare-e-dirlo` | Dopo `npm run shots`, due lettori che vedono solo le immagini | piccolo |
| La guardia sui tocchi | `src/core/dom.js`; scheda `guardia-sui-tocchi` | Una ricerca veloce in `engine/src` non l'ha trovata: da verificare prima di aggiungerla | piccolo |

## Che cosa non vale la pena portare

- **La posta che si perde.** Mnemopolis ha il principio opposto («Mistakes cost nothing but a turn»). Si
  potrebbe provare solo in un posto facoltativo, ma è una scelta di Andrea, non un'eredità.
- **La sua carta, il seme, il segno zodiacale.** Sono tarocchi. In un corso funzionano solo se gli elementi
  del corso hanno un carattere.
- **I dati di nascita.** Servono a Salem per l'astrologia della carta; in un corso sono un dato personale in
  più senza motivo.
- **Popolarità, punti Tartufo, fiducia e legame insieme.** In Salem sono già troppi numeri (la fiducia e il
  legame dicono la stessa cosa). Mnemopolis ha esperienza e monete: basta.
- **La bottega che rende più facili gli Esami.** Non insegna niente (notes/lore-design.md, parte c).
- **Gli Esami a sorpresa per strada.** Fanno parte della paura di Salem; in un corso mettono fretta senza
  un motivo nella storia.

## Verso un generatore di storie

Tutto quello che segue è un'ipotesi: nessun generatore è stato provato. C'è anche una premessa da
decidere: in Mnemopolis la storia appartiene al motore ed è la stessa per ogni corso (docs/STORY.md di
Mnemopolis). Un generatore la renderebbe diversa da corso a corso. Lo decide Andrea.

**Che cosa dovrebbe produrre (lo schema).** Per ogni pezzo, due cose:
1. le pagine del vault: il fatto, le persone e i luoghi nuovi, nel formato di `lore/README.md`, tutto con
   `fonte: proposto`, con `aperto` per quello che non sa, e l'obiettivo del corso che il pezzo allena;
2. i dati: una voce del registro (`id`, `when` su quello che lei ha, `after`, `key`, la riga del quaderno,
   il posto), le battute con chi le dice, le scelte con il loro tratto e la loro replica, e se è una prova
   i passi, le stanze e gli esiti nel formato di `src/trials/run.js`. Le condizioni nella lingua di cond.js.

**Che cosa lo accetta o lo rifiuta (gli strumenti).** I controlli che ci sono già in Salem, adattati:
il vault (`node scripts/lore.mjs check`); i dati della storia (chi parla esiste, ogni condizione è nota,
ogni scelta ha almeno due risposte con la loro replica: `tests/story.data.test.mjs`); tutti i percorsi
finiscono senza errori (`tests/story.paths.test.mjs`); la prova è giusta con quello che lei può avere a
quel punto (`tests/trials.content.test.mjs`); il pezzo arriva anche a chi è avanti (`tests/core.bonds.test.mjs`);
i difetti meccanici della prosa (`node scripts/prose.mjs`); in Mnemopolis, `npm run validate` sul corso.
Un controllo di copertura (ogni obiettivo ha una meccanica) è in preparazione: vedi `docs/TOOLS.md`.

**Che cosa resta a una persona.**
- Il canone: ogni riga `proposto` diventa `deciso` solo con il sì di Andrea.
- La voce: nessun controllo sa se una battuta suona bene. Si legge ad alta voce.
- Il gusto: se un mondo è «folle e bello», se una perdita è giusta o cattiva.
- Il telefono vero e l'audio.

**Perché prima altre due aggiunte fatte a mano.** Le forme che un generatore dovrebbe produrre sono nate
da pochi esempi (sei prove secondarie, due mondi) e sono cambiate mentre le costruivamo: il tono nelle
letture è stato tolto, fiducia e legame si sovrappongono, i testi degli Altrove erano segnaposto. Due pezzi
nuovi fatti a mano, seguendo solo `docs/KIT.md` (per esempio un terzo Altrove che riusa una regola, e una
persona nuova con la sua storia secondaria), direbbero se il kit basta a un agente che non sa nient'altro,
quali passi mancano, e quali controlli non hanno fermato un errore. Solo dopo ha senso chiedere a un
modello di produrre lo stesso pezzo e confrontarlo con quello fatto a mano.
