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

118 scenes, 78 played at least once, 40 never.

- not reached by the player: worth a look: `hat.js#trial.hat.door`, `hat.js#trial.hat.wait`, `hat.js#trial.hat.after`, `visits.js#talk.m00`
- set off by the world (getting lost in the fog), not by the CAST: `c2.js#fog.lost`
- the garden is opened by glue/garden.js on days of play: `garden-lessons.js#garden.lesson.acqua`, `garden-lessons.js#garden.lesson.luce`, `garden-lessons.js#garden.lesson.terra`, `garden-lessons.js#garden.lesson.vaso`, `garden-lessons.js#garden.lesson.semina`, `garden.js#garden.ortica`, `garden.js#garden.look`
- the lessons are offered by glue/lessons.js (flags `*.offered`), which the player does not run: `lessons.js#fly.offer`, `lessons.js#fly.lesson`, `lessons.js#minors.1.offer`, `lessons.js#minors.1.lesson`, `lessons.js#minors.2.offer`, `lessons.js#minors.2.lesson`, `lessons.js#minors.3.offer`, `lessons.js#minors.3.lesson`, `lessons.js#minors.4.offer`, `lessons.js#minors.4.lesson`, `lessons.js#minors.5.offer`, `lessons.js#minors.5.lesson`, `lessons.js#reversed.offer`, `lessons.js#reversed.lesson`
- set off by the world (the tall grass, the fog, swapping duplicates), not by the CAST: `post.js#minor.first`, `post.js#minor.dup`
- the trials themselves (src/trials) are not played, so the doors that wait on an earlier trial's outcome (`trial.<id>.*`), a lesson or the days never open: `trials.js#trial.fog.door`, `trials.js#trial.cellars.door`, `trials.js#trial.well.door`, `trials.js#trial.kettle.door`, `trials.js#trial.grave.door`, `trials.js#trial.room.door`, `trials.js#trial.dare.door`
- the clients' readings are not played (reading.open does nothing here): `clients.js#client.c1`, `clients.js#client.c2`, `clients.js#client.c3`, `clients.js#client.free`
- the opinions are asked from the grimoire (glue/opinions.js), not from the story: `opinions.js#malva.later`

## Units in the scenes that were played

