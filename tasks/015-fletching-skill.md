# Task 015: Fletching Skill

## Goal
Implement the Fletching skill - craft bows and arrows from logs and other materials.

## Deliverables

### 1. Fletching Data
- `data/skills/fletching.ts`

### 2. Products

**Arrow Shafts (from logs):**
- 1 log → 15 arrow shafts

**Arrows (shafts + feathers + arrowheads):**
- Bronze arrows (lvl 1) - 15 shafts + 15 feathers + 15 bronze arrowheads
- Iron arrows (lvl 15)
- Steel arrows (lvl 30)
- Mithril arrows (lvl 45)
- Adamant arrows (lvl 60)
- Rune arrows (lvl 75)

**Bows (unstrung):**
| Bow | Level | Log | XP |
|-----|-------|-----|-----|
| Shortbow (u) | 5 | Normal | 5 |
| Longbow (u) | 10 | Normal | 10 |
| Oak shortbow (u) | 20 | Oak | 17 |
| Oak longbow (u) | 25 | Oak | 25 |
| Willow shortbow (u) | 35 | Willow | 33 |
| Willow longbow (u) | 40 | Willow | 42 |
| Maple shortbow (u) | 50 | Maple | 50 |
| Maple longbow (u) | 55 | Maple | 58 |
| Yew shortbow (u) | 65 | Yew | 68 |
| Yew longbow (u) | 70 | Yew | 75 |

**Strung Bows (unstrung bow + bowstring):**
- Same levels as unstrung, small XP bonus

### 3. New Items
- Arrow shafts
- Arrowheads (bronze through rune) - from smithing
- Bowstrings (from flax → spinning wheel, or shop)
- Unstrung bows
- Strung bows (equippable)
- Arrows (equippable as ammo)

### 4. Fletching Page
- `app/skills/fletching/page.tsx`
- Categories: Arrows, Shortbows, Longbows
- Show input requirements
- Batch crafting

### 5. Smithing Integration
Add arrowhead forging to smithing:
- Bronze arrowheads (lvl 5) - 1 bar → 15 arrowheads
- Iron arrowheads (lvl 20)
- Steel arrowheads (lvl 35)
- etc.

## Acceptance Criteria
- [ ] Can fletch arrow shafts from logs
- [ ] Can make arrows from components
- [ ] Can make bows from logs
- [ ] Can string bows
- [ ] Bows equippable as ranged weapon
- [ ] Arrows work as ammo (for ranged combat)
