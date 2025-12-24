# Idle RPG

A browser-based idle RPG inspired by Melvor Idle. Train skills, acquire gear, defeat monsters, and conquer dungeons to achieve 100% completion.

## Core Concept

Players progress through various skills and combat encounters while the game runs in the background. The core loop involves:
1. **Gathering** - Collect resources through skilling
2. **Crafting** - Transform resources into useful items and gear
3. **Combat** - Fight monsters to gain experience and loot
4. **Progression** - Level up skills, unlock new content, complete dungeons

## Skills

### Gathering Skills
| Skill | Description | Produces |
|-------|-------------|----------|
| Woodcutting | Chop trees for logs | Logs (various types) |
| Mining | Extract ores from rocks | Ores, gems |
| Fishing | Catch fish from water | Raw fish |
| Farming | Grow crops over time | Herbs, vegetables, seeds |

### Artisan Skills
| Skill | Description | Creates |
|-------|-------------|---------|
| Smithing | Smelt ores, forge weapons/armor | Metal bars, equipment |
| Cooking | Prepare food for combat healing | Cooked food |
| Fletching | Craft bows and arrows | Ranged weapons, ammo |
| Crafting | Create jewelry and leather gear | Accessories, light armor |
| Herblore | Brew potions from herbs | Combat potions |

### Combat Skills
| Skill | Description |
|-------|-------------|
| Attack | Melee accuracy |
| Strength | Melee damage |
| Defence | Damage reduction |
| Hitpoints | Total health pool |
| Ranged | Ranged accuracy and damage |
| Magic | Magic accuracy and damage |
| Prayer | Unlocks combat prayers/buffs |

## Combat System

- **Auto-combat**: Player and monster take turns attacking based on attack speed
- **Combat Triangle**: Melee > Ranged > Magic > Melee
- **Equipment Slots**: Head, Body, Legs, Boots, Gloves, Cape, Amulet, Ring, Weapon, Shield/Off-hand
- **Food**: Consumed automatically when HP drops below threshold
- **Prayers**: Toggle-able buffs that drain prayer points

## Progression

### Experience & Levels
- Skills cap at level 99 (13,034,431 XP)
- Mastery system for individual items within skills
- Combat level calculated from combat skill levels

### Unlocks
- Higher skill levels unlock new resources, recipes, and monsters
- Quest-like milestones gate major content

## Dungeons

Dungeons are multi-stage encounters requiring preparation and strategy:

1. **Forest Depths** - Entry dungeon, teaches mechanics
2. **Abandoned Mine** - Mid-tier, requires solid gear
3. **Dragon's Lair** - High-tier, needs potions and prayers
4. **The Void** - Endgame, requires near-max stats
5. **Final Trial** - 100% completion dungeon

Each dungeon consists of multiple monster waves culminating in a boss fight. Rewards include unique gear and completion percentage.

## Completion

100% completion requires:
- [ ] All skills to level 99
- [ ] All dungeons cleared
- [ ] All equipment obtained
- [ ] All pets collected
- [ ] All achievements unlocked

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Persistence**: Local storage with offline progress calculation

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

## License

MIT
