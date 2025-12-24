# Task 003: Inventory System

## Goal
Basic inventory to store gathered resources.

## Deliverables

### 1. Resource Definitions
- `src/data/resources.ts`
- Logs: normal_log, oak_log, willow_log, maple_log, yew_log
- Each: id, name, icon (emoji for MVP), stackable: true

### 2. Inventory State
- Add to gameStore: `inventory: Record<string, number>`
- Actions: addItem, removeItem, hasItem, getItemCount

### 3. Inventory Page
- `src/app/inventory/page.tsx`
- Grid display of items with quantities
- Simple, no drag-drop needed for MVP

### 4. Integration
- Woodcutting grants logs to inventory on action complete

## Acceptance Criteria
- [ ] Logs appear in inventory after chopping
- [ ] Quantities stack correctly
- [ ] Inventory page displays all items
