# Coverage of the story by random play

_Written by `node scripts/coverage.mjs --runs 1000 --seed 1`: do not edit by hand. What it means: docs/TOOLS.md._

1000 runs (half as a newcomer, half with popularity, Tartufo, trust 2 with each witch and the broom), 1000 reached the end. Warnings from the runner: 0.

A **unit** is a piece of a scene that shows only sometimes: a branch of an `IF` (then or else), an option of a choice (counted when it is offered), an observation of the Reader, a remark of a visit. The count is the number of runs in which it was shown.

## What random play cannot reach by construction

- Content opened by systems the player does not run: the lessons (glue/lessons.js), the garden, the opinions, the props, the trials and the clients' readings (their scenes are listed below as never played).
- Lines gated on the systems are only approximated: exams on the road (25% per step, 60% passed), one reading per `reading.open`, words on 30% of the cards found. Stats like `fires`, `stuns`, `locks`, `draws` stay 0.
- Popularity and Tartufo are 0 or 40 for a whole run (they move only in the code); the time of day, the days of play, the moon of today are not simulated.
- Choices are uniform at random: a line that needs a trait at 4 or more on one pole needs many answers the same way, so it can be rare without being broken.

## Scenes

115 scenes, 69 played at least once, 46 never.

- not reached by the player: worth a look: `visits.js#talk.m00`, `visits.js#talk.m04`, `visits.js#talk.m11`, `visits.js#talk.m15`, `visits.js#talk.m16`, `visits.js#talk.m17`, `visits.js#talk.m18`, `visits.js#talk.m19`, `visits.js#talk.m20`, `visits.js#talk.m21`
- set off by the world (getting lost in the fog), not by the CAST: `c2.js#fog.lost`
- set off by the world (the tall grass, the fog, swapping duplicates), not by the CAST: `post.js#minor.first`, `post.js#minor.dup`
- the lessons are offered by glue/lessons.js (flags `*.offered`), which the player does not run: `lessons.js#fly.offer`, `lessons.js#fly.lesson`, `lessons.js#minors.1.offer`, `lessons.js#minors.1.lesson`, `lessons.js#minors.2.offer`, `lessons.js#minors.2.lesson`, `lessons.js#minors.3.offer`, `lessons.js#minors.3.lesson`, `lessons.js#minors.4.offer`, `lessons.js#minors.4.lesson`, `lessons.js#minors.5.offer`, `lessons.js#minors.5.lesson`, `lessons.js#reversed.offer`, `lessons.js#reversed.lesson`
- the trials themselves (src/trials) are not played, so the doors that wait on an earlier trial's outcome (`trial.<id>.*`), a lesson or the days never open: `trials.js#trial.fog.door`, `trials.js#trial.cellars.door`, `trials.js#trial.well.door`, `trials.js#trial.kettle.door`, `trials.js#trial.grave.door`, `trials.js#trial.room.door`, `trials.js#trial.dare.door`
- the garden is opened by glue/garden.js on days of play: `garden.js#garden.ortica`, `garden.js#garden.look`, `garden-lessons.js#garden.lesson.acqua`, `garden-lessons.js#garden.lesson.luce`, `garden-lessons.js#garden.lesson.terra`, `garden-lessons.js#garden.lesson.vaso`, `garden-lessons.js#garden.lesson.semina`
- the clients' readings are not played (reading.open does nothing here): `clients.js#client.c1`, `clients.js#client.c2`, `clients.js#client.c3`, `clients.js#client.free`
- the opinions are asked from the grimoire (glue/opinions.js), not from the story: `opinions.js#malva.later`

## Units in the scenes that were played

1312 units: 757 common, 90 rare (under 1% of the runs), 465 never shown.

### Never shown

- `c1b.js#c1.exam1` (1)
  - else of tool incense
- `c1b.js#c1.venus` (1)
  - option «Appoggio Gli Amanti accanto al bicchiere, e guard…» (if has m06)
- `c1b.js#c1.gate` (2)
  - else of flag gate1.refused
  - if level 4
- `c1b.js#malva.chat` (2)
  - if flag b1.spoke
  - if level 4
- `c2.js#c2.ortica` (1)
  - else of power fire
- `c2.js#c2.mill` (1)
  - option «Giro una carta per la ruota, qui sul muretto, e g…» (if stat readings >= 3)
