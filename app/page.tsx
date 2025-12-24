'use client';

import { useGameStore } from '@/store/gameStore';
import { ALL_SKILLS, SkillId } from '@/types/game';
import { levelForXp, xpProgress, formatXp, xpForLevel } from '@/lib/experience';
import Link from 'next/link';

const SKILL_CONFIG: Record<SkillId, { icon: string; color: string; href: string }> = {
  woodcutting: { icon: '🪓', color: 'var(--skill-woodcutting)', href: '/skills/woodcutting' },
  mining: { icon: '⛏️', color: 'var(--skill-mining)', href: '/skills/mining' },
  fishing: { icon: '🎣', color: 'var(--skill-fishing)', href: '/skills/fishing' },
  smithing: { icon: '🔨', color: 'var(--skill-smithing)', href: '/skills/smithing' },
  cooking: { icon: '🍳', color: 'var(--skill-cooking)', href: '/skills/cooking' },
  fletching: { icon: '🏹', color: 'var(--skill-fletching)', href: '/skills/fletching' },
  crafting: { icon: '🧵', color: 'var(--skill-crafting)', href: '/skills/crafting' },
  farming: { icon: '🌱', color: 'var(--skill-farming)', href: '/skills/farming' },
  prayer: { icon: '🙏', color: 'var(--skill-prayer)', href: '/skills/prayer' },
  herblore: { icon: '⚗️', color: 'var(--skill-herblore)', href: '/skills/herblore' },
  attack: { icon: '⚔️', color: 'var(--skill-attack)', href: '/combat' },
  strength: { icon: '💪', color: 'var(--skill-strength)', href: '/combat' },
  defence: { icon: '🛡️', color: 'var(--skill-defence)', href: '/combat' },
  hitpoints: { icon: '❤️', color: 'var(--skill-hitpoints)', href: '/combat' },
  ranged: { icon: '🏹', color: 'var(--skill-ranged)', href: '/combat' },
  magic: { icon: '✨', color: 'var(--skill-magic)', href: '/combat' },
};

export default function Dashboard() {
  const skills = useGameStore((state) => state.skills);
  const currentAction = useGameStore((state) => state.currentAction);

  const totalLevel = ALL_SKILLS.reduce(
    (sum, skillId) => sum + levelForXp(skills[skillId].xp),
    0
  );

  const totalXp = ALL_SKILLS.reduce(
    (sum, skillId) => sum + skills[skillId].xp,
    0
  );

  const gatheringSkills: SkillId[] = ['woodcutting', 'mining', 'fishing', 'farming'];
  const productionSkills: SkillId[] = ['smithing', 'cooking', 'fletching', 'crafting', 'herblore'];
  const combatSkills: SkillId[] = ['attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic'];
  const utilitySkills: SkillId[] = ['prayer'];

  const renderSkillCard = (skillId: SkillId, index: number) => {
    const config = SKILL_CONFIG[skillId];
    const xp = skills[skillId].xp;
    const level = levelForXp(xp);
    const progress = xpProgress(xp);
    const nextLevelXp = xpForLevel(level + 1);
    const isTraining = currentAction?.skillId === skillId;

    return (
      <Link
        key={skillId}
        href={config.href}
        className={`card p-4 block opacity-0 animate-fade-in ${isTraining ? 'card-active' : ''}`}
        style={{
          animationDelay: `${index * 0.05}s`,
          animationFillMode: 'forwards'
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="skill-icon-sm"
            style={{ background: `${config.color}15` }}
          >
            <span className={isTraining ? 'animate-float' : ''}>{config.icon}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-[var(--text-primary)] capitalize">
              {skillId}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              {formatXp(xp)} XP
            </div>
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: config.color }}
          >
            {level}
          </div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${config.color}80, ${config.color})`,
            }}
          />
        </div>
        <div className="mt-1 text-xs text-[var(--text-muted)] text-right">
          {formatXp(nextLevelXp - xp)} to level {level + 1}
        </div>
      </Link>
    );
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[var(--font-cinzel)] text-3xl font-bold text-gradient mb-2">
          Dashboard
        </h1>
        <p className="text-[var(--text-secondary)]">
          Track your progress across all skills
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-block">
          <div className="stat-label">Total Level</div>
          <div className="stat-value stat-value-gold">{totalLevel}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Total XP</div>
          <div className="stat-value">{formatXp(totalXp)}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Skills Trained</div>
          <div className="stat-value">
            {ALL_SKILLS.filter((s) => skills[s].xp > 0).length}/{ALL_SKILLS.length}
          </div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Max Skill</div>
          <div className="stat-value stat-value-gold">
            {Math.max(...ALL_SKILLS.map((s) => levelForXp(skills[s].xp)))}
          </div>
        </div>
      </div>

      {/* Current Action */}
      {currentAction && (
        <div className="action-banner mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="skill-icon animate-float">
                {SKILL_CONFIG[currentAction.skillId as SkillId]?.icon || '⏳'}
              </div>
              <div>
                <div className="text-sm text-[var(--text-muted)]">Currently Training</div>
                <div className="text-lg font-semibold text-[var(--accent-gold)] capitalize">
                  {currentAction.skillId}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--text-muted)]">Action</div>
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {currentAction.actionId.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
          <div className="progress-bar progress-bar-lg mt-4">
            <div
              className="progress-fill progress-xp"
              style={{
                width: `${(currentAction.elapsedMs / currentAction.duration) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Gathering Skills */}
      <div className="mb-8">
        <div className="section-header">
          <span className="section-title">Gathering</span>
          <span className="section-line" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gatheringSkills.map((skill, i) => renderSkillCard(skill, i))}
        </div>
      </div>

      {/* Production Skills */}
      <div className="mb-8">
        <div className="section-header">
          <span className="section-title">Production</span>
          <span className="section-line" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {productionSkills.map((skill, i) => renderSkillCard(skill, i + 4))}
        </div>
      </div>

      {/* Combat Skills */}
      <div className="mb-8">
        <div className="section-header">
          <span className="section-title">Combat</span>
          <span className="section-line" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {combatSkills.map((skill, i) => renderSkillCard(skill, i + 9))}
        </div>
      </div>

      {/* Utility Skills */}
      <div className="mb-8">
        <div className="section-header">
          <span className="section-title">Utility</span>
          <span className="section-line" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {utilitySkills.map((skill, i) => renderSkillCard(skill, i + 15))}
        </div>
      </div>
    </div>
  );
}
