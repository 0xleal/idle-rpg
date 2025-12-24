# Phase 2: Core Game Loop

## Overview
Expand from single gathering skill to full resource → craft → combat loop.

## Tasks (In Order)

### Gathering Expansion
1. **[005-mining-skill](./005-mining-skill.md)** - Mining with gem drops
2. **[006-fishing-skill](./006-fishing-skill.md)** - Fishing for raw fish

### Artisan Foundation
3. **[007-smithing-skill](./007-smithing-skill.md)** - Ore → bars → equipment
4. **[008-cooking-skill](./008-cooking-skill.md)** - Raw fish → food

### Combat System
5. **[009-equipment-system](./009-equipment-system.md)** - Equip gear for stats
6. **[010-combat-system](./010-combat-system.md)** - Fight monsters
7. **[011-food-healing](./011-food-healing.md)** - Heal during combat

## Success Criteria
Player can:
1. Mine ores, fish for raw fish
2. Smelt ores into bars, forge equipment
3. Cook fish into food
4. Equip crafted gear
5. Fight monsters using gear
6. Heal with food during combat
7. Level all implemented skills

## Dependencies
- Task 007 (Smithing) requires Task 005 (Mining)
- Task 008 (Cooking) requires Task 006 (Fishing)
- Task 010 (Combat) requires Task 009 (Equipment)
- Task 011 (Food Healing) requires Tasks 008 + 010

## Future Phases
- **Phase 3**: Ranged/Magic combat, Fletching, Crafting
- **Phase 4**: Prayer system, Herblore
- **Phase 5**: Dungeons
- **Phase 6**: Mastery, Achievements, Pets, Polish
