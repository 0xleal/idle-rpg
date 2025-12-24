// Equipment slot types
export type EquipmentSlot =
  | 'head'
  | 'body'
  | 'legs'
  | 'boots'
  | 'gloves'
  | 'cape'
  | 'amulet'
  | 'ring'
  | 'weapon'
  | 'shield';

export const ALL_EQUIPMENT_SLOTS: EquipmentSlot[] = [
  'head',
  'body',
  'legs',
  'boots',
  'gloves',
  'cape',
  'amulet',
  'ring',
  'weapon',
  'shield',
];

// Combat stats provided by equipment
export interface EquipmentStats {
  attackBonus?: number;
  strengthBonus?: number;
  defenceBonus?: number;
  rangedBonus?: number;
  magicBonus?: number;
}

// Equipment item definition (extends base ItemDefinition)
export interface EquipmentItem {
  id: string;
  name: string;
  icon: string;
  slot: EquipmentSlot;
  stats: EquipmentStats;
  // Level requirements to equip (combat skills only)
  requirements?: Partial<Record<'attack' | 'strength' | 'defence' | 'ranged' | 'magic', number>>;
}

// Slot display names
export const SLOT_NAMES: Record<EquipmentSlot, string> = {
  head: 'Head',
  body: 'Body',
  legs: 'Legs',
  boots: 'Boots',
  gloves: 'Gloves',
  cape: 'Cape',
  amulet: 'Amulet',
  ring: 'Ring',
  weapon: 'Weapon',
  shield: 'Shield',
};
