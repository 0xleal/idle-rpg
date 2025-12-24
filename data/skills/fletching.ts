import { SkillingActionDefinition } from '@/types/game';

// Arrow shafts from logs (15 per log)
export const SHAFT_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'fletch_arrow_shafts',
    name: 'Arrow Shafts',
    skillId: 'fletching',
    levelRequired: 1,
    xp: 5,
    baseTime: 2000,
    category: 'shafts',
    inputItems: [{ itemId: 'normal_log', quantity: 1 }],
    itemProduced: { itemId: 'arrow_shaft', quantity: 15 },
  },
];

// Arrows from shafts + feathers + arrowheads (15 per action)
export const ARROW_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'fletch_bronze_arrows',
    name: 'Bronze Arrows',
    skillId: 'fletching',
    levelRequired: 1,
    xp: 20,
    baseTime: 2500,
    category: 'arrows',
    inputItems: [
      { itemId: 'arrow_shaft', quantity: 15 },
      { itemId: 'feather', quantity: 15 },
      { itemId: 'bronze_arrowheads', quantity: 15 },
    ],
    itemProduced: { itemId: 'bronze_arrow', quantity: 15 },
  },
  {
    id: 'fletch_iron_arrows',
    name: 'Iron Arrows',
    skillId: 'fletching',
    levelRequired: 15,
    xp: 38,
    baseTime: 2800,
    category: 'arrows',
    inputItems: [
      { itemId: 'arrow_shaft', quantity: 15 },
      { itemId: 'feather', quantity: 15 },
      { itemId: 'iron_arrowheads', quantity: 15 },
    ],
    itemProduced: { itemId: 'iron_arrow', quantity: 15 },
  },
  {
    id: 'fletch_steel_arrows',
    name: 'Steel Arrows',
    skillId: 'fletching',
    levelRequired: 30,
    xp: 75,
    baseTime: 3000,
    category: 'arrows',
    inputItems: [
      { itemId: 'arrow_shaft', quantity: 15 },
      { itemId: 'feather', quantity: 15 },
      { itemId: 'steel_arrowheads', quantity: 15 },
    ],
    itemProduced: { itemId: 'steel_arrow', quantity: 15 },
  },
  {
    id: 'fletch_mithril_arrows',
    name: 'Mithril Arrows',
    skillId: 'fletching',
    levelRequired: 45,
    xp: 113,
    baseTime: 3300,
    category: 'arrows',
    inputItems: [
      { itemId: 'arrow_shaft', quantity: 15 },
      { itemId: 'feather', quantity: 15 },
      { itemId: 'mithril_arrowheads', quantity: 15 },
    ],
    itemProduced: { itemId: 'mithril_arrow', quantity: 15 },
  },
  {
    id: 'fletch_adamant_arrows',
    name: 'Adamant Arrows',
    skillId: 'fletching',
    levelRequired: 60,
    xp: 150,
    baseTime: 3600,
    category: 'arrows',
    inputItems: [
      { itemId: 'arrow_shaft', quantity: 15 },
      { itemId: 'feather', quantity: 15 },
      { itemId: 'adamant_arrowheads', quantity: 15 },
    ],
    itemProduced: { itemId: 'adamant_arrow', quantity: 15 },
  },
  {
    id: 'fletch_rune_arrows',
    name: 'Rune Arrows',
    skillId: 'fletching',
    levelRequired: 75,
    xp: 188,
    baseTime: 4000,
    category: 'arrows',
    inputItems: [
      { itemId: 'arrow_shaft', quantity: 15 },
      { itemId: 'feather', quantity: 15 },
      { itemId: 'rune_arrowheads', quantity: 15 },
    ],
    itemProduced: { itemId: 'rune_arrow', quantity: 15 },
  },
];

// Bows from logs + bowstring
export const BOW_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'fletch_shortbow',
    name: 'Shortbow',
    skillId: 'fletching',
    levelRequired: 5,
    xp: 10,
    baseTime: 3000,
    category: 'bows',
    inputItems: [
      { itemId: 'normal_log', quantity: 1 },
      { itemId: 'bowstring', quantity: 1 },
    ],
    itemProduced: { itemId: 'shortbow', quantity: 1 },
  },
  {
    id: 'fletch_oak_shortbow',
    name: 'Oak Shortbow',
    skillId: 'fletching',
    levelRequired: 20,
    xp: 25,
    baseTime: 3500,
    category: 'bows',
    inputItems: [
      { itemId: 'oak_log', quantity: 1 },
      { itemId: 'bowstring', quantity: 1 },
    ],
    itemProduced: { itemId: 'oak_shortbow', quantity: 1 },
  },
  {
    id: 'fletch_willow_shortbow',
    name: 'Willow Shortbow',
    skillId: 'fletching',
    levelRequired: 35,
    xp: 42,
    baseTime: 4000,
    category: 'bows',
    inputItems: [
      { itemId: 'willow_log', quantity: 1 },
      { itemId: 'bowstring', quantity: 1 },
    ],
    itemProduced: { itemId: 'willow_shortbow', quantity: 1 },
  },
  {
    id: 'fletch_maple_shortbow',
    name: 'Maple Shortbow',
    skillId: 'fletching',
    levelRequired: 50,
    xp: 58,
    baseTime: 4500,
    category: 'bows',
    inputItems: [
      { itemId: 'maple_log', quantity: 1 },
      { itemId: 'bowstring', quantity: 1 },
    ],
    itemProduced: { itemId: 'maple_shortbow', quantity: 1 },
  },
  {
    id: 'fletch_yew_shortbow',
    name: 'Yew Shortbow',
    skillId: 'fletching',
    levelRequired: 65,
    xp: 75,
    baseTime: 5000,
    category: 'bows',
    inputItems: [
      { itemId: 'yew_log', quantity: 1 },
      { itemId: 'bowstring', quantity: 1 },
    ],
    itemProduced: { itemId: 'yew_shortbow', quantity: 1 },
  },
];

export const FLETCHING_ACTIONS = [...SHAFT_ACTIONS, ...ARROW_ACTIONS, ...BOW_ACTIONS];
