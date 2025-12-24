import { create } from 'zustand';
import { CombatState, CombatStyle } from '@/types/combat';
import { getMonster } from '@/data/monsters';
import { getItem } from '@/data/resources';
import { useGameStore } from './gameStore';
import { levelForXp } from '@/lib/experience';
import {
  getTotalEquipmentStats,
  getEffectiveAttack,
  getEffectiveStrength,
  getEffectiveDefence,
  getEffectiveRanged,
  getEffectiveMagic,
  calculateHitChance,
  calculateMaxHit,
  rollDamage,
  doesAttackHit,
  getPlayerAttackSpeed,
  getPlayerMaxHp,
} from '@/lib/combat';
import { getEquipment } from '@/data/equipment';

// Arrow damage bonuses
const ARROW_DAMAGE: Record<string, number> = {
  bronze_arrow: 2,
  iron_arrow: 4,
  steel_arrow: 6,
  mithril_arrow: 10,
  adamant_arrow: 15,
  rune_arrow: 22,
};

// Rune costs for magic attacks (basic spell)
const MAGIC_RUNE_COST = [
  { itemId: 'air_rune', quantity: 1 },
  { itemId: 'mind_rune', quantity: 1 },
];

interface CombatExtras {
  combatStyle: CombatStyle;
  selectedFood: string | null;
  selectedAmmo: string | null; // Arrow type for ranged
  autoEatThreshold: number; // 0-1, e.g., 0.5 = eat when below 50% HP
  autoEatEnabled: boolean;
}

interface CombatActions {
  startCombat: (monsterId: string) => void;
  stopCombat: () => void;
  fleeCombat: () => void;
  combatTick: (deltaMs: number) => void;
  eatFood: (itemId: string) => boolean;
  setCombatStyle: (style: CombatStyle) => void;
  setSelectedFood: (itemId: string | null) => void;
  setSelectedAmmo: (itemId: string | null) => void;
  setAutoEatThreshold: (threshold: number) => void;
  setAutoEatEnabled: (enabled: boolean) => void;
}

export type CombatStore = CombatState & CombatActions & CombatExtras;

function createInitialCombatState(): CombatState & CombatExtras {
  return {
    inCombat: false,
    monsterId: null,
    monsterCurrentHp: 0,
    playerCurrentHp: 100,
    playerMaxHp: 100,
    playerAttackTimer: 0,
    monsterAttackTimer: 0,
    lastHitSplat: null,
    lootLog: [],
    combatStyle: 'attack',
    selectedFood: null,
    selectedAmmo: null,
    autoEatThreshold: 0.5, // 50% HP default
    autoEatEnabled: true,
  };
}

// Helper to find any food in inventory
function findAnyFood(gameState: ReturnType<typeof useGameStore.getState>): string | null {
  for (const [itemId, qty] of Object.entries(gameState.inventory)) {
    if (qty <= 0) continue;
    const item = getItem(itemId);
    if (item?.healsFor) return itemId;
  }
  return null;
}

// Helper to find best available arrows in inventory
function findBestArrows(
  gameState: ReturnType<typeof useGameStore.getState>,
  selected: string | null
): string | null {
  // If selected ammo is available, use it
  if (selected && (gameState.inventory[selected] || 0) > 0) {
    return selected;
  }
  // Otherwise find best available
  const arrowOrder = ['rune_arrow', 'adamant_arrow', 'mithril_arrow', 'steel_arrow', 'iron_arrow', 'bronze_arrow'];
  for (const arrowId of arrowOrder) {
    if ((gameState.inventory[arrowId] || 0) > 0) {
      return arrowId;
    }
  }
  return null;
}

// Check if player has bow equipped
function hasRangedWeapon(gameState: ReturnType<typeof useGameStore.getState>): boolean {
  const weaponId = gameState.equipment.weapon;
  if (!weaponId) return false;
  const weapon = getEquipment(weaponId);
  return weapon?.stats.rangedBonus !== undefined && (weapon.stats.rangedBonus || 0) > 0;
}

