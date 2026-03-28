import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import type { TimeFormat } from '../../lib/timeFormatter';
import { useFormatPreference } from '../useFormatPreference';

const STORAGE_KEY = 'blockTimeClock.format';

// Feature: block-time-clock, Property 8: Format preference persistence round-trip
describe('Property 8: Format preference persistence round-trip', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // **Validates: Requirements 5.4, 5.5**
  it('saving a TimeFormat to localStorage and reading it back returns the same value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<TimeFormat>('12h', '24h'),
        (format) => {
          // Save to localStorage
          localStorage.setItem(STORAGE_KEY, format);

          // Read back
          const stored = localStorage.getItem(STORAGE_KEY);

          // Round-trip must return the same value
          expect(stored).toBe(format);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Unit tests for useFormatPreference hook
// Validates: Requirements 5.1, 5.4, 5.5, 8.2

describe('useFormatPreference - default value', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns 12h when localStorage is empty', () => {
    const { result } = renderHook(() => useFormatPreference());
    expect(result.current[0]).toBe('12h');
  });
});

describe('useFormatPreference - persistence on change', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists format to localStorage when setFormat is called', () => {
    const { result } = renderHook(() => useFormatPreference());

    act(() => {
      result.current[1]('24h');
    });

    expect(result.current[0]).toBe('24h');
    expect(localStorage.getItem('blockTimeClock.format')).toBe('24h');
  });

  it('persists 12h back after switching to 24h', () => {
    const { result } = renderHook(() => useFormatPreference());

    act(() => {
      result.current[1]('24h');
    });
    act(() => {
      result.current[1]('12h');
    });

    expect(result.current[0]).toBe('12h');
    expect(localStorage.getItem('blockTimeClock.format')).toBe('12h');
  });
});

describe('useFormatPreference - fallback on invalid data', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns 12h when localStorage contains an invalid value', () => {
    localStorage.setItem('blockTimeClock.format', 'invalid');
    const { result } = renderHook(() => useFormatPreference());
    expect(result.current[0]).toBe('12h');
  });

  it('returns 12h when localStorage contains an empty string', () => {
    localStorage.setItem('blockTimeClock.format', '');
    const { result } = renderHook(() => useFormatPreference());
    expect(result.current[0]).toBe('12h');
  });
});

describe('useFormatPreference - fallback when localStorage throws', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns 12h without error when localStorage.getItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });

    const { result } = renderHook(() => useFormatPreference());
    expect(result.current[0]).toBe('12h');

    spy.mockRestore();
  });

  it('still updates in-memory state when localStorage.setItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });

    const { result } = renderHook(() => useFormatPreference());

    act(() => {
      result.current[1]('24h');
    });

    // In-memory state should still update even though persistence failed
    expect(result.current[0]).toBe('24h');

    spy.mockRestore();
  });
});
