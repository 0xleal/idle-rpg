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
  calculateHitChance,
  calculateMaxHit,
  rollDamage,
  doesAttackHit,
  getPlayerAttackSpeed,
  getPlayerMaxHp,
} from '@/lib/combat';

interface CombatExtras {
  combatStyle: CombatStyle;
  selectedFood: string | null;
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

export const useCombatStore = create<CombatStore>((set, get) => ({
  ...createInitialCombatState(),

  setCombatStyle: (style) => {
    set({ combatStyle: style });
  },

  setSelectedFood: (itemId) => {
    set({ selectedFood: itemId });
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

    // Calculate effective stats
    const playerEffAttack = getEffectiveAttack(attackLevel, equipStats.attackBonus || 0);
    const playerEffStrength = getEffectiveStrength(strengthLevel, equipStats.strengthBonus || 0);
    const playerEffDefence = getEffectiveDefence(defenceLevel, equipStats.defenceBonus || 0);

    // Monster effective stats (simpler)
    const monsterEffAttack = monster.attackBonus + 8;
    const monsterEffDefence = monster.defenceBonus + 8;

    const newState = { ...state };
    let monsterDied = false;
    let playerDied = false;

    // Player attack timer
    newState.playerAttackTimer += deltaMs;
    const playerAttackSpeed = getPlayerAttackSpeed();

    while (newState.playerAttackTimer >= playerAttackSpeed && !monsterDied && !playerDied) {
      newState.playerAttackTimer -= playerAttackSpeed;

      const hitChance = calculateHitChance(playerEffAttack, monsterEffDefence);
      if (doesAttackHit(hitChance)) {
        const maxHit = calculateMaxHit(playerEffStrength);
        const damage = rollDamage(maxHit);

        newState.monsterCurrentHp = Math.max(0, newState.monsterCurrentHp - damage);
        newState.lastHitSplat = { damage, isPlayer: true, timestamp: Date.now() };

        // Grant combat XP based on combat style
        const xpGained = damage * 4; // Base XP per damage
        const hpXp = Math.floor(xpGained / 3);

        if (state.combatStyle === 'attack') {
          gameState.addXp('attack', xpGained);
        } else if (state.combatStyle === 'strength') {
          gameState.addXp('strength', xpGained);
        } else if (state.combatStyle === 'defence') {
          gameState.addXp('defence', xpGained);
        }
        gameState.addXp('hitpoints', hpXp);
      } else {
        newState.lastHitSplat = { damage: 0, isPlayer: true, timestamp: Date.now() };
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

// Selector for combat level
export const selectCombatLevel = () => {
  const gameState = useGameStore.getState();
  const attackLevel = levelForXp(gameState.skills.attack.xp);
  const strengthLevel = levelForXp(gameState.skills.strength.xp);
  const defenceLevel = levelForXp(gameState.skills.defence.xp);
  const hitpointsLevel = levelForXp(gameState.skills.hitpoints.xp);

  const base = 0.25 * (defenceLevel + hitpointsLevel);
  const melee = 0.325 * (attackLevel + strengthLevel);
  return Math.floor(base + melee);
};
