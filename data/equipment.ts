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
};

export function getEquipment(id: string): EquipmentItem | undefined {
  return EQUIPMENT[id];
}

export function isEquipment(itemId: string): boolean {
  return itemId in EQUIPMENT;
}
