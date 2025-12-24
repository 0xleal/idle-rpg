# Task 008: Cooking Skill

## Goal
Second artisan skill - cook raw fish into food for combat healing.

## Deliverables

### 1. Cooking Data
- `data/skills/cooking.ts`

| Food | Level | Raw Input | XP | Heals |
|------|-------|-----------|-----|-------|
| Shrimp | 1 | raw_shrimp | 30 | 3 |
| Sardine | 5 | raw_sardine | 40 | 4 |
| Trout | 15 | raw_trout | 70 | 7 |
| Salmon | 25 | raw_salmon | 90 | 9 |
| Lobster | 40 | raw_lobster | 120 | 12 |
| Swordfish | 45 | raw_swordfish | 140 | 14 |
| Shark | 80 | raw_shark | 210 | 20 |

### 2. Resource Definitions
- Add cooked fish: cooked_shrimp, cooked_sardine, etc.
- Each needs `healsFor` property for combat

### 3. Item Type Extension
- Add `healsFor?: number` to ItemDefinition
- Food items are consumable in combat

### 4. Cooking Page
- `app/skills/cooking/page.tsx`
- Similar to Smithing but simpler (1:1 recipes)
- Show heal amount on cooked food

## Acceptance Criteria
- [ ] Can cook all raw fish
- [ ] Raw fish consumed, cooked fish produced
- [ ] XP granted correctly
- [ ] Cooked food shows heal value
- [ ] Burn chance? (optional stretch goal)
