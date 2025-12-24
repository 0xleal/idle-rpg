# Task 006: Fishing Skill

## Goal
Add Fishing as the third gathering skill.

## Deliverables

### 1. Fishing Data
- `data/skills/fishing.ts`
- Fish spots: Shrimp (lvl 1), Sardine (lvl 5), Trout (lvl 20), Salmon (lvl 30), Lobster (lvl 40), Swordfish (lvl 50), Shark (lvl 76)
- Each: name, levelReq, xp, baseTime, fishProduced

### 2. Resource Definitions
- Add to `data/resources.ts`:
  - Raw fish: raw_shrimp, raw_sardine, raw_trout, raw_salmon, raw_lobster, raw_swordfish, raw_shark

### 3. Fishing Page
- `app/skills/fishing/page.tsx`
- Same structure as Woodcutting/Mining
- Fish icons and timing display

## Acceptance Criteria
- [ ] Can fish all fish types
- [ ] XP and leveling works
- [ ] Raw fish appear in inventory
- [ ] Proper level gating
