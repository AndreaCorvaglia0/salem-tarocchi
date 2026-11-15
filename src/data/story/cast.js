// Who stands where, and when. The world shows the FIRST matching entry per id and re-checks on
// `step`, `flag`, `chapter`. kind 'zone' runs its script when the player walks into the anchor;
// 'npc' runs it when the player talks; 'prop' when the player interacts. `once` = never again.
// Anchors: only those of docs/CONTRACT.md.

const notIn = (...steps) => ({ not: { stepIn: steps } });

export const CAST = [
  // ---- prologue
  { id: 'road', kind: 'zone', at: 'village.arrival', when: { step: 'p.road' }, script: 'p.road', once: true, label: 'La strada' },
  { id: 'road', kind: 'zone', at: 'village.arrival', when: [{ chapterMin: 1 }, { notFlag: 'seen.road' }], script: 'p.road.again', once: true },

  // ---- chapter 1
  { id: 'malva.door', kind: 'zone', at: 'village.malva_door', when: { step: 'c1.malva' }, script: 'c1.malva', label: 'Casa di Malva' },
  { id: 'malva', kind: 'npc', who: 'malva', at: 'village.trapdoor', when: { step: 'c3.trapdoor' }, script: 'c3.trapdoor', label: 'Malva' },
  { id: 'malva', kind: 'npc', who: 'malva', at: 'malva.hearth', when: [{ chapter: 1 }, notIn('c1.malva')], script: 'malva.chat', label: 'Malva' },
  { id: 'cottage.door', kind: 'zone', at: 'village.cottage_door', when: { step: 'c1.cottage' }, script: 'c1.cottage' },
  { id: 'cottage.door', kind: 'zone', at: 'village.cottage_door', when: { step: 'c2.home' }, script: 'c2.arrest' },
  { id: 'cottage.table', kind: 'prop', at: 'cottage.table', when: [{ chapter: 1 }, notIn('c1.malva', 'c1.cottage')], script: 'client.c1', label: 'Il tavolo delle letture' },
  { id: 'cottage.table', kind: 'prop', at: 'cottage.table', when: { chapter: 2 }, script: 'client.c2', label: 'Il tavolo delle letture' },
  { id: 'cottage.table', kind: 'prop', at: 'cottage.table', when: { chapter: 3 }, script: 'client.c3', label: 'Il tavolo delle letture' },
  { id: 'cottage.table', kind: 'prop', at: 'cottage.table', when: { chapterMin: 4 }, script: 'client.free', label: 'Il tavolo delle letture' },
  { id: 'square', kind: 'zone', at: 'village.square', when: { step: 'c1.explore' }, script: 'c1.exam1' },
  { id: 'square', kind: 'zone', at: 'village.square', when: { step: 'c1.square' }, script: 'c1.square' },
  { id: 'cart', kind: 'zone', at: 'village.cart', when: { step: 'c1.cart' }, script: 'c1.cart' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'village.venusglass', when: { step: 'c1.venus' }, script: 'c1.venus', label: 'Ginepra' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'forest.campfire', when: { step: 'c2.fire' }, script: 'c2.fire', label: 'Ginepra' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'village.court_door', when: { step: 'c2.plan' }, script: 'c2.plan', label: 'Ginepra' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'forest.campfire', when: { step: 'f.last' }, script: 'f.last', label: 'Ginepra' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'forest.campfire', when: { chapterMin: 4 }, script: 'post.ginepra', label: 'Ginepra' },
  { id: 'gate', kind: 'zone', at: 'village.forest_gate', when: { step: 'c1.gate' }, script: 'c1.gate', label: 'Il cancello del bosco' },

  // ---- chapter 2
  { id: 'ortica', kind: 'npc', who: 'ortica', at: 'forest.ortica_hut', when: { step: 'c2.ortica' }, script: 'c2.ortica', label: 'Ortica' },
  { id: 'ortica', kind: 'npc', who: 'ortica', at: 'forest.ortica_hut', when: [{ chapterMin: 2 }, { not: { step: 'c2.ortica' } }], script: 'ortica.chat', label: 'Ortica' },

  // ---- chapter 3
  { id: 'trapdoor', kind: 'zone', at: 'village.trapdoor', when: [{ chapter: 3 }, { not: { step: 'c3.trapdoor' } }], script: 'c3.trapdoor.again', label: 'La botola' },
  { id: 'edera', kind: 'npc', who: 'edera', at: 'depths.edera_nook', when: { step: 'c3.edera' }, script: 'c3.edera', label: 'Nonna Edera' },
  { id: 'edera', kind: 'npc', who: 'edera', at: 'depths.edera_nook', when: { chapterMin: 3 }, script: 'edera.chat', label: 'Nonna Edera' },
  { id: 'coven', kind: 'zone', at: 'depths.coven', when: { step: 'c3.coven' }, script: 'c3.coven', label: 'Il consiglio' },
  { id: 'jail', kind: 'zone', at: 'depths.jail', when: { step: 'c3.jail' }, script: 'c3.jail' },
  { id: 'court.door', kind: 'zone', at: 'village.court_door', when: { step: 'c3.court' }, script: 'c3.court' },

  // ---- optional encounters (reward wandering: xp 5 and a rumour)
  { id: 'enc.child', kind: 'npc', who: 'child', at: 'village.shop_door', when: { chapterMin: 1, chapterMax: 3 }, script: 'enc.child', once: true, label: 'Un bambino' },
  { id: 'enc.washer', kind: 'npc', who: 'washer', at: 'village.meeting_door', when: { chapter: 1 }, script: 'enc.washer', once: true, label: 'La lavandaia' },
  { id: 'enc.hale', kind: 'npc', who: 'hale', at: 'village.stall', when: [{ chapterMin: 2 }, { flag: 'b1.spoke' }], script: 'enc.hale', once: true, label: 'Comare Hale' },
  { id: 'enc.gravedigger', kind: 'npc', who: 'gravedigger', at: 'forest.graveyard', when: { chapterMin: 2 }, script: 'enc.gravedigger', once: true, label: 'Il becchino' },
  { id: 'enc.miller', kind: 'npc', who: 'miller', at: 'forest.mill', when: { chapterMin: 2 }, script: 'enc.miller', once: true, label: 'Il mugnaio' },
  { id: 'enc.guard', kind: 'npc', who: 'conestabile', at: 'depths.well', when: { chapterMin: 3 }, script: 'enc.guard', once: true, label: 'Un conestabile che dorme' },
];
