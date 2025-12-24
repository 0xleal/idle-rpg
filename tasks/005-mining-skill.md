# Task 005: Mining Skill

## Goal
Add Mining as the second gathering skill, following the Woodcutting pattern.

## Deliverables

### 1. Mining Data
- `data/skills/mining.ts`
- Rocks: Copper (lvl 1), Tin (lvl 1), Iron (lvl 15), Coal (lvl 30), Mithril (lvl 55), Adamant (lvl 70), Rune (lvl 85)
- Each rock: name, levelReq, xp, baseTime, oreProduced
- Gem chance on any rock (small %)

### 2. Resource Definitions
- Add to `data/resources.ts`:
  - Ores: copper_ore, tin_ore, iron_ore, coal, mithril_ore, adamant_ore, rune_ore
  - Gems: sapphire, emerald, ruby, diamond (rare drops)

### 3. Mining Page
- `app/skills/mining/page.tsx`
- Same structure as Woodcutting
- Show ore icon and gem chance indicator

### 4. Gem Drop System
- Modify tick or add post-completion hook
- ~1-3% chance to also receive a gem on ore completion
- Gem tier based on mining level

## Acceptance Criteria
- [ ] Can mine all rock types
- [ ] XP and leveling works correctly
- [ ] Ores appear in inventory
- [ ] Gems drop occasionally
- [ ] Higher level rocks locked appropriately
