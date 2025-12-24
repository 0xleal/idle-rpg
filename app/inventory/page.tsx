'use client';

import { useGameStore } from '@/store/gameStore';
import { getItem } from '@/data/resources';

export default function InventoryPage() {
  const inventory = useGameStore((state) => state.inventory);
  const items = Object.entries(inventory).filter(([, count]) => count > 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Inventory
      </h1>
      {items.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          Your inventory is empty. Start gathering to collect resources.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {items.map(([itemId, count]) => {
            const item = getItem(itemId);
            return (
              <div
                key={itemId}
                className="flex flex-col items-center rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-2xl">{item?.icon ?? '📦'}</span>
                <span className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {item?.name ?? itemId}
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {count.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