- `c2.js#c2.fire` (6)
  - if level 7
  - if flag venus.card
  - option «Io per la Ruota, sul quaderno, ho scritto: {words…» (if wrote m10)
  - else of power fire
  - if power cat
  - else of power cat
- `c2.js#c2.arrest` (1)
  - else of power cat
- `c2.js#ortica.chat` (2)
  - option «Nel folto del bosco c'è una nebbia che mi ha ripo…» (if flag fog.lost)
  - if lacks m08
- `c3.js#c3.trapdoor` (1)
  - else of flag gate2.refused
- `c3.js#c3.edera` (1)
  - if flag fog.lost
- `c3.js#c3.jail` (1)
  - if lacks m15
- `c3.js#c3.court` (1)
  - option «Prima di parlare cerco tra la gente la cuoca del …» (if flag client.c3.cook.done)
- `c3.js#edera.chat` (9)
  - option «Ho girato tutte le cantine: dimmi tu se ho diment…» (if explored 20)
  - if lacks m15
  - else of lacks m15
  - if lacks m16
  - else of lacks m16
  - if lacks m17
  - else of lacks m17
  - if lacks m18
  - else of lacks m18
- `end.js#c3.trial` (1)
  - if flag court.cook
- `end.js#f.last` (1)
  - if flag court.cook
- `post.js#enc.child` (1)
  - if lacks m02
- `post.js#enc.miller` (2)
  - if flag client.c2.miller.done
  - if flag mill.read
- `post.js#trade.ginepra` (2)
  - if flag minor.first e notFlag ginepra.minor
  - if flag minor.dup e notFlag ginepra.dup
- `post.js#post.ginepra` (4)
  - if flag post.met
  - option «Ti porto io dove cercare: ormai conosco ogni ango…» (if explored 25)
  - if notFlag post.shared
  - else of notFlag post.shared
- `trials.js#trial.night.door` (6)
  - if flag item.il cucchiaio d'argento di Malva
  - if flag trial.vigil.fail e notFlag trial.vigil.pass e notFlag trial.vigi…
  - if flag trial.night.fail e notFlag trial.night.pass e notFlag trial.nigh…
  - if flag trial.night.perfect e notFlag trial.night.perfect.told
  - if flag trial.night.pass e notFlag trial.night.pass.told
  - if flag trial.night.fail e notFlag trial.night.fail.told
- `trials.js#trial.vigil.door` (4)
  - if flag trial.vigil.fail e notFlag trial.vigil.pass e notFlag trial.vigi…
  - if flag trial.vigil.perfect e notFlag trial.vigil.perfect.told
  - if flag trial.vigil.pass e notFlag trial.vigil.pass.told
  - if flag trial.vigil.fail e notFlag trial.vigil.fail.told
- `sessions.js#s0` (2)
  - else of hasBirth true
  - else of hasBirth true
- `sessions.js#s1` (43)
  - «Da quando sei arrivata vai dove devi andare e bas…» (if trait esplora <= -3)
  - «La prima sera avevi una carta sola, e adesso ne h…» (if sempre)
  - «In piazza, l'altra sera, c'eri anche tu. Di quell…» (if sempre)
  - «Il perché è presto detto: da allora ti ho vista p…» (if trend esplora >= 2)
  - «Il perché è presto detto: da allora ti ho vista a…» (if trend esplora <= -2)
  - «Il perché è presto detto: da allora hai cominciat…» (if trend parola >= 2)
  - «Il perché è presto detto: da allora pesi molto di…» (if trend parola <= -2)
  - «Il perché è presto detto: da allora ti ho trovata…» (if trend tono >= 2)
  - «Il perché è presto detto: da allora la tua lingua…» (if trend tono <= -2)
  - «Il perché è presto detto: da allora ti ho vista p…» (if trend rischio >= 2)
  - «Il perché è presto detto: da allora ti sei fatta …» (if trend rischio <= -2)
  - «Il perché è presto detto: da allora ascolti di pi…» (if trend guida >= 2)
  - «Il perché è presto detto: da allora ragioni di pi…» (if trend guida <= -2)
  - «Il perché non è una cosa sola: sono tante piccole…» (if sempre)
  - «Di te, finora, ho visto soprattutto questo: vai d…» (if trait esplora <= -6)
  - «Di te, finora, ho visto soprattutto questo: hai l…» (if trait tono <= -6)
  - «Di te, finora, ho visto soprattutto questo: vai d…» (if trait esplora <= -5)
  - «Di te, finora, ho visto soprattutto questo: hai l…» (if trait tono <= -5)
  - «Di te, finora, ho visto soprattutto questo: vai d…» (if trait esplora <= -4)
  - «Di te, finora, ho visto soprattutto questo: vai d…» (if trait esplora <= -3)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - else of hasBirth true
- `sessions.js#s2` (47)
  - «So che hai imparato a lasciare i conestabili imba…» (if stat stuns >= 1)
  - «Da quando sai fare luce sei entrata nel buio {sta…» (if stat fires >= 5)
  - «Hai letto le carte a {stat:readings} persone, orm…» (if stat readings >= 6)
  - «Alla Morte, quando l'hai trovata, hai dato tre pa…» (if has m13)
  - «Della notte del deposito riparleremo un'altra vol…» (if sempre)
  - «Il perché è presto detto: da allora ti ho vista p…» (if trend esplora >= 2)
  - «Il perché è presto detto: da allora ti ho vista a…» (if trend esplora <= -2)
  - «Il perché è presto detto: da allora hai cominciat…» (if trend parola >= 2)
  - «Il perché è presto detto: da allora pesi molto di…» (if trend parola <= -2)
  - «Il perché è presto detto: da allora ti ho trovata…» (if trend tono >= 2)
  - «Il perché è presto detto: da allora la tua lingua…» (if trend tono <= -2)
  - «Il perché è presto detto: da allora ti ho vista p…» (if trend rischio >= 2)
  - «Il perché è presto detto: da allora ti sei fatta …» (if trend rischio <= -2)
  - «Il perché è presto detto: da allora ascolti di pi…» (if trend guida >= 2)
  - «Il perché è presto detto: da allora ragioni di pi…» (if trend guida <= -2)
  - «Il perché non è una cosa sola: sono tante piccole…» (if sempre)
  - «In questo tempo, più di tutto, ho visto che pesi …» (if trait parola <= -6)
  - «In questo tempo, più di tutto, ho visto che hai l…» (if trait tono <= -6)
  - «In questo tempo, più di tutto, ho visto che vai d…» (if trait esplora <= -5)
  - «In questo tempo, più di tutto, ho visto che pesi …» (if trait parola <= -5)
  - «In questo tempo, più di tutto, ho visto che hai l…» (if trait tono <= -5)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait rischio >= 4)
  - «In questo tempo, più di tutto, ho visto che hai l…» (if trait tono <= -3)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait guida >= 3)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - else of hasBirth true
