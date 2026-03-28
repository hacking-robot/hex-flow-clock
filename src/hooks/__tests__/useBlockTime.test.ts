import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockTime } from '../useBlockTime';

// Unit tests for useBlockTime hook
// Validates: Requirements 2.1, 2.2

describe('useBlockTime - returns valid BlockTimeState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns currentBlock with hour in [0,23]', () => {
    const { result } = renderHook(() => useBlockTime('12h'));
    expect(result.current.currentBlock.hour).toBeGreaterThanOrEqual(0);
    expect(result.current.currentBlock.hour).toBeLessThanOrEqual(23);
  });

  it('returns currentBlock with blockNumber in [1,4]', () => {
    const { result } = renderHook(() => useBlockTime('12h'));
    expect(result.current.currentBlock.blockNumber).toBeGreaterThanOrEqual(1);
    expect(result.current.currentBlock.blockNumber).toBeLessThanOrEqual(4);
  });

  it('returns progress in [0,100]', () => {
    const { result } = renderHook(() => useBlockTime('24h'));
    expect(result.current.progress).toBeGreaterThanOrEqual(0);
    expect(result.current.progress).toBeLessThanOrEqual(100);
  });

  it('returns currentDate as a Date instance', () => {
    const { result } = renderHook(() => useBlockTime('12h'));
    expect(result.current.currentDate).toBeInstanceOf(Date);
  });

  it('returns blockStartMinute as one of 0, 15, 30, 45', () => {
    const { result } = renderHook(() => useBlockTime('12h'));
    expect([0, 15, 30, 45]).toContain(result.current.currentBlock.blockStartMinute);
  });
});

describe('useBlockTime - updates on block boundary', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates state when time advances past a block boundary', () => {
    // Set time to 10:14:55 — 5 seconds before block boundary at :15
    vi.setSystemTime(new Date(2024, 0, 1, 10, 14, 55));

    const { result } = renderHook(() => useBlockTime('24h'));

    expect(result.current.currentBlock.blockNumber).toBe(1);
    expect(result.current.currentBlock.hour).toBe(10);

    // Advance 6 seconds to cross into block 2 (10:15:01)
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(result.current.currentBlock.blockNumber).toBe(2);
    expect(result.current.currentBlock.blockStartMinute).toBe(15);
  });

  it('updates progress as time advances within a block', () => {
    vi.setSystemTime(new Date(2024, 0, 1, 14, 0, 0));

    const { result } = renderHook(() => useBlockTime('12h'));

    const initialProgress = result.current.progress;

    // Advance 60 seconds
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    // Progress should have increased
    expect(result.current.progress).toBeGreaterThan(initialProgress);
  });
});

describe('useBlockTime - cleans up interval on unmount', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls clearInterval when the hook unmounts', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = renderHook(() => useBlockTime('12h'));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });
});
