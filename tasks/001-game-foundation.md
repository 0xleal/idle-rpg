# Task 001: Game Foundation

## Goal
Set up the core game architecture: state management, game loop, and basic UI shell.

## Deliverables

### 1. Zustand Store Structure
- `src/store/gameStore.ts` - Main game state
- Player state: skills, inventory, currentAction, lastSaveTime
- Actions: startAction, stopAction, tick, save, load

### 2. Game Tick System
- `src/hooks/useGameLoop.ts` - requestAnimationFrame loop
- Tick rate: ~10 ticks/second (100ms intervals)
- Handles action progress, completion, auto-repeat

### 3. UI Shell
- Sidebar navigation (Skills, Inventory, Combat - placeholder)
- Main content area
- Top bar with basic stats (total level, gold placeholder)

### 4. Type Definitions
- `src/types/game.ts` - Core types
- Skill, Resource, Item, PlayerState, Action

## Acceptance Criteria
- [ ] Store initializes with default player state
- [ ] Game loop runs continuously when action selected
- [ ] Basic navigation between placeholder pages works
- [ ] TypeScript compiles without errors