1348 units: 887 common, 33 rare (under 1% of the runs), 428 never shown.

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
- `sessions.js#s1` (37)
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
- `sessions.js#s2` (39)
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
- `sessions.js#s3` (30)
  - «Hai letto le carte a {stat:readings} persone. Sta…» (if stat readings >= 12)
  - «In tutto hai tenuto testa ai conestabili {stat:ex…» (if stat examsPassed >= 8)
  - «Hai aperto {stat:locks} serrature con le sole ris…» (if stat locks >= 5)
  - «Sei finita in cella {stat:jailed} volte e ne sei …» (if stat jailed >= 3)
  - «Alla Stella, quando l'hai trovata, hai dato tre p…» (if has m17)
  - «Hai {majors} carte, ormai, e il mazzo è quasi int…» (if sempre)
  - «La prima sera ti ho chiesto che cosa fai davanti …» (if sempre)
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
- `visits.js#openers` (10)
  - «Fino all'altra volta pesavi ogni parola. In quest…» (if turned parola e trait parola > 0)
  - «L'altra volta dicevi tutto quello che ti passava …» (if turned parola e trait parola < 0)
  - «Mi dicono che l'altra notte un conestabile è rima…» (if notFlag rd.stun e stat stuns >= 1)
  - «Hai già letto le carte a {stat:readings} persone,…» (if notFlag rd.readings e stat readings >= 5)
  - «Ho saputo che hai aperto {stat:locks} serrature s…» (if notFlag rd.locks e stat locks >= 3)
  - «Da quando sai fare luce, nel buio ci entri senza …» (if notFlag rd.fires e stat fires >= 3)
  - «Vedo che la borsa comincia a pesare: {coins} mone…» (if notFlag rd.coins e coinsMin 30)
  - «Bentornata: ti porti addosso l'odore del bosco, e…» (if chapter 2)
  - «Bentornata: vieni dal buio delle cantine, e vedo …» (if chapter 3)
  - «Siediti, perché ho visto che hai qualcosa di nuov…» (if sempre)
- `visits.js#thread` (7)
  - «Mi avevi anche detto che in una casa entri pure q…» (if notFlag rd.door2 e chapterMax 1 e flag s0.enter e stat exam…)
  - «Mi avevi anche detto che in una casa entri pure q…» (if notFlag rd.door2 e chapterMax 1 e flag s0.enter)
  - «Mi avevi anche detto che lasci in pace chi vuole …» (if notFlag rd.door2 e chapterMax 1 e flag s0.back e stat readi…)
  - «Mi avevi anche detto che lasci in pace chi vuole …» (if notFlag rd.door2 e chapterMax 1 e flag s0.back)
  - «Mi avevi anche detto che davanti a una porta che …» (if notFlag rd.door2 e chapterMax 1 e flag s0.wait)
  - «Mi avevi anche detto che dove non ti aprono non i…» (if notFlag rd.door2 e chapterMax 1 e flag s0.leave)
  - «L'altra volta mi hai detto che un rumore che non …» (if notFlag rd.fear e chapter 3 e flag leaf.fear.m18 e stat fir…)
- `visits.js#rituals` (8)
  - «La Temperanza e La Stella versano tutte e due del…» (if notFlag rd.pair.m14m17 e has m14 e has m17)
  - «L'Eremita e L'Appeso sono i due solitari del mazz…» (if notFlag rd.pair.m09m12 e has m09 e has m12)
  - «La Sacerdotessa e La Giustizia siedono tutte e du…» (if notFlag rd.pair.m02m11 e has m02 e has m11)
  - «Il Carro e La Forza stanno vicini nel mazzo e par…» (if notFlag rd.pair.m07m08 e has m07 e has m08)
  - «L'Imperatrice e L'Imperatore vanno letti in coppi…» (if notFlag rd.pair.m03m04 e has m03 e has m04)
  - «La Sacerdotessa e Il Papa siedono tutti e due tra…» (if notFlag rd.pair.m02m05 e has m02 e has m05)
  - «L'Imperatore e Il Papa sono i due che comandano, …» (if notFlag rd.pair.m04m05 e has m04 e has m05)
  - «Il Matto e Il Mago sono le prime due carte, e con…» (if notFlag rd.pair.m00m01 e has m00 e has m01)
- `visits.js#closers` (244)
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
  - «Per stanotte ci fermiamo qui. Le carte che ti ho …» (if sempre)

### Rare (under 1%)

- `end.js#c3.trial` (1)
  - option ««I suoi conestabili me ne hanno già fatte tante, …» (if stat examsPassed >= 5 e stat examsFailed == 0): 6 runs (0.60%)
- `end.js#f.last` (1)
  - else of trust ortica >= 2: 9 runs (0.90%)
- `sessions.js#s1` (8)
  - «Da quando sei arrivata hai guardato dietro ogni a…» (if trait esplora >= 3): 5 runs (0.50%)
  - «Al primo conestabile hai raccontato che eri solta…» (if flag lied.constable): 5 runs (0.50%)
  - «All'Imperatrice, quando l'hai trovata, hai dato t…» (if has m03): 5 runs (0.50%)
  - «Di te, finora, ho visto soprattutto questo: vai d…» (if trait esplora <= -6): 1 runs (0.10%)
  - «Di te, finora, ho visto soprattutto questo: hai l…» (if trait tono <= -6): 3 runs (0.30%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait guida >= 6): 8 runs (0.80%)
  - «Di te, finora, ho visto soprattutto questo: vai d…» (if trait esplora <= -5): 2 runs (0.20%)
  - «Di te, finora, ho visto soprattutto questo: quand…» (if trait guida >= 3): 6 runs (0.60%)
- `sessions.js#s2` (5)
  - «In questo tempo, più di tutto, ho visto che hai m…» (if trait tono >= 3): 7 runs (0.70%)
  - «In questo tempo, più di tutto, ho visto che hai l…» (if trait tono <= -3): 8 runs (0.80%)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait rischio >= 3): 3 runs (0.30%)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait guida >= 3): 1 runs (0.10%)
  - «In questo tempo, più di tutto, ho visto che quand…» (if trait guida <= -3): 2 runs (0.20%)
