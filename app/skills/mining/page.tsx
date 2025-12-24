'use client';

import { useGameStore } from '@/store/gameStore';
import { MINING_ACTIONS } from '@/data/skills/mining';
import { getItem } from '@/data/resources';
import { levelForXp, xpForLevel, formatXp, xpProgress } from '@/lib/experience';

export default function MiningPage() {
  const skills = useGameStore((state) => state.skills);
  const currentAction = useGameStore((state) => state.currentAction);
  const startAction = useGameStore((state) => state.startAction);
  const stopAction = useGameStore((state) => state.stopAction);

  const miningXp = skills.mining.xp;
  const currentLevel = levelForXp(miningXp);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const progress = xpProgress(miningXp);

  const isMining = currentAction?.skillId === 'mining';
  const activeActionId = isMining ? currentAction.actionId : null;
  const actionProgress = isMining
    ? currentAction.elapsedMs / currentAction.duration
    : 0;

  const handleRockClick = (actionId: string) => {
    const action = MINING_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    if (currentLevel < action.levelRequired) return;

    if (activeActionId === actionId) {
      stopAction();
      return;
    }

    startAction(action);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Mining
        </h1>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Level {currentLevel}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatXp(miningXp)} / {formatXp(nextLevelXp)} XP
          </span>
        </div>
        <div className="mt-2 h-2 w-64 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-full bg-amber-500 transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {isMining && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-amber-700 dark:text-amber-300">
                Currently mining
              </span>
              <div className="font-medium text-amber-900 dark:text-amber-100">
                {MINING_ACTIONS.find((a) => a.id === activeActionId)?.name}
              </div>
            </div>
            <button
              onClick={stopAction}
              className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
            >
              Stop
            </button>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-amber-200 dark:bg-amber-800">
            <div
              className="h-full bg-amber-500 transition-all duration-100"
              style={{ width: `${actionProgress * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        💎 Chance to find gems while mining any rock!
      </div>

      <div className="grid gap-3">
        {MINING_ACTIONS.map((action) => {
          const isLocked = currentLevel < action.levelRequired;
          const isActive = activeActionId === action.id;
          const item = action.itemProduced
            ? getItem(action.itemProduced.itemId)
            : null;

          return (
            <button
              key={action.id}
              onClick={() => handleRockClick(action.id)}
              disabled={isLocked}
              className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                isActive
                  ? 'border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-950'
                  : isLocked
                    ? 'cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-800 dark:bg-zinc-900'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⛏️</span>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {action.name}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {isLocked
                      ? `Requires level ${action.levelRequired}`
                      : `${action.xp} XP • ${(action.baseTime / 1000).toFixed(1)}s`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                {item && (
                  <>
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
