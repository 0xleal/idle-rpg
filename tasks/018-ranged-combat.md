# Task 018: Ranged Combat

## Goal
Implement ranged combat as an alternative to melee, using bows and arrows.

## Deliverables

### 1. Ranged Equipment
**Weapons (from Fletching):**
- Shortbows (faster, lower damage)
- Longbows (slower, higher damage)
- Tiers: Normal → Oak → Willow → Maple → Yew

**Ammunition:**
- Arrows (bronze through rune)
- Consumed on each attack

**Armor (from Crafting):**
- Leather armor (light ranged bonus)
- Dragonhide armor (better ranged bonus)

### 2. Combat System Updates

**Combat Style Selection:**
- Add "Ranged" combat style option
- Only available when bow equipped

**Ranged Attack Calculation:**
- Uses Ranged level instead of Attack
- Uses ranged bonus from equipment
- Arrow tier affects max hit

**Ammo Consumption:**
- One arrow consumed per attack
- Combat stops if out of ammo
- Show ammo count in combat UI

### 3. Equipment Updates
- Add "ammo" equipment slot
- Bows go in weapon slot
- Validate bow + arrows equipped for ranged

### 4. XP Rewards
- Ranged XP on hit (like attack/strength)
- Hitpoints XP as normal

### 5. Combat Page Updates
- Show equipped bow and arrow count
- Ranged style option
- Warning if no ammo

### 6. Types Updates
```ts
// Add to equipment slots
type EquipmentSlot = ... | 'ammo';

// Weapon type
interface WeaponStats {
  attackSpeed: number;
  combatType: 'melee' | 'ranged' | 'magic';
}
```

## Dependencies
- Task 015 (Fletching) - for bows and arrows
- Task 016 (Crafting) - for ranged armor

## Acceptance Criteria
- [ ] Can equip bows and arrows
- [ ] Ranged combat style available with bow
- [ ] Arrows consumed on attack
- [ ] Ranged XP granted
- [ ] Combat stops when out of ammo
- [ ] Ranged armor provides ranged bonus
