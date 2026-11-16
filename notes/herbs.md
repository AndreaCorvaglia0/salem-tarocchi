# Herbarium texts: notes for the others

Files: `src/data/herbs/texts.js` (`HERB_TEXTS`, one page per id of `HERB_LIST`), `tests/herbs.data.test.mjs`.

## Shape and rules
- Per plant: `riconosci`, `tradizione`, `usi`, `vero`, `coltiva { luce, acqua, quando, nota }`, `pianeta`, `elemento`, `curiosita`.
- `tradizione` is always framed as belief, `usi` as history, `vero` as present knowledge. No doses, no preparations, no advice to treat anything.
- The five `velenosa` plants say in `vero` that the whole plant is poisonous and not to be tasted, and carry gloves/children/pets in `coltiva.nota` (the test checks both).
- Texts never gender the reader.
- `pianeta` follows Culpeper; `elemento` follows the modern witchcraft tradition (Cunningham), since Culpeper gives no elements. `stramonio` has both `null`: an American plant, not confirmed in the sources reached.
- Mint: planet Venus is Culpeper's (garden mint); element fire is the one found for peppermint. The two come from different books; set `elemento: null` if the mix bothers.
- Cicuta `coltiva` says honestly that nobody grows it: it describes where it grows and how to remove it.
- Plate of the cicuta: the purple spots on the stem, the real field mark, hardly show; `riconosci` says so.
- All 21 plates were looked at before writing `riconosci`.

## Facts confirmed by search (one line each)
- Culpeper: bay "a tree of the sun, under Leo"; balm "herb of Jupiter, under Cancer"; lavender "Mercury owns the herb"; henbane and hemlock under Saturn; mint "herb of Venus"; marigold "herb of the Sun, under Leo"; nettle Mars; mugwort Venus; nightshade "cold Saturnine plant"; chamomile dedicated to the Sun by the Egyptians. https://www.gutenberg.org/ebooks/49513.epub.noimages
- Culpeper's catalogue by planet: sage Jupiter, yarrow Venus, valerian Mercury, vervain Venus, wormwood Mars, lavender Mercury (it also listed the bay tree under Jupiter, against the book's own text; the book was followed). https://ipfs.aleph.im/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/wiki/List_of_plants_in_The_English_Physitian_(1652_book).html
- Thyme Venus (and valerian Mercury, vervain Venus again). https://jaguar-piano-2422.squarespace.com/articles-/the-planetary-rulership-of-plants
- Rosemary: Culpeper "The Sun claims privilege in it"; Hamlet's "that's for remembrance". https://joellane.org/history/the-gardens/rosemary
- Elements (modern tradition): rosemary fire, peppermint fire, thyme water, sage air, lavender air, chamomile water. https://da.coronachur.ch/magical-herbal-correspondences
- Aconite: Saturn; light shade, moist rich soil, dislikes heat; alkaloid passes through skin, gloves; born from Cerberus's foam, Hecate. https://alchemy-works.com/aconitum_napellus.html
- Aconitine: blocks nerve signalling, heart; absorbed through skin; wolf's bane from killing wolves; Lamson hanged in 1882 for poisoning his 18-year-old brother-in-law. https://www.chm.bris.ac.uk/motm/aconitine/aconitineh.htm
- Belladonna: Atropa from Atropos; Italian ladies and pupils; Buchanan's chronicle (1582) of Macbeth's soldiers and the Danes; every part poisonous; sweet berries and children; likes chalky soil and shade; slow, irregular germination, sown early March under cover. https://botanical.com/botanical/mgmh/n/nighde05.html
- Henbane: annual or biennial, ruderal ground; sticky hairs, bad smell, yellow flowers veined violet with dark throat; Ebers papyrus and toothache; gruit beer before hops; flying ointments; all parts toxic, seeds and roots most; scopolamine, hyoscyamine. https://monaconatureencyclopedia.com/hyoscyamus-niger/?lang=en
- Crippen, 1910: hyoscine, flight to Canada, arrest by wireless telegraphy; henbane in witches' ointments. https://pubmed.ncbi.nlm.nih.gov/17526134/
- Hemlock: coniine first alkaloid synthesised (Ladenburg, 1886); Socrates 399 BC; paralysis ascending from the legs, death by respiratory paralysis, mind stays clear. https://en.wikipedia.org/wiki/Coniine
- Datura: Jamestown 1676, soldiers sent against Bacon's Rebellion, eleven days (Beverley, 1705); all parts toxic; atropine, hyoscyamine, scopolamine. https://www.vmnh.net/research-collections/vmnh-greenhouses/jamestown-weed
- Absinthe: Lanfray 1905 (wife and two daughters); Swiss vote 1908; French ban 1915; Pernod at Pontarlier 1805, origin in Val-de-Travers; thujone scare now thought overstated, additives blamed. https://countrylife.co.uk/food-drink/curious-questions-why-was-absinthe-banned-259462
- Mugwort: Cingulum Sancti Johannis; crowns on St John's Eve; wayfarers and fatigue; beer before hops and the "mug" etymology (given as one hypothesis); moxa; leaves white with down underneath only. https://botanical.com/botanical/mgmh/m/mugwor61.html
- Melissa: Eau de mélisse des Carmes, 1611, Carmelites of Paris; Richelieu; still sold in pharmacies. https://www.revueconflits.com/eau-de-melisse-carmes-boyer/
- Rue: furocoumarins and blisters with sunlight; liver and kidney damage when ingested; used to induce abortion, with deaths; greyish evergreen shrub, strong smell, glandular-dotted leaves, yellow flowers with four petals. https://www.inchem.org/documents/pims/plant/rutagrav.htm
- Rue: "herb of grace"; Mithridates' antidote; believed to ward off evil and nightmares. https://www.joellane.org/history/the-gardens/rue
- Cimaruta: silver amulet from Naples, a sprig of rue hung with symbols, against the evil eye, for children. https://odp-test.prm.ox.ac.uk/item/prm-object-240773/silver-amulet-cimarute-to-protect-children-against-the-evil-eye-fb-24-01-2012
- Valerian: later studies largely find no benefit for insomnia. https://www.msdmanuals.com/it/casa/argomenti-speciali/integratori-alimentari-e-vitamine/valeriana

