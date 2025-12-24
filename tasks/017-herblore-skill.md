# Task 017: Herblore Skill

## Goal
Implement the Herblore skill - create potions from herbs and secondary ingredients.

## Deliverables

### 1. Herblore Data
- `data/skills/herblore.ts`

### 2. Potion Making Process
1. Clean grimy herb → Clean herb (small XP)
2. Add herb to vial of water → Unfinished potion
3. Add secondary ingredient → Finished potion

### 3. Potions

| Potion | Level | Herb | Secondary | Effect |
|--------|-------|------|-----------|--------|
| Attack potion | 3 | Guam | Eye of newt | +10% Attack |
| Strength potion | 12 | Tarromin | Limpwurt root | +10% Strength |
| Defence potion | 15 | Marrentill | Bear fur | +10% Defence |
| Combat potion | 36 | Harralander | Goat horn dust | +10% Atk/Str |
| Super attack | 45 | Irit | Eye of newt | +15% Attack |
| Super strength | 55 | Kwuarm | Limpwurt root | +15% Strength |
| Super defence | 66 | Cadantine | White berries | +15% Defence |
| Ranging potion | 72 | Dwarf weed | Wine of zamorak | +15% Ranged |
| Magic potion | 76 | Lantadyme | Potato cactus | +15% Magic |
| Super combat | 90 | Torstol | Super attack + str + def | +15% all melee |

### 4. Secondary Ingredients
Sources:
- Eye of newt - shop or monster drop
- Limpwurt root - farming or monster drop
- Other secondaries - various sources

### 5. Potion Effects in Combat
- Potions provide temporary stat boosts
- Duration: 5 minutes or until combat ends
- One potion active per stat type

### 6. Combat Integration
- Add potion slot to combat UI
- Apply potion effects to combat calculations
- Show active potion buffs

### 7. Herblore Page
- `app/skills/herblore/page.tsx`
- Clean herbs section
- Make unfinished potions
- Finish potions
- Show active effects

## Acceptance Criteria
- [ ] Can clean grimy herbs
- [ ] Can make unfinished potions
- [ ] Can complete potions with secondaries
- [ ] Potions provide combat buffs
- [ ] Buff duration tracked
- [ ] XP granted at each step
