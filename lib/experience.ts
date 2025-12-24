// RuneScape-style XP curve
// Level 99 = 13,034,431 XP

const MAX_LEVEL = 99;

// Pre-calculate XP thresholds for each level (1-99)
// xpTable[level] = total XP needed to reach that level
const xpTable: number[] = [0]; // Index 0 unused, level 1 = 0 XP

function buildXpTable(): void {
  let totalXp = 0;
  for (let level = 1; level < MAX_LEVEL; level++) {
    // XP needed for next level
    const xpForNext = Math.floor((level + 300 * Math.pow(2, level / 7)) / 4);
    totalXp += xpForNext;
    xpTable.push(Math.floor(totalXp));
  }
}

buildXpTable();

/**
 * Get the total XP required to reach a given level
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > MAX_LEVEL) return xpTable[MAX_LEVEL - 1];
  return xpTable[level - 1];
}

/**
 * Get the current level for a given XP amount
 */
export function levelForXp(xp: number): number {
  if (xp <= 0) return 1;

  // Binary search for efficiency
  let low = 1;
  let high = MAX_LEVEL;

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    if (xpForLevel(mid) <= xp) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return low;
}

/**
 * Get XP progress within current level (0-1)
 */
export function xpProgress(xp: number): number {
  const level = levelForXp(xp);
  if (level >= MAX_LEVEL) return 1;

  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpInLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  return xpInLevel / xpNeeded;
}

/**
 * Get XP remaining until next level
 */
export function xpToNextLevel(xp: number): number {
  const level = levelForXp(xp);
  if (level >= MAX_LEVEL) return 0;

  const nextLevelXp = xpForLevel(level + 1);
  return nextLevelXp - xp;
}

/**
 * Format XP number with commas
 */
export function formatXp(xp: number): string {
  return Math.floor(xp).toLocaleString();
}

export { MAX_LEVEL };
