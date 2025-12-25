import { create } from 'zustand';
import { PlayerState, Action, SkillId, ALL_SKILLS, SkillingActionDefinition } from '@/types/game';
import { EquipmentSlot } from '@/types/equipment';
import { getEquipment, isEquipment } from '@/data/equipment';
import { getItem } from '@/data/resources';
import { SaveData } from '@/lib/save';
import { levelForXp } from '@/lib/experience';
import { OfflineGains } from '@/lib/offline';

// Generate initial skill state (all at 0 XP)
function createInitialSkills(): Record<SkillId, { xp: number }> {
  const skills = {} as Record<SkillId, { xp: number }>;
  for (const skillId of ALL_SKILLS) {
    skills[skillId] = { xp: 0 };
  }
  return skills;
}

function createInitialState(): PlayerState {
  return {
    skills: createInitialSkills(),
    inventory: {},
    equipment: {},
    gold: 100, // Start with some gold
    currentAction: null,
    lastTickTime: Date.now(),
  };
}

interface GameActions {
  // Start a new skilling action
  startAction: (definition: SkillingActionDefinition) => void;
  // Stop the current action
  stopAction: () => void;
  // Process time passing (handles multiple completions for offline)
  tick: (deltaMs: number) => void;
  // Direct state modifications
  addXp: (skillId: SkillId, amount: number) => void;
  addItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string, quantity: number) => boolean;
  hasItem: (itemId: string, quantity?: number) => boolean;
  getItemCount: (itemId: string) => number;
  // Equipment
  equipItem: (itemId: string) => boolean;
  unequipSlot: (slot: EquipmentSlot) => boolean;
  canEquipItem: (itemId: string) => boolean;
  getEquippedItem: (slot: EquipmentSlot) => string | undefined;
  // Gold & Shop
  addGold: (amount: number) => void;
  removeGold: (amount: number) => boolean;
  buyItem: (itemId: string, price: number, quantity?: number) => boolean;
  sellItem: (itemId: string, quantity?: number) => boolean;
  // Persistence
  loadFromSave: (saveData: SaveData) => void;
  getPlayerState: () => PlayerState;
  // Offline progress
  applyOfflineGains: (gains: OfflineGains, originalAction?: Action | null) => void;
  // Reset to initial state
  reset: () => void;
}

