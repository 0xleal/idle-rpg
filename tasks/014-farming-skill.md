# Task 014: Farming Skill

## Goal
Implement the Farming skill - grow crops over time for food and herblore ingredients.

## Unique Mechanics
Farming is different from other gathering skills:
- Plant seeds in patches
- Crops grow over real time (minutes/hours)
- Harvest when fully grown
- Risk of disease (optional)

## Deliverables

### 1. Farming Data
- `data/skills/farming.ts`

```ts
interface FarmPatch {
  id: string;
  name: string;
  type: 'allotment' | 'herb' | 'tree';
  unlockLevel: number;
}

interface Seed {
  id: string;
  name: string;
  levelRequired: number;
  growthTime: number; // ms
  xpPlant: number;
  xpHarvest: number;
  harvestItem: string;
  harvestQuantity: [number, number]; // min, max
}
```

### 2. Crops & Seeds
**Allotment (food):**
- Potato (lvl 1) - 5 min grow
- Onion (lvl 5) - 10 min
- Cabbage (lvl 7) - 10 min
- Tomato (lvl 12) - 15 min
- Sweetcorn (lvl 20) - 20 min
- Strawberry (lvl 31) - 25 min
- Watermelon (lvl 47) - 40 min

**Herbs (for Herblore):**
- Guam (lvl 9) - 20 min
- Marrentill (lvl 14) - 20 min
- Tarromin (lvl 19) - 20 min
- Harralander (lvl 26) - 20 min
- Ranarr (lvl 32) - 40 min
- Toadflax (lvl 38) - 40 min
- Irit (lvl 44) - 40 min
- Avantoe (lvl 50) - 40 min
- Kwuarm (lvl 56) - 40 min
- Snapdragon (lvl 62) - 80 min
- Cadantine (lvl 67) - 80 min
- Lantadyme (lvl 73) - 80 min
- Dwarf weed (lvl 79) - 80 min
- Torstol (lvl 85) - 80 min

### 3. Farming State
Add to player state:
```ts
farmPatches: {
  [patchId: string]: {
    seedId: string | null;
    plantedAt: number | null;
    stage: 'empty' | 'growing' | 'ready';
  }
}
```

### 4. Farming Page
- `/app/skills/farming/page.tsx`
- Show available patches (unlock more with level)
- Plant seeds from inventory
- Growth progress indicator
- Harvest button when ready
- Compost option (increases yield)

### 5. Items
- Seeds (plantable)
- Harvested crops (food ingredients or herbs)
- Compost (optional, increases yield)

## Acceptance Criteria
- [ ] Can plant seeds in patches
- [ ] Crops grow over real time
- [ ] Can harvest when ready
- [ ] XP granted on plant and harvest
- [ ] Growth continues offline
- [ ] Multiple patch types available
