import { useState, useCallback } from 'react';

const STORAGE_KEY = 'blockTimeClock.sleepHours';
const DEFAULT_HOURS = 7;

function readHours(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_HOURS;
    const val = parseFloat(stored);
    return val >= 0 && val <= 16 ? val : DEFAULT_HOURS;
  } catch {
    return DEFAULT_HOURS;
  }
}

export function useSleepDuration(): [number, (hours: number) => void] {
  const [hours, setHoursState] = useState<number>(readHours);

  const setHours = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(16, val));
    setHoursState(clamped);
    try { localStorage.setItem(STORAGE_KEY, String(clamped)); } catch {}
  }, []);

  return [hours, setHours];
}
