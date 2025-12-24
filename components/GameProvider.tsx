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

    if (loadResult.checksumFailed) {
      setValidationWarning('Save data may have been modified externally. Some values were adjusted.');
    }

    if (loadResult.data) {
      const savedData = loadResult.data;

      // Load the validated/sanitized save data
      loadFromSave(savedData);

      // Calculate time elapsed since last save
      const now = Date.now();
      const elapsedMs = now - savedData.lastSaveTime;

      // Simulate offline progress with proper material consumption
      if (elapsedMs > 0 && savedData.currentAction) {
        const gains = simulateOfflineProgress(
          elapsedMs,
          savedData.currentAction,
          savedData.inventory
        );

        // Apply the offline gains
        applyOfflineGains(gains);

        // Show welcome back modal if significant gains
        if (hasSignificantGains(gains)) {
          queueMicrotask(() => setOfflineGains(gains));
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
