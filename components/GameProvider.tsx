'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { loadGame, saveGame } from '@/lib/save';
import { calculateOfflineProgress, hasSignificantGains, OfflineGains, MAX_OFFLINE_TIME } from '@/lib/offline';
import { WelcomeBackModal } from '@/components/WelcomeBackModal';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [offlineGains, setOfflineGains] = useState<OfflineGains | null>(null);
  const loadFromSave = useGameStore((state) => state.loadFromSave);
  const getPlayerState = useGameStore((state) => state.getPlayerState);
  const tick = useGameStore((state) => state.tick);

  // Save game function
  const save = useCallback(() => {
    const state = getPlayerState();
    saveGame(state);
  }, [getPlayerState]);

  // Initialize game on mount
  useEffect(() => {
    const savedData = loadGame();

    if (savedData) {
      // Calculate time elapsed since last save
      const now = Date.now();
      const elapsedMs = now - savedData.lastSaveTime;

      // Calculate offline progress before loading (for display)
      const gains = calculateOfflineProgress(elapsedMs, savedData.currentAction);

      // Load the save data
      loadFromSave(savedData);

      // Apply offline progress by ticking with elapsed time (capped)
      if (elapsedMs > 0 && savedData.currentAction) {
        const cappedTime = Math.min(elapsedMs, MAX_OFFLINE_TIME);
        tick(cappedTime);
      }

      // Show welcome back modal if significant gains (deferred to avoid cascading renders)
      if (hasSignificantGains(gains)) {
        queueMicrotask(() => setOfflineGains(gains));
      }
    }

    // Defer to avoid cascading render warning
    queueMicrotask(() => setIsLoaded(true));
  }, [loadFromSave, tick]);

  // Auto-save interval
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      save();
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [isLoaded, save]);

  // Save on page unload
  useEffect(() => {
    if (!isLoaded) return;

    const handleBeforeUnload = () => {
      save();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoaded, save]);

  // Start game loop (only after loaded)
  useGameLoop();

  // Handle closing welcome back modal
  const handleCloseModal = () => {
    setOfflineGains(null);
  };

  // Show loading state briefly to avoid hydration issues
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-zinc-500 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {children}
      {offlineGains && (
        <WelcomeBackModal gains={offlineGains} onClose={handleCloseModal} />
      )}
    </>
  );
}
