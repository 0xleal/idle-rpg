import { ItemDefinition } from '@/types/game';

export const ITEMS: Record<string, ItemDefinition> = {
  // Logs
  normal_log: {
    id: 'normal_log',
    name: 'Log',
    icon: '🪵',
    stackable: true,
    sellPrice: 1,
  },
  oak_log: {
    id: 'oak_log',
    name: 'Oak Log',
    icon: '🪵',
    stackable: true,
    sellPrice: 5,
  },
  willow_log: {
    id: 'willow_log',
    name: 'Willow Log',
    icon: '🪵',
    stackable: true,
    sellPrice: 10,
  },
  maple_log: {
    id: 'maple_log',
    name: 'Maple Log',
    icon: '🪵',
    stackable: true,
    sellPrice: 25,
  },
  yew_log: {
    id: 'yew_log',
    name: 'Yew Log',
    icon: '🪵',
    stackable: true,
    sellPrice: 50,
  },
};

export function getItem(id: string): ItemDefinition | undefined {
  return ITEMS[id];
}