- `sessions.js#s3` (14)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait parola <= -4): 8 runs (0.80%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio >= 4): 8 runs (0.80%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio <= -4): 9 runs (0.90%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait guida >= 4): 7 runs (0.70%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait guida <= -4): 9 runs (0.90%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait esplora <= -3): 9 runs (0.90%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait parola >= 3): 9 runs (0.90%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait parola <= -3): 9 runs (0.90%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait tono >= 3): 8 runs (0.80%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait tono <= -3): 4 runs (0.40%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio >= 3): 5 runs (0.50%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait rischio <= -3): 5 runs (0.50%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait guida >= 3): 3 runs (0.30%)
  - «Dopo tutte queste sere, la cosa che di te vedo me…» (if trait guida <= -3): 2 runs (0.20%)
- `visits.js#openers` (4)
  - «Il tuo nome ormai gira per Salem, e arriva anche …» (if notFlag rd.pop e pop 2): 3 runs (0.30%)
  - «Edera si fida di te, anche se il tuo nome continu…» (if notFlag rd.edera e trust edera >= 2): 1 runs (0.10%)
  - «Ai conestabili ormai rispondi senza scomporti: te…» (if notFlag rd.passed e stat examsPassed >= 4): 1 runs (0.10%)
  - «Bentornata: hai le scarpe bagnate di neve e qualc…» (if chapterMax 1): 4 runs (0.40%)

## At the end

### Traits (value at the end: runs)

| Trait | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| esplora | 38 | 59 | 75 | 73 | 96 | 113 | 98 | 88 | 95 | 74 | 52 | 80 | 59 |
| parola | 40 | 51 | 61 | 64 | 70 | 95 | 93 | 83 | 98 | 80 | 79 | 86 | 100 |
| tono | 23 | 54 | 84 | 70 | 77 | 86 | 91 | 76 | 89 | 91 | 76 | 63 | 120 |
| rischio | 47 | 53 | 80 | 77 | 94 | 93 | 88 | 88 | 81 | 73 | 66 | 72 | 88 |
| guida | 63 | 61 | 58 | 102 | 93 | 86 | 100 | 74 | 95 | 71 | 67 | 64 | 66 |

### Trust with the witches (value: runs)

- malva: 0: 41, 1: 151, 2: 263, 3: 278, 4: 176, 5: 80, 6: 11
- ortica: 1: 9, 2: 81, 3: 179, 4: 270, 5: 227, 6: 157, 7: 67, 8: 10
- edera: 0: 17, 1: 66, 2: 153, 3: 225, 4: 200, 5: 165, 6: 129, 7: 37, 8: 8
- ginepra: 0: 2, 1: 12, 2: 33, 3: 77, 4: 152, 5: 156, 6: 189, 7: 177, 8: 124, 9: 51, 10: 23, 11: 4

### Her card and her suit

- card: m11 10.1%, m07 8.3%, m14 8.3%, m00 8.2%, m03 5.9%, m19 5.6%, m09 5.6%, m02 5.4%, m04 5.3%, m18 4.9%, m06 4.6%, m01 4.5%, m16 3.5%, m05 3.3%, m08 3.2%, m10 2.8%, m13 2.6%, m17 2.5%, m20 1.6%, m15 1.5%, m12 1.5%, m21 0.80%
- suit: c 32.7%, s 28.0%, w 21.8%, p 17.5%

### Ending variants

The conditional pieces of the trial, the dawn, the campfire and the last session (lore/storia/generati/finali/ has where each is earned).