- `sessions.js#s3` (41)
  - «Hai letto le carte a {stat:readings} persone. Sta…» (if stat readings >= 12)
  - «In tutto hai tenuto testa ai conestabili {stat:ex…» (if stat examsPassed >= 8)
  - «Hai aperto {stat:locks} serrature con le sole ris…» (if stat locks >= 5)
  - «Sei finita in cella {stat:jailed} volte e ne sei …» (if stat jailed >= 3)
  - «Alla Stella, quando l'hai trovata, hai dato tre p…» (if has m17)
  - «Hai {majors} carte, ormai, e il mazzo è quasi int…» (if sempre)
  - «La prima sera ti ho chiesto che cosa fai davanti …» (if sempre)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait tono <= -6)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait esplora <= -5)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait tono <= -5)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait esplora <= -4)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait tono <= -4)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait esplora <= -3)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait tono <= -3)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio >= 3)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio <= -3)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait guida >= 3)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait guida <= -3)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - else of hasBirth true
- `visits.js#openers` (17)
  - «L'altra volta ti perdevi volentieri per strada. I…» (if turned esplora e trait esplora < 0)
  - «Fino all'altra volta pesavi ogni parola. In quest…» (if turned parola e trait parola > 0)
  - «L'altra volta dicevi tutto quello che ti passava …» (if turned parola e trait parola < 0)
  - «Mi dicono che l'altra notte un conestabile è rima…» (if notFlag rd.stun e stat stuns >= 1)
  - «Mi hanno raccontato che in piazza ti sei chinata …» (if notFlag rd.candles e flag b1.candles)
  - «In piazza sei rimasta zitta, ma mi dicono che hai…» (if notFlag rd.watched e flag b1.watched)
  - «Dal deposito del tribunale è sparito un mazzo che…» (if notFlag rd.bray e flag depot.bray)
  - «Quel gatto ti viene dietro anche quando non hai n…» (if notFlag rd.tartufo e tartufo 3)
  - «Il tuo nome ormai gira per Salem, e arriva anche …» (if notFlag rd.pop e pop 2)
  - «Edera si fida di te, anche se il tuo nome continu…» (if notFlag rd.edera e trust edera >= 2)
  - «Hai già letto le carte a {stat:readings} persone,…» (if notFlag rd.readings e stat readings >= 5)
  - «Ho saputo che hai aperto {stat:locks} serrature s…» (if notFlag rd.locks e stat locks >= 3)
  - «Da quando sai fare luce, nel buio ci entri senza …» (if notFlag rd.fires e stat fires >= 3)
  - «Vedo che la borsa comincia a pesare: {coins} mone…» (if notFlag rd.coins e coinsMin 30)
  - «Bentornata: ti porti addosso l'odore del bosco, e…» (if chapter 2)
  - «Bentornata: vieni dal buio delle cantine, e vedo …» (if chapter 3)
  - «Siediti, perché ho visto che hai qualcosa di nuov…» (if sempre)
