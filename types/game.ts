// Skill identifiers - all skills defined upfront for type safety
export type SkillId =
  // Gathering
  | 'woodcutting'
  | 'mining'
  | 'fishing'
  | 'farming'
  // Artisan
  | 'smithing'
  | 'cooking'
  | 'fletching'
  | 'crafting'
  | 'herblore'
  // Combat
  | 'attack'
  | 'strength'
  | 'defence'
  | 'hitpoints'
  | 'ranged'
  | 'magic'
  | 'prayer';

export const ALL_SKILLS: SkillId[] = [
  'woodcutting', 'mining', 'fishing', 'farming',
  'smithing', 'cooking', 'fletching', 'crafting', 'herblore',
  'attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic', 'prayer',
];

// Current action being performed
export interface Action {
  type: 'skilling'; // 'combat' later
  skillId: SkillId;
  actionId: string; // e.g., 'normal_tree', 'oak_tree'
  duration: number; // ms for one completion
  elapsedMs: number; // time accumulated toward completion
  // Rewards granted on each completion
  xpReward: number;
  itemReward?: {
    itemId: string;
    quantity: number;
  };
}

// Player's skill state
export interface SkillState {
  xp: number;
}

// Full player state (what gets saved)
export interface PlayerState {
  skills: Record<SkillId, SkillState>;
  inventory: Record<string, number>; // itemId -> quantity
  currentAction: Action | null;
  lastTickTime: number; // for offline progress calculation
}

// Resource/item definition (used in data files)
export interface ItemDefinition {
  id: string;
  name: string;
  icon: string; // emoji for MVP
  stackable: boolean;
  sellPrice?: number;
}

// Skilling action definition (used in data files)
export interface SkillingActionDefinition {
  id: string;
  name: string;
  skillId: SkillId;
  levelRequired: number;
  xp: number;
  baseTime: number; // ms
  itemProduced?: {
    itemId: string;
    quantity: number;
  };
}
