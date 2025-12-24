import { EquipmentSlot, EquipmentStats } from '@/types/equipment';
import { getEquipment } from '@/data/equipment';

// Get total equipment stats from equipped items
export function getTotalEquipmentStats(
  equipment: Partial<Record<EquipmentSlot, string>>
): EquipmentStats {
  const total: EquipmentStats = {
    attackBonus: 0,
    strengthBonus: 0,
    defenceBonus: 0,
    rangedBonus: 0,
    magicBonus: 0,
  };

  for (const itemId of Object.values(equipment)) {
    if (!itemId) continue;
    const equip = getEquipment(itemId);
    if (!equip) continue;

    total.attackBonus! += equip.stats.attackBonus || 0;
    total.strengthBonus! += equip.stats.strengthBonus || 0;
    total.defenceBonus! += equip.stats.defenceBonus || 0;
    total.rangedBonus! += equip.stats.rangedBonus || 0;
    total.magicBonus! += equip.stats.magicBonus || 0;
  }

  return total;
}

// Calculate player's effective attack level
export function getEffectiveAttack(attackLevel: number, attackBonus: number): number {
  // Base formula: level + 8 + bonus
  return attackLevel + 8 + Math.floor(attackBonus / 4);
}

// Calculate player's effective strength
export function getEffectiveStrength(strengthLevel: number, strengthBonus: number): number {
  return strengthLevel + 8 + Math.floor(strengthBonus / 4);
}

// Calculate player's effective defence
export function getEffectiveDefence(defenceLevel: number, defenceBonus: number): number {
  return defenceLevel + 8 + Math.floor(defenceBonus / 4);
}

// Calculate hit chance (0-1)
export function calculateHitChance(
  effectiveAttack: number,
  targetDefence: number
): number {
  // Simplified accuracy formula
  const attackRoll = effectiveAttack * (64 + 1);
  const defenceRoll = targetDefence * (64 + 1);

  if (attackRoll > defenceRoll) {
    return 1 - (defenceRoll + 2) / (2 * (attackRoll + 1));
  } else {
    return attackRoll / (2 * (defenceRoll + 1));
  }
}

// Calculate max hit for player
export function calculateMaxHit(effectiveStrength: number): number {
  // Simplified max hit formula
  return Math.floor(1.3 + effectiveStrength / 10 + (effectiveStrength * effectiveStrength) / 640);
}

// Roll damage between 0 and maxHit (uniform distribution)
export function rollDamage(maxHit: number): number {
  return Math.floor(Math.random() * (maxHit + 1));
}

// Check if attack hits
export function doesAttackHit(hitChance: number): boolean {
  return Math.random() < hitChance;
}

// Calculate player's attack speed (base 2400ms, affected by weapon)
export function getPlayerAttackSpeed(): number {
  // For now, fixed at 2.4 seconds
  return 2400;
}

// Calculate player max HP based on hitpoints level
// Formula: 10 + (level - 1) * 4
// Level 1 = 10 HP, Level 99 = 402 HP
export function getPlayerMaxHp(hitpointsLevel: number): number {
  return 10 + (hitpointsLevel - 1) * 4;
}

// Calculate combat level for display
export function calculateCombatLevel(
  attackLevel: number,
  strengthLevel: number,
  defenceLevel: number,
  hitpointsLevel: number
): number {
  const base = 0.25 * (defenceLevel + hitpointsLevel);
  const melee = 0.325 * (attackLevel + strengthLevel);
  return Math.floor(base + melee);
}
