import { Action, SkillId, BonusDrop } from '@/types/game';

// Maximum offline time to calculate (24 hours in ms)
export const MAX_OFFLINE_TIME = 24 * 60 * 60 * 1000;

export interface OfflineGains {
  timeAwayMs: number;
  cappedTimeMs: number;
  skillXp: Partial<Record<SkillId, number>>;
  itemsGained: Record<string, number>;
  itemsConsumed: Record<string, number>;
  actionCompletions: number;
  stoppedEarly: boolean;
  stopReason: 'completed' | 'out_of_materials' | 'time_exhausted' | null;
  remainingElapsedMs: number;
}

/**
 * Roll bonus drops for a number of completions
 */
function rollBonusDrops(
  bonusDrops: BonusDrop[] | undefined,
  completions: number
): Record<string, number> {
  const drops: Record<string, number> = {};

  if (!bonusDrops || bonusDrops.length === 0) {
    return drops;
  }

  // For each completion, roll each bonus drop
  for (let i = 0; i < completions; i++) {
    for (const drop of bonusDrops) {
      if (Math.random() < drop.chance) {
        const qty = drop.quantity || 1;
        drops[drop.itemId] = (drops[drop.itemId] || 0) + qty;
      }
    }
  }

  return drops;
}

/**
 * Simulate offline progress with proper material consumption
 * This calculates what was gained/consumed while offline
 */
export function simulateOfflineProgress(
  elapsedMs: number,
  currentAction: Action | null,
  inventory: Record<string, number>
): OfflineGains {
  const gains: OfflineGains = {
    timeAwayMs: elapsedMs,
    cappedTimeMs: Math.min(elapsedMs, MAX_OFFLINE_TIME),
    skillXp: {},
    itemsGained: {},
    itemsConsumed: {},
    actionCompletions: 0,
    stoppedEarly: false,
    stopReason: null,
    remainingElapsedMs: 0,
  };

  if (!currentAction) {
    gains.stopReason = 'completed';
    return gains;
  }

  // Create mutable copy of inventory for simulation
  const simInventory = { ...inventory };

  // Cap elapsed time
  const cappedTime = Math.min(elapsedMs, MAX_OFFLINE_TIME);

  // Calculate how much time is available
  let remainingTime = currentAction.elapsedMs + cappedTime;

  // Process completions one at a time to properly track materials
  while (remainingTime >= currentAction.duration) {
    // Check if we have required materials
    if (currentAction.inputItems && currentAction.inputItems.length > 0) {
      let canComplete = true;

      for (const req of currentAction.inputItems) {
        if ((simInventory[req.itemId] || 0) < req.quantity) {
          canComplete = false;
          break;
        }
      }

      if (!canComplete) {
        // Not enough materials to complete
        gains.stoppedEarly = true;
        gains.stopReason = 'out_of_materials';
        gains.remainingElapsedMs = 0; // Reset progress since we can't continue
        break;
      }

      // Consume materials
      for (const req of currentAction.inputItems) {
        simInventory[req.itemId] = (simInventory[req.itemId] || 0) - req.quantity;
        gains.itemsConsumed[req.itemId] =
          (gains.itemsConsumed[req.itemId] || 0) + req.quantity;
      }
    }

    // Complete the action
    gains.actionCompletions++;
    remainingTime -= currentAction.duration;

    // Add XP
    gains.skillXp[currentAction.skillId] =
      (gains.skillXp[currentAction.skillId] || 0) + currentAction.xpReward;

    // Add item reward
    if (currentAction.itemReward) {
      const itemId = currentAction.itemReward.itemId;
      const qty = currentAction.itemReward.quantity;
      gains.itemsGained[itemId] = (gains.itemsGained[itemId] || 0) + qty;
      simInventory[itemId] = (simInventory[itemId] || 0) + qty;
    }
  }

  // Roll bonus drops for all completions at once (for performance)
  if (gains.actionCompletions > 0 && currentAction.bonusDrops) {
    const bonusDrops = rollBonusDrops(
      currentAction.bonusDrops,
      gains.actionCompletions
    );
    for (const [itemId, qty] of Object.entries(bonusDrops)) {
      gains.itemsGained[itemId] = (gains.itemsGained[itemId] || 0) + qty;
    }
  }

  // Set remaining elapsed time if we didn't stop early
  if (!gains.stoppedEarly) {
    gains.remainingElapsedMs = remainingTime;
    gains.stopReason = 'time_exhausted';
  }

  return gains;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use simulateOfflineProgress instead
 */
export function calculateOfflineProgress(
  elapsedMs: number,
  currentAction: Action | null
): OfflineGains {
  // This is a simplified version that doesn't track materials
  // Use simulateOfflineProgress for accurate calculations
  return simulateOfflineProgress(elapsedMs, currentAction, {});
}

/**
 * Format time duration for display
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Check if gains are worth showing a modal for
 */
export function hasSignificantGains(gains: OfflineGains): boolean {
  // Show modal if away for more than 10 seconds and had an action
  return gains.timeAwayMs > 10000 && gains.actionCompletions > 0;
}
