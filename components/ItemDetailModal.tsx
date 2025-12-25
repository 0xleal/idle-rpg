'use client';

import { getItem } from '@/data/resources';
import { getEquipment, isEquipment } from '@/data/equipment';
import { SkillId } from '@/types/game';

interface ItemDetailModalProps {
  itemId: string;
  quantity?: number;
  onClose: () => void;
  onEquip?: () => void;
  onSell?: (quantity: number) => void;
  showActions?: boolean;
}

const SKILL_NAMES: Record<SkillId, string> = {
  woodcutting: 'Woodcutting',
  mining: 'Mining',
  fishing: 'Fishing',
  farming: 'Farming',
  smithing: 'Smithing',
  cooking: 'Cooking',
  fletching: 'Fletching',
  crafting: 'Crafting',
  herblore: 'Herblore',
  attack: 'Attack',
  strength: 'Strength',
  defence: 'Defence',
  hitpoints: 'Hitpoints',
  ranged: 'Ranged',
  magic: 'Magic',
  prayer: 'Prayer',
};

export function ItemDetailModal({
  itemId,
  quantity,
  onClose,
  onEquip,
  onSell,
  showActions = true,
}: ItemDetailModalProps) {
  const item = getItem(itemId);
  const equipment = isEquipment(itemId) ? getEquipment(itemId) : null;

  if (!item) {
    return null;
  }

  const hasStats = equipment && (
    equipment.stats.attackBonus ||
    equipment.stats.strengthBonus ||
    equipment.stats.defenceBonus ||
    equipment.stats.rangedBonus ||
    equipment.stats.magicBonus
  );

  const isTool = equipment?.toolForSkill && equipment?.stats.speedBonus;
  const isFood = item.healsFor && item.healsFor > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-sm p-5 animate-fade-in m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{item.icon}</div>
          <div className="flex-1">
            <h2 className="font-[var(--font-cinzel)] text-lg font-bold text-[var(--text-primary)]">
              {item.name}
            </h2>
            {quantity !== undefined && quantity > 0 && (
              <p className="text-sm text-[var(--text-muted)]">
                Quantity: {quantity.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* Description */}
        {(item.description || equipment?.description) && (
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {equipment?.description || item.description}
          </p>
        )}

        {/* Stats Section */}
        <div className="space-y-3">
          {/* Tool Speed Bonus */}
          {isTool && (
            <div className="rounded-lg p-3 bg-[#22c55e]/10 border border-[#22c55e]/20">
              <div className="text-xs font-medium text-[#22c55e] mb-1">Tool Bonus</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#4ade80]">{SKILL_NAMES[equipment.toolForSkill!]} Speed</span>
                <span className="text-[#4ade80] font-medium">+{Math.round(equipment.stats.speedBonus! * 100)}%</span>
              </div>
            </div>
          )}

          {/* Combat Stats */}
          {hasStats && (
            <div className="rounded-lg p-3 bg-[#3b82f6]/10 border border-[#3b82f6]/20">
              <div className="text-xs font-medium text-[#3b82f6] mb-1">Combat Stats</div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {equipment.stats.attackBonus && (
                  <div className="text-[#60a5fa]">Attack: +{equipment.stats.attackBonus}</div>
                )}
                {equipment.stats.strengthBonus && (
                  <div className="text-[#60a5fa]">Strength: +{equipment.stats.strengthBonus}</div>
                )}
                {equipment.stats.defenceBonus && (
                  <div className="text-[#60a5fa]">Defence: +{equipment.stats.defenceBonus}</div>
                )}
                {equipment.stats.rangedBonus && (
                  <div className="text-[#60a5fa]">Ranged: +{equipment.stats.rangedBonus}</div>
                )}
                {equipment.stats.magicBonus && (
                  <div className="text-[#60a5fa]">Magic: +{equipment.stats.magicBonus}</div>
                )}
              </div>
            </div>
          )}

          {/* Requirements */}
          {equipment?.requirements && Object.keys(equipment.requirements).length > 0 && (
            <div className="rounded-lg p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/20">
              <div className="text-xs font-medium text-[#f59e0b] mb-1">Requirements</div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {Object.entries(equipment.requirements).map(([skill, level]) => (
                  <div key={skill} className="text-[#fbbf24] capitalize">
                    {skill}: {level}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food Healing */}
          {isFood && (
            <div className="rounded-lg p-3 bg-[#ec4899]/10 border border-[#ec4899]/20">
              <div className="text-xs font-medium text-[#ec4899] mb-1">Healing</div>
              <div className="text-sm text-[#f472b6]">
                Restores {item.healsFor} HP
              </div>
            </div>
          )}

          {/* Sell Price */}
          {item.sellPrice && item.sellPrice > 0 && (
            <div className="flex items-center justify-between text-sm text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
              <span>Sell Price</span>
              <span className="text-[var(--accent-gold)]">{item.sellPrice}g each</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 mt-5">
            {equipment && onEquip && (
              <button
                onClick={() => {
                  onEquip();
                  onClose();
                }}
                className="btn-primary flex-1"
              >
                Equip
              </button>
            )}
            {item.sellPrice && item.sellPrice > 0 && onSell && quantity && quantity > 0 && (
              <button
                onClick={() => {
                  onSell(1);
                  onClose();
                }}
                className="btn-secondary flex-1"
              >
                Sell ({item.sellPrice}g)
              </button>
            )}
            <button onClick={onClose} className="btn-ghost flex-1">
              Close
            </button>
          </div>
        )}

        {!showActions && (
          <button onClick={onClose} className="btn-primary w-full mt-5">
            Close
          </button>
        )}
      </div>
    </div>
  );
}
