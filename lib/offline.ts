import { Action, SkillId } from '@/types/game';

// Maximum offline time to calculate (24 hours in ms)
export const MAX_OFFLINE_TIME = 24 * 60 * 60 * 1000;

export interface OfflineGains {
  timeAwayMs: number;
  skillXp: Record<SkillId, number>;
  items: Record<string, number>;
  actionCompletions: number;
}

/**
 * Calculate what the player gained while offline
 */
export function calculateOfflineProgress(
  elapsedMs: number,
  currentAction: Action | null
): OfflineGains {
  const gains: OfflineGains = {
    timeAwayMs: Math.min(elapsedMs, MAX_OFFLINE_TIME),
    skillXp: {} as Record<SkillId, number>,
    items: {},
    actionCompletions: 0,
  };

  if (!currentAction) {
    return gains;
  }

  // Cap elapsed time
  const cappedTime = Math.min(elapsedMs, MAX_OFFLINE_TIME);

  // Calculate how much progress to add to current action
  let totalTime = currentAction.elapsedMs + cappedTime;

  // Count completions
  while (totalTime >= currentAction.duration) {
    gains.actionCompletions++;
    totalTime -= currentAction.duration;
  }

  if (gains.actionCompletions > 0) {
    // Calculate XP gains
    const totalXp = currentAction.xpReward * gains.actionCompletions;
    gains.skillXp[currentAction.skillId] = totalXp;

    // Calculate item gains
    if (currentAction.itemReward) {
      const totalItems = currentAction.itemReward.quantity * gains.actionCompletions;
      gains.items[currentAction.itemReward.itemId] = totalItems;
    }
  }

  return gains;
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
