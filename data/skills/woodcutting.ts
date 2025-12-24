import { SkillingActionDefinition } from '@/types/game';

export const WOODCUTTING_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'normal_tree',
    name: 'Normal Tree',
    skillId: 'woodcutting',
    levelRequired: 1,
    xp: 25,
    baseTime: 3000, // 3 seconds
    itemProduced: { itemId: 'normal_log', quantity: 1 },
  },
  {
    id: 'oak_tree',
    name: 'Oak Tree',
    skillId: 'woodcutting',
    levelRequired: 15,
    xp: 37,
    baseTime: 4000, // 4 seconds
    itemProduced: { itemId: 'oak_log', quantity: 1 },
  },
  {
    id: 'willow_tree',
    name: 'Willow Tree',
    skillId: 'woodcutting',
    levelRequired: 30,
    xp: 67,
    baseTime: 5000, // 5 seconds
    itemProduced: { itemId: 'willow_log', quantity: 1 },
  },
  {
    id: 'maple_tree',
    name: 'Maple Tree',
    skillId: 'woodcutting',
    levelRequired: 45,
    xp: 100,
    baseTime: 6000, // 6 seconds
    itemProduced: { itemId: 'maple_log', quantity: 1 },
  },
  {
    id: 'yew_tree',
    name: 'Yew Tree',
    skillId: 'woodcutting',
    levelRequired: 60,
    xp: 175,
    baseTime: 8000, // 8 seconds
    itemProduced: { itemId: 'yew_log', quantity: 1 },
  },
];
