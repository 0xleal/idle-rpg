# Task 011: Food & Healing in Combat

## Goal
Use cooked food to heal during combat.

## Deliverables

### 1. Food Selection
- Add to combat state: `selectedFood: string | null`
- UI to select which food to use from inventory

### 2. Auto-Eat System
- `autoEatThreshold: number` (e.g., 50% HP)
- When player HP drops below threshold, consume food
- Heal for food's `healsFor` value
- Remove food from inventory

### 3. Combat Integration
- Check food availability before entering combat
- Warning if no food selected
- Show food remaining during combat

### 4. Max HP
- Hitpoints level determines max HP
- Formula: `maxHp = 10 + (hitpointsLevel - 1) * 4`
- Level 1 = 10 HP, Level 99 = 402 HP

## Acceptance Criteria
- [ ] Can select food for combat
- [ ] Food auto-consumed when HP low
- [ ] Correct heal amount applied
- [ ] Food removed from inventory
- [ ] Combat stops if no food and would die
