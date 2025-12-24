# Task 009: Equipment System

## Goal
Add equipment slots and the ability to equip gear for combat bonuses.

## Deliverables

### 1. Equipment Types
- `types/equipment.ts`

```ts
type EquipmentSlot =
  | 'head' | 'body' | 'legs' | 'boots' | 'gloves'
  | 'cape' | 'amulet' | 'ring'
  | 'weapon' | 'shield';

interface EquipmentStats {
  attackBonus?: number;
  strengthBonus?: number;
  defenceBonus?: number;
  rangedBonus?: number;
  magicBonus?: number;
}

interface EquipmentDefinition extends ItemDefinition {
  slot: EquipmentSlot;
  stats: EquipmentStats;
  levelRequirements?: Partial<Record<SkillId, number>>;
}
```

### 2. Player Equipment State
- Add to PlayerState: `equipment: Partial<Record<EquipmentSlot, string>>`
- Store actions: `equip(itemId)`, `unequip(slot)`

### 3. Equipment Data
- Update smithing equipment items with stats
- Bronze → Iron → Steel → Mithril → Adamant → Rune progression
- Each tier ~10-15% better than previous

### 4. Equipment Page
- `app/equipment/page.tsx`
- Visual slot layout (paper doll style or grid)
- Click equipped item to unequip
- Show total stats from all equipped gear

### 5. Inventory Integration
- In inventory, click equippable item to equip
- Show "Equip" action or double-click
- Equipped items removed from inventory count (or marked)

## Acceptance Criteria
- [ ] Can equip items to correct slots
- [ ] Can unequip items (return to inventory)
- [ ] Equipment stats displayed
- [ ] Can't equip if missing level requirements
- [ ] Swapping equipment works correctly
