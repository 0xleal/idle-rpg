# Task 010: Combat System

## Goal
Core combat loop - fight monsters to gain combat XP and loot.

## Deliverables

### 1. Combat Types
- `types/combat.ts`

```ts
interface Monster {
  id: string;
  name: string;
  hitpoints: number;
  maxHit: number;
  attackSpeed: number; // ms between attacks
  attackBonus: number;
  defenceBonus: number;
  xpReward: { attack: number; strength: number; defence: number; hitpoints: number };
  drops: { itemId: string; chance: number; quantity: [number, number] }[];
}

interface CombatState {
  monsterId: string | null;
  monsterHp: number;
  playerHp: number;
  inCombat: boolean;
}
```

### 2. Combat Store
- Add to gameStore or create combatStore
- Track current monster, HP values
- Combat tick handling (separate from skilling tick?)

### 3. Monster Data
- `data/monsters.ts`
- Combat areas with monster lists:
  - Chickens (lvl 1) - tutorial area
  - Goblins (lvl 5-10)
  - Cows (lvl 10-15)
  - Zombies (lvl 20-30)
  - Giants (lvl 40-50)
  - Dragons (lvl 60+)

### 4. Combat Calculations
- `lib/combat.ts`
- Hit chance based on attack vs defence
- Max hit based on strength + weapon
- Damage roll between 0 and max hit

### 5. Combat Page
- `app/combat/page.tsx`
- Select area → Select monster
- Show player HP bar, monster HP bar
- Attack speed indicators
- Loot log/drops

### 6. Combat Skills
- Grant XP on successful hits:
  - Attack XP: based on damage dealt
  - Strength XP: based on damage dealt
  - Defence XP: based on damage received (optional)
  - Hitpoints XP: always (1/3 of other combat XP)

### 7. Death & Respawn
- If player HP reaches 0: flee combat, restore HP
- Option to eat food to heal during combat

## Acceptance Criteria
- [ ] Can start combat with a monster
- [ ] Both player and monster deal damage over time
- [ ] Combat XP granted for attack/strength/hitpoints
- [ ] Monster drops loot on death
- [ ] Player can flee or dies and respawns
- [ ] Equipment stats affect combat
