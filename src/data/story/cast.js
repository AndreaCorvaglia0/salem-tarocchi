// Who stands where, and when. The world shows the FIRST matching entry per id and re-checks on
// `step`, `flag`, `chapter`. kind 'zone' runs its script when the player walks into the anchor
// (`r`: radius in tiles); 'npc' runs it when the player talks; 'prop' when she uses it (`verb` on the
// action button). `once` = never again (remembered by id: entries that share an id share it).

import { lessonOpen } from './missions.js';

const notIn = (...steps) => ({ not: { stepIn: steps } });
// the guided opening: nothing else is offered while these steps last
const OPENING = ['p.session', 'p.road', 'c1.malva', 'c1.read', 'c1.shop', 'c1.back', 'c1.deliver', 'c1.cottage', 'c1.grimoire'];

export const CAST = [
  // ---- prologue: the tableau where she appears, then the card a few steps ahead on the verge
  { id: 'road', kind: 'zone', at: 'village.arrival', when: { step: 'p.road' }, script: 'p.arrive', once: true, label: 'La strada' },
  { id: 'road.card', kind: 'zone', at: 'village.road_card', r: 1, when: { step: 'p.road' }, script: 'p.road', label: 'Qualcosa brilla' },
  { id: 'road.back', kind: 'zone', at: 'village.arrival', when: [{ chapter: 1 }, { notFlag: 'seen.road' }], script: 'p.road.again', once: true },

  // ---- chapter 1, the guided opening
  { id: 'malva.door', kind: 'zone', at: 'village.malva_door', when: { step: 'c1.malva' }, script: 'c1.malva', label: 'Casa di Malva' },
  { id: 'malva.table', kind: 'prop', at: 'malva.table', when: { step: 'c1.read' }, script: 'c1.read', label: 'Il tavolo di Malva', verb: 'Siediti' },
  { id: 'malva', kind: 'npc', who: 'malva', at: 'village.trapdoor', when: { step: 'c3.trapdoor' }, script: 'c3.trapdoor', label: 'Malva' },
  { id: 'malva', kind: 'npc', who: 'malva', at: 'village.forest_gate', when: { step: 'c1.gate' }, script: 'c1.gate', label: 'Malva' },
  { id: 'malva', kind: 'npc', who: 'malva', at: 'malva.hearth', when: { stepIn: ['c1.read', 'c1.shop'] }, script: 'malva.nudge', label: 'Malva' },
  { id: 'malva', kind: 'npc', who: 'malva', at: 'malva.hearth', when: { step: 'c1.back' }, script: 'c1.back', label: 'Malva' },
  { id: 'malva', kind: 'npc', who: 'malva', at: 'malva.hearth', when: [{ chapter: 1 }, notIn('c1.malva', 'c1.gate')], script: 'malva.chat', label: 'Malva' },
  { id: 'shop.keeper', kind: 'npc', who: 'bottegaio', at: 'shop.keeper', when: { step: 'c1.shop' }, script: 'c1.shop', label: 'Il bottegaio' },
  { id: 'shop.counter', kind: 'prop', at: 'shop.counter', when: { step: 'c1.shop' }, script: 'c1.shop', label: 'Il bancone', verb: 'Compra' },
  { id: 'enc.washer', kind: 'npc', who: 'washer', at: 'village.meeting_door', when: { step: 'c1.deliver' }, script: 'c1.deliver', label: 'La lavandaia' },
  { id: 'cottage.door', kind: 'zone', at: 'village.cottage_door', when: { step: 'c1.cottage' }, script: 'c1.cottage' },
  { id: 'cottage.door', kind: 'zone', at: 'village.cottage_door', when: { step: 'c2.home' }, script: 'c2.arrest' },
  // the lanterns round the cottage: they wait for her, and leave with Ginepra
  ...['a', 'b', 'c'].map((k) => ({ id: `arrest.${k}`, kind: 'npc', who: 'conestabile', at: `village.arrest_${k}`, when: [{ step: 'c2.home' }, { notFlag: 'ginepra.taken' }], script: 'arrest.wait', face: 'up', label: 'Conestabile' })),
  { id: 'cottage.table', kind: 'prop', at: 'cottage.table', when: { step: 'c1.grimoire' }, script: 'c1.grimoire', label: 'Il tavolo', verb: 'Siediti' },
  { id: 'cottage.table', kind: 'prop', at: 'cottage.table', when: [{ chapter: 1 }, notIn(...OPENING)], script: 'client.c1', label: 'Il tavolo delle letture', verb: 'Leggi' },
  { id: 'cottage.table', kind: 'prop', at: 'cottage.table', when: { chapter: 2 }, script: 'client.c2', label: 'Il tavolo delle letture', verb: 'Leggi' },
  { id: 'cottage.table', kind: 'prop', at: 'cottage.table', when: { chapter: 3 }, script: 'client.c3', label: 'Il tavolo delle letture', verb: 'Leggi' },
  { id: 'cottage.table', kind: 'prop', at: 'cottage.table', when: { chapterMin: 4 }, script: 'client.free', label: 'Il tavolo delle letture', verb: 'Leggi' },

  // ---- chapter 1, after the opening
  { id: 'cart', kind: 'zone', at: 'village.cart', when: { step: 'c1.cart' }, script: 'c1.cart' },
  { id: 'square', kind: 'zone', at: 'village.square', when: { step: 'c1.explore' }, script: 'c1.exam1' },
  { id: 'square', kind: 'zone', at: 'village.square', when: { step: 'c1.square' }, script: 'c1.square' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'village.venusglass', when: { step: 'c1.venus' }, script: 'c1.venus', label: 'Ginepra' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'forest.campfire', when: { step: 'c2.fire' }, script: 'c2.fire', label: 'Ginepra' },
  // until they have the cards for the court she waits at the campfire and swaps duplicates
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'forest.campfire', when: [{ step: 'c2.plan' }, { not: { majorsMin: 11 } }], script: 'trade.ginepra', label: 'Ginepra' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'village.court_door', when: [{ step: 'c2.plan' }, { majorsMin: 11 }], script: 'c2.plan', label: 'Ginepra' },
  { id: 'court.wait', kind: 'zone', at: 'village.court_door', when: [{ step: 'c2.plan' }, { not: { majorsMin: 11 } }], script: 'c2.plan' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'forest.campfire', when: { step: 'f.last' }, script: 'f.last', label: 'Ginepra' },
  { id: 'ginepra', kind: 'npc', who: 'ginepra', at: 'forest.campfire', when: { chapterMin: 4 }, script: 'post.ginepra', label: 'Ginepra' },

  // ---- chapter 2
  { id: 'ortica', kind: 'npc', who: 'ortica', at: 'forest.ortica_hut', when: { step: 'c2.ortica' }, script: 'c2.ortica', label: 'Ortica' },
  { id: 'ortica', kind: 'npc', who: 'ortica', at: 'forest.ortica_hut', when: lessonOpen('lesson.minors'), script: 'minors.lesson', label: 'Ortica' }, // the lesson on the small cards, once
  { id: 'ortica', kind: 'npc', who: 'ortica', at: 'forest.ortica_hut', when: [{ chapterMin: 2 }, { not: { step: 'c2.ortica' } }], script: 'ortica.chat', label: 'Ortica' },
  { id: 'enc.miller', kind: 'npc', who: 'miller', at: 'forest.mill', when: { step: 'c2.mill' }, script: 'c2.mill', label: 'Il mugnaio' },

  // ---- chapter 3
  { id: 'trapdoor', kind: 'zone', at: 'village.trapdoor', when: [{ chapter: 3 }, { not: { step: 'c3.trapdoor' } }], script: 'c3.trapdoor.again', label: 'La botola' },
  { id: 'edera', kind: 'npc', who: 'edera', at: 'depths.edera_nook', when: { step: 'c3.edera' }, script: 'c3.edera', label: 'Nonna Edera' },
  { id: 'edera', kind: 'npc', who: 'edera', at: 'depths.edera_nook', when: lessonOpen('lesson.reversed'), script: 'reversed.lesson', label: 'Nonna Edera' }, // the lesson on reversed cards, once
  { id: 'edera', kind: 'npc', who: 'edera', at: 'depths.edera_nook', when: { chapterMin: 3 }, script: 'edera.chat', label: 'Nonna Edera' },
  // the three mistresses wait round the cauldron when the council can meet (the zone in front of the cauldron plays the scene)
  ...['malva', 'ortica', 'edera'].map((who) => ({ id: `coven.${who}`, kind: 'npc', who, at: `depths.coven_${who}`, when: [{ step: 'c3.coven' }, { majorsMin: 19 }], script: 'coven.wait', face: 'down', label: who === 'edera' ? 'Nonna Edera' : who === 'malva' ? 'Malva' : 'Ortica' })),
  { id: 'coven', kind: 'zone', at: 'depths.coven', when: { step: 'c3.coven' }, script: 'c3.coven', label: 'Il consiglio' },
  { id: 'jail', kind: 'zone', at: 'depths.jail', when: { step: 'c3.jail' }, script: 'c3.jail' },
  { id: 'court.door', kind: 'zone', at: 'village.court_door', when: { step: 'c3.court' }, script: 'c3.court' },

  // ---- systems in the world: the shop, the deposit, the card of the day
  { id: 'shop.keeper', kind: 'npc', who: 'bottegaio', at: 'shop.keeper', script: 'prop.shop', label: 'Il bottegaio' }, // behind the counter
  { id: 'shop.counter', kind: 'prop', at: 'shop.counter', script: 'prop.shop', label: 'Il bancone', verb: 'Compra' },
  { id: 'court.deposit', kind: 'prop', at: 'court.deposit', script: 'prop.deposit', label: 'Il deposito', verb: 'Cerca' },
  { id: 'cottage.bed', kind: 'prop', at: 'cottage.bed', when: [{ chapterMin: 1 }, notIn(...OPENING)], script: 'prop.bed', label: 'La carta del giorno', verb: 'Pesca' },

  // ---- the flying lesson (data/story/missions.js): Malva comes to her door when she has the broom
  { id: 'fly.lesson', kind: 'zone', at: 'village.malva_door', r: 1, when: lessonOpen('lesson.fly'), script: 'fly.lesson', label: 'La lezione di volo' },

  // ---- optional encounters (reward wandering: xp 5, a rumour, sometimes a side mission)
  { id: 'enc.child', kind: 'npc', who: 'child', at: 'village.shop_door', when: [{ chapterMin: 1, chapterMax: 3 }, notIn(...OPENING)], script: 'enc.child', once: true, label: 'Un bambino' },
  { id: 'enc.washer', kind: 'npc', who: 'washer', at: 'village.meeting_door', when: [{ chapter: 1 }, { flag: 'side.m05' }], script: 'enc.washer', once: true, label: 'La lavandaia' },
  { id: 'enc.hale', kind: 'npc', who: 'hale', at: 'village.stall', when: [{ chapterMin: 2 }, { flag: 'b1.spoke' }], script: 'enc.hale', once: true, label: 'Comare Hale' },
  { id: 'enc.gravedigger', kind: 'npc', who: 'gravedigger', at: 'forest.graveyard', when: { chapterMin: 2 }, script: 'enc.gravedigger', once: true, label: 'Il becchino' },
  { id: 'enc.miller', kind: 'npc', who: 'miller', at: 'forest.mill', when: [{ chapterMin: 2 }, { flag: 'side.m12' }], script: 'enc.miller', once: true, label: 'Il mugnaio' },
  { id: 'enc.guard', kind: 'npc', who: 'conestabile', at: 'depths.well', when: { chapterMin: 3 }, script: 'enc.guard', once: true, label: 'Un conestabile che dorme' },
];
