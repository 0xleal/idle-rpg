'use client';

import { useGameStore } from '@/store/gameStore';
import { WOODCUTTING_ACTIONS } from '@/data/skills/woodcutting';
import { getItem } from '@/data/resources';
import { levelForXp, xpForLevel, formatXp, xpProgress } from '@/lib/experience';

export default function WoodcuttingPage() {
  const skills = useGameStore((state) => state.skills);
  const currentAction = useGameStore((state) => state.currentAction);
  const startAction = useGameStore((state) => state.startAction);
  const stopAction = useGameStore((state) => state.stopAction);

  const woodcuttingXp = skills.woodcutting.xp;
  const currentLevel = levelForXp(woodcuttingXp);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const progress = xpProgress(woodcuttingXp);

  const isWoodcutting = currentAction?.skillId === 'woodcutting';
  const activeActionId = isWoodcutting ? currentAction.actionId : null;
  const actionProgress = isWoodcutting
    ? currentAction.elapsedMs / currentAction.duration
    : 0;

  const handleTreeClick = (actionId: string) => {
    const action = WOODCUTTING_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    // Check level requirement
    if (currentLevel < action.levelRequired) return;

    // If clicking the same action, stop it
    if (activeActionId === actionId) {
      stopAction();
      return;
    }

    // Start the new action
    startAction(action);
  };

  return (
    <div>
      {/* Header with skill info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Woodcutting
        </h1>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Level {currentLevel}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatXp(woodcuttingXp)} / {formatXp(nextLevelXp)} XP
          </span>
        </div>
        {/* XP progress bar */}
        <div className="mt-2 h-2 w-64 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-full bg-green-500 transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Current action display */}
      {isWoodcutting && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-green-700 dark:text-green-300">
                Currently chopping
              </span>
              <div className="font-medium text-green-900 dark:text-green-100">
                {WOODCUTTING_ACTIONS.find((a) => a.id === activeActionId)?.name}
              </div>
            </div>
            <button
              onClick={stopAction}
              className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
            >
              Stop
            </button>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-green-200 dark:bg-green-800">
            <div
              className="h-full bg-green-500 transition-all duration-100"
              style={{ width: `${actionProgress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tree list */}
      <div className="grid gap-3">
        {WOODCUTTING_ACTIONS.map((action) => {
          const isLocked = currentLevel < action.levelRequired;
          const isActive = activeActionId === action.id;
          const item = action.itemProduced
            ? getItem(action.itemProduced.itemId)
            : null;

          return (
            <button
              key={action.id}
              onClick={() => handleTreeClick(action.id)}
              disabled={isLocked}
              className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                isActive
                  ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950'
                  : isLocked
                    ? 'cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-800 dark:bg-zinc-900'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌳</span>
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