| Where | Variant | Runs |
|---|---|---:|
| end.js#c3.trial | if stat jailed >= 2 | 94.8% |
| end.js#c3.trial | else of stat jailed >= 2 | 5.2% |
| end.js#c3.trial | if stat jailed >= 1 | 4.6% |
| end.js#c3.trial | if flag b1.spoke | 45.2% |
| end.js#c3.trial | else of flag b1.spoke | 54.8% |
| end.js#c3.trial | if flag b2.went | 48.5% |
| end.js#c3.trial | if trait tono <= -3 | 29.4% |
| end.js#c3.trial | if trait tono >= 3 | 25.0% |
| end.js#c3.trial | if trait parola >= 3 | 28.6% |
| end.js#c3.trial | if trait parola <= -3 | 24.2% |
| end.js#c3.trial | if flag coven.watch.malva | 50.6% |
| end.js#c3.trial | else of flag coven.watch.malva | 49.4% |
| end.js#c3.trial | if trust malva >= 2 | 40.2% |
| end.js#c3.trial | if trust ortica >= 2 | 99.0% |
| end.js#c3.trial | if flag coven.watch.edera | 49.4% |
| end.js#c3.trial | else of flag coven.watch.edera | 50.6% |
| end.js#c3.trial | if trust edera >= 2 | 45.5% |
| end.js#c3.trial | if flag coven.cat.in | 51.2% |
| end.js#c3.trial | if flag coven.cat.out | 48.8% |
| end.js#c3.trial | if flag court.cook | 0.0% |
| end.js#c3.trial | if flag depot.bray | 21.1% |
| end.js#c3.trial | if flag b1.watched | 7.1% |
| end.js#c3.trial | option ««Cominciamo pure, e dopo, se avanza tempo, mi rac…» (if trait tono <= -3) | 29.4% |
| end.js#c3.trial | option ««I suoi conestabili me ne hanno già fatte tante, …» (if stat examsPassed >= 5 e stat examsFailed == 0) | 0.60% |
| end.js#c3.trial | if flag exam.passed | 57.6% |
| end.js#c3.trial | else of flag exam.passed | 42.4% |
| end.js#c3.trial | if flag trial.won | 57.6% |
| end.js#c3.trial | else of flag trial.won | 42.4% |
| end.js#f.dawn | if flag coven.ortica.brooms | 34.8% |
| end.js#f.dawn | else of flag coven.ortica.brooms | 65.2% |
| end.js#f.dawn | option «Ti dico quello che Malva ha detto a me: tienila b…» (if flag lesson.fly) | 50.0% |
| end.js#f.dawn | option «Guarda Tartufo, che ti fa vedere dove si mettono …» (if tartufo 3) | 50.0% |
| end.js#f.dawn | if affinity ginepra 2 | 15.6% |
| end.js#f.dawn | if flag jail.keys | 5.2% |
| end.js#f.dawn | if flag jail.hinges | 4.9% |
| end.js#f.dawn | if flag jail.ortica | 4.3% |
| end.js#f.dawn | if flag jail.jailer | 4.0% |
| end.js#f.dawn | if flag court.card | 18.3% |
| end.js#f.dawn | if flag trial.candles | 10.3% |
| end.js#f.dawn | if flag fire.carriage | 50.5% |
| end.js#f.dawn | if flag fire.promised | 64.4% |
| end.js#f.dawn | if flag venus.looked | 50.1% |
| end.js#f.dawn | if flag b3.stealth | 48.8% |
| end.js#f.dawn | else of flag b3.stealth | 51.2% |
| end.js#f.dawn | if trait rischio >= 3 | 26.8% |
| end.js#f.dawn | if torn tono | 26.5% |
| end.js#f.dawn | if power cat | 100.0% |
| end.js#f.last | if flag b1.candles | 2.6% |
| end.js#f.last | if flag court.cook | 0.0% |
| end.js#f.last | if flag tabita.owes | 47.6% |
| end.js#f.last | if flag b1.spoke | 45.2% |
| end.js#f.last | else of flag b1.spoke | 54.8% |
| end.js#f.last | if flag b2.went | 48.5% |
| end.js#f.last | else of flag b2.went | 51.5% |
| end.js#f.last | if flag b3.stealth | 48.8% |
| end.js#f.last | else of flag b3.stealth | 51.2% |
| end.js#f.last | if flag trial.won | 57.6% |
| end.js#f.last | else of flag trial.won | 42.4% |
| end.js#f.last | if trust malva >= 2 | 80.8% |
| end.js#f.last | else of trust malva >= 2 | 19.2% |
| end.js#f.last | if affinity malva 2 | 16.7% |
| end.js#f.last | if steady parola | 54.8% |
| end.js#f.last | if trait parola >= 3 | 29.4% |
| end.js#f.last | else of trait parola >= 3 | 25.4% |
| end.js#f.last | if trust ortica >= 2 | 99.1% |
| end.js#f.last | else of trust ortica >= 2 | 0.90% |
| end.js#f.last | if affinity ortica 2 | 19.7% |
| end.js#f.last | if steady esplora e trait esplora >= 3 | 22.8% |
| end.js#f.last | if trust edera >= 2 | 91.7% |
| end.js#f.last | else of trust edera >= 2 | 8.3% |
| end.js#f.last | if affinity edera 2 | 17.1% |
| end.js#f.last | if steady tono e trait tono >= 3 | 27.4% |
| end.js#f.last | if flag cat.fed | 53.7% |
| end.js#f.last | else of flag cat.fed | 46.3% |
| end.js#f.last | if trait esplora >= 3 | 26.6% |
| end.js#f.last | if trait esplora <= -3 | 26.0% |
| end.js#f.last | option «Prima ringrazio le maestre, una per una, anche se…» (if trust malva >= 2 e trust ortica >= 2 e trust edera >= 2) | 74.8% |
| sessions.js#s4 | if flag s0.window | 58.1% |
| sessions.js#s4 | else of flag s0.window | 41.9% |
| sessions.js#s4 | if flag s0.believes | 49.8% |
| sessions.js#s4 | else of flag s0.believes | 50.2% |
| sessions.js#s4 | if verdict changed | 11.1% |
| sessions.js#s4 | else of verdict changed | 88.9% |
| sessions.js#s4 | «Il Matto è la carta di chi parte volentieri e gua…» (if yourCard m00) | 14.7% |
| sessions.js#s4 | «Il Mago è la carta di chi ha la parola pronta e u…» (if yourCard m01) | 11.1% |
| sessions.js#s4 | «La Sacerdotessa è la carta di chi sente molto e d…» (if yourCard m02) | 11.9% |
| sessions.js#s4 | «L'Imperatrice è la carta di chi ha modi gentili e…» (if yourCard m03) | 9.2% |
| sessions.js#s4 | «L'Imperatore è la carta di chi ragiona e va dritt…» (if yourCard m04) | 11.6% |
| sessions.js#s4 | «Il Papa è la carta di chi preferisce la strada si…» (if yourCard m05) | 8.4% |
| sessions.js#s4 | «Gli Amanti sono la carta di chi sceglie col cuore…» (if yourCard m06) | 8.1% |
| sessions.js#s4 | «Il Carro è la carta di chi punta dritto alla meta…» (if yourCard m07) | 12.0% |
| sessions.js#s4 | «La Forza è la carta di chi ha coraggio e ha anche…» (if yourCard m08) | 5.5% |
| sessions.js#s4 | «L'Eremita è la carta di chi guarda molto e parla …» (if yourCard m09) | 16.3% |
| sessions.js#s4 | «La Ruota della Fortuna è la carta di chi gioca la…» (if yourCard m10) | 6.0% |
| sessions.js#s4 | «La Giustizia è la carta di chi ragiona con lucidi…» (if yourCard m11) | 20.2% |
| sessions.js#s4 | «L'Appeso è la carta di chi non ha nessuna fretta …» (if yourCard m12) | 16.4% |
| sessions.js#s4 | «Non badare al nome: La Morte è la carta di chi pa…» (if yourCard m13) | 7.3% |
| sessions.js#s4 | «La Temperanza è la carta di chi ha misura in tutt…» (if yourCard m14) | 20.4% |
| sessions.js#s4 | «Non offenderti: Il Diavolo è la carta di chi ha d…» (if yourCard m15) | 5.2% |
| sessions.js#s4 | «Non spaventarti: La Torre è la carta di chi dice …» (if yourCard m16) | 6.7% |
| sessions.js#s4 | «La Stella è la carta di chi è gentile e guarda il…» (if yourCard m17) | 7.9% |
| sessions.js#s4 | «La Luna è la carta di chi dà retta a quello che s…» (if yourCard m18) | 13.7% |
| sessions.js#s4 | «Il Sole è la carta di chi dice le cose chiare e l…» (if yourCard m19) | 8.2% |
| sessions.js#s4 | «Il Giudizio è la carta di chi, quando sente una c…» (if yourCard m20) | 1.5% |
| sessions.js#s4 | «Il Mondo è la carta di chi ha voluto vedere tutto…» (if yourCard m21) | 8.7% |
| sessions.js#s4 | if yourCardIsBirth true | 6.6% |
| sessions.js#s4 | else of yourCardIsBirth true | 93.4% |
| sessions.js#s4 | if hasBirth true | 93.4% |
