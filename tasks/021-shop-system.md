# Task 021: Shop System

## Goal
Implement a shop where players can buy and sell items using gold.

## Deliverables

### 1. Gold Currency
- Add `gold` to player state (or use inventory item)
- Display gold in header/UI
- Items already have `sellPrice` defined

### 2. Shop Data
- `data/shops.ts`

```ts
interface ShopItem {
  itemId: string;
  stock: number | 'infinite';
  buyPrice: number;
}

interface Shop {
  id: string;
  name: string;
  icon: string;
  items: ShopItem[];
}
```

### 3. Shops

**General Store:**
- Buys any item at sellPrice
- Sells basic supplies

**Fishing Shop:**
- Fishing rods, bait, feathers

**Archery Shop:**
- Bows, arrows, bowstrings

**Magic Shop:**
- Runes, staves, wizard robes

**Armor Shop:**
- Basic armor sets

**Herblore Shop:**
- Vials, secondary ingredients

### 4. Shop Mechanics
- Buy items for gold
- Sell items for gold (sellPrice)
- Stock limits (optional)
- Stock refresh (optional)

### 5. Shop Page
- `app/shop/page.tsx`
- Shop selection
- Buy/sell interface
- Show gold balance
- Quantity selector

### 6. Inventory Integration
- "Sell" action on items
- Sell all of type
- Sell X quantity

### 7. UI Updates
- Gold display in header
- Gold earned notifications

## Acceptance Criteria
- [ ] Gold tracked as currency
- [ ] Can buy items from shops
- [ ] Can sell items for gold
- [ ] Multiple themed shops
- [ ] Gold displayed in UI
- [ ] Correct buy/sell prices
