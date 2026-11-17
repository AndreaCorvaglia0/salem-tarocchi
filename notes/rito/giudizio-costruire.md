# Giudizio: si può costruire bene, qui, senza rompere il gioco?

Numerazione = nome del file in `cieca/`. Proposta 1 = «A orecchio, prima del nome». 2 = «Un respiro, un gesto». 3 = «Un rito che si impara da qualcuno». 4 = «Il braciere tra le mani».
Che cosa ho verificato: ho letto il codice citato (consult, selfread, free, reading, dom.js, tracks, beds, index, moods, sfx, state, extras, cond, garden) e controllato le affermazioni delle proposte. Che cosa no: niente è stato provato su un telefono, niente è stato ascoltato.

## Fatti del codice che contano per tutte

- **Due deck, e basta.** `tracks.js` ha due `<audio>` (`createMediaElementSource`) e `beds.js` altri due, con un solo letto attivo alla volta. Nessuno dei due sa far suonare cinque brani insieme né due letti insieme. `sound/index.js` tiene `ctx` privato: ogni proposta che vuole buffer decodificati o un bus suo deve far esportare il contesto (un servizio nuovo).
- **I mood sono una lista chiusa.** `wantsMood` rifiuta i nomi non in `MOOD_NAMES`; `bedFor` dà NONE a tutto tranne village/forest/depths, e `tests/sound.tracks.test.mjs` fissa quel comportamento. Un `mood('rite')`, `bedFor('rite')` o `cueFor('reading', { smoke })` sono modifiche piccole ma vere (e `mood()` oggi tiene solo `tension`).
- **La protezione dei tocchi vede solo `button,[role=button]`** (osservatore in `dom.js`, clic in cattura). Un braciere o una zona di gesto non sono bottoni: i 650 ms non li coprono, ci vuole una guardia propria. `holdTaps` ferma anche `pointerdown`/`touchstart` in cattura, quindi non va mai acceso durante un gesto (lo dicono bene 1, 3 e 4).
- **iOS e lo sblocco audio non sono un problema qui.** Quando comincia il rito lei ha già toccato decine di volte, il contesto è vivo e il trucco `silence.wav` è già in corso. Il gesto lungo non deve sbloccare niente.
- **Selezione e callout:** `.sx` ha già `user-select:none`; `.sr` no (la lettura per sé è un altro schermo, con campi di testo). Un overlay proprio con `touch-action:none; user-select:none; -webkit-touch-callout:none` e `setPointerCapture` è lo schema sicuro, e lo usano 1, 3, 4.
- **Musica nuova:** i file sono mp3 da 1,6–3,3 MB (43 MB in totale). `incompetech.com` e `archive.org` rispondono da qui, `musopen.org` e `freesound.org` no (403). Un brano nuovo si può scaricare e tagliare (c'è `ffmpeg`), ma scegliere alla cieca lo fanno Andrea e lei.
- **Brani già nel gioco = associazioni sporche.** `clairdelune` è la musica di ogni lettura, `goldberg` quella del tavolo della Lettrice, `gymnopedie` quella del titolo e della casa di Malva, `consolation` la casa di Malva, `elegie` gli Esami. Le proposte 2, 3, 4 li prendono come «provvisori»: va bene per provare, ma proprio quei brani cancellano la differenza tra «fumo scelto» e «nessun fumo».
- **Le letture esistenti hanno test scriptati** (`play.reading`, `play.consult`, `selfread`): ogni rito va dietro un interruttore (stato assente / `__salemNoGuard`-like), altrimenti quei test cliccano su un braciere che non c'è.

## Proposta 1 — «A orecchio, prima del nome»

- Dritta: overlay a tutto schermo, tenere il carbone, tre respiri con pulizia come tinta che esce, nome dopo la scelta, segno che accende sempre qualcosa. Riconoscimento largo (direzione, ±35°), niente errori mostrati, alternativa a tocco: tutto classificabile in una funzione pura e testabile.
- Rischiosa: il cuore è l'audio. Cinque `AudioBufferSourceNode` in anello con guadagni mossi dal dito è una pipeline nuova (contesto da esportare, buffer da decodificare all'apertura, 12 MB decodificati, liberazione a fine rito). Regge in memoria, ma i loop di mp3/AAC non sono senza giunzione (ritardo dell'encoder, circa 20–50 ms su iOS): l'anello «già cucito» va fatto in WAV o con sovrapposizione.
- Sbagliato/ottimistico: `tracks.seek` non esiste (lo dice, ma «dallo stesso punto» è una promessa grossa: il seek di un mp3 senza indice è approssimato, e il passaggio clip→brano intero può saltare di secondi). Meglio far entrare il brano dall'inizio con dissolvenza lunga.
- Sbagliato nel dettaglio: «`ctx.resume()` qui è un gesto vero» (su touch `pointerdown` non vale, `index.js` lo dice; ma qui è innocuo). Il pulsante che «sparisce e torna» deve essere un nodo reinserito, altrimenti la protezione non riparte.
- Contenuto: cinque brani nuovi (più cinque spezzoni e un motivo), nessuno usato altrove, prova d'ascolto alla cieca prima di costruire. È il costo più alto di tutte.
- La regola «nessuno dei cinque brani suona altrove» è giusta e l'unica che protegge l'associazione. L'idea «il nome arriva dopo la cosa sentita» è la più onesta verso l'intuizione e non costa codice.
- Tre gesti diversi in 60 s la prima volta; poi 16 s. Le braci su un arco con silenzio in mezzo possono sembrare un difetto (lo dice).
- Test veri: classificatore di tratto, gradini per `rite.n`, tradizione propria dopo tre scelte, migrazione. Solo umano: gli spezzoni, il silenzio, il fumo continuo.
- **Sforzo minimo (tre brani, una sola schermata): grande, 3 fasi** (overlay+gesto, pipeline audio, contenuti e specchio), più la prova d'ascolto fuori conto.
- Tre rischi: (1) pipeline audio nuova con anelli e seek; (2) cinque identità musicali nuove da scegliere senza sentirle; (3) un'ora di tuning di fumo che cambia in continuo col dito su un telefono medio.

## Proposta 2 — «Un respiro, un gesto»

- La più piccola e la più elegante: un solo gesto (premi, tieni, vai, lascia), 11,5 s la prima volta, 5,6 s la ventesima. Il settore del vettore dal punto di pressione, isteresi di 120 ms, zona morta: classificatore puro, testabile, con lato specchiato per i mancini.
- Sbagliato sul codice: «il piede è alto 210 px». `.sx-foot` e `.sr-foot` sono alti circa 76 px e sono nel flusso; il braciere con raggio 95 non ci sta, serve comunque un livello sovrapposto (che infatti prevede nello storyboard) ma allora non «prende il posto del tasto» in modo semplice.
- Rischioso: sostituire «Mescolo»/«Comincio»/«Avanti» (esistono: `reading.js:52`, `selfread.js` tema e `drawHere`) con un elemento che non è un bottone. Perde la protezione dei 650 ms, la tastiera aperta in `selfread` (campo di testo sullo stesso schermo di «Avanti»), l'accessibilità e i test scriptati. Meglio: il bottone resta, apre il rito.
- Rischio vero del gesto: tenere il dito giù fino a 8,4 s la prima volta, con il pollice a y 700 e il fumo «rosa» a y 795 vicino alla zona del gesto di sistema in basso; può sembrare una barra di caricamento (lo ammette).
- Musica: solo una nota al passaggio e il brano all'accensione, quindi si usano i due deck com'è (giusto: «cinque brani intaserebbe i due deck» è corretto). Ma i brani provvisori sono i peggiori (`clairdelune` = olibano = la musica di tutte le letture).
- Suono: note singole da campionare (sei file piccoli), `bedFor('rite')` e `mood('rite')` nuovi. Un canvas per ogni fumo e per il velo: meglio un canvas solo.
- Costruita bene è la più leggera alla ventesima volta; l'intuizione è onorata a metà (scelta per colore e nota, ma con nomi e parole subito).
- **Sforzo minimo (selfread e free, tre fumi, brani esistenti): medio, 2 fasi.**
- Tre rischi: (1) il tenere-poi-andare lungo con il pollice in basso; (2) sostituire i bottoni in schermate che scorrono e hanno la tastiera; (3) brani provvisori che coincidono con le musiche di sempre.

## Proposta 3 — «Un rito che si impara da qualcuno»

- Il rito stesso è semplice e sicuro: tre colpi (tocchi in una zona armata dopo 650 ms), tre respiri con il velo che esce, vasetti che sono bottoni (la protezione vale già), un solo gesto per fumo, nessun errore mostrato. Gesti con soglie di velocità (450 ms / 700 ms) fragili sul tocco: da tenere larghi o togliere.
- È l'unica che si inserisce nella storia e nel meccanismo «catena con `after`» che le partite vecchie conoscono (`garden.lesson.*` fa proprio così). Il registro regge, le condizioni citate esistono quasi tutte (`stepIn`, `chapterMin`, `flag`, `spread`, `malva.hearth`, `forest.ortica_hut`).
- Sbagliato: la condizione «lavanda in dispensa ≥ 1» non esiste in `cond.js` (non c'è nulla su dispensa o erbe): serve una chiave nuova, e i test derivano l'elenco delle chiavi dai gestori. Ginepra al focolare di Malva e Edera nella prima cantina sono nuove voci di cast.
- Sbagliato: `fire` a 0,35 più `wind` a 0,12 sugli espiri insieme. `beds.js` suona un letto solo per volta (due deck che si passano la mano): il soffio deve essere un effetto sintetico (`sfx`, che per `wind` non c'è).
- Contenuto: sei scene da scrivere secondo `docs/WRITING.md` (lezione di 70 s compresa), tre brani nuovi, un «knock» e un «catch», una pagina nel grimorio. Il peso è quasi tutto scrittura, non codice, ma è tanto e va provato nella settimana vera di letture.
- Costo nascosto: due percorsi in `reading.js`/`selfread.js` (senza rito prima della lezione, col rito dopo) e rito minimo che vale poco finché le lezioni non arrivano; la scelta vera arriva con la seconda lezione.
- Costruita bene è la più forte sull'imparare «quale incenso quando» e sul tono del gioco; è anche l'unica che non dà un rito a una giocatrice che non ha ancora comprato l'incenso.
- **Sforzo minimo (lezioni 1–3, due gesti): grande, 3 fasi** (rito+velo+vasetti, tre scene e catena, specchio e stato).
- Tre rischi: (1) volume e ritmo dei contenuti (le lezioni possono restare ferme per giorni); (2) due percorsi di codice e partite vecchie a metà catena; (3) letto doppio impossibile e brani nuovi da trovare per alloro e mirra.

## Proposta 4 — «Il braciere tra le mani»

- Overlay a tutto schermo, `touch-action:none`, zona di gesto raggio 130: lo schema più sicuro. Vasetti = bottoni, guardia già valida. Riconoscimento (verticale / gomito / fermata in ultimi 700 ms) puro e testabile; alternativa a tocco sempre presente.
- La pulizia sul mazzo, sul panno e sul posto del cliente è il pezzo più «da gioco»: particelle con inerzia, misura di pulizia 0→1 per oggetto. 160 particelle a 30 fps con uno sprite precalcolato sono alla portata di un telefono medio (canvas 390×844, DPR a 2 al massimo); regge, ma il fumo deve sembrare fumo e questo si vede solo sul telefono.
- Sbagliato: `bell` è già un effetto esistente (campana di chiesa bassa, `sfx.js`), non si può riusare il nome per tre note di pulizia. `cueFor('rite.rosa')` non entra senza toccare `MOOD_NAMES`/`wantsMood`.
- Sbagliato/da correggere: `elegie` per la mirra è la musica degli Esami; `gymnopedie` per l'incenso è quella del titolo (e la proposta stessa usa `consolation` e `clairdelune`: la musica di tutte le letture). I vasetti a y 730–800 sfiorano la zona del gesto (fino a y 740).
- Sette effetti nuovi da scrivere senza sentirli (`ember, breath, brush, clay, sizzle, catch, bell`): è un lavoro vero e a vuoto, ognuno va ripulito da Andrea.
- Rito più lungo delle altre: 43,5 s la prima volta con quattro interazioni (tenere, pulire, scegliere, tracciare), 10,5 s alla ventesima; la «Lettrice che nota la mirra tre volte» è il solo punto in cui il gioco potrebbe sembrare un giudizio.
- «E Malva?» con il foglietto, la riga dello specchio, la pagina Fumi, `guess[]` sono ottimi e leggeri: soprattutto il richiamo facoltativo (dal quarto foglietto) è un modo non-quiz di vedere se ha imparato.
- Si costruisce bene a pezzi, e il pezzo «pulizia con il mazzo vero» è l'unico che si fa anche a casa con le carte vere.
- **Sforzo minimo (una schermata, tre fumi, pulizia di due cose, brani esistenti): medio-grande, 2–3 fasi.**
- Tre rischi: (1) il fumo che non sembra fumo e la pulizia che stanca; (2) sette suoni sintetici ciechi e il nome `bell` in conflitto; (3) fermata della mirra e pointer capture su iOS dentro l'overlay.

## Punteggi (1 = male, 5 = bene)

| | fila (scorre senza inciampi) | leggerezza alla ventesima | effetto di rito e attenzione | intuizione onorata | impara quale incenso quando | costruibile senza rischi |
|---|---|---|---|---|---|---|
| 1 | 3 | 4 | 4 | 5 | 3 | 2 |
| 2 | 4 | 5 | 3 | 4 | 3 | 3 |
| 3 | 4 | 3 | 5 | 3 | 4 | 2 |
| 4 | 3 | 3 | 5 | 3 | 4 | 3 |

## Classifica (dal punto di vista di chi deve costruire)

1. **Proposta 2** come scheletro: la più piccola, la più leggera, un solo gesto. Va solo tenuta in un overlay e non al posto dei bottoni.
2. **Proposta 4** come contenitore e per la pulizia, lo specchio, «E Malva?» e il richiamo. Pesa per suoni e fumo.
3. **Proposta 1** per l'idea (aria prima del nome, il segno come verifica a orecchio) ma con audio molto più semplice di quello che propone.
4. **Proposta 3** è la migliore per il tono e per l'imparare, ma è la più grossa e la meno costruibile in una fase: il modo giusto è farla seguire, non farla prima.

## L'innesto

Scheletro di 2 (un respiro, un solo gesto, gradini 11 s → 6 s), dentro il contenitore di 4 (overlay `touch-action:none`, il bottone di oggi resta e lo apre), con la scelta di 1 (aria senza nome, nome dopo) e il suono di 2 (una nota al passaggio, il brano entra dai deck esistenti all'accensione, mai il seek).
1. **Contenitore e fumo (da 4):** overlay, guardia propria, classificatore puro + test, un canvas solo con un fumo parametrico (velocità, curva, colore); entra solo in «Una lettura per me», dietro uno stato assente. *Si prova dal telefono:* si apre, si tiene, il fumo sale, si chiude.
2. **Apertura e pulizia (da 1 e 2):** tenere il carbone 1 s, il motivo, un respiro con la tinta dell'ultima volta che esce (pulizia senza passo in più); la mano è libera durante il respiro (niente barra di caricamento). *Telefono:* dura 12 s, il dito non fa nulla di strano.
3. **Tre arie senza nome (da 1, con le note di 2):** cannella, rosa, mirra su un arco, colore e fumo in continuo sotto il dito; una nota per brace; si ferma, appare il nome, il segno accende sempre (con alternativa a tocco). *Telefono:* si sceglie e si vede la stanza cambiare.
4. **Suono (da 2):** `mood('rite')` e `bedFor('rite')` con la brace, il motivo, le tre note; all'accensione il brano del fumo entra dai deck (dissolvenza 3 s); brani provvisori, tre file nuovi per non sporcare i vecchi. *Telefono:* Andrea ascolta le tre arie.
5. **Specchio e gradini (da 4 e 1):** la riga dopo la lettura, «E Malva?», il pallino nel diario, `n` 1–3 / 4–9 / 10+ (6 s alla ventesima), «Leggo senza fumo» dalla quarta volta, `rite.n/last/smokes` in `fresh()`. *Telefono:* la quinta lettura è visibilmente più corta.
6. **Poi:** `reading.js` e `free.js`, la prova d'ascolto alla cieca e i brani veri, il quarto e il quinto fumo uno per volta come in 3 (una riga di Malva, senza scena), il riconoscimento a orecchio, la soglia.

## L'unico rischio tecnico più serio

L'audio che porta la scelta. Nessuno di noi lo sente, la pipeline (esportare il contesto, brani e spezzoni che si sovrappongono ai due deck, loop senza giunzione, il brano intero che entra «dallo stesso punto») è l'unica cosa nuova davvero e le musiche già nel gioco falsano l'associazione. L'innesto lo riduce (una nota, niente seek, brani che entrano dall'inizio), ma non lo elimina: l'intuizione «cinque arie diverse» ci credo solo quando Andrea le ha sentite su un telefono vero.
