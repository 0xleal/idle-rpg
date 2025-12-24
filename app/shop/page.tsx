'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { SHOPS } from '@/data/shops';
import { getItem } from '@/data/resources';

export default function ShopPage() {
  const [selectedShopId, setSelectedShopId] = useState<string>('general');
  const [buyQuantity, setBuyQuantity] = useState<Record<string, number>>({});

  const gold = useGameStore((state) => state.gold);
  const inventory = useGameStore((state) => state.inventory);
  const buyItem = useGameStore((state) => state.buyItem);
  const sellItem = useGameStore((state) => state.sellItem);

  const selectedShop = SHOPS.find((s) => s.id === selectedShopId);

  // Get sellable items from inventory
  const sellableItems = Object.entries(inventory)
    .filter(([itemId, qty]) => {
      if (qty <= 0) return false;
      const item = getItem(itemId);
      return item?.sellPrice;
    })
    .map(([itemId, qty]) => ({
      itemId,
      quantity: qty,
      item: getItem(itemId)!,
    }));

  const handleBuy = (itemId: string, price: number) => {
    const qty = buyQuantity[itemId] || 1;
    buyItem(itemId, price, qty);
  };

  const handleSell = (itemId: string, quantity: number) => {
    sellItem(itemId, quantity);
  };

  const handleSellAll = (itemId: string) => {
    const qty = inventory[itemId] || 0;
    if (qty > 0) {
      sellItem(itemId, qty);
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="skill-icon"
              style={{ background: 'rgba(234, 179, 8, 0.15)' }}
            >
              <span className="animate-float">🏪</span>
            </div>
            <div>
              <h1 className="font-[var(--font-cinzel)] text-3xl font-bold text-gradient">
                Shop
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Buy supplies and sell your loot
              </p>
            </div>
          </div>
          <div className="gold-display">
            <span className="text-xl">💰</span>
            <span className="text-lg font-bold text-[var(--accent-gold)]">
              {gold.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Shop Tabs */}
      <div className="tab-group mb-6 w-fit">
        {SHOPS.map((shop) => (
          <button
            key={shop.id}
            onClick={() => setSelectedShopId(shop.id)}
            className={`tab ${selectedShopId === shop.id ? 'tab-active' : ''}`}
          >
            <span>{shop.icon}</span>
            <span>{shop.name}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Buy Section */}
        <div className="card p-5">
          <div className="section-header mb-4">
            <span className="section-title">Buy from {selectedShop?.name}</span>
            <span className="section-line" />
          </div>
          {selectedShop && selectedShop.items.length > 0 ? (
            <div className="space-y-2">
              {selectedShop.items.map((shopItem, index) => {
                const item = getItem(shopItem.itemId);
                if (!item) return null;
                const qty = buyQuantity[shopItem.itemId] || 1;
                const totalCost = shopItem.buyPrice * qty;
                const canAfford = gold >= totalCost;

                return (
                  <div
                    key={shopItem.itemId}
                    className="shop-item opacity-0 animate-fade-in"
                    style={{
                      animationDelay: `${index * 0.03}s`,
                      animationFillMode: 'forwards',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">
                          {item.name}
                        </div>
                        <div className="text-sm text-[var(--accent-gold)]">
                          {shopItem.buyPrice} gold
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={qty}
                        onChange={(e) =>
                          setBuyQuantity({
                            ...buyQuantity,
                            [shopItem.itemId]: parseInt(e.target.value),
                          })
                        }
                        className="select-input w-16"
                      >
                        {[1, 5, 10, 50, 100].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleBuy(shopItem.itemId, shopItem.buyPrice)}
                        disabled={!canAfford}
                        className="btn-buy"
                      >
                        Buy ({totalCost}g)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-3xl mb-3 block">🏚️</span>
              <p className="text-sm text-[var(--text-muted)]">
                No items available in this shop.
              </p>
            </div>
          )}
        </div>

        {/* Sell Section */}
        <div className="card p-5">
          <div className="section-header mb-4">
            <span className="section-title">Sell Items</span>
            <span className="section-line" />
          </div>
          {sellableItems.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {sellableItems.map(({ itemId, quantity, item }, index) => (
                <div
                  key={itemId}
                  className="shop-item opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.03}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[var(--text-muted)]">
                          x{quantity}
                        </span>
                        <span className="text-[var(--text-muted)]">•</span>
                        <span className="text-[var(--accent-gold)]">
                          {item.sellPrice}g each
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSell(itemId, 1)}
                      className="btn-sell"
                    >
                      Sell 1
                    </button>
                    <button
                      onClick={() => handleSellAll(itemId)}
                      className="btn-sell-all"
                    >
                      Sell All
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-3xl mb-3 block">📦</span>
              <p className="text-sm text-[var(--text-muted)]">
                No sellable items in your inventory.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
