# Hi-res card images (card of the day only)

- `public/cards-hi/<id>.webp`: 700x1200, WEBP q60, all 78 cards (~10.7 MB; q82 would be 17 MB).
- Source: Wikimedia Commons public-domain RWS 1909 scans (`RWS Tarot NN Name.jpg`, `WandsNN.jpg`, `CupsNN.jpg`, `SwordsNN.jpg`, `PentsNN.jpg`), width=900.
- The current `public/cards/*.webp` are the 1971 recoloured scan, the Commons ones are the aged 1909 scan: same line art, different tones (new look duller/paler, paper grain). Framing is matched by edge-map alignment, so `src/data/daily/visual.js` percentages still hold.
- Regenerate: `python3 -I scripts/fetch-cards-hi.py` (sequential downloads, 4 s apart; `--no-download` to reuse the cache in /tmp/rws-hi-cache; `--resave --quality N` to re-encode only). Report with per-card alignment: `scripts/cards-hi-report.json`.
- `src/ui/daycard.js`: `HI` set lists the ids with a hi-res file; small image first, swapped on load. Empty the set to switch off.
