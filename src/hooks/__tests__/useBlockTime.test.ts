import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHexTime } from '../useBlockTime';

describe('useHexTime', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns valid hex time', () => {
    const { result } = renderHook(() => useHexTime());
    expect(result.current.current.hex).toHaveLength(3);
    expect(result.current.currentDate).toBeInstanceOf(Date);
  });

  it('cleans up on unmount', () => {
    const spy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useHexTime());
    unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
