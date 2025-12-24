# Task 020: Prayer Skill

## Goal
Implement the Prayer skill - bury bones to train, activate prayers for combat bonuses.

## Deliverables

### 1. Bones
| Bone | XP | Source |
|------|-----|--------|
| Bones | 5 | Chickens, goblins |
| Big bones | 15 | Giants |
| Dragon bones | 72 | Dragons |

### 2. Training
- Bury bones action (instant, consumes bone)
- XP granted per bone buried
- No page needed - can bury from inventory

### 3. Prayers

**Offensive Prayers:**
| Prayer | Level | Drain | Effect |
|--------|-------|-------|--------|
| Clarity of Thought | 7 | 1 | +5% Attack |
| Improved Reflexes | 16 | 2 | +10% Attack |
| Incredible Reflexes | 34 | 4 | +15% Attack |
| Burst of Strength | 4 | 1 | +5% Strength |
| Superhuman Strength | 13 | 2 | +10% Strength |
| Ultimate Strength | 31 | 4 | +15% Strength |
| Sharp Eye | 8 | 1 | +5% Ranged |
| Hawk Eye | 26 | 2 | +10% Ranged |
| Eagle Eye | 44 | 4 | +15% Ranged |
| Mystic Will | 9 | 1 | +5% Magic |
| Mystic Lore | 27 | 2 | +10% Magic |
| Mystic Might | 45 | 4 | +15% Magic |

**Defensive Prayers:**
| Prayer | Level | Drain | Effect |
|--------|-------|-------|--------|
| Thick Skin | 1 | 1 | +5% Defence |
| Rock Skin | 10 | 2 | +10% Defence |
| Steel Skin | 28 | 4 | +15% Defence |
| Protect from Melee | 43 | 6 | Block melee damage |
| Protect from Ranged | 40 | 6 | Block ranged damage |
| Protect from Magic | 37 | 6 | Block magic damage |

### 4. Prayer Points
- Max prayer points = Prayer level
- Drain rate per active prayer
- Restore with prayer potions or resting

### 5. Combat Integration
- Prayer panel in combat UI
- Toggle prayers on/off
- Show active prayers and drain rate
- Prayer points bar
- Auto-deactivate when points depleted

### 6. Prayer Page
- `app/skills/prayer/page.tsx`
- List of unlocked prayers
- Current prayer points
- Bury bones section (or in inventory)

### 7. Inventory Integration
- "Bury" action on bones in inventory
- Quick-bury option

## Acceptance Criteria
- [ ] Can bury bones for XP
- [ ] Prayers unlock at correct levels
- [ ] Can activate/deactivate prayers
- [ ] Prayer points drain over time
- [ ] Combat bonuses applied
- [ ] Protection prayers block damage type
