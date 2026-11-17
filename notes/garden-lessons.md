# Le lezioni di Ortica: sources, one line per fact

Scenes: `src/data/story/scripts/garden-lessons.js`. Notes under the beds: `src/data/garden.js` `LESSON_NOTES`.
Chain: `src/glue/garden.js` (flags `garden.lesson.<key>.open`, `garden.lesson.<key>`, `garden.lesson.day`),
pure rules `nextLesson`, `rareSeed`, `lessonEntries` in `src/glue/garden.rules.js`. Checked 17 Nov 2026.

Sources (short names used below):
- RHS-W   https://www.rhs.org.uk/garden-jobs/watering
- RHS-H   https://www.rhs.org.uk/herbs/growing
- RHS-L   https://www.rhs.org.uk/advice/profile?pid=127 (lavender)
- RHS-SH  https://www.rhs.org.uk/garden-design/shade-gardening
- RHS-C   https://www.rhs.org.uk/container-gardening/growing-plants-in-containers
- RHS-R   https://rhs.org.uk/container-gardening/how-to-repot-a-plant
- RHS-SR  https://www.rhs.org.uk/propagation/semi-ripe-cuttings
- RHS-SW  https://rhs.org.uk/propagation/softwood-cuttings
- RHS-PH  https://www.rhs.org.uk/propagation/propagating-herbs
- RHS-SG  https://www.rhs.org.uk/herbs/sage/grow-your-own
- RHS-M   https://www.rhs.org.uk/herbs/mint/grow-your-own
- RHS-LB  https://www.rhs.org.uk/herbs/lemon-balm/grow-your-own
- RHS-SI  https://www.rhs.org.uk/advice/how-to-sow-seed-indoors
- RHS-HP  https://www.rhs.org.uk/plants/types/houseplants/how-to-help-a-poorly-houseplant
- ISU-P   https://yardandgarden.extension.iastate.edu/how-to/diagnosing-houseplant-problems-related-poor-culture
- ISU-H   https://yardandgarden.extension.iastate.edu/how-to/growing-herbs-indoors
- ISU-S   https://yardandgarden.extension.iastate.edu/faq/i-would-grow-few-vegetables-containers-can-i-use-garden-soil-or-should-i-purchase-commercial
- UIL-D   https://extension.illinois.edu/container-gardens/container-drainage-options

## 1. L'acqua
- A finger in the soil, not a calendar: RHS-W (touch test below the surface; containers when dry 2-3 cm down; avoid a fixed routine).
- Too much water wilts a plant like thirst does, because wet roots rot: ISU-P (overwatering leads to wilting and to more watering; roots in wet soil develop root rot); RHS-HP (easy to mistake for lack of water).
- Empty the saucer: UIL-D (empty the excess water); ISU-P (never left sitting in saucers full of water).
- Water slowly and thoroughly until it runs from the hole, then let it dry: RHS-W (less often but more thoroughly, then let the surface dry); RHS-R (water until it comes out of the drainage holes).
- A little every day keeps roots shallow, deep watering sends them down: RHS-W.
- Water the soil at the base, wet leaves get diseases: RHS-W (base not foliage, avoids fungal diseases).
- Early morning best, evening acceptable, not in the heat of the day (much evaporates): RHS-W.

## 2. La luce
- Long weak pale growth and few flowers mean too little light: RHS-HP (weak, spindly growth, pale leaves, poor flowering; leggy growth).
- Rosemary is cut back after flowering to grow bushy: RHS-H.
- Full sun: more than six hours of direct sun at midsummer; partial shade: three to six; below that, shade: RHS-SH (moderate shade two to three hours, deep shade under two).
- South window best, east or west also good: ISU-H. That east and west get about half a day and north almost none is the sun's path at our latitude, not a quoted horticultural page.
- Rosemary, lavender, thyme, sage want full sun: RHS-H, RHS-L, RHS-SG. Mint and lemon balm take partial shade: RHS-M, RHS-LB.

