# Task 004: Persistence & Offline Progress

## Goal
Save game state and calculate progress while away.

## Deliverables

### 1. Save System
- `src/lib/save.ts`
- Save to localStorage on: action complete, every 30 seconds, page unload
- Load on app init

### 2. Offline Progress Calculation
- `src/lib/offline.ts`
- On load: calculate time since lastSaveTime
- If action was in progress: simulate completions
- Cap offline time (e.g., 24 hours max)
- Show "Welcome back" modal with gains summary

### 3. Save Data Structure
```ts
interface SaveData {
  version: number;
  lastSaveTime: number;
  skills: Record<SkillId, { xp: number }>;
  inventory: Record<string, number>;
  currentAction: Action | null;
}
```

## Acceptance Criteria
- [ ] Close browser, reopen - progress restored
- [ ] Leave for 5 min, return - offline gains calculated
- [ ] Modal shows what was gained while away
- [ ] Corrupted save handled gracefully (reset to default)
