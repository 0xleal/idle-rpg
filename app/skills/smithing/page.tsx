'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { SMITHING_ACTIONS } from '@/data/skills/smithing';
import { getItem } from '@/data/resources';
import { levelForXp, xpForLevel, formatXp, xpProgress } from '@/lib/experience';
import { SkillingActionDefinition } from '@/types/game';

const SKILL_COLOR = 'var(--skill-smithing)';

type SmithingCategory = 'smelting' | 'forging' | 'arrowheads';

const CATEGORIES: { id: SmithingCategory; name: string; icon: string }[] = [
  { id: 'smelting', name: 'Smelting', icon: '🔥' },
  { id: 'forging', name: 'Forging', icon: '🔨' },
  { id: 'arrowheads', name: 'Arrowheads', icon: '🏹' },
];

export default function SmithingPage() {
  const [category, setCategory] = useState<SmithingCategory>('smelting');

  const skills = useGameStore((state) => state.skills);
  const inventory = useGameStore((state) => state.inventory);
  const currentAction = useGameStore((state) => state.currentAction);
  const startAction = useGameStore((state) => state.startAction);
  const stopAction = useGameStore((state) => state.stopAction);

  const smithingXp = skills.smithing.xp;
  const currentLevel = levelForXp(smithingXp);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const progress = xpProgress(smithingXp);

  const isSmithing = currentAction?.skillId === 'smithing';
  const activeActionId = isSmithing ? currentAction.actionId : null;
  const actionProgress = isSmithing
    ? currentAction.elapsedMs / currentAction.duration
    : 0;

  const filteredActions = SMITHING_ACTIONS.filter((a) => a.category === category);

  const canSmith = (action: SkillingActionDefinition): boolean => {
    if (currentLevel < action.levelRequired) return false;
    if (!action.inputItems) return true;
    return action.inputItems.every(
      (req) => (inventory[req.itemId] || 0) >= req.quantity
    );
  };

  const handleActionClick = (actionId: string) => {
    const action = SMITHING_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    if (activeActionId === actionId) {
      stopAction();
      return;
    }

    if (!canSmith(action)) return;
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
            <span className="animate-float">🔨</span>
          </div>
          <div>
            <h1 className="font-[var(--font-cinzel)] text-3xl font-bold text-gradient">
              Smithing
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
                {formatXp(smithingXp)} / {formatXp(nextLevelXp)} XP
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
          {formatXp(nextLevelXp - smithingXp)} XP to level {currentLevel + 1}
        </div>
      </div>

      {/* Current Action Banner */}
      {isSmithing && (
        <div className="action-banner mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-[var(--text-muted)]">Currently Smithing</div>
              <div className="text-lg font-semibold text-[var(--accent-gold)]">
                {SMITHING_ACTIONS.find((a) => a.id === activeActionId)?.name}
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

      {/* Category Tabs */}
      <div className="tab-group mb-6 w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`tab ${category === cat.id ? 'tab-active' : ''}`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Actions List */}
      <div className="section-header">
        <span className="section-title">{CATEGORIES.find((c) => c.id === category)?.name}</span>
        <span className="section-line" />
      </div>
      <div className="grid gap-3">
        {filteredActions.map((action, index) => {
          const isLocked = currentLevel < action.levelRequired;
          const isActive = activeActionId === action.id;
          const hasMaterials = canSmith(action);
          const outputItem = action.itemProduced
            ? getItem(action.itemProduced.itemId)
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
                  {outputItem?.icon || '🔨'}
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
              {outputItem && action.itemProduced && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">{outputItem.icon}</span>
                  <div className="text-right">
                    <span className="text-sm text-[var(--text-secondary)]">{outputItem.name}</span>
                    {action.itemProduced.quantity > 1 && (
                      <span className="text-xs text-[var(--text-muted)]"> x{action.itemProduced.quantity}</span>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
