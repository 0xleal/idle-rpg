import { Monster, CombatArea } from '@/types/combat';

export const MONSTERS: Record<string, Monster> = {
  // Beginner area
  chicken: {
    id: 'chicken',
    name: 'Chicken',
    icon: '🐔',
    combatLevel: 1,
    hitpoints: 3,
    maxHit: 1,
    attackSpeed: 2400,
    attackBonus: 0,
    strengthBonus: 0,
    defenceBonus: 0,
    xpReward: { attack: 3, strength: 3, defence: 3, hitpoints: 1 },
    drops: [
      { itemId: 'raw_chicken', chance: 1, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'feather', chance: 1, minQuantity: 5, maxQuantity: 15 },
      { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  cow: {
    id: 'cow',
    name: 'Cow',
    icon: '🐄',
    combatLevel: 2,
    hitpoints: 8,
    maxHit: 1,
    attackSpeed: 2400,
    attackBonus: 2,
    strengthBonus: 2,
    defenceBonus: 2,
    xpReward: { attack: 8, strength: 8, defence: 8, hitpoints: 3 },
    drops: [
      { itemId: 'raw_beef', chance: 1, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'cowhide', chance: 1, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },

  // Goblin camp
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    icon: '👺',
    combatLevel: 5,
    hitpoints: 15,
    maxHit: 2,
    attackSpeed: 2400,
    attackBonus: 5,
    strengthBonus: 5,
    defenceBonus: 5,
    xpReward: { attack: 15, strength: 15, defence: 15, hitpoints: 5 },
    drops: [
      { itemId: 'bronze_dagger', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'bronze_helmet', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  goblin_warrior: {
    id: 'goblin_warrior',
    name: 'Goblin Warrior',
    icon: '👹',
    combatLevel: 10,
    hitpoints: 30,
    maxHit: 4,
    attackSpeed: 2400,
    attackBonus: 12,
    strengthBonus: 10,
    defenceBonus: 10,
    xpReward: { attack: 30, strength: 30, defence: 30, hitpoints: 10 },
    drops: [
      { itemId: 'bronze_sword', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'bronze_platebody', chance: 0.03, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },

  // Undead crypt
  zombie: {
    id: 'zombie',
    name: 'Zombie',
    icon: '🧟',
    combatLevel: 20,
    hitpoints: 50,
    maxHit: 5,
    attackSpeed: 3000,
    attackBonus: 15,
    strengthBonus: 15,
    defenceBonus: 8,
    xpReward: { attack: 50, strength: 50, defence: 50, hitpoints: 17 },
    drops: [
      { itemId: 'iron_sword', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'iron_helmet', chance: 0.03, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  skeleton: {
    id: 'skeleton',
    name: 'Skeleton',
    icon: '💀',
    combatLevel: 25,
    hitpoints: 60,
    maxHit: 6,
    attackSpeed: 2400,
    attackBonus: 20,
    strengthBonus: 18,
    defenceBonus: 15,
    xpReward: { attack: 60, strength: 60, defence: 60, hitpoints: 20 },
    drops: [
      { itemId: 'iron_platebody', chance: 0.03, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },

  // Giant's lair
  hill_giant: {
    id: 'hill_giant',
    name: 'Hill Giant',
    icon: '🦍',
    combatLevel: 35,
    hitpoints: 100,
    maxHit: 8,
    attackSpeed: 3000,
    attackBonus: 30,
    strengthBonus: 35,
    defenceBonus: 25,
    xpReward: { attack: 100, strength: 100, defence: 100, hitpoints: 33 },
    drops: [
      { itemId: 'steel_sword', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'steel_platebody', chance: 0.02, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  moss_giant: {
    id: 'moss_giant',
    name: 'Moss Giant',
    icon: '🌲',
    combatLevel: 45,
    hitpoints: 150,
    maxHit: 10,
    attackSpeed: 3000,
    attackBonus: 40,
    strengthBonus: 45,
    defenceBonus: 35,
    xpReward: { attack: 150, strength: 150, defence: 150, hitpoints: 50 },
    drops: [
      { itemId: 'mithril_sword', chance: 0.03, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'mithril_platebody', chance: 0.01, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },

  // Dragon's den
  green_dragon: {
    id: 'green_dragon',
    name: 'Green Dragon',
    icon: '🐉',
    combatLevel: 60,
    hitpoints: 200,
    maxHit: 15,
    attackSpeed: 2400,
    attackBonus: 55,
    strengthBonus: 60,
    defenceBonus: 50,
    xpReward: { attack: 200, strength: 200, defence: 200, hitpoints: 67 },
    drops: [
      { itemId: 'adamant_sword', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'dragon_bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'dragonhide', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  red_dragon: {
    id: 'red_dragon',
    name: 'Red Dragon',
    icon: '🔥',
    combatLevel: 80,
    hitpoints: 300,
    maxHit: 20,
    attackSpeed: 2400,
    attackBonus: 75,
    strengthBonus: 80,
    defenceBonus: 70,
    xpReward: { attack: 300, strength: 300, defence: 300, hitpoints: 100 },
    drops: [
      { itemId: 'rune_sword', chance: 0.03, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'rune_platebody', chance: 0.01, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'dragon_bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'dragonhide', chance: 1, minQuantity: 2, maxQuantity: 3 },
    ],
  },
};

export const COMBAT_AREAS: CombatArea[] = [
  {
    id: 'farm',
    name: 'Farm',
    icon: '🌾',
    levelRecommendation: '1-5',
    monsters: ['chicken', 'cow'],
  },
  {
    id: 'goblin_camp',
    name: 'Goblin Camp',
    icon: '⛺',
    levelRecommendation: '5-15',
    monsters: ['goblin', 'goblin_warrior'],
  },
  {
    id: 'undead_crypt',
    name: 'Undead Crypt',
    icon: '⚰️',
    levelRecommendation: '20-30',
    monsters: ['zombie', 'skeleton'],
  },
  {
    id: 'giants_lair',
    name: "Giant's Lair",
    icon: '🏔️',
    levelRecommendation: '35-50',
    monsters: ['hill_giant', 'moss_giant'],
  },
  {
    id: 'dragons_den',
    name: "Dragon's Den",
    icon: '🌋',
    levelRecommendation: '60+',
    monsters: ['green_dragon', 'red_dragon'],
  },
];

export function getMonster(id: string): Monster | undefined {
  return MONSTERS[id];
}

export function getCombatArea(id: string): CombatArea | undefined {
  return COMBAT_AREAS.find((a) => a.id === id);
}
