# «Che ne pensi di lei?» (17 novembre): notes

Files: `src/data/story/opinions.js` (text), `src/glue/opinions.rules.js` (pure rules), `src/glue/opinions.js`
(play), `src/ui/people.js` (the page), `tests/opinions.test.mjs`. Spec: DESIGN.md, last section.

## Decisions that are not in the spec

- **The Reader is not one of the people.** Nobody in the scripts knows her (she is a candle only the player
  sees), so nobody can speak of her without contradicting the story. She only asks.
- **The widow Bray, Tobia and the other clients are left out.** They come once, in secret («noi due non ci
  siamo mai viste»): people talking about their visit would break that. The becchino and the child are one
  optional scene each: not enough to hang three ways of feeling on.
- **Villagers never ask.** Askers are the four witches and Tartufo. The shopkeeper only speaks (after the
  shop is closed). Tabita, Hale, the miller, the constable and the Judge are only spoken of.
- **Malva after chapter 1.** Her everyday chat (`malva.chat`) exists only in chapter 1, so a player who is
  further on could never hear her. `glue/opinions.js` puts her at her hearth from chapter 2 (cast id
  `malva.lesson`, after her lesson; not on the steps where the story has her elsewhere) with a one-line
  welcome, `malva.later` (three variants). Remove the `CAST.push` block there to undo it.
- **The Reader outside the visits.** Visits happen at five fixed points and need untold cards, so a player
  past the ending has none left. At the cottage bed, after the card of the day, the Reader and Tartufo take
  turns: «Appena chiudi gli occhi…», one question, her mirror, «Adesso dormi pure». Same one-a-day rule.
- **Tartufo's lines** come at the bed, or as an aside in parentheses after someone else's chat when that
  person has nothing to add (never about the person present).
- **Rhythm.** The first thing she ever gets is a line, not a question. A line needs two chats without one;
  a question needs a day without one (the Reader's count too). The bond moves only upward (+1, when the
  asker's own feeling `own` equals the `v` of her answer); for Tartufo it is one Tartufo point.
- **«Chi ti dà più fastidio?»** never offers the person she named as favourite, and vice versa.
- **No line genders her** (the task asked for it; the rest of the game says «sei arrivata»). So Edera never
  says «cara» here, which is her tic everywhere else: her lines may sound a little less like her.

## Lines I am not sure fit what the story shows (invented detail, plausible but not in the scripts)

- malva / bottegaio: «la sola cliente a cui non ho mai sbagliato il resto» (the scripts only say she checks the incense).
- malva / ginepra reply: Malva «mi ha ricucito un guanto senza dire niente»; voce: Malva fills her pockets with bread.
- ortica / malva: «quando una donna sta male davvero, è la prima che mando a chiamare».
- ortica / tartufo: Ortica «a me dà del voi».
- ortica / edera, edera / ortica: Ortica goes down to visit Edera (the scripts show them together only at the council).
- ortica reply (ortica on Ginepra): «una ragazza di Boston, quarant'anni fa».
- edera / ginepra (after the ending): Edera calls her «Ginevra» and «Giuditta».
- tartufo / edera: he climbs on her lap «soltanto quando ho freddo» (in the scripts he does it once, as a special answer).
- giudice / malva: he holds his grandchildren on his knees; giudice / ginepra: in the cell he asked her if she was
  cold (the route by the court door never shows him at the cells; the line stays vague on purpose).
- giudice / edera reply: «io quando ho cominciato a dirglielo sono arrivata tardi».
- conestabile / malva: «a quattro anni contava le uova nel pollaio», «da piccolo non dormiva senza il lume»;
  conestabile / bottegaio: he buys tobacco. There are several constables in the game: this person is the one of
  the first night in the square («Il conestabile della piazza»).
- bottegaio / malva: «di notte apre a chi bussa per bisogno»; reply: «nessuno che lo aspetti la sera»;
  bottegaio / ortica: he says she drives his customers away.
- tabita / bottegaio: she pays the lye in ironed shirts; tabita / tartufo question: she throws water at him.
- hale: if she was taken away (`b1.hid`) the epilogue says nothing more was heard of her. Ortica's line uses the
  past («vendeva»), Malva's says the stall is still empty; the question and its answers are the same in both
  branches and were written to hold in both. The Reader may offer Hale among the people for «chi ti dà più
  fastidio?» only when nobody else is left (she is last in LEAST_FIRST).
- mugnaio / ginepra: that he tells everybody about the willow (in the scripts he tells her).
- malva.later, after the ending: Malva at her hearth although the story ends with the flight from Salem (the
  open world after the ending already lets her walk there).
- The Reader's two pick mirrors state a general idea («negli altri ci piace quello che vorremmo saper fare»):
  WRITING.md rule 3 is wary of maxims; the spec asked for exactly this thought. Worth a read aloud.
- Event `sonoio`: on the route where she said «Sì, sono io» herself first, Ginepra still steps in: the question holds.
- Event `stopped`: the question does not say whether she passed, so it holds for both outcomes.

## Seen in passing, not touched

- `glue/bonds.js` (the popularity line of Malva/Ginepra on `talk`) looks up the FIRST cast entry with that id,
  which for `malva` is the trapdoor scene: `movesStory` is true and her line is never said.
- After the Reader's question at the bed, the flying-lesson offer (glue/lessons.js) can queue right behind it.
