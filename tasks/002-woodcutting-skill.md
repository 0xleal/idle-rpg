# Task 002: Woodcutting Skill

## Goal
Implement the first gathering skill as the template for all future skills.

## Deliverables

### 1. Skill Data
- `src/data/skills/woodcutting.ts`
- Trees: Normal (lvl 1), Oak (lvl 15), Willow (lvl 30), Maple (lvl 45), Yew (lvl 60)
- Each tree: name, levelReq, xp, baseTime (ms), resourceId

### 2. XP & Leveling System
- `src/lib/experience.ts`
- XP curve: level 99 = 13,034,431 XP (RuneScape-style curve)
- `xpForLevel(level)` and `levelForXp(xp)` functions

### 3. Woodcutting Page
- `src/app/skills/woodcutting/page.tsx`
- List of trees (locked/unlocked based on level)
- Click to start chopping
- Progress bar showing action completion
- Current XP / XP to next level display

### 4. Action Processing
- When action completes: grant XP, add log to inventory, repeat
- Stop if inventory full (later task) or manually stopped

## Acceptance Criteria
- [ ] Can select a tree and see progress bar filling
- [ ] XP grants on completion, level ups work
- [ ] Higher level trees locked until level requirement met
- [ ] Action auto-repeats after completion
