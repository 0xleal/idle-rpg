'use client';

import { useGameStore } from '@/store/gameStore';
import { ALL_EQUIPMENT_SLOTS, EquipmentSlot, SLOT_NAMES, EquipmentStats } from '@/types/equipment';
import { getEquipment } from '@/data/equipment';
import { getItem } from '@/data/resources';
import { levelForXp } from '@/lib/experience';

export default function EquipmentPage() {
  const equipment = useGameStore((state) => state.equipment);
  const inventory = useGameStore((state) => state.inventory);
  const skills = useGameStore((state) => state.skills);
  const unequipSlot = useGameStore((state) => state.unequipSlot);
  const equipItem = useGameStore((state) => state.equipItem);
  const canEquipItem = useGameStore((state) => state.canEquipItem);

  // Calculate total stats from equipped gear
  const totalStats: EquipmentStats = {};
  for (const slot of ALL_EQUIPMENT_SLOTS) {
    const itemId = equipment[slot];
    if (itemId) {
      const equipDef = getEquipment(itemId);
      if (equipDef) {
        if (equipDef.stats.attackBonus) {
          totalStats.attackBonus = (totalStats.attackBonus || 0) + equipDef.stats.attackBonus;
        }
        if (equipDef.stats.strengthBonus) {
          totalStats.strengthBonus = (totalStats.strengthBonus || 0) + equipDef.stats.strengthBonus;
        }
        if (equipDef.stats.defenceBonus) {
          totalStats.defenceBonus = (totalStats.defenceBonus || 0) + equipDef.stats.defenceBonus;
        }
        if (equipDef.stats.rangedBonus) {
          totalStats.rangedBonus = (totalStats.rangedBonus || 0) + equipDef.stats.rangedBonus;
        }
        if (equipDef.stats.magicBonus) {
          totalStats.magicBonus = (totalStats.magicBonus || 0) + equipDef.stats.magicBonus;
        }
      }
    }
  }

  // Get equippable items from inventory
  const equippableItems = Object.entries(inventory)
    .filter(([itemId, qty]) => qty > 0 && getEquipment(itemId))
    .map(([itemId, qty]) => ({
      itemId,
      quantity: qty,
      equipment: getEquipment(itemId)!,
      item: getItem(itemId),
      canEquip: canEquipItem(itemId),
    }));

  const handleUnequip = (slot: EquipmentSlot) => {
    unequipSlot(slot);
  };

  const handleEquip = (itemId: string) => {
    equipItem(itemId);
  };

  const getRequirementText = (itemId: string): string | null => {
    const equipDef = getEquipment(itemId);
    if (!equipDef?.requirements) return null;

    const reqs: string[] = [];
    for (const [skill, level] of Object.entries(equipDef.requirements)) {
      const playerLevel = levelForXp(skills[skill as keyof typeof skills]?.xp || 0);
      if (playerLevel < level) {
        reqs.push(`${skill} ${level}`);
      }
    }
    return reqs.length > 0 ? `Requires: ${reqs.join(', ')}` : null;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        Equipment
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Equipment Slots */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Equipped Gear
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {ALL_EQUIPMENT_SLOTS.map((slot) => {
              const itemId = equipment[slot];
              const equipDef = itemId ? getEquipment(itemId) : null;
              const itemDef = itemId ? getItem(itemId) : null;

              return (
                <button
                  key={slot}
                  onClick={() => itemId && handleUnequip(slot)}
                  disabled={!itemId}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    itemId
                      ? 'border-zinc-300 bg-zinc-50 hover:border-red-400 hover:bg-red-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-red-600 dark:hover:bg-red-950'
                      : 'border-dashed border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900'
                  }`}
                >
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    {SLOT_NAMES[slot]}
                  </div>
                  {itemId && equipDef && itemDef ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{itemDef.icon}</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {itemDef.name}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {equipDef.stats.attackBonus && (
                          <span className="text-xs text-orange-600 dark:text-orange-400">
                            +{equipDef.stats.attackBonus} Atk
                          </span>
                        )}
                        {equipDef.stats.strengthBonus && (
                          <span className="text-xs text-red-600 dark:text-red-400">
                            +{equipDef.stats.strengthBonus} Str
                          </span>
                        )}
                        {equipDef.stats.defenceBonus && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            +{equipDef.stats.defenceBonus} Def
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-400 dark:text-zinc-600">
                      Empty
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Combat Stats
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-950">
              <div className="text-xs text-orange-600 dark:text-orange-400">Attack Bonus</div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                +{totalStats.attackBonus || 0}
              </div>
            </div>
            <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
              <div className="text-xs text-red-600 dark:text-red-400">Strength Bonus</div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                +{totalStats.strengthBonus || 0}
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
              <div className="text-xs text-blue-600 dark:text-blue-400">Defence Bonus</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                +{totalStats.defenceBonus || 0}
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
              <div className="text-xs text-green-600 dark:text-green-400">Ranged Bonus</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                +{totalStats.rangedBonus || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equippable Items from Inventory */}
      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Equippable Items
        </h2>
        {equippableItems.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No equippable items in inventory. Smith some gear!
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {equippableItems.map(({ itemId, quantity, equipment: equip, item, canEquip }) => {
              const requirementText = getRequirementText(itemId);
              return (
                <button
                  key={itemId}
                  onClick={() => handleEquip(itemId)}
                  disabled={!canEquip}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    canEquip
                      ? 'border-zinc-200 bg-white hover:border-green-400 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-600 dark:hover:bg-green-950'
                      : 'cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-800 dark:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{item?.icon}</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item?.name}
                    </span>
                    <span className="text-xs text-zinc-500">x{quantity}</span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    {SLOT_NAMES[equip.slot]}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {equip.stats.attackBonus && (
                      <span className="text-xs text-orange-600 dark:text-orange-400">
                        +{equip.stats.attackBonus} Atk
                      </span>
                    )}
                    {equip.stats.strengthBonus && (
                      <span className="text-xs text-red-600 dark:text-red-400">
                        +{equip.stats.strengthBonus} Str
                      </span>
                    )}
                    {equip.stats.defenceBonus && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        +{equip.stats.defenceBonus} Def
                      </span>
                    )}
                  </div>
                  {requirementText && (
                    <div className="mt-1 text-xs text-red-500">
                      {requirementText}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
