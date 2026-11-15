# Wiring: stage, sound, story fixes

## Done
- Stage: sessions use `createStage`; cinema nodes go through `playTableau` (scene from the node or its `pan`),
  black bars (`story/cinema.js`) only when no scene fits. Dialogue box shows `cameo(who, 72|96)`; the Lettrice has none.
  Session nodes `{ symbol }` and `{ tableau }` exist; `{ empty }` is gone (s4 ends with `{ tableau: 'last' }`).
  Deleted: story/scene.js, table.js, hands.js, portraits.js, paint.js.
- Sound: services used: `sound.play`, `sound.mood`, plus two from `src/glue/mood.js`:
  `sound.back` (music of the current map: village+interiors, forest, depths+court) and `sound.hold(name|null)`
  (a session holds its mood so a reading/Exam inside it returns to it, not to the map).
  Settings toggles in the grimoire call `sound.music` / `sound.sfx`.
- Story: Malva, Ortica, Edera each have 3 trust options in mandatory scenes (tests/wiring.test.mjs); the dawn scene handles an
  already-flying player; the witches are no longer "vecchia" anywhere; Edera is introduced as a regal silver-haired woman.
- Card title: `show.hideName` in data/questions.js (name + detail questions); systems/qview.js `cardFace`/`liftName`;
  review front covered until "Mostrami"; `leaks()` keeps card names out of meaning options; constable/afflicted exams: 2 meaning : 1 which : 1 name.

## For the world agent (not done here)
- world should call `sound.mood` on `world.start` and map changes (and may use `call('sound.back')`), `door`, `step`, `suspicion`, `stun`, `fire`, `cat`.
- Minors' cores often name their own suit ("tre coppe cadute"): a 'meaning' question on a Minor can leak. Cards area could reword.

## Not checked
- Nobody listened to the sound. Smoothness of the stage on a real phone.