## 3. La terra
- The pot must have a hole: RHS-C (essential), UIL-D (critical).
- Garden soil in a pot compacts, drains badly, shrinks from the walls when dry and is hard to water: ISU-S.
- Stones at the bottom do not help drainage, the soil above stays saturated: UIL-D (a myth). So the lesson teaches the MIX, and the wrong answer is the layer.
- One part of grit in three of compost (up to 25% by volume) for lavender and sage: RHS-L, RHS-SG.
- Lavender likes poor, dry soil: RHS-L. Thyme stony poor soil, rosemary and sage well-drained: RHS-H.
- Basil rich light soil, parsley rich soil, mint rich moist soil: RHS-H.
- Pots raised on feet keep the hole clear: RHS-C.

## 4. Il vaso
- Repot when roots spiral round the bottom or come out of the holes; such a mass can stop water draining: RHS-R.
- Mint spreads by underground stems, so it is kept in its own pot; repotted every few years: RHS-M, RHS-H.
- New pot only slightly larger, no more than a third; in too large a pot the spare compost stays waterlogged: RHS-R, RHS-C.
- Repot in spring: RHS-R.
- Unglazed terracotta dries faster than plastic: RHS-C.
- Lavender: trim every year just after flowering, never into the woody stems, which seldom reshoot: RHS-L.
- Sage: remove spent flower stems in late summer, light prune in spring, hard pruning into bare wood is risky: RHS-SG.
- Basil: pinch out the tips for bushiness: RHS-H; cut just above a pair of leaves: ISU-H. Mint: regular picking keeps it bushy: RHS-M.

## 5. Semina e talea
- Sow thinly, cover no deeper than the seed itself: RHS-SI. Fine seed on the surface, pressed in, because many need light: RHS members' germination guide (https://rhs.org.uk/membership/rhs-members-seed-scheme/germination-guide), RHS-LB.
- Compost never dry and never saturated; prick out when large enough to handle: RHS-SI.
- Cuttings: non-flowering shoots root more readily; this year's growth, base firming and tip still soft: RHS-SW, RHS-SR.
- About a finger long (5-10 cm softwood), lower leaves off, cut just below a node: RHS-SW. Half compost and half sharp sand: RHS-SR. Light but no direct sun, kept moist: RHS-SW, RHS-SR.
- Soft cuttings in spring, rooted in a few weeks (2 to 4): RHS-SW. Semi-ripe in late summer for rosemary, lavender, sage: RHS-SR, RHS-PH.
- Mint roots in a glass of water: RHS-M.

## The three older notes, checked
- `acqua`: unchanged (RHS-W).
- `luce`: «almeno sei ore» -> «più di sei ore» (RHS-SH); «fanno meno profumo» removed (not confirmed) -> «deboli e pallidi e fioriscono poco» (RHS-HP).
- `terra`: now gives the proportion, a quarter of grit or coarse sand (RHS-L, RHS-SG).

## Left out because not confirmed, or changed
- «More plants die of too much water than too little»: the sources only say overwatering is a common cause. The lesson says what is confirmed: it wilts like thirst.
- «Sow at twice the seed's size»: RHS-SI says no more than the depth of the seed; the lesson follows it.
- A drainage LAYER at the bottom of the pot: contradicted (UIL-D). Only the mix is taught.
- Thinning in the open ground: only pricking out into small pots is taught (RHS-SI).
- Pruning sage «after flowering»: RHS-SG gives spent stems in late summer and the trim in spring; the lesson says that.
- Pinching lemon balm: not found; only mint and basil are named.
- Less scent in poor light: not confirmed. NOTE: `lightWhy` in `garden.rules.js` still says «fa meno profumo» (outside this task's files).
- Not fetched (permission not answered): extension.umn.edu pages on indoor light and seed starting.

## Not horticulture
- The seed after the last lesson is one of the herbarium's poisonous plants (`rareSeed`); Ortica's last line (cover lightly, keep moist, gloves) is general sowing advice, not checked for each of those five species.
