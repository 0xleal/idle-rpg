# Task 019: Magic Combat

## Goal
Implement magic combat using spells and runes.

## Deliverables

### 1. Runes
Elemental runes:
- Air rune, Water rune, Earth rune, Fire rune

Catalytic runes:
- Mind rune, Chaos rune, Death rune, Blood rune

**Sources:**
- Runecrafting skill (future task) or
- Shop purchase or
- Monster drops

### 2. Spells

**Combat Spells:**
| Spell | Level | Runes | Max Hit |
|-------|-------|-------|---------|
| Wind Strike | 1 | 1 Air, 1 Mind | 2 |
| Water Strike | 5 | 1 Water, 1 Air, 1 Mind | 4 |
| Earth Strike | 9 | 1 Earth, 1 Air, 1 Mind | 6 |
| Fire Strike | 13 | 1 Fire, 1 Air, 1 Mind | 8 |
| Wind Bolt | 17 | 2 Air, 1 Chaos | 9 |
| Water Bolt | 23 | 2 Water, 2 Air, 1 Chaos | 10 |
| Earth Bolt | 29 | 2 Earth, 2 Air, 1 Chaos | 11 |
| Fire Bolt | 35 | 3 Fire, 3 Air, 1 Chaos | 12 |
| Wind Blast | 41 | 3 Air, 1 Death | 13 |
| Water Blast | 47 | 3 Water, 3 Air, 1 Death | 14 |
| Earth Blast | 53 | 3 Earth, 3 Air, 1 Death | 15 |
| Fire Blast | 59 | 4 Fire, 4 Air, 1 Death | 16 |
| Wind Wave | 62 | 5 Air, 1 Blood | 17 |
| Water Wave | 65 | 5 Water, 5 Air, 1 Blood | 18 |
| Earth Wave | 70 | 5 Earth, 5 Air, 1 Blood | 19 |
| Fire Wave | 75 | 5 Fire, 5 Air, 1 Blood | 20 |

### 3. Magic Equipment
**Weapons:**
- Staves (provide unlimited basic runes)
  - Staff of air (unlimited air runes)
  - Staff of water, earth, fire
- Elemental staves reduce rune cost

**Armor:**
- Wizard robes (magic bonus, low defence)

### 4. Combat System Updates

**Combat Style Selection:**
- Add "Magic" combat style option
- Available when staff equipped (or always?)

**Magic Attack Calculation:**
- Uses Magic level
- Uses magic bonus from equipment
- Spell determines max hit

**Rune Consumption:**
- Runes consumed per cast
- Staff can substitute one rune type
- Combat stops if out of runes

### 5. Spellbook UI
- Show available spells
- Rune requirements
- Autocast selection

### 6. XP Rewards
- Magic XP on successful cast
- Hitpoints XP as normal

## Acceptance Criteria
- [ ] Can cast combat spells
- [ ] Runes consumed per cast
- [ ] Staves provide unlimited basic runes
- [ ] Magic XP granted
- [ ] Spellbook UI for spell selection
- [ ] Combat stops when out of runes
