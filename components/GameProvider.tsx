'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { loadGame, saveGame } from '@/lib/save';
import { simulateOfflineProgress, hasSignificantGains, OfflineGains } from '@/lib/offline';
import { WelcomeBackModal } from '@/components/WelcomeBackModal';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [offlineGains, setOfflineGains] = useState<OfflineGains | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const loadFromSave = useGameStore((state) => state.loadFromSave);
  const getPlayerState = useGameStore((state) => state.getPlayerState);
  const applyOfflineGains = useGameStore((state) => state.applyOfflineGains);

  // Save game function
  const save = useCallback(() => {
    const state = getPlayerState();
    saveGame(state);
  }, [getPlayerState]);

  // Initialize game on mount
  useEffect(() => {
    const loadResult = loadGame();

    if (loadResult.error) {
      console.error('Failed to load save:', loadResult.error);
    }

    // Show warning for checksum failure OR if data was sanitized
    if (loadResult.checksumFailed) {
      setValidationWarning('Save data may have been modified externally. Some values were adjusted.');
    } else if (loadResult.validation?.wasModified) {
      setValidationWarning('Some save data was invalid and has been corrected.');
    }

    if (loadResult.data) {
      const savedData = loadResult.data;
      const savedAction = savedData.currentAction;

      // Calculate time elapsed since last save
      const now = Date.now();
      const elapsedMs = now - savedData.lastSaveTime;

      // IMPORTANT: Load save with action temporarily cleared to prevent race condition
      // The game loop tick() might run before we apply offline gains, which would
      // cause duplicate processing. By clearing the action first, tick() becomes a no-op.
      loadFromSave({ ...savedData, currentAction: null });

      // Simulate offline progress with proper material consumption
      if (elapsedMs > 0 && savedAction) {
        const gains = simulateOfflineProgress(
          elapsedMs,
          savedAction,
          savedData.inventory
        );

        // Apply the offline gains (this will set the correct action state)
        // Pass the original action so it can be restored with updated elapsed time
        applyOfflineGains(gains, savedAction);

        // Show welcome back modal if significant gains
        if (hasSignificantGains(gains)) {
          // Deep copy gains to prevent any potential mutation issues
          const gainsCopy: OfflineGains = {
            ...gains,
            skillXp: { ...gains.skillXp },
            itemsGained: { ...gains.itemsGained },
            itemsConsumed: { ...gains.itemsConsumed },
          };
          queueMicrotask(() => setOfflineGains(gainsCopy));
        }
      }
    }

    // Defer to avoid cascading render warning
    queueMicrotask(() => setIsLoaded(true));
  }, [loadFromSave, applyOfflineGains]);

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

  // Handle dismissing validation warning
  const handleDismissWarning = () => {
    setValidationWarning(null);
  };

  // Show loading state briefly to avoid hydration issues
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {children}
      {validationWarning && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="card p-4 border-[#f59e0b]/30 bg-[#f59e0b]/10">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-sm text-[var(--text-primary)] font-medium">Save Validation</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{validationWarning}</p>
              </div>
              <button
                onClick={handleDismissWarning}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      {offlineGains && (
        <WelcomeBackModal gains={offlineGains} onClose={handleCloseModal} />
      )}
    </>
  );
}
