import { SkillingActionDefinition, BonusDrop } from '@/types/game';

// Gem drops - chance increases slightly with mining level required
const GEM_DROPS: BonusDrop[] = [
  { itemId: 'sapphire', chance: 0.01 },   // 1%
  { itemId: 'emerald', chance: 0.005 },   // 0.5%
  { itemId: 'ruby', chance: 0.002 },      // 0.2%
  { itemId: 'diamond', chance: 0.001 },   // 0.1%
];

export const MINING_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'copper_rock',
    name: 'Copper Rock',
    skillId: 'mining',
    levelRequired: 1,
    xp: 17,
    baseTime: 2400,
    itemProduced: { itemId: 'copper_ore', quantity: 1 },
    bonusDrops: GEM_DROPS,
  },
  {
    id: 'tin_rock',
    name: 'Tin Rock',
    skillId: 'mining',
    levelRequired: 1,
    xp: 17,
    baseTime: 2400,
    itemProduced: { itemId: 'tin_ore', quantity: 1 },
    bonusDrops: GEM_DROPS,
  },
  {
    id: 'iron_rock',
    name: 'Iron Rock',
    skillId: 'mining',
    levelRequired: 15,
    xp: 35,
    baseTime: 3000,
    itemProduced: { itemId: 'iron_ore', quantity: 1 },
    bonusDrops: GEM_DROPS,
  },
  {
    id: 'coal_rock',
    name: 'Coal Rock',
    skillId: 'mining',
    levelRequired: 30,
    xp: 50,
    baseTime: 3600,
    itemProduced: { itemId: 'coal', quantity: 1 },
    bonusDrops: GEM_DROPS,
  },
  {
    id: 'mithril_rock',
    name: 'Mithril Rock',
    skillId: 'mining',
    levelRequired: 55,
    xp: 80,
    baseTime: 4200,
    itemProduced: { itemId: 'mithril_ore', quantity: 1 },
    bonusDrops: GEM_DROPS,
  },
  {
    id: 'adamant_rock',
    name: 'Adamantite Rock',
    skillId: 'mining',
    levelRequired: 70,
    xp: 95,
    baseTime: 5000,
    itemProduced: { itemId: 'adamant_ore', quantity: 1 },
    bonusDrops: GEM_DROPS,
  },
  {
    id: 'rune_rock',
    name: 'Runite Rock',
    skillId: 'mining',
    levelRequired: 85,
    xp: 125,
    baseTime: 6000,
    itemProduced: { itemId: 'rune_ore', quantity: 1 },
    bonusDrops: GEM_DROPS,
  },
];
