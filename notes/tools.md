# Tools: what the lore linter says

_Written by `node scripts/lore.mjs check`: do not edit by hand. What the rules mean: docs/TOOLS.md._

Errors: 0. Warnings: 16.

Links checked: 3977. Fact clauses checked: 211 names; 52 clauses not understood (not checked).
Continuity: 164 claims (who knows what), 49 placed on the main path and checked, 7 guarded by a test of the fact's flags, 116 not placeable (skipped), 0 violations.

## Errors

None.

## Warnings

### fatto.missing (14)

- `post.js#minor.dup`: flag "minor.dup" is set here and tested elsewhere, but no fatto names it
- `post.js#minor.first`: flag "minor.first" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.1.offer`: flag "minors.1.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.2.offer`: flag "minors.2.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.3.offer`: flag "minors.3.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.4.offer`: flag "minors.4.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.5.offer`: flag "minors.5.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#reversed.offer`: flag "reversed.offered" is set here and tested elsewhere, but no fatto names it
- `c0.js#p.road.again`: flag "seen.road" is set here and tested elsewhere, but no fatto names it
- `trials.js#trial.dare.door`: flag "trial.dare.offered" is set here and tested elsewhere, but no fatto names it
- `trials.js#trial.fog.door`: flag "trial.fog.offered" is set here and tested elsewhere, but no fatto names it
- `trials.js#trial.grave.door`: flag "trial.grave.offered" is set here and tested elsewhere, but no fatto names it
- `trials.js#trial.kettle.door`: flag "trial.kettle.offered" is set here and tested elsewhere, but no fatto names it
- `trials.js#trial.room.door`: flag "trial.room.offered" is set here and tested elsewhere, but no fatto names it

### fatto.scena (1)

- `fatti/cappello-in-soffitta.md`: scene "trials/hat.js#hat" not found in hat.js

### tipo (1)

- `inizio.md`: tipo "indice" has no row in lore/README.md, its fields are not checked