- `visits.js#thread` (8)
  - «La prima sera mi hai detto che davanti a una port…» (if notFlag rd.door e chapterMax 1 e flag s0.window e trait esp…)
  - «Mi avevi anche detto che in una casa entri pure q…» (if notFlag rd.door2 e chapterMax 1 e flag s0.enter e stat exam…)
  - «Mi avevi anche detto che in una casa entri pure q…» (if notFlag rd.door2 e chapterMax 1 e flag s0.enter)
  - «Mi avevi anche detto che lasci in pace chi vuole …» (if notFlag rd.door2 e chapterMax 1 e flag s0.back e stat readi…)
  - «Mi avevi anche detto che lasci in pace chi vuole …» (if notFlag rd.door2 e chapterMax 1 e flag s0.back)
  - «Mi avevi anche detto che davanti a una porta che …» (if notFlag rd.door2 e chapterMax 1 e flag s0.wait)
  - «Mi avevi anche detto che dove non ti aprono non i…» (if notFlag rd.door2 e chapterMax 1 e flag s0.leave)
  - «L'altra volta mi hai detto che un rumore che non …» (if notFlag rd.fear e chapter 3 e flag leaf.fear.m18 e stat fir…)
- `visits.js#rituals` (11)
  - «Tra le tue carte ci sono già tre angeli: quello d…» (if notFlag rd.three.angels e has m06 e has m14 e has m20)
  - «Metti vicini Gli Amanti e Il Diavolo e guardali b…» (if notFlag rd.pair.m06m15 e has m06 e has m15)
  - «Hai La Sacerdotessa e La Luna, e in tutte e due c…» (if notFlag rd.pair.m02m18 e has m02 e has m18)
  - «La Temperanza e La Stella versano tutte e due del…» (if notFlag rd.pair.m14m17 e has m14 e has m17)
  - «L'Eremita e L'Appeso sono i due solitari del mazz…» (if notFlag rd.pair.m09m12 e has m09 e has m12)
  - «La Sacerdotessa e La Giustizia siedono tutte e du…» (if notFlag rd.pair.m02m11 e has m02 e has m11)
  - «Il Carro e La Forza stanno vicini nel mazzo e par…» (if notFlag rd.pair.m07m08 e has m07 e has m08)
  - «L'Imperatrice e L'Imperatore vanno letti in coppi…» (if notFlag rd.pair.m03m04 e has m03 e has m04)
  - «La Sacerdotessa e Il Papa siedono tutti e due tra…» (if notFlag rd.pair.m02m05 e has m02 e has m05)
  - «L'Imperatore e Il Papa sono i due che comandano, …» (if notFlag rd.pair.m04m05 e has m04 e has m05)
  - «Il Matto e Il Mago sono le prime due carte, e con…» (if notFlag rd.pair.m00m01 e has m00 e has m01)
