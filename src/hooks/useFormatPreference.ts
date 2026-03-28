import { useState, useCallback } from 'react';
import type { TimeFormat } from '../lib/timeFormatter';

const STORAGE_KEY = 'blockTimeClock.format';
const DEFAULT_FORMAT: TimeFormat = '12h';

function isValidFormat(value: unknown): value is TimeFormat {
  return value === '12h' || value === '24h';
}

function readFormat(): TimeFormat {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isValidFormat(stored) ? stored : DEFAULT_FORMAT;
  } catch {
    return DEFAULT_FORMAT;
  }
}

export function useFormatPreference(): [TimeFormat, (format: TimeFormat) => void] {
  const [format, setFormatState] = useState<TimeFormat>(readFormat);

  const setFormat = useCallback((newFormat: TimeFormat) => {
    setFormatState(newFormat);
    try {
      localStorage.setItem(STORAGE_KEY, newFormat);
    } catch {
      // localStorage unavailable — preference applies in-memory only
    }
  }, []);

  return [format, setFormat];
}
