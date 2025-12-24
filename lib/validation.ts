import { SaveData } from './save';
import { xpForLevel, levelForXp } from './experience';
import { ALL_SKILLS, SkillId, Action } from '@/types/game';
import { EQUIPMENT, getEquipment } from '@/data/equipment';
import { ITEMS } from '@/data/resources';
import { ALL_EQUIPMENT_SLOTS, EquipmentSlot } from '@/types/equipment';

// Max XP is XP required for level 99
const MAX_LEVEL = 99;
const MAX_XP = xpForLevel(MAX_LEVEL);
const MAX_STACK = 2147483647; // Max 32-bit signed int

// Checksum secret - not truly secure, just adds complexity to deter casual editing
const CHECKSUM_SECRET = 'idle-rpg-v1-anticheat';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'critical';
}

export interface ValidationWarning {
  field: string;
  message: string;
  action: string;
}

export interface ValidationResult {
  isValid: boolean;
  wasModified: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  sanitizedData: SaveData | null;
}

/**
 * Generate a simple checksum for save data
 * Not cryptographically secure, but deters casual editing
 */
export function generateChecksum(data: Omit<SaveData, 'checksum'>): string {
  // Create deterministic string from save data
  const payload = JSON.stringify({
    v: data.version,
    t: data.lastSaveTime,
    s: Object.entries(data.skills)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v.xp}`),
    i: Object.entries(data.inventory)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`),
    e: Object.entries(data.equipment)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`),
    g: data.gold,
    a: data.currentAction?.actionId || null,
  });

  // Simple hash (djb2 algorithm)
  let hash = 5381;
  const str = CHECKSUM_SECRET + payload;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(36); // Convert to unsigned and base36
}

/**
 * Verify checksum matches save data
 */
export function verifyChecksum(
  data: SaveData & { checksum?: string }
): boolean {
  if (!data.checksum) return false;
  const { checksum, ...rest } = data;
  return generateChecksum(rest as SaveData) === checksum;
}

/**
 * Check if an item ID is valid (exists in ITEMS or EQUIPMENT)
 */
function isValidItemId(itemId: string): boolean {
  return itemId in ITEMS || itemId in EQUIPMENT;
}

/**
 * Validate and sanitize save data
 * Returns sanitized data with issues fixed, or null if critically invalid
 */
export function validateSaveData(
  data: SaveData & { checksum?: string }
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    wasModified: false,
    errors: [],
    warnings: [],
    sanitizedData: null,
  };

  // Deep clone for sanitization (strip checksum)
  const { checksum: _, ...dataWithoutChecksum } = data;
  const sanitized = JSON.parse(JSON.stringify(dataWithoutChecksum)) as SaveData;

  // 1. Validate version
  if (typeof sanitized.version !== 'number' || sanitized.version < 1) {
    result.errors.push({
      field: 'version',
      message: 'Invalid save version',
      severity: 'critical',
    });
    result.isValid = false;
    return result;
  }

  // 2. Validate lastSaveTime
  const now = Date.now();
  if (
    typeof sanitized.lastSaveTime !== 'number' ||
    sanitized.lastSaveTime < 0 ||
    sanitized.lastSaveTime > now + 60000 // Allow 1 min future tolerance
  ) {
    sanitized.lastSaveTime = now;
    result.wasModified = true;
    result.warnings.push({
      field: 'lastSaveTime',
      message: 'Invalid timestamp',
      action: 'Reset to current time',
    });
  }

  // 3. Validate skills
  if (!sanitized.skills || typeof sanitized.skills !== 'object') {
    sanitized.skills = {} as Record<SkillId, { xp: number }>;
    result.wasModified = true;
    result.warnings.push({
      field: 'skills',
      message: 'Missing skills object',
      action: 'Initialized empty',
    });
  }

  for (const skillId of ALL_SKILLS) {
    const skill = sanitized.skills[skillId];

    // Check skill exists
    if (!skill || typeof skill.xp !== 'number') {
      sanitized.skills[skillId] = { xp: skillId === 'hitpoints' ? 1154 : 0 }; // Hitpoints starts at level 10
      result.wasModified = true;
      result.warnings.push({
        field: `skills.${skillId}`,
        message: 'Missing or invalid skill data',
        action: 'Reset to default XP',
      });
      continue;
    }

    // Check XP bounds
    if (skill.xp < 0) {
      sanitized.skills[skillId] = { xp: 0 };
      result.wasModified = true;
      result.warnings.push({
        field: `skills.${skillId}.xp`,
        message: `Negative XP detected: ${skill.xp}`,
        action: 'Reset to 0',
      });
    } else if (skill.xp > MAX_XP) {
      sanitized.skills[skillId] = { xp: MAX_XP };
      result.wasModified = true;
      result.warnings.push({
        field: `skills.${skillId}.xp`,
        message: `XP exceeds maximum: ${skill.xp}`,
        action: `Capped to ${MAX_XP}`,
      });
    } else if (!Number.isFinite(skill.xp)) {
      sanitized.skills[skillId] = { xp: 0 };
      result.wasModified = true;
      result.warnings.push({
        field: `skills.${skillId}.xp`,
        message: `Invalid XP value: ${skill.xp}`,
        action: 'Reset to 0',
      });
    }
  }

  // 4. Validate inventory
  if (!sanitized.inventory || typeof sanitized.inventory !== 'object') {
    sanitized.inventory = {};
    result.wasModified = true;
    result.warnings.push({
      field: 'inventory',
      message: 'Invalid inventory object',
      action: 'Reset to empty',
    });
  } else {
    const invalidItems: string[] = [];
    for (const [itemId, quantity] of Object.entries(sanitized.inventory)) {
      // Check item exists in game data
      if (!isValidItemId(itemId)) {
        invalidItems.push(itemId);
        continue;
      }

      // Check quantity is valid
      if (
        typeof quantity !== 'number' ||
        !Number.isInteger(quantity) ||
        quantity < 0
      ) {
        sanitized.inventory[itemId] = 0;
        result.wasModified = true;
        result.warnings.push({
          field: `inventory.${itemId}`,
          message: `Invalid quantity: ${quantity}`,
          action: 'Reset to 0',
        });
      }

      // Cap unreasonably high quantities
      if (quantity > MAX_STACK) {
        sanitized.inventory[itemId] = MAX_STACK;
        result.wasModified = true;
        result.warnings.push({
          field: `inventory.${itemId}`,
          message: `Quantity exceeds maximum: ${quantity}`,
          action: `Capped to ${MAX_STACK}`,
        });
      }
    }

    // Remove invalid items
    for (const itemId of invalidItems) {
      delete sanitized.inventory[itemId];
      result.wasModified = true;
      result.warnings.push({
        field: `inventory.${itemId}`,
        message: 'Unknown item ID',
        action: 'Removed from inventory',
      });
    }

    // Clean up zero quantities
    for (const [itemId, quantity] of Object.entries(sanitized.inventory)) {
      if (quantity === 0) {
        delete sanitized.inventory[itemId];
      }
    }
  }

  // 5. Validate gold
  if (
    typeof sanitized.gold !== 'number' ||
    sanitized.gold < 0 ||
    !Number.isFinite(sanitized.gold)
  ) {
    sanitized.gold = 0;
    result.wasModified = true;
    result.warnings.push({
      field: 'gold',
      message: `Invalid gold amount: ${data.gold}`,
      action: 'Reset to 0',
    });
  } else if (sanitized.gold > MAX_STACK) {
    sanitized.gold = MAX_STACK;
    result.wasModified = true;
    result.warnings.push({
      field: 'gold',
      message: `Gold exceeds maximum: ${sanitized.gold}`,
      action: `Capped to ${MAX_STACK}`,
    });
  }

  // 6. Validate equipment
  if (!sanitized.equipment || typeof sanitized.equipment !== 'object') {
    sanitized.equipment = {};
    result.wasModified = true;
    result.warnings.push({
      field: 'equipment',
      message: 'Invalid equipment object',
      action: 'Reset to empty',
    });
  } else {
    for (const slot of ALL_EQUIPMENT_SLOTS) {
      const equippedItemId = sanitized.equipment[slot];
      if (!equippedItemId) continue;

      // Check item exists and is equipment
      const equipDef = getEquipment(equippedItemId);
      if (!equipDef) {
        delete sanitized.equipment[slot];
        result.wasModified = true;
        result.warnings.push({
          field: `equipment.${slot}`,
          message: `Invalid equipment ID: ${equippedItemId}`,
          action: 'Unequipped',
        });
        continue;
      }

      // Check slot matches
      if (equipDef.slot !== slot) {
        delete sanitized.equipment[slot];
        result.wasModified = true;
        result.warnings.push({
          field: `equipment.${slot}`,
          message: `Item ${equippedItemId} cannot go in ${slot} slot`,
          action: 'Unequipped',
        });
        continue;
      }

      // Check level requirements
      if (equipDef.requirements) {
        let meetsRequirements = true;
        for (const [skill, reqLevel] of Object.entries(equipDef.requirements)) {
          const playerLevel = levelForXp(
            sanitized.skills[skill as SkillId]?.xp || 0
          );
          if (playerLevel < reqLevel) {
            meetsRequirements = false;
            break;
          }
        }
        if (!meetsRequirements) {
          // Return item to inventory
          sanitized.inventory[equippedItemId] =
            (sanitized.inventory[equippedItemId] || 0) + 1;
          delete sanitized.equipment[slot];
          result.wasModified = true;
          result.warnings.push({
            field: `equipment.${slot}`,
            message: `Level requirements not met for ${equippedItemId}`,
            action: 'Unequipped and returned to inventory',
          });
        }
      }
    }

    // Remove any invalid slots
    for (const slot of Object.keys(sanitized.equipment)) {
      if (!ALL_EQUIPMENT_SLOTS.includes(slot as EquipmentSlot)) {
        delete sanitized.equipment[slot as EquipmentSlot];
        result.wasModified = true;
        result.warnings.push({
          field: `equipment.${slot}`,
          message: 'Invalid equipment slot',
          action: 'Removed',
        });
      }
    }
  }

  // 7. Validate currentAction
  if (sanitized.currentAction !== null) {
    const action = sanitized.currentAction as Action;

    // Validate basic structure
    if (
      !action.skillId ||
      !action.actionId ||
      typeof action.duration !== 'number' ||
      typeof action.elapsedMs !== 'number' ||
      !ALL_SKILLS.includes(action.skillId)
    ) {
      sanitized.currentAction = null;
      result.wasModified = true;
      result.warnings.push({
        field: 'currentAction',
        message: 'Invalid action structure',
        action: 'Cleared current action',
      });
    } else {
      // Validate elapsedMs bounds
      if (action.elapsedMs < 0) {
        sanitized.currentAction.elapsedMs = 0;
        result.wasModified = true;
      }
      if (action.elapsedMs > action.duration) {
        sanitized.currentAction.elapsedMs = action.duration - 1;
        result.wasModified = true;
      }
      // Validate duration is positive
      if (action.duration <= 0) {
        sanitized.currentAction = null;
        result.wasModified = true;
        result.warnings.push({
          field: 'currentAction',
          message: 'Invalid action duration',
          action: 'Cleared current action',
        });
      }
    }
  }

  result.sanitizedData = sanitized;
  return result;
}
