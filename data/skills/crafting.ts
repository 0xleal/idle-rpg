import { SkillingActionDefinition } from '@/types/game';

// Tanning hides into leather
export const TANNING_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'tan_leather',
    name: 'Tan Leather',
    skillId: 'crafting',
    levelRequired: 1,
    xp: 10,
    baseTime: 2500,
    category: 'tanning',
    inputItems: [{ itemId: 'cowhide', quantity: 1 }],
    itemProduced: { itemId: 'leather', quantity: 1 },
  },
  {
    id: 'tan_green_dhide',
    name: "Tan Green D'hide",
    skillId: 'crafting',
    levelRequired: 57,
    xp: 75,
    baseTime: 4000,
    category: 'tanning',
    inputItems: [{ itemId: 'dragonhide', quantity: 1 }],
    itemProduced: { itemId: 'green_dhide_leather', quantity: 1 },
  },
];

// Crafting leather armor
export const LEATHER_ARMOR_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'craft_leather_gloves',
    name: 'Leather Gloves',
    skillId: 'crafting',
    levelRequired: 1,
    xp: 14,
    baseTime: 3000,
    category: 'leather',
    inputItems: [{ itemId: 'leather', quantity: 1 }],
    itemProduced: { itemId: 'leather_gloves', quantity: 1 },
  },
  {
    id: 'craft_leather_boots',
    name: 'Leather Boots',
    skillId: 'crafting',
    levelRequired: 7,
    xp: 17,
    baseTime: 3200,
    category: 'leather',
    inputItems: [{ itemId: 'leather', quantity: 1 }],
    itemProduced: { itemId: 'leather_boots', quantity: 1 },
  },
  {
    id: 'craft_leather_cowl',
    name: 'Leather Cowl',
    skillId: 'crafting',
    levelRequired: 9,
    xp: 19,
    baseTime: 3400,
    category: 'leather',
    inputItems: [{ itemId: 'leather', quantity: 1 }],
    itemProduced: { itemId: 'leather_cowl', quantity: 1 },
  },
  {
    id: 'craft_leather_chaps',
    name: 'Leather Chaps',
    skillId: 'crafting',
    levelRequired: 14,
    xp: 27,
    baseTime: 3600,
    category: 'leather',
    inputItems: [{ itemId: 'leather', quantity: 1 }],
    itemProduced: { itemId: 'leather_chaps', quantity: 1 },
  },
  {
    id: 'craft_leather_body',
    name: 'Leather Body',
    skillId: 'crafting',
    levelRequired: 18,
    xp: 35,
    baseTime: 4000,
    category: 'leather',
    inputItems: [{ itemId: 'leather', quantity: 1 }],
    itemProduced: { itemId: 'leather_body', quantity: 1 },
  },
];

// Crafting dragonhide armor
export const DHIDE_ARMOR_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'craft_green_dhide_vambraces',
    name: "Green D'hide Vambraces",
    skillId: 'crafting',
    levelRequired: 57,
    xp: 62,
    baseTime: 4500,
    category: 'dhide',
    inputItems: [{ itemId: 'green_dhide_leather', quantity: 1 }],
    itemProduced: { itemId: 'green_dhide_vambraces', quantity: 1 },
  },
  {
    id: 'craft_green_dhide_chaps',
    name: "Green D'hide Chaps",
    skillId: 'crafting',
    levelRequired: 60,
    xp: 124,
    baseTime: 5000,
    category: 'dhide',
    inputItems: [{ itemId: 'green_dhide_leather', quantity: 2 }],
    itemProduced: { itemId: 'green_dhide_chaps', quantity: 1 },
  },
  {
    id: 'craft_green_dhide_body',
    name: "Green D'hide Body",
    skillId: 'crafting',
    levelRequired: 63,
    xp: 186,
    baseTime: 5500,
    category: 'dhide',
    inputItems: [{ itemId: 'green_dhide_leather', quantity: 3 }],
    itemProduced: { itemId: 'green_dhide_body', quantity: 1 },
  },
];

// Crafting bowstrings from flax
export const SPINNING_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'spin_bowstring',
    name: 'Bowstring',
    skillId: 'crafting',
    levelRequired: 10,
    xp: 15,
    baseTime: 2000,
    category: 'spinning',
    inputItems: [{ itemId: 'flax', quantity: 1 }],
    itemProduced: { itemId: 'bowstring', quantity: 1 },
  },
];

export const CRAFTING_ACTIONS = [
  ...TANNING_ACTIONS,
  ...LEATHER_ARMOR_ACTIONS,
  ...DHIDE_ARMOR_ACTIONS,
  ...SPINNING_ACTIONS,
];
