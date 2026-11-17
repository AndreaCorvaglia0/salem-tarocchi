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

---

# Music and ambience (recorded sound)

Nobody has listened to any of this. Everything below was chosen from the sources' own descriptions
(instruments, tempo, mood) and checked with numbers only. The owner must judge by ear.

## What plays (src/sound/tracks.js, src/sound/beds.js)

- **Graver pieces** (`DARK` in tracks.js): hopes, wounded, darktimes, funeral, colorless (Kevin MacLeod, CC BY 4.0;
  piano + cello, piano + strings, strings, pipe organ, solo piano; 48-66 bpm; no drums, no voice, no synth pad).
- **Calm playlists** (village winter / spring / dawn, the forest before autumn, Malva's house and the cottage, the shop,
  the meeting room) are built with `weave(base)`: four of the usual pieces, then one dark one, 25 entries in all.
  The dark pieces are exactly 20% and never two in a row. The houses and the shop now alternate two pieces
  (consolation + gymnopedie) instead of one, so the same piece is not heard four times before a dark one.
- **Heavy playlists** (`heavy: true`; the cellars, the wood from chapter 3, the village in autumn before the trial):
  the dark pieces are the main colour (45-55%), interleaved with the old pieces (ancientrite, ossuary, ghoststory,
  moonlight, reverie, pavane); no piece twice in a row.
- Unchanged: title, session, reading, exam, ending, the silent court.
- **Forest**: the music is now 0.24 (calm) / 0.20 (autumn) before MASTER (was 0.56 / 0.46): about 8 dB lower.
- **Ambience bed** (`bedFor`, a third looping layer, `createBeds`): forest wind at level 1.0 (under the same
  MASTER 1.25), so the wood is ambience first. In the wood it follows her position, checked every two seconds:
  campfire clearing -> fire, mill / pond / spring -> stream, graveyard -> wind only. Malva and the cottage -> fire.
  Village: light wind (winter, spring), rain (autumn before the trial), a fainter wind at dawn. No bed in the court,
  the cellars, the shop, the meeting room, nor in sessions, readings, exams, the title and the ending.
- Same rules as the music: the music setting switches the bed off; cinema ducks it to 60%; it starts only after
  a tap (`gesture()` plays every bed element once, the idle one on `silence.wav`, like the music decks); hidden tab
  pauses it. `sound.status()` now also returns `track` and `bed`.

## Files (measured with ffmpeg loudnorm / ffprobe, after conversion)

| file | s | kbit/s | ch | KB | integrated LUFS | true peak dBTP |
|---|---|---|---|---|---|---|
| public/music/hopes.mp3 | 177.5 | 80 | 2 | 1733 | -24.47 | -6.33 |
| public/music/wounded.mp3 | 170.0 | 80 | 2 | 1660 | -24.44 | -10.16 |
| public/music/darktimes.mp3 | 182.0 | 80 | 2 | 1778 | -24.43 | -6.88 |
| public/music/funeral.mp3 | 162.2 | 80 | 2 | 1584 | -24.52 | -13.12 |
| public/music/colorless.mp3 | 158.0 | 80 | 2 | 1543 | -24.47 | -6.98 |
| public/music/moonlight.mp3 | 327.8 | 80 | 2 | 3201 | -24.27 | -6.60 |
| public/music/reverie.mp3 | 309.8 | 80 | 2 | 3025 | -24.17 | -5.76 |
| public/music/ghoststory.mp3 | 319.9 | 80 | 2 | 3130 | -28.66 | -11.53 |
| public/ambience/wind.mp3 | 30.6 | 64 | 1 | 239 | -34.02 | -9.56 |
| public/ambience/fire.mp3 | 24.5 | 64 | 1 | 191 | -34.00 | -8.58 |
| public/ambience/rain.mp3 | 43.5 | 64 | 1 | 340 | -34.01 | -16.69 |
| public/ambience/stream.mp3 | 17.9 | 64 | 1 | 140 | -33.99 | -16.88 |

The music matches the piano pieces (-24.2 / -24.3 LUFS) within 0.3 LU; the ambience is 10 LU under (-34).
`ghoststory` (existing, by the same author) is quieter than the rest (-28.7): left as it was.

## Not done / limits

- **Night forest (crickets, owl) is missing.** The two free Commons recordings that fit ("Nature sounds ambience in a
  Dordogne pond", CC BY 3.0; "Tawny owl calling at night", CC BY 4.0) were refused by the server with HTTP 429 on
  every try over about half an hour (other Commons files downloaded fine in the same period); I did not look for
  another way. The wood uses wind instead. Musopen.org answered 403 to a plain request, so no Musopen piece was added.
  When a night loop exists: put it in public/ambience, add it to `LOOPS` and to the forest line in `bedFor`.
- Fire is 24.5 s and the stream only 17.9 s (the sources are that long): the repeat of the stream can be noticed.
- Loops are seamless in the file (crossfaded tail into head). An mp3 played with `loop = true` may still leave a
  few ms of encoder gap at the join; with noise this should not be heard, but nobody has listened.
- The wind is a daytime breeze recording with a 1.1 kHz low-pass to drop the birds.
- Rebuild everything: `scripts/fetch-sound.sh` (needs curl, ffmpeg, python3 + numpy).

## Checked

`npm test` green; `npm run build`; `tests/sound.tracks.test.mjs` (every file named exists, dark share 15-25% and no two in a row in every calm playlist, heavy playlists interleaved, bed choices per place, the bed lower than the music except in the wood, beds obey the gesture and the music switch with fake elements).
Headless Chrome (390x844, `/?debug&skip=c2`, one tap): no audio errors, no failed requests; in the forest `ambience/wind.mp3` plays (not paused, currentTime advancing, loop = true) next to `music/reverie.mp3`; travelling to the campfire swaps it to `fire.mp3`, to the mill to `stream.mp3`, to the village to `wind.mp3` (the previous element is paused after the cross-fade). Not checked: the cottage/Malva fire in the browser (only in the unit test), a real phone, real audio output.
