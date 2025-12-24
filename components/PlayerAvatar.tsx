'use client';

import { useEffect, useState, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ALL_SKILLS } from '@/types/game';
import { levelForXp } from '@/lib/experience';

// Evolution stages based on total level
type EvolutionStage = 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master' | 'grandmaster';

interface StageConfig {
  name: string;
  minLevel: number;
  title: string;
  description: string;
}

const STAGES: Record<EvolutionStage, StageConfig> = {
  novice: { name: 'novice', minLevel: 0, title: 'Fledgling Soul', description: 'A spark of potential' },
  apprentice: { name: 'apprentice', minLevel: 51, title: 'Wandering Wisp', description: 'Growing in power' },
  journeyman: { name: 'journeyman', minLevel: 151, title: 'Arcane Spirit', description: 'Magic takes form' },
  expert: { name: 'expert', minLevel: 301, title: 'Ethereal Sage', description: 'Wisdom incarnate' },
  master: { name: 'master', minLevel: 501, title: 'Astral Mage', description: 'Master of realms' },
  grandmaster: { name: 'grandmaster', minLevel: 801, title: 'Transcendent One', description: 'Beyond mortal limits' },
};

function getEvolutionStage(totalLevel: number): EvolutionStage {
  if (totalLevel >= 801) return 'grandmaster';
  if (totalLevel >= 501) return 'master';
  if (totalLevel >= 301) return 'expert';
  if (totalLevel >= 151) return 'journeyman';
  if (totalLevel >= 51) return 'apprentice';
  return 'novice';
}

function getNextStage(current: EvolutionStage): EvolutionStage | null {
  const order: EvolutionStage[] = ['novice', 'apprentice', 'journeyman', 'expert', 'master', 'grandmaster'];
  const idx = order.indexOf(current);
  return idx < order.length - 1 ? order[idx + 1] : null;
}

type Mood = 'idle' | 'happy' | 'working' | 'sleepy';

export function PlayerAvatar() {
  const skills = useGameStore((state) => state.skills);
  const currentAction = useGameStore((state) => state.currentAction);
  const [mood, setMood] = useState<Mood>('idle');
  const [lastXpGain, setLastXpGain] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Calculate total level (levels gained above 1, so fresh character starts at 0)
  const totalLevel = useMemo(() =>
    ALL_SKILLS.reduce((sum, skillId) => sum + Math.max(0, levelForXp(skills[skillId].xp) - 1), 0),
    [skills]
  );

  const totalXp = useMemo(() =>
    ALL_SKILLS.reduce((sum, skillId) => sum + skills[skillId].xp, 0),
    [skills]
  );

  const stage = getEvolutionStage(totalLevel);
  const stageConfig = STAGES[stage];
  const nextStage = getNextStage(stage);
  const nextStageConfig = nextStage ? STAGES[nextStage] : null;

  // Progress to next evolution
  const progressToNext = nextStageConfig
    ? (totalLevel - stageConfig.minLevel) / (nextStageConfig.minLevel - stageConfig.minLevel)
    : 1;

  // Track XP changes for mood
  useEffect(() => {
    if (totalXp > lastXpGain && lastXpGain > 0) {
      setMood('happy');
      const timer = setTimeout(() => setMood(currentAction ? 'working' : 'idle'), 2000);
      return () => clearTimeout(timer);
    }
    setLastXpGain(totalXp);
  }, [totalXp, lastXpGain, currentAction]);

  // Update mood based on activity
  useEffect(() => {
    if (mood === 'happy') return; // Don't interrupt happiness

    if (currentAction) {
      setMood('working');
    } else {
      // Go sleepy after 30 seconds of no action
      const sleepTimer = setTimeout(() => setMood('sleepy'), 30000);
      setMood('idle');
      return () => clearTimeout(sleepTimer);
    }
  }, [currentAction, mood]);

  // Random blinking
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.3) blink();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="avatar-container">
      <div className="avatar-frame">
        {/* Ambient particles */}
        <div className="avatar-particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`particle particle-${i + 1}`}
              style={{
                '--delay': `${i * 0.5}s`,
                '--duration': `${3 + Math.random() * 2}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Main character */}
        <div className={`avatar-sprite stage-${stage} mood-${mood} ${isBlinking ? 'blinking' : ''}`}>
          {/* Base body/orb */}
          <div className="sprite-core">
            <div className="sprite-glow" />
            <div className="sprite-body" />

            {/* Eyes - appear from journeyman onwards */}
            {['journeyman', 'expert', 'master', 'grandmaster'].includes(stage) && (
              <div className="sprite-eyes">
                <div className={`eye eye-left ${isBlinking ? 'blink' : ''}`} />
                <div className={`eye eye-right ${isBlinking ? 'blink' : ''}`} />
              </div>
            )}

            {/* Hood/cloak - appears from expert onwards */}
            {['expert', 'master', 'grandmaster'].includes(stage) && (
              <div className="sprite-hood" />
            )}

            {/* Staff - appears at master */}
            {['master', 'grandmaster'].includes(stage) && (
              <div className="sprite-staff">
                <div className="staff-gem" />
              </div>
            )}

            {/* Wings/halo - grandmaster only */}
            {stage === 'grandmaster' && (
              <>
                <div className="sprite-wings">
                  <div className="wing wing-left" />
                  <div className="wing wing-right" />
                </div>
                <div className="sprite-halo" />
              </>
            )}

            {/* Wisps - appear from apprentice onwards */}
            {stage !== 'novice' && (
              <div className="sprite-wisps">
                <div className="wisp wisp-1" />
                <div className="wisp wisp-2" />
                {['journeyman', 'expert', 'master', 'grandmaster'].includes(stage) && (
                  <div className="wisp wisp-3" />
                )}
              </div>
            )}
          </div>

          {/* Mood indicator */}
          <div className="mood-bubble">
            {mood === 'happy' && <span className="mood-icon">✨</span>}
            {mood === 'sleepy' && <span className="mood-icon">💤</span>}
            {mood === 'working' && <span className="mood-icon">⚡</span>}
          </div>
        </div>

        {/* Stage indicator ring */}
        <svg className="evolution-ring" viewBox="0 0 100 100">
          <circle
            className="ring-bg"
            cx="50"
            cy="50"
            r="46"
            fill="none"
            strokeWidth="3"
          />
          <circle
            className="ring-progress"
            cx="50"
            cy="50"
            r="46"
            fill="none"
            strokeWidth="3"
            strokeDasharray={`${progressToNext * 289} 289`}
            transform="rotate(-90 50 50)"
          />
        </svg>
      </div>

      {/* Info panel */}
      <div className="avatar-info">
        <div className="avatar-title">{stageConfig.title}</div>
        <div className="avatar-subtitle">{stageConfig.description}</div>
        <div className="avatar-level">
          <span className="level-label">Total Level</span>
          <span className="level-value">{totalLevel}</span>
        </div>
        {nextStageConfig && (
          <div className="evolution-progress">
            <div className="evolution-label">
              Next: {nextStageConfig.title}
            </div>
            <div className="evolution-bar">
              <div
                className="evolution-fill"
                style={{ width: `${progressToNext * 100}%` }}
              />
            </div>
            <div className="evolution-levels">
              {nextStageConfig.minLevel - totalLevel} levels to evolve
            </div>
          </div>
        )}
        {!nextStageConfig && (
          <div className="evolution-complete">
            <span>Maximum Evolution Reached</span>
          </div>
        )}
      </div>
    </div>
  );
}