- `visits.js#closers` (245)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00)
  - «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01)
  - «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02)
  - «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03)
  - «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04)
  - «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05)
  - «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07)
  - «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08)
  - «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10)
  - «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11)
  - «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13)
  - «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16)
  - «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17)
  - «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18)
  - «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20)
  - «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21)
  - «Te ne vai, e io resto dell'idea dell'altra volta:…» (if notFlag rd.same.1b e verdict same e chapterMax 1)
  - «Per stanotte ci fermiamo qui. Per me resti {lastV…» (if verdict same)
  - «Per stanotte ci fermiamo qui. Le carte che ti ho …» (if sempre)

### Rare (under 1%)

- `c1b.js#c1.square` (1)
  - if flag b1.watched: 5 runs (0.50%)
- `c2.js#c2.ortica` (2)
  - if flag b1.watched: 5 runs (0.50%)
  - if trait esplora <= -3: 1 runs (0.10%)
- `c3.js#c3.edera` (1)
  - if trait tono <= -3: 2 runs (0.20%)
- `end.js#c3.trial` (4)
  - if trait tono <= -3: 1 runs (0.10%)
  - if flag b1.watched: 5 runs (0.50%)
  - option ««Cominciamo pure, e dopo, se avanza tempo, mi rac…» (if trait tono <= -3): 1 runs (0.10%)
  - option ««I suoi conestabili me ne hanno già fatte tante, …» (if stat examsPassed >= 5 e stat examsFailed == 0): 6 runs (0.60%)
- `end.js#f.dawn` (1)
  - if flag trial.candles: 1 runs (0.10%)
- `end.js#f.last` (2)
  - else of trust ortica >= 2: 8 runs (0.80%)
  - if trait esplora <= -3: 6 runs (0.60%)
- `sessions.js#s1` (17)
  - «Al primo conestabile hai raccontato che eri solta…» (if flag lied.constable): 2 runs (0.20%)
  - «All'Imperatrice, quando l'hai trovata, hai dato t…» (if has m03): 1 runs (0.10%)
  - «Di te, finora, ho visto soprattutto questo: pesi …» (if trait parola <= -6): 1 runs (0.10%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait guida >= 6): 8 runs (0.80%)
  - «Di te, finora, ho visto soprattutto questo: pesi …» (if trait parola <= -5): 1 runs (0.10%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait rischio >= 5): 6 runs (0.60%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait guida >= 5): 9 runs (0.90%)
  - «Di te, finora, ho visto soprattutto questo: pesi …» (if trait parola <= -4): 2 runs (0.20%)
  - «Di te, finora, ho visto soprattutto questo: hai l…» (if trait tono <= -4): 1 runs (0.10%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait rischio >= 4): 3 runs (0.30%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait guida >= 4): 5 runs (0.50%)
  - «Di te, finora, ho visto soprattutto questo: pesi …» (if trait parola <= -3): 4 runs (0.40%)
  - «Di te, finora, ho visto soprattutto questo: hai l…» (if trait tono <= -3): 1 runs (0.10%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait rischio >= 3): 2 runs (0.20%)
  - «Di te, finora, ho visto soprattutto questo: prima…» (if trait rischio <= -3): 7 runs (0.70%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait guida >= 3): 2 runs (0.20%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait guida <= -3): 4 runs (0.40%)
- `sessions.js#s2` (18)
  - «In questo tempo, più di tutto, ho visto che vai d…» (if trait esplora <= -6): 1 runs (0.10%)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait rischio >= 5): 7 runs (0.70%)
  - «In questo tempo, più di tutto, ho visto che prima…» (if trait rischio <= -5): 9 runs (0.90%)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait guida <= -5): 9 runs (0.90%)
  - «In questo tempo, più di tutto, ho visto che vai d…» (if trait esplora <= -4): 1 runs (0.10%)
  - «In questo tempo, più di tutto, ho visto che pesi …» (if trait parola <= -4): 2 runs (0.20%)
  - «In questo tempo, più di tutto, ho visto che hai l…» (if trait tono <= -4): 1 runs (0.10%)
  - «In questo tempo, più di tutto, ho visto che prima…» (if trait rischio <= -4): 5 runs (0.50%)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait guida >= 4): 3 runs (0.30%)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait guida <= -4): 1 runs (0.10%)
  - «In questo tempo, più di tutto, ho visto che ti fe…» (if trait esplora >= 3): 9 runs (0.90%)
  - «In questo tempo, più di tutto, ho visto che vai d…» (if trait esplora <= -3): 1 runs (0.10%)
  - «In questo tempo, più di tutto, ho visto che dici …» (if trait parola >= 3): 9 runs (0.90%)
  - «In questo tempo, più di tutto, ho visto che pesi …» (if trait parola <= -3): 3 runs (0.30%)
  - «In questo tempo, più di tutto, ho visto che hai m…» (if trait tono >= 3): 5 runs (0.50%)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait rischio >= 3): 3 runs (0.30%)
  - «In questo tempo, più di tutto, ho visto che prima…» (if trait rischio <= -3): 3 runs (0.30%)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait guida <= -3): 1 runs (0.10%)
