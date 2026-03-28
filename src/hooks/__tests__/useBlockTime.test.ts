import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockTime } from '../useBlockTime';

describe('useBlockTime', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const config = { blockMinutes: 90, startMinute: 0 };

  it('returns valid state', () => {
    const { result } = renderHook(() => useBlockTime(config));
    expect(result.current.currentBlock.globalBlock).toBeGreaterThanOrEqual(1);
    expect(result.current.progress).toBeGreaterThanOrEqual(0);
    expect(result.current.progress).toBeLessThanOrEqual(100);
    expect(result.current.currentDate).toBeInstanceOf(Date);
  });

  it('cleans up interval on unmount', () => {
    const spy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useBlockTime(config));
    unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
