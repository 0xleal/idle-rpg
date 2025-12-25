export interface ShopItem {
  itemId: string;
  buyPrice: number;
  stock: number | null; // null = infinite
}

export interface Shop {
  id: string;
  name: string;
  icon: string;
  items: ShopItem[];
}

export const SHOPS: Shop[] = [
  {
    id: 'general',
    name: 'General Store',
    icon: '🏪',
    items: [
      // Axes (Woodcutting tools)
      { itemId: 'bronze_axe', buyPrice: 50, stock: null },
      { itemId: 'iron_axe', buyPrice: 200, stock: null },
      { itemId: 'steel_axe', buyPrice: 500, stock: null },
      // Pickaxes (Mining tools)
      { itemId: 'bronze_pickaxe', buyPrice: 50, stock: null },
      { itemId: 'iron_pickaxe', buyPrice: 200, stock: null },
      { itemId: 'steel_pickaxe', buyPrice: 500, stock: null },
    ],
  },
  {
    id: 'fishing',
    name: 'Fishing Shop',
    icon: '🎣',
    items: [
      { itemId: 'fishing_rod', buyPrice: 20, stock: null },
      { itemId: 'fishing_bait', buyPrice: 5, stock: null },
      { itemId: 'feather', buyPrice: 6, stock: null },
    ],
  },
  {
    id: 'archery',
    name: 'Archery Shop',
    icon: '🏹',
    items: [
      { itemId: 'shortbow', buyPrice: 100, stock: null },
      { itemId: 'oak_shortbow', buyPrice: 200, stock: null },
      { itemId: 'bronze_arrow', buyPrice: 5, stock: null },
      { itemId: 'iron_arrow', buyPrice: 10, stock: null },
      { itemId: 'steel_arrow', buyPrice: 20, stock: null },
      { itemId: 'bowstring', buyPrice: 50, stock: null },
    ],
  },
  {
    id: 'magic',
    name: 'Magic Shop',
    icon: '🔮',
    items: [
      // Runes
      { itemId: 'air_rune', buyPrice: 5, stock: null },
      { itemId: 'water_rune', buyPrice: 5, stock: null },
      { itemId: 'earth_rune', buyPrice: 5, stock: null },
      { itemId: 'fire_rune', buyPrice: 5, stock: null },
      { itemId: 'mind_rune', buyPrice: 10, stock: null },
      { itemId: 'chaos_rune', buyPrice: 50, stock: null },
      { itemId: 'death_rune', buyPrice: 100, stock: null },
      { itemId: 'blood_rune', buyPrice: 200, stock: null },
      // Staves
      { itemId: 'staff_of_air', buyPrice: 1000, stock: null },
      { itemId: 'staff_of_water', buyPrice: 1000, stock: null },
      { itemId: 'staff_of_earth', buyPrice: 1000, stock: null },
      { itemId: 'staff_of_fire', buyPrice: 1000, stock: null },
    ],
  },
  {
    id: 'armor',
    name: 'Armor Shop',
    icon: '🛡️',
    items: [
      { itemId: 'bronze_helmet', buyPrice: 50, stock: null },
      { itemId: 'bronze_platebody', buyPrice: 150, stock: null },
      { itemId: 'iron_helmet', buyPrice: 100, stock: null },
      { itemId: 'iron_platebody', buyPrice: 300, stock: null },
      { itemId: 'leather_body', buyPrice: 50, stock: null },
      { itemId: 'leather_chaps', buyPrice: 40, stock: null },
    ],
  },
  {
    id: 'herblore',
    name: 'Herblore Shop',
    icon: '⚗️',
    items: [
      { itemId: 'vial', buyPrice: 5, stock: null },
      { itemId: 'vial_of_water', buyPrice: 10, stock: null },
      { itemId: 'eye_of_newt', buyPrice: 25, stock: null },
    ],
  },
  {
    id: 'crafting',
    name: 'Crafting Shop',
    icon: '🧵',
    items: [
      { itemId: 'flax', buyPrice: 10, stock: null },
      { itemId: 'leather', buyPrice: 25, stock: null },
      { itemId: 'leather_gloves', buyPrice: 40, stock: null },
      { itemId: 'leather_boots', buyPrice: 45, stock: null },
      { itemId: 'leather_cowl', buyPrice: 50, stock: null },
    ],
  },
  {
    id: 'farming',
    name: 'Farming Shop',
    icon: '🌱',
    items: [
      { itemId: 'potato_seed', buyPrice: 5, stock: null },
      { itemId: 'onion_seed', buyPrice: 10, stock: null },
      { itemId: 'cabbage_seed', buyPrice: 15, stock: null },
      { itemId: 'tomato_seed', buyPrice: 25, stock: null },
      { itemId: 'sweetcorn_seed', buyPrice: 50, stock: null },
      { itemId: 'guam_seed', buyPrice: 20, stock: null },
      { itemId: 'marrentill_seed', buyPrice: 40, stock: null },
      { itemId: 'tarromin_seed', buyPrice: 60, stock: null },
      { itemId: 'harralander_seed', buyPrice: 100, stock: null },
      { itemId: 'ranarr_seed', buyPrice: 400, stock: null },
    ],
  },
];

export function getShop(id: string): Shop | undefined {
  return SHOPS.find((s) => s.id === id);
}
