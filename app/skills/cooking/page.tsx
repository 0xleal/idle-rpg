'use client';

import { useGameStore } from '@/store/gameStore';
import { COOKING_ACTIONS } from '@/data/skills/cooking';
import { getItem } from '@/data/resources';
import { levelForXp, xpForLevel, formatXp, xpProgress } from '@/lib/experience';
import { SkillingActionDefinition } from '@/types/game';

export default function CookingPage() {
  const skills = useGameStore((state) => state.skills);
  const inventory = useGameStore((state) => state.inventory);
  const currentAction = useGameStore((state) => state.currentAction);
  const startAction = useGameStore((state) => state.startAction);
  const stopAction = useGameStore((state) => state.stopAction);

  const cookingXp = skills.cooking.xp;
  const currentLevel = levelForXp(cookingXp);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const progress = xpProgress(cookingXp);

  const isCooking = currentAction?.skillId === 'cooking';
  const activeActionId = isCooking ? currentAction.actionId : null;
  const actionProgress = isCooking
    ? currentAction.elapsedMs / currentAction.duration
    : 0;

  const canCook = (action: SkillingActionDefinition): boolean => {
    if (currentLevel < action.levelRequired) return false;
    if (!action.inputItems) return true;
    return action.inputItems.every(
      (req) => (inventory[req.itemId] || 0) >= req.quantity
    );
  };

  const handleActionClick = (actionId: string) => {
    const action = COOKING_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    if (activeActionId === actionId) {
      stopAction();
      return;
    }

    if (!canCook(action)) return;
    startAction(action);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Cooking
        </h1>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Level {currentLevel}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatXp(cookingXp)} / {formatXp(nextLevelXp)} XP
          </span>
        </div>
        <div className="mt-2 h-2 w-64 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-full bg-red-500 transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {isCooking && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-red-700 dark:text-red-300">
                Currently cooking
              </span>
              <div className="font-medium text-red-900 dark:text-red-100">
                {COOKING_ACTIONS.find((a) => a.id === activeActionId)?.name}
              </div>
            </div>
            <button
              onClick={stopAction}
              className="rounded-md bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Stop
            </button>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-red-200 dark:bg-red-800">
            <div
              className="h-full bg-red-500 transition-all duration-100"
              style={{ width: `${actionProgress * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {COOKING_ACTIONS.map((action) => {
          const isLocked = currentLevel < action.levelRequired;
          const isActive = activeActionId === action.id;
          const hasMaterials = canCook(action);
          const outputItem = action.itemProduced
            ? getItem(action.itemProduced.itemId)
            : null;

          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              disabled={isLocked || !hasMaterials}
              className={`rounded-lg border p-4 text-left transition-colors ${
                isActive
                  ? 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950'
                  : isLocked || !hasMaterials
                    ? 'cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-800 dark:bg-zinc-900'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍳</span>
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
                {outputItem && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{outputItem.icon}</span>
                    <div className="text-right">
                      <div className="text-sm text-zinc-700 dark:text-zinc-300">
                        {outputItem.name}
                      </div>
                      {outputItem.healsFor && (
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Heals {outputItem.healsFor} HP
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Input requirements */}
              {action.inputItems && action.inputItems.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {action.inputItems.map((req) => {
                    const item = getItem(req.itemId);
                    const have = inventory[req.itemId] || 0;
                    const hasEnough = have >= req.quantity;
                    return (
                      <span
                        key={req.itemId}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                          hasEnough
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        <span>{item?.icon}</span>
                        <span>
                          {have}/{req.quantity}
                        </span>
                      </span>
                    );
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
