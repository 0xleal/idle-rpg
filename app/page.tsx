'use client';

import { useGameStore } from '@/store/gameStore';
import { ALL_SKILLS } from '@/types/game';
import { levelForXp } from '@/lib/experience';

export default function Dashboard() {
  const skills = useGameStore((state) => state.skills);
  const currentAction = useGameStore((state) => state.currentAction);

  const totalLevel = ALL_SKILLS.reduce(
    (sum, skillId) => sum + levelForXp(skills[skillId].xp),
    0
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Dashboard
      </h1>

      <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Level</div>
        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {totalLevel}
        </div>
      </div>

      {currentAction && (
        <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Current Action
          </div>
          <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {currentAction.skillId}: {currentAction.actionId}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full bg-green-500 transition-all duration-100"
              style={{
                width: `${(currentAction.elapsedMs / currentAction.duration) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Select a skill from the sidebar to begin training.
      </div>
    </div>
  );
}
