# Task 016: Crafting Skill

## Goal
Implement the Crafting skill - create jewelry, leather armor, and other items.

## Deliverables

### 1. Crafting Data
- `data/skills/crafting.ts`

### 2. Leather Working

**Leather (from cowhide):**
- Tan cowhide → Leather (requires gold, done at tanner or furnace)

**Leather Armor:**
| Item | Level | Leather | XP |
|------|-------|---------|-----|
| Leather gloves | 1 | 1 | 14 |
| Leather boots | 7 | 1 | 17 |
| Leather cowl | 9 | 1 | 19 |
| Leather vambraces | 11 | 1 | 22 |
| Leather body | 14 | 1 | 25 |
| Leather chaps | 18 | 1 | 27 |

**Dragonhide Armor (from dragonhide):**
- Green d'hide vambraces (lvl 57)
- Green d'hide chaps (lvl 60)
- Green d'hide body (lvl 63)

### 3. Jewelry

**Rings & Amulets (from gold bar + gem):**
| Item | Level | Materials | XP |
|------|-------|-----------|-----|
| Gold ring | 5 | Gold bar | 15 |
| Sapphire ring | 20 | Gold bar + Sapphire | 40 |
| Emerald ring | 27 | Gold bar + Emerald | 55 |
| Ruby ring | 34 | Gold bar + Ruby | 70 |
| Diamond ring | 43 | Gold bar + Diamond | 85 |
| Gold amulet (u) | 8 | Gold bar | 30 |
| Sapphire amulet | 24 | Gold bar + Sapphire | 65 |
| Emerald amulet | 31 | Gold bar + Emerald | 70 |
| Ruby amulet | 50 | Gold bar + Ruby | 85 |
| Diamond amulet | 70 | Gold bar + Diamond | 100 |

### 4. New Items
- Leather (tanned hide)
- Leather armor set (equippable)
- Dragonhide armor (equippable, ranged bonus)
- Jewelry (rings and amulets with stat bonuses)
- Gold bar (from gold ore via smithing)

### 5. Crafting Page
- `app/skills/crafting/page.tsx`
- Categories: Leather, Dragonhide, Jewelry
- Show input requirements

### 6. Mining/Smithing Integration
- Add gold ore to mining
- Add gold bar smelting to smithing

### 7. Equipment Integration
- Leather armor → light armor with ranged bonus
- Dragonhide → better ranged armor
- Rings → ring equipment slot
- Amulets → amulet equipment slot

## Acceptance Criteria
- [ ] Can tan hides into leather
- [ ] Can craft leather armor
- [ ] Can craft dragonhide armor
- [ ] Can craft jewelry
- [ ] All items equippable in correct slots
- [ ] Jewelry provides stat bonuses
