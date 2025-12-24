'use client';

import { useGameStore } from '@/store/gameStore';
import { FISHING_ACTIONS } from '@/data/skills/fishing';
import { getItem } from '@/data/resources';
import { levelForXp, xpForLevel, formatXp, xpProgress } from '@/lib/experience';

export default function FishingPage() {
  const skills = useGameStore((state) => state.skills);
  const currentAction = useGameStore((state) => state.currentAction);
  const startAction = useGameStore((state) => state.startAction);
  const stopAction = useGameStore((state) => state.stopAction);

  const fishingXp = skills.fishing.xp;
  const currentLevel = levelForXp(fishingXp);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const progress = xpProgress(fishingXp);

  const isFishing = currentAction?.skillId === 'fishing';
  const activeActionId = isFishing ? currentAction.actionId : null;
  const actionProgress = isFishing
    ? currentAction.elapsedMs / currentAction.duration
    : 0;

  const handleSpotClick = (actionId: string) => {
    const action = FISHING_ACTIONS.find((a) => a.id === actionId);
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
          Fishing
        </h1>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Level {currentLevel}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatXp(fishingXp)} / {formatXp(nextLevelXp)} XP
          </span>
        </div>
        <div className="mt-2 h-2 w-64 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-full bg-blue-500 transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {isFishing && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Currently fishing
              </span>
              <div className="font-medium text-blue-900 dark:text-blue-100">
                {FISHING_ACTIONS.find((a) => a.id === activeActionId)?.name}
              </div>
            </div>
            <button
              onClick={stopAction}
              className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
            >
              Stop
            </button>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800">
            <div
              className="h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${actionProgress * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {FISHING_ACTIONS.map((action) => {
          const isLocked = currentLevel < action.levelRequired;
          const isActive = activeActionId === action.id;
          const item = action.itemProduced
            ? getItem(action.itemProduced.itemId)
            : null;

          return (
            <button
              key={action.id}
              onClick={() => handleSpotClick(action.id)}
              disabled={isLocked}
              className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-950'
                  : isLocked
                    ? 'cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-800 dark:bg-zinc-900'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎣</span>
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
