'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useCombatStore } from '@/store/combatStore';
import { COMBAT_AREAS, getMonster } from '@/data/monsters';
import { getItem } from '@/data/resources';
import { levelForXp } from '@/lib/experience';
import { CombatStyle } from '@/types/combat';

const COMBAT_STYLES: { id: CombatStyle; name: string; icon: string; color: string }[] = [
  { id: 'attack', name: 'Attack', icon: '⚔️', color: 'var(--skill-attack)' },
  { id: 'strength', name: 'Strength', icon: '💪', color: 'var(--skill-strength)' },
  { id: 'defence', name: 'Defence', icon: '🛡️', color: 'var(--skill-defence)' },
  { id: 'ranged', name: 'Ranged', icon: '🏹', color: 'var(--skill-ranged)' },
  { id: 'magic', name: 'Magic', icon: '✨', color: 'var(--skill-magic)' },
];

export default function CombatPage() {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const skills = useGameStore((state) => state.skills);
  const inventory = useGameStore((state) => state.inventory);

  const inCombat = useCombatStore((state) => state.inCombat);
  const monsterId = useCombatStore((state) => state.monsterId);
  const monsterCurrentHp = useCombatStore((state) => state.monsterCurrentHp);
  const playerCurrentHp = useCombatStore((state) => state.playerCurrentHp);
  const playerMaxHp = useCombatStore((state) => state.playerMaxHp);
  const lastHitSplat = useCombatStore((state) => state.lastHitSplat);
  const lootLog = useCombatStore((state) => state.lootLog);
  const combatStyle = useCombatStore((state) => state.combatStyle);
  const selectedFood = useCombatStore((state) => state.selectedFood);
  const autoEatEnabled = useCombatStore((state) => state.autoEatEnabled);
  const autoEatThreshold = useCombatStore((state) => state.autoEatThreshold);
  const startCombat = useCombatStore((state) => state.startCombat);
  const fleeCombat = useCombatStore((state) => state.fleeCombat);
  const eatFood = useCombatStore((state) => state.eatFood);
  const setCombatStyle = useCombatStore((state) => state.setCombatStyle);
  const setSelectedFood = useCombatStore((state) => state.setSelectedFood);
  const setAutoEatEnabled = useCombatStore((state) => state.setAutoEatEnabled);
  const setAutoEatThreshold = useCombatStore((state) => state.setAutoEatThreshold);
  const selectedAmmo = useCombatStore((state) => state.selectedAmmo);
  const setSelectedAmmo = useCombatStore((state) => state.setSelectedAmmo);

  const attackLevel = levelForXp(skills.attack.xp);
  const strengthLevel = levelForXp(skills.strength.xp);
  const defenceLevel = levelForXp(skills.defence.xp);
  const hitpointsLevel = levelForXp(skills.hitpoints.xp);
  const rangedLevel = levelForXp(skills.ranged.xp);
  const magicLevel = levelForXp(skills.magic.xp);

  const base = 0.25 * (defenceLevel + hitpointsLevel);
  const melee = 0.325 * (attackLevel + strengthLevel);
  const ranged = 0.325 * rangedLevel * 1.5;
  const magic = 0.325 * magicLevel * 1.5;
  const combatLevel = Math.floor(base + Math.max(melee, ranged, magic));

  const currentMonster = monsterId ? getMonster(monsterId) : null;
  const selectedArea = selectedAreaId
    ? COMBAT_AREAS.find((a) => a.id === selectedAreaId)
    : null;

  const foodItems = Object.entries(inventory)
    .filter(([itemId, qty]) => {
      if (qty <= 0) return false;
      const item = getItem(itemId);
      return item?.healsFor;
    })
    .map(([itemId, qty]) => ({
      itemId,
      quantity: qty,
      item: getItem(itemId)!,
    }));

  const arrowTypes = ['bronze_arrow', 'iron_arrow', 'steel_arrow', 'mithril_arrow', 'adamant_arrow', 'rune_arrow'];
  const arrowItems = arrowTypes
    .filter((arrowId) => (inventory[arrowId] || 0) > 0)
    .map((arrowId) => ({
      itemId: arrowId,
      quantity: inventory[arrowId] || 0,
      item: getItem(arrowId)!,
    }));

  const airRunes = inventory['air_rune'] || 0;
  const mindRunes = inventory['mind_rune'] || 0;

  const handleStartCombat = (mId: string) => {
    startCombat(mId);
  };

  const handleFlee = () => {
    fleeCombat();
  };

  const handleEatFood = (itemId: string) => {
    eatFood(itemId);
  };

  const handleStyleChange = (style: CombatStyle) => {
    setCombatStyle(style);
  };

  const currentStyleConfig = COMBAT_STYLES.find((s) => s.id === combatStyle);

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="skill-icon"
            style={{ background: 'rgba(239, 68, 68, 0.15)' }}
          >
            <span className="animate-float">⚔️</span>
          </div>
          <div>
            <h1 className="font-[var(--font-cinzel)] text-3xl font-bold text-gradient">
              Combat
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="text-2xl font-bold"
                style={{ color: 'var(--accent-gold)' }}
              >
                Level {combatLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Combat Stats */}
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { name: 'Atk', level: attackLevel, color: 'var(--skill-attack)' },
            { name: 'Str', level: strengthLevel, color: 'var(--skill-strength)' },
            { name: 'Def', level: defenceLevel, color: 'var(--skill-defence)' },
            { name: 'HP', level: hitpointsLevel, color: 'var(--skill-hitpoints)' },
            { name: 'Rng', level: rangedLevel, color: 'var(--skill-ranged)' },
            { name: 'Mag', level: magicLevel, color: 'var(--skill-magic)' },
          ].map((stat) => (
            <div
              key={stat.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
            >
              <span className="text-xs text-[var(--text-muted)]">{stat.name}</span>
              <span className="font-bold" style={{ color: stat.color }}>{stat.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Combat Style Selector */}
      <div className="section-header">
        <span className="section-title">Combat Style</span>
        <span className="section-line" />
      </div>
      <div className="tab-group mb-6 w-fit">
        {COMBAT_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => handleStyleChange(style.id)}
            className={`tab ${combatStyle === style.id ? 'tab-active' : ''}`}
            style={combatStyle === style.id ? { borderColor: style.color } : {}}
          >
            <span>{style.icon}</span>
            <span>{style.name}</span>
          </button>
        ))}
      </div>

      {/* Settings Cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Auto-Eat Settings */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-[var(--accent-gold)] mb-3 flex items-center gap-2">
            <span>🍖</span> Auto-Eat Settings
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoEatEnabled}
                onChange={(e) => setAutoEatEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border-dim)] accent-[var(--accent-gold)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">Auto-eat enabled</span>
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--text-muted)]">Eat at</span>
              <select
                value={autoEatThreshold}
                onChange={(e) => setAutoEatThreshold(parseFloat(e.target.value))}
                className="select-input"
              >
                <option value={0.25}>25% HP</option>
                <option value={0.5}>50% HP</option>
                <option value={0.75}>75% HP</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--text-muted)]">Food:</span>
              <select
                value={selectedFood || ''}
                onChange={(e) => setSelectedFood(e.target.value || null)}
                className="select-input flex-1"
              >
                <option value="">Any available</option>
                {foodItems.map(({ itemId, item, quantity }) => (
                  <option key={itemId} value={itemId}>
                    {item.icon} {item.name} (+{item.healsFor} HP) x{quantity}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ranged/Magic Settings */}
        {(combatStyle === 'ranged' || combatStyle === 'magic') && (
          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: currentStyleConfig?.color }}>
              <span>{currentStyleConfig?.icon}</span> {combatStyle === 'ranged' ? 'Ranged' : 'Magic'} Settings
            </h3>
            {combatStyle === 'ranged' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--text-muted)]">Arrows:</span>
                  <select
                    value={selectedAmmo || ''}
                    onChange={(e) => setSelectedAmmo(e.target.value || null)}
                    className="select-input flex-1"
                  >
                    <option value="">Best available</option>
                    {arrowItems.map(({ itemId, item, quantity }) => (
                      <option key={itemId} value={itemId}>
                        {item.icon} {item.name} x{quantity}
                      </option>
                    ))}
                  </select>
                </div>
                {arrowItems.length === 0 && (
                  <span className="badge badge-error">No arrows in inventory!</span>
                )}
              </div>
            )}
            {combatStyle === 'magic' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <span className={`badge ${airRunes > 0 ? 'badge-success' : 'badge-error'}`}>
                    🌀 Air x{airRunes}
                  </span>
                  <span className={`badge ${mindRunes > 0 ? 'badge-success' : 'badge-error'}`}>
                    🧠 Mind x{mindRunes}
                  </span>
                </div>
                {(airRunes === 0 || mindRunes === 0) && (
                  <span className="badge badge-error">Need air + mind runes to cast!</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* In Combat View */}
      {inCombat && currentMonster && (
        <div className="combat-arena mb-6 animate-fade-in">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Player */}
            <div className="card p-4" style={{ borderColor: 'var(--skill-hitpoints)30' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧙</span>
                  <span className="font-semibold text-[var(--text-primary)]">You</span>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">
                  {playerCurrentHp} / {playerMaxHp} HP
                </span>
              </div>
              <div className="progress-bar progress-bar-lg">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(playerCurrentHp / playerMaxHp) * 100}%`,
                    background: 'linear-gradient(90deg, var(--skill-hitpoints)80, var(--skill-hitpoints))',
                  }}
                />
              </div>
              {lastHitSplat && lastHitSplat.isPlayer && (
                <div className="mt-3 text-center">
                  <span className={`hit-splat ${lastHitSplat.damage > 0 ? 'hit-damage' : 'hit-miss'}`}>
                    {lastHitSplat.damage > 0 ? lastHitSplat.damage : 'Miss!'}
                  </span>
                </div>
              )}
            </div>

            {/* Monster */}
            <div className="card p-4" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentMonster.icon}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{currentMonster.name}</span>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">
                  {monsterCurrentHp} / {currentMonster.hitpoints} HP
                </span>
              </div>
              <div className="progress-bar progress-bar-lg">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(monsterCurrentHp / currentMonster.hitpoints) * 100}%`,
                    background: 'linear-gradient(90deg, #ef444480, #ef4444)',
                  }}
                />
              </div>
              {lastHitSplat && !lastHitSplat.isPlayer && (
                <div className="mt-3 text-center">
                  <span className={`hit-splat ${lastHitSplat.damage > 0 ? 'hit-damage' : 'hit-miss'}`}>
                    {lastHitSplat.damage > 0 ? lastHitSplat.damage : 'Miss!'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={handleFlee} className="btn btn-danger">
              🏃 Flee
            </button>
          </div>

          {/* Food */}
          {foodItems.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-[var(--text-muted)] mb-2">
                Quick Eat:
              </div>
              <div className="flex flex-wrap gap-2">
                {foodItems.map(({ itemId, quantity, item }) => (
                  <button
                    key={itemId}
                    onClick={() => handleEatFood(itemId)}
                    disabled={playerCurrentHp >= playerMaxHp}
                    className="food-btn"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    <span className="text-xs opacity-70">x{quantity}</span>
                    <span className="text-xs text-[var(--skill-hitpoints)]">
                      +{item.healsFor}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loot Log */}
          {lootLog.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-[var(--text-muted)] mb-2">
                Recent Loot:
              </div>
              <div className="flex flex-wrap gap-2">
                {lootLog.map((loot, idx) => {
                  const item = getItem(loot.itemId);
                  return (
                    <span
                      key={`${loot.itemId}-${idx}`}
                      className="loot-drop"
                    >
                      <span>{item?.icon}</span>
                      <span>{item?.name} x{loot.quantity}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Area Selection */}
      {!inCombat && (
        <>
          <div className="section-header">
            <span className="section-title">Select Combat Area</span>
            <span className="section-line" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {COMBAT_AREAS.map((area, index) => (
              <button
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={`area-card opacity-0 animate-fade-in ${selectedAreaId === area.id ? 'area-card-active' : ''}`}
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="skill-icon" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                    {area.icon}
                  </div>
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">
                      {area.name}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      Levels {area.levelRecommendation}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Monster Selection */}
      {!inCombat && selectedArea && (
        <>
          <div className="section-header">
            <span className="section-title">{selectedArea.name} - Monsters</span>
            <span className="section-line" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {selectedArea.monsters.map((mId, index) => {
              const monster = getMonster(mId);
              if (!monster) return null;

              return (
                <button
                  key={mId}
                  onClick={() => handleStartCombat(mId)}
                  className="monster-card opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="monster-icon">
                        {monster.icon}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">
                          {monster.name}
                        </div>
                        <div className="text-sm text-[var(--text-muted)]">
                          Level {monster.combatLevel}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[var(--skill-hitpoints)]">
                        {monster.hitpoints} HP
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        Max hit: {monster.maxHit}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
