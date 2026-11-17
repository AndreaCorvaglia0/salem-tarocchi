# L'orto: fonti dei consigli

Data: `src/data/garden.js`. Rules: `src/glue/garden.rules.js`. Checked 17 Nov 2026.

## Watering by touching the soil
- RHS, "Watering" (https://www.rhs.org.uk/garden-jobs/watering): "Use the touch test to check how damp the
  soil or compost is below the surface"; containers: "water when it's dry 2-3cm (1in) below the surface"
  (our «asciutta anche a un dito di profondità»); "water less often but more thoroughly – then let the surface
  dry before you water again" (our «asciutta sopra, umida sotto» as the moment for thirsty plants, and the
  lesson note `acqua`); "Avoid a routine such as 'watering once a week'" (why the screen shows no countdown);
  "apply water to the base of plants, not on the foliage".
- `every` in the data is only the model behind the soil's drying, never shown.

## Light and soil per herb
- RHS, "Herbs: growing" (https://www.rhs.org.uk/herbs/growing): rosemary "well-drained, ideally neutral to
  alkaline soil in full sun"; sage "well-drained to dry neutral to alkaline soils in full sun, sage dislikes
  damp conditions"; thyme "well-drained, even stony poor soils in sun"; mint "rich, moist soil in sun or part
  shade". Hence: Mediterranean aromatics `terra: 'leggera'`, `luce: 'sole'`; mint `fresca`, `mezzombra`
  with `anche: 'sole'`.
- RHS plant pages for Lavandula angustifolia (https://www.rhs.org.uk/plants/91398/wd/details): full sun,
  well-drained soil.
- The rest follows the herbarium's own `coltiva` texts (data/herbs/texts.js, already written from garden
  sources: see notes/herbs.md), and tests/garden.test.mjs keeps light and water in agreement with them.
  Lemon balm, valerian, nettle: moist soil (texts: «senza lasciar seccare», «ama la terra umida», «terra
  fresca e ricca»).

## Effects in the game, and how true they are
- A dry-lover in fresh soil stays wet twice as long: simplified, but the direction is right (waterlogging
  rots the roots of Mediterranean herbs; RHS on sage: "dislikes damp conditions").
- A thirsty plant in light, draining soil dries faster: true of sandy soils.
- Wrong light: sun-lovers in shade grow leggy and flower little; half-shade plants in full sun scorch and dry
  out. The game halves the pace (one good watering out of two counts).
- A transplant sets a plant back a little (transplant shock): one step.
- Lesson note `luce`: «almeno sei ore di sole diretto» is the usual definition of full sun (RHS uses "full
  sun" for at least six hours of direct sun in summer).
- Lesson note `terra`: mixing in coarse sand or grit for drainage is standard RHS advice for Mediterranean
  plants.

Not verified here: exact day counts (they are a model), the behaviour of each poisonous plant in cultivation
beyond the herbarium texts.
