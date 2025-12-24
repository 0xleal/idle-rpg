# Task 007: Smithing Skill

## Goal
First artisan skill - transform ores into bars and bars into equipment.

## Deliverables

### 1. Smithing Data
- `data/skills/smithing.ts`
- Two action types: smelting and forging

**Smelting (bars):**
| Bar | Level | Ores Required | XP |
|-----|-------|---------------|-----|
| Bronze | 1 | 1 copper + 1 tin | 6 |
| Iron | 15 | 1 iron ore | 12 |
| Steel | 30 | 1 iron + 2 coal | 17 |
| Mithril | 50 | 1 mithril + 4 coal | 30 |
| Adamant | 70 | 1 adamant + 6 coal | 37 |
| Rune | 85 | 1 rune + 8 coal | 50 |

**Forging (equipment):** (basic set per tier)
- Dagger, Sword, Scimitar (weapons)
- Helmet, Platebody, Platelegs (armor)
- Each requires bars, grants XP, produces equipment item

### 2. Recipe System
- `types/game.ts` - add Recipe type
- Recipe: inputs (itemId, quantity)[], outputs, xp, levelReq, duration

### 3. Resource Definitions
- Add bars: bronze_bar, iron_bar, steel_bar, mithril_bar, adamant_bar, rune_bar
- Add equipment items (with stats for later)

### 4. Smithing Page
- `app/skills/smithing/page.tsx`
- Two tabs/sections: Smelting | Forging
- Show required materials, highlight if player has them
- Disabled if missing materials

### 5. Store Updates
- Modify `startAction` to support recipes (consume inputs)
- Or create separate `startCraftingAction`

## Acceptance Criteria
- [ ] Can smelt ores into bars
- [ ] Can forge bars into equipment
- [ ] Materials consumed correctly
- [ ] Can't craft without required materials
- [ ] Equipment appears in inventory
