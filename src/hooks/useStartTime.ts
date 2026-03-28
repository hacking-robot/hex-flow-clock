import { useState, useCallback } from 'react';

const STORAGE_KEY = 'blockTimeClock.startMinute';
const DEFAULT_START = 420; // 7:00

function readStart(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_START;
    const val = parseInt(stored, 10);
    return val >= 0 && val < 1440 ? val : DEFAULT_START;
  } catch {
    return DEFAULT_START;
  }
}

export function useStartTime(): [number, (minute: number) => void] {
  const [startMinute, setStartState] = useState<number>(readStart);

  const setStartMinute = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1439, Math.round(val)));
    setStartState(clamped);
    try { localStorage.setItem(STORAGE_KEY, String(clamped)); } catch {}
  }, []);

  return [startMinute, setStartMinute];
}
