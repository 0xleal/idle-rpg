'use client';

import { useGameStore } from '@/store/gameStore';
import { WOODCUTTING_ACTIONS } from '@/data/skills/woodcutting';
import { getItem } from '@/data/resources';
import { levelForXp, xpForLevel, formatXp, xpProgress } from '@/lib/experience';

const SKILL_COLOR = 'var(--skill-woodcutting)';

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

    if (currentLevel < action.levelRequired) return;

    if (activeActionId === actionId) {
      stopAction();
      return;
    }

    startAction(action);
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="skill-icon"
            style={{ background: `${SKILL_COLOR}15` }}
          >
            <span className="animate-float">🪓</span>
          </div>
          <div>
            <h1 className="font-[var(--font-cinzel)] text-3xl font-bold text-gradient">
              Woodcutting
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="text-2xl font-bold"
                style={{ color: SKILL_COLOR }}
              >
                Level {currentLevel}
              </span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[var(--text-secondary)]">
                {formatXp(woodcuttingXp)} / {formatXp(nextLevelXp)} XP
              </span>
            </div>
          </div>
        </div>
        <div className="progress-bar progress-bar-lg w-80">
          <div
            className="progress-fill"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${SKILL_COLOR}80, ${SKILL_COLOR})`,
            }}
          />
        </div>
        <div className="mt-1 text-xs text-[var(--text-muted)]">
          {formatXp(nextLevelXp - woodcuttingXp)} XP to level {currentLevel + 1}
        </div>
      </div>

      {/* Current Action Banner */}
      {isWoodcutting && (
        <div className="action-banner mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-[var(--text-muted)]">Currently Chopping</div>
              <div className="text-lg font-semibold text-[var(--accent-gold)]">
                {WOODCUTTING_ACTIONS.find((a) => a.id === activeActionId)?.name}
              </div>
            </div>
            <button onClick={stopAction} className="btn btn-danger">
              Stop
            </button>
          </div>
          <div className="progress-bar progress-bar-lg">
            <div
              className="progress-fill"
              style={{
                width: `${actionProgress * 100}%`,
                background: `linear-gradient(90deg, ${SKILL_COLOR}80, ${SKILL_COLOR})`,
              }}
            />
          </div>
        </div>
      )}

      {/* Actions List */}
      <div className="section-header">
        <span className="section-title">Trees</span>
        <span className="section-line" />
      </div>
      <div className="grid gap-3">
        {WOODCUTTING_ACTIONS.map((action, index) => {
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
              className={`action-card opacity-0 animate-fade-in ${isActive ? 'action-card-active' : ''} ${isLocked ? 'opacity-40' : ''}`}
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="skill-icon"
                  style={{ background: isActive ? `${SKILL_COLOR}20` : 'rgba(0,0,0,0.3)' }}
                >
                  🌳
                </div>
                <div>
                  <div className="text-[var(--text-primary)] font-medium">
                    {action.name}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {isLocked
                      ? `Requires level ${action.levelRequired}`
                      : `${action.xp} XP • ${(action.baseTime / 1000).toFixed(1)}s`}
                  </div>
                </div>
              </div>
              {item && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{item.name}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
