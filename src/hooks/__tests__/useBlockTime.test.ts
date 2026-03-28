import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBlockTime } from '../useBlockTime';

describe('useBlockTime', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const config = { blockMinutes: 90, subBlockMinutes: 15 };

  it('returns valid state', () => {
    const { result } = renderHook(() => useBlockTime(config));
    expect(result.current.current.block).toBeGreaterThanOrEqual(1);
    expect(result.current.current.subBlock).toBeGreaterThanOrEqual(1);
    expect(result.current.progress).toBeGreaterThanOrEqual(0);
    expect(result.current.progress).toBeLessThanOrEqual(100);
  });

  it('cleans up on unmount', () => {
    const spy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useBlockTime(config));
    unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
