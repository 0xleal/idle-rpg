import { PlayerState, SkillId, Action } from '@/types/game';
import { EquipmentSlot } from '@/types/equipment';

const SAVE_KEY = 'idle-rpg-save';
const SAVE_VERSION = 3;

export interface SaveData {
  version: number;
  lastSaveTime: number;
  skills: Record<SkillId, { xp: number }>;
  inventory: Record<string, number>;
  equipment: Partial<Record<EquipmentSlot, string>>;
  gold: number;
  currentAction: Action | null;
}

/**
 * Save game state to localStorage
 */
export function saveGame(state: PlayerState): void {
  const saveData: SaveData = {
    version: SAVE_VERSION,
    lastSaveTime: Date.now(),
    skills: state.skills,
    inventory: state.inventory,
    equipment: state.equipment,
    gold: state.gold,
    currentAction: state.currentAction,
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

/**
 * Load game state from localStorage
 * Returns null if no save exists or save is corrupted
 */
export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as SaveData;

    // Validate save version
    if (typeof data.version !== 'number') {
      console.warn('Invalid save: missing version');
      return null;
    }

    // Validate required fields
    if (!data.skills || !data.inventory || typeof data.lastSaveTime !== 'number') {
      console.warn('Invalid save: missing required fields');
      return null;
    }

    return data;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

/**
 * Clear saved game data
 */
export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.error('Failed to clear save:', e);
  }
}

/**
 * Check if a save exists
 */
export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
