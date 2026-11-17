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

## Cards

Rider-Waite-Smith deck, scans from the open dataset `metabismuth/tarot-json`. See `docs/RESEARCH.md`.

## Tavole botaniche dell'erbario

Da Wikimedia Commons, opere di pubblico dominio:
- *Köhler's Medizinal-Pflanzen in naturgetreuen Abbildungen*, Gera, 1887 (file `Koeh-NNN.jpg`): tutte le piante tranne ortica e verbena.
- Otto Wilhelm Thomé, *Flora von Deutschland, Österreich und der Schweiz*, Gera, 1885 (file `Illustration Urtica dioica0.jpg`, `Illustration Verbena officinalis0.jpg`): ortica e verbena.
