import { PlayerState, SkillId, Action } from '@/types/game';
import { EquipmentSlot } from '@/types/equipment';
import {
  validateSaveData,
  generateChecksum,
  verifyChecksum,
  ValidationResult,
} from './validation';

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

export interface SaveDataWithChecksum extends SaveData {
  checksum: string;
}

export interface LoadResult {
  data: SaveData | null;
  validation: ValidationResult | null;
  checksumFailed: boolean;
  error: string | null;
}

/**
 * Save game state to localStorage with checksum
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

  // Generate checksum for tamper detection
  const checksum = generateChecksum(saveData);
  const saveWithChecksum: SaveDataWithChecksum = { ...saveData, checksum };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveWithChecksum));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

/**
 * Load game state from localStorage with validation
 * Returns validated and sanitized data, or null if no save/critically invalid
 */
export function loadGame(): LoadResult {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return {
        data: null,
        validation: null,
        checksumFailed: false,
        error: null,
      };
    }

    const data = JSON.parse(raw) as SaveDataWithChecksum;

    // Verify checksum first (if present)
    const checksumValid = verifyChecksum(data);
    const checksumFailed = data.checksum !== undefined && !checksumValid;

    if (checksumFailed) {
      console.warn('Save data checksum mismatch - possible tampering detected');
    }

    // Validate and sanitize the data
    const validation = validateSaveData(data);

    if (!validation.isValid) {
      console.error('Save validation failed:', validation.errors);
      return {
        data: null,
        validation,
        checksumFailed,
        error: 'Save data is critically invalid',
      };
    }

    if (validation.wasModified) {
      console.warn('Save data was sanitized:', validation.warnings);
    }

    return {
      data: validation.sanitizedData,
      validation,
      checksumFailed,
      error: null,
    };
  } catch (e) {
    console.error('Failed to load game:', e);
    return {
      data: null,
      validation: null,
      checksumFailed: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    };
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

/**
 * Export save data as JSON string for backup
 */
export function exportSave(): string | null {
  try {
    return localStorage.getItem(SAVE_KEY);
  } catch {
    return null;
  }
}

/**
 * Import save data from JSON string
 * Returns true if successful, false if invalid
 */
export function importSave(jsonString: string): LoadResult {
  try {
    const data = JSON.parse(jsonString) as SaveDataWithChecksum;
    const validation = validateSaveData(data);

    if (!validation.isValid) {
      return {
        data: null,
        validation,
        checksumFailed: false,
        error: 'Imported save data is invalid',
      };
    }

    // Re-save with new checksum
    if (validation.sanitizedData) {
      const checksum = generateChecksum(validation.sanitizedData);
      const saveWithChecksum: SaveDataWithChecksum = {
        ...validation.sanitizedData,
        checksum,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveWithChecksum));
    }

    return {
      data: validation.sanitizedData,
      validation,
      checksumFailed: false,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      validation: null,
      checksumFailed: false,
      error: e instanceof Error ? e.message : 'Invalid JSON',
    };
  }
}
