# Phase 4: Complete Skills & Systems

## Overview
Phase 4 completes all remaining skills and game systems that were defined but not implemented.

## Missing Skills

### Gathering
| Task | Skill | Description |
|------|-------|-------------|
| 014 | Farming | Plant seeds, grow crops over real time |

### Artisan
| Task | Skill | Description |
|------|-------|-------------|
| 015 | Fletching | Craft bows and arrows from logs |
| 016 | Crafting | Make leather armor and jewelry |
| 017 | Herblore | Create potions from herbs |

### Combat Support
| Task | Skill | Description |
|------|-------|-------------|
| 018 | Ranged Combat | Bows, arrows, ranged armor |
| 019 | Magic Combat | Spells, runes, magic equipment |
| 020 | Prayer | Bury bones, activate combat prayers |

## Missing Systems

| Task | System | Description |
|------|--------|-------------|
| 021 | Shop | Buy/sell items for gold |

## Dependencies

```
Fletching (015) ──┐
                  ├──► Ranged Combat (018)
Crafting (016) ───┘

Farming (014) ────► Herblore (017)

Prayer (020) - standalone (uses existing bones)

Shop (021) - standalone (uses existing sellPrice)
```

## Recommended Order

**Batch 1 - No dependencies:**
- Task 020: Prayer (uses existing dragon bones)
- Task 021: Shop (uses existing sellPrice)

**Batch 2 - Foundation crafting:**
- Task 015: Fletching (needs logs from woodcutting)
- Task 016: Crafting (needs hides, gems, gold)

**Batch 3 - Dependent skills:**
- Task 014: Farming (standalone but long, do alongside others)
- Task 018: Ranged Combat (needs fletching + crafting)

**Batch 4 - Advanced:**
- Task 017: Herblore (needs farming herbs)
- Task 019: Magic Combat (needs runes - may need runecrafting or shop)

## Future Considerations (Not Scoped)
- Runecrafting skill (craft runes from essence)
- Agility skill (unlock shortcuts, run energy)
- Thieving skill (steal from NPCs/stalls)
- Slayer skill (kill assigned monsters)
- Quest system
- Achievement diary
- Bank system (separate from inventory)
- Trading/multiplayer
