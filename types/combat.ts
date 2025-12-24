// Monster drop definition
export interface MonsterDrop {
  itemId: string;
  chance: number; // 0-1
  minQuantity: number;
  maxQuantity: number;
}

// Monster definition
export interface Monster {
  id: string;
  name: string;
  icon: string;
  combatLevel: number;
  hitpoints: number;
  maxHit: number;
  attackSpeed: number; // ms between attacks
  attackBonus: number;
  strengthBonus: number;
  defenceBonus: number;
  xpReward: {
    attack: number;
    strength: number;
    defence: number;
    hitpoints: number;
  };
  drops: MonsterDrop[];
}

// Combat area containing monsters
export interface CombatArea {
  id: string;
  name: string;
  icon: string;
  levelRecommendation: string; // e.g., "1-10"
  monsters: string[]; // monster IDs
}

// Current combat state
export interface CombatState {
  inCombat: boolean;
  monsterId: string | null;
  monsterCurrentHp: number;
  playerCurrentHp: number;
  playerMaxHp: number;
  playerAttackTimer: number; // ms accumulated toward next attack
  monsterAttackTimer: number;
  lastHitSplat: { damage: number; isPlayer: boolean; timestamp: number } | null;
  lootLog: { itemId: string; quantity: number; timestamp: number }[];
}

// Combat style determines which skill gets primary XP
export type CombatStyle = 'attack' | 'strength' | 'defence' | 'ranged' | 'magic';