- `sessions.js#s3` (18)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait esplora <= -6): 1 runs (0.10%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait parola <= -6): 2 runs (0.20%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio <= -6): 8 runs (0.80%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait parola <= -5): 2 runs (0.20%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio >= 5): 8 runs (0.80%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio <= -5): 6 runs (0.60%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait guida <= -5): 7 runs (0.70%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait esplora >= 4): 9 runs (0.90%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait parola <= -4): 1 runs (0.10%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio >= 4): 2 runs (0.20%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio <= -4): 1 runs (0.10%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait guida >= 4): 1 runs (0.10%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait guida <= -4): 5 runs (0.50%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait esplora >= 3): 3 runs (0.30%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait parola >= 3): 6 runs (0.60%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait parola <= -3): 1 runs (0.10%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait tono >= 3): 1 runs (0.10%)
  - «Di te ho visto un po' di tutto e niente che preva…» (if sempre): 3 runs (0.30%)
- `sessions.js#s4` (6)
  - «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07): 5 runs (0.50%)
  - «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10): 1 runs (0.10%)
  - «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13): 3 runs (0.30%)
  - «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15): 2 runs (0.20%)
  - «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16): 5 runs (0.50%)
  - «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20): 3 runs (0.30%)
- `visits.js#openers` (17)
  - «L'altra volta avevi la risposta pronta, e un po' …» (if turned tono e trait tono > 0): 7 runs (0.70%)
  - «L'altra volta eri tutta gentilezza. In questi gio…» (if turned tono e trait tono < 0): 6 runs (0.60%)
  - «Sei una che rischia, ma non dice mai una parola d…» (if notFlag rd.pair.bold-quiet e trait rischio >= 3 e trait par…): 3 runs (0.30%)
  - «Pungi, e intanto senti tutto. Ho idea che le spin…» (if notFlag rd.pair.sharp-heart e trait tono <= -3 e trait guid…): 4 runs (0.40%)
  - «Sei venuta dritta anche stavolta, senza guardarti…» (if notFlag rd.st.esplora- e steady esplora e trait esplora <= …): 3 runs (0.30%)
  - «Continui a pesare le parole prima di dirle, con m…» (if notFlag rd.st.parola- e steady parola e trait parola <= -3): 3 runs (0.30%)
  - «Hai ancora la lingua affilata, ho notato. Va bene…» (if notFlag rd.st.tono- e steady tono e trait tono <= -3): 1 runs (0.10%)
  - «Continui a preferire la strada rischiosa a quella…» (if notFlag rd.st.rischio+ e steady rischio e trait rischio >= 3): 7 runs (0.70%)
  - «Continui a muoverti con prudenza, e finora i fatt…» (if notFlag rd.st.rischio- e steady rischio e trait rischio <= …): 2 runs (0.20%)
  - «Decidi ancora col cuore, ho notato. Le carte con …» (if notFlag rd.st.guida+ e steady guida e trait guida >= 3): 5 runs (0.50%)
  - «Continui a ragionare su tutto prima di decidere. …» (if notFlag rd.st.guida- e steady guida e trait guida <= -3): 1 runs (0.10%)
  - «Hai riportato a Ortica quattro monete che potevi …» (if notFlag rd.honest e flag mill.honest): 3 runs (0.30%)
  - «Ho saputo che alla lavandaia hai lasciato le sue …» (if notFlag rd.tabita e flag tabita.owes): 9 runs (0.90%)
  - «Ho saputo che Malva ha cominciato a fidarsi di te…» (if notFlag rd.malva e trust malva >= 2): 1 runs (0.10%)
  - «Ortica parla bene di te. Lei parla di tutti, è ve…» (if notFlag rd.ortica e trust ortica >= 2): 1 runs (0.10%)
  - «Ai conestabili ormai rispondi senza scomporti: te…» (if notFlag rd.passed e stat examsPassed >= 4): 1 runs (0.10%)
  - «Bentornata: hai le scarpe bagnate di neve e qualc…» (if chapterMax 1): 7 runs (0.70%)
- `visits.js#thread` (1)
  - «La prima sera mi hai detto che davanti a una port…» (if notFlag rd.door e chapterMax 1 e flag s0.knock e trait espl…): 1 runs (0.10%)
- `visits.js#talk.m02` (2)
  - option «Sì, di solito mi fido.»: 3 runs (0.30%)
  - option «No, mi serve una prova.»: 3 runs (0.30%)

## At the end

### Traits (value at the end: runs)

| Trait | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| esplora | 1 | 0 | 3 | 2 | 7 | 31 | 30 | 55 | 76 | 98 | 151 | 167 | 379 |
| parola | 3 | 3 | 4 | 14 | 16 | 33 | 46 | 69 | 77 | 117 | 150 | 171 | 297 |
| tono | 0 | 1 | 0 | 0 | 4 | 6 | 14 | 31 | 47 | 65 | 97 | 157 | 578 |
| rischio | 21 | 36 | 75 | 70 | 82 | 102 | 94 | 91 | 99 | 79 | 62 | 70 | 119 |
| guida | 34 | 53 | 60 | 58 | 95 | 86 | 91 | 90 | 114 | 86 | 74 | 76 | 83 |

