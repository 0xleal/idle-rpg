import { SkillingActionDefinition } from '@/types/game';

export const PRAYER_ACTIONS: SkillingActionDefinition[] = [
  {
    id: 'bury_bones',
    name: 'Bury Bones',
    skillId: 'prayer',
    levelRequired: 1,
    xp: 5,
    baseTime: 1500,
    inputItems: [{ itemId: 'bones', quantity: 1 }],
  },
  {
    id: 'bury_big_bones',
    name: 'Bury Big Bones',
    skillId: 'prayer',
    levelRequired: 1,
    xp: 15,
    baseTime: 2000,
    inputItems: [{ itemId: 'big_bones', quantity: 1 }],
  },
  {
    id: 'bury_dragon_bones',
    name: 'Bury Dragon Bones',
    skillId: 'prayer',
    levelRequired: 1,
    xp: 72,
    baseTime: 2500,
    inputItems: [{ itemId: 'dragon_bones', quantity: 1 }],
  },
];
