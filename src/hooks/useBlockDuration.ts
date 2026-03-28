import { useState, useCallback } from 'react';

const STORAGE_KEY = 'blockTimeClock.blockMinutes';
const DEFAULT_MINUTES = 90;

function readDuration(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_MINUTES;
    const val = parseInt(stored, 10);
    return val > 0 && val <= 1440 ? val : DEFAULT_MINUTES;
  } catch {
    return DEFAULT_MINUTES;
  }
}

export function useBlockDuration(): [number, (minutes: number) => void] {
  const [minutes, setMinutesState] = useState<number>(readDuration);

  const setMinutes = useCallback((val: number) => {
    const clamped = Math.max(1, Math.min(1440, Math.round(val)));
    setMinutesState(clamped);
    try { localStorage.setItem(STORAGE_KEY, String(clamped)); } catch {}
  }, []);

  return [minutes, setMinutes];
}
