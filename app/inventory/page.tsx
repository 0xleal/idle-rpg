'use client';

import { useGameStore } from '@/store/gameStore';
import { getItem } from '@/data/resources';

export default function InventoryPage() {
  const inventory = useGameStore((state) => state.inventory);
  const items = Object.entries(inventory).filter(([, count]) => count > 0);

  const totalItems = items.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="skill-icon"
            style={{ background: 'rgba(139, 92, 246, 0.15)' }}
          >
            <span className="animate-float">🎒</span>
          </div>
          <div>
            <h1 className="font-[var(--font-cinzel)] text-3xl font-bold text-gradient">
              Inventory
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[var(--text-secondary)]">
                {items.length} unique items
              </span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[var(--text-muted)]">
                {totalItems.toLocaleString()} total
              </span>
            </div>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card p-8 text-center">
          <span className="text-4xl mb-4 block">📦</span>
          <p className="text-[var(--text-secondary)]">
            Your inventory is empty.
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Start gathering resources to fill it up!
          </p>
        </div>
      ) : (
        <>
          <div className="section-header">
            <span className="section-title">Items</span>
            <span className="section-line" />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {items.map(([itemId, count], index) => {
              const item = getItem(itemId);
              return (
                <div
                  key={itemId}
                  className="inventory-slot opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.02}s`,
                    animationFillMode: 'forwards',
                  }}
                  title={item?.name || itemId}
                >
                  <span className="text-2xl">{item?.icon ?? '📦'}</span>
                  <span className="text-[0.65rem] text-[var(--text-muted)] text-center leading-tight line-clamp-1">
                    {item?.name ?? itemId}
                  </span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
