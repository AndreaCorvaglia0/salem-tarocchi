# Tools: what the lore linter says

_Written by `node scripts/lore.mjs check`: do not edit by hand. What the rules mean: docs/TOOLS.md._

Errors: 0. Warnings: 11.

Links checked: 3235. Fact clauses checked: 201 names; 51 clauses not understood (not checked).
Continuity: 160 claims (who knows what), 49 placed on the main path and checked, 7 guarded by a test of the fact's flags, 112 not placeable (skipped), 0 violations.

## Errors

None.

## Warnings

### fatto.missing (9)

- `post.js#minor.dup`: flag "minor.dup" is set here and tested elsewhere, but no fatto names it
- `post.js#minor.first`: flag "minor.first" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.1.offer`: flag "minors.1.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.2.offer`: flag "minors.2.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.3.offer`: flag "minors.3.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.4.offer`: flag "minors.4.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#minors.5.offer`: flag "minors.5.offered" is set here and tested elsewhere, but no fatto names it
- `lessons.js#reversed.offer`: flag "reversed.offered" is set here and tested elsewhere, but no fatto names it
- `c0.js#p.road.again`: flag "seen.road" is set here and tested elsewhere, but no fatto names it

### fatto.scena (1)

- `fatti/cappello-in-soffitta.md`: scene "trials/hat.js#hat" not found in hat.js

### tipo (1)

- `inizio.md`: tipo "indice" has no row in lore/README.md, its fields are not checked