export type GameStore = PlayerState & GameActions;

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  startAction: (definition) => {
    const state = get();

    // Check if player has required inputs (if any)
    if (definition.inputItems && definition.inputItems.length > 0) {
      for (const req of definition.inputItems) {
        const have = state.inventory[req.itemId] || 0;
        if (have < req.quantity) {
          // Can't start - missing materials
          return;
        }
      }
    }

    // Calculate speed bonus from equipped tool
    let speedMultiplier = 1.0;
    const equippedToolId = state.equipment.tool;
    if (equippedToolId) {
      const tool = getEquipment(equippedToolId);
      if (tool?.toolForSkill === definition.skillId && tool.stats.speedBonus) {
        speedMultiplier = 1 - tool.stats.speedBonus;
      }
    }
    const adjustedDuration = Math.round(definition.baseTime * speedMultiplier);

    const action: Action = {
      type: 'skilling',
      skillId: definition.skillId,
      actionId: definition.id,
      duration: adjustedDuration,
      elapsedMs: 0,
      xpReward: definition.xp,
      itemReward: definition.itemProduced,
      inputItems: definition.inputItems,
      bonusDrops: definition.bonusDrops,
    };
    set({ currentAction: action });
  },

  stopAction: () => {
    set({ currentAction: null });
  },

  tick: (deltaMs) => {
    const state = get();
    if (!state.currentAction) return;

    let { elapsedMs } = state.currentAction;
    const { duration, xpReward, itemReward, skillId, bonusDrops, inputItems } = state.currentAction;

    elapsedMs += deltaMs;

    // Count potential completions
    let potentialCompletions = 0;
    while (elapsedMs >= duration) {
      potentialCompletions++;
      elapsedMs -= duration;
    }

    if (potentialCompletions > 0) {
      const newInventory = { ...state.inventory };
      let actualCompletions = potentialCompletions;

      // If action requires inputs, limit completions by available materials
      if (inputItems && inputItems.length > 0) {
        for (const req of inputItems) {
          const have = newInventory[req.itemId] || 0;
          const maxFromThis = Math.floor(have / req.quantity);
          actualCompletions = Math.min(actualCompletions, maxFromThis);
        }

        // Consume inputs
        for (const req of inputItems) {
          const consumed = req.quantity * actualCompletions;
          newInventory[req.itemId] = (newInventory[req.itemId] || 0) - consumed;
        }
      }

      // If we couldn't do any completions, stop the action
      if (actualCompletions === 0) {
        set({ currentAction: null, lastTickTime: Date.now() });
        return;
      }

      // Add back unused time
      const unusedCompletions = potentialCompletions - actualCompletions;
      elapsedMs += unusedCompletions * duration;

      // Apply rewards
      const totalXp = xpReward * actualCompletions;
      const newSkills = { ...state.skills };
      newSkills[skillId] = {
        xp: newSkills[skillId].xp + totalXp,
      };

      if (itemReward) {
        const totalItems = itemReward.quantity * actualCompletions;
        newInventory[itemReward.itemId] = (newInventory[itemReward.itemId] || 0) + totalItems;
      }

      // Roll for bonus drops on each completion
      if (bonusDrops && bonusDrops.length > 0) {
        for (let i = 0; i < actualCompletions; i++) {
          for (const drop of bonusDrops) {
            if (Math.random() < drop.chance) {
              const qty = drop.quantity ?? 1;
              newInventory[drop.itemId] = (newInventory[drop.itemId] || 0) + qty;
            }
          }
        }
      }

      // Check if we can continue (have materials for next completion)
      let canContinue = true;
      if (inputItems && inputItems.length > 0) {
        for (const req of inputItems) {
          const have = newInventory[req.itemId] || 0;
          if (have < req.quantity) {
            canContinue = false;
            break;
          }
        }
      }

      set({
        skills: newSkills,
        inventory: newInventory,
        currentAction: canContinue ? {
          ...state.currentAction,
          elapsedMs,
        } : null,
        lastTickTime: Date.now(),
      });
    } else {
      // Just update elapsed time
      set({
        currentAction: {
          ...state.currentAction,
          elapsedMs,
        },
        lastTickTime: Date.now(),
      });
    }
  },

  addXp: (skillId, amount) => {
    set((state) => ({
      skills: {
        ...state.skills,
        [skillId]: { xp: state.skills[skillId].xp + amount },
      },
    }));
  },

  addItem: (itemId, quantity) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        [itemId]: (state.inventory[itemId] || 0) + quantity,
      },
    }));
  },

  removeItem: (itemId, quantity) => {
    const state = get();
    const current = state.inventory[itemId] || 0;
    if (current < quantity) return false;

    set({
      inventory: {
        ...state.inventory,
        [itemId]: current - quantity,
      },
    });
    return true;
  },

  hasItem: (itemId, quantity = 1) => {
    const state = get();
    return (state.inventory[itemId] || 0) >= quantity;
  },

  getItemCount: (itemId) => {
    const state = get();
    return state.inventory[itemId] || 0;
  },

  canEquipItem: (itemId) => {
    if (!isEquipment(itemId)) return false;
    const equipDef = getEquipment(itemId);
    if (!equipDef) return false;

    const state = get();
    // Check level requirements
    if (equipDef.requirements) {
      for (const [skill, level] of Object.entries(equipDef.requirements)) {
        const skillId = skill as SkillId;
        const playerLevel = levelForXp(state.skills[skillId]?.xp || 0);
        if (playerLevel < level) return false;
      }
    }
    return true;
  },

  equipItem: (itemId) => {
    const state = get();
    if (!isEquipment(itemId)) return false;
    if (!state.canEquipItem(itemId)) return false;
    if ((state.inventory[itemId] || 0) < 1) return false;

    const equipDef = getEquipment(itemId);
    if (!equipDef) return false;

    const newInventory = { ...state.inventory };
    const newEquipment = { ...state.equipment };

    // Remove item from inventory
    newInventory[itemId] = (newInventory[itemId] || 0) - 1;

    // If slot already has item, return it to inventory
    const currentEquipped = newEquipment[equipDef.slot];
    if (currentEquipped) {
      newInventory[currentEquipped] = (newInventory[currentEquipped] || 0) + 1;
    }

    // Equip new item
    newEquipment[equipDef.slot] = itemId;

    set({ inventory: newInventory, equipment: newEquipment });
    return true;
  },

  unequipSlot: (slot) => {
    const state = get();
    const equippedItemId = state.equipment[slot];
    if (!equippedItemId) return false;

    const newInventory = { ...state.inventory };
    const newEquipment = { ...state.equipment };

    // Return item to inventory
    newInventory[equippedItemId] = (newInventory[equippedItemId] || 0) + 1;

    // Remove from equipment
    delete newEquipment[slot];

    set({ inventory: newInventory, equipment: newEquipment });
    return true;
  },

  getEquippedItem: (slot) => {
    const state = get();
    return state.equipment[slot];
  },

  addGold: (amount) => {
    set((state) => ({ gold: state.gold + amount }));
  },

  removeGold: (amount) => {
    const state = get();
    if (state.gold < amount) return false;
    set({ gold: state.gold - amount });
    return true;
  },

  buyItem: (itemId, price, quantity = 1) => {
    const state = get();
    const totalCost = price * quantity;
    if (state.gold < totalCost) return false;

    set({
      gold: state.gold - totalCost,
      inventory: {
        ...state.inventory,
        [itemId]: (state.inventory[itemId] || 0) + quantity,
      },
    });
    return true;
  },

  sellItem: (itemId, quantity = 1) => {
    const state = get();
    const currentQty = state.inventory[itemId] || 0;
    if (currentQty < quantity) return false;

    const itemDef = getItem(itemId);
    if (!itemDef?.sellPrice) return false;

    const totalValue = itemDef.sellPrice * quantity;

    set({
      gold: state.gold + totalValue,
      inventory: {
        ...state.inventory,
        [itemId]: currentQty - quantity,
      },
    });
    return true;
  },

  loadFromSave: (saveData) => {
    // Merge saved skills with initial skills (in case new skills were added)
    const initialSkills = createInitialSkills();
    const mergedSkills = { ...initialSkills };
    for (const skillId of ALL_SKILLS) {
      if (saveData.skills[skillId]) {
        mergedSkills[skillId] = saveData.skills[skillId];
      }
    }

    set({
      skills: mergedSkills,
      inventory: saveData.inventory || {},
      equipment: saveData.equipment || {},
      gold: saveData.gold ?? 100,
      currentAction: saveData.currentAction,
      lastTickTime: saveData.lastSaveTime,
    });
  },

  getPlayerState: () => {
    const state = get();
    return {
      skills: state.skills,
      inventory: state.inventory,
      equipment: state.equipment,
      gold: state.gold,
      currentAction: state.currentAction,
      lastTickTime: state.lastTickTime,
    };
  },

  applyOfflineGains: (gains, originalAction?: Action | null) => {
    const state = get();
    const newSkills = { ...state.skills };
    const newInventory = { ...state.inventory };

    // Apply XP gains
    for (const [skillId, xp] of Object.entries(gains.skillXp)) {
      if (xp && xp > 0) {
        newSkills[skillId as SkillId] = {
          xp: (newSkills[skillId as SkillId]?.xp || 0) + xp,
        };
      }
    }

    // Remove consumed items
    for (const [itemId, qty] of Object.entries(gains.itemsConsumed)) {
      if (qty && qty > 0) {
        newInventory[itemId] = Math.max(0, (newInventory[itemId] || 0) - qty);
      }
    }

    // Add gained items
    for (const [itemId, qty] of Object.entries(gains.itemsGained)) {
      if (qty && qty > 0) {
        newInventory[itemId] = (newInventory[itemId] || 0) + qty;
      }
    }

    // Determine final action state
    let newAction: Action | null = null;
    const actionToUpdate = originalAction ?? state.currentAction;

    if (gains.stoppedEarly) {
      // Clear action if we stopped due to materials
      newAction = null;
    } else if (actionToUpdate && gains.remainingElapsedMs !== undefined) {
      // Update elapsed time for partial progress
      newAction = { ...actionToUpdate, elapsedMs: gains.remainingElapsedMs };
    }

    set({
      skills: newSkills,
      inventory: newInventory,
      currentAction: newAction,
      lastTickTime: Date.now(),
    });
  },

  reset: () => {
    set(createInitialState());
  },
}));

// Selectors for common derived state
export const selectSkillXp = (skillId: SkillId) => (state: GameStore) =>
  state.skills[skillId].xp;

export const selectItemCount = (itemId: string) => (state: GameStore) =>
  state.inventory[itemId] || 0;

export const selectActionProgress = (state: GameStore) => {
  if (!state.currentAction) return 0;
  return state.currentAction.elapsedMs / state.currentAction.duration;
};
