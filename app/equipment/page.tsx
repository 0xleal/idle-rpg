'use client';

import { useGameStore } from '@/store/gameStore';
import { ALL_EQUIPMENT_SLOTS, EquipmentSlot, SLOT_NAMES, EquipmentStats } from '@/types/equipment';
import { getEquipment } from '@/data/equipment';
import { getItem } from '@/data/resources';
import { levelForXp } from '@/lib/experience';

const SLOT_ICONS: Record<EquipmentSlot, string> = {
  head: '🪖',
  body: '🦺',
  legs: '👖',
  boots: '👢',
  gloves: '🧤',
  cape: '🧣',
  amulet: '📿',
  ring: '💍',
  weapon: '⚔️',
  shield: '🛡️',
  tool: '🔧',
};

const SKILL_NAMES: Record<string, string> = {
  woodcutting: 'Woodcutting',
  mining: 'Mining',
  fishing: 'Fishing',
};

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
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="skill-icon"
            style={{ background: 'rgba(249, 115, 22, 0.15)' }}
          >
            <span className="animate-float">⚔️</span>
          </div>
          <div>
            <h1 className="font-[var(--font-cinzel)] text-3xl font-bold text-gradient">
              Equipment
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Equip gear to boost your combat stats
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Equipment Slots */}
        <div className="card p-5">
          <div className="section-header mb-4">
            <span className="section-title">Equipped Gear</span>
            <span className="section-line" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ALL_EQUIPMENT_SLOTS.map((slot, index) => {
              const itemId = equipment[slot];
              const equipDef = itemId ? getEquipment(itemId) : null;
              const itemDef = itemId ? getItem(itemId) : null;

              return (
                <button
                  key={slot}
                  onClick={() => itemId && handleUnequip(slot)}
                  disabled={!itemId}
                  className={`equipment-slot opacity-0 animate-fade-in ${itemId ? 'equipment-slot-filled' : 'equipment-slot-empty'}`}
                  style={{
                    animationDelay: `${index * 0.03}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                      {SLOT_NAMES[slot]}
                    </span>
                    <span className="text-sm opacity-50">{SLOT_ICONS[slot]}</span>
                  </div>
                  {itemId && equipDef && itemDef ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{itemDef.icon}</span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {itemDef.name}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {equipDef.stats.attackBonus && (
                          <span className="stat-bonus stat-bonus-attack">
                            +{equipDef.stats.attackBonus} Atk
                          </span>
                        )}
                        {equipDef.stats.strengthBonus && (
                          <span className="stat-bonus stat-bonus-strength">
                            +{equipDef.stats.strengthBonus} Str
                          </span>
                        )}
                        {equipDef.stats.defenceBonus && (
                          <span className="stat-bonus stat-bonus-defence">
                            +{equipDef.stats.defenceBonus} Def
                          </span>
                        )}
                        {equipDef.stats.rangedBonus && (
                          <span className="stat-bonus stat-bonus-ranged">
                            +{equipDef.stats.rangedBonus} Rng
                          </span>
                        )}
                        {equipDef.stats.magicBonus && (
                          <span className="stat-bonus stat-bonus-magic">
                            +{equipDef.stats.magicBonus} Mag
                          </span>
                        )}
                        {equipDef.stats.speedBonus && equipDef.toolForSkill && (
                          <span className="stat-bonus" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
                            +{Math.round(equipDef.stats.speedBonus * 100)}% {SKILL_NAMES[equipDef.toolForSkill] || equipDef.toolForSkill}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-[var(--text-muted)] italic">
                      Empty
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="card p-5">
          <div className="section-header mb-4">
            <span className="section-title">Combat Stats</span>
            <span className="section-line" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-block" style={{ background: 'rgba(249, 115, 22, 0.08)', borderColor: 'rgba(249, 115, 22, 0.2)' }}>
              <div className="stat-label" style={{ color: '#fb923c' }}>Attack Bonus</div>
              <div className="stat-value" style={{ color: '#fb923c' }}>
                +{totalStats.attackBonus || 0}
              </div>
            </div>
            <div className="stat-block" style={{ background: 'rgba(220, 38, 38, 0.08)', borderColor: 'rgba(220, 38, 38, 0.2)' }}>
              <div className="stat-label" style={{ color: '#f87171' }}>Strength Bonus</div>
              <div className="stat-value" style={{ color: '#f87171' }}>
                +{totalStats.strengthBonus || 0}
              </div>
            </div>
            <div className="stat-block" style={{ background: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
              <div className="stat-label" style={{ color: '#60a5fa' }}>Defence Bonus</div>
              <div className="stat-value" style={{ color: '#60a5fa' }}>
                +{totalStats.defenceBonus || 0}
              </div>
            </div>
            <div className="stat-block" style={{ background: 'rgba(132, 204, 22, 0.08)', borderColor: 'rgba(132, 204, 22, 0.2)' }}>
              <div className="stat-label" style={{ color: '#a3e635' }}>Ranged Bonus</div>
              <div className="stat-value" style={{ color: '#a3e635' }}>
                +{totalStats.rangedBonus || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equippable Items from Inventory */}
      <div className="card p-5 mt-6">
        <div className="section-header mb-4">
          <span className="section-title">Equippable Items</span>
          <span className="section-line" />
        </div>
        {equippableItems.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-3xl mb-3 block">🔧</span>
            <p className="text-sm text-[var(--text-muted)]">
              No equippable items in inventory. Smith some gear!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {equippableItems.map(({ itemId, quantity, equipment: equip, item, canEquip }, index) => {
              const requirementText = getRequirementText(itemId);
              return (
                <button
                  key={itemId}
                  onClick={() => handleEquip(itemId)}
                  disabled={!canEquip}
                  className={`equipment-slot opacity-0 animate-fade-in ${canEquip ? '' : 'opacity-50'}`}
                  style={{
                    animationDelay: `${index * 0.03}s`,
                    animationFillMode: 'forwards',
                    borderColor: canEquip ? 'var(--border-card)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{item?.icon}</span>
                    <span className="text-sm font-medium text-[var(--text-primary)] flex-1 text-left">
                      {item?.name}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">x{quantity}</span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mb-1.5">
                    {SLOT_NAMES[equip.slot]}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {equip.stats.attackBonus && (
                      <span className="stat-bonus stat-bonus-attack">
                        +{equip.stats.attackBonus} Atk
                      </span>
                    )}
                    {equip.stats.strengthBonus && (
                      <span className="stat-bonus stat-bonus-strength">
                        +{equip.stats.strengthBonus} Str
                      </span>
                    )}
                    {equip.stats.defenceBonus && (
                      <span className="stat-bonus stat-bonus-defence">
                        +{equip.stats.defenceBonus} Def
                      </span>
                    )}
                    {equip.stats.rangedBonus && (
                      <span className="stat-bonus stat-bonus-ranged">
                        +{equip.stats.rangedBonus} Rng
                      </span>
                    )}
                    {equip.stats.magicBonus && (
                      <span className="stat-bonus stat-bonus-magic">
                        +{equip.stats.magicBonus} Mag
                      </span>
                    )}
                    {equip.stats.speedBonus && equip.toolForSkill && (
                      <span className="stat-bonus" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
                        +{Math.round(equip.stats.speedBonus * 100)}% {SKILL_NAMES[equip.toolForSkill] || equip.toolForSkill}
                      </span>
                    )}
                  </div>
                  {requirementText && (
                    <div className="mt-1.5 text-xs text-[#f87171]">
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
