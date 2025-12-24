import { EquipmentItem } from '@/types/equipment';

// Equipment definitions with stats
// Each tier is ~15% better than previous
export const EQUIPMENT: Record<string, EquipmentItem> = {
  // Bronze Equipment (Level 1)
  bronze_dagger: {
    id: 'bronze_dagger',
    name: 'Bronze Dagger',
    icon: '🗡️',
    slot: 'weapon',
    stats: { attackBonus: 2, strengthBonus: 1 },
    requirements: { attack: 1 },
  },
  bronze_sword: {
    id: 'bronze_sword',
    name: 'Bronze Sword',
    icon: '⚔️',
    slot: 'weapon',
    stats: { attackBonus: 4, strengthBonus: 3 },
    requirements: { attack: 1 },
  },
  bronze_helmet: {
    id: 'bronze_helmet',
    name: 'Bronze Helmet',
    icon: '🪖',
    slot: 'head',
    stats: { defenceBonus: 3 },
    requirements: { defence: 1 },
  },
  bronze_platebody: {
    id: 'bronze_platebody',
    name: 'Bronze Platebody',
    icon: '🛡️',
    slot: 'body',
    stats: { defenceBonus: 7 },
    requirements: { defence: 1 },
  },

  // Iron Equipment (Level 10)
  iron_dagger: {
    id: 'iron_dagger',
    name: 'Iron Dagger',
    icon: '🗡️',
    slot: 'weapon',
    stats: { attackBonus: 3, strengthBonus: 2 },
    requirements: { attack: 10 },
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    icon: '⚔️',
    slot: 'weapon',
    stats: { attackBonus: 6, strengthBonus: 5 },
    requirements: { attack: 10 },
  },
  iron_helmet: {
    id: 'iron_helmet',
    name: 'Iron Helmet',
    icon: '🪖',
    slot: 'head',
    stats: { defenceBonus: 5 },
    requirements: { defence: 10 },
  },
  iron_platebody: {
    id: 'iron_platebody',
    name: 'Iron Platebody',
    icon: '🛡️',
    slot: 'body',
    stats: { defenceBonus: 12 },
    requirements: { defence: 10 },
  },

  // Steel Equipment (Level 20)
  steel_dagger: {
    id: 'steel_dagger',
    name: 'Steel Dagger',
    icon: '🗡️',
    slot: 'weapon',
    stats: { attackBonus: 5, strengthBonus: 3 },
    requirements: { attack: 20 },
  },
  steel_sword: {
    id: 'steel_sword',
    name: 'Steel Sword',
    icon: '⚔️',
    slot: 'weapon',
    stats: { attackBonus: 9, strengthBonus: 8 },
    requirements: { attack: 20 },
  },
  steel_helmet: {
    id: 'steel_helmet',
    name: 'Steel Helmet',
    icon: '🪖',
    slot: 'head',
    stats: { defenceBonus: 8 },
    requirements: { defence: 20 },
  },
  steel_platebody: {
    id: 'steel_platebody',
    name: 'Steel Platebody',
    icon: '🛡️',
    slot: 'body',
    stats: { defenceBonus: 18 },
    requirements: { defence: 20 },
  },

  // Mithril Equipment (Level 30)
  mithril_dagger: {
    id: 'mithril_dagger',
    name: 'Mithril Dagger',
    icon: '🗡️',
    slot: 'weapon',
    stats: { attackBonus: 7, strengthBonus: 5 },
    requirements: { attack: 30 },
  },
  mithril_sword: {
    id: 'mithril_sword',
    name: 'Mithril Sword',
    icon: '⚔️',
    slot: 'weapon',
    stats: { attackBonus: 13, strengthBonus: 11 },
    requirements: { attack: 30 },
  },
  mithril_helmet: {
    id: 'mithril_helmet',
    name: 'Mithril Helmet',
    icon: '🪖',
    slot: 'head',
    stats: { defenceBonus: 11 },
    requirements: { defence: 30 },
  },
  mithril_platebody: {
    id: 'mithril_platebody',
    name: 'Mithril Platebody',
    icon: '🛡️',
    slot: 'body',
    stats: { defenceBonus: 25 },
    requirements: { defence: 30 },
  },

  // Adamant Equipment (Level 40)
  adamant_dagger: {
    id: 'adamant_dagger',
    name: 'Adamant Dagger',
    icon: '🗡️',
    slot: 'weapon',
    stats: { attackBonus: 10, strengthBonus: 7 },
    requirements: { attack: 40 },
  },
  adamant_sword: {
    id: 'adamant_sword',
    name: 'Adamant Sword',
    icon: '⚔️',
    slot: 'weapon',
    stats: { attackBonus: 18, strengthBonus: 15 },
    requirements: { attack: 40 },
  },
  adamant_helmet: {
    id: 'adamant_helmet',
    name: 'Adamant Helmet',
    icon: '🪖',
    slot: 'head',
    stats: { defenceBonus: 15 },
    requirements: { defence: 40 },
  },
  adamant_platebody: {
    id: 'adamant_platebody',
    name: 'Adamant Platebody',
    icon: '🛡️',
    slot: 'body',
    stats: { defenceBonus: 35 },
    requirements: { defence: 40 },
  },

  // Rune Equipment (Level 50)
  rune_dagger: {
    id: 'rune_dagger',
    name: 'Rune Dagger',
    icon: '🗡️',
    slot: 'weapon',
    stats: { attackBonus: 14, strengthBonus: 10 },
    requirements: { attack: 50 },
  },
  rune_sword: {
    id: 'rune_sword',
    name: 'Rune Sword',
    icon: '⚔️',
    slot: 'weapon',
    stats: { attackBonus: 25, strengthBonus: 20 },
    requirements: { attack: 50 },
  },
  rune_helmet: {
    id: 'rune_helmet',
    name: 'Rune Helmet',
    icon: '🪖',
    slot: 'head',
    stats: { defenceBonus: 20 },
    requirements: { defence: 50 },
  },
  rune_platebody: {
    id: 'rune_platebody',
    name: 'Rune Platebody',
    icon: '🛡️',
    slot: 'body',
    stats: { defenceBonus: 45 },
    requirements: { defence: 50 },
  },

  // Leather Armor (Level 1 Ranged)
  leather_cowl: {
    id: 'leather_cowl',
    name: 'Leather Cowl',
    icon: '🎭',
    slot: 'head',
    stats: { defenceBonus: 2, rangedBonus: 2 },
    requirements: { ranged: 1 },
  },
  leather_body: {
    id: 'leather_body',
    name: 'Leather Body',
    icon: '🦺',
    slot: 'body',
    stats: { defenceBonus: 5, rangedBonus: 4 },
    requirements: { ranged: 1 },
  },
  leather_chaps: {
    id: 'leather_chaps',
    name: 'Leather Chaps',
    icon: '👖',
    slot: 'legs',
    stats: { defenceBonus: 4, rangedBonus: 3 },
    requirements: { ranged: 1 },
  },
  leather_gloves: {
    id: 'leather_gloves',
    name: 'Leather Gloves',
    icon: '🧤',
    slot: 'gloves',
    stats: { defenceBonus: 1, rangedBonus: 2 },
    requirements: { ranged: 1 },
  },
  leather_boots: {
    id: 'leather_boots',
    name: 'Leather Boots',
    icon: '🥾',
    slot: 'boots',
    stats: { defenceBonus: 1, rangedBonus: 1 },
    requirements: { ranged: 1 },
  },

  // Green D'hide Armor (Level 40 Ranged)
  green_dhide_vambraces: {
    id: 'green_dhide_vambraces',
    name: "Green D'hide Vambraces",
    icon: '🧤',
    slot: 'gloves',
    stats: { defenceBonus: 8, rangedBonus: 11 },
    requirements: { ranged: 40 },
  },
  green_dhide_chaps: {
    id: 'green_dhide_chaps',
    name: "Green D'hide Chaps",
    icon: '👖',
    slot: 'legs',
    stats: { defenceBonus: 15, rangedBonus: 14 },
    requirements: { ranged: 40 },
  },
  green_dhide_body: {
    id: 'green_dhide_body',
    name: "Green D'hide Body",
    icon: '🦎',
    slot: 'body',
    stats: { defenceBonus: 20, rangedBonus: 18 },
    requirements: { ranged: 40, defence: 40 },
  },

  // Bows (Ranged Weapons)
  shortbow: {
    id: 'shortbow',
    name: 'Shortbow',
    icon: '🏹',
    slot: 'weapon',
    stats: { rangedBonus: 8 },
    requirements: { ranged: 1 },
  },
  oak_shortbow: {
    id: 'oak_shortbow',
    name: 'Oak Shortbow',
    icon: '🏹',
    slot: 'weapon',
    stats: { rangedBonus: 14 },
    requirements: { ranged: 5 },
  },
  willow_shortbow: {
    id: 'willow_shortbow',
    name: 'Willow Shortbow',
    icon: '🏹',
    slot: 'weapon',
    stats: { rangedBonus: 20 },
    requirements: { ranged: 20 },
  },
  maple_shortbow: {
    id: 'maple_shortbow',
    name: 'Maple Shortbow',
    icon: '🏹',
    slot: 'weapon',
    stats: { rangedBonus: 29 },
    requirements: { ranged: 30 },
  },
  yew_shortbow: {
    id: 'yew_shortbow',
    name: 'Yew Shortbow',
    icon: '🏹',
    slot: 'weapon',
    stats: { rangedBonus: 47 },
    requirements: { ranged: 40 },
  },

  // Magic Staves
  staff_of_air: {
    id: 'staff_of_air',
    name: 'Staff of Air',
    icon: '🪄',
    slot: 'weapon',
    stats: { magicBonus: 10 },
    requirements: { magic: 1 },
  },
  staff_of_water: {
    id: 'staff_of_water',
    name: 'Staff of Water',
    icon: '🪄',
    slot: 'weapon',
    stats: { magicBonus: 10 },
    requirements: { magic: 1 },
  },
  staff_of_earth: {
    id: 'staff_of_earth',
    name: 'Staff of Earth',
    icon: '🪄',
    slot: 'weapon',
    stats: { magicBonus: 10 },
    requirements: { magic: 1 },
  },
  staff_of_fire: {
    id: 'staff_of_fire',
    name: 'Staff of Fire',
    icon: '🪄',
    slot: 'weapon',
    stats: { magicBonus: 10 },
    requirements: { magic: 1 },
  },
};

export function getEquipment(id: string): EquipmentItem | undefined {
  return EQUIPMENT[id];
}

export function isEquipment(itemId: string): boolean {
  return itemId in EQUIPMENT;
}
