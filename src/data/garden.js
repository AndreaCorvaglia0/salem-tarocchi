// The garden at the cottage (docs/DESIGN.md "L'orto" and "L'orto insegna davvero"): how each herb of the
// herbarium drinks, which light and which soil it wants. Sources: notes/garden.md.
//   every: days between two waterings in a bed, in the soil it likes (agrees with coltiva.acqua in
//          data/herbs/texts.js: tests/garden.test.mjs checks it)
//   dry:   it likes it dry (coltiva.acqua says «Poca…»): it is watered when the soil is dry a finger deep,
//          and watered too early twice in a row it loses a step. The others are watered when the top is dry.
//   steps: good waterings from the seedling to the first harvest (4..7: the slow drinkers need fewer)
//   luce:  the light it wants ('sole' | 'mezzombra' | 'ombra', from coltiva.luce); anche: a light it also takes
//   terra: the soil it wants: 'leggera' (light and stony, draining), 'ricca' (garden soil), 'fresca' (stays moist)
//   the:   its name with the article, for the lines under the bed;  beve: how it drinks, from its advice
export const GARDEN = {
  lavanda: { every: 4, dry: true, steps: 4, luce: 'sole', terra: 'leggera', the: 'la lavanda', beve: 'beve poco' },
  rosmarino: { every: 4, dry: true, steps: 4, luce: 'sole', terra: 'leggera', the: 'il rosmarino', beve: 'beve poco' },
  salvia: { every: 3, dry: true, steps: 5, luce: 'sole', terra: 'leggera', the: 'la salvia', beve: 'beve poco' },
  alloro: { every: 3, dry: false, steps: 4, luce: 'sole', anche: 'mezzombra', terra: 'ricca', the: "l'alloro", beve: 'da giovane vuole acqua regolare' },
  menta: { every: 1, dry: false, steps: 7, luce: 'mezzombra', anche: 'sole', terra: 'fresca', the: 'la menta', beve: 'vuole la terra sempre fresca' },
  timo: { every: 4, dry: true, steps: 4, luce: 'sole', terra: 'leggera', the: 'il timo', beve: 'beve pochissimo' },
  camomilla: { every: 3, dry: true, steps: 5, luce: 'sole', terra: 'leggera', the: 'la camomilla', beve: 'beve poco' },
  melissa: { every: 2, dry: false, steps: 6, luce: 'mezzombra', anche: 'sole', terra: 'fresca', the: 'la melissa', beve: 'vuole acqua regolare' },
  calendula: { every: 2, dry: false, steps: 5, luce: 'sole', anche: 'mezzombra', terra: 'ricca', the: 'la calendula', beve: 'beve il giusto' },
  achillea: { every: 3, dry: true, steps: 5, luce: 'sole', terra: 'leggera', the: "l'achillea", beve: 'beve poco' },
  valeriana: { every: 1, dry: false, steps: 7, luce: 'mezzombra', anche: 'sole', terra: 'fresca', the: 'la valeriana', beve: 'ama la terra umida' },
  verbena: { every: 3, dry: true, steps: 5, luce: 'sole', terra: 'leggera', the: 'la verbena', beve: 'beve poco' },
  ortica: { every: 1, dry: false, steps: 7, luce: 'mezzombra', anche: 'ombra', terra: 'fresca', the: "l'ortica", beve: 'vuole la terra fresca' },
  artemisia: { every: 3, dry: true, steps: 5, luce: 'sole', terra: 'leggera', the: "l'artemisia", beve: 'se la cava con poco' },
  assenzio: { every: 4, dry: true, steps: 4, luce: 'sole', terra: 'leggera', the: "l'assenzio", beve: "teme l'umido alle radici" },
  ruta: { every: 4, dry: true, steps: 4, luce: 'sole', terra: 'leggera', the: 'la ruta', beve: 'preferisce la terra asciutta' },
  belladonna: { every: 2, dry: false, steps: 6, luce: 'mezzombra', anche: 'ombra', terra: 'fresca', the: 'la belladonna', beve: 'vuole la terra fresca' },
  aconito: { every: 1, dry: false, steps: 7, luce: 'mezzombra', terra: 'fresca', the: "l'aconito", beve: 'vuole la terra sempre umida' },
  giusquiamo: { every: 3, dry: true, steps: 5, luce: 'sole', terra: 'leggera', the: 'il giusquiamo', beve: 'beve poco' },
  cicuta: { every: 2, dry: false, steps: 6, luce: 'sole', anche: 'mezzombra', terra: 'fresca', the: 'la cicuta', beve: 'cerca la terra fresca' },
  stramonio: { every: 2, dry: false, steps: 6, luce: 'sole', terra: 'ricca', the: 'lo stramonio', beve: 'vuole acqua regolare' },
};
// the seedlings Ortica gives when she has fewer than three herbs that qualify
export const FIRST_SEEDLINGS = ['lavanda', 'menta', 'salvia'];
// the four beds against the cottage wall: the first two in full sun, then half shade, then shade
export const BED_LIGHT = ['sole', 'sole', 'mezzombra', 'ombra'];
export const BEDS = BED_LIGHT.length;
export const LIGHT = { sole: 'pieno sole', mezzombra: 'mezz\'ombra', ombra: 'ombra' };
export const SOILS = [
  { id: 'leggera', name: 'Terra leggera', line: 'Leggera e sassosa: l\'acqua scorre via' },
  { id: 'ricca', name: 'Terra da orto', line: 'Da orto, ricca' },
  { id: 'fresca', name: 'Terra fresca', line: 'Fresca, che resta umida' },
];
export const SOIL = Object.fromEntries(SOILS.map((s) => [s.id, s]));
// Ortica's lessons (a later optional chain): when state.garden.lessons[topic] is true, the line under a bed
// that touches that topic is followed by this fuller explanation. Topics: acqua, luce, terra, vaso, semina.
export const LESSON_NOTES = {
  acqua: 'Meglio bagnare a fondo e poi aspettare: le radici scendono a cercare l\'acqua, mentre con poca acqua tutti i giorni restano in superficie.',
  luce: 'Le aromatiche del Mediterraneo vogliono almeno sei ore di sole diretto; con meno luce i fusti si allungano, diventano deboli e fanno meno profumo.',
  terra: 'Una terra leggera si fa mescolando terriccio con sabbia grossa o ghiaino: l\'acqua passa e le radici non restano a mollo.',
};