## Pages that could not be opened (permission not granted in time)
- https://en.wikipedia.org/wiki/List_of_plants_in_The_English_Physitian
- https://en.wikipedia.org/wiki/Peppermint
- https://en.wikipedia.org/wiki/Datura_stramonium
- https://en.wikipedia.org/wiki/Hyoscyamus_niger
- https://en.wikipedia.org/wiki/Aconitum
- The Gutenberg page of Culpeper is cut at 500,000 characters: rosemary, rue, sage, thyme and the rest of the alphabet were not reachable there.

## Written from general knowledge, not confirmed by a page in this session
Planets and elements
- Rue under the Sun (Culpeper, "under Leo").
- Elements of: bay and calendula (fire), melissa, yarrow and valerian (water), vervain and mugwort (earth), nettle, wormwood and rue (fire), belladonna, aconite, henbane and hemlock (water).

History and names
- Peppermint first described in England in 1696 (John Ray); hybrid of water mint and spearmint, mostly sterile. The Minthe myth.
- Lavender from Latin lavare (the usual etymology; some dictionaries prefer livere). Romans and baths; plague use.
- Rosemary: Greek students and garlands; burnt in French hospitals with juniper; Hungary Water; ros marinus; now classed in Salvia.
- Sage: the Salerno verse; Charlemagne's Capitulare de villis; thujone; the English wish-on-a-leaf custom.
- Bay: Pythia chewing laurel; Tiberius and thunder; laurea; the laurel wreath of the Six of Wands (Waite's own description); cineole; cherry laurel and oleander as poisonous look-alikes.
- Thyme: the lady's scarf with bee and sprig; incense in Greek temples; Egyptian embalming; posies in epidemics; thymol in mouthwashes; Hymettus honey.
- Chamomile: chamaimelon and manzanilla; "plant's physician"; hollow cone as field mark; blue oil; apigenin, bisabolol; gamblers' hand-wash belief; hair lightening.
- Melissa: Greek for bee, Melissai priestesses; hives rubbed with it; Paracelsus.
- Calendula: calends; "poor man's saffron", butter and cheese; The Winter's Tale; traditional-use recognition for skin.
- Yarrow: Achilles; I Ching stalks; English love divination and "seven years' love"; in Nordic beer; "soldiers' herb".
- Valerian: valere; "phu"; Pied Piper legend; use in Britain during the world wars; cats; corn salad as a relative.
- Vervain: Pliny on the druids and Sirius; verbenae on Roman altars and with envoys; St John's night; verbenalin; lemon verbena from South America in the 1700s.
- Nettle: Bronze Age cloth; German nettle fabric in the First World War; Andersen's "The Wild Swans"; silica hairs and histamine; peacock and red admiral caterpillars; the curse and lightning beliefs.
- Mugwort: Artemis; chornobyl as its Ukrainian name; pollen allergy; not in pregnancy.
- Wormwood: Revelation 8:11; vermouth from Wermut; worms and moths; allelopathy in the garden.
- Rue: Pliny on painters and engravers; Ophelia; Lithuania's national plant and bridal wreath.
- Belladonna: the devil tending it except on Walpurgis night (in Grieve, not re-read for this point); atropine in eye and emergency medicine.
- Aconite: Medea and Theseus; arrows; "monkshood"; tubers planted in autumn.
- Hemlock: Plato's account in the Phaedo; "root of hemlock digg'd i' the dark" in Macbeth; mouse smell; Cicuta virosa as a different plant.
- Datura: arrival in Europe in the 1500s; night-opening flower; asthma cigarettes in the 1800s; "jimsonweed" from Jamestown weed; the feathers and the lost memory in Beverley; ritual use in the Americas.
- All `coltiva` advice for the sixteen non-poisonous plants, and sowing times for datura, is standard gardening practice written from knowledge, not checked page by page.
