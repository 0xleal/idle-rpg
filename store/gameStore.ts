import { create } from 'zustand';
import { PlayerState, Action, SkillId, ALL_SKILLS, SkillingActionDefinition } from '@/types/game';
import { SaveData } from '@/lib/save';

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
  // Persistence
  loadFromSave: (saveData: SaveData) => void;
  getPlayerState: () => PlayerState;
  // Reset to initial state
  reset: () => void;
}

export type GameStore = PlayerState & GameActions;

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  startAction: (definition) => {
    const action: Action = {
      type: 'skilling',
      skillId: definition.skillId,
      actionId: definition.id,
      duration: definition.baseTime,
      elapsedMs: 0,
      xpReward: definition.xp,
      itemReward: definition.itemProduced,
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
    const { duration, xpReward, itemReward, skillId } = state.currentAction;

    elapsedMs += deltaMs;

    // Track rewards to apply
    let completions = 0;
    while (elapsedMs >= duration) {
      completions++;
      elapsedMs -= duration;
    }

    if (completions > 0) {
      // Apply all rewards at once (more efficient)
      const totalXp = xpReward * completions;
      const newSkills = { ...state.skills };
      newSkills[skillId] = {
        xp: newSkills[skillId].xp + totalXp,
      };

      const newInventory = { ...state.inventory };
      if (itemReward) {
        const totalItems = itemReward.quantity * completions;
        newInventory[itemReward.itemId] = (newInventory[itemReward.itemId] || 0) + totalItems;
      }

      set({
        skills: newSkills,
        inventory: newInventory,
        currentAction: {
          ...state.currentAction,
          elapsedMs,
        },
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
      currentAction: saveData.currentAction,
      lastTickTime: saveData.lastSaveTime,
    });
  },

  getPlayerState: () => {
    const state = get();
    return {
      skills: state.skills,
      inventory: state.inventory,
      currentAction: state.currentAction,
      lastTickTime: state.lastTickTime,
    };
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
