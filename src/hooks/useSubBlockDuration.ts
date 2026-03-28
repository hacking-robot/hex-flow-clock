import { useState, useCallback } from 'react';

const STORAGE_KEY = 'blockTimeClock.subBlockMinutes';
const DEFAULT = 15;

function read(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT;
    const val = parseInt(stored, 10);
    return val > 0 && val <= 1440 ? val : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function useSubBlockDuration(): [number, (m: number) => void] {
  const [minutes, set] = useState<number>(read);

  const setMinutes = useCallback((val: number) => {
    const clamped = Math.max(1, Math.min(1440, Math.round(val)));
    set(clamped);
    try { localStorage.setItem(STORAGE_KEY, String(clamped)); } catch {}
  }, []);

  return [minutes, setMinutes];
}
