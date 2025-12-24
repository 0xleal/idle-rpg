'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useCombatStore } from '@/store/combatStore';
import { COMBAT_AREAS, getMonster } from '@/data/monsters';
import { getItem } from '@/data/resources';
import { levelForXp } from '@/lib/experience';
import { CombatStyle } from '@/types/combat';

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

  const attackLevel = levelForXp(skills.attack.xp);
  const strengthLevel = levelForXp(skills.strength.xp);
  const defenceLevel = levelForXp(skills.defence.xp);
  const hitpointsLevel = levelForXp(skills.hitpoints.xp);

  const combatLevel = Math.floor(
    0.25 * (defenceLevel + hitpointsLevel) + 0.325 * (attackLevel + strengthLevel)
  );

  const currentMonster = monsterId ? getMonster(monsterId) : null;
  const selectedArea = selectedAreaId
    ? COMBAT_AREAS.find((a) => a.id === selectedAreaId)
    : null;

  // Get food items from inventory
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Combat
        </h1>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Combat Level {combatLevel}
          </span>
        </div>
        <div className="mt-2 flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Atk {attackLevel}</span>
          <span>Str {strengthLevel}</span>
          <span>Def {defenceLevel}</span>
          <span>HP {hitpointsLevel}</span>
        </div>
      </div>

      {/* Combat Style Selector */}
      <div className="mb-4 flex gap-2">
        <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">Style:</span>
        {(['attack', 'strength', 'defence'] as CombatStyle[]).map((style) => (
          <button
            key={style}
            onClick={() => handleStyleChange(style)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              combatStyle === style
                ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </button>
        ))}
      </div>

      {/* Auto-Eat Settings */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Auto-Eat Settings</h3>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoEatEnabled}
              onChange={(e) => setAutoEatEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600"
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Auto-eat enabled</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Eat at</span>
            <select
              value={autoEatThreshold}
              onChange={(e) => setAutoEatThreshold(parseFloat(e.target.value))}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value={0.25}>25% HP</option>
              <option value={0.5}>50% HP</option>
              <option value={0.75}>75% HP</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Food:</span>
            <select
              value={selectedFood || ''}
              onChange={(e) => setSelectedFood(e.target.value || null)}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
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

      {/* In Combat View */}
      {inCombat && currentMonster && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Player */}
            <div className="rounded-lg bg-white p-4 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">You</span>
                <span className="text-sm text-zinc-500">
                  {playerCurrentHp} / {playerMaxHp} HP
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full bg-green-500 transition-all duration-200"
                  style={{ width: `${(playerCurrentHp / playerMaxHp) * 100}%` }}
                />
              </div>
              {lastHitSplat && lastHitSplat.isPlayer && (
                <div className="mt-2 text-center text-lg font-bold text-orange-600 dark:text-orange-400">
                  {lastHitSplat.damage > 0 ? `Hit: ${lastHitSplat.damage}` : 'Miss!'}
                </div>
              )}
            </div>

            {/* Monster */}
            <div className="rounded-lg bg-white p-4 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  <span className="text-2xl mr-2">{currentMonster.icon}</span>
                  {currentMonster.name}
                </span>
                <span className="text-sm text-zinc-500">
                  {monsterCurrentHp} / {currentMonster.hitpoints} HP
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full bg-red-500 transition-all duration-200"
                  style={{
                    width: `${(monsterCurrentHp / currentMonster.hitpoints) * 100}%`,
                  }}
                />
              </div>
              {lastHitSplat && !lastHitSplat.isPlayer && (
                <div className="mt-2 text-center text-lg font-bold text-red-600 dark:text-red-400">
                  {lastHitSplat.damage > 0 ? `Hit: ${lastHitSplat.damage}` : 'Miss!'}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleFlee}
              className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Flee
            </button>
          </div>

          {/* Food */}
          {foodItems.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Food:
              </div>
              <div className="flex flex-wrap gap-2">
                {foodItems.map(({ itemId, quantity, item }) => (
                  <button
                    key={itemId}
                    onClick={() => handleEatFood(itemId)}
                    disabled={playerCurrentHp >= playerMaxHp}
                    className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-sm text-green-800 hover:bg-green-200 disabled:opacity-50 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    <span className="text-xs">x{quantity}</span>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      (+{item.healsFor} HP)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loot Log */}
          {lootLog.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Recent Loot:
              </div>
              <div className="flex flex-wrap gap-2">
                {lootLog.map((loot, idx) => {
                  const item = getItem(loot.itemId);
                  return (
                    <span
                      key={`${loot.itemId}-${idx}`}
                      className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    >
                      <span>{item?.icon}</span>
                      <span>
                        {item?.name} x{loot.quantity}
                      </span>
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
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Select Combat Area
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {COMBAT_AREAS.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  selectedAreaId === area.id
                    ? 'border-zinc-500 bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{area.icon}</span>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {area.name}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Levels {area.levelRecommendation}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Monster Selection */}
      {!inCombat && selectedArea && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            {selectedArea.name} - Select Monster
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {selectedArea.monsters.map((mId) => {
              const monster = getMonster(mId);
              if (!monster) return null;

              return (
                <button
                  key={mId}
                  onClick={() => handleStartCombat(mId)}
                  className="rounded-lg border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-red-400 hover:bg-red-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-600 dark:hover:bg-red-950"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{monster.icon}</span>
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {monster.name}
                        </div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                          Level {monster.combatLevel}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-zinc-600 dark:text-zinc-400">
                        {monster.hitpoints} HP
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-500">
                        Max hit: {monster.maxHit}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
