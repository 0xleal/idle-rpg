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
  const xpEntries = Object.entries(gains.skillXp).filter(([, xp]) => xp && xp > 0);
  const itemsGainedEntries = Object.entries(gains.itemsGained).filter(([, count]) => count > 0);
  const itemsConsumedEntries = Object.entries(gains.itemsConsumed).filter(([, count]) => count > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌙</span>
          <div>
            <h2 className="font-[var(--font-cinzel)] text-xl font-bold text-gradient">
              Welcome Back!
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              You were away for {formatDuration(gains.timeAwayMs)}
            </p>
          </div>
        </div>

        {gains.actionCompletions > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-[var(--text-secondary)]">
              Completed <span className="font-bold text-[var(--text-primary)]">{gains.actionCompletions.toLocaleString()}</span> actions while away
              {gains.stoppedEarly && gains.stopReason === 'out_of_materials' && (
                <span className="text-[#f59e0b]"> (stopped: ran out of materials)</span>
              )}
            </div>

            {/* XP Gains */}
            {xpEntries.length > 0 && (
              <div className="rounded-lg p-3 bg-[#22c55e]/10 border border-[#22c55e]/20">
                <div className="text-sm font-medium text-[#22c55e] mb-2">
                  XP Gained
                </div>
                {xpEntries.map(([skillId, xp]) => (
                  <div
                    key={skillId}
                    className="flex items-center justify-between text-sm text-[#4ade80]"
                  >
                    <span>{SKILL_NAMES[skillId as SkillId]}</span>
                    <span>+{formatXp(xp!)} XP</span>
                  </div>
                ))}
              </div>
            )}

            {/* Items Gained */}
            {itemsGainedEntries.length > 0 && (
              <div className="rounded-lg p-3 bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                <div className="text-sm font-medium text-[#3b82f6] mb-2">
                  Items Gained
                </div>
                {itemsGainedEntries.map(([itemId, count]) => {
                  const item = getItem(itemId);
                  return (
                    <div
                      key={itemId}
                      className="flex items-center justify-between text-sm text-[#60a5fa]"
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

            {/* Items Consumed */}
            {itemsConsumedEntries.length > 0 && (
              <div className="rounded-lg p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/20">
                <div className="text-sm font-medium text-[#f59e0b] mb-2">
                  Materials Used
                </div>
                {itemsConsumedEntries.map(([itemId, count]) => {
                  const item = getItem(itemId);
                  return (
                    <div
                      key={itemId}
                      className="flex items-center justify-between text-sm text-[#fbbf24]"
                    >
                      <span>
                        {item?.icon} {item?.name ?? itemId}
                      </span>
                      <span>-{count.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {gains.actionCompletions === 0 && (
          <div className="text-sm text-[var(--text-muted)] py-4 text-center">
            No actions were completed while you were away.
          </div>
        )}

        <button
          onClick={onClose}
          className="btn-primary w-full mt-6"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
