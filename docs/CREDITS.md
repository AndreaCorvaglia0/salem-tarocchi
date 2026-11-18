# Credits

## Music

Piano and chamber recordings from [Musopen](https://musopen.org/), public domain (CC0), taken from the
open repository `juan-medina/chromonia` and re-encoded to mp3 (80 kbit/s, loudness evened out).
Which piece plays where, how loud and how it fades: `src/sound/tracks.js` (`cueFor`). The court is silent.

| Where it plays | Piece | Composer | Performer |
|---|---|---|---|
| Title | Gymnopédie No. 1 | Erik Satie | Edward Rosser |
| Village in winter and autumn | Piano Sonata No. 14 "Moonlight", I. Adagio sostenuto | Ludwig van Beethoven | Paul Pitman |
| Forest | Rêverie | Claude Debussy | Simone Renzi |
| Underground | Pavane pour une infante défunte | Maurice Ravel | Thérèse Dussaut |
| The Reader | Goldberg Variations BWV 988, Aria | Johann Sebastian Bach | Shelley Kat |
| Exams | Élégie for Cello and Piano, Op. 24 | Gabriel Fauré | Isabella Stewart Gardner Museum |
| Readings | Suite bergamasque, III. Clair de lune | Claude Debussy | Simone Renzi |
| Ending | Nocturne in E-flat major, Op. 9 No. 2 | Frédéric Chopin | Aya Higuchi |
| Home (Malva's house, the cottage) | Consolation No. 3 in D-flat major | Franz Liszt | Sam Chan |
| Village in spring | The Carnival of the Animals, XIII. The Swan | Camille Saint-Saëns | see Musopen |
| Village after the ending | Orchestral Suite No. 3, Air ("on the G string") | Johann Sebastian Bach | see Musopen |

Darker pieces that take turns with the piano: "Ghost Story", "Ancient Rite" and "Ossuary 6 – Air" by Kevin MacLeod
(incompetech.com), licensed under Creative Commons Attribution 4.0.

Sound effects are generated in code (`src/sound/`).

### Graver pieces (added later)

Five more pieces by Kevin MacLeod ([incompetech.com](https://incompetech.com/)), licensed under Creative Commons
Attribution 4.0 ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)). Cut to about three minutes, loudness
evened out, faded in and out (`scripts/fetch-sound.sh`). They take turns with the others: one in five in the calm
places, most of what plays in the cellars, the wood in autumn and the village before the trial.

| File | Title | Author | Source | Licence |
|---|---|---|---|---|
| `public/music/hopes.mp3` | "SCP-x6x (Hopes)" | Kevin MacLeod | https://incompetech.com/music/royalty-free/mp3-royaltyfree/SCP-x6x.mp3 | CC BY 4.0 |
| `public/music/wounded.mp3` | "Wounded" | Kevin MacLeod | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wounded.mp3 | CC BY 4.0 |
| `public/music/darktimes.mp3` | "Dark Times" | Kevin MacLeod | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dark%20Times.mp3 | CC BY 4.0 |
| `public/music/funeral.mp3` | "Music for Funeral Home - Part 11" | Kevin MacLeod | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Music%20for%20Funeral%20Home%20-%20Part%2011.mp3 | CC BY 4.0 |
| `public/music/colorless.mp3` | "Colorless Aura" | Kevin MacLeod | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Colorless%20Aura.mp3 | CC BY 4.0 |

"SCP-x6x (Hopes)", "Wounded", "Dark Times", "Music for Funeral Home - Part 11" and "Colorless Aura" by Kevin MacLeod
(incompetech.com), licensed under Creative Commons Attribution 4.0.

## Ambience

Real recordings from [Wikimedia Commons](https://commons.wikimedia.org/), all public domain, made into short
seamless mono loops (`scripts/fetch-sound.sh`; high-pass, crossfaded ends, about 10 LU under the music). They play
under the music, chosen by place (`src/sound/beds.js`).

| File | Title (Commons file) | Author | Source | Licence |
|---|---|---|---|---|
| `public/ambience/fire.mp3` | "Dry grass burning in open fireplace" | ezwa | https://commons.wikimedia.org/wiki/File:Dry_grass_burning_in_open_fireplace.ogg | Public domain |
| `public/ambience/rain.mp3` | "Rain (1)" | ezwa | https://commons.wikimedia.org/wiki/File:Rain_(1).ogg | Public domain |
| `public/ambience/stream.mp3` | "Flowing-water-100019" | see the file page | https://commons.wikimedia.org/wiki/File:Flowing-water-100019.ogg | Public domain |
| `public/ambience/wind.mp3` | "Gentle breeze and birds singing" (low-passed: the birds are filtered out, the wind stays) | ezwa | https://commons.wikimedia.org/wiki/File:Gentle_breeze_and_birds_singing.ogg | Public domain |

## The smoke rite (`public/rite/`, notes/rito/musica.md)

Music: pieces by Kevin MacLeod ([incompetech.com](https://incompetech.com/)), licensed under Creative Commons
Attribution 4.0 ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)), fetched from
`https://incompetech.com/music/royalty-free/mp3-royaltyfree/<file>` (`scripts/audio/fetch-rite.sh`), cut after the
leading silence, loudness evened out to -24 LUFS, faded (`scripts/audio/encode-rite.sh`). None of them plays
anywhere else in the game. The airs' pieces are provisional until the blind listening test.

| File | Title | Author | Licence | Use |
|---|---|---|---|---|
| `public/rite/music/rosa.mp3` | "Reawakening" | Kevin MacLeod | CC BY 4.0 | the rose (provisional) |
| `public/rite/music/alloro.mp3` | "Errigal" | Kevin MacLeod | CC BY 4.0 | the laurel (provisional) |
| `public/rite/music/cipresso.mp3` | "Heart of Nowhere" | Kevin MacLeod | CC BY 4.0 | the cypress (provisional) |
| `public/rite/music/salvia.mp3` | "Fairytale Waltz" | Kevin MacLeod | CC BY 4.0 | the sage (provisional) |
| `public/rite/music/mirra.mp3` | "Mourning Song" | Kevin MacLeod | CC BY 4.0 | the myrrh (provisional) |
| `public/rite/cand/*.mp3` (13 clips of 20 s) | "Reawakening", "Simple Duet", "Water Lily", "Errigal", "Somewhere Sunny (ver 2)", "Cello Suite 1 in G - Prelude", "Heart of Nowhere", "Night Vigil", "Fairytale Waltz", "Wizardtorium", "Mourning Song", "Plaint", "Virtutes Instrumenti" | Kevin MacLeod | CC BY 4.0 | the blind listening page (`<site>/ascolto/`); which clip is which: `scripts/audio/ascolto-key.json` |

"Reawakening", "Simple Duet", "Water Lily", "Errigal", "Somewhere Sunny (ver 2)", "Cello Suite 1 in G - Prelude",
"Heart of Nowhere", "Night Vigil", "Fairytale Waltz", "Wizardtorium", "Mourning Song", "Plaint" and "Virtutes
Instrumenti" by Kevin MacLeod (incompetech.com), licensed under Creative Commons Attribution 4.0.

Single notes and the opening stroke: recordings of the University of Iowa Electronic Music Studios
([theremin.music.uiowa.edu/MIS.html](https://theremin.music.uiowa.edu/MIS.html)), which "may be downloaded and used
for any projects, without restrictions". One note cut from each run, pitch-checked and tuned onto the note when more
than 12 cents off, -20 LUFS (`scripts/audio/notes.py`).

| File | Instrument, note | Iowa file |
|---|---|---|
| `public/rite/notes/knock.mp3` | Thai gong, D4 (the opening motif; tuned 56 cents down) | `Percussion/gongs & tamtams/thaigongs/thaigong.D4.mf.aif` |
| `public/rite/notes/rosa.mp3` | cello arco, A3 | `Strings/cello/Cello.arco.mf.sulD.D3B3.aiff` |
| `public/rite/notes/alloro.mp3` | guitar, D4 | `Piano_Other/guitar/Guitar.mf.sulA.C4E4.mono.aif` |
| `public/rite/notes/cipresso.mp3` | double bass arco, D2 | `Strings/doublebass/Bass.arco.mf.sulD.D2B2.aiff` |
| `public/rite/notes/salvia.mp3` | crotale, A6 | `Percussion/crotales/crotale.A6.pp.aif` |
| `public/rite/notes/mirra.mp3` | alto flute, E4 | `Woodwinds/altoflute/AltoFlute.mf.C4B4.aiff` |

## Cards

Rider-Waite-Smith deck, scans from the open dataset `metabismuth/tarot-json`. See `docs/RESEARCH.md`.

## Tavole botaniche dell'erbario

Da Wikimedia Commons, opere di pubblico dominio:
- *Köhler's Medizinal-Pflanzen in naturgetreuen Abbildungen*, Gera, 1887 (file `Koeh-NNN.jpg`): tutte le piante tranne ortica e verbena.
- Otto Wilhelm Thomé, *Flora von Deutschland, Österreich und der Schweiz*, Gera, 1885 (file `Illustration Urtica dioica0.jpg`, `Illustration Verbena officinalis0.jpg`): ortica e verbena.

## Le pietre (`public/stones/`, 18 novembre)

- Henry Sowerby, *Popular Mineralogy*, London, Reeve, 1850, tavole litografate e colorate a mano. Copia della
  Wellcome Collection (https://wellcomecollection.org/works/z6yvxatb, IIIF `b33028126`), segnata **Public Domain
  Mark**. Ritagliate e ridotte (450x600, webp): tav. I (cristallo di rocca, ametista, agata), tav. II
  (lapislazzuli), tav. VI (tormalina).
- J. G. Kurr, *The Mineral Kingdom* (trad. di *Das Mineralreich in Bildern*), Edimburgo, Edmonston and Douglas, 1859,
  incisioni colorate a mano. Copia della Smithsonian Libraries (Biodiversity Heritage Library), su Internet Archive:
  https://archive.org/details/mineralkingdom00kurr (leaf 95 = tav. III; BHL: «Public domain. The BHL considers that this
  work is no longer under copyright protection»). Ritagliato e ridotto (450x600, webp, carta riportata al tono delle
  tavole Sowerby): fig. 13 della tav. III, eliotropio (*Heliotrope... from the Southern Tyrol*) -> `eliotropio.webp`.
  La didascalia di Kurr dice proprio «Heliotrope, polished, from the Southern Tyrol».
- Sei pietre non hanno una tavola antica e hanno un disegno nostro (`drawn: true`, didascalia «Disegnata da me, sul
  modello delle tavole antiche»): quarzo giallo, pietra di luna, pietra forata, occhio di tigre, ossidiana, quarzo rosa.
  Sono generate al computer (carta, luce da sinistra in alto, ombre morbide, contorno a penna, colori del minerale)
  con `scripts/stones-paint.py` e `scripts/stones-holed.py` (numpy + PIL): `python3 -I scripts/stones-paint.py
  public/stones`, `python3 -I scripts/stones-holed.py public/stones/pietra-forata.webp`. Nessuna fonte esterna.
  Una vera tavola antica per queste non c'è (cercata, vedi sotto).
- Cercate e non usate: Mawe, *Treatise on Diamonds* (1813/1815 e 1823, coloured plates): solo diamanti grezzi, tagli
  e un foglio di colori di gemme, nessuna delle nostre pietre. Blum, *Taschenbuch der Edelsteinkunde* (1834): nessuna
  tavola. *Popular Mineralogy* ha solo sei tavole (24 minerali): I-II-VI usate, III (asbesto, actinolite,
  corindone, topazio), IV (serpentino, berillo, zircone, smeraldo) e V (mica, apofillite, feldspato rosso, talco) non
  hanno nessuna delle nostre pietre. James Sowerby, *Exotic Mineralogy* (1811-17): solo il «Cat's-eye Quartz» (tab. LXIII,
  quarzo sericeo grigioverde di Ceylon: non è l'occhio di tigre, quindi no) e il «Blue Feldspar»; *British Mineralogy*
  (1802-17): «Pitchstone» (non è ossidiana) e ciottoli di selce senza buco. Kurr, tav. VI: l'adularia (pietra di luna)
  è solo un disegno al tratto, senza colore, e la fig. 3 di tav. III (quarzo rosa) è un cristallino di 70 px: troppo
  piccolo. Il citrino in Kurr non ha figura.
- Siti che hanno rifiutato: Biodiversity Heritage Library e Wellcome (403, prima), Wikimedia Commons (429 oggi: non si è
  più chiesto niente), c82.net (nessun permesso in tempo). Su pdimagearchive.org / Public Domain Review ci sono 68
  tavole ritagliate, ma nessuna delle nostre pietre tranne agata e quarzo (cristallo druso).

## La sibilla dell'ambulante (`public/sibyl/`, 18 novembre)

- «Wahrsagekarten der berühmten Kartenlegerin Lenormand», Paris, Ch. Didot, [1890?], 36 carte in cromolitografia.
  Yale University, Beinecke Rare Book and Manuscript Library, Cary Collection of Playing Cards,
  https://collections.library.yale.edu/catalog/10994633. Stampa anonima di circa il 1890, quindi di pubblico
  dominio; la scheda porta solo la formula generica di Yale («may be subject to copyright law»), non una licenza.
  Ritagliate dai quattro fogli della digitalizzazione; 600 px di larghezza (`NN.webp`) e 200 px (`t/NN.webp`).
  Nel gioco il nome storico del mazzo non compare mai.

## I libri dello scaffale (`public/books/`, 18 novembre)

Figure ritagliate dalle scansioni, ridotte a 720 px sul lato lungo, webp. Ogni libro ha anche una piccola
copertina (`t.webp`, 160 px) per il volo nel grimorio. Le pagine dei libri dicono le stesse cose nell'ultima
pagina, «Che cosa è vero». Prese una richiesta alla volta, con pause; la Wellcome ha risposto 403 a una richiesta
di ritaglio ad alta risoluzione (IIIF `pct:`) e da lì non le si è chiesto più niente.

| Cartella | Libro | Da dove | Licenza |
|---|---|---|---|
| `durante/` | Castore Durante, *Herbario nuovo*, Roma, Bonfadino e Diani, 1585: frontespizio, p. 47, 230, 231, 396, 402, 408, ultima pagina dell'indice | Wellcome Collection, https://wellcomecollection.org/works?query=b33552642 (IIIF `b33552642`, immagini 9, 79, 252, 253, 416, 422, 428, 519) | Public Domain Mark |
| `agrippa/` | H. C. Agrippa, *Three Books of Occult Philosophy*, Londra, R.W. per Gregory Moule, 1651 (la copia non ha il frontespizio): «To the Reader», lettera a Tritemio, p. 53, 54, 55, 58, 88, 279 | Wellcome Collection, https://wellcomecollection.org/works/ftahuupv (IIIF `b30335231`, immagini 9, 12, 15, 73, 74, 75, 78, 108, 287) | Public Domain Mark |
| `artemidoro/1` | Artemidoro, *Dell'interpretatione de' sogni*, trad. Pietro Lauro, Venezia, Giolito, 1547: frontespizio | Internet Archive, https://archive.org/details/artemidoro-interpretatione-de-sogni (scansione Google, caricata da un utente; nessuna licenza dichiarata) | opera di pubblico dominio; la scansione non dichiara licenza |
| `artemidoro/2-8` | *Hypnerotomachia Poliphili*, Venezia, Aldo, 1499: xilografie n. 1, 2, 3, 4, 16, 36, 38, dal facsimile *The dream of Poliphilus* (Londra, 1888) | Wellcome Collection, IIIF `b21781059`, immagini 21, 23, 35, 57 | Public Domain Mark |
| `scot/` | Reginald Scot, *The Discovery of Witchcraft*, terza edizione, Londra, A. Clark, 1665: frontespizio, tavole di p. 200-201 | Internet Archive, https://archive.org/details/discoveryofwitch00scot (copia del Boston College, foglio 6, 221, 222) | opera di pubblico dominio; la scansione non dichiara licenza |
| `voynich/` | Manoscritto «Voynich», Beinecke MS 408, ca. 1404-1438: ff. 1r, 2r, 9v, 33v, 67r, 70v, 75r, 88r, 116v | Yale University Library, https://collections.library.yale.edu/catalog/2002046 (IIIF) | manoscritto medievale, pubblico dominio; la scheda porta solo la formula generica di Yale, come per la sibilla |

Da controllare: l'anno del facsimile della *Hypnerotomachia* (1888) è scritto a memoria; la scheda Wellcome dice solo
«fac-similes of one hundred and sixty-eight woodcuts... with an introductory notice by J.W. Appell».
