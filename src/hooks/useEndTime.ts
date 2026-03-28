import { useState, useCallback } from 'react';

const STORAGE_KEY = 'blockTimeClock.endMinute';
const DEFAULT_END = 1380; // 23:00

function readEnd(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_END;
    const val = parseInt(stored, 10);
    return val >= 0 && val < 1440 ? val : DEFAULT_END;
  } catch {
    return DEFAULT_END;
  }
}

export function useEndTime(): [number, (minute: number) => void] {
  const [endMinute, setEndState] = useState<number>(readEnd);

  const setEndMinute = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1439, Math.round(val)));
    setEndState(clamped);
    try { localStorage.setItem(STORAGE_KEY, String(clamped)); } catch {}
  }, []);

  return [endMinute, setEndMinute];
}
