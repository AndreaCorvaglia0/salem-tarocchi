# Sound area (src/sound): notes for the lead and the other areas

All sound is generated in code (Web Audio), no files. Nobody has listened to it yet: listen with `harness/sound.html`.

## For the lead
- `src/main.js`: add `import './sound/index.js';` (registers services and bus listeners; silent until the first tap or key).
- Start the title music: `call('sound.mood', 'title')` when the title opens (the default wanted mood is already `title`, so it plays on the first tap).
- The settings screen: `call('sound.music', bool)` and `call('sound.sfx', bool)` (they write `state.settings`, save, emit `settings`). Changing `state.settings` plus `emit('settings')` also works.
- `state.settings` is read live on every sound; the music cross-fades out when music is switched off.

## Already wired by the bus (nobody else has to call)
`card:found` -> found · `card:star` -> star · `level:up` -> level · `coins` (n > 0) -> coin · `cinema` true/false -> music ducks to 30% / back · `chapter` -> nothing.

## Calls to add (all return a Promise; ignore it)
| Where | Call |
|---|---|
| world: map change / `world.start` | `sound.mood('village' \| 'forest' \| 'depths')`. malva, cottage, court, meeting, shop interiors: keep the mood of the area outside, except `court` -> `depths` |
| world: door opened / map change by a door | `sound.play('door')` |
| world: player step (optional, only every ~2 tiles) | `sound.play('step')` |
| world: tall grass / glint near a card | nothing needed; `found` comes from the bus |
| world: constable spots the player | `sound.play('suspicion')`; on exam start the mood changes anyway |
| world: stun power used | `sound.play('stun')` · fire power: `sound.play('fire')` · cat power / Tartufo talks: `sound.play('cat')` |
| story: session start (`story.session`) | `sound.mood('session')`; session end: `sound.mood(<mood of the current map>)` |
| story: finale reading and ending | `sound.mood('ending')` |
| story: dark moments (arrest, the Judge, the cellars) | `sound.play('bell')` |
| story: dialogue box advance (tap) | `sound.play('tap')` |
| story: a card turned on the table (`{ turn }`) | `sound.play('card')` |
| exam start | `sound.mood('exam', { tension: 0 })`; every time suspicion changes: `sound.mood('exam', { tension: suspicion / max })` (same mood = no restart, just faster); exam end: back to the map's mood |
| exam: right / wrong answer | `sound.play('right')` / `sound.play('wrong')` |
| exam: caught (failed, going to jail) | `sound.play('caught')` |
| lock.ask: right / wrong | `right` / `wrong` · lock opens: `door` |
| reading.open / reading.free | `sound.mood('reading')`; at the end back to the map's mood; reading answers `right` / `wrong`; card flipped: `card` |
| draw.pick: card turned | `sound.play('card')` |
| review.open | `sound.mood('reading')` |
| grimoire: open / page turn / tab change | `sound.play('page')` |
| grimoire: writing the three words (card ceremony, diary) | `sound.play('write')` |
| grimoire / HUD buttons, shop buy | `sound.play('tap')` (buying: `coin` also comes from the bus only when coins grow) |
| title screen | `sound.mood('title')` |
| `sound.stop()` | fades the music out (effects still work); the next `sound.mood` restarts it |

Extra effect names: `purr` (a cat's purr), besides the required ones.

## Behaviour and limits
- Same effect twice within a short gap is dropped (tap 45 ms, step 200 ms, write 220 ms, others 60 ms).
- The audio pauses when the tab is hidden and resumes (with a fresh plan) when it is visible again.
- A rapid `sound.mood(...)` to the same mood only updates options. A new mood cross-fades for about 2 s; the old notes ring out.
- Music level is modest on purpose (master 0.8, music 0.9, pad/drone/notes in `engine.js` LEVELS); a compressor and a tanh soft clip stand at the end. Tune the numbers in `LEVELS` after listening on a phone speaker (low notes under ~150 Hz are weak there; the drone is helped by its saw harmonics).
- `harness/sound.js` "misura tutto" renders every mood (30 s) and effect offline and logs peak/RMS: `node scripts/shot.mjs http://127.0.0.1:5177/harness/sound.html /tmp/s.png --phone --steps harness/sound.steps.mjs`.
