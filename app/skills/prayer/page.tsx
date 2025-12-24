'use client';

import { useGameStore } from '@/store/gameStore';
import { PRAYER_ACTIONS } from '@/data/skills/prayer';
import { getItem } from '@/data/resources';
import { levelForXp, xpForLevel, formatXp, xpProgress } from '@/lib/experience';
import { SkillingActionDefinition } from '@/types/game';

const SKILL_COLOR = 'var(--skill-prayer)';

export default function PrayerPage() {
  const skills = useGameStore((state) => state.skills);
  const inventory = useGameStore((state) => state.inventory);
  const currentAction = useGameStore((state) => state.currentAction);
  const startAction = useGameStore((state) => state.startAction);
  const stopAction = useGameStore((state) => state.stopAction);

  const prayerXp = skills.prayer.xp;
  const currentLevel = levelForXp(prayerXp);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const progress = xpProgress(prayerXp);

  const isPraying = currentAction?.skillId === 'prayer';
  const activeActionId = isPraying ? currentAction.actionId : null;
  const actionProgress = isPraying
    ? currentAction.elapsedMs / currentAction.duration
    : 0;

  const canPray = (action: SkillingActionDefinition): boolean => {
    if (currentLevel < action.levelRequired) return false;
    if (!action.inputItems) return true;
    return action.inputItems.every(
      (req) => (inventory[req.itemId] || 0) >= req.quantity
    );
  };

  const handleActionClick = (actionId: string) => {
    const action = PRAYER_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    if (activeActionId === actionId) {
      stopAction();
      return;
    }

    if (!canPray(action)) return;
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
            <span className="animate-float">🙏</span>
          </div>
          <div>
            <h1 className="font-[var(--font-cinzel)] text-3xl font-bold text-gradient">
              Prayer
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
                {formatXp(prayerXp)} / {formatXp(nextLevelXp)} XP
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
          {formatXp(nextLevelXp - prayerXp)} XP to level {currentLevel + 1}
        </div>
      </div>

      {/* Current Action Banner */}
      {isPraying && (
        <div className="action-banner mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-[var(--text-muted)]">Currently Praying</div>
              <div className="text-lg font-semibold text-[var(--accent-gold)]">
                {PRAYER_ACTIONS.find((a) => a.id === activeActionId)?.name}
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

      {/* Info notice */}
      <div className="badge badge-warning mb-6 text-sm px-4 py-2">
        Bury bones from defeated monsters to train Prayer. Higher level bones grant more XP.
      </div>

      {/* Actions List */}
      <div className="section-header">
        <span className="section-title">Bury Bones</span>
        <span className="section-line" />
      </div>
      <div className="grid gap-3">
        {PRAYER_ACTIONS.map((action, index) => {
          const isLocked = currentLevel < action.levelRequired;
          const isActive = activeActionId === action.id;
          const hasMaterials = canPray(action);
          const inputItem = action.inputItems?.[0]
            ? getItem(action.inputItems[0].itemId)
            : null;

          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              disabled={isLocked || !hasMaterials}
              className={`action-card opacity-0 animate-fade-in ${isActive ? 'action-card-active' : ''} ${isLocked || !hasMaterials ? 'opacity-40' : ''}`}
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="skill-icon"
                  style={{ background: isActive ? `${SKILL_COLOR}20` : 'rgba(0,0,0,0.3)' }}
                >
                  {inputItem?.icon || '🦴'}
                </div>
                <div className="flex-1">
                  <div className="text-[var(--text-primary)] font-medium">
                    {action.name}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {isLocked
                      ? `Requires level ${action.levelRequired}`
                      : `${action.xp} XP • ${(action.baseTime / 1000).toFixed(1)}s`}
                  </div>
                  {action.inputItems && action.inputItems.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {action.inputItems.map((req) => {
                        const item = getItem(req.itemId);
                        const have = inventory[req.itemId] || 0;
                        const hasEnough = have >= req.quantity;
                        return (
                          <span
                            key={req.itemId}
                            className={`badge ${hasEnough ? 'badge-success' : 'badge-error'}`}
                          >
                            <span>{item?.icon}</span>
                            <span>{have}/{req.quantity}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
