# The real trials: content (16 Nov, evening)

Data: `src/data/trials/main.js` (3), `side.js` (6), `intro.js` (library.first), `witches.js` (16 sentences),
`index.js` (list: mains first, then the side chain). Scenes: `src/data/story/scripts/trials.js`
(`trial.<id>.door`). Tests: `tests/trials.content.test.mjs` (10). Shots: /home/claude/shots-trials2/.

## The nine trials
| id | starts at | with | study | forks | prize (perfect) | fail |
|---|---|---|---|---|---|---|
| night (main, ch1) | village.lane | Malva | sign, m00, m07 | segno, idea(cards), escape, idea(moto), segno | il lume cieco di Malva, 2 incense, bond | 6 coins, incense, bond |
| fog (main, ch2) | forest.pond | Ortica | sign, m10, m08 | idea(cards), quesito(moto), segno, quesito(suit) | il fischietto d'osso di Ortica, 2 incense, bond | 5 coins, a tool, bond |
| cellars (main, ch3) | depths.cellar | Edera | reversed, sign, court, m15 | quesito(rev), idea(moto), quesito(court/Major rev), escape, segno | la chiave della cantina grande, 3 incense, bond | 8 coins, bond, a Minor to the deposit |
| vigil | village.upper | Malva | sign, m00, m07 | segno, idea(cards), idea(moto), segno | il cucchiaio d'argento di Malva, 15 coins, incense, bond | 4 coins, incense, bond |
| well | village.well | Tartufo alone | sign, m00, m03 | segno, idea(cards), idea(moto) | il sonaglio d'argento, 6 coins | 5 coins, a tool |
| kettle | forest.boundary | Ortica | sign, m00, m08 | idea(cards), quesito(moto), segno, quesito(favore) | il coperchio con la faccia, 12 coins, bond | 5 coins, bond |
| grave | forest.entry | the widow Bray | sign, m09, m13 | segno, quesito(moto), idea(cards), segno | la bussola di Josiah Bray, 8 coins | 4 coins, a tool |
| room | depths.entry | Edera | sign, m02, m13 | segno, idea(cards), quesito(favore), idea(moto) | il pendolo della nonna di Edera (pendulum), bond | 4 coins, a tool, bond |
| dare | forest.den | Ginepra | sign, m07, m18 | segno, idea(cards), quesito(favore), quesito(moto) | il cappello di Ginepra, 15 coins, bond | 8 coins, bond |

Availability (all in `when`, by what she has; `after` + the same chain written as flags in `when`, because the
door in the world reads only `when`): night `exam1.done` + 6 Majors; fog chapter >= 2, spread ppf, 9 Majors,
night played; cellars chapter >= 3, `lesson.reversed`, fog played. Sides: vigil `exam1.done` + 5 Majors ->
well (cat, 6 Majors) -> kettle (chapter >= 2, ppf) -> grave (chapter >= 2, `client.c1.widow.done`, 8 Majors) ->
room (chapter >= 3, celtic) -> dare (`ending.seen`). A side one opens when the one before is passed.

## How a trial is met
The door is a prop at `start.at` (CAST entry pushed by scripts/trials.js, same id as the glue's so it wins).
First tap: the opening scene (why, one choice with special answers by trait / trust / pop / tartufo, what to
study -> `trial.sense`, diary, flag `trial.<id>.offered`). Second tap: the trial; then a diary line by outcome
(`trial.<id>.<outcome>.told`). After a failed side trial the witch remembers it before starting again.
Prizes are `item` flags (`item.<the name>`): written in the diary, remembered by Tartufo's idle barks and by
the same witch in the opening of her other trial.

## Rules I kept
- Wrong rooms never say which wrong way she took; good rooms never say which was right.
- Idea forks that list `cards` also ask `rev: false` (a reversed card has another idea).
- Quesito `by` is one of suit, favore, moto, arcana (see below).

## The engine lacked / bugs
- `propertyLine(face, 'group')` throws on a Major (`face.group` is null): never use `by: 'group'` with Majors
  in the pool. There is no `by: 'rev'`: the cellars' first rule says "Era un Arcano Maggiore, rovesciata".
- Trial `choice` steps have no `when`: special answers are in the opening scenes instead.
- No inventory or names for `item`: the end screen prints the id, so ids are Italian names with spaces.
- No hats, no "special incense": prizes of that kind are item flags or more of the one incense.
- `majorsMin` (core/cond.js) reads the live state, not the state passed to `test`.
- glue's own door ignores `after` (hence the chain in `when`), and nothing shows hints `trial`, `library`,
  `escape` (added to hints.js).
- `saidLine` for an idea fork quotes the option text in full: long options make a long feedback line.

## Edits outside my files
- `src/data/story/index.js`: import + spread of `TRIAL_SCRIPTS` (2 lines). No other story script touched.

## Not verified
A real phone, audio, the escape played by hand; in the browser only night, fog (first build), vigil (through
its door) and cellars (fail) were played; well, kettle, grave, room, dare only by the tests' fake player.
The widow as `who` of a witchDraw ('La vedova Bray', not in PEOPLE) was not looked at.
`tests/world.*` "every block kind has art: skydoor" failed once during my runs: another agent's file.
