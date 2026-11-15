# Cards area: notes for the others

Files: `src/data/cards.js` (+ `src/data/cards/majors-{a,b,c}.js`, `minors.js`), `spreads.js`, `lessons.js`, `questions.js`.

## Extras beyond the contract (all optional to use)
- Hotspots may carry `quiz: false`: ambiguous or generic (infinity sign, snow...). `makeQuestion` skips them; the card page can still show them.
- Minors also have `says` (= `core`), `details: []`, `confusables: []`; they have no `embody`, `ask`, `rumour`. Check before rendering.
- `src/data/cards.js` also exports `AS_KEYS` and `asFromGist`.
- Spreads: `cardW` (suggested card width, % of the layout rectangle), `modes`, `how`. The crossing card (celtic `cross`) has the same x y as `present` and `rot: 90`; draw it on top. Layout is meant for a portrait rectangle of about 390x560, celtic cards ~18% wide.
- `makeQuestion` accepts `spread` (for 'position') and `exclude` (card ids to avoid). Questions of kind 'position' also carry `spread` and `position` ids. `makeExam` accepts `rng` and `spread`.
- 'detail' questions: show `show.crop = { x, y, r }` (percent of the image, r as % of width) of `show.card`; never print the hotspot label, it gives the answer away.
- 'name' and 'detail' options are `{ t, ok }` with the card name; 'which' options are `{ card, ok }`; 'position' has `cardId: null`.
- `makeQuestion` without `kinds`: level 1 = name, meaning, which, detail; level 2 adds odd, order, astro; level 3 adds position.
- Gender: the `as.*` sentences avoid gendered adjectives, since they are said to clients.