// Check if player can cast magic (has runes)
function canCastMagic(gameState: ReturnType<typeof useGameStore.getState>): boolean {
  for (const req of MAGIC_RUNE_COST) {
    if ((gameState.inventory[req.itemId] || 0) < req.quantity) {
      return false;
    }
  }
  return true;
}

// Consume magic runes
function consumeMagicRunes(gameState: ReturnType<typeof useGameStore.getState>): void {
  for (const req of MAGIC_RUNE_COST) {
    gameState.removeItem(req.itemId, req.quantity);
  }
}

export const useCombatStore = create<CombatStore>((set, get) => ({
  ...createInitialCombatState(),

  setCombatStyle: (style) => {
    set({ combatStyle: style });
  },

  setSelectedFood: (itemId) => {
    set({ selectedFood: itemId });
  },

  setSelectedAmmo: (itemId) => {
    set({ selectedAmmo: itemId });
  },

  setAutoEatThreshold: (threshold) => {
    set({ autoEatThreshold: Math.max(0, Math.min(1, threshold)) });
  },

  setAutoEatEnabled: (enabled) => {
    set({ autoEatEnabled: enabled });
  },

  startCombat: (monsterId) => {
    const monster = getMonster(monsterId);
    if (!monster) return;

    const gameState = useGameStore.getState();
    const hpLevel = levelForXp(gameState.skills.hitpoints.xp);
    const playerMaxHp = getPlayerMaxHp(Math.max(10, hpLevel)); // Minimum 10 HP at level 1

    set({
      inCombat: true,
      monsterId,
      monsterCurrentHp: monster.hitpoints,
      playerCurrentHp: get().playerCurrentHp || playerMaxHp, // Keep current HP if exists
      playerMaxHp,
      playerAttackTimer: 0,
      monsterAttackTimer: 0,
      lastHitSplat: null,
      lootLog: [],
    });
  },

  stopCombat: () => {
    set({
      inCombat: false,
      monsterId: null,
      monsterCurrentHp: 0,
      playerAttackTimer: 0,
      monsterAttackTimer: 0,
    });
  },

  fleeCombat: () => {
    set({
      inCombat: false,
      monsterId: null,
      monsterCurrentHp: 0,
      playerAttackTimer: 0,
      monsterAttackTimer: 0,
    });
  },

  eatFood: (itemId) => {
    const gameState = useGameStore.getState();
    const { playerCurrentHp, playerMaxHp } = get();

    // Check if we have the food
    if (!gameState.hasItem(itemId)) return false;

    // Get food heal amount
    const itemDef = getItem(itemId);
    if (!itemDef?.healsFor) return false;

    // Already at full HP
    if (playerCurrentHp >= playerMaxHp) return false;

    // Consume food and heal
    gameState.removeItem(itemId, 1);
    const newHp = Math.min(playerMaxHp, playerCurrentHp + itemDef.healsFor);
    set({ playerCurrentHp: newHp });

    return true;
  },

  combatTick: (deltaMs) => {
    const state = get();
    if (!state.inCombat || !state.monsterId) return;

    const monster = getMonster(state.monsterId);
    if (!monster) {
      get().stopCombat();
      return;
    }

    const gameState = useGameStore.getState();
    const equipment = gameState.equipment;
    const equipStats = getTotalEquipmentStats(equipment);

    // Get player combat levels
    const attackLevel = levelForXp(gameState.skills.attack.xp);
    const strengthLevel = levelForXp(gameState.skills.strength.xp);
    const defenceLevel = levelForXp(gameState.skills.defence.xp);
    const rangedLevel = levelForXp(gameState.skills.ranged.xp);
    const magicLevel = levelForXp(gameState.skills.magic.xp);

    // Monster effective stats (simpler)
    const monsterEffAttack = monster.attackBonus + 8;
    const monsterEffDefence = monster.defenceBonus + 8;

    const newState = { ...state };
    let monsterDied = false;
    let playerDied = false;

    // Determine combat mode and calculate stats
    const isRanged = state.combatStyle === 'ranged';
    const isMagic = state.combatStyle === 'magic';

    let playerEffAttack: number;
    let playerEffStrength: number;
    let canAttack = true;
    let arrowId: string | null = null;

    if (isRanged) {
      // Ranged attack
      if (!hasRangedWeapon(gameState)) {
        canAttack = false;
      } else {
        arrowId = findBestArrows(gameState, state.selectedAmmo);
        if (!arrowId) {
          canAttack = false;
        } else {
          playerEffAttack = getEffectiveRanged(rangedLevel, equipStats.rangedBonus || 0);
          const arrowDamage = ARROW_DAMAGE[arrowId] || 0;
          playerEffStrength = getEffectiveRanged(rangedLevel, arrowDamage);
        }
      }
    } else if (isMagic) {
      // Magic attack
      if (!canCastMagic(gameState)) {
        canAttack = false;
      } else {
        playerEffAttack = getEffectiveMagic(magicLevel, equipStats.magicBonus || 0);
        playerEffStrength = getEffectiveMagic(magicLevel, equipStats.magicBonus || 0);
      }
    } else {
      // Melee attack
      playerEffAttack = getEffectiveAttack(attackLevel, equipStats.attackBonus || 0);
      playerEffStrength = getEffectiveStrength(strengthLevel, equipStats.strengthBonus || 0);
    }

    const playerEffDefence = getEffectiveDefence(defenceLevel, equipStats.defenceBonus || 0);

    // Player attack timer
    newState.playerAttackTimer += deltaMs;
    const playerAttackSpeed = getPlayerAttackSpeed();

    while (newState.playerAttackTimer >= playerAttackSpeed && !monsterDied && !playerDied && canAttack) {
      newState.playerAttackTimer -= playerAttackSpeed;

      // Check ammo/runes before attack
      if (isRanged) {
        arrowId = findBestArrows(gameState, state.selectedAmmo);
        if (!arrowId) {
          canAttack = false;
          break;
        }
      }
      if (isMagic && !canCastMagic(gameState)) {
        canAttack = false;
        break;
      }

      const hitChance = calculateHitChance(playerEffAttack!, monsterEffDefence);
      if (doesAttackHit(hitChance)) {
        const maxHit = calculateMaxHit(playerEffStrength!);
        const damage = rollDamage(maxHit);

        newState.monsterCurrentHp = Math.max(0, newState.monsterCurrentHp - damage);
        newState.lastHitSplat = { damage, isPlayer: true, timestamp: Date.now() };

        // Consume ammo/runes
        if (isRanged && arrowId) {
          gameState.removeItem(arrowId, 1);
        }
        if (isMagic) {
          consumeMagicRunes(gameState);
        }

        // Grant combat XP based on combat style
        const xpGained = damage * 4; // Base XP per damage
        const hpXp = Math.floor(xpGained / 3);

        if (state.combatStyle === 'attack') {
          gameState.addXp('attack', xpGained);
        } else if (state.combatStyle === 'strength') {
          gameState.addXp('strength', xpGained);
        } else if (state.combatStyle === 'defence') {
          gameState.addXp('defence', xpGained);
        } else if (state.combatStyle === 'ranged') {
          gameState.addXp('ranged', xpGained);
        } else if (state.combatStyle === 'magic') {
          gameState.addXp('magic', xpGained);
        }
        gameState.addXp('hitpoints', hpXp);
      } else {
        newState.lastHitSplat = { damage: 0, isPlayer: true, timestamp: Date.now() };
        // Still consume ammo on miss
        if (isRanged && arrowId) {
          gameState.removeItem(arrowId, 1);
        }
        if (isMagic) {
          consumeMagicRunes(gameState);
        }
      }

      if (newState.monsterCurrentHp <= 0) {
        monsterDied = true;
      }
    }

    // Monster attack timer
    if (!monsterDied) {
      newState.monsterAttackTimer += deltaMs;

      while (newState.monsterAttackTimer >= monster.attackSpeed && !playerDied) {
        newState.monsterAttackTimer -= monster.attackSpeed;

        const hitChance = calculateHitChance(monsterEffAttack, playerEffDefence);
        if (doesAttackHit(hitChance)) {
          const damage = rollDamage(monster.maxHit);
          newState.playerCurrentHp = Math.max(0, newState.playerCurrentHp - damage);
          newState.lastHitSplat = { damage, isPlayer: false, timestamp: Date.now() };
        } else {
          newState.lastHitSplat = { damage: 0, isPlayer: false, timestamp: Date.now() };
        }

        // Auto-eat when below threshold
        if (state.autoEatEnabled && newState.playerCurrentHp > 0) {
          const hpPercent = newState.playerCurrentHp / newState.playerMaxHp;
          if (hpPercent <= state.autoEatThreshold) {
            // Try to eat selected food first, then any available food
            const foodToEat = state.selectedFood || findAnyFood(gameState);
            if (foodToEat) {
              const foodItem = getItem(foodToEat);
              if (foodItem?.healsFor && gameState.hasItem(foodToEat)) {
                gameState.removeItem(foodToEat, 1);
                newState.playerCurrentHp = Math.min(
                  newState.playerMaxHp,
                  newState.playerCurrentHp + foodItem.healsFor
                );
              }
            }
          }
        }

        if (newState.playerCurrentHp <= 0) {
          playerDied = true;
        }
      }
    }

    // Handle monster death
    if (monsterDied) {
      // Grant bonus XP for kill
      gameState.addXp('attack', monster.xpReward.attack);
      gameState.addXp('strength', monster.xpReward.strength);
      gameState.addXp('defence', monster.xpReward.defence);
      gameState.addXp('hitpoints', monster.xpReward.hitpoints);

      // Roll for drops
      const newLoot: { itemId: string; quantity: number; timestamp: number }[] = [];
      for (const drop of monster.drops) {
        if (Math.random() < drop.chance) {
          const quantity =
            drop.minQuantity === drop.maxQuantity
              ? drop.minQuantity
              : drop.minQuantity + Math.floor(Math.random() * (drop.maxQuantity - drop.minQuantity + 1));
          gameState.addItem(drop.itemId, quantity);
          newLoot.push({ itemId: drop.itemId, quantity, timestamp: Date.now() });
        }
      }

      // Respawn monster immediately
      newState.monsterCurrentHp = monster.hitpoints;
      newState.monsterAttackTimer = 0;
      newState.lootLog = [...newLoot, ...newState.lootLog].slice(0, 10); // Keep last 10 drops
    }

    // Handle player death
    if (playerDied) {
      // Restore HP and flee
      const hpLevel = levelForXp(gameState.skills.hitpoints.xp);
      const playerMaxHp = getPlayerMaxHp(Math.max(10, hpLevel));

      set({
        inCombat: false,
        monsterId: null,
        monsterCurrentHp: 0,
        playerCurrentHp: playerMaxHp, // Full heal on death
        playerMaxHp,
        playerAttackTimer: 0,
        monsterAttackTimer: 0,
        lastHitSplat: null,
      });
      return;
    }

    set(newState);
  },
}));

// Selector for combat level (highest of melee, ranged, or magic)
export const selectCombatLevel = () => {
  const gameState = useGameStore.getState();
  const attackLevel = levelForXp(gameState.skills.attack.xp);
  const strengthLevel = levelForXp(gameState.skills.strength.xp);
  const defenceLevel = levelForXp(gameState.skills.defence.xp);
  const hitpointsLevel = levelForXp(gameState.skills.hitpoints.xp);
  const rangedLevel = levelForXp(gameState.skills.ranged.xp);
  const magicLevel = levelForXp(gameState.skills.magic.xp);

  const base = 0.25 * (defenceLevel + hitpointsLevel);
  const melee = 0.325 * (attackLevel + strengthLevel);
  const ranged = 0.325 * rangedLevel * 1.5;
  const magic = 0.325 * magicLevel * 1.5;

  return Math.floor(base + Math.max(melee, ranged, magic));
};
