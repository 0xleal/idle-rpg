'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

const TICK_INTERVAL = 100; // ms - tick ~10 times per second

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);
  const lastTickTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const initializedRef = useRef(false);

  // Process accumulated time
  const processTick = useCallback(() => {
    const now = Date.now();

    // Initialize on first tick
    if (!initializedRef.current) {
      initializedRef.current = true;
      lastTickTimeRef.current = now;
      return;
    }

    const delta = now - lastTickTimeRef.current;
    lastTickTimeRef.current = now;

    if (delta > 0) {
      tick(delta);
    }
  }, [tick]);

  useEffect(() => {
    // Main game loop using requestAnimationFrame
    // We throttle actual ticks to TICK_INTERVAL for performance
    const loop = (timestamp: number) => {
      // Throttle: only tick if enough time has passed
      if (timestamp - lastFrameTimeRef.current >= TICK_INTERVAL) {
        lastFrameTimeRef.current = timestamp;
        processTick();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    // Start the loop
    animationFrameRef.current = requestAnimationFrame(loop);

    // Handle tab visibility change - process time spent away
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible - catch up on time passed
        processTick();
        // Reset frame time so next loop iteration works correctly
        lastFrameTimeRef.current = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [processTick]);
}
