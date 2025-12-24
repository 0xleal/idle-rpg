# MVP Scope

## What We're Building
A minimal playable idle RPG with one skill to prove out the core loop.

## Tasks (In Order)
1. **[001-game-foundation](./001-game-foundation.md)** - Store, game loop, UI shell
2. **[002-woodcutting-skill](./002-woodcutting-skill.md)** - First skill implementation
3. **[003-inventory-system](./003-inventory-system.md)** - Resource storage
4. **[004-persistence](./004-persistence.md)** - Save/load, offline progress

## Out of Scope for MVP
- Combat system
- Other skills (Mining, Fishing, etc.)
- Equipment/gear
- Crafting (Smithing, Cooking, etc.)
- Dungeons
- Mastery system
- Pets/achievements
- Sound/music
- Mobile optimization

## Tech Decisions
- **State**: Zustand (already in deps)
- **Styling**: Tailwind v4 utility classes
- **Icons**: Emoji for MVP (Lucide icons later)
- **No external UI library** - raw Tailwind components

## Success Criteria
Player can:
1. Open game
2. Click on Woodcutting
3. Select a tree to chop
4. Watch progress bar, see XP gain
5. Level up, unlock new trees
6. See logs in inventory
7. Close browser, return later, see offline gains

## Post-MVP Roadmap
- Add Mining + Smithing (resource → crafting chain)
- Basic combat with one monster area
- Equipment slots + craftable gear
- Additional skills following established patterns
