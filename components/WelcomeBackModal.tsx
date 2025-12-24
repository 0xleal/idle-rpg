'use client';

import { OfflineGains, formatDuration } from '@/lib/offline';
import { getItem } from '@/data/resources';
import { formatXp } from '@/lib/experience';
import { SkillId } from '@/types/game';

interface WelcomeBackModalProps {
  gains: OfflineGains;
  onClose: () => void;
}

const SKILL_NAMES: Record<SkillId, string> = {
  woodcutting: 'Woodcutting',
  mining: 'Mining',
  fishing: 'Fishing',
  farming: 'Farming',
  smithing: 'Smithing',
  cooking: 'Cooking',
  fletching: 'Fletching',
  crafting: 'Crafting',
  herblore: 'Herblore',
  attack: 'Attack',
  strength: 'Strength',
  defence: 'Defence',
  hitpoints: 'Hitpoints',
  ranged: 'Ranged',
  magic: 'Magic',
  prayer: 'Prayer',
};

export function WelcomeBackModal({ gains, onClose }: WelcomeBackModalProps) {
  const xpEntries = Object.entries(gains.skillXp).filter(([, xp]) => xp > 0);
  const itemEntries = Object.entries(gains.items).filter(([, count]) => count > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Welcome Back!
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          You were away for {formatDuration(gains.timeAwayMs)}
        </p>

        {gains.actionCompletions > 0 && (
          <div className="mt-4 space-y-3">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              While you were away, you completed {gains.actionCompletions.toLocaleString()} actions:
            </div>

            {/* XP Gains */}
            {xpEntries.length > 0 && (
              <div className="rounded-md bg-green-50 p-3 dark:bg-green-950">
                <div className="text-sm font-medium text-green-800 dark:text-green-200">
                  XP Gained
                </div>
                {xpEntries.map(([skillId, xp]) => (
                  <div
                    key={skillId}
                    className="mt-1 flex items-center justify-between text-sm text-green-700 dark:text-green-300"
                  >
                    <span>{SKILL_NAMES[skillId as SkillId]}</span>
                    <span>+{formatXp(xp)} XP</span>
                  </div>
                ))}
              </div>
            )}

            {/* Item Gains */}
            {itemEntries.length > 0 && (
              <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Items Collected
                </div>
                {itemEntries.map(([itemId, count]) => {
                  const item = getItem(itemId);
                  return (
                    <div
                      key={itemId}
                      className="mt-1 flex items-center justify-between text-sm text-blue-700 dark:text-blue-300"
                    >
                      <span>
                        {item?.icon} {item?.name ?? itemId}
                      </span>
                      <span>+{count.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {gains.actionCompletions === 0 && (
          <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            No actions were in progress while you were away.
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-zinc-900 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
