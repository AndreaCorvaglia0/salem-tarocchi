// The herbarium (docs/DESIGN.md "L'erbario"): the plants, in the order of the book. `risk`: null, 'attenzione'
// (not to be eaten or handled carelessly) or 'velenosa'. `plate`: the public-domain botanical plate shown in the
// grimoire (public/herbs/<id>.webp), with the work it comes from (docs/CREDITS.md). Texts: ./texts.js.
export const HERB_LIST = [
  { id: 'lavanda', name: 'Lavanda', latin: 'Lavandula angustifolia', risk: null, plate: { file: "Koeh-087.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'rosmarino', name: 'Rosmarino', latin: 'Rosmarinus officinalis', risk: null, plate: { file: "Koeh-258.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'salvia', name: 'Salvia', latin: 'Salvia officinalis', risk: null, plate: { file: "Koeh-126.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'alloro', name: 'Alloro', latin: 'Laurus nobilis', risk: null, plate: { file: "Koeh-086.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'menta', name: 'Menta', latin: 'Mentha × piperita', risk: null, plate: { file: "Koeh-095.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'timo', name: 'Timo', latin: 'Thymus vulgaris', risk: null, plate: { file: "Koeh-271.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'camomilla', name: 'Camomilla', latin: 'Matricaria chamomilla', risk: null, plate: { file: "Koeh-091.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'melissa', name: 'Melissa', latin: 'Melissa officinalis', risk: null, plate: { file: "Koeh-094.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'calendula', name: 'Calendula', latin: 'Calendula officinalis', risk: null, plate: { file: "Koeh-024.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'achillea', name: 'Achillea', latin: 'Achillea millefolium', risk: null, plate: { file: "Koeh-149.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'valeriana', name: 'Valeriana', latin: 'Valeriana officinalis', risk: null, plate: { file: "Koeh-143.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'verbena', name: 'Verbena', latin: 'Verbena officinalis', risk: null, plate: { file: "Illustration Verbena officinalis0.jpg", work: "O. W. Thomé, Flora von Deutschland, Österreich und der Schweiz, 1885" } },
  { id: 'ortica', name: 'Ortica', latin: 'Urtica dioica', risk: null, plate: { file: "Illustration Urtica dioica0.jpg", work: "O. W. Thomé, Flora von Deutschland, Österreich und der Schweiz, 1885" } },
  { id: 'artemisia', name: 'Artemisia', latin: 'Artemisia vulgaris', risk: 'attenzione', plate: { file: "Koeh-016.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'assenzio', name: 'Assenzio', latin: 'Artemisia absinthium', risk: 'attenzione', plate: { file: "Koeh-164.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'ruta', name: 'Ruta', latin: 'Ruta graveolens', risk: 'attenzione', plate: { file: "Koeh-259.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'belladonna', name: 'Belladonna', latin: 'Atropa belladonna', risk: 'velenosa', plate: { file: "Koeh-018.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'aconito', name: 'Aconito', latin: 'Aconitum napellus', risk: 'velenosa', plate: { file: "Koeh-151.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'giusquiamo', name: 'Giusquiamo', latin: 'Hyoscyamus niger', risk: 'velenosa', plate: { file: "Koeh-073.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'cicuta', name: 'Cicuta', latin: 'Conium maculatum', risk: 'velenosa', plate: { file: "Koeh-191.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
  { id: 'stramonio', name: 'Stramonio', latin: 'Datura stramonium', risk: 'velenosa', plate: { file: "Koeh-051.jpg", work: "Köhler's Medizinal-Pflanzen, 1887" } },
];
export const HERB = Object.fromEntries(HERB_LIST.map((h) => [h.id, h]));
export const herbUrl = (id) => `herbs/${id}.webp`;