### Trust with the witches (value: runs)

- malva: 0: 40, 1: 153, 2: 266, 3: 271, 4: 180, 5: 79, 6: 11
- ortica: 1: 8, 2: 77, 3: 176, 4: 258, 5: 232, 6: 168, 7: 69, 8: 12
- edera: 0: 17, 1: 64, 2: 154, 3: 228, 4: 200, 5: 164, 6: 129, 7: 38, 8: 6
- ginepra: 0: 2, 1: 12, 2: 24, 3: 73, 4: 145, 5: 164, 6: 179, 7: 180, 8: 135, 9: 55, 10: 28, 11: 3

### Her card and her suit

- card: m17 21.1%, m19 20.0%, m01 17.8%, m00 14.3%, m03 10.4%, m08 4.0%, m06 3.6%, m14 3.0%, m18 1.7%, m21 1.3%, m09 0.90%, m11 0.90%, m05 0.40%, m02 0.20%, m07 0.20%, m16 0.10%, m12 0.10%
- suit: c 66.8%, s 28.6%, w 3.4%, p 1.2%

### Ending variants

The conditional pieces of the trial, the dawn, the campfire and the last session (lore/finali/ has where each is earned).

| Where | Variant | Runs |
|---|---|---:|
| end.js#c3.trial | if stat jailed >= 2 | 94.7% |
| end.js#c3.trial | else of stat jailed >= 2 | 5.3% |
| end.js#c3.trial | if stat jailed >= 1 | 4.7% |
| end.js#c3.trial | if flag b1.spoke | 49.3% |
| end.js#c3.trial | else of flag b1.spoke | 50.7% |
| end.js#c3.trial | if flag b2.went | 48.8% |
| end.js#c3.trial | if trait tono <= -3 | 0.10% |
| end.js#c3.trial | if trait tono >= 3 | 86.0% |
| end.js#c3.trial | if trait parola >= 3 | 70.2% |
| end.js#c3.trial | if trait parola <= -3 | 2.4% |
| end.js#c3.trial | if flag coven.watch.malva | 50.4% |
| end.js#c3.trial | else of flag coven.watch.malva | 49.6% |
| end.js#c3.trial | if trust malva >= 2 | 40.4% |
| end.js#c3.trial | if trust ortica >= 2 | 99.1% |
| end.js#c3.trial | if flag coven.watch.edera | 49.6% |
| end.js#c3.trial | else of flag coven.watch.edera | 50.4% |
| end.js#c3.trial | if trust edera >= 2 | 45.3% |
| end.js#c3.trial | if flag coven.cat.in | 51.0% |
| end.js#c3.trial | if flag coven.cat.out | 49.0% |
| end.js#c3.trial | if flag court.cook | 0.0% |
| end.js#c3.trial | if flag depot.bray | 21.3% |
| end.js#c3.trial | if flag b1.watched | 0.50% |
| end.js#c3.trial | option ««Cominciamo pure, e dopo, se avanza tempo, mi rac…» (if trait tono <= -3) | 0.10% |
| end.js#c3.trial | option ««I suoi conestabili me ne hanno già fatte tante, …» (if stat examsPassed >= 5 e stat examsFailed == 0) | 0.60% |
| end.js#c3.trial | if flag exam.passed | 57.9% |
| end.js#c3.trial | else of flag exam.passed | 42.1% |
| end.js#c3.trial | if flag trial.won | 57.9% |
| end.js#c3.trial | else of flag trial.won | 42.1% |
| end.js#f.dawn | if flag coven.ortica.brooms | 34.2% |
| end.js#f.dawn | else of flag coven.ortica.brooms | 65.8% |
| end.js#f.dawn | option «Ti dico quello che Malva ha detto a me: tienila b…» (if flag lesson.fly) | 50.0% |
| end.js#f.dawn | option «Guarda Tartufo, che ti fa vedere dove si mettono …» (if tartufo 3) | 50.0% |
| end.js#f.dawn | if flag jail.keys | 5.2% |
| end.js#f.dawn | if flag jail.hinges | 4.9% |
| end.js#f.dawn | if flag jail.ortica | 4.3% |
| end.js#f.dawn | if flag jail.jailer | 3.9% |
| end.js#f.dawn | if flag court.card | 17.6% |
| end.js#f.dawn | if flag trial.candles | 0.10% |
| end.js#f.dawn | if flag fire.carriage | 50.6% |
| end.js#f.dawn | if flag fire.promised | 64.6% |
| end.js#f.dawn | if flag venus.looked | 50.1% |
| end.js#f.dawn | if flag b3.stealth | 48.6% |
| end.js#f.dawn | else of flag b3.stealth | 51.4% |
| end.js#f.dawn | if trait rischio >= 3 | 30.2% |
| end.js#f.dawn | if torn tono | 8.7% |
| end.js#f.dawn | if power cat | 100.0% |
| end.js#f.last | if flag b1.candles | 3.7% |
| end.js#f.last | if flag court.cook | 0.0% |
| end.js#f.last | if flag tabita.owes | 47.6% |
| end.js#f.last | if flag b1.spoke | 49.3% |
| end.js#f.last | else of flag b1.spoke | 50.7% |
| end.js#f.last | if flag b2.went | 48.8% |
| end.js#f.last | else of flag b2.went | 51.2% |
| end.js#f.last | if flag b3.stealth | 48.6% |
| end.js#f.last | else of flag b3.stealth | 51.4% |
| end.js#f.last | if flag trial.won | 57.9% |
| end.js#f.last | else of flag trial.won | 42.1% |
| end.js#f.last | if trust malva >= 2 | 80.7% |
| end.js#f.last | else of trust malva >= 2 | 19.3% |
| end.js#f.last | if steady parola | 71.6% |
| end.js#f.last | if trait parola >= 3 | 68.6% |
| end.js#f.last | else of trait parola >= 3 | 3.0% |
| end.js#f.last | if trust ortica >= 2 | 99.2% |
| end.js#f.last | else of trust ortica >= 2 | 0.80% |
| end.js#f.last | if steady esplora e trait esplora >= 3 | 75.5% |
| end.js#f.last | if trust edera >= 2 | 91.9% |
| end.js#f.last | else of trust edera >= 2 | 8.1% |
| end.js#f.last | if steady tono e trait tono >= 3 | 86.5% |
| end.js#f.last | if flag cat.fed | 53.7% |
| end.js#f.last | else of flag cat.fed | 46.3% |
| end.js#f.last | if trait esplora >= 3 | 79.5% |
| end.js#f.last | if trait esplora <= -3 | 0.60% |
| end.js#f.last | option «Prima ringrazio le maestre, una per una, anche se…» (if trust malva >= 2 e trust ortica >= 2 e trust edera >= 2) | 74.8% |
| sessions.js#s4 | if flag s0.window | 58.1% |
| sessions.js#s4 | else of flag s0.window | 41.9% |
| sessions.js#s4 | if flag s0.believes | 49.8% |
| sessions.js#s4 | else of flag s0.believes | 50.2% |
| sessions.js#s4 | if verdict changed | 9.9% |
| sessions.js#s4 | else of verdict changed | 90.1% |
| sessions.js#s4 | «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00) | 23.1% |
| sessions.js#s4 | «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01) | 32.8% |
| sessions.js#s4 | «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02) | 1.0% |
| sessions.js#s4 | «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03) | 19.0% |
| sessions.js#s4 | «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04) | 1.4% |
| sessions.js#s4 | «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05) | 1.4% |
| sessions.js#s4 | «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06) | 9.2% |
| sessions.js#s4 | «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07) | 0.50% |
| sessions.js#s4 | «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08) | 7.8% |
| sessions.js#s4 | «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09) | 3.9% |
| sessions.js#s4 | «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10) | 0.10% |
| sessions.js#s4 | «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11) | 4.5% |
| sessions.js#s4 | «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12) | 9.3% |
| sessions.js#s4 | «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13) | 0.30% |
| sessions.js#s4 | «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14) | 11.0% |
| sessions.js#s4 | «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15) | 0.20% |
| sessions.js#s4 | «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16) | 0.50% |
| sessions.js#s4 | «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17) | 39.1% |
| sessions.js#s4 | «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18) | 5.9% |
| sessions.js#s4 | «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19) | 29.4% |
| sessions.js#s4 | «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20) | 0.30% |
| sessions.js#s4 | «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21) | 8.6% |
| sessions.js#s4 | if yourCardIsBirth true | 3.0% |
| sessions.js#s4 | else of yourCardIsBirth true | 97.0% |
| sessions.js#s4 | if hasBirth true | 97.0% |
